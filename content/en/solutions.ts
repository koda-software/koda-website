import { localizePath } from "@/lib/i18n/routes";
import type { SolutionsContent } from "../types";

export const solutionsContent: SolutionsContent = {
  seo: {
    title: "Industry Solutions: Workflow and Documents",
    description:
      "Opero in healthcare, logistics, manufacturing, field service, construction and retail. A workflow system and document management shaped around your industry.",
  },
  hero: {
    eyebrow: "Solutions",
    title: "No-code BPM for processes that off-the-shelf systems cannot handle.",
    description:
      "Every industry has work that standard systems struggle to describe: local procedures, approvals, exceptions, documents, roles and handoffs. In Opero you model it without losing control of the data.",
    supportLine: "Custom objects, processes, document workflow, automation, permissions and reports on one platform.",
    primaryCta: "Book a demo",
    secondaryCta: "Explore Opero",
  },
  industries: {
    eyebrow: "Industry fit",
    title: "Where Opero works best.",
    description:
      "Opero is strongest where the process is specific, the data model departs from the standard, and teams need both flexibility and a trail of what happened. It complements existing systems rather than replacing every specialist tool.",
    items: [
      {
        title: "Medical and healthcare operations",
        scenario: [
          "Healthcare organisations run many important processes outside their clinical records system: infrastructure tickets, equipment tracking, supplier coordination, document collection, internal approvals, inspection routines and recurring operational reports.",
          "In Opero you arrange these non-clinical flows around departments, equipment, counterparties, documents and approval stages. Permissions and the event log keep access under control, and teams can see what is open, overdue, incomplete or ready for the next step.",
        ],
        useCasesLabel: "Common uses",
        useCases: [
          "Equipment tickets, technical inspections and asset readiness across departments.",
          "Coordinating suppliers, contracts, documents, approvals and renewal dates.",
          "Non-clinical internal tickets: infrastructure cases, access requests, operational exceptions.",
          "Recurring operational reports without rebuilding the same spreadsheet every week.",
        ],
        helpfulFeaturesLabel: "Helpful Opero features",
        helpfulFeatures: [
          "Custom objects for equipment, departments, tickets, suppliers and documents.",
          "Roles, field permissions and separation by unit for controlled access.",
          "An event log for approvals, document changes and status updates.",
          "Automation rules for reminders, missing documents and recurring reports.",
        ],
        supportsLabel: "Opero handles",
        supports: ["Equipment and infrastructure tickets", "Supplier and counterparty flows", "Document collection and review", "Internal approvals and audit trail"],
      },
      {
        title: "Logistics and transport",
        scenario: [
          "Logistics teams live on exceptions: missing documents, carrier problems, warehouse handoffs, claims, vehicle inspections, delayed shipments and partner coordination. These processes change faster than a standard system can be reconfigured.",
          "In Opero you model transport exceptions, carrier records, document statuses, vehicle and warehouse checks, and approval paths. The team gets one place that shows what happened, who owns the next step and which cases are still waiting.",
        ],
        useCasesLabel: "Common uses",
        useCases: [
          "Shipment exceptions that need an owner, a status, evidence and follow-up actions.",
          "Transport documents, missing files, handoff notes and approval stages.",
          "Carrier and partner records with custom fields, contacts and process history.",
          "Warehouse checks, vehicle inspections, claims and recurring operational reports.",
        ],
        helpfulFeaturesLabel: "Helpful Opero features",
        helpfulFeatures: [
          "Custom objects for exceptions, with statuses, owners, deadlines and documents.",
          "Search across carriers, shipments, claims, documents and operational notes.",
          "Notifications and escalation rules for delayed or incomplete cases.",
          "An AI assistant for operational summaries and exception analysis.",
        ],
        supportsLabel: "Opero handles",
        supports: ["Transport exception flows", "Carrier and partner records", "Transport document statuses", "Operational alerts and next actions"],
      },
      {
        title: "Manufacturing and industrial operations",
        scenario: [
          "Manufacturing companies have many plant-specific processes: quality events, machine maintenance, inspections, internal tickets, supplier documents, nonconformances and production support. Such flows rarely fit inside generic ERP modules.",
          "In Opero you model the records and handoffs between production, quality, maintenance, purchasing and management. Data, owners, stages, documents and automation rules stay inside one process.",
        ],
        useCasesLabel: "Common uses",
        useCases: [
          "Quality events, inspection results, nonconformances and corrective actions.",
          "Machine maintenance cases, service notes, parts requests and asset readiness.",
          "Supplier documents, internal approvals and recurring compliance checks.",
          "Plant tickets that fit neither finance, nor the warehouse, nor production.",
        ],
        helpfulFeaturesLabel: "Helpful Opero features",
        helpfulFeatures: [
          "Custom objects for machines, inspections, quality events, suppliers and tickets.",
          "Process stages and owners across production, quality, maintenance and purchasing.",
          "Automation rules for reminders, status changes, notifications and scheduled checks.",
          "An event log and permissions for controlled operational changes.",
        ],
        supportsLabel: "Opero handles",
        supports: ["Machine and maintenance cases", "Quality and inspection records", "Supplier documentation flows", "Internal tickets and approval paths"],
      },
      {
        title: "Field service and maintenance",
        scenario: [
          "Service work depends on assets, locations, technicians, parts, deadlines, reports, photos and customer notes. When that information lives in separate tools, it is hard to tell which cases are waiting, which are blocked and which are ready to close.",
          "In Opero you keep service cases, devices, assignments, stages, checklists, files and reports on one record. Automation takes over reminders, scheduled checks, status changes and operational summaries.",
        ],
        useCasesLabel: "Common uses",
        useCases: [
          "Service cases from intake, through diagnosis and repair, to customer update and closing.",
          "Assets, devices, locations, technicians, checklists, photos, files and repair notes.",
          "Recurring maintenance, inspections and equipment readiness reports.",
          "A shared picture of the work for field teams and the back office.",
        ],
        helpfulFeaturesLabel: "Helpful Opero features",
        helpfulFeatures: [
          "Record views for service cases, assets, assignments, checklists and files.",
          "Process stages: intake, diagnosis, waiting for parts, in progress, ready, closed.",
          "Scheduled rules for checks, overdue reminders and daily reports.",
          "An AI assistant for summarising case history and operational reporting.",
        ],
        supportsLabel: "Opero handles",
        supports: ["Service cases and asset records", "Technician assignments and stages", "Checklists, files and repair notes", "Reminders and recurring reports"],
      },
      {
        title: "Construction and real estate operations",
        scenario: [
          "Construction and real estate operations involve changing sites, many contractors, inspections, handovers, document flows, defect reports, approvals and internal coordination. Every project has its own structure and still needs control.",
          "In Opero you model projects, site cases, contractor flows, inspection checklists, document statuses and approval stages. Operational information stays visible across projects, locations and partners.",
        ],
        useCasesLabel: "Common uses",
        useCases: [
          "Site cases, inspection results, handover tasks and remedial actions.",
          "Contractor records, documents, approvals, access requirements and status changes.",
          "Recurring reports across sites, properties, projects and regional teams.",
          "Document status, owner, deadline and next step in long investment processes.",
        ],
        helpfulFeaturesLabel: "Helpful Opero features",
        helpfulFeatures: [
          "Custom objects for projects, locations, contractors, documents, inspections and cases.",
          "Relation fields linking partners, locations, tickets, files and approval paths.",
          "Permissions for internal teams, departments, projects and individual companies.",
          "Notifications and rules for handovers, missing documents and overdue actions.",
        ],
        supportsLabel: "Opero handles",
        supports: ["Projects and site cases", "Contractor and partner coordination", "Document status flows", "Inspections, handovers and approvals"],
      },
      {
        title: "Retail, franchise, and multi-location operations",
        scenario: [
          "Retail and franchise organisations need consistent processes across many locations, while local teams handle the daily work: incidents, maintenance tickets, visit logs, equipment problems, audits, local approvals and branch reports.",
          "In Opero you model location records, permissions, scheduled checks, stages and reporting flows. Local teams get a simple structure for their own work, and head office keeps visibility across the whole network.",
        ],
        useCasesLabel: "Common uses",
        useCases: [
          "Incidents, maintenance tickets, visit logs, local approvals and equipment failures.",
          "Recurring branch checks, audits, compliance routines and operational reports.",
          "Local records while keeping one consistent view for head office.",
          "Remedial actions at franchise or branch level, with an owner and status history.",
        ],
        helpfulFeaturesLabel: "Helpful Opero features",
        helpfulFeatures: [
          "Records, processes, permissions and operational lists limited to a location.",
          "Scheduled automation for branch checks, reminders and status reports.",
          "Search and saved queries across locations, incidents, tickets and documents.",
          "Roles and separation by company for local teams and head office.",
        ],
        supportsLabel: "Opero handles",
        supports: ["Branch incidents and tickets", "Maintenance and equipment flows", "Recurring location checks", "Central reporting and local ownership"],
      },
    ],
  },
  pattern: {
    eyebrow: "The shared pattern",
    title: "Different industries, the same operational problems.",
    description:
      "The details change between industries, but the pattern is usually the same: important work does not fit the main system, so teams build side processes. Over time those become hard to search, automate, audit and improve.",
    problemLabel: "When this happens",
    supportLabel: "Opero answers with",
    rows: [
      { problem: "Teams keep their own records in spreadsheets", support: "Custom objects with fields, validation and search." },
      { problem: "Approvals happen over email and chat", support: "A process with stages, an owner and a deadline at every step." },
      { problem: "Documents are hard to find and link to a case", support: "Document workflow with file versioning on the record." },
      { problem: "Exceptions are handled manually", support: "A rule engine with notifications and escalation paths." },
      { problem: "Reports depend on manual exports", support: "Reports and dashboards on live data, with drill-down." },
    ],
  },
  fit: {
    eyebrow: "The fit",
    title: "When Opero is a good choice.",
    description:
      "Opero fits when a company needs more than a spreadsheet, more flexibility than an off-the-shelf module and more control than a loose internal tool.",
    goodFitTitle: "Good fit",
    goodFit: [
      "The process has its own records and fields that no standard module covers.",
      "Several teams work on the same flow.",
      "Ownership, status or a document's stage genuinely matters.",
      "The company needs permissions, compliance and a trail of changes.",
      "Processes change often enough that configuration beats rewriting code.",
    ],
    notBestFitTitle: "Not the best fit",
    notBestFit: [
      "The need is already fully covered by a specialist system.",
      "The process requires certified industry software that Opero does not replace.",
      "The company only needs a simple static site or a one-off form.",
    ],
  },
  finalCta: {
    eyebrow: "Start with the process",
    title: "Tell us how your operation works. We will tell you whether Opero fits.",
    description:
      "We will map the records, roles, documents, approvals and exceptions in your process, then show you what they would look like in the system.",
    primaryCta: "Book a demo",
    secondaryCta: "Explore Opero",
  },
};

export const solutionsCtas = {
  primary: localizePath("en", "contact"),
  secondary: localizePath("en", "opero"),
};
