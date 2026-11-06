import { polish } from "./polish";

/**
 * The System section: one entry per area of Opero.
 *
 * The facts come from the feature pages of the current site (what each part
 * of the product actually does), rewritten in the vocabulary of the November
 * positioning: modules, stages, rules, foundation, control - never "low-code",
 * "BPM", "workflow" or "EOD" in the visible copy. Every area opens with what
 * changes in the organisation, not with what the feature is called.
 *
 * `showcase` picks the interactive scene the page is built around; the four
 * big ones are shared with the home page, the rest are product cards drawn
 * for their own page.
 */

export type Showcase =
  | "build"
  | "process"
  | "documents"
  | "rules"
  | "integrations"
  | "reports"
  | "ai"
  | "control"
  | "apps";

export type SystemArea = {
  slug: string;
  nav: string;
  blurb: string;
  title: [string, string];
  lead: string;
  showcase: Showcase;
  /** What the situation is today, and what it becomes with Opero. */
  outcomes: Array<{ before: string; after: string }>;
  elements: Array<{ title: string; text: string }>;
  faq: Array<{ q: string; a: string }>;
  related: string[];
};

export const systemAreas: SystemArea[] = polish([
  {
    slug: "moduly",
    nav: "Własne moduły",
    blurb: "Pola, formularze i widoki dla tego, co działa u Was inaczej",
    title: ["Aplikacja dla Waszego obszaru,", "zbudowana w konfiguracji."],
    lead: "Moduł składa się z pól, formularzy, układów ekranów, menu i pulpitów. Opero zapewnia raz to, co każda aplikacja biznesowa ma wspólne: dane, uprawnienia, pliki i historię. Do ułożenia zostaje to, co jest naprawdę Wasze.",
    showcase: "build",
    outcomes: [
      {
        before: "Nowy rejestr to projekt programistyczny: wymagania, wycena, kilka tygodni czekania.",
        after: "Administrator dodaje obiekt, pola i formularz, a pierwszą wersję widać od razu na ekranie.",
      },
      {
        before: "System nazywa rzeczy po swojemu i zespół przepisuje dane do arkusza obok.",
        after: "Moduł mówi językiem firmy: wniosek o zakup jest wnioskiem o zakup, a nie „zgłoszeniem typu 3”.",
      },
      {
        before: "Po roku nikt nie pamięta, jak zbudowano formularz, i boi się go ruszyć.",
        after: "Każdy element ma czytelną strukturę, a zmiana przechodzi przez wersję roboczą, walidację i publikację.",
      },
    ],
    elements: [
      { title: "Obiekty i pola", text: "Własne obiekty z polami, relacjami i numeracją opisują dane firmy tak, jak ona je nazywa." },
      { title: "Formularze i układy", text: "Inny widok dla wnioskującego, inny dla akceptującego, inny dla zarządu, na tych samych danych." },
      { title: "Lista, tablica, kalendarz", text: "Te same rekordy oglądane na trzy sposoby, bez budowania osobnych ekranów." },
      { title: "Menu i pulpity", text: "Każdy zespół zaczyna dzień od tego, co dla niego ważne." },
      { title: "Wersja robocza i publikacja", text: "Zmiany powstają obok działającego systemu i wchodzą dopiero po walidacji." },
    ],
    faq: [
      { q: "Czy zbudowanie modułu wymaga programisty?", a: "Nie. Obiekty, pola, formularze i widoki układa się w konfiguracji. Skrypty i zapytania SQL są dostępne dopiero tam, gdzie konfiguracja przestaje wystarczać." },
      { q: "Co się dzieje z modułem, kiedy firma się zmieni?", a: "Zmienia się go w tym samym miejscu, w którym powstał. Nowe pole czy inny układ formularza to konfiguracja, nie wdrożenie." },
    ],
    related: ["procesy", "reguly", "raporty"],
  },
  {
    slug: "procesy",
    nav: "Procesy i etapy",
    blurb: "Etapy, przejścia, zadania i terminy dla każdej sprawy",
    title: ["Każda sprawa wie,", "na jakim jest etapie."],
    lead: "Proces przypina się do dowolnego modułu: umowy, wniosku, zgłoszenia. Sprawa przechodzi przez etapy, każdy etap otwiera zadanie dla właściwej osoby, a system pilnuje kolejności, uprawnień i terminów.",
    showcase: "process",
    outcomes: [
      {
        before: "Akceptacja wisi w czyjejś skrzynce i nikt nie wie, że czeka.",
        after: "Etap ma właściciela i termin. Zadanie czeka na liście tej osoby, a przełożony widzi opóźnienie.",
      },
      {
        before: "Przy nieobecności pracownika historia sprawy jest niedostępna.",
        after: "Cały przebieg zostaje przy sprawie: kto, co i kiedy zrobił, krok po kroku.",
      },
      {
        before: "Ścieżka zależy od tego, kto pamięta procedurę.",
        after: "Warunki na przejściach prowadzą sprawę właściwą drogą, na przykład zależnie od kwoty.",
      },
      {
        before: "Zmiana procedury to miesiące rozmów z dostawcą.",
        after: "Nowy etap w procesie to konfiguracja na tygodnie, nie wdrożenie na kwartały.",
      },
    ],
    elements: [
      { title: "Etapy i przejścia", text: "Obieg zapisany jako etapy połączone przejściami, z warunkami i uprawnieniami na każdym kroku." },
      { title: "Zadania i tablica", text: "Wejście na etap otwiera zadanie przypisane osobie albo roli, widoczne na liście i na tablicy." },
      { title: "Formularze na etapach", text: "Na każdym etapie decydujecie, co użytkownik widzi i może zmienić." },
      { title: "Terminy i przypomnienia", text: "Etap ma czas na wykonanie, a reguła przypomina, zanim termin minie." },
      { title: "Historia przebiegu", text: "Pełny ślad zmian i możliwość prześledzenia sprawy od początku do końca." },
    ],
    faq: [
      { q: "Do czego można przypiąć proces?", a: "Do dowolnego modułu: umowy, wniosku, zgłoszenia, faktury. Obiegiem obejmujecie dokładnie te dane, które macie." },
      { q: "Czy proces da się zmienić w trakcie pracy?", a: "Tak. Zmiana przechodzi przez wersję roboczą i publikację, a sprawy w toku zachowują swoją historię." },
    ],
    related: ["dokumenty", "reguly", "kontrola"],
  },
  {
    slug: "dokumenty",
    nav: "Dokumenty",
    blurb: "Obieg, wersje plików i szablony przy każdej sprawie",
    title: ["Dokument jest sprawą,", "nie plikiem na dysku."],
    lead: "Pismo, faktura czy umowa ma w Opero swoją kartotekę, ścieżkę akceptacji i komplet plików z wersjami. Szablony tworzą dokumenty wprost z danych sprawy, zawsze w aktualnej wersji.",
    showcase: "documents",
    outcomes: [
      {
        before: "Aktualna wersja umowy jest gdzieś w wątku mailowym.",
        after: "Pliki leżą przy sprawie, z wersjami. Aktualna jest oznaczona, poprzednie zostają w historii.",
      },
      {
        before: "Pismo przepisuje się ręcznie z danych, które już są w systemie.",
        after: "Szablon ze zmiennymi wypełnia się danymi sprawy i daje gotowy dokument.",
      },
      {
        before: "Nie wiadomo, kto ma dokument na biurku.",
        after: "Dokument przechodzi przez etapy obiegu, a jego miejsce w procesie widać od razu.",
      },
    ],
    elements: [
      { title: "Rejestracja i numeracja", text: "Każdy typ dokumentu to moduł z polami, numeracją i kartoteką." },
      { title: "Obieg akceptacji", text: "Dekretacja, opinie, zatwierdzenie i archiwizacja jako etapy procesu." },
      { title: "Pliki i wersje", text: "Załączniki przy rekordzie, wersjonowane, przeszukiwalne i chronione uprawnieniami." },
      { title: "Szablony dokumentów", text: "Umowy, pisma i decyzje generowane z danych sprawy według wzorców ze zmiennymi." },
    ],
    faq: [
      { q: "Czy dokumenty można generować automatycznie?", a: "Tak. Szablon łączy stałą treść ze zmiennymi z rekordu i tworzy gotowe pismo albo umowę." },
      { q: "Kto widzi pliki przy sprawie?", a: "Ci, którzy mają do niej uprawnienia. Dostęp do plików wynika z tej samej roli, co dostęp do danych." },
    ],
    related: ["procesy", "integracje", "kontrola"],
  },
  {
    slug: "reguly",
    nav: "Reguły i automatyzacje",
    blurb: "Warunek i kroki, które wykonują się same",
    title: ["Powtarzalna praca", "wykonuje się sama."],
    lead: "Reguła działa według zasady: gdy zajdzie warunek, wykonaj kroki. Ustawia pole, tworzy rekord, wysyła powiadomienie albo blokuje przejście. Reguły testuje się przed włączeniem, więc automatyzacja jest przewidywalna.",
    showcase: "rules",
    outcomes: [
      {
        before: "Ktoś musi pamiętać, że umowa powyżej progu idzie do dyrektora finansowego.",
        after: "Reguła sprawdza wartość i sama dodaje etap akceptacji z właściwą osobą.",
      },
      {
        before: "Zespół ręcznie przypomina o terminach.",
        after: "Trzydzieści dni przed końcem umowy właściciel dostaje zadanie. Nikt nie musiał o tym pamiętać.",
      },
    ],
    elements: [
      { title: "Warunek i kroki", text: "Warunki składane z pól i zdarzeń, a po nich sekwencja akcji." },
      { title: "Powiadomienia", text: "Wiadomość do osoby albo roli w chwili, gdy coś się wydarzy." },
      { title: "Blokady przejść", text: "Sprawa nie przejdzie dalej, dopóki nie spełni warunku." },
      { title: "Skrypty i zapytania SQL", text: "Dla scenariuszy poza konfiguracją: nazwane, parametryzowane, wielokrotnego użytku." },
      { title: "Test przed włączeniem", text: "Regułę sprawdza się na danych, zanim zacznie działać na produkcji." },
    ],
    faq: [
      { q: "Czy automatyzacje wymagają programisty?", a: "Reguły układa się w konfiguracji. Skrypty i SQL są opcjonalne i przydają się przy bardziej złożonej logice." },
      { q: "Co się stanie, jeśli reguła zadziała źle?", a: "Każde jej działanie zostaje w rejestrze zdarzeń, a regułę testuje się przed włączeniem." },
    ],
    related: ["procesy", "integracje", "ai"],
  },
  {
    slug: "integracje",
    nav: "Integracje i zgodność",
    blurb: "KSeF, e-Doręczenia, kursy NBP, weryfikacja VAT, otwarte API",
    title: ["Wymogi państwa i Wasze systemy", "w jednym obiegu danych."],
    lead: "Faktury z KSeF, korespondencja przez e-Doręczenia, kursy walut NBP i weryfikacja kontrahenta działają wprost z systemu. Otwarte API wymienia dane z resztą narzędzi firmy w obie strony.",
    showcase: "integrations",
    outcomes: [
      {
        before: "Faktura z KSeF jest przepisywana ręcznie do obiegu akceptacji.",
        after: "Dokument z KSeF staje się rekordem, a pola wypełniają się bez przepisywania.",
      },
      {
        before: "Status VAT kontrahenta sprawdza się na stronie ministerstwa, kiedy ktoś pamięta.",
        after: "Weryfikacja na białej liście i w VIES odbywa się przy kontrahencie, zanim powstanie dokument.",
      },
      {
        before: "Opero byłoby kolejną wyspą danych.",
        after: "Otwarte API i powiadomienia o zmianach łączą je z ERP i pozostałymi systemami.",
      },
    ],
    elements: [
      { title: "KSeF", text: "Wysyłka i odbiór faktur ustrukturyzowanych zgodnie z obowiązkowym e-fakturowaniem." },
      { title: "e-Doręczenia", text: "Elektroniczna korespondencja urzędowa, odpowiednik listu poleconego, wprost z systemu." },
      { title: "Kursy walut NBP", text: "Automatyczne kursy z Tabeli A do przeliczeń, z obsługą dni wolnych." },
      { title: "Weryfikacja VAT", text: "Biała lista i VIES przy kontrahencie, zanim wystawicie dokument." },
      { title: "Otwarte API", text: "Wymiana danych w obie strony: zapis rekordów i powiadomienia o zmianach statusu." },
    ],
    faq: [
      { q: "Czy Opero obsługuje KSeF?", a: "Tak. Opero integruje się z Krajowym Systemem e-Faktur i obsługuje wysyłkę oraz odbiór faktur ustrukturyzowanych." },
      { q: "Czy Opero zastępuje ERP?", a: "Nie. Opero nie jest systemem ERP ani księgowym. Prowadzi procesy, dokumenty i dane wokół nich i wymienia dane z ERP przez API." },
    ],
    related: ["dokumenty", "reguly", "aplikacje"],
  },
  {
    slug: "raporty",
    nav: "Raporty i pulpity",
    blurb: "Od liczby na pulpicie do pojedynczej sprawy",
    title: ["Od liczby do sprawy,", "która się na nią składa."],
    lead: "Raporty powstają na żywych danych systemu: grupowania, wskaźniki i wykresy bez eksportu do arkusza. Klikając wartość, schodzi się do rekordów, które ją tworzą, więc każdą liczbę można sprawdzić u źródła.",
    showcase: "reports",
    outcomes: [
      {
        before: "Zestawienie dla zarządu powstaje raz w miesiącu w arkuszu, przepisane ręcznie.",
        after: "Pulpit pokazuje bieżący stan, a każda wartość prowadzi do spraw, z których powstała.",
      },
      {
        before: "Pomyłka w przepisaniu staje się podstawą decyzji.",
        after: "Raport czyta te same dane, na których pracuje proces. Nie ma czego przepisywać.",
      },
    ],
    elements: [
      { title: "Raporty", text: "Grupowania, agregacje i wskaźniki na danych modułów, z drążeniem do rekordów." },
      { title: "Wykresy", text: "Trendy i rozkłady wprost w raporcie, czytelne dla zarządu." },
      { title: "Pulpity", text: "Kafelki z najważniejszymi wskaźnikami, osobne dla każdego zespołu." },
      { title: "Zapytania SQL jako źródło", text: "Parametryzowane zapytania tam, gdzie zwykłe filtry nie wystarczają." },
    ],
    faq: [
      { q: "Czy raporty pokazują aktualne dane?", a: "Tak. Raporty i pulpity działają na żywych danych systemu, bez ręcznego odświeżania." },
      { q: "Czym jest drążenie danych?", a: "Przejściem od wartości zbiorczej do rekordów, które ją tworzą. Klikasz liczbę i widzisz konkretne sprawy." },
    ],
    related: ["moduly", "procesy", "ai"],
  },
  {
    slug: "ai",
    nav: "AI w ramach",
    blurb: "Asystent na tych samych elementach i uprawnieniach",
    title: ["Asystent, który zna", "Wasz system."],
    lead: "Asystent zna strukturę i dane Waszej instancji. Pomaga budować moduły, reguły i procesy, odpowiada na pytania o dane językiem naturalnym. Działa wyłącznie w ramach wyznaczonych przez ludzi.",
    showcase: "ai",
    outcomes: [
      {
        before: "Aplikacja zbudowana z AI działa u jednej osoby i nikt nie wie, co robi z danymi.",
        after: "AI pracuje na tych samych elementach co administrator, z walidacją przed zapisem.",
      },
      {
        before: "Żeby odpowiedzieć na pytanie o dane, trzeba przeklikać trzy widoki.",
        after: "Pytanie zadaje się zwykłym zdaniem, a asystent widzi tylko to, co rola pytającego.",
      },
    ],
    elements: [
      { title: "AI przy budowie", text: "Moduły, formularze, reguły i procesy tworzone w rozmowie z asystentem, z walidacją przed zapisem." },
      { title: "AI przy pracy z danymi", text: "Pytania o dane, wyszukiwanie rekordów i podsumowania spraw." },
      { title: "Te same uprawnienia", text: "Asystent widzi dokładnie tyle, ile rola użytkownika, który go używa." },
      { title: "Człowiek zatwierdza", text: "Zmiana zaproponowana przez AI wchodzi dopiero po akceptacji administratora." },
    ],
    faq: [
      { q: "Czy AI może zmienić system bez wiedzy administratora?", a: "Nie. Asystent proponuje zmianę, przechodzi ona walidację, a wprowadza ją człowiek." },
      { q: "Skąd AI zna nasz system?", a: "Łączy się z konfiguracją i danymi Waszej instancji przez kontrolowany mechanizm, z uprawnieniami użytkownika, który pyta." },
    ],
    related: ["kontrola", "moduly", "reguly"],
  },
  {
    slug: "kontrola",
    nav: "Bezpieczeństwo i kontrola",
    blurb: "Role, uprawnienia do pól, MFA, SSO, rejestr zdarzeń",
    title: ["Każdy widzi tyle,", "ile powinien."],
    lead: "Dostęp układa się od organizacji i spółek, przez role, po pojedyncze pole. Logowanie z MFA i SSO, tokeny API z własnym zakresem i rejestr zdarzeń dają kontrolę, której oczekuje dział IT.",
    showcase: "control",
    outcomes: [
      {
        before: "Arkusz z wynagrodzeniami krąży mailem, bo nie da się ukryć jednej kolumny.",
        after: "Uprawnienia sięgają pola: asystent widzi sprawę, ale nie widzi jej wartości.",
      },
      {
        before: "Grupa spółek ma osobne systemy, żeby dane się nie mieszały.",
        after: "Jedna konfiguracja, osobne dane każdej spółki.",
      },
      {
        before: "Po incydencie nie wiadomo, kto co zmienił.",
        after: "Rejestr zdarzeń zapisuje każdą zmianę: kto, co i kiedy.",
      },
    ],
    elements: [
      { title: "Role i członkowie", text: "Zmiana uprawnień roli obejmuje od razu wszystkich, którzy do niej należą." },
      { title: "Uprawnienia do pól", text: "Widoczność i edycja na poziomie modułu, obiektu i pojedynczego pola." },
      { title: "Spółki w jednej organizacji", text: "Wspólna konfiguracja, odseparowane dane każdej firmy w grupie." },
      { title: "MFA i SSO", text: "Logowanie wieloskładnikowe i przez dostawcę tożsamości firmy." },
      { title: "Tokeny API", text: "Dostęp dla integracji z określonym zakresem, niezależny od kont ludzi." },
      { title: "Dedykowana instancja", text: "System może działać na osobnej instancji dla organizacji." },
    ],
    faq: [
      { q: "Jak działają uprawnienia w Opero?", a: "Dostęp nadaje się przez role, a te określają widoczność i edycję modułu, obiektu i pola. Można go też ograniczać w ramach spółek." },
      { q: "Czy uprawnienia obowiązują także AI?", a: "Tak. Asystent widzi i zmienia dokładnie tyle, ile rola użytkownika, który z niego korzysta." },
    ],
    related: ["ai", "procesy", "integracje"],
  },
  {
    slug: "aplikacje",
    nav: "Gotowe aplikacje",
    blurb: "Faktury z KSeF, kontrahenci, e-Doręczenia, zgłoszenia, czas pracy",
    title: ["Gotowe tam,", "gdzie błąd kosztuje najwięcej."],
    lead: "Część pracy wygląda tak samo w każdej firmie i nie ma sensu budować jej od nowa. Opero ma dla niej gotowe aplikacje, połączone z usługami państwowymi. Wszystko, co działa u Was inaczej, powstaje obok jako własne moduły.",
    showcase: "apps",
    outcomes: [
      {
        before: "Obowiązkowe e-fakturowanie wymaga osobnego narzędzia.",
        after: "Faktury z KSeF wchodzą do tego samego systemu, w którym przechodzą akceptację.",
      },
      {
        before: "Każda aplikacja ma własne konta, uprawnienia i historię.",
        after: "Gotowe aplikacje i własne moduły mają jedne uprawnienia i jedną historię spraw.",
      },
    ],
    elements: [
      { title: "Faktury z KSeF", text: "Odbiór i wysyłka faktur ustrukturyzowanych z obiegiem akceptacji." },
      { title: "Kontrahenci z weryfikacją VAT", text: "Kartoteka kontrahentów ze statusem z białej listy i VIES." },
      { title: "e-Doręczenia", text: "Korespondencja urzędowa wysyłana i odbierana w systemie." },
      { title: "Obsługa zgłoszeń", text: "Przyjęcie, przypisanie, etapy i termin dla każdego zgłoszenia." },
      { title: "Ewidencja czasu", text: "Czas pracy rejestrowany przy sprawach i projektach." },
    ],
    faq: [
      { q: "Czy gotowe aplikacje można dopasować?", a: "Tak. Są zbudowane z tych samych elementów co własne moduły, więc pola, etapy i reguły można zmieniać." },
      { q: "Czy Opero zastępuje system księgowy?", a: "Nie. Opero nie jest systemem księgowym ani ERP. Prowadzi obieg dokumentów i spraw wokół nich." },
    ],
    related: ["integracje", "moduly", "dokumenty"],
  },
]);

export const systemArea = (slug: string) => systemAreas.find((area) => area.slug === slug);
