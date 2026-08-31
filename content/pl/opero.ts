import { localizePath } from "@/lib/i18n/routes";
import type { OperoProductContent } from "../types";

export const operoProductContent: OperoProductContent = {
  seo: {
    title: "Opero - platforma BPM low-code i obieg dokumentów",
    description:
      "Opero sprawia, że sposób pracy firmy staje się widoczny, powtarzalny i łatwiejszy do doskonalenia wraz z rozwojem organizacji.",
  },
  hero: {
    eyebrow: "Poznaj Opero",
    title: "Buduj system wokół Twojej firmy. Nie odwrotnie.",
    brief:
      "Każda firma wypracowuje własny sposób działania. Opero sprawia, że praca staje się widoczna, powtarzalna i łatwiejsza do doskonalenia, bez zamieniania każdej zmiany w kolejny projekt informatyczny.",
    primaryCta: "Umów demo",
    secondaryCta: "Poznaj platformę",
    visual: {
      alt: "Szanse sprzedaży w CRM Opero przedstawione na tablicy kanban",
    },
  },
  connectedModel: {
    eyebrow: "Idea Opero",
    title: "Jeden wspólny model.",
    brief:
      "Zamiast przekazywać fragmenty pracy między osobnymi narzędziami, Opero zachowuje całą historię w jednym miejscu. Od początku do końca pozostaje widoczne, co się wydarzyło, kto podjął działanie, jakie decyzje zapadły i co należy zrobić dalej.",
    comparison: {
      title: "Zgłoszenia klientów",
      ariaLabel: "Porównaj widok listy i tablicy zadań dla zgłoszeń klientów",
      beforeLabel: "Widok listy",
      beforeAlt: "Zgłoszenia klientów przedstawione jako uporządkowana lista w Opero",
      afterLabel: "Tablica zadań",
      afterAlt: "Te same zgłoszenia klientów przedstawione jako tablica procesu w Opero",
    },
    story: {
      ariaLabel: "Jak zgłoszenie klienta staje się działającym procesem w Opero",
      previousLabel: "Pokaż poprzedni krok",
      nextLabel: "Pokaż następny krok",
      steps: [
        {
          title: "Zdefiniuj informacje",
          image: {
            src: "/opero/customer-request-story/01-data-model.webp",
            alt: "Edytor modelu danych Opero z polami zgłoszenia klienta",
            width: 2094,
            height: 1691,
            magnifier: {
              src: "/opero/customer-request-story/01-magnifier.webp",
              alt: "Powiększenie wyboru typu pola z opcjami tekstu, e-maila, telefonu i identyfikatora VAT",
              width: 659,
              height: 657,
              placement: "model",
            },
          },
        },
        {
          title: "Zaprojektuj formularz",
          image: {
            src: "/opero/customer-request-story/02-form-builder.webp",
            alt: "Kreator formularzy Opero z formularzem przyjęcia zgłoszenia klienta",
            width: 1937,
            height: 1267,
            magnifier: {
              src: "/opero/customer-request-story/02-magnifier.webp",
              alt: "Powiększenie gotowego formularza zgłoszenia z polami i wskazówkami dla użytkownika",
              width: 596,
              height: 595,
              placement: "form",
            },
          },
        },
        {
          title: "Uruchom go w codziennej pracy",
          image: {
            src: "/opero/customer-request-story/03-live-request.webp",
            alt: "Wypełnione zgłoszenie klienta w Opero z załącznikiem i działaniem procesu",
            width: 2096,
            height: 1483,
            trimBottom: true,
            magnifier: {
              src: "/opero/customer-request-story/03-magnifier.webp",
              alt: "Powiększenie działania workflow przenoszącego zgłoszenie z weryfikacji do realizacji",
              width: 567,
              height: 567,
              placement: "record",
            },
          },
        },
        {
          title: "Zautomatyzuj reakcję",
          image: {
            src: "/opero/customer-request-story/04-automation.webp",
            alt: "Reguła automatyzacji Opero kierująca zgłoszenia według kategorii",
            width: 1909,
            height: 1532,
            magnifier: {
              src: "/opero/customer-request-story/04-magnifier.webp",
              alt: "Powiększenie gałęzi automatyzacji kierującej zgłoszenia według kategorii i obsługującej błędy",
              width: 529,
              height: 529,
              placement: "automation",
            },
          },
        },
        {
          title: "Ułóż przebieg pracy",
          image: {
            src: "/opero/customer-request-story/05-workflow.webp",
            alt: "Kreator workflow Opero z etapami weryfikacji, realizacji, rozwiązania i odrzucenia",
            width: 1937,
            height: 1267,
            magnifier: {
              src: "/opero/customer-request-story/05-magnifier.webp",
              alt: "Powiększenie przejść workflow z realizacji do rozwiązania lub odrzucenia",
              width: 422,
              height: 422,
              placement: "workflow",
            },
          },
        },
        {
          title: "Zachowaj pliki przy rekordzie",
          image: {
            src: "/opero/documents/record-with-file-preview.webp",
            alt: "Rekord części zamiennej w Opero z metadanymi i panelem Pliki prezentującym załączony model 3D",
            width: 2480,
            height: 1887,
            magnifier: {
              src: "/opero/documents/files-panel-magnifier.webp",
              alt: "Powiększenie karty Pliki z trzema załącznikami i informacjami o wybranym pliku STL",
              width: 497,
              height: 494,
              placement: "documents",
            },
          },
        },
        {
          title: "Zautomatyzuj obsługę faktur KSeF",
          image: {
            src: "/opero/ksef/invoice-automation-rule.webp",
            alt: "Reguła automatyzacji Opero pobierająca fakturę z KSeF, tworząca fakturę kosztową i generująca jej wizualizację PDF",
            width: 1869,
            height: 1179,
            magnifier: {
              src: "/opero/ksef/pdf-step-magnifier.webp",
              alt: "Powiększenie kroku automatyzacji generującego wizualizację faktury KSeF w formacie PDF",
              width: 353,
              height: 353,
              placement: "ksef",
            },
          },
        },
        {
          title: "Klasyfikuj i kieruj pracę z pomocą AI",
          image: {
            src: "/opero/ai/ticket-triage-rule.webp",
            alt: "Reguła obsługi zgłoszeń w Opero wykorzystująca AI do klasyfikacji zgłoszenia przed skierowaniem go do właściwego działu",
            width: 1869,
            height: 1179,
            magnifier: {
              src: "/opero/ai/categorization-step-magnifier.webp",
              alt: "Powiększenie kroku AI klasyfikującego przychodzące zgłoszenie",
              width: 360,
              height: 360,
              placement: "ai",
            },
          },
        },
        {
          title: "Analizuj i eksportuj raporty na żywo",
          image: {
            src: "/opero/reporting/open-deals-report.webp",
            alt: "Raport Opero przedstawiający otwarte szanse sprzedaży według etapu z filtrami firm, wartościami szans i wartościami ważonymi",
            width: 1879,
            height: 1314,
            magnifier: {
              src: "/opero/reporting/export-options-magnifier.webp",
              alt: "Powiększenie opcji eksportu zagregowanego widoku lub surowych danych źródłowych do formatów Excel i CSV",
              width: 316,
              height: 317,
              placement: "reports",
            },
          },
        },
        {
          title: "Współpracuj w kontekście sprawy",
          image: {
            src: "/opero/communication/comments-and-notifications.webp",
            alt: "Rekord zasobu w Opero z wątkiem komentarzy, wzmiankami i reakcjami obok panelu powiadomień",
            width: 1869,
            height: 1223,
            magnifier: {
              src: "/opero/communication/notifications-magnifier.webp",
              alt: "Powiększenie powiadomień o reakcjach na komentarze, wzmiankach i przypisanej pracy",
              width: 528,
              height: 528,
              placement: "communication",
            },
          },
        },
        {
          title: "Kontroluj dostęp w całej firmie",
          image: {
            src: "/opero/access/company-asset-access.webp",
            alt: "Ustawienia dostępu firmy w Opero z grupami odbiorców oraz włączonymi i wyłączonymi wyjątkami dla poszczególnych zasobów",
            width: 1761,
            height: 1167,
            popover: {
              src: "/opero/access/access-diagnostics-popover.webp",
              alt: "Panel diagnostyki dostępu testujący uprawnienia do tworzenia, wyświetlania i edycji dla wybranego członka firmy",
              width: 1269,
              height: 572,
            },
          },
        },
      ],
    },
  },
  productTour: {
    eyebrow: "Poznaj platformę",
    title: "Jedno Opero. Osiem możliwości.",
    brief:
      "Każda część Opero korzysta z tego samego kontekstu operacyjnego. Rekordy, dokumenty, decyzje, uprawnienia i historia pozostają połączone, gdy praca przechodzi przez kolejne obszary firmy.",
    exploreLabel: "Poznaj tę funkcję",
    chapters: [
      {
        eyebrow: "01 / Kształtuj system",
        title: "Opisuj pracę językiem własnej firmy.",
        brief:
          "Zacznij od sposobu, w jaki zespoły już opisują swoją pracę. Opero zamienia tę strukturę w system, z którego mogą korzystać i który mogą stale rozwijać.",
        features: [
          {
            feature: "noCode",
            brief: "Buduj system w języku własnej firmy, zamiast dopasowywać ją do cudzej struktury. Opero zapewnia każdemu zespołowi rekordy i ekrany, których rzeczywiście wymaga jego praca.",
          },
        ],
      },
      {
        eyebrow: "02 / Prowadź pracę",
        title: "Przeprowadzaj sprawy i dokumenty przez firmę.",
        brief:
          "Każda sprawa podąża widoczną ścieżką, ma osobę odpowiedzialną, aktualny etap i kolejny krok. Zespoły wiedzą, co posuwa się naprzód, a co wymaga uwagi.",
        features: [
          {
            feature: "processes",
            brief: "Zastąp nieformalne przekazywanie zadań widoczną ścieżką od przyjęcia do zakończenia. Każdy widzi, co się dzieje, kto odpowiada za sprawę i gdzie potrzebna jest uwaga.",
          },
          {
            feature: "documents",
            brief: "Przechowuj każdy plik obok rekordu, osób i decyzji, których dotyczy. Kontekst biznesowy pozostaje dostępny bez przeszukiwania skrzynek pocztowych i dysków współdzielonych.",
          },
        ],
      },
      {
        eyebrow: "03 / Automatyzuj i rozszerzaj",
        title: "Pozwól platformie wykonywać powtarzalną pracę.",
        brief:
          "Gdy proces jest jasno określony, Opero może przejąć powtarzalne kroki. Reguły, integracje i AI utrzymują pracę w ruchu, a ludzie zachowują kontrolę.",
        features: [
          {
            feature: "lowCode",
            brief: "Automatyzuj pracę, której zespół nie powinien powtarzać. Rutynowe decyzje są podejmowane konsekwentnie, a każde wykonanie pozostaje częścią historii procesu.",
          },
          {
            feature: "integrations",
            brief: "Połącz Opero z usługami, od których już zależy Twoja firma. Dane mogą trafiać do procesu, aktualizować go i przechodzić dalej bez utraty kontekstu biznesowego.",
          },
          {
            feature: "ai",
            brief: "AI w Opero nie ogranicza się do jednego z góry określonego zastosowania. Przekaż mu kontekst biznesowy i polecenie, a wykona zadanie jako część tego samego kontrolowanego procesu.",
          },
        ],
      },
      {
        eyebrow: "04 / Rozumiej i kontroluj",
        title: "Widzisz, co się dzieje, i decydujesz, kto może działać.",
        brief:
          "Opero pozwala mierzyć działania bez oddzielania nadzoru od codziennej pracy. Ta sama platforma pokazuje wyniki i kontroluje, kto może działać.",
        features: [
          {
            feature: "reports",
            brief:
              "Twórz raporty wokół pytań, które naprawdę zadaje Twoja firma. Analizuj dane z różnych perspektyw i przechodź bezpośrednio od podsumowania do rekordów źródłowych.",
          },
          {
            key: "communication",
            label: "Komunikacja i powiadomienia",
            brief:
              "Współpraca pozostaje związana ze sprawą, zamiast znikać w osobnych komunikatorach. Zespoły mogą pytać, odpowiadać, reagować i śledzić decyzje tam, gdzie wykonywana jest praca.",
          },
          {
            feature: "security",
            brief:
              "Dopasuj dostęp do rzeczywistej struktury organizacji. Ustal wspólne zasady, wprowadzaj precyzyjne wyjątki i sprawdzaj dokładnie, co może zrobić wybrany użytkownik.",
          },
        ],
      },
    ],
  },
  customization: {
    eyebrow: "Twoja przestrzeń pracy",
    title: "Dopasuj Opero do siebie",
    brief:
      "Opero może od pierwszego logowania wyglądać jak własny system Twojej firmy. Zastosuj logo, kolory i preferowany styl wizualny bez zmieniania sposobu działania procesów.",
    comparison: {
      title: "Dashboard zarządczy",
      ariaLabel: "Porównaj domyślną przestrzeń Opero z w pełni oznakowaną przestrzenią w ciemnym stylu",
      beforeLabel: "Opero",
      beforeAlt: "Dashboard zarządczy w domyślnej jasnej przestrzeni Opero",
      afterLabel: "Twoja marka",
      afterAlt: "Ten sam dashboard zarządczy z własnym logo, kolorami i ciemnym stylem wizualnym",
    },
  },
  finalCta: {
    eyebrow: "Zobacz Opero w swoim procesie",
    title: "Przynieś nam jeden proces. Pokażemy, jak może wyglądać w Opero.",
    brief:
      "Powiedz nam, gdzie praca zwalnia albo traci kontekst. Przygotujemy praktyczny pokaz Opero wokół tej sytuacji, zamiast przedstawiać ogólną prezentację produktu.",
    primaryCta: "Umów demo",
    secondaryCta: "Zobacz rozwiązania",
  },
};

export const operoProductCtas = {
  primary: localizePath("pl", "contact"),
  secondary: localizePath("pl", "solutions"),
};
