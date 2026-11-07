import type { ContactPageContent } from "../types";

export const contactContent: ContactPageContent = {
  seo: {
    title: "Book an Opero Demo",
    description: "Contact KodaSoft to discuss Opero, workflow automation, no-code process design, and operational software shaped around your company.",
  },
  hero: {
    title: "Show us how your operation works.",
    description: "Tell us what you need and we will come back to you.",
  },
  context: {
    title: "Talk to us.",
    paragraphs: ["Write to us, call, or use the form."],
  },
  form: {
    nameLabel: "Name",
    companyLabel: "Company",
    emailLabel: "Work email",
    phoneLabel: "Phone",
    interestLabel: "Main topic",
    messageLabel: "What would you like to discuss?",
    consent: "By sending this form, you agree that KodaSoft may contact you about your request.",
    consentLinkLabel: "Privacy policy",
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
