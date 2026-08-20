import { localizeFeaturePath } from "@/lib/i18n/features";
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
      "Arkusz obok ERP, akceptacja w mailu, plik na dysku. Drobne obejścia tworzą drugi obieg firmy: nieopisany, niewidoczny i trudny do odtworzenia, gdy sprawa staje.",
    comparison: {
      title: "Macierz ryzyka przychodów",
      ariaLabel: "Porównaj Arkusze i Opero",
      beforeLabel: "Arkusze",
      beforeAlt: "Arkusz z danymi źródłowymi macierzy ryzyka przychodów",
      afterLabel: "Opero",
      afterAlt: "Raport Opero przedstawiający macierz ryzyka przychodów",
    },
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
      "Automatyzujesz powtarzalne kroki, a role, uprawnienia i rejestr zdarzeń trzymają kontrolę.",
    ],
    cta: "Poznaj Opero",
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
        link: {
          label: "Więcej o no-code",
          href: localizeFeaturePath("pl", "noCode"),
        },
        animation: {
          tryLabel: "Spróbuj!",
          dashboard: {
            blocks: ["Licznik", "Raport", "Tabela"],
            metrics: ["Otwarta wartość", "Ważona", "Sprawy"],
            chartTitle: "Zdrowie pipeline'u",
            tableTitle: "Sprawy wg etapu",
          },
          form: {
            blocks: ["Pole tekstowe", "Wybór", "Tekst długi"],
            fields: ["Tytuł zadania", "Priorytet", "Opis"],
            actionLabel: "Utwórz zadanie",
          },
        },
      },
      {
        title: "Te same dane, różne perspektywy",
        description:
          "Wszyscy pracują na tych samych rekordach, ale każda rola potrzebuje innego widoku. Układaj tabele, tablice i harmonogramy pod przebieg pracy, zamiast narzucać jeden sposób patrzenia całemu zespołowi.",
        capabilities: [
          "Konfigurowalne tabele z grupowaniem i formatowaniem",
          "Elastyczne tablice kanban",
          "Wygodne kalendarze i wykresy Gantta",
          "Widoki, filtry i układy dopasowane do ról",
        ],
        link: {
          label: "Więcej o widokach",
          href: localizeFeaturePath("pl", "reports"),
        },
      },
      {
        title: "Automatyzuj wszystko",
        description:
          "Twórz reguły wokół tego, jak naprawdę działa firma: akceptacje, powiadomienia, integracje i logikę wyjątków. Opero obsługuje proste przekazania i złożone przypadki w jednym kontrolowanym systemie.",
        capabilities: [
          "Elastyczny silnik reguł do niemal każdej automatyzacji",
          "System workflow, który pilnuje procesów",
          "Integracje z narzędziami używanymi przez zespoły",
          "Asystent AI i API do własnych operacji",
        ],
        link: {
          label: "Więcej o automatyzacji",
          href: localizeFeaturePath("pl", "lowCode"),
        },
        ruleAnimation: {
          actionLabel: "Wyślij fakturę",
          start: {
            title: "Faktura wpływa",
            meta: "Nowy rekord",
          },
          condition: {
            title: "Sprawdź kwotę",
            meta: "Poniżej €1000?",
          },
          positive: {
            title: "Autoakceptacja",
            meta: "Poniżej limitu",
            outcome: "Gotowa do płatności",
          },
          negative: {
            title: "Akceptacja menedżera",
            meta: "Powyżej limitu",
            outcome: "Wymaga uwagi",
          },
          positiveLabel: "Akceptuj",
          negativeLabel: "Eskaluj",
        },
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
        link: {
          label: "Więcej o uprawnieniach",
          href: localizeFeaturePath("pl", "security"),
        },
        permissionAnimation: {
          title: "Profil pracownika",
          viewAsLabel: "Widok jako:",
          employeeRoleLabel: "Pracownik",
          hrRoleLabel: "HR",
          fields: [
            { label: "Pracownik", value: "Marta Kowalska" },
            { label: "Wynagrodzenie", value: "92 000 EUR" },
            { label: "Typ umowy", value: "Pełny etat" },
          ],
          lockedLabel: "Pole ukryte",
          roleBeforeLabel: "Rola: Finance",
          roleAfterLabel: "Rola: Pracownik",
        },
      },
    ],
  },
  workflow: {
    label: "Jak to działa",
    title: "Jak KodaSoft przekłada proces na Opero.",
    description:
      "Każdą współpracę zaczynamy od zrozumienia firmy, a nie od uruchomienia narzędzia. Analizujemy realny przebieg pracy, konfigurujemy Opero pod ten proces, wdrażamy zespół i rozwijamy rozwiązanie na podstawie pracy w systemie.",
    steps: [
      {
        label: "01",
        title: "Analiza",
        description:
          "Zbieramy wymagania, mapujemy proces, nazywamy problemy i sprawdzamy, gdzie dziś rozchodzą się dane, dokumenty oraz decyzje.",
      },
      {
        label: "02",
        title: "Model rozwiązania",
        description:
          "Przekładamy analizę na Opero: obiekty, pola, widoki, workflow, uprawnienia, raporty i potrzebne integracje.",
      },
      {
        label: "03",
        title: "Wdrożenie zespołu",
        description:
          "Uruchamiamy pierwszy działający proces, szkolimy użytkowników i dbamy o to, żeby każda rola widziała właściwe zadania oraz widoki.",
      },
      {
        label: "04",
        title: "Iteracja i rozwój",
        description:
          "Na podstawie realnej pracy dopracowujemy konfigurację, dodajemy automatyzacje, poprawiamy raporty i rozszerzamy Opero na kolejne procesy.",
      },
    ],
  },
  integrations: {
    label: "Integracje",
    title: "Połącz Opero z usługami wokół Twojego procesu.",
    description:
      "Opero może wymieniać dane z rejestrami publicznymi, kanałami doręczeń, podpisami i narzędziami, z których zespół już korzysta. Zacznij od integracji potrzebnych dziś i dodawaj kolejne, gdy proces się rozwija.",
    link: {
      label: "Więcej o integracjach",
      href: localizeFeaturePath("pl", "integrations"),
    },
    items: [
      {
        name: "KSeF",
        description: "Obsługa faktur ustrukturyzowanych w procesach finansowych.",
        icon: "invoice",
        logoSrc: "/integrations/ksef.png",
        tone: "sky",
      },
      {
        name: "e-Doręczenia",
        description: "Oficjalne doręczenia elektroniczne połączone z obiegiem dokumentów.",
        icon: "delivery",
        logoSrc: "/integrations/e-doreczenia.png",
        tone: "violet",
      },
      {
        name: "GUS",
        description: "Sprawdzanie danych firm tam, gdzie powstają rekordy w systemie.",
        icon: "registry",
        logoSrc: "/integrations/gus.png",
        tone: "green",
      },
      {
        name: "VIES",
        description: "Weryfikacja VAT UE w procesach klientów, faktur i akceptacji.",
        icon: "registry",
        logoSrc: "/integrations/eu-flag.svg",
        tone: "sky",
      },
      {
        name: "Bramki SMS",
        description: "Powiadomienia i potwierdzenia procesowe wysyłane przez dostawców SMS.",
        icon: "sms",
        logoSrc: "/integrations/sms.png",
        tone: "amber",
      },
      {
        name: "MFA",
        description: "Uwierzytelnianie wieloskładnikowe z popularnymi aplikacjami, YubiKey i innymi bezpiecznymi metodami logowania.",
        icon: "signature",
        logoSrc: "/integrations/mfa.png",
        tone: "rose",
      },
      {
        name: "Własne e-maile",
        description: "Szablony, przypisania i automatyczne wiadomości powiązane ze zdarzeniami.",
        icon: "email",
        tone: "rose",
      },
      {
        name: "Podpis kwalifikowany",
        description: "Kroki podpisu osadzone w tej samej sprawie, akceptacji i historii plików.",
        icon: "signature",
        tone: "slate",
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
