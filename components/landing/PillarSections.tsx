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
import CheckIcon from "lucide-react/dist/esm/icons/check.mjs";
import CheckSquareIcon from "lucide-react/dist/esm/icons/check-square.mjs";
import FileTextIcon from "lucide-react/dist/esm/icons/file-text.mjs";
import GaugeIcon from "lucide-react/dist/esm/icons/gauge.mjs";
import GitBranchIcon from "lucide-react/dist/esm/icons/git-branch.mjs";
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

const ruleNodeShadow = "0 3px 6px -4px rgba(2,2,13,0.74), 0 5px 9px -8px rgba(2,2,13,0.7)";

const dashboardBlockIcons = [GaugeIcon, BarChart3Icon, Table2Icon] as const;
const placeholderIcons = [TextCursorInputIcon, Rows3Icon, CheckSquareIcon] as const;
const paletteClass =
  "grid content-start gap-2 rounded-[calc(var(--radius-panel)-14px)] border border-[rgba(2,2,13,0.12)] bg-white/88 p-3";
const pageClass =
  "relative rounded-[calc(var(--radius-panel)-14px)] bg-[rgba(255,255,255,0.9)] pt-3";
const dropSlotClass =
  "rounded-[calc(var(--radius-card)-4px)] border border-dashed";
const dashboardMetrics = [
  { caption: "Open", tone: "bg-[rgba(56,182,255,0.22)] text-[#075985]", value: "€18.4k" },
  { caption: "Weighted", tone: "bg-[rgba(16,185,129,0.2)] text-[#047857]", value: "€12.1k" },
  { caption: "Deals", tone: "bg-[rgba(99,102,241,0.2)] text-[#4338ca]", value: "27" },
] as const;
const dashboardBars = [
  { label: "New", value: 42 },
  { label: "Won", value: 78 },
  { label: "Risk", value: 28 },
  { label: "Soon", value: 62 },
  { label: "VIP", value: 92 },
] as const;
const dashboardRows = [
  ["Laptop docks", "12", "Ready"],
  ["Coffee beans", "4", "Low"],
  ["NDA pack", "8", "Review"],
] as const;
const processRecords = [
  {
    calendarClass: "col-start-2 row-start-1 bg-[#bdefff] text-[#075985]",
    date: "2",
    owner: "Marta",
    status: "Intake",
    title: "Invoice #1042",
  },
  {
    calendarClass: "col-start-5 row-start-2 bg-[#bef2da] text-[#047857]",
    date: "12",
    owner: "Tomek",
    status: "Doing",
    title: "Onboarding kit",
  },
  {
    calendarClass: "col-start-3 row-start-3 bg-[#d9dafe] text-[#4338ca]",
    date: "17",
    owner: "Ania",
    status: "Done",
    title: "Coffee budget",
  },
  {
    calendarClass: "col-start-6 row-start-4 bg-[#bef2da] text-[#047857]",
    date: "27",
    owner: "Piotr",
    status: "Doing",
    title: "Vendor NDA",
  },
  {
    calendarClass: "col-start-3 row-start-5 bg-[#bdefff] text-[#075985]",
    date: "31",
    owner: "Marta",
    status: "Intake",
    title: "Office plants",
  },
] as const;
const kanbanColumns = [
  {
    color: "bg-[#d9f4ff] text-[#075985] ring-1 ring-[#8fdcff]",
    status: "Intake",
  },
  {
    color: "bg-[#dff8eb] text-[#047857] ring-1 ring-[#9be5c1]",
    status: "Doing",
  },
  {
    color: "bg-[#e3e4ff] text-[#4338ca] ring-1 ring-[#b6b8ff]",
    status: "Done",
  },
] as const;

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
    <div className="flex items-center gap-2 rounded-[calc(var(--radius-button)+2px)] border border-[rgba(2,2,13,0.14)] bg-white px-3 py-2 text-[0.78rem] font-semibold text-[var(--color-ink)]">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[calc(var(--radius-button)-4px)] border border-[rgba(56,182,255,0.28)] bg-[rgba(56,182,255,0.11)] text-[var(--color-blue)]">
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
  pulseIndex,
  selected,
  showTryMe = false,
  tryLabel,
}: {
  blocks: [string, string, string];
  icons: readonly [BlockIcon, BlockIcon, BlockIcon];
  className: string;
  onSelect?: (index: number) => void;
  pulseIndex?: number;
  selected?: boolean[];
  showTryMe?: boolean;
  tryLabel: string;
}) {
  return (
    <div className={className}>
      {blocks.map((block, index) => (
        <button
          aria-pressed={selected?.[index]}
          className={`relative rounded-[calc(var(--radius-button)+2px)] text-left transition-[filter,opacity] duration-150 hover:brightness-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-blue)] ${
            pulseIndex === index && !selected?.[index] ? styles.pulseHint : ""
          } ${selected?.[index] ? "cursor-default opacity-[0.42] grayscale" : "cursor-pointer"}`}
          disabled={selected?.[index]}
          key={block}
          onClick={() => onSelect?.(index)}
          type="button"
        >
          {showTryMe && index === 0 && !selected?.[0] ? (
            <span className={`${styles.tryMePopover} pointer-events-none absolute left-[calc(50%+1.55rem)] top-0 z-20 min-w-[5.25rem] -translate-x-1/2 -translate-y-[calc(100%-0.38rem)] rounded-[calc(var(--radius-button)+3px)] border border-[rgba(16,185,129,0.36)] bg-[rgba(236,253,245,0.94)] px-3.5 py-2 text-center text-[0.82rem] font-semibold text-[#057344] shadow-[0_14px_32px_-22px_rgba(2,2,13,0.42)]`}>
              {tryLabel}
            </span>
          ) : null}
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
      <div className={visibleBlocks[0] ? "min-h-[4.625rem]" : `${dropSlotClass} min-h-[4.625rem] p-2 ${styles.interactiveDropZone}`}>
        {visibleBlocks[0] ? (
          <div className={`${styles.componentPop} grid min-h-[4.625rem] grid-cols-3 gap-2`} data-build-component="0">
            {animation.metrics.map((metric, index) => (
              <span
                className="rounded-[calc(var(--radius-card)-6px)] border border-[rgba(2,2,13,0.14)] bg-white p-2 shadow-[0_14px_28px_-22px_rgba(2,2,13,0.42)]"
                key={metric}
              >
                <span className="block truncate text-[0.5rem] font-bold uppercase tracking-[0.06em] text-[rgba(11,17,22,0.62)]">
                  {metric}
                </span>
                <span className="mt-1 block truncate text-[0.98rem] font-bold leading-none text-[var(--color-ink)]">
                  {dashboardMetrics[index].value}
                </span>
                <span className={`mt-1 inline-flex rounded-full px-1.5 py-0.5 text-[0.48rem] font-semibold ${dashboardMetrics[index].tone}`}>
                  {dashboardMetrics[index].caption}
                </span>
              </span>
            ))}
          </div>
        ) : (
          <EmptySlot label={animation.metrics.join(" / ")} />
        )}
      </div>
      <div className="grid grid-cols-[1fr_0.76fr] gap-3">
        <div className={visibleBlocks[1] ? "min-h-full" : `${dropSlotClass} p-3 ${styles.interactiveDropZone}`}>
          {visibleBlocks[1] ? (
          <div className={`${styles.componentPop} grid h-full grid-rows-[auto_1fr]`} data-build-component="1">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[0.58rem] font-semibold text-[var(--color-ink)]">
                {animation.chartTitle}
              </span>
              <span className="rounded-full bg-[rgba(56,182,255,0.18)] px-2 py-0.5 text-[0.48rem] font-bold text-[#0870b4]">
                live
              </span>
            </div>
            <div className="relative flex h-full min-h-[10.5rem] items-end gap-2 overflow-hidden rounded-[calc(var(--radius-card)-8px)] border border-[rgba(56,182,255,0.22)] bg-[linear-gradient(180deg,rgba(56,182,255,0.1),rgba(255,255,255,0.7))] px-2 pb-4 pt-2 shadow-[inset_0_0_0_1px_rgba(56,182,255,0.08)]">
              <span className="absolute bottom-[1.05rem] left-2 right-2 h-px bg-[rgba(11,17,22,0.18)]" aria-hidden="true" />
              {dashboardBars.map((bar) => (
                <span className="relative z-[1] flex h-full flex-1 flex-col justify-end gap-1" key={bar.label}>
                  <span className="flex min-h-0 flex-1 items-end">
                    <span
                      className="block min-h-3 w-full rounded-t-sm bg-[linear-gradient(180deg,#38b6ff,#1470b8)] shadow-[0_8px_18px_-12px_rgba(20,112,184,0.85)]"
                      style={{ height: `${bar.value}%` }}
                    />
                  </span>
                  <span className="truncate text-center text-[0.45rem] font-semibold text-[rgba(11,17,22,0.62)]">
                    {bar.label}
                  </span>
                </span>
              ))}
            </div>
          </div>
          ) : (
            <EmptySlot label={animation.chartTitle} />
          )}
        </div>
        <div className={visibleBlocks[2] ? "grid min-h-full" : `${dropSlotClass} grid p-3 ${styles.interactiveDropZone}`}>
          {visibleBlocks[2] ? (
          <div className={`${styles.componentPop} overflow-hidden rounded-[calc(var(--radius-card)-8px)] border border-[rgba(2,2,13,0.13)] bg-white shadow-[0_14px_28px_-22px_rgba(2,2,13,0.42)]`} data-build-component="2">
            <div className="border-b border-[rgba(2,2,13,0.12)] bg-[rgba(232,241,248,0.72)] px-2 py-1.5 text-[0.54rem] font-bold text-[var(--color-ink)]">
              {animation.tableTitle}
            </div>
            {dashboardRows.map((row) => (
              <div className="grid grid-cols-[1fr_1.8rem_2.7rem] border-b border-[rgba(2,2,13,0.05)] text-[0.48rem] last:border-b-0" key={row[0]}>
                <span className="truncate px-2 py-1.5 font-semibold text-[var(--color-ink)]">{row[0]}</span>
                <span className="px-1 py-1.5 text-right font-semibold text-[rgba(11,17,22,0.66)]">{row[1]}</span>
                <span className="truncate px-1.5 py-1.5 font-medium text-[rgba(11,17,22,0.64)]">{row[2]}</span>
              </div>
            ))}
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
  const pulseIndex = visibleBlocks.findIndex((visible) => !visible);

  const addBlock = (index: number) => {
    setVisibleBlocks((current) => current.map((visible, blockIndex) => visible || blockIndex === index));
    window.requestAnimationFrame(() => {
      void animateDemoIn(rootRef.current, `[data-build-component="${index}"]`);
      void animateDemoIn(rootRef.current, "[data-build-complete]", 6);
    });
  };

  return (
    <div className="relative min-h-[22rem] w-full overflow-visible" ref={rootRef}>
      <div className={`relative left-1/2 min-h-[22rem] w-full ${styles.stageScale} ${styles.startStage} ${styles.buildStage}`}>
        <div className="relative grid h-full min-h-[18rem] grid-cols-[0.42fr_1fr] gap-4">
          <div className="relative">
            <BlockPalette
              blocks={animation.dashboard.blocks}
              className={paletteClass}
              icons={dashboardBlockIcons}
              onSelect={addBlock}
              pulseIndex={pulseIndex === -1 ? undefined : pulseIndex}
              selected={visibleBlocks}
              showTryMe={!visibleBlocks.some(Boolean)}
              tryLabel={animation.tryLabel}
            />
          </div>

          <div className={pageClass}>
            <DashboardPage animation={animation.dashboard} visibleBlocks={visibleBlocks} />
            {complete ? (
              <span className={`${styles.componentPop} absolute bottom-[-0.75rem] right-[-0.75rem] grid h-8 w-8 place-items-center rounded-full border border-[rgba(16,185,129,0.24)] bg-[rgba(236,253,245,0.96)] text-[#0f8b5d] shadow-[0_16px_34px_-18px_rgba(2,2,13,0.38)]`} data-build-complete>
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
  label,
  onClick,
  pulse = false,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  pulse?: boolean;
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      className={`${styles.modeButton} ${active ? styles.modeButtonActive : ""} ${pulse ? styles.pulseHint : ""}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
}

function TableView({ active }: { active: boolean }) {
  return (
    <div className={`absolute inset-0 p-4 transition-[opacity,transform] duration-300 ${active ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`} data-process-view="table">
      <div className="overflow-hidden rounded-[calc(var(--radius-card)-4px)] border border-[rgba(2,2,13,0.18)] bg-white">
        <div className="grid grid-cols-[1.08fr_0.58fr_0.62fr_0.38fr] bg-[rgba(220,235,246,0.98)] text-[0.54rem] font-bold uppercase text-[rgba(11,17,22,0.72)]">
          <span className="border-r border-[rgba(2,2,13,0.11)] px-3 py-2">Case</span>
          <span className="border-r border-[rgba(2,2,13,0.11)] px-3 py-2">Owner</span>
          <span className="border-r border-[rgba(2,2,13,0.11)] px-3 py-2">Status</span>
          <span className="px-3 py-2">Day</span>
        </div>
        {processRecords.map((record) => (
          <div
            className="grid grid-cols-[1.08fr_0.58fr_0.62fr_0.38fr] border-t border-[rgba(2,2,13,0.12)]"
            key={record.title}
          >
            <span className="truncate border-r border-[rgba(2,2,13,0.1)] px-3 py-2 text-[0.64rem] font-bold text-[var(--color-ink)]">
              {record.title}
            </span>
            <span className="truncate border-r border-[rgba(2,2,13,0.1)] px-3 py-2 text-[0.64rem] font-medium text-[rgba(11,17,22,0.72)]">
              {record.owner}
            </span>
            <span className="truncate border-r border-[rgba(2,2,13,0.1)] px-3 py-2 text-[0.62rem] font-semibold text-[rgba(11,17,22,0.78)]">
              {record.status}
            </span>
            <span className="px-3 py-2 text-[0.62rem] font-semibold text-[rgba(11,17,22,0.72)]">
              {record.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function KanbanView({ active }: { active: boolean }) {
  return (
    <div className={`absolute inset-0 grid grid-cols-3 gap-3 p-4 transition-[opacity,transform] duration-300 ${active ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`} data-process-view="kanban">
      {kanbanColumns.map((column) => (
        <div className="grid content-start gap-2 rounded-[calc(var(--radius-card)-4px)] border border-[rgba(2,2,13,0.16)] bg-[rgba(248,249,250,0.94)] p-2" key={column.status}>
          <span className={`mb-1 rounded-full px-2 py-1 text-[0.58rem] font-bold ${column.color}`}>
            {column.status}
          </span>
          {processRecords
            .filter((record) => record.status === column.status)
            .map((record) => (
            <span className="rounded-[calc(var(--radius-card)-7px)] border border-[rgba(2,2,13,0.16)] bg-[rgba(250,252,254,1)] p-2 text-[0.6rem] font-bold leading-[1.25] text-[var(--color-ink)] shadow-[0_1px_1px_rgba(50,70,88,0.24)]" key={record.title}>
              {record.title}
              <span className="mt-1 block text-[0.48rem] font-semibold text-[rgba(11,17,22,0.62)]">
                {record.owner} · day {record.date}
              </span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function CalendarView({ active }: { active: boolean }) {
  return (
    <div className={`absolute inset-0 grid grid-cols-7 grid-rows-[repeat(5,minmax(0,1fr))] gap-1.5 rounded-[calc(var(--radius-panel)-14px)] border border-[rgba(2,2,13,0.14)] bg-[rgba(248,249,250,0.94)] p-4 transition-[opacity,transform] duration-300 ${active ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`} data-process-view="calendar">
      {Array.from({ length: 35 }, (_, index) => (
        <span
          className="rounded-[calc(var(--radius-card)-8px)] border border-[rgba(2,2,13,0.16)] bg-[rgba(235,242,248,0.98)] p-1 text-[0.5rem] font-bold text-[rgba(11,17,22,0.66)]"
          key={index}
        >
          {index + 1}
        </span>
      ))}
      {processRecords.map((record) => (
        <span className={`${record.calendarClass} z-10 mt-4 truncate rounded-full border border-white px-2 py-1 text-[0.54rem] font-bold shadow-[0_14px_30px_-16px_rgba(2,2,13,0.52)] ring-1 ring-[rgba(2,2,13,0.08)]`} key={record.title}>
          {record.title.replace(/^(.+?)(\s|#).*$/, "$1")}
        </span>
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
    <div className={`${styles.wideStageFrame} relative min-h-[22rem] w-full overflow-visible`} ref={rootRef}>
      <div className={`relative left-1/2 min-h-[22rem] w-full min-[1440px]:pl-8 ${styles.stageScale} ${styles.edgeStage} ${styles.wideDesktopStage} ${styles.processStage}`}>
        <div className="relative rounded-[calc(var(--radius-panel)-14px)] bg-[rgba(255,255,255,0.9)] p-4">
          <div className="mb-3 ml-4 flex w-[calc(100%-1rem)]">
            <div className="inline-flex rounded-[calc(var(--radius-button)+4px)] border border-[rgba(2,2,13,0.12)] bg-white p-1 shadow-[0_12px_28px_-22px_rgba(2,2,13,0.38)]">
            <ViewModeButton
              active={activeView === "table"}
              label="Table"
              onClick={() => setActiveView("table")}
            />
            <ViewModeButton
              active={activeView === "kanban"}
              label="Kanban"
              onClick={() => {
                setActiveView("kanban");
                setHasOpenedKanban(true);
              }}
              pulse={!hasOpenedKanban && activeView !== "kanban"}
            />
            <ViewModeButton
              active={activeView === "calendar"}
              label="Calendar"
              onClick={() => setActiveView("calendar")}
            />
            </div>
          </div>
          <div className="relative h-[16.5rem] overflow-hidden">
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
        : "border-[rgba(2,2,13,0.14)] bg-[rgba(2,2,13,0.05)] text-[rgba(11,17,22,0.72)]";

  return (
    <div className={`${styles.ruleNode} absolute z-10 rounded-[calc(var(--radius-panel)-14px)] border border-[rgba(2,2,13,0.08)] bg-white p-3 shadow-[0_3px_6px_-4px_rgba(2,2,13,0.74),0_5px_9px_-8px_rgba(2,2,13,0.7)] ${className}`} data-rule-node={nodeId}>
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
        <span className={`${styles.ruleCheckBadge} absolute bottom-0 left-0 grid h-6 w-6 place-items-center rounded-full border border-[rgba(16,185,129,0.28)] bg-[rgba(236,253,245,0.98)] text-[#0f8b5d] shadow-[0_12px_24px_-16px_rgba(2,2,13,0.38)]`}>
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
    const ruleNodes = Array.from(root.querySelectorAll<HTMLElement>("[data-rule-node]"));
    if (!startNode || !conditionNode || !resultNode) {
      setIsRunning(false);
      return;
    }

    const activeColor = route === "positive" ? "#10b981" : "#f87171";
    const activeSoftColor = route === "positive" ? "rgba(16,185,129,0.78)" : "rgba(248,113,113,0.82)";
    const activeDecisionRing = route === "positive" ? "rgba(16,185,129,0.52)" : "rgba(248,113,113,0.58)";
    const amount = route === "positive" ? "€499" : "€2400";
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

    gsap.set(ruleNodes, {
      borderColor: "rgba(2,2,13,0.08)",
      boxShadow: ruleNodeShadow,
      opacity: 0.62,
      scale: 1,
      y: 0,
    });
    gsap.set(conditionLogic, {
      autoAlpha: 0,
      backgroundColor: "rgba(255,255,255,0.96)",
      borderColor: "rgba(11,17,22,0.16)",
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

    const pulseNode = (node: HTMLElement | null) => {
      if (!node) {
        return;
      }

      timeline.to(
        node,
        {
          boxShadow: "0 10px 18px -14px rgba(2,2,13,0.58), 0 14px 24px -22px rgba(2,2,13,0.45)",
          duration: 0.16,
          ease: "power2.out",
          opacity: 1,
          scale: 1.018,
        },
      ).to(
        node,
        {
          boxShadow: ruleNodeShadow,
          duration: 0.3,
          ease: "power3.out",
          scale: 1,
        },
      );
    };

    const absorbAt = (node: HTMLElement | null, color = "rgba(56,182,255,0.18)") => {
      pulseNode(node);
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
        .set(tokenAmount, { autoAlpha: 0, x: -2 })
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
        boxShadow: `${ruleNodeShadow}, 0 0 0 3px ${activeDecisionRing}`,
        duration: 0.22,
        ease: "power2.out",
      }, "<")
      .to(tokenCore, {
        backgroundColor: activeColor,
        duration: 0.01,
      }, "+=0.22");

    emitFrom(252, 246, activeColor);

    timeline
      .to(branchPath, { opacity: 1, duration: 0.06 }, "<0.08")
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
      .to([inputPath, middlePath, branchPath], { opacity: 0.28, duration: 0.35, ease: "power2.out" }, "+=0.25");
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
    <div className="relative min-h-[29rem] w-full overflow-visible pt-12 min-[1440px]:min-h-[31rem]" ref={rootRef}>
      <div className={`relative left-1/2 min-h-[26.25rem] w-[31.5rem] max-[900px]:w-full ${styles.stageScale} ${styles.startStage} ${styles.wideRuleStage} ${styles.ruleStage}`}>
        <div className="relative h-[26.25rem] overflow-visible rounded-[calc(var(--radius-panel)-14px)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[calc(var(--radius-panel)-14px)] bg-[radial-gradient(circle,rgba(11,17,22,0.15)_1px,transparent_1.25px),linear-gradient(rgba(241,244,247,0.82),rgba(241,244,247,0.82))] [background-size:18px_18px,100%_100%] [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent_0%,#000_18%,#000_82%,transparent_100%),linear-gradient(to_bottom,transparent_0%,#000_18%,#000_82%,transparent_100%)] [-webkit-mask-composite:source-in] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,#000_18%,#000_82%,transparent_100%),linear-gradient(to_bottom,transparent_0%,#000_18%,#000_82%,transparent_100%)]"
          />
          <button
            className={`absolute left-1/2 top-[0.375rem] z-20 inline-flex -translate-x-1/2 cursor-pointer items-center gap-3 rounded-[calc(var(--radius-button)+6px)] border border-[rgba(11,123,190,0.22)] bg-[var(--color-blue)] px-5 py-3 text-[0.9rem] font-semibold text-white shadow-[0_16px_34px_-24px_rgba(11,123,190,0.82)] transition-[background-color,transform] duration-150 hover:bg-[#096da9] active:translate-y-px disabled:cursor-default ${!isRunning ? styles.pulseHint : ""}`}
            disabled={isRunning}
            onClick={startFlow}
            type="button"
          >
            <SendIcon className="h-4.5 w-4.5 text-white" strokeWidth={1.9} />
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
          <RuleNode
            className="left-0 top-[21.4rem] w-[14.725rem]"
            icon={BadgeCheckIcon}
            meta={animation.positive.meta}
            nodeId="positive"
            title={animation.positive.title}
            finalSuccess={completedRoute === "positive"}
            tone="green"
          />
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
  }, []);

  return (
    <div className={`${styles.wideStageFrame} relative min-h-[22rem] w-full overflow-visible`} ref={rootRef}>
      <div className={`relative left-1/2 min-h-[22rem] w-[31.5rem] max-[1200px]:w-full ${styles.stageScale} ${styles.edgeStage} ${styles.wideDesktopStage} ${styles.permissionStage}`}>
        <div className="relative h-[22rem] overflow-hidden rounded-[calc(var(--radius-panel)-14px)] bg-[radial-gradient(circle,rgba(11,17,22,0.08)_1px,transparent_1.2px)] [background-size:18px_18px]">
          <div className="absolute left-1/2 top-5 grid w-[24rem] -translate-x-1/2 gap-3">
            <div className="flex justify-end">
              <div className="flex rounded-[calc(var(--radius-button)+4px)] border border-[rgba(2,2,13,0.12)] bg-white p-1 shadow-[0_12px_28px_-22px_rgba(2,2,13,0.38)]">
                {([
                  ["hr", animation.hrRoleLabel],
                  ["employee", animation.employeeRoleLabel],
                ] as const).map(([value, label]) => (
                  <ViewModeButton
                    active={role === value}
                    key={value}
                    label={label}
                    onClick={() => {
                      setRole(value);
                      if (value === "employee") {
                        setHasViewedEmployee(true);
                      }
                    }}
                    pulse={value === "employee" && !hasViewedEmployee && role !== "employee"}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-[calc(var(--radius-panel)-12px)] border border-[rgba(2,2,13,0.14)] bg-white p-4 shadow-[0_18px_46px_-34px_rgba(2,2,13,0.46)]">
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
                    className={`relative overflow-hidden rounded-[calc(var(--radius-card)-4px)] border border-[rgba(2,2,13,0.14)] bg-[rgba(241,246,250,0.92)] p-3 ${
                      protectedField ? styles.permissionProtectedField : ""
                    } ${
                      protectedField && protectedHidden ? styles.permissionProtectedFieldHidden : ""
                    }`}
                    data-permission-field={protectedField ? "protected" : "open"}
                    key={field.label}
                  >
                    <div className={`grid gap-2 ${protectedField ? styles.permissionFieldContent : ""} ${protectedField && protectedHidden ? styles.permissionFieldContentHidden : ""}`}>
                      <span className="text-[0.58rem] font-bold text-[rgba(11,17,22,0.68)]">
                        {field.label}
                      </span>
                      <span className="rounded-[calc(var(--radius-button)-4px)] border border-[rgba(2,2,13,0.16)] bg-white px-3 py-2 text-[0.72rem] font-semibold text-[var(--color-ink)]">
                        {field.value}
                      </span>
                    </div>
                    {protectedField ? (
                      <div className={`${styles.permissionLockOverlay} ${protectedHidden ? styles.permissionLockOverlayVisible : ""} absolute inset-0 grid place-items-center bg-[rgba(255,255,255,0.84)] backdrop-blur-[2px]`}>
                        <span className="flex items-center gap-2 rounded-[calc(var(--radius-button)+2px)] border border-[rgba(2,2,13,0.18)] bg-white px-3 py-2 text-[0.68rem] font-bold text-[var(--color-ink)] shadow-[0_14px_28px_-20px_rgba(2,2,13,0.42)]">
                          <LockKeyholeIcon className="h-4 w-4 text-[rgba(11,17,22,0.62)]" strokeWidth={1.9} />
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
                  className="grid h-16 place-items-center rounded-[calc(var(--radius-card)-4px)] border border-[rgba(2,2,13,0.12)] bg-white/76 text-[rgba(11,17,22,0.58)]"
                  key={capability}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
              );
            })}
          </div>
          <div className="rounded-[calc(var(--radius-panel)-12px)] border border-dashed border-[rgba(2,2,13,0.18)] bg-white/72 p-4">
            <div className="mb-3 h-3 w-2/5 rounded-full bg-[rgba(11,17,22,0.16)]" />
            <div className="grid gap-2">
              <span className="h-8 rounded-[calc(var(--radius-button)-4px)] bg-[rgba(11,17,22,0.06)]" />
              <span className="h-8 rounded-[calc(var(--radius-button)-4px)] bg-[rgba(11,17,22,0.06)]" />
              <span className="h-8 w-3/4 rounded-[calc(var(--radius-button)-4px)] bg-[rgba(11,17,22,0.1)]" />
            </div>
          </div>
        </div>
      </div>
    </BrowserPanel>
  );
}

export function PillarSections({ items }: PillarSectionsProps) {
  return (
    <div className="mt-[clamp(2.6rem,5vw,4.5rem)] grid gap-[clamp(7rem,12vw,11rem)]">
      {items.map((pillar, index) => {
        const visualFirst = index % 2 === 1;
        const wideVisualLead = index === 0 || index === 2;

        return (
          <section
            className={`relative grid items-center gap-[clamp(2rem,5vw,4.5rem)] ${index > 0 ? "pt-[clamp(3rem,6vw,5rem)] before:absolute before:left-0 before:right-0 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(11,17,22,0.08)_18%,rgba(56,182,255,0.22)_50%,rgba(11,17,22,0.08)_82%,transparent)]" : ""} ${wideVisualLead ? "grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]" : "grid-cols-[minmax(0,0.76fr)_minmax(22rem,1fr)]"} max-[1200px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] max-[900px]:grid-cols-1`}
            key={pillar.title}
          >
            <Reveal className="order-1 w-full max-[900px]:order-2 max-[640px]:hidden max-[900px]:px-[clamp(0.75rem,4vw,1.25rem)]" from={visualFirst ? "left" : "right"}>
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
            <Reveal className={visualFirst ? "order-first max-[900px]:order-1" : "order-2 max-[900px]:order-1"} from={visualFirst ? "right" : "left"}>
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
