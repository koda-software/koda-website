import { unstable_cache } from "next/cache";
import { type BlogRecord, executeSavedQuery, getRecordsWithMeta, getSingletonValues } from "./opero";
import { BLOG_TAG, blogTag } from "./tags";
import type {
  ArticleFullRow,
  ArticleListRow,
  ArticlePage,
  AuthorArticleRow,
  AuthorRecord,
  BlogLocale,
  BlogSettings,
  CategoryRecord,
  Localized,
  RedirectRow,
  SitemapRow,
  SystemFeatureRow,
  TagRecord,
} from "./types";
import { blogLocales, sourceLocale } from "./routes";

/**
 * Every read is wrapped in `unstable_cache` and tagged, so pages prerender at
 * build time and stay cached until the Opero webhook purges the `blog` tag.
 */

export const fallbackPageSize = 12;

/**
 * Category, tag and author archives render a single page. The cap is generous
 * enough that truncation is implausible at the site's publishing volume; if it
 * ever becomes real, add `/page/[n]` under the archive segments.
 */
export const archivePageSize = 60;

function totalOf(rows: Array<{ total?: number | null }>, fallback: number) {
  const total = rows[0]?.total;
  return typeof total === "number" ? total : fallback;
}

/**
 * Whether an article is public *now*.
 *
 * Every article query already gates on `status = 'opublikowany' AND
 * data_publikacji <= now()`. A cached row, though, was gated when it was
 * written, so the site checks the date again here, outside `unstable_cache`,
 * against the current time, so "scheduled" keeps meaning "not public yet"
 * whatever a cache entry holds.
 */
export function isPublished(dataPublikacji: string | null | undefined): boolean {
  if (!dataPublikacji) return false;

  const publishedAt = new Date(dataPublikacji).getTime();

  return Number.isFinite(publishedAt) && publishedAt <= Date.now();
}

/** Drops article rows that are still scheduled; taxonomy rows always pass. */
export function filterPublishedRows(rows: SitemapRow[]): SitemapRow[] {
  return rows.filter((row) => row.typ !== "artykul" || isPublished(row.data_publikacji));
}

export const getSettings = unstable_cache(
  async (): Promise<BlogSettings | null> => getSingletonValues<BlogSettings>("ustawienia"),
  ["blog", "settings"],
  { tags: [BLOG_TAG, blogTag("settings")] },
);

export async function getPageSize(): Promise<number> {
  const settings = await getSettings();
  const size = settings?.artykulow_na_stronie;

  return typeof size === "number" && size > 0 ? size : fallbackPageSize;
}

const fetchArticles = unstable_cache(
  async (jezyk: BlogLocale, kategoriaSlug: string | null, limit: number, offset: number): Promise<ArticlePage> => {
    const rows = await executeSavedQuery<ArticleListRow>("blog_lista_artykulow", {
      jezyk,
      ...(kategoriaSlug ? { kategoria_slug: kategoriaSlug } : {}),
      limit_wierszy: limit,
      offset_wierszy: offset,
    });

    return { rows, total: totalOf(rows, rows.length) };
  },
  ["blog", "lista"],
  { tags: [BLOG_TAG, blogTag("lista")] },
);

export async function getArticles(options: {
  jezyk: BlogLocale;
  kategoriaSlug?: string | null;
  page?: number;
  pageSize?: number;
}): Promise<ArticlePage> {
  const pageSize = options.pageSize ?? (await getPageSize());
  const page = Math.max(1, options.page ?? 1);

  return fetchArticles(options.jezyk, options.kategoriaSlug ?? null, pageSize, (page - 1) * pageSize);
}

/** Active "Funkcja systemu" records in this locale, in their editors' order. */
export const getSystemFeatures = unstable_cache(
  async (jezyk: BlogLocale) => executeSavedQuery<SystemFeatureRow>("blog_funkcje_systemu", { jezyk }),
  ["blog", "funkcje"],
  { tags: [BLOG_TAG, blogTag("funkcje")] },
);

export async function getArticleBySlug(slug: string, jezyk: BlogLocale): Promise<ArticleFullRow | null> {
  const read = unstable_cache(
    async () => {
      const rows = await executeSavedQuery<ArticleFullRow>("blog_artykul_po_slug", { slug, jezyk });
      return rows[0] ?? null;
    },
    // Bump the version when the row's shape changes, so no cached row of the old shape is served.
    ["blog", "artykul", "v2", jezyk, slug],
    { tags: [BLOG_TAG, blogTag("artykul", slug)] },
  );

  const article = await read();

  return article && isPublished(article.data_publikacji) ? article : null;
}

const fetchArticlesByTag = unstable_cache(
  async (tagSlug: string, jezyk: BlogLocale, limit: number, offset: number): Promise<ArticlePage> => {
    const rows = await executeSavedQuery<ArticleListRow>("blog_artykuly_po_tagu", {
      tag_slug: tagSlug,
      jezyk,
      limit_wierszy: limit,
      offset_wierszy: offset,
    });

    return { rows, total: totalOf(rows, rows.length) };
  },
  ["blog", "lista-po-tagu"],
  { tags: [BLOG_TAG, blogTag("lista")] },
);

export async function getArticlesByTag(options: {
  tagSlug: string;
  jezyk: BlogLocale;
  page?: number;
  pageSize?: number;
}): Promise<ArticlePage> {
  const pageSize = options.pageSize ?? (await getPageSize());
  const page = Math.max(1, options.page ?? 1);

  return fetchArticlesByTag(options.tagSlug, options.jezyk, pageSize, (page - 1) * pageSize);
}

const fetchArticlesByAuthor = unstable_cache(
  async (
    autorSlug: string,
    jezyk: BlogLocale,
    limit: number,
    offset: number,
  ): Promise<{ rows: AuthorArticleRow[]; total: number }> => {
    const rows = await executeSavedQuery<AuthorArticleRow>("blog_artykuly_po_autorze", {
      autor_slug: autorSlug,
      jezyk,
      limit_wierszy: limit,
      offset_wierszy: offset,
    });

    return { rows, total: totalOf(rows, rows.length) };
  },
  ["blog", "lista-po-autorze"],
  { tags: [BLOG_TAG, blogTag("lista")] },
);

export async function getArticlesByAuthor(options: {
  autorSlug: string;
  jezyk: BlogLocale;
  page?: number;
  pageSize?: number;
}): Promise<{ rows: AuthorArticleRow[]; total: number }> {
  const pageSize = options.pageSize ?? (await getPageSize());
  const page = Math.max(1, options.page ?? 1);

  return fetchArticlesByAuthor(options.autorSlug, options.jezyk, pageSize, (page - 1) * pageSize);
}

/**
 * Every indexable blog URL, assembled from the article listing (once per
 * locale) and the taxonomy records.
 *
 * The `blog_sitemap` saved query is not used: it lists taxonomy slugs in the
 * source language only, while hreflang needs each locale's slug, which the
 * record API returns. Articles carry their `noindex` flag from
 * `blog_lista_artykulow`, so the sitemap route can drop them without reading
 * each article. Noindex categories are dropped here.
 */
async function readSitemapEntries(): Promise<SitemapRow[]> {
  const [categories, tags, authors] = await Promise.all([
    getRecordsWithMeta<CategoryRecord>("kategoria"),
    getRecordsWithMeta<TagRecord>("tag"),
    getRecordsWithMeta<AuthorRecord>("autor"),
  ]);

  const rows: SitemapRow[] = [];

  for (const jezyk of blogLocales) {
    for (const article of await readAllArticles(jezyk)) {
      rows.push({
        typ: "artykul",
        slug: article.slug,
        jezyk,
        lastmod: article.updated_at,
        data_publikacji: article.data_publikacji,
        noindex: article.noindex ?? null,
      });
    }

    // Taxonomy slugs are translated, so each locale lists its own.
    const taxonomy = (typ: SitemapRow["typ"], record: BlogRecord<{ slug: string }>): SitemapRow => {
      const { slug, slugs } = localize(record, jezyk);
      return { typ, slug, slugs, jezyk, lastmod: record.updatedAt, data_publikacji: null };
    };

    for (const category of categories) {
      if (category.values.noindex === true) continue;
      rows.push(taxonomy("kategoria", category));
    }

    for (const tag of tags) {
      rows.push(taxonomy("tag", tag));
    }

    for (const author of authors) {
      if (author.values.aktywny === false) continue;
      rows.push(taxonomy("autor", author));
    }
  }

  return rows;
}

/** Walks the whole published listing for one locale, a page at a time. */
async function readAllArticles(jezyk: BlogLocale): Promise<ArticleListRow[]> {
  const pageSize = 100;
  const all: ArticleListRow[] = [];

  for (let offset = 0; offset < pageSize * 50; offset += pageSize) {
    const rows = await executeSavedQuery<ArticleListRow>("blog_lista_artykulow", {
      jezyk,
      limit_wierszy: pageSize,
      offset_wierszy: offset,
    });

    all.push(...rows);

    if (rows.length < pageSize) break;
  }

  return all;
}

/**
 * The whole published listing for one locale, newest first. The index groups it
 * by category and the article page draws its "keep reading" covers from it.
 */
export const getAllArticles = unstable_cache(
  async (jezyk: BlogLocale): Promise<ArticleListRow[]> => readAllArticles(jezyk),
  ["blog", "wszystkie"],
  { tags: [BLOG_TAG, blogTag("lista")] },
);

export const getSitemapEntries = unstable_cache(readSitemapEntries, ["blog", "sitemap"], {
  tags: [BLOG_TAG, blogTag("sitemap")],
});

/**
 * Uncached reads for `generateStaticParams` only.
 *
 * Route enumeration happens once per build and must reflect the CMS as it is
 * *now*. Reading through `unstable_cache` would let a warm data cache carried
 * over from a previous deploy decide which pages exist, so a deploy could ship
 * a stale set of article or pagination routes. The cost is a couple of extra
 * requests per build.
 */
export const uncachedForBuild = {
  sitemapEntries: readSitemapEntries,
  async articleTotal(jezyk: BlogLocale, pageSize: number): Promise<number> {
    const rows = await executeSavedQuery<ArticleListRow>("blog_lista_artykulow", {
      jezyk,
      limit_wierszy: pageSize,
      offset_wierszy: 0,
    });

    return totalOf(rows, rows.length);
  },
  async pageSize(): Promise<number> {
    const settings = await getSingletonValues<BlogSettings>("ustawienia");
    const size = settings?.artykulow_na_stronie;

    return typeof size === "number" && size > 0 ? size : fallbackPageSize;
  },
};

export const getRedirects = unstable_cache(
  async (): Promise<RedirectRow[]> => executeSavedQuery<RedirectRow>("blog_przekierowania"),
  ["blog", "redirects"],
  { tags: [BLOG_TAG, blogTag("redirects")] },
);

/**
 * Categories, tags and authors are translated in the CMS: the base values hold
 * the source language (pl) and `i18n` holds the rest. Each object is fetched
 * once and resolved per locale here, falling back to the source value wherever
 * a translation is missing.
 */
function localize<T extends { slug: string }>(record: BlogRecord<T>, locale: BlogLocale): Localized<T> {
  const translated = (target: BlogLocale) =>
    target === sourceLocale
      ? {}
      : Object.fromEntries(
          Object.entries(record.i18n[target] ?? {}).filter(([, value]) => value !== null && value !== undefined && value !== ""),
        );

  const slugs = Object.fromEntries(
    blogLocales.map((target) => [target, (translated(target).slug as string | undefined) ?? record.values.slug]),
  ) as Record<BlogLocale, string>;

  return { ...record.values, ...translated(locale), slugs } as Localized<T>;
}

const fetchCategories = unstable_cache(
  async () => getRecordsWithMeta<CategoryRecord>("kategoria"),
  ["blog", "kategorie"],
  { tags: [BLOG_TAG, blogTag("kategorie")] },
);

const fetchTags = unstable_cache(async () => getRecordsWithMeta<TagRecord>("tag"), ["blog", "tagi"], {
  tags: [BLOG_TAG, blogTag("tagi")],
});

const fetchAuthors = unstable_cache(async () => getRecordsWithMeta<AuthorRecord>("autor"), ["blog", "autorzy"], {
  tags: [BLOG_TAG, blogTag("autorzy")],
});

export async function getCategories(locale: BlogLocale): Promise<Array<Localized<CategoryRecord>>> {
  const categories = (await fetchCategories()).map((record) => localize(record, locale));

  return categories.sort((a, b) => (a.pozycja ?? Number.MAX_SAFE_INTEGER) - (b.pozycja ?? Number.MAX_SAFE_INTEGER));
}

export async function getTags(locale: BlogLocale): Promise<Array<Localized<TagRecord>>> {
  // Tag slugs are unique: the "Blog — slug tagu" rule in Opero suffixes a colliding one.
  const tags = (await fetchTags()).map((record) => localize(record, locale));

  return tags.sort((a, b) => a.nazwa.localeCompare(b.nazwa, locale));
}

/**
 * Whether a tag's page has anything to list. Reads through the same cache entry
 * the tag page renders from, so checking costs no extra request.
 */
export async function tagHasArticles(tagSlug: string, jezyk: BlogLocale): Promise<boolean> {
  const { rows } = await getArticlesByTag({ tagSlug, jezyk, pageSize: archivePageSize });

  return rows.length > 0;
}

/** The tags worth linking to: those with at least one published article in this language. */
export async function getUsedTags(locale: BlogLocale): Promise<Array<Localized<TagRecord>>> {
  const tags = await getTags(locale);
  const used = await Promise.all(tags.map((tag) => tagHasArticles(tag.slug, locale)));

  return tags.filter((_, index) => used[index]);
}

export async function getAuthors(locale: BlogLocale): Promise<Array<Localized<AuthorRecord>>> {
  const authors = (await fetchAuthors()).map((record) => localize(record, locale));

  return authors.sort((a, b) => a.imie_nazwisko.localeCompare(b.imie_nazwisko, locale));
}

/**
 * Matches this locale's slug first, then a slug from any other locale. A record
 * whose `slug` differs from the requested one was found the second way, and the
 * caller redirects to its slug in this locale.
 */
function findBySlug<T extends { slug: string; slugs: Record<BlogLocale, string> }>(records: T[], slug: string) {
  return (
    records.find((record) => record.slug === slug) ??
    records.find((record) => Object.values(record.slugs).includes(slug)) ??
    null
  );
}

export async function getCategoryBySlug(slug: string, locale: BlogLocale) {
  return findBySlug(await getCategories(locale), slug);
}

export async function getTagBySlug(slug: string, locale: BlogLocale) {
  return findBySlug(await getTags(locale), slug);
}

export async function getAuthorBySlug(slug: string, locale: BlogLocale) {
  return findBySlug(await getAuthors(locale), slug);
}

/** Resolves a requested blog path against the CMS redirect table. */
export async function findRedirect(path: string): Promise<RedirectRow | null> {
  const redirects = await getRedirects();
  const normalized = path.replace(/\/$/, "");

  return redirects.find((redirect) => redirect.sciezka_z.replace(/\/$/, "") === normalized) ?? null;
}
