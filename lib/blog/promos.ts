import { articlePromos as enArticlePromos } from "@/content/en/article-promos";
import { blogContent as enBlog } from "@/content/en/blog";
import { featurePages as enFeatures } from "@/content/en/features";
import { articlePromos as plArticlePromos } from "@/content/pl/article-promos";
import { blogContent as plBlog } from "@/content/pl/blog";
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
  /** A feature page key, or an article promo key when the editors chose one. */
  key: string;
  name: string;
  description: string;
  href: string;
  image: string;
  /** The link's own text; feature pages use `ui.promos.featureLink` with their name. */
  linkLabel?: string;
};

/**
 * The selling points an editor can attach to one article in Opero, through the
 * "Promowana funkcja" field. The keys are the entry keys of the Opero dictionary
 * `blog-promowana-funkcja`: a new item needs an entry there, one here and its
 * copy in content/{pl,en}/article-promos.ts.
 */
export const articlePromoKeys = [
  "obieg-faktur-ksef",
  "sciezki-akceptacji",
  "projektant-procesow",
  "zadania-i-kanban",
  "rejestr-dokumentow",
  "podglad-plikow",
  "szablony-dokumentow",
  "powiadomienia-o-terminach",
  "reguly-automatyzacji",
  "zapytania-sql-i-bloki",
  "rejestr-zamiast-arkusza",
  "formularze-per-rola",
  "formularz-publiczny",
  "strona-startowa",
  "platforma-no-code",
  "raporty-z-drazeniem",
  "lejek-sprzedazy",
  "historia-zmian",
  "uprawnienia-do-pol",
  "wiele-spolek",
  "api-i-webhooki",
  "asystent-ai",
] as const;

export type ArticlePromoKey = (typeof articlePromoKeys)[number];

/**
 * The feature page each article promo links to. Its illustration is
 * `public/opero/promos/<key>.webp`: 1024×640, one flat style shared by the
 * whole set, so a new item needs an image drawn to match.
 */
const articlePromoFeature: Record<ArticlePromoKey, FeatureKey> = {
  "obieg-faktur-ksef": "integrations",
  "sciezki-akceptacji": "processes",
  "projektant-procesow": "processes",
  "zadania-i-kanban": "processes",
  "rejestr-dokumentow": "documents",
  "podglad-plikow": "documents",
  "szablony-dokumentow": "documents",
  "powiadomienia-o-terminach": "lowCode",
  "reguly-automatyzacji": "lowCode",
  "zapytania-sql-i-bloki": "lowCode",
  "rejestr-zamiast-arkusza": "noCode",
  "formularze-per-rola": "noCode",
  "formularz-publiczny": "noCode",
  "strona-startowa": "noCode",
  "platforma-no-code": "noCode",
  "raporty-z-drazeniem": "reports",
  "lejek-sprzedazy": "reports",
  "historia-zmian": "security",
  "uprawnienia-do-pol": "security",
  "wiele-spolek": "security",
  "api-i-webhooki": "integrations",
  "asystent-ai": "ai",
};

export function isArticlePromoKey(value: string | null | undefined): value is ArticlePromoKey {
  return typeof value === "string" && (articlePromoKeys as readonly string[]).includes(value);
}

const tools = { en: enTools, pl: plTools };
const features = { en: enFeatures, pl: plFeatures };
const articlePromoCopy = { en: enArticlePromos, pl: plArticlePromos };
const blogUi = { en: enBlog, pl: plBlog };

function articlePromo(locale: BlogLocale, key: ArticlePromoKey): FeaturePromo {

  return {
    key,
    ...articlePromoCopy[locale][key],
    href: localizeFeaturePath(locale, articlePromoFeature[key]),
    image: `/opero/promos/${key}.webp`,
    linkLabel: blogUi[locale].promos.howItWorks,
  };
}

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
  /**
   * A second feature for the card inside an article; never the same as
   * `feature`, unless the editors chose the promo, which then fills both.
   */
  inlineFeature: FeaturePromo | undefined;
  /** True when the article's own "Promowana funkcja" decided the feature. */
  chosen: boolean;
};

/**
 * `pageKey` is the page's own path or slug: it spreads the pool across pages.
 * `promoKey` is the article's "Promowana funkcja"; an unknown or empty key
 * falls back to the rotation.
 */
export function blogPromos(locale: BlogLocale, pageKey: string, promoKey?: string | null): BlogPromos {
  const allTools = toolPromos(locale);
  // One draw of five in a row gives the card its tool and the list four others.
  const [tool, ...toolList] = deployPickMany(allTools, `tool:${pageKey}`, 5);
  const toolSlots = { tool, toolList, toolCount: allTools.length };

  if (isArticlePromoKey(promoKey)) {
    const chosen = articlePromo(locale, promoKey);
    return { ...toolSlots, feature: chosen, inlineFeature: chosen, chosen: true };
  }

  const allFeatures = featurePromos(locale);
  const feature = deployPick(allFeatures, `feature:${pageKey}`);
  const inlineFeature = deployPick(
    allFeatures.filter((item) => item.key !== feature?.key),
    `inline-feature:${pageKey}`,
  );

  return { ...toolSlots, feature, inlineFeature, chosen: false };
}
