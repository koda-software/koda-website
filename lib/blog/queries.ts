import { unstable_cache } from "next/cache";
import { executeSavedQuery, getRecords, getRecordsWithMeta, getSingletonValues } from "./opero";
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
  RedirectRow,
  SitemapRow,
  TagRecord,
} from "./types";
import { blogLocales } from "./routes";

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
 * The CMS queries disagree about scheduling: `blog_lista_artykulow` gates on
 * `data_publikacji <= now`, but `blog_artykul_po_slug` and `blog_sitemap` gate
 * on status alone. Taken at face value that makes a scheduled article reachable
 * and crawlable at its own URL hours before it appears in any listing. The site
 * applies the stricter rule uniformly so "scheduled" means "not public yet".
 *
 * Evaluated outside `unstable_cache` so the comparison uses the current time
 * rather than whenever the entry happened to be written.
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

export async function getArticleBySlug(slug: string, jezyk: BlogLocale): Promise<ArticleFullRow | null> {
  const read = unstable_cache(
    async () => {
      const rows = await executeSavedQuery<ArticleFullRow>("blog_artykul_po_slug", { slug, jezyk });
      return rows[0] ?? null;
    },
    ["blog", "artykul", jezyk, slug],
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
 * This deliberately does not use the `blog_sitemap` saved query: that query was
 * not migrated to the localisation model — its SQL still selects the dropped
 * `a.f_jezyk` column, so it fails server-side. Deriving the list here also
 * removes a single point of failure for `generateStaticParams`.
 *
 * Known gap: `blog_lista_artykulow` does not return `noindex`, so a noindex
 * article is still listed. Categories are filtered, since the record API does
 * expose their flag. Ask the backend to add `noindex` to the listing query.
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
      });
    }
  }

  for (const category of categories) {
    if (category.values.noindex === true) continue;
    rows.push({ typ: "kategoria", slug: category.values.slug, jezyk: null, lastmod: category.updatedAt, data_publikacji: null });
  }

  for (const tag of tags) {
    rows.push({ typ: "tag", slug: tag.values.slug, jezyk: null, lastmod: tag.updatedAt, data_publikacji: null });
  }

  for (const author of authors) {
    if (author.values.aktywny === false) continue;
    rows.push({ typ: "autor", slug: author.values.slug, jezyk: null, lastmod: author.updatedAt, data_publikacji: null });
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

export const getCategories = unstable_cache(
  async (): Promise<CategoryRecord[]> => {
    const categories = await getRecords<CategoryRecord>("kategoria");

    return categories.sort((a, b) => (a.pozycja ?? Number.MAX_SAFE_INTEGER) - (b.pozycja ?? Number.MAX_SAFE_INTEGER));
  },
  ["blog", "kategorie"],
  { tags: [BLOG_TAG, blogTag("kategorie")] },
);

export const getTags = unstable_cache(
  async (): Promise<TagRecord[]> => {
    const tags = await getRecords<TagRecord>("tag");

    return tags.sort((a, b) => a.nazwa.localeCompare(b.nazwa));
  },
  ["blog", "tagi"],
  { tags: [BLOG_TAG, blogTag("tagi")] },
);

export const getAuthors = unstable_cache(
  async (): Promise<AuthorRecord[]> => {
    const authors = await getRecords<AuthorRecord>("autor");

    return authors.sort((a, b) => a.imie_nazwisko.localeCompare(b.imie_nazwisko));
  },
  ["blog", "autorzy"],
  { tags: [BLOG_TAG, blogTag("autorzy")] },
);

export async function getCategoryBySlug(slug: string): Promise<CategoryRecord | null> {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function getTagBySlug(slug: string): Promise<TagRecord | null> {
  const tags = await getTags();
  return tags.find((tag) => tag.slug === slug) ?? null;
}

export async function getAuthorBySlug(slug: string): Promise<AuthorRecord | null> {
  const authors = await getAuthors();
  return authors.find((author) => author.slug === slug) ?? null;
}

/** Resolves a requested blog path against the CMS redirect table. */
export async function findRedirect(path: string): Promise<RedirectRow | null> {
  const redirects = await getRedirects();
  const normalized = path.replace(/\/$/, "");

  return redirects.find((redirect) => redirect.sciezka_z.replace(/\/$/, "") === normalized) ?? null;
}
