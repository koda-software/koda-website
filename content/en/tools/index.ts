import { localizeFeaturePath } from "@/lib/i18n/features";
import { localizePath } from "@/lib/i18n/routes";
import { localizeToolPath, toolKeys, type ToolKey } from "@/lib/i18n/tools";
import type { ToolPageContent, ToolsIndexContent } from "@/content/types";
import { amountInWordsPage } from "./amount-in-words";
import { b2bVsEmploymentPage } from "./b2b-vs-employment";
import { counterpartyPage } from "./counterparty";
import { eDeliveryPage } from "./e-delivery";
import { jpkViewerPage } from "./jpk-viewer";
import { ksefViewerPage } from "./ksef-viewer";
import { lateInterestPage } from "./late-interest";
import { nbpRatePage } from "./nbp-rate";
import { salaryCalculatorPage } from "./salary-calculator";
import { vatCalculatorPage } from "./vat-calculator";
import { whiteListPage } from "./white-list";
import { workingTimePage } from "./working-time";

export const toolsIndexContent: ToolsIndexContent = {
  seo: {
    title: "Free business tools and calculators for Poland",
    description: "Free online tools for companies in Poland: salary, VAT and late interest calculators, B2B vs employment, VAT White List, NBP rate, KSeF and JPK viewers.",
  },
  navLabel: "Tools",
  breadcrumbLabel: "Breadcrumb",
  hero: {
    title: "Free tools for business and accounting in Poland",
    description:
      "Calculators and tools for everyday work with Polish invoices, VAT, business partners and payroll. They work straight in your browser, with no sign-up, on data from official sources.",
  },
  jumpLabel: "Tool categories",
  trust: [
    { title: "Free, no account", body: "No sign-up and no login. Open the page and start." },
    { title: "Official sources", body: "The VAT White List, NBP, KRS, CEIDG, VIES and gov.pl, with the sources listed on every page." },
    { title: "Nothing is stored", body: "Calculators run in your browser, and KSeF and JPK files never leave your computer." },
    { title: "Rules for 2026", body: "Rates, contributions, thresholds and holidays follow current Polish law, with the date they were last checked." },
  ],
  categories: [
    {
      id: "invoices-and-vat",
      title: "Invoices, VAT and currencies",
      description: "Calculate VAT, convert an amount at the NBP rate, write it out in words, and open a KSeF invoice or a JPK file without accounting software.",
      tools: ["vatCalculator", "nbpRate", "amountInWords", "ksefViewer", "jpkViewer"],
    },
    {
      id: "partners-and-payments",
      title: "Business partners and payments",
      description: "Check a Polish company and its bank account before you pay, find an e-Delivery address, and calculate interest on a late invoice.",
      tools: ["whiteList", "counterpartyCheck", "lateInterest", "eDelivery"],
    },
    {
      id: "hr-and-payroll",
      title: "HR and payroll",
      description: "Convert a Polish gross salary to net, compare employment with B2B, and check the working hours in any month.",
      tools: ["salaryCalculator", "b2bVsEmployment", "workingTime"],
    },
  ],
  cards: {
    vatCalculator: {
      description: "Convert net to gross and gross to net at every Polish VAT rate. For an invoice with several lines, compare VAT on the total with VAT on each line.",
      highlights: ["23%, 8%, 5% and 0% rates", "Invoices with lines", "Gross in words"],
    },
    nbpRate: {
      description: "The NBP average rate from the last business day before the invoice date, with the table number, and the amount and VAT in zloty.",
      highlights: ["Table A with its number", "Business day before the date", "VAT in PLN"],
    },
    amountInWords: {
      description: "Write an amount out in Polish and English words, with the grosze, ready to paste on an invoice, contract or transfer.",
      highlights: ["Polish and English", "PLN, EUR, USD, GBP, CHF", "One-click copy"],
    },
    ksefViewer: {
      description: "Drop a KSeF XML invoice and read it as a normal invoice: seller, buyer, lines, VAT and payment details.",
      highlights: ["Readable invoice from XML", "Print or save as PDF", "The file stays with you"],
    },
    jpkViewer: {
      description: "Open a JPK_V7M or JPK_V7K file as readable tables: the return, the sales and purchase registers, and the control totals.",
      highlights: ["JPK_V7M and JPK_V7K", "Control total checks", "Export to CSV"],
    },
    whiteList: {
      description: "Enter a NIP to see a company's VAT status and the bank accounts on the White List. Add an account number to check it before you pay.",
      highlights: ["VAT status by NIP", "Bank account check", "Ministry of Finance data"],
    },
    counterpartyCheck: {
      description: "One number, four registers. See what KRS, CEIDG, the VAT White List and VIES say about a Polish company, with the date of each check.",
      highlights: ["NIP, KRS, REGON or EU VAT ID", "KRS, CEIDG, VIES", "Printable record"],
    },
    lateInterest: {
      description: "Statutory late interest on commercial invoices at the rate for each half-year, plus the recovery fee for collection costs.",
      highlights: ["Commercial late interest", "EUR 40, 70 or 100 fee", "Rates for every half-year"],
    },
    eDelivery: {
      description: "Find the e-Delivery address of a Polish public office by name and town, or of a company by NIP, KRS or REGON.",
      highlights: ["AE:PL address", "Offices and companies", "Source and date"],
    },
    salaryCalculator: {
      description: "Gross to net and back on a Polish employment contract, umowa zlecenie and umowa o dzieło, with every contribution, the tax and the employer cost.",
      highlights: ["Employment, zlecenie, dzieło", "Employer cost", "Every month of 2026"],
    },
    b2bVsEmployment: {
      description: "Compare take-home pay on an employment contract and on B2B in Poland, with ZUS, health insurance and tax, and find the B2B rate that equals a salary.",
      highlights: ["Scale, flat and lump-sum tax", "ZUS and health insurance", "Break-even B2B rate"],
    },
    workingTime: {
      description: "The working hours and days in any month, quarter or settlement period in Poland, with public holidays.",
      highlights: ["Hours and working days", "Part-time and 7 h 35 min", "Working days between dates"],
    },
  },
  cardCta: "Open the tool",
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        question: "Are the tools really free?",
        answer: "Yes. Every tool is free, with no usage limit, no sign-up and no account.",
      },
      {
        question: "Do you store what I type?",
        answer: "No. Calculators run in your browser, and KSeF and JPK files are not sent anywhere. Tools that check a register pass the number to that register and store nothing. Each tool explains this under its form.",
      },
      {
        question: "Where does the data come from?",
        answer: "From official sources: the Ministry of Finance VAT White List, NBP exchange rate tables, KRS, CEIDG, VIES and the e-Delivery address database. Every tool page lists its sources and the date the rules were last checked.",
      },
      {
        question: "Are the results up to date for 2026?",
        answer: "Yes. VAT rates, ZUS contributions, tax thresholds, interest rates and public holidays follow the rules in force in Poland in 2026. A calculator result is guidance and does not replace advice from an accountant.",
      },
      {
        question: "Do the tools work on a phone?",
        answer: "Yes. Every tool works in the browser on a computer, tablet or phone, with nothing to install.",
      },
    ],
  },
  opero: {
    title: "Stop calculating by hand and automate it in Opero",
    body: "Opero downloads invoices from KSeF, routes them for approval, watches deadlines and generates documents from data already in the system, so these calculations happen by themselves.",
    primaryCta: "Book a demo",
    secondaryCta: "Discover Opero",
  },
};

export const toolPages: Record<ToolKey, ToolPageContent> = {
  vatCalculator: vatCalculatorPage,
  nbpRate: nbpRatePage,
  lateInterest: lateInterestPage,
  b2bVsEmployment: b2bVsEmploymentPage,
  salaryCalculator: salaryCalculatorPage,
  workingTime: workingTimePage,
  amountInWords: amountInWordsPage,
  whiteList: whiteListPage,
  counterpartyCheck: counterpartyPage,
  eDelivery: eDeliveryPage,
  ksefViewer: ksefViewerPage,
  jpkViewer: jpkViewerPage,
};

/** Where each tool's Opero link points: the feature that does the same job inside Opero. */
const toolFeature = {
  vatCalculator: "documents",
  nbpRate: "documents",
  lateInterest: "ai",
  b2bVsEmployment: "processes",
  salaryCalculator: "processes",
  workingTime: "lowCode",
  amountInWords: "documents",
  whiteList: "integrations",
  counterpartyCheck: "integrations",
  eDelivery: "documents",
  ksefViewer: "integrations",
  jpkViewer: "integrations",
} as const satisfies Record<ToolKey, Parameters<typeof localizeFeaturePath>[1]>;

export function toolCtas(tool: ToolKey) {
  return { primary: localizePath("en", "contact"), secondary: localizeFeaturePath("en", toolFeature[tool]) };
}

export const toolLinks = toolKeys.map((tool) => ({
  tool,
  href: localizeToolPath("en", tool),
  label: toolPages[tool].navLabel,
  description: toolPages[tool].navDescription,
}));
