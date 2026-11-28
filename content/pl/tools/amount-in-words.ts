import type { AmountInWordsLabels, AmountInWordsPageContent } from "@/content/types";

export const amountInWordsPage: AmountInWordsPageContent = {
  seo: {
    title: "Kwota słownie - z groszami 00/100 i po angielsku",
    description:
      "1 234,56 zł słownie: tysiąc dwieście trzydzieści cztery złote 56/100. Wpisz kwotę i skopiuj zapis na fakturę, umowę lub przelew. Też po angielsku, w EUR i USD.",
  },
  navLabel: "Kwota słownie",
  navDescription: "Zamień kwotę na słowa, z groszami, gotową do faktury lub przelewu.",
  hero: {
    title: "Kwota słownie",
    description: "Zamiana liczby na słowa: wpisz kwotę, a dostaniesz ją zapisaną słownie, z groszami słownie albo jako 56/100, po polsku i po angielsku. Gotową do wklejenia na fakturę, umowę albo przelew.",
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
        question: "Grosze słownie czy 56/100?",
        answer:
          "Oba zapisy są poprawne. Na fakturach i w umowach najczęściej spotkasz „56/100”, czyli grosze jako ułamek: „tysiąc dwieście trzydzieści cztery złote 56/100”. Przy pełnej kwocie piszesz „00/100”. Zapis słowny („i pięćdziesiąt sześć groszy”) jest dłuższy, ale nic nie zostaje w cyfrach.",
      },
      {
        question: "Kwota słownie razem czy osobno?",
        answer:
          "Osobno. Każdy liczebnik to osobne słowo: „dwadzieścia jeden”, „trzy tysiące sześćset”. Jednym wyrazem piszesz tylko liczebniki, które same są jednym słowem, jak „jedenaście”, „dwieście” czy „pięćset”.",
      },
      {
        question: "Jak napisać kwotę słownie po angielsku?",
        answer:
          "Narzędzie pokazuje wersję angielską pod polską. Po angielsku łączniki stoją między dziesiątkami a jednościami („thirty-four”), a grosze piszesz słownie po „and” albo jako ułamek: „one thousand two hundred thirty-four zlotys 56/100”.",
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
    points: [
      { title: "Na każdym dokumencie", body: "Faktury, wezwania do zapłaty i umowy biorą kwotę słownie z sumy w rekordzie." },
      { title: "Szablony, które projektujesz", body: "Tekst, tabele, pola podpisu i kody QR, z podglądem PDF przed publikacją." },
      { title: "Generowane przez regułę", body: "Przy zmianie etapu PDF powstaje sam, trafia do rekordu i wychodzi mailem." },
    ],
  },
  examples: {
    title: "Popularne kwoty słownie",
    intro: "Najczęściej sprawdzane kwoty, zapisane tak, jak wpisuje się je na fakturze lub przelewie: z groszami jako 00/100.",
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
  resultHeadings: { pl: "Po polsku", en: "Po angielsku" },
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
  minorLegend: "Grosze:",
  minorStyles: { words: "słownie", fraction: "56/100" },
};
