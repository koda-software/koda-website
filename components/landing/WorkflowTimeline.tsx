"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { HomeStep } from "@/content/types";
import { Reveal } from "./Reveal";

type WorkflowTimelineProps = {
  steps: HomeStep[];
};

export function WorkflowTimeline({ steps }: WorkflowTimelineProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const stepRefs = useRef<Array<HTMLLIElement | null>>([]);
  const progress = useMemo(() => {
    if (steps.length <= 1) return 100;
    return (activeIndex / (steps.length - 1)) * 100;
  }, [activeIndex, steps.length]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const updateActiveStep = () => {
      frame = 0;

      const triggerLine = window.innerHeight * 0.52;
      let nextIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      stepRefs.current.forEach((step, index) => {
        if (!step) return;

        const rect = step.getBoundingClientRect();
        const center = rect.top + rect.height * 0.36;
        const distance = Math.abs(center - triggerLine);

        if (distance < closestDistance) {
          closestDistance = distance;
          nextIndex = index;
        }
      });

      setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = requestAnimationFrame(updateActiveStep);
    };

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    scheduleUpdate();

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <ol
      className="relative m-0 grid list-none gap-[clamp(2.4rem,5.5vh,4.25rem)] p-0"
      style={{ "--timeline-progress": `${progress}%` } as CSSProperties}
    >
      <span
        className="absolute left-[1.35rem] top-5 w-px origin-top bg-[linear-gradient(180deg,var(--color-blue-soft),rgba(56,182,255,0.35),transparent)] shadow-[0_0_20px_rgba(56,182,255,0.42)] transition-[height] duration-500 ease-out max-[640px]:left-[1.15rem]"
        style={{ height: "var(--timeline-progress)" }}
        aria-hidden="true"
      />
      {steps.map((step, index) => {
        const active = index === activeIndex;
        const past = index < activeIndex;

        return (
          <Reveal delay={index * 90} key={step.title}>
            <li
              className="relative grid grid-cols-[3rem_1fr] gap-[clamp(1.35rem,3.4vw,2.8rem)] max-[640px]:grid-cols-[2.55rem_1fr]"
              ref={(element) => {
                stepRefs.current[index] = element;
              }}
            >
              <span
                className={`relative z-[1] grid h-11 w-11 place-items-center rounded-full border font-sans text-[0.78rem] font-semibold transition-[background,border-color,color,box-shadow,transform] duration-300 max-[640px]:h-9 max-[640px]:w-9 ${
                  active
                    ? "scale-110 border-[rgba(126,231,255,0.72)] bg-[var(--color-blue)] text-white shadow-[0_0_0_6px_rgba(56,182,255,0.12),0_20px_44px_-26px_rgba(56,182,255,0.9)]"
                    : past
                      ? "border-[rgba(126,231,255,0.38)] bg-[rgba(56,182,255,0.18)] text-[var(--color-blue-soft)]"
                      : "border-[rgba(126,231,255,0.24)] bg-[rgba(8,16,24,0.78)] text-white/58"
                }`}
              >
                {step.label}
              </span>
              <article
                className={`pt-1 transition-[opacity,transform] duration-300 ${
                  active
                    ? "translate-x-1 opacity-100"
                    : past
                      ? "opacity-80"
                      : "opacity-58"
                }`}
              >
                <h3
                  className={`m-0 max-w-[38rem] text-[clamp(1.65rem,2.6vw,2.32rem)] font-medium leading-[1.08] tracking-[-0.035em] transition-colors duration-300 ${
                    active ? "text-white" : "text-white/78"
                  }`}
                >
                  {step.title}
                </h3>
                <p className="mt-4 max-w-[41rem] text-[1.05rem] font-light leading-[1.76] text-white/66">
                  {step.description}
                </p>
              </article>
            </li>
          </Reveal>
        );
      })}
    </ol>
  );
}
