import { localizeFeaturePath } from "@/lib/i18n/features";
import { localizePath } from "@/lib/i18n/routes";
import { localizeToolPath, toolKeys, type ToolKey } from "@/lib/i18n/tools";
import type { ToolPageContent, ToolsIndexContent } from "@/content/types";
import { amountInWordsPage } from "./amount-in-words";
import { b2bVsEmploymentPage } from "./b2b-vs-employment";
import { counterpartyPage } from "./counterparty";
import { eDeliveryPage } from "./e-delivery";
import { jpkViewerPage } from "./jpk-viewer";
import { ksefViewerPage } from "./ksef-viewer";
import { lateInterestPage } from "./late-interest";
import { nbpRatePage } from "./nbp-rate";
import { salaryCalculatorPage } from "./salary-calculator";
import { vatCalculatorPage } from "./vat-calculator";
import { whiteListPage } from "./white-list";
import { workingTimePage } from "./working-time";

export const toolsIndexContent: ToolsIndexContent = {
  seo: {
    title: "Darmowe narzędzia dla firm i księgowości",
    description: "Darmowe narzędzia dla firm: kalkulator wynagrodzeń, VAT i odsetek, wymiar czasu pracy, sprawdzenie kontrahenta, kurs NBP, e-Doręczenia, KSeF i JPK.",
  },
  navLabel: "Narzędzia",
  breadcrumbLabel: "Ścieżka nawigacji",
  hero: {
    title: "Darmowe narzędzia dla firm",
    description: "Proste narzędzia do codziennej pracy w firmie i księgowości. Bez rejestracji i bez zapisywania tego, co wpisujesz.",
  },
};

export const toolPages: Record<ToolKey, ToolPageContent> = {
  vatCalculator: vatCalculatorPage,
  nbpRate: nbpRatePage,
  lateInterest: lateInterestPage,
  b2bVsEmployment: b2bVsEmploymentPage,
  salaryCalculator: salaryCalculatorPage,
  workingTime: workingTimePage,
  amountInWords: amountInWordsPage,
  whiteList: whiteListPage,
  counterpartyCheck: counterpartyPage,
  eDelivery: eDeliveryPage,
  ksefViewer: ksefViewerPage,
  jpkViewer: jpkViewerPage,
};

/** Where each tool's Opero link points: the feature that does the same job inside Opero. */
const toolFeature = {
  vatCalculator: "documents",
  nbpRate: "documents",
  lateInterest: "ai",
  b2bVsEmployment: "processes",
  salaryCalculator: "processes",
  workingTime: "lowCode",
  amountInWords: "documents",
  whiteList: "integrations",
  counterpartyCheck: "integrations",
  eDelivery: "documents",
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
