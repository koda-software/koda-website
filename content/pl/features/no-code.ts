import type { FeaturePageContent, NoCodePageContent } from "@/content/types";

export const noCodeFeature: FeaturePageContent = {
  seo: {
    title: "System no-code, którego potrzebuje Twoja firma | Opero",
    description:
      "Buduj aplikacje biznesowe bez kodu: modeluj dane za pomocą własnych obiektów i pól, projektuj formularze i widoki, konfiguruj menu i pulpity oraz bezpiecznie publikuj zmiany.",
  },
  navLabel: "Platforma no-code",
  hero: {
    eyebrow: "Funkcje systemu",
    title: "System no-code, którego potrzebuje Twoja firma.",
    description: "Konfiguruj wizualnie obiekty, formularze, menu i pulpity w Opero.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Poznaj Opero",
  },
  intro: { eyebrow: "W skrócie", paragraph: "Buduj kompletne aplikacje biznesowe za pomocą konfiguracji wizualnej." },
  blocks: {
    eyebrow: "Co dostajesz",
    title: "Jedna aplikacja skonfigurowana wokół firmy.",
    items: [
      { title: "Dane", description: "Własne moduły, obiekty, pola i relacje." },
      { title: "Widoki", description: "Formularze i układy dla każdego kontekstu pracy." },
      { title: "Nawigacja", description: "Uporządkowane menu dla każdego zespołu i firmy." },
      { title: "Strony", description: "Pulpity, raporty, zadania i formularze zgłoszeń." },
    ],
  },
  finalCta: { eyebrow: "Następny krok", title: "Pokaż nam, czym potrzebujesz zarządzać.", description: "Zamienimy to w model w Opero.", primaryCta: "Umów prezentację" },
  seoText: {
    eyebrow: "Więcej o no-code",
    title: "Aplikacje biznesowe bez projektu programistycznego.",
    paragraphs: ["Opero łączy konfigurowalne dane, widoki, nawigację i strony w jednej zarządzanej aplikacji."],
  },
  faq: {
    eyebrow: "Pytania",
    title: "Najczęściej zadawane pytania.",
    items: [{ question: "Czy zbuduję aplikację bez programisty?", answer: "Tak. Podstawowe narzędzia do budowy aplikacji w Opero opierają się na konfiguracji wizualnej." }],
  },
  related: { eyebrow: "Pokrewne funkcje", title: "Zobacz też", items: ["processes", "lowCode", "reports"] },
};

export const noCodePage: NoCodePageContent = {
  labels: { screenshotPlaceholder: "Miejsce na zrzut ekranu" },
  hero: {
    eyebrow: "Platforma no-code Opero",
    title: "System no-code, którego potrzebuje Twoja firma.",
    description:
      "Opero zapewnia fundamenty wspólne dla każdej aplikacji biznesowej: dane, formularze, uprawnienia, pliki i historię. Ty konfigurujesz to, co właściwe dla Twojej firmy, od obiektów i formularzy po menu i pulpity, a następnie publikujesz. Bez kodu i bez projektu programistycznego.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Poznaj Opero",
    image: {
      src: "/opero/no-code/view-layout-hero.webp",
      alt: "Kreator układu widoku Opero konfigurujący formularz Asset Lifecycle Admin w ciemnej przestrzeni pracy",
      width: 2111,
      height: 1316,
    },
  },
  foundation: {
    eyebrow: "Inny sposób budowy",
    title: "Dopasowany do firmy nie musi oznaczać budowanego od zera.",
    description:
      "System dopasowany do firmy zwykle oznacza projekt programistyczny. Ktoś musi zbudować warstwę danych, ekrany i uprawnienia, przeprowadzić testy, a potem przez lata utrzymywać każdą zmianę. Większość tej pracy wygląda tak samo w każdej firmie. Opero zapewnia ją raz. Do skonfigurowania zostaje to, co rzeczywiście jest Twoje: jakie informacje śledzi system, jak wygląda dla poszczególnych zespołów i od czego ludzie zaczynają dzień.",
    comparison: {
      traditional: {
        title: "Budowa od zera trwa...",
      },
      opero: {
        title: "Konfiguracja w Opero trwa...",
      },
      groups: [
        {
          rows: [
            {
              title: "Model danych",
              detail: "Obiekty, pola i relacje",
              traditional: { label: "Budujesz od zera", meta: "2–4 tygodnie", mode: "build" },
              opero: { label: "Konfigurujesz", meta: "Kilka godzin", mode: "configure" },
            },
            {
              title: "Ekrany",
              detail: "Formularze i układy dla zespołów",
              traditional: { label: "Budujesz od zera", meta: "3–6 tygodni", mode: "build" },
              opero: { label: "Konfigurujesz", meta: "Kilka godzin", mode: "configure" },
            },
            {
              title: "Nawigacja",
              detail: "Menu dla zespołów i firm",
              traditional: { label: "Budujesz od zera", meta: "1–2 tygodnie", mode: "build" },
              opero: { label: "Konfigurujesz", meta: "Do godziny", mode: "configure" },
            },
            {
              title: "Strony startowe",
              detail: "Pulpity, liczniki i formularze",
              traditional: { label: "Budujesz od zera", meta: "2–4 tygodnie", mode: "build" },
              opero: { label: "Konfigurujesz", meta: "1–2 dni", mode: "configure" },
            },
            {
              title: "Automatyzacje",
              detail: "Logika biznesowa",
              traditional: { label: "Budujesz od zera", meta: "4–8 tygodni", mode: "build" },
              opero: { label: "Konfigurujesz", meta: "Kilka godzin", mode: "configure" },
            },
            {
              title: "Integracje",
              detail: "Narzędzia zewnętrzne",
              traditional: { label: "Budujesz od zera", meta: "4–8 tygodni", mode: "build" },
              opero: { label: "Konfigurujesz", meta: "Kilka kliknięć", mode: "configure" },
            },
          ],
        },
        {
          label: "Takie same w każdej firmie",
          rows: [
            {
              title: "Baza danych i API",
              detail: "Dane, walidacja, wyszukiwanie i listy",
              traditional: { label: "Budujesz od zera", meta: "4–8 tygodni", mode: "build" },
              opero: { label: "Dostępne od pierwszego dnia", meta: "Gotowe", mode: "included" },
            },
            {
              title: "Uprawnienia",
              detail: "Role, firmy i dostęp do pól",
              traditional: { label: "Budujesz od zera", meta: "3–5 tygodni", mode: "build" },
              opero: { label: "Dostępne od pierwszego dnia", meta: "Gotowe", mode: "included" },
            },
            {
              title: "Historia zmian",
              detail: "Kto, co, kiedy i dlaczego zmienił",
              traditional: { label: "Budujesz od zera", meta: "2–3 tygodnie", mode: "build" },
              opero: { label: "Dostępne od pierwszego dnia", meta: "Gotowe", mode: "included" },
            },
            {
              title: "Pliki i dokumenty",
              detail: "Załączniki, wersje i podglądy",
              traditional: { label: "Budujesz od zera", meta: "2–4 tygodnie", mode: "build" },
              opero: { label: "Dostępne od pierwszego dnia", meta: "Gotowe", mode: "included" },
            },
            {
              title: "Procesy i zadania",
              detail: "Etapy, przypisania i terminy",
              traditional: { label: "Budujesz od zera", meta: "4–8 tygodni", mode: "build" },
              opero: { label: "Dostępne od pierwszego dnia", meta: "Gotowe", mode: "included" },
            },
            {
              title: "Powiadomienia i komentarze",
              detail: "Wzmianki, e-mail i aplikacja",
              traditional: { label: "Budujesz od zera", meta: "2–3 tygodnie", mode: "build" },
              opero: { label: "Dostępne od pierwszego dnia", meta: "Gotowe", mode: "included" },
            },
            {
              title: "Hosting, kopie i aktualizacje",
              detail: "Bezpieczeństwo, monitoring i rozwój",
              traditional: { label: "Budujesz od zera", meta: "4–8 tygodni", mode: "build" },
              opero: { label: "Chmura lub on-premise", meta: "Gotowe", mode: "included" },
            },
          ],
        },
      ],
      summaries: {
        traditional: {
          total: "6–12 miesięcy",
          description: "Każdą warstwę trzeba zbudować, przetestować i utrzymywać. Każda późniejsza zmiana wraca do tego samego zespołu.",
          tags: ["Zespół programistów backendu i frontendu", "Kierownik projektu", "Tester", "DevOps", "Każda zmiana wymaga zebrania wymagań, estymacji, wytworzenia i testowania"],
        },
        opero: {
          total: "Kilka dni",
          description: "Siedem warstw już działa. Konfigurujesz sześć, które opisują Twoją firmę, a potem samodzielnie je rozwijasz.",
          tags: ["Bez kodu", "Wersja robocza, walidacja, publikacja", "Zmiana to tylko kilka kliknięć lub krótka rozmowa z ulubionym narzędziem agentowym, takim jak Claude lub Codex"],
        },
      },
    },
  },
  capabilities: {
    eyebrow: "Kształtuj system",
    title: "Cztery obszary konfiguracji. Jedna aplikacja.",
    description:
      "Dane, widoki, nawigacja i strony nie są oddzielnymi narzędziami. To cztery perspektywy tej samej konfiguracji. Pole dodane dzisiaj pojawia się w formularzu, na liście, w filtrze menu i w liczniku na pulpicie, ponieważ ma tylko jedną definicję.",
    items: [
      {
        number: "01",
        eyebrow: "Modeluj firmę",
        title: "Opisz to, czym zajmuje się Twoja firma.",
        description:
          "Moduł to obszar biznesowy. Obiekty to jego elementy: zasoby, przeglądy, zgłoszenia, dostawcy. Każdy obiekt opisują pola z 31 typów, od tekstu i kwoty po plik, podpis, powiązanie z innym obiektem czy generowany numer, taki jak INS/2026/041. Słowniki pilnują spójności wyborów, więc Priorytet oznacza to samo w każdym formularzu.",
        bullets: [
          "Relacje między obiektami, widoczne jako tabele bezpośrednio w rekordzie.",
          "Własne pola także w obiektach wbudowanych: kontrahentach, fakturach, użytkownikach, budżetach.",
          "Zmiany struktury przechodzą przez wersję roboczą z podglądem wpływu przed publikacją.",
          "Słowniki z metadanymi, na przykład priorytet niosący własny czas SLA.",
        ],
        visual: {
          label: "Edytor modelu danych",
          title: "Zarządzanie zasobami: pola obiektu i relacje",
          image: {
            src: "/opero/no-code/data-model-fields.webp",
            alt: "Edytor modelu danych Opero z własnymi polami zasobu i relacją do obiektu Kategoria zasobu",
            width: 1926,
            height: 1139,
          },
        },
      },
      {
        number: "02",
        eyebrow: "Kształtuj doświadczenie",
        title: "Projektuj ekrany, na których pracuje każdy zespół.",
        description:
          "Przeciągaj pola na obszar roboczy. Grupuj je w karty i kolumny, a rzadziej używane szczegóły chowaj w zakładce. Ustaw pole jako wymagane dla technika i opcjonalne dla menedżera albo pokazuj sekcję tylko po spełnieniu warunku. Jeden obiekt, kilka formularzy: jeden do zgłoszenia usterki, drugi do akceptacji naprawy.",
        bullets: [
          "Układy dla własnych obiektów i wbudowanych: kontrahentów, faktur, budżetów, użytkowników.",
          "Powiązane rekordy jako tabele, z tworzeniem i dołączaniem tam, gdzie ich potrzebujesz.",
          "Przyciski, własne treści i raporty bezpośrednio w rekordzie.",
          "Każdy zapis to wersja. Podgląd, publikacja i przywracanie jednym kliknięciem.",
        ],
        visual: {
          label: "Kreator układu widoku",
          title: "Kreator formularza obok gotowego zgłoszenia serwisowego",
          image: {
            src: "/opero/no-code/view-layout-builder.webp",
            alt: "Kreator układu widoku Opero z zakładkami, kartami, kolumnami i polami zasobu rozmieszczanymi na formularzu",
            width: 1488,
            height: 1374,
          },
        },
        reverse: true,
      },
      {
        number: "03",
        eyebrow: "Uprość przestrzeń pracy",
        title: "Daj każdemu zespołowi menu dopasowane do jego dnia.",
        description:
          "Menu to drzewo, które składasz przeciąganiem z folderów, obiektów, raportów, stron i linków. Ten sam obiekt może pojawić się dwa razy z różnymi filtrami: Moje otwarte zgłoszenia dla techników, Wszystkie zgłoszenia dla kierownika. Wskaż punkt startowy i zbuduj osobne menu dla zespołu terenowego, biura lub firmy zewnętrznej na tych samych danych.",
        bullets: [
          "Foldery do trzech poziomów, zmieniane i porządkowane na miejscu.",
          "Zapisane filtry, kolumny i sortowanie dla każdej pozycji menu.",
          "Osobne menu dla każdego zespołu lub firmy, z tych samych obiektów.",
        ],
        visual: {
          label: "Edytor menu",
          title: "Menu zespołu utrzymania i uproszczona przestrzeń, którą tworzy",
          image: {
            src: "/opero/no-code/menu-configuration.webp",
            alt: "Edytor menu Opero z elementami nawigacji pulpitu, CRM, HR i zasobów obok podglądu gotowego menu",
            width: 1617,
            height: 1011,
          },
        },
      },
      {
        number: "04",
        eyebrow: "Stwórz właściwy punkt startowy",
        title: "Buduj stronę, którą ludzie otwierają jako pierwszą.",
        description:
          "Strony własne składasz z 20 komponentów: liczników na żywo, wykresów i raportów przestawnych, list zadań, osadzonego formularza, plików, komentarzy, szybkich linków i własnych treści. Pulpit utrzymania pokaże na jednym ekranie zaległe przeglądy, zasoby według statusu, zadania na ten tydzień i formularz Zgłoś usterkę. Każdy zespół ma własną stronę startową.",
        bullets: [
          "Liczniki i wykresy czytają bieżące dane, więc nikt nie składa raportu statusowego ręcznie.",
          "Osadzony formularz zmienia stronę w punkt przyjmowania zgłoszeń dla zespołu lub całej firmy.",
          "Strony pozostają wersjami roboczymi do publikacji, a każda wersja jest zachowana.",
        ],
        visual: {
          label: "Kreator strony",
          title: "Pulpit utrzymania z licznikami, raportami, zadaniami i formularzem",
          image: {
            src: "/opero/no-code/custom-dashboard.webp",
            alt: "Pulpit zarządczy Opero z metrykami lejka, wykresami i nawigacją firmy",
            width: 1985,
            height: 1467,
          },
        },
        reverse: true,
      },
    ],
  },
  process: {
    eyebrow: "Następnie wpraw to w ruch",
    title: "Dołącz proces do dowolnego obiektu.",
    description:
      "Zgłoszenie nie powinno tylko leżeć na liście. Dodaj workflow: etapy, osoby przypisane, terminy i dozwolone przejścia. Każdy etap staje się zadaniem w czyjejś kolejce, a każda zmiana jest zapisywana. Workflow też konfigurujesz wizualnie, a typowe akceptacje zaczynasz od szablonu.",
    tracker: {
      stages: [
        {
          title: "Zgłoszone",
          detailBefore: "przez ",
          emphasis: "Annę Kowalską",
          timestamp: "Pon. 09:12",
          state: "complete",
        },
        {
          title: "Przydzielone",
          detailBefore: "do ",
          emphasis: "Marka Nowaka",
          timestamp: "Pon. 09:12",
          state: "complete",
        },
        {
          title: "W naprawie",
          detailBefore: "prowadzi ",
          emphasis: "Marek Nowak",
          timestamp: "Wt. 14:03",
          state: "active",
        },
        {
          title: "Zamknięte",
          detailBefore: "możliwe po dodaniu komentarza przekazania",
          timestamp: "—",
          state: "upcoming",
        },
      ],
    },
    cta: "Poznaj procesy i workflow",
  },
  adaptation: {
    eyebrow: "Stale dopasowuj",
    title: "Codzienne usprawnienia nie powinny stawać się projektami programistycznymi.",
    description:
      "Dodaj kategorię zasobu. Połącz sprzęt z dostawcą gwarancji. Ustaw Datę przeglądu jako wymaganą. Usuń pozycję menu, z której nikt nie korzysta. W Opero to zmiany konfiguracji: wersja robocza, podgląd wpływu, walidacja, publikacja. Rekordy zostają nienaruszone, a poprzednia wersja jest o jedno kliknięcie.",
    bullets: [
      "Podgląd wpływu przed usunięciem pola pokazuje, które układy, reguły i zapytania z niego korzystają.",
      "Układy naprawiają się po zniknięciu pola, zarówno opublikowane, jak i robocze.",
      "Nic nie trafia na produkcję, dopóki nie zastosujesz wersji roboczej.",
    ],
    visual: {
      label: "Podgląd wpływu",
      title: "Wersja robocza schematu, walidacja i bezpieczna publikacja",
      image: {
        src: "/opero/no-code/schema-draft-impact.webp",
        alt: "Wersja robocza modelu danych Opero z polem oczekującym na usunięcie przed publikacją zmian",
        width: 898,
        height: 839,
      },
    },
  },
  faq: {
    eyebrow: "Pytania",
    title: "Najczęściej zadawane pytania.",
    items: [
      { question: "Czy naprawdę zbuduję aplikację bez programisty?", answer: "Tak. Obiekty, pola, formularze, układy, menu, strony i workflow powstają w konfiguracji wizualnej. Osoba, która zna proces, może zbudować działającą aplikację. Reguły i skrypty służą do zaawansowanej logiki, ale kompletna aplikacja ich nie wymaga." },
      { question: "Czym jest obiekt własny?", answer: "Obiekt własny to definicja danych, którą projektujesz samodzielnie, podobna do tabeli: Zasób, Umowa, Zgłoszenie. Może mieć pola 31 typów, relacje z innymi obiektami i obiekty podrzędne, takie jak pozycje. Opero automatycznie generuje jego listę, formularze i historię." },
      { question: "Jak zmiany trafiają na produkcję?", answer: "Przez wersję roboczą. Zmiany struktury są walidowane, a Opero pokazuje ich wpływ przed zastosowaniem. Układy, strony i workflow publikujesz świadomie, a każda wersja jest zachowywana, więc w dowolnym momencie możesz przywrócić poprzednią." },
      { question: "Czy możemy zacząć od arkusza, którego już używamy?", answer: "To najczęstszy punkt startowy. Kolumny arkusza stają się polami, zakładki obiektami lub pozycjami menu, a kolumna statusu zmienia się w workflow. Przynieś arkusz na prezentację, a wspólnie zamodelujemy go na żywo." },
      { question: "Czym różnią się no-code i low-code w Opero?", answer: "No-code to konfiguracja opisana na tej stronie i wystarcza do zbudowania kompletnej aplikacji. Low-code dodaje reguły, skrypty i zapytania SQL na tych samych obiektach dla logiki, której nie da się wyrazić konfiguracją. Korzystasz z niego tylko tam, gdzie się to opłaca." },
      { question: "Czy inne systemy mogą korzystać z tego, co zbudujemy?", answer: "Tak. Każdy obiekt można udostępnić przez API z kontrolą na poziomie pola nad odczytem, zapisem, filtrowaniem i sortowaniem. Integracje konfiguruje się zamiast wpisywać je na stałe w aplikację." },
    ],
  },
  related: {
    eyebrow: "Pokrewne funkcje",
    title: "Zobacz też",
    items: [
      { feature: "processes", title: "Procesy i workflow", description: "Etapy, zadania, terminy i tablice kanban na skonfigurowanych obiektach." },
      { feature: "lowCode", title: "Low-code i automatyzacja", description: "Reguły, skrypty i zapytania SQL tam, gdzie konfiguracja nie wystarcza." },
      { feature: "reports", title: "Raporty i pulpity", description: "Tabele przestawne i wykresy z analizą szczegółów, eksportem do Excela lub osadzeniem na stronie." },
    ],
  },
  finalCta: {
    eyebrow: "Zobacz to na własnym przykładzie",
    title: "Pokaż nam, czym potrzebuje zarządzać Twoja firma.",
    description: "Przynieś arkusz, proces działający dziś w e-mailach albo pomysł na system wewnętrzny. Podczas prezentacji zbudujemy na Twoich oczach jego moduł, formularz, menu i pulpit, aby pokazać, jak nabiera kształtu w Opero.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Skontaktuj się z nami",
  },
};
