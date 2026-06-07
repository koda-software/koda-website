import type { Metadata } from "next";
import { commonContent, navItems } from "@/content/pl/common";
import { contactContent } from "@/content/pl/contact";
import { ContactPage } from "@/components/layout/ContactPage";
import { PageShell } from "@/components/layout/PageShell";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  locale: "pl",
  page: "contact",
  ...contactContent.seo,
});

export default function PlContactPage() {
  return (
    <PageShell locale="pl" page="contact" shell={commonContent} navItems={navItems}>
      <ContactPage locale="pl" content={contactContent} />
    </PageShell>
  );
}
