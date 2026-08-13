import type { FeaturePageContent } from "@/content/types";

export const lowCodeFeature: FeaturePageContent = {
  seo: {
    title: "Automatyzacja procesów i low-code | Opero",
    description:
      "Automatyzuj decyzje regułami, skryptami i zapytaniami SQL. Silnik reguł „warunek to akcja” bez budowy osobnego systemu. Low-code w Opero.",
  },
  navLabel: "Low-code i automatyzacje",
  hero: {
    eyebrow: "Funkcje systemu",
    title: "Low-code i automatyzacje - logika, która pracuje za Ciebie",
    description:
      "Tam, gdzie konfiguracja to za mało, wchodzą reguły, skrypty i zapytania SQL. Automatyzujesz decyzje i przetwarzanie danych bez budowania osobnego systemu.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Zobacz Opero w akcji",
  },
  intro: {
    eyebrow: "W skrócie",
    paragraph:
      "Warstwa low-code Opero uruchamia logikę na zdarzeniach: silnik reguł reaguje według zasady „gdy warunek → wykonaj kroki”, silnik skryptów obsługuje nietypowe przetwarzanie, a zapytania SQL sięgają po dane dokładnie tak, jak potrzebujesz.",
  },
  demo: {
    kind: "lowCode",
    conditionLabel: "Warunek reguły",
    condition: ["Priorytet", "równa się", "Krytyczny"],
    runLabel: "Zapisz i uruchom",
    firedLabel: "Reguła zadziałała",
    fieldEffect: { title: "Pole ustawia się samo", detail: "Pilne", from: "Nie", to: "Tak" },
    notificationEffect: { title: "Powiadomienie wychodzi", detail: "do: Marek Wiśniewski · SMS + e-mail" },
    blockEffect: { title: "Przejście zablokowane", detail: "Brak protokołu odbioru", transition: "Zamknij zgłoszenie" },
    captions: { condition: "Warunek składasz <b>z gotowych klocków</b>", fired: "Reguła odpala się <b>przy każdym rekordzie</b>", summary: "Pole, powiadomienie, blokada przejścia — <b>bez pilnowania</b>" },
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
  finalCta: {
    eyebrow: "Następny krok",
    title: "Zautomatyzuj powtarzalne zadania.",
    description: "Zobacz, jak reguły i skrypty przejmują ręczne kroki, które dziś robi zespół.",
    primaryCta: "Umów prezentację",
  },
  seoText: {
    eyebrow: "Więcej o funkcji",
    title: "Automatyzacja, która przejmuje powtarzalną pracę.",
    paragraphs: [
      "Warstwa low-code Opero automatyzuje pracę, która dziś pochłania czas zespołu. Silnik reguł działa według prostej zasady „gdy zajdzie warunek, wykonaj kroki”: ustaw pole, utwórz rekord, wyślij powiadomienie, zablokuj przejście w procesie. Reguły definiujesz i testujesz przed wdrożeniem, więc automatyzacja jest przewidywalna, a nie ryzykowna.",
      "Dla scenariuszy wykraczających poza konfigurację wizualną wchodzi silnik skryptów. Fragmenty wyrażeń i skryptów uruchamiasz z reguł, pól wyliczanych i szablonów, gdy potrzebne jest niestandardowe przetwarzanie danych. To element low-code: sięgasz po kod tylko tam, gdzie faktycznie się opłaca, bez budowania osobnego systemu.",
      "Zapytania SQL dają pełną kontrolę nad danymi. Nazwane, parametryzowane zapytania wielokrotnego użytku zasilają reguły, raporty i pola wyboru, gdy standardowe filtry to za mało. Razem reguły, skrypty i SQL zamieniają Opero w platformę, która wykonuje powtarzalną pracę za Ciebie.",
    ],
  },
  faq: {
    eyebrow: "Pytania",
    title: "Najczęściej zadawane pytania.",
    items: [
      {
        question: "Jak działa silnik reguł?",
        answer:
          "Reguła to zapis „warunek to akcja”. Gdy spełniony jest warunek (np. zmiana priorytetu na krytyczny), system wykonuje zdefiniowane kroki, na przykład ustawia pole lub wysyła powiadomienie.",
      },
      {
        question: "Czy automatyzacje wymagają programisty?",
        answer:
          "Reguły buduje się wizualnie. Skrypty i zapytania SQL są opcjonalne i przydają się dopiero przy bardziej złożonej logice.",
      },
    ],
  },
  related: {
    eyebrow: "Pokrewne funkcje",
    title: "Zobacz też",
    items: ["processes", "reports", "noCode"],
  },
};
