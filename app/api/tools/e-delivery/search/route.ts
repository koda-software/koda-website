import { isValidRegon } from "@/lib/tools/e-delivery";
import { searchByRegon, searchByText } from "@/lib/tools/e-delivery-search";
import { loadIndex } from "@/lib/tools/e-delivery-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_SIZE = 10;
const MAX_OFFSET = 50;

/**
 * Searches the gov.pl list of public entities by name (`q`) or REGON (`regon`).
 *
 * The query is never logged or stored. The CDN caches responses by URL for a few minutes,
 * which absorbs popular queries.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const q = params.get("q")?.trim() ?? "";
  const regon = params.get("regon")?.trim() ?? "";
  const offset = Math.min(Math.max(Number.parseInt(params.get("offset") ?? "0", 10) || 0, 0), MAX_OFFSET);

  if (regon ? !isValidRegon(regon) : q.length < 2 || q.length > 100) {
    return Response.json({ error: "query" }, { status: 400, headers: { "Cache-Control": "no-store" } });
  }

  let loaded;
  try {
    loaded = await loadIndex();
  } catch (error) {
    // Only the reason the list could not load, never the query.
    console.error(`e-delivery list unavailable: ${error instanceof Error ? error.message : String(error)}`);
    return Response.json({ error: "unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }

  const found = regon ? paged(searchByRegon(loaded.index, regon), offset) : searchByText(loaded.index, q, offset, PAGE_SIZE);

  return Response.json(
    {
      listDate: loaded.listDate,
      total: found.total,
      offset,
      items: found.items.map(({ name, town, voivodeship, regon: rowRegon, ade }) => ({ name, town, voivodeship, regon: rowRegon, ade })),
    },
    { headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" } },
  );
}

function paged<T>(rows: T[], offset: number) {
  return { total: rows.length, items: rows.slice(offset, offset + PAGE_SIZE) };
}
