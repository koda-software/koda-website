/**
 * Reads a JPK_VAT file with a declaration (JPK_V7M and JPK_V7K, schema versions (3) and
 * (2), and (1) on a best-effort basis) into a plain model, then sums the registers and
 * runs arithmetic checks on it.
 *
 * The parser is fed text in chunks (see `jpk-read.ts`), so it runs the same in a Web
 * Worker, on the main thread and in `node --test`. It keeps at most one register row
 * as a tree at a time. Elements are matched by local name, ignoring namespaces. Fields
 * it does not know are collected and reported, never fatal, so a new schema revision
 * degrades instead of failing.
 *
 * Every amount is an integer in grosze, parsed from the decimal string, never through
 * `parseFloat`. Declaration amounts are whole złoty in the file and are converted to
 * grosze too, so one formatter and one comparison path serve both.
 */

import { KSEF_NUMBER, child, local, text, type XmlNode } from "./xml";
import { XmlSyntaxError, createXmlStream } from "./xml-stream";
import { isValidNip, normalizeNip } from "./white-list";

export type Cents = number;
export type JpkStructure = "JPK_V7M" | "JPK_V7K";
/** null: schema (1) or (2), which has no KSeF choice, or a (3) row that leaves it out. */
export type KsefMark = { kind: "number"; number: string; valid: boolean } | { kind: "OFF" | "BFK" | "DI" } | null;
export type KsefKind = "number" | "OFF" | "BFK" | "DI" | "missing";

export const SALE_AMOUNT_KEYS = [
  "K_10", "K_11", "K_12", "K_13", "K_14", "K_15", "K_16", "K_17", "K_18", "K_19", "K_20", "K_21", "K_22", "K_23", "K_24",
  "K_25", "K_26", "K_27", "K_28", "K_29", "K_30", "K_31", "K_32", "K_33", "K_34", "K_35", "K_36", "K_360",
] as const;
export const PURCHASE_AMOUNT_KEYS = ["K_40", "K_41", "K_42", "K_43", "K_44", "K_45", "K_46", "K_47"] as const;
export type SaleAmountKey = (typeof SALE_AMOUNT_KEYS)[number];
export type PurchaseAmountKey = (typeof PURCHASE_AMOUNT_KEYS)[number];

export const SALE_DOC_TYPES = ["RO", "WEW", "FP"] as const;
export const PURCHASE_DOC_TYPES = ["MK", "VAT_RR", "WEW"] as const;
export const GTU_CODES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const;
export const PROCEDURES = ["WSTO_EE", "IED", "TP", "TT_WNT", "TT_D", "MR_T", "MR_UZ", "I_42", "I_63", "B_SPV", "B_SPV_DOSTAWA", "B_MPV_PROWIZJA"] as const;
export type Procedure = (typeof PROCEDURES)[number];

/** Declaration positions in form order. A code outside this list still renders, labelled with the code. */
export const DECLARATION_FIELDS = [
  "P_10", "P_11", "P_12", "P_13", "P_14", "P_15", "P_16", "P_17", "P_18", "P_19", "P_20", "P_21", "P_22", "P_23", "P_24",
  "P_25", "P_26", "P_27", "P_28", "P_29", "P_30", "P_31", "P_32", "P_33", "P_34", "P_35", "P_36", "P_360", "P_37", "P_38",
  "P_39", "P_40", "P_41", "P_42", "P_43", "P_44", "P_45", "P_46", "P_47", "P_48",
  "P_49", "P_50", "P_51", "P_52", "P_53", "P_54", "P_540", "P_55", "P_56", "P_560", "P_57", "P_58", "P_59", "P_60", "P_61", "P_62",
  "P_63", "P_64", "P_65", "P_66", "P_660", "P_67", "P_68", "P_69", "P_ORDZU",
] as const;

/** Groups of the VAT-7 form, by the first and last position in each. */
export const DECLARATION_GROUPS = {
  output: ["P_10", "P_38"],
  input: ["P_39", "P_48"],
  settlement: ["P_49", "P_62"],
  extra: ["P_63", "P_ORDZU"],
} as const;

/** Positions that are a "1" flag (TWybor1), not an amount. */
const FLAG_FIELDS = new Set(["P_540", "P_55", "P_56", "P_560", "P_57", "P_58", "P_59", "P_63", "P_64", "P_65", "P_66", "P_660", "P_67"]);

/** Each declaration position and the register field whose sum feeds it. */
export const DECLARATION_FROM_REGISTER: ReadonlyArray<readonly [p: string, k: SaleAmountKey | PurchaseAmountKey]> = [
  ...SALE_AMOUNT_KEYS.map((key) => [`P_${key.slice(2)}`, key] as const),
  ...PURCHASE_AMOUNT_KEYS.map((key) => [`P_${key.slice(2)}`, key] as const),
];

export const MAX_JPK_FILE_BYTES = 100 * 1024 * 1024;

export type JpkSaleRow = {
  lp: number | null;
  country: string | null;
  taxId: string;
  name: string;
  document: string;
  issueDate: string | null;
  saleDate: string | null;
  ksef: KsefMark;
  docType: (typeof SALE_DOC_TYPES)[number] | null;
  gtu: number[];
  procedures: Procedure[];
  badDebt: { dueDate: string | null; paidDate: string | null } | null;
  amounts: Partial<Record<SaleAmountKey, Cents>>;
  marginGross: Cents | null;
};

export type JpkPurchaseRow = {
  lp: number | null;
  country: string | null;
  taxId: string;
  name: string;
  document: string;
  issueDate: string | null;
  receivedDate: string | null;
  ksef: KsefMark;
  docType: (typeof PURCHASE_DOC_TYPES)[number] | null;
  imported: boolean;
  amounts: Partial<Record<PurchaseAmountKey, Cents>>;
  marginPurchase: Cents | null;
};

export type JpkTaxpayer = { kind: "company" | "person"; nip: string | null; name: string; email: string | null; phone: string | null };

export type JpkDeclaration = {
  formCode: string | null;
  quarter: number | null;
  /** Declaration amounts, whole złoty × 100. */
  amounts: Partial<Record<string, Cents>>;
  /** Flag positions set to 1, such as P_540 or P_55. */
  flags: string[];
  texts: { P_61: string | null; P_ORDZU: string | null };
};

export type JpkVat = {
  structure: JpkStructure;
  /** "3", "2" or "1". */
  version: string;
  /** "JPK_V7M (3)". */
  systemCode: string;
  namespace: string | null;
  purpose: "1" | "2" | null;
  createdAt: string | null;
  systemName: string | null;
  taxOfficeCode: string | null;
  year: number | null;
  month: number | null;
  taxpayer: JpkTaxpayer | null;
  declaration: JpkDeclaration | null;
  /** null: the file has no register (Ewidencja). */
  sales: JpkSaleRow[] | null;
  salesCtrl: { rows: number | null; tax: Cents | null } | null;
  purchases: JpkPurchaseRow[] | null;
  purchasesCtrl: { rows: number | null; tax: Cents | null } | null;
  /** Element names the viewer skipped (at most 20), for an info check. */
  unknown: string[];
};

export type JpkParseResult =
  | { kind: "ok"; jpk: JpkVat }
  | { kind: "error"; reason: "xml" | "notJpk" | "tooLarge" | "read" }
  /** Another JPK structure, by its system code: "JPK_FA (4)", "JPK_KR_PD (1)", "JPK_VAT (3)" … */
  | { kind: "unsupported"; structure: string };

/* ---------- amounts ---------- */

/** "-1234.5" → -123450. Rejects "1,5", "1 000" and more than two significant decimals. */
export function parseAmount(value: string | null | undefined): Cents | null {
  if (value === null || value === undefined) return null;
  const match = /^([+-]?)(\d*)(?:\.(\d*))?$/.exec(value.trim());
  if (!match || (!match[2] && !match[3])) return null;

  let fraction = match[3] ?? "";
  if (fraction.length > 2) {
    if (/[^0]/.test(fraction.slice(2))) return null;
    fraction = fraction.slice(0, 2);
  }
  const cents = Number(match[2] || "0") * 100 + Number(fraction.padEnd(2, "0"));
  return match[1] === "-" && cents !== 0 ? -cents : cents;
}

/** To whole złoty, as tax amounts are rounded (art. 63 § 1 Ordynacji podatkowej): 50 groszy and up rounds up, half away from zero. */
export function roundToZloty(cents: Cents): Cents {
  const rounded = Math.floor((Math.abs(cents) + 50) / 100) * 100;
  return cents < 0 && rounded !== 0 ? -rounded : rounded;
}

const sumOf = (amounts: Partial<Record<string, Cents>>, keys: readonly string[]) => keys.reduce((total, key) => total + (amounts[key] ?? 0), 0);

/** The same set as P_37: K_12 and K_14 are "of which" subsets and are left out. */
const SALE_BASE_KEYS = ["K_10", "K_11", "K_13", "K_15", "K_17", "K_19", "K_21", "K_22", "K_23", "K_25", "K_27", "K_29", "K_31"] as const;
const SALE_TAX_PLUS = ["K_16", "K_18", "K_20", "K_24", "K_26", "K_28", "K_30", "K_32", "K_33", "K_34"] as const;
const SALE_TAX_MINUS = ["K_35", "K_36", "K_360"] as const;
const PURCHASE_NET_KEYS = ["K_40", "K_42"] as const;
const PURCHASE_TAX_KEYS = ["K_41", "K_43", "K_44", "K_45", "K_46", "K_47"] as const;

export const saleBase = (row: JpkSaleRow) => sumOf(row.amounts, SALE_BASE_KEYS);
export const saleTax = (row: JpkSaleRow) => sumOf(row.amounts, SALE_TAX_PLUS) - sumOf(row.amounts, SALE_TAX_MINUS);
export const purchaseNet = (row: JpkPurchaseRow) => sumOf(row.amounts, PURCHASE_NET_KEYS);
export const purchaseTax = (row: JpkPurchaseRow) => sumOf(row.amounts, PURCHASE_TAX_KEYS);

const outputTaxOf = (totals: Partial<Record<string, Cents>>) => sumOf(totals, SALE_TAX_PLUS) - sumOf(totals, SALE_TAX_MINUS);
const inputTaxOf = (totals: Partial<Record<string, Cents>>) => sumOf(totals, PURCHASE_TAX_KEYS);

/* ---------- parser ---------- */

const SALE_KEY_SET = new Set<string>(SALE_AMOUNT_KEYS);
const PURCHASE_KEY_SET = new Set<string>(PURCHASE_AMOUNT_KEYS);
const PROCEDURE_SET = new Set<string>(PROCEDURES);
const MAX_UNKNOWN = 20;

const integer = (value: string | null | undefined) => (value && /^\d+$/.test(value.trim()) ? Number(value.trim()) : null);
const orNull = (value: string) => value || null;

function ksefMark(name: string, value: string): KsefMark {
  if (name === "NrKSeF") return { kind: "number", number: value, valid: KSEF_NUMBER.test(value) };
  return value === "1" ? { kind: name as "OFF" | "BFK" | "DI" } : null;
}

function parseSale(node: XmlNode, unknown: (name: string) => void): JpkSaleRow {
  const row: JpkSaleRow = {
    lp: null, country: null, taxId: "", name: "", document: "", issueDate: null, saleDate: null, ksef: null,
    docType: null, gtu: [], procedures: [], badDebt: null, amounts: {}, marginGross: null,
  };
  let badDebt = false;
  let dueDate: string | null = null;
  let paidDate: string | null = null;

  for (const item of node.children) {
    const name = local(item.name);
    const value = item.text.trim();
    switch (name) {
      case "LpSprzedazy": row.lp = integer(value); break;
      case "KodKrajuNadaniaTIN": row.country = orNull(value); break;
      case "NrKontrahenta": row.taxId = value; break;
      case "NazwaKontrahenta": row.name = value; break;
      case "DowodSprzedazy": row.document = value; break;
      case "DataWystawienia": row.issueDate = orNull(value); break;
      case "DataSprzedazy": row.saleDate = orNull(value); break;
      case "NrKSeF": case "OFF": case "BFK": case "DI": row.ksef = ksefMark(name, value) ?? row.ksef; break;
      case "TypDokumentu":
        if ((SALE_DOC_TYPES as readonly string[]).includes(value)) row.docType = value as JpkSaleRow["docType"];
        else unknown(`TypDokumentu ${value}`);
        break;
      case "KorektaPodstawyOpodt": badDebt = value === "1"; break;
      case "TerminPlatnosci": dueDate = orNull(value); break;
      case "DataZaplaty": paidDate = orNull(value); break;
      case "SprzedazVAT_Marza": row.marginGross = parseAmount(value); break;
      default: {
        const gtu = /^GTU_(\d{2})$/.exec(name);
        if (gtu && Number(gtu[1]) >= 1 && Number(gtu[1]) <= 13) {
          if (value === "1") row.gtu.push(Number(gtu[1]));
        } else if (PROCEDURE_SET.has(name)) {
          if (value === "1") row.procedures.push(name as Procedure);
        } else if (SALE_KEY_SET.has(name)) {
          const amount = parseAmount(value);
          if (amount !== null) row.amounts[name as SaleAmountKey] = amount;
        } else {
          unknown(name);
        }
      }
    }
  }

  if (badDebt) row.badDebt = { dueDate, paidDate };
  return row;
}

function parsePurchase(node: XmlNode, unknown: (name: string) => void): JpkPurchaseRow {
  const row: JpkPurchaseRow = {
    lp: null, country: null, taxId: "", name: "", document: "", issueDate: null, receivedDate: null, ksef: null,
    docType: null, imported: false, amounts: {}, marginPurchase: null,
  };

  for (const item of node.children) {
    const name = local(item.name);
    const value = item.text.trim();
    switch (name) {
      case "LpZakupu": row.lp = integer(value); break;
      case "KodKrajuNadaniaTIN": row.country = orNull(value); break;
      case "NrDostawcy": row.taxId = value; break;
      case "NazwaDostawcy": row.name = value; break;
      case "DowodZakupu": row.document = value; break;
      case "DataZakupu": row.issueDate = orNull(value); break;
      case "DataWplywu": row.receivedDate = orNull(value); break;
      case "NrKSeF": case "OFF": case "BFK": case "DI": row.ksef = ksefMark(name, value) ?? row.ksef; break;
      case "DokumentZakupu":
        if ((PURCHASE_DOC_TYPES as readonly string[]).includes(value)) row.docType = value as JpkPurchaseRow["docType"];
        else unknown(`DokumentZakupu ${value}`);
        break;
      case "IMP": row.imported = value === "1"; break;
      case "ZakupVAT_Marza": row.marginPurchase = parseAmount(value); break;
      default:
        if (PURCHASE_KEY_SET.has(name)) {
          const amount = parseAmount(value);
          if (amount !== null) row.amounts[name as PurchaseAmountKey] = amount;
        } else {
          unknown(name);
        }
    }
  }

  return row;
}

function parseTaxpayer(node: XmlNode | null): JpkTaxpayer | null {
  const company = child(node, "OsobaNiefizyczna");
  const person = child(node, "OsobaFizyczna");
  const source = company ?? person;
  if (!source) return null;

  return {
    kind: company ? "company" : "person",
    nip: text(source, "NIP"),
    name: company ? (text(source, "PelnaNazwa") ?? "") : [text(source, "ImiePierwsze"), text(source, "Nazwisko")].filter(Boolean).join(" "),
    email: text(source, "Email"),
    phone: text(source, "Telefon"),
  };
}

function parseDeclaration(node: XmlNode, unknown: (name: string) => void): JpkDeclaration {
  const header = child(node, "Naglowek");
  const form = child(header, "KodFormularzaDekl");
  const declaration: JpkDeclaration = {
    formCode: form?.attrs.kodSystemowy?.trim() || form?.text.trim() || null,
    quarter: integer(text(header, "Kwartal")),
    amounts: {},
    flags: [],
    texts: { P_61: null, P_ORDZU: null },
  };

  for (const item of child(node, "PozycjeSzczegolowe")?.children ?? []) {
    const name = local(item.name);
    const value = item.text.trim();
    if (name === "P_61" || name === "P_ORDZU") {
      declaration.texts[name] = orNull(value);
    } else if (FLAG_FIELDS.has(name)) {
      if (value === "1") declaration.flags.push(name);
    } else {
      const amount = parseAmount(value);
      if (amount !== null) declaration.amounts[name] = amount;
      else unknown(name);
    }
  }

  return declaration;
}

/** Thrown inside the stream callbacks to stop reading a file the viewer cannot open. */
class StopReading extends Error {}

/** Streaming builder: feed it chunks, then call finish(). Used by the worker and by tests. */
export function createJpkParser(): { write(chunk: string): void; finish(): JpkParseResult } {
  let failure: JpkParseResult | null = null;
  let header: { structure: JpkStructure; version: string; systemCode: string; node: XmlNode } | null = null;
  let taxpayer: JpkTaxpayer | null = null;
  let declaration: JpkDeclaration | null = null;
  let hasRegister = false;
  const sales: JpkSaleRow[] = [];
  const purchases: JpkPurchaseRow[] = [];
  let salesCtrl: JpkVat["salesCtrl"] = null;
  let purchasesCtrl: JpkVat["purchasesCtrl"] = null;
  const unknownNames = new Set<string>();
  const unknown = (name: string) => {
    if (unknownNames.size < MAX_UNKNOWN) unknownNames.add(name);
  };

  const stop = (result: JpkParseResult): never => {
    failure = result;
    throw new StopReading();
  };

  const readHeader = (node: XmlNode) => {
    const form = child(node, "KodFormularza");
    const systemCode = form?.attrs.kodSystemowy?.trim() ?? "";
    const match = /^JPK_V7([MK])\s*\((\d+)\)$/.exec(systemCode);
    if (match) {
      header = { structure: `JPK_V7${match[1] as "M" | "K"}`, version: match[2], systemCode, node };
      return;
    }
    if (systemCode) stop({ kind: "unsupported", structure: systemCode });
    const formText = form?.text.trim();
    if (formText) stop({ kind: "unsupported", structure: formText });
    stop({ kind: "error", reason: "notJpk" });
  };

  const stream = createXmlStream(
    {
      onElement(node, path) {
        if (path.length === 2) {
          if (node.name === "Naglowek") readHeader(node);
          else if (!header) stop({ kind: "error", reason: "notJpk" });
          else if (node.name === "Podmiot1") taxpayer = parseTaxpayer(node);
          else if (node.name === "Deklaracja") declaration = parseDeclaration(node, unknown);
          return;
        }
        if (!header) stop({ kind: "error", reason: "notJpk" });
        switch (node.name) {
          case "SprzedazWiersz": sales.push(parseSale(node, unknown)); break;
          case "ZakupWiersz": purchases.push(parsePurchase(node, unknown)); break;
          case "SprzedazCtrl": salesCtrl = { rows: integer(text(node, "LiczbaWierszySprzedazy")), tax: parseAmount(text(node, "PodatekNalezny")) }; break;
          case "ZakupCtrl": purchasesCtrl = { rows: integer(text(node, "LiczbaWierszyZakupow")), tax: parseAmount(text(node, "PodatekNaliczony")) }; break;
          default: unknown(node.name);
        }
      },
    },
    {
      collect(path) {
        if (path.length === 1) {
          if (path[0] !== "JPK") stop({ kind: "error", reason: "notJpk" });
          return false;
        }
        if (path.length === 2) {
          if (path[1] === "Ewidencja") {
            hasRegister = true;
            return false;
          }
          if (path[1] === "Naglowek" || path[1] === "Podmiot1" || path[1] === "Deklaracja") return true;
          unknown(path[1]);
          return false;
        }
        return path.length === 3 && path[1] === "Ewidencja";
      },
    },
  );

  const guard = (run: () => void) => {
    if (failure) return;
    try {
      run();
    } catch (error) {
      if (error instanceof StopReading) return;
      if (error instanceof XmlSyntaxError) {
        failure = { kind: "error", reason: "xml" };
        return;
      }
      throw error;
    }
  };

  return {
    write(chunk) {
      guard(() => stream.write(chunk));
    },
    finish() {
      guard(() => stream.end());
      if (failure) return failure;
      if (!header) return { kind: "error", reason: "notJpk" };

      const { structure, version, systemCode, node } = header as { structure: JpkStructure; version: string; systemCode: string; node: XmlNode };
      const root = stream.root();
      const purpose = text(node, "CelZlozenia");

      return {
        kind: "ok",
        jpk: {
          structure,
          version,
          systemCode,
          namespace: root ? (root.prefix ? root.attrs[root.prefix] : root.attrs.xmlns) ?? null : null,
          purpose: purpose === "1" || purpose === "2" ? purpose : null,
          createdAt: text(node, "DataWytworzeniaJPK"),
          systemName: text(node, "NazwaSystemu"),
          taxOfficeCode: text(node, "KodUrzedu"),
          year: integer(text(node, "Rok")),
          month: integer(text(node, "Miesiac")),
          taxpayer,
          declaration,
          sales: hasRegister ? sales : null,
          salesCtrl,
          purchases: hasRegister ? purchases : null,
          purchasesCtrl,
          unknown: [...unknownNames],
        },
      };
    },
  };
}

/** Convenience for tests and small strings: write(xml) + finish(). */
export function parseJpkText(xml: string): JpkParseResult {
  const parser = createJpkParser();
  parser.write(xml);
  return parser.finish();
}

/* ---------- summary ---------- */

export type KsefCounts = Record<KsefKind, number>;
export type VatRateKey = "23" | "8" | "5" | "0" | "zw" | "np" | "wdt" | "export" | "wnt" | "import" | "importServices" | "reverseCharge";
export type JpkContractor = { country: string | null; taxId: string; name: string; rows: number; base: Cents; tax: Cents };

export type JpkSummary = {
  /** Register totals without FP rows (invoices for receipts), which the control totals and the declaration leave out. */
  salesTotals: Record<SaleAmountKey, Cents>;
  salesTotalsFp: Record<SaleAmountKey, Cents>;
  purchaseTotals: Record<PurchaseAmountKey, Cents>;
  salesBase: Cents;
  /** The PodatekNalezny formula over non-FP rows. */
  computedOutputTax: Cents;
  /** The same formula over FP rows only. */
  fpOutputTax: Cents;
  fpRows: number;
  purchaseNet: Cents;
  computedInputTax: Cents;
  /** Non-zero rates only. */
  vatByRate: Array<{ key: VatRateKey; base: Cents; tax: Cents | null }>;
  /** null for schema (1) and (2), which have no KSeF markers. */
  ksef: { sales: KsefCounts; purchases: KsefCounts } | null;
  gtu: Array<{ code: number; rows: number; base: Cents }>;
  procedures: Array<{ code: Procedure; rows: number }>;
  docTypes: { sales: Array<{ code: string; rows: number }>; purchases: Array<{ code: string; rows: number }> };
  topCustomers: JpkContractor[];
  topSuppliers: JpkContractor[];
};

const VAT_RATES: ReadonlyArray<[VatRateKey, readonly SaleAmountKey[], readonly SaleAmountKey[] | null]> = [
  ["23", ["K_19"], ["K_20"]],
  ["8", ["K_17"], ["K_18"]],
  ["5", ["K_15"], ["K_16"]],
  ["0", ["K_13"], null],
  ["zw", ["K_10"], null],
  ["np", ["K_11"], null],
  ["wdt", ["K_21"], null],
  ["export", ["K_22"], null],
  ["wnt", ["K_23"], ["K_24"]],
  ["import", ["K_25"], ["K_26"]],
  ["importServices", ["K_27", "K_29"], ["K_28", "K_30"]],
  ["reverseCharge", ["K_31"], ["K_32"]],
];

const zeroTotals = <K extends string>(keys: readonly K[]) => Object.fromEntries(keys.map((key) => [key, 0])) as Record<K, Cents>;
const normalise = (value: string) => value.toUpperCase().replace(/\s+/g, "");
const noTaxId = (taxId: string) => !taxId || normalise(taxId) === "BRAK";

export const isV3 = (jpk: JpkVat) => Number(jpk.version) >= 3;

function ksefKind(mark: KsefMark): KsefKind {
  return mark ? mark.kind : "missing";
}

function countKsef(rows: ReadonlyArray<{ ksef: KsefMark }>): KsefCounts {
  const counts: KsefCounts = { number: 0, OFF: 0, BFK: 0, DI: 0, missing: 0 };
  for (const row of rows) counts[ksefKind(row.ksef)] += 1;
  return counts;
}

function topContractors<R extends { country: string | null; taxId: string; name: string }>(
  rows: readonly R[],
  include: (row: R) => boolean,
  base: (row: R) => Cents,
  tax: (row: R) => Cents,
): JpkContractor[] {
  const byKey = new Map<string, JpkContractor>();
  for (const row of rows) {
    if (!include(row)) continue;
    const key = noTaxId(row.taxId) ? `name:${normalise(row.name)}` : normalise(`${row.country ?? "PL"}${row.taxId}`);
    const entry = byKey.get(key) ?? { country: row.country, taxId: row.taxId, name: row.name, rows: 0, base: 0, tax: 0 };
    entry.rows += 1;
    entry.base += base(row);
    entry.tax += tax(row);
    byKey.set(key, entry);
  }
  return [...byKey.values()].sort((a, b) => b.base - a.base || a.name.localeCompare(b.name)).slice(0, 10);
}

const countsList = (counts: Map<string, number>) => [...counts].map(([code, rows]) => ({ code, rows }));

export function summarizeJpk(jpk: JpkVat): JpkSummary {
  const sales = jpk.sales ?? [];
  const purchases = jpk.purchases ?? [];
  const salesTotals = zeroTotals(SALE_AMOUNT_KEYS);
  const salesTotalsFp = zeroTotals(SALE_AMOUNT_KEYS);
  const purchaseTotals = zeroTotals(PURCHASE_AMOUNT_KEYS);
  const gtu = new Map<number, { rows: number; base: Cents }>();
  const procedures = new Map<Procedure, number>();
  const salesDocs = new Map<string, number>();
  const purchaseDocs = new Map<string, number>();
  let fpRows = 0;

  for (const row of sales) {
    if (row.docType) salesDocs.set(row.docType, (salesDocs.get(row.docType) ?? 0) + 1);
    const fp = row.docType === "FP";
    const totals = fp ? salesTotalsFp : salesTotals;
    for (const key in row.amounts) totals[key as SaleAmountKey] += row.amounts[key as SaleAmountKey]!;
    if (fp) {
      fpRows += 1;
      continue;
    }
    const base = saleBase(row);
    for (const code of row.gtu) {
      const entry = gtu.get(code) ?? { rows: 0, base: 0 };
      entry.rows += 1;
      entry.base += base;
      gtu.set(code, entry);
    }
    for (const code of row.procedures) procedures.set(code, (procedures.get(code) ?? 0) + 1);
  }

  for (const row of purchases) {
    if (row.docType) purchaseDocs.set(row.docType, (purchaseDocs.get(row.docType) ?? 0) + 1);
    if (row.imported) purchaseDocs.set("IMP", (purchaseDocs.get("IMP") ?? 0) + 1);
    for (const key in row.amounts) purchaseTotals[key as PurchaseAmountKey] += row.amounts[key as PurchaseAmountKey]!;
  }

  const order = (list: Array<{ code: string; rows: number }>, codes: readonly string[]) => list.sort((a, b) => codes.indexOf(a.code) - codes.indexOf(b.code));
  const isContractor = (row: { docType: string | null }) => row.docType !== "RO" && row.docType !== "WEW" && row.docType !== "FP";

  return {
    salesTotals,
    salesTotalsFp,
    purchaseTotals,
    salesBase: sumOf(salesTotals, SALE_BASE_KEYS),
    computedOutputTax: outputTaxOf(salesTotals),
    fpOutputTax: outputTaxOf(salesTotalsFp),
    fpRows,
    purchaseNet: sumOf(purchaseTotals, PURCHASE_NET_KEYS),
    computedInputTax: inputTaxOf(purchaseTotals),
    vatByRate: VAT_RATES.flatMap(([key, baseKeys, taxKeys]) => {
      const base = sumOf(salesTotals, baseKeys);
      const tax = taxKeys ? sumOf(salesTotals, taxKeys) : null;
      return base || tax ? [{ key, base, tax }] : [];
    }),
    ksef: isV3(jpk) ? { sales: countKsef(sales), purchases: countKsef(purchases) } : null,
    gtu: [...gtu].sort(([a], [b]) => a - b).map(([code, entry]) => ({ code, ...entry })),
    procedures: [...procedures].sort(([a], [b]) => PROCEDURES.indexOf(a) - PROCEDURES.indexOf(b)).map(([code, rows]) => ({ code, rows })),
    docTypes: {
      sales: order(countsList(salesDocs), SALE_DOC_TYPES),
      purchases: order(countsList(purchaseDocs), [...PURCHASE_DOC_TYPES, "IMP"]),
    },
    topCustomers: topContractors(sales, isContractor, saleBase, saleTax),
    topSuppliers: topContractors(purchases, (row) => row.docType !== "WEW", purchaseNet, purchaseTax),
  };
}

/** The register value a declaration position is compared with: Σ K over non-FP rows, rounded to whole złoty. */
export function registerValue(summary: JpkSummary, k: SaleAmountKey | PurchaseAmountKey): Cents {
  const total = k in summary.salesTotals ? summary.salesTotals[k as SaleAmountKey] : summary.purchaseTotals[k as PurchaseAmountKey];
  return roundToZloty(total);
}

/* ---------- checks ---------- */

export type JpkCheckId =
  | "salesCount" | "salesTax" | "purchasesCount" | "purchasesTax" | "lpSequence"
  | "declVsRegister" | "declVsRegisterV7K" | "p37" | "p38" | "p48" | "p51" | "p53" | "p62" | "payAndExcess" | "p60" | "p68p69Sign" | "p68p69"
  | "ksefInvalid" | "ksefDuplicate" | "ksefMissing" | "ksefDi" | "ksefOff"
  | "duplicates" | "missingTaxId" | "invalidNip" | "period" | "unknown";

export type JpkCheck = {
  id: JpkCheckId;
  /** warn: a real inconsistency; info: worth knowing, or a rule we derived ourselves; ok: compared and fine. */
  status: "ok" | "warn" | "info";
  register?: "sales" | "purchases";
  /** The declaration position compared, such as "P_42". */
  field?: string;
  /** How to show `file` and `computed`: a count, an amount in grosze, or a declaration amount in whole złoty. */
  unit?: "count" | "money" | "zl";
  /** The value in the file. */
  file?: number | null;
  /** The value we computed. */
  computed?: number | null;
  /** Indexes (0-based) of the register rows concerned. */
  rows?: number[];
  count?: number;
  names?: string[];
  /** The control tax looks computed with FP rows included. */
  hint?: "fp";
};

type Register = "sales" | "purchases";

const STATUS_ORDER = { warn: 0, info: 1, ok: 2 } as const;

/** Indexes of rows sharing a key with at least one other row. */
function repeated(keys: ReadonlyArray<string | null>): number[] {
  const groups = new Map<string, number[]>();
  keys.forEach((key, index) => {
    if (key === null) return;
    const group = groups.get(key);
    if (group) group.push(index);
    else groups.set(key, [index]);
  });
  return [...groups.values()].filter((group) => group.length > 1).flat().sort((a, b) => a - b);
}

const indexesWhere = <R>(rows: readonly R[], test: (row: R) => boolean) => rows.flatMap((row, index) => (test(row) ? [index] : []));

function registerChecks(jpk: JpkVat, register: Register, rows: ReadonlyArray<JpkSaleRow | JpkPurchaseRow>): JpkCheck[] {
  const checks: JpkCheck[] = [];
  if (!rows.length) return checks;
  const add = (check: Omit<JpkCheck, "register">) => checks.push({ ...check, register });

  const gap = rows.findIndex((row, index) => row.lp !== index + 1);
  add(gap === -1 ? { id: "lpSequence", status: "ok" } : { id: "lpSequence", status: "warn", unit: "count", file: rows[gap].lp, computed: gap + 1, rows: [gap] });

  if (isV3(jpk)) {
    const invalid = indexesWhere(rows, (row) => row.ksef?.kind === "number" && !row.ksef.valid);
    add(invalid.length ? { id: "ksefInvalid", status: "warn", rows: invalid } : { id: "ksefInvalid", status: "ok" });
    const duplicate = repeated(rows.map((row) => (row.ksef?.kind === "number" ? row.ksef.number.toUpperCase() : null)));
    add(duplicate.length ? { id: "ksefDuplicate", status: "warn", rows: duplicate } : { id: "ksefDuplicate", status: "ok" });
    const missing = indexesWhere(rows, (row) => row.ksef === null);
    add(missing.length ? { id: "ksefMissing", status: "warn", rows: missing } : { id: "ksefMissing", status: "ok" });
    const off = indexesWhere(rows, (row) => row.ksef?.kind === "OFF");
    if (off.length) add({ id: "ksefOff", status: "info", rows: off, count: off.length });
    if (register === "sales") {
      const di = indexesWhere(rows as JpkSaleRow[], (row) => row.ksef?.kind === "DI" && row.docType === null);
      if (di.length) add({ id: "ksefDi", status: "info", rows: di, count: di.length });
    }
  }

  const duplicates = repeated(rows.map((row) => `${normalise(row.country ?? "PL")}|${normalise(row.taxId)}|${normalise(row.document)}`));
  add(duplicates.length ? { id: "duplicates", status: "warn", rows: duplicates } : { id: "duplicates", status: "ok" });

  const hasVat =
    register === "sales"
      ? (row: JpkSaleRow | JpkPurchaseRow) => Boolean((row as JpkSaleRow).amounts.K_15 || (row as JpkSaleRow).amounts.K_17 || (row as JpkSaleRow).amounts.K_19)
      : (row: JpkSaleRow | JpkPurchaseRow) => purchaseTax(row as JpkPurchaseRow) !== 0;
  const missingTaxId = indexesWhere(rows, (row) => noTaxId(row.taxId) && row.docType !== "RO" && row.docType !== "WEW" && hasVat(row));
  if (missingTaxId.length) add({ id: "missingTaxId", status: "info", rows: missingTaxId });

  const invalidNip = indexesWhere(rows, (row) => {
    if (row.country && row.country.toUpperCase() !== "PL") return false;
    const nip = normalizeNip(row.taxId);
    return /^\d{10}$/.test(nip) && !isValidNip(nip);
  });
  add(invalidNip.length ? { id: "invalidNip", status: "warn", rows: invalidNip } : { id: "invalidNip", status: "ok" });

  return checks;
}

function declarationChecks(jpk: JpkVat, summary: JpkSummary): JpkCheck[] {
  const declaration = jpk.declaration;
  if (!declaration) return [];
  const checks: JpkCheck[] = [];
  const p = (code: string) => declaration.amounts[code] ?? 0;
  const has = (code: string) => declaration.amounts[code] !== undefined;
  const equal = (id: JpkCheckId, field: string, file: Cents, computed: Cents, failStatus: "warn" | "info" = "warn") =>
    checks.push({ id, field, unit: "zl", file, computed, status: file === computed ? "ok" : failStatus });

  if (jpk.sales !== null && jpk.structure === "JPK_V7M") {
    let compared = 0;
    for (const [field, k] of DECLARATION_FROM_REGISTER) {
      const declared = p(field);
      const register = registerValue(summary, k);
      compared += 1;
      const diff = declared - register;
      if (diff !== 0) checks.push({ id: "declVsRegister", field, unit: "zl", file: declared, computed: register, status: Math.abs(diff) <= 100 ? "info" : "warn" });
    }
    if (!checks.length) checks.push({ id: "declVsRegister", status: "ok", count: compared });
  }
  if (jpk.structure === "JPK_V7K") checks.push({ id: "declVsRegisterV7K", status: "info" });

  const p37 = sumOf(declaration.amounts, ["P_10", "P_11", "P_13", "P_15", "P_17", "P_19", "P_21", "P_22", "P_23", "P_25", "P_27", "P_29", "P_31"]);
  if (has("P_37") || p37 !== 0) equal("p37", "P_37", p("P_37"), p37);

  const p38 =
    sumOf(declaration.amounts, ["P_16", "P_18", "P_20", "P_24", "P_26", "P_28", "P_30", "P_32", "P_33", "P_34"]) -
    sumOf(declaration.amounts, ["P_35", "P_36", "P_360"]);
  equal("p38", "P_38", p("P_38"), p38);

  const p48 = sumOf(declaration.amounts, ["P_39", "P_41", "P_43", "P_44", "P_45", "P_46", "P_47"]);
  if (has("P_48") || p48 !== 0) equal("p48", "P_48", p("P_48"), p48);

  const due = p("P_38") - p("P_48");
  equal("p51", "P_51", p("P_51"), due > 0 ? Math.max(0, due - p("P_49") - p("P_50")) : 0, "info");
  equal("p53", "P_53", p("P_53"), Math.max(0, -due) + p("P_52"), "info");
  if (has("P_53")) equal("p62", "P_62", p("P_62"), p("P_53") - p("P_54"));

  checks.push({ id: "payAndExcess", status: p("P_51") > 0 && p("P_53") > 0 ? "warn" : "ok", unit: "zl", file: p("P_51"), computed: p("P_53") });
  if (has("P_60")) checks.push({ id: "p60", field: "P_60", unit: "zl", file: p("P_60"), computed: p("P_54"), status: p("P_60") <= p("P_54") ? "ok" : "warn" });

  const badDebtRows = (jpk.sales ?? []).filter((row) => row.badDebt && row.docType !== "FP");
  if (has("P_68") || has("P_69") || badDebtRows.length) {
    if (p("P_68") > 0 || p("P_69") > 0) checks.push({ id: "p68p69Sign", status: "warn" });
    if (jpk.sales !== null && jpk.structure === "JPK_V7M") {
      const base = roundToZloty(badDebtRows.reduce((total, row) => total + sumOf(row.amounts, ["K_15", "K_17", "K_19"]), 0));
      const tax = roundToZloty(badDebtRows.reduce((total, row) => total + sumOf(row.amounts, ["K_16", "K_18", "K_20"]), 0));
      equal("p68p69", "P_68", p("P_68"), base, "info");
      equal("p68p69", "P_69", p("P_69"), tax, "info");
    }
  }

  return checks;
}

/** Arithmetic and consistency checks only, never XSD validation. Sorted warn, info, ok. */
export function checkJpk(jpk: JpkVat, summary: JpkSummary): JpkCheck[] {
  const checks: JpkCheck[] = [];

  if (jpk.sales !== null) {
    checks.push({ id: "salesCount", status: jpk.salesCtrl?.rows === jpk.sales.length ? "ok" : "warn", unit: "count", file: jpk.salesCtrl?.rows ?? null, computed: jpk.sales.length });
    const tax = jpk.salesCtrl?.tax ?? null;
    const fpHint = tax !== null && summary.fpRows > 0 && tax - summary.computedOutputTax === summary.fpOutputTax;
    checks.push({
      id: "salesTax",
      status: tax === summary.computedOutputTax ? "ok" : "warn",
      unit: "money",
      file: tax,
      computed: summary.computedOutputTax,
      ...(tax !== summary.computedOutputTax && fpHint ? { hint: "fp" as const } : {}),
    });
  }
  if (jpk.purchases !== null) {
    checks.push({ id: "purchasesCount", status: jpk.purchasesCtrl?.rows === jpk.purchases.length ? "ok" : "warn", unit: "count", file: jpk.purchasesCtrl?.rows ?? null, computed: jpk.purchases.length });
    const tax = jpk.purchasesCtrl?.tax ?? null;
    checks.push({ id: "purchasesTax", status: tax === summary.computedInputTax ? "ok" : "warn", unit: "money", file: tax, computed: summary.computedInputTax });
  }

  checks.push(...declarationChecks(jpk, summary));
  checks.push(...registerChecks(jpk, "sales", jpk.sales ?? []));
  checks.push(...registerChecks(jpk, "purchases", jpk.purchases ?? []));

  if (jpk.year !== null && jpk.month !== null && (jpk.version === "2" || jpk.version === "3")) {
    const fromFebruary2026 = jpk.year * 100 + jpk.month >= 202602;
    checks.push({ id: "period", status: (jpk.version === "3") === fromFebruary2026 ? "ok" : "warn" });
  }
  if (jpk.unknown.length) checks.push({ id: "unknown", status: "info", names: jpk.unknown, count: jpk.unknown.length });

  return checks.map((check, index) => ({ check, index })).sort((a, b) => STATUS_ORDER[a.check.status] - STATUS_ORDER[b.check.status] || a.index - b.index).map(({ check }) => check);
}

export type JpkAnalysis = { jpk: JpkVat; summary: JpkSummary; checks: JpkCheck[] };

/** What the viewer receives: the model with its summary and checks, or why the file could not be opened. */
export type JpkOutcome = Exclude<JpkParseResult, { kind: "ok" }> | { kind: "ok"; analysis: JpkAnalysis };

export function analyzeJpk(jpk: JpkVat): JpkAnalysis {
  const summary = summarizeJpk(jpk);
  return { jpk, summary, checks: checkJpk(jpk, summary) };
}
