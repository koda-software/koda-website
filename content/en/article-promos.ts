import type { ArticlePromoCopy } from "@/content/types";

/** Opero feature banners an editor picks per article in the "Promowana funkcja" field. */
export const articlePromos: ArticlePromoCopy = {
  "obieg-faktur-ksef": {
    name: "KSeF invoices straight into the workflow",
    description:
      "Opero downloads purchase invoices from KSeF and turns each one into a cost invoice with the data from the XML. Nobody retypes anything, and every invoice gets an owner and a deadline.",
  },
  "sciezki-akceptacji": {
    name: "Approval by amount and role",
    description:
      "The path depends on the amount and type of cost, and every approver gets a task with a deadline. An invoice without a description can't move on, and the history records every decision.",
  },
  "projektant-procesow": {
    name: "A process drawn on a canvas",
    description:
      "You draw stages, transitions and conditions like a diagram, and Opero runs every case by them. The process owner changes it, without a developer.",
  },
  "zadania-i-kanban": {
    name: "My tasks and a kanban board",
    description:
      "Everyone sees their own tasks with deadlines, and the team sees all the work on one board. Entering a process stage creates the task for a person or role by itself.",
  },
  "rejestr-dokumentow": {
    name: "A document as a record, not a file",
    description:
      "Every document has a number, an owner, a stage and its files in one place. You can see who has it and what comes next, without searching inboxes and drives.",
  },
  "podglad-plikow": {
    name: "File preview next to the form",
    description:
      "A scan or PDF opens next to the record without downloading, and file versions stay in the history. Access to files follows the record's permissions.",
  },
  "szablony-dokumentow": {
    name: "PDF documents from record data",
    description:
      "Generate a contract, report or summary from a template, with the data filled in for you. The finished PDF is attached to the record, by hand or by a rule.",
  },
  "powiadomienia-o-terminach": {
    name: "A signal before the deadline passes",
    description:
      "A rule reminds about a date on the record, for example 30 days before a contract ends, and notifies the right person. The system tracks deadlines, not someone's memory.",
  },
  "reguly-automatyzacji": {
    name: "Rules: when a condition is met, take an action",
    description:
      "A rule sets a field, sends a notification, creates a record or calls a webhook. You can dry-run it first, and every run is kept in a log.",
  },
  "zapytania-sql-i-bloki": {
    name: "SQL and custom blocks when configuration isn't enough",
    description:
      "SQL queries feed lists, reports and option fields, and HTML blocks show data where you need it. All on the data that's already in Opero.",
  },
  "rejestr-zamiast-arkusza": {
    name: "Your own register instead of a spreadsheet",
    description:
      "An object with typed fields, dictionaries and relations replaces the spreadsheet, and its definition gives you the list, the form and the API. No developer, no separate database.",
  },
  "formularze-per-rola": {
    name: "One record, a different form for each role",
    description:
      "The technician sees their fields, accounting sees theirs, and the manager sees everything. You lay out the form in sections and tabs, without copying data.",
  },
  "formularz-publiczny": {
    name: "A customer form that opens a case",
    description:
      "A customer fills in a form on your website without logging in, and the request becomes a record with an owner and a stage. Nothing to copy over from email.",
  },
  "strona-startowa": {
    name: "A home page with what matters today",
    description:
      "Each team starts the day on its own page: the tasks, numbers and lists that concern it. You build pages from blocks, without a developer.",
  },
  "platforma-no-code": {
    name: "A system that fits your company, without an IT project",
    description:
      "You configure objects, forms, processes and reports yourself, and make a change on the day you need it. No building a system from scratch.",
  },
  "raporty-z-drazeniem": {
    name: "Click a number and see its records",
    description:
      "Reports and dashboards run on live data, and every total leads to the rows behind it. One definition instead of two spreadsheets with different answers.",
  },
  "lejek-sprzedazy": {
    name: "Sales opportunities under control",
    description:
      "Every opportunity has a stage, an owner and a next step, and a report shows the pipeline and the ones nobody has touched. You build it on your own object, with your own stages.",
  },
  "historia-zmian": {
    name: "Who changed what, and when",
    description:
      "The record history keeps every field change with the old and new value, and the process history keeps every decision. A year later you can reconstruct the case without asking around.",
  },
  "uprawnienia-do-pol": {
    name: "Access down to a single field",
    description:
      "Roles decide who sees and edits which object, record and field. When someone can't see something, access diagnostics show why.",
  },
  "wiele-spolek": {
    name: "Several companies in one organization",
    description:
      "Each company keeps its own data and permissions, while shared processes, dictionaries and reports are set up once. No separate system for each company.",
  },
  "api-i-webhooki": {
    name: "API and webhooks to your ERP and accounting",
    description:
      "An open API and webhooks called from rules connect Opero with your ERP, accounting and other tools. There are no ready-made connectors; you build the connection once.",
  },
  "asystent-ai": {
    name: "AI that knows your system",
    description:
      "An AI assistant connected through MCP answers questions about live data and configures Opero in conversation, with your role's permissions. MCP access is an optional licence module.",
  },
};
