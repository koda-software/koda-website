// Committed as scripts/docs/verify-deployment.mjs; run from the website repo root.
import { readFileSync } from "node:fs";
import { XMLParser, XMLValidator } from "fast-xml-parser";

const PREVIEW = process.env.PREVIEW?.replace(/\/+$/, "");
const BEFORE = process.env.BEFORE ?? "/tmp/docs-sitemap-before.xml";
const headers = process.env.BYPASS ? { "x-vercel-protection-bypass": process.env.BYPASS } : {};
const expectedHash = process.env.EXPECTED_CONTENT_HASH;
if (!PREVIEW || !expectedHash) throw new Error("Set PREVIEW and EXPECTED_CONTENT_HASH.");

async function request(url, bypass = true) {
  return fetch(url, {
    headers: bypass ? headers : {}, redirect: "manual", signal: AbortSignal.timeout(30_000),
  });
}
async function text(url, bypass) {
  if (!url.startsWith("http")) return readFileSync(url, "utf8");
  const response = await request(url, bypass);
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response.text();
}
const array = (value) => value === undefined ? [] : Array.isArray(value) ? value : [value];
const parser = new XMLParser({ ignoreAttributes: false, parseTagValue: false });
function entries(xml) {
  if (XMLValidator.validate(xml) !== true) throw new Error("Malformed sitemap XML.");
  const root = parser.parse(xml).urlset;
  if (!root || typeof root !== "object") throw new Error("Expected sitemap urlset.");
  const result = new Map();
  for (const item of array(root.url)) {
    const url = new URL(item.loc);
    if (url.origin !== "https://www.kodasoft.pl" ||
        !/^\/docs\/(en|pl)(?:\/|$)/.test(url.pathname) || url.search || url.hash)
      throw new Error(`Unexpected sitemap URL: ${item.loc}`);
    if (result.has(url.pathname)) throw new Error(`Duplicate URL: ${item.loc}`);
    const alternates = array(item["xhtml:link"]).map((link) =>
      [link["@_hreflang"], link["@_href"]]).sort(([a], [b]) => a.localeCompare(b));
    for (const [language, href] of alternates) {
      if (!["en", "pl", "x-default"].includes(language) ||
          new URL(href).origin !== "https://www.kodasoft.pl")
        throw new Error(`Invalid alternate on ${item.loc}`);
    }
    result.set(url.pathname, { loc: item.loc, alternates });
  }
  if (!result.size) throw new Error("Empty sitemap.");
  return result;
}
const before = entries(await text(BEFORE, false));
const after = entries(await text(`${PREVIEW}/docs-sitemap.xml`, true));
const alias = entries(await text(`${PREVIEW}/docs/sitemap.xml`, true));
const onlyBefore = [...before.keys()].filter((p) => !after.has(p));
const onlyAfter = [...after.keys()].filter((p) => !before.has(p));
const failures = [];
if (alias.size !== after.size || [...after].some(([p, value]) =>
  JSON.stringify(value) !== JSON.stringify(alias.get(p)))) failures.push("Sitemap alias differs.");

// Exceptions shape: { removed: [{ path, reason, status, location? }], added: [...] }.
const exceptions = process.env.EXCEPTIONS
  ? JSON.parse(readFileSync(process.env.EXCEPTIONS, "utf8")) : { removed: [], added: [] };
const removed = new Map();
for (const [kind, differences] of [["removed", onlyBefore], ["added", onlyAfter]]) {
  if (!Array.isArray(exceptions[kind])) throw new Error(`Invalid exceptions.${kind}`);
  const seen = new Set();
  for (const entry of exceptions[kind]) {
    if (!differences.includes(entry.path) || seen.has(entry.path) ||
        typeof entry.reason !== "string" || !entry.reason.trim() ||
        !Number.isInteger(entry.status) || entry.status < 200 || entry.status > 599 ||
        (entry.status >= 300 && entry.status < 400 && !entry.location) ||
        (kind === "added" && entry.status !== 200))
      throw new Error(`Invalid or unused ${kind} exception: ${JSON.stringify(entry)}`);
    seen.add(entry.path);
    if (kind === "removed") removed.set(entry.path, entry);
  }
  for (const p of differences) if (!seen.has(p)) failures.push(`Unexplained ${kind}: ${p}`);
}
const manifest = JSON.parse(await text(`${PREVIEW}/docs/build.json`, true));
if (manifest.contentHash !== expectedHash) failures.push("Content hash differs from accepted preview.");
const urls = [...new Set([...before.keys(), ...after.keys()])].sort();
let next = 0;
async function worker() {
  while (next < urls.length) {
    const p = urls[next++];
    try {
      const response = await request(`${PREVIEW}${p}`);
      const exception = removed.get(p);
      const expected = exception?.status ?? 200;
      if (response.status !== expected) failures.push(`${p}: ${response.status}, expected ${expected}`);
      if (exception?.location && response.headers.get("location") !== exception.location)
        failures.push(`${p}: wrong redirect Location`);
      const html = await response.text();
      if (!after.has(p) || response.status !== 200) continue;
      const links = [...html.matchAll(/<link\b[^>]*>/gi)].map(([tag]) =>
        Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, key, value]) =>
          [key.toLowerCase(), value.replaceAll("&amp;", "&")])));
      const entry = after.get(p);
      if (!links.some((l) => l.rel === "canonical" && l.href === entry.loc))
        failures.push(`${p}: wrong canonical`);
      for (const [language, href] of entry.alternates)
        if (!links.some((l) => l.rel === "alternate" && l.hreflang === language && l.href === href))
          failures.push(`${p}: missing/wrong alternate ${language}`);
      for (const [, href] of html.matchAll(/href="(\/(?:en|pl)\/[^\"]*)"/g))
        failures.push(`${p}: unprefixed docs link ${href}`);
    } catch (error) { failures.push(`${p}: ${error.message}`); }
  }
}
await Promise.all(Array.from({ length: 8 }, worker));
console.log(`before: ${before.size}, after: ${after.size}, fetched union: ${urls.length}`);
console.log(`Verification failures: ${failures.length}`);
for (const failure of failures) console.error(failure);
process.exit(failures.length ? 1 : 0);
