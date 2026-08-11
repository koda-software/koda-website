import type { FeaturePageContent } from "@/content/types";

export const integrationsFeature: FeaturePageContent = {
  seo: {
    title: "Integracje i zgodność: KSeF, e-Doręczenia | Opero",
    description:
      "KSeF, e-Doręczenia, kursy NBP i weryfikacja VAT wprost z systemu. Otwarte API łączy Opero z narzędziami firmy. Zgodność bez dodatkowych aplikacji.",
  },
  navLabel: "Integracje i zgodność",
  hero: {
    eyebrow: "Funkcje systemu",
    title: "Integracje i zgodność - Opero częścią Twojego ekosystemu",
    description:
      "KSeF, e-Doręczenia, kursy NBP i weryfikacja VAT działają wprost z systemu, a otwarte API łączy Opero z resztą narzędzi firmy.",
    primaryCta: "Umów prezentację",
    secondaryCta: "Zobacz Opero w akcji",
  },
  intro: {
    eyebrow: "W skrócie",
    paragraph:
      "Opero spełnia polskie wymogi (e-fakturowanie, korespondencja urzędowa) i wymienia dane ze światem zewnętrznym bez osobnego oprogramowania.",
  },
  blocks: {
    eyebrow: "Co dostajesz",
    title: "Wymogi i wymiana danych obsłużone w systemie.",
    items: [
      {
        title: "KSeF",
        description:
          "Wysyłka i odbiór faktur ustrukturyzowanych zgodnie z obowiązkowym e-fakturowaniem w Polsce.",
      },
      {
        title: "e-Doręczenia",
        description:
          "Elektroniczna korespondencja urzędowa (odpowiednik listu poleconego) wprost z systemu.",
      },
      {
        title: "Kursy walut NBP",
        description:
          "Automatyczne pobieranie kursów (Tabela A) do przeliczeń wielowalutowych, z poprawną obsługą dni wolnych.",
      },
      {
        title: "Weryfikacja VAT",
        description: "Sprawdzanie statusu kontrahenta (biała lista / VIES), zanim wystawisz dokument.",
      },
      {
        title: "Otwarte API",
        description:
          "Łączysz Opero z systemami firmy dwukierunkowo, robiąc z platformy element ekosystemu, a nie kolejną wyspę.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Następny krok",
    title: "Połącz Opero ze swoimi systemami.",
    description: "Sprawdź, jak zgodność i integracje działają bez dodatkowego oprogramowania.",
    primaryCta: "Umów prezentację",
  },
  seoText: {
    eyebrow: "Więcej o funkcji",
    title: "Zgodność i integracje bez dodatkowych aplikacji.",
    paragraphs: [
      "Opero spełnia polskie wymogi prawne i wymienia dane ze światem zewnętrznym bez osobnego oprogramowania. Integracja z KSeF pozwala wysyłać i odbierać faktury ustrukturyzowane zgodnie z obowiązkowym e-fakturowaniem, a e-Doręczenia umożliwiają elektroniczną korespondencję urzędową wprost z systemu, bez wychodzenia do zewnętrznych portali.",
      "Codzienne operacje wspierają kolejne integracje. Kursy walut pobierane automatycznie z API NBP (Tabela A) zasilają przeliczenia wielowalutowe, z poprawną obsługą dni wolnych. Weryfikacja VAT sprawdza status kontrahenta na białej liście i w VIES, zanim wystawisz dokument, co ogranicza ryzyko i ręczne sprawdzanie.",
      "Otwarte API łączy Opero z pozostałymi narzędziami firmy w obie strony. Dzięki temu platforma staje się częścią Twojego ekosystemu, a nie kolejną odizolowaną wyspą danych. Zebranie zgodności i integracji w samej platformie skraca drogę i upraszcza utrzymanie.",
    ],
  },
  faq: {
    eyebrow: "Pytania",
    title: "Najczęściej zadawane pytania.",
    items: [
      {
        question: "Czy Opero obsługuje KSeF?",
        answer:
          "Tak. Opero integruje się z Krajowym Systemem e-Faktur, umożliwiając wysyłkę i odbiór faktur ustrukturyzowanych zgodnie z wymogami.",
      },
      {
        question: "Jak działa weryfikacja VAT?",
        answer:
          "System sprawdza numer VAT kontrahenta na białej liście oraz w VIES, potwierdzając jego status przed wystawieniem dokumentu.",
      },
    ],
  },
  related: {
    eyebrow: "Pokrewne funkcje",
    title: "Zobacz też",
    items: ["security", "documents", "reports"],
  },
};
