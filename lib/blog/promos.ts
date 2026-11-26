import { blogContent as enBlog } from "@/content/en/blog";
import { featurePages as enFeatures } from "@/content/en/features";
import { blogContent as plBlog } from "@/content/pl/blog";
import { toolPages as enTools } from "@/content/en/tools";
import { featurePages as plFeatures } from "@/content/pl/features";
import { toolPages as plTools } from "@/content/pl/tools";
import { deployPick, deployPickMany } from "@/lib/deploy-rotation";
import { featureKeys, localizeFeaturePath, type FeatureKey } from "@/lib/i18n/features";
import { localizeToolPath, toolKeys, type ToolKey } from "@/lib/i18n/tools";
import { safeHref } from "./faq";
import { blogImageSrc } from "./images";
import type { BlogLocale, SystemFeatureRow } from "./types";

/**
 * The blog's internal ads: free tools, read from the tool pages' content, and
 * Opero features, read from the "Funkcja systemu" records in Opero.
 *
 * An article can pick its feature in Opero; every other page draws one from the
 * active records. Which one a slot shows is decided per deployment
 * (lib/deploy-rotation.ts) and per page: two articles show different tools,
 * and each keeps its own for as long as the deployment lives.
 */

export type ToolPromo = { key: ToolKey; name: string; description: string; href: string };

export type FeaturePromo = {
  /** The Opero record id, or a feature page key in the fallback below. */
  key: string;
  name: string;
  description: string;
  href: string;
  /** Proxy URL of the illustration; a promo without one shows no picture. */
  image?: string;
  imageAlt?: string;
  /** The link's own text; feature pages use `ui.promos.featureLink` with their name. */
  linkLabel?: string;
};

const tools = { en: enTools, pl: plTools };
const features = { en: enFeatures, pl: plFeatures };
const blogUi = { en: enBlog, pl: plBlog };

/**
 * A "Funkcja systemu" record as a promo. Records without a title or with a link
 * that is not a site path or a web address are skipped rather than shown broken.
 */
export function systemFeaturePromo(locale: BlogLocale, row: SystemFeatureRow): FeaturePromo | null {
  const href = row.link ? safeHref(row.link) : null;

  if (!row.tytul?.trim() || !href) return null;

  return {
    key: row.id,
    name: row.tytul,
    description: row.opis ?? "",
    href,
    image: blogImageSrc(row.obraz) ?? undefined,
    imageAlt: row.obraz_alt ?? undefined,
    linkLabel: row.etykieta_linku?.trim() || blogUi[locale].promos.howItWorks,
  };
}

/** One reviewed screenshot per feature page, for the fallback below. */
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

/** The eight feature pages, used only while Opero has no active "Funkcja systemu" records. */
function featurePagePromos(locale: BlogLocale): FeaturePromo[] {
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
  /**
   * A second feature for the card inside an article; never the same as
   * `feature`, unless the editors chose the feature, which then fills both.
   */
  inlineFeature: FeaturePromo | undefined;
  /** True when the article's own "Funkcja systemu" decided the feature. */
  chosen: boolean;
};

type PromoSources = {
  /** Active "Funkcja systemu" records in this locale, the rotation's pool. */
  features: SystemFeatureRow[];
  /** The article's own pick, already resolved to this locale. */
  chosen?: SystemFeatureRow | null;
};

/** `pageKey` is the page's own path or slug: it spreads the pool across pages. */
export function blogPromos(locale: BlogLocale, pageKey: string, sources: PromoSources): BlogPromos {
  const allTools = toolPromos(locale);
  // One draw of five in a row gives the card its tool and the list four others.
  const [tool, ...toolList] = deployPickMany(allTools, `tool:${pageKey}`, 5);
  const toolSlots = { tool, toolList, toolCount: allTools.length };

  const chosen = sources.chosen ? systemFeaturePromo(locale, sources.chosen) : null;

  if (chosen) {
    return { ...toolSlots, feature: chosen, inlineFeature: chosen, chosen: true };
  }

  const fromOpero = sources.features.map((row) => systemFeaturePromo(locale, row)).filter((promo) => promo !== null);
  const pool = fromOpero.length > 0 ? fromOpero : featurePagePromos(locale);
  const feature = deployPick(pool, `feature:${pageKey}`);
  const inlineFeature = deployPick(
    pool.filter((item) => item.key !== feature?.key),
    `inline-feature:${pageKey}`,
  );

  return { ...toolSlots, feature, inlineFeature, chosen: false };
}
