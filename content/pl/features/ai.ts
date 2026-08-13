import type { FeaturePageContent } from "@/content/types";

export const aiFeature: FeaturePageContent = {
  seo: {
    title: "Kontekstowe AI dla firm | Opero",
    description:
      "Asystent AI, który zna strukturę i dane Twojego systemu. Konsultant buduje nim konfigurację, użytkownik pyta o dane w języku naturalnym.",
  },
  navLabel: "Kontekstowe AI",
  hero: {
    eyebrow: "Funkcje systemu",
    title: "Kontekstowe AI - asystent, który zna Twój system",
    description:
      "AI pracuje na strukturze i danych Twojej instancji, a nie na ogólnej wiedzy o oprogramowaniu. Konsultant buduje nim konfigurację, użytkownik pyta o dane w języku naturalnym.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Zobacz Opero w akcji",
  },
  intro: {
    eyebrow: "W skrócie",
    paragraph:
      "Asystent AI w Opero zna kontekst Twojej instancji: strukturę danych, konfigurację i bieżące rekordy. Dzięki temu odpowiada konkretami zamiast ogólników, a ten sam mechanizm służy dwóm grupom: konsultantom przy konfiguracji i użytkownikom końcowym w codziennej pracy.",
  },
  demo: {
    kind: "ai",
    assistantName: "Asystent Opero",
    contextLabel: "kontekst: ZGL/2026/019",
    question: "Podsumuj to zgłoszenie i zaproponuj termin realizacji.",
    readingLabel: "Czytam kontekst",
    contextItems: ["Zgłoszenie ZGL/2026/019", "Historia obiegu", "Załączniki (2)"],
    answer: "Awaria centrali VoIP w Hotelu Panorama, priorytet krytyczny, technik na miejscu od wczoraj. Podobne awarie zamykaliście średnio w 2 dni — proponuję termin 14.08.2026.",
    proposalLabel: "Proponowana zmiana",
    proposalField: "Termin realizacji",
    proposalValue: "2026-08-14",
    applyLabel: "Zastosuj",
    dismissLabel: "Odrzuć",
    savedLabel: "Zapisano w rekordzie",
    appliedLabel: "ZGL/2026/019 · Termin realizacji",
    captions: { ask: "Pytasz <b>w kontekście rekordu</b>", reading: "AI czyta <b>rekord, historię i załączniki</b>", answer: "Odpowiada i proponuje <b>konkretną zmianę</b>", applied: "Zatwierdzasz — zmiana <b>ląduje w rekordzie</b>" },
  },
  blocks: {
    eyebrow: "Co dostajesz",
    title: "Jeden asystent, dwie grupy odbiorców.",
    items: [
      {
        title: "AI konfiguracyjne (dla konsultantów)",
        description:
          "Budowa i modyfikacja obiektów, formularzy, reguł i procesów w dialogu z asystentem, z walidacją przed zapisem. Wdrożenie przyspiesza, bo asystent zna zasady, według których zbudowana jest platforma.",
      },
      {
        title: "AI dla użytkowników końcowych",
        description:
          "Pytania o dane w języku naturalnym, wyszukiwanie rekordów i podsumowania bez klikania po widokach.",
      },
      {
        title: "Uprawnienia obowiązują także AI",
        description:
          "Asystent widzi dokładnie tyle, ile rola danego użytkownika. Ten sam zakres dostępu obowiązuje przy pytaniach o dane i przy zmianach w konfiguracji.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Następny krok",
    title: "Zobacz AI, które zna Twój Opero.",
    description: "Pokażemy, jak asystent przyspiesza i konfigurację, i codzienną pracę z danymi.",
    primaryCta: "Umów prezentację",
  },
  seoText: {
    eyebrow: "Więcej o funkcji",
    title: "Asystent AI, który rozumie Twój system.",
    paragraphs: [
      "Kontekstowe AI w Opero to asystent, który zna strukturę i dane Twojej instancji. Zamiast ogólnych odpowiedzi dostajesz pomoc świadomą kontekstu: AI rozumie Twoje obiekty, pola, procesy i uprawnienia, bo łączy się z platformą przez bezpieczny, kontrolowany dostępem mechanizm. Ten sam mechanizm obsługuje dwie grupy odbiorców, konsultantów i użytkowników końcowych.",
      "Dla konsultantów AI przyspiesza konfigurację. W dialogu z asystentem budujesz i zmieniasz obiekty, formularze, reguły i procesy, z walidacją przed zapisem. Ponieważ AI zna kontrakt platformy, wdrożenie idzie szybciej, a błędów jest mniej. Dla użytkowników końcowych AI upraszcza codzienną pracę: pytasz o dane w języku naturalnym, wyszukujesz rekordy i dostajesz podsumowania bez klikania po widokach.",
      "Fundamentem jest bezpieczny, świadomy kontekstu dostęp do konfiguracji i danych, z pełnym poszanowaniem uprawnień użytkownika. To sprawia, że AI w Opero jest praktycznym narzędziem pracy, a nie oderwanym od systemu dodatkiem.",
    ],
  },
  faq: {
    eyebrow: "Pytania",
    title: "Najczęściej zadawane pytania.",
    items: [
      {
        question: "Jak AI poznaje kontekst Twojego systemu?",
        answer:
          "Asystent łączy się z konfiguracją i bieżącymi danymi Twojej instancji przez bezpieczny, świadomy kontekstu mechanizm, z zachowaniem uprawnień użytkownika, który zadaje pytanie.",
      },
      {
        question: "Do czego służy AI w Opero?",
        answer:
          "Konsultantom pomaga budować konfigurację (obiekty, reguły, procesy), a użytkownikom końcowym odpowiada na pytania o dane w języku naturalnym.",
      },
    ],
  },
  related: {
    eyebrow: "Pokrewne funkcje",
    title: "Zobacz też",
    items: ["noCode", "lowCode", "reports"],
  },
};
