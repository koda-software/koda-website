import type { FeaturePageContent } from "@/content/types";

export const integrationsFeature: FeaturePageContent = {
  seo: {
    title: "Integrations and compliance in Opero - KSeF, e-Delivery, NBP, VAT, API",
    description:
      "KSeF, e-Delivery, NBP exchange rates and VAT verification work straight from the system, and an open API connects Opero with the rest of your tools.",
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
      "Opero meets Polish regulatory requirements (e-invoicing, official correspondence) and exchanges data with the outside world without separate software - compliance and integrations in one place.",
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
  related: {
    eyebrow: "Related features",
    title: "See also",
    items: ["security", "documents", "reports"],
  },
};
