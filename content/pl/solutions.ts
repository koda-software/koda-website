import { localizePath } from "@/lib/i18n/routes";
import type { SolutionsContent } from "../types";

export const solutionsContent: SolutionsContent = {
  seo: {
    title: "Rozwiązania branżowe: workflow i dokumenty",
    description:
      "Opero w medycynie, logistyce, produkcji, serwisie, budownictwie i retailu. System workflow i obieg dokumentów dopasowany do procesów Twojej branży.",
  },
  hero: {
    eyebrow: "Rozwiązania",
    title: "BPM no-code dla procesów, które nie mieszczą się w jednym szablonie.",
    description:
      "Każda branża ma pracę, którą standardowe systemy opisują z trudem: lokalne procedury, akceptacje, wyjątki, dokumenty, role i przekazania. W Opero modelujesz ją bez utraty kontroli nad danymi.",
    supportLine: "Obiekty własne, procesy, obieg dokumentów, automatyzacje, uprawnienia i raporty na jednej platformie.",
    primaryCta: "Umów demo",
    secondaryCta: "Poznaj Opero",
  },
  industries: {
    eyebrow: "Dopasowanie branżowe",
    title: "Gdzie Opero sprawdza się najlepiej.",
    description:
      "Opero jest najmocniejsze tam, gdzie proces jest specyficzny, model danych odbiega od standardu, a zespoły potrzebują jednocześnie elastyczności i śladu działania. Uzupełnia istniejące systemy zamiast zastępować każde narzędzie specjalistyczne.",
    items: [
      {
        title: "Placówki medyczne i healthcare",
        scenario: [
          "Organizacje medyczne prowadzą wiele ważnych procesów poza systemem dokumentacji klinicznej: zgłoszenia infrastrukturalne, śledzenie sprzętu, koordynację dostawców, zbieranie dokumentów, wewnętrzne akceptacje, rutyny kontrolne i cykliczne raporty operacyjne.",
          "W Opero układasz te niekliniczne obiegi wokół działów, sprzętu, kontrahentów, dokumentów i etapów akceptacji. Uprawnienia oraz rejestr zdarzeń trzymają dostęp pod kontrolą, a zespoły widzą, co jest otwarte, opóźnione, niekompletne albo gotowe do kolejnego kroku.",
        ],
        useCasesLabel: "Typowe zastosowania",
        useCases: [
          "Zgłoszenia sprzętowe, przeglądy techniczne i gotowość zasobów między działami.",
          "Koordynacja dostawców, umów, dokumentów, akceptacji i terminów odnowień.",
          "Niekliniczne zgłoszenia wewnętrzne: sprawy infrastrukturalne, dostępy, wyjątki operacyjne.",
          "Cykliczne raporty operacyjne bez odtwarzania tego samego arkusza co tydzień.",
        ],
        helpfulFeaturesLabel: "Pomocne funkcje Opero",
        helpfulFeatures: [
          "Obiekty własne dla sprzętu, działów, zgłoszeń, dostawców i dokumentów.",
          "Role, uprawnienia do pól i podział na jednostki dla kontrolowanego dostępu.",
          "Rejestr zdarzeń dla akceptacji, zmian dokumentów i aktualizacji statusów.",
          "Reguły automatyzacji dla przypomnień, brakujących dokumentów i raportów cyklicznych.",
        ],
        supportsLabel: "Opero obsługuje",
        supports: ["Zgłoszenia sprzętowe i infrastrukturalne", "Obiegi dostawców i kontrahentów", "Zbieranie i przegląd dokumentów", "Wewnętrzne akceptacje i ślad audytowy"],
      },
      {
        title: "Logistyka i transport",
        scenario: [
          "Zespoły logistyczne żyją wyjątkami: brakującymi dokumentami, problemami przewoźników, przekazaniami magazynowymi, reklamacjami, kontrolami pojazdów, opóźnionymi wysyłkami i koordynacją partnerów. Te procesy zmieniają się szybciej, niż da się przekonfigurować sztywny system.",
          "W Opero modelujesz wyjątki transportowe, kartoteki przewoźników, statusy dokumentów, kontrole pojazdów i magazynów oraz ścieżki akceptacji. Zespół dostaje jedno miejsce, w którym widać, co się wydarzyło, kto ma następny krok i które sprawy nadal czekają.",
        ],
        useCasesLabel: "Typowe zastosowania",
        useCases: [
          "Wyjątki wysyłkowe, które potrzebują właściciela, statusu, dowodów i kolejnych działań.",
          "Dokumenty transportowe, brakujące pliki, notatki przekazania i etapy akceptacji.",
          "Kartoteki przewoźników i partnerów z własnymi polami, kontaktami i historią procesu.",
          "Kontrole magazynowe, przeglądy pojazdów, reklamacje i cykliczne raporty operacyjne.",
        ],
        helpfulFeaturesLabel: "Pomocne funkcje Opero",
        helpfulFeatures: [
          "Obiekty własne dla wyjątków, ze statusami, właścicielami, terminami i dokumentami.",
          "Wyszukiwanie po przewoźnikach, wysyłkach, reklamacjach, dokumentach i notatkach.",
          "Powiadomienia i reguły eskalacji dla spraw opóźnionych lub niekompletnych.",
          "Asystent AI przy podsumowaniach operacyjnych i analizie wyjątków.",
        ],
        supportsLabel: "Opero obsługuje",
        supports: ["Obiegi wyjątków transportowych", "Kartoteki przewoźników i partnerów", "Statusy dokumentów transportowych", "Alerty operacyjne i kolejne działania"],
      },
      {
        title: "Produkcja i operacje przemysłowe",
        scenario: [
          "Firmy produkcyjne mają wiele procesów specyficznych dla zakładu: zdarzenia jakościowe, utrzymanie maszyn, inspekcje, zgłoszenia wewnętrzne, dokumenty dostawców, niezgodności i wsparcie produkcji. Takie obiegi rzadko mieszczą się w ogólnych modułach ERP.",
          "W Opero modelujesz rekordy i przekazania między produkcją, jakością, utrzymaniem ruchu, zakupami i zarządem. Dane, właściciele, etapy, dokumenty i reguły automatyzacji zostają w ramach jednego procesu.",
        ],
        useCasesLabel: "Typowe zastosowania",
        useCases: [
          "Zdarzenia jakościowe, wyniki inspekcji, niezgodności i działania korygujące.",
          "Sprawy utrzymania maszyn, notatki serwisowe, zapotrzebowanie na części i gotowość zasobów.",
          "Dokumenty dostawców, akceptacje wewnętrzne i cykliczne kontrole zgodności.",
          "Zgłoszenia zakładowe, które nie pasują ani do finansów, ani do magazynu, ani do produkcji.",
        ],
        helpfulFeaturesLabel: "Pomocne funkcje Opero",
        helpfulFeatures: [
          "Obiekty własne dla maszyn, inspekcji, zdarzeń jakościowych, dostawców i zgłoszeń.",
          "Etapy i właściciele procesu między produkcją, jakością, utrzymaniem ruchu i zakupami.",
          "Reguły automatyzacji dla przypomnień, zmian statusu, powiadomień i kontroli cyklicznych.",
          "Rejestr zdarzeń i uprawnienia dla kontrolowanych zmian operacyjnych.",
        ],
        supportsLabel: "Opero obsługuje",
        supports: ["Sprawy maszyn i utrzymania ruchu", "Rekordy jakości i inspekcji", "Obiegi dokumentacji dostawców", "Zgłoszenia wewnętrzne i ścieżki akceptacji"],
      },
      {
        title: "Serwis terenowy i utrzymanie",
        scenario: [
          "Praca serwisowa zależy od zasobów, lokalizacji, techników, części, terminów, raportów, zdjęć i notatek klienta. Gdy te informacje żyją w osobnych narzędziach, trudno stwierdzić, które sprawy czekają, które są zablokowane, a które gotowe do zamknięcia.",
          "W Opero prowadzisz sprawy serwisowe, urządzenia, przypisania, etapy, checklisty, pliki i raporty w jednym rekordzie. Automatyzacja przejmuje przypomnienia, kontrole cykliczne, zmiany statusów i podsumowania operacyjne.",
        ],
        useCasesLabel: "Typowe zastosowania",
        useCases: [
          "Sprawy serwisowe od przyjęcia, przez diagnozę i naprawę, po informację dla klienta i zamknięcie.",
          "Zasoby, urządzenia, lokalizacje, technicy, checklisty, zdjęcia, pliki i notatki napraw.",
          "Cykliczne utrzymanie, inspekcje i raporty gotowości sprzętu.",
          "Wspólny obraz pracy dla zespołów terenowych i back-office.",
        ],
        helpfulFeaturesLabel: "Pomocne funkcje Opero",
        helpfulFeatures: [
          "Widoki rekordów dla spraw serwisowych, zasobów, przypisań, checklist i plików.",
          "Etapy procesu: przyjęcie, diagnoza, oczekiwanie na części, praca w toku, gotowe, zamknięte.",
          "Reguły cykliczne dla kontroli, przypomnień o opóźnieniach i raportów dziennych.",
          "Asystent AI przy podsumowaniu historii sprawy i raportowaniu operacyjnym.",
        ],
        supportsLabel: "Opero obsługuje",
        supports: ["Sprawy serwisowe i kartoteki zasobów", "Przypisania techników i etapy", "Checklisty, pliki i notatki napraw", "Przypomnienia i raporty cykliczne"],
      },
      {
        title: "Budownictwo i nieruchomości",
        scenario: [
          "Operacje budowlane i nieruchomościowe obejmują zmieniające się lokalizacje, wielu kontrahentów, inspekcje, odbiory, obieg dokumentów, zgłoszenia usterek, akceptacje i koordynację wewnętrzną. Każdy projekt ma własną strukturę, a mimo to potrzebuje kontroli.",
          "W Opero modelujesz projekty, sprawy na budowie, obiegi kontrahentów, checklisty inspekcji, statusy dokumentów i etapy akceptacji. Informacje operacyjne pozostają widoczne między projektami, lokalizacjami i partnerami.",
        ],
        useCasesLabel: "Typowe zastosowania",
        useCases: [
          "Sprawy na budowie, wyniki inspekcji, zadania odbiorowe i działania naprawcze.",
          "Kartoteki kontrahentów, dokumenty, akceptacje, wymagania dostępu i zmiany statusów.",
          "Raporty cykliczne między budowami, nieruchomościami, projektami i zespołami regionalnymi.",
          "Status dokumentu, właściciel, termin i następny krok w długich procesach inwestycyjnych.",
        ],
        helpfulFeaturesLabel: "Pomocne funkcje Opero",
        helpfulFeatures: [
          "Obiekty własne dla projektów, lokalizacji, kontrahentów, dokumentów, inspekcji i spraw.",
          "Pola powiązań łączące partnerów, lokalizacje, zgłoszenia, pliki i ścieżki akceptacji.",
          "Uprawnienia dla zespołów wewnętrznych, działów, projektów i poszczególnych spółek.",
          "Powiadomienia i reguły dla odbiorów, brakujących dokumentów i zaległych działań.",
        ],
        supportsLabel: "Opero obsługuje",
        supports: ["Projekty i sprawy na lokalizacjach", "Koordynację kontrahentów i partnerów", "Obiegi statusów dokumentów", "Inspekcje, odbiory i akceptacje"],
      },
      {
        title: "Retail, franczyza i sieci wielooddziałowe",
        scenario: [
          "Organizacje retailowe i franczyzowe potrzebują spójnych procesów w wielu lokalizacjach, podczas gdy lokalne zespoły obsługują codzienną pracę: incydenty, zgłoszenia utrzymaniowe, dzienniki wizyt, problemy ze sprzętem, audyty, lokalne akceptacje i raporty oddziałowe.",
          "W Opero modelujesz rekordy lokalizacji, uprawnienia, kontrole cykliczne, etapy i obiegi raportowania. Lokalne zespoły dostają prostą strukturę dla własnej pracy, a centrala zachowuje widoczność całej sieci.",
        ],
        useCasesLabel: "Typowe zastosowania",
        useCases: [
          "Incydenty, zgłoszenia utrzymaniowe, dzienniki wizyt, lokalne akceptacje i awarie sprzętu.",
          "Cykliczne kontrole oddziałów, audyty, rutyny zgodności i raporty operacyjne.",
          "Rekordy lokalne przy zachowaniu jednego, spójnego widoku dla centrali.",
          "Działania naprawcze na poziomie franczyzy lub oddziału, z właścicielem i historią statusów.",
        ],
        helpfulFeaturesLabel: "Pomocne funkcje Opero",
        helpfulFeatures: [
          "Rekordy, procesy, uprawnienia i listy operacyjne ograniczone do lokalizacji.",
          "Automatyzacja cykliczna dla kontroli oddziałów, przypomnień i raportów statusu.",
          "Wyszukiwanie i zapisane zapytania po lokalizacjach, incydentach, zgłoszeniach i dokumentach.",
          "Role i podział na spółki dla zespołów lokalnych oraz centrali.",
        ],
        supportsLabel: "Opero obsługuje",
        supports: ["Incydenty i zgłoszenia oddziałowe", "Obiegi utrzymania i sprzętu", "Cykliczne kontrole lokalizacji", "Raportowanie centralne i lokalną odpowiedzialność"],
      },
    ],
  },
  pattern: {
    eyebrow: "Wspólny wzorzec",
    title: "Różne branże, te same problemy operacyjne.",
    description:
      "Szczegóły zmieniają się między branżami, ale wzorzec jest zwykle ten sam: ważna praca nie mieści się w głównym systemie, więc zespoły tworzą procesy poboczne. Z czasem trudno je przeszukiwać, automatyzować, audytować i usprawniać.",
    problemLabel: "Gdy dzieje się to",
    supportLabel: "Opero odpowiada tym",
    rows: [
      { problem: "Zespoły prowadzą własne rekordy w arkuszach", support: "Obiekty własne z polami, walidacją i wyszukiwaniem." },
      { problem: "Akceptacje toczą się w mailu i na czacie", support: "Proces z etapami, właścicielem i terminem na każdym kroku." },
      { problem: "Dokumenty trudno odnaleźć i połączyć ze sprawą", support: "Obieg dokumentów z wersjonowaniem plików przy rekordzie." },
      { problem: "Wyjątki obsługiwane są ręcznie", support: "Silnik reguł z powiadomieniami i ścieżkami eskalacji." },
      { problem: "Raporty powstają z ręcznych eksportów", support: "Raporty i dashboardy na żywych danych, z drążeniem szczegółów." },
    ],
  },
  fit: {
    eyebrow: "Dopasowanie",
    title: "Kiedy Opero jest dobrym wyborem.",
    description:
      "Opero pasuje wtedy, gdy firma potrzebuje czegoś więcej niż arkusz, większej elastyczności niż gotowy moduł i większej kontroli niż luźne narzędzie wewnętrzne.",
    goodFitTitle: "Dobry wybór",
    goodFit: [
      "Proces ma własne rekordy i pola, których nie ma w gotowych modułach.",
      "Kilka zespołów pracuje na tym samym obiegu.",
      "Właściciel, status lub etap dokumentu ma realne znaczenie.",
      "Firma potrzebuje uprawnień, zgodności i śladu zmian.",
      "Procesy zmieniają się na tyle często, że potrzebna jest konfiguracja, nie przepisywanie kodu.",
    ],
    notBestFitTitle: "Nie najlepszy wybór",
    notBestFit: [
      "Potrzeba jest już w pełni pokryta przez system specjalistyczny.",
      "Proces wymaga certyfikowanego oprogramowania branżowego, którego Opero nie zastępuje.",
      "Firma potrzebuje tylko prostej strony statycznej albo jednorazowego formularza.",
    ],
  },
  finalCta: {
    eyebrow: "Zacznij od procesu",
    title: "Opowiedz, jak działa Twoja operacja. Powiemy, czy Opero pasuje.",
    description:
      "Zmapujemy rekordy, role, dokumenty, akceptacje i wyjątki w Twoim procesie, a potem pokażemy, jak wyglądałyby w systemie.",
    primaryCta: "Umów demo",
    secondaryCta: "Poznaj Opero",
  },
};

export const solutionsCtas = {
  primary: localizePath("pl", "contact"),
  secondary: localizePath("pl", "opero"),
};
