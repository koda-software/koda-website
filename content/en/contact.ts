import type { ContactPageContent } from "../types";

export const contactContent: ContactPageContent = {
  seo: {
    title: "Book an Opero Demo",
    description: "Contact KodaSoft to discuss Opero, workflow automation, no-code process design, and operational software shaped around your company.",
  },
  hero: {
    eyebrow: "Book a demo",
    title: "Show us how your operation works.",
    description:
      "Tell us where standard tools stop fitting: records, approvals, documents, reporting, roles, or recurring exceptions. We will come back with a practical view of whether Opero is the right fit.",
  },
  context: {
    eyebrow: "What we can discuss",
    title: "A short conversation around your real operating model.",
    paragraphs: [
      "Opero is most useful when the company has a specific way of working that needs to stay visible, controlled, and easier to change over time.",
      "The demo can stay high level or go into concrete processes: contractor onboarding, service delivery, logistics coordination, production work, medical operations, internal approvals, or reporting.",
    ],
  },
  topics: {
    title: "Typical demo areas",
    items: [
      {
        title: "Data and records",
        description: "How your objects, relationships, statuses, documents, and responsible people could be represented without forcing everything into one rigid template.",
      },
      {
        title: "Workflows and approvals",
        description: "How teams can move work through stages, exceptions, handovers, permissions, and review points with a clear audit trail.",
      },
      {
        title: "Automation and reporting",
        description: "Where rules, notifications, generated documents, dashboards, and AI-assisted reporting could remove repeated manual coordination.",
      },
    ],
  },
  form: {
    nameLabel: "Name",
    companyLabel: "Company",
    emailLabel: "Work email",
    phoneLabel: "Phone",
    interestLabel: "Main topic",
    messageLabel: "What would you like to discuss?",
    consent: "By sending this form, you agree that KodaSoft may contact you about your request.",
    requiredHint: "Required",
    optionalHint: "Optional",
    submitLabel: "Send request",
    submittingLabel: "Sending...",
    successMessage: "Thanks. Your message has been sent.",
    errorMessage: "Something went wrong. Please try again or email us directly.",
    validationMessage: "Please complete the required fields before sending.",
    interestOptions: [
      { value: "opero-demo", label: "Opero demo" },
      { value: "workflow-automation", label: "Workflow automation" },
      { value: "custom-operations", label: "Custom operations" },
      { value: "ai-reporting", label: "AI-assisted reporting" },
      { value: "partner-workflows", label: "Partner workflows" },
    ],
  },
};
