import { EDeliveryError, isValidRegon, preferCurrentFirms, trimRegon } from "@/lib/tools/e-delivery";
import { ceidgQueryUrl, ceidgToken, fetchCeidgRecords } from "@/lib/tools/ceidg-server";
import { toCeidgCheck, type CeidgCheck } from "@/lib/tools/counterparty";
import { guardRequest } from "@/lib/tools/counterparty-guard";
import { isValidNip } from "@/lib/tools/white-list";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

/**
 * A sole trader's CEIDG entry for the counterparty check, by NIP or REGON.
 *
 * Returns only `CeidgCheck`: the firm name, NIP, REGON, town, status, dates, main PKD and
 * ADE. Never the street (often a home), the correspondence address, e-mail, citizenship
 * or owner fields. `fetchedAt` travels in the body, so an answer the CDN kept for a few
 * minutes still prints the time it was really read. Nothing is logged.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const nip = params.get("nip")?.replace(/\D/g, "") ?? "";
  const regon = trimRegon(params.get("regon")?.replace(/\D/g, "") ?? "");

  if (nip ? !isValidNip(nip) : !isValidRegon(regon)) return Response.json({ error: "query" }, { status: 400, headers: noStore });

  const token = ceidgToken();
  if (!token) return Response.json({ error: "unavailable" }, { status: 503, headers: noStore });

  const limited = guardRequest(request, "ceidg");
  if (limited) return limited;

  try {
    const records = await fetchCeidgRecords(ceidgQueryUrl(nip ? { nip } : { regon }), token);
    const items = preferCurrentFirms(records.map(toCeidgCheck).filter((firm): firm is CeidgCheck => firm !== null));
    return Response.json({ items, fetchedAt: new Date().toISOString() }, { headers: { "Cache-Control": "public, s-maxage=600" } });
  } catch (error) {
    const limit = error instanceof EDeliveryError && error.reason === "limit";
    return Response.json({ error: limit ? "limit" : "unavailable" }, { status: limit ? 429 : 502, headers: noStore });
  }
}
