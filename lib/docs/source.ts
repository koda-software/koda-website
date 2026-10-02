import { docs } from 'collections/server';
import { loader } from 'fumadocs-core/source';

import { defaultLocale, i18n, type Locale } from '@/lib/docs/i18n';

export const source = loader({
  baseUrl: '/docs',
  i18n,
  source: docs.toFumadocsSource(),
  // fumadocs' default URL puts the locale in front of baseUrl (/en/docs/…). The public URLs
  // are /docs/en/…, so build them here.
  url: (slugs, locale) => `/docs/${[locale ?? defaultLocale, ...slugs].join('/')}`,
});

/**
 * True when the page's file is in that locale's own folder. fumadocs also lists the default
 * locale's page under the other locale when no translation exists; those aren't built.
 */
export function isPhysicalLocalePage(
  page: { absolutePath?: string },
  locale: Locale,
): boolean {
  return (
    page.absolutePath
      ?.replaceAll('\\', '/')
      .includes(`content/docs/${locale}/`) ?? false
  );
}
