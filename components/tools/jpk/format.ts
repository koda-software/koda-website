import type { JpkViewerLabels } from "@/content/types";
import type { Cents, JpkAnalysis, JpkCheck, JpkPurchaseRow, JpkSaleRow } from "@/lib/tools/jpk";

export type Locale = "pl" | "en";

export const thClass = "border-b border-[rgba(11,17,22,0.16)] px-2 py-2 text-left text-[0.82rem] font-semibold text-[var(--color-muted)] print:text-black";
export const tdClass = "border-b border-[rgba(11,17,22,0.08)] px-2 py-2.5 align-top";
export const numClass = "whitespace-nowrap text-right tabular-nums";
export const warnText = "text-[#7a4a00]";
export const inputClass =
  "min-h-11 rounded-[12px] border border-[rgba(11,17,22,0.16)] bg-[var(--color-paper)] px-3 text-[0.95rem] text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--color-blue)]";
export const quietButton =
  "action cursor-pointer border border-[rgba(11,17,22,0.2)] bg-transparent text-[var(--color-ink)] hover:border-[rgba(11,17,22,0.4)] disabled:cursor-not-allowed disabled:opacity-50";

const intlLocale = (locale: Locale) => (locale === "pl" ? "pl-PL" : "en-GB");

const formatters = new Map<string, Intl.NumberFormat>();
function numberFormat(locale: Locale, decimals: number) {
  const key = `${locale}-${decimals}`;
  let format = formatters.get(key);
  if (!format) {
    format = new Intl.NumberFormat(intlLocale(locale), { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    formatters.set(key, format);
  }
  return format;
}

/** A register amount in grosze: "2 495,00 zł". */
export const money = (cents: Cents, locale: Locale) => `${numberFormat(locale, 2).format(cents / 100)} zł`;

/** A declaration amount, whole złoty in the file: "12 345 zł". */
export const zloty = (cents: Cents, locale: Locale) => `${numberFormat(locale, 0).format(Math.round(cents / 100))} zł`;

export const count = (value: number, locale: Locale) => numberFormat(locale, 0).format(value);

export function formatDate(value: string | null, locale: Locale) {
  if (!value) return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return value;
  return locale === "pl" ? `${match[3]}.${match[2]}.${match[1]}` : `${match[3]}/${match[2]}/${match[1]}`;
}

/** DataWytworzeniaJPK is usually UTC; shown in Polish time, as the accounting program would. */
export function formatDateTime(value: string | null, locale: Locale) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(intlLocale(locale), { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Warsaw" }).format(date);
}

export const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));

export function period(analysis: JpkAnalysis, labels: JpkViewerLabels) {
  const { year, month } = analysis.jpk;
  if (!year) return null;
  return month && month >= 1 && month <= 12 ? `${labels.months[month - 1]} ${year}` : String(year);
}

/** What a register row is called in messages: its Lp., or its position when Lp. is missing. */
export const rowNumber = (row: JpkSaleRow | JpkPurchaseRow | undefined, index: number) => row?.lp ?? index + 1;

const SHOWN_ROWS = 10;

export function rowsText(rows: number[], list: ReadonlyArray<JpkSaleRow | JpkPurchaseRow>, labels: JpkViewerLabels, locale: Locale) {
  const shown = rows.slice(0, SHOWN_ROWS).map((index) => count(rowNumber(list[index], index), locale)).join(", ");
  const more = rows.length > SHOWN_ROWS ? ` ${fill(labels.moreRows, { count: count(rows.length - SHOWN_ROWS, locale) })}` : "";
  return fill(labels.rowsList, { list: shown }) + more;
}

export function checkMessage(check: JpkCheck, analysis: JpkAnalysis, labels: JpkViewerLabels, locale: Locale) {
  const copy = labels.checks[check.id];
  const template = copy[check.status] ?? copy.warn ?? copy.info ?? copy.ok ?? check.id;
  const value = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "-";
    if (check.unit === "money") return money(amount, locale);
    if (check.unit === "zl") return zloty(amount, locale);
    return count(amount, locale);
  };
  const diff = typeof check.file === "number" && typeof check.computed === "number" ? check.file - check.computed : null;
  const list = check.register === "purchases" ? (analysis.jpk.purchases ?? []) : (analysis.jpk.sales ?? []);

  const message = fill(template, {
    file: value(check.file),
    computed: value(check.computed),
    diff: diff === null ? "-" : value(diff),
    field: check.field ?? "",
    fieldLabel: check.field ? (labels.fields[check.field] ?? check.field) : "",
    register: check.register ? labels.registerNames[check.register] : "",
    rows: check.rows ? rowsText(check.rows, list, labels, locale) : "",
    names: check.names?.join(", ") ?? "",
    count: count(check.count ?? 0, locale),
    version: analysis.jpk.version,
    period: period(analysis, labels) ?? "",
  });
  return check.hint === "fp" ? `${message} ${labels.fpHint}` : message;
}

type Gtag = (command: "event", name: string, params: Record<string, string>) => void;

/** Counts use of the tool and nothing else: never a file name or anything from the file. */
export function trackToolEvent(name: "tool_used" | "tool_export" | "tool_print") {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", name, { tool: "jpk_viewer" });
}

/** Saves text as a file, client-side. Nothing is uploaded. */
export function download(fileName: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
