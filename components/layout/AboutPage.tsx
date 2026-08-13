import Link from "next/link";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right.mjs";
import { HeroTitle } from "@/components/landing/LandingPrimitives";
import type { AboutPageContent } from "@/content/types";

type AboutPageProps = {
  content: AboutPageContent;
  ctas: { primary: string; secondary: string };
};

const shellClass = "mx-auto w-[min(100%,var(--shell-width))] px-[var(--page-gutter)]";
const sectionClass = `${shellClass} py-[var(--section-y)]`;
const eyebrowClass = "mb-4 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-blue)]";
const darkEyebrowClass = "mb-4 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-blue-soft)]";
const sectionTitleClass = "m-0 max-w-[52rem] text-[clamp(1.9rem,3.4vw,2.6rem)] leading-[1.1] tracking-[-0.03em] text-[var(--color-ink)]";
const bodyClass = "m-0 text-[1.04rem] font-light leading-[1.7] text-[var(--color-muted)]";
const buttonClass =
  "inline-flex min-h-11 items-center justify-center rounded-[var(--radius-button)] px-4 py-3 font-medium transition-[background,border-color] duration-150";

export function AboutPage({ content, ctas }: AboutPageProps) {
  return (
    <>
      <section className="flex min-h-screen items-center overflow-hidden bg-[#000407] [background-image:var(--gradient-hero)] px-[var(--page-gutter)] pb-[5rem] pt-[10rem] text-white max-[809px]:pt-28">
        <div className="mx-auto w-[min(100%,var(--shell-width))]">
          <p className={`${darkEyebrowClass} hero-rise`}>{content.hero.eyebrow}</p>
          <div className="hero-rise hero-d1"><HeroTitle className="max-w-[940px]" title={content.hero.title} /></div>
          <p className="hero-rise hero-d2 mt-6 max-w-[780px] text-[1.18rem] font-light leading-[1.6] text-white/74 max-[809px]:text-[1.04rem]">
            {content.hero.description}
          </p>
          <div className="hero-rise hero-d3 mt-8 flex flex-wrap gap-3">
            <Link className={`${buttonClass} bg-[image:var(--gradient-cta)] text-white`} href={ctas.primary}>
              {content.hero.primaryCta}
            </Link>
            <Link
              className={`${buttonClass} border border-white/[0.18] bg-white/[0.08] text-white hover:bg-white/[0.12]`}
              href={ctas.secondary}
            >
              {content.hero.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section className={`${sectionClass} grid grid-cols-[minmax(0,1fr)_minmax(20rem,0.82fr)] items-start gap-[clamp(2rem,5vw,4.5rem)] max-[980px]:grid-cols-1`}>
        <div>
          <p className={eyebrowClass}>{content.identity.eyebrow}</p>
          <h2 className={sectionTitleClass}>{content.identity.title}</h2>
        </div>
        <div className="grid gap-5">
          {content.identity.paragraphs.map((paragraph) => (
            <p className={bodyClass} key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className={`${sectionClass} pt-0`}>
        <div className="border-t border-[rgba(2,2,13,0.12)] pt-[var(--section-y)]">
          <p className={eyebrowClass}>{content.origin.eyebrow}</p>
          <h2 className={sectionTitleClass}>{content.origin.title}</h2>
          <div className="mt-8 grid grid-cols-[minmax(0,1fr)_minmax(18rem,0.62fr)] gap-[clamp(2rem,5vw,4.5rem)] max-[980px]:grid-cols-1">
            <div className="grid max-w-[46rem] gap-5">
              {content.origin.paragraphs.map((paragraph) => (
                <p className={bodyClass} key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
            <figure className="m-0 self-start rounded-[var(--radius-panel)] [background:var(--gradient-technical)] p-[clamp(1.5rem,3vw,2.25rem)] text-white">
              <blockquote className="m-0 text-[1.12rem] font-light leading-[1.6] text-white/85">
                {content.origin.manifesto}
              </blockquote>
            </figure>
          </div>
        </div>
      </section>

      <section className={`${shellClass} pb-[var(--section-y)]`}>
        <div className="rounded-[var(--radius-panel)] [background:var(--gradient-technical)] p-[clamp(1.75rem,5vw,4rem)] text-white">
          <p className={darkEyebrowClass}>{content.mission.eyebrow}</p>
          <p className="m-0 max-w-[46rem] text-[clamp(1.7rem,3.4vw,2.5rem)] font-light leading-[1.18] tracking-[-0.03em]">
            {content.mission.title}
          </p>
          <p className="mt-7 max-w-[44rem] text-[1.04rem] font-light leading-[1.7] text-white/70">
            {content.mission.description}
          </p>
        </div>
      </section>

      <section className={`${sectionClass} pt-0`}>
        <p className={eyebrowClass}>{content.beliefs.eyebrow}</p>
        <h2 className={sectionTitleClass}>{content.beliefs.title}</h2>
        <p className={`${bodyClass} mt-5 max-w-[46rem]`}>{content.beliefs.description}</p>
        <div className="mt-10 grid grid-cols-3 gap-4 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
          {content.beliefs.items.map((item) => (
            <article
              className="grid content-start gap-3 rounded-[calc(var(--radius-panel)-8px)] border border-[rgba(2,2,13,0.1)] bg-[var(--color-paper)] p-6"
              key={item.title}
            >
              <h3 className="m-0 text-[1.12rem] font-medium leading-[1.3] text-[var(--color-ink)]">{item.title}</h3>
              <p className={`${bodyClass} text-[0.96rem]`}>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${sectionClass} pt-0`}>
        <div className="border-t border-[rgba(2,2,13,0.12)] pt-[var(--section-y)]">
          <p className={eyebrowClass}>{content.background.eyebrow}</p>
          <h2 className={sectionTitleClass}>{content.background.title}</h2>
          <p className={`${bodyClass} mt-5 max-w-[46rem]`}>{content.background.description}</p>
          <dl className="mt-9 grid max-w-[62rem] gap-0">
            {content.background.rows.map((row) => (
              <div
                className="grid grid-cols-[minmax(9rem,0.26fr)_minmax(0,1fr)] gap-6 border-t border-[rgba(2,2,13,0.08)] py-5 first:border-t-0 max-[809px]:grid-cols-1 max-[809px]:gap-2"
                key={row.label}
              >
                <dt className="m-0 text-[1rem] font-medium leading-[1.45] text-[var(--color-ink)]">{row.label}</dt>
                <dd className={`${bodyClass} m-0 text-[0.98rem]`}>{row.lesson}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className={`${sectionClass} pt-0`}>
        <p className={eyebrowClass}>{content.approach.eyebrow}</p>
        <h2 className={sectionTitleClass}>{content.approach.title}</h2>
        <div className="mt-9 grid grid-cols-4 gap-4 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
          {content.approach.items.map((item, index) => (
            <article className="grid content-start gap-3 border-t border-[rgba(2,2,13,0.14)] pt-5" key={item.title}>
              <span className="text-[0.82rem] font-semibold tracking-[0.08em] text-[var(--color-blue)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="m-0 text-[1.05rem] font-medium leading-[1.32] text-[var(--color-ink)]">{item.title}</h3>
              <p className={`${bodyClass} text-[0.96rem]`}>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      {content.facts ? (
        <section className={`${sectionClass} pt-0`}>
          <div className="border-t border-[rgba(2,2,13,0.12)] pt-[var(--section-y)]">
            <p className={eyebrowClass}>{content.facts.eyebrow}</p>
            <h2 className={sectionTitleClass}>{content.facts.title}</h2>
            <p className={`${bodyClass} mt-5 max-w-[46rem]`}>{content.facts.description}</p>
            <dl className="mt-9 grid grid-cols-4 gap-4 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
              {content.facts.items.map((item) => (
                <div
                  className="grid content-start gap-2 rounded-[calc(var(--radius-panel)-8px)] border border-[rgba(2,2,13,0.1)] bg-[var(--color-paper-soft)] p-6"
                  key={item.label}
                >
                  <dt className="m-0 text-[0.9rem] font-medium text-[var(--color-muted)]">{item.label}</dt>
                  <dd className="m-0 text-[2rem] font-light leading-none tracking-[-0.03em] text-[var(--color-ink)]">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      <section className={`${sectionClass} pt-0`}>
        <div className="border-y border-[rgba(2,2,13,0.12)] py-[4rem] text-center">
          <p className={eyebrowClass}>{content.finalCta.eyebrow}</p>
          <h2 className="mx-auto m-0 max-w-[860px] text-[clamp(1.9rem,3.6vw,2.7rem)] leading-[1.08] text-[var(--color-ink)]">
            {content.finalCta.title}
          </h2>
          <p className={`${bodyClass} mx-auto mt-5 max-w-[680px]`}>{content.finalCta.description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link className={`${buttonClass} bg-[image:var(--gradient-cta)] text-white`} href={ctas.primary}>
              {content.finalCta.primaryCta}
            </Link>
            <Link
              className={`${buttonClass} border border-[rgba(2,2,13,0.14)] text-[var(--color-ink)] hover:border-[rgba(2,2,13,0.28)]`}
              href={ctas.secondary}
            >
              {content.finalCta.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section className={`${sectionClass} pt-0`}>
        <p className={eyebrowClass}>{content.seoText.eyebrow}</p>
        <h2 className={sectionTitleClass}>{content.seoText.title}</h2>
        <div className="mt-6 grid max-w-[62rem] gap-5">
          {content.seoText.paragraphs.map((paragraph) => (
            <p className={bodyClass} key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className={`${sectionClass} pt-0`}>
        <p className={eyebrowClass}>{content.faq.eyebrow}</p>
        <h2 className={sectionTitleClass}>{content.faq.title}</h2>
        <div className="mt-8 grid max-w-[52rem] gap-3">
          {content.faq.items.map((item) => (
            <details
              className="group rounded-[calc(var(--radius-panel)-8px)] border border-[rgba(2,2,13,0.1)] bg-[var(--color-paper)] p-5 open:pb-5"
              key={item.question}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[1.05rem] font-medium leading-[1.3] text-[var(--color-ink)] marker:content-none [&::-webkit-details-marker]:hidden">
                {item.question}
                <ArrowRightIcon
                  className="h-5 w-5 shrink-0 -rotate-45 text-[var(--color-blue)] transition-transform duration-200 group-open:rotate-45"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
              </summary>
              <p className={`${bodyClass} mt-3`}>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
