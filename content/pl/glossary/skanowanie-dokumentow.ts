import type { GlossaryTerm } from "@/content/types";
import { localizeFeaturePath } from "@/lib/i18n/features";

export const skanowanieDokumentow: GlossaryTerm = {
  slug: "skanowanie-dokumentow",
  term: "Skanowanie dokumentów",
  subtitle: "Zamiana papierowych dokumentów na pliki, z którymi da się pracować w systemie",
  seo: {
    title: "Skanowanie dokumentów - co to jest i jak je zorganizować w firmie",
    description:
      "Skanowanie dokumentów to zamiana papieru na pliki cyfrowe. Jak je zorganizować, żeby skan dało się znaleźć, kiedy skan może zastąpić oryginał i co zrobić z plikami po zeskanowaniu.",
  },
  definition:
    "Skanowanie dokumentów to zamiana dokumentów papierowych na pliki cyfrowe, najczęściej PDF, tak żeby można je było przechowywać, wyszukiwać i przekazywać elektronicznie. Sam skan to dopiero obraz kartki; wartość pojawia się wtedy, gdy plik trafia do właściwej sprawy z opisem, numerem i datą.",
  sections: [
    {
      title: "Skanowanie a digitalizacja",
      paragraphs: [
        "Skanowanie to czynność techniczna: kartka trafia do skanera, a z niego wychodzi plik. Digitalizacja to szersza zmiana, w której dokument od początku żyje w systemie: jest zarejestrowany, ma właściciela, przechodzi przez obieg akceptacji i można go znaleźć po danych, a nie po nazwie pliku.",
        "Firma może więc skanować wszystko i nadal nie mieć porządku, jeśli skany lądują w folderze „Skany 2026” z nazwami typu skan0001.pdf.",
      ],
    },
    {
      title: "Jak zorganizować skanowanie w firmie",
      paragraphs: ["Kilka zasad decyduje o tym, czy skany będą przydatne po roku."],
      list: [
        "Jedno miejsce wejścia: dokumenty papierowe skanuje jedna osoba albo punkt (np. sekretariat), zaraz po wpływie.",
        "Skan od razu przy sprawie: faktura przy fakturze, protokół przy zleceniu, a nie w osobnym folderze.",
        "Opis zamiast nazwy pliku: kontrahent, numer dokumentu, data i rodzaj wpisane w pola, po których da się szukać.",
        "Stała jakość: PDF, rozdzielczość pozwalająca odczytać drobny druk (zwykle 300 dpi), wszystkie strony w jednym pliku.",
        "Jasna zasada dla oryginału: co wolno zniszczyć, co trzeba przechowywać w papierze i jak długo.",
      ],
      example:
        "Do biura przychodzi pocztą faktura od dostawcy. Sekretariat skanuje ją od razu po otwarciu koperty i rejestruje: dostawca z kartoteki, numer, kwota, termin płatności, skan w załączniku. Od tej chwili faktura idzie do akceptacji elektronicznie, a oryginał trafia do segregatora z numerem nadanym przy rejestracji.",
    },
    {
      title: "Kiedy skan może zastąpić oryginał",
      paragraphs: [
        "To zależy od rodzaju dokumentu i przepisów, które go dotyczą. Na przykład ustawa o VAT pozwala przechowywać faktury elektronicznie, jeśli przez cały okres przechowywania zachowana jest autentyczność pochodzenia, integralność treści i czytelność faktury. Inne zasady obowiązują dokumentację pracowniczą, a jeszcze inne dokumenty, dla których liczy się oryginał z podpisem, jak niektóre umowy czy pełnomocnictwa.",
        "Bezpieczna praktyka: skan służy do codziennej pracy i obiegu, a o niszczeniu oryginałów decyduje osobna, spisana zasada uzgodniona z księgowością i prawnikiem.",
      ],
    },
  ],
  guide: { label: "Poradnik: elektroniczny obieg dokumentów w firmie", href: "/pl/blog/obieg-dokumentow-w-firmie" },
  opero: {
    title: "Skan przy sprawie, której dotyczy, w Opero",
    body: "W Opero skan nie trafia do folderu, tylko do rekordu: skan faktury przy fakturze kosztowej, skan protokołu w polu pliku przy zleceniu, zdjęcie usterki przy zgłoszeniu. Dokument ma swoje pola, numer i ścieżkę akceptacji, więc znajdziesz go po kontrahencie, numerze albo dacie, a nie po nazwie pliku.",
    link: { label: "Elektroniczny obieg dokumentów w Opero", href: localizeFeaturePath("pl", "documents") },
  },
  faq: [
    {
      question: "W jakim formacie skanować dokumenty?",
      answer:
        "Najczęściej w PDF, wszystkie strony dokumentu w jednym pliku. Do długiego przechowywania stosuje się wariant PDF/A, przeznaczony do archiwizacji.",
    },
    {
      question: "Jaka rozdzielczość wystarczy?",
      answer:
        "Do zwykłych dokumentów biurowych zwykle 300 dpi. Niższa rozdzielczość daje mniejsze pliki, ale drobny druk i pieczątki mogą stać się nieczytelne.",
    },
    {
      question: "Czy po zeskanowaniu można wyrzucić oryginał?",
      answer:
        "Nie zawsze. Zależy to od rodzaju dokumentu i przepisów, które go dotyczą. Zasady dla faktur, dokumentacji pracowniczej i umów są różne, więc warto je spisać razem z księgowością.",
    },
  ],
  related: ["ewidencja-dokumentow", "dziennik-podawczy", "wersjonowanie-dokumentow"],
  sources: [{ label: "Ustawa o podatku od towarów i usług (ISAP)", href: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20040540535" }],
  updatedAt: "2026-11-28",
};
