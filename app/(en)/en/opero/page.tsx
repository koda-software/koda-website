import type { Metadata } from "next";
import { commonContent, navItems } from "@/content/en/common";
import { operoProductContent, operoProductCtas } from "@/content/en/opero";
import { OperoProductPage } from "@/components/layout/OperoProductPage";
import { PageShell } from "@/components/layout/PageShell";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  locale: "en",
  page: "opero",
  ...operoProductContent.seo,
});

export default function EnOperoPage() {
  return (
    <PageShell locale="en" page="opero" shell={commonContent} navItems={navItems}>
      <OperoProductPage content={operoProductContent} primaryHref={operoProductCtas.primary} secondaryHref={operoProductCtas.secondary} />
    </PageShell>
  );
}
