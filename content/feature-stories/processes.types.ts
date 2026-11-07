import type { FeaturePageContent, NoCodePageContent, ProcessesDemoContent } from "@/content/types";

export type ProcessesPageImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ProcessesStageIcon = "alert" | "calculator" | "calendar" | "check" | "clipboard" | "inbox" | "laptop" | "pen" | "scale" | "search" | "send" | "shield" | "stamp" | "user" | "wrench";

/** One stage of a department's process. The tone says what kind of stage it is, and picks its colour. */
export type ProcessesStage = {
  name: string;
  icon: ProcessesStageIcon;
  tone: "intake" | "work" | "approve" | "done";
  owner: string;
  due?: string;
  /** Something Opero does at this stage, in a few words. */
  auto?: string;
  lock?: string;
};

/** One tab of the department explorer: a process somebody else would recognise as theirs. */
export type ProcessesScenario = {
  department: string;
  process: string;
  situation: string;
  stages: ProcessesStage[];
};

export type ProcessesStoryStep = {
  stage: string;
  title: string;
  people: string;
  opero: string;
};

export type ProcessesProofRow = {
  title: string;
  description: string;
  bullets: string[];
  image: ProcessesPageImage;
  magnifier?: ProcessesPageImage;
};

export type ProcessesDeadlineMoment = {
  when: string;
  title: string;
  detail: string;
  tone: "calm" | "due" | "late";
};

export type ProcessesPageContent = {
  seo: FeaturePageContent["seo"];
  hero: {
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    image: ProcessesPageImage;
    magnifier: ProcessesPageImage;
  };
  problem: {
    title: string;
    description: string;
    askedLabel: string;
    answerLabel: string;
    rows: Array<{ asked: string; answer: string }>;
  };
  story: {
    title: string;
    description: string;
    exampleLabel: string;
    peopleLabel: string;
    operoLabel: string;
    steps: ProcessesStoryStep[];
  };
  board: {
    title: string;
    description: string;
    demo: ProcessesDemoContent;
  };
  departments: {
    title: string;
    description: string;
    tablistLabel: string;
    scenarios: ProcessesScenario[];
  };
  ownership: ProcessesProofRow;
  approvals: ProcessesProofRow;
  deadlines: {
    title: string;
    description: string;
    moments: ProcessesDeadlineMoment[];
    note: string;
  };
  visibility: ProcessesProofRow;
  history: ProcessesProofRow;
  faq: NoCodePageContent["faq"];
  related: NoCodePageContent["related"];
  finalCta: NoCodePageContent["finalCta"];
  seoText: FeaturePageContent["seoText"];
};
