import type { LowCodeDemoContent, NoCodePageContent } from "@/content/types";

export type LowCodeImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type LowCodeScenario = {
  /** The department or industry it speaks to. */
  area: string;
  title: string;
  when: string;
  check: string;
  then: string[];
};

export type LowCodeLadderStep = {
  name: string;
  who: string;
  reachFor: string;
  description: string;
  /** A short real-looking sample. Shown as written, so line breaks count. */
  sample: { label: string; code: string };
};

export type LowCodePageContent = {
  hero: {
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    image: LowCodeImage;
  };
  chores: {
    title: string;
    description: string;
    todayLabel: string;
    insteadLabel: string;
    rows: Array<{ today: string; instead: string }>;
  };
  anatomy: {
    title: string;
    description: string;
    columns: Array<{ label: string; items: string[] }>;
    note: string;
  };
  sentence: {
    title: string;
    description: string;
    bullets: string[];
    demo: LowCodeDemoContent;
  };
  scenarios: {
    title: string;
    description: string;
    labels: { when: string; check: string; then: string };
    items: LowCodeScenario[];
  };
  ladder: {
    title: string;
    description: string;
    whoLabel: string;
    reachForLabel: string;
    steps: LowCodeLadderStep[];
    closingTitle: string;
    closing: Array<{ title: string; description: string }>;
  };
  blocks: {
    title: string;
    description: string;
    bullets: string[];
    image: LowCodeImage;
  };
  queries: {
    title: string;
    description: string;
    consumersLabel: string;
    consumers: string[];
    bullets: string[];
    image: LowCodeImage;
  };
  trust: {
    title: string;
    description: string;
    items: Array<{ title: string; description: string }>;
    dryRunImage: LowCodeImage;
    historyImage: LowCodeImage;
  };
  owners: {
    title: string;
    description: string;
    columns: Array<{ title: string; items: string[] }>;
    aiCta: string;
  };
  faq: NoCodePageContent["faq"];
  related: NoCodePageContent["related"];
  finalCta: NoCodePageContent["finalCta"];
  seoText: {
    title: string;
    paragraphs: string[];
  };
};
