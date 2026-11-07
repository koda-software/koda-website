import type { NoCodePageContent, ReportsDemoContent } from "@/content/types";

export type ReportsPageImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** One tab of the question explorer: a question somebody keeps asking, and the report that answers it. */
export type ReportsScenario = {
  department: string;
  question: string;
  answer: string;
  reportTitle: string;
  /** First column is the row label, the rest are right-aligned measures. */
  columns: string[];
  rows: string[][];
  /** Same length as columns. */
  total: string[];
  /** Index of the row the drill sentence talks about. */
  highlightRow: number;
  built: string;
  drill: string;
};

export type ReportsExplorerLabels = {
  tabsLabel: string;
  builtLabel: string;
  drillLabel: string;
  exampleNote: string;
};

export type ReportsPageContent = {
  hero: {
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    image: ReportsPageImage;
  };
  problem: {
    title: string;
    description: string;
    comparison: {
      title: string;
      ariaLabel: string;
      beforeLabel: string;
      beforeAlt: string;
      afterLabel: string;
      afterAlt: string;
    };
    ledger: {
      moment: string;
      spreadsheet: string;
      opero: string;
      rows: Array<{ moment: string; spreadsheet: string; opero: string }>;
    };
  };
  drill: {
    title: string;
    description: string;
    demo: ReportsDemoContent;
    points: Array<{ title: string; description: string }>;
  };
  questions: {
    title: string;
    description: string;
    labels: ReportsExplorerLabels;
    scenarios: ReportsScenario[];
    industries: {
      title: string;
      note: string;
      items: Array<{ industry: string; description: string }>;
    };
  };
  calculation: {
    title: string;
    description: string;
    margin: {
      title: string;
      columns: [string, string, string, string];
      rows: Array<[string, string, string, string]>;
      averageLabel: string;
      averageValue: string;
      totalLabel: string;
      totalValues: [string, string, string];
      formulaLabel: string;
      formula: string;
    };
    secondTitle: string;
    bullets: string[];
    image: ReportsPageImage;
  };
  oneVersion: {
    title: string;
    description: string;
    files: Array<{ name: string; meta: string; totalLabel: string; total: string }>;
    report: { name: string; meta: string; totalLabel: string; total: string };
    audiences: string[];
    points: Array<{ title: string; description: string }>;
  };
  reslice: {
    title: string;
    description: string;
    bullets: string[];
    image: ReportsPageImage;
  };
  dashboards: {
    title: string;
    description: string;
    image: ReportsPageImage;
    teams: Array<{ team: string; description: string }>;
  };
  delivery: {
    title: string;
    export: {
      title: string;
      description: string;
      image: ReportsPageImage;
    };
    schedule: {
      title: string;
      description: string;
      steps: Array<{ label: string; detail: string }>;
      cta: string;
    };
  };
  build: {
    title: string;
    description: string;
    steps: Array<{ title: string; description: string }>;
    cta: string;
  };
  faq: NoCodePageContent["faq"];
  related: NoCodePageContent["related"];
  finalCta: NoCodePageContent["finalCta"];
};
