/**
 * The working-time norm (wymiar czasu pracy) under art. 130 of the Kodeks pracy, and
 * the working days it rests on. Everything is calendar arithmetic on top of
 * `business-days.ts`: no request, no rounding the visitor does not see.
 *
 * Durations are whole minutes. A part-time fraction is `{ num, den }` with
 * 1 ≤ num ≤ den ≤ 100, applied to the full-time norm and rounded to the minute only
 * when the result is not whole (`exact` says so).
 */
import type { Locale } from "../i18n/config";
import { addDays, countDays, holidaysOfYear, isIsoDate, lastDayOfMonth, weekday, type Holiday } from "./business-days";

/**
 * The two years the page's server tables and title cover.
 *
 * MOVE THIS ON BY ONE YEAR EACH DECEMBER (2027, 2028 in December 2027). The page titles
 * read it, so they follow. By hand at the same time: `sources.updatedAt` and the FAQ
 * answers that name a year in `content/{pl,en}/tools/working-time.ts`, and the next
 * year's monthly rows in `working-time.test.ts`, checked against two published tables.
 * Check the act on days off (Dz.U. 2025 poz. 296) for amendments first.
 */
export const workingTimeYears = [2026, 2027] as const;

/** Daily norms in minutes: Kodeks pracy, healthcare entities (art. 93 u.d.l.), significant or moderate disability (art. 15 u.r.z.o.n.). */
export const DAILY_NORMS = { standard: 480, healthcare: 455, disability: 420 } as const;
export type DailyNorm = keyof typeof DAILY_NORMS;
export const dailyNormKeys = Object.keys(DAILY_NORMS) as DailyNorm[];

/** Settlement period lengths in months: up to 4 as a rule, up to 12 when extended (art. 129 § 1–2). */
export const PERIOD_LENGTHS = [1, 2, 3, 4, 6, 12] as const;
export type PeriodLength = (typeof PERIOD_LENGTHS)[number];

/** The years the widget offers. Christmas Eve counts from 2025, Epiphany from 2011. */
export const YEAR_RANGE = { min: 2020, max: 2035 } as const;

/** The longest date-to-date range the widget counts, in days (ten years). */
export const MAX_RANGE_DAYS = 3660;

export type Fraction = { num: number; den: number };
export const FULL_TIME: Fraction = { num: 1, den: 1 };

/** The part-time presets the widget offers, as contracts state them. */
export const FRACTION_PRESETS = ["1/1", "7/8", "4/5", "3/4", "3/5", "1/2", "2/5", "1/3", "1/4", "1/5", "1/8"] as const;

/** A holiday in a period, with what it does to the norm. A Sunday holiday changes nothing. */
export type PeriodHoliday = Holiday & { lowersNorm: boolean; saturday: boolean };

export type NormResult = {
  /** Inclusive, YYYY-MM-DD. */
  start: string;
  end: string;
  fraction: Fraction;
  daily: DailyNorm;
  calendarDays: number;
  monFriDays: number;
  /** Monday to Friday without holidays: the "253 dni robocze" count. */
  businessDays: number;
  /** Monday to Friday less every holiday on Monday to Saturday: the "251 dni pracy" count. */
  normDays: number;
  /** Calendar days less the days in the norm. */
  daysOff: number;
  /** The full-time norm for the daily norm chosen. */
  fullTimeMinutes: number;
  /** The norm for the fraction, rounded to the minute. */
  minutes: number;
  /** False when the fraction gave a part of a minute. */
  exact: boolean;
  holidays: PeriodHoliday[];
  /** Saturday holidays: each lowers the norm and needs another day off within the settlement period. */
  saturdayHolidays: string[];
};

export type PeriodResult = NormResult & { months: NormResult[] };

const isMonFri = (iso: string) => {
  const day = weekday(iso);
  return day >= 1 && day <= 5;
};

function holidaysBetween(start: string, end: string): PeriodHoliday[] {
  const holidays: PeriodHoliday[] = [];
  for (let year = Number(start.slice(0, 4)); year <= Number(end.slice(0, 4)); year += 1) {
    for (const holiday of holidaysOfYear(year)) {
      if (holiday.date >= start && holiday.date <= end) {
        holidays.push({ ...holiday, lowersNorm: holiday.weekday !== 0, saturday: holiday.weekday === 6 });
      }
    }
  }
  return holidays;
}

function assertRange(start: string, end: string) {
  if (!isIsoDate(start) || !isIsoDate(end)) throw new RangeError(`Not a date range: ${start} – ${end}`);
  if (start > end) throw new RangeError(`${start} is after ${end}`);
}

const daysBetween = (start: string, end: string) => Math.round((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86_400_000) + 1;

/**
 * Art. 130 § 1–2 literally: 40 h for each full week counted from the first day of the
 * period (art. 128 § 3 pkt 2), plus 8 h for each remaining day from Monday to Friday,
 * less 8 h for each holiday that is not a Sunday. With another daily norm, 40 h becomes
 * five daily norms. The tests prove this equals `normDays × daily norm`.
 */
export function article130Minutes(start: string, end: string, dailyMinutes: number = DAILY_NORMS.standard): number {
  assertRange(start, end);
  const calendarDays = daysBetween(start, end);
  const weeks = Math.floor(calendarDays / 7);
  const remainderStart = addDays(start, weeks * 7);
  const remaining = remainderStart <= end ? countDays(remainderStart, end, isMonFri) : 0;
  const holidays = holidaysBetween(start, end).filter((holiday) => holiday.weekday !== 0).length;
  return weeks * 5 * dailyMinutes + remaining * dailyMinutes - holidays * dailyMinutes;
}

/** The norm and both day counts for a date range, both days included. */
export function normForRange(start: string, end: string, fraction: Fraction = FULL_TIME, daily: DailyNorm = "standard"): NormResult {
  assertRange(start, end);
  const holidays = holidaysBetween(start, end);
  const calendarDays = daysBetween(start, end);
  const monFriDays = countDays(start, end, isMonFri);
  const onMonFri = holidays.filter((holiday) => holiday.weekday >= 1 && holiday.weekday <= 5).length;
  const saturdayHolidays = holidays.filter((holiday) => holiday.saturday).map((holiday) => holiday.date);
  const normDays = monFriDays - onMonFri - saturdayHolidays.length;
  const fullTimeMinutes = normDays * DAILY_NORMS[daily];
  const scaled = fullTimeMinutes * fraction.num;

  return {
    start,
    end,
    fraction,
    daily,
    calendarDays,
    monFriDays,
    businessDays: monFriDays - onMonFri,
    normDays,
    daysOff: calendarDays - normDays,
    fullTimeMinutes,
    minutes: Math.round(scaled / fraction.den),
    exact: scaled % fraction.den === 0,
    holidays,
    saturdayHolidays,
  };
}

const monthStart = (year: number, month: number) => `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-01`;

/** Year and month (1–12) `offset` months after the given one. */
function shiftMonth(year: number, month: number, offset: number) {
  const index = year * 12 + (month - 1) + offset;
  return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

/** A settlement period: `length` months from (year, startMonth), which may run into the next year. */
export function normForPeriod(year: number, startMonth: number, length: PeriodLength, fraction: Fraction = FULL_TIME, daily: DailyNorm = "standard"): PeriodResult {
  const months = Array.from({ length }, (_, offset) => {
    const at = shiftMonth(year, startMonth, offset);
    return normForRange(monthStart(at.year, at.month), lastDayOfMonth(at.year, at.month), fraction, daily);
  });
  return { ...normForRange(months[0].start, months.at(-1)!.end, fraction, daily), months };
}

/** The year table the page renders on the server: months, quarters, 4-month periods, halves and the year. */
export function yearTable(year: number, fraction: Fraction = FULL_TIME, daily: DailyNorm = "standard") {
  const periods = (length: PeriodLength) =>
    Array.from({ length: 12 / length }, (_, index) => normForPeriod(year, 1 + index * length, length, fraction, daily) as NormResult);
  return {
    months: periods(1),
    quarters: periods(3),
    thirds: periods(4),
    halves: periods(6),
    year: normForPeriod(year, 1, 12, fraction, daily) as NormResult,
  };
}

/** "3/4" or "7 / 8"; null for anything that is not a fraction 1 ≤ num ≤ den ≤ 100. */
export function parseFraction(text: string): Fraction | null {
  const match = /^\s*(\d{1,3})\s*\/\s*(\d{1,3})\s*$/.exec(text);
  if (!match) return null;
  const num = Number(match[1]);
  const den = Number(match[2]);
  if (num < 1 || den > 100 || num > den) return null;
  return { num, den };
}

export const isFullTime = (fraction: Fraction) => fraction.num === fraction.den;

/** "160 h", "53 h 20 min", "0 h". The same in both languages. */
export function formatDuration(minutes: number, locale: Locale): string {
  void locale;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours} h` : `${hours} h ${rest} min`;
}

/** Decimal hours, two places rounded half up: pl "53,33 h", en "53.33 h"; whole hours as "160 h". */
export function formatDecimalHours(minutes: number, locale: Locale): string {
  if (minutes % 60 === 0) return `${minutes / 60} h`;
  const hundredths = Math.floor((minutes * 10 + 3) / 6);
  const text = `${Math.floor(hundredths / 100)}${locale === "pl" ? "," : "."}${String(hundredths % 100).padStart(2, "0")}`;
  return `${text} h`;
}

/** Plural forms keyed by `Intl.PluralRules` category; "{n}" is the number. */
export type PluralForms = { one: string; few?: string; many?: string; other: string };

export function plural(forms: PluralForms, count: number, locale: Locale): string {
  const category = new Intl.PluralRules(locale === "pl" ? "pl-PL" : "en-GB").select(count) as keyof PluralForms;
  return (forms[category] ?? forms.other).replace("{n}", String(count));
}

/** The copy `summaryLine` needs. Templates use {placeholders}. */
export type WorkingTimeSummaryLabels = {
  /** Nominative month names, capitalised as at the start of a sentence. */
  months: string[];
  /** "w sierpniu", "in August": where the day off falls in a one-month period. */
  monthsIn: string[];
  fullTime: string;
  /** "{fraction}": "3/4 etatu". */
  partTime: string;
  /** Shown after the fraction for a non-standard daily norm. */
  dailyNorms: Record<DailyNorm, string>;
  normDays: PluralForms;
  businessDays: PluralForms;
  /** "{period}", "{who}", "{hours}", "{normDays}", "{businessDays}". */
  line: string;
  /** "{date}", "{when}": full time, a settlement period. */
  saturdayFullTime: string;
  /** "{date}", "{hours}": part time, or a date range rather than a settlement period. */
  saturdayReduces: string;
  /** "w tym okresie rozliczeniowym": the day off in a period longer than a month. */
  inPeriod: string;
};

const intlLocale = (locale: Locale) => (locale === "pl" ? "pl-PL" : "en-GB");
const utcNoon = (iso: string) => new Date(`${iso}T12:00:00Z`);

/** "15 sierpnia", "15 August". */
export function formatDayMonth(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale(locale), { day: "numeric", month: "long", timeZone: "UTC" }).format(utcNoon(iso));
}

/** "Sierpień 2026", "Listopad 2026 – styczeń 2027", or "17–31 sierpnia 2026" for a range that is not whole months. */
export function periodName(result: Pick<NormResult, "start" | "end">, locale: Locale, months: string[]): string {
  const [startYear, startMonth, startDay] = result.start.split("-").map(Number);
  const [endYear, endMonth] = result.end.split("-").map(Number);
  const wholeMonths = startDay === 1 && result.end === lastDayOfMonth(endYear, endMonth);
  if (!wholeMonths) {
    return new Intl.DateTimeFormat(intlLocale(locale), { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).formatRange(
      utcNoon(result.start),
      utcNoon(result.end),
    );
  }
  const first = months[startMonth - 1];
  if (startYear === endYear && startMonth === endMonth) return `${first} ${startYear}`;
  const lastName = months[endMonth - 1];
  const last = locale === "pl" ? lastName.toLowerCase() : lastName;
  return startYear === endYear ? `${first} – ${last} ${endYear}` : `${first} ${startYear} – ${last} ${endYear}`;
}

const fill = (template: string, values: Record<string, string>) => template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);

/**
 * The one-line result the copy button puts on the clipboard, e.g. "Sierpień 2026, pełny
 * etat: 160 h, 20 dni pracy (21 dni roboczych). 15 sierpnia (sobota) obniża wymiar:
 * wyznacz inny dzień wolny w sierpniu."
 */
export function summaryLine(result: NormResult | PeriodResult, locale: Locale, labels: WorkingTimeSummaryLabels): string {
  const fullTime = isFullTime(result.fraction);
  const fractionText = fullTime ? labels.fullTime : fill(labels.partTime, { fraction: `${result.fraction.num}/${result.fraction.den}` });
  const who = `${fractionText}${labels.dailyNorms[result.daily]}`;
  const sentences = [
    fill(labels.line, {
      period: periodName(result, locale, labels.months),
      who,
      hours: formatDuration(result.minutes, locale),
      normDays: plural(labels.normDays, result.normDays, locale),
      businessDays: plural(labels.businessDays, result.businessDays, locale),
    }),
  ];

  const period: NormResult[] | null = "months" in result ? (result as PeriodResult).months : null;
  const perHoliday = Math.round((DAILY_NORMS[result.daily] * result.fraction.num) / result.fraction.den);
  for (const date of result.saturdayHolidays) {
    if (period && fullTime) {
      const when = period.length === 1 ? labels.monthsIn[Number(date.slice(5, 7)) - 1] : labels.inPeriod;
      sentences.push(fill(labels.saturdayFullTime, { date: formatDayMonth(date, locale), when }));
    } else {
      sentences.push(fill(labels.saturdayReduces, { date: formatDayMonth(date, locale), hours: formatDuration(perHoliday, locale) }));
    }
  }
  return sentences.join(" ");
}
