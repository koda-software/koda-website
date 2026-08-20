import { localizePath } from "@/lib/i18n/routes";
import type { ShellContent } from "../types";
import { featureNavItems } from "./features";

export const commonContent: ShellContent = {
  brand: "KodaSoft",
  nav: {
    home: "Start",
    openMenu: "Otwórz menu",
    closeMenu: "Zamknij menu",
    exploreOpero: "Poznaj Opero",
    items: [
      { page: "opero", label: "Opero" },
      { page: "solutions", label: "Rozwiązania" },
      { page: "blog", label: "Blog" },
      { page: "about", label: "O nas" },
      { page: "contact", label: "Umów demo" },
    ],
  },
  footer: {
    tagline: "Platforma BPM low-code dopasowana do tego, jak firmy naprawdę pracują.",
    description:
      "KodaSoft tworzy Opero dla firm, które potrzebują stabilnego oprogramowania dopasowanego do realnych operacji, kontroli, automatyzacji i praktycznego AI.",
    links: [{ label: "Dokumentacja", href: "/docs/pl" }],
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
