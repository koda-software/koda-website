import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { commonContent, navItems } from "@/content/en/common";
import { toolCtas, toolLinks, toolPages, toolsIndexContent } from "@/content/en/tools";
import { amountInWordsLabels, amountInWordsPage } from "@/content/en/tools/amount-in-words";
import { b2bVsEmploymentLabels, b2bVsEmploymentPage } from "@/content/en/tools/b2b-vs-employment";
import { eDeliveryLabels, eDeliveryPage } from "@/content/en/tools/e-delivery";
import { jpkViewerLabels, jpkViewerPage } from "@/content/en/tools/jpk-viewer";
import { ksefViewerLabels } from "@/content/en/tools/ksef-viewer";
import { nbpRateLabels } from "@/content/en/tools/nbp-rate";
import { vatCalculatorLabels } from "@/content/en/tools/vat-calculator";
import { whiteListLabels } from "@/content/en/tools/white-list";
import { PageShell } from "@/components/layout/PageShell";
import { ToolPage } from "@/components/layout/ToolPage";
import { AmountExamples } from "@/components/tools/AmountExamples";
import { AmountInWords } from "@/components/tools/AmountInWords";
import { B2bBreakEvenTable } from "@/components/tools/B2bBreakEvenTable";
import { B2bVsEmployment } from "@/components/tools/B2bVsEmployment";
import { EDeliveryPopular, loadPopularInstitutions } from "@/components/tools/EDeliveryPopular";
import { EDeliverySearch } from "@/components/tools/EDeliverySearch";
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
          extra={await toolExtra(tool)}
          index={{ href: localizePath("en", "tools"), label: toolsIndexContent.navLabel, breadcrumbLabel: toolsIndexContent.breadcrumbLabel }}
          locale="en"
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
      return <VatCalculator labels={vatCalculatorLabels} whiteListHref={localizeToolPath("en", "whiteList")} />;
    case "nbpRate":
      return <NbpRate currencies={nbpCurrencyOptions("en")} labels={nbpRateLabels} locale="en" vatCalculatorHref={localizeToolPath("en", "vatCalculator")} />;
    case "b2bVsEmployment":
      return <B2bVsEmployment labels={b2bVsEmploymentLabels} />;
    case "amountInWords":
      return <AmountInWords labels={amountInWordsLabels} />;
    case "whiteList":
      return <WhiteListCheck labels={whiteListLabels} locale="en" />;
    case "eDelivery":
      return <EDeliverySearch labels={eDeliveryLabels} locale="en" />;
    case "ksefViewer":
      return <KsefViewer labels={ksefViewerLabels} locale="en" />;
    case "jpkViewer":
      return <JpkViewer labels={jpkViewerLabels} locale="en" />;
  }
}

/** A server-rendered section after the explainer, for the tools that have one. */
async function toolExtra(tool: ToolKey): Promise<ReactNode> {
  switch (tool) {
    case "amountInWords":
      return <AmountExamples content={amountInWordsPage.examples} english={true} />;
    case "jpkViewer":
      return <JpkMarkers content={jpkViewerPage.markers} />;
    case "b2bVsEmployment":
      return <B2bBreakEvenTable content={b2bVsEmploymentPage.breakEvenTable} english={true} />;
    case "eDelivery": {
      // Read from the gov.pl list when the page is built; left out when no list is available.
      const popular = await loadPopularInstitutions(eDeliveryPage.popular);
      return popular ? <EDeliveryPopular content={eDeliveryPage.popular} data={popular} english={true} /> : undefined;
    }
    default:
      return undefined;
  }
}
