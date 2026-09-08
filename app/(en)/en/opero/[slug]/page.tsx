import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { commonContent, navItems } from "@/content/en/common";
import { featureCtas, featurePages } from "@/content/en/features";
import { noCodePage } from "@/content/en/features/no-code";
import { FeaturePage } from "@/components/layout/FeaturePage";
import { NoCodeFeaturePage } from "@/components/layout/NoCodeFeaturePage";
import { PageShell } from "@/components/layout/PageShell";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/lib/seo/json-ld";
import { createFeaturePageMetadata } from "@/lib/seo/metadata";
import { featureFromSlug, featureKeys, featureSlugs, getFeatureAlternatePaths, localizeFeaturePath } from "@/lib/i18n/features";
import { localizePath } from "@/lib/i18n/routes";

/** The eight feature slugs are the only valid children of /en/opero. */
export const dynamicParams = false;

export function generateStaticParams() {
  return featureKeys.map((feature) => ({ slug: featureSlugs[feature].en }));
}

export async function generateMetadata({ params }: PageProps<"/en/opero/[slug]">): Promise<Metadata> {
  const feature = featureFromSlug("en", (await params).slug);

  if (!feature) {
    return {};
  }

  return createFeaturePageMetadata({ locale: "en", feature, ...featurePages[feature].seo });
}

export default async function EnOperoFeaturePage({ params }: PageProps<"/en/opero/[slug]">) {
  const feature = featureFromSlug("en", (await params).slug);

  if (!feature) {
    notFound();
  }

  const alternates = getFeatureAlternatePaths(feature);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: commonContent.nav.home, path: localizePath("en", "home") },
          { name: "Opero", path: localizePath("en", "opero") },
          { name: featurePages[feature].navLabel, path: localizeFeaturePath("en", feature) },
        ]}
      />
      <FaqJsonLd
        items={feature === "noCode" ? noCodePage.faq.items : featurePages[feature].faq.items}
      />
      <PageShell
        locale="en"
        page="opero"
        shell={commonContent}
        navItems={navItems}
        alternatePaths={{ en: alternates.en, pl: alternates.pl }}
      >
        {feature === "noCode" ? (
          <NoCodeFeaturePage
            content={noCodePage}
            locale="en"
            primaryHref={featureCtas.primary}
            secondaryHref={featureCtas.secondary}
          />
        ) : (
          <FeaturePage
            feature={feature}
            locale="en"
            pages={featurePages}
            primaryHref={featureCtas.primary}
            secondaryHref={featureCtas.secondary}
          />
        )}
      </PageShell>
    </>
  );
}
