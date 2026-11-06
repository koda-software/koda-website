import type { AiPageContent, FeaturePageContent } from "@/content/types";

export const aiFeature: FeaturePageContent = {
  seo: {
    title: "Kontekstowe AI dla systemów firmowych",
    description:
      "Połącz Claude lub dowolnego agenta MCP z Opero i opisz, czego potrzebujesz. Zbuduje bloki, reguły i widoki na Twoich danych, w granicach uprawnień.",
  },
  navLabel: "Kontekstowe AI",
  hero: {
    title: "Powiedz, czego potrzebujesz. Opero to zbuduje.",
    description: "Połącz agenta AI z Opero i buduj bloki, reguły i widoki, opisując je słowami, na prawdziwych danych i z Twoimi uprawnieniami.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Zobacz Opero w akcji",
  },
  intro: { paragraph: "Agent AI łączy się z Opero, pracuje na Twojej konfiguracji i danych, a potem buduje to, co opiszesz." },
  blocks: {
    title: "Zapytaj, zbuduj, zachowaj.",
    items: [
      { title: "Zapytaj", description: "Odpowiedzi na podstawie bieżących danych w Twoim systemie." },
      { title: "Zbuduj", description: "Bloki, reguły, formularze i strony konfigurowane w rozmowie." },
      { title: "Zachowaj", description: "Wyniki, które zostają w Opero i pobierają aktualne dane." },
    ],
  },
  finalCta: { title: "Powiedz nam, czego brakuje Ci w systemie.", description: "Zbudujemy to podczas prezentacji.", primaryCta: "Umów prezentację" },
  seoText: {
    title: "AI, które pracuje w Twoim systemie.",
    paragraphs: ["Opero łączy się z agentami AI przez MCP, więc agent pracuje na Twojej konfiguracji i danych w granicach Twoich uprawnień."],
  },
  faq: {
    title: "Najczęściej zadawane pytania.",
    items: [{ question: "Czy z AI rozmawiam wewnątrz Opero?", answer: "Nie. Łączysz z Opero Claude lub innego agenta MCP. Rozmowa toczy się w agencie, a wyniki zostają w Opero." }],
  },
  related: { title: "Zobacz też", items: ["noCode", "lowCode", "reports"] },
};

export const aiPage: AiPageContent = {
  hero: {
    title: "Powiedz, czego potrzebujesz. Opero to zbuduje.",
    description:
      "Kontekstowe AI dla Twojego systemu firmowego: połącz Claude lub innego agenta MCP z Opero i opisz zwykłymi słowami widok, regułę albo raport. Agent pracuje na Twoich obiektach, polach i uprawnieniach, więc to, co zbuduje, trafia do Twojego systemu i tam zostaje.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Zobacz, jak powstaje blok",
    trust: ["Model AI według Twojego wyboru", "Działa z Twoimi uprawnieniami", "Walidacja przed zapisem", "Bez pisania kodu"],
    demo: {
      sentence: [
        { text: "Pokaż " },
        { text: "5 ostatnich faktur", key: "invoices" },
        { text: " tego " },
        { text: "klienta", key: "client" },
        { text: ". Oznacz " },
        { text: "zaległe", key: "overdue" },
        { text: ". Dodaj przycisk " },
        { text: "przypomnienia", key: "reminder" },
        { text: "." },
      ],
      sendLabel: "Wyślij wiadomość",
      tags: { client: "Kontrahent", invoices: "Faktury sprzedaży", overdue: "Termin przed dzisiaj", reminder: "Reguła: przypomnienie o płatności" },
      page: {
        breadcrumb: "Kontrahenci",
        title: "Hotel Panorama",
        status: "Aktywny",
        fields: [
          { label: "Miasto", value: "Kraków" },
          { label: "Opiekun", value: "Anna Nowak" },
          { label: "Termin płatności", value: "14 dni" },
        ],
      },
      block: {
        title: "5 ostatnich faktur",
        asOf: "Stan na 4 lis",
        columns: ["Faktura", "Termin", "Kwota"],
        rows: [
          { number: "FV/2026/1184", due: "12 lis", amount: "4 200 zł" },
          { number: "FV/2026/1147", due: "28 paź", amount: "6 240 zł", overdue: true },
          { number: "FV/2026/1102", due: "14 paź", amount: "3 860 zł" },
          { number: "FV/2026/1069", due: "2 paź", amount: "12 180 zł", overdue: true },
          { number: "FV/2026/1031", due: "18 wrz", amount: "2 950 zł" },
        ],
        overdueLabel: "Zaległa",
        totalLabel: "Suma zaległości",
        total: 18420,
        currency: "zł",
        thousandsSeparator: " ",
        action: { before: "Wyślij ", word: "przypomnienie" },
      },
    },
  },
  problem: {
    title: "Zwykły czat AI nie widzi Twojego systemu.",
    points: [
      "Nie ma dostępu do Twoich danych, więc wklejasz je ręcznie.",
      "Nie zna Twoich pól i procesów, więc za każdym razem musisz je tłumaczyć.",
      "Może tylko doradzić. Wynik ktoś musi jeszcze zbudować w systemie.",
    ],
    solution: "Po połączeniu z Opero agent widzi Twoje dane, zna Twoją konfigurację i sam buduje wynik.",
    demo: {
      manual: {
        label: "Agent bez Opero",
        messages: [
          { from: "you", text: "Które faktury Hotelu Panorama są zaległe?" },
          { from: "agent", text: "Nie mam dostępu do Twojego systemu. Czy możesz przesłać eksport?" },
          {
            from: "you",
            text: "Proszę.",
            files: [
              { name: "faktury_2026.csv", kind: "sheet" },
              { name: "platnosci_paz.xlsx", kind: "sheet" },
            ],
          },
          { from: "agent", text: "Ten plik jest za duży. Podziel go na mniejsze części." },
          {
            from: "you",
            text: "Trzy części.",
            files: [
              { name: "faktury_1.csv", kind: "sheet" },
              { name: "faktury_2.csv", kind: "sheet" },
              { name: "faktury_3.csv", kind: "sheet" },
            ],
          },
          { from: "agent", text: "Dziękuję! Która kolumna to termin płatności i jak oznaczone są opłacone faktury?" },
          {
            from: "you",
            text: "\"Termin\". Status Z oznacza opłaconą, zobacz zrzuty.",
            files: [
              { name: "formularz-faktury.png", kind: "image" },
              { name: "lista-statusow.png", kind: "image" },
            ],
          },
          { from: "agent", text: "Łączna zaległość to 62,40 zł." },
          { from: "you", text: "Tam jest 6 240,00. Sześć tysięcy." },
          { from: "agent", text: "Masz rację, przepraszam! Czy \"Hotel Panorama\" to ten sam klient co \"Panorama Sp. z o.o.\"?" },
          {
            from: "you",
            text: "Tak. Oto lista klientów.",
            files: [{ name: "kontrahenci.csv", kind: "sheet" }],
          },
          { from: "agent", text: "Dziękuję! Na podstawie eksportu z 28 paź 2 faktury wyglądają na zaległe. Dane mogły się zmienić, więc warto je sprawdzić." },
        ],
      },
      connected: {
        label: "Agent połączony z Opero",
        question: "Które faktury Hotelu Panorama są zaległe?",
        steps: ["Znalazł kontrahenta Hotel Panorama", "Odczytał jego faktury sprzedaży", "Porównał terminy z dzisiejszą datą"],
        answer: "2 faktury są zaległe.",
        rows: [
          { number: "FV/2026/1147", due: "Termin 28 paź", amount: "6 240 zł" },
          { number: "FV/2026/1069", due: "Termin 2 paź", amount: "12 180 zł" },
        ],
        total: { label: "Razem zaległe", amount: "18 420 zł" },
      },
    },
  },
  signature: {
    title: "Zobacz, jak rozmowa staje się działającą częścią systemu.",
    steps: [
      { title: "Pytasz", description: "„Na stronie kontrahenta dodaj panel z otwartymi zgłoszeniami, tymi po SLA i przyciskiem przypisania technika.”" },
      { title: "Odnajduje Twój system w Twoich słowach", description: "Kontrahent, zgłoszenie, blok, reguła przypisania. Twoje zdanie jest dopasowywane do tego, co naprawdę istnieje w Twoim Opero." },
      { title: "Buduje i sprawdza", description: "Zapytanie, HTML, style i reguła za przyciskiem powstają, są sprawdzane na prawdziwych danych i przechodzą walidację, zanim cokolwiek zostanie zapisane." },
      { title: "Działa", description: "Panel jest na stronie kontrahenta i pokazuje prawdziwe dane. Przycisk otwiera regułę z wypełnionymi już wartościami." },
    ],
    demo: {
      system: {
        label: "Dostępne funkcje",
        tiles: [
          { name: "Kontrahenci", match: true },
          { name: "Szanse sprzedaży" },
          { name: "Projekty" },
          { name: "Faktury" },
          { name: "Zgłoszenia", match: true },
          { name: "Umowy" },
          { name: "Zasoby" },
          { name: "Bloki", match: true },
          { name: "Dokumenty" },
          { name: "Formularze" },
          { name: "Raporty" },
          { name: "Reguły", match: true },
        ],
      },
      layers: ["Zapytanie", "Blok"],
      rule: {
        label: "Reguły",
        steps: [
          { title: "Wyzwalacz", detail: "Ręczne uruchomienie" },
          { title: "Przypisz technika", detail: "Ustaw przypisanych" },
          { title: "Powiadom technika", detail: "Wyślij powiadomienie" },
          { title: "Powiadom kierownika", detail: "Wyślij powiadomienie" },
        ],
        onError: "Przy błędzie",
      },
      page: {
        breadcrumb: "Kontrahenci",
        title: "Hotel Panorama",
        status: "Aktywny",
        fields: [
          { label: "NIP", value: "677-000-00-00" },
          { label: "Adres", value: "ul. Widokowa 12" },
          { label: "Miasto", value: "Kraków" },
          { label: "Opiekun", value: "Anna Nowak" },
          { label: "Termin płatności", value: "14 dni" },
          { label: "Limit kredytowy", value: "50 000 PLN" },
          { label: "Segment", value: "Hotelarstwo" },
          { label: "Osoba kontaktowa", value: "Piotr Wrona" },
          { label: "Klient od", value: "2021" },
        ],
        billing: {
          title: "Rozliczenia",
          fields: [
            { label: "Waluta", value: "PLN" },
            { label: "Forma płatności", value: "Przelew" },
            { label: "VAT", value: "Czynny podatnik" },
            { label: "Fakturowanie", value: "Miesięcznie" },
            { label: "Rabat", value: "5%" },
            { label: "Przypomnienia", value: "Po 7 dniach" },
          ],
        },
        notes: {
          title: "Notatki",
          text: "Wizyty serwisowe najlepiej umawiać przed 10:00. Klucze dostępowe wydaje recepcja.",
        },
      },
      block: {
        title: "Otwarte zgłoszenia",
        rows: [
          { number: "HD-2291", title: "Klimatyzacja, pokój 214", sla: "Po SLA", late: true },
          { number: "HD-2288", title: "Zaległy przegląd windy", sla: "Po SLA", late: true },
          { number: "HD-2276", title: "Czytnik kart, lobby", sla: "Zostały 3 godz." },
        ],
        summary: "2 po SLA",
        action: "Przypisz technika",
      },
      dialog: {
        title: "Uruchom regułę: przypisz technika",
        fields: [
          { label: "Zgłoszenie", value: "HD-2291" },
          { label: "Technik", value: "Marek Zieliński" },
        ],
        confirm: "Uruchom regułę",
      },
    },
    noteTitle: "Wszystko, co powstało, pozostaje dla Ciebie otwarte.",
    note: "Możesz to wszystko przeczytać i zmienić, tak samo jak wszystko inne w Opero. Nic nie jest czarną skrzynką.",
    cta: "Zobacz to na swoich danych",
  },
  acts: [
    {
      number: "01",
      title: "Pytaj o dane tak, jak zapytałbyś współpracownika.",
      description: "Agent AI czyta bieżące dane w Opero, ograniczone do tego, co widzi Twoja rola. Dostajesz prawdziwe nazwy, kwoty i daty z rekordów, a nie ogólne podsumowanie.",
      demo: {
        note: "Odczytane przed chwilą, z Twoimi uprawnieniami",
        tools: {
          blocks: "Bloki",
          catalog: "Katalog usług",
          comments: "Komentarze",
          companies: "Firmy",
          contractors: "Kontrahenci",
          cost_invoices: "Faktury kosztowe",
          custom_fields: "Pola własne",
          custom_lists: "Listy własne",
          custom_objects: "Obiekty własne",
          dictionaries: "Słowniki",
          documents: "Dokumenty",
          email_templates: "Szablony e-mail",
          emails: "E-maile",
          forms: "Formularze",
          layouts: "Układy",
          logs: "Logi",
          menus: "Menu",
          pages: "Strony",
          reports: "Raporty",
          rules: "Reguły",
          sales_invoices: "Faktury sprzedaży",
          saved_queries: "Zapisane zapytania",
          scripts: "Skrypty",
          sql_lists: "Listy SQL",
          tasks: "Zadania",
          themes: "Motywy",
          tickets: "Zgłoszenia",
          workflows: "Workflow",
        },
        questions: [
          {
            question: "Czy obiecamy piekarni spod Tarnowa nowy piec na piątek?",
            reply: "Tak: ekipa jest wolna we wtorek, a montaż trwa 3 dni. Ale Piekarnia Orzech zalega z 2 fakturami, więc najpierw zapytaj księgowość.",
            clues: [
              { words: "piekarni spod Tarnowa", tries: ["companies", "custom_lists", "dictionaries"], tool: "contractors", result: "Piekarnia Orzech" },
              { words: "nowy piec", tries: ["custom_objects", "documents", "forms"], tool: "catalog", result: "Montaż trwa 3 dni" },
              { words: "na piątek", tries: ["workflows", "comments", "tickets"], tool: "tasks", result: "Ekipa wolna we wtorek" },
              { words: "obiecamy", tries: ["reports", "saved_queries", "cost_invoices"], tool: "sales_invoices", result: "2 faktury zaległe" },
            ],
          },
          {
            question: "Czemu Hotel Panorama nie płaci od marcowej wizyty?",
            reply: "Na wizycie obiecaliśmy darmową naprawę, a potem ją zafakturowaliśmy. Od tego czasu nie płacą, więc korekta powinna to rozwiązać.",
            clues: [
              { words: "Hotel Panorama", tries: ["companies", "dictionaries", "custom_objects"], tool: "contractors", result: "Klient znaleziony" },
              { words: "nie płaci", tries: ["cost_invoices", "reports", "saved_queries"], tool: "sales_invoices", result: "Nieopłacone od marca" },
              { words: "marcowej wizyty", tries: ["workflows", "documents", "custom_lists"], tool: "tasks", result: "Wizyta 14 marca" },
              { words: "Czemu", tries: ["comments", "tickets", "email_templates"], tool: "emails", result: "Obiecana darmowa naprawa" },
            ],
          },
          {
            question: "Kto pewnie odejdzie w tym kwartale i dlaczego?",
            reply: "Auto Serwis Nowak. Zamówienia spadły o jedną trzecią, umowa kończy się za miesiąc, pytali o wypowiedzenie, a 2 reklamacje są otwarte.",
            clues: [
              { words: "pewnie", tries: ["saved_queries", "sales_invoices", "contractors"], tool: "reports", result: "9 zamawia mniej" },
              { words: "w tym kwartale", tries: ["documents", "custom_fields", "custom_lists"], tool: "custom_objects", result: "3 umowy się kończą" },
              { words: "odejdzie", tries: ["email_templates", "comments", "tasks"], tool: "emails", result: "1 pyta o wypowiedzenie" },
              { words: "dlaczego", tries: ["workflows", "forms", "logs"], tool: "tickets", result: "2 otwarte reklamacje" },
            ],
          },
        ],
      },
    },
    {
      number: "02",
      title: "Opisz zmianę. Agent skonfiguruje za Ciebie platformę.",
      description: "Obiekty, pola, formularze, układy, reguły, workflow, bloki i strony. Agent AI stosuje zasady platformy i waliduje każdą zmianę, więc oceniasz gotowy wynik, a nie szkic.",
      configure: {
        mcp: "Opero MCP",
        asset: {
          title: "Piec konwekcyjny",
          fields: [
            { label: "Numer seryjny", value: "RX-2291" },
            { label: "Status", value: "W użyciu" },
            { label: "Lokalizacja", value: "Piekarnia w Tarnowie" },
            { label: "Data zakupu", value: "12 mar 2025" },
          ],
          added: { label: "Koniec gwarancji", value: "Jeszcze nie ustawiono" },
        },
        ticket: {
          title: "Awaria chłodni",
          fields: [
            { label: "Klient", value: "Hotel Panorama" },
            { label: "Status", value: "Nowe" },
            { label: "Przypisane do", value: "Zespół serwisu" },
          ],
          moved: { label: "Priorytet", value: "Wysoki" },
        },
        invoices: {
          title: "Faktury sprzedaży",
          columns: ["Numer", "Klient", "Kwota"],
          added: "Dni po terminie",
          rows: [
            { cells: ["FV/114", "Hotel Panorama", "4 200 zł"], overdue: "12" },
            { cells: ["FV/118", "Piekarnia Orzech", "8 950 zł"], overdue: "3" },
            { cells: ["FV/121", "Auto Serwis Nowak", "2 300 zł"], overdue: "0" },
          ],
        },
        requests: [
          { request: "Dodaj do Zasobów datę końca gwarancji i pokaż ją na formularzu", steps: ["Dodaje Koniec gwarancji do Zasobów", "Umieszcza go na formularzu"] },
          { request: "Przenieś Priorytet na górę formularza zgłoszenia i ustaw jako wymagany", steps: ["Przenosi Priorytet na górę", "Oznacza go jako wymagany"] },
          { request: "Dodaj do listy faktur kolumnę z dniami po terminie", steps: ["Dodaje nową kolumnę", "Wylicza ją z terminów płatności"] },
        ],
      },
    },
  ],
  connect: {
    title: "Trzy kroki i rozmawiasz ze swoim systemem.",
    steps: [
      { title: "Połącz agenta z Opero", description: "Dodaj Opero do Claude lub innego agenta obsługującego MCP. Dostęp przez MCP to opcjonalny moduł licencji." },
      { title: "Zaloguj się jako Ty", description: "Połączenie działa w Twoim imieniu, dokładnie z uprawnieniami Twojej roli. Wymagania MFA i SSO nadal obowiązują." },
      { title: "Powiedz, czego potrzebujesz", description: "Agent AI czyta konfigurację i bieżące dane, a potem buduje to, co opiszesz." },
    ],
    demo: {
      agent: "Twój agent",
      opero: "Opero",
      add: { title: "Dodaj połączenie", detail: "Łączy się przez MCP", button: "Dodaj" },
      signIn: { title: "Zaloguj się do Opero", initials: "MW", name: "Marta W.", note: "Z uprawnieniami Twojej roli", button: "Zezwól" },
      done: { title: "Połączono", placeholder: "Powiedz, czego potrzebujesz" },
    },
  },
  trust: {
    title: "Działa, bo wie, gdzie jest.",
    items: [
      { title: "Zna Twój model", description: "Obiekty, pola, relacje, formularze i reguły Twojego systemu, a nie ogólną wiedzę o oprogramowaniu." },
      { title: "Sprawdza przed zapisem", description: "Zmiany są najpierw walidowane, a zmiana bloku, która zepsułaby używającą go stronę, zostaje odrzucona." },
      { title: "Szanuje uprawnienia", description: "Widzi i zmienia dokładnie to, na co pozwala Twoja rola. Te same granice co przy klikaniu w Opero.", securityLink: "Jak Opero podchodzi do uprawnień" },
      { title: "Możesz to edytować", description: "To, co zbuduje, jest zwykłą konfiguracją Opero, którą możesz otworzyć i dostosować." },
    ],
  },
  proof: {
    title: "Sami korzystamy z Opero MCP i bardzo to lubimy.",
    description: "Połączenie opisane na tej stronie to nie plan na przyszłość ani eksperyment. Tak w KodaSoft pracujemy z Opero.",
  },
  prompts: {
    title: "Jeśli potrafisz to powiedzieć, możesz o to poprosić.",
    groups: [
      {
        title: "Dowiedz się czegoś",
        items: ["Kto nie zapłacił nam w tym miesiącu?", "Do których klientów nie odzywaliśmy się od 30 dni?", "Ile zafakturowaliśmy w zeszłym kwartale?", "Co jest jeszcze otwarte dla Hotelu Panorama?"],
      },
      {
        title: "Zmień to, co widzisz",
        items: ["Pokaż 5 ostatnich faktur na stronie klienta", "Dodaj datę gwarancji do naszych zasobów", "Oznacz umowy, które zaraz się kończą", "Przenieś Priorytet na górę formularza"],
      },
      {
        title: "Przestań robić to ręcznie",
        items: ["Daj mi znać, gdy transakcja przekroczy 50 000 zł", "Przypominaj klientom o terminie faktury", "Wysyłaj krytyczne zgłoszenia do osoby na dyżurze", "Proś o akceptację zakupów powyżej 5 000 zł"],
      },
      {
        title: "Zobacz całość",
        items: ["Zrób stronę startową dla zespołu serwisu", "Daj mi tygodniowy przegląd nowych zamówień", "Porównaj tegoroczną sprzedaż z zeszłoroczną", "Pokaż, kto ma najwięcej otwartych zgłoszeń"],
      },
    ],
  },
  faq: {
    title: "Najczęściej zadawane pytania.",
    items: [
      { question: "Czy z AI rozmawiam wewnątrz Opero?", answer: "Nie. Łączysz z Opero Claude lub innego agenta MCP. Rozmowa toczy się w agencie, a to, co powstanie, zostaje w Opero, gdzie zespół korzysta z tego bez otwierania czatu." },
      { question: "Którzy agenci AI współpracują z Opero?", answer: "Każdy agent obsługujący MCP, na przykład Claude." },
      { question: "Jaki model AI jest używany i gdzie przetwarzane są moje dane?", answer: "To Twój wybór. Opero udostępnia połączenie MCP, a Ty decydujesz, jakiego agenta i modelu z nim używasz. Dane odczytane przez agenta są przetwarzane tam, gdzie działa wybrany przez Ciebie agent." },
      { question: "Kto może z tego korzystać?", answer: "Dostęp przez MCP to opcjonalny moduł licencji. Z nim każdy użytkownik może połączyć agenta i pytać o bieżące dane, w granicach swoich uprawnień. Budowanie konfiguracji jest dla konsultantów, administratorów i użytkowników z licencją administracyjną." },
      { question: "Czy AI widzi dane, których nie widzi moja rola?", answer: "Nie. Połączenie działa jako zalogowany użytkownik, dokładnie z jego uprawnieniami, w organizacjach, do których należy." },
      { question: "Czy może zepsuć moją konfigurację?", answer: "Zmiany są walidowane przed zapisem, a układy przechodzą przez wersję roboczą i świadomą publikację. Zmiana bloku, która zepsułaby używającą go stronę, zostaje odrzucona. Zapisana zmiana bloku działa od razu na wszystkich stronach, które go używają, dlatego sprawdzaj zmiany bloków przed zapisem." },
      { question: "Czy mogę edytować to, co zbudował?", answer: "Tak. To zwykła konfiguracja Opero. Blok to HTML, CSS i zapytania, które możesz otworzyć i zmienić samodzielnie albo poprosić o to agenta." },
      { question: "Czy muszę umieć programować?", answer: "Nie. Opisujesz zwykłymi słowami, czego potrzebujesz. Programiści mogą pójść dalej i edytować kod bezpośrednio." },
    ],
  },
  related: {
    title: "Zobacz też",
    items: [
      { feature: "noCode", title: "Platforma no-code", description: "Obiekty, formularze i strony, które konfiguruje dla Ciebie agent AI." },
      { feature: "lowCode", title: "Low-code i automatyzacja", description: "Reguły, skrypty i zapytania SQL stojące za bardziej zaawansowaną logiką." },
      { feature: "reports", title: "Raporty i pulpity", description: "Tabele przestawne i wykresy z analizą szczegółów, osadzone na stronie." },
    ],
  },
  finalCta: {
    title: "Powiedz nam, czego brakuje Ci w systemie.",
    description: "Przynieś panel, którego Ci brakuje, regułę stosowaną dziś ręcznie albo raport, który co miesiąc składasz od nowa. Podczas prezentacji zbudujemy to na Twoich oczach.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Skontaktuj się z nami",
  },
  seoText: {
    title: "AI, które pracuje w Twoim systemie firmowym.",
    paragraphs: [
      "Kontekstowe AI w Opero to agent AI pracujący na strukturze i danych Twojego systemu. Łączysz z Opero Claude lub innego agenta MCP i logujesz się jako Ty. Od tej chwili agent zna Twoje obiekty, pola, formularze i reguły, a działa w granicach Twoich uprawnień. To Ty wybierasz agenta i model, więc decydujesz też, gdzie przetwarzane są Twoje dane.",
      "Konsultanci i administratorzy konfigurują z nim platformę w rozmowie: obiekty, formularze, układy, reguły, workflow, bloki i strony, a każda zmiana jest walidowana przed zapisem. Blok to fragment HTML z własnymi zapytaniami, umieszczany na stronach rekordów i stronach własnych. Pobiera aktualne dane przy każdym wyświetleniu strony i może odświeżać się co określony czas albo na żywo.",
      "Każdy, kto ma moduł MCP, może też pytać agenta o bieżące dane, w granicach swojej roli. To, co powstanie, zostaje w Opero jako zwykła konfiguracja, a reszta zespołu korzysta z tego na co dzień bez otwierania czatu.",
    ],
  },
};
