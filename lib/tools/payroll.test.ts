import { strict as assert } from "node:assert";
import { test } from "node:test";
import { employmentYear } from "./b2b-vs-employment";
import { compareContracts, firstMonth, grossFromNet, optionUnavailable, payrollYear, type PayrollInput } from "./payroll";
import { payrollYears, rates2026, rates2027, type PayrollRates } from "./payroll-rates";

/* Expected values come from the independent Python reference in the vault plan
   (website/_assets/salary-reference/salary.py and run.py), with external cross-checks
   noted in website/salary-calculator-tool-plan.md, "Tests". */

const zl = (amount: number) => Math.round(amount * 100);

const base: Omit<PayrollInput, "gross"> = {
  contract: "employment",
  kup: "standard",
  civilKup: "standard",
  status: "only",
  sickness: true,
  pit2: true,
  relief: "none",
  ppk: false,
};

const run = (gross: number, options: Partial<PayrollInput> = {}, rates: PayrollRates = rates2026) => payrollYear({ ...base, gross: zl(gross), ...options }, rates);
const uop = (gross: number, options: Partial<PayrollInput> = {}, rates?: PayrollRates) => run(gross, { contract: "employment", ...options }, rates);
const mandate = (gross: number, options: Partial<PayrollInput> = {}, rates?: PayrollRates) => run(gross, { contract: "mandate", pit2: false, ...options }, rates);
const work = (gross: number, options: Partial<PayrollInput> = {}, rates?: PayrollRates) => run(gross, { contract: "work", pit2: false, ...options }, rates);

const allSame = (year: { months: Array<{ net: number }> }) => year.months.every((row) => row.net === year.months[0].net);

/* ---------------------------------------------------------------- config */

test("T-C5: the 50% cost limit equals the first bracket", () => {
  for (const rates of Object.values(payrollYears)) assert.equal(rates.pit.authorKupYearLimit, rates.pit.brackets[0].upTo);
});

test("T-C6: the 30× cap is 30 × the projected average wage in every year", () => {
  for (const rates of Object.values(payrollYears)) assert.equal(rates.pensionCapYear, 30 * rates.projectedAverageWage);
  assert.equal(rates2027.pensionCapYear, zl(300990));
});

test("T-C7: minimum wage and hourly rate match the regulations", () => {
  assert.deepEqual([rates2026.minimumWage, rates2026.minimumHourlyRate], [zl(4806), zl(31.4)]);
  assert.deepEqual([rates2027.minimumWage, rates2027.minimumHourlyRate], [zl(4950), zl(32.3)]);
  assert.equal(rates2026.scaleStatus, "law");
  assert.equal(rates2027.scaleStatus, "bill");
});

/* ---------------------------------------------------------------- employment */

test("T-U1: minimum wage", () => {
  const year = uop(4806);
  const m = year.months[0];
  assert.deepEqual([m.pension, m.disability, m.sickness, m.health, m.advance, m.net, m.employerCost], [46907, 7209, 11775, 37324, 16800, 360585, 579028]);
  assert.ok(allSame(year));
});

test("T-U2: 6 000 zł", () => {
  const year = uop(6000);
  const m = year.months[0];
  assert.deepEqual([m.health, m.advance, m.net, m.employerCost], [46597, 29100, 442043, 722880]);
  assert.deepEqual([year.net, year.employerCost], [zl(53045.16), zl(86745.6)]);
});

test("T-U3: 10 000 zł", () => {
  const year = uop(10000);
  const m = year.months[0];
  assert.deepEqual([m.social, m.health, m.advance, m.net, m.employerCost], [137100, 77661, 70500, 714739, 1204800]);
  assert.deepEqual([year.net, year.pit], [zl(85768.68), zl(8460)]);
});

test("T-U4: 25 000 zł for twelve months", () => {
  const year = uop(25000);
  const at = (month: number) => year.months[month - 1];
  for (const month of [1, 2, 3, 4, 5]) assert.deepEqual([at(month).advance, at(month).net], [zl(2259), zl(17371.97)]);
  assert.deepEqual([at(6).advance, at(6).net], [zl(3846), zl(15784.97)]);
  assert.ok(at(6).bracketStarts);
  for (const month of [7, 8, 9, 10, 11]) assert.deepEqual([at(month).advance, at(month).net], [zl(6523), zl(13107.97)]);
  const m12 = at(12);
  assert.deepEqual([m12.pension, m12.disability, m12.health, m12.advance, m12.net, m12.employerCost], [zl(741.76), zl(114), zl(2117.86), zl(7150), zl(14263.88), zl(27290.76)]);
  assert.ok(m12.capStarts);
  assert.deepEqual([year.net, year.pit, year.health, year.employerCost], [zl(182448.55), zl(54906), zl(23474.69), zl(358610.76)]);
});

test("T-U5: 10 000 zł without PIT-2", () => {
  const m = uop(10000, { pit2: false }).months[0];
  assert.deepEqual([m.advance, m.net], [zl(1005), zl(6847.39)]);
});

test("T-U6: 10 000 zł with PPK", () => {
  const m = uop(10000, { ppk: true }).months[0];
  assert.deepEqual([m.advance, m.net, m.employerCost], [zl(723), zl(6929.39), zl(12198)]);
});

test("T-U7: every zero-PIT relief has the same math as under 26", () => {
  const under26 = uop(6000, { relief: "under26" });
  assert.deepEqual([under26.months[0].advance, under26.months[0].net], [0, zl(4711.43)]);
  for (const relief of ["returnee", "family4", "senior"] as const) assert.deepEqual(uop(6000, { relief }), under26);
});

test("T-U8: part-time below the minimum wage has no Fundusz Pracy", () => {
  const m = uop(3000).months[0];
  assert.equal(m.employer.labourFund, 0);
  assert.equal(m.employerCost, zl(3540.9));
});

test("T-U9: employment through payrollYear equals the B2B tool's employmentYear", () => {
  for (const [gross, options] of [
    [4806, {}],
    [10000, {}],
    [30000, {}],
    [10000, { pit2: false }],
    [10000, { ppk: true }],
    [12000, { under26: true }],
    [10000, { kup: "commuter" as const }],
  ] as const) {
    const opts = { kup: "standard" as const, pit2: true, under26: false, ppk: false, ...options };
    const b2b = employmentYear({ gross: zl(gross), ...opts });
    const year = uop(gross, { kup: opts.kup, pit2: opts.pit2, ppk: opts.ppk, relief: opts.under26 ? "under26" : "none" });
    assert.deepEqual(
      year.months.map((row) => [row.social, row.health, row.advance, row.net, row.employerCost, row.capStarts, row.bracketStarts, row.reliefEnds]),
      b2b.months.map((row) => [row.social, row.health, row.advance, row.net, row.employerCost, row.capStarts, row.bracketStarts, row.youthLimitEnds]),
    );
    assert.deepEqual([year.net, year.pit, year.employerCost], [b2b.net, b2b.pit, b2b.employerCost]);
  }
});

/* ---------------------------------------------------------------- zlecenie */

test("T-Z1: 3 000 zł, only title, chorobowe, PIT-2 (finwire.pl)", () => {
  const m = mandate(3000, { pit2: true }).months[0];
  assert.deepEqual([m.pension, m.disability, m.sickness, m.health, m.kup, m.taxBase, m.advance, m.net], [zl(292.8), zl(45), zl(73.5), zl(232.98), zl(517.74), zl(2071), 0, zl(2355.72)]);
  assert.deepEqual([m.employer.labourFund, m.employer.fgsp, m.employerCost], [0, zl(3), zl(3540.9)]);
});

test("T-Z2: 3 000 zł without PIT-2", () => {
  const m = mandate(3000).months[0];
  assert.deepEqual([m.advance, m.net], [zl(249), zl(2106.72)]);
});

test("T-Z3: 3 000 zł without chorobowe", () => {
  const m = mandate(3000, { sickness: false }).months[0];
  assert.deepEqual([m.sickness, m.health, m.advance, m.net], [0, zl(239.6), zl(256), zl(2166.6)]);
  assert.equal(mandate(3000, { sickness: false, pit2: true }).months[0].net, zl(2422.6));
});

test("T-Z4: pupil or student under 26", () => {
  const year = mandate(3000, { status: "student" });
  const m = year.months[0];
  assert.deepEqual([m.social, m.health, m.advance, m.net, m.employerCost], [0, 0, 0, zl(3000), zl(3000)]);
  assert.equal(year.net, zl(36000));
});

test("T-Z5: employed elsewhere at the minimum wage or more: health only", () => {
  const withPit2 = mandate(3000, { status: "secondJob", pit2: true }).months[0];
  const without = mandate(3000, { status: "secondJob" }).months[0];
  assert.deepEqual([withPit2.social, withPit2.health, withPit2.advance, withPit2.net, withPit2.employerCost], [0, zl(270), 0, zl(2730), zl(3000)]);
  assert.deepEqual([without.advance, without.net], [zl(288), zl(2442)]);
  assert.equal(mandate(5000, { status: "secondJob" }).months[0].net, zl(4070));
});

test("T-Z6: 10 000 zł (freenance.io)", () => {
  const m = mandate(10000, { pit2: true }).months[0];
  assert.deepEqual([m.kup, m.advance, m.net, m.employerCost], [zl(1725.8), zl(528), zl(7324.39), zl(12048)]);
});

test("T-Z7: 26 000 zł: the 30× cap applies, advances stay 12%", () => {
  const year = mandate(26000, { pit2: true });
  assert.equal(year.months[0].net, zl(18562.21));
  assert.equal(year.months.findIndex((row) => row.capStarts) + 1, 11);
  assert.deepEqual([year.months[10].pension, year.months[11].pension], [zl(2205.76), 0]);
  assert.equal(year.net, zl(225441.03));
});

test("T-Z8: 30 000 zł: income above the first bracket is settled in the return", () => {
  const year = mandate(30000, { pit2: true });
  const at = (month: number) => year.months[month - 1];
  for (let month = 1; month <= 9; month += 1) assert.deepEqual([at(month).advance, at(month).net], [zl(2185), zl(21372.17)]);
  assert.deepEqual([at(10).advance, at(10).net], [zl(2373), zl(22967.08)]);
  for (const month of [11, 12]) assert.deepEqual([at(month).advance, at(month).net], [zl(2509), zl(24122.15)]);
  assert.deepEqual([year.pit, year.net], [zl(27056), zl(263560.91)]);
  assert.ok(year.yearlyIncomeAboveFirstBracket > 0);
  assert.equal(year.yearlySurcharge, Math.round((year.yearlyIncomeAboveFirstBracket * 2000) / 10_000 / 100) * 100);
});

test("T-Z9: at the minimum wage Fundusz Pracy is due", () => {
  const m = mandate(4806, { pit2: true }).months[0];
  assert.deepEqual([m.advance, m.net, m.employerCost], [zl(98), zl(3675.85), zl(5790.28)]);
});

test("T-Z10: a 200 zł contract pays the 12% flat tax", () => {
  const m = mandate(200).months[0];
  assert.deepEqual([m.social, m.health, m.advance, m.flatTax, m.kup, m.net, m.employerCost], [zl(27.42), zl(15.53), zl(24), true, 0, zl(133.05), zl(236.06)]);
  assert.equal(mandate(200, { pit2: true }).months[0].advance, zl(24));
});

test("T-Z11: the jump from 200 to 201 zł", () => {
  const at200 = mandate(200, { status: "secondJob" }).months[0];
  const at201 = mandate(201, { status: "secondJob" }).months[0];
  assert.deepEqual([at200.advance, at200.flatTax, at200.net], [zl(24), true, zl(158)]);
  assert.deepEqual([at201.health, at201.advance, at201.flatTax, at201.net], [zl(18.09), zl(19), false, zl(163.91)]);
});

test("T-Z12: 10 000 zł, student, the relief runs out in September", () => {
  const year = mandate(10000, { status: "student" });
  const at = (month: number) => year.months[month - 1];
  for (let month = 1; month <= 8; month += 1) assert.deepEqual([at(month).advance, at(month).net], [0, zl(10000)]);
  assert.deepEqual([at(9).advance, at(9).net, at(9).reliefEnds], [zl(429), zl(9571), true]);
  for (const month of [10, 11, 12]) assert.deepEqual([at(month).advance, at(month).net], [zl(960), zl(9040)]);
  assert.equal(year.months.filter((row) => row.reliefEnds).length, 1);
  assert.equal(year.net, zl(116691));
});

test("T-Z13: 10 000 zł, under 26 but not a student: ZUS due, no tax up to the limit", () => {
  const year = mandate(10000, { relief: "under26" });
  const at = (month: number) => year.months[month - 1];
  for (let month = 1; month <= 8; month += 1) assert.deepEqual([at(month).advance, at(month).net], [0, zl(7852.39)]);
  assert.equal(at(9).advance, zl(370));
  for (const month of [10, 11, 12]) assert.deepEqual([at(month).advance, at(month).net], [zl(828), zl(7024.39)]);
});

test("T-Z14: zlecenie with your own employer: chorobowe forced, no flat tax", () => {
  const m = mandate(3000, { status: "ownEmployer", sickness: false }).months[0];
  assert.deepEqual([m.sickness, m.net], [zl(73.5), zl(2106.72)]);
  assert.equal(mandate(200, { status: "ownEmployer" }).months[0].flatTax, false);
});

test("a student under 26 with a contract up to 200 zł is exempt, not flat-taxed", () => {
  const m = mandate(150, { status: "student" }).months[0];
  assert.deepEqual([m.flatTax, m.advance, m.net], [false, 0, zl(150)]);
});

/* ---------------------------------------------------------------- dzieło */

test("T-D1: 3 000 zł, 20%", () => {
  const m = work(3000).months[0];
  assert.deepEqual([m.social, m.health, m.kup, m.taxBase, m.advance, m.net, m.employerCost], [0, 0, zl(600), zl(2400), zl(288), zl(2712), zl(3000)]);
});

test("T-D2: 3 000 zł, 50%", () => {
  const m = work(3000, { civilKup: "author" }).months[0];
  assert.deepEqual([m.taxBase, m.advance, m.net], [zl(1500), zl(180), zl(2820)]);
});

test("T-D3: 3 000 zł with PIT-2", () => {
  assert.equal(work(3000, { pit2: true }).months[0].net, zl(3000));
});

test("T-D4: 10 000 zł, 20% and 50% (freenance.io)", () => {
  assert.equal(work(10000).months[0].net, zl(9040));
  assert.equal(work(10000, { civilKup: "author" }).months[0].net, zl(9400));
});

test("T-D5: a 200 zł contract", () => {
  const m = work(200).months[0];
  assert.deepEqual([m.flatTax, m.advance, m.net], [true, zl(24), zl(176)]);
});

test("T-D6: 30 000 zł at 50%: the cost limit is reached in September", () => {
  const year = work(30000, { civilKup: "author" });
  const at = (month: number) => year.months[month - 1];
  for (let month = 1; month <= 8; month += 1) assert.deepEqual([at(month).kup, at(month).advance, at(month).net], [zl(15000), zl(1800), zl(28200)]);
  for (const month of [9, 10, 11, 12]) assert.deepEqual([at(month).kup, at(month).advance, at(month).net], [0, zl(3600), zl(26400)]);
  assert.equal(year.months.findIndex((row) => row.authorCapReached) + 1, 9);
  assert.equal(year.months.filter((row) => row.authorCapReached).length, 1);
});

test("T-D7: dzieło with your own employer counts as employment for ZUS", () => {
  const m = work(3000, { status: "ownEmployer" }).months[0];
  assert.deepEqual([m.sickness, m.net, m.employerCost], [zl(73.5), zl(2106.72), zl(3540.9)]);
});

test("T-D8: the zero-PIT reliefs do not cover dzieło", () => {
  const input = { ...base, contract: "work" as const, gross: zl(3000), relief: "under26" as const, pit2: false };
  assert.equal(optionUnavailable("relief", input), "work");
  assert.equal(payrollYear(input).months[0].advance, zl(288));
});

/* ---------------------------------------------------------------- netto → brutto */

test("T-N1: UoP 5 000 zł net (wynagrodzenia.pl)", () => {
  const gross = grossFromNet(zl(5000), base);
  assert.equal(gross, zl(6850.14));
  const m = firstMonth({ ...base, gross: gross! });
  assert.deepEqual([m.advance, m.health, m.employerCost, m.net], [zl(379), zl(531.99), zl(8253.05), zl(5000)]);
});

test("T-N2: UoP round trip", () => {
  assert.equal(grossFromNet(zl(7147.39), base), zl(10000));
});

test("T-N3: UoP 3 605,85 zł: the smallest gross on the plateau", () => {
  assert.equal(grossFromNet(zl(3605.85), base), zl(4805.99));
  assert.equal(firstMonth({ ...base, gross: zl(4806) }).net, zl(3605.85));
});

test("T-N4: zlecenie 4 000 zł net", () => {
  assert.equal(grossFromNet(zl(4000), { ...base, contract: "mandate" }), zl(5267.19));
});

test("T-N5: dzieło 2 500 zł net", () => {
  assert.equal(grossFromNet(zl(2500), { ...base, contract: "work", pit2: false }), zl(2765));
});

test("T-N6: grossFromNet never overshoots and always reaches the target", () => {
  let seed = 20261116;
  const random = () => {
    seed = (seed * 1103515245 + 12345) % 2 ** 31;
    return seed / 2 ** 31;
  };
  const variants: Array<Omit<PayrollInput, "gross">> = [
    base,
    { ...base, pit2: false, ppk: true },
    { ...base, contract: "mandate", pit2: false },
    { ...base, contract: "mandate", status: "secondJob", pit2: false },
    { ...base, contract: "work", pit2: false, civilKup: "author" },
  ];
  for (let index = 0; index < 500; index += 1) {
    const input = variants[index % variants.length];
    const gross = 1 + Math.floor(random() * zl(40000));
    const target = firstMonth({ ...input, gross }).net;
    if (target <= 0) continue;
    const found = grossFromNet(target, input);
    assert.ok(found !== null && found <= gross, `gross ${gross} → ${found}`);
    assert.ok(firstMonth({ ...input, gross: found }).net >= target);
  }
});

test("netto → brutto above the ceiling has no answer", () => {
  assert.equal(grossFromNet(zl(2_000_000), base), null);
});

test("netto → brutto just above the flat-tax edge on zlecenie", () => {
  const input = { ...base, contract: "mandate" as const, status: "secondJob" as const, pit2: false };
  assert.equal(grossFromNet(zl(158), input), zl(200));
  assert.equal(firstMonth({ ...input, gross: grossFromNet(zl(160), input)! }).flatTax, false);
});

/* ---------------------------------------------------------------- comparison */

test("comparison: the same gross on three contracts", () => {
  const all = compareContracts(zl(3000), { ...base, pit2: false });
  assert.equal(all.employment.months[0].net, zl(2355.72));
  assert.equal(all.mandate.months[0].net, zl(2106.72));
  assert.equal(all.work.months[0].net, zl(2712));
  assert.equal(all.work.employerCost, zl(36000));
});

/* ---------------------------------------------------------------- 2027 */

test("T-Y1: UoP 4 950 zł in 2027", () => {
  const year = uop(4950, {}, rates2027);
  const m = year.months[0];
  assert.deepEqual([m.pension, m.disability, m.sickness, m.health, m.advance, m.net, m.employerCost], [zl(483.12), zl(74.25), zl(121.28), zl(384.42), zl(183), zl(3703.93), zl(5963.77)]);
});

test("T-Y2: zlecenie 26 000 zł in 2027: the cap starts later", () => {
  const year = mandate(26000, { pit2: true }, rates2027);
  assert.equal(year.net, zl(223755.68));
  assert.equal(year.months.findIndex((row) => row.capStarts) + 1, 12);
});

test("2027 on the current scale: UoP 25 000 zł pays no cap in 2027, so a little less PIT than 2026", () => {
  /* The plan's "54 906 with the 2027 cap" is the 2026 figure; the reference script with the 2026 scale and the 2027 cap gives 54 279. */
  const year = uop(25000, {}, rates2027);
  assert.ok(year.months.every((row) => !row.capStarts));
  assert.deepEqual([year.pit, year.net], [zl(54279), zl(181292.64)]);
});

/* The bill's scale (druk 3293), used only if it becomes law: the engine already takes three bands. */
const bill2027: PayrollRates = {
  ...rates2027,
  pit: {
    ...rates2027.pit,
    brackets: [
      { upTo: 130_000_00, bp: 1200 },
      { upTo: 150_000_00, bp: 2400 },
      { upTo: null, bp: 3200 },
    ],
    authorKupYearLimit: 130_000_00,
  },
};

test("T-Y3: UoP 25 000 zł on the bill's three-band scale", () => {
  const year = uop(25000, {}, bill2027);
  assert.deepEqual([year.months[6].advance, year.months[7].advance], [zl(4570), zl(6464)]);
  assert.deepEqual([year.pit, year.net], [zl(50680), zl(184891.64)]);
});

test("T-Y4: UoP 12 500 zł on the bill's scale stays in the first band", () => {
  const year = uop(12500, {}, bill2027);
  for (const month of [9, 10, 11, 12]) assert.equal(year.months[month - 1].advance, zl(964));
  assert.equal(uop(12500).months[11].advance, zl(2251));
});
