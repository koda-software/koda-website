import Link from "next/link";
import { PageHero } from "@/components/landing/LandingPrimitives";

/**
 * Shared class idioms for the blog, mirroring the homepage and solutions pages:
 * editorial, bordered, no card grids or decorative elements.
 */
export const blogShellClass = "mx-auto w-[min(100%,var(--shell-width))] px-[var(--page-gutter)]";
export const blogSectionClass = `${blogShellClass} py-[var(--section-y)]`;
export const blogEyebrowClass = "m-0 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-blue)]";
export const blogDarkEyebrowClass = "m-0 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-blue-soft)]";
export const blogBodyClass = "m-0 text-[1.04rem] font-light leading-[1.7] text-[var(--color-muted)]";
export const blogMetaClass = "text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]";
export const blogButtonClass =
  "inline-flex min-h-11 items-center justify-center rounded-[var(--radius-button)] px-4 py-3 font-medium transition-colors";
export const blogPrimaryButtonClass = `${blogButtonClass} bg-[image:var(--gradient-cta)] text-white`;
export const blogSecondaryButtonClass = `${blogButtonClass} border border-[rgba(2,2,13,0.12)] bg-white text-[var(--color-ink)] hover:border-[rgba(56, 182, 255,0.24)]`;

type BlogHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  aside?: React.ReactNode;
};

/**
 * Dark header band shared by the index, pagination and archive pages. Shorter
 * than the solutions hero because these pages lead with a list, not a pitch.
 */
export function BlogHero({ eyebrow, title, description, aside }: BlogHeroProps) {
  return (
    <PageHero
      description={description}
      descriptionClassName="max-w-[680px] text-[1.12rem] max-[809px]:text-[1rem]"
      eyebrow={eyebrow}
      photo="workspace"
      photoOpacity={0.22}
      sectionClassName="pb-[4.75rem] pt-[10rem] max-[809px]:pt-[8rem]"
      shellClassName="grid-cols-[minmax(0,1fr)_minmax(16rem,0.46fr)] items-end gap-12 max-[980px]:gap-8"
      title={title}
      titleClassName="max-w-[900px]"
    >
      {aside ? <div className="border-y border-white/[0.12] py-6">{aside}</div> : null}
    </PageHero>
  );
}

/** Bordered, centered closing CTA — the same pattern the marketing pages end on. */
export function BlogFinalCta({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}) {
  return (
    <section className={`${blogSectionClass} pt-0`}>
      <div className="border-y border-[rgba(2,2,13,0.12)] py-[4rem] text-center">
        <p className={`${blogEyebrowClass} mb-4`}>{eyebrow}</p>
        <h2 className="mx-auto m-0 max-w-[820px] text-[2.5rem] leading-[1.1] text-[var(--color-ink)] max-[809px]:text-[1.75rem]">{title}</h2>
        <p className={`${blogBodyClass} mx-auto mt-5 max-w-[640px]`}>{description}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link className={blogPrimaryButtonClass} href={primaryHref}>
            {primaryLabel}
          </Link>
          <Link className={blogSecondaryButtonClass} href={secondaryHref}>
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
