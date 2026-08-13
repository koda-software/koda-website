"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { useStageScale } from "../useStageScale";
import { DemoIcons } from "./DemoIcons";
import { DemoViewContext } from "./DemoView";
import styles from "./demoShell.module.css";

/**
 * Each demo declares the width of its own canvas rather than sharing one. The
 * mock UI inside is 720-1120px wide depending on the demo, and every pixel of
 * slack around it comes straight off the scale factor once the stage is fitted
 * into the hero column - which is exactly what makes the text too small to read.
 */

/**
 * The handles a demo's timeline gets. Views, captions and the progress dots are
 * React state because they belong to the shell; everything inside a demo's own
 * markup is reached by its `data-el` name and toggled directly, which is how
 * the source animations were written and is safe here because the whole widget
 * is decorative and `aria-hidden`.
 */
export type DemoApi = {
  /** The demo's own markup root, for the few timelines that need to measure it. */
  stage: HTMLElement;
  stageWidth: number;
  /** Schedules `run` at `ms` into the cycle; cleared automatically on unmount. */
  at: (ms: number, run: () => void) => void;
  el: (name: string) => HTMLElement | null;
  show: (target: string | HTMLElement | null, className?: string) => void;
  hide: (target: string | HTMLElement | null, className?: string) => void;
  /** Moves the pointer onto the element and plays a click ripple 560ms later. */
  click: (target: string | HTMLElement | null, dx?: number, dy?: number) => void;
  moveTo: (target: string | HTMLElement | null, dx?: number, dy?: number) => void;
  hideCursor: () => void;
  /** Types `text` into the element one character at a time. */
  type: (target: string | HTMLElement | null, text: string, speed?: number) => void;
  view: (name: string) => void;
  dot: (index: number) => void;
  /** `<b>` is allowed for emphasis. */
  caption: (html: string) => void;
  /** Class names from the shared stylesheet, for markup built inside a timeline. */
  styles: typeof styles;
};

type DemoStageProps = {
  /**
   * The demo stylesheet's own "visible" class. CSS modules hash class names per
   * file, so the shell cannot reach the `.on` rules in a demo's stylesheet -
   * the demo has to hand its own in for `show`/`hide` to default to.
   */
  onClass: string;
  /** Design width of this demo's canvas, sized snugly around its mock UI. */
  stageWidth: number;
  /** Design height of the same canvas. */
  stageHeight: number;
  /** Horizontal position of the decorative highlight behind the mock UI. */
  glowX: string;
  /** How many progress dots to show under the demo. */
  dotCount: number;
  /** Length of one full pass, after which the markup remounts and the timeline replays. */
  cycleMs: number;
  timeline: (api: DemoApi) => void;
  children: ReactNode;
};

export function DemoStage({ onClass, stageWidth, stageHeight, glowX, dotCount, cycleMs, timeline, children }: DemoStageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const { scale, scalerRef } = useStageScale(stageWidth);
  /*
   * Seeded true, like the home and Opero banner demos: these now sit in the
   * hero, so they should be running the moment the page paints rather than
   * waiting on the first observer callback. The observer below only ever pauses
   * them once the banner is scrolled away, which is what keeps an off-screen
   * demo from burning timers.
   */
  const [visible, setVisible] = useState(true);
  const [cycle, setCycle] = useState(0);
  const [activeView, setActiveView] = useState<string | null>(null);
  const [activeDot, setActiveDot] = useState(0);
  const [caption, setCaption] = useState("");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => setVisible(entry.isIntersecting)),
      { threshold: 0.25 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const cursor = cursorRef.current;
    if (!visible || !stage || !cursor) return;

    const timers: Array<ReturnType<typeof setTimeout>> = [];
    const at = (ms: number, run: () => void) => {
      timers.push(setTimeout(run, ms));
    };

    const node = (target: string | HTMLElement | null) =>
      typeof target === "string"
        ? stage.querySelector<HTMLElement>(target) ?? stage.querySelector<HTMLElement>(`[data-el="${target}"]`)
        : target;

    const moveTo: DemoApi["moveTo"] = (target, dx = 0, dy = 0) => {
      const element = node(target);
      if (!element) return;
      const stageRect = stage.getBoundingClientRect();
      const rect = element.getBoundingClientRect();
      const k = stageRect.width / stageWidth || 1;
      cursor.classList.add(styles.on);
      cursor.style.transform = `translate(${(rect.left - stageRect.left) / k + rect.width / 2 + dx}px,${
        (rect.top - stageRect.top) / k + rect.height / 2 + dy
      }px)`;
    };

    const api: DemoApi = {
      stage,
      stageWidth,
      at,
      styles,
      el: (name) => stage.querySelector<HTMLElement>(`[data-el="${name}"]`),
      show: (target, className) => node(target)?.classList.add(className ?? onClass),
      hide: (target, className) => node(target)?.classList.remove(className ?? onClass),
      moveTo,
      hideCursor: () => cursor.classList.remove(styles.on),
      click: (target, dx = 0, dy = 0) => {
        moveTo(target, dx, dy);
        at(560, () => {
          cursor.classList.add(styles.clicking);
          const element = node(target);
          element?.classList.add(styles.press);
          at(170, () => element?.classList.remove(styles.press));
          at(520, () => cursor.classList.remove(styles.clicking));
        });
      },
      type: (target, text, speed = 55) => {
        const element = node(target);
        if (!element) return;
        let index = 0;
        const step = () => {
          element.textContent = text.slice(0, ++index);
          if (index < text.length) timers.push(setTimeout(step, speed));
        };
        step();
      },
      // Matches the source animations: the outgoing view fades before the
      // incoming one arrives, rather than the two crossing over each other.
      view: (name) => {
        setActiveView(null);
        at(260, () => setActiveView(name));
      },
      dot: setActiveDot,
      caption: (html) => {
        setCaption("");
        at(160, () => setCaption(html));
      },
    };

    timeline(api);
    at(cycleMs, () => setCycle((current) => current + 1));

    return () => timers.forEach(clearTimeout);
  }, [cycle, cycleMs, onClass, stageWidth, timeline, visible]);

  return (
    <div
      aria-hidden="true"
      className={styles.root}
      ref={rootRef}
      style={{ "--stage-w": stageWidth, "--stage-h": stageHeight, "--glow-x": glowX } as CSSProperties}
    >
      <DemoIcons />
      <div className={styles.frame}>
        <div className={styles.scaler} ref={scalerRef}>
          <div
            className={styles.stage}
            ref={stageRef}
            style={scale === null ? undefined : { opacity: 1, transform: `scale(${scale})` }}
          >
            {/*
              Keyed by cycle: remounting is how a pass resets. The timelines set
              text and toggle classes straight on the nodes, so rebuilding the
              markup restores every one of those to its authored state at once.
            */}
            <DemoViewContext.Provider value={activeView} key={cycle}>
              {children}
            </DemoViewContext.Provider>

            <div className={styles.cursor} ref={cursorRef}>
              <svg height="34" viewBox="0 0 24 24" width="34">
                <path
                  d="M5 2.5 18.5 12l-5.6 1.1 3 5.9-2.6 1.3-3-6L6 18z"
                  fill="#0F172A"
                  stroke="#fff"
                  strokeLinejoin="round"
                  strokeWidth="1.3"
                />
              </svg>
              <i className={styles.click} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <p className={`${styles.caption} ${caption ? styles.on : ""}`} dangerouslySetInnerHTML={{ __html: caption }} />
        {dotCount > 1 ? (
          <div className={styles.dots}>
            {Array.from({ length: dotCount }, (_, index) => (
              <i className={activeDot === index + 1 ? styles.on : undefined} key={index} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export { DemoViewContext, DemoView } from "./DemoView";
