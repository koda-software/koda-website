import type { FeaturePageContent } from "@/content/types";

export const processesFeature: FeaturePageContent = {
  seo: {
    title: "System workflow i procesy BPM | Opero",
    description:
      "Zaprojektuj obieg pracy jako proces: etapy, przejścia, zadania i kanban. Automatyzuj akceptacje i procedury bez kodu. Zobacz workflow w Opero.",
  },
  navLabel: "Procesy i workflow",
  hero: {
    eyebrow: "Funkcje systemu",
    title: "Procesy i workflow - cała firma działa według Twoich reguł",
    description:
      "Zaprojektuj każdy obieg pracy jako proces. Akceptacje, obiegi dokumentów i procedury przechodzą przez zdefiniowane etapy - nic nie ginie między działami.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Zobacz Opero w akcji",
    shot: {
      src: "/features/procesy-workflow-hero.png",
      width: 1968,
      height: 1082,
      caption: "Obieg akceptacji jako etapy i przejścia",
      alt: "Diagram procesu w Opero z etapami Zbieranie wymagań, Do zrobienia, W trakcie, QA i Zrobione, połączonymi przejściami takimi jak „Rozpocznij pracę” i „Przekaż do review”",
    },
  },
  intro: {
    eyebrow: "W skrócie",
    paragraph:
      "Opero to silnik procesów, w którym rekord przechodzi przez etapy i przejścia (np. Nowe → W realizacji → Zaakceptowane → Zamknięte). Proces pilnuje kolejności, uprawnień i terminów, a każdy przebieg zostaje w historii.",
  },
  blocks: {
    eyebrow: "Co dostajesz",
    title: "Proces, który pilnuje kolejności, uprawnień i terminów.",
    items: [
      {
        title: "Procesy (workflow)",
        description:
          "Modelujesz obieg jako etapy i przejścia, z warunkami i uprawnieniami na każdym kroku. Zmiana projektu procesu nie wymaga programisty.",
      },
      {
        title: "Zadania i tablice kanban",
        description:
          "Każdy etap generuje zadania przypisane osobom, z możliwością przekierowania. Praca widoczna na kanbanie i listach „moje zadania”.",
      },
      {
        title: "Obiekty własne jako nośnik procesu",
        description:
          "Proces przypinasz do dowolnego obiektu (Wniosek, Zlecenie, Umowa), więc obiegiem obejmujesz dokładnie te dane, które masz.",
      },
      {
        title: "Formularze na etapach",
        description:
          "Na każdym etapie decydujesz, co użytkownik widzi i może zmienić. Inny zakres pól dla wnioskującego, inny dla akceptującego.",
      },
      {
        title: "Historia i odtwarzanie",
        description:
          "Pełny ślad kto, co i kiedy zmienił oraz możliwość prześledzenia przebiegu krok po kroku.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Następny krok",
    title: "Zmapuj swój pierwszy proces w Opero.",
    description: "Pokażemy, jak przenieść obieg z maili i Excela do jednego, kontrolowanego procesu.",
    primaryCta: "Umów prezentację",
  },
  seoText: {
    eyebrow: "Więcej o funkcji",
    title: "System workflow, który pilnuje kolejności i terminów.",
    paragraphs: [
      "Opero to system workflow, w którym każdy proces w firmie zamieniasz w powtarzalny, kontrolowany obieg. Rekord przechodzi przez zdefiniowane etapy i przejścia, a system pilnuje kolejności, uprawnień i terminów. Zamiast ustaleń rozproszonych w mailach i arkuszach masz jedno miejsce, w którym widać, na jakim etapie jest sprawa, kto za nią odpowiada i co wydarzyło się wcześniej.",
      "Zarządzanie procesami biznesowymi (BPM) w Opero nie wymaga programisty. Obieg projektujesz wizualnie: dodajesz etapy, łączysz je przejściami, ustawiasz warunki i osoby odpowiedzialne. Każde wejście na etap otwiera zadanie, a praca zespołu układa się na tablicy kanban i listach „moje zadania”. Akceptacje wniosków, obieg faktur, obsługa zgłoszeń czy procedury jakościowe działają dokładnie tak, jak je opiszesz.",
      "Ponieważ workflow przypinasz do dowolnego obiektu własnego, obiegiem obejmujesz własne dane firmy, a nie sztywny, narzucony schemat. Pełna historia i możliwość odtworzenia przebiegu dają porządek wymagany w audycie i codziennej pracy.",
    ],
  },
  faq: {
    eyebrow: "Pytania",
    title: "Najczęściej zadawane pytania.",
    items: [
      {
        question: "Czym jest workflow w systemie Opero?",
        answer:
          "To zdefiniowany obieg pracy złożony z etapów i przejść, przez które przechodzi rekord (np. zgłoszenie lub wniosek). Opero pilnuje kolejności, uprawnień, zadań i terminów na każdym etapie.",
      },
      {
        question: "Czy zbudowanie procesu wymaga programisty?",
        answer:
          "Nie. Procesy projektuje się wizualnie, bez kodu, a ich zmiana nie wymaga wdrożenia programistycznego.",
      },
    ],
  },
  related: {
    eyebrow: "Pokrewne funkcje",
    title: "Zobacz też",
    items: ["documents", "noCode", "lowCode"],
  },
};
