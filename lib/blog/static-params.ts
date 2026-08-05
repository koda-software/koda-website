import { filterPublishedRows, uncachedForBuild } from "./queries";
import { toBlogLocale } from "./routes";
import type { BlogLocale } from "./types";

/**
 * Build-time route enumeration. Slugs come from `blog_sitemap`; anything
 * published later renders on first visit (`dynamicParams` stays on) and is then
 * cached like every other page.
 *
 * These reads deliberately bypass `unstable_cache` — see `uncachedForBuild`.
 */

async function slugsOfType(typ: "artykul" | "kategoria" | "tag" | "autor", locale?: BlogLocale) {
  const rows = filterPublishedRows(await uncachedForBuild.sitemapEntries());

  return [
    ...new Set(
      rows
        .filter((row) => row.typ === typ)
        // Taxonomy rows carry no language and therefore exist in both locales.
        .filter((row) => !locale || row.jezyk === null || toBlogLocale(row.jezyk) === locale)
        .map((row) => row.slug),
    ),
  ];
}

export async function articleParams(locale: BlogLocale) {
  return (await slugsOfType("artykul", locale)).map((slug) => ({ slug }));
}

export async function categoryParams() {
  return (await slugsOfType("kategoria")).map((slug) => ({ slug }));
}

export async function tagParams() {
  return (await slugsOfType("tag")).map((slug) => ({ slug }));
}

export async function authorParams() {
  return (await slugsOfType("autor")).map((slug) => ({ slug }));
}

/** Pages 2..n of the main index; page 1 is the index route itself. */
export async function paginationParams(locale: BlogLocale) {
  const pageSize = await uncachedForBuild.pageSize();
  const total = await uncachedForBuild.articleTotal(locale, pageSize);
  const totalPages = Math.ceil(total / pageSize);

  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({ n: String(index + 2) }));
}
