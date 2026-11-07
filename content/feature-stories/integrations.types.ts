import type { IntegrationsDemoContent } from "@/content/types";
import type { FeatureKey } from "@/lib/i18n/features";

export type IntegrationsPageImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type IntegrationsPageContent = {
  hero: {
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    image: IntegrationsPageImage;
  };
  /** What the buyer already runs, and how Opero meets each of those systems. */
  keep: {
    title: string;
    description: string;
    columns: { system: string; connection: string; result: string };
    rows: Array<{ system: string; examples: string; connection: string; result: string }>;
    footnote: string;
  };
  demo: {
    title: string;
    description: string;
    content: IntegrationsDemoContent;
  };
  compliance: {
    title: string;
    description: string;
    lanes: Array<{
      title: string;
      stages: Array<{ title: string; detail: string }>;
    }>;
  };
  ksef: {
    title: string;
    description: string;
    image: IntegrationsPageImage;
    cases: Array<{ title: string; description: string }>;
  };
  checks: {
    title: string;
    description: string;
    items: Array<{
      title: string;
      description: string;
      /** A small illustration of the result, not real data. */
      rows: Array<{ label: string; value: string }>;
    }>;
    sampleLabel: string;
  };
  scenarios: {
    title: string;
    description: string;
    items: Array<{
      team: string;
      industry: string;
      title: string;
      steps: string[];
      outcome: string;
    }>;
  };
  developers: {
    title: string;
    description: string;
    bullets: string[];
    inbound: { label: string; lines: string[] };
    outbound: { label: string; lines: string[] };
  };
  control: {
    title: string;
    description: string;
    shots: Array<{ title: string; description: string; image: IntegrationsPageImage }>;
    facts: string[];
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
