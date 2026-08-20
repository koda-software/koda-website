import Link from "next/link";
import type { ReactNode } from "react";
import { PhotoBackdrop, type PhotoName } from "@/components/layout/PhotoBackdrop";

type LandingSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

type SectionIntroProps = {
  description?: string;
  eyebrow: string;
  invert?: boolean;
  split?: boolean;
  title: string;
};

type CtaAction = {
  href: string;
  label: string;
  variant?: "primary" | "darkGhost";
};

type CtaRowProps = {
  actions: CtaAction[];
  align?: "left" | "center";
  label: string;
};

type DarkPanelProps = {
  children: ReactNode;
  className?: string;
};

type LandingHeroProps = {
  children: ReactNode;
  description: string;
  eyebrow: string;
  /** Photograph behind the banner. Omitted, the banner stays gradient-only. */
  photo?: PhotoName;
  primaryCta: string;
  primaryHref: string;
  scrollLabel?: string;
  scrollTarget?: string;
  secondaryCta: string;
  secondaryHref: string;
  title: string;
  visualMode?: "column" | "edge";
};

type FinalCtaPanelProps = {
  description: string;
  eyebrow: string;
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
  title: string;
};

export const landingShellClass = "mx-auto w-[min(100%,var(--shell-width))]";

export const sectionTitleClass = "m-0 text-[clamp(2rem,3.6vw,2.85rem)] leading-[1.06] tracking-[-0.04em]";

/**
 * One type scale for every page banner, so the headline reads the same size on
 * the home page as on Opero, Solutions, Contact and the feature pages. Sized so
 * the longest words in both languages ("oprogramowanie", "Rozwiązania") stay
 * whole inside the home hero's narrow text column, which is the tightest place
 * a banner headline has to fit. `text-balance` evens out the line lengths, and
 * `break-words` is a safety net for the smallest phones; nothing should reach
 * it at these sizes. Render titles through `HeroTitle` rather than using this
 * on a bare `h1`.
 */
export const heroTitleClass =
  "m-0 text-balance break-words text-[clamp(2.6rem,5vw,3.5rem)] leading-[1.03] tracking-[-0.05em] max-[809px]:text-[clamp(2rem,10vw,2.6rem)]";

/**
 * The banner headline. Hyphenated terms carry the product's own vocabulary
 * ("low-code", "no-code", "off-the-shelf"), and a line break inside one reads
 * as a typo - browsers otherwise treat the hyphen as a break opportunity and
 * split them whenever the line runs tight. Each hyphenated word therefore
 * renders inside a nowrap span, which changes no text: the heading still reads
 * as a plain ASCII-hyphenated string to search engines and screen readers.
 */
export function HeroTitle({ className = "", title }: { className?: string; title: string }) {
  return (
    <h1 className={`${heroTitleClass} ${className}`.trim()}>
      {title.split(/(\s+)/).map((part, index) =>
        part.includes("-") && part.trim().length > 1 ? (
          <span className="whitespace-nowrap" key={index}>
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </h1>
  );
}

export const sectionDescriptionClass = "mt-4 text-[clamp(1rem,1.5vw,1.12rem)] font-light leading-[1.62] text-[var(--color-muted)]";

export const mutedCopyClass = "m-0 leading-[1.55] text-[var(--color-muted)]";

const eyebrowClass = "eyebrow mb-4 font-sans text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-blue)]";
const darkEyebrowClass = `${eyebrowClass} text-[var(--color-blue-soft)]`;
const sectionClass = `${landingShellClass} px-[var(--page-gutter)] py-[var(--section-y)]`;
const sectionHeadingClass = "max-w-[790px]";
const splitHeadingClass = `${sectionHeadingClass} grid max-w-none items-end gap-[clamp(1.5rem,4vw,4rem)] grid-cols-[minmax(0,1fr)_minmax(18rem,0.72fr)] max-[809px]:grid-cols-1`;
const buttonClass = "inline-flex min-h-11 items-center justify-center rounded-[var(--radius-button)] px-4 py-3 font-medium transition-[background,border-color] duration-150";
const buttonClasses = {
  primary: `${buttonClass} bg-[image:var(--gradient-cta)] text-[var(--color-paper)]`,
  darkGhost: `${buttonClass} bg-white/10 text-[var(--color-paper)] hover:bg-white/[0.14]`,
};

export function LandingSection({ children, className = "", id }: LandingSectionProps) {
  return (
    <section className={`${sectionClass} ${className}`.trim()} id={id}>
      {children}
    </section>
  );
}

export function SectionIntro({ description, eyebrow, invert = false, split = false, title }: SectionIntroProps) {
  const descriptionClass = invert ? `${sectionDescriptionClass} text-white/70` : sectionDescriptionClass;

  if (split) {
    return (
      <div className={splitHeadingClass}>
        <div>
          <Eyebrow invert={invert}>{eyebrow}</Eyebrow>
          <h2 className={sectionTitleClass}>{title}</h2>
        </div>
        {description ? <p className={descriptionClass}>{description}</p> : null}
      </div>
    );
  }

  return (
    <div className={sectionHeadingClass}>
      <Eyebrow invert={invert}>{eyebrow}</Eyebrow>
      <h2 className={sectionTitleClass}>{title}</h2>
      {description ? <p className={descriptionClass}>{description}</p> : null}
    </div>
  );
}

export function CtaRow({ actions, align = "left", label }: CtaRowProps) {
  return (
    <div className={`mt-8 flex flex-wrap gap-3 ${align === "center" ? "justify-center" : ""}`} aria-label={label}>
      {actions.map((action) => (
        <Link className={buttonClasses[action.variant ?? "primary"]} href={action.href} key={`${action.href}-${action.label}`}>
          {action.label}
        </Link>
      ))}
    </div>
  );
}

export function DarkPanel({ children, className = "" }: DarkPanelProps) {
  return (
    <div className={`rounded-[var(--radius-panel)] [background:var(--gradient-technical)] p-[clamp(1.2rem,5vw,4rem)] text-[var(--color-paper)] ${className}`.trim()}>
      {children}
    </div>
  );
}

/**
 * A section label. Every one of them carries the Opero hexagon as its node -
 * the single device that ties the sections together, in place of the assorted
 * icons the cards used to open with.
 */
export function Eyebrow({ children, invert = false }: { children: ReactNode; invert?: boolean }) {
  return (
    <p className={invert ? darkEyebrowClass : eyebrowClass}>{children}</p>
  );
}

export function LandingHero({
  children,
  description,
  eyebrow,
  photo,
  primaryCta,
  primaryHref,
  scrollLabel = "Scroll to next section",
  scrollTarget,
  secondaryCta,
  secondaryHref,
  title,
  visualMode = "column",
}: LandingHeroProps) {
  const edgeVisual = visualMode === "edge";

  return (
    <section className={`relative flex min-h-screen items-center overflow-hidden bg-[var(--color-surface-dark)] [background-image:var(--gradient-hero)] px-[var(--page-gutter)] pb-[clamp(4rem,8vw,7rem)] pt-[clamp(8rem,13vw,12rem)] text-[var(--color-paper)] max-[809px]:pt-28 ${edgeVisual ? "max-[809px]:pb-[min(45vw,13rem)]" : ""}`.trim()}>
      {photo ? <PhotoBackdrop photo={photo} priority /> : null}
      {edgeVisual ? children : null}
      {/*
        The edge visual bleeds in from the right far enough that around 1280px
        the headline's last line runs across it. The copy is white and the
        visual is a bright product screenshot, so those few words lose their
        contrast entirely. This scrim sits above the visual and below the copy,
        dark where the text is and clear by the time it reaches the part of the
        visual anyone is meant to look at.
      */}
      {edgeVisual ? (
        <div
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(95deg, rgba(11,17,22,0.9) 0%, rgba(11,17,22,0.78) 34%, rgba(11,17,22,0.24) 56%, rgba(11,17,22,0) 68%)",
          }}
        />
      ) : null}
      <div className={`relative z-[1] ${landingShellClass} grid items-center gap-[clamp(2rem,5vw,5rem)] ${edgeVisual ? "grid-cols-[minmax(0,0.78fr)_minmax(18rem,0.42fr)]" : "grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]"} max-[809px]:grid-cols-1`}>
        <div className="relative z-[1]">
          <div className="hero-rise"><Eyebrow invert>{eyebrow}</Eyebrow></div>
          <div className="hero-rise hero-d1"><HeroTitle className="max-w-[880px]" title={title} /></div>
          <p className="hero-rise hero-d2 mt-6 max-w-[760px] text-[clamp(1.05rem,2vw,1.35rem)] font-light leading-[1.55] text-white/75">{description}</p>
          <div className="hero-rise hero-d3">
          <CtaRow
            actions={[
              { href: primaryHref, label: primaryCta },
              { href: secondaryHref, label: secondaryCta, variant: "darkGhost" },
            ]}
            label="Primary actions"
          />
          </div>
        </div>
        {edgeVisual ? (
          <div aria-hidden="true" />
        ) : (
          <div className="hero-slide hero-d3 relative z-[1] min-w-0 max-[809px]:mt-6">{children}</div>
        )}
      </div>

      {scrollTarget ? (
        <a
          className="absolute bottom-6 left-1/2 z-[1] hidden -translate-x-1/2 items-center justify-center rounded-full p-3 text-white/60 transition-colors hover:text-white md:flex"
          href={scrollTarget}
          aria-label={scrollLabel}
        >
          <svg className="h-9 w-9 motion-safe:animate-bounce" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      ) : null}
    </section>
  );
}

/**
 * The KodaSoft ring, used as a background motif rather than as a logo.
 *
 * Decorative geometry on the page was previously generic - squares, dots,
 * abstract glows - which is exactly what makes a layout look like it could
 * belong to anyone. Reusing the mark the company already owns costs nothing
 * and makes the same surfaces specific.
 *
 * Inline rather than an <img>: it is two paths, so embedding avoids a request
 * and lets the arc carry the brand blue while the ring stays neutral. Kept to
 * the closing panel alone - repeated on every section it would stop reading as
 * an accent and start reading as wallpaper.
 */
function BrandMarkMotif() {
  return (
    <svg
      className="pointer-events-none absolute -right-16 -top-20 h-[34rem] w-[34rem] max-[809px]:-right-24 max-[809px]:h-[22rem] max-[809px]:w-[22rem]"
      viewBox="0 0 183 183"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M156.784 31.2161C141.62 16.0518 123.83 7.46718 103.356 5.46222V24.467C118.86 26.359 132.217 32.9951 143.427 44.3189C157.208 58.0995 164.098 74.6475 164.098 93.9911C164.098 113.137 157.208 129.629 143.427 143.409C129.958 157.02 113.41 163.826 93.7553 163.826C74.2422 163.826 57.6942 157.02 44.0831 143.409C32.7593 131.803 26.1514 118.446 24.2594 103.338H5.42407C7.37255 123.896 15.8725 141.687 30.9803 156.766C48.2907 174.246 69.2157 183 93.7553 183C118.295 183 139.305 174.246 156.784 156.766C174.095 139.456 182.764 118.531 182.764 93.9911C182.764 69.4515 174.095 48.5265 156.784 31.2161Z"
        fill="#ffffff"
        fillOpacity="0.045"
      />
      <path
        d="M83.94 0.514029C62.3373 2.56135 43.3354 11.722 27.4877 27.7194C11.7135 43.4625 2.64316 62.3656 0.53089 83.9062L0 89.3309H28.6173L29.1623 85.0047C30.9329 70.9107 37.1313 58.3924 47.5853 47.8028C58.1297 37.2641 70.7101 31.0657 84.9877 29.3742L89.3478 28.8602V8.34336e-05L83.94 0.514029Z"
        fill="var(--color-brand-blue)"
        fillOpacity="0.14"
      />
    </svg>
  );
}

export function FinalCtaPanel({ description, eyebrow, primaryCta, primaryHref, secondaryCta, secondaryHref, title }: FinalCtaPanelProps) {
  return (
    <DarkPanel className="relative overflow-hidden text-center">
      <BrandMarkMotif />
      <div className="relative z-[1]">
      <Eyebrow invert>{eyebrow}</Eyebrow>
      <h2 className="mx-auto m-0 max-w-[900px] text-[clamp(2.65rem,5.6vw,4.25rem)] leading-none tracking-[-0.055em] max-[809px]:text-[clamp(2.45rem,12vw,3.35rem)]">
        {title}
      </h2>
      <p className={`${sectionDescriptionClass} mx-auto max-w-[680px] text-white/70`}>{description}</p>
      <CtaRow
        actions={[
          { href: primaryHref, label: primaryCta },
          { href: secondaryHref, label: secondaryCta, variant: "darkGhost" },
        ]}
        align="center"
        label="Final actions"
      />
      </div>
    </DarkPanel>
  );
}
