/**
 * A small per-address limit for the counterparty routes (VIES and CEIDG), which call
 * upstream registers from KodaSoft's servers: 30 requests per 10 minutes per address.
 *
 * In memory, so per function instance: it stops one visitor or script from draining the
 * shared CEIDG token or tripping VIES throttling, not a distributed attack. Addresses are
 * kept only as a salted hash, for at most the window, and are never logged.
 */
import { createHash, randomBytes } from "node:crypto";

const LIMIT = 30;
const WINDOW_MS = 10 * 60_000;
const MAX_KEYS = 5000;
const salt = randomBytes(16).toString("hex");
const buckets = new Map<string, { count: number; resetAt: number }>();

function keyOf(scope: string, address: string) {
  return createHash("sha256").update(`${salt}:${scope}:${address}`).digest("base64url");
}

/** True when this address may make one more request in `scope` now. */
export function takeToken(scope: string, address: string, now = Date.now()): boolean {
  if (buckets.size > MAX_KEYS) {
    for (const [key, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(key);
    // Still full of live entries: start over rather than grow without bound.
    if (buckets.size > MAX_KEYS) buckets.clear();
  }

  const key = keyOf(scope, address);
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (bucket.count >= LIMIT) return false;
  bucket.count += 1;
  return true;
}

/** The caller's address as Vercel reports it: the first `x-forwarded-for` entry, else `x-real-ip`. */
export function clientAddress(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Null when the request may go ahead, otherwise the 429 to return. */
export function guardRequest(request: Request, scope: string): Response | null {
  if (takeToken(scope, clientAddress(request))) return null;
  return Response.json({ error: "limit" }, { status: 429, headers: { "Cache-Control": "no-store", "Retry-After": "600" } });
}
