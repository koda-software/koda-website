import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import {
  compensationCents,
  compensationRateAnchor,
  compensationTier,
  computeInvoice,
  effectiveDueDate,
  formatRate,
  interestRows,
  noteText,
  rowInterest,
  type InvoiceResult,
} from "./late-interest";
import { civilRates, commercialRates } from "./late-interest-rates";
import { parseNbpSeries, pickRate, rateWindow, type NbpRate } from "./nbp";

/* Raw API responses recorded on 2026-11-16, each the exact rateWindow(firstOfMonth, today):
   /rates/a/eur/2026-09-30/2026-10-31/, /rates/a/eur/2026-03-30/2026-04-30/ and /rates/a/eur/2019-10-30/2019-11-30/. */
const fixture = (name: string) => parseNbpSeries(readFileSync(new URL(`./fixtures/${name}.json`, import.meta.url), "utf8"));
const eurOctober = fixture("nbp-eur-2026-10");
const eurApril = fixture("nbp-eur-2026-04");
const eurNovember2019 = fixture("nbp-eur-2019-11");
const TODAY = "2026-11-16";

const ok = (result: ReturnType<typeof computeInvoice>): InvoiceResult => {
  assert.ok(!("error" in result), `expected a result, got ${JSON.stringify(result)}`);
  return result;
};
const rowSummary = (result: InvoiceResult) => result.rows.map((row) => [row.from, row.to, row.days, row.rateBp, row.interest]);

test("commercial rates: ascending half-years from 2016 with no gaps", () => {
  assert.equal(commercialRates.length, 22);
  assert.equal(commercialRates[0].from, "2016-01-01");
  commercialRates.forEach((row, index) => {
    assert.match(row.from, /-(01|07)-01$/);
    if (index === 0) return;
    const previous = commercialRates[index - 1].from;
    const expected = previous.endsWith("-01-01") ? `${previous.slice(0, 4)}-07-01` : `${Number(previous.slice(0, 4)) + 1}-01-01`;
    assert.equal(row.from, expected);
  });
});

test("commercial rates: 2026 rows and the healthcare split", () => {
  assert.deepEqual(
    commercialRates.filter((row) => row.from.startsWith("2026")).map(({ from, standard, healthcare, eli }) => ({ from, standard, healthcare, eli })),
    [
      { from: "2026-01-01", standard: 1400, healthcare: 1200, eli: "MP/2025/1257" },
      { from: "2026-07-01", standard: 1375, healthcare: 1175, eli: "MP/2026/642" },
    ],
  );
  for (const row of commercialRates) {
    if (row.from >= "2020-01-01") assert.equal(row.standard - row.healthcare, 200, row.from);
    else assert.deepEqual([row.standard, row.healthcare], [950, 950], row.from);
  }
});

test("civil rates: ascending, last row 9,25% from 2026-03-05", () => {
  const last = civilRates[civilRates.length - 1];
  assert.equal(last.from, "2026-03-05");
  assert.equal(last.rate, 925);
  civilRates.forEach((row, index) => {
    if (index) assert.ok(row.from > civilRates[index - 1].from);
  });
});

test("effectiveDueDate moves Saturdays and holidays to the next business day (art. 115 KC)", () => {
  assert.deepEqual(effectiveDueDate("2026-10-31"), {
    date: "2026-11-02",
    skipped: [
      { date: "2026-10-31", reason: "saturday" },
      { date: "2026-11-01", reason: "allSaints" },
    ],
  });
  assert.equal(effectiveDueDate("2026-08-15").date, "2026-08-17");
  assert.equal(effectiveDueDate("2026-11-11").date, "2026-11-12");
  assert.deepEqual(effectiveDueDate("2026-05-15"), { date: "2026-05-15", skipped: [] });
});

test("rowInterest rounds half up in grosze", () => {
  assert.equal(rowInterest(1230000, 1400, 46), 21702);
  assert.equal(rowInterest(1230000, 1375, 139), 64407);
});

const example1 = { label: "FV/2026/0412", cents: 1230000, due: "2026-05-15", paid: "2026-11-16" };

test("example 1: commercial, standard debtor, across 1 July", () => {
  const result = ok(computeInvoice(example1, TODAY, "commercial", "standard", true));
  assert.deepEqual(rowSummary(result), [
    ["2026-05-16", "2026-06-30", 46, 1400, 21702],
    ["2026-07-01", "2026-11-16", 139, 1375, 64407],
  ]);
  assert.equal(result.days, 185);
  assert.equal(result.interest, 86109);
  assert.deepEqual(result.compensation, { tier: { eur: 70, basis: "tier" }, anchor: "2026-05-01" });

  const window = rateWindow("2026-05-01", TODAY);
  assert.deepEqual(window, { start: "2026-03-30", end: "2026-04-30" });
  const rate = pickRate(eurApril.rates, "2026-05-01");
  assert.deepEqual(rate, { no: "083/A/NBP/2026", effectiveDate: "2026-04-30", mid: "4.2589" });
  const compensation = compensationCents(result.compensation!.tier, rate!.mid);
  assert.equal(compensation, 29812);
  assert.equal(result.interest + compensation, 115921);
});

test("example 2: public healthcare debtor", () => {
  const result = ok(computeInvoice(example1, TODAY, "commercial", "healthcare", true));
  assert.deepEqual(
    result.rows.map((row) => row.interest),
    [18602, 55038],
  );
  assert.equal(result.interest, 73640);
});

test("example 3: civil mode, one row at 9,25%", () => {
  const result = ok(computeInvoice(example1, TODAY, "civil", "standard", true));
  assert.deepEqual(rowSummary(result), [["2026-05-16", "2026-11-16", 185, 925, 57667]]);
  assert.equal(result.compensation, null);
});

const example4 = { label: "", cents: 1230000, due: "2025-11-20", paid: "2026-03-10" };

test("example 4: civil mode splits on each reference rate change", () => {
  const result = ok(computeInvoice(example4, TODAY, "civil", "standard", false));
  assert.deepEqual(rowSummary(result), [
    ["2025-11-21", "2025-12-03", 13, 975, 4271],
    ["2025-12-04", "2026-03-04", 91, 950, 29132],
    ["2026-03-05", "2026-03-10", 6, 925, 1870],
  ]);
  assert.equal(result.interest, 35273);
});

test("example 4: commercial mode keeps the half-year rate through 5 March", () => {
  const result = ok(computeInvoice(example4, TODAY, "commercial", "standard", false));
  assert.deepEqual(rowSummary(result), [
    ["2025-11-21", "2025-12-31", 41, 1525, 21070],
    ["2026-01-01", "2026-03-10", 69, 1400, 32553],
  ]);
  assert.equal(result.interest, 53623);
  assert.notEqual(result.interest, 53572);
});

test("example 5: due on a Saturday before All Saints", () => {
  const result = ok(computeInvoice({ label: "", cents: 400000, due: "2026-10-31", paid: "2026-11-16" }, TODAY, "commercial", "standard", true));
  assert.equal(result.effectiveDue, "2026-11-02");
  assert.deepEqual(rowSummary(result), [["2026-11-03", "2026-11-16", 14, 1375, 2110]]);
  assert.deepEqual(result.compensation, { tier: { eur: 40, basis: "tier" }, anchor: "2026-11-01" });
  const rate = pickRate(eurOctober.rates, "2026-11-01");
  assert.deepEqual(rate, { no: "212/A/NBP/2026", effectiveDate: "2026-10-30", mid: "4.3955" });
  assert.equal(compensationCents(result.compensation!.tier, rate!.mid), 17582);
});

test("example 8: a leap year still divides by 365", () => {
  const result = ok(computeInvoice({ label: "", cents: 1000000, due: "2024-02-15", paid: "2024-03-15" }, TODAY, "commercial", "standard", false));
  assert.deepEqual(rowSummary(result), [["2024-02-16", "2024-03-15", 29, 1575, 12514]]);
});

test("compensationTier: thresholds and the flat 40 EUR before 2020", () => {
  assert.deepEqual(compensationTier(500000, "2026-05-15"), { eur: 40, basis: "tier" });
  assert.deepEqual(compensationTier(500001, "2026-05-15"), { eur: 70, basis: "tier" });
  assert.deepEqual(compensationTier(4999999, "2026-05-15"), { eur: 70, basis: "tier" });
  assert.deepEqual(compensationTier(5000000, "2026-05-15"), { eur: 100, basis: "tier" });
  assert.deepEqual(compensationTier(6000000, "2019-12-31"), { eur: 40, basis: "flat2016" });
  assert.deepEqual(compensationTier(6000000, "2020-01-02"), { eur: 100, basis: "tier" });
});

test("pre-2020 compensation uses the November 2019 table", () => {
  assert.equal(compensationRateAnchor("2019-12-31"), "2019-12-01");
  assert.deepEqual(rateWindow("2019-12-01", TODAY), { start: "2019-10-30", end: "2019-11-30" });
  const rate = pickRate(eurNovember2019.rates, "2019-12-01");
  assert.deepEqual(rate, { no: "231/A/NBP/2019", effectiveDate: "2019-11-29", mid: "4.3236" });
  assert.equal(compensationCents(compensationTier(6000000, "2019-12-31"), rate!.mid), 17294);
});

test("computeInvoice: on time, one day late, too early and bad input", () => {
  assert.deepEqual(computeInvoice({ label: "", cents: 100000, due: "2026-10-31", paid: "2026-11-02" }, TODAY, "commercial", "standard", true), { error: "notLate" });
  const oneDay = ok(computeInvoice({ label: "", cents: 100000, due: "2026-10-31", paid: "2026-11-03" }, TODAY, "commercial", "standard", true));
  assert.equal(oneDay.days, 1);
  assert.ok(oneDay.compensation);
  assert.deepEqual(computeInvoice({ label: "", cents: 100000, due: "2015-12-31", paid: "2016-02-01" }, TODAY, "commercial", "standard", true), { error: "beforeFirst" });
  assert.deepEqual(computeInvoice({ label: "", cents: 0, due: "2026-05-15", paid: null }, TODAY, "commercial", "standard", true), { error: "amount" });
  assert.deepEqual(computeInvoice({ label: "", cents: Number.NaN, due: "2026-05-15", paid: null }, TODAY, "commercial", "standard", true), { error: "amount" });
  assert.deepEqual(computeInvoice({ label: "", cents: 100, due: "2026-02-30", paid: null }, TODAY, "commercial", "standard", true), { error: "due" });
  assert.deepEqual(computeInvoice({ label: "", cents: 100, due: "2026-05-15", paid: null }, "", "commercial", "standard", true), { error: "paid" });
});

test("computeInvoice: an unpaid invoice runs to the shared date", () => {
  const result = ok(computeInvoice({ ...example1, paid: null }, TODAY, "commercial", "standard", true));
  assert.equal(result.until, TODAY);
  assert.equal(result.paid, false);
  assert.equal(result.interest, 86109);
});

test("forecast: days past the known table reuse the last rate", () => {
  const rows = interestRows(1230000, "2026-11-16", "2027-02-01", "commercial", "standard");
  assert.deepEqual(
    rows.map((row) => [row.from, row.to, row.rateBp, row.forecast]),
    [
      ["2026-11-17", "2026-12-31", 1375, false],
      ["2027-01-01", "2027-02-01", 1375, true],
    ],
  );
  assert.deepEqual(interestRows(100, "2026-05-15", "2026-05-15", "commercial", "standard"), []);
});

test("noteText: the Polish block for example 1", () => {
  const result = ok(computeInvoice(example1, TODAY, "commercial", "standard", true));
  const rates = new Map<string, NbpRate>([["2026-05-01", pickRate(eurApril.rates, "2026-05-01")!]]);
  assert.equal(
    noteText("pl", [result], rates, "commercial"),
    [
      "Odsetki ustawowe za opóźnienie w transakcjach handlowych",
      "FV/2026/0412: 12 300,00 zł, termin 15.05.2026, zapłata 16.11.2026, 185 dni",
      "  16.05.2026–30.06.2026: 46 dni × 14,00% = 217,02 zł",
      "  01.07.2026–16.11.2026: 139 dni × 13,75% = 644,07 zł",
      "  Odsetki: 861,09 zł",
      "  Rekompensata (art. 10 ust. 1 pkt 2): 70 EUR × 4,2589 (tabela 083/A/NBP/2026 z 30.04.2026) = 298,12 zł",
      "Razem odsetki: 861,09 zł",
      "Razem rekompensaty: 298,12 zł",
      "Razem: 1 159,21 zł",
      "Podstawa: art. 7 ust. 1, art. 10 ust. 1 i art. 11b ustawy z dnia 8 marca 2013 r. o przeciwdziałaniu nadmiernym opóźnieniom w transakcjach handlowych (Dz.U. 2023 poz. 1790).",
    ].join("\n"),
  );
});

test("noteText: without the EUR rate the compensation stays in EUR", () => {
  const result = ok(computeInvoice(example1, TODAY, "commercial", "standard", true));
  const text = noteText("en", [result], new Map(), "commercial");
  assert.match(text, /^ {2}Compensation \(art\. 10\(1\)\(2\)\): 70 EUR$/m);
  assert.match(text, /^Total compensation: 70 EUR$/m);
  assert.match(text, /^Total: 861\.09 PLN \+ 70 EUR$/m);
});

test("formatRate", () => {
  assert.equal(formatRate(950, ","), "9,50");
  assert.equal(formatRate(1375, "."), "13.75");
});

test("pickRate on the October fixture gives the table before 1 November (reuse contract with nbp.ts)", () => {
  const rate = pickRate(eurOctober.rates, "2026-11-01");
  assert.equal(rate?.no, "212/A/NBP/2026");
  assert.equal(rate?.mid, "4.3955");
});
