"use client";

import { useCallback } from "react";
import type { IntegrationsDemoContent } from "@/content/types";
import { DemoStage, type DemoApi } from "./DemoStage";
import { DemoView } from "./DemoView";
import shell from "./demoShell.module.css";
import styles from "./IntegrationsDemo.module.css";

const STAGE_WIDTH = 940;
const STAGE_HEIGHT = 420;
const CYCLE_MS = 22000;

export function IntegrationsDemo({ content }: { content: IntegrationsDemoContent }) {
  const timeline = useCallback(
    ({ at, el, show, hide, caption, view, dot }: DemoApi) => {
      at(0, () => {
        view("flow");
        dot(1);
        caption(content.captions.arrives);
        const travel = el("travel");
        if (!travel) return;
        // Park it left of the boundary without animating in from the origin.
        travel.style.transition = "none";
        travel.style.transform = "translateX(-150px)";
        void travel.offsetWidth;
        travel.style.transition = "";
      });
      at(1200, () => show("travel"));
      at(1600, () => {
        const travel = el("travel");
        if (travel) travel.style.transform = "translateX(150px)";
      });
      at(2700, () => {
        hide("travel");
        show("rec");
      });
      at(3400, () => {
        dot(2);
        caption(content.captions.fields);
      });
      at(3700, () => show("kv-0"));
      at(4100, () => show("kv-1"));
      at(4500, () => show("kv-2"));
      at(7000, () => {
        dot(3);
        caption(content.captions.api);
      });
      at(7400, () => show("api-0"));
      at(8000, () => show("api-1"));
    },
    [content],
  );

  return (
    <DemoStage
      cycleMs={CYCLE_MS}
      dotCount={3}
      glowX="50%"
      onClass={styles.on}
      stageHeight={STAGE_HEIGHT}
      stageWidth={STAGE_WIDTH}
      timeline={timeline}
    >
      <DemoView name="flow">
        <div className={styles.wrap}>
          <div className={styles.row}>
            <div className={styles.side}>
              <div className={styles.cloud}>
                <span className={`${shell.tile} ${shell.tSlate}`}>
                  <svg>
                    <use href="#oa-i-file" />
                  </svg>
                </span>
                <b>{content.source.name}</b>
                <span>{content.source.subtitle}</span>
              </div>
            </div>

            <div className={styles.gap}>
              <div className={styles.boundary} />
              <div className={styles.travel} data-el="travel">
                <span className={`${shell.tile} ${shell.tBlue}`}>
                  <svg>
                    <use href="#oa-i-file" />
                  </svg>
                </span>
                <div>
                  <b>{content.document.number}</b>
                  <span>{content.document.kind}</span>
                </div>
              </div>
            </div>

            <div className={styles.record} data-el="rec">
              <div className={styles.recordHead}>
                <span className={`${shell.tile} ${shell.tBlue}`}>
                  <svg>
                    <use href="#oa-i-db" />
                  </svg>
                </span>
                <b>{content.recordTitle}</b>
              </div>
              {content.fields.map((field, index) => (
                <div className={styles.kv} key={field.label}>
                  <span>{field.label}</span>
                  <b data-el={`kv-${index}`}>{field.value}</b>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.apis}>
            {content.apis.map((api, index) => (
              <div className={styles.api} data-el={`api-${index}`} key={api.endpoint}>
                <code>{api.endpoint}</code>
                <span>{api.direction}</span>
                <span className={styles.direction}>
                  <svg>
                    <use href={index === 0 ? "#oa-i-arrow" : "#oa-i-arrow-l"} />
                  </svg>
                </span>
              </div>
            ))}
          </div>
        </div>
      </DemoView>
    </DemoStage>
  );
}
