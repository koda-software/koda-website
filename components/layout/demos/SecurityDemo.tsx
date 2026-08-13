"use client";

import { useCallback } from "react";
import type { SecurityDemoContent } from "@/content/types";
import { DemoStage, type DemoApi } from "./DemoStage";
import { DemoView } from "./DemoView";
import shell from "./demoShell.module.css";
import styles from "./SecurityDemo.module.css";

const STAGE_WIDTH = 760;
const STAGE_HEIGHT = 455;
const CYCLE_MS = 26000;

/**
 * What each role may see and do on the same record: which field indexes are
 * masked, which action buttons remain, and whether the read-only badge shows.
 */
const ROLE_ACCESS = [
  { maskedFields: [2, 3], buttons: [0], readOnly: false },
  { maskedFields: [], buttons: [0, 1, 2], readOnly: false },
  { maskedFields: [3], buttons: [], readOnly: true },
];

export function SecurityDemo({ content }: { content: SecurityDemoContent }) {
  const timeline = useCallback(
    ({ at, el, caption, view, dot }: DemoApi) => {
      const applyRole = (index: number) => {
        const access = ROLE_ACCESS[index];
        content.roles.forEach((_, n) => el(`role-${n}`)?.classList.toggle(styles.on, n === index));
        content.fields.forEach((_, n) =>
          el(`field-${n}`)?.classList.toggle(styles.hidden, access.maskedFields.includes(n)),
        );
        content.buttons.forEach((_, n) => el(`btn-${n}`)?.classList.toggle(styles.off, !access.buttons.includes(n)));
        el("readOnly")?.classList.toggle(styles.on, access.readOnly);
      };

      const captions = [content.captions.technician, content.captions.manager, content.captions.finance];
      /** Two passes through the three roles, so the contrast is easy to catch. */
      const beats = [0, 4000, 9000, 14000, 18000, 22000];

      at(0, () => view("roles"));
      beats.forEach((ms, step) => {
        const role = step % 3;
        at(ms, () => {
          dot(role + 1);
          caption(captions[role]);
          // The first beat of each pass sets the role with the caption; later
          // ones lag slightly so the reader sees the sentence before the change.
          at(step < 3 && step > 0 ? 600 : 0, () => applyRole(role));
        });
      });
    },
    [content],
  );

  return (
    <DemoStage onClass={styles.on} stageWidth={STAGE_WIDTH} cycleMs={CYCLE_MS} dotCount={3} glowX="75%" stageHeight={STAGE_HEIGHT} timeline={timeline}>
      <DemoView name="roles">
        <div className={styles.wrap}>
          <div className={styles.roles}>
            {content.roles.map((role, index) => (
              <div className={styles.role} data-el={`role-${index}`} key={role}>
                {role}
              </div>
            ))}
          </div>

          <div className={styles.record}>
            <h3>{content.recordTitle}</h3>
            {content.fields.map((field, index) => (
              <div className={styles.field} data-el={`field-${index}`} key={field.label}>
                <label>{field.label}</label>
                <div className={styles.value}>
                  <span>{field.value}</span>
                  <div className={styles.mask}>
                    <svg>
                      <use href="#oa-i-eye-off" />
                    </svg>
                    ••••••••
                  </div>
                </div>
              </div>
            ))}

            <div className={styles.buttons}>
              {content.buttons.map((label, index) => (
                <button
                  className={`${shell.btn} ${shell.btnSm} ${index === 1 ? shell.btnGreen : ""} ${
                    index === 2 ? shell.btnGhost : ""
                  }`}
                  data-el={`btn-${index}`}
                  key={label}
                  type="button"
                >
                  {label}
                </button>
              ))}
              <span className={styles.readOnly} data-el="readOnly">
                {content.readOnlyLabel}
              </span>
            </div>
          </div>
        </div>
      </DemoView>
    </DemoStage>
  );
}
