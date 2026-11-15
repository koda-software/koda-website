/**
 * Polish payroll and sole-trader (JDG) rules for one tax year, used by the B2B vs
 * employment calculator. Amounts are in grosze, rates in basis points (1 bp = 0,01%).
 *
 * Checked 2026-11-15. The sources for every value are in the vault plan
 * (website/b2b-vs-employment-tool-plan.md, "Rules 2026"). For 2027, add `rates2027`
 * with the same shape and its tests; nothing else should need to change.
 */

type Bracket = { upTo: number | null; bp: number };
type ZusComponents = { base: number; pension: number; disability: number; accident: number; sickness: number; labourFund: number };

export type PayrollRates = {
  year: number;
  checkedAt: string;
  minimumWage: number;
  projectedAverageWage: number;
  averageWageQ4PreviousYear: number;
  pensionCapYear: number;
  billableDays: number;
  pit: {
    brackets: Bracket[];
    reducingAmountYear: number;
    flatBp: number;
    solidarity: { above: number; bp: number };
    youthExemptRevenue: number;
    kupMonthly: { standard: number; commuter: number };
  };
  employee: { pensionBp: number; disabilityBp: number; sicknessBp: number; healthBp: number; ppkBp: number };
  employer: { pensionBp: number; disabilityBp: number; accidentBp: number; labourFundBp: number; fgspBp: number; ppkBp: number };
  jdgZus: {
    rates: { pensionBp: number; disabilityBp: number; accidentBp: number; sicknessBp: number; labourFundBp: number };
    full: ZusComponents;
    preferential: ZusComponents & { months: number };
    startRelief: { months: number };
  };
  health: {
    scaleBp: number;
    flatBp: number;
    minimumMonthly: number;
    flatDeductionLimitYear: number;
    ryczaltTiers: Array<{ upTo: number | null; basePercent: number; monthly: number }>;
    ryczaltDeductibleBp: number;
  };
  ryczalt: { revenueLimit: number; ratesBp: number[]; defaultBp: number };
};

export const rates2026: PayrollRates = {
  year: 2026,
  checkedAt: "2026-11-15",
  minimumWage: 4_806_00,
  projectedAverageWage: 9_420_00,
  /** GUS average wage in Q4 of the previous year, enterprise sector with bonuses: the ryczałt health base. */
  averageWageQ4PreviousYear: 9_228_64,
  /** 30 × the projected average wage: no pension or disability contributions above it in a year. */
  pensionCapYear: 282_600_00,
  /** Weekdays that are not public holidays: the days a contractor can invoice. */
  billableDays: 253,
  pit: {
    /** Yearly scale, ascending; `upTo: null` is the open top bracket. */
    brackets: [
      { upTo: 120_000_00, bp: 1200 },
      { upTo: null, bp: 3200 },
    ],
    /** The yearly amount reducing tax; an employee's PIT-2 takes 1/12 of it each month. */
    reducingAmountYear: 3_600_00,
    flatBp: 1900,
    solidarity: { above: 1_000_000_00, bp: 400 },
    youthExemptRevenue: 85_528_00,
    kupMonthly: { standard: 250_00, commuter: 300_00 },
  },
  employee: { pensionBp: 976, disabilityBp: 150, sicknessBp: 245, healthBp: 900, ppkBp: 200 },
  employer: { pensionBp: 976, disabilityBp: 650, accidentBp: 167, labourFundBp: 245, fgspBp: 10, ppkBp: 150 },
  jdgZus: {
    rates: { pensionBp: 1952, disabilityBp: 800, accidentBp: 167, sicknessBp: 245, labourFundBp: 245 },
    full: { base: 5_652_00, pension: 1_103_27, disability: 452_16, accident: 94_39, sickness: 138_47, labourFund: 138_47 },
    /** Fundusz Pracy is not due on a base below the minimum wage. */
    preferential: { base: 1_441_80, pension: 281_44, disability: 115_34, accident: 24_08, sickness: 35_32, labourFund: 0, months: 24 },
    startRelief: { months: 6 },
  },
  health: {
    scaleBp: 900,
    flatBp: 490,
    /** 9% of the minimum wage, for skala and liniowy (health year February 2026 to January 2027). */
    minimumMonthly: 432_54,
    flatDeductionLimitYear: 14_100_00,
    /** Tiers by yearly revenue less social ZUS; `upTo: null` is the top tier. */
    ryczaltTiers: [
      { upTo: 60_000_00, basePercent: 60, monthly: 498_35 },
      { upTo: 300_000_00, basePercent: 100, monthly: 830_58 },
      { upTo: null, basePercent: 180, monthly: 1_495_04 },
    ],
    ryczaltDeductibleBp: 5000,
  },
  ryczalt: {
    /** 2 000 000 € at the NBP rate of 1 October 2025, for the previous year's revenue. */
    revenueLimit: 8_517_200_00,
    ratesBp: [1200, 850, 1400, 1500, 1700, 550, 300],
    defaultBp: 1200,
  },
};
