import Image from "next/image";
import { ArrivingSection } from "@/components/landing/ArrivingSection";
import { BrowserFrame } from "@/components/landing/BrowserFrame";
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
import type { DocumentsPageContent } from "@/content/feature-stories/documents.types";
import type { Locale } from "@/lib/i18n/config";

type DocumentsFeaturePageProps = {
  content: DocumentsPageContent;
  locale: Locale;
  primaryHref: string;
  secondaryHref: string;
};

const darkTitleClass = "m-0 max-w-[820px] text-[clamp(2.15rem,4.4vw,3.9rem)] leading-[1.02] tracking-[-0.04em] text-white";
const darkBodyClass = "mb-0 mt-7 max-w-[42rem] text-[1.02rem] leading-[1.72] text-white/62";

function Screenshot({ image, sizes }: { image: DocumentsPageContent["hero"]["image"]; sizes: string }) {
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

/** The same question asked of a folder and of a case. The answers do the arguing, so nothing here is decorated. */
function QuestionLedger({ problem }: { problem: DocumentsPageContent["problem"] }) {
  return (
    <div className="mt-[clamp(2.5rem,5vw,4rem)]" data-reveal>
      <div className="grid grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)_minmax(0,1.05fr)] gap-6 pb-4 max-[860px]:hidden">
        <span aria-hidden="true" />
        <p className="m-0 text-[0.72rem] font-semibold uppercase tracking-[0.09em] text-[var(--color-muted)]">{problem.folderLabel}</p>
        <p className="m-0 text-[0.72rem] font-semibold uppercase tracking-[0.09em] text-[#1e5278]">{problem.caseLabel}</p>
      </div>
      <dl className="m-0 border-t border-[rgba(11,17,22,0.14)]">
        {problem.rows.map((row) => (
          <div className="grid grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)_minmax(0,1.05fr)] items-baseline gap-6 border-b border-[rgba(11,17,22,0.1)] py-6 max-[860px]:grid-cols-1 max-[860px]:gap-3" key={row.question}>
            <dt className="text-[clamp(1.1rem,1.7vw,1.4rem)] font-medium leading-[1.25] tracking-[-0.02em] text-[var(--color-ink)]">{row.question}</dt>
            <dd className="m-0 text-[0.94rem] leading-[1.55] text-[var(--color-muted)]">
              <span className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.09em] min-[861px]:hidden">{problem.folderLabel}</span>
              {row.folder}
            </dd>
            <dd className="m-0 text-[0.94rem] font-medium leading-[1.55] text-[#1e5278]">
              <span className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.09em] min-[861px]:hidden">{problem.caseLabel}</span>
              {row.opero}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** One illustrative case, told as its stages. The tag says what moved it on, which is usually not a person. */
function JourneyTrack({ stages }: { stages: DocumentsPageContent["journey"]["stages"] }) {
  return (
    <ol className="relative m-0 w-full list-none p-0 before:absolute before:bottom-6 before:left-[7px] before:top-6 before:w-px before:bg-white/15" data-reveal="right">
      {stages.map((stage) => (
        <li className="relative grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-t border-white/[0.07] py-[1.05rem] pl-8 first:border-t-0" key={stage.title}>
          <span aria-hidden="true" className={`absolute left-0 top-[1.45rem] z-[1] h-[15px] w-[15px] rounded-full ${stage.active ? "bg-[#f0b64a]" : "bg-[#38b6ff]"}`} />
          <div>
            <p className="m-0 text-[1.05rem] font-medium tracking-[-0.01em] text-white">{stage.title}</p>
            <p className="mb-0 mt-1 text-[0.86rem] leading-[1.5] text-white/58">{stage.detail}</p>
          </div>
          <span className={`whitespace-nowrap pt-1 font-mono text-[0.72rem] ${stage.active ? "text-[#f6c96b]" : "text-white/45"}`}>{stage.tag}</span>
        </li>
      ))}
    </ol>
  );
}

function ScenarioGrid({ scenarios }: { scenarios: DocumentsPageContent["scenarios"] }) {
  return (
    <div className="mt-[clamp(2.5rem,5vw,4rem)] grid grid-cols-2 gap-x-[clamp(2rem,5vw,5rem)] gap-y-[clamp(2.5rem,4vw,3.5rem)] max-[860px]:grid-cols-1">
      {scenarios.items.map((item) => (
        <article className="border-t border-[rgba(11,17,22,0.16)] pt-5" data-arrive key={item.title}>
          <p className="m-0 text-[0.72rem] font-semibold uppercase tracking-[0.09em] text-[#1e5278]">{item.area}</p>
          <h3 className="mb-0 mt-2 text-[clamp(1.25rem,2vw,1.6rem)] font-medium leading-[1.2] tracking-[-0.025em] text-[var(--color-ink)]">{item.title}</h3>
          <dl className="mb-0 mt-5 grid gap-3">
            {item.steps.map((step, index) => (
              <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3" key={scenarios.stepLabels[index]}>
                <dt className="pt-[0.2rem] font-mono text-[0.72rem] text-[var(--color-muted)]">{scenarios.stepLabels[index]}</dt>
                <dd className="m-0 text-[0.92rem] leading-[1.55] text-[var(--color-ink-soft)]">{step}</dd>
              </div>
            ))}
          </dl>
        </article>
      ))}
    </div>
  );
}

export function DocumentsFeaturePage({ content, locale, primaryHref, secondaryHref }: DocumentsFeaturePageProps) {
  return (
    <>
      <LandingHero description={content.hero.description} primaryCta={content.hero.primaryCta} primaryHref={primaryHref} secondaryCta={content.hero.secondaryCta} secondaryHref={secondaryHref} title={content.hero.title} visualMode="edge">
        <HeroEdgeVisual image={content.hero.image} />
      </LandingHero>

      <ArrivingSection className="bg-[var(--color-mist)]" cut="card" id="problem">
        <div className={sectionClass}>
          <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(18rem,0.6fr)] items-start gap-12 max-[900px]:grid-cols-1">
            <h2 className="m-0 max-w-[880px] text-balance text-[clamp(2.15rem,4vw,3.35rem)] leading-[1.04] tracking-[-0.045em] text-[var(--color-ink)]" data-reveal><TwoTone text={content.problem.title} /></h2>
            <p className="m-0 text-[1rem] leading-[1.68] text-[var(--color-muted)]" data-reveal>{content.problem.description}</p>
          </div>
          <QuestionLedger problem={content.problem} />
        </div>
      </ArrivingSection>

      <ArrivingSection cut="curtain" id="case">
        <div className={sectionClass}>
          <div className="grid grid-cols-[minmax(0,0.82fr)_minmax(28rem,1.18fr)] items-center gap-[clamp(2rem,4vw,4rem)] max-[980px]:grid-cols-1">
            <div data-reveal="left">
              <h2 className={titleClass}><TwoTone text={content.caseFile.title} /></h2>
              <p className={`${bodyClass} mt-7`}>{content.caseFile.description}</p>
              <BulletList items={content.caseFile.bullets} />
            </div>
            <div data-arrive>
              <Screenshot image={content.caseFile.image} sizes="(max-width: 980px) 100vw, 58vw" />
            </div>
          </div>
        </div>
      </ArrivingSection>

      <ArrivingSection className="isolate border-y border-white/8 bg-[var(--color-surface-dark)] [background-image:var(--gradient-hero)] text-white" cut="wipe" id="journey">
        <div className={sectionClass}>
          <div className="grid grid-cols-[minmax(0,0.78fr)_minmax(28rem,1.22fr)] items-center gap-[clamp(3rem,7vw,7rem)] max-[980px]:grid-cols-1">
            <div data-arrive>
              <h2 className={darkTitleClass}><TwoTone text={content.journey.title} /></h2>
              <p className={darkBodyClass}>{content.journey.description}</p>
              <p className="mb-0 mt-5 text-[0.82rem] leading-[1.55] text-white/42">{content.journey.note}</p>
            </div>
            <JourneyTrack stages={content.journey.stages} />
          </div>
        </div>
      </ArrivingSection>

      <ArrivingSection cut="slide" id="scenarios">
        <div className={sectionClass}>
          <div data-reveal>
            <h2 className={titleClass}><TwoTone text={content.scenarios.title} /></h2>
            <p className={`${bodyClass} mt-7`}>{content.scenarios.description}</p>
          </div>
          <ScenarioGrid scenarios={content.scenarios} />
        </div>
      </ArrivingSection>

      <ArrivingSection className="border-t border-[rgba(11,17,22,0.09)] bg-[var(--color-paper-soft)]" cut="open" id="generate">
        <div className="py-[clamp(5.5rem,9vw,8rem)]">
          <div className={`${shellClass} grid grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] items-end gap-x-[clamp(2rem,5vw,5rem)] gap-y-6 max-[980px]:grid-cols-1`} data-reveal>
            <h2 className={titleClass} data-arrive><TwoTone text={content.generate.title} /></h2>
            <p className={bodyClass} data-arrive>{content.generate.description}</p>
          </div>
          <div className={`${shellClass} mt-[clamp(2.5rem,5vw,4rem)]`} data-arrive>
            <Screenshot image={content.generate.image} sizes="100vw" />
          </div>
          <div className={`${shellClass} mt-[clamp(2.5rem,4vw,3.5rem)] grid grid-cols-4 gap-[clamp(1.5rem,3vw,2.5rem)] max-[1100px]:grid-cols-2 max-[620px]:grid-cols-1`}>
            {content.generate.points.map((point) => (
              <div className="border-t border-[rgba(11,17,22,0.16)] pt-4" data-reveal key={point.title}>
                <h3 className="m-0 text-[1.02rem] font-semibold tracking-[-0.01em] text-[var(--color-ink)]">{point.title}</h3>
                <p className="mb-0 mt-2 text-[0.88rem] leading-[1.55] text-[var(--color-muted)]">{point.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </ArrivingSection>

      <ArrivingSection className="border-t border-[rgba(11,17,22,0.09)]" cut="curtain" id="write">
        <div className={sectionClass}>
          <div className="grid grid-cols-[minmax(28rem,1.18fr)_minmax(0,0.82fr)] items-center gap-[clamp(2rem,4vw,4rem)] max-[980px]:grid-cols-1">
            <div className="max-[980px]:order-2" data-arrive>
              <Screenshot image={content.write.image} sizes="(max-width: 980px) 100vw, 58vw" />
            </div>
            <div data-reveal="right">
              <h2 className={titleClass}><TwoTone text={content.write.title} /></h2>
              <p className={`${bodyClass} mt-7`}>{content.write.description}</p>
              <BulletList items={content.write.bullets} />
            </div>
          </div>
        </div>
      </ArrivingSection>

      <ArrivingSection className="bg-[var(--color-mist)]" cut="slide" id="find">
        <div className={sectionClass}>
          <div className="grid grid-cols-[minmax(0,0.82fr)_minmax(28rem,1.18fr)] items-center gap-[clamp(2rem,4vw,4rem)] max-[980px]:grid-cols-1">
            <div data-reveal="left">
              <h2 className={titleClass}><TwoTone text={content.find.title} /></h2>
              <p className={`${bodyClass} mt-7`}>{content.find.description}</p>
              <BulletList items={content.find.bullets} />
            </div>
            <div data-arrive>
              <Screenshot image={content.find.image} sizes="(max-width: 980px) 100vw, 58vw" />
            </div>
          </div>
        </div>
      </ArrivingSection>

      <ArrivingSection className="bg-[var(--color-surface-dark)] text-white" cut="steps" id="keep">
        <div className={sectionClass}>
          <div data-reveal>
            <h2 className={darkTitleClass}><TwoTone text={content.keep.title} /></h2>
            <p className={darkBodyClass}>{content.keep.description}</p>
          </div>
          <div className="mt-[clamp(2.5rem,5vw,4rem)] grid grid-cols-4 gap-[clamp(1.5rem,3vw,2.5rem)] max-[1100px]:grid-cols-2 max-[620px]:grid-cols-1">
            {content.keep.items.map((item) => (
              <div className="border-t border-white/15 pt-4" data-reveal key={item.title}>
                <h3 className="m-0 text-[1.08rem] font-medium tracking-[-0.01em] text-white">{item.title}</h3>
                <p className="mb-0 mt-2 text-[0.88rem] leading-[1.6] text-white/58">{item.detail}</p>
              </div>
            ))}
          </div>
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
