import { operoFetch, requireCompanyId } from "@/lib/blog/opero";
import { articleOgCard } from "@/lib/blog/og-image";
import { getArticleBySlug } from "@/lib/blog/queries";
import { isBlogLocale } from "@/lib/blog/routes";
import { renderBlogCard } from "@/lib/og/blog-card";

export const runtime = "nodejs";

/**
 * Rendered on the first request and then served from the cache like a
 * prerendered page, on Vercel from the ISR cache behind its CDN. The article
 * is read through the tagged `getArticleBySlug`, so the CMS webhook's `blog`
 * purge is what retires a card; nothing else re-renders it. No card is built at
 * deploy time: most are never requested, and each one costs a cover download.
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return [];
}

/**
 * The cover as bytes, or `null` when the CMS no longer has the file (the card
 * then falls back to the plain gradient). Any other failure throws, so a
 * passing outage is not cached as a card without its picture.
 */
async function downloadCover(fileId: string): Promise<Buffer | null> {
  const response = await operoFetch(`/v1/companies/${requireCompanyId()}/files/${fileId}/download`);

  if (response.status === 404 || response.status === 403) return null;
  if (!response.ok) throw new Error(`Cover ${fileId} download failed with ${response.status}.`);

  return Buffer.from(await response.arrayBuffer());
}

export async function GET(_request: Request, { params }: RouteContext<"/og/blog/[locale]/[slug]">) {
  const { locale, slug } = await params;
  const article = isBlogLocale(locale) ? await getArticleBySlug(slug, locale) : null;

  if (!article) {
    return new Response("Not found.", { status: 404 });
  }

  const { title, label, coverId } = articleOgCard(article);
  const card = await renderBlogCard({ title, label, cover: coverId ? await downloadCover(coverId) : null });

  return new Response(new Uint8Array(card), {
    headers: {
      "Content-Type": "image/jpeg",
      // A preview card, not a picture for image search.
      "X-Robots-Tag": "noindex",
    },
  });
}
