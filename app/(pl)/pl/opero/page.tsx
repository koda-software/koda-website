import type { Metadata } from "next";
import { commonContent, navItems } from "@/content/pl/common";
import { featureNavItems } from "@/content/pl/features";
import { operoProductContent, operoProductCtas } from "@/content/pl/opero";
import { OperoProductPage } from "@/components/layout/OperoProductPage";
import { PageShell } from "@/components/layout/PageShell";
import { createPageMetadata } from "@/lib/seo/metadata";
import { featurePages } from "@/content/pl/features";
import { featureKeys } from "@/lib/i18n/features";
import { SoftwareApplicationJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = createPageMetadata({
  locale: "pl",
  page: "opero",
  ...operoProductContent.seo,
});

export default function PlOperoPage() {
  return (
    <>
      <SoftwareApplicationJsonLd
        description={operoProductContent.seo.description}
        featureList={featureKeys.map((key) => featurePages[key].navLabel)}
        locale="pl"
      />
      <PageShell locale="pl" page="opero" shell={commonContent} navItems={navItems}>
        <OperoProductPage
          content={operoProductContent}
          featureLinks={featureNavItems}
          primaryHref={operoProductCtas.primary}
          secondaryHref={operoProductCtas.secondary}
        />
      </PageShell>
    </>
  );
}
