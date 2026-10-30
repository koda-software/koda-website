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
 * the root layout's title template, as do article pages. The CMS title
 * suffix setting (`sufiks_title`) is no longer used.
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
  const category = await getCategoryBySlug(slug, locale);

  // A slug from another locale redirects, so only the canonical one gets metadata.
  if (!category || category.slug !== slug) return {};

  const name = category.nazwa;

  return createBlogMetadata({
    locale,
    title: category.meta_title ?? fillTemplate(ui.seoTemplates.categoryTitle, { name }),
    description: truncateDescription(
      category.meta_description ?? category.opis ?? fillTemplate(ui.seoTemplates.categoryDescription, { name }),
    ),
    path: categoryPath(locale, slug),
    languages: symmetricAlternates({ en: categoryPath("en", category.slugs.en), pl: categoryPath("pl", category.slugs.pl) }),
    noIndex: category.noindex === true,
    image: await blogDefaultOgImage(),
  });
}

export async function blogTagMetadata(locale: BlogLocale, slug: string): Promise<Metadata> {
  const { ui } = blogBundle(locale);
  const tag = await getTagBySlug(slug, locale);

  if (!tag || tag.slug !== slug) return {};

  const name = tag.nazwa;

  return createBlogMetadata({
    locale,
    title: fillTemplate(ui.seoTemplates.tagTitle, { name }),
    description: truncateDescription(tag.opis ?? fillTemplate(ui.seoTemplates.tagDescription, { name })),
    path: tagPath(locale, slug),
    languages: symmetricAlternates({ en: tagPath("en", tag.slugs.en), pl: tagPath("pl", tag.slugs.pl) }),
    image: await blogDefaultOgImage(),
  });
}

export async function blogAuthorMetadata(locale: BlogLocale, slug: string): Promise<Metadata> {
  const { ui } = blogBundle(locale);
  const author = await getAuthorBySlug(slug, locale);

  // An inactive author renders the 404 page, so nothing about them may leak into its head.
  if (!author || author.aktywny === false || author.slug !== slug) return {};

  const name = author.imie_nazwisko;
  const bio = tiptapPlainText(author.bio);

  return createBlogMetadata({
    locale,
    title: fillTemplate(ui.seoTemplates.authorTitle, { name }),
    description: truncateDescription(bio || fillTemplate(ui.seoTemplates.authorDescription, { name })),
    path: authorPath(locale, slug),
    languages: symmetricAlternates({ en: authorPath("en", author.slugs.en), pl: authorPath("pl", author.slugs.pl) }),
    image: await blogDefaultOgImage(),
  });
}

export async function blogArticleMetadata(locale: BlogLocale, slug: string): Promise<Metadata> {
  const article = await getArticleBySlug(slug, locale);

  // A missing article renders the 404 page, which carries its own metadata.
  if (!article) return {};

  return createArticleMetadata(article, locale);
}
