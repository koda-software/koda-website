import { systemAreas } from "./content-system";

/**
 * Where everything lives in the proposal, and what the menus and the footer
 * call it. One map, so the header, the phone menu and the footer cannot
 * drift apart.
 *
 * Blog and documentation point at the live site: the blog reads its articles
 * from the Opero API, which the proposal does not have a key for, and the
 * documentation is a separate product.
 */

export const base = "/propozycja";

export const routes = {
  home: base,
  system: `${base}/system`,
  area: (slug: string) => `${base}/system/${slug}`,
  solutions: `${base}/rozwiazania`,
  implementation: `${base}/wdrozenie`,
  about: `${base}/o-nas`,
  contact: `${base}/kontakt`,
  privacy: `${base}/polityka-prywatnosci`,
  blog: "/pl/blog",
  docs: "/docs/pl",
};

export type NavLink = { label: string; href: string };

export const mainNav: NavLink[] = [
  { label: "Opero", href: routes.system },
  { label: "Rozwiązania", href: routes.solutions },
  { label: "Wdrożenie", href: routes.implementation },
  { label: "O nas", href: routes.about },
  { label: "Blog", href: routes.blog },
];

export const systemNav = systemAreas.map((area) => ({
  label: area.nav,
  blurb: area.blurb,
  href: routes.area(area.slug),
}));

export const contactDetails = {
  email: "kontakt@kodasoft.pl",
  phone: "+48 666 618 026",
  site: "kodasoft.pl",
  linkedin: "https://www.linkedin.com/company/kodasoftpl",
};

export const footerColumns: Array<{ title: string; links: NavLink[] }> = [
  {
    title: "Opero",
    links: [{ label: "Platforma Opero", href: routes.system }, ...systemNav.map(({ label, href }) => ({ label, href }))],
  },
  {
    title: "Rozwiązania",
    links: [
      { label: "Obszary pracy", href: `${routes.solutions}#obszary` },
      { label: "Branże", href: `${routes.solutions}#branze` },
      { label: "Wdrożenie", href: routes.implementation },
    ],
  },
  {
    title: "Firma",
    links: [
      { label: "O nas", href: routes.about },
      { label: "Blog", href: routes.blog },
      { label: "Dokumentacja", href: routes.docs },
      { label: "Kontakt", href: routes.contact },
    ],
  },
];
