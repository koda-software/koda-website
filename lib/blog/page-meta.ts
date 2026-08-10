import type { Metadata } from "next";
import { blogBundle } from "./bundle";
import { fillTemplate } from "./format";
import { blogDefaultOgImage, createArticleMetadata, createBlogMetadata, symmetricAlternates, truncateDescription } from "./metadata";
import { getArticleBySlug, getAuthorBySlug, getCategoryBySlug, getTagBySlug } from "./queries";
import { authorPath, blogIndexPath, blogPagePath, categoryPath, tagPath } from "./routes";
import { tiptapPlainText } from "./tiptap";
import type { BlogLocale } from "./types";

/**
 * `generateMetadata` bodies for every blog route. Listing and archive pages use
 * the root layout's `%s | KodaSoft` title template; article pages take their
 * title verbatim from the CMS (with the CMS suffix) to avoid a double suffix.
 */

export async function blogIndexMetadata(locale: BlogLocale, page = 1): Promise<Metadata> {
  const { ui } = blogBundle(locale);
  const isFirstPage = page <= 1;

  return createBlogMetadata({
    locale,
    title: isFirstPage ? ui.seo.title : fillTemplate(ui.seoTemplates.pageTitle, { title: ui.seo.title, page }),
    description: isFirstPage
      ? ui.seo.description
      : truncateDescription(fillTemplate(ui.seoTemplates.pageDescription, { description: ui.seo.description, page })),
    path: blogPagePath(locale, page),
    // Paginated pages are self-canonical and carry no cross-language twin.
    languages: isFirstPage ? symmetricAlternates({ en: blogIndexPath("en"), pl: blogIndexPath("pl") }) : undefined,
    image: await blogDefaultOgImage(),
  });
}

export async function blogCategoryMetadata(locale: BlogLocale, slug: string): Promise<Metadata> {
  const { ui } = blogBundle(locale);
  const category = await getCategoryBySlug(slug);

  if (!category) return {};

  const name = category.nazwa;

  return createBlogMetadata({
    locale,
    title: category.meta_title ?? fillTemplate(ui.seoTemplates.categoryTitle, { name }),
    description: truncateDescription(
      category.meta_description ?? category.opis ?? fillTemplate(ui.seoTemplates.categoryDescription, { name }),
    ),
    path: categoryPath(locale, slug),
    languages: symmetricAlternates({ en: categoryPath("en", slug), pl: categoryPath("pl", slug) }),
    noIndex: category.noindex === true,
    image: await blogDefaultOgImage(),
  });
}

export async function blogTagMetadata(locale: BlogLocale, slug: string): Promise<Metadata> {
  const { ui } = blogBundle(locale);
  const tag = await getTagBySlug(slug);

  if (!tag) return {};

  const name = tag.nazwa;

  return createBlogMetadata({
    locale,
    title: fillTemplate(ui.seoTemplates.tagTitle, { name }),
    description: truncateDescription(tag.opis ?? fillTemplate(ui.seoTemplates.tagDescription, { name })),
    path: tagPath(locale, slug),
    languages: symmetricAlternates({ en: tagPath("en", slug), pl: tagPath("pl", slug) }),
    image: await blogDefaultOgImage(),
  });
}

export async function blogAuthorMetadata(locale: BlogLocale, slug: string): Promise<Metadata> {
  const { ui } = blogBundle(locale);
  const author = await getAuthorBySlug(slug);

  if (!author) return {};

  const name = author.imie_nazwisko;
  const bio = tiptapPlainText(author.bio);

  return createBlogMetadata({
    locale,
    title: fillTemplate(ui.seoTemplates.authorTitle, { name }),
    description: truncateDescription(bio || fillTemplate(ui.seoTemplates.authorDescription, { name })),
    path: authorPath(locale, slug),
    languages: symmetricAlternates({ en: authorPath("en", slug), pl: authorPath("pl", slug) }),
    image: await blogDefaultOgImage(),
  });
}

export async function blogArticleMetadata(locale: BlogLocale, slug: string): Promise<Metadata> {
  const article = await getArticleBySlug(slug, locale);

  // A missing article renders the 404 page, which carries its own metadata.
  if (!article) return {};

  return createArticleMetadata(article, locale);
}
