import type { ScreenName } from "./Screen";
import { polish } from "./polish";

/**
 * Every area of Opero as a landing page of its own.
 *
 * People arrive on these pages from a search: "system DMS", "obieg
 * dokumentów", "system workflow", "platforma no-code". So each page answers
 * its own search first - the phrase is in the title, the description, the
 * headline and the long text at the bottom - and then makes the case for
 * Opero in its own way. The slugs are the ones the current site already
 * ranks with, so the move to the new site keeps what search has learned.
 *
 * What the pages share is only the frame: a graphite banner with a real
 * screen, the questions, the closing call. Between them every page has its
 * own order and its own kinds of sections, chosen for what that subject is
 * best shown with: a document's life as tabs, a stage's settings as rows, an
 * automation as if/then cards, permissions as a marked-up screen. Every
 * screen is from the demonstration organisation Demo Firma.
 */

type Tab = { label: string; title: string; text: string; screen: ScreenName };
type Row = { title: string; text: string; screen: ScreenName; caption?: string };
type Pin = { x: number; y: number; title: string; text: string };
type Card = { title: string; text: string; when?: string };

export type LandingSection =
  /** The step-by-step story on a screen that holds still (content-stories). */
  | { kind: "story" }
  /** The animated scene of the area, shared with the home page. */
  | { kind: "showcase" }
  /** Today and with Opero, side by side. */
  | { kind: "outcomes" }
  | { kind: "cards"; title: [string, string]; lead?: string; style: "cards" | "ifThen" | "tiles"; items: Card[] }
  | { kind: "tabs"; title: [string, string]; lead?: string; tabs: Tab[] }
  | { kind: "rows"; title: [string, string]; lead?: string; rows: Row[] }
  | { kind: "pins"; title: [string, string]; lead?: string; screen: ScreenName; pins: Pin[] }
  | { kind: "compare"; title: [string, string]; columns: [string, string]; rows: Array<{ label: string; before: string; after: string }> }
  | { kind: "statement"; text: string; note?: string }
  | { kind: "article"; title: string; sections: Array<{ heading?: string; paragraphs: string[] }> };

export type Landing = {
  seo: { title: string; description: string };
  hero: { layout: "split" | "stage"; title: [string, string]; lead: string; screen: ScreenName; caption: string };
  /** Sections between the banner and the questions. Their tones alternate from the banner. */
  sections: LandingSection[];
};

export const landings: Record<string, Landing> = polish({
  "eod-dms": {
    seo: {
      title: "System DMS i elektroniczny obieg dokumentów (EOD) · Opero",
      description:
        "System DMS w Opero: rejestracja, dekretacja, obieg akceptacji i archiwum dokumentów. Pisma, faktury i umowy jako sprawy z historią, wersjami plików i szablonami.",
    },
    hero: {
      layout: "stage",
      title: ["System DMS, w którym dokument", "jest sprawą, a nie plikiem."],
      lead: "Elektroniczny obieg dokumentów od wpływu do archiwum: rejestracja z numerem, dekretacja na dział, akceptacje na etapach, pliki z wersjami i dokumenty tworzone z szablonów. Wszystko przy jednej sprawie, w jednym systemie.",
      screen: "karta-pisma",
      caption: "Pismo przychodzące KAN/2026/00013 w Demo Firma: numer kancelaryjny, etap obiegu, kanał wpływu, nadawca z bazy kontrahentów.",
    },
    sections: [
      {
        kind: "cards",
        style: "cards",
        title: ["Jeden DMS", "na wszystkie dokumenty firmy."],
        lead: "Każdy rodzaj dokumentu ma w Opero swój rejestr, numerację i obieg. Wspólne zostają kontrahenci, uprawnienia, historia i wyszukiwanie.",
        items: [
          { title: "Korespondencja przychodząca", text: "Pisma z poczty, e-maila, ePUAP i e-Doręczeń rejestrowane w kancelarii, z terminem odpowiedzi." },
          { title: "Faktury kosztowe", text: "Opis, dekretacja na centrum kosztów i akceptacja, z fakturami pobieranymi z KSeF." },
          { title: "Umowy", text: "Rejestr umów z opiniowaniem, akceptacją, podpisem, aneksami i terminami wypowiedzenia." },
          { title: "Wnioski i zapotrzebowania", text: "Wnioski zakupowe, urlopowe i inne, każdy ze ścieżką akceptacji zależną od kwoty albo działu." },
          { title: "Dokumenty wychodzące", text: "Pisma, protokoły i decyzje generowane z danych sprawy według szablonów." },
          { title: "Dokumentacja kadrowa", text: "Dokumenty pracownicze przy sprawie, widoczne tylko dla uprawnionych ról." },
        ],
      },
      {
        kind: "tabs",
        title: ["Od wpływu do archiwum.", "Tak dokument przechodzi przez Opero."],
        tabs: [
          {
            label: "Wpływ",
            title: "Rejestracja nadaje numer i otwiera obieg",
            text: "Kancelaria rejestruje pismo z kanałem wpływu, nadawcą i datą. Dokument dostaje numer i od razu stoi na pierwszym etapie obiegu.",
            screen: "karta-pisma",
          },
          {
            label: "Dekretacja",
            title: "Każdy etap ma właściciela i termin",
            text: "Wejście na etap otwiera zadanie dla odpowiedzialnej osoby, z terminem liczonym od chwili, gdy dokument do niej trafił.",
            screen: "etap-zadanie",
          },
          {
            label: "Dokument",
            title: "Odpowiedź powstaje z danych sprawy",
            text: "Szablon składa stałą treść z polami rekordu. Nikt nie przepisuje numeru, nadawcy ani daty.",
            screen: "szablon-dokumentu",
          },
          {
            label: "Terminy",
            title: "Kancelaria widzi, co czeka",
            text: "Pulpit liczy pisma po terminie odpowiedzi i sprawy w toku, i pokazuje, którędy korespondencja wpływa.",
            screen: "kokpit-kancelarii",
          },
          {
            label: "Analityka",
            title: "Obieg w liczbach",
            text: "Pisma według jednostek, rodzajów i terminowości. Te same dane, na których pracuje obieg.",
            screen: "analityka-kancelarii",
          },
        ],
      },
      {
        kind: "compare",
        title: ["Dysk i poczta", "kontra DMS w Opero."],
        columns: ["Dysk, poczta, arkusz", "DMS w Opero"],
        rows: [
          { label: "Aktualna wersja", before: "W którymś wątku mailowym albo w folderze „final_v3”.", after: "Przy sprawie, z historią wersji i jasno oznaczoną bieżącą." },
          { label: "Kto ma dokument", before: "Wiadomo po telefonie do działu.", after: "Widać etap, osobę i termin na karcie dokumentu." },
          { label: "Akceptacja", before: "Odpowiedź „ok” w mailu, trudna do znalezienia po roku.", after: "Przejście na etapie, zapisane z datą i nazwiskiem." },
          { label: "Pismo wychodzące", before: "Przepisywane ręcznie z danych, które już gdzieś są.", after: "Generowane z rekordu według szablonu." },
          { label: "Dostęp", before: "Kto ma link, ten ma plik.", after: "Ten, kto ma uprawnienia do sprawy, łącznie z plikami." },
        ],
      },
      { kind: "outcomes" },
      {
        kind: "article",
        title: "System DMS i elektroniczny obieg dokumentów: co warto wiedzieć",
        sections: [
          {
            heading: "Czym jest system DMS",
            paragraphs: [
              "DMS (Document Management System) to system do zarządzania dokumentami: ich rejestracją, przechowywaniem, wersjami, dostępem i obiegiem. Elektroniczny obieg dokumentów (EOD) to ta jego część, która prowadzi dokument przez kolejne osoby i decyzje, od wpływu do archiwum.",
              "W Opero DMS nie jest osobnym programem. Dokument jest rekordem z polami, plikami i historią, a obieg to proces z etapami, zadaniami i terminami. Dzięki temu ten sam mechanizm obsługuje korespondencję, faktury, umowy i wnioski.",
            ],
          },
          {
            heading: "Obieg faktur i umów w jednym systemie",
            paragraphs: [
              "Faktura kosztowa pobrana z KSeF przechodzi przez opis, dekretację i akceptację jak każdy inny dokument. Umowa ma swój rejestr, aneksy i terminy wypowiedzenia, a reguła przypomina o nich przed czasem.",
              "Ponieważ dokumenty dzielą bazę kontrahentów, pismo, umowa i faktura od tej samej firmy są ze sobą powiązane, a nie rozrzucone po trzech programach.",
            ],
          },
          {
            heading: "Archiwum, wersje i dostęp",
            paragraphs: [
              "Pliki leżą przy sprawie, z wersjami i pełną historią zmian. Dostęp do dokumentu wynika z tej samej roli, co dostęp do danych, a rejestr zdarzeń zapisuje, kto co zrobił i kiedy.",
            ],
          },
        ],
      },
    ],
  },

  "procesy-workflow": {
    seo: {
      title: "System workflow i zarządzanie procesami (BPM) · Opero",
      description:
        "Workflow w Opero: procesy z etapami, przejściami, zadaniami i terminami dla umów, wniosków i zgłoszeń. Obieg akceptacji, który pilnuje kolejności, uprawnień i historii.",
    },
    hero: {
      layout: "stage",
      title: ["Workflow, w którym każda sprawa", "wie, na jakim jest etapie."],
      lead: "Proces przypina się do dowolnego modułu: umowy, wniosku, zgłoszenia. Etapy, przejścia, zadania i terminy układa administrator, a system pilnuje kolejności, uprawnień i historii każdej sprawy.",
      screen: "proces-wizualny",
      caption: "Proces „Obieg umowy” w kreatorze Demo Firma: etapy od projektu do zakończenia, z terminami i drogą powrotu do poprawy.",
    },
    sections: [
      { kind: "showcase" },
      {
        kind: "rows",
        title: ["Etap to więcej", "niż nazwa w kolumnie."],
        lead: "Klikacie etap na tablicy procesu i ustawiacie, co ma się na nim dziać. Trzy zakładki tego samego okna:",
        rows: [
          {
            title: "Kto odpowiada za sprawę",
            text: "Jedna osoba albo kilka, wybór automatyczny przy wejściu na etap, krąg ludzi, z którego można wybrać. Sprawa nie czeka na kogoś, kto nie wie, że czeka.",
            screen: "etap-rodzaj",
          },
          {
            title: "Jakie zadanie i do kiedy",
            text: "Wejście na „Akceptację finansową” otwiera zadanie „Potwierdź warunki finansowe” z terminem trzech dni. Trafia na listę osoby odpowiedzialnej, a przełożony widzi opóźnienie.",
            screen: "etap-zadanie",
          },
          {
            title: "Kto może przenieść dalej",
            text: "Edycja i przejście do następnego etapu mają osobne uprawnienia. Opiniujący może komentować, ale do podpisu przenosi tylko ten, kto ma do tego prawo.",
            screen: "etap-dostep",
          },
        ],
      },
      {
        kind: "article",
        title: "System workflow i BPM: jak Opero prowadzi procesy",
        sections: [
          {
            heading: "Workflow, czyli obieg spraw według zasad",
            paragraphs: [
              "System workflow prowadzi sprawę przez kolejne etapy według zasad, które ustala firma: kto akceptuje, w jakiej kolejności, w jakim czasie i na jakich warunkach. W Opero proces jest zapisany jako etapy połączone przejściami, a każdy etap ma właściciela, zadanie, termin i uprawnienia.",
            ],
          },
          {
            heading: "Zarządzanie procesami bez projektu informatycznego",
            paragraphs: [
              "Zarządzanie procesami biznesowymi (BPM) często kończy się na diagramie, który nie ma nic wspólnego z codzienną pracą. W Opero diagram jest działającym procesem: zmiana etapu w kreatorze przechodzi przez wersję roboczą i publikację, a sprawy w toku zachowują historię.",
              "Proces można przypiąć do umowy, faktury, wniosku zakupowego czy zgłoszenia serwisowego. Warunki na przejściach prowadzą sprawę właściwą drogą, na przykład zależnie od kwoty, a reguły wykonują kroki automatycznie przy wejściu na etap.",
            ],
          },
        ],
      },
    ],
  },

  "no-code": {
    seo: {
      title: "Platforma no-code do aplikacji biznesowych · Opero",
      description:
        "Opero to platforma no-code i low-code: obiekty, pola, formularze, widoki, menu i pulpity układane w konfiguracji. Aplikacje dla każdego działu bez pisania kodu.",
    },
    hero: {
      layout: "split",
      title: ["Aplikacja dla Waszego działu,", "zbudowana bez pisania kodu."],
      lead: "Moduł składa się z obiektów, pól, formularzy, widoków, menu i pulpitów. Opero zapewnia raz to, co każda aplikacja biznesowa ma wspólne: dane, uprawnienia, pliki i historię. Do ułożenia zostaje to, co jest naprawdę Wasze.",
      screen: "obiekt-umowa",
      caption: "Obiekt „Umowa” w konfiguracji Demo Firma: 27 pól, każde z kluczem, typem i informacją, na których formularzach występuje.",
    },
    sections: [
      { kind: "story" },
      { kind: "showcase" },
      {
        kind: "article",
        title: "Platforma no-code i low-code: gdzie kończy się konfiguracja",
        sections: [
          {
            heading: "No-code dla tego, co powtarzalne",
            paragraphs: [
              "Platforma no-code pozwala zbudować aplikację biznesową w konfiguracji, bez programisty: rejestr, formularz, widok, pulpit. W Opero obiekty i pola dodaje administrator, a pierwsza wersja modułu jest na ekranie od razu, z uprawnieniami, plikami i historią zmian.",
            ],
          },
          {
            heading: "Low-code tam, gdzie konfiguracja to za mało",
            paragraphs: [
              "Kiedy logika wychodzi poza zwykłe pola i formularze, w Opero wchodzą reguły, skrypty i zapytania SQL. Są nazwane, parametryzowane i testowane przed włączeniem, więc rozbudowa nie zamienia się w osobny system, którego nikt nie rozumie.",
            ],
          },
        ],
      },
    ],
  },

  "low-code-automatyzacje": {
    seo: {
      title: "Automatyzacja procesów i low-code · Opero",
      description:
        "Automatyzacje w Opero: reguły typu wyzwalacz, warunek i kroki, skrypty i zapytania SQL. Powiadomienia, zadania, blokady przejść i integracje bez ręcznej pracy.",
    },
    hero: {
      layout: "split",
      title: ["Automatyzacja procesów:", "gdy coś się wydarzy, system robi resztę."],
      lead: "Reguła działa według zasady: wyzwalacz, warunek, kroki. Ustawia pole, tworzy rekord, wysyła powiadomienie albo blokuje przejście. Tam, gdzie to za mało, wchodzą skrypty i zapytania SQL.",
      screen: "regula-warunek",
      caption: "Reguła w Demo Firma: przejście w procesie faktur, warunek wejścia na etap Księgowość i dwie akcje zależnie od wyniku.",
    },
    sections: [
      {
        kind: "cards",
        style: "ifThen",
        title: ["Jeśli to,", "to tamto. Bez pamiętania."],
        lead: "Przykłady reguł, które w firmie zwykle ktoś musi pamiętać:",
        items: [
          { when: "Umowa przekracza ustalony próg wartości", title: "Dochodzi etap akceptacji zarządu", text: "Reguła sprawdza kwotę i kieruje sprawę właściwą drogą." },
          { when: "Do końca umowy zostaje 30 dni", title: "Właściciel dostaje zadanie przeglądu", text: "Z terminem, na swojej liście zadań." },
          { when: "Faktura wchodzi na etap Księgowość", title: "Dostaje znacznik gotowości do KSeF", text: "Wysyłka zabiera tylko faktury z tym znacznikiem." },
          { when: "Na skrzynkę przychodzi e-mail", title: "Powstaje pismo w kancelarii", text: "Z nadawcą, tematem i załącznikami." },
          { when: "Brakuje wymaganego załącznika", title: "Przejście jest zablokowane", text: "Sprawa nie pójdzie dalej, dopóki warunek nie jest spełniony." },
          { when: "Codziennie o ustalonej godzinie", title: "Reguła harmonogramu robi swoje", text: "Zestawienie, przypomnienie albo wysyłka paczki dokumentów." },
        ],
      },
      { kind: "outcomes" },
      {
        kind: "article",
        title: "Automatyzacja procesów w low-code: jak działają reguły Opero",
        sections: [
          {
            heading: "Wyzwalacz, warunek, kroki",
            paragraphs: [
              "Każda automatyzacja w Opero zaczyna się od zdarzenia: zapisu rekordu, przejścia w procesie, wiadomości e-mail, harmonogramu albo dokumentu z KSeF. Warunek decyduje, którą drogą pójść, a kroki zmieniają dane, tworzą rekordy, wysyłają powiadomienia albo wywołują integracje.",
            ],
          },
          {
            heading: "Przewidywalna automatyzacja",
            paragraphs: [
              "Reguły testuje się na danych, zanim zaczną działać, a każde wykonanie zostaje w historii z wynikiem i czasem. Gdy logika jest bardziej złożona, krok może być skryptem albo zapytaniem SQL, nazwanym i używanym w wielu miejscach.",
            ],
          },
        ],
      },
    ],
  },

  "integracje-zgodnosc": {
    seo: {
      title: "Integracja z KSeF, e-Doręczenia i API · Opero",
      description:
        "Opero integruje się z KSeF, obsługuje e-Doręczenia, kursy walut NBP i weryfikację kontrahentów na białej liście VAT i w VIES. Otwarte API do wymiany danych z ERP.",
    },
    hero: {
      layout: "split",
      title: ["KSeF, e-Doręczenia i Wasze systemy", "w jednym obiegu danych."],
      lead: "Faktury z KSeF, korespondencja przez e-Doręczenia, kursy NBP i weryfikacja kontrahenta działają wprost z Opero. Otwarte API wymienia dane z ERP i resztą narzędzi firmy w obie strony.",
      screen: "integracja-ksef",
      caption: "Integracja KSeF w ustawieniach organizacji Demo Firma: poświadczenia, środowisko, pobieranie faktur i walidacja FA(3).",
    },
    sections: [
      {
        kind: "cards",
        style: "tiles",
        title: ["Usługi państwa i firmy,", "podłączone w jednym miejscu."],
        items: [
          { title: "KSeF", text: "Wysyłka faktur sprzedaży, odbiór faktur zakupowych i UPO, walidacja według schemy FA(3)." },
          { title: "e-Doręczenia", text: "Korespondencja urzędowa z mocą listu poleconego jako kanał wpływu w kancelarii." },
          { title: "Kursy walut NBP", text: "Kursy z Tabeli A do przeliczeń, z obsługą dni wolnych." },
          { title: "Biała lista VAT i VIES", text: "Weryfikacja kontrahenta, zanim powstanie dokument." },
          { title: "Otwarte API", text: "Zapis rekordów i powiadomienia o zmianach statusu dla ERP i innych systemów." },
          { title: "Poczta e-mail", text: "Wiadomości ze skrzynki mogą tworzyć pisma i sprawy przez reguły." },
        ],
      },
      {
        kind: "rows",
        title: ["Integracja to nie przycisk.", "To część obiegu."],
        rows: [
          {
            title: "Połączenie ustawia się raz, w organizacji",
            text: "Poświadczenia, środowisko testowe albo produkcyjne, częstotliwość pobierania faktur i walidacja. Demo Firma pracuje na środowisku testowym KSeF.",
            screen: "integracja-ksef",
          },
          {
            title: "Proces decyduje, kiedy dokument wychodzi",
            text: "Faktura sprzedaży przechodzi przez etapy. Na etapie Księgowość reguła oznacza ją jako gotową do KSeF, a codzienna wysyłka zabiera tylko takie.",
            screen: "regula-warunek",
          },
          {
            title: "Każdy kanał wpływu w jednym rejestrze",
            text: "E-mail, poczta, ePUAP i e-Doręczenia trafiają do tej samej kancelarii i tego samego obiegu.",
            screen: "kokpit-kancelarii",
          },
        ],
      },
      {
        kind: "article",
        title: "Integracja z KSeF i e-Doręczeniami w Opero",
        sections: [
          {
            heading: "KSeF w obiegu faktur",
            paragraphs: [
              "Krajowy System e-Faktur zmienia sposób, w jaki faktury wchodzą do firmy i z niej wychodzą. W Opero faktura zakupowa pobrana z KSeF staje się rekordem i przechodzi przez opis, dekretację i akceptację, a faktura sprzedaży jest wysyłana do KSeF wtedy, gdy przeszła swój obieg.",
            ],
          },
          {
            heading: "Opero obok ERP, nie zamiast",
            paragraphs: [
              "Opero nie jest systemem księgowym ani ERP. Prowadzi dokumenty, procesy i dane wokół nich, a przez otwarte API wymienia je z ERP i innymi narzędziami firmy w obie strony.",
            ],
          },
        ],
      },
    ],
  },

  raporty: {
    seo: {
      title: "Raporty, dashboardy i analityka danych · Opero",
      description:
        "Raporty i pulpity w Opero na żywych danych: tabele przestawne, wykresy, wskaźniki i drążenie do rekordów. Analityka bez eksportu do arkusza.",
    },
    hero: {
      layout: "stage",
      title: ["Raporty i dashboardy", "na danych, na których pracuje firma."],
      lead: "Wskaźniki, wykresy i tabele przestawne liczone na bieżąco z modułów. Klikając wartość, schodzi się do rekordów, które ją tworzą, więc każdą liczbę można sprawdzić u źródła.",
      screen: "kokpit-umow",
      caption: "Kokpit umów w Demo Firma: wartość obowiązujących umów, umowy wygasające w ciągu 60 dni i rozkład portfela.",
    },
    sections: [
      {
        kind: "tabs",
        title: ["Od zapytania", "do pulpitu zarządu."],
        tabs: [
          {
            label: "Źródło",
            title: "Raport bierze dane u źródła",
            text: "Źródłem jest zapytanie na żywych danych modułów. „Wnioski zakupowe wg etapu obiegu” pokazuje, gdzie zatrzymują się pieniądze w procesie zakupowym.",
            screen: "raport-edycja",
          },
          {
            label: "Tabela przestawna",
            title: "Przestawiacie na ekranie, nie w eksporcie",
            text: "Umowy według typu i etapu, z liczbą i wartością netto. Wiersze, kolumny i miary zmienia się przeciągnięciem.",
            screen: "analityka-umow",
          },
          {
            label: "Pulpit",
            title: "Jeden widok dla zarządu",
            text: "Wskaźniki u góry, wykresy pod nimi. Każdy zespół może mieć swój pulpit na tych samych danych.",
            screen: "kokpit-umow",
          },
          {
            label: "Każdy obszar",
            title: "Ten sam mechanizm wszędzie",
            text: "Kancelaria ma swoją analitykę, zakupy swoją, zarząd centrum analityczne. Bez osobnego narzędzia BI do utrzymania.",
            screen: "analityka-kancelarii",
          },
        ],
      },
      { kind: "outcomes" },
      {
        kind: "article",
        title: "Raporty i dashboardy w Opero: analityka bez eksportu",
        sections: [
          {
            paragraphs: [
              "Raporty w Opero działają na tych samych danych, na których pracują procesy, więc nie trzeba ich eksportować, czyścić ani przepisywać. Tabela przestawna, wykres i wskaźnik na pulpicie odświeżają się z modułów, a drążenie prowadzi od liczby do konkretnych rekordów.",
              "Tam, gdzie zwykłe filtry nie wystarczają, źródłem raportu może być parametryzowane zapytanie SQL. Raport firmowy liczy dane jednej spółki, organizacyjny wszystkich, zawsze z uprawnieniami osoby, która go ogląda.",
            ],
          },
        ],
      },
    ],
  },

  "kontekstowe-ai": {
    seo: {
      title: "Kontekstowe AI w systemie dla firm · Opero",
      description:
        "Asystent AI w Opero zna strukturę i dane Waszej instancji: pomaga budować moduły, reguły i procesy i odpowiada na pytania o dane, zawsze w granicach uprawnień.",
    },
    hero: {
      layout: "split",
      title: ["AI, które zna Wasz system,", "a nie ogólną wiedzę o systemach."],
      lead: "Asystent pracuje na tej samej strukturze co administrator: obiektach, polach, procesach i uprawnieniach. Pomaga budować konfigurację i odpowiada na pytania o dane. Zmiany wprowadza człowiek.",
      screen: "obiekt-umowa",
      caption: "Struktura, którą zna asystent: obiekt „Umowa” w Demo Firma z polami, typami i formularzami.",
    },
    sections: [
      { kind: "showcase" },
      {
        kind: "statement",
        text: "Asystent widzi dokładnie tyle, ile rola osoby, która go pyta. Ani jednego pola więcej.",
        note: "Te same uprawnienia obowiązują przy pytaniach o dane i przy zmianach w konfiguracji, a każda zmiana zaproponowana przez AI przechodzi walidację i czeka na zatwierdzenie.",
      },
      {
        kind: "article",
        title: "AI w firmie: dlaczego kontekst ma znaczenie",
        sections: [
          {
            paragraphs: [
              "Ogólny asystent AI nie wie, jak Wasza firma nazywa umowy, kto je akceptuje ani które pola są poufne. Kontekstowe AI w Opero łączy się z konfiguracją i danymi Waszej instancji przez kontrolowany mechanizm, więc odpowiada konkretnie i tylko w zakresie uprawnień.",
              "Dla konsultantów i administratorów asystent przyspiesza budowę obiektów, formularzy, reguł i procesów. Dla użytkowników odpowiada na pytania o dane zwykłym zdaniem i podsumowuje sprawy bez klikania po widokach.",
            ],
          },
        ],
      },
    ],
  },

  "bezpieczenstwo-uprawnienia": {
    seo: {
      title: "Bezpieczeństwo, role i uprawnienia do danych · Opero",
      description:
        "Uprawnienia w Opero od organizacji i spółek, przez role, po pojedyncze pole i etap procesu. MFA, SSO, tokeny API i rejestr zdarzeń.",
    },
    hero: {
      layout: "split",
      title: ["Każdy widzi tyle,", "ile powinien. Ani pola więcej."],
      lead: "Dostęp układa się od organizacji i spółek, przez role, po pojedyncze pole i etap procesu. Logowanie z MFA i SSO, tokeny API z własnym zakresem i rejestr zdarzeń dają kontrolę, której oczekuje dział IT.",
      screen: "role",
      caption: "Role organizacji Demo Firma, każda z własnym zakresem uprawnień i liczbą przypisanych osób.",
    },
    sections: [
      {
        kind: "pins",
        title: ["Dostęp ustawia się raz", "i obowiązuje wszędzie."],
        lead: "Obiekt „Umowa” w Demo Firma. Trzy decyzje, które działają w każdym widoku, raporcie i dla asystenta AI:",
        screen: "obiekt-wlasnosc",
        pins: [
          { x: 0.185, y: 0.21, title: "Własność rekordów", text: "Każda spółka w organizacji ma własne umowy i nie widzi cudzych. Konfiguracja wspólna, dane osobne." },
          { x: 0.185, y: 0.52, title: "Dostęp do rekordów", text: "Wszyscy z dostępem do obiektu albo tylko wskazane osoby." },
          { x: 0.185, y: 0.81, title: "Dostępność", text: "Obiekt można wycofać z menu i list bez usuwania go ani jego danych." },
        ],
      },
      { kind: "showcase" },
      {
        kind: "article",
        title: "Bezpieczeństwo danych i uprawnienia w Opero",
        sections: [
          {
            paragraphs: [
              "Uprawnienia w Opero nadaje się przez role, a te określają widoczność i edycję modułu, obiektu i pojedynczego pola. Etap procesu dokłada swoje zasady: kto edytuje sprawę i kto może ją przenieść dalej. Grupa spółek pracuje na jednej konfiguracji z odseparowanymi danymi.",
              "Logowanie wspiera MFA i SSO, integracje korzystają z tokenów API o określonym zakresie, a rejestr zdarzeń zapisuje każdą zmianę: kto, co i kiedy. System może też działać na dedykowanej instancji dla organizacji.",
            ],
          },
        ],
      },
    ],
  },

  "gotowe-aplikacje": {
    seo: {
      title: "Gotowe aplikacje: faktury KSeF, kontrahenci, kancelaria · Opero",
      description:
        "Gotowe aplikacje Opero: faktury z KSeF, kontrahenci z weryfikacją VAT, kancelaria z e-Doręczeniami, obsługa zgłoszeń i ewidencja czasu. Do dopasowania jak własne moduły.",
    },
    hero: {
      layout: "split",
      title: ["Gotowe tam,", "gdzie błąd kosztuje najwięcej."],
      lead: "Część pracy wygląda tak samo w każdej firmie i nie ma sensu budować jej od nowa. Opero ma dla niej gotowe aplikacje, połączone z usługami państwowymi, na tych samych zasadach co Wasze własne moduły.",
      screen: "kokpit-kancelarii",
      caption: "Pulpit kancelarii w Demo Firma: pisma po terminie odpowiedzi, sprawy w toku i kanały wpływu korespondencji.",
    },
    sections: [
      {
        kind: "cards",
        style: "cards",
        title: ["Pięć aplikacji", "gotowych od pierwszego dnia."],
        items: [
          { title: "Faktury z KSeF", text: "Odbiór i wysyłka faktur ustrukturyzowanych, z obiegiem opisu i akceptacji." },
          { title: "Kontrahenci", text: "Wspólna baza firm ze statusem z białej listy VAT i VIES, dla umów, pism i faktur." },
          { title: "Kancelaria i e-Doręczenia", text: "Rejestr korespondencji z numeracją, dekretacją i terminami odpowiedzi." },
          { title: "Obsługa zgłoszeń", text: "Przyjęcie, przypisanie, etapy i termin dla każdego zgłoszenia." },
          { title: "Ewidencja czasu", text: "Czas pracy rejestrowany przy sprawach i projektach." },
        ],
      },
      {
        kind: "tabs",
        title: ["Gotowe nie znaczy", "zamknięte."],
        lead: "Gotowe aplikacje są zbudowane z tych samych elementów co własne moduły, więc pola, etapy i reguły można zmienić.",
        tabs: [
          { label: "KSeF", title: "Połączenie z KSeF w ustawieniach", text: "Poświadczenia, środowisko i pobieranie faktur ustawia się w organizacji.", screen: "integracja-ksef" },
          { label: "Kancelaria", title: "Pismo z numerem i obiegiem", text: "Korespondencja z każdego kanału trafia do rejestru pism.", screen: "karta-pisma" },
          { label: "Dokumenty", title: "Protokoły z szablonów", text: "Protokół zgłoszenia serwisowego wypełnia się danymi zgłoszenia.", screen: "szablon-dokumentu" },
          { label: "Pulpit", title: "Terminy i obciążenie na jednym ekranie", text: "Pisma po terminie, sprawy w toku i rozkład wpływu.", screen: "kokpit-kancelarii" },
        ],
      },
      {
        kind: "article",
        title: "Gotowe aplikacje i własne moduły na jednej platformie",
        sections: [
          {
            paragraphs: [
              "Obowiązkowe e-fakturowanie, korespondencja urzędowa i baza kontrahentów to obszary, w których pomyłka kosztuje najwięcej, a sposób pracy jest podobny w każdej firmie. Dlatego Opero ma dla nich gotowe aplikacje, połączone z KSeF, e-Doręczeniami, białą listą VAT i VIES.",
              "Wszystko, co działa u Was inaczej, powstaje obok jako własne moduły, z tymi samymi uprawnieniami i tą samą historią spraw. Opero nie zastępuje systemu księgowego ani ERP, tylko prowadzi obieg dokumentów i spraw wokół nich.",
            ],
          },
        ],
      },
    ],
  },
});
