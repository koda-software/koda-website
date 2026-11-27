import type { ToolPageContent, WhiteListLabels } from "@/content/types";

export const whiteListPage: ToolPageContent = {
  seo: {
    title: "Polish VAT White List check by NIP",
    description:
      "Check a NIP and bank account on the Polish VAT White List: VAT status, company details and accounts. Verify an account before paying and print proof.",
  },
  navLabel: "VAT White List check",
  navDescription: "Check a Polish company and its bank account by NIP before you pay.",
  hero: {
    title: "Polish VAT White List check",
    description:
      "Enter a NIP to see the company's VAT status and the bank accounts on Poland's VAT White List. Add an account number to check it before you pay.",
  },
  explainer: {
    title: "Why companies check the White List before paying",
    paragraphs: [
      "The White List (biała lista) is Poland's register of VAT taxpayers, kept by the head of the National Revenue Administration. It shows a company's VAT status and the bank accounts it has reported to the tax office.",
      "If a single transaction over PLN 15,000 is paid to an account that is not on the list, the payer becomes jointly liable for the supplier's VAT. For an invoice issued by 31 December 2026 the payment is also not a tax-deductible cost. For invoices issued from 1 January 2027 an act of 18 September 2026 removes that income tax penalty, while joint liability stays. What counts is the list on the day the transfer is ordered.",
      "Both consequences are avoided by paying through the split payment mechanism (MPP), or by filing a ZAW-NR notice with the supplier's tax office within 7 days of ordering the transfer.",
      "Virtual accounts, such as those used for bulk payments, are not listed directly. Enter the account number next to the NIP and the register also checks it against virtual accounts.",
    ],
    table: {
      caption: "What the result means",
      columns: ["Result", "What it means"],
      rows: [
        ["Czynny (active)", "The company is registered as an active VAT payer."],
        ["Zwolniony (exempt)", "The company is in the VAT register but exempt. Its invoices usually carry no VAT."],
        ["Not on the list", "The company is not registered for VAT or has been removed. Check whether an invoice with VAT is justified."],
        ["Account on the list", "Paying to this account carries no risk of losing the cost or joint liability."],
        ["Account not on the list", "For payments over PLN 15,000, pay with MPP or file ZAW-NR within 7 days."],
      ],
    },
  },
  sources: {
    title: "Legal basis and sources",
    updatedLabel: "Rules current as of",
    updatedAt: "2026-11-27",
    note: "This tool is for information only. The binding source is the VAT taxpayer register kept by the head of the National Revenue Administration (KAS).",
    items: [
      { label: "VAT White List search (podatki.gov.pl, in Polish)", href: "https://www.podatki.gov.pl/wykaz-podatnikow-vat-wyszukiwarka" },
      { label: "White List API (Polish Ministry of Finance)", href: "https://wl-api.mf.gov.pl" },
      { label: "Art. 96b of the Polish VAT Act (the register)" },
      { label: "Art. 15d(1)(3) of the CIT Act and art. 22p(1)(3) of the PIT Act (tax-deductible costs, invoices issued by 31 December 2026)" },
      { label: "Act of 18 September 2026 amending the PIT and CIT Acts, Journal of Laws 2026 item 1371 (no cost penalty for invoices from 1 January 2027)" },
      { label: "Art. 117ba of the Tax Ordinance (joint liability, ZAW-NR notice)" },
      { label: "Art. 19 of the Entrepreneurs' Law (the PLN 15,000 threshold)" },
    ],
  },
  faq: {
    title: "Common questions",
    items: [
      {
        question: "How do I prove I checked the supplier?",
        answer:
          "Every check gets a request ID from the register. Save it or print the confirmation and keep it with the payment records. The printout shows the date of the register state and the time of the check.",
      },
      {
        question: "How many checks can I run a day?",
        answer:
          "The Ministry of Finance limits the number of requests from one address per day. Requests go straight from your browser to the register, so the limit is yours alone. Once it is used up, use the search on podatki.gov.pl.",
      },
      {
        question: "Can I check the register for a past date?",
        answer: "Yes. Change the date to see the register as it was on that day, such as the day a transfer was ordered.",
      },
      {
        question: "Does the White List show whether a company is bankrupt or in liquidation?",
        answer:
          "No. A company in bankruptcy can still be an active VAT payer. To see its KRS or CEIDG status and check its EU VAT number in VIES, use our Company check tool with the same NIP.",
      },
      {
        question: "Does KodaSoft see the NIP and account I enter?",
        answer:
          "No. Your browser sends the request directly to the Ministry of Finance API. It does not pass through our servers, and nothing is stored.",
      },
    ],
  },
  opero: {
    title: "Supplier checks built into every invoice",
    body: "In Opero, a cost invoice brings the supplier's registry data with it and goes through approval before anyone orders the payment. For the account itself, keep this check as a step before you pay.",
    primaryCta: "Book a demo",
    secondaryCta: "Integrations in Opero",
    points: [
      { title: "Company data from a NIP", body: "Opero brings in a partner's name and address from REGON and CEIDG, or through VIES for EU VAT IDs." },
      { title: "Checksums on every invoice", body: "With an AI provider connected, Opero reads a PDF invoice and checks the NIP and IBAN checksums." },
      { title: "Approval before payment", body: "Above your limit, only the right approver can move the invoice on to payment." },
    ],
  },
  otherToolsTitle: "More tools",
};

export const whiteListLabels: WhiteListLabels = {
  nipLabel: "NIP (Polish tax ID)",
  nipPlaceholder: "e.g. 526 025 02 74",
  accountLabel: "Bank account (optional)",
  accountHint: "26 digits; spaces are fine. Virtual accounts are checked too.",
  accountPlaceholder: "e.g. 59 1010 1010 0075 9122 2200 0000",
  dateLabel: "Register as of",
  dateHint: "Leave empty for today.",
  submit: "Check the register",
  checking: "Checking…",
  privacyNote: "The request goes straight to the Ministry of Finance. Nothing is stored.",
  errors: {
    nip: "That is not a valid NIP. Check that it has 10 digits and no typo.",
    account: "That is not a valid account number. Check that it has 26 digits and no typo.",
    date: "Choose today or an earlier date.",
    network: "Could not reach the Ministry of Finance register. Try again shortly, or",
    limit: "The daily request limit for the register from this address is used up. Try tomorrow, or",
    api: "The register returned an error: {message}. Try again, or",
  },
  result: {
    title: "Result",
    notFound: "This NIP is not on the VAT White List",
    notFoundHint:
      "The company is not registered as a VAT payer, or was removed from the register on the chosen day. If it issues invoices with VAT, clear this up before paying.",
    statuses: { Czynny: "Czynny (active VAT payer)", Zwolniony: "Zwolniony (VAT exempt)" },
    statusLabel: "VAT status",
    nipLabel: "NIP",
    regonLabel: "REGON",
    krsLabel: "KRS",
    residenceLabel: "Registered address",
    workingLabel: "Business address",
    registeredLabel: "VAT registration date",
    removedLabel: "Removed from the register",
    restoredLabel: "Restored to the register",
    deniedLabel: "Registration refused",
    representativesLabel: "Representatives",
    partnersLabel: "Partners",
    accountsLabel: "Accounts on the list",
    noAccounts: "The company has no accounts reported on the list.",
    virtualAccounts: "The company also has virtual accounts. They are not listed above; enter the account number to check it.",
    accountYes: "This account is on the list for this NIP.",
    accountNo: "This account is not on the list for this NIP. For payments over PLN 15,000, pay with MPP or file ZAW-NR.",
    stateOnLabel: "Register as of",
    requestIdLabel: "Request ID",
    checkedAtLabel: "Checked at (Polish time)",
    copyId: "Copy request ID",
    copied: "Copied",
    print: "Print confirmation",
    printTitle: "Confirmation of a VAT White List check",
    printSource: "Source: VAT taxpayer register of the head of KAS, Polish Ministry of Finance API (wl-api.mf.gov.pl).",
    officialSearch: "use the Ministry of Finance search.",
  },
};
