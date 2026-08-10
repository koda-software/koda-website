import type { FeaturePageContent } from "@/content/types";

export const documentsFeature: FeaturePageContent = {
  seo: {
    title: "Document workflow and file management in Opero",
    description:
      "Register documents, run them through approval, and keep every file version with the case. Versioning, templates and access control included.",
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
  related: {
    eyebrow: "Related features",
    title: "See also",
    items: ["processes", "noCode", "security"],
  },
};
