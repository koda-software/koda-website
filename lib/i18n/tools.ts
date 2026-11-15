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
export type ToolKey = "amountInWords" | "whiteList" | "ksefViewer";

export const toolKeys: ToolKey[] = ["amountInWords", "whiteList", "ksefViewer"];

export const toolSlugs: Record<ToolKey, Record<Locale, string>> = {
  amountInWords: { en: "amount-in-words", pl: "kwota-slownie" },
  whiteList: { en: "polish-vat-whitelist-check", pl: "biala-lista-vat" },
  ksefViewer: { en: "ksef-invoice-viewer", pl: "podglad-faktury-ksef" },
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
