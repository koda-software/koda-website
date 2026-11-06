import Link from "next/link";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right.mjs";
import CircleCheckIcon from "lucide-react/dist/esm/icons/circle-check.mjs";
import { PageHero } from "@/components/landing/LandingPrimitives";
import { AiAskDemo } from "@/components/layout/demos/AiAskDemo";
import { AiBuildStory } from "@/components/layout/demos/AiBuildStory";
import { AiCompareDemo } from "@/components/layout/demos/AiCompareDemo";
import { AiConfigureDemo } from "@/components/layout/demos/AiConfigureDemo";
import { AiConnectDemo } from "@/components/layout/demos/AiConnectDemo";
import { AiHeroDemo } from "@/components/layout/demos/AiHeroDemo";
import {
  FeatureFaqSection,
  FeatureFinalCtaSection,
  FeatureRelatedSection,
  bodyClass,
  sectionClass,
  shellClass,
  titleClass,
} from "@/components/layout/FeaturePageSections";
import type { AiAskAct, AiConfigureAct, AiPageContent } from "@/content/types";
import type { Locale } from "@/lib/i18n/config";
import { localizeFeaturePath } from "@/lib/i18n/features";
import { TwoTone } from "@/components/landing/TwoTone";

type AiFeaturePageProps = {
  content: AiPageContent;
  locale: Locale;
  primaryHref: string;
};

/** The act whose animation is the section: the text sits in it, and what floats runs on around the text to the sides of the page. */
function AskActSection({ act }: { act: AiAskAct }) {
  return (
    <section className="overflow-hidden py-[clamp(4.5rem,7vw,6.5rem)]" id={`act-${act.number}`}>
      <div className={`${shellClass} relative z-[1] text-center`} data-reveal>
        <h2 className={`${titleClass} mx-auto min-[981px]:max-w-[min(58rem,60vw)]`}><TwoTone text={act.title} /></h2>
        <p className={`${bodyClass} mx-auto mt-5 min-[981px]:max-w-[min(46rem,60vw)]`}>{act.description}</p>
      </div>
      <div className="mt-[clamp(1.5rem,3vw,2.25rem)]">
        <AiAskDemo demo={act.demo} />
      </div>
    </section>
  );
}

/** The act whose animation takes up the section under its heading: a request, Opero MCP and the form it changes. */
function ConfigureActSection({ act }: { act: AiConfigureAct }) {
  return (
    <section className="overflow-hidden py-[clamp(5.5rem,9vw,8rem)]" id={`act-${act.number}`}>
      <div className={`${shellClass} grid grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] items-end gap-x-[clamp(2rem,5vw,5rem)] gap-y-6 max-[980px]:grid-cols-1`} data-reveal>
        <h2 className={titleClass}><TwoTone text={act.title} /></h2>
        <p className={bodyClass}>{act.description}</p>
      </div>
      <div className={`${shellClass} mt-[clamp(3rem,5vw,4.5rem)]`}>
        <AiConfigureDemo demo={act.configure} />
      </div>
    </section>
  );
}

export function AiFeaturePage({ content, locale, primaryHref }: AiFeaturePageProps) {
  return (
    <>
      <PageHero description={content.hero.description} descriptionClassName="max-w-[700px]" primaryCta={content.hero.primaryCta} primaryHref={primaryHref} sectionClassName="items-end pb-0 max-[980px]:pb-0 min-[981px]:pb-0" shellClassName="gap-[clamp(2rem,4vw,4rem)] min-[981px]:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]" title={content.hero.title} titleClassName="max-w-[840px]" visualClassName="self-end">
        <AiHeroDemo demo={content.hero.demo} />
      </PageHero>

      <div className="border-b border-[rgba(11,17,22,0.09)]">
        <ul className={`${shellClass} m-0 flex list-none flex-wrap justify-center gap-x-10 gap-y-3 py-6`}>
          {content.hero.trust.map((item) => (
            <li className="flex items-center gap-2.5 text-[0.88rem] text-[var(--color-ink-soft)]" key={item}>
              <CircleCheckIcon aria-hidden="true" className="h-[1.1rem] w-[1.1rem] shrink-0 text-[var(--color-blue)]" strokeWidth={1.6} />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <section className={`${shellClass} py-[clamp(7rem,13vw,12rem)]`} id="problem">
        <div className="grid grid-cols-[minmax(0,0.72fr)_minmax(32rem,1.28fr)] items-center gap-[clamp(3rem,6vw,6rem)] max-[980px]:grid-cols-1">
          <div data-reveal="left">
            <h2 className={titleClass}><TwoTone text={content.problem.title} /></h2>
            <ul className="mb-0 mt-7 grid list-none gap-4 p-0">
              {content.problem.points.map((point) => (
                <li className="border-l-2 border-[rgba(56,182,255,0.45)] pl-4 text-[1rem] leading-[1.6] text-[var(--color-muted)]" key={point}>
                  {point}
                </li>
              ))}
            </ul>
            <p className="mb-0 mt-7 max-w-[46rem] text-[1.08rem] font-medium leading-[1.5] text-[var(--color-ink)]">{content.problem.solution}</p>
          </div>
          <AiCompareDemo demo={content.problem.demo} />
        </div>
      </section>

      <section className="relative isolate border-y border-white/8 bg-[var(--color-surface-dark)] [background-image:var(--gradient-hero)] text-white" id="signature-demo">
        <div className={sectionClass}>
          <h2 className="m-0 max-w-[940px] text-[clamp(2.15rem,4.4vw,3.9rem)] leading-[1.02] tracking-[-0.04em] text-white" data-reveal><TwoTone text={content.signature.title} /></h2>
          <div className="mt-[clamp(2.5rem,5vw,4rem)]">
            <AiBuildStory demo={content.signature.demo} steps={content.signature.steps} />
          </div>
          <div className="mt-[clamp(3rem,6vw,5rem)] grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-12 gap-y-7 rounded-[var(--radius-panel)] border border-white/12 bg-white/[0.04] p-[clamp(1.5rem,3.5vw,2.75rem)] max-[809px]:grid-cols-1" data-reveal>
            <div>
              <h3 className="m-0 text-[clamp(1.5rem,2.6vw,2.1rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-white">{content.signature.noteTitle}</h3>
              <p className="mb-0 mt-3 max-w-[38rem] text-[1rem] leading-[1.65] text-white/62">{content.signature.note}</p>
            </div>
            <Link className="action action-mist max-[809px]:w-full" href={primaryHref}>
              {content.signature.cta}
              <ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <div className="divide-y divide-[rgba(11,17,22,0.09)]">
        {content.acts.map((act) => (act.demo ? <AskActSection act={act} key={act.number} /> : <ConfigureActSection act={act} key={act.number} />))}
      </div>

      <section className="border-y border-[rgba(11,17,22,0.1)] bg-[var(--color-paper-soft)]" id="connect">
        <div className={`${sectionClass} grid grid-cols-[minmax(0,0.82fr)_minmax(28rem,1.18fr)] items-center gap-[clamp(2rem,4vw,4rem)] max-[980px]:grid-cols-1`}>
          <div data-reveal="left">
            <h2 className={titleClass}><TwoTone text={content.connect.title} /></h2>
            <ol className="mb-0 mt-8 grid list-none gap-5 p-0" id="connect-steps">
              {content.connect.steps.map((step, index) => (
                <li className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3 transition-opacity duration-300" key={step.title}>
                  <span className="text-[0.82rem] font-semibold leading-[1.75] text-[var(--color-blue)]">{index + 1}</span>
                  <div>
                    <h3 className="m-0 text-[1.08rem] font-semibold text-[var(--color-ink)]">{step.title}</h3>
                    <p className="mb-0 mt-1 text-[0.92rem] leading-[1.6] text-[var(--color-muted)]">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <AiConnectDemo demo={content.connect.demo} stepsId="connect-steps" />
        </div>
      </section>

      <section className={sectionClass} id="trust">
        <h2 className={titleClass} data-reveal><TwoTone text={content.trust.title} /></h2>
        <div className="mt-10 grid grid-cols-4 gap-3 max-[1100px]:grid-cols-2 max-[620px]:grid-cols-1">
          {content.trust.items.map((item) => (
            <div className="rounded-[16px] border border-[rgba(11,17,22,0.1)] p-6" data-reveal key={item.title}>
              <h3 className="m-0 text-[1.08rem] font-semibold text-[var(--color-ink)]">{item.title}</h3>
              <p className="mb-0 mt-3 text-[0.88rem] leading-[1.55] text-[var(--color-muted)]">{item.description}</p>
              {item.securityLink ? (
                <Link className="mt-3 inline-flex items-center gap-1.5 text-[0.88rem] font-medium text-[var(--color-blue)]" href={localizeFeaturePath(locale, "security")}>
                  {item.securityLink}
                  <ArrowRightIcon aria-hidden="true" className="h-3.5 w-3.5" />
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/8 bg-[var(--color-surface-dark)] text-white" id="proof">
        <div className={sectionClass}>
          <div data-reveal>
            <h2 className="m-0 max-w-[940px] text-[clamp(2.15rem,4.4vw,3.9rem)] leading-[1.02] tracking-[-0.04em] text-white"><TwoTone text={content.proof.title} /></h2>
            <p className="mb-0 mt-7 max-w-[46rem] text-[1.04rem] leading-[1.72] text-white/62">{content.proof.description}</p>
          </div>
        </div>
      </section>

      <section className="border-y border-[rgba(11,17,22,0.1)] bg-[var(--color-paper-soft)]" id="prompts">
        <div className={sectionClass}>
          <h2 className={titleClass}><TwoTone text={content.prompts.title} /></h2>
          <div className="mt-12 grid grid-cols-4 gap-x-6 gap-y-10 max-[1100px]:grid-cols-2 max-[620px]:grid-cols-1">
            {content.prompts.groups.map((group) => (
              <div key={group.title}>
                <h3 className="m-0 text-[1.15rem] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">{group.title}</h3>
                <ul className="mb-0 mt-4 grid list-none justify-items-start gap-2.5 p-0">
                  {group.items.map((item) => (
                    <li className="rounded-[16px] rounded-bl-[4px] border border-[rgba(11,17,22,0.1)] bg-white px-4 py-2.5 text-[0.95rem] leading-[1.4] text-[var(--color-ink-soft)]" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeatureFaqSection faq={content.faq} />
      <FeatureRelatedSection locale={locale} related={content.related} />
      <FeatureFinalCtaSection finalCta={content.finalCta} primaryHref={primaryHref} />

      <section className={`${sectionClass} pt-0`}>
        <h2 className="m-0 text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.1] tracking-[-0.03em] text-[var(--color-ink)]"><TwoTone text={content.seoText.title} /></h2>
        <div className="mt-6 grid max-w-[62rem] gap-5">
          {content.seoText.paragraphs.map((paragraph) => <p className={bodyClass} key={paragraph}>{paragraph}</p>)}
        </div>
      </section>
    </>
  );
}
