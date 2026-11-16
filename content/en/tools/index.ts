import { localizeFeaturePath } from "@/lib/i18n/features";
import { localizePath } from "@/lib/i18n/routes";
import { localizeToolPath, toolKeys, type ToolKey } from "@/lib/i18n/tools";
import type { ToolPageContent, ToolsIndexContent } from "@/content/types";
import { amountInWordsPage } from "./amount-in-words";
import { b2bVsEmploymentPage } from "./b2b-vs-employment";
import { eDeliveryPage } from "./e-delivery";
import { jpkViewerPage } from "./jpk-viewer";
import { ksefViewerPage } from "./ksef-viewer";
import { nbpRatePage } from "./nbp-rate";
import { vatCalculatorPage } from "./vat-calculator";
import { whiteListPage } from "./white-list";

export const toolsIndexContent: ToolsIndexContent = {
  seo: {
    title: "Free tools for business and accounting in Poland",
    description: "Free tools for companies in Poland: VAT and B2B vs employment calculators, NBP rate, amount in words, White List, e-Delivery address, KSeF and JPK viewers.",
  },
  navLabel: "Tools",
  breadcrumbLabel: "Breadcrumb",
  hero: {
    title: "Free tools for business in Poland",
    description: "Simple tools for everyday business and accounting work in Poland. No sign-up, and nothing you type is stored.",
  },
};

export const toolPages: Record<ToolKey, ToolPageContent> = {
  vatCalculator: vatCalculatorPage,
  nbpRate: nbpRatePage,
  b2bVsEmployment: b2bVsEmploymentPage,
  amountInWords: amountInWordsPage,
  whiteList: whiteListPage,
  eDelivery: eDeliveryPage,
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
  eDelivery: "documents",
  ksefViewer: "integrations",
  jpkViewer: "integrations",
} as const satisfies Record<ToolKey, Parameters<typeof localizeFeaturePath>[1]>;

export function toolCtas(tool: ToolKey) {
  return { primary: localizePath("en", "contact"), secondary: localizeFeaturePath("en", toolFeature[tool]) };
}

export const toolLinks = toolKeys.map((tool) => ({
  tool,
  href: localizeToolPath("en", tool),
  label: toolPages[tool].navLabel,
  description: toolPages[tool].navDescription,
}));
