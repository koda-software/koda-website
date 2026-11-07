import Image from "next/image";
import ArrowDownIcon from "lucide-react/dist/esm/icons/arrow-down.mjs";
import { ArrivingSection } from "@/components/landing/ArrivingSection";
import { BrowserFrame } from "@/components/landing/BrowserFrame";
import { HeroEdgeVisual } from "@/components/landing/HeroDashboardMock";
import { LandingHero } from "@/components/landing/LandingPrimitives";
import { TwoTone } from "@/components/landing/TwoTone";
import { IntegrationsDemo } from "@/components/layout/demos/IntegrationsDemo";
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
import type { IntegrationsPageContent, IntegrationsPageImage } from "@/content/feature-stories/integrations.types";
import type { Locale } from "@/lib/i18n/config";

type IntegrationsFeaturePageProps = {
  content: IntegrationsPageContent;
  locale: Locale;
  primaryHref: string;
  secondaryHref: string;
};

const darkSectionClass = "isolate border-y border-white/8 bg-[var(--color-surface-dark)] [background-image:var(--gradient-hero)] text-white";
const darkTitleClass = "m-0 max-w-[940px] text-[clamp(2.15rem,4.4vw,3.9rem)] leading-[1.02] tracking-[-0.04em] text-white";
const darkBodyClass = "m-0 max-w-[46rem] text-[1.04rem] leading-[1.72] text-white/62";

function Screenshot({ image, sizes }: { image: IntegrationsPageImage; sizes: string }) {
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

/** The buyer's own systems down the side, so that the table reads as their company rather than as our feature list. */
function SystemsLedger({ keep }: { keep: IntegrationsPageContent["keep"] }) {
  const rowClass = "grid grid-cols-[minmax(0,1fr)_minmax(10rem,0.62fr)_minmax(0,1.5fr)] items-start gap-x-[clamp(1rem,3vw,3rem)] max-[860px]:grid-cols-1 max-[860px]:gap-y-2.5";

  return (
    <div className="mt-[clamp(2.5rem,5vw,4rem)]" data-reveal>
      <div className={`${rowClass} border-b border-[rgba(11,17,22,0.16)] pb-3 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-[#1e5278] max-[860px]:hidden`}>
        <span>{keep.columns.system}</span>
        <span>{keep.columns.connection}</span>
        <span>{keep.columns.result}</span>
      </div>
      {keep.rows.map((row) => (
        <div className={`${rowClass} border-b border-[rgba(11,17,22,0.09)] py-5 transition-colors duration-200 hover:bg-[rgba(30,82,120,0.035)]`} key={row.system}>
          <div>
            <h3 className="m-0 text-[1.08rem] font-semibold tracking-[-0.015em] text-[var(--color-ink)]">{row.system}</h3>
            <p className="mb-0 mt-1 text-[0.8rem] leading-[1.45] text-[var(--color-muted)]">{row.examples}</p>
          </div>
          <div>
            <span className="inline-block rounded-full border border-[rgba(30,82,120,0.22)] bg-white px-3 py-1 text-[0.76rem] font-medium leading-[1.35] text-[#1e5278]">{row.connection}</span>
          </div>
          <p className="m-0 text-[0.95rem] leading-[1.58] text-[var(--color-ink-soft)]">{row.result}</p>
        </div>
      ))}
      <p className="mb-0 mt-7 max-w-[46rem] text-[0.95rem] leading-[1.65] text-[var(--color-muted)]">{keep.footnote}</p>
    </div>
  );
}

function ProcessLane({ lane, side }: { lane: IntegrationsPageContent["compliance"]["lanes"][number]; side: "left" | "right" }) {
  return (
    <div data-reveal={side}>
      <h3 className="m-0 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-blue-soft)]">{lane.title}</h3>
      <ol className="relative m-0 mt-5 list-none p-0 before:absolute before:bottom-6 before:left-[7px] before:top-6 before:w-px before:bg-white/15">
        {lane.stages.map((stage) => (
          <li className="relative border-t border-white/[0.08] py-[1.05rem] pl-8" key={stage.title}>
            <span aria-hidden="true" className="absolute left-0 top-[1.4rem] z-[1] h-[15px] w-[15px] rounded-full border-[1.5px] border-[#38b6ff] bg-[var(--color-surface-dark)]" />
            <p className="m-0 text-[1.05rem] font-medium tracking-[-0.01em] text-white">{stage.title}</p>
            <p className="mb-0 mt-1 text-[0.86rem] leading-[1.55] text-white/55">{stage.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ResultCard({ rows, sampleLabel }: { rows: IntegrationsPageContent["checks"]["items"][number]["rows"]; sampleLabel: string }) {
  return (
    <div className="mt-7 rounded-[14px] border border-[rgba(11,17,22,0.1)] bg-white p-5 shadow-[0_18px_44px_-30px_rgba(7,26,43,0.4)]">
      <dl className="m-0 grid gap-3">
        {rows.map((row) => (
          <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3 text-[0.86rem] leading-[1.45]" key={row.label}>
            <dt className="text-[var(--color-muted)]">{row.label}</dt>
            <dd className="m-0 font-medium text-[var(--color-ink)]">{row.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mb-0 mt-4 border-t border-[rgba(11,17,22,0.08)] pt-3 text-[0.72rem] text-[var(--color-muted)]">{sampleLabel}</p>
    </div>
  );
}

function ScenarioCard({ scenario }: { scenario: IntegrationsPageContent["scenarios"]["items"][number] }) {
  return (
    <article className="flex flex-col rounded-[16px] border border-[rgba(11,17,22,0.1)] bg-white p-6" data-reveal>
      <p className="m-0 text-[0.72rem] leading-[1.4] text-[var(--color-muted)]">
        <span className="font-semibold uppercase tracking-[0.08em] text-[#1e5278]">{scenario.team}</span>
        <span aria-hidden="true"> · </span>
        {scenario.industry}
      </p>
      <h3 className="mb-0 mt-3 text-[1.2rem] font-semibold leading-[1.25] tracking-[-0.02em] text-[var(--color-ink)]">{scenario.title}</h3>
      <ol className="m-0 mt-5 grid list-none gap-1 p-0">
        {scenario.steps.map((step, index) => (
          <li key={step}>
            <span className="block rounded-[8px] bg-[var(--color-mist)] px-3 py-2 text-[0.84rem] leading-[1.4] text-[var(--color-ink-soft)]">{step}</span>
            {index < scenario.steps.length - 1 ? <ArrowDownIcon aria-hidden="true" className="mx-auto mt-1 h-3.5 w-3.5 text-[var(--color-blue)]" strokeWidth={2} /> : null}
          </li>
        ))}
      </ol>
      <p className="mb-0 mt-auto pt-5 text-[0.9rem] leading-[1.55] text-[var(--color-muted)]">{scenario.outcome}</p>
    </article>
  );
}

function CodePanel({ panel }: { panel: IntegrationsPageContent["developers"]["inbound"] }) {
  return (
    <figure className="m-0 overflow-hidden rounded-[14px] border border-white/10 bg-black/35">
      <figcaption className="border-b border-white/10 px-5 py-3 text-[0.76rem] font-medium text-white/70">{panel.label}</figcaption>
      <pre className="m-0 overflow-x-auto px-5 py-4 font-mono text-[0.8rem] leading-[1.7] text-[#c9e8ff]"><code>{panel.lines.join("\n")}</code></pre>
    </figure>
  );
}

export function IntegrationsFeaturePage({ content, locale, primaryHref, secondaryHref }: IntegrationsFeaturePageProps) {
  return (
    <>
      <LandingHero description={content.hero.description} primaryCta={content.hero.primaryCta} primaryHref={primaryHref} secondaryCta={content.hero.secondaryCta} secondaryHref={secondaryHref} title={content.hero.title} visualMode="edge">
        <HeroEdgeVisual image={content.hero.image} />
      </LandingHero>

      <ArrivingSection className="bg-[var(--color-mist)]" cut="card" id="your-systems">
        <div className={sectionClass}>
          <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(18rem,0.55fr)] items-start gap-12 max-[900px]:grid-cols-1">
            <h2 className="m-0 max-w-[880px] text-balance text-[clamp(2.15rem,4vw,3.35rem)] leading-[1.04] tracking-[-0.045em] text-[var(--color-ink)]" data-reveal><TwoTone text={content.keep.title} /></h2>
            <p className="m-0 text-[1rem] leading-[1.68] text-[var(--color-muted)]" data-reveal>{content.keep.description}</p>
          </div>
          <SystemsLedger keep={content.keep} />
        </div>
      </ArrivingSection>

      <ArrivingSection cut="curtain" id="no-retyping">
        <div className={`${shellClass} py-[clamp(5rem,9vw,8rem)]`}>
          <div className="mx-auto max-w-[52rem] text-center" data-reveal>
            <h2 className={`${titleClass} mx-auto`} data-arrive><TwoTone text={content.demo.title} /></h2>
            <p className={`${bodyClass} mx-auto mt-6`} data-arrive>{content.demo.description}</p>
          </div>
          <div className="mx-auto mt-[clamp(2.5rem,5vw,4rem)] max-w-[62rem]" data-arrive>
            <IntegrationsDemo tone="light" content={content.demo.content} />
          </div>
        </div>
      </ArrivingSection>

      <ArrivingSection className={darkSectionClass} cut="wipe" id="compliance">
        <div className={sectionClass}>
          <div data-reveal>
            <h2 className={darkTitleClass} data-arrive><TwoTone text={content.compliance.title} /></h2>
            <p className={`${darkBodyClass} mt-7`} data-arrive>{content.compliance.description}</p>
          </div>
          <div className="mt-[clamp(3rem,6vw,5rem)] grid grid-cols-2 gap-[clamp(2.5rem,6vw,6rem)] max-[860px]:grid-cols-1">
            {content.compliance.lanes.map((lane, index) => <ProcessLane key={lane.title} lane={lane} side={index === 0 ? "left" : "right"} />)}
          </div>
        </div>
      </ArrivingSection>

      <ArrivingSection cut="curtain" id="ksef">
        <div className={sectionClass}>
          <div className="grid grid-cols-[minmax(0,0.82fr)_minmax(28rem,1.18fr)] items-center gap-[clamp(2rem,4vw,4rem)] max-[980px]:grid-cols-1">
            <div data-reveal="left">
              <h2 className={titleClass}><TwoTone text={content.ksef.title} /></h2>
              <p className={`${bodyClass} mt-7`}>{content.ksef.description}</p>
            </div>
            <div className="min-w-0" data-arrive>
              <Screenshot image={content.ksef.image} sizes="(max-width: 980px) 100vw, 58vw" />
            </div>
          </div>
          <div className="mt-[clamp(3rem,6vw,5rem)] grid grid-cols-4 gap-x-8 gap-y-8 max-[1040px]:grid-cols-2 max-[600px]:grid-cols-1">
            {content.ksef.cases.map((item) => (
              <div className="border-t-2 border-[var(--color-ink)] pt-4" data-reveal key={item.title}>
                <h3 className="m-0 text-[1.08rem] font-semibold leading-[1.3] tracking-[-0.015em] text-[var(--color-ink)]">{item.title}</h3>
                <p className="mb-0 mt-2.5 text-[0.9rem] leading-[1.6] text-[var(--color-muted)]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </ArrivingSection>

      <ArrivingSection className="border-t border-[rgba(11,17,22,0.09)] bg-[var(--color-mist)]" cut="slide" id="checks">
        <div className={sectionClass}>
          <div data-reveal>
            <h2 className={titleClass}><TwoTone text={content.checks.title} /></h2>
            <p className={`${bodyClass} mt-7`}>{content.checks.description}</p>
          </div>
          <div className="mt-[clamp(2.5rem,5vw,4rem)] grid grid-cols-2 gap-[clamp(2rem,5vw,5rem)] max-[860px]:grid-cols-1">
            {content.checks.items.map((item, index) => (
              <div data-arrive={index === 0 ? "left" : "right"} key={item.title}>
                <h3 className="m-0 text-[1.45rem] font-semibold leading-[1.2] tracking-[-0.025em] text-[var(--color-ink)]">{item.title}</h3>
                <p className="mb-0 mt-3 text-[0.98rem] leading-[1.65] text-[var(--color-muted)]">{item.description}</p>
                <ResultCard rows={item.rows} sampleLabel={content.checks.sampleLabel} />
              </div>
            ))}
          </div>
        </div>
      </ArrivingSection>

      <ArrivingSection cut="open" id="scenarios">
        <div className={sectionClass}>
          <div className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] items-end gap-x-[clamp(2rem,5vw,5rem)] gap-y-6 max-[980px]:grid-cols-1" data-reveal>
            <h2 className={titleClass} data-arrive><TwoTone text={content.scenarios.title} /></h2>
            <p className={bodyClass} data-arrive>{content.scenarios.description}</p>
          </div>
          <div className="mt-[clamp(2.5rem,5vw,4rem)] grid grid-cols-3 gap-4 max-[1040px]:grid-cols-2 max-[680px]:grid-cols-1">
            {content.scenarios.items.map((scenario) => <ScenarioCard key={scenario.title} scenario={scenario} />)}
          </div>
        </div>
      </ArrivingSection>

      <ArrivingSection className="bg-[var(--color-surface-dark)] text-white" cut="steps" id="developers">
        <div className={sectionClass}>
          <div className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] items-center gap-[clamp(2.5rem,6vw,6rem)] max-[980px]:grid-cols-1">
            <div data-reveal="left">
              <h2 className={darkTitleClass}><TwoTone text={content.developers.title} /></h2>
              <p className={`${darkBodyClass} mt-7`}>{content.developers.description}</p>
              <ul className="mb-0 mt-7 grid list-none gap-3 p-0">
                {content.developers.bullets.map((bullet) => (
                  <li className="flex gap-3 text-[0.91rem] leading-[1.55] text-white/72" key={bullet}>
                    <span aria-hidden="true" className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-blue-soft)]" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid min-w-0 gap-4" data-reveal="right">
              <CodePanel panel={content.developers.inbound} />
              <CodePanel panel={content.developers.outbound} />
            </div>
          </div>
        </div>
      </ArrivingSection>

      <ArrivingSection cut="curtain" id="control">
        <div className={sectionClass}>
          <div data-reveal>
            <h2 className={titleClass}><TwoTone text={content.control.title} /></h2>
            <p className={`${bodyClass} mt-7`}>{content.control.description}</p>
          </div>
          <div className="mt-[clamp(2.5rem,5vw,4rem)] grid grid-cols-2 items-start gap-[clamp(1.5rem,3vw,3rem)] max-[860px]:grid-cols-1">
            {content.control.shots.map((shot) => (
              <div className="min-w-0" data-arrive key={shot.title}>
                <Screenshot image={shot.image} sizes="(max-width: 860px) 100vw, 48vw" />
                <h3 className="mb-0 mt-6 text-[1.15rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">{shot.title}</h3>
                <p className="mb-0 mt-2 text-[0.94rem] leading-[1.62] text-[var(--color-muted)]">{shot.description}</p>
              </div>
            ))}
          </div>
          <BulletList items={content.control.facts} />
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
