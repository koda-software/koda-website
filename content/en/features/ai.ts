import type { FeaturePageContent } from "@/content/types";

export const aiFeature: FeaturePageContent = {
  seo: {
    title: "Contextual AI in Opero - an assistant that knows your system",
    description:
      "The AI assistant knows the structure, configuration and data of your instance. Consultants build configuration with it, users ask about data in natural language.",
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
  related: {
    eyebrow: "Related features",
    title: "See also",
    items: ["noCode", "lowCode", "reports"],
  },
};
