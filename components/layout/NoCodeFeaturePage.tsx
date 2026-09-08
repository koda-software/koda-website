import Image from "next/image";
import Link from "next/link";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right.mjs";
import CheckIcon from "lucide-react/dist/esm/icons/check.mjs";
import ChevronDownIcon from "lucide-react/dist/esm/icons/chevron-down.mjs";
import CircleCheckIcon from "lucide-react/dist/esm/icons/circle-check.mjs";
import Clock3Icon from "lucide-react/dist/esm/icons/clock-3.mjs";
import GaugeIcon from "lucide-react/dist/esm/icons/gauge.mjs";
import ImageIcon from "lucide-react/dist/esm/icons/image.mjs";
import { BrowserFrame } from "@/components/landing/BrowserFrame";
import { PageHero } from "@/components/landing/LandingPrimitives";
import type { NoCodePageContent, NoCodePageSection, NoCodePageVisual } from "@/content/types";
import type { Locale } from "@/lib/i18n/config";
import { localizeFeaturePath } from "@/lib/i18n/features";

type NoCodeFeaturePageProps = {
  content: NoCodePageContent;
  locale: Locale;
  primaryHref: string;
  secondaryHref: string;
};

const shellClass = "mx-auto w-[min(100%,var(--shell-width))] px-[var(--page-gutter)]";
const sectionClass = `${shellClass} py-[clamp(5.5rem,10vw,9rem)]`;
const eyebrowClass = "m-0 text-[0.76rem] font-semibold uppercase tracking-[0.09em] text-[var(--color-blue)]";
const titleClass = "m-0 max-w-[940px] text-[clamp(2.15rem,4.4vw,3.9rem)] leading-[1.02] tracking-[-0.04em] text-[var(--color-ink)]";
const bodyClass = "m-0 max-w-[46rem] text-[1.04rem] font-light leading-[1.72] text-[var(--color-muted)]";

function HeroProductShot({ image }: { image: NoCodePageContent["hero"]["image"] }) {
  return (
    <div className="relative h-[clamp(29rem,42vw,35rem)] w-[calc(100%+var(--page-gutter))] overflow-visible max-[980px]:h-[22rem] max-[560px]:h-[18rem] min-[981px]:-ml-[5rem] min-[981px]:w-[calc(100%+5rem+var(--page-gutter))] min-[1441px]:w-[calc(100%+5rem+(100vw-var(--shell-width))/2+var(--page-gutter))]">
      <BrowserFrame
        chromeClassName="h-10"
        className="absolute left-0 top-8 w-[147%] max-w-[86rem] rounded-t-[20px] border border-white/16 bg-[#06111d] [box-shadow:-38px_46px_120px_rgba(0,0,0,0.68),-14px_16px_48px_rgba(36,139,210,0.2)] max-[980px]:w-[145%]"
        tone="dark"
      >
        <Image alt={image.alt} className="block h-auto w-full" height={image.height} priority sizes="(max-width: 980px) 145vw, 72vw" src={image.src} width={image.width} />
      </BrowserFrame>
    </div>
  );
}

function ScreenshotPlaceholder({ label, title }: { label: string; title: string }) {
  return (
    <div className="relative grid min-h-[clamp(22rem,42vw,36rem)] place-items-center overflow-hidden rounded-[var(--radius-panel)] border border-dashed border-[rgba(11,17,22,0.22)] bg-[linear-gradient(145deg,rgba(56,182,255,0.045),rgba(255,255,255,0.9))] p-8 text-center shadow-[0_28px_80px_rgba(20,45,64,0.09)]" data-reveal>
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(11,17,22,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(11,17,22,0.035)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="relative grid max-w-[24rem] justify-items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-full border border-[rgba(56,182,255,0.3)] bg-white text-[var(--color-blue)] shadow-[0_12px_32px_rgba(28,112,165,0.12)]">
          <ImageIcon aria-hidden="true" className="h-6 w-6" strokeWidth={1.5} />
        </span>
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-blue)]">{label}</span>
        <span className="text-[1.12rem] font-medium leading-[1.35] text-[var(--color-ink)]">{title}</span>
      </div>
    </div>
  );
}

function BrowserScreenshot({ image }: { image: NonNullable<NoCodePageVisual["image"]> }) {
  return (
    <BrowserFrame
      chromeClassName="h-11 bg-[#eef2f5]"
      className="rounded-[12px] border border-[rgba(11,17,22,0.12)] bg-white shadow-[0_28px_70px_-34px_rgba(7,26,43,0.5),0_12px_28px_-20px_rgba(7,26,43,0.25)]"
      data-reveal
    >
      <Image alt={image.alt} className="block h-auto w-full" height={image.height} sizes="(max-width: 980px) 100vw, 58vw" src={image.src} width={image.width} />
    </BrowserFrame>
  );
}

function SectionVisual({ fallbackLabel, visual }: { fallbackLabel: string; visual: NoCodePageVisual }) {
  return visual.image ? <BrowserScreenshot image={visual.image} /> : <ScreenshotPlaceholder label={fallbackLabel} title={visual.title} />;
}

function ComparisonCell({ cell }: { cell: NoCodePageContent["foundation"]["comparison"]["groups"][number]["rows"][number]["traditional"] }) {
  const isIncluded = cell.mode === "included";
  const isConfigured = cell.mode === "configure";

  return (
    <div className="flex min-h-[3.55rem] items-center px-4 py-3 max-[980px]:min-h-[3rem] max-[980px]:px-3 max-[980px]:py-2.5">
      <span className={`flex items-center gap-2.5 text-[0.98rem] leading-[1.2] max-[980px]:gap-2 max-[980px]:text-[0.82rem] ${isConfigured || isIncluded ? "font-medium text-[#1e5278]" : "font-normal text-[var(--color-muted)]"}`}>
        {isIncluded ? (
          <span aria-hidden="true" className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1e5278] text-white max-[980px]:h-[1.125rem] max-[980px]:w-[1.125rem]">
            <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.8} />
          </span>
        ) : isConfigured ? null : <Clock3Icon aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={1.5} />}
        {isIncluded ? cell.label : cell.meta}
      </span>
    </div>
  );
}

function ComparisonSummary({ accent = false, summary }: { accent?: boolean; summary: NoCodePageContent["foundation"]["comparison"]["summaries"]["traditional"] }) {
  return (
    <div className={`px-6 max-[980px]:px-0 ${accent ? "max-[980px]:pt-2" : ""}`}>
      <p className={`m-0 text-[clamp(1.65rem,2.5vw,2.35rem)] font-medium tracking-[-0.035em] max-[980px]:text-[1.6rem] ${accent ? "text-[#1e5278]" : "text-[var(--color-ink)]"}`}>{summary.total}</p>
      <p className="mb-0 mt-3 max-w-[31rem] text-[0.82rem] font-light leading-[1.55] text-[var(--color-muted)]">{summary.description}</p>
      <ul className="mb-0 mt-5 grid list-none gap-2 p-0">
        {summary.tags.map((tag) => (
          <li className="flex items-center gap-2.5 text-[0.82rem] leading-[1.45] text-[var(--color-ink-soft)]" key={tag}>
            <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${accent ? "bg-[#1e5278]" : "bg-[var(--color-muted)]"}`} />
            <span>{tag}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ComparisonLedger({ comparison }: { comparison: NoCodePageContent["foundation"]["comparison"] }) {
  return (
    <div>
      <div className="overflow-x-auto [scrollbar-color:rgba(11,17,22,0.2)_transparent] [scrollbar-width:thin] max-[980px]:overflow-visible">
        <div className="min-w-[920px] max-[980px]:min-w-0" data-reveal>
          <div className="relative">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid grid-cols-[minmax(15rem,0.9fr)_minmax(18rem,1.1fr)_minmax(18rem,1.1fr)] gap-4 max-[980px]:hidden">
              <div />
              <div />
              <div className="rounded-[14px] bg-[rgba(30,82,120,0.04)]" />
            </div>

            <div className="relative z-[1] grid grid-cols-[minmax(15rem,0.9fr)_minmax(18rem,1.1fr)_minmax(18rem,1.1fr)] gap-4 pb-4 pt-5 max-[980px]:sticky max-[980px]:top-0 max-[980px]:z-10 max-[980px]:grid-cols-2 max-[980px]:gap-2 max-[980px]:bg-white/95 max-[980px]:py-3 max-[980px]:backdrop-blur-md">
              <div aria-hidden="true" className="max-[980px]:hidden" />
              <div className="px-4 max-[980px]:px-3">
                <h3 className="m-0 text-[1.25rem] font-medium tracking-[-0.02em] text-[var(--color-ink)] max-[980px]:text-[0.9rem]">{comparison.traditional.title}</h3>
              </div>
              <div className="px-4 max-[980px]:px-3">
                <h3 className="m-0 text-[1.25rem] font-medium tracking-[-0.02em] text-[#1e5278] max-[980px]:text-[0.9rem]">{comparison.opero.title}</h3>
              </div>
            </div>

            <div className="relative z-[1]">
              {comparison.groups.map((group, groupIndex) => (
                <div className={groupIndex === 0 ? "mt-4" : "mt-7 max-[980px]:mt-6"} key={group.label ?? group.rows[0]?.title}>
                  {group.label ? <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-[#1e5278]">{group.label}</p> : null}
                  <div className={group.label ? "mt-3 grid gap-2.5 max-[980px]:gap-0" : "grid gap-2.5 max-[980px]:gap-0"}>
                    {group.rows.map((row) => (
                      <div className="grid grid-cols-[minmax(15rem,0.9fr)_minmax(18rem,1.1fr)_minmax(18rem,1.1fr)] items-center gap-4 rounded-[10px] transition-colors duration-200 hover:bg-[rgba(30,82,120,0.035)] max-[980px]:grid-cols-2 max-[980px]:gap-x-2 max-[980px]:gap-y-2 max-[980px]:border-t max-[980px]:border-[rgba(11,17,22,0.07)] max-[980px]:py-3 max-[980px]:first:border-t-0 max-[980px]:first:pt-0" key={row.title}>
                        <div className="pl-4 pr-6 max-[980px]:col-span-2 max-[980px]:px-3">
                          <h4 className="m-0 text-[0.94rem] font-medium leading-[1.25] text-[var(--color-ink)]">{row.title}</h4>
                          <p className="mb-0 mt-1 text-[0.74rem] font-light leading-[1.35] text-[var(--color-muted)]">{row.detail}</p>
                        </div>
                        <ComparisonCell cell={row.traditional} />
                        <ComparisonCell cell={row.opero} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-[minmax(15rem,0.9fr)_minmax(18rem,1.1fr)_minmax(18rem,1.1fr)] py-7 max-[980px]:grid-cols-1 max-[980px]:gap-6 max-[980px]:py-6">
            <div aria-hidden="true" className="max-[980px]:hidden" />
            <ComparisonSummary summary={comparison.summaries.traditional} />
            <ComparisonSummary accent summary={comparison.summaries.opero} />
          </div>
        </div>
      </div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mb-0 mt-7 grid list-none gap-3 p-0">
      {items.map((item) => (
        <li className="flex gap-3 text-[0.91rem] leading-[1.55] text-[var(--color-ink-soft)]" key={item}>
          <CircleCheckIcon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-blue)]" strokeWidth={1.6} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function StorySection({ labels, section }: { labels: NoCodePageContent["labels"]; section: NoCodePageSection }) {
  return (
    <section className={sectionClass} id={`capability-${section.number}`}>
      <div className="grid grid-cols-[minmax(0,0.82fr)_minmax(28rem,1.18fr)] items-center gap-[clamp(2rem,4vw,4rem)] max-[980px]:grid-cols-1">
        <div className={section.reverse ? "min-[981px]:order-2" : ""} data-reveal={section.reverse ? "right" : "left"}>
          <div className="flex items-center gap-4">
            <span className="text-[0.82rem] font-semibold text-[var(--color-blue)]">{section.number}</span>
            <p className={eyebrowClass}>{section.eyebrow}</p>
          </div>
          <h2 className={`${titleClass} mt-5`}>{section.title}</h2>
          <p className={`${bodyClass} mt-7`}>{section.description}</p>
          <BulletList items={section.bullets} />
        </div>
        <div className={section.reverse ? "min-[981px]:order-1" : ""}>
          <SectionVisual fallbackLabel={labels.screenshotPlaceholder} visual={section.visual} />
        </div>
      </div>
    </section>
  );
}

function ProcessTracker({ tracker }: { tracker: NoCodePageContent["process"]["tracker"] }) {
  return (
    <div className="w-full max-w-[34rem] justify-self-end max-[980px]:justify-self-start" data-reveal="right">
      <ol className="relative m-0 list-none p-0 before:absolute before:bottom-3.5 before:left-[7px] before:top-3.5 before:w-px before:bg-white/15">
        {tracker.stages.map((stage) => {
          const isComplete = stage.state === "complete";
          const isActive = stage.state === "active";

          return (
            <li
              className={`relative grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-t border-white/[0.07] py-[1.05rem] pl-8 first:border-t-0 ${stage.state === "upcoming" ? "opacity-[0.55]" : ""}`}
              key={stage.title}
            >
              <span
                aria-hidden="true"
                className={`absolute left-0 top-[1.45rem] z-[1] flex h-[15px] w-[15px] items-center justify-center rounded-full ${
                  isComplete
                    ? "bg-[#7ee7ff] text-[#0b1116]"
                    : isActive
                      ? "border border-[#f0b64a] bg-[#f0b64a]"
                      : "border-[1.5px] border-white/30 bg-[var(--color-surface-dark)]"
                }`}
              >
                {isComplete ? <CheckIcon className="h-2.5 w-2.5" strokeWidth={2.4} /> : null}
              </span>
              <div>
                <p className="m-0 text-[1.05rem] font-medium tracking-[-0.01em] text-white">{stage.title}</p>
                <p className="mb-0 mt-1 text-[0.84rem] font-light leading-[1.5] text-white/55">
                  {stage.detailBefore}
                  {stage.emphasis ? <strong className={`font-medium ${isActive ? "text-[#f6c96b]" : "text-white/85"}`}>{stage.emphasis}</strong> : null}
                </p>
              </div>
              <time className={`whitespace-nowrap pt-1 font-mono text-[0.72rem] ${isActive ? "text-[#f6c96b]" : "text-white/40"}`}>
                {stage.timestamp}
              </time>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function NoCodeFeaturePage({ content, locale, primaryHref, secondaryHref }: NoCodeFeaturePageProps) {
  return (
    <>
      <PageHero description={content.hero.description} descriptionClassName="max-w-[700px]" eyebrow={content.hero.eyebrow} primaryCta={content.hero.primaryCta} primaryHref={primaryHref} sectionClassName="min-[981px]:items-end min-[981px]:pb-0" secondaryCta={content.hero.secondaryCta} secondaryHref={secondaryHref} shellClassName="grid-cols-[minmax(0,0.86fr)_minmax(28rem,1.14fr)] gap-[clamp(2.5rem,5vw,5rem)]" title={content.hero.title} titleClassName="max-w-[840px]" visualClassName="self-end">
        <HeroProductShot image={content.hero.image} />
      </PageHero>

      <section className={sectionClass} id="foundation">
        <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(18rem,0.5fr)] items-start gap-12 max-[900px]:grid-cols-1">
          <div data-reveal>
            <p className={`${eyebrowClass} mb-4`}>{content.foundation.eyebrow}</p>
            <h2 className="m-0 max-w-[880px] text-balance text-[clamp(2.15rem,4vw,3.35rem)] leading-[1.04] tracking-[-0.045em] text-[var(--color-ink)]">{content.foundation.title}</h2>
          </div>
          <p className="m-0 text-[1rem] font-light leading-[1.68] text-[var(--color-muted)]" data-reveal>{content.foundation.description}</p>
        </div>
        <div className="mx-auto mt-[clamp(2rem,4vw,3.2rem)] w-full max-w-[82rem]">
          <ComparisonLedger comparison={content.foundation.comparison} />
        </div>
      </section>

      <section
        className="relative isolate overflow-hidden border-y border-white/8 bg-[var(--color-surface-dark)] [background-image:radial-gradient(circle_at_16%_24%,rgba(56,182,255,0.2),transparent_32%),radial-gradient(circle_at_88%_78%,rgba(20,112,184,0.18),transparent_34%),linear-gradient(145deg,#09131d_0%,#0d263f_52%,#081018_100%)] text-white"
        id="blocks"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle,rgba(255,255,255,0.16)_1px,transparent_1.2px)] [background-size:24px_24px] [mask-image:linear-gradient(to_right,transparent_0%,#000_18%,#000_82%,transparent_100%)]"
        />
        <div className={`${sectionClass} relative grid grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] gap-[clamp(2rem,7vw,7rem)] max-[809px]:grid-cols-1`}>
          <p className="m-0 text-[0.76rem] font-semibold uppercase tracking-[0.09em] text-[var(--color-blue-soft)]" data-reveal>
            {content.capabilities.eyebrow}
          </p>
          <div data-reveal>
            <h2 className="m-0 max-w-[940px] text-[clamp(2.15rem,4.4vw,3.9rem)] leading-[1.02] tracking-[-0.04em] text-white">
              {content.capabilities.title}
            </h2>
            <p className="mb-0 mt-7 max-w-[46rem] text-[1.04rem] font-light leading-[1.72] text-white/62">
              {content.capabilities.description}
            </p>
          </div>
        </div>
      </section>

      <div className="divide-y divide-[rgba(11,17,22,0.09)]">
        {content.capabilities.items.map((section) => <StorySection key={section.number} labels={content.labels} section={section} />)}
      </div>

      <section className="bg-[var(--color-surface-dark)] text-white">
        <div className={sectionClass}>
          <div className="grid grid-cols-[minmax(0,0.78fr)_minmax(28rem,1.22fr)] items-center gap-[clamp(3rem,7vw,7rem)] max-[980px]:grid-cols-1">
            <div data-reveal="left">
              <p className="m-0 text-[0.76rem] font-semibold uppercase tracking-[0.09em] text-[var(--color-blue-soft)]">{content.process.eyebrow}</p>
              <h2 className="m-0 mt-5 max-w-[780px] text-[clamp(2.15rem,4.4vw,3.9rem)] leading-[1.02] tracking-[-0.04em] text-white">{content.process.title}</h2>
              <p className="mb-0 mt-7 max-w-[42rem] text-[1.02rem] font-light leading-[1.72] text-white/62">{content.process.description}</p>
              <Link className="mt-8 inline-flex items-center gap-2 text-[0.9rem] font-medium text-[var(--color-blue-soft)]" href={localizeFeaturePath(locale, "processes")}>{content.process.cta}<ArrowRightIcon aria-hidden="true" className="h-4 w-4" /></Link>
            </div>
            <ProcessTracker tracker={content.process.tracker} />
          </div>
        </div>
      </section>

      <section className="border-y border-[rgba(11,17,22,0.1)] bg-[var(--color-paper-soft)]">
        <div className={`${sectionClass} grid grid-cols-[minmax(0,0.82fr)_minmax(28rem,1.18fr)] items-center gap-[clamp(2rem,4vw,4rem)] max-[980px]:grid-cols-1`}>
          <SectionVisual fallbackLabel={content.labels.screenshotPlaceholder} visual={content.adaptation.visual} />
          <div data-reveal="right"><p className={eyebrowClass}>{content.adaptation.eyebrow}</p><h2 className={`${titleClass} mt-5`}>{content.adaptation.title}</h2><p className={`${bodyClass} mt-7`}>{content.adaptation.description}</p><BulletList items={content.adaptation.bullets} /></div>
        </div>
      </section>

      <section className="border-y border-[rgba(11,17,22,0.1)] bg-[var(--color-paper-soft)]">
        <div className={sectionClass}>
          <p className={eyebrowClass} data-reveal>{content.faq.eyebrow}</p><h2 className={`${titleClass} mt-5`} data-reveal>{content.faq.title}</h2>
          <div className="mt-10 border-t border-[rgba(11,17,22,0.12)]">
            {content.faq.items.map((item) => <details className="group border-b border-[rgba(11,17,22,0.12)] py-1" key={item.question}><summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[1.05rem] font-medium text-[var(--color-ink)] [&::-webkit-details-marker]:hidden">{item.question}<ChevronDownIcon aria-hidden="true" className="h-5 w-5 shrink-0 text-[var(--color-blue)] transition-transform duration-300 group-open:rotate-180" strokeWidth={1.6} /></summary><p className={`${bodyClass} max-w-[54rem] pb-6 pr-10`}>{item.answer}</p></details>)}
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <p className={eyebrowClass} data-reveal>{content.related.eyebrow}</p><h2 className="mb-0 mt-5 text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.035em] text-[var(--color-ink)]" data-reveal>{content.related.title}</h2>
        <div className="mt-9 grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">{content.related.items.map((item) => <Link className="group rounded-[16px] border border-[rgba(11,17,22,0.1)] p-6 transition-colors hover:border-[rgba(56,182,255,0.45)]" href={localizeFeaturePath(locale, item.feature)} key={item.feature}><div className="flex items-start justify-between gap-4"><h3 className="m-0 text-[1.08rem] font-medium text-[var(--color-ink)]">{item.title}</h3><ArrowRightIcon aria-hidden="true" className="h-5 w-5 shrink-0 text-[var(--color-blue)] transition-transform group-hover:translate-x-1" /></div><p className="mb-0 mt-3 text-[0.85rem] font-light leading-[1.55] text-[var(--color-muted)]">{item.description}</p></Link>)}</div>
      </section>

      <section className={`${sectionClass} pt-0`}>
        <div className="relative overflow-hidden rounded-[var(--radius-panel)] [background:var(--gradient-final-cta)] px-[clamp(1.5rem,6vw,5rem)] py-[clamp(3.5rem,7vw,6rem)] text-center text-white">
          <GaugeIcon aria-hidden="true" className="absolute -right-16 -top-20 h-72 w-72 text-white/[0.045]" strokeWidth={0.8} />
          <p className="relative m-0 text-[0.76rem] font-semibold uppercase tracking-[0.09em] text-[var(--color-blue-soft)]">{content.finalCta.eyebrow}</p><h2 className="relative mx-auto mb-0 mt-5 max-w-[900px] text-[clamp(2rem,4.4vw,3.8rem)] leading-[1.04] tracking-[-0.035em]">{content.finalCta.title}</h2><p className="relative mx-auto mb-0 mt-7 max-w-[700px] text-[1.02rem] font-light leading-[1.72] text-white/65">{content.finalCta.description}</p>
          <div className="relative mt-9 flex flex-wrap justify-center gap-3"><Link className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-button)] bg-[image:var(--gradient-cta)] px-5 py-3 font-medium text-white" href={primaryHref}>{content.finalCta.primaryCta}</Link><Link className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-button)] border border-white/18 bg-white/[0.055] px-5 py-3 font-medium text-white" href={primaryHref}>{content.finalCta.secondaryCta}</Link></div>
        </div>
      </section>
    </>
  );
}
