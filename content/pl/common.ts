import { localizePath } from "@/lib/i18n/routes";
import type { ShellContent } from "../types";
import { featureNavItems } from "./features";

export const commonContent: ShellContent = {
  brand: "KodaSoft",
  consent: {
    title: "Czy możemy liczyć odwiedziny?",
    description:
      "Za Twoją zgodą Google Analytics i Microsoft Clarity pokażą nam, które strony pomagają, a które trzeba poprawić. Clarity nagrywa przebieg wizyty: ruchy myszy, kliknięcia i przewijanie, bez treści wpisywanej w formularze. Nie sprzedajemy danych. Zgodę zmienisz w każdej chwili w stopce.",
    privacyLinkLabel: "Polityka prywatności",
    acceptLabel: "Akceptuję",
    rejectLabel: "Odrzuć",
    customiseLabel: "Wybierz, na co się zgadzasz",
    settingsLabel: "Ustawienia cookies",
    preferences: {
      title: "Ustawienia cookies",
      description: "Poza niezbędnymi wszystko jest domyślnie wyłączone. Usługa ładuje się dopiero po włączeniu jej grupy.",
      closeLabel: "Zamknij bez zmian",
      alwaysOnLabel: "Zawsze włączone",
      detailsLabel: "Szczegóły",
      rejectAllLabel: "Odrzuć wszystkie",
      saveLabel: "Zapisz wybór",
      acceptAllLabel: "Akceptuj wszystkie",
      fields: { vendor: "Dostawca", cookies: "Pliki cookies", transfer: "Poza EOG" },
      noCookiesLabel: "Nie zapisuje plików cookies",
      policyNote: "Pełna lista podmiotów i plików: polityka prywatności, punkt 10",
    },
    categories: {
      necessary: { label: "Niezbędne", description: "Zapamiętanie Twojego wyboru w pamięci przeglądarki." },
      analytics: { label: "Analityka", description: "Statystyki odwiedzin oraz nagrania przebiegu wizyt i mapy cieplne." },
      marketing: { label: "Marketing", description: "Pomiar skuteczności kampanii reklamowych." },
    },
  },
  nav: {
    home: "Start",
    openMenu: "Otwórz menu",
    closeMenu: "Zamknij menu",
    exploreOpero: "Poznaj Opero",
    exploreOperoText: "Jedna platforma dla każdego obszaru organizacji.",
    items: [
      { page: "opero", label: "Opero" },
      { page: "solutions", label: "Rozwiązania" },
      { page: "blog", label: "Blog" },
      { page: "about", label: "O nas" },
      { page: "contact", label: "Umów demo" },
    ],
  },
  footer: {
    madeIn: "Stworzone w",
    madeInFlag: "UE",
    tagline: "Platforma BPM low-code dopasowana do tego, jak firmy naprawdę pracują.",
    description:
      "KodaSoft tworzy Opero dla firm, które potrzebują stabilnego oprogramowania dopasowanego do realnych operacji, kontroli, automatyzacji i praktycznego AI.",
    links: [{ label: "Narzędzia", href: localizePath("pl", "tools") }, { label: "Dokumentacja", href: "/docs/pl" }],
    languageLabel: "Język",
    productLine: "BPM low-code od KodaSoft",
    contact: {
      email: "kontakt@kodasoft.pl",
      phone: "+48 666 618 026",
      formLabel: "Umów demo",
    },
    productHeading: "Produkt",
    companyHeading: "Firma",
    reachHeading: "Porozmawiajmy",
    talkBody: "Bez prezentacji handlowej. Pokaż nam jeden proces, a my powiemy, co da się z nim zrobić.",
    linkedinLabel: "KodaSoft na LinkedIn",
    rights: "Wszelkie prawa zastrzeżone.",
    privacyLabel: "Polityka prywatności",
  },
};

export const navItems = commonContent.nav.items.map((item) => ({
  ...item,
  href: localizePath("pl", item.page),
  ...(item.page === "opero" ? { submenu: featureNavItems } : {}),
}));
