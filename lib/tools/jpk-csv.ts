import {
  PURCHASE_AMOUNT_KEYS,
  SALE_AMOUNT_KEYS,
  type Cents,
  type JpkPurchaseRow,
  type JpkSaleRow,
  type KsefMark,
  type PurchaseAmountKey,
  type SaleAmountKey,
} from "./jpk";

/** Column headers for the register CSV files; amount columns get the K code plus this short label. */
export type JpkCsvLabels = {
  sales: Record<"lp" | "country" | "taxId" | "name" | "document" | "issueDate" | "saleDate" | "ksef" | "docType" | "gtu" | "procedures" | "badDebt" | "dueDate" | "paidDate" | "marginGross", string>;
  purchases: Record<"lp" | "country" | "taxId" | "name" | "document" | "issueDate" | "receivedDate" | "ksef" | "docType" | "imported" | "marginPurchase", string>;
  amounts: Record<SaleAmountKey | PurchaseAmountKey, string>;
  yes: string;
};

/** Text is guarded and quoted; numbers and formatted amounts (`raw`) are written as they are. */
type Cell = string | number | null | { raw: string };

/** Excel opens a CSV with a ";" separator and a UTF-8 BOM directly in Polish locales. */
const SEPARATOR = ";";
const BOM = "﻿";

/**
 * A text cell. One that starts with = + - @ (or a tab or carriage return) would run as a
 * formula in a spreadsheet, so it gets a leading apostrophe (CSV injection).
 */
function textCell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return /[;"\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

function amountCell(cents: Cents, locale: "pl" | "en"): string {
  const sign = cents < 0 ? "-" : "";
  const abs = Math.abs(cents);
  return `${sign}${Math.floor(abs / 100)}${locale === "pl" ? "," : "."}${String(abs % 100).padStart(2, "0")}`;
}

const amountOrNull = (value: Cents | null | undefined, locale: "pl" | "en"): Cell =>
  value === null || value === undefined ? null : { raw: amountCell(value, locale) };

const ksefCell = (mark: KsefMark) => (mark ? (mark.kind === "number" ? mark.number : mark.kind) : "");

function toCsv(header: string[], rows: Cell[][]): string {
  const line = (cells: Cell[]) =>
    cells.map((cell) => (cell === null ? "" : typeof cell === "number" ? String(cell) : typeof cell === "object" ? cell.raw : textCell(cell))).join(SEPARATOR);
  return BOM + [header, ...rows].map(line).join("\r\n") + "\r\n";
}

/** Every sales field in schema order, one K_ column per amount. */
export function salesCsv(rows: readonly JpkSaleRow[], labels: JpkCsvLabels, locale: "pl" | "en"): string {
  const l = labels.sales;
  const header = [
    l.lp, l.country, l.taxId, l.name, l.document, l.issueDate, l.saleDate, l.ksef, l.docType, l.gtu, l.procedures, l.badDebt, l.dueDate, l.paidDate,
    ...SALE_AMOUNT_KEYS.map((key) => `${key} ${labels.amounts[key]}`),
    l.marginGross,
  ];

  return toCsv(
    header,
    rows.map((row) => [
      row.lp,
      row.country,
      row.taxId,
      row.name,
      row.document,
      row.issueDate,
      row.saleDate,
      ksefCell(row.ksef),
      row.docType,
      row.gtu.map((code) => `GTU_${String(code).padStart(2, "0")}`).join(", "),
      row.procedures.join(", "),
      row.badDebt ? labels.yes : null,
      row.badDebt?.dueDate ?? null,
      row.badDebt?.paidDate ?? null,
      ...SALE_AMOUNT_KEYS.map((key) => amountOrNull(row.amounts[key], locale)),
      amountOrNull(row.marginGross, locale),
    ] satisfies Cell[]),
  );
}

/** Every purchase field in schema order, one K_ column per amount. */
export function purchasesCsv(rows: readonly JpkPurchaseRow[], labels: JpkCsvLabels, locale: "pl" | "en"): string {
  const l = labels.purchases;
  const header = [
    l.lp, l.country, l.taxId, l.name, l.document, l.issueDate, l.receivedDate, l.ksef, l.docType, l.imported,
    ...PURCHASE_AMOUNT_KEYS.map((key) => `${key} ${labels.amounts[key]}`),
    l.marginPurchase,
  ];

  return toCsv(
    header,
    rows.map((row) => [
      row.lp,
      row.country,
      row.taxId,
      row.name,
      row.document,
      row.issueDate,
      row.receivedDate,
      ksefCell(row.ksef),
      row.docType,
      row.imported ? labels.yes : null,
      ...PURCHASE_AMOUNT_KEYS.map((key) => amountOrNull(row.amounts[key], locale)),
      amountOrNull(row.marginPurchase, locale),
    ] satisfies Cell[]),
  );
}
