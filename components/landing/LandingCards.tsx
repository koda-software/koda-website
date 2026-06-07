import type { ComponentType, SVGProps } from "react";
import BoxesIcon from "lucide-react/dist/esm/icons/boxes.mjs";
import WorkflowIcon from "lucide-react/dist/esm/icons/workflow.mjs";
import type { FeaturePillar, HomeStep, UseCaseCard } from "@/content/types";
import { mutedCopyClass } from "./LandingPrimitives";

type LandingIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number }>;

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
    <div className="relative mt-[clamp(2.4rem,5vw,4.8rem)] grid grid-cols-4 gap-4 max-[809px]:grid-cols-1">
      {points.map((point, index) => (
        <article
          className="group relative min-h-[18rem] overflow-hidden rounded-[var(--radius-card)] bg-[linear-gradient(145deg,rgba(255,255,255,0.96),rgba(249,249,249,0.82)_58%,rgba(0,103,244,0.06))] px-[clamp(1.05rem,2vw,1.55rem)] py-[clamp(1.4rem,3vw,2rem)] ring-1 ring-black/[0.055] transition-colors duration-200 hover:bg-[linear-gradient(145deg,rgba(255,255,255,1),rgba(249,249,249,0.9)_58%,rgba(0,103,244,0.085))] even:translate-y-8 max-[809px]:min-h-0 max-[809px]:translate-y-0 max-[809px]:py-7"
          key={point}
        >
          <span
            className="pointer-events-none absolute -right-3 -top-3 font-sans text-[clamp(5.8rem,9vw,8.8rem)] font-semibold leading-none tracking-[-0.13em] text-[var(--color-blue)]/[0.11] transition-colors duration-200 group-hover:text-[var(--color-blue)]/[0.17] max-[809px]:text-[6rem]"
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="relative z-[1] flex min-h-full flex-col justify-end">
            <p className="m-0 max-w-[19rem] text-[clamp(1.06rem,1.45vw,1.26rem)] font-normal leading-[1.42] tracking-[-0.025em] text-[var(--color-ink-soft)]">
              {point}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function PillarGrid({ icons, items }: PillarGridProps) {
  return (
    <div className="mt-[clamp(2rem,5vw,4rem)] grid grid-cols-2 gap-4 max-[809px]:grid-cols-1">
      {items.map((pillar, index) => {
        const PillarIcon = iconAt(icons, index, BoxesIcon);

        return (
          <article
            className="group relative min-h-[21rem] overflow-hidden rounded-[var(--radius-panel)] border border-[rgba(2,2,13,0.08)] bg-[linear-gradient(145deg,rgba(255,255,255,1),rgba(249,249,249,0.86)_56%,rgba(0,103,244,0.075))] p-[clamp(1.2rem,3vw,1.85rem)] transition-colors duration-200 before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-[linear-gradient(90deg,var(--color-blue),var(--color-cyan),transparent_76%)] hover:border-[rgba(0,103,244,0.18)] max-[809px]:min-h-0"
            key={pillar.title}
          >
            <div className="relative z-[1] flex min-h-full flex-col">
              <div className="mb-10 flex items-start justify-between gap-4 max-[809px]:mb-8">
                <span className="text-[var(--color-blue)]/[0.82] transition-colors duration-200 group-hover:text-[var(--color-blue)]" aria-hidden="true">
                  <PillarIcon className="h-[clamp(4.2rem,6.8vw,6rem)] w-[clamp(4.2rem,6.8vw,6rem)]" strokeWidth={1.35} />
                </span>
                <span className="mt-1 h-2 w-2 rounded-full bg-[var(--color-blue)]/55" aria-hidden="true" />
              </div>
              <h3 className="m-0 max-w-[30rem] text-[clamp(1.45rem,2.35vw,2rem)] leading-[1.02] tracking-[-0.045em] text-[var(--color-ink)]">{pillar.title}</h3>
              <p className={`${mutedCopyClass} mt-4 max-w-[34rem]`}>{pillar.description}</p>
              <ul className="mt-auto flex list-none flex-wrap gap-2 p-0 pt-8">
                {pillar.capabilities.map((capability) => (
                  <li className="rounded-full bg-[var(--color-ink)]/[0.045] px-3 py-2 text-[0.84rem] font-normal leading-none text-[var(--color-ink-soft)]" key={capability}>
                    {capability}
                  </li>
                ))}
              </ul>
            </div>
          </article>
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
          <article
            className="group relative min-h-[21.5rem] overflow-hidden rounded-[calc(var(--radius-panel)-6px)] border border-white/[0.12] bg-white/[0.055] p-[clamp(1.35rem,2.6vw,2rem)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-[background,border-color] duration-200 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(126,231,255,0.48),transparent)] hover:border-white/[0.18] hover:bg-white/[0.075] max-[809px]:min-h-0"
            key={step.label}
          >
            <div className="relative z-[1] flex min-h-full flex-col gap-12">
              <div className="flex items-center justify-between gap-4">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.07] text-[var(--color-cyan)]/82 transition-colors duration-200 group-hover:text-[var(--color-cyan)]" aria-hidden="true">
                  <StepIcon className="h-7 w-7" strokeWidth={1.6} />
                </span>
                <span className="font-sans text-[0.94rem] font-semibold text-white/38" aria-hidden="true">
                  {step.label}
                </span>
              </div>
              <div className="mt-auto">
                <h3 className="m-0 text-[clamp(1.4rem,1.9vw,1.72rem)] font-medium leading-[1.08] tracking-[-0.035em] text-[var(--color-paper)]">{step.title}</h3>
                <p className="mt-5 max-w-[25rem] text-[1rem] font-light leading-[1.68] text-white/64">{step.description}</p>
              </div>
            </div>
          </article>
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
          <article
            className="group relative grid min-h-[13.5rem] grid-cols-[auto_1fr] gap-5 overflow-hidden rounded-[calc(var(--radius-panel)-8px)] border border-[rgba(2,2,13,0.08)] bg-[linear-gradient(145deg,rgba(255,255,255,0.98),rgba(249,249,249,0.86)_58%,rgba(0,103,244,0.045))] p-[clamp(1.1rem,2.6vw,1.6rem)] shadow-[0_18px_54px_rgba(2,2,13,0.055)] transition-[border-color,background] duration-200 before:pointer-events-none before:absolute before:inset-y-5 before:left-0 before:w-1 before:rounded-r-full before:bg-[linear-gradient(180deg,var(--color-blue),rgba(126,231,255,0.5))] hover:border-[rgba(0,103,244,0.18)] max-[520px]:grid-cols-1"
            key={item.title}
          >
            <span className="relative z-[1] flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(2,2,13,0.08)] bg-white text-[var(--color-blue)] shadow-[0_10px_30px_rgba(0,103,244,0.08)] transition-colors duration-200 group-hover:bg-[var(--color-blue)] group-hover:text-white" aria-hidden="true">
              <ItemIcon className="h-6 w-6" strokeWidth={1.65} />
            </span>
            <div className="relative z-[1] self-center">
              <h3 className="m-0 text-[clamp(1.28rem,1.8vw,1.55rem)] font-medium leading-[1.12] tracking-[-0.03em] text-[var(--color-ink)]">{item.title}</h3>
              <p className={`${mutedCopyClass} mt-3 max-w-[36rem] text-[0.96rem] leading-[1.62]`}>{item.description}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
