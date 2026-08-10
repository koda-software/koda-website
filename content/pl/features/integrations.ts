import type { FeaturePageContent } from "@/content/types";

export const integrationsFeature: FeaturePageContent = {
  seo: {
    title: "Integracje i zgodność w Opero - KSeF, e-Doręczenia, NBP, VAT, API",
    description:
      "KSeF, e-Doręczenia, kursy walut NBP i weryfikacja VAT działają wprost z systemu, a otwarte API łączy Opero z resztą narzędzi firmy.",
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
      "Opero spełnia polskie wymogi (e-fakturowanie, korespondencja urzędowa) i wymienia dane ze światem zewnętrznym bez osobnego oprogramowania - zgodność i integracje w jednym miejscu.",
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
  related: {
    eyebrow: "Pokrewne funkcje",
    title: "Zobacz też",
    items: ["security", "documents", "reports"],
  },
};
