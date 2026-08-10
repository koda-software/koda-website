import type { FeaturePageContent } from "@/content/types";

export const aiFeature: FeaturePageContent = {
  seo: {
    title: "Kontekstowe AI w Opero - asystent, który zna Twój system",
    description:
      "Asystent AI zna strukturę, konfigurację i dane Twojej instancji. Konsultant buduje nim konfigurację, użytkownik pyta o dane w języku naturalnym.",
  },
  navLabel: "Kontekstowe AI",
  hero: {
    eyebrow: "Funkcje systemu",
    title: "Kontekstowe AI - asystent, który zna Twój system",
    description:
      "AI pracuje na strukturze i danych Twojej instancji, a nie na ogólnej wiedzy o oprogramowaniu. Konsultant buduje nim konfigurację, użytkownik pyta o dane w języku naturalnym.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Zobacz Opero w akcji",
  },
  intro: {
    eyebrow: "W skrócie",
    paragraph:
      "Asystent AI w Opero zna kontekst Twojej instancji: strukturę danych, konfigurację i bieżące rekordy. Dzięki temu odpowiada konkretami zamiast ogólników, a ten sam mechanizm służy dwóm grupom: konsultantom przy konfiguracji i użytkownikom końcowym w codziennej pracy.",
  },
  blocks: {
    eyebrow: "Co dostajesz",
    title: "Jeden asystent, dwie grupy odbiorców.",
    items: [
      {
        title: "AI konfiguracyjne (dla konsultantów)",
        description:
          "Budowa i modyfikacja obiektów, formularzy, reguł i procesów w dialogu z asystentem, z walidacją przed zapisem. Wdrożenie przyspiesza, bo asystent zna zasady, według których zbudowana jest platforma.",
      },
      {
        title: "AI dla użytkowników końcowych",
        description:
          "Pytania o dane w języku naturalnym, wyszukiwanie rekordów i podsumowania bez klikania po widokach.",
      },
      {
        title: "Uprawnienia obowiązują także AI",
        description:
          "Asystent widzi dokładnie tyle, ile rola danego użytkownika. Ten sam zakres dostępu obowiązuje przy pytaniach o dane i przy zmianach w konfiguracji.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Następny krok",
    title: "Zobacz AI, które zna Twój Opero.",
    description: "Pokażemy, jak asystent przyspiesza i konfigurację, i codzienną pracę z danymi.",
    primaryCta: "Umów prezentację",
  },
  related: {
    eyebrow: "Pokrewne funkcje",
    title: "Zobacz też",
    items: ["noCode", "lowCode", "reports"],
  },
};
