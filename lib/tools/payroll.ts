/**
 * The payroll engine shared by the salary calculator and the B2B vs employment
 * calculator: one month-by-month loop for an employment contract (umowa o pracę),
 * umowa zlecenie and umowa o dzieło, January to December, at a constant monthly gross
 * with one payer. Whole grosze throughout.
 *
 * - Contributions are rounded half up to the grosz; tax bases and taxes to whole złoty
 *   (art. 63 § 1 Ordynacji podatkowej).
 * - Employment advances follow the scale cumulatively (art. 32). Zlecenie and dzieło
 *   advances are always the lowest scale rate (art. 41 ust. 1); the yearly return
 *   settles the rest.
 * - Who pays which contribution on zlecenie and dzieło follows the status table in the
 *   vault plan (website/salary-calculator-tool-plan.md, "Who pays what").
 *
 * The rules come from `payroll-rates.ts`; nothing here hard-codes a rate or a threshold.
 */
import { rates2026, type PayrollRates } from "./payroll-rates";

/** Round half away from zero, as the statutes and the reference scripts do. */
export function round(value: number): number {
  const abs = Math.abs(value);
  const rounded = Math.round(abs + Number.EPSILON * abs);
  return value < 0 ? -rounded : rounded;
}

/** `amount × bp / 10 000`, rounded to the grosz. */
export function pct(amount: number, bp: number): number {
  return round((amount * bp) / 10_000);
}

/** Rounded to whole złoty, still in grosze. */
export function zl(amount: number): number {
  return round(amount / 100) * 100;
}

/** Tax on the scale for the slice of income from `from` to `from + amount`, unrounded. */
export function scaleTaxOnSlice(from: number, amount: number, rates: PayrollRates): number {
  let tax = 0;
  let lower = 0;
  for (const bracket of rates.pit.brackets) {
    const upper = bracket.upTo ?? Infinity;
    const start = Math.max(from, lower);
    const end = Math.min(from + amount, upper);
    if (end > start) tax += ((end - start) * bracket.bp) / 10_000;
    lower = upper;
  }
  return tax;
}

export const sum = (items: number[]) => items.reduce((all, item) => all + item, 0);

/* ---------------------------------------------------------------- input */

/** UoP, zlecenie, dzieło. */
export type Contract = "employment" | "mandate" | "work";
export const contracts: Contract[] = ["employment", "mandate", "work"];

/** Zlecenie: the other titles to insurance the person has. Dzieło uses "only" and "ownEmployer". */
export type MandateStatus = "only" | "student" | "secondJob" | "ownEmployer";
export const mandateStatuses: MandateStatus[] = ["only", "student", "secondJob", "ownEmployer"];

/** The zero-PIT reliefs, which share one yearly revenue limit (art. 21 ust. 1 pkt 148, 152–154, ust. 44). */
export type Relief = "none" | "under26" | "returnee" | "family4" | "senior";
export const reliefs: Relief[] = ["none", "under26", "returnee", "family4", "senior"];

/** Employment costs: 250 zł, or 300 zł when commuting from another town. */
export type KupKey = "standard" | "commuter";
/** Zlecenie and dzieło costs: 20%, or 50% for author's rights. */
export type CivilKupKey = "standard" | "author";

export type PayrollInput = {
  contract: Contract;
  /** Monthly gross, the same in every month. */
  gross: number;
  /** Employment only. */
  kup: KupKey;
  /** Zlecenie and dzieło only. */
  civilKup: CivilKupKey;
  status: MandateStatus;
  /** Voluntary sickness insurance on zlecenie; mandatory with your own employer. */
  sickness: boolean;
  /** PIT-2 filed with this payer: the monthly 1/12 of the yearly reducing amount. */
  pit2: boolean;
  relief: Relief;
  /** PPK at the default 2% (employee) and 1,5% (employer). */
  ppk: boolean;
  /** The employer's wypadkowe rate in basis points; the rates' default when left out. */
  accidentBp?: number;
};

/* ---------------------------------------------------------------- result */

export type EmployerContributions = { pension: number; disability: number; accident: number; labourFund: number; fgsp: number; ppk: number };

export type PayrollMonth = {
  month: number;
  /** The base of pension and disability contributions after the 30× cap. */
  pensionBase: number;
  pension: number;
  disability: number;
  sickness: number;
  social: number;
  health: number;
  /** Taxable revenue: gross plus the employer's PPK payment. */
  revenue: number;
  /** Revenue exempt under a zero-PIT relief. */
  exempt: number;
  /** The social contributions deducted from the taxable part. */
  socialDeducted: number;
  /** The month's costs actually deducted. */
  kup: number;
  /** Whole złoty, in grosze. */
  taxBase: number;
  /** The PIT-2 reduction applied. */
  reduction: number;
  /** The tax advance, or the flat tax on a small contract. */
  advance: number;
  /** Art. 30 ust. 1 pkt 5a applied: 12% of the whole amount, no costs. */
  flatTax: boolean;
  ppkEmployee: number;
  ppkEmployer: number;
  net: number;
  employer: EmployerContributions;
  employerCost: number;
  /** The first month in which the 30× cap cuts the pension and disability base. */
  capStarts: boolean;
  /** The month in which year-to-date income passes a bracket edge. */
  bracketStarts: boolean;
  /** The month in which the zero-PIT relief limit runs out. */
  reliefEnds: boolean;
  /** The first month in which the 50% cost limit cuts the costs. */
  authorCapReached: boolean;
};

export type PayrollYear = {
  months: PayrollMonth[];
  social: number;
  health: number;
  pit: number;
  ppkEmployee: number;
  net: number;
  employerCost: number;
  /** Zlecenie and dzieło: yearly income above the first bracket, taxed at 12% in advances only. */
  yearlyIncomeAboveFirstBracket: number;
  /** Zlecenie and dzieło: what the scale adds on that income in the yearly return, if it is the only income. */
  yearlySurcharge: number;
};

export type Liability = {
  social: boolean;
  sicknessMandatory: boolean;
  sicknessAllowed: boolean;
  health: boolean;
  employerSocial: boolean;
  reliefAllowed: boolean;
  ppkAllowed: boolean;
  flatSmallContract: boolean;
};

/** What a contract is liable for, from the status table in the plan's "Who pays what". */
export function liability(input: Pick<PayrollInput, "contract" | "status">): Liability {
  if (input.contract === "employment") {
    return { social: true, sicknessMandatory: true, sicknessAllowed: true, health: true, employerSocial: true, reliefAllowed: true, ppkAllowed: true, flatSmallContract: false };
  }
  /* Zlecenie or dzieło with your own employer counts as employment for ZUS (art. 8 ust. 2a),
     and the payer's employees cannot use the small-contract flat tax. */
  if (input.status === "ownEmployer") {
    const mandate = input.contract === "mandate";
    return { social: true, sicknessMandatory: true, sicknessAllowed: true, health: true, employerSocial: true, reliefAllowed: mandate, ppkAllowed: mandate, flatSmallContract: false };
  }
  if (input.contract === "work") {
    return { social: false, sicknessMandatory: false, sicknessAllowed: false, health: false, employerSocial: false, reliefAllowed: false, ppkAllowed: false, flatSmallContract: true };
  }
  switch (input.status) {
    case "student":
      /* No social insurance (art. 6 ust. 4), so no health contribution either. */
      return { social: false, sicknessMandatory: false, sicknessAllowed: false, health: false, employerSocial: false, reliefAllowed: true, ppkAllowed: false, flatSmallContract: true };
    case "secondJob":
      /* Insured on the job at the minimum wage or more: health only (art. 9 ust. 1, 1a). */
      return { social: false, sicknessMandatory: false, sicknessAllowed: false, health: true, employerSocial: false, reliefAllowed: true, ppkAllowed: false, flatSmallContract: true };
    default:
      return { social: true, sicknessMandatory: false, sicknessAllowed: true, health: true, employerSocial: true, reliefAllowed: true, ppkAllowed: true, flatSmallContract: true };
  }
}

/** The relief that applies: a pupil or student under 26 on zlecenie has the under-26 relief. */
export function effectiveRelief(input: Pick<PayrollInput, "contract" | "status" | "relief">): Relief {
  if (!liability(input).reliefAllowed) return "none";
  if (input.contract === "mandate" && input.status === "student") return "under26";
  return input.relief;
}

export type Unavailable = "work" | "student" | "secondJob" | "ownEmployer";

/** Why an option cannot be changed for this contract, for the widget's hints; null when it can. */
export function optionUnavailable(option: "relief" | "sickness" | "ppk" | "pit2", input: Pick<PayrollInput, "contract" | "status">): Unavailable | null {
  const own = input.status === "ownEmployer";
  switch (option) {
    case "relief":
      if (input.contract === "work") return "work";
      if (input.contract === "mandate" && input.status === "student") return "student";
      return null;
    case "sickness":
      if (input.contract === "work") return own ? "ownEmployer" : "work";
      if (input.contract === "mandate" && input.status !== "only") return input.status;
      return null;
    case "ppk":
      if (input.contract === "work") return "work";
      if (input.contract === "mandate" && (input.status === "student" || input.status === "secondJob")) return input.status;
      return null;
    case "pit2":
      return null;
  }
}

/* ---------------------------------------------------------------- the loop */

function payrollMonths(input: PayrollInput, rates: PayrollRates, count: number): PayrollMonth[] {
  const { gross } = input;
  const civil = input.contract !== "employment";
  const L = liability(input);
  const ee = rates.employee;
  const er = rates.employer;
  const pit = rates.pit;
  const relief = effectiveRelief(input) !== "none";
  const sicknessDue = L.social && (L.sicknessMandatory || (L.sicknessAllowed && input.sickness));
  const ppkOn = L.ppkAllowed && input.ppk;
  const flatTax = L.flatSmallContract && !relief && gross <= pit.smallContractLimit;
  const reducing = input.pit2 ? round(pit.reducingAmountYear / 12) : 0;
  const accidentBp = input.accidentBp ?? er.accidentBp;
  const bracketEdges = pit.brackets.map((bracket) => bracket.upTo).filter((upTo): upTo is number => upTo !== null);

  let cumGross = 0;
  let cumIncome = 0;
  let cumRevenue = 0;
  let cumAuthorKup = 0;
  let capSeen = false;
  let reliefSeen = false;
  let authorCapSeen = false;
  const months: PayrollMonth[] = [];

  for (let month = 1; month <= count; month += 1) {
    const pensionBase = L.social ? Math.min(gross, Math.max(0, rates.pensionCapYear - cumGross)) : 0;
    cumGross += gross;

    const pension = pct(pensionBase, ee.pensionBp);
    const disability = pct(pensionBase, ee.disabilityBp);
    const sickness = sicknessDue ? pct(gross, ee.sicknessBp) : 0;
    const social = pension + disability + sickness;
    const health = L.health ? pct(gross - social, ee.healthBp) : 0;
    const ppkEmployer = ppkOn ? pct(gross, er.ppkBp) : 0;
    const ppkEmployee = ppkOn ? pct(gross, ee.ppkBp) : 0;

    /* The employer's PPK payment is the employee's taxable revenue. */
    const revenue = gross + ppkEmployer;
    let exempt = 0;
    let socialDeducted = 0;
    let kup = 0;
    let income = 0;
    let reduction = 0;
    let advance = 0;
    let authorCapStarts = false;

    if (flatTax) {
      advance = zl(pct(gross, pit.smallContractBp));
    } else {
      exempt = relief ? Math.min(revenue, Math.max(0, pit.youthExemptRevenue - cumRevenue)) : 0;
      cumRevenue += revenue;
      const taxable = revenue - exempt;

      if (taxable > 0) {
        /* Only the contributions on the taxable part are deducted, and costs only on that part (art. 22 ust. 3b). */
        socialDeducted = round((social * taxable) / revenue);
        if (!civil) {
          kup = Math.min(pit.kupMonthly[input.kup], taxable);
        } else {
          /* 20% or 50% of revenue less the employee's social contributions (art. 22 ust. 9 pkt 3, 4). */
          const kupBase = ((revenue - social) * taxable) / revenue;
          if (input.civilKup === "author") {
            const full = round((kupBase * pit.civilKupBp.author) / 10_000);
            kup = Math.min(full, Math.max(0, pit.authorKupYearLimit - cumAuthorKup));
            cumAuthorKup += kup;
            /* Past the yearly limit the 50% costs stop and no other costs replace them. */
            authorCapStarts = !authorCapSeen && kup < full;
            authorCapSeen ||= authorCapStarts;
          } else {
            kup = round((kupBase * pit.civilKupBp.standard) / 10_000);
          }
        }
        income = Math.max(0, zl(taxable - socialDeducted - kup));
        const tax = civil ? (income * pit.civilAdvanceBp) / 10_000 : scaleTaxOnSlice(cumIncome, income, rates);
        reduction = reducing;
        advance = Math.max(0, zl(tax - reducing));
      }
    }

    const bracketStarts = bracketEdges.some((edge) => cumIncome <= edge && cumIncome + income > edge);
    cumIncome += income;

    const capStarts: boolean = L.social && !capSeen && pensionBase < gross;
    capSeen ||= capStarts;
    const reliefEnds: boolean = relief && !flatTax && !reliefSeen && exempt < revenue;
    reliefSeen ||= reliefEnds;

    const employer: EmployerContributions = L.employerSocial
      ? {
          pension: pct(pensionBase, er.pensionBp),
          disability: pct(pensionBase, er.disabilityBp),
          accident: pct(gross, accidentBp),
          /* Fundusz Pracy is not due on a month's base below the minimum wage. */
          labourFund: gross >= rates.minimumWage ? pct(gross, er.labourFundBp) : 0,
          fgsp: pct(gross, er.fgspBp),
          ppk: ppkEmployer,
        }
      : { pension: 0, disability: 0, accident: 0, labourFund: 0, fgsp: 0, ppk: ppkEmployer };

    months.push({
      month,
      pensionBase,
      pension,
      disability,
      sickness,
      social,
      health,
      revenue,
      exempt,
      socialDeducted,
      kup,
      taxBase: income,
      reduction,
      advance,
      flatTax,
      ppkEmployee,
      ppkEmployer,
      net: gross - social - health - advance - ppkEmployee,
      employer,
      employerCost: gross + employer.pension + employer.disability + employer.accident + employer.labourFund + employer.fgsp + employer.ppk,
      capStarts,
      bracketStarts,
      reliefEnds,
      authorCapReached: authorCapStarts,
    });
  }

  return months;
}

export function payrollYear(input: PayrollInput, rates: PayrollRates = rates2026): PayrollYear {
  const months = payrollMonths(input, rates, 12);
  const income = sum(months.map((row) => row.taxBase));
  const firstEdge = rates.pit.brackets[0].upTo ?? Infinity;
  const civil = input.contract !== "employment";
  const above = civil ? Math.max(0, income - firstEdge) : 0;

  return {
    months,
    social: sum(months.map((row) => row.social)),
    health: sum(months.map((row) => row.health)),
    pit: sum(months.map((row) => row.advance)),
    ppkEmployee: sum(months.map((row) => row.ppkEmployee)),
    net: sum(months.map((row) => row.net)),
    employerCost: sum(months.map((row) => row.employerCost)),
    yearlyIncomeAboveFirstBracket: above,
    yearlySurcharge: above > 0 ? zl(scaleTaxOnSlice(0, income, rates) - (income * rates.pit.civilAdvanceBp) / 10_000) : 0,
  };
}

/** The first month of the year alone, which is what netto → brutto targets. */
export function firstMonth(input: PayrollInput, rates: PayrollRates = rates2026): PayrollMonth {
  return payrollMonths(input, rates, 1)[0];
}

/** Whether the months differ, so the widget opens the month table and shows a yearly average. */
export function monthsDiffer(year: PayrollYear): boolean {
  return year.months.some((row) => row.net !== year.months[0].net || row.employerCost !== year.months[0].employerCost);
}

/* ---------------------------------------------------------------- netto → brutto */

/** 1 000 000 zł a month: the search gives up beyond it. */
export const GROSS_CEILING = 1_000_000_00;

/** In grosze of gross: wider than the wobble that rounding the advance to the złoty causes. */
const ROUNDING_WINDOW = 300;

/**
 * The smallest monthly gross whose first-month take-home is at least `targetNet`, or
 * null when none up to the ceiling reaches it. Take-home is not monotonic at grosz
 * resolution (whole-złoty tax), and on zlecenie and dzieło it jumps where the
 * small-contract flat tax ends, so the search runs on each side of that edge and takes
 * the lower answer.
 */
export function grossFromNet(targetNet: number, input: Omit<PayrollInput, "gross">, rates: PayrollRates = rates2026): number | null {
  if (targetNet <= 0) return null;
  const netAt = (gross: number) => firstMonth({ ...input, gross }, rates).net;
  const edge = rates.pit.smallContractLimit;
  const intervals: Array<[number, number]> = liability(input).flatSmallContract
    ? [
        [1, edge],
        [edge + 1, GROSS_CEILING],
      ]
    : [[1, GROSS_CEILING]];

  for (const [start, end] of intervals) {
    if (netAt(end) < targetNet) continue;
    let lo = start - 1;
    let hi = end;
    if (netAt(start) >= targetNet) hi = start;
    while (hi - lo > 1) {
      const mid = Math.floor((lo + hi) / 2);
      if (netAt(mid) >= targetNet) hi = mid;
      else lo = mid;
    }
    /* Bisection can land on a later crossing; look a little lower for the first. */
    for (let gross = hi - 1; gross >= Math.max(start, hi - ROUNDING_WINDOW); gross -= 1) {
      if (netAt(gross) >= targetNet) hi = gross;
    }
    return hi;
  }
  return null;
}

/* ---------------------------------------------------------------- comparison */

/**
 * The same gross on all three contracts with the options chosen: UoP with PIT-2,
 * zlecenie as the only title, dzieło with the same civil costs and no own employer.
 */
export function compareContracts(gross: number, input: Omit<PayrollInput, "gross" | "contract">, rates: PayrollRates = rates2026): Record<Contract, PayrollYear> {
  return {
    employment: payrollYear({ ...input, contract: "employment", gross, pit2: true, status: "only" }, rates),
    mandate: payrollYear({ ...input, contract: "mandate", gross, status: "only" }, rates),
    work: payrollYear({ ...input, contract: "work", gross, status: "only", relief: "none", ppk: false }, rates),
  };
}
