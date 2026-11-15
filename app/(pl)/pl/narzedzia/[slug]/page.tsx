import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { commonContent, navItems } from "@/content/pl/common";
import { toolCtas, toolLinks, toolPages, toolsIndexContent } from "@/content/pl/tools";
import { amountInWordsLabels, amountInWordsPage } from "@/content/pl/tools/amount-in-words";
import { b2bVsEmploymentLabels, b2bVsEmploymentPage } from "@/content/pl/tools/b2b-vs-employment";
import { jpkViewerLabels, jpkViewerPage } from "@/content/pl/tools/jpk-viewer";
import { ksefViewerLabels } from "@/content/pl/tools/ksef-viewer";
import { nbpRateLabels } from "@/content/pl/tools/nbp-rate";
import { vatCalculatorLabels } from "@/content/pl/tools/vat-calculator";
import { whiteListLabels } from "@/content/pl/tools/white-list";
import { PageShell } from "@/components/layout/PageShell";
import { ToolPage } from "@/components/layout/ToolPage";
import { AmountExamples } from "@/components/tools/AmountExamples";
import { AmountInWords } from "@/components/tools/AmountInWords";
import { B2bBreakEvenTable } from "@/components/tools/B2bBreakEvenTable";
import { B2bVsEmployment } from "@/components/tools/B2bVsEmployment";
import { JpkMarkers } from "@/components/tools/JpkMarkers";
import { JpkViewer } from "@/components/tools/JpkViewer";
import { KsefViewer } from "@/components/tools/KsefViewer";
import { NbpRate } from "@/components/tools/NbpRate";
import { VatCalculator } from "@/components/tools/VatCalculator";
import { WhiteListCheck } from "@/components/tools/WhiteListCheck";
import { BreadcrumbJsonLd, FaqJsonLd, ToolJsonLd } from "@/lib/seo/json-ld";
import { createToolPageMetadata } from "@/lib/seo/metadata";
import { localizePath } from "@/lib/i18n/routes";
import { getToolAlternatePaths, localizeToolPath, toolFromSlug, toolKeys, toolSlugs, type ToolKey } from "@/lib/i18n/tools";
import { nbpCurrencyOptions } from "@/lib/tools/nbp";

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
          extra={toolExtra(tool)}
          index={{ href: localizePath("pl", "tools"), label: toolsIndexContent.navLabel, breadcrumbLabel: toolsIndexContent.breadcrumbLabel }}
          locale="pl"
          otherTools={toolLinks.filter((link) => link.tool !== tool)}
        >
          {toolWidget(tool)}
        </ToolPage>
      </PageShell>
    </>
  );
}

/** The interactive tool for each page. */
function toolWidget(tool: ToolKey): ReactNode {
  switch (tool) {
    case "vatCalculator":
      return <VatCalculator labels={vatCalculatorLabels} whiteListHref={localizeToolPath("pl", "whiteList")} />;
    case "nbpRate":
      return <NbpRate currencies={nbpCurrencyOptions("pl")} labels={nbpRateLabels} locale="pl" vatCalculatorHref={localizeToolPath("pl", "vatCalculator")} />;
    case "b2bVsEmployment":
      return <B2bVsEmployment labels={b2bVsEmploymentLabels} />;
    case "amountInWords":
      return <AmountInWords labels={amountInWordsLabels} />;
    case "whiteList":
      return <WhiteListCheck labels={whiteListLabels} locale="pl" />;
    case "ksefViewer":
      return <KsefViewer labels={ksefViewerLabels} locale="pl" />;
    case "jpkViewer":
      return <JpkViewer labels={jpkViewerLabels} locale="pl" />;
  }
}

/** A server-rendered section after the explainer, for the tools that have one. */
function toolExtra(tool: ToolKey): ReactNode {
  switch (tool) {
    case "amountInWords":
      return <AmountExamples content={amountInWordsPage.examples} english={false} />;
    case "jpkViewer":
      return <JpkMarkers content={jpkViewerPage.markers} />;
    case "b2bVsEmployment":
      return <B2bBreakEvenTable content={b2bVsEmploymentPage.breakEvenTable} english={false} />;
    default:
      return undefined;
  }
}
