import type { GlossaryTerm } from "@/content/types";
import { localizeFeaturePath } from "@/lib/i18n/features";

export const raportowanie: GlossaryTerm = {
  slug: "raportowanie",
  term: "Raportowanie",
  subtitle: "Zbieranie danych firmy w zestawienia, które odpowiadają na konkretne pytania",
  seo: {
    title: "Raportowanie - co to jest, rodzaje raportów i jak je opracować",
    description:
      "Raportowanie to regularne zbieranie danych w zestawienia, na podstawie których firma podejmuje decyzje. Rodzaje raportów, jak opracować dobry raport i jak skończyć z ręcznym składaniem arkuszy.",
  },
  definition:
    "Raportowanie to regularne przygotowywanie zestawień z danych firmy - sprzedaży, kosztów, spraw, zgłoszeń - tak, żeby odpowiadały na konkretne pytania i pozwalały podjąć decyzję. Raport nie zmienia danych, tylko je liczy, grupuje i pokazuje w czytelnej formie: tabeli albo wykresu.",
  sections: [
    {
      title: "Rodzaje raportów w firmie",
      paragraphs: ["Raporty dzieli się zwykle według tego, kto je czyta i jak często."],
      list: [
        "Raporty operacyjne - codzienne lub cotygodniowe, np. otwarte zgłoszenia, faktury do akceptacji, zamówienia do wysyłki.",
        "Raporty zarządcze - miesięczne i kwartalne, np. sprzedaż w podziale na regiony, marża na klientach, koszty działów.",
        "Raporty analityczne - jednorazowe odpowiedzi na pytanie, np. dlaczego spadła liczba zamówień w marcu.",
        "Raporty obowiązkowe - wymagane przepisami albo przez kontrahentów, np. sprawozdania finansowe, raporty dla banku.",
      ],
    },
    {
      title: "Jak opracować dobry raport",
      paragraphs: [
        "Zaczyna się od pytania, nie od danych. „Pokażcie mi sprzedaż” to za mało. „Którzy handlowcy realizują plan w tym kwartale i jak wygląda to w porównaniu z zeszłym rokiem” wystarcza, żeby wiedzieć, jakie wiersze, kolumny i filtry ma mieć zestawienie.",
        "Potem trzeba ustalić miary (co liczymy: sumę, średnią, liczbę spraw), podziały (po czym grupujemy: region, miesiąc, status) i filtry (jaki wycinek: rok, dział). To trzy decyzje, które opisują prawie każdy raport.",
      ],
      example:
        "Raport sprzedaży w tabeli przestawnej: wiersze to handlowcy, kolumny to miesiące, w środku suma wartości zamówień, filtr na bieżący rok. Ten sam zestaw danych jako wykres liniowy pokazuje trend, a jako tabela pozwala odczytać dokładną kwotę.",
    },
    {
      title: "Dlaczego ręczne raportowanie przestaje działać",
      paragraphs: [
        "W wielu firmach raport to arkusz składany co miesiąc z kilku eksportów. Zajmuje to godziny, łatwo o błąd w formule, a każdy dział ma trochę inne liczby, bo liczy z innej wersji danych.",
        "Rozwiązaniem jest raport liczony z jednego źródła - systemu, w którym prowadzone są sprawy. Wtedy zestawienie buduje się raz, a potem tylko się do niego wraca. Liczby są zawsze aktualne, a od podsumowania można przejść do konkretnych rekordów, żeby sprawdzić, skąd się wzięły.",
      ],
    },
  ],
  opero: {
    title: "Raporty liczone z rekordów w Opero",
    body: "W Opero raport to tabela przestawna albo wykres liczony bezpośrednio z danych, na których pracuje firma. Administrator buduje go raz wokół pytania, a użytkownicy zawężają go filtrami. Każdy widzi liczby z danych, do których ma dostęp, i przechodzi od podsumowania do rekordów źródłowych.",
    link: { label: "Raporty i analityka w Opero", href: localizeFeaturePath("pl", "reports") },
  },
  faq: [
    {
      question: "Czym różni się raport od listy?",
      answer:
        "Lista pokazuje pojedyncze sprawy i służy do pracy na nich. Raport niczego nie zmienia, tylko liczy i pokazuje obraz całości: ile, w podziale na co.",
    },
    {
      question: "Czym różni się raportowanie od analizy danych?",
      answer:
        "Raportowanie odpowiada regularnie na te same pytania. Analiza szuka odpowiedzi na nowe pytanie i często kończy się nowym raportem, który potem wchodzi do stałego zestawu.",
    },
    {
      question: "Jaki raport warto zautomatyzować najpierw?",
      answer:
        "Ten, który ktoś składa ręcznie co tydzień albo co miesiąc z tej samej listy danych. To najprostszy kandydat i od razu oszczędza czas.",
    },
  ],
  related: ["dashboard", "optymalizacja-procesow", "ewidencja-dokumentow"],
  updatedAt: "2026-11-28",
};
