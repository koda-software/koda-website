const siteUrl = normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || "https://www.kodasoft.pl");

// Mirrors featureSlugs in lib/i18n/features.ts: the eight feature pages nested
// under /opero. Keep both lists in step when a slug changes.
const featureSlugs = {
  processes: { en: "process-workflow", pl: "procesy-workflow" },
  documents: { en: "document-management", pl: "eod-dms" },
  noCode: { en: "no-code", pl: "no-code" },
  lowCode: { en: "low-code-automation", pl: "low-code-automatyzacje" },
  reports: { en: "reports-analytics", pl: "raporty" },
  security: { en: "security-permissions", pl: "bezpieczenstwo-uprawnienia" },
  integrations: { en: "integrations-compliance", pl: "integracje-zgodnosc" },
  ai: { en: "contextual-ai", pl: "kontekstowe-ai" },
};

const featureRoutes = Object.entries(featureSlugs).flatMap(([key, slugs]) => [
  { page: `feature:${key}`, path: `/en/opero/${slugs.en}` },
  { page: `feature:${key}`, path: `/pl/opero/${slugs.pl}` },
]);

const featureAlternatePaths = Object.fromEntries(
  Object.entries(featureSlugs).map(([key, slugs]) => [
    `feature:${key}`,
    {
      en: `/en/opero/${slugs.en}`,
      pl: `/pl/opero/${slugs.pl}`,
      "x-default": `/en/opero/${slugs.en}`,
    },
  ]),
);

const routes = [
  { page: "home", path: "/" },
  { page: "home", path: "/pl" },
  { page: "opero", path: "/en/opero" },
  { page: "opero", path: "/pl/opero" },
  ...featureRoutes,
  { page: "solutions", path: "/en/solutions" },
  { page: "solutions", path: "/pl/solutions" },
  // Only the blog index lives here; every article and archive URL is emitted by
  // /blog-sitemap.xml, which is regenerated from the CMS on revalidation.
  { page: "blog", path: "/en/blog" },
  { page: "blog", path: "/pl/blog" },
  { page: "contact", path: "/en/contact" },
  { page: "contact", path: "/pl/contact" },
  { page: "privacy", path: "/en/privacy-policy" },
  { page: "privacy", path: "/pl/polityka-prywatnosci" },
];

const alternatePaths = {
  privacy: {
    en: "/en/privacy-policy",
    pl: "/pl/polityka-prywatnosci",
    "x-default": "/en/privacy-policy",
  },
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
  blog: {
    en: "/en/blog",
    pl: "/pl/blog",
    "x-default": "/en/blog",
  },
  contact: {
    en: "/en/contact",
    pl: "/pl/contact",
    "x-default": "/en/contact",
  },
  ...featureAlternatePaths,
};

function absoluteUrl(path) {
  const url = new URL(path, siteUrl).toString();
  return path === "/" ? url.replace(/\/$/, "") : url;
}

function sitemapEntry(route) {
  return {
    loc: route.path,
    changefreq: route.page === "home" ? "weekly" : "monthly",
    priority: route.page === "home" ? 1 : route.page === "privacy" ? 0.3 : 0.7,
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

function normalizeSiteUrl(url) {
  const parsedUrl = new URL(url);

  if (parsedUrl.hostname === "kodasoft.pl") {
    parsedUrl.hostname = "www.kodasoft.pl";
  }

  return parsedUrl.toString().replace(/\/$/, "");
}
