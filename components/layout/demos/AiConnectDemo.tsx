"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { gsap as GsapNamespace } from "gsap";
import CheckIcon from "lucide-react/dist/esm/icons/check.mjs";
import { Cube } from "@/components/landing/BrandMark";
import type { AiConnectDemoContent } from "@/content/types";
import styles from "./AiConnectDemo.module.css";
import { watchCentre } from "./watchCentre";

type Gsap = typeof GsapNamespace;
type GsapModule = { gsap: Gsap };

/** How the steps next to it look while another step plays. */
const OTHER_STEP = "0.42";
/** How far along the wire is once Opero has been added, before signing in joins the two. */
const HALFWAY = 0.5;
/** Where the cursor comes from, next to the button it ends up on. */
const CURSOR_FROM = { x: -130, y: -64 };
/** Seconds for the cursor to arrive, for one screen to give way to the next, to read a screen, and to look at the result. */
const REACH_SECONDS = 0.7;
const SWAP_SECONDS = 0.3;
const READ_SECONDS = 1.3;
const RESULT_SECONDS = 2.8;
const FADE_SECONDS = 0.3;

/**
 * How little it takes. The reader's agent and Opero sit apart, with a wire that does not
 * reach, and one small card under them goes through the whole setup in place: add Opero,
 * allow it as yourself, connected. Both buttons are in the same spot, so the cursor never
 * has to move: it is two clicks in one place. It ends on an empty box, ready to be asked
 * something, because what happens next is the rest of the page. The list `stepsId` names
 * follows along.
 *
 * The cursor is placed on the buttons by the stylesheet, so nothing here needs measuring.
 *
 * The markup is the connected state, which is what a reader with reduced motion gets.
 */
export function AiConnectDemo({ demo, stepsId }: { demo: AiConnectDemoContent; stepsId: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [engine, setEngine] = useState<Gsap | null>(null);
  const [still, setStill] = useState(false);
  const live = engine !== null;

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setStill(true);
        return;
      }
      const [{ gsap }] = await Promise.all([import("gsap") as Promise<GsapModule>, document.fonts.ready]);
      if (!cancelled) setEngine(() => gsap);
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  // Before paint, so the connected state is never seen for a moment before the story starts.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!engine || !root) return undefined;

    const gsap = engine;
    let stopWatching: (() => void) | undefined;
    let clearSteps: (() => void) | undefined;

    const context = gsap.context(() => {
      const all = (selector: string) => Array.from(root.querySelectorAll<HTMLElement>(selector));
      const one = (selector: string) => root.querySelector<HTMLElement>(selector)!;
      const steps = Array.from(document.getElementById(stepsId)?.children ?? []) as HTMLElement[];
      const [adding, allowing, connected] = all("[data-pane]");
      const [addButton, allowButton] = all("[data-button]");
      const cursor = one("[data-cursor]");
      const wire = one("[data-wire]");
      const joint = one("[data-joint]");
      const caret = one("[data-caret]");

      const markStep = (active: number) => {
        steps.forEach((step, index) => {
          step.style.opacity = index === active ? "1" : OTHER_STEP;
        });
      };
      clearSteps = () => steps.forEach((step) => step.style.removeProperty("opacity"));

      gsap.set(adding, { autoAlpha: 1 });
      gsap.set([allowing, connected], { autoAlpha: 0 });
      gsap.set(cursor, { autoAlpha: 0, ...CURSOR_FROM });
      gsap.set(wire, { scaleX: 0 });
      gsap.set(joint, { autoAlpha: 0, scale: 0.4 });

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        paused: true,
        repeat: -1,
        onRepeat: () => {
          gsap.fromTo(adding, { opacity: 0 }, { opacity: 1, duration: FADE_SECONDS, ease: "none" });
        },
      });

      /** The cursor presses a button. */
      const press = (button: HTMLElement, at: number) => {
        timeline.to([button, cursor], { scale: 0.92, duration: 0.08, ease: "power2.out" }, at);
        timeline.to([button, cursor], { scale: 1, duration: 0.16, ease: "power2.out" }, at + 0.08);
      };

      /** One screen gives way to the next, in the same place. */
      const swap = (from: HTMLElement, to: HTMLElement, at: number) => {
        timeline.to(from, { autoAlpha: 0, y: -8, duration: SWAP_SECONDS * 0.7, ease: "power2.in" }, at);
        timeline.to(to, { autoAlpha: 1, duration: SWAP_SECONDS, ease: "none" }, at + 0.12);
        timeline.fromTo(to, { y: 8 }, { y: 0, duration: SWAP_SECONDS, ease: "power2.out" }, at + 0.12);
      };

      // Add Opero.
      timeline.call(markStep, [0], 0.1);
      timeline.to(cursor, { autoAlpha: 1, duration: 0.16, ease: "none" }, 0.3);
      timeline.to(cursor, { x: 0, y: 0, duration: REACH_SECONDS, ease: "power2.inOut" }, 0.3);
      const addAt = 0.3 + REACH_SECONDS + 0.12;
      press(addButton, addAt);
      timeline.to(wire, { scaleX: HALFWAY, duration: 0.5, ease: "power2.inOut" }, addAt + 0.1);
      swap(adding, allowing, addAt + 0.18);

      // Sign in as yourself, which is the same click in the same place.
      timeline.call(markStep, [1], addAt + 0.3);
      const allowAt = addAt + 0.3 + READ_SECONDS;
      press(allowButton, allowAt);
      timeline.to(wire, { scaleX: 1, duration: 0.42, ease: "power2.inOut" }, allowAt + 0.1);
      timeline.to(cursor, { autoAlpha: 0, duration: 0.2, ease: "none" }, allowAt + 0.24);
      swap(allowing, connected, allowAt + 0.18);

      // Connected, and waiting to be asked.
      const doneAt = allowAt + 0.5;
      timeline.call(markStep, [2], doneAt);
      timeline.to(joint, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(2.6)" }, doneAt);
      for (let blink = 0; blink < 4; blink += 1) {
        timeline.set(caret, { autoAlpha: 0 }, doneAt + 0.55 + blink * 0.7);
        timeline.set(caret, { autoAlpha: 1 }, doneAt + 0.9 + blink * 0.7);
      }

      const endAt = doneAt + RESULT_SECONDS + 0.3;
      timeline.to([connected, joint, wire], { autoAlpha: 0, duration: FADE_SECONDS, ease: "none" }, endAt);
      timeline.set({}, {}, endAt + FADE_SECONDS + 0.2);

      stopWatching = watchCentre(one("[data-centre]"), root, ({ playing }) => {
        timeline.paused(!playing);
      });
    }, root);

    return () => {
      stopWatching?.();
      clearSteps?.();
      context.revert();
    };
  }, [engine, stepsId]);

  return (
    <div aria-hidden="true" className={styles.root} ref={rootRef} style={{ opacity: live || still ? 1 : 0 }}>
      <i className={styles.centre} data-centre />

      <div className={styles.ends}>
        <span className={styles.end}>{demo.agent}</span>
        <span className={styles.gap}>
          <i className={styles.wire} data-wire />
          <i className={styles.joint} data-joint>
            <CheckIcon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={3} />
          </i>
        </span>
        <span className={styles.end}>
          <Cube className="h-5 w-5 shrink-0" lidClassName="text-[var(--color-blue)]" />
          {demo.opero}
        </span>
      </div>

      <div className={styles.card}>
        <div className={styles.pane} data-pane>
          <p className={styles.title}>{demo.add.title}</p>
          <p className={styles.row}>
            <Cube className="h-8 w-8 shrink-0" lidClassName="text-[var(--color-blue)]" />
            <span>
              {demo.opero}
              <small>{demo.add.detail}</small>
            </span>
          </p>
          <span className={styles.button} data-button>{demo.add.button}</span>
        </div>

        <div className={styles.pane} data-pane>
          <p className={styles.title}>{demo.signIn.title}</p>
          <p className={styles.row}>
            <i className={styles.avatar}>{demo.signIn.initials}</i>
            <span>
              {demo.signIn.name}
              <small>{demo.signIn.note}</small>
            </span>
          </p>
          <span className={styles.button} data-button>{demo.signIn.button}</span>
        </div>

        <div className={`${styles.pane} ${styles.paneDone}`} data-pane>
          <p className={styles.title}>{demo.done.title}</p>
          <p className={styles.waiting}>
            <i className={styles.caret} data-caret />
            {demo.done.placeholder}
          </p>
        </div>

        {live ? (
          <svg className={styles.cursor} data-cursor viewBox="0 0 24 24">
            <path d="M5 3 L5 19 L9.5 15 L12.5 21.5 L15 20.4 L12 14 L18 14 Z" />
          </svg>
        ) : null}
      </div>
    </div>
  );
}
