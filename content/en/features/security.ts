import type { FeaturePageContent } from "@/content/types";

export const securityFeature: FeaturePageContent = {
  seo: {
    title: "Security, Roles and Permissions | Opero",
    description:
      "Roles, permissions down to fields, multiple companies, API tokens and MFA. Control access to company data at the level IT departments expect.",
  },
  navLabel: "Security and permissions",
  hero: {
    eyebrow: "System features",
    title: "Security and permissions - everyone sees exactly what they should",
    description:
      "Roles, permissions, multiple companies and API tokens under control. Company data protected to the standard IT departments expect.",
    primaryCta: "Book a demo",
    secondaryCta: "See Opero in action",
  },
  intro: {
    eyebrow: "In short",
    paragraph:
      "Access in Opero is arranged from the organisation and its companies, through roles and members, down to precise permissions on modules, objects and fields. Integrations are secured with API tokens, and accounts with multi-factor authentication.",
  },
  demo: {
    kind: "security",
    roles: ["Technician", "Manager", "Accounting"],
    recordTitle: "SR/2026/019 · VoIP system outage",
    fields: [
      { label: "Client", value: "Panorama Hotel" },
      { label: "Estimated value", value: "1,800.00 PLN" },
      { label: "Internal cost", value: "940.00 PLN" },
      { label: "Confidential note", value: "Client is negotiating a framework rate" },
    ],
    buttons: ["Edit", "Approve", "Delete"],
    readOnlyLabel: "View only",
    captions: {
      technician: "One record, <b>three roles</b>",
      manager: "Confidential fields <b>mask themselves</b>",
      finance: "Buttons disappear <b>along with the permission</b>",
    },
  },
  blocks: {
    eyebrow: "What you get",
    title: "Access control from the organisation down to a single field.",
    items: [
      {
        title: "Members and roles",
        description:
          "User accounts grouped into roles that define the scope of access. Changing a role's permissions applies to everyone in it immediately.",
      },
      {
        title: "Fine-grained permissions",
        description: "Control over visibility and editing at module, object and individual field level.",
      },
      {
        title: "Organisations and companies",
        description:
          "Shared configuration, separate data per company: a capital group on one platform without mixing data.",
      },
      {
        title: "API tokens",
        description:
          "Access for integrations with a defined permission scope, issued and revoked independently of people's accounts.",
      },
      {
        title: "MFA and logs",
        description:
          "Multi-factor authentication plus a “who, what, when” event log for audit and compliance.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Next step",
    title: "Take control of access to your data.",
    description: "We will show you a role and permission model matched to your company structure.",
    primaryCta: "Book a demo",
  },
  seoText: {
    eyebrow: "More about this",
    title: "Access to your data, fully under control.",
    paragraphs: [
      "Security in Opero starts with precise access control. You set permissions from the organisation and its companies, through roles and members, down to visibility and editing at the level of a single module, object and field. Roles mean a permission change applies immediately to everyone who holds that role, and every user sees exactly what they should.",
      "Multi-company support lets you run a group of companies on one platform. Configuration is shared, but each company's operational data stays separate, so information never mixes. Integrations are secured with API tokens that carry a defined permission scope, independent of people's accounts.",
      "Multi-factor authentication (MFA) and an event log raise protection to the standard IT departments expect. A \"who, what, when\" log gives the transparency audits and compliance requirements call for.",
    ],
  },
  faq: {
    eyebrow: "Questions",
    title: "Frequently asked questions.",
    items: [
      {
        question: "How do permissions work in Opero?",
        answer:
          "Access is granted through roles, which define visibility and editing at the module, object and field level. Access can also be scoped to individual companies.",
      },
      {
        question: "Does Opero support multiple companies?",
        answer: "Yes. One organisation can run multiple companies with shared configuration and separate, isolated data.",
      },
    ],
  },
  related: {
    eyebrow: "Related features",
    title: "See also",
    items: ["integrations", "documents", "ai"],
  },
};
