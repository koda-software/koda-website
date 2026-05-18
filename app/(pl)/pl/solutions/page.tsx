import type { Metadata } from "next";
import { commonContent, navItems } from "@/content/pl/common";
import { placeholderPages } from "@/content/pl/placeholders";
import { PageShell } from "@/components/layout/PageShell";
import { PlaceholderPage } from "@/components/layout/PlaceholderPage";
import { localizePath } from "@/lib/i18n/routes";
import { createPageMetadata } from "@/lib/seo/metadata";

const content = placeholderPages.solutions;

export const metadata: Metadata = createPageMetadata({
  locale: "pl",
  page: "solutions",
  ...content.seo,
});

export default function PlSolutionsPage() {
  return (
    <PageShell locale="pl" page="solutions" shell={commonContent} navItems={navItems}>
      <PlaceholderPage content={content} homeHref={localizePath("pl", "home")} />
    </PageShell>
  );
}
