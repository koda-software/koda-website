import Link from "next/link";

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
export const blogPrimaryButtonClass = `${blogButtonClass} bg-[linear-gradient(135deg,#1f7cff,#004fc4)] text-white`;
export const blogSecondaryButtonClass = `${blogButtonClass} border border-[rgba(2,2,13,0.12)] bg-white text-[var(--color-ink)] hover:border-[rgba(0,103,244,0.24)]`;

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
    <section className="bg-[#02020d] [background-image:var(--gradient-hero)] px-[var(--page-gutter)] pb-[3.75rem] pt-[9rem] text-white max-[809px]:pt-28">
      <div className="mx-auto grid w-[min(100%,var(--shell-width))] grid-cols-[minmax(0,1fr)_minmax(16rem,0.46fr)] items-end gap-12 max-[980px]:grid-cols-1 max-[980px]:gap-8">
        <div>
          <p className={`${blogDarkEyebrowClass} mb-4`}>{eyebrow}</p>
          <h1 className="m-0 max-w-[900px] text-[3.5rem] leading-[1.02] tracking-[-0.04em] max-[809px]:text-[2.35rem]">{title}</h1>
          {description ? (
            <p className="mt-6 max-w-[680px] text-[1.12rem] font-light leading-[1.6] text-white/72 max-[809px]:text-[1rem]">{description}</p>
          ) : null}
        </div>
        {aside ? <div className="border-y border-white/[0.12] py-6">{aside}</div> : null}
      </div>
    </section>
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
        <h2 className="mx-auto m-0 max-w-[820px] text-[3rem] leading-[1.05] text-[var(--color-ink)] max-[809px]:text-[2rem]">{title}</h2>
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
