"use client";

import { useCallback } from "react";
import type { NoCodeDemoContent } from "@/content/types";
import { DemoStage, type DemoApi } from "./DemoStage";
import { DemoView } from "./DemoView";
import shell from "./demoShell.module.css";
import styles from "./NoCodeDemo.module.css";

const STAGE_WIDTH = 940;
const STAGE_HEIGHT = 475;
const CYCLE_MS = 24000;

/** Icon per palette row; presentation, so it stays out of the translated content. */
const PALETTE_ICONS = ["oa-i-text", "oa-i-list", "oa-i-cal", "oa-i-hash", "oa-i-clip"];

export function NoCodeDemo({ content }: { content: NoCodeDemoContent }) {
  const timeline = useCallback(
    ({ at, el, show, hide, click, moveTo, caption, view, dot }: DemoApi) => {
      /**
       * One drag: the palette row lights up, a ghost copy of it flies to the
       * drop zone, and the field it stands for appears on the form.
       */
      const drag = (start: number, paletteIndex: number, fieldIndex: number) => {
        at(start, () => {
          const palette = el(`palette-${paletteIndex}`);
          const ghost = el("ghost");
          if (!palette || !ghost) return;

          show(palette, styles.hot);
          moveTo(palette);
          ghost.querySelector("span")!.textContent = content.paletteItems[paletteIndex];
          ghost.querySelector("use")!.setAttribute("href", `#${PALETTE_ICONS[paletteIndex]}`);
          // Jump to the palette without animating in from the stage origin.
          ghost.style.transition = "none";
          ghost.style.transform = `translate(${palette.offsetLeft}px, ${palette.offsetTop}px)`;
          void ghost.offsetWidth;
          ghost.style.transition = "";
        });

        at(start + 500, () => {
          const zone = el("dropzone");
          const ghost = el("ghost");
          if (!zone || !ghost) return;
          show(ghost);
          ghost.style.transform = `translate(${zone.offsetLeft + 14}px, ${zone.offsetTop + 4}px)`;
          show(zone, styles.hot);
          moveTo(zone);
        });

        at(start + 1350, () => {
          hide("ghost");
          hide("dropzone", styles.hot);
          hide(`palette-${paletteIndex}`, styles.hot);
          show(`field-${fieldIndex}`);
        });
      };

      at(0, () => {
        view("build");
        dot(1);
        caption(content.captions.drag);
      });
      drag(1400, 1, 1);
      at(4200, () => caption(content.captions.second));
      drag(4600, 2, 2);
      at(7600, () => click("previewBtn"));
      at(8700, () => {
        view("result");
        dot(2);
        caption(content.captions.preview);
      });
    },
    [content],
  );

  return (
    <DemoStage onClass={styles.on} stageWidth={STAGE_WIDTH} cycleMs={CYCLE_MS} dotCount={2} glowX="15%" stageHeight={STAGE_HEIGHT} timeline={timeline}>
      <DemoView name="build">
        <div className={styles.build}>
          <div className={styles.palette}>
            <div className={`${shell.lab} ${styles.paletteLabel}`}>{content.paletteLabel}</div>
            {content.paletteItems.map((item, index) => (
              <div className={styles.paletteItem} data-el={`palette-${index}`} key={item}>
                <svg>
                  <use href={`#${PALETTE_ICONS[index]}`} />
                </svg>
                {item}
              </div>
            ))}
          </div>

          <div className={styles.canvas}>
            <div className={styles.canvasHead}>{content.formTitle}</div>
            {content.formFields.map((field, index) => (
              <div
                className={`${styles.field} ${index === 0 ? styles.on : ""}`}
                data-el={`field-${index}`}
                key={field}
              >
                <label>{field}</label>
                <div className={styles.box}>
                  <svg>
                    <use href={`#${PALETTE_ICONS[index === 0 ? 0 : index]}`} />
                  </svg>
                </div>
              </div>
            ))}
            <div className={styles.drop} data-el="dropzone">
              +
            </div>
            <button className={`${shell.btn} ${shell.btnSm} ${styles.previewButton}`} data-el="previewBtn" type="button">
              {content.previewLabel}
            </button>
          </div>

          <div className={styles.ghost} data-el="ghost">
            <svg>
              <use href="#oa-i-list" />
            </svg>
            <span>{content.paletteItems[1]}</span>
          </div>
        </div>
      </DemoView>

      <DemoView name="result">
        <div className={styles.result}>
          <h3>{content.record.title}</h3>
          {content.record.rows.map((row, index) => (
            <div className={styles.resultField} key={row.label}>
              <label>{row.label}</label>
              <div>
                {index === 1 ? <i /> : null}
                {row.value}
              </div>
            </div>
          ))}
          <button className={shell.btn} style={{ width: "100%", justifyContent: "center" }} type="button">
            {content.record.saveLabel}
          </button>
        </div>
      </DemoView>
    </DemoStage>
  );
}
