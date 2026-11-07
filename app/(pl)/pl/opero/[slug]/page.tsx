import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { commonContent, navItems } from "@/content/pl/common";
import { featureCtas, featurePages } from "@/content/pl/features";
import { aiPage } from "@/content/pl/features/ai";
import { noCodePage } from "@/content/pl/features/no-code";
import { documentsPage } from "@/content/pl/features/documents";
import { integrationsPage } from "@/content/pl/features/integrations";
import { lowCodePage } from "@/content/pl/features/low-code";
import { processesPage } from "@/content/pl/features/processes";
import { reportsPage } from "@/content/pl/features/reports";
import { securityPage } from "@/content/pl/features/security";
import { ProcessesFeaturePage } from "@/components/layout/features/ProcessesFeaturePage";
import { DocumentsFeaturePage } from "@/components/layout/features/DocumentsFeaturePage";
import { LowCodeFeaturePage } from "@/components/layout/features/LowCodeFeaturePage";
import { ReportsFeaturePage } from "@/components/layout/features/ReportsFeaturePage";
import { SecurityFeaturePage } from "@/components/layout/features/SecurityFeaturePage";
import { IntegrationsFeaturePage } from "@/components/layout/features/IntegrationsFeaturePage";
import { AiFeaturePage } from "@/components/layout/AiFeaturePage";
import { NoCodeFeaturePage } from "@/components/layout/NoCodeFeaturePage";
import { PageShell } from "@/components/layout/PageShell";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/lib/seo/json-ld";
import { createFeaturePageMetadata } from "@/lib/seo/metadata";
import { featureFromSlug, featureKeys, featureSlugs, getFeatureAlternatePaths, localizeFeaturePath } from "@/lib/i18n/features";
import { localizePath } from "@/lib/i18n/routes";

/** The eight feature slugs are the only valid children of /pl/opero. */
export const dynamicParams = false;

export function generateStaticParams() {
  return featureKeys.map((feature) => ({ slug: featureSlugs[feature].pl }));
}

export async function generateMetadata({ params }: PageProps<"/pl/opero/[slug]">): Promise<Metadata> {
  const feature = featureFromSlug("pl", (await params).slug);

  if (!feature) {
    return {};
  }

  return createFeaturePageMetadata({ locale: "pl", feature, ...featurePages[feature].seo });
}

export default async function PlOperoFeaturePage({ params }: PageProps<"/pl/opero/[slug]">) {
  const feature = featureFromSlug("pl", (await params).slug);

  if (!feature) {
    notFound();
  }

  const alternates = getFeatureAlternatePaths(feature);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: commonContent.nav.home, path: localizePath("pl", "home") },
          { name: "Opero", path: localizePath("pl", "opero") },
          { name: featurePages[feature].navLabel, path: localizeFeaturePath("pl", feature) },
        ]}
      />
      <FaqJsonLd
        items={feature === "noCode" ? noCodePage.faq.items : feature === "ai" ? aiPage.faq.items : featurePages[feature].faq.items}
      />
      <PageShell
        locale="pl"
        page="opero"
        shell={commonContent}
        navItems={navItems}
        alternatePaths={{ en: alternates.en, pl: alternates.pl }}
      >
        {feature === "noCode" ? (
          <NoCodeFeaturePage
            content={noCodePage}
            locale="pl"
            primaryHref={featureCtas.primary}
            secondaryHref={featureCtas.secondary}
          />
        ) : feature === "ai" ? (
          <AiFeaturePage content={aiPage} locale="pl" primaryHref={featureCtas.primary} />
        ) : feature === "processes" ? (
          <ProcessesFeaturePage
            content={processesPage}
            locale="pl"
            primaryHref={featureCtas.primary}
            secondaryHref={featureCtas.secondary}
          />
        ) : feature === "documents" ? (
          <DocumentsFeaturePage
            content={documentsPage}
            locale="pl"
            primaryHref={featureCtas.primary}
            secondaryHref={featureCtas.secondary}
          />
        ) : feature === "lowCode" ? (
          <LowCodeFeaturePage
            content={lowCodePage}
            locale="pl"
            primaryHref={featureCtas.primary}
            secondaryHref={featureCtas.secondary}
          />
        ) : feature === "reports" ? (
          <ReportsFeaturePage
            content={reportsPage}
            locale="pl"
            primaryHref={featureCtas.primary}
            secondaryHref={featureCtas.secondary}
          />
        ) : feature === "security" ? (
          <SecurityFeaturePage
            content={securityPage}
            locale="pl"
            primaryHref={featureCtas.primary}
            secondaryHref={featureCtas.secondary}
          />
        ) : (
          <IntegrationsFeaturePage
            content={integrationsPage}
            locale="pl"
            primaryHref={featureCtas.primary}
            secondaryHref={featureCtas.secondary}
          />
        )}
      </PageShell>
    </>
  );
}
