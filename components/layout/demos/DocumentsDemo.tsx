"use client";

import { useCallback } from "react";
import type { DocumentsDemoContent } from "@/content/types";
import { DemoStage, type DemoApi } from "./DemoStage";
import { DemoView } from "./DemoView";
import shell from "./demoShell.module.css";
import styles from "./DocumentsDemo.module.css";

const STAGE_WIDTH = 880;
const STAGE_HEIGHT = 340;
const CYCLE_MS = 24000;

export function DocumentsDemo({ content }: { content: DocumentsDemoContent }) {
  const timeline = useCallback(
    ({ at, show, type, caption, view, dot }: DemoApi) => {
      at(0, () => {
        view("intake");
        dot(1);
        caption(content.captions.intake);
      });
      at(1600, () => show("doc", styles.gone));
      at(2400, () => show("rec"));
      at(3200, () => {
        caption(content.captions.numbering);
        type("numTxt", content.record.number, 55);
      });
      at(8000, () => {
        view("path");
        dot(2);
        caption(content.captions.path);
      });
      at(9400, () => show("br1", styles.live));
      at(10400, () => show("br2", styles.dead));
      at(16000, () => {
        view("versions");
        dot(3);
        caption(content.captions.versions);
      });
      at(17000, () => show("v-0"));
      at(17500, () => show("v-1"));
      at(18000, () => show("v-2"));
    },
    [content],
  );

  return (
    <DemoStage
      cycleMs={CYCLE_MS}
      dotCount={3}
      glowX="85%"
      onClass={styles.on}
      stageHeight={STAGE_HEIGHT}
      stageWidth={STAGE_WIDTH}
      timeline={timeline}
    >
      <DemoView name="intake">
        <div className={styles.flow}>
          <div className={styles.mailCard}>
            <div className={styles.mailHead}>
              <svg>
                <use href="#oa-i-mail" />
              </svg>
              {content.inboxLabel}
            </div>
            <div className={styles.doc} data-el="doc">
              <span className={`${shell.tile} ${shell.tRed}`}>
                <svg>
                  <use href="#oa-i-file" />
                </svg>
              </span>
              <div>
                <b>{content.mail.file}</b>
                <span>{content.mail.from}</span>
              </div>
            </div>
          </div>

          <div className={styles.arrow} />

          <div className={styles.recordCard} data-el="rec">
            <div className={styles.recordHead}>
              <span className={`${shell.tile} ${shell.tBlue}`}>
                <svg>
                  <use href="#oa-i-db" />
                </svg>
              </span>
              <b>{content.record.title}</b>
            </div>
            <div className={styles.kv}>
              <span>{content.record.numberLabel}</span>
              <b data-el="numTxt" />
            </div>
            <div className={styles.kv}>
              <span>{content.record.partyLabel}</span>
              <b>{content.record.party}</b>
            </div>
            <div className={`${styles.kv} ${styles.kvAmount}`}>
              <span>{content.record.amountLabel}</span>
              <b>{content.record.amount}</b>
            </div>
          </div>
        </div>
      </DemoView>

      <DemoView name="path">
        <div className={styles.path}>
          <div className={`${shell.lab} ${shell.labOnSurface}`} style={{ marginBottom: 12 }}>
            {content.pathLabel}
          </div>
          <div className={styles.condition}>
            <span className={`${shell.tile} ${shell.tAmber}`}>
              <svg>
                <use href="#oa-i-bolt" />
              </svg>
            </span>
            <b>{content.condition}</b>
            <span className={styles.amountChip}>{content.record.amount}</span>
          </div>
          <div className={styles.branches}>
            {content.branches.map((branch, index) => (
              <div className={styles.branch} data-el={`br${index + 1}`} key={branch.title}>
                <span className={`${shell.tile} ${index === 0 ? shell.tGreen : shell.tSlate}`}>
                  <svg>
                    <use href={index === 0 ? "#oa-i-check" : "#oa-i-user"} />
                  </svg>
                </span>
                <b>{branch.title}</b>
                <span>{branch.detail}</span>
              </div>
            ))}
          </div>
        </div>
      </DemoView>

      <DemoView name="versions">
        <div className={styles.versions}>
          <div className={`${shell.lab} ${shell.labOnSurface}`} style={{ marginBottom: 14 }}>
            {content.versionsLabel}
          </div>
          {content.versions.map((version, index) => {
            const isCurrent = index === content.versions.length - 1;

            return (
              <div
                className={`${styles.version} ${isCurrent ? styles.current : ""}`}
                data-el={`v-${index}`}
                key={version.detail}
              >
                <span className={styles.versionNumber}>v{index + 1}</span>
                <span className={`${shell.tile} ${isCurrent ? shell.tBlue : shell.tSlate}`}>
                  <svg>
                    <use href="#oa-i-file" />
                  </svg>
                </span>
                <b>{version.file}</b>
                <span>{version.detail}</span>
                {isCurrent ? <span className={styles.currentPill}>{content.currentLabel}</span> : null}
              </div>
            );
          })}
        </div>
      </DemoView>
    </DemoStage>
  );
}
