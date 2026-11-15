import type { B2bVsEmploymentLabels, B2bVsEmploymentPageContent } from "@/content/types";

export const b2bVsEmploymentPage: B2bVsEmploymentPageContent = {
  seo: {
    title: "Poland B2B vs Employment Calculator",
    description:
      "Compare take-home pay on a Polish employment contract and B2B in 2026: ZUS, health contribution and tax on the scale, flat 19% and lump-sum rates.",
  },
  navLabel: "B2B vs employment",
  navDescription: "Compare take-home pay on a Polish employment contract and on B2B, and find the B2B rate that equals a salary.",
  hero: {
    title: "B2B vs employment contract calculator for Poland",
    description:
      "See what you take home on an employment contract and on B2B in Poland in 2026. The calculator works out ZUS, the health contribution and tax on the scale, the flat 19% rate and the lump-sum rate, and the B2B rate that equals your salary.",
  },
  explainer: {
    title: "How the comparison works in 2026",
    paragraphs: [
      "In Poland, “UoP” means umowa o pracę, an employment contract. “B2B” means you run a sole proprietorship (JDG) and invoice your client, who often is the company you would otherwise work for.",
      "On an employment contract, your gross salary loses your ZUS contributions (13.71%), the health contribution (9% of what is left) and the tax advance: 12% of income after costs of PLN 250 or 300, less PLN 300 with a PIT-2 form. Once your earnings for the year pass PLN 282,600, pension and disability contributions stop, so you take home more late in the year. Once income for the year passes PLN 120,000, the advance goes up to 32%.",
      "On B2B you pay ZUS yourself. In 2026, full ZUS with sickness insurance is PLN 1,926.76 a month, the preferential rate for the first 24 months is PLN 456.18, and for the first 6 months you can pay the health contribution only (ulga na start). The health contribution depends on the tax form: 9% of income on the scale, 4.9% on the flat rate, and a fixed amount set by yearly revenue on the lump-sum rate (ryczałt).",
      "B2B has no paid holiday or sick pay from an employer. For a fair comparison, enter the days you will not invoice. 26 days is the full holiday allowance on a contract.",
      "The result is a yearly estimate. For the contract we show each month's pay. For B2B we compute tax for the whole year, as the annual return does, with the chosen ZUS option for all 12 months. Calculators that compute monthly advances can differ by a few dozen grosze.",
      "Some simplifications: in January 2026 the minimum health contribution on the scale and the flat rate was still PLN 314.96, and we use PLN 432.54 for the whole year. In the month a person under 26 passes the relief limit, we split the advance in proportion; payroll software does this differently, and the annual return evens it out.",
    ],
    table: {
      caption: "Key amounts in 2026",
      columns: ["What", "Amount"],
      rows: [
        ["Full ZUS with / without sickness insurance", "PLN 1,926.76 / 1,788.29 a month"],
        ["Preferential ZUS with / without sickness insurance", "PLN 456.18 / 420.86 a month"],
        ["Minimum health contribution (scale, flat rate)", "PLN 432.54 a month"],
        ["Health on the lump-sum rate (revenue up to 60k / up to 300k / above)", "PLN 498.35 / 830.58 / 1,495.04"],
        ["Flat-rate health deduction limit", "PLN 14,100 a year"],
        ["Tax threshold and tax-free amount", "PLN 120,000, PLN 30,000"],
        ["30× cap on pension contributions", "PLN 282,600"],
        ["Under-26 relief (contracts only, not B2B)", "PLN 85,528 of revenue a year"],
      ],
    },
  },
  breakEvenTable: {
    title: "B2B rate equal to a salary",
    intro:
      "There is no single multiplier. The table shows the monthly net invoice that leaves you as much in a year as the salary does, for each tax form.",
    columns: ["Gross salary", "Take-home on contract (average)", "Invoice: scale", "Invoice: flat 19%", "Invoice: lump sum 12%"],
    salaries: [6000, 8000, 10000, 12000, 15000, 20000, 25000, 30000],
    note: "Assumptions: contract with PLN 250 costs and PIT-2, no PPK; B2B with full ZUS and sickness insurance, no business costs and no days off. Invoices rounded up to whole złoty. Enter your own settings in the calculator. Amounts in PLN.",
  },
  sources: {
    title: "Legal basis",
    updatedLabel: "Rules checked on:",
    updatedAt: "2026-11-15",
    note: "The calculator is for information only and is not tax advice from an accountant or tax adviser. Results are estimates: we assume the same monthly salary and invoice for all of 2026. Some amounts, including the PLN 14,100 health deduction limit and the lump-sum health amounts, come from the ZUS and Ministry of Finance notices as quoted by trade publications.",
    items: [
      {
        label: "Personal Income Tax Act (PIT), consolidated text Dz.U. 2026 item 592: art. 21(1)(148), art. 22(2) and (9a), art. 27, art. 30c, art. 31b, art. 32",
        href: "https://api.sejm.gov.pl/eli/acts/DU/2026/592/text.pdf",
      },
      {
        label: "Lump-Sum Income Tax Act (ryczałt), Dz.U. 2025 item 843: art. 6(4), art. 8(2), art. 12",
        href: "https://api.sejm.gov.pl/eli/acts/DU/2025/843/text.pdf",
      },
      { label: "Act on publicly funded healthcare services: art. 79, art. 81" },
      { label: "Social Insurance System Act: art. 18, art. 18a, art. 19(1) (the 30× cap)" },
      {
        label: "ZUS: social insurance contributions in 2026 (in Polish)",
        href: "https://www.zus.pl/-/nowe-wysokości-składek-na-ubezpieczenia-społeczne-w-2026-r.",
      },
      { label: "Minister of Finance notice on the 2026 health contribution deduction limit (PLN 14,100)" },
    ],
  },
  faq: {
    title: "Common questions",
    items: [
      {
        question: "B2B or employment contract in Poland: which pays more?",
        answer:
          "At lower rates often the contract, because on B2B the fixed ZUS (PLN 1,926.76) and the health contribution take a large share of the invoice. On a PLN 15,000 gross salary you take home PLN 10,016.75 a month on average. The same on B2B takes an invoice of about PLN 14,200 net on the 12% lump-sum rate with full ZUS, or about PLN 15,000 on the scale. Enter your own amounts, because the result depends on ZUS, costs and holidays.",
      },
      {
        question: "What B2B rate equals my salary?",
        answer:
          "There is no single multiplier. It depends on the tax form, the ZUS option, costs and the days you do not invoice. The calculator finds the B2B rate that leaves you as much as the contract. A contract costs the employer about 1.2048 × the gross salary (without PPK).",
      },
      {
        question: "How much is ZUS on B2B in 2026?",
        answer:
          "Full ZUS is PLN 1,926.76 with voluntary sickness insurance or PLN 1,788.29 without it, plus the health contribution. When you start, you pay only the health contribution for 6 months, then preferential ZUS of PLN 456.18 for 24 months.",
      },
      {
        question: "Which lump-sum rate applies to a programmer?",
        answer:
          "Usually 12%: it covers software development and software consulting (PKWiU 62.01 and 62.02). Some IT services, such as certain support services, are taxed at 8.5%. The rate depends on the PKWiU code of the service, not on the company's PKD code.",
      },
      {
        question: "Can I switch to B2B with my current employer?",
        answer:
          "You can, but if you do the same work you did on the contract this year or last year, you cannot use the flat 19% rate or the lump-sum rate, nor the start-up relief or preferential ZUS. Tick that box in the calculator.",
      },
      {
        question: "Do I get paid holiday and sick pay on B2B?",
        answer:
          "Not by law. Holiday depends on your agreement with the client, and you get ZUS sickness benefit only with voluntary sickness insurance, usually after paying it for 90 days.",
      },
      {
        question: "Can the labour inspectorate turn B2B into employment?",
        answer:
          "Under the labour inspectorate (PIP) reform, which sources date to 8 July 2026, a district labour inspector can decide that a contract is employment if the work looks like a job and the company ignored an earlier order from the inspector. The calculator does not assess this. For a specific case, ask a lawyer.",
      },
      {
        question: "Why can a higher invoice leave less on the lump-sum rate?",
        answer:
          "When yearly revenue less ZUS passes PLN 300,000, the health contribution goes up from PLN 830.58 to PLN 1,495.04 a month, or PLN 7,973 a year. There is a similar jump at PLN 60,000.",
      },
    ],
  },
  opero: {
    title: "Employees and B2B contractors in one system",
    body: "In Opero, the documents of employees and B2B contractors, and their approvals, are kept in one place.",
    primaryCta: "Book a demo",
    secondaryCta: "Processes in Opero",
  },
  otherToolsTitle: "More tools",
};

export const b2bVsEmploymentLabels: B2bVsEmploymentLabels = {
  grossLabel: "Gross monthly salary on a contract (UoP)",
  invoiceLabel: "Net monthly B2B invoice",
  breakEvenButton: "Rate equal to the salary",
  employerCostButton: "Invoice = employer's cost",
  employmentTitle: "Contract",
  b2bTitle: "B2B",
  kupLegend: "Employee costs (KUP)",
  kup: { standard: "PLN 250", commuter: "PLN 300 (commuting from another town)" },
  pit2: "PIT-2 filed with the employer",
  under26: "I am under 26",
  ppk: "I save in PPK (2% + 1.5% from the employer)",
  formLegend: "Tax form",
  forms: { skala: "Scale", liniowy: "Flat 19%", ryczalt: "Lump sum" },
  ryczaltRateLabel: "Lump-sum rate",
  ryczaltRates: {
    "1200": "12% (e.g. software development, software consulting)",
    "850": "8.5% (e.g. some IT services, education)",
    "1400": "14% (e.g. architecture, engineering, healthcare)",
    "1500": "15% (e.g. management consulting, advertising)",
    "1700": "17% (liberal professions)",
    "550": "5.5% (e.g. construction, manufacturing)",
    "300": "3% (e.g. trade)",
  },
  zusLegend: "ZUS",
  zus: { full: "Full", preferential: "Preferential", start: "Start-up relief" },
  sickness: "Voluntary sickness insurance",
  costsLabel: "Monthly business costs (net)",
  daysOffLabel: "Days without an invoice a year",
  daysOffHint: "26 days is the full holiday allowance on a contract.",
  formerEmployer: "B2B for a current or former employer, same work",
  formerEmployerNote:
    "When on B2B you do the same work for a current or former employer that you did on a contract this year or last year, you cannot choose the flat rate (art. 9a(3) of the PIT Act) or the lump-sum rate (art. 8(2) of the Lump-Sum Act), nor the start-up relief or preferential ZUS. We calculate the scale and full ZUS.",
  unavailable: {
    formerEmployer: "not available for a former employer",
    revenueLimit: "revenue above the lump-sum limit (PLN 8,517,200)",
  },
  periodLabel: "Amounts in PLN:",
  period: { month: "a month (average)", year: "a year" },
  resultCaption: "Contract and B2B compared",
  rows: {
    net: "Take-home",
    social: "Social ZUS",
    health: "Health contribution",
    pit: "Tax",
    ppk: "PPK contribution",
    costs: "Business costs",
    companyCost: "Cost to the company",
  },
  difference: {
    more: "B2B leaves {year} a year more than the contract, {month} a month on average.",
    less: "B2B leaves {year} a year less than the contract, {month} a month on average.",
    equal: "B2B and the contract leave the same take-home pay.",
  },
  breakEven: "The net invoice that leaves as much on B2B ({form}) as on the contract: {amount} a month.",
  breakEvenNone: "With these settings, no invoice leaves as much as the contract.",
  tierEdge: "This invoice is just above the {edge} threshold of yearly revenue less ZUS, from which the lump-sum health contribution is {health} a month.",
  insert: "Use it",
  formsTitle: "The same invoice on other tax forms",
  formsColumns: { form: "Tax form", netMonth: "Take-home a month", netYear: "Take-home a year", health: "Health a month", tax: "Tax a year" },
  monthsTitle: "Contract month by month",
  monthsColumns: { month: "Month", social: "ZUS", health: "Health", advance: "PIT advance", ppk: "PPK", net: "Take-home", cost: "Employer's cost", note: "Notes" },
  monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  notes: { cap: "30× ZUS cap", bracket: "higher tax bracket", youth: "under-26 relief ends" },
  copySummary: "Copy summary",
  copied: "Copied",
  copyEmployment: "Contract {gross} gross: take-home {month} a month on average, {year} a year.",
  copyB2b: "B2B {invoice} net ({options}): take-home {month} a month on average, {year} a year.",
  errors: { amount: "Type an amount, for example 15,000.", days: "Type a number of days from 0 to {max}." },
  disclaimer: "The result is an estimate for information, not tax advice. Check your situation with an accountant before you decide.",
  privacyNote: "Calculated in your browser. Nothing is sent.",
  money: "PLN {amount}",
  decimalSeparator: ".",
  defaultGross: "15,000",
  defaultInvoice: "18,000",
};
