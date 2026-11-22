import type { LateInterestLabels, LateInterestPageContent } from "@/content/types";
import { nbpRateLabels } from "./nbp-rate";

export const lateInterestPage: LateInterestPageContent = {
  seo: {
    title: "Kalkulator odsetek za opóźnienie",
    description:
      "Odsetki za opóźnienie w transakcjach handlowych i rekompensata 40, 70 lub 100 euro, ze stawkami z każdego półrocza. Kilka faktur, wydruk do noty. Za darmo.",
  },
  navLabel: "Kalkulator odsetek",
  navDescription: "Odsetki za opóźnienie w transakcjach handlowych i rekompensata 40, 70 lub 100 euro.",
  hero: {
    title: "Kalkulator odsetek za opóźnienie",
    description:
      "Wpisz kwotę faktury, termin i datę zapłaty, a policzymy odsetki ustawowe za opóźnienie w transakcjach handlowych ze stawką z właściwego półrocza i rekompensatę 40, 70 lub 100 euro.",
  },
  explainer: {
    title: "Odsetki w transakcjach handlowych: stawka na półrocze",
    paragraphs: [
      "Gdy firma płaci innej firmie po terminie, wierzycielowi należą się odsetki ustawowe za opóźnienie w transakcjach handlowych, bez wysyłania wezwania. Ich stawka to stopa referencyjna NBP plus 10 punktów procentowych. Jeśli dłużnikiem jest publiczny szpital lub inny publiczny podmiot leczniczy, plus 8 punktów.",
      "Stawka jest stała przez pół roku: od 1 stycznia do 30 czerwca liczy się stopa referencyjna z 1 stycznia, a od 1 lipca do 31 grudnia z 1 lipca. Zmiana stopy w trakcie półrocza nie zmienia odsetek handlowych, w przeciwieństwie do zwykłych odsetek ustawowych z kodeksu cywilnego.",
      "Od dnia, w którym należą się odsetki, wierzyciel może też żądać rekompensaty za koszty odzyskiwania należności: 40 euro, gdy kwota nie przekracza 5000 zł, 70 euro do 50 000 zł i 100 euro od 50 000 zł. Euro przelicza się po kursie średnim NBP z ostatniego dnia roboczego miesiąca przed miesiącem, w którym minął termin zapłaty. Rekompensata należy się od każdej faktury.",
      "Odsetki liczymy od dnia po terminie zapłaty do dnia zapłaty włącznie, od kwoty brutto, według wzoru kwota × stawka × dni / 365. Jeśli termin wypada w sobotę lub święto, przesuwa się na następny dzień roboczy.",
    ],
    table: {
      caption: "Kiedy należą się odsetki",
      columns: ["Sytuacja", "Od kiedy odsetki", "Przepis"],
      rows: [
        ["Termin zapłaty w umowie, dłużnik nie jest podmiotem publicznym", "Od dnia po terminie", "Art. 7 ust. 1"],
        ["Termin dłuższy niż 60 dni od doręczenia faktury, niedozwolony", "Po 60 dniach od doręczenia faktury", "Art. 7 ust. 2–3"],
        ["Dłużnik jest podmiotem publicznym", "Od dnia po terminie, najpóźniej po 30 dniach (podmiot leczniczy: 60)", "Art. 8"],
        ["Wierzyciel z sektora MŚP, termin dłuższy niż 30 dni", "Może żądać odsetek po 30 dniach", "Art. 5"],
        ["Brak terminu w umowie", "Po 30 dniach od spełnienia świadczenia", "Art. 6"],
      ],
    },
  },
  rateTable: {
    title: "Odsetki ustawowe za opóźnienie w transakcjach handlowych",
    intro:
      "Stawki z obwieszczeń w Monitorze Polskim, w skali roku. Każda obowiązuje przez całe półrocze, bez względu na zmiany stopy referencyjnej NBP w jego trakcie.",
    columns: ["Okres", "Dłużnik w transakcji handlowej", "Publiczny podmiot leczniczy", "Obwieszczenie"],
    halves: { first: "I półrocze {year}", second: "II półrocze {year}" },
    oneRateNote: "Do 2019 r. obowiązywała jedna stawka dla wszystkich dłużników: stopa referencyjna plus 8 punktów.",
    civilTitle: "Zwykłe odsetki ustawowe za opóźnienie (art. 481 KC)",
    civilIntro: "Stopa referencyjna NBP plus 5,5 punktu. Stawka zmienia się w dniu zmiany stopy referencyjnej.",
    civilColumns: ["Od dnia", "Stawka", "Obwieszczenie"],
    derived: "stopa referencyjna + 5,5 pkt",
  },
  sources: {
    title: "Podstawa prawna i źródła",
    updatedLabel: "Stawki aktualne na:",
    updatedAt: "2026-11-16",
    note: "Narzędzie ma charakter informacyjny. Wiążące są obwieszczenia w Monitorze Polskim i tabele kursów NBP.",
    items: [
      {
        label: "Ustawa o przeciwdziałaniu nadmiernym opóźnieniom w transakcjach handlowych (Dz.U. 2023 poz. 1790)",
        href: "https://api.sejm.gov.pl/eli/acts/DU/2023/1790/text.pdf",
      },
      { label: "Obwieszczenie Ministra Finansów i Gospodarki z 22 czerwca 2026 r. (M.P. 2026 poz. 642)", href: "https://api.sejm.gov.pl/eli/acts/MP/2026/642/text.pdf" },
      { label: "Obwieszczenie Ministra Finansów i Gospodarki z 11 grudnia 2025 r. (M.P. 2025 poz. 1257)", href: "https://api.sejm.gov.pl/eli/acts/MP/2025/1257/text.pdf" },
      { label: "Kodeks cywilny, art. 115 i 481 (Dz.U. 2026 poz. 795)", href: "https://api.sejm.gov.pl/eli/acts/DU/2026/795/text.pdf" },
      { label: "Obwieszczenie Ministra Sprawiedliwości z 8 kwietnia 2026 r. (M.P. 2026 poz. 367)", href: "https://api.sejm.gov.pl/eli/acts/MP/2026/367/text.pdf" },
      { label: "Wyrok TSUE z 20 października 2022 r., C-585/20", href: "https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:62020CJ0585" },
      { label: "API NBP", href: "https://api.nbp.pl/" },
    ],
  },
  faq: {
    title: "Częste pytania",
    items: [
      {
        question: "Ile wynoszą odsetki za opóźnienie w transakcjach handlowych w 2026 r.?",
        answer:
          "Od 1 stycznia do 30 czerwca 2026 r. 14%, a od 1 lipca do 31 grudnia 2026 r. 13,75% w skali roku. Gdy dłużnikiem jest publiczny podmiot leczniczy, odpowiednio 12% i 11,75%.",
      },
      {
        question: "Dlaczego stawka nie zmieniła się w marcu, gdy NBP obniżył stopy?",
        answer:
          "Odsetki w transakcjach handlowych liczy się od stopy referencyjnej z 1 stycznia albo z 1 lipca, przez całe półrocze. Obniżka z 5 marca 2026 r. zmieniła od razu tylko zwykłe odsetki ustawowe z kodeksu cywilnego, do 9,25%.",
      },
      {
        question: "Co to jest rekompensata 40 euro i kiedy przysługuje?",
        answer:
          "To stała kwota za koszty odzyskiwania należności. Należy się bez wezwania od dnia, w którym należą się odsetki: 40 euro do 5000 zł, 70 euro powyżej 5000 zł i poniżej 50 000 zł oraz 100 euro od 50 000 zł. Nie trzeba wykazywać, że poniesiono koszty.",
      },
      {
        question: "Czy rekompensata należy się od każdej faktury?",
        answer:
          "Tak. Według wyroku TSUE C-585/20 kwota należy się za każdą transakcję potwierdzoną fakturą, także gdy dochodzisz kilku faktur naraz.",
      },
      {
        question: "Po jakim kursie przeliczyć 40 euro na złote?",
        answer:
          "Po kursie średnim euro NBP z ostatniego dnia roboczego miesiąca poprzedzającego miesiąc, w którym minął termin zapłaty. Dla terminu w listopadzie 2026 r. to kurs z 30 października 2026 r.: 4,3955 zł, tabela 212/A/NBP/2026.",
      },
      {
        question: "Od jakiej kwoty liczyć odsetki: netto czy brutto?",
        answer: "Od kwoty brutto, czyli z VAT, bo dłużnik ma zapłacić całą fakturę. Od kwoty brutto zależy też wysokość rekompensaty.",
      },
      {
        question: "Co jeśli termin zapłaty wypada w weekend?",
        answer:
          "Termin przypadający w sobotę lub dzień ustawowo wolny upływa następnego dnia roboczego (art. 115 kodeksu cywilnego). Odsetki liczymy od dnia po nim.",
      },
      {
        question: "Jak liczyć dni opóźnienia?",
        answer:
          "Od dnia po terminie do dnia zapłaty włącznie. Przy przelewie dniem zapłaty jest zwykle dzień wpływu pieniędzy na rachunek wierzyciela. Rok liczymy jako 365 dni, także przestępny.",
      },
      {
        question: "Czym różnią się odsetki handlowe od zwykłych odsetek ustawowych?",
        answer:
          "Zwykłe odsetki ustawowe za opóźnienie z art. 481 kodeksu cywilnego to stopa referencyjna NBP plus 5,5 punktu i zmieniają się w dniu zmiany stopy. Stosuje się je, gdy dług nie wynika z transakcji handlowej między firmami, np. wobec konsumenta.",
      },
      {
        question: "Jak wystawić notę odsetkową?",
        answer:
          "Policz odsetki dla zaległych faktur, skopiuj zestawienie albo je wydrukuj i dołącz do noty z danymi stron, numerem i terminem zapłaty. Nota odsetkowa nie jest fakturą VAT, bo odsetki nie podlegają VAT.",
      },
      {
        question: "Czy kalkulator działa dla umów sprzed 2016 r.?",
        answer:
          "Nie. Do transakcji zawartych przed 2016 r. stosuje się dawne odsetki, równe odsetkom od zaległości podatkowych. Dla umów z lat 2016–2019 kalkulator stosuje przepisy przejściowe, ale w sporze sprawdź je z prawnikiem.",
      },
      {
        question: "Czy KodaSoft widzi, co wpisuję?",
        answer:
          "Nie. Kwoty i daty liczymy w Twojej przeglądarce. Do API NBP trafia tylko zapytanie o kurs euro z danego miesiąca, wysłane prosto z Twojego urządzenia.",
      },
    ],
  },
  opero: {
    title: "Zaległe faktury przy kontrahencie",
    body: "W Opero widzisz zaległe faktury sprzedaży przy kontrahencie, z terminem i kwotą.",
    primaryCta: "Umów demo",
    secondaryCta: "Opero AI",
    points: [
      { title: "Dni zwłoki na liście", body: "Lista faktur może pokazywać, ile dni każda jest po terminie, więc spóźnialskich widać od razu." },
      { title: "Przypomnienia wokół terminu", body: "Reguła datowa powiadamia opiekuna klienta przed terminem płatności lub po nim, do 365 dni w każdą stronę." },
      { title: "Wezwanie do zapłaty jednym krokiem", body: "Reguła generuje PDF wezwania z danych faktury, dołącza go do rekordu i wysyła mailem." },
    ],
  },
  otherToolsTitle: "Inne narzędzia",
};

export const lateInterestLabels: LateInterestLabels = {
  modeLabel: "Rodzaj odsetek",
  modes: { commercial: "Transakcja handlowa (firmy)", civil: "Odsetki ustawowe (KC)" },
  healthcareLabel: "Dłużnik jest podmiotem publicznym będącym podmiotem leczniczym (np. publiczny szpital)",
  compensationLabel: "Dolicz rekompensatę 40, 70 lub 100 euro",
  columns: { label: "Faktura", amount: "Kwota brutto do zapłaty", due: "Termin płatności", paid: "Data zapłaty" },
  labelPlaceholder: "FV/2026/0412",
  amountHint: "Kwota z VAT, czyli tyle, ile dłużnik miał zapłacić.",
  paidHint: "Dzień wpływu na rachunek wierzyciela.",
  unpaidLabel: "Nadal niezapłacona",
  invoiceName: "Faktura {n}",
  cellLabel: "{column}, faktura {n}",
  removeRow: "Usuń fakturę",
  addRow: "Dodaj fakturę",
  maxRows: "Możesz dodać do {max} faktur.",
  untilLabel: "Licz odsetki do dnia",
  untilHint: "Dla faktur, które są nadal niezapłacone.",
  total: "Razem",
  totalBreakdown: "odsetki {interest} + rekompensata {compensation}",
  resultColumns: { period: "Okres", days: "Dni", rate: "Stawka", interest: "Odsetki" },
  invoiceSummary: "{amount} · termin {due} · {end} · {days}",
  paidOn: "zapłata {date}",
  unpaidUntil: "niezapłacona, liczone do {date}",
  days: { one: "dzień", many: "dni" },
  interest: "Odsetki",
  compensation: "Rekompensata: {eur} EUR × {mid} (tabela {no} z {date}) = {pln}",
  compensationEur: "Rekompensata: {eur} EUR",
  compensationLoading: "Pobieram kurs euro z NBP…",
  compensationFailed: "Nie udało się pobrać kursu euro z NBP.",
  retry: "Spróbuj ponownie",
  compensationPending: "Kurs z ostatniego dnia roboczego {month} nie jest jeszcze znany. Najnowszy dostępny to {mid} (tabela {no}), więc rekompensata zostaje w euro.",
  flatCompensationNote: "Przed 2020 r. rekompensata wynosiła 40 euro bez względu na kwotę.",
  dayOff: "{days} to {reason}",
  shifted: "{list}, więc termin upłynął {date} (art. 115 KC).",
  dayOffNames: nbpRateLabels.dayOffNames,
  forecastMark: "prognoza",
  forecastNote: "Stawka prognozowana: od {date} przyjęto ostatnią ogłoszoną stawkę. Nowa może być inna.",
  errors: {
    amount: "Wpisz kwotę większą od zera, na przykład 1 234,56.",
    due: "Wpisz termin płatności.",
    beforeFirst: "Kalkulator liczy terminy od 1 stycznia 2016 r. Dla umów sprzed 2016 r. obowiązywały inne odsetki.",
    paid: "Wpisz datę zapłaty albo zaznacz, że faktura jest nadal niezapłacona.",
    notLate: "Zapłata w terminie – odsetki się nie należą.",
    until: "Wpisz datę, do której liczyć odsetki.",
  },
  titles: {
    commercial: "Odsetki ustawowe za opóźnienie w transakcjach handlowych",
    civil: "Odsetki ustawowe za opóźnienie (art. 481 KC)",
  },
  copyNote: "Skopiuj zestawienie",
  copied: "Skopiowano",
  print: "Drukuj",
  privacyNote:
    "Kwoty i daty liczą się na Twoim urządzeniu. Do api.nbp.pl trafia tylko zapytanie o kurs euro z danego miesiąca, prosto z Twojej przeglądarki, a do KodaSoft nic nie trafia.",
  pln: "zł",
  decimalSeparator: ",",
  defaultAmount: "12 300,00",
  defaultLabel: "FV/2026/0412",
};
