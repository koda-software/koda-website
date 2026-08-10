import { featureKeys, localizeFeaturePath } from "@/lib/i18n/features";
import { localizePath } from "@/lib/i18n/routes";
import type { FeaturePagesContent, NavSubItem } from "@/content/types";
import { aiFeature } from "./ai";
import { documentsFeature } from "./documents";
import { integrationsFeature } from "./integrations";
import { lowCodeFeature } from "./low-code";
import { noCodeFeature } from "./no-code";
import { processesFeature } from "./processes";
import { reportsFeature } from "./reports";
import { securityFeature } from "./security";

export const featurePages: FeaturePagesContent = {
  processes: processesFeature,
  documents: documentsFeature,
  noCode: noCodeFeature,
  lowCode: lowCodeFeature,
  reports: reportsFeature,
  security: securityFeature,
  integrations: integrationsFeature,
  ai: aiFeature,
};

/** Ordered entries for the Opero dropdown, the footer and the related-pages block. */
export const featureNavItems: NavSubItem[] = featureKeys.map((feature) => ({
  feature,
  label: featurePages[feature].navLabel,
  href: localizeFeaturePath("pl", feature),
}));

export const featureCtas = {
  primary: localizePath("pl", "contact"),
  secondary: localizePath("pl", "opero"),
};
