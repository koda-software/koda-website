import { localizePath } from "@/lib/i18n/routes";
import type { SolutionsContent } from "../types";

export const solutionsContent: SolutionsContent = {
  seo: {
    title: "Solutions - No-Code BPM for Industry Operations",
    description:
      "See how Opero supports healthcare, logistics, manufacturing, field service, construction, real estate, retail, and multi-location operations.",
  },
  hero: {
    eyebrow: "Solutions",
    title: "No-code BPM for processes that do not fit one template.",
    description:
      "Every industry has work that standard systems struggle to represent: local procedures, approvals, exceptions, documents, roles, and handoffs. Opero gives KodaSoft a configurable foundation to model that work without losing control.",
    supportLine: "Built for custom records, workflow automation, permissions, search, and practical AI assistance.",
    primaryCta: "Book a demo",
    secondaryCta: "Explore Opero",
  },
  industries: {
    eyebrow: "Industry fit",
    title: "Where Opero fits best.",
    description:
      "Opero is strongest when the process is specific, the data model is not standard, and teams need both flexibility and traceability. It can support operational work around existing systems rather than replacing every specialist tool.",
    items: [
      {
        title: "Medical and healthcare operations",
        scenario: [
          "Medical organizations often run many important processes outside the clinical record system: facility requests, equipment tracking, supplier coordination, document collection, internal approvals, inspection routines, and recurring operational reports.",
          "Opero can help structure these non-clinical workflows around departments, equipment, contractors, documents, statuses, and approvals. Permissions and audit logs keep access controlled while teams gain a clearer view of what is open, delayed, missing, or ready for the next step.",
        ],
        useCasesLabel: "Typical use cases",
        useCases: [
          "Tracking equipment requests, maintenance checks, and readiness status across departments.",
          "Coordinating suppliers, contractors, documents, approvals, and renewal workflows.",
          "Managing non-clinical internal requests such as facility issues, access needs, or operational exceptions.",
          "Preparing recurring operational reports without rebuilding the same spreadsheet every week.",
        ],
        helpfulFeaturesLabel: "Helpful Opero features",
        helpfulFeatures: [
          "Custom records for equipment, departments, requests, suppliers, and documents.",
          "Role-based permissions and organization boundaries for controlled access.",
          "Audit logs for approvals, document changes, and operational status updates.",
          "Automation rules for reminders, missing document follow-ups, and recurring reports.",
        ],
        supportsLabel: "Opero can support",
        supports: ["Equipment and facility request tracking", "Supplier and contractor workflows", "Document collection and review", "Internal approvals and audit trails"],
      },
      {
        title: "Logistics and transport",
        scenario: [
          "Logistics teams live with exceptions: missing documents, carrier issues, warehouse handoffs, claims, vehicle checks, delayed shipments, and partner coordination. These processes often move faster than fixed software configuration.",
          "Opero can model shipment-related exceptions, carrier records, document statuses, vehicle or warehouse checks, approvals, and operational alerts. It gives teams a controlled place to track what happened, who owns the next action, and which issues still need attention.",
        ],
        useCasesLabel: "Typical use cases",
        useCases: [
          "Managing shipment exceptions that need ownership, status, evidence, and follow-up.",
          "Tracking transport documents, missing files, handoff notes, and approval stages.",
          "Maintaining carrier and partner records with custom fields, contacts, and process history.",
          "Coordinating warehouse checks, vehicle checks, claims, and recurring operational reports.",
        ],
        helpfulFeaturesLabel: "Helpful Opero features",
        helpfulFeatures: [
          "Custom exception records with statuses, owners, deadlines, and linked documents.",
          "Search across carriers, shipments, claims, documents, and operational notes.",
          "Notifications and escalation rules for delayed or incomplete cases.",
          "AI-assisted reporting for operational summaries and exception analysis.",
        ],
        supportsLabel: "Opero can support",
        supports: ["Shipment exception workflows", "Carrier and partner records", "Transport document status tracking", "Operational alerts and follow-up actions"],
      },
      {
        title: "Manufacturing and industrial operations",
        scenario: [
          "Manufacturing companies often have plant-specific processes around quality events, machine maintenance, inspections, internal requests, supplier documents, nonconformance tracking, and production support. These workflows rarely fit cleanly into generic ERP modules.",
          "Opero can model the records and handoffs that sit between production, quality, maintenance, purchasing, and management. Teams can keep structured data, ownership, statuses, documents, and automation rules connected to the same process.",
        ],
        useCasesLabel: "Typical use cases",
        useCases: [
          "Tracking quality events, inspection results, nonconformances, and follow-up actions.",
          "Managing machine maintenance cases, service notes, parts requests, and readiness states.",
          "Coordinating supplier documentation, internal approvals, and recurring compliance checks.",
          "Handling plant-specific requests that do not belong cleanly in finance, inventory, or production modules.",
        ],
        helpfulFeaturesLabel: "Helpful Opero features",
        helpfulFeatures: [
          "Custom objects for machines, inspections, quality events, suppliers, and internal requests.",
          "Workflow statuses and ownership across production, quality, maintenance, and purchasing.",
          "Automation rules for reminders, status updates, notifications, and recurring checks.",
          "Audit logs and permissions for controlled operational changes.",
        ],
        supportsLabel: "Opero can support",
        supports: ["Machine and maintenance case tracking", "Quality and inspection records", "Supplier documentation workflows", "Internal requests and approval paths"],
      },
      {
        title: "Field service and maintenance",
        scenario: [
          "Service work depends on assets, locations, technicians, parts, deadlines, reports, photos, customer notes, and follow-up steps. When those details live in separate tools, it becomes hard to see which cases are waiting, blocked, or ready to close.",
          "Opero can structure service cases, devices, assignments, statuses, checklists, files, and reports. Automation can help with reminders, recurring checks, status updates, and operational summaries.",
        ],
        useCasesLabel: "Typical use cases",
        useCases: [
          "Managing service cases from intake through diagnosis, repair, customer update, and closure.",
          "Tracking assets, devices, locations, technicians, checklists, photos, files, and repair notes.",
          "Coordinating recurring maintenance routines, inspections, and readiness reports.",
          "Keeping back-office teams and field teams aligned on what is waiting, blocked, or finished.",
        ],
        helpfulFeaturesLabel: "Helpful Opero features",
        helpfulFeatures: [
          "Record views for service cases, assets, assignments, checklists, and files.",
          "Workflow statuses for intake, diagnosis, parts needed, in progress, ready, and closed.",
          "Scheduled rules for recurring checks, overdue reminders, and daily reports.",
          "AI-assisted summaries for case history and operational reporting.",
        ],
        supportsLabel: "Opero can support",
        supports: ["Service case and asset records", "Technician assignments and statuses", "Checklists, files, and repair notes", "Reminders and recurring reports"],
      },
      {
        title: "Construction and real estate operations",
        scenario: [
          "Construction and real estate operations involve changing sites, many contractors, inspections, handovers, document flows, issue tracking, approvals, and internal coordination. Every project may have its own structure while still needing control.",
          "Opero can model project records, site issues, contractor workflows, inspection checklists, document statuses, and approval steps. It gives teams a way to keep operational information visible across projects, locations, and partners.",
        ],
        useCasesLabel: "Typical use cases",
        useCases: [
          "Tracking site issues, inspection findings, handover tasks, and project-specific follow-ups.",
          "Managing contractor records, documents, approvals, access requirements, and status changes.",
          "Coordinating recurring reports across sites, properties, projects, or regional teams.",
          "Keeping document status, owner, deadline, and next action visible during long-running work.",
        ],
        helpfulFeaturesLabel: "Helpful Opero features",
        helpfulFeatures: [
          "Custom project, site, contractor, document, inspection, and issue records.",
          "Relation fields connecting partners, locations, issues, files, and approval paths.",
          "Permissions for internal teams, departments, projects, or organization scopes.",
          "Notifications and workflow rules for handovers, missing documents, and overdue actions.",
        ],
        supportsLabel: "Opero can support",
        supports: ["Project and site issue tracking", "Contractor and partner coordination", "Document status workflows", "Inspections, handovers, and approvals"],
      },
      {
        title: "Retail, franchise, and multi-location operations",
        scenario: [
          "Retail and franchise organizations need consistent processes across many locations while local teams handle daily operational work: incidents, maintenance requests, visitor logs, equipment issues, audits, local approvals, and branch-level reports.",
          "Opero can model location-specific records, permissions, recurring checks, statuses, and reporting workflows. Local teams get a simple structure for the work they perform, while central teams keep visibility across the organization.",
        ],
        useCasesLabel: "Typical use cases",
        useCases: [
          "Managing incidents, maintenance requests, visitor logs, local approvals, and equipment issues.",
          "Running recurring branch checks, audits, compliance routines, and operational reports.",
          "Tracking local records while giving headquarters a consistent view across all locations.",
          "Coordinating franchise or branch-level follow-ups without losing ownership or status history.",
        ],
        helpfulFeaturesLabel: "Helpful Opero features",
        helpfulFeatures: [
          "Location-scoped records, workflows, permissions, and operational lists.",
          "Recurring automation for branch checks, reminders, and status reports.",
          "Search and saved queries across locations, incidents, requests, and documents.",
          "Roles and organization boundaries for local and central teams.",
        ],
        supportsLabel: "Opero can support",
        supports: ["Branch incidents and requests", "Maintenance and equipment workflows", "Recurring location checks", "Central reporting and local ownership"],
      },
    ],
  },
  pattern: {
    eyebrow: "Common pattern",
    title: "Different industries, similar operational problems.",
    description:
      "The details change from one industry to another, but the pattern is often the same: important work does not fit the main system, so teams create side processes. Over time those side processes become hard to search, automate, audit, and improve.",
    problemLabel: "When this happens",
    supportLabel: "Opero can help by",
    rows: [
      { problem: "Teams track custom records in spreadsheets", support: "Creating structured, searchable record types." },
      { problem: "Approvals happen in email or chat", support: "Moving ownership and status into a governed workflow." },
      { problem: "Documents are hard to follow", support: "Linking files, statuses, and next actions to the record." },
      { problem: "Exceptions are handled manually", support: "Adding rules, notifications, and escalation paths." },
      { problem: "Reports depend on manual exports", support: "Making operational data easier to query and summarize." },
    ],
  },
  fit: {
    eyebrow: "Fit",
    title: "When Opero is a good fit.",
    description:
      "Opero is usually a good fit when a company needs more than a spreadsheet, more flexibility than a fixed module, and more control than a loose internal tool.",
    goodFitTitle: "Good fit",
    goodFit: [
      "The process has custom records or fields.",
      "Multiple teams touch the same workflow.",
      "Ownership, status, or document stage matters.",
      "The company needs permissions and traceability.",
      "The workflow changes often enough to need configuration.",
    ],
    notBestFitTitle: "Not the best fit",
    notBestFit: [
      "The need is already fully covered by a specialist system.",
      "The process requires certified vertical software that Opero is not meant to replace.",
      "The company only needs a simple static website or one-off form.",
    ],
  },
  finalCta: {
    eyebrow: "Start with the process",
    title: "Tell us how your operation works. We will tell you if Opero fits.",
    description:
      "KodaSoft can map the records, roles, documents, approvals, and exceptions behind your process and show whether Opero is the right foundation.",
    primaryCta: "Book a demo",
    secondaryCta: "Explore Opero",
  },
};

export const solutionsCtas = {
  primary: localizePath("en", "contact"),
  secondary: localizePath("en", "opero"),
};
