import type { ReactNode } from "react";
import { TwoTone } from "@/components/landing/TwoTone";
import { OperoBand } from "@/components/layout/OperoBand";
import { PhotoBackdrop } from "@/components/layout/PhotoBackdrop";
import type { BlogUiContent } from "@/content/types";

/**
 * Shared class idioms for the blog, mirroring the homepage and solutions pages:
 * editorial, bordered, graphite and mist.
 */
export const blogShellClass = "mx-auto w-[min(100%,var(--shell-width))] px-[var(--page-gutter)]";
export const blogBodyClass = "m-0 text-[1.04rem] leading-[1.7] text-[var(--color-muted)]";
export const blogMetaClass = "text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]";
export const blogPrimaryButtonClass = "action action-ink";
/** A list beside the rail. The rail drops under the list once the list would get too narrow. */
export const blogWithRailClass = "grid grid-cols-[minmax(0,1fr)_20rem] items-start gap-x-20 gap-y-24 max-[1280px]:gap-x-14 max-[1100px]:grid-cols-1";
/** The short bar that opens a section: it marks where one starts without ruling the page off. */
export const blogAccentClass = "relative before:absolute before:left-0 before:top-0 before:h-[3px] before:w-9 before:rounded-full before:bg-[var(--color-blue)] before:content-['']";
/** The title row that opens a section of a listing. */
export const blogSectionHeadClass = `${blogAccentClass} flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pt-6`;
export const blogSectionTitleClass = "m-0 text-[1.75rem] leading-[1.15] tracking-[-0.03em] max-[809px]:text-[1.45rem]";
/** The small heading over a list in the rail. */
export const blogRailHeadClass = `${blogAccentClass} m-0 pb-5 pt-5 font-sans text-[0.78rem] font-semibold uppercase tracking-[0.08em]`;

type BlogMastheadProps = {
  title: string;
  description?: string;
  aside?: ReactNode;
};

/**
 * The dark band that names the page. Deliberately short: these pages lead with
 * a list, and the first story should be on screen before anyone scrolls. The
 * top padding clears the fixed site header.
 */
export function BlogMasthead({ title, description, aside }: BlogMastheadProps) {
  return (
    <header className="relative isolate overflow-hidden bg-[var(--color-surface-dark)] [background-image:var(--gradient-hero)] px-[var(--page-gutter)] pb-[3.25rem] pt-[7.25rem] text-white">
      <PhotoBackdrop opacity={0.2} photo="workspace" priority />
      <div className="relative z-[1] mx-auto flex w-[min(100%,var(--shell-width))] flex-wrap items-end justify-between gap-x-16 gap-y-6">
        <h1 className="m-0 max-w-[51.25rem] flex-[999_1_32rem] text-balance text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.04] tracking-[-0.045em]">
          <TwoTone text={title} />
        </h1>
        {description || aside ? (
          <div className="max-w-[28.75rem] flex-[1_1_22rem]">
            {description ? <p className="m-0 text-[1rem] leading-[1.6] text-white/72">{description}</p> : null}
            {aside ? <div className={description ? "mt-5 border-t border-white/[0.12] pt-5" : ""}>{aside}</div> : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}

/** The dark band every listing closes on: the same one the tool pages use. */
export function BlogClosingBand({ ui, ctaHrefs }: { ui: BlogUiContent; ctaHrefs: { primary: string; secondary: string } }) {
  return (
    <div className="mt-24 max-[809px]:mt-16">
      <OperoBand
        body={ui.cta.description}
        id="blog-closing"
        primary={{ label: ui.cta.primaryCta, href: ctaHrefs.primary }}
        secondary={{ label: ui.cta.secondaryCta, href: ctaHrefs.secondary }}
        title={ui.cta.title}
      />
    </div>
  );
}
