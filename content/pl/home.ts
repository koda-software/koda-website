import { localizePath } from "@/lib/i18n/routes";
import type { HomeContent } from "../types";

export const homeContent: HomeContent = {
  seo: {
    title: "Platforma BPM low-code do procesów i dokumentów",
    description:
      "Opero to platforma BPM low-code: procesy, elektroniczny obieg dokumentów, automatyzacja, raporty i uprawnienia. Konfiguracja no-code, bez pisania kodu.",
  },
  hero: {
    eyebrow: "BPM low-code od KodaSoft",
    title: "Zamień swój sposób działania w oprogramowanie",
    description:
      "Opero to platforma BPM low-code, w której modelujesz własne procesy, prowadzisz obieg dokumentów, automatyzujesz powtarzalne kroki i trzymasz dane firmy pod kontrolą. Bez pisania kodu.",
    primaryCta: "Umów demo",
    secondaryCta: "Poznaj Opero",
    supportPoints: [
      "Obiekty własne, formularze i procesy dopasowane do firmy.",
      "Automatyzacje, raporty i asystent AI na Twoich danych.",
      "Uprawnienia, obieg dokumentów i pełna historia zmian.",
    ],
    visual: {
      questions: ["Jak wyglądają procesy?", "Kto za co odpowiada?", "W jakiej kolejności?", "Co warto zautomatyzować?"],
      steps: [
        {
          label: "01",
          title: "Opowiadasz nam, jak działa firma",
          description: "Procesy, role, rekordy, akceptacje, wyjątki.",
        },
        {
          label: "02",
          title: "Opero układa to w system",
          description: "Dane, procesy, uprawnienia, reguły, wsparcie AI.",
        },
        {
          label: "03",
          title: "Dostajesz system dopasowany do pracy",
          description: "Rozwiązanie szyte na miarę, które zespół rozwija dalej.",
        },
      ],
      magicLabel: "Mapowanie Opero",
      mappingItems: ["Model danych", "Logika procesu", "Reguły dostępu", "Automatyzacja"],
      outcomeItems: ["Dopasowany panel pracy", "Jasna odpowiedzialność", "Proces pod kontrolą", "System, który się rozwija"],
    },
    recordDemo: {
      listTitle: "Zgłoszenia serwisowe",
      focusRow: { number: "ZGL/2026/019", title: "Awaria centrali telefonicznej VoIP" },
      otherRows: [
        { number: "ZGL/2026/018", title: "Przegląd stacji roboczych", priority: "Niski", stage: "Przyjęte" },
        { number: "ZGL/2026/017", title: "Szkolenie z obsługi CRM", priority: "Niski", stage: "W realizacji" },
        { number: "ZGL/2026/016", title: "Backup i migracja danych", priority: "Wysoki", stage: "Rozwiązane" },
      ],
      fields: {
        client: "Klient",
        clientValue: "Hotel Panorama",
        priority: "Priorytet",
        value: "Wartość szacowana",
        valueTyped: "1 800,00 PLN",
      },
      priorityOptions: ["Niski", "Średni", "Wysoki", "Krytyczny"],
      processLabel: "Proces",
      stages: [
        { name: "Nowe", transition: "Przyjmij zgłoszenie" },
        { name: "Przyjęte", transition: "Rozpocznij realizację" },
        { name: "W realizacji", transition: "Zamknij zgłoszenie" },
        { name: "Zamknięte", transition: "" },
      ],
      doneLabel: "Zgłoszenie zamknięte",
      captions: {
        list: "Wszystkie sprawy w jednym miejscu",
        form: "Uzupełniasz <b>zwykły formularz</b>",
        process: "A <b>proces prowadzi za rękę</b>, krok po kroku",
        result: "Lista jest aktualna <b>bez pilnowania</b>",
      },
    },
  },
  problem: {
    label: "Problem",
    title: "Najwięcej kosztuje praca, której nie widać w systemie.",
    description:
      "Arkusz obok ERP, akceptacja w mailu, plik na dysku. Każde z osobna wygląda na drobne obejście. Razem tworzą drugi obieg firmy: nieopisany, niepoliczony i niemożliwy do odtworzenia, gdy ktoś pyta, dlaczego sprawa stanęła.",
    points: [
      "Zmiana procesu wymaga projektu wdrożeniowego, więc zespół omija system arkuszem.",
      "Ten sam rekord żyje w trzech miejscach i w żadnym nie jest pewny.",
      "Faktura czeka tydzień w skrzynce, bo nikt nie wiedział, że to jego krok.",
      "Raport na zarząd powstaje ręcznie i jest nieaktualny w dniu wysłania.",
    ],
  },
  solution: {
    label: "Rozwiązanie",
    title: "Opero dopasowuje się do sposobu pracy firmy.",
    description:
      "Zamiast dopasowywać firmę do gotowych modułów, projektujesz własne obiekty, procesy i widoki w konfiguracji wizualnej. Dane, obieg dokumentów, automatyzacje i uprawnienia pozostają w jednym systemie.",
    points: [
      "Modelujesz własne dane obiektami, polami, relacjami i formularzami.",
      "Prowadzisz dokumenty przez obieg akceptacji, z wersjami plików przy sprawie.",
      "Automatyzujesz powtarzalne kroki regułami, skryptami i zapytaniami SQL.",
      "Kontrolujesz dostęp rolami, uprawnieniami do pól i rejestrem zdarzeń.",
    ],
  },
  pillars: {
    label: "Możliwości Opero",
    title: "Fundament low-code dla procesów, które się zmieniają.",
    description:
      "Opero działa jak warstwa operacyjna firmy: model danych, procesy, obieg dokumentów, automatyzacje, raporty i uprawnienia pozostają połączone, zamiast tworzyć kolejne odseparowane narzędzia.",
    items: [
      {
        title: "Projektuj bez kodu",
        description:
          "Konfiguracja no-code: obiekty własne, pola, formularze, układy i menu składasz wizualnie, dopasowując je do tego, jak naprawdę pracuje firma.",
        capabilities: [
          "Obiekty i moduły własne",
          "Ponad 20 typów pól",
          "Formularze i układy",
          "Słowniki i listy własne",
        ],
      },
      {
        title: "Prowadź procesy i dokumenty",
        description:
          "Modeluj obiegi pracy jako etapy i przejścia, prowadź dokumenty przez akceptacje i trzymaj wersje plików przy sprawie.",
        capabilities: [
          "Etapy, przejścia i zadania",
          "Tablice kanban",
          "Obieg dokumentów i dekretacja",
          "Szablony dokumentów",
        ],
      },
      {
        title: "Automatyzuj i analizuj",
        description:
          "Reguły przejmują powtarzalne kroki, a raporty i dashboardy pokazują bieżący stan bez eksportu do arkuszy.",
        capabilities: [
          "Silnik reguł i skrypty",
          "Zapytania SQL",
          "Raporty i dashboardy",
          "Asystent AI na Twoich danych",
        ],
      },
      {
        title: "Zachowaj kontrolę",
        description:
          "Uprawnienia sięgają pojedynczego pola, a integracje z KSeF i e-Doręczeniami trzymają zgodność w jednym systemie.",
        capabilities: [
          "Role i uprawnienia do pól",
          "Wiele spółek w organizacji",
          "KSeF i e-Doręczenia",
          "Tokeny API, MFA i logi",
        ],
      },
    ],
  },
  workflow: {
    label: "Jak to działa",
    title: "Od rozproszonych operacji do uporządkowanego systemu.",
    description:
      "KodaSoft traktuje Opero jak solidną warstwę produktową: najpierw porządkujemy obraz pracy firmy, a potem przekładamy go na stabilne, kontrolowane procesy.",
    steps: [
      {
        label: "01",
        title: "Rozpoznaj",
        description:
          "Nazwij rekordy, procesy, role, akceptacje i przekazania, które faktycznie prowadzą firmę.",
      },
      {
        label: "02",
        title: "Zamodeluj",
        description:
          "Przełóż je na obiekty własne, pola, formularze, relacje i widoki operacyjne.",
      },
      {
        label: "03",
        title: "Automatyzuj",
        description:
          "Dodaj reguły, powiadomienia, kontrole cykliczne, integracje i wsparcie AI tam, gdzie oszczędzają czas.",
      },
      {
        label: "04",
        title: "Kontroluj",
        description:
          "Ustaw role i uprawnienia, utrzymaj ślad zmian i pokaż stan operacji w raportach oraz wyszukiwaniu.",
      },
      {
        label: "05",
        title: "Rozwijaj",
        description:
          "Zmieniaj konfigurację wraz z firmą, zamiast zamawiać kolejne rozwiązanie od zera.",
      },
    ],
  },
  ai: {
    label: "Praktyczne AI",
    title: "AI powinno pracować w procesie, nie obok niego.",
    description:
      "Asystent Opero zna strukturę, konfigurację i dane Twojej instancji, więc odpowiada konkretami zamiast ogólników. Konsultant buduje nim konfigurację, a użytkownik pyta o dane w języku naturalnym, w granicach swoich uprawnień.",
    points: [
      "Budowa obiektów, formularzy i reguł w dialogu z asystentem.",
      "Pytania o dane w języku naturalnym, bez klikania po widokach.",
      "Podsumowania kontekstu rekordu w trakcie procesu.",
      "Klasyfikacja i przekształcanie danych podczas wykonania reguły.",
      "Uprawnienia użytkownika obowiązują tak samo jak przy zwykłej pracy.",
    ],
    chat: {
      assistantPrompt: "Jak mogę pomóc?",
      userRequest: "Potrzebuję raportu 5 najlepiej sprzedających się produktów z ostatniego tygodnia.",
      assistantReply: "Jasne. Oto raport przygotowany na podstawie rekordów sprzedaży.",
      reportTitle: "Najlepsze produkty - ostatni tydzień",
      statusLabel: "gotowe",
      scopeLabel: "kontrolowane",
      footer: "Odpowiedzi zawsze pozostają powiązane z rekordami, regułami i uprawnieniami użytkownika.",
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
    title: "Dla procesów, które wyrosły z gotowych systemów.",
    description:
      "Opero sprawdza się tam, gdzie proces jest specyficzny dla firmy, a mimo to musi być kontrolowany, przeszukiwalny i gotowy na audyt.",
    items: [
      {
        title: "Obieg dokumentów i akceptacje",
        description:
          "Prowadź pisma, faktury i wnioski przez dekretację, opinie i zatwierdzenie, z wersjami plików i pełną historią przy sprawie.",
      },
      {
        title: "Własne rekordy operacyjne",
        description:
          "Buduj obiekty i formularze dla zleceń, zgłoszeń, sprzętu czy umów, gdy standardowe moduły ERP nie odpowiadają procesowi.",
      },
      {
        title: "Automatyzacja powtarzalnej pracy",
        description:
          "Przenieś ręczne kroki do reguł: nadawanie numerów, powiadomienia, kontrole terminów i cykliczne raporty.",
      },
      {
        title: "Raportowanie bez eksportów",
        description:
          "Zbieraj wskaźniki na żywych danych i schodź od liczby zbiorczej do pojedynczych rekordów, które ją tworzą.",
      },
    ],
  },
  trust: {
    label: "Tworzone przez KodaSoft",
    title: "Doświadczenie software house’u, wykonanie na poziomie produktu.",
    description:
      "KodaSoft buduje Opero z dyscypliną inżynieryjną: elastyczna architektura, utrzymywalny kod, kontrolowane uprawnienia, sprawdzalna automatyzacja i świadome podejście do wydajności.",
    points: [
      "Architektura pod konfigurowalne procesy, nie pod zamknięty zestaw modułów.",
      "Kontrola oparta na rolach, uprawnieniach i rejestrze zdarzeń.",
      "Automatyzacja, którą da się przetestować przed wdrożeniem.",
      "Myślenie produktowe wsparte solidną inżynierią.",
    ],
  },
  finalCta: {
    eyebrow: "Zacznij od procesu",
    title: "Buduj oprogramowanie wokół tego, jak firma naprawdę pracuje.",
    description:
      "Pokaż nam jeden proces, który dziś żyje w mailach i arkuszach. Zobaczysz, jak wygląda w Opero.",
    primaryCta: "Umów demo",
    secondaryCta: "Poznaj Opero",
  },
};

export const homeCtas = {
  primary: localizePath("pl", "contact"),
  secondary: localizePath("pl", "opero"),
};
