import type { FeatureKey } from "@/lib/i18n/features";
import type { PageKey } from "@/lib/i18n/routes";

export type NavSubItem = {
  feature: FeatureKey;
  label: string;
  href: string;
};

export type NavItem = {
  page: PageKey;
  label: string;
  href: string;
  /** Rendered as a dropdown under the parent link; only the Opero tab uses it. */
  submenu?: NavSubItem[];
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
    home: string;
    openMenu: string;
    closeMenu: string;
    /** Link to the general Opero product page, shown as the first row inside the Opero dropdown. */
    exploreOpero: string;
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
  /** Entry point to the eight "system features" pages nested under this route. */
  featureLinks: {
    eyebrow: string;
    title: string;
    description: string;
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
  /** One end-to-end process walked step by step, to make the abstract capabilities concrete. */
  workflowExample: {
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

export type FeatureBlock = {
  title: string;
  description: string;
};

/**
 * A slot in the screenshot band. `src` is the real, reviewed screenshot; a shot
 * is only defined when a picture exists, so the page never renders a gray
 * placeholder frame. `width`/`height` are the source file's intrinsic pixel
 * dimensions - each screenshot keeps its own aspect ratio instead of being
 * cropped into a shared shape.
 */
export type FeatureShot = {
  /** Path under /public to the real screenshot. */
  src: string;
  width: number;
  height: number;
  /** Visible caption under the image. */
  caption: string;
  alt: string;
};

export type FeaturePageContent = {
  seo: SeoContent;
  /** Short label used in the navigation dropdown and in related-page links. */
  navLabel: string;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    /** Omit when no reviewed screenshot exists yet; the hero falls back to a text-only layout. */
    shot?: FeatureShot;
  };
  intro: {
    eyebrow: string;
    paragraph: string;
  };
  blocks: {
    eyebrow: string;
    title: string;
    items: FeatureBlock[];
  };
  /** Omit the whole band when the page has no reviewed screenshots yet. */
  shots?: {
    eyebrow: string;
    title: string;
    items: FeatureShot[];
  };
  finalCta: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
  };
  /** Longer-form SEO copy near the bottom of the page - written for search intent, not skimming. */
  seoText: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
  };
  /** Long-tail Q&A, also emitted as FAQPage structured data. */
  faq: {
    eyebrow: string;
    title: string;
    items: Array<{ question: string; answer: string }>;
  };
  related: {
    eyebrow: string;
    title: string;
    items: FeatureKey[];
  };
};

export type FeaturePagesContent = Record<FeatureKey, FeaturePageContent>;

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

/**
 * Chrome and copy for the blog. Everything editorial comes from Opero; this
 * module only carries the surrounding UI strings, in both locales.
 */
export type BlogUiContent = {
  seo: SeoContent;
  index: {
    eyebrow: string;
    title: string;
    description: string;
  };
  labels: {
    featured: string;
    minRead: string;
    published: string;
    updated: string;
    tags: string;
    related: string;
    aboutAuthor: string;
    allArticles: string;
    inCategory: string;
    byAuthor: string;
    emptyState: string;
    previous: string;
    next: string;
    pagination: string;
    page: string;
    breadcrumbHome: string;
  };
  archives: {
    categoryEyebrow: string;
    tagEyebrow: string;
    authorEyebrow: string;
    categoryDescription: string;
    tagDescription: string;
    authorDescription: string;
  };
  seoTemplates: {
    /** `{name}` is replaced with the category/tag/author name. */
    categoryTitle: string;
    categoryDescription: string;
    tagTitle: string;
    tagDescription: string;
    authorTitle: string;
    authorDescription: string;
    /** `{page}` is replaced with the page number. */
    pageTitle: string;
    pageDescription: string;
  };
  notFound: {
    title: string;
    description: string;
    backLabel: string;
  };
  cta: {
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
