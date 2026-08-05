import { locales, type Locale } from "@/lib/i18n/config";
import type { BlogLocale, SitemapRow } from "./types";

/**
 * URL builders for the blog. Archive segments are localized; the `blog` segment
 * itself is not, so `/pl/blog` and `/en/blog` stay symmetrical with the rest of
 * the site's `/{locale}/{page}` shape.
 */

export const blogLocales: BlogLocale[] = ["pl", "en"];

export const archiveSegments: Record<BlogLocale, { category: string; tag: string; author: string }> = {
  pl: { category: "kategoria", tag: "tag", author: "autor" },
  en: { category: "category", tag: "tag", author: "author" },
};

/** `/blog/page/2` — a static segment that shadows any article slug named "page". */
export const paginationSegment = "page";

/**
 * Parses the `n` in `/blog/page/[n]`.
 *
 * Rejects leading zeros and anything non-numeric so each page has exactly one
 * URL, and rejects `1` because page 1 is the index route. Note the digit class
 * is `[1-9][0-9]*`, not `[2-9][0-9]*` — the latter also rejects 10, 11, 12…
 */
export function parsePaginationSegment(value: string): number | null {
  if (!/^[1-9][0-9]*$/.test(value)) return null;

  const page = Number(value);

  return page >= 2 ? page : null;
}

export function isBlogLocale(value: string): value is BlogLocale {
  return value === "pl" || value === "en";
}

/** The CMS allows languages we do not publish (currently `de`); those rows are dropped. */
export function toBlogLocale(jezyk: string | null | undefined): BlogLocale | null {
  return jezyk && isBlogLocale(jezyk) ? jezyk : null;
}

export function blogIndexPath(locale: BlogLocale) {
  return `/${locale}/blog`;
}

export function blogPagePath(locale: BlogLocale, page: number) {
  return page <= 1 ? blogIndexPath(locale) : `/${locale}/blog/${paginationSegment}/${page}`;
}

export function articlePath(locale: BlogLocale, slug: string) {
  return `/${locale}/blog/${slug}`;
}

export function categoryPath(locale: BlogLocale, slug: string) {
  return `/${locale}/blog/${archiveSegments[locale].category}/${slug}`;
}

export function tagPath(locale: BlogLocale, slug: string) {
  return `/${locale}/blog/${archiveSegments[locale].tag}/${slug}`;
}

export function authorPath(locale: BlogLocale, slug: string) {
  return `/${locale}/blog/${archiveSegments[locale].author}/${slug}`;
}

/**
 * Site-wide `Locale` and `BlogLocale` happen to be the same union today; this
 * keeps the two type systems from leaking into each other.
 */
export function toSiteLocale(locale: BlogLocale): Locale {
  return locales.includes(locale) ? locale : "en";
}

/**
 * Absolute-path list for one sitemap row. Taxonomy rows carry `jezyk: null`
 * because a category/tag/author is shared across languages — those expand into
 * one path per published locale.
 */
export function sitemapRowPaths(row: SitemapRow): string[] {
  const rowLocale = toBlogLocale(row.jezyk);

  if (row.typ === "artykul") {
    return rowLocale ? [articlePath(rowLocale, row.slug)] : [];
  }

  const targets = rowLocale ? [rowLocale] : blogLocales;

  switch (row.typ) {
    case "kategoria":
      return targets.map((locale) => categoryPath(locale, row.slug));
    case "tag":
      return targets.map((locale) => tagPath(locale, row.slug));
    case "autor":
      return targets.map((locale) => authorPath(locale, row.slug));
    default:
      return [];
  }
}
