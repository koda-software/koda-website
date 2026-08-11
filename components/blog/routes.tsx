import { notFound, permanentRedirect, redirect } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { blogBundle } from "@/lib/blog/bundle";
import { blogImagePath, isFileId } from "@/lib/blog/images";
import { getArticleAlternates } from "@/lib/blog/metadata";
import {
  archivePageSize,
  findRedirect,
  getArticleBySlug,
  getArticles,
  getArticlesByAuthor,
  getArticlesByTag,
  getAuthorBySlug,
  getCategoryBySlug,
  getPageSize,
  getSettings,
  getTagBySlug,
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
import type { BlogLocale } from "@/lib/blog/types";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { absoluteUrl, siteConfig } from "@/lib/seo/site";
import { ArticlePage } from "./ArticlePage";
import { AuthorLinks, type BlogAuthor } from "./AuthorBox";
import { BlogListPage } from "./BlogListPage";
import { BlogNotFound } from "./BlogNotFound";

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

export async function BlogIndexRoute({ locale, page = 1 }: { locale: BlogLocale; page?: number }) {
  const { ui, ctaHrefs, shell, navItems } = blogBundle(locale);
  const pageSize = await getPageSize();
  const { rows, total } = await getArticles({ jezyk: locale, page, pageSize });
  const totalPages = totalPagesOf(total, pageSize);

  // Page 1 renders even when empty; deeper pages beyond the range do not exist.
  if (page > 1 && (page > totalPages || rows.length === 0)) {
    notFound();
  }

  return (
    <PageShell locale={toSiteLocale(locale)} navItems={navItems} page="blog" shell={shell}>
      <BlogListPage
        buildHref={(target) => blogPagePath(locale, target)}
        ctaHrefs={ctaHrefs}
        heading={{ eyebrow: ui.index.eyebrow, title: ui.index.title, description: ui.index.description }}
        locale={locale}
        page={page}
        rows={rows}
        totalPages={totalPages}
        ui={ui}
      />
    </PageShell>
  );
}

export async function BlogCategoryRoute({ locale, slug }: { locale: BlogLocale; slug: string }) {
  const { ui, ctaHrefs, shell, navItems } = blogBundle(locale);
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const { rows } = await getArticles({ jezyk: locale, kategoriaSlug: slug, pageSize: archivePageSize });

  return (
    <PageShell
      alternatePaths={{ en: categoryPath("en", slug), pl: categoryPath("pl", slug) }}
      locale={toSiteLocale(locale)}
      navItems={navItems}
      page="blog"
      shell={shell}
    >
      <BlogListPage
        buildHref={() => categoryPath(locale, slug)}
        ctaHrefs={ctaHrefs}
        heading={{
          eyebrow: ui.archives.categoryEyebrow,
          title: category.nazwa,
          description: category.opis ?? ui.archives.categoryDescription,
        }}
        locale={locale}
        page={1}
        rows={rows}
        showBackLink
        totalPages={1}
        ui={ui}
      />
    </PageShell>
  );
}

export async function BlogTagRoute({ locale, slug }: { locale: BlogLocale; slug: string }) {
  const { ui, ctaHrefs, shell, navItems } = blogBundle(locale);
  const tag = await getTagBySlug(slug);

  if (!tag) {
    notFound();
  }

  const { rows } = await getArticlesByTag({ tagSlug: slug, jezyk: locale, pageSize: archivePageSize });

  return (
    <PageShell
      alternatePaths={{ en: tagPath("en", slug), pl: tagPath("pl", slug) }}
      locale={toSiteLocale(locale)}
      navItems={navItems}
      page="blog"
      shell={shell}
    >
      <BlogListPage
        buildHref={() => tagPath(locale, slug)}
        ctaHrefs={ctaHrefs}
        heading={{
          eyebrow: ui.archives.tagEyebrow,
          title: tag.nazwa,
          description: tag.opis ?? ui.archives.tagDescription,
        }}
        locale={locale}
        page={1}
        rows={rows}
        showBackLink
        totalPages={1}
        ui={ui}
      />
    </PageShell>
  );
}

export async function BlogAuthorRoute({ locale, slug }: { locale: BlogLocale; slug: string }) {
  const { ui, ctaHrefs, shell, navItems } = blogBundle(locale);
  const record = await getAuthorBySlug(slug);

  if (!record || record.aktywny === false) {
    notFound();
  }

  const { rows } = await getArticlesByAuthor({ autorSlug: slug, jezyk: locale, pageSize: archivePageSize });

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
  const bio = tiptapPlainText(record.bio);

  return (
    <PageShell
      alternatePaths={{ en: authorPath("en", slug), pl: authorPath("pl", slug) }}
      locale={toSiteLocale(locale)}
      navItems={navItems}
      page="blog"
      shell={shell}
    >
      <BlogListPage
        aside={
          <div>
            {bio ? <p className="m-0 text-[1.02rem] font-light leading-[1.65] text-white/68">{bio}</p> : null}
            <AuthorLinks author={author} invert />
          </div>
        }
        buildHref={() => authorPath(locale, slug)}
        ctaHrefs={ctaHrefs}
        heading={{
          eyebrow: record.stanowisko ?? ui.archives.authorEyebrow,
          title: author.nazwa,
          description: ui.archives.authorDescription,
        }}
        locale={locale}
        page={1}
        rows={rows}
        showBackLink
        totalPages={1}
        ui={ui}
      />
    </PageShell>
  );
}

export async function BlogArticleRoute({ locale, slug }: { locale: BlogLocale; slug: string }) {
  const { ui, ctaHrefs, shell, navItems } = blogBundle(locale);
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

  const settings = await getSettings();
  const { paths } = getArticleAlternates(article, locale);
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
        keywords={article.tagi?.map((tag) => tag.nazwa)}
        type={article.typ_schema ?? "BlogPosting"}
        url={absoluteUrl(articlePath(locale, article.slug))}
      />
      <BreadcrumbJsonLd
        items={[
          { name: ui.index.eyebrow, path: blogIndexPath(locale) },
          ...(article.kategoria_slug && article.kategoria_nazwa
            ? [{ name: article.kategoria_nazwa, path: categoryPath(locale, article.kategoria_slug) }]
            : []),
          { name: article.tytul, path: articlePath(locale, article.slug) },
        ]}
      />
      <ArticlePage article={article} ctaHrefs={ctaHrefs} locale={locale} ui={ui} />
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
