import { locales } from './content.mjs';
export function validateSearch(records, manifest) {
  if (!Array.isArray(records) || !records.length) throw new Error('Empty or invalid search export');
  const ids = new Set();
  for (const record of records) {
    if (typeof record?._id !== 'string' || record._id !== record.url || ids.has(record._id) ||
        !locales.includes(record.extra_data?.locale) || !record.url.startsWith(`/docs/${record.extra_data.locale}/`) && record.url !== `/docs/${record.extra_data.locale}` ||
        !record.title || !Array.isArray(record.structured?.headings) || !Array.isArray(record.structured?.contents))
      throw new Error('Malformed or duplicate search document');
    ids.add(record._id);
  }
  if (ids.size !== manifest.urls.length || manifest.urls.some((url) => !ids.has(url))) throw new Error('Search export URL set differs from docs manifest');
  for (const locale of locales) if (records.filter((r) => r.extra_data.locale === locale).length !== manifest.counts[locale].pages)
    throw new Error(`Incomplete ${locale} search export`);
}
export function productionIndexNames(env) {
  const base = env.ALGOLIA_INDEX_NAME || env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;
  const names = Object.fromEntries(locales.map((locale) => [locale,
    env[`ALGOLIA_INDEX_NAME_${locale.toUpperCase()}`] || env[`NEXT_PUBLIC_ALGOLIA_INDEX_NAME_${locale.toUpperCase()}`] || (base ? `${base}_${locale}` : undefined)]));
  if (!names.en || !names.pl || names.en === names.pl) throw new Error('Both distinct locale index names are required');
  for (const locale of locales) {
    const browser = env[`NEXT_PUBLIC_ALGOLIA_INDEX_NAME_${locale.toUpperCase()}`] || (env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ? `${env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}_${locale}` : undefined);
    if (browser && browser !== names[locale]) throw new Error('Browser and writer index names differ');
  }
  return names;
}
export function previewIndexNames(base, productionNames = []) {
  if (!base || !/^[A-Za-z0-9_-]+$/.test(base)) throw new Error('Invalid preview index base');
  const names = Object.fromEntries(locales.map((locale) => [locale, `${base}_migration_preview_${locale}`]));
  if (Object.values(names).some((name) => productionNames.includes(name))) throw new Error('Refusing production preview target');
  return names;
}

export async function verifyAlgoliaIndex(client, indexName, documents) {
  const pageIds = new Set();
  let objects = 0;
  await client.browseObjects({
    indexName, browseParams: { attributesToRetrieve: ['page_id'] },
    aggregator(response) {
      for (const hit of response.hits) {
        if (typeof hit.page_id !== 'string') throw new Error('Algolia object lacks page_id');
        objects++; pageIds.add(hit.page_id);
      }
    },
  });
  if (pageIds.size !== documents.length || documents.some((doc) => !pageIds.has(doc._id)))
    throw new Error(`Incomplete Algolia index: ${indexName}`);
  return objects;
}
