import { filterPublishedRows, getSitemapEntries } from "@/lib/blog/queries";
import { authorPath, blogIndexPath, blogLocales, categoryPath, sitemapRowPaths, tagPath } from "@/lib/blog/routes";
import type { BlogLocale, SitemapRow } from "@/lib/blog/types";
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

type Entry = { lastmod: string; alternates?: Record<string, string> };

/**
 * Taxonomy URLs share one slug across locales, so their hreflang set is
 * deterministic. Article slugs are translated per language and live in the CMS
 * translation group, which `blog_sitemap` does not expose — those carry
 * page-level `<link rel="alternate">` instead, which search engines treat as
 * equally authoritative.
 */
function taxonomyAlternates(row: SitemapRow): Record<string, string> | undefined {
  const build: Partial<Record<SitemapRow["typ"], (locale: BlogLocale, slug: string) => string>> = {
    kategoria: categoryPath,
    tag: tagPath,
    autor: authorPath,
  };
  const toPath = build[row.typ];

  if (!toPath) return undefined;

  const alternates = Object.fromEntries(blogLocales.map((locale) => [locale, absoluteUrl(toPath(locale, row.slug))]));

  return { ...alternates, "x-default": absoluteUrl(toPath("en", row.slug)) };
}

function indexAlternates(): Record<string, string> {
  return {
    ...Object.fromEntries(blogLocales.map((locale) => [locale, absoluteUrl(blogIndexPath(locale))])),
    "x-default": absoluteUrl(blogIndexPath("en")),
  };
}

export async function GET() {
  // Scheduled articles must not be advertised before their publication time.
  const rows = filterPublishedRows(await getSitemapEntries());
  const entries = new Map<string, Entry>();
  const newestArticle = rows
    .filter((row) => row.typ === "artykul")
    .reduce<string | null>((newest, row) => (!newest || row.lastmod > newest ? row.lastmod : newest), null);

  for (const locale of blogLocales) {
    entries.set(absoluteUrl(blogIndexPath(locale)), {
      // The index changes when its newest article does, not when we deploy.
      lastmod: newestArticle ?? new Date().toISOString(),
      alternates: indexAlternates(),
    });
  }

  for (const row of rows) {
    for (const path of sitemapRowPaths(row)) {
      const url = absoluteUrl(path);
      const existing = entries.get(url);

      if (!existing || existing.lastmod < row.lastmod) {
        entries.set(url, { lastmod: row.lastmod, alternates: taxonomyAlternates(row) });
      }
    }
  }

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...[...entries].map(([url, entry]) => {
      const alternates = Object.entries(entry.alternates ?? {})
        .map(([hreflang, href]) => `<xhtml:link rel="alternate" hreflang="${hreflang}" href="${xmlEscape(href)}"/>`)
        .join("");

      return `  <url><loc>${xmlEscape(url)}</loc><lastmod>${xmlEscape(entry.lastmod)}</lastmod>${alternates}</url>`;
    }),
    "</urlset>",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
