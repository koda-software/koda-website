import { localizePath } from "@/lib/i18n/routes";
import type { ShellContent } from "../types";
import { featureNavItems } from "./features";

export const commonContent: ShellContent = {
  brand: "KodaSoft",
  consent: {
    title: "Can we count your visit?",
    description:
      "With your consent, Google Analytics and Microsoft Clarity show us which pages help and which need work. Clarity records how a visit unfolds: mouse movements, clicks and scrolling, without anything typed into forms. We don't sell data. You can change your mind any time from the footer.",
    privacyLinkLabel: "Privacy policy",
    acceptLabel: "Accept",
    rejectLabel: "Reject",
    customiseLabel: "Choose what you allow",
    settingsLabel: "Cookie settings",
    preferences: {
      title: "Cookie settings",
      description: "Everything except the necessary is off by default. A service loads only once its group is switched on.",
      closeLabel: "Close without changes",
      alwaysOnLabel: "Always on",
      detailsLabel: "Details",
      rejectAllLabel: "Reject all",
      saveLabel: "Save my choice",
      acceptAllLabel: "Accept all",
      fields: { vendor: "Provider", cookies: "Cookies", transfer: "Outside the EEA" },
      noCookiesLabel: "Sets no cookies",
      policyNote: "Full list of providers and cookies: privacy policy, section 10",
    },
    categories: {
      necessary: { label: "Necessary", description: "Remembers your choice in the browser's storage." },
      analytics: { label: "Analytics", description: "Visit statistics, plus recordings of how visits unfold and heatmaps." },
      marketing: { label: "Marketing", description: "Measures how ad campaigns perform." },
    },
  },
  nav: {
    home: "Home",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    exploreOpero: "Explore Opero",
    exploreOperoText: "One platform for every area of your organisation.",
    items: [
      { page: "opero", label: "Opero" },
      { page: "solutions", label: "Solutions" },
      { page: "blog", label: "Blog" },
      { page: "about", label: "About" },
      { page: "contact", label: "Book a demo" },
    ],
  },
  footer: {
    madeIn: "Made in",
    madeInFlag: "the EU",
    tagline: "A low-code BPM platform built around how companies actually work.",
    description:
      "KodaSoft builds Opero for companies that need dependable software shaped around real operations, governance, automation, and practical AI.",
    links: [{ label: "Tools", href: localizePath("en", "tools") }, { label: "Documentation", href: "/docs/en" }],
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
