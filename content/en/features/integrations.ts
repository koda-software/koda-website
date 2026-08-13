import type { FeaturePageContent } from "@/content/types";

export const integrationsFeature: FeaturePageContent = {
  seo: {
    title: "Integrations and Compliance: KSeF, e-Delivery | Opero",
    description:
      "KSeF, e-Delivery, NBP exchange rates and VAT checks straight from the system. An open API connects Opero with your tools, no extra software needed.",
  },
  navLabel: "Integrations and compliance",
  hero: {
    eyebrow: "System features",
    title: "Integrations and compliance - Opero as part of your ecosystem",
    description:
      "KSeF, e-Delivery, NBP exchange rates and VAT verification work straight from the system, and an open API connects Opero with the rest of your company's tools.",
    primaryCta: "Book a demo",
    secondaryCta: "See Opero in action",
  },
  intro: {
    eyebrow: "In short",
    paragraph:
      "Opero meets Polish regulatory requirements (e-invoicing, official correspondence) and exchanges data with the outside world without separate software.",
  },
  demo: {
    kind: "integrations",
    source: { name: "KSeF", subtitle: "National e-Invoice System" },
    document: { number: "FA/2026/8841", kind: "e-invoice XML" },
    recordTitle: "Cost invoice",
    fields: [
      { label: "Number", value: "CI/2026/0143" },
      { label: "Supplier", value: "Panorama Hotel Ltd." },
      { label: "Amount", value: "24,800.00 PLN" },
    ],
    apis: [
      { endpoint: "POST /api/records", direction: "external system → Opero" },
      { endpoint: "webhook: status.changed", direction: "Opero → external system" },
    ],
    captions: { arrives: "A KSeF document <b>becomes a record</b>", fields: "Fields fill in <b>with no re-typing</b>", api: "The API works <b>both ways</b>" },
  },
  blocks: {
    eyebrow: "What you get",
    title: "Requirements and data exchange handled inside the system.",
    items: [
      {
        title: "KSeF",
        description:
          "Sending and receiving structured invoices in line with mandatory e-invoicing in Poland.",
      },
      {
        title: "e-Delivery",
        description:
          "Electronic official correspondence (the equivalent of registered mail) straight from the system.",
      },
      {
        title: "NBP exchange rates",
        description:
          "Automatic retrieval of rates (Table A) for multi-currency conversions, with correct handling of non-working days.",
      },
      {
        title: "VAT verification",
        description:
          "Checking a counterparty's status (the Polish white list and VIES) before you issue a document.",
      },
      {
        title: "Open API",
        description:
          "You connect Opero with company systems in both directions, making the platform part of the ecosystem rather than another island.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Next step",
    title: "Connect Opero with your systems.",
    description: "See how compliance and integrations work without any additional software.",
    primaryCta: "Book a demo",
  },
  seoText: {
    eyebrow: "More about this",
    title: "Compliance and integrations without extra applications.",
    paragraphs: [
      "Opero meets Polish regulatory requirements and exchanges data with the outside world without separate software. The KSeF integration lets you send and receive structured invoices in line with mandatory e-invoicing, and e-Delivery brings official electronic correspondence straight into the system, with no trip to an external portal.",
      "Everyday operations are supported by further integrations. Exchange rates pulled automatically from the NBP API (Table A) feed multi-currency conversions, with correct handling of non-working days. VAT verification checks a counterparty's status on the Polish white list and in VIES before you issue a document, cutting risk and manual checking.",
      "An open API connects Opero with the rest of your company's tools in both directions, turning the platform into part of your ecosystem rather than another isolated island of data. Gathering compliance and integrations inside the platform itself shortens the path and simplifies maintenance.",
    ],
  },
  faq: {
    eyebrow: "Questions",
    title: "Frequently asked questions.",
    items: [
      {
        question: "Does Opero support KSeF?",
        answer: "Yes. Opero integrates with Poland's National e-Invoice System, sending and receiving structured invoices in line with the requirements.",
      },
      {
        question: "How does VAT verification work?",
        answer: "The system checks a counterparty's VAT number on the white list and in VIES, confirming their status before you issue a document.",
      },
    ],
  },
  related: {
    eyebrow: "Related features",
    title: "See also",
    items: ["security", "documents", "reports"],
  },
};
