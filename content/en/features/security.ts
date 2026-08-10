import type { FeaturePageContent } from "@/content/types";

export const securityFeature: FeaturePageContent = {
  seo: {
    title: "Security and permissions in Opero - roles, companies, API tokens",
    description:
      "Roles and permissions down to module, object and field level, many companies in one organisation, API tokens, multi-factor authentication and event logs.",
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
  related: {
    eyebrow: "Related features",
    title: "See also",
    items: ["integrations", "documents", "ai"],
  },
};
