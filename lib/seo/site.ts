import { getAllLocalizedRoutes, localizePath, pageKeys, type PageKey } from "@/lib/i18n/routes";
import type { Locale } from "@/lib/i18n/config";

export const siteConfig = {
  name: "KodaSoft",
  productName: "Opero",
  url: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || "https://www.kodasoft.pl"),
  defaultOgImage: "/og-image.png",
  logo: "/branding/kodasoft-logo.svg",
  /**
   * One plain sentence about what the company makes. Assistants answering
   * "who builds Opero" quote the Organization record, so it says the thing
   * outright rather than leaving it to be inferred from the pages.
   */
  description:
    "KodaSoft builds Opero, a low-code BPM platform for modelling business processes, document workflow, automation, reporting and permissions on one data model.",
  /**
   * Profiles that confirm the company is the same entity across the web. Add
   * the real URLs (LinkedIn, GitHub, company registers) as they exist: this is
   * what lets a search or answer engine connect the site to everything else
   * written about KodaSoft. Empty entries are dropped.
   */
  sameAs: ["https://www.linkedin.com/company/kodasoftpl/"],
};

export const routeMap = pageKeys.map((page) => ({
  page,
  paths: {
    en: localizePath("en", page),
    pl: localizePath("pl", page),
  } satisfies Record<Locale, string>,
}));

export const sitemapRoutes = getAllLocalizedRoutes();

export function getRoutePath(page: PageKey, locale: Locale) {
  return localizePath(locale, page);
}

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

function normalizeSiteUrl(url: string) {
  const parsedUrl = new URL(url);

  if (parsedUrl.hostname === "kodasoft.pl") {
    parsedUrl.hostname = "www.kodasoft.pl";
  }

  return parsedUrl.toString().replace(/\/$/, "");
}
