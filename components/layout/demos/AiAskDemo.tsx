"use client";

import { type CSSProperties, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { gsap as GsapNamespace } from "gsap";
import ShieldCheckIcon from "lucide-react/dist/esm/icons/shield-check.mjs";
import type { AiAskDemoContent, AiAskToolId } from "@/content/types";
import { useStageScale } from "../useStageScale";
import styles from "./AiAskDemo.module.css";
import { DEPTHS, DUST, splitQuestion, TOOL_FIELD, toolIcon, toolScore } from "./aiAskTools";
import { watchCentre } from "./watchCentre";

type Gsap = typeof GsapNamespace;
type GsapModule = { gsap: Gsap };

/** A thing floating in the field, with where it is at this moment. */
type Body = {
  element: HTMLElement;
  tile: HTMLElement;
  readout: HTMLElement;
  figure: HTMLElement;
  meter: HTMLElement;
  id: AiAskToolId;
  homeX: number;
  homeY: number;
  pushX: number;
  pushY: number;
  x: number;
  y: number;
  depth: (typeof DEPTHS)[number];
  seed: number;
};
/** A thing the agent found: a step that stays with its body, and later lands in its slot in the chain. */
type Found = { step: HTMLElement; body: Body; slotX: number; slotY: number; width: number; height: number; x: number; y: number; grow: number; landed: number };

/** The narrowest the stage gets, which is what the question needs to fit on its line. A narrower screen scales it down. */
const STAGE_WIDTH = 640;
/** The colour of each clue, for what is drawn in code, and a darker one for what is read. The same colours are on `.clue0` to `.clue3` for everything else. */
const CLUE_EDGES = ["#bd8100", "#1d87d0", "#18a66c", "#e8683f"];
const CLUE_INKS = ["#8a6100", "#12659f", "#0e7a4f", "#bd4323"];
const CLUE_CLASSES = [styles.clue0, styles.clue1, styles.clue2, styles.clue3];
/** How bright things are while a question is being asked, and while something else is being measured, next to how they are at rest. */
const WAITING = 0.45;
const SPECTATING = 0.35;
/** How far everything falls back behind the answer. */
const RECEDED = 0.2;
const FIELD_RECEDED = 0.94;
/** How large a found thing is while it still floats, next to its size in the chain, and how far from the edge it stays. */
const FLOATING = 0.86;
const FLOAT_MARGIN = 8;
/** How fast the question's pulse travels, in pixels a second, and the longest it takes to reach everything. */
const PULSE_PACE = 900;
const PULSE_MOST_SECONDS = 0.85;
/** How far the pulse pushes things as it passes, and how far a catch pushes what is around it, within what distance. */
const PULSE_PUSH = 9;
const CATCH_PUSH = 12;
const CATCH_REACH = 170;
/**
 * Seconds per letter of the question, to read it in the box, for the box to rise, for
 * the pulse, for a score to count to 100, for a find to settle, for the chain to form,
 * and to read the answer, which gets a moment and then time for each letter.
 */
const TYPE_SECONDS_PER_LETTER = 0.016;
const READ_SECONDS = 0.3;
const RISE_SECONDS = 0.42;
const COUNT_SECONDS = 0.56;
const SETTLE_SECONDS = 0.3;
const GATHER_SECONDS = 0.6;
const ANSWER_SECONDS = 1.6;
const ANSWER_SECONDS_PER_LETTER = 0.022;
const FADE_SECONDS = 0.22;
/** How long a new size has to last before everything is measured again. */
const RESIZED_MS = 200;

const between = (from: number, to: number, amount: number) => from + (to - from) * amount;
const within = (value: number, low: number, high: number) => Math.min(Math.max(value, low), high);

/**
 * What a colleague who knows the whole system would do with a vague question. The
 * section it sits in is its stage: everything the agent can reach for floats there at
 * different depths, across the page and around the section's own text: records, lists,
 * reports, rules, templates. The question is asked in the middle of it all. The box
 * rises and the question goes out through everything as a pulse. Then, for each part
 * of the question, marked
 * in its own colour, lines run from those words to the things that might help, and
 * all of them are measured at once. Scores count up together, the weakest stop first
 * and drop out, and whatever scores highest is caught and shows what it found. Each
 * find is joined to the last, so the route shows as a shape among everything else,
 * and a different question makes a different shape. Then the rest falls back, the
 * finds gather into a chain and the answer comes up.
 *
 * The timeline only says what happens when. Things keep moving between its beats, so
 * the ticker places whatever follows them, from values the timeline tweens.
 *
 * The markup is the first answer, which is what a reader with reduced motion gets.
 */
export function AiAskDemo({ demo }: { demo: AiAskDemoContent }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { scale, scalerRef } = useStageScale(STAGE_WIDTH);
  const [engine, setEngine] = useState<Gsap | null>(null);
  const [still, setStill] = useState(false);
  const [resized, setResized] = useState(0);
  const fit = scale === null ? null : Math.min(scale, 1);
  const measured = scale !== null;
  const live = engine !== null;
  const ready = live || still;
  const shown = live ? demo.questions : demo.questions.slice(0, 1);

  useEffect(() => {
    if (!measured) return undefined;

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
  }, [measured]);

  // Everything is placed from what is measured, so a new size means measuring again, once it has stopped changing.
  useEffect(() => {
    const scaler = scalerRef.current;
    if (!scaler) return undefined;

    const sizeOf = () => `${scaler.clientWidth}x${scaler.clientHeight}`;
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
    observer.observe(scaler);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [scalerRef]);

  // Before paint, so the first answer is never seen for a moment before the story starts.
  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!engine || !root || !stage) return undefined;

    const gsap = engine;
    const moved: HTMLElement[] = [];
    let tick: ((time: number) => void) | undefined;
    let stopWatching: (() => void) | undefined;

    const context = gsap.context(() => {
      const all = (selector: string, from: ParentNode = stage) => Array.from(from.querySelectorAll<HTMLElement>(selector));
      const one = (selector: string, from: ParentNode = stage) => from.querySelector<HTMLElement>(selector)!;
      const questions = all("[data-question]");
      const lists = all("[data-list]");
      const caret = one("[data-caret]");
      const composer = one("[data-composer]");
      const pulse = one("[data-pulse]");
      const field = one("[data-field]");
      const dust = one("[data-dust]");
      const frame = one("[data-window]");
      const frameWidth = frame.offsetWidth;
      const frameHeight = frame.offsetHeight;
      /** How far down the box has to be to sit in the middle of the stage. */
      const askedAt = (stage.offsetHeight - composer.offsetHeight) / 2 - composer.offsetTop;
      /** Where the box ends once it has risen, across the window, which is where the pulse and the lines start. */
      const askedFrom = composer.offsetTop + composer.offsetHeight - frame.offsetTop;

      /** Where an element sits in the window, whatever it is nested in. Transforms do not count, so this can be read at any time. */
      const placeOf = (element: HTMLElement) => {
        let x = 0;
        let y = 0;
        let current: HTMLElement | null = element;
        while (current && current !== frame) {
          x += current.offsetLeft;
          y += current.offsetTop;
          current = current.offsetParent as HTMLElement | null;
        }
        return { x, y, width: element.offsetWidth, height: element.offsetHeight };
      };

      /** The middle of some words in the box, across the window. They are not in the window, so this goes by what is on screen, undoing the stage's scale. */
      const middleOf = (words: HTMLElement) => {
        const box = words.getBoundingClientRect();
        const area = frame.getBoundingClientRect();
        return (box.left + box.width / 2 - area.left) * (frameWidth / area.width);
      };

      const bodies: Body[] = all("[data-body]").map((element, seed) => {
        const { x, y } = placeOf(element);
        return {
          element,
          tile: element.firstElementChild as HTMLElement,
          readout: one("[data-readout]", element),
          figure: one("[data-figure]", element),
          meter: one("[data-meter]", element),
          id: TOOL_FIELD[seed].id,
          homeX: x,
          homeY: y,
          pushX: 0,
          pushY: 0,
          x,
          y,
          depth: DEPTHS[TOOL_FIELD[seed].depth],
          seed,
        };
      });
      const tiles = bodies.map((body) => body.tile);
      const bodyOf = (id: AiAskToolId) => bodies.find((body) => body.id === id)!;
      const waitingOf = (index: number) => bodies[index].depth.rest * WAITING;
      const distanceOf = (body: Body) => Math.hypot(body.homeX - frameWidth / 2, body.homeY - askedFrom);
      const pulseReach = Math.max(...bodies.map(distanceOf));
      const pulseSeconds = Math.min(pulseReach / PULSE_PACE, PULSE_MOST_SECONDS);

      const finds: Found[] = [];
      const links: Array<{ path: SVGPathElement; from: Found; to: Found }> = [];
      const probes: Array<{ path: SVGPathElement; x: number; body: Body }> = [];

      gsap.set(questions, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(lists.slice(1), { autoAlpha: 0 });
      gsap.set(tiles, { opacity: waitingOf });
      gsap.set(composer, { y: askedAt });
      gsap.set(pulse, { width: pulseReach * 2, height: pulseReach * 2, left: frameWidth / 2 - pulseReach, top: askedFrom - pulseReach });

      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        paused: true,
        repeat: -1,
        onRepeat: () => {
          gsap.fromTo(lists[0], { opacity: 0 }, { opacity: 1, duration: FADE_SECONDS, ease: "none" });
        },
      });

      /** Pushes a thing away from a point, and lets it float back. Nearer things move further, as they do when they drift. */
      const shove = (body: Body, fromX: number, fromY: number, push: number, at: number) => {
        const away = Math.hypot(body.homeX - fromX, body.homeY - fromY) || 1;
        const reach = push * body.depth.scale;
        timeline.to(body, { pushX: ((body.homeX - fromX) / away) * reach, pushY: ((body.homeY - fromY) / away) * reach, duration: 0.14, ease: "power2.out" }, at);
        timeline.to(body, { pushX: 0, pushY: 0, duration: 0.5, ease: "sine.inOut" }, at + 0.14);
      };

      /** Counts a thing's score up, at the same rate as everything else being measured. Returns when it stops. */
      const measure = (body: Body, score: number, colour: string, at: number) => {
        const count = { value: 0 };
        const seconds = (COUNT_SECONDS * score) / 100;
        timeline.set(body.readout, { color: colour }, at);
        timeline.to(body.readout, { autoAlpha: 1, duration: 0.06, ease: "none" }, at);
        timeline.to(
          count,
          {
            value: score,
            duration: seconds,
            ease: "none",
            onUpdate: () => {
              body.figure.textContent = `${Math.round(count.value)}%`;
              body.meter.style.transform = `scaleX(${count.value / 100})`;
            },
          },
          at,
        );
        return at + seconds;
      };

      const ask = (index: number, at: number) => {
        const item = demo.questions[index];
        const question = questions[index];
        const list = lists[index];
        const steps = all("[data-step]", list);
        const paths = all("[data-link]", list) as unknown as SVGPathElement[];
        const chosen = item.clues.map((clue) => bodyOf(clue.tool));
        const others = tiles.filter((tile) => !chosen.some((body) => body.tile === tile));

        const found = steps.map((step, position): Found => {
          const slot = placeOf(step);
          const slotX = slot.x + slot.width / 2;
          const slotY = slot.y + slot.height / 2;
          return { step, body: chosen[position], slotX, slotY, width: slot.width, height: slot.height, x: slotX, y: slotY, grow: 0.45, landed: 0 };
        });
        finds.push(...found);
        paths.forEach((path, position) => links.push({ path, from: found[position], to: found[position + 1] }));
        moved.push(...steps);

        gsap.set(steps, { autoAlpha: 0 });
        gsap.set(paths as unknown as HTMLElement[], { autoAlpha: 0, strokeDashoffset: 1 });
        gsap.set(all("[data-ink]", question), { scaleX: 0 });
        gsap.set(all("[data-reply]", list), { autoAlpha: 0, y: 10, scale: 0.97 });
        gsap.set(all("[data-note]", list), { autoAlpha: 0, y: 8 });

        // Asked, in the middle.
        const letters = question.textContent?.length ?? 1;
        const typing = letters * TYPE_SECONDS_PER_LETTER;
        const typed = `steps(${letters})`;
        timeline.to(question, { clipPath: "inset(0 0% 0 0)", duration: typing, ease: typed }, at);
        timeline.fromTo(caret, { x: 0 }, { x: question.offsetWidth + 3, duration: typing, ease: typed }, at);
        timeline.to(caret, { autoAlpha: 1, duration: 0.01, ease: "none" }, at);
        const riseAt = at + typing + READ_SECONDS;
        timeline.to(caret, { autoAlpha: 0, duration: 0.01, ease: "none" }, riseAt);

        // The box rises out of the way, and as it arrives the question goes out through everything.
        timeline.to(composer, { y: 0, duration: RISE_SECONDS, ease: "power3.inOut" }, riseAt);
        const pulseAt = riseAt + RISE_SECONDS * 0.75;
        timeline.fromTo(pulse, { scale: 0, opacity: 0.3 }, { scale: 1, opacity: 0, duration: pulseSeconds, ease: "none" }, pulseAt);
        bodies.forEach((body) => {
          const reachedAt = pulseAt + (distanceOf(body) / pulseReach) * pulseSeconds;
          timeline.to(body.tile, { opacity: 1, scale: 1.06, duration: 0.14, ease: "power2.out" }, reachedAt);
          timeline.to(body.tile, { opacity: body.depth.rest, scale: 1, duration: 0.22, ease: "power1.inOut" }, reachedAt + 0.14);
          shove(body, frameWidth / 2, askedFrom, PULSE_PUSH, reachedAt);
        });
        // Not before the pulse has passed everything, because measuring starts from things at rest.
        let cursor = pulseAt + pulseSeconds + 0.3;

        // One clue at a time: its words are marked, and everything that might help is measured against them at once.
        item.clues.forEach((clue, position) => {
          const find = found[position];
          const body = chosen[position];
          const colour = CLUE_INKS[position];
          const rivals = clue.tries.map(bodyOf);
          const measured = [...rivals, body];
          const taken = chosen.slice(0, position);
          const spectators = bodies.filter((other) => !measured.includes(other) && !taken.includes(other));
          const lines = all(`[data-probe="${index}-${position}"]`) as unknown as SVGPathElement[];
          const wordsAt = middleOf(one(`[data-ink="${position}"]`, question).parentElement!);

          lines.forEach((path, rank) => probes.push({ path, x: wordsAt, body: measured[rank] }));
          gsap.set(lines as unknown as HTMLElement[], { autoAlpha: 0, strokeDashoffset: 1 });

          timeline.to(all(`[data-ink="${position}"]`, question), { scaleX: 1, duration: 0.22, ease: "power2.out" }, cursor);
          timeline.to(spectators.map((other) => other.tile), { opacity: (spectator: number) => spectators[spectator].depth.rest * SPECTATING, duration: 0.2, ease: "none" }, cursor);
          timeline.to(measured.map((other) => other.tile), { opacity: 1, duration: 0.16, ease: "none" }, cursor);
          timeline.set(measured.map((other) => other.element), { zIndex: 1 }, cursor);
          timeline.to(lines, { autoAlpha: 0.7, duration: 0.04, ease: "none" }, cursor + 0.04);
          timeline.to(lines, { strokeDashoffset: 0, duration: 0.2, ease: "power2.out", stagger: 0.03 }, cursor + 0.04);

          // All at once. The weakest stop first and drop out, which leaves the one that scored highest.
          const countAt = cursor + 0.14;
          rivals.forEach((rival, rank) => {
            const outAt = measure(rival, toolScore(rival.id, rank), colour, countAt) + 0.08;
            timeline.to(rival.tile, { opacity: rival.depth.rest * SPECTATING, duration: 0.2, ease: "none" }, outAt);
            timeline.to(rival.readout, { autoAlpha: 0, duration: 0.16, ease: "none" }, outAt);
            timeline.to(lines[rank], { autoAlpha: 0, duration: 0.16, ease: "none" }, outAt);
          });
          const foundAt = measure(body, toolScore(body.id), colour, countAt) + 0.1;

          // Caught: it shows what it found, and pushes its neighbours aside.
          timeline.to(body.tile, { scale: 1.1, duration: 0.1, ease: "power2.out" }, foundAt - 0.1);
          timeline.to(find.step, { autoAlpha: 1, duration: 0.1, ease: "none" }, foundAt);
          timeline.to(find, { grow: 1, duration: 0.3, ease: "back.out(1.6)" }, foundAt);
          timeline.to(body.tile, { opacity: 0, duration: 0.1, ease: "none" }, foundAt + 0.06);
          timeline.to(body.readout, { autoAlpha: 0, duration: 0.1, ease: "none" }, foundAt);
          timeline.to(lines[rivals.length], { autoAlpha: 0, duration: 0.2, ease: "none" }, foundAt + 0.06);
          bodies
            .filter((other) => other !== body && Math.hypot(other.homeX - body.homeX, other.homeY - body.homeY) < CATCH_REACH)
            .forEach((other) => shove(other, body.homeX, body.homeY, CATCH_PUSH, foundAt));

          // Joined to what it found before, which is how the route takes shape.
          const link = paths[position - 1];
          if (link) {
            timeline.to(link, { autoAlpha: 0.75, duration: 0.04, ease: "none" }, foundAt + 0.04);
            timeline.to(link, { strokeDashoffset: 0, duration: 0.32, ease: "power2.inOut" }, foundAt + 0.04);
          }

          // Everything else comes back, for the next thing to be measured against.
          const back = bodies.filter((other) => other !== body && !taken.includes(other));
          timeline.to(back.map((other) => other.tile), { opacity: (other: number) => back[other].depth.rest, duration: 0.22, ease: "none" }, foundAt + 0.05);
          timeline.set(measured.map((other) => other.element), { zIndex: 0 }, foundAt + 0.28);
          cursor = foundAt + SETTLE_SECONDS;
        });

        // The route is complete. Everything else falls back, the finds gather, and the answer comes up.
        timeline.to(others, { opacity: RECEDED, scale: 1, duration: 0.4, ease: "none" }, cursor);
        timeline.to(field, { scale: FIELD_RECEDED, duration: 0.8, ease: "power2.out" }, cursor);
        timeline.to(found, { landed: 1, duration: GATHER_SECONDS, ease: "power3.inOut", stagger: 0.05 }, cursor);
        const replyAt = cursor + GATHER_SECONDS * 0.7;
        timeline.to(list.querySelector("[data-reply]"), { autoAlpha: 1, y: 0, scale: 1, duration: 0.34, ease: "power3.out" }, replyAt);
        timeline.to(list.querySelector("[data-note]"), { autoAlpha: 1, y: 0, duration: 0.3 }, replyAt + 0.18);

        // Read, then the box comes back down for the next question, which starts again from everything.
        const leaveAt = replyAt + ANSWER_SECONDS + item.reply.length * ANSWER_SECONDS_PER_LETTER;
        timeline.to(list, { autoAlpha: 0, duration: FADE_SECONDS, ease: "none" }, leaveAt);
        timeline.to(question, { opacity: 0, y: -6, duration: 0.18, ease: "power1.in" }, leaveAt);
        timeline.to(composer, { y: askedAt, duration: RISE_SECONDS, ease: "power3.inOut" }, leaveAt + 0.04);
        timeline.to(tiles, { opacity: waitingOf, scale: 1, duration: 0.36, ease: "none" }, leaveAt + 0.06);
        timeline.to(field, { scale: 1, duration: 0.45, ease: "power2.out" }, leaveAt + 0.06);
        if (lists[index + 1]) timeline.to(lists[index + 1], { autoAlpha: 1, duration: 0.01, ease: "none" }, leaveAt + FADE_SECONDS);
        return leaveAt + RISE_SECONDS;
      };

      let at = 0.1;
      questions.forEach((_, index) => {
        at = ask(index, at);
      });
      timeline.set({}, {}, at);

      moved.push(dust, ...bodies.map((body) => body.element));

      /** Everything that moves between the timeline's beats. Nothing here reads the layout. */
      tick = (time) => {
        bodies.forEach((body) => {
          const { seed, depth } = body;
          const pace = 0.3 + (seed % 7) * 0.035;
          const dx = (Math.sin(time * pace + seed * 2.4) * 0.7 + Math.sin(time * pace * 0.53 + seed * 1.1) * 0.3) * depth.drift;
          const dy = (Math.cos(time * pace * 0.83 + seed * 1.7) * 0.7 + Math.sin(time * pace * 0.41 + seed * 0.6) * 0.3) * depth.drift;
          body.x = body.homeX + body.pushX + dx;
          body.y = body.homeY + body.pushY + dy;
          body.element.style.transform = `translate(-50%, -50%) translate3d(${body.x - body.homeX}px, ${body.y - body.homeY}px, 0) scale(${depth.scale})`;
        });

        dust.style.transform = `translate3d(${Math.sin(time * 0.06) * 8}px, ${Math.cos(time * 0.05) * 6}px, 0)`;

        finds.forEach((find) => {
          if (find.step.style.visibility === "hidden") return;
          const halfWidth = (find.width * FLOATING) / 2 + FLOAT_MARGIN;
          const halfHeight = (find.height * FLOATING) / 2 + FLOAT_MARGIN;
          find.x = between(within(find.body.x, halfWidth, frameWidth - halfWidth), find.slotX, find.landed);
          find.y = between(within(find.body.y, halfHeight, frameHeight - halfHeight), find.slotY, find.landed);
          const size = between(FLOATING, 1, find.landed) * find.grow;
          find.step.style.transform = `translate3d(${find.x - find.slotX}px, ${find.y - find.slotY}px, 0) scale(${size})`;
        });

        links.forEach(({ path, from, to }) => {
          if (path.style.visibility !== "hidden") path.setAttribute("d", `M ${from.x} ${from.y} L ${to.x} ${to.y}`);
        });

        probes.forEach(({ path, x, body }) => {
          if (path.style.visibility !== "hidden") path.setAttribute("d", `M ${x} ${askedFrom} L ${body.x} ${body.y}`);
        });
      };
      tick(gsap.ticker.time);

      const centre = one("[data-centre]");
      stopWatching = watchCentre(centre, root, ({ playing, visible }) => {
        timeline.paused(!playing);
        if (visible) gsap.ticker.add(tick!);
        else gsap.ticker.remove(tick!);
      });
    }, stage);

    return () => {
      stopWatching?.();
      if (tick) gsap.ticker.remove(tick);
      context.revert();
      moved.forEach((element) => element.style.removeProperty("transform"));
    };
  }, [demo, engine, resized]);

  return (
    <div aria-hidden="true" className={styles.root} ref={rootRef}>
      <div className={styles.scaler} ref={scalerRef}>
        <div className={styles.stage} ref={stageRef} style={fit === null ? undefined : ({ "--fit": fit, opacity: ready ? 1 : 0, transform: `scale(${fit})` } as CSSProperties)}>
          <i className={styles.centre} data-centre />

          <div className={styles.composer} data-composer>
            <span className={styles.questions}>
              {shown.map((item) => (
                <span className={styles.question} data-question key={item.question}>
                  {splitQuestion(item).map((part) =>
                    part.clue === undefined ? (
                      part.text
                    ) : (
                      <span className={`${styles.words} ${CLUE_CLASSES[part.clue]}`} key={part.text}>
                        <i data-ink={part.clue} />
                        {part.text}
                      </span>
                    ),
                  )}
                </span>
              ))}
              {live ? <i className={styles.caret} data-caret /> : null}
            </span>
          </div>

          <div className={styles.window} data-window>
            <i className={styles.dust} data-dust style={{ boxShadow: DUST }} />
            <div className={styles.field} data-field>
              {live ? <i className={styles.pulse} data-pulse /> : null}
              {live ? (
                <svg className={styles.probes}>
                  {demo.questions.flatMap((item, index) =>
                    item.clues.flatMap((clue, position) =>
                      [...clue.tries, clue.tool].map((id) => <path data-probe={`${index}-${position}`} d="" key={`${index}-${id}`} pathLength={1} stroke={CLUE_EDGES[position]} />),
                    ),
                  )}
                </svg>
              ) : null}
              {TOOL_FIELD.map(({ id, Icon, x, y, wideX, wideY, depth }) => (
                <span className={styles.body} data-body key={id} style={{ "--x": `${x}%`, "--y": `${y}%`, "--wide-x": `${wideX}%`, "--wide-y": `${wideY}%`, "--depth": DEPTHS[depth].scale } as CSSProperties}>
                  <span className={styles.tile}>
                    <Icon aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
                    {demo.tools[id]}
                  </span>
                  {live ? (
                    <span className={styles.readout} data-readout>
                      <i>
                        <b data-meter />
                      </i>
                      <span data-figure />
                    </span>
                  ) : null}
                </span>
              ))}
            </div>

            {shown.map((item) => (
              <div className={styles.list} data-list key={item.question}>
                {live ? (
                  <svg className={styles.links}>
                    {item.clues.slice(1).map((clue, position) => <path data-link d="" key={clue.tool} pathLength={1} stroke={CLUE_EDGES[position + 1]} />)}
                  </svg>
                ) : null}

                <div className={styles.outcome}>
                  <div className={styles.answer}>
                    <p className={styles.reply} data-reply>{item.reply}</p>
                    <p className={styles.note} data-note>
                      <ShieldCheckIcon aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.7} />
                      {demo.note}
                    </p>
                  </div>

                  <div className={live ? styles.chain : `${styles.chain} ${styles.joined}`}>
                    {item.clues.map((clue, position) => {
                      const Icon = toolIcon(clue.tool);
                      return (
                        <div className={`${styles.step} ${CLUE_CLASSES[position]}`} data-step key={clue.tool}>
                          <small className={styles.stepName}>
                            <Icon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.7} />
                            {demo.tools[clue.tool]}
                          </small>
                          {clue.result}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
