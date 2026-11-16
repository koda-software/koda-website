"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import type { WorkingTimeLabels } from "@/content/types";
import { holidayNames, isIsoDate, lastDayOfMonth, todayInPoland } from "@/lib/tools/business-days";
import {
  DAILY_NORMS,
  FRACTION_PRESETS,
  FULL_TIME,
  MAX_RANGE_DAYS,
  PERIOD_LENGTHS,
  YEAR_RANGE,
  dailyNormKeys,
  formatDayMonth,
  formatDecimalHours,
  formatDuration,
  isFullTime,
  normForPeriod,
  normForRange,
  parseFraction,
  periodName,
  plural,
  summaryLine,
  type DailyNorm,
  type Fraction,
  type NormResult,
  type PeriodLength,
  type PeriodResult,
} from "@/lib/tools/working-time";
import { PrivacyNote } from "@/components/tools/PrivacyNote";
import { CopyButton } from "@/components/tools/CopyButton";

type Gtag = (command: "event", name: string, params: Record<string, string>) => void;

/** Counts use of the tool and nothing else: never a date, a fraction or a result. */
function trackToolEvent(name: string) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", name, { tool: "working_time" });
}

const fill = (template: string, values: Record<string, string>) => template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);

/* "Today" exists only in the browser; the static HTML uses the month the page was built in. */
const noSubscription = () => () => {};
const readToday = () => todayInPoland();
const serverToday = () => "";

const years = Array.from({ length: YEAR_RANGE.max - YEAR_RANGE.min + 1 }, (_, index) => YEAR_RANGE.min + index);
const dayCount = (start: string, end: string) => Math.round((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86_400_000) + 1;

const segmentOn = "bg-[var(--color-ink)] text-[var(--color-mist)]";
const segmentOff = "bg-transparent text-[var(--color-ink)]";
const labelClass = "text-[0.95rem] font-semibold text-[var(--color-ink)]";
const fieldClass =
  "h-14 w-full rounded-[12px] border border-[rgba(11,17,22,0.16)] bg-[var(--color-paper)] px-3 text-[1.05rem] text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--color-blue)] aria-[invalid=true]:border-[#a3360f]";
const thClass = "border-b border-[rgba(11,17,22,0.16)] px-2 py-2 text-left text-[0.88rem] font-semibold text-[var(--color-muted)]";
const tdClass = "border-b border-[rgba(11,17,22,0.08)] px-2 py-2.5";
const noteClass = "m-0 max-w-[47rem] text-[0.95rem] text-[var(--color-muted)]";
const errorClass = "m-0 text-[0.92rem] text-[#a3360f]";

function Segments<T extends string | number>({
  labelId,
  options,
  value,
  onChange,
}: {
  labelId: string;
  options: Array<{ key: T; label: string }>;
  value: T;
  onChange: (key: T) => void;
}) {
  return (
    <div aria-labelledby={labelId} className="inline-flex w-fit flex-wrap rounded-[22px] border border-[var(--color-border-light)] bg-[var(--color-paper)] p-[3px]" role="group">
      {options.map((option) => (
        <button
          aria-pressed={value === option.key}
          className={`min-h-12 cursor-pointer rounded-full border-0 px-4 text-[0.95rem] transition-colors ${value === option.key ? segmentOn : segmentOff}`}
          key={String(option.key)}
          onClick={() => onChange(option.key)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[rgba(11,17,22,0.08)] py-2.5">
      <dt className="text-[0.98rem] text-[var(--color-muted)]">{label}</dt>
      <dd className="m-0 text-[1rem] font-semibold text-[var(--color-ink)]">{children}</dd>
    </div>
  );
}

/**
 * The working-time norm for a settlement period or between two dates. All arithmetic is
 * in `lib/tools/working-time.ts`; the server tables below the tool use the same functions.
 */
export function WorkingTime({ labels, locale, defaultMonth }: { labels: WorkingTimeLabels; locale: "pl" | "en"; defaultMonth: string }) {
  const id = useId();
  const intlLocale = locale === "pl" ? "pl-PL" : "en-GB";
  const weekdayName = (iso: string) => new Intl.DateTimeFormat(intlLocale, { weekday: "long", timeZone: "UTC" }).format(new Date(`${iso}T12:00:00Z`));

  /* Until the visitor picks something, the tool follows the current month in Poland. */
  const today = useSyncExternalStore(noSubscription, readToday, serverToday);
  const thisMonth = today ? today.slice(0, 7) : defaultMonth;
  const thisYear = Number(thisMonth.slice(0, 4));
  const thisMonthNumber = Number(thisMonth.slice(5, 7));

  const [mode, setMode] = useState<"period" | "range">("period");
  const [pickedYear, setPickedYear] = useState<number | null>(null);
  const [pickedMonth, setPickedMonth] = useState<number | null>(null);
  const [length, setLength] = useState<PeriodLength>(1);
  const [pickedFrom, setPickedFrom] = useState<string | null>(null);
  const [pickedTo, setPickedTo] = useState<string | null>(null);
  const [preset, setPreset] = useState<string>("1/1");
  const [customText, setCustomText] = useState("");
  const [lastFraction, setLastFraction] = useState<Fraction>(FULL_TIME);
  const [daily, setDaily] = useState<DailyNorm>("standard");

  const year = pickedYear ?? thisYear;
  const startMonth = pickedMonth ?? thisMonthNumber;
  const from = pickedFrom ?? `${thisMonth}-01`;
  const to = pickedTo ?? lastDayOfMonth(thisYear, thisMonthNumber);

  const customFraction = preset === "other" ? parseFraction(customText) : null;
  const fractionError = preset === "other" && customText.trim() !== "" && customFraction === null;
  const fraction = preset === "other" ? (customFraction ?? lastFraction) : (parseFraction(preset) ?? FULL_TIME);

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

  /* Reversed dates are swapped and shown as used. */
  const datesValid = isIsoDate(from) && isIsoDate(to);
  const [rangeStart, rangeEnd] = datesValid && from > to ? [to, from] : [from, to];
  const rangeTooLong = datesValid && dayCount(rangeStart, rangeEnd) > MAX_RANGE_DAYS;

  const result: NormResult | PeriodResult | null =
    mode === "period"
      ? normForPeriod(year, startMonth, length, fraction, daily)
      : datesValid && !rangeTooLong
        ? normForRange(rangeStart, rangeEnd, fraction, daily)
        : null;

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopied(false), 1800);
      trackToolEvent("tool_copy");
    } catch {
      /* Clipboard refused: the result stays on screen to copy by hand. */
    }
  };

  const partTime = !isFullTime(fraction);
  const months: NormResult[] | null = result && "months" in result ? (result as PeriodResult).months : null;
  const perHoliday = formatDuration(Math.round((DAILY_NORMS[daily] * fraction.num) / fraction.den), locale);
  const saturdays = result?.saturdayHolidays ?? [];
  const saturdayDates = saturdays.map((date) => formatDayMonth(date, locale));
  const joinedSaturdays = saturdayDates.length < 2 ? saturdayDates.join("") : `${saturdayDates.slice(0, -1).join(", ")}${labels.and}${saturdayDates.at(-1)}`;
  const isFuture = result ? Number(result.end.slice(0, 4)) > thisYear + 1 : false;

  const fractionOptions = FRACTION_PRESETS.map((item) => ({ key: item, label: item === "1/1" ? labels.fullTimeOption : item }));

  return (
    <div className="grid gap-10">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <span className={labelClass} id={`${id}-mode`}>
            {labels.modeLabel}
          </span>
          <Segments
            labelId={`${id}-mode`}
            onChange={(key) => {
              setMode(key);
              touch();
            }}
            options={[
              { key: "period" as const, label: labels.modes.period },
              { key: "range" as const, label: labels.modes.range },
            ]}
            value={mode}
          />
        </div>

        {mode === "period" ? (
          <div className="flex flex-wrap items-end gap-x-5 gap-y-5">
            <div className="grid min-w-0 flex-[0_1_9rem] gap-2">
              <label className={labelClass} htmlFor={`${id}-year`}>
                {labels.yearLabel}
              </label>
              <select
                className={fieldClass}
                id={`${id}-year`}
                onChange={(event) => {
                  setPickedYear(Number(event.target.value));
                  touch();
                }}
                value={year}
              >
                {years.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid min-w-0 flex-[0_1_13rem] gap-2">
              <label className={labelClass} htmlFor={`${id}-month`}>
                {labels.startMonthLabel}
              </label>
              <select
                className={fieldClass}
                id={`${id}-month`}
                onChange={(event) => {
                  setPickedMonth(Number(event.target.value));
                  touch();
                }}
                value={startMonth}
              >
                {labels.summary.months.map((name, index) => (
                  <option key={name} value={index + 1}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <span className={labelClass} id={`${id}-length`}>
                {labels.lengthLabel}
              </span>
              <Segments
                labelId={`${id}-length`}
                onChange={(key) => {
                  setLength(key);
                  touch();
                }}
                options={PERIOD_LENGTHS.map((item) => ({ key: item, label: fill(labels.lengthOption, { n: String(item) }) }))}
                value={length}
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-2">
            <div className="flex flex-wrap items-end gap-x-5 gap-y-5">
              <div className="grid min-w-0 flex-[0_1_13rem] gap-2">
                <label className={labelClass} htmlFor={`${id}-from`}>
                  {labels.fromLabel}
                </label>
                <input
                  aria-invalid={!isIsoDate(from)}
                  className={fieldClass}
                  id={`${id}-from`}
                  max={`${YEAR_RANGE.max + 10}-12-31`}
                  min={`${YEAR_RANGE.min}-01-01`}
                  onChange={(event) => {
                    setPickedFrom(event.target.value);
                    touch();
                  }}
                  type="date"
                  value={from}
                />
              </div>
              <div className="grid min-w-0 flex-[0_1_13rem] gap-2">
                <label className={labelClass} htmlFor={`${id}-to`}>
                  {labels.toLabel}
                </label>
                <input
                  aria-invalid={!isIsoDate(to)}
                  className={fieldClass}
                  id={`${id}-to`}
                  max={`${YEAR_RANGE.max + 10}-12-31`}
                  min={`${YEAR_RANGE.min}-01-01`}
                  onChange={(event) => {
                    setPickedTo(event.target.value);
                    touch();
                  }}
                  type="date"
                  value={to}
                />
              </div>
            </div>
            {!datesValid ? (
              <p className={errorClass} role="alert">
                {labels.errors.dates}
              </p>
            ) : rangeTooLong ? (
              <p className={errorClass} role="alert">
                {labels.errors.range}
              </p>
            ) : null}
          </div>
        )}

        <div className="flex flex-wrap items-start gap-x-5 gap-y-5">
          <div className="grid min-w-0 flex-[0_1_13rem] gap-2">
            <label className={labelClass} htmlFor={`${id}-fraction`}>
              {labels.fractionLabel}
            </label>
            <select
              className={fieldClass}
              id={`${id}-fraction`}
              onChange={(event) => {
                setPreset(event.target.value);
                touch();
              }}
              value={preset}
            >
              {fractionOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
              <option value="other">{labels.otherFraction}</option>
            </select>
          </div>
          {preset === "other" ? (
            <div className="grid min-w-0 flex-[0_1_9rem] gap-2">
              <label className={labelClass} htmlFor={`${id}-custom`}>
                {labels.customFractionLabel}
              </label>
              <input
                aria-describedby={fractionError ? `${id}-custom-error` : undefined}
                aria-invalid={fractionError}
                autoComplete="off"
                className={fieldClass}
                id={`${id}-custom`}
                inputMode="numeric"
                maxLength={9}
                onChange={(event) => {
                  setCustomText(event.target.value);
                  const parsed = parseFraction(event.target.value);
                  if (parsed) setLastFraction(parsed);
                  touch();
                }}
                placeholder={labels.customFractionPlaceholder}
                spellCheck={false}
                type="text"
                value={customText}
              />
              {fractionError ? (
                <p className={errorClass} id={`${id}-custom-error`} role="alert">
                  {labels.errors.fraction}
                </p>
              ) : null}
            </div>
          ) : null}
          <div className="grid min-w-0 flex-[0_1_19rem] gap-2">
            <label className={labelClass} htmlFor={`${id}-daily`}>
              {labels.dailyNormLabel}
            </label>
            <select
              className={fieldClass}
              id={`${id}-daily`}
              onChange={(event) => {
                setDaily(event.target.value as DailyNorm);
                touch();
              }}
              value={daily}
            >
              {dailyNormKeys.map((key) => (
                <option key={key} value={key}>
                  {labels.dailyNormOptions[key]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div aria-live="polite" className="grid gap-6 border-t border-[var(--color-border-light)] pt-7">
        {result ? (
          <>
            <div className="grid gap-1.5">
              <p className="m-0 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-display text-[clamp(2rem,3.6vw,2.8rem)] font-medium leading-[1.1] tracking-[-0.03em] text-[var(--color-ink)]">
                  {formatDuration(result.minutes, locale)}
                </span>
                {result.minutes % 60 !== 0 ? <span className="text-[1.05rem] text-[var(--color-muted)]">{formatDecimalHours(result.minutes, locale)}</span> : null}
                <span className="text-[1.05rem] text-[var(--color-muted)]">{plural(labels.normDays, result.normDays, locale)}</span>
              </p>
              {partTime ? <p className="m-0 text-[0.98rem] text-[var(--color-muted)]">{fill(labels.fullTimeNorm, { hours: formatDuration(result.fullTimeMinutes, locale) })}</p> : null}
              {result.exact ? null : <p className={noteClass}>{labels.roundingNote}</p>}
            </div>

            <dl className="m-0 grid max-w-[40rem]">
              <Row label={labels.rows.businessDays}>{result.businessDays}</Row>
              <Row label={labels.rows.daysOff}>{result.daysOff}</Row>
              {mode === "range" ? <Row label={labels.rows.calendarDays}>{result.calendarDays}</Row> : null}
              <Row label={labels.rows.period}>{periodName(result, locale, labels.summary.months)}</Row>
            </dl>

            {saturdays.length ? (
              <p className={noteClass}>
                {fill(saturdays.length === 1 ? labels.gapOne : labels.gapMany, { dates: joinedSaturdays })}
                {partTime ? ` ${labels.gapPartTime}` : ""}
              </p>
            ) : null}

            <div className="grid gap-2">
              <h3 className="m-0 text-[0.95rem] font-semibold text-[var(--color-ink)]">{labels.holidaysTitle}</h3>
              {result.holidays.length ? (
                <ul className="m-0 grid max-w-[47rem] list-none p-0 text-[0.98rem] text-[var(--color-ink)]">
                  {result.holidays.map((holiday) => (
                    <li className="border-b border-[rgba(11,17,22,0.08)] py-2" key={holiday.date}>
                      {fill(labels.holidayLine, {
                        date: formatDayMonth(holiday.date, locale),
                        weekday: weekdayName(holiday.date),
                        name: holidayNames[holiday.key][locale],
                        effect: fill(
                          !holiday.lowersNorm ? labels.effects.sunday : holiday.saturday ? (partTime ? labels.effects.saturdayPartTime : labels.effects.saturday) : labels.effects.lowers,
                          { hours: perHoliday },
                        ),
                      })}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="m-0 text-[0.98rem] text-[var(--color-muted)]">{labels.noHolidays}</p>
              )}
            </div>

            {months && months.length > 1 ? (
              <div className="overflow-x-auto">
                <table className="w-full max-w-[40rem] border-collapse text-[0.98rem] text-[var(--color-ink)]">
                  <caption className="pb-2 text-left text-[0.95rem] font-semibold">{labels.breakdownCaption}</caption>
                  <thead>
                    <tr>
                      <th className={`${thClass} pl-0`} scope="col">
                        {labels.breakdownColumns.month}
                      </th>
                      <th className={`${thClass} text-right`} scope="col">
                        {labels.breakdownColumns.norm}
                      </th>
                      <th className={`${thClass} text-right`} scope="col">
                        {labels.breakdownColumns.normDays}
                      </th>
                      <th className={`${thClass} pr-0 text-right`} scope="col">
                        {labels.breakdownColumns.businessDays}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {months.map((month) => (
                      <tr key={month.start}>
                        <th className={`${tdClass} whitespace-nowrap pl-0 text-left font-semibold`} scope="row">
                          {periodName(month, locale, labels.summary.months)}
                        </th>
                        <td className={`${tdClass} whitespace-nowrap text-right`}>{formatDuration(month.minutes, locale)}</td>
                        <td className={`${tdClass} text-right`}>{month.normDays}</td>
                        <td className={`${tdClass} pr-0 text-right text-[var(--color-muted)]`}>{month.businessDays}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}

            <div className="grid gap-1">
              <p className={noteClass}>{labels.nominalNote}</p>
              {mode === "range" && result.calendarDays > 366 ? <p className={noteClass}>{labels.longRangeNote}</p> : null}
              {isFuture ? <p className={noteClass}>{labels.futureNote}</p> : null}
            </div>

            <div>
              <CopyButton copied={copied} copiedLabel={labels.copied} label={labels.copy} onClick={() => copy(summaryLine(result, locale, labels.summary))} />
            </div>
          </>
        ) : null}
      </div>

      <PrivacyNote>{labels.privacyNote}</PrivacyNote>
    </div>
  );
}
