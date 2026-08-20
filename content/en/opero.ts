import { localizePath } from "@/lib/i18n/routes";
import type { OperoProductContent } from "../types";

export const operoProductContent: OperoProductContent = {
  seo: {
    title: "Opero - low-code BPM and document workflow",
    description:
      "Opero combines processes and workflow, document management, no-code configuration, low-code automation, reports, permissions and contextual AI.",
  },
  hero: {
    eyebrow: "Opero product",
    title: "A low-code BPM platform for companies with custom processes.",
    description:
      "Opero turns the way your company works into a working system: workflows, documents, automation, reports and permissions under one roof. You configure it visually, and reach for code only where it genuinely pays off.",
    primaryCta: "Book a demo",
    secondaryCta: "Explore solutions",
    configDemo: {
      rule: {
        triggerLabel: "When this happens",
        triggerTitle: "Record created",
        triggerChip: "Service request",
        stepsLabel: "Then do this",
        steps: [
          { title: "Condition", detail: "priority = critical" },
          { title: "Update record", detail: "Urgent = Yes" },
          { title: "Log entry", detail: "Request flagged as urgent" },
        ],
        addStep: "Add step",
      },
      script: {
        title: "Script",
        chip: "Option filter",
        run: "Run",
        resultTime: "finished in 12 ms",
        field: "record.priority",
        values: ["critical", "high"],
      },
      query: {
        title: "SQL query",
        chip: "Requests above value",
        run: "Run",
        paramValue: "1000",
        sql: { columns: "number, title, client, value", table: "requests", field: "value", param: "min_value" },
        columns: ["Number", "Title", "Client", "Value"],
        rows: [
          ["SR/2026/016", "Backup and data migration", "Kowalski Furniture", "4,200.00"],
          ["SR/2026/012", "Laptop battery replacement", "Lex Law Firm", "3,200.00"],
          ["SR/2026/019", "VoIP phone system outage", "Panorama Hotel", "1,800.00"],
        ],
      },
      captions: {
        rule: "<b>A rule</b>: a trigger and steps, without a line of code",
        ruleDone: "Three steps, and the logic runs on <b>every record</b>",
        script: "<b>A script</b>, when the logic needs to be smarter",
        scriptDone: "Run it and <b>see the result instantly</b>",
        query: "<b>An SQL query</b>: your data, your calculations",
        summary: "Rule, script, query: <b>three levels of one platform</b>",
      },
    },
  },
  overview: {
    eyebrow: "What Opero is",
    title: "A configurable platform instead of off-the-shelf software.",
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
    title: "Go deeper into the area that concerns you.",
    description: "Every page shows the same thing from the inside: exactly what you get, how it looks in the system and the questions we answer most often.",
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
  ai: {
    label: "Practical AI",
    title: "AI should work inside the process, not next to it.",
    description:
      "The Opero assistant knows the structure, configuration and data of your instance, so it answers with specifics rather than generalities. Consultants use it to build configuration, and users ask about data in natural language, within their own permissions.",
    points: [
      "Building objects, forms and rules in a dialogue with the assistant.",
      "Questions about data in natural language, without clicking through views.",
      "Summaries of record context in the middle of a process.",
      "Classifying and transforming data during a rule execution.",
      "The user's permissions apply exactly as they do in normal work.",
    ],
    chat: {
      assistantName: "Opero assistant",
      userRequest: "I need a report of the 5 best-selling products from last week.",
      assistantReply: "Sure. Here is the report built from your sales records.",
      reportTitle: "Top products - last week",
      statusLabel: "ready",
      scopeLabel: "governed",
      sendLabel: "Send",
      tableHeaders: ["Product", "Units", "Revenue"],
      tableRows: [
        ["Hydraulic kit A", "184", "42.8k"],
        ["Service pack Pro", "139", "31.4k"],
        ["Control module X2", "112", "28.1k"],
        ["Sensor bundle", "96", "19.6k"],
        ["Mounting frame", "81", "17.9k"],
      ],
      captions: {
        ask: "You ask about <b>your own data</b>, not general knowledge",
        working: "The assistant reads <b>records and permissions</b>",
        report: "The answer comes back as <b>a finished report</b>",
        scope: "Always within <b>the user's permissions</b>",
      },
    },
  },
  useCases: {
    label: "Where it fits",
    title: "For processes that have outgrown off-the-shelf systems.",
    description:
      "Opero works best where the process is specific to your company yet still has to be governed, searchable and ready for an audit.",
    items: [
      {
        title: "Document workflow and approvals",
        description:
          "Route letters, invoices and requests through assignment, review and approval, with file versions and a full history on the case.",
      },
      {
        title: "Custom operational records",
        description:
          "Build objects and forms for orders, tickets, equipment or contracts when standard ERP modules do not match the process.",
      },
      {
        title: "Automating repetitive work",
        description:
          "Move manual steps into rules: numbering, notifications, deadline checks and recurring reports.",
      },
      {
        title: "Reporting without exports",
        description:
          "Collect metrics on live data and go from an aggregate number down to the individual records behind it.",
      },
    ],
  },
  workflowExample: {
    eyebrow: "Example",
    title: "A cost invoice: from arrival to report.",
    description:
      "Invoices circulating over email are a problem every company knows. Below is that same process run in Opero, step by step: from the document arriving, through approvals and deadlines, to the report for management.",
    needLabel: "What happens",
    supportLabel: "How Opero handles it",
    rows: [
      {
        need: "An invoice arrives",
        support: "You pull it in from KSeF or register it manually. A record is created immediately, with a number, counterparty and amount.",
      },
      {
        need: "It needs describing and assigning",
        support: "Assignment to a department, project or cost centre. The front office sees a different set of fields than the person reviewing it.",
      },
      {
        need: "Someone has to approve it",
        support: "An approval path that depends on the amount and the department, with a task and a deadline at every stage.",
      },
      {
        need: "The document must not get lost",
        support: "The scan and every later version of the file stay on the record: searchable, access-controlled and with a full history.",
      },
      {
        need: "The payment date is approaching",
        support: "A rule reminds the people responsible before the deadline passes, and escalates the case when nobody reacts.",
      },
      {
        need: "Management asks about costs",
        support: "A report broken down by department and month, with drill-down from the total to a single invoice.",
      },
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
    title: "Between packaged ERP and fragile workarounds.",
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
        description: "A configurable platform that adapts to your work and keeps data, processes, automation, reports and control as one coherent whole.",
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
