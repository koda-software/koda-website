"use client";

import { useEffect, useRef } from "react";
import type { gsap as GsapNamespace } from "gsap";
import CircleCheckIcon from "lucide-react/dist/esm/icons/circle-check.mjs";
import FileSpreadsheetIcon from "lucide-react/dist/esm/icons/file-spreadsheet.mjs";
import ImageIcon from "lucide-react/dist/esm/icons/image.mjs";
import type { AiCompareDemoContent } from "@/content/types";
import styles from "./AiCompareDemo.module.css";
import { watchCentre } from "./watchCentre";

type GsapModule = { gsap: typeof GsapNamespace };

/** When both sides start, and how long the agent visibly works before a reply, on either side. */
const ASKED_AT = 0.3;
const THINK_SECONDS = 1;
/** Both sides hold on the question long enough to read it twice: dots first, then the first reply, at the same moment. */
const FIRST_DOTS_AT = ASKED_AT + 0.8;
const FIRST_REPLY_AT = ASKED_AT + 2.6;
/** How long each thing the connected agent fetches takes. */
const STEP_SECONDS = 0.7;
/** The pause after the reader's message, and between one attachment and the next. */
const YOU_SECONDS = 0.9;
const FILE_GAP = 0.22;
/** A reply stays alone long enough to be read, which is what paces the conversation. */
const READ_SECONDS = 0.6;
const READ_SECONDS_PER_LETTER = 0.02;
/** Seconds the finished comparison stays on screen, and the fade and pause before it starts over. */
const HOLD_SECONDS = 4.5;
const FADE_SECONDS = 0.8;
const RESTART_PAUSE_SECONDS = 0.4;

function Typing() {
  return (
    <i className={styles.typing} data-typing>
      <span />
      <span />
      <span />
    </i>
  );
}

/**
 * The same question asked twice at the same moment, in two narrow chats on one
 * screen. Each keeps its own pace: the connected agent fetches what it needs and
 * answers, while the manual side is still handing over exports, screenshots and
 * explanations, and ends without an answer.
 *
 * The markup is the finished state, which is what a reader with reduced motion
 * gets. The timeline measures the thread first and only then hides things.
 */
export function AiCompareDemo({ demo }: { demo: AiCompareDemoContent }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    let cancelled = false;
    let context: gsap.Context | undefined;
    let stopWatching: (() => void) | undefined;
    let hold: gsap.core.Tween | undefined;

    const setup = async () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const [{ gsap }] = await Promise.all([import("gsap") as Promise<GsapModule>, document.fonts.ready]);
      if (cancelled) return;

      root.dataset.live = "";

      context = gsap.context(() => {
        const el = (name: string) => root.querySelector<HTMLElement>(`[data-el="${name}"]`)!;
        const all = (selector: string) => Array.from(root.querySelectorAll<HTMLElement>(selector));
        const thread = el("thread");
        const messages = all("[data-message]");
        const steps = all("[data-step]");
        const answer = all("[data-answer]");

        // How far the thread has to climb to keep each message in view, read while everything is still laid out.
        const windowHeight = el("window").clientHeight;
        const climbs = messages.map((message) => -Math.max(0, message.offsetTop + message.offsetHeight + 16 - windowHeight));

        gsap.set(messages, { autoAlpha: 0, y: 8 });
        gsap.set(all("[data-file]"), { autoAlpha: 0, scale: 0.94 });
        gsap.set([el("question"), ...steps, ...answer], { autoAlpha: 0, y: 8 });
        gsap.set(all("[data-step] svg"), { autoAlpha: 0 });
        gsap.set(all("[data-typing]"), { autoAlpha: 0 });
        gsap.set(all("[data-typing] + p"), { autoAlpha: 0 });

        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          paused: true,
          onComplete: () => {
            hold = gsap.to(root, {
              opacity: 0,
              delay: HOLD_SECONDS,
              duration: FADE_SECONDS,
              ease: "power1.inOut",
              onComplete: () => {
                timeline.pause(0);
                hold = gsap.delayedCall(RESTART_PAUSE_SECONDS, () => {
                  gsap.set(root, { opacity: 1 });
                  timeline.play(0);
                });
              },
            });
          },
        });

        // The connected side: one question, and the agent goes and looks.
        timeline.to(el("question"), { autoAlpha: 1, y: 0, duration: 0.4 }, ASKED_AT);
        const fetchTyping = el("fetch").querySelector("[data-typing]");
        timeline.to(fetchTyping, { autoAlpha: 1, duration: 0.15, ease: "none" }, FIRST_DOTS_AT);
        timeline.to(fetchTyping, { autoAlpha: 0, duration: 0.12, ease: "none" }, FIRST_REPLY_AT);
        let fetchAt = FIRST_REPLY_AT;
        steps.forEach((step) => {
          timeline.to(step, { autoAlpha: 1, y: 0, duration: 0.25 }, fetchAt);
          timeline.to(step.querySelector("[data-spin]"), { autoAlpha: 0, duration: 0.12, ease: "none" }, fetchAt + STEP_SECONDS);
          timeline.to(step.querySelector("svg"), { autoAlpha: 1, duration: 0.16, ease: "none" }, fetchAt + STEP_SECONDS);
          fetchAt += STEP_SECONDS + 0.1;
        });
        const answerTyping = el("answer").querySelector("[data-typing]");
        timeline.to(answerTyping, { autoAlpha: 1, duration: 0.15, ease: "none" }, fetchAt);
        timeline.to(answerTyping, { autoAlpha: 0, duration: 0.12, ease: "none" }, fetchAt + THINK_SECONDS);
        timeline.to(answer, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.25 }, fetchAt + THINK_SECONDS);

        // The manual side: one message after another, each one more work.
        let cursor = ASKED_AT;
        messages.forEach((message, index) => {
          timeline.to(thread, { y: climbs[index], duration: 0.5, ease: "power2.inOut" }, cursor);
          timeline.to(message, { autoAlpha: 1, y: 0, duration: 0.4 }, cursor);

          const typing = message.querySelector("[data-typing]");
          if (typing) {
            timeline.to(typing, { autoAlpha: 1, duration: 0.15, ease: "none" }, cursor);
            const repliesAt = index === 1 ? FIRST_REPLY_AT : cursor + THINK_SECONDS;
            timeline.to(typing, { autoAlpha: 0, duration: 0.12, ease: "none" }, repliesAt);
            timeline.to(message.querySelector("p"), { autoAlpha: 1, duration: 0.3 }, repliesAt);
            cursor = repliesAt + READ_SECONDS + (message.textContent ?? "").length * READ_SECONDS_PER_LETTER;
            return;
          }

          const files = Array.from(message.querySelectorAll<HTMLElement>("[data-file]"));
          files.forEach((file, fileIndex) => {
            timeline.to(file, { autoAlpha: 1, scale: 1, duration: 0.3 }, cursor + fileIndex * FILE_GAP);
          });
          cursor = index === 0 ? FIRST_DOTS_AT : cursor + YOU_SECONDS + files.length * FILE_GAP;
        });

        stopWatching = watchCentre(el("centre"), root, ({ playing, visible }) => {
          timeline.paused(!playing);
          hold?.paused(!visible);
        });
      }, root);
    };

    void setup();

    return () => {
      cancelled = true;
      stopWatching?.();
      hold?.kill();
      context?.revert();
      delete root.dataset.live;
    };
  }, []);

  return (
    <div aria-hidden="true" className={styles.root} ref={rootRef}>
      <i className={styles.centre} data-el="centre" />
      <div className={styles.panel}>
        <p className={styles.panelLabel}>{demo.manual.label}</p>
        <div className={styles.window} data-el="window">
          <div className={styles.thread} data-el="thread">
            {demo.manual.messages.map((message) => (
              <div className={styles[message.from]} data-message key={message.text}>
                {message.files ? (
                  <div className={styles.files}>
                    {message.files.map((file) => (
                      <span className={styles.file} data-file key={file.name}>
                        {file.kind === "sheet" ? (
                          <FileSpreadsheetIcon aria-hidden="true" className="h-4 w-4 text-[#15905a]" strokeWidth={1.7} />
                        ) : (
                          <ImageIcon aria-hidden="true" className="h-4 w-4 text-[#1f6fd6]" strokeWidth={1.7} />
                        )}
                        {file.name}
                      </span>
                    ))}
                  </div>
                ) : null}
                {message.from === "agent" ? <Typing /> : null}
                <p>{message.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`${styles.panel} ${styles.connected}`}>
        <p className={styles.panelLabel}>{demo.connected.label}</p>
        <div className={styles.thread}>
          <div className={styles.you} data-el="question">
            <p>{demo.connected.question}</p>
          </div>
          <div className={styles.fetch} data-el="fetch">
            <Typing />
            <ul className={styles.steps}>
              {demo.connected.steps.map((step) => (
                <li data-step key={step}>
                  <span className={styles.stepIcon}>
                    <i data-spin />
                    <CircleCheckIcon aria-hidden="true" className="h-[18px] w-[18px] text-[#15905a]" strokeWidth={1.8} />
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.answer} data-el="answer">
            <Typing />
            <p data-answer>{demo.connected.answer}</p>
            <dl className={styles.rows}>
              {demo.connected.rows.map((row) => (
                <div data-answer key={row.number}>
                  <dt>{row.number}</dt>
                  <dd>{row.due}</dd>
                  <dd>{row.amount}</dd>
                </div>
              ))}
              <div className={styles.total} data-answer>
                <dt>{demo.connected.total.label}</dt>
                <dd>{demo.connected.total.amount}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
