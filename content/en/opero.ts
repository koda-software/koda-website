import { localizePath } from "@/lib/i18n/routes";
import type { OperoProductContent } from "../types";

export const operoProductContent: OperoProductContent = {
  seo: {
    title: "Opero - low-code BPM and document workflow",
    description:
      "Opero makes your company’s way of working visible, repeatable and easier to improve as the business changes.",
  },
  hero: {
    eyebrow: "Meet Opero",
    title: "Build the system around the way your company works.",
    brief:
      "Every company develops its own way of working. Opero makes that work visible, repeatable and easier to improve, without turning every change into another software project.",
    primaryCta: "Book a demo",
    secondaryCta: "Explore the platform",
    visual: {
      alt: "Opero CRM deals displayed on a Kanban board",
    },
  },
  connectedModel: {
    eyebrow: "The Opero idea",
    title: "One shared model. Every part of the work connected.",
    brief:
      "Instead of passing fragments of work between separate tools, Opero keeps the whole story together. What happened, who acted, what was decided and what comes next remain visible from start to finish.",
    comparison: {
      title: "Customer requests",
      ariaLabel: "Compare the list and task-board views of customer requests",
      beforeLabel: "List view",
      beforeAlt: "Customer requests displayed as a structured list in Opero",
      afterLabel: "Tasks board",
      afterAlt: "The same customer requests displayed as a workflow board in Opero",
    },
    story: {
      ariaLabel: "How a customer request becomes a working Opero process",
      previousLabel: "Show the previous step",
      nextLabel: "Show the next step",
      steps: [
        {
          title: "Define the information",
          image: {
            src: "/opero/customer-request-story/01-data-model.webp",
            alt: "Opero data model editor showing the fields of a customer request",
            width: 2094,
            height: 1691,
            magnifier: {
              src: "/opero/customer-request-story/01-magnifier.webp",
              alt: "Close-up of the field type selector with text, email, phone and VAT identifier options",
              width: 659,
              height: 657,
              placement: "model",
            },
          },
        },
        {
          title: "Design the form",
          image: {
            src: "/opero/customer-request-story/02-form-builder.webp",
            alt: "Opero form builder arranging the customer request intake form",
            width: 1937,
            height: 1267,
            magnifier: {
              src: "/opero/customer-request-story/02-magnifier.webp",
              alt: "Close-up of the finished intake form with its request fields and guidance",
              width: 596,
              height: 595,
              placement: "form",
            },
          },
        },
        {
          title: "Put it to work",
          image: {
            src: "/opero/customer-request-story/03-live-request.webp",
            alt: "Completed customer request in Opero with an attachment and workflow action",
            width: 2096,
            height: 1483,
            trimBottom: true,
            magnifier: {
              src: "/opero/customer-request-story/03-magnifier.webp",
              alt: "Close-up of the workflow action that moves a request from triage to in progress",
              width: 567,
              height: 567,
              placement: "record",
            },
          },
        },
        {
          title: "Automate the response",
          image: {
            src: "/opero/customer-request-story/04-automation.webp",
            alt: "Opero automation rule routing customer requests by category",
            width: 1909,
            height: 1532,
            magnifier: {
              src: "/opero/customer-request-story/04-magnifier.webp",
              alt: "Close-up of the automation branch that routes requests by category and handles errors",
              width: 529,
              height: 529,
              placement: "automation",
            },
          },
        },
        {
          title: "Shape the workflow",
          image: {
            src: "/opero/customer-request-story/05-workflow.webp",
            alt: "Opero workflow builder showing triage, in progress, resolved and rejected stages",
            width: 1937,
            height: 1267,
            magnifier: {
              src: "/opero/customer-request-story/05-magnifier.webp",
              alt: "Close-up of the workflow transitions from in progress to resolved or rejected",
              width: 422,
              height: 422,
              placement: "workflow",
            },
          },
        },
        {
          title: "Keep files with the record",
          image: {
            src: "/opero/documents/record-with-file-preview.webp",
            alt: "Opero spare-part record with metadata and a Files panel previewing an attached 3D model",
            width: 2480,
            height: 1887,
            magnifier: {
              src: "/opero/documents/files-panel-magnifier.webp",
              alt: "Close-up of the Files tab showing three attachments and the selected STL file details",
              width: 497,
              height: 494,
              placement: "documents",
            },
          },
        },
        {
          title: "Automate KSeF invoice handling",
          image: {
            src: "/opero/ksef/invoice-automation-rule.webp",
            alt: "Opero automation rule downloading a KSeF invoice, creating a cost invoice and generating its PDF visualisation",
            width: 1869,
            height: 1179,
            magnifier: {
              src: "/opero/ksef/pdf-step-magnifier.webp",
              alt: "Close-up of the automation step that renders a KSeF invoice as a PDF",
              width: 353,
              height: 353,
              placement: "ksef",
            },
          },
        },
        {
          title: "Classify and route work with AI",
          image: {
            src: "/opero/ai/ticket-triage-rule.webp",
            alt: "Opero ticket-triage rule using AI to categorize a ticket before routing it to the responsible department",
            width: 1869,
            height: 1179,
            magnifier: {
              src: "/opero/ai/categorization-step-magnifier.webp",
              alt: "Close-up of the AI step that categorizes an incoming ticket",
              width: 360,
              height: 360,
              placement: "ai",
            },
          },
        },
        {
          title: "Explore and export live reports",
          image: {
            src: "/opero/reporting/open-deals-report.webp",
            alt: "Opero report showing open deals grouped by stage with company filters, deal values and weighted values",
            width: 1879,
            height: 1314,
            magnifier: {
              src: "/opero/reporting/export-options-magnifier.webp",
              alt: "Close-up of report export options for the aggregated view or raw source rows in Excel and CSV formats",
              width: 316,
              height: 317,
              placement: "reports",
            },
          },
        },
        {
          title: "Keep collaboration in context",
          image: {
            src: "/opero/communication/comments-and-notifications.webp",
            alt: "Opero asset record showing a comment thread with mentions and reactions alongside the notifications panel",
            width: 1869,
            height: 1223,
            magnifier: {
              src: "/opero/communication/notifications-magnifier.webp",
              alt: "Close-up of notifications for comment reactions, mentions and assigned work",
              width: 528,
              height: 528,
              placement: "communication",
            },
          },
        },
        {
          title: "Control access across the company",
          image: {
            src: "/opero/access/company-asset-access.webp",
            alt: "Opero company access settings showing audiences and enabled or disabled overrides for individual assets",
            width: 1761,
            height: 1167,
            popover: {
              src: "/opero/access/access-diagnostics-popover.webp",
              alt: "Access diagnostics panel testing create, view and edit permissions for a selected company member",
              width: 1269,
              height: 572,
            },
          },
        },
      ],
    },
  },
  productTour: {
    eyebrow: "Explore the platform",
    title: "Eight capabilities. One Opero.",
    brief:
      "Every part of Opero works with the same operational context. Records, documents, decisions, permissions and history remain connected as work moves across the company.",
    exploreLabel: "Explore this feature",
    chapters: [
      {
        eyebrow: "01 / Shape the system",
        title: "Model the work in your own language.",
        brief:
          "Start from the way your teams already describe their work. Opero turns that structure into a system they can use and continue to evolve.",
        features: [
          {
            feature: "noCode",
            brief: "Build around your company’s language instead of forcing the company into someone else’s structure. Opero gives each team the records and screens its work actually requires.",
          },
        ],
      },
      {
        eyebrow: "02 / Run the work",
        title: "Move cases and documents through the company.",
        brief:
          "Every case follows a visible path, with a responsible person, current stage and next action. Teams know what is moving and what needs attention.",
        features: [
          {
            feature: "processes",
            brief: "Replace informal handovers with a visible path from intake to completion. Everyone can see what is happening, who is responsible and where attention is needed.",
          },
          {
            feature: "documents",
            brief: "Keep every file beside the record, people and decisions it belongs to. The business context remains available without searching through inboxes and shared drives.",
          },
        ],
      },
      {
        eyebrow: "03 / Automate and extend",
        title: "Let the platform handle the repeatable work.",
        brief:
          "Once the process is clear, Opero can handle the repeatable steps. Rules, integrations and AI keep work moving while people remain in control.",
        features: [
          {
            feature: "lowCode",
            brief: "Automate the work your team should not have to repeat. Routine decisions happen consistently, and every execution remains part of the process history.",
          },
          {
            feature: "integrations",
            brief: "Connect Opero to the services your company already depends on. Data can enter, update and continue through the process without losing its business context.",
          },
          {
            feature: "ai",
            brief: "AI in Opero is not limited to one predefined use. Give it the business context and an instruction, and it can carry out the job as part of the same controlled process.",
          },
        ],
      },
      {
        eyebrow: "04 / Understand and control",
        title: "See what is happening and govern who can act.",
        brief:
          "Opero makes activity measurable without separating oversight from daily work. The same platform shows the results and controls who can act.",
        features: [
          {
            feature: "reports",
            brief:
              "Build reports around the questions your company actually asks. Explore the data from different angles and move from a summary directly to its source.",
          },
          {
            key: "communication",
            label: "Communication and notifications",
            brief:
              "Collaboration stays connected to the case instead of disappearing into separate chats. Teams can ask, respond, react and follow decisions where the work happens.",
          },
          {
            feature: "security",
            brief:
              "Match access to the real structure of your organisation. Set shared rules, introduce precise exceptions and verify exactly what a selected user can do.",
          },
        ],
      },
    ],
  },
  customization: {
    eyebrow: "Your workspace",
    title: "Make it yours",
    brief:
      "Opero can feel like your company’s own system from the first login. Apply your logo, colours and preferred visual style without changing how the underlying work operates.",
    comparison: {
      title: "Executive dashboard",
      ariaLabel: "Compare the default Opero workspace with a fully branded dark workspace",
      beforeLabel: "Opero",
      beforeAlt: "Executive dashboard in the default light Opero workspace",
      afterLabel: "Your brand",
      afterAlt: "The same executive dashboard with a custom logo, colours and dark visual style",
    },
  },
  finalCta: {
    eyebrow: "See Opero in your process",
    title: "Bring us one process. We will show you what it could look like in Opero.",
    brief:
      "Tell us where work slows down or loses context. We will prepare a practical Opero walkthrough around that situation instead of giving you a generic product presentation.",
    primaryCta: "Book a demo",
    secondaryCta: "Explore solutions",
  },
};

export const operoProductCtas = {
  primary: localizePath("en", "contact"),
  secondary: localizePath("en", "solutions"),
};
