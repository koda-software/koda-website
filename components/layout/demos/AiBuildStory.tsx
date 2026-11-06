"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import type { gsap as GsapNamespace } from "gsap";
import type { ScrollTrigger as ScrollTriggerInstance } from "gsap/ScrollTrigger";
import BellIcon from "lucide-react/dist/esm/icons/bell.mjs";
import CheckIcon from "lucide-react/dist/esm/icons/check.mjs";
import UserCheckIcon from "lucide-react/dist/esm/icons/user-check.mjs";
import ZapIcon from "lucide-react/dist/esm/icons/zap.mjs";
import type { AiBuildDemoContent } from "@/content/types";
import { smoothScrollQuery } from "../SmoothScrollProvider";
import { useStageScale } from "../useStageScale";
import styles from "./AiBuildStory.module.css";

type GsapModule = { gsap: typeof GsapNamespace };
type ScrollTriggerModule = { ScrollTrigger: typeof ScrollTriggerInstance };

const STAGE_WIDTH = 640;
const STAGE_HEIGHT = 540;
/** The camera once it has tipped the page back to look underneath it. */
const TILT = 52;
const TURN = -30;
const TILTED_SCALE = 0.74;
const TILTED_Y = 26;
/** How far the camera follows the stack down as each layer lands, so it stays in the middle. It never moves in. */
const STACK_FOLLOW = 24;
/** How far apart the layers sit, and how far above the stack each one starts. */
const LAYER_GAP = 54;
const LAYER_DROP = 260;
/** Where each step ends on the timeline, and where the timeline itself ends. */
const STEP_ENDS = [1.2, 3.8, 12.7];
const TIMELINE_END = 17.8;
/** How long each of the HTML and the CSS takes to type, and how long before the story moves on the rule lands. */
const WRITE_SECONDS = 1.6;
const RULE_SECONDS = 3.1;
/** The block before its CSS, and the tab that is not being written in. */
const BARE_ROW_HEIGHT = 24;
const BARE_SLA_GAP = 8;
const IDLE_TAB_OPACITY = 0.45;
/** How far the form fades for the moment the new section arrives. */
const RECEDED_OPACITY = 0.45;
/** Where there is room for the list and the story side by side, it is pinned, and the viewport heights of scrolling it takes. */
const PINNED_QUERY = "(min-width: 981px)";
const NARROW_QUERY = "(max-width: 980px)";
const SCROLL_SCREENS = 4;
/** Without a pin, on narrow screens, it plays by itself: seconds it holds, and the fade before it starts over. */
const HOLD_SECONDS = 3.5;
const FADE_SECONDS = 0.6;

/** A simplified query, written to be read at a glance. It is code, so it is the same in every language. */
const queryCode = [
  "SELECT number, title, sla_due",
  "FROM tickets",
  "WHERE contractor = :this_contractor",
  "  AND status = 'open'",
  "ORDER BY sla_due",
];

/** The block's markup, in the block contract's Liquid. Each line that renders something shows up in the preview as it is typed. */
const htmlCode = (title: string, action: string) => [
  '<section class="tickets">',
  `  <h3>${title}</h3>`,
  "  {% for t in tickets %}",
  "    <p>{{ t.number }} {{ t.title }} <b>{{ t.sla }}</b></p>",
  "  {% endfor %}",
  `  <button>${action}</button>`,
  "</section>",
];

/** The block's styling, one visible change per rule. The indexes in the timeline point at these lines. */
const cssCode = [
  ".tickets { font: var(--opero-font); }",
  ".tickets p {",
  "  display: flex;",
  "  border-top: 1px solid var(--opero-border);",
  "}",
  ".late { color: var(--opero-danger); }",
  "button { background: var(--opero-accent); }",
];

/** Where the rule's nodes sit on its canvas, and the ports the edges run between. */
const NODE_WIDTH = 160;
const ruleNodes = [
  { x: 12, y: 196 },
  { x: 196, y: 196 },
  { x: 428, y: 104 },
  { x: 428, y: 336 },
];
const ruleIcons = [ZapIcon, UserCheckIcon, BellIcon, BellIcon];
const PORT_Y = 34;
const ERROR_PORT_Y = 104;
const triggerOut = { x: ruleNodes[0].x + NODE_WIDTH, y: ruleNodes[0].y + PORT_Y };
const assignOut = { x: ruleNodes[1].x + NODE_WIDTH, y: ruleNodes[1].y + PORT_Y };
const assignError = { x: assignOut.x, y: ruleNodes[1].y + ERROR_PORT_Y };
const technicianIn = { x: ruleNodes[2].x, y: ruleNodes[2].y + PORT_Y };
const managerIn = { x: ruleNodes[3].x, y: ruleNodes[3].y + PORT_Y };
/** Right-angled with a rounded corner at each turn, the way the rule editor draws an edge. */
const elbow = (from: { x: number; y: number }, to: { x: number; y: number }) => {
  const middle = (from.x + to.x) / 2;
  const turn = to.y > from.y ? 8 : -8;
  return `M ${from.x} ${from.y} H ${middle - 8} Q ${middle} ${from.y} ${middle} ${from.y + turn} V ${to.y - turn} Q ${middle} ${to.y} ${middle + 8} ${to.y} H ${to.x}`;
};

/** Liquid, tokens and parameters in one colour, strings in another: just enough to read as code at an angle. */
function CodeLine({ line }: { line: string }) {
  return (
    <code className={styles.line} data-line>
      {line.split(/(\{\{.*?\}\}|\{%.*?%\}|"[^"]*"|'[^']*'|--opero-[a-z0-9-]+|:[a-z_]+|<\/?[a-z0-9]+|\b(?:SELECT|FROM|WHERE|AND|ORDER BY)\b)/).map((part, index) => {
        if (/^(\{\{|\{%|--opero|:[a-zA-Z])/.test(part)) return <span className={styles.liquid} key={index}>{part}</span>;
        if (/^["']/.test(part)) return <span className={styles.string} key={index}>{part}</span>;
        if (/^([A-Z]+( BY)?|<\/?[a-z0-9]+)$/.test(part)) return <span className={styles.keyword} key={index}>{part}</span>;
        return part;
      })}
    </code>
  );
}

/** One ticket, in the block being written and in the block on the finished page. */
function TicketRow({ row }: { row: AiBuildDemoContent["block"]["rows"][number] }) {
  return (
    <div className={styles.row} data-ticket>
      <span>{row.number}</span>
      <span data-ticket-title>{row.title}</span>
      <span className={row.late ? styles.late : styles.onTime} data-ticket-sla>{row.sla}</span>
    </div>
  );
}

/**
 * The block taken apart, driven by the reader's scroll: an ordinary contractor form
 * tips back to show the system under it, the parts of that system the request named
 * light up, the query lands, the block is typed out in HTML and CSS while it takes
 * shape under the code, the rule lands on top and a cursor connects two of its nodes,
 * and the stack clears for the same form, where the new section pops in and then reads
 * as one page with it.
 * Everything is one timeline, so scrolling back unbuilds it.
 *
 * The markup is the finished page, which is what a reader with reduced motion gets.
 */
export function AiBuildStory({ demo, steps }: { demo: AiBuildDemoContent; steps: Array<{ title: string; description: string }> }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { scale, scalerRef } = useStageScale(STAGE_WIDTH);
  const [ready, setReady] = useState(false);
  const measured = scale !== null;

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const scaler = scalerRef.current;
    if (!measured || !root || !stage || !scaler) return undefined;

    let cancelled = false;
    let media: gsap.MatchMedia | undefined;

    const setup = async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setReady(true);
        return;
      }

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap") as Promise<GsapModule>,
        import("gsap/ScrollTrigger") as Promise<ScrollTriggerModule>,
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      root.dataset.live = "";

      // Everything is built again when any of these changes, because a pin that outlives its screen leaves the page
      // four screens too long, and it needs the right kind of pin for whether the page is being smooth-scrolled.
      media = gsap.matchMedia(root);
      // `narrow` is only there because nothing runs unless at least one of them matches.
      media.add({ narrow: NARROW_QUERY, pinned: PINNED_QUERY, smooth: smoothScrollQuery }, (context) => {
        const { pinned, smooth } = context.conditions as { pinned: boolean; smooth: boolean };
        const el = (name: string) => stage.querySelector<HTMLElement>(`[data-el="${name}"]`)!;
        const all = (selector: string) => Array.from(stage.querySelectorAll<HTMLElement>(selector));
        const tilt = el("tilt");
        const turn = el("turn");
        const page = el("page");
        const form = el("form");
        const block = el("block");
        const floor = el("floor");
        const layers = all("[data-layer]");
        const rulePlate = el("rule");
        const cursor = el("cursor");
        const caret = el("caret");
        const preview = el("preview");
        const previewButton = el("previewButton");
        const tickets = Array.from(preview.querySelectorAll<HTMLElement>("[data-ticket]"));
        const slas = Array.from(preview.querySelectorAll<HTMLElement>("[data-ticket-sla]"));
        const stepItems = Array.from(root.querySelectorAll<HTMLElement>("[data-step], [data-pip]"));

        // The cursor is flat on the stage, so it needs to know where the camera will put the two ports.
        // The rig is moved there for a moment, read, and put back before anything is painted.
        gsap.set(tilt, { rotationX: TILT, scale: TILTED_SCALE, y: TILTED_Y + layers.length * STACK_FOLLOW });
        gsap.set(turn, { rotationZ: TURN });
        gsap.set(rulePlate, { z: layers.length * LAYER_GAP });
        const frame = stage.getBoundingClientRect();
        const portAt = (name: string) => {
          const rect = el(name).getBoundingClientRect();
          const zoom = frame.width / STAGE_WIDTH;
          return { x: (rect.left + rect.width / 2 - frame.left) / zoom, y: (rect.top + rect.height / 2 - frame.top) / zoom };
        };
        const grabAt = portAt("portOut");
        const dropAt = portAt("portIn");
        gsap.set(tilt, { rotationX: 0, scale: 1, y: 0 });
        gsap.set(turn, { rotationZ: 0 });

        const markStep = (time: number) => {
          const active = STEP_ENDS.filter((end) => time >= end).length;
          stepItems.forEach((item) => item.toggleAttribute("data-active", Number(item.dataset.step ?? item.dataset.pip) === active));
        };

        // The plate is a window on a longer page. With the section closed, the rest of the record fills it.
        const blockHeight = block.offsetHeight;
        const blockGap = parseFloat(getComputedStyle(block).marginTop);
        gsap.set(floor, { autoAlpha: 0 });
        gsap.set(layers, { autoAlpha: 0 });
        gsap.set(all("[data-line]"), { clipPath: "inset(0 100% 0 0)" });
        gsap.set(all("[data-tick]"), { autoAlpha: 0, scale: 0.6 });
        gsap.set(all("[data-node]"), { autoAlpha: 0, scale: 0.94 });
        gsap.set(all("[data-edge]"), { opacity: 0 });
        gsap.set([el("dragLine"), el("link")], { opacity: 0 });
        gsap.set(cursor, { autoAlpha: 0, x: grabAt.x + 70, y: grabAt.y + 90 });
        gsap.set(block, { autoAlpha: 0, height: 0, marginTop: 0, scale: 0.9, transformOrigin: "50% 0%" });
        gsap.set(el("dialogLayer"), { autoAlpha: 0 });

        // Bare HTML: the browser's own font, and each status straight after the title rather than out at the end of the row.
        const bareSlaX = slas.map((sla, index) => {
          const title = tickets[index].querySelector<HTMLElement>("[data-ticket-title]")!;
          return title.offsetLeft + title.offsetWidth + BARE_SLA_GAP - sla.offsetLeft;
        });
        gsap.set(preview, { fontFamily: "Georgia, serif" });
        gsap.set(caret, { autoAlpha: 0 });
        gsap.set(el("tabCss"), { opacity: IDLE_TAB_OPACITY });
        gsap.set(el("dialog"), { y: 18, scale: 0.97 });
        markStep(0);

        const timeline = gsap.timeline({ paused: true, defaults: { ease: "power2.inOut" }, onUpdate: () => markStep(timeline.time()) });

        // 1. You ask, about the ordinary form on screen. 2. It finds: the form tips back and lifts away from the system underneath it.
        const lookAt = STEP_ENDS[0];
        timeline.to(tilt, { rotationX: TILT, scale: TILTED_SCALE, y: TILTED_Y, duration: 1.2 }, lookAt);
        timeline.to(turn, { rotationZ: TURN, duration: 1.2 }, lookAt);
        timeline.to(page, { z: LAYER_DROP, autoAlpha: 0, duration: 0.8, ease: "power1.in" }, lookAt + 0.3);
        timeline.to(floor, { autoAlpha: 1, duration: 0.6, ease: "none" }, lookAt + 0.6);
        all("[data-match]").forEach((tile, index) => {
          timeline.to(tile, { backgroundColor: "rgba(56, 182, 255, 0.24)", borderColor: "#38b6ff", color: "#ffffff", duration: 0.3, ease: "none" }, lookAt + 1.4 + index * 0.28);
        });

        // 3. It builds. Each layer lands on the last.
        const buildAt = STEP_ENDS[1];
        const liveAt = STEP_ENDS[2];
        const blockAt = buildAt + 1.1;
        const ruleAt = liveAt - RULE_SECONDS;
        const landsAt = [buildAt, blockAt, ruleAt];
        layers.forEach((layer, index) => {
          const restsAt = (index + 1) * LAYER_GAP;
          timeline.fromTo(layer, { autoAlpha: 0, z: restsAt + LAYER_DROP }, { autoAlpha: 1, z: restsAt, duration: 0.7, ease: "power3.out", immediateRender: false }, landsAt[index]);
          timeline.to(tilt, { y: TILTED_Y + (index + 1) * STACK_FOLLOW, duration: 0.7 }, landsAt[index]);
        });
        const tick = (layer: HTMLElement, at: number) => timeline.to(layer.querySelector("[data-tick]"), { autoAlpha: 1, scale: 1, duration: 0.2, ease: "back.out(2.4)" }, at);

        timeline.to(el("queryPlate").querySelectorAll("[data-line]"), { clipPath: "inset(0 0% 0 0)", duration: 0.14, ease: "none", stagger: 0.04 }, buildAt + 0.25);
        tick(el("queryPlate"), buildAt + 0.8);

        // The block is typed, and every line that matters changes the preview under it the moment it is finished:
        // first bare HTML with real rows in it, then the CSS turning that into the block.

        const type = (lines: HTMLElement[], at: number) => {
          const letters = lines.map((line) => line.textContent?.length ?? 0);
          const total = letters.reduce((sum, count) => sum + count, 0);
          let time = at;
          return lines.map((line, index) => {
            const duration = (WRITE_SECONDS * letters[index]) / total;
            const ease = `steps(${letters[index]})`;
            timeline.set(caret, { x: 0, y: line.offsetTop }, time);
            timeline.to(line, { clipPath: "inset(0 0% 0 0)", duration, ease }, time);
            timeline.to(caret, { x: line.offsetWidth, duration, ease }, time);
            time += duration;
            return time;
          });
        };
        const lines = (name: string) => Array.from(el(name).querySelectorAll<HTMLElement>("[data-line]"));

        const writeAt = blockAt + 0.8;
        timeline.to(caret, { autoAlpha: 1, duration: 0.01, ease: "none" }, writeAt);
        const htmlWritten = type(lines("htmlCode"), writeAt);
        const appear = { autoAlpha: 0, y: 6, duration: 0.2, ease: "power2.out" };
        timeline.from(el("previewTitle"), appear, htmlWritten[1]);
        timeline.from(tickets, { ...appear, stagger: 0.08 }, htmlWritten[3]);
        timeline.from(previewButton, appear, htmlWritten[5]);

        const switchAt = htmlWritten[htmlWritten.length - 1] + 0.1;
        timeline.to(el("tabHtml"), { opacity: IDLE_TAB_OPACITY, duration: 0.12, ease: "none" }, switchAt);
        timeline.to(el("tabCss"), { opacity: 1, duration: 0.12, ease: "none" }, switchAt);
        timeline.to(el("htmlCode"), { autoAlpha: 0, duration: 0.12, ease: "none" }, switchAt);

        const cssWritten = type(lines("cssCode"), switchAt + 0.15);
        timeline.set(preview, { fontFamily: "inherit" }, cssWritten[0]);
        timeline.from(slas, { x: (index: number) => bareSlaX[index], duration: 0.35, ease: "power3.out" }, cssWritten[2]);
        timeline.from(tickets, { height: BARE_ROW_HEIGHT, borderTopColor: "rgba(255, 255, 255, 0)", duration: 0.3, ease: "power2.out" }, cssWritten[3]);
        timeline.from(slas, { backgroundColor: "rgba(255, 255, 255, 0)", color: "#ffffff", duration: 0.25, ease: "none" }, cssWritten[5]);
        timeline.from(el("previewFill"), { opacity: 0, duration: 0.25, ease: "none" }, cssWritten[6]);
        timeline.from(previewButton, { borderRadius: 3, color: "#101828", duration: 0.25, ease: "none" }, cssWritten[6]);
        timeline.to(caret, { autoAlpha: 0, duration: 0.01, ease: "none" }, cssWritten[cssWritten.length - 1]);
        tick(el("buildPlate"), cssWritten[cssWritten.length - 1] + 0.1);

        // The rule is the one layer that is drawn, not written: its nodes appear, and the last connection
        // is made by hand, as a preview line that becomes an edge when dropped.
        timeline.to(all("[data-node]"), { autoAlpha: 1, scale: 1, duration: 0.25, ease: "power2.out", stagger: 0.1 }, ruleAt + 0.3);
        timeline.to(all("[data-edge]"), { opacity: 1, duration: 0.2, ease: "none" }, ruleAt + 0.6);
        const grabbedAt = ruleAt + 1.7;
        timeline.to(cursor, { autoAlpha: 1, duration: 0.15, ease: "none" }, ruleAt + 1.2);
        timeline.to(cursor, { x: grabAt.x, y: grabAt.y, duration: 0.5 }, ruleAt + 1.2);
        timeline.to(el("dragLine"), { opacity: 1, duration: 0.05, ease: "none" }, grabbedAt);
        timeline.to(cursor, { x: dropAt.x, y: dropAt.y, duration: 0.7 }, grabbedAt + 0.05);
        timeline.to(el("dragLine"), { attr: { x2: technicianIn.x, y2: technicianIn.y }, duration: 0.7 }, grabbedAt + 0.05);
        const droppedAt = grabbedAt + 0.75;
        timeline.to(el("dragLine"), { opacity: 0, duration: 0.08, ease: "none" }, droppedAt);
        timeline.to(el("link"), { opacity: 1, duration: 0.12, ease: "none" }, droppedAt);
        timeline.to(el("portIn"), { scale: 2.2, duration: 0.12, ease: "power2.out" }, droppedAt);
        timeline.to(el("portIn"), { scale: 1, duration: 0.2, ease: "power2.in" }, droppedAt + 0.12);
        tick(rulePlate, droppedAt + 0.15);
        timeline.to(cursor, { autoAlpha: 0, x: dropAt.x + 40, y: dropAt.y + 50, duration: 0.3, ease: "power1.in" }, droppedAt + 0.25);

        // 4. It is live. The stack clears first, emptied of its code so none of it shows through the fade,
        // and only here does the camera come round to look straight at the page.
        timeline.to(all("[data-covered]"), { autoAlpha: 0, duration: 0.12, ease: "none" }, liveAt);
        timeline.to([...layers].reverse(), { autoAlpha: 0, duration: 0.24, ease: "none", stagger: 0.07 }, liveAt + 0.15);
        timeline.to(floor, { autoAlpha: 0, duration: 0.4, ease: "none" }, liveAt + 0.2);
        timeline.to(page, { z: 0, autoAlpha: 1, duration: 0.8, ease: "power2.out" }, liveAt + 0.6);
        timeline.to(tilt, { rotationX: 0, scale: 1, y: 0, duration: 1.1 }, liveAt + 0.3);
        timeline.to(turn, { rotationZ: 0, duration: 1.1 }, liveAt + 0.3);

        // The form is back exactly as it was, long enough to see that. Then the new section pops in and pushes the rest of
        // the record down out of the window, with the form faded for that moment only.
        const popAt = liveAt + 2;
        timeline.to(block, { height: blockHeight, marginTop: blockGap, duration: 0.4, ease: "power3.out" }, popAt);
        timeline.to(el("rest"), { autoAlpha: 0, duration: 0.25, ease: "none" }, popAt);
        timeline.to(block, { autoAlpha: 1, duration: 0.15, ease: "none" }, popAt + 0.05);
        timeline.to(block, { scale: 1, duration: 0.45, ease: "back.out(2)" }, popAt + 0.05);
        timeline.to(form, { opacity: RECEDED_OPACITY, duration: 0.2, ease: "none" }, popAt);
        // Once it has arrived the form comes back, and the two are simply one page.
        timeline.to(form, { opacity: 1, duration: 0.35, ease: "none" }, popAt + 0.85);

        // The button does what it says: its rule opens with the ticket already in it.
        const pressAt = popAt + 1.7;
        timeline.to(el("action"), { scale: 0.94, duration: 0.1, ease: "power2.in" }, pressAt);
        timeline.to(el("action"), { scale: 1, duration: 0.16, ease: "power2.out" }, pressAt + 0.1);
        timeline.to(el("dialogLayer"), { autoAlpha: 1, duration: 0.3, ease: "none" }, pressAt + 0.2);
        timeline.to(el("dialog"), { y: 0, scale: 1, duration: 0.4, ease: "power3.out" }, pressAt + 0.2);
        timeline.set({}, {}, TIMELINE_END);

        if (pinned) {
          ScrollTrigger.create({
            animation: timeline,
            anticipatePin: 1,
            end: () => `+=${window.innerHeight * SCROLL_SCREENS}`,
            pin: root,
            // Under ScrollSmoother the page itself is transformed, so a fixed pin would have nothing to hold on to.
            pinType: smooth ? "transform" : "fixed",
            scrub: 0.5,
            start: "center center",
            trigger: root,
          });
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
          return undefined;
        }

        let hold: gsap.core.Tween | undefined;
        timeline.eventCallback("onComplete", () => {
          hold = gsap.to(scaler, {
            opacity: 0,
            delay: HOLD_SECONDS,
            duration: FADE_SECONDS,
            ease: "power1.inOut",
            onComplete: () => {
              timeline.pause(0);
              gsap.set(scaler, { opacity: 1 });
              timeline.play(0);
            },
          });
        });
        const observer = new IntersectionObserver(
          ([entry]) => {
            timeline.paused(!entry.isIntersecting);
            hold?.paused(!entry.isIntersecting);
          },
          { threshold: 0.4 },
        );
        observer.observe(scaler);

        return () => {
          observer.disconnect();
          hold?.kill();
        };
      });

      setReady(true);
    };

    void setup();

    return () => {
      cancelled = true;
      media?.revert();
      delete root.dataset.live;
    };
  }, [measured, scalerRef]);

  return (
    <div className={styles.root} ref={rootRef}>
      <ol className={styles.steps}>
        {steps.map((step, index) => (
          <li data-step={index} key={step.title}>
            <span>{index + 1}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <div aria-hidden="true" className={styles.pips}>
        {steps.map((step, index) => <i data-pip={index} key={step.title} />)}
      </div>

      <div aria-hidden="true" className={styles.frame} style={{ "--stage-w": STAGE_WIDTH, "--stage-h": STAGE_HEIGHT } as CSSProperties}>
        <div className={styles.scaler} ref={scalerRef}>
          <div className={styles.stage} ref={stageRef} style={scale === null ? undefined : { opacity: ready ? 1 : 0, transform: `scale(${scale})` }}>
            <div className={styles.camera}>
              <div className={styles.tilt} data-el="tilt">
                <div className={styles.turn} data-el="turn">
                  <div className={`${styles.plate} ${styles.floor}`} data-el="floor">
                    <p className={styles.plateLabel} data-covered>{demo.system.label}</p>
                    <div className={styles.tiles} data-covered>
                      {demo.system.tiles.map((tile) => (
                        <span data-match={tile.match ? "" : undefined} key={tile.name}>{tile.name}</span>
                      ))}
                    </div>
                  </div>

                  <div className={`${styles.plate} ${styles.layer}`} data-el="queryPlate" data-layer>
                    <p className={styles.plateLabel} data-covered>
                      {demo.layers[0]}
                      <i data-tick><CheckIcon aria-hidden="true" className="h-[1.1rem] w-[1.1rem]" strokeWidth={2.4} /></i>
                    </p>
                    <pre className={styles.code} data-covered>
                      {queryCode.map((line) => <CodeLine key={line} line={line} />)}
                    </pre>
                  </div>

                  <div className={`${styles.plate} ${styles.layer} ${styles.buildLayer}`} data-el="buildPlate" data-layer>
                    <p className={styles.plateLabel} data-covered>
                      {demo.layers[1]}
                      <i data-tick><CheckIcon aria-hidden="true" className="h-[1.1rem] w-[1.1rem]" strokeWidth={2.4} /></i>
                    </p>

                    <div className={styles.editor} data-covered>
                      <div className={styles.tabs}>
                        <span data-el="tabHtml">HTML</span>
                        <span data-el="tabCss">CSS</span>
                      </div>
                      <div className={styles.codeArea}>
                        <pre className={styles.code} data-el="htmlCode">
                          {htmlCode(demo.block.title, demo.block.action).map((line) => <CodeLine key={line} line={line} />)}
                        </pre>
                        <pre className={`${styles.code} ${styles.cssCode}`} data-el="cssCode">
                          {cssCode.map((line) => <CodeLine key={line} line={line} />)}
                        </pre>
                        <i className={styles.caret} data-el="caret" />
                      </div>
                    </div>

                    <div className={styles.preview} data-covered data-el="preview">
                      <b className={styles.blockTitle} data-el="previewTitle">{demo.block.title}</b>
                      {demo.block.rows.map((row) => <TicketRow key={row.number} row={row} />)}
                      <div className={styles.previewFoot}>
                        <span className={styles.previewButton} data-el="previewButton">
                          <i data-el="previewFill" />
                          <span>{demo.block.action}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.plate} ${styles.layer} ${styles.ruleLayer}`} data-el="rule" data-layer>
                    <p className={styles.plateLabel}>
                      {demo.rule.label}
                      <i data-tick><CheckIcon aria-hidden="true" className="h-[1.1rem] w-[1.1rem]" strokeWidth={2.4} /></i>
                    </p>

                    <svg className={styles.edges} viewBox="0 0 600 500">
                      <path d={`M ${triggerOut.x} ${triggerOut.y} H ${ruleNodes[1].x}`} data-edge strokeDasharray="5 4" />
                      <path d={elbow(assignError, managerIn)} data-edge />
                      <path d={elbow(assignOut, technicianIn)} data-el="link" />
                      <line className={styles.dragLine} data-el="dragLine" x1={assignOut.x} x2={assignOut.x} y1={assignOut.y} y2={assignOut.y} />
                    </svg>

                    {demo.rule.steps.map((step, index) => {
                      const Icon = ruleIcons[index];
                      return (
                        <div
                          className={`${styles.node} ${index === 0 ? styles.trigger : ""}`}
                          data-node
                          key={step.title}
                          style={{ left: ruleNodes[index].x, top: ruleNodes[index].y, width: NODE_WIDTH }}
                        >
                          <div className={styles.nodeHead}>
                            <span className={styles.nodeIcon}><Icon aria-hidden="true" className="h-[1.05rem] w-[1.05rem]" strokeWidth={1.8} /></span>
                            <div>
                              <b>{step.title}</b>
                              <span>{step.detail}</span>
                            </div>
                          </div>
                          {index === 1 ? <p className={styles.nodeError}>{demo.rule.onError}<i /></p> : null}
                          {index === 1 ? <i className={styles.port} data-el="portOut" /> : null}
                          {index === 2 ? <i className={`${styles.port} ${styles.portIn}`} data-el="portIn" /> : null}
                        </div>
                      );
                    })}
                  </div>

                  <div className={`${styles.plate} ${styles.page}`} data-el="page">
                    <div data-el="form">
                      <div className={styles.pageHead}>
                        <div>
                          <span className={styles.crumb}>{demo.page.breadcrumb}</span>
                          <h3 className={styles.pageTitle}>{demo.page.title}</h3>
                        </div>
                        <span className={styles.status}>{demo.page.status}</span>
                      </div>
                      <dl className={styles.fields}>
                        {demo.page.fields.map((field) => (
                          <div key={field.label}>
                            <dt>{field.label}</dt>
                            <dd>{field.value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>

                    <div className={styles.block} data-el="block">
                      <b className={styles.blockTitle}>{demo.block.title}</b>
                      {demo.block.rows.map((row) => <TicketRow key={row.number} row={row} />)}
                      <div className={styles.foot}>
                        <span>{demo.block.summary}</span>
                        <span className={styles.action} data-el="action">{demo.block.action}</span>
                      </div>
                    </div>

                    <div className={styles.rest} data-el="rest">
                      <b>{demo.page.billing.title}</b>
                      <dl className={styles.fields}>
                        {demo.page.billing.fields.map((field) => (
                          <div key={field.label}>
                            <dt>{field.label}</dt>
                            <dd>{field.value}</dd>
                          </div>
                        ))}
                      </dl>
                      <b>{demo.page.notes.title}</b>
                      <p>{demo.page.notes.text}</p>
                    </div>

                    <div className={styles.dialogLayer} data-el="dialogLayer">
                      <div className={styles.dialog} data-el="dialog">
                        <b>{demo.dialog.title}</b>
                        <dl>
                          {demo.dialog.fields.map((field) => (
                            <div key={field.label}>
                              <dt>{field.label}</dt>
                              <dd>{field.value}</dd>
                            </div>
                          ))}
                        </dl>
                        <span className={styles.action}>{demo.dialog.confirm}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Flat on the stage rather than on the tilted canvas, so it stays the shape of a real pointer. */}
            <svg className={styles.cursor} data-el="cursor" height="26" viewBox="0 0 20 26" width="20">
              <path d="M2 2 L2 21 L7 16.5 L10.5 24 L14 22.5 L10.5 15 L17 15 Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
