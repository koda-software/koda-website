import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { commonContent, navItems } from "@/content/pl/common";
import { toolCtas, toolLinks, toolPages, toolsIndexContent } from "@/content/pl/tools";
import { amountInWordsLabels, amountInWordsPage } from "@/content/pl/tools/amount-in-words";
import { ksefViewerLabels } from "@/content/pl/tools/ksef-viewer";
import { whiteListLabels } from "@/content/pl/tools/white-list";
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
  return toolKeys.map((tool) => ({ slug: toolSlugs[tool].pl }));
}

export async function generateMetadata({ params }: PageProps<"/pl/narzedzia/[slug]">): Promise<Metadata> {
  const tool = toolFromSlug("pl", (await params).slug);

  if (!tool) {
    return {};
  }

  return createToolPageMetadata({ locale: "pl", tool, ...toolPages[tool].seo });
}

export default async function PlToolPage({ params }: PageProps<"/pl/narzedzia/[slug]">) {
  const tool = toolFromSlug("pl", (await params).slug);

  if (!tool) {
    notFound();
  }

  const content = toolPages[tool];
  const path = localizeToolPath("pl", tool);
  const alternates = getToolAlternatePaths(tool);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: commonContent.nav.home, path: localizePath("pl", "home") },
          { name: toolsIndexContent.navLabel, path: localizePath("pl", "tools") },
          { name: content.navLabel, path },
        ]}
      />
      <FaqJsonLd items={content.faq.items} />
      <ToolJsonLd description={content.seo.description} locale="pl" name={content.navLabel} path={path} />
      <PageShell
        locale="pl"
        page="tools"
        shell={commonContent}
        navItems={navItems}
        alternatePaths={{ en: alternates.en, pl: alternates.pl }}
      >
        <ToolPage
          content={content}
          ctas={toolCtas(tool)}
          extra={tool === "amountInWords" ? <AmountExamples content={amountInWordsPage.examples} english={false} /> : undefined}
          index={{ href: localizePath("pl", "tools"), label: toolsIndexContent.navLabel, breadcrumbLabel: toolsIndexContent.breadcrumbLabel }}
          locale="pl"
          otherTools={toolLinks.filter((link) => link.tool !== tool)}
        >
          {tool === "amountInWords" ? (
            <AmountInWords labels={amountInWordsLabels} />
          ) : tool === "whiteList" ? (
            <WhiteListCheck labels={whiteListLabels} locale="pl" />
          ) : (
            <KsefViewer labels={ksefViewerLabels} locale="pl" />
          )}
        </ToolPage>
      </PageShell>
    </>
  );
}
