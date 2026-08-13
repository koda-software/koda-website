"use client";

import { useCallback } from "react";
import type { AiDemoContent } from "@/content/types";
import { DemoStage, type DemoApi } from "./DemoStage";
import { DemoView } from "./DemoView";
import shell from "./demoShell.module.css";
import styles from "./AiDemo.module.css";

const STAGE_WIDTH = 820;
const STAGE_HEIGHT = 440;
const CYCLE_MS = 26000;

export function AiDemo({ content }: { content: AiDemoContent }) {
  const timeline = useCallback(
    ({ at, el, show, click, type, caption, view, dot, hideCursor }: DemoApi) => {
      at(0, () => {
        view("ai");
        dot(1);
        caption(content.captions.ask);
      });
      at(700, () => {
        show("ask");
        type("askTxt", content.question, 32);
      });
      at(3000, () => {
        dot(2);
        caption(content.captions.reading);
        show("reading");
      });
      content.contextItems.forEach((_, index) => at(3500 + index * 400, () => show(`ctx-${index}`)));
      at(5400, () => {
        show("reading", styles.fadeout);
        show("ctxrow", styles.fadeout);
      });
      at(5800, () => {
        dot(3);
        caption(content.captions.answer);
        show("ans");
        type("ansTxt", content.answer, 16);
      });
      at(9800, () => show("action"));
      at(10800, () => click("applyBtn"));
      at(12000, () => {
        caption(content.captions.applied);
        show("actBtns", styles.gone);
        show("action", styles.applied);
        const tile = el("actTile");
        if (tile) tile.className = `${shell.tile} ${shell.tGreen}`;
        const label = el("actLab");
        if (label) label.textContent = content.appliedLabel;
        show("saved");
        hideCursor();
      });
    },
    [content],
  );

  return (
    <DemoStage
      cycleMs={CYCLE_MS}
      dotCount={3}
      glowX="70%"
      onClass={styles.on}
      stageHeight={STAGE_HEIGHT}
      stageWidth={STAGE_WIDTH}
      timeline={timeline}
    >
      <DemoView name="ai">
        <div className={styles.wrap}>
          <div className={styles.head}>
            <span className={`${shell.tile} ${shell.tViolet}`}>
              <svg>
                <use href="#oa-i-spark" />
              </svg>
            </span>
            <b>{content.assistantName}</b>
            <span className={shell.chip}>{content.contextLabel}</span>
          </div>

          <div className={styles.thread}>
            <div className={`${styles.bubble} ${styles.bubbleMe}`} data-el="ask">
              <span data-el="askTxt" />
            </div>

            <div className={styles.reading} data-el="reading">
              <svg>
                <use href="#oa-i-spark" />
              </svg>
              {content.readingLabel}
            </div>
            <div className={styles.contextRow} data-el="ctxrow">
              {content.contextItems.map((item, index) => (
                <span className={styles.context} data-el={`ctx-${index}`} key={item}>
                  <svg>
                    <use href={["#oa-i-db", "#oa-i-clock", "#oa-i-file"][index]} />
                  </svg>
                  {item}
                </span>
              ))}
            </div>

            <div className={`${styles.bubble} ${styles.bubbleAi}`} data-el="ans">
              <span data-el="ansTxt" />
            </div>

            <div className={styles.action} data-el="action">
              <span className={`${shell.tile} ${shell.tBlue}`} data-el="actTile">
                <svg>
                  <use href="#oa-i-check" />
                </svg>
              </span>
              <div className={styles.actionText}>
                <div className={`${shell.lab} ${styles.actionLabel}`} data-el="actLab">
                  {content.proposalLabel}
                </div>
                <b>
                  {content.proposalField}: {content.proposalValue}
                </b>
              </div>
              <div className={styles.actionButtons} data-el="actBtns">
                <button className={`${shell.btn} ${shell.btnSm} ${shell.btnGhost}`} type="button">
                  {content.dismissLabel}
                </button>
                <button className={`${shell.btn} ${shell.btnSm}`} data-el="applyBtn" type="button">
                  {content.applyLabel}
                </button>
              </div>
              <span className={styles.saved} data-el="saved">
                <svg>
                  <use href="#oa-i-check" />
                </svg>
                {content.savedLabel}
              </span>
            </div>
          </div>
        </div>
      </DemoView>
    </DemoStage>
  );
}
