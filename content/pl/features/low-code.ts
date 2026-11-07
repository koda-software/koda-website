import type { LowCodePageContent } from "@/content/feature-stories/low-code.types";
import type { FeaturePageContent } from "@/content/types";

const faq: FeaturePageContent["faq"] = {
  title: "Najczęściej zadawane pytania.",
  items: [
    {
      question: "Co może uruchomić regułę i co reguła może zrobić?",
      answer:
        "Regułę uruchamia zmiana rekordu, przejście w procesie, przypomnienie o dacie, przychodzący e-mail, ostrzeżenie SLA w helpdesku, harmonogram cron, przycisk albo wywołanie zewnętrznego API. Potem reguła idzie po krokach narysowanych na kanwie, a typów wbudowanych jest ponad 50: aktualizacja rekordów, e-mail, generowanie dokumentu, przejście w procesie, webhook. Część wyzwalaczy i kroków wymaga włączonego modułu lub połączenia.",
    },
    {
      question: "Czy automatyzacje wymagają programisty?",
      answer:
        "Większość reguł nie. Właściciel procesu z uprawnieniami do reguł wybiera na kanwie pola, operatory i wartości. JavaScript jest potrzebny tylko w kroku skryptowym, a SQL tylko w zapisanym zapytaniu. Do nich i do własnych bloków warto mieć już kogoś technicznego.",
    },
    {
      question: "Jak przetestować regułę, żeby nie wysłać e-maila do prawdziwych klientów?",
      answer:
        "Zostaw regułę nieaktywną i uruchom test na prawdziwym rekordzie albo na danych z wcześniejszego uruchomienia. Warunki, skrypty, szablony i odczyty działają naprawdę. Zapisy, wysyłki i wywołania zewnętrzne zostają przechwycone i pokazane z końcowymi wartościami, także z odbiorcami i treścią e-maila, a do historii nic nie trafia. Krok po przechwyconym kroku dostaje znacznik zamiast prawdziwego wyniku, na przykład odpowiedzi webhooka.",
    },
    {
      question: "Czy reguła może poczekać trzy dni i działać dalej?",
      answer:
        "Nie. Krok Czekaj ma limit 300 sekund. Na dłuższy odstęp służy przypomnienie o dacie: do 5 przesunięć na regułę, przed datą w polu lub terminem zadania albo po nich. Przed uruchomieniem Opero ponownie odczytuje rekord. Jeśli został usunięty albo data się zmieniła, stare przypomnienie nie zadziała, a nowa data uruchomi je raz, według własnego terminu.",
    },
    {
      question: "Co się stanie, gdy w terminie przypomnienia lub harmonogramu system nie działa?",
      answer:
        "Przypomnienia nadrabiają: te pominięte podczas przestoju uruchamiają się po wznowieniu przeglądu, a rejestr pilnuje, żeby nie zadziałały dwa razy. Harmonogramy cron nie nadrabiają. Pominięte minuty są odnotowywane jako zdarzenie limitu i nigdy nie są powtarzane, a harmonogram działa według zegara serwera, a nie strefy czasowej firmy.",
    },
    {
      question: "Czy reguła może wpaść w nieskończoną pętlę?",
      answer:
        "Reguła, którą uruchomiłaby jej własna zmiana, zostaje pominięta, a uruchomienie trafia do historii ze statusem Pominięto. Wywołania między regułami kończą się na głębokości 5, jeden krok poza pętlą może zostać odwiedzony 10 razy, pętla ma najwyżej 100 przebiegów, a uruchomienie limit 1000 kroków.",
    },
    {
      question: "Gdzie działa własny kod i czy to bezpieczne?",
      answer:
        "Krok skryptowy reguły działa na serwerze, w odizolowanym procesie: tylko dozwolone obiekty globalne, bez fetch, timerów i eval, z limitem 5 sekund. Skrypty formularzy i bloków działają w przeglądarce użytkownika. Nie są barierą bezpieczeństwa, dlatego o tym, co wolno, nadal decydują walidacja na serwerze, uprawnienia i warunki procesu. Autorów skryptów traktuj jak zaufanych administratorów.",
    },
    {
      question: "Czy zapytanie SQL może uszkodzić nasze dane?",
      answer:
        "Zapytanie odczytujące działa na roli bazy tylko do odczytu, z limitem 10 sekund. Zapytanie zapisujące wymaga osobnego uprawnienia, to jedna instrukcja INSERT, UPDATE lub DELETE, przy UPDATE i DELETE z obowiązkowym WHERE, i może zmieniać tylko tabele Twoich obiektów oraz krótką listę tabel budżetów i pól własnych. Tabele faktur pozostają więc tylko do odczytu. Taki zapis omija jednak reguły, historię rekordu i indeksowanie wyszukiwarki, dlatego jest narzędziem dla osób, które znają dane.",
    },
    {
      question: "Czy reguły współpracują z naszymi innymi systemami?",
      answer:
        "Na zewnątrz krok Wywołaj webhook wysyła jedno żądanie do publicznego hosta na porcie 80 lub 443, z limitem 30 sekund. Status inny niż 2xx albo odpowiedź ponad 1 MiB kończy krok błędem, a dla tego przypadku możesz narysować ścieżkę błędu. W drugą stronę inny system może przez zewnętrzne API, z tokenem firmy, uruchomić regułę ręczną i odczytać historię jej uruchomień.",
    },
  ],
};

export const lowCodeFeature: FeaturePageContent = {
  seo: {
    title: "Automatyzacja procesów i low-code",
    description:
      "Automatyzuj decyzje regułami, skryptami i zapytaniami SQL. Silnik reguł „warunek to akcja” bez budowy osobnego systemu. Low-code w Opero.",
  },
  navLabel: "Low-code i automatyzacje",
  navDescription: "Decyzje, które zapadają same",
  hero: {
    title: "Low-code i automatyzacje - logika, która pracuje za Ciebie",
    description:
      "Tam, gdzie konfiguracja to za mało, wchodzą reguły, skrypty i zapytania SQL. Automatyzujesz decyzje i przetwarzanie danych bez budowania osobnego systemu.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Zobacz Opero w akcji",
  },
  intro: {
    paragraph:
      "Warstwa low-code Opero uruchamia logikę na zdarzeniach: silnik reguł reaguje według zasady „gdy warunek → wykonaj kroki”, silnik skryptów obsługuje nietypowe przetwarzanie, a zapytania SQL sięgają po dane dokładnie tak, jak potrzebujesz.",
  },
  demo: {
    kind: "lowCode",
    conditionLabel: "Warunek reguły",
    condition: ["Priorytet", "równa się", "Krytyczny"],
    runLabel: "Zapisz i uruchom",
    firedLabel: "Reguła zadziałała",
    fieldEffect: { title: "Pole ustawia się samo", detail: "Pilne", from: "Nie", to: "Tak" },
    notificationEffect: { title: "Powiadomienie wychodzi", detail: "do: Marek Wiśniewski · SMS + e-mail" },
    blockEffect: { title: "Przejście zablokowane", detail: "Brak protokołu odbioru", transition: "Zamknij zgłoszenie" },
    captions: { condition: "Warunek składasz <b>z gotowych klocków</b>", fired: "Reguła odpala się <b>przy każdym rekordzie</b>", summary: "Pole, powiadomienie, blokada przejścia - <b>bez pilnowania</b>" },
  },
  blocks: {
    title: "Trzy warstwy logiki na Twoich danych.",
    items: [
      {
        title: "Silnik reguł i ich kroki",
        description:
          "Definiujesz warunki i sekwencję akcji (ustaw pole, utwórz rekord, wyślij powiadomienie, zablokuj przejście). Reguły testujesz przed wdrożeniem, więc automatyzacja jest przewidywalna.",
      },
      {
        title: "Silnik skryptów",
        description:
          "Fragmenty wyrażeń i skryptów wywoływane z reguł, pól wyliczanych i szablonów dla scenariuszy poza konfiguracją wizualną.",
      },
      {
        title: "Zapytania SQL",
        description:
          "Nazwane, parametryzowane zapytania wielokrotnego użytku jako źródło reguł, raportów i pól wyboru.",
      },
    ],
  },
  finalCta: {
    title: "Zautomatyzuj powtarzalne zadania.",
    description: "Zobacz, jak reguły i skrypty przejmują ręczne kroki, które dziś robi zespół.",
    primaryCta: "Umów prezentację",
  },
  seoText: {
    title: "Automatyzacja, która przejmuje powtarzalną pracę.",
    paragraphs: [
      "Warstwa low-code Opero automatyzuje pracę, która dziś pochłania czas zespołu. Silnik reguł działa według prostej zasady „gdy zajdzie warunek, wykonaj kroki”: ustaw pole, utwórz rekord, wyślij powiadomienie, zablokuj przejście w procesie. Reguły definiujesz i testujesz przed wdrożeniem, więc automatyzacja jest przewidywalna, a nie ryzykowna.",
      "Dla scenariuszy wykraczających poza konfigurację wizualną wchodzi silnik skryptów. Fragmenty wyrażeń i skryptów uruchamiasz z reguł, pól wyliczanych i szablonów, gdy potrzebne jest niestandardowe przetwarzanie danych. To element low-code: sięgasz po kod tylko tam, gdzie faktycznie się opłaca, bez budowania osobnego systemu.",
      "Zapytania SQL dają pełną kontrolę nad danymi. Nazwane, parametryzowane zapytania wielokrotnego użytku zasilają reguły, raporty i pola wyboru, gdy standardowe filtry to za mało. Razem reguły, skrypty i SQL zamieniają Opero w platformę, która wykonuje powtarzalną pracę za Ciebie.",
    ],
  },
  faq,
  related: {
    title: "Zobacz też",
    items: ["processes", "reports", "noCode"],
  },
};

export const lowCodePage: LowCodePageContent = {
  hero: {
    title: "Przypomnienia i przekazania spraw jako reguły. Na resztę skrypty i SQL.",
    description:
      "Umowa kończąca się 30 czerwca może powiadomić opiekuna 31 maja i 16 czerwca oraz założyć rekord odnowienia, bez zaglądania do arkusza. Rysujesz to jako regułę z ponad 50 wbudowanych typów kroków, testujesz na prawdziwym rekordzie bez żadnej wysyłki, a potem czytasz każde uruchomienie krok po kroku. Tam, gdzie reguła nie wystarcza, skrypt, zapytanie SQL lub własny blok pracują na tych samych danych.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Poznaj Opero",
    image: {
      src: "/opero/low-code/rule-canvas-hero.webp",
      alt: "Edytor reguł Opero z automatyzacją narysowaną jako graf wyzwalacza, warunków i akcji",
      width: 2111,
      height: 1316,
    },
  },
  chores: {
    title: "Siedem ręcznych zadań i to, co zamiast nich robi Opero.",
    description:
      "Daty i adresy to przykłady. Kroki, które za nimi stoją, istnieją już dziś, a każdy wiersz można przetestować przed uruchomieniem.",
    todayLabel: "Dziś ktoś musi",
    insteadLabel: "W Opero",
    rows: [
      { today: "Sprawdzać w arkuszu, którym umowom kończy się termin", instead: "Przypomnienie o dacie działa 30 i 14 dni przed końcem umowy, o 9:00 czasu firmy. Po zmianie daty ustawia się od nowa" },
      { today: "Przekazywać pocztę z serwis@ właściwym osobom", instead: "Reguła z filtrem na skrzynkę, nadawcę lub temat zakłada zgłoszenie w helpdesku" },
      { today: "Przepisywać dane firmy z rejestru do nowego kontrahenta", instead: "NIP trafia do REGON, a znaleziono, nie znaleziono i błąd rejestru mają osobne ścieżki" },
      { today: "Dopytywać, kto ma czas zająć się sprawą", instead: "Etap procesu przydziela zadanie w ramach roli, po kolei albo najmniej obciążonej osobie" },
      { today: "Wypełniać szablon umowy i dołączać go do e-maila", instead: "Wygeneruj dokument, dołącz go do rekordu i wyślij krokiem e-mail" },
      { today: "Liczyć ręcznie 3 dni robocze od poniedziałku 9 listopada", instead: "Kalendarz firmowy zwraca piątek 13 listopada, bo 11 listopada to święto" },
      { today: "Składać ręcznie piątkowe liczby", instead: "Cron 0 8 * * 5 uruchamia zapisane zapytanie i wysyła wynik e-mailem" },
    ],
  },
  anatomy: {
    title: "Co uruchamia regułę, co sprawdza i co robi.",
    description:
      "Reguła to jeden wyzwalacz i graf kroków na kanwie. Wbudowanych typów kroków jest ponad 50, a integracje dodają własne. Każdy krok oprócz Stop ma wyjście błędu, więc awaria może pójść osobną ścieżką.",
    columns: [
      {
        label: "Gdy",
        items: [
          "Rekord powstaje lub się zmienia, także tylko przez wybrany formularz, albo zostaje usunięty",
          "Proces przechodzi dalej, kończy się lub zmienia przypisanych",
          "Do 5 przesunięć przed datą w polu lub terminem zadania albo po nich",
          "Przychodzi e-mail, z filtrem na skrzynkę, nadawcę, temat lub adres",
          "Zgłoszenie dostaje ostrzeżenie SLA, przekracza je lub leży bez ruchu",
          "Powstaje lub zmienia się faktura, budżet albo kontrahent",
          "Pięciopolowy harmonogram cron, najczęściej raz na minutę",
          "Ktoś klika przycisk na rekordzie, liście lub stronie",
          "Inny system wywołuje zewnętrzne API z tokenem firmy",
        ],
      },
      {
        label: "Sprawdź",
        items: [
          "Warunek albo Switch z nazwanymi przypadkami i ścieżką w pozostałych",
          "Pętla po liście: domyślnie 25 przebiegów, najwyżej 100",
          "Filtrowanie, przekształcanie, sortowanie, agregacja, usuwanie duplikatów",
          "Pobranie do 100 rekordów albo zapisane zapytanie",
          "NIP w REGON (PL) lub Vatly (UE, GB, CH, NO, AU)",
          "Dni robocze i godziny otwarcia w kalendarzu firmowym",
          "Prompt do OpenAI, Anthropic lub Gemini przez Twoje połączenie",
          "Krok JavaScript z limitem 5 sekund",
        ],
      },
      {
        label: "Zrób",
        items: [
          "Utwórz lub zmień rekordy, kontrahentów i użytkowników",
          "Przesuń proces lub ustaw przypisanych",
          "Wyślij e-mail, powiadomienie lub SMS",
          "Odpowiedz na zapisany e-mail, zmień go lub powiąż",
          "Wygeneruj dokument i dołącz go do rekordu",
          "Załóż, zmień lub obsłuż zgłoszenie w helpdesku",
          "Wczytaj z pomocą AI fakturę z e-maila jako fakturę kosztową",
          "Wywołaj webhook: limit 30 sekund, tylko hosty publiczne",
          "Wywołaj inną regułę lub poczekaj do 300 sekund",
        ],
      },
    ],
    note: "Helpdesk, klient poczty, SMS, AI i rejestr firm wymagają włączonego modułu lub połączenia. Nie ma kroku czekania na kilka dni: na trzy dni później służy przypomnienie o dacie.",
  },
  sentence: {
    title: "Warunki korzystają z Twoich pól, a o zamknięciu sprawy decyduje proces.",
    description:
      "Przykład: technik zakłada zgłoszenie z polem Priorytet = Krytyczny. Pole, operator i wartość wybierasz ze swojego obiektu, a reguła ustawia Pilne na Tak i powiadamia kierownika obiektu. Reguła nie zatrzyma przejścia. Zamknięcie bez protokołu odbioru odrzuci warunek na przejściu Zamknij zgłoszenie w procesie, a warunek ten obowiązuje i ludzi, i reguły.",
    bullets: [
      "Reguły czytają pola Twoich obiektów i danych wbudowanych, takich jak kontrahenci, faktury i budżety.",
      "W wiadomościach i wartościach działają szablony, np. {{ trigger.data.site_manager }}, oraz wyniki wcześniejszych kroków.",
      "Własna zmiana reguły nie uruchamia jej ponownie. Takie uruchomienie trafia do historii jako pominięte.",
    ],
    demo: {
      conditionLabel: "Warunek reguły",
      condition: ["Priorytet", "równa się", "Krytyczny"],
      runLabel: "Zapisz i aktywuj",
      firedLabel: "Co dzieje się dalej",
      fieldEffect: { title: "Reguła ustawia Pilne na Tak", detail: "Pilne", from: "Nie", to: "Tak" },
      notificationEffect: { title: "Kierownik obiektu dostaje powiadomienie", detail: "do: Marek Wiśniewski · powiadomienie + e-mail" },
      blockEffect: { title: "Warunek procesu odrzuca przejście", detail: "Brak protokołu odbioru", transition: "Zamknij zgłoszenie" },
      captions: {
        condition: "Pole, operator i wartość <b>z Twojego obiektu</b>",
        fired: "Działa przy każdym <b>pasującym zgłoszeniu</b>",
        summary: "Pole, wiadomość i <b>odrzucone przejście</b>",
      },
    },
  },
  scenarios: {
    title: "Sześć przykładów, krok po kroku.",
    description:
      "Nazwy, daty i kwoty to przykładowe dane wejściowe, a nie historie ani wyniki klientów. Każda karta korzysta wyłącznie z kroków, które już istnieją.",
    labels: { when: "Gdy", check: "Sprawdź", then: "Potem" },
    items: [
      {
        area: "Utrzymanie ruchu",
        title: "Przegląd wózka widłowego 15 marca",
        when: "Przypomnienie 14 dni przed polem Następny przegląd: 1 marca o 9:00",
        check: "Filtr w przypomnieniu: Status = W eksploatacji",
        then: ["Utwórz zlecenie serwisowe dla tego wózka", "Powiadom kierownika obiektu", "Gdy data zmieni się na 30 kwietnia, przypomnienie zadziała jeszcze raz 16 kwietnia"],
      },
      {
        area: "Finanse",
        title: "Faktura od dostawcy na faktury@",
        when: "Na skrzynkę faktury@ przychodzi e-mail",
        check: "Czy krok załączników znajduje plik?",
        then: ["AI wczytuje go jako fakturę kosztową, w wybranym przez Ciebie procesie", "Ten sam NIP sprzedawcy i numer faktury: domyślnie pominięcie, do wyboru też błąd lub utworzenie", "Niezgodne sumy dają ostrzeżenie albo kończą krok błędem", "Księgowość dostaje powiadomienie"],
      },
      {
        area: "Kadry",
        title: "Urlop od 9 do 13 listopada",
        when: "Pracownik składa wniosek, a zostały mu 3 dni urlopu",
        check: "Kalendarz firmowy liczy 4 dni robocze, bo 11 listopada to święto",
        then: ["Zapisz 4 na wniosku", "Brakuje 1 dnia: powiadom pracownika i zakończ", "Gdy urlopu wystarczy: przekaż wniosek do akceptacji kierownika"],
      },
      {
        area: "Sprzedaż",
        title: "Wygrana szansa, umowa i zamówienie w ERP",
        when: "Szansa przechodzi na etap Wygrana",
        check: "NIP klienta w REGON: znaleziono, nie znaleziono lub błąd rejestru",
        then: ["Wygeneruj umowę i dołącz ją do szansy", "Utwórz rekord projektu", "Wyślij zamówienie do ERP metodą POST. Status inny niż 2xx albo przekroczenie 30 sekund idzie ścieżką błędu i powiadamia handlowców"],
      },
      {
        area: "Produkcja i logistyka",
        title: "Klawiatura: 2 sztuki w magazynie, minimum 12",
        when: "Rekord części się zmienia, a stan wynosi teraz 2",
        check: "Poniżej minimum, a Pobierz rekordy nie znajduje otwartego zapotrzebowania?",
        then: ["Utwórz zapotrzebowanie na 10 sztuk", "Wyślij e-mail do dostawcy wskazanego przy części"],
      },
      {
        area: "Obsługa klienta",
        title: "Zgłoszenie klienta priorytetowego blisko SLA",
        when: "Dla zgłoszenia pojawia się ostrzeżenie SLA",
        check: "Czy kontrahent ma Umowa priorytetowa = Tak?",
        then: ["Podnieś priorytet zgłoszenia", "Dodaj lidera zespołu jako obserwatora", "Wyślij liderowi SMS przez połączenie SMS Planet"],
      },
    ],
  },
  ladder: {
    title: "Reguły, skrypty, SQL i bloki, a przy każdym jego limity.",
    description:
      "Reguły mają limity, które warto znać od początku: pętla kończy się na 100 przebiegach, pobieranie na 100 rekordach, czekanie na 300 sekundach. Gdy zadanie z nich wyrośnie, kolejne narzędzie pracuje na tych samych obiektach, w tej samej organizacji.",
    whoLabel: "Zwykle",
    reachForLabel: "Sięgnij po to, gdy",
    steps: [
      {
        name: "Reguły",
        who: "Kierownik operacyjny lub właściciel procesu",
        reachFor: "Zadanie da się opisać jako wyzwalacz, sprawdzenie i działanie.",
        description: "Rysowane na kanwie i zapisywane bez wdrożenia, a następne uruchomienie korzysta już z nowej wersji. Jedno uruchomienie to najwyżej 1000 kroków, 10 odwiedzin kroku poza pętlą i 5 poziomów wywołań między regułami. Lista dłuższa niż limit pętli kończy krok błędem, zanim obsłuży pierwszy element.",
        sample: {
          label: "Reguła, tak jak się ją czyta",
          code: "GDY     Utworzono zgłoszenie\nJEŚLI   Priorytet = Krytyczny\nWTEDY   Ustaw Pilne = Tak\n        Powiadom {{ trigger.data.site_manager }}\n        Wygeneruj protokół przekazania",
        },
      },
      {
        name: "Skrypty",
        who: "Analityk, zaawansowany użytkownik lub programista",
        reachFor: "Trzeba coś wyliczyć albo formularz ma reagować w trakcie wpisywania.",
        description: "JavaScript w trzech osobnych miejscach. Krok skryptowy reguły działa na serwerze do 5 sekund, bez własnego dostępu do sieci. Skrypt formularza działa w przeglądarce i ma 15 typów, m.in. do wartości domyślnych, list wyboru, walidacji i obsługi przejść w procesie. Funkcja szablonu staje się filtrem w dokumentach i e-mailach. Krok reguły ma własny kod i nie wywoła skryptu formularza po kluczu.",
        sample: {
          label: "Skrypt formularza: rabat wyliczany w trakcie wpisywania",
          code: "const { quantity, tier } = ctx.record.values;\nif (quantity == null) return undefined;\n\nreturn tier === \"gold\" && quantity >= 100 ? 12 : 5;",
        },
      },
      {
        name: "Zapytania SQL",
        who: "Ktoś, kto zna dane",
        reachFor: "Pytanie obejmuje kilka obiektów i żaden filtr listy go nie zada.",
        description: "Nazwane zapytanie z typowanymi parametrami. Zapytanie odczytujące jest przy zapisie sprawdzane przez EXPLAIN w PostgreSQL. Instrukcja ma limit 10 sekund, a wynik domyślnie 1000 wierszy. Może zasilać reguły, raporty, listy, pola wyboru, liczniki i bloki.",
        sample: {
          label: "Zapisane zapytanie: części poniżej minimum",
          code: "select p.f_part_number as part_number,\n       p.f_stock_qty as in_stock,\n       :minimum - p.f_stock_qty as to_order,\n       round((:minimum - p.f_stock_qty) * p.f_unit_price, 2) as reorder_cost\nfrom runtime_dyn.\"dyn_spare_part_9b37ead4cc62\" p\nwhere p.f_stock_qty < :minimum\norder by p.f_stock_qty asc, reorder_cost desc",
        },
      },
      {
        name: "Własne bloki",
        who: "Programista albo pracujący z nim agent",
        reachFor: "Potrzebujesz ekranu, dla którego kreator stron nie ma bloku.",
        description: "HTML z Liquid, CSS, do 5 zapisanych zapytań i opcjonalny JavaScript do 64 000 znaków. Blok trafia na stronę lub rekord obok bloków standardowych, a bloki mogą renderować inne bloki do 3 poziomów w głąb.",
        sample: {
          label: "Własny blok: części do zamówienia",
          code: "<h3>Części do zamówienia</h3>\n{% for p in queries.parts.rows %}\n  <div class=\"row\">\n    {{ p.part }}: {{ p.in_stock }} z 12\n    <span>{{ p.reorder_cost }}</span>\n  </div>\n{% endfor %}",
        },
      },
    ],
    closingTitle: "Co łączy wszystkie cztery.",
    closing: [
      { title: "Te same dane", description: "Obiekty własne to prawdziwe tabele Postgres. Skrypty, zapytania i bloki czytają te obiekty, więc nie ma drugiej bazy do synchronizowania." },
      { title: "Te same zasady dostępu", description: "Zapytania działają na ograniczonych rolach bazy, z zabezpieczeniem wierszy na poziomie firmy. Przyciski w blokach korzystają ze zwykłych endpointów, które sprawdzają uprawnienia." },
      { title: "Nic do wdrażania", description: "Wszystko jest zapisane w konfiguracji Twojej organizacji, bez osobnego serwera i bez forka Opero." },
    ],
  },
  blocks: {
    title: "Zbuduj ekran, dla którego kreator stron nie ma bloku.",
    description:
      "Przykład: tablica Spare parts reorder board na zrzucie pokazuje 8 części poniżej minimum 12, każdą z paskiem stanu i kosztem zamówienia. Wystarczy jedno zapisane zapytanie i dziesięć linii HTML z Liquid, bez JavaScriptu, a podgląd działa na wybranej firmie.",
    bullets: [
      "Bloki są w jednej bibliotece, więc poprawka trafia na każdą stronę, która używa bloku.",
      "Pięć akcji przycisków: otwórz rekord, otwórz formularz, ustaw pole, uruchom regułę, odśwież.",
      "Zapytanie zwraca domyślnie 100 wierszy, najwyżej 500. Wykres przyjmuje do 2000 punktów.",
      "Odświeżanie co 30 sekund do 24 godzin albo na żywo, gdy zmienią się rekordy.",
      "Usunięcie pola wejściowego używanego na stronie albo zmiana jego typu zostaje odrzucona, z listą stron, których dotyczy.",
    ],
    image: {
      src: "/opero/low-code/custom-block-editor.webp",
      alt: "Edytor własnego bloku w Opero z HTML, zapytaniami i podglądem gotowego bloku na żywo",
      width: 2000,
      height: 1400,
    },
  },
  queries: {
    title: "Pytaj o dane z wielu obiektów jednym zapisanym zapytaniem.",
    description:
      "Przykład ze zrzutu: przy minimum = 12 w firmie ACME Inc. część KB-MBP-INT ma 2 sztuki na stanie, więc zapytanie zwraca 10 do zamówienia i koszt 4500,00. To samo zapytanie może zasilić listę, krok reguły i blok opisany wyżej.",
    consumersLabel: "Jedno zapytanie może zasilać",
    consumers: ["Raporty i wykresy", "Listy z akcjami na wierszach", "Pola wyboru", "Liczniki na stronach", "Kroki reguł", "Własne bloki", "Skrypty formularzy"],
    bullets: [
      "Zapytania odczytujące działają na roli bazy tylko do odczytu, a zakres firmy pilnuje zabezpieczenie na poziomie wierszy.",
      "Parametry są wiązane, nigdy wklejane do SQL. Typy tekst, liczba, data, wartość logiczna i UUID są egzekwowane.",
      "Zapytanie zapisujące wymaga osobnego uprawnienia i jest jedną instrukcją na tabelach Twoich obiektów oraz krótkiej liście tabel budżetów i pól własnych.",
      "Zapis przez SQL omija reguły, historię rekordu i indeksowanie wyszukiwarki. SQL ignoruje też widoczność rekordów tylko dla właściciela, więc dawaj go zaufanym autorom.",
    ],
    image: {
      src: "/opero/low-code/saved-query-editor.webp",
      alt: "Edytor zapisanych zapytań w Opero z zapytaniem SQL z parametrami i wierszami wyniku",
      width: 2000,
      height: 1400,
    },
  },
  trust: {
    title: "Przetestuj regułę na prawdziwym rekordzie, zanim cokolwiek wyśle.",
    description:
      "Test wykonuje warunki, skrypty, szablony i odczyty. Kroki, które coś by zapisały, wysłały lub wywołały, zostają przechwycone z końcowymi wartościami, także z odbiorcami i treścią e-maila, a do historii nic nie trafia. Jedno ograniczenie: krok po przechwyconym kroku dostaje znacznik, więc nie odczyta prawdziwej odpowiedzi webhooka.",
    items: [
      { title: "Zapisana ścieżka każdego uruchomienia", description: "Każda odwiedzina kroku zapisuje status, czas, gałąź i wynik, np. Switch, 22 ms, Technical. Długie wyniki są ucinane i oznaczane." },
      { title: "Powtórka po poprawce", description: "Powtórka uruchamia regułę na zapisanych danych wyzwalacza z wcześniejszego uruchomienia i tworzy nowy wpis. Działa naprawdę, więc sprawdź, co wyśle." },
      { title: "Gdy system partnera nie odpowiada", description: "Webhook kończy się błędem po 30 sekundach lub przy statusie innym niż 2xx. Ze ścieżką błędu uruchomienie idzie dalej nią, bez niej kończy się statusem Błąd. Opero samo nikogo nie alarmuje, więc dodaj na tej ścieżce powiadomienie." },
      { title: "Limity pętli", description: "Reguła, która jest już w łańcuchu, zostaje pominięta i odnotowana. Limity: 5 poziomów wywołań, 10 odwiedzin kroku, 1000 kroków na uruchomienie." },
      { title: "Gdy znika zależność", description: "Usuwanie obiektu lub modułu najpierw pokazuje korzystające z nich reguły. Reguły, które straciły zależność, wyłączają się z podaniem powodu, a osoby edytujące reguły dostają powiadomienie." },
      { title: "Szukanie wolnych reguł", description: "Ekran wydajności przypisuje czas do każdej reguły, skryptu, zapytania i bloku oraz oznacza uruchomienia ponad miękkie limity." },
    ],
    dryRunImage: {
      src: "/opero/low-code/rule-dry-run.webp",
      alt: "Wynik testu reguły w Opero z listą skutków, które by wywołała, bez wykonywania i zapisywania czegokolwiek",
      width: 2000,
      height: 1400,
    },
    historyImage: {
      src: "/opero/low-code/rule-run-history.webp",
      alt: "Uruchomienie reguły na kanwie Opero ze ścieżką krok po kroku i danymi każdego kroku",
      width: 2000,
      height: 1400,
    },
  },
  owners: {
    title: "Co może zmienić dział operacyjny, a co sprawdzić IT.",
    description:
      "Właściciel procesu edytuje regułę na tej samej kanwie, na której opiekun systemu czyta jej kroki, uprawnienia i historię uruchomień. Dostęp do każdej czynności to osobne uprawnienie, więc sam decydujesz, kto co dostaje.",
    columns: [
      {
        title: "Jeśli prowadzisz operacje",
        items: [
          "Edytujesz regułę i zapisujesz. Następne uruchomienie już z niej korzysta, bo reguły nie mają szkiców ani wersji do przywrócenia.",
          "Nową regułę zostawiasz nieaktywną i najpierw testujesz na prawdziwym rekordzie.",
          "W każdym uruchomieniu widzisz, którą gałęzią poszedł rekord i co zwrócił każdy krok.",
          "Wyłączasz regułę albo udostępniasz ją tylko wybranym firmom.",
          "Regułę ręczną podpinasz pod przycisk na rekordzie, liście lub stronie, z oknem na jej parametry.",
        ],
      },
      {
        title: "Jeśli odpowiadasz za technikę",
        items: [
          "Skrypty reguł mają tylko dozwolone obiekty globalne, bez fetch, timerów i eval, oraz limit 5 sekund.",
          "Skrypty formularzy działają w przeglądarce. Decyzja nadal należy do walidacji na serwerze, uprawnień i warunków procesu.",
          "Osobne uprawnienia: org.rules.read, create, update, delete i execute oraz org.savedQueries.executeMutation.",
          "Tokeny firm w zewnętrznym API uruchamiają reguły ręczne i odczytują historię ich uruchomień.",
          "Agenci MCP mogą walidować i testować reguły z uprawnieniami zalogowanego użytkownika.",
        ],
      },
    ],
    aiCta: "Zobacz, jak agenci budują w Opero",
  },
  faq,
  related: {
    title: "Zobacz też",
    items: [
      { feature: "processes", title: "Procesy i workflow", description: "Etapy, warunki przejść i przydzielanie zadań, z regułami uruchamianymi przy każdym przejściu." },
      { feature: "noCode", title: "Platforma no-code", description: "Obiekty, formularze, menu i strony, które Twoje reguły czytają i zmieniają." },
      { feature: "ai", title: "Kontekstowe AI", description: "Opisz regułę lub blok, a agent je zbuduje i przetestuje." },
    ],
  },
  finalCta: {
    title: "Przynieś jeden ręczny proces i przykładowy rekord.",
    description: "Opowiedz nam, kto to dziś robi, co sprawdza i co wysyła. Podczas prezentacji zbudujemy z tego regułę, przetestujemy ją na danych testowych i przejdziemy przez to, co zostało przechwycone. Jeśli będzie potrzebny skrypt lub zapytanie, pokażemy, gdzie je dodać.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Skontaktuj się z nami",
  },
  seoText: {
    title: "Automatyzacja procesów i low-code na jednym modelu danych.",
    paragraphs: [
      "Reguły Opero startują od zmiany rekordu, przejścia w procesie, przypomnienia o dacie, przychodzącego e-maila, harmonogramu cron, przycisku albo wywołania zewnętrznego API. Idą po grafie kroków: warunki i przełączniki, pętle do 100 przebiegów, zmiany rekordów, dokumenty, e-maile, webhooki z limitem 30 sekund. Test przechwytuje każdy zapis i wysyłkę, zanim reguła zacznie działać, a każde prawdziwe uruchomienie zachowuje swoją ścieżkę krok po kroku.",
      "Gdy reguła nie wystarcza, skrypty, SQL i własne bloki pracują na tych samych obiektach. Skrypty reguł działają na serwerze z limitem 5 sekund, a skrypty formularzy w przeglądarce i nie zastępują walidacji na serwerze. Zapisane zapytania działają na ograniczonych rolach bazy z limitem 10 sekund. Własne bloki dodają ekrany do stron i rekordów, korzystając z maksymalnie 5 zapytań każdy.",
    ],
  },
};
