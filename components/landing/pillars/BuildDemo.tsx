"use client";

import { useCallback, useRef, useState } from "react";
import BarChart3Icon from "lucide-react/dist/esm/icons/bar-chart-3.mjs";
import CheckIcon from "lucide-react/dist/esm/icons/check.mjs";
import GaugeIcon from "lucide-react/dist/esm/icons/gauge.mjs";
import GripVerticalIcon from "lucide-react/dist/esm/icons/grip-vertical.mjs";
import PlusIcon from "lucide-react/dist/esm/icons/plus.mjs";
import Table2Icon from "lucide-react/dist/esm/icons/table-2.mjs";
import type { FeaturePillar } from "@/content/types";
import { type Director, TryHint, useAutoplay } from "./stage";
import styles from "./demos.module.css";

type Dashboard = NonNullable<FeaturePillar["animation"]>["dashboard"];

const icons = [GaugeIcon, BarChart3Icon, Table2Icon] as const;
const metricValues = ["€184k", "€121k", "27"] as const;
const barValues = [46, 64, 38, 82, 71] as const;
const NONE = [false, false, false];
const ALL = [true, true, true];

/**
 * A page assembled from blocks: each block in the palette fills the slot meant for it.
 * The script drags the first two across and leaves the last one to the reader, who can
 * also take blocks off the page again by clicking them.
 */
export function BuildDemo({ active, content, replay, tryLabel }: { active: boolean; content: Dashboard; replay: number; tryLabel: string }) {
  const [filled, setFilled] = useState(NONE);
  const rootRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(0);
  const complete = filled.every(Boolean);
  const next = filled.indexOf(false);

  const fill = (index: number) => setFilled((current) => current.map((on, slot) => on || slot === index));
  const toggle = (index: number) => setFilled((current) => current.map((on, slot) => (slot === index ? !on : on)));

  const script = useCallback(async (director: Director) => {
    const root = rootRef.current;
    const ghost = ghostRef.current;
    if (!root || !ghost) return;
    const { gsap } = director;

    for (const index of [0, 1]) {
      const block = root.querySelector(`[data-block="${index}"]`);
      const slot = root.querySelector(`[data-slot="${index}"]`);
      if (!block || !slot) continue;

      await director.moveTo(block, { dx: 0.18 });
      await director.wait(140);

      // The block lifts out of the palette as a copy and travels with the cursor to its slot.
      setDragging(index);
      const from = director.place(block);
      const to = director.place(slot);
      gsap.set(ghost, { autoAlpha: 1, rotate: 0, scale: 1, x: from.x, y: from.y, width: from.width });
      await gsap.to(ghost, { duration: 0.14, ease: "power2.out", rotate: -2.5, scale: 1.04 });

      const target = { x: to.x + to.width / 2 - from.width / 2, y: to.y + to.height / 2 - from.height / 2 };
      await Promise.all([
        gsap.to(ghost, { duration: 0.75, ease: "power3.inOut", x: target.x, y: target.y }),
        director.moveTo(slot, { duration: 0.75 }),
      ]);
      gsap.to(ghost, { autoAlpha: 0, duration: 0.18, ease: "power2.in", scale: 0.92 });
      fill(index);
      await director.wait(650);
    }
  }, []);

  const reset = useCallback(() => setFilled(NONE), []);
  const finish = useCallback(() => setFilled(ALL), []);
  const { phase, takeOver } = useAutoplay({ active, finish, replay, reset, script });
  const DragIcon = icons[dragging];

  return (
    <div className={styles.build} ref={rootRef}>
      <aside className={styles.palette}>
        <span className={styles.eyebrow}>{content.paletteLabel}</span>
        {content.blocks.map((block, index) => {
          const Icon = icons[index];
          return (
            <button
              className={`${styles.block} ${filled[index] ? styles.blockUsed : ""}`}
              data-block={index}
              key={block}
              onClick={() => {
                takeOver();
                toggle(index);
              }}
              tabIndex={-1}
              type="button"
            >
              <span className={styles.iconTile}><Icon strokeWidth={1.7} /></span>
              <span className={styles.blockLabel}>{block}</span>
              {filled[index] ? <CheckIcon className={styles.blockState} strokeWidth={2.2} /> : <GripVerticalIcon className={styles.blockState} strokeWidth={1.6} />}
              {index === next ? <TryHint className={styles.tryHintRight} label={tryLabel} shown={phase === "handed-over"} /> : null}
            </button>
          );
        })}
      </aside>

      <section className={styles.page}>
        <header className={styles.pageHead}>
          <strong>{content.pageTitle}</strong>
          <span className={`${styles.statusPill} ${complete ? styles.statusLive : ""}`}>
            {complete ? <CheckIcon strokeWidth={2.4} /> : null}
            {complete ? content.publishedLabel : content.draftLabel}
          </span>
        </header>

        <div className={styles.pageGrid}>
          <Slot filled={filled[0]} hint={content.dropHint} index={0} next={next === 0} className={styles.slotMetrics}>
            <div className={styles.metrics}>
              {content.metrics.map((metric, index) => (
                <div className={styles.metric} key={metric} style={{ animationDelay: `${index * 70}ms` }}>
                  <span>{metric}</span>
                  <strong>{metricValues[index]}</strong>
                </div>
              ))}
            </div>
          </Slot>

          <Slot filled={filled[1]} hint={content.dropHint} index={1} next={next === 1} className={styles.slotChart}>
            <div className={styles.card}>
              <span className={styles.cardTitle}>{content.chartTitle}</span>
              <div className={styles.bars}>
                {content.bars.map((label, index) => (
                  <span className={styles.bar} key={label}>
                    <i style={{ animationDelay: `${120 + index * 60}ms`, height: `${barValues[index]}%` }} />
                    <small>{label}</small>
                  </span>
                ))}
              </div>
            </div>
          </Slot>

          <Slot filled={filled[2]} hint={content.dropHint} index={2} next={next === 2} className={styles.slotTable}>
            <div className={styles.card}>
              <span className={styles.cardTitle}>{content.tableTitle}</span>
              <div className={styles.miniTable}>
                {content.rows.map((row, index) => (
                  <div className={styles.miniRow} key={row[0]} style={{ animationDelay: `${120 + index * 70}ms` }}>
                    <span>{row[0]}</span>
                    <span>{row[1]}</span>
                    <span className={styles.stagePill}>{row[2]}</span>
                  </div>
                ))}
              </div>
            </div>
          </Slot>
        </div>
      </section>

      <div aria-hidden="true" className={styles.dragGhost} ref={ghostRef}>
        <span className={styles.iconTile}><DragIcon strokeWidth={1.7} /></span>
        <span className={styles.blockLabel}>{content.blocks[dragging]}</span>
      </div>
    </div>
  );
}

function Slot({ children, className, filled, hint, index, next }: { children: React.ReactNode; className: string; filled: boolean; hint: string; index: number; next: boolean }) {
  return (
    <div className={`${styles.slot} ${className} ${filled ? styles.slotFilled : ""} ${next ? styles.slotNext : ""}`} data-slot={index}>
      {filled ? (
        <div className={styles.slotContent}>{children}</div>
      ) : (
        <span className={styles.slotHint}>
          <PlusIcon strokeWidth={1.8} />
          {hint}
        </span>
      )}
    </div>
  );
}
