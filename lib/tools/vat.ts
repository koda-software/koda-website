/**
 * VAT arithmetic for the VAT calculator, in whole grosze so nothing drifts through floats.
 *
 * Rounding follows art. 106e ust. 11 of the VAT Act: amounts of tax are rounded to the
 * full grosz, half a grosz and above rounds up. Rates are whole percentages; "zw" (exempt)
 * and "np" (out of scope) carry no tax.
 */
import { parseAmount } from "./amount-in-words";

export type RateKey = "23" | "8" | "5" | "0" | "zw" | "np";

export const rateKeys: RateKey[] = ["23", "8", "5", "0", "zw", "np"];

const RATE_PERCENT: Record<RateKey, number> = { "23": 23, "8": 8, "5": 5, "0": 0, zw: 0, np: 0 };

export function ratePercent(rate: RateKey): number {
  return RATE_PERCENT[rate];
}

/** Exempt and out-of-scope sales have no VAT line at all, unlike 0%, which shows 0,00. */
export function hasNoVat(rate: RateKey): boolean {
  return rate === "zw" || rate === "np";
}

/** Grosze from what people type ("1 234,56", "1234.56", "100,-"); null when empty, NaN when unreadable or negative. */
export function parseCents(raw: string): number | null {
  const parsed = parseAmount(raw);
  if (parsed.kind === "empty") return null;
  if (parsed.kind === "error") return NaN;
  return parsed.whole * 100 + parsed.minor;
}

/** Quantities may carry decimals (hours, kilograms): "1,5", "0.25". */
export function parseQuantity(raw: string): number | null {
  const text = raw.replace(/[\s ]/g, "").replace(",", ".");
  if (!text) return null;
  const value = Number(text);
  return Number.isFinite(value) && value >= 0 ? value : NaN;
}

/** Round half up, on a value already expressed in grosze. */
function roundGrosze(value: number): number {
  return Math.round(value + Number.EPSILON * Math.sign(value));
}

export function vatFromNet(net: number, percent: number): number {
  return roundGrosze((net * percent) / 100);
}

export function vatFromGross(gross: number, percent: number): number {
  return roundGrosze((gross * percent) / (100 + percent));
}

/** `123456` as `1 234,56` with a non-breaking space; `separator` lets the English page use a point. */
export function formatCents(cents: number, separator: "," | "." = ","): string {
  const sign = cents < 0 ? "−" : "";
  const abs = Math.abs(cents);
  const whole = String(Math.floor(abs / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, separator === "," ? " " : ",");
  return `${sign}${whole}${separator}${String(abs % 100).padStart(2, "0")}`;
}

export type QuickField = "net" | "vat" | "gross";

export type QuickResult =
  | { kind: "empty" }
  | { kind: "error"; reason: "invalid" | "noVat" }
  | {
      kind: "ok";
      net: number;
      vat: number;
      gross: number;
      /** Set when no net amount produces exactly the gross typed: the nearest ones on either side. */
      nearest: { below: { net: number; gross: number }; above: { net: number; gross: number } } | null;
    };

/** Fills the other two of net, VAT and gross from whichever one was typed. */
export function quickConvert(field: QuickField, cents: number | null, rate: RateKey): QuickResult {
  if (cents === null) return { kind: "empty" };
  if (Number.isNaN(cents)) return { kind: "error", reason: "invalid" };

  const percent = ratePercent(rate);

  if (field === "net") {
    const vat = vatFromNet(cents, percent);
    return { kind: "ok", net: cents, vat, gross: cents + vat, nearest: null };
  }

  if (field === "vat") {
    if (percent === 0) return { kind: "error", reason: "noVat" };
    const net = roundGrosze((cents * 100) / percent);
    return { kind: "ok", net, vat: cents, gross: net + cents, nearest: null };
  }

  /* From gross: VAT computed on the net must give back exactly the gross typed. VAT
     rounding makes gross climb by one or two grosze per grosz of net, so some gross
     amounts have no net at all; then show the closest ones. */
  const estimate = roundGrosze((cents * 100) / (100 + percent));
  let below: { net: number; gross: number } | null = null;
  let above: { net: number; gross: number } | null = null;

  for (let net = estimate - 3; net <= estimate + 3; net += 1) {
    if (net < 0) continue;
    const gross = net + vatFromNet(net, percent);
    if (gross === cents) return { kind: "ok", net, vat: cents - net, gross: cents, nearest: null };
    if (gross < cents && (!below || gross > below.gross)) below = { net, gross };
    if (gross > cents && (!above || gross < above.gross)) above = { net, gross };
  }

  const vat = vatFromGross(cents, percent);
  return { kind: "ok", net: cents - vat, vat, gross: cents, nearest: below && above ? { below, above } : null };
}

export type InvoiceRow = { quantity: string; price: string; rate: RateKey };
export type PriceBasis = "net" | "gross";
export type VatMethod = "sum" | "line";

export type InvoiceLineResult = { valid: boolean; net: number; vat: number; gross: number };
export type RateSummary = { rate: RateKey; net: number; vat: number; gross: number };

export type InvoiceResult = {
  lines: InvoiceLineResult[];
  rates: RateSummary[];
  total: { net: number; vat: number; gross: number };
  /** Total VAT under the method not chosen, to show the difference. */
  otherMethodVat: number;
};

/**
 * An invoice's totals. "sum" taxes the total of each rate once; "line" taxes every line
 * and adds them up, which can differ by a few grosze. With gross prices, VAT is taken
 * out of the gross amount and the gross total stays fixed.
 */
export function invoiceTotals(rows: InvoiceRow[], basis: PriceBasis, method: VatMethod): InvoiceResult {
  const lines = rows.map<InvoiceLineResult>((row) => {
    const quantity = parseQuantity(row.quantity);
    const price = parseCents(row.price);
    const valid = quantity !== null && !Number.isNaN(quantity) && price !== null && !Number.isNaN(price);
    const amount = valid ? roundGrosze(quantity! * price!) : 0;
    const percent = ratePercent(row.rate);

    if (basis === "gross") {
      const vat = vatFromGross(amount, percent);
      return { valid, net: amount - vat, vat, gross: amount };
    }

    const vat = vatFromNet(amount, percent);
    return { valid, net: amount, vat, gross: amount + vat };
  });

  const rates: RateSummary[] = [];
  let sumVat = 0;
  let lineVat = 0;

  for (const rate of rateKeys) {
    const group = lines.filter((line, index) => rows[index].rate === rate && line.valid);
    if (!group.length) continue;

    const percent = ratePercent(rate);
    const groupNet = group.reduce((all, line) => all + line.net, 0);
    const groupGross = group.reduce((all, line) => all + line.gross, 0);
    const groupLineVat = group.reduce((all, line) => all + line.vat, 0);
    const groupSumVat = basis === "gross" ? vatFromGross(groupGross, percent) : vatFromNet(groupNet, percent);

    sumVat += groupSumVat;
    lineVat += groupLineVat;

    const vat = method === "sum" ? groupSumVat : groupLineVat;
    rates.push(
      basis === "gross"
        ? { rate, net: groupGross - vat, vat, gross: groupGross }
        : { rate, net: groupNet, vat, gross: groupNet + vat },
    );
  }

  const total = rates.reduce((all, row) => ({ net: all.net + row.net, vat: all.vat + row.vat, gross: all.gross + row.gross }), {
    net: 0,
    vat: 0,
    gross: 0,
  });

  return { lines, rates, total, otherMethodVat: method === "sum" ? lineVat : sumVat };
}

/** Above this gross amount, payments call for a White List check and, for some goods, split payment. */
export const LARGE_PAYMENT_CENTS = 15_000_00;
