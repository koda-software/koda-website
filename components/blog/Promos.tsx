import Image from "next/image";
import Link from "next/link";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right.mjs";
import CalculatorIcon from "lucide-react/dist/esm/icons/calculator.mjs";
import type { BlogUiContent, ShellContent } from "@/content/types";
import { fillTemplate } from "@/lib/blog/format";
import type { FeaturePromo, ToolPromo } from "@/lib/blog/promos";
import { Pinned } from "./Pinned";
import { blogRailHeadClass } from "./primitives";

/**
 * The blog's internal ads. Each is an `<aside>` with a visible label saying what
 * it is, and none uses a heading element: a promo that claimed an h2 or h3
 * would put "Free tool" into the article's outline, between its real sections.
 *
 * What a slot shows is chosen in lib/blog/promos.ts, once per deployment.
 */

type Cta = { primary: string; secondary: string };

const labelClass = "m-0 text-[0.72rem] font-semibold uppercase tracking-[0.08em]";
const promoTitleClass = "m-0 font-display font-semibold tracking-[-0.02em]";
const darkPanelClass = "[background:var(--gradient-technical)] text-white";
const textLinkClass =
  "group inline-flex min-h-11 items-center gap-2 text-[0.92rem] font-semibold text-[var(--color-blue)] transition-colors hover:text-[var(--color-blue-deep)]";

function Arrow({ className = "" }: { className?: string }) {
  return <ArrowRightIcon aria-hidden="true" className={`h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 ${className}`} strokeWidth={2} />;
}

function ToolIcon({ size }: { size: "lg" | "md" | "sm" }) {
  const frame = { lg: "h-14 w-14 rounded-[14px]", md: "h-11 w-11 rounded-[12px]", sm: "h-10 w-10 rounded-[10px]" }[size];

  return (
    <span aria-hidden="true" className={`inline-flex shrink-0 items-center justify-center bg-[var(--color-mist)] text-[var(--color-ink)] ${frame}`}>
      <CalculatorIcon className={size === "lg" ? "h-6 w-6" : "h-5 w-5"} strokeWidth={1.6} />
    </span>
  );
}

/** The two calls to action on a dark panel. */
function CtaActions({ ui, ctaHrefs, className = "" }: { ui: BlogUiContent; ctaHrefs: Cta; className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`.trim()}>
      <Link className="action action-mist" href={ctaHrefs.primary}>
        {ui.cta.primaryCta}
      </Link>
      <Link className="action action-line-dark group" href={ctaHrefs.secondary}>
        {ui.cta.secondaryCta}
        <Arrow />
      </Link>
    </div>
  );
}

/** An Opero feature record has its own link text; a feature page is linked by name. */
function featureLinkLabel(feature: FeaturePromo, ui: BlogUiContent) {
  return feature.linkLabel ?? fillTemplate(ui.promos.featureLink, { name: feature.name });
}

function FeatureShot({ feature, ui, className }: { feature: FeaturePromo; ui: BlogUiContent; className: string }) {
  if (!feature.image) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- a cropped product screenshot; next/image optimization is off site-wide
    <img
      alt={feature.imageAlt?.trim() || fillTemplate(ui.promos.productAlt, { name: feature.name })}
      className={`block aspect-[16/10] w-full object-cover object-left-top ${className}`}
      decoding="async"
      height={400}
      loading="lazy"
      src={feature.image}
      width={640}
    />
  );
}

/** Full-width Opero banner: the first thing under the lead on the index. */
export function PromoBanner({ ui, shell, ctaHrefs }: { ui: BlogUiContent; shell: ShellContent; ctaHrefs: Cta }) {
  return (
    <aside aria-label={ui.promos.product} className={`flex flex-wrap items-center justify-between gap-x-12 gap-y-6 rounded-[var(--radius-panel)] px-9 py-7 max-[809px]:px-6 ${darkPanelClass}`}>
      <div className="flex min-w-0 flex-[999_1_26rem] flex-wrap items-center gap-x-9 gap-y-5">
        <Image alt="Opero" className="h-[34px] w-auto" height={224} src="/branding/opero-logo-white.svg" width={739} />
        <div className="min-w-0 flex-[1_1_20rem]">
          <p className={`${labelClass} text-white/62`}>{ui.promos.product}</p>
          <p className={`${promoTitleClass} mt-2 text-[1.35rem] leading-[1.25]`}>{ui.cta.title}</p>
          <p className="m-0 mt-1.5 text-[0.98rem] leading-[1.55] text-[var(--color-muted-light)]">{shell.footer.talkBody}</p>
        </div>
      </div>
      <CtaActions ctaHrefs={ctaHrefs} ui={ui} />
    </aside>
  );
}

/** The rail's product card: one Opero feature, with the screenshot its own page opens on. */
export function FeatureCard({ feature, ui, ctaHrefs }: { feature: FeaturePromo; ui: BlogUiContent; ctaHrefs: Cta }) {
  return (
    <aside aria-label={ui.promos.product} className={`overflow-hidden rounded-[var(--radius-card)] ${darkPanelClass}`}>
      <div className="px-5 pt-5">
        <FeatureShot className="rounded-t-[10px]" feature={feature} ui={ui} />
      </div>
      <div className="border-t border-white/10 p-6">
        <p className={`${labelClass} text-white/62`}>{ui.promos.product}</p>
        <p className={`${promoTitleClass} mt-3 text-[1.3rem] leading-[1.2]`}>{feature.name}</p>
        <p className="m-0 mt-2.5 line-clamp-4 text-[0.96rem] leading-[1.55] text-[var(--color-muted-light)]">{feature.description}</p>
        <Link className="action action-mist mt-5 min-h-12 w-full" href={ctaHrefs.primary}>
          {ui.cta.primaryCta}
        </Link>
        <Link className="group mt-1.5 flex min-h-11 items-center justify-center gap-2 text-[0.92rem] font-medium text-[var(--color-mist)]" href={feature.href}>
          {featureLinkLabel(feature, ui)}
          <Arrow className="text-[var(--color-blue-soft)]" />
        </Link>
      </div>
    </aside>
  );
}

/** One free tool, across the index's main column. */
export function ToolBanner({ tool, ui, toolsHref, toolCount }: { tool: ToolPromo; ui: BlogUiContent; toolsHref: string; toolCount: number }) {
  return (
    <aside aria-label={ui.promos.freeTool} className="flex flex-wrap items-center gap-x-7 gap-y-6 rounded-[var(--radius-card)] border border-[rgba(11,17,22,0.1)] bg-[var(--color-paper)] px-8 py-7 max-[809px]:px-6">
      <ToolIcon size="lg" />
      <div className="min-w-0 flex-[999_1_20rem]">
        <p className={`${labelClass} text-[var(--color-blue)]`}>{ui.promos.freeTool}</p>
        <p className={`${promoTitleClass} mt-2 text-[1.3rem] leading-[1.2]`}>{tool.name}</p>
        <p className="m-0 mt-2 max-w-[38.75rem] text-[0.98rem] leading-[1.6] text-[var(--color-muted)]">{tool.description}</p>
      </div>
      <div className="flex flex-col items-start gap-1">
        <Link className="action action-ink" href={tool.href}>
          {ui.promos.openTool}
        </Link>
        <Link className={textLinkClass} href={toolsHref}>
          {fillTemplate(ui.hub.allTools, { count: toolCount })}
        </Link>
      </div>
    </aside>
  );
}

/** One free tool, sized for the rail. */
export function ToolCard({ tool, ui }: { tool: ToolPromo; ui: BlogUiContent }) {
  return (
    <aside aria-label={ui.promos.freeTool} className="rounded-[var(--radius-card)] border border-[rgba(11,17,22,0.1)] bg-[var(--color-paper)] p-6">
      <div className="flex items-center gap-3.5">
        <ToolIcon size="md" />
        <div className="min-w-0">
          <p className={`${labelClass} text-[var(--color-blue)]`}>{ui.promos.freeTool}</p>
          <p className={`${promoTitleClass} mt-1 text-[1.1rem] leading-[1.25]`}>{tool.name}</p>
        </div>
      </div>
      <p className="m-0 mt-3.5 text-[0.95rem] leading-[1.6] text-[var(--color-muted)]">{tool.description}</p>
      <Link className={`${textLinkClass} mt-1.5`} href={tool.href}>
        {ui.promos.openTool}
        <Arrow />
      </Link>
    </aside>
  );
}

/** A short list of tools for the rail, closing on a link to all of them. */
export function ToolList({ tools, ui, toolsHref, toolCount, headingId }: { tools: ToolPromo[]; ui: BlogUiContent; toolsHref: string; toolCount: number; headingId: string }) {
  if (tools.length === 0) return null;

  return (
    <section aria-labelledby={headingId}>
      <h2 className={blogRailHeadClass} id={headingId}>
        {ui.hub.freeTools}
      </h2>
      <ul className="m-0 list-none p-0">
        {tools.map((tool) => (
          <li className="py-3.5 first:pt-0" key={tool.key}>
            <Link className="group flex items-center gap-3.5" href={tool.href}>
              <ToolIcon size="sm" />
              <span className="min-w-0">
                <span className="block text-[0.98rem] font-semibold leading-[1.3] transition-colors group-hover:text-[var(--color-blue)]">{tool.name}</span>
                <span className="block text-[0.85rem] leading-[1.4] text-[var(--color-muted)]">{tool.description}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link className={`${textLinkClass} mt-2`} href={toolsHref}>
        {fillTemplate(ui.hub.allTools, { count: toolCount })}
        <Arrow />
      </Link>
    </section>
  );
}

/** The last thing in the rail. It stays in view while the rest of the page scrolls past. */
export function DemoCard({ ui, shell, ctaHrefs }: { ui: BlogUiContent; shell: ShellContent; ctaHrefs: Cta }) {
  const { footer } = shell;

  return (
    <Pinned>
      <aside aria-label={ui.cta.primaryCta} className="rounded-[var(--radius-card)] border border-[rgba(11,17,22,0.1)] bg-[var(--color-paper)] p-6">
        <p className={`${labelClass} text-[var(--color-muted)]`}>{footer.reachHeading}</p>
        <p className="m-0 mt-2.5 font-display text-[1.1rem] font-medium leading-[1.4] tracking-[-0.015em]">{footer.talkBody}</p>
        <Link className="action action-ink mt-[1.125rem] min-h-12 w-full" href={ctaHrefs.primary}>
          {ui.cta.primaryCta}
        </Link>
      </aside>
    </Pinned>
  );
}

/** The card inside an article's text: a feature and its screenshot, in the reading column. */
export function InlineFeature({ feature, ui }: { feature: FeaturePromo; ui: BlogUiContent }) {
  return (
    <aside aria-label={ui.promos.inOpero} className="my-10 flex flex-wrap items-center gap-x-7 gap-y-5 rounded-[var(--radius-card)] border border-[rgba(11,17,22,0.1)] bg-[var(--color-paper)] p-6">
      <div className="min-w-0 flex-[999_1_18rem]">
        <p className={`${labelClass} text-[var(--color-blue)]`}>{ui.promos.inOpero}</p>
        <p className={`${promoTitleClass} mt-2 text-[1.2rem] leading-[1.25]`}>{feature.name}</p>
        <p className="m-0 mt-2 line-clamp-3 text-[0.98rem] leading-[1.6] text-[var(--color-muted)]">{feature.description}</p>
        <Link className={`${textLinkClass} mt-1`} href={feature.href}>
          {featureLinkLabel(feature, ui)}
          <Arrow />
        </Link>
      </div>
      <FeatureShot className="max-w-[17.5rem] flex-[1_1_13.75rem] rounded-[10px] shadow-[0_0_0_1px_rgba(11,17,22,0.1)]" feature={feature} ui={ui} />
    </aside>
  );
}

/** The dark panel that closes an article, in the reading column. */
export function ArticleCta({ ui, ctaHrefs }: { ui: BlogUiContent; ctaHrefs: Cta }) {
  return (
    <aside aria-label={ui.cta.primaryCta} className={`mt-12 rounded-[var(--radius-panel)] p-10 max-[809px]:p-6 ${darkPanelClass}`}>
      <Image alt="Opero" className="h-7 w-auto" height={224} src="/branding/opero-logo-white.svg" width={739} />
      <p className={`${promoTitleClass} mt-5 text-[1.7rem] leading-[1.15] tracking-[-0.03em] max-[809px]:text-[1.4rem]`}>{ui.cta.title}</p>
      <p className="m-0 mt-3.5 max-w-[35rem] text-[1.04rem] leading-[1.65] text-[var(--color-muted-light)]">{ui.cta.description}</p>
      <CtaActions className="mt-6" ctaHrefs={ctaHrefs} ui={ui} />
    </aside>
  );
}
