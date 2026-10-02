import { loadEnvConfig } from '@next/env';
import { algoliasearch } from 'algoliasearch';
import { sync, type DocumentRecord } from 'fumadocs-core/search/algolia';
import { readJson, validateSnapshot, locales } from './lib/content.mjs';
import { productionIndexNames, validateSearch } from './lib/search.mjs';

loadEnvConfig(process.cwd());
async function main() {
  const env = process.env;
  const appId = env.ALGOLIA_APP_ID ?? env.NEXT_PUBLIC_ALGOLIA_APP_ID;
  if (!appId || !env.ALGOLIA_ADMIN_API_KEY) throw new Error('Missing Algolia app ID or admin key.');
  const records = readJson('.next/server/app/docs/static.json.body') as Array<DocumentRecord & { extra_data: { locale: string } }>;
  validateSearch(records, validateSnapshot(process.cwd()));
  const names = productionIndexNames(env); // Validate both targets before either write.
  const client = algoliasearch(appId, env.ALGOLIA_ADMIN_API_KEY);
  for (const locale of locales) {
    const documents = records.filter((record) => record.extra_data.locale === locale);
    await sync(client, { indexName: names[locale], documents });
    const pageIds = new Set<string>();
    let objects = 0;
    await client.browseObjects<{ page_id: string }>({ indexName: names[locale], aggregator: (response) => {
      for (const hit of response.hits) { objects++; pageIds.add(String(hit.page_id)); }
    } });
    if (pageIds.size !== documents.length || documents.some((doc) => !pageIds.has(doc._id))) throw new Error(`Incomplete ${locale} Algolia index`);
    console.log(`Synced ${documents.length} ${locale.toUpperCase()} page documents (${objects} Algolia objects) to index "${names[locale]}".`);
  }
}
main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
