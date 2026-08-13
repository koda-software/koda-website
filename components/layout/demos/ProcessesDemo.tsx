"use client";

import { type CSSProperties, useCallback } from "react";
import type { ProcessesDemoContent } from "@/content/types";
import { DemoStage, type DemoApi } from "./DemoStage";
import { DemoView } from "./DemoView";
import shell from "./demoShell.module.css";
import styles from "./ProcessesDemo.module.css";

const STAGE_WIDTH = 1200;
const STAGE_HEIGHT = 455;
const CYCLE_MS = 27000;
/** One per board column, matched to the meaning of the stage. */
const COLUMN_COLORS = ["#38B6FF", "#F59E0B", "#A855F7", "#10B981"];
/** Which column each standing card sits in; the third column starts empty. */
const OTHER_CARD_COLUMNS = [0, 1, 3];

export function ProcessesDemo({ content }: { content: ProcessesDemoContent }) {
  const timeline = useCallback(
    ({ at, el, show, hide, click, caption, view, dot, hideCursor }: DemoApi) => {
      /** Slides the travelling card into column `index`, sizing it to that column. */
      const place = (index: number, instant = false) => {
        const column = el(`col-${index}`);
        const card = el("fly");
        const stageLabel = el("flyStage");
        if (!column || !card || !stageLabel) return;

        card.style.width = `${column.offsetWidth - 24}px`;
        if (instant) card.style.transition = "none";
        card.style.transform = `translate(${column.offsetLeft + 12}px, 48px)`;
        if (instant) {
          // Force the frame so the card lands without animating in from 0,0.
          void card.offsetWidth;
          card.style.transition = "";
        }
        card.style.setProperty("--c", COLUMN_COLORS[index]);
        stageLabel.textContent = content.columns[index];
        stageLabel.style.setProperty("--c", COLUMN_COLORS[index]);
      };

      at(0, () => {
        view("board");
        dot(1);
        caption(content.captions.board);
        place(0, true);
      });
      at(2200, () => place(1));
      at(3400, () => {
        dot(2);
        caption(content.captions.task);
      });
      at(4200, () => show("task"));
      at(6200, () => {
        dot(3);
        caption(content.captions.approval);
        place(2);
      });
      at(7200, () => show("approveBox"));
      at(8600, () => click("approveBtn"));
      at(9600, () => {
        hide("approveBox");
        el("fly")?.classList.add(styles.approved);
        place(3);
        hideCursor();
      });
      at(11200, () => {
        hide("task");
        caption(content.captions.done);
      });
    },
    [content],
  );

  return (
    <DemoStage onClass={styles.on} stageWidth={STAGE_WIDTH} cycleMs={CYCLE_MS} dotCount={3} glowX="20%" stageHeight={STAGE_HEIGHT} timeline={timeline}>
      <DemoView name="board">
        <div style={{ width: "100%" }}>
          <div className={styles.board}>
            {content.columns.map((column, index) => {
              const card = OTHER_CARD_COLUMNS.indexOf(index);

              return (
                <div className={styles.col} data-el={`col-${index}`} key={column}>
                  <div className={styles.colHead} style={{ "--c": COLUMN_COLORS[index] } as CSSProperties}>
                    <i />
                    {column}
                    <span>{card === -1 ? 0 : index === 0 ? 2 : 1}</span>
                  </div>
                  {card === -1 ? null : (
                    <>
                      <div style={{ height: 96 }} />
                      <div className={styles.mini}>
                        <b>{content.otherCards[card].number}</b>
                        <span>{content.otherCards[card].title}</span>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
            <div className={styles.flycard} data-el="fly" style={{ "--c": COLUMN_COLORS[0] } as CSSProperties}>
              <b>{content.focusCard.number}</b>
              <span>{content.focusCard.title}</span>
              <em data-el="flyStage">{content.columns[0]}</em>
            </div>
          </div>

          <div className={styles.bottom}>
            <div className={styles.tasks}>
              <div className={styles.tasksHead}>
                <svg>
                  <use href="#oa-i-user" />
                </svg>
                {content.tasksLabel}
              </div>
              <div className={styles.task} data-el="task">
                <span className={styles.avatar} />
                <div>
                  <b>{content.task.title}</b>
                  <span>{content.task.meta}</span>
                </div>
              </div>
            </div>

            <div className={styles.approve} data-el="approveBox">
              <span className={`${shell.tile} ${shell.tViolet}`}>
                <svg>
                  <use href="#oa-i-check" />
                </svg>
              </span>
              <div className={styles.approveText}>
                <b>{content.approvalLabel}</b>
                <span>{content.focusCard.number}</span>
              </div>
              <button className={`${shell.btn} ${shell.btnSm} ${shell.btnGhost}`} type="button">
                {content.rejectLabel}
              </button>
              <button className={`${shell.btn} ${shell.btnSm} ${shell.btnGreen}`} data-el="approveBtn" type="button">
                {content.approveLabel}
              </button>
            </div>
          </div>
        </div>
      </DemoView>
    </DemoStage>
  );
}
