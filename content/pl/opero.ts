import { localizePath } from "@/lib/i18n/routes";
import type { OperoProductContent } from "../types";

export const operoProductContent: OperoProductContent = {
  seo: {
    title: "Opero - platforma BPM low-code i obieg dokumentów",
    description:
      "Opero łączy procesy i workflow, elektroniczny obieg dokumentów, konfigurację no-code, automatyzacje, raporty, uprawnienia i integracje z KSeF.",
  },
  hero: {
    eyebrow: "Produkt Opero",
    title: "Platforma BPM low-code dla firm z własnymi procesami.",
    description:
      "Opero zamienia sposób pracy Twojej firmy w działający system: obiegi pracy, dokumenty, automatyzacje, raporty i uprawnienia pod jednym dachem. Konfigurujesz wizualnie, a po kod sięgasz tylko tam, gdzie faktycznie się opłaca.",
    primaryCta: "Umów demo",
    secondaryCta: "Zobacz rozwiązania",
    diagramItems: ["Obiekty własne", "Formularze i układy", "Procesy", "Reguły", "Raporty", "Uprawnienia"],
  },
  overview: {
    eyebrow: "Czym jest Opero",
    title: "Konfigurowalna platforma zamiast rozwiązania pudełkowego.",
    paragraphs: [
      "Standardowy ERP zaczyna od gotowych modułów i oczekuje, że firma się do nich dopasuje. Opero zaczyna od tego, jak pracujesz naprawdę: jakie rekordy prowadzisz, kto co akceptuje, gdzie sprawa przechodzi między działami i które wyjątki zdarzają się na tyle często, że muszą mieć swoje miejsce w systemie.",
      "Strukturę danych, widoki i nawigację projektujesz w konfiguracji wizualnej. Do tego dochodzą procesy oparte na etapach i przejściach, elektroniczny obieg dokumentów, silnik reguł, raporty i precyzyjne uprawnienia. Wszystko na jednym modelu danych, w jednej platformie.",
      "To rozwiązanie dla firm, które wyrosły z arkuszy i gotowych modułów, ale nie chcą zamawiać systemu pisanego od zera. Konfiguracja zmienia się razem z firmą, a nie przy kolejnym projekcie programistycznym.",
    ],
  },
  features: {
    eyebrow: "Funkcje w praktyce",
    title: "Osiem obszarów, które składają się na jeden system.",
    description:
      "Każdy obszar rozwiązuje konkretny problem operacyjny, ale wszystkie działają na tych samych danych, uprawnieniach i procesach.",
    rows: [
      {
        title: "Procesy i workflow (BPM)",
        description:
          "Obieg pracy modelujesz jako etapy i przejścia, z warunkami, terminami i osobami odpowiedzialnymi. Każdy etap generuje zadania, a praca zespołu układa się na tablicy kanban i listach „moje zadania”.",
        supports: ["Etapy i przejścia", "Zadania i kanban", "Akceptacje i przekierowania", "Pełna historia przebiegu"],
      },
      {
        title: "Elektroniczny obieg dokumentów",
        description:
          "Dokument ma własną kartotekę, ścieżkę akceptacji i komplet plików z wersjami. Umowy, pisma i decyzje generujesz z szablonów wprost z danych rekordu, zawsze w aktualnej wersji.",
        supports: ["Rejestracja i numeracja", "Dekretacja i akceptacje", "Wersjonowanie plików", "Szablony dokumentów"],
      },
      {
        title: "Platforma no-code",
        description:
          "Obiekty własne i ponad 20 typów pól opisują dane, formularze i układy budują widoki, a menu i strony własne układają nawigację. Strukturę zmieniasz bezpiecznie w wersji roboczej.",
        supports: ["Obiekty i pola własne", "Formularze i układy", "Menu i strony własne", "Słowniki i listy własne"],
      },
      {
        title: "Low-code i automatyzacje",
        description:
          "Silnik reguł działa według zasady warunek to akcja: ustaw pole, utwórz rekord, wyślij powiadomienie, zablokuj przejście. Reguły testujesz przed wdrożeniem, więc automatyzacja jest przewidywalna.",
        supports: ["Wyzwalacze zdarzeń", "Kroki akcji i harmonogramy", "Skrypty i zapytania SQL", "Historia wykonań"],
      },
      {
        title: "Raporty i analityka",
        description:
          "Agregacje, wykresy i dashboardy powstają na żywych danych systemu, bez eksportu do arkuszy. Drążenie szczegółów prowadzi od liczby zbiorczej do rekordów, które się na nią składają.",
        supports: ["Raporty i wykresy", "Dashboardy zespołowe", "Drill-down do rekordów", "Zapytania SQL jako źródło"],
      },
      {
        title: "Bezpieczeństwo i uprawnienia",
        description:
          "Dostęp układasz od organizacji i jej spółek, przez role, aż po widoczność pojedynczego pola. Integracje zabezpieczasz tokenami API, a konta uwierzytelnianiem wieloskładnikowym.",
        supports: ["Role i uprawnienia do pól", "Wiele spółek w organizacji", "Tokeny API i MFA", "Rejestr zdarzeń"],
      },
      {
        title: "Integracje i zgodność",
        description:
          "KSeF, e-Doręczenia, kursy walut NBP i weryfikacja VAT działają wprost z systemu, a otwarte API łączy Opero dwukierunkowo z pozostałymi narzędziami firmy.",
        supports: ["KSeF i e-Doręczenia", "Kursy walut NBP", "Biała lista VAT i VIES", "Otwarte API"],
      },
      {
        title: "Kontekstowe AI",
        description:
          "Asystent zna strukturę, konfigurację i dane Twojej instancji. Konsultant buduje nim konfigurację, użytkownik pyta o dane w języku naturalnym, a uprawnienia obowiązują tak samo jak przy zwykłej pracy.",
        supports: ["AI przy konfiguracji", "Pytania o dane", "Podsumowania rekordów", "Uprawnienia obowiązują AI"],
      },
    ],
  },
  featureLinks: {
    eyebrow: "Funkcje systemu",
    title: "Wejdź głębiej w obszar, który Cię dotyczy.",
    description:
      "Każda strona pokazuje to samo od środka: co dokładnie dostajesz, jak wygląda to w systemie i na jakie pytania najczęściej odpowiadamy.",
  },
  connectedModel: {
    eyebrow: "Połączony model",
    title: "Ten sam model zasila dane, proces, automatyzację i kontrolę.",
    description:
      "Wartość Opero bierze się z tego, że elementy systemu pozostają połączone. Proces zna rekord. Reguła działa na tych samych danych. Raport liczy je bez eksportu. AI korzysta z tego samego kontekstu, a uprawnienia obowiązują wszędzie tak samo.",
    layers: [
      { label: "Model danych", detail: "Obiekty własne, pola, relacje, słowniki i listy." },
      { label: "Procesy", detail: "Etapy, przejścia, zadania, akceptacje i historia." },
      { label: "Automatyzacje", detail: "Reguły, skrypty, zapytania SQL i powiadomienia." },
      { label: "Raporty", detail: "Agregacje, wykresy, dashboardy i drążenie szczegółów." },
      { label: "Uprawnienia", detail: "Role, dostęp do pól, spółki, tokeny API i logi." },
    ],
  },
  workflowExample: {
    eyebrow: "Przykład",
    title: "Faktura kosztowa: od wpływu do raportu.",
    description:
      "Faktury krążące po mailach zna każda firma. Poniżej ten sam proces poprowadzony w Opero, krok po kroku: od wpływu dokumentu, przez akceptacje i terminy, aż po raport dla zarządu.",
    needLabel: "Co się dzieje",
    supportLabel: "Jak działa to w Opero",
    rows: [
      {
        need: "Faktura wpływa do firmy",
        support: "Pobierasz ją z KSeF albo rejestrujesz ręcznie. Od razu powstaje rekord z numerem, kontrahentem i kwotą.",
      },
      {
        need: "Trzeba ją opisać i przypisać",
        support: "Dekretacja na dział, projekt lub miejsce powstawania kosztu. Kancelaria widzi inny zestaw pól niż osoba merytoryczna.",
      },
      {
        need: "Ktoś musi ją zatwierdzić",
        support: "Ścieżka akceptacji zależna od kwoty i działu, z zadaniem oraz terminem na każdym etapie.",
      },
      {
        need: "Dokument nie może zaginąć",
        support: "Skan i każda kolejna wersja pliku zostają przy rekordzie: przeszukiwalne, z kontrolą uprawnień i pełną historią.",
      },
      {
        need: "Zbliża się termin płatności",
        support: "Reguła przypomina odpowiedzialnym, zanim termin minie, i eskaluje sprawę, gdy nikt nie zareagował.",
      },
      {
        need: "Zarząd pyta o koszty",
        support: "Raport z podziałem na działy i miesiące, z drążeniem od sumy aż do pojedynczej faktury.",
      },
    ],
  },
  implementation: {
    eyebrow: "Jak powstaje konfiguracja",
    title: "System budowany wokół Twojego sposobu pracy.",
    steps: [
      {
        title: "Mapowanie",
        description: "Nazywamy rekordy, role, akceptacje, przekazania i wyjątki, które faktycznie kształtują proces w Twojej firmie.",
        supports: ["Rekordy", "Role", "Akceptacje"],
      },
      {
        title: "Modelowanie",
        description: "Przekładamy to na obiekty własne, pola, formularze, układy, uprawnienia i dane, które da się przeszukiwać.",
        supports: ["Obiekty", "Formularze", "Uprawnienia"],
      },
      {
        title: "Automatyzacja",
        description: "Dodajemy reguły, powiadomienia, kontrole cykliczne, integracje, raporty i wsparcie AI tam, gdzie realnie oszczędzają czas.",
        supports: ["Reguły", "Integracje", "Raporty"],
      },
      {
        title: "Rozwój",
        description: "Konfigurację zmieniasz wraz z firmą: nowe pole, nowy etap procesu czy nowy raport nie wymagają projektu programistycznego.",
        supports: ["Nowe pola", "Nowe etapy", "Nowe raporty"],
      },
    ],
  },
  comparison: {
    eyebrow: "Gdzie pasuje",
    title: "Pomiędzy gotowym ERP a kruchymi obejściami.",
    columns: [
      {
        label: "Standardowy ERP",
        description: "Sprawdza się, gdy firma mieści się w gotowych modułach. Trudniej dopasować go do nietypowych rekordów, wyjątków i procesów specyficznych dla branży.",
      },
      {
        label: "Arkusze i osobne narzędzia",
        description: "Na starcie elastyczne, ale wraz ze wzrostem złożoności trudno je kontrolować, przeszukiwać, automatyzować i audytować.",
      },
      {
        label: "Oprogramowanie pisane od zera",
        description: "Dopasowane do jednego momentu w czasie, ale każda zmiana workflow, roli czy raportu oznacza kolejny projekt programistyczny.",
      },
      {
        label: "Opero",
        description: "Konfigurowalna platforma, która dopasowuje się do Twojej pracy i utrzymuje dane, procesy, automatyzacje, raporty i kontrolę w spójnej całości.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Umów demo",
    title: "Jeśli proces jest specyficzny, oprogramowanie powinno umieć go zrozumieć.",
    description:
      "Opowiedz nam, jak działa Twoja firma. Pokażemy na żywo, jak Opero modeluje te dane, procesy, dokumenty i uprawnienia.",
    primaryCta: "Umów demo",
    secondaryCta: "Zobacz rozwiązania",
  },
};

export const operoProductCtas = {
  primary: localizePath("pl", "contact"),
  secondary: localizePath("pl", "solutions"),
};
