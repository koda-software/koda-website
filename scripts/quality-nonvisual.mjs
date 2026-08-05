import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const siteUrl = "https://www.kodasoft.pl";
const ogImage = `${siteUrl}/og-image.png`;

const pages = [
  { file: ".next/server/app/index.html", route: "/", locale: "en", canonical: siteUrl, alternates: { en: siteUrl, pl: `${siteUrl}/pl`, "x-default": siteUrl } },
  { file: ".next/server/app/pl.html", route: "/pl", locale: "pl", canonical: `${siteUrl}/pl`, alternates: { en: siteUrl, pl: `${siteUrl}/pl`, "x-default": siteUrl } },
  { file: ".next/server/app/en/opero.html", route: "/en/opero", locale: "en", canonical: `${siteUrl}/en/opero`, alternates: { en: `${siteUrl}/en/opero`, pl: `${siteUrl}/pl/opero`, "x-default": `${siteUrl}/en/opero` }, software: true },
  { file: ".next/server/app/pl/opero.html", route: "/pl/opero", locale: "pl", canonical: `${siteUrl}/pl/opero`, alternates: { en: `${siteUrl}/en/opero`, pl: `${siteUrl}/pl/opero`, "x-default": `${siteUrl}/en/opero` }, software: true },
  { file: ".next/server/app/en/solutions.html", route: "/en/solutions", locale: "en", canonical: `${siteUrl}/en/solutions`, alternates: { en: `${siteUrl}/en/solutions`, pl: `${siteUrl}/pl/solutions`, "x-default": `${siteUrl}/en/solutions` } },
  { file: ".next/server/app/pl/solutions.html", route: "/pl/solutions", locale: "pl", canonical: `${siteUrl}/pl/solutions`, alternates: { en: `${siteUrl}/en/solutions`, pl: `${siteUrl}/pl/solutions`, "x-default": `${siteUrl}/en/solutions` } },
  // Blog index only: article slugs are CMS content and may be renamed or unpublished.
  { file: ".next/server/app/en/blog.html", route: "/en/blog", locale: "en", canonical: `${siteUrl}/en/blog`, alternates: { en: `${siteUrl}/en/blog`, pl: `${siteUrl}/pl/blog`, "x-default": `${siteUrl}/en/blog` } },
  { file: ".next/server/app/pl/blog.html", route: "/pl/blog", locale: "pl", canonical: `${siteUrl}/pl/blog`, alternates: { en: `${siteUrl}/en/blog`, pl: `${siteUrl}/pl/blog`, "x-default": `${siteUrl}/en/blog` } },
  { file: ".next/server/app/en/contact.html", route: "/en/contact", locale: "en", canonical: `${siteUrl}/en/contact`, alternates: { en: `${siteUrl}/en/contact`, pl: `${siteUrl}/pl/contact`, "x-default": `${siteUrl}/en/contact` }, contact: true },
  { file: ".next/server/app/pl/contact.html", route: "/pl/contact", locale: "pl", canonical: `${siteUrl}/pl/contact`, alternates: { en: `${siteUrl}/en/contact`, pl: `${siteUrl}/pl/contact`, "x-default": `${siteUrl}/en/contact` }, contact: true },
];

const expectedSitemap = pages.map((page) => page.canonical);
const failures = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function attrPattern(name, value) {
  return new RegExp(`${name}=["']${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`);
}

for (const page of pages) {
  assert(fs.existsSync(path.join(root, page.file)), `${page.route}: missing built HTML file`);
  const html = read(page.file);

  assert(attrPattern("lang", page.locale).test(html), `${page.route}: missing html lang=${page.locale}`);
  assert((html.match(/<h1\b/g) ?? []).length === 1, `${page.route}: expected exactly one h1`);
  assert(/<title>[^<]+<\/title>/.test(html), `${page.route}: missing title`);
  assert(/<meta name="description" content="[^"]+"/.test(html), `${page.route}: missing meta description`);
  assert(html.includes(`<link rel="canonical" href="${page.canonical}"`), `${page.route}: wrong canonical`);
  assert(html.includes(`<meta property="og:image" content="${ogImage}"`), `${page.route}: wrong og:image`);
  assert(html.includes(`<meta name="twitter:image" content="${ogImage}"`), `${page.route}: wrong twitter image`);

  for (const [locale, href] of Object.entries(page.alternates)) {
    assert(html.includes(`hrefLang="${locale}" href="${href}"`), `${page.route}: missing alternate ${locale}`);
  }

  for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
    assert(/\salt=/.test(img), `${page.route}: image without alt attribute`);
  }

  if (page.software) {
    assert(html.includes('"@type":"SoftwareApplication"'), `${page.route}: missing SoftwareApplication JSON-LD`);
    assert(html.includes('"applicationCategory":"BusinessApplication"'), `${page.route}: missing SoftwareApplication category`);
  }

  if (page.contact) {
    assert((html.match(/<label\b/g) ?? []).length >= 6, `${page.route}: contact form labels look incomplete`);
    assert(html.includes('type="email"'), `${page.route}: contact form missing email input`);
  }

  assert(!html.includes("/en/about") && !html.includes("/pl/about"), `${page.route}: contains deferred About route`);
}

const sitemap = fs.existsSync(path.join(root, "public/sitemap.xml"))
  ? read("public/sitemap.xml")
  : read(".next/server/app/sitemap.xml.body");
const locs = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
assert(JSON.stringify(locs) === JSON.stringify(expectedSitemap), "sitemap routes do not match expected launch routes");
assert(!sitemap.includes("/about"), "sitemap contains deferred About route");
assert((sitemap.match(/hreflang="x-default"/g) ?? []).length === expectedSitemap.length, "sitemap missing x-default alternates");

for (const page of pages) {
  for (const [locale, href] of Object.entries(page.alternates)) {
    assert(
      sitemap.includes(`hreflang="${locale}" href="${href}"`),
      `sitemap missing alternate ${locale} for ${page.route}`,
    );
  }
}

const robots = read(".next/server/app/robots.txt.body");
assert(robots.includes("User-Agent: *"), "robots.txt missing User-Agent rule");
assert(robots.includes("Allow: /"), "robots.txt missing Allow rule");
assert(robots.includes(`${siteUrl}/sitemap.xml`), "robots.txt missing sitemap URL");
assert(robots.includes(`${siteUrl}/blog-sitemap.xml`), "robots.txt missing blog sitemap URL");

const ogMetadata = await sharp(path.join(root, "public/og-image.png")).metadata();
assert(ogMetadata.width === 1200 && ogMetadata.height === 630, "OG image must be 1200x630");
assert(ogMetadata.format === "png", "OG image must be PNG");

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Non-visual quality checks passed for ${pages.length} pages.`);
