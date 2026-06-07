import type { Metadata } from "next";
import { commonContent, navItems } from "@/content/pl/common";
import { operoProductContent, operoProductCtas } from "@/content/pl/opero";
import { OperoProductPage } from "@/components/layout/OperoProductPage";
import { PageShell } from "@/components/layout/PageShell";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  locale: "pl",
  page: "opero",
  ...operoProductContent.seo,
});

export default function PlOperoPage() {
  return (
    <PageShell locale="pl" page="opero" shell={commonContent} navItems={navItems}>
      <OperoProductPage content={operoProductContent} primaryHref={operoProductCtas.primary} secondaryHref={operoProductCtas.secondary} />
    </PageShell>
  );
}
