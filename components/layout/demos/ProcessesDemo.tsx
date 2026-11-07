"use client";

import { type CSSProperties, useCallback } from "react";
import type { ProcessesDemoContent } from "@/content/types";
import { DemoStage, type DemoApi } from "./DemoStage";
import { DemoView } from "./DemoView";
import shell from "./demoShell.module.css";
import styles from "./ProcessesDemo.module.css";

const STAGE_WIDTH = 1200;
const STAGE_HEIGHT = 350;
const CYCLE_MS = 13500;
/** One per board column, matched to the meaning of the stage. */
const COLUMN_COLORS = ["#38B6FF", "#F59E0B", "#A855F7", "#10B981"];
/** Which column each standing card sits in; the third column starts empty. */
const OTHER_CARD_COLUMNS = [0, 1, 3];
/** Gap under the travelling card, matching the gap between standing cards. */
const CARD_GAP = 10;
/** Height the owner and action rows add to the card once open; see the stylesheet. */
const OWNER_ROW = 36;
const ACTION_ROW = 48;
/** When the card crosses into a column, relative to the 0.6s move, so it shoves the cards there. */
const PUSH_DELAY = 280;
const LEAVE_DELAY = 90;

export function ProcessesDemo({ content, tone }: { content: ProcessesDemoContent; tone?: "dark" | "light" }) {
  const timeline = useCallback(
    ({ at, el, show, hide, click, caption, moveTo, view, dot, hideCursor }: DemoApi) => {
      const counts = [2, 1, 0, 1];
      let baseHeight = 0;

      /** Opens a column's slot to fit the card, which pushes the cards below it down. */
      const openSlot = (index: number, extra = 0) => {
        const slot = el(`slot-${index}`);
        if (slot) slot.style.height = `${baseHeight + extra + CARD_GAP}px`;
      };
      const closeSlot = (index: number) => {
        const slot = el(`slot-${index}`);
        if (slot) slot.style.height = "0px";
      };

      /** Sends the card to the top of column `index`. Nothing in that column moves yet. */
      const fly = (index: number) => {
        const slot = el(`slot-${index}`);
        const card = el("fly");
        const label = el("flyStage");
        if (!slot || !card || !label) return;
        card.style.transform = `translate(${slot.offsetLeft}px, ${slot.offsetTop}px)`;
        card.style.setProperty("--c", COLUMN_COLORS[index]);
        label.textContent = content.columns[index];
        label.style.setProperty("--c", COLUMN_COLORS[index]);
      };

      const setCount = (index: number, change: number) => {
        counts[index] += change;
        const badge = el(`count-${index}`);
        if (badge) badge.textContent = String(counts[index]);
      };

      /** Leaves one column and arrives in the next: the old gap closes, then the new one opens. */
      const travel = (from: number, to: number, extra = 0) => {
        fly(to);
        at(LEAVE_DELAY, () => {
          closeSlot(from);
          setCount(from, -1);
        });
        at(PUSH_DELAY, () => {
          openSlot(to, extra);
          setCount(to, 1);
        });
      };

      /** Keeps the cursor on the card for the whole move: same duration, same easing. */
      const carryCursor = (to: number) => {
        const column = el(`col-${to}`);
        const slot = el(`slot-${to}`);
        if (!column || !slot) return;
        const dy = slot.offsetTop - column.offsetTop + baseHeight / 2 - column.offsetHeight / 2;
        moveTo(column, 0, dy);
      };

      const lift = () => el("fly")?.classList.add(styles.lifted);
      const drop = () => el("fly")?.classList.remove(styles.lifted);

      at(0, () => {
        view("board");
        dot(1);
        caption(content.captions.board);
        const slot = el("slot-0");
        const card = el("fly");
        if (!slot || !card) return;
        card.style.width = `${slot.offsetWidth}px`;
        baseHeight = card.offsetHeight;
        // Starts in place: the first column already holds the card, with no move to animate.
        card.style.transition = "none";
        slot.style.transition = "none";
        fly(0);
        openSlot(0);
        void card.offsetWidth;
        card.style.transition = "";
        slot.style.transition = "";
      });

      // Requested to Manager review, dragged by hand.
      at(1000, () => moveTo("fly"));
      at(1700, lift);
      at(1900, () => {
        travel(0, 1, OWNER_ROW);
        carryCursor(1);
      });
      at(2500, () => {
        drop();
        show("owner");
      });
      at(2800, () => {
        dot(2);
        caption(content.captions.task);
        hideCursor();
      });

      // Manager review to Finance approval, also by hand.
      at(4800, () => moveTo("fly"));
      at(5500, lift);
      at(5600, () => {
        dot(3);
        caption(content.captions.approval);
        hide("owner");
      });
      at(5700, () => {
        travel(1, 2, ACTION_ROW);
        carryCursor(2);
      });
      at(6300, () => {
        drop();
        show("actions");
      });

      // Approving sends it on, with nobody dragging it.
      at(7400, () => click("approveBtn"));
      at(8400, () => {
        hide("actions");
        el("fly")?.classList.add(styles.approved);
        hideCursor();
        travel(2, 3);
      });
      at(9200, () => caption(content.captions.done));
    },
    [content],
  );

  return (
    <DemoStage tone={tone} onClass={styles.on} stageWidth={STAGE_WIDTH} cycleMs={CYCLE_MS} dotCount={3} glowX="20%" stageHeight={STAGE_HEIGHT} maxHeight="21.875rem" timeline={timeline}>
      <DemoView name="board">
        <div className={styles.board}>
          {content.columns.map((column, index) => {
            const card = OTHER_CARD_COLUMNS.indexOf(index);

            return (
              <div className={styles.col} data-el={`col-${index}`} key={column}>
                <div className={styles.colHead} style={{ "--c": COLUMN_COLORS[index] } as CSSProperties}>
                  <i />
                  {column}
                  <span data-el={`count-${index}`}>{card === -1 ? 0 : 1}</span>
                </div>
                <div className={styles.slot} data-el={`slot-${index}`} />
                {card === -1 ? null : (
                  <div className={styles.mini}>
                    <b>{content.otherCards[card].number}</b>
                    <span>{content.otherCards[card].title}</span>
                  </div>
                )}
              </div>
            );
          })}
          <div className={styles.flycard} data-el="fly" style={{ "--c": COLUMN_COLORS[0] } as CSSProperties}>
            <b>{content.focusCard.number}</b>
            <span>{content.focusCard.title}</span>
            <em data-el="flyStage">{content.columns[0]}</em>
            <div className={styles.reveal} data-el="owner" style={{ "--row": `${OWNER_ROW}px` } as CSSProperties}>
              <div className={styles.owner}>
                <i className={styles.avatar} />
                {content.task.meta}
              </div>
            </div>
            <div className={styles.reveal} data-el="actions" style={{ "--row": `${ACTION_ROW}px` } as CSSProperties}>
              <div className={styles.actions}>
                <button className={`${shell.btn} ${shell.btnSm} ${shell.btnGhost}`} type="button">
                  {content.rejectLabel}
                </button>
                <button className={`${shell.btn} ${shell.btnSm} ${shell.btnGreen}`} data-el="approveBtn" type="button">
                  {content.approveLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DemoView>
    </DemoStage>
  );
}
