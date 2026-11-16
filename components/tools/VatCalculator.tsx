"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import type { VatCalculatorLabels } from "@/content/types";
import { centsToPolishWords } from "@/lib/tools/amount-in-words";
import {
  LARGE_PAYMENT_CENTS,
  formatCents,
  hasNoVat,
  invoiceTotals,
  parseCents,
  quickConvert,
  rateKeys,
  type InvoiceRow,
  type PriceBasis,
  type QuickField,
  type RateKey,
  type VatMethod,
} from "@/lib/tools/vat";
import { PrivacyNote } from "@/components/tools/PrivacyNote";
import { CopyButton } from "@/components/tools/CopyButton";

type Gtag = (command: "event", name: string, params: Record<string, string>) => void;

/** Counts use of the tool and nothing else: never an amount. */
function trackToolEvent(name: string) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", name, { tool: "vat_calculator" });
}

type Row = InvoiceRow & { id: number; name: string };

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);

const segmentOn = "bg-[var(--color-ink)] text-[var(--color-mist)]";
const segmentOff = "bg-transparent text-[var(--color-ink)]";
const amountInputClass =
  "h-[72px] w-full rounded-[14px] border bg-[var(--color-paper)] px-5 font-display text-[1.9rem] font-medium tracking-[-0.02em] text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--color-blue)] disabled:bg-[#e9edf0] disabled:text-[var(--color-muted)] max-[720px]:text-[1.6rem]";
const cellInputClass =
  "h-11 w-full rounded-[10px] border border-[rgba(11,17,22,0.14)] bg-[var(--color-paper)] px-3 text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--color-blue)]";
const thClass = "border-b border-[rgba(11,17,22,0.16)] px-2 py-2 text-left text-[0.88rem] font-semibold text-[var(--color-muted)]";
const tdClass = "border-b border-[rgba(11,17,22,0.08)] px-2 py-2";

export function VatCalculator({ labels, whiteListHref }: { labels: VatCalculatorLabels; whiteListHref: string }) {
  const id = useId();
  const sep = labels.decimalSeparator;
  const money = (cents: number) => formatCents(cents, sep);

  const [mode, setMode] = useState<"quick" | "invoice">("quick");
  const [copied, setCopied] = useState<string | null>(null);
  const copiedTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(copiedTimer.current), []);

  /* Quick conversion: the field last typed in drives the other two. */
  const [rate, setRate] = useState<RateKey>("23");
  const [field, setField] = useState<QuickField>("net");
  const [input, setInput] = useState(labels.defaultAmount);
  const quick = quickConvert(field, parseCents(input), rate);
  const noVat = hasNoVat(rate);

  const fieldValue = (name: QuickField, cents: number | undefined) => {
    if (name === field) return input;
    if (name === "vat" && noVat) return labels.notApplicable;
    return quick.kind === "ok" && cents !== undefined ? money(cents) : "";
  };

  /* Invoice mode. */
  const nextId = useRef(labels.defaultRows.length + 1);
  const [rows, setRows] = useState<Row[]>(() =>
    labels.defaultRows.map((row, index) => ({ id: index + 1, name: row.name, quantity: "1", price: row.price, rate: "23" })),
  );
  const [basis, setBasis] = useState<PriceBasis>("net");
  const [method, setMethod] = useState<VatMethod>("sum");
  const invoice = invoiceTotals(rows, basis, method);
  const hasInvoiceAmounts = invoice.lines.some((line) => line.valid);
  const difference = invoice.otherMethodVat - invoice.total.vat;

  const updateRow = (rowId: number, patch: Partial<Row>) => {
    setRows((current) => current.map((row) => (row.id === rowId ? { ...row, ...patch } : row)));
    setCopied(null);
  };

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopied(null), 1800);
      trackToolEvent("tool_copy");
    } catch {
      /* Clipboard refused: the amounts stay on screen to copy by hand. */
    }
  };

  const largePayment = (
    <p className="m-0 max-w-[47rem] text-[0.98rem] text-[var(--color-muted)]">
      {labels.largePayment.before}{" "}
      <Link className="text-[var(--color-blue)] underline underline-offset-4 hover:text-[var(--color-blue-deep)]" href={whiteListHref}>
        {labels.largePayment.link}
      </Link>
      {labels.largePayment.after}
    </p>
  );


  return (
    <div className="grid gap-10">
      <div aria-label={labels.modeLabel} className="inline-flex w-fit flex-wrap rounded-[24px] border border-[var(--color-border-light)] bg-[var(--color-paper)] p-1" role="group">
        {(["quick", "invoice"] as const).map((key) => (
          <button
            aria-pressed={mode === key}
            className={`min-h-11 cursor-pointer rounded-full border-0 px-5 font-display text-[0.95rem] font-medium transition-colors ${mode === key ? segmentOn : segmentOff}`}
            key={key}
            onClick={() => {
              setMode(key);
              setCopied(null);
            }}
            type="button"
          >
            {labels.modes[key]}
          </button>
        ))}
      </div>

      {mode === "quick" ? (
        <div className="grid gap-7">
          <fieldset className="m-0 min-w-0 border-0 p-0">
            <legend className="mb-2.5 p-0 text-[0.95rem] font-semibold text-[var(--color-ink)]">{labels.rateLegend}</legend>
            <div className="flex flex-wrap gap-1.5">
              {rateKeys.map((key) => (
                <button
                  aria-pressed={rate === key}
                  className={`h-12 min-w-16 cursor-pointer rounded-full border px-4 font-display text-[0.95rem] font-medium transition-colors ${
                    rate === key
                      ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-mist)]"
                      : "border-[var(--color-border-light)] bg-[var(--color-paper)] text-[var(--color-ink)] hover:border-[rgba(11,17,22,0.32)]"
                  }`}
                  key={key}
                  onClick={() => {
                    setRate(key);
                    setCopied(null);
                    /* VAT cannot drive the others at a rate without VAT: keep the net amount instead. */
                    if (field === "vat" && ratePercentIsZero(key)) {
                      setField("net");
                      setInput(quick.kind === "ok" ? money(quick.net) : "");
                    }
                  }}
                  type="button"
                >
                  {labels.rates[key]}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="grid grid-cols-3 gap-4 max-[820px]:grid-cols-1">
            {(
              [
                { name: "net", label: labels.net, cents: quick.kind === "ok" ? quick.net : undefined },
                { name: "vat", label: noVat ? labels.vat : `${labels.vat} ${labels.rates[rate]}`, cents: quick.kind === "ok" ? quick.vat : undefined },
                { name: "gross", label: labels.gross, cents: quick.kind === "ok" ? quick.gross : undefined },
              ] as const
            ).map((item) => (
              <div className="grid gap-2" key={item.name}>
                <label className="text-[0.95rem] font-semibold text-[var(--color-ink)]" htmlFor={`${id}-${item.name}`}>
                  {item.label}
                </label>
                <input
                  aria-describedby={`${id}-hint`}
                  autoComplete="off"
                  className={`${amountInputClass} ${item.name === field ? "border-[var(--color-ink)]" : "border-[rgba(11,17,22,0.16)]"}`}
                  disabled={item.name === "vat" && noVat}
                  id={`${id}-${item.name}`}
                  inputMode="decimal"
                  maxLength={24}
                  onChange={(event) => {
                    setField(item.name);
                    setInput(event.target.value);
                    setCopied(null);
                  }}
                  spellCheck={false}
                  type="text"
                  value={fieldValue(item.name, item.cents)}
                />
              </div>
            ))}
          </div>
          <p className="-mt-3 m-0 text-[0.92rem] text-[var(--color-muted)]" id={`${id}-hint`}>
            {labels.hint}
          </p>

          <div aria-live="polite" className="grid gap-3.5 border-t border-[var(--color-border-light)] pt-6">
            {quick.kind === "error" ? (
              <p className="m-0 text-[#a3360f]" role="alert">
                {labels.errors[quick.reason]}
              </p>
            ) : null}
            {quick.kind === "ok" ? (
              <>
                <p className="m-0 text-[0.92rem] text-[var(--color-muted)]">{labels.wordsLabel}</p>
                <p className="m-0 font-display text-[1.35rem] font-medium leading-[1.4] tracking-[-0.01em] text-[var(--color-ink)]" lang="pl">
                  {centsToPolishWords(quick.gross)}
                </p>
                {quick.nearest ? (
                  <p className="m-0 max-w-[47rem] text-[0.98rem] text-[var(--color-muted)]">
                    {fill(labels.nearest, {
                      rate: labels.rates[rate],
                      gross: money(quick.gross),
                      belowNet: money(quick.nearest.below.net),
                      belowGross: money(quick.nearest.below.gross),
                      aboveNet: money(quick.nearest.above.net),
                      aboveGross: money(quick.nearest.above.gross),
                    })}
                  </p>
                ) : null}
                <div className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <CopyButton copied={copied === "quick"} copiedLabel={labels.copied} label={labels.copyAmounts} onClick={() =>
                      copy(
                        "quick",
                        `${labels.net} ${money(quick.net)} ${labels.currency}, ${labels.vat} ${noVat ? labels.notApplicable : `${money(quick.vat)} ${labels.currency}`}, ${labels.gross} ${money(quick.gross)} ${labels.currency}`,
                      )
                    } />
                  <span className="text-[0.92rem] text-[var(--color-muted)]">{noVat ? labels.formulaNoVat : fill(labels.formula, { rate: labels.rates[rate] })}</span>
                </div>
                {quick.gross > LARGE_PAYMENT_CENTS ? largePayment : null}
              </>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[0.95rem] font-semibold text-[var(--color-ink)]">{labels.priceBasisLabel}</span>
            <div aria-label={labels.priceBasisLabel} className="inline-flex rounded-full border border-[var(--color-border-light)] bg-[var(--color-paper)] p-[3px]" role="group">
              {(["net", "gross"] as const).map((key) => (
                <button
                  aria-pressed={basis === key}
                  className={`min-h-10 cursor-pointer rounded-full border-0 px-4 text-[0.95rem] transition-colors ${basis === key ? segmentOn : segmentOff}`}
                  key={key}
                  onClick={() => {
                    setBasis(key);
                    setCopied(null);
                  }}
                  type="button"
                >
                  {labels.priceBasis[key]}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-[0.98rem] text-[var(--color-ink)]">
              <thead>
                <tr>
                  <th className={`${thClass} pl-0`} scope="col">{labels.columns.name}</th>
                  <th className={`${thClass} w-[90px]`} scope="col">{labels.columns.quantity}</th>
                  <th className={`${thClass} w-[140px]`} scope="col">{basis === "gross" ? labels.columns.priceGross : labels.columns.priceNet}</th>
                  <th className={`${thClass} w-[100px]`} scope="col">{labels.columns.rate}</th>
                  <th className={`${thClass} w-[120px] text-right`} scope="col">{labels.columns.net}</th>
                  <th className={`${thClass} w-[100px] text-right`} scope="col">{labels.columns.vat}</th>
                  <th className={`${thClass} w-[120px] text-right`} scope="col">{labels.columns.gross}</th>
                  <th className={`${thClass} w-12`} scope="col"><span className="sr-only">{labels.removeRow}</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const line = invoice.lines[index];
                  const n = String(index + 1);
                  const cell = (column: string) => fill(labels.cellLabel, { column, n });
                  return (
                    <tr key={row.id}>
                      <td className={`${tdClass} pl-0`}>
                        <input aria-label={cell(labels.columns.name)} className={cellInputClass} onChange={(event) => updateRow(row.id, { name: event.target.value })} type="text" value={row.name} />
                      </td>
                      <td className={tdClass}>
                        <input aria-label={cell(labels.columns.quantity)} className={cellInputClass} inputMode="decimal" onChange={(event) => updateRow(row.id, { quantity: event.target.value })} type="text" value={row.quantity} />
                      </td>
                      <td className={tdClass}>
                        <input
                          aria-label={cell(basis === "gross" ? labels.columns.priceGross : labels.columns.priceNet)}
                          className={cellInputClass}
                          inputMode="decimal"
                          onChange={(event) => updateRow(row.id, { price: event.target.value })}
                          type="text"
                          value={row.price}
                        />
                      </td>
                      <td className={tdClass}>
                        <select aria-label={cell(labels.columns.rate)} className={`${cellInputClass} px-2`} onChange={(event) => updateRow(row.id, { rate: event.target.value as RateKey })} value={row.rate}>
                          {rateKeys.map((key) => (
                            <option key={key} value={key}>
                              {labels.rates[key]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className={`${tdClass} whitespace-nowrap text-right`}>{line.valid ? money(line.net) : "-"}</td>
                      <td className={`${tdClass} whitespace-nowrap text-right text-[var(--color-muted)]`}>{line.valid && !hasNoVat(row.rate) ? money(line.vat) : "-"}</td>
                      <td className={`${tdClass} whitespace-nowrap text-right`}>{line.valid ? money(line.gross) : "-"}</td>
                      <td className={`${tdClass} pr-0 text-right`}>
                        <button
                          aria-label={`${labels.removeRow} ${n}`}
                          className="inline-grid h-10 w-10 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-[var(--color-muted)] hover:bg-[rgba(11,17,22,0.06)] hover:text-[var(--color-ink)]"
                          onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))}
                          type="button"
                        >
                          <svg aria-hidden="true" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M6 6l12 12M18 6 6 18" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <button
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-[rgba(11,17,22,0.2)] bg-transparent px-[18px] font-display text-[0.95rem] font-medium text-[var(--color-ink)] hover:border-[rgba(11,17,22,0.4)]"
              onClick={() => {
                nextId.current += 1;
                setRows((current) => [...current, { id: nextId.current, name: "", quantity: "1", price: "", rate: "23" }]);
              }}
              type="button"
            >
              <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 5v14M5 12h14" />
              </svg>
              {labels.addRow}
            </button>
          </div>

          {hasInvoiceAmounts ? (
            <div aria-live="polite" className="mt-3 flex flex-wrap items-start gap-x-14 gap-y-8 border-t border-[var(--color-border-light)] pt-7">
              <div className="grid min-w-0 flex-[1.2_1_26rem] gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[0.95rem] font-semibold text-[var(--color-ink)]">{labels.methodLabel}</span>
                  <div aria-label={labels.methodLabel} className="inline-flex flex-wrap rounded-[22px] border border-[var(--color-border-light)] bg-[var(--color-paper)] p-[3px]" role="group">
                    {(["sum", "line"] as const).map((key) => (
                      <button
                        aria-pressed={method === key}
                        className={`min-h-10 cursor-pointer rounded-full border-0 px-4 text-[0.95rem] transition-colors ${method === key ? segmentOn : segmentOff}`}
                        key={key}
                        onClick={() => {
                          setMethod(key);
                          setCopied(null);
                        }}
                        type="button"
                      >
                        {key === "line" ? labels.methods.line : basis === "gross" ? labels.methods.sumGross : labels.methods.sumNet}
                      </button>
                    ))}
                  </div>
                </div>
                <table className="w-full border-collapse text-[0.98rem] text-[var(--color-ink)]">
                  <caption className="sr-only">{labels.summaryCaption}</caption>
                  <thead>
                    <tr>
                      <th className={`${thClass} pl-0`} scope="col">{labels.columns.rate}</th>
                      <th className={`${thClass} text-right`} scope="col">{labels.columns.net}</th>
                      <th className={`${thClass} text-right`} scope="col">{labels.columns.vat}</th>
                      <th className={`${thClass} pr-0 text-right`} scope="col">{labels.columns.gross}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.rates.map((row) => (
                      <tr key={row.rate}>
                        <th className={`${tdClass} py-3 pl-0 text-left font-semibold`} scope="row">{labels.rates[row.rate]}</th>
                        <td className={`${tdClass} py-3 whitespace-nowrap text-right`}>{money(row.net)}</td>
                        <td className={`${tdClass} py-3 whitespace-nowrap text-right`}>{hasNoVat(row.rate) ? "-" : money(row.vat)}</td>
                        <td className={`${tdClass} py-3 pr-0 whitespace-nowrap text-right`}>{money(row.gross)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {difference !== 0 ? (
                  <p className="m-0 text-[0.98rem] text-[var(--color-muted)]">
                    {fill(labels.difference, {
                      other: method === "sum" ? labels.otherMethod.line : labels.otherMethod.sum,
                      vat: `${money(invoice.otherMethodVat)} ${labels.currency}`,
                      diff: `${money(Math.abs(difference))} ${labels.currency}`,
                      direction: difference > 0 ? labels.more : labels.less,
                    })}
                  </p>
                ) : null}
              </div>

              <div className="grid min-w-0 flex-[1_1_18rem] gap-1.5">
                <p className="m-0 text-[0.95rem] text-[var(--color-muted)]">
                  {fill(labels.totals, { net: `${money(invoice.total.net)} ${labels.currency}`, vat: `${money(invoice.total.vat)} ${labels.currency}` })}
                </p>
                <p className="m-0 text-[0.95rem] text-[var(--color-muted)]">{labels.amountDue}</p>
                <p className="m-0 font-display text-[clamp(2rem,3.6vw,2.8rem)] font-medium leading-[1.1] tracking-[-0.03em] text-[var(--color-ink)]">
                  {money(invoice.total.gross)} {labels.currency}
                </p>
                <p className="m-0 mt-2 text-[0.98rem] text-[var(--color-muted)]" lang="pl">
                  {labels.wordsLabel}: {centsToPolishWords(invoice.total.gross)}
                </p>
                <div className="mt-3.5">
                  <CopyButton copied={copied === "invoice"} copiedLabel={labels.copied} label={labels.copySummary} onClick={() =>
                      copy(
                        "invoice",
                        [
                          [labels.copyText.rate, labels.columns.net, labels.columns.vat, labels.columns.gross].join("\t"),
                          ...invoice.rates.map((row) => [labels.rates[row.rate], money(row.net), hasNoVat(row.rate) ? "-" : money(row.vat), money(row.gross)].join("\t")),
                          [labels.copyText.total, money(invoice.total.net), money(invoice.total.vat), money(invoice.total.gross)].join("\t"),
                        ].join("\n"),
                      )
                    } />
                </div>
              </div>
              {invoice.total.gross > LARGE_PAYMENT_CENTS ? <div className="basis-full">{largePayment}</div> : null}
            </div>
          ) : null}
        </div>
      )}

      <PrivacyNote>{labels.privacyNote}</PrivacyNote>
    </div>
  );
}

function ratePercentIsZero(rate: RateKey) {
  return rate === "0" || rate === "zw" || rate === "np";
}
