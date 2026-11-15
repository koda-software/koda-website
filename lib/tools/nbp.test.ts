import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { nbpCurrencies } from "./nbp-currencies";
import {
  NbpError,
  convertCents,
  formatMid,
  invoiceNote,
  nbpRangeUrl,
  parseNbpSeries,
  pickRate,
  previousTableBDay,
  rateWindow,
  resolveRate,
  toPln,
  type NbpSeries,
} from "./nbp";

/* Raw API responses recorded on 2026-11-15: /rates/a/eur/2026-11-01/2026-11-15/ and /rates/b/afn/2026-10-27/2026-11-14/. */
const eurText = readFileSync(new URL("./fixtures/nbp-eur-2026-11.json", import.meta.url), "utf8");
const afnText = readFileSync(new URL("./fixtures/nbp-afn-2026-11.json", import.meta.url), "utf8");
const eur = parseNbpSeries(eurText);
const afn = parseNbpSeries(afnText);

const rateNo = (series: NbpSeries, date: string) => {
  const rate = pickRate(series.rates, date);
  return rate ? [rate.no, rate.mid] : null;
};

test("keeps each rate exactly as NBP wrote it", () => {
  assert.equal(eur.table, "A");
  assert.equal(eur.code, "EUR");
  assert.equal(eur.rates.length, 9);
  const last = eur.rates.at(-1)!;
  assert.equal(last.no, "221/A/NBP/2026");
  assert.equal(last.mid, "4.4070");
  assert.equal(afn.table, "B");
  assert.equal(afn.rates[1].mid, "0.060112");
});

test("rejects a response of the wrong shape", () => {
  assert.throws(() => parseNbpSeries("<html>"), NbpError);
  assert.throws(() => parseNbpSeries('{"table":"C","code":"EUR","currency":"euro","rates":[]}'), NbpError);
  assert.throws(() => parseNbpSeries('{"table":"A","code":"EUR","currency":"euro","rates":[{"no":"1","effectiveDate":"x","mid":1}]}'), NbpError);
});

test("asks for a range that ends the day before, but never after today", () => {
  assert.deepEqual(rateWindow("2026-11-16", "2026-11-15"), { start: "2026-10-15", end: "2026-11-15" });
  assert.deepEqual(rateWindow("2026-11-15", "2026-11-15"), { start: "2026-10-14", end: "2026-11-14" });
  assert.equal(rateWindow("2026-11-20", "2026-11-15")?.end, "2026-11-15");
  assert.deepEqual(rateWindow("2002-01-10", "2026-11-15"), { start: "2002-01-02", end: "2002-01-09" });
  assert.equal(rateWindow("2002-01-02", "2026-11-15"), null);
  assert.equal(rateWindow("2026-02-30", "2026-11-15"), null);
  assert.equal(rateWindow("", "2026-11-15"), null);
});

test("builds the range URL", () => {
  assert.equal(nbpRangeUrl("A", "EUR", "2026-11-01", "2026-11-15"), "https://api.nbp.pl/api/exchangerates/rates/a/eur/2026-11-01/2026-11-15/?format=json");
  assert.equal(nbpRangeUrl("B", "AFN", "2026-10-27", "2026-11-14"), "https://api.nbp.pl/api/exchangerates/rates/b/afn/2026-10-27/2026-11-14/?format=json");
});

test("picks the last table before the date", () => {
  assert.deepEqual(rateNo(eur, "2026-11-16"), ["221/A/NBP/2026", "4.4070"]);
  assert.deepEqual(rateNo(eur, "2026-11-12"), ["219/A/NBP/2026", "4.3895"]);
  assert.deepEqual(rateNo(eur, "2026-11-13"), ["220/A/NBP/2026", "4.4018"]);
  assert.deepEqual(rateNo(eur, "2026-11-03"), ["213/A/NBP/2026", "4.4185"]);
  assert.equal(rateNo(eur, "2026-11-02"), null);
  assert.deepEqual(rateNo(afn, "2026-11-12"), ["045/B/NBP/2026", "0.059762"]);
  assert.deepEqual(rateNo(afn, "2026-11-10"), ["044/B/NBP/2026", "0.060112"]);
});

test("explains the days without a table", () => {
  const holiday = resolveRate(eur, "2026-11-12", "2026-11-15");
  assert.equal(holiday.kind, "ok");
  if (holiday.kind !== "ok") return;
  assert.equal(holiday.rate.no, "219/A/NBP/2026");
  assert.deepEqual(holiday.skipped, [{ date: "2026-11-11", reason: "independenceDay" }]);
  assert.equal(holiday.pending, null);

  const monday = resolveRate(eur, "2026-11-16", "2026-11-15");
  assert.ok(monday.kind === "ok");
  assert.deepEqual(monday.skipped, [
    { date: "2026-11-14", reason: "saturday" },
    { date: "2026-11-15", reason: "sunday" },
  ]);

  const nextDay = resolveRate(eur, "2026-11-13", "2026-11-15");
  assert.ok(nextDay.kind === "ok");
  assert.deepEqual(nextDay.skipped, []);
});

test("notices a table that is not published yet", () => {
  const upTo1113: NbpSeries = { ...eur, rates: eur.rates.filter((rate) => rate.effectiveDate <= "2026-11-13") };
  const tomorrow = resolveRate(upTo1113, "2026-11-17", "2026-11-16");
  assert.ok(tomorrow.kind === "ok");
  assert.equal(tomorrow.rate.no, "221/A/NBP/2026");
  assert.deepEqual(tomorrow.pending, { expected: "2026-11-16" });

  const later = resolveRate(upTo1113, "2026-11-20", "2026-11-16");
  assert.ok(later.kind === "ok");
  assert.deepEqual(later.pending, { expected: "2026-11-19" });

  /* A past gap the calendar does not explain: show NBP's table and no reasons. */
  const gap: NbpSeries = { ...eur, rates: eur.rates.filter((rate) => rate.effectiveDate !== "2026-11-12") };
  const odd = resolveRate(gap, "2026-11-13", "2026-11-15");
  assert.ok(odd.kind === "ok");
  assert.equal(odd.rate.no, "219/A/NBP/2026");
  assert.deepEqual(odd.skipped, []);
  assert.equal(odd.pending, null);

  assert.deepEqual(resolveRate(eur, "2026-11-02", "2026-11-15"), { kind: "none" });
});

test("finds the table B publication day", () => {
  assert.equal(previousTableBDay("2026-11-12"), "2026-11-10"); // Wednesday 11.11 is a holiday: Tuesday
  assert.equal(previousTableBDay("2026-11-10"), "2026-11-04");
  assert.equal(previousTableBDay("2026-11-05"), "2026-11-04");
  assert.equal(previousTableBDay("2025-12-29"), "2025-12-23"); // Christmas Eve on a Wednesday

  const beforeTuesday = resolveRate({ ...afn, rates: afn.rates.slice(0, 2) }, "2026-11-12", "2026-11-10");
  assert.ok(beforeTuesday.kind === "ok");
  assert.equal(beforeTuesday.rate.no, "044/B/NBP/2026");
  assert.deepEqual(beforeTuesday.pending, { expected: "2026-11-10" });
  assert.deepEqual(beforeTuesday.skipped, []);

  const published = resolveRate(afn, "2026-11-12", "2026-11-15");
  assert.ok(published.kind === "ok");
  assert.equal(published.pending, null);
});

test("converts grosze at a decimal rate, half up", () => {
  assert.equal(convertCents(123456, "4.4070"), 544071); // 5440,70592
  assert.equal(convertCents(100000, "0.012053"), 1205);
  assert.equal(convertCents(100, "0.00021903"), 0);
  assert.equal(convertCents(1000000, "0.00021903"), 219); // 2,1903
  assert.equal(convertCents(50, "1.0100"), 51); // 50,5 rounds up
  assert.equal(convertCents(0, "4.4070"), 0);
});

test("converts net and VAT separately (art. 106e ust. 11)", () => {
  assert.deepEqual(toPln(123456, "net", "23", "4.4070"), {
    net: 544071,
    vat: 125137,
    gross: 669208,
    foreign: { net: 123456, vat: 28395, gross: 151851 },
  });
  const small = toPln(33333, "net", "23", "4.3895");
  assert.equal(small?.vat, 33654); // not 33652 from PLN net × 23%
  assert.equal(small?.gross, 179969);

  const fromGross = toPln(12300, "gross", "23", "4.4070");
  assert.deepEqual(fromGross?.foreign, { net: 10000, vat: 2300, gross: 12300 });
  assert.equal(fromGross?.gross, (fromGross?.net ?? 0) + (fromGross?.vat ?? 0));

  assert.deepEqual(toPln(10000, "net", "zw", "4.4070"), { net: 44070, vat: null, gross: 44070, foreign: { net: 10000, vat: null, gross: 10000 } });
  assert.equal(toPln(10000, "net", "0", "4.4070")?.vat, 0);
  assert.equal(toPln(Number.NaN, "net", "23", "4.4070"), null);
});

test("formats the rate and the invoice note", () => {
  assert.equal(formatMid("4.4070", ","), "4,4070");
  assert.equal(formatMid("4.407", ","), "4,4070");
  assert.equal(formatMid("0.00021903", ","), "0,00021903");
  assert.equal(formatMid("0.012053", "."), "0.012053");
  const rate = eur.rates.at(-1)!;
  assert.equal(invoiceNote("pl", "EUR", rate), "Kurs średni NBP z dnia 13.11.2026, tabela nr 221/A/NBP/2026: 1 EUR = 4,4070 PLN");
  assert.equal(invoiceNote("en", "EUR", rate), "NBP average rate of 13.11.2026, table no. 221/A/NBP/2026: 1 EUR = 4.4070 PLN");
});

test("lists every NBP currency in the right table", () => {
  const tableA = nbpCurrencies.filter((currency) => currency.table === "A");
  assert.equal(tableA.length, 32);
  for (const code of ["EUR", "USD", "GBP", "CHF", "XDR", "HUF", "JPY", "IDR"]) {
    assert.ok(tableA.some((currency) => currency.code === code), code);
  }
  assert.deepEqual(nbpCurrencies.slice(0, 4).map((currency) => currency.code), ["EUR", "USD", "GBP", "CHF"]);
  assert.equal(new Set(nbpCurrencies.map((currency) => currency.code)).size, nbpCurrencies.length);
  assert.equal(nbpCurrencies.find((currency) => currency.code === "AFN")?.table, "B");
  assert.ok(nbpCurrencies.filter((currency) => currency.table === "B").length > 100);
});
