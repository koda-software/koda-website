import type { FeaturePageContent } from "@/content/types";

export const securityFeature: FeaturePageContent = {
  seo: {
    title: "Bezpieczeństwo i uprawnienia w Opero - role, spółki, tokeny API",
    description:
      "Role i uprawnienia do modułów, obiektów i pól, wiele spółek w jednej organizacji, tokeny API, uwierzytelnianie wieloskładnikowe i logi zdarzeń.",
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
  related: {
    eyebrow: "Pokrewne funkcje",
    title: "Zobacz też",
    items: ["integrations", "documents", "ai"],
  },
};
