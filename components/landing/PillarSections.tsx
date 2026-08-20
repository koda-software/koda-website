"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { gsap as GsapNamespace } from "gsap";
import type { MotionPathPlugin as MotionPathPluginInstance } from "gsap/MotionPathPlugin";
import type { FeaturePillar } from "@/content/types";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right.mjs";
import BarChart3Icon from "lucide-react/dist/esm/icons/bar-chart-3.mjs";
import BadgeAlertIcon from "lucide-react/dist/esm/icons/badge-alert.mjs";
import BadgeCheckIcon from "lucide-react/dist/esm/icons/badge-check.mjs";
import CalendarDaysIcon from "lucide-react/dist/esm/icons/calendar-days.mjs";
import CheckIcon from "lucide-react/dist/esm/icons/check.mjs";
import CheckSquareIcon from "lucide-react/dist/esm/icons/check-square.mjs";
import FileTextIcon from "lucide-react/dist/esm/icons/file-text.mjs";
import GaugeIcon from "lucide-react/dist/esm/icons/gauge.mjs";
import GitBranchIcon from "lucide-react/dist/esm/icons/git-branch.mjs";
import KanbanSquareIcon from "lucide-react/dist/esm/icons/kanban-square.mjs";
import LockKeyholeIcon from "lucide-react/dist/esm/icons/lock-keyhole.mjs";
import Rows3Icon from "lucide-react/dist/esm/icons/rows-3.mjs";
import SendIcon from "lucide-react/dist/esm/icons/send.mjs";
import Table2Icon from "lucide-react/dist/esm/icons/table-2.mjs";
import TextCursorInputIcon from "lucide-react/dist/esm/icons/text-cursor-input.mjs";
import { HexIndex } from "./BrandMark";
import { mutedCopyClass, sectionDescriptionClass } from "./LandingPrimitives";
import styles from "./PillarSections.module.css";
import { Reveal } from "./Reveal";

type PillarSectionsProps = {
  items: FeaturePillar[];
};

type PillarAnimation = NonNullable<FeaturePillar["animation"]>;
type RuleAnimation = NonNullable<FeaturePillar["ruleAnimation"]>;
type PermissionAnimation = NonNullable<FeaturePillar["permissionAnimation"]>;
type BlockIcon = typeof GaugeIcon;
type ProcessViewMode = "table" | "kanban" | "calendar";
type PermissionRole = "employee" | "hr";
type RuleRoute = "positive" | "negative";
type RuleCompletion = RuleRoute | null;
type GsapModule = {
  gsap: typeof GsapNamespace;
};
type MotionPathModule = {
  MotionPathPlugin: typeof MotionPathPluginInstance;
};

const ruleNodeShadow = "0 22px 54px -34px rgba(2,2,13,0.52)";

const dashboardBlockIcons = [GaugeIcon, BarChart3Icon, Table2Icon] as const;
const placeholderIcons = [TextCursorInputIcon, Rows3Icon, CheckSquareIcon] as const;
const processViewIcons = [Table2Icon, KanbanSquareIcon, CalendarDaysIcon] as const;
const paletteClass =
  "grid content-start gap-2 rounded-[calc(var(--radius-panel)-14px)] border border-[rgba(2,2,13,0.07)] bg-white/68 p-3";
const pageClass =
  "relative rounded-[calc(var(--radius-panel)-14px)] bg-[rgba(255,255,255,0.72)] pt-3";
const dropSlotClass =
  "rounded-[calc(var(--radius-card)-4px)] border border-dashed";

async function animateDemoIn(root: HTMLElement | null, selector: string, y = 10) {
  if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const { gsap } = await (import("gsap") as Promise<GsapModule>);
  const targets = Array.from(root.querySelectorAll<HTMLElement>(selector));

  if (targets.length === 0) {
    return;
  }

  gsap.fromTo(
    targets,
    { autoAlpha: 0, scale: 0.975, y },
    {
      autoAlpha: 1,
      duration: 0.42,
      ease: "back.out(1.45)",
      scale: 1,
      stagger: 0.035,
      y: 0,
    },
  );
}

function BrowserPanel({
  children,
  label,
  tall = false,
}: {
  children: React.ReactNode;
  label: string;
  tall?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden rounded-[var(--radius-panel)] border border-[rgba(2,2,13,0.09)] bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(246,250,253,0.88))] p-5 shadow-[0_22px_70px_-46px_rgba(2,2,13,0.36)] ${tall ? "min-h-[22rem]" : "min-h-[20rem]"}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(56,182,255,0.12),transparent_30%),radial-gradient(circle_at_84%_76%,rgba(99,102,241,0.08),transparent_34%)]" aria-hidden="true" />
      <div className="relative flex h-full flex-col">
        <div className="mb-5 flex items-center justify-between border-b border-[rgba(2,2,13,0.07)] pb-4">
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b5f]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#f7c948]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#37c978]" />
          </div>
          <span className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
            {label}
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

function BlockLabel({
  children,
  icon: Icon,
}: {
  children: string;
  icon: BlockIcon;
}) {
  return (
    <div className="flex items-center gap-2 rounded-[calc(var(--radius-button)+2px)] border border-[rgba(2,2,13,0.08)] bg-white px-3 py-2 text-[0.78rem] font-medium text-[var(--color-ink-soft)]">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[calc(var(--radius-button)-4px)] border border-[rgba(56,182,255,0.2)] bg-[rgba(56,182,255,0.08)] text-[var(--color-blue)]">
        <Icon className="h-4 w-4" strokeWidth={1.6} />
      </span>
      <span className="truncate">{children}</span>
    </div>
  );
}

function BlockPalette({
  blocks,
  icons,
  className,
  onSelect,
  pulseFirst = false,
  selected,
}: {
  blocks: [string, string, string];
  icons: readonly [BlockIcon, BlockIcon, BlockIcon];
  className: string;
  onSelect?: (index: number) => void;
  pulseFirst?: boolean;
  selected?: boolean[];
}) {
  return (
    <div className={className}>
      {blocks.map((block, index) => (
        <button
          aria-pressed={selected?.[index]}
          className={`rounded-[calc(var(--radius-button)+2px)] text-left transition-[filter,opacity] duration-150 hover:brightness-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-blue)] ${
            pulseFirst && index === 0 && !selected?.[0] ? styles.pulseHint : ""
          } ${selected?.[index] ? "cursor-default opacity-[0.42] grayscale" : "cursor-pointer"}`}
          disabled={selected?.[index]}
          key={block}
          onClick={() => onSelect?.(index)}
          type="button"
        >
          <BlockLabel icon={icons[index]}>{block}</BlockLabel>
        </button>
      ))}
    </div>
  );
}

function EmptySlot({ label }: { label: string }) {
  return <span className="sr-only">{label}</span>;
}

function DashboardPage({
  animation,
  visibleBlocks,
}: {
  animation: PillarAnimation["dashboard"];
  visibleBlocks: boolean[];
}) {
  return (
    <div className="grid h-full min-h-[15.5rem] grid-rows-[auto_1fr] gap-3">
      <div className={`${dropSlotClass} min-h-[4.625rem] p-2 ${styles.interactiveDropZone}`}>
        {visibleBlocks[0] ? (
          <div className={`${styles.componentPop} grid grid-cols-3 gap-2`} data-build-component="0">
            {animation.metrics.map((metric, index) => (
              <span
                className="rounded-[calc(var(--radius-card)-6px)] border border-[rgba(2,2,13,0.08)] bg-white p-2"
                key={metric}
              >
                <span className="block h-2 w-1/2 rounded-full bg-[rgba(11,17,22,0.14)]" />
                <span
                  className={`mt-2 block h-4 rounded-full ${
                    index === 0
                      ? "w-2/3 bg-[rgba(56,182,255,0.24)]"
                      : index === 1
                        ? "w-3/5 bg-[rgba(16,185,129,0.2)]"
                        : "w-1/2 bg-[rgba(99,102,241,0.18)]"
                  }`}
                />
              </span>
            ))}
          </div>
        ) : (
          <EmptySlot label={animation.metrics.join(" / ")} />
        )}
      </div>
      <div className="grid grid-cols-[1fr_0.76fr] gap-3">
        <div className={`${dropSlotClass} p-3 ${styles.interactiveDropZone}`}>
          {visibleBlocks[1] ? (
          <div className={styles.componentPop} data-build-component="1">
            <span className="mb-2 block h-2 w-1/2 rounded-full bg-[rgba(11,17,22,0.12)]" />
            <div className="flex h-20 items-end gap-2">
              {[54, 78, 42, 68, 88].map((height, index) => (
                <span
                  className="flex-1 rounded-t-sm bg-[rgba(56,182,255,0.48)]"
                  key={index}
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </div>
          ) : (
            <EmptySlot label={animation.chartTitle} />
          )}
        </div>
        <div className={`${dropSlotClass} grid p-3 ${styles.interactiveDropZone}`}>
          {visibleBlocks[2] ? (
          <div className={`${styles.componentPop} grid gap-2`} data-build-component="2">
            <span className="h-2 w-2/3 rounded-full bg-[rgba(11,17,22,0.12)]" />
            <span className="h-2 w-full rounded-full bg-[rgba(11,17,22,0.08)]" />
            <span className="h-2 w-5/6 rounded-full bg-[rgba(11,17,22,0.08)]" />
            <span className="h-2 w-3/4 rounded-full bg-[rgba(11,17,22,0.08)]" />
          </div>
          ) : (
            <EmptySlot label={animation.tableTitle} />
          )}
        </div>
      </div>
    </div>
  );
}

function BuildPageInteractive({ animation }: { animation: PillarAnimation }) {
  const [visibleBlocks, setVisibleBlocks] = useState([false, false, false]);
  const rootRef = useRef<HTMLDivElement>(null);
  const complete = visibleBlocks.every(Boolean);

  const addBlock = (index: number) => {
    setVisibleBlocks((current) => current.map((visible, blockIndex) => visible || blockIndex === index));
    window.requestAnimationFrame(() => {
      void animateDemoIn(rootRef.current, `[data-build-component="${index}"]`);
      void animateDemoIn(rootRef.current, "[data-build-complete]", 6);
    });
  };

  return (
    <div className="relative min-h-[22rem] overflow-visible" ref={rootRef}>
      <div className={`relative left-1/2 min-h-[22rem] w-[31.5rem] ${styles.stageScale} ${styles.buildStage}`}>
        <div className="relative grid h-full min-h-[18rem] grid-cols-[0.42fr_1fr] gap-4">
          <div className="relative">
            <BlockPalette
              blocks={animation.dashboard.blocks}
              className={paletteClass}
              icons={dashboardBlockIcons}
              onSelect={addBlock}
              pulseFirst
              selected={visibleBlocks}
            />
          </div>

          <div className={pageClass}>
            <DashboardPage animation={animation.dashboard} visibleBlocks={visibleBlocks} />
            {complete ? (
              <span className={`${styles.componentPop} absolute bottom-0 right-0 grid h-8 w-8 translate-x-1/2 translate-y-1/2 place-items-center rounded-full border border-[rgba(16,185,129,0.24)] bg-[rgba(236,253,245,0.96)] text-[#0f8b5d] shadow-[0_16px_34px_-18px_rgba(2,2,13,0.38)]`} data-build-complete>
                <CheckIcon className="h-4 w-4" strokeWidth={2} />
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewModeButton({
  active,
  className,
  icon: Icon,
  label,
  onClick,
  pulse = false,
}: {
  active: boolean;
  className: string;
  icon: BlockIcon;
  label: string;
  onClick: () => void;
  pulse?: boolean;
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      className={`${styles.modeButton} ${className} ${active ? styles.modeButtonActive : ""} ${pulse ? styles.pulseHint : ""}`}
      onClick={onClick}
      type="button"
    >
      <Icon className="h-4 w-4" strokeWidth={1.65} />
    </button>
  );
}

function TableView({ active }: { active: boolean }) {
  return (
    <div className={`absolute inset-0 p-4 transition-[opacity,transform] duration-300 ${active ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`} data-process-view="table">
      <div className="overflow-hidden rounded-[calc(var(--radius-card)-4px)] border border-[rgba(2,2,13,0.09)] bg-white">
        <div className="grid grid-cols-[1.12fr_0.78fr_0.65fr] bg-[rgba(246,250,253,0.92)] text-[0.54rem] font-semibold uppercase text-[rgba(11,17,22,0.46)]">
          <span className="border-r border-[rgba(2,2,13,0.08)] px-3 py-2">Case</span>
          <span className="border-r border-[rgba(2,2,13,0.08)] px-3 py-2">Owner</span>
          <span className="px-3 py-2">Status</span>
        </div>
        {[0, 1, 2, 3, 4, 5].map((row) => (
          <div
            className="grid grid-cols-[1.12fr_0.78fr_0.65fr] border-t border-[rgba(2,2,13,0.07)]"
            key={row}
          >
            <span className="border-r border-[rgba(2,2,13,0.06)] px-3 py-2">
              <span className={`block h-2 rounded-full ${row % 2 === 0 ? "w-4/5 bg-[rgba(56,182,255,0.22)]" : "w-2/3 bg-[rgba(11,17,22,0.11)]"}`} />
            </span>
            <span className="border-r border-[rgba(2,2,13,0.06)] px-3 py-2">
              <span className={`block h-2 rounded-full ${row % 3 === 0 ? "w-3/5 bg-[rgba(16,185,129,0.2)]" : "w-1/2 bg-[rgba(11,17,22,0.1)]"}`} />
            </span>
            <span className="px-3 py-2">
              <span className={`block h-2 rounded-full ${row % 2 === 1 ? "w-2/3 bg-[rgba(99,102,241,0.18)]" : "w-1/2 bg-[rgba(11,17,22,0.1)]"}`} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function KanbanView({ active }: { active: boolean }) {
  const columns = [
    ["bg-[rgba(56,182,255,0.2)]", "bg-[rgba(56,182,255,0.12)]"],
    ["bg-[rgba(16,185,129,0.18)]", "bg-[rgba(16,185,129,0.1)]"],
    ["bg-[rgba(99,102,241,0.16)]", "bg-[rgba(99,102,241,0.09)]"],
  ];

  return (
    <div className={`absolute inset-0 grid grid-cols-3 gap-3 p-4 transition-[opacity,transform] duration-300 ${active ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`} data-process-view="kanban">
      {columns.map((column, columnIndex) => (
        <div className="grid content-start gap-2 rounded-[calc(var(--radius-card)-4px)] border border-[rgba(2,2,13,0.1)] bg-[rgba(246,250,253,0.82)] p-2 shadow-[0_14px_34px_-30px_rgba(2,2,13,0.38)]" key={columnIndex}>
          <span className={`mb-1 h-2 w-2/3 rounded-full ${column[0]}`} />
          {[0, 1, 2].map((card) => (
            <span className="grid gap-2 rounded-[calc(var(--radius-card)-7px)] border border-[rgba(2,2,13,0.09)] bg-white p-2 shadow-[0_10px_24px_-20px_rgba(2,2,13,0.34)]" key={card}>
              <span className={`h-2 rounded-full ${card === 1 ? "w-2/3" : "w-4/5"} ${column[0]}`} />
              <span className={`h-2 rounded-full ${card === 2 ? "w-1/2" : "w-3/5"} ${column[1]}`} />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function CalendarView({ active }: { active: boolean }) {
  const events = [
    "col-start-2 row-start-2 bg-[rgba(56,182,255,0.18)]",
    "col-start-5 row-start-3 bg-[rgba(16,185,129,0.16)]",
    "col-start-3 row-start-5 bg-[rgba(99,102,241,0.14)]",
  ];

  return (
    <div className={`absolute inset-0 grid grid-cols-7 grid-rows-[repeat(5,minmax(0,1fr))] gap-1.5 p-4 transition-[opacity,transform] duration-300 ${active ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`} data-process-view="calendar">
      {Array.from({ length: 35 }, (_, index) => (
        <span
          className="rounded-[calc(var(--radius-card)-8px)] border border-[rgba(2,2,13,0.05)] bg-white/72 p-1 text-[0.5rem] text-[rgba(11,17,22,0.38)]"
          key={index}
        >
          {index + 1}
        </span>
      ))}
      {events.map((event, index) => (
        <span className={`${event} z-10 mt-5 h-4 rounded-full border border-white/80 shadow-[0_10px_24px_-18px_rgba(2,2,13,0.24)]`} key={index} />
      ))}
    </div>
  );
}

function ProcessViewInteractive() {
  const [activeView, setActiveView] = useState<ProcessViewMode>("table");
  const [hasOpenedKanban, setHasOpenedKanban] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.requestAnimationFrame(() => {
      void animateDemoIn(rootRef.current, `[data-process-view="${activeView}"] > *`, 8);
    });
  }, [activeView]);

  return (
    <div className="relative min-h-[22rem] overflow-visible" ref={rootRef}>
      <div className={`relative left-1/2 min-h-[22rem] w-[31.5rem] ${styles.stageScale} ${styles.processStage}`}>
        <div className="relative rounded-[calc(var(--radius-panel)-14px)] bg-[rgba(255,255,255,0.72)] p-4">
          <div className="mb-3 flex gap-2">
            <ViewModeButton
              active={activeView === "table"}
              className=""
              icon={processViewIcons[0]}
              label="Table view"
              onClick={() => setActiveView("table")}
            />
            <ViewModeButton
              active={activeView === "kanban"}
              className=""
              icon={processViewIcons[1]}
              label="Kanban view"
              onClick={() => {
                setActiveView("kanban");
                setHasOpenedKanban(true);
              }}
              pulse={!hasOpenedKanban && activeView !== "kanban"}
            />
            <ViewModeButton
              active={activeView === "calendar"}
              className=""
              icon={processViewIcons[2]}
              label="Calendar view"
              onClick={() => setActiveView("calendar")}
            />
          </div>
          <div className="relative h-[16.5rem] overflow-hidden rounded-[calc(var(--radius-panel)-14px)] border border-[rgba(2,2,13,0.07)] bg-[rgba(246,250,253,0.78)]">
            <TableView active={activeView === "table"} />
            <KanbanView active={activeView === "kanban"} />
            <CalendarView active={activeView === "calendar"} />
          </div>
        </div>
      </div>
    </div>
  );
}

function RuleNode({
  children,
  className,
  finalSuccess = false,
  icon: Icon,
  meta,
  nodeId,
  tone = "blue",
  title,
}: {
  children?: React.ReactNode;
  className: string;
  finalSuccess?: boolean;
  icon: BlockIcon;
  meta: string;
  nodeId: string;
  tone?: "blue" | "green" | "red";
  title: string;
}) {
  const toneClass =
    tone === "green"
      ? "border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.08)] text-[#0f8b5d]"
      : tone === "red"
        ? "border-[rgba(248,113,113,0.26)] bg-[rgba(248,113,113,0.08)] text-[#c2413b]"
        : "border-[rgba(56,182,255,0.2)] bg-[rgba(56,182,255,0.08)] text-[var(--color-blue)]";

  return (
    <div className={`absolute z-10 rounded-[calc(var(--radius-panel)-14px)] border border-[rgba(2,2,13,0.08)] bg-white p-3 shadow-[0_22px_54px_-34px_rgba(2,2,13,0.52)] ${className}`} data-rule-node={nodeId}>
      <div className="flex items-start gap-2.5">
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-[calc(var(--radius-button)-4px)] border ${toneClass}`}>
          <Icon className="h-4 w-4" strokeWidth={1.6} />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[0.78rem] font-semibold text-[var(--color-ink)]">
            {title}
          </span>
          <span className="mt-0.5 block truncate text-[0.62rem] text-[var(--color-muted)]">
            {meta}
          </span>
        </span>
      </div>
      {children}
      {finalSuccess ? (
        <span className="absolute bottom-0 left-0 grid h-6 w-6 -translate-x-1/3 translate-y-1/3 place-items-center rounded-full border border-[rgba(16,185,129,0.28)] bg-[rgba(236,253,245,0.98)] text-[#0f8b5d] shadow-[0_12px_24px_-16px_rgba(2,2,13,0.38)]">
          <CheckIcon className="h-3.5 w-3.5" strokeWidth={2.2} />
        </span>
      ) : null}
    </div>
  );
}

function RuleFlowInteractive({ animation }: { animation: RuleAnimation }) {
  const [isRunning, setIsRunning] = useState(false);
  const [activeRoute, setActiveRoute] = useState<RuleRoute>("positive");
  const [nextRoute, setNextRoute] = useState<RuleRoute>("positive");
  const [completedRoute, setCompletedRoute] = useState<RuleCompletion>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputPathRef = useRef<SVGPathElement>(null);
  const middlePathRef = useRef<SVGPathElement>(null);
  const branchPathRef = useRef<SVGPathElement>(null);
  const tokenRef = useRef<HTMLDivElement>(null);
  const tokenCoreRef = useRef<HTMLSpanElement>(null);
  const tokenAmountRef = useRef<HTMLSpanElement>(null);
  const conditionLogicRef = useRef<HTMLSpanElement>(null);
  const conditionAmountRef = useRef<HTMLSpanElement>(null);
  const conditionOperatorRef = useRef<HTMLSpanElement>(null);
  const conditionLimitRef = useRef<HTMLSpanElement>(null);
  const positiveLabelRef = useRef<HTMLSpanElement>(null);
  const negativeLabelRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  const playRuleFlow = async (route: RuleRoute) => {
    const root = rootRef.current;
    const inputPath = inputPathRef.current;
    const middlePath = middlePathRef.current;
    const branchPath = branchPathRef.current;
    const token = tokenRef.current;
    const tokenCore = tokenCoreRef.current;
    const tokenAmount = tokenAmountRef.current;
    const conditionLogic = conditionLogicRef.current;
    const conditionAmount = conditionAmountRef.current;
    const conditionOperator = conditionOperatorRef.current;
    const conditionLimit = conditionLimitRef.current;

    if (
      !root ||
      !inputPath ||
      !middlePath ||
      !branchPath ||
      !token ||
      !tokenCore ||
      !tokenAmount ||
      !conditionLogic ||
      !conditionAmount ||
      !conditionOperator ||
      !conditionLimit
    ) {
      setIsRunning(false);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsRunning(false);
      return;
    }

    const [{ gsap }, { MotionPathPlugin }] = await Promise.all([
      import("gsap") as Promise<GsapModule>,
      import("gsap/MotionPathPlugin") as Promise<MotionPathModule>,
    ]);
    gsap.registerPlugin(MotionPathPlugin);

    timelineRef.current?.kill();

    const startNode = root.querySelector<HTMLElement>('[data-rule-node="start"]');
    const conditionNode = root.querySelector<HTMLElement>('[data-rule-node="condition"]');
    const resultNode = root.querySelector<HTMLElement>(`[data-rule-node="${route}"]`);
    const activeLabel = route === "positive" ? positiveLabelRef.current : negativeLabelRef.current;
    const inactiveLabel = route === "positive" ? negativeLabelRef.current : positiveLabelRef.current;
    const activeColor = route === "positive" ? "#10b981" : "#f87171";
    const activeSoftColor = route === "positive" ? "rgba(16,185,129,0.78)" : "rgba(248,113,113,0.82)";
    const amount = route === "positive" ? "€499" : "€2400";
    const decisionShadow =
      route === "positive"
        ? `0 0 0 4px rgba(16,185,129,0.13), ${ruleNodeShadow}`
        : `0 0 0 4px rgba(248,113,113,0.14), ${ruleNodeShadow}`;
    const branchPathD =
      route === "positive"
        ? "M 252 246 C 252 306 132 306 132 342"
        : "M 252 246 C 252 306 372 306 372 342";

    inputPath.setAttribute("d", "M 252 54 V 95");
    middlePath.setAttribute("d", "M 252 151 V 190");
    branchPath.setAttribute("d", branchPathD);
    tokenAmount.textContent = amount;
    conditionAmount.textContent = amount;

    const preparePath = (path: SVGPathElement, color: string) => {
      path.style.stroke = color;
      path.style.strokeDasharray = "1";
      path.style.strokeDashoffset = "1";
      path.style.opacity = "0";
    };

    preparePath(inputPath, "rgba(56,182,255,0.76)");
    preparePath(middlePath, "rgba(56,182,255,0.76)");
    preparePath(branchPath, activeSoftColor);

    gsap.set([startNode, conditionNode, resultNode], {
      boxShadow: ruleNodeShadow,
      scale: 1,
    });
    gsap.set([positiveLabelRef.current, negativeLabelRef.current], {
      backgroundColor: "rgba(255,255,255,0.86)",
      borderColor: "rgba(11,17,22,0.1)",
      color: "rgba(11,17,22,0.42)",
      opacity: 0.58,
      scale: 1,
    });
    gsap.set(conditionLogic, {
      autoAlpha: 0,
      backgroundColor: "rgba(246,250,253,0.88)",
      borderColor: "rgba(11,17,22,0.08)",
      color: "var(--color-muted)",
      scale: 0.98,
      y: 4,
    });
    gsap.set([conditionAmount, conditionOperator, conditionLimit], {
      color: "var(--color-muted)",
    });
    gsap.set(token, { autoAlpha: 1, scale: 1, x: 252, y: 54 });
    gsap.set(tokenCore, {
      autoAlpha: 1,
      backgroundColor: "var(--color-blue)",
      boxShadow: "0 0 0 0 rgba(56,182,255,0)",
      scale: 1,
    });
    gsap.set(tokenAmount, { autoAlpha: 1, x: 0 });

    const pulseNode = (node: HTMLElement | null, color = "rgba(56,182,255,0.18)", shadow?: string) => {
      if (!node) {
        return;
      }

      timeline.to(
        node,
        {
          boxShadow: shadow ?? `0 0 0 5px ${color}, ${ruleNodeShadow}`,
          duration: 0.1,
          ease: "power2.out",
          scale: 1.018,
        },
      ).to(
        node,
        {
          boxShadow: ruleNodeShadow,
          duration: 0.16,
          ease: "power3.out",
          scale: 1,
        },
      );
    };

    const absorbAt = (node: HTMLElement | null, color = "rgba(56,182,255,0.18)") => {
      pulseNode(node, color);
      timeline
        .to(tokenCore, {
          boxShadow: `0 0 0 7px ${color}`,
          duration: 0.08,
          ease: "power2.out",
          scale: 1.12,
        }, "<")
        .to(tokenAmount, {
          autoAlpha: 0,
          duration: 0.08,
          ease: "power2.out",
          x: 3,
        }, "<")
        .to(tokenCore, {
          autoAlpha: 0,
          duration: 0.1,
          ease: "power2.in",
          scale: 0.28,
        });
    };

    const emitFrom = (x: number, y: number, color = "var(--color-blue)") => {
      timeline
        .set(token, { x, y })
        .set(tokenCore, {
          autoAlpha: 1,
          backgroundColor: color,
          boxShadow: "0 0 0 0 rgba(56,182,255,0)",
          scale: 0.34,
        })
        .set(tokenAmount, { x: -2 })
        .to(tokenCore, {
          duration: 0.12,
          ease: "back.out(2.2)",
          scale: 1,
        })
        .to(tokenAmount, {
          autoAlpha: 1,
          duration: 0.12,
          ease: "power2.out",
          x: 0,
        }, "<0.03");
    };

    const timeline = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => {
        gsap.to(token, { autoAlpha: 0, duration: 0.22, ease: "power2.out" });
        setIsRunning(false);
      },
    });
    timelineRef.current = timeline;

    timeline
      .fromTo(token, { autoAlpha: 0, scale: 0.72 }, { autoAlpha: 1, duration: 0.18, ease: "power2.out", scale: 1 })
      .to(inputPath, { opacity: 1, duration: 0.06 }, "<")
      .to(inputPath, { duration: 0.46, ease: "power1.inOut", strokeDashoffset: 0 }, "<")
      .to(
        token,
        {
          duration: 0.46,
          ease: "power2.inOut",
          motionPath: { path: "M 252 54 V 95", autoRotate: false },
        },
        "<",
      );

    absorbAt(startNode);
    emitFrom(252, 151);

    timeline
      .to(middlePath, { opacity: 1, duration: 0.06 }, "+=0.02")
      .to(middlePath, { duration: 0.42, ease: "power1.inOut", strokeDashoffset: 0 }, "<")
      .to(
        token,
        {
          duration: 0.42,
          ease: "power2.inOut",
          motionPath: { path: "M 252 151 V 190", autoRotate: false },
        },
        "<",
      );

    absorbAt(conditionNode);

    timeline
      .to(conditionLogic, {
        autoAlpha: 1,
        duration: 0.24,
        ease: "back.out(1.8)",
        scale: 1,
        y: 0,
      }, "+=0.02")
      .to(conditionAmount, {
        color: "var(--color-ink)",
        duration: 0.2,
        ease: "power2.out",
      })
      .to(conditionOperator, {
        color: activeColor,
        duration: 0.2,
        ease: "power2.out",
      }, "<0.08")
      .to(conditionLimit, {
        color: "var(--color-ink)",
        duration: 0.2,
        ease: "power2.out",
      }, "<0.08")
      .to(conditionLogic, {
        backgroundColor: route === "positive" ? "rgba(236,253,245,0.94)" : "rgba(254,242,242,0.94)",
        borderColor: route === "positive" ? "rgba(16,185,129,0.28)" : "rgba(248,113,113,0.34)",
        color: activeColor,
        duration: 0.24,
        ease: "power2.out",
      }, "+=0.16")
      .to(conditionNode, {
        boxShadow: decisionShadow,
        duration: 0.1,
        ease: "power2.out",
        scale: 1.014,
      }, "<")
      .to(tokenCore, {
        backgroundColor: activeColor,
        duration: 0.01,
      }, "+=0.22");

    emitFrom(252, 246, activeColor);

    timeline
      .to(conditionNode, {
        boxShadow: ruleNodeShadow,
        duration: 0.16,
        ease: "power3.out",
        scale: 1,
      })
      .to(activeLabel, {
        backgroundColor: route === "positive" ? "rgba(236,253,245,0.96)" : "rgba(254,242,242,0.96)",
        borderColor: route === "positive" ? "rgba(16,185,129,0.28)" : "rgba(248,113,113,0.34)",
        color: route === "positive" ? "#0f8b5d" : "#c2413b",
        duration: 0.18,
        ease: "power2.out",
        opacity: 1,
        scale: 1.04,
      }, "<0.08")
      .to(inactiveLabel, { duration: 0.2, opacity: 0.32 }, "<")
      .to(branchPath, { opacity: 1, duration: 0.06 }, ">")
      .to(branchPath, { duration: 0.68, ease: "power1.inOut", strokeDashoffset: 0 }, "<")
      .to(
        token,
        {
          duration: 0.68,
          ease: "power2.inOut",
          motionPath: { path: branchPathD, autoRotate: false },
        },
        "<",
      );

    absorbAt(resultNode, route === "positive" ? "rgba(16,185,129,0.16)" : "rgba(248,113,113,0.17)");

    timeline.add(() => setCompletedRoute(route));

    timeline
      .to(tokenCore, {
        boxShadow: `0 0 0 0 ${route === "positive" ? "rgba(16,185,129,0)" : "rgba(248,113,113,0)"}`,
        duration: 0.24,
        ease: "power2.out",
      }, "+=0.02")
      .to([inputPath, middlePath, branchPath], { opacity: 0.28, duration: 0.35, ease: "power2.out" }, "+=0.25")
      .to(activeLabel, { opacity: 0.72, scale: 1, duration: 0.28, ease: "power2.out" }, "<");
  };

  const startFlow = () => {
    if (isRunning) return;
    const route = nextRoute;
    setCompletedRoute(null);
    setActiveRoute(route);
    setNextRoute((current) => (current === "positive" ? "negative" : "positive"));
    setIsRunning(true);
    void playRuleFlow(route);
  };

  return (
    <div className="relative min-h-[29rem] overflow-visible pt-12" ref={rootRef}>
      <div className={`relative left-1/2 min-h-[26.25rem] w-[31.5rem] ${styles.stageScale} ${styles.ruleStage}`}>
        <div className="relative h-[26.25rem] overflow-visible rounded-[calc(var(--radius-panel)-14px)] bg-[radial-gradient(circle,rgba(11,17,22,0.1)_1px,transparent_1.2px)] [background-size:18px_18px]">
          <button
            className={`absolute left-1/2 top-[0.625rem] z-20 inline-flex -translate-x-1/2 cursor-pointer items-center gap-2.5 rounded-[calc(var(--radius-button)+4px)] border border-[rgba(56,182,255,0.3)] bg-white px-4 py-2.5 text-[0.78rem] font-semibold text-[var(--color-ink-soft)] shadow-[0_16px_34px_-22px_rgba(2,2,13,0.38)] transition-[filter] duration-150 hover:brightness-[0.96] disabled:cursor-default ${!isRunning ? styles.pulseHint : ""}`}
            disabled={isRunning}
            onClick={startFlow}
            type="button"
          >
            <SendIcon className="h-4 w-4 text-[var(--color-blue)]" strokeWidth={1.7} />
            {animation.actionLabel}
          </button>
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 504 420">
            <path className={styles.ruleBasePath} d="M 252 54 V 95" />
            <path className={styles.ruleBasePath} d="M 252 151 V 190" />
            <path className={styles.ruleBasePath} d="M 252 246 C 252 306 132 306 132 342" />
            <path className={styles.ruleBasePath} d="M 252 246 C 252 306 372 306 372 342" />
            <path className={styles.ruleGsapPath} pathLength="1" ref={inputPathRef} />
            <path className={styles.ruleGsapPath} pathLength="1" ref={middlePathRef} />
            <path className={styles.ruleGsapPath} pathLength="1" ref={branchPathRef} />
          </svg>
          <div className={styles.ruleMotionToken} ref={tokenRef}>
            <span className={styles.ruleMotionTokenInner}>
              <span className={styles.ruleMotionTokenCore} ref={tokenCoreRef}>
                <span />
              </span>
              <span className={styles.ruleMotionTokenAmount} ref={tokenAmountRef}>
                {activeRoute === "positive" ? "€499" : "€2400"}
              </span>
            </span>
          </div>

          <RuleNode
            className="left-1/2 top-[5.95rem] w-[13.625rem] -translate-x-1/2"
            icon={FileTextIcon}
            meta={animation.start.meta}
            nodeId="start"
            title={animation.start.title}
          />
          <RuleNode
            className="left-1/2 top-[11.85rem] w-[14.125rem] -translate-x-1/2"
            icon={GitBranchIcon}
            meta={animation.condition.meta}
            nodeId="condition"
            title={animation.condition.title}
          >
            <span className={styles.ruleConditionLogic} ref={conditionLogicRef}>
              <span ref={conditionAmountRef}>{activeRoute === "positive" ? "€499" : "€2400"}</span>
              <span ref={conditionOperatorRef}>&lt;</span>
              <span ref={conditionLimitRef}>€1000</span>
            </span>
          </RuleNode>
          <span className={`${styles.ruleBranchLabel} left-[4rem] top-[19.1rem]`} ref={positiveLabelRef}>
            {animation.positiveLabel}
          </span>
          <RuleNode
            className="left-0 top-[21.4rem] w-[14.725rem]"
            icon={BadgeCheckIcon}
            meta={animation.positive.meta}
            nodeId="positive"
            title={animation.positive.title}
            finalSuccess={completedRoute === "positive"}
            tone="green"
          />
          <span className={`${styles.ruleBranchLabel} right-[4rem] top-[19.1rem]`} ref={negativeLabelRef}>
            {animation.negativeLabel}
          </span>
          <RuleNode
            className="right-0 top-[21.4rem] w-[14.725rem]"
            icon={BadgeAlertIcon}
            meta={animation.negative.meta}
            nodeId="negative"
            title={animation.negative.title}
            finalSuccess={completedRoute === "negative"}
            tone="red"
          />
        </div>
      </div>
    </div>
  );
}

function PermissionFormInteractive({ animation }: { animation: PermissionAnimation }) {
  const [role, setRole] = useState<PermissionRole>("hr");
  const [hasViewedEmployee, setHasViewedEmployee] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const protectedHidden = role === "employee";

  useEffect(() => {
    window.requestAnimationFrame(() => {
      void animateDemoIn(rootRef.current, "[data-permission-field]", 6);
    });
  }, [role]);

  return (
    <div className="relative min-h-[22rem] overflow-visible" ref={rootRef}>
      <div className={`relative left-1/2 min-h-[22rem] w-[31.5rem] ${styles.stageScale} ${styles.permissionStage}`}>
        <div className="relative h-[22rem] overflow-hidden rounded-[calc(var(--radius-panel)-14px)] bg-[radial-gradient(circle,rgba(11,17,22,0.08)_1px,transparent_1.2px)] [background-size:18px_18px]">
          <div className="absolute left-1/2 top-5 grid w-[24rem] -translate-x-1/2 gap-3">
            <div className="flex justify-end">
              <div className="flex rounded-[calc(var(--radius-button)+4px)] border border-[rgba(2,2,13,0.08)] bg-white p-1 shadow-[0_12px_28px_-24px_rgba(2,2,13,0.32)]">
                {([
                  ["hr", animation.hrRoleLabel],
                  ["employee", animation.employeeRoleLabel],
                ] as const).map(([value, label]) => (
                  <button
                    className={`min-h-8 cursor-pointer rounded-[var(--radius-button)] px-3 text-[0.68rem] font-semibold transition-colors ${
                      role === value
                        ? "bg-[rgba(56,182,255,0.12)] text-[var(--color-blue)]"
                        : "text-[var(--color-muted)] hover:text-[var(--color-ink-soft)]"
                    } ${value === "employee" && !hasViewedEmployee && role !== "employee" ? styles.pulseHint : ""}`}
                    key={value}
                    onClick={() => {
                      setRole(value);
                      if (value === "employee") {
                        setHasViewedEmployee(true);
                      }
                    }}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[calc(var(--radius-panel)-12px)] border border-[rgba(2,2,13,0.08)] bg-white p-4 shadow-[0_18px_46px_-36px_rgba(2,2,13,0.4)]">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[0.82rem] font-semibold text-[var(--color-ink)]">
                {animation.title}
              </span>
            </div>
            <div className="grid gap-3">
              {animation.fields.map((field, index) => {
                const protectedField = index === 1;

                return (
                  <div
                    className={`relative overflow-hidden rounded-[calc(var(--radius-card)-4px)] border border-[rgba(2,2,13,0.08)] bg-[rgba(246,250,253,0.72)] p-3 ${
                      protectedField && protectedHidden ? styles.permissionProtectedFieldHidden : ""
                    }`}
                    data-permission-field={protectedField ? "protected" : "open"}
                    key={field.label}
                  >
                    <div className={`grid gap-2 ${protectedField && protectedHidden ? styles.permissionFieldContentHidden : ""}`}>
                      <span className="text-[0.58rem] font-medium text-[var(--color-ink-soft)]">
                        {field.label}
                      </span>
                      <span className="rounded-[calc(var(--radius-button)-4px)] border border-[rgba(2,2,13,0.08)] bg-white px-3 py-2 text-[0.72rem] font-medium text-[var(--color-ink)]">
                        {field.value}
                      </span>
                    </div>
                    {protectedField && protectedHidden ? (
                      <div className={`${styles.permissionLockOverlayVisible} absolute inset-0 grid place-items-center bg-[rgba(255,255,255,0.78)] backdrop-blur-[2px]`}>
                        <span className="flex items-center gap-2 rounded-[calc(var(--radius-button)+2px)] border border-[rgba(56,182,255,0.26)] bg-white px-3 py-2 text-[0.68rem] font-semibold text-[var(--color-ink-soft)] shadow-[0_14px_28px_-22px_rgba(2,2,13,0.35)]">
                          <LockKeyholeIcon className="h-4 w-4 text-[var(--color-blue)]" strokeWidth={1.7} />
                          {animation.lockedLabel}
                        </span>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderAnimation({ index, pillar }: { index: number; pillar: FeaturePillar }) {
  return (
    <BrowserPanel label={String(index + 1).padStart(2, "0")}>
      <div className="grid flex-1 place-items-center">
        <div className="w-full max-w-[24rem]">
          <div className="mb-4 grid grid-cols-3 gap-3">
            {pillar.capabilities.slice(0, 3).map((capability, blockIndex) => {
              const Icon = placeholderIcons[blockIndex % placeholderIcons.length];

              return (
                <span
                  className="grid h-16 place-items-center rounded-[calc(var(--radius-card)-4px)] border border-[rgba(56,182,255,0.18)] bg-white/72 text-[var(--color-blue)]"
                  key={capability}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
              );
            })}
          </div>
          <div className="rounded-[calc(var(--radius-panel)-12px)] border border-dashed border-[rgba(56,182,255,0.28)] bg-white/72 p-4">
            <div className="mb-3 h-3 w-2/5 rounded-full bg-[rgba(11,17,22,0.16)]" />
            <div className="grid gap-2">
              <span className="h-8 rounded-[calc(var(--radius-button)-4px)] bg-[rgba(11,17,22,0.06)]" />
              <span className="h-8 rounded-[calc(var(--radius-button)-4px)] bg-[rgba(11,17,22,0.06)]" />
              <span className="h-8 w-3/4 rounded-[calc(var(--radius-button)-4px)] bg-[rgba(56,182,255,0.12)]" />
            </div>
          </div>
        </div>
      </div>
    </BrowserPanel>
  );
}

export function PillarSections({ items }: PillarSectionsProps) {
  return (
    <div className="mt-[clamp(2.6rem,5vw,4.5rem)] grid gap-[clamp(6rem,10vw,9rem)]">
      {items.map((pillar, index) => {
        const visualFirst = index % 2 === 1;

        return (
          <section
            className="grid items-center gap-[clamp(2rem,5vw,4.5rem)] grid-cols-[minmax(0,0.76fr)_minmax(22rem,1fr)] max-[1120px]:grid-cols-[minmax(31.5rem,1.05fr)_minmax(17rem,0.85fr)] max-[900px]:grid-cols-1"
            key={pillar.title}
          >
            <Reveal className={`${visualFirst ? "max-[900px]:order-2" : ""} max-[900px]:px-[clamp(0.75rem,4vw,1.25rem)]`.trim()} from={visualFirst ? "left" : "right"}>
              {index === 0 && pillar.animation ? (
                <BuildPageInteractive animation={pillar.animation} />
              ) : index === 1 ? (
                <ProcessViewInteractive />
              ) : index === 2 && pillar.ruleAnimation ? (
                <RuleFlowInteractive animation={pillar.ruleAnimation} />
              ) : index === 3 && pillar.permissionAnimation ? (
                <PermissionFormInteractive animation={pillar.permissionAnimation} />
              ) : (
                <PlaceholderAnimation index={index} pillar={pillar} />
              )}
            </Reveal>
            <Reveal className={visualFirst ? "order-first max-[900px]:order-1" : ""} from={visualFirst ? "right" : "left"}>
              <article>
                <div className="mb-5 flex items-center gap-3">
                  <HexIndex index={index} />
                  <span className="h-px flex-1 bg-[linear-gradient(90deg,rgba(56,182,255,0.35),rgba(11,17,22,0.08),transparent)]" />
                </div>
                <h3 className="m-0 text-[clamp(1.6rem,2.6vw,2.28rem)] font-medium leading-[1.08] tracking-[-0.035em] text-[var(--color-ink)]">
                  {pillar.title}
                </h3>
                <p className={`${sectionDescriptionClass} max-w-[42rem]`}>
                  {pillar.description}
                </p>
                <ul className="mt-6 grid list-none gap-3 p-0">
                  {pillar.capabilities.map((capability) => (
                    <li
                      className={`${mutedCopyClass} flex items-center gap-3 text-[0.96rem]`}
                      key={capability}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-blue)]" />
                      {capability}
                    </li>
                  ))}
                </ul>
                {pillar.link ? (
                  <Link
                    className="group mt-7 inline-flex items-center gap-2 text-[1.06rem] font-semibold text-[var(--color-blue)] transition-colors duration-150 hover:text-[var(--color-blue-deep)]"
                    href={pillar.link.href}
                  >
                    <span className="border-b border-[rgba(56,182,255,0.34)] pb-0.5 transition-colors duration-150 group-hover:border-[rgba(20,112,184,0.55)]">
                      {pillar.link.label}
                    </span>
                    <ArrowRightIcon
                      className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                      strokeWidth={1.8}
                    />
                  </Link>
                ) : null}
              </article>
            </Reveal>
          </section>
        );
      })}
    </div>
  );
}
