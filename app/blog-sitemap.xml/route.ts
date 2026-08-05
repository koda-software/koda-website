import { getSitemapEntries } from "@/lib/blog/queries";
import { blogIndexPath, blogLocales, sitemapRowPaths } from "@/lib/blog/routes";
import { absoluteUrl } from "@/lib/seo/site";

export const runtime = "nodejs";
export const dynamic = "force-static";

/**
 * Every dynamic blog URL lives here rather than in the marketing sitemap, so it
 * refreshes with the CMS instead of only at deploy time. The underlying read is
 * tagged `blog`, so the revalidation webhook regenerates this document too.
 */
function xmlEscape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const rows = await getSitemapEntries();
  const entries = new Map<string, string>();

  for (const locale of blogLocales) {
    entries.set(absoluteUrl(blogIndexPath(locale)), new Date().toISOString());
  }

  for (const row of rows) {
    for (const path of sitemapRowPaths(row)) {
      const url = absoluteUrl(path);
      const existing = entries.get(url);

      if (!existing || existing < row.lastmod) {
        entries.set(url, row.lastmod);
      }
    }
  }

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...[...entries].map(
      ([url, lastmod]) => `  <url><loc>${xmlEscape(url)}</loc><lastmod>${xmlEscape(lastmod)}</lastmod></url>`,
    ),
    "</urlset>",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
