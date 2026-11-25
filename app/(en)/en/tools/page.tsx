import type { Metadata } from "next";
import { commonContent, navItems } from "@/content/en/common";
import { toolLinks, toolsIndexContent } from "@/content/en/tools";
import { PageShell } from "@/components/layout/PageShell";
import { ToolsIndexPage } from "@/components/layout/ToolsIndexPage";
import { BreadcrumbJsonLd, FaqJsonLd, ToolsCollectionJsonLd } from "@/lib/seo/json-ld";
import { createPageMetadata } from "@/lib/seo/metadata";
import { localizePath } from "@/lib/i18n/routes";

export const metadata: Metadata = createPageMetadata({
  locale: "en",
  page: "tools",
  ...toolsIndexContent.seo,
});

export default function EnToolsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: commonContent.nav.home, path: localizePath("en", "home") },
          { name: toolsIndexContent.navLabel, path: localizePath("en", "tools") },
        ]}
      />
      <ToolsCollectionJsonLd content={toolsIndexContent} links={toolLinks} locale="en" />
      <FaqJsonLd items={toolsIndexContent.faq.items} />
      <PageShell locale="en" page="tools" shell={commonContent} navItems={navItems}>
        <ToolsIndexPage
          content={toolsIndexContent}
          ctas={{ primary: localizePath("en", "contact"), secondary: localizePath("en", "opero") }}
          tools={toolLinks}
        />
      </PageShell>
    </>
  );
}
