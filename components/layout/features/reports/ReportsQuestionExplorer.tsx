"use client";

import { useId, useState } from "react";
import MousePointerClickIcon from "lucide-react/dist/esm/icons/mouse-pointer-click.mjs";
import type { ReportsExplorerLabels, ReportsScenario } from "@/content/feature-stories/reports.types";

type ReportsQuestionExplorerProps = {
  labels: ReportsExplorerLabels;
  scenarios: ReportsScenario[];
};

/** Departments as tabs: each shows the question, its answer as a small pivot, and how that report is put together. */
export function ReportsQuestionExplorer({ labels, scenarios }: ReportsQuestionExplorerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const baseId = useId();
  const scenario = scenarios[activeIndex];

  return (
    <div>
      <div aria-label={labels.tabsLabel} className="flex flex-wrap gap-2" role="tablist">
        {scenarios.map((item, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              aria-controls={`${baseId}-panel`}
              aria-selected={isActive}
              className={`cursor-pointer rounded-full border px-4 py-2 text-[0.88rem] font-medium transition-colors ${
                isActive
                  ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
                  : "border-[rgba(11,17,22,0.14)] bg-white text-[var(--color-ink-soft)] hover:border-[rgba(56,182,255,0.55)]"
              }`}
              id={`${baseId}-tab-${index}`}
              key={item.department}
              onClick={() => setActiveIndex(index)}
              role="tab"
              type="button"
            >
              {item.department}
            </button>
          );
        })}
      </div>

      <div
        aria-labelledby={`${baseId}-tab-${activeIndex}`}
        className="mt-8 grid min-h-[27rem] grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] items-start gap-[clamp(2rem,4vw,4rem)] max-[980px]:min-h-0 max-[980px]:grid-cols-1"
        id={`${baseId}-panel`}
        role="tabpanel"
      >
        <div>
          <h3 className="m-0 text-[clamp(1.5rem,2.5vw,2.15rem)] font-medium leading-[1.14] tracking-[-0.03em] text-[var(--color-ink)]">{scenario.question}</h3>
          <p className="mb-0 mt-5 text-[1.02rem] leading-[1.68] text-[var(--color-muted)]">{scenario.answer}</p>
          <dl className="mb-0 mt-7 grid gap-4 border-t border-[rgba(11,17,22,0.1)] pt-6">
            <div>
              <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-[#1e5278]">{labels.builtLabel}</dt>
              <dd className="m-0 mt-1.5 text-[0.9rem] leading-[1.55] text-[var(--color-ink-soft)]">{scenario.built}</dd>
            </div>
            <div>
              <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-[#1e5278]">{labels.drillLabel}</dt>
              <dd className="m-0 mt-1.5 text-[0.9rem] leading-[1.55] text-[var(--color-ink-soft)]">{scenario.drill}</dd>
            </div>
          </dl>
        </div>

        <div className="min-w-0 overflow-hidden rounded-[14px] border border-[rgba(11,17,22,0.12)] bg-white shadow-[0_28px_70px_-34px_rgba(7,26,43,0.45),0_12px_28px_-20px_rgba(7,26,43,0.2)]">
          <div className="flex items-center justify-between gap-4 border-b border-[rgba(11,17,22,0.08)] bg-[#f6f8fa] px-5 py-3.5">
            <p className="m-0 text-[0.92rem] font-semibold tracking-[-0.01em] text-[var(--color-ink)]">{scenario.reportTitle}</p>
            <p className="m-0 shrink-0 text-[0.72rem] text-[var(--color-muted)]">{labels.exampleNote}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[30rem] border-collapse text-[0.92rem] max-[560px]:text-[0.82rem]">
              <thead>
                <tr>
                  {scenario.columns.map((column, index) => (
                    <th className={`border-b border-[rgba(11,17,22,0.08)] px-5 py-3 text-[0.74rem] font-medium text-[var(--color-muted)] ${index === 0 ? "text-left" : "text-right"}`} key={column} scope="col">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {scenario.rows.map((row, rowIndex) => {
                  const isHighlighted = rowIndex === scenario.highlightRow;

                  return (
                    <tr className={isHighlighted ? "bg-[rgba(56,182,255,0.1)]" : ""} key={row[0]}>
                      {row.map((cell, cellIndex) => (
                        <td className={`border-b border-[rgba(11,17,22,0.06)] px-5 py-3.5 tabular-nums text-[var(--color-ink-soft)] ${cellIndex === 0 ? "text-left font-medium" : "text-right"}`} key={`${row[0]}-${scenario.columns[cellIndex]}`}>
                          {cellIndex === 0 && isHighlighted ? (
                            <span className="inline-flex items-center gap-2">
                              {cell}
                              <MousePointerClickIcon aria-hidden="true" className="h-4 w-4 text-[var(--color-blue)]" strokeWidth={1.8} />
                            </span>
                          ) : cell}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  {scenario.total.map((cell, index) => (
                    <td className={`px-5 py-3.5 font-semibold tabular-nums text-[var(--color-ink)] ${index === 0 ? "text-left" : "text-right"}`} key={`total-${scenario.columns[index]}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
