import type { Metadata } from "next";
import { commonContent, navItems } from "@/content/pl/common";
import { privacyContent } from "@/content/pl/privacy";
import { LegalPage } from "@/components/layout/LegalPage";
import { PageShell } from "@/components/layout/PageShell";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  locale: "pl",
  page: "privacy",
  ...privacyContent.seo,
});

export default function PlPrivacyPage() {
  return (
    <PageShell locale="pl" page="privacy" shell={commonContent} navItems={navItems}>
      <LegalPage content={privacyContent} locale="pl" />
    </PageShell>
  );
}
