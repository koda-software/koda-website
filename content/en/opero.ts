import { localizePath } from "@/lib/i18n/routes";
import type { OperoProductContent } from "../types";

export const operoProductContent: OperoProductContent = {
  seo: {
    title: "Opero - BPM, no-code and document workflow",
    description:
      "Opero combines processes and workflow, document management, a no-code platform, automation, reports, permissions, integrations and contextual AI in one system.",
  },
  hero: {
    eyebrow: "Opero product",
    title: "A no-code BPM platform for companies with custom processes.",
    description:
      "Opero turns the way your company works into a working system: workflows, documents, automation, reports and permissions in one place, with no code written.",
    primaryCta: "Book a demo",
    secondaryCta: "Explore solutions",
    diagramItems: ["Custom objects", "Forms and layouts", "Processes", "Rules", "Reports", "Permissions"],
  },
  overview: {
    eyebrow: "What Opero is",
    title: "A configurable platform, not another fixed template.",
    paragraphs: [
      "Standard ERP starts with predefined modules and expects the company to adapt to them. Opero starts with how you actually work: the records you manage, who approves what, where a case moves between departments, and which exceptions happen often enough to deserve a place in the system.",
      "You design the data structure, the views and the navigation in visual configuration. On top of that come processes built on stages and transitions, document workflow, a rule engine, reports and precise permissions. All on one data model, in one platform.",
      "It is built for companies that have outgrown spreadsheets and off-the-shelf modules but do not want software written from scratch. The configuration changes together with the company, not with the next development project.",
    ],
  },
  features: {
    eyebrow: "Feature depth",
    title: "Eight areas that add up to one system.",
    description:
      "Each area solves a specific operational problem, but all of them run on the same data, permissions and processes.",
    rows: [
      {
        title: "Processes and workflow (BPM)",
        description:
          "You model a flow of work as stages and transitions, with conditions, deadlines and the people responsible. Each stage generates tasks, and the team's work lines up on a kanban board and in “my tasks” lists.",
        supports: ["Stages and transitions", "Tasks and kanban", "Approvals and reassignment", "Full run history"],
      },
      {
        title: "Document workflow and files",
        description:
          "A document gets its own record, an approval path and a complete set of versioned files. Contracts, letters and decisions are generated from templates straight out of record data, always in the current version.",
        supports: ["Registration and numbering", "Assignment and approvals", "File versioning", "Document templates"],
      },
      {
        title: "No-code platform",
        description:
          "Custom objects and more than 20 field types describe the data, forms and layouts build the views, and menus and custom pages arrange the navigation. Structure changes go through a safe draft.",
        supports: ["Custom objects and fields", "Forms and layouts", "Menus and custom pages", "Dictionaries and custom lists"],
      },
      {
        title: "Low-code and automation",
        description:
          "The rule engine works on a condition-then-action basis: set a field, create a record, send a notification, block a transition. Rules are tested before rollout, so automation stays predictable.",
        supports: ["Event triggers", "Action steps and schedules", "Scripts and SQL queries", "Execution history"],
      },
      {
        title: "Reports and analytics",
        description:
          "Aggregations, charts and dashboards run on live system data, with no export to spreadsheets. Drill-down leads from an aggregate number to the records behind it.",
        supports: ["Reports and charts", "Team dashboards", "Drill-down to records", "SQL queries as a source"],
      },
      {
        title: "Security and permissions",
        description:
          "Access is arranged from the organisation and its companies, through roles, down to the visibility of a single field. Integrations are secured with API tokens and accounts with multi-factor authentication.",
        supports: ["Roles and field permissions", "Many companies in one org", "API tokens and MFA", "Event log"],
      },
      {
        title: "Integrations and compliance",
        description:
          "KSeF, e-Delivery, NBP exchange rates and VAT verification work straight from the system, and an open API connects Opero with the rest of your tools in both directions.",
        supports: ["KSeF and e-Delivery", "NBP exchange rates", "VAT white list and VIES", "Open API"],
      },
      {
        title: "Contextual AI",
        description:
          "The assistant knows the structure, configuration and data of your instance. Consultants use it to build configuration, users ask about data in natural language, and permissions apply exactly as they do in normal work.",
        supports: ["AI during configuration", "Questions about data", "Record summaries", "Permissions apply to AI"],
      },
    ],
  },
  featureLinks: {
    eyebrow: "System features",
    title: "Every area has its own page.",
    description: "Go deeper where you need the detail: exactly what you get and what it looks like inside the system.",
  },
  connectedModel: {
    eyebrow: "Connected model",
    title: "The same model powers data, process, automation and control.",
    description:
      "Opero is valuable because these parts stay connected. A process knows the record. A rule acts on the same data. A report counts it without an export. AI works from the same context, and permissions apply everywhere the same way.",
    layers: [
      { label: "Data model", detail: "Custom objects, fields, relations, dictionaries and lists." },
      { label: "Processes", detail: "Stages, transitions, tasks, approvals and history." },
      { label: "Automation", detail: "Rules, scripts, SQL queries and notifications." },
      { label: "Reports", detail: "Aggregations, charts, dashboards and drill-down." },
      { label: "Permissions", detail: "Roles, field access, companies, API tokens and logs." },
    ],
  },
  contractorExample: {
    eyebrow: "Example",
    title: "Counterparties and partners in one place.",
    description:
      "Instead of keeping counterparty data across files, spreadsheets and inboxes, you run it as a custom object with the full context: documents, an approval flow and VAT verification.",
    needLabel: "Need",
    supportLabel: "How it works in Opero",
    rows: [
      { need: "A counterparty record", support: "Profiles, contacts, addresses, statuses and custom fields matched to the process." },
      { need: "A check before the deal", support: "VAT number verification against the white list and VIES straight from the record." },
      { need: "Documents with the case", support: "Contracts and letters linked to the record, versioned and searchable." },
      { need: "Moving the case forward", support: "Stages, approvals, tasks, notifications and the next steps of the process." },
      { need: "Access control", support: "Roles, field permissions, separation by company and an event log." },
    ],
  },
  implementation: {
    eyebrow: "How the configuration is built",
    title: "A system shaped around the way you work.",
    steps: [
      {
        title: "Map",
        description: "We name the records, roles, approvals, handoffs and exceptions that actually shape the process in your company.",
        supports: ["Records", "Roles", "Approvals"],
      },
      {
        title: "Model",
        description: "We turn that into custom objects, fields, forms, layouts, permissions and data that can be searched.",
        supports: ["Objects", "Forms", "Permissions"],
      },
      {
        title: "Automate",
        description: "We add rules, notifications, scheduled checks, integrations, reports and AI support where they genuinely save time.",
        supports: ["Rules", "Integrations", "Reports"],
      },
      {
        title: "Evolve",
        description: "You change the configuration as the company changes: a new field, a new process stage or a new report needs no development project.",
        supports: ["New fields", "New stages", "New reports"],
      },
    ],
  },
  comparison: {
    eyebrow: "Where it fits",
    title: "Between rigid ERP and fragile workarounds.",
    columns: [
      {
        label: "Standard ERP",
        description: "Works when the company fits the predefined modules. It is harder to adapt to unusual records, exceptions and industry-specific processes.",
      },
      {
        label: "Spreadsheets and separate tools",
        description: "Flexible at the start, but as complexity grows they become hard to govern, search, automate and audit.",
      },
      {
        label: "Software written from scratch",
        description: "Fitted to one moment in time, but every change to a workflow, role or report means another development project.",
      },
      {
        label: "Opero",
        description: "A configurable platform that adapts to your work and keeps data, processes, automation, reports and control in one place.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Book a demo",
    title: "If your process is specific, the software should be able to understand it.",
    description:
      "Tell us how your company works. We will show you live how Opero models that data, those processes, documents and permissions.",
    primaryCta: "Book a demo",
    secondaryCta: "Explore solutions",
  },
};

export const operoProductCtas = {
  primary: localizePath("en", "contact"),
  secondary: localizePath("en", "solutions"),
};
