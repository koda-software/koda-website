import Link from "next/link";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right.mjs";
import Image from "next/image";
import type { HomeContent } from "@/content/types";
import {
  DarkStepGrid,
  IconTextGrid,
  NumberedPointGrid,
  PillarGrid,
} from "@/components/landing/LandingCards";
import {
  DarkPanel,
  FinalCtaPanel,
  LandingHero,
  LandingSection,
  SectionIntro,
  landingShellClass,
  sectionDescriptionClass,
  sectionTitleClass,
} from "@/components/landing/LandingPrimitives";
import { HexIndex } from "@/components/landing/BrandMark";
import { LazyHeroVideo } from "@/components/landing/LazyHeroVideo";
import { Reveal } from "@/components/landing/Reveal";
import { HomeAiDemo } from "./demos/HomeAiDemo";

type HomeScaffoldProps = {
  content: HomeContent;
  primaryHref: string;
  secondaryHref: string;
};


export function HomeScaffold({
  content,
  primaryHref,
  secondaryHref,
}: HomeScaffoldProps) {
  return (
    <>
      <LandingHero
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        description={content.hero.description}
        primaryCta={content.hero.primaryCta}
        primaryHref={primaryHref}
        secondaryCta={content.hero.secondaryCta}
        photo="team"
        secondaryHref={secondaryHref}
        visualMode="edge"
      >
        <div className="pointer-events-none absolute bottom-0 right-[100px] z-0 w-[clamp(48rem,72vw,84rem)] translate-x-[31%] translate-y-[22%] rotate-[-3deg] opacity-95 max-[1200px]:opacity-55 max-[809px]:right-[100px] max-[809px]:w-[min(56rem,122vw)] max-[809px]:translate-x-[30%] max-[809px]:translate-y-[28%] max-[809px]:opacity-40">
          <LazyHeroVideo
            ariaLabel="Opero executive dashboard in the product interface"
            className="h-auto w-full select-none"
            feather="top-left"
            height={1080}
            poster="/hero/opero-dashboard-hero-poster.webp"
            src="/hero/opero-dashboard-hero.webm"
            width={1440}
          />
        </div>
      </LandingHero>

      <LandingSection id="problem">
        {/*
          The recording runs off the left edge of the window and takes three
          quarters of it, because what it shows - a workflow being assembled -
          only reads at that size. The copy takes the remaining quarter beside
          it, which is a narrow measure, so the heading steps down a size here
          rather than using the full section scale and breaking into slivers.
          It escapes the shell with a negative left margin only - the same
          technique the Opero section below uses - rather than the usual
          `w-screen` full-bleed. `100vw` counts the scrollbar that `100%` does
          not, so a centred full-bleed block ends up a scrollbar wider than the
          page and puts a few pixels of horizontal scroll on every page that
          carries it. Overshooting to the left has no such effect: browsers do
          not open a scroll area on the leading side. The right edge just stops
          at the section's own padding, so the copy keeps the page gutter.
          Below 980px the two stack and the video spans the full width.
        */}
        <div className="relative ml-[calc(min(0px,(var(--shell-width)-100vw)/2)-var(--page-gutter))] grid items-center gap-[clamp(1.5rem,3vw,3rem)] grid-cols-[minmax(0,3.35fr)_minmax(15rem,1fr)] max-[980px]:ml-0 max-[980px]:grid-cols-1">
          <Reveal from="left">
            {/*
              This recording was composed on a black field from end to end. The
              interface hides it through the middle of the loop, so the black
              only surfaced during the transitions - which read as the section
              blinking. Feathering could not reach it, because the black was the
              clip's own background rather than a margin around it, so it was
              keyed out of the file and composited onto white instead. The clip
              now sits on the page's own colour at every frame; the shadow and
              the rounded right corner are what still give it an edge.
            */}
            <div className="overflow-hidden rounded-r-[var(--radius-panel)] bg-white shadow-[0_24px_60px_-28px_rgba(11,17,22,0.32)] max-[980px]:rounded-[var(--radius-panel)]">
              <LazyHeroVideo
                ariaLabel="Opero onboarding workflow in the product interface"
                className="aspect-video h-full w-full object-cover"
                height={1080}
                loop
                poster="/hero/opero-problem-workflow-poster.webp"
                src="/hero/opero-problem-workflow.webm"
                width={1830}
              />
            </div>
          </Reveal>
          <Reveal>
            <div>
              <p className="mb-4 font-sans text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-blue)]">
                {content.problem.label}
              </p>
              <h2 className="m-0 text-[clamp(1.5rem,1.95vw,1.95rem)] leading-[1.14] tracking-[-0.03em]">
                {content.problem.title}
              </h2>
              <p className={sectionDescriptionClass}>{content.problem.description}</p>
            </div>
          </Reveal>
        </div>
        <NumberedPointGrid points={content.problem.points} />
      </LandingSection>

      <section className="relative overflow-hidden bg-[var(--color-surface-dark)] [background-image:radial-gradient(circle_at_16%_22%,rgba(56,182,255,0.2),transparent_34%),linear-gradient(135deg,#0b1116_0%,#0d1e2e_48%,#164363_100%)] px-[var(--page-gutter)] pt-[clamp(3rem,6vw,5rem)] text-white">
        <div className={`${landingShellClass} grid items-end gap-[clamp(2.2rem,5vw,5.5rem)] grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.78fr)] max-[980px]:grid-cols-1`}>
          <Reveal from="left">
            {/*
              The width used to be set explicitly (min(73vw, 65rem)), which at
              common desktop sizes came out wider than the column this sits in
              - so the screenshot ran under the copy beside it. Letting the
              width resolve from the column instead means the negative margin
              still carries it off the left edge of the window while its right
              edge stops exactly where the column does, and it cannot reach the
              text at any viewport.
            */}
            <div className="relative ml-[calc(min(0px,(var(--shell-width)-100vw)/2)-var(--page-gutter)-clamp(1rem,2vw,2rem))] max-[980px]:ml-0">
              <div className="pointer-events-none absolute -inset-8 rounded-full bg-[rgba(56,182,255,0.08)] blur-3xl" aria-hidden="true" />
              <LazyHeroVideo
                ariaLabel="Opero product screenshot"
                className="relative h-auto w-full select-none"
                feather="all"
                height={1080}
                poster="/hero/opero-solution-screenshot-poster.webp"
                src="/hero/opero-solution-screenshot.webm"
                width={1440}
              />
            </div>
          </Reveal>

          <div className="relative z-[1] pb-[var(--section-y)]">
            <Reveal>
              <Image
                alt="Opero"
                className="mb-5 h-16 w-auto"
                height={153}
                src="/branding/opero-logo-white.svg"
                width={490}
              />
              <h2 className={`${sectionTitleClass} text-white`}>{content.solution.title}</h2>
              <p className={`${sectionDescriptionClass} max-w-[34rem] text-white/82`}>
                {content.solution.description}
              </p>
            </Reveal>

            <div className="mt-[clamp(1.8rem,3vw,2.5rem)] grid gap-5">
              {content.solution.points.map((point, index) => (
                <Reveal delay={index * 90} key={point}>
                  <article className="grid grid-cols-[auto_1fr] items-center gap-4">
                    <HexIndex index={index} invert />
                    <p className="m-0 self-center text-[clamp(1rem,1.18vw,1.08rem)] font-light leading-[1.56] text-white/86">
                      {point}
                    </p>
                  </article>
                </Reveal>
              ))}
              <Reveal delay={content.solution.points.length * 90}>
                <Link
                  className="mt-2 inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[image:var(--gradient-cta)] px-4 py-3 font-medium text-[var(--color-paper)] transition-[filter,transform] duration-150 hover:brightness-110"
                  href={secondaryHref}
                >
                  {content.solution.cta}
                  <ArrowRightIcon className="h-4 w-4" strokeWidth={1.8} />
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <LandingSection>
        <Reveal>
          <SectionIntro
            eyebrow={content.pillars.label}
            title={content.pillars.title}
            description={content.pillars.description}
          />
        </Reveal>
        <PillarGrid items={content.pillars.items} />
      </LandingSection>

      <LandingSection>
        <DarkPanel>
          <Reveal>
            <SectionIntro
              eyebrow={content.workflow.label}
              title={content.workflow.title}
              description={content.workflow.description}
              invert
              split
            />
          </Reveal>
          <DarkStepGrid steps={content.workflow.steps} />
        </DarkPanel>
      </LandingSection>

      <LandingSection className="grid items-start gap-[clamp(1.5rem,4vw,4rem)] grid-cols-[minmax(0,0.78fr)_minmax(20rem,1fr)] max-[809px]:grid-cols-1">
        <div>
          <Reveal>
            <SectionIntro
              eyebrow={content.ai.label}
              title={content.ai.title}
              description={content.ai.description}
            />
          </Reveal>
        </div>
        <div className="relative" aria-label={content.ai.label}>
          <Reveal from="right">
            <HomeAiDemo chat={content.ai.chat} />
          </Reveal>
        </div>
      </LandingSection>

      <LandingSection>
        <Reveal>
          <SectionIntro
            eyebrow={content.useCases.label}
            title={content.useCases.title}
            description={content.useCases.description}
          />
        </Reveal>
        <IconTextGrid items={content.useCases.items} />
      </LandingSection>

      <LandingSection className="pt-0">
        <Reveal>
          <FinalCtaPanel
            eyebrow={content.finalCta.eyebrow}
            title={content.finalCta.title}
            description={content.finalCta.description}
            primaryCta={content.finalCta.primaryCta}
            primaryHref={primaryHref}
            secondaryCta={content.finalCta.secondaryCta}
            secondaryHref={secondaryHref}
          />
        </Reveal>
      </LandingSection>
    </>
  );
}
