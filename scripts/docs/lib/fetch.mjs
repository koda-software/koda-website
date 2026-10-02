import { slugify, validateSchema } from './content.mjs';

export async function fetchJson(url, { headers, fetcher = fetch, deadline = Date.now() + 300_000, sleeper = (ms) => new Promise((r) => setTimeout(r, ms)) } = {}) {
  for (let attempt = 0; attempt < 3; attempt++) {
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new Error('Docs fetch budget exhausted');
    let response;
    try {
      response = await fetcher(url, { headers, signal: AbortSignal.timeout(Math.min(30_000, remaining)) });
    } catch {
      if (attempt === 2) throw new Error('Docs fetch failed after three network attempts');
      continue;
    }
    if (response.ok) {
      // JSON/schema errors are final, not transient network failures.
      return response.json();
    }
    if ((response.status !== 429 && response.status < 500) || attempt === 2) throw new Error(`Docs API HTTP ${response.status}`);
    const retry = response.headers.get('retry-after');
    const delay = retry ? (/^\d+$/.test(retry) ? Number(retry) * 1000 : Math.max(0, Date.parse(retry) - Date.now())) : (attempt + 1) * 1000;
    if (!Number.isFinite(delay) || delay >= deadline - Date.now()) throw new Error('Retry-After exceeds docs fetch budget');
    await sleeper(delay);
  }
  throw new Error('Docs fetch failed');
}
export function validateRecords(records, ids, paths) {
  for (const record of records) {
    const values = record?.values;
    if (typeof record?.id !== 'string' || ids.has(record.id)) throw new Error('Missing or duplicate docs record ID');
    ids.add(record.id);
    if (!values || ['tytul', 'slug', 'sekcja'].some((key) => typeof values[key] !== 'string' || !values[key].trim()))
      throw new Error('Docs record lacks title, slug or section');
    const section = slugify(values.sekcja), slug = slugify(values.slug);
    const output = `${section}/${slug}`;
    if (!section || !slug || slug === 'index' || paths.has(output)) throw new Error('Duplicate or invalid normalized docs path');
    paths.add(output);
  }
}
export async function fetchKnowledgeBase(locale, { apiBase, apiKey, ...options }) {
  const records = [], ids = new Set(), paths = new Set();
  let total;
  for (let page = 1; page <= 100; page++) {
    const url = new URL(`${apiBase.replace(/\/+$/, '')}/v1/custom-modules/baza-wiedzy/objects/dokumentacja/records`);
    url.searchParams.set('page', String(page)); url.searchParams.set('limit', '100'); url.searchParams.set('count', 'exact');
    url.searchParams.set('contentLocale', locale);
    url.searchParams.set('filters', JSON.stringify({ op: 'AND', items: [
      { field: 'jawnosc', operator: 'eq', value: 'publiczna' }, { field: 'status', operator: 'eq', value: 'active' },
    ] }));
    url.searchParams.set('sort', JSON.stringify([{ field: 'sekcja', direction: 'asc' }, { field: 'kolejnosc', direction: 'asc' }, { field: 'tytul', direction: 'asc' }]));
    const body = await fetchJson(url, { ...options, headers: { accept: 'application/json', authorization: `Bearer ${apiKey}` } });
    if (!body || !Array.isArray(body.data) || !Number.isInteger(body.meta?.total) || body.meta.total < 1 ||
        body.meta.page !== page || body.meta.limit !== 100 || (total !== undefined && total !== body.meta.total))
      throw new Error('Malformed or inconsistent docs pagination');
    total = body.meta.total;
    if (!body.data.length || body.data.length > 100 || records.length + body.data.length > total) throw new Error('Docs pagination makes no progress or exceeds total');
    validateRecords(body.data, ids, paths); records.push(...body.data);
    if (records.length === total) return { data: records };
  }
  throw new Error('Docs pagination exceeded 100 pages');
}
export async function fetchSources(env, options = {}) {
  if (!env.OPERO_DOCS_API_KEY?.trim()) throw new Error('Missing OPERO_DOCS_API_KEY.');
  const deadline = Date.now() + 300_000;
  const apiBase = env.OPERO_API_BASE ?? 'https://opero.kodasoft.pl/api';
  const result = {};
  for (const locale of ['en', 'pl']) {
    const records = await fetchKnowledgeBase(locale, { ...options, apiBase, apiKey: env.OPERO_DOCS_API_KEY, deadline });
    const schema = await fetchJson(env[`EXTERNAL_API_OPENAPI_URL_${locale.toUpperCase()}`] ?? `${apiBase}/swagger/v1/${locale}/json`, { ...options, deadline });
    validateSchema(schema); result[locale] = { records, schema };
  }
  return result;
}
