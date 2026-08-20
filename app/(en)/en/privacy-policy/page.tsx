import type { Metadata } from "next";
import { commonContent, navItems } from "@/content/en/common";
import { privacyContent } from "@/content/en/privacy";
import { LegalPage } from "@/components/layout/LegalPage";
import { PageShell } from "@/components/layout/PageShell";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  locale: "en",
  page: "privacy",
  ...privacyContent.seo,
});

export default function EnPrivacyPage() {
  return (
    <PageShell locale="en" page="privacy" shell={commonContent} navItems={navItems}>
      <LegalPage content={privacyContent} locale="en" />
    </PageShell>
  );
}
