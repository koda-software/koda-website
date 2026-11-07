import Image from "next/image";
import Link from "next/link";
import ArrowDownIcon from "lucide-react/dist/esm/icons/arrow-down.mjs";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right.mjs";
import ChartColumnIcon from "lucide-react/dist/esm/icons/chart-column.mjs";
import FileSpreadsheetIcon from "lucide-react/dist/esm/icons/file-spreadsheet.mjs";
import { ArrivingSection } from "@/components/landing/ArrivingSection";
import { BrowserFrame } from "@/components/landing/BrowserFrame";
import { ComparisonSlider } from "@/components/landing/ComparisonSlider";
import { HeroEdgeVisual } from "@/components/landing/HeroDashboardMock";
import { LandingHero } from "@/components/landing/LandingPrimitives";
import { TwoTone } from "@/components/landing/TwoTone";
import {
  BulletList,
  FeatureFaqSection,
  FeatureFinalCtaSection,
  FeatureRelatedSection,
  bodyClass,
  sectionClass,
  shellClass,
  titleClass,
} from "@/components/layout/FeaturePageSections";
import { ReportsDemo } from "@/components/layout/demos/ReportsDemo";
import { ReportsQuestionExplorer } from "@/components/layout/features/reports/ReportsQuestionExplorer";
import type { ReportsPageContent, ReportsPageImage } from "@/content/feature-stories/reports.types";
import type { Locale } from "@/lib/i18n/config";
import { localizeFeaturePath } from "@/lib/i18n/features";

type ReportsFeaturePageProps = {
  content: ReportsPageContent;
  locale: Locale;
  primaryHref: string;
  secondaryHref: string;
};

const darkTitleClass = "m-0 max-w-[940px] text-[clamp(2.15rem,4.4vw,3.9rem)] leading-[1.02] tracking-[-0.04em] text-white";
const darkBodyClass = "m-0 max-w-[46rem] text-[1.04rem] leading-[1.72] text-white/62";

function BrowserScreenshot({ image, sizes }: { image: ReportsPageImage; sizes: string }) {
  return (
    <BrowserFrame
      chromeClassName="h-11 bg-[#eef2f5]"
      className="rounded-[12px] border border-[rgba(11,17,22,0.12)] bg-white shadow-[0_28px_70px_-34px_rgba(7,26,43,0.5),0_12px_28px_-20px_rgba(7,26,43,0.25)]"
      data-reveal
    >
      <Image alt={image.alt} className="block h-auto w-full" height={image.height} sizes={sizes} src={image.src} width={image.width} />
    </BrowserFrame>
  );
}

function MomentLedger({ ledger }: { ledger: ReportsPageContent["problem"]["ledger"] }) {
  const columnsClass = "grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] gap-6 max-[760px]:grid-cols-1 max-[760px]:gap-2";

  return (
    <div className="mt-[clamp(3rem,5vw,4.5rem)]" data-reveal>
      <div className={`${columnsClass} pb-4 max-[760px]:hidden`}>
        <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-[var(--color-muted)]">{ledger.moment}</p>
        <p className="m-0 text-[1.05rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">{ledger.spreadsheet}</p>
        <p className="m-0 text-[1.05rem] font-semibold tracking-[-0.02em] text-[#1e5278]">{ledger.opero}</p>
      </div>
      {ledger.rows.map((row) => (
        <div className={`${columnsClass} border-t border-[rgba(11,17,22,0.1)] py-4`} key={row.moment}>
          <p className="m-0 text-[0.94rem] font-medium leading-[1.4] text-[var(--color-ink)]">{row.moment}</p>
          <p className="m-0 text-[0.94rem] leading-[1.5] text-[var(--color-muted)]">
            <span className="hidden font-medium max-[760px]:inline">{ledger.spreadsheet}: </span>
            {row.spreadsheet}
          </p>
          <p className="m-0 text-[0.94rem] font-medium leading-[1.5] text-[#1e5278]">
            <span className="hidden max-[760px]:inline">{ledger.opero}: </span>
            {row.opero}
          </p>
        </div>
      ))}
    </div>
  );
}

/** Why a total has to be computed rather than rolled up: the sum of the parts against the average of the percentages. */
function MarginCard({ margin }: { margin: ReportsPageContent["calculation"]["margin"] }) {
  const cellClass = "px-5 py-3 text-right tabular-nums max-[560px]:px-3";
  const firstCellClass = "px-5 py-3 text-left max-[560px]:px-3";

  return (
    <div className="overflow-hidden rounded-[14px] border border-[rgba(11,17,22,0.12)] bg-white shadow-[0_28px_70px_-34px_rgba(7,26,43,0.45)]" data-arrive="right">
      <p className="m-0 border-b border-[rgba(11,17,22,0.08)] bg-[#f6f8fa] px-5 py-3.5 text-[0.92rem] font-semibold tracking-[-0.01em] text-[var(--color-ink)]">{margin.title}</p>
      <table className="w-full border-collapse text-[0.92rem] max-[560px]:text-[0.82rem]">
        <thead>
          <tr className="text-[0.74rem] text-[var(--color-muted)]">
            {margin.columns.map((column, index) => (
              <th className={`${index === 0 ? firstCellClass : cellClass} border-b border-[rgba(11,17,22,0.08)] font-medium`} key={column} scope="col">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {margin.rows.map((row) => (
            <tr className="text-[var(--color-ink-soft)]" key={row[0]}>
              {row.map((cell, index) => (
                <td className={`${index === 0 ? `${firstCellClass} font-medium` : cellClass} border-b border-[rgba(11,17,22,0.06)]`} key={`${row[0]}-${margin.columns[index]}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="text-[var(--color-muted)]">
            <td className={firstCellClass} colSpan={3}>{margin.averageLabel}</td>
            <td className={cellClass}><s>{margin.averageValue}</s></td>
          </tr>
          <tr className="bg-[rgba(56,182,255,0.1)] font-semibold text-[var(--color-ink)]">
            <td className={firstCellClass}>{margin.totalLabel}</td>
            {margin.totalValues.map((value, index) => (
              <td className={cellClass} key={`${margin.columns[index + 1]}-total`}>{value}</td>
            ))}
          </tr>
        </tfoot>
      </table>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[rgba(11,17,22,0.08)] px-5 py-3.5">
        <span className="text-[0.74rem] text-[var(--color-muted)]">{margin.formulaLabel}</span>
        <code className="font-mono text-[0.84rem] text-[#1e5278]">{margin.formula}</code>
      </div>
    </div>
  );
}

/** Two files that disagree on one total, and the one report that replaces them and reaches every company. */
function OneVersionDiagram({ content }: { content: ReportsPageContent["oneVersion"] }) {
  return (
    <div className="grid justify-items-stretch gap-3" data-reveal="right">
      <div className="grid grid-cols-2 gap-3 max-[560px]:grid-cols-1">
        {content.files.map((file, index) => (
          <div className={`rounded-[12px] border border-white/10 bg-white/[0.04] p-4 ${index === 0 ? "min-[561px]:-rotate-1" : "min-[561px]:rotate-1"}`} key={file.name}>
            <p className="m-0 flex items-center gap-2 text-[0.8rem] text-white/70">
              <FileSpreadsheetIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-white/40" strokeWidth={1.6} />
              <span className="min-w-0 truncate font-mono">{file.name}</span>
            </p>
            <p className="mb-0 mt-1 text-[0.72rem] text-white/40">{file.meta}</p>
            <p className="mb-0 mt-4 text-[0.72rem] text-white/45">{file.totalLabel}</p>
            <p className="m-0 mt-0.5 text-[1.45rem] font-medium tabular-nums tracking-[-0.02em] text-[#f6c96b]">{file.total}</p>
          </div>
        ))}
      </div>
      <ArrowDownIcon aria-hidden="true" className="mx-auto h-5 w-5 text-white/30" strokeWidth={1.6} />
      <div className="rounded-[12px] border border-[rgba(56,182,255,0.4)] bg-[rgba(56,182,255,0.08)] p-5">
        <p className="m-0 flex items-center gap-2 text-[0.88rem] font-medium text-white">
          <ChartColumnIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-[var(--color-blue-soft)]" strokeWidth={1.8} />
          {content.report.name}
        </p>
        <p className="mb-0 mt-1 text-[0.74rem] text-white/50">{content.report.meta}</p>
        <p className="mb-0 mt-4 text-[0.72rem] text-white/50">{content.report.totalLabel}</p>
        <p className="m-0 mt-0.5 text-[1.9rem] font-medium tabular-nums tracking-[-0.03em] text-[var(--color-blue-soft)]">{content.report.total}</p>
      </div>
      <ArrowDownIcon aria-hidden="true" className="mx-auto h-5 w-5 text-white/30" strokeWidth={1.6} />
      <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 min-[561px]:grid-cols-4">
        {content.audiences.map((audience) => (
          <li className="rounded-[10px] border border-white/10 px-3 py-2.5 text-center text-[0.8rem] text-white/70" key={audience}>{audience}</li>
        ))}
      </ul>
    </div>
  );
}

function ScheduleFlow({ steps }: { steps: ReportsPageContent["delivery"]["schedule"]["steps"] }) {
  return (
    <ol className="relative m-0 mt-7 list-none p-0 before:absolute before:bottom-4 before:left-[7px] before:top-4 before:w-px before:bg-[rgba(11,17,22,0.14)]">
      {steps.map((step) => (
        <li className="relative py-3 pl-8" key={step.label}>
          <span aria-hidden="true" className="absolute left-0 top-[1.05rem] h-[15px] w-[15px] rounded-full border-[3px] border-[var(--color-mist)] bg-[var(--color-blue)]" />
          <p className="m-0 text-[0.95rem] font-medium text-[var(--color-ink)]">{step.label}</p>
          <p className="mb-0 mt-0.5 text-[0.84rem] leading-[1.5] text-[var(--color-muted)]">{step.detail}</p>
        </li>
      ))}
    </ol>
  );
}

export function ReportsFeaturePage({ content, locale, primaryHref, secondaryHref }: ReportsFeaturePageProps) {
  return (
    <>
      <LandingHero description={content.hero.description} primaryCta={content.hero.primaryCta} primaryHref={primaryHref} secondaryCta={content.hero.secondaryCta} secondaryHref={secondaryHref} title={content.hero.title} visualMode="edge">
        <HeroEdgeVisual image={content.hero.image} />
      </LandingHero>

      <ArrivingSection className="bg-[var(--color-mist)]" cut="card" id="monday">
        <div className={sectionClass}>
          <div className="mx-auto max-w-[900px] text-center" data-reveal>
            <h2 className={`${titleClass} mx-auto`}><TwoTone text={content.problem.title} /></h2>
            <p className={`${bodyClass} mx-auto mt-7`}>{content.problem.description}</p>
          </div>
          <div className="mx-auto mt-[clamp(2rem,4vw,3.2rem)] w-full max-w-[82rem]" data-reveal>
            <ComparisonSlider
              afterAlt={content.problem.comparison.afterAlt}
              afterLabel={content.problem.comparison.afterLabel}
              afterSrc="/hero/opero-report-comparison.png"
              ariaLabel={content.problem.comparison.ariaLabel}
              beforeAlt={content.problem.comparison.beforeAlt}
              beforeLabel={content.problem.comparison.beforeLabel}
              beforeSrc="/hero/sheets-report-comparison.png"
              title={content.problem.comparison.title}
            />
          </div>
          <MomentLedger ledger={content.problem.ledger} />
        </div>
      </ArrivingSection>

      <ArrivingSection className="isolate border-y border-white/8 bg-[var(--color-surface-dark)] [background-image:var(--gradient-hero)] text-white" cut="wipe" id="drill-down">
        <div className={sectionClass}>
          <div className="mx-auto max-w-[900px] text-center" data-reveal>
            <h2 className={`${darkTitleClass} mx-auto`} data-arrive><TwoTone text={content.drill.title} /></h2>
            <p className={`${darkBodyClass} mx-auto mt-7`} data-arrive>{content.drill.description}</p>
          </div>
          <div className="mx-auto mt-[clamp(2.5rem,5vw,4rem)] max-w-[62rem]" data-arrive>
            <ReportsDemo content={content.drill.demo} />
          </div>
          <div className="mx-auto mt-[clamp(2.5rem,5vw,4rem)] grid max-w-[62rem] grid-cols-3 gap-8 max-[760px]:grid-cols-1" data-reveal>
            {content.drill.points.map((point) => (
              <div className="border-t border-white/12 pt-5" key={point.title}>
                <h3 className="m-0 text-[1.05rem] font-medium tracking-[-0.01em] text-white">{point.title}</h3>
                <p className="mb-0 mt-2 text-[0.88rem] leading-[1.6] text-white/58">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </ArrivingSection>

      <ArrivingSection cut="curtain" id="questions">
        <div className={sectionClass}>
          <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(18rem,0.5fr)] items-start gap-12 max-[900px]:grid-cols-1" data-reveal>
            <h2 className={titleClass}><TwoTone text={content.questions.title} /></h2>
            <p className="m-0 text-[1rem] leading-[1.68] text-[var(--color-muted)]">{content.questions.description}</p>
          </div>
          <div className="mt-[clamp(2.5rem,5vw,4rem)]" data-reveal>
            <ReportsQuestionExplorer labels={content.questions.labels} scenarios={content.questions.scenarios} />
          </div>
          <div className="mt-[clamp(3.5rem,6vw,5.5rem)] border-t border-[rgba(11,17,22,0.1)] pt-8" data-reveal>
            <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
              <h3 className="m-0 text-[1.25rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">{content.questions.industries.title}</h3>
              <p className="m-0 text-[0.82rem] text-[var(--color-muted)]">{content.questions.industries.note}</p>
            </div>
            <div className="mt-6 grid grid-cols-4 gap-6 max-[980px]:grid-cols-2 max-[560px]:grid-cols-1">
              {content.questions.industries.items.map((item) => (
                <div key={item.industry}>
                  <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-[#1e5278]">{item.industry}</p>
                  <p className="mb-0 mt-2 text-[0.92rem] leading-[1.55] text-[var(--color-ink-soft)]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ArrivingSection>

      <ArrivingSection className="border-t border-[rgba(11,17,22,0.09)] bg-[var(--color-mist)]" cut="slide" id="calculations">
        <div className={sectionClass}>
          <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-[clamp(2rem,4vw,4rem)] max-[980px]:grid-cols-1">
            <div data-reveal="left">
              <h2 className={titleClass}><TwoTone text={content.calculation.title} /></h2>
              <p className={`${bodyClass} mt-7`}>{content.calculation.description}</p>
            </div>
            <MarginCard margin={content.calculation.margin} />
          </div>
          <div className="mt-[clamp(3.5rem,6vw,5.5rem)] grid grid-cols-[minmax(0,1.18fr)_minmax(0,0.82fr)] items-center gap-[clamp(2rem,4vw,4rem)] max-[980px]:grid-cols-1">
            <div className="min-w-0 max-[980px]:order-2" data-arrive="left">
              <BrowserScreenshot image={content.calculation.image} sizes="(max-width: 980px) 100vw, 58vw" />
            </div>
            <div data-reveal="right">
              <h3 className="m-0 text-[clamp(1.5rem,2.5vw,2.15rem)] font-medium leading-[1.14] tracking-[-0.03em] text-[var(--color-ink)]">{content.calculation.secondTitle}</h3>
              <BulletList items={content.calculation.bullets} />
            </div>
          </div>
        </div>
      </ArrivingSection>

      <ArrivingSection className="bg-[var(--color-surface-dark)] text-white" cut="steps" id="one-version">
        <div className={sectionClass}>
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(24rem,1fr)] items-center gap-[clamp(3rem,6vw,6rem)] max-[980px]:grid-cols-1">
            <div data-reveal="left">
              <h2 className={darkTitleClass}><TwoTone text={content.oneVersion.title} /></h2>
              <p className={`${darkBodyClass} mt-7`}>{content.oneVersion.description}</p>
              <div className="mt-8 grid gap-5">
                {content.oneVersion.points.map((point) => (
                  <div className="border-t border-white/12 pt-4" key={point.title}>
                    <h3 className="m-0 text-[1rem] font-medium text-white">{point.title}</h3>
                    <p className="mb-0 mt-1.5 text-[0.88rem] leading-[1.58] text-white/58">{point.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <OneVersionDiagram content={content.oneVersion} />
          </div>
        </div>
      </ArrivingSection>

      <ArrivingSection cut="curtain" id="follow-up">
        <div className={`${sectionClass} grid grid-cols-[minmax(0,0.82fr)_minmax(28rem,1.18fr)] items-center gap-[clamp(2rem,4vw,4rem)] max-[980px]:grid-cols-1`}>
          <div data-reveal="left">
            <h2 className={titleClass}><TwoTone text={content.reslice.title} /></h2>
            <p className={`${bodyClass} mt-7`}>{content.reslice.description}</p>
            <BulletList items={content.reslice.bullets} />
          </div>
          <div className="min-w-0" data-arrive="right">
            <BrowserScreenshot image={content.reslice.image} sizes="(max-width: 980px) 100vw, 58vw" />
          </div>
        </div>
      </ArrivingSection>

      <ArrivingSection className="border-t border-[rgba(11,17,22,0.09)]" cut="open" id="dashboards">
        <div className={`${shellClass} pb-[clamp(5.5rem,10vw,9rem)] pt-[clamp(3rem,5vw,4.5rem)]`}>
          <div className="mx-auto max-w-[900px] text-center" data-reveal>
            <h2 className={`${titleClass} mx-auto`}><TwoTone text={content.dashboards.title} /></h2>
            <p className={`${bodyClass} mx-auto mt-7`}>{content.dashboards.description}</p>
          </div>
          <div className="mx-auto mt-[clamp(2.5rem,5vw,4rem)] max-w-[72rem]" data-arrive>
            <BrowserScreenshot image={content.dashboards.image} sizes="(max-width: 1200px) 100vw, 72rem" />
          </div>
          <div className="mx-auto mt-[clamp(2.5rem,5vw,4rem)] grid max-w-[72rem] grid-cols-4 gap-6 max-[980px]:grid-cols-2 max-[560px]:grid-cols-1" data-reveal>
            {content.dashboards.teams.map((team) => (
              <div className="border-t border-[rgba(11,17,22,0.12)] pt-4" key={team.team}>
                <h3 className="m-0 text-[1rem] font-semibold tracking-[-0.01em] text-[var(--color-ink)]">{team.team}</h3>
                <p className="mb-0 mt-2 text-[0.88rem] leading-[1.58] text-[var(--color-muted)]">{team.description}</p>
              </div>
            ))}
          </div>
        </div>
      </ArrivingSection>

      <ArrivingSection className="bg-[var(--color-mist)]" cut="slide" id="delivery">
        <div className={sectionClass}>
          <h2 className={titleClass} data-reveal><TwoTone text={content.delivery.title} /></h2>
          <div className="mt-[clamp(2.5rem,5vw,4rem)] grid grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start gap-[clamp(2rem,5vw,5rem)] max-[980px]:grid-cols-1">
            <div className="min-w-0" data-arrive="left">
              <h3 className="m-0 text-[clamp(1.35rem,2.1vw,1.75rem)] font-medium leading-[1.18] tracking-[-0.025em] text-[var(--color-ink)]">{content.delivery.export.title}</h3>
              <p className="mb-7 mt-4 text-[0.98rem] leading-[1.68] text-[var(--color-muted)]">{content.delivery.export.description}</p>
              <Image
                alt={content.delivery.export.image.alt}
                className="block h-auto w-full rounded-[12px] border border-[rgba(11,17,22,0.12)] shadow-[0_28px_70px_-34px_rgba(7,26,43,0.45)]"
                height={content.delivery.export.image.height}
                sizes="(max-width: 980px) 100vw, 50vw"
                src={content.delivery.export.image.src}
                width={content.delivery.export.image.width}
              />
            </div>
            <div className="min-w-0" data-arrive>
              <h3 className="m-0 text-[clamp(1.35rem,2.1vw,1.75rem)] font-medium leading-[1.18] tracking-[-0.025em] text-[var(--color-ink)]">{content.delivery.schedule.title}</h3>
              <p className="mb-0 mt-4 text-[0.98rem] leading-[1.68] text-[var(--color-muted)]">{content.delivery.schedule.description}</p>
              <ScheduleFlow steps={content.delivery.schedule.steps} />
              <Link className="mt-6 inline-flex items-center gap-2 text-[0.9rem] font-medium text-[var(--color-blue)]" href={localizeFeaturePath(locale, "lowCode")}>
                {content.delivery.schedule.cta}
                <ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </ArrivingSection>

      <ArrivingSection className="border-y border-[rgba(11,17,22,0.09)]" cut="curtain" id="build">
        <div className={sectionClass}>
          <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(18rem,0.5fr)] items-start gap-12 max-[900px]:grid-cols-1" data-reveal>
            <h2 className={titleClass}><TwoTone text={content.build.title} /></h2>
            <div>
              <p className="m-0 text-[1rem] leading-[1.68] text-[var(--color-muted)]">{content.build.description}</p>
              <Link className="mt-5 inline-flex items-center gap-2 text-[0.9rem] font-medium text-[var(--color-blue)]" href={localizeFeaturePath(locale, "ai")}>
                {content.build.cta}
                <ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <ol className="mb-0 mt-[clamp(2.5rem,5vw,4rem)] grid list-none grid-cols-3 gap-8 p-0 max-[860px]:grid-cols-1" data-reveal>
            {content.build.steps.map((step, index) => (
              <li className="border-t-2 border-[var(--color-ink)] pt-5" key={step.title}>
                <span className="font-mono text-[0.78rem] text-[var(--color-muted)]">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mb-0 mt-3 text-[1.25rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">{step.title}</h3>
                <p className="mb-0 mt-3 text-[0.94rem] leading-[1.62] text-[var(--color-muted)]">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </ArrivingSection>

      <FeatureFaqSection faq={content.faq} />
      <FeatureRelatedSection locale={locale} related={content.related} />
      <ArrivingSection cut="open">
        <div data-arrive>
          <FeatureFinalCtaSection finalCta={content.finalCta} primaryHref={primaryHref} />
        </div>
      </ArrivingSection>
    </>
  );
}
