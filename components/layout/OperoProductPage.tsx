import Link from "next/link";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right.mjs";
import type {
  NavSubItem,
  OperoProductContent,
  ProductFeatureRow,
} from "@/content/types";
import { IconTextGrid } from "@/components/landing/LandingCards";
import { LazyHeroVideo } from "@/components/landing/LazyHeroVideo";
import { PageHero } from "@/components/landing/LandingPrimitives";
import { HomeAiDemo } from "./demos/HomeAiDemo";

type OperoProductPageProps = {
  content: OperoProductContent;
  /** The eight feature pages nested under this route. */
  featureLinks: NavSubItem[];
  primaryHref: string;
  secondaryHref: string;
};

const shellClass =
  "mx-auto w-[min(100%,var(--shell-width))] px-[var(--page-gutter)]";
const sectionClass = `${shellClass} py-[var(--section-y)]`;
const eyebrowClass =
  "mb-4 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-blue)]";
const darkEyebrowClass =
  "eyebrow mb-4 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-blue-soft)]";
const sectionTitleClass =
  "m-0 max-w-[860px] text-[2.6rem] leading-[1.08] text-[var(--color-ink)] max-[809px]:text-[1.9rem]";
const bodyClass =
  "m-0 text-[1.04rem] font-light leading-[1.7] text-[var(--color-muted)]";
const buttonClass =
  "inline-flex min-h-11 items-center justify-center rounded-[var(--radius-button)] px-4 py-3 font-medium transition-colors";

function CtaPair({
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  invert = false,
}: {
  invert?: boolean;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Link
        className={`${buttonClass} bg-[image:var(--gradient-cta)] text-white`}
        href={primaryHref}
      >
        {primaryLabel}
      </Link>
      <Link
        className={`${buttonClass} border ${
          invert
            ? "border-white/[0.18] bg-white/[0.08] text-white hover:bg-white/[0.12]"
            : "border-[rgba(2,2,13,0.12)] bg-white text-[var(--color-ink)] hover:border-[rgba(56, 182, 255,0.24)]"
        }`}
        href={secondaryHref}
      >
        {secondaryLabel}
      </Link>
    </div>
  );
}

function SupportLines({ items }: { items: string[] }) {
  return (
    <ul className="m-0 grid list-none gap-2 p-0 text-[0.9rem] leading-[1.5] text-[var(--color-ink-soft)]">
      {items.map((item) => (
        <li
          className="border-b border-[rgba(2,2,13,0.08)] pb-2 last:border-b-0 last:pb-0"
          key={item}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function FeatureRow({ row }: { row: ProductFeatureRow }) {
  return (
    <article data-reveal className="grid grid-cols-[minmax(12rem,0.55fr)_minmax(0,1fr)_minmax(14rem,0.62fr)] gap-8 border-t border-[rgba(2,2,13,0.12)] py-8 max-[980px]:grid-cols-1 max-[980px]:gap-4">
      <h3 className="m-0 text-[1.45rem] font-medium leading-[1.18] text-[var(--color-ink)]">
        {row.title}
      </h3>
      <p className={bodyClass}>{row.description}</p>
      <SupportLines items={row.supports} />
    </article>
  );
}

export function OperoProductPage({
  content,
  featureLinks,
  primaryHref,
  secondaryHref,
}: OperoProductPageProps) {
  return (
    <>
      <PageHero
        backgroundVisual={
          <div className="pointer-events-none absolute bottom-0 right-[100px] z-0 w-[clamp(44rem,66vw,77rem)] translate-x-[31%] translate-y-[22%] rotate-[-3deg] opacity-95 max-[1200px]:opacity-55 max-[980px]:right-[100px] max-[980px]:w-[min(51rem,108vw)] max-[980px]:translate-x-[30%] max-[980px]:translate-y-[28%] max-[809px]:opacity-40">
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
        }
        description={content.hero.description}
        eyebrow={content.hero.eyebrow}
        photo="operations"
        primaryCta={content.hero.primaryCta}
        primaryHref={primaryHref}
        secondaryCta={content.hero.secondaryCta}
        secondaryHref={secondaryHref}
        sectionClassName="max-[980px]:pb-[min(48vw,16rem)]"
        shellClassName="grid-cols-[minmax(0,0.72fr)_minmax(22rem,0.48fr)]"
        title={content.hero.title}
        titleClassName="max-w-[900px]"
      >
        <div aria-hidden="true" />
      </PageHero>

      <section
        className={`${sectionClass} grid grid-cols-[minmax(0,0.65fr)_minmax(0,1fr)] gap-16 max-[980px]:grid-cols-1`}
      >
        <div>
          <p className={eyebrowClass}>{content.overview.eyebrow}</p>
          <h2 className={sectionTitleClass}>{content.overview.title}</h2>
        </div>
        <div className="grid gap-6">
          {content.overview.paragraphs.map((paragraph) => (
            <p className={bodyClass} key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className={sectionClass}>
        <p className={eyebrowClass}>{content.features.eyebrow}</p>
        <div className="grid grid-cols-[minmax(0,0.82fr)_minmax(18rem,0.48fr)] gap-12 max-[980px]:grid-cols-1">
          <h2 className={sectionTitleClass}>{content.features.title}</h2>
          <p className={bodyClass}>{content.features.description}</p>
        </div>
        <div className="mt-10 border-b border-[rgba(2,2,13,0.12)]">
          {content.features.rows.map((row) => (
            <FeatureRow key={row.title} row={row} />
          ))}
        </div>
      </section>

      <section className={sectionClass}>
        <p className={eyebrowClass}>{content.featureLinks.eyebrow}</p>
        <div className="grid grid-cols-[minmax(0,0.82fr)_minmax(18rem,0.48fr)] gap-12 max-[980px]:grid-cols-1">
          <h2 className={sectionTitleClass}>{content.featureLinks.title}</h2>
          <p className={bodyClass}>{content.featureLinks.description}</p>
        </div>
        <ul className="mt-10 grid list-none grid-cols-4 gap-4 p-0 max-[980px]:grid-cols-2 max-[560px]:grid-cols-1">
          {featureLinks.map((item) => (
            <li key={item.feature}>
              <Link
                data-reveal
                className="group flex h-full items-center justify-between gap-3 rounded-[calc(var(--radius-panel)-8px)] border border-[rgba(2,2,13,0.1)] bg-[var(--color-paper)] p-5 text-[1.05rem] font-medium leading-[1.25] text-[var(--color-ink)] transition-colors hover:border-[rgba(56, 182, 255,0.24)]"
                href={item.href}
              >
                {item.label}
                <ArrowRightIcon
                  className="h-5 w-5 shrink-0 text-[var(--color-blue)] transition-transform duration-200 group-hover:translate-x-1"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-[var(--page-gutter)] py-[var(--section-y)]">
        <div className="mx-auto w-[min(100%,var(--shell-width))] rounded-[var(--radius-panel)] [background:var(--gradient-technical)] p-[3.5rem] text-white max-[809px]:p-6">
          <div className="grid grid-cols-[minmax(0,0.78fr)_minmax(20rem,0.74fr)] gap-12 max-[980px]:grid-cols-1">
            <div>
              <p className={darkEyebrowClass}>
                {content.connectedModel.eyebrow}
              </p>
              <h2 className="m-0 max-w-[760px] text-[2.5rem] leading-[1.1] max-[809px]:text-[1.75rem]">
                {content.connectedModel.title}
              </h2>
              <p className="mt-6 max-w-[680px] text-[1.04rem] font-light leading-[1.7] text-white/68">
                {content.connectedModel.description}
              </p>
            </div>
            <ol className="m-0 grid list-none gap-0 p-0">
              {content.connectedModel.layers.map((layer, index) => (
                <li
                  data-reveal
                  className="grid grid-cols-[3rem_1fr] gap-4 border-t border-white/[0.12] py-5 first:border-t-0"
                  key={layer.label}
                >
                  <span className="text-[0.82rem] font-semibold text-[var(--color-blue-soft)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <strong className="block font-medium text-white">
                      {layer.label}
                    </strong>
                    <span className="mt-1 block text-[0.94rem] font-light leading-[1.6] text-white/62">
                      {layer.detail}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className={`${sectionClass} grid items-start gap-[clamp(1.5rem,4vw,4rem)] grid-cols-[minmax(0,0.78fr)_minmax(20rem,1fr)] max-[809px]:grid-cols-1`}>
        <div data-reveal>
          <p className={eyebrowClass}>{content.ai.label}</p>
          <h2 className={sectionTitleClass}>{content.ai.title}</h2>
          <p className={`${bodyClass} mt-5 max-w-[680px]`}>
            {content.ai.description}
          </p>
          <div className="mt-7">
            <SupportLines items={content.ai.points} />
          </div>
        </div>
        <div data-reveal className="relative" aria-label={content.ai.label}>
          <HomeAiDemo chat={content.ai.chat} />
        </div>
      </section>

      <section className={sectionClass}>
        <p className={eyebrowClass}>{content.workflowExample.eyebrow}</p>
        <h2 className={sectionTitleClass}>{content.workflowExample.title}</h2>
        <p className={`${bodyClass} mt-5 max-w-[760px]`}>
          {content.workflowExample.description}
        </p>
        <div className="mt-10 overflow-x-auto border-y border-[rgba(2,2,13,0.12)]">
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <thead className="text-[0.76rem] uppercase tracking-[0.08em] text-[var(--color-muted)]">
              <tr>
                <th className="w-[32%] py-4 pr-6 font-semibold">
                  {content.workflowExample.needLabel}
                </th>
                <th className="py-4 font-semibold">
                  {content.workflowExample.supportLabel}
                </th>
              </tr>
            </thead>
            <tbody>
              {content.workflowExample.rows.map((row) => (
                <tr
                  data-reveal
                  className="border-t border-[rgba(2,2,13,0.08)]"
                  key={row.need}
                >
                  <td className="py-5 pr-6 align-top text-[1rem] font-medium text-[var(--color-ink)]">
                    {row.need}
                  </td>
                  <td className="py-5 align-top text-[1rem] font-light leading-[1.65] text-[var(--color-muted)]">
                    {row.support}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={sectionClass}>
        <p className={eyebrowClass}>{content.implementation.eyebrow}</p>
        <h2 className={sectionTitleClass}>{content.implementation.title}</h2>
        <ol className="mt-10 grid list-none gap-0 border-b border-[rgba(2,2,13,0.12)] p-0">
          {content.implementation.steps.map((step, index) => (
            <li
              data-reveal
              className="grid grid-cols-[5rem_minmax(0,0.42fr)_minmax(0,1fr)] gap-8 border-t border-[rgba(2,2,13,0.12)] py-8 max-[809px]:grid-cols-1 max-[809px]:gap-3"
              key={step.title}
            >
              <span className="text-[1.2rem] font-semibold text-[var(--color-blue)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="m-0 text-[1.4rem] font-medium text-[var(--color-ink)]">
                {step.title}
              </h3>
              <div>
                <p className={bodyClass}>{step.description}</p>
                <p className="mt-3 text-[0.9rem] leading-[1.6] text-[var(--color-ink-soft)]">
                  {step.supports.join(" / ")}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={sectionClass}>
        <p className={eyebrowClass}>{content.useCases.label}</p>
        <h2 className={sectionTitleClass}>{content.useCases.title}</h2>
        <p className={`${bodyClass} mt-5 max-w-[760px]`}>
          {content.useCases.description}
        </p>
        <IconTextGrid items={content.useCases.items} />
      </section>

      <section className={sectionClass}>
        <p className={eyebrowClass}>{content.comparison.eyebrow}</p>
        <h2 className={sectionTitleClass}>{content.comparison.title}</h2>
        <div className="mt-10 overflow-x-auto border-y border-[rgba(2,2,13,0.12)]">
          <table className="w-full min-w-[56rem] border-collapse text-left">
            <tbody>
              {content.comparison.columns.map((column) => (
                <tr
                  data-reveal
                  className="border-t border-[rgba(2,2,13,0.08)] first:border-t-0"
                  key={column.label}
                >
                  <th className="w-[26%] py-6 pr-8 align-top text-[1.15rem] font-medium text-[var(--color-ink)]">
                    {column.label}
                  </th>
                  <td className="py-6 align-top text-[1rem] font-light leading-[1.7] text-[var(--color-muted)]">
                    {column.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={`${sectionClass} pt-0`}>
        <div className="border-y border-[rgba(2,2,13,0.12)] py-[4rem] text-center">
          <p className={eyebrowClass}>{content.finalCta.eyebrow}</p>
          <h2 className="mx-auto m-0 max-w-[860px] text-[2.7rem] leading-[1.08] text-[var(--color-ink)] max-[809px]:text-[1.9rem]">
            {content.finalCta.title}
          </h2>
          <p className={`${bodyClass} mx-auto mt-5 max-w-[680px]`}>
            {content.finalCta.description}
          </p>
          <div className="flex justify-center">
            <CtaPair
              primaryHref={primaryHref}
              primaryLabel={content.finalCta.primaryCta}
              secondaryHref={secondaryHref}
              secondaryLabel={content.finalCta.secondaryCta}
            />
          </div>
        </div>
      </section>
    </>
  );
}
