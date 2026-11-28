import type { GlossaryTerm } from "@/content/types";
import { localizeFeaturePath } from "@/lib/i18n/features";

export const bpms: GlossaryTerm = {
  slug: "bpms",
  term: "BPMS",
  subtitle: "Business Process Management System - system do zarządzania procesami biznesowymi",
  seo: {
    title: "BPMS - co to jest system BPM i jak działa",
    description:
      "BPMS to system, który prowadzi procesy biznesowe: etapy, zadania, akceptacje i terminy. Czym różni się od BPM, EOD i ERP, i po czym poznać, że firma go potrzebuje.",
  },
  definition:
    "BPMS (Business Process Management System) to system informatyczny, który prowadzi procesy biznesowe w firmie: przydziela zadania właściwym osobom, przesuwa sprawy między etapami, pilnuje terminów i zapisuje historię każdej sprawy. BPM to podejście do zarządzania procesami, a BPMS to narzędzie, które to podejście wykonuje.",
  sections: [
    {
      title: "BPM a BPMS",
      paragraphs: [
        "BPM (Business Process Management) to sposób zarządzania firmą przez procesy: opisujesz, jak praca przepływa między ludźmi, mierzysz ją i poprawiasz. Można to robić na kartce i w arkuszu. BPMS przenosi ten opis do systemu, który pilnuje, żeby proces faktycznie tak przebiegał.",
        "Różnicę dobrze widać na przykładzie urlopu. W BPM opisujesz zasadę: wniosek akceptuje przełożony, kadry ewidencjonują. W BPMS wniosek sam trafia do przełożonego jako zadanie, po akceptacji przechodzi do kadr, a gdy przełożony nie odpowie w dwa dni, dostaje przypomnienie.",
      ],
    },
    {
      title: "Co robi system BPMS",
      paragraphs: ["Konkretne funkcje różnią się między produktami, ale rdzeń jest podobny."],
      list: [
        "Model procesu - etapy, przejścia między nimi i warunki, od których zależy ścieżka.",
        "Zadania i przypisania - kto ma coś zrobić na danym etapie, z terminem.",
        "Akceptacje - zatwierdzenie albo odrzucenie z komentarzem, także wielopoziomowe.",
        "Automatyzacje - powiadomienia, przypomnienia, generowanie dokumentów, zmiany pól.",
        "Historia i raporty - kto, kiedy i co zrobił, ile trwają etapy, gdzie stoją sprawy.",
        "Integracje - wymiana danych z systemem księgowym, ERP czy pocztą.",
      ],
    },
    {
      title: "BPMS, EOD i ERP: czym się różnią",
      paragraphs: [
        "ERP prowadzi zasoby firmy: księgowość, magazyn, sprzedaż, kadry, według gotowych, dość sztywnych procesów. EOD, czyli elektroniczny obieg dokumentów, skupia się na dokumencie: rejestracji, akceptacji i archiwizacji. BPMS skupia się na samym przebiegu pracy i pozwala zbudować obieg dla dowolnej sprawy, także takiej, której ERP nie przewiduje.",
        "Granice się zacierają. Nowoczesne platformy łączą BPMS z obiegiem dokumentów i własnym modelem danych, a coraz częściej pozwalają konfigurować procesy bez programowania (low-code).",
      ],
      example:
        "Firma logistyczna obsługuje reklamacje szkód w transporcie. ERP ma fakturę i zlecenie, ale nie ma procesu reklamacji. W BPMS reklamacja to sprawa z etapami (zgłoszona, w wyjaśnieniu, decyzja, rozliczona), ze zdjęciami szkody przy sprawie i z terminem odpowiedzi dla klienta.",
    },
    {
      title: "Po czym poznać, że firma potrzebuje BPMS",
      paragraphs: [
        "Najczęstsze sygnały to sprawy, które giną między działami, akceptacje prowadzone mailem, arkusze do śledzenia statusów i brak odpowiedzi na pytanie „na jakim etapie jest ta sprawa?”. Jeżeli ten sam rodzaj sprawy przechodzi przez firmę dziesiątki razy w miesiącu, a za każdym razem ktoś pyta, co dalej, proces nadaje się do systemu.",
      ],
    },
  ],
  guide: { label: "Poradnik: workflow - co to jest i jak zaprojektować obieg w firmie", href: "/pl/blog/workflow-co-to-jest" },
  opero: {
    title: "Opero jako platforma BPM low-code",
    body: "Opero łączy BPMS z obiegiem dokumentów i własnym modelem danych. Proces projektujesz wizualnie: dodajesz etapy, łączysz je przejściami, ustawiasz warunki i osoby odpowiedzialne. Zmiana procesu to konfiguracja, a nie projekt informatyczny: wchodzi po opublikowaniu, a sprawy w toku kończą się po staremu.",
    link: { label: "System workflow i BPM w Opero", href: localizeFeaturePath("pl", "processes") },
  },
  faq: [
    {
      question: "Czy BPMS to to samo co system workflow?",
      answer:
        "W codziennym użyciu często tak. Workflow to przepływ pracy w jednym procesie, a BPMS to system, który prowadzi wiele takich przepływów i dokłada do nich model danych, raporty i integracje.",
    },
    {
      question: "Czy wdrożenie BPMS wymaga programistów?",
      answer:
        "Klasyczne systemy BPM często tak. Platformy low-code pozwalają większość procesów skonfigurować bez programowania; programista przydaje się przy nietypowych integracjach.",
    },
    {
      question: "Od którego procesu zacząć?",
      answer:
        "Od częstego, powtarzalnego i bolesnego: obieg faktur kosztowych, wnioski urlopowe, reklamacje, zgłoszenia serwisowe. Taki proces szybko pokazuje oszczędność czasu i uczy firmę pracy w systemie.",
    },
  ],
  related: ["bpmn", "optymalizacja-procesow", "dashboard"],
  updatedAt: "2026-11-28",
};
