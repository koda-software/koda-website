"use client";

import { type CSSProperties, useCallback } from "react";
import type { ReportsDemoContent } from "@/content/types";
import { DemoStage, type DemoApi } from "./DemoStage";
import { DemoView } from "./DemoView";
import shell from "./demoShell.module.css";
import styles from "./ReportsDemo.module.css";

const STAGE_WIDTH = 860;
const STAGE_HEIGHT = 360;
const CYCLE_MS = 24000;
/** One colour per category, reused by the table dot and its bar. */
const CATEGORY_COLORS = ["#EF4444", "#38B6FF", "#10B981", "#F59E0B"];
/** Bar heights in stage pixels, proportional to the values in the table. */
const BAR_HEIGHTS = [230, 152, 87, 30];

export function ReportsDemo({ content }: { content: ReportsDemoContent }) {
  const timeline = useCallback(
    ({ at, el, show, click, moveTo, caption, view, dot, hideCursor }: DemoApi) => {
      at(0, () => {
        view("table");
        dot(1);
        caption(content.captions.table);
      });
      at(2600, () => show("table", styles.fold));
      at(3200, () => {
        view("chart");
        dot(2);
        caption(content.captions.chart);
      });
      at(3800, () =>
        BAR_HEIGHTS.forEach((height, index) =>
          at(index * 160, () => {
            const bar = el(`bar-${index}`);
            if (!bar) return;
            bar.style.height = `${height}px`;
            bar.classList.add(styles.on);
          }),
        ),
      );
      at(6400, () => moveTo("bar-0"));
      at(7000, () => show("bar-0", styles.hot));
      at(7400, () => click("bar-0"));
      at(8600, () => {
        view("drill");
        dot(3);
        caption(content.captions.drill);
        hideCursor();
      });
      at(9200, () => show("drill-0"));
      at(9500, () => show("drill-1"));
      at(9800, () => show("drill-2"));
    },
    [content],
  );

  return (
    <DemoStage onClass={styles.on} stageWidth={STAGE_WIDTH} cycleMs={CYCLE_MS} dotCount={3} glowX="25%" stageHeight={STAGE_HEIGHT} timeline={timeline}>
      <DemoView name="table">
        <div className={styles.wrap}>
          <div className={styles.head}>{content.tableTitle}</div>
          <div className={styles.table} data-el="table">
            <div className={styles.row}>
              {content.columns.map((column) => (
                <span key={column}>{column}</span>
              ))}
            </div>
            {content.rows.map((row, index) => (
              <div className={styles.row} key={row.category}>
                <span>
                  <i style={{ "--c": CATEGORY_COLORS[index] } as CSSProperties} />
                  {row.category}
                </span>
                <span>{row.count}</span>
                <span>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </DemoView>

      <DemoView name="chart">
        <div className={styles.wrap}>
          <div className={styles.head}>{content.chartTitle}</div>
          <div className={styles.chart}>
            {content.rows.map((row, index) => (
              <div className={styles.barWrap} key={row.category}>
                <div
                  className={styles.bar}
                  data-el={`bar-${index}`}
                  style={{ "--c": CATEGORY_COLORS[index] } as CSSProperties}
                >
                  <b>{row.value}</b>
                </div>
                <div className={styles.barLabel}>{row.category}</div>
              </div>
            ))}
          </div>
        </div>
      </DemoView>

      <DemoView name="drill">
        <div className={styles.drill}>
          <div className={styles.drillHead}>
            <span className={`${shell.tile} ${shell.tRed}`}>
              <svg>
                <use href="#oa-i-chart" />
              </svg>
            </span>
            {content.drillTitle}
          </div>
          {content.drillRows.map((row, index) => (
            <div className={styles.drillRow} data-el={`drill-${index}`} key={row.number}>
              <b>{row.number}</b>
              <span>{row.title}</span>
              <em>{row.value}</em>
            </div>
          ))}
        </div>
      </DemoView>
    </DemoStage>
  );
}
