import type { Metadata } from "next";
import { commonContent, navItems } from "@/content/pl/common";
import { toolLinks, toolsIndexContent } from "@/content/pl/tools";
import { PageShell } from "@/components/layout/PageShell";
import { ToolsIndexPage } from "@/components/layout/ToolsIndexPage";
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld";
import { createPageMetadata } from "@/lib/seo/metadata";
import { localizePath } from "@/lib/i18n/routes";

export const metadata: Metadata = createPageMetadata({
  locale: "pl",
  page: "tools",
  ...toolsIndexContent.seo,
});

export default function PlToolsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: commonContent.nav.home, path: localizePath("pl", "home") },
          { name: toolsIndexContent.navLabel, path: localizePath("pl", "tools") },
        ]}
      />
      <PageShell locale="pl" page="tools" shell={commonContent} navItems={navItems}>
        <ToolsIndexPage content={toolsIndexContent} tools={toolLinks} />
      </PageShell>
    </>
  );
}
