"use client";

import Image from "next/image";
import MenuIcon from "lucide-react/dist/esm/icons/menu.mjs";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import type { gsap as GsapNamespace } from "gsap";

type ComparisonSliderProps = {
  afterAlt: string;
  afterLabel: string;
  afterSrc: string;
  ariaLabel: string;
  beforeAlt: string;
  beforeLabel: string;
  beforeSrc: string;
  imageHeight?: number;
  imageWidth?: number;
  scrollRevealDistance?: number;
  showLabels?: boolean;
  title: string;
};

type GsapModule = {
  gsap: typeof GsapNamespace;
};

function smoothProgress(value: number) {
  return value * value * (3 - 2 * value);
}

export function ComparisonSlider({
  afterAlt,
  afterLabel,
  afterSrc,
  ariaLabel,
  beforeAlt,
  beforeLabel,
  beforeSrc,
  imageHeight = 1549,
  imageWidth = 2044,
  scrollRevealDistance = 90,
  showLabels = true,
  title,
}: ComparisonSliderProps) {
  const [position, setPosition] = useState(100);
  const isManualRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const gsapRef = useRef<typeof GsapNamespace | null>(null);
  const sliderValueRef = useRef({ value: 100 });
  const tweenToPositionRef = useRef<((value: number) => void) | null>(null);
  const style = {
    "--comparison-position": `${position}%`,
    maxWidth: `min(100%, calc((min(55.625rem, 91svh - 2rem) - 2.5rem) * ${imageWidth} / ${imageHeight}))`,
  } as CSSProperties;

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let cancelled = false;
    let scrollFrame = 0;
    const sliderValue = sliderValueRef.current;

    const setupGsap = async () => {
      const { gsap } = await (import("gsap") as Promise<GsapModule>);

      if (cancelled) {
        return;
      }

      gsapRef.current = gsap;
      tweenToPositionRef.current = gsap.quickTo(sliderValue, "value", {
        duration: 1.1,
        ease: "power3.out",
        onUpdate: () => setPosition(sliderValue.value),
      });
    };

    const updateFromScroll = () => {
      scrollFrame = 0;
      if (isManualRef.current) return;

      const rect = root.getBoundingClientRect();
      const startLine = window.innerHeight * 0.84;
      const endLine = window.innerHeight * 0.12;
      const progress = Math.min(
        1,
        Math.max(0, (startLine - rect.top) / (startLine - endLine)),
      );
      const nextPosition =
        100 - smoothProgress(progress) * scrollRevealDistance;

      if (tweenToPositionRef.current) {
        tweenToPositionRef.current(nextPosition);
      } else {
        sliderValue.value = nextPosition;
        setPosition(nextPosition);
      }
    };

    const scheduleUpdate = () => {
      if (scrollFrame || isManualRef.current) return;
      scrollFrame = requestAnimationFrame(updateFromScroll);
    };

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    void setupGsap();
    scheduleUpdate();

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (scrollFrame) cancelAnimationFrame(scrollFrame);
      gsapRef.current?.killTweensOf(sliderValue);
    };
  }, [scrollRevealDistance]);

  const enterManualMode = (nextPosition: number) => {
    isManualRef.current = true;
    gsapRef.current?.killTweensOf(sliderValueRef.current);
    sliderValueRef.current.value = nextPosition;
    setPosition(nextPosition);
  };

  return (
    <div
      className="mx-auto w-full overflow-hidden rounded-[var(--radius-panel)] border border-[rgba(2,2,13,0.1)] bg-white shadow-[0_24px_76px_-40px_rgba(2,2,13,0.58)]"
      ref={rootRef}
      style={style}
    >
      <div className="flex h-10 items-center gap-3 border-b border-[rgba(2,2,13,0.08)] bg-[var(--color-paper-soft)] px-4">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b5f]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f7c948]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#37c978]" />
        </div>
        <div className="min-w-0 flex-1 rounded-full border border-[rgba(2,2,13,0.08)] bg-white px-3 py-1 text-center font-sans text-[0.76rem] text-[var(--color-muted)]">
          {title}
        </div>
      </div>

      <div
        className="relative overflow-hidden bg-white"
        style={{ aspectRatio: `${imageWidth} / ${imageHeight}` }}
      >
        <Image
          alt={afterAlt}
          className="object-cover"
          fill
          sizes="(max-width: 980px) 100vw, 72vw"
          src={afterSrc}
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath:
              "inset(0 calc(100% - var(--comparison-position)) 0 0)",
          }}
        >
          <Image
            alt={beforeAlt}
            className="object-cover"
            fill
            sizes="(max-width: 980px) 100vw, 72vw"
            src={beforeSrc}
          />
        </div>

        {showLabels ? (
          <>
            <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 font-sans text-[0.74rem] font-semibold text-[var(--color-ink-soft)] ring-1 ring-[rgba(2,2,13,0.08)]">
              {beforeLabel}
            </div>
            <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 font-sans text-[0.74rem] font-semibold text-[var(--color-ink-soft)] ring-1 ring-[rgba(2,2,13,0.08)]">
              {afterLabel}
            </div>
          </>
        ) : null}

        <input
          aria-label={ariaLabel}
          className="peer absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
          max={100}
          min={0}
          onChange={(event) => {
            enterManualMode(Number(event.target.value));
          }}
          step={0.1}
          type="range"
          value={position}
        />
        <div
          className="pointer-events-none absolute inset-y-0 z-20 w-[3px] -translate-x-1/2 bg-[var(--color-blue)] shadow-[0_0_18px_rgba(2,2,13,0.28)] ring-1 ring-white/90"
          style={{ left: "var(--comparison-position)" }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute top-1/2 z-20 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white bg-[var(--color-blue)] text-white shadow-[0_10px_28px_rgba(2,2,13,0.24)] peer-focus-visible:ring-4 peer-focus-visible:ring-[rgba(56,182,255,0.28)]"
          style={{ left: "var(--comparison-position)" }}
          aria-hidden="true"
        >
          <MenuIcon className="h-5 w-5" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}
