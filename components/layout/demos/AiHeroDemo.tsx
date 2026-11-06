"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import type { gsap as GsapNamespace } from "gsap";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right.mjs";
import type { AiHeroDemoContent, AiHeroDemoKey } from "@/content/types";
import { useStageScale } from "../useStageScale";
import styles from "./AiHeroDemo.module.css";

type GsapModule = { gsap: typeof GsapNamespace };
type Box = { x: number; y: number; w: number; h: number };

const STAGE_WIDTH = 640;
const STAGE_HEIGHT = 562;
const ROW_HEIGHT = 48;
/** The space above the sentence in the message box, and below it, where the send button sits. */
const COMPOSER_TOP = 26;
const COMPOSER_FOOT = 66;
/** Height of the caret, which sits on the letters the same way the swipe does. */
const CARET_HEIGHT = 38;
/** How long a word takes to travel from the sentence to its place on the page. */
const GLIDE_SECONDS = 0.72;
/** Height of the marker swipe behind a word, how far it runs past the word, and the slant of its tip. */
const SWIPE_HEIGHT = 38;
const SWIPE_OVERHANG = 14;
const SWIPE_SLANT = 6;
/** The letters sit above the middle of their line, so the swipe does too. */
const SWIPE_LIFT = 2.5;
/** The marker goes on wet and dries lighter. */
const INK_WET = 0.44;
const INK_DRY = 0.27;
/** The page stands in the banner at a slight lean, the way the dashboard does on the home page, only gentler. */
const PAGE_LENS = 1200;
const PAGE_TILT = { rotateX: 3, rotateY: -8, rotateZ: -1.5, scale: 0.98, y: 4 };
/** Where it swings up from: further back and turned away, so it stands up into place rather than sliding in. */
const PAGE_ENTRY = { rotateX: 16, rotateY: -22, rotateZ: 2, scale: 0.9, y: 130 };
/** The long tail is what makes it settle; it has to be still before the first word lands on it. */
const PAGE_ENTRY_SECONDS = 1.3;
const PAGE_ENTRY_EASE = "power4.out";
const PAGE_FADE_SECONDS = 0.32;
/** Once finished it drifts this far from its pose. The lengths share no rhythm, so the drift never visibly repeats. */
const PAGE_DRIFT = [
  { rotateY: PAGE_TILT.rotateY + 1, duration: 7 },
  { rotateX: PAGE_TILT.rotateX + 0.7, duration: 5.3 },
  { y: PAGE_TILT.y - 4, duration: 4.1 },
];
/** The same pose as CSS, in the order GSAP writes it, for a reader with reduced motion. */
const pageTiltCss = `perspective(${PAGE_LENS}px) translateY(${PAGE_TILT.y}px) rotate(${PAGE_TILT.rotateZ}deg) rotateY(${PAGE_TILT.rotateY}deg) rotateX(${PAGE_TILT.rotateX}deg) scale(${PAGE_TILT.scale})`;

const markKeys: AiHeroDemoKey[] = ["invoices", "client", "overdue", "reminder"];

/**
 * One colour per thing the request asked for. It is what ties a word to the
 * part of the page it became, so it follows the word the whole way: the marker
 * in the sentence, the label under it, the word in flight and the mark that
 * stays on the page.
 */
const keyColors: Record<AiHeroDemoKey, { onDark: string; onLight: string }> = {
  client: { onDark: "#7ee7ff", onLight: "#0788a8" },
  invoices: { onDark: "#86e5a8", onLight: "#15905a" },
  overdue: { onDark: "#ffc266", onLight: "#c2650a" },
  reminder: { onDark: "#9fc3ff", onLight: "#1f6fd6" },
};

const keyStyle = (key: AiHeroDemoKey) => ({ "--key": keyColors[key].onDark, "--key-ink": keyColors[key].onLight }) as CSSProperties;

const formatTotal = (value: number, separator: string) =>
  Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);

/*
 * One closed shape per word, so the ink has a single, even opacity however it
 * is drawn. The long edges wander a little and the ends lean the same way as
 * the tip that draws them, which is what makes it read as a marker stroke.
 */
const swipeShape = (width: number) => {
  const h = SWIPE_HEIGHT;
  return `M ${SWIPE_SLANT + 1} 3 C ${width * 0.3} 0, ${width * 0.62} 5, ${width - 1} 1 L ${width - SWIPE_SLANT - 1} ${h - 2} C ${width * 0.66} ${h + 1}, ${width * 0.34} ${h - 4}, 1 ${h - 1} Z`;
};

function Sentence({ sentence }: { sentence: AiHeroDemoContent["sentence"] }) {
  return (
    <p className={styles.sentence} data-el="sentence">
      {sentence.map((segment, index) =>
        segment.key ? (
          <span className={styles.keyWord} data-key={segment.key} data-word key={segment.text}>
            {segment.text}
          </span>
        ) : (
          segment.text.split(/(\s+)/).map((part, partIndex) =>
            part.trim() ? (
              <span className={styles.word} data-plain data-word key={`${index}-${partIndex}`}>
                {part}
              </span>
            ) : (
              part
            ),
          )
        ),
      )}
    </p>
  );
}

/**
 * The hero of the contextual AI page. The request is written in a message box
 * to the reader's own agent, never to anything inside Opero, and waits there for
 * the reader to press send. It is then highlighted, and its marked words glide
 * out of the box into the page and dissolve into the parts they named.
 *
 * The markup is the finished block, which is what a reader with reduced motion
 * gets. The timeline measures that state first and only then hides things, so
 * every landing spot comes from the real layout in either language.
 */
export function AiHeroDemo({ demo }: { demo: AiHeroDemoContent }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { scale, scalerRef } = useStageScale(STAGE_WIDTH);
  const [ready, setReady] = useState(false);
  const measured = scale !== null;
  const { block, page } = demo;

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!measured || !root || !stage) return undefined;

    let cancelled = false;
    let context: gsap.Context | undefined;
    let observer: IntersectionObserver | undefined;
    /** True while the story stands at the send button, which only the reader can move it past. */
    let waiting = false;
    /** True once the story is over and only the idle drift is left. */
    let finished = false;

    const setup = async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setReady(true);
        return;
      }

      const [{ gsap }] = await Promise.all([import("gsap") as Promise<GsapModule>, document.fonts.ready]);
      if (cancelled) return;

      stage.dataset.live = "";

      const el = (name: string) => stage.querySelector<HTMLElement>(`[data-el="${name}"]`)!;
      const all = (selector: string) => Array.from(stage.querySelectorAll<HTMLElement>(selector));
      const box = (node: Element): Box => {
        const frame = stage.getBoundingClientRect();
        const rect = node.getBoundingClientRect();
        const k = frame.width / STAGE_WIDTH;
        return { x: (rect.left - frame.left) / k, y: (rect.top - frame.top) / k, w: rect.width / k, h: rect.height / k };
      };
      const fontSize = (node: Element) => parseFloat(getComputedStyle(node).fontSize);

      context = gsap.context(() => {
        const keyWord = (key: AiHeroDemoKey) => stage.querySelector<HTMLElement>(`[data-key="${key}"]`)!;
        const words = all("[data-word]");
        const plainWords = all("[data-plain]");
        const pageEl = el("page");
        const rows = all("[data-row]");
        const pills = all("[data-pill]");
        const overdueWord = keyWord("overdue");
        const messageBox = el("composer");
        const caret = el("caret");
        const send = el("send") as HTMLButtonElement;

        // The box is cut to the sentence, which runs longer in some languages, and sits in the middle of the stage.
        const composerHeight = el("sentence").offsetHeight + COMPOSER_TOP + COMPOSER_FOOT;
        const composerTop = Math.round((STAGE_HEIGHT - composerHeight) / 2);
        messageBox.style.top = `${composerTop}px`;
        messageBox.style.height = `${composerHeight}px`;
        el("sentence").style.top = `${composerTop + COMPOSER_TOP}px`;

        // One word has to land in two rows, so it gets a twin sitting exactly on top of it.
        const twin = overdueWord.cloneNode(true) as HTMLElement;
        const overdueBox = box(overdueWord);
        const sentenceBox = box(el("sentence"));
        twin.removeAttribute("data-word");
        twin.className = `${styles.keyWord} ${styles.twin}`;
        twin.style.left = `${overdueBox.x - sentenceBox.x}px`;
        twin.style.top = `${overdueBox.y - sentenceBox.y}px`;
        el("sentence").append(twin);

        // Every landing spot is read now, with the page standing as it will when the words reach it.
        gsap.set(pageEl, { ...PAGE_TILT, transformPerspective: PAGE_LENS });
        markKeys.forEach((key) => {
          const wordBox = box(keyWord(key));
          const tag = stage.querySelector<HTMLElement>(`[data-tag="${key}"]`)!;
          const mark = stage.querySelector<HTMLElement>(`[data-mark="${key}"]`)!;
          const markWidth = wordBox.w + SWIPE_OVERHANG * 2;
          mark.style.left = `${wordBox.x - SWIPE_OVERHANG}px`;
          const swipeMiddle = wordBox.y + wordBox.h / 2 - SWIPE_LIFT;
          mark.style.top = `${swipeMiddle - SWIPE_HEIGHT / 2}px`;
          mark.style.width = `${markWidth}px`;
          mark.querySelector("path")!.setAttribute("d", swipeShape(markWidth));
          tag.style.left = `${Math.min(wordBox.x, STAGE_WIDTH - tag.offsetWidth)}px`;
          tag.style.top = `${swipeMiddle + SWIPE_HEIGHT / 2 + 3}px`;
        });

        /** The part of a mark that has been drawn so far, with the slanted edge of the tip at `edge`. */
        const sweepTo = (edge: number) =>
          `polygon(-4px -4px, ${edge}px -4px, ${edge - SWIPE_SLANT}px ${SWIPE_HEIGHT + 4}px, -4px ${SWIPE_HEIGHT + 4}px)`;

        const flight = (word: HTMLElement, target: Element, key: AiHeroDemoKey) => {
          const from = box(word);
          const to = box(target);
          const ratio = (fontSize(target) / fontSize(word)) * PAGE_TILT.scale;
          return {
            color: keyColors[key].onLight,
            ratio,
            x: to.x - from.x,
            y: to.y + to.h / 2 - (from.y + (from.h * ratio) / 2),
          };
        };

        const flights = {
          client: flight(keyWord("client"), el("pageTitle"), "client"),
          invoices: flight(keyWord("invoices"), el("blockTitle"), "invoices"),
          overdueA: flight(overdueWord, pills[0].querySelector("em")!, "overdue"),
          overdueB: flight(twin, pills[1].querySelector("em")!, "overdue"),
          reminder: flight(keyWord("reminder"), el("actionWord"), "reminder"),
        };

        // Where the caret stands once each word is down, and where it waits before the first.
        const caretY = (word: Box) => word.y + word.h / 2 - SWIPE_LIFT - CARET_HEIGHT / 2;
        const firstWord = box(words[0]);
        const caretStops = words.map((word) => {
          const wordBox = box(word);
          return { x: wordBox.x + wordBox.w + 3, y: caretY(wordBox) };
        });

        // Only now does the stage move away from its finished state.
        gsap.set(messageBox, { autoAlpha: 0, y: 14 });
        gsap.set(caret, { autoAlpha: 0, x: firstWord.x, y: caretY(firstWord) });
        gsap.set(send, { opacity: 0.4 });
        gsap.set(words, { autoAlpha: 0, y: 10 });
        gsap.set(twin, { autoAlpha: 0 });
        gsap.set([keyWord("client"), keyWord("invoices"), overdueWord, twin, keyWord("reminder")], { transformOrigin: "0 0" });
        gsap.set(all("[data-mark]"), { clipPath: sweepTo(0) });
        gsap.set(all("[data-mark] svg"), { opacity: INK_WET });
        gsap.set(all("[data-mark] i"), { opacity: 0 });
        gsap.set(all("[data-tag]"), { autoAlpha: 0, y: -5 });
        gsap.set(pageEl, { ...PAGE_ENTRY, autoAlpha: 0 });
        gsap.set([el("blockTitle"), el("cols"), el("total"), el("action")], { autoAlpha: 0 });
        gsap.set(el("actionWord"), { autoAlpha: 0 });
        gsap.set(el("actionBefore"), { autoAlpha: 0 });
        gsap.set(el("asOf"), { autoAlpha: 0 });
        gsap.set([el("rule"), el("footRule"), el("titleMark"), el("blockMark"), el("actionFill")], { scaleX: 0 });
        gsap.set(rows, { clipPath: "inset(0 100% 0 0)" });
        gsap.set(all("[data-pill] em"), { autoAlpha: 0 });
        gsap.set(all("[data-pill] i"), { scaleX: 0 });

        const total = { value: 0 };
        const totalValue = el("totalValue");
        const paintTotal = () => {
          totalValue.textContent = formatTotal(total.value, block.thousandsSeparator);
        };
        paintTotal();

        // It plays once and stays on the finished block.
        const timeline = gsap.timeline({ defaults: { ease: "power3.out" }, paused: true });

        /**
         * One move, start to finish: position and size share an ease, so the word
         * never stops or changes direction on its way to the spot it dissolves into.
         * It takes on the lean of the page as it goes, so it lands square on its target.
         */
        const glide = (word: HTMLElement, to: (typeof flights)[keyof typeof flights], at: number) => {
          const lands = at + GLIDE_SECONDS;
          timeline.to(word, { x: to.x, y: to.y, scale: to.ratio, rotation: PAGE_TILT.rotateZ, duration: GLIDE_SECONDS, ease: "power3.inOut" }, at);
          timeline.to(word, { autoAlpha: 0, duration: 0.18, ease: "none" }, lands - 0.18);
          return lands;
        };

        /** The real element comes up under the word as it goes, so there is no moment of swapping. */
        const takeOver = (target: Element, lands: number) => {
          timeline.to(target, { autoAlpha: 1, duration: 0.18, ease: "none" }, lands - 0.18);
        };

        // 1. Said. The box opens and words arrive at the pace of speech, with a breath at each full stop.
        timeline.to(messageBox, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.1);
        timeline.to(caret, { autoAlpha: 1, duration: 0.12, ease: "none" }, 0.42);
        timeline.to(send, { opacity: 1, duration: 0.25, ease: "none" }, 0.7);
        let cursor = 0.6;
        words.forEach((word, index) => {
          timeline.to(word, { autoAlpha: 1, y: 0, duration: 0.45 }, cursor);
          timeline.set(caret, caretStops[index], cursor);
          cursor += /[.]$/.test(word.textContent ?? "") ? 0.44 : 0.14;
        });

        // The message waits for the reader, and goes when they send it.
        const sentAt = cursor + 0.5;
        timeline.addPause(sentAt, () => {
          waiting = true;
          send.disabled = false;
        });
        const onSend = () => {
          waiting = false;
          send.disabled = true;
          timeline.play();
        };
        send.addEventListener("click", onSend);
        timeline.to(caret, { autoAlpha: 0, duration: 0.1, ease: "none" }, sentAt);
        timeline.to(send, { scale: 0.84, duration: 0.1, ease: "power2.in" }, sentAt);
        timeline.to(send, { scale: 1, opacity: 0.4, duration: 0.3, ease: "back.out(3)" }, sentAt + 0.1);

        // 2. Read. Each thing the request asks for gets its marker and the name it has in the system.
        const readAt = sentAt + 0.5;
        timeline.to(plainWords, { opacity: 0.3, duration: 0.6, ease: "power1.out" }, readAt);
        let markAt = readAt + 0.2;
        markKeys.forEach((key) => {
          const mark = stage.querySelector<HTMLElement>(`[data-mark="${key}"]`)!;
          const width = mark.offsetWidth;
          // A hand takes longer over a longer phrase, at a pace the eye can follow.
          const sweep = 0.24 + width / 1000;
          const tip = mark.querySelector("i")!;
          timeline.to(mark, { clipPath: sweepTo(width + SWIPE_SLANT + 2), duration: sweep, ease: "sine.inOut" }, markAt);
          timeline.fromTo(tip, { x: -SWIPE_SLANT }, { x: width, duration: sweep, ease: "sine.inOut", immediateRender: false }, markAt);
          timeline.to(tip, { opacity: 0.85, duration: 0.1, ease: "none" }, markAt + 0.02);
          timeline.to(tip, { opacity: 0, duration: 0.16, ease: "none" }, markAt + sweep - 0.16);
          timeline.to(mark.querySelector("svg"), { opacity: INK_DRY, duration: 0.8, ease: "power1.out" }, markAt + sweep);
          timeline.to(stage.querySelector(`[data-tag="${key}"]`), { autoAlpha: 1, y: 0, duration: 0.32 }, markAt + sweep - 0.1);
          markAt += sweep + 0.12;
        });

        // 3. Built. What was not marked goes, and the page swings up under the words that are left.
        const buildAt = markAt + 1;
        timeline.to(messageBox, { autoAlpha: 0, duration: 0.34, ease: "power1.out" }, buildAt);
        timeline.to(all("[data-mark]"), { autoAlpha: 0, duration: 0.3, ease: "power1.out" }, buildAt);
        timeline.to(all("[data-tag]"), { autoAlpha: 0, duration: 0.26, ease: "power1.out" }, buildAt);
        timeline.to(plainWords, { autoAlpha: 0, y: 26, duration: 0.46, ease: "power2.in", stagger: { amount: 0.3, from: "random" } }, buildAt);
        const entryAt = buildAt + 0.1;
        timeline.to(pageEl, { autoAlpha: 1, duration: PAGE_FADE_SECONDS, ease: "power1.out" }, entryAt);
        timeline.to(pageEl, { ...PAGE_TILT, duration: PAGE_ENTRY_SECONDS, ease: PAGE_ENTRY_EASE }, entryAt);

        // A white word on a white page disappears, so the words take their colour as the page fades in under them.
        [
          { word: keyWord("client"), to: flights.client },
          { word: keyWord("invoices"), to: flights.invoices },
          { word: overdueWord, to: flights.overdueA },
          { word: twin, to: flights.overdueB },
          { word: keyWord("reminder"), to: flights.reminder },
        ].forEach(({ word, to }) => {
          timeline.to(word, { color: to.color, duration: PAGE_FADE_SECONDS, ease: "power1.out" }, entryAt);
        });

        // The words leave while the page is still settling, and the block forms around them.
        const glideAt = buildAt + 0.6;
        timeline.to(el("slot"), { autoAlpha: 0, duration: 0.3 }, glideAt);

        const clientLands = glide(keyWord("client"), flights.client, glideAt);
        timeline.to(el("titleMark"), { scaleX: 1, duration: 0.36, ease: "power2.inOut" }, clientLands - 0.16);

        const invoicesLand = glide(keyWord("invoices"), flights.invoices, glideAt + 0.06);
        takeOver(el("blockTitle"), invoicesLand);
        timeline.to(el("blockMark"), { scaleX: 1, duration: 0.36, ease: "power2.inOut" }, invoicesLand - 0.1);

        timeline.to(el("rule"), { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, glideAt + 0.2);
        timeline.to(el("cols"), { autoAlpha: 1, duration: 0.3 }, glideAt + 0.3);
        timeline.to(rows, { clipPath: "inset(0 0% 0 0)", duration: 0.38, ease: "power2.inOut", stagger: 0.05 }, glideAt + 0.25);
        timeline.to(el("footRule"), { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, glideAt + 0.4);
        timeline.to(el("asOf"), { autoAlpha: 1, duration: 0.4 }, glideAt + 0.6);

        const overdueAt = glideAt + 0.22;
        timeline.set(twin, { autoAlpha: 1 }, overdueAt);
        const overdueALands = glide(overdueWord, flights.overdueA, overdueAt);
        const overdueBLands = glide(twin, flights.overdueB, overdueAt + 0.06);
        [
          { pill: pills[0], at: overdueALands },
          { pill: pills[1], at: overdueBLands },
        ].forEach(({ pill, at }) => {
          timeline.to(pill.querySelector("i"), { scaleX: 1, duration: 0.3, ease: "power2.inOut" }, at - 0.24);
          takeOver(pill.querySelector("em")!, at);
        });

        timeline.to(el("total"), { autoAlpha: 1, duration: 0.3 }, overdueBLands - 0.1);
        timeline.fromTo(total, { value: 0 }, { value: block.total, duration: 0.8, ease: "power2.out", immediateRender: false, onUpdate: paintTotal }, overdueBLands - 0.1);

        const reminderLands = glide(keyWord("reminder"), flights.reminder, glideAt + 0.36);
        timeline.set(el("action"), { autoAlpha: 1 }, reminderLands - 0.3);
        timeline.to(el("actionFill"), { scaleX: 1, duration: 0.34, ease: "power2.inOut" }, reminderLands - 0.3);
        takeOver(el("actionWord"), reminderLands);
        timeline.to(el("actionBefore"), { autoAlpha: 1, duration: 0.26 }, reminderLands - 0.06);

        // The finished page never quite stops, so it reads as something live rather than a picture.
        const idle = gsap.timeline({ defaults: { ease: "sine.inOut", repeat: -1, yoyo: true }, paused: true });
        PAGE_DRIFT.forEach((drift) => idle.to(pageEl, drift, 0));
        timeline.eventCallback("onComplete", () => {
          finished = true;
          idle.play();
        });

        observer = new IntersectionObserver(
          ([entry]) => {
            if (finished) idle.paused(!entry.isIntersecting);
            else if (!waiting) timeline.paused(!entry.isIntersecting);
          },
          { threshold: 0.2 },
        );
        observer.observe(root);

        return () => {
          send.removeEventListener("click", onSend);
          send.disabled = true;
        };
      }, stage);

      setReady(true);
    };

    void setup();

    return () => {
      cancelled = true;
      observer?.disconnect();
      context?.revert();
      stage.querySelector(`.${styles.twin}`)?.remove();
      delete stage.dataset.live;
    };
  }, [block, measured]);

  return (
    <div className={styles.root} ref={rootRef} style={{ "--stage-w": STAGE_WIDTH, "--stage-h": STAGE_HEIGHT, "--row-h": `${ROW_HEIGHT}px`, "--page-tilt": pageTiltCss } as CSSProperties}>
      <div className={styles.scaler} ref={scalerRef}>
        <div className={styles.stage} ref={stageRef} style={scale === null ? undefined : { opacity: ready ? 1 : 0, transform: `scale(${scale})` }}>
          <div className={styles.composer} data-el="composer">
            <button aria-label={demo.sendLabel} className={styles.send} data-el="send" disabled type="button">
              <ArrowRightIcon aria-hidden="true" className="h-[1.15rem] w-[1.15rem]" strokeWidth={2} />
            </button>
          </div>

          {/* Everything but the send button is illustration. */}
          <div aria-hidden="true" className={styles.scene}>

            <div className={styles.page} data-el="page">
              <i className={styles.glow} />
              <div className={styles.pageBody}>
                <div className={styles.pageHead}>
                  <div>
                    <span className={styles.crumb}>{page.breadcrumb}</span>
                    <p className={styles.pageTitle}>
                      <span data-el="pageTitle">{page.title}</span>
                      <i className={styles.titleMark} data-el="titleMark" style={keyStyle("client")} />
                    </p>
                  </div>
                  <span className={styles.status}>{page.status}</span>
                </div>
                <dl className={styles.fields}>
                  {page.fields.map((field) => (
                    <div key={field.label}>
                      <dt>{field.label}</dt>
                      <dd>{field.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className={styles.block}>
                  <div className={styles.slot} data-el="slot" />
                  <div className={styles.blockHead}>
                    <b className={styles.blockTitle}>
                      <span data-el="blockTitle">{block.title}</span>
                      <i className={styles.titleMark} data-el="blockMark" style={keyStyle("invoices")} />
                    </b>
                    <span className={styles.asOf} data-el="asOf">{block.asOf}</span>
                  </div>
                  <i className={styles.rule} data-el="rule" />
                  <div className={`${styles.line} ${styles.cols}`} data-el="cols">
                    {block.columns.map((column) => <span key={column}>{column}</span>)}
                    <span />
                  </div>
                  <div className={styles.rows}>
                    {block.rows.map((row) => (
                      <div className={`${styles.line} ${styles.row}`} data-row key={row.number}>
                        <span>{row.number}</span>
                        <span>{row.due}</span>
                        <span>{row.amount}</span>
                        {row.overdue ? (
                          <span className={styles.pill} data-pill>
                            <i />
                            <em>{block.overdueLabel}</em>
                          </span>
                        ) : (
                          <span />
                        )}
                      </div>
                    ))}
                  </div>
                  <i className={styles.rule} data-el="footRule" />
                  <div className={styles.foot}>
                    <div className={styles.total} data-el="total">
                      <span>{block.totalLabel}</span>
                      <b>
                        <span data-el="totalValue">{formatTotal(block.total, block.thousandsSeparator)}</span> {block.currency}
                      </b>
                    </div>
                    <span className={styles.action} data-el="action">
                      <i data-el="actionFill" />
                      <em>
                        <span data-el="actionBefore">{block.action.before}</span>
                        <span data-el="actionWord">{block.action.word}</span>
                      </em>
                    </span>
                  </div>
                </div>
              </div>
              <i className={styles.sheen} />
            </div>

            {markKeys.map((key) => (
              <span className={styles.swipe} data-mark={key} key={key} style={keyStyle(key)}>
                <svg height={SWIPE_HEIGHT}>
                  <path />
                </svg>
                <i />
              </span>
            ))}

            <Sentence sentence={demo.sentence} />
            <i className={styles.caret} data-el="caret" />

            {markKeys.map((key) => (
              <span className={styles.tag} data-tag={key} key={key} style={keyStyle(key)}>{demo.tags[key]}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
