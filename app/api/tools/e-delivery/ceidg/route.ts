import { CEIDG_API, EDeliveryError, isCeidgDeleted, isValidRegon, parseCeidgResponse, preferCurrentFirms, trimRegon, type CeidgEntry, type CeidgFirm } from "@/lib/tools/e-delivery";
import { isValidNip } from "@/lib/tools/white-list";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

/**
 * Sole traders' addresses for electronic delivery from CEIDG, by NIP or REGON.
 *
 * The CEIDG API needs KodaSoft's token, so this proxy keeps it on the server and returns
 * only the firm name, NIP, REGON, town, status and ADE: the data art. 60 of the e-Delivery
 * act makes public. Nothing is logged, neither the number nor the token.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const nip = params.get("nip")?.replace(/\D/g, "") ?? "";
  const regon = trimRegon(params.get("regon")?.replace(/\D/g, "") ?? "");

  if (nip ? !isValidNip(nip) : !isValidRegon(regon)) return Response.json({ error: "query" }, { status: 400, headers: noStore });

  const token = process.env.CEIDG_API_TOKEN;
  if (!token) return Response.json({ error: "unavailable" }, { status: 503, headers: noStore });

  try {
    const entries = await ceidg(`${CEIDG_API}/firma?${nip ? `nip=${nip}` : `regon=${regon}`}`, token);
    const firms = await Promise.all(preferCurrentFirms(entries).map((entry) => withDetails(entry, token)));

    return Response.json({ items: firms.map(publicFields) }, { headers: { "Cache-Control": "public, s-maxage=3600" } });
  } catch (error) {
    const reason = error instanceof EDeliveryError ? error.reason : "unavailable";
    const status = reason === "limit" ? 429 : 502;
    return Response.json({ error: reason === "limit" ? "limit" : "unavailable" }, { status, headers: noStore });
  }
}

async function ceidg(url: string, token: string): Promise<CeidgEntry[]> {
  let response: Response;
  try {
    response = await fetch(url, { cache: "no-store", headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }, signal: AbortSignal.timeout(10_000) });
  } catch {
    throw new EDeliveryError("network");
  }

  // CEIDG answers 204 or 404 when nothing matches.
  if (response.status === 204 || response.status === 404) return [];
  if (response.status === 429) throw new EDeliveryError("limit");
  if (!response.ok) throw new EDeliveryError("unavailable");

  const body = await response.json().catch(() => null);
  return parseCeidgResponse(body);
}

/**
 * `/firma?nip=` already returns full records, so this only matters for summary entries:
 * one without an ADE gets one look at its detail record. Deleted entries are not followed.
 */
async function withDetails(entry: CeidgEntry, token: string): Promise<CeidgEntry> {
  if (entry.ade || !entry.detailUrl || isCeidgDeleted(entry)) return entry;
  try {
    const [detail] = await ceidg(entry.detailUrl, token);
    return detail ? { ...entry, ade: detail.ade, publicUrl: entry.publicUrl ?? detail.publicUrl } : entry;
  } catch {
    return entry;
  }
}

function publicFields({ name, nip, regon, town, status, ade, publicUrl }: CeidgEntry): CeidgFirm {
  return { name, nip, regon, town, status, ade, publicUrl };
}
