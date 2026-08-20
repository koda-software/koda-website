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
      { page: "about", label: "About" },
      { page: "contact", label: "Book a demo" },
    ],
  },
  footer: {
    tagline: "A low-code BPM platform built around how companies actually work.",
    description:
      "KodaSoft builds Opero for companies that need dependable software shaped around real operations, governance, automation, and practical AI.",
    links: [{ label: "Documentation", href: "/docs/en" }],
    languageLabel: "Language",
    productLine: "Low-code BPM by KodaSoft",
    contact: {
      email: "kontakt@kodasoft.pl",
      phone: "+48 666 618 026",
      formLabel: "Book a demo",
    },
    productHeading: "Product",
    companyHeading: "Company",
    reachHeading: "Let us talk",
    talkBody: "No sales pitch. Show us one process and we will tell you what can be done with it.",
    linkedinLabel: "KodaSoft on LinkedIn",
    rights: "All rights reserved.",
    privacyLabel: "Privacy policy",
  },
};

export const navItems = commonContent.nav.items.map((item) => ({
  ...item,
  href: localizePath("en", item.page),
  ...(item.page === "opero" ? { submenu: featureNavItems } : {}),
}));
