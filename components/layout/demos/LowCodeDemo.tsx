"use client";

import { useCallback } from "react";
import type { LowCodeDemoContent } from "@/content/types";
import { DemoStage, type DemoApi } from "./DemoStage";
import { DemoView } from "./DemoView";
import shell from "./demoShell.module.css";
import styles from "./LowCodeDemo.module.css";

const STAGE_WIDTH = 860;
const STAGE_HEIGHT = 360;
const CYCLE_MS = 26000;

export function LowCodeDemo({ content }: { content: LowCodeDemoContent }) {
  const timeline = useCallback(
    ({ at, el, show, click, caption, view, dot, hideCursor }: DemoApi) => {
      at(0, () => {
        view("build");
        dot(1);
        caption(content.captions.condition);
      });
      at(900, () => show("block-0"));
      at(1500, () => show("block-1"));
      at(2100, () => show("block-2"));
      at(3000, () => {
        el("runBtn")?.classList.add(styles.on);
        click("runBtn");
      });
      at(4400, () => {
        view("fire");
        dot(2);
        caption(content.captions.fired);
        hideCursor();
      });
      at(5400, () => show("effect-0"));
      at(6200, () => show("newValue"));
      at(7200, () => show("effect-1"));
      at(9000, () => show("effect-2"));
      at(9800, () => show("blocked", styles.cut));
      at(11200, () => caption(content.captions.summary));
    },
    [content],
  );

  const [fieldBlock, operatorBlock, valueBlock] = content.condition;

  return (
    <DemoStage onClass={styles.on} stageWidth={STAGE_WIDTH} cycleMs={CYCLE_MS} dotCount={2} glowX="80%" stageHeight={STAGE_HEIGHT} timeline={timeline}>
      <DemoView name="build">
        <div className={styles.builder}>
          <div className={`${shell.lab} ${shell.labOnSurface}`}>{content.conditionLabel}</div>
          <div className={styles.condition}>
            <span className={styles.block} data-el="block-0">
              {fieldBlock}
            </span>
            <span className={`${styles.block} ${styles.blockOperator}`} data-el="block-1">
              {operatorBlock}
            </span>
            <span className={`${styles.block} ${styles.blockValue}`} data-el="block-2">
              <i />
              {valueBlock}
            </span>
          </div>
          <button className={`${shell.btn} ${styles.runButton}`} data-el="runBtn" type="button">
            {content.runLabel}
          </button>
        </div>
      </DemoView>

      <DemoView name="fire">
        <div className={styles.effects}>
          <div className={`${shell.lab} ${shell.labOnSurface}`} style={{ marginBottom: 16 }}>
            {content.firedLabel}
          </div>

          <div className={styles.effect} data-el="effect-0">
            <span className={`${shell.tile} ${shell.tBlue}`}>
              <svg>
                <use href="#oa-i-check" />
              </svg>
            </span>
            <div className={styles.effectText}>
              <b>{content.fieldEffect.title}</b>
              <span>{content.fieldEffect.detail}</span>
            </div>
            <div className={styles.swap}>
              <span className={styles.oldValue}>{content.fieldEffect.from}</span>
              <svg>
                <use href="#oa-i-arrow" />
              </svg>
              <span className={styles.newValue} data-el="newValue">
                {content.fieldEffect.to}
              </span>
            </div>
          </div>

          <div className={styles.effect} data-el="effect-1">
            <span className={`${shell.tile} ${shell.tViolet}`}>
              <svg>
                <use href="#oa-i-bell" />
              </svg>
            </span>
            <div className={styles.effectText}>
              <b>{content.notificationEffect.title}</b>
              <span>{content.notificationEffect.detail}</span>
            </div>
          </div>

          <div className={styles.effect} data-el="effect-2">
            <span className={`${shell.tile} ${shell.tRed}`}>
              <svg>
                <use href="#oa-i-lock" />
              </svg>
            </span>
            <div className={styles.effectText}>
              <b>{content.blockEffect.title}</b>
              <span>{content.blockEffect.detail}</span>
            </div>
            <span className={styles.blocked} data-el="blocked">
              <svg>
                <use href="#oa-i-lock" />
              </svg>
              {content.blockEffect.transition}
            </span>
          </div>
        </div>
      </DemoView>
    </DemoStage>
  );
}
