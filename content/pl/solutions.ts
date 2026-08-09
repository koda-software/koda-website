import { localizePath } from "@/lib/i18n/routes";
import type { SolutionsContent } from "../types";

export const solutionsContent: SolutionsContent = {
  seo: {
    title: "Rozwiązania - BPM no-code dla operacji branżowych",
    description:
      "Zobacz, jak Opero wspiera operacje w medycynie, logistyce, produkcji, serwisie, budownictwie, nieruchomościach, retailu i pracy wielooddziałowej.",
  },
  hero: {
    eyebrow: "Rozwiązania",
    title: "BPM no-code dla procesów, które nie mieszczą się w jednym szablonie.",
    description:
      "Każda branża ma pracę, którą standardowe systemy opisują z trudem: lokalne procedury, akceptacje, wyjątki, dokumenty, role i przekazania. Opero daje Koda Soft konfigurowalną podstawę do modelowania tej pracy bez utraty kontroli.",
    supportLine: "Dla własnych rekordów, automatyzacji workflow, uprawnień, wyszukiwania i praktycznego wsparcia AI.",
    primaryCta: "Umów demo",
    secondaryCta: "Poznaj Opero",
  },
  industries: {
    eyebrow: "Dopasowanie branżowe",
    title: "Gdzie Opero pasuje najlepiej.",
    description:
      "Opero jest najmocniejsze tam, gdzie proces jest specyficzny, model danych nie jest standardowy, a zespoły potrzebują jednocześnie elastyczności i śladu działania. Może wspierać operacje wokół istniejących systemów, zamiast zastępować każde narzędzie specjalistyczne.",
    items: [
      {
        title: "Operacje medyczne i healthcare",
        scenario: [
          "Organizacje medyczne prowadzą wiele ważnych procesów poza systemem dokumentacji klinicznej: zgłoszenia infrastrukturalne, śledzenie sprzętu, koordynację dostawców, zbieranie dokumentów, wewnętrzne akceptacje, rutyny kontrolne i cykliczne raporty operacyjne.",
          "Opero może pomóc uporządkować te niekliniczne workflow wokół działów, sprzętu, kontrahentów, dokumentów, statusów i akceptacji. Uprawnienia oraz logi audytowe utrzymują kontrolę dostępu, a zespoły widzą, co jest otwarte, opóźnione, brakujące albo gotowe do kolejnego kroku.",
        ],
        useCasesLabel: "Typowe zastosowania",
        useCases: [
          "Śledzenie zgłoszeń sprzętowych, kontroli utrzymaniowych i gotowości zasobów między działami.",
          "Koordynacja dostawców, kontrahentów, dokumentów, akceptacji i odnowień.",
          "Obsługa nieklinicznych zgłoszeń wewnętrznych, takich jak sprawy infrastrukturalne, dostępy lub wyjątki operacyjne.",
          "Przygotowywanie cyklicznych raportów operacyjnych bez odtwarzania tego samego arkusza co tydzień.",
        ],
        helpfulFeaturesLabel: "Pomocne funkcje Opero",
        helpfulFeatures: [
          "Własne rekordy dla sprzętu, działów, zgłoszeń, dostawców i dokumentów.",
          "Role, uprawnienia i granice organizacji dla kontrolowanego dostępu.",
          "Logi audytowe dla akceptacji, zmian dokumentów i aktualizacji statusów.",
          "Reguły automatyzacji dla przypomnień, brakujących dokumentów i raportów cyklicznych.",
        ],
        supportsLabel: "Opero może wspierać",
        supports: ["Zgłoszenia sprzętowe i infrastrukturalne", "Workflow dostawców i kontrahentów", "Zbieranie i przegląd dokumentów", "Wewnętrzne akceptacje i ślad audytowy"],
      },
      {
        title: "Logistyka i transport",
        scenario: [
          "Zespoły logistyczne pracują z wyjątkami: brakującymi dokumentami, problemami przewoźników, przekazaniami magazynowymi, reklamacjami, kontrolami pojazdów, opóźnionymi wysyłkami i koordynacją partnerów. Te procesy często zmieniają się szybciej niż konfiguracja sztywnych systemów.",
          "Opero może modelować wyjątki transportowe, rekordy przewoźników, statusy dokumentów, kontrole pojazdów lub magazynów, akceptacje i alerty operacyjne. Daje zespołom kontrolowane miejsce do śledzenia tego, co się wydarzyło, kto posiada następny krok i które sprawy nadal wymagają uwagi.",
        ],
        useCasesLabel: "Typowe zastosowania",
        useCases: [
          "Zarządzanie wyjątkami wysyłek, które potrzebują właściciela, statusu, dowodów i działań follow-up.",
          "Śledzenie dokumentów transportowych, brakujących plików, notatek przekazania i stanów akceptacji.",
          "Utrzymywanie rekordów przewoźników i partnerów z własnymi polami, kontaktami i historią procesu.",
          "Koordynacja kontroli magazynowych, kontroli pojazdów, reklamacji i cyklicznych raportów operacyjnych.",
        ],
        helpfulFeaturesLabel: "Pomocne funkcje Opero",
        helpfulFeatures: [
          "Własne rekordy wyjątków ze statusami, właścicielami, terminami i dokumentami.",
          "Wyszukiwanie po przewoźnikach, wysyłkach, reklamacjach, dokumentach i notatkach operacyjnych.",
          "Powiadomienia i reguły eskalacji dla opóźnionych lub niekompletnych spraw.",
          "Wsparcie AI przy podsumowaniach operacyjnych i analizie wyjątków.",
        ],
        supportsLabel: "Opero może wspierać",
        supports: ["Workflow wyjątków transportowych", "Rekordy przewoźników i partnerów", "Statusy dokumentów transportowych", "Alerty operacyjne i akcje follow-up"],
      },
      {
        title: "Produkcja i operacje przemysłowe",
        scenario: [
          "Firmy produkcyjne mają wiele procesów specyficznych dla zakładu: zdarzenia jakościowe, utrzymanie maszyn, inspekcje, zgłoszenia wewnętrzne, dokumenty dostawców, niezgodności i wsparcie produkcji. Takie workflow rzadko pasują idealnie do ogólnych modułów ERP.",
          "Opero może modelować rekordy i przekazania pomiędzy produkcją, jakością, utrzymaniem ruchu, zakupami i zarządzaniem. Zespoły utrzymują dane, właścicieli, statusy, dokumenty i reguły automatyzacji w ramach tego samego procesu.",
        ],
        useCasesLabel: "Typowe zastosowania",
        useCases: [
          "Śledzenie zdarzeń jakościowych, wyników inspekcji, niezgodności i działań korygujących.",
          "Prowadzenie spraw utrzymania maszyn, notatek serwisowych, zapotrzebowania na części i gotowości zasobów.",
          "Koordynacja dokumentów dostawców, akceptacji wewnętrznych i cyklicznych kontroli zgodności.",
          "Obsługa zgłoszeń zakładowych, które nie pasują czysto do finansów, magazynu ani produkcji.",
        ],
        helpfulFeaturesLabel: "Pomocne funkcje Opero",
        helpfulFeatures: [
          "Własne obiekty dla maszyn, inspekcji, zdarzeń jakościowych, dostawców i zgłoszeń.",
          "Statusy i właściciele workflow pomiędzy produkcją, jakością, utrzymaniem ruchu i zakupami.",
          "Reguły automatyzacji dla przypomnień, zmian statusu, powiadomień i kontroli cyklicznych.",
          "Logi audytowe i uprawnienia dla kontrolowanych zmian operacyjnych.",
        ],
        supportsLabel: "Opero może wspierać",
        supports: ["Sprawy maszyn i utrzymania", "Rekordy jakości i inspekcji", "Workflow dokumentacji dostawców", "Zgłoszenia wewnętrzne i ścieżki akceptacji"],
      },
      {
        title: "Serwis terenowy i utrzymanie",
        scenario: [
          "Praca serwisowa zależy od zasobów, lokalizacji, techników, części, terminów, raportów, zdjęć, notatek klienta i kolejnych kroków. Gdy te informacje żyją w osobnych narzędziach, trudno zobaczyć, które sprawy czekają, są zablokowane albo gotowe do zamknięcia.",
          "Opero może strukturyzować sprawy serwisowe, urządzenia, przypisania, statusy, checklisty, pliki i raporty. Automatyzacja może wspierać przypomnienia, kontrole cykliczne, aktualizacje statusów i podsumowania operacyjne.",
        ],
        useCasesLabel: "Typowe zastosowania",
        useCases: [
          "Prowadzenie spraw serwisowych od przyjęcia przez diagnozę, naprawę, informację dla klienta i zamknięcie.",
          "Śledzenie zasobów, urządzeń, lokalizacji, techników, checklist, zdjęć, plików i notatek napraw.",
          "Koordynacja cyklicznego utrzymania, inspekcji i raportów gotowości.",
          "Utrzymanie wspólnego obrazu pracy dla zespołów terenowych i back-office.",
        ],
        helpfulFeaturesLabel: "Pomocne funkcje Opero",
        helpfulFeatures: [
          "Ekrany rekordów dla spraw serwisowych, zasobów, przypisań, checklist i plików.",
          "Statusy workflow dla przyjęcia, diagnozy, oczekiwania na części, pracy w toku, gotowości i zamknięcia.",
          "Reguły cykliczne dla kontroli, przypomnień o opóźnieniach i raportów dziennych.",
          "Wsparcie AI przy podsumowaniu historii sprawy i raportowaniu operacyjnym.",
        ],
        supportsLabel: "Opero może wspierać",
        supports: ["Rekordy spraw serwisowych i zasobów", "Przypisania techników i statusy", "Checklisty, pliki i notatki napraw", "Przypomnienia i cykliczne raporty"],
      },
      {
        title: "Budownictwo i nieruchomości",
        scenario: [
          "Operacje budowlane i nieruchomościowe obejmują zmieniające się lokalizacje, wielu kontrahentów, inspekcje, odbiory, przepływy dokumentów, zgłoszenia usterek, akceptacje i wewnętrzną koordynację. Każdy projekt może mieć własną strukturę, ale nadal potrzebuje kontroli.",
          "Opero może modelować rekordy projektów, sprawy na budowie, workflow kontrahentów, checklisty inspekcji, statusy dokumentów i kroki akceptacji. Pomaga utrzymać widoczność informacji operacyjnych pomiędzy projektami, lokalizacjami i partnerami.",
        ],
        useCasesLabel: "Typowe zastosowania",
        useCases: [
          "Śledzenie spraw na budowie, wyników inspekcji, zadań odbiorowych i działań follow-up.",
          "Zarządzanie rekordami kontrahentów, dokumentami, akceptacjami, wymaganiami dostępu i zmianami statusów.",
          "Koordynacja raportów cyklicznych między budowami, nieruchomościami, projektami lub zespołami regionalnymi.",
          "Utrzymywanie widoczności statusu dokumentów, właściciela, terminu i następnej akcji w długich procesach.",
        ],
        helpfulFeaturesLabel: "Pomocne funkcje Opero",
        helpfulFeatures: [
          "Własne rekordy projektów, lokalizacji, kontrahentów, dokumentów, inspekcji i spraw.",
          "Pola relacji łączące partnerów, lokalizacje, zgłoszenia, pliki i ścieżki akceptacji.",
          "Uprawnienia dla zespołów wewnętrznych, działów, projektów lub zakresów organizacji.",
          "Powiadomienia i reguły workflow dla odbiorów, brakujących dokumentów i zaległych działań.",
        ],
        supportsLabel: "Opero może wspierać",
        supports: ["Projekty i sprawy lokalizacyjne", "Koordynację kontrahentów i partnerów", "Workflow statusów dokumentów", "Inspekcje, odbiory i akceptacje"],
      },
      {
        title: "Retail, franczyza i operacje wielooddziałowe",
        scenario: [
          "Organizacje retailowe i franczyzowe potrzebują spójnych procesów w wielu lokalizacjach, a lokalne zespoły obsługują codzienną pracę: incydenty, zgłoszenia utrzymaniowe, dzienniki wizyt, problemy ze sprzętem, audyty, lokalne akceptacje i raporty oddziałowe.",
          "Opero może modelować rekordy lokalizacji, uprawnienia, cykliczne kontrole, statusy i workflow raportowania. Lokalne zespoły dostają prostą strukturę dla własnej pracy, a centrala zachowuje widoczność całej organizacji.",
        ],
        useCasesLabel: "Typowe zastosowania",
        useCases: [
          "Zarządzanie incydentami, zgłoszeniami utrzymaniowymi, dziennikami wizyt, lokalnymi akceptacjami i problemami sprzętowymi.",
          "Prowadzenie cyklicznych kontroli oddziałów, audytów, rutyn zgodności i raportów operacyjnych.",
          "Śledzenie rekordów lokalnych przy zachowaniu spójnego widoku dla centrali.",
          "Koordynacja działań follow-up na poziomie franczyzy lub oddziału bez utraty właściciela i historii statusów.",
        ],
        helpfulFeaturesLabel: "Pomocne funkcje Opero",
        helpfulFeatures: [
          "Rekordy, workflow, uprawnienia i listy operacyjne scoped do lokalizacji.",
          "Automatyzacja cykliczna dla kontroli oddziałów, przypomnień i raportów statusu.",
          "Wyszukiwanie i zapisane zapytania po lokalizacjach, incydentach, zgłoszeniach i dokumentach.",
          "Role i granice organizacji dla zespołów lokalnych oraz centralnych.",
        ],
        supportsLabel: "Opero może wspierać",
        supports: ["Incydenty i zgłoszenia oddziałowe", "Workflow utrzymania i sprzętu", "Cykliczne kontrole lokalizacji", "Raportowanie centralne i lokalną odpowiedzialność"],
      },
    ],
  },
  pattern: {
    eyebrow: "Wspólny wzorzec",
    title: "Różne branże, podobne problemy operacyjne.",
    description:
      "Szczegóły zmieniają się między branżami, ale wzorzec często jest ten sam: ważna praca nie mieści się w głównym systemie, więc zespoły tworzą procesy poboczne. Z czasem trudno je przeszukiwać, automatyzować, audytować i usprawniać.",
    problemLabel: "Gdy dzieje się to",
    supportLabel: "Opero może pomóc przez",
    rows: [
      { problem: "Zespoły śledzą własne rekordy w arkuszach", support: "Utworzenie uporządkowanych i przeszukiwalnych typów rekordów." },
      { problem: "Akceptacje dzieją się w mailu lub czacie", support: "Przeniesienie właściciela i statusu do kontrolowanego workflow." },
      { problem: "Dokumenty są trudne do śledzenia", support: "Powiązanie plików, statusów i kolejnych akcji z rekordem." },
      { problem: "Wyjątki są obsługiwane ręcznie", support: "Dodanie reguł, powiadomień i ścieżek eskalacji." },
      { problem: "Raporty zależą od ręcznych eksportów", support: "Ułatwienie zapytań i podsumowań na danych operacyjnych." },
    ],
  },
  fit: {
    eyebrow: "Dopasowanie",
    title: "Kiedy Opero jest dobrym wyborem.",
    description:
      "Opero zwykle pasuje wtedy, gdy firma potrzebuje czegoś więcej niż arkusz, większej elastyczności niż stały moduł i większej kontroli niż luźne narzędzie wewnętrzne.",
    goodFitTitle: "Dobry wybór",
    goodFit: [
      "Proces ma własne rekordy lub pola.",
      "Kilka zespołów dotyka tego samego workflow.",
      "Właściciel, status lub stan dokumentów ma znaczenie.",
      "Firma potrzebuje uprawnień i śladu działania.",
      "Workflow zmienia się na tyle często, że potrzebna jest konfiguracja.",
    ],
    notBestFitTitle: "Nie najlepszy wybór",
    notBestFit: [
      "Potrzeba jest już w pełni pokryta przez system specjalistyczny.",
      "Proces wymaga certyfikowanego oprogramowania branżowego, którego Opero nie ma zastępować.",
      "Firma potrzebuje tylko prostej strony statycznej albo jednorazowego formularza.",
    ],
  },
  finalCta: {
    eyebrow: "Zacznij od procesu",
    title: "Opowiedz, jak działa Twoja operacja. Powiemy, czy Opero pasuje.",
    description:
      "Koda Soft może zmapować rekordy, role, dokumenty, akceptacje i wyjątki w Twoim procesie, a potem pokazać, czy Opero jest właściwą podstawą.",
    primaryCta: "Umów demo",
    secondaryCta: "Poznaj Opero",
  },
};

export const solutionsCtas = {
  primary: localizePath("pl", "contact"),
  secondary: localizePath("pl", "opero"),
};
