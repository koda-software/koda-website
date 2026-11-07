import Image from "next/image";
import { ArrivingSection } from "@/components/landing/ArrivingSection";
import { BrowserFrame } from "@/components/landing/BrowserFrame";
import { HeroEdgeVisual } from "@/components/landing/HeroDashboardMock";
import { LandingHero } from "@/components/landing/LandingPrimitives";
import { TwoTone } from "@/components/landing/TwoTone";
import { ProcessesDemo } from "@/components/layout/demos/ProcessesDemo";
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
import type { ProcessesDeadlineMoment, ProcessesPageContent, ProcessesPageImage, ProcessesProofRow } from "@/content/feature-stories/processes.types";
import type { Locale } from "@/lib/i18n/config";
import { DepartmentExplorer } from "./processes/DepartmentExplorer";
import { DepartmentsScroll } from "./processes/DepartmentsScroll";
import { Magnifier } from "./processes/Magnifier";

type ProcessesFeaturePageProps = {
  content: ProcessesPageContent;
  locale: Locale;
  primaryHref: string;
  secondaryHref: string;
};

const darkTitleClass = "m-0 max-w-[940px] text-[clamp(2.15rem,4.4vw,3.9rem)] leading-[1.02] tracking-[-0.04em] text-white";
const darkBodyClass = "m-0 max-w-[46rem] text-[1.04rem] leading-[1.72] text-white/62";

function BrowserScreenshot({ image }: { image: ProcessesPageImage }) {
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

/** A claim with the real screen beside it. `reverse` puts the screen first, so that the rows do not march down one side. */
function ProofRow({ reverse = false, row }: { reverse?: boolean; row: ProcessesProofRow }) {
  return (
    <ArrivingSection className="border-t border-[rgba(11,17,22,0.09)]" cut="slide">
      <div className={sectionClass}>
        <div className="grid grid-cols-[minmax(0,0.82fr)_minmax(28rem,1.18fr)] items-center gap-[clamp(2rem,4vw,4rem)] max-[980px]:grid-cols-1">
          <div className={reverse ? "min-[981px]:order-2" : ""} data-reveal={reverse ? "right" : "left"}>
            <h2 className={titleClass}><TwoTone text={row.title} /></h2>
            <p className={`${bodyClass} mt-7`}>{row.description}</p>
            <BulletList items={row.bullets} />
          </div>
          <div className={`min-w-0 ${reverse ? "min-[981px]:order-1" : ""}`} data-arrive={reverse ? "left" : "right"}>
            <div className="relative">
              <BrowserScreenshot image={row.image} />
              {row.magnifier ? <Magnifier image={row.magnifier} placement={{ top: "46%", left: "72%", size: "50%" }} /> : null}
            </div>
          </div>
        </div>
      </div>
    </ArrivingSection>
  );
}

/** One purchase request, stage by stage: what the people did in one column, what Opero did in the next. */
function ProcessStory({ story }: { story: ProcessesPageContent["story"] }) {
  return (
    <ol className="relative m-0 list-none p-0 before:absolute before:bottom-8 before:left-[7px] before:top-8 before:w-px before:bg-white/15">
      {story.steps.map((step, index) => (
        <li className="relative grid grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-[clamp(1.5rem,3vw,3rem)] gap-y-4 border-t border-white/[0.09] py-[clamp(1.5rem,2.6vw,2.25rem)] pl-9 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1" data-reveal key={step.stage}>
          <span aria-hidden="true" className={`absolute left-0 top-[calc(clamp(1.5rem,2.6vw,2.25rem)+0.1rem)] z-[1] h-[15px] w-[15px] rounded-full ${index === story.steps.length - 1 ? "bg-[#38b6ff]" : "border-[1.5px] border-[#38b6ff] bg-[var(--color-surface-dark)]"}`} />
          <div className="max-[980px]:col-span-2 max-[640px]:col-span-1">
            <p className="m-0 font-mono text-[0.72rem] uppercase tracking-[0.08em] text-[var(--color-blue-soft)]">{step.stage}</p>
            <h3 className="mb-0 mt-2 text-[clamp(1.25rem,2vw,1.6rem)] font-medium leading-[1.2] tracking-[-0.02em] text-white">{step.title}</h3>
          </div>
          <div>
            <p className="m-0 text-[0.72rem] font-medium text-white/45">{story.peopleLabel}</p>
            <p className="mb-0 mt-1.5 text-[0.93rem] leading-[1.6] text-white/70">{step.people}</p>
          </div>
          <div>
            <p className="m-0 text-[0.72rem] font-medium text-white/45">{story.operoLabel}</p>
            <p className="mb-0 mt-1.5 text-[0.93rem] leading-[1.6] text-white/70">{step.opero}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

const MOMENT_DOT: Record<ProcessesDeadlineMoment["tone"], string> = {
  calm: "border-[1.5px] border-[#38b6ff] bg-[var(--color-surface-dark)]",
  due: "bg-[#38b6ff]",
  late: "bg-[#f0b64a]",
};

/** A task's due date on a line, with what can happen on either side of it. Illustrates what a rule can be set to do. */
function DeadlineLine({ moments }: { moments: ProcessesPageContent["deadlines"]["moments"] }) {
  return (
    <ol className="relative m-0 grid list-none grid-cols-4 gap-6 p-0 before:absolute before:left-0 before:right-0 before:top-[7px] before:h-px before:bg-white/15 max-[980px]:grid-cols-1 max-[980px]:gap-7 max-[980px]:before:bottom-2 max-[980px]:before:left-[7px] max-[980px]:before:right-auto max-[980px]:before:top-2 max-[980px]:before:h-auto max-[980px]:before:w-px">
      {moments.map((moment) => (
        <li className="relative pt-8 max-[980px]:pl-9 max-[980px]:pt-0" data-reveal key={moment.when}>
          <span aria-hidden="true" className={`absolute left-0 top-0 z-[1] h-[15px] w-[15px] rounded-full ${MOMENT_DOT[moment.tone]}`} />
          <p className={`m-0 font-mono text-[0.76rem] ${moment.tone === "late" ? "text-[#f6c96b]" : "text-[var(--color-blue-soft)]"}`}>{moment.when}</p>
          <h3 className="mb-0 mt-2 text-[1.12rem] font-medium leading-[1.25] tracking-[-0.01em] text-white">{moment.title}</h3>
          <p className="mb-0 mt-2 text-[0.9rem] leading-[1.6] text-white/62">{moment.detail}</p>
        </li>
      ))}
    </ol>
  );
}

export function ProcessesFeaturePage({ content, locale, primaryHref, secondaryHref }: ProcessesFeaturePageProps) {
  const { departments } = content;

  return (
    <>
      <LandingHero description={content.hero.description} primaryCta={content.hero.primaryCta} primaryHref={primaryHref} secondaryCta={content.hero.secondaryCta} secondaryHref={secondaryHref} title={content.hero.title} visualMode="edge">
        <HeroEdgeVisual image={content.hero.image} large>
          <Magnifier hideOnNarrow image={content.hero.magnifier} />
        </HeroEdgeVisual>
      </LandingHero>

      <ArrivingSection className="bg-[var(--color-mist)]" cut="card" id="problem">
        <div className={sectionClass}>
          <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(18rem,0.5fr)] items-end gap-12 max-[900px]:grid-cols-1 max-[900px]:gap-7">
            <h2 className={titleClass} data-reveal><TwoTone text={content.problem.title} /></h2>
            <p className="m-0 text-[1rem] leading-[1.68] text-[var(--color-muted)]" data-reveal>{content.problem.description}</p>
          </div>
          <div className="mt-[clamp(2.5rem,5vw,4rem)]">
            <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-8 pb-4 max-[760px]:hidden">
              <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-[var(--color-muted)]">{content.problem.askedLabel}</p>
              <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-[#1e5278]">{content.problem.answerLabel}</p>
            </div>
            <ul className="m-0 list-none border-t border-[rgba(11,17,22,0.12)] p-0">
              {content.problem.rows.map((row) => (
                <li className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] items-baseline gap-8 border-b border-[rgba(11,17,22,0.12)] py-[clamp(1.1rem,2vw,1.6rem)] max-[760px]:grid-cols-1 max-[760px]:gap-2" data-reveal key={row.asked}>
                  <p className="m-0 text-[clamp(1.2rem,2.1vw,1.7rem)] font-medium leading-[1.2] tracking-[-0.025em] text-[var(--color-ink)]">{row.asked}</p>
                  <p className="m-0 text-[0.98rem] leading-[1.6] text-[var(--color-ink-soft)]">{row.answer}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ArrivingSection>

      <ArrivingSection className="bg-[var(--color-surface-dark)] [background-image:var(--gradient-hero)] text-white" cut="steps" id="example">
        <div className={sectionClass}>
          <div data-reveal>
            <p className="m-0 text-[0.72rem] font-semibold uppercase tracking-[0.09em] text-[var(--color-blue-soft)]">{content.story.exampleLabel}</p>
            <h2 className={`${darkTitleClass} mt-4`}><TwoTone text={content.story.title} /></h2>
            <p className={`${darkBodyClass} mt-7`}>{content.story.description}</p>
          </div>
          <div className="mt-[clamp(2.5rem,5vw,4rem)]">
            <ProcessStory story={content.story} />
          </div>
        </div>
      </ArrivingSection>

      {/* The curtain paints its own ground, so the mist goes on a layer inside it. */}
      <ArrivingSection cut="curtain" id="board">
        <div className="bg-[var(--color-mist)]">
          <div className={`${shellClass} py-[clamp(5rem,9vw,8rem)]`}>
            <div className="text-center" data-reveal>
              <h2 className={`${titleClass} mx-auto`} data-arrive><TwoTone text={content.board.title} /></h2>
              <p className={`${bodyClass} mx-auto mt-6`} data-arrive>{content.board.description}</p>
            </div>
            <div className="mx-auto mt-[clamp(2.5rem,5vw,4rem)] max-w-[75rem]" data-arrive>
              <ProcessesDemo tone="light" content={content.board.demo} />
            </div>
          </div>
        </div>
      </ArrivingSection>

      <ArrivingSection className="isolate border-y border-white/8 bg-[var(--color-surface-dark)] [background-image:var(--gradient-hero)] text-white" cut="wipe" id="departments">
        <div className={sectionClass}>
          <DepartmentsScroll>
            <div className="text-center" data-reveal>
              <h2 className={`${darkTitleClass} mx-auto`} data-arrive><TwoTone text={departments.title} /></h2>
              <p className={`${darkBodyClass} mx-auto mt-6`} data-arrive>{departments.description}</p>
            </div>
            <div className="mt-[clamp(2rem,4vw,3rem)]" data-arrive="slide">
              <DepartmentExplorer scenarios={departments.scenarios} tablistLabel={departments.tablistLabel} />
            </div>
          </DepartmentsScroll>
        </div>
      </ArrivingSection>

      <ProofRow row={content.ownership} />
      <ProofRow reverse row={content.approvals} />

      <ArrivingSection className="isolate border-y border-white/8 bg-[var(--color-surface-dark)] [background-image:var(--gradient-hero)] text-white" cut="wipe" id="deadlines">
        <div className={sectionClass}>
          <div data-reveal>
            <h2 className={darkTitleClass} data-arrive><TwoTone text={content.deadlines.title} /></h2>
            <p className={`${darkBodyClass} mt-7`} data-arrive>{content.deadlines.description}</p>
          </div>
          <div className="mt-[clamp(3rem,6vw,5rem)]">
            <DeadlineLine moments={content.deadlines.moments} />
          </div>
          <p className="mb-0 mt-[clamp(2.5rem,4vw,3.5rem)] max-w-[52rem] border-l-2 border-[rgba(56,182,255,0.45)] pl-4 text-[0.92rem] leading-[1.6] text-white/62" data-reveal>{content.deadlines.note}</p>
        </div>
      </ArrivingSection>

      <ArrivingSection cut="curtain">
        <div className={sectionClass}>
          <div className="grid grid-cols-[minmax(0,0.82fr)_minmax(28rem,1.18fr)] items-center gap-[clamp(2rem,4vw,4rem)] max-[980px]:grid-cols-1">
            <div data-reveal="left">
              <h2 className={titleClass}><TwoTone text={content.visibility.title} /></h2>
              <p className={`${bodyClass} mt-7`}>{content.visibility.description}</p>
              <BulletList items={content.visibility.bullets} />
            </div>
            <div className="min-w-0" data-arrive>
              <BrowserScreenshot image={content.visibility.image} />
            </div>
          </div>
        </div>
      </ArrivingSection>

      <ProofRow reverse row={content.history} />

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
