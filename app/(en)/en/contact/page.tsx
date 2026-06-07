import type { Metadata } from "next";
import { commonContent, navItems } from "@/content/en/common";
import { contactContent } from "@/content/en/contact";
import { ContactPage } from "@/components/layout/ContactPage";
import { PageShell } from "@/components/layout/PageShell";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  locale: "en",
  page: "contact",
  ...contactContent.seo,
});

export default function EnContactPage() {
  return (
    <PageShell locale="en" page="contact" shell={commonContent} navItems={navItems}>
      <ContactPage locale="en" content={contactContent} />
    </PageShell>
  );
}
