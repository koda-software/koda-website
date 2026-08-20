"use client";

import { type RefObject, useEffect } from "react";
import type { gsap as GsapNamespace } from "gsap";
import type { ScrollTrigger as ScrollTriggerInstance } from "gsap/ScrollTrigger";

type GsapModule = {
  gsap: typeof GsapNamespace;
};

type ScrollTriggerModule = {
  ScrollTrigger: typeof ScrollTriggerInstance;
};

type UseGsapRevealOptions = {
  delay?: number;
  duration?: number;
  ease?: string;
  once?: boolean;
  scale?: number;
  selector?: string;
  stagger?: number;
  start?: string;
  x?: number;
  y?: number;
};

export function useGsapReveal(
  rootRef: RefObject<HTMLElement | null>,
  {
    delay = 0,
    duration = 0.85,
    ease = "power3.out",
    once = true,
    scale = 1,
    selector = "[data-gsap-reveal]",
    stagger = 0.08,
    start = "top 78%",
    x = 0,
    y = 24,
  }: UseGsapRevealOptions = {},
) {
  useEffect(() => {
    const root = rootRef.current;

    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const initialTargets = Array.from(root.querySelectorAll<HTMLElement>(selector));
    initialTargets.forEach((target) => {
      target.style.opacity = "0";
      target.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    });

    let context: gsap.Context | undefined;
    let cancelled = false;

    const setup = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap") as Promise<GsapModule>,
        import("gsap/ScrollTrigger") as Promise<ScrollTriggerModule>,
      ]);

      if (cancelled) {
        return;
      }

      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        const targets = gsap.utils.toArray<HTMLElement>(selector);

        if (targets.length === 0) {
          return;
        }

        gsap.fromTo(
          targets,
          { autoAlpha: 0, scale, x, y },
          {
            autoAlpha: 1,
            delay,
            duration,
            ease,
            scale: 1,
            stagger,
            x: 0,
            y: 0,
            scrollTrigger: {
              once,
              start,
              trigger: root,
            },
          },
        );
      }, root);
    };

    void setup();

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [delay, duration, ease, once, rootRef, scale, selector, stagger, start, x, y]);
}
