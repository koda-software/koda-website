"use client";

import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import type { RecordDemoContent } from "@/content/types";
import styles from "./RecordDemo.module.css";

type RecordDemoProps = {
  content: RecordDemoContent;
};

const STAGE_WIDTH = 1200;
const CYCLE_MS = 25000;

/** Decorative colours for the mock UI, matched to the meaning of each value. */
const priorityColors = ["#94A3B8", "#38B6FF", "#F59E0B", "#EF4444"];
const stageColors = ["#38B6FF", "#6366F1", "#F59E0B", "#64748B"];
const fillerPriorityColors = ["#94A3B8", "#94A3B8", "#F59E0B"];
const fillerStageColors = ["#6366F1", "#F59E0B", "#10B981"];

const CURSOR_HOME = { x: 600, y: 320 };

function UpDownIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="m8 10 4-4 4 4M8 14l4 4 4-4" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg strokeWidth={2.6} viewBox="0 0 24 24">
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

export function RecordDemo({ content }: RecordDemoProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scalerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const priorityRef = useRef<HTMLDivElement>(null);
  const priorityPickRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [scale, setScale] = useState(1);
  /** Seeded true so the banner plays on load; the observer only pauses it once scrolled away. */
  const [visible, setVisible] = useState(true);
  const [cycle, setCycle] = useState(0);

  const [view, setView] = useState<"list" | "record">("list");
  const [caption, setCaption] = useState("");
  const [rowHighlighted, setRowHighlighted] = useState(false);
  const [rowPriority, setRowPriority] = useState(1);
  const [rowStage, setRowStage] = useState(0);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [priorityFocused, setPriorityFocused] = useState(false);
  const [priorityValue, setPriorityValue] = useState(1);
  const [valueFocused, setValueFocused] = useState(false);
  const [valueText, setValueText] = useState("");
  const [processVisible, setProcessVisible] = useState(false);
  const [stageIndex, setStageIndex] = useState(-1);
  const [buttonPressed, setButtonPressed] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorClicking, setCursorClicking] = useState(false);
  const [cursorPos, setCursorPos] = useState(CURSOR_HOME);
  const [instantCursor, setInstantCursor] = useState(true);

  useEffect(() => {
    const scaler = scalerRef.current;
    if (!scaler) return;
    const fit = () => setScale(scaler.clientWidth / STAGE_WIDTH);
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(scaler);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => setVisible(entry.isIntersecting)),
      { threshold: 0.25 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const moveCursor = useCallback((target: HTMLElement | null, dx = 0, dy = 0) => {
    const stage = stageRef.current;
    if (!stage || !target) return;
    const stageRect = stage.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const k = stageRect.width / STAGE_WIDTH || 1;
    setInstantCursor(false);
    setCursorVisible(true);
    setCursorPos({
      x: (targetRect.left - stageRect.left) / k + targetRect.width / 2 + dx,
      y: (targetRect.top - stageRect.top) / k + targetRect.height / 2 + dy,
    });
  }, []);

  useEffect(() => {
    if (!visible) return;

    const timers: Array<ReturnType<typeof setTimeout>> = [];
    const at = (delay: number, run: () => void) => {
      timers.push(setTimeout(run, delay));
    };

    const click = (delay: number, target: () => HTMLElement | null, dx = 0, dy = 0, press = false) => {
      at(delay, () => moveCursor(target(), dx, dy));
      at(delay + 560, () => {
        setCursorClicking(true);
        if (press) {
          setButtonPressed(true);
          at(delay + 710, () => setButtonPressed(false));
        }
      });
      at(delay + 1080, () => setCursorClicking(false));
    };

    const typeValue = (delay: number, text: string, speed: number) => {
      for (let index = 1; index <= text.length; index += 1) {
        at(delay + index * speed, () => setValueText(text.slice(0, index)));
      }
    };

    at(0, () => {
      setView("list");
      setCaption(content.captions.list);
    });

    click(1600, () => rowRef.current, -220);
    at(2700, () => {
      setView("record");
      setCaption(content.captions.form);
      setCursorVisible(false);
    });

    click(3900, () => priorityRef.current);
    at(4700, () => {
      setPriorityFocused(true);
      setPriorityOpen(true);
    });
    click(5400, () => priorityPickRef.current);
    at(6300, () => {
      setPriorityOpen(false);
      setPriorityFocused(false);
      setPriorityValue(content.priorityOptions.length - 1);
    });

    click(7000, () => valueRef.current);
    at(7700, () => setValueFocused(true));
    typeValue(7700, content.fields.valueTyped, 65);
    at(9400, () => {
      setValueFocused(false);
      setCursorVisible(false);
    });

    at(10000, () => {
      setProcessVisible(true);
      setStageIndex(0);
      setCaption(content.captions.process);
    });
    click(11200, () => buttonRef.current, 0, 0, true);
    at(12100, () => setStageIndex(1));
    click(13100, () => buttonRef.current, 0, 0, true);
    at(14000, () => setStageIndex(2));
    click(15000, () => buttonRef.current, 0, 0, true);
    at(15900, () => {
      setStageIndex(3);
      setCursorVisible(false);
    });

    at(17600, () => {
      setView("list");
      setCaption(content.captions.result);
      setRowStage(content.stages.length - 1);
      setRowPriority(content.priorityOptions.length - 1);
      setRowHighlighted(true);
    });

    at(CYCLE_MS, () => {
      setRowHighlighted(false);
      setRowPriority(1);
      setRowStage(0);
      setPriorityValue(1);
      setValueText("");
      setProcessVisible(false);
      setStageIndex(-1);
      setCursorVisible(false);
      setInstantCursor(true);
      setCursorPos(CURSOR_HOME);
      setCycle((current) => current + 1);
    });

    return () => timers.forEach(clearTimeout);
  }, [content, cycle, moveCursor, visible]);

  const currentStage = content.stages[stageIndex];
  const isFinalStage = stageIndex === content.stages.length - 1;

  return (
    <div aria-hidden="true" className={styles.root} ref={rootRef}>
      <div className={styles.frame}>
        <div className={styles.scaler} ref={scalerRef}>
          <div className={styles.stage} ref={stageRef} style={{ transform: `scale(${scale})` }}>
            <section className={`${styles.view} ${view === "list" ? styles.on : ""}`}>
              <div className={`${styles.card} ${styles.cardList}`}>
                <div className={styles.cardHead}>{content.listTitle}</div>
                <div className={`${styles.row} ${rowHighlighted ? styles.highlight : ""}`} ref={rowRef}>
                  <span className={styles.num}>{content.focusRow.number}</span>
                  <span className={styles.rowTitle}>{content.focusRow.title}</span>
                  <span className={styles.prio}>
                    <i style={{ "--c": priorityColors[rowPriority] } as CSSProperties} />
                    {content.priorityOptions[rowPriority]}
                  </span>
                  <span className={styles.stagePill} style={{ "--c": stageColors[rowStage] } as CSSProperties}>
                    {content.stages[rowStage]?.name}
                  </span>
                </div>
                {content.otherRows.map((row, index) => (
                  <div className={styles.row} key={row.number}>
                    <span className={styles.num}>{row.number}</span>
                    <span className={styles.rowTitle}>{row.title}</span>
                    <span className={styles.prio}>
                      <i style={{ "--c": fillerPriorityColors[index] } as CSSProperties} />
                      {row.priority}
                    </span>
                    <span className={styles.stagePill} style={{ "--c": fillerStageColors[index] } as CSSProperties}>
                      {row.stage}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className={`${styles.view} ${view === "record" ? styles.on : ""}`}>
              <div className={`${styles.card} ${styles.cardRecord}`}>
                <div className={styles.recordHead}>
                  <span className={styles.numLarge}>{content.focusRow.number}</span>
                  <span className={styles.recordTitle}>{content.focusRow.title}</span>
                </div>

                <div className={styles.fields}>
                  <div className={styles.field}>
                    <label>{content.fields.client}</label>
                    <div className={styles.input}>{content.fields.clientValue}</div>
                  </div>
                  <div className={styles.field}>
                    <label>{content.fields.priority}</label>
                    <div
                      className={`${styles.input} ${styles.select} ${priorityFocused ? styles.focus : ""}`}
                      ref={priorityRef}
                    >
                      <span className={styles.prio}>
                        <i style={{ "--c": priorityColors[priorityValue] } as CSSProperties} />
                        {content.priorityOptions[priorityValue]}
                      </span>
                      <UpDownIcon />
                      <div className={`${styles.drop} ${priorityOpen ? styles.on : ""}`}>
                        {content.priorityOptions.map((option, index) => {
                          const isPick = index === content.priorityOptions.length - 1;
                          return (
                            <div
                              className={`${styles.option} ${isPick ? styles.optionHot : ""}`}
                              key={option}
                              ref={isPick ? priorityPickRef : undefined}
                            >
                              <i style={{ "--c": priorityColors[index] } as CSSProperties} />
                              {option}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label>{content.fields.value}</label>
                    <div className={`${styles.input} ${valueFocused ? styles.focus : ""}`} ref={valueRef}>
                      <span>{valueText}</span>
                      <i className={styles.caret} />
                    </div>
                  </div>
                </div>

                <div className={`${styles.process} ${processVisible ? styles.on : ""}`}>
                  <div className={styles.processLabel}>{content.processLabel}</div>
                  <div className={styles.track}>
                    <div className={styles.trackLine}>
                      <span
                        style={{
                          width: stageIndex < 0 ? 0 : `${(stageIndex / (content.stages.length - 1)) * 100}%`,
                        }}
                      />
                    </div>
                    <div className={styles.steps}>
                      {content.stages.map((stage, index) => (
                        <div
                          className={`${styles.step} ${index <= stageIndex ? styles.past : ""} ${
                            index === stageIndex ? styles.current : ""
                          }`}
                          key={stage.name}
                          style={{ "--c": stageColors[index] } as CSSProperties}
                        >
                          <i />
                          <span>{stage.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    className={`${styles.button} ${buttonPressed ? styles.pressed : ""} ${
                      isFinalStage ? styles.done : ""
                    }`}
                    ref={buttonRef}
                    tabIndex={-1}
                    type="button"
                  >
                    {isFinalStage ? (
                      <>
                        <CheckIcon />
                        {content.doneLabel}
                      </>
                    ) : (
                      <>
                        {currentStage?.transition ?? content.stages[0].transition}
                        <ArrowIcon />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>

            <div
              className={`${styles.caption} ${caption ? styles.on : ""}`}
              dangerouslySetInnerHTML={{ __html: caption }}
            />

            <div
              className={`${styles.cursor} ${cursorVisible ? styles.on : ""} ${cursorClicking ? styles.clicking : ""}`}
              style={{
                transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
                transition: instantCursor ? "none" : undefined,
              }}
            >
              <svg height="26" viewBox="0 0 24 24" width="26">
                <path
                  d="M5 2.5 18.5 12l-5.6 1.1 3 5.9-2.6 1.3-3-6L6 18z"
                  fill="#0F172A"
                  stroke="#fff"
                  strokeLinejoin="round"
                  strokeWidth="1.3"
                />
              </svg>
              <i className={styles.click} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
