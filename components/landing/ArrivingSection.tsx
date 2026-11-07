"use client";

import { type ReactNode, useEffect, useRef } from "react";
import type { gsap as GsapNamespace } from "gsap";
import type { ScrollTrigger as ScrollTriggerInstance } from "gsap/ScrollTrigger";
import styles from "./ArrivingSection.module.css";

type GsapModule = { gsap: typeof GsapNamespace };
type ScrollTriggerModule = { ScrollTrigger: typeof ScrollTriggerInstance };

type ArrivingSectionProps = {
  children: ReactNode;
  /** The section's own surface, and anything else that belongs on it. */
  className?: string;
  /** How it arrives. Each one is described on the component. */
  cut: "card" | "wipe" | "curtain" | "steps" | "slide" | "open";
  id?: string;
};

/** Only a screen large enough to show the whole hero gets the arrival. Everything else just scrolls. */
const ARRIVAL_QUERY = "(min-width: 1024px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)";
/** The veil's slant, and its left and width as parts of the section, as they are in the stylesheet. */
const VEIL_SKEW = 20;
const VEIL_LEFT = 0.3;
const VEIL_WIDTH = 1.6;
/** How far behind the one before it each thing comes, as a part of the sweep. */
const ARRIVE_STAGGER = 0.05;
/** How many columns `steps` pulls back, and how much of the whole entrance each one takes. */
const COLUMNS = 6;
const COLUMN_SHARE = 0.55;
/** How far the content behind a `curtain` sinks by the time it is covered, as a part of the window. */
const CURTAIN_SINK = 0.14;

/**
 * A section that makes an entrance over the one before it.
 *
 * `card` is for the section after a full-page hero. Its top edge shows at the bottom of
 * the window from the start, as a rounded card on the hero's graphite, so that there is
 * clearly more below. It grows to the full width by the time it is most of the way up,
 * while the hero's copy drifts away from it.
 *
 * `wipe` is a slanted edge sweeping across the section above, done a little past the
 * middle of the window so that it never cuts through text being read. Whatever is marked
 * `data-arrive` comes out of that edge as it passes, or just slides with `data-arrive="slide"`.
 *
 * `curtain` slides over the section above on a straight edge with a shadow, while that
 * section's content sinks a little more slowly behind the edge. Whatever is marked
 * `data-arrive` on it grows into place, as with `open`. A section with something pinned in
 * it marks what may sink with `data-sink` instead, because a transform above a pin breaks it,
 * and a section whose content should simply scroll marks it `data-sink="none"`.
 *
 * `steps` is the mist above hanging over the section in columns, which pull back one after
 * another and leave a stepped edge on the way, for a section about steps.
 *
 * `slide` brings whatever is marked `data-arrive` in from the right, for a row of things,
 * or from the left with `data-arrive="left"`.
 *
 * `open` grows whatever is marked `data-arrive` up into place, the way the page's first
 * section did, so that the page ends the way it began.
 *
 * The markup is the finished section, which is what a phone or reduced motion gets.
 */
export function ArrivingSection({ children, className = "", cut, id }: ArrivingSectionProps) {
  const rootRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);

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
      media.add(ARRIVAL_QUERY, () => {
        const marked = root.querySelectorAll<HTMLElement>("[data-arrive]");
        const grow = () =>
          gsap.fromTo(
            marked,
            { scale: 0.88, y: 70, transformOrigin: "50% 100%" },
            { scale: 1, y: 0, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "top 45%", scrub: true } },
          );

        if (cut === "curtain") {
          const above = root.previousElementSibling;
          const covered = above?.querySelector("[data-sink]") ?? above?.firstElementChild;
          if (covered && covered.getAttribute("data-sink") !== "none") {
            gsap.to(covered, {
              y: () => window.innerHeight * CURTAIN_SINK,
              ease: "none",
              scrollTrigger: { trigger: root, start: "top bottom", end: "top top", scrub: true, invalidateOnRefresh: true },
            });
          }
          if (marked.length) grow();
          return;
        }

        if (cut === "steps") {
          const columns = columnsRef.current;
          if (!columns) return;
          gsap.set(columns, { visibility: "visible" });
          gsap
            .timeline({ scrollTrigger: { trigger: root, start: "top bottom", end: "top 35%", scrub: true } })
            .fromTo(columns.children, { scaleY: 1 }, { scaleY: 0, duration: COLUMN_SHARE, ease: "power1.inOut", stagger: (1 - COLUMN_SHARE) / (COLUMNS - 1) });
          return;
        }

        if (cut === "slide") {
          const side = (_: number, element: HTMLElement) => (element.dataset.arrive === "left" ? -220 : 220);
          gsap.fromTo(marked, { x: side, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "power2.out", scrollTrigger: { trigger: root, start: "top 85%", end: "top 35%", scrub: true } });
          return;
        }

        if (cut === "open") {
          grow();
          return;
        }

        if (cut === "wipe") {
          const veil = veilRef.current;
          const box = root.getBoundingClientRect();
          gsap.set(veil, { visibility: "visible", skewX: -VEIL_SKEW });

          const sweep = gsap.timeline({ scrollTrigger: { trigger: root, start: "top bottom", end: "top 40%", scrub: true } });
          sweep.fromTo(veil, { xPercent: 0 }, { xPercent: 100, duration: 1, ease: "none" }, 0);

          // Each thing comes out of the edge at the moment the edge reaches it, so the order follows
          // the sweep, and things that sit level with each other still follow one another.
          marked.forEach((element, index) => {
            const place = element.getBoundingClientRect();
            const across = (place.left - box.left) / box.width;
            const slant = (Math.tan((VEIL_SKEW * Math.PI) / 180) * (place.top - box.top - box.height / 2)) / box.width;
            const reached = (across + VEIL_LEFT + slant) / VEIL_WIDTH;
            const at = Math.min(Math.max(reached + index * ARRIVE_STAGGER, 0), 0.82);

            // Only slid, for something that already fades in by itself.
            if (element.dataset.arrive === "slide") sweep.fromTo(element, { x: -60 }, { x: 0, duration: 0.3, ease: "power2.out" }, at);
            else sweep.fromTo(element, { autoAlpha: 0, x: -48 }, { autoAlpha: 1, x: 0, duration: 0.18, ease: "power2.out" }, at);
          });
          return;
        }

        // From the very first pixel of scrolling, because the section already starts in view.
        const enter = { trigger: root, start: 0, end: "top 30%", scrub: true };
        gsap.to(leftRef.current, { xPercent: -100, ease: "none", scrollTrigger: enter });
        gsap.to(rightRef.current, { xPercent: 100, ease: "none", scrollTrigger: { ...enter } });

        // Only the copy moves, which keeps the work done on each frame of the scroll small.
        const copy = root.previousElementSibling?.querySelector("[data-hero-copy]");
        if (copy) gsap.to(copy, { y: -60, opacity: 0.25, ease: "none", scrollTrigger: { trigger: root.previousElementSibling, start: "top top", end: "bottom top", scrub: true } });
      });
    };

    void start();

    return () => {
      cancelled = true;
      media?.revert();
    };
  }, [cut]);

  return (
    // A curtain's shadow falls outside the section, so that one cannot clip what is in it.
    <section className={`relative ${cut === "curtain" ? styles.curtain : "overflow-hidden"} ${className}`.trim()} id={id} ref={rootRef}>
      {children}
      {cut === "card" ? (
        <>
          <div aria-hidden="true" className={`${styles.edge} ${styles.left}`} ref={leftRef} />
          <div aria-hidden="true" className={`${styles.edge} ${styles.right}`} ref={rightRef} />
        </>
      ) : null}
      {cut === "wipe" ? <div aria-hidden="true" className={styles.veil} ref={veilRef} /> : null}
      {cut === "steps" ? (
        <div aria-hidden="true" className={styles.columns} ref={columnsRef}>
          {Array.from({ length: COLUMNS }, (_, index) => (
            <div className={styles.column} key={index} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
