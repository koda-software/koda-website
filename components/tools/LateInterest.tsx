"use client";

import { Fragment, useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import type { LateInterestLabels } from "@/content/types";
import { addDays, todayInPoland, type DayOffReason } from "@/lib/tools/business-days";
import {
  FIRST_DUE_DATE,
  MAX_INVOICES,
  compensationCents,
  computeInvoice,
  formatRate,
  noteText,
  noteTotals,
  type Debtor,
  type InterestMode,
  type InvoiceError,
  type InvoiceResult,
} from "@/lib/tools/late-interest";
import { COMMERCIAL_KNOWN_UNTIL } from "@/lib/tools/late-interest-rates";
import { NbpError, fetchSeries, formatDottedDate, formatMid, rateWindow, resolveRate, type NbpRate, type NbpSeries } from "@/lib/tools/nbp";
import { formatCents, parseCents } from "@/lib/tools/vat";
import { PrivacyNote } from "@/components/tools/PrivacyNote";
import { CopyButton } from "@/components/tools/CopyButton";

type Gtag = (command: "event", name: string, params: Record<string, string>) => void;

/** Counts use of the tool and nothing else: never an amount or a date. */
function trackToolEvent(name: string) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", name, { tool: "late_interest" });
}

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);

/** Fills a template for display: the text stays muted, the filled-in figures are set in ink. */
function emphasize(template: string, values: Record<string, ReactNode>): ReactNode {
  return template.split(/(\{\w+\})/).map((part, index) => {
    const key = /^\{(\w+)\}$/.exec(part)?.[1];
    if (!key || !(key in values)) return part;
    const value = values[key];
    return typeof value === "string" ? (
      <span className="text-[var(--color-ink)]" key={index}>
        {value}
      </span>
    ) : (
      <Fragment key={index}>{value}</Fragment>
    );
  });
}

/* "Today" exists only in the browser, so the static HTML is the same for everyone. */
const noSubscription = () => () => {};
const readToday = () => todayInPoland();
const serverToday = () => "";

const utc = (iso: string) => new Date(`${iso}T12:00:00Z`);

const segmentOn = "bg-[var(--color-ink)] text-[var(--color-mist)]";
const segmentOff = "bg-transparent text-[var(--color-ink)]";
const labelClass = "text-[0.95rem] font-semibold text-[var(--color-ink)]";
const fieldClass =
  "h-14 w-full rounded-[12px] border border-[rgba(11,17,22,0.16)] bg-[var(--color-paper)] px-4 text-[1.05rem] text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--color-blue)] disabled:bg-[#e9edf0] disabled:text-[var(--color-muted)] aria-[invalid=true]:border-[#a3360f]";
const errorClass = "m-0 text-[0.92rem] text-[#a3360f]";
const mutedClass = "m-0 max-w-[47rem] text-[0.95rem] text-[var(--color-muted)]";
const figures = "[font-variant-numeric:tabular-nums]";
const thClass = "border-b border-[rgba(11,17,22,0.16)] px-2 py-2 text-left text-[0.88rem] font-semibold text-[var(--color-muted)] print:text-black";
const tdClass = "border-b border-[rgba(11,17,22,0.08)] px-2 py-2.5";

type Row = { id: number; label: string; amount: string; due: string | null; paid: string; unpaid: boolean };
type EurEntry = { series: NbpSeries } | { error: NbpError["reason"] };
type EurState = { kind: "loading" } | { kind: "failed" } | { kind: "ok"; rate: NbpRate; pending: boolean; anchor: string };

/** Merges a Saturday and the Sunday after it into one "weekend" entry. */
function groupDaysOff(days: DayOffReason[]) {
  const groups: Array<{ from: string; to: string; reason: keyof LateInterestLabels["dayOffNames"] }> = [];
  for (const day of days) {
    const last = groups.at(-1);
    if (day.reason === "sunday" && last?.reason === "saturday") {
      last.to = day.date;
      last.reason = "weekend";
    } else {
      groups.push({ from: day.date, to: day.date, reason: day.reason });
    }
  }
  return groups;
}

function ClockIcon() {
  return (
    <svg aria-hidden="true" className="mt-[3px] h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function Check({ checked, onChange, children }: { checked: boolean; onChange: (checked: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 text-[0.95rem] text-[var(--color-ink)]">
      <input checked={checked} className="h-5 w-5 shrink-0 accent-[var(--color-ink)]" onChange={(event) => onChange(event.target.checked)} type="checkbox" />
      <span>{children}</span>
    </label>
  );
}

export function LateInterest({ labels, locale }: { labels: LateInterestLabels; locale: "pl" | "en" }) {
  const id = useId();
  const sep = labels.decimalSeparator;
  const money = (cents: number) => `${formatCents(cents, sep)} ${labels.pln}`;
  const dotted = formatDottedDate;
  const intlLocale = locale === "pl" ? "pl-PL" : "en-GB";
  const dayMonth = new Intl.DateTimeFormat(intlLocale, { day: "numeric", month: "long", timeZone: "UTC" });
  const days = (count: number) => `${count} ${count === 1 ? labels.days.one : labels.days.many}`;
  /* "października 2026" in Polish (the genitive a date gives), "October 2026" in English. */
  const monthOf = (iso: string) => {
    const parts = new Intl.DateTimeFormat(intlLocale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).formatToParts(utc(iso));
    return `${parts.find((part) => part.type === "month")?.value ?? ""} ${iso.slice(0, 4)}`;
  };

  const today = useSyncExternalStore(noSubscription, readToday, serverToday);
  /* The example invoice falls due about six months before today, so a result shows on arrival. */
  const exampleDue = today ? addDays(today, -183) : "";

  const [mode, setMode] = useState<InterestMode>("commercial");
  const [healthcare, setHealthcare] = useState(false);
  const [withCompensation, setWithCompensation] = useState(true);
  const nextId = useRef(2);
  const [rows, setRows] = useState<Row[]>([{ id: 1, label: labels.defaultLabel, amount: labels.defaultAmount, due: null, paid: "", unpaid: true }]);
  /* Null until the visitor picks a date: then it is today. */
  const [pickedUntil, setPickedUntil] = useState<string | null>(null);
  const until = pickedUntil ?? today;
  const debtor: Debtor = healthcare ? "healthcare" : "standard";

  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(copiedTimer.current), []);

  /* Set by the visitor's own changes, so the example on arrival is not counted. */
  const [changes, setChanges] = useState(0);
  const touched = () => {
    setCopied(false);
    setChanges((count) => count + 1);
  };

  const updateRow = (rowId: number, patch: Partial<Row>) => {
    setRows((current) => current.map((row) => (row.id === rowId ? { ...row, ...patch } : row)));
    touched();
  };

  /* Each row: its inputs, and a result, an error or nothing yet (an empty field). */
  const computed = rows.map((row, index) => {
    const due = row.due ?? exampleDue;
    const cents = parseCents(row.amount);
    const name = row.label.trim() || fill(labels.invoiceName, { n: String(index + 1) });
    if (cents === null || !due || (!row.unpaid && !row.paid) || (row.unpaid && !until)) return { row, due, name, result: null, error: null };
    const outcome = computeInvoice({ label: row.label, cents, due, paid: row.unpaid ? null : row.paid }, until, mode, debtor, withCompensation);
    return "error" in outcome
      ? { row, due, name, result: null, error: outcome.error as InvoiceError["error"] }
      : { row, due, name, result: outcome, error: null };
  });
  const results = computed.flatMap((item) => (item.result ? [item.result] : []));

  /* One NBP request per month the payments fell due, never per keystroke. */
  const anchors = [...new Set(results.flatMap((result) => (result.compensation ? [result.compensation.anchor] : [])))].sort();
  const [eur, setEur] = useState<Record<string, EurEntry>>({});
  const missingKey = anchors.filter((anchor) => !(anchor in eur)).join(",");
  const inflight = useRef(new Map<string, AbortController>());

  useEffect(() => {
    const wanted = missingKey ? missingKey.split(",") : [];
    for (const [anchor, controller] of inflight.current) {
      if (!wanted.includes(anchor)) {
        controller.abort();
        inflight.current.delete(anchor);
      }
    }
    if (!today || !wanted.length) return;

    const timer = window.setTimeout(() => {
      for (const anchor of wanted) {
        if (inflight.current.has(anchor)) continue;
        const range = rateWindow(anchor, today);
        if (!range) {
          setEur((current) => ({ ...current, [anchor]: { error: "noData" } }));
          continue;
        }
        const controller = new AbortController();
        inflight.current.set(anchor, controller);
        fetchSeries("A", "EUR", range.start, range.end, controller.signal)
          .then((series) => setEur((current) => ({ ...current, [anchor]: { series } })))
          .catch((caught: unknown) => {
            if ((caught as Error).name === "AbortError") return;
            setEur((current) => ({ ...current, [anchor]: { error: caught instanceof NbpError ? caught.reason : "network" } }));
          })
          .finally(() => {
            if (inflight.current.get(anchor) === controller) inflight.current.delete(anchor);
          });
      }
    }, 400);
    return () => window.clearTimeout(timer);
  }, [missingKey, today]);

  useEffect(() => {
    const requests = inflight.current;
    return () => {
      for (const controller of requests.values()) controller.abort();
    };
  }, []);

  const eurState = (anchor: string): EurState => {
    const entry = eur[anchor];
    if (!entry) return { kind: "loading" };
    if ("error" in entry) return { kind: "failed" };
    const lookup = resolveRate(entry.series, anchor, today);
    return lookup.kind === "ok" ? { kind: "ok", rate: lookup.rate, pending: lookup.pending !== null, anchor } : { kind: "failed" };
  };

  /* Only a rate from the right table converts the compensation; a pending month stays in euro. */
  const confirmed = new Map<string, NbpRate>();
  for (const anchor of anchors) {
    const state = eurState(anchor);
    if (state.kind === "ok" && !state.pending) confirmed.set(anchor, state.rate);
  }
  const totals = noteTotals(results, confirmed);
  const hasCompensation = results.some((result) => result.compensation);
  const compensationText = totals.compensationEur
    ? `${totals.compensation ? `${money(totals.compensation)} + ` : ""}${totals.compensationEur} EUR`
    : money(totals.compensation);
  const failedAny = anchors.some((anchor) => eurState(anchor).kind === "failed");
  const forecastFrom = results.flatMap((result) => result.rows.filter((row) => row.forecast)).length ? addDays(COMMERCIAL_KNOWN_UNTIL, 1) : null;
  const note = results.length ? noteText(locale, results, confirmed, mode) : "";

  /* Counts a change that leads to a result, once the visitor stops typing. */
  const hasResult = results.length > 0;
  useEffect(() => {
    if (!changes || !hasResult) return;
    const timer = window.setTimeout(() => trackToolEvent("tool_used"), 1500);
    return () => window.clearTimeout(timer);
  }, [changes, hasResult]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(note);
      setCopied(true);
      window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopied(false), 1800);
      trackToolEvent("tool_copy");
    } catch {
      /* Clipboard refused: the summary stays on screen to copy by hand. */
    }
  };

  const shiftReason = (result: InvoiceResult) =>
    fill(labels.shifted, {
      list: groupDaysOff(result.skipped)
        .map((group) =>
          fill(labels.dayOff, {
            days: group.from === group.to ? dayMonth.format(utc(group.from)) : dayMonth.formatRange(utc(group.from), utc(group.to)),
            reason: labels.dayOffNames[group.reason],
          }),
        )
        .join(", "),
      date: dotted(result.effectiveDue),
    });

  const compensationLine = (result: InvoiceResult) => {
    if (!result.compensation) return null;
    const { tier, anchor } = result.compensation;
    const state = eurState(anchor);
    const eurOnly = fill(labels.compensationEur, { eur: String(tier.eur) });
    return (
      <div className="grid gap-1.5">
        <p className={`m-0 text-[1rem] text-[var(--color-muted)] ${figures}`}>
          {state.kind === "ok" && !state.pending
            ? emphasize(labels.compensation, {
                eur: String(tier.eur),
                mid: formatMid(state.rate.mid, sep),
                no: state.rate.no,
                date: dotted(state.rate.effectiveDate),
                pln: money(compensationCents(tier, state.rate.mid)),
              })
            : emphasize(eurOnly, {})}
        </p>
        {state.kind === "loading" ? <p className={`${mutedClass} print:hidden`}>{labels.compensationLoading}</p> : null}
        {state.kind === "ok" && state.pending ? (
          <p className={`${mutedClass} flex items-start gap-2.5`}>
            <ClockIcon />
            <span>{fill(labels.compensationPending, { month: monthOf(addDays(anchor, -1)), mid: formatMid(state.rate.mid, sep), no: state.rate.no })}</span>
          </p>
        ) : null}
        {tier.basis === "flat2016" ? <p className={mutedClass}>{labels.flatCompensationNote}</p> : null}
      </div>
    );
  };

  return (
    <div className="grid gap-10">
      <div className="grid gap-4">
        <div aria-label={labels.modeLabel} className="inline-flex w-fit flex-wrap rounded-[24px] border border-[var(--color-border-light)] bg-[var(--color-paper)] p-1" role="group">
          {(["commercial", "civil"] as const).map((key) => (
            <button
              aria-pressed={mode === key}
              className={`min-h-11 cursor-pointer rounded-full border-0 px-5 font-display text-[0.95rem] font-medium transition-colors ${mode === key ? segmentOn : segmentOff}`}
              key={key}
              onClick={() => {
                setMode(key);
                touched();
              }}
              type="button"
            >
              {labels.modes[key]}
            </button>
          ))}
        </div>
        {mode === "commercial" ? (
          <div className="grid gap-1">
            <Check
              checked={healthcare}
              onChange={(checked) => {
                setHealthcare(checked);
                touched();
              }}
            >
              {labels.healthcareLabel}
            </Check>
            <Check
              checked={withCompensation}
              onChange={(checked) => {
                setWithCompensation(checked);
                touched();
              }}
            >
              {labels.compensationLabel}
            </Check>
          </div>
        ) : null}
      </div>

      <div className="grid gap-5">
        <div className="grid">
          {computed.map(({ row, due, error }, index) => {
            const n = String(index + 1);
            const fieldId = (name: string) => `${id}-${row.id}-${name}`;
            const cell = (column: string) => (index === 0 ? undefined : fill(labels.cellLabel, { column, n }));
            const amountInvalid = error === "amount" || (row.amount.trim() !== "" && Number.isNaN(parseCents(row.amount)));
            const dueError = error === "due" || error === "beforeFirst" ? error : null;
            const paidError = error === "paid" && !row.unpaid;
            return (
              <div
                className={`grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)_2.5rem] items-start gap-x-4 gap-y-3 border-b border-[var(--color-border-light)] py-5 max-[900px]:grid-cols-2 ${index === 0 ? "pt-0" : ""}`}
                key={row.id}
              >
                <div className="grid gap-2">
                  <label className={labelClass} htmlFor={fieldId("label")}>
                    {labels.columns.label}
                  </label>
                  <input
                    aria-label={cell(labels.columns.label)}
                    autoComplete="off"
                    className={fieldClass}
                    id={fieldId("label")}
                    maxLength={60}
                    onChange={(event) => updateRow(row.id, { label: event.target.value })}
                    placeholder={labels.labelPlaceholder}
                    type="text"
                    value={row.label}
                  />
                </div>
                <div className="grid gap-2">
                  <label className={labelClass} htmlFor={fieldId("amount")}>
                    {labels.columns.amount}
                  </label>
                  <div className="relative">
                    <input
                      aria-describedby={index === 0 ? fieldId("amount-hint") : undefined}
                      aria-invalid={amountInvalid}
                      aria-label={cell(labels.columns.amount)}
                      autoComplete="off"
                      className={`${fieldClass} pr-14`}
                      id={fieldId("amount")}
                      inputMode="decimal"
                      maxLength={24}
                      onChange={(event) => updateRow(row.id, { amount: event.target.value })}
                      spellCheck={false}
                      type="text"
                      value={row.amount}
                    />
                    <span aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[1rem] text-[var(--color-muted)]">
                      {labels.pln}
                    </span>
                  </div>
                  {amountInvalid ? (
                    <p className={errorClass} role="alert">
                      {labels.errors.amount}
                    </p>
                  ) : index === 0 ? (
                    <p className="m-0 text-[0.88rem] text-[var(--color-muted)]" id={fieldId("amount-hint")}>
                      {labels.amountHint}
                    </p>
                  ) : null}
                </div>
                <div className="grid gap-2">
                  <label className={labelClass} htmlFor={fieldId("due")}>
                    {labels.columns.due}
                  </label>
                  <input
                    aria-invalid={dueError !== null}
                    aria-label={cell(labels.columns.due)}
                    className={fieldClass}
                    id={fieldId("due")}
                    min={FIRST_DUE_DATE}
                    onChange={(event) => updateRow(row.id, { due: event.target.value })}
                    type="date"
                    value={due}
                  />
                  {dueError ? (
                    <p className={errorClass} role="alert">
                      {labels.errors[dueError]}
                    </p>
                  ) : null}
                </div>
                <div className="grid gap-2">
                  <label className={labelClass} htmlFor={fieldId("paid")}>
                    {labels.columns.paid}
                  </label>
                  <input
                    aria-describedby={index === 0 ? fieldId("paid-hint") : undefined}
                    aria-invalid={paidError}
                    aria-label={cell(labels.columns.paid)}
                    className={fieldClass}
                    disabled={row.unpaid}
                    id={fieldId("paid")}
                    min={FIRST_DUE_DATE}
                    onChange={(event) => updateRow(row.id, { paid: event.target.value })}
                    type="date"
                    value={row.unpaid ? "" : row.paid}
                  />
                  <Check checked={row.unpaid} onChange={(checked) => updateRow(row.id, { unpaid: checked, paid: checked ? row.paid : row.paid || today })}>
                    {labels.unpaidLabel}
                    {index === 0 ? null : <span className="sr-only">{` (${fill(labels.invoiceName, { n })})`}</span>}
                  </Check>
                  {paidError ? (
                    <p className={errorClass} role="alert">
                      {labels.errors.paid}
                    </p>
                  ) : index === 0 && !row.unpaid ? (
                    <p className="m-0 text-[0.88rem] text-[var(--color-muted)]" id={fieldId("paid-hint")}>
                      {labels.paidHint}
                    </p>
                  ) : null}
                </div>
                <div className="flex justify-end pt-[2.1rem] max-[900px]:col-span-full max-[900px]:pt-0">
                  {rows.length > 1 ? (
                    <button
                      aria-label={`${labels.removeRow} ${n}`}
                      className="inline-grid h-10 w-10 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-[var(--color-muted)] hover:bg-[rgba(11,17,22,0.06)] hover:text-[var(--color-ink)]"
                      onClick={() => {
                        setRows((current) => current.filter((item) => item.id !== row.id));
                        touched();
                      }}
                      type="button"
                    >
                      <svg aria-hidden="true" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M6 6l12 12M18 6 6 18" />
                      </svg>
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <button
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-[rgba(11,17,22,0.2)] bg-transparent px-[18px] font-display text-[0.95rem] font-medium text-[var(--color-ink)] hover:border-[rgba(11,17,22,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
            disabled={rows.length >= MAX_INVOICES}
            onClick={() => {
              nextId.current += 1;
              setRows((current) => [...current, { id: nextId.current, label: "", amount: "", due: "", paid: "", unpaid: true }]);
              touched();
            }}
            type="button"
          >
            <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" />
            </svg>
            {labels.addRow}
          </button>
          {rows.length >= MAX_INVOICES ? <span className="text-[0.92rem] text-[var(--color-muted)]">{fill(labels.maxRows, { max: String(MAX_INVOICES) })}</span> : null}
        </div>

        <div className="grid max-w-[20rem] gap-2">
          <label className={labelClass} htmlFor={`${id}-until`}>
            {labels.untilLabel}
          </label>
          <input
            aria-describedby={`${id}-until-hint`}
            aria-invalid={today !== "" && !until}
            className={fieldClass}
            id={`${id}-until`}
            min={FIRST_DUE_DATE}
            onChange={(event) => {
              setPickedUntil(event.target.value);
              touched();
            }}
            type="date"
            value={until}
          />
          {today !== "" && !until ? (
            <p className={errorClass} role="alert">
              {labels.errors.until}
            </p>
          ) : (
            <p className="m-0 text-[0.88rem] text-[var(--color-muted)]" id={`${id}-until-hint`}>
              {labels.untilHint}
            </p>
          )}
        </div>
      </div>

      <div aria-live="polite" className="print-area grid gap-7 border-t border-[var(--color-border-light)] pt-7 print:border-0 print:pt-0 print:text-black">
        {results.length ? (
          <>
            <h2 className="m-0 hidden font-display text-[1.3rem] font-medium print:block">{labels.titles[mode]}</h2>
            <div className="grid gap-2">
              <p className={`m-0 font-display text-[clamp(2.2rem,4vw,3rem)] font-medium leading-[1.05] tracking-[-0.03em] text-[var(--color-ink)] ${figures}`}>
                <span className="text-[var(--color-muted)]">{labels.total} </span>
                <span className="whitespace-nowrap">{money(totals.interest + totals.compensation)}</span>
                {totals.compensationEur ? <span className="whitespace-nowrap">{` + ${totals.compensationEur} EUR`}</span> : null}
              </p>
              {hasCompensation ? (
                <p className={`m-0 text-[1.05rem] text-[var(--color-muted)] ${figures}`}>
                  {emphasize(labels.totalBreakdown, { interest: money(totals.interest), compensation: compensationText })}
                </p>
              ) : null}
            </div>
            {failedAny ? (
              <p className={`${mutedClass} print:hidden`}>
                {labels.compensationFailed}{" "}
                <button
                  className="cursor-pointer border-0 bg-transparent p-0 text-[var(--color-blue)] underline underline-offset-4 hover:text-[var(--color-blue-deep)]"
                  onClick={() =>
                    setEur((current) => Object.fromEntries(Object.entries(current).filter(([, entry]) => !("error" in entry))))
                  }
                  type="button"
                >
                  {labels.retry}
                </button>
              </p>
            ) : null}
          </>
        ) : null}

        {computed.map(({ row, name, result, error }) => {
          if (error === "notLate") {
            return (
              <div className="grid gap-1 border-t border-[var(--color-border-light)] pt-6" key={row.id}>
                <h3 className="m-0 font-display text-[1.2rem] font-medium text-[var(--color-ink)]">{name}</h3>
                <p className={mutedClass}>{labels.errors.notLate}</p>
              </div>
            );
          }
          if (!result) return null;
          return (
            <div className="grid gap-4 border-t border-[var(--color-border-light)] pt-6" key={row.id}>
              <div className="grid gap-1">
                <h3 className="m-0 font-display text-[1.2rem] font-medium text-[var(--color-ink)]">{name}</h3>
                <p className={`m-0 text-[1rem] text-[var(--color-muted)] ${figures}`}>
                  {emphasize(labels.invoiceSummary, {
                    amount: money(result.cents),
                    due: dotted(result.due),
                    end: emphasize(result.paid ? labels.paidOn : labels.unpaidUntil, { date: dotted(result.until) }),
                    days: days(result.days),
                  })}
                </p>
                {result.skipped.length ? <p className={mutedClass}>{shiftReason(result)}</p> : null}
              </div>
              <div className="overflow-x-auto">
                <table className={`w-full max-w-[44rem] border-collapse text-[1rem] text-[var(--color-ink)] ${figures}`}>
                  <thead>
                    <tr>
                      <th className={`${thClass} pl-0`} scope="col">
                        {labels.resultColumns.period}
                      </th>
                      <th className={`${thClass} text-right`} scope="col">
                        {labels.resultColumns.days}
                      </th>
                      <th className={`${thClass} text-right`} scope="col">
                        {labels.resultColumns.rate}
                      </th>
                      <th className={`${thClass} pr-0 text-right`} scope="col">
                        {labels.resultColumns.interest}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((interestRow) => (
                      <tr key={interestRow.from}>
                        <td className={`${tdClass} whitespace-nowrap pl-0`}>
                          {dotted(interestRow.from)}–{dotted(interestRow.to)}
                        </td>
                        <td className={`${tdClass} text-right`}>{interestRow.days}</td>
                        <td className={`${tdClass} whitespace-nowrap text-right`}>
                          {formatRate(interestRow.rateBp, sep)}%
                          {interestRow.forecast ? <span className="text-[var(--color-muted)]"> ({labels.forecastMark})</span> : null}
                        </td>
                        <td className={`${tdClass} whitespace-nowrap pr-0 text-right`}>{money(interestRow.interest)}</td>
                      </tr>
                    ))}
                    <tr>
                      <th className={`${tdClass} border-b-0 pl-0 pt-3.5 text-left font-semibold`} colSpan={3} scope="row">
                        {labels.interest}
                      </th>
                      <td className={`${tdClass} whitespace-nowrap border-b-0 pr-0 pt-3.5 text-right font-semibold`}>{money(result.interest)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {compensationLine(result)}
            </div>
          );
        })}

        {forecastFrom ? (
          <p className={`${mutedClass} flex items-start gap-2.5`}>
            <ClockIcon />
            <span>{fill(labels.forecastNote, { date: dotted(forecastFrom) })}</span>
          </p>
        ) : null}

        {results.length ? (
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 print:hidden">
            <CopyButton copied={copied} copiedLabel={labels.copied} label={labels.copyNote} onClick={copy} />
            <button
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-[rgba(11,17,22,0.2)] bg-transparent px-[18px] font-display text-[0.95rem] font-medium text-[var(--color-ink)] hover:border-[rgba(11,17,22,0.4)]"
              onClick={() => {
                trackToolEvent("tool_print");
                window.print();
              }}
              type="button"
            >
              <svg aria-hidden="true" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M7 9V3h10v6" />
                <rect height="8" rx="2" width="18" x="3" y="9" />
                <path d="M7 14h10v7H7z" />
              </svg>
              {labels.print}
            </button>
          </div>
        ) : null}
      </div>

      <PrivacyNote>{labels.privacyNote}</PrivacyNote>
    </div>
  );
}
