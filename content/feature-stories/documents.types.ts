import type { FeatureKey } from "@/lib/i18n/features";

type DocumentsImage = { src: string; alt: string; width: number; height: number };

export type DocumentsPageContent = {
  hero: {
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    image: DocumentsImage;
  };
  problem: {
    title: string;
    description: string;
    folderLabel: string;
    caseLabel: string;
    rows: Array<{ question: string; folder: string; opero: string }>;
  };
  caseFile: {
    title: string;
    description: string;
    bullets: string[];
    image: DocumentsImage;
  };
  journey: {
    title: string;
    description: string;
    note: string;
    stages: Array<{ tag: string; title: string; detail: string; active?: boolean }>;
  };
  scenarios: {
    title: string;
    description: string;
    stepLabels: [string, string, string];
    items: Array<{ area: string; title: string; steps: [string, string, string] }>;
  };
  generate: {
    title: string;
    description: string;
    image: DocumentsImage;
    points: Array<{ title: string; detail: string }>;
  };
  write: {
    title: string;
    description: string;
    bullets: string[];
    image: DocumentsImage;
  };
  find: {
    title: string;
    description: string;
    bullets: string[];
    image: DocumentsImage;
  };
  keep: {
    title: string;
    description: string;
    items: Array<{ title: string; detail: string }>;
  };
  faq: {
    title: string;
    items: Array<{ question: string; answer: string }>;
  };
  related: {
    title: string;
    items: Array<{ feature: FeatureKey; title: string; description: string }>;
  };
  finalCta: {
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
};
