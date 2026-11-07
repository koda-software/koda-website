import type { LowCodePageContent } from "@/content/feature-stories/low-code.types";
import type { FeaturePageContent } from "@/content/types";

const faq: FeaturePageContent["faq"] = {
  title: "Frequently asked questions.",
  items: [
    {
      question: "What can start a rule, and what can it do?",
      answer:
        "A rule starts from a record change, a workflow move, a date reminder, a received email, a helpdesk SLA warning, a cron schedule, a button or an external API call. It then follows the steps drawn on the canvas, from more than 50 built-in types: update records, send email, generate a document, move a workflow, call a webhook. Some triggers and steps need their module or connection to be on.",
    },
    {
      question: "Do automations require a developer?",
      answer:
        "Not for most rules. A process owner with rule permissions picks fields, operators and values on the canvas. JavaScript is needed only for a script step, and SQL only for a saved query. Expect to need someone technical for those, and for custom blocks.",
    },
    {
      question: "How do we test a rule without emailing real customers?",
      answer:
        "Keep the rule inactive and dry-run it on a real record or a past run. Conditions, scripts, templates and reads execute. Writes, sends and outside calls are captured and listed with their final values, including recipients and email text, and nothing goes into run history. A step that follows a captured step gets a placeholder instead of real output, such as a webhook's response.",
    },
    {
      question: "Can a rule wait three days and then carry on?",
      answer:
        "No. The Wait step is capped at 300 seconds. For anything later, use a date reminder: up to 5 offsets per rule, before or after a date field or a task due date. Before firing, Opero re-reads the record. If it was deleted or its date changed, the old reminder does not run, and a new date fires once on its own schedule.",
    },
    {
      question: "What if the system is down when a reminder or schedule is due?",
      answer:
        "Reminders catch up: a reminder missed during downtime fires when the sweep resumes, and a ledger stops it firing twice. Cron schedules do not. Missed minutes are reported as a limit event and never replayed, and a schedule follows the server's clock rather than each company's time zone.",
    },
    {
      question: "Can a rule end up in an endless loop?",
      answer:
        "A rule whose own change would start it again is skipped, and that run is recorded as Skipped. Calls between rules stop at a depth of 5, one step can be visited 10 times outside a loop, a loop runs 100 rounds at most, and one run is capped at 1,000 steps.",
    },
    {
      question: "Where does custom code run, and is it safe?",
      answer:
        "A rule's script step runs on the server in an isolated worker: allowlisted globals, no fetch, timers or eval, and a 5-second limit. Form and block scripts run in the user's browser. They are not a security boundary, so server validation, permissions and workflow conditions still decide what is allowed. Treat script authors as trusted administrators.",
    },
    {
      question: "Can a SQL query damage our data?",
      answer:
        "A read query runs on a read-only database role with a 10-second timeout. A writing query needs its own permission, is one INSERT, UPDATE or DELETE, must have a WHERE clause on UPDATE and DELETE, and can target only your object tables and a short list of budget and custom-field tables, so invoice tables stay read-only. It still skips rules, record history and search indexing, which makes it a tool for people who know the data.",
    },
    {
      question: "Can rules work with our other systems?",
      answer:
        "Outbound, a Call webhook step sends one request to a public host on port 80 or 443, with a 30-second timeout. A non-2xx status or a response over 1 MiB fails the step, and you can draw an error path for that. Inbound, another system can run a manual rule through the external API with a company token and read its execution history.",
    },
  ],
};

export const lowCodeFeature: FeaturePageContent = {
  seo: {
    title: "Process Automation and Low-Code",
    description:
      "Automate decisions with rules, scripts and SQL queries. A \"condition, then action\" rule engine without building a separate system. Low-code in Opero.",
  },
  navLabel: "Low-code and automation",
  navDescription: "Routine decisions, automated",
  hero: {
    title: "Low-code and automation - logic that works for you",
    description:
      "Where configuration is not enough, rules, scripts and SQL queries take over. You automate decisions and data processing without building a separate system.",
    primaryCta: "Book a demo",
    secondaryCta: "See Opero in action",
  },
  intro: {
    paragraph:
      "The low-code layer in Opero runs logic on events: the rule engine reacts on a “when a condition is met, run these steps” basis, the script engine handles unusual processing, and SQL queries reach for data exactly the way you need it.",
  },
  demo: {
    kind: "lowCode",
    conditionLabel: "Rule condition",
    condition: ["Priority", "equals", "Critical"],
    runLabel: "Save and run",
    firedLabel: "The rule fired",
    fieldEffect: { title: "A field sets itself", detail: "Urgent", from: "No", to: "Yes" },
    notificationEffect: { title: "A notification goes out", detail: "to: Mark Wilson · SMS + e-mail" },
    blockEffect: { title: "A transition is blocked", detail: "Handover report missing", transition: "Close request" },
    captions: { condition: "You assemble the condition <b>from ready-made blocks</b>", fired: "The rule fires <b>on every record</b>", summary: "Field, notification, blocked transition - <b>with no chasing</b>" },
  },
  blocks: {
    title: "Three layers of logic on your data.",
    items: [
      {
        title: "The rule engine and its steps",
        description:
          "You define conditions and a sequence of actions (set a field, create a record, send a notification, block a transition). Rules are tested before rollout, so automation stays predictable.",
      },
      {
        title: "The script engine",
        description:
          "Expression and script fragments called from rules, calculated fields and templates, for scenarios beyond visual configuration.",
      },
      {
        title: "SQL queries",
        description:
          "Named, parameterised, reusable queries that feed rules, reports and choice fields.",
      },
    ],
  },
  finalCta: {
    title: "Automate the repetitive work.",
    description: "See how rules and scripts take over the manual steps your team does today.",
    primaryCta: "Book a demo",
  },
  seoText: {
    title: "Automation that takes over repetitive work.",
    paragraphs: [
      "The low-code layer in Opero automates the work that eats into your team's time today. The rule engine runs on a simple \"when a condition is met, run these steps\" basis: set a field, create a record, send a notification, block a transition in a process. You define and test rules before rollout, so automation stays predictable rather than risky.",
      "For scenarios that go beyond visual configuration, the script engine takes over. You run expression and script fragments from rules, calculated fields and templates whenever non-standard data processing is needed. That is the low-code part: you reach for code only where it actually pays off, without building a separate system.",
      "SQL queries give you full control over the data. Named, parameterised, reusable queries feed rules, reports and choice fields whenever standard filters are not enough. Together, rules, scripts and SQL turn Opero into a platform that does the repetitive work for you.",
    ],
  },
  faq,
  related: {
    title: "See also",
    items: ["processes", "reports", "noCode"],
  },
};

export const lowCodePage: LowCodePageContent = {
  hero: {
    title: "Reminders, handovers and lookups as rules. Scripts and SQL for the rest.",
    description:
      "A contract ending on 30 June can notify its owner on 31 May and 16 June and open a renewal record, with no one checking a spreadsheet. You draw that as a rule from more than 50 built-in step types, dry-run it on a real record with nothing sent, and read each later run step by step. Where a rule stops, a script, a SQL query or a custom block works on the same data.",
    primaryCta: "Book a demo",
    secondaryCta: "Meet Opero",
    image: {
      src: "/opero/low-code/rule-canvas-hero.webp",
      alt: "Opero rule editor showing an automation drawn as a graph of trigger, condition and action steps",
      width: 2111,
      height: 1316,
    },
  },
  chores: {
    title: "Seven manual jobs and what Opero does instead.",
    description:
      "The dates and addresses are examples. The steps behind them exist today, and each row can be dry-run before it goes live.",
    todayLabel: "Today, someone is",
    insteadLabel: "In Opero",
    rows: [
      { today: "Checking a spreadsheet for contracts that end next month", instead: "A date reminder fires 30 and 14 days before the end date, at 09:00 company time. Move the date and it re-arms" },
      { today: "Forwarding mail from serwis@ to whoever handles it", instead: "A rule filtered on that mailbox, sender or subject opens a helpdesk ticket" },
      { today: "Copying company details from the registry into a new contractor", instead: "The NIP goes to REGON, and found, not found and registry error each take their own path" },
      { today: "Asking around for who is free to take the job", instead: "The workflow stage assigns within a role, by round robin or least loaded" },
      { today: "Filling in a contract template and attaching it to an email", instead: "Generate document, attach it to the record, send it with the email step" },
      { today: "Counting 3 working days from Monday 9 November by hand", instead: "The business calendar returns Friday 13 November, because 11 November is a public holiday" },
      { today: "Building the Friday numbers by hand", instead: "Cron 0 8 * * 5 runs a saved query and emails the result" },
    ],
  },
  anatomy: {
    title: "What can start a rule, what it can check, what it can do.",
    description:
      "A rule is one trigger and a graph of steps on a canvas. There are more than 50 built-in step types, and integrations add their own. Every step except Stop has an error output, so a failure can take its own path.",
    columns: [
      {
        label: "When",
        items: [
          "A record is created or updated, optionally through one form, or deleted",
          "A workflow moves, completes or changes assignees",
          "Up to 5 offsets before or after a date field or task due date",
          "An email arrives, filtered by mailbox, sender, subject or address",
          "A ticket gets an SLA warning or breach, or sits idle",
          "An invoice, budget or contractor is created or updated",
          "A five-field cron schedule, at most once a minute",
          "Someone clicks a button on a record, list or page",
          "Another system calls the external API with a company token",
        ],
      },
      {
        label: "Check",
        items: [
          "Condition, or Switch with named cases and an otherwise path",
          "Loop over a list: 25 rounds by default, 100 at most",
          "Filter, transform, sort, aggregate, remove duplicates",
          "Fetch up to 100 records, or run a saved query",
          "VAT ID in REGON (PL) or Vatly (EU, GB, CH, NO, AU)",
          "Working days and opening hours on a business calendar",
          "A prompt to OpenAI, Anthropic or Gemini on your own connection",
          "A JavaScript step with a 5-second limit",
        ],
      },
      {
        label: "Do",
        items: [
          "Create or update records, contractors and users",
          "Move a workflow or set its assignees",
          "Send an email, a notification or an SMS",
          "Reply to, update or link a stored email",
          "Generate a document and attach it to a record",
          "Create, update or answer helpdesk tickets",
          "Read an emailed invoice into a cost invoice with AI",
          "Call a webhook: 30-second timeout, public hosts only",
          "Call another rule, or wait up to 300 seconds",
        ],
      },
    ],
    note: "Helpdesk, the email client, SMS, AI and the company registry need their module or connection to be on. There is no multi-day wait: for three days later, use a date reminder.",
  },
  sentence: {
    title: "Conditions use your own fields, and closing stays a workflow decision.",
    description:
      "Example: a technician files a request with Priority = Critical. You pick the field, operator and value from your object, and the rule sets Urgent to Yes and notifies the site manager. A rule cannot stop a transition. Closing without a handover report is refused by a condition on the workflow's Close request transition, and that condition applies to rules as well as people.",
    bullets: [
      "Rules read the fields of your own objects and built-ins such as contractors, invoices and budgets.",
      "Messages and values can use templates such as {{ trigger.data.site_manager }}, or the output of an earlier step.",
      "The rule's own update does not start it again. That run is recorded as Skipped.",
    ],
    demo: {
      conditionLabel: "Rule condition",
      condition: ["Priority", "equals", "Critical"],
      runLabel: "Save and activate",
      firedLabel: "What happens next",
      fieldEffect: { title: "The rule sets Urgent to Yes", detail: "Urgent", from: "No", to: "Yes" },
      notificationEffect: { title: "The site manager is notified", detail: "to: Mark Wilson · notification + e-mail" },
      blockEffect: { title: "A workflow condition refuses the move", detail: "Handover report missing", transition: "Close request" },
      captions: {
        condition: "Field, operator and value <b>from your own object</b>",
        fired: "Runs on each <b>request that matches</b>",
        summary: "A field, a message and <b>a refused transition</b>",
      },
    },
  },
  scenarios: {
    title: "Six worked examples, step by step.",
    description:
      "The names, dates and amounts are example inputs, not customer stories or results. Each card uses only steps that exist today.",
    labels: { when: "When", check: "Check", then: "Then" },
    items: [
      {
        area: "Maintenance",
        title: "Forklift inspection due on 15 March",
        when: "Date reminder 14 days before Next inspection: 1 March at 09:00",
        check: "Filter on the reminder: Status = In service",
        then: ["Create a maintenance request for that forklift", "Notify the site manager", "If the date moves to 30 April, it fires once more on 16 April"],
      },
      {
        area: "Finance",
        title: "Supplier invoice sent to faktury@",
        when: "An email arrives in the faktury@ mailbox",
        check: "Does the email attachments step find a file?",
        then: ["AI reads it into a cost invoice, on the workflow you name", "Same seller VAT ID and invoice number: skipped by default, or set to fail or create", "Totals that do not add up give a warning, or fail the step", "Accounting gets a notification"],
      },
      {
        area: "HR",
        title: "Leave from 9 to 13 November",
        when: "An employee submits the request, with 3 days of balance left",
        check: "The business calendar counts 4 working days, because 11 November is a holiday",
        then: ["Write 4 on the request", "1 day short: notify the employee and stop", "With enough balance: move it to manager approval"],
      },
      {
        area: "Sales",
        title: "Deal won, contract and ERP order",
        when: "A deal moves to the Won stage",
        check: "Client's NIP in REGON: found, not found or registry error",
        then: ["Generate the contract and attach it to the deal", "Create the project record", "POST the order to the ERP. A non-2xx status or a 30-second timeout takes the error path and notifies sales"],
      },
      {
        area: "Production and logistics",
        title: "Keyboard part at 2 in stock, minimum 12",
        when: "The part record is updated and its stock is now 2",
        check: "Below minimum, and Fetch records finds no open purchase request?",
        then: ["Create a purchase request for 10 units", "Email the supplier named on the part"],
      },
      {
        area: "Customer service",
        title: "Priority customer's ticket near its SLA",
        when: "A helpdesk SLA warning fires on the ticket",
        check: "Is Priority contract = Yes on the contractor?",
        then: ["Raise the ticket's priority", "Add the team lead as a watcher", "Send the lead an SMS through the SMS Planet connection"],
      },
    ],
  },
  ladder: {
    title: "Rules, scripts, SQL and blocks, with the limits of each.",
    description:
      "Rules have limits worth knowing up front: a loop stops at 100 rounds, a fetch at 100 records, a wait at 300 seconds. When a job outgrows them, the next tool works on the same objects in the same organization.",
    whoLabel: "Usually",
    reachForLabel: "Reach for it when",
    steps: [
      {
        name: "Rules",
        who: "An operations lead or process owner",
        reachFor: "You can state the job as a trigger, a check and an action.",
        description: "Drawn on a canvas and saved without a release, and the next run uses the new version. Each run is limited to 1,000 steps, 10 visits to one step outside a loop and 5 levels of rules calling rules. A list longer than the loop limit fails the step before any item is processed.",
        sample: {
          label: "Rule, as it reads",
          code: "WHEN   Request created\nIF     Priority = Critical\nTHEN   Set Urgent = Yes\n       Notify {{ trigger.data.site_manager }}\n       Generate handover sheet",
        },
      },
      {
        name: "Scripts",
        who: "An analyst, power user or developer",
        reachFor: "A value has to be calculated, or a form should react as people type.",
        description: "JavaScript, in three separate places. A rule's script step runs on the server for up to 5 seconds, with no network access of its own. A form script runs in the browser, with 15 script types for defaults, options, validation and workflow hooks. A template function becomes a filter in documents and emails. A rule step holds its own code and cannot call a form script by key.",
        sample: {
          label: "Form script: compute a discount as the user types",
          code: "const { quantity, tier } = ctx.record.values;\nif (quantity == null) return undefined;\n\nreturn tier === \"gold\" && quantity >= 100 ? 12 : 5;",
        },
      },
      {
        name: "SQL queries",
        who: "Someone who knows the data",
        reachFor: "The question spans several objects and no list filter can ask it.",
        description: "A named query with typed parameters, checked with PostgreSQL EXPLAIN when you save a read query. It has a 10-second statement timeout and returns 1,000 rows by default. It can feed rules, reports, lists, dropdowns, counters and blocks.",
        sample: {
          label: "Saved query: spare parts below minimum",
          code: "select p.f_part_number as part_number,\n       p.f_stock_qty as in_stock,\n       :minimum - p.f_stock_qty as to_order,\n       round((:minimum - p.f_stock_qty) * p.f_unit_price, 2) as reorder_cost\nfrom runtime_dyn.\"dyn_spare_part_9b37ead4cc62\" p\nwhere p.f_stock_qty < :minimum\norder by p.f_stock_qty asc, reorder_cost desc",
        },
      },
      {
        name: "Custom blocks",
        who: "A developer, or an agent working with one",
        reachFor: "You need a screen the page builder has no block for.",
        description: "HTML with Liquid, CSS, up to 5 saved queries and optional JavaScript of up to 64,000 characters. It goes on a page or record next to the standard blocks, and blocks can render other blocks 3 levels deep.",
        sample: {
          label: "Custom block: parts to reorder",
          code: "<h3>Parts to reorder</h3>\n{% for p in queries.parts.rows %}\n  <div class=\"row\">\n    {{ p.part }}: {{ p.in_stock }} of 12\n    <span>{{ p.reorder_cost }}</span>\n  </div>\n{% endfor %}",
        },
      },
    ],
    closingTitle: "What all four share.",
    closing: [
      { title: "Same data", description: "Custom objects are real Postgres tables. Scripts, queries and blocks read those objects, so there is no second database to sync." },
      { title: "Same access", description: "Queries run on restricted database roles under company row security. Block buttons go through the normal permission-checked endpoints." },
      { title: "Nothing to deploy", description: "All of it is stored as your organization's configuration, with no separate server to host and no fork of Opero." },
    ],
  },
  blocks: {
    title: "Build a screen the page builder has no block for.",
    description:
      "Example: the Spare parts reorder board in the screenshot lists 8 parts below a minimum of 12, each with a stock bar and a reorder cost. It takes one saved query and ten lines of HTML and Liquid, with no JavaScript, and you preview it against a chosen company.",
    bullets: [
      "Blocks are saved in one library, so a fix reaches every page that uses the block.",
      "Five button actions: open a record, open a form, set a field, run a rule, refresh.",
      "Each query returns 100 rows by default and 500 at most. Charts take up to 2,000 points.",
      "Refresh on an interval from 30 seconds to 24 hours, or live when records change.",
      "Removing an input a page fills in, or changing its type, is refused with the affected pages listed.",
    ],
    image: {
      src: "/opero/low-code/custom-block-editor.webp",
      alt: "Opero custom block editor with HTML, queries and a live preview of the rendered block",
      width: 2000,
      height: 1400,
    },
  },
  queries: {
    title: "Ask across objects with one saved query.",
    description:
      "Example from the screenshot: with minimum = 12 in ACME Inc., part KB-MBP-INT has 2 in stock, so the query returns 10 to order and a reorder cost of 4,500.00. The same query can feed a list, a rule step and the block above.",
    consumersLabel: "One query can feed",
    consumers: ["Reports and charts", "Lists with row actions", "Dropdown options", "Page counters", "Rule steps", "Custom blocks", "Form scripts"],
    bullets: [
      "Read queries use a read-only database role, scoped to the company by row-level security.",
      "Parameters are bound, never pasted into the SQL. String, number, date, boolean and UUID types are enforced.",
      "A writing query needs its own permission and is one statement, on your object tables and a short list of budget and custom-field tables.",
      "Writing SQL skips rules, record history and search indexing. SQL also ignores owner-only record visibility, so give it to trusted authors.",
    ],
    image: {
      src: "/opero/low-code/saved-query-editor.webp",
      alt: "Opero saved query editor with a parameterised SQL statement and its result rows",
      width: 2000,
      height: 1400,
    },
  },
  trust: {
    title: "Dry-run a rule on a real record before it can send anything.",
    description:
      "A dry run executes conditions, scripts, templates and reads. Steps that would write, send or call out are captured with their final values, including email recipients and text, and nothing is saved to history. One limit: a step after a captured step gets a placeholder, so it cannot read a real webhook response.",
    items: [
      { title: "A recorded path for each run", description: "Each visit stores its status, duration, branch and output, such as Switch, 22 ms, Technical. Long outputs are cut and marked as truncated." },
      { title: "Replay after a fix", description: "Replay runs the rule on a past run's stored trigger data and logs a new execution. It has real effects, so check what it will send." },
      { title: "When a partner system is down", description: "A webhook fails on a 30-second timeout or a non-2xx status. With an error path, the run continues there. Without one it ends Failed. Opero does not alert anyone by itself, so put a notification on that path." },
      { title: "Loop limits", description: "A rule already in the chain is skipped and recorded. Limits: 5 levels of rule calls, 10 visits to a step, 1,000 steps per run." },
      { title: "When a dependency is deleted", description: "Deleting an object or module first lists the rules that use it. Rules that lose a dependency switch off with the reason shown, and rule editors are notified." },
      { title: "Finding slow rules", description: "The Performance screen attributes time to each rule, script, query and block, and flags runs over the soft limits." },
    ],
    dryRunImage: {
      src: "/opero/low-code/rule-dry-run.webp",
      alt: "Opero dry run result listing the effects a rule would have had, with nothing performed or saved",
      width: 2000,
      height: 1400,
    },
    historyImage: {
      src: "/opero/low-code/rule-run-history.webp",
      alt: "Opero rule run on the canvas with its step-by-step path and the data at each step",
      width: 2000,
      height: 1400,
    },
  },
  owners: {
    title: "What operations can change and what IT can check.",
    description:
      "The process owner edits the rule on the same canvas where the system owner reads its steps, permissions and run history. Access to each action is a separate permission, so you decide who gets which.",
    columns: [
      {
        title: "If you run the operation",
        items: [
          "Edit a rule and save it. The next run uses it, because rules have no draft stage or restorable versions.",
          "Keep a new rule inactive and dry-run it on a real record first.",
          "Open any run to see which branch a record took and what each step produced.",
          "Turn a rule off, or expose it only to selected companies.",
          "Put a manual rule behind a button on a record, list or page, with a dialog for its parameters.",
        ],
      },
      {
        title: "If you will own it technically",
        items: [
          "Rule scripts get allowlisted globals, with no fetch, timers or eval, and a 5-second cap.",
          "Form scripts run in the browser. Server validation, permissions and workflow conditions still decide.",
          "Separate permissions: org.rules.read, create, update, delete and execute, plus org.savedQueries.executeMutation.",
          "Company tokens on the external API run manual rules and read their execution history.",
          "MCP agents can validate and dry-run rules with the signed-in user's permissions.",
        ],
      },
    ],
    aiCta: "See how agents build in Opero",
  },
  faq,
  related: {
    title: "See also",
    items: [
      { feature: "processes", title: "Processes and workflow", description: "Stages, transition conditions and task assignment, with rules triggered on each move." },
      { feature: "noCode", title: "No-code platform", description: "The objects, forms, menus and pages your rules read and write." },
      { feature: "ai", title: "Contextual AI", description: "Describe a rule or a block and let an agent build it and dry-run it." },
    ],
  },
  finalCta: {
    title: "Bring one manual process and a sample record.",
    description: "Tell us who does it today, what they check and what they send. In the demo we build it as a rule, dry-run it on test data and go through what was captured. If it needs a script or a query, we show you where it goes.",
    primaryCta: "Book a demo",
    secondaryCta: "Contact us",
  },
  seoText: {
    title: "Process automation and low-code on one data model.",
    paragraphs: [
      "Opero rules start from a record change, a workflow move, a date reminder, a received email, a cron schedule, a button or an external API call. They follow a graph of steps: conditions and switches, loops of up to 100 rounds, record updates, documents, email, webhooks with a 30-second timeout. A dry run captures every write and send before a rule goes live, and each real run keeps its path step by step.",
      "When a rule is not enough, scripts, SQL and custom blocks work on the same objects. Rule scripts run on the server with a 5-second limit, while form scripts run in the browser and do not replace server validation. Saved queries run on restricted database roles with a 10-second timeout. Custom blocks add screens to pages and records using up to 5 queries each.",
    ],
  },
};
