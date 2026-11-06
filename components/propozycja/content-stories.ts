import type { ScreenName } from "./Screen";
import type { StoryStep } from "./Story";
import { polish } from "./polish";

/**
 * The story each area page tells, step by step, on real screens from the
 * demonstration organisation Demo Firma.
 *
 * Every step is one thing the reader would do or see in Opero, in the order
 * they would meet it, and every screen is the place where it happens. The
 * captions say only what the screen shows: where a part of the product has
 * no screen of its own in Demo Firma (the assistant), the story shows what it
 * works on and says so.
 */
export type AreaStory = {
  hero: { name: ScreenName; caption: string };
  title: [string, string];
  steps: StoryStep[];
};

/**
 * The home page follows one contract through five stages, drawn. Right after
 * it, the same contract in the real product: the card it lives on, the
 * process behind it, and the settings of the stage it is about to enter.
 */
export const homeStory = polish({
  title: ["Ta sama umowa", "w prawdziwym Opero."] as [string, string],
  steps: [
    {
      title: "Umowa ma swoją kartę",
      text: "UM/2026/0014 w organizacji Demo Firma: status, kontrahent, typ, wartość, okres obowiązywania. Z prawej panel procesu z obiegiem, etapem i przypisaniem.",
      screen: "karta-umowy",
      focus: { x: 0.93, y: 0.2, zoom: 1.8 },
    },
    {
      title: "Za nią stoi proces",
      text: "Obieg umowy narysowany w kreatorze: etapy, przejścia między nimi i droga powrotu do poprawy. Tę tablicę układa administrator, nie programista.",
      screen: "proces-wizualny",
      focus: { x: 0.32, y: 0.36, zoom: 2 },
    },
    {
      title: "Następny etap już wie, co zrobić",
      text: "Akceptacja finansowa otworzy zadanie „Potwierdź warunki finansowe” z terminem trzech dni. Nikt nie musi o tym pamiętać ani o to prosić.",
      screen: "etap-zadanie",
      focus: { x: 0.5, y: 0.27, zoom: 1.6 },
    },
    {
      title: "I kto może ją przenieść dalej",
      text: "Ustawienia etapu mówią, kto edytuje umowę i kto przenosi ją do podpisu: każdy, kto ją widzi, albo tylko osoba przypisana. Zmienia się to jednym kliknięciem.",
      screen: "etap-dostep",
      focus: { x: 0.6, y: 0.28, zoom: 1.6 },
    },
    {
      title: "A zarząd widzi cały portfel",
      text: "Kokpit umów liczy na bieżąco wartość obowiązujących umów i te, które wygasają w ciągu 60 dni. Z tych samych danych, na których pracuje obieg.",
      screen: "kokpit-umow",
      focus: { x: 0.17, y: 0.29, zoom: 1.8 },
    },
  ] satisfies StoryStep[],
});

export const areaStories: Record<string, AreaStory> = polish({
  moduly: {
    hero: { name: "obiekt-umowa", caption: "Obiekt „Umowa” w konfiguracji Demo Firma: 27 pól, każde z kluczem, typem i informacją, na których formularzach występuje." },
    title: ["Od pustego modułu", "do ekranu, na którym pracuje zespół."],
    steps: [
      {
        title: "Zaczynacie od modułu",
        text: "Każdy obszar firmy dostaje swój moduł. W Demo Firma są trzy: Kancelaria, Umowy i Zakupy. Żaden nie jest gotowym produktem z pudełka, każdy powstał w konfiguracji.",
        screen: "moduly-wlasne",
        focus: { x: 0.1, y: 0.28, zoom: 1.8 },
      },
      {
        title: "Obiekt opisuje dane językiem firmy",
        text: "Umowa ma numer, kontrahenta, wartość, okres obowiązywania i opiekuna. Pola dodaje się w tabeli, a Opero od razu pokazuje, na których formularzach są użyte.",
        screen: "obiekt-umowa",
        focus: { x: 0.25, y: 0.6, zoom: 1.6 },
      },
      {
        title: "Słowniki trzymają wspólne wartości",
        text: "Typ umowy, rodzaj pisma, jednostka organizacyjna i centrum kosztów to słowniki. Jedna lista dla wszystkich modułów, więc „Dział Prawny” znaczy to samo w umowie i w piśmie.",
        screen: "slowniki",
        focus: { x: 0.25, y: 0.42, zoom: 1.6 },
      },
      {
        title: "Z tego powstaje ekran pracy",
        text: "Formularz układa pola w sekcje: strona umowy, warunki finansowe, okres obowiązywania. Z boku stoi panel procesu, bo umowa ma swój obieg.",
        screen: "karta-umowy",
        focus: { x: 0.25, y: 0.33, zoom: 1.6 },
      },
      {
        title: "A zespół zaczyna dzień od pulpitu",
        text: "Kokpit umów liczy wartość obowiązujących umów i te, które wygasają w ciągu 60 dni. Ten sam moduł, inne spojrzenie.",
        screen: "kokpit-umow",
        focus: { x: 0.17, y: 0.29, zoom: 1.8 },
      },
    ],
  },
  procesy: {
    hero: { name: "proces-wizualny", caption: "Proces „Obieg umowy” w kreatorze: etapy od projektu do zakończenia, z terminami i drogą powrotu do poprawy." },
    title: ["Dodajecie etap.", "Reszta wynika z jego ustawień."],
    steps: [
      {
        title: "Rysujecie etapy i przejścia",
        text: "Obieg umowy to sześć etapów na jednej tablicy: projekt, opiniowanie prawne, akceptacja finansowa, podpis, obowiązywanie, zakończenie. Strzałki to przejścia, a jedna z nich wraca do poprawy.",
        screen: "proces-wizualny",
        focus: { x: 0.32, y: 0.36, zoom: 2 },
      },
      {
        title: "Etap wie, kto za niego odpowiada",
        text: "Klikacie etap „Akceptacja finansowa” i ustawiacie przypisanie: jedna osoba czy kilka, wybór automatyczny przy wejściu, krąg ludzi, z których można wybrać.",
        screen: "etap-rodzaj",
        focus: { x: 0.45, y: 0.66, zoom: 1.6 },
      },
      {
        title: "Wejście na etap otwiera zadanie z terminem",
        text: "„Potwierdź warunki finansowe” trafia na listę zadań odpowiedzialnej osoby z terminem trzech dni od wejścia sprawy na etap. Nikt nie musi o tym pamiętać.",
        screen: "etap-zadanie",
        focus: { x: 0.5, y: 0.27, zoom: 1.6 },
      },
      {
        title: "Etap decyduje, kto może przenieść sprawę dalej",
        text: "Tu ustawiacie, kto edytuje umowę na tym etapie i kto może ją przesunąć do podpisu: tylko przypisana osoba albo każdy, kto ją widzi.",
        screen: "etap-dostep",
        focus: { x: 0.6, y: 0.28, zoom: 1.6 },
      },
      {
        title: "Przejście może uruchomić regułę",
        text: "Kiedy sprawa wchodzi na wskazany etap, reguła sprawdza warunek i ustawia pole. Tu: faktura na etapie Księgowość dostaje znacznik gotowości do KSeF.",
        screen: "regula-warunek",
        focus: { x: 0.45, y: 0.5, zoom: 1.5 },
      },
      {
        title: "A sprawa idzie przez etapy",
        text: "Na karcie umowy UM/2026/0014 panel procesu z prawej pokazuje obieg, bieżący etap i przypisanie. Tak wygląda to dla osoby, która nad umową pracuje.",
        screen: "karta-umowy",
        focus: { x: 0.93, y: 0.2, zoom: 1.8 },
      },
    ],
  },
  dokumenty: {
    hero: { name: "karta-pisma", caption: "Pismo przychodzące KAN/2026/00013 na etapie rejestracji w kancelarii: numer, kanał wpływu, nadawca i streszczenie." },
    title: ["Pismo wpływa raz", "i od tej chwili jest sprawą."],
    steps: [
      {
        title: "Rejestracja nadaje numer i etap",
        text: "Pismo dostaje numer kancelaryjny, rodzaj i kanał wpływu: e-mail, poczta, ePUAP, e-Doręczenia. Od razu stoi na pierwszym etapie obiegu.",
        screen: "karta-pisma",
        focus: { x: 0.33, y: 0.31, zoom: 1.6 },
      },
      {
        title: "Nadawca pochodzi z bazy kontrahentów",
        text: "Nadawcę wybiera się z tej samej bazy, której używają umowy i faktury, z NIP-em. Pisma od tej samej firmy łączą się same.",
        screen: "karta-pisma",
        focus: { x: 0.25, y: 0.5, zoom: 1.7 },
      },
      {
        title: "Kancelaria widzi cały wpływ",
        text: "Pulpit pokazuje pisma po terminie odpowiedzi, sprawy w toku i to, którędy korespondencja przychodzi. Jedno spojrzenie zamiast obdzwaniania działów.",
        screen: "kokpit-kancelarii",
        focus: { x: 0.3, y: 0.27, zoom: 1.8 },
      },
      {
        title: "Dokument powstaje z danych sprawy",
        text: "Szablon układa stałą treść i pola z rekordu. Protokół zgłoszenia serwisowego wypełnia się tytułem, klientem, kategorią i terminem, bez przepisywania.",
        screen: "szablon-dokumentu",
        focus: { x: 0.33, y: 0.27, zoom: 2 },
      },
      {
        title: "Terminy i dekretacja w liczbach",
        text: "Analityka kancelarii zestawia pisma według jednostek i rodzajów. Widać, gdzie korespondencja czeka najdłużej.",
        screen: "analityka-kancelarii",
        focus: { x: 0.3, y: 0.7, zoom: 1.6 },
      },
    ],
  },
  reguly: {
    hero: { name: "regula-warunek", caption: "Reguła w Demo Firma: przejście w procesie faktur, warunek wejścia na etap Księgowość i dwie akcje, zależnie od wyniku." },
    title: ["Gdy coś się wydarzy,", "system robi resztę."],
    steps: [
      {
        title: "Wszystko zaczyna się od zdarzenia",
        text: "Wyzwalaczem jest tu przejście w procesie. Może nim być też zapis rekordu, wiadomość e-mail, harmonogram albo faktura odebrana z KSeF.",
        screen: "regula-warunek",
        focus: { x: 0.18, y: 0.46, zoom: 1.6 },
      },
      {
        title: "Warunek wybiera drogę",
        text: "„Czy wchodzi na etap Księgowość?” ma dwa wyjścia, prawdę i fałsz. Reguła idzie dalej tylko jedną z nich.",
        screen: "regula-warunek",
        focus: { x: 0.45, y: 0.5, zoom: 1.5 },
      },
      {
        title: "Kroki zmieniają dane same",
        text: "Na jednej drodze faktura dostaje znacznik gotowości do KSeF, na drugiej go traci. Nikt nie przestawia pola ręcznie i nikt o nim nie zapomina.",
        screen: "regula-warunek",
        focus: { x: 0.83, y: 0.25, zoom: 1.5 },
      },
      {
        title: "Etap ma termin, reguła pilnuje reszty",
        text: "Zadanie z etapu ma termin wykonania. Reguła na harmonogramie może przypomnieć o nim albo przekazać sprawę dalej, zanim termin minie.",
        screen: "etap-zadanie",
        focus: { x: 0.5, y: 0.27, zoom: 1.6 },
      },
    ],
  },
  integracje: {
    hero: { name: "integracja-ksef", caption: "Integracja KSeF w ustawieniach organizacji Demo Firma: poświadczenia, środowisko, pobieranie faktur i walidacja FA(3)." },
    title: ["Usługi państwa podłączone", "tam, gdzie płynie praca."],
    steps: [
      {
        title: "Połączenie ustawia się w organizacji",
        text: "KSeF konfiguruje się raz: poświadczenia, środowisko, częstotliwość pobierania faktur zakupowych, walidacja według schemy FA(3). Demo Firma pracuje na środowisku testowym.",
        screen: "integracja-ksef",
        focus: { x: 0.3, y: 0.63, zoom: 1.6 },
      },
      {
        title: "Proces przygotowuje fakturę do wysyłki",
        text: "Faktura sprzedaży przechodzi przez etapy. Kiedy trafia do księgowości, reguła oznacza ją jako gotową do KSeF, a wysyłka zabiera tylko takie.",
        screen: "regula-warunek",
        focus: { x: 0.83, y: 0.25, zoom: 1.5 },
      },
      {
        title: "Korespondencja z każdego kanału w jednym rejestrze",
        text: "E-mail, poczta tradycyjna, ePUAP i e-Doręczenia trafiają do tej samej kancelarii jako kanały wpływu. Pulpit pokazuje je obok siebie.",
        screen: "kokpit-kancelarii",
      },
      {
        title: "Kontrahent z NIP-em, wspólny dla wszystkiego",
        text: "Nadawca pisma, strona umowy i nabywca faktury to ten sam kontrahent z tej samej bazy, z numerem NIP do weryfikacji.",
        screen: "karta-pisma",
        focus: { x: 0.25, y: 0.5, zoom: 1.7 },
      },
    ],
  },
  raporty: {
    hero: { name: "kokpit-umow", caption: "Kokpit umów: wartość obowiązujących umów i te, które wygasają w ciągu 60 dni, liczone na bieżąco z rejestru." },
    title: ["Od zapytania", "do liczby na pulpicie zarządu."],
    steps: [
      {
        title: "Raport bierze dane u źródła",
        text: "Źródłem jest zapytanie na żywych danych modułów. Raport „Wnioski zakupowe wg etapu obiegu” pokazuje, gdzie zatrzymują się pieniądze w procesie zakupowym.",
        screen: "raport-edycja",
        focus: { x: 0.35, y: 0.62, zoom: 1.6 },
      },
      {
        title: "Tabela przestawna bez arkusza",
        text: "Umowy według typu i etapu, z liczbą i wartością netto. Wiersze i kolumny przestawia się na ekranie, a nie w eksporcie.",
        screen: "analityka-umow",
        focus: { x: 0.33, y: 0.55, zoom: 1.8 },
      },
      {
        title: "Pulpit składa to w jeden widok",
        text: "Wskaźniki u góry, wykresy pod nimi. Wartość portfela, umowy wygasające w 60 dni, rozkład według typu i etapu.",
        screen: "kokpit-umow",
        focus: { x: 0.25, y: 0.72, zoom: 1.4 },
      },
      {
        title: "Ten sam mechanizm w każdym obszarze",
        text: "Kancelaria ma swój pulpit, zakupy swój, zarząd centrum analityczne. Wszystkie czytają te same dane, na których pracują procesy.",
        screen: "analityka-kancelarii",
        focus: { x: 0.35, y: 0.37, zoom: 1.6 },
      },
    ],
  },
  ai: {
    hero: { name: "obiekt-umowa", caption: "Struktura, którą zna asystent: obiekt „Umowa” z polami, typami i formularzami. Asystent pracuje na tych samych elementach co administrator." },
    title: ["Asystent nie zgaduje.", "Czyta to, co jest w systemie."],
    steps: [
      {
        title: "Zna strukturę Waszych danych",
        text: "Asystent widzi obiekty i pola tak, jak je skonfigurowaliście: że umowa ma kontrahenta, wartość i okres obowiązywania. Dlatego odpowiada konkretnie, a nie ogólnie.",
        screen: "obiekt-umowa",
        focus: { x: 0.25, y: 0.6, zoom: 1.6 },
      },
      {
        title: "Zna procesy i ich etapy",
        text: "Wie, przez jakie etapy przechodzi umowa i kto jest za nie odpowiedzialny. Pomaga ułożyć nowy proces albo dodać etap do istniejącego.",
        screen: "proces-wizualny",
        focus: { x: 0.32, y: 0.36, zoom: 2 },
      },
      {
        title: "Odpowiada na pytania o dane",
        text: "Pytanie o umowy wygasające w tym kwartale dotyczy tych samych danych, które liczy pulpit. Odpowiedź da się sprawdzić na liście rekordów.",
        screen: "analityka-umow",
        focus: { x: 0.25, y: 0.29, zoom: 1.8 },
      },
      {
        title: "Działa w granicach uprawnień",
        text: "Asystent widzi tyle, ile rola użytkownika, który pyta. Zmiana, którą zaproponuje w konfiguracji, wchodzi dopiero po zatwierdzeniu przez człowieka.",
        screen: "etap-dostep",
        focus: { x: 0.6, y: 0.28, zoom: 1.6 },
      },
    ],
  },
  kontrola: {
    hero: { name: "role", caption: "Role organizacji Demo Firma: każda z własnym zakresem uprawnień i listą osób, które ją mają." },
    title: ["Dostęp ustawia się raz.", "Obowiązuje wszędzie."],
    steps: [
      {
        title: "Role nadają uprawnienia",
        text: "Administrator, kierownik, pracownik, kadry. Zmiana uprawnień roli obejmuje od razu wszystkich, którzy ją mają.",
        screen: "role",
        focus: { x: 0.45, y: 0.52, zoom: 1.5 },
      },
      {
        title: "Dostęp zmienia się razem z etapem",
        text: "Każdy etap ma własne zasady: kto edytuje sprawę i kto może ją przenieść dalej. W Demo Firma akceptację finansową przenosi każdy, kto widzi umowę, a inny etap można zawęzić do osoby przypisanej.",
        screen: "etap-dostep",
        focus: { x: 0.6, y: 0.28, zoom: 1.6 },
      },
      {
        title: "Każda spółka ma własne rekordy",
        text: "Przy obiekcie wybieracie, czy każda firma w organizacji ma własne umowy, czy wszystkie korzystają ze wspólnego zbioru, i kto widzi które rekordy. Konfiguracja wspólna, dane osobne.",
        screen: "obiekt-wlasnosc",
        focus: { x: 0.3, y: 0.2, zoom: 1.6 },
      },
      {
        title: "Raport ma swój zakres",
        text: "Raport firmowy liczy dane jednej spółki, organizacyjny wszystkich, ale tylko dla osób, którym go udostępniono.",
        screen: "raport-edycja",
        focus: { x: 0.35, y: 0.71, zoom: 1.6 },
      },
    ],
  },
  aplikacje: {
    hero: { name: "kokpit-kancelarii", caption: "Pulpit kancelarii w Demo Firma: pisma po terminie odpowiedzi, sprawy w toku i kanały wpływu korespondencji." },
    title: ["Gotowe aplikacje", "na tych samych zasadach co Wasze moduły."],
    steps: [
      {
        title: "Faktury z KSeF",
        text: "Połączenie z Krajowym Systemem e-Faktur ustawia się w organizacji: pobieranie faktur zakupowych, wysyłka sprzedaży, walidacja FA(3).",
        screen: "integracja-ksef",
        focus: { x: 0.3, y: 0.63, zoom: 1.6 },
      },
      {
        title: "Obieg faktur na etapach",
        text: "Faktura przechodzi przez etapy jak każda inna sprawa, a reguła przygotowuje ją do wysyłki na właściwym etapie.",
        screen: "regula-warunek",
        focus: { x: 0.45, y: 0.5, zoom: 1.5 },
      },
      {
        title: "Kancelaria i e-Doręczenia",
        text: "Korespondencja z każdego kanału, w tym z e-Doręczeń, trafia do rejestru pism z numerem i obiegiem.",
        screen: "karta-pisma",
        focus: { x: 0.33, y: 0.31, zoom: 1.6 },
      },
      {
        title: "Dokumenty z szablonów",
        text: "Protokoły, pisma i umowy generują się z danych rekordu według szablonu, w aktualnej wersji.",
        screen: "szablon-dokumentu",
        focus: { x: 0.33, y: 0.27, zoom: 2 },
      },
    ],
  },
});
