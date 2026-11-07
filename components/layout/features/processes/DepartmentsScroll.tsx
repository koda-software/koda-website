"use client";

import { type ReactNode, useEffect, useRef } from "react";
import type { gsap as GsapNamespace } from "gsap";
import type { ScrollTrigger as ScrollTriggerInstance } from "gsap/ScrollTrigger";

type GsapModule = { gsap: typeof GsapNamespace };
type ScrollTriggerModule = { ScrollTrigger: typeof ScrollTriggerInstance };

/** On a wide screen the stages sit in a row, on a phone in a column, which takes longer to scroll past. */
const WIDE_QUERY = "(min-width: 761px) and (prefers-reduced-motion: no-preference)";
const NARROW_QUERY = "(max-width: 760px) and (prefers-reduced-motion: no-preference)";

/**
 * Runs the case through the stages as the section scrolls past, by moving `--progress` from 0 to 1.
 * The stages draw themselves from it in CSS, so a tab opened halfway is at the same point of
 * the run. Without this, as on reduced motion, the variable is unset and the process is finished.
 */
export function DepartmentsScroll({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    let cancelled = false;
    let media: gsap.MatchMedia | undefined;

    const start = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap") as Promise<GsapModule>,
        import("gsap/ScrollTrigger") as Promise<ScrollTriggerModule>,
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      media = gsap.matchMedia();
      const stages = root.querySelector("[data-stages]");
      const run = (start: string, end: string) =>
        gsap.fromTo(root, { "--progress": 0 }, { "--progress": 1, ease: "none", scrollTrigger: { end, scrub: 0.4, start, trigger: stages } });

      media.add(WIDE_QUERY, () => {
        run("top 85%", "top 30%");
      });

      media.add(NARROW_QUERY, () => {
        run("top 75%", "bottom 60%");
        // The panels differ in height here, which moves everything below when the tab changes.
        const resize = new ResizeObserver(() => ScrollTrigger.refresh());
        resize.observe(root);
        return () => resize.disconnect();
      });
    };

    void start();

    return () => {
      cancelled = true;
      media?.revert();
    };
  }, []);

  return <div ref={rootRef}>{children}</div>;
}
