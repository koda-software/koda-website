import type { FeaturePageContent } from "@/content/types";

export const documentsFeature: FeaturePageContent = {
  seo: {
    title: "EOD i DMS - obieg dokumentów i pliki w Opero",
    description:
      "Rejestracja dokumentów, obieg akceptacji, wersjonowanie plików i generowanie z szablonów. Dokument pod kontrolą od wpływu do archiwum.",
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
  related: {
    eyebrow: "Pokrewne funkcje",
    title: "Zobacz też",
    items: ["processes", "noCode", "security"],
  },
};
