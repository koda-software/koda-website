/**
 * Every word and every number on the proposal page, in one place.
 *
 * The copy follows the positioning settled on 2 November 2026
 * (`KodaSoft-Marketing/marketing/pozycjonowanie/opero-system-operacyjny.md`):
 * Opero as the foundation for an organisation's own applications, ready-made
 * applications where mistakes cost most, custom modules alongside them, and AI
 * that speeds the work up inside limits people set. The vocabulary is the one
 * that document fixes - "fundament", "architektura", "kontrola" - and it never
 * reaches for "low-code", "BPM", "workflow" or "narzędzie".
 *
 * Product data comes only from the demo organisation, Demo Firma, and is the
 * same data the LinkedIn banner and post frames already show: contract
 * UM/2026/0014 and order ZAM/2026/0147. Nothing here is a measured result, a
 * client or a quotation, because the site may not carry any it cannot prove.
 */

import { polish } from "./polish";

export type StageState = "done" | "current" | "future";


export const hero = polish({
  /* Split in two so the second clause can carry the muted tone, the two-tone
     headline the post frames use. */
  title: ["Zamień sposób działania", "organizacji w oprogramowanie"],
  lead: "Fundament dla aplikacji całej organizacji. Bezpieczna architektura, pełna kontrola i swoboda budowy bez ograniczeń.",
  primary: "Umów demo",
  secondary: "Zobacz, jak to działa",
  canvasCaption: "Ekran z Opero, nie rysunek: umowa w organizacji demonstracyjnej, na etapie opinii prawnej.",
});

/** The contract that appears in the hero and then travels through the process. */
export const contract = polish({
  reference: "UM/2026/0014",
  title: "Umowa wdrożeniowa systemu zarządzania jakością",
  organisation: "Demo Firma",
  module: "Umowy",
  fields: [
    { label: "Kontrahent", value: "Kancelaria Prawna Nowak i Wspólnicy" },
    { label: "Typ umowy", value: "Umowa o świadczenie usług" },
    { label: "Wartość netto", value: "168 000 PLN" },
    { label: "Poziom ryzyka", value: "Średnie" },
  ],
  stages: ["Projekt", "Opiniowanie prawne", "Akceptacja finansowa", "Do podpisu", "Obowiązuje"],
  notification: { title: "Nowe zadanie", detail: "Opiniowanie prawne · 5 dni" },
});

export const scatter = polish({
  lines: [
    "Organizacje chcą budować własne aplikacje.",
    "Sztuczna inteligencja ten trend przyspiesza.",
  ],
  resolve: ["Brakuje fundamentu,", "na którym mogą bezpiecznie działać latami."],
  /*
   * The pieces an organisation's way of working is usually scattered across.
   * Office examples only, no logistics, no names of people. The AI prototype
   * is in the list on purpose: it is the newest kind of fragment, and the
   * one the positioning argues needs a foundation most.
   */
  /*
   * `to` is what the piece becomes inside one system: the same work, under a
   * plain module name. `x`, `y` and `r` place it in the scattered field, in
   * percent of the field and degrees of tilt; they are hand-set rather than
   * random so the composition is the same on every load.
   */
  fragments: [
    { kind: "sheet", text: "Rejestr umów (kopia 3).xlsx", to: "Umowy", x: 12, y: 16, r: -6 },
    { kind: "mail", text: "RE: RE: Akceptacja faktury?", to: "Faktury z KSeF", x: 41, y: 8, r: 4 },
    { kind: "app", text: "Prototyp z AI, działa u jednej osoby", to: "Aplikacja z AI", x: 70, y: 14, r: -3 },
    { kind: "doc", text: "Wnioski urlopowe 2026.docx", to: "Wnioski urlopowe", x: 80, y: 40, r: 7 },
    { kind: "sheet", text: "Zakupy, arkusz działu", to: "Zakupy", x: 22, y: 42, r: 5 },
    { kind: "sheet", text: "Makro do faktur.xlsm", to: "Rozliczenia", x: 56, y: 34, r: -8 },
    { kind: "app", text: "Zgłoszenia, tabela w chmurze", to: "Obsługa zgłoszeń", x: 74, y: 62, r: -4 },
    { kind: "doc", text: "Pełnomocnictwa, segregator", to: "Pełnomocnictwa", x: 9, y: 68, r: -9 },
    { kind: "mail", text: "Fwd: Kto zatwierdza ten zakup?", to: "Ścieżki akceptacji", x: 44, y: 62, r: 6 },
    { kind: "app", text: "Aplikacja od agencji, 2019", to: "Projekty", x: 63, y: 84, r: 3 },
    { kind: "doc", text: "Ewidencja czasu, kartki", to: "Ewidencja czasu", x: 82, y: 84, r: -6 },
    { kind: "sheet", text: "Formularz online, eksport CSV", to: "Kontrahenci", x: 27, y: 88, r: 2 },
  ],
  system: "Jeden system · jedna historia każdej sprawy",
});

export const foundation = polish({
  title: ["Opero jest", "tym fundamentem."],
  lead: "Jedna architektura, pełna kontrola i bezpieczeństwo całości. Na niej powstają aplikacje dla każdego obszaru, od finansów i kadr po umowy, zakupy i rejestry zgodności.",
  /* The three faces of the Opero mark and the circle that holds them, read as
     the parts of the platform. Order is the order they assemble in. */
  parts: [
    {
      id: "dane",
      face: "lw",
      name: "Dane i ekrany",
      text: "Obiekty i pola, formularze, ekrany, dokumenty, raporty.",
      href: "no-code",
    },
    {
      id: "procesy",
      face: "rw",
      name: "Procesy i automatyzacja",
      text: "Etapy i zadania, reguły, integracje, API, asystent AI.",
      href: "procesy-workflow",
    },
    {
      id: "aplikacje",
      face: "lid",
      name: "Aplikacje",
      text: "Gotowe: KSeF, kontrahenci, e\u2011Doręczenia. Własne: umowy, zakupy, projekty.",
      href: "gotowe-aplikacje",
    },
    {
      id: "kontrola",
      face: "ring",
      name: "Kontrola",
      text: "Role, uprawnienia i historia każdej zmiany, wspólne dla całości.",
      href: "bezpieczenstwo-uprawnienia",
    },
  ],
  note: "Trzy ściany znaku Opero to trzy części platformy, a każdy kafel to moduł. Brakuje Wam jakiegoś? Dokłada się go w konfiguracji, bez przebudowy reszty.",
});

/**
 * One beat per stage of the contract. Each says what stops happening in the
 * organisation at that moment, not what feature fires - the consequence
 * rather than the capability, which is the brand's rule for every argument.
 */
export const process = polish({
  intro: "Jedna umowa, pięć etapów. Przewiń, żeby ją przeprowadzić.",
  beats: [
    {
      stage: "Projekt",
      text: "Umowa ma właściciela od pierwszej wersji, a nie od pierwszego problemu.",
      event: { kind: "Utworzono z szablonu", detail: "Umowa o świadczenie usług" },
      log: "pon 09:12 · Utworzono z szablonu",
    },
    {
      stage: "Opiniowanie prawne",
      text: "Dział prawny dostaje zadanie z terminem. Nikt nie musi o nim pamiętać.",
      event: { kind: "Nowe zadanie", detail: "Opiniowanie prawne · 5 dni" },
      log: "pon 09:14 · Zadanie dla działu prawnego",
    },
    {
      stage: "Akceptacja finansowa",
      text: "Reguła sprawdza wartość. Powyżej 100 000 zł decyzję podejmuje dyrektor finansowy.",
      event: { kind: "Reguła", detail: "Wartość netto > 100 000 PLN → dyrektor finansowy" },
      log: "śr 15:40 · Opinia prawna zapisana",
    },
    {
      stage: "Do podpisu",
      text: "Dokument idzie do podpisu z pełną historią opinii i akceptacji.",
      event: { kind: "Wygenerowano dokument", detail: "UM-2026-0014.pdf" },
      log: "czw 10:05 · Akceptacja finansowa",
    },
    {
      stage: "Obowiązuje",
      text: "Trzydzieści dni przed końcem umowy właściciel dostaje zadanie przeglądu.",
      event: { kind: "Przypomnienie zaplanowane", detail: "30 dni przed końcem umowy" },
      log: "pt 08:50 · Umowa obowiązuje",
    },
  ],
});

export const build = polish({
  title: "Własne moduły dla",
  /* Rolled through under the title as the chapter scrolls. Office areas only. */
  words: ["umów", "zakupów", "urlopów", "reklamacji", "audytów", "projektów"],
  lead: "Moduł składa się z pól, formularzy, procesów, reguł i raportów. Swoboda budowy jest ogromna, a każdy element ma czytelną strukturę, którą administrator rozumie i może zmienić.",
  blocks: ["Pola", "Formularz", "Proces", "Reguły", "Raport"],
  moduleName: "Wnioski o zakup",
  views: ["Lista", "Tablica", "Kalendarz"],
  columns: ["Wniosek", "Zgoda kierownika", "Zamówione"],
  /* Purchase requests in Demo Firma. Column is the index into `columns`;
     day is the day of the month the calendar view places the card on. */
  records: [
    { ref: "WZ/0101", title: "Laptopy dla działu sprzedaży", amount: "18 400 zł", column: 1, day: 3 },
    { ref: "WZ/0102", title: "Licencje oprogramowania", amount: "9 200 zł", column: 0, day: 5 },
    { ref: "WZ/0103", title: "Krzesła do sali konferencyjnej", amount: "6 300 zł", column: 2, day: 10 },
    { ref: "WZ/0104", title: "Szkolenie z KSeF", amount: "2 400 zł", column: 1, day: 12 },
    { ref: "WZ/0105", title: "Drukarka biurowa", amount: "3 100 zł", column: 0, day: 17 },
    { ref: "WZ/0106", title: "Odnowienie domeny", amount: "480 zł", column: 2, day: 24 },
  ],
});

export const ai = polish({
  title: ["AI daje szybkość.", "Opero daje fundament."],
  lead: "Sztuczna inteligencja przyspiesza pracę, ale działa wyłącznie w ramach wyznaczonych przez ludzi: na tych samych elementach, z tymi samymi uprawnieniami i z walidacją przed zapisem.",
  prompt: "Dodaj etap akceptacji zarządu dla umów powyżej 500 000 zł.",
  proposed: "Akceptacja zarządu",
  checks: [
    { title: "Te same elementy", detail: "nowy etap i reguła w module Umowy" },
    { title: "Te same uprawnienia", detail: "zmianę widzi i zatwierdza administrator" },
    { title: "Walidacja przed zapisem", detail: "reguła nie koliduje z istniejącymi" },
  ],
  approve: "Zatwierdź zmianę",
  approved: "Zatwierdzone przez administratora",
});

export const control = polish({
  title: ["Uprawnienia sięgają", "pojedynczego pola."],
  lead: "Role, uprawnienia do pól, logowanie z MFA i SSO. Każda zmiana zostaje w rejestrze zdarzeń, a system może działać na dedykowanej instancji.",
  roles: [
    { id: "cfo", label: "Dyrektor finansowy" },
    { id: "assistant", label: "Asystent działu" },
  ],
  hidden: "Ukryte dla tej roli",
  log: [
    "09:12:04 · Logowanie przez SSO, potwierdzone MFA",
    "09:14:31 · Dział prawny otworzył UM/2026/0014",
    "15:40:12 · Zapisano opinię prawną",
    "10:05:47 · Dyrektor finansowy zaakceptował umowę",
    "10:06:02 · Administrator zmienił uprawnienia roli Asystent działu",
    "11:30:19 · Wysłano dokument do podpisu",
  ],
  capabilities: ["Role", "Uprawnienia do pól", "MFA", "SSO", "Rejestr zdarzeń", "Dedykowana instancja"],
});

export const together = polish({
  title: ["Pokaż nam", "jeden proces."],
  lead: "Najpierw poznajemy, jak naprawdę pracują zespoły. Potem uruchamiamy gotowe moduły i budujemy własne pod konkretne procesy. Po starcie szkolimy administratorów, a system przejmujecie w całości.",
  /* The engagement drawn as a process, with the reader standing on its first
     stage - the blue one, and the only blue in the chapter. */
  stages: ["Rozmowa diagnostyczna", "Demo na Waszym procesie", "Uruchomienie modułów", "Szkolenie administratorów", "System jest Wasz"],
  note: "Rozmawiacie z twórcami systemu. Na pytanie techniczne odpowiedź pada w tej samej rozmowie.",
  primary: "Umów demo",
  email: "kontakt@kodasoft.pl",
  phone: "+48 666 618 026",
});

export const footer = polish({
  closing: "Platforma, która obejmie wszystkie obszary organizacji.",
  maker: "Opero tworzy KodaSoft.",
  site: "kodasoft.pl",
});

/** Where every "Umów demo" on the home page leads: the proposal's own contact page. */
export const demoHref = "/propozycja/kontakt";
