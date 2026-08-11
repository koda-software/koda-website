import type { ContactPageContent } from "../types";

export const contactContent: ContactPageContent = {
  seo: {
    title: "Umów demo Opero",
    description: "Skontaktuj się z KodaSoft, aby omówić Opero, automatyzację procesów, projektowanie procesów no-code i oprogramowanie dopasowane do pracy firmy.",
  },
  hero: {
    eyebrow: "Umów demo",
    title: "Pokaż nam, jak działa Twoja firma.",
    description:
      "Opowiedz, gdzie standardowe narzędzia przestają pasować: rekordy, akceptacje, dokumenty, raportowanie, role albo powtarzalne wyjątki. Wrócimy z praktyczną odpowiedzią, czy Opero będzie dobrym kierunkiem.",
  },
  context: {
    eyebrow: "Co możemy omówić",
    title: "Krótka rozmowa o realnym modelu pracy.",
    paragraphs: [
      "Opero najlepiej sprawdza się tam, gdzie firma ma własny sposób działania, który musi pozostać czytelny, kontrolowany i łatwy do dalszego dostosowania.",
      "Demo może pozostać ogólne albo zejść do konkretnych procesów: obsługi kontrahentów, realizacji usług, logistyki, produkcji, operacji medycznych, akceptacji wewnętrznych lub raportowania.",
    ],
  },
  topics: {
    title: "Typowe obszary demo",
    items: [
      {
        title: "Dane i rekordy",
        description: "Jak obiekty, relacje, statusy, dokumenty i osoby odpowiedzialne można odwzorować bez wciskania wszystkiego w gotowe moduły.",
      },
      {
        title: "Procesy i akceptacje",
        description: "Jak zespoły mogą prowadzić pracę przez etapy, wyjątki, przekazania, uprawnienia i punkty kontroli z czytelnym śladem zmian.",
      },
      {
        title: "Automatyzacja i raportowanie",
        description: "Gdzie reguły, powiadomienia, generowane dokumenty, pulpity i raportowanie wspierane AI mogą ograniczyć ręczną koordynację.",
      },
    ],
  },
  form: {
    nameLabel: "Imię i nazwisko",
    companyLabel: "Firma",
    emailLabel: "Email służbowy",
    phoneLabel: "Telefon",
    interestLabel: "Główny temat",
    messageLabel: "Co chcesz omówić?",
    consent: "Wysyłając formularz, zgadzasz się na kontakt KodaSoft w sprawie zapytania.",
    requiredHint: "Wymagane",
    optionalHint: "Opcjonalne",
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
