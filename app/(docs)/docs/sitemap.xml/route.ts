import { renderDocsSitemap } from "@/lib/docs/sitemap";

export const dynamic = "force-static";

/** The same document at the URL the docs used before the move (docs llms.txt, search consoles). */
export function GET() {
  return new Response(renderDocsSitemap(), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
