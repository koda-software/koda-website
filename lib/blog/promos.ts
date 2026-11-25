import { featurePages as enFeatures } from "@/content/en/features";
import { toolPages as enTools } from "@/content/en/tools";
import { featurePages as plFeatures } from "@/content/pl/features";
import { toolPages as plTools } from "@/content/pl/tools";
import { deployPick, deployPickMany } from "@/lib/deploy-rotation";
import { featureKeys, localizeFeaturePath, type FeatureKey } from "@/lib/i18n/features";
import { localizeToolPath, toolKeys, type ToolKey } from "@/lib/i18n/tools";
import type { BlogLocale } from "./types";

/**
 * The blog's internal ads: free tools and Opero features, read from the same
 * content the tool and feature pages use, so a promo can never name something
 * that has no page.
 *
 * Which one a slot shows is decided per deployment (lib/deploy-rotation.ts) and
 * per page: two articles show different tools, and each keeps its own for as
 * long as the deployment lives.
 */

export type ToolPromo = { key: ToolKey; name: string; description: string; href: string };

export type FeaturePromo = {
  key: FeatureKey;
  name: string;
  description: string;
  href: string;
  image: string;
};

const tools = { en: enTools, pl: plTools };
const features = { en: enFeatures, pl: plFeatures };

/** One reviewed screenshot per feature, the one its own page opens on. */
const featureImages: Record<FeatureKey, string> = {
  processes: "/opero/processes/process-board.webp",
  documents: "/opero/documents/hero-case-record.webp",
  noCode: "/opero/no-code/view-layout-hero.webp",
  lowCode: "/opero/low-code/rule-canvas-hero.webp",
  reports: "/opero/reports/hero.webp",
  security: "/opero/security/roles-hero.webp",
  integrations: "/opero/integrations/rule-webhook-hero.webp",
  ai: "/opero/ai/ticket-triage-rule.webp",
};

function toolPromos(locale: BlogLocale): ToolPromo[] {
  return toolKeys.map((key) => ({
    key,
    name: tools[locale][key].navLabel,
    description: tools[locale][key].navDescription,
    href: localizeToolPath(locale, key),
  }));
}

function featurePromos(locale: BlogLocale): FeaturePromo[] {
  return featureKeys.map((key) => ({
    key,
    name: features[locale][key].navLabel,
    description: features[locale][key].hero.description,
    href: localizeFeaturePath(locale, key),
    image: featureImages[key],
  }));
}

export type BlogPromos = {
  /** The single tool a card promotes. */
  tool: ToolPromo | undefined;
  /** The short list in the rail; never includes `tool`. */
  toolList: ToolPromo[];
  toolCount: number;
  /** The feature on the rail's product card. */
  feature: FeaturePromo | undefined;
  /** A second feature for the card inside an article; never the same as `feature`. */
  inlineFeature: FeaturePromo | undefined;
};

/** `pageKey` is the page's own path or slug: it spreads the pool across pages. */
export function blogPromos(locale: BlogLocale, pageKey: string): BlogPromos {
  const allTools = toolPromos(locale);
  const allFeatures = featurePromos(locale);
  // One draw of five in a row gives the card its tool and the list four others.
  const [tool, ...toolList] = deployPickMany(allTools, `tool:${pageKey}`, 5);
  const feature = deployPick(allFeatures, `feature:${pageKey}`);
  const inlineFeature = deployPick(
    allFeatures.filter((item) => item.key !== feature?.key),
    `inline-feature:${pageKey}`,
  );

  return { tool, toolList, toolCount: allTools.length, feature, inlineFeature };
}
