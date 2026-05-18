import type { PageKey } from "@/lib/i18n/routes";
import type { PlaceholderPageContent } from "../types";

export const placeholderPages: Record<Exclude<PageKey, "home">, PlaceholderPageContent> = {
  opero: {
    seo: {
      title: "Opero - Adaptive ERP for Custom Operations",
      description: "Explore Opero, adaptive ERP software for custom data, workflows, automation, governance, and practical AI assistance.",
    },
    eyebrow: "Opero",
    title: "Opero product page scaffold",
    description: "This route is ready for the detailed Opero product story. The final page will be built after the homepage quality bar is approved.",
    cta: "Back to homepage",
  },
  solutions: {
    seo: {
      title: "Solutions - Flexible ERP for Business Operations",
      description: "See how Opero can support custom operations, contractor management, approvals, internal workflows, and operational search.",
    },
    eyebrow: "Solutions",
    title: "Solutions page scaffold",
    description: "This route is ready for use-case content around business problems Opero can model and automate.",
    cta: "Back to homepage",
  },
  about: {
    seo: {
      title: "About Koda Soft - Product-Grade Software Engineering",
      description: "Learn about Koda Soft, the software company building Opero with systems thinking, architecture, and product-quality execution.",
    },
    eyebrow: "About",
    title: "About page scaffold",
    description: "This route is ready for Koda Soft credibility, philosophy, and product-building story.",
    cta: "Back to homepage",
  },
  contact: {
    seo: {
      title: "Contact Koda Soft - Book an Opero Demo",
      description: "Contact Koda Soft to discuss how Opero can model custom operations, workflows, governance, and AI-assisted work for your company.",
    },
    eyebrow: "Contact",
    title: "Contact page scaffold",
    description: "This route is ready for a static-export-friendly demo and contact flow.",
    cta: "Back to homepage",
  },
};
