import type { FeaturePageContent } from "@/content/types";

export const processesFeature: FeaturePageContent = {
  seo: {
    title: "Procesy i workflow (BPM) w Opero",
    description:
      "Modeluj obiegi pracy jako procesy: etapy, przejścia, zadania, kanban i pełna historia. Akceptacje i procedury pod kontrolą, bez programisty.",
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
  related: {
    eyebrow: "Pokrewne funkcje",
    title: "Zobacz też",
    items: ["documents", "noCode", "lowCode"],
  },
};
