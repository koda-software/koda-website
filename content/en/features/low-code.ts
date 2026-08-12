import type { FeaturePageContent } from "@/content/types";

export const lowCodeFeature: FeaturePageContent = {
  seo: {
    title: "Process Automation and Low-Code | Opero",
    description:
      "Automate decisions with rules, scripts and SQL queries. A \"condition, then action\" rule engine without building a separate system. Low-code in Opero.",
  },
  navLabel: "Low-code and automation",
  hero: {
    eyebrow: "System features",
    title: "Low-code and automation - logic that works for you",
    description:
      "Where configuration is not enough, rules, scripts and SQL queries take over. You automate decisions and data processing without building a separate system.",
    primaryCta: "Book a demo",
    secondaryCta: "See Opero in action",
  },
  intro: {
    eyebrow: "In short",
    paragraph:
      "The low-code layer in Opero runs logic on events: the rule engine reacts on a “when a condition is met, run these steps” basis, the script engine handles unusual processing, and SQL queries reach for data exactly the way you need it.",
  },
  blocks: {
    eyebrow: "What you get",
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
    eyebrow: "Next step",
    title: "Automate the repetitive work.",
    description: "See how rules and scripts take over the manual steps your team does today.",
    primaryCta: "Book a demo",
  },
  seoText: {
    eyebrow: "More about this",
    title: "Automation that takes over repetitive work.",
    paragraphs: [
      "The low-code layer in Opero automates the work that eats into your team's time today. The rule engine runs on a simple \"when a condition is met, run these steps\" basis: set a field, create a record, send a notification, block a transition in a process. You define and test rules before rollout, so automation stays predictable rather than risky.",
      "For scenarios that go beyond visual configuration, the script engine takes over. You run expression and script fragments from rules, calculated fields and templates whenever non-standard data processing is needed. That is the low-code part: you reach for code only where it actually pays off, without building a separate system.",
      "SQL queries give you full control over the data. Named, parameterised, reusable queries feed rules, reports and choice fields whenever standard filters are not enough. Together, rules, scripts and SQL turn Opero into a platform that does the repetitive work for you.",
    ],
  },
  faq: {
    eyebrow: "Questions",
    title: "Frequently asked questions.",
    items: [
      {
        question: "How does the rule engine work?",
        answer:
          "A rule is written as \"condition, then action\". When the condition is met (for example priority changes to critical), the system runs the defined steps, such as setting a field or sending a notification.",
      },
      {
        question: "Do automations require a developer?",
        answer: "Rules are built visually. Scripts and SQL queries are optional and only become useful for more complex logic.",
      },
    ],
  },
  related: {
    eyebrow: "Related features",
    title: "See also",
    items: ["processes", "reports", "noCode"],
  },
};
