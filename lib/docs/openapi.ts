import { createOpenAPI } from 'fumadocs-openapi/server';

export const openapi = createOpenAPI({
  input: [
    './content/openapi/external-api.en.json',
    './content/openapi/external-api.pl.json',
  ],
});

type Preloaded = Awaited<ReturnType<typeof openapi.preloadOpenAPIPage>>;
type Document = Preloaded['preloaded']['docs'][string];
type OperationRef = { path: string; method: string };

/**
 * `preloadOpenAPIPage` hands the client component the whole bundled spec, and
 * every one of the ~230 API pages then carries it twice (HTML and RSC payload).
 * That was most of each deployment's size. This keeps only the operations the
 * page renders plus the components they reference, directly or transitively.
 */
export async function preloadOperations(
  page: Parameters<typeof openapi.preloadOpenAPIPage>[0],
  operations: OperationRef[] | undefined,
): Promise<Preloaded> {
  const { preloaded } = await openapi.preloadOpenAPIPage(page);
  if (!operations?.length) return { preloaded };

  const docs = Object.fromEntries(
    Object.entries(preloaded.docs).map(([id, doc]) => [id, pickOperations(doc, operations)]),
  );

  return { preloaded: { ...preloaded, docs } };
}

function pickOperations(doc: Document, operations: OperationRef[]): Document {
  const source = doc as Record<string, unknown> & {
    paths?: Record<string, Record<string, unknown>>;
    components?: Record<string, Record<string, unknown>>;
  };
  const paths: Record<string, Record<string, unknown>> = {};

  for (const { path, method } of operations) {
    const item = source.paths?.[path];
    const operation = item?.[method.toLowerCase()];
    if (!item || !operation) return doc;

    // Path-level fields (parameters, servers, summary) apply to every method.
    const shared = Object.fromEntries(Object.entries(item).filter(([key]) => !HTTP_METHODS.has(key)));
    paths[path] = { ...shared, ...paths[path], [method.toLowerCase()]: operation };
  }

  const components: Record<string, Record<string, unknown>> = {};
  // Security schemes are applied by name, not by $ref, so they always stay.
  if (source.components?.securitySchemes) components.securitySchemes = source.components.securitySchemes;

  const pending = [paths];
  const seen = new Set<string>();

  while (pending.length) {
    for (const ref of collectRefs(pending.pop())) {
      const [, root, type, name] = ref.split('/');
      // Anything other than a #/components/<type>/<name> pointer: keep the full spec.
      if (root !== 'components' || !type || !name) return doc;

      const key = `${type}/${name}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const value = source.components?.[type]?.[name];
      if (value === undefined) return doc;
      (components[type] ??= {})[name] = value;
      pending.push(value as never);
    }
  }

  return { ...source, paths, components } as Document;
}

const HTTP_METHODS = new Set(['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']);

function collectRefs(value: unknown, refs: string[] = []): string[] {
  if (Array.isArray(value)) {
    for (const item of value) collectRefs(item, refs);
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      if (key === '$ref' && typeof item === 'string' && item.startsWith('#/')) refs.push(decodeURIComponent(item));
      else collectRefs(item, refs);
    }
  }

  return refs;
}
