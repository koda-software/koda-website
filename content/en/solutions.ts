import { localizePath } from "@/lib/i18n/routes";
import type { SolutionsContent } from "../types";

export const solutionsContent: SolutionsContent = {
  seo: {
    title: "Industry Solutions: Workflow and Documents",
    description:
      "Opero in manufacturing, construction, professional services, field service, healthcare, retail and the public sector. Workflow shaped to your industry.",
  },
  hero: {
    eyebrow: "Solutions",
    title: "Low-code BPM for processes that off-the-shelf systems cannot handle.",
    description:
      "Every industry has work that standard systems struggle to represent: local procedures, approvals, exceptions, documents, roles and handoffs. In Opero you model that work without losing control of the data.",
    supportLine: "Custom objects, processes, document workflow, automation, permissions and reports on one platform.",
    primaryCta: "Book a demo",
    secondaryCta: "Explore Opero",
  },
  industries: {
    eyebrow: "Industry fit",
    title: "Where Opero works best.",
    description:
      "Opero is strongest where the process is specific, the data model departs from the standard, and teams need flexibility and an audit trail at the same time. It complements the systems you already run rather than replacing every specialist tool.",
    items: [
      {
        icon: "manufacturing",
        title: "Manufacturing and industrial operations",
        scenario: [
          "Manufacturing companies have many plant-specific processes: quality events, machine maintenance, inspections, internal requests, supplier documents, nonconformances and production support. These flows rarely fit neatly into generic ERP modules.",
          "In Opero you model the records and handoffs between production, quality, maintenance, purchasing and management. Data, owners, stages, documents and automation rules all stay within a single process.",
        ],
        useCasesLabel: "Typical uses",
        useCases: [
          "Quality events, inspection results, nonconformances and corrective actions.",
          "Machine maintenance cases, service notes, parts requests and asset readiness.",
          "Supplier documents, internal approvals and recurring compliance checks.",
          "Plant requests that fit neither finance, nor the warehouse, nor production.",
        ],
        helpfulFeaturesLabel: "Helpful Opero features",
        helpfulFeatures: [
          "Custom objects for machines, inspections, quality events, suppliers and requests.",
          "Process stages and owners across production, quality, maintenance and purchasing.",
          "Automation rules for reminders, status changes, notifications and recurring checks.",
          "An event log and permissions for controlled operational changes.",
        ],
        supportsLabel: "Opero handles",
        supports: ["Machine and maintenance cases", "Quality and inspection records", "Supplier documentation workflow", "Internal requests and approval paths"],
      },
      {
        icon: "construction",
        title: "Construction and real estate",
        scenario: [
          "Construction and real estate operations involve changing sites, many contractors, inspections, handovers, document workflow, defect reports, approvals and internal coordination. Every project has its own structure and still needs control.",
          "In Opero you model projects, site cases, contractor workflow, inspection checklists, document statuses and approval stages. Operational information stays visible across projects, locations and partners.",
        ],
        useCasesLabel: "Typical uses",
        useCases: [
          "Site cases, inspection results, handover tasks and remedial actions.",
          "Contractor records, documents, approvals, access requirements and status changes.",
          "Recurring reports across sites, properties, projects and regional teams.",
          "Document status, owner, deadline and next step in long investment processes.",
        ],
        helpfulFeaturesLabel: "Helpful Opero features",
        helpfulFeatures: [
          "Custom objects for projects, locations, contractors, documents, inspections and cases.",
          "Relation fields linking partners, locations, reports, files and approval paths.",
          "Permissions for internal teams, departments, projects and individual companies.",
          "Notifications and rules for handovers, missing documents and overdue actions.",
        ],
        supportsLabel: "Opero handles",
        supports: ["Projects and site cases", "Contractor and partner coordination", "Document status workflow", "Inspections, handovers and approvals"],
      },
      {
        icon: "professionalServices",
        title: "Professional services, law and accounting firms",
        scenario: [
          "Law firms, accounting offices and consultancies work on client matters: documents with deadlines, contracts, engagements and settlements. Every client works slightly differently, and a missed deadline costs real money and real trust.",
          "In Opero you run client matters as custom objects with the full set of documents, stages and a named owner. Rules watch the deadlines, and permissions guarantee that each team sees only the clients assigned to it.",
        ],
        useCasesLabel: "Typical uses",
        useCases: [
          "Client matters with stages, deadlines and a clearly assigned owner.",
          "Contract and document workflow with versioning and a full history of changes.",
          "Recurring obligations: settlements, filings and contract renewals.",
          "Accounting for the scope of work on a client, project or matter.",
        ],
        helpfulFeaturesLabel: "Helpful Opero features",
        helpfulFeatures: [
          "Custom objects for clients, matters, contracts and documents.",
          "Rules that remind about deadlines before they become a problem.",
          "Permissions that restrict access to specific clients or teams.",
          "Document templates generating letters and contracts straight from matter data.",
        ],
        supportsLabel: "Opero handles",
        supports: ["Client matters and files", "Contract and document workflow", "Deadlines and recurring work", "Settlements and filings"],
      },
      {
        icon: "fieldService",
        title: "Field service and maintenance",
        scenario: [
          "Service work depends on assets, locations, technicians, parts, deadlines, reports, photos and customer notes. When that information lives in separate tools, it is hard to tell which cases are waiting, which are blocked and which are ready to close.",
          "In Opero you run service cases, devices, assignments, stages, checklists, files and reports on a single record. Automation takes over reminders, recurring checks, status changes and operational summaries.",
        ],
        useCasesLabel: "Typical uses",
        useCases: [
          "Service cases from intake, through diagnosis and repair, to customer update and closure.",
          "Assets, devices, locations, technicians, checklists, photos, files and repair notes.",
          "Recurring maintenance, inspections and equipment readiness reports.",
          "A shared picture of the work for field teams and the back office.",
        ],
        helpfulFeaturesLabel: "Helpful Opero features",
        helpfulFeatures: [
          "Record views for service cases, assets, assignments, checklists and files.",
          "Process stages: intake, diagnosis, waiting for parts, in progress, ready, closed.",
          "Recurring rules for checks, overdue reminders and daily reports.",
          "The AI assistant for summarising case history and operational reporting.",
        ],
        supportsLabel: "Opero handles",
        supports: ["Service cases and asset records", "Technician assignments and stages", "Checklists, files and repair notes", "Reminders and recurring reports"],
      },
      {
        icon: "healthcare",
        title: "Healthcare providers",
        scenario: [
          "Healthcare organisations run many important processes outside the clinical records system: facility requests, equipment tracking, supplier coordination, document collection, internal approvals, inspection routines and recurring operational reports.",
          "In Opero you arrange these non-clinical flows around departments, equipment, counterparties, documents and approval stages. Permissions and the event log keep access under control, and teams can see what is open, delayed, incomplete or ready for the next step.",
        ],
        useCasesLabel: "Typical uses",
        useCases: [
          "Equipment requests, technical inspections and asset readiness across departments.",
          "Coordination of suppliers, contracts, documents, approvals and renewal dates.",
          "Non-clinical internal requests: facility issues, access rights, operational exceptions.",
          "Recurring operational reports without rebuilding the same spreadsheet every week.",
        ],
        helpfulFeaturesLabel: "Helpful Opero features",
        helpfulFeatures: [
          "Custom objects for equipment, departments, requests, suppliers and documents.",
          "Roles, field permissions and separation by unit for controlled access.",
          "An event log for approvals, document changes and status updates.",
          "Automation rules for reminders, missing documents and recurring reports.",
        ],
        supportsLabel: "Opero handles",
        supports: ["Equipment and facility requests", "Supplier and counterparty workflow", "Document collection and review", "Internal approvals and the audit trail"],
      },
      {
        icon: "retail",
        title: "Service chains, franchise and retail",
        scenario: [
          "Beauty salons, fitness clubs, restaurants, retail outlets and franchise networks all need the same thing: a consistent standard in every location and a real view of what is happening on the ground. Local teams handle incidents, equipment, deliveries, audits and requests, each in their own way.",
          "In Opero every location works from the same simple form, while head office sees the whole network in one view. Recurring checks, hygiene standards and equipment inspections look after themselves, because a rule does the reminding.",
        ],
        useCasesLabel: "Typical uses",
        useCases: [
          "Incidents, equipment failures and maintenance requests raised by a location.",
          "Recurring audits, standard checks and opening or closing checklists.",
          "Location documentation: lease agreements, inspections, certificates and staff training.",
          "Reports comparing locations without collecting a spreadsheet from every site.",
        ],
        helpfulFeaturesLabel: "Helpful Opero features",
        helpfulFeatures: [
          "Records, processes and lists scoped to a location, with a roll-up view for head office.",
          "Request forms simple enough for any member of local staff to fill in.",
          "Recurring rules for audits, inspections and deadline reminders.",
          "Roles and permissions separating location, region and head office access.",
        ],
        supportsLabel: "Opero handles",
        supports: ["Incidents and requests from locations", "Audits and standard checks", "Documentation and equipment inspections", "Comparative reports for head office"],
      },
      {
        icon: "education",
        title: "Universities and education",
        scenario: [
          "Universities run teaching, administrative and project processes in parallel: student and staff applications, contract workflow, travel requests, research projects with their own budgets and reports, procurement, and documentation for individual units.",
          "In Opero each of these gets its own object, form and approval path running through departments, deans' offices and the bursary. It is clear which stage an application is at, who currently holds it and how much time is left before the deadline.",
        ],
        useCasesLabel: "Typical uses",
        useCases: [
          "Student and staff applications routed through departments, deans' offices and administration.",
          "Workflow for contracts, travel requests and procurement with budget approval.",
          "Research projects: documentation, milestones, reports and settlements.",
          "Records of equipment, laboratories and the assets of individual units.",
        ],
        helpfulFeaturesLabel: "Helpful Opero features",
        helpfulFeatures: [
          "Custom objects for applications, projects, contracts and unit assets.",
          "Multi-stage approval paths that run through several organisational units.",
          "Permissions and separation by unit, so everyone sees exactly their own scope.",
          "Reports on live data, without collecting spreadsheets from every faculty.",
        ],
        supportsLabel: "Opero handles",
        supports: ["Student and staff applications", "Contract and travel workflow", "Research projects and settlements", "Records of unit assets"],
      },
      {
        icon: "publicSector",
        title: "Public sector and local government",
        scenario: [
          "Public offices, their organisational units and municipal companies run on documents: incoming correspondence, citizen applications, resolutions, public procurement, contracts and reports. All of it with statutory deadlines, mandatory assignment and the obligation to reconstruct the course of a case on request.",
          "In Opero you run document workflow that matches how the unit actually operates: registration and numbering of correspondence, assignment to departments and people, approval paths, deadlines and a complete event log. Electronic official delivery is handled straight from the system, with no trip to an external portal.",
        ],
        useCasesLabel: "Typical uses",
        useCases: [
          "Registration of incoming and outgoing correspondence, with numbering and assignment to departments.",
          "Citizen applications and cases with a statutory deadline and a visible stage of progress.",
          "Workflow for contracts, public procurement and project documentation with approvals.",
          "Internal reporting for management without collecting the data by hand.",
        ],
        helpfulFeaturesLabel: "Helpful Opero features",
        helpfulFeatures: [
          "Electronic official delivery and document workflow handled inside the system.",
          "Custom objects for correspondence, applications, contracts, resolutions and procurement.",
          "Deadlines, reminders and escalations that watch cases with a statutory response time.",
          "An event log and field-level permissions for inspection and audit.",
        ],
        supportsLabel: "Opero handles",
        supports: ["Incoming and outgoing correspondence", "Citizen applications and cases", "Contracts and public procurement", "Official delivery and the event log"],
      },
    ],
  },
  pattern: {
    eyebrow: "The common pattern",
    title: "Different industries, the same operational problems.",
    description:
      "The details change between industries, but the pattern is usually the same: important work does not fit the main system, so teams create side processes. Over time those become hard to search, automate, audit and improve.",
    problemLabel: "When this happens",
    supportLabel: "Opero answers with",
    rows: [
      { problem: "Teams keep their own records in spreadsheets", support: "Custom objects with fields, validation and search." },
      { problem: "Approvals happen over email and chat", support: "A process with stages, an owner and a deadline at every step." },
      { problem: "Documents are hard to find and tie to a case", support: "Document workflow with file versioning on the record." },
      { problem: "Exceptions are handled manually", support: "A rule engine with notifications and escalation paths." },
      { problem: "Reports are built from manual exports", support: "Reports and dashboards on live data, with drill-down." },
    ],
  },
  fit: {
    eyebrow: "Fit",
    title: "See whether this is your case.",
    description:
      "Opero fits when a company needs more than a spreadsheet, more flexibility than a predefined module and more control than a loose internal tool. It also works well alongside the systems you already have.",
    goodFitTitle: "Opero will work for you when",
    goodFit: [
      "The process has its own records and fields that predefined modules do not cover.",
      "Several teams work on the same flow.",
      "The owner, status or stage of a document genuinely matters.",
      "The company needs permissions, compliance and a trail of changes.",
      "Processes change often enough that you need configuration, not rewriting code.",
    ],
    notBestFitTitle: "Opero complements, it does not replace",
    notBestFit: [
      "Already have a domain system that does its job well? Opero runs the processes around it and connects to it through the API.",
      "Working on certified industry software? It stays where it is, and Opero covers the flows it does not reach.",
      "You do not have to start with the whole company. Many rollouts begin with a single process, such as invoice workflow, and expand only once it has proven itself.",
    ],
  },
  finalCta: {
    eyebrow: "Start with the process",
    title: "Tell us how your operation runs. We will tell you whether Opero fits.",
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
