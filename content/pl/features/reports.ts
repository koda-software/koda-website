import type { FeaturePageContent } from "@/content/types";

export const reportsFeature: FeaturePageContent = {
  seo: {
    title: "Raporty, dashboardy i analityka danych | Opero",
    description:
      "Buduj raporty, wykresy i dashboardy na żywych danych. Drąż od wskaźnika do rekordu bez eksportu do Excela. Analityka biznesowa w Opero.",
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
  demo: {
    kind: "reports",
    tableTitle: "Zgłoszenia wg kategorii",
    columns: ["Kategoria", "Liczba", "Wartość"],
    rows: [
      { category: "Awaria", count: "7", value: "18 400,00" },
      { category: "Instalacja", count: "5", value: "12 100,00" },
      { category: "Konserwacja", count: "4", value: "6 900,00" },
      { category: "Reklamacja", count: "2", value: "2 300,00" },
    ],
    chartTitle: "Wartość zgłoszeń wg kategorii",
    drillTitle: "Awaria - rekordy w słupku",
    drillRows: [
      { number: "ZGL/2026/019", title: "Awaria centrali VoIP", value: "1 800,00" },
      { number: "ZGL/2026/013", title: "Awaria serwera plików", value: "9 400,00" },
      { number: "ZGL/2026/007", title: "Awaria zasilania UPS", value: "7 200,00" },
    ],
    captions: { table: "Zwykła tabela z danymi", chart: "Ten sam raport <b>jako wykres</b>", drill: "Klikasz słupek - i widzisz <b>rekordy, które go tworzą</b>" },
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
          "Pulpity z kafelkami i widgetami zbierające najważniejsze metryki i skróty, osobne dla każdego zespołu.",
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
    title: "Zobacz swoje dane tak, jak ich potrzebujesz.",
    description: "Pokażemy raport i dashboard zbudowane na Twoim typie danych.",
    primaryCta: "Umów prezentację",
  },
  seoText: {
    eyebrow: "Więcej o funkcji",
    title: "Dane operacyjne zamienione w decyzje.",
    paragraphs: [
      "Raporty w Opero zamieniają dane operacyjne w decyzje. Zestawienia budujesz na danych obiektów: agregacje, grupowania, wskaźniki i wykresy powstają na żywych informacjach z systemu, bez eksportu do arkuszy. Dzięki drążeniu szczegółów (drill-down) przechodzisz od wartości zbiorczej do pojedynczych rekordów, które się na nią składają, więc każdą liczbę można sprawdzić u źródła.",
      "Dashboardy zbierają najważniejsze wskaźniki na jednym pulpicie. Kafelki i widgety z metrykami, wykresami i skrótami układasz osobno dla każdego zespołu, tak aby każdy otwierał system na tym, co dla niego istotne. To analityka dostępna na co dzień, nie raz na kwartał.",
      "Gdy standardowe filtry nie wystarczają, raport zasilasz własnym zapytaniem SQL. Parametryzowane zapytania pozwalają wyciąć dane dokładnie tak, jak potrzebujesz, i wykorzystać je wielokrotnie. Raportowanie w Opero łączy prostotę codziennego wglądu z mocą zaawansowanych analiz.",
    ],
  },
  faq: {
    eyebrow: "Pytania",
    title: "Najczęściej zadawane pytania.",
    items: [
      {
        question: "Czym jest drill-down w raporcie?",
        answer:
          "To przejście od wartości zbiorczej do rekordów, które ją tworzą. Klikasz liczbę na raporcie i widzisz konkretne pozycje, które się na nią złożyły.",
      },
      {
        question: "Czy raporty działają na aktualnych danych?",
        answer:
          "Tak. Raporty i dashboardy budowane są na żywych danych systemu, więc pokazują bieżący stan bez ręcznego odświeżania.",
      },
    ],
  },
  related: {
    eyebrow: "Pokrewne funkcje",
    title: "Zobacz też",
    items: ["lowCode", "noCode", "ai"],
  },
};
