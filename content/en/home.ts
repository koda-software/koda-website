import { localizePath } from "@/lib/i18n/routes";
import type { HomeContent } from "../types";

export const homeContent: HomeContent = {
  seo: {
    title: "No-Code BPM Platform for Processes and Documents",
    description:
      "Opero is a no-code BPM platform: processes and workflow, document management, automation, reports and permissions. Build your system without a developer.",
  },
  hero: {
    eyebrow: "No-code BPM by KodaSoft",
    title: "Turn the way you work into software",
    description:
      "Opero is a no-code BPM platform where you model your own processes, run document workflow, automate repetitive steps and keep company data under control. With no code written.",
    primaryCta: "Book a demo",
    secondaryCta: "Explore Opero",
    supportPoints: [
      "Custom objects, forms and processes shaped around your company.",
      "Automation, reports and an AI assistant on your own data.",
      "Permissions, document workflow and a full history of changes.",
    ],
    visual: {
      questions: ["What are the processes?", "Who owns what?", "In what order?", "What is worth automating?"],
      steps: [
        {
          label: "01",
          title: "You tell us how the company works",
          description: "Processes, roles, records, approvals, exceptions.",
        },
        {
          label: "02",
          title: "Opero turns it into a system",
          description: "Data, processes, permissions, rules, AI support.",
        },
        {
          label: "03",
          title: "You get a system that fits the work",
          description: "Tailored software your team keeps developing.",
        },
      ],
      magicLabel: "Opero mapping",
      mappingItems: ["Data model", "Workflows", "Access rules", "Automation"],
      outcomeItems: ["Tailored workspace", "Clear ownership", "Governed process", "System that evolves"],
    },
    assistantDemo: {
      buttonLabel: "Open Opero assistant",
      popupTitle: "Opero assistant",
      typingLabel: "Typing",
      scenarios: [
        {
          label: "Sales insight",
          dashboardTitle: "Sales operations",
          dashboardMetric: "45 sales",
          dashboardDetail: "Top 3 team result",
          messages: [
            {
              speaker: "assistant",
              text: "Hello, how can I help you?",
            },
            {
              speaker: "user",
              text: "Hi, how many sales did Jack make last month, and how does he compare to other people?",
            },
            {
              speaker: "assistant",
              text: "Jack made 45 sales last month, which puts him in the top 3 across all employees.",
            },
          ],
        },
        {
          label: "New module",
          dashboardTitle: "Branch visitors",
          dashboardMetric: "Visitors",
          dashboardDetail: "New module draft",
          messages: [
            {
              speaker: "user",
              text: "I need a way to track a visitor list in all our branches.",
            },
            {
              speaker: "assistant",
              text: "Sure. I created a Visitors module with fields for name, surname, and signature. Want me to add anything else?",
            },
            {
              speaker: "user",
              text: "Yes, add a reason for visit.",
            },
            {
              speaker: "assistant",
              text: "You got it. Reason for visit has been added.",
            },
          ],
        },
        {
          label: "Morning report",
          dashboardTitle: "Service devices",
          dashboardMetric: "Daily report",
          dashboardDetail: "Email rule active",
          messages: [
            {
              speaker: "user",
              text: "I need to have a report of all devices ready for repair on my email every morning.",
            },
            {
              speaker: "assistant",
              text: "Sure. I set up a report and a rule that will send it to you every morning.",
            },
          ],
        },
      ],
    },
  },
  problem: {
    label: "The problem",
    title: "Real companies do not work in fixed templates.",
    description:
      "When the system cannot keep up with real work, teams build workarounds: spreadsheets, approvals over email, scattered tools, duplicated records and handoffs that no process ever sees.",
    points: [
      "Processes change faster than a standard ERP can be reconfigured.",
      "Key data drifts apart across spreadsheets and separate tools.",
      "Documents circulate over email, so nobody knows whose desk a case is on.",
      "AI runs beside the system, with no access to real company context.",
    ],
  },
  solution: {
    label: "The solution",
    title: "Opero adapts to the way your company works.",
    description:
      "Instead of fitting the company to predefined modules, you design your own objects, processes and views in visual configuration. Data, document workflow, automation and permissions all stay in one system.",
    points: [
      "Model your own data with objects, fields, relations and forms.",
      "Route documents through approval, with file versions kept on the case.",
      "Automate repetitive steps with rules, scripts and SQL queries.",
      "Control access with roles, field-level permissions and an event log.",
    ],
  },
  pillars: {
    label: "What Opero can do",
    title: "A no-code foundation for processes that keep changing.",
    description:
      "Opero works as your company's operating layer: the data model, processes, document workflow, automation, reports and permissions stay connected instead of becoming more separate tools.",
    items: [
      {
        title: "Design without code",
        description:
          "Create custom objects, fields, forms, layouts and menus shaped around how the company actually works.",
        capabilities: [
          "Custom objects and modules",
          "More than 20 field types",
          "Forms and layouts",
          "Dictionaries and custom lists",
        ],
      },
      {
        title: "Run processes and documents",
        description:
          "Model flows of work as stages and transitions, route documents through approval and keep file versions with the case.",
        capabilities: [
          "Stages, transitions and tasks",
          "Kanban boards",
          "Document workflow and assignment",
          "Document templates",
        ],
      },
      {
        title: "Automate and analyse",
        description:
          "Rules take over the repetitive steps, while reports and dashboards show the current state with no export to spreadsheets.",
        capabilities: [
          "Rule engine and scripts",
          "SQL queries",
          "Reports and dashboards",
          "AI assistant on your data",
        ],
      },
      {
        title: "Stay in control",
        description:
          "Permissions reach down to a single field, and integrations keep regulatory compliance inside the same system.",
        capabilities: [
          "Roles and field permissions",
          "Many companies in one org",
          "KSeF and e-Delivery",
          "API tokens, MFA and logs",
        ],
      },
    ],
  },
  workflow: {
    label: "How it works",
    title: "From scattered operations to a system you can govern.",
    description:
      "KodaSoft approaches Opero as a product-grade layer: first we get a clear picture of how the company works, then we turn it into dependable, governed processes.",
    steps: [
      {
        label: "01",
        title: "Identify",
        description:
          "Name the records, processes, roles, approvals and handoffs that actually run the company.",
      },
      {
        label: "02",
        title: "Model",
        description:
          "Turn them into custom objects, fields, forms, relations and operational views.",
      },
      {
        label: "03",
        title: "Automate",
        description:
          "Add rules, notifications, scheduled checks, integrations and AI support where they save real time.",
      },
      {
        label: "04",
        title: "Govern",
        description:
          "Set roles and permissions, keep a trail of changes and surface the state of operations in reports and search.",
      },
      {
        label: "05",
        title: "Evolve",
        description:
          "Change the configuration as the company changes, instead of commissioning the next system from scratch.",
      },
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
      assistantPrompt: "How can I help?",
      userRequest: "I need a report of the 5 best-selling products from last week.",
      assistantReply: "Sure. Here is the report built from your sales records.",
      reportTitle: "Top products - last week",
      statusLabel: "ready",
      scopeLabel: "governed",
      footer: "Answers always stay tied to the records, rules and the user's own permissions.",
      inputPlaceholder: "Ask about records, reports, rules...",
      sendLabel: "Send",
      tableHeaders: ["Product", "Units", "Revenue"],
      tableRows: [
        ["Hydraulic kit A", "184", "42.8k"],
        ["Service pack Pro", "139", "31.4k"],
        ["Control module X2", "112", "28.1k"],
        ["Sensor bundle", "96", "19.6k"],
        ["Mounting frame", "81", "17.9k"],
      ],
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
  trust: {
    label: "Built by KodaSoft",
    title: "Software house experience, product-grade delivery.",
    description:
      "KodaSoft builds Opero with engineering discipline: flexible architecture, maintainable code, controlled permissions, inspectable automation and a deliberate approach to performance.",
    points: [
      "Architecture built for configurable processes, not one fixed template.",
      "Control based on roles, permissions and an event log.",
      "Automation you can test before rollout.",
      "Product thinking backed by solid engineering.",
    ],
  },
  finalCta: {
    eyebrow: "Start with the process",
    title: "Build software around how your company actually works.",
    description:
      "Show us one process that lives in email and spreadsheets today. You will see what it looks like in Opero.",
    primaryCta: "Book a demo",
    secondaryCta: "Explore Opero",
  },
};

export const homeCtas = {
  primary: localizePath("en", "contact"),
  secondary: localizePath("en", "opero"),
};
