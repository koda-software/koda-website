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
