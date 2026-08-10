import type { Metadata } from "next";
import { commonContent, navItems } from "@/content/en/common";
import { featureNavItems } from "@/content/en/features";
import { operoProductContent, operoProductCtas } from "@/content/en/opero";
import { OperoProductPage } from "@/components/layout/OperoProductPage";
import { PageShell } from "@/components/layout/PageShell";
import { createPageMetadata } from "@/lib/seo/metadata";
import { SoftwareApplicationJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = createPageMetadata({
  locale: "en",
  page: "opero",
  ...operoProductContent.seo,
});

export default function EnOperoPage() {
  return (
    <>
      <SoftwareApplicationJsonLd locale="en" description={operoProductContent.seo.description} />
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
