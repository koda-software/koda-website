import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, renameSync } from 'node:fs';
import { createManifest, validateSnapshot, validateInventory, validateCandidate, writeManifest } from '../lib/content.mjs';
import { fetchJson, fetchKnowledgeBase } from '../lib/fetch.mjs';
import { generate, replaceGenerated } from '../lib/generate.mjs';
import { validateSearch, previewIndexNames } from '../lib/search.mjs';

function fixture(t) {
  const root = mkdtempSync(path.join(tmpdir(), 'website-docs-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  function put(file, value) { const dest = path.join(root, file); mkdirSync(path.dirname(dest), { recursive: true }); writeFileSync(dest, typeof value === 'string' ? value : JSON.stringify(value)); }
  put('scripts/docs/manual-api-pages.json', { en: ['authentication.mdx'], pl: ['authentication.mdx'] });
  put('scripts/docs/content-policy.json', { mode: 'snapshot' });
  for (const locale of ['en', 'pl']) {
    for (const file of ['index', 'getting-started', 'api/authentication', 'api/health/liveness-and-database-health-check', 'opero/index', 'opero/section/guide']) put(`content/docs/${locale}/${file}.mdx`, `---\ntitle: ${file}\n---\nHello`);
    put(`content/openapi/external-api.${locale}.json`, { openapi: '3.0.0', paths: { '/v1/health': { get: { responses: {} } } } });
  }
  const manifest = createManifest(root, { fetchedAt: '2026-10-02T00:00:00Z', sourceRevision: 'test' }); writeManifest(root, manifest);
  return { root, put, manifest };
}
const record = (id = '1', slug = 'guide') => ({ id, contentLocale: 'en', values: { tytul: 'Guide', slug, sekcja: 'Section', jawnosc: 'publiczna', status: 'active' } });
const response = (data, total, page = 1) => new Response(JSON.stringify({ data, meta: { total, page, limit: 100 } }), { status: 200 });

test('snapshot builds never call docs APIs and detect edited source', async (t) => {
  const { root, put, manifest } = fixture(t);
  const current = await generate(root, { env: { CI: 'true' }, fetchOptions: { fetcher: () => assert.fail('Unexpected API request') } });
  assert.equal(current.contentHash, manifest.contentHash);
  put('content/docs/en/getting-started.mdx', 'changed');
  assert.throws(() => validateSnapshot(root), /differs/);
});
test('manual pages must exist and unknown authored API files are preserved by refusing generation', (t) => {
  const { root, put, manifest } = fixture(t);
  put('content/docs/en/api/new-guide.mdx', 'new authored page');
  assert.throws(() => validateInventory(root, manifest), /Unclassified/);
  assert.equal(readFileSync(path.join(root, 'content/docs/en/api/new-guide.mdx'), 'utf8'), 'new authored page');
  rmSync(path.join(root, 'content/docs/en/api/authentication.mdx'));
  assert.throws(() => validateInventory(root, manifest), /Missing manual/);
});
test('duplicate normalized slugs and malformed records fail', async () => {
  for (const data of [[record('1', 'Same'), record('2', 'same')], [{ id: '1', values: {} }], [record(), record()]]) {
    await assert.rejects(fetchKnowledgeBase('en', { apiBase: 'https://test', apiKey: 'test', fetcher: async () => response(data, data.length) }));
  }
});
test('malformed successful responses, empty locale and stalled pagination fail promptly', async () => {
  for (const body of [{}, { data: [], meta: { total: 0, page: 1, limit: 100 } }]) {
    await assert.rejects(fetchKnowledgeBase('en', { apiBase: 'https://test', apiKey: 'test', fetcher: async () => new Response(JSON.stringify(body)) }));
  }
  let calls = 0;
  await assert.rejects(fetchKnowledgeBase('en', { apiBase: 'https://test', apiKey: 'test', fetcher: async () => {
    calls++; return response(calls === 1 ? [record()] : [], 2, calls);
  } }), /progress/);
  assert.equal(calls, 2);
});
test('authentication and invalid JSON are not retried; Retry-After respects budget', async () => {
  let calls = 0;
  await assert.rejects(fetchJson('https://test', { fetcher: async () => { calls++; return new Response('', { status: 401 }); } }), /401/);
  assert.equal(calls, 1);
  calls = 0;
  await assert.rejects(fetchJson('https://test', { fetcher: async () => { calls++; return new Response('not-json'); } }));
  assert.equal(calls, 1);
  await assert.rejects(fetchJson('https://test', { deadline: Date.now() + 1000, fetcher: async () => new Response('', { status: 503, headers: { 'retry-after': '120' } }) }), /budget/);
});
test('partial PL fetch failure leaves all source content untouched', async (t) => {
  const { root, manifest } = fixture(t);
  writeFileSync(path.join(root, 'scripts/docs/content-policy.json'), JSON.stringify({ mode: 'live' }));
  let calls = 0;
  await assert.rejects(generate(root, { env: { CI: 'true', OPERO_DOCS_API_KEY: 'test' }, fetchOptions: { fetcher: async () => {
    calls++;
    if (calls === 1) return response([record()], 1);
    if (calls === 2) return new Response(JSON.stringify({ openapi: '3.0.0', paths: { '/v1/health': { get: {} } } }));
    return new Response('', { status: 403 });
  } } }), /403/);
  assert.equal(validateSnapshot(root).contentHash, manifest.contentHash);
});
test('removals require exact reviewed exceptions; count loss and manual modifications fail', (t) => {
  const { manifest } = fixture(t);
  const candidate = structuredClone(manifest);
  const removed = candidate.urls.pop();
  assert.throws(() => validateCandidate(candidate, manifest, {}), /Unexplained/);
  validateCandidate(candidate, manifest, { removed: [{ path: removed, reason: 'Reviewed removal', status: 404 }] });
  candidate.counts.en.apiOperations = 0;
  assert.throws(() => validateCandidate(candidate, manifest, { removed: [{ path: removed, reason: 'Reviewed', status: 404 }] }), /count drop/);
  const changed = structuredClone(manifest);
  changed.files['content/docs/en/api/authentication.mdx'].sha256 = 'changed';
  assert.throws(() => validateCandidate(changed, manifest, {}), /manual file/);
});
test('failed directory swap restores original generated files and manifest', (t) => {
  const { root, manifest } = fixture(t);
  const staged = path.join(root, '.docs-staging/staged'); mkdirSync(staged, { recursive: true });
  cpSync(path.join(root, 'content'), path.join(staged, 'content'), { recursive: true });
  let calls = 0;
  assert.throws(() => replaceGenerated(root, staged, (...args) => { if (++calls === 4) throw new Error('Injected swap failure'); renameSync(...args); }), /Injected/);
  assert.equal(validateSnapshot(root).contentHash, manifest.contentHash);
});
test('search export rejects empty, missing locale, duplicate URLs and mismatched manifest', (t) => {
  const { manifest } = fixture(t);
  const records = manifest.urls.map((url) => ({ _id: url, url, title: 'Test', extra_data: { locale: url.split('/')[2] }, structured: { headings: [], contents: [] } }));
  validateSearch(records, manifest);
  for (const invalid of [[], records.filter((r) => r.extra_data.locale === 'en'), [...records, records[0]], records.slice(1)]) assert.throws(() => validateSearch(invalid, manifest));
  assert.throws(() => previewIndexNames('docs', ['docs_migration_preview_en']), /production/);
});

test('API generation writes only to its staging root and preserves every manual page', async (t) => {
  const { execFileSync } = await import('node:child_process');
  const root = mkdtempSync(path.join(tmpdir(), 'website-docs-generator-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  cpSync('content', path.join(root, 'content'), { recursive: true });
  mkdirSync(path.join(root, 'scripts/docs'), { recursive: true });
  cpSync('scripts/docs/manual-api-pages.json', path.join(root, 'scripts/docs/manual-api-pages.json'));
  mkdirSync(path.join(root, 'inputs'));
  for (const locale of ['en', 'pl']) cpSync(`content/openapi/external-api.${locale}.json`, path.join(root, `inputs/schema.${locale}.json`));
  const before = createManifest(process.cwd(), {});
  execFileSync('node_modules/.bin/tsx', ['scripts/docs/generate-external-api-docs.ts'], {
    env: { ...process.env, DOCS_OUTPUT_ROOT: root, DOCS_INPUT_DIR: path.join(root, 'inputs') }, timeout: 60_000, stdio: 'pipe',
  });
  const after = createManifest(root, {});
  assert.equal(createManifest(process.cwd(), {}).contentHash, before.contentHash);
  for (const [file, value] of Object.entries(before.files)) if (value.owner === 'manual') assert.equal(after.files[file]?.sha256, value.sha256, file);
  assert.deepEqual(after.counts, before.counts);
  const { files } = await import('../lib/content.mjs');
  for (const file of files(path.join(root, 'content/docs'))) if (file.endsWith('.mdx')) {
    const text = readFileSync(file, 'utf8');
    assert.equal(text.includes(root), false, `Nonportable staging reference in ${file}`);
    assert.equal(text.includes('/tmp/'), false, `Nonportable temporary reference in ${file}`);
  }
});

test('the response itself must contain only public active content in the requested locale', async () => {
  for (const bad of [
    { ...record(), values: { ...record().values, jawnosc: 'prywatna' } },
    { ...record(), values: { ...record().values, status: 'inactive' } },
    { ...record(), contentLocale: 'pl' },
  ]) await assert.rejects(fetchKnowledgeBase('en', { apiBase: 'https://test', apiKey: 'test', fetcher: async () => response([bad], 1) }), /private, inactive or wrong-locale/);
});
