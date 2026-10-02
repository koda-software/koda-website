import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sectionSearchResults } from '../../../lib/docs/search-results.mjs';

test('search retains unique real heading anchors and stays in the selected locale', () => {
  const hit = { objectID: '1', title: 'Guide', url: '/docs/pl/guide', section: 'Załączniki', section_id: 'załączniki' };
  const results = sectionSearchResults([hit, { ...hit, objectID: '2' }, { ...hit, url: '/docs/en/guide' }, { ...hit, url: '/en/marketing' }], 'pl');
  assert.deepEqual(results.map(({ type, url }) => [type, url]), [['page', '/docs/pl/guide'], ['heading', '/docs/pl/guide#załączniki']]);
});
test('synthetic API labels cannot produce nonexistent anchors', () => {
  const base = { objectID: '1', title: 'API', url: '/docs/en/api/health/check', section: 'Section' };
  const results = sectionSearchResults(['api-endpoint', 'api-parameters', 'api-request-body', 'api-response-body'].map((id) => ({ ...base, section_id: id })), 'en');
  assert.deepEqual(results.map((r) => r.url), [base.url, base.url + '#request-body', base.url + '#response-body']);
});

test('Algolia verification requests page_id explicitly and counts pages instead of section objects', async () => {
  const { verifyAlgoliaIndex } = await import('../lib/search.mjs');
  const client = { async browseObjects({ browseParams, aggregator }) {
    assert.deepEqual(browseParams.attributesToRetrieve, ['page_id']);
    aggregator({ hits: [{ page_id: 'a' }, { page_id: 'a' }, { page_id: 'b' }] });
  } };
  assert.equal(await verifyAlgoliaIndex(client, 'preview', [{ _id: 'a' }, { _id: 'b' }]), 3);
  await assert.rejects(verifyAlgoliaIndex(client, 'preview', [{ _id: 'a' }, { _id: 'missing' }]), /Incomplete/);
  await assert.rejects(verifyAlgoliaIndex({ async browseObjects({ aggregator }) { aggregator({ hits: [{}] }); } }, 'preview', [{ _id: 'a' }]), /lacks page_id/);
});
