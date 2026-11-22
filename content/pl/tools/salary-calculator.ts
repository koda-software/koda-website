import type { SalaryCalculatorLabels, SalaryCalculatorPageContent } from "@/content/types";

export const salaryCalculatorPage: SalaryCalculatorPageContent = {
  seo: {
    title: "Kalkulator wynagrodzeń brutto netto 2026",
    description:
      "Kalkulator wynagrodzeń 2026: brutto na netto i netto na brutto dla umowy o pracę, zlecenia i o dzieło. Koszt pracodawcy miesiąc po miesiącu.",
  },
  navLabel: "Kalkulator wynagrodzeń",
  navDescription: "Brutto na netto i z powrotem dla etatu, zlecenia i dzieła, z kosztem pracodawcy.",
  hero: {
    title: "Kalkulator wynagrodzeń brutto netto",
    description:
      "Przelicz brutto na netto i netto na brutto na umowie o pracę, umowie zlecenie i umowie o dzieło. Zobaczysz każdą składkę, zaliczkę na podatek, koszt pracodawcy i wypłatę z każdego miesiąca 2026 roku.",
  },
  explainer: {
    title: "Jak liczymy wynagrodzenie w 2026 roku",
    paragraphs: [
      "Na umowie o pracę od pensji brutto odchodzą Twoje składki: emerytalna 9,76%, rentowa 1,5% i chorobowa 2,45%. Od tego, co zostanie, płacisz 9% składki zdrowotnej, której nie odliczysz od podatku. Zaliczka na podatek to 12% dochodu po odjęciu kosztów (250 zł albo 300 zł, gdy dojeżdżasz z innej miejscowości), pomniejszona o 300 zł, jeśli złożysz PIT-2. Gdy dochód od początku roku przekroczy 120 000 zł, zaliczka rośnie do 32%. Gdy zarobki przekroczą 282 600 zł, znikają składki emerytalna i rentowa.",
      "Na umowie zlecenie składki są takie same jak na etacie, ale chorobowa jest dobrowolna. Koszty to 20% przychodu po odjęciu składek, a zaliczka zawsze wynosi 12%, nawet przy wysokich kwotach. Resztę podatku rozliczasz w zeznaniu rocznym. Uczeń lub student przed 26. urodzinami nie płaci składek ani zdrowotnej, a do 85 528 zł rocznie także podatku. Jeśli masz etat u innego pracodawcy i zarabiasz tam co najmniej 4 806 zł brutto, ze zlecenia płacisz tylko składkę zdrowotną. Wbrew temu, co piszą niektóre serwisy, w 2026 roku nie każde zlecenie jest oskładkowane.",
      "Na umowie o dzieło nie ma składek ZUS ani zdrowotnej, chyba że podpisujesz ją z własnym pracodawcą. Koszty wynoszą 20% albo 50%, gdy przenosisz prawa autorskie do utworu, na przykład programu albo tekstu. Zaliczka to 12%. Ulga dla młodych nie obejmuje umowy o dzieło.",
      "Przy umowie zlecenie lub o dzieło na kwotę do 200 zł zamawiający pobiera 12% podatku od całej kwoty, bez kosztów, i nie wykazujesz jej w zeznaniu.",
      "Koszt pracodawcy to brutto plus składki firmy: emerytalna 9,76%, rentowa 6,5%, wypadkowa (zwykle 1,67%), Fundusz Pracy 2,45% (tylko od kwot co najmniej równych płacy minimalnej) i FGŚP 0,1%. Przy 10 000 zł brutto na etacie to 12 048 zł.",
      "Liczymy stałą kwotę co miesiąc przez cały rok i jednego płatnika. W miesiącu, w którym kończy się ulga, dzielimy zaliczkę proporcjonalnie; programy kadrowe robią to różnie, a zeznanie roczne wyrównuje różnicę. Rozważasz B2B? Porównaj w kalkulatorze B2B vs UoP.",
    ],
    table: {
      caption: "Najważniejsze kwoty w 2026 roku",
      columns: ["Co", "Kwota"],
      rows: [
        ["Płaca minimalna / minimalna stawka godzinowa", "4 806 zł / 31,40 zł"],
        ["Składki pracownika (emerytalna, rentowa, chorobowa)", "9,76% + 1,5% + 2,45% = 13,71%"],
        ["Składka zdrowotna", "9% od brutto minus składki, bez odliczenia od podatku"],
        ["Koszty uzyskania przychodu: etat / zlecenie i dzieło", "250 zł lub 300 zł / 20% lub 50%"],
        ["Limit kosztów 50%", "120 000 zł rocznie"],
        ["Próg podatkowy, kwota zmniejszająca", "120 000 zł, 300 zł miesięcznie z PIT-2"],
        ["Limit 30-krotności", "282 600 zł (2027: 300 990 zł)"],
        ["Zerowy PIT (do 26 lat, powrót, 4+, senior)", "85 528 zł przychodu rocznie, łącznie"],
        ["Umowy do 200 zł", "12% ryczałtu od całej kwoty"],
      ],
    },
  },
  examples: {
    title: "Ile to netto: popularne kwoty",
    intro: "Kwota na rękę w pierwszym miesiącu 2026 roku na każdej z trzech umów i koszt pracodawcy przy umowie o pracę.",
    columns: ["Brutto", "Umowa o pracę", "Zlecenie", "Dzieło", "Koszt pracodawcy (etat)"],
    amounts: [4806, 5000, 6000, 7000, 8000, 10000, 12000, 15000, 20000],
    note: "Założenia: umowa o pracę z kosztami 250 zł i PIT-2; zlecenie jako jedyna praca, z chorobowym, bez PIT-2; dzieło z kosztami 20%, bez PIT-2; bez PPK, składka wypadkowa 1,67%. Swoje ustawienia wpisz w kalkulatorze.",
  },
  sources: {
    title: "Podstawa prawna",
    updatedLabel: "Zasady aktualne na:",
    updatedAt: "2026-11-16",
    note: "Kalkulator ma charakter informacyjny i nie zastępuje porady księgowego ani kadrowego. Liczymy stałą miesięczną kwotę przez cały rok i jednego płatnika. Stawki składki wypadkowej, Funduszu Pracy i FGŚP podajemy za serwisami branżowymi cytującymi ZUS.",
    items: [
      {
        label:
          "Ustawa o podatku dochodowym od osób fizycznych, tekst jedn. Dz.U. 2026 poz. 592: art. 21 ust. 1 pkt 148 i 152–154, ust. 44; art. 22 ust. 2, 9, 9a; art. 27; art. 30 ust. 1 pkt 5a; art. 31b; art. 32; art. 41 ust. 1",
        href: "https://api.sejm.gov.pl/eli/acts/DU/2026/592/text.pdf",
      },
      {
        label: "Ustawa o systemie ubezpieczeń społecznych, tekst jedn. Dz.U. 2026 poz. 199: art. 6 ust. 4, art. 8 ust. 2a, art. 9, art. 11, art. 12, art. 18, art. 22",
        href: "https://api.sejm.gov.pl/eli/acts/DU/2026/199/text.pdf",
      },
      {
        label: "Ustawa o świadczeniach opieki zdrowotnej finansowanych ze środków publicznych, tekst jedn. Dz.U. 2025 poz. 1461: art. 66, art. 79, art. 81, art. 82",
        href: "https://api.sejm.gov.pl/eli/acts/DU/2025/1461/text.pdf",
      },
      {
        label: "Rozporządzenie RM w sprawie minimalnego wynagrodzenia za pracę i minimalnej stawki godzinowej w 2026 r., Dz.U. 2025 poz. 1242",
        href: "https://api.sejm.gov.pl/eli/acts/DU/2025/1242/text.pdf",
      },
      {
        label: "Rozporządzenie RM w sprawie minimalnego wynagrodzenia za pracę i minimalnej stawki godzinowej w 2027 r., Dz.U. 2026 poz. 1213",
        href: "https://api.sejm.gov.pl/eli/acts/DU/2026/1213/text.pdf",
      },
      {
        label: "Obwieszczenie MRPiPS z 3.11.2026 o kwocie ograniczenia rocznej podstawy wymiaru składek w 2027 r., M.P. 2026 poz. 1098",
        href: "https://api.sejm.gov.pl/eli/acts/MP/2026/1098/text.pdf",
      },
    ],
  },
  faq: {
    title: "Częste pytania",
    items: [
      {
        question: "Ile na rękę przy najniższej krajowej w 2026 roku?",
        answer: "Na umowie o pracę z PIT-2 to 3 605,85 zł z 4 806 zł brutto. Pracodawcę kosztuje to 5 790,28 zł miesięcznie.",
      },
      {
        question: "Jak przeliczyć netto na brutto?",
        answer:
          "Wybierz „Netto → brutto” i wpisz kwotę na rękę. Kalkulator znajdzie najniższe brutto, przy którym w pierwszym miesiącu dostaniesz co najmniej tyle. Na przykład 5 000 zł na rękę na etacie to 6 850,14 zł brutto. Podatek zaokrągla się do pełnych złotych, więc nie każda kwota netto wychodzi co do grosza.",
      },
      {
        question: "Czy od umowy zlecenie płaci się ZUS, jeśli mam etat?",
        answer:
          "Jeśli zlecenie masz u innej firmy, a z etatu dostajesz co najmniej płacę minimalną (4 806 zł brutto w 2026 roku), od zlecenia płacisz tylko składkę zdrowotną 9% i podatek. Jeśli zlecenie podpisujesz z własnym pracodawcą, płacisz pełne składki jak od pensji.",
      },
      {
        question: "Umowa zlecenie dla studenta: ile na rękę?",
        answer:
          "Uczeń szkoły ponadpodstawowej lub student do ukończenia 26 lat dostaje całą kwotę brutto: bez składek ZUS, bez zdrowotnej i bez podatku do 85 528 zł przychodu w roku. Od dnia po 26. urodzinach składki są już należne.",
      },
      {
        question: "Czy chorobowe na zleceniu jest obowiązkowe?",
        answer: "Nie, jest dobrowolne, ale bez niego nie dostaniesz zasiłku chorobowego. Kosztuje 2,45% brutto. Przy zleceniu z własnym pracodawcą jest obowiązkowe.",
      },
      {
        question: "Czy na zleceniu mogę złożyć PIT-2?",
        answer:
          "Tak, od 2023 roku. Zleceniodawca pomniejszy wtedy zaliczkę o 300 zł miesięcznie. Jeśli masz też etat i tam złożyłeś PIT-2, nie składaj drugiego na pełne 300 zł. Możesz podzielić kwotę na dwóch albo trzech płatników (1/24 lub 1/36).",
      },
      {
        question: "Kiedy przysługuje 50% kosztów na umowie o dzieło?",
        answer:
          "Gdy tworzysz utwór i przenosisz do niego prawa autorskie, na przykład program komputerowy, grafikę, tekst albo muzykę. Ustawa wymienia rodzaje takiej działalności. W 2026 roku koszty 50% mogą łącznie wynieść najwyżej 120 000 zł. Po przekroczeniu limitu kalkulator nie odlicza już żadnych kosztów.",
      },
      {
        question: "Ile kosztuje pracodawcę pracownik?",
        answer:
          "Przy umowie o pracę około 20,48% więcej niż brutto (bez PPK, przy składce wypadkowej 1,67%). Przy 6 000 zł brutto to 7 228,80 zł. Przy zleceniu poniżej płacy minimalnej nie ma Funduszu Pracy, więc koszt jest niższy. Umowa o dzieło kosztuje tyle, ile brutto.",
      },
      {
        question: "Dlaczego w grudniu dostaję więcej albo mniej?",
        answer:
          "Gdy zarobki od początku roku przekroczą 282 600 zł, nie płacisz już składki emerytalnej i rentowej, więc wypłata rośnie. Gdy dochód przekroczy 120 000 zł, zaliczka rośnie do 32%, więc wypłata spada. Tabela „Miesiąc po miesiącu” pokazuje, kiedy to się dzieje.",
      },
      {
        question: "Mam emeryturę albo kilka zleceń. Jak liczyć?",
        answer:
          "Emeryt na zleceniu płaci składki tak jak osoba bez innej pracy, więc wybierz „Nie mam innej pracy”. Przy kilku zleceniach składki są obowiązkowe z najwcześniejszej umowy, a z kolejnych dobrowolne, gdy łączna podstawa osiąga płacę minimalną. Kalkulator liczy jedną umowę. Jeśli prowadzisz też działalność, składki zależą od podstawy z firmy, czego kalkulator nie modeluje.",
      },
      {
        question: "Czy od 2026 roku każde zlecenie ma pełny ZUS?",
        answer: "Nie. Rząd zapowiada takie zmiany, ale na listopad 2026 roku przepisy o zbiegu tytułów do ubezpieczeń się nie zmieniły.",
      },
      {
        question: "Co się zmieni w 2027 roku?",
        answer:
          "Płaca minimalna wzrośnie do 4 950 zł, a limit 30-krotności do 300 990 zł. Uchwalona ustawa podnosi próg podatkowy do 130 000 zł i wprowadza stawkę 24% od dochodu między 130 000 a 150 000 zł, ale czeka na decyzję Prezydenta. Kalkulator pokaże nową skalę, gdy ustawa zostanie ogłoszona.",
      },
    ],
  },
  opero: {
    title: "Sprawy kadrowe jako procesy",
    body: "Opero nie liczy wypłat. Możesz w nim za to prowadzić to, co dzieje się wokół nich: zatrudnienie z umową generowaną z danych pracownika, wnioski urlopowe z akceptacją kierownika i onboarding krok po kroku.",
    primaryCta: "Umów demo",
    secondaryCta: "Procesy w Opero",
    points: [
      { title: "Umowa z kartoteki pracownika", body: "Po akceptacji zatrudnienia PDF umowy powstaje z danych, które już są w kartotece." },
      { title: "Wnioski urlopowe z akceptacją", body: "Pracownik widzi swoje wnioski, kierownik te czekające na niego, a kadry wszystkie." },
      { title: "Onboarding krok po kroku", body: "Każdy etap onboardingu ma osobę i termin, więc sprzęt i formalności nie umykają." },
    ],
  },
  otherToolsTitle: "Inne narzędzia",
};

export const salaryCalculatorLabels: SalaryCalculatorLabels = {
  contractLegend: "Rodzaj umowy",
  contracts: { employment: "Umowa o pracę", mandate: "Zlecenie", work: "Dzieło", compare: "Porównaj" },
  directionLegend: "Kierunek",
  direction: { grossToNet: "Brutto → netto", netToGross: "Netto → brutto" },
  yearLabel: "Rok",
  scaleBill: "Skala podatku na 2027 rok czeka na decyzję Prezydenta. Liczymy według obecnej skali.",
  grossLabel: "Wynagrodzenie brutto miesięcznie",
  netLabel: "Chcę dostać na rękę (miesięcznie)",
  netToGrossHint: "Szukamy najniższego brutto, przy którym w pierwszym miesiącu dostaniesz co najmniej tyle.",
  kupLegend: "Koszty uzyskania przychodu (etat)",
  kup: { standard: "250 zł", commuter: "300 zł (dojazd z innej miejscowości)" },
  civilKupLegend: "Koszty uzyskania przychodu (zlecenie, dzieło)",
  civilKup: { standard: "20%", author: "50% (prawa autorskie)" },
  statusLabel: "Twoja sytuacja",
  status: {
    only: "Nie mam innej pracy",
    student: "Uczeń lub student do 26 lat",
    secondJob: "Mam etat u innego pracodawcy (co najmniej płaca minimalna)",
    ownEmployer: "Zlecenie u własnego pracodawcy",
  },
  workOwnEmployer: "Umowa z własnym pracodawcą",
  sickness: "Dobrowolne ubezpieczenie chorobowe",
  pit2: "PIT-2 złożony u tego płatnika",
  pit2Hint: "Zwykle składasz PIT-2 u głównego pracodawcy.",
  reliefLabel: "Zerowy PIT",
  reliefs: { none: "Bez ulgi", under26: "Do 26 lat", returnee: "Powrót z zagranicy", family4: "Rodzina 4+", senior: "Pracujący senior" },
  reliefUnavailable: "Ulga obejmuje umowę o pracę i zlecenie, nie dzieło.",
  ppk: "Oszczędzam w PPK (2% + 1,5% od pracodawcy)",
  moreOptions: "Więcej opcji",
  accidentLabel: "Składka wypadkowa pracodawcy (%)",
  accidentHint: "Zwykle 1,67% w firmach do 9 osób. Stawkę firmy znajdziesz w zawiadomieniu z ZUS.",
  situationNotes: {
    student: "Uczeń lub student do 26 lat: bez składek ZUS i zdrowotnej, bez podatku do {limit} przychodu rocznie.",
    secondJob: "Masz etat u innej firmy z co najmniej płacą minimalną: ze zlecenia płacisz tylko składkę zdrowotną i podatek, a zleceniodawca nie płaci składek.",
    ownEmployer:
      "Zlecenie u własnego pracodawcy: pełne składki jak od pensji, chorobowa obowiązkowa. Liczymy samo zlecenie; w praktyce pracodawca łączy je z pensją w jednej podstawie składek.",
    work: "Umowa o dzieło: bez składek ZUS i zdrowotnej, więc pracodawca płaci tylko brutto. Ulga dla młodych jej nie obejmuje.",
    workOwnEmployer: "Dzieło dla własnego pracodawcy liczy się do składek jak praca na etacie: pełne składki, chorobowa obowiązkowa. Liczymy samą umowę.",
    relief: "Bez podatku do {limit} przychodu w roku. Ulgi do 26 lat, na powrót, dla rodzin 4+ i dla seniorów mają jeden wspólny limit.",
  },
  headline: "Na rękę: {amount} miesięcznie",
  headlineAverage: "Kwota zmienia się w ciągu roku. Średnio: {amount} miesięcznie.",
  grossResult: "Brutto: {amount} miesięcznie",
  inexactNet: "Dokładnie {target} nie wychodzi z żadnej kwoty brutto; najbliżej jest {net}.",
  noGross: "Żadna kwota brutto do 1 000 000 zł miesięcznie nie daje tyle na rękę.",
  belowMinimum: "Pełny etat nie może dostać mniej niż {minimum} brutto. Niższa kwota pasuje do części etatu.",
  flatTaxNote: "Umowa do 200 zł: 12% od całej kwoty, bez kosztów. Liczy się kwota z umowy, a my zakładamy jedną umowę w miesiącu.",
  yearlyNote: "Zaliczki na zleceniu i dziele to zawsze 12%. Dochód ponad {threshold} rozliczysz w PIT-37; jeśli to Twój jedyny dochód, dopłacisz około {amount}.",
  employeeTitle: "Pracownik",
  employerTitle: "Pracodawca",
  rows: {
    gross: "Brutto",
    pension: "Emerytalna",
    disability: "Rentowa",
    sickness: "Chorobowa",
    health: "Zdrowotna",
    kup: "Koszty uzyskania",
    taxBase: "Podstawa podatku",
    advance: "Zaliczka PIT",
    flatTax: "Podatek 12% (umowa do 200 zł)",
    ppk: "PPK",
    net: "Na rękę",
    accident: "Wypadkowa",
    labourFund: "Fundusz Pracy",
    fgsp: "FGŚP",
    employerCost: "Koszt pracodawcy",
  },
  how: {
    rateOf: "{rate} od {base}",
    health: "{rate} od {base} (brutto minus Twoje składki)",
    civilKup: "{rate} od {base} (brutto minus Twoje składki)",
    fixedKup: "stała kwota miesięczna",
    taxBase: "{revenue} minus składki {social} i koszty {kup}, w pełnych złotych",
    advance: "{rate} od {base}",
    reduction: " minus {amount} z PIT-2",
    advanceScale: "według skali podatku, od dochodu od początku roku",
    exempt: "zwolnione z podatku do {limit} przychodu w roku",
    flatTax: "{rate} od całej kwoty, bez kosztów",
    capped: "po limicie {cap}",
    noLabourFund: "nie płaci się od kwot poniżej {minimum}",
    net: "brutto minus składki, zdrowotna i podatek",
    employerCost: "brutto plus składki pracodawcy",
    noEmployerContributions: "bez składek pracodawcy",
  },
  monthsTitle: "Miesiąc po miesiącu",
  monthsColumns: { month: "Miesiąc", social: "ZUS", health: "Zdrowotna", advance: "Zaliczka PIT", net: "Na rękę", cost: "Koszt pracodawcy", note: "Uwagi" },
  monthNames: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
  yearRow: "Rok",
  notes: {
    cap: "limit 30-krotności ZUS",
    bracket: "wyższy próg podatku",
    bracketCivil: "dochód ponad próg, dopłata w PIT-37",
    relief: "koniec ulgi",
    authorCap: "limit kosztów 50%",
  },
  compareCaption: "Ta sama kwota brutto na trzech umowach",
  compareRows: { netMonth: "Na rękę w pierwszym miesiącu", netYear: "Na rękę w roku", costMonth: "Koszt pracodawcy miesięcznie", costYear: "Koszt pracodawcy w roku" },
  compareNote:
    "Umowa o pracę liczona z PIT-2, zlecenie jako jedyna praca. Umowy różnią się nie tylko kwotą: na etacie masz płatny urlop, wynagrodzenie chorobowe i okres wypowiedzenia, na zleceniu i dziele nie.",
  compareB2b: { before: "Rozważasz B2B? Porównaj w ", link: "kalkulatorze B2B vs UoP", after: "." },
  copyBreakdown: "Kopiuj rozliczenie",
  copySummary: "Kopiuj podsumowanie",
  copied: "Skopiowano",
  summary: "{contract}, {gross} brutto ({year}): na rękę {net} miesięcznie, koszt pracodawcy {cost}.",
  errors: { amount: "Wpisz kwotę, na przykład 6 000.", accident: "Wpisz stawkę od 0 do 10%, na przykład 1,67." },
  disclaimer: "Wynik to szacunek w celach informacyjnych, a nie porada podatkowa ani kadrowa. Przed decyzją sprawdź swoją sytuację z księgowym.",
  privacyNote: "Liczy się w Twojej przeglądarce. Nic nie wysyłamy.",
  money: "{amount} zł",
  decimalSeparator: ",",
  defaultGross: "6 000",
};
