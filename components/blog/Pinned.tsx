"use client";

import { type ReactNode, useEffect, useRef } from "react";
import type { gsap as GsapNamespace } from "gsap";
import type { ScrollTrigger as ScrollTriggerInstance } from "gsap/ScrollTrigger";
import { smoothScrollQuery } from "@/components/layout/SmoothScrollProvider";

/** Distance from the top of the window, clear of the fixed site header. Matches `top-24`. */
const offset = 96;

/**
 * Keeps its children in view while the rest of the column scrolls past, until
 * the nearest `[data-pin-bounds]` ancestor ends.
 *
 * Plain `position: sticky` does this wherever the page scrolls natively: on
 * touch devices, narrow windows and with reduced motion. On a desktop the site
 * is smooth-scrolled, which moves the whole page with a transform and leaves
 * sticky nothing to stick to, so there ScrollTrigger pins the element instead.
 */
export function Pinned({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    const bounds = element?.closest<HTMLElement>("[data-pin-bounds]");

    if (!element || !bounds) return undefined;

    let cancelled = false;
    let media: gsap.MatchMedia | undefined;

    const setup = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap") as Promise<{ gsap: typeof GsapNamespace }>,
        import("gsap/ScrollTrigger") as Promise<{ ScrollTrigger: typeof ScrollTriggerInstance }>,
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      media = gsap.matchMedia();
      media.add(`${smoothScrollQuery} and (prefers-reduced-motion: no-preference)`, () => {
        // The pin does the offsetting here. Left in place, the sticky `top` would be added to it.
        element.style.top = "0px";

        ScrollTrigger.create({
          trigger: element,
          pin: element,
          // Under ScrollSmoother the page itself is transformed, so a fixed pin would have nothing to hold on to.
          pinType: "transform",
          pinSpacing: false,
          start: `top ${offset}`,
          endTrigger: bounds,
          end: () => `bottom ${offset + element.offsetHeight}`,
          invalidateOnRefresh: true,
        });

        return () => {
          element.style.top = "";
        };
      });
    };

    void setup();

    return () => {
      cancelled = true;
      media?.revert();
    };
  }, []);

  return (
    <div className={`sticky top-24 ${className}`.trim()} ref={ref}>
      {children}
    </div>
  );
}
