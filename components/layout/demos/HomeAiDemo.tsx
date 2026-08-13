"use client";

import { useCallback } from "react";
import type { HomeContent } from "@/content/types";
import { DemoStage, type DemoApi } from "./DemoStage";
import { DemoView } from "./DemoView";
import shell from "./demoShell.module.css";
import styles from "./HomeAiDemo.module.css";

const STAGE_WIDTH = 800;
const STAGE_HEIGHT = 670;

/**
 * The assistant conversation on the home page, told the way the contextual-AI
 * banner tells it: the question is typed into the composer and sent, the
 * assistant works, answers, and the answer arrives as a real report rather than
 * a paragraph. Replaces the click-to-play mock-up that used to sit here, so the
 * section shows its point without the reader having to press anything.
 */
export function HomeAiDemo({ chat }: { chat: HomeContent["ai"]["chat"] }) {
  const timeline = useCallback(
    ({ at, show, hide, type, caption, dot }: DemoApi) => {
      // The view is already on screen - the reader just pressed its send
      // button - so the first beat only sets the running state.
      at(0, () => {
        dot(1);
        caption(chat.captions.ask);
      });

      // The reader has just pressed send, so the demo picks up from there
      // rather than acting the click out.
      at(300, () => {
        show("ask");
        show("composer", styles.sent);
      });

      at(900, () => {
        dot(2);
        caption(chat.captions.working);
        show("typing");
      });
      at(2900, () => {
        hide("typing");
        show("reply");
        type("replyTxt", chat.assistantReply, 18);
      });

      at(4900, () => {
        dot(3);
        caption(chat.captions.report);
        show("report");
      });
      chat.tableRows.forEach((_, index) => at(5500 + index * 260, () => show(`row-${index}`)));
      at(7200, () => caption(chat.captions.scope));
    },
    [chat],
  );

  return (
    <DemoStage
      cycleMs={0}
      dotCount={3}
      initialView="chat"
      manual
      glowX="70%"
      onClass={styles.on}
      stageHeight={STAGE_HEIGHT}
      stageWidth={STAGE_WIDTH}
      maxHeight="34rem"
      timeline={timeline}
      tone="light"
    >
      <DemoView name="chat">
        <div className={styles.wrap}>
          <div className={styles.head}>
            <span className={`${shell.tile} ${shell.tViolet}`}>
              <svg>
                <use href="#oa-i-spark" />
              </svg>
            </span>
            <b>{chat.assistantName}</b>
            <span className={shell.chip}>{chat.scopeLabel}</span>
          </div>

          <div className={styles.thread}>
            <div className={`${styles.bubble} ${styles.bubbleMe}`} data-el="ask">
              {chat.userRequest}
            </div>

            <div className={styles.typing} data-el="typing">
              <i />
              <i />
              <i />
            </div>

            <div className={`${styles.bubble} ${styles.bubbleAi} ${styles.reply}`} data-el="reply">
              <span data-el="replyTxt" />
            </div>

            <div className={styles.report} data-el="report">
              <div className={styles.reportHead}>
                <b>{chat.reportTitle}</b>
                <span className={styles.pill}>{chat.statusLabel}</span>
                <span className={`${styles.pill} ${styles.pillMuted}`}>{chat.scopeLabel}</span>
              </div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {chat.tableHeaders.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chat.tableRows.map((row, index) => (
                    <tr data-el={`row-${index}`} key={row[0]}>
                      {row.map((cell) => (
                        <td key={cell}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.composer} data-el="composer">
            <div className={styles.input}>{chat.userRequest}</div>
            <button className={`${shell.btn} ${shell.btnSm}`} data-play type="button">
              {chat.sendLabel}
            </button>
          </div>

        </div>
      </DemoView>
    </DemoStage>
  );
}
