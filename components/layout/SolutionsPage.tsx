import Link from "next/link";
import BriefcaseIcon from "lucide-react/dist/esm/icons/briefcase.mjs";
import FactoryIcon from "lucide-react/dist/esm/icons/factory.mjs";
import GraduationCapIcon from "lucide-react/dist/esm/icons/graduation-cap.mjs";
import HardHatIcon from "lucide-react/dist/esm/icons/hard-hat.mjs";
import HeartPulseIcon from "lucide-react/dist/esm/icons/heart-pulse.mjs";
import LandmarkIcon from "lucide-react/dist/esm/icons/landmark.mjs";
import StoreIcon from "lucide-react/dist/esm/icons/store.mjs";
import WrenchIcon from "lucide-react/dist/esm/icons/wrench.mjs";
import { HeroTitle } from "@/components/landing/LandingPrimitives";
import type {
  SolutionIndustry,
  SolutionIndustryIcon,
  SolutionsContent,
} from "@/content/types";

type SolutionsPageProps = {
  content: SolutionsContent;
  primaryHref: string;
  secondaryHref: string;
};

const shellClass =
  "mx-auto w-[min(100%,var(--shell-width))] px-[var(--page-gutter)]";
const sectionClass = `${shellClass} py-[var(--section-y)]`;
const eyebrowClass =
  "mb-4 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-blue)]";
const darkEyebrowClass =
  "mb-4 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-blue-soft)]";
const titleClass =
  "m-0 max-w-[900px] text-[2.55rem] leading-[1.08] text-[var(--color-ink)] max-[809px]:text-[1.85rem]";
const bodyClass =
  "m-0 text-[1.04rem] font-light leading-[1.7] text-[var(--color-muted)]";
const buttonClass =
  "inline-flex min-h-11 items-center justify-center rounded-[var(--radius-button)] px-4 py-3 font-medium transition-colors";
/** Keyed by the content's own icon field, so reordering industries cannot desync the icons. */
const industryIcons: Record<SolutionIndustryIcon, typeof FactoryIcon> = {
  manufacturing: FactoryIcon,
  construction: HardHatIcon,
  professionalServices: BriefcaseIcon,
  fieldService: WrenchIcon,
  healthcare: HeartPulseIcon,
  retail: StoreIcon,
  education: GraduationCapIcon,
  publicSector: LandmarkIcon,
};

function CtaRow({
  invert = false,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
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

function DetailList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 grid list-none gap-3 p-0 text-[0.98rem] font-light leading-[1.6] text-[var(--color-muted)]">
      {items.map((item) => (
        <li
          className="border-t border-[rgba(2,2,13,0.08)] pt-3 first:border-t-0 first:pt-0"
          key={item}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function IndustrySection({
  industry,
  index,
}: {
  industry: SolutionIndustry;
  index: number;
}) {
  const IndustryIcon = industryIcons[industry.icon];

  return (
    <section
      data-reveal
      className={`border-t border-[rgba(2,2,13,0.12)] ${index % 2 === 1 ? "bg-[var(--color-paper-soft)]" : "bg-[var(--color-paper)]"}`}
    >
      <div
        className={`${sectionClass} grid grid-cols-[minmax(0,0.45fr)_minmax(0,1fr)] gap-16 max-[980px]:grid-cols-1 max-[980px]:gap-8`}
      >
        <div>
          <div className="mb-6 flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-button)] border border-[rgba(2,2,13,0.12)] bg-white text-[var(--color-blue)] shadow-[0_10px_28px_rgba(2,2,13,0.045)]">
              <IndustryIcon
                className="h-5 w-5"
                strokeWidth={1.7}
                aria-hidden="true"
              />
            </span>
            <span className="text-[0.88rem] font-semibold text-[var(--color-blue)]">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className="m-0 max-w-[34rem] text-[2rem] font-medium leading-[1.1] text-[var(--color-ink)] max-[809px]:text-[1.6rem]">
            {industry.title}
          </h3>
        </div>
        <div className="grid gap-10">
          <div className="grid gap-4">
            {industry.scenario.map((paragraph) => (
              <p className={bodyClass} key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-10 max-[809px]:grid-cols-1">
            <div>
              <h4 className="m-0 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
                {industry.useCasesLabel}
              </h4>
              <DetailList items={industry.useCases} />
            </div>
            <div>
              <h4 className="m-0 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
                {industry.helpfulFeaturesLabel}
              </h4>
              <DetailList items={industry.helpfulFeatures} />
            </div>
          </div>

          <div className="border-t border-[rgba(2,2,13,0.12)] pt-6">
            <h4 className="m-0 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
              {industry.supportsLabel}
            </h4>
            <ul className="mt-4 grid list-none grid-cols-2 gap-x-10 gap-y-3 p-0 text-[0.96rem] leading-[1.55] text-[var(--color-ink-soft)] max-[809px]:grid-cols-1">
              {industry.supports.map((support) => (
                <li
                  className="border-b border-[rgba(2,2,13,0.08)] pb-2"
                  key={support}
                >
                  {support}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SolutionsPage({
  content,
  primaryHref,
  secondaryHref,
}: SolutionsPageProps) {
  return (
    <>
      <section className="flex items-center overflow-hidden bg-[#000407] [background-image:var(--gradient-hero)] px-[var(--page-gutter)] pb-[5.5rem] pt-[10rem] text-white max-[809px]:pt-28">
        <div className="mx-auto grid w-[min(100%,var(--shell-width))] grid-cols-[minmax(0,1fr)_minmax(18rem,0.52fr)] items-end gap-16 max-[980px]:grid-cols-1">
          <div>
            <p className={`${darkEyebrowClass} hero-rise`}>
              {content.hero.eyebrow}
            </p>
            <div className="hero-rise hero-d1">
              <HeroTitle className="max-w-[980px]" title={content.hero.title} />
            </div>
            <p className="hero-rise hero-d2 mt-6 max-w-[760px] text-[1.22rem] font-light leading-[1.58] text-white/74 max-[809px]:text-[1.05rem]">
              {content.hero.description}
            </p>
            <div className="hero-rise hero-d3">
              <CtaRow
                invert
                primaryHref={primaryHref}
                primaryLabel={content.hero.primaryCta}
                secondaryHref={secondaryHref}
                secondaryLabel={content.hero.secondaryCta}
              />
            </div>
          </div>
          <div className="hero-slide hero-d3 border-y border-white/[0.12] py-8">
            <p className="m-0 text-[1.08rem] font-light leading-[1.65] text-white/68">
              {content.hero.supportLine}
            </p>
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <p className={eyebrowClass}>{content.industries.eyebrow}</p>
        <div className="grid grid-cols-[minmax(0,0.82fr)_minmax(18rem,0.48fr)] gap-12 max-[980px]:grid-cols-1">
          <h2 className={titleClass}>{content.industries.title}</h2>
          <p className={bodyClass}>{content.industries.description}</p>
        </div>
      </section>

      {content.industries.items.map((industry, index) => (
        <IndustrySection
          industry={industry}
          index={index}
          key={industry.title}
        />
      ))}

      <section className="px-[var(--page-gutter)] py-[var(--section-y)]">
        <div className="mx-auto w-[min(100%,var(--shell-width))] rounded-[var(--radius-panel)] [background:var(--gradient-technical)] p-[3.5rem] text-white max-[809px]:p-6">
          <div className="grid grid-cols-[minmax(0,0.72fr)_minmax(22rem,0.86fr)] gap-12 max-[980px]:grid-cols-1">
            <div>
              <p className={darkEyebrowClass}>{content.pattern.eyebrow}</p>
              <h2 className="m-0 max-w-[760px] text-[2.5rem] leading-[1.1] max-[809px]:text-[1.75rem]">
                {content.pattern.title}
              </h2>
              <p className="mt-6 max-w-[680px] text-[1.04rem] font-light leading-[1.7] text-white/68">
                {content.pattern.description}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left">
                <thead className="text-[0.72rem] uppercase tracking-[0.08em] text-white/42">
                  <tr>
                    <th className="w-[45%] border-b border-white/[0.12] pb-4 pr-6 font-semibold">
                      {content.pattern.problemLabel}
                    </th>
                    <th className="border-b border-white/[0.12] pb-4 font-semibold">
                      {content.pattern.supportLabel}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {content.pattern.rows.map((row) => (
                    <tr
                      data-reveal
                      className="border-b border-white/[0.08] last:border-b-0"
                      key={row.problem}
                    >
                      <td className="py-4 pr-6 align-top text-[0.96rem] font-medium leading-[1.5] text-white/82">
                        {row.problem}
                      </td>
                      <td className="py-4 align-top text-[0.96rem] font-light leading-[1.6] text-white/62">
                        {row.support}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section
        className={`${sectionClass} grid grid-cols-[minmax(0,0.58fr)_minmax(0,1fr)] gap-16 max-[980px]:grid-cols-1`}
      >
        <div>
          <p className={eyebrowClass}>{content.fit.eyebrow}</p>
          <h2 className={titleClass}>{content.fit.title}</h2>
          <p className={`${bodyClass} mt-5 max-w-[680px]`}>
            {content.fit.description}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 max-[809px]:grid-cols-1">
          <div className="border-y border-[rgba(2,2,13,0.12)] py-6">
            <h3 className="m-0 text-[1.35rem] font-medium text-[var(--color-ink)]">
              {content.fit.goodFitTitle}
            </h3>
            <ul className="mt-5 grid list-none gap-3 p-0 text-[0.98rem] font-light leading-[1.6] text-[var(--color-muted)]">
              {content.fit.goodFit.map((item) => (
                <li
                  data-reveal
                  className="border-t border-[rgba(2,2,13,0.08)] pt-3 first:border-t-0 first:pt-0"
                  key={item}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-y border-[rgba(2,2,13,0.12)] py-6">
            <h3 className="m-0 text-[1.35rem] font-medium text-[var(--color-ink)]">
              {content.fit.notBestFitTitle}
            </h3>
            <ul className="mt-5 grid list-none gap-3 p-0 text-[0.98rem] font-light leading-[1.6] text-[var(--color-muted)]">
              {content.fit.notBestFit.map((item) => (
                <li
                  data-reveal
                  className="border-t border-[rgba(2,2,13,0.08)] pt-3 first:border-t-0 first:pt-0"
                  key={item}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={`${sectionClass} pt-0`}>
        <div className="border-y border-[rgba(2,2,13,0.12)] py-[4rem] text-center">
          <p className={eyebrowClass}>{content.finalCta.eyebrow}</p>
          <h2 className="mx-auto m-0 max-w-[860px] text-[2.6rem] leading-[1.08] text-[var(--color-ink)] max-[809px]:text-[1.85rem]">
            {content.finalCta.title}
          </h2>
          <p className={`${bodyClass} mx-auto mt-5 max-w-[680px]`}>
            {content.finalCta.description}
          </p>
          <div className="flex justify-center">
            <CtaRow
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
