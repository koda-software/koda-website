import type { GlossaryTerm } from "@/content/types";
import { localizeFeaturePath } from "@/lib/i18n/features";

export const wersjonowanieDokumentow: GlossaryTerm = {
  slug: "wersjonowanie-dokumentow",
  term: "Wersjonowanie dokumentów",
  subtitle: "Zapisywanie kolejnych wersji pliku tak, żeby wiadomo było, która obowiązuje",
  seo: {
    title: "Wersjonowanie dokumentów - co to jest i jak je prowadzić",
    description:
      "Wersjonowanie dokumentów to zapisywanie kolejnych wersji pliku z informacją kto, kiedy i co zmienił. Jak działa, jak numerować wersje i dlaczego „umowa_final_v3_poprawiona” to sygnał ostrzegawczy.",
  },
  definition:
    "Wersjonowanie dokumentów to zapisywanie kolejnych wersji tego samego dokumentu zamiast nadpisywania pliku, z informacją, kto i kiedy wprowadził zmianę. Dzięki temu zawsze wiadomo, która wersja obowiązuje, a wcześniejsze można otworzyć i porównać.",
  sections: [
    {
      title: "Po co wersjonować dokumenty",
      paragraphs: [
        "Bez wersjonowania historia dokumentu żyje w nazwach plików: umowa.docx, umowa_poprawki.docx, umowa_final.docx, umowa_final_v2_po_uwagach_klienta.docx. Po tygodniu nikt nie wie, która jest właściwa, a przy sporze nie da się ustalić, co dokładnie zaakceptowano.",
        "Wersjonowanie rozwiązuje trzy problemy: wszyscy pracują na aktualnej wersji, każda zmiana ma autora i datę, a do starszej wersji można wrócić albo sprawdzić, co się zmieniło między wersjami.",
      ],
    },
    {
      title: "Jak działa wersjonowanie",
      paragraphs: [
        "Dokument ma jedno miejsce i jedną tożsamość, a pod nią listę wersji. Dodanie nowego pliku nie usuwa poprzedniego, tylko dopisuje kolejną pozycję z autorem, datą i często komentarzem, co zmieniono. Jedna wersja jest oznaczona jako aktualna.",
      ],
      list: [
        "Numeracja: najczęściej kolejne liczby (1, 2, 3) albo wersje główne i poprawki (1.0, 1.1, 2.0), gdzie zmiana główna to np. nowa treść umowy, a poprawka to literówka.",
        "Wersje robocze i zatwierdzone: wersja zaakceptowana w obiegu powinna być wyraźnie oznaczona, żeby nikt nie wysłał klientowi szkicu.",
        "Historia: kto dodał wersję, kiedy, z jakim komentarzem; przy dokumentach ważnych prawnie także kto ją zaakceptował.",
      ],
      example:
        "Faktura kosztowa ma przy sobie trzy wersje pliku: skan z e-maila, korektę z poprawioną pozycją 3 i wersję zatwierdzoną po akceptacji. Księgowa widzi, że do zapłaty idzie wersja trzecia, a audytor może sprawdzić, co i kiedy się zmieniło.",
    },
    {
      title: "Wersjonowanie a historia zmian",
      paragraphs: [
        "Wersjonowanie dotyczy pliku: treści dokumentu. Historia zmian dotyczy danych sprawy: kto zmienił kwotę, termin albo status i kiedy sprawa przeszła do kolejnego etapu. W dobrze prowadzonym obiegu oba ślady są przy tym samym dokumencie, więc da się odtworzyć zarówno to, jak zmieniał się plik, jak i to, co działo się ze sprawą.",
      ],
    },
  ],
  guide: { label: "Poradnik: elektroniczny obieg dokumentów w firmie", href: "/pl/blog/obieg-dokumentow-w-firmie" },
  opero: {
    title: "Pliki z wersjami przy sprawie w Opero",
    body: "W Opero dokument to rekord z własnymi polami, ścieżką akceptacji i plikami przy sprawie, a nie plik w folderze. Historia rekordu zapisuje, kto i kiedy zmienił pole i jak sprawa przechodziła przez etapy, więc zawsze widać, na jakiej podstawie dokument zatwierdzono.",
    link: { label: "Elektroniczny obieg dokumentów w Opero", href: localizeFeaturePath("pl", "documents") },
  },
  faq: [
    {
      question: "Czym różni się wersjonowanie od kopii zapasowej?",
      answer:
        "Kopia zapasowa chroni przed utratą danych i odtwarza stan z określonego dnia. Wersjonowanie pokazuje kolejne zmiany jednego dokumentu z autorami i pozwala wskazać, która wersja obowiązuje.",
    },
    {
      question: "Ile wersji dokumentu przechowywać?",
      answer:
        "Przy dokumentach ważnych prawnie i finansowo wszystkie, które brały udział w obiegu, zwłaszcza zaakceptowaną. Wersje czysto robocze można ograniczać, jeżeli firma ma taką zasadę spisaną.",
    },
    {
      question: "Czy wersjonowanie zastępuje komentarze?",
      answer:
        "Nie. Wersja pokazuje, co się zmieniło, ale rzadko dlaczego. Uzasadnienie zmiany lepiej zapisać w komentarzu przy dokumencie albo przy nowej wersji.",
    },
  ],
  related: ["ewidencja-dokumentow", "szablon-dokumentu", "skanowanie-dokumentow"],
  updatedAt: "2026-11-28",
};
