import type { FeaturePillar, HomeStep, UseCaseCard } from "@/content/types";
import { HexIndex } from "./BrandMark";
import { mutedCopyClass } from "./LandingPrimitives";
import { Reveal } from "./Reveal";

/**
 * The four card grids on the marketing pages.
 *
 * They used to carry seven layers of decoration around one heading and one
 * paragraph: a rounded panel, a hairline border, a three-stop gradient fill, a
 * wide soft shadow, a vertical accent bar with a gradient of its own, a
 * circular badge with its own border and shadow, and an icon inside that. Each
 * layer was defensible on its own; together they made every card shout, and
 * the reader's eye had to get past all of it to reach the sentence that
 * actually said something.
 *
 * What is left is the device the numbered grid already used and the rest did
 * not: an index in the Opero hexagon, a rule running out from it, then the
 * words. No fill, no border, no shadow. The four grids now differ only in what
 * they contain, which is the point - they are the same component of the page
 * seen in four places, and they should read that way.
 */

type NumberedPointGridProps = {
  points: string[];
  showSeparator?: boolean;
};

type PillarGridProps = {
  items: FeaturePillar[];
};

type DarkStepGridProps = {
  steps: HomeStep[];
};

type IconTextGridProps = {
  items: UseCaseCard[];
};

/** The rule that runs from the index badge to the edge of the card. */
function CardRule({ invert = false }: { invert?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`h-px flex-1 ${
        invert
          ? "bg-[linear-gradient(90deg,rgba(126,231,255,0.4),rgba(255,255,255,0.12),transparent)]"
          : "bg-[linear-gradient(90deg,rgba(56,182,255,0.35),rgba(11,17,22,0.08),transparent)]"
      }`}
    />
  );
}

/** Index badge plus its rule - the opening line of every card on the site. */
export function CardHead({ index, invert = false }: { index: number; invert?: boolean }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <HexIndex index={index} invert={invert} />
      <CardRule invert={invert} />
    </div>
  );
}

export function NumberedPointGrid({ points, showSeparator = true }: NumberedPointGridProps) {
  return (
    <div className={`relative mt-[clamp(2.1rem,4vw,3.5rem)] grid grid-cols-4 gap-x-8 gap-y-6 pt-[clamp(1.2rem,2.5vw,1.8rem)] max-[980px]:grid-cols-2 max-[809px]:grid-cols-1 ${showSeparator ? "border-t border-[rgba(11,17,22,0.09)]" : ""}`.trim()}>
      {points.map((point, index) => (
        <Reveal className="h-full" delay={index * 110} key={point}>
          <article className="relative h-full min-h-[9.5rem] pr-2 max-[809px]:min-h-0">
            <CardHead index={index} />
            <p className="m-0 max-w-[20rem] text-[clamp(1rem,1.24vw,1.13rem)] font-normal leading-[1.5] tracking-[-0.02em] text-[var(--color-ink-soft)]">
              {point}
            </p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

export function PillarGrid({ items }: PillarGridProps) {
  return (
    <div className="mt-[clamp(2rem,5vw,4rem)] grid grid-cols-2 gap-x-[clamp(2rem,4vw,3.5rem)] gap-y-[clamp(2.2rem,4vw,3rem)] max-[809px]:grid-cols-1">
      {items.map((pillar, index) => (
        <Reveal
          className="h-full"
          from={index % 2 === 0 ? "left" : "right"}
          key={pillar.title}
        >
          <article className="h-full">
            <CardHead index={index} />
            <h3 className="m-0 text-[clamp(1.28rem,1.8vw,1.55rem)] font-medium leading-[1.12] tracking-[-0.03em] text-[var(--color-ink)]">
              {pillar.title}
            </h3>
            <p className={`${mutedCopyClass} mt-3 max-w-[36rem] text-[0.96rem] leading-[1.62]`}>
              {pillar.description}
            </p>
            <ul className="mt-5 flex list-none flex-wrap gap-x-5 gap-y-2 p-0">
              {pillar.capabilities.map((capability) => (
                <li
                  className="text-[0.84rem] font-normal leading-none text-[var(--color-muted)]"
                  key={capability}
                >
                  {capability}
                </li>
              ))}
            </ul>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

export function DarkStepGrid({ steps }: DarkStepGridProps) {
  return (
    <div className="mt-[clamp(2.8rem,5vw,4.2rem)] grid grid-cols-3 gap-x-[clamp(2rem,4vw,3.5rem)] gap-y-[clamp(2.4rem,4vw,3.2rem)] max-[1180px]:grid-cols-2 max-[809px]:grid-cols-1">
      {steps.map((step, index) => (
        <Reveal className="h-full" delay={index * 90} key={step.title}>
          <article className="flex h-full flex-col">
            {/* `step.label` holds the step number, which the badge now carries -
                rendering both printed it twice. */}
            <CardHead index={index} invert />
            <h3 className="m-0 text-[clamp(1.4rem,1.9vw,1.72rem)] font-medium leading-[1.08] tracking-[-0.035em] text-[var(--color-paper)]">
              {step.title}
            </h3>
            <p className="mt-4 max-w-[25rem] text-[1rem] font-light leading-[1.68] text-white/64">
              {step.description}
            </p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

export function IconTextGrid({ items }: IconTextGridProps) {
  return (
    <div className="mt-[clamp(2.4rem,5vw,4rem)] grid grid-cols-2 gap-x-[clamp(2rem,4vw,3.5rem)] gap-y-[clamp(2.2rem,4vw,3rem)] max-[900px]:grid-cols-1">
      {items.map((item, index) => (
        <Reveal
          className="h-full"
          from={index % 2 === 0 ? "left" : "right"}
          key={item.title}
        >
          <article className="h-full">
            <CardHead index={index} />
            <h3 className="m-0 text-[clamp(1.28rem,1.8vw,1.55rem)] font-medium leading-[1.12] tracking-[-0.03em] text-[var(--color-ink)]">
              {item.title}
            </h3>
            <p className={`${mutedCopyClass} mt-3 max-w-[36rem] text-[0.96rem] leading-[1.62]`}>
              {item.description}
            </p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
