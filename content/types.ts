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
    description: string;
    languageLabel: string;
    productLine: string;
  };
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

export type ProductFeatureRow = {
  title: string;
  description: string;
  supports: string[];
};

export type ProductTableRow = {
  need: string;
  support: string;
};

export type ProductComparisonColumn = {
  label: string;
  description: string;
};

export type OperoProductContent = {
  seo: SeoContent;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    diagramItems: string[];
  };
  overview: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
  };
  features: {
    eyebrow: string;
    title: string;
    description: string;
    rows: ProductFeatureRow[];
  };
  connectedModel: {
    eyebrow: string;
    title: string;
    description: string;
    layers: Array<{
      label: string;
      detail: string;
    }>;
  };
  contractorExample: {
    eyebrow: string;
    title: string;
    description: string;
    needLabel: string;
    supportLabel: string;
    rows: ProductTableRow[];
  };
  implementation: {
    eyebrow: string;
    title: string;
    steps: ProductFeatureRow[];
  };
  comparison: {
    eyebrow: string;
    title: string;
    columns: ProductComparisonColumn[];
  };
  finalCta: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
};

export type SolutionIndustry = {
  title: string;
  scenario: string[];
  useCasesLabel: string;
  useCases: string[];
  helpfulFeaturesLabel: string;
  helpfulFeatures: string[];
  supportsLabel: string;
  supports: string[];
};

export type SolutionPatternRow = {
  problem: string;
  support: string;
};

export type SolutionsContent = {
  seo: SeoContent;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    supportLine: string;
    primaryCta: string;
    secondaryCta: string;
  };
  industries: {
    eyebrow: string;
    title: string;
    description: string;
    items: SolutionIndustry[];
  };
  pattern: {
    eyebrow: string;
    title: string;
    description: string;
    problemLabel: string;
    supportLabel: string;
    rows: SolutionPatternRow[];
  };
  fit: {
    eyebrow: string;
    title: string;
    description: string;
    goodFitTitle: string;
    goodFit: string[];
    notBestFitTitle: string;
    notBestFit: string[];
  };
  finalCta: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
};

export type ContactFormContent = {
  nameLabel: string;
  companyLabel: string;
  emailLabel: string;
  phoneLabel: string;
  interestLabel: string;
  messageLabel: string;
  consent: string;
  requiredHint: string;
  optionalHint: string;
  submitLabel: string;
  submittingLabel: string;
  successMessage: string;
  errorMessage: string;
  validationMessage: string;
  interestOptions: Array<{
    value: string;
    label: string;
  }>;
};

export type ContactPageContent = {
  seo: SeoContent;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
  };
  context: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
  };
  topics: {
    title: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  form: ContactFormContent;
};
