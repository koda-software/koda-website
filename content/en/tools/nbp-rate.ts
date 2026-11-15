import type { NbpRateLabels, ToolPageContent } from "@/content/types";

export const nbpRatePage: ToolPageContent = {
  seo: {
    title: "NBP exchange rate for invoices",
    description:
      "Look up the NBP average rate from the last business day before an invoice date, with the table number. Convert the amount and VAT to PLN. Free.",
  },
  navLabel: "NBP exchange rate",
  navDescription: "The NBP rate from the business day before, with the table number.",
  hero: {
    title: "NBP exchange rate for invoices",
    description:
      "Pick a currency and a date to get the NBP average rate from the business day before, that is the last business day before that date, with the table number. You can also convert the amount and VAT to PLN.",
  },
  explainer: {
    title: "Which NBP rate to use: the business day before",
    paragraphs: [
      "Amounts on an invoice in a foreign currency are converted to PLN at the NBP average rate from the last business day before the day the tax is counted from. That is not always the day before: on a Monday the Friday rate applies, and after a public holiday the rate from the last day NBP published a table.",
      "For VAT, that day is usually the tax point, most often the day goods are delivered or a service is performed. If you issue the invoice before that day, the rate from the business day before the invoice date applies.",
      "For income tax, revenue is converted at the rate from the business day before it arises, and a cost at the rate from the business day before it is incurred. So the same invoice can have one rate for VAT and another for PIT or CIT.",
      "On an invoice in a foreign currency, the VAT amount is also shown in PLN: the VAT worked out in the currency is converted at the same rate and rounded to the grosz. The NBP table number is not a required part of the invoice, but it is worth adding, because it lets anyone check the conversion.",
    ],
    table: {
      caption: "Which date to enter",
      columns: ["Situation", "Enter", "Legal basis"],
      rows: [
        ["Sale, invoice on or after delivery", "The day of delivery or of the service (the tax point)", "Art. 31a(1) of the VAT Act"],
        ["Invoice issued before delivery", "The invoice date", "Art. 31a(2) of the VAT Act"],
        ["Revenue for PIT or CIT", "The day the revenue arises", "Art. 11a(1) PIT Act, art. 12(2) CIT Act"],
        ["Cost for PIT or CIT", "The day the cost is incurred", "Art. 11a(2) PIT Act, art. 15(1) CIT Act"],
        ["Corrective invoice", "The rate from the original invoice, or from the day before the correction", "Art. 31b of the VAT Act"],
      ],
    },
  },
  sources: {
    title: "Legal basis and sources",
    updatedLabel: "Rules current as of",
    updatedAt: "2026-11-15",
    note: "This tool is for information only. The rate tables published by NBP are binding.",
    items: [
      { label: "NBP average exchange rate tables (nbp.pl, in Polish)", href: "https://nbp.pl/statystyka-i-sprawozdawczosc/kursy/tabela-a/" },
      { label: "Exchange rate publication times (NBP, in Polish)", href: "https://nbp.pl/statystyka-i-sprawozdawczosc/kursy/informacja-o-terminach-publikacji-kursow-walut/" },
      { label: "NBP Web API", href: "https://api.nbp.pl/en.html" },
      { label: "Art. 31a, 31b and 106e(11) of the Polish VAT Act (Dz.U. 2026 item 1263)", href: "https://api.sejm.gov.pl/eli/acts/DU/2026/1263/text.pdf" },
      { label: "Art. 11a of the Personal Income Tax Act (Dz.U. 2026 item 592)", href: "https://api.sejm.gov.pl/eli/acts/DU/2026/592/text.pdf" },
      { label: "Art. 12(2) and art. 15(1) of the Corporate Income Tax Act (Dz.U. 2026 item 554)", href: "https://api.sejm.gov.pl/eli/acts/DU/2026/554/text.pdf" },
    ],
  },
  faq: {
    title: "Common questions",
    items: [
      {
        question: "Which day's NBP rate goes on an invoice?",
        answer:
          "The rate from the last business day before the tax point or, if the invoice is issued earlier, before the invoice date. Enter that date and the tool finds the right table.",
      },
      {
        question: "Which rate applies on a Monday or the day after a holiday?",
        answer:
          "NBP publishes no tables at weekends or on public holidays, so the last table before them applies: on a Monday the Friday one, and on 12 November the one from 10 November.",
      },
      {
        question: "When does NBP publish its rates?",
        answer:
          "Table A on business days between 11:45 and 12:15 Polish time, table B on Wednesdays in the same window. If Wednesday is a holiday, NBP publishes it the day before. If the rate you need is not out yet, the tool says so.",
      },
      {
        question: "Must the invoice show the rate and the NBP table number?",
        answer:
          "The law requires the VAT amount in PLN, but not the rate or the table number. They are worth adding to the invoice or your records, because they let anyone check the conversion. Copy the ready-made note from the result.",
      },
      {
        question: "How do I convert VAT on a euro invoice to PLN?",
        answer:
          "Work out the VAT in euro and convert it at the same rate, rounding to the grosz. The result can differ by a grosz from VAT calculated on the net amount in PLN. The first one is what goes on the invoice.",
      },
      {
        question: "Can I use the ECB rate instead of NBP?",
        answer:
          "Yes. For VAT you can choose the last European Central Bank rate from the day before. That choice binds you for at least 12 months. This tool shows the NBP rate.",
      },
      {
        question: "What about currencies outside table A?",
        answer: "NBP publishes the rates of less common currencies in table B, once a week. Pick the currency from the list and the tool uses the right table.",
      },
      {
        question: "Does KodaSoft see what I enter?",
        answer:
          "No. Only the currency code and the dates go to the NBP API, straight from your browser. Amounts are calculated on your device and nothing is saved.",
      },
    ],
  },
  opero: {
    title: "In Opero, invoices fill themselves in",
    body: "Opero document templates fill in the amounts and totals on invoices from data that is already in the system.",
    primaryCta: "Book a demo",
    secondaryCta: "Documents in Opero",
  },
  otherToolsTitle: "More tools",
};

export const nbpRateLabels: NbpRateLabels = {
  currencyLabel: "Currency",
  tableGroups: { A: "Table A – published every business day", B: "Table B – published weekly" },
  dateLabel: "Tax point, revenue or cost date",
  dateHint: "The tax point, the invoice date if it is issued before delivery, or the day revenue arises or a cost is incurred.",
  loading: "Fetching the rate from NBP…",
  dateWithWeekday: "{weekday} {date}",
  source: "NBP average rate of {date} · table no. {no}",
  reasonIntro: "For {date}, the last business day before it applies.",
  dayOff: "{days}: {reason}.",
  dayOffNames: {
    saturday: "Saturday",
    sunday: "Sunday",
    weekend: "weekend",
    newYear: "New Year's Day",
    epiphany: "Epiphany",
    easter: "Easter Sunday",
    easterMonday: "Easter Monday",
    labourDay: "Labour Day",
    constitutionDay: "Constitution Day",
    pentecost: "Pentecost",
    corpusChristi: "Corpus Christi",
    assumption: "Assumption Day",
    allSaints: "All Saints' Day",
    independenceDay: "Independence Day",
    christmasEve: "Christmas Eve",
    christmas: "Christmas Day",
    boxingDay: "the second day of Christmas",
  },
  tableBNote: "Table B is published once a week, on Wednesday (the day before when Wednesday is a holiday).",
  pending: {
    A: "The table for {date} is not published yet. NBP publishes it on business days between 11:45 and 12:15 Polish time. Come back after that.",
    B: "Table B for {date} is not published yet. NBP publishes it on Wednesdays between 11:45 and 12:15 Polish time. Come back after that.",
  },
  pendingLatest: "The rate above is the latest available, not the rate for this date.",
  noteLabel: "Note for the invoice",
  copyNote: "Copy the note",
  copied: "Copied",
  amountTitle: "Convert an invoice amount",
  amountLabel: "Amount in {code}",
  basisLabel: "The amount is:",
  basis: { net: "net", gross: "gross" },
  rateLegend: "VAT rate",
  rates: { "23": "23%", "8": "8%", "5": "5%", "0": "0%", zw: "zw.", np: "np." },
  columns: { item: "Item", foreign: "In the currency", pln: "In PLN" },
  net: "Net",
  vat: "VAT",
  gross: "Gross",
  vatNote: "VAT in PLN is the VAT in the currency converted at the rate (art. 106e(11) of the VAT Act).",
  copyAmounts: "Copy the amounts",
  vatLink: { before: "Work out VAT on an amount in PLN in the", link: "Polish VAT calculator", after: "." },
  errors: {
    date: "Enter a date from 3 January 2002.",
    amount: "Enter an amount, for example 1,234.56.",
    network: "The rate could not be fetched. NBP may have no rate for this currency in this period, or the connection failed.",
    none: "NBP published no rate for this currency in the month before this date.",
  },
  privacyNote: "Only the currency code and the dates go to api.nbp.pl, straight from your browser. Amounts are calculated on your device, and nothing reaches KodaSoft.",
  pln: "PLN",
  decimalSeparator: ".",
  defaultAmount: "1,000.00",
};
