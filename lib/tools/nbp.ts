/**
 * NBP average exchange rates for invoices and tax: the rate from the last business day
 * before a given date (art. 31a of the VAT Act, art. 11a PIT, art. 12 ust. 2 and
 * art. 15 ust. 1 CIT).
 *
 * The browser calls api.nbp.pl directly. NBP's 200 responses allow any origin, but its
 * 404 ("no table that day") and 400 ("end date in the future") carry no CORS header, so
 * in a browser they look exactly like a network failure. The tool therefore never asks
 * for a single day: it asks for a range that always holds a table and never ends after
 * today, then picks the right row itself.
 *
 * Rates stay decimal strings end to end ("4.4070") and the conversions run in BigInt,
 * so a rate is never rounded through a float.
 */
import type { Locale } from "../i18n/config";
import { nbpCurrencies } from "./nbp-currencies";
import { addDays, dayOffReason, isBusinessDay, isIsoDate, previousBusinessDay, weekday, type DayOffReason } from "./business-days";
import { hasNoVat, quickConvert, type RateKey } from "./vat";

export const NBP_API = "https://api.nbp.pl/api/exchangerates";
export const NBP_FIRST_DATE = "2002-01-02";
/** The look-back window: longer than the longest gap between tables seen (A: 6 days, B: 8 days). */
const WINDOW_DAYS = 31;

export type NbpTable = "A" | "B";
/** `mid` is the rate for one unit, kept as NBP wrote it. */
export type NbpRate = { no: string; effectiveDate: string; mid: string };
export type NbpSeries = { table: NbpTable; code: string; currency: string; rates: NbpRate[] };

export class NbpError extends Error {
  constructor(readonly reason: "network" | "noData" | "format") {
    super(`NBP request failed: ${reason}`);
    this.name = "NbpError";
  }
}

/** The range to ask for: it ends the day before `date`, but never after today. Null for an invalid date or one with no earlier table. */
export function rateWindow(date: string, today: string): { start: string; end: string } | null {
  if (!isIsoDate(date) || !isIsoDate(today) || date <= NBP_FIRST_DATE) return null;
  const dayBefore = addDays(date, -1);
  const end = dayBefore < today ? dayBefore : today;
  const start = addDays(end, -WINDOW_DAYS);
  return { start: start < NBP_FIRST_DATE ? NBP_FIRST_DATE : start, end };
}

export function nbpRangeUrl(table: NbpTable, code: string, start: string, end: string): string {
  return `${NBP_API}/rates/${table.toLowerCase()}/${code.toLowerCase()}/${start}/${end}/?format=json`;
}

const MID = /^\d+(?:\.\d+)?$/;

/** Reads the raw response text, keeping each `mid` as written (with its trailing zeros). */
export function parseNbpSeries(text: string): NbpSeries {
  let data: unknown;
  try {
    data = JSON.parse(text.replace(/"mid":\s*(\d+(?:\.\d+)?)/g, '"mid":"$1"'));
  } catch {
    throw new NbpError("format");
  }

  const series = data as Partial<NbpSeries> | null;
  if (
    !series ||
    (series.table !== "A" && series.table !== "B") ||
    typeof series.code !== "string" ||
    typeof series.currency !== "string" ||
    !Array.isArray(series.rates)
  ) {
    throw new NbpError("format");
  }

  const rates = series.rates.map((rate) => {
    if (!rate || typeof rate.no !== "string" || !isIsoDate(String(rate.effectiveDate)) || !MID.test(String(rate.mid))) {
      throw new NbpError("format");
    }
    return { no: rate.no, effectiveDate: rate.effectiveDate, mid: rate.mid };
  });

  return { table: series.table, code: series.code, currency: series.currency, rates };
}

/** The last table published strictly before `date`. */
export function pickRate(rates: NbpRate[], date: string): NbpRate | null {
  let picked: NbpRate | null = null;
  for (const rate of rates) {
    if (rate.effectiveDate < date && (!picked || rate.effectiveDate > picked.effectiveDate)) picked = rate;
  }
  return picked;
}

/** Days strictly between two dates, each with the reason it had no table. Null when one of them is a business day. */
function daysOffBetween(from: string, to: string): DayOffReason[] | null {
  const days: DayOffReason[] = [];
  for (let day = addDays(from, 1); day < to; day = addDays(day, 1)) {
    const reason = dayOffReason(day);
    if (!reason) return null;
    days.push(reason);
  }
  return days;
}

/**
 * Table B comes out on Wednesday, or on the last business day before it when Wednesday
 * is a holiday. Returns the last such publication day strictly before `date`.
 */
export function previousTableBDay(date: string): string {
  for (let day = addDays(date, -1); ; day = addDays(day, -1)) {
    const wednesday = addDays(day, 3 - weekday(day));
    const publication = isBusinessDay(wednesday) ? wednesday : previousBusinessDay(wednesday);
    if (publication === day) return day;
  }
}

export type RateLookup =
  | {
      kind: "ok";
      rate: NbpRate;
      /** The days between the table used and the date, with why each had no table. Table A only; empty when the calendar and NBP disagree. */
      skipped: DayOffReason[];
      /** Set when the table the date calls for is not published yet: the rate shown is then the latest one available. */
      pending: { expected: string } | null;
    }
  | { kind: "none" };

export function resolveRate(series: NbpSeries, date: string, today: string): RateLookup {
  const rate = pickRate(series.rates, date);
  if (!rate) return { kind: "none" };

  const expected = series.table === "A" ? previousBusinessDay(date) : previousTableBDay(date);
  const pending = rate.effectiveDate < expected && expected >= today ? { expected } : null;

  if (series.table === "B") return { kind: "ok", rate, skipped: [], pending };

  /* Explain the gap from the legal day: the table used when it is that day, or the
     expected one when that is still to come. A gap NBP and the calendar see differently
     (a one-off day without a table) gets no explanation. */
  const from = pending ? expected : rate.effectiveDate;
  const skipped = (pending || rate.effectiveDate === expected ? daysOffBetween(from, date) : null) ?? [];
  return { kind: "ok", rate, skipped, pending };
}

/** Fetches a range of rates straight from NBP, with no custom headers (so no CORS preflight). */
export async function fetchSeries(table: NbpTable, code: string, start: string, end: string, signal?: AbortSignal): Promise<NbpSeries> {
  let response: Response;
  try {
    response = await fetch(nbpRangeUrl(table, code, start, end), { signal });
  } catch (caught) {
    if ((caught as Error).name === "AbortError") throw caught;
    /* Also a 404 or 400: they carry no CORS header, so the browser hides them. */
    throw new NbpError("network");
  }
  if (!response.ok) throw new NbpError("noData");
  return parseNbpSeries(await response.text());
}

/** Grosze times a decimal-string rate, rounded half up to the grosz, with no float in between. */
export function convertCents(cents: number, mid: string): number {
  const [whole, fraction = ""] = mid.split(".");
  const scale = BigInt(10) ** BigInt(fraction.length);
  const product = BigInt(cents) * BigInt(`${whole}${fraction}`);
  const sign = product < BigInt(0) ? BigInt(-1) : BigInt(1);
  const abs = product * sign;
  return Number(((abs + scale / BigInt(2)) / scale) * sign);
}

export type PlnAmounts = {
  net: number;
  /** Null for exempt (zw.) and out-of-scope (np.) sales. */
  vat: number | null;
  gross: number;
  foreign: { net: number; vat: number | null; gross: number };
};

/**
 * An invoice amount in a foreign currency, in PLN. VAT is worked out in the currency
 * and converted on its own (art. 106e ust. 11), so gross in PLN is net plus VAT in PLN.
 */
export function toPln(amountCents: number, basis: "net" | "gross", rate: RateKey, mid: string): PlnAmounts | null {
  const result = quickConvert(basis, amountCents, rate);
  if (result.kind !== "ok") return null;

  const noVat = hasNoVat(rate);
  const net = convertCents(result.net, mid);
  const vat = noVat ? null : convertCents(result.vat, mid);
  return {
    net,
    vat,
    gross: net + (vat ?? 0),
    foreign: { net: result.net, vat: noVat ? null : result.vat, gross: result.gross },
  };
}

/** "4.4070" as "4,4070"; at least four decimals, and every digit NBP gave. */
export function formatMid(mid: string, separator: "," | "."): string {
  const [whole, fraction = ""] = mid.split(".");
  return `${whole}${separator}${fraction.padEnd(4, "0")}`;
}

/** 2026-11-13 as 13.11.2026. */
export function formatDottedDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
}

/** The line to copy onto an invoice or a booking note. */
export function invoiceNote(locale: Locale, code: string, rate: NbpRate): string {
  const date = formatDottedDate(rate.effectiveDate);
  return locale === "pl"
    ? `Kurs średni NBP z dnia ${date}, tabela nr ${rate.no}: 1 ${code} = ${formatMid(rate.mid, ",")} PLN`
    : `NBP average rate of ${date}, table no. ${rate.no}: 1 ${code} = ${formatMid(rate.mid, ".")} PLN`;
}

export type NbpCurrencyOption = { code: string; table: NbpTable; name: string };

/**
 * The currency list in the page's language. English names come from Intl, falling back
 * to NBP's Polish name. Run on the server, so every visitor gets the same names.
 */
export function nbpCurrencyOptions(locale: Locale): NbpCurrencyOption[] {
  if (locale === "pl") return nbpCurrencies;
  const names = new Intl.DisplayNames("en", { type: "currency", fallback: "none" });
  const named = nbpCurrencies.map((currency) => ({ ...currency, name: names.of(currency.code) ?? currency.name }));
  /* Keep the leading four, then sort each table by its English name. */
  const rank = (currency: NbpCurrencyOption) => (currency.table === "A" ? 0 : 1);
  return [
    ...named.slice(0, 4),
    ...named.slice(4).sort((left, right) => rank(left) - rank(right) || left.name.localeCompare(right.name, "en")),
  ];
}
