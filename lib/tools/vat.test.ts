import { strict as assert } from "node:assert";
import { test } from "node:test";
import { formatCents, invoiceTotals, parseCents, parseQuantity, quickConvert, vatFromGross, vatFromNet } from "./vat";

test("rounds VAT to the grosz, half up", () => {
  assert.equal(vatFromNet(3333, 23), 767); // 7,6659
  assert.equal(vatFromNet(50, 23), 12); // 11,5 -> 12
  assert.equal(vatFromNet(10000, 8), 800);
  assert.equal(vatFromGross(12300, 23), 2300);
  assert.equal(vatFromGross(100000, 23), 18699);
});

test("parses amounts and quantities", () => {
  assert.equal(parseCents("1 234,56"), 123456);
  assert.equal(parseCents("100,-"), 10000);
  assert.equal(parseCents(""), null);
  assert.ok(Number.isNaN(parseCents("abc") as number));
  assert.ok(Number.isNaN(parseCents("-5") as number));
  assert.equal(parseQuantity("1,5"), 1.5);
  assert.equal(parseQuantity(""), null);
  assert.ok(Number.isNaN(parseQuantity("x") as number));
});

test("formats grosze", () => {
  assert.equal(formatCents(123456), "1 234,56");
  assert.equal(formatCents(5), "0,05");
  assert.equal(formatCents(-1), "−0,01");
  assert.equal(formatCents(123456, "."), "1,234.56");
});

test("converts from net, VAT and gross", () => {
  assert.deepEqual(quickConvert("net", 100000, "23"), { kind: "ok", net: 100000, vat: 23000, gross: 123000, nearest: null });
  assert.deepEqual(quickConvert("vat", 23000, "23"), { kind: "ok", net: 100000, vat: 23000, gross: 123000, nearest: null });
  assert.deepEqual(quickConvert("gross", 100000, "23"), { kind: "ok", net: 81301, vat: 18699, gross: 100000, nearest: null });
  assert.deepEqual(quickConvert("gross", 10800, "8"), { kind: "ok", net: 10000, vat: 800, gross: 10800, nearest: null });
  assert.deepEqual(quickConvert("net", 5000, "zw"), { kind: "ok", net: 5000, vat: 0, gross: 5000, nearest: null });
  assert.deepEqual(quickConvert("vat", 100, "zw"), { kind: "error", reason: "noVat" });
  assert.deepEqual(quickConvert("net", null, "23"), { kind: "empty" });
  assert.deepEqual(quickConvert("net", NaN, "23"), { kind: "error", reason: "invalid" });
});

test("finds the nearest net amounts when a gross amount cannot be reached", () => {
  // At 23%, gross climbs by 1 or 2 grosze per grosz of net, so some amounts are skipped.
  let unreachable: number | null = null;
  for (let gross = 100000; gross < 100010 && unreachable === null; gross += 1) {
    const result = quickConvert("gross", gross, "23");
    if (result.kind === "ok" && result.nearest) unreachable = gross;
  }
  assert.ok(unreachable !== null, "expected an unreachable gross amount near 1000 zł");

  const result = quickConvert("gross", unreachable!, "23");
  assert.equal(result.kind, "ok");
  if (result.kind === "ok" && result.nearest) {
    assert.equal(result.gross, unreachable);
    assert.ok(result.nearest.below.gross < unreachable!);
    assert.ok(result.nearest.above.gross > unreachable!);
    assert.equal(result.nearest.above.net - result.nearest.below.net, 1);
  }
});

test("totals an invoice both ways and reports the difference", () => {
  const rows = [
    { quantity: "1", price: "33,33", rate: "23" as const },
    { quantity: "1", price: "33,33", rate: "23" as const },
    { quantity: "1", price: "33,33", rate: "23" as const },
  ];

  const bySum = invoiceTotals(rows, "net", "sum");
  assert.deepEqual(bySum.total, { net: 9999, vat: 2300, gross: 12299 });
  assert.equal(bySum.otherMethodVat, 2301);

  const byLine = invoiceTotals(rows, "net", "line");
  assert.deepEqual(byLine.total, { net: 9999, vat: 2301, gross: 12300 });
  assert.equal(byLine.otherMethodVat, 2300);
});

test("groups mixed rates and keeps the gross total fixed for gross prices", () => {
  const rows = [
    { quantity: "2", price: "61,50", rate: "23" as const },
    { quantity: "1,5", price: "10,80", rate: "8" as const },
    { quantity: "1", price: "50", rate: "zw" as const },
    { quantity: "", price: "10", rate: "5" as const },
  ];

  const result = invoiceTotals(rows, "gross", "sum");
  assert.deepEqual(
    result.rates.map((row) => [row.rate, row.net, row.vat, row.gross]),
    [
      ["23", 10000, 2300, 12300],
      ["8", 1500, 120, 1620],
      ["zw", 5000, 0, 5000],
    ],
  );
  assert.equal(result.lines[3].valid, false);
  assert.deepEqual(result.total, { net: 16500, vat: 2420, gross: 18920 });
});
