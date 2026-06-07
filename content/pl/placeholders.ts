import type { PageKey } from "@/lib/i18n/routes";
import type { PlaceholderPageContent } from "../types";

export const placeholderPages: Record<Exclude<PageKey, "home">, PlaceholderPageContent> = {
  opero: {
    seo: {
      title: "Opero - Elastyczny ERP dla procesow firmy",
      description: "Poznaj Opero, elastyczny ERP do danych, procesow, automatyzacji, kontroli i praktycznego wsparcia AI.",
    },
    eyebrow: "Opero",
    title: "Szkielet strony produktu Opero",
    description: "Ta trasa jest gotowa na szczegolowa opowiesc o produkcie Opero. Finalna strona powstanie po zatwierdzeniu homepage.",
    cta: "Wroc na strone glowna",
  },
  solutions: {
    seo: {
      title: "Rozwiazania - Elastyczny ERP dla operacji firmy",
      description: "Zobacz, jak Opero moze wspierac procesy firmowe, kontrahentow, akceptacje, workflow i wyszukiwanie operacyjne.",
    },
    eyebrow: "Rozwiazania",
    title: "Szkielet strony rozwiazan",
    description: "Ta trasa jest gotowa na tresci o problemach biznesowych, ktore Opero pomaga modelowac i automatyzowac.",
    cta: "Wroc na strone glowna",
  },
  contact: {
    seo: {
      title: "Kontakt z Koda Soft - Umow demo Opero",
      description: "Skontaktuj sie z Koda Soft i sprawdz, jak Opero moze modelowac procesy, workflow, kontrole danych i prace wspierana AI.",
    },
    eyebrow: "Kontakt",
    title: "Szkielet strony kontaktowej",
    description: "Ta trasa jest gotowa na statyczny, zgodny ze static export przeplyw demo i kontaktu.",
    cta: "Wroc na strone glowna",
  },
};
