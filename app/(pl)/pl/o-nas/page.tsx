import type { Metadata } from "next";
import { aboutContent, aboutCtas } from "@/content/pl/about";
import { commonContent, navItems } from "@/content/pl/common";
import { AboutPage } from "@/components/layout/AboutPage";
import { PageShell } from "@/components/layout/PageShell";
import { FaqJsonLd } from "@/lib/seo/json-ld";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  locale: "pl",
  page: "about",
  ...aboutContent.seo,
});

export default function PlAboutPage() {
  return (
    <PageShell locale="pl" page="about" shell={commonContent} navItems={navItems}>
      <FaqJsonLd items={aboutContent.faq.items} />
      <AboutPage content={aboutContent} ctas={aboutCtas} />
    </PageShell>
  );
}
