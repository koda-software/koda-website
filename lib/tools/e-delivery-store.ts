import "server-only";
import { createHash } from "node:crypto";
import { request } from "node:https";
import { gunzipSync, gzipSync } from "node:zlib";
import { del, get, list, put } from "@vercel/blob";
import { todayInPoland } from "./business-days";
import { GOV_REGISTER_PAGE } from "./e-delivery";
import { buildSnapshot, extractRegisterData, snapshotRows, validateRegister, type RegisterRow, type Snapshot } from "./e-delivery-register";
import { buildIndex, type SearchIndex } from "./e-delivery-search";

/**
 * Where the institutions list comes from on the server.
 *
 * With Vercel Blob (BLOB_READ_WRITE_TOKEN set), a daily cron writes a validated snapshot
 * and the search route reads it, checking the manifest at most every 10 minutes. Without
 * Blob, or before the first cron run, the server reads the gov.pl page itself, validates
 * it the same way and keeps the parsed list in memory for 6 hours. Either way a failed
 * refresh keeps the last good copy.
 *
 * The gov.pl page is 5.4 MB, over the 2 MB that Next's data cache accepts, so it is read
 * with node:https rather than fetch: that keeps it out of the data cache, and out of the
 * static/dynamic decision when the tool page reads the list at build time.
 */

const MANIFEST_PATH = "e-delivery/manifest.json";
const SNAPSHOT_PATH = "e-delivery/snapshot.json.gz";
const HISTORY_PREFIX = "e-delivery/snapshots/";
const HISTORY_KEEP = 10;
const USER_AGENT = "KodaSoft e-delivery sync";

const BLOB_CHECK_MS = 10 * 60 * 1000;
const DIRECT_REFRESH_MS = 6 * 60 * 60 * 1000;
const RETRY_AFTER_FAILURE_MS = 5 * 60 * 1000;

export type Manifest = {
  listDate: string;
  fileName: string;
  fetchedAt: string;
  checkedAt: string;
  etag: string | null;
  rows: number;
  sha256: string;
  lastError: string | null;
};

export type LoadedRegister = {
  index: SearchIndex;
  listDate: string;
  fileName: string;
  source: "blob" | "gov.pl";
  sha256: string;
  etag: string | null;
};

export function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/* ------------------------------------------------------------------ gov.pl page */

type HttpResponse = { status: number; headers: Record<string, string | string[] | undefined>; body: Buffer };

function httpGet(url: string, headers: Record<string, string>, redirects = 2): Promise<HttpResponse> {
  return new Promise((resolve, reject) => {
    const req = request(url, { method: "GET", headers, timeout: 30_000 }, (res) => {
      const location = res.headers.location;
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.statusCode !== 304 && location && redirects > 0) {
        res.resume();
        const next = new URL(location, url);
        if (next.protocol !== "https:" || !next.hostname.endsWith("gov.pl")) return reject(new Error(`redirect to ${next.hostname}`));
        return resolve(httpGet(next.toString(), headers, redirects - 1));
      }

      const chunks: Buffer[] = [];
      let size = 0;
      res.on("data", (chunk: Buffer) => {
        size += chunk.length;
        if (size > 40 * 1024 * 1024) req.destroy(new Error("response too large"));
        else chunks.push(chunk);
      });
      res.on("end", () => resolve({ status: res.statusCode ?? 0, headers: res.headers, body: Buffer.concat(chunks) }));
      res.on("error", reject);
    });
    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.on("error", reject);
    req.end();
  });
}

type PageResult = { notModified: true } | { notModified: false; html: string; etag: string | null };

export async function fetchRegisterPage(etag: string | null): Promise<PageResult> {
  const headers: Record<string, string> = { "user-agent": USER_AGENT, "accept-encoding": "gzip", accept: "text/html" };
  if (etag) headers["if-none-match"] = etag;

  const response = await httpGet(GOV_REGISTER_PAGE, headers);
  if (response.status === 304) return { notModified: true };
  if (response.status !== 200) throw new Error(`gov.pl HTTP ${response.status}`);

  const body = response.headers["content-encoding"] === "gzip" ? gunzipSync(response.body) : response.body;
  const responseEtag = response.headers.etag;
  return { notModified: false, html: body.toString("utf8"), etag: typeof responseEtag === "string" ? responseEtag : null };
}

/* ------------------------------------------------------------------ Blob */

async function readBlob(pathname: string): Promise<Buffer | null> {
  const result = await get(pathname, { access: "public", useCache: false });
  if (!result || result.statusCode !== 200) return null;
  return Buffer.from(await new Response(result.stream).arrayBuffer());
}

export async function readManifest(): Promise<Manifest | null> {
  const body = await readBlob(MANIFEST_PATH);
  return body ? (JSON.parse(body.toString("utf8")) as Manifest) : null;
}

async function writeBlob(pathname: string, body: Buffer | string, contentType: string) {
  await put(pathname, body, { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType, cacheControlMaxAge: 60 });
}

function writeManifest(manifest: Manifest) {
  return writeBlob(MANIFEST_PATH, JSON.stringify(manifest), "application/json");
}

function sha256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

async function pruneHistory() {
  const { blobs } = await list({ prefix: HISTORY_PREFIX, limit: 100 });
  const old = blobs.sort((a, b) => b.pathname.localeCompare(a.pathname)).slice(HISTORY_KEEP);
  if (old.length) await del(old.map((blob) => blob.url));
}

export type SyncResult =
  | { status: "updated" | "unchanged" | "not-modified"; manifest: Manifest }
  | { status: "failed"; error: string; manifest: Manifest | null };

/**
 * The cron job: read gov.pl (conditionally, with the last ETag), validate, and only then
 * replace the snapshot. A failure only records `lastError` on the manifest.
 */
export async function syncSnapshot(): Promise<SyncResult> {
  const manifest = await readManifest();
  const now = new Date().toISOString();

  try {
    const page = await fetchRegisterPage(manifest?.etag ?? null);

    if (page.notModified) {
      if (!manifest) throw new Error("304 without a stored copy");
      const next = { ...manifest, checkedAt: now, lastError: null };
      await writeManifest(next);
      return { status: "not-modified", manifest: next };
    }

    const data = extractRegisterData(page.html);
    const result = validateRegister(data, manifest?.rows ?? null, todayInPoland(), manifest?.listDate ?? null);
    if (!result.ok) throw new Error(result.error);

    const json = JSON.stringify(buildSnapshot(result.rows, data.fileName, result.listDate));
    const hash = sha256(json);
    const next: Manifest = {
      listDate: result.listDate,
      fileName: data.fileName,
      fetchedAt: manifest?.sha256 === hash ? manifest.fetchedAt : now,
      checkedAt: now,
      etag: page.etag,
      rows: result.rows.length,
      sha256: hash,
      lastError: null,
    };

    if (manifest?.sha256 === hash) {
      await writeManifest(next);
      return { status: "unchanged", manifest: next };
    }

    const gz = gzipSync(json, { level: 9 });
    await writeBlob(SNAPSHOT_PATH, gz, "application/gzip");
    await writeBlob(`${HISTORY_PREFIX}${result.listDate}.json.gz`, gz, "application/gzip");
    await writeManifest(next);
    await pruneHistory().catch(() => undefined);
    return { status: "updated", manifest: next };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (manifest) await writeManifest({ ...manifest, checkedAt: now, lastError: message }).catch(() => undefined);
    return { status: "failed", error: message, manifest };
  }
}

/* ------------------------------------------------------------------ the in-memory index */

let current: LoadedRegister | null = null;
let checkedAt = 0;
let failedAt = 0;
let inflight: Promise<LoadedRegister> | null = null;

function fromRows(rows: RegisterRow[], meta: Omit<LoadedRegister, "index">): LoadedRegister {
  return { index: buildIndex(rows), ...meta };
}

async function refreshFromBlob(): Promise<LoadedRegister | null> {
  const manifest = await readManifest();
  if (!manifest?.sha256) return null;
  if (current?.source === "blob" && current.sha256 === manifest.sha256) return current;

  const gz = await readBlob(SNAPSHOT_PATH);
  if (!gz) return null;
  const snapshot = JSON.parse(gunzipSync(gz).toString("utf8")) as Snapshot;
  return fromRows(snapshotRows(snapshot), { listDate: snapshot.listDate, fileName: snapshot.fileName, source: "blob", sha256: manifest.sha256, etag: manifest.etag });
}

async function refreshFromGov(): Promise<LoadedRegister> {
  const previous = current?.source === "gov.pl" ? current : null;
  const page = await fetchRegisterPage(previous?.etag ?? null);
  if (page.notModified && previous) return previous;
  if (page.notModified) throw new Error("304 without a copy in memory");

  const data = extractRegisterData(page.html);
  const result = validateRegister(data, current?.index.rows.length ?? null, todayInPoland(), current?.listDate ?? null);
  if (!result.ok) throw new Error(result.error);
  return fromRows(result.rows, { listDate: result.listDate, fileName: data.fileName, source: "gov.pl", sha256: "", etag: page.etag });
}

async function refresh(): Promise<LoadedRegister> {
  if (blobConfigured()) {
    try {
      const fromBlob = await refreshFromBlob();
      if (fromBlob) return fromBlob;
    } catch {
      /* Blob is unreachable or empty: read gov.pl instead. */
    }
  }
  return refreshFromGov();
}

/** The list and its search index, from Blob or gov.pl, refreshed in the background of requests. */
export async function loadIndex(): Promise<LoadedRegister> {
  const now = Date.now();
  const maxAge = current?.source === "blob" ? BLOB_CHECK_MS : DIRECT_REFRESH_MS;
  if (current && now - checkedAt < maxAge) return current;
  if (!current && failedAt && now - failedAt < 30_000) throw new Error("register unavailable");

  inflight ??= refresh().finally(() => {
    inflight = null;
  });

  try {
    current = await inflight;
    checkedAt = Date.now();
    return current;
  } catch (error) {
    failedAt = Date.now();
    if (current) {
      // Keep serving the last good copy and try again in a few minutes.
      checkedAt = Date.now() - maxAge + RETRY_AFTER_FAILURE_MS;
      return current;
    }
    throw error;
  }
}

/** The rows for each REGON, the shortest name first (the main office before its branches), or null when no list is available. */
export async function institutionsByRegon(regons: string[], timeoutMs = 25_000): Promise<{ listDate: string; rows: Map<string, RegisterRow> } | null> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  try {
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error("timeout")), timeoutMs);
    });
    const loaded = await Promise.race([loadIndex(), timeout]);
    const rows = new Map<string, RegisterRow>();
    for (const regon of regons) {
      const matches = (loaded.index.byRegon.get(regon) ?? []).map((rowIndex) => loaded.index.rows[rowIndex]);
      const best = matches.sort((a, b) => a.name.length - b.name.length)[0];
      if (best) rows.set(regon, best);
    }
    return rows.size ? { listDate: loaded.listDate, rows } : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
