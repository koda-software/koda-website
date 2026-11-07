import type { ContactPageContent } from "../types";

export const contactContent: ContactPageContent = {
  seo: {
    title: "Umów demo Opero",
    description: "Skontaktuj się z KodaSoft, aby omówić Opero, automatyzację procesów, projektowanie procesów no-code i oprogramowanie dopasowane do pracy firmy.",
  },
  hero: {
    title: "Pokaż nam, jak działa Twoja firma.",
    description: "Napisz, czego potrzebujesz, a wrócimy do Ciebie.",
  },
  context: {
    title: "Porozmawiajmy.",
    paragraphs: ["Napisz, zadzwoń albo skorzystaj z formularza."],
  },
  form: {
    nameLabel: "Imię i nazwisko",
    companyLabel: "Firma",
    emailLabel: "Email służbowy",
    phoneLabel: "Telefon",
    interestLabel: "Główny temat",
    messageLabel: "Co chcesz omówić?",
    consent: "Wysyłając formularz, zgadzasz się na kontakt KodaSoft w sprawie zapytania.",
    consentLinkLabel: "Polityka prywatności",
    submitLabel: "Wyślij zapytanie",
    submittingLabel: "Wysyłanie...",
    successMessage: "Dziękujemy. Wiadomość została wysłana.",
    errorMessage: "Coś poszło nie tak. Spróbuj ponownie albo napisz do nas bezpośrednio.",
    validationMessage: "Uzupełnij wymagane pola przed wysłaniem.",
    interestOptions: [
      { value: "opero-demo", label: "Demo Opero" },
      { value: "workflow-automation", label: "Automatyzacja procesów" },
      { value: "custom-operations", label: "Procesy dopasowane do firmy" },
      { value: "ai-reporting", label: "Raportowanie wspierane AI" },
      { value: "partner-workflows", label: "Współpraca z partnerami" },
    ],
  },
};
