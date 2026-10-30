import { siteConfig } from '@/lib/seo/site';

export const siteName = 'Opero Docs';
export const siteDescription =
  'Documentation for Opero integrations, API tokens, and API workflows.';
export const docsBasePath = '/docs';

export function getSiteUrl(): URL {
  return new URL(siteConfig.url);
}

export function getSupportEmail(): string {
  return process.env.SUPPORT_EMAIL ?? 'damian@kodasoft.pl';
}

/** Adds /docs unless the path already starts with it, so `/en/x` and `/docs/en/x` both work. */
export function withDocsBasePath(path = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  if (cleanPath === docsBasePath || cleanPath.startsWith(`${docsBasePath}/`)) {
    return cleanPath;
  }

  return `${docsBasePath}${cleanPath === '/' ? '' : cleanPath}`;
}

export function getPublicUrl(path = ''): string {
  return new URL(withDocsBasePath(path), getSiteUrl()).toString();
}

/**
 * The page intro, cut at a word to fit a search result. Knowledge-base summaries run to
 * 200 characters; the page itself still shows them in full.
 */
export function metaDescription(text: string | undefined, max = 160): string | undefined {
  if (!text || text.length <= max) return text;

  const cut = text.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,.;:–—-]+$/, '')}…`;
}

/** The site-wide 1200×630 share card; docs pages had none, so shared links rendered bare. */
export const docsOgImage = {
  url: new URL(siteConfig.defaultOgImage, siteConfig.url).toString(),
  width: 1200,
  height: 630,
  alt: `${siteConfig.name} and ${siteConfig.productName}`,
};
