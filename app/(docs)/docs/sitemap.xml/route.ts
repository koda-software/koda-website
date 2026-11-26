import { renderDocsSitemap } from "@/lib/docs/sitemap";

export const dynamic = "force-static";

/**
 * The same document at the URL the docs used before the move. /docs-sitemap.xml is the canonical
 * address (robots.txt, llms.txt); this alias stays 200 for search consoles that still have it submitted.
 */
export function GET() {
  return new Response(renderDocsSitemap(), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
