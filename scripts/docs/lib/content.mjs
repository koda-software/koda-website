import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export const locales = ['en', 'pl'];
export const manifestPath = 'content/docs-build-manifest.json';
export const readJson = (file) => JSON.parse(readFileSync(file, 'utf8'));
export const hash = (value) => createHash('sha256').update(value).digest('hex');
export function files(directory) {
  if (!existsSync(directory)) throw new Error(`Missing directory: ${directory}`);
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symlinks are not allowed in docs content: ${file}`);
    return entry.isDirectory() ? files(file) : [file];
  }).sort();
}
export function slugify(value) {
  return value.replace(/[łŁ]/g, 'l').normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
export function manualPages(root) {
  const manual = readJson(path.join(root, 'scripts/docs/manual-api-pages.json'));
  for (const locale of locales) {
    if (!Array.isArray(manual[locale]) || !manual[locale].length) throw new Error(`Missing ${locale} manual-page list`);
    const seen = new Set();
    for (const file of manual[locale]) {
      if (typeof file !== 'string' || !/^[a-z0-9/-]+\.mdx$/.test(file) || file.includes('..') || seen.has(file))
        throw new Error(`Invalid manual-page path: ${file}`);
      seen.add(file);
      if (!existsSync(path.join(root, 'content/docs', locale, 'api', file))) throw new Error(`Missing manual ${locale}/${file}`);
    }
  }
  return manual;
}
export function createManifest(root, metadata) {
  const manual = manualPages(root);
  const entries = {};
  const urls = [];
  const counts = Object.fromEntries(locales.map((locale) => [locale, { pages: 0, operoPages: 0, apiOperations: 0 }]));
  for (const file of [...files(path.join(root, 'content/docs')), ...files(path.join(root, 'content/openapi'))].sort()) {
    const relative = path.relative(root, file).replaceAll('\\', '/');
    let owner = 'manual';
    const match = relative.match(/^content\/docs\/(en|pl)\/(.+)$/);
    if (relative.startsWith('content/openapi/')) owner = 'generated';
    if (match) {
      const [, locale, local] = match;
      if (local.startsWith('opero/') || (local.startsWith('api/') && !manual[locale].includes(local.slice(4)))) owner = 'generated';
      if (/\.mdx?$/.test(local)) {
        const slug = local.replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '');
        const url = `/docs/${locale}${slug ? `/${slug}` : ''}`;
        if (urls.includes(url)) throw new Error(`Duplicate generated output URL: ${url}`);
        urls.push(url); counts[locale].pages++;
        if (local.startsWith('opero/') && !/(^|\/)index\.mdx?$/.test(local)) counts[locale].operoPages++;
      }
    }
    entries[relative] = { sha256: hash(readFileSync(file)), owner };
  }
  for (const locale of locales) {
    const schema = readJson(path.join(root, `content/openapi/external-api.${locale}.json`));
    counts[locale].apiOperations = validateSchema(schema);
    const required = [`/docs/${locale}`, `/docs/${locale}/getting-started`, `/docs/${locale}/api/authentication`,
      `/docs/${locale}/api/health/liveness-and-database-health-check`];
    if (required.some((url) => !urls.includes(url)) || !counts[locale].operoPages) throw new Error(`Incomplete ${locale} docs tree`);
  }
  return { formatVersion: 1, ...metadata, contentHash: hash(JSON.stringify(Object.entries(entries).map(([file, value]) => [file, value.sha256]))),
    counts, urls: urls.sort(), files: entries };
}
export function validateSchema(schema) {
  if (!schema || typeof schema !== 'object' || !(schema.openapi || schema.swagger) || !schema.paths || typeof schema.paths !== 'object')
    throw new Error('Invalid OpenAPI document');
  const methods = new Set(['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']);
  let operations = 0;
  for (const [endpoint, item] of Object.entries(schema.paths)) {
    if (!endpoint.startsWith('/') || !item || typeof item !== 'object') throw new Error('Invalid OpenAPI path');
    for (const [method, operation] of Object.entries(item)) if (methods.has(method)) {
      if (!operation || typeof operation !== 'object' || Array.isArray(operation)) throw new Error('Invalid OpenAPI operation');
      operations++;
    }
  }
  if (!operations || !schema.paths['/v1/health']?.get) throw new Error('OpenAPI document lacks required operations');
  return operations;
}
export function validateSnapshot(root) {
  const accepted = readJson(path.join(root, manifestPath));
  if (accepted.formatVersion !== 1 || !Number.isFinite(Date.parse(accepted.fetchedAt))) throw new Error('Invalid accepted docs manifest');
  const actual = createManifest(root, { fetchedAt: accepted.fetchedAt, sourceRevision: accepted.sourceRevision });
  if (actual.contentHash !== accepted.contentHash || JSON.stringify(actual.counts) !== JSON.stringify(accepted.counts) ||
      JSON.stringify(actual.urls) !== JSON.stringify(accepted.urls) || JSON.stringify(actual.files) !== JSON.stringify(accepted.files))
    throw new Error('Docs snapshot differs from accepted manifest. Review changes and run docs:accept-snapshot.');
  return accepted;
}
export function validateInventory(root, accepted) {
  const manual = manualPages(root);
  for (const locale of locales) for (const file of files(path.join(root, `content/docs/${locale}/api`))) {
    const relative = path.relative(root, file).replaceAll('\\', '/');
    const local = path.relative(path.join(root, `content/docs/${locale}/api`), file).replaceAll('\\', '/');
    if (!manual[locale].includes(local) && accepted.files[relative]?.owner !== 'generated')
      throw new Error(`Unclassified authored API file: ${relative}. Add manual pages to manual-api-pages.json.`);
  }
}
export function validateCandidate(candidate, accepted, exceptions, maxDrop = 10) {
  const removals = exceptions.removed ?? [];
  const seen = new Set();
  for (const item of removals) {
    if (!accepted.urls.includes(item.path) || candidate.urls.includes(item.path) || !item.reason?.trim() ||
        !Number.isInteger(item.status) || seen.has(item.path)) throw new Error(`Invalid removal exception: ${item.path}`);
    seen.add(item.path);
  }
  for (const url of accepted.urls) if (!candidate.urls.includes(url) && !seen.has(url)) throw new Error(`Unexplained removed docs URL: ${url}`);
  for (const locale of locales) for (const name of ['operoPages', 'apiOperations']) {
    if (candidate.counts[locale][name] < accepted.counts[locale][name] * (1 - maxDrop / 100))
      throw new Error(`Unexpected ${locale} ${name} count drop; review and explicitly accept a new baseline.`);
  }
  for (const [file, data] of Object.entries(accepted.files)) if (data.owner === 'manual' && candidate.files[file]?.sha256 !== data.sha256)
    throw new Error(`Generation changed a manual file: ${file}`);
}
export function checkLinks(root) {
  const problems = [];
  for (const file of files(path.join(root, 'content/docs'))) if (/\.(mdx?|json)$/.test(file)) {
    const lines = readFileSync(file, 'utf8').split('\n');
    for (const [index, line] of lines.entries()) if (/(\]\(|href=\{?["'`])\/(en|pl)(?=[/?#)"'`]|$)/.test(line))
      problems.push(`${file}:${index + 1}: docs link lacks /docs prefix`);
  }
  if (problems.length) throw new Error(problems.join('\n'));
}
export function writeManifest(root, manifest) {
  writeFileSync(path.join(root, manifestPath), `${JSON.stringify(manifest, null, 2)}\n`);
}
