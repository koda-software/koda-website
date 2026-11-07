import Link from "next/link";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right.mjs";
import Image from "next/image";
import type { ReactNode } from "react";
import type { HomeContent } from "@/content/types";
import { ArrivingSection } from "@/components/landing/ArrivingSection";
import { NumberedPointGrid } from "@/components/landing/LandingCards";
import { ComparisonSlider } from "@/components/landing/ComparisonSlider";
import { IntegrationsCarousel } from "@/components/landing/IntegrationsCarousel";
import { PillarSections } from "@/components/landing/PillarSections";
import {
  FinalCtaPanel,
  IndexNumber,
  LandingHero,
  LandingSection,
  landingShellClass,
  sectionDescriptionClass,
  sectionTitleClass,
  SectionIntro,
} from "@/components/landing/LandingPrimitives";
import { KodaSoftMarkAccent } from "@/components/landing/BrandMark";
import { HeroEdgeVisual } from "@/components/landing/HeroDashboardMock";
import { Reveal } from "@/components/landing/Reveal";
import { SolutionScreenshotMock } from "@/components/landing/SolutionScreenshotMock";
import { Magnifier } from "@/components/layout/features/processes/Magnifier";
import { WorkflowTimeline } from "@/components/landing/WorkflowTimeline";
import { TwoTone } from "@/components/landing/TwoTone";

type HomeScaffoldProps = {
  content: HomeContent;
  primaryHref: string;
  secondaryHref: string;
  /** Server-rendered latest-articles strip, injected so the scaffold stays synchronous. */
  recentArticles?: ReactNode;
};


export function HomeScaffold({
  content,
  primaryHref,
  secondaryHref,
  recentArticles,
}: HomeScaffoldProps) {
  return (
    <>
      <LandingHero
        title={content.hero.title}
        description={content.hero.description}
        primaryCta={content.hero.primaryCta}
        primaryHref={primaryHref}
        secondaryCta={content.hero.secondaryCta}
        secondaryHref={secondaryHref}
        visualMode="edge"
      >
        <HeroEdgeVisual centered />
      </LandingHero>

      <ArrivingSection className="bg-[var(--color-mist)]" cut="card" id="problem">
        <div className={`${landingShellClass} px-[var(--page-gutter)] py-[var(--section-y)]`}>
          <Reveal>
            <div className="mx-auto max-w-[900px] text-center">
              <h2 className={sectionTitleClass}><TwoTone text={content.problem.title} /></h2>
              <p className={`${sectionDescriptionClass} mx-auto max-w-[760px]`}>
                {content.problem.description}
              </p>
            </div>
          </Reveal>
          <Reveal className="mt-[clamp(2rem,4vw,3.2rem)]">
            <div className="mx-auto w-full max-w-[82rem] px-[clamp(0.75rem,2.5vw,2.25rem)]">
              <ComparisonSlider
                afterAlt={content.problem.comparison.afterAlt}
                afterLabel={content.problem.comparison.afterLabel}
                afterSrc="/hero/requests-board-comparison.webp"
                ariaLabel={content.problem.comparison.ariaLabel}
                beforeAlt={content.problem.comparison.beforeAlt}
                beforeLabel={content.problem.comparison.beforeLabel}
                beforeSrc="/hero/requests-tracker-comparison.webp"
                title={content.problem.comparison.title}
              />
            </div>
          </Reveal>
          <NumberedPointGrid points={content.problem.points} showSeparator={false} />
        </div>
      </ArrivingSection>

      <ArrivingSection className="bg-[var(--color-surface-dark)] [background-image:var(--gradient-hero)] px-[var(--page-gutter)] py-[clamp(4rem,7vw,6rem)] text-white" cut="wipe">
        <div data-sink="none" className={`${landingShellClass} grid items-center gap-[clamp(2.75rem,5vw,5.75rem)] grid-cols-[minmax(0,1fr)_minmax(28rem,0.92fr)] max-[1440px]:grid-cols-[minmax(0,0.82fr)_minmax(28rem,1fr)] max-[1200px]:grid-cols-1`}>
          <Reveal className="max-[1200px]:order-2 max-[809px]:hidden" from="left">
            {/*
              On wide screens the screenshot still bleeds out of the visual
              column. Once the section stacks, it becomes a smaller centered
              row so it does not dominate the copy above it.
            */}
            <div className="relative ml-[calc(min(0px,(var(--shell-width)-100vw)/2)-var(--page-gutter)-clamp(1rem,2vw,2rem))] max-[1440px]:max-w-[56rem] max-[1200px]:mx-auto max-[1200px]:ml-auto max-[1200px]:w-[min(100%,52rem)]">
              <SolutionScreenshotMock className="relative -left-[4.5rem] h-auto w-full max-w-[64rem] select-none max-[1440px]:max-w-none max-[1200px]:left-0 max-[980px]:origin-bottom-left">
                <Magnifier image={{ alt: "", height: 840, src: "/hero/rule-editor-magnifier.webp", width: 840 }} placement={{ left: "74%", size: "40%", top: "46%" }} />
              </SolutionScreenshotMock>
            </div>
          </Reveal>

          <div className="relative z-[1] max-[1200px]:order-1">
            <Reveal>
              <Image
                data-arrive
                alt="Opero"
                className="mb-5 h-16 w-auto"
                height={224}
                src="/branding/opero-logo-white.svg"
                width={739}
              />
              <h2 data-arrive className={`${sectionTitleClass} text-white`}><TwoTone text={content.solution.title} /></h2>
              <p data-arrive className={`${sectionDescriptionClass} max-w-[38rem] text-white/82`}>
                {content.solution.description}
              </p>
            </Reveal>

            <div className="mt-[clamp(1.8rem,3vw,2.5rem)] grid gap-5">
              {content.solution.points.map((point, index) => (
                <Reveal delay={index * 90} key={point}>
                  <article className="grid grid-cols-[auto_1fr] items-center gap-4">
                    <IndexNumber index={index} invert />
                    <p className="m-0 self-center text-[clamp(1rem,1.18vw,1.08rem)] font-display font-light leading-[1.56] text-white/86">
                      {point}
                    </p>
                  </article>
                </Reveal>
              ))}
              <Reveal delay={content.solution.points.length * 90}>
                <Link
                  className="action action-mist mt-2 w-fit"
                  href={secondaryHref}
                >
                  {content.solution.cta}
                  <ArrowRightIcon className="h-4 w-4" strokeWidth={1.8} />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </ArrivingSection>

      <ArrivingSection cut="curtain">
        <LandingSection>
          <Reveal>
            <SectionIntro
              align="center"
              title={content.pillars.title}
              description={content.pillars.description}
            />
          </Reveal>
          <PillarSections items={content.pillars.items} />
        </LandingSection>
      </ArrivingSection>

      <ArrivingSection className="bg-[var(--color-surface-dark)] [background-image:var(--gradient-hero)] px-[var(--page-gutter)] py-[clamp(5rem,9vw,8rem)] text-white" cut="steps">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(56,182,255,0.42),rgba(56,182,255,0.38),transparent)]" aria-hidden="true" />
        <KodaSoftMarkAccent className="pointer-events-none absolute -right-28 top-10 h-[34rem] w-[34rem]" />

        <div className={`${landingShellClass} relative z-[1] grid items-start gap-[clamp(3rem,7vw,7rem)] grid-cols-[minmax(0,0.82fr)_minmax(26rem,1fr)] max-[980px]:grid-cols-1`}>
          <div className="sticky top-[clamp(6rem,14vh,9rem)] max-[980px]:static">
            <Reveal>
              <h2 className={`${sectionTitleClass} max-w-[720px] text-white`}><TwoTone text={content.workflow.title} /></h2>
              <p className={`${sectionDescriptionClass} max-w-[620px] text-white/70`}>
                {content.workflow.description}
              </p>
              <Link
                className="action action-mist mt-7 w-fit"
                href={primaryHref}
              >
                {content.finalCta.primaryCta}
                <ArrowRightIcon className="h-4 w-4" strokeWidth={1.8} />
              </Link>
            </Reveal>
          </div>

          <WorkflowTimeline steps={content.workflow.steps} />
        </div>
      </ArrivingSection>

      <ArrivingSection className="px-[var(--page-gutter)] py-[clamp(4.5rem,8vw,7rem)]" cut="slide">
        <div className={`${landingShellClass} relative z-[1]`}>
          <Reveal>
            <SectionIntro
              title={content.integrations.title}
              description={content.integrations.description}
              split
              action={(
                <Link
                  className="group inline-flex items-center gap-2 text-[1.08rem] font-semibold text-[var(--color-blue)] transition-colors duration-150 hover:text-[var(--color-blue-deep)]"
                  href={content.integrations.link.href}
                >
                  <span className="border-b border-[rgba(56,182,255,0.34)] pb-0.5 transition-colors duration-150 group-hover:border-[rgba(20,112,184,0.55)]">
                    {content.integrations.link.label}
                  </span>
                  <ArrowRightIcon
                    className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                    strokeWidth={1.8}
                  />
                </Link>
              )}
            />
          </Reveal>
          <Reveal className="mt-[clamp(2rem,4vw,3.25rem)]">
            <div data-arrive>
              <IntegrationsCarousel fadeColor="var(--color-mist)" items={content.integrations.items} />
            </div>
          </Reveal>
        </div>
      </ArrivingSection>

      {recentArticles}

      <ArrivingSection cut="open">
        <LandingSection className="my-[clamp(3rem,6vw,5.5rem)] pt-0">
          <Reveal>
            <div data-arrive>
              <FinalCtaPanel
                title={content.finalCta.title}
                description={content.finalCta.description}
                primaryCta={content.finalCta.primaryCta}
                primaryHref={primaryHref}
                secondaryCta={content.finalCta.secondaryCta}
                secondaryHref={secondaryHref}
              />
            </div>
          </Reveal>
        </LandingSection>
      </ArrivingSection>
    </>
  );
}
