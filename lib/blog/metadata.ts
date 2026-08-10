import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/seo/site";
import type { Locale } from "@/lib/i18n/config";
import { blogImagePath, isFileId } from "./images";
import { getLanguageVariants, getSettings } from "./queries";
import { articlePath, blogIndexPath, toBlogLocale } from "./routes";
import type { ArticleFullRow, BlogLocale } from "./types";

const ogLocale: Record<Locale, string> = {
  en: "en_US",
  pl: "pl_PL",
};

/** Resolves the first usable image field to an absolute proxy URL. */
function resolveOgImage(...candidates: Array<string | null | undefined>): string {
  for (const candidate of candidates) {
    if (isFileId(candidate)) {
      return absoluteUrl(blogImagePath(candidate));
    }
  }

  return absoluteUrl(siteConfig.defaultOgImage);
}

function truncate(value: string, max = 320) {
  return value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value;
}

type BlogMetadataInput = {
  locale: BlogLocale;
  title: string;
  description: string;
  path: string;
  /** Absolute title bypasses the root layout's `%s | KodaSoft` template. */
  absoluteTitle?: string;
  image?: string;
  noIndex?: boolean;
  languages?: Record<string, string>;
  article?: {
    publishedTime: string;
    modifiedTime: string;
    authors?: string[];
    tags?: string[];
  };
};

export function createBlogMetadata({
  locale,
  title,
  description,
  path,
  absoluteTitle,
  image,
  noIndex,
  languages,
  article,
}: BlogMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ?? absoluteUrl(siteConfig.defaultOgImage);
  const socialTitle = absoluteTitle ?? title;

  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    alternates: {
      canonical: url,
      ...(languages ? { languages } : {}),
    },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: ogLocale[locale],
      alternateLocale: Object.entries(ogLocale)
        .filter(([key]) => key !== locale)
        .map(([, value]) => value),
      type: article ? "article" : "website",
      ...(article
        ? {
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime,
            authors: article.authors,
            tags: article.tags,
          }
        : {}),
      images: [{ url: ogImage, width: 1200, height: 630, alt: socialTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: true } : { index: true, follow: true },
  };
}

/**
 * hreflang map for an article, built from the CMS translation group so the
 * emitted alternates always match the language switcher.
 */
export async function getArticleAlternates(article: ArticleFullRow, locale: BlogLocale) {
  const variants = await getLanguageVariants(article.grupa_tlumaczen);
  const paths = new Map<BlogLocale, string>([[locale, articlePath(locale, article.slug)]]);

  for (const variant of variants) {
    const variantLocale = toBlogLocale(variant.jezyk);
    if (variantLocale) {
      paths.set(variantLocale, articlePath(variantLocale, variant.slug));
    }
  }

  const languages: Record<string, string> = {};

  for (const [variantLocale, path] of paths) {
    languages[variantLocale] = absoluteUrl(path);
  }

  languages["x-default"] = absoluteUrl(paths.get("en") ?? paths.get(locale) ?? articlePath(locale, article.slug));

  return { paths, languages };
}

/** Absolute hreflang map for a path that exists in both locales. */
export function symmetricAlternates(paths: Record<BlogLocale, string>) {
  return {
    en: absoluteUrl(paths.en),
    pl: absoluteUrl(paths.pl),
    "x-default": absoluteUrl(paths.en),
  };
}

/**
 * The CMS fallback contract for an article page: CMS SEO fields win, editorial
 * fields are the fallback, and the site defaults close the chain.
 */
export async function createArticleMetadata(article: ArticleFullRow, locale: BlogLocale): Promise<Metadata> {
  const settings = await getSettings();
  const { languages } = await getArticleAlternates(article, locale);
  const title = article.meta_title ?? article.tytul;
  const suffix = settings?.sufiks_title ?? "";
  const description = truncate(article.meta_description ?? article.zajawka ?? "");

  return createBlogMetadata({
    locale,
    title,
    absoluteTitle: `${title}${suffix}`,
    description,
    path: articlePath(locale, article.slug),
    languages,
    image: resolveOgImage(article.og_image, article.obraz_glowny, settings?.domyslny_og_image),
    noIndex: article.noindex === true,
    article: {
      publishedTime: article.data_publikacji,
      modifiedTime: article.updated_at,
      authors: article.autor_nazwa ? [article.autor_nazwa] : undefined,
      tags: article.tagi?.map((tag) => tag.nazwa),
    },
  });
}

/** Shared default OG image for listing and archive pages. */
export async function blogDefaultOgImage(): Promise<string> {
  const settings = await getSettings();
  return resolveOgImage(settings?.domyslny_og_image);
}

export function blogCanonical(locale: BlogLocale) {
  return absoluteUrl(blogIndexPath(locale));
}

export { truncate as truncateDescription };
