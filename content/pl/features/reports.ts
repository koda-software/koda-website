import type { ReportsPageContent } from "@/content/feature-stories/reports.types";
import type { FeaturePageContent } from "@/content/types";

const reportsFaq: FeaturePageContent["faq"] = {
  title: "Najczęściej zadawane pytania.",
  items: [
    {
      question: "Co dokładnie się dzieje, gdy kliknę liczbę?",
      answer:
        "Opero ponownie wykonuje zapisane zapytanie raportu z Twoimi filtrami, zawężone do wiersza i kolumny tej komórki, i pokazuje surowe wiersze. Domyślnie po 1000 na stronę, z przyciskiem wczytania kolejnych. Działa to na komórkach tabeli, sumach częściowych i elementach wykresów w każdym raporcie, bez konfiguracji. Jeśli autor wskaże kolumnę z identyfikatorem i typ rekordu, każdy wiersz dostanie też przycisk otwarcia rekordu, a dostęp nadal rozstrzygają uprawnienia do tego rekordu.",
    },
    {
      question: "Jak świeże są liczby?",
      answer:
        "Raport odpytuje bieżące tabele, nie ma nocnej kopii. Wynik może być używany ponownie domyślnie przez 300 sekund. Tę wartość można zmienić albo ustawić na 0. Przycisk odświeżania od razu wykonuje zapytanie od nowa, a edycja raportu lub jego zapisanego zapytania unieważnia stary wynik.",
    },
    {
      question: "Czy musimy znać SQL?",
      answer:
        "Ktoś musi, i to raz. Może to też zrobić agent AI podłączony do Opero przez MCP: napisze zapytanie i pokaże podgląd liczb. Każdy raport czyta jedno zapisane zapytanie SQL. Wiersze, miary i wykresy układa się wizualnie, a osoby czytające raport nie widzą SQL. Zapytania może też przygotować nasz zespół w ramach wdrożenia.",
    },
    {
      question: "Kto widzi które liczby?",
      answer:
        "Raport nie ma własnych odbiorców. Czyta go każdy, kto może otworzyć stronę albo układ rekordu z tym raportem, łącznie z każdą kolumną zapytania, przez drill-down i eksport surowych wierszy. Dlatego wrażliwe liczby umieść na stronie z wąskim gronem odbiorców, a kolumn, których czytelnicy nie powinni widzieć, nie zwracaj w zapytaniu. Rekordy obiektów z widocznością tylko dla właściciela nie są filtrowane per właściciel w raportach opartych na SQL, o czym autor dostaje ostrzeżenie przy zapisie.",
    },
    {
      question: "Czy jeden raport może objąć kilka firm?",
      answer:
        "Tak, w zakresie ORGANIZATION_REPORTING. Działa on we wszystkich firmach organizacji i tylko dla osoby z uprawnieniem org.companyData.readAll. Pozostałym system odmawia. Tokeny API nigdy go nie dostają. Raport sumuje to, co zwraca zapytanie, więc wyłączenie sprzedaży wewnątrzgrupowej albo przeliczenie walut trzeba zapisać w SQL.",
    },
    {
      question: "Jakie są limity eksportu do Excela?",
      answer:
        "Wybierasz widok zbiorczy albo surowe wiersze źródłowe, w XLSX lub CSV, z zastosowanymi filtrami. Domyślnie eksport surowych wierszy kończy się na 250 000, a wynik zbiorczy na 50 000 wierszy. Raportu nie wyeksportujesz do PDF.",
    },
    {
      question: "Co się dzieje przy bardzo dużym raporcie?",
      answer:
        "Domyślnie pojedyncze wykonanie ma limit czasu 30 sekund, który można podnieść najwyżej do 60. Wynik powyżej 50 000 wierszy jest ucinany, a czytelnik widzi ostrzeżenie z prośbą o zawężenie filtrami lub mniejszą liczbą wymiarów.",
    },
    {
      question: "Co się zepsuje, gdy ktoś zmieni zapisane zapytanie?",
      answer:
        "Raport nadal się ładuje, więc jedna zmieniona nazwa kolumny nie wyłącza całego pulpitu. W konfiguracji raportu widać kolumny, których nie da się już odnaleźć. Nie są one agregowane, dopóki autor nie podepnie ich na nowo.",
    },
    {
      question: "Czy raport może zmienić nasze dane?",
      answer:
        "Nie. Raport przyjmuje wyłącznie zapisane zapytanie typu FETCH, a zapytanie MUTATION odpada przy walidacji. Zapytania FETCH działają na roli bazy danych tylko do odczytu app_readonly.",
    },
    {
      question: "A co z danymi z innych systemów?",
      answer:
        "Raport czyta to, co jest w Opero, a walidator SQL odrzuca dblink. Dane z innego systemu muszą najpierw tam trafić, przez integrację albo API. Potem można je łączyć ze wszystkimi innymi.",
    },
  ],
};

export const reportsFeature: FeaturePageContent = {
  seo: {
    title: "Raporty, dashboardy i analityka danych",
    description:
      "Buduj raporty, wykresy i dashboardy na żywych danych. Drąż od wskaźnika do rekordu bez eksportu do Excela. Analityka biznesowa w Opero.",
  },
  navLabel: "Raporty i analityka",
  navDescription: "Decyzje oparte na danych",
  hero: {
    title: "Raporty i analityka - decyzje na danych, nie na przeczuciach",
    description:
      "Buduj zestawienia, wykresy i pulpity na żywych danych systemu. Od liczby zbiorczej zejdziesz do pojedynczego rekordu bez eksportu do Excela.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Zobacz Opero w akcji",
  },
  intro: {
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
    title: "Zobacz swoje dane tak, jak ich potrzebujesz.",
    description: "Pokażemy raport i dashboard zbudowane na Twoim typie danych.",
    primaryCta: "Umów prezentację",
  },
  seoText: {
    title: "Dane operacyjne zamienione w decyzje.",
    paragraphs: [
      "Raporty w Opero zamieniają dane operacyjne w decyzje. Zestawienia budujesz na danych obiektów: agregacje, grupowania, wskaźniki i wykresy powstają na żywych informacjach z systemu, bez eksportu do arkuszy. Dzięki drążeniu szczegółów (drill-down) przechodzisz od wartości zbiorczej do pojedynczych rekordów, które się na nią składają, więc każdą liczbę można sprawdzić u źródła.",
      "Dashboardy zbierają najważniejsze wskaźniki na jednym pulpicie. Kafelki i widgety z metrykami, wykresami i skrótami układasz osobno dla każdego zespołu, tak aby każdy otwierał system na tym, co dla niego istotne. To analityka dostępna na co dzień, nie raz na kwartał.",
      "Gdy standardowe filtry nie wystarczają, raport zasilasz własnym zapytaniem SQL. Parametryzowane zapytania pozwalają wyciąć dane dokładnie tak, jak potrzebujesz, i wykorzystać je wielokrotnie. Raportowanie w Opero łączy prostotę codziennego wglądu z mocą zaawansowanych analiz.",
    ],
  },
  faq: reportsFaq,
  related: {
    title: "Zobacz też",
    items: ["lowCode", "noCode", "ai"],
  },
};

export const reportsPage: ReportsPageContent = {
  hero: {
    title: "Raporty na bieżących rekordach Opero. Kliknij liczbę i zobacz jej wiersze.",
    description:
      "Raport to jedno zapisane zapytanie SQL oraz tabela przestawna albo wykres: słupkowy, liniowy, warstwowy, kołowy, pierścieniowy lub punktowy. Czyta kontrahentów, faktury, budżety, zgłoszenia i obiekty własne, na których pracuje Twój zespół. Czytelnik może go przegrupować, przefiltrować i wyeksportować do XLSX lub CSV, nie zmieniając go nikomu innemu.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Poznaj Opero",
    image: {
      src: "/opero/reports/hero.webp",
      alt: "Strona raportu Opero z tabelą przestawną otwartych szans, filtrami i panelem pól",
      width: 2111,
      height: 1316,
    },
  },
  problem: {
    title: "Na poniedziałkowe spotkanie dwie osoby przynoszą dwie sumy za październik.",
    description:
      "Przykład: jedna osoba eksportuje sprzedaż w czwartek, Marek w piątek, każde naprawia formuły i wysyła skoroszyt mailem. W poniedziałek pliki pokazują 1 284 500 i 1 261 900, czyli różnicę 22 600. Pierwsze pytanie brzmi, które faktury składają się na tę różnicę, a żaden plik na nie nie odpowie.",
    comparison: {
      title: "Macierz ryzyka przychodów",
      ariaLabel: "Porównaj Arkusze i Opero",
      beforeLabel: "Arkusze",
      beforeAlt: "Arkusz z danymi źródłowymi macierzy ryzyka przychodów",
      afterLabel: "Opero",
      afterAlt: "Raport Opero przedstawiający macierz ryzyka przychodów",
    },
    ledger: {
      moment: "Sytuacja",
      spreadsheet: "Poniedziałkowy arkusz",
      opero: "Ten sam raport w Opero",
      rows: [
        { moment: "Skąd bierze się liczba", spreadsheet: "Z eksportu, który ktoś zrobił w czwartek", opero: "Z zapytania na bieżących tabelach, a gotowy wynik żyje domyślnie najwyżej 5 minut" },
        { moment: "Kto ma aktualną wersję", spreadsheet: "Ten, kto wysłał ostatni załącznik", opero: "Każda strona osadza ten sam raport po identyfikatorze, więc kopii nie ma" },
        { moment: "Ktoś pyta: \"które faktury?\"", spreadsheet: "Powrót do źródła i odpowiedź jutro", opero: "Klikasz komórkę i otwierają się wiersze źródłowe, po 1000 na stronę" },
        { moment: "Zmienia się pytanie", spreadsheet: "Nowa zakładka i kolejna runda formuł", opero: "Przesuwasz pole na panelu, a zapisany raport zostaje bez zmian" },
        { moment: "Autor odchodzi z firmy", spreadsheet: "Nikt nie odważy się ruszyć pliku", opero: "Zapytanie i układ to konfiguracja organizacji, którą edytuje każdy z org.reports.update" },
      ],
    },
  },
  drill: {
    title: "Kliknij słupek Awaria i zobacz 3 zgłoszenia składające się na 18 400.",
    description:
      "W tym przykładzie 14 zgłoszeń jest wartych 39 700, z czego 18 400 przypada na 3 awarie. Kliknięcie słupka albo komórki ponownie wykonuje zapisane zapytanie, zawężone do kategorii Awaria, z zachowaniem filtrów, i pokazuje wiersze: serwer plików 9400, UPS 7200, VoIP 1800.",
    demo: {
      tableTitle: "Zgłoszenia wg kategorii",
      columns: ["Kategoria", "Liczba", "Wartość"],
      rows: [
        { category: "Awaria", count: "3", value: "18 400,00" },
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
      captions: { table: "Tabela przestawna do szczegółów", chart: "Wykres <b>na spotkanie</b>", drill: "Klikasz słupek - i widzisz <b>rekordy, które go tworzą</b>" },
    },
    points: [
      { title: "Bez konfiguracji w raporcie", description: "Drill-down działa na komórkach, sumach częściowych i elementach wykresów każdego raportu. Suma częściowa otwiera wszystkie wiersze grupy, po 1000 na stronę, z wczytywaniem kolejnych." },
      { title: "Co zawiera lista", description: "Każdą kolumnę zapytania i każdy wiersz tej grupy. Kliknięcie liczby 3 spóźnionych pokaże wszystkie 12 zgłoszeń z kategorii, a kolumna spóźnienia wskaże te 3." },
      { title: "A potem sam rekord", description: "Autor wskazuje kolumnę z identyfikatorem i typ rekordu, a każdy wiersz dostaje przycisk otwarcia. O dostępie nadal decydują uprawnienia do tego rekordu." },
    ],
  },
  questions: {
    title: "Sześć cotygodniowych pytań i budowa każdego raportu.",
    description:
      "Wszystkie liczby poniżej to dane przykładowe. Wiersz \"Jak to jest zbudowane\" opisuje faktyczną konfigurację w Opero, razem z formułą tam, gdzie jest potrzebna.",
    labels: {
      tabsLabel: "Działy",
      builtLabel: "Jak to jest zbudowane",
      drillLabel: "Klikasz wiersz",
      exampleNote: "Dane przykładowe",
    },
    scenarios: [
      {
        department: "Sprzedaż",
        question: "Na ile z lejka wartego 562 000 możemy liczyć?",
        answer: "Po uwzględnieniu prawdopodobieństwa to 270 500, czyli mniej niż połowa wartości nominalnej. Negocjacje to tylko 5 z 28 szans, ale wnoszą 106 500, bo liczą się w 75%, a kwalifikacja w 25%.",
        reportTitle: "Otwarte szanse wg etapu",
        columns: ["Etap", "Szanse", "Wartość", "Ważona"],
        rows: [
          ["Kwalifikacja", "14", "184 000", "46 000"],
          ["Oferta", "9", "236 000", "118 000"],
          ["Negocjacje", "5", "142 000", "106 500"],
        ],
        total: ["Razem", "28", "562 000", "270 500"],
        highlightRow: 2,
        built: "Wiersze: etap. Miary: liczba szans, suma wartości, suma wartości ważonej. Wartość x prawdopodobieństwo liczy na każdej szansie zapisane zapytanie, bo formuły działają na agregatach.",
        drill: "Negocjacje pokazują 5 szans z opiekunem i wartością.",
      },
      {
        department: "Finanse",
        question: "Którzy klienci dają marżę, a którzy mają nieopłacone faktury?",
        answer: "Klient B wnosi 120 000 przy marży 15,0%, a 5 z jego 10 faktur jest nieopłaconych. Ze wszystkich 40 faktur opłacone są 33, więc wiersz sumy pokazuje 82,5%, policzone z faktur.",
        reportTitle: "Rentowność wg klienta",
        columns: ["Klient", "Przychód netto", "Marża", "Opłacone faktury"],
        rows: [
          ["Klient A", "240 000", "30,0%", "90,0%"],
          ["Klient B", "120 000", "15,0%", "50,0%"],
          ["Klient C", "40 000", "50,0%", "100,0%"],
        ],
        total: ["Razem", "400 000", "27,5%", "82,5%"],
        highlightRow: 1,
        built: "Wiersze: klient. Miary: suma netto, ([net] - [cost]) / [net] oraz share([status] = \"PAID\"). Zapytanie zwraca jeden wiersz na fakturę, bo share liczy wiersze.",
        drill: "Klient B pokazuje swoich 10 faktur, a kolumna statusu wskazuje 5 nieopłaconych.",
      },
      {
        department: "Operacje",
        question: "Gdzie piętrzą się zgłoszenia klientów i co jest już po terminie?",
        answer: "Instalacje to 12 z 24 otwartych zgłoszeń, z czego 3 po terminie. Reklamacji jest tylko 5, ale 2 są spóźnione. To 40%, najwyższy odsetek wśród trzech kategorii.",
        reportTitle: "Otwarte zgłoszenia wg kategorii",
        columns: ["Kategoria", "Otwarte", "Po terminie", "Udział w otwartych"],
        rows: [
          ["Instalacja", "12", "3", "50,0%"],
          ["Konserwacja", "7", "1", "29,2%"],
          ["Reklamacja", "5", "2", "20,8%"],
        ],
        total: ["Razem", "24", "6", "100,0%"],
        highlightRow: 0,
        built: "Wiersze: kategoria. Miary: liczba, countIf([is_late]) oraz liczba jako % sumy całkowitej. Pole is_late wylicza zapytanie, bo warunki formuł przyjmują stałe daty i nie znają \"dzisiaj\".",
        drill: "Instalacja pokazuje wszystkie 12 zgłoszeń, a is_late wskazuje 3 po terminie.",
      },
      {
        department: "HR",
        question: "Kogo nie będzie w przyszłym miesiącu i w którym zespole zabraknie ludzi?",
        answer: "Na produkcję przypada 46 z 76 dni urlopu, czyli 60,5%, a bierze je 9 osób. Tę liczbę warto sprawdzić przed ułożeniem grafiku.",
        reportTitle: "Urlopy w przyszłym miesiącu wg zespołu",
        columns: ["Zespół", "Osoby", "Dni urlopu", "Udział w dniach"],
        rows: [
          ["Produkcja", "9", "46", "60,5%"],
          ["Sprzedaż", "4", "18", "23,7%"],
          ["Biuro", "3", "12", "15,8%"],
        ],
        total: ["Razem", "16", "76", "100,0%"],
        highlightRow: 0,
        built: "Wiersze: zespół. Parametr: miesiąc, wybierany przez czytelnika. Miary: countDistinct osób, suma dni i ta sama suma jako % całości. Wnioski urlopowe są tu obiektem własnym.",
        drill: "Produkcja pokazuje każdy wniosek urlopowy z nazwiskiem i datami.",
      },
      {
        department: "Utrzymanie ruchu",
        question: "Który sprzęt kosztuje najwięcej w częściach zamiennych?",
        answer: "Linie pras pochłaniają 38 200 z 54 900, czyli 69,6%, przy 14 z 29 zleceń. Następne jest pakowanie z kwotą 12 600. To punkt wyjścia do decyzji o naprawie albo wymianie.",
        reportTitle: "Koszt utrzymania wg typu sprzętu",
        columns: ["Sprzęt", "Zlecenia", "Koszt części", "Pozycja"],
        rows: [
          ["Linie pras", "14", "38 200", "1"],
          ["Pakowanie", "9", "12 600", "2"],
          ["Przenośniki", "6", "4 100", "3"],
        ],
        total: ["Razem", "29", "54 900", "-"],
        highlightRow: 0,
        built: "Wiersze: typ sprzętu. Miary: liczba zleceń, suma kosztu części i ta sama suma jako pozycja w rankingu. Ranking nie ma wartości w wierszu sumy, więc ta komórka zostaje pusta.",
        drill: "Linie pras pokazują 14 zleceń składających się na 38 200.",
      },
      {
        department: "Zarząd",
        question: "Ile każda spółka wnosi do grupy?",
        answer: "Spółka A to 62,0% z 2 000 000, a spółka C to 12,0%. Raport sumuje to, co zwraca zapytanie, więc wyłączenia wewnątrzgrupowe i przeliczenie walut trzeba zapisać w SQL.",
        reportTitle: "Przychód netto wg spółki",
        columns: ["Spółka", "Przychód netto", "Udział w grupie"],
        rows: [
          ["Spółka A", "1 240 000", "62,0%"],
          ["Spółka B", "520 000", "26,0%"],
          ["Spółka C", "240 000", "12,0%"],
        ],
        total: ["Grupa", "2 000 000", "100,0%"],
        highlightRow: 2,
        built: "Zakres: ORGANIZATION_REPORTING, dla osób z org.companyData.readAll. Wiersze: spółka. Miary: suma netto i ta sama suma jako % sumy całkowitej.",
        drill: "Spółka C pokazuje faktury składające się na jej 240 000.",
      },
    ],
    industries: {
      title: "Te same miary w innych branżach.",
      note: "Przykłady poglądowe. Dane muszą najpierw być prowadzone w Opero.",
      items: [
        { industry: "Produkcja", description: "Koszt części zamiennych na linię w kolejnych miesiącach, z różnicą procentową względem poprzedniego miesiąca." },
        { industry: "Budownictwo", description: "Faktury kosztowe względem pozycji budżetu na budowę, z fakturami każdej pozycji o jedno kliknięcie dalej." },
        { industry: "Usługi profesjonalne", description: "Godziny przepracowane podzielone przez sprzedane, na klienta i konsultanta, jako wskaźnik poprawny także w sumach częściowych." },
        { industry: "Serwis terenowy", description: "Wizyty na technika i region oraz share([closed_first_visit]) jako odsetek spraw zamkniętych za pierwszym razem." },
      ],
    },
  },
  calculation: {
    title: "Średnia z marż w wierszach daje 31,7%. Faktyczna suma to 27,5%.",
    description:
      "W tym przykładzie (30,0 + 15,0 + 50,0) / 3 daje 31,7%, bo najmniejszy klient C waży tyle samo co największy. Opero wkompilowuje miarę wyliczaną w zapytanie agregujące, więc wiersz sumy liczy ją od nowa: (400 000 - 290 000) / 400 000 = 27,5%. Zerowy mianownik daje pustą komórkę, a nie błąd.",
    margin: {
      title: "Marża wg klienta (dane przykładowe)",
      columns: ["Klient", "Netto", "Koszt", "Marża"],
      rows: [
        ["Klient A", "240 000", "168 000", "30,0%"],
        ["Klient B", "120 000", "102 000", "15,0%"],
        ["Klient C", "40 000", "20 000", "50,0%"],
      ],
      averageLabel: "Średnia z wierszy",
      averageValue: "31,7%",
      totalLabel: "Suma w Opero",
      totalValues: ["400 000", "290 000", "27,5%"],
      formulaLabel: "Formuła",
      formula: "([net] - [cost]) / [net]",
    },
    secondTitle: "Co potrafią formuły i gdzie się kończą.",
    bullets: [
      "Ilorazy agregatów: sum([net]) / countDistinct([invoice_id]) daje średnią fakturę, nawet gdy zapytanie zwraca pozycje faktur.",
      "Tylko część wierszy: sumIf, countIf i share, z warunkiem sprawdzanym na każdym wierszu źródłowym.",
      "Bez formuły: % sumy całkowitej, kolumny, wiersza lub grupy nadrzędnej, suma narastająca, różnica, różnica procentowa i ranking. Udział i suma narastająca wymagają miary typu suma lub liczba.",
      "Miesiące bez danych nie są uzupełniane, więc \"poprzedni\" oznacza poprzedni istniejący wiersz. Działania na pojedynczych wierszach, np. cena x ilość, należą do zapisanego zapytania.",
      "Okno proponuje iloraz, różnicę, zmianę, średnią na jednostkę albo własną formułę, pokazuje podgląd sumy całkowitej i wskazuje literówkę w nazwie wraz z podpowiedzią.",
    ],
    image: {
      src: "/opero/reports/calculated-measure.webp",
      alt: "Kreator raportu Opero z otwartym oknem miary wyliczanej, ilorazem dwóch miar i podglądem sumy całkowitej",
      width: 1090,
      height: 1000,
    },
  },
  oneVersion: {
    title: "Dwa pliki za październik z różnicą 22 600 zastępuje jedna definicja raportu.",
    description:
      "Raport to konfiguracja organizacji: jedno zapisane zapytanie i jeden układ. Strony i układy rekordów osadzają go po identyfikatorze, więc nie ma kopii, która mogłaby się rozjechać. W tym przykładzie odczytuje z rekordów 1 297 300, a wykonanie dla firmy obejmuje tylko jej wiersze, czego pilnują reguły RLS w bazie danych.",
    files: [
      { name: "sprzedaz_paz_FINAL.xlsx", meta: "Eksport z czwartku", totalLabel: "Suma za październik", total: "1 284 500" },
      { name: "sprzedaz_paz_v2_Marek.xlsx", meta: "Eksport z piątku", totalLabel: "Suma za październik", total: "1 261 900" },
    ],
    report: { name: "Sprzedaż wg miesięcy", meta: "Jeden raport, czytany z rekordów", totalLabel: "Suma za październik", total: "1 297 300" },
    audiences: ["Spółka A", "Spółka B", "Spółka C", "Grupa"],
    points: [
      { title: "Poprawka trafia na każdą stronę", description: "Po edycji raportu lub zapytania przechowane wyniki przestają obowiązywać, bo klucz pamięci podręcznej zawiera wersje obu." },
      { title: "Każda firma widzi swoje", description: "COMPANY to zakres domyślny. Jeden raport obsługuje wszystkie firmy, a baza danych ogranicza wykonanie do firmy czytelnika." },
      { title: "Grupa widzi całość", description: "ORGANIZATION_REPORTING działa we wszystkich firmach, tylko dla osób z org.companyData.readAll. Tokeny API nigdy tego nie dostają." },
    ],
  },
  reslice: {
    title: "Czytelnik może przegrupować raport, nie zmieniając go nikomu innemu.",
    description:
      "W tym przykładzie raport Otwarte szanse grupuje po etapie, firmie i szansie. Czytelnik zawęża go do jednej firmy w menu Filtr albo przeciąga Firmę na początek. To działa jako tymczasowy układ, a zapisany raport zostaje bez zmian.",
    bullets: [
      "Pogrupuj po innym polu, zamień miarę albo sposób agregacji na panelu pól. Nic z tego nie nadpisuje raportu.",
      "Listy wyboru pokazują domyślnie do 200 unikalnych wartości, a pozostałe filtry czytelnika zawężają każdą z nich.",
      "Grupuj daty po roku, kwartale, miesiącu, tygodniu albo dniu.",
      "Dla \"Mojego lejka\" powiąż parametr FIXED z {{ user.id }}. Czytelnik nie zobaczy go ani nie nadpisze, a jego własne filtry nie są granicą bezpieczeństwa.",
      "Po wyłączeniu kontrolek w bloku strony czytelnik dostaje tylko tabelę albo wykres, z odświeżaniem i eksportem.",
    ],
    image: {
      src: "/opero/reports/field-shelf.webp",
      alt: "Raport Opero z otwartym menu filtra na polach Etap i Firma, nad panelem pól i tabelą przestawną",
      width: 2000,
      height: 1250,
    },
  },
  dashboards: {
    title: "Strona dla każdego zespołu, z jego raportami, licznikami i listami.",
    description:
      "Strona własna mieści bloki raportów, liczniki zasilane zapisanymi zapytaniami, Custom Lists, listy SQL i kalendarze. Ustawiasz jej odbiorców i dodajesz link do menu zespołu. Raporty nie mają własnych odbiorców, więc raport marży powinien trafić na stronę ograniczoną do działu finansów.",
    image: {
      src: "/opero/reports/overview-dashboard.webp",
      alt: "Pulpit Overview w Opero z licznikami lejka, wykresem przychodu wg miesiąca zamknięcia, lejkiem wg etapów i listą największych szans",
      width: 2000,
      height: 1400,
    },
    teams: [
      { team: "Szef sprzedaży", description: "Otwarty lejek i prognoza ważona jako liczniki, przychód wg miesiąca zamknięcia i największe szanse wg wartości ważonej." },
      { team: "Finanse", description: "Przeterminowane faktury jako licznik, koszty wg miesięcy na wykresie i tabela przestawna wg klienta pod spodem." },
      { team: "Operacje", description: "Zgłoszenia po terminie jako licznik, otwarte zgłoszenia na technika i kalendarz najbliższych wizyt." },
      { team: "Wsparcie", description: "Blok helpdesk.metrics: liczba moich otwartych, nieprzypisanych i bliskich przekroczenia SLA oraz mediany pierwszej odpowiedzi i rozwiązania z 30 dni." },
    ],
  },
  delivery: {
    title: "XLSX lub CSV na żądanie i mail z reguły uruchamianej według harmonogramu.",
    export: {
      title: "Wyeksportuj widok zbiorczy albo surowe wiersze, z zastosowanymi filtrami.",
      description:
        "Menu oferuje oba warianty, w Excelu lub CSV. XLSX zachowuje format procentowy, a CSV zawiera surowe wartości. Domyślnie eksport surowych wierszy kończy się na 250 000, a wynik zbiorczy na 50 000 wierszy. Eksportu do PDF nie ma.",
      image: {
        src: "/opero/reports/export-menu.webp",
        alt: "Zbliżenie menu eksportu raportu Opero z widokiem zbiorczym lub surowymi wierszami w Excelu i CSV",
        width: 1400,
        height: 900,
      },
    },
    schedule: {
      title: "Mail do kierownika w poniedziałek, gdy po terminie jest ponad 10 zgłoszeń.",
      description:
        "Raporty nie mają własnych subskrypcji, więc buduje się to regułą, z zapisanym zapytaniem podobnym do tego, które zasila raport. Przykład:",
      steps: [
        { label: "Wyzwalacz CRON: 0 7 * * 1", detail: "Poniedziałek, 7:00 czasu serwera, raz dla każdej firmy, w której reguła jest udostępniona." },
        { label: "RUN_QUERY: zgłoszenia po terminie", detail: "Zapisane zapytanie zwraca late_count dla danej firmy." },
        { label: "CONDITION: late_count > 10", detail: "Przy niepodłączonej ścieżce false wykonanie kończy się sukcesem i niczego nie wysyła." },
        { label: "SEND_EMAIL do kierownika operacji", detail: "Z liczbą w treści i linkiem do strony. Przebieg zostaje w historii wykonań reguły." },
      ],
      cta: "Zobacz, co jeszcze potrafią reguły",
    },
  },
  build: {
    title: "Ktoś pisze SQL raz. Układ i osadzenie są wizualne.",
    description:
      "Tym kimś może być Twój administrator, nasz zespół albo agent AI podłączony przez MCP, który przed zapisem sprawdza podgląd na prawdziwych liczbach. Osoby czytające raport nie widzą zapytania.",
    cta: "Zobacz, jak działa agent AI",
    steps: [
      { title: "Napisz zapisane zapytanie", description: "Jeden SELECT na dozwolonych tabelach: obiekty własne, kontrahenci, faktury sprzedaży i kosztowe, budżety, zgłoszenia. DDL, set_config i pg_sleep są odrzucane, a zapytanie działa na roli tylko do odczytu app_readonly." },
      { title: "Ułóż raport", description: "Przeciągasz pola na wiersze, kolumny i miary i sprawdzasz prawdziwe liczby, w tabeli przestawnej albo na wykresie. Zapis się nie uda, gdy kolumna nie istnieje albo suma wskazuje kolumnę tekstową." },
      { title: "Aktywuj i osadź", description: "Renderuje się tylko raport ACTIVE. Dodajesz go jako blok na stronie albo w układzie rekordu, z kontrolkami lub bez. O tym, kto czyta liczby, decydują odbiorcy tej strony." },
    ],
  },
  faq: reportsFaq,
  related: {
    title: "Zobacz też",
    items: [
      { feature: "noCode", title: "Platforma no-code", description: "Zamodeluj obiekty i pola, które będą czytać raporty, i zbuduj strony, na których się pojawią." },
      { feature: "lowCode", title: "Low-code i automatyzacja", description: "Zapisane zapytania i reguły z krokami RUN_QUERY i CONDITION, według harmonogramu cron albo przy zmianie rekordu." },
      { feature: "ai", title: "Kontekstowe AI", description: "Opisz raport, którego potrzebujesz, a podłączony agent AI przygotuje zapytanie i sprawdzi jego podgląd na Twoich danych." },
    ],
  },
  finalCta: {
    title: "Przynieś skoroszyt, który Twój zespół składa co poniedziałek.",
    description: "Pokaż nam plik i źródła jego danych. Na prezentacji przejdziemy przez zapisane zapytanie, miary i stronę, którymi stałby się w Opero, oraz przez to, co trzeba by najpierw zaimportować.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Skontaktuj się z nami",
  },
};
