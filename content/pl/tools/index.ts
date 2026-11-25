import { localizeFeaturePath } from "@/lib/i18n/features";
import { localizePath } from "@/lib/i18n/routes";
import { localizeToolPath, toolKeys, type ToolKey } from "@/lib/i18n/tools";
import type { ToolPageContent, ToolsIndexContent } from "@/content/types";
import { amountInWordsPage } from "./amount-in-words";
import { b2bVsEmploymentPage } from "./b2b-vs-employment";
import { counterpartyPage } from "./counterparty";
import { eDeliveryPage } from "./e-delivery";
import { jpkViewerPage } from "./jpk-viewer";
import { ksefViewerPage } from "./ksef-viewer";
import { lateInterestPage } from "./late-interest";
import { nbpRatePage } from "./nbp-rate";
import { salaryCalculatorPage } from "./salary-calculator";
import { vatCalculatorPage } from "./vat-calculator";
import { whiteListPage } from "./white-list";
import { workingTimePage } from "./working-time";

export const toolsIndexContent: ToolsIndexContent = {
  seo: {
    title: "Darmowe kalkulatory dla firm i księgowości",
    description: "Darmowe narzędzia online dla firm: kalkulator wynagrodzeń, VAT i odsetek, B2B czy UoP, biała lista VAT, kurs NBP, czas pracy, podgląd KSeF i JPK.",
  },
  navLabel: "Narzędzia",
  breadcrumbLabel: "Ścieżka nawigacji",
  hero: {
    title: "Darmowe narzędzia dla firm i księgowości",
    description:
      "Kalkulatory i narzędzia do codziennej pracy z fakturami, VAT, kontrahentami i kadrami. Działają od razu w przeglądarce, bez rejestracji, na danych z oficjalnych źródeł.",
  },
  jumpLabel: "Kategorie narzędzi",
  trust: [
    { title: "Za darmo, bez konta", body: "Nie trzeba się rejestrować ani logować. Otwierasz stronę i liczysz." },
    { title: "Oficjalne źródła", body: "Wykaz podatników VAT, NBP, KRS, CEIDG, VIES i gov.pl, ze źródłami wypisanymi na każdej stronie." },
    { title: "Nic nie zapisujemy", body: "Kalkulatory liczą w Twojej przeglądarce, a pliki KSeF i JPK nie opuszczają Twojego komputera." },
    { title: "Przepisy na 2026 rok", body: "Stawki, składki, progi i święta zgodne z bieżącymi przepisami, z datą ostatniego sprawdzenia." },
  ],
  categories: [
    {
      id: "faktury-i-vat",
      title: "Faktury, VAT i waluty",
      description: "Policz VAT, przelicz kwotę po kursie NBP, zapisz ją słownie i otwórz fakturę z KSeF albo plik JPK bez programu księgowego.",
      tools: ["vatCalculator", "nbpRate", "amountInWords", "ksefViewer", "jpkViewer"],
    },
    {
      id: "kontrahenci-i-platnosci",
      title: "Kontrahenci i płatności",
      description: "Sprawdź firmę i jej rachunek przed przelewem, znajdź adres do e-Doręczeń i policz odsetki od faktury zapłaconej po terminie.",
      tools: ["whiteList", "counterpartyCheck", "lateInterest", "eDelivery"],
    },
    {
      id: "kadry-i-place",
      title: "Kadry i płace",
      description: "Przelicz wynagrodzenie brutto na netto, porównaj etat z B2B i sprawdź wymiar czasu pracy w każdym miesiącu.",
      tools: ["salaryCalculator", "b2bVsEmployment", "workingTime"],
    },
  ],
  cards: {
    vatCalculator: {
      description: "Przelicz netto na brutto i brutto na netto dla każdej stawki VAT. Dla faktury z kilkoma pozycjami policzysz VAT od sumy albo od każdej pozycji.",
      highlights: ["Stawki 23%, 8%, 5% i 0%", "Faktura z pozycjami", "Brutto słownie"],
    },
    nbpRate: {
      description: "Kurs średni NBP z ostatniego dnia roboczego przed datą faktury, z numerem tabeli. Od razu przeliczysz kwotę i VAT na złote.",
      highlights: ["Tabela A z numerem", "Dzień roboczy przed datą", "VAT w złotych"],
    },
    amountInWords: {
      description: "Zamień liczbę na słowa razem z groszami. Kwota jest gotowa do wklejenia na fakturę, umowę albo przelew.",
      highlights: ["Złote, euro, dolary, funty, franki", "Razem z groszami", "Kopiowanie jednym kliknięciem"],
    },
    ksefViewer: {
      description: "Upuść plik XML faktury z KSeF, a zobaczysz ją jako zwykłą fakturę: sprzedawcę, nabywcę, pozycje, VAT i płatność.",
      highlights: ["Czytelna faktura z XML", "Wydruk i zapis do PDF", "Plik zostaje u Ciebie"],
    },
    jpkViewer: {
      description: "Otwórz plik JPK_V7M albo JPK_V7K jako czytelne tabele: deklarację, ewidencję sprzedaży i zakupów oraz wynik kontroli sum.",
      highlights: ["JPK_V7M i JPK_V7K", "Kontrola sum", "Eksport do CSV"],
    },
    whiteList: {
      description: "Wpisz NIP, a zobaczysz status VAT firmy i rachunki z wykazu podatników VAT. Dodaj numer konta, żeby sprawdzić go przed przelewem.",
      highlights: ["Status VAT po NIP", "Weryfikacja rachunku", "Dane z Ministerstwa Finansów"],
    },
    counterpartyCheck: {
      description: "Jeden numer, cztery rejestry. Zobacz, co o firmie mówią KRS, CEIDG, biała lista VAT i VIES, z datą każdego sprawdzenia.",
      highlights: ["NIP, KRS, REGON lub VAT UE", "KRS, CEIDG, VIES", "Wydruk sprawdzenia"],
    },
    lateInterest: {
      description: "Policz odsetki ustawowe za opóźnienie w transakcjach handlowych ze stawką z właściwego półrocza i rekompensatę za koszty odzyskania należności.",
      highlights: ["Odsetki handlowe", "Rekompensata 40, 70 lub 100 euro", "Stawki z każdego półrocza"],
    },
    eDelivery: {
      description: "Znajdź adres do doręczeń elektronicznych urzędu po nazwie i miejscowości albo firmy po NIP, KRS lub REGON.",
      highlights: ["Adres AE:PL", "Urzędy i firmy", "Źródło i data"],
    },
    salaryCalculator: {
      description: "Przelicz brutto na netto i netto na brutto na umowie o pracę, zleceniu i umowie o dzieło. Zobaczysz każdą składkę, podatek i koszt pracodawcy.",
      highlights: ["Etat, zlecenie, dzieło", "Koszt pracodawcy", "Każdy miesiąc 2026"],
    },
    b2bVsEmployment: {
      description: "Porównaj, ile zostaje na rękę na etacie i na B2B. Kalkulator liczy ZUS, składkę zdrowotną i podatek, a także stawkę B2B równą Twojej pensji.",
      highlights: ["Skala, liniowy, ryczałt", "ZUS i składka zdrowotna", "Stawka B2B równa pensji"],
    },
    workingTime: {
      description: "Sprawdź, ile godzin i dni pracy przypada w miesiącu, kwartale albo dowolnym okresie rozliczeniowym, z kalendarzem świąt.",
      highlights: ["Godziny i dni robocze", "Część etatu i 7 h 35 min", "Dni robocze między datami"],
    },
  },
  cardCta: "Otwórz narzędzie",
  faq: {
    title: "Najczęstsze pytania",
    items: [
      {
        question: "Czy narzędzia są naprawdę darmowe?",
        answer: "Tak. Wszystkie narzędzia są bezpłatne, bez limitu użyć, bez rejestracji i bez zakładania konta.",
      },
      {
        question: "Czy zapisujecie dane, które wpisuję?",
        answer: "Nie. Kalkulatory liczą w Twojej przeglądarce, a pliki KSeF i JPK nie są nigdzie wysyłane. Narzędzia, które sprawdzają rejestry, przekazują numer do właściwego rejestru i niczego nie zapisują. Każde narzędzie opisuje to pod formularzem.",
      },
      {
        question: "Skąd pochodzą dane w narzędziach?",
        answer: "Z oficjalnych źródeł: wykazu podatników VAT Ministerstwa Finansów, tabel kursów NBP, KRS, CEIDG, VIES i bazy adresów do e-Doręczeń. Na stronie każdego narzędzia znajdziesz listę źródeł i datę ostatniego sprawdzenia przepisów.",
      },
      {
        question: "Czy wyniki są aktualne na 2026 rok?",
        answer: "Tak. Stawki VAT, składki ZUS, progi podatkowe, odsetki i święta są zgodne z przepisami obowiązującymi w 2026 roku. Wynik kalkulatora ma charakter pomocniczy i nie zastępuje porady księgowej.",
      },
      {
        question: "Czy mogę korzystać z narzędzi na telefonie?",
        answer: "Tak. Wszystkie narzędzia działają w przeglądarce na komputerze, tablecie i telefonie, bez instalowania aplikacji.",
      },
    ],
  },
  opero: {
    title: "Zamiast liczyć ręcznie, zautomatyzuj to w Opero",
    body: "Opero pobiera faktury z KSeF, prowadzi je przez akceptację, pilnuje terminów i generuje dokumenty z danych, które już są w systemie. Te same obliczenia dzieją się wtedy same.",
    primaryCta: "Umów demo",
    secondaryCta: "Poznaj Opero",
  },
};

export const toolPages: Record<ToolKey, ToolPageContent> = {
  vatCalculator: vatCalculatorPage,
  nbpRate: nbpRatePage,
  lateInterest: lateInterestPage,
  b2bVsEmployment: b2bVsEmploymentPage,
  salaryCalculator: salaryCalculatorPage,
  workingTime: workingTimePage,
  amountInWords: amountInWordsPage,
  whiteList: whiteListPage,
  counterpartyCheck: counterpartyPage,
  eDelivery: eDeliveryPage,
  ksefViewer: ksefViewerPage,
  jpkViewer: jpkViewerPage,
};

/** Where each tool's Opero link points: the feature that does the same job inside Opero. */
const toolFeature = {
  vatCalculator: "documents",
  nbpRate: "documents",
  lateInterest: "ai",
  b2bVsEmployment: "processes",
  salaryCalculator: "processes",
  workingTime: "lowCode",
  amountInWords: "documents",
  whiteList: "integrations",
  counterpartyCheck: "integrations",
  eDelivery: "documents",
  ksefViewer: "integrations",
  jpkViewer: "integrations",
} as const satisfies Record<ToolKey, Parameters<typeof localizeFeaturePath>[1]>;

export function toolCtas(tool: ToolKey) {
  return { primary: localizePath("pl", "contact"), secondary: localizeFeaturePath("pl", toolFeature[tool]) };
}

export const toolLinks = toolKeys.map((tool) => ({
  tool,
  href: localizeToolPath("pl", tool),
  label: toolPages[tool].navLabel,
  description: toolPages[tool].navDescription,
}));
