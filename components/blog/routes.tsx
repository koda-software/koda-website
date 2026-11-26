import type { ReactNode } from "react";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { blogBundle } from "@/lib/blog/bundle";
import { blogImagePath, isFileId } from "@/lib/blog/images";
import { faqAnswerHtml, parseFaqAnswer } from "@/lib/blog/faq";
import { getArticleAlternates } from "@/lib/blog/metadata";
import { blogPromos } from "@/lib/blog/promos";
import {
  archivePageSize,
  findRedirect,
  getAllArticles,
  getArticleBySlug,
  getArticles,
  getArticlesByAuthor,
  getArticlesByTag,
  getAuthorBySlug,
  getCategories,
  getCategoryBySlug,
  getPageSize,
  getSettings,
  getSystemFeatures,
  getTagBySlug,
  getUsedTags,
} from "@/lib/blog/queries";
import {
  articlePath,
  articleSlugsByLocale,
  authorPath,
  blogLocales,
  blogIndexPath,
  blogPagePath,
  categoryPath,
  tagPath,
  toSiteLocale,
} from "@/lib/blog/routes";
import { tiptapPlainText } from "@/lib/blog/tiptap";
import type { ArticleListRow, BlogLocale, SystemFeatureRow } from "@/lib/blog/types";
import { localizePath } from "@/lib/i18n/routes";
import { ArticleJsonLd, BlogListJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/lib/seo/json-ld";
import { absoluteUrl, siteConfig } from "@/lib/seo/site";
import { ArticlePage } from "./ArticlePage";
import { AuthorLinks, type BlogAuthor } from "./AuthorBox";
import { BlogHubPage } from "./BlogHubPage";
import { BlogListPage } from "./BlogListPage";
import { BlogNotFound } from "./BlogNotFound";
import type { BlogFrame } from "./frame";
import { TagChips } from "./TagChips";

/**
 * Locale-agnostic page bodies. The per-locale `page.tsx` files stay thin
 * wrappers so the route tree keeps mirroring the rest of the site.
 *
 * Only the main index paginates (`/blog/page/[n]`); archives render a single
 * page of up to `archivePageSize` articles, as specced.
 */

function totalPagesOf(total: number, pageSize: number) {
  return Math.max(1, Math.ceil(total / pageSize));
}

const picksCount = 3;
const keepReadingCount = 3;

/**
 * What every blog page shows around its own content, plus the full listing it
 * is drawn from. `pageKey` is the page's path, so pages draw different promos.
 */
async function blogChrome(locale: BlogLocale, pageKey: string, article?: { id: string; funkcja: SystemFeatureRow | null }) {
  const { ui, ctaHrefs, shell } = blogBundle(locale);
  const [articles, categories, features] = await Promise.all([
    getAllArticles(locale),
    getCategories(locale),
    getSystemFeatures(locale),
  ]);
  const counts = new Map<string, number>();

  for (const article of articles) {
    if (article.kategoria_slug) counts.set(article.kategoria_slug, (counts.get(article.kategoria_slug) ?? 0) + 1);
  }

  const topics = categories
    .map((category) => ({ slug: category.slug, name: category.nazwa, count: counts.get(category.slug) ?? 0 }))
    .filter((topic) => topic.count > 0);
  const picks = articles.filter((row) => row.wyrozniony === true && row.id !== article?.id).slice(0, picksCount);
  const promos = blogPromos(locale, pageKey, { features, chosen: article?.funkcja });
  const toolsHref = localizePath(toSiteLocale(locale), "tools");
  const frame: BlogFrame = { locale, ui, shell, ctaHrefs, toolsHref, topics, picks, promos };

  return { articles, frame };
}

/** Home, the blog, then whatever the page adds. */
function BlogBreadcrumbJsonLd({ locale, items = [] }: { locale: BlogLocale; items?: Array<{ name: string; path: string }> }) {
  const { ui } = blogBundle(locale);

  return (
    <BreadcrumbJsonLd
      items={[
        { name: ui.labels.breadcrumbHome, path: localizePath(toSiteLocale(locale), "home") },
        { name: ui.index.label, path: blogIndexPath(locale) },
        ...items,
      ]}
    />
  );
}

/** The category, tag and author archives: one page each, the same around their own list. */
async function BlogArchive({
  locale,
  pathFor,
  slugs,
  list,
  title,
  description,
  aside,
  activeTopic,
}: {
  locale: BlogLocale;
  pathFor: (locale: BlogLocale, slug: string) => string;
  slugs: Record<BlogLocale, string>;
  /** Passed unawaited, so it loads alongside the rest of the page. */
  list: Promise<{ rows: ArticleListRow[] }>;
  title: string;
  description: string;
  aside?: ReactNode;
  activeTopic?: string;
}) {
  const { shell, navItems } = blogBundle(locale);
  const path = pathFor(locale, slugs[locale]);
  const [{ rows }, { articles, frame }] = await Promise.all([list, blogChrome(locale, path)]);

  return (
    <PageShell
      alternatePaths={{ en: pathFor("en", slugs.en), pl: pathFor("pl", slugs.pl) }}
      locale={toSiteLocale(locale)}
      navItems={navItems}
      page="blog"
      shell={shell}
    >
      <BlogListJsonLd articles={listItems(locale, rows)} description={description} locale={toSiteLocale(locale)} name={title} path={path} />
      <BlogBreadcrumbJsonLd items={[{ name: title, path }]} locale={locale} />
      <BlogListPage
        {...frame}
        activeTopic={activeTopic}
        aside={aside}
        buildHref={() => path}
        heading={{ title, description }}
        page={1}
        rows={rows}
        total={articles.length}
        totalPages={1}
      />
    </PageShell>
  );
}

function listItems(locale: BlogLocale, rows: ArticleListRow[]) {
  return rows.map((row) => ({ name: row.tytul, path: articlePath(locale, row.slug) }));
}

export async function BlogIndexRoute({ locale, page = 1 }: { locale: BlogLocale; page?: number }) {
  const { ui, shell, navItems } = blogBundle(locale);
  const path = blogPagePath(locale, page);
  // Most tags hold one article; listing them all here gives each tag page a second link.
  const [pageSize, tags, { articles, frame }] = await Promise.all([getPageSize(), getUsedTags(locale), blogChrome(locale, path)]);
  const totalPages = totalPagesOf(articles.length, pageSize);

  // Page 1 renders even when empty; deeper pages beyond the range do not exist.
  if (page > totalPages) {
    notFound();
  }

  const rows = articles.slice((page - 1) * pageSize, page * pageSize);

  return (
    <PageShell locale={toSiteLocale(locale)} navItems={navItems} page="blog" shell={shell}>
      <BlogListJsonLd articles={listItems(locale, rows)} description={ui.seo.description} locale={toSiteLocale(locale)} name={ui.seo.title} path={path} />
      <BlogBreadcrumbJsonLd locale={locale} />
      {page === 1 ? (
        <BlogHubPage {...frame} articles={articles} footer={<TagChips locale={locale} tags={tags} ui={ui} />} stream={rows} totalPages={totalPages} />
      ) : (
        <BlogListPage
          {...frame}
          buildHref={(target) => blogPagePath(locale, target)}
          heading={{ title: ui.index.title, description: ui.index.description }}
          page={page}
          rows={rows}
          total={articles.length}
          totalPages={totalPages}
        />
      )}
    </PageShell>
  );
}

/**
 * A missing blog page follows its row in the CMS redirect table (a renamed slug, a removed
 * category or author) and is a real 404 otherwise.
 */
async function redirectOrNotFound(path: string): Promise<never> {
  const match = await findRedirect(path);

  if (match) {
    if (match.kod === "301") permanentRedirect(match.sciezka_do);
    redirect(match.sciezka_do);
  }

  notFound();
}

export async function BlogCategoryRoute({ locale, slug }: { locale: BlogLocale; slug: string }) {
  const { ui } = blogBundle(locale);
  const category = await getCategoryBySlug(slug, locale);

  if (!category) {
    return redirectOrNotFound(categoryPath(locale, slug));
  }

  // Taxonomy slugs are translated: a slug from another locale moves to this one's.
  if (category.slug !== slug) {
    permanentRedirect(categoryPath(locale, category.slug));
  }

  const list = getArticles({ jezyk: locale, kategoriaSlug: slug, pageSize: archivePageSize });

  return (
    <BlogArchive
      activeTopic={slug}
      description={category.opis ?? ui.archives.categoryDescription}
      locale={locale}
      pathFor={categoryPath}
      list={list}
      slugs={category.slugs}
      title={category.nazwa}
    />
  );
}

export async function BlogTagRoute({ locale, slug }: { locale: BlogLocale; slug: string }) {
  const { ui } = blogBundle(locale);
  const tag = await getTagBySlug(slug, locale);

  if (!tag) {
    return redirectOrNotFound(tagPath(locale, slug));
  }

  if (tag.slug !== slug) {
    permanentRedirect(tagPath(locale, tag.slug));
  }

  const list = getArticlesByTag({ tagSlug: slug, jezyk: locale, pageSize: archivePageSize });

  return (
    <BlogArchive
      description={tag.opis ?? ui.archives.tagDescription}
      locale={locale}
      pathFor={tagPath}
      list={list}
      slugs={tag.slugs}
      title={tag.nazwa}
    />
  );
}

export async function BlogAuthorRoute({ locale, slug }: { locale: BlogLocale; slug: string }) {
  const { ui } = blogBundle(locale);
  const record = await getAuthorBySlug(slug, locale);

  if (!record || record.aktywny === false) {
    return redirectOrNotFound(authorPath(locale, slug));
  }

  if (record.slug !== slug) {
    permanentRedirect(authorPath(locale, record.slug));
  }

  const list = getArticlesByAuthor({ autorSlug: slug, jezyk: locale, pageSize: archivePageSize });
  const author: BlogAuthor = {
    slug: record.slug,
    nazwa: record.imie_nazwisko,
    stanowisko: record.stanowisko,
    avatar: record.avatar,
    bio: record.bio,
    www: record.url_www,
    linkedin: record.url_linkedin,
    x: record.url_x,
  };

  return (
    <BlogArchive
      aside={<AuthorLinks author={author} className="" invert />}
      description={tiptapPlainText(record.bio) || ui.archives.authorDescription}
      locale={locale}
      pathFor={authorPath}
      list={list}
      slugs={record.slugs}
      title={author.nazwa}
    />
  );
}

export async function BlogArticleRoute({ locale, slug }: { locale: BlogLocale; slug: string }) {
  const { shell, navItems } = blogBundle(locale);
  const article = await getArticleBySlug(slug, locale);

  if (!article) {
    // A renamed slug leaves a redirect row behind; anything else is a real 404.
    const match = await findRedirect(articlePath(locale, slug));

    if (match) {
      if (match.kod === "301") permanentRedirect(match.sciezka_do);
      redirect(match.sciezka_do);
    }

    // The CMS resolves a slug under its own locale and the source locale only,
    // so /pl/blog/{en-slug} misses here. Look it up in the other locales and
    // send the visitor to this locale's slug if the article is translated.
    for (const other of blogLocales) {
      if (other === locale) continue;

      const translated = await getArticleBySlug(slug, other);
      const localizedSlug = translated && articleSlugsByLocale(translated).get(locale);

      if (localizedSlug) {
        permanentRedirect(articlePath(locale, localizedSlug));
      }
    }

    notFound();
  }

  // The CMS resolves an article by its slug in *any* locale, so /en/blog/{pl-slug}
  // would serve the English article at a second URL. Send it to the canonical one.
  const canonicalSlug = articleSlugsByLocale(article).get(locale);

  if (canonicalSlug && canonicalSlug !== slug) {
    permanentRedirect(articlePath(locale, canonicalSlug));
  }

  const path = articlePath(locale, article.slug);
  const [settings, { articles, frame }] = await Promise.all([
    getSettings(),
    blogChrome(locale, path, { id: article.id, funkcja: article.funkcja }),
  ]);
  const { paths } = getArticleAlternates(article, locale);
  // The editors' related articles first, then the newest from the same category, then the newest of all.
  const others = articles.filter((row) => row.id !== article.id);
  const relatedSlugs = new Set((article.powiazane ?? []).map((item) => item.slug));
  const keepReading = [
    ...new Set([
      ...others.filter((row) => relatedSlugs.has(row.slug)),
      ...others.filter((row) => row.kategoria_slug && row.kategoria_slug === article.kategoria_slug),
      ...others,
    ]),
  ].slice(0, keepReadingCount);
  const imageFileId = [article.og_image, article.obraz_glowny, settings?.domyslny_og_image].find(isFileId);
  const sameAs = [article.autor_linkedin, article.autor_x, article.autor_www].filter(
    (value): value is string => typeof value === "string" && value.length > 0,
  );

  return (
    <PageShell
      alternatePaths={Object.fromEntries(paths)}
      locale={toSiteLocale(locale)}
      navItems={navItems}
      page="blog"
      shell={shell}
    >
      <ArticleJsonLd
        author={
          article.autor_nazwa
            ? {
                name: article.autor_nazwa,
                url: article.autor_slug ? absoluteUrl(authorPath(locale, article.autor_slug)) : undefined,
                sameAs,
              }
            : undefined
        }
        dateModified={article.updated_at}
        datePublished={article.data_publikacji}
        description={article.meta_description ?? article.zajawka ?? ""}
        headline={article.tytul}
        image={imageFileId ? absoluteUrl(blogImagePath(imageFileId)) : absoluteUrl(siteConfig.defaultOgImage)}
        inLanguage={locale}
        articleSection={article.kategoria_nazwa ?? undefined}
        keywords={article.tagi?.map((tag) => tag.nazwa)}
        type={article.typ_schema ?? "BlogPosting"}
        url={absoluteUrl(path)}
        wordCount={article.liczba_slow ?? undefined}
      />
      <BlogBreadcrumbJsonLd
        items={[
          ...(article.kategoria_slug && article.kategoria_nazwa
            ? [{ name: article.kategoria_nazwa, path: categoryPath(locale, article.kategoria_slug) }]
            : []),
          { name: article.tytul, path },
        ]}
        locale={locale}
      />
      {article.faq?.length ? (
        <FaqJsonLd
          items={article.faq.map((item) => ({ question: item.pytanie, answer: faqAnswerHtml(parseFaqAnswer(item.odpowiedz)) }))}
        />
      ) : null}
      <ArticlePage {...frame} article={article} keepReading={keepReading} url={absoluteUrl(path)} />
    </PageShell>
  );
}

/** Rendered by every `not-found.tsx` under the blog tree. */
export function BlogNotFoundRoute({ locale }: { locale: BlogLocale }) {
  const { ui, shell, navItems } = blogBundle(locale);

  return (
    <PageShell locale={toSiteLocale(locale)} navItems={navItems} page="blog" shell={shell}>
      <BlogNotFound locale={locale} ui={ui} />
    </PageShell>
  );
}
