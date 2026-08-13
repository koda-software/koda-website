"use client";

import { type RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * The demos measure their own box before the first paint. `useLayoutEffect` is
 * the only hook that runs early enough for that, but it warns when React runs
 * it on the server, so the server falls back to the effect it never executes.
 */
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type StageScale = {
  /** `null` until measured - the demo stays hidden rather than flashing at 1:1. */
  scale: number | null;
  scalerRef: RefObject<HTMLDivElement | null>;
};

/**
 * Fits a fixed-pixel design canvas (`stageWidth`) into whatever width the page
 * gives it, as a `transform: scale()` factor.
 *
 * The stage is `position: absolute` inside a box that already reserves its
 * space with `aspect-ratio`, so rescaling never moves anything around it - the
 * cost of getting this wrong is a visible flash, not layout shift. Two details
 * keep that flash away:
 *
 * - The scale starts as `null` instead of `1`. A stage that renders at 1:1
 *   first paints its full 840-1200px canvas inside a column half that wide,
 *   then snaps down once the effect measures. Callers hide the stage while the
 *   scale is `null`, so the only thing ever painted is the correct size.
 * - The measurement runs in a layout effect, before the browser paints, so
 *   hydration resolves the real scale within the same frame.
 *
 * Zero widths are ignored: below the mobile breakpoint the demo is
 * `display: none`, and latching onto that 0 would leave the stage collapsed
 * once it came back. The window listener backs up the observer there, which
 * does not reliably re-fire when an element leaves `display: none`.
 */
export function useStageScale(stageWidth: number): StageScale {
  const scalerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    const scaler = scalerRef.current;
    if (!scaler) return;

    const fit = () => {
      const width = scaler.clientWidth;
      if (width > 0) setScale(width / stageWidth);
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(scaler);
    window.addEventListener("resize", fit);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, [stageWidth]);

  return { scale, scalerRef };
}
