import type { ArticlePromoCopy } from "@/content/types";

/** Banery funkcji Opero wybierane przy artykule w polu „Promowana funkcja”. */
export const articlePromos: ArticlePromoCopy = {
  "obieg-faktur-ksef": {
    name: "Faktury z KSeF prosto w obiegu",
    description:
      "Opero pobiera faktury zakupowe z KSeF i od razu zakłada z nich faktury kosztowe z danymi z XML-a. Nikt nic nie przepisuje, a każda faktura dostaje właściciela i termin.",
  },
  "sciezki-akceptacji": {
    name: "Akceptacja według kwoty i roli",
    description:
      "Ścieżka zależy od kwoty i rodzaju kosztu, a każdy akceptujący dostaje zadanie z terminem. Faktury bez opisu nie przekażesz dalej, a historia zapisuje każdą decyzję.",
  },
  "projektant-procesow": {
    name: "Proces narysowany na kanwie",
    description:
      "Etapy, przejścia i warunki rysujesz jak schemat, a Opero prowadzi według nich każdą sprawę. Proces zmienia jego właściciel, bez programisty.",
  },
  "zadania-i-kanban": {
    name: "Moje zadania i tablica kanban",
    description:
      "Każdy widzi swoje zadania z terminami, a zespół całą pracę na jednej tablicy. Wejście w etap procesu samo tworzy zadanie dla osoby albo roli.",
  },
  "rejestr-dokumentow": {
    name: "Dokument jako rekord, nie plik",
    description:
      "Każdy dokument ma numer, właściciela, etap i pliki w jednym miejscu. Widać, u kogo jest i co dalej, bez szukania po mailach i dyskach.",
  },
  "podglad-plikow": {
    name: "Podgląd pliku obok formularza",
    description:
      "Skan albo PDF otwiera się przy rekordzie, bez pobierania, a wersje pliku zostają w historii. Dostęp do plików wynika z uprawnień do rekordu.",
  },
  "szablony-dokumentow": {
    name: "Dokumenty PDF z danych rekordu",
    description:
      "Umowę, protokół albo zestawienie generujesz z szablonu, a dane wstawiają się same. Gotowy PDF trafia do rekordu, ręcznie albo regułą.",
  },
  "powiadomienia-o-terminach": {
    name: "Sygnał, zanim termin minie",
    description:
      "Reguła przypomina o dacie z rekordu, na przykład 30 dni przed końcem umowy, i powiadamia właściwą osobę. Terminów pilnuje system, a nie czyjaś pamięć.",
  },
  "reguly-automatyzacji": {
    name: "Reguły: gdy zajdzie warunek, wykonaj akcję",
    description:
      "Reguła ustawia pole, wysyła powiadomienie, tworzy rekord albo wywołuje webhook. Przed uruchomieniem sprawdzisz ją na próbę, a każdy przebieg zostaje w dzienniku.",
  },
  "zapytania-sql-i-bloki": {
    name: "SQL i własne bloki, gdy konfiguracji jest za mało",
    description:
      "Zapytania SQL zasilają listy, raporty i pola wyboru, a bloki HTML pokazują dane tam, gdzie ich potrzebujesz. Wszystko na danych, które już są w Opero.",
  },
  "rejestr-zamiast-arkusza": {
    name: "Własny rejestr zamiast arkusza",
    description:
      "Obiekt z polami z typem, słownikami i powiązaniami zastępuje Excela, a z jego definicji powstają lista, formularz i API. Bez programisty i bez osobnej bazy.",
  },
  "formularze-per-rola": {
    name: "Ten sam rekord, inny formularz dla każdej roli",
    description:
      "Serwisant widzi swoje pola, księgowość swoje, a kierownik całość. Układ formularza ustawiasz w sekcjach i zakładkach, bez kopiowania danych.",
  },
  "formularz-publiczny": {
    name: "Formularz dla klienta, który zakłada sprawę",
    description:
      "Klient wypełnia formularz na stronie bez logowania, a zgłoszenie od razu staje się rekordem z właścicielem i etapem. Nic nie trzeba przepisywać z maila.",
  },
  "strona-startowa": {
    name: "Strona startowa z tym, co ważne dziś",
    description:
      "Każdy dział zaczyna dzień od własnej strony: zadań, liczb i list, które go dotyczą. Strony składasz z bloków, bez programisty.",
  },
  "platforma-no-code": {
    name: "System dopasowany do firmy bez projektu IT",
    description:
      "Obiekty, formularze, procesy i raporty konfigurujesz sam, a zmianę wprowadzasz w dniu, w którym jej potrzebujesz. Bez budowania systemu od zera.",
  },
  "raporty-z-drazeniem": {
    name: "Kliknij liczbę i zobacz jej rekordy",
    description:
      "Raporty i dashboardy liczą się na bieżących danych, a każda suma prowadzi do wierszy, z których powstała. Jedna definicja zamiast dwóch arkuszy z różnymi wynikami.",
  },
  "lejek-sprzedazy": {
    name: "Szanse sprzedaży pod kontrolą",
    description:
      "Każda szansa ma etap, właściciela i następny krok, a raport pokazuje lejek i te, których nikt nie ruszał. Lejek budujesz na własnym obiekcie, z własnymi etapami.",
  },
  "historia-zmian": {
    name: "Kto, co i kiedy zmienił",
    description:
      "Historia rekordu zapisuje każdą zmianę pola ze starą i nową wartością, a historia procesu każdą decyzję. Po roku odtworzysz sprawę bez wypytywania ludzi.",
  },
  "uprawnienia-do-pol": {
    name: "Dostęp do rekordu i pojedynczego pola",
    description:
      "Role decydują, kto widzi i edytuje który obiekt, rekord i pole. Gdy ktoś czegoś nie widzi, diagnostyka dostępu pokaże dlaczego.",
  },
  "wiele-spolek": {
    name: "Kilka spółek w jednej organizacji",
    description:
      "Każda spółka ma swoje dane i uprawnienia, a wspólne procesy, słowniki i raporty konfigurujesz raz. Bez osobnego systemu dla każdej firmy.",
  },
  "api-i-webhooki": {
    name: "API i webhooki do ERP i księgowości",
    description:
      "Otwarte API i webhooki wywoływane w regułach łączą Opero z ERP, księgowością i innymi narzędziami. Gotowych konektorów nie ma, połączenie buduje się raz.",
  },
  "asystent-ai": {
    name: "AI, które zna Twój system",
    description:
      "Asystent AI połączony przez MCP odpowiada na pytania o bieżące dane i konfiguruje Opero w rozmowie, z uprawnieniami Twojej roli. Dostęp przez MCP to opcjonalny moduł licencji.",
  },
};
