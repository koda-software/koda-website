import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { REGISTER_COLUMNS, buildSnapshot, extractRegisterData, listDateFromFileName, parseSemicolonCsv, snapshotRows, validateRegister } from "./e-delivery-register";

/* The registerData block of the gov.pl page from 15.11.2026 (list of 13.11.2026), cut to 300 real rows. */
const sampleHtml = readFileSync(new URL("./fixtures/e-delivery-register-sample.html", import.meta.url), "utf8");
const data = extractRegisterData(sampleHtml);
const sampleRows = parseSemicolonCsv(data.csv).length - 1;

test("extracts the register from the page", () => {
  assert.equal(data.fileName, "Podmioty_publiczne_13.11.2026.csv");
  assert.deepEqual(data.columns, REGISTER_COLUMNS);
  assert.equal(sampleRows, 300);
  assert.throws(() => extractRegisterData("<html><pre id=\"pageId\">1</pre></html>"));
});

test("parses quoted CSV fields with separators and doubled quotes", () => {
  const rows = parseSemicolonCsv(data.csv);
  const ilawa = rows.find((row) => row[1] === "IŁAWA" && row[0].includes("KUBUSIA"));
  assert.ok(ilawa);
  assert.equal(ilawa.length, 5);
  assert.ok(ilawa[0].includes('"CHATKA PRZYJACIOŁ KUBUSIA PUCHATKA"'));
  assert.equal(ilawa[0], 'PRZEDSZKOLE MIEJSKIE NR 4 IM; "CHATKA PRZYJACIOŁ KUBUSIA PUCHATKA" W IŁAWIE');
  assert.deepEqual(parseSemicolonCsv('a;"b;""c""";d\r\ne;f;g\n'), [
    ["a", 'b;"c"', "d"],
    ["e", "f", "g"],
  ]);
});

test("reads the list date from the file name", () => {
  assert.equal(listDateFromFileName("Podmioty_publiczne_13.11.2026.csv"), "2026-11-13");
  assert.equal(listDateFromFileName("Podmioty_publiczne_31.02.2026.csv"), null);
  assert.equal(listDateFromFileName("Podmioty_13.11.2026.csv"), null);
  assert.equal(listDateFromFileName("Podmioty_publiczne_13.11.2026.xlsx"), null);
});

test("validates the register before it replaces the last good copy", () => {
  const options = { minRows: 200 };
  const passed = validateRegister(data, null, "2026-11-16", null, options);
  assert.ok(passed.ok);
  assert.equal(passed.rows.length, 300);
  assert.equal(passed.dropped, 0);
  assert.equal(passed.listDate, "2026-11-13");

  const renamed = { ...data, columns: ["NAZWA", ...REGISTER_COLUMNS.slice(1)] };
  assert.equal(validateRegister(renamed, null, "2026-11-16", null, options).ok, false);
  assert.equal(validateRegister(data, Math.round(sampleRows / 0.85), "2026-11-16", null, options).ok, false, "15% fewer rows");
  assert.equal(validateRegister(data, null, "2026-11-12", null, options).ok, false, "file date after today");
  assert.equal(validateRegister(data, null, "2026-11-16", "2026-11-14", options).ok, false, "older than the last list");
  assert.equal(validateRegister(data, null, "2026-11-16", null).ok, false, "below the default 40 000 rows");
});

test("round-trips the snapshot, empty voivodeship included", () => {
  const result = validateRegister(data, null, "2026-11-16", null, { minRows: 200 });
  assert.ok(result.ok);
  const snapshot = buildSnapshot(result.rows, data.fileName, result.listDate);
  const embassy = snapshot.rows.find((row) => row[3] === "000177916");
  assert.ok(embassy);
  assert.equal(embassy[2], -1);
  assert.ok(!embassy[4].startsWith("AE:"));
  assert.deepEqual(snapshotRows(JSON.parse(JSON.stringify(snapshot))), result.rows);
});
