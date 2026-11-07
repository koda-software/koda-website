"use client";

import { type ComponentType, type CSSProperties, type KeyboardEvent, useId, useRef, useState } from "react";
import CalculatorIcon from "lucide-react/dist/esm/icons/calculator.mjs";
import CalendarDaysIcon from "lucide-react/dist/esm/icons/calendar-days.mjs";
import CircleCheckIcon from "lucide-react/dist/esm/icons/circle-check.mjs";
import ClipboardListIcon from "lucide-react/dist/esm/icons/clipboard-list.mjs";
import ClockIcon from "lucide-react/dist/esm/icons/clock.mjs";
import InboxIcon from "lucide-react/dist/esm/icons/inbox.mjs";
import LaptopIcon from "lucide-react/dist/esm/icons/laptop.mjs";
import LockIcon from "lucide-react/dist/esm/icons/lock.mjs";
import PenLineIcon from "lucide-react/dist/esm/icons/pen-line.mjs";
import ScaleIcon from "lucide-react/dist/esm/icons/scale.mjs";
import SearchIcon from "lucide-react/dist/esm/icons/search.mjs";
import SendIcon from "lucide-react/dist/esm/icons/send.mjs";
import ShieldCheckIcon from "lucide-react/dist/esm/icons/shield-check.mjs";
import StampIcon from "lucide-react/dist/esm/icons/stamp.mjs";
import TriangleAlertIcon from "lucide-react/dist/esm/icons/triangle-alert.mjs";
import UserRoundCheckIcon from "lucide-react/dist/esm/icons/user-round-check.mjs";
import UserRoundIcon from "lucide-react/dist/esm/icons/user-round.mjs";
import WrenchIcon from "lucide-react/dist/esm/icons/wrench.mjs";
import ZapIcon from "lucide-react/dist/esm/icons/zap.mjs";
import type { ProcessesPageContent, ProcessesScenario, ProcessesStageIcon } from "@/content/feature-stories/processes.types";
import styles from "./DepartmentExplorer.module.css";

type DepartmentExplorerProps = Pick<ProcessesPageContent["departments"], "scenarios" | "tablistLabel">;
type Icon = ComponentType<{ "aria-hidden"?: boolean; className?: string; strokeWidth?: number }>;

const STAGE_ICONS: Record<ProcessesStageIcon, Icon> = {
  alert: TriangleAlertIcon,
  calculator: CalculatorIcon,
  calendar: CalendarDaysIcon,
  check: CircleCheckIcon,
  clipboard: ClipboardListIcon,
  inbox: InboxIcon,
  laptop: LaptopIcon,
  pen: PenLineIcon,
  scale: ScaleIcon,
  search: SearchIcon,
  send: SendIcon,
  shield: ShieldCheckIcon,
  stamp: StampIcon,
  user: UserRoundCheckIcon,
  wrench: WrenchIcon,
};

function Property({ icon: PropertyIcon, text }: { icon: Icon; text: string }) {
  return (
    <li className={styles.property}>
      <PropertyIcon aria-hidden className={styles.propertyIcon} strokeWidth={1.8} />
      {text}
    </li>
  );
}

function StageTrack({ scenario }: { scenario: ProcessesScenario }) {
  return (
    <ol className={styles.track} style={{ "--stages": scenario.stages.length } as CSSProperties}>
      {scenario.stages.map((stage, index) => {
        const StageIcon = STAGE_ICONS[stage.icon];

        return (
          <li className={`${styles.stage} ${styles[stage.tone]}`} key={stage.name} style={{ "--i": index } as CSSProperties}>
            <span aria-hidden="true" className={styles.tile}>
              <StageIcon className="h-5 w-5" strokeWidth={1.8} />
            </span>
            <div className={styles.body}>
              <h4 className={styles.name}>{stage.name}</h4>
              <ul className={styles.properties}>
                <Property icon={UserRoundIcon} text={stage.owner} />
                {stage.due ? <Property icon={ClockIcon} text={stage.due} /> : null}
                {stage.auto ? <Property icon={ZapIcon} text={stage.auto} /> : null}
                {stage.lock ? <Property icon={LockIcon} text={stage.lock} /> : null}
              </ul>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * The page's "we could do that here" moment: one process per department, chosen from a row of tabs. Every panel stays
 * in the markup, so the text is there for search engines and for a page that never runs its script.
 */
export function DepartmentExplorer({ scenarios, tablistLabel }: DepartmentExplorerProps) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (index + step + scenarios.length) % scenarios.length;
    setActive(next);
    tabsRef.current[next]?.focus();
  };

  return (
    <div>
      <div aria-label={tablistLabel} className="flex flex-wrap justify-center gap-2 max-[760px]:-mx-[var(--page-gutter)] max-[760px]:flex-nowrap max-[760px]:justify-start max-[760px]:overflow-x-auto max-[760px]:px-[var(--page-gutter)] max-[760px]:pb-2 max-[760px]:[scrollbar-width:none]" role="tablist">
        {scenarios.map((scenario, index) => {
          const selected = index === active;

          return (
            <button
              aria-controls={`${baseId}-panel-${index}`}
              aria-selected={selected}
              className={`shrink-0 cursor-pointer rounded-full border px-5 py-2.5 text-[0.95rem] font-medium transition-colors duration-200 ${selected ? "border-white bg-white text-[var(--color-ink)]" : "border-white/20 bg-transparent text-white/72 hover:border-white/45"}`}
              id={`${baseId}-tab-${index}`}
              key={scenario.process}
              onClick={() => setActive(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              ref={(node) => {
                tabsRef.current[index] = node;
              }}
              role="tab"
              tabIndex={selected ? 0 : -1}
              type="button"
            >
              {scenario.department}
            </button>
          );
        })}
      </div>

      <div className={`mt-[clamp(2rem,4vw,3rem)] ${styles.panels}`} data-stages>
        {scenarios.map((scenario, index) => (
          <div aria-labelledby={`${baseId}-tab-${index}`} className={styles.panel} hidden={index !== active} id={`${baseId}-panel-${index}`} key={scenario.process} role="tabpanel">
            <div className="text-center max-[760px]:text-left">
              <h3 className="m-0 text-[1.12rem] font-semibold leading-[1.3] tracking-[-0.01em] text-white">{scenario.process}</h3>
              <p className="mx-auto mb-0 mt-1.5 max-w-[38rem] text-[1rem] leading-[1.55] text-white/62 max-[760px]:mx-0">{scenario.situation}</p>
            </div>
            <div className="mt-[clamp(2.25rem,4vw,3.25rem)]">
              <StageTrack scenario={scenario} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
