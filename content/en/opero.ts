import { localizePath } from "@/lib/i18n/routes";
import type { OperoProductContent } from "../types";

export const operoProductContent: OperoProductContent = {
  seo: {
    title: "Opero - No-Code BPM Platform for Custom Processes",
    description:
      "Explore Opero, a no-code BPM platform for custom operational data, workflows, automation, governance, and practical AI assistance.",
  },
  hero: {
    eyebrow: "Opero product",
    title: "No-code BPM for companies with custom processes.",
    description:
      "Opero helps Koda Soft model the records, workflows, permissions, automation, and AI-assisted actions that match how a company actually works.",
    primaryCta: "Book a demo",
    secondaryCta: "Explore solutions",
    diagramItems: ["Records", "Forms", "Workflows", "Rules", "Search", "Governance"],
  },
  overview: {
    eyebrow: "What Opero is",
    title: "A configurable operating layer, not another fixed template.",
    paragraphs: [
      "Standard ERP starts with predefined modules. Opero starts with the company operating model: the records people manage, the handoffs they repeat, the approvals they need, and the exceptions that shape real work.",
      "The product connects custom data, workflow structure, automation, AI assistance, search, permissions, and auditability in one place. That matters because flexible software becomes risky when control is separate from configuration.",
      "Opero is built for companies that need software shaped around their operations, but still want a system that can be governed, searched, automated, and improved over time.",
    ],
  },
  features: {
    eyebrow: "Feature depth",
    title: "What Opero can model, automate, and control.",
    description:
      "Each part of Opero is designed to support real operational detail without turning into a loose collection of disconnected tools.",
    rows: [
      {
        title: "Operational data model",
        description:
          "Create the record types your company actually uses, from service cases and assets to visits, approvals, contractors, requests, and internal process objects.",
        supports: ["Custom objects and modules", "Fields and relations", "Dictionaries and statuses", "Contractor records"],
      },
      {
        title: "Forms and record screens",
        description:
          "Capture the right information for each process through structured forms and record views that can reflect the data, ownership, files, and related context a team needs.",
        supports: ["Process-specific forms", "Linked records", "Files and notes", "Record layouts"],
      },
      {
        title: "Workflow structure",
        description:
          "Represent how work moves through the company: ownership, handoffs, approvals, status changes, internal requests, and operational steps that need to stay visible.",
        supports: ["Steps and statuses", "Approvals and handoffs", "Ownership", "Operational checklists"],
      },
      {
        title: "Automation rules",
        description:
          "Use rules to respond to events, schedules, manual actions, and record changes. Opero can update records, send notifications, trigger webhooks, and preserve execution history.",
        supports: ["Event triggers", "Scheduled actions", "Notifications and webhooks", "Execution history"],
      },
      {
        title: "Search and visibility",
        description:
          "Make custom operational data usable by helping teams find built-in and custom records, related entities, dictionaries, fields, and process context.",
        supports: ["Global operational search", "Custom data lists", "Related records", "Searchable dictionaries"],
      },
      {
        title: "AI-assisted work",
        description:
          "Use AI where the work already has context: query drafting, report generation, script planning, summaries, classification, and controlled decision support.",
        supports: ["Saved query drafting", "Report assistance", "Script planning", "Summaries and classification"],
      },
      {
        title: "Governance",
        description:
          "Keep flexibility under control with roles, permissions, organization boundaries, API tokens, and audit logs attached to the same operating model.",
        supports: ["Roles and permissions", "Organization isolation", "Audit logs", "API tokens"],
      },
    ],
  },
  connectedModel: {
    eyebrow: "Connected model",
    title: "The same model powers data, process, automation, and control.",
    description:
      "Opero is valuable because these parts stay connected. A workflow knows the record. A rule can act on the same data. AI can work with operational context. Permissions and auditability remain attached.",
    layers: [
      { label: "Data model", detail: "Objects, fields, relations, dictionaries, and contractors." },
      { label: "Workflow layer", detail: "Statuses, owners, approvals, and operational steps." },
      { label: "Automation layer", detail: "Rules, schedules, notifications, updates, and webhooks." },
      { label: "AI assistance", detail: "Queries, reports, scripts, summaries, and classification." },
      { label: "Governance", detail: "Roles, permissions, audit logs, and organization boundaries." },
    ],
  },
  contractorExample: {
    eyebrow: "Example",
    title: "Contractor and partner operations.",
    description:
      "A company can structure external relationships in Opero instead of spreading contractor data across files, spreadsheets, inboxes, and separate tools.",
    needLabel: "Need",
    supportLabel: "Opero supports",
    rows: [
      { need: "Store partner records", support: "Contractor profiles, contacts, addresses, and statuses." },
      { need: "Track extra data", support: "Custom fields, dictionaries, and process-specific record attributes." },
      { need: "Manage documents", support: "Linked files, notes, and record context in the same workspace." },
      { need: "Move work forward", support: "Statuses, handoffs, approvals, notifications, and follow-up actions." },
      { need: "Keep control", support: "Roles, permissions, organization boundaries, and audit logs." },
    ],
  },
  implementation: {
    eyebrow: "Configuration approach",
    title: "Configured around the company operating model.",
    steps: [
      {
        title: "Map",
        description: "Identify the records, roles, handoffs, approvals, exceptions, and data ownership that shape the business process.",
        supports: ["Records", "Roles", "Handoffs"],
      },
      {
        title: "Model",
        description: "Turn that operating model into objects, fields, forms, relations, screens, permissions, and searchable data.",
        supports: ["Objects", "Forms", "Permissions"],
      },
      {
        title: "Automate",
        description: "Add rules, notifications, scheduled checks, record updates, webhooks, scripts, and AI-assisted actions where they fit.",
        supports: ["Rules", "Notifications", "AI assistance"],
      },
      {
        title: "Improve",
        description: "Adjust fields, workflows, automations, and views as the company changes instead of rebuilding the system from scratch.",
        supports: ["Iteration", "Visibility", "Control"],
      },
    ],
  },
  comparison: {
    eyebrow: "Where it fits",
    title: "Between rigid ERP and fragile workarounds.",
    columns: [
      {
        label: "Standard ERP",
        description: "Useful when the company fits predefined modules, but hard to bend around unusual records, handoffs, and process exceptions.",
      },
      {
        label: "Spreadsheets and separate tools",
        description: "Flexible at first, but difficult to govern, search, automate, and audit as operational complexity grows.",
      },
      {
        label: "One-off custom software",
        description: "Tailored to a moment in time, but often expensive to evolve when workflows, roles, and reporting needs change.",
      },
      {
        label: "Opero",
        description: "A configurable operating layer that can match custom work while keeping data, automation, governance, and AI connected.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Book a demo",
    title: "If your process is specific, your software should be able to understand it.",
    description:
      "Show Koda Soft how your company works. We will show how Opero can model the data, workflows, controls, and AI assistance around it.",
    primaryCta: "Book a demo",
    secondaryCta: "Explore solutions",
  },
};

export const operoProductCtas = {
  primary: localizePath("en", "contact"),
  secondary: localizePath("en", "solutions"),
};
