import type { FeaturePageContent } from "@/content/types";

export const aiFeature: FeaturePageContent = {
  seo: {
    title: "Contextual AI for Business | Opero",
    description:
      "An AI assistant that knows the structure and data of your system. Consultants build configuration with it, users ask about data in natural language.",
  },
  navLabel: "Contextual AI",
  hero: {
    eyebrow: "System features",
    title: "Contextual AI - an assistant that knows your system",
    description:
      "AI works on the structure and data of your instance, not on general knowledge about software. Consultants use it to build configuration, users ask about data in natural language.",
    primaryCta: "Book a demo",
    secondaryCta: "See Opero in action",
  },
  intro: {
    eyebrow: "In short",
    paragraph:
      "The AI assistant in Opero knows the context of your instance: the data structure, the configuration and the current records. That is why it answers with specifics rather than generalities, and the same mechanism serves two groups: consultants during configuration and end users in their daily work.",
  },
  demo: {
    kind: "ai",
    assistantName: "Opero assistant",
    contextLabel: "context: SR/2026/019",
    question: "Summarise this request and suggest a due date.",
    readingLabel: "Reading context",
    contextItems: ["Request SR/2026/019", "Process history", "Attachments (2)"],
    answer: "VoIP outage at Panorama Hotel, critical priority, technician on site since yesterday. You closed similar outages in 2 days on average — I suggest 14 Aug 2026.",
    proposalLabel: "Suggested change",
    proposalField: "Due date",
    proposalValue: "2026-08-14",
    applyLabel: "Apply",
    dismissLabel: "Dismiss",
    savedLabel: "Saved to the record",
    appliedLabel: "SR/2026/019 · Due date",
    captions: { ask: "You ask <b>in the context of a record</b>", reading: "The AI reads <b>the record, its history and files</b>", answer: "It answers and suggests <b>a concrete change</b>", applied: "You approve — and the change <b>lands in the record</b>" },
  },
  blocks: {
    eyebrow: "What you get",
    title: "One assistant, two audiences.",
    items: [
      {
        title: "Configuration AI (for consultants)",
        description:
          "Building and modifying objects, forms, rules and processes in a dialogue with the assistant, with validation before saving. Rollout speeds up because the assistant knows the rules the platform is built on.",
      },
      {
        title: "AI for end users",
        description:
          "Questions about data in natural language, record search and summaries without clicking through views.",
      },
      {
        title: "Permissions apply to AI too",
        description:
          "The assistant sees exactly as much as the user's role allows. The same access scope covers questions about data and changes to configuration.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Next step",
    title: "See AI that knows your Opero.",
    description: "We will show you how the assistant speeds up both configuration and daily work with data.",
    primaryCta: "Book a demo",
  },
  seoText: {
    eyebrow: "More about this",
    title: "An AI assistant that understands your system.",
    paragraphs: [
      "Contextual AI in Opero is an assistant that knows the structure and data of your instance. Instead of generic answers you get help that is aware of context: the AI understands your objects, fields, processes and permissions, because it connects to the platform through a secure, access-controlled mechanism. The same mechanism serves two audiences: consultants and end users.",
      "For consultants, AI speeds up configuration. In a dialogue with the assistant you build and change objects, forms, rules and processes, with validation before saving. Because the AI knows the platform's contract, rollout moves faster and with fewer mistakes. For end users, AI simplifies daily work: you ask about data in natural language, search records and get summaries without clicking through views.",
      "The foundation is secure, context-aware access to configuration and data, with full respect for the user's permissions. That makes AI in Opero a practical work tool, not an add-on detached from the system.",
    ],
  },
  faq: {
    eyebrow: "Questions",
    title: "Frequently asked questions.",
    items: [
      {
        question: "How does the AI learn the context of your system?",
        answer:
          "The assistant connects to the configuration and current data of your instance through a secure, context-aware mechanism, respecting the permissions of the user asking the question.",
      },
      {
        question: "What is AI used for in Opero?",
        answer: "It helps consultants build configuration (objects, rules, processes) and answers end users' questions about data in natural language.",
      },
    ],
  },
  related: {
    eyebrow: "Related features",
    title: "See also",
    items: ["noCode", "lowCode", "reports"],
  },
};
