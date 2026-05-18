import type { PageKey } from "@/lib/i18n/routes";

export type NavItem = {
  page: PageKey;
  label: string;
  href: string;
};

export type SeoContent = {
  title: string;
  description: string;
};

export type CtaContent = {
  label: string;
  href: string;
};

export type ShellContent = {
  brand: string;
  nav: {
    openMenu: string;
    closeMenu: string;
    items: Array<{ page: Exclude<PageKey, "home">; label: string }>;
  };
  footer: {
    tagline: string;
    languageLabel: string;
  };
};

export type PlaceholderPageContent = {
  seo: SeoContent;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
};

export type FeaturePillar = {
  title: string;
  description: string;
  capabilities: string[];
};

export type UseCaseCard = {
  title: string;
  description: string;
};

export type HomeSection = {
  label: string;
  title: string;
  description: string;
};

export type HomePointGroup = HomeSection & {
  points: string[];
};

export type HomeStep = {
  label: string;
  title: string;
  description: string;
};

export type HeroAssistantScenario = {
  label: string;
  dashboardTitle: string;
  dashboardMetric: string;
  dashboardDetail: string;
  messages: Array<{
    speaker: "assistant" | "user";
    text: string;
  }>;
};

export type HomeContent = {
  seo: SeoContent;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    supportPoints: string[];
    visual: {
      questions: string[];
      steps: Array<{
        label: string;
        title: string;
        description: string;
      }>;
      magicLabel: string;
      mappingItems: string[];
      outcomeItems: string[];
    };
    assistantDemo: {
      buttonLabel: string;
      popupTitle: string;
      typingLabel: string;
      scenarios: HeroAssistantScenario[];
    };
  };
  problem: HomePointGroup;
  solution: HomePointGroup;
  pillars: {
    label: string;
    title: string;
    description: string;
    items: FeaturePillar[];
  };
  workflow: {
    label: string;
    title: string;
    description: string;
    steps: HomeStep[];
  };
  ai: HomePointGroup & {
    chat: {
      assistantPrompt: string;
      userRequest: string;
      assistantReply: string;
      reportTitle: string;
      statusLabel: string;
      scopeLabel: string;
      footer: string;
      inputPlaceholder: string;
      sendLabel: string;
      tableHeaders: [string, string, string];
      tableRows: Array<[string, string, string]>;
    };
  };
  useCases: {
    label: string;
    title: string;
    description: string;
    items: UseCaseCard[];
  };
  trust: HomePointGroup;
  finalCta: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
};
