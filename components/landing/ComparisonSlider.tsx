"use client";

import Image from "next/image";
import MenuIcon from "lucide-react/dist/esm/icons/menu.mjs";
import { type CSSProperties, useEffect, useRef, useState } from "react";

type ComparisonSliderProps = {
  afterAlt: string;
  afterLabel: string;
  afterSrc: string;
  ariaLabel: string;
  beforeAlt: string;
  beforeLabel: string;
  beforeSrc: string;
  title: string;
};

export function ComparisonSlider({
  afterAlt,
  afterLabel,
  afterSrc,
  ariaLabel,
  beforeAlt,
  beforeLabel,
  beforeSrc,
  title,
}: ComparisonSliderProps) {
  const [position, setPosition] = useState(100);
  const isManualRef = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const style = { "--comparison-position": `${position}%` } as CSSProperties;

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frame = 0;

    const updateFromScroll = () => {
      frame = 0;
      if (isManualRef.current) return;

      const rect = root.getBoundingClientRect();
      const startLine = window.innerHeight * 0.78;
      const endLine = window.innerHeight * 0.28;
      const progress = Math.min(1, Math.max(0, (startLine - rect.top) / (startLine - endLine)));

      setPosition(100 - progress * 90);
    };

    const scheduleUpdate = () => {
      if (frame || isManualRef.current) return;
      frame = requestAnimationFrame(updateFromScroll);
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

  const enterManualMode = (nextPosition: number) => {
    isManualRef.current = true;
    setPosition(nextPosition);
  };

  return (
    <div
      className="overflow-hidden rounded-[var(--radius-panel)] border border-[rgba(2,2,13,0.1)] bg-white shadow-[0_24px_76px_-40px_rgba(2,2,13,0.58)]"
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

      <div className="relative aspect-[2044/1549] overflow-hidden bg-white">
        <Image
          alt={afterAlt}
          className="object-cover"
          fill
          sizes="(max-width: 980px) 100vw, 72vw"
          src={afterSrc}
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: "inset(0 calc(100% - var(--comparison-position)) 0 0)" }}
        >
          <Image
            alt={beforeAlt}
            className="object-cover"
            fill
            sizes="(max-width: 980px) 100vw, 72vw"
            src={beforeSrc}
          />
        </div>

        <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 font-sans text-[0.74rem] font-semibold text-[var(--color-ink-soft)] ring-1 ring-[rgba(2,2,13,0.08)]">
          {beforeLabel}
        </div>
        <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 font-sans text-[0.74rem] font-semibold text-[var(--color-ink-soft)] ring-1 ring-[rgba(2,2,13,0.08)]">
          {afterLabel}
        </div>

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
