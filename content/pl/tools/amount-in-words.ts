import type { AmountInWordsLabels, AmountInWordsPageContent } from "@/content/types";

export const amountInWordsPage: AmountInWordsPageContent = {
  seo: {
    title: "Kwota słownie - kalkulator online",
    description:
      "Kwota słownie online: wpisz liczbę, a kalkulator zamieni ją na słowa razem z groszami. Złote, euro i dolary, do faktury, umowy i przelewu. Bez rejestracji.",
  },
  navLabel: "Kwota słownie",
  navDescription: "Zamień kwotę na słowa, z groszami, gotową do faktury lub przelewu.",
  hero: {
    title: "Kwota słownie",
    description: "Zamiana liczby na słowa: wpisz kwotę, a dostaniesz ją zapisaną słownie razem z groszami, gotową do wklejenia na fakturę, umowę albo przelew.",
  },
  explainer: {
    title: "Jak zapisać kwotę słownie",
    paragraphs: [
      "Polski liczebnik zmienia formę słowa, które po nim stoi. O formie decydują dwie ostatnie cyfry liczby, nie cała liczba. Dlatego „22 złote”, ale „25 złotych” i „12 złotych”.",
      "Ta sama zasada działa dla tysięcy, milionów i groszy: „jeden grosz”, „dwa grosze”, „pięć groszy”. Złote i grosze łączy spójnik „i”.",
    ],
    table: {
      caption: "Która forma kiedy",
      columns: ["Ostatnie cyfry", "Forma", "Przykład"],
      rows: [
        ["dokładnie 1", "złoty, tysiąc", "jeden złoty"],
        ["2, 3, 4 (bez 12-14)", "złote, tysiące", "trzydzieści cztery złote"],
        ["pozostałe, także 12-14 i 21", "złotych, tysięcy", "dwadzieścia jeden tysięcy złotych"],
      ],
    },
  },
  faq: {
    title: "Częste pytania",
    items: [
      {
        question: "Czy kwota słownie jest obowiązkowa na fakturze?",
        answer:
          "Nie. Ustawa o VAT jej nie wymaga. Wiele firm dalej ją podaje z przyzwyczajenia, a na umowach, wekslach i drukach przelewu bywa potrzebna.",
      },
      {
        question: "„Tysiąc” czy „jeden tysiąc”?",
        answer:
          "Obie formy są w użyciu. „Tysiąc” jest krótsze i poprawne językowo. „Jeden tysiąc” utrudnia dopisanie czegoś przed kwotą, dlatego wybierają je niektóre banki i działy księgowe.",
      },
      {
        question: "Czy wpisana kwota gdzieś trafia?",
        answer: "Nie. Przeliczenie dzieje się w Twojej przeglądarce i nic nie jest wysyłane ani zapisywane.",
      },
    ],
  },
  opero: {
    title: "W Opero kwota słownie wpisuje się sama",
    body: "Szablony dokumentów w Opero same wstawiają kwotę słownie na faktury, wezwania do zapłaty i umowy, z danych, które już są w systemie.",
    primaryCta: "Umów demo",
    secondaryCta: "Dokumenty w Opero",
  },
  examples: {
    title: "Popularne kwoty słownie",
    intro: "Najczęściej sprawdzane kwoty, zapisane tak, jak wpisuje się je na fakturze lub przelewie.",
    columns: ["Kwota", "Słownie"],
    amounts: ["100", "200", "500", "1000", "1500", "2000", "2500", "3000", "5000", "10000", "15000", "100000"],
  },
  otherToolsTitle: "Inne narzędzia",
};

export const amountInWordsLabels: AmountInWordsLabels = {
  amountLabel: "Kwota",
  placeholder: "np. 1 234,56",
  currencyLegend: "Waluta",
  examplesLabel: "Przykłady:",
  examples: ["1 234,56", "21 000", "112,14", "0,99"],
  defaultAmount: "1 234,56",
  resultHeadings: { pl: "Po polsku" },
  copy: "Kopiuj",
  copied: "Skopiowano",
  privacyNote: "Kwota zostaje w Twojej przeglądarce. Nic nie wysyłamy.",
  emptyHint: "Wpisz kwotę powyżej. Wynik pojawi się od razu.",
  errors: {
    decimals: "Podaj najwyżej dwie cyfry po przecinku.",
    invalid: "Wpisz samą kwotę, na przykład 1 234,56.",
    tooLarge: "Największa obsługiwana kwota to 999 999 999 999,99.",
    negative: "Kwota nie może być ujemna.",
  },
  optionsLegend: "Opcje zapisu",
  sayOneLabel: "„jeden tysiąc” zamiast „tysiąc”",
  capitalizeLabel: "Wielka litera na początku",
};
