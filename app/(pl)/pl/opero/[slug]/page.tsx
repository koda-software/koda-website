import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { commonContent, navItems } from "@/content/pl/common";
import { featureCtas, featurePages } from "@/content/pl/features";
import { FeaturePage } from "@/components/layout/FeaturePage";
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
      <FaqJsonLd items={featurePages[feature].faq.items} />
      <PageShell
        locale="pl"
        page="opero"
        shell={commonContent}
        navItems={navItems}
        alternatePaths={{ en: alternates.en, pl: alternates.pl }}
      >
        <FeaturePage
          feature={feature}
          locale="pl"
          pages={featurePages}
          primaryHref={featureCtas.primary}
          secondaryHref={featureCtas.secondary}
        />
      </PageShell>
    </>
  );
}
