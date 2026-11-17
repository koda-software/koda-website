"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { Flip as FlipPlugin } from "gsap/Flip";
import CalendarDaysIcon from "lucide-react/dist/esm/icons/calendar-days.mjs";
import KanbanSquareIcon from "lucide-react/dist/esm/icons/kanban-square.mjs";
import ListIcon from "lucide-react/dist/esm/icons/list.mjs";
import type { FeaturePillar } from "@/content/types";
import { type Director, loadGsap, TryHint, useAutoplay, useStill } from "./stage";
import styles from "./demos.module.css";

type Views = NonNullable<FeaturePillar["viewsAnimation"]>;
type Mode = 0 | 1 | 2;
type Status = 0 | 1 | 2;
type FlipState = ReturnType<typeof FlipPlugin.getState>;

const modeIcons = [ListIcon, KanbanSquareIcon, CalendarDaysIcon] as const;
const statusClass = [styles.statusNew, styles.statusDoing, styles.statusDone] as const;
/** The month in the calendar starts on a Saturday, as November 2025 did, so the grid has a few days of October in front. */
const LEAD_DAYS = 5;
const CALENDAR_CELLS = 35;

let flipPromise: Promise<typeof FlipPlugin> | null = null;
function loadFlip() {
  flipPromise ??= Promise.all([loadGsap(), import("gsap/Flip")]).then(([gsap, module]) => {
    gsap.registerPlugin(module.Flip);
    return module.Flip;
  });
  return flipPromise;
}

const initials = (name: string) => name.slice(0, 1).toUpperCase();

/**
 * The same five records as a list, a board and a calendar. Every record keeps its
 * identity between views, so switching moves each one to where it belongs instead of
 * swapping one picture for another, and moving a card on the board changes its status
 * everywhere. The script switches views and drags one card to done.
 */
export function ViewsDemo({ active, content, replay, tryLabel }: { active: boolean; content: Views; replay: number; tryLabel: string }) {
  const still = useStill();
  const [mode, setMode] = useState<Mode>(0);
  const [statuses, setStatuses] = useState<Status[]>(() => content.records.map((record) => record.status));
  const bodyRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<typeof FlipPlugin | null>(null);
  const pendingRef = useRef<FlipState | null>(null);

  /** Records where they are, before the change that moves them. */
  const capture = () => {
    const Flip = flipRef.current;
    const body = bodyRef.current;
    if (!Flip || !body || still) return;
    pendingRef.current = Flip.getState(body.querySelectorAll("[data-flip-id]"));
  };

  const changeMode = (next: Mode) => {
    capture();
    setMode(next);
  };

  const moveRecord = (index: number, status: Status) => {
    capture();
    setStatuses((current) => current.map((value, at) => (at === index ? status : value)));
  };

  useLayoutEffect(() => {
    if (!still) void loadFlip().then((Flip) => (flipRef.current = Flip));
  }, [still]);

  useLayoutEffect(() => {
    const state = pendingRef.current;
    const Flip = flipRef.current;
    const body = bodyRef.current;
    pendingRef.current = null;
    if (!state || !Flip || !body) return;
    Flip.from(state, {
      absolute: true,
      duration: 0.7,
      ease: "power3.inOut",
      nested: true,
      prune: true,
      stagger: 0.035,
      targets: body.querySelectorAll("[data-flip-id]"),
    });
  }, [mode, statuses]);

  // Set state only through functional updates and refs, because it runs on across renders.
  const script = async (director: Director) => {
    const root = bodyRef.current?.parentElement;
    if (!root) return;
    const tab = (index: number) => root.querySelector(`[data-mode="${index}"]`);

    await director.click(tab(1), () => changeMode(1));
    await director.wait(1200);

    // One card is picked up from in progress and dropped on done; Flip carries it across.
    const card = root.querySelector<HTMLElement>('[data-flip-id="record-2"]');
    const doneColumn = root.querySelector('[data-column="2"]');
    if (card && doneColumn) {
      await director.moveTo(card, { dx: 0.3, dy: 0.4 });
      await director.gsap.to(card, { boxShadow: "0 22px 34px -18px rgba(16,24,40,0.45)", duration: 0.18, rotate: -2, y: -4 });
      await director.moveTo(doneColumn, { dx: 0.5, dy: 0.62, duration: 0.7 });
      moveRecord(2, 2);
      await director.wait(1300);
    }

    await director.click(tab(2), () => changeMode(2));
    await director.wait(1700);
    await director.click(tab(0), () => changeMode(0));
    await director.wait(500);
  };

  const reset = useCallback(() => {
    pendingRef.current = null;
    setMode(0);
    setStatuses(content.records.map((record) => record.status));
  }, [content.records]);
  const { phase, takeOver } = useAutoplay({ active, finish: reset, replay, reset, script });

  const records = content.records.map((record, index) => ({ ...record, id: `record-${index}`, index, status: statuses[index] }));
  const due = (day: number) => content.duePattern.replace("{day}", String(day));

  return (
    <div className={styles.views}>
      <header className={styles.viewsHead}>
        <strong>{content.title}</strong>
        <div className={styles.segmented}>
          {content.modes.map((label, index) => {
            const Icon = modeIcons[index];
            return (
              <button
                aria-pressed={mode === index}
                className={`${styles.segment} ${mode === index ? styles.segmentOn : ""}`}
                data-mode={index}
                key={label}
                onClick={() => {
                  takeOver();
                  if (index !== mode) changeMode(index as Mode);
                }}
                tabIndex={-1}
                type="button"
              >
                <Icon strokeWidth={1.8} />
                {label}
                {index === 1 ? <TryHint className={styles.tryHintBelow} label={tryLabel} shown={phase === "handed-over" && mode === 0} /> : null}
              </button>
            );
          })}
        </div>
      </header>

      <div className={styles.viewsBody} ref={bodyRef}>
        {mode === 0 ? (
          <div className={styles.table}>
            <div className={styles.tableHead}>
              {content.columns.map((column) => <span key={column}>{column}</span>)}
            </div>
            {records.map((record) => (
              <div className={styles.tableRow} data-flip-id={record.id} key={record.id}>
                <span className={styles.recordTitle}>{record.title}</span>
                <span className={styles.owner}><i>{initials(record.owner)}</i>{record.owner}</span>
                <span><b className={`${styles.status} ${statusClass[record.status]}`}>{content.statuses[record.status]}</b></span>
                <span className={styles.due}>{due(record.day)}</span>
              </div>
            ))}
          </div>
        ) : null}

        {mode === 1 ? (
          <div className={styles.board}>
            {content.statuses.map((status, column) => (
              <div className={styles.column} data-column={column} key={status}>
                <span className={styles.columnHead}>
                  <b className={`${styles.dot} ${statusClass[column]}`} />
                  {status}
                  <small>{records.filter((record) => record.status === column).length}</small>
                </span>
                {records
                  .filter((record) => record.status === column)
                  .map((record) => (
                    <button
                      className={styles.cardItem}
                      data-flip-id={record.id}
                      key={record.id}
                      onClick={() => {
                        takeOver();
                        moveRecord(record.index, ((record.status + 1) % 3) as Status);
                      }}
                      tabIndex={-1}
                      type="button"
                    >
                      <span className={styles.recordTitle}>{record.title}</span>
                      <span className={styles.cardMeta}>
                        <span className={styles.owner}><i>{initials(record.owner)}</i>{record.owner}</span>
                        <span className={styles.due}>{due(record.day)}</span>
                      </span>
                    </button>
                  ))}
              </div>
            ))}
          </div>
        ) : null}

        {mode === 2 ? (
          <div className={styles.calendar}>
            <span className={styles.month}>{content.monthLabel}</span>
            <div className={styles.weekdays}>
              {content.weekdays.map((day) => <span key={day}>{day}</span>)}
            </div>
            <div className={styles.days}>
              {Array.from({ length: CALENDAR_CELLS }, (_, cell) => {
                const day = cell - LEAD_DAYS + 1;
                const inMonth = day >= 1 && day <= 30;
                const record = records.find((item) => item.day === day);
                return (
                  <span className={`${styles.day} ${inMonth ? "" : styles.dayOut}`} key={cell}>
                    <small>{inMonth ? day : day < 1 ? 31 + day : day - 30}</small>
                    {record ? (
                      <b className={`${styles.event} ${statusClass[record.status]}`} data-flip-id={record.id}>
                        {record.title}
                      </b>
                    ) : null}
                  </span>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
