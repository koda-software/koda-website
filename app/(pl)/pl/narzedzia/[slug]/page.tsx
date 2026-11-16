import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { commonContent, navItems } from "@/content/pl/common";
import { toolCtas, toolLinks, toolPages, toolsIndexContent } from "@/content/pl/tools";
import { amountInWordsLabels, amountInWordsPage } from "@/content/pl/tools/amount-in-words";
import { b2bVsEmploymentLabels, b2bVsEmploymentPage } from "@/content/pl/tools/b2b-vs-employment";
import { counterpartyLabels } from "@/content/pl/tools/counterparty";
import { eDeliveryLabels, eDeliveryPage } from "@/content/pl/tools/e-delivery";
import { jpkViewerLabels, jpkViewerPage } from "@/content/pl/tools/jpk-viewer";
import { ksefViewerLabels } from "@/content/pl/tools/ksef-viewer";
import { lateInterestLabels, lateInterestPage } from "@/content/pl/tools/late-interest";
import { nbpRateLabels } from "@/content/pl/tools/nbp-rate";
import { salaryCalculatorLabels, salaryCalculatorPage } from "@/content/pl/tools/salary-calculator";
import { vatCalculatorLabels } from "@/content/pl/tools/vat-calculator";
import { whiteListLabels } from "@/content/pl/tools/white-list";
import { workingTimeLabels, workingTimePage } from "@/content/pl/tools/working-time";
import { PageShell } from "@/components/layout/PageShell";
import { ToolPage } from "@/components/layout/ToolPage";
import { AmountExamples } from "@/components/tools/AmountExamples";
import { AmountInWords } from "@/components/tools/AmountInWords";
import { B2bBreakEvenTable } from "@/components/tools/B2bBreakEvenTable";
import { B2bVsEmployment } from "@/components/tools/B2bVsEmployment";
import { CounterpartyCheck } from "@/components/tools/CounterpartyCheck";
import { EDeliveryPopular, loadPopularInstitutions } from "@/components/tools/EDeliveryPopular";
import { EDeliverySearch } from "@/components/tools/EDeliverySearch";
import { JpkMarkers } from "@/components/tools/JpkMarkers";
import { JpkViewer } from "@/components/tools/JpkViewer";
import { KsefViewer } from "@/components/tools/KsefViewer";
import { LateInterest } from "@/components/tools/LateInterest";
import { LateInterestRateTable } from "@/components/tools/LateInterestRateTable";
import { NbpRate } from "@/components/tools/NbpRate";
import { SalaryCalculator } from "@/components/tools/SalaryCalculator";
import { SalaryExamples } from "@/components/tools/SalaryExamples";
import { VatCalculator } from "@/components/tools/VatCalculator";
import { WhiteListCheck } from "@/components/tools/WhiteListCheck";
import { WorkingTime } from "@/components/tools/WorkingTime";
import { WorkingTimeYears } from "@/components/tools/WorkingTimeYears";
import { todayInPoland } from "@/lib/tools/business-days";
import { workingTimeYears } from "@/lib/tools/working-time";
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
          extra={await toolExtra(tool)}
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
    case "lateInterest":
      return <LateInterest labels={lateInterestLabels} locale="pl" />;
    case "b2bVsEmployment":
      return <B2bVsEmployment labels={b2bVsEmploymentLabels} />;
    case "salaryCalculator":
      return <SalaryCalculator b2bHref={localizeToolPath("pl", "b2bVsEmployment")} labels={salaryCalculatorLabels} />;
    case "workingTime":
      // The month the page is built in; the widget moves to the visitor's month on load.
      return <WorkingTime defaultMonth={todayInPoland().slice(0, 7)} labels={workingTimeLabels} locale="pl" />;
    case "amountInWords":
      return <AmountInWords labels={amountInWordsLabels} />;
    case "whiteList":
      return <WhiteListCheck labels={whiteListLabels} locale="pl" />;
    case "counterpartyCheck":
      return (
        <CounterpartyCheck
          eDeliveryHref={localizeToolPath("pl", "eDelivery")}
          labels={counterpartyLabels}
          locale="pl"
          whiteListHref={localizeToolPath("pl", "whiteList")}
        />
      );
    case "eDelivery":
      return <EDeliverySearch labels={eDeliveryLabels} locale="pl" />;
    case "ksefViewer":
      return <KsefViewer labels={ksefViewerLabels} locale="pl" />;
    case "jpkViewer":
      return <JpkViewer labels={jpkViewerLabels} locale="pl" />;
  }
}

/** A server-rendered section after the explainer, for the tools that have one. */
async function toolExtra(tool: ToolKey): Promise<ReactNode> {
  switch (tool) {
    case "amountInWords":
      return <AmountExamples content={amountInWordsPage.examples} english={false} />;
    case "jpkViewer":
      return <JpkMarkers content={jpkViewerPage.markers} />;
    case "b2bVsEmployment":
      return <B2bBreakEvenTable content={b2bVsEmploymentPage.breakEvenTable} english={false} />;
    case "salaryCalculator":
      return <SalaryExamples content={salaryCalculatorPage.examples} english={false} />;
    case "lateInterest":
      return <LateInterestRateTable content={lateInterestPage.rateTable} english={false} />;
    case "workingTime":
      return <WorkingTimeYears content={workingTimePage.years} english={false} years={workingTimeYears} />;
    case "eDelivery": {
      // Read from the gov.pl list when the page is built; left out when no list is available.
      const popular = await loadPopularInstitutions(eDeliveryPage.popular);
      return popular ? <EDeliveryPopular content={eDeliveryPage.popular} data={popular} english={false} /> : undefined;
    }
    default:
      return undefined;
  }
}
