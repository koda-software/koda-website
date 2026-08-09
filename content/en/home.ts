import { localizePath } from "@/lib/i18n/routes";
import type { HomeContent } from "../types";

export const homeContent: HomeContent = {
  seo: {
    title: "Koda Soft - No-Code BPM Platform Built Around Your Work",
    description:
      "Koda Soft builds Opero, a no-code BPM platform for custom business processes, workflow automation, governance, and practical AI assistance.",
  },
  hero: {
    eyebrow: "No-code BPM by Koda Soft",
    title: "Business process software that fits your operations. Not the other way around.",
    description:
      "Koda Soft builds Opero, a no-code BPM platform that helps companies model custom processes, automate workflows, govern business data, and use AI where work actually happens.",
    primaryCta: "Book a demo",
    secondaryCta: "Explore Opero",
    supportPoints: [
      "Custom records, forms, and workflows.",
      "Automation rules with practical AI assistance.",
      "Permissions, auditability, and search built for operational control.",
    ],
    visual: {
      questions: ["What are your processes?", "Who does what?", "In what order?", "What should be automated?"],
      steps: [
        {
          label: "01",
          title: "You tell us how work happens",
          description: "Processes, roles, records, handoffs, exceptions.",
        },
        {
          label: "02",
          title: "Opero maps the operating model",
          description: "Data, workflows, permissions, rules, AI assistance.",
        },
        {
          label: "03",
          title: "You get software shaped around work",
          description: "A tailored system your team can use and evolve.",
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
      "Teams build workarounds when software cannot match the way operations actually run: spreadsheets, manual approvals, disconnected tools, duplicated records, and invisible handoffs.",
    points: [
      "Processes change faster than standard ERP setups.",
      "Important records live across spreadsheets and separate tools.",
      "Manual handoffs make work slow, hard to audit, and easy to miss.",
      "AI is often separate from the workflow instead of connected to real operational context.",
    ],
  },
  solution: {
    label: "The solution",
    title: "Opero adapts around the work, not the other way around.",
    description:
      "Opero gives companies a low-code foundation for custom data, workflows, rules, roles, search, and AI-assisted actions. It turns the way people already work into structured, governable software.",
    points: [
      "Model custom operations with objects, fields, relations, and forms.",
      "Automate record changes, notifications, checks, and workflow steps.",
      "Govern access with roles, permissions, organization isolation, and audit logs.",
      "Add AI inside queries, scripts, and rules where context matters.",
    ],
  },
  pillars: {
    label: "Opero capabilities",
    title: "A no-code backbone for processes that keep changing.",
    description:
      "Opero is built as an operating layer: data models, automation, permissions, search, and AI assistance stay connected instead of becoming another set of disconnected tools.",
    items: [
      {
        title: "Model your operations",
        description:
          "Create the records, fields, forms, relationships, and modules your company actually needs.",
        capabilities: ["Custom modules and objects", "Dynamic fields and relations", "Configurable forms", "Contractor records"],
      },
      {
        title: "Automate the flow",
        description:
          "Build rules that respond to events, schedules, manual actions, and record changes.",
        capabilities: ["Triggers and rule steps", "Notifications and webhooks", "Record updates", "Execution history"],
      },
      {
        title: "Add AI where work happens",
        description:
          "Use AI to draft queries, generate scripts, summarize context, classify data, and assist workflow decisions.",
        capabilities: ["AI-assisted saved queries", "Script planning", "AI rule steps", "Configurable LLM providers"],
      },
      {
        title: "Govern with confidence",
        description:
          "Keep business data controlled, searchable, auditable, and scoped to the right organization and roles.",
        capabilities: ["Roles and permissions", "Audit logs", "Organization isolation", "API tokens and search"],
      },
    ],
  },
  workflow: {
    label: "How it works",
    title: "From messy operations to structured software.",
    description:
      "Koda Soft approaches Opero as a product-grade system for modeling reality first, then turning that model into dependable workflows.",
    steps: [
      {
        label: "01",
        title: "Map",
        description: "Identify the records, workflows, roles, approvals, and handoffs that run the business.",
      },
      {
        label: "02",
        title: "Model",
        description: "Turn them into configurable data structures, forms, relationships, and operational screens.",
      },
      {
        label: "03",
        title: "Automate",
        description: "Add rules, notifications, record updates, schedules, scripts, webhooks, and AI assistance.",
      },
      {
        label: "04",
        title: "Govern",
        description: "Control access, preserve auditability, and keep operations visible through search and lists.",
      },
      {
        label: "05",
        title: "Improve",
        description: "Adapt the system as the company changes instead of starting another custom build from scratch.",
      },
    ],
  },
  ai: {
    label: "Practical AI",
    title: "AI belongs inside the workflow, not in a separate tab.",
    description:
      "Opero is built to use AI where operational context already exists: queries, rules, scripts, records, and decisions. That keeps assistance connected to the data, permissions, and processes that matter.",
    points: [
      "Draft a saved query from a business question.",
      "Generate or plan a script for computed values.",
      "Summarize record context inside a workflow.",
      "Classify or transform data during a rule execution.",
      "Assist yes/no decisions with a controlled prompt.",
    ],
    chat: {
      assistantPrompt: "How can I help you?",
      userRequest: "I need a report of the 5 top selling products from last week.",
      assistantReply: "Sure. Here is the report based on your sales records.",
      reportTitle: "Top products - last week",
      statusLabel: "ready",
      scopeLabel: "governed",
      footer: "Assistance stays attached to records, rules, permissions, and the next workflow action.",
      inputPlaceholder: "Ask about records, reports, rules...",
      sendLabel: "Send",
      tableHeaders: ["Product", "Units", "Revenue"],
      tableRows: [
        ["Hydraulic set A", "184", "$42.8k"],
        ["Service kit Pro", "139", "$31.4k"],
        ["Control module X2", "112", "$28.1k"],
        ["Sensor pack", "96", "$19.6k"],
        ["Mounting frame", "81", "$17.9k"],
      ],
    },
  },
  useCases: {
    label: "Where it fits",
    title: "For operations that outgrow off-the-shelf software.",
    description:
      "Opero starts with the shape of your work, then gives Koda Soft a durable foundation to configure, automate, and extend it.",
    items: [
      {
        title: "Contractor and partner operations",
        description:
          "Manage external entities with structured records, contacts, addresses, documents, statuses, custom fields, and related workflows.",
      },
      {
        title: "Custom operational records",
        description:
          "Build the objects and forms your company needs when standard ERP modules do not match the process.",
      },
      {
        title: "Approvals and internal workflows",
        description:
          "Automate handoffs, notifications, record updates, scheduled checks, and decision points.",
      },
      {
        title: "Search and operational visibility",
        description:
          "Find built-in and custom business data across records, modules, contractors, dictionaries, and custom fields.",
      },
    ],
  },
  trust: {
    label: "Built by Koda Soft",
    title: "Software-house expertise, product-grade execution.",
    description:
      "Koda Soft builds Opero with the discipline of a software engineering company: flexible architecture, maintainable systems, controlled permissions, inspectable automation, and performance-conscious delivery.",
    points: [
      "Architecture for configurable operations.",
      "Governance through permissions, roles, and audit logs.",
      "Inspectable automation with execution history.",
      "Product thinking backed by real engineering work.",
    ],
  },
  finalCta: {
    eyebrow: "Start with the workflow",
    title: "Build software around the way your company actually works.",
    description:
      "See how Koda Soft and Opero can turn your operations into flexible, governed, AI-assisted business software.",
    primaryCta: "Book a demo",
    secondaryCta: "Explore Opero",
  },
};

export const homeCtas = {
  primary: localizePath("en", "contact"),
  secondary: localizePath("en", "opero"),
};
