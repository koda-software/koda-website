import type { Metadata } from "next";
import { commonContent, navItems } from "@/content/en/common";
import { placeholderPages } from "@/content/en/placeholders";
import { PageShell } from "@/components/layout/PageShell";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { localizePath } from "@/lib/i18n/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

const content = placeholderPages.opero;

export const metadata: Metadata = createPageMetadata({
  locale: "en",
  page: "opero",
  ...content.seo,
});

export default function EnOperoPage() {
  return (
    <PageShell locale="en" page="opero" shell={commonContent} navItems={navItems}>
      <PlaceholderPage content={content} homeHref={localizePath("en", "home")} />
    </PageShell>
  );
}
