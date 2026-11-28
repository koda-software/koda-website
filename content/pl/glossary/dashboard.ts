import type { GlossaryTerm } from "@/content/types";
import { localizeFeaturePath } from "@/lib/i18n/features";

export const dashboard: GlossaryTerm = {
  slug: "dashboard",
  term: "Dashboard",
  subtitle: "Pulpit nawigacyjny - najważniejsze liczby firmy na jednym ekranie",
  seo: {
    title: "Dashboard - co to jest i co powinien pokazywać",
    description:
      "Dashboard (pulpit nawigacyjny) to ekran z najważniejszymi wskaźnikami w formie wykresów i liczb. Jak go zaprojektować, żeby ktoś z niego korzystał, i czym różni się od raportu.",
  },
  definition:
    "Dashboard, po polsku pulpit nawigacyjny albo pulpit menedżerski, to jeden ekran z najważniejszymi wskaźnikami w formie wykresów, liczb i krótkich zestawień. Służy do szybkiej oceny sytuacji: czy coś rośnie, spada albo wymaga reakcji, bez otwierania wielu raportów.",
  sections: [
    {
      title: "Skąd nazwa i do czego służy dashboard",
      paragraphs: [
        "Nazwa pochodzi od deski rozdzielczej w samochodzie. Kierowca nie czyta instrukcji silnika, tylko patrzy na prędkościomierz, poziom paliwa i kontrolki. Dashboard w firmie działa tak samo: pokazuje kilka liczb, które mówią, czy wszystko jest w normie.",
        "Typowe zastosowania to sprzedaż (wartość lejka, wygrane szanse w miesiącu), obsługa klienta (otwarte zgłoszenia, przekroczone terminy), finanse (faktury do zapłaty w tym tygodniu) i operacje (sprawy na każdym etapie procesu).",
      ],
    },
    {
      title: "Dashboard a raport",
      paragraphs: [
        "Raport odpowiada na konkretne pytanie i można go czytać dokładnie: ile sprzedaliśmy w każdym regionie w każdym miesiącu. Dashboard zbiera kilka takich odpowiedzi na jednym ekranie i pokazuje je w uproszczeniu. Raport czyta się, a na dashboard się patrzy.",
        "Dobry dashboard pozwala przejść od liczby do szczegółów: kliknięcie słupka „przeterminowane zgłoszenia” powinno pokazać listę tych zgłoszeń, a nie tylko większy wykres.",
      ],
    },
    {
      title: "Jak zaprojektować dashboard, z którego ktoś korzysta",
      paragraphs: ["Najwięcej dashboardów umiera, bo pokazują wszystko, co da się policzyć, zamiast tego, co ktoś musi wiedzieć."],
      list: [
        "Zacznij od decyzji, nie od danych: co odbiorca ma zrobić, gdy liczba się zmieni?",
        "Pięć do siedmiu wskaźników na ekran. Resztę przenieś do raportów.",
        "Dobierz wykres do pytania: linia do trendu w czasie, słupki do porównania, koło tylko do udziałów kilku części.",
        "Pokaż punkt odniesienia: cel, poprzedni miesiąc albo próg alarmowy.",
        "Licz z jednego źródła danych, żeby dwie osoby nie przychodziły na spotkanie z różnymi liczbami.",
      ],
      example:
        "Dashboard kierownika obsługi klienta: liczba otwartych zgłoszeń (z porównaniem do zeszłego tygodnia), zgłoszenia po terminie, średni czas pierwszej odpowiedzi, wykres liniowy nowych zgłoszeń dzień po dniu i podział otwartych spraw na typy. Pięć elementów, a kierownik w pół minuty wie, czy dziś trzeba przesunąć ludzi.",
    },
  ],
  opero: {
    title: "Wykresy i tabele liczone z danych w Opero",
    body: "W Opero rolę dashboardu pełnią raporty: tabele przestawne i wykresy (słupkowe, liniowe, kołowe, punktowe) liczone bezpośrednio z rekordów, z filtrami u góry. Każdy widzi liczby policzone z danych, do których ma dostęp, a z podsumowania przechodzi do rekordów źródłowych.",
    link: { label: "Raporty i analityka w Opero", href: localizeFeaturePath("pl", "reports") },
  },
  faq: [
    {
      question: "Jak jest dashboard po polsku?",
      answer:
        "Najczęściej pulpit nawigacyjny, pulpit menedżerski albo kokpit. W firmach i w systemach używa się też po prostu angielskiego słowa dashboard.",
    },
    {
      question: "Ile wskaźników powinien mieć dashboard?",
      answer:
        "Zwykle od pięciu do siedmiu na jeden ekran. Jeżeli potrzeba więcej, lepiej zrobić osobne pulpity dla różnych odbiorców niż jeden ekran ze wszystkim.",
    },
    {
      question: "Czy dashboard musi odświeżać się na żywo?",
      answer:
        "Nie zawsze. Dashboard obsługi zgłoszeń warto liczyć na bieżąco, a dashboard finansowy często wystarczy raz dziennie. Ważniejsze jest, żeby było jasne, z jakiego momentu pochodzą dane.",
    },
  ],
  related: ["raportowanie", "optymalizacja-procesow", "bpms"],
  updatedAt: "2026-11-28",
};
