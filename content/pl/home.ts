import { localizePath } from "@/lib/i18n/routes";
import type { HomeContent } from "../types";

export const homeContent: HomeContent = {
  seo: {
    title: "Opero, platforma BPM no-code dla procesów firmy",
    description:
      "Koda Soft tworzy Opero: platformę BPM no-code do procesów, automatyzacji, kontroli danych i praktycznego wykorzystania AI.",
  },
  hero: {
    eyebrow: "BPM no-code od Koda Soft",
    title: "Zamień swój sposób działania w oprogramowanie",
    description:
      "Tworzymy Opero: platformę BPM no-code, która pozwala modelować własne procesy, automatyzować przepływy pracy, porządkować dane i używać AI tam, gdzie faktycznie toczy się praca.",
    primaryCta: "Umów demo",
    secondaryCta: "Poznaj Opero",
    supportPoints: [
      "Własne rekordy, formularze i przepływy pracy.",
      "Reguły automatyzacji z praktycznym wsparciem AI.",
      "Uprawnienia, audyt i wyszukiwanie dla kontroli operacyjnej.",
    ],
    visual: {
      questions: ["Jak wyglądają procesy?", "Kto za co odpowiada?", "W jakiej kolejności?", "Co warto zautomatyzować?"],
      steps: [
        {
          label: "01",
          title: "Opowiadasz nam, jak działa firma",
          description: "Procesy, role, rekordy, przekazania zadań, wyjątki.",
        },
        {
          label: "02",
          title: "Opero układa model operacyjny",
          description: "Dane, przepływy pracy, uprawnienia, reguły, wsparcie AI.",
        },
        {
          label: "03",
          title: "Otrzymujesz system dopasowany do pracy",
          description: "Oprogramowanie szyte na miarę, które zespół może używać i rozwijać.",
        },
      ],
      magicLabel: "Mapowanie Opero",
      mappingItems: ["Model danych", "Logika procesu", "Reguły dostępu", "Automatyzacja"],
      outcomeItems: ["Dopasowany panel pracy", "Jasna odpowiedzialność", "Proces pod kontrolą", "System, który się rozwija"],
    },
    assistantDemo: {
      buttonLabel: "Otwórz asystenta Opero",
      popupTitle: "Asystent Opero",
      typingLabel: "Pisze",
      scenarios: [
        {
          label: "Wynik sprzedaży",
          dashboardTitle: "Operacje sprzedaży",
          dashboardMetric: "45 sprzedaży",
          dashboardDetail: "Wynik top 3 w zespole",
          messages: [
            {
              speaker: "assistant",
              text: "Cześć, jak mogę pomóc?",
            },
            {
              speaker: "user",
              text: "Ile sprzedaży zrobił Jacek w zeszłym miesiącu i jak wypada na tle reszty zespołu?",
            },
            {
              speaker: "assistant",
              text: "Jacek zrobił 45 sprzedaży w zeszłym miesiącu, co daje mu miejsce w top 3 pracowników.",
            },
          ],
        },
        {
          label: "Nowy moduł",
          dashboardTitle: "Goście w oddziałach",
          dashboardMetric: "Goście",
          dashboardDetail: "Projekt nowego modułu",
          messages: [
            {
              speaker: "user",
              text: "Potrzebuję sposobu na prowadzenie listy gości we wszystkich naszych oddziałach.",
            },
            {
              speaker: "assistant",
              text: "Jasne. Utworzyłem moduł Goście z polami: imię, nazwisko i podpis. Dodać coś jeszcze?",
            },
            {
              speaker: "user",
              text: "Tak, dodaj powód wizyty.",
            },
            {
              speaker: "assistant",
              text: "Gotowe. Pole powód wizyty zostało dodane.",
            },
          ],
        },
        {
          label: "Poranny raport",
          dashboardTitle: "Urządzenia serwisowe",
          dashboardMetric: "Raport dzienny",
          dashboardDetail: "Reguła mailowa aktywna",
          messages: [
            {
              speaker: "user",
              text: "Chcę dostawać codziennie rano na maila raport urządzeń gotowych do naprawy.",
            },
            {
              speaker: "assistant",
              text: "Jasne. Ustawiłem raport i regułę, która będzie wysyłać go do Ciebie każdego ranka.",
            },
          ],
        },
      ],
    },
  },
  problem: {
    label: "Problem",
    title: "Firmy nie działają według sztywnych szablonów.",
    description:
      "Gdy system nie nadąża za realną pracą, zespoły budują obejścia: arkusze, ręczne akceptacje, rozproszone narzędzia, zdublowane rekordy i przekazania zadań, których nie widać w procesie.",
    points: [
      "Procesy zmieniają się szybciej niż standardowe konfiguracje ERP.",
      "Kluczowe rekordy są rozproszone po arkuszach i osobnych narzędziach.",
      "Ręczne przekazania spowalniają pracę i utrudniają audyt.",
      "AI często działa poza procesem, bez realnego kontekstu operacyjnego.",
    ],
  },
  solution: {
    label: "Rozwiązanie",
    title: "Opero dopasowuje się do sposobu pracy firmy.",
    description:
      "Opero daje podstawę low-code dla danych, procesów, reguł, ról, wyszukiwania i działań wspieranych przez AI. Pomaga przełożyć realną pracę na uporządkowane, kontrolowane oprogramowanie.",
    points: [
      "Modeluj własne procesy przez obiekty, pola, relacje i formularze.",
      "Automatyzuj zmiany rekordów, powiadomienia, kontrole i kroki procesu.",
      "Zarządzaj dostępem przez role, uprawnienia, izolację organizacji i logi audytowe.",
      "Włączaj AI do zapytań, skryptów i reguł tam, gdzie liczy się kontekst.",
    ],
  },
  pillars: {
    label: "Możliwości Opero",
    title: "Fundament no-code dla procesów, które się zmieniają.",
    description:
      "Opero działa jak warstwa operacyjna firmy: modele danych, automatyzacja, uprawnienia, wyszukiwanie i wsparcie AI pozostają połączone, zamiast tworzyć kolejne odseparowane narzędzia.",
    items: [
      {
        title: "Modeluj operacje",
        description:
          "Twórz rekordy, pola, formularze, relacje i moduły dopasowane do tego, jak naprawdę pracuje firma.",
        capabilities: [
          "Własne moduły i obiekty",
          "Dynamiczne pola i relacje",
          "Konfigurowalne formularze",
          "Rekordy kontrahentów",
        ],
      },
      {
        title: "Automatyzuj przepływy",
        description:
          "Buduj reguły reagujące na zdarzenia, harmonogramy, ręczne akcje i zmiany w rekordach.",
        capabilities: [
          "Wyzwalacze i kroki reguł",
          "Powiadomienia i webhooki",
          "Aktualizacje rekordów",
          "Historia wykonań",
        ],
      },
      {
        title: "Dodawaj AI w kontekście pracy",
        description:
          "Wykorzystuj AI do zapytań, skryptów, podsumowań i wsparcia decyzji tam, gdzie dostępny jest kontekst operacyjny.",
        capabilities: [
          "Zapytania wspierane przez AI",
          "Planowanie skryptów",
          "Kroki reguł AI",
          "Konfigurowalni dostawcy LLM",
        ],
      },
      {
        title: "Zachowaj kontrolę",
        description:
          "Utrzymuj dane operacyjne w porządku: z wyszukiwaniem, audytem oraz dostępem ograniczonym rolami i organizacją.",
        capabilities: [
          "Role i uprawnienia",
          "Logi audytowe",
          "Izolacja organizacji",
          "Tokeny API i wyszukiwanie",
        ],
      },
    ],
  },
  workflow: {
    label: "Jak to działa",
    title: "Od chaotycznych operacji do uporządkowanego systemu.",
    description:
      "Koda Soft traktuje Opero jak solidną warstwę produktową: najpierw porządkujemy obraz pracy firmy, a potem przekładamy go na stabilne procesy.",
    steps: [
      {
        label: "01",
        title: "Rozpoznaj",
        description:
          "Nazwij rekordy, procesy, role, akceptacje i przekazania zadań, które faktycznie prowadzą firmę.",
      },
      {
        label: "02",
        title: "Zamodeluj",
        description:
          "Przełóż je na konfigurowalne struktury danych, formularze, relacje i ekrany operacyjne.",
      },
      {
        label: "03",
        title: "Automatyzuj",
        description:
          "Dodaj reguły, powiadomienia, aktualizacje rekordów, harmonogramy, skrypty, webhooki i AI.",
      },
      {
        label: "04",
        title: "Kontroluj",
        description:
          "Zarządzaj dostępem, utrzymuj audytowalność i pokazuj operacje przez listy oraz wyszukiwanie.",
      },
      {
        label: "05",
        title: "Doskonal",
        description:
          "Dostosowuj system do zmian w firmie, zamiast budować kolejne rozwiązanie od zera.",
      },
    ],
  },
  ai: {
    label: "Praktyczne AI",
    title: "AI powinno pracować w procesie, nie obok niego.",
    description:
      "Opero wykorzystuje AI tam, gdzie istnieje kontekst operacyjny: w zapytaniach, regułach, skryptach, rekordach i decyzjach. Dzięki temu wsparcie pozostaje powiązane z danymi, uprawnieniami i przebiegiem pracy.",
    points: [
      "Tworzenie zapisanego zapytania na podstawie pytania biznesowego.",
      "Generowanie lub planowanie skryptu dla wartości obliczanych.",
      "Streszczanie kontekstu rekordu wewnątrz procesu.",
      "Klasyfikowanie lub przekształcanie danych podczas wykonania reguły.",
      "Wspieranie decyzji tak/nie kontrolowanym promptem.",
    ],
    chat: {
      assistantPrompt: "Jak mogę pomóc?",
      userRequest: "Potrzebuję raportu 5 najlepiej sprzedających się produktów z ostatniego tygodnia.",
      assistantReply: "Jasne. Oto raport przygotowany na podstawie rekordów sprzedaży.",
      reportTitle: "Najlepsze produkty - ostatni tydzień",
      statusLabel: "gotowe",
      scopeLabel: "kontrolowane",
      footer: "Wsparcie pozostaje powiązane z rekordami, regułami, uprawnieniami i kolejnym krokiem procesu.",
      inputPlaceholder: "Zapytaj o rekordy, raporty, reguły...",
      sendLabel: "Wyślij",
      tableHeaders: ["Produkt", "Szt.", "Przychód"],
      tableRows: [
        ["Zestaw hydrauliczny A", "184", "42,8 tys."],
        ["Pakiet serwisowy Pro", "139", "31,4 tys."],
        ["Moduł sterujący X2", "112", "28,1 tys."],
        ["Pakiet czujników", "96", "19,6 tys."],
        ["Rama montażowa", "81", "17,9 tys."],
      ],
    },
  },
  useCases: {
    label: "Gdzie pasuje",
    title: "Dla operacji, które wyrosły z gotowych systemów.",
    description:
      "Opero wychodzi od realnego sposobu pracy w firmie, a potem daje Koda Soft trwałą podstawę do konfiguracji, automatyzacji i dalszego rozwoju.",
    items: [
      {
        title: "Obsługa kontrahentów i partnerów",
        description:
          "Zarządzaj podmiotami zewnętrznymi przez rekordy, kontakty, adresy, dokumenty, statusy, własne pola i powiązane procesy.",
      },
      {
        title: "Własne rekordy operacyjne",
        description:
          "Buduj obiekty i formularze dopasowane do firmy, gdy standardowe moduły ERP nie odpowiadają procesowi.",
      },
      {
        title: "Akceptacje i procesy wewnętrzne",
        description:
          "Automatyzuj przekazania zadań, powiadomienia, aktualizacje rekordów, cykliczne kontrole i punkty decyzyjne.",
      },
      {
        title: "Wyszukiwanie i widoczność operacji",
        description:
          "Odnajduj dane biznesowe w rekordach, modułach, kontrahentach, słownikach i własnych polach.",
      },
    ],
  },
  trust: {
    label: "Tworzone przez Koda Soft",
    title: "Doświadczenie software house’u, wykonanie na poziomie produktu.",
    description:
      "Koda Soft buduje Opero z dyscypliną inżynieryjną: w oparciu o elastyczną architekturę, utrzymywalne systemy, kontrolowane uprawnienia, sprawdzalną automatyzację i świadome podejście do wydajności.",
    points: [
      "Architektura dla konfigurowalnych operacji.",
      "Kontrola oparta na uprawnieniach, rolach i logach audytowych.",
      "Sprawdzalna automatyzacja z historią wykonań.",
      "Myślenie produktowe wsparte solidną inżynierią.",
    ],
  },
  finalCta: {
    eyebrow: "Zacznij od procesu",
    title: "Buduj oprogramowanie wokół tego, jak firma naprawdę pracuje.",
    description:
      "Zobacz, jak Koda Soft i Opero pomagają zamienić operacje w elastyczne, kontrolowane oprogramowanie biznesowe wspierane praktycznym AI.",
    primaryCta: "Umów demo",
    secondaryCta: "Poznaj Opero",
  },
};

export const homeCtas = {
  primary: localizePath("pl", "contact"),
  secondary: localizePath("pl", "opero"),
};
