const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kodasoft.pl";

const routes = [
  { page: "home", path: "/" },
  { page: "home", path: "/pl" },
  { page: "opero", path: "/en/opero" },
  { page: "opero", path: "/pl/opero" },
  { page: "solutions", path: "/en/solutions" },
  { page: "solutions", path: "/pl/solutions" },
  { page: "contact", path: "/en/contact" },
  { page: "contact", path: "/pl/contact" },
];

const alternatePaths = {
  home: {
    en: "/",
    pl: "/pl",
    "x-default": "/",
  },
  opero: {
    en: "/en/opero",
    pl: "/pl/opero",
    "x-default": "/en/opero",
  },
  solutions: {
    en: "/en/solutions",
    pl: "/pl/solutions",
    "x-default": "/en/solutions",
  },
  contact: {
    en: "/en/contact",
    pl: "/pl/contact",
    "x-default": "/en/contact",
  },
};

function absoluteUrl(path) {
  const url = new URL(path, siteUrl).toString();
  return path === "/" ? url.replace(/\/$/, "") : url;
}

function sitemapEntry(route) {
  return {
    loc: route.path,
    changefreq: route.page === "home" ? "weekly" : "monthly",
    priority: route.page === "home" ? 1 : 0.7,
    alternateRefs: Object.entries(alternatePaths[route.page]).map(([hreflang, path]) => ({
      hreflang,
      href: absoluteUrl(path),
      hrefIsAbsolute: true,
    })),
  };
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  autoLastmod: false,
  generateIndexSitemap: false,
  generateRobotsTxt: false,
  transform: async () => null,
  additionalPaths: async () => routes.map(sitemapEntry),
};
