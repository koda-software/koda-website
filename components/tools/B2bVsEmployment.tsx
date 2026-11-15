"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { B2bVsEmploymentLabels } from "@/content/types";
import {
  b2bYear,
  breakEvenInvoice,
  compareAllForms,
  effectiveB2bInput,
  employerCostInvoice,
  employmentYear,
  formUnavailable,
  formatCents,
  parseCents,
  taxForms,
  zusKeys,
  zusUnavailable,
  type B2bInput,
  type KupKey,
  type TaxForm,
  type ZusKey,
} from "@/lib/tools/b2b-vs-employment";
import { rates2026 } from "@/lib/tools/payroll-rates";

type Gtag = (command: "event", name: string, params: Record<string, string>) => void;

/** Counts use of the tool and nothing else: never an amount. */
function trackToolEvent(name: string) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", name, { tool: "b2b_vs_employment" });
}

const rates = rates2026;

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);

/** A positive amount in grosze, or null when empty or unreadable. */
function amountOrNull(raw: string): number | null {
  const cents = parseCents(raw);
  return cents === null || Number.isNaN(cents) ? null : cents;
}

function parseDays(raw: string): number | null {
  const text = raw.trim();
  if (!text) return 0;
  if (!/^\d{1,3}$/.test(text)) return null;
  const days = Number(text);
  return days <= rates.billableDays ? days : null;
}

const segmentOn = "bg-[var(--color-ink)] text-[var(--color-mist)]";
const segmentOff = "bg-transparent text-[var(--color-ink)]";
const amountInputClass =
  "h-[72px] w-full rounded-[14px] border border-[rgba(11,17,22,0.16)] bg-[var(--color-paper)] px-5 font-display text-[1.9rem] font-medium tracking-[-0.02em] text-[var(--color-ink)] focus-visible:border-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--color-blue)] max-[720px]:text-[1.6rem]";
const smallInputClass =
  "h-11 w-full rounded-[10px] border border-[rgba(11,17,22,0.14)] bg-[var(--color-paper)] px-3 text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--color-blue)]";
const thClass = "border-b border-[rgba(11,17,22,0.16)] px-2 py-2 text-left text-[0.88rem] font-semibold text-[var(--color-muted)]";
const tdClass = "border-b border-[rgba(11,17,22,0.08)] px-2 py-2.5";
const legendClass = "mb-2.5 p-0 text-[0.95rem] font-semibold text-[var(--color-ink)]";
const textButtonClass =
  "cursor-pointer border-0 bg-transparent p-0 text-[0.95rem] text-[var(--color-blue)] underline underline-offset-4 hover:text-[var(--color-blue-deep)] disabled:cursor-default disabled:text-[var(--color-muted)] disabled:no-underline";
const linkErrorClass = "m-0 text-[0.92rem] text-[#a3360f]";

function Segments<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled,
}: {
  label: string;
  options: Array<{ key: T; label: string }>;
  value: T;
  onChange: (key: T) => void;
  disabled?: (key: T) => string | null;
}) {
  return (
    <div aria-label={label} className="inline-flex w-fit flex-wrap rounded-[22px] border border-[var(--color-border-light)] bg-[var(--color-paper)] p-[3px]" role="group">
      {options.map((option) => {
        const reason = disabled?.(option.key) ?? null;
        return (
          <button
            aria-pressed={value === option.key}
            className={`min-h-10 cursor-pointer rounded-full border-0 px-4 text-[0.95rem] transition-colors disabled:cursor-not-allowed disabled:text-[var(--color-muted)] disabled:line-through ${value === option.key ? segmentOn : segmentOff}`}
            disabled={reason !== null}
            key={option.key}
            onClick={() => onChange(option.key)}
            title={reason ?? undefined}
            type="button"
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function Check({ checked, onChange, children }: { checked: boolean; onChange: (checked: boolean) => void; children: ReactNode }) {
  return (
    <label className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 text-[0.95rem] text-[var(--color-ink)]">
      <input checked={checked} className="h-5 w-5 shrink-0 accent-[var(--color-ink)]" onChange={(event) => onChange(event.target.checked)} type="checkbox" />
      <span>{children}</span>
    </label>
  );
}

export function B2bVsEmployment({ labels }: { labels: B2bVsEmploymentLabels }) {
  const id = useId();
  const sep = labels.decimalSeparator;
  const money = (cents: number) => formatCents(cents, sep);
  const withCurrency = (cents: number) => fill(labels.money, { amount: money(cents) });

  const [grossInput, setGrossInput] = useState(labels.defaultGross);
  const [invoiceInput, setInvoiceInput] = useState(labels.defaultInvoice);
  const [kup, setKup] = useState<KupKey>("standard");
  const [pit2, setPit2] = useState(true);
  const [under26, setUnder26] = useState(false);
  const [ppk, setPpk] = useState(false);
  const [form, setForm] = useState<TaxForm>("ryczalt");
  const [ryczaltBp, setRyczaltBp] = useState(rates.ryczalt.defaultBp);
  const [zus, setZus] = useState<ZusKey>("full");
  const [sickness, setSickness] = useState(true);
  const [costsInput, setCostsInput] = useState("0");
  const [daysInput, setDaysInput] = useState("0");
  const [formerEmployer, setFormerEmployer] = useState(false);
  const [period, setPeriod] = useState<"month" | "year">("month");

  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(copiedTimer.current), []);

  /* "tool_used" once per visit, on the first change. */
  const used = useRef(false);
  const touch = () => {
    setCopied(false);
    if (!used.current) {
      used.current = true;
      trackToolEvent("tool_used");
    }
  };
  const update = <T,>(setter: (value: T) => void, value: T) => {
    setter(value);
    touch();
  };

  const gross = amountOrNull(grossInput);
  const invoice = amountOrNull(invoiceInput);
  const costs = amountOrNull(costsInput) ?? (costsInput.trim() ? null : 0);
  const daysOff = parseDays(daysInput);
  const grossError = grossInput.trim() !== "" && gross === null;
  const invoiceError = invoiceInput.trim() !== "" && invoice === null;
  const costsError = costs === null;
  const daysError = daysOff === null;

  const employment = gross !== null && gross > 0 ? employmentYear({ gross, kup, pit2, under26, ppk }, rates) : null;

  const options: B2bInput = { invoice: invoice ?? 0, form, ryczaltBp, zus, sickness, costs: costs ?? 0, daysOff: daysOff ?? 0, formerEmployer };
  const effective = effectiveB2bInput(options, rates);
  const b2bValid = invoice !== null && invoice > 0 && !costsError && !daysError;
  const b2b = b2bValid ? b2bYear(effective, rates) : null;
  const allForms = b2bValid ? compareAllForms(options, rates) : null;
  const breakEven = employment && !costsError && !daysError ? breakEvenInvoice(employment.net, options, rates) : null;

  const ratePercent = `${String(ryczaltBp / 100).replace(".", sep)}%`;
  const formLabel = (key: TaxForm) => (key === "ryczalt" ? `${labels.forms.ryczalt} ${ratePercent}` : labels.forms[key]);
  const perPeriod = (yearly: number) => (period === "month" ? Math.round(yearly / 12) : yearly);

  const setInvoice = (cents: number) => {
    setInvoiceInput(money(cents));
    touch();
  };

  const difference = employment && b2b ? b2b.net - employment.net : null;
  const differenceText =
    difference === null
      ? null
      : /* Under 1 zł a year is rounding: an invoice in whole grosze rarely matches a salary exactly. */
        Math.abs(difference) < 100
        ? labels.difference.equal
        : fill(difference > 0 ? labels.difference.more : labels.difference.less, {
            year: withCurrency(Math.abs(difference)),
            month: withCurrency(Math.round(Math.abs(difference) / 12)),
          });

  const copy = async () => {
    const lines: string[] = [];
    if (employment && gross !== null) {
      lines.push(fill(labels.copyEmployment, { gross: withCurrency(gross), month: withCurrency(Math.round(employment.net / 12)), year: withCurrency(employment.net) }));
    }
    if (b2b && invoice !== null) {
      const optionsText = [formLabel(effective.form), labels.zus[effective.zus]].join(", ");
      lines.push(fill(labels.copyB2b, { invoice: withCurrency(invoice), options: optionsText, month: withCurrency(Math.round(b2b.net / 12)), year: withCurrency(b2b.net) }));
    }
    if (differenceText) lines.push(differenceText);
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopied(false), 1800);
      trackToolEvent("tool_copy");
    } catch {
      /* Clipboard refused: the amounts stay on screen to copy by hand. */
    }
  };

  const unavailableText = (reason: "formerEmployer" | "revenueLimit" | null) => (reason ? labels.unavailable[reason] : null);
  const tierEdgeHealth = breakEven?.tierEdge != null ? rates.health.ryczaltTiers.find((tier) => tier.upTo === null || tier.upTo > breakEven.tierEdge!)?.monthly : undefined;

  const resultRows: Array<{ key: keyof B2bVsEmploymentLabels["rows"]; employment: number | null; b2b: number | null; strong?: boolean }> = [
    { key: "net", employment: employment?.net ?? null, b2b: b2b?.net ?? null, strong: true },
    { key: "social", employment: employment?.social ?? null, b2b: b2b?.social ?? null },
    { key: "health", employment: employment?.health ?? null, b2b: b2b?.health ?? null },
    { key: "pit", employment: employment?.pit ?? null, b2b: b2b?.tax ?? null },
    ...(ppk ? [{ key: "ppk" as const, employment: employment?.ppkEmployee ?? null, b2b: null }] : []),
    { key: "costs", employment: null, b2b: b2b?.costs ?? null },
    { key: "companyCost", employment: employment?.employerCost ?? null, b2b: b2b?.revenue ?? null },
  ];

  return (
    <div className="grid gap-10">
      <div className="grid grid-cols-2 gap-x-8 gap-y-6 max-[820px]:grid-cols-1">
        <div className="grid content-start gap-2">
          <label className="text-[0.95rem] font-semibold text-[var(--color-ink)]" htmlFor={`${id}-gross`}>
            {labels.grossLabel}
          </label>
          <input
            aria-describedby={grossError ? `${id}-gross-error` : undefined}
            aria-invalid={grossError || undefined}
            autoComplete="off"
            className={amountInputClass}
            id={`${id}-gross`}
            inputMode="decimal"
            maxLength={16}
            onChange={(event) => {
              setGrossInput(event.target.value);
              touch();
            }}
            spellCheck={false}
            type="text"
            value={grossInput}
          />
          {grossError ? (
            <p className={linkErrorClass} id={`${id}-gross-error`} role="alert">
              {labels.errors.amount}
            </p>
          ) : null}
        </div>
        <div className="grid content-start gap-2">
          <label className="text-[0.95rem] font-semibold text-[var(--color-ink)]" htmlFor={`${id}-invoice`}>
            {labels.invoiceLabel}
          </label>
          <input
            aria-describedby={invoiceError ? `${id}-invoice-error` : undefined}
            aria-invalid={invoiceError || undefined}
            autoComplete="off"
            className={amountInputClass}
            id={`${id}-invoice`}
            inputMode="decimal"
            maxLength={16}
            onChange={(event) => {
              setInvoiceInput(event.target.value);
              touch();
            }}
            spellCheck={false}
            type="text"
            value={invoiceInput}
          />
          {invoiceError ? (
            <p className={linkErrorClass} id={`${id}-invoice-error`} role="alert">
              {labels.errors.amount}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
            <button className={textButtonClass} disabled={!breakEven} onClick={() => breakEven && setInvoice(breakEven.invoice)} type="button">
              {labels.breakEvenButton}
            </button>
            <button className={textButtonClass} disabled={!employment} onClick={() => employment && setInvoice(employerCostInvoice(employment))} type="button">
              {labels.employerCostButton}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-8 max-[820px]:grid-cols-1">
        <fieldset className="m-0 grid min-w-0 content-start gap-4 border-0 p-0">
          <legend className="mb-1 p-0 font-display text-[1.2rem] font-medium text-[var(--color-ink)]">{labels.employmentTitle}</legend>
          <div>
            <p className={legendClass}>{labels.kupLegend}</p>
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
          <div className="grid gap-0.5">
            <Check checked={pit2} onChange={(value) => update(setPit2, value)}>
              {labels.pit2}
            </Check>
            <Check checked={under26} onChange={(value) => update(setUnder26, value)}>
              {labels.under26}
            </Check>
            <Check checked={ppk} onChange={(value) => update(setPpk, value)}>
              {labels.ppk}
            </Check>
          </div>
        </fieldset>

        <fieldset className="m-0 grid min-w-0 content-start gap-4 border-0 p-0">
          <legend className="mb-1 p-0 font-display text-[1.2rem] font-medium text-[var(--color-ink)]">{labels.b2bTitle}</legend>
          <div>
            <p className={legendClass}>{labels.formLegend}</p>
            <Segments
              disabled={(key) => unavailableText(formUnavailable(key, options, rates))}
              label={labels.formLegend}
              onChange={(value) => update(setForm, value)}
              options={taxForms.map((key) => ({ key, label: labels.forms[key] }))}
              value={effective.form}
            />
          </div>
          {effective.form === "ryczalt" ? (
            <div className="grid max-w-[24rem] gap-2">
              <label className="text-[0.95rem] font-semibold text-[var(--color-ink)]" htmlFor={`${id}-rate`}>
                {labels.ryczaltRateLabel}
              </label>
              <select
                className={`${smallInputClass} px-2`}
                id={`${id}-rate`}
                onChange={(event) => {
                  setRyczaltBp(Number(event.target.value));
                  touch();
                }}
                value={ryczaltBp}
              >
                {rates.ryczalt.ratesBp.map((bp) => (
                  <option key={bp} value={bp}>
                    {labels.ryczaltRates[String(bp)]}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <div>
            <p className={legendClass}>{labels.zusLegend}</p>
            <Segments
              disabled={(key) => unavailableText(zusUnavailable(key, options))}
              label={labels.zusLegend}
              onChange={(value) => update(setZus, value)}
              options={zusKeys.map((key) => ({ key, label: labels.zus[key] }))}
              value={effective.zus}
            />
          </div>
          {effective.zus !== "start" ? (
            <Check checked={sickness} onChange={(value) => update(setSickness, value)}>
              {labels.sickness}
            </Check>
          ) : null}
          <div className="grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
            <div className="grid content-start gap-2">
              <label className="text-[0.95rem] font-semibold text-[var(--color-ink)]" htmlFor={`${id}-costs`}>
                {labels.costsLabel}
              </label>
              <input
                aria-invalid={costsError || undefined}
                autoComplete="off"
                className={smallInputClass}
                id={`${id}-costs`}
                inputMode="decimal"
                maxLength={16}
                onChange={(event) => {
                  setCostsInput(event.target.value);
                  touch();
                }}
                type="text"
                value={costsInput}
              />
              {costsError ? (
                <p className={linkErrorClass} role="alert">
                  {labels.errors.amount}
                </p>
              ) : null}
            </div>
            <div className="grid content-start gap-2">
              <label className="text-[0.95rem] font-semibold text-[var(--color-ink)]" htmlFor={`${id}-days`}>
                {labels.daysOffLabel}
              </label>
              <input
                aria-describedby={`${id}-days-hint`}
                aria-invalid={daysError || undefined}
                autoComplete="off"
                className={smallInputClass}
                id={`${id}-days`}
                inputMode="numeric"
                maxLength={3}
                onChange={(event) => {
                  setDaysInput(event.target.value);
                  touch();
                }}
                type="text"
                value={daysInput}
              />
              {daysError ? (
                <p className={linkErrorClass} role="alert">
                  {fill(labels.errors.days, { max: String(rates.billableDays) })}
                </p>
              ) : (
                <p className="m-0 text-[0.88rem] text-[var(--color-muted)]" id={`${id}-days-hint`}>
                  {labels.daysOffHint}
                </p>
              )}
            </div>
          </div>
          <Check checked={formerEmployer} onChange={(value) => update(setFormerEmployer, value)}>
            {labels.formerEmployer}
          </Check>
          {formerEmployer ? <p className="m-0 max-w-[36rem] text-[0.95rem] text-[var(--color-muted)]">{labels.formerEmployerNote}</p> : null}
        </fieldset>
      </div>

      {employment || b2b ? (
        <div aria-live="polite" className="grid gap-6 border-t border-[var(--color-border-light)] pt-7">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[0.95rem] font-semibold text-[var(--color-ink)]">{labels.periodLabel}</span>
            <Segments
              label={labels.periodLabel}
              onChange={setPeriod}
              options={[
                { key: "month", label: labels.period.month },
                { key: "year", label: labels.period.year },
              ]}
              value={period}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[30rem] border-collapse text-[1rem] text-[var(--color-ink)]">
              <caption className="sr-only">{labels.resultCaption}</caption>
              <thead>
                <tr>
                  <th className={`${thClass} pl-0`} scope="col">
                    <span className="sr-only">{labels.resultCaption}</span>
                  </th>
                  <th className={`${thClass} text-right`} scope="col">
                    {labels.employmentTitle}
                  </th>
                  <th className={`${thClass} pr-0 text-right`} scope="col">
                    {labels.b2bTitle}
                  </th>
                </tr>
              </thead>
              <tbody>
                {resultRows.map((row) => (
                  <tr key={row.key}>
                    <th className={`${tdClass} pl-0 text-left ${row.strong ? "font-semibold" : "font-normal"}`} scope="row">
                      {labels.rows[row.key]}
                    </th>
                    {[row.employment, row.b2b].map((value, index) => (
                      <td
                        className={`${tdClass} whitespace-nowrap text-right ${index === 1 ? "pr-0" : ""} ${row.strong ? "font-display text-[1.35rem] font-medium tracking-[-0.01em]" : ""}`}
                        key={index}
                      >
                        {value === null ? "-" : money(perPeriod(value))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid max-w-[47rem] gap-2.5">
            {differenceText ? <p className="m-0 font-display text-[1.2rem] font-medium leading-[1.4] text-[var(--color-ink)]">{differenceText}</p> : null}
            {employment ? (
              breakEven ? (
                <p className="m-0 text-[0.98rem] text-[var(--color-muted)]">
                  {fill(labels.breakEven, { form: formLabel(effective.form), amount: withCurrency(breakEven.invoice) })}{" "}
                  <button className={textButtonClass} onClick={() => setInvoice(breakEven.invoice)} type="button">
                    {labels.insert}
                  </button>
                </p>
              ) : !costsError && !daysError ? (
                <p className="m-0 text-[0.98rem] text-[var(--color-muted)]">{labels.breakEvenNone}</p>
              ) : null
            ) : null}
            {breakEven?.tierEdge != null && tierEdgeHealth !== undefined ? (
              <p className="m-0 text-[0.98rem] text-[var(--color-muted)]">{fill(labels.tierEdge, { edge: withCurrency(breakEven.tierEdge), health: withCurrency(tierEdgeHealth) })}</p>
            ) : null}
          </div>

          {allForms ? (
            <div className="grid gap-3">
              <h3 className="m-0 font-display text-[1.15rem] font-medium text-[var(--color-ink)]">{labels.formsTitle}</h3>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[34rem] border-collapse text-[0.98rem] text-[var(--color-ink)]">
                  <thead>
                    <tr>
                      <th className={`${thClass} pl-0`} scope="col">{labels.formsColumns.form}</th>
                      <th className={`${thClass} text-right`} scope="col">{labels.formsColumns.netMonth}</th>
                      <th className={`${thClass} text-right`} scope="col">{labels.formsColumns.netYear}</th>
                      <th className={`${thClass} text-right`} scope="col">{labels.formsColumns.health}</th>
                      <th className={`${thClass} pr-0 text-right`} scope="col">{labels.formsColumns.tax}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allForms.map((row) => (
                      <tr key={row.form}>
                        <th className={`${tdClass} pl-0 text-left ${row.form === effective.form ? "font-semibold" : "font-normal"}`} scope="row">
                          {formLabel(row.form)}
                        </th>
                        {row.year ? (
                          <>
                            <td className={`${tdClass} whitespace-nowrap text-right`}>{money(Math.round(row.year.net / 12))}</td>
                            <td className={`${tdClass} whitespace-nowrap text-right`}>{money(row.year.net)}</td>
                            <td className={`${tdClass} whitespace-nowrap text-right`}>{money(row.year.healthMonthly)}</td>
                            <td className={`${tdClass} whitespace-nowrap pr-0 text-right`}>{money(row.year.tax)}</td>
                          </>
                        ) : (
                          <td className={`${tdClass} pr-0 text-right text-[var(--color-muted)]`} colSpan={4}>
                            {unavailableText(row.unavailable)}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}

          {employment ? (
            <details className="border-b border-[var(--color-border-light)] pb-4">
              <summary className="cursor-pointer font-display text-[1.15rem] font-medium text-[var(--color-ink)]">{labels.monthsTitle}</summary>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[44rem] border-collapse text-[0.95rem] text-[var(--color-ink)]">
                  <thead>
                    <tr>
                      <th className={`${thClass} pl-0`} scope="col">{labels.monthsColumns.month}</th>
                      <th className={`${thClass} text-right`} scope="col">{labels.monthsColumns.social}</th>
                      <th className={`${thClass} text-right`} scope="col">{labels.monthsColumns.health}</th>
                      <th className={`${thClass} text-right`} scope="col">{labels.monthsColumns.advance}</th>
                      {ppk ? <th className={`${thClass} text-right`} scope="col">{labels.monthsColumns.ppk}</th> : null}
                      <th className={`${thClass} text-right`} scope="col">{labels.monthsColumns.net}</th>
                      <th className={`${thClass} text-right`} scope="col">{labels.monthsColumns.cost}</th>
                      <th className={`${thClass} pr-0`} scope="col">{labels.monthsColumns.note}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employment.months.map((row) => {
                      const notes = [row.capStarts ? labels.notes.cap : null, row.bracketStarts ? labels.notes.bracket : null, row.youthLimitEnds ? labels.notes.youth : null].filter(Boolean);
                      return (
                        <tr key={row.month}>
                          <th className={`${tdClass} pl-0 text-left font-normal`} scope="row">{labels.monthNames[row.month - 1]}</th>
                          <td className={`${tdClass} whitespace-nowrap text-right`}>{money(row.social)}</td>
                          <td className={`${tdClass} whitespace-nowrap text-right`}>{money(row.health)}</td>
                          <td className={`${tdClass} whitespace-nowrap text-right`}>{money(row.advance)}</td>
                          {ppk ? <td className={`${tdClass} whitespace-nowrap text-right`}>{money(row.ppkEmployee)}</td> : null}
                          <td className={`${tdClass} whitespace-nowrap text-right font-semibold`}>{money(row.net)}</td>
                          <td className={`${tdClass} whitespace-nowrap text-right`}>{money(row.employerCost)}</td>
                          <td className={`${tdClass} pr-0 text-[var(--color-muted)]`}>{notes.join(", ")}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </details>
          ) : null}

          <div>
            <button className="action action-ink cursor-pointer border-0" onClick={copy} type="button">
              <svg aria-hidden="true" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <rect height="12" rx="2" width="12" x="9" y="9" />
                <path d="M5 15V5a2 2 0 0 1 2-2h10" />
              </svg>
              <span>{copied ? labels.copied : labels.copySummary}</span>
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-1.5">
        <p className="m-0 max-w-[47rem] text-[0.92rem] text-[var(--color-muted)]">{labels.disclaimer}</p>
        <p className="m-0 text-[0.92rem] text-[var(--color-muted)]">{labels.privacyNote}</p>
      </div>
    </div>
  );
}
