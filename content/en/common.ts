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
      { page: "blog", label: "Blog" },
      { page: "contact", label: "Book a demo" },
    ],
  },
  footer: {
    tagline: "A no-code BPM platform built around how companies actually work.",
    description:
      "Koda Soft builds Opero for companies that need dependable software shaped around real operations, governance, automation, and practical AI.",
    languageLabel: "Language",
    productLine: "No-code BPM by Koda Soft",
  },
};

export const navItems = commonContent.nav.items.map((item) => ({
  ...item,
  href: localizePath("en", item.page),
}));
