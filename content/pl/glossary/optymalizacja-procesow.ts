import type { GlossaryTerm } from "@/content/types";
import { localizeFeaturePath } from "@/lib/i18n/features";

export const optymalizacjaProcesow: GlossaryTerm = {
  slug: "optymalizacja-procesow",
  term: "Optymalizacja procesów",
  subtitle: "Poprawianie sposobu, w jaki praca przepływa przez firmę",
  seo: {
    title: "Optymalizacja procesów biznesowych - co to jest i od czego zacząć",
    description:
      "Optymalizacja procesów to skracanie czasu, kosztu i liczby błędów w powtarzalnej pracy firmy. Jak ją przeprowadzić krok po kroku, jakie mierniki śledzić i jakich błędów unikać.",
  },
  definition:
    "Optymalizacja procesów to systematyczne poprawianie sposobu, w jaki powtarzalna praca przepływa przez firmę - tak, żeby sprawa trwała krócej, kosztowała mniej, zawierała mniej błędów i nie gubiła się między działami. Zaczyna się od zmierzenia, jak proces działa dziś, a kończy na zmianie, której efekt da się sprawdzić w liczbach.",
  sections: [
    {
      title: "Co się optymalizuje",
      paragraphs: [
        "Proces to ciąg kroków, przez który przechodzi sprawa: faktura od wpływu do zapłaty, reklamacja od zgłoszenia do decyzji, wniosek od złożenia do realizacji. Optymalizacja nie polega na tym, żeby ludzie pracowali szybciej, tylko na usunięciu tego, co spowalnia sprawę bez dodawania wartości.",
      ],
      list: [
        "Oczekiwanie - sprawa leży w skrzynce, bo nikt nie wie, że teraz jego kolej.",
        "Zbędne kroki - podwójna akceptacja tej samej rzeczy, przepisywanie danych z maila do arkusza.",
        "Powroty - dokument wraca do poprzedniego etapu, bo zabrakło informacji na starcie.",
        "Niejasna odpowiedzialność - krok, za który nikt konkretnie nie odpowiada.",
      ],
    },
    {
      title: "Jak przeprowadzić optymalizację krok po kroku",
      paragraphs: ["Prosty cykl, który działa w małej i średniej firmie:"],
      list: [
        "Wybierz jeden proces: częsty, bolesny i mierzalny.",
        "Opisz, jak działa naprawdę, a nie jak powinien: etapy, osoby, decyzje, czas na każdym etapie.",
        "Zmierz punkt wyjścia: średni czas sprawy, liczbę powrotów, liczbę spraw po terminie.",
        "Znajdź wąskie gardło: etap, na którym sprawy czekają najdłużej.",
        "Zmień jedną rzecz i zmierz ponownie po kilku tygodniach.",
      ],
      example:
        "Firma mierzy obieg faktur kosztowych: średnio 9 dni od wpływu do akceptacji, z czego 6 dni faktura czeka na kierownika, który dostaje ją mailem między innymi wiadomościami. Zmiana: faktura trafia do kierownika jako zadanie z terminem 2 dni i przypomnieniem, a faktury do 1 000 zł akceptuje od razu księgowa. Po miesiącu średni czas spada do 3 dni, a liczba faktur zapłaconych po terminie do zera.",
    },
    {
      title: "Mierniki, które warto śledzić",
      paragraphs: [
        "Bez liczb optymalizacja zamienia się w zmianę dla samej zmiany. Wystarczy kilka mierników: czas realizacji sprawy (od startu do końca), czas na poszczególnych etapach, odsetek spraw po terminie, liczba powrotów do poprzedniego etapu i liczba spraw w toku. Najłatwiej je zbierać wtedy, gdy proces prowadzi system, który zapisuje każde przejście sprawy z datą.",
      ],
    },
  ],
  guide: { label: "Poradnik: obieg faktury kosztowej krok po kroku", href: "/pl/blog/obieg-faktury-kosztowej-krok-po-kroku" },
  opero: {
    title: "Proces, który da się zmierzyć i zmienić, w Opero",
    body: "W Opero każda sprawa przechodzi przez etapy z osobą odpowiedzialną i terminem, a historia przebiegu zapisuje każde przejście. Z tych danych budujesz raporty czasu i spraw po terminie. Gdy proces trzeba poprawić, zmieniasz konfigurację, a nie zamawiasz projekt: zmiana wchodzi po opublikowaniu, a sprawy w toku kończą się po staremu.",
    link: { label: "System workflow i automatyzacja procesów w Opero", href: localizeFeaturePath("pl", "processes") },
  },
  faq: [
    {
      question: "Czym różni się optymalizacja procesów od automatyzacji?",
      answer:
        "Optymalizacja poprawia sam proces: usuwa zbędne kroki i oczekiwanie. Automatyzacja przenosi kroki na system. Najlepiej najpierw uprościć proces, a dopiero potem go automatyzować, bo automatyzacja złego procesu tylko przyspiesza bałagan.",
    },
    {
      question: "Od jakiego procesu zacząć?",
      answer:
        "Od takiego, który jest częsty, powtarzalny i którego problemy wszyscy znają: obieg faktur, wnioski urlopowe, reklamacje, zgłoszenia serwisowe. Efekt widać szybko i łatwo go zmierzyć.",
    },
    {
      question: "Jak często wracać do procesu?",
      answer:
        "Po każdej zmianie warto zmierzyć efekt po kilku tygodniach, a potem przeglądać mierniki co kwartał. Proces zmienia się razem z firmą, więc rozwiązanie sprzed roku może już nie pasować.",
    },
  ],
  related: ["bpms", "bpmn", "raportowanie"],
  updatedAt: "2026-11-28",
};
