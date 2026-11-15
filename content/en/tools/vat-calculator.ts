import type { ToolPageContent, VatCalculatorLabels } from "@/content/types";

export const vatCalculatorPage: ToolPageContent = {
  seo: {
    title: "Polish VAT calculator - net and gross",
    description:
      "Polish VAT calculator: convert net to gross and gross to net at 23%, 8% and 5%. Total a whole invoice with VAT on the sum or on each line.",
  },
  navLabel: "Polish VAT calculator",
  navDescription: "Convert net, VAT and gross at every Polish rate, for one amount or a whole invoice.",
  hero: {
    title: "Polish VAT calculator",
    description:
      "Convert net to gross and gross to net at every Polish VAT rate. For an invoice with several lines, compare VAT on the total with VAT on each line.",
  },
  explainer: {
    title: "How to calculate Polish VAT: net, gross and tax",
    paragraphs: [
      "VAT is a percentage of the net amount, and gross is net plus VAT. Poland's standard rate is 23%, with reduced rates of 8% and 5%. The tax is rounded to the full grosz: under half a grosz is dropped, half a grosz and above rounds up.",
      "On an invoice with several lines, VAT is most often calculated on the total net amount at each rate. Calculating it on every line and adding the results can differ by a few grosze.",
      "When prices are gross, as in sales to consumers, VAT is taken out of the gross amount: gross times the rate, divided by one hundred plus the rate.",
    ],
    table: {
      caption: "Formulas at 23%",
      columns: ["What you need", "Formula"],
      rows: [
        ["Net to gross", "gross = net × 1.23"],
        ["Gross to net", "net = gross ÷ 1.23"],
        ["VAT from net", "VAT = net × 0.23"],
        ["VAT from gross", "VAT = gross × 23 ÷ 123"],
      ],
    },
  },
  sources: {
    title: "Legal basis",
    updatedLabel: "Rules current as of",
    updatedAt: "2026-11-15",
    note: "This calculator is for information only. Check the rate for a specific product or service in the Polish VAT Act or with an accountant.",
    items: [
      { label: "Art. 41 and art. 146ef of the Polish VAT Act (rates of 23%, 8%, 5% and 0%)" },
      { label: "Art. 106e(11) of the VAT Act (rounding tax to the full grosz)" },
      { label: "Art. 106e(7) and (8) of the VAT Act (invoices with gross prices)" },
    ],
  },
  faq: {
    title: "Common questions",
    items: [
      {
        question: "What is PLN 1,000 net in gross?",
        answer: "At 23%, PLN 1,000 net is PLN 1,230 gross. At 8% it is PLN 1,080, and at 5% it is PLN 1,050.",
      },
      {
        question: "VAT on the total or on each line?",
        answer:
          "Most often on the total net amount at each rate. Some invoicing software calculates VAT on every line and adds it up, which can differ by a few grosze. Invoice mode shows both.",
      },
      {
        question: "Why can some gross amounts not be reached?",
        answer:
          "VAT is rounded to the grosz, so as the net amount goes up by one grosz, gross goes up by one or two. The calculator then suggests the nearest net amounts.",
      },
      {
        question: "What do zw. and np. mean?",
        answer:
          "“zw.” marks a VAT-exempt sale and “np.” a sale outside the scope of Polish VAT. In both cases the invoice shows no VAT amount, and gross equals net.",
      },
    ],
  },
  opero: {
    title: "In Opero, invoices add themselves up",
    body: "Opero calculates VAT, totals and the amount in words on invoices and documents, from data that is already in the system.",
    primaryCta: "Book a demo",
    secondaryCta: "Documents in Opero",
  },
  otherToolsTitle: "More tools",
};

export const vatCalculatorLabels: VatCalculatorLabels = {
  modeLabel: "Calculator mode",
  modes: { quick: "Quick conversion", invoice: "Invoice with lines" },
  rateLegend: "VAT rate",
  rates: { "23": "23%", "8": "8%", "5": "5%", "0": "0%", zw: "zw. (exempt)", np: "np. (out of scope)" },
  net: "Net",
  vat: "VAT",
  gross: "Gross",
  notApplicable: "not applicable",
  hint: "Type an amount in any field. The other two update by themselves.",
  wordsLabel: "Gross in words (Polish)",
  copyAmounts: "Copy amounts",
  copySummary: "Copy summary",
  copied: "Copied",
  formula: "VAT = net × {rate}, rounded to the grosz",
  formulaNoVat: "No VAT: gross = net",
  nearest:
    "At {rate}, no net amount gives exactly PLN {gross} gross. The closest: net PLN {belowNet} gives PLN {belowGross}, and net PLN {aboveNet} gives PLN {aboveGross}. Above, VAT is taken from the gross.",
  errors: {
    invalid: "Type an amount, for example 1,234.56.",
    noVat: "There is no VAT at this rate. Type the net or gross amount.",
  },
  largePayment: {
    before: "Over PLN 15,000 gross: before paying,",
    link: "check the account on the VAT White List",
    after: ", and for goods listed in Annex 15 to the VAT Act, pay with split payment.",
  },
  priceBasisLabel: "Line prices:",
  priceBasis: { net: "net", gross: "gross" },
  columns: {
    name: "Description",
    quantity: "Quantity",
    priceNet: "Net price",
    priceGross: "Gross price",
    rate: "Rate",
    net: "Net",
    vat: "VAT",
    gross: "Gross",
  },
  cellLabel: "{column}, line {n}",
  removeRow: "Remove line",
  addRow: "Add line",
  methodLabel: "VAT on:",
  methods: { sumNet: "the net total per rate", sumGross: "the gross total per rate", line: "each line" },
  summaryCaption: "Summary by rate",
  totals: "Total net {net} · VAT {vat}",
  amountDue: "Amount due",
  difference: "Calculated on {other}, VAT would be {vat}, which is {diff} {direction}.",
  otherMethod: { sum: "the total per rate", line: "each line" },
  more: "more",
  less: "less",
  privacyNote: "Calculated in your browser. Nothing is sent.",
  currency: "PLN",
  decimalSeparator: ".",
  copyText: { rate: "Rate", total: "Total" },
  defaultAmount: "1,000.00",
  defaultRows: [
    { name: "Consulting", price: "33.33" },
    { name: "Licence", price: "33.33" },
    { name: "Support", price: "33.33" },
  ],
};
