import { locales } from '@/lib/docs/i18n';
import { isPhysicalLocalePage, source } from '@/lib/docs/source';
import { absoluteUrl } from '@/lib/seo/site';

function xmlEscape(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

/**
 * Every docs page that is built, with hreflang links to its translations. No <lastmod>: the
 * pages are rebuilt nightly, and a build time on every URL teaches crawlers to ignore it.
 */
export function renderDocsSitemap(): string {
  const urls = locales.flatMap((locale) =>
    source
      .getPages(locale)
      .filter((page) => isPhysicalLocalePage(page, locale))
      .map((page) => {
        const alternates: Array<[string, string]> = [];

        for (const other of locales) {
          const twin = source.getPage(page.slugs, other);

          if (twin && isPhysicalLocalePage(twin, other)) {
            alternates.push([other, absoluteUrl(twin.url)]);
          }
        }

        const english = alternates.find(([hreflang]) => hreflang === 'en');

        if (english) {
          alternates.push(['x-default', english[1]]);
        }

        const links = alternates
          .map(
            ([hreflang, href]) =>
              `<xhtml:link rel="alternate" hreflang="${hreflang}" href="${xmlEscape(href)}"/>`,
          )
          .join('');

        return `  <url><loc>${xmlEscape(absoluteUrl(page.url))}</loc>${links}</url>`;
      }),
  );

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}
