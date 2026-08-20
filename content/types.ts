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
    links: Array<{ label: string; href: string }>;
    languageLabel: string;
    productLine: string;
  };
};

export type FeaturePillar = {
  title: string;
  description: string;
  capabilities: string[];
  animation?: {
    dashboard: {
      blocks: [string, string, string];
      metrics: [string, string, string];
      chartTitle: string;
      tableTitle: string;
    };
    form: {
      blocks: [string, string, string];
      fields: [string, string, string];
      actionLabel: string;
    };
  };
  ruleAnimation?: {
    actionLabel: string;
    start: { title: string; meta: string };
    condition: { title: string; meta: string };
    positive: { title: string; meta: string; outcome: string };
    negative: { title: string; meta: string; outcome: string };
    positiveLabel: string;
    negativeLabel: string;
  };
  permissionAnimation?: {
    title: string;
    viewAsLabel: string;
    employeeRoleLabel: string;
    hrRoleLabel: string;
    fields: [
      { label: string; value: string },
      { label: string; value: string },
      { label: string; value: string },
    ];
    lockedLabel: string;
    roleBeforeLabel: string;
    roleAfterLabel: string;
  };
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

export type HomeIntegrationItem = {
  name: string;
  description: string;
  icon: "invoice" | "delivery" | "registry" | "sms" | "email" | "signature";
  tone: "sky" | "violet" | "green" | "amber" | "rose" | "slate";
  logoSrc?: string;
};

/**
 * Copy for the animated record/process demo in the home banner. The animation
 * shows a mocked-up Opero screen, so every visible string lives here and gets
 * translated like any other page copy.
 */
export type RecordDemoContent = {
  listTitle: string;
  /** The row the animation opens; its priority and stage change as the demo runs. */
  focusRow: { number: string; title: string };
  /** Static rows filling out the list behind the focused one. */
  otherRows: Array<{ number: string; title: string; priority: string; stage: string }>;
  fields: { client: string; clientValue: string; priority: string; value: string; valueTyped: string };
  priorityOptions: [string, string, string, string];
  processLabel: string;
  /** Four workflow stages, each with the label of the button that leaves it. */
  stages: Array<{ name: string; transition: string }>;
  doneLabel: string;
  /** `<b>` is allowed for emphasis. */
  captions: { list: string; form: string; process: string; result: string };
};

/**
 * Copy for the three-act configuration demo in the Opero banner: rule, script,
 * SQL query.
 */
export type ConfigDemoContent = {
  rule: {
    triggerLabel: string;
    triggerTitle: string;
    triggerChip: string;
    stepsLabel: string;
    steps: Array<{ title: string; detail: string }>;
    addStep: string;
  };
  script: {
    title: string;
    chip: string;
    run: string;
    resultTime: string;
    /** Identifiers shown in the mocked editor; localized like the rest of a real configuration. */
    field: string;
    values: [string, string];
  };
  query: {
    title: string;
    chip: string;
    run: string;
    paramValue: string;
    /** Identifiers shown in the mocked SQL editor. */
    sql: { columns: string; table: string; field: string; param: string };
    columns: [string, string, string, string];
    rows: Array<[string, string, string, string]>;
  };
  /** `<b>` is allowed for emphasis. */
  captions: { rule: string; ruleDone: string; script: string; scriptDone: string; query: string; summary: string };
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
    recordDemo: RecordDemoContent;
  };
  problem: HomePointGroup & {
    comparison: {
      title: string;
      ariaLabel: string;
      beforeLabel: string;
      beforeAlt: string;
      afterLabel: string;
      afterAlt: string;
    };
  };
  solution: HomePointGroup & {
    cta: string;
  };
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
  integrations: HomeSection & {
    items: HomeIntegrationItem[];
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

export type AiSectionContent = HomePointGroup & {
  chat: {
    assistantName: string;
    userRequest: string;
    assistantReply: string;
    reportTitle: string;
    statusLabel: string;
    scopeLabel: string;
    sendLabel: string;
    tableHeaders: [string, string, string];
    tableRows: Array<[string, string, string]>;
    /** `<b>` is allowed for emphasis. */
    captions: { ask: string; working: string; report: string; scope: string };
  };
};

export type UseCasesSectionContent = {
  label: string;
  title: string;
  description: string;
  items: UseCaseCard[];
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
    configDemo: ConfigDemoContent;
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
  ai: AiSectionContent;
  useCases: UseCasesSectionContent;
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
  /** Animated walkthrough shown as a full-width band under the hero. */
  demo?: FeatureDemoContent;
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

/**
 * Copy for the animated demo on each feature page. Every demo is decorative and
 * `aria-hidden`, but the strings are still content: they carry the product's
 * vocabulary and have to read naturally in both languages, so they live here
 * rather than being baked into the components. `<b>` is allowed in captions.
 */
export type ProcessesDemoContent = {
  /** The four board columns, in the order a record moves through them. */
  columns: [string, string, string, string];
  /** The card that travels across the board. */
  focusCard: { number: string; title: string };
  /** Cards standing still in the first, second and fourth column. */
  otherCards: [DemoCard, DemoCard, DemoCard];
  tasksLabel: string;
  task: { title: string; meta: string };
  approvalLabel: string;
  approveLabel: string;
  rejectLabel: string;
  captions: { board: string; task: string; approval: string; done: string };
};

export type DemoCard = { number: string; title: string };

/**
 * The demo a feature page shows, tagged so the page can pick the matching
 * component. Optional on the page: a feature without a demo simply renders no
 * band, which is how the pages looked before the animations existed.
 */
export type SecurityDemoContent = {
  /** Three roles looking at the same record, in the order the demo cycles them. */
  roles: [string, string, string];
  recordTitle: string;
  /** Four record fields; the later ones are masked for roles that may not see them. */
  fields: Array<{ label: string; value: string }>;
  /** Edit, approve and delete, in that order. */
  buttons: [string, string, string];
  readOnlyLabel: string;
  captions: { technician: string; manager: string; finance: string };
};

export type NoCodeDemoContent = {
  paletteLabel: string;
  /** Five field types in the palette; the demo drags the second and third. */
  paletteItems: [string, string, string, string, string];
  formTitle: string;
  /** The three form fields, in the order they land on the canvas. */
  formFields: [string, string, string];
  previewLabel: string;
  record: { title: string; rows: Array<{ label: string; value: string }>; saveLabel: string };
  captions: { drag: string; second: string; preview: string };
};

export type LowCodeDemoContent = {
  conditionLabel: string;
  /** Field, operator and value, assembled left to right. */
  condition: [string, string, string];
  runLabel: string;
  firedLabel: string;
  fieldEffect: { title: string; detail: string; from: string; to: string };
  notificationEffect: { title: string; detail: string };
  blockEffect: { title: string; detail: string; transition: string };
  captions: { condition: string; fired: string; summary: string };
};

export type ReportsDemoContent = {
  tableTitle: string;
  /** Category, count and value column headers. */
  columns: [string, string, string];
  /** Four category rows, which become the four bars and then the drill-down. */
  rows: Array<{ category: string; count: string; value: string }>;
  chartTitle: string;
  drillTitle: string;
  /** The records behind the first bar. */
  drillRows: Array<{ number: string; title: string; value: string }>;
  captions: { table: string; chart: string; drill: string };
};

export type DocumentsDemoContent = {
  inboxLabel: string;
  mail: { file: string; from: string };
  record: {
    title: string;
    numberLabel: string;
    /** Typed out character by character, to show the numbering being assigned. */
    number: string;
    partyLabel: string;
    party: string;
    amountLabel: string;
    amount: string;
  };
  pathLabel: string;
  condition: string;
  /** The branch that runs, then the one the amount skips. */
  branches: [{ title: string; detail: string }, { title: string; detail: string }];
  versionsLabel: string;
  versions: Array<{ file: string; detail: string }>;
  currentLabel: string;
  captions: { intake: string; numbering: string; path: string; versions: string };
};

export type IntegrationsDemoContent = {
  source: { name: string; subtitle: string };
  document: { number: string; kind: string };
  recordTitle: string;
  fields: Array<{ label: string; value: string }>;
  /** Inbound call first, outbound webhook second. */
  apis: [{ endpoint: string; direction: string }, { endpoint: string; direction: string }];
  captions: { arrives: string; fields: string; api: string };
};

export type AiDemoContent = {
  assistantName: string;
  contextLabel: string;
  question: string;
  readingLabel: string;
  /** The record, its history and its attachments. */
  contextItems: [string, string, string];
  answer: string;
  proposalLabel: string;
  proposalField: string;
  proposalValue: string;
  applyLabel: string;
  dismissLabel: string;
  savedLabel: string;
  /** Replaces the proposal label once the change is written to the record. */
  appliedLabel: string;
  captions: { ask: string; reading: string; answer: string; applied: string };
};

export type FeatureDemoContent =
  | ({ kind: "processes" } & ProcessesDemoContent)
  | ({ kind: "noCode" } & NoCodeDemoContent)
  | ({ kind: "lowCode" } & LowCodeDemoContent)
  | ({ kind: "reports" } & ReportsDemoContent)
  | ({ kind: "documents" } & DocumentsDemoContent)
  | ({ kind: "integrations" } & IntegrationsDemoContent)
  | ({ kind: "ai" } & AiDemoContent)
  | ({ kind: "security" } & SecurityDemoContent);

/**
 * Stable identifier picking the industry's icon. Keyed rather than positional
 * so reordering the industries, or translating their titles, can never leave a
 * card showing another industry's icon.
 */
export type SolutionIndustryIcon =
  | "manufacturing"
  | "construction"
  | "professionalServices"
  | "fieldService"
  | "healthcare"
  | "retail"
  | "education"
  | "publicSector";

export type SolutionIndustry = {
  icon: SolutionIndustryIcon;
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

export type AboutBelief = {
  title: string;
  description: string;
};

export type AboutBackgroundRow = {
  /** The system class the lesson came from, e.g. "BPM i workflow". */
  label: string;
  lesson: string;
};

export type AboutPageContent = {
  seo: SeoContent;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  identity: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
  };
  origin: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    /** Pulled out as a manifesto quote next to the narrative. */
    manifesto: string;
  };
  mission: {
    eyebrow: string;
    title: string;
    description: string;
  };
  beliefs: {
    eyebrow: string;
    title: string;
    description: string;
    items: AboutBelief[];
  };
  background: {
    eyebrow: string;
    title: string;
    description: string;
    rows: AboutBackgroundRow[];
  };
  approach: {
    eyebrow: string;
    title: string;
    items: AboutBelief[];
  };
  /**
   * Company figures and team. Omitted until the team supplies real, verifiable
   * numbers and photos - the section renders only when this is present, so the
   * page never ships invented statistics or an empty frame.
   */
  facts?: {
    eyebrow: string;
    title: string;
    description: string;
    items: Array<{ label: string; value: string }>;
  };
  finalCta: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  /** Longer-form SEO copy near the bottom, written for search intent. */
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
