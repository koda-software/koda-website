import Image from "next/image";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right.mjs";
import BadgeCheckIcon from "lucide-react/dist/esm/icons/badge-check.mjs";
import BarChartIcon from "lucide-react/dist/esm/icons/bar-chart-3.mjs";
import BookMarkedIcon from "lucide-react/dist/esm/icons/book-marked.mjs";
import BoxesIcon from "lucide-react/dist/esm/icons/boxes.mjs";
import Building2Icon from "lucide-react/dist/esm/icons/building-2.mjs";
import ClipboardListIcon from "lucide-react/dist/esm/icons/clipboard-list.mjs";
import CodeIcon from "lucide-react/dist/esm/icons/code.mjs";
import CoinsIcon from "lucide-react/dist/esm/icons/coins.mjs";
import CompassIcon from "lucide-react/dist/esm/icons/compass.mjs";
import DatabaseIcon from "lucide-react/dist/esm/icons/database.mjs";
import FileCheckIcon from "lucide-react/dist/esm/icons/file-check.mjs";
import FileTextIcon from "lucide-react/dist/esm/icons/file-text.mjs";
import HistoryIcon from "lucide-react/dist/esm/icons/history.mjs";
import KeyRoundIcon from "lucide-react/dist/esm/icons/key-round.mjs";
import LayersIcon from "lucide-react/dist/esm/icons/layers.mjs";
import LayoutDashboardIcon from "lucide-react/dist/esm/icons/layout-dashboard.mjs";
import LayoutGridIcon from "lucide-react/dist/esm/icons/layout-grid.mjs";
import LineChartIcon from "lucide-react/dist/esm/icons/line-chart.mjs";
import MailIcon from "lucide-react/dist/esm/icons/mail.mjs";
import MessageSquareIcon from "lucide-react/dist/esm/icons/message-square.mjs";
import NetworkIcon from "lucide-react/dist/esm/icons/network.mjs";
import PlugIcon from "lucide-react/dist/esm/icons/plug.mjs";
import ReceiptIcon from "lucide-react/dist/esm/icons/receipt.mjs";
import ScrollTextIcon from "lucide-react/dist/esm/icons/scroll-text.mjs";
import ShieldCheckIcon from "lucide-react/dist/esm/icons/shield-check.mjs";
import SparklesIcon from "lucide-react/dist/esm/icons/sparkles.mjs";
import SquareKanbanIcon from "lucide-react/dist/esm/icons/square-kanban.mjs";
import UsersIcon from "lucide-react/dist/esm/icons/users.mjs";
import WorkflowIcon from "lucide-react/dist/esm/icons/workflow.mjs";
import ZapIcon from "lucide-react/dist/esm/icons/zap.mjs";
import { IconTextGrid } from "@/components/landing/LandingCards";
import { FeatureDemo } from "./demos/FeatureDemo";
import { HeroTitle } from "@/components/landing/LandingPrimitives";
import type { FeatureBlock, FeaturePagesContent, FeatureShot } from "@/content/types";
import type { Locale } from "@/lib/i18n/config";
import { localizeFeaturePath, type FeatureKey } from "@/lib/i18n/features";

type LandingIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }>;

type FeaturePageProps = {
  feature: FeatureKey;
  locale: Locale;
  pages: FeaturePagesContent;
  primaryHref: string;
  secondaryHref: string;
};

const shellClass = "mx-auto w-[min(100%,var(--shell-width))] px-[var(--page-gutter)]";
const sectionClass = `${shellClass} py-[var(--section-y)]`;
const eyebrowClass = "mb-4 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-blue)]";
const darkEyebrowClass = "mb-4 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-blue-soft)]";
const sectionTitleClass = "m-0 max-w-[860px] text-[2.6rem] leading-[1.08] text-[var(--color-ink)] max-[809px]:text-[1.9rem]";
const bodyClass = "m-0 text-[1.04rem] font-light leading-[1.7] text-[var(--color-muted)]";
const buttonClass = "inline-flex min-h-11 items-center justify-center rounded-[var(--radius-button)] px-4 py-3 font-medium transition-colors";

/**
 * Per-page icon sets. Icons are a presentation concern, so they stay out of the
 * translated content modules; the order matches the `blocks.items` order.
 */
const blockIcons: Record<FeatureKey, LandingIcon[]> = {
  processes: [WorkflowIcon, SquareKanbanIcon, BoxesIcon, ClipboardListIcon, HistoryIcon],
  documents: [FileTextIcon, WorkflowIcon, ClipboardListIcon, LayersIcon, FileCheckIcon],
  noCode: [BoxesIcon, LayersIcon, LayoutGridIcon, CompassIcon, BookMarkedIcon, WorkflowIcon],
  lowCode: [ZapIcon, CodeIcon, DatabaseIcon],
  reports: [BarChartIcon, LineChartIcon, LayoutDashboardIcon, DatabaseIcon],
  security: [UsersIcon, ShieldCheckIcon, Building2Icon, KeyRoundIcon, ScrollTextIcon],
  integrations: [ReceiptIcon, MailIcon, CoinsIcon, BadgeCheckIcon, PlugIcon],
  ai: [SparklesIcon, MessageSquareIcon, NetworkIcon],
};

/**
 * The eight pages share a hero and a related-pages block; everything between
 * them varies, so the section deals with a different rhythm on each page rather
 * than eight identical templates. All variants reuse the same type scale,
 * spacing tokens and borders, so the pages stay one family.
 */
type PageLayout = {
  blocks: "grid" | "steps" | "tiles" | "split";
  intro: "plain" | "panel";
  shots: "pair" | "alternating";
  /** Whether the screenshot band comes before the feature blocks. */
  shotsFirst?: boolean;
  /**
   * The hero shot sits in a side column next to the copy. "wide" gives that
   * column more of the row (and shrinks the copy column to match) so a wide,
   * short screenshot - like a rule editor toolbar - renders bigger and taller
   * instead of getting squeezed down to the point its text is unreadable.
   */
  heroImageColumn?: "normal" | "wide";
};

const pageLayouts: Record<FeatureKey, PageLayout> = {
  processes: { blocks: "steps", intro: "plain", shots: "pair" },
  documents: { blocks: "split", intro: "panel", shots: "alternating" },
  noCode: { blocks: "tiles", intro: "plain", shots: "alternating", shotsFirst: true },
  lowCode: { blocks: "split", intro: "plain", shots: "alternating", heroImageColumn: "wide" },
  reports: { blocks: "grid", intro: "panel", shots: "pair" },
  security: { blocks: "steps", intro: "plain", shots: "alternating" },
  integrations: { blocks: "tiles", intro: "panel", shots: "pair" },
  ai: { blocks: "grid", intro: "plain", shots: "alternating" },
};

function iconAt(icons: LandingIcon[], index: number) {
  return icons[index] ?? icons[icons.length - 1];
}

/** Numbered rows. Reads as an ordered sequence, which suits process-shaped topics. */
function StepBlocks({ items }: { items: FeatureBlock[] }) {
  return (
    <ol className="mt-10 grid list-none gap-0 border-b border-[rgba(2,2,13,0.12)] p-0">
      {items.map((item, index) => (
        <li
          className="grid grid-cols-[4rem_minmax(0,0.45fr)_minmax(0,1fr)] gap-8 border-t border-[rgba(2,2,13,0.12)] py-8 max-[900px]:grid-cols-1 max-[900px]:gap-3"
          key={item.title}
        >
          <span className="text-[1.2rem] font-semibold text-[var(--color-blue)]">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="m-0 text-[1.4rem] font-medium leading-[1.2] text-[var(--color-ink)]">{item.title}</h3>
          <p className={bodyClass}>{item.description}</p>
        </li>
      ))}
    </ol>
  );
}

/** Compact three-column cards with the icon on top. Suits catalogues of parts. */
function TileBlocks({ icons, items }: { icons: LandingIcon[]; items: FeatureBlock[] }) {
  return (
    <div className="mt-10 grid grid-cols-3 gap-4 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
      {items.map((item, index) => {
        const Icon = iconAt(icons, index);

        return (
          <article
            className="flex flex-col gap-4 rounded-[calc(var(--radius-panel)-8px)] border border-[rgba(2,2,13,0.08)] bg-[linear-gradient(160deg,rgba(255,255,255,1),rgba(249,249,249,0.9)_60%,rgba(56, 182, 255,0.05))] p-6 transition-colors duration-200 hover:border-[rgba(56, 182, 255,0.18)]"
            key={item.title}
          >
            <span
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-blue)]/[0.08] text-[var(--color-blue)]"
              aria-hidden="true"
            >
              <Icon className="h-6 w-6" strokeWidth={1.6} />
            </span>
            <h3 className="m-0 text-[1.22rem] font-medium leading-[1.18] text-[var(--color-ink)]">{item.title}</h3>
            <p className={`${bodyClass} text-[0.95rem]`}>{item.description}</p>
          </article>
        );
      })}
    </div>
  );
}

/** Full-width rows with a large icon. Gives few, meaty items room to breathe. */
function SplitBlocks({ icons, items }: { icons: LandingIcon[]; items: FeatureBlock[] }) {
  return (
    <div className="mt-10 border-b border-[rgba(2,2,13,0.12)]">
      {items.map((item, index) => {
        const Icon = iconAt(icons, index);

        return (
          <article
            className="grid grid-cols-[auto_minmax(0,0.5fr)_minmax(0,1fr)] items-start gap-8 border-t border-[rgba(2,2,13,0.12)] py-9 max-[900px]:grid-cols-[auto_1fr] max-[900px]:gap-x-5 max-[900px]:gap-y-4"
            key={item.title}
          >
            <span className="text-[var(--color-blue)]/[0.75]" aria-hidden="true">
              <Icon className="h-11 w-11" strokeWidth={1.3} />
            </span>
            <h3 className="m-0 self-center text-[1.5rem] font-medium leading-[1.15] tracking-[-0.02em] text-[var(--color-ink)] max-[900px]:self-center">
              {item.title}
            </h3>
            <p className={`${bodyClass} max-[900px]:col-span-2`}>{item.description}</p>
          </article>
        );
      })}
    </div>
  );
}

/**
 * A real, reviewed product screenshot, rendered at its own intrinsic aspect
 * ratio instead of a shared shape - a wide dashboard and a tall form each keep
 * their real proportions rather than getting cropped to fit a fixed frame.
 * Passing `width`/`height` to next/image lets the browser reserve the correct
 * space up front, so there is still no layout shift. There is no placeholder
 * variant - a page simply omits this component (and the section around it)
 * until a screenshot exists.
 */
function ShotFrame({
  beside = false,
  invert = false,
  priority = false,
  reverse = false,
  shot,
}: {
  /** Places the caption alongside the frame instead of underneath it. */
  beside?: boolean;
  /** Lightens the caption text for use on the dark hero background. */
  invert?: boolean;
  /** Set for the hero shot: it is very likely the page's LCP element. */
  priority?: boolean;
  reverse?: boolean;
  shot: FeatureShot;
}) {
  const frame = (
    <Image
      alt={shot.alt}
      className={`h-auto w-full rounded-[calc(var(--radius-panel)-8px)] border ${invert ? "border-white/[0.14]" : "border-[rgba(2,2,13,0.1)]"}`}
      height={shot.height}
      priority={priority}
      sizes="(max-width: 809px) 100vw, 50vw"
      src={shot.src}
      width={shot.width}
    />
  );

  if (beside) {
    return (
      <figure className="m-0 grid grid-cols-[minmax(0,1fr)_minmax(0,0.5fr)] items-center gap-[clamp(1.5rem,4vw,3.5rem)] max-[809px]:grid-cols-1 max-[809px]:gap-4">
        <div className={reverse ? "max-[809px]:order-none min-[810px]:order-2" : ""}>{frame}</div>
        <figcaption className="m-0 text-[clamp(1.05rem,1.6vw,1.32rem)] font-light leading-[1.45] text-[var(--color-ink-soft)]">
          {shot.caption}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="m-0">
      {frame}
      <figcaption
        className={`mt-3 text-[0.92rem] font-light leading-[1.55] ${invert ? "text-white/60" : "text-[var(--color-muted)]"}`}
      >
        {shot.caption}
      </figcaption>
    </figure>
  );
}

export function FeaturePage({ feature, locale, pages, primaryHref, secondaryHref }: FeaturePageProps) {
  const content = pages[feature];
  const layout = pageLayouts[feature];
  const icons = blockIcons[feature];
  const related = content.related.items.map((key) => ({
    key,
    href: localizeFeaturePath(locale, key),
    label: pages[key].navLabel,
    description: pages[key].hero.description,
  }));

  const introSection =
    layout.intro === "panel" ? (
      <section className={sectionClass} key="intro">
        <div className="rounded-[var(--radius-panel)] [background:var(--gradient-technical)] p-[clamp(1.5rem,4vw,3.5rem)] text-white">
          <p className={darkEyebrowClass}>{content.intro.eyebrow}</p>
          <p className="m-0 max-w-[52rem] text-[clamp(1.15rem,1.9vw,1.5rem)] font-light leading-[1.55] text-white/80">
            {content.intro.paragraph}
          </p>
        </div>
      </section>
    ) : (
      <section
        className={`${sectionClass} grid grid-cols-[minmax(0,0.4fr)_minmax(0,1fr)] gap-12 max-[980px]:grid-cols-1 max-[980px]:gap-5`}
        key="intro"
      >
        <p className={eyebrowClass}>{content.intro.eyebrow}</p>
        <p className="m-0 max-w-[52rem] text-[clamp(1.15rem,1.9vw,1.5rem)] font-light leading-[1.55] text-[var(--color-ink-soft)]">
          {content.intro.paragraph}
        </p>
      </section>
    );

  const blocksSection = (
    <section className={`${sectionClass} ${layout.intro === "panel" || layout.shotsFirst ? "" : "pt-0"}`} key="blocks">
      <p className={eyebrowClass}>{content.blocks.eyebrow}</p>
      <h2 className={sectionTitleClass}>{content.blocks.title}</h2>
      {layout.blocks === "steps" ? <StepBlocks items={content.blocks.items} /> : null}
      {layout.blocks === "tiles" ? <TileBlocks icons={icons} items={content.blocks.items} /> : null}
      {layout.blocks === "split" ? <SplitBlocks icons={icons} items={content.blocks.items} /> : null}
      {layout.blocks === "grid" ? <IconTextGrid icons={icons} items={content.blocks.items} /> : null}
    </section>
  );

  const shotsSection = content.shots ? (
    <section className={`${sectionClass} ${layout.shotsFirst ? "pt-0" : ""}`} key="shots">
      <p className={eyebrowClass}>{content.shots.eyebrow}</p>
      <h2 className={sectionTitleClass}>{content.shots.title}</h2>
      {layout.shots === "alternating" ? (
        <div className="mt-10 grid gap-[clamp(2.5rem,5vw,4rem)]">
          {content.shots.items.map((shot, index) => (
            <ShotFrame beside key={shot.caption} reverse={index % 2 === 1} shot={shot} />
          ))}
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-6 max-[809px]:grid-cols-1">
          {content.shots.items.map((shot) => (
            <ShotFrame key={shot.caption} shot={shot} />
          ))}
        </div>
      )}
    </section>
  ) : null;

  const heroCopy = (
    <div>
      <p className={darkEyebrowClass}>{content.hero.eyebrow}</p>
      <HeroTitle className="max-w-[900px]" title={content.hero.title} />
      <p className="mt-6 max-w-[720px] text-[1.2rem] font-light leading-[1.6] text-white/74 max-[809px]:text-[1.05rem]">
        {content.hero.description}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link className={`${buttonClass} bg-[image:var(--gradient-cta)] text-white`} href={primaryHref}>
          {content.hero.primaryCta}
        </Link>
        <Link
          className={`${buttonClass} border border-white/[0.18] bg-white/[0.08] text-white hover:bg-white/[0.12]`}
          href={secondaryHref}
        >
          {content.hero.secondaryCta}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <section className="bg-[#000407] [background-image:var(--gradient-hero)] px-[var(--page-gutter)] pb-[5.5rem] pt-[10rem] text-white max-[809px]:pt-28">
        {content.demo ? (
          /*
           * The demo sits beside the headline, the way the home and Opero
           * banners do. It takes the larger column because it is a fixed-pixel
           * canvas scaled to fit: any width the copy does not need goes
           * straight into how legible the mock UI is. Below 810px the demo
           * hides itself and the grid collapses to the copy alone.
           */
          <div
            className={`mx-auto grid w-[min(100%,var(--shell-width))] items-center gap-[clamp(2rem,4vw,4rem)] grid-cols-[minmax(0,0.86fr)_minmax(26rem,1.14fr)] max-[980px]:grid-cols-1`}
          >
            {heroCopy}
            <FeatureDemo demo={content.demo} />
          </div>
        ) : content.hero.shot ? (
          <div
            className={`mx-auto grid w-[min(100%,var(--shell-width))] items-center gap-16 max-[980px]:grid-cols-1 ${
              layout.heroImageColumn === "wide"
                ? "grid-cols-[minmax(0,0.8fr)_minmax(26rem,1.2fr)]"
                : "grid-cols-[minmax(0,1fr)_minmax(22rem,0.86fr)]"
            }`}
          >
            {heroCopy}
            <ShotFrame invert priority shot={content.hero.shot} />
          </div>
        ) : (
          <div className="mx-auto w-[min(100%,var(--shell-width))]">{heroCopy}</div>
        )}
      </section>

      {introSection}
      {layout.shotsFirst ? [shotsSection, blocksSection] : [blocksSection, shotsSection]}

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

      <section className={`${sectionClass} pt-0`}>
        <p className={eyebrowClass}>{content.related.eyebrow}</p>
        <h2 className="m-0 text-[1.9rem] leading-[1.12] text-[var(--color-ink)]">{content.related.title}</h2>
        <div className="mt-8 grid grid-cols-3 gap-4 max-[809px]:grid-cols-1">
          {related.map((item) => (
            <Link
              className="group grid gap-3 rounded-[calc(var(--radius-panel)-8px)] border border-[rgba(2,2,13,0.1)] bg-[var(--color-paper)] p-6 transition-colors hover:border-[rgba(56, 182, 255,0.24)]"
              href={item.href}
              key={item.key}
            >
              <span className="flex items-center justify-between gap-3 text-[1.15rem] font-medium leading-[1.2] text-[var(--color-ink)]">
                {item.label}
                <ArrowRightIcon
                  className="h-5 w-5 shrink-0 text-[var(--color-blue)] transition-transform duration-200 group-hover:translate-x-1"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
              </span>
              <span className="text-[0.94rem] font-light leading-[1.6] text-[var(--color-muted)]">{item.description}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={`${sectionClass} pt-0`}>
        <div className="border-y border-[rgba(2,2,13,0.12)] py-[4rem] text-center">
          <p className={eyebrowClass}>{content.finalCta.eyebrow}</p>
          <h2 className="mx-auto m-0 max-w-[860px] text-[2.7rem] leading-[1.08] text-[var(--color-ink)] max-[809px]:text-[1.9rem]">
            {content.finalCta.title}
          </h2>
          <p className={`${bodyClass} mx-auto mt-5 max-w-[680px]`}>{content.finalCta.description}</p>
          <div className="mt-8 flex justify-center">
            <Link className={`${buttonClass} bg-[image:var(--gradient-cta)] text-white`} href={primaryHref}>
              {content.finalCta.primaryCta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
