import { localizeFeaturePath } from "@/lib/i18n/features";
import { localizePath } from "@/lib/i18n/routes";
import { localizeToolPath, toolKeys, type ToolKey } from "@/lib/i18n/tools";
import type { ToolPageContent, ToolsIndexContent } from "@/content/types";
import { amountInWordsPage } from "./amount-in-words";
import { b2bVsEmploymentPage } from "./b2b-vs-employment";
import { jpkViewerPage } from "./jpk-viewer";
import { ksefViewerPage } from "./ksef-viewer";
import { nbpRatePage } from "./nbp-rate";
import { vatCalculatorPage } from "./vat-calculator";
import { whiteListPage } from "./white-list";

export const toolsIndexContent: ToolsIndexContent = {
  seo: {
    title: "Darmowe narzędzia dla firm i księgowości",
    description: "Darmowe narzędzia dla firm i biur rachunkowych: kalkulator VAT i B2B vs UoP, kurs NBP, kwota słownie, biała lista VAT, podgląd faktury KSeF i pliku JPK.",
  },
  navLabel: "Narzędzia",
  breadcrumbLabel: "Ścieżka nawigacji",
  hero: {
    title: "Darmowe narzędzia dla firm",
    description: "Proste narzędzia do codziennej pracy w firmie i księgowości. Bez rejestracji, a to, co wpisujesz, zostaje w Twojej przeglądarce.",
  },
};

export const toolPages: Record<ToolKey, ToolPageContent> = {
  vatCalculator: vatCalculatorPage,
  nbpRate: nbpRatePage,
  b2bVsEmployment: b2bVsEmploymentPage,
  amountInWords: amountInWordsPage,
  whiteList: whiteListPage,
  ksefViewer: ksefViewerPage,
  jpkViewer: jpkViewerPage,
};

/** Where each tool's Opero link points: the feature that does the same job inside Opero. */
const toolFeature = {
  vatCalculator: "documents",
  nbpRate: "documents",
  b2bVsEmployment: "processes",
  amountInWords: "documents",
  whiteList: "integrations",
  ksefViewer: "integrations",
  jpkViewer: "integrations",
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
