import { localizeFeaturePath } from "@/lib/i18n/features";
import { localizePath } from "@/lib/i18n/routes";
import { localizeToolPath, toolKeys, type ToolKey } from "@/lib/i18n/tools";
import type { ToolPageContent, ToolsIndexContent } from "@/content/types";
import { amountInWordsPage } from "./amount-in-words";
import { ksefViewerPage } from "./ksef-viewer";
import { whiteListPage } from "./white-list";

export const toolsIndexContent: ToolsIndexContent = {
  seo: {
    title: "Darmowe narzędzia dla firm i księgowości",
    description: "Darmowe narzędzia online dla firm i biur rachunkowych: kwota słownie i kolejne. Bez rejestracji, dane zostają w przeglądarce.",
  },
  navLabel: "Narzędzia",
  breadcrumbLabel: "Ścieżka nawigacji",
  hero: {
    title: "Darmowe narzędzia dla firm",
    description: "Proste narzędzia do codziennej pracy w firmie i księgowości. Bez rejestracji, a to, co wpisujesz, zostaje w Twojej przeglądarce.",
  },
};

export const toolPages: Record<ToolKey, ToolPageContent> = {
  amountInWords: amountInWordsPage,
  whiteList: whiteListPage,
  ksefViewer: ksefViewerPage,
};

/** Where each tool's Opero link points: the feature that does the same job inside Opero. */
const toolFeature = {
  amountInWords: "documents",
  whiteList: "integrations",
  ksefViewer: "integrations",
} as const satisfies Record<ToolKey, Parameters<typeof localizeFeaturePath>[1]>;

export function toolCtas(tool: ToolKey) {
  return { primary: localizePath("pl", "contact"), secondary: localizeFeaturePath("pl", toolFeature[tool]) };
}

export const toolLinks = toolKeys.map((tool) => ({
  tool,
  href: localizeToolPath("pl", tool),
  label: toolPages[tool].navLabel,
  description: toolPages[tool].navDescription,
}));
