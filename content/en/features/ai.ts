import type { AiPageContent, FeaturePageContent } from "@/content/types";

export const aiFeature: FeaturePageContent = {
  seo: {
    title: "Contextual AI for Business Systems",
    description:
      "Connect Claude or any MCP agent to Opero and describe what you need. It builds blocks, rules and views with your real data, within your permissions.",
  },
  navLabel: "Contextual AI",
  hero: {
    title: "Say what you need. Opero builds it.",
    description: "Connect your AI agent to Opero and build blocks, rules and views by describing them, with your real data and permissions.",
    primaryCta: "Book a demo",
    secondaryCta: "See Opero in action",
  },
  intro: { paragraph: "Your AI agent connects to Opero, works with your real configuration and data, and builds what you describe." },
  blocks: {
    title: "Ask, build, keep.",
    items: [
      { title: "Ask", description: "Answers from the current data in your system." },
      { title: "Build", description: "Blocks, rules, forms and pages configured in a conversation." },
      { title: "Keep", description: "Results that stay in Opero and fetch fresh data." },
    ],
  },
  finalCta: { title: "Tell us one thing you would like to see in your system.", description: "We will build it in the demo.", primaryCta: "Book a demo" },
  seoText: {
    title: "AI that works inside your system.",
    paragraphs: ["Opero connects to AI agents through MCP, so the agent works with your configuration and data within your permissions."],
  },
  faq: {
    title: "Frequently asked questions.",
    items: [{ question: "Do I chat with the AI inside Opero?", answer: "No. You connect Claude or any other MCP agent to Opero. The conversation happens in the agent and the results live in Opero." }],
  },
  related: { title: "See also", items: ["noCode", "lowCode", "reports"] },
};

export const aiPage: AiPageContent = {
  hero: {
    title: "Say what you need. Opero builds it.",
    description:
      "Contextual AI for your business system: connect Claude or any other MCP agent to Opero and describe a view, a rule or a report in plain words. It works with your real objects, fields and permissions, so what it builds lands inside your system and stays there.",
    primaryCta: "Book a demo",
    trust: ["Your choice of AI model", "Acts with your own permissions", "Validated before it saves", "No code to write"],
    demo: {
      sentence: [
        { text: "Show the " },
        { text: "last 5 invoices", key: "invoices" },
        { text: " for this " },
        { text: "client", key: "client" },
        { text: ". Flag " },
        { text: "overdue", key: "overdue" },
        { text: " ones. Add a " },
        { text: "reminder", key: "reminder" },
        { text: " button." },
      ],
      sendLabel: "Send message",
      tags: { client: "Contractor", invoices: "Sales invoices", overdue: "Due date before today", reminder: "Rule: payment reminder" },
      page: {
        breadcrumb: "Contractors",
        title: "Hotel Panorama",
        status: "Active",
        fields: [
          { label: "City", value: "Kraków" },
          { label: "Account owner", value: "Anna Nowak" },
          { label: "Payment terms", value: "14 days" },
        ],
      },
      block: {
        title: "Last 5 invoices",
        asOf: "As of 4 Nov",
        columns: ["Invoice", "Due", "Amount"],
        rows: [
          { number: "FV/2026/1184", due: "12 Nov", amount: "4,200 PLN" },
          { number: "FV/2026/1147", due: "28 Oct", amount: "6,240 PLN", overdue: true },
          { number: "FV/2026/1102", due: "14 Oct", amount: "3,860 PLN" },
          { number: "FV/2026/1069", due: "2 Oct", amount: "12,180 PLN", overdue: true },
          { number: "FV/2026/1031", due: "18 Sep", amount: "2,950 PLN" },
        ],
        overdueLabel: "Overdue",
        totalLabel: "Total overdue",
        total: 18420,
        currency: "PLN",
        thousandsSeparator: ",",
        action: { before: "Send ", word: "reminder" },
      },
    },
  },
  problem: {
    title: "A regular AI chat cannot see your system.",
    points: [
      "It has no access to your data, so you paste it in by hand.",
      "It does not know your fields and processes, so you explain them every time.",
      "It can only give advice. Someone still has to build the result in your system.",
    ],
    solution: "Connected to Opero, the agent sees your data, knows your setup and builds the result itself.",
    demo: {
      manual: {
        label: "Agent without Opero",
        messages: [
          { from: "you", text: "Which invoices from Hotel Panorama are overdue?" },
          { from: "agent", text: "I can't access your system. Could you upload an export?" },
          {
            from: "you",
            text: "Here you go.",
            files: [
              { name: "invoices_2026.csv", kind: "sheet" },
              { name: "payments_oct.xlsx", kind: "sheet" },
            ],
          },
          { from: "agent", text: "That file is too large. Please split it into smaller parts." },
          {
            from: "you",
            text: "Three parts.",
            files: [
              { name: "invoices_1.csv", kind: "sheet" },
              { name: "invoices_2.csv", kind: "sheet" },
              { name: "invoices_3.csv", kind: "sheet" },
            ],
          },
          { from: "agent", text: "Thanks! Which column is the due date, and how are paid invoices marked?" },
          {
            from: "you",
            text: "\"Termin\". Status Z means paid, see the screenshots.",
            files: [
              { name: "invoice-form.png", kind: "image" },
              { name: "status-list.png", kind: "image" },
            ],
          },
          { from: "agent", text: "The total overdue is 62.40 PLN." },
          { from: "you", text: "It says 6 240,00. That's six thousand." },
          { from: "agent", text: "You're right, sorry! Is \"Hotel Panorama\" the same client as \"Panorama Sp. z o.o.\"?" },
          {
            from: "you",
            text: "Yes. Here is the client list.",
            files: [{ name: "contractors.csv", kind: "sheet" }],
          },
          { from: "agent", text: "Thanks! Based on the export from 28 Oct, 2 invoices look overdue. The data may have changed since, so please double-check." },
        ],
      },
      connected: {
        label: "Agent connected to Opero",
        question: "Which invoices from Hotel Panorama are overdue?",
        steps: ["Found contractor Hotel Panorama", "Read its sales invoices", "Compared due dates with today"],
        answer: "2 invoices are overdue.",
        rows: [
          { number: "FV/2026/1147", due: "Due 28 Oct", amount: "6,240 PLN" },
          { number: "FV/2026/1069", due: "Due 2 Oct", amount: "12,180 PLN" },
        ],
        total: { label: "Total overdue", amount: "18,420 PLN" },
      },
    },
  },
  signature: {
    title: "Watch a conversation turn into a working part of your system.",
    steps: [
      { title: "You ask", description: "\"On the contractor page, add a panel with open tickets, the ones past SLA and a button to assign a technician.\"" },
      { title: "It finds your system in your words", description: "Contractor, ticket, block, the assignment rule. Your sentence is matched to what actually exists in your Opero." },
      { title: "It builds and checks", description: "A query, HTML, styling and the rule behind the button are written, previewed against real data and validated before anything is saved." },
      { title: "It is live", description: "The panel sits on the contractor page with real data. The button opens the rule, already filled in." },
    ],
    demo: {
      system: {
        label: "Available features",
        tiles: [
          { name: "Contractors", match: true },
          { name: "Deals" },
          { name: "Projects" },
          { name: "Invoices" },
          { name: "Tickets", match: true },
          { name: "Contracts" },
          { name: "Assets" },
          { name: "Blocks", match: true },
          { name: "Documents" },
          { name: "Forms" },
          { name: "Reports" },
          { name: "Rules", match: true },
        ],
      },
      layers: ["Query", "Block"],
      rule: {
        label: "Rules",
        steps: [
          { title: "Trigger", detail: "Run manually" },
          { title: "Assign technician", detail: "Set assignees" },
          { title: "Notify technician", detail: "Send notification" },
          { title: "Notify manager", detail: "Send notification" },
        ],
        onError: "On error",
      },
      page: {
        breadcrumb: "Contractors",
        title: "Hotel Panorama",
        status: "Active",
        fields: [
          { label: "Tax ID", value: "677-000-00-00" },
          { label: "Address", value: "ul. Widokowa 12" },
          { label: "City", value: "Kraków" },
          { label: "Account owner", value: "Anna Nowak" },
          { label: "Payment terms", value: "14 days" },
          { label: "Credit limit", value: "50,000 PLN" },
          { label: "Segment", value: "Hospitality" },
          { label: "Contact", value: "Piotr Wrona" },
          { label: "Customer since", value: "2021" },
        ],
        billing: {
          title: "Billing",
          fields: [
            { label: "Currency", value: "PLN" },
            { label: "Payment method", value: "Bank transfer" },
            { label: "VAT", value: "Active payer" },
            { label: "Invoicing", value: "Monthly" },
            { label: "Discount", value: "5%" },
            { label: "Reminders", value: "After 7 days" },
          ],
        },
        notes: {
          title: "Notes",
          text: "Service visits are best booked before 10:00. Reception hands out the access keys.",
        },
      },
      block: {
        title: "Open tickets",
        rows: [
          { number: "HD-2291", title: "Air conditioning, room 214", sla: "Past SLA", late: true },
          { number: "HD-2288", title: "Lift inspection overdue", sla: "Past SLA", late: true },
          { number: "HD-2276", title: "Key card reader, lobby", sla: "3 h left" },
        ],
        summary: "2 past SLA",
        action: "Assign technician",
      },
      dialog: {
        title: "Run rule: assign technician",
        fields: [
          { label: "Ticket", value: "HD-2291" },
          { label: "Technician", value: "Marek Zieliński" },
        ],
        confirm: "Run rule",
      },
    },
    noteTitle: "Everything it made stays open to you.",
    note: "You can read and change all of it, the same way you would anything else in Opero. Nothing is a black box.",
    cta: "See it on your own data",
  },
  acts: [
    {
      number: "01",
      title: "Ask about your data like you would ask a colleague.",
      description: "Your AI agent reads the current data in Opero, limited to what your role can see. You get real names, amounts and dates from your records, not a generic summary.",
      demo: {
        note: "Read just now, with your permissions",
        tools: {
          blocks: "Blocks",
          catalog: "Service catalog",
          comments: "Comments",
          companies: "Companies",
          contractors: "Contractors",
          cost_invoices: "Cost invoices",
          custom_fields: "Custom fields",
          custom_lists: "Custom lists",
          custom_objects: "Custom objects",
          dictionaries: "Dictionaries",
          documents: "Documents",
          email_templates: "Email templates",
          emails: "Emails",
          forms: "Forms",
          layouts: "Layouts",
          logs: "Logs",
          menus: "Menus",
          pages: "Pages",
          reports: "Reports",
          rules: "Rules",
          sales_invoices: "Sales invoices",
          saved_queries: "Saved queries",
          scripts: "Scripts",
          sql_lists: "SQL lists",
          tasks: "Tasks",
          themes: "Themes",
          tickets: "Tickets",
          workflows: "Workflows",
        },
        questions: [
          {
            question: "Can we promise the Tarnów bakery a new oven by Friday?",
            reply: "Yes: the team is free on Tuesday and it takes 3 days. But Piekarnia Orzech owes 2 invoices, so check with accounts first.",
            clues: [
              { words: "Tarnów bakery", tries: ["companies", "custom_lists", "dictionaries"], tool: "contractors", result: "Piekarnia Orzech" },
              { words: "new oven", tries: ["custom_objects", "documents", "forms"], tool: "catalog", result: "Install takes 3 days" },
              { words: "by Friday", tries: ["workflows", "comments", "tickets"], tool: "tasks", result: "Team free on Tuesday" },
              { words: "promise", tries: ["reports", "saved_queries", "cost_invoices"], tool: "sales_invoices", result: "2 invoices overdue" },
            ],
          },
          {
            question: "Why did Hotel Panorama stop paying after the March visit?",
            reply: "At the visit we promised a free repair, then invoiced it anyway. They have paid nothing since, so a correction should fix it.",
            clues: [
              { words: "Hotel Panorama", tries: ["companies", "dictionaries", "custom_objects"], tool: "contractors", result: "Client found" },
              { words: "stop paying", tries: ["cost_invoices", "reports", "saved_queries"], tool: "sales_invoices", result: "Unpaid since March" },
              { words: "March visit", tries: ["workflows", "documents", "custom_lists"], tool: "tasks", result: "Service visit, 14 Mar" },
              { words: "Why", tries: ["comments", "tickets", "email_templates"], tool: "emails", result: "Repair promised free" },
            ],
          },
          {
            question: "Who is likely to leave us this quarter, and why?",
            reply: "Auto Serwis Nowak. Orders are down a third, the contract ends next month, they asked about notice and 2 complaints are still open.",
            clues: [
              { words: "likely", tries: ["saved_queries", "sales_invoices", "contractors"], tool: "reports", result: "9 ordering less" },
              { words: "this quarter", tries: ["documents", "custom_fields", "custom_lists"], tool: "custom_objects", result: "3 contracts ending" },
              { words: "leave us", tries: ["email_templates", "comments", "tasks"], tool: "emails", result: "1 asked about notice" },
              { words: "why", tries: ["workflows", "forms", "logs"], tool: "tickets", result: "2 open complaints" },
            ],
          },
        ],
      },
    },
    {
      number: "02",
      title: "Describe the change. It configures the platform for you.",
      description: "Objects, fields, forms, layouts, rules, workflows, custom blocks and pages. The AI agent works with the platform's own rules and validates each change, so you review a result instead of a draft.",
      configure: {
        mcp: "Opero MCP",
        asset: {
          title: "Combi oven",
          fields: [
            { label: "Serial number", value: "RX-2291" },
            { label: "Status", value: "In use" },
            { label: "Location", value: "Tarnów bakery" },
            { label: "Purchase date", value: "12 Mar 2025" },
          ],
          added: { label: "Warranty end", value: "Not set yet" },
        },
        ticket: {
          title: "Walk-in freezer down",
          fields: [
            { label: "Client", value: "Hotel Panorama" },
            { label: "Status", value: "New" },
            { label: "Assigned to", value: "Service team" },
          ],
          moved: { label: "Priority", value: "High" },
        },
        invoices: {
          title: "Sales invoices",
          columns: ["Number", "Client", "Amount"],
          added: "Days overdue",
          rows: [
            { cells: ["FV/114", "Hotel Panorama", "4,200 PLN"], overdue: "12" },
            { cells: ["FV/118", "Piekarnia Orzech", "8,950 PLN"], overdue: "3" },
            { cells: ["FV/121", "Auto Serwis Nowak", "2,300 PLN"], overdue: "0" },
          ],
        },
        requests: [
          { request: "Add a warranty end date to Assets and show it on the form", steps: ["Adds Warranty end to Assets", "Puts it on the asset form"] },
          { request: "Move Priority to the top of the ticket form and make it required", steps: ["Moves Priority to the top", "Marks it as required"] },
          { request: "Add a days overdue column to the invoice list", steps: ["Adds the new column", "Works it out from each due date"] },
        ],
      },
    },
  ],
  connect: {
    title: "Three steps, and you are talking to your system.",
    steps: [
      { title: "Connect your agent to Opero", description: "Add Opero to Claude or any other agent that supports MCP. MCP access is an optional licence module." },
      { title: "Sign in as yourself", description: "The connection acts as you, with exactly your role's permissions. MFA and SSO requirements still apply." },
      { title: "Say what you need", description: "Your AI agent reads your configuration and live data, and builds what you describe." },
    ],
    demo: {
      agent: "Your agent",
      opero: "Opero",
      add: { title: "Add a connector", detail: "Connects over MCP", button: "Add" },
      signIn: { title: "Sign in to Opero", initials: "MW", name: "Marta W.", note: "With your role's permissions", button: "Allow" },
      done: { title: "Connected", placeholder: "Say what you need" },
    },
  },
  trust: {
    title: "It works because it knows where it is.",
    items: [
      { title: "It knows your model", description: "Objects, fields, relations, forms and rules of your own system, not general knowledge about software." },
      { title: "It checks before it saves", description: "Changes are validated first, and a block change that would break a page using it is refused." },
      { title: "It respects permissions", description: "It sees and changes exactly what your role allows. The same limits as clicking in Opero.", securityLink: "How Opero handles permissions" },
      { title: "It is yours to edit", description: "What it builds is standard Opero configuration that you can open and adjust." },
    ],
  },
  proof: {
    title: "We use Opero MCP ourselves, and we love it.",
    description: "The connection described on this page is not a roadmap item or a lab experiment. It is how we work with Opero at KodaSoft.",
  },
  prompts: {
    title: "If you can say it, you can ask for it.",
    groups: [
      {
        title: "Find something out",
        items: ["Who hasn't paid us this month?", "Which clients haven't heard from us in 30 days?", "How much did we invoice last quarter?", "What is still open for Hotel Panorama?"],
      },
      {
        title: "Change what you see",
        items: ["Show a client's last 5 invoices on their page", "Add a warranty date to our assets", "Flag contracts that are about to end", "Move Priority to the top of the form"],
      },
      {
        title: "Stop doing it by hand",
        items: ["Tell me when a deal goes over 50,000 PLN", "Remind clients before an invoice is due", "Send critical tickets to whoever is on call", "Ask for approval on purchases over 5,000 PLN"],
      },
      {
        title: "See the big picture",
        items: ["Make a start page for the service team", "Give me a weekly overview of new orders", "Compare this year's sales with last year's", "Show who has the most open tickets"],
      },
    ],
  },
  faq: {
    title: "Frequently asked questions.",
    items: [
      { question: "Do I chat with the AI inside Opero?", answer: "No. You connect Claude or any other MCP agent to Opero. The conversation happens in the agent, and what it builds lives in Opero, where your team uses it without opening the chat." },
      { question: "Which AI agents work with Opero?", answer: "Any agent that supports MCP, for example Claude." },
      { question: "Which AI model is used, and where is my data processed?", answer: "That is your choice. Opero provides the MCP connection, and you decide which agent and model to use with it. The data the agent reads is processed wherever the agent you chose runs." },
      { question: "Who can use it?", answer: "MCP access is an optional licence module. With it, any user can connect an agent and ask about live data, within their own permissions. Building configuration is for consultants, administrators and users with an administrative licence." },
      { question: "Can the AI see data my role cannot see?", answer: "No. The connection acts as the signed-in user, with exactly that user's permissions, in the organizations they belong to." },
      { question: "Can it break my configuration?", answer: "Changes are validated before they are saved, and layouts go through a draft and an explicit publish. A block change that would break a page using it is refused. A saved block change goes live on every page that uses it at once, so review block changes before you save them." },
      { question: "Can I edit what it built?", answer: "Yes. It is standard Opero configuration. A custom block is HTML, CSS and queries that you can open and change yourself, or ask the agent to change." },
      { question: "Do I need to know how to code?", answer: "No. You describe what you need in plain words. Developers can go further by editing the code directly." },
    ],
  },
  related: {
    title: "See also",
    items: [
      { feature: "noCode", title: "No-code platform", description: "The objects, forms and pages your AI agent configures for you." },
      { feature: "lowCode", title: "Low-code and automation", description: "Rules, scripts and SQL queries behind more advanced logic." },
      { feature: "reports", title: "Reports and dashboards", description: "Pivot tables and charts with drill-down, shown on a page." },
    ],
  },
  finalCta: {
    title: "Tell us one thing you would like to see in your system.",
    description: "Bring a panel you are missing, a rule you keep applying by hand or a report you rebuild every month. In the demo we build it in front of you.",
    primaryCta: "Book a demo",
    secondaryCta: "Contact us",
  },
  seoText: {
    title: "AI that works inside your business system.",
    paragraphs: [
      "Contextual AI in Opero means an AI agent that works with the structure and data of your own system. You connect Claude or any other MCP agent to Opero and sign in as yourself. From then on the agent knows your objects, fields, forms and rules, and it acts within your permissions. You choose the agent and the model, so you also decide where your data is processed.",
      "Consultants and administrators use it to configure the platform in a conversation: objects, forms, layouts, rules, workflows, custom blocks and pages, each validated before saving. A custom block is a piece of HTML with its own queries, placed on record pages and custom pages. It fetches current data each time the page renders and can refresh on a timer or live.",
      "Anyone with the MCP module can also ask the agent about live data, within their own role. What gets built stays in Opero as ordinary configuration, and the rest of the team uses it in their daily work without opening the chat.",
    ],
  },
};
