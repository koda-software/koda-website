"use client";

import { createContext, type RefObject, useCallback, useContext, useEffect, useEffectEvent, useRef, useState } from "react";
import type { gsap as GsapNamespace } from "gsap";
import styles from "./demos.module.css";

export type Gsap = typeof GsapNamespace;

/** Every demo is drawn on this canvas and scaled to the stage, so its text keeps one size relative to it. */
export const STAGE_WIDTH = 640;
export const STAGE_HEIGHT = 440;

type StageContextValue = {
  canvasRef: RefObject<HTMLDivElement | null>;
  cursorRef: RefObject<HTMLDivElement | null>;
  /** Reduced motion: demos show their finished state and skip their autoplay. */
  still: boolean;
};

export const StageContext = createContext<StageContextValue | null>(null);

function useStage() {
  const stage = useContext(StageContext);
  if (!stage) throw new Error("A pillar demo has to sit inside the stage.");
  return stage;
}

let gsapPromise: Promise<Gsap> | null = null;

/** GSAP is loaded once, the first time any demo needs it, and never on the server. */
export function loadGsap() {
  gsapPromise ??= import("gsap").then((module) => module.gsap);
  return gsapPromise;
}

class Aborted extends Error {}

/**
 * Plays a demo by hand: a cursor that moves to things on the canvas and presses them.
 * Every step waits for the one before it, and all of them throw once the demo is
 * interrupted, so a script reads top to bottom and simply stops where it was cut off.
 */
export type Director = {
  wait: (ms: number) => Promise<void>;
  /** Moves the cursor onto the element, measured on the canvas at whatever scale it is shown. */
  moveTo: (target: Element | null, options?: { dx?: number; dy?: number; duration?: number }) => Promise<void>;
  /** Moves onto the element, presses, and runs `action` at the moment of the click. */
  click: (target: Element | null, action?: () => void) => Promise<void>;
  /** Where an element sits on the canvas, unscaled, for anything that travels with the cursor. */
  place: (target: Element) => { x: number; y: number; width: number; height: number };
  gsap: Gsap;
  signal: AbortSignal;
};

function createDirector(gsap: Gsap, canvas: HTMLElement, cursor: HTMLElement, signal: AbortSignal): Director {
  const guard = () => {
    if (signal.aborted) throw new Aborted();
  };

  const place = (target: Element) => {
    const box = canvas.getBoundingClientRect();
    const scale = box.width / STAGE_WIDTH || 1;
    const rect = target.getBoundingClientRect();
    return {
      x: (rect.left - box.left) / scale,
      y: (rect.top - box.top) / scale,
      width: rect.width / scale,
      height: rect.height / scale,
    };
  };

  const wait = (ms: number) =>
    new Promise<void>((resolve, reject) => {
      if (signal.aborted) return reject(new Aborted());
      const timer = window.setTimeout(resolve, ms);
      signal.addEventListener(
        "abort",
        () => {
          window.clearTimeout(timer);
          reject(new Aborted());
        },
        { once: true },
      );
    });

  const moveTo: Director["moveTo"] = async (target, { dx = 0.5, dy = 0.6, duration } = {}) => {
    guard();
    if (!target) return;
    const box = place(target);
    const x = box.x + box.width * dx;
    const y = box.y + box.height * dy;
    const shown = Number(gsap.getProperty(cursor, "autoAlpha")) > 0;
    if (!shown) gsap.set(cursor, { x: x + 46, y: y + 54 });
    const distance = Math.hypot(Number(gsap.getProperty(cursor, "x")) - x, Number(gsap.getProperty(cursor, "y")) - y);
    await gsap.to(cursor, {
      autoAlpha: 1,
      duration: duration ?? Math.min(0.95, 0.35 + distance / 900),
      ease: "power3.inOut",
      x,
      y,
    });
    guard();
  };

  const click: Director["click"] = async (target, action) => {
    await moveTo(target);
    await wait(120);
    cursor.classList.remove(styles.pressing);
    // Restarts the ripple when the same cursor clicks twice in a row.
    void cursor.offsetWidth;
    cursor.classList.add(styles.pressing);
    await gsap.to(cursor, { duration: 0.09, ease: "power2.in", scale: 0.86 });
    guard();
    action?.();
    await gsap.to(cursor, { duration: 0.2, ease: "power2.out", scale: 1 });
    guard();
  };

  return { click, gsap, moveTo, place, signal, wait };
}

/**
 * Runs a demo's script the first time it comes on stage, and again whenever the reader
 * asks for a replay. Leaving the stage cuts it off; a demo cut off before it finished
 * starts over next time, and one the reader has touched stays theirs.
 *
 * `reset` puts the demo back to its first frame and `finish` to its last; the latter is
 * what reduced motion gets instead of the script.
 */
export function useAutoplay({
  active,
  replay,
  reset,
  finish,
  script,
}: {
  active: boolean;
  replay: number;
  reset: () => void;
  finish: () => void;
  script: (director: Director) => Promise<void>;
}) {
  const { canvasRef, cursorRef, still } = useStage();
  const [phase, setPhase] = useState<"idle" | "playing" | "handed-over" | "taken">("idle");
  const controllerRef = useRef<AbortController | null>(null);
  const doneRef = useRef(false);
  const playedReplayRef = useRef(replay);
  // Read from the effect below without making it rerun when a demo renders new callbacks.
  const onFinish = useEffectEvent(finish);
  const onReset = useEffectEvent(reset);
  const onScript = useEffectEvent((director: Director) => script(director));

  const hideCursor = useCallback(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    void loadGsap().then((gsap) => {
      gsap.killTweensOf(cursor);
      gsap.to(cursor, { autoAlpha: 0, duration: 0.2, scale: 1 });
    });
  }, [cursorRef]);

  useEffect(() => {
    if (still) {
      onFinish();
      doneRef.current = true;
      return undefined;
    }
    if (!active) return undefined;

    const isReplay = replay !== playedReplayRef.current;
    if (doneRef.current && !isReplay) return undefined;
    playedReplayRef.current = replay;

    const controller = new AbortController();
    controllerRef.current = controller;
    onReset();
    setPhase("playing");

    void (async () => {
      const gsap = await loadGsap();
      const canvas = canvasRef.current;
      const cursor = cursorRef.current;
      if (controller.signal.aborted || !canvas || !cursor) return;

      try {
        // A moment on stage before the cursor shows up, so the change of scene registers first.
        const director = createDirector(gsap, canvas, cursor, controller.signal);
        await director.wait(550);
        await onScript(director);
        doneRef.current = true;
        setPhase("handed-over");
      } catch (error) {
        if (!(error instanceof Aborted)) throw error;
      } finally {
        hideCursor();
      }
    })();

    return () => {
      controller.abort();
      if (!doneRef.current) setPhase("idle");
    };
  }, [active, canvasRef, cursorRef, hideCursor, replay, still]);

  /** For every control the reader can press: they take over, and the script steps aside for good. */
  const takeOver = useCallback(() => {
    controllerRef.current?.abort();
    doneRef.current = true;
    setPhase("taken");
  }, []);

  return { phase, takeOver };
}

/** The bubble that points at what to press once a demo has shown itself. */
export function TryHint({ label, shown, className = "" }: { label: string; shown: boolean; className?: string }) {
  return (
    <span aria-hidden="true" className={`${styles.tryHint} ${shown ? styles.tryHintShown : ""} ${className}`.trim()}>
      {label}
    </span>
  );
}

/** Whether the reader asked for reduced motion, in which case demos change state without animating. */
export function useStill() {
  return useStage().still;
}
