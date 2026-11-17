"use client";

import { useCallback, useRef, useState } from "react";
import EyeIcon from "lucide-react/dist/esm/icons/eye.mjs";
import LockKeyholeIcon from "lucide-react/dist/esm/icons/lock-keyhole.mjs";
import ShieldCheckIcon from "lucide-react/dist/esm/icons/shield-check.mjs";
import type { FeaturePillar } from "@/content/types";
import { type Director, TryHint, useAutoplay } from "./stage";
import styles from "./demos.module.css";

type Access = NonNullable<FeaturePillar["permissionAnimation"]>;
type Role = "hr" | "employee";

/** Which of the profile's fields only HR may read. */
const PROTECTED_FIELD = 1;

/**
 * One record seen by two roles: HR reads every field, an employee gets the same profile
 * with the salary withheld. The script looks at it as the employee, then as HR again.
 */
export function AccessDemo({ active, content, replay, tryLabel }: { active: boolean; content: Access; replay: number; tryLabel: string }) {
  const [role, setRole] = useState<Role>("hr");
  const rootRef = useRef<HTMLDivElement>(null);
  const hidden = role === "employee";

  const script = useCallback(async (director: Director) => {
    const root = rootRef.current;
    if (!root) return;
    await director.click(root.querySelector("[data-role='employee']"), () => setRole("employee"));
    await director.wait(1700);
    await director.click(root.querySelector("[data-role='hr']"), () => setRole("hr"));
    await director.wait(900);
  }, []);
  const reset = useCallback(() => setRole("hr"), []);
  const { phase, takeOver } = useAutoplay({ active, finish: reset, replay, reset, script });
  const roles: Array<[Role, string]> = [["hr", content.hrRoleLabel], ["employee", content.employeeRoleLabel]];

  return (
    <div className={styles.access} ref={rootRef}>
      <div className={styles.viewAs}>
        <span><EyeIcon strokeWidth={1.8} />{content.viewAsLabel}</span>
        <div className={styles.segmented}>
          {roles.map(([value, label]) => (
            <button
              aria-pressed={role === value}
              className={`${styles.segment} ${role === value ? styles.segmentOn : ""}`}
              data-role={value}
              key={value}
              onClick={() => {
                takeOver();
                setRole(value);
              }}
              tabIndex={-1}
              type="button"
            >
              {label}
              {value === "employee" ? <TryHint className={styles.tryHintBelow} label={tryLabel} shown={phase === "handed-over" && role === "hr"} /> : null}
            </button>
          ))}
        </div>
      </div>

      <article className={styles.profile}>
        <header className={styles.profileHead}>
          <span className={styles.avatar}>{content.fields[0].value.split(" ").map((part) => part[0]).join("")}</span>
          <span>
            <strong>{content.fields[0].value}</strong>
            <small>{content.subtitle}</small>
          </span>
          <span className={styles.profileBadge}>
            <ShieldCheckIcon strokeWidth={1.8} />
            {role === "hr" ? content.hrRoleLabel : content.employeeRoleLabel}
          </span>
        </header>

        <div className={styles.fields}>
          {content.fields.map((field, index) => {
            const locked = index === PROTECTED_FIELD && hidden;
            return (
              <div className={`${styles.field} ${locked ? styles.fieldLocked : ""}`} key={field.label}>
                <span className={styles.fieldLabel}>
                  {field.label}
                  {index === PROTECTED_FIELD ? <LockKeyholeIcon className={styles.fieldLockIcon} strokeWidth={2} /> : null}
                </span>
                <span className={styles.fieldValue}>
                  <span className={styles.fieldText}>{field.value}</span>
                  {index === PROTECTED_FIELD ? (
                    <span className={styles.lockChip}>
                      <LockKeyholeIcon strokeWidth={2} />
                      {content.lockedLabel}
                    </span>
                  ) : null}
                </span>
              </div>
            );
          })}
        </div>
      </article>
    </div>
  );
}
