import { defaultLocale, type Locale, locales } from "./config";

export type PageKey = "home" | "opero" | "solutions" | "blog" | "contact";

export const pageSlugs: Record<Exclude<PageKey, "home">, string> = {
  opero: "opero",
  solutions: "solutions",
  blog: "blog",
  contact: "contact",
};

export const pageKeys: PageKey[] = ["home", "opero", "solutions", "blog", "contact"];

export function localizePath(locale: Locale, page: PageKey): string {
  if (page === "home") {
    return locale === defaultLocale ? "/" : `/${locale}`;
  }

  return `/${locale}/${pageSlugs[page]}`;
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
