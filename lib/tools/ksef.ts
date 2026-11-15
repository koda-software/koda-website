/**
 * Reads a KSeF structured invoice (schema FA(3), and FA(2) on a best-effort basis)
 * into a plain model the viewer renders.
 *
 * The parser works on a minimal XML tree rather than the DOM, so the same code runs
 * in the browser (fed by `DOMParser`, see `ksef-dom.ts`) and in `node --test`. It
 * matches elements by local name, ignoring namespaces and prefixes, and skips what it
 * does not know, so a new schema revision degrades instead of failing.
 */

import { KSEF_NUMBER_IN_TEXT, child, children, local, text, type XmlNode } from "./xml";

export type { XmlNode };

export type Party = {
  name: string;
  /** Polish NIP, an EU VAT number ("DE123…") or a foreign ID, whichever the invoice gives. */
  taxId: string | null;
  address: string[];
  email: string | null;
  phone: string | null;
  /** Podmiot3 only: the role code, or the free-text role. */
  role: string | null;
  customerNumber: string | null;
};

export type InvoiceLine = {
  no: string;
  name: string;
  unit: string | null;
  quantity: string | null;
  unitNet: string | null;
  unitGross: string | null;
  discount: string | null;
  net: string | null;
  gross: string | null;
  vatRate: string | null;
  code: string | null;
  /** In corrections, true for the "before" row. */
  before: boolean;
};

export type VatRow = { key: string; net: string | null; vat: string | null; vatPln: string | null };

export type Invoice = {
  schema: string;
  kind: string;
  number: string;
  issueDate: string | null;
  issuePlace: string | null;
  saleDate: string | null;
  salePeriod: { from: string | null; to: string | null } | null;
  currency: string;
  exchangeRate: string | null;
  seller: Party | null;
  buyer: Party | null;
  others: Party[];
  lines: InvoiceLine[];
  vat: VatRow[];
  total: string | null;
  /** Annotation codes that are set: cashMethod, selfBilling, reverseCharge, splitPayment, exemption, margin, newTransport. */
  annotations: string[];
  exemptionBasis: string | null;
  correction: {
    reason: string | null;
    type: string | null;
    originals: Array<{ number: string | null; date: string | null; ksef: string | null }>;
  } | null;
  payment: {
    paid: boolean;
    paidDate: string | null;
    dueDates: string[];
    method: string | null;
    otherMethod: string | null;
    accounts: Array<{ number: string; swift: string | null; bank: string | null; description: string | null }>;
  } | null;
  notes: Array<{ key: string; value: string }>;
  footer: string[];
  registries: { krs: string | null; regon: string | null; bdo: string | null };
  createdAt: string | null;
  system: string | null;
  warnings: Array<"totals" | "lines" | "seller" | "number">;
};

export type ParseResult = { kind: "ok"; invoice: Invoice } | { kind: "error"; reason: "xml" | "notInvoice" };

/* ---------- tree helpers ---------- */

const isSet = (node: XmlNode | null | undefined, name: string) => text(node, name) === "1";

/* ---------- parties ---------- */

function party(node: XmlNode | null): Party | null {
  if (!node) return null;

  const id = child(node, "DaneIdentyfikacyjne");
  const nip = text(id, "NIP");
  const euVat = text(id, "NrVatUE") ? `${text(id, "KodUE") ?? ""}${text(id, "NrVatUE")}` : null;
  const foreign = text(id, "NrID") ? `${text(id, "KodKraju") ?? ""} ${text(id, "NrID")}`.trim() : null;
  const address = child(node, "Adres");
  const contact = child(node, "DaneKontaktowe");
  const country = text(address, "KodKraju");

  return {
    name: text(id, "Nazwa") ?? text(id, "ImiePierwsze") ?? "",
    taxId: nip ?? euVat ?? foreign,
    address: [text(address, "AdresL1"), text(address, "AdresL2"), country && country !== "PL" ? country : null].filter(
      (line): line is string => Boolean(line),
    ),
    email: text(contact, "Email"),
    phone: text(contact, "Telefon"),
    role: text(node, "OpisRoli") ?? text(node, "Rola"),
    customerNumber: text(node, "NrKlienta"),
  };
}

/* ---------- invoice ---------- */

/** The VAT-summary fields, in the order the schema lists them. 1-5 carry tax; the rest are bases only. */
const VAT_KEYS = ["1", "2", "3", "4", "5", "6_1", "6_2", "6_3", "7", "8", "9", "10", "11"];

const amount = (value: string | null) => (value === null ? null : Number(value));

export function parseInvoiceTree(root: XmlNode | null): ParseResult {
  if (!root || local(root.name) !== "Faktura") return { kind: "error", reason: "notInvoice" };

  const header = child(root, "Naglowek");
  const fa = child(root, "Fa");
  if (!fa) return { kind: "error", reason: "notInvoice" };

  const formCode = child(header, "KodFormularza");
  const variant = text(header, "WariantFormularza");
  const schema = formCode?.attrs.kodSystemowy ?? (variant ? `FA (${variant})` : "FA");

  const lines = children(fa, "FaWiersz").map<InvoiceLine>((row) => ({
    no: text(row, "NrWierszaFa") ?? "",
    name: text(row, "P_7") ?? "",
    unit: text(row, "P_8A"),
    quantity: text(row, "P_8B"),
    unitNet: text(row, "P_9A"),
    unitGross: text(row, "P_9B"),
    discount: text(row, "P_10"),
    net: text(row, "P_11"),
    gross: text(row, "P_11A"),
    vatRate: text(row, "P_12"),
    code: text(row, "Indeks") ?? text(row, "GTIN") ?? text(row, "PKWiU") ?? text(row, "CN"),
    before: text(row, "StanPrzed") === "1",
  }));

  const vat = VAT_KEYS.flatMap<VatRow>((key) => {
    const net = text(fa, `P_13_${key}`);
    const tax = text(fa, `P_14_${key}`);
    if (net === null && tax === null) return [];
    return [{ key, net, vat: tax, vatPln: text(fa, `P_14_${key}W`) }];
  });

  const notesSource = child(fa, "Adnotacje");
  const exemption = child(notesSource, "Zwolnienie");
  const annotations = [
    isSet(notesSource, "P_16") && "cashMethod",
    isSet(notesSource, "P_17") && "selfBilling",
    isSet(notesSource, "P_18") && "reverseCharge",
    isSet(notesSource, "P_18A") && "splitPayment",
    isSet(exemption, "P_19") && "exemption",
    child(notesSource, "PMarzy") && isSet(child(notesSource, "PMarzy"), "P_PMarzy") && "margin",
    child(notesSource, "NoweSrodkiTransportu") && isSet(child(notesSource, "NoweSrodkiTransportu"), "P_22") && "newTransport",
  ].filter((value): value is string => Boolean(value));

  const correctionReason = text(fa, "PrzyczynaKorekty");
  const corrected = children(fa, "DaneFaKorygowanej");
  const correction =
    correctionReason || corrected.length
      ? {
          reason: correctionReason,
          type: text(fa, "TypKorekty"),
          originals: corrected.map((item) => ({
            number: text(item, "NrFaKorygowanej"),
            date: text(item, "DataWystFaKorygowanej"),
            ksef: text(item, "NrKSeFFaKorygowanej"),
          })),
        }
      : null;

  const paymentNode = child(fa, "Platnosc");
  const payment = paymentNode
    ? {
        paid: isSet(paymentNode, "Zaplacono"),
        paidDate: text(paymentNode, "DataZaplaty"),
        dueDates: children(paymentNode, "TerminPlatnosci")
          .map((item) => text(item, "Termin") ?? (item.text.trim() || null))
          .filter((value): value is string => Boolean(value)),
        method: text(paymentNode, "FormaPlatnosci"),
        otherMethod: text(paymentNode, "OpisPlatnosci"),
        accounts: [...children(paymentNode, "RachunekBankowy"), ...children(paymentNode, "RachunekBankowyFaktora")].flatMap((account) => {
          const number = text(account, "NrRB");
          return number
            ? [{ number, swift: text(account, "SWIFT"), bank: text(account, "NazwaBanku"), description: text(account, "OpisRachunku") }]
            : [];
        }),
      }
    : null;

  const period = child(fa, "OkresFa");
  const footerNode = child(root, "Stopka");
  const registries = child(footerNode, "Rejestry");

  const invoice: Invoice = {
    schema,
    kind: text(fa, "RodzajFaktury") ?? "VAT",
    number: text(fa, "P_2") ?? "",
    issueDate: text(fa, "P_1"),
    issuePlace: text(fa, "P_1M"),
    saleDate: text(fa, "P_6"),
    salePeriod: period ? { from: text(period, "P_6_Od"), to: text(period, "P_6_Do") } : null,
    currency: text(fa, "KodWaluty") ?? "PLN",
    exchangeRate: text(fa, "KursWalutyZ"),
    seller: party(child(root, "Podmiot1")),
    buyer: party(child(root, "Podmiot2")),
    others: children(root, "Podmiot3")
      .map(party)
      .filter((item): item is Party => Boolean(item)),
    lines,
    vat,
    total: text(fa, "P_15"),
    annotations,
    exemptionBasis: text(exemption, "P_19A") ?? text(exemption, "P_19B") ?? text(exemption, "P_19C"),
    correction,
    payment,
    notes: children(fa, "DodatkowyOpis").flatMap((item) => {
      const key = text(item, "Klucz");
      const value = text(item, "Wartosc");
      return key && value ? [{ key, value }] : [];
    }),
    footer: children(footerNode, "Informacje")
      .map((item) => text(item, "StopkaFaktury"))
      .filter((value): value is string => Boolean(value)),
    registries: { krs: text(registries, "KRS"), regon: text(registries, "REGON"), bdo: text(registries, "BDO") },
    createdAt: text(header, "DataWytworzeniaFa"),
    system: text(header, "SystemInfo"),
    warnings: [],
  };

  invoice.warnings = checkInvoice(invoice);
  return { kind: "ok", invoice };
}

/** Arithmetic and presence checks. Not schema validation: the page says so. */
function checkInvoice(invoice: Invoice): Invoice["warnings"] {
  const warnings: Invoice["warnings"] = [];
  const cents = (value: number) => Math.round(value * 100);

  if (!invoice.seller?.name || !invoice.seller.taxId) warnings.push("seller");
  if (!invoice.number) warnings.push("number");

  const total = amount(invoice.total);
  if (total !== null && invoice.vat.length) {
    const sum = invoice.vat.reduce((all, row) => all + (amount(row.net) ?? 0) + (amount(row.vat) ?? 0), 0);
    if (Math.abs(cents(sum) - cents(total)) > 1) warnings.push("totals");
  }

  /* Line net values should add up to the taxable bases, on plain invoices priced net. */
  const priced = invoice.lines.filter((line) => !line.before);
  if (invoice.kind === "VAT" && priced.length && priced.every((line) => line.net !== null) && invoice.vat.length) {
    const lineNet = priced.reduce((all, line) => all + (amount(line.net) ?? 0), 0);
    const baseNet = invoice.vat.reduce((all, row) => all + (amount(row.net) ?? 0), 0);
    if (Math.abs(cents(lineNet) - cents(baseNet)) > priced.length) warnings.push("lines");
  }

  return warnings;
}

/**
 * A KSeF number as it appears in downloaded file names, matched with the official
 * pattern: NIP (or "M" + 9 digits, or 3 letters + 7 digits)-YYYYMMDD-hex-hex-XX.
 */
export function ksefNumberFromFileName(fileName: string): string | null {
  return fileName.match(KSEF_NUMBER_IN_TEXT)?.[1].toUpperCase() ?? null;
}

/** Largest file the viewer reads. KSeF invoices are far smaller; this only stops a wrong file freezing the tab. */
export const MAX_KSEF_FILE_BYTES = 10 * 1024 * 1024;
