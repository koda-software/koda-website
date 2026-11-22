import type { WorkingTimeLabels, WorkingTimePageContent } from "@/content/types";
import { workingTimeYears } from "@/lib/tools/working-time";

const [firstYear, secondYear] = workingTimeYears;

const months = ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"];

export const workingTimePage: WorkingTimePageContent = {
  seo: {
    title: `Wymiar czasu pracy ${firstYear} i ${secondYear}`,
    description: `Wymiar czasu pracy ${firstYear} i ${secondYear} po miesiącach: godziny, dni pracy i święta. Policz wymiar dla okresu rozliczeniowego, części etatu i 7 h 35 min.`,
  },
  navLabel: "Wymiar czasu pracy",
  navDescription: "Godziny i dni pracy w miesiącu i okresie rozliczeniowym, z kalendarzem świąt.",
  hero: {
    title: "Wymiar czasu pracy i dni robocze",
    description:
      "Sprawdź, ile godzin i dni pracy przypada w miesiącu, w kwartale albo w dowolnym okresie rozliczeniowym. Policzysz też wymiar dla części etatu, normę 7 h 35 min i dni robocze między dwiema datami.",
  },
  explainer: {
    title: "Jak liczy się wymiar czasu pracy",
    paragraphs: [
      "Wymiar czasu pracy to liczba godzin, które pracownik ma przepracować w okresie rozliczeniowym. Według art. 130 Kodeksu pracy mnożysz 40 godzin przez liczbę pełnych tygodni okresu i dodajesz po 8 godzin za każdy pozostały dzień od poniedziałku do piątku. W praktyce daje to 8 godzin za każdy dzień od poniedziałku do piątku.",
      "Każde święto, które nie wypada w niedzielę, obniża wymiar o 8 godzin. Dotyczy to także świąt w sobotę: wtedy pracodawca musi wyznaczyć pracownikowi inny dzień wolny w tym samym okresie rozliczeniowym. W 2026 roku są to 15 sierpnia i 26 grudnia, a w 2027 roku 1 maja i 25 grudnia.",
      "Dlatego w tym samym miesiącu są dwie liczby dni. Dni robocze to dni od poniedziałku do piątku bez świąt. Dni pracy w wymiarze są mniejsze o każde święto w sobotę. W sierpniu 2026 roku jest 21 dni roboczych, ale wymiar to 20 dni, czyli 160 godzin.",
      "Przy niepełnym etacie wymiar mnoży się przez ułamek etatu: pół etatu w sierpniu 2026 roku to 80 godzin. Pracowników podmiotów leczniczych obowiązuje norma 7 godzin 35 minut na dobę, a osoby ze znacznym lub umiarkowanym stopniem niepełnosprawności 7 godzin, więc wymiar liczy się od tych norm. Wynik to wymiar nominalny: urlop, zwolnienie lekarskie i inne usprawiedliwione nieobecności obniżają go o godziny zaplanowane w grafiku na te dni.",
    ],
    table: {
      caption: "Co zmienia wymiar czasu pracy",
      columns: ["Sytuacja", "Wpływ na wymiar", "Przepis"],
      rows: [
        ["Święto od poniedziałku do piątku", "−8 godzin", "art. 130 § 2 Kodeksu pracy"],
        ["Święto w sobotę", "−8 godzin i inny dzień wolny w okresie rozliczeniowym", "art. 130 § 2 Kodeksu pracy"],
        ["Święto w niedzielę", "bez zmian", "art. 130 § 2 Kodeksu pracy"],
        ["Niepełny etat", "wymiar × ułamek etatu", "umowa o pracę, art. 130 Kodeksu pracy"],
        ["Podmiot leczniczy", "7 h 35 min za każdy dzień pracy", "art. 93 ust. 1 ustawy o działalności leczniczej"],
        ["Znaczny lub umiarkowany stopień niepełnosprawności", "7 h za każdy dzień pracy", "art. 15 ust. 2 ustawy o rehabilitacji"],
        ["Urlop, L4, inna usprawiedliwiona nieobecność", "− godziny z grafiku na te dni", "art. 130 § 3 Kodeksu pracy"],
      ],
    },
  },
  years: {
    title: "Wymiar czasu pracy {year}",
    anchor: "rok-{year}",
    intro: "W {year} roku wymiar czasu pracy na pełny etat to {hours}, czyli {days}.",
    businessNone: "Dni roboczych od poniedziałku do piątku bez świąt jest tyle samo, bo żadne święto nie wypada w sobotę.",
    businessOne: "Dni roboczych od poniedziałku do piątku bez świąt jest {businessDays}, bo {saturdays} wypada w sobotę.",
    businessMany: "Dni roboczych od poniedziałku do piątku bez świąt jest {businessDays}, bo {saturdays} wypadają w sobotę.",
    hours: { one: "{n} godzina", few: "{n} godziny", many: "{n} godzin", other: "{n} godziny" },
    days: { one: "{n} dzień pracy", other: "{n} dni pracy" },
    months,
    columns: ["Miesiąc", "Godziny", "Dni pracy", "Dni robocze pn.–pt.", "Dni wolne", "Święta obniżające wymiar"],
    caption: "Wymiar czasu pracy na pełny etat w {year} roku, po miesiącach",
    totalLabel: "Cały rok",
    totals: "Kwartały: {quarters} h. Okresy 4-miesięczne: {thirds} h. Półrocza: {halves} h.",
    variants: "Pół etatu: {half}. 3/4 etatu: {threeQuarters}. Norma 7 h 35 min: {healthcare}.",
    holidaysTitle: "Dni wolne od pracy w {year} roku",
    saturdayNote: "należy się inny dzień wolny",
    sundayNote: "nie obniża wymiaru",
    and: " i ",
  },
  sources: {
    title: "Podstawa prawna",
    updatedLabel: "Zasady aktualne na:",
    updatedAt: "2026-11-16",
    note: "Kalkulator ma charakter informacyjny. Liczy wymiar nominalny dla pracownika zatrudnionego od poniedziałku do piątku, przed odjęciem urlopów i innych nieobecności.",
    items: [
      {
        label: "Kodeks pracy, tekst jedn. Dz.U. 2026 poz. 1245: art. 128, 129, 130, 151, 151¹, 151⁸, 154 i 154²",
        href: "https://api.sejm.gov.pl/eli/acts/DU/2026/1245/text.pdf",
      },
      { label: "Ustawa o dniach wolnych od pracy, tekst jedn. Dz.U. 2025 poz. 296", href: "https://api.sejm.gov.pl/eli/acts/DU/2025/296/text.pdf" },
      {
        label: "Ustawa z 6 grudnia 2024 r. o zmianie ustawy o dniach wolnych od pracy (Wigilia), Dz.U. 2024 poz. 1965",
        href: "https://api.sejm.gov.pl/eli/acts/DU/2024/1965/text.pdf",
      },
      { label: "Ustawa o działalności leczniczej, tekst jedn. Dz.U. 2026 poz. 156: art. 93", href: "https://api.sejm.gov.pl/eli/acts/DU/2026/156/text.pdf" },
      {
        label: "Ustawa o rehabilitacji zawodowej i społecznej oraz zatrudnianiu osób niepełnosprawnych, tekst jedn. Dz.U. 2026 poz. 884: art. 15",
        href: "https://api.sejm.gov.pl/eli/acts/DU/2026/884/text.pdf",
      },
      { label: "Wyrok Trybunału Konstytucyjnego z 2 października 2012 r., K 27/11 (święto w sobotę), Dz.U. 2012 poz. 1110" },
    ],
  },
  faq: {
    title: "Częste pytania",
    items: [
      {
        question: "Ile wynosi wymiar czasu pracy w 2027 roku?",
        answer:
          "Na pełny etat 2008 godzin, czyli 251 dni pracy po 8 godzin. Najkrótszy jest maj (144 godziny), bo 1 maja wypada w sobotę, a 3 maja i Boże Ciało w dni robocze. Najdłuższe są marzec, kwiecień i miesiące od czerwca do września, po 176 godzin.",
      },
      {
        question: "Ile dni roboczych jest w 2027 roku?",
        answer:
          "Od poniedziałku do piątku bez świąt jest 253 dni. Wymiar czasu pracy to jednak 251 dni, bo dwa święta, 1 maja i 25 grudnia, wypadają w sobotę i każde obniża wymiar o 8 godzin. Obie liczby są poprawne, ale służą do czego innego.",
      },
      {
        question: "Komu należy się dzień wolny za święto w sobotę?",
        answer:
          "Pracownikowi, któremu święto w sobotę obniża wymiar czasu pracy. Pracodawca wyznacza ten dzień w tym samym okresie rozliczeniowym, przed świętem albo po nim. Przy okresie jednomiesięcznym wolne za 15 sierpnia 2026 roku musi przypaść w sierpniu, a za 26 grudnia w grudniu. To nie jest urlop wypoczynkowy. Przy niepełnym etacie wymiar spada proporcjonalnie, a to, czy trzeba wyznaczyć osobny dzień wolny, zwykle zależy od rozkładu czasu pracy.",
      },
      {
        question: "Czy 24 grudnia to dzień wolny od pracy?",
        answer: "Tak, od 2025 roku Wigilia jest ustawowo wolna. W 2026 roku wypada w czwartek, a w 2027 roku w piątek, więc obniża wymiar o 8 godzin.",
      },
      {
        question: "Jak policzyć wymiar czasu pracy dla pół etatu albo 3/4 etatu?",
        answer:
          "Pomnóż wymiar pełnego etatu przez ułamek etatu. W 2026 roku pół etatu to 1004 godziny, a 3/4 etatu 1506 godzin. Gdy wynik nie jest pełną godziną, na przykład 53 godziny 20 minut dla 1/3 etatu w styczniu 2026 roku, kalkulator pokazuje go dokładnie. Przepisy nie mówią, jak go zaokrąglać.",
      },
      {
        question: "Jaki jest wymiar czasu pracy przy normie 7 godzin 35 minut?",
        answer:
          "W podmiotach leczniczych liczysz 7 godzin 35 minut za każdy dzień pracy w wymiarze. W 2026 i 2027 roku daje to 1903 godziny 25 minut. W sierpniu 2026 roku to 151 godzin 40 minut. Pracowników technicznych, obsługi i gospodarczych obowiązuje norma 8 godzin. Że święto obniża wymiar o 7 godzin 35 minut, a nie o 8 godzin, wynika z praktyki, nie z osobnego przepisu.",
      },
      {
        question: "Jaki okres rozliczeniowy może mieć pracodawca?",
        answer:
          "Zwykle do 4 miesięcy. Z przyczyn obiektywnych, technicznych lub organizacyjnych można go wydłużyć do 12 miesięcy. W systemie równoważnym okres to co do zasady 1 miesiąc, a w podmiotach leczniczych najwyżej 3 miesiące. Wymiar dłuższego okresu to suma wymiarów jego miesięcy.",
      },
      {
        question: "Czy system równoważny zmienia wymiar czasu pracy?",
        answer:
          "Nie. W systemie równoważnym pracownik może pracować do 12 godzin na dobę, ale wymiar w okresie rozliczeniowym liczy się tak samo, z art. 130 Kodeksu pracy. Zmienia się tylko rozkład godzin w grafiku.",
      },
      {
        question: "Ile godzin to jeden dzień urlopu?",
        answer:
          "8 godzin na pełnym etacie albo tyle, ile wynosi dobowa norma pracownika. Urlop udziela się w godzinach, które pracownik miał przepracować w danym dniu według grafiku. Przy niepełnym etacie wymiar urlopu w dniach liczy się proporcjonalnie i zaokrągla w górę do pełnego dnia.",
      },
      {
        question: "Czy dzień wolny dla urzędników obowiązuje w mojej firmie?",
        answer:
          "Nie. Dni wolne wyznaczone dla administracji rządowej, według doniesień prasowych 14 sierpnia i 28 grudnia 2026 roku, dotyczą tylko jej pracowników. W firmie dzień wolny za święto w sobotę wyznacza pracodawca.",
      },
    ],
  },
  opero: {
    title: "Wnioski urlopowe liczone w dniach roboczych",
    body: "W Opero wniosek urlopowy może sam policzyć dni robocze według kalendarza firmy, z pominięciem świąt, sprawdzić pulę urlopu i przekazać wniosek do akceptacji kierownika.",
    primaryCta: "Umów demo",
    secondaryCta: "Automatyzacje w Opero",
    points: [
      { title: "Akceptacja kierownika", body: "Wniosek trafia do kierownika, a odrzucenie wymaga komentarza, więc powód zostaje w historii." },
      { title: "Kto jest nieobecny, od razu", body: "Widok kalendarza pokazuje urlopy według zespołów i można go zasubskrybować w dowolnym kalendarzu." },
      { title: "Przypomnienia przed terminami", body: "Reguła datowa przypomina kadrom o kończących się badaniach lekarskich i umowach." },
    ],
  },
  otherToolsTitle: "Inne narzędzia",
};

export const workingTimeLabels: WorkingTimeLabels = {
  modeLabel: "Co liczysz",
  modes: { period: "Okres rozliczeniowy", range: "Między datami" },
  yearLabel: "Rok",
  startMonthLabel: "Od miesiąca",
  lengthLabel: "Długość okresu",
  lengthOption: "{n} mies.",
  fromLabel: "Od",
  toLabel: "Do (włącznie)",
  fractionLabel: "Wymiar etatu",
  fullTimeOption: "Pełny etat",
  otherFraction: "Inny…",
  customFractionLabel: "Ułamek etatu",
  customFractionPlaceholder: "np. 5/8",
  dailyNormLabel: "Dobowa norma",
  dailyNormOptions: {
    standard: "8 h (Kodeks pracy)",
    healthcare: "7 h 35 min – podmiot leczniczy",
    disability: "7 h – niepełnosprawność",
  },
  normDays: { one: "{n} dzień pracy", other: "{n} dni pracy" },
  fullTimeNorm: "pełny etat: {hours}",
  rows: {
    businessDays: "Dni robocze (pon.–pt. bez świąt)",
    daysOff: "Dni wolne w okresie",
    calendarDays: "Dni kalendarzowe",
    period: "Okres",
  },
  gapOne: "Dni pracy w wymiarze jest mniej niż dni roboczych, bo {dates} wypada w sobotę. Za takie święto pracodawca wyznacza inny dzień wolny w tym samym okresie rozliczeniowym.",
  gapMany: "Dni pracy w wymiarze jest mniej niż dni roboczych, bo {dates} wypadają w sobotę. Za każde z tych świąt pracodawca wyznacza inny dzień wolny w tym samym okresie rozliczeniowym.",
  gapPartTime: "Przy niepełnym etacie to, czy trzeba wyznaczyć osobny dzień wolny, zależy od rozkładu czasu pracy.",
  holidaysTitle: "Święta w tym okresie",
  noHolidays: "W tym okresie nie ma świąt.",
  holidayLine: "{date}, {weekday} – {name} · {effect}",
  effects: {
    lowers: "obniża wymiar o {hours}",
    saturday: "obniża wymiar o {hours}, należy się inny dzień wolny",
    saturdayPartTime: "obniża wymiar o {hours}, dzień wolny zależy od rozkładu",
    sunday: "nie obniża wymiaru",
  },
  breakdownCaption: "Wymiar w kolejnych miesiącach okresu",
  breakdownColumns: { month: "Miesiąc", norm: "Wymiar", normDays: "Dni pracy", businessDays: "Dni robocze" },
  nominalNote: "Wymiar nominalny, przed odjęciem urlopów i innych nieobecności.",
  roundingNote: "Wymiar dla tego ułamka etatu nie jest pełną minutą, więc zaokrąglamy go do pełnej minuty.",
  futureNote: "Liczone według obecnych przepisów o dniach wolnych od pracy.",
  longRangeNote: "Wymiar czasu pracy dotyczy okresu rozliczeniowego, a ten trwa najwyżej 12 miesięcy. Dla dłuższego zakresu traktuj wynik jako sumę dni.",
  and: " i ",
  copy: "Skopiuj wynik",
  copied: "Skopiowano",
  privacyNote: "Liczy się w Twojej przeglądarce. Nic nie wysyłamy.",
  errors: {
    fraction: "Podaj ułamek etatu, np. 3/4.",
    dates: "Podaj obie daty.",
    range: "Zakres może mieć najwyżej 10 lat.",
  },
  summary: {
    months,
    monthsIn: ["w styczniu", "w lutym", "w marcu", "w kwietniu", "w maju", "w czerwcu", "w lipcu", "w sierpniu", "we wrześniu", "w październiku", "w listopadzie", "w grudniu"],
    fullTime: "pełny etat",
    partTime: "{fraction} etatu",
    dailyNorms: { standard: "", healthcare: ", norma 7 h 35 min", disability: ", norma 7 h" },
    normDays: { one: "{n} dzień pracy", other: "{n} dni pracy" },
    businessDays: { one: "{n} dzień roboczy", few: "{n} dni robocze", many: "{n} dni roboczych", other: "{n} dnia roboczego" },
    line: "{period}, {who}: {hours}, {normDays} ({businessDays}).",
    saturdayFullTime: "{date} (sobota) obniża wymiar: wyznacz inny dzień wolny {when}.",
    saturdayReduces: "{date} (sobota) obniża wymiar o {hours}.",
    inPeriod: "w tym okresie rozliczeniowym",
  },
};
