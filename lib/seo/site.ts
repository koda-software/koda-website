import { getAllLocalizedRoutes, localizePath, pageKeys, type PageKey } from "@/lib/i18n/routes";
import type { Locale } from "@/lib/i18n/config";

export const siteConfig = {
  name: "Koda Soft",
  productName: "Opero",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://kodasoft.pl",
  defaultOgImage: "/og-image.svg",
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
