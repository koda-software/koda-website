import type { FeaturePageContent } from "@/content/types";

export const documentsFeature: FeaturePageContent = {
  seo: {
    title: "Document Workflow and File Management (DMS) | Opero",
    description:
      "Register documents, route them through approval and keep file versions with the case. Document workflow and DMS in one platform: Opero.",
  },
  navLabel: "Documents and files",
  hero: {
    eyebrow: "System features",
    title: "Document workflow - documents under control from intake to archive",
    description:
      "Register documents, route them through approval and keep every file version with the case, instead of scattered across inboxes and drives.",
    primaryCta: "Book a demo",
    secondaryCta: "See Opero in action",
  },
  intro: {
    eyebrow: "In short",
    paragraph:
      "Opero combines document workflow with file management: a document has its own record, an approval path and a complete set of versioned files. All of it with a full history and access control.",
  },
  demo: {
    kind: "documents",
    inboxLabel: "Inbox",
    mail: { file: "invoice-panorama-hotel.pdf", from: "from: office@panorama.com" },
    record: {
      title: "Cost invoice",
      numberLabel: "Number",
      number: "CI/2026/0142",
      partyLabel: "Supplier",
      party: "Panorama Hotel Ltd.",
      amountLabel: "Gross amount",
      amount: "24,800.00 PLN",
    },
    pathLabel: "Approval path",
    condition: "Amount ≥ 10,000 PLN?",
    branches: [
      { title: "Approval: Board", detail: "2 signatures required" },
      { title: "Approval: Manager", detail: "path skipped" },
    ],
    versionsLabel: "File versions",
    versions: [
      { file: "invoice.pdf", detail: "scan from e-mail" },
      { file: "invoice.pdf", detail: "line 3 corrected" },
      { file: "invoice.pdf", detail: "approved" },
    ],
    currentLabel: "current",
    captions: { intake: "A document arrives and <b>becomes a record by itself</b>", numbering: "The number is assigned <b>automatically</b>", path: "The approval path <b>depends on the amount</b>", versions: "Every file is versioned — <b>nothing gets lost</b>" },
  },
  blocks: {
    eyebrow: "What you get",
    title: "Record, approval path and files as one whole.",
    items: [
      {
        title: "Document registration",
        description:
          "Every document type (letter, invoice, request) is a custom object with its own fields, numbering and record view.",
      },
      {
        title: "Approval flow",
        description:
          "The document moves through defined stages: assignment, review, approval, archiving.",
      },
      {
        title: "Intake forms",
        description:
          "Controlled registration and assignment views, different for the front office, the department and the approver.",
      },
      {
        title: "Files and versioning",
        description:
          "Attachments bound to the record: stored, versioned and searchable, with permission control.",
      },
      {
        title: "Document templates",
        description:
          "Generate contracts, letters and decisions from record data using templates with variables, always in the current version.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Next step",
    title: "Put document flow in order.",
    description: "See how Opero carries a document from intake to archive with no gaps and no lost files.",
    primaryCta: "Book a demo",
  },
  seoText: {
    eyebrow: "More about this",
    title: "Documents under control from intake to archive.",
    paragraphs: [
      "Electronic document workflow in Opero puts every letter, request and invoice on a controlled path: from intake, through assignment and approvals, to archiving. A document gets its own record built as a custom object, with intake fields and numbering, plus a flow built on stages and transitions. That makes it clear where a case is and whose desk it is on.",
      "The file-management layer keeps files where they belong: attached to the case record. Attachments are stored, versioned and searchable, with permission control, so documents do not get lost across drives and inboxes. Document templates generate a contract, decision or letter straight from record data, always in the current version and format.",
      "Combining document workflow and file management on one platform means the flow, the data and the files are not split across separate tools. That is a shorter path for a case, less manual retyping, and a full history for control and compliance.",
    ],
  },
  faq: {
    eyebrow: "Questions",
    title: "Frequently asked questions.",
    items: [
      {
        question: "What is the difference between document workflow and a DMS?",
        answer:
          "Document workflow is the path a document takes through the company (registration, approvals, archiving). A DMS manages the files themselves: storage, versioning, search and permissions. Opero combines both.",
      },
      {
        question: "Can documents be generated automatically?",
        answer: "Yes. Document templates produce finished letters and contracts from record data, combining variables with fixed content.",
      },
    ],
  },
  related: {
    eyebrow: "Related features",
    title: "See also",
    items: ["processes", "noCode", "security"],
  },
};
