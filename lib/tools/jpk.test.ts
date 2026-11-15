import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  analyzeJpk,
  createJpkParser,
  parseAmount,
  parseJpkText,
  roundToZloty,
  type JpkAnalysis,
  type JpkCheck,
  type JpkParseResult,
} from "./jpk";
import { purchasesCsv, salesCsv, type JpkCsvLabels } from "./jpk-csv";
import { readJpkFile } from "./jpk-read";

const fixture = (file: string) => readFileSync(new URL(`./fixtures/${file}`, import.meta.url), "utf8");

function load(file: string): JpkAnalysis {
  const result = parseJpkText(fixture(file));
  if (result.kind !== "ok") throw new Error(`${file} did not parse: ${JSON.stringify(result)}`);
  return analyzeJpk(result.jpk);
}

const byStatus = (checks: JpkCheck[], status: JpkCheck["status"]) => checks.filter((check) => check.status === status);
const find = (checks: JpkCheck[], id: JpkCheck["id"], extra: Partial<JpkCheck> = {}) =>
  checks.filter((check) => check.id === id && Object.entries(extra).every(([key, value]) => check[key as keyof JpkCheck] === value));

test("parses amounts from decimal strings into grosze", () => {
  assert.equal(parseAmount("1234.56"), 123456);
  assert.equal(parseAmount("-0.5"), -50);
  assert.equal(parseAmount("10"), 1000);
  assert.equal(parseAmount(" 2300.00 "), 230000);
  assert.equal(parseAmount("1.500"), 150);
  assert.equal(parseAmount("-0.00"), 0);
  assert.equal(parseAmount("1,50"), null);
  assert.equal(parseAmount("1 000.00"), null);
  assert.equal(parseAmount("1.005"), null);
  assert.equal(parseAmount(""), null);
  assert.equal(parseAmount(null), null);
});

test("rounds to whole złoty, half away from zero", () => {
  assert.equal(roundToZloty(1234549), 1234500);
  assert.equal(roundToZloty(1234550), 1234600);
  assert.equal(roundToZloty(-150), -200);
  assert.equal(roundToZloty(-149), -100);
  assert.equal(roundToZloty(-40), 0);
});

test("reads a correct JPK_V7M(3) file", () => {
  const { jpk, summary, checks } = load("jpk-v7m3.xml");

  assert.equal(jpk.structure, "JPK_V7M");
  assert.equal(jpk.version, "3");
  assert.equal(jpk.systemCode, "JPK_V7M (3)");
  assert.equal(jpk.namespace, "http://crd.gov.pl/wzor/2025/12/19/14090/");
  assert.equal(jpk.year, 2026);
  assert.equal(jpk.month, 3);
  assert.equal(jpk.purpose, "1");
  assert.equal(jpk.taxOfficeCode, "1471");
  assert.equal(jpk.createdAt, "2026-04-20T12:02:00Z");
  assert.deepEqual(jpk.taxpayer, { kind: "company", nip: "9876543210", name: "Przykładowa Spółka z o.o.", email: "jpk@example.com", phone: null });
  assert.equal(jpk.declaration?.formCode, "VAT-7 (23)");
  assert.equal(jpk.declaration?.amounts.P_38, 249500);
  assert.equal(jpk.declaration?.amounts.P_51, 0);
  assert.deepEqual(jpk.unknown, []);

  assert.equal(jpk.sales?.length, 5);
  assert.equal(jpk.purchases?.length, 3);
  assert.deepEqual(jpk.salesCtrl, { rows: 5, tax: 249500 });
  assert.deepEqual(jpk.purchasesCtrl, { rows: 3, tax: 236900 });

  const [first, second, receipts, forReceipt, foreign] = jpk.sales!;
  assert.deepEqual(first, {
    lp: 1,
    country: null,
    taxId: "1112223332",
    name: "Klient Alfa sp. z o.o.",
    document: "FV/2026/03/001",
    issueDate: "2026-03-02",
    saleDate: null,
    ksef: { kind: "number", number: "9876543210-20260302-0A1B2C3D4E5F-7B", valid: true },
    docType: null,
    gtu: [12],
    procedures: [],
    badDebt: null,
    amounts: { K_19: 1000000, K_20: 230000 },
    marginGross: null,
  });
  assert.deepEqual(second.procedures, ["TP"]);
  assert.deepEqual(receipts.ksef, { kind: "DI" });
  assert.equal(receipts.docType, "RO");
  assert.equal(forReceipt.docType, "FP");
  assert.deepEqual(forReceipt.ksef, { kind: "number", number: "9876543210-20260315-AAAAAA-BBBBBB-01", valid: true });
  assert.equal(foreign.country, "DE");
  assert.equal(foreign.name, "Gamma GmbH & Co. KG");
  assert.deepEqual(jpk.purchases![0].receivedDate, "2026-03-06");
  assert.deepEqual(jpk.purchases![1].ksef, { kind: "BFK" });
  assert.deepEqual(jpk.purchases![2].ksef, { kind: "OFF" });

  assert.equal(summary.computedOutputTax, 249500);
  assert.equal(summary.salesTotals.K_19, 1050000);
  assert.equal(summary.salesTotalsFp.K_20, 2300);
  assert.equal(summary.fpOutputTax, 2300);
  assert.equal(summary.fpRows, 1);
  assert.equal(summary.salesBase, 1550000);
  assert.equal(summary.computedInputTax, 236900);
  assert.equal(summary.purchaseNet, 1030000);
  assert.deepEqual(summary.vatByRate, [
    { key: "23", base: 1050000, tax: 241500 },
    { key: "8", base: 100000, tax: 8000 },
    { key: "wdt", base: 400000, tax: null },
  ]);
  assert.deepEqual(summary.ksef, {
    sales: { number: 4, OFF: 0, BFK: 0, DI: 1, missing: 0 },
    purchases: { number: 1, OFF: 1, BFK: 1, DI: 0, missing: 0 },
  });
  assert.deepEqual(summary.gtu, [{ code: 12, rows: 1, base: 1000000 }]);
  assert.deepEqual(summary.procedures, [{ code: "TP", rows: 1 }]);
  assert.deepEqual(summary.docTypes, { sales: [{ code: "RO", rows: 1 }, { code: "FP", rows: 1 }], purchases: [] });
  /* FP rows and till reports are left out of contractor totals, as from the control totals. */
  assert.deepEqual(
    summary.topCustomers.map((item) => [item.taxId, item.rows, item.base, item.tax]),
    [
      ["1112223332", 1, 1000000, 230000],
      ["123456789", 1, 400000, 0],
      ["5213000009", 1, 100000, 8000],
    ],
  );
  assert.deepEqual(
    summary.topSuppliers.map((item) => [item.taxId, item.rows, item.base]),
    [
      ["5213000009", 1, 800000],
      ["7770001111", 2, 230000],
    ],
  );

  assert.deepEqual(byStatus(checks, "warn"), []);
  assert.deepEqual(
    byStatus(checks, "info").map((check) => [check.id, check.register, check.rows]),
    [["ksefOff", "purchases", [2]]],
  );
  assert.deepEqual(find(checks, "declVsRegister"), [{ id: "declVsRegister", status: "ok", count: 36 }]);
  assert.equal(find(checks, "p51")[0].status, "ok");
  assert.equal(find(checks, "p53")[0].status, "ok");
  assert.equal(find(checks, "period")[0].status, "ok");
});

test("finds what is wrong in a broken JPK_V7M(3) file", () => {
  const { jpk, checks } = load("jpk-v7m3-broken.xml");
  const warn = byStatus(checks, "warn");
  const info = byStatus(checks, "info");

  assert.deepEqual(find(warn, "salesCount"), [{ id: "salesCount", status: "warn", unit: "count", file: 4, computed: 5 }]);
  assert.deepEqual(find(warn, "salesTax"), [{ id: "salesTax", status: "warn", unit: "money", file: 251800, computed: 249500, hint: "fp" }]);
  assert.equal(jpk.sales![0].ksef?.kind === "number" && jpk.sales![0].ksef.valid, false);
  assert.deepEqual(find(warn, "ksefInvalid", { register: "sales" })[0].rows, [0]);
  assert.equal(find(checks, "purchasesCount")[0].status, "ok");
  assert.equal(find(checks, "purchasesTax")[0].status, "ok");
  assert.deepEqual(find(warn, "duplicates", { register: "purchases" })[0].rows, [2, 3]);
  assert.deepEqual(
    find(checks, "declVsRegister").map((check) => [check.field, check.status, check.file, check.computed]),
    [
      ["P_42", "warn", 230000, 260000],
      ["P_43", "warn", 52900, 59800],
      ["P_19", "info", 1050100, 1050000],
    ],
  );
  assert.deepEqual(find(info, "p51"), [{ id: "p51", field: "P_51", unit: "zl", file: 10000, computed: 0, status: "info" }]);
  assert.equal(find(warn, "payAndExcess").length, 1);
  assert.deepEqual(find(warn, "p37"), [{ id: "p37", field: "P_37", unit: "zl", file: 1550000, computed: 1550100, status: "warn" }]);
  assert.deepEqual(find(info, "ksefOff")[0].rows, [2, 3]);

  /* Warnings first, then information, then what passed. */
  const order = checks.map((check) => ({ warn: 0, info: 1, ok: 2 })[check.status]);
  assert.deepEqual(order, [...order].sort());
  assert.deepEqual(
    warn.map((check) => check.id).sort(),
    ["declVsRegister", "declVsRegister", "duplicates", "ksefInvalid", "p37", "payAndExcess", "salesCount", "salesTax"],
  );
});

test("reads a quarterly JPK_V7K(2) file without comparing the quarter with one month", () => {
  const { jpk, summary, checks } = load("jpk-v7k2-q4.xml");

  assert.equal(jpk.structure, "JPK_V7K");
  assert.equal(jpk.version, "2");
  assert.equal(jpk.declaration?.quarter, 4);
  assert.equal(jpk.declaration?.formCode, "VAT-7K (16)");
  assert.deepEqual(jpk.taxpayer, { kind: "person", nip: "1112223332", name: "Jan Kowalski", email: "jan.kowalski@example.com", phone: "600100200" });
  assert.ok(jpk.sales!.every((row) => row.ksef === null));
  assert.ok(jpk.purchases!.every((row) => row.ksef === null));
  assert.equal(summary.ksef, null);
  assert.equal(find(checks, "declVsRegister").length, 0);
  assert.equal(find(checks, "declVsRegisterV7K")[0].status, "info");
  assert.equal(find(checks, "period")[0].status, "ok");
  assert.equal(checks.filter((check) => check.id.startsWith("ksef")).length, 0);
  assert.deepEqual(byStatus(checks, "warn"), []);
});

test("reads a correction of the register alone", () => {
  const { jpk, checks } = load("jpk-v7m3-ewidencja-korekta.xml");

  assert.equal(jpk.declaration, null);
  assert.equal(jpk.purpose, "2");
  assert.deepEqual(jpk.purchases, []);
  assert.deepEqual(jpk.purchasesCtrl, { rows: 0, tax: 0 });
  assert.equal(find(checks, "purchasesCount")[0].status, "ok");
  assert.equal(find(checks, "purchasesTax")[0].status, "ok");
  assert.equal(checks.filter((check) => /^(decl|p\d)|payAndExcess/.test(check.id)).length, 0);
  assert.deepEqual(byStatus(checks, "warn"), []);
});

test("refuses files that are not JPK_V7, naming the structure when it can", () => {
  assert.deepEqual(parseJpkText(fixture("fa3-vat.xml")), { kind: "error", reason: "notJpk" });
  assert.deepEqual(
    parseJpkText('<JPK><Naglowek><KodFormularza kodSystemowy="JPK_FA (4)" wersjaSchemy="1-0">JPK_FA</KodFormularza></Naglowek><Faktura/></JPK>'),
    { kind: "unsupported", structure: "JPK_FA (4)" },
  );
  assert.deepEqual(
    parseJpkText('<tns:JPK xmlns:tns="urn:x"><tns:Naglowek><tns:KodFormularza kodSystemowy="JPK_VAT (3)">JPK_VAT</tns:KodFormularza></tns:Naglowek></tns:JPK>'),
    { kind: "unsupported", structure: "JPK_VAT (3)" },
  );
  assert.deepEqual(parseJpkText("<JPK><Podmiot1/></JPK>"), { kind: "error", reason: "notJpk" });
  assert.deepEqual(parseJpkText("<JPK><Naglowek><KodFormularza>"), { kind: "error", reason: "xml" });
  assert.deepEqual(parseJpkText('<!DOCTYPE JPK [<!ENTITY a "b">]><JPK/>'), { kind: "error", reason: "xml" });
});

test("warns when the schema version does not fit the period, and reports unknown fields", () => {
  const xml = fixture("jpk-v7k2-q4.xml")
    .replace("<Rok>2025</Rok>", "<Rok>2026</Rok>")
    .replace("<Miesiac>12</Miesiac>", "<Miesiac>3</Miesiac>")
    .replace("<K_17>500.00</K_17>", "<K_17>500.00</K_17><K_99>1.00</K_99>");
  const result = parseJpkText(xml);
  assert.equal(result.kind, "ok");
  const { jpk, checks } = analyzeJpk((result as Extract<JpkParseResult, { kind: "ok" }>).jpk);
  assert.equal(find(checks, "period")[0].status, "warn");
  assert.deepEqual(jpk.unknown, ["K_99"]);
  assert.deepEqual(find(checks, "unknown"), [{ id: "unknown", status: "info", names: ["K_99"], count: 1 }]);
});

test("gives the same result however the text is chunked, also inside an entity or a surrogate pair", () => {
  const xml = fixture("jpk-v7m3.xml").replace("Gamma GmbH &amp; Co. KG", "Gamma 🙂 GmbH &amp; Co. KG");
  const whole = parseJpkText(xml);
  assert.equal(whole.kind === "ok" && whole.jpk.sales![4].name, "Gamma 🙂 GmbH & Co. KG");

  const feed = (cuts: number[]) => {
    const parser = createJpkParser();
    let from = 0;
    for (const cut of [...cuts, xml.length]) {
      parser.write(xml.slice(from, cut));
      from = cut;
    }
    return parser.finish();
  };
  const every = (size: number) => Array.from({ length: Math.ceil(xml.length / size) }, (_, index) => index * size).slice(1);

  for (const size of [1, 7, 4096]) assert.deepEqual(feed(every(size)), whole, `chunks of ${size}`);
  const entity = xml.indexOf("&amp;");
  assert.deepEqual(feed([entity + 2]), whole, "split inside &amp;");
  const emoji = xml.indexOf("🙂");
  assert.deepEqual(feed([emoji + 1]), whole, "split between surrogate halves");
});

test("reads a file as a byte stream, in UTF-8 with a BOM and in windows-1250", async () => {
  const xml = fixture("jpk-v7m3.xml");
  const utf8 = await readJpkFile(new Blob(["﻿", xml]));
  assert.equal(utf8.kind, "ok");
  assert.equal(utf8.kind === "ok" && utf8.analysis.jpk.taxpayer?.name, "Przykładowa Spółka z o.o.");

  /* Hand-encoded: the only non-ASCII letters in the fixture are ł (0xB3) and ó (0xF3). */
  const cp1250 = xml.replace('encoding="UTF-8"', 'encoding="windows-1250"');
  const bytes = Uint8Array.from([...cp1250].map((char) => ({ ł: 0xb3, ó: 0xf3 })[char] ?? char.charCodeAt(0)));
  assert.ok(bytes.every((byte) => byte < 256));
  const decoded = await readJpkFile(new Blob([bytes]));
  assert.equal(decoded.kind === "ok" && decoded.analysis.jpk.taxpayer?.name, "Przykładowa Spółka z o.o.");

  assert.deepEqual(await readJpkFile({ size: 101 * 1024 * 1024 } as Blob), { kind: "error", reason: "tooLarge" });
});

test("parses a file with 100 000 sales and 20 000 purchase rows", () => {
  const sale = (lp: number) =>
    `<SprzedazWiersz><LpSprzedazy>${lp}</LpSprzedazy><NrKontrahenta>1112223332</NrKontrahenta><NazwaKontrahenta>Klient Alfa sp. z o.o.</NazwaKontrahenta><DowodSprzedazy>FV/${lp}</DowodSprzedazy><DataWystawienia>2026-03-02</DataWystawienia><NrKSeF>9876543210-20260302-0A1B2C3D4E5F-7B</NrKSeF><K_19>100.00</K_19><K_20>23.00</K_20></SprzedazWiersz>`;
  const purchase = (lp: number) =>
    `<ZakupWiersz><LpZakupu>${lp}</LpZakupu><NrDostawcy>7770001111</NrDostawcy><NazwaDostawcy>Dostawca Delta sp. z o.o.</NazwaDostawcy><DowodZakupu>FZ/${lp}</DowodZakupu><DataZakupu>2026-03-05</DataZakupu><BFK>1</BFK><K_42>10.00</K_42><K_43>2.30</K_43></ZakupWiersz>`;
  const head = fixture("jpk-v7m3-ewidencja-korekta.xml").split("<Ewidencja>")[0];
  const chunks = [head, "<Ewidencja>"];
  for (let lp = 1; lp <= 100_000; lp += 1) chunks.push(sale(lp));
  chunks.push("<SprzedazCtrl><LiczbaWierszySprzedazy>100000</LiczbaWierszySprzedazy><PodatekNalezny>2300000.00</PodatekNalezny></SprzedazCtrl>");
  for (let lp = 1; lp <= 20_000; lp += 1) chunks.push(purchase(lp));
  chunks.push("<ZakupCtrl><LiczbaWierszyZakupow>20000</LiczbaWierszyZakupow><PodatekNaliczony>46000.00</PodatekNaliczony></ZakupCtrl></Ewidencja></JPK>");
  const xml = chunks.join("");

  const started = performance.now();
  const parser = createJpkParser();
  for (let at = 0; at < xml.length; at += 65536) parser.write(xml.slice(at, at + 65536));
  const result = parser.finish();
  assert.equal(result.kind, "ok");
  const { jpk, summary, checks } = analyzeJpk((result as Extract<JpkParseResult, { kind: "ok" }>).jpk);
  const elapsed = performance.now() - started;
  console.log(`  ${(xml.length / 1024 / 1024).toFixed(1)} MB, 120 000 rows parsed and checked in ${elapsed.toFixed(0)} ms`);

  assert.equal(jpk.sales!.length, 100_000);
  assert.equal(jpk.purchases!.length, 20_000);
  assert.equal(summary.computedOutputTax, 230000000);
  assert.equal(summary.computedInputTax, 4600000);
  assert.equal(find(checks, "salesTax")[0].status, "ok");
  /* Every row repeats one KSeF number: a duplicate warning, listing every row. */
  assert.equal(find(checks, "ksefDuplicate", { register: "sales" })[0].rows?.length, 100_000);
});

const csvLabels: JpkCsvLabels = {
  sales: {
    lp: "Lp.", country: "Kraj", taxId: "NIP kontrahenta", name: "Kontrahent", document: "Numer dowodu", issueDate: "Data wystawienia",
    saleDate: "Data sprzedaży", ksef: "KSeF", docType: "Typ dowodu", gtu: "GTU", procedures: "Procedury", badDebt: "Korekta art. 89a",
    dueDate: "Termin płatności", paidDate: "Data zapłaty", marginGross: "Sprzedaż w procedurze marży",
  },
  purchases: {
    lp: "Lp.", country: "Kraj", taxId: "NIP dostawcy", name: "Dostawca", document: "Numer dowodu", issueDate: "Data wystawienia",
    receivedDate: "Data wpływu", ksef: "KSeF", docType: "Typ dowodu", imported: "Import towarów", marginPurchase: "Zakup w procedurze marży",
  },
  amounts: Object.fromEntries(
    [...Array.from({ length: 27 }, (_, index) => `K_${index + 10}`), "K_360", ...Array.from({ length: 8 }, (_, index) => `K_${index + 40}`)].map((key) => [key, `opis ${key}`]),
  ) as JpkCsvLabels["amounts"],
  yes: "tak",
};

test("exports the registers to CSV for Excel, guarding against formulas", () => {
  const { jpk } = load("jpk-v7m3.xml");
  const csv = salesCsv(jpk.sales!.slice(0, 2), csvLabels, "pl");
  const lines = csv.split("\r\n");

  assert.ok(csv.startsWith("﻿Lp.;Kraj;NIP kontrahenta;Kontrahent;Numer dowodu;Data wystawienia;"));
  assert.ok(lines[0].includes(";K_19 opis K_19;K_20 opis K_20;"));
  assert.equal(lines.length, 4);
  assert.equal(lines[3], "");
  assert.ok(lines[1].startsWith("1;;1112223332;Klient Alfa sp. z o.o.;FV/2026/03/001;2026-03-02;;9876543210-20260302-0A1B2C3D4E5F-7B;;GTU_12;"));
  assert.ok(lines[1].includes(";10000,00;2300,00;"));
  assert.ok(salesCsv(jpk.sales!.slice(0, 1), csvLabels, "en").includes(";10000.00;2300.00;"));

  const hostile = { ...jpk.sales![0], name: "=SUM(A1)", document: 'FV "1"; 2', amounts: { K_19: -50 } };
  const row = salesCsv([hostile], csvLabels, "pl").split("\r\n")[1];
  assert.ok(row.includes(";'=SUM(A1);"));
  assert.ok(row.includes(';"FV ""1""; 2";'));
  assert.ok(row.includes(";-0,50;"));

  const purchases = purchasesCsv(jpk.purchases!, csvLabels, "pl").split("\r\n");
  assert.equal(purchases[0].split(";").length, 19);
  assert.ok(purchases[2].includes(";BFK;"));
  assert.ok(purchases[2].includes(";8000,00;1840,00;"));
});
