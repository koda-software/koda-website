import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { XMLParser } from "fast-xml-parser";
import { ksefNumberFromFileName, parseInvoiceTree, type Invoice, type XmlNode } from "./ksef";

/* Node has no DOMParser, so the tests build the same minimal tree with fast-xml-parser. */
type Ordered = Record<string, unknown> & { ":@"?: Record<string, string> };

const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: "", trimValues: false, parseTagValue: false });

function toTree(item: Ordered): XmlNode {
  const name = Object.keys(item).find((key) => key !== ":@")!;
  const body = (item[name] as Ordered[]) ?? [];
  const children = body.filter((child) => !("#text" in child)).map(toTree);
  const text = body
    .filter((child) => "#text" in child)
    .map((child) => String(child["#text"]))
    .join("");
  const attrs = Object.fromEntries(Object.entries(item[":@"] ?? {}).map(([key, value]) => [key.slice(key.indexOf(":") + 1), value]));
  return { name: name.slice(name.indexOf(":") + 1), attrs, children, text };
}

function load(file: string): Invoice {
  const doc = parser.parse(readFileSync(new URL(`./fixtures/${file}`, import.meta.url), "utf8")) as Ordered[];
  const root = doc.find((node) => !Object.keys(node).some((key) => key.startsWith("?")))!;
  const result = parseInvoiceTree(toTree(root));
  if (result.kind !== "ok") throw new Error(`${file} did not parse: ${result.reason}`);
  return result.invoice;
}

test("reads a plain FA(3) VAT invoice", () => {
  const invoice = load("fa3-vat.xml");

  assert.equal(invoice.schema, "FA (3)");
  assert.equal(invoice.kind, "VAT");
  assert.equal(invoice.number, "FV/2026/03/0001");
  assert.equal(invoice.issueDate, "2026-03-02");
  assert.equal(invoice.saleDate, "2026-02-28");
  assert.equal(invoice.currency, "PLN");
  assert.deepEqual(invoice.seller, {
    name: "Przykładowa Spółka z o.o.",
    taxId: "9876543210",
    address: ["ul. Testowa 1", "00-001 Warszawa"],
    email: "faktury@example.com",
    phone: null,
    role: null,
    customerNumber: null,
  });
  assert.equal(invoice.buyer?.taxId, "1112223332");
  assert.equal(invoice.lines.length, 2);
  assert.deepEqual(
    invoice.lines.map((line) => [line.name, line.quantity, line.unit, line.net, line.vatRate]),
    [
      ["Usługa wdrożeniowa", "10", "godz.", "1000.00", "23"],
      ["Szkolenie", "1", "szt.", "100.00", "8"],
    ],
  );
  assert.deepEqual(
    invoice.vat.map((row) => [row.key, row.net, row.vat]),
    [
      ["1", "1000.00", "230.00"],
      ["2", "100.00", "8.00"],
    ],
  );
  assert.equal(invoice.total, "1338.00");
  assert.deepEqual(invoice.annotations, ["splitPayment"]);
  assert.deepEqual(invoice.payment?.dueDates, ["2026-03-16"]);
  assert.equal(invoice.payment?.method, "6");
  assert.equal(invoice.payment?.accounts[0].number, "60102010260000042270201111");
  assert.deepEqual(invoice.notes, [{ key: "Zamówienie", value: "ZAM-42" }]);
  assert.deepEqual(invoice.footer, ["Dziękujemy za współpracę."]);
  assert.equal(invoice.registries.krs, "0000123456");
  assert.deepEqual(invoice.warnings, []);
});

test("reads a prefixed corrective invoice in euro with an EU buyer and a factor", () => {
  const invoice = load("fa3-kor-eur.xml");

  assert.equal(invoice.kind, "KOR");
  assert.equal(invoice.currency, "EUR");
  assert.equal(invoice.exchangeRate, "4.2512");
  assert.deepEqual(invoice.salePeriod, { from: "2026-04-01", to: "2026-04-30" });
  assert.equal(invoice.buyer?.taxId, "DE123456789");
  assert.deepEqual(invoice.buyer?.address, ["Hauptstraße 1, 10115 Berlin", "DE"]);
  assert.equal(invoice.others.length, 1);
  assert.equal(invoice.others[0].role, "1");
  assert.equal(invoice.correction?.reason, "Rabat posprzedażowy");
  assert.equal(invoice.correction?.type, "2");
  assert.deepEqual(invoice.correction?.originals, [
    { number: "FV/2026/04/0099", date: "2026-04-30", ksef: "5556667776-20260430-0A1B2C3D4E5F-AB" },
  ]);
  assert.deepEqual(
    invoice.lines.map((line) => line.before),
    [true, false],
  );
  assert.deepEqual(invoice.vat, [{ key: "6_2", net: "-200.00", vat: null, vatPln: null }]);
  assert.deepEqual(invoice.annotations, []);
  assert.deepEqual(invoice.warnings, []);
});

test("warns when totals do not add up or the seller is incomplete", () => {
  const invoice = load("fa3-broken-totals.xml");
  assert.deepEqual(invoice.warnings.sort(), ["lines", "seller", "totals"]);
});

test("rejects XML that is not an invoice", () => {
  assert.deepEqual(parseInvoiceTree({ name: "Deklaracja", attrs: {}, children: [], text: "" }), { kind: "error", reason: "notInvoice" });
  assert.deepEqual(parseInvoiceTree({ name: "Faktura", attrs: {}, children: [], text: "" }), { kind: "error", reason: "notInvoice" });
  assert.deepEqual(parseInvoiceTree(null), { kind: "error", reason: "notInvoice" });
});

test("finds the KSeF number in a downloaded file name", () => {
  assert.equal(ksefNumberFromFileName("5556667776-20260430-0a1b2c3d4e5f-ab.xml"), "5556667776-20260430-0A1B2C3D4E5F-AB");
  assert.equal(ksefNumberFromFileName("faktura.xml"), null);
});
