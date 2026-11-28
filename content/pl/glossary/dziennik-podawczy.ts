import type { GlossaryTerm } from "@/content/types";
import { localizeFeaturePath } from "@/lib/i18n/features";

export const dziennikPodawczy: GlossaryTerm = {
  slug: "dziennik-podawczy",
  term: "Dziennik podawczy",
  subtitle: "Rejestr korespondencji przychodzącej i wychodzącej",
  seo: {
    title: "Dziennik podawczy - co to jest i jak prowadzić rejestr korespondencji",
    description:
      "Dziennik podawczy to rejestr pism przychodzących i wychodzących. Co powinien zawierać, jak go prowadzić w firmie i jak wygląda elektroniczny dziennik podawczy z e-Doręczeniami.",
  },
  definition:
    "Dziennik podawczy to rejestr korespondencji przychodzącej i wychodzącej, w którym każde pismo dostaje kolejny numer, datę wpływu albo wysłania, nadawcę lub adresata i informację, kto się nim zajmuje. Pozwala ustalić, co i kiedy wpłynęło do firmy albo urzędu oraz co z tym zrobiono.",
  sections: [
    {
      title: "Skąd nazwa i gdzie się go prowadzi",
      paragraphs: [
        "Nazwa pochodzi od „podawczego”, czyli punktu, w którym przyjmowano pisma. Dziennik podawczy prowadzą sekretariaty firm, kancelarie, szkoły i urzędy. W przepisach kancelaryjnych administracji publicznej ta sama funkcja występuje jako rejestr przesyłek wpływających i wychodzących, a w firmach często mówi się po prostu o rejestrze korespondencji albo rejestrze pism.",
        "Niezależnie od nazwy chodzi o to samo: każde pismo ma ślad, a w razie sporu da się wykazać, kiedy firma je otrzymała i kiedy odpowiedziała. To ma znaczenie przy terminach liczonych od dnia doręczenia, np. na odpowiedź na wezwanie albo na odwołanie od decyzji.",
      ],
    },
    {
      title: "Co powinien zawierać wpis w dzienniku podawczym",
      paragraphs: ["Minimum, które pozwala odtworzyć bieg pisma:"],
      list: [
        "Numer kolejny w roku (np. 142/2026) i datę wpływu albo wysłania.",
        "Nadawcę (dla pisma przychodzącego) albo adresata (dla wychodzącego).",
        "Znak lub numer pisma nadany przez nadawcę i jego datę.",
        "Krótki opis sprawy.",
        "Sposób doręczenia: poczta, osobiście, e-mail, e-Doręczenia.",
        "Osobę albo dział, do którego pismo przekazano, i termin odpowiedzi, jeśli jest.",
      ],
      example:
        "Do firmy wpływa przez e-Doręczenia wezwanie z urzędu skarbowego z 14-dniowym terminem odpowiedzi. Sekretariat rejestruje je pod numerem 142/2026 z datą doręczenia, przypisuje do głównej księgowej i wpisuje termin. Gdy odpowiedź wychodzi, dostaje własny numer w rejestrze pism wychodzących z odwołaniem do pisma 142/2026.",
    },
    {
      title: "Papierowy, w arkuszu czy elektroniczny",
      paragraphs: [
        "Papierowa księga działa, dopóki pism jest kilka dziennie i wszystkie przechodzą przez jedno biurko. Arkusz jest wygodniejszy w wyszukiwaniu, ale nie pilnuje terminów, łatwo w nim nadpisać wpis i nie ma przy nim skanu pisma.",
        "Elektroniczny dziennik podawczy łączy wpis z samym dokumentem: pismo ma numer nadawany automatycznie, skan albo plik z e-Doręczeń przy wpisie, osobę odpowiedzialną i termin, o którym system przypomina. Od 2025 roku spółki z KRS muszą mieć adres do e-Doręczeń, a od października 2026 także przedsiębiorcy z CEIDG, więc coraz więcej korespondencji urzędowej i tak przychodzi elektronicznie.",
      ],
    },
  ],
  guide: { label: "Poradnik: e-Doręczenia krok po kroku, od założenia skrzynki po terminy", href: "/pl/blog/e-doreczenia" },
  opero: {
    title: "Rejestr pism z terminami w Opero",
    body: "W Opero pismo przychodzące i wychodzące to rekord z numerem nadawanym przy rejestracji, plikiem pisma i osobą odpowiedzialną. Trafia do działu jako zadanie z terminem, a spóźniona odpowiedź uruchamia przypomnienie. E-Doręczenia są częścią tego samego obiegu co pozostałe pisma, a cała ścieżka zostaje w historii.",
    link: { label: "Elektroniczny obieg dokumentów w Opero", href: localizeFeaturePath("pl", "documents") },
  },
  faq: [
    {
      question: "Czy firma musi prowadzić dziennik podawczy?",
      answer:
        "Żaden ogólny przepis nie nakazuje firmom prywatnym prowadzić dziennika podawczego w określonej formie. W praktyce rejestr pism jest jedynym sposobem, żeby wykazać datę doręczenia i dotrzymać terminów, więc prowadzi go większość firm, które dostają pisma urzędowe.",
    },
    {
      question: "Czym różni się dziennik podawczy od rejestru korespondencji?",
      answer:
        "To zwykle dwie nazwy tego samego. Dziennik podawczy to nazwa tradycyjna, rejestr korespondencji albo rejestr pism to nazwa częstsza w firmach. W urzędach używa się nazw rejestr przesyłek wpływających i wychodzących.",
    },
    {
      question: "Jak numerować pisma w dzienniku podawczym?",
      answer:
        "Najprościej kolejnym numerem w ramach roku, osobno dla pism przychodzących i wychodzących (np. 142/2026 i W/58/2026). Ważne, żeby numer nadawano przy rejestracji i nigdy go nie zmieniano.",
    },
  ],
  related: ["ewidencja-dokumentow", "skanowanie-dokumentow", "szablon-dokumentu"],
  sources: [
    {
      label: "Rozporządzenie w sprawie instrukcji kancelaryjnej (Dz.U. 2011 nr 14 poz. 67, ISAP)",
      href: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU20110140067",
    },
    { label: "E-Doręczenia (gov.pl)", href: "https://www.gov.pl/web/e-doreczenia" },
  ],
  updatedAt: "2026-11-28",
};
