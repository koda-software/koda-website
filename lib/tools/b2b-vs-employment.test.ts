import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  b2bYear,
  breakEvenInvoice,
  compareAllForms,
  effectiveB2bInput,
  employerCostInvoice,
  employmentYear,
  formUnavailable,
  zusMonthly,
  type B2bInput,
  type EmploymentInput,
} from "./b2b-vs-employment";
import { rates2026 } from "./payroll-rates";

/* Expected values come from the independent Python reference in the vault plan
   (website/_assets/b2b-reference/calc.py and be.py), with external cross-checks noted. */

const zl = (amount: number) => Math.round(amount * 100);

const uop = (gross: number, options: Partial<EmploymentInput> = {}) =>
  employmentYear({ gross: zl(gross), kup: "standard", pit2: true, under26: false, ppk: false, ...options });

const b2b = (invoice: number, options: Partial<B2bInput> = {}) =>
  b2bYear({ invoice: zl(invoice), form: "skala", ryczaltBp: 1200, zus: "full", sickness: true, costs: 0, daysOff: 0, formerEmployer: false, ...options });

const avg = (year: { net: number }) => Math.round(year.net / 12);

/* ---------------------------------------------------------------- config */

test("T-C1: stored JDG ZUS amounts equal base × rate", () => {
  const { rates, full, preferential } = rates2026.jdgZus;
  const of = (base: number, bp: number) => Math.round((base * bp) / 10_000);
  for (const variant of [full, preferential]) {
    assert.equal(variant.pension, of(variant.base, rates.pensionBp));
    assert.equal(variant.disability, of(variant.base, rates.disabilityBp));
    assert.equal(variant.accident, of(variant.base, rates.accidentBp));
    assert.equal(variant.sickness, of(variant.base, rates.sicknessBp));
  }
  assert.equal(full.labourFund, of(full.base, rates.labourFundBp));
  assert.equal(preferential.labourFund, 0);
  assert.equal(full.base, of(rates2026.projectedAverageWage, 6000));
  assert.equal(preferential.base, of(rates2026.minimumWage, 3000));
  assert.equal(zusMonthly("full", true), zl(1926.76));
  assert.equal(zusMonthly("full", false), zl(1788.29));
  assert.equal(zusMonthly("preferential", true), zl(456.18));
  assert.equal(zusMonthly("preferential", false), zl(420.86));
  assert.equal(zusMonthly("start", true), 0);
});

test("T-C2: ryczałt health tiers are 9% of the tier share of the Q4 average wage", () => {
  for (const tier of rates2026.health.ryczaltTiers) {
    assert.equal(tier.monthly, Math.round((rates2026.averageWageQ4PreviousYear * tier.basePercent * 9) / 10_000));
  }
});

test("T-C3 and T-C4: minimum health and the 30× cap follow from the wages", () => {
  assert.equal(rates2026.health.minimumMonthly, Math.round((rates2026.minimumWage * rates2026.health.scaleBp) / 10_000));
  assert.equal(rates2026.pensionCapYear, 30 * rates2026.projectedAverageWage);
});

/* ---------------------------------------------------------------- employment */

test("T-U1: minimum wage", () => {
  const year = uop(4806);
  const m = year.months[0];
  assert.deepEqual([m.pension, m.disability, m.sickness, m.health, m.advance, m.net, m.employerCost], [46907, 7209, 11775, 37324, 16800, 360585, 579028]);
  assert.ok(year.months.every((row) => row.net === m.net));
});

test("T-U2: 10 000 zł, matches finwire.pl", () => {
  const year = uop(10000);
  const m = year.months[0];
  assert.deepEqual([m.social, m.health, m.advance, m.net, m.employerCost], [137100, 77661, 70500, 714739, 1204800]);
  assert.deepEqual([year.net, year.pit, year.health, year.employerCost], [8576868, 846000, 931932, 14457600]);
});

test("T-U3: 30 000 zł crosses the 32% bracket and the 30× cap, matches finwire.pl yearly", () => {
  const year = uop(30000);
  const nets = year.months.map((row) => row.net);
  const advances = year.months.map((row) => row.advance);
  assert.deepEqual(nets, [2078117, 2078117, 2078117, 2078117, 1914417, 1565317, 1565317, 1565317, 1565317, 1680908, 1764615, 1764615]);
  assert.deepEqual(advances, [277600, 277600, 277600, 277600, 441300, 790400, 790400, 790400, 790400, 853100, 898500, 898500]);
  const october = year.months[9];
  assert.deepEqual([october.pension, october.disability, october.health], [122976, 18900, 250616]);
  assert.deepEqual([year.months[10].pension, year.months[10].disability, year.months[10].health], [0, 0, 263385]);
  assert.deepEqual([year.social, year.health, year.pit, year.net, year.employerCost], [4064076, 2874233, 7363400, 21698291, 42114276]);
  assert.deepEqual(
    year.months.map((row) => row.bracketStarts),
    [false, false, false, false, true, false, false, false, false, false, false, false],
  );
  assert.equal(year.months.findIndex((row) => row.capStarts), 9);
});

test("T-U4: 15 000 zł, matches freenance.io first and last month", () => {
  const year = uop(15000);
  assert.equal(year.months[0].net, 1055558);
  assert.equal(year.months[8].net, 1055558);
  assert.equal(year.months[9].net, 916758);
  assert.equal(year.months[11].net, 801658);
  assert.equal(year.net, 12020096);
  assert.equal(year.employerCost, 21686400);
});

test("T-U5: PPK, the employer's part is taxed", () => {
  const year = uop(10000, { ppk: true });
  const m = year.months[0];
  assert.deepEqual([m.advance, m.ppkEmployee, m.net, m.employerCost], [72300, 20000, 692939, 1219800]);
});

test("T-U6: under 26, below the limit", () => {
  const year = uop(6000, { under26: true });
  assert.ok(year.months.every((row) => row.advance === 0 && row.net === 471143));
  assert.equal(year.net, 5653716);
  assert.ok(year.months.every((row) => !row.youthLimitEnds));
});

test("T-U7: under 26 with commuter costs, the limit runs out in November", () => {
  const year = uop(8000, { under26: true, kup: "commuter" });
  assert.ok(year.months.slice(0, 11).every((row) => row.advance === 0 && row.net === 628191));
  assert.equal(year.months[11].advance, 49200);
  assert.equal(year.months[11].net, 578991);
  assert.equal(year.months.findIndex((row) => row.youthLimitEnds), 10);
});

test("without PIT-2 the monthly 300 zł reduction is not applied", () => {
  assert.equal(uop(10000, { pit2: false }).months[0].advance, 100500);
});

test("employer cost as an invoice is the monthly average", () => {
  assert.equal(employerCostInvoice(uop(10000)), 1204800);
  assert.equal(employerCostInvoice(uop(30000)), Math.round(42114276 / 12));
});

/* ---------------------------------------------------------------- B2B */

test("T-B1: skala with costs, finwire.pl 6 282,86 (they divide an unrounded tax by 12)", () => {
  const year = b2b(10000, { costs: zl(500) });
  assert.deepEqual([year.socialMonthly, year.healthMonthly, year.tax, avg(year), year.net], [192676, 68159, 730500, 628290, 7539480]);
});

test("T-B2: skala without sickness insurance, kalkulatorb2b.pl 6 787,25", () => {
  const year = b2b(10000, { sickness: false });
  assert.deepEqual([year.socialMonthly, year.healthMonthly, year.tax, avg(year)], [178829, 73905, 822500, 678724]);
});

test("T-B3 to T-B5: ryczałt 12% on each ZUS variant, freenance.io within 0,50 zł", () => {
  const full = b2b(15000, { form: "ryczalt" });
  assert.deepEqual([full.healthMonthly, full.tax, avg(full), full.net, full.ryczaltTier], [83058, 1822700, 1072374, 12868492, 1]);
  const preferential = b2b(15000, { form: "ryczalt", zus: "preferential" });
  assert.deepEqual([preferential.socialMonthly, preferential.tax, avg(preferential)], [45618, 2034500, 1201782]);
  const start = b2b(15000, { form: "ryczalt", zus: "start" });
  assert.deepEqual([start.social, start.tax, avg(start)], [0, 2100200, 1241925]);
});

test("T-B6: liniowy, freenance.io 10 070,65", () => {
  const year = b2b(15000, { form: "liniowy" });
  assert.deepEqual([year.healthMonthly, year.tax, avg(year)], [64059, 2834600, 1007048]);
});

test("T-B7: liniowy health deduction capped at 14 100 zł", () => {
  const year = b2b(30000, { form: "liniowy" });
  assert.deepEqual([year.healthMonthly, year.health, year.tax, avg(year)], [137559, 1650708, 6132800, 2158698]);
});

test("T-B8: skala in the 32% bracket", () => {
  const year = b2b(20000);
  assert.deepEqual([year.tax, avg(year)], [4180100, 1296323]);
});

test("T-B9: skala minimum health", () => {
  const year = b2b(4000, { zus: "preferential" });
  assert.deepEqual([year.healthMonthly, year.tax, avg(year)], [43254, 150300, 298603]);
});

test("T-B10: one grosz more crosses the 300 000 zł ryczałt tier", () => {
  const below = b2bYear({ ...baseInput("ryczalt"), invoice: 2692676 });
  const above = b2bYear({ ...baseInput("ryczalt"), invoice: 2692677 });
  assert.deepEqual([below.healthMonthly, avg(below)], [83058, 2121925]);
  assert.deepEqual([above.healthMonthly, avg(above)], [149504, 2059464]);
  assert.equal(below.net - above.net, 749540);
});

test("T-B11: 26 days without an invoice", () => {
  const year = b2b(18000, { form: "ryczalt", daysOff: 26 });
  assert.deepEqual([year.revenue, year.tax, avg(year)], [19380237, 1988400, 1173586]);
});

test("T-B12: ryczałt 8,5% in the top health tier", () => {
  const year = b2b(30000, { form: "ryczalt", ryczaltBp: 850 });
  assert.deepEqual([year.healthMonthly, year.ryczaltTier, year.tax, avg(year)], [149504, 2, 2787200, 2425553]);
});

test("T-B13: ryczałt in the lowest health tier, ulga na start", () => {
  const year = b2b(4000, { form: "ryczalt", zus: "start" });
  assert.deepEqual([year.healthMonthly, year.ryczaltTier, year.tax, avg(year)], [49835, 0, 540100, 305157]);
});

test("T-B14: the default invoice on every form", () => {
  const forms = compareAllForms({ ...baseInput("skala"), invoice: zl(18000) });
  assert.deepEqual(
    forms.map((row) => (row.year ? avg(row.year) : null)),
    [1178323, 1238140, 1336374],
  );
});

test("solidarity levy above 1 000 000 zł of income (reference script)", () => {
  assert.equal(b2b(100000).tax, 35607600);
  assert.equal(b2b(100000, { form: "liniowy" }).tax, 22743900);
});

test("a loss means no tax and the minimum health contribution", () => {
  const year = b2b(5000, { costs: zl(3000) });
  assert.deepEqual([year.tax, year.healthMonthly, year.net], [0, 43254, -431160]);
});

test("days off, costs and preferential ZUS without sickness together (reference script)", () => {
  const year = b2b(18000, { zus: "preferential", sickness: false, costs: zl(1000), daysOff: 26 });
  assert.deepEqual([year.healthMonthly, year.tax, avg(year)], [132564, 2896100, 1099028]);
});

test("a former employer bars liniowy, ryczałt and the ZUS reliefs", () => {
  const input: B2bInput = { ...baseInput("ryczalt"), invoice: zl(15000), zus: "start", formerEmployer: true };
  const effective = effectiveB2bInput(input);
  assert.equal(effective.form, "skala");
  assert.equal(effective.zus, "full");
  assert.equal(formUnavailable("liniowy", input), "formerEmployer");
  const forms = compareAllForms(input);
  assert.deepEqual(
    forms.map((row) => row.unavailable),
    [null, "formerEmployer", "formerEmployer"],
  );
  assert.equal(forms[0].year?.socialMonthly, 192676);
});

test("ryczałt is barred above the revenue limit", () => {
  assert.equal(formUnavailable("ryczalt", { invoice: zl(800_000), formerEmployer: false }), "revenueLimit");
  assert.equal(formUnavailable("ryczalt", { invoice: zl(700_000), formerEmployer: false }), null);
});

/* ---------------------------------------------------------------- break-even */

function baseInput(form: B2bInput["form"]): B2bInput {
  return { invoice: 0, form, ryczaltBp: 1200, zus: "full", sickness: true, costs: 0, daysOff: 0, formerEmployer: false };
}

function assertBreakEven(target: number, input: B2bInput, expected: number) {
  const result = breakEvenInvoice(target, input);
  assert.ok(result, "expected a break-even invoice");
  assert.equal(result.invoice, zl(expected), `${input.form} ${input.zus}`);
  assert.ok(b2bYear({ ...input, invoice: result.invoice }).net >= target);
  assert.ok(b2bYear({ ...input, invoice: result.invoice - 1 }).net < target);
}

/* The plan's T-E values came from a bisection on fractional amounts rounded to the grosz;
   several of them fall 1 grosz short of the target. These are the first invoices, grosz by
   grosz, that reach it (checked by a brute-force scan of the reference model). */
test("T-E1: break-even for 10 000 zł gross", () => {
  const target = uop(10000).net;
  assert.equal(target, 8576868);
  assertBreakEven(target, baseInput("skala"), 10594.32);
  assertBreakEven(target, baseInput("liniowy"), 11205.39);
  assertBreakEven(target, baseInput("ryczalt"), 10935.98);
  assertBreakEven(target, { ...baseInput("skala"), costs: zl(500) }, 11094.32);
  assertBreakEven(target, { ...baseInput("skala"), zus: "preferential" }, 9123.74);
  assertBreakEven(target, { ...baseInput("skala"), zus: "start" }, 8667.56);
});

test("T-E2: break-even for 15 000 zł gross", () => {
  const target = uop(15000).net;
  assertBreakEven(target, baseInput("skala"), 15005.97);
  assertBreakEven(target, baseInput("liniowy"), 14930.26);
  assertBreakEven(target, baseInput("ryczalt"), 14196.59);
});

test("T-E3: break-even for 20 000 zł gross", () => {
  const target = uop(20000).net;
  assert.equal(target, 15074436);
  assertBreakEven(target, baseInput("skala"), 19320.02);
  assertBreakEven(target, baseInput("liniowy"), 18234.54);
  assertBreakEven(target, baseInput("ryczalt"), 17089.04);
});

test("break-even on ryczałt skips the dip above the 300 000 zł tier", () => {
  const input = baseInput("ryczalt");
  /* Just above what the last invoice below the tier brings in: the answer must be in the top tier, past the dip. */
  const lastBelow = b2bYear({ ...input, invoice: 2692676 }).net;
  const result = breakEvenInvoice(lastBelow + 1, input);
  assert.ok(result);
  assert.ok(result.invoice > 2692677);
  assert.equal(b2bYear({ ...input, invoice: result.invoice }).ryczaltTier, 2);
  assert.ok(b2bYear({ ...input, invoice: result.invoice }).net >= lastBelow + 1);
  assert.ok(b2bYear({ ...input, invoice: result.invoice - 1 }).net < lastBelow + 1);
  assert.equal(result.tierEdge, 300_000_00);

  /* A target reachable below the tier stays below it. */
  const below = breakEvenInvoice(lastBelow - 10_000, input);
  assert.ok(below && below.invoice < 2692677);
});

test("break-even with a former employer falls back to skala and full ZUS", () => {
  const target = uop(10000).net;
  const result = breakEvenInvoice(target, { ...baseInput("ryczalt"), zus: "start", formerEmployer: true });
  assert.equal(result?.invoice, zl(10594.32));
});
