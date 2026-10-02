import { readFile } from 'node:fs/promises';
import path from 'node:path';

import type { DocumentRecord } from 'fumadocs-core/search/algolia';

import { locales, type Locale } from '@/lib/docs/i18n';
import { source } from '@/lib/docs/source';

type StructuredData = DocumentRecord['structured'];
type SearchRecord = DocumentRecord & {
  extra_data: {
    locale: Locale;
    type: 'api' | 'guide';
  };
};
type OpenAPIDocument = {
  paths?: Record<string, Record<string, OpenAPIOperation>>;
  components?: {
    schemas?: Record<string, OpenAPISchema>;
  };
};
type OpenAPIOperation = {
  summary?: string;
  description?: string;
  operationId?: string;
  tags?: string[];
  parameters?: OpenAPIParameter[];
  requestBody?: OpenAPIRequestBody | OpenAPIReference;
  responses?: Record<string, OpenAPIResponse | OpenAPIReference>;
};
type OpenAPIParameter = {
  name?: string;
  in?: string;
  description?: string;
  required?: boolean;
  schema?: OpenAPISchema | OpenAPIReference;
};
type OpenAPIRequestBody = {
  description?: string;
  required?: boolean;
  content?: Record<string, OpenAPIMediaType>;
};
type OpenAPIResponse = {
  description?: string;
  content?: Record<string, OpenAPIMediaType>;
};
type OpenAPIMediaType = {
  schema?: OpenAPISchema | OpenAPIReference;
};
type OpenAPISchema = {
  $ref?: string;
  type?: string | string[];
  description?: string;
  properties?: Record<string, OpenAPISchema | OpenAPIReference>;
  required?: string[];
  enum?: unknown[];
  items?: OpenAPISchema | OpenAPIReference;
  allOf?: Array<OpenAPISchema | OpenAPIReference>;
  anyOf?: Array<OpenAPISchema | OpenAPIReference>;
  oneOf?: Array<OpenAPISchema | OpenAPIReference>;
  additionalProperties?: boolean | OpenAPISchema | OpenAPIReference;
  examples?: unknown[];
  example?: unknown;
  format?: string;
  nullable?: boolean;
  default?: unknown;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
};
type OpenAPIReference = {
  $ref: string;
};
type ApiOperationRef = {
  path: string;
  method: string;
};

const openapiByLocale = new Map<Locale, Promise<OpenAPIDocument>>();

export async function exportSearchIndexes(): Promise<SearchRecord[]> {
  const results: SearchRecord[] = [];

  for (const locale of locales) {
    for (const page of source.getPages(locale)) {
      if (!isPhysicalLocalePage(page, locale)) {
        continue;
      }

      const type = /^\/docs\/(?:en|pl)\/api(?:\/|$)/.test(page.url)
        ? 'api'
        : 'guide';
      const structured =
        type === 'api'
          ? await enrichApiStructuredData(page, locale)
          : page.data.structuredData;

      results.push({
        _id: page.url,
        structured,
        url: page.url,
        title: page.data.title,
        description: page.data.description,
        tag: type,
        extra_data: {
          locale,
          type,
        },
      });
    }
  }

  return results;
}

async function enrichApiStructuredData(
  page: { absolutePath?: string; data: { structuredData: StructuredData } },
  locale: Locale,
): Promise<StructuredData> {
  if (!page.absolutePath) {
    return page.data.structuredData;
  }

  const operationRef = await readPageOperationRef(page.absolutePath);

  if (!operationRef) {
    return page.data.structuredData;
  }

  const document = await readOpenAPIDocument(locale);
  const operation =
    document.paths?.[operationRef.path]?.[operationRef.method.toLowerCase()];

  if (!operation) {
    return page.data.structuredData;
  }

  const openapiData = createOpenAPIStructuredData(
    document,
    operationRef,
    operation,
  );

  return {
    headings: [...page.data.structuredData.headings, ...openapiData.headings],
    contents: [...page.data.structuredData.contents, ...openapiData.contents],
  };
}

async function readPageOperationRef(
  absolutePath: string,
): Promise<ApiOperationRef | undefined> {
  const content = await readFile(absolutePath, 'utf8');
  const match = content.match(/operations=\{(\[[^\]]+\])\}/);

  if (!match?.[1]) {
    return undefined;
  }

  const [operation] = JSON.parse(match[1]) as ApiOperationRef[];

  if (!operation?.path || !operation.method) {
    return undefined;
  }

  return operation;
}

function readOpenAPIDocument(locale: Locale): Promise<OpenAPIDocument> {
  const cached = openapiByLocale.get(locale);

  if (cached) {
    return cached;
  }

  const promise = readFile(
    path.join(process.cwd(), 'content', 'openapi', `external-api.${locale}.json`),
    'utf8',
  ).then((content) => JSON.parse(content) as OpenAPIDocument);

  openapiByLocale.set(locale, promise);

  return promise;
}

function createOpenAPIStructuredData(
  document: OpenAPIDocument,
  operationRef: ApiOperationRef,
  operation: OpenAPIOperation,
): StructuredData {
  const headings: StructuredData['headings'] = [
    { id: 'api-endpoint', content: 'API endpoint' },
    { id: 'api-parameters', content: 'API parameters' },
    { id: 'api-request-body', content: 'API request body' },
    { id: 'api-response-body', content: 'API response body' },
  ];
  const contents: StructuredData['contents'] = [];

  pushContent(
    contents,
    'api-endpoint',
    [
      operation.summary,
      operation.description,
      operation.operationId,
      operation.tags?.join(' '),
      operationRef.method.toUpperCase(),
      operationRef.path,
    ],
  );

  for (const parameter of operation.parameters ?? []) {
    pushContent(contents, 'api-parameters', [
      parameter.name,
      parameter.in,
      parameter.required ? 'required' : 'optional',
      parameter.description,
      schemaToSearchLines(document, parameter.schema),
    ]);
  }

  const requestBody = resolveReference(document, operation.requestBody);

  if (isRecord(requestBody)) {
    pushContent(contents, 'api-request-body', [
      'request body',
      requestBody.required ? 'required' : undefined,
      typeof requestBody.description === 'string'
        ? requestBody.description
        : undefined,
    ]);

    for (const [mediaType, media] of Object.entries(requestBody.content ?? {})) {
      pushContent(contents, 'api-request-body', [
        mediaType,
        schemaToSearchLines(document, media.schema),
      ]);
    }
  }

  for (const [statusCode, responseOrRef] of Object.entries(
    operation.responses ?? {},
  )) {
    const response = resolveReference(document, responseOrRef);

    if (!isRecord(response)) {
      continue;
    }

    pushContent(contents, 'api-response-body', [
      `response ${statusCode}`,
      typeof response.description === 'string' ? response.description : undefined,
    ]);

    if (!isSuccessStatusCode(statusCode)) {
      continue;
    }

    const content = response.content;

    if (!isRecord(content)) {
      continue;
    }

    for (const [mediaType, media] of Object.entries(content)) {
      if (!isRecord(media)) {
        continue;
      }

      pushContent(contents, 'api-response-body', [
        statusCode,
        mediaType,
        schemaToSearchLines(document, media.schema),
      ]);
    }
  }

  return {
    headings,
    contents,
  };
}

function schemaToSearchLines(
  document: OpenAPIDocument,
  schema: unknown,
  options: {
    name?: string;
    required?: boolean;
    visitedRefs?: Set<string>;
    depth?: number;
  } = {},
): string[] {
  const { name, required = false, visitedRefs = new Set(), depth = 0 } = options;

  if (!isRecord(schema) || depth > 7) {
    return [];
  }

  if (typeof schema.$ref === 'string') {
    if (visitedRefs.has(schema.$ref)) {
      return [refName(schema.$ref)];
    }

    const resolved = resolveReference(document, schema);

    if (!resolved) {
      return [refName(schema.$ref)];
    }

    return [
      refName(schema.$ref),
      ...schemaToSearchLines(document, resolved, {
        name,
        required,
        visitedRefs: new Set([...visitedRefs, schema.$ref]),
        depth: depth + 1,
      }),
    ];
  }

  const apiSchema = schema as OpenAPISchema;
  const lines: string[] = [];
  const type = stringifyValue(apiSchema.type);
  const description =
    typeof apiSchema.description === 'string' ? apiSchema.description : undefined;

  if (name || type || description) {
    lines.push(
      compact([
        name,
        type,
        apiSchema.format,
        apiSchema.nullable ? 'nullable' : undefined,
        required ? 'required' : undefined,
        description,
      ]).join(' - '),
    );
  }

  if (Array.isArray(apiSchema.enum)) {
    lines.push(`enum values ${apiSchema.enum.map(stringifyValue).join(' ')}`);
  }

  if (apiSchema.default !== undefined) {
    lines.push(`default ${stringifyValue(apiSchema.default)}`);
  }

  if (apiSchema.example !== undefined) {
    lines.push(`example ${stringifyValue(apiSchema.example)}`);
  }

  if (Array.isArray(apiSchema.examples)) {
    lines.push(`examples ${apiSchema.examples.map(stringifyValue).join(' ')}`);
  }

  lines.push(
    ...compact([
      apiSchema.minimum !== undefined ? `minimum ${apiSchema.minimum}` : undefined,
      apiSchema.maximum !== undefined ? `maximum ${apiSchema.maximum}` : undefined,
      apiSchema.minLength !== undefined ? `minLength ${apiSchema.minLength}` : undefined,
      apiSchema.maxLength !== undefined ? `maxLength ${apiSchema.maxLength}` : undefined,
      apiSchema.pattern ? `pattern ${apiSchema.pattern}` : undefined,
    ]),
  );

  for (const item of [
    ...(apiSchema.allOf ?? []),
    ...(apiSchema.anyOf ?? []),
    ...(apiSchema.oneOf ?? []),
  ]) {
    lines.push(
      ...schemaToSearchLines(document, item, {
        visitedRefs,
        depth: depth + 1,
      }),
    );
  }

  if (apiSchema.items) {
    lines.push(
      ...schemaToSearchLines(document, apiSchema.items, {
        name: name ? `${name}[]` : 'items',
        visitedRefs,
        depth: depth + 1,
      }),
    );
  }

  if (isRecord(apiSchema.additionalProperties)) {
    lines.push(
      ...schemaToSearchLines(document, apiSchema.additionalProperties, {
        name: name ? `${name} additionalProperties` : 'additionalProperties',
        visitedRefs,
        depth: depth + 1,
      }),
    );
  }

  const requiredProperties = new Set(apiSchema.required ?? []);

  for (const [propertyName, propertySchema] of Object.entries(
    apiSchema.properties ?? {},
  )) {
    lines.push(
      ...schemaToSearchLines(document, propertySchema, {
        name: propertyName,
        required: requiredProperties.has(propertyName),
        visitedRefs,
        depth: depth + 1,
      }),
    );
  }

  return [...new Set(lines.filter(Boolean))];
}

function isSuccessStatusCode(statusCode: string): boolean {
  const numericStatusCode = Number(statusCode);

  return numericStatusCode >= 200 && numericStatusCode < 300;
}

function resolveReference(
  document: OpenAPIDocument,
  value: unknown,
): unknown | undefined {
  if (!isRecord(value) || typeof value.$ref !== 'string') {
    return value;
  }

  const schemaName = value.$ref.match(/^#\/components\/schemas\/(.+)$/)?.[1];

  if (!schemaName) {
    return undefined;
  }

  return document.components?.schemas?.[schemaName];
}

function pushContent(
  contents: StructuredData['contents'],
  heading: string,
  values: unknown[],
) {
  const text = flattenStrings(values).join('\n').trim();

  if (!text) {
    return;
  }

  for (const chunk of chunkText(text)) {
    contents.push({
      heading,
      content: chunk,
    });
  }
}

function flattenStrings(values: unknown[]): string[] {
  return values.flatMap((value) => {
    if (Array.isArray(value)) {
      return flattenStrings(value);
    }

    if (typeof value === 'string') {
      return value.trim() ? [value.trim()] : [];
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return [String(value)];
    }

    return [];
  });
}

function chunkText(text: string): string[] {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const chunks: string[] = [];
  let chunk = '';

  for (const line of lines) {
    if (chunk && `${chunk}\n${line}`.length > 3500) {
      chunks.push(chunk);
      chunk = line;
      continue;
    }

    chunk = chunk ? `${chunk}\n${line}` : line;
  }

  if (chunk) {
    chunks.push(chunk);
  }

  return chunks;
}

function compact<T>(values: Array<T | undefined | null | false>): T[] {
  return values.filter(Boolean) as T[];
}

function stringifyValue(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value.map(stringifyValue).filter(Boolean).join(' ');
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

function refName(ref: string): string {
  return ref.split('/').at(-1) ?? ref;
}

function isPhysicalLocalePage(
  page: { absolutePath?: string },
  locale: Locale,
): boolean {
  return (
    page.absolutePath
      ?.replaceAll('\\', '/')
      .includes(`content/docs/${locale}/`) ?? false
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
