import { localizePath } from "@/lib/i18n/routes";
import type { SolutionsContent } from "../types";

export const solutionsContent: SolutionsContent = {
  seo: {
    title: "Rozwiązania branżowe: workflow i obieg dokumentów",
    description:
      "Opero w produkcji, budownictwie, usługach profesjonalnych, serwisie, medycynie, handlu i sektorze publicznym. Procesy i obieg dokumentów dla Twojej branży.",
  },
  hero: {
    eyebrow: "Rozwiązania",
    title: "BPM low-code dla procesów, których nie obsłuży system pudełkowy.",
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
        icon: "manufacturing",
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
        icon: "construction",
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
        icon: "professionalServices",
        title: "Usługi profesjonalne, kancelarie i biura",
        scenario: [
          "Kancelarie, biura rachunkowe i firmy doradcze pracują na sprawach klientów: dokumentach z terminem, umowach, zleceniach i rozliczeniach. Każdy klient ma nieco inny tryb współpracy, a przekroczony termin kosztuje realne pieniądze i zaufanie.",
          "W Opero prowadzisz sprawy klientów jako obiekty własne z kompletem dokumentów, etapami i osobą odpowiedzialną. Terminów pilnują reguły, a uprawnienia gwarantują, że każdy zespół widzi tylko przypisanych sobie klientów.",
        ],
        useCasesLabel: "Typowe zastosowania",
        useCases: [
          "Sprawy klientów z etapami, terminami i jasno przypisaną osobą odpowiedzialną.",
          "Obieg umów i dokumentów z wersjonowaniem oraz pełną historią zmian.",
          "Powtarzalne czynności cykliczne: rozliczenia, sprawozdania i odnowienia umów.",
          "Rozliczenie zakresu prac na kliencie, projekcie lub sprawie.",
        ],
        helpfulFeaturesLabel: "Pomocne funkcje Opero",
        helpfulFeatures: [
          "Obiekty własne dla klientów, spraw, umów i dokumentów.",
          "Reguły przypominające o terminach, zanim staną się problemem.",
          "Uprawnienia ograniczające dostęp do konkretnych klientów lub zespołów.",
          "Szablony dokumentów generujące pisma i umowy wprost z danych sprawy.",
        ],
        supportsLabel: "Opero obsługuje",
        supports: ["Sprawy i teczki klientów", "Obieg umów i dokumentów", "Terminy i czynności cykliczne", "Rozliczenia i sprawozdania"],
      },
      {
        icon: "fieldService",
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
        icon: "healthcare",
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
        icon: "retail",
        title: "Sieci usługowe, franczyza i handel",
        scenario: [
          "Salony beauty, kluby fitness, gastronomia, punkty handlowe i sieci franczyzowe potrzebują tego samego: jednakowego standardu w każdej lokalizacji i realnego wglądu w to, co dzieje się na miejscu. Lokalne zespoły obsługują incydenty, sprzęt, dostawy, audyty i zgłoszenia, każdy trochę po swojemu.",
          "W Opero każda lokalizacja pracuje na tym samym, prostym formularzu, a centrala widzi całą sieć w jednym zestawieniu. Kontrole cykliczne, standardy sanitarne i przeglądy sprzętu pilnują się same, bo przypomina o nich reguła.",
        ],
        useCasesLabel: "Typowe zastosowania",
        useCases: [
          "Incydenty, awarie sprzętu i zgłoszenia utrzymaniowe zgłaszane przez lokal.",
          "Cykliczne audyty, kontrole standardu oraz checklisty otwarcia i zamknięcia.",
          "Dokumentacja lokalizacji: umowy najmu, przeglądy, certyfikaty i szkolenia personelu.",
          "Raporty porównujące lokalizacje bez zbierania arkuszy z każdego punktu.",
        ],
        helpfulFeaturesLabel: "Pomocne funkcje Opero",
        helpfulFeatures: [
          "Rekordy, procesy i listy ograniczone do lokalizacji, z widokiem zbiorczym dla centrali.",
          "Formularze zgłoszeń proste na tyle, żeby wypełnił je każdy pracownik lokalu.",
          "Reguły cykliczne dla audytów, przeglądów i przypomnień o terminach.",
          "Role i uprawnienia rozdzielające dostęp lokalu, regionu i centrali.",
        ],
        supportsLabel: "Opero obsługuje",
        supports: ["Incydenty i zgłoszenia z lokali", "Audyty i kontrole standardu", "Dokumentację i przeglądy sprzętu", "Raporty porównawcze dla centrali"],
      },
      {
        icon: "education",
        title: "Uczelnie i instytucje edukacyjne",
        scenario: [
          "Uczelnie prowadzą równolegle procesy dydaktyczne, administracyjne i projektowe: wnioski studenckie i pracownicze, obieg umów, delegacje, projekty badawcze z własnymi budżetami i sprawozdaniami, zamówienia oraz dokumentację poszczególnych jednostek.",
          "W Opero każda z tych spraw dostaje własny obiekt, formularz i ścieżkę akceptacji przechodzącą przez katedry, dziekanaty i kwesturę. Widać, na jakim etapie jest wniosek, kto go obecnie trzyma i ile czasu zostało do terminu.",
        ],
        useCasesLabel: "Typowe zastosowania",
        useCases: [
          "Wnioski studenckie i pracownicze prowadzone przez katedry, dziekanaty i administrację.",
          "Obieg umów, delegacji i zamówień z akceptacją budżetową.",
          "Projekty badawcze: dokumentacja, kamienie milowe, sprawozdania i rozliczenia.",
          "Ewidencja sprzętu, laboratoriów i zasobów poszczególnych jednostek.",
        ],
        helpfulFeaturesLabel: "Pomocne funkcje Opero",
        helpfulFeatures: [
          "Obiekty własne dla wniosków, projektów, umów i zasobów jednostek.",
          "Wieloetapowe ścieżki akceptacji przechodzące przez kilka jednostek organizacyjnych.",
          "Uprawnienia i podział na jednostki, żeby każdy widział dokładnie swój zakres.",
          "Raporty i sprawozdania na żywych danych, bez zbierania arkuszy z wydziałów.",
        ],
        supportsLabel: "Opero obsługuje",
        supports: ["Wnioski studenckie i pracownicze", "Obieg umów i delegacji", "Projekty badawcze i rozliczenia", "Ewidencję zasobów jednostek"],
      },
      {
        icon: "publicSector",
        title: "Sektor publiczny i samorządy",
        scenario: [
          "Urzędy, jednostki organizacyjne i spółki komunalne pracują na dokumencie: pisma wpływające, wnioski mieszkańców, uchwały, zamówienia publiczne, umowy i sprawozdania. Wszystko z terminami ustawowymi, obowiązkiem dekretacji i koniecznością odtworzenia przebiegu sprawy na żądanie.",
          "W Opero prowadzisz elektroniczny obieg dokumentów zgodny z tym, jak faktycznie działa jednostka: rejestracja i numeracja pism, dekretacja na komórki i osoby, ścieżki akceptacji, terminy oraz pełny rejestr zdarzeń. e-Doręczenia obsługujesz wprost z systemu, bez wychodzenia do zewnętrznych portali.",
        ],
        useCasesLabel: "Typowe zastosowania",
        useCases: [
          "Rejestracja pism wpływających i wychodzących, z numeracją i dekretacją na komórki organizacyjne.",
          "Wnioski i sprawy mieszkańców z terminem ustawowym oraz widocznym etapem realizacji.",
          "Obieg umów, zamówień publicznych i dokumentacji projektowej z akceptacjami.",
          "Sprawozdawczość wewnętrzna i raporty dla kierownictwa bez ręcznego zbierania danych.",
        ],
        helpfulFeaturesLabel: "Pomocne funkcje Opero",
        helpfulFeatures: [
          "e-Doręczenia i elektroniczny obieg dokumentów obsługiwane wprost w systemie.",
          "Obiekty własne dla pism, wniosków, umów, uchwał i zamówień.",
          "Terminy, przypomnienia i eskalacje pilnujące spraw z ustawowym czasem odpowiedzi.",
          "Rejestr zdarzeń i uprawnienia do pól na potrzeby kontroli oraz audytu.",
        ],
        supportsLabel: "Opero obsługuje",
        supports: ["Pisma wpływające i wychodzące", "Wnioski i sprawy mieszkańców", "Umowy i zamówienia publiczne", "e-Doręczenia i rejestr zdarzeń"],
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
    title: "Sprawdź, czy to Twój przypadek.",
    description:
      "Opero pasuje wtedy, gdy firma potrzebuje czegoś więcej niż arkusz, większej elastyczności niż gotowy moduł i większej kontroli niż luźne narzędzie wewnętrzne. Świetnie współpracuje też z systemami, które już masz.",
    goodFitTitle: "Opero sprawdzi się u Ciebie, gdy",
    goodFit: [
      "Proces ma własne rekordy i pola, których nie ma w gotowych modułach.",
      "Kilka zespołów pracuje na tym samym obiegu.",
      "Właściciel, status lub etap dokumentu ma realne znaczenie.",
      "Firma potrzebuje uprawnień, zgodności i śladu zmian.",
      "Procesy zmieniają się na tyle często, że potrzebna jest konfiguracja, nie przepisywanie kodu.",
    ],
    notBestFitTitle: "Opero uzupełnia, nie zastępuje",
    notBestFit: [
      "Masz system dziedzinowy, który dobrze robi swoje? Opero poprowadzi procesy wokół niego i połączy się z nim przez API.",
      "Pracujesz na certyfikowanym oprogramowaniu branżowym? Zostaje na swoim miejscu, a Opero obejmuje obiegi, których ono nie pokrywa.",
      "Nie musisz zaczynać od całej firmy. Wiele wdrożeń startuje od jednego procesu, na przykład obiegu faktur, i rozszerza się dopiero wtedy, gdy ten się sprawdzi.",
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
