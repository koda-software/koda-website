import { CounterpartyError, VIES_API, VIES_NUMBER_PATTERN, isViesCountry, parseViesResponse } from "@/lib/tools/counterparty";
import { guardRequest } from "@/lib/tools/counterparty-guard";
import { isValidNip } from "@/lib/tools/white-list";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

/**
 * One EU VAT number checked in VIES: `?country=DE&number=811569869`.
 *
 * VIES sends no CORS headers, so the browser can't ask it directly. Every check is a
 * timestamped fact for the printout, so nothing is cached. The number is never logged,
 * no cookies are forwarded, and VIES's own error text never reaches the client: only the
 * parsed result, where an outage reads "unavailable", never "invalid".
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const country = (params.get("country") ?? "").toUpperCase();
  const number = (params.get("number") ?? "").toUpperCase().replace(/[\s\-.]/g, "");

  if (!isViesCountry(country) || !VIES_NUMBER_PATTERN.test(number) || (country === "PL" && !isValidNip(number))) {
    return Response.json({ error: "query" }, { status: 400, headers: noStore });
  }

  const limited = guardRequest(request, "vies");
  if (limited) return limited;

  let response: Response;
  try {
    response = await fetch(`${VIES_API}/ms/${country}/vat/${encodeURIComponent(number)}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    return Response.json({ error: "unavailable" }, { status: 502, headers: noStore });
  }

  // Errors may come as HTTP 200 with `userError`, or as an error status with `errorWrappers`.
  const body = await response.json().catch(() => null);
  try {
    return Response.json(parseViesResponse(body, country, number), { headers: noStore });
  } catch (error) {
    if (!(error instanceof CounterpartyError)) throw error;
    return Response.json({ error: "unavailable" }, { status: 502, headers: noStore });
  }
}
