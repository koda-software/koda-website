import Link from "next/link";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right.mjs";
import Image from "next/image";
import type { HomeContent } from "@/content/types";
import { NumberedPointGrid } from "@/components/landing/LandingCards";
import { ComparisonSlider } from "@/components/landing/ComparisonSlider";
import { IntegrationsCarousel } from "@/components/landing/IntegrationsCarousel";
import { PillarSections } from "@/components/landing/PillarSections";
import {
  FinalCtaPanel,
  LandingHero,
  LandingSection,
  landingShellClass,
  sectionDescriptionClass,
  sectionTitleClass,
  SectionIntro,
} from "@/components/landing/LandingPrimitives";
import { HexIndex, KodaSoftRing } from "@/components/landing/BrandMark";
import { HeroDashboardMock } from "@/components/landing/HeroDashboardMock";
import { Reveal } from "@/components/landing/Reveal";
import { SolutionScreenshotMock } from "@/components/landing/SolutionScreenshotMock";
import { WorkflowTimeline } from "@/components/landing/WorkflowTimeline";

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
        <div className="pointer-events-none absolute right-[-20.75rem] top-[calc(clamp(12.5rem,23vw,18rem)-170px)] z-0 w-[clamp(50rem,72vw,83rem)] opacity-95 max-[1200px]:left-[calc(clamp(23rem,44vw,36rem)-100px)] max-[1200px]:right-auto max-[1200px]:top-[calc(clamp(15rem,28vw,20rem)-170px)] max-[1200px]:w-[clamp(48rem,88vw,74rem)] max-[1200px]:opacity-40 max-[809px]:left-[calc(52vw-100px)] max-[809px]:top-[calc(19rem-170px)] max-[809px]:w-[min(54rem,124vw)] max-[809px]:opacity-24">
          <HeroDashboardMock className="h-auto w-full select-none" />
        </div>
      </LandingHero>

      <section
        className="relative overflow-hidden bg-[#f7fbff] [background-image:radial-gradient(circle_at_12%_14%,rgba(56,182,255,0.16),transparent_28%),radial-gradient(circle_at_88%_18%,rgba(126,231,255,0.15),transparent_26%),radial-gradient(circle_at_52%_92%,rgba(99,102,241,0.08),transparent_34%),linear-gradient(180deg,#fbfdff_0%,#f3f9fc_58%,#f8fbff_100%)]"
        id="problem"
      >
        <div className={`${landingShellClass} px-[var(--page-gutter)] py-[var(--section-y)]`}>
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
            <div className="mx-auto w-full max-w-[82rem] px-[clamp(0.75rem,2.5vw,2.25rem)]">
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
          </Reveal>
          <NumberedPointGrid points={content.problem.points} showSeparator={false} />
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--color-surface-dark)] [background-image:radial-gradient(circle_at_16%_22%,rgba(56,182,255,0.2),transparent_34%),linear-gradient(135deg,#0b1116_0%,#0d1e2e_48%,#164363_100%)] px-[var(--page-gutter)] pt-[clamp(3rem,6vw,5rem)] text-white">
        <div className={`${landingShellClass} grid items-end gap-[clamp(2rem,4vw,4.75rem)] grid-cols-[minmax(0,1.18fr)_minmax(22rem,0.74fr)] max-[1200px]:grid-cols-1`}>
          <Reveal className="max-[1200px]:order-2 max-[809px]:hidden" from="left">
            {/*
              The width used to be set explicitly (min(73vw, 65rem)), which at
              common desktop sizes came out wider than the column this sits in
              - so the screenshot ran under the copy beside it. Letting the
              width resolve from the column instead means the negative margin
              still carries it off the left edge of the window while its right
              edge stops exactly where the column does, and it cannot reach the
              text at any viewport. Once the section stacks, the screenshot is
              the closing row and bleeds to the section edges instead of sitting
              inside the text shell.
            */}
            <div className="relative ml-[calc(min(0px,(var(--shell-width)-100vw)/2)-var(--page-gutter)-clamp(1rem,2vw,2rem))] max-[1200px]:ml-[calc(var(--page-gutter)*-1)] max-[1200px]:w-[calc(100%+(var(--page-gutter)*2))]">
              <SolutionScreenshotMock className="relative left-[50px] h-auto w-full max-w-[64rem] select-none max-[1200px]:left-0 max-[1200px]:max-w-none max-[980px]:w-[112%] max-[980px]:origin-bottom-left" />
            </div>
          </Reveal>

          <div className="relative z-[1] pb-[var(--section-y)] max-[1200px]:order-1 max-[1200px]:pb-0 max-[809px]:pb-[var(--section-y)]">
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
        <PillarSections items={content.pillars.items} />
      </LandingSection>

      <section className="relative overflow-hidden bg-[var(--color-surface-dark)] [background:radial-gradient(circle_at_84%_16%,rgba(56,182,255,0.22),transparent_32%),radial-gradient(circle_at_14%_80%,rgba(20,112,184,0.2),transparent_36%),linear-gradient(145deg,#09131d_0%,#0d263f_52%,#081018_100%)] px-[var(--page-gutter)] py-[clamp(5rem,9vw,8rem)] text-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(126,231,255,0.42),rgba(56,182,255,0.38),transparent)]" aria-hidden="true" />
        <KodaSoftRing className="pointer-events-none absolute -right-28 top-10 h-[34rem] w-[34rem]" />

        <div className={`${landingShellClass} relative z-[1] grid items-start gap-[clamp(3rem,7vw,7rem)] grid-cols-[minmax(0,0.82fr)_minmax(26rem,1fr)] max-[980px]:grid-cols-1`}>
          <div className="sticky top-[clamp(6rem,14vh,9rem)] max-[980px]:static">
            <Reveal>
              <p className="mb-4 font-sans text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-blue-soft)]">
                {content.workflow.label}
              </p>
              <h2 className={`${sectionTitleClass} max-w-[720px] text-white`}>
                {content.workflow.title}
              </h2>
              <p className={`${sectionDescriptionClass} max-w-[620px] text-white/70`}>
                {content.workflow.description}
              </p>
              <Link
                className="mt-7 inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[image:var(--gradient-cta)] px-4 py-3 font-medium text-[var(--color-paper)] transition-[filter,transform] duration-150 hover:brightness-110"
                href={primaryHref}
              >
                {content.finalCta.primaryCta}
                <ArrowRightIcon className="h-4 w-4" strokeWidth={1.8} />
              </Link>
            </Reveal>
          </div>

          <WorkflowTimeline steps={content.workflow.steps} />
        </div>
      </section>

      <section className="relative overflow-hidden bg-white px-[var(--page-gutter)] py-[clamp(4.5rem,8vw,7rem)]">
        <div className={`${landingShellClass} relative z-[1]`}>
          <Reveal>
            <SectionIntro
              eyebrow={content.integrations.label}
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
            <IntegrationsCarousel fadeColor="#ffffff" items={content.integrations.items} />
          </Reveal>
        </div>
      </section>

      <LandingSection className="my-[clamp(3rem,6vw,5.5rem)] pt-0">
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
