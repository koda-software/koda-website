import type { ComponentType, SVGProps } from "react";
import BoxesIcon from "lucide-react/dist/esm/icons/boxes.mjs";
import WorkflowIcon from "lucide-react/dist/esm/icons/workflow.mjs";
import type { FeaturePillar, HomeStep, UseCaseCard } from "@/content/types";
import { mutedCopyClass } from "./LandingPrimitives";
import { Reveal } from "./Reveal";

type LandingIcon = ComponentType<
  SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }
>;

type NumberedPointGridProps = {
  points: string[];
};

type PillarGridProps = {
  icons: LandingIcon[];
  items: FeaturePillar[];
};

type DarkStepGridProps = {
  icons: LandingIcon[];
  steps: HomeStep[];
};

type IconTextGridProps = {
  icons: LandingIcon[];
  items: UseCaseCard[];
};

function iconAt(icons: LandingIcon[], index: number, fallback: LandingIcon) {
  return icons[index] ?? fallback;
}

export function NumberedPointGrid({ points }: NumberedPointGridProps) {
  return (
    <div className="relative mt-[clamp(2.1rem,4vw,3.5rem)] grid grid-cols-4 gap-x-8 gap-y-6 border-t border-[rgba(2,2,13,0.09)] pt-[clamp(1.2rem,2.5vw,1.8rem)] max-[980px]:grid-cols-2 max-[809px]:grid-cols-1">
      {points.map((point, index) => (
        <Reveal className="h-full" delay={index * 110} key={point}>
          <article className="group relative h-full min-h-[9.5rem] pr-2 transition-colors duration-200 max-[809px]:min-h-0">
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[rgba(56,182,255,0.24)] bg-[rgba(56,182,255,0.07)] font-sans text-[0.86rem] font-semibold text-[var(--color-blue)] transition-colors duration-200 group-hover:border-[rgba(56,182,255,0.4)] group-hover:bg-[rgba(56,182,255,0.1)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(56,182,255,0.35),rgba(2,2,13,0.08),transparent)]" />
            </div>
            <div>
              <p className="m-0 max-w-[20rem] text-[clamp(1rem,1.24vw,1.13rem)] font-normal leading-[1.5] tracking-[-0.02em] text-[var(--color-ink-soft)]">
                {point}
              </p>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

/**
 * The hexagon from the Opero mark, normalised to a 24x24 box and carrying the
 * same softened corners: each edge is trimmed back and the vertex drawn as a
 * curve, which is what stops it reading as a plain geometric polygon. Used
 * instead of
 * the decorative gradients these cards used to carry: the shape is the
 * product's own, so it reads as brand rather than as generic ornament.
 */
function Hexagon({
  className,
  filled = false,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M 10.4 2.32 Q 12 1.4 13.6 2.32 L 19.6 5.78 Q 21.2 6.7 21.2 8.55 L 21.2 15.45 Q 21.2 17.3 19.6 18.22 L 13.6 21.68 Q 12 22.6 10.4 21.68 L 4.4 18.22 Q 2.8 17.3 2.8 15.45 L 2.8 8.55 Q 2.8 6.7 4.4 5.78 Z"
        fill={filled ? "currentColor" : "none"}
        stroke={filled ? "none" : "currentColor"}
        strokeWidth={filled ? 0 : 1.35}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PillarGrid({ icons, items }: PillarGridProps) {
  return (
    <div className="mt-[clamp(2rem,5vw,4rem)] grid grid-cols-2 gap-4 max-[809px]:grid-cols-1">
      {items.map((pillar, index) => {
        const PillarIcon = iconAt(icons, index, BoxesIcon);

        return (
          <Reveal
            className="h-full"
            from={index % 2 === 0 ? "left" : "right"}
            key={pillar.title}
          >
            <article className="group relative grid h-full min-h-[15rem] grid-cols-[auto_1fr] gap-5 overflow-hidden rounded-[calc(var(--radius-panel)-8px)] border border-[rgba(2,2,13,0.08)] bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(249,249,249,0.86)_58%,rgba(56, 182, 255,0.045))] p-[clamp(1.1rem,2.6vw,1.6rem)] shadow-[0_18px_54px_rgba(2,2,13,0.055)] transition-[border-color,background] duration-200 before:pointer-events-none before:absolute before:inset-y-5 before:left-0 before:w-1 before:rounded-r-full before:bg-[linear-gradient(180deg,var(--color-blue),rgba(126,231,255,0.5))] hover:border-[rgba(56, 182, 255,0.18)] max-[520px]:grid-cols-1">
              <span
                className="relative z-[1] grid h-14 w-14 place-items-center self-start"
                aria-hidden="true"
              >
                <Hexagon
                  className="absolute inset-0 h-full w-full text-white"
                  filled
                />
                <Hexagon className="absolute inset-0 h-full w-full text-[var(--color-blue)]/[0.22] transition-colors duration-200 group-hover:text-[var(--color-blue)]/[0.45]" />
                <PillarIcon
                  className="relative h-6 w-6 text-[var(--color-blue)]"
                  strokeWidth={1.65}
                />
              </span>
              <div className="relative z-[1] self-center">
                <h3 className="m-0 text-[clamp(1.28rem,1.8vw,1.55rem)] font-medium leading-[1.12] tracking-[-0.03em] text-[var(--color-ink)]">
                  {pillar.title}
                </h3>
                <p
                  className={`${mutedCopyClass} mt-3 max-w-[36rem] text-[0.96rem] leading-[1.62]`}
                >
                  {pillar.description}
                </p>
                <ul className="mt-5 flex list-none flex-wrap gap-2 p-0">
                  {pillar.capabilities.map((capability) => (
                    <li
                      className="rounded-full border border-[rgba(2,2,13,0.1)] px-3 py-2 text-[0.84rem] font-normal leading-none text-[var(--color-ink-soft)]"
                      key={capability}
                    >
                      {capability}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}

export function DarkStepGrid({ icons, steps }: DarkStepGridProps) {
  return (
    <div className="mt-[clamp(2.8rem,5vw,4.2rem)] grid grid-cols-3 gap-5 max-[1180px]:grid-cols-2 max-[809px]:grid-cols-1">
      {steps.map((step, index) => {
        const StepIcon = iconAt(icons, index, WorkflowIcon);

        return (
          <Reveal className="h-full" delay={index * 90} key={step.title}>
            <article className="group relative h-full min-h-[21.5rem] overflow-hidden rounded-[calc(var(--radius-panel)-6px)] border border-white/[0.12] bg-white/[0.055] p-[clamp(1.35rem,2.6vw,2rem)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-[background,border-color] duration-200 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(126,231,255,0.48),transparent)] hover:border-white/[0.18] hover:bg-white/[0.075] max-[809px]:min-h-0">
              <div className="relative z-[1] flex min-h-full flex-col gap-12">
                <div className="flex items-center justify-between gap-4">
                  <span
                    className="flex h-16 w-16 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.07] text-[var(--color-cyan)]/82 transition-colors duration-200 group-hover:text-[var(--color-cyan)]"
                    aria-hidden="true"
                  >
                    <StepIcon className="h-7 w-7" strokeWidth={1.6} />
                  </span>
                  <span
                    className="font-sans text-[0.94rem] font-semibold text-white/38"
                    aria-hidden="true"
                  >
                    {step.label}
                  </span>
                </div>
                <div className="mt-auto">
                  <h3 className="m-0 text-[clamp(1.4rem,1.9vw,1.72rem)] font-medium leading-[1.08] tracking-[-0.035em] text-[var(--color-paper)]">
                    {step.title}
                  </h3>
                  <p className="mt-5 max-w-[25rem] text-[1rem] font-light leading-[1.68] text-white/64">
                    {step.description}
                  </p>
                </div>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}

export function IconTextGrid({ icons, items }: IconTextGridProps) {
  return (
    <div className="mt-[clamp(2.4rem,5vw,4rem)] grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
      {items.map((item, index) => {
        const ItemIcon = iconAt(icons, index, BoxesIcon);

        return (
          <Reveal
            className="h-full"
            from={index % 2 === 0 ? "left" : "right"}
            key={item.title}
          >
            <article className="group relative grid h-full min-h-[13.5rem] grid-cols-[auto_1fr] gap-5 overflow-hidden rounded-[calc(var(--radius-panel)-8px)] border border-[rgba(2,2,13,0.08)] bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(249,249,249,0.86)_58%,rgba(56, 182, 255,0.045))] p-[clamp(1.1rem,2.6vw,1.6rem)] shadow-[0_18px_54px_rgba(2,2,13,0.055)] transition-[border-color,background] duration-200 before:pointer-events-none before:absolute before:inset-y-5 before:left-0 before:w-1 before:rounded-r-full before:bg-[linear-gradient(180deg,var(--color-blue),rgba(126,231,255,0.5))] hover:border-[rgba(56, 182, 255,0.18)] max-[520px]:grid-cols-1">
              <span
                className="relative z-[1] flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(2,2,13,0.08)] bg-white text-[var(--color-blue)] shadow-[0_10px_30px_rgba(56, 182, 255,0.08)] transition-colors duration-200 group-hover:bg-[var(--color-blue)] group-hover:text-white"
                aria-hidden="true"
              >
                <ItemIcon className="h-6 w-6" strokeWidth={1.65} />
              </span>
              <div className="relative z-[1] self-center">
                <h3 className="m-0 text-[clamp(1.28rem,1.8vw,1.55rem)] font-medium leading-[1.12] tracking-[-0.03em] text-[var(--color-ink)]">
                  {item.title}
                </h3>
                <p
                  className={`${mutedCopyClass} mt-3 max-w-[36rem] text-[0.96rem] leading-[1.62]`}
                >
                  {item.description}
                </p>
              </div>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
