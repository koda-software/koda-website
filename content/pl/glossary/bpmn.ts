import type { GlossaryTerm } from "@/content/types";
import { localizeFeaturePath } from "@/lib/i18n/features";

export const bpmn: GlossaryTerm = {
  slug: "bpmn",
  term: "BPMN",
  subtitle: "Business Process Model and Notation - notacja do rysowania procesów biznesowych",
  seo: {
    title: "BPMN - co to jest notacja BPMN i jak czytać diagram procesu",
    description:
      "BPMN to standardowa notacja do modelowania procesów biznesowych. Wyjaśniamy podstawowe symbole, przykład diagramu BPMN i kiedy notacja pomaga, a kiedy przeszkadza.",
  },
  definition:
    "BPMN (Business Process Model and Notation) to międzynarodowa notacja graficzna do opisywania procesów biznesowych. Za pomocą kilku rodzajów symboli - zdarzeń, czynności, bramek i przepływów - pokazuje, kto co robi, w jakiej kolejności i od czego zależy dalszy bieg sprawy.",
  sections: [
    {
      title: "Skąd się wzięła notacja BPMN",
      paragraphs: [
        "BPMN rozwija Object Management Group (OMG), ta sama organizacja, która odpowiada za UML. Obecna wersja to BPMN 2.0.2 z 2014 roku; poprzednia, prawie identyczna wersja 2.0.1 została przyjęta jako norma ISO/IEC 19510:2013. Celem notacji jest to, żeby ten sam diagram czytali analityk, kierownik działu i programista, i żeby każdy rozumiał go tak samo.",
        "W praktyce BPMN to wspólny język między biznesem a IT. Zamiast opisu procesu na trzech stronach dostajesz jeden diagram, na którym widać kolejność kroków, punkty decyzji i miejsca, w których sprawa przechodzi z działu do działu.",
      ],
    },
    {
      title: "Podstawowe elementy diagramu BPMN",
      paragraphs: [
        "Pełna specyfikacja ma ponad sto symboli, ale do opisania większości procesów w firmie wystarcza kilka.",
      ],
      list: [
        "Zdarzenie (okrąg) - coś, co się dzieje: start procesu, koniec, wpływ dokumentu, upływ terminu.",
        "Czynność, zwykle zadanie (prostokąt z zaokrąglonymi rogami) - praca do wykonania, np. sprawdzenie faktury.",
        "Bramka (romb) - punkt decyzji albo rozgałęzienia, np. kwota powyżej 10 000 zł idzie do zarządu.",
        "Przepływ sekwencji (strzałka) - kolejność, w jakiej wykonuje się kroki.",
        "Tor i pula (pas na diagramie) - kto odpowiada za kroki: dział, rola albo osoba.",
      ],
    },
    {
      title: "Przykład: akceptacja faktury w BPMN",
      paragraphs: [
        "Prosty diagram akceptacji faktury kosztowej ma trzy tory: księgowość, kierownik działu i zarząd. Proces zaczyna zdarzenie startowe „wpłynęła faktura”. Księgowa sprawdza dane, potem bramka rozdziela ścieżkę według kwoty.",
      ],
      example:
        "Faktura do 10 000 zł trafia do kierownika, wyższa do zarządu. Jeżeli akceptujący odrzuci fakturę, strzałka wraca do księgowości z komentarzem. Po akceptacji proces kończy zdarzenie „faktura zatwierdzona do zapłaty”. Cały obieg mieści się na jednej kartce i każdy widzi, gdzie stoi jego część pracy.",
    },
    {
      title: "Kiedy BPMN pomaga, a kiedy przeszkadza",
      paragraphs: [
        "BPMN sprawdza się, gdy proces trzeba uzgodnić między kilkoma działami albo gdy diagram ma być wejściem dla systemu, który wykona proces automatycznie. Pomaga też w audycie: od razu widać kroki bez właściciela i decyzje, których nikt nie opisał.",
        "Przeszkadza, gdy diagram staje się celem samym w sobie. Model z kilkudziesięcioma rodzajami zdarzeń i bramek czyta tylko jego autor. Dla większości firm lepszy jest prosty diagram z kilkoma symbolami, który szybko zamienia się w działający obieg, niż perfekcyjny model, który nigdy nie trafia do codziennej pracy.",
      ],
    },
  ],
  guide: { label: "Poradnik: workflow - co to jest i jak zaprojektować obieg w firmie", href: "/pl/blog/workflow-co-to-jest" },
  opero: {
    title: "Od diagramu do działającego obiegu w Opero",
    body: "W Opero nie trzeba znać BPMN. Obieg rysujesz jako etapy i przejścia na kanwie, a osoby odpowiedzialne, terminy i warunki ustawiasz w formularzach. Diagram BPMN, jeśli go masz, jest dobrym opisem wymagań: tory to osoby odpowiedzialne, bramki to warunki przejść, a zadania to etapy.",
    link: { label: "System workflow w Opero", href: localizeFeaturePath("pl", "processes") },
  },
  faq: [
    {
      question: "Czym różni się BPMN od zwykłego schematu blokowego?",
      answer:
        "Schemat blokowy pokazuje kolejność kroków. BPMN ma ustalone znaczenie każdego symbolu, pokazuje też odpowiedzialność (tory), zdarzenia i rodzaje decyzji, więc ten sam diagram każdy czyta tak samo, a system może go wykonać.",
    },
    {
      question: "W czym rysować diagramy BPMN?",
      answer:
        "Popularne są bezpłatne narzędzia przeglądarkowe (np. bpmn.io, draw.io) oraz modelery wbudowane w systemy BPM. Do warsztatu z zespołem wystarczy też tablica i kartki, jeśli trzymacie się kilku podstawowych symboli.",
    },
    {
      question: "Czy BPMN 2.0 to najnowsza wersja?",
      answer:
        "Aktualna wersja specyfikacji OMG to BPMN 2.0.2 z 2014 roku. Wersja 2.0.1, od której różni się drobnymi poprawkami, jest normą ISO/IEC 19510:2013.",
    },
  ],
  related: ["bpms", "optymalizacja-procesow", "raportowanie"],
  sources: [
    { label: "Specyfikacja BPMN 2.0.2 (Object Management Group)", href: "https://www.omg.org/spec/BPMN/2.0.2/" },
  ],
  updatedAt: "2026-11-28",
};
