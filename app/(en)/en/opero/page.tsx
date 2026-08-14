import type { Metadata } from "next";
import { commonContent, navItems } from "@/content/en/common";
import { featureNavItems } from "@/content/en/features";
import { operoProductContent, operoProductCtas } from "@/content/en/opero";
import { OperoProductPage } from "@/components/layout/OperoProductPage";
import { PageShell } from "@/components/layout/PageShell";
import { createPageMetadata } from "@/lib/seo/metadata";
import { featurePages } from "@/content/en/features";
import { featureKeys } from "@/lib/i18n/features";
import { SoftwareApplicationJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = createPageMetadata({
  locale: "en",
  page: "opero",
  ...operoProductContent.seo,
});

export default function EnOperoPage() {
  return (
    <>
      <SoftwareApplicationJsonLd
        description={operoProductContent.seo.description}
        featureList={featureKeys.map((key) => featurePages[key].navLabel)}
        locale="en"
      />
      <PageShell locale="en" page="opero" shell={commonContent} navItems={navItems}>
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
