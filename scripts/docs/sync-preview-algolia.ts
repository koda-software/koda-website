import { algoliasearch } from 'algoliasearch';
import { sync, type DocumentRecord } from 'fumadocs-core/search/algolia';
import { locales, readJson } from './lib/content.mjs';
import { previewIndexNames, validateSearch } from './lib/search.mjs';

async function main() {
  const env = process.env;
  if (!env.DOCS_PREVIEW_DEPLOYMENT || !env.DOCS_PREVIEW_ALGOLIA_WRITE_KEY || !env.NEXT_PUBLIC_ALGOLIA_APP_ID || !env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME)
    throw new Error('Set preview deployment, restricted preview write key, app ID and base index name.');
  const deployment = new URL(env.DOCS_PREVIEW_DEPLOYMENT);
  if (deployment.protocol !== 'https:' || !deployment.hostname.endsWith('.vercel.app') || deployment.pathname !== '/')
    throw new Error('Preview sync requires a Vercel preview deployment origin.');
  const headers: Record<string, string> = env.DOCS_PREVIEW_BYPASS ? { 'x-vercel-protection-bypass': env.DOCS_PREVIEW_BYPASS } : {};
  async function download(path: string) {
    const response = await fetch(new URL(path, deployment), { headers, redirect: 'error', signal: AbortSignal.timeout(30_000) });
    if (!response.ok) throw new Error(`Preview artifact HTTP ${response.status}`);
    return response.json();
  }
  const publicManifest = await download('/docs/build.json');
  const accepted = readJson('content/docs-build-manifest.json');
  if (publicManifest.contentHash !== accepted.contentHash) throw new Error('Preview does not contain the accepted snapshot');
  const records = await download('/docs/static.json') as Array<DocumentRecord & { extra_data: { locale: string } }>;
  validateSearch(records, accepted);
  const base = env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;
  const production = [env.DOCS_PRODUCTION_INDEX_NAME_EN ?? `${base}_en`, env.DOCS_PRODUCTION_INDEX_NAME_PL ?? `${base}_pl`];
  const names = previewIndexNames(base, production);
  const client = algoliasearch(env.NEXT_PUBLIC_ALGOLIA_APP_ID, env.DOCS_PREVIEW_ALGOLIA_WRITE_KEY);
  const permissions = await client.getApiKey({ key: env.DOCS_PREVIEW_ALGOLIA_WRITE_KEY });
  const allowed = Object.values(names).flatMap((name) => [name, `${name}_tmp_*`]);
  if (!permissions.indexes?.length || permissions.indexes.some((name) => !allowed.includes(name)))
    throw new Error('Preview writer must be restricted to the exact preview indices and their temporary names');
  for (const locale of locales) {
    await sync(client, { indexName: names[locale], documents: records.filter((r) => r.extra_data.locale === locale) });
  }
  console.log(`[docs] Preview indices seeded from ${deployment.origin}, content hash ${accepted.contentHash}.`);
}
main().catch((error: unknown) => { console.error(error); process.exitCode = 1; });
