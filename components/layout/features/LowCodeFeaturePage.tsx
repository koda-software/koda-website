import Image from "next/image";
import Link from "next/link";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right.mjs";
import CheckIcon from "lucide-react/dist/esm/icons/check.mjs";
import { ArrivingSection } from "@/components/landing/ArrivingSection";
import { BrowserFrame } from "@/components/landing/BrowserFrame";
import { HeroEdgeVisual } from "@/components/landing/HeroDashboardMock";
import { IndexNumber, LandingHero } from "@/components/landing/LandingPrimitives";
import { TwoTone } from "@/components/landing/TwoTone";
import { LowCodeDemo } from "@/components/layout/demos/LowCodeDemo";
import {
  BulletList,
  FeatureFaqSection,
  FeatureFinalCtaSection,
  FeatureRelatedSection,
  bodyClass,
  sectionClass,
  titleClass,
} from "@/components/layout/FeaturePageSections";
import type { LowCodeImage, LowCodeLadderStep, LowCodePageContent, LowCodeScenario } from "@/content/feature-stories/low-code.types";
import type { Locale } from "@/lib/i18n/config";
import { localizeFeaturePath } from "@/lib/i18n/features";

type LowCodeFeaturePageProps = {
  content: LowCodePageContent;
  locale: Locale;
  primaryHref: string;
  secondaryHref: string;
};

const darkTitleClass = "m-0 max-w-[940px] text-[clamp(2.15rem,4.4vw,3.9rem)] leading-[1.02] tracking-[-0.04em] text-white";
const darkBodyClass = "mb-0 mt-7 max-w-[46rem] text-[1.04rem] leading-[1.72] text-white/62";
const graphiteClass = "isolate border-y border-white/8 bg-[var(--color-surface-dark)] [background-image:var(--gradient-hero)] text-white";

/** Each rung sits a little further in than the one before it, so the column of rungs reads as a staircase. */
const rungIndentClasses = ["", "min-[981px]:ml-[4%]", "min-[981px]:ml-[8%]", "min-[981px]:ml-[12%]"];

function Screenshot({ image, sizes = "(max-width: 980px) 100vw, 58vw" }: { image: LowCodeImage; sizes?: string }) {
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

/** What people do by hand today, set against what happens once a rule has it. */
function ChoreLedger({ chores }: { chores: LowCodePageContent["chores"] }) {
  return (
    <div className="mt-[clamp(2.5rem,5vw,4rem)]" data-reveal>
      <div className="grid grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)] gap-x-4 pb-4 max-[760px]:hidden">
        <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-[var(--color-muted)]">{chores.todayLabel}</p>
        <span aria-hidden="true" />
        <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-[#1e5278]">{chores.insteadLabel}</p>
      </div>
      <ul className="m-0 list-none border-t border-[rgba(11,17,22,0.12)] p-0">
        {chores.rows.map((row) => (
          <li className="grid grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)] items-center gap-x-4 border-b border-[rgba(11,17,22,0.09)] py-[1.15rem] max-[760px]:grid-cols-1 max-[760px]:gap-y-2" key={row.today}>
            <p className="m-0 text-[1rem] leading-[1.45] text-[var(--color-muted)]">{row.today}</p>
            <ArrowRightIcon aria-hidden="true" className="h-4 w-4 justify-self-center text-[var(--color-blue)] max-[760px]:hidden" strokeWidth={1.8} />
            <p className="m-0 text-[1rem] font-medium leading-[1.45] text-[var(--color-ink)]">{row.instead}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** A rule's three parts as the three things to choose from. Any item of one column goes with any item of the next. */
function AnatomyColumns({ anatomy }: { anatomy: LowCodePageContent["anatomy"] }) {
  return (
    <div className="mt-[clamp(2.5rem,5vw,4rem)] grid grid-cols-3 gap-3 max-[980px]:grid-cols-1">
      {anatomy.columns.map((column, index) => (
        <div className="relative rounded-[16px] border border-white/12 bg-white/[0.04] p-[clamp(1.25rem,2.4vw,2rem)]" data-arrive key={column.label}>
          <h3 className="m-0 text-[1.4rem] font-semibold tracking-[-0.02em] text-[var(--color-blue-soft)]">{column.label}</h3>
          <ul className="mb-0 mt-5 grid list-none gap-3 p-0">
            {column.items.map((item) => (
              <li className="text-[0.94rem] leading-[1.45] text-white/78" key={item}>{item}</li>
            ))}
          </ul>
          {index < anatomy.columns.length - 1 ? (
            <span aria-hidden="true" className="absolute -right-[1.05rem] top-1/2 z-[1] flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[var(--color-surface-dark)] text-[var(--color-blue-soft)] max-[980px]:hidden">
              <ArrowRightIcon className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function ScenarioCard({ labels, scenario }: { labels: LowCodePageContent["scenarios"]["labels"]; scenario: LowCodeScenario }) {
  const stages = [
    { label: labels.when, lines: [scenario.when] },
    { label: labels.check, lines: [scenario.check] },
    { label: labels.then, lines: scenario.then },
  ];

  return (
    <article className="flex flex-col rounded-[16px] border border-[rgba(11,17,22,0.1)] bg-white p-[clamp(1.35rem,2.2vw,1.85rem)]" data-reveal>
      <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-[var(--color-blue)]">{scenario.area}</p>
      <h3 className="mb-0 mt-3 text-[1.3rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--color-ink)]">{scenario.title}</h3>
      <ol className="relative mb-0 mt-6 grid list-none gap-4 p-0 before:absolute before:bottom-2 before:left-[4px] before:top-2 before:w-px before:bg-[rgba(11,17,22,0.12)]">
        {stages.map((stage) => (
          <li className="relative pl-6" key={stage.label}>
            <span aria-hidden="true" className="absolute left-0 top-[0.3rem] h-[9px] w-[9px] rounded-full bg-[var(--color-blue-soft)]" />
            <p className="m-0 text-[0.72rem] font-semibold uppercase tracking-[0.07em] text-[var(--color-muted)]">{stage.label}</p>
            {stage.lines.map((line) => (
              <p className="mb-0 mt-1 text-[0.91rem] leading-[1.45] text-[var(--color-ink-soft)]" key={line}>{line}</p>
            ))}
          </li>
        ))}
      </ol>
    </article>
  );
}

function LadderRung({ index, labels, step }: { index: number; labels: Pick<LowCodePageContent["ladder"], "reachForLabel" | "whoLabel">; step: LowCodeLadderStep }) {
  return (
    <li className={`grid grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] items-start gap-x-[clamp(1.5rem,4vw,3.5rem)] gap-y-6 border-t border-white/12 py-[clamp(2rem,3.6vw,3rem)] max-[980px]:grid-cols-1 ${rungIndentClasses[index] ?? ""}`.trim()} data-reveal>
      <div>
        <div className="flex items-baseline gap-3">
          <IndexNumber index={index} invert />
          <h3 className="m-0 text-[clamp(1.5rem,2.5vw,2rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-white">{step.name}</h3>
        </div>
        <p className="mb-0 mt-4 text-[0.98rem] leading-[1.65] text-white/62">{step.description}</p>
        <dl className="mb-0 mt-5 grid gap-3 text-[0.88rem] leading-[1.5]">
          <div>
            <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-white/42">{labels.reachForLabel}</dt>
            <dd className="m-0 mt-1 text-white/85">{step.reachFor}</dd>
          </div>
          <div>
            <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-white/42">{labels.whoLabel}</dt>
            <dd className="m-0 mt-1 text-white/85">{step.who}</dd>
          </div>
        </dl>
      </div>
      <figure className="m-0 min-w-0 overflow-hidden rounded-[12px] border border-white/12 bg-[rgba(4,10,16,0.55)]">
        <figcaption className="border-b border-white/10 px-4 py-2.5 text-[0.72rem] font-medium text-white/50">{step.sample.label}</figcaption>
        <pre className="m-0 overflow-x-auto p-4 [font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace] text-[0.8rem] leading-[1.65] text-[#cfe6f7]"><code>{step.sample.code}</code></pre>
      </figure>
    </li>
  );
}

export function LowCodeFeaturePage({ content, locale, primaryHref, secondaryHref }: LowCodeFeaturePageProps) {
  return (
    <>
      <LandingHero description={content.hero.description} primaryCta={content.hero.primaryCta} primaryHref={primaryHref} secondaryCta={content.hero.secondaryCta} secondaryHref={secondaryHref} title={content.hero.title} visualMode="edge">
        <HeroEdgeVisual image={content.hero.image} />
      </LandingHero>

      <ArrivingSection className="bg-[var(--color-mist)]" cut="card" id="chores">
        <div className={sectionClass}>
          <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(18rem,0.5fr)] items-start gap-12 max-[900px]:grid-cols-1">
            <h2 className="m-0 max-w-[880px] text-balance text-[clamp(2.15rem,4vw,3.35rem)] leading-[1.04] tracking-[-0.045em] text-[var(--color-ink)]" data-reveal><TwoTone text={content.chores.title} /></h2>
            <p className="m-0 text-[1rem] leading-[1.68] text-[var(--color-muted)]" data-reveal>{content.chores.description}</p>
          </div>
          <ChoreLedger chores={content.chores} />
        </div>
      </ArrivingSection>

      <ArrivingSection className={graphiteClass} cut="wipe" id="anatomy">
        <div className={sectionClass}>
          <div data-reveal>
            <h2 className={darkTitleClass} data-arrive><TwoTone text={content.anatomy.title} /></h2>
            <p className={darkBodyClass} data-arrive>{content.anatomy.description}</p>
          </div>
          <AnatomyColumns anatomy={content.anatomy} />
          <p className="mb-0 mt-6 max-w-[46rem] text-[0.82rem] leading-[1.55] text-white/45">{content.anatomy.note}</p>
        </div>
      </ArrivingSection>

      <ArrivingSection cut="curtain" id="readable">
        <div className={sectionClass}>
          <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(28rem,1.2fr)] items-center gap-[clamp(2rem,4vw,4rem)] max-[980px]:grid-cols-1">
            <div data-reveal="left">
              <h2 className={titleClass}><TwoTone text={content.sentence.title} /></h2>
              <p className={`${bodyClass} mt-7`}>{content.sentence.description}</p>
              <BulletList items={content.sentence.bullets} />
            </div>
            <div className="min-w-0" data-arrive>
              <LowCodeDemo tone="light" content={content.sentence.demo} />
            </div>
          </div>
        </div>
      </ArrivingSection>

      <section className="border-t border-[rgba(11,17,22,0.09)] bg-[var(--color-mist)]" id="scenarios">
        <div className={sectionClass}>
          <div className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] items-end gap-x-[clamp(2rem,5vw,5rem)] gap-y-6 max-[980px]:grid-cols-1" data-reveal>
            <h2 className={titleClass}><TwoTone text={content.scenarios.title} /></h2>
            <p className={bodyClass}>{content.scenarios.description}</p>
          </div>
          <div className="mt-[clamp(2.5rem,5vw,4rem)] grid grid-cols-3 gap-3 max-[1100px]:grid-cols-2 max-[700px]:grid-cols-1">
            {content.scenarios.items.map((scenario) => <ScenarioCard key={scenario.title} labels={content.scenarios.labels} scenario={scenario} />)}
          </div>
        </div>
      </section>

      <ArrivingSection className={graphiteClass} cut="steps" id="ladder">
        <div className={sectionClass}>
          <div data-reveal>
            <h2 className={darkTitleClass}><TwoTone text={content.ladder.title} /></h2>
            <p className={darkBodyClass}>{content.ladder.description}</p>
          </div>
          <ol className="mb-0 mt-[clamp(2.5rem,5vw,4rem)] list-none p-0">
            {content.ladder.steps.map((step, index) => <LadderRung index={index} key={step.name} labels={content.ladder} step={step} />)}
          </ol>
          <div className="border-t border-white/12 pt-[clamp(2.5rem,5vw,4rem)]" data-reveal>
            <h3 className="m-0 text-[clamp(1.5rem,2.6vw,2.1rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-white">{content.ladder.closingTitle}</h3>
            <div className="mt-7 grid grid-cols-3 gap-x-8 gap-y-6 max-[860px]:grid-cols-1">
              {content.ladder.closing.map((item) => (
                <div key={item.title}>
                  <h4 className="m-0 text-[1.02rem] font-semibold text-[var(--color-blue-soft)]">{item.title}</h4>
                  <p className="mb-0 mt-2 text-[0.92rem] leading-[1.6] text-white/62">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ArrivingSection>

      <ArrivingSection cut="slide" id="custom-blocks">
        <div className={sectionClass}>
          <div className="grid grid-cols-[minmax(0,0.82fr)_minmax(28rem,1.18fr)] items-center gap-[clamp(2rem,4vw,4rem)] max-[980px]:grid-cols-1">
            <div data-reveal="left">
              <h2 className={titleClass}><TwoTone text={content.blocks.title} /></h2>
              <p className={`${bodyClass} mt-7`}>{content.blocks.description}</p>
              <BulletList items={content.blocks.bullets} />
            </div>
            <div className="min-w-0" data-arrive="right">
              <Screenshot image={content.blocks.image} />
            </div>
          </div>
        </div>
      </ArrivingSection>

      <ArrivingSection className="border-t border-[rgba(11,17,22,0.09)]" cut="slide" id="queries">
        <div className={sectionClass}>
          <div className="grid grid-cols-[minmax(28rem,1.18fr)_minmax(0,0.82fr)] items-center gap-[clamp(2rem,4vw,4rem)] max-[980px]:grid-cols-1">
            <div className="min-w-0 max-[980px]:order-2" data-arrive="left">
              <Screenshot image={content.queries.image} />
            </div>
            <div data-reveal="right">
              <h2 className={titleClass}><TwoTone text={content.queries.title} /></h2>
              <p className={`${bodyClass} mt-7`}>{content.queries.description}</p>
              <p className="mb-0 mt-7 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-[#1e5278]">{content.queries.consumersLabel}</p>
              <ul className="mb-0 mt-3 flex list-none flex-wrap gap-2 p-0">
                {content.queries.consumers.map((consumer) => (
                  <li className="rounded-full border border-[rgba(11,17,22,0.12)] px-3 py-1.5 text-[0.82rem] text-[var(--color-ink-soft)]" key={consumer}>{consumer}</li>
                ))}
              </ul>
              <BulletList items={content.queries.bullets} />
            </div>
          </div>
        </div>
      </ArrivingSection>

      <ArrivingSection cut="curtain" id="trust">
        <div className={sectionClass}>
          <div className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] items-end gap-x-[clamp(2rem,5vw,5rem)] gap-y-6 max-[980px]:grid-cols-1" data-reveal>
            <h2 className={titleClass} data-arrive><TwoTone text={content.trust.title} /></h2>
            <p className={bodyClass} data-arrive>{content.trust.description}</p>
          </div>
          <div className="mt-[clamp(2.5rem,5vw,4rem)] grid grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] items-start gap-[clamp(2rem,4vw,4rem)] max-[980px]:grid-cols-1">
            <ul className="m-0 list-none border-t border-[rgba(11,17,22,0.12)] p-0 max-[980px]:order-2" data-reveal="left">
              {content.trust.items.map((item) => (
                <li className="border-b border-[rgba(11,17,22,0.09)] py-5" key={item.title}>
                  <h3 className="m-0 text-[1.05rem] font-semibold text-[var(--color-ink)]">{item.title}</h3>
                  <p className="mb-0 mt-1.5 text-[0.92rem] leading-[1.55] text-[var(--color-muted)]">{item.description}</p>
                </li>
              ))}
            </ul>
            <div className="grid min-w-0 gap-5">
              <Screenshot image={content.trust.dryRunImage} />
              <Screenshot image={content.trust.historyImage} />
            </div>
          </div>
        </div>
      </ArrivingSection>

      <ArrivingSection className={graphiteClass} cut="wipe" id="owners">
        <div className={sectionClass}>
          <div data-reveal>
            <h2 className={darkTitleClass} data-arrive><TwoTone text={content.owners.title} /></h2>
            <p className={darkBodyClass} data-arrive>{content.owners.description}</p>
          </div>
          <div className="mt-[clamp(2.5rem,5vw,4rem)] grid grid-cols-2 gap-3 max-[860px]:grid-cols-1">
            {content.owners.columns.map((column) => (
              <div className="rounded-[var(--radius-panel)] border border-white/12 bg-white/[0.04] p-[clamp(1.5rem,3.5vw,2.75rem)]" data-arrive key={column.title}>
                <h3 className="m-0 text-[clamp(1.35rem,2.2vw,1.75rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-white">{column.title}</h3>
                <ul className="mb-0 mt-6 grid list-none gap-3.5 p-0">
                  {column.items.map((item) => (
                    <li className="flex gap-3 text-[0.94rem] leading-[1.55] text-white/72" key={item}>
                      <CheckIcon aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[var(--color-blue-soft)]" strokeWidth={2} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Link className="mt-8 inline-flex items-center gap-2 text-[0.9rem] font-medium text-[var(--color-blue-soft)]" href={localizeFeaturePath(locale, "ai")}>
            {content.owners.aiCta}
            <ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </ArrivingSection>

      <FeatureFaqSection faq={content.faq} />
      <FeatureRelatedSection locale={locale} related={content.related} />
      <ArrivingSection cut="open">
        <div data-arrive>
          <FeatureFinalCtaSection finalCta={content.finalCta} primaryHref={primaryHref} />
        </div>
      </ArrivingSection>

      <section className={`${sectionClass} pt-0`}>
        <h2 className="m-0 text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.1] tracking-[-0.03em] text-[var(--color-ink)]"><TwoTone text={content.seoText.title} /></h2>
        <div className="mt-6 grid max-w-[62rem] gap-5">
          {content.seoText.paragraphs.map((paragraph) => <p className={bodyClass} key={paragraph}>{paragraph}</p>)}
        </div>
      </section>
    </>
  );
}
