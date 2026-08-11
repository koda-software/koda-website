import type { FeaturePageContent } from "@/content/types";

export const documentsFeature: FeaturePageContent = {
  seo: {
    title: "Elektroniczny obieg dokumentów (EOD) i DMS | Opero",
    description:
      "Rejestruj dokumenty, prowadź je przez obieg akceptacji i trzymaj wersje plików przy sprawie. System EOD i DMS w jednej platformie Opero.",
  },
  navLabel: "EOD / DMS",
  hero: {
    eyebrow: "Funkcje systemu",
    title: "EOD i DMS - dokumenty pod kontrolą od wpływu do archiwum",
    description:
      "Rejestruj dokumenty, prowadź je przez obieg akceptacji i trzymaj każdą wersję pliku przy sprawie - zamiast po mailach i dyskach.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Zobacz Opero w akcji",
  },
  intro: {
    eyebrow: "W skrócie",
    paragraph:
      "Opero łączy obieg dokumentów (EOD) z zarządzaniem plikami (DMS): dokument ma swoją kartotekę, ścieżkę akceptacji i komplet plików z wersjami. Wszystko z pełną historią i kontrolą dostępu.",
  },
  blocks: {
    eyebrow: "Co dostajesz",
    title: "Kartoteka, obieg i pliki jako jedna całość.",
    items: [
      {
        title: "Rejestracja dokumentów",
        description:
          "Każdy typ dokumentu (pismo, faktura, wniosek) to obiekt własny z polami, numeracją i kartoteką.",
      },
      {
        title: "Obieg akceptacji",
        description:
          "Dokument krąży po zdefiniowanych etapach: dekretacja, opinie, zatwierdzenie, archiwizacja.",
      },
      {
        title: "Formularze wprowadzania",
        description:
          "Kontrolowane widoki rejestracji i dekretacji, różne dla kancelarii, działu i akceptującego.",
      },
      {
        title: "Pliki i wersjonowanie",
        description:
          "Załączniki dowiązane do rekordu, przechowywane, wersjonowane i przeszukiwalne, z kontrolą uprawnień.",
      },
      {
        title: "Szablony dokumentów",
        description:
          "Generujesz umowy, pisma i decyzje z danych rekordu według wzorców ze zmiennymi; dokument zawsze w aktualnej wersji.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Następny krok",
    title: "Uporządkuj obieg dokumentów.",
    description: "Zobacz, jak Opero prowadzi dokument od wpływu do archiwum bez luk i zagubionych plików.",
    primaryCta: "Umów prezentację",
  },
  seoText: {
    eyebrow: "Więcej o funkcji",
    title: "Dokumenty od wpływu po archiwum w jednym systemie.",
    paragraphs: [
      "Elektroniczny obieg dokumentów (EOD) w Opero porządkuje drogę każdego pisma, wniosku i faktury: od wpływu, przez dekretację i akceptacje, po archiwizację. Dokument ma własną kartotekę zbudowaną jako obiekt własny, z polami rejestrowymi i numeracją, oraz ścieżkę obiegu opartą o etapy i przejścia. Dzięki temu wiadomo, gdzie jest sprawa i kto ma ją na biurku.",
      "Warstwa DMS (zarządzanie dokumentami) trzyma pliki tam, gdzie ich miejsce, czyli przy rekordzie sprawy. Załączniki są przechowywane, wersjonowane i przeszukiwalne, z kontrolą uprawnień, więc dokumenty nie giną po dyskach i skrzynkach mailowych. Szablony dokumentów pozwalają wygenerować umowę, decyzję czy pismo wprost z danych rekordu, zawsze w aktualnej wersji i formacie.",
      "Połączenie EOD i DMS w jednej platformie oznacza, że obieg, dane i pliki nie są rozbite między osobne narzędzia. To krótsza droga sprawy, mniej ręcznego przepisywania i pełna historia na potrzeby kontroli oraz zgodności.",
    ],
  },
  faq: {
    eyebrow: "Pytania",
    title: "Najczęściej zadawane pytania.",
    items: [
      {
        question: "Czym różni się EOD od DMS?",
        answer:
          "EOD to obieg dokumentów, czyli ich droga przez firmę (rejestracja, akceptacje, archiwizacja). DMS to zarządzanie samymi plikami: przechowywanie, wersjonowanie, wyszukiwanie i uprawnienia. Opero łączy oba obszary.",
      },
      {
        question: "Czy dokumenty można generować automatycznie?",
        answer:
          "Tak. Szablony dokumentów tworzą gotowe pisma i umowy na podstawie danych z rekordu, ze zmiennymi i stałą treścią.",
      },
    ],
  },
  related: {
    eyebrow: "Pokrewne funkcje",
    title: "Zobacz też",
    items: ["processes", "noCode", "security"],
  },
};
