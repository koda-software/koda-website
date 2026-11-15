/**
 * Take-home pay on an employment contract (umowa o pracę) and on B2B (a sole trader
 * invoicing a client), for the B2B vs employment calculator. Whole grosze throughout.
 *
 * - Employment is a payroll run month by month, January to December, so the 30× cap on
 *   pension and disability contributions, the tax bracket and the under-26 limit start
 *   in the right month.
 * - B2B tax is computed for the whole year, as the annual return settles it; monthly
 *   figures are the year divided by 12. Monthly advances are not modelled.
 * - Contributions are rounded half up to the grosz; tax bases and taxes to whole złoty
 *   (art. 63 § 1 Ordynacji podatkowej).
 *
 * The rules come from `payroll-rates.ts`; nothing here hard-codes a rate or a threshold.
 */
import { rates2026, type PayrollRates } from "./payroll-rates";

export { formatCents, parseCents } from "./vat";

/** Round half away from zero, as the statutes and the reference script do. */
function round(value: number): number {
  const abs = Math.abs(value);
  const rounded = Math.round(abs + Number.EPSILON * abs);
  return value < 0 ? -rounded : rounded;
}

/** `amount × bp / 10 000`, rounded to the grosz. */
function pct(amount: number, bp: number): number {
  return round((amount * bp) / 10_000);
}

/** Rounded to whole złoty, still in grosze. */
function zl(amount: number): number {
  return round(amount / 100) * 100;
}

/** Tax on the scale for the slice of income from `from` to `from + amount`, unrounded. */
function scaleTaxOnSlice(from: number, amount: number, rates: PayrollRates): number {
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

/* ---------------------------------------------------------------- employment */

export type KupKey = "standard" | "commuter";

export type EmploymentInput = {
  /** Gross monthly salary, the same in every month. */
  gross: number;
  kup: KupKey;
  /** PIT-2 filed: the monthly 1/12 of the yearly reducing amount. */
  pit2: boolean;
  /** Under 26: revenue up to the yearly limit is exempt. */
  under26: boolean;
  /** PPK at the default 2% (employee) and 1,5% (employer). */
  ppk: boolean;
};

export type EmploymentMonth = {
  month: number;
  pension: number;
  disability: number;
  sickness: number;
  social: number;
  health: number;
  advance: number;
  ppkEmployee: number;
  ppkEmployer: number;
  net: number;
  employerCost: number;
  /** The first month in which the 30× cap cuts the pension and disability base. */
  capStarts: boolean;
  /** The month in which year-to-date income enters a higher tax bracket. */
  bracketStarts: boolean;
  /** The month in which the under-26 limit runs out. */
  youthLimitEnds: boolean;
};

export type EmploymentYear = {
  months: EmploymentMonth[];
  social: number;
  health: number;
  pit: number;
  ppkEmployee: number;
  net: number;
  employerCost: number;
};

const sum = (items: number[]) => items.reduce((all, item) => all + item, 0);

export function employmentYear(input: EmploymentInput, rates: PayrollRates = rates2026): EmploymentYear {
  const { gross } = input;
  const ee = rates.employee;
  const er = rates.employer;
  const kupMonthly = rates.pit.kupMonthly[input.kup];
  const reducing = input.pit2 ? round(rates.pit.reducingAmountYear / 12) : 0;
  const bracketEdges = rates.pit.brackets.map((bracket) => bracket.upTo).filter((upTo): upTo is number => upTo !== null);

  let cumGross = 0;
  let cumIncome = 0;
  let cumRevenue = 0;
  let capSeen = false;
  let youthSeen = false;
  const months: EmploymentMonth[] = [];

  for (let month = 1; month <= 12; month += 1) {
    const pensionBase = Math.min(gross, Math.max(0, rates.pensionCapYear - cumGross));
    cumGross += gross;

    const pension = pct(pensionBase, ee.pensionBp);
    const disability = pct(pensionBase, ee.disabilityBp);
    const sickness = pct(gross, ee.sicknessBp);
    const social = pension + disability + sickness;
    const health = pct(gross - social, ee.healthBp);
    const ppkEmployer = input.ppk ? pct(gross, er.ppkBp) : 0;
    const ppkEmployee = input.ppk ? pct(gross, ee.ppkBp) : 0;

    /* The employer's PPK payment is the employee's taxable revenue. */
    const revenue = gross + ppkEmployer;
    const exempt = input.under26 ? Math.min(revenue, Math.max(0, rates.pit.youthExemptRevenue - cumRevenue)) : 0;
    cumRevenue += revenue;
    const taxable = revenue - exempt;

    let advance = 0;
    let income = 0;
    if (taxable > 0) {
      /* Only the contributions on the taxable part are deducted; costs only up to the taxable revenue (art. 22 ust. 3b). */
      const socialDeducted = round((social * taxable) / revenue);
      const kup = Math.min(kupMonthly, taxable);
      income = Math.max(0, zl(taxable - socialDeducted - kup));
      const tax = scaleTaxOnSlice(cumIncome, income, rates);
      advance = Math.max(0, zl(tax - reducing));
    }

    const bracketStarts = bracketEdges.some((edge) => cumIncome <= edge && cumIncome + income > edge);
    cumIncome += income;

    const capStarts: boolean = !capSeen && pensionBase < gross;
    capSeen ||= capStarts;
    const youthLimitEnds: boolean = input.under26 && !youthSeen && exempt < revenue;
    youthSeen ||= youthLimitEnds;

    const labourFund = gross >= rates.minimumWage ? pct(gross, er.labourFundBp) : 0;
    const employerCost =
      gross + pct(pensionBase, er.pensionBp) + pct(pensionBase, er.disabilityBp) + pct(gross, er.accidentBp) + labourFund + pct(gross, er.fgspBp) + ppkEmployer;

    months.push({
      month,
      pension,
      disability,
      sickness,
      social,
      health,
      advance,
      ppkEmployee,
      ppkEmployer,
      net: gross - social - health - advance - ppkEmployee,
      employerCost,
      capStarts,
      bracketStarts,
      youthLimitEnds,
    });
  }

  return {
    months,
    social: sum(months.map((row) => row.social)),
    health: sum(months.map((row) => row.health)),
    pit: sum(months.map((row) => row.advance)),
    ppkEmployee: sum(months.map((row) => row.ppkEmployee)),
    net: sum(months.map((row) => row.net)),
    employerCost: sum(months.map((row) => row.employerCost)),
  };
}

/* ---------------------------------------------------------------- B2B */

export type TaxForm = "skala" | "liniowy" | "ryczalt";
export type ZusKey = "full" | "preferential" | "start";

export const taxForms: TaxForm[] = ["skala", "liniowy", "ryczalt"];
export const zusKeys: ZusKey[] = ["full", "preferential", "start"];

export type B2bInput = {
  /** Net monthly invoice. */
  invoice: number;
  form: TaxForm;
  /** The ryczałt rate in basis points, used only on ryczałt. */
  ryczaltBp: number;
  zus: ZusKey;
  /** Voluntary sickness insurance. */
  sickness: boolean;
  /** Monthly business costs, net. */
  costs: number;
  /** Billable days in the year without an invoice (holiday, sick leave). */
  daysOff: number;
  /** B2B for a current or former employer, doing the same work as on the contract this or last year. */
  formerEmployer: boolean;
};

export type B2bYear = {
  form: TaxForm;
  zus: ZusKey;
  revenue: number;
  costs: number;
  socialMonthly: number;
  social: number;
  healthMonthly: number;
  health: number;
  /** PIT or ryczałt for the year, with the solidarity levy where due. */
  tax: number;
  net: number;
  /** Ryczałt only: the index of the health tier in `rates.health.ryczaltTiers`. */
  ryczaltTier: number | null;
};

/** Monthly social ZUS for a sole trader. */
export function zusMonthly(zus: ZusKey, sickness: boolean, rates: PayrollRates = rates2026): number {
  if (zus === "start") return 0;
  const parts = zus === "full" ? rates.jdgZus.full : rates.jdgZus.preferential;
  return parts.pension + parts.disability + parts.accident + (sickness ? parts.sickness : 0) + parts.labourFund;
}

export type Unavailable = "formerEmployer" | "revenueLimit";

/**
 * Why a tax form cannot be used, or null. For a current or former employer, liniowy is
 * barred by art. 9a ust. 3 PIT and ryczałt by art. 8 ust. 2 of the ryczałt act.
 */
export function formUnavailable(form: TaxForm, input: Pick<B2bInput, "invoice" | "formerEmployer">, rates: PayrollRates = rates2026): Unavailable | null {
  if (form === "skala") return null;
  if (input.formerEmployer) return "formerEmployer";
  if (form === "ryczalt" && input.invoice * 12 > rates.ryczalt.revenueLimit) return "revenueLimit";
  return null;
}

/** ZUS reliefs are not open to someone working for a current or former employer (ZUS group I exclusions). */
export function zusUnavailable(zus: ZusKey, input: Pick<B2bInput, "formerEmployer">): Unavailable | null {
  return zus !== "full" && input.formerEmployer ? "formerEmployer" : null;
}

/** The options that apply: anything barred falls back to skala and full ZUS. */
export function effectiveB2bInput(input: B2bInput, rates: PayrollRates = rates2026): B2bInput {
  return {
    ...input,
    form: formUnavailable(input.form, input, rates) ? "skala" : input.form,
    zus: zusUnavailable(input.zus, input) ? "full" : input.zus,
  };
}

/** The B2B year for exactly the options given; call `effectiveB2bInput` first to apply the restrictions. */
export function b2bYear(input: B2bInput, rates: PayrollRates = rates2026): B2bYear {
  const billable = rates.billableDays;
  const days = Math.min(Math.max(0, Math.round(input.daysOff)), billable);
  const revenue = round((input.invoice * 12 * (billable - days)) / billable);
  const costs = input.costs * 12;
  const socialMonthly = zusMonthly(input.zus, input.sickness, rates);
  const social = socialMonthly * 12;
  const h = rates.health;

  let healthMonthly: number;
  let tax: number;
  let ryczaltTier: number | null = null;

  const solidarity = (base: number) => zl(Math.max(0, ((base - rates.pit.solidarity.above) * rates.pit.solidarity.bp) / 10_000));

  if (input.form === "ryczalt") {
    /* The tier comes from yearly revenue less the social ZUS paid (art. 81 ust. 2g). */
    const tierBase = revenue - social;
    ryczaltTier = h.ryczaltTiers.findIndex((tier) => tier.upTo === null || tierBase <= tier.upTo);
    healthMonthly = h.ryczaltTiers[ryczaltTier].monthly;
    const base = zl(revenue - social - (healthMonthly * 12 * h.ryczaltDeductibleBp) / 10_000);
    tax = base > 0 ? zl((base * input.ryczaltBp) / 10_000) : 0;
  } else {
    const incomeMonthly = (revenue - costs - social) / 12;
    const rateBp = input.form === "skala" ? h.scaleBp : h.flatBp;
    healthMonthly = Math.max(h.minimumMonthly, pct(incomeMonthly, rateBp));
    if (input.form === "skala") {
      const base = zl(revenue - costs - social);
      tax = base > 0 ? Math.max(0, zl(scaleTaxOnSlice(0, base, rates) - rates.pit.reducingAmountYear)) + solidarity(base) : 0;
    } else {
      const base = zl(revenue - costs - social - Math.min(healthMonthly * 12, h.flatDeductionLimitYear));
      tax = base > 0 ? zl((base * rates.pit.flatBp) / 10_000) + solidarity(base) : 0;
    }
  }

  const health = healthMonthly * 12;
  return {
    form: input.form,
    zus: input.zus,
    revenue,
    costs,
    socialMonthly,
    social,
    healthMonthly,
    health,
    tax,
    net: revenue - costs - social - health - tax,
    ryczaltTier,
  };
}

/** The same invoice on every tax form, with the reason a form is barred. */
export function compareAllForms(input: B2bInput, rates: PayrollRates = rates2026) {
  const zus = zusUnavailable(input.zus, input) ? "full" : input.zus;
  return taxForms.map((form) => {
    const unavailable = formUnavailable(form, input, rates);
    return { form, unavailable, year: unavailable ? null : b2bYear({ ...input, form, zus }, rates) };
  });
}

/* ---------------------------------------------------------------- break-even */

/** Far above any realistic monthly invoice; the search gives up beyond it. */
const SEARCH_CEILING = 5_000_000_00;

export type BreakEven = {
  invoice: number;
  /** Ryczałt only: the revenue threshold the invoice has just crossed, where health jumps. */
  tierEdge: number | null;
};

/** In grosze of monthly invoice: wider than the wobble that rounding the yearly tax to the złoty causes. */
const ROUNDING_WINDOW = 300;

/** How far above a ryczałt tier edge, in yearly revenue less ZUS, still counts as "just above". */
const JUST_ABOVE_EDGE = 12_000_00;

/**
 * The smallest monthly invoice whose yearly B2B take-home is at least `target`, under
 * the options in `input`. Take-home on ryczałt is not monotonic: crossing a health tier
 * costs more than the extra invoice brings in. So the search runs tier by tier and
 * takes the lowest tier that reaches the target. Returns null when nothing does.
 */
export function breakEvenInvoice(target: number, input: B2bInput, rates: PayrollRates = rates2026): BreakEven | null {
  const options = effectiveB2bInput(input, rates);
  const netAt = (invoice: number) => b2bYear({ ...options, invoice }, rates).net;
  const ceiling = options.form === "ryczalt" ? Math.min(SEARCH_CEILING, Math.floor(rates.ryczalt.revenueLimit / 12)) : SEARCH_CEILING;

  /* Intervals of invoices on which the ryczałt tier is constant. */
  const intervals: Array<[number, number]> = [];
  if (options.form === "ryczalt") {
    const tierAt = (invoice: number) => b2bYear({ ...options, invoice }, rates).ryczaltTier ?? 0;
    let start = 1;
    while (start <= ceiling) {
      const tier = tierAt(start);
      let lo = start;
      let hi = ceiling;
      if (tierAt(hi) !== tier) {
        while (hi - lo > 1) {
          const mid = Math.floor((lo + hi) / 2);
          if (tierAt(mid) === tier) lo = mid;
          else hi = mid;
        }
      } else lo = hi;
      intervals.push([start, lo]);
      start = lo + 1;
    }
  } else intervals.push([1, ceiling]);

  for (const [start, end] of intervals) {
    if (netAt(end) < target) continue;
    let lo = start - 1;
    let hi = end;
    if (netAt(start) >= target) hi = start;
    while (hi - lo > 1) {
      const mid = Math.floor((lo + hi) / 2);
      if (netAt(mid) >= target) hi = mid;
      else lo = mid;
    }
    /* Tax rounded to whole złoty makes take-home wobble by up to a złoty from one grosz to
       the next, so bisection can land on a later crossing. Look a little lower for the first. */
    for (let invoice = hi - 1; invoice >= Math.max(start, hi - ROUNDING_WINDOW); invoice -= 1) {
      if (netAt(invoice) >= target) hi = invoice;
    }

    let tierEdge: number | null = null;
    if (options.form === "ryczalt") {
      const year = b2bYear({ ...options, invoice: hi }, rates);
      const tier = year.ryczaltTier ?? 0;
      const edge = tier > 0 ? rates.health.ryczaltTiers[tier - 1].upTo : null;
      if (edge !== null && year.revenue - year.social - edge <= JUST_ABOVE_EDGE) tierEdge = edge;
    }
    return { invoice: hi, tierEdge };
  }

  return null;
}

/** The employer's average monthly cost, as an invoice that costs the company the same. */
export function employerCostInvoice(year: EmploymentYear): number {
  return round(year.employerCost / 12);
}
