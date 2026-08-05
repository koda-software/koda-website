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

/**
 * Raw request against the Opero API. Caching is deliberately disabled here so
 * that the `unstable_cache` wrappers in `queries.ts` are the only cache layer.
 */
export async function operoFetch(path: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${requireApiKey()}`,
      ...init?.headers,
    },
  });

  return response;
}

async function operoJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await operoFetch(path, init);

  if (!response.ok) {
    const body = await response.text().catch(() => "");
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

export async function getRecords<T>(objectKey: string): Promise<T[]> {
  const values: T[] = [];

  for (let page = 1; page <= recordPageCap; page += 1) {
    const response = await operoJson<RecordListResponse<T>>(
      `/v1/custom-modules/blog/objects/${objectKey}/records?limit=${recordPageLimit}&page=${page}`,
    );

    values.push(...response.data.map((record) => record.values));

    if (response.data.length < recordPageLimit) {
      break;
    }
  }

  return values;
}

export async function getSingletonValues<T>(objectKey: string): Promise<T | null> {
  const response = await operoJson<SingletonResponse<T>>(`/v1/custom-modules/blog/objects/${objectKey}/record`);

  return response.data?.values ?? null;
}
