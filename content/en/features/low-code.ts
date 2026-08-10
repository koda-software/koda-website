import type { FeaturePageContent } from "@/content/types";

export const lowCodeFeature: FeaturePageContent = {
  seo: {
    title: "Low-code and automation - rules, scripts and SQL in Opero",
    description:
      "A rule engine built on “when a condition is met, run these steps”, a script engine and parameterised SQL queries. Automate decisions and data processing.",
  },
  navLabel: "Low-code and automation",
  hero: {
    eyebrow: "System features",
    title: "Low-code and automation - logic that works for you",
    description:
      "Where configuration is not enough, rules, scripts and SQL queries take over. You automate decisions and data processing without building a separate system.",
    primaryCta: "Book a demo",
    secondaryCta: "See Opero in action",
    shot: {
      src: "/features/low-code-automatyzacje-hero.webp",
      width: 2000,
      height: 861,
      caption: "A rule: event, then action steps",
      alt: "Rule editor in Opero: a \"Record created\" trigger at the top, a numbered list of action steps below",
    },
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
  shots: {
    eyebrow: "What it looks like",
    title: "Automation you verify before rollout.",
    items: [
      {
        src: "/features/low-code-automatyzacje-sql.webp",
        width: 2000,
        height: 899,
        caption: "A query with parameters and its result",
        alt: "SQL query editor in Opero with the query on the left and a result table below",
      },
    ],
  },
  finalCta: {
    eyebrow: "Next step",
    title: "Automate the repetitive work.",
    description: "See how rules and scripts take over the manual steps your team does today.",
    primaryCta: "Book a demo",
  },
  related: {
    eyebrow: "Related features",
    title: "See also",
    items: ["processes", "reports", "noCode"],
  },
};
