import type { FeaturePageContent } from "@/content/types";

export const securityFeature: FeaturePageContent = {
  seo: {
    title: "Bezpieczeństwo, role i uprawnienia | Opero",
    description:
      "Role, uprawnienia do modułów i pól, wiele spółek, tokeny API i MFA. Kontroluj dostęp do danych firmy na poziomie oczekiwanym przez IT.",
  },
  navLabel: "Bezpieczeństwo i uprawnienia",
  hero: {
    eyebrow: "Funkcje systemu",
    title: "Bezpieczeństwo i uprawnienia - każdy widzi dokładnie to, co powinien",
    description:
      "Role, uprawnienia, wiele spółek i tokeny API pod kontrolą. Dane firmy chronione na poziomie oczekiwanym przez działy IT.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Zobacz Opero w akcji",
  },
  intro: {
    eyebrow: "W skrócie",
    paragraph:
      "Dostęp w Opero układasz od organizacji i jej spółek, przez role i członków, aż po precyzyjne uprawnienia do modułów, obiektów i pól. Integracje zabezpieczasz tokenami API, a konta - uwierzytelnianiem wieloskładnikowym.",
  },
  blocks: {
    eyebrow: "Co dostajesz",
    title: "Kontrola dostępu od organizacji po pojedyncze pole.",
    items: [
      {
        title: "Członkowie i role",
        description:
          "Konta użytkowników zebrane w role, które definiują zakres dostępu. Zmiana uprawnień roli obejmuje od razu wszystkich w niej.",
      },
      {
        title: "Uprawnienia szczegółowe",
        description: "Kontrola widoczności i edycji na poziomie modułu, obiektu i pojedynczego pola.",
      },
      {
        title: "Organizacje i spółki",
        description:
          "Wspólna konfiguracja, osobne dane każdej firmy; grupa kapitałowa na jednej platformie bez mieszania danych.",
      },
      {
        title: "Tokeny API",
        description:
          "Dostęp dla integracji z określonym zakresem uprawnień, wydawany i odbierany niezależnie od kont ludzi.",
      },
      {
        title: "MFA i logi",
        description:
          "Uwierzytelnianie wieloskładnikowe oraz rejestr zdarzeń „kto, co, kiedy” na potrzeby audytu i zgodności.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Następny krok",
    title: "Zapanuj nad dostępem do danych.",
    description: "Pokażemy model ról i uprawnień dopasowany do struktury Twojej firmy.",
    primaryCta: "Umów prezentację",
  },
  seoText: {
    eyebrow: "Więcej o funkcji",
    title: "Dostęp do danych pod pełną kontrolą.",
    paragraphs: [
      "Bezpieczeństwo w Opero zaczyna się od precyzyjnej kontroli dostępu. Uprawnienia ustawiasz od organizacji i jej spółek, przez role i członków, aż po widoczność i edycję na poziomie pojedynczego modułu, obiektu i pola. Dzięki rolom zmiana uprawnień obejmuje od razu wszystkich, którzy do nich należą, a każdy użytkownik widzi dokładnie to, co powinien.",
      "Obsługa wielu spółek (multi-company) pozwala prowadzić grupę firm na jednej platformie. Konfiguracja jest wspólna, ale dane operacyjne każdej spółki pozostają odseparowane, więc informacje się nie mieszają. Integracje zabezpieczasz tokenami API o określonym zakresie uprawnień, niezależnymi od kont ludzi.",
      "Uwierzytelnianie wieloskładnikowe (MFA) i rejestr zdarzeń podnoszą poziom ochrony do standardu oczekiwanego przez działy IT. Logi „kto, co i kiedy” dają przejrzystość potrzebną w audycie i przy spełnianiu wymogów zgodności.",
    ],
  },
  faq: {
    eyebrow: "Pytania",
    title: "Najczęściej zadawane pytania.",
    items: [
      {
        question: "Jak działają uprawnienia w Opero?",
        answer:
          "Dostęp nadaje się przez role, a te określają widoczność i edycję na poziomie modułu, obiektu i pola. Można też ograniczać dostęp w ramach poszczególnych spółek.",
      },
      {
        question: "Czy Opero obsługuje wiele spółek?",
        answer:
          "Tak. Jedna organizacja może prowadzić wiele spółek ze wspólną konfiguracją i osobnymi, odseparowanymi danymi.",
      },
    ],
  },
  related: {
    eyebrow: "Pokrewne funkcje",
    title: "Zobacz też",
    items: ["integrations", "documents", "ai"],
  },
};
