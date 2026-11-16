import "server-only";
import { CEIDG_API, EDeliveryError, ceidgRecords, isCeidgDeleted, parseCeidgResponse, type CeidgEntry } from "./e-delivery";

/**
 * CEIDG (sole traders) on the server, with KodaSoft's token. Shared by the e-Doręczenia
 * and counterparty routes: one token, one fetch and one limit.
 *
 * Nothing here logs the number, the token or the answer. The raw records still hold the
 * owner's and address fields, so the routes reduce them before anything leaves the server.
 */

/** Undefined when the deployment has no token: the routes then answer 503. */
export function ceidgToken(): string | undefined {
  return process.env.CEIDG_API_TOKEN || undefined;
}

export function ceidgQueryUrl(query: { nip: string } | { regon: string }): string {
  return `${CEIDG_API}/firma?${"nip" in query ? `nip=${query.nip}` : `regon=${query.regon}`}`;
}

/**
 * The token's limit is shared by every visitor (`x-rate-limit-limit: 1000`, the window
 * unverified). When fewer than this many calls are left, the routes stop calling until
 * the reset time CEIDG sends, rather than run into its 429.
 */
const RESERVE = 20;
let pausedUntil = 0;

function notePause(response: Response) {
  const remaining = Number(response.headers.get("x-rate-limit-remaining"));
  const reset = Number(response.headers.get("x-rate-limit-reset"));
  const now = Date.now();
  if (Number.isFinite(remaining) && response.headers.has("x-rate-limit-remaining") && remaining < RESERVE) {
    // The reset is epoch milliseconds; never pause for more than an hour on a bad value.
    pausedUntil = Number.isFinite(reset) && reset > now ? Math.min(reset, now + 3_600_000) : now + 60_000;
  }
}

/** The raw firm records for one CEIDG URL. An empty list when nothing matches. */
export async function fetchCeidgRecords(url: string, token: string): Promise<Record<string, unknown>[]> {
  if (Date.now() < pausedUntil) throw new EDeliveryError("limit");

  let response: Response;
  try {
    response = await fetch(url, { cache: "no-store", headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }, signal: AbortSignal.timeout(10_000) });
  } catch {
    throw new EDeliveryError("network");
  }

  notePause(response);
  // CEIDG answers 204 or 404 when nothing matches.
  if (response.status === 204 || response.status === 404) return [];
  if (response.status === 429) throw new EDeliveryError("limit");
  if (!response.ok) throw new EDeliveryError("unavailable");

  const body = await response.json().catch(() => null);
  return ceidgRecords(body);
}

/** The firms for one CEIDG URL, as the e-Doręczenia tool reads them. */
export async function fetchCeidgEntries(url: string, token: string): Promise<CeidgEntry[]> {
  return parseCeidgResponse({ firma: await fetchCeidgRecords(url, token) });
}

/**
 * `/firma?nip=` already returns full records, so this only matters for summary entries:
 * one without an ADE gets one look at its detail record. Deleted entries are not followed.
 */
export async function withAdeDetails(entry: CeidgEntry, token: string): Promise<CeidgEntry> {
  if (entry.ade || !entry.detailUrl || isCeidgDeleted(entry)) return entry;
  try {
    const [detail] = await fetchCeidgEntries(entry.detailUrl, token);
    return detail ? { ...entry, ade: detail.ade, publicUrl: entry.publicUrl ?? detail.publicUrl } : entry;
  } catch {
    return entry;
  }
}
