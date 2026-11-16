"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import type { SalaryCalculatorLabels } from "@/content/types";
import {
  compareContracts,
  contracts,
  grossFromNet,
  liability,
  mandateStatuses,
  monthsDiffer,
  optionUnavailable,
  payrollYear,
  reliefs,
  type CivilKupKey,
  type Contract,
  type KupKey,
  type MandateStatus,
  type PayrollInput,
  type PayrollMonth,
  type PayrollYear,
  type Relief,
} from "@/lib/tools/payroll";
import { defaultYear, payrollYears, type PayrollRates, type PayrollYearKey } from "@/lib/tools/payroll-rates";
import { formatCents, parseCents } from "@/lib/tools/vat";
import { CopyButton } from "@/components/tools/CopyButton";
import { PrivacyNote } from "@/components/tools/PrivacyNote";

type Gtag = (command: "event", name: string, params: Record<string, string>) => void;
type Mode = Contract | "compare";
type Direction = "grossToNet" | "netToGross";

/** Counts use of the tool and the mode, nothing else: never an amount. */
function trackToolEvent(name: string, mode: Mode) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", name, { tool: "salary_calculator", mode });
}

const fill = (template: string, values: Record<string, string>) => template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);

/** A positive amount in grosze, or null when empty or unreadable. */
function amountOrNull(raw: string): number | null {
  const cents = parseCents(raw);
  return cents === null || Number.isNaN(cents) || cents <= 0 ? null : cents;
}

/** A percentage such as "1,67" as basis points, or null. Wypadkowe runs from 0,40% to 8,12%. */
function parseRateBp(raw: string): number | null {
  const text = raw.replace(/[\s%]/g, "").replace(",", ".");
  if (!/^\d{1,2}(\.\d{1,2})?$/.test(text)) return null;
  const bp = Math.round(Number(text) * 100);
  return bp <= 1000 ? bp : null;
}

const years = Object.keys(payrollYears).map(Number) as PayrollYearKey[];

const segmentOn = "bg-[var(--color-ink)] text-[var(--color-mist)]";
const segmentOff = "bg-transparent text-[var(--color-ink)]";
const amountInputClass =
  "h-[72px] w-full rounded-[14px] border border-[rgba(11,17,22,0.16)] bg-[var(--color-paper)] px-5 font-display text-[1.9rem] font-medium tracking-[-0.02em] text-[var(--color-ink)] focus-visible:border-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--color-blue)] max-[720px]:text-[1.6rem]";
const smallInputClass =
  "h-11 w-full rounded-[10px] border border-[rgba(11,17,22,0.14)] bg-[var(--color-paper)] px-3 text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--color-blue)] disabled:text-[var(--color-muted)]";
const thClass = "border-b border-[rgba(11,17,22,0.16)] px-2 py-2 text-left text-[0.88rem] font-semibold text-[var(--color-muted)]";
const tdClass = "border-b border-[rgba(11,17,22,0.08)] px-2 py-2.5";
const labelClass = "text-[0.95rem] font-semibold text-[var(--color-ink)]";
const hintClass = "m-0 text-[0.88rem] text-[var(--color-muted)]";
const noteClass = "m-0 max-w-[47rem] text-[0.98rem] text-[var(--color-muted)]";
const errorClass = "m-0 text-[0.92rem] text-[#a3360f]";
const linkClass = "text-[var(--color-blue)] underline underline-offset-4 hover:text-[var(--color-blue-deep)]";

function Segments<T extends string>({ label, options, value, onChange }: { label: string; options: Array<{ key: T; label: string }>; value: T; onChange: (key: T) => void }) {
  return (
    <div aria-label={label} className="inline-flex w-fit flex-wrap rounded-[22px] border border-[var(--color-border-light)] bg-[var(--color-paper)] p-[3px]" role="group">
      {options.map((option) => (
        <button
          aria-pressed={value === option.key}
          className={`min-h-10 cursor-pointer rounded-full border-0 px-4 text-[0.95rem] transition-colors ${value === option.key ? segmentOn : segmentOff}`}
          key={option.key}
          onClick={() => onChange(option.key)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Check({ checked, onChange, disabled, children }: { checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean; children: ReactNode }) {
  return (
    <label className={`inline-flex min-h-11 items-center gap-2.5 text-[0.95rem] ${disabled ? "cursor-default text-[var(--color-muted)]" : "cursor-pointer text-[var(--color-ink)]"}`}>
      <input
        checked={checked}
        className="h-5 w-5 shrink-0 accent-[var(--color-ink)]"
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      <span>{children}</span>
    </label>
  );
}

type Row = { key: string; label: string; amount: number; how?: string; strong?: boolean };

function ResultTable({ title, rows, money }: { title: string; rows: Row[]; money: (cents: number) => string }) {
  return (
    <table className="w-full border-collapse text-[1rem] text-[var(--color-ink)]">
      <caption className="pb-2 text-left font-display text-[1.15rem] font-medium">{title}</caption>
      <tbody>
        {rows.map((row) => (
          <tr key={row.key}>
            <th className={`${tdClass} pl-0 text-left align-top ${row.strong ? "font-semibold" : "font-normal"}`} scope="row">
              {row.label}
              {row.how ? <span className="block text-[0.86rem] font-normal text-[var(--color-muted)]">{row.how}</span> : null}
            </th>
            <td
              className={`${tdClass} whitespace-nowrap pr-0 text-right align-top ${row.strong ? "font-display text-[1.35rem] font-medium tracking-[-0.01em]" : ""}`}
            >
              {money(row.amount)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function SalaryCalculator({ labels, b2bHref }: { labels: SalaryCalculatorLabels; b2bHref: string }) {
  const id = useId();
  const sep = labels.decimalSeparator;
  const money = (cents: number) => formatCents(cents, sep);
  const withCurrency = (cents: number) => fill(labels.money, { amount: money(cents) });
  const percent = (bp: number) => `${String(bp / 100).replace(".", sep)}%`;

  const [mode, setMode] = useState<Mode>("employment");
  const [direction, setDirection] = useState<Direction>("grossToNet");
  const [year, setYear] = useState<PayrollYearKey>(defaultYear);
  const [amountInput, setAmountInput] = useState(labels.defaultGross);
  const [kup, setKup] = useState<KupKey>("standard");
  const [civilKup, setCivilKup] = useState<CivilKupKey>("standard");
  const [status, setStatus] = useState<MandateStatus>("only");
  const [workOwn, setWorkOwn] = useState(false);
  const [sickness, setSickness] = useState(true);
  /* PIT-2 is usually filed with the main employer, so it is off by default on zlecenie and dzieło. */
  const [pit2Employment, setPit2Employment] = useState(true);
  const [pit2Civil, setPit2Civil] = useState(false);
  const [relief, setRelief] = useState<Relief>("none");
  const [ppk, setPpk] = useState(false);
  const [accidentInput, setAccidentInput] = useState(() => String(payrollYears[defaultYear].employer.accidentBp / 100).replace(".", labels.decimalSeparator));

  const [copied, setCopied] = useState<"breakdown" | "summary" | null>(null);
  const copiedTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(copiedTimer.current), []);

  /* "tool_used" once per visit, on the first change. */
  const used = useRef(false);
  const touch = (nextMode: Mode = mode) => {
    setCopied(null);
    if (!used.current) {
      used.current = true;
      trackToolEvent("tool_used", nextMode);
    }
  };
  const update = <T,>(setter: (value: T) => void, value: T) => {
    setter(value);
    touch();
  };

  const rates: PayrollRates = payrollYears[year];
  const accidentBp = parseRateBp(accidentInput);
  const accidentError = accidentBp === null;
  const amount = amountOrNull(amountInput);
  const amountError = amountInput.trim() !== "" && amount === null;
  const comparing = mode === "compare";
  const effectiveDirection: Direction = comparing ? "grossToNet" : direction;
  const contract: Contract = comparing ? "employment" : mode;

  const input: Omit<PayrollInput, "gross"> = {
    contract,
    kup,
    civilKup,
    status: contract === "work" ? (workOwn ? "ownEmployer" : "only") : contract === "mandate" ? status : "only",
    sickness,
    pit2: contract === "employment" ? pit2Employment : pit2Civil,
    relief,
    ppk,
    accidentBp: accidentBp ?? undefined,
  };
  const L = liability(input);

  /* Netto → brutto targets the first month's take-home, then shows the year for that gross. */
  const gross = amount === null || accidentError ? null : effectiveDirection === "grossToNet" ? amount : grossFromNet(amount, input, rates);
  const noGross = effectiveDirection === "netToGross" && amount !== null && !accidentError && gross === null;
  const result: PayrollYear | null = !comparing && gross !== null ? payrollYear({ ...input, gross }, rates) : null;
  const comparison = comparing && gross !== null ? compareContracts(gross, { ...input, pit2: pit2Civil }, rates) : null;
  const first: PayrollMonth | null = result?.months[0] ?? null;
  const differ = result ? monthsDiffer(result) : false;

  const switchDirection = (next: Direction) => {
    if (next === direction) return;
    /* Carry the other side of the current result over, so the two directions round-trip. */
    if (first && gross !== null) setAmountInput(money(next === "netToGross" ? first.net : gross));
    setDirection(next);
    touch();
  };

  const contractName = (key: Contract) => labels.contracts[key];
  const firstEdge = rates.pit.brackets[0].upTo ?? Infinity;

  const employeeRows = (m: PayrollMonth, g: number): Row[] => {
    const ee = rates.employee;
    const rows: Row[] = [{ key: "gross", label: labels.rows.gross, amount: g }];
    const capped = m.pensionBase < g ? ` (${fill(labels.how.capped, { cap: withCurrency(rates.pensionCapYear) })})` : "";
    if (L.social) {
      rows.push({ key: "pension", label: labels.rows.pension, amount: m.pension, how: fill(labels.how.rateOf, { rate: percent(ee.pensionBp), base: withCurrency(m.pensionBase) }) + capped });
      rows.push({ key: "disability", label: labels.rows.disability, amount: m.disability, how: fill(labels.how.rateOf, { rate: percent(ee.disabilityBp), base: withCurrency(m.pensionBase) }) + capped });
    }
    if (m.sickness > 0) rows.push({ key: "sickness", label: labels.rows.sickness, amount: m.sickness, how: fill(labels.how.rateOf, { rate: percent(ee.sicknessBp), base: withCurrency(g) }) });
    if (m.health > 0) rows.push({ key: "health", label: labels.rows.health, amount: m.health, how: fill(labels.how.health, { rate: percent(ee.healthBp), base: withCurrency(g - m.social) }) });

    if (m.flatTax) {
      rows.push({ key: "flatTax", label: labels.rows.flatTax, amount: m.advance, how: fill(labels.how.flatTax, { rate: percent(rates.pit.smallContractBp) }) });
    } else {
      if (m.kup > 0) {
        const civilBase = Math.round(((m.revenue - m.social) * (m.revenue - m.exempt)) / m.revenue);
        const how =
          contract === "employment"
            ? labels.how.fixedKup
            : fill(labels.how.civilKup, { rate: percent(rates.pit.civilKupBp[civilKup]), base: withCurrency(civilBase) });
        rows.push({ key: "kup", label: labels.rows.kup, amount: m.kup, how });
      }
      if (m.taxBase > 0) {
        rows.push({
          key: "taxBase",
          label: labels.rows.taxBase,
          amount: m.taxBase,
          how: fill(labels.how.taxBase, { revenue: withCurrency(m.revenue - m.exempt), social: withCurrency(m.socialDeducted), kup: withCurrency(m.kup) }),
        });
      }
      let how: string;
      if (m.exempt >= m.revenue) how = fill(labels.how.exempt, { limit: withCurrency(rates.pit.youthExemptRevenue) });
      else if (contract === "employment" && m.taxBase > firstEdge) how = labels.how.advanceScale;
      else {
        const rate = contract === "employment" ? rates.pit.brackets[0].bp : rates.pit.civilAdvanceBp;
        how = fill(labels.how.advance, { rate: percent(rate), base: withCurrency(m.taxBase) });
        if (m.reduction > 0) how += fill(labels.how.reduction, { amount: withCurrency(m.reduction) });
      }
      rows.push({ key: "advance", label: labels.rows.advance, amount: m.advance, how });
    }
    if (m.ppkEmployee > 0) rows.push({ key: "ppk", label: labels.rows.ppk, amount: m.ppkEmployee, how: fill(labels.how.rateOf, { rate: percent(ee.ppkBp), base: withCurrency(g) }) });
    rows.push({ key: "net", label: labels.rows.net, amount: m.net, how: labels.how.net, strong: true });
    return rows;
  };

  const employerRows = (m: PayrollMonth, g: number): Row[] => {
    const er = rates.employer;
    const rows: Row[] = [{ key: "gross", label: labels.rows.gross, amount: g }];
    if (L.employerSocial) {
      rows.push({ key: "pension", label: labels.rows.pension, amount: m.employer.pension, how: fill(labels.how.rateOf, { rate: percent(er.pensionBp), base: withCurrency(m.pensionBase) }) });
      rows.push({ key: "disability", label: labels.rows.disability, amount: m.employer.disability, how: fill(labels.how.rateOf, { rate: percent(er.disabilityBp), base: withCurrency(m.pensionBase) }) });
      rows.push({ key: "accident", label: labels.rows.accident, amount: m.employer.accident, how: fill(labels.how.rateOf, { rate: percent(accidentBp ?? er.accidentBp), base: withCurrency(g) }) });
      rows.push({
        key: "labourFund",
        label: labels.rows.labourFund,
        amount: m.employer.labourFund,
        how: m.employer.labourFund > 0 ? fill(labels.how.rateOf, { rate: percent(er.labourFundBp), base: withCurrency(g) }) : fill(labels.how.noLabourFund, { minimum: withCurrency(rates.minimumWage) }),
      });
      rows.push({ key: "fgsp", label: labels.rows.fgsp, amount: m.employer.fgsp, how: fill(labels.how.rateOf, { rate: percent(er.fgspBp), base: withCurrency(g) }) });
    }
    if (m.employer.ppk > 0) rows.push({ key: "ppk", label: labels.rows.ppk, amount: m.employer.ppk, how: fill(labels.how.rateOf, { rate: percent(er.ppkBp), base: withCurrency(g) }) });
    rows.push({ key: "employerCost", label: labels.rows.employerCost, amount: m.employerCost, how: L.employerSocial ? labels.how.employerCost : labels.how.noEmployerContributions, strong: true });
    return rows;
  };

  const situationNote = (() => {
    if (comparing) return null;
    if (contract === "work") return workOwn ? labels.situationNotes.workOwnEmployer : labels.situationNotes.work;
    if (contract === "mandate" && status !== "only") return labels.situationNotes[status];
    return null;
  })();
  const situationText = situationNote ? fill(situationNote, { limit: withCurrency(rates.pit.youthExemptRevenue), minimum: withCurrency(rates.minimumWage) }) : null;

  const monthNotes = (row: PayrollMonth) =>
    [
      row.capStarts ? labels.notes.cap : null,
      row.bracketStarts ? (contract === "employment" ? labels.notes.bracket : labels.notes.bracketCivil) : null,
      row.reliefEnds ? labels.notes.relief : null,
      row.authorCapReached ? labels.notes.authorCap : null,
    ].filter((note): note is string => note !== null);

  const finish = (kind: "breakdown" | "summary") => {
    setCopied(kind);
    window.clearTimeout(copiedTimer.current);
    copiedTimer.current = window.setTimeout(() => setCopied(null), 1800);
    trackToolEvent("tool_copy", mode);
  };

  const copyText = async (kind: "breakdown" | "summary", text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      finish(kind);
    } catch {
      /* Clipboard refused: the amounts stay on screen to copy by hand. */
    }
  };

  const breakdownText = () => {
    if (!result || !first || gross === null) return "";
    const lines: string[] = [];
    lines.push(`${labels.employeeTitle}\t${contractName(contract)}`);
    for (const row of employeeRows(first, gross)) lines.push(`${row.label}\t${money(row.amount)}`);
    lines.push("", labels.employerTitle);
    for (const row of employerRows(first, gross)) lines.push(`${row.label}\t${money(row.amount)}`);
    lines.push("", [labels.monthsColumns.month, labels.monthsColumns.social, labels.monthsColumns.health, labels.monthsColumns.advance, labels.monthsColumns.net, labels.monthsColumns.cost, labels.monthsColumns.note].join("\t"));
    for (const row of result.months) {
      lines.push([labels.monthNames[row.month - 1], money(row.social), money(row.health), money(row.advance), money(row.net), money(row.employerCost), monthNotes(row).join(", ")].join("\t"));
    }
    lines.push([labels.yearRow, money(result.social), money(result.health), money(result.pit), money(result.net), money(result.employerCost), ""].join("\t"));
    return lines.join("\n");
  };

  const summaryText = () => {
    if (comparison && gross !== null) {
      return contracts
        .map((key) => fill(labels.summary, { contract: contractName(key), gross: withCurrency(gross), net: withCurrency(comparison[key].months[0].net), cost: withCurrency(comparison[key].months[0].employerCost), year: String(year) }))
        .join("\n");
    }
    if (!first || gross === null) return "";
    return fill(labels.summary, { contract: contractName(contract), gross: withCurrency(gross), net: withCurrency(first.net), cost: withCurrency(first.employerCost), year: String(year) });
  };

  const showSickness = comparing || (contract === "mandate" && (status === "only" || status === "ownEmployer")) || (contract === "work" && workOwn);
  const sicknessForced = !comparing && optionUnavailable("sickness", input) === "ownEmployer";
  const showRelief = comparing || contract === "employment" || (contract === "mandate" && status !== "student") || contract === "work";
  const reliefDisabled = !comparing && optionUnavailable("relief", input) === "work";
  const showPpk = comparing || L.ppkAllowed;
  const showCivilKup = comparing || contract !== "employment";
  const pit2Checked = contract === "employment" && !comparing ? pit2Employment : pit2Civil;
  const setPit2 = contract === "employment" && !comparing ? setPit2Employment : setPit2Civil;

  return (
    <div className="grid gap-10">
      <div className="grid gap-5">
        <Segments
          label={labels.contractLegend}
          onChange={(value) => {
            setMode(value);
            touch(value);
          }}
          options={[...contracts.map((key) => ({ key: key as Mode, label: labels.contracts[key] })), { key: "compare" as Mode, label: labels.contracts.compare }]}
          value={mode}
        />
        <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
          {!comparing ? (
            <Segments
              label={labels.directionLegend}
              onChange={switchDirection}
              options={[
                { key: "grossToNet", label: labels.direction.grossToNet },
                { key: "netToGross", label: labels.direction.netToGross },
              ]}
              value={direction}
            />
          ) : null}
          <div className="grid gap-1">
            <div className="flex items-center gap-3">
              <label className={labelClass} htmlFor={`${id}-year`}>
                {labels.yearLabel}
              </label>
              <select className={`${smallInputClass} w-auto px-2`} id={`${id}-year`} onChange={(event) => update(setYear, Number(event.target.value) as PayrollYearKey)} value={year}>
                {years.map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
            {rates.scaleStatus === "bill" ? <p className={`${hintClass} max-w-[30rem]`}>{labels.scaleBill}</p> : null}
          </div>
        </div>

        <div className="grid max-w-[34rem] gap-2">
          <label className={labelClass} htmlFor={`${id}-amount`}>
            {effectiveDirection === "grossToNet" ? labels.grossLabel : labels.netLabel}
          </label>
          <input
            aria-describedby={amountError ? `${id}-amount-error` : undefined}
            aria-invalid={amountError || undefined}
            autoComplete="off"
            className={amountInputClass}
            id={`${id}-amount`}
            inputMode="decimal"
            maxLength={16}
            onChange={(event) => {
              setAmountInput(event.target.value);
              touch();
            }}
            spellCheck={false}
            type="text"
            value={amountInput}
          />
          {amountError ? (
            <p className={errorClass} id={`${id}-amount-error`} role="alert">
              {labels.errors.amount}
            </p>
          ) : effectiveDirection === "netToGross" ? (
            <p className={hintClass}>{labels.netToGrossHint}</p>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-5 max-[820px]:grid-cols-1">
        {contract === "employment" || comparing ? (
          <div className="grid content-start gap-2">
            <p className={`${labelClass} m-0`}>{labels.kupLegend}</p>
            <Segments
              label={labels.kupLegend}
              onChange={(value) => update(setKup, value)}
              options={[
                { key: "standard", label: labels.kup.standard },
                { key: "commuter", label: labels.kup.commuter },
              ]}
              value={kup}
            />
          </div>
        ) : null}
        {showCivilKup ? (
          <div className="grid content-start gap-2">
            <p className={`${labelClass} m-0`}>{labels.civilKupLegend}</p>
            <Segments
              label={labels.civilKupLegend}
              onChange={(value) => update(setCivilKup, value)}
              options={[
                { key: "standard", label: labels.civilKup.standard },
                { key: "author", label: labels.civilKup.author },
              ]}
              value={civilKup}
            />
          </div>
        ) : null}
        {contract === "mandate" && !comparing ? (
          <div className="grid content-start gap-2">
            <label className={labelClass} htmlFor={`${id}-status`}>
              {labels.statusLabel}
            </label>
            <select className={`${smallInputClass} px-2`} id={`${id}-status`} onChange={(event) => update(setStatus, event.target.value as MandateStatus)} value={status}>
              {mandateStatuses.map((key) => (
                <option key={key} value={key}>
                  {labels.status[key]}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        {showRelief ? (
          <div className="grid content-start gap-2">
            <label className={labelClass} htmlFor={`${id}-relief`}>
              {labels.reliefLabel}
            </label>
            <select
              aria-describedby={reliefDisabled ? `${id}-relief-hint` : undefined}
              className={`${smallInputClass} px-2`}
              disabled={reliefDisabled}
              id={`${id}-relief`}
              onChange={(event) => update(setRelief, event.target.value as Relief)}
              value={reliefDisabled ? "none" : relief}
            >
              {reliefs.map((key) => (
                <option key={key} value={key}>
                  {labels.reliefs[key]}
                </option>
              ))}
            </select>
            {reliefDisabled ? (
              <p className={hintClass} id={`${id}-relief-hint`}>
                {labels.reliefUnavailable}
              </p>
            ) : null}
          </div>
        ) : null}
        <div className="grid content-start gap-0.5">
          <Check checked={pit2Checked} onChange={(value) => update(setPit2, value)}>
            {labels.pit2}
          </Check>
          {contract !== "employment" || comparing ? <p className={hintClass}>{labels.pit2Hint}</p> : null}
          {contract === "work" && !comparing ? (
            <Check checked={workOwn} onChange={(value) => update(setWorkOwn, value)}>
              {labels.workOwnEmployer}
            </Check>
          ) : null}
          {showSickness ? (
            <Check checked={sicknessForced || sickness} disabled={sicknessForced} onChange={(value) => update(setSickness, value)}>
              {labels.sickness}
            </Check>
          ) : null}
          {showPpk ? (
            <Check checked={ppk} onChange={(value) => update(setPpk, value)}>
              {labels.ppk}
            </Check>
          ) : null}
        </div>
      </div>

      <details className="-mt-4">
        <summary className="cursor-pointer text-[0.95rem] font-semibold text-[var(--color-ink)]">{labels.moreOptions}</summary>
        <div className="mt-3 grid max-w-[20rem] gap-2">
          <label className={labelClass} htmlFor={`${id}-accident`}>
            {labels.accidentLabel}
          </label>
          <input
            aria-describedby={`${id}-accident-hint`}
            aria-invalid={accidentError || undefined}
            autoComplete="off"
            className={smallInputClass}
            id={`${id}-accident`}
            inputMode="decimal"
            maxLength={6}
            onChange={(event) => {
              setAccidentInput(event.target.value);
              touch();
            }}
            type="text"
            value={accidentInput}
          />
          {accidentError ? (
            <p className={errorClass} role="alert">
              {labels.errors.accident}
            </p>
          ) : (
            <p className={hintClass} id={`${id}-accident-hint`}>
              {labels.accidentHint}
            </p>
          )}
        </div>
      </details>

      {noGross ? <p className={noteClass}>{labels.noGross}</p> : null}

      {result && first && gross !== null ? (
        <div aria-live="polite" className="grid gap-6 border-t border-[var(--color-border-light)] pt-7">
          <div className="grid gap-1.5">
            {effectiveDirection === "netToGross" ? (
              <p className="m-0 font-display text-[1.6rem] font-medium leading-[1.3] text-[var(--color-ink)]">{fill(labels.grossResult, { amount: withCurrency(gross) })}</p>
            ) : null}
            <p className="m-0 font-display text-[1.6rem] font-medium leading-[1.3] text-[var(--color-ink)]">{fill(labels.headline, { amount: withCurrency(first.net) })}</p>
            {differ ? <p className={noteClass}>{fill(labels.headlineAverage, { amount: withCurrency(Math.round(result.net / 12)) })}</p> : null}
            {effectiveDirection === "netToGross" && amount !== null && first.net !== amount ? (
              <p className={noteClass}>{fill(labels.inexactNet, { target: withCurrency(amount), net: withCurrency(first.net) })}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-8 max-[820px]:grid-cols-1">
            <ResultTable money={money} rows={employeeRows(first, gross)} title={labels.employeeTitle} />
            <ResultTable money={money} rows={employerRows(first, gross)} title={labels.employerTitle} />
          </div>

          <div className="grid gap-2">
            {situationText ? <p className={noteClass}>{situationText}</p> : null}
            {relief !== "none" && L.reliefAllowed && !(contract === "mandate" && status === "student") ? (
              <p className={noteClass}>{fill(labels.situationNotes.relief, { limit: withCurrency(rates.pit.youthExemptRevenue) })}</p>
            ) : null}
            {first.flatTax ? <p className={noteClass}>{labels.flatTaxNote}</p> : null}
            {contract === "employment" && gross < rates.minimumWage ? <p className={noteClass}>{fill(labels.belowMinimum, { minimum: withCurrency(rates.minimumWage) })}</p> : null}
            {result.yearlySurcharge > 0 ? (
              <p className={noteClass}>{fill(labels.yearlyNote, { threshold: withCurrency(firstEdge), amount: withCurrency(result.yearlySurcharge) })}</p>
            ) : null}
          </div>

          <details className="border-b border-[var(--color-border-light)] pb-4" key={differ ? "differ" : "same"} open={differ}>
            <summary className="cursor-pointer font-display text-[1.15rem] font-medium text-[var(--color-ink)]">{labels.monthsTitle}</summary>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[44rem] border-collapse text-[0.95rem] text-[var(--color-ink)]">
                <thead>
                  <tr>
                    <th className={`${thClass} pl-0`} scope="col">{labels.monthsColumns.month}</th>
                    <th className={`${thClass} text-right`} scope="col">{labels.monthsColumns.social}</th>
                    <th className={`${thClass} text-right`} scope="col">{labels.monthsColumns.health}</th>
                    <th className={`${thClass} text-right`} scope="col">{labels.monthsColumns.advance}</th>
                    <th className={`${thClass} text-right`} scope="col">{labels.monthsColumns.net}</th>
                    <th className={`${thClass} text-right`} scope="col">{labels.monthsColumns.cost}</th>
                    <th className={`${thClass} pr-0`} scope="col">{labels.monthsColumns.note}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.months.map((row) => (
                    <tr key={row.month}>
                      <th className={`${tdClass} pl-0 text-left font-normal`} scope="row">{labels.monthNames[row.month - 1]}</th>
                      <td className={`${tdClass} whitespace-nowrap text-right`}>{money(row.social)}</td>
                      <td className={`${tdClass} whitespace-nowrap text-right`}>{money(row.health)}</td>
                      <td className={`${tdClass} whitespace-nowrap text-right`}>{money(row.advance)}</td>
                      <td className={`${tdClass} whitespace-nowrap text-right font-semibold`}>{money(row.net)}</td>
                      <td className={`${tdClass} whitespace-nowrap text-right`}>{money(row.employerCost)}</td>
                      <td className={`${tdClass} pr-0 text-[var(--color-muted)]`}>{monthNotes(row).join(", ")}</td>
                    </tr>
                  ))}
                  <tr>
                    <th className={`${tdClass} pl-0 text-left font-semibold`} scope="row">{labels.yearRow}</th>
                    <td className={`${tdClass} whitespace-nowrap text-right font-semibold`}>{money(result.social)}</td>
                    <td className={`${tdClass} whitespace-nowrap text-right font-semibold`}>{money(result.health)}</td>
                    <td className={`${tdClass} whitespace-nowrap text-right font-semibold`}>{money(result.pit)}</td>
                    <td className={`${tdClass} whitespace-nowrap text-right font-semibold`}>{money(result.net)}</td>
                    <td className={`${tdClass} whitespace-nowrap text-right font-semibold`}>{money(result.employerCost)}</td>
                    <td className={`${tdClass} pr-0`} />
                  </tr>
                </tbody>
              </table>
            </div>
          </details>

          <div className="flex flex-wrap gap-3">
            <CopyButton copied={copied === "breakdown"} copiedLabel={labels.copied} label={labels.copyBreakdown} onClick={() => copyText("breakdown", breakdownText())} />
            <CopyButton copied={copied === "summary"} copiedLabel={labels.copied} label={labels.copySummary} onClick={() => copyText("summary", summaryText())} />
          </div>
        </div>
      ) : null}

      {comparison && gross !== null ? (
        <div aria-live="polite" className="grid gap-6 border-t border-[var(--color-border-light)] pt-7">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-[1rem] text-[var(--color-ink)]">
              <caption className="sr-only">{labels.compareCaption}</caption>
              <thead>
                <tr>
                  <th className={`${thClass} pl-0`} scope="col">
                    <span className="sr-only">{labels.compareCaption}</span>
                  </th>
                  {contracts.map((key, index) => (
                    <th className={`${thClass} text-right ${index === contracts.length - 1 ? "pr-0" : ""}`} key={key} scope="col">
                      {labels.contracts[key]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ["netMonth", (y: PayrollYear) => y.months[0].net, true],
                    ["netYear", (y: PayrollYear) => y.net, false],
                    ["costMonth", (y: PayrollYear) => y.months[0].employerCost, false],
                    ["costYear", (y: PayrollYear) => y.employerCost, false],
                  ] as const
                ).map(([key, value, strong]) => (
                  <tr key={key}>
                    <th className={`${tdClass} pl-0 text-left ${strong ? "font-semibold" : "font-normal"}`} scope="row">
                      {labels.compareRows[key]}
                    </th>
                    {contracts.map((contractKey, index) => (
                      <td
                        className={`${tdClass} whitespace-nowrap text-right ${index === contracts.length - 1 ? "pr-0" : ""} ${strong ? "font-display text-[1.35rem] font-medium tracking-[-0.01em]" : ""}`}
                        key={contractKey}
                      >
                        {money(value(comparison[contractKey]))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-2">
            <p className={noteClass}>{labels.compareNote}</p>
            <p className={noteClass}>
              {labels.compareB2b.before}
              <Link className={linkClass} href={b2bHref}>
                {labels.compareB2b.link}
              </Link>
              {labels.compareB2b.after}
            </p>
          </div>
          <div>
            <CopyButton copied={copied === "summary"} copiedLabel={labels.copied} label={labels.copySummary} onClick={() => copyText("summary", summaryText())} />
          </div>
        </div>
      ) : null}

      <div className="grid gap-1.5">
        <p className="m-0 max-w-[47rem] text-[0.92rem] text-[var(--color-muted)]">{labels.disclaimer}</p>
        <PrivacyNote>{labels.privacyNote}</PrivacyNote>
      </div>
    </div>
  );
}
