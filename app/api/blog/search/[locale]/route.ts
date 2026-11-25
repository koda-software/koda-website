import { getAllArticles } from "@/lib/blog/queries";
import { articlePath, blogLocales, isBlogLocale } from "@/lib/blog/routes";

export const runtime = "nodejs";
export const dynamic = "force-static";

export function generateStaticParams() {
  return blogLocales.map((locale) => ({ locale }));
}

/**
 * The search box's index: one small static document per language, fetched the
 * first time someone focuses the box. It is built from the same tagged read as
 * the listing, so the CMS webhook refreshes it with the pages. Robots are kept
 * out of /api/ already; the header is for anything that ignores robots.txt.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isBlogLocale(locale)) {
    return new Response("Not found", { status: 404 });
  }

  const articles = await getAllArticles(locale);

  return Response.json(
    articles.map((article) => ({
      title: article.tytul,
      lead: article.zajawka ?? "",
      category: article.kategoria_nazwa ?? "",
      href: articlePath(locale, article.slug),
    })),
    { headers: { "X-Robots-Tag": "noindex" } },
  );
}
