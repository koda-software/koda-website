/**
 * Polish business days: weekends and the statutory public holidays (ustawa o dniach
 * wolnych od pracy). Dates are plain `YYYY-MM-DD` strings and all arithmetic runs in
 * UTC, so a visitor's own time zone never shifts a day.
 *
 * The NBP rate tool uses this calendar to explain which day's table applies and to
 * notice a table that is not published yet. NBP's own data stays the source of truth
 * for the rate itself.
 */

/** Today in Poland, as YYYY-MM-DD. */
export function todayInPoland(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(now);
}

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** A real calendar date in `YYYY-MM-DD` form (rejects 2026-02-30). */
export function isIsoDate(value: string): boolean {
  const match = ISO_DATE.exec(value);
  if (!match) return false;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return date.toISOString().slice(0, 10) === value;
}

function toUtc(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

export function addDays(iso: string, days: number): string {
  const date = toUtc(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** 0 is Sunday, 6 is Saturday. */
export function weekday(iso: string): number {
  return toUtc(iso).getUTCDay();
}

/** Easter Sunday in the Gregorian calendar (the anonymous Meeus/Jones/Butcher algorithm). */
export function easterSunday(year: number): string {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export type HolidayKey =
  | "newYear"
  | "epiphany"
  | "easter"
  | "easterMonday"
  | "labourDay"
  | "constitutionDay"
  | "pentecost"
  | "corpusChristi"
  | "assumption"
  | "allSaints"
  | "independenceDay"
  | "christmasEve"
  | "christmas"
  | "boxingDay";

const holidayCache = new Map<number, Map<string, HolidayKey>>();

/** Every public holiday in the year, weekends included. Epiphany is a holiday from 2011, Christmas Eve from 2025. */
export function polishHolidays(year: number): Map<string, HolidayKey> {
  const cached = holidayCache.get(year);
  if (cached) return cached;

  const y = String(year).padStart(4, "0");
  const easter = easterSunday(year);
  const entries: Array<[string, HolidayKey]> = [
    [`${y}-01-01`, "newYear"],
    ...(year >= 2011 ? ([[`${y}-01-06`, "epiphany"]] as Array<[string, HolidayKey]>) : []),
    [easter, "easter"],
    [addDays(easter, 1), "easterMonday"],
    [`${y}-05-01`, "labourDay"],
    [`${y}-05-03`, "constitutionDay"],
    [addDays(easter, 49), "pentecost"],
    [addDays(easter, 60), "corpusChristi"],
    [`${y}-08-15`, "assumption"],
    [`${y}-11-01`, "allSaints"],
    [`${y}-11-11`, "independenceDay"],
    ...(year >= 2025 ? ([[`${y}-12-24`, "christmasEve"]] as Array<[string, HolidayKey]>) : []),
    [`${y}-12-25`, "christmas"],
    [`${y}-12-26`, "boxingDay"],
  ];

  const holidays = new Map(entries.sort(([left], [right]) => left.localeCompare(right)));
  holidayCache.set(year, holidays);
  return holidays;
}

export type DayOffReason = { date: string; reason: "saturday" | "sunday" | HolidayKey };

/** Why a day is not a business day, or null when it is one. A holiday wins over the weekend. */
export function dayOffReason(iso: string): DayOffReason | null {
  const holiday = polishHolidays(Number(iso.slice(0, 4))).get(iso);
  if (holiday) return { date: iso, reason: holiday };
  const day = weekday(iso);
  if (day === 6) return { date: iso, reason: "saturday" };
  if (day === 0) return { date: iso, reason: "sunday" };
  return null;
}

export function isBusinessDay(iso: string): boolean {
  return dayOffReason(iso) === null;
}

/** The last business day strictly before `iso`. */
export function previousBusinessDay(iso: string): string {
  let day = addDays(iso, -1);
  while (!isBusinessDay(day)) day = addDays(day, -1);
  return day;
}
