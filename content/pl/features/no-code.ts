import type { FeaturePageContent } from "@/content/types";

export const noCodeFeature: FeaturePageContent = {
  seo: {
    title: "Platforma no-code - zbuduj własny system w Opero",
    description:
      "Obiekty własne, pola, formularze, układy, menu, strony własne i słowniki. Projektujesz dane i widoki w konfiguracji wizualnej, bez kodu.",
  },
  navLabel: "Platforma No-Code",
  hero: {
    eyebrow: "Funkcje systemu",
    title: "No-code - zbuduj własny system bez programisty",
    description:
      "Projektujesz dane, układy i nawigację w konfiguracji wizualnej. Opero zamienia je w działającą aplikację - bez pisania kodu.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Zobacz Opero w akcji",
    shot: {
      src: "/features/no-code-hero.png",
      width: 1926,
      height: 1082,
      caption: "Formularz zbudowany bez kodu",
      alt: "Formularz „Utwórz kontrahenta” w Opero z polami Akronim, Pełna nazwa, Kraj, Status ryzyka, NIP, REGON i KRS, wygenerowany z konfiguracji obiektu",
    },
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
  shots: {
    eyebrow: "Jak to wygląda",
    title: "Od struktury danych do gotowego widoku.",
    items: [
      {
        src: "/features/no-code-dashboard.webp",
        width: 2000,
        height: 986,
        caption: "Efekt końcowy: działająca aplikacja",
        alt: "Pulpit gotowej aplikacji Opero z modułami Księgowość, Kontrahenci, Serwis, Finansowe, Korespondencja i HR",
      },
    ],
  },
  finalCta: {
    eyebrow: "Następny krok",
    title: "Zbuduj pierwszy obiekt w kilka minut.",
    description: "Pokażemy, jak z pustej instancji powstaje działająca aplikacja - bez ani jednej linijki kodu.",
    primaryCta: "Umów prezentację",
  },
  related: {
    eyebrow: "Pokrewne funkcje",
    title: "Zobacz też",
    items: ["processes", "lowCode", "reports"],
  },
};
