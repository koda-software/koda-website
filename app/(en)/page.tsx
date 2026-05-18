import type { Metadata } from "next";
import { commonContent, navItems } from "@/content/en/common";
import { homeContent, homeCtas } from "@/content/en/home";
import { HomeScaffold } from "@/components/layout/HomeScaffold";
import { PageShell } from "@/components/layout/PageShell";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  locale: "en",
  page: "home",
  ...homeContent.seo,
});

export default function HomePage() {
  return (
    <PageShell locale="en" page="home" shell={commonContent} navItems={navItems}>
      <HomeScaffold content={homeContent} primaryHref={homeCtas.primary} secondaryHref={homeCtas.secondary} />
    </PageShell>
  );
}
