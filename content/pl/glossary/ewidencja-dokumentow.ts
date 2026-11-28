import type { GlossaryTerm } from "@/content/types";
import { localizeFeaturePath } from "@/lib/i18n/features";

export const ewidencjaDokumentow: GlossaryTerm = {
  slug: "ewidencja-dokumentow",
  term: "Ewidencja dokumentów",
  subtitle: "Uporządkowany spis dokumentów firmy z numerem, datą i miejscem przechowywania",
  seo: {
    title: "Ewidencja dokumentów - co to znaczy i jak ją prowadzić",
    description:
      "Ewidencja dokumentów to uporządkowany spis dokumentów firmy: numer, rodzaj, data, kontrahent, status i miejsce przechowywania. Co powinna zawierać i jak ją prowadzić, żeby każdy dokument dało się znaleźć.",
  },
  definition:
    "Ewidencja dokumentów to uporządkowany spis dokumentów, które firma otrzymuje, tworzy i przechowuje. Każdy dokument dostaje w niej wpis z numerem, rodzajem, datą, stroną (np. kontrahentem), statusem i miejscem przechowywania, dzięki czemu można go odnaleźć i wykazać, co się z nim działo.",
  sections: [
    {
      title: "Co oznacza ewidencjonowanie dokumentu",
      paragraphs: [
        "Zaewidencjonować dokument to wpisać go do rejestru w momencie, gdy pojawia się w firmie albo powstaje. Od tej chwili ma własny numer i nie może po cichu zniknąć: nawet jeśli zostanie anulowany, wpis zostaje z adnotacją.",
        "Ewidencję prowadzi się osobno dla różnych rodzajów dokumentów, bo każdy ma inne dane i inny obieg: faktury kosztowe, umowy, pełnomocnictwa, pisma, protokoły, wnioski pracowników. Dla dokumentów księgowych wymogi co do ich ewidencji i przechowywania wynikają z ustawy o rachunkowości i przepisów podatkowych.",
      ],
    },
    {
      title: "Co powinien zawierać wpis",
      paragraphs: ["Zestaw pól zależy od rodzaju dokumentu, ale prawie zawsze potrzebne są:"],
      list: [
        "Numer ewidencyjny nadawany automatycznie i niezmienny (np. UM/2026/0031).",
        "Rodzaj dokumentu i krótki opis.",
        "Datę dokumentu i datę wpisu do ewidencji.",
        "Stronę: kontrahenta, pracownika albo urząd.",
        "Status: np. w akceptacji, obowiązujący, wygasły, zarchiwizowany.",
        "Osobę odpowiedzialną za dokument.",
        "Miejsce przechowywania oryginału i plik lub skan.",
      ],
      example:
        "Ewidencja umów w firmie usługowej: każda umowa ma numer UM/rok/kolejny, kontrahenta z kartoteki, datę zawarcia i datę końca, wartość, opiekuna po stronie firmy, status i skan podpisanej wersji. Dwa miesiące przed końcem umowy opiekun dostaje przypomnienie, a lista umów wygasających w kwartale to jeden filtr, a nie przeszukiwanie segregatorów.",
    },
    {
      title: "Ewidencja papierowa a elektroniczna",
      paragraphs: [
        "Zeszyt albo arkusz wystarcza przy kilkunastu dokumentach miesięcznie. Problemy zaczynają się, gdy z ewidencji korzysta kilka osób: numery się dublują, w arkuszu ktoś nadpisuje wiersz, a dokument i jego wpis żyją w dwóch różnych miejscach.",
        "Elektroniczna ewidencja łączy wpis z dokumentem: numer nadaje system, plik jest przy wpisie, a status zmienia się razem z obiegiem akceptacji. Wtedy ewidencja przestaje być osobnym obowiązkiem i staje się efektem ubocznym pracy na dokumencie.",
      ],
    },
  ],
  guide: { label: "Poradnik: rejestr pełnomocnictw w firmie", href: "/pl/blog/rejestr-pelnomocnictw" },
  opero: {
    title: "Kartoteka dokumentów z automatyczną numeracją w Opero",
    body: "W Opero każdy rodzaj dokumentu (pismo, faktura, umowa, wniosek) to osobny obiekt z własnymi polami, numeracją i kartoteką. Numer nadaje się automatycznie przy rejestracji, pliki są przy wpisie, a status zmienia się razem z obiegiem akceptacji, z pełną historią zdarzeń.",
    link: { label: "Elektroniczny obieg dokumentów w Opero", href: localizeFeaturePath("pl", "documents") },
  },
  faq: [
    {
      question: "Czym różni się ewidencja dokumentów od archiwum?",
      answer:
        "Ewidencja to spis dokumentów z ich danymi i statusem, prowadzony na bieżąco. Archiwum to miejsce przechowywania dokumentów zakończonych spraw. Dobra ewidencja mówi, w którym miejscu archiwum leży dany dokument.",
    },
    {
      question: "Czy numer w ewidencji można zmienić?",
      answer:
        "Nie powinno się. Numer nadany przy rejestracji identyfikuje dokument przez cały okres przechowywania. Błędny wpis koryguje się adnotacją albo anulowaniem, a nie zmianą numeru.",
    },
    {
      question: "Jakie dokumenty warto ewidencjonować najpierw?",
      answer:
        "Te, które mają terminy albo skutki prawne: umowy, pełnomocnictwa, pisma urzędowe i faktury kosztowe. Ich zgubienie albo przeoczenie terminu kosztuje najwięcej.",
    },
  ],
  related: ["dziennik-podawczy", "wersjonowanie-dokumentow", "skanowanie-dokumentow"],
  sources: [{ label: "Ustawa o rachunkowości (ISAP)", href: "https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19941210591" }],
  updatedAt: "2026-11-28",
};
