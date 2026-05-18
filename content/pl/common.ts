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
      { page: "about", label: "O nas" },
      { page: "contact", label: "Umów demo" },
    ],
  },
  footer: {
    tagline: "Elastyczny ERP dopasowany do tego, jak firmy naprawdę pracują.",
    languageLabel: "Język",
  },
};

export const navItems = commonContent.nav.items.map((item) => ({
  ...item,
  href: localizePath("pl", item.page),
}));
