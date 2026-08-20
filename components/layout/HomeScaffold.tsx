import Link from "next/link";
import BoxesIcon from "lucide-react/dist/esm/icons/boxes.mjs";
import BrainCircuitIcon from "lucide-react/dist/esm/icons/brain-circuit.mjs";
import ClipboardCheckIcon from "lucide-react/dist/esm/icons/clipboard-check.mjs";
import DatabaseIcon from "lucide-react/dist/esm/icons/database.mjs";
import HandshakeIcon from "lucide-react/dist/esm/icons/handshake.mjs";
import LayersIcon from "lucide-react/dist/esm/icons/layers.mjs";
import MapIcon from "lucide-react/dist/esm/icons/map.mjs";
import RefreshCwIcon from "lucide-react/dist/esm/icons/refresh-cw.mjs";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right.mjs";
import SearchIcon from "lucide-react/dist/esm/icons/search.mjs";
import ShieldCheckIcon from "lucide-react/dist/esm/icons/shield-check.mjs";
import WorkflowIcon from "lucide-react/dist/esm/icons/workflow.mjs";
import ZapIcon from "lucide-react/dist/esm/icons/zap.mjs";
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
import { LazyHeroVideo } from "@/components/landing/LazyHeroVideo";
import { Reveal } from "@/components/landing/Reveal";
import { HomeAiDemo } from "./demos/HomeAiDemo";

type HomeScaffoldProps = {
  content: HomeContent;
  primaryHref: string;
  secondaryHref: string;
};

const pillarIcons = [
  BoxesIcon,
  WorkflowIcon,
  BrainCircuitIcon,
  ShieldCheckIcon,
];
const workflowIcons = [
  MapIcon,
  LayersIcon,
  ZapIcon,
  ShieldCheckIcon,
  RefreshCwIcon,
];
const useCaseIcons = [
  HandshakeIcon,
  DatabaseIcon,
  ClipboardCheckIcon,
  SearchIcon,
];
const solutionIcons = [DatabaseIcon, ClipboardCheckIcon, ZapIcon];

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
        secondaryHref={secondaryHref}
        visualMode="edge"
      >
        <div className="pointer-events-none absolute bottom-0 right-[100px] z-0 w-[clamp(48rem,72vw,84rem)] translate-x-[31%] translate-y-[22%] rotate-[-3deg] opacity-95 max-[1200px]:opacity-55 max-[809px]:right-[100px] max-[809px]:w-[min(56rem,122vw)] max-[809px]:translate-x-[30%] max-[809px]:translate-y-[28%] max-[809px]:opacity-40">
          <LazyHeroVideo
            ariaLabel="Opero executive dashboard in the product interface"
            className="h-auto w-full select-none"
            height={1080}
            src="/hero/opero-dashboard-hero.webm"
            width={1440}
          />
        </div>
      </LandingHero>

      <LandingSection id="problem">
        <Reveal>
          <div className="mx-auto max-w-[900px] text-center">
            <p className="mb-4 font-sans text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-blue)]">
              {content.problem.label}
            </p>
            <h2 className={sectionTitleClass}>{content.problem.title}</h2>
            <p className={`${sectionDescriptionClass} mx-auto max-w-[760px]`}>
              {content.problem.description}
            </p>
          </div>
        </Reveal>
        <Reveal className="mt-[clamp(2rem,4vw,3.2rem)]">
          <div className="relative left-1/2 w-[66vw] -translate-x-1/2 overflow-hidden bg-white max-[809px]:w-[86vw]">
            <LazyHeroVideo
              ariaLabel="Opero onboarding workflow in the product interface"
              className="aspect-video h-full w-full object-cover"
              height={1080}
              loop
              src="/hero/opero-problem-workflow.webm"
              width={1920}
            />
          </div>
        </Reveal>
        <NumberedPointGrid points={content.problem.points} />
      </LandingSection>

      <section className="relative overflow-hidden bg-[#000407] [background-image:radial-gradient(circle_at_16%_22%,rgba(56,182,255,0.2),transparent_34%),linear-gradient(135deg,#000407_0%,#061322_48%,#123a5b_100%)] px-[var(--page-gutter)] pt-[clamp(3rem,6vw,5rem)] text-white">
        <div className={`${landingShellClass} grid items-end gap-[clamp(2.2rem,5vw,5.5rem)] grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.78fr)] max-[980px]:grid-cols-1`}>
          <Reveal from="left">
            <div className="relative ml-[calc((var(--shell-width)-100vw)/2-var(--page-gutter)-clamp(1rem,2vw,2rem))] w-[min(73vw,65rem)] max-[980px]:ml-0 max-[980px]:w-full">
              <div className="pointer-events-none absolute -inset-8 rounded-full bg-[rgba(56,182,255,0.08)] blur-3xl" aria-hidden="true" />
              <LazyHeroVideo
                ariaLabel="Opero product screenshot"
                className="relative h-auto w-full select-none drop-shadow-[0_32px_90px_rgba(0,0,0,0.42)]"
                height={1080}
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
              {content.solution.points.map((point, index) => {
                const PointIcon = solutionIcons[index] ?? ShieldCheckIcon;

                return (
                  <Reveal delay={index * 90} key={point}>
                    <article className="group grid grid-cols-[auto_1fr] gap-4">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-white/[0.07] text-[var(--color-cyan)] transition-colors duration-200 group-hover:bg-white/[0.1] group-hover:text-white">
                        <PointIcon className="h-5 w-5" strokeWidth={1.65} />
                      </span>
                      <p className="m-0 self-center text-[clamp(1rem,1.18vw,1.08rem)] font-light leading-[1.56] text-white/86 transition-colors duration-200 group-hover:text-white">
                        {point}
                      </p>
                    </article>
                  </Reveal>
                );
              })}
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
        <PillarGrid icons={pillarIcons} items={content.pillars.items} />
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
          <DarkStepGrid icons={workflowIcons} steps={content.workflow.steps} />
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
        <IconTextGrid icons={useCaseIcons} items={content.useCases.items} />
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
