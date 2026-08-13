"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ConfigDemoContent } from "@/content/types";
import styles from "./ConfigDemo.module.css";

type ConfigDemoProps = {
  content: ConfigDemoContent;
};

/**
 * The stage is a fixed pixel canvas scaled to whatever width the hero column
 * gives it. It is sized snugly around the 840px card so almost all of the
 * available width goes to the mock UI itself - every pixel of slack here comes
 * straight off the scale factor and shrinks the demo.
 */
const STAGE_WIDTH = 920;
const STAGE_HEIGHT = 600;
const CYCLE_MS = 35000;
const CURSOR_HOME = { x: STAGE_WIDTH / 2, y: STAGE_HEIGHT / 2 };

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z" />
    </svg>
  );
}

function BranchIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="7" cy="6" r="2.4" />
      <circle cx="7" cy="18" r="2.4" />
      <circle cx="17" cy="12" r="2.4" />
      <path d="M7 8.4v7.2M9.4 6h2.6a2.6 2.6 0 0 1 2.6 2.6v1" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M4 20l.7-3.8L15.6 5.3a2 2 0 0 1 2.8 0l.3.3a2 2 0 0 1 0 2.8L7.8 19.3z" />
    </svg>
  );
}

function LogIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <rect height="18" rx="2.5" width="16" x="4" y="3" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M7 4.5 19 12 7 19.5z" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <ellipse cx="12" cy="6" rx="7.5" ry="3" />
      <path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6" />
      <path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

const stepTiles = [
  { className: styles.tileViolet, Icon: BranchIcon },
  { className: styles.tileBlue, Icon: PencilIcon },
  { className: styles.tileSlate, Icon: LogIcon },
];

export function ConfigDemo({ content }: ConfigDemoProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const scalerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const addStepRef = useRef<HTMLButtonElement>(null);
  const runScriptRef = useRef<HTMLButtonElement>(null);
  const runQueryRef = useRef<HTMLButtonElement>(null);

  const [scale, setScale] = useState(1);
  /** Seeded true so the banner plays on load; the observer only pauses it once scrolled away. */
  const [visible, setVisible] = useState(true);
  const [cycle, setCycle] = useState(0);

  const [view, setView] = useState<"rule" | "script" | "query">("rule");
  const [caption, setCaption] = useState("");
  const [stepsShown, setStepsShown] = useState(0);
  const [addPressed, setAddPressed] = useState(false);
  const [runPressed, setRunPressed] = useState(false);
  const [typedLength, setTypedLength] = useState(0);
  const [scriptDone, setScriptDone] = useState(false);
  const [resultVisible, setResultVisible] = useState(false);
  const [paramFocused, setParamFocused] = useState(false);
  const [paramText, setParamText] = useState("");
  const [tableVisible, setTableVisible] = useState(false);
  const [rowsShown, setRowsShown] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorClicking, setCursorClicking] = useState(false);
  const [cursorPos, setCursorPos] = useState(CURSOR_HOME);
  const [instantCursor, setInstantCursor] = useState(true);

  const { field, values } = content.script;
  const scriptSource = `const p = ${field};\nreturn p === '${values[0]}' || p === '${values[1]}';`;

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

  const moveCursor = useCallback((target: HTMLElement | null) => {
    const stage = stageRef.current;
    if (!stage || !target) return;
    const stageRect = stage.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const k = stageRect.width / STAGE_WIDTH || 1;
    setInstantCursor(false);
    setCursorVisible(true);
    setCursorPos({
      x: (targetRect.left - stageRect.left) / k + targetRect.width / 2,
      y: (targetRect.top - stageRect.top) / k + targetRect.height / 2,
    });
  }, []);

  useEffect(() => {
    if (!visible) return;

    const timers: Array<ReturnType<typeof setTimeout>> = [];
    const at = (delay: number, run: () => void) => {
      timers.push(setTimeout(run, delay));
    };

    const click = (delay: number, target: () => HTMLElement | null, press: (pressed: boolean) => void) => {
      at(delay, () => moveCursor(target()));
      at(delay + 560, () => {
        setCursorClicking(true);
        press(true);
      });
      at(delay + 730, () => press(false));
      at(delay + 1080, () => setCursorClicking(false));
    };

    at(0, () => {
      setView("rule");
      setCaption(content.captions.rule);
    });

    const stepTimes = [1800, 4000, 6200];
    stepTimes.forEach((time, index) => {
      click(time - 800, () => addStepRef.current, setAddPressed);
      at(time, () => setStepsShown(index + 1));
    });
    at(8200, () => {
      setCaption(content.captions.ruleDone);
      setCursorVisible(false);
    });

    at(11500, () => {
      setView("script");
      setCaption(content.captions.script);
    });
    for (let index = 1; index <= scriptSource.length; index += 1) {
      at(12600 + index * 24, () => setTypedLength(index));
    }
    at(12600 + scriptSource.length * 24 + 120, () => setScriptDone(true));
    click(15400, () => runScriptRef.current, setRunPressed);
    at(16400, () => {
      setResultVisible(true);
      setCursorVisible(false);
      setCaption(content.captions.scriptDone);
    });

    at(20000, () => {
      setView("query");
      setCaption(content.captions.query);
    });
    at(21200, () => setParamFocused(true));
    for (let index = 1; index <= content.query.paramValue.length; index += 1) {
      at(21200 + index * 90, () => setParamText(content.query.paramValue.slice(0, index)));
    }
    at(22600, () => setParamFocused(false));
    click(22600, () => runQueryRef.current, setRunPressed);
    at(23800, () => {
      setTableVisible(true);
      setCursorVisible(false);
    });
    content.query.rows.forEach((_, index) => {
      at(23900 + index * 180, () => setRowsShown(index + 1));
    });
    at(25400, () => setCaption(content.captions.summary));

    at(CYCLE_MS, () => {
      setStepsShown(0);
      setTypedLength(0);
      setScriptDone(false);
      setResultVisible(false);
      setParamText("");
      setTableVisible(false);
      setRowsShown(0);
      setCursorVisible(false);
      setInstantCursor(true);
      setCursorPos(CURSOR_HOME);
      setCycle((current) => current + 1);
    });

    return () => timers.forEach(clearTimeout);
  }, [content, cycle, moveCursor, scriptSource, visible]);

  const dotIndex = view === "rule" ? 0 : view === "script" ? 1 : 2;

  return (
    <div aria-hidden="true" className={styles.root} ref={rootRef}>
      <div className={styles.frame}>
        <div className={styles.scaler} ref={scalerRef}>
          <div className={styles.stage} ref={stageRef} style={{ transform: `scale(${scale})` }}>
            <section className={`${styles.view} ${view === "rule" ? styles.on : ""}`}>
              <div className={styles.card}>
                <div className={styles.label}>{content.rule.triggerLabel}</div>
                <div className={styles.trigger}>
                  <span className={`${styles.tile} ${styles.tileAmber}`}>
                    <BoltIcon />
                  </span>
                  <span className={styles.triggerTitle}>{content.rule.triggerTitle}</span>
                  <span className={styles.chip}>{content.rule.triggerChip}</span>
                </div>

                <div className={`${styles.label} ${styles.labelSteps}`}>{content.rule.stepsLabel}</div>
                <div className={styles.steps}>
                  {content.rule.steps.map((step, index) => {
                    const tile = stepTiles[index];
                    return (
                      <div className={`${styles.step} ${index < stepsShown ? styles.on : ""}`} key={step.title}>
                        <span className={styles.stepNumber}>{index + 1}</span>
                        <span className={`${styles.tile} ${tile.className}`}>
                          <tile.Icon />
                        </span>
                        <span className={styles.stepTitle}>{step.title}</span>
                        <span className={styles.stepDetail}>{step.detail}</span>
                      </div>
                    );
                  })}
                </div>
                <button
                  className={`${styles.addStep} ${addPressed ? styles.pressed : ""}`}
                  ref={addStepRef}
                  tabIndex={-1}
                  type="button"
                >
                  <PlusIcon />
                  {content.rule.addStep}
                </button>
              </div>
            </section>

            <section className={`${styles.view} ${view === "script" ? styles.on : ""}`}>
              <div className={styles.card}>
                <div className={styles.head}>
                  <span className={`${styles.tile} ${styles.tileGreen}`}>
                    <CodeIcon />
                  </span>
                  <span className={styles.headTitle}>{content.script.title}</span>
                  <span className={styles.chip}>{content.script.chip}</span>
                  <button
                    className={`${styles.run} ${runPressed ? styles.pressed : ""}`}
                    ref={runScriptRef}
                    tabIndex={-1}
                    type="button"
                  >
                    <PlayIcon />
                    {content.script.run}
                  </button>
                </div>
                <div className={styles.editor}>
                  <div className={styles.lineNumbers}>
                    1<br />2
                  </div>
                  <pre className={styles.code}>
                    {scriptDone ? (
                      <>
                        <span className={styles.keyword}>const</span> p <span className={styles.operator}>=</span>{" "}
                        {field};{"\n"}
                        <span className={styles.keyword}>return</span> p <span className={styles.operator}>===</span>{" "}
                        <span className={styles.string}>&apos;{values[0]}&apos;</span>{" "}
                        <span className={styles.operator}>||</span> p <span className={styles.operator}>===</span>{" "}
                        <span className={styles.string}>&apos;{values[1]}&apos;</span>;
                      </>
                    ) : (
                      scriptSource.slice(0, typedLength)
                    )}
                  </pre>
                </div>
                <div className={`${styles.result} ${resultVisible ? styles.on : ""}`}>
                  <span className={styles.resultOk}>
                    <CheckIcon />
                    true
                  </span>
                  <span className={styles.resultMeta}>{content.script.resultTime}</span>
                </div>
              </div>
            </section>

            <section className={`${styles.view} ${view === "query" ? styles.on : ""}`}>
              <div className={styles.card}>
                <div className={styles.head}>
                  <span className={`${styles.tile} ${styles.tileGreen}`}>
                    <DatabaseIcon />
                  </span>
                  <span className={styles.headTitle}>{content.query.title}</span>
                  <span className={styles.chip}>{content.query.chip}</span>
                  <button
                    className={`${styles.run} ${runPressed ? styles.pressed : ""}`}
                    ref={runQueryRef}
                    tabIndex={-1}
                    type="button"
                  >
                    <PlayIcon />
                    {content.query.run}
                  </button>
                </div>
                <div className={styles.editor}>
                  <div className={styles.lineNumbers}>
                    1<br />2<br />3
                  </div>
                  <pre className={styles.code}>
                    <span className={styles.keyword}>SELECT</span> {content.query.sql.columns}
                    {"\n  "}
                    <span className={styles.keyword}>FROM</span> {content.query.sql.table}
                    {"\n "}
                    <span className={styles.keyword}>WHERE</span> {content.query.sql.field}{" "}
                    <span className={styles.operator}>&gt;=</span>{" "}
                    <span className={styles.param}>:{content.query.sql.param}</span>
                  </pre>
                </div>
                <div className={styles.paramRow}>
                  <span className={styles.paramLabel}>{content.query.sql.param}</span>
                  <div className={`${styles.paramInput} ${paramFocused ? styles.focus : ""}`}>
                    <span>{paramText}</span>
                    <i className={styles.caret} />
                  </div>
                </div>
                <div className={`${styles.table} ${tableVisible ? styles.on : ""}`}>
                  <div className={`${styles.tableRow} ${styles.tableHead} ${tableVisible ? styles.on : ""}`}>
                    {content.query.columns.map((column) => (
                      <span key={column}>{column}</span>
                    ))}
                  </div>
                  {content.query.rows.map((row, index) => (
                    <div className={`${styles.tableRow} ${index < rowsShown ? styles.on : ""}`} key={row[0]}>
                      {row.map((cell) => (
                        <span key={cell}>{cell}</span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div
              className={`${styles.cursor} ${cursorVisible ? styles.on : ""} ${cursorClicking ? styles.clicking : ""}`}
              style={{
                transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
                transition: instantCursor ? "none" : undefined,
              }}
            >
              <svg height="46" viewBox="0 0 24 24" width="46">
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

      {/*
        Outside the scaled stage: the caption and the view dots address the
        reader rather than being part of the mock UI, so they keep their own
        type size instead of shrinking with the demo.
      */}
      <div
        className={`${styles.caption} ${caption ? styles.on : ""}`}
        dangerouslySetInnerHTML={{ __html: caption }}
      />
      <div className={styles.dots}>
        {[0, 1, 2].map((index) => (
          <i className={index === dotIndex ? styles.on : ""} key={index} />
        ))}
      </div>
    </div>
  );
}
