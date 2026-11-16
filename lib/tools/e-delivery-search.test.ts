import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { extractRegisterData, validateRegister } from "./e-delivery-register";
import { buildIndex, normalizeForSearch, searchByRegon, searchByText, highlightParts } from "./e-delivery-search";

/* 300 real rows of the gov.pl list of 13.11.2026. */
const html = readFileSync(new URL("./fixtures/e-delivery-register-sample.html", import.meta.url), "utf8");
const result = validateRegister(extractRegisterData(html), null, "2026-11-16", null, { minRows: 200 });
if (!result.ok) throw new Error(result.error);
const index = buildIndex(result.rows);

const names = (q: string) => searchByText(index, q).items.map((row) => row.name);
const first = (q: string) => searchByText(index, q).items[0];

test("normalizes Polish text for search", () => {
  assert.deepEqual(normalizeForSearch("Urząd Miasta Łodzi"), ["URZAD", "MIASTA", "LODZI"]);
  assert.deepEqual(normalizeForSearch("POMORSKI URZĄD CELNO-SKARBOWY"), ["POMORSKI", "URZAD", "CELNO", "SKARBOWY"]);
});

test("matches the town column and ignores diacritics", () => {
  const found = searchByText(index, "urząd skarbowy gdynia");
  assert.equal(found.total, 3);
  assert.deepEqual(
    found.items.map((row) => row.name),
    ["DRUGI URZĄD SKARBOWY W GDYNI", "PIERWSZY URZĄD SKARBOWY W GDYNI", "POMORSKI URZĄD CELNO-SKARBOWY W GDYNI"],
  );
  assert.equal(first("urzad miasta gdyni").ade, "AE:PL-50737-38243-FSIWS-33");
});

test("expands abbreviations and keeps the literal word", () => {
  assert.equal(first("zus gdańsk").name, "ZAKŁAD UBEZPIECZEŃ SPOŁECZNYCH ODDZIAŁ W GDAŃSKU");
  assert.equal(first("zus gdańsk").ade, "AE:PL-55613-12018-JDCFU-28");
  assert.equal(first("zus centrala").ade, "AE:PL-92659-41628-BJDEF-20");
  assert.equal(first("gops tyrawa").name, "GOPS TYRAWA WOŁOSKA");
  assert.equal(first("us gdynia").name, "DRUGI URZĄD SKARBOWY W GDYNI", "the expansion beats the literal US in USŁUG");
  assert.equal(first("krus centrala").name, "KASA ROLNICZEGO UBEZPIECZENIA SPOŁECZNEGO CENTRALA");
});

test("ranks an exact name first", () => {
  assert.equal(first("ministerstwo finansow").ade, "AE:PL-83190-36017-RFBJU-21");
  assert.equal(first("Urząd m.st. Warszawy").name, "URZĄD M.ST. WARSZAWY");
});

test("retries long words cut short when nothing matches", () => {
  assert.ok(names("urząd dzielnicy mokotowa").some((name) => name.includes("MOKOTÓW")));
});

test("pages through the results", () => {
  const all = searchByText(index, "ambasada", 0, 50);
  const second = searchByText(index, "ambasada", 2, 2);
  assert.ok(all.total > 4);
  assert.deepEqual(second.items, all.items.slice(2, 4));
  assert.equal(second.total, all.total);
});

test("finds rows by REGON, with the 14-digit local units of a 9-digit REGON", () => {
  const embassies = searchByRegon(index, "000177916");
  assert.equal(embassies.length, result.rows.filter((row) => row.regon === "000177916").length);
  assert.ok(embassies.length >= 10);

  const gdynia = searchByRegon(index, "001021197").map((row) => row.name);
  assert.ok(gdynia.includes("PIERWSZY URZĄD SKARBOWY W GDYNI"));
  assert.ok(gdynia.includes("DRUGI URZĄD SKARBOWY W GDYNI"));
  assert.equal(gdynia[0], "IZBA ADMINISTRACJI SKARBOWEJ W GDAŃSKU", "the exact REGON first");

  assert.deepEqual(
    searchByRegon(index, "00102119700187").map((row) => row.name),
    ["PIERWSZY URZĄD SKARBOWY W GDYNI"],
  );
});

test("returns nothing for nonsense", () => {
  assert.equal(searchByText(index, "xyzxyz").total, 0);
});

test("highlights the start of every word a query word begins, whatever the Polish letters", () => {
  const marked = (text: string, query: string) =>
    highlightParts(text, query)
      .map((part) => (part.match ? `[${part.text}]` : part.text))
      .join("");
  assert.equal(marked("PIERWSZY URZĄD SKARBOWY W GDYNI", "urzad skarb gdyn"), "PIERWSZY [URZĄD] [SKARB]OWY W [GDYN]I");
  assert.equal(marked("Urząd Miasta Łodzi", "łódź miast w"), "Urząd [Miast]a [Łodz]i");
  assert.equal(marked("ZAKŁAD UBEZPIECZEŃ SPOŁECZNYCH", "xyz"), "ZAKŁAD UBEZPIECZEŃ SPOŁECZNYCH");
  assert.equal(marked("GOPS-TYRAWA", "tyr"), "GOPS-[TYR]AWA");
});
