export const locales = ["en", "pl"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/**
 * The language served at `/`. Poland is the first market, so the Polish homepage sits at
 * the root with no language redirect, and the English one at `/en`. Every other page keeps
 * its locale prefix. `defaultLocale` stays English: it is the docs' default language and
 * the x-default for visitors in neither language.
 */
export const rootLocale: Locale = "pl";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  pl: "Polski",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
