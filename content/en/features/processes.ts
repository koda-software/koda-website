import type { FeaturePageContent } from "@/content/types";

export const processesFeature: FeaturePageContent = {
  seo: {
    title: "Processes and workflow (BPM) in Opero",
    description:
      "Model every flow of work as a process: stages, transitions, tasks, kanban and a full history. Approvals and procedures under control, without a developer.",
  },
  navLabel: "Processes and workflow",
  hero: {
    eyebrow: "System features",
    title: "Processes and workflow - the whole company runs on your rules",
    description:
      "Design every flow of work as a process. Approvals, document routing and procedures move through defined stages, so nothing gets lost between departments.",
    primaryCta: "Book a demo",
    secondaryCta: "See Opero in action",
    shot: {
      src: "/features/procesy-workflow-hero.png",
      width: 1968,
      height: 1082,
      caption: "An approval flow as stages and transitions",
      alt: "Process diagram in Opero with stages Gathering requirements, To do, In progress, QA and Done, linked by transitions such as \"Start work\" and \"Send for review\"",
    },
  },
  intro: {
    eyebrow: "In short",
    paragraph:
      "Opero is a process engine in which a record moves through stages and transitions (for example New → In progress → Approved → Closed). The process enforces order, permissions and deadlines, and every run stays in the history.",
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
  related: {
    eyebrow: "Related features",
    title: "See also",
    items: ["documents", "noCode", "lowCode"],
  },
};
