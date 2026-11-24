import type { EDeliveryLabels, EDeliveryPageContent } from "@/content/types";
import { GOV_REGISTER_PAGE } from "@/lib/tools/e-delivery";

export const eDeliveryPage: EDeliveryPageContent = {
  seo: {
    title: "Polish e-Delivery address search",
    description:
      "Find the e-Delivery address (AE:PL) of a Polish public office or company by name, NIP, KRS or REGON, ready to copy. Free, no sign-up.",
  },
  navLabel: "e-Delivery address",
  navDescription: "Find the AE:PL address of a Polish public office or company.",
  hero: {
    title: "Find a Polish e-Delivery address",
    description:
      "Type a public office and its town, or a company's NIP, KRS or REGON. You get its address for electronic delivery, ready to copy, with the source and date.",
  },
  explainer: {
    title: "How to find an e-Delivery address",
    paragraphs: [
      "An e-Delivery address (adres do e-Doręczeń) is the electronic equivalent of an address for registered mail in Poland. It looks like AE:PL-12345-67890-ABCDE-12. A letter sent to it through e-Doręczenia has the same legal effect as registered mail with proof of receipt.",
      "The Ministry of Digital Affairs publishes the addresses of offices, schools, courts and other public entities on gov.pl, updated on working days. Companies and other entities in the National Court Register (KRS) have the address in their KRS entry, and sole traders in their CEIDG entry.",
      "Type an office's name and town and we find it in the gov.pl list. Type a NIP and we look up the company's KRS number in the VAT White List, then read its KRS entry. If the company is not in KRS, we check CEIDG. A KRS number works with or without its leading zeros.",
      "We do not search private individuals. The law shares their addresses with public entities only. Advocates, legal advisers and other regulated professions are in the address database search of the e-Doręczenia app, if you have your own mailbox.",
    ],
    table: {
      caption: "Where the address comes from",
      columns: ["You type", "We search", "How current"],
      rows: [
        ["Office name or REGON", "the gov.pl list of public entities", "as of the previous working day"],
        ["Company NIP", "the VAT White List, then KRS or CEIDG", "today"],
        ["KRS number", "KRS, the business register or the associations and foundations register", "as of the last entry"],
        ["Advocate, legal adviser, private person", "not searched", "the e-Doręczenia app"],
      ],
    },
  },
  popular: {
    title: "e-Delivery addresses of frequently searched offices",
    intro: "Addresses from the gov.pl list of public entities dated {date}. Check the current address in the search above before you send a letter.",
    columns: ["Office", "REGON", "e-Delivery address"],
    institutions: [
      { regon: "000017756", label: "ZUS (Social Insurance Institution), head office" },
      { regon: "012513262", label: "KRUS (Agricultural Social Insurance Fund), head office" },
      { regon: "015817985", label: "NFZ (National Health Fund)" },
      { regon: "000002217", label: "Ministry of Finance" },
      { regon: "366063511", label: "National Tax Information (KIS)" },
      { regon: "000331501", label: "Statistics Poland (GUS)" },
      { regon: "006212789", label: "Office of Competition and Consumer Protection (UOKiK)" },
      { regon: "017315012", label: "Office for Foreigners (UdSC)" },
      { regon: "000332251", label: "Patent Office of the Republic of Poland" },
      { regon: "015259663", label: "City of Warsaw office" },
      { regon: "350508747", label: "Kraków City Office" },
      { regon: "000514182", label: "Łódź City Office" },
      { regon: "001094670", label: "Wrocław City Office" },
      { regon: "000514199", label: "Poznań City Office" },
      { regon: "000598463", label: "Gdańsk City Office" },
    ],
  },
  sources: {
    title: "Legal basis and sources",
    updatedLabel: "Rules current as of",
    updatedAt: "2026-11-16",
    note: "This tool is for information only. The binding source is the entry in the electronic address database (BAE).",
    items: [
      { label: "Sprawdź, czy Twój urząd korzysta z e-Doręczeń (gov.pl, the list of public entities)", href: GOV_REGISTER_PAGE },
      { label: "KRS search (Ministry of Justice)", href: "https://wyszukiwarka-krs.ms.gov.pl/" },
      { label: "Open KRS API", href: "https://prs.ms.gov.pl/krs/openApi" },
      { label: "VAT White List API (Ministry of Finance)", href: "https://wl-api.mf.gov.pl" },
      { label: "CEIDG data warehouse (biznes.gov.pl)", href: "https://dane.biznes.gov.pl/" },
      { label: "e-Doręczenia app", href: "https://edoreczenia.gov.pl/" },
      { label: "Articles 9, 60, 151, 152 and 155 of the Electronic Delivery Act (Dz.U. 2026 item 3)" },
    ],
  },
  faq: {
    title: "Common questions",
    items: [
      {
        question: "What is an e-Delivery address?",
        answer:
          "It is the address of an electronic delivery mailbox entered in the electronic address database (BAE), for example AE:PL-12236-59999-IBJFI-32. A letter sent to it has the same effect as registered mail with proof of receipt.",
      },
      {
        question: "How do I find a public office's e-Delivery address?",
        answer:
          "Type the office's name and town, for example \"urząd skarbowy Gdynia\". We search the official gov.pl list of public entities and show the date of that list. Common abbreviations work too, such as ZUS, KRUS, US, GOPS or PUP.",
      },
      {
        question: "How do I find a company's e-Delivery address?",
        answer:
          "Type its NIP or KRS number. We read a KRS company's address from its current entry in the National Court Register. If the company is not in KRS, we check its CEIDG entry, where sole traders are registered.",
      },
      {
        question: "Why does a KRS company have no e-Delivery address?",
        answer:
          "A missing address in the KRS entry does not always mean the company has none: it may not have reached the register yet. Companies in the KRS business register must have one from 1 April 2025. Foundations and associations outside the business register do not have to.",
      },
      {
        question: "Who must have an e-Delivery address?",
        answer:
          "Public entities, entities in the KRS business register, sole traders in CEIDG (from 1 October 2026), and advocates, legal advisers, tax advisers, restructuring advisers, patent attorneys and notaries. Courts, prosecutors and bailiffs move to e-Doręczenia by 1 October 2029.",
      },
      {
        question: "Why is my court not listed?",
        answer:
          "Courts, prosecutors and bailiffs have until 1 October 2029 to adopt e-Doręczenia, and only a few are on the gov.pl list so far. Write to a court the way its website describes.",
      },
      {
        question: "Can I look up a private person's address?",
        answer: "No. The addresses of private individuals in the electronic address database are shared with public entities only.",
      },
      {
        question: "Can KodaSoft see what I search for?",
        answer:
          "Your browser checks a NIP, KRS or REGON directly with the Ministry of Finance and KRS. When a company is not in KRS, we ask CEIDG through our server, because its API needs a key. Your browser downloads the list of offices from gov.pl and searches it itself. Only when gov.pl does not respond do we search a copy on our server. We do not store queries.",
      },
    ],
  },
  opero: {
    title: "Official letters in one document workflow",
    body: "In Opero you register incoming and outgoing letters, assign them to people and keep track of reply deadlines, with a full history of events.",
    primaryCta: "Book a demo",
    secondaryCta: "Document workflow in Opero",
    points: [
      { title: "Connected to e-Delivery", body: "Official electronic delivery is part of the same document workflow as your other letters." },
      { title: "Numbered and assigned", body: "Each letter gets a number on registration and goes to a department as a task with a due date." },
      { title: "Deadlines that are watched", body: "Overdue replies trigger a reminder or move to someone else, and the full path stays in the history." },
    ],
  },
  otherToolsTitle: "Other tools",
};

export const eDeliveryLabels: EDeliveryLabels = {
  queryLabel: "Office name, NIP, KRS or REGON",
  placeholder: "e.g. urząd skarbowy Gdynia or 0000690425",
  submit: "Search",
  searching: "Searching…",
  loading: {
    stages: {
      list: "Searching the gov.pl list of public entities…",
      whiteList: "Checking the NIP in the VAT taxpayer register…",
      krs: "Reading the KRS extract…",
      ceidg: "Checking the CEIDG entry…",
      registers: "Checking the registers…",
    },
    note: "We ask the state registers live, so this usually takes a few seconds.",
    slow: "The register is answering more slowly than usual. Almost there…",
  },
  hints: {
    empty: "Type a name or a number and press Enter.",
    text: "Searching the gov.pl list of public entities. Press Enter.",
    nip: "Searching by NIP. Press Enter.",
    krs: "Searching by KRS number. Press Enter.",
    regon: "Searching by REGON. Press Enter.",
  },
  privacyNote:
    "Your browser checks NIP, KRS and REGON numbers with the Ministry of Finance and KRS; CEIDG is asked through our server. Your browser searches office names in the list it downloads from gov.pl. We do not store queries.",
  errors: {
    nip: "This is not a valid NIP. Type a KRS number with its leading zeros, e.g. 0000690425.",
    regon: "This is not a valid REGON. Check that it has 9 or 14 digits and no typo.",
    krs: "This is not a valid KRS number. It has up to 10 digits, e.g. 0000690425.",
    number: "We don't recognise this number. Type a NIP (10 digits), a KRS number (up to 10 digits) or a REGON (9 or 14 digits).",
    short: "Type at least two letters of a name, or a number.",
    krsNetwork: "Could not connect to KRS. Try again shortly or",
    krsSearch: "check in the KRS search.",
    whiteListLimit: "The daily limit of queries to the Ministry of Finance list is used up. Type the KRS number instead of the NIP, or try tomorrow.",
    whiteListNetwork: "Could not connect to the VAT White List. Try again shortly, or type the KRS number.",
    searchUnavailable: "The list of public entities is unavailable right now. Check the address on gov.pl.",
    ceidgLimit: "CEIDG is not accepting more queries right now. Try again in a few minutes.",
    ceidgUnavailable: "Could not check CEIDG. Try again shortly.",
  },
  result: {
    copy: "Copy address",
    copied: "Copied",
    regonLabel: "REGON",
    krsLabel: "KRS",
    nipLabel: "NIP",
    legalFormLabel: "Legal form",
    seatLabel: "Registered seat",
    townLabel: "Town",
    statusLabel: "Status",
    sourceGov: "gov.pl, list dated {date}",
    sourceKrs: "KRS, {register}, as of {state}, extract of {extracted}",
    registers: { P: "business register", S: "associations and foundations register" },
    foreignBranch: "branch of a foreign entrepreneur",
    sourceCeidg: "CEIDG, as of today",
    officialGov: "The list on gov.pl",
    officialKrs: "Check in the KRS search, number {krs}",
    officialCeidg: "CEIDG entry",
    noAdeTitle: "The KRS entry has no e-Delivery address for this company.",
    noAdeBody:
      "That does not mean the company has none: the address may not have reached KRS yet, or the company got it recently. If you have an e-Delivery mailbox, search the company in the electronic address database in the",
    noAdeDutyP: "Companies in KRS must have an e-Delivery address from 1 April 2025.",
    noAdeNoDutyS: "Foundations and associations outside the business register do not have to have an e-Delivery address.",
    noAdeCeidg:
      "CEIDG has no e-Delivery address for this firm. Sole traders must have one from 1 October 2026, so it may not have reached the entry yet. If you have a mailbox, check the firm in the",
    eDeliveryApp: "e-Doręczenia app",
    listDate: "List of public entities from gov.pl dated {date}.",
    stale: "It may be out of date, check gov.pl.",
    showMore: "Show more",
    shownOf: "{shown} of {total}",
    noInstitution: "No public office matches this name.",
    companyHint: "Looking for a company? Type its NIP or KRS number.",
    nipNotFound: "We found no company with this NIP in the registers we check.",
    nipNotFoundHint: "If it is a company, type its KRS number. If it is a public office, type its name.",
    krsNotFound: "This number is in neither the KRS business register nor the associations register.",
    krsRemoved: "The entity with KRS number {krs} has been struck off the register.",
    krsRemovedHint: "A struck-off entity has no current extract, so there is no e-Delivery address in it.",
    regonNotFound: "This REGON is not in the list of public entities or the company registers we check.",
    ceidgStatuses: {
      AKTYWNY: "active",
      ZAWIESZONY: "suspended",
      WYKRESLONY: "deregistered",
      OCZEKUJE_NA_ROZPOCZECIE_DZIALANOSCI: "not started yet",
      WYLACZNIE_W_FORMIE_SPOLKI: "only as a civil partnership",
    },
  },
};
