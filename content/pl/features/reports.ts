import type { FeaturePageContent } from "@/content/types";

export const reportsFeature: FeaturePageContent = {
  seo: {
    title: "Raporty i analityka w Opero - zestawienia, wykresy, dashboardy",
    description:
      "Buduj raporty, wykresy i pulpity na żywych danych systemu. Drill-down prowadzi od wskaźnika do rekordów źródłowych, bez eksportu do Excela.",
  },
  navLabel: "Raporty i analityka",
  hero: {
    eyebrow: "Funkcje systemu",
    title: "Raporty i analityka - decyzje na danych, nie na przeczuciach",
    description:
      "Buduj zestawienia, wykresy i pulpity na żywych danych systemu. Od liczby zbiorczej zejdziesz do pojedynczego rekordu bez eksportu do Excela.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Zobacz Opero w akcji",
  },
  intro: {
    eyebrow: "W skrócie",
    paragraph:
      "Raporty Opero agregują i grupują dane obiektów, prezentują je w tabelach i na wykresach, a przez drill-down prowadzą od wskaźnika do źródłowych rekordów. Najważniejsze liczby zbierają dashboardy, a nietypowe cięcia danych - zapytania SQL.",
  },
  blocks: {
    eyebrow: "Co dostajesz",
    title: "Od wskaźnika do pojedynczego rekordu.",
    items: [
      {
        title: "Raporty",
        description:
          "Agregacje, grupowania i wskaźniki na danych systemu, z drążeniem szczegółów (drill-down) do rekordów źródłowych.",
      },
      {
        title: "Wykresy",
        description: "Wizualizacje trendów i rozkładów wprost w raporcie, czytelne dla zarządu.",
      },
      {
        title: "Dashboardy",
        description:
          "Pulpity z kafelkami i widgetami zbierające kluczowe metryki i skróty w jednym miejscu, osobne dla każdego zespołu.",
      },
      {
        title: "Zapytania SQL jako źródło",
        description:
          "Gdy standardowe filtry nie wystarczają, raport zasilasz własnym, parametryzowanym zapytaniem.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Następny krok",
    title: "Zobacz swoje dane w jednym miejscu.",
    description: "Pokażemy raport i dashboard zbudowane na Twoim typie danych.",
    primaryCta: "Umów prezentację",
  },
  related: {
    eyebrow: "Pokrewne funkcje",
    title: "Zobacz też",
    items: ["lowCode", "noCode", "ai"],
  },
};
