import { EDeliveryError, isValidRegon, preferCurrentFirms, trimRegon, type CeidgEntry, type CeidgFirm } from "@/lib/tools/e-delivery";
import { ceidgQueryUrl, ceidgToken, fetchCeidgEntries, withAdeDetails } from "@/lib/tools/ceidg-server";
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

  const token = ceidgToken();
  if (!token) return Response.json({ error: "unavailable" }, { status: 503, headers: noStore });

  try {
    const entries = await fetchCeidgEntries(ceidgQueryUrl(nip ? { nip } : { regon }), token);
    const firms = await Promise.all(preferCurrentFirms(entries).map((entry) => withAdeDetails(entry, token)));

    return Response.json({ items: firms.map(publicFields) }, { headers: { "Cache-Control": "public, s-maxage=3600" } });
  } catch (error) {
    const reason = error instanceof EDeliveryError ? error.reason : "unavailable";
    const status = reason === "limit" ? 429 : 502;
    return Response.json({ error: reason === "limit" ? "limit" : "unavailable" }, { status, headers: noStore });
  }
}

function publicFields({ name, nip, regon, town, status, ade, publicUrl }: CeidgEntry): CeidgFirm {
  return { name, nip, regon, town, status, ade, publicUrl };
}
