/**
 * Statutory interest for late payment, worked out in the browser.
 *
 * Commercial mode follows the act on excessive delays in commercial transactions: one rate
 * per half-year (art. 11b), and the fixed recovery compensation of 40, 70 or 100 EUR per
 * invoice (art. 10). Civil mode is the ordinary statutory interest for delay of art. 481 KC,
 * whose rate changes on the day the NBP reference rate changes.
 *
 * Conventions (not set by statute, disclosed on the page):
 * - a due date on a Saturday or a public holiday moves to the next business day (art. 115 KC);
 * - interest runs from the day after the due date up to and including the payment date;
 * - actual days / 365, leap years included;
 * - each row is rounded half up to the grosz, in BigInt, and the total is the sum of the rows;
 * - interest and the compensation tier use the gross amount (CJEU C-585/20).
 */
import type { Locale } from "../i18n/config";
import { addDays, dayOffReason, isBusinessDay, isIsoDate, type DayOffReason } from "./business-days";
import { convertCents, formatDottedDate, formatMid, type NbpRate } from "./nbp";
import { formatCents } from "./vat";
import { COMMERCIAL_KNOWN_UNTIL, civilRates, commercialRates } from "./late-interest-rates";

export const FIRST_DUE_DATE = "2016-01-01";
/** The last due date with the flat 40 EUR: the right to interest arose on or before 1 January 2020. */
const FLAT_COMPENSATION_UNTIL = "2019-12-31";
export const MAX_INVOICES = 20;

export type InterestMode = "commercial" | "civil";
export type Debtor = "standard" | "healthcare";

/** Days from `from` to `to`, counted in UTC: `to − from`. */
export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}

/** Art. 115 KC: a due date on a Saturday or a public holiday moves to the next business day. */
export function effectiveDueDate(due: string): { date: string; skipped: DayOffReason[] } {
  const skipped: DayOffReason[] = [];
  let date = due;
  while (!isBusinessDay(date)) {
    const reason = dayOffReason(date);
    if (reason) skipped.push(reason);
    date = addDays(date, 1);
  }
  return { date, skipped };
}

/** cents × rateBp × days / (365 × 10 000), half up, in BigInt. */
export function rowInterest(cents: number, rateBp: number, days: number): number {
  const product = BigInt(cents) * BigInt(rateBp) * BigInt(days);
  const divisor = BigInt(365 * 10_000);
  return Number((product + divisor / BigInt(2)) / divisor);
}

export type InterestRow = {
  /** First day of the row, inclusive. */
  from: string;
  /** Last day of the row, inclusive. */
  to: string;
  days: number;
  rateBp: number;
  interest: number;
  /** The Monitor Polski announcement; null when the rate is derived or a forecast. */
  source: string | null;
  /** The rate is the last one announced, used for days the table does not cover yet. */
  forecast: boolean;
};

type Period = { from: string; rateBp: number; source: string | null; forecast: boolean };

/** The rate periods from the tables, the commercial one extended by half-years past what is known. */
function periods(mode: InterestMode, debtor: Debtor, until: string): Period[] {
  if (mode === "civil") return civilRates.map((row) => ({ from: row.from, rateBp: row.rate, source: row.source, forecast: false }));

  const known: Period[] = commercialRates.map((row) => ({
    from: row.from,
    rateBp: debtor === "healthcare" ? row.healthcare : row.standard,
    source: row.source,
    forecast: false,
  }));
  const last = known[known.length - 1];
  for (let start = addDays(COMMERCIAL_KNOWN_UNTIL, 1); start <= until; start = nextHalfYear(start)) {
    known.push({ from: start, rateBp: last.rateBp, source: null, forecast: true });
  }
  return known;
}

/** "2027-01-01" → "2027-07-01" → "2028-01-01". */
function nextHalfYear(start: string): string {
  const year = Number(start.slice(0, 4));
  return start.slice(5) === "01-01" ? `${year}-07-01` : `${year + 1}-01-01`;
}

/** Splits (due, until] into rows at each rate boundary and computes each row. Empty when until ≤ due. */
export function interestRows(cents: number, due: string, until: string, mode: InterestMode, debtor: Debtor): InterestRow[] {
  if (until <= due) return [];
  const first = addDays(due, 1);
  const list = periods(mode, debtor, until);
  const rows: InterestRow[] = [];

  list.forEach((period, index) => {
    const next = list[index + 1];
    const periodEnd = next ? addDays(next.from, -1) : until;
    const from = first > period.from ? first : period.from;
    const to = until < periodEnd ? until : periodEnd;
    if (from > to) return;
    const days = daysBetween(from, to) + 1;
    rows.push({ from, to, days, rateBp: period.rateBp, interest: rowInterest(cents, period.rateBp, days), source: period.source, forecast: period.forecast });
  });

  return rows;
}

export type CompensationTier = { eur: 40 | 70 | 100; basis: "flat2016" | "tier" };

/** ≤ 5 000 zł → 40; < 50 000 zł → 70; else 100. Flat 40 when the right to interest arose on or before 2020-01-01. */
export function compensationTier(cents: number, effectiveDue: string): CompensationTier {
  if (effectiveDue <= FLAT_COMPENSATION_UNTIL) return { eur: 40, basis: "flat2016" };
  if (cents <= 500_000) return { eur: 40, basis: "tier" };
  if (cents < 5_000_000) return { eur: 70, basis: "tier" };
  return { eur: 100, basis: "tier" };
}

/**
 * The first day of the month the payment fell due ("2026-11-02" → "2026-11-01"). The last
 * NBP table before it is the one art. 10 ust. 1a needs: feed it to rateWindow and resolveRate.
 */
export function compensationRateAnchor(effectiveDue: string): string {
  return `${effectiveDue.slice(0, 7)}-01`;
}

/** The compensation in PLN: EUR × the NBP mid, half up. */
export function compensationCents(tier: CompensationTier, mid: string): number {
  return convertCents(tier.eur * 100, mid);
}

export type InvoiceInput = { label: string; cents: number; due: string; paid: string | null };

export type InvoiceResult = {
  label: string;
  cents: number;
  due: string;
  effectiveDue: string;
  skipped: DayOffReason[];
  /** The payment date, or the shared "count until" date for an unpaid invoice. */
  until: string;
  paid: boolean;
  days: number;
  rows: InterestRow[];
  interest: number;
  compensation: { tier: CompensationTier; anchor: string } | null;
};

export type InvoiceError = { error: "amount" | "due" | "paid" | "beforeFirst" | "notLate" };

export function computeInvoice(
  input: InvoiceInput,
  until: string,
  mode: InterestMode,
  debtor: Debtor,
  withCompensation: boolean,
): InvoiceResult | InvoiceError {
  if (!Number.isInteger(input.cents) || input.cents <= 0) return { error: "amount" };
  if (!isIsoDate(input.due)) return { error: "due" };
  if (input.due < FIRST_DUE_DATE) return { error: "beforeFirst" };
  const end = input.paid ?? until;
  if (!isIsoDate(end)) return { error: "paid" };

  const effective = effectiveDueDate(input.due);
  if (end <= effective.date) return { error: "notLate" };

  const rows = interestRows(input.cents, effective.date, end, mode, debtor);
  return {
    label: input.label,
    cents: input.cents,
    due: input.due,
    effectiveDue: effective.date,
    skipped: effective.skipped,
    until: end,
    paid: input.paid !== null,
    days: daysBetween(effective.date, end),
    rows,
    interest: rows.reduce((sum, row) => sum + row.interest, 0),
    compensation:
      mode === "commercial" && withCompensation
        ? { tier: compensationTier(input.cents, effective.date), anchor: compensationRateAnchor(effective.date) }
        : null,
  };
}

/** 1375 → "13,75"; 950 → "9,50". */
export function formatRate(bp: number, separator: "," | "."): string {
  return `${Math.floor(bp / 100)}${separator}${String(bp % 100).padStart(2, "0")}`;
}

/** Art. 10 ust. 1 pkt 1, 2 or 3, by the EUR amount. */
function compensationPoint(tier: CompensationTier): number {
  return tier.eur === 40 ? 1 : tier.eur === 70 ? 2 : 3;
}

const noteCopy = {
  pl: {
    titles: { commercial: "Odsetki ustawowe za opóźnienie w transakcjach handlowych", civil: "Odsetki ustawowe za opóźnienie (art. 481 § 2 Kodeksu cywilnego)" },
    invoice: (index: number) => `Faktura ${index + 1}`,
    days: (count: number) => `${count} ${count === 1 ? "dzień" : "dni"}`,
    due: "termin",
    shifted: (date: string) => ` (upływa ${date}, art. 115 KC)`,
    paid: "zapłata",
    unpaid: "niezapłacona, liczone do",
    forecast: " (stawka prognozowana)",
    interest: "Odsetki",
    compensation: (tier: CompensationTier) =>
      tier.basis === "flat2016" ? "Rekompensata (art. 10 ust. 1, przed 2020 r.)" : `Rekompensata (art. 10 ust. 1 pkt ${compensationPoint(tier)})`,
    table: (rate: NbpRate) => `tabela ${rate.no} z ${formatDottedDate(rate.effectiveDate)}`,
    totalInterest: "Razem odsetki",
    totalCompensation: "Razem rekompensaty",
    total: "Razem",
    basis: {
      commercial:
        "Podstawa: art. 7 ust. 1, art. 10 ust. 1 i art. 11b ustawy z dnia 8 marca 2013 r. o przeciwdziałaniu nadmiernym opóźnieniom w transakcjach handlowych (Dz.U. 2023 poz. 1790).",
      civil: "Podstawa: art. 481 § 1 i 2 Kodeksu cywilnego (Dz.U. 2026 poz. 795).",
    },
    currency: "zł",
    separator: ",",
  },
  en: {
    titles: { commercial: "Statutory interest for late payment in commercial transactions", civil: "Statutory interest for delay (art. 481 § 2 of the Polish Civil Code)" },
    invoice: (index: number) => `Invoice ${index + 1}`,
    days: (count: number) => `${count} ${count === 1 ? "day" : "days"}`,
    due: "due",
    shifted: (date: string) => ` (ends ${date}, art. 115 Civil Code)`,
    paid: "paid",
    unpaid: "unpaid, counted to",
    forecast: " (forecast rate)",
    interest: "Interest",
    compensation: (tier: CompensationTier) =>
      tier.basis === "flat2016" ? "Compensation (art. 10(1), before 2020)" : `Compensation (art. 10(1)(${compensationPoint(tier)}))`,
    table: (rate: NbpRate) => `table ${rate.no} of ${formatDottedDate(rate.effectiveDate)}`,
    totalInterest: "Total interest",
    totalCompensation: "Total compensation",
    total: "Total",
    basis: {
      commercial:
        "Basis: art. 7(1), art. 10(1) and art. 11b of the Act of 8 March 2013 on counteracting excessive delays in commercial transactions (Journal of Laws 2023 item 1790).",
      civil: "Basis: art. 481 § 1 and 2 of the Polish Civil Code (Journal of Laws 2026 item 795).",
    },
    currency: "PLN",
    separator: ".",
  },
} as const;

export type NoteTotals = {
  interest: number;
  /** PLN compensation for the invoices whose EUR rate is known. */
  compensation: number;
  /** EUR still to convert, for the invoices whose rate is missing. */
  compensationEur: number;
};

/** Sums the invoices, converting each compensation with the rate of its month when it is known. */
export function noteTotals(invoices: InvoiceResult[], eurRates: Map<string, NbpRate>): NoteTotals {
  const totals: NoteTotals = { interest: 0, compensation: 0, compensationEur: 0 };
  for (const invoice of invoices) {
    totals.interest += invoice.interest;
    if (!invoice.compensation) continue;
    const rate = eurRates.get(invoice.compensation.anchor);
    if (rate) totals.compensation += compensationCents(invoice.compensation.tier, rate.mid);
    else totals.compensationEur += invoice.compensation.tier.eur;
  }
  return totals;
}

/**
 * The plain-text summary for an interest note or a payment demand, in the page's language.
 * `eurRates` maps a compensation anchor to its NBP table; a missing month gives EUR only.
 */
export function noteText(locale: Locale, invoices: InvoiceResult[], eurRates: Map<string, NbpRate>, mode: InterestMode): string {
  const copy = noteCopy[locale];
  const sep = copy.separator;
  const money = (cents: number) => `${formatCents(cents, sep)} ${copy.currency}`;
  const date = formatDottedDate;
  const lines: string[] = [copy.titles[mode]];

  invoices.forEach((invoice, index) => {
    const label = invoice.label.trim() || copy.invoice(index);
    const shifted = invoice.effectiveDue !== invoice.due ? copy.shifted(date(invoice.effectiveDue)) : "";
    const end = invoice.paid ? `${copy.paid} ${date(invoice.until)}` : `${copy.unpaid} ${date(invoice.until)}`;
    lines.push(`${label}: ${money(invoice.cents)}, ${copy.due} ${date(invoice.due)}${shifted}, ${end}, ${copy.days(invoice.days)}`);
    for (const row of invoice.rows) {
      lines.push(`  ${date(row.from)}–${date(row.to)}: ${copy.days(row.days)} × ${formatRate(row.rateBp, sep)}% = ${money(row.interest)}${row.forecast ? copy.forecast : ""}`);
    }
    lines.push(`  ${copy.interest}: ${money(invoice.interest)}`);
    if (invoice.compensation) {
      const { tier, anchor } = invoice.compensation;
      const rate = eurRates.get(anchor);
      lines.push(
        rate
          ? `  ${copy.compensation(tier)}: ${tier.eur} EUR × ${formatMid(rate.mid, sep)} (${copy.table(rate)}) = ${money(compensationCents(tier, rate.mid))}`
          : `  ${copy.compensation(tier)}: ${tier.eur} EUR`,
      );
    }
  });

  const totals = noteTotals(invoices, eurRates);
  const eurPart = totals.compensationEur ? `${totals.compensation ? `${money(totals.compensation)} + ` : ""}${totals.compensationEur} EUR` : money(totals.compensation);
  const hasCompensation = invoices.some((invoice) => invoice.compensation);

  lines.push(`${copy.totalInterest}: ${money(totals.interest)}`);
  if (hasCompensation) {
    lines.push(`${copy.totalCompensation}: ${eurPart}`);
    lines.push(`${copy.total}: ${money(totals.interest + totals.compensation)}${totals.compensationEur ? ` + ${totals.compensationEur} EUR` : ""}`);
  }
  lines.push(copy.basis[mode]);
  return lines.join("\n");
}
