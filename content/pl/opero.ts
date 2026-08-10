import { localizePath } from "@/lib/i18n/routes";
import type { OperoProductContent } from "../types";

export const operoProductContent: OperoProductContent = {
  seo: {
    title: "Opero - Platforma BPM no-code dla procesów firmy",
    description:
      "Poznaj Opero: platformę BPM no-code do własnych danych operacyjnych, workflow, automatyzacji, kontroli i praktycznego wsparcia AI.",
  },
  hero: {
    eyebrow: "Produkt Opero",
    title: "BPM no-code dla firm z własnymi procesami.",
    description:
      "Opero pomaga KodaSoft modelować rekordy, workflow, uprawnienia, automatyzację i działania wspierane przez AI zgodnie z tym, jak firma naprawdę pracuje.",
    primaryCta: "Umów demo",
    secondaryCta: "Zobacz rozwiązania",
    diagramItems: ["Rekordy", "Formularze", "Workflow", "Reguły", "Wyszukiwanie", "Kontrola"],
  },
  overview: {
    eyebrow: "Czym jest Opero",
    title: "Konfigurowalna warstwa operacyjna, nie kolejny sztywny szablon.",
    paragraphs: [
      "Standardowy ERP zaczyna od gotowych modułów. Opero zaczyna od modelu pracy firmy: rekordów, które zespół prowadzi, powtarzalnych przekazań, potrzebnych akceptacji i wyjątków, które definiują realny proces.",
      "Produkt łączy własne dane, strukturę workflow, automatyzację, wsparcie AI, wyszukiwanie, uprawnienia i audytowalność w jednym miejscu. To ważne, bo elastyczne oprogramowanie staje się ryzykowne, gdy kontrola jest oddzielona od konfiguracji.",
      "Opero jest dla firm, które potrzebują systemu dopasowanego do ich operacji, ale nadal chcą rozwiązania, które da się kontrolować, przeszukiwać, automatyzować i rozwijać w czasie.",
    ],
  },
  features: {
    eyebrow: "Funkcje w praktyce",
    title: "Co Opero może modelować, automatyzować i kontrolować.",
    description:
      "Każda część Opero wspiera konkretny detal operacyjny bez zamieniania systemu w zbiór odłączonych narzędzi.",
    rows: [
      {
        title: "Model danych operacyjnych",
        description:
          "Twórz typy rekordów, których faktycznie używa firma: sprawy serwisowe, zasoby, wizyty, akceptacje, kontrahentów, zgłoszenia i wewnętrzne obiekty procesu.",
        supports: ["Własne obiekty i moduły", "Pola i relacje", "Słowniki i statusy", "Rekordy kontrahentów"],
      },
      {
        title: "Formularze i widoki rekordów",
        description:
          "Zbieraj właściwe informacje dla każdego procesu przez formularze i widoki rekordów, które pokazują dane, właścicieli, pliki i powiązany kontekst.",
        supports: ["Formularze procesowe", "Powiązane rekordy", "Pliki i notatki", "Układy rekordów"],
      },
      {
        title: "Struktura workflow",
        description:
          "Odwzoruj, jak praca przechodzi przez firmę: właścicieli, przekazania, akceptacje, zmiany statusów, zgłoszenia wewnętrzne i kroki operacyjne.",
        supports: ["Kroki i statusy", "Akceptacje i przekazania", "Właściciele", "Checklisty operacyjne"],
      },
      {
        title: "Reguły automatyzacji",
        description:
          "Reguły mogą reagować na zdarzenia, harmonogramy, ręczne akcje i zmiany rekordów. Opero może aktualizować dane, wysyłać powiadomienia, uruchamiać webhooki i zapisywać historię wykonań.",
        supports: ["Wyzwalacze zdarzeń", "Akcje cykliczne", "Powiadomienia i webhooki", "Historia wykonań"],
      },
      {
        title: "Wyszukiwanie i widoczność",
        description:
          "Własne dane operacyjne pozostają użyteczne, bo zespoły mogą znajdować rekordy systemowe i własne, powiązane encje, słowniki, pola i kontekst procesu.",
        supports: ["Wyszukiwanie operacyjne", "Listy danych własnych", "Powiązane rekordy", "Przeszukiwalne słowniki"],
      },
      {
        title: "Praca wspierana przez AI",
        description:
          "AI działa tam, gdzie istnieje kontekst pracy: przy tworzeniu zapytań, raportów, planowaniu skryptów, podsumowaniach, klasyfikacji i kontrolowanym wsparciu decyzji.",
        supports: ["Tworzenie zapytań", "Wsparcie raportów", "Planowanie skryptów", "Podsumowania i klasyfikacja"],
      },
      {
        title: "Kontrola i governance",
        description:
          "Elastyczność pozostaje pod kontrolą dzięki rolom, uprawnieniom, granicom organizacji, tokenom API i logom audytowym przypiętym do tego samego modelu pracy.",
        supports: ["Role i uprawnienia", "Izolacja organizacji", "Logi audytowe", "Tokeny API"],
      },
    ],
  },
  featureLinks: {
    eyebrow: "Funkcje systemu",
    title: "Osiem obszarów, z których składa się Opero.",
    description:
      "Każdy obszar ma własną stronę z opisem, co dokładnie dostajesz i jak to wygląda w systemie.",
  },
  connectedModel: {
    eyebrow: "Połączony model",
    title: "Ten sam model zasila dane, proces, automatyzację i kontrolę.",
    description:
      "Wartość Opero wynika z tego, że elementy systemu pozostają połączone. Workflow zna rekord. Reguła działa na tych samych danych. AI korzysta z kontekstu operacyjnego. Uprawnienia i audyt są nadal przypięte do procesu.",
    layers: [
      { label: "Model danych", detail: "Obiekty, pola, relacje, słowniki i kontrahenci." },
      { label: "Warstwa workflow", detail: "Statusy, właściciele, akceptacje i kroki operacyjne." },
      { label: "Warstwa automatyzacji", detail: "Reguły, harmonogramy, powiadomienia, aktualizacje i webhooki." },
      { label: "Wsparcie AI", detail: "Zapytania, raporty, skrypty, podsumowania i klasyfikacja." },
      { label: "Kontrola", detail: "Role, uprawnienia, logi audytowe i granice organizacji." },
    ],
  },
  contractorExample: {
    eyebrow: "Przykład",
    title: "Operacje kontrahentów i partnerów.",
    description:
      "Firma może uporządkować relacje z zewnętrznymi podmiotami w Opero, zamiast rozpraszać dane kontrahentów po plikach, arkuszach, skrzynkach mailowych i osobnych narzędziach.",
    needLabel: "Potrzeba",
    supportLabel: "Jak wspiera to Opero",
    rows: [
      { need: "Przechowywanie rekordów partnerów", support: "Profile kontrahentów, kontakty, adresy i statusy." },
      { need: "Śledzenie dodatkowych danych", support: "Własne pola, słowniki i atrybuty dopasowane do procesu." },
      { need: "Zarządzanie dokumentami", support: "Powiązane pliki, notatki i kontekst rekordu w jednym miejscu." },
      { need: "Przesuwanie pracy dalej", support: "Statusy, przekazania, akceptacje, powiadomienia i kolejne akcje." },
      { need: "Utrzymanie kontroli", support: "Role, uprawnienia, granice organizacji i logi audytowe." },
    ],
  },
  implementation: {
    eyebrow: "Podejście do konfiguracji",
    title: "Konfigurowane wokół modelu pracy firmy.",
    steps: [
      {
        title: "Mapowanie",
        description: "Rozpoznajemy rekordy, role, przekazania, akceptacje, wyjątki i odpowiedzialność za dane, które kształtują proces.",
        supports: ["Rekordy", "Role", "Przekazania"],
      },
      {
        title: "Modelowanie",
        description: "Przekładamy model operacyjny na obiekty, pola, formularze, relacje, układy, uprawnienia i dane możliwe do wyszukania.",
        supports: ["Obiekty", "Formularze", "Uprawnienia"],
      },
      {
        title: "Automatyzacja",
        description: "Dodajemy reguły, powiadomienia, kontrole cykliczne, aktualizacje rekordów, webhooki, skrypty i działania wspierane przez AI.",
        supports: ["Reguły", "Powiadomienia", "Wsparcie AI"],
      },
      {
        title: "Usprawnianie",
        description: "Dostosowujemy pola, workflow, automatyzacje i widoki wraz ze zmianami w firmie, zamiast budować system od nowa.",
        supports: ["Iteracja", "Widoczność", "Kontrola"],
      },
    ],
  },
  comparison: {
    eyebrow: "Gdzie pasuje",
    title: "Pomiędzy sztywnym ERP a kruchymi obejściami.",
    columns: [
      {
        label: "Standardowy ERP",
        description: "Pomaga, gdy firma pasuje do gotowych modułów, ale trudno dopasować go do nietypowych rekordów, przekazań i wyjątków procesu.",
      },
      {
        label: "Arkusze i osobne narzędzia",
        description: "Na początku są elastyczne, ale wraz ze wzrostem złożoności trudno je kontrolować, przeszukiwać, automatyzować i audytować.",
      },
      {
        label: "Jednorazowe oprogramowanie custom",
        description: "Dopasowane do jednego momentu, ale często kosztowne w rozwoju, gdy zmieniają się workflow, role i potrzeby raportowania.",
      },
      {
        label: "Opero",
        description: "Konfigurowalna warstwa operacyjna, która może pasować do własnej pracy firmy, zachowując połączenie danych, automatyzacji, kontroli i AI.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Umów demo",
    title: "Jeśli proces jest specyficzny, oprogramowanie powinno umieć go zrozumieć.",
    description:
      "Pokaż KodaSoft, jak działa Twoja firma. Pokażemy, jak Opero może modelować dane, workflow, kontrolę i wsparcie AI wokół tego procesu.",
    primaryCta: "Umów demo",
    secondaryCta: "Zobacz rozwiązania",
  },
};

export const operoProductCtas = {
  primary: localizePath("pl", "contact"),
  secondary: localizePath("pl", "solutions"),
};
