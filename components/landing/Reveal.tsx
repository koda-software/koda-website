"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef } from "react";
import styles from "./Reveal.module.css";

/** How far, and from which edge, a block travels before settling. */
const OFFSETS = {
  up: "translateY(22px)",
  left: "translateX(-34px)",
  right: "translateX(34px)",
} as const;

type RevealProps = {
  children: ReactNode;
  /** Which edge the block travels in from. */
  from?: keyof typeof OFFSETS;
  /** Milliseconds to hold back, for staggering a row of cards. */
  delay?: number;
  className?: string;
};

/**
 * Reveals its children when they scroll into view.
 *
 * The hidden state is deliberately absent from the server-rendered markup and
 * gets added here, immediately before the observer starts watching. That keeps
 * the content visible for anyone whose browser never runs this, and a block
 * already on screen at load reveals in the same frame instead of flashing
 * empty first. Classes are toggled on the node rather than held in state: this
 * is presentational only, and nothing else in the tree needs to re-render.
 */
export function Reveal({
  children,
  from = "up",
  delay = 0,
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const offset = window.matchMedia("(max-width: 809px)").matches && from !== "up" ? OFFSETS.up : OFFSETS[from];

    // Inline, so the hidden state cannot be beaten by anything in the cascade.
    element.style.opacity = "0";
    element.style.transform = offset;

    const reveal = () => {
      element.style.opacity = "";
      element.style.transform = "";
      main.disconnect();
      settled.disconnect();
    };

    /*
     * The block has to break a tenth of the screen into view before it moves,
     * rather than firing on a sliver at the bottom edge. A bare
     * threshold would not work: it is a share of the element, so a tall card
     * would trigger on a fraction of itself.
     */
    const main = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && reveal()),
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );
    /* Safety net for blocks near the end of the page, where the scroll runs
       out before their top ever reaches that line. */
    const settled = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && reveal()),
      { threshold: 0.9 },
    );
    main.observe(element);
    settled.observe(element);

    return () => {
      main.disconnect();
      settled.disconnect();
    };
  }, [from]);

  return (
    <div
      className={`${styles.reveal} ${className}`.trim()}
      ref={ref}
      style={
        delay ? ({ transitionDelay: `${delay}ms` } as CSSProperties) : undefined
      }
    >
      {children}
    </div>
  );
}
