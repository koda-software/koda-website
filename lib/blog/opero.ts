import { createHash } from "node:crypto";
import { unstable_cache } from "next/cache";
import { BLOG_TAG, blogTag } from "./tags";

/**
 * Low-level Opero API client. Never import this from a Client Component — the
 * bearer token would end up in the browser bundle.
 */
if (typeof window !== "undefined") {
  throw new Error("lib/blog/opero is server-only and must not be imported from client code.");
}

const apiBase = (process.env.OPERO_API_BASE || "https://api.kodasoft.pl").replace(/\/$/, "");

export class OperoApiError extends Error {
  constructor(
    readonly status: number,
    readonly path: string,
    readonly bodySnippet: string,
  ) {
    super(`Opero API ${status} for ${path}: ${bodySnippet}`);
    this.name = "OperoApiError";
  }
}

export function requireApiKey() {
  const apiKey = process.env.OPERO_API_KEY;

  if (!apiKey) {
    throw new Error("OPERO_API_KEY is not set. The blog cannot be built or rendered without it.");
  }

  return apiKey;
}

export function requireCompanyId() {
  const companyId = process.env.OPERO_COMPANY_ID;

  if (!companyId) {
    throw new Error("OPERO_COMPANY_ID is not set. The blog image proxy cannot resolve files without it.");
  }

  return companyId;
}

/** Upstream states that are worth retrying rather than failing the build over. */
const retryableStatuses = new Set([408, 425, 429, 500, 502, 503, 504]);
const maxAttempts = 6;
const maxBackoffMs = 70_000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Caps how many requests this process has in flight at once.
 *
 * `next build` runs ~23 worker processes in parallel, and the blog now
 * prerenders ~110 pages. Without a cap the origin sees a burst of several
 * hundred requests in a couple of seconds and nginx starts returning 503, which
 * fails the whole build. Four in flight per worker keeps the site building fast
 * while staying well inside what the origin will absorb.
 */
const maxConcurrent = 4;
let inFlight = 0;
const waiting: Array<() => void> = [];

async function acquireSlot() {
  if (inFlight < maxConcurrent) {
    inFlight += 1;
    return;
  }

  await new Promise<void>((resolve) => waiting.push(resolve));
  inFlight += 1;
}

function releaseSlot() {
  inFlight -= 1;
  waiting.shift()?.();
}

/**
 * Collapses concurrent identical GETs within one process.
 *
 * Every page reads the settings singleton for its metadata, so a cold build
 * would otherwise request it once per page per worker. `unstable_cache` dedupes
 * across runs but not across simultaneous first-callers.
 */
const inFlightGets = new Map<string, Promise<Response>>();

/**
 * How long to wait before retrying.
 *
 * The API rate-limits at 500 requests/minute and advertises the window via
 * `retry-after` / `x-ratelimit-reset`. Exponential backoff alone tops out well
 * inside that window, so when the server tells us when to come back, we listen —
 * otherwise a large build would burn its attempts and fail on a limit that
 * clears in under a minute.
 */
function retryDelayMs(response: Response | null, attempt: number) {
  const advertised = response?.headers.get("retry-after") ?? response?.headers.get("x-ratelimit-reset");
  const seconds = advertised ? Number(advertised) : Number.NaN;

  if (Number.isFinite(seconds) && seconds > 0) {
    return Math.min(seconds * 1000 + 250, maxBackoffMs);
  }

  // 400ms, 800ms, 1600ms… plus jitter so parallel build workers desynchronise.
  return Math.min(400 * 2 ** (attempt - 1) + Math.floor(Math.random() * 400), maxBackoffMs);
}

/**
 * Raw request against the Opero API. Caching is deliberately disabled here so
 * that the `unstable_cache` wrappers in `queries.ts` are the only cache layer.
 *
 * Concurrency is capped and identical in-flight GETs are shared, because
 * `next build` fans out across many workers. Transient failures are retried
 * with jittered, rate-limit-aware backoff; a genuine outage still fails the
 * build once the attempts are exhausted, which is the behaviour we want for a
 * content site.
 */
export async function operoFetch(path: string, init?: RequestInit): Promise<Response> {
  const isGet = !init?.method || init.method.toUpperCase() === "GET";

  if (!isGet) {
    return requestWithRetry(path, init);
  }

  const pending = inFlightGets.get(path);

  if (pending) {
    // Response bodies can only be read once, so hand each caller its own clone.
    return (await pending).clone();
  }

  const request = requestWithRetry(path, init).finally(() => inFlightGets.delete(path));
  inFlightGets.set(path, request);

  return (await request).clone();
}

async function requestWithRetry(path: string, init?: RequestInit): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    let response: Response | null = null;

    try {
      await acquireSlot();

      try {
        response = await fetch(`${apiBase}${path}`, {
          ...init,
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${requireApiKey()}`,
            ...init?.headers,
          },
        });
      } finally {
        releaseSlot();
      }

      if (!retryableStatuses.has(response.status) || attempt === maxAttempts) {
        return response;
      }
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts) break;
    }

    await sleep(retryDelayMs(response, attempt));
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`Opero API request to ${path} failed after ${maxAttempts} attempts.`);
}

/**
 * Identifies the credential without disclosing it, so a 401 in a build log says
 * whether the deploy holds the key we think it does. Length and hash together
 * catch the usual damage: a stale value, a truncated paste, wrapping quotes.
 */
function keyFingerprint() {
  const apiKey = process.env.OPERO_API_KEY ?? "";
  const digest = createHash("sha256").update(apiKey).digest("hex").slice(0, 12);

  return `len=${apiKey.length} sha256:12=${digest}`;
}

async function operoJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await operoFetch(path, init);

  if (!response.ok) {
    const body = await response.text().catch(() => "");

    if (response.status === 401 || response.status === 403) {
      throw new OperoApiError(response.status, path, `${body.slice(0, 240)} [OPERO_API_KEY ${keyFingerprint()}]`);
    }

    throw new OperoApiError(response.status, path, body.slice(0, 240));
  }

  return (await response.json()) as T;
}

type SavedQueryListResponse = {
  data: Array<{ id: string; key: string }>;
};

type SavedQueryExecuteResponse<T> = {
  data: { rows: T[]; rowCount: number; hasMore: boolean };
};

type RecordListResponse<T> = {
  data: Array<{ id: string; createdAt: string; updatedAt: string; values: T }>;
  meta?: { total?: number };
};

type SingletonResponse<T> = {
  data: { id: string; values: T } | null;
};

/**
 * Saved queries are addressed by opaque id, so we resolve the stable `key` →
 * `id` map once and cache it under its own tag.
 */
const getQueryIdMap = unstable_cache(
  async (): Promise<Record<string, string>> => {
    const response = await operoJson<SavedQueryListResponse>("/v1/saved-queries?limit=100");

    return Object.fromEntries(response.data.map((query) => [query.key, query.id]));
  },
  ["blog", "query-id-map"],
  { tags: [BLOG_TAG, blogTag("querymap")] },
);

export async function executeSavedQuery<T>(key: string, params: Record<string, unknown> = {}): Promise<T[]> {
  const idMap = await getQueryIdMap();
  const id = idMap[key];

  if (!id) {
    throw new Error(`Opero saved query "${key}" does not exist. Known keys: ${Object.keys(idMap).join(", ")}`);
  }

  const response = await operoJson<SavedQueryExecuteResponse<T>>(`/v1/saved-queries/${id}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ params }),
  });

  return response.data?.rows ?? [];
}

/** The record API caps `limit` at 100, so taxonomy reads walk every page. */
const recordPageLimit = 100;
const recordPageCap = 20;

export type BlogRecord<T> = { values: T; updatedAt: string };

/** Records with their `updatedAt`, which the sitemap needs for `<lastmod>`. */
export async function getRecordsWithMeta<T>(objectKey: string): Promise<Array<BlogRecord<T>>> {
  const records: Array<BlogRecord<T>> = [];

  for (let page = 1; page <= recordPageCap; page += 1) {
    const response = await operoJson<RecordListResponse<T>>(
      `/v1/custom-modules/blog/objects/${objectKey}/records?limit=${recordPageLimit}&page=${page}`,
    );

    records.push(...response.data.map((record) => ({ values: record.values, updatedAt: record.updatedAt })));

    if (response.data.length < recordPageLimit) {
      break;
    }
  }

  return records;
}

export async function getRecords<T>(objectKey: string): Promise<T[]> {
  return (await getRecordsWithMeta<T>(objectKey)).map((record) => record.values);
}

export async function getSingletonValues<T>(objectKey: string): Promise<T | null> {
  const response = await operoJson<SingletonResponse<T>>(`/v1/custom-modules/blog/objects/${objectKey}/record`);

  return response.data?.values ?? null;
}
