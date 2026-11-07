import type { NoCodePageContent, SeoContent } from "@/content/types";

export type SecurityImage = { src: string; alt: string; width: number; height: number };

export type SecurityViewColumn = {
  role: string;
  fields: Array<{ label: string; value: string }>;
  /** What this person can do from here. Empty means `viewOnlyLabel` shows instead. */
  actions: string[];
  /** The fields that are not on this person's form at all. */
  absent: string[];
};

export type SecurityEntryIcon = "sso" | "mfa" | "tokens" | "agents";

export type SecurityPageContent = {
  seo: SeoContent;
  hero: {
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    image: SecurityImage;
  };
  problem: {
    title: string;
    points: string[];
    solution: string;
  };
  views: {
    title: string;
    description: string;
    exampleLabel: string;
    recordTitle: string;
    absentLabel: string;
    viewOnlyLabel: string;
    columns: [SecurityViewColumn, SecurityViewColumn, SecurityViewColumn];
    note: string;
  };
  scenarios: {
    title: string;
    description: string;
    headers: { area: string; rule: string; how: string };
    items: Array<{ area: string; rule: string; how: string }>;
    disclaimer: string;
  };
  layers: {
    title: string;
    description: string;
    items: Array<{ title: string; description: string }>;
    diagnostics: { title: string; description: string; image: SecurityImage };
  };
  audit: {
    title: string;
    description: string;
    images: { history: SecurityImage; log: SecurityImage };
    points: Array<{ title: string; description: string }>;
    note: string;
  };
  questions: {
    title: string;
    items: Array<{ question: string; answer: string }>;
  };
  group: {
    title: string;
    description: string;
    bullets: string[];
    image: SecurityImage;
  };
  entry: {
    title: string;
    description: string;
    items: Array<{ icon: SecurityEntryIcon; title: string; description: string }>;
  };
  hosting: {
    title: string;
    description: string;
    options: Array<{ title: string; description: string }>;
    backups: {
      title: string;
      stages: Array<{ title: string; description: string }>;
    };
  };
  faq: NoCodePageContent["faq"];
  related: NoCodePageContent["related"];
  finalCta: NoCodePageContent["finalCta"];
};
