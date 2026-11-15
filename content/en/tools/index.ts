import { localizeFeaturePath } from "@/lib/i18n/features";
import { localizePath } from "@/lib/i18n/routes";
import { localizeToolPath, toolKeys, type ToolKey } from "@/lib/i18n/tools";
import type { ToolPageContent, ToolsIndexContent } from "@/content/types";
import { amountInWordsPage } from "./amount-in-words";
import { ksefViewerPage } from "./ksef-viewer";
import { whiteListPage } from "./white-list";

export const toolsIndexContent: ToolsIndexContent = {
  seo: {
    title: "Free tools for business and accounting in Poland",
    description: "Free online tools for companies and accountants working in Poland, starting with amount in words. No sign-up, and your data stays in the browser.",
  },
  navLabel: "Tools",
  breadcrumbLabel: "Breadcrumb",
  hero: {
    title: "Free tools for business in Poland",
    description: "Simple tools for everyday business and accounting work in Poland. No sign-up, and what you type stays in your browser.",
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
  return { primary: localizePath("en", "contact"), secondary: localizeFeaturePath("en", toolFeature[tool]) };
}

export const toolLinks = toolKeys.map((tool) => ({
  tool,
  href: localizeToolPath("en", tool),
  label: toolPages[tool].navLabel,
  description: toolPages[tool].navDescription,
}));
