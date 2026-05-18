import type { Metadata } from "next";
import { commonContent, navItems } from "@/content/pl/common";
import { homeContent, homeCtas } from "@/content/pl/home";
import { HomeScaffold } from "@/components/layout/HomeScaffold";
import { PageShell } from "@/components/layout/PageShell";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  locale: "pl",
  page: "home",
  ...homeContent.seo,
});

export default function PolishHomePage() {
  return (
    <PageShell locale="pl" page="home" shell={commonContent} navItems={navItems}>
      <HomeScaffold content={homeContent} primaryHref={homeCtas.primary} secondaryHref={homeCtas.secondary} />
    </PageShell>
  );
}
