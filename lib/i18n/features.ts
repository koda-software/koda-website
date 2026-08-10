import { locales, type Locale } from "./config";
import { localizePath } from "./routes";

/**
 * The "Funkcje systemu" pages live under the Opero product page, one segment
 * deep: `/pl/opero/<slug>`. Slugs are localized because these pages target
 * search intent in each market, so unlike the top-level routes they cannot
 * share a single slug across locales.
 */
export type FeatureKey =
  | "processes"
  | "documents"
  | "noCode"
  | "lowCode"
  | "reports"
  | "security"
  | "integrations"
  | "ai";

export const featureKeys: FeatureKey[] = [
  "processes",
  "documents",
  "noCode",
  "lowCode",
  "reports",
  "security",
  "integrations",
  "ai",
];

export const featureSlugs: Record<FeatureKey, Record<Locale, string>> = {
  processes: { en: "process-workflow", pl: "procesy-workflow" },
  documents: { en: "document-management", pl: "eod-dms" },
  noCode: { en: "no-code", pl: "no-code" },
  lowCode: { en: "low-code-automation", pl: "low-code-automatyzacje" },
  reports: { en: "reports-analytics", pl: "raporty" },
  security: { en: "security-permissions", pl: "bezpieczenstwo-uprawnienia" },
  integrations: { en: "integrations-compliance", pl: "integracje-zgodnosc" },
  ai: { en: "contextual-ai", pl: "kontekstowe-ai" },
};

export function localizeFeaturePath(locale: Locale, feature: FeatureKey): string {
  return `${localizePath(locale, "opero")}/${featureSlugs[feature][locale]}`;
}

export function getFeatureAlternatePaths(feature: FeatureKey): Record<Locale | "x-default", string> {
  const englishPath = localizeFeaturePath("en", feature);

  return {
    en: englishPath,
    pl: localizeFeaturePath("pl", feature),
    "x-default": englishPath,
  };
}

export function featureFromSlug(locale: Locale, slug: string): FeatureKey | undefined {
  return featureKeys.find((feature) => featureSlugs[feature][locale] === slug);
}

export function getAllFeatureRoutes() {
  return featureKeys.flatMap((feature) =>
    locales.map((locale) => ({ feature, locale, path: localizeFeaturePath(locale, feature) })),
  );
}
