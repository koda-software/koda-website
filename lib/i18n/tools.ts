import { locales, type Locale } from "./config";
import { localizePath } from "./routes";

/**
 * The free tools live one segment under the tools index: `/pl/narzedzia/<slug>`
 * and `/en/tools/<slug>`. Slugs are localized, like the feature pages, because
 * each one targets the search phrase people use in that language.
 *
 * Add a key here only when its page exists: the index, the sitemap and the
 * "other tools" links all read this list.
 */
export type ToolKey = "vatCalculator" | "nbpRate" | "b2bVsEmployment" | "amountInWords" | "whiteList" | "eDelivery" | "ksefViewer" | "jpkViewer";

export const toolKeys: ToolKey[] = ["vatCalculator", "nbpRate", "b2bVsEmployment", "amountInWords", "whiteList", "eDelivery", "ksefViewer", "jpkViewer"];

export const toolSlugs: Record<ToolKey, Record<Locale, string>> = {
  vatCalculator: { en: "polish-vat-calculator", pl: "kalkulator-vat" },
  nbpRate: { en: "nbp-exchange-rate", pl: "kurs-nbp-do-faktury" },
  b2bVsEmployment: { en: "b2b-vs-employment-poland", pl: "kalkulator-b2b-uop" },
  amountInWords: { en: "amount-in-words", pl: "kwota-slownie" },
  whiteList: { en: "polish-vat-whitelist-check", pl: "biala-lista-vat" },
  eDelivery: { en: "polish-e-delivery-address-search", pl: "wyszukiwarka-adresow-e-doreczen" },
  ksefViewer: { en: "ksef-invoice-viewer", pl: "podglad-faktury-ksef" },
  jpkViewer: { en: "jpk-file-viewer", pl: "podglad-pliku-jpk" },
};

export function localizeToolPath(locale: Locale, tool: ToolKey): string {
  return `${localizePath(locale, "tools")}/${toolSlugs[tool][locale]}`;
}

export function getToolAlternatePaths(tool: ToolKey): Record<Locale | "x-default", string> {
  const englishPath = localizeToolPath("en", tool);

  return {
    en: englishPath,
    pl: localizeToolPath("pl", tool),
    "x-default": englishPath,
  };
}

export function toolFromSlug(locale: Locale, slug: string): ToolKey | undefined {
  return toolKeys.find((tool) => toolSlugs[tool][locale] === slug);
}

export function getAllToolRoutes() {
  return toolKeys.flatMap((tool) => locales.map((locale) => ({ tool, locale, path: localizeToolPath(locale, tool) })));
}
