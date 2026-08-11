import { localizePath } from "@/lib/i18n/routes";
import type { ShellContent } from "../types";
import { featureNavItems } from "./features";

export const commonContent: ShellContent = {
  brand: "KodaSoft",
  nav: {
    home: "Home",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    exploreOpero: "Explore Opero",
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
      "KodaSoft builds Opero for companies that need dependable software shaped around real operations, governance, automation, and practical AI.",
    languageLabel: "Language",
    productLine: "No-code BPM by KodaSoft",
  },
};

export const navItems = commonContent.nav.items.map((item) => ({
  ...item,
  href: localizePath("en", item.page),
  ...(item.page === "opero" ? { submenu: featureNavItems } : {}),
}));
