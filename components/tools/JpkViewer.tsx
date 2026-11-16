"use client";

import { useEffect, useId, useMemo, useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import type { JpkViewerLabels } from "@/content/types";
import { MAX_JPK_FILE_BYTES, type JpkAnalysis, type JpkOutcome } from "@/lib/tools/jpk";
import { readJpkFile, type JpkWorkerMessage } from "@/lib/tools/jpk-read";
import { JpkDeclarationPanel } from "./jpk/JpkDeclaration";
import { JpkRowsTable } from "./jpk/JpkRowsTable";
import { JpkSummaryPanel } from "./jpk/JpkSummary";
import { count, fill, formatDateTime, money, period, quietButton, trackToolEvent, zloty, type Locale } from "./jpk/format";
import { PrivacyNote } from "@/components/tools/PrivacyNote";

type Tab = "summary" | "declaration" | "sales" | "purchases";
type Loaded = { fileName: string; analysis: JpkAnalysis };

/** On the main-thread fallback, give the page a frame after about this many bytes. */
const YIELD_BYTES = 1024 * 1024;

/**
 * Opens a JPK_V7M / JPK_V7K file in the browser. The file is parsed as a stream in a Web
 * Worker, so a 100 MB file does not freeze the tab; if the worker cannot start, the same
 * parser runs on the page in chunks that yield between reads. Nothing is uploaded and
 * nothing is stored.
 */
export function JpkViewer({ labels, locale }: { labels: JpkViewerLabels; locale: Locale }) {
  const id = useId();
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [reading, setReading] = useState<{ size: number; bytes: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [tab, setTab] = useState<Tab>("summary");
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const runRef = useRef(0);

  const stop = () => {
    workerRef.current?.terminate();
    workerRef.current = null;
    abortRef.current?.abort();
    abortRef.current = null;
  };

  useEffect(() => stop, []);

  const start = (file: File) => {
    stop();
    setError(null);
    if (file.size > MAX_JPK_FILE_BYTES) {
      setError(labels.errors.tooLarge);
      return;
    }

    const run = ++runRef.current;
    setReading({ size: file.size, bytes: 0 });

    const finish = (outcome: JpkOutcome) => {
      if (run !== runRef.current) return;
      stop();
      setReading(null);
      if (outcome.kind === "ok") {
        setLoaded({ fileName: file.name, analysis: outcome.analysis });
        setTab("summary");
        trackToolEvent("tool_used");
        window.requestAnimationFrame(() => resultRef.current?.focus());
      } else if (outcome.kind === "unsupported") {
        setError(fill(labels.errors.unsupported, { structure: outcome.structure }));
      } else {
        setError(labels.errors[outcome.reason]);
      }
    };

    const progress = (bytes: number) => {
      if (run === runRef.current) setReading({ size: file.size, bytes });
    };

    const onMainThread = () => {
      if (run !== runRef.current) return;
      workerRef.current?.terminate();
      workerRef.current = null;
      const controller = new AbortController();
      abortRef.current = controller;
      void readJpkFile(file, { onProgress: progress, yieldEvery: YIELD_BYTES, signal: controller.signal }).then(finish);
    };

    try {
      if (typeof Worker === "undefined") throw new Error("No Worker");
      const worker = new Worker(new URL("../../lib/tools/jpk.worker.ts", import.meta.url), { type: "module" });
      workerRef.current = worker;
      worker.onmessage = (event: MessageEvent<JpkWorkerMessage>) => {
        if (event.data.type === "progress") progress(event.data.bytes);
        else finish(event.data.outcome);
      };
      worker.onerror = (event) => {
        event.preventDefault();
        onMainThread();
      };
      worker.postMessage({ file });
    } catch {
      /* Paint "Wczytuję…" first, then parse on the page. */
      window.setTimeout(onMainThread, 0);
    }
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) start(file);
  };

  const percent = reading ? Math.min(100, Math.round((reading.bytes / Math.max(reading.size, 1)) * 100)) : 0;

  return (
    <div className="grid gap-8">
      <div className="grid gap-4 print:hidden">
        <label
          className={`flex min-h-[11rem] cursor-pointer flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] border-2 border-dashed px-6 py-8 text-center transition-colors focus-within:outline-2 focus-within:outline-offset-[3px] focus-within:outline-[var(--color-blue)] ${
            dragging ? "border-[var(--color-blue)] bg-[rgba(10,116,179,0.06)]" : "border-[rgba(11,17,22,0.2)] hover:border-[rgba(11,17,22,0.4)]"
          }`}
          htmlFor={`${id}-file`}
          onDragLeave={() => setDragging(false)}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDrop={onDrop}
        >
          <svg aria-hidden="true" className="h-8 w-8 text-[var(--color-ink)]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
            <path d="M14 3v5h5M12 18v-6m-3 3 3-3 3 3" />
          </svg>
          <span className="font-display text-[1.25rem] font-medium text-[var(--color-ink)]">{labels.dropTitle}</span>
          <span className="max-w-[34rem] text-[0.95rem] text-[var(--color-muted)]">{labels.dropHint}</span>
          <input
            accept=".xml,text/xml,application/xml"
            className="sr-only"
            id={`${id}-file`}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) start(file);
              event.target.value = "";
            }}
            ref={inputRef}
            type="file"
          />
        </label>

        <PrivacyNote>{labels.privacyNote}</PrivacyNote>

        {reading ? (
          <div className="grid gap-2" role="status">
            <span className="text-[0.95rem] text-[var(--color-ink)]">{fill(labels.reading, { percent })}</span>
            <span aria-hidden="true" className="block h-1.5 overflow-hidden rounded-full bg-[rgba(11,17,22,0.08)]">
              <span className="block h-full rounded-full bg-[var(--color-blue)] transition-[width] duration-200" style={{ width: `${percent}%` }} />
            </span>
          </div>
        ) : null}

        {error ? (
          <p className="m-0 text-[1rem] text-[#a3360f]" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      {loaded ? (
        <article
          aria-label={loaded.analysis.jpk.taxpayer?.name || loaded.fileName}
          className="print-area grid gap-7 border-t border-[var(--color-border-light)] pt-7 outline-none"
          ref={resultRef}
          tabIndex={-1}
        >
          <Result
            labels={labels}
            loaded={loaded}
            locale={locale}
            onLoadAnother={() => inputRef.current?.click()}
            onPrint={() => {
              trackToolEvent("tool_print");
              window.print();
            }}
            setTab={setTab}
            tab={tab}
          />
        </article>
      ) : null}
    </div>
  );
}

function Result({
  loaded,
  labels,
  locale,
  tab,
  setTab,
  onLoadAnother,
  onPrint,
}: {
  loaded: Loaded;
  labels: JpkViewerLabels;
  locale: Locale;
  tab: Tab;
  setTab: (tab: Tab) => void;
  onLoadAnother: () => void;
  onPrint: () => void;
}) {
  const id = useId();
  const { analysis } = loaded;
  const { jpk, summary, checks } = analysis;
  const declaration = jpk.declaration;
  const k = labels.keyNumbers;

  const tabs: Array<{ key: Tab; label: string }> = [
    { key: "summary", label: labels.tabs.summary },
    { key: "declaration", label: labels.tabs.declaration },
    ...(jpk.sales !== null
      ? [
          { key: "sales" as const, label: `${labels.tabs.sales} (${count(jpk.sales.length, locale)})` },
          { key: "purchases" as const, label: `${labels.tabs.purchases} (${count(jpk.purchases?.length ?? 0, locale)})` },
        ]
      : []),
  ];

  const issueRows = useMemo(() => {
    const byRegister = { sales: new Set<number>(), purchases: new Set<number>() };
    for (const check of checks) if (check.status === "warn" && check.register && check.rows) for (const row of check.rows) byRegister[check.register].add(row);
    return byRegister;
  }, [checks]);

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = tabs.findIndex((item) => item.key === tab);
    const next =
      event.key === "ArrowRight" ? (index + 1) % tabs.length
      : event.key === "ArrowLeft" ? (index - 1 + tabs.length) % tabs.length
      : event.key === "Home" ? 0
      : event.key === "End" ? tabs.length - 1
      : -1;
    if (next === -1) return;
    event.preventDefault();
    setTab(tabs[next].key);
    document.getElementById(`${id}-tab-${tabs[next].key}`)?.focus();
  };

  /* The third figure: what the return settles, or, without a return, the register difference. */
  const settlement = declaration
    ? (declaration.amounts.P_51 ?? 0) > 0
      ? { label: k.payable, value: zloty(declaration.amounts.P_51!, locale) }
      : (declaration.amounts.P_54 ?? 0) > 0
        ? { label: k.refund, value: zloty(declaration.amounts.P_54!, locale) }
        : (declaration.amounts.P_62 ?? 0) > 0
          ? { label: k.carried, value: zloty(declaration.amounts.P_62!, locale) }
          : { label: k.payable, value: zloty(0, locale) }
    : { label: k.registerDifference, value: money(summary.computedOutputTax - summary.computedInputTax, locale) };

  const figures = [
    { label: k.outputTax, value: declaration?.amounts.P_38 !== undefined ? zloty(declaration.amounts.P_38, locale) : money(summary.computedOutputTax, locale) },
    { label: k.inputTax, value: declaration?.amounts.P_48 !== undefined ? zloty(declaration.amounts.P_48, locale) : money(summary.computedInputTax, locale) },
    settlement,
  ];

  const meta = [
    jpk.systemCode,
    period(analysis, labels),
    declaration?.quarter && jpk.year ? `${labels.quarters[declaration.quarter - 1] ?? declaration.quarter} ${jpk.year}` : null,
    jpk.purpose ? labels.purposes[jpk.purpose] : null,
    jpk.taxOfficeCode ? fill(labels.taxOffice, { code: jpk.taxOfficeCode }) : null,
    jpk.createdAt ? fill(labels.createdAt, { date: formatDateTime(jpk.createdAt, locale) ?? jpk.createdAt }) : null,
    jpk.systemName,
  ].filter(Boolean);

  const taxpayer = jpk.taxpayer;

  return (
    <>
      <header className="flex flex-wrap items-start justify-between gap-x-10 gap-y-4">
        <div className="min-w-0">
          <p className="m-0 font-display text-[clamp(1.4rem,2.6vw,1.9rem)] font-medium leading-[1.2] tracking-[-0.02em] [overflow-wrap:anywhere]">
            {taxpayer?.name || loaded.fileName}
          </p>
          {taxpayer ? (
            <p className="m-0 mt-1 text-[0.95rem]">
              {[taxpayer.nip ? `${labels.taxId} ${taxpayer.nip}` : null, taxpayer.email, taxpayer.phone].filter(Boolean).join(" · ")}
            </p>
          ) : null}
          <p className="m-0 mt-2 text-[0.92rem] text-[var(--color-muted)] print:text-black">{meta.join(" · ")}</p>
        </div>
        <div className="flex flex-wrap gap-3 print:hidden">
          <button className={quietButton} onClick={onLoadAnother} type="button">
            {labels.loadAnother}
          </button>
          <button className="action action-ink cursor-pointer border-0" onClick={onPrint} type="button">
            {labels.print}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,12rem),1fr))] gap-x-8 gap-y-5">
        {figures.map((figure) => (
          <p className="m-0 min-w-0" key={figure.label}>
            <span className="block font-display text-[clamp(1.3rem,2.4vw,1.7rem)] font-medium tracking-[-0.02em] tabular-nums">{figure.value}</span>
            <span className="mt-1 block text-[0.92rem] text-[var(--color-muted)] print:text-black">{figure.label}</span>
          </p>
        ))}
        <p className="m-0 min-w-0 text-[1.02rem] leading-[1.5]">
          {jpk.sales !== null ? fill(k.rows, { sales: count(jpk.sales.length, locale), purchases: count(jpk.purchases?.length ?? 0, locale) }) : k.noRegister}
        </p>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-[rgba(11,17,22,0.14)] print:hidden" role="tablist">
        {tabs.map((item) => (
          <button
            aria-controls={`${id}-panel-${item.key}`}
            aria-selected={tab === item.key}
            className={`-mb-px cursor-pointer border-0 border-b-2 bg-transparent px-3 py-2.5 text-[0.98rem] ${
              tab === item.key ? "border-[var(--color-ink)] font-semibold text-[var(--color-ink)]" : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            }`}
            id={`${id}-tab-${item.key}`}
            key={item.key}
            onClick={() => setTab(item.key)}
            onKeyDown={onTabKey}
            role="tab"
            tabIndex={tab === item.key ? 0 : -1}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* The summary and the declaration also print when their tab is not open; the registers go to CSV instead. */}
      <div aria-labelledby={`${id}-tab-summary`} className={tab === "summary" ? "" : "hidden print:block"} id={`${id}-panel-summary`} role="tabpanel" tabIndex={0}>
        <JpkSummaryPanel analysis={analysis} labels={labels} locale={locale} />
      </div>
      <div aria-labelledby={`${id}-tab-declaration`} className={tab === "declaration" ? "" : "hidden print:block"} id={`${id}-panel-declaration`} role="tabpanel" tabIndex={0}>
        <JpkDeclarationPanel analysis={analysis} labels={labels} locale={locale} />
      </div>
      {tab === "sales" || tab === "purchases" ? (
        <div aria-labelledby={`${id}-tab-${tab}`} className="print:hidden" id={`${id}-panel-${tab}`} role="tabpanel">
          <JpkRowsTable analysis={analysis} issueRows={issueRows[tab]} key={tab} labels={labels} locale={locale} register={tab} />
        </div>
      ) : null}
    </>
  );
}
