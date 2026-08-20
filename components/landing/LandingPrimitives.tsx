import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { PhotoBackdrop, type PhotoName } from "@/components/layout/PhotoBackdrop";
import { GsapRevealRoot } from "./GsapRevealRoot";

type LandingSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

type SectionIntroProps = {
  action?: ReactNode;
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
};

type DarkPanelProps = {
  children: ReactNode;
  className?: string;
};

type LandingHeroProps = {
  children: ReactNode;
  description?: string;
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

type PageHeroProps = {
  backgroundVisual?: ReactNode;
  children?: ReactNode;
  description?: string;
  descriptionClassName?: string;
  eyebrow: string;
  photo?: PhotoName;
  photoOpacity?: number;
  photoPosition?: string;
  primaryCta?: string;
  primaryHref?: string;
  secondaryCta?: string;
  secondaryHref?: string;
  sectionClassName?: string;
  shellClassName?: string;
  title: string;
  titleClassName?: string;
  visualClassName?: string;
};

type HeroShellProps = {
  as?: "header" | "section";
  children: ReactNode;
  className?: string;
  photo?: PhotoName;
  photoOpacity?: number;
  photoPosition?: string;
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

function HeroDescription({ description }: { description?: string }) {
  if (!description) {
    return null;
  }

  const match = description.match(/^Opero(\s+)(.*)$/);

  if (!match) {
    return description;
  }

  return (
    <>
      <span className="inline-flex align-[-0.4em]">
        <Image
          alt="opero"
          className="h-[1.38em] w-auto opacity-95"
          height={153}
          src="/branding/opero-logo-white.svg"
          width={490}
        />
      </span>
      {match[1]}
      {match[2]}
    </>
  );
}

export const sectionDescriptionClass = "mt-4 text-[clamp(1rem,1.5vw,1.12rem)] font-light leading-[1.62] text-[var(--color-muted)]";

export const mutedCopyClass = "m-0 leading-[1.55] text-[var(--color-muted)]";

const eyebrowClass = "eyebrow mb-4 font-sans text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-blue)]";
const darkEyebrowClass = `${eyebrowClass} text-[var(--color-blue-soft)]`;
const sectionClass = `${landingShellClass} px-[var(--page-gutter)] py-[var(--section-y)]`;
const sectionHeadingClass = "max-w-[790px]";
const splitHeadingClass = `${sectionHeadingClass} grid max-w-none items-center gap-[clamp(1.5rem,4vw,4rem)] grid-cols-[minmax(0,1fr)_minmax(18rem,0.72fr)] max-[809px]:grid-cols-1`;
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

export function SectionIntro({ action, description, eyebrow, invert = false, split = false, title }: SectionIntroProps) {
  const descriptionClass = invert ? `${sectionDescriptionClass} text-white/70` : sectionDescriptionClass;

  if (split) {
    return (
      <div className={splitHeadingClass}>
        <div>
          <Eyebrow invert={invert}>{eyebrow}</Eyebrow>
          <h2 className={sectionTitleClass}>{title}</h2>
        </div>
        {description || action ? (
          <div>
            {description ? <p className={descriptionClass}>{description}</p> : null}
            {action ? <div className="mt-5">{action}</div> : null}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={sectionHeadingClass}>
      <Eyebrow invert={invert}>{eyebrow}</Eyebrow>
      <h2 className={sectionTitleClass}>{title}</h2>
      {description ? <p className={descriptionClass}>{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function CtaRow({ actions, align = "left" }: CtaRowProps) {
  return (
    <div className={`mt-8 flex flex-wrap gap-3 ${align === "center" ? "justify-center" : ""}`}>
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
    <section className={`relative flex items-center overflow-hidden bg-[var(--color-surface-dark)] [background-image:var(--gradient-hero)] px-[var(--page-gutter)] pb-[clamp(5rem,9vw,8rem)] pt-[clamp(9rem,14vw,13rem)] text-[var(--color-paper)] max-[809px]:pt-[8rem] ${edgeVisual ? "max-[809px]:pb-[min(48vw,14rem)]" : ""}`.trim()}>
      {photo ? <PhotoBackdrop photo={photo} priority /> : null}
      {edgeVisual ? children : null}
      <GsapRevealRoot
        className={`relative z-[1] ${landingShellClass} grid items-center gap-[clamp(2rem,5vw,5rem)] ${edgeVisual ? "grid-cols-[minmax(0,0.78fr)_minmax(18rem,0.42fr)]" : "grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)]"} max-[809px]:grid-cols-1`}
        duration={0.95}
        stagger={0.1}
        start="top 92%"
        y={28}
      >
        <div className="relative z-[1]">
          <div data-gsap-reveal><Eyebrow invert>{eyebrow}</Eyebrow></div>
          <div data-gsap-reveal><HeroTitle className="max-w-[880px]" title={title} /></div>
          <p data-gsap-reveal className="mt-6 max-w-[760px] text-[clamp(1.05rem,2vw,1.35rem)] font-light leading-[1.55] text-white/75">
            <HeroDescription description={description} />
          </p>
          <div data-gsap-reveal>
          <CtaRow
            actions={[
              { href: primaryHref, label: primaryCta },
              { href: secondaryHref, label: secondaryCta, variant: "darkGhost" },
            ]}
          />
          </div>
        </div>
        {edgeVisual ? (
          <div aria-hidden="true" />
        ) : (
          <div className="relative z-[1] min-w-0 max-[809px]:mt-6" data-gsap-reveal>{children}</div>
        )}
      </GsapRevealRoot>

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

export function HeroShell({
  as: Component = "section",
  children,
  className = "",
  photo,
  photoOpacity,
  photoPosition,
}: HeroShellProps) {
  return (
    <Component
      className={`relative isolate flex min-h-[min(760px,82svh)] items-center overflow-hidden bg-[var(--color-surface-dark)] [background-image:var(--gradient-hero)] px-[var(--page-gutter)] pb-[clamp(4.5rem,8vw,6.5rem)] pt-[clamp(8rem,12vw,11rem)] text-white max-[809px]:min-h-0 max-[809px]:pt-[8rem] ${className}`.trim()}
    >
      {photo ? (
        <PhotoBackdrop
          opacity={photoOpacity}
          photo={photo}
          position={photoPosition}
          priority
        />
      ) : null}
      {children}
    </Component>
  );
}

export function PageHero({
  backgroundVisual,
  children,
  description,
  descriptionClassName = "",
  eyebrow,
  photo,
  photoOpacity,
  photoPosition,
  primaryCta,
  primaryHref,
  secondaryCta,
  secondaryHref,
  sectionClassName = "",
  shellClassName = "",
  title,
  titleClassName = "",
  visualClassName = "",
}: PageHeroProps) {
  const hasActions = primaryCta && primaryHref && secondaryCta && secondaryHref;
  const hasVisual = Boolean(children);

  return (
    <HeroShell
      className={sectionClassName}
      photo={photo}
      photoOpacity={photoOpacity}
      photoPosition={photoPosition}
    >
      {backgroundVisual}
      <GsapRevealRoot
        className={`relative z-[1] mx-auto w-[min(100%,var(--shell-width))] ${
          hasVisual
            ? "grid grid-cols-[minmax(0,1fr)_minmax(18rem,0.58fr)] items-center gap-16 max-[980px]:grid-cols-1"
            : ""
        } ${shellClassName}`.trim()}
        duration={0.95}
        stagger={0.1}
        start="top 92%"
        y={28}
      >
        <div>
          <div data-gsap-reveal>
            <Eyebrow invert>{eyebrow}</Eyebrow>
          </div>
          <div data-gsap-reveal>
            <HeroTitle className={titleClassName} title={title} />
          </div>
          {description ? (
            <p
              className={`mt-6 max-w-[760px] text-[1.2rem] font-light leading-[1.6] text-white/74 max-[809px]:text-[1.05rem] ${descriptionClassName}`.trim()}
              data-gsap-reveal
            >
              {description}
            </p>
          ) : null}
          {hasActions ? (
            <div data-gsap-reveal>
              <CtaRow
                actions={[
                  { href: primaryHref, label: primaryCta },
                  { href: secondaryHref, label: secondaryCta, variant: "darkGhost" },
                ]}
              />
            </div>
          ) : null}
        </div>
        {hasVisual ? (
          <div className={`relative z-[1] min-w-0 ${visualClassName}`.trim()} data-gsap-reveal>
            {children}
          </div>
        ) : null}
      </GsapRevealRoot>
    </HeroShell>
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
    <DarkPanel className="relative overflow-hidden [background:var(--gradient-final-cta)] max-[520px]:rounded-[1.25rem] max-[520px]:p-[1.35rem]">
      <BrandMarkMotif />
      <div className="relative z-[1]">
        <p className={darkEyebrowClass}>{eyebrow}</p>
        <h2 className="m-0 max-w-[900px] text-balance break-words text-[clamp(2.65rem,5.6vw,4.25rem)] leading-[1.01] tracking-[-0.055em] max-[809px]:text-[clamp(2rem,9vw,2.75rem)] max-[520px]:leading-[1.04]">
          {title}
        </h2>
        <p className={`${sectionDescriptionClass} max-w-[680px] text-white/70 max-[520px]:mt-3 max-[520px]:text-[1rem]`}>
          {description}
        </p>
        <div className="mt-8 flex flex-wrap gap-3 max-[520px]:mt-6 max-[520px]:grid max-[520px]:grid-cols-1">
          <Link className={`${buttonClasses.primary} max-[520px]:w-full`} href={primaryHref}>
            {primaryCta}
          </Link>
          <Link className={`${buttonClasses.darkGhost} max-[520px]:w-full`} href={secondaryHref}>
            {secondaryCta}
          </Link>
        </div>
      </div>
    </DarkPanel>
  );
}
