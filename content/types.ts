import type { ToolKey } from "@/lib/i18n/tools";
import type { FeatureKey } from "@/lib/i18n/features";
import type { PageKey } from "@/lib/i18n/routes";
import type { JpkCheckId, KsefKind, VatRateKey } from "@/lib/tools/jpk";
import type { JpkCsvLabels } from "@/lib/tools/jpk-csv";
import type { DailyNorm, PluralForms, WorkingTimeSummaryLabels } from "@/lib/tools/working-time";

export type NavSubItem = {
  feature: FeatureKey;
  label: string;
  /** What the area does for a business, in a few words. It sits under the name in the menu. */
  description: string;
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

/** Consent categories a visitor can switch on. "Necessary" is implicit and always on. */
export type ConsentCategory = "analytics" | "marketing";

type ConsentCategoryCopy = { label: string; description: string };

/** Copy for the cookie banner and its preferences dialog. Services come from `content/consent-services.ts`. */
export type ConsentContent = {
  title: string;
  description: string;
  privacyLinkLabel: string;
  acceptLabel: string;
  rejectLabel: string;
  customiseLabel: string;
  /** The footer link that reopens the preferences on every page. */
  settingsLabel: string;
  preferences: {
    title: string;
    description: string;
    closeLabel: string;
    alwaysOnLabel: string;
    /** Followed by the number of services, e.g. "Szczegóły (1)". */
    detailsLabel: string;
    rejectAllLabel: string;
    saveLabel: string;
    acceptAllLabel: string;
    fields: { vendor: string; cookies: string; transfer: string };
    noCookiesLabel: string;
    policyNote: string;
  };
  categories: Record<"necessary" | ConsentCategory, ConsentCategoryCopy>;
};

type LocalizedText = { pl: string; en: string };

/**
 * One third-party service that needs consent. Every factual field must come
 * from the vendor's own documentation; list those pages in `sources`.
 */
export type ConsentService = {
  id: string;
  name: string;
  /** The legal entity that provides the service to EEA visitors. */
  vendor: string;
  category: ConsentCategory;
  purpose: LocalizedText;
  cookies: Array<{ name: string; lifetime: LocalizedText; purpose: LocalizedText }>;
  /** Where data may go outside the EEA and on what Chapter V GDPR basis. */
  transfer: LocalizedText;
  privacyPolicyUrl: string;
  /** Vendor pages the facts above were taken from. Not shown to visitors. */
  sources: string[];
};

export type ShellContent = {
  brand: string;
  consent: ConsentContent;
  nav: {
    home: string;
    openMenu: string;
    closeMenu: string;
    /** Link to the general Opero product page, shown as the first row inside the Opero dropdown. */
    exploreOpero: string;
    /** One line next to `exploreOpero`, in the menu's drawer. */
    exploreOperoText: string;
    items: Array<{ page: Exclude<PageKey, "home">; label: string }>;
  };
  footer: {
    /** The line under the logo, which ends in the flag, and what the flag says to a screen reader. */
    madeIn: string;
    madeInFlag: string;
    tagline: string;
    description: string;
    links: Array<{ label: string; href: string }>;
    languageLabel: string;
    productLine: string;
    /**
     * Ways to reach the company, rendered in the closing column. Each entry is
     * optional because the company is pre-incorporation: a line only appears
     * once there is a real value for it, rather than a placeholder standing in.
     */
    contact: {
      email?: string;
      phone?: string;
      /** Label on the button through to the demo form. */
      formLabel: string;
    };
    /** Column headings for the link groups. */
    productHeading: string;
    companyHeading: string;
    reachHeading: string;
    /** One line under the closing invitation in the last footer column. */
    talkBody: string;
    linkedinLabel: string;
    /**
     * Bottom line. `legalName` stays undefined until the company is registered;
     * until then the bar carries the brand alone rather than inventing an
     * entity that does not exist yet.
     */
    legalName?: string;
    rights: string;
    privacyLabel: string;
  };
};

export type FeaturePillar = {
  /** The module's name in the app window's header while this pillar is on screen. */
  navLabel?: string;
  title: string;
  description: string;
  capabilities: string[];
  link?: CtaContent;
  animation?: {
    dashboard: {
      paletteLabel: string;
      pageTitle: string;
      draftLabel: string;
      publishedLabel: string;
      /** Written in each empty slot, so an unbuilt page reads as one waiting for blocks. */
      dropHint: string;
      blocks: [string, string, string];
      metrics: [string, string, string];
      chartTitle: string;
      /** Five short labels under the report's bars. */
      bars: [string, string, string, string, string];
      tableTitle: string;
      rows: [
        [string, string, string],
        [string, string, string],
        [string, string, string],
      ];
    };
  };
  viewsAnimation?: {
    title: string;
    modes: [string, string, string];
    columns: [string, string, string, string];
    statuses: [string, string, string];
    weekdays: [string, string, string, string, string, string, string];
    monthLabel: string;
    /** How a due date reads, with `{day}` standing for the day of the month. */
    duePattern: string;
    records: Array<{ title: string; owner: string; status: 0 | 1 | 2; day: number }>;
  };
  ruleAnimation?: {
    actionLabel: string;
    start: { title: string; meta: string };
    condition: { title: string; meta: string };
    positive: { title: string; meta: string; outcome: string };
    negative: { title: string; meta: string; outcome: string };
  };
  permissionAnimation?: {
    title: string;
    subtitle: string;
    viewAsLabel: string;
    employeeRoleLabel: string;
    hrRoleLabel: string;
    fields: [
      { label: string; value: string },
      { label: string; value: string },
      { label: string; value: string },
    ];
    lockedLabel: string;
  };
};

export type UseCaseCard = {
  title: string;
  description: string;
};

export type HomeSection = {
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
  /** Shows the name beside the logo, for a logo that does not say what the card is on its own. */
  showName?: boolean;
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
  /** The explainer film that follows the hero: its own copy, and the files of its language under /video. */
  video: {
    title: string;
    description: string;
    ariaLabel: string;
    /** Labels of the icon button that turns the film's sound on and off. */
    soundOn: string;
    soundOff: string;
    /** Label of the play button shown when the browser will not start the film with sound. */
    play: string;
    /** Base path of the film; `.webm`, `.mp4` and `-poster.webp` sit beside it. */
    src: string;
  };
  solution: HomePointGroup & {
    cta: string;
  };
  pillars: {
    title: string;
    description: string;
    /** Words on the app window the demos play in, shared by all four. */
    stage: {
      /** The bubble that hands a demo over to the reader once it has played itself. */
      tryLabel: string;
      replayLabel: string;
      chaptersLabel: string;
    };
    items: FeaturePillar[];
  };
  workflow: {
    title: string;
    description: string;
    steps: HomeStep[];
  };
  integrations: HomeSection & {
    link: CtaContent;
    items: HomeIntegrationItem[];
  };
  trust: HomePointGroup;
  finalCta: {
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
    title: string;
    brief: string;
    primaryCta: string;
    secondaryCta: string;
    visual: {
      alt: string;
    };
  };
  connectedModel: {
    title: string;
    brief: string;
    comparison: {
      title: string;
      ariaLabel: string;
      beforeLabel: string;
      beforeAlt: string;
      afterLabel: string;
      afterAlt: string;
    };
    story: OperoBuildStoryContent;
  };
  productTour: {
    title: string;
    brief: string;
    exploreLabel: string;
    /** Names the route through the tour for a screen reader. */
    journeyLabel: string;
    chapters: Array<{
      title: string;
      brief: string;
      features: Array<
        | {
            feature: FeatureKey;
            brief: string;
          }
        | {
            key: "communication";
            label: string;
            brief: string;
          }
      >;
    }>;
  };
  customization: {
    title: string;
    brief: string;
    comparison: {
      title: string;
      ariaLabel: string;
      beforeLabel: string;
      beforeAlt: string;
      afterLabel: string;
      afterAlt: string;
    };
  };
  finalCta: {
    title: string;
    brief: string;
    primaryCta: string;
    secondaryCta: string;
  };
};

export type OperoBuildStoryContent = {
  ariaLabel: string;
  previousLabel: string;
  nextLabel: string;
  steps: OperoBuildStoryStep[];
};

export type OperoBuildStoryStep = {
  title: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
    trimBottom?: boolean;
    magnifier?: {
      src: string;
      alt: string;
      width: number;
      height: number;
      placement:
        | "model"
        | "form"
        | "record"
        | "automation"
        | "workflow"
        | "documents"
        | "ksef"
        | "ai"
        | "reports"
        | "communication";
    };
    popover?: {
      src: string;
      alt: string;
      width: number;
      height: number;
    };
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
  navDescription: string;
  hero: {
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    /** Omit when no reviewed screenshot exists yet; the hero falls back to a text-only layout. */
    shot?: FeatureShot;
  };
  intro: {
    paragraph: string;
  };
  blocks: {
    title: string;
    items: FeatureBlock[];
  };
  /** Animated walkthrough shown as a full-width band under the hero. */
  demo?: FeatureDemoContent;
  /** Omit the whole band when the page has no reviewed screenshots yet. */
  shots?: {
    title: string;
    items: FeatureShot[];
  };
  finalCta: {
    title: string;
    description: string;
    primaryCta: string;
  };
  /** Longer-form SEO copy near the bottom of the page - written for search intent, not skimming. */
  seoText: {
    title: string;
    paragraphs: string[];
  };
  /** Long-tail Q&A, also emitted as FAQPage structured data. */
  faq: {
    title: string;
    items: Array<{ question: string; answer: string }>;
  };
  related: {
    title: string;
    items: FeatureKey[];
  };
};

export type FeaturePagesContent = Record<FeatureKey, FeaturePageContent>;

export type NoCodePageVisual = {
  label: string;
  title: string;
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

export type NoCodePageSection = {
  number: string;
  title: string;
  description: string;
  bullets: string[];
  visual: NoCodePageVisual;
  reverse?: boolean;
};

export type NoCodePageComparisonCell = {
  label: string;
  meta: string;
  mode: "build" | "configure" | "included";
};

export type NoCodePageComparison = {
  traditional: {
    title: string;
  };
  opero: {
    title: string;
  };
  groups: Array<{
    label?: string;
    rows: Array<{
      title: string;
      detail: string;
      traditional: NoCodePageComparisonCell;
      opero: NoCodePageComparisonCell;
    }>;
  }>;
  summaries: {
    traditional: {
      total: string;
      description: string;
      tags: string[];
    };
    opero: {
      total: string;
      description: string;
      tags: string[];
    };
  };
};

export type NoCodePageContent = {
  labels: {
    screenshotPlaceholder: string;
  };
  hero: {
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    image: {
      src: string;
      alt: string;
      width: number;
      height: number;
    };
  };
  foundation: {
    title: string;
    description: string;
    comparison: NoCodePageComparison;
  };
  capabilities: {
    title: string;
    description: string;
    items: NoCodePageSection[];
  };
  process: {
    title: string;
    description: string;
    tracker: {
      stages: Array<{
        title: string;
        detailBefore: string;
        emphasis?: string;
        timestamp: string;
        state: "complete" | "active" | "upcoming";
      }>;
    };
    cta: string;
  };
  adaptation: {
    title: string;
    description: string;
    bullets: string[];
    visual: NoCodePageVisual;
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

export type AiHeroDemoKey = "client" | "invoices" | "overdue" | "reminder";

/**
 * Copy for the contextual AI hero. The sentence is split into segments because
 * the words carrying a `key` are the ones that travel into the page and become
 * its parts, and those words differ between languages.
 */
export type AiHeroDemoContent = {
  sentence: Array<{ text: string; key?: AiHeroDemoKey }>;
  /** What a screen reader calls the send button that starts the story. */
  sendLabel: string;
  tags: Record<AiHeroDemoKey, string>;
  page: {
    breadcrumb: string;
    title: string;
    status: string;
    fields: Array<{ label: string; value: string }>;
  };
  block: {
    title: string;
    asOf: string;
    columns: [string, string, string];
    rows: Array<{ number: string; due: string; amount: string; overdue?: boolean }>;
    overdueLabel: string;
    totalLabel: string;
    total: number;
    currency: string;
    thousandsSeparator: string;
    action: { before: string; word: string };
  };
};

export type AiRuleNode = { title: string; detail: string };

export type AiBuildDemoContent = {
  /** What the system holds; the tiles marked `match` are the ones the request named. */
  system: { label: string; tiles: Array<{ name: string; match?: boolean }> };
  /** The labels of the query and the block being written, bottom first. The code in them is not translated. */
  layers: [string, string];
  /** The rule behind the button: its trigger, the step that assigns, and the two steps that follow it. */
  rule: {
    label: string;
    steps: [AiRuleNode, AiRuleNode, AiRuleNode, AiRuleNode];
    onError: string;
  };
  page: {
    breadcrumb: string;
    title: string;
    status: string;
    fields: Array<{ label: string; value: string }>;
    /** The rest of the record, which the new section pushes down out of view. */
    billing: { title: string; fields: Array<{ label: string; value: string }> };
    notes: { title: string; text: string };
  };
  block: {
    title: string;
    rows: Array<{ number: string; title: string; sla: string; late?: boolean }>;
    summary: string;
    action: string;
  };
  dialog: {
    title: string;
    fields: Array<{ label: string; value: string }>;
    confirm: string;
  };
};

/** Everything floating in the field the agent chooses from. All of them are things it can reach in Opero. */
export type AiAskToolId =
  | "blocks"
  | "catalog"
  | "comments"
  | "companies"
  | "contractors"
  | "cost_invoices"
  | "custom_fields"
  | "custom_lists"
  | "custom_objects"
  | "dictionaries"
  | "documents"
  | "email_templates"
  | "emails"
  | "forms"
  | "layouts"
  | "logs"
  | "menus"
  | "pages"
  | "reports"
  | "rules"
  | "sales_invoices"
  | "saved_queries"
  | "scripts"
  | "sql_lists"
  | "tasks"
  | "themes"
  | "tickets"
  | "workflows";

/** A part of the question, and how the agent gets somewhere with it. */
export type AiAskClue = {
  /** The words it comes from, exactly as they are written in the question. */
  words: string;
  /** What it measures against these words and rules out, strongest first, then what it settles on and what that gave it. */
  tries: [AiAskToolId, AiAskToolId, AiAskToolId];
  tool: AiAskToolId;
  result: string;
};

/** A question to the agent and the route it takes to the answer. */
export type AiAskQuestion = {
  question: string;
  reply: string;
  /** The pieces it puts together, in the order it finds them. No tool may appear twice, in `tries` or `tool`. */
  clues: [AiAskClue, AiAskClue, AiAskClue, AiAskClue];
};

export type AiAskDemoContent = {
  note: string;
  tools: Record<AiAskToolId, string>;
  questions: [AiAskQuestion, AiAskQuestion, AiAskQuestion];
};

export type AiCompareDemoContent = {
  /** The same question without a connection: everything the agent needs is handed over by hand. */
  manual: {
    label: string;
    messages: Array<{
      from: "you" | "agent";
      text: string;
      files?: Array<{ name: string; kind: "sheet" | "image" }>;
    }>;
  };
  /** And connected: the agent fetches what it needs and answers. */
  connected: {
    label: string;
    question: string;
    steps: string[];
    answer: string;
    rows: Array<{ number: string; due: string; amount: string }>;
    total: { label: string; amount: string };
  };
};

type AiConfigureRequest = { request: string; steps: [string, string] };

export type AiConfigureDemoContent = {
  /** The name of what sits between the agent and Opero. */
  mcp: string;
  asset: { title: string; fields: Array<{ label: string; value: string }>; added: { label: string; value: string } };
  ticket: { title: string; fields: Array<{ label: string; value: string }>; moved: { label: string; value: string } };
  invoices: { title: string; columns: [string, string, string]; added: string; rows: Array<{ cells: [string, string, string]; overdue: string }> };
  /** The asset form, the ticket form and the invoice list, in that order. */
  requests: [AiConfigureRequest, AiConfigureRequest, AiConfigureRequest];
};

type AiPageActText = {
  number: string;
  title: string;
  description: string;
};

/** The act whose animation is the whole section, and asks its own questions. */
export type AiAskAct = AiPageActText & { demo: AiAskDemoContent; configure?: undefined };

/** The act whose animation takes up the section, and makes its own requests. */
export type AiConfigureAct = AiPageActText & { demo?: undefined; configure: AiConfigureDemoContent };

export type AiPageAct = AiAskAct | AiConfigureAct;

export type AiConnectDemoContent = {
  agent: string;
  opero: string;
  add: { title: string; detail: string; button: string };
  signIn: { title: string; initials: string; name: string; note: string; button: string };
  done: { title: string; placeholder: string };
};

export type AiPageContent = {
  hero: {
    title: string;
    description: string;
    primaryCta: string;
    demo: AiHeroDemoContent;
  };
  problem: {
    title: string;
    points: string[];
    solution: string;
    demo: AiCompareDemoContent;
  };
  signature: {
    title: string;
    steps: Array<{ title: string; description: string }>;
    demo: AiBuildDemoContent;
    noteTitle: string;
    note: string;
    cta: string;
  };
  acts: AiPageAct[];
  connect: {
    title: string;
    steps: Array<{ title: string; description: string }>;
    demo: AiConnectDemoContent;
  };
  trust: {
    title: string;
    /** `securityLink` is the words that lead on to the security page. */
    items: Array<{ title: string; description: string; securityLink?: string }>;
  };
  proof: {
    title: string;
    description: string;
  };
  prompts: {
    title: string;
    /** What people want, in their own words, and things they might say. No product terms in either. */
    groups: Array<{ title: string; items: string[] }>;
  };
  faq: NoCodePageContent["faq"];
  related: NoCodePageContent["related"];
  finalCta: NoCodePageContent["finalCta"];
  seoText: {
    title: string;
    paragraphs: string[];
  };
};

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
    title: string;
    description: string;
    supportLine: string;
    primaryCta: string;
    secondaryCta: string;
  };
  industries: {
    title: string;
    description: string;
    items: SolutionIndustry[];
  };
  pattern: {
    title: string;
    description: string;
    problemLabel: string;
    supportLabel: string;
    rows: SolutionPatternRow[];
  };
  fit: {
    title: string;
    description: string;
    goodFitTitle: string;
    goodFit: string[];
    notBestFitTitle: string;
    notBestFit: string[];
  };
  finalCta: {
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
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  identity: {
    title: string;
    paragraphs: string[];
  };
  origin: {
    title: string;
    paragraphs: string[];
    /** Pulled out as a manifesto quote next to the narrative. */
    manifesto: string;
  };
  mission: {
    title: string;
    description: string;
  };
  beliefs: {
    title: string;
    description: string;
    items: AboutBelief[];
  };
  background: {
    title: string;
    description: string;
    rows: AboutBackgroundRow[];
  };
  approach: {
    title: string;
    items: AboutBelief[];
  };
  /**
   * Company figures and team. Omitted until the team supplies real, verifiable
   * numbers and photos - the section renders only when this is present, so the
   * page never ships invented statistics or an empty frame.
   */
  facts?: {
    title: string;
    description: string;
    items: Array<{ label: string; value: string }>;
  };
  finalCta: {
    title: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
  };
  /** Longer-form SEO copy near the bottom, written for search intent. */
  seoText: {
    title: string;
    paragraphs: string[];
  };
  /** Long-tail Q&A, also emitted as FAQPage structured data. */
  faq: {
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
    label: string;
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
  /** The "latest articles" strip embedded on marketing pages such as the homepage. */
  recent: {
    title: string;
    description: string;
  };
  archives: {
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
    /** Added after a short category/tag/author description when there is room in a search result. */
    descriptionTopics: string;
    /** `{page}` is replaced with the page number. */
    pageTitle: string;
    pageDescription: string;
  };
  notFound: {
    title: string;
    description: string;
    backLabel: string;
  };
  /** The index page: lead story, topic sections, the full stream and the rail. */
  hub: {
    topStories: string;
    latest: string;
    /** `{count}` is replaced with the number of articles. */
    allCount: string;
    allShort: string;
    streamHeading: string;
    streamCount: string;
    picks: string;
    topics: string;
    rail: string;
    freeTools: string;
    /** `{count}` is replaced with the number of tools. */
    allTools: string;
  };
  search: {
    label: string;
    placeholder: string;
    empty: string;
    unavailable: string;
  };
  article: {
    breadcrumb: string;
    contents: string;
    share: string;
    shareOnLinkedIn: string;
    shareOnX: string;
    copyLink: string;
    linkCopied: string;
    keepReading: string;
  };
  /** Labels on the internal ads; their subjects come from the tool and feature pages. */
  promos: {
    product: string;
    productAlt: string;
    freeTool: string;
    openTool: string;
    inOpero: string;
    /** `{name}` is replaced with the feature's name. */
    featureLink: string;
  };
  cta: {
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
  /** Link text appended to the consent line, pointing at the privacy policy. */
  consentLinkLabel: string;
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
    title: string;
    description: string;
  };
  context: {
    title: string;
    paragraphs: string[];
  };
  form: ContactFormContent;
};

/** One block of a legal document: a heading and its body. */
export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  /** Term-and-explanation rows, for things like the list of processors. */
  rows?: Array<{ term: string; description: string }>;
};

export type PrivacyContent = {
  seo: SeoContent;
  hero: {
    title: string;
    description: string;
  };
  updatedLabel: string;
  /** ISO date, rendered by the page in the reader's locale. */
  updatedAt: string;
  sections: LegalSection[];
};

/* ---------- Free tools (/pl/narzedzia, /en/tools) ---------- */

export type ToolsIndexContent = {
  seo: SeoContent;
  /** The section's name in breadcrumbs and the footer. */
  navLabel: string;
  /** The breadcrumb's accessible name. */
  breadcrumbLabel: string;
  hero: { title: string; description: string };
  /** The accessible name of the category jump links under the hero. */
  jumpLabel: string;
  /** Why the tools can be trusted; icons are picked by position. */
  trust: Array<{ title: string; body: string }>;
  /** The tools, grouped for the page and its headings. Every live tool belongs to one group. */
  categories: Array<{ id: string; title: string; description: string; tools: ToolKey[] }>;
  /** The longer index card for each tool: what it does and three things it covers. */
  cards: Record<ToolKey, { description: string; highlights: string[] }>;
  cardCta: string;
  faq: { title: string; items: Array<{ question: string; answer: string }> };
  opero: { title: string; body: string; primaryCta: string; secondaryCta: string };
};

/** The server-rendered parts every tool page shares; the widget's own labels live with the tool. */
export type ToolPageContent = {
  seo: SeoContent;
  /** The tool's name in breadcrumbs, the index and the "other tools" links. */
  navLabel: string;
  navDescription: string;
  hero: { title: string; description: string };
  explainer: {
    title: string;
    paragraphs: string[];
    table?: { caption: string; columns: string[]; rows: string[][] };
    /** Our blog guide on the topic, linked under the paragraphs. */
    guide?: { label: string; href: string };
  };
  faq: { title: string; items: Array<{ question: string; answer: string }> };
  /** Official sources and the date the rules on the page were last checked. */
  sources?: {
    title: string;
    updatedLabel: string;
    /** ISO date, rendered in the page's locale. */
    updatedAt: string;
    note: string;
    items: Array<{ label: string; href?: string }>;
  };
  opero: {
    title: string;
    body: string;
    primaryCta: string;
    secondaryCta: string;
    /** What Opero does for the job the tool covers, shown as a row under the pitch. */
    points: Array<{ title: string; body: string }>;
  };
  otherToolsTitle: string;
};

/** The amount-in-words page: the shared parts plus a server-rendered table of common amounts. */
export type AmountInWordsPageContent = ToolPageContent & {
  examples: { title: string; intro: string; columns: string[]; amounts: string[] };
};

/** Exactly the copy the amount-in-words widget needs, and nothing more. */
export type AmountInWordsLabels = {
  amountLabel: string;
  placeholder: string;
  currencyLegend: string;
  examplesLabel: string;
  examples: string[];
  defaultAmount: string;
  /** One heading per result shown; the English page shows Polish and English. */
  resultHeadings: { pl: string; en?: string };
  copy: string;
  copied: string;
  privacyNote: string;
  emptyHint: string;
  errors: { decimals: string; invalid: string; tooLarge: string; negative: string };
  optionsLegend: string;
  sayOneLabel: string;
  capitalizeLabel: string;
};

/** Exactly the copy the White List widget needs. */
export type WhiteListLabels = {
  nipLabel: string;
  nipPlaceholder: string;
  accountLabel: string;
  accountHint: string;
  accountPlaceholder: string;
  dateLabel: string;
  dateHint: string;
  submit: string;
  checking: string;
  privacyNote: string;
  errors: {
    nip: string;
    account: string;
    date: string;
    network: string;
    limit: string;
    /** "{message}" is replaced with the API's own message. */
    api: string;
  };
  result: {
    title: string;
    notFound: string;
    notFoundHint: string;
    /** Display names for the API's statusVat values; unknown values are shown as they come. */
    statuses: Record<string, string>;
    statusLabel: string;
    nipLabel: string;
    regonLabel: string;
    krsLabel: string;
    residenceLabel: string;
    workingLabel: string;
    registeredLabel: string;
    removedLabel: string;
    restoredLabel: string;
    deniedLabel: string;
    representativesLabel: string;
    partnersLabel: string;
    accountsLabel: string;
    noAccounts: string;
    virtualAccounts: string;
    accountYes: string;
    accountNo: string;
    stateOnLabel: string;
    requestIdLabel: string;
    checkedAtLabel: string;
    copyId: string;
    copied: string;
    print: string;
    printTitle: string;
    printSource: string;
    officialSearch: string;
  };
};

/** The e-Delivery search page: the shared parts plus a server-rendered table of well-known institutions. */
export type EDeliveryPageContent = ToolPageContent & {
  popular: {
    title: string;
    /** "{date}" is replaced with the list date. */
    intro: string;
    columns: [string, string, string];
    /** Read from the gov.pl list at build time by REGON; a REGON missing from the list drops its row. */
    institutions: Array<{ regon: string; label: string }>;
  };
};

/** Exactly the copy the e-Delivery search needs. Templates use {placeholders}. */
export type EDeliveryLabels = {
  queryLabel: string;
  placeholder: string;
  submit: string;
  searching: string;
  /** The panel shown while registers answer: what is being read now, and a note once it takes a while. */
  loading: {
    stages: { list: string; whiteList: string; krs: string; ceidg: string; registers: string };
    note: string;
    slow: string;
  };
  /** The muted line under the field, by what the input looks like. */
  hints: { empty: string; text: string; nip: string; krs: string; regon: string };
  privacyNote: string;
  errors: {
    nip: string;
    regon: string;
    krs: string;
    number: string;
    short: string;
    /** Followed by a link labelled `krsSearch`. */
    krsNetwork: string;
    krsSearch: string;
    whiteListLimit: string;
    whiteListNetwork: string;
    searchUnavailable: string;
    ceidgLimit: string;
    ceidgUnavailable: string;
  };
  result: {
    copy: string;
    copied: string;
    regonLabel: string;
    krsLabel: string;
    nipLabel: string;
    legalFormLabel: string;
    seatLabel: string;
    townLabel: string;
    statusLabel: string;
    /** "{date}" */
    sourceGov: string;
    /** "{register}", "{state}", "{extracted}" */
    sourceKrs: string;
    registers: { P: string; S: string };
    foreignBranch: string;
    sourceCeidg: string;
    officialGov: string;
    /** "{krs}" */
    officialKrs: string;
    officialCeidg: string;
    noAdeTitle: string;
    noAdeBody: string;
    noAdeDutyP: string;
    noAdeNoDutyS: string;
    noAdeCeidg: string;
    eDeliveryApp: string;
    /** "{date}" */
    listDate: string;
    stale: string;
    showMore: string;
    /** "{shown}", "{total}" */
    shownOf: string;
    noInstitution: string;
    companyHint: string;
    nipNotFound: string;
    nipNotFoundHint: string;
    krsNotFound: string;
    /** "{krs}"; an entity struck off KRS has no current odpis. */
    krsRemoved: string;
    krsRemovedHint: string;
    regonNotFound: string;
    /** Display names for CEIDG statuses; unknown ones are shown as they come. */
    ceidgStatuses: Record<string, string>;
  };
};

/** Exactly the copy the counterparty check needs. Templates use {placeholders}. */
export type CounterpartyLabels = {
  queryLabel: string;
  placeholder: string;
  submit: string;
  checking: string;
  /** The muted line under the field, by what the input looks like. No request is made while typing. */
  hints: { empty: string; nip: string; krs: string; regon: string; vat: string; name: string };
  privacyNote: string;
  errors: { nip: string; regon: string; krs: string; vat: string; number: string; short: string };
  /** For a name: followed by links labelled `krsSearch` and `ceidgSearch`. */
  nameHint: string;
  krsSearch: string;
  ceidgSearch: string;
  /** The one-line summary; also the status row of each source. */
  summary: import("@/lib/tools/counterparty").CounterpartySummaryLabels;
  notFound: { nipTitle: string; nipHint: string; regonTitle: string; regonHint: string; krsTitle: string; krsHint: string };
  loading: string;
  registerPending: string;
  sources: { krs: string; ceidg: string; whiteList: string; vies: string };
  rows: {
    status: string;
    legalForm: string;
    krs: string;
    nip: string;
    regon: string;
    address: string;
    town: string;
    registeredOn: string;
    capital: string;
    pkd: string;
    representation: string;
    statement: string;
    opp: string;
    ade: string;
    proceeding: string;
    startedOn: string;
    suspendedOn: string;
    resumedOn: string;
    endedOn: string;
    deletedOn: string;
    vatRegisteredOn: string;
    accounts: string;
    vatRemoved: string;
    vatRestored: string;
    vatDenied: string;
    vatNumber: string;
    viesResult: string;
    name: string;
  };
  values: {
    registers: { P: string; S: string };
    /** "{period}", "{date}" */
    statement: string;
    /** "{period}" */
    statementNoDate: string;
    /** "{period}": a muted note when the last statement is more than 19 months old. */
    statementOld: string;
    noStatement: string;
    oppYes: string;
    /** "{type}", "{date}"; the signature and authority follow on a muted line. */
    proceedingOpen: string;
    /** "{type}", "{from}", "{to}" */
    proceedingEnded: string;
    proceedingEndedNoDate: string;
    /** "{entry}", "{final}" */
    deregistered: string;
    /** Account counts by plural category ("{count}"). */
    accounts: { one: string; few?: string; many?: string; other: string };
    noAccounts: string;
    virtualAccounts: string;
    vatStatuses: Record<string, string>;
    viesValid: string;
    viesInvalid: string;
    /** "{country}" */
    viesUnavailable: string;
    viesBusy: string;
    viesInput: string;
    viesNoName: string;
    northernIreland: string;
    partnershipOnlyHint: string;
    noNip: string;
  };
  source: {
    /** "{state}", "{extracted}" */
    krs: string;
    /** "{extracted}" */
    krsFull: string;
    /** "{time}" */
    ceidg: string;
    /** "{id}", "{time}" */
    whiteList: string;
    /** "{time}" */
    vies: string;
    openKrs: string;
    openCeidg: string;
    openWhiteList: string;
    openVies: string;
  };
  sourceErrors: {
    krsNetwork: string;
    krsLimit: string;
    krsFormat: string;
    ceidgLimit: string;
    ceidgUnavailable: string;
    whiteListLimit: string;
    whiteListNetwork: string;
    viesLimit: string;
    viesUnavailable: string;
    retry: string;
  };
  checkAccount: string;
  eDeliveryLink: string;
  copy: string;
  copied: string;
  /** "{full}", "{krz}", "{rdf}" are replaced by links. */
  links: { full: string; krz: string; rdf: string; line: string };
  print: {
    button: string;
    copyIds: string;
    title: string;
    /** "{query}" */
    query: string;
    /** "{time}" */
    printedAt: string;
    krs: string;
    ceidg: string;
    whiteList: string;
    vies: string;
    requestId: string;
    checkedAt: string;
    stateOn: string;
    extractedAt: string;
    footer: string;
  };
};

/** Exactly the copy the KSeF viewer needs. */
export type KsefViewerLabels = {
  dropTitle: string;
  dropHint: string;
  pasteSummary: string;
  pasteLabel: string;
  pasteSubmit: string;
  privacyNote: string;
  /** "{file}" is replaced with the file name. */
  errors: { xml: string; notInvoice: string; tooLarge: string; read: string };
  listTitle: string;
  listColumns: { seller: string; number: string; date: string; total: string };
  open: string;
  remove: string;
  print: string;
  kinds: Record<string, string>;
  invoice: {
    issueDate: string;
    issuePlace: string;
    saleDate: string;
    salePeriod: string;
    seller: string;
    buyer: string;
    others: string;
    taxId: string;
    email: string;
    phone: string;
    customerNumber: string;
    role: string;
    roles: Record<string, string>;
    lines: {
      title: string;
      no: string;
      name: string;
      quantity: string;
      unitNet: string;
      unitGross: string;
      discount: string;
      net: string;
      gross: string;
      vatRate: string;
      before: string;
    };
    rates: Record<string, string>;
    vatSummary: { title: string; rate: string; net: string; vat: string; vatPln: string };
    vatKeys: Record<string, string>;
    total: string;
    exchangeRate: string;
    annotationsTitle: string;
    annotations: Record<string, string>;
    exemptionBasis: string;
    correctionTitle: string;
    correctionReason: string;
    correctionType: string;
    correctionTypes: Record<string, string>;
    correctedInvoice: string;
    paymentTitle: string;
    paid: string;
    paidOn: string;
    due: string;
    method: string;
    methods: Record<string, string>;
    accounts: string;
    notesTitle: string;
    footerTitle: string;
    krs: string;
    regon: string;
    bdo: string;
    ksefNumber: string;
    technical: string;
    schema: string;
    createdAt: string;
    system: string;
  };
  warningsTitle: string;
  warnings: Record<"totals" | "lines" | "seller" | "number", string>;
  warningsNote: string;
};

/** Exactly the copy the VAT calculator needs. Templates use {placeholders}. */
export type VatCalculatorLabels = {
  modeLabel: string;
  modes: { quick: string; invoice: string };
  rateLegend: string;
  rates: Record<"23" | "8" | "5" | "0" | "zw" | "np", string>;
  net: string;
  vat: string;
  gross: string;
  notApplicable: string;
  hint: string;
  wordsLabel: string;
  copyAmounts: string;
  copySummary: string;
  copied: string;
  /** "{rate}" */
  formula: string;
  formulaNoVat: string;
  /** "{rate}", "{gross}", "{belowNet}", "{belowGross}", "{aboveNet}", "{aboveGross}" */
  nearest: string;
  errors: { invalid: string; noVat: string };
  largePayment: { before: string; link: string; after: string };
  priceBasisLabel: string;
  priceBasis: { net: string; gross: string };
  columns: { name: string; quantity: string; priceNet: string; priceGross: string; rate: string; net: string; vat: string; gross: string };
  /** "{column}", "{n}" */
  cellLabel: string;
  removeRow: string;
  addRow: string;
  methodLabel: string;
  methods: { sumNet: string; sumGross: string; line: string };
  summaryCaption: string;
  /** "{net}", "{vat}" */
  totals: string;
  amountDue: string;
  /** "{other}", "{vat}", "{diff}", "{direction}" */
  difference: string;
  otherMethod: { sum: string; line: string };
  more: string;
  less: string;
  privacyNote: string;
  currency: string;
  decimalSeparator: "," | ".";
  copyText: { rate: string; total: string };
  /** Prefilled so the page shows a worked example on arrival. */
  defaultAmount: string;
  defaultRows: Array<{ name: string; price: string }>;
};

/** Exactly the copy the NBP exchange-rate tool needs. Templates use {placeholders}. */
export type NbpRateLabels = {
  currencyLabel: string;
  tableGroups: { A: string; B: string };
  dateLabel: string;
  dateHint: string;
  loading: string;
  /** "{date}", "{weekday}" */
  dateWithWeekday: string;
  /** "{date}", "{no}" */
  source: string;
  /** "{date}" */
  reasonIntro: string;
  /** "{days}", "{reason}" */
  dayOff: string;
  /** Names of the days without a table: weekends and Polish public holidays. */
  dayOffNames: Record<
    | "saturday"
    | "sunday"
    | "weekend"
    | "newYear"
    | "epiphany"
    | "easter"
    | "easterMonday"
    | "labourDay"
    | "constitutionDay"
    | "pentecost"
    | "corpusChristi"
    | "assumption"
    | "allSaints"
    | "independenceDay"
    | "christmasEve"
    | "christmas"
    | "boxingDay",
    string
  >;
  tableBNote: string;
  /** "{date}" */
  pending: { A: string; B: string };
  pendingLatest: string;
  noteLabel: string;
  copyNote: string;
  copied: string;
  amountTitle: string;
  /** "{code}" */
  amountLabel: string;
  basisLabel: string;
  basis: { net: string; gross: string };
  rateLegend: string;
  rates: Record<"23" | "8" | "5" | "0" | "zw" | "np", string>;
  columns: { item: string; foreign: string; pln: string };
  net: string;
  vat: string;
  gross: string;
  vatNote: string;
  copyAmounts: string;
  vatLink: { before: string; link: string; after: string };
  errors: { date: string; amount: string; network: string; none: string };
  privacyNote: string;
  /** "zł" on the Polish page, "PLN" on the English one. */
  pln: string;
  decimalSeparator: "," | ".";
  defaultAmount: string;
};

/** The B2B vs employment page: the shared parts plus a server-rendered table of break-even invoices. */
export type B2bVsEmploymentPageContent = ToolPageContent & {
  breakEvenTable: {
    title: string;
    intro: string;
    /** Gross salary, take-home on the contract, then one column per tax form. */
    columns: string[];
    /** Gross monthly salaries in whole złoty. */
    salaries: number[];
    note: string;
  };
};

/** Exactly the copy the B2B vs employment calculator needs. Templates use {placeholders}. */
export type B2bVsEmploymentLabels = {
  grossLabel: string;
  invoiceLabel: string;
  breakEvenButton: string;
  employerCostButton: string;
  employmentTitle: string;
  b2bTitle: string;
  kupLegend: string;
  kup: { standard: string; commuter: string };
  pit2: string;
  under26: string;
  ppk: string;
  formLegend: string;
  forms: { skala: string; liniowy: string; ryczalt: string };
  ryczaltRateLabel: string;
  /** One option per rate in the config, keyed by basis points ("1200"). */
  ryczaltRates: Record<string, string>;
  zusLegend: string;
  zus: { full: string; preferential: string; start: string };
  sickness: string;
  costsLabel: string;
  daysOffLabel: string;
  daysOffHint: string;
  formerEmployer: string;
  formerEmployerNote: string;
  unavailable: { formerEmployer: string; revenueLimit: string };
  periodLabel: string;
  period: { month: string; year: string };
  resultCaption: string;
  rows: { net: string; social: string; health: string; pit: string; ppk: string; costs: string; companyCost: string };
  /** "{year}", "{month}" */
  difference: { more: string; less: string; equal: string };
  /** "{form}", "{amount}" */
  breakEven: string;
  breakEvenNone: string;
  /** "{edge}", "{health}" */
  tierEdge: string;
  insert: string;
  formsTitle: string;
  formsColumns: { form: string; netMonth: string; netYear: string; health: string; tax: string };
  monthsTitle: string;
  monthsColumns: { month: string; social: string; health: string; advance: string; ppk: string; net: string; cost: string; note: string };
  monthNames: string[];
  notes: { cap: string; bracket: string; youth: string };
  copySummary: string;
  copied: string;
  /** "{gross}", "{month}", "{year}" */
  copyEmployment: string;
  /** "{invoice}", "{options}", "{month}", "{year}" */
  copyB2b: string;
  errors: { amount: string; days: string };
  disclaimer: string;
  privacyNote: string;
  /** "{amount}": "{amount} zł" on the Polish page, "PLN {amount}" on the English one. */
  money: string;
  decimalSeparator: "," | ".";
  defaultGross: string;
  defaultInvoice: string;
};

/** The salary calculator page: the shared parts plus a server-rendered table of take-home pay for common amounts. */
export type SalaryCalculatorPageContent = ToolPageContent & {
  examples: {
    title: string;
    intro: string;
    /** Gross, take-home on UoP, zlecenie and dzieło, then the UoP employer cost. */
    columns: string[];
    /** Gross monthly amounts in whole złoty. */
    amounts: number[];
    note: string;
  };
};

/** Exactly the copy the salary calculator needs. Templates use {placeholders}. */
export type SalaryCalculatorLabels = {
  contractLegend: string;
  contracts: { employment: string; mandate: string; work: string; compare: string };
  directionLegend: string;
  direction: { grossToNet: string; netToGross: string };
  yearLabel: string;
  /** Shown under the year switch while the year's PIT scale is still a bill. */
  scaleBill: string;
  grossLabel: string;
  netLabel: string;
  netToGrossHint: string;
  kupLegend: string;
  kup: { standard: string; commuter: string };
  civilKupLegend: string;
  civilKup: { standard: string; author: string };
  statusLabel: string;
  status: { only: string; student: string; secondJob: string; ownEmployer: string };
  workOwnEmployer: string;
  sickness: string;
  pit2: string;
  pit2Hint: string;
  reliefLabel: string;
  reliefs: { none: string; under26: string; returnee: string; family4: string; senior: string };
  reliefUnavailable: string;
  ppk: string;
  moreOptions: string;
  accidentLabel: string;
  accidentHint: string;
  /** One sentence on why rows are missing, per situation. "{limit}", "{minimum}" */
  situationNotes: { student: string; secondJob: string; ownEmployer: string; work: string; workOwnEmployer: string; relief: string };
  /** "{amount}" */
  headline: string;
  /** "{amount}" */
  headlineAverage: string;
  /** "{amount}" */
  grossResult: string;
  /** "{target}", "{net}" */
  inexactNet: string;
  noGross: string;
  /** "{minimum}" */
  belowMinimum: string;
  flatTaxNote: string;
  /** "{threshold}", "{amount}" */
  yearlyNote: string;
  employeeTitle: string;
  employerTitle: string;
  rows: {
    gross: string;
    pension: string;
    disability: string;
    sickness: string;
    health: string;
    kup: string;
    taxBase: string;
    advance: string;
    flatTax: string;
    ppk: string;
    net: string;
    accident: string;
    labourFund: string;
    fgsp: string;
    employerCost: string;
  };
  /** The muted "where this comes from" line under each row. */
  how: {
    /** "{rate}", "{base}" */
    rateOf: string;
    /** "{rate}", "{base}" */
    health: string;
    /** "{rate}", "{base}" */
    civilKup: string;
    fixedKup: string;
    /** "{revenue}", "{social}", "{kup}" */
    taxBase: string;
    /** "{rate}", "{base}" */
    advance: string;
    /** "{amount}" */
    reduction: string;
    advanceScale: string;
    /** "{limit}" */
    exempt: string;
    /** "{rate}" */
    flatTax: string;
    /** "{cap}" */
    capped: string;
    /** "{minimum}" */
    noLabourFund: string;
    net: string;
    employerCost: string;
    noEmployerContributions: string;
  };
  monthsTitle: string;
  monthsColumns: { month: string; social: string; health: string; advance: string; net: string; cost: string; note: string };
  monthNames: string[];
  yearRow: string;
  notes: { cap: string; bracket: string; bracketCivil: string; relief: string; authorCap: string };
  compareCaption: string;
  compareRows: { netMonth: string; netYear: string; costMonth: string; costYear: string };
  compareNote: string;
  compareB2b: { before: string; link: string; after: string };
  copyBreakdown: string;
  copySummary: string;
  copied: string;
  /** "{contract}", "{gross}", "{net}", "{cost}", "{year}" */
  summary: string;
  errors: { amount: string; accident: string };
  disclaimer: string;
  privacyNote: string;
  /** "{amount}": "{amount} zł" on the Polish page, "PLN {amount}" on the English one. */
  money: string;
  decimalSeparator: "," | ".";
  defaultGross: string;
};

/** The working-time page: the shared parts plus server-rendered year tables (one per year in `workingTimeYears`). */
export type WorkingTimePageContent = ToolPageContent & {
  years: {
    /** "{year}" */
    title: string;
    /** The wrapper's anchor: "rok-{year}". */
    anchor: string;
    /** "{year}", "{hours}", "{days}" */
    intro: string;
    /** "{businessDays}", "{saturdays}": the second sentence, by the number of Saturday holidays. */
    businessNone: string;
    businessOne: string;
    businessMany: string;
    hours: PluralForms;
    days: PluralForms;
    /** Nominative month names. */
    months: string[];
    /** Month, hours, days in the norm, Mon–Fri working days, days off, holidays. */
    columns: string[];
    /** "{year}" */
    caption: string;
    totalLabel: string;
    /** "{quarters}", "{thirds}", "{halves}": hours joined with " · ". */
    totals: string;
    /** "{half}", "{threeQuarters}", "{healthcare}" */
    variants: string;
    /** "{year}" */
    holidaysTitle: string;
    /** Added after a Saturday holiday in the list. */
    saturdayNote: string;
    /** Added after a Sunday holiday in the list. */
    sundayNote: string;
    /** Between holiday dates: " i ", " and ". */
    and: string;
  };
};

/** Exactly the copy the working-time widget needs. Templates use {placeholders}. */
export type WorkingTimeLabels = {
  modeLabel: string;
  modes: { period: string; range: string };
  yearLabel: string;
  startMonthLabel: string;
  lengthLabel: string;
  /** "{n}": "{n} mies." */
  lengthOption: string;
  fromLabel: string;
  toLabel: string;
  fractionLabel: string;
  fullTimeOption: string;
  otherFraction: string;
  customFractionLabel: string;
  customFractionPlaceholder: string;
  dailyNormLabel: string;
  dailyNormOptions: Record<DailyNorm, string>;
  /** Plural forms with "{n}". */
  normDays: PluralForms;
  /** "{hours}" */
  fullTimeNorm: string;
  rows: { businessDays: string; daysOff: string; calendarDays: string; period: string };
  /** "{dates}": why the days in the norm are fewer than the working days. */
  gapOne: string;
  gapMany: string;
  gapPartTime: string;
  holidaysTitle: string;
  noHolidays: string;
  /** "{date}", "{weekday}", "{name}", "{effect}" */
  holidayLine: string;
  /** "{hours}" */
  effects: { lowers: string; saturday: string; saturdayPartTime: string; sunday: string };
  breakdownCaption: string;
  breakdownColumns: { month: string; norm: string; normDays: string; businessDays: string };
  nominalNote: string;
  roundingNote: string;
  futureNote: string;
  longRangeNote: string;
  /** Joins two dates in a sentence: " i ". */
  and: string;
  copy: string;
  copied: string;
  privacyNote: string;
  errors: { fraction: string; dates: string; range: string };
  summary: WorkingTimeSummaryLabels;
};

/** The JPK viewer page: the shared parts plus a server-rendered section on the markers a JPK_V7 row carries. */
export type JpkViewerPageContent = ToolPageContent & {
  markers: {
    title: string;
    intro: string;
    tables: Array<{ caption: string; columns: [string, string]; rows: Array<[string, string]> }>;
  };
};

/** Copy for one check, by status. Templates use {file}, {computed}, {diff}, {field}, {fieldLabel}, {register}, {rows}, {names}, {version}, {period}. */
export type JpkCheckCopy = { ok?: string; warn?: string; info?: string };

/** Exactly the copy the JPK viewer needs. Templates use {placeholders}. */
export type JpkViewerLabels = {
  dropTitle: string;
  dropHint: string;
  privacyNote: string;
  /** "{percent}" */
  reading: string;
  errors: {
    xml: string;
    notJpk: string;
    tooLarge: string;
    read: string;
    /** "{structure}" */
    unsupported: string;
  };
  loadAnother: string;
  print: string;
  purposes: Record<"1" | "2", string>;
  /** "{code}" */
  taxOffice: string;
  /** "{date}" */
  createdAt: string;
  months: string[];
  quarters: string[];
  taxId: string;
  email: string;
  phone: string;
  keyNumbers: {
    outputTax: string;
    inputTax: string;
    payable: string;
    refund: string;
    carried: string;
    registerDifference: string;
    /** "{sales}", "{purchases}" */
    rows: string;
    noRegister: string;
  };
  tabs: { summary: string; declaration: string; sales: string; purchases: string };
  checksTitle: { warn: string; info: string; ok: string };
  checksNote: string;
  checks: Record<JpkCheckId, JpkCheckCopy>;
  fpHint: string;
  registerNames: Record<"sales" | "purchases", string>;
  /** "{list}" */
  rowsList: string;
  /** "{count}" */
  moreRows: string;
  summary: {
    vatTitle: string;
    vatColumns: { rate: string; base: string; tax: string };
    vatRates: Record<VatRateKey, string>;
    ksefTitle: string;
    ksefColumns: { kind: string; sales: string; purchases: string };
    ksefKinds: Record<KsefKind, string>;
    ksefNotApplicable: string;
    gtuTitle: string;
    proceduresTitle: string;
    docTypesTitle: string;
    codeColumns: { code: string; description: string; rows: string; base: string; sales: string; purchases: string };
    customersTitle: string;
    suppliersTitle: string;
    contractorColumns: { name: string; rows: string; base: string; tax: string };
    none: string;
  };
  declaration: {
    groups: { output: string; input: string; settlement: string; extra: string; other: string };
    columns: { code: string; label: string; declared: string; register: string; diff: string };
    yes: string;
    none: string;
    v7kNote: string;
    form: string;
    quarter: string;
  };
  /** Short labels for declaration positions, by code ("P_19"); register fields reuse them ("K_19"). */
  fields: Record<string, string>;
  gtu: Record<string, string>;
  procedures: Record<string, string>;
  docTypes: Record<string, string>;
  table: {
    search: string;
    searchPlaceholder: string;
    ksefFilter: string;
    gtuFilter: string;
    procedureFilter: string;
    docTypeFilter: string;
    all: string;
    onlyIssues: string;
    export: string;
    columns: {
      lp: string;
      customer: string;
      supplier: string;
      document: string;
      issueDate: string;
      receivedDate: string;
      ksef: string;
      base: string;
      net: string;
      tax: string;
      marks: string;
    };
    sortBy: string;
    totals: string;
    totalsWithoutFp: string;
    /** "{from}", "{to}", "{total}" */
    range: string;
    previous: string;
    next: string;
    page: string;
    noRows: string;
    showDetails: string;
    copy: string;
    copied: string;
    invalidKsef: string;
    badDebt: string;
    imported: string;
    detail: {
      country: string;
      saleDate: string;
      dueDate: string;
      paidDate: string;
      marginGross: string;
      marginPurchase: string;
    };
  };
  csv: JpkCsvLabels & { salesFile: string; purchasesFile: string };
};

/** The late payment interest page: the shared parts plus the server-rendered rate tables. */
export type LateInterestPageContent = ToolPageContent & {
  rateTable: {
    title: string;
    intro: string;
    /** Period, standard debtor, public healthcare debtor, announcement. */
    columns: string[];
    /** "{year}" */
    halves: { first: string; second: string };
    /** Shown in both rate columns before 2020, when one rate applied to every debtor. */
    oneRateNote: string;
    civilTitle: string;
    civilIntro: string;
    /** From, rate, announcement. */
    civilColumns: string[];
    /** For a rate derived from the NBP reference rate, with no announcement found. */
    derived: string;
  };
};

/** Exactly the copy the late payment interest calculator needs. Templates use {placeholders}. */
export type LateInterestLabels = {
  modeLabel: string;
  modes: { commercial: string; civil: string };
  healthcareLabel: string;
  compensationLabel: string;
  columns: { label: string; amount: string; due: string; paid: string };
  labelPlaceholder: string;
  amountHint: string;
  paidHint: string;
  unpaidLabel: string;
  /** "{n}" */
  invoiceName: string;
  /** "{column}", "{n}" */
  cellLabel: string;
  removeRow: string;
  addRow: string;
  /** "{max}" */
  maxRows: string;
  untilLabel: string;
  untilHint: string;
  total: string;
  /** "{interest}", "{compensation}" */
  totalBreakdown: string;
  resultColumns: { period: string; days: string; rate: string; interest: string };
  /** "{amount}", "{due}", "{end}", "{days}" */
  invoiceSummary: string;
  /** "{date}" */
  paidOn: string;
  /** "{date}" */
  unpaidUntil: string;
  days: { one: string; many: string };
  interest: string;
  /** "{eur}", "{mid}", "{no}", "{date}", "{pln}" */
  compensation: string;
  /** "{eur}" */
  compensationEur: string;
  compensationLoading: string;
  compensationFailed: string;
  retry: string;
  /** "{month}", "{mid}", "{no}" */
  compensationPending: string;
  flatCompensationNote: string;
  /** "{days}", "{reason}" */
  dayOff: string;
  /** "{list}", "{date}" */
  shifted: string;
  dayOffNames: NbpRateLabels["dayOffNames"];
  forecastMark: string;
  /** "{date}" */
  forecastNote: string;
  errors: { amount: string; due: string; beforeFirst: string; paid: string; notLate: string; until: string };
  /** The heading of the copy text and the print view, per mode. */
  titles: { commercial: string; civil: string };
  copyNote: string;
  copied: string;
  print: string;
  privacyNote: string;
  /** "zł" on the Polish page, "PLN" on the English one. */
  pln: string;
  decimalSeparator: "," | ".";
  defaultAmount: string;
  defaultLabel: string;
};
