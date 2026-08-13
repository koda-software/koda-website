import type { FeaturePageContent } from "@/content/types";

export const processesFeature: FeaturePageContent = {
  seo: {
    title: "Workflow and BPM Process System | Opero",
    description:
      "Design a flow of work as a process: stages, transitions, tasks and kanban. Automate approvals and procedures without code. See workflow in Opero.",
  },
  navLabel: "Processes and workflow",
  hero: {
    eyebrow: "System features",
    title: "Processes and workflow - the whole company runs on your rules",
    description:
      "Design every flow of work as a process. Approvals, document routing and procedures move through defined stages, so nothing gets lost between departments.",
    primaryCta: "Book a demo",
    secondaryCta: "See Opero in action",
  },
  intro: {
    eyebrow: "In short",
    paragraph:
      "Opero is a process engine in which a record moves through stages and transitions (for example New → In progress → Approved → Closed). The process enforces order, permissions and deadlines, and every run stays in the history.",
  },
  demo: {
    kind: "processes",
    columns: ["New", "In progress", "For approval", "Closed"],
    focusCard: { number: "SR/2026/019", title: "VoIP system outage" },
    otherCards: [
      { number: "SR/2026/017", title: "CRM training session" },
      { number: "SR/2026/016", title: "Backup and data migration" },
      { number: "SR/2026/013", title: "Laptop battery replacement" },
    ],
    tasksLabel: "My work",
    task: { title: "Complete the request", meta: "Mark Wilson · today" },
    approvalLabel: "Awaiting approval",
    approveLabel: "Approve",
    rejectLabel: "Reject",
    captions: {
      board: "A record travels <b>through process stages</b>",
      task: "A task lands <b>on the right person’s list</b>",
      approval: "Approval moves it <b>to the next column</b>",
      done: "The process <b>runs itself</b>",
    },
  },
  blocks: {
    eyebrow: "What you get",
    title: "A process that enforces order, permissions and deadlines.",
    items: [
      {
        title: "Processes (workflow)",
        description:
          "You model a flow as stages and transitions, with conditions and permissions on every step. Changing the process design does not require a developer.",
      },
      {
        title: "Tasks and kanban boards",
        description:
          "Each stage generates tasks assigned to people, with the option to reassign. Work is visible on a kanban board and in “my tasks” lists.",
      },
      {
        title: "Custom objects carry the process",
        description:
          "You attach a process to any object (Request, Order, Contract), so the flow covers exactly the data you already have.",
      },
      {
        title: "Forms per stage",
        description:
          "At every stage you decide what the user sees and can change. One set of fields for the requester, another for the approver.",
      },
      {
        title: "History and replay",
        description:
          "A full trail of who changed what and when, plus the ability to follow a run step by step.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Next step",
    title: "Map your first process in Opero.",
    description: "We will show you how to move a flow out of email and spreadsheets into one controlled process.",
    primaryCta: "Book a demo",
  },
  seoText: {
    eyebrow: "More about this",
    title: "A workflow system that enforces order and deadlines.",
    paragraphs: [
      "Opero is a workflow system that turns every process in your company into a repeatable, controlled flow. A record moves through defined stages and transitions while the system enforces order, permissions and deadlines. Instead of decisions scattered across email and spreadsheets, you get one place that shows which stage a case is at, who owns it and what happened before.",
      "Business process management (BPM) in Opero does not require a developer. You design a flow visually: add stages, connect them with transitions, set conditions and the people responsible. Entering a stage opens a task, and the team's work lines up on a kanban board and in \"my tasks\" lists. Request approvals, invoice flow, ticket handling or quality procedures all work exactly the way you describe them.",
      "Because you attach a workflow to any custom object, the flow covers your company's own data rather than a schema imposed by the system. A full history and the ability to replay a run give you the order that both audits and daily work require.",
    ],
  },
  faq: {
    eyebrow: "Questions",
    title: "Frequently asked questions.",
    items: [
      {
        question: "What is a workflow in Opero?",
        answer:
          "It is a defined flow of work made of stages and transitions that a record (such as a request or ticket) moves through. Opero enforces order, permissions, tasks and deadlines at every stage.",
      },
      {
        question: "Does building a process require a developer?",
        answer: "No. Processes are designed visually, without code, and changing them does not require a development rollout.",
      },
    ],
  },
  related: {
    eyebrow: "Related features",
    title: "See also",
    items: ["documents", "noCode", "lowCode"],
  },
};
