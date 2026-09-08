import type { FeaturePageContent, NoCodePageContent } from "@/content/types";

export const noCodeFeature: FeaturePageContent = {
  seo: {
    title: "The No-Code System Your Company Needs | Opero",
    description:
      "Build custom business applications without code: model your data with custom objects and fields, design forms and layouts, configure menus and dashboards, and publish safely.",
  },
  navLabel: "No-code platform",
  hero: {
    eyebrow: "System features",
    title: "No-code system your company needs.",
    description: "Configure objects, forms, menus and dashboards visually in Opero.",
    primaryCta: "Book a demo",
    secondaryCta: "Meet Opero",
  },
  intro: { eyebrow: "In short", paragraph: "Build complete business applications through visual configuration." },
  blocks: {
    eyebrow: "What you get",
    title: "One application, configured around the company.",
    items: [
      { title: "Data", description: "Custom modules, objects, fields and relationships." },
      { title: "Views", description: "Forms and layouts for every working context." },
      { title: "Navigation", description: "Focused menus for each team and company." },
      { title: "Pages", description: "Dashboards, reports, tasks and intake forms." },
    ],
  },
  finalCta: { eyebrow: "Next step", title: "Show us what you need to manage.", description: "We will model it in Opero.", primaryCta: "Book a demo" },
  seoText: {
    eyebrow: "More about no-code",
    title: "Business applications without a development project.",
    paragraphs: ["Opero combines configurable data, views, navigation and pages in one governed application."],
  },
  faq: {
    eyebrow: "Questions",
    title: "Frequently asked questions.",
    items: [
      { question: "Can I build an application without a developer?", answer: "Yes. Opero's core application-building tools use visual configuration." },
    ],
  },
  related: { eyebrow: "Related features", title: "See also", items: ["processes", "lowCode", "reports"] },
};

export const noCodePage: NoCodePageContent = {
  labels: { screenshotPlaceholder: "Screenshot placeholder" },
  hero: {
    eyebrow: "Opero no-code platform",
    title: "No-code system your company needs.",
    description:
      "Opero already has the foundations every business application shares: data, forms, permissions, files and history. You configure the part that is yours, from objects and forms to menus and dashboards, and publish. No code, no development project.",
    primaryCta: "Book a demo",
    secondaryCta: "Meet Opero",
    image: {
      src: "/opero/no-code/view-layout-hero.webp",
      alt: "Opero view layout builder configuring the Asset Lifecycle Admin form in a dark workspace",
      width: 2111,
      height: 1316,
    },
  },
  foundation: {
    eyebrow: "A different way to build",
    title: "Custom does not have to mean custom-built.",
    description:
      "A system tailored to a company usually means a development project. Someone has to build the data layer, the screens, the permissions, the tests, and then maintain every change for years. Most of that work is identical in every company. Opero provides it once. What is left is the part that is actually yours: what the system keeps track of, how it looks to each team and where people start their day.",
    comparison: {
      traditional: {
        title: "Build from scratch in...",
      },
      opero: {
        title: "Configure in Opero in...",
      },
      groups: [
        {
          rows: [
            {
              title: "Data model",
              detail: "Objects, fields, relations",
              traditional: { label: "You build it from scratch", meta: "2–4 weeks", mode: "build" },
              opero: { label: "You configure", meta: "Few hours", mode: "configure" },
            },
            {
              title: "Screens",
              detail: "Forms and layouts per team",
              traditional: { label: "You build it from scratch", meta: "3–6 weeks", mode: "build" },
              opero: { label: "You configure", meta: "Few hours", mode: "configure" },
            },
            {
              title: "Navigation",
              detail: "Menus per team and company",
              traditional: { label: "You build it from scratch", meta: "1–2 weeks", mode: "build" },
              opero: { label: "You configure", meta: "Up to one hour", mode: "configure" },
            },
            {
              title: "Starting pages",
              detail: "Dashboards, counters, intake forms",
              traditional: { label: "You build it from scratch", meta: "2–4 weeks", mode: "build" },
              opero: { label: "You configure", meta: "1–2 days", mode: "configure" },
            },
            {
              title: "Automations",
              detail: "Business logic",
              traditional: { label: "You build it from scratch", meta: "4–8 weeks", mode: "build" },
              opero: { label: "You configure", meta: "Few hours", mode: "configure" },
            },
            {
              title: "Integrations",
              detail: "Third-party tools",
              traditional: { label: "You build it from scratch", meta: "4–8 weeks", mode: "build" },
              opero: { label: "You configure", meta: "Few clicks", mode: "configure" },
            },
          ],
        },
        {
          label: "The same in every company",
          rows: [
            {
              title: "Database and API",
              detail: "Storage, validation, search, lists",
              traditional: { label: "You build it from scratch", meta: "4–8 weeks", mode: "build" },
              opero: { label: "Included from day one", meta: "Ready", mode: "included" },
            },
            {
              title: "Permissions",
              detail: "Roles, companies, field-level access",
              traditional: { label: "You build it from scratch", meta: "3–5 weeks", mode: "build" },
              opero: { label: "Included from day one", meta: "Ready", mode: "included" },
            },
            {
              title: "Change history",
              detail: "Who changed what, when, and why",
              traditional: { label: "You build it from scratch", meta: "2–3 weeks", mode: "build" },
              opero: { label: "Included from day one", meta: "Ready", mode: "included" },
            },
            {
              title: "Files and documents",
              detail: "Attachments, versions, previews",
              traditional: { label: "You build it from scratch", meta: "2–4 weeks", mode: "build" },
              opero: { label: "Included from day one", meta: "Ready", mode: "included" },
            },
            {
              title: "Processes and tasks",
              detail: "Stages, assignment, deadlines",
              traditional: { label: "You build it from scratch", meta: "4–8 weeks", mode: "build" },
              opero: { label: "Included from day one", meta: "Ready", mode: "included" },
            },
            {
              title: "Notifications and comments",
              detail: "Mentions, email, in-app",
              traditional: { label: "You build it from scratch", meta: "2–3 weeks", mode: "build" },
              opero: { label: "Included from day one", meta: "Ready", mode: "included" },
            },
            {
              title: "Hosting, backups, updates",
              detail: "Security, monitoring, every upgrade",
              traditional: { label: "You build it from scratch", meta: "4–8 weeks", mode: "build" },
              opero: { label: "Cloud or on premise", meta: "Ready", mode: "included" },
            },
          ],
        },
      ],
      summaries: {
        traditional: {
          total: "6-12 months",
          description: "Every layer is yours to build, test and maintain. Each later change is a ticket for the same team.",
          tags: ["A team of backend and frontend programmers", "Project manager", "Tester", "DevOps", "Every change requires requirements gathering, estimation, development and testing"],
        },
        opero: {
          total: "Few days",
          description: "Seven layers are already there. You configure the six that describe your company, then keep adjusting them yourself.",
          tags: ["No code", "Draft, validate, publish", "Change takes only few clicks or a short chat with your favourite agentic tool, like Claude or Codex"],
        },
      },
    },
  },
  capabilities: {
    eyebrow: "Shape the system",
    title: "Four areas of configuration. One application.",
    description:
      "Data, views, navigation and pages are not separate tools. They are four views of the same configuration. A field you add today shows up in the form, in the list, in the menu filter and in the dashboard counter, because there is only one definition of it.",
    items: [
      {
        number: "01",
        eyebrow: "Model your business",
        title: "Describe what your company keeps track of.",
        description:
          "A module is a business area. Objects are what lives in it: assets, inspections, requests, suppliers. Each object gets fields from 31 types, from text and amount to file, signature, a link to another object or a generated number like INS/2026/041. Dictionaries keep choices consistent, so Severity means the same on every form.",
        bullets: [
          "Relations between objects, shown as inline tables on the record.",
          "Custom fields on built-ins too: contractors, invoices, users, budgets.",
          "Structure changes go through a draft with an impact preview before production.",
          "Dictionaries with metadata, such as a severity that carries its SLA hours.",
        ],
        visual: {
          label: "Data-model editor",
          title: "Equipment Management: Asset fields and relationships",
          image: {
            src: "/opero/no-code/data-model-fields.webp",
            alt: "Opero data-model editor showing custom Asset fields and a relationship to the Asset Category object",
            width: 1926,
            height: 1139,
          },
        },
      },
      {
        number: "02",
        eyebrow: "Shape the experience",
        title: "Design the screens each team works in.",
        description:
          "Drag fields onto a canvas. Group them in cards and columns, tuck rare details into a tab. Make a field required for the technician and optional for the manager, or show a section only when a condition is met. One object, several forms: one to report a fault, another to approve the repair.",
        bullets: [
          "Layouts for your objects and for built-ins: contractors, invoices, budgets, users.",
          "Related records as inline tables, with create and attach where you need them.",
          "Buttons, custom content and reports right on the record.",
          "Every save is a version. Preview, publish, restore in one click.",
        ],
        visual: {
          label: "View-layout builder",
          title: "Form builder beside the finished maintenance record",
          image: {
            src: "/opero/no-code/view-layout-builder.webp",
            alt: "Opero view-layout builder arranging tabs, cards, columns and Asset fields on a form canvas",
            width: 1488,
            height: 1374,
          },
        },
        reverse: true,
      },
      {
        number: "03",
        eyebrow: "Simplify the workspace",
        title: "Give every team a menu that fits its day.",
        description:
          "A menu is a tree you drag together from folders, objects, reports, pages and links. The same object can appear twice with different filters: My open requests for technicians, All requests for the lead. Set the entry point, then build a different menu for the field team, the office or an external company on the same data.",
        bullets: [
          "Folders up to three levels, renamed and reordered in place.",
          "Saved filters, columns and sorting per menu item.",
          "A separate menu per team or per company, from the same objects.",
        ],
        visual: {
          label: "Menu editor",
          title: "Maintenance team menu and the focused workspace it creates",
          image: {
            src: "/opero/no-code/menu-configuration.webp",
            alt: "Opero menu editor arranging dashboard, CRM, HR and asset navigation items beside a live menu preview",
            width: 1617,
            height: 1011,
          },
        },
      },
      {
        number: "04",
        eyebrow: "Create the right starting point",
        title: "Build the page people open first.",
        description:
          "Custom pages are built from 20 blocks: live counters, charts and pivot reports, task lists, an embedded form, files, comments, quick links and your own content. A maintenance dashboard shows overdue inspections, assets by status, this week's tasks and a Report a fault form on one screen. Every team gets its own starting page.",
        bullets: [
          "Counters and charts read live data, so nobody assembles status reports by hand.",
          "An embedded form turns a page into an intake point for the team or the whole company.",
          "Pages stay drafts until published, and every version is kept.",
        ],
        visual: {
          label: "Page builder",
          title: "Maintenance dashboard with counters, reports, tasks and an intake form",
          image: {
            src: "/opero/no-code/custom-dashboard.webp",
            alt: "Opero executive dashboard with pipeline metrics, charts and company navigation",
            width: 1985,
            height: 1467,
          },
        },
        reverse: true,
      },
    ],
  },
  process: {
    eyebrow: "And then, put it in motion",
    title: "Attach a process to any object.",
    description:
      "A request should not just sit in a list. Add a workflow: stages, who is assigned, how many days they have, which moves are allowed. Every stage becomes a task in someone's queue and every move is recorded. Workflows are configured visually too, with templates for common approvals.",
    tracker: {
      stages: [
        {
          title: "Reported",
          detailBefore: "by ",
          emphasis: "Anna Kowalska",
          timestamp: "Mon 09:12",
          state: "complete",
        },
        {
          title: "Assigned",
          detailBefore: "to ",
          emphasis: "Marek Nowak",
          timestamp: "Mon 09:12",
          state: "complete",
        },
        {
          title: "Under repair",
          detailBefore: "with ",
          emphasis: "Marek Nowak",
          timestamp: "Tue 14:03",
          state: "active",
        },
        {
          title: "Closed",
          detailBefore: "allowed once a handover comment is added",
          timestamp: "—",
          state: "upcoming",
        },
      ],
    },
    cta: "Explore processes and workflow",
  },
  adaptation: {
    eyebrow: "Keep adapting",
    title: "Everyday improvements should not become software projects.",
    description:
      "Add an equipment category. Link an asset to its warranty provider. Make Inspection date required. Remove a menu item nobody uses. In Opero these are configuration changes: draft, see what they affect, validate, publish. Records stay intact, and the previous version is one click away.",
    bullets: [
      "Impact preview before a field is removed: which layouts, rules and queries use it.",
      "Layouts repair themselves when a field disappears, published and draft alike.",
      "Nothing reaches production until you apply the draft.",
    ],
    visual: {
      label: "Impact preview",
      title: "Schema draft, validation and safe publishing",
      image: {
        src: "/opero/no-code/schema-draft-impact.webp",
        alt: "Opero data-model draft showing a field pending deletion before the changes are published",
        width: 898,
        height: 839,
      },
    },
  },
  faq: {
    eyebrow: "Questions",
    title: "Frequently asked questions.",
    items: [
      { question: "Can I really build an application without a developer?", answer: "Yes. Objects, fields, forms, layouts, menus, pages and workflows are created in visual configuration. A person who understands the process can build a working application. Rules and scripts exist for advanced logic, but a complete application does not require them." },
      { question: "What is a custom object?", answer: "A custom object is a data definition you design yourself, similar to a table: Asset, Contract, Request. It has fields of 31 types, can be linked to other objects and can hold child objects such as line items. Opero generates its list, forms and history automatically." },
      { question: "How do changes reach production?", answer: "Through a draft. Structure changes are validated and Opero shows what they affect before you apply them. Layouts, pages and workflows are published explicitly and every version is kept, so you can restore the previous one at any time." },
      { question: "Can we start from a spreadsheet we already use?", answer: "That is the most common starting point. The columns of the sheet become fields, the tabs become objects or menu items, and the status column becomes a workflow. Bring it to the demo and we will model it live." },
      { question: "What is the difference between no-code and low-code in Opero?", answer: "No-code is the configuration described on this page and is enough for a complete application. Low-code adds rules, scripts and SQL queries on top of the same objects for logic that configuration cannot express. You reach for it only where it pays off." },
      { question: "Can other systems access what we build?", answer: "Yes. Each object can be exposed through the API with per-field control over what can be read, written, filtered and sorted. Integrations are configured, not coded into the application." },
    ],
  },
  related: {
    eyebrow: "Related features",
    title: "See also",
    items: [
      { feature: "processes", title: "Processes and workflow", description: "Stages, tasks, deadlines and kanban boards on the objects you configured." },
      { feature: "lowCode", title: "Low-code and automation", description: "Rules, scripts and SQL queries where configuration is not enough." },
      { feature: "reports", title: "Reports and dashboards", description: "Pivot tables and charts with drill-down, exported to Excel or shown on a page." },
    ],
  },
  finalCta: {
    eyebrow: "See it with your own example",
    title: "Show us what your company needs to manage.",
    description: "Bring a spreadsheet, a process that lives in email, or an idea for an internal system. In the demo we build its module, form, menu and dashboard in front of you, so you can see how it takes shape in Opero.",
    primaryCta: "Book a demo",
    secondaryCta: "Contact us",
  },
};
