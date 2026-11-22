import type { B2bVsEmploymentLabels, B2bVsEmploymentPageContent } from "@/content/types";

export const b2bVsEmploymentPage: B2bVsEmploymentPageContent = {
  seo: {
    title: "Kalkulator B2B vs UoP 2026",
    description:
      "Kalkulator B2B czy umowa o pracę 2026: porównaj kwotę na rękę, ZUS, składkę zdrowotną i podatek na skali, liniowym i ryczałcie. Policz stawkę B2B.",
  },
  navLabel: "Kalkulator B2B vs UoP",
  navDescription: "Porównaj kwotę na rękę na etacie i na B2B oraz policz stawkę B2B równą pensji.",
  hero: {
    title: "Kalkulator B2B czy umowa o pracę",
    description:
      "Porównaj, ile zostaje na rękę na etacie i na B2B w 2026 roku. Kalkulator liczy ZUS, składkę zdrowotną i podatek na skali, liniowym i ryczałcie, a także stawkę B2B równą Twojej pensji.",
  },
  explainer: {
    title: "Jak liczymy etat i B2B w 2026 roku",
    paragraphs: [
      "Na etacie od pensji brutto odchodzą Twoje składki ZUS (13,71%), składka zdrowotna (9% od tego, co zostaje) i zaliczka na podatek: 12% dochodu po kosztach 250 zł lub 300 zł, pomniejszona o 300 zł z PIT-2. Gdy roczne zarobki przekroczą 282 600 zł, przestajesz płacić składki emerytalną i rentową, więc pod koniec roku dostajesz więcej. Gdy dochód od początku roku przekroczy 120 000 zł, zaliczka rośnie do 32%.",
      "Na B2B sam płacisz ZUS. W 2026 roku pełny ZUS z chorobowym to 1 926,76 zł miesięcznie, preferencyjny przez pierwsze 24 miesiące 456,18 zł, a przez pierwsze 6 miesięcy możesz płacić tylko składkę zdrowotną (ulga na start). Składka zdrowotna zależy od formy podatku: 9% dochodu na skali, 4,9% na liniowym, a na ryczałcie stała kwota zależna od rocznego przychodu.",
      "Na B2B nie masz płatnego urlopu ani chorobowego od pracodawcy. Żeby porównanie było uczciwe, wpisz dni, w których nie wystawisz faktury. 26 dni to pełny urlop na etacie.",
      "Wynik jest szacunkiem rocznym. Na etacie pokazujemy wypłatę z każdego miesiąca. Na B2B liczymy podatek za cały rok, tak jak w zeznaniu rocznym, a wybrany wariant ZUS przez wszystkie 12 miesięcy. Kwoty z kalkulatorów, które liczą zaliczki miesięczne, mogą się różnić o kilkadziesiąt groszy.",
      "Kilka uproszczeń: w styczniu 2026 roku minimalna składka zdrowotna na skali i liniowym wynosiła jeszcze 314,96 zł, a my liczymy 432,54 zł przez cały rok. W miesiącu, w którym osoba przed 26. rokiem życia przekracza limit ulgi, dzielimy zaliczkę proporcjonalnie; programy kadrowe robią to różnie, a zeznanie roczne wyrównuje różnicę.",
    ],
    table: {
      caption: "Najważniejsze kwoty w 2026 roku",
      columns: ["Co", "Kwota"],
      rows: [
        ["Pełny ZUS z chorobowym / bez", "1 926,76 zł / 1 788,29 zł miesięcznie"],
        ["Preferencyjny ZUS z chorobowym / bez", "456,18 zł / 420,86 zł miesięcznie"],
        ["Minimalna składka zdrowotna (skala, liniowy)", "432,54 zł miesięcznie"],
        ["Zdrowotna na ryczałcie (przychód do 60 tys. / do 300 tys. / powyżej)", "498,35 zł / 830,58 zł / 1 495,04 zł"],
        ["Limit odliczenia zdrowotnej na liniowym", "14 100 zł rocznie"],
        ["Próg podatkowy i kwota wolna", "120 000 zł, 30 000 zł"],
        ["Limit 30-krotności", "282 600 zł"],
        ["Ulga dla młodych (do 26 lat, tylko etat i zlecenie)", "85 528 zł przychodu rocznie"],
      ],
    },
  },
  breakEvenTable: {
    title: "Ile B2B to etat: przelicznik",
    intro:
      "Nie ma jednego mnożnika. Tabela pokazuje miesięczną fakturę netto, przy której na B2B zostaje w roku tyle samo, co na etacie, osobno dla każdej formy podatku.",
    columns: ["Pensja brutto", "Na rękę na etacie (średnio)", "Faktura: skala", "Faktura: liniowy", "Faktura: ryczałt 12%"],
    salaries: [6000, 8000, 10000, 12000, 15000, 20000, 25000, 30000],
    note: "Założenia: etat z kosztami 250 zł i PIT-2, bez PPK; B2B z pełnym ZUS i chorobowym, bez kosztów firmy i bez dni wolnych. Faktury zaokrąglone w górę do pełnych złotych. Swoje ustawienia wpisz w kalkulatorze.",
  },
  sources: {
    title: "Podstawa prawna",
    updatedLabel: "Zasady aktualne na:",
    updatedAt: "2026-11-15",
    note: "Kalkulator ma charakter informacyjny i nie zastępuje porady księgowego ani doradcy podatkowego. Wyniki są szacunkiem: liczymy stałą miesięczną pensję i fakturę przez cały rok 2026. Część kwot, w tym limit odliczenia zdrowotnej 14 100 zł i stawki zdrowotnej na ryczałcie, podajemy za komunikatami ZUS i MF w wersji cytowanej przez serwisy branżowe.",
    items: [
      {
        label:
          "Ustawa o podatku dochodowym od osób fizycznych, tekst jedn. Dz.U. 2026 poz. 592: art. 21 ust. 1 pkt 148, art. 22 ust. 2 i 9a, art. 27, art. 30c, art. 31b, art. 32",
        href: "https://api.sejm.gov.pl/eli/acts/DU/2026/592/text.pdf",
      },
      {
        label: "Ustawa o zryczałtowanym podatku dochodowym, Dz.U. 2025 poz. 843: art. 6 ust. 4, art. 8 ust. 2, art. 12",
        href: "https://api.sejm.gov.pl/eli/acts/DU/2025/843/text.pdf",
      },
      { label: "Ustawa o świadczeniach opieki zdrowotnej finansowanych ze środków publicznych: art. 79, art. 81" },
      { label: "Ustawa o systemie ubezpieczeń społecznych: art. 18, art. 18a, art. 19 ust. 1 (limit 30-krotności)" },
      {
        label: "ZUS: wysokość składek na ubezpieczenia społeczne w 2026 r.",
        href: "https://www.zus.pl/-/nowe-wysokości-składek-na-ubezpieczenia-społeczne-w-2026-r.",
      },
      { label: "Obwieszczenie Ministra Finansów o limicie odliczenia składki zdrowotnej na 2026 r. (14 100 zł)" },
    ],
  },
  faq: {
    title: "Częste pytania",
    items: [
      {
        question: "B2B czy umowa o pracę: co się bardziej opłaca?",
        answer:
          "Przy niższych stawkach często etat, bo na B2B stały ZUS (1 926,76 zł) i składka zdrowotna zjadają dużą część faktury. Przy pensji 15 000 zł brutto etat daje średnio 10 016,75 zł na rękę. Taką samą kwotę na B2B z ryczałtem 12% i pełnym ZUS daje faktura około 14 200 zł netto, a na skali około 15 000 zł. Wpisz swoje kwoty, bo wynik zależy od ZUS, kosztów i urlopu.",
      },
      {
        question: "Ile B2B to etat? Jaki jest przelicznik UoP na B2B?",
        answer:
          "Nie ma jednego mnożnika. Zależy od formy podatku, wariantu ZUS, kosztów i dni bez faktury. Kalkulator wylicza stawkę B2B, przy której zostaje Ci tyle samo, co na etacie. Pracodawcę etat kosztuje około 1,2048 × brutto (bez PPK). Samą pensję, zlecenie albo dzieło przeliczysz w kalkulatorze wynagrodzeń.",
      },
      {
        question: "Ile wynosi ZUS na B2B w 2026 roku?",
        answer:
          "Pełny ZUS to 1 926,76 zł z dobrowolnym chorobowym albo 1 788,29 zł bez niego, plus składka zdrowotna. Na start przez 6 miesięcy płacisz tylko zdrowotną, potem przez 24 miesiące preferencyjny ZUS 456,18 zł.",
      },
      {
        question: "Jaka stawka ryczałtu dla programisty?",
        answer:
          "Zwykle 12%: obejmuje tworzenie oprogramowania i doradztwo w zakresie oprogramowania (PKWiU 62.01 i 62.02). Część usług IT, na przykład niektóre usługi wsparcia, ma 8,5%. Stawka zależy od kodu PKWiU usługi, nie od PKD firmy.",
      },
      {
        question: "Czy mogę przejść na B2B u obecnego pracodawcy?",
        answer:
          "Możesz, ale jeśli robisz to samo, co na etacie w tym lub poprzednim roku, nie skorzystasz z podatku liniowego ani z ryczałtu, a także z ulgi na start ani z preferencyjnego ZUS. Zaznacz to w kalkulatorze.",
      },
      {
        question: "Czy na B2B przysługuje urlop i chorobowe?",
        answer:
          "Z mocy prawa nie. Urlop zależy od umowy z klientem, a zasiłek chorobowy z ZUS dostaniesz tylko z dobrowolnym ubezpieczeniem chorobowym, zwykle po 90 dniach jego opłacania.",
      },
      {
        question: "Czy PIP może zamienić B2B na etat?",
        answer:
          "Po reformie Państwowej Inspekcji Pracy, która według dostępnych źródeł obowiązuje od 8 lipca 2026 roku, okręgowy inspektor pracy może decyzją uznać umowę za umowę o pracę, jeśli współpraca wygląda jak etat, a firma nie wykonała wcześniejszego polecenia inspektora. Kalkulator tego nie ocenia. W konkretnej sprawie zapytaj prawnika.",
      },
      {
        question: "Dlaczego na ryczałcie wyższa faktura może dać mniej na rękę?",
        answer:
          "Gdy roczny przychód po odjęciu składek ZUS przekroczy 300 000 zł, składka zdrowotna rośnie z 830,58 zł do 1 495,04 zł miesięcznie, czyli o 7 973 zł rocznie. Podobny skok jest przy 60 000 zł.",
      },
    ],
  },
  opero: {
    title: "Pracownicy i współpracownicy B2B w jednym systemie",
    body: "W Opero dokumenty pracowników i współpracowników B2B oraz ich akceptacje są w jednym miejscu.",
    primaryCta: "Umów demo",
    secondaryCta: "Procesy w Opero",
    points: [
      { title: "Jedna kartoteka na osobę", body: "Umowy, faktury i dokumenty pracowników oraz współpracowników B2B są w kartotece tej osoby." },
      { title: "Umowy generowane z danych", body: "Po akceptacji zatrudnienia reguła generuje PDF umowy z danych w kartotece." },
      { title: "Akceptacje z historią", body: "Każdy dokument przechodzi przez swoje etapy akceptacji, a każda decyzja zostaje w historii." },
    ],
  },
  otherToolsTitle: "Inne narzędzia",
};

export const b2bVsEmploymentLabels: B2bVsEmploymentLabels = {
  grossLabel: "Wynagrodzenie brutto na etacie (miesięcznie)",
  invoiceLabel: "Faktura B2B netto (miesięcznie)",
  breakEvenButton: "Stawka równa etatowi",
  employerCostButton: "Faktura = koszt pracodawcy",
  employmentTitle: "Etat",
  b2bTitle: "B2B",
  kupLegend: "Koszty uzyskania przychodu",
  kup: { standard: "250 zł", commuter: "300 zł (dojazd z innej miejscowości)" },
  pit2: "PIT-2 złożony u pracodawcy",
  under26: "Mam mniej niż 26 lat",
  ppk: "Oszczędzam w PPK (2% + 1,5% od pracodawcy)",
  formLegend: "Forma opodatkowania",
  forms: { skala: "Skala", liniowy: "Liniowy 19%", ryczalt: "Ryczałt" },
  ryczaltRateLabel: "Stawka ryczałtu",
  ryczaltRates: {
    "1200": "12% (m.in. programowanie, doradztwo w zakresie oprogramowania)",
    "850": "8,5% (m.in. część usług IT, edukacja)",
    "1400": "14% (np. architektura, inżynieria, ochrona zdrowia)",
    "1500": "15% (np. doradztwo w zarządzaniu, reklama)",
    "1700": "17% (wolne zawody)",
    "550": "5,5% (np. budowlanka, produkcja)",
    "300": "3% (np. handel)",
  },
  zusLegend: "ZUS",
  zus: { full: "Pełny", preferential: "Preferencyjny", start: "Ulga na start" },
  sickness: "Dobrowolne ubezpieczenie chorobowe",
  costsLabel: "Koszty firmy miesięcznie (netto)",
  daysOffLabel: "Dni bez faktury w roku",
  daysOffHint: "26 dni to pełny urlop na etacie.",
  formerEmployer: "B2B dla obecnego lub byłego pracodawcy, ten sam zakres pracy",
  formerEmployerNote:
    "Gdy na B2B robisz dla obecnego lub byłego pracodawcy to samo, co na etacie w tym lub poprzednim roku, nie wybierzesz podatku liniowego (art. 9a ust. 3 ustawy o PIT) ani ryczałtu (art. 8 ust. 2 ustawy o ryczałcie), a także ulgi na start ani preferencyjnego ZUS. Liczymy skalę i pełny ZUS.",
  unavailable: {
    formerEmployer: "niedostępne przy pracy dla byłego pracodawcy",
    revenueLimit: "przychód powyżej limitu ryczałtu (8 517 200 zł)",
  },
  periodLabel: "Kwoty w zł:",
  period: { month: "miesięcznie (średnio)", year: "rocznie" },
  resultCaption: "Porównanie etatu i B2B",
  rows: {
    net: "Na rękę",
    social: "ZUS społeczny",
    health: "Składka zdrowotna",
    pit: "Podatek",
    ppk: "Wpłata do PPK",
    costs: "Koszty firmy",
    companyCost: "Koszt dla firmy",
  },
  difference: {
    more: "B2B daje o {year} rocznie więcej niż etat, średnio {month} miesięcznie.",
    less: "B2B daje o {year} rocznie mniej niż etat, średnio {month} miesięcznie.",
    equal: "B2B i etat dają tyle samo na rękę.",
  },
  breakEven: "Faktura netto, przy której na B2B ({form}) zostaje tyle samo, co na etacie: {amount} miesięcznie.",
  breakEvenNone: "Przy tych ustawieniach żadna faktura nie daje tyle, co etat.",
  tierEdge: "Ta faktura jest tuż powyżej progu {edge} rocznego przychodu po odjęciu ZUS, od którego składka zdrowotna na ryczałcie wynosi {health} miesięcznie.",
  insert: "Wstaw",
  formsTitle: "Ta sama faktura w innych formach opodatkowania",
  formsColumns: { form: "Forma", netMonth: "Na rękę miesięcznie", netYear: "Na rękę rocznie", health: "Zdrowotna miesięcznie", tax: "Podatek rocznie" },
  monthsTitle: "Etat miesiąc po miesiącu",
  monthsColumns: { month: "Miesiąc", social: "ZUS", health: "Zdrowotna", advance: "Zaliczka PIT", ppk: "PPK", net: "Na rękę", cost: "Koszt pracodawcy", note: "Uwagi" },
  monthNames: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
  notes: { cap: "limit 30-krotności ZUS", bracket: "wyższy próg podatku", youth: "koniec ulgi dla młodych" },
  copySummary: "Kopiuj podsumowanie",
  copied: "Skopiowano",
  copyEmployment: "Etat {gross} brutto: na rękę średnio {month} miesięcznie, {year} rocznie.",
  copyB2b: "B2B {invoice} netto ({options}): na rękę średnio {month} miesięcznie, {year} rocznie.",
  errors: { amount: "Wpisz kwotę, na przykład 15 000.", days: "Wpisz liczbę dni od 0 do {max}." },
  disclaimer: "Wynik to szacunek w celach informacyjnych, a nie porada podatkowa. Przed decyzją sprawdź swoją sytuację z księgowym.",
  privacyNote: "Liczy się w Twojej przeglądarce. Nic nie wysyłamy.",
  money: "{amount} zł",
  decimalSeparator: ",",
  defaultGross: "15 000",
  defaultInvoice: "18 000",
};
