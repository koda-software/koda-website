import type { FeaturePageContent } from "@/content/types";

export const noCodeFeature: FeaturePageContent = {
  seo: {
    title: "Platforma no-code do budowy aplikacji | Opero",
    description:
      "Projektuj dane, ekrany i nawigację w konfiguracji wizualnej. Zbuduj własny system biznesowy bez programisty na platformie no-code Opero.",
  },
  navLabel: "Platforma No-Code",
  hero: {
    eyebrow: "Funkcje systemu",
    title: "No-code - zbuduj własny system bez programisty",
    description:
      "Projektujesz dane, układy i nawigację w konfiguracji wizualnej. Opero zamienia je w działającą aplikację - bez pisania kodu.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Zobacz Opero w akcji",
  },
  intro: {
    eyebrow: "W skrócie",
    paragraph:
      "No-code w Opero to komplet klocków, z których składasz aplikację: obiekty własne i pola opisują dane, formularze i układy budują widoki, menu i strony własne - nawigację, a słowniki i listy własne pilnują spójności.",
  },
  blocks: {
    eyebrow: "Co dostajesz",
    title: "Klocki, z których powstaje aplikacja.",
    items: [
      {
        title: "Obiekty własne i pola",
        description:
          "Definiujesz typy danych i ich właściwości z ponad 20 typów pól (tekst, kwota, data, wybór, powiązanie, plik, wyliczane). Strukturę zmieniasz bezpiecznie w wersji roboczej.",
      },
      {
        title: "Obiekty podrzędne",
        description:
          "Zagnieżdżone tabele w rekordzie (pozycje, etapy, uczestnicy) dla relacji „jeden do wielu”.",
      },
      {
        title: "Formularze i układy",
        description:
          "Sterujesz dostępem do pól i wizualnym rozmieszczeniem sekcji, zakładek i komponentów, z wersjonowaniem.",
      },
      {
        title: "Menu i strony własne",
        description:
          "Układasz nawigację i budujesz dowolne strony (pulpity, instrukcje, panele) poza standardowym schematem obiekt → formularz.",
      },
      {
        title: "Słowniki i listy własne",
        description: "Kontrolowane wartości i lekkie zbiory referencyjne, które trzymają dane w ryzach.",
      },
      {
        title: "Procesy na Twoich danych",
        description: "Do każdego obiektu przypniesz workflow, więc aplikacja od razu obsługuje obiegi.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Następny krok",
    title: "Zbuduj pierwszy obiekt w kilka minut.",
    description: "Pokażemy, jak z pustej instancji powstaje działająca aplikacja - bez ani jednej linijki kodu.",
    primaryCta: "Umów prezentację",
  },
  seoText: {
    eyebrow: "Więcej o funkcji",
    title: "Aplikacja bez kodu, dopasowana do Twojej firmy.",
    paragraphs: [
      "Platforma no-code Opero pozwala zbudować własny system biznesowy bez pisania kodu. Strukturę danych opisujesz obiektami własnymi i polami (ponad 20 typów: tekst, kwota, data, wybór, powiązanie, plik, pole wyliczane), a Opero od razu generuje listy, formularze i interfejs. Zmiany struktury wprowadzasz bezpiecznie w wersji roboczej, zanim trafią na produkcję.",
      "Ekrany składasz z formularzy i układów. Formularz decyduje, które pola i w jakim trybie widzi użytkownik, a układ odpowiada za wizualne rozmieszczenie sekcji i zakładek. Nawigację budujesz z menu i stron własnych, a spójność danych pilnują słowniki i listy własne. To wszystko konfiguracja wizualna, dostępna dla osób bez zaplecza programistycznego.",
      "Aplikacja zbudowana w no-code nie kończy się na tym, co zaprojektujesz na starcie. Do każdego obiektu przypniesz workflow, reguły i raporty, więc system rośnie razem z firmą i obsługuje dokładnie te procesy, których potrzebujesz. To szybsza droga do rozwiązania szytego na miarę niż klasyczne wdrożenie programistyczne.",
    ],
  },
  faq: {
    eyebrow: "Pytania",
    title: "Najczęściej zadawane pytania.",
    items: [
      {
        question: "Czy naprawdę zbuduję aplikację bez programisty?",
        answer:
          "Tak. Obiekty, pola, formularze, układy i menu tworzy się wizualnie, bez kodu. Zaawansowaną logikę można dodać w warstwie low-code, ale nie jest ona wymagana do działającej aplikacji.",
      },
      {
        question: "Czym jest obiekt własny?",
        answer:
          "To definicja danych, którą sam projektujesz, odpowiednik tabeli (np. Klient, Umowa, Zgłoszenie). Opero generuje dla niej ekrany i listy.",
      },
    ],
  },
  related: {
    eyebrow: "Pokrewne funkcje",
    title: "Zobacz też",
    items: ["processes", "lowCode", "reports"],
  },
};
