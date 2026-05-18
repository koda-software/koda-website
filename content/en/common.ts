import { localizePath } from "@/lib/i18n/routes";
import type { ShellContent } from "../types";

export const commonContent: ShellContent = {
  brand: "Koda Soft",
  nav: {
    openMenu: "Open menu",
    closeMenu: "Close menu",
    items: [
      { page: "opero", label: "Opero" },
      { page: "solutions", label: "Solutions" },
      { page: "about", label: "About" },
      { page: "contact", label: "Book a demo" },
    ],
  },
  footer: {
    tagline: "Adaptive ERP software built around how companies actually work.",
    languageLabel: "Language",
  },
};

export const navItems = commonContent.nav.items.map((item) => ({
  ...item,
  href: localizePath("en", item.page),
}));
