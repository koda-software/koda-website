import type { FeaturePageContent } from "@/content/types";

export const lowCodeFeature: FeaturePageContent = {
  seo: {
    title: "Low-code i automatyzacje - reguły, skrypty i SQL w Opero",
    description:
      "Silnik reguł „gdy warunek → wykonaj kroki”, silnik skryptów i parametryzowane zapytania SQL. Automatyzujesz decyzje i przetwarzanie danych.",
  },
  navLabel: "Low-code i automatyzacje",
  hero: {
    eyebrow: "Funkcje systemu",
    title: "Low-code i automatyzacje - logika, która pracuje za Ciebie",
    description:
      "Tam, gdzie konfiguracja to za mało, wchodzą reguły, skrypty i zapytania SQL. Automatyzujesz decyzje i przetwarzanie danych bez budowania osobnego systemu.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Zobacz Opero w akcji",
    shot: {
      src: "/features/low-code-automatyzacje-hero.webp",
      width: 2000,
      height: 861,
      caption: "Reguła: zdarzenie i kroki akcji",
      alt: "Edytor reguły w Opero: wyzwalacz „Rekord utworzony” u góry, poniżej ponumerowana lista kroków akcji do wykonania",
    },
  },
  intro: {
    eyebrow: "W skrócie",
    paragraph:
      "Warstwa low-code Opero uruchamia logikę na zdarzeniach: silnik reguł reaguje według zasady „gdy warunek → wykonaj kroki”, silnik skryptów obsługuje nietypowe przetwarzanie, a zapytania SQL sięgają po dane dokładnie tak, jak potrzebujesz.",
  },
  blocks: {
    eyebrow: "Co dostajesz",
    title: "Trzy warstwy logiki na Twoich danych.",
    items: [
      {
        title: "Silnik reguł i ich kroki",
        description:
          "Definiujesz warunki i sekwencję akcji (ustaw pole, utwórz rekord, wyślij powiadomienie, zablokuj przejście). Reguły testujesz przed wdrożeniem, więc automatyzacja jest przewidywalna.",
      },
      {
        title: "Silnik skryptów",
        description:
          "Fragmenty wyrażeń i skryptów wywoływane z reguł, pól wyliczanych i szablonów dla scenariuszy poza konfiguracją wizualną.",
      },
      {
        title: "Zapytania SQL",
        description:
          "Nazwane, parametryzowane zapytania wielokrotnego użytku jako źródło reguł, raportów i pól wyboru.",
      },
    ],
  },
  shots: {
    eyebrow: "Jak to wygląda",
    title: "Automatyzacja, którą sprawdzasz przed wdrożeniem.",
    items: [
      {
        src: "/features/low-code-automatyzacje-sql.webp",
        width: 2000,
        height: 899,
        caption: "Zapytanie z parametrami i wynikiem",
        alt: "Edytor zapytania SQL w Opero z zapytaniem po lewej i tabelą wyników pod spodem",
      },
    ],
  },
  finalCta: {
    eyebrow: "Następny krok",
    title: "Zautomatyzuj powtarzalne zadania.",
    description: "Zobacz, jak reguły i skrypty przejmują ręczne kroki, które dziś robi zespół.",
    primaryCta: "Umów prezentację",
  },
  related: {
    eyebrow: "Pokrewne funkcje",
    title: "Zobacz też",
    items: ["processes", "reports", "noCode"],
  },
};
