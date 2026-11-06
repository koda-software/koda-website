"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { gsap as GsapNamespace } from "gsap";
import CheckIcon from "lucide-react/dist/esm/icons/check.mjs";
import { Cube } from "@/components/landing/BrandMark";
import type { AiConfigureDemoContent } from "@/content/types";
import styles from "./AiConfigureDemo.module.css";
import { CONFIGURE_SCREENS } from "./AiConfigureScreens";
import { typeOut } from "./typeOut";
import { watchCentre } from "./watchCentre";

type Gsap = typeof GsapNamespace;
type GsapModule = { gsap: Gsap };

/** The colours of the middle while it works and while it waits, and what is new on the screen before and after. */
const WORKING = "#0b7bbe";
const WAITING = "rgba(11, 17, 22, 0.14)";
const PLAIN = "#ffffff";
const FRESH = "#e8f4fc";
/**
 * Seconds along a line, for one thing the agent does, for the change to happen on the
 * screen, to see it, and to fade.
 */
const LINE_SECONDS = 0.5;
const STEP_SECONDS = 0.6;
const CHANGE_SECONDS = 0.55;
const RESULT_SECONDS = 2.6;
const FADE_SECONDS = 0.24;
/** How long a new size has to last before everything is measured again. */
const RESIZED_MS = 200;

/**
 * How a change gets made. On the left is what the reader asks their own agent, in the
 * middle is Opero MCP, which is how the agent reaches the platform, and on the right is
 * a form or a list that already exists. The request is written, goes to the middle, the
 * agent does what it takes, and the screen on the right changes while it is looked at.
 * Three requests change three things in three ways: a field comes in, a field moves,
 * a column opens. The three sit side by side on a wide page and one under the other on
 * a narrow one, because everything is placed from what is measured.
 *
 * The markup is the first result, which is what a reader with reduced motion gets.
 */
export function AiConfigureDemo({ demo }: { demo: AiConfigureDemoContent }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [engine, setEngine] = useState<Gsap | null>(null);
  const [still, setStill] = useState(false);
  const [resized, setResized] = useState(0);
  const live = engine !== null;
  const shown = live ? demo.requests : demo.requests.slice(0, 1);

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

  // Everything is placed from what is measured, so a new size means measuring again, once it has stopped changing.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const sizeOf = () => `${root.offsetWidth}x${root.offsetHeight}`;
    let size = sizeOf();
    let timer: number | undefined;
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (sizeOf() === size) return;
        size = sizeOf();
        setResized((times) => times + 1);
      }, RESIZED_MS);
    });
    observer.observe(root);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  // Before paint, so the first result is never seen for a moment before the story starts.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!engine || !root) return undefined;

    const gsap = engine;
    const typings: Array<ReturnType<typeof typeOut>> = [];
    let stopWatching: (() => void) | undefined;

    const context = gsap.context(() => {
      const all = (selector: string, from: ParentNode = root) => Array.from(from.querySelectorAll<HTMLElement>(selector));
      const one = (selector: string, from: ParentNode = root) => from.querySelector<HTMLElement>(selector)!;
      const sentences = all("[data-sentence]");
      const screens = all("[data-screen]");
      const stepLists = all("[data-steps]");
      const message = one("[data-message]");
      const middle = one("[data-middle]");
      const screenBox = one("[data-screens]");
      const dot = one("[data-dot]");

      /** Where an element sits in the demo, whatever it is nested in. Transforms do not count, so this can be read at any time. */
      const placeOf = (element: HTMLElement) => {
        let x = 0;
        let y = 0;
        let current: HTMLElement | null = element;
        while (current && current !== root) {
          x += current.offsetLeft;
          y += current.offsetTop;
          current = current.offsetParent as HTMLElement | null;
        }
        return { x, y, width: element.offsetWidth, height: element.offsetHeight };
      };

      const from = placeOf(message);
      const via = placeOf(middle);
      const to = placeOf(screenBox);
      /** The three are side by side on a wide page, and one under the other on a narrow one. */
      const sideways = via.x > from.x + from.width;
      const midX = via.x + via.width / 2;
      const midY = via.y + via.height / 2;
      const inStart = sideways ? { x: from.x + from.width, y: midY } : { x: midX, y: from.y + from.height };
      const inEnd = sideways ? { x: via.x, y: midY } : { x: midX, y: via.y };
      const outStart = sideways ? { x: via.x + via.width, y: midY } : { x: midX, y: via.y + via.height };
      const outEnd = sideways ? { x: to.x, y: midY } : { x: midX, y: to.y };
      const pathOf = (start: typeof inStart, end: typeof inStart) => `M ${start.x} ${start.y} L ${end.x} ${end.y}`;

      all('[data-line="in"]').forEach((line) => line.setAttribute("d", pathOf(inStart, inEnd)));
      all('[data-line="out"]').forEach((line) => line.setAttribute("d", pathOf(outStart, outEnd)));
      const lineIn = one('[data-line="in"][data-lit]');
      const lineOut = one('[data-line="out"][data-lit]');

      // The screens change height as they fill, and the page around them must not.
      gsap.set(screenBox, { height: screenBox.offsetHeight });
      gsap.set(sentences.slice(1), { autoAlpha: 0 });
      gsap.set(screens.slice(1), { autoAlpha: 0 });
      gsap.set([lineIn, lineOut], { autoAlpha: 0, strokeDashoffset: 1 });
      gsap.set(dot, { autoAlpha: 0, xPercent: -50, yPercent: -50 });
      gsap.set(middle, { borderColor: WAITING });

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        paused: true,
        repeat: -1,
        onRepeat: () => {
          typings.forEach((typing) => typing.clear());
          gsap.fromTo(screens[0], { opacity: 0 }, { opacity: 1, duration: FADE_SECONDS, ease: "none" });
        },
      });

      /** A line lights up from one end to the other, with a dot at its tip. */
      const travel = (line: HTMLElement, start: typeof inStart, end: typeof inStart, at: number) => {
        timeline.set(line, { autoAlpha: 1 }, at);
        timeline.to(line, { strokeDashoffset: 0, duration: LINE_SECONDS, ease: "power2.inOut" }, at);
        timeline.set(dot, { autoAlpha: 1, ...start }, at);
        timeline.to(dot, { ...end, duration: LINE_SECONDS, ease: "power2.inOut" }, at);
        timeline.set(dot, { autoAlpha: 0 }, at + LINE_SECONDS);
        return at + LINE_SECONDS;
      };

      /** Takes a screen back to how it was before the change, and returns what plays the change. */
      const prepare = (screen: HTMLElement) => {
        const grown = all("[data-grow]", screen).map((element) => ({ element, height: element.offsetHeight }));
        const widened = all("[data-widen]", screen).map((element) => ({ element, width: element.offsetWidth }));
        const moved = all("[data-moved]", screen);
        const passed = all("[data-passed]", screen);
        const appearing = all("[data-appear]", screen);
        const fresh = all("[data-fresh]", screen);
        const movedBy = passed.reduce((sum, row) => sum + row.offsetHeight, 0);
        const passedBy = moved.reduce((sum, row) => sum + row.offsetHeight, 0);

        grown.forEach(({ element }) => gsap.set(element, { autoAlpha: 0, height: 0, minHeight: 0, overflow: "hidden" }));
        widened.forEach(({ element }) => gsap.set(element, { autoAlpha: 0, width: 0 }));
        gsap.set(moved, { y: movedBy });
        gsap.set(passed, { y: -passedBy });
        gsap.set(appearing, { autoAlpha: 0 });
        gsap.set(fresh, { backgroundColor: PLAIN });

        return (at: number) => {
          grown.forEach(({ element, height }) => {
            timeline.to(element, { height, duration: CHANGE_SECONDS, ease: "power3.out" }, at);
            timeline.to(element, { autoAlpha: 1, duration: 0.24, ease: "none" }, at + 0.08);
          });
          widened.forEach(({ element, width }, row) => {
            const rowAt = at + row * 0.06;
            timeline.to(element, { width, duration: CHANGE_SECONDS, ease: "power3.out" }, rowAt);
            timeline.to(element, { autoAlpha: 1, duration: 0.24, ease: "none" }, rowAt + 0.08);
          });
          timeline.to([...moved, ...passed], { y: 0, duration: CHANGE_SECONDS + 0.1, ease: "power3.inOut" }, at);
          timeline.to(appearing, { autoAlpha: 1, duration: 0.2, ease: "none" }, at + CHANGE_SECONDS + 0.1);
          timeline.to(fresh, { backgroundColor: FRESH, duration: 0.3, ease: "none" }, at);
        };
      };

      const ask = (index: number, at: number) => {
        const sentence = sentences[index];
        const screen = screens[index];
        const steps = all("[data-step]", stepLists[index]);
        const change = prepare(screen);

        gsap.set(steps, { autoAlpha: 0, y: 6 });
        steps.forEach((step) => gsap.set(one("[data-done]", step), { autoAlpha: 0, scale: 0.4 }));

        if (index > 0) {
          timeline.to(sentence, { autoAlpha: 1, duration: 0.01, ease: "none" }, at);
          timeline.to(screen, { autoAlpha: 1, duration: FADE_SECONDS, ease: "none" }, at);
        }

        // Asked, and sent to the agent's way into Opero.
        const typing = typeOut(gsap, timeline, sentence, at + 0.1);
        typings.push(typing);
        const sentAt = typing.readAt;
        const reachedAt = travel(lineIn, inStart, inEnd, sentAt);
        timeline.to(middle, { borderColor: WORKING, duration: 0.14, ease: "none" }, reachedAt - 0.06);

        // What it takes, one thing after the other.
        steps.forEach((step, position) => {
          const stepAt = reachedAt + 0.08 + position * STEP_SECONDS;
          timeline.to(step, { autoAlpha: 1, y: 0, duration: 0.24 }, stepAt);
          timeline.to(one("[data-done]", step), { autoAlpha: 1, scale: 1, duration: 0.2, ease: "back.out(2.4)" }, stepAt + STEP_SECONDS * 0.55);
        });

        // And the form changes, right there.
        const workedAt = reachedAt + 0.08 + steps.length * STEP_SECONDS;
        const arrivedAt = travel(lineOut, outStart, outEnd, workedAt);
        change(arrivedAt - 0.08);

        const settledAt = arrivedAt + CHANGE_SECONDS;
        timeline.to(middle, { borderColor: WAITING, duration: 0.24, ease: "none" }, settledAt);
        timeline.to([lineIn, lineOut], { autoAlpha: 0, duration: 0.3, ease: "none" }, settledAt);
        timeline.set([lineIn, lineOut], { strokeDashoffset: 1 }, settledAt + 0.3);

        const endAt = settledAt + RESULT_SECONDS;
        timeline.to([sentence, screen, ...steps], { autoAlpha: 0, duration: FADE_SECONDS, ease: "none" }, endAt);
        return endAt + FADE_SECONDS;
      };

      let at = 0;
      demo.requests.forEach((_, index) => {
        at = ask(index, at);
      });
      timeline.set({}, {}, at);

      stopWatching = watchCentre(one("[data-centre]"), root, ({ playing }) => {
        timeline.paused(!playing);
      });
    }, root);

    return () => {
      stopWatching?.();
      context.revert();
      typings.forEach((typing) => typing.restore());
    };
  }, [demo, engine, resized]);

  return (
    <div aria-hidden="true" className={styles.root} ref={rootRef} style={{ opacity: live || still ? 1 : 0 }}>
      <i className={styles.centre} data-centre />
      <svg className={styles.lines}>
        <path data-line="in" d="" />
        <path data-line="out" d="" />
        {live ? <path className={styles.lit} data-line="in" data-lit d="" pathLength={1} /> : null}
        {live ? <path className={styles.lit} data-line="out" data-lit d="" pathLength={1} /> : null}
      </svg>

      <div className={styles.message} data-message>
        {shown.map((item) => (
          <p className={styles.sentence} data-sentence key={item.request}>
            <span data-typed>{item.request}</span>
            {live ? <i className={styles.caret} data-caret /> : null}
            <span className={styles.rest} data-rest />
          </p>
        ))}
      </div>

      <div className={styles.middle} data-middle>
        <p className={styles.mcp}>
          <Cube className="h-6 w-6 shrink-0" lidClassName="text-[var(--color-blue)]" />
          {demo.mcp}
        </p>
        <div className={styles.stepLists}>
          {shown.map((item) => (
            <ul className={styles.steps} data-steps key={item.request}>
              {item.steps.map((step) => (
                <li className={styles.step} data-step key={step}>
                  <span className={styles.ring}>
                    <i className={styles.done} data-done>
                      <CheckIcon aria-hidden="true" className="h-3 w-3" strokeWidth={3} />
                    </i>
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className={styles.screens} data-screens>
        {shown.map((item, index) => {
          const Screen = CONFIGURE_SCREENS[index];
          return <Screen demo={demo} key={item.request} />;
        })}
      </div>

      {live ? <i className={styles.dot} data-dot /> : null}
    </div>
  );
}
