import type { GlossaryTerm } from "@/content/types";
import { localizeFeaturePath } from "@/lib/i18n/features";

export const szablonDokumentu: GlossaryTerm = {
  slug: "szablon-dokumentu",
  term: "Szablon dokumentu",
  subtitle: "Gotowy wzór, w który wstawia się dane, żeby powstał jednolity dokument",
  seo: {
    title: "Szablon dokumentu - co to jest i jak generować dokumenty z danych",
    description:
      "Szablon dokumentu (formatka) to wzór ze stałym układem i polami na dane. Jak działa, czym różni się od zwykłego pliku Word i jak automatycznie generować umowy, oferty i protokoły z danych.",
  },
  definition:
    "Szablon dokumentu, nazywany też formatką albo wzorem, to dokument ze stałym układem i treścią oraz zaznaczonymi miejscami na dane, które zmieniają się za każdym razem: numer, datę, kontrahenta, kwoty, pozycje. Z jednego szablonu powstaje wiele jednolitych dokumentów bez przepisywania.",
  sections: [
    {
      title: "Jak działa szablon dokumentu",
      paragraphs: [
        "Szablon składa się z trzech warstw: stałej treści (np. warunki umowy), układu (nagłówek, stopka, logo, papier firmowy) i pól na dane, oznaczonych w treści znacznikami. Przy tworzeniu dokumentu pola wypełniają się danymi konkretnej sprawy, a pozycje, np. wiersze oferty, układają się w tabelę, ile ich jest.",
        "Najprostszy szablon to plik Word, w którym ktoś ręcznie zamienia dane. Wygodniejszy jest szablon połączony z danymi w systemie: dokument generuje się jednym kliknięciem albo automatycznie, gdy sprawa dojdzie do określonego etapu.",
      ],
    },
    {
      title: "Do jakich dokumentów stosuje się szablony",
      paragraphs: ["Szablon opłaca się wszędzie tam, gdzie dokument powstaje często i zawsze tak samo, a zmieniają się tylko dane:"],
      list: [
        "Oferty i zamówienia do dostawców.",
        "Umowy standardowe, aneksy i porozumienia.",
        "Protokoły odbioru, przekazania i szkody.",
        "Pisma do klientów i urzędów, np. odpowiedzi na reklamacje.",
        "Dokumenty kadrowe, np. skierowania i zaświadczenia.",
      ],
      example:
        "Handlowiec zamyka ofertę w systemie. Zamiast składać PDF ręcznie, generuje go z szablonu Oferta: numer, data i dane klienta wskakują w nagłówek, pozycje układają się w tabelę z cenami, a stopka ma dane firmy i logo. Gotowy plik zostaje przy ofercie i od razu można go wysłać do klienta.",
    },
    {
      title: "Korzyści i pułapki",
      paragraphs: [
        "Szablon daje jednolity wygląd dokumentów, eliminuje błędy przepisywania (zły NIP, stara cena) i skraca przygotowanie dokumentu z kilkunastu minut do kilku sekund. Pilnuje też, żeby nikt nie pominął obowiązkowego zapisu.",
        "Pułapką są szablony, które żyją w wielu kopiach na dyskach pracowników. Po roku każdy dział ma inną wersję wzoru umowy. Szablon powinien mieć jedno miejsce i jednego właściciela, a zmiana wzoru - obowiązywać od razu wszystkich.",
      ],
    },
  ],
  opero: {
    title: "Dokumenty PDF z danych rekordu w Opero",
    body: "W Opero dokument z szablonu powstaje z danych rekordu: numer, data, kontrahent i kwoty trafiają w wyznaczone miejsca, pozycje układają się w tabelę, a papier firmowy jest częścią szablonu. Plik PDF generuje się na żądanie albo automatycznie po zdarzeniu, np. zatwierdzeniu sprawy, i zostaje przy rekordzie.",
    link: { label: "Elektroniczny obieg dokumentów w Opero", href: localizeFeaturePath("pl", "documents") },
  },
  faq: [
    {
      question: "Czym różni się szablon od formularza?",
      answer:
        "Formularz służy do zbierania danych: ktoś wypełnia pola. Szablon służy do tworzenia dokumentu z danych, które już są w systemie. Często działają razem: dane z formularza trafiają do szablonu, z którego powstaje PDF.",
    },
    {
      question: "Co to jest formatka dokumentu?",
      answer:
        "To potoczna nazwa szablonu: gotowego wzoru dokumentu z miejscami do uzupełnienia. W systemach informatycznych formatką nazywa się też czasem ekran formularza do wprowadzania danych.",
    },
    {
      question: "Czy dokument z szablonu jest ważny bez podpisu?",
      answer:
        "Szablon nie zmienia wymagań co do formy dokumentu. Jeżeli umowa wymaga podpisu, dokument wygenerowany z szablonu trzeba podpisać, odręcznie albo elektronicznie, tak samo jak każdy inny.",
    },
  ],
  related: ["wersjonowanie-dokumentow", "ewidencja-dokumentow", "dziennik-podawczy"],
  updatedAt: "2026-11-28",
};
