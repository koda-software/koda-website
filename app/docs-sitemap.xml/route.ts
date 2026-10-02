import { renderDocsSitemap } from "@/lib/docs/sitemap";

export const dynamic = "force-static";

/** The docs pages, next to /sitemap.xml and /blog-sitemap.xml. Listed in robots.txt. */
export function GET() {
  return new Response(renderDocsSitemap(), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
