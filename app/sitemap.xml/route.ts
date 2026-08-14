import { locales } from "@/lib/i18n/config";
import { featureKeys, getFeatureAlternatePaths, localizeFeaturePath } from "@/lib/i18n/features";
import { getAlternatePaths, localizePath, pageKeys } from "@/lib/i18n/routes";
import { absoluteUrl } from "@/lib/seo/site";

/**
 * Built from the same route helpers the navigation uses, rather than kept as a
 * file. The hand-maintained sitemap had drifted: the eight feature pages were
 * never in it, in either language, so sixteen of the pages written for search
 * were the ones search engines were least likely to find.
 */
export const dynamic = "force-static";

type Entry = {
  path: string;
  alternates: Record<string, string>;
  priority: string;
  changefreq: string;
};

function entriesFor(paths: Record<string, string>, alternates: Record<string, string>, priority: string, changefreq: string) {
  return locales.map((locale) => ({ path: paths[locale], alternates, priority, changefreq }));
}

function buildEntries(): Entry[] {
  const pages = pageKeys.flatMap((page) => {
    const alternates = getAlternatePaths(page);
    const paths = Object.fromEntries(locales.map((locale) => [locale, localizePath(locale, page)]));

    return entriesFor(paths, alternates, page === "home" ? "1.0" : "0.7", page === "home" ? "weekly" : "monthly");
  });

  const features = featureKeys.flatMap((feature) => {
    const alternates = getFeatureAlternatePaths(feature);
    const paths = Object.fromEntries(locales.map((locale) => [locale, localizeFeaturePath(locale, feature)]));

    return entriesFor(paths, alternates, "0.6", "monthly");
  });

  return [...pages, ...features];
}

function renderEntry({ path, alternates, priority, changefreq }: Entry) {
  const links = Object.entries(alternates)
    .map(([key, value]) => `<xhtml:link rel="alternate" hreflang="${key}" href="${absoluteUrl(value)}"/>`)
    .join("");

  return `<url><loc>${absoluteUrl(path)}</loc><changefreq>${changefreq}</changefreq><priority>${priority}</priority>${links}</url>`;
}

export function GET() {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${buildEntries().map(renderEntry).join("\n")}
</urlset>`;

  return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8" } });
}
