import Image from "next/image";
import Link from "next/link";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right.mjs";
import { CardHead, IconTextGrid } from "@/components/landing/LandingCards";
import { FeatureDemo } from "./demos/FeatureDemo";
import { HeroEdgeVisual } from "@/components/landing/HeroDashboardMock";
import { IndexNumber, LandingHero, PageHero } from "@/components/landing/LandingPrimitives";
import type { FeatureBlock, FeaturePagesContent, FeatureShot } from "@/content/types";
import type { Locale } from "@/lib/i18n/config";
import { localizeFeaturePath, type FeatureKey } from "@/lib/i18n/features";
import { TwoTone } from "@/components/landing/TwoTone";

type FeaturePageProps = {
  feature: FeatureKey;
  locale: Locale;
  pages: FeaturePagesContent;
  primaryHref: string;
  secondaryHref: string;
};

const shellClass = "mx-auto w-[min(100%,var(--shell-width))] px-[var(--page-gutter)]";
const sectionClass = `${shellClass} py-[var(--section-y)]`;
const sectionTitleClass = "m-0 max-w-[860px] text-[2.6rem] leading-[1.08] text-[var(--color-ink)] max-[809px]:text-[1.9rem]";
const bodyClass = "m-0 text-[1.04rem] leading-[1.7] text-[var(--color-muted)]";

/**
 * Per-page icon sets. Icons are a presentation concern, so they stay out of the
 * translated content modules; the order matches the `blocks.items` order.
 */
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
};

const pageLayouts: Record<FeatureKey, PageLayout> = {
  processes: { blocks: "steps", intro: "plain", shots: "pair" },
  documents: { blocks: "split", intro: "panel", shots: "alternating" },
  noCode: { blocks: "tiles", intro: "plain", shots: "alternating", shotsFirst: true },
  lowCode: { blocks: "split", intro: "plain", shots: "alternating" },
  reports: { blocks: "grid", intro: "panel", shots: "pair" },
  security: { blocks: "steps", intro: "plain", shots: "alternating" },
  integrations: { blocks: "tiles", intro: "panel", shots: "pair" },
  ai: { blocks: "grid", intro: "plain", shots: "alternating" },
};

/** Numbered rows. Reads as an ordered sequence, which suits process-shaped topics. */
function StepBlocks({ items }: { items: FeatureBlock[] }) {
  return (
    <ol className="mt-10 grid list-none gap-0 border-b border-[rgba(2,2,13,0.12)] p-0">
      {items.map((item, index) => (
        <li
          data-reveal
          className="grid grid-cols-[4rem_minmax(0,0.45fr)_minmax(0,1fr)] gap-8 border-t border-[rgba(2,2,13,0.12)] py-8 max-[900px]:grid-cols-1 max-[900px]:gap-3"
          key={item.title}
        >
          <span className="text-[1.2rem] font-semibold text-[var(--color-blue)]">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="m-0 text-[1.4rem] font-semibold leading-[1.2] text-[var(--color-ink)]">{item.title}</h3>
          <p className={bodyClass}>{item.description}</p>
        </li>
      ))}
    </ol>
  );
}

/** Compact three-column blocks. Suits catalogues of parts. */
function TileBlocks({ items }: { items: FeatureBlock[] }) {
  return (
    <div className="mt-10 grid grid-cols-3 gap-x-[clamp(1.5rem,3vw,2.75rem)] gap-y-[clamp(2rem,3.5vw,2.75rem)] max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
      {items.map((item, index) => (
        <article data-reveal key={item.title}>
          <CardHead index={index} />
          <h3 className="m-0 text-[1.22rem] font-semibold leading-[1.18] text-[var(--color-ink)]">{item.title}</h3>
          <p className={`${bodyClass} mt-3 text-[0.95rem]`}>{item.description}</p>
        </article>
      ))}
    </div>
  );
}

/** Full-width rows. Gives few, meaty items room to breathe. */
function SplitBlocks({ items }: { items: FeatureBlock[] }) {
  return (
    <div className="mt-10 border-b border-[rgba(11,17,22,0.12)]">
      {items.map((item, index) => (
        <article
          data-reveal
          className="grid grid-cols-[auto_minmax(0,0.5fr)_minmax(0,1fr)] items-start gap-8 border-t border-[rgba(11,17,22,0.12)] py-9 max-[900px]:grid-cols-[auto_1fr] max-[900px]:gap-x-5 max-[900px]:gap-y-4"
          key={item.title}
        >
          <IndexNumber className="self-center" index={index} />
          <h3 className="m-0 self-center text-[1.5rem] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--color-ink)] max-[900px]:self-center">
            {item.title}
          </h3>
          <p className={`${bodyClass} max-[900px]:col-span-2`}>{item.description}</p>
        </article>
      ))}
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
        <figcaption className="m-0 text-[clamp(1.05rem,1.6vw,1.32rem)] font-display font-light leading-[1.45] text-[var(--color-ink-soft)]">
          {shot.caption}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="m-0">
      {frame}
      <figcaption
        className={`mt-3 text-[0.92rem] leading-[1.55] ${invert ? "text-white/60" : "text-[var(--color-muted)]"}`}
      >
        {shot.caption}
      </figcaption>
    </figure>
  );
}

export function FeaturePage({ feature, locale, pages, primaryHref, secondaryHref }: FeaturePageProps) {
  const content = pages[feature];
  const layout = pageLayouts[feature];
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
          <p className="m-0 max-w-[52rem] text-[clamp(1.15rem,1.9vw,1.5rem)] font-display font-light leading-[1.55] text-white/80">
            {content.intro.paragraph}
          </p>
        </div>
      </section>
    ) : (
      <section className={sectionClass} key="intro">
        <p className="m-0 max-w-[52rem] text-[clamp(1.15rem,1.9vw,1.5rem)] font-display font-light leading-[1.55] text-[var(--color-ink-soft)]">
          {content.intro.paragraph}
        </p>
      </section>
    );

  const blocksSection = (
    <section className={`${sectionClass} ${layout.intro === "panel" || layout.shotsFirst ? "" : "pt-0"}`} key="blocks">
      <h2 className={sectionTitleClass}><TwoTone text={content.blocks.title} /></h2>
      {layout.blocks === "steps" ? <StepBlocks items={content.blocks.items} /> : null}
      {layout.blocks === "tiles" ? <TileBlocks items={content.blocks.items} /> : null}
      {layout.blocks === "split" ? <SplitBlocks items={content.blocks.items} /> : null}
      {layout.blocks === "grid" ? <IconTextGrid items={content.blocks.items} /> : null}
    </section>
  );

  const shotsSection = content.shots ? (
    <section className={`${sectionClass} ${layout.shotsFirst ? "pt-0" : ""}`} key="shots">
      <h2 className={sectionTitleClass}><TwoTone text={content.shots.title} /></h2>
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

  const heroShot = content.hero.shot;
  const heroVisual = heroShot ? null : content.demo ? <FeatureDemo demo={content.demo} /> : null;
  const heroShellClassName = content.demo
    ? "grid-cols-[minmax(0,0.86fr)_minmax(26rem,1.14fr)] gap-[clamp(2rem,4vw,4rem)]"
    : "";

  return (
    <>
      {heroShot ? (
        <LandingHero
          description={content.hero.description}
          primaryCta={content.hero.primaryCta}
          primaryHref={primaryHref}
          secondaryCta={content.hero.secondaryCta}
          secondaryHref={secondaryHref}
          title={content.hero.title}
          visualMode="edge"
        >
          <HeroEdgeVisual image={heroShot} />
        </LandingHero>
      ) : (
        <PageHero
          description={content.hero.description}
          descriptionClassName="max-w-[720px]"
          photo="operations"
          primaryCta={content.hero.primaryCta}
          primaryHref={primaryHref}
          secondaryCta={content.hero.secondaryCta}
          secondaryHref={secondaryHref}
          shellClassName={heroShellClassName}
          title={content.hero.title}
          titleClassName="max-w-[900px]"
        >
          {heroVisual}
        </PageHero>
      )}

      {heroShot && content.demo ? (
        <section className={`${shellClass} pt-[var(--section-y)]`}>
          <div className="mx-auto max-w-[62rem]">
            <FeatureDemo demo={content.demo} />
          </div>
        </section>
      ) : null}

      {introSection}
      {layout.shotsFirst ? [shotsSection, blocksSection] : [blocksSection, shotsSection]}

      <section className={`${sectionClass} pt-0`}>
        <h2 className={sectionTitleClass}><TwoTone text={content.seoText.title} /></h2>
        <div className="mt-6 grid max-w-[62rem] gap-5">
          {content.seoText.paragraphs.map((paragraph) => (
            <p className={bodyClass} key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className={`${sectionClass} pt-0`}>
        <h2 className={sectionTitleClass}><TwoTone text={content.faq.title} /></h2>
        <div className="mt-8 grid max-w-[52rem] gap-3">
          {content.faq.items.map((item) => (
            <details
              data-reveal
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
        <h2 className="m-0 text-[1.9rem] leading-[1.12] text-[var(--color-ink)]"><TwoTone text={content.related.title} /></h2>
        <div className="mt-8 grid grid-cols-3 gap-4 max-[809px]:grid-cols-1">
          {related.map((item) => (
            <Link
              data-reveal
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
              <span className="text-[0.94rem] leading-[1.6] text-[var(--color-muted)]">{item.description}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={`${sectionClass} pt-0`}>
        <div className="border-y border-[rgba(2,2,13,0.12)] py-[4rem] text-center">
          <h2 className="mx-auto m-0 max-w-[860px] text-[2.7rem] leading-[1.08] text-[var(--color-ink)] max-[809px]:text-[1.9rem]"><TwoTone text={content.finalCta.title} /></h2>
          <p className={`${bodyClass} mx-auto mt-5 max-w-[680px]`}>{content.finalCta.description}</p>
          <div className="mt-8 flex justify-center">
            <Link className="action action-ink" href={primaryHref}>
              {content.finalCta.primaryCta}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
