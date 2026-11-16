"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import type { NbpRateLabels } from "@/content/types";
import { isIsoDate, todayInPoland, type DayOffReason } from "@/lib/tools/business-days";
import {
  NBP_FIRST_DATE,
  NbpError,
  fetchSeries,
  formatMid,
  invoiceNote,
  rateWindow,
  resolveRate,
  toPln,
  type NbpCurrencyOption,
  type NbpSeries,
} from "@/lib/tools/nbp";
import { formatCents, hasNoVat, parseCents, rateKeys, type RateKey } from "@/lib/tools/vat";
import { PrivacyNote } from "@/components/tools/PrivacyNote";
import { CopyButton } from "@/components/tools/CopyButton";

type Gtag = (command: "event", name: string, params: Record<string, string>) => void;

/** Counts use of the tool and nothing else: never the currency, the date or an amount. */
function trackToolEvent(name: string) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", name, { tool: "nbp_rate" });
}

type Fetched = { key: string; series: NbpSeries } | { key: string; error: NbpError["reason"] };

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);

/* "Today" exists only in the browser, so the static HTML is the same for everyone. */
const noSubscription = () => () => {};
const readToday = () => todayInPoland();
const serverToday = () => "";

const firstDate = "2002-01-03";
const utc = (iso: string) => new Date(`${iso}T12:00:00Z`);

const segmentOn = "bg-[var(--color-ink)] text-[var(--color-mist)]";
const segmentOff = "bg-transparent text-[var(--color-ink)]";
const labelClass = "text-[0.95rem] font-semibold text-[var(--color-ink)]";
const fieldClass =
  "h-14 w-full rounded-[12px] border border-[rgba(11,17,22,0.16)] bg-[var(--color-paper)] px-4 text-[1.1rem] text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--color-blue)] aria-[invalid=true]:border-[#a3360f]";
const thClass = "border-b border-[rgba(11,17,22,0.16)] px-2 py-2 text-left text-[0.88rem] font-semibold text-[var(--color-muted)]";
const tdClass = "border-b border-[rgba(11,17,22,0.08)] px-2 py-3";

/** Merges a Saturday and the Sunday after it into one "weekend" entry. */
function groupDaysOff(days: DayOffReason[]) {
  const groups: Array<{ from: string; to: string; reason: keyof NbpRateLabels["dayOffNames"] }> = [];
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

export function NbpRate({
  currencies,
  labels,
  locale,
  vatCalculatorHref,
}: {
  currencies: NbpCurrencyOption[];
  labels: NbpRateLabels;
  locale: "pl" | "en";
  vatCalculatorHref: string;
}) {
  const id = useId();
  const sep = labels.decimalSeparator;
  const money = (cents: number) => formatCents(cents, sep);
  const intlLocale = locale === "pl" ? "pl-PL" : "en-GB";
  const longDate = (iso: string) => new Intl.DateTimeFormat(intlLocale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(utc(iso));
  const dayMonth = new Intl.DateTimeFormat(intlLocale, { day: "numeric", month: "long", timeZone: "UTC" });
  const dateWithWeekday = (iso: string) =>
    fill(labels.dateWithWeekday, {
      date: longDate(iso),
      weekday: new Intl.DateTimeFormat(intlLocale, { weekday: "long", timeZone: "UTC" }).format(utc(iso)),
    });

  const today = useSyncExternalStore(noSubscription, readToday, serverToday);
  const [code, setCode] = useState(currencies[0].code);
  /* Null until the visitor picks a date: then the date is today. */
  const [picked, setPicked] = useState<string | null>(null);
  const date = picked ?? today;
  const currency = currencies.find((item) => item.code === code) ?? currencies[0];
  const table = currency.table;

  const dateValid = isIsoDate(date) && date > NBP_FIRST_DATE;
  const dateError = date !== "" && !dateValid;
  const window_ = today && dateValid ? rateWindow(date, today) : null;
  const start = window_?.start;
  const end = window_?.end;
  const key = start && end ? `${table}/${code}/${start}/${end}` : null;

  const [fetched, setFetched] = useState<Fetched | null>(null);
  /* Set by the visitor's own changes, so the first automatic lookup is not counted. */
  const userAction = useRef(false);

  useEffect(() => {
    if (!start || !end) return;
    const requestKey = `${table}/${code}/${start}/${end}`;
    const controller = new AbortController();
    fetchSeries(table, code, start, end, controller.signal)
      .then((series) => {
        setFetched({ key: requestKey, series });
        if (userAction.current) {
          userAction.current = false;
          trackToolEvent("tool_used");
        }
      })
      .catch((caught: unknown) => {
        if ((caught as Error).name === "AbortError") return;
        setFetched({ key: requestKey, error: caught instanceof NbpError ? caught.reason : "network" });
      });
    return () => controller.abort();
  }, [table, code, start, end]);

  const current = fetched && fetched.key === key ? fetched : null;
  const loading = key !== null && current === null;
  const lookup = current && "series" in current ? resolveRate(current.series, date, today) : null;
  const failure = current && "error" in current ? current.error : null;

  /* Amount conversion: local only, no request. */
  const [amount, setAmount] = useState(labels.defaultAmount);
  const [basis, setBasis] = useState<"net" | "gross">("net");
  const [rate, setRate] = useState<RateKey>("23");
  const cents = parseCents(amount);
  const amountError = cents !== null && Number.isNaN(cents);
  const pln = lookup?.kind === "ok" && cents !== null && !amountError ? toPln(cents, basis, rate, lookup.rate.mid) : null;
  const noVat = hasNoVat(rate);

  const [copied, setCopied] = useState<string | null>(null);
  const copiedTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(copiedTimer.current), []);

  const copy = async (copyKey: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(copyKey);
      window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopied(null), 1800);
      trackToolEvent("tool_copy");
    } catch {
      /* Clipboard refused: the note stays on screen to copy by hand. */
    }
  };


  const ok = lookup?.kind === "ok" ? lookup : null;
  const note = ok ? invoiceNote(locale, code, ok.rate) : "";
  const vatLabel = `${labels.vat} ${labels.rates[rate]}`;

  return (
    <div className="grid gap-10">
      <div className="grid grid-cols-2 items-start gap-4 max-[720px]:grid-cols-1">
        <div className="grid gap-2">
          <label className={labelClass} htmlFor={`${id}-currency`}>
            {labels.currencyLabel}
          </label>
          <select
            className={`${fieldClass} px-3`}
            id={`${id}-currency`}
            onChange={(event) => {
              setCode(event.target.value);
              setCopied(null);
              userAction.current = true;
            }}
            value={code}
          >
            {(["A", "B"] as const).map((group) => (
              <optgroup key={group} label={labels.tableGroups[group]}>
                {currencies
                  .filter((item) => item.table === group)
                  .map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.code} – {item.name}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <label className={labelClass} htmlFor={`${id}-date`}>
            {labels.dateLabel}
          </label>
          <input
            aria-describedby={`${id}-date-hint`}
            aria-invalid={dateError}
            className={fieldClass}
            id={`${id}-date`}
            min={firstDate}
            onChange={(event) => {
              setPicked(event.target.value);
              setCopied(null);
              userAction.current = true;
            }}
            type="date"
            value={date}
          />
          {dateError ? (
            <p className="m-0 text-[0.92rem] text-[#a3360f]" role="alert">
              {labels.errors.date}
            </p>
          ) : null}
        </div>
        <p className="col-span-full -mt-1 m-0 text-[0.92rem] text-[var(--color-muted)]" id={`${id}-date-hint`}>
          {labels.dateHint}
        </p>
      </div>

      <div aria-busy={loading} aria-live="polite" className="grid gap-3.5 border-t border-[var(--color-border-light)] pt-7 outline-none" tabIndex={-1}>
        {loading ? <p className="m-0 text-[0.98rem] text-[var(--color-muted)]">{labels.loading}</p> : null}
        {failure ? <p className="m-0 text-[0.98rem] text-[var(--color-muted)]">{labels.errors.network}</p> : null}
        {lookup?.kind === "none" ? <p className="m-0 text-[0.98rem] text-[var(--color-muted)]">{labels.errors.none}</p> : null}

        {ok ? (
          <>
            <p className="m-0 font-display text-[clamp(2rem,3.6vw,2.8rem)] font-medium leading-[1.1] tracking-[-0.03em] text-[var(--color-ink)]">
              1 {code} = {formatMid(ok.rate.mid, sep)} {labels.pln}
            </p>
            <p className="m-0 text-[1.02rem] text-[var(--color-ink)]">{fill(labels.source, { date: dateWithWeekday(ok.rate.effectiveDate), no: ok.rate.no })}</p>
            {ok.skipped.length ? (
              <p className="m-0 max-w-[47rem] text-[0.98rem] text-[var(--color-muted)]">
                {fill(labels.reasonIntro, { date: longDate(date) })}{" "}
                {groupDaysOff(ok.skipped)
                  .map((group) =>
                    fill(labels.dayOff, {
                      days: group.from === group.to ? dayMonth.format(utc(group.from)) : dayMonth.formatRange(utc(group.from), utc(group.to)),
                      reason: labels.dayOffNames[group.reason],
                    }),
                  )
                  .join(" ")}
              </p>
            ) : null}
            {table === "B" ? <p className="m-0 max-w-[47rem] text-[0.98rem] text-[var(--color-muted)]">{labels.tableBNote}</p> : null}
            {ok.pending ? (
              <p className="m-0 flex max-w-[47rem] items-start gap-2.5 text-[0.98rem] text-[var(--color-muted)]">
                <svg aria-hidden="true" className="mt-[3px] h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
                <span>
                  {fill(labels.pending[table], { date: longDate(ok.pending.expected) })} {labels.pendingLatest}
                </span>
              </p>
            ) : null}

            <div className="mt-2 grid gap-2">
              <p className={`m-0 ${labelClass}`}>{labels.noteLabel}</p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <p className="m-0 min-w-0 flex-[1_1_24rem] rounded-[12px] border border-[var(--color-border-light)] bg-[var(--color-paper)] px-4 py-3 text-[1rem] text-[var(--color-ink)]">
                  {note}
                </p>
                <CopyButton copied={copied === "note"} copiedLabel={labels.copied} label={labels.copyNote} onClick={() => copy("note", note)} />
              </div>
            </div>
          </>
        ) : null}
      </div>

      <div className="grid gap-6">
        <h2 className="m-0 font-display text-[1.35rem] font-medium leading-[1.3] tracking-[-0.01em] text-[var(--color-ink)]">{labels.amountTitle}</h2>

        <div className="flex flex-wrap items-end gap-x-6 gap-y-5">
          <div className="grid min-w-0 flex-[0_1_20rem] gap-2">
            <label className={labelClass} htmlFor={`${id}-amount`}>
              {fill(labels.amountLabel, { code })}
            </label>
            <div className="relative">
              <input
                aria-invalid={amountError}
                autoComplete="off"
                className={`${fieldClass} pr-16`}
                id={`${id}-amount`}
                inputMode="decimal"
                maxLength={24}
                onChange={(event) => {
                  setAmount(event.target.value);
                  setCopied(null);
                }}
                spellCheck={false}
                type="text"
                value={amount}
              />
              <span aria-hidden="true" className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[1rem] text-[var(--color-muted)]">
                {code}
              </span>
            </div>
          </div>
          <div className="grid gap-2">
            <span className={labelClass} id={`${id}-basis`}>
              {labels.basisLabel}
            </span>
            <div aria-labelledby={`${id}-basis`} className="inline-flex w-fit rounded-full border border-[var(--color-border-light)] bg-[var(--color-paper)] p-[3px]" role="group">
              {(["net", "gross"] as const).map((item) => (
                <button
                  aria-pressed={basis === item}
                  className={`min-h-12 cursor-pointer rounded-full border-0 px-5 text-[0.95rem] transition-colors ${basis === item ? segmentOn : segmentOff}`}
                  key={item}
                  onClick={() => {
                    setBasis(item);
                    setCopied(null);
                  }}
                  type="button"
                >
                  {labels.basis[item]}
                </button>
              ))}
            </div>
          </div>
        </div>
        {amountError ? (
          <p className="-mt-3 m-0 text-[0.92rem] text-[#a3360f]" role="alert">
            {labels.errors.amount}
          </p>
        ) : null}

        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="mb-2.5 p-0 text-[0.95rem] font-semibold text-[var(--color-ink)]">{labels.rateLegend}</legend>
          <div className="flex flex-wrap gap-1.5">
            {rateKeys.map((item) => (
              <button
                aria-pressed={rate === item}
                className={`h-12 min-w-16 cursor-pointer rounded-full border px-4 font-display text-[0.95rem] font-medium transition-colors ${
                  rate === item
                    ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-mist)]"
                    : "border-[var(--color-border-light)] bg-[var(--color-paper)] text-[var(--color-ink)] hover:border-[rgba(11,17,22,0.32)]"
                }`}
                key={item}
                onClick={() => {
                  setRate(item);
                  setCopied(null);
                }}
                type="button"
              >
                {labels.rates[item]}
              </button>
            ))}
          </div>
        </fieldset>

        {pln && ok ? (
          <div aria-live="polite" className="grid gap-4">
            <table className="w-full max-w-[40rem] border-collapse text-[0.98rem] text-[var(--color-ink)]">
              <thead>
                <tr>
                  <th className={`${thClass} pl-0`} scope="col">
                    {labels.columns.item}
                  </th>
                  <th className={`${thClass} text-right`} scope="col">
                    {labels.columns.foreign}
                  </th>
                  <th className={`${thClass} pr-0 text-right`} scope="col">
                    {labels.columns.pln}
                  </th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    { name: labels.net, foreign: pln.foreign.net, local: pln.net },
                    ...(noVat ? [] : [{ name: vatLabel, foreign: pln.foreign.vat ?? 0, local: pln.vat ?? 0 }]),
                    { name: labels.gross, foreign: pln.foreign.gross, local: pln.gross },
                  ] as const
                ).map((row) => (
                  <tr key={row.name}>
                    <th className={`${tdClass} pl-0 text-left font-semibold`} scope="row">
                      {row.name}
                    </th>
                    <td className={`${tdClass} whitespace-nowrap text-right`}>
                      {money(row.foreign)} {code}
                    </td>
                    <td className={`${tdClass} pr-0 whitespace-nowrap text-right font-semibold`}>
                      {money(row.local)} {labels.pln}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {noVat ? null : <p className="m-0 max-w-[47rem] text-[0.92rem] text-[var(--color-muted)]">{labels.vatNote}</p>}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <CopyButton copied={copied === "amounts"} copiedLabel={labels.copied} label={labels.copyAmounts} onClick={() =>
                  copy(
                    "amounts",
                    [
                      `${labels.net}: ${money(pln.foreign.net)} ${code} = ${money(pln.net)} ${labels.pln}`,
                      ...(noVat ? [] : [`${vatLabel}: ${money(pln.foreign.vat ?? 0)} ${code} = ${money(pln.vat ?? 0)} ${labels.pln}`]),
                      `${labels.gross}: ${money(pln.foreign.gross)} ${code} = ${money(pln.gross)} ${labels.pln}`,
                      note,
                    ].join("\n"),
                  )
                } />
              <span className="text-[0.92rem] text-[var(--color-muted)]">
                {labels.vatLink.before}{" "}
                <Link className="text-[var(--color-blue)] underline underline-offset-4 hover:text-[var(--color-blue-deep)]" href={vatCalculatorHref}>
                  {labels.vatLink.link}
                </Link>
                {labels.vatLink.after}
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <PrivacyNote>{labels.privacyNote}</PrivacyNote>
    </div>
  );
}
