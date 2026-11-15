import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { commonContent, navItems } from "@/content/en/common";
import { toolCtas, toolLinks, toolPages, toolsIndexContent } from "@/content/en/tools";
import { amountInWordsLabels, amountInWordsPage } from "@/content/en/tools/amount-in-words";
import { ksefViewerLabels } from "@/content/en/tools/ksef-viewer";
import { whiteListLabels } from "@/content/en/tools/white-list";
import { PageShell } from "@/components/layout/PageShell";
import { ToolPage } from "@/components/layout/ToolPage";
import { AmountExamples } from "@/components/tools/AmountExamples";
import { AmountInWords } from "@/components/tools/AmountInWords";
import { KsefViewer } from "@/components/tools/KsefViewer";
import { WhiteListCheck } from "@/components/tools/WhiteListCheck";
import { BreadcrumbJsonLd, FaqJsonLd, ToolJsonLd } from "@/lib/seo/json-ld";
import { createToolPageMetadata } from "@/lib/seo/metadata";
import { localizePath } from "@/lib/i18n/routes";
import { getToolAlternatePaths, localizeToolPath, toolFromSlug, toolKeys, toolSlugs } from "@/lib/i18n/tools";

/** Only the tools that exist are valid children of the tools index. */
export const dynamicParams = false;

export function generateStaticParams() {
  return toolKeys.map((tool) => ({ slug: toolSlugs[tool].en }));
}

export async function generateMetadata({ params }: PageProps<"/en/tools/[slug]">): Promise<Metadata> {
  const tool = toolFromSlug("en", (await params).slug);

  if (!tool) {
    return {};
  }

  return createToolPageMetadata({ locale: "en", tool, ...toolPages[tool].seo });
}

export default async function EnToolPage({ params }: PageProps<"/en/tools/[slug]">) {
  const tool = toolFromSlug("en", (await params).slug);

  if (!tool) {
    notFound();
  }

  const content = toolPages[tool];
  const path = localizeToolPath("en", tool);
  const alternates = getToolAlternatePaths(tool);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: commonContent.nav.home, path: localizePath("en", "home") },
          { name: toolsIndexContent.navLabel, path: localizePath("en", "tools") },
          { name: content.navLabel, path },
        ]}
      />
      <FaqJsonLd items={content.faq.items} />
      <ToolJsonLd description={content.seo.description} locale="en" name={content.navLabel} path={path} />
      <PageShell
        locale="en"
        page="tools"
        shell={commonContent}
        navItems={navItems}
        alternatePaths={{ en: alternates.en, pl: alternates.pl }}
      >
        <ToolPage
          content={content}
          ctas={toolCtas(tool)}
          extra={tool === "amountInWords" ? <AmountExamples content={amountInWordsPage.examples} english={true} /> : undefined}
          index={{ href: localizePath("en", "tools"), label: toolsIndexContent.navLabel, breadcrumbLabel: toolsIndexContent.breadcrumbLabel }}
          locale="en"
          otherTools={toolLinks.filter((link) => link.tool !== tool)}
        >
          {tool === "amountInWords" ? (
            <AmountInWords labels={amountInWordsLabels} />
          ) : tool === "whiteList" ? (
            <WhiteListCheck labels={whiteListLabels} locale="en" />
          ) : (
            <KsefViewer labels={ksefViewerLabels} locale="en" />
          )}
        </ToolPage>
      </PageShell>
    </>
  );
}
