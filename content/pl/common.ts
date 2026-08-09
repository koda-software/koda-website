import { localizePath } from "@/lib/i18n/routes";
import type { ShellContent } from "../types";

export const commonContent: ShellContent = {
  brand: "Koda Soft",
  nav: {
    openMenu: "Otwórz menu",
    closeMenu: "Zamknij menu",
    items: [
      { page: "opero", label: "Opero" },
      { page: "solutions", label: "Rozwiązania" },
      { page: "blog", label: "Blog" },
      { page: "contact", label: "Umów demo" },
    ],
  },
  footer: {
    tagline: "Platforma BPM no-code dopasowana do tego, jak firmy naprawdę pracują.",
    description:
      "Koda Soft tworzy Opero dla firm, które potrzebują stabilnego oprogramowania dopasowanego do realnych operacji, kontroli, automatyzacji i praktycznego AI.",
    languageLabel: "Język",
    productLine: "BPM no-code od Koda Soft",
  },
};

export const navItems = commonContent.nav.items.map((item) => ({
  ...item,
  href: localizePath("pl", item.page),
}));
