import type { NbpRateLabels, ToolPageContent } from "@/content/types";

export const nbpRatePage: ToolPageContent = {
  seo: {
    title: "Kurs NBP z dnia poprzedzającego fakturę",
    description:
      "Kurs średni NBP z ostatniego dnia roboczego przed datą faktury, z numerem tabeli. Przelicz kwotę i VAT na złote. Tabele A i B, bez rejestracji.",
  },
  navLabel: "Kurs NBP do faktury",
  navDescription: "Kurs średni NBP z dnia poprzedzającego, z numerem tabeli i VAT w złotych.",
  hero: {
    title: "Kurs NBP do faktury",
    description:
      "Wybierz walutę i datę, a dostaniesz kurs średni NBP z dnia poprzedzającego, czyli z ostatniego dnia roboczego przed nią, z numerem tabeli. Przeliczysz też kwotę i VAT na złote.",
  },
  explainer: {
    title: "Jaki kurs NBP do faktury: dzień poprzedzający",
    paragraphs: [
      "Kwoty z faktury w walucie obcej przelicza się na złote po kursie średnim NBP z ostatniego dnia roboczego przed dniem, od którego liczy się podatek. To nie musi być dzień wcześniej: w poniedziałek obowiązuje kurs z piątku, a po święcie kurs z ostatniego dnia, w którym NBP opublikował tabelę.",
      "W VAT tym dniem jest zwykle dzień powstania obowiązku podatkowego, czyli najczęściej dostawy towaru albo wykonania usługi. Jeśli fakturę wystawiasz przed tym dniem, liczy się kurs z dnia poprzedzającego wystawienie faktury.",
      "W podatku dochodowym przychód przeliczasz po kursie z dnia roboczego przed dniem jego uzyskania, a koszt po kursie z dnia roboczego przed dniem jego poniesienia. Dlatego ta sama faktura może mieć inny kurs w VAT, a inny w PIT albo CIT.",
      "Kwotę VAT na fakturze w walucie obcej podaje się także w złotych: przelicza się VAT wyliczony w walucie, po tym samym kursie, i zaokrągla do grosza. Numer tabeli NBP nie jest obowiązkowym elementem faktury, ale warto go podać, bo pozwala sprawdzić przeliczenie.",
    ],
    table: {
      caption: "Od jakiego dnia liczyć kurs",
      columns: ["Sytuacja", "Wpisz datę", "Przepis"],
      rows: [
        ["Sprzedaż, faktura po dostawie lub w dniu dostawy", "Dzień dostawy lub wykonania usługi (obowiązek podatkowy)", "Art. 31a ust. 1 ustawy o VAT"],
        ["Faktura wystawiona przed dostawą", "Dzień wystawienia faktury", "Art. 31a ust. 2 ustawy o VAT"],
        ["Przychód w PIT lub CIT", "Dzień uzyskania przychodu", "Art. 11a ust. 1 PIT, art. 12 ust. 2 CIT"],
        ["Koszt w PIT lub CIT", "Dzień poniesienia kosztu", "Art. 11a ust. 2 PIT, art. 15 ust. 1 CIT"],
        ["Faktura korygująca", "Kurs z faktury pierwotnej albo z dnia przed wystawieniem korekty", "Art. 31b ustawy o VAT"],
      ],
    },
  },
  sources: {
    title: "Podstawa prawna i źródła",
    updatedLabel: "Zasady aktualne na:",
    updatedAt: "2026-11-15",
    note: "Narzędzie ma charakter informacyjny. Wiążące są tabele kursów publikowane przez NBP.",
    items: [
      { label: "Tabele kursów średnich NBP (nbp.pl)", href: "https://nbp.pl/statystyka-i-sprawozdawczosc/kursy/tabela-a/" },
      { label: "Terminy publikacji kursów walut (NBP)", href: "https://nbp.pl/statystyka-i-sprawozdawczosc/kursy/informacja-o-terminach-publikacji-kursow-walut/" },
      { label: "API NBP", href: "https://api.nbp.pl/" },
      { label: "Art. 31a, 31b i 106e ust. 11 ustawy o podatku od towarów i usług (Dz.U. 2026 poz. 1263)", href: "https://api.sejm.gov.pl/eli/acts/DU/2026/1263/text.pdf" },
      { label: "Art. 11a ustawy o podatku dochodowym od osób fizycznych (Dz.U. 2026 poz. 592)", href: "https://api.sejm.gov.pl/eli/acts/DU/2026/592/text.pdf" },
      { label: "Art. 12 ust. 2 i art. 15 ust. 1 ustawy o podatku dochodowym od osób prawnych (Dz.U. 2026 poz. 554)", href: "https://api.sejm.gov.pl/eli/acts/DU/2026/554/text.pdf" },
    ],
  },
  faq: {
    title: "Częste pytania",
    items: [
      {
        question: "Z jakiego dnia kurs NBP do faktury?",
        answer:
          "Z ostatniego dnia roboczego przed dniem powstania obowiązku podatkowego, a jeśli faktura jest wystawiona wcześniej, przed dniem jej wystawienia. Wpisz tę datę, a narzędzie samo znajdzie właściwą tabelę.",
      },
      {
        question: "Jaki kurs NBP, gdy faktura jest z poniedziałku albo z dnia po święcie?",
        answer:
          "NBP nie publikuje tabel w weekendy i święta, więc liczy się ostatnia tabela przed tymi dniami: w poniedziałek piątkowa, a 12 listopada ta z 10 listopada.",
      },
      {
        question: "O której NBP publikuje kursy?",
        answer:
          "Tabelę A w dni robocze między 11:45 a 12:15, tabelę B w środy w tych samych godzinach. Jeśli środa jest dniem wolnym, NBP publikuje ją dzień wcześniej. Jeśli potrzebny kurs nie jest jeszcze opublikowany, narzędzie to pokaże.",
      },
      {
        question: "Czy na fakturze trzeba podać kurs i numer tabeli NBP?",
        answer:
          "Przepisy wymagają kwoty VAT w złotych, ale nie kursu ani numeru tabeli. Warto je podać albo zapisać w dokumentacji, bo pozwalają sprawdzić przeliczenie. Skopiuj gotową adnotację z wyniku.",
      },
      {
        question: "Jak przeliczyć VAT z faktury w euro na złote?",
        answer:
          "Policz VAT w euro i przelicz go po tym samym kursie, zaokrąglając do grosza. Wynik może się różnić o grosz od VAT liczonego od kwoty netto w złotych. Na fakturze obowiązuje ten pierwszy.",
      },
      {
        question: "Czy mogę użyć kursu EBC zamiast NBP?",
        answer:
          "Tak, w VAT możesz wybrać ostatni kurs Europejskiego Banku Centralnego z dnia poprzedzającego. Ten wybór obowiązuje co najmniej 12 miesięcy. To narzędzie pokazuje kurs NBP.",
      },
      {
        question: "Co z walutami spoza tabeli A?",
        answer: "Kursy rzadszych walut NBP publikuje w tabeli B, raz w tygodniu. Wybierz walutę z listy, a narzędzie użyje właściwej tabeli.",
      },
      {
        question: "Czy KodaSoft widzi, co wpisuję?",
        answer:
          "Nie. Do API NBP trafia tylko kod waluty i data, wysłane prosto z Twojej przeglądarki. Kwoty liczymy na Twoim urządzeniu i niczego nie zapisujemy.",
      },
    ],
  },
  opero: {
    title: "W Opero faktura wypełnia się sama",
    body: "Szablony dokumentów w Opero same uzupełniają kwoty i sumy na fakturach danymi, które już są w systemie.",
    primaryCta: "Umów demo",
    secondaryCta: "Dokumenty w Opero",
    points: [
      { title: "Kursy NBP pobierane za Ciebie", body: "Opero pobiera kursy z tabeli A przez API NBP do faktur walutowych, z uwzględnieniem dni wolnych." },
      { title: "Zapisane źródło kursu", body: "Opero zapisuje, skąd pochodzi kurs, i nie wpisuje niczego na oko, gdy NBP nie odpowiada." },
      { title: "Faktury z KSeF", body: "Faktury kosztowe przychodzą z KSeF i od razu stają się rekordami gotowymi do akceptacji." },
    ],
  },
  otherToolsTitle: "Inne narzędzia",
};

export const nbpRateLabels: NbpRateLabels = {
  currencyLabel: "Waluta",
  tableGroups: { A: "Tabela A – kursy publikowane codziennie", B: "Tabela B – raz w tygodniu" },
  dateLabel: "Data obowiązku podatkowego, przychodu lub kosztu",
  dateHint: "Dzień powstania obowiązku podatkowego, wystawienia faktury przed dostawą, przychodu albo kosztu.",
  loading: "Pobieram kurs z NBP…",
  dateWithWeekday: "{date} ({weekday})",
  source: "Kurs średni NBP z {date} · tabela nr {no}",
  reasonIntro: "Dla daty {date} liczy się ostatni dzień roboczy przed nią.",
  dayOff: "{days} to {reason}.",
  dayOffNames: {
    saturday: "sobota",
    sunday: "niedziela",
    weekend: "weekend",
    newYear: "Nowy Rok",
    epiphany: "święto Trzech Króli",
    easter: "Wielkanoc",
    easterMonday: "Poniedziałek Wielkanocny",
    labourDay: "Święto Pracy",
    constitutionDay: "Święto Konstytucji 3 Maja",
    pentecost: "Zielone Świątki",
    corpusChristi: "Boże Ciało",
    assumption: "Wniebowzięcie Najświętszej Maryi Panny",
    allSaints: "Wszystkich Świętych",
    independenceDay: "Narodowe Święto Niepodległości",
    christmasEve: "Wigilia Bożego Narodzenia",
    christmas: "Boże Narodzenie",
    boxingDay: "drugi dzień Bożego Narodzenia",
  },
  tableBNote: "Tabela B jest publikowana raz w tygodniu, w środę (gdy środa jest dniem wolnym, dzień wcześniej).",
  pending: {
    A: "Tabela z dnia {date} nie jest jeszcze opublikowana. NBP publikuje ją w dni robocze między 11:45 a 12:15. Wróć po publikacji.",
    B: "Tabela B z dnia {date} nie jest jeszcze opublikowana. NBP publikuje ją w środy między 11:45 a 12:15. Wróć po publikacji.",
  },
  pendingLatest: "Powyżej najnowszy dostępny kurs, a nie kurs dla tej daty.",
  noteLabel: "Adnotacja na fakturę",
  copyNote: "Skopiuj adnotację",
  copied: "Skopiowano",
  amountTitle: "Przelicz kwotę z faktury",
  amountLabel: "Kwota w {code}",
  basisLabel: "Kwota jest:",
  basis: { net: "netto", gross: "brutto" },
  rateLegend: "Stawka VAT",
  rates: { "23": "23%", "8": "8%", "5": "5%", "0": "0%", zw: "zw.", np: "np." },
  columns: { item: "Pozycja", foreign: "W walucie", pln: "W złotych" },
  net: "Netto",
  vat: "VAT",
  gross: "Brutto",
  vatNote: "VAT w złotych to VAT w walucie przeliczony po kursie (art. 106e ust. 11 ustawy o VAT).",
  copyAmounts: "Skopiuj kwoty",
  vatLink: { before: "Policz VAT od kwoty w złotych w", link: "kalkulatorze VAT", after: "." },
  errors: {
    date: "Wpisz datę od 3 stycznia 2002.",
    amount: "Wpisz kwotę, na przykład 1 234,56.",
    network: "Nie udało się pobrać kursu. NBP może nie mieć kursu tej waluty dla tego okresu albo wystąpił problem z połączeniem.",
    none: "NBP nie opublikował kursu tej waluty w miesiącu przed tą datą.",
  },
  privacyNote: "Do api.nbp.pl trafia tylko kod waluty i daty, prosto z Twojej przeglądarki. Kwoty liczą się na Twoim urządzeniu, a do KodaSoft nic nie trafia.",
  pln: "zł",
  decimalSeparator: ",",
  defaultAmount: "1 000,00",
};
