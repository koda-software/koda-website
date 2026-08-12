import { defaultLocale, type Locale, locales } from "./config";

export type PageKey = "home" | "opero" | "solutions" | "blog" | "about" | "contact";

/**
 * Slug per page and locale, mirroring how the feature pages are addressed. Most
 * pages deliberately keep the same slug in both languages - the words are the
 * product's own vocabulary and the URLs are already indexed - but a page whose
 * name is ordinary language reads better translated, the way `/pl/o-nas` does.
 */
export const pageSlugs: Record<Exclude<PageKey, "home">, Record<Locale, string>> = {
  opero: { en: "opero", pl: "opero" },
  solutions: { en: "solutions", pl: "solutions" },
  blog: { en: "blog", pl: "blog" },
  about: { en: "about", pl: "o-nas" },
  contact: { en: "contact", pl: "contact" },
};

export const pageKeys: PageKey[] = ["home", "opero", "solutions", "blog", "about", "contact"];

export function localizePath(locale: Locale, page: PageKey): string {
  if (page === "home") {
    return locale === defaultLocale ? "/" : `/${locale}`;
  }

  return `/${locale}/${pageSlugs[page][locale]}`;
}

export function getAlternatePaths(page: PageKey): Record<Locale | "x-default", string> {
  const englishPath = localizePath("en", page);

  return {
    en: englishPath,
    pl: localizePath("pl", page),
    "x-default": englishPath,
  };
}

export function getRouteLocale(pathname: string): Locale {
  if (pathname === "/pl" || pathname.startsWith("/pl/")) return "pl";
  return defaultLocale;
}

export function getAllLocalizedRoutes() {
  return pageKeys.flatMap((page) => locales.map((locale) => ({ page, locale, path: localizePath(locale, page) })));
}
