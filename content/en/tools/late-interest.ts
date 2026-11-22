import type { LateInterestLabels, LateInterestPageContent } from "@/content/types";
import { nbpRateLabels } from "./nbp-rate";

export const lateInterestPage: LateInterestPageContent = {
  seo: {
    title: "Late payment interest calculator Poland",
    description:
      "Calculate Polish statutory late payment interest in B2B transactions and the EUR 40/70/100 recovery fee, with the right half-year rate. Several invoices.",
  },
  navLabel: "Late payment interest",
  navDescription: "Statutory late interest and the EUR 40/70/100 recovery fee.",
  hero: {
    title: "Late payment interest calculator",
    description:
      "Enter the invoice amount, the due date and the payment date to get the Polish statutory interest for late payment in commercial transactions, at the rate for the right half-year, and the EUR 40, 70 or 100 recovery compensation.",
  },
  explainer: {
    title: "Commercial late payment interest: one rate per half-year",
    paragraphs: [
      "When one business pays another late in Poland, the creditor is owed statutory interest for delay in commercial transactions, with no need to send a demand first. The rate is the NBP reference rate plus 10 percentage points. When the debtor is a public hospital or another public healthcare provider, it is plus 8 points.",
      "The rate is fixed for half a year: from 1 January to 30 June the reference rate of 1 January applies, and from 1 July to 31 December the one of 1 July. A change of the reference rate during the half-year does not change commercial interest, unlike the ordinary statutory interest of the Civil Code.",
      "From the day interest is due, the creditor may also claim compensation for recovery costs: EUR 40 when the amount is up to PLN 5,000, EUR 70 up to PLN 50,000 and EUR 100 from PLN 50,000. The euro is converted at the NBP average rate of the last business day of the month before the month the payment fell due. The compensation is due for each invoice.",
      "Interest runs from the day after the due date up to and including the payment date, on the gross amount, as amount × rate × days / 365. A due date on a Saturday or a public holiday moves to the next business day.",
    ],
    table: {
      caption: "When interest is due",
      columns: ["Situation", "Interest from", "Provision"],
      rows: [
        ["Payment term in the contract, debtor not a public entity", "The day after the due date", "Art. 7(1)"],
        ["Term longer than 60 days from delivery of the invoice, not allowed", "After 60 days from delivery of the invoice", "Art. 7(2)–(3)"],
        ["Debtor is a public entity", "The day after the due date, at the latest after 30 days (healthcare provider: 60)", "Art. 8"],
        ["SME creditor, term longer than 30 days", "May claim interest after 30 days", "Art. 5"],
        ["No term in the contract", "After 30 days from performance", "Art. 6"],
      ],
    },
  },
  rateTable: {
    title: "Statutory late payment interest in commercial transactions",
    intro:
      "Annual rates from the announcements in Monitor Polski. Each applies for the whole half-year, whatever the NBP reference rate does in between.",
    columns: ["Period", "Debtor in a commercial transaction", "Public healthcare provider", "Announcement"],
    halves: { first: "H1 {year}", second: "H2 {year}" },
    oneRateNote: "Until 2019 one rate applied to every debtor: the reference rate plus 8 points.",
    civilTitle: "Ordinary statutory interest for delay (art. 481 Civil Code)",
    civilIntro: "The NBP reference rate plus 5.5 points. The rate changes on the day the reference rate changes.",
    civilColumns: ["From", "Rate", "Announcement"],
    derived: "reference rate + 5.5 pp",
  },
  sources: {
    title: "Legal basis and sources",
    updatedLabel: "Rates current as of",
    updatedAt: "2026-11-16",
    note: "This tool is for information only. The announcements in Monitor Polski and the NBP rate tables are binding.",
    items: [
      {
        label: "Act on counteracting excessive delays in commercial transactions (Journal of Laws 2023 item 1790, in Polish)",
        href: "https://api.sejm.gov.pl/eli/acts/DU/2023/1790/text.pdf",
      },
      { label: "Announcement of the Minister of Finance and Economy of 22 June 2026 (M.P. 2026 item 642)", href: "https://api.sejm.gov.pl/eli/acts/MP/2026/642/text.pdf" },
      { label: "Announcement of the Minister of Finance and Economy of 11 December 2025 (M.P. 2025 item 1257)", href: "https://api.sejm.gov.pl/eli/acts/MP/2025/1257/text.pdf" },
      { label: "Civil Code, art. 115 and 481 (Journal of Laws 2026 item 795, in Polish)", href: "https://api.sejm.gov.pl/eli/acts/DU/2026/795/text.pdf" },
      { label: "Announcement of the Minister of Justice of 8 April 2026 (M.P. 2026 item 367)", href: "https://api.sejm.gov.pl/eli/acts/MP/2026/367/text.pdf" },
      { label: "CJEU judgment of 20 October 2022, C-585/20", href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:62020CJ0585" },
      { label: "NBP API", href: "https://api.nbp.pl/en.html" },
    ],
  },
  faq: {
    title: "Common questions",
    items: [
      {
        question: "What is the Polish late payment interest rate in commercial transactions in 2026?",
        answer:
          "14% a year from 1 January to 30 June 2026, and 13.75% from 1 July to 31 December 2026. When the debtor is a public healthcare provider, 12% and 11.75%.",
      },
      {
        question: "Why did the rate not change in March, when NBP cut its rates?",
        answer:
          "Commercial interest uses the reference rate of 1 January or 1 July for the whole half-year. The cut of 5 March 2026 only changed the ordinary statutory interest of the Civil Code at once, to 9.25%.",
      },
      {
        question: "What is the EUR 40 compensation and when is it due?",
        answer:
          "It is a fixed amount for the costs of recovering the debt. It is due without a demand from the day interest is due: EUR 40 up to PLN 5,000, EUR 70 above PLN 5,000 and below PLN 50,000, and EUR 100 from PLN 50,000. You do not have to show any costs.",
      },
      {
        question: "Is the compensation due for each invoice?",
        answer:
          "Yes. Under the CJEU judgment C-585/20 it is due for each transaction certified by an invoice, also when you claim several invoices at once.",
      },
      {
        question: "Which exchange rate converts the EUR 40 to PLN?",
        answer:
          "The NBP average euro rate of the last business day of the month before the month the payment fell due. For a due date in November 2026, that is the rate of 30 October 2026: 4.3955 PLN, table 212/A/NBP/2026.",
      },
      {
        question: "Is interest charged on the net or the gross amount?",
        answer: "On the gross amount, VAT included, because the debtor has to pay the whole invoice. The gross amount also sets the compensation tier.",
      },
      {
        question: "What if the due date falls on a weekend?",
        answer:
          "A due date on a Saturday or a statutory public holiday ends on the next business day (art. 115 of the Civil Code). Interest runs from the day after that.",
      },
      {
        question: "How are the days of delay counted?",
        answer:
          "From the day after the due date up to and including the payment date. For a bank transfer, the payment date is usually the day the money reaches the creditor's account. The year counts as 365 days, leap years included.",
      },
      {
        question: "How does commercial interest differ from ordinary statutory interest?",
        answer:
          "Ordinary statutory interest for delay under art. 481 of the Civil Code is the NBP reference rate plus 5.5 points, and it changes on the day the reference rate changes. It applies when the debt is not a commercial transaction between businesses, for example with a consumer.",
      },
      {
        question: "How do I issue an interest note?",
        answer:
          "Calculate the interest for the overdue invoices, copy or print the summary, and attach it to a note with both parties' details, a number and a payment term. An interest note is not a VAT invoice, because interest is outside VAT.",
      },
      {
        question: "Does the calculator work for contracts from before 2016?",
        answer:
          "No. Transactions concluded before 2016 use the old interest, equal to the interest on tax arrears. For contracts from 2016–2019 the calculator applies the transitional rules, but check them with a lawyer in a dispute.",
      },
      {
        question: "Does KodaSoft see what I type?",
        answer:
          "No. Amounts and dates are calculated in your browser. The NBP API only receives a request for the euro rate of one month, sent straight from your device.",
      },
    ],
  },
  opero: {
    title: "Overdue invoices next to the client",
    body: "In Opero you see a client's overdue sales invoices next to them, with the due date and the amount.",
    primaryCta: "Book a demo",
    secondaryCta: "Opero AI",
    points: [
      { title: "Days overdue on the list", body: "The invoice list can show how many days each invoice is overdue, so late payers stand out." },
      { title: "Reminders around the due date", body: "A date rule notifies the account owner before or after the due date, up to 365 days either way." },
      { title: "Payment demands in one step", body: "A rule generates a payment demand PDF from the invoice data, attaches it and sends it by email." },
    ],
  },
  otherToolsTitle: "Other tools",
};

export const lateInterestLabels: LateInterestLabels = {
  modeLabel: "Type of interest",
  modes: { commercial: "Commercial transaction (B2B)", civil: "Statutory interest (Civil Code)" },
  healthcareLabel: "The debtor is a public entity that is a healthcare provider (e.g. a public hospital)",
  compensationLabel: "Add the EUR 40, 70 or 100 compensation",
  columns: { label: "Invoice", amount: "Gross amount due", due: "Due date", paid: "Payment date" },
  labelPlaceholder: "FV/2026/0412",
  amountHint: "The amount with VAT, i.e. what the debtor had to pay.",
  paidHint: "The day the money reached the creditor's account.",
  unpaidLabel: "Still unpaid",
  invoiceName: "Invoice {n}",
  cellLabel: "{column}, invoice {n}",
  removeRow: "Remove invoice",
  addRow: "Add invoice",
  maxRows: "You can add up to {max} invoices.",
  untilLabel: "Count interest until",
  untilHint: "For the invoices that are still unpaid.",
  total: "Total",
  totalBreakdown: "interest {interest} + compensation {compensation}",
  resultColumns: { period: "Period", days: "Days", rate: "Rate", interest: "Interest" },
  invoiceSummary: "{amount} · due {due} · {end} · {days}",
  paidOn: "paid {date}",
  unpaidUntil: "unpaid, counted to {date}",
  days: { one: "day", many: "days" },
  interest: "Interest",
  compensation: "Compensation: EUR {eur} × {mid} (table {no} of {date}) = {pln}",
  compensationEur: "Compensation: EUR {eur}",
  compensationLoading: "Fetching the euro rate from NBP…",
  compensationFailed: "Could not fetch the euro rate from NBP.",
  retry: "Try again",
  compensationPending: "The rate of the last business day of {month} is not known yet. The latest available one is {mid} (table {no}), so the compensation stays in euro.",
  flatCompensationNote: "Before 2020 the compensation was EUR 40 whatever the amount.",
  dayOff: "{days} is {reason}",
  shifted: "{list}, so the term ended on {date} (art. 115 Civil Code).",
  dayOffNames: nbpRateLabels.dayOffNames,
  forecastMark: "forecast",
  forecastNote: "Forecast rate: from {date} the last announced rate is used. The new one may differ.",
  errors: {
    amount: "Enter an amount above zero, for example 1,234.56.",
    due: "Enter the due date.",
    beforeFirst: "The calculator covers due dates from 1 January 2016. Contracts from before 2016 used a different interest rate.",
    paid: "Enter the payment date or tick that the invoice is still unpaid.",
    notLate: "Paid on time – no interest is due.",
    until: "Enter the date to count interest until.",
  },
  titles: {
    commercial: "Statutory interest for late payment in commercial transactions",
    civil: "Statutory interest for delay (art. 481 Civil Code)",
  },
  copyNote: "Copy summary",
  copied: "Copied",
  print: "Print",
  privacyNote:
    "Amounts and dates are calculated on your device. Only a request for one month's euro rate goes to api.nbp.pl, straight from your browser, and nothing reaches KodaSoft.",
  pln: "PLN",
  decimalSeparator: ".",
  defaultAmount: "12,300.00",
  defaultLabel: "FV/2026/0412",
};
