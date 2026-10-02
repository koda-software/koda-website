import { readFileSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { generateFiles } from 'fumadocs-openapi';
import { createOpenAPI } from 'fumadocs-openapi/server';
import type {
  OperationOutput,
  PageOutput,
  PagesBuilder,
  WebhookOutput,
} from 'fumadocs-openapi';

type Locale = (typeof supportedLocales)[number];
type OpenAPIDocument = {
  openapi?: string;
  swagger?: string;
  info?: {
    title?: string;
    description?: string;
    version?: string;
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  paths?: Record<string, Record<string, unknown>>;
  components?: {
    securitySchemes?: Record<string, unknown>;
    schemas?: Record<string, unknown>;
  };
  tags?: Array<{
    name: string;
    description?: string;
  }>;
};
type ApiPageNameEntry =
  | Omit<OperationOutput, 'path'>
  | Omit<PageOutput, 'path'>
  | Omit<WebhookOutput, 'path'>;
type ApiOperationEntry = Omit<OperationOutput, 'path'>;
type ApiWebhookEntry = Omit<WebhookOutput, 'path'>;
type ApiGroup = {
  key: string;
  title: Record<Locale, string>;
  matches: (operationPath: string) => boolean;
};

const rootDir = process.env.DOCS_OUTPUT_ROOT;
const inputDir = process.env.DOCS_INPUT_DIR;
if (!rootDir || !inputDir) throw new Error('Use docs:generate; explicit staged input/output paths are required.');
const manualManifest = JSON.parse(readFileSync(path.join(process.cwd(), 'scripts/docs/manual-api-pages.json'), 'utf8')) as Record<Locale, string[]>;

const supportedLocales = ['en', 'pl'] as const;
const manualApiPageSlugs = manualManifest.en.filter((file) => !file.includes('/')).map((file) => file.replace(/\.mdx$/, ''));
const manualApiGroupPageSlugs: Record<string, string[]> = {};
for (const file of manualManifest.en.filter((file) => file.includes('/'))) {
  const [group, ...parts] = file.split('/');
  (manualApiGroupPageSlugs[group] ??= []).push(parts.join('/').replace(/\.mdx$/, ''));
}
if (JSON.stringify(manualManifest.en) !== JSON.stringify(manualManifest.pl)) throw new Error('Manual API paths must match across supported locales.');
const apiGroups: ApiGroup[] = [
  {
    key: 'Health',
    title: {
      en: 'Health',
      pl: 'Status usługi',
    },
    matches: (operationPath) => isPathIn(operationPath, '/v1/health'),
  },
  {
    key: 'Reference Data',
    title: {
      en: 'Reference Data',
      pl: 'Dane referencyjne',
    },
    matches: (operationPath) => isPathIn(operationPath, '/v1/currencies'),
  },
  {
    key: 'Dictionaries',
    title: {
      en: 'Dictionaries',
      pl: 'Słowniki',
    },
    matches: (operationPath) => isPathIn(operationPath, '/v1/dictionaries'),
  },
  {
    key: 'Custom Modules',
    title: {
      en: 'Custom Modules',
      pl: 'Moduły własne',
    },
    matches: (operationPath) =>
      isPathIn(operationPath, '/v1/custom-modules') &&
      !operationPath.includes('/objects') &&
      !isCustomSchemaPath(operationPath),
  },
  {
    key: 'Custom Objects',
    title: {
      en: 'Custom Objects',
      pl: 'Obiekty własne',
    },
    matches: (operationPath) =>
      (isPathIn(operationPath, '/v1/custom-modules/{moduleKey}/objects') &&
        !isCustomObjectFormPath(operationPath)) ||
      isCustomSchemaPath(operationPath),
  },
  {
    key: 'Custom Object Forms',
    title: {
      en: 'Custom Object Forms',
      pl: 'Formularze obiektów własnych',
    },
    matches: isCustomObjectFormPath,
  },
  {
    key: 'Queries',
    title: {
      en: 'Queries',
      pl: 'Zapytania',
    },
    matches: (operationPath) => isPathIn(operationPath, '/v1/saved-queries'),
  },
  {
    key: 'Custom Scripts',
    title: {
      en: 'Custom Scripts',
      pl: 'Skrypty własne',
    },
    matches: (operationPath) => isPathIn(operationPath, '/v1/custom-scripts'),
  },
  {
    key: 'Rules',
    title: {
      en: 'Rules',
      pl: 'Reguły',
    },
    matches: (operationPath) => isPathIn(operationPath, '/v1/rules'),
  },
  {
    key: 'Workflows',
    title: {
      en: 'Workflows',
      pl: 'Procesy',
    },
    matches: (operationPath) =>
      isPathIn(operationPath, '/v1/workflows') ||
      isPathIn(operationPath, '/v1/workflow-templates'),
  },
  {
    key: 'View Layout Runtime',
    title: {
      en: 'View Layout Runtime',
      pl: 'Runtime układów',
    },
    matches: isViewLayoutRuntimePath,
  },
  {
    key: 'View Layout Configuration',
    title: {
      en: 'View Layout Configuration',
      pl: 'Konfiguracja układów',
    },
    matches: (operationPath) =>
      isPathIn(operationPath, '/v1/view-layouts') &&
      !isViewLayoutRuntimePath(operationPath),
  },
  {
    key: 'Contractors',
    title: {
      en: 'Contractors',
      pl: 'Kontrahenci',
    },
    matches: (operationPath) => isPathIn(operationPath, '/v1/contractors'),
  },
  {
    key: 'Service Catalog',
    title: {
      en: 'Service Catalog',
      pl: 'Katalog usług',
    },
    matches: (operationPath) => isPathIn(operationPath, '/v1/service-catalog'),
  },
  {
    key: 'Files',
    title: {
      en: 'Files',
      pl: 'Pliki',
    },
    matches: (operationPath) => isPathIn(operationPath, '/v1/files'),
  },
  {
    key: 'Entity Attachments',
    title: {
      en: 'Entity Attachments',
      pl: 'Załączniki obiektów',
    },
    matches: (operationPath) => isPathIn(operationPath, '/v1/entity-attachments'),
  },
  {
    key: 'Entity Comments',
    title: {
      en: 'Entity Comments',
      pl: 'Komentarze obiektów',
    },
    matches: (operationPath) => isPathIn(operationPath, '/v1/entity-comments'),
  },
];
const apiOperationSlugs = new Map<string, string>([
  ['GET /v1/health', 'liveness-and-database-health-check'],
  ['GET /v1/currencies', 'list-supported-currencies'],
  ['GET /v1/dictionaries', 'list-dictionaries'],
  ['GET /v1/dictionaries/{dictionaryId}/entries', 'list-dictionary-entries'],
  ['GET /v1/dictionaries/{id}', 'get-dictionary-with-entries'],
  ['GET /v1/custom-modules', 'list-custom-modules'],
  ['POST /v1/custom-modules', 'create-custom-module'],
  ['GET /v1/custom-modules/{moduleKey}', 'get-custom-module'],
  ['PATCH /v1/custom-modules/{moduleKey}', 'update-custom-module'],
  ['GET /v1/custom-modules/{moduleKey}/delete-impact', 'preview-custom-module-delete-impact'],
  ['DELETE /v1/custom-modules/{moduleKey}', 'delete-custom-module'],
  ['GET /v1/custom-modules/{moduleKey}/objects', 'list-custom-objects'],
  [
    'GET /v1/custom-modules/{moduleKey}/objects/{objectKey}',
    'get-custom-object',
  ],
  [
    'GET /v1/custom-modules/{moduleKey}/objects/{objectKey}/schema',
    'get-custom-object-schema',
  ],
  [
    'GET /v1/custom-modules/{moduleKey}/objects/{objectKey}/schema/drafts',
    'list-custom-object-schema-drafts',
  ],
  [
    'POST /v1/custom-modules/{moduleKey}/objects/{objectKey}/schema/drafts',
    'create-custom-object-schema-draft',
  ],
  [
    'GET /v1/custom-modules/{moduleKey}/objects/{objectKey}/schema/drafts/{draftId}',
    'get-custom-object-schema-draft',
  ],
  [
    'PATCH /v1/custom-modules/{moduleKey}/objects/{objectKey}/schema/drafts/{draftId}',
    'update-custom-object-schema-draft',
  ],
  [
    'DELETE /v1/custom-modules/{moduleKey}/objects/{objectKey}/schema/drafts/{draftId}',
    'delete-custom-object-schema-draft',
  ],
  [
    'POST /v1/custom-modules/{moduleKey}/objects/{objectKey}/schema/drafts/{draftId}/validate',
    'validate-custom-object-schema-draft',
  ],
  [
    'POST /v1/custom-modules/{moduleKey}/objects/{objectKey}/schema/drafts/{draftId}/apply',
    'apply-custom-object-schema-draft',
  ],
  [
    'GET /v1/custom-modules/{moduleKey}/schema',
    'get-custom-module-schema',
  ],
  [
    'GET /v1/custom-modules/{moduleKey}/schema/drafts',
    'list-custom-schema-drafts',
  ],
  [
    'POST /v1/custom-modules/{moduleKey}/schema/drafts',
    'create-custom-schema-draft',
  ],
  [
    'GET /v1/custom-modules/{moduleKey}/schema/drafts/{draftId}',
    'get-custom-schema-draft',
  ],
  [
    'PATCH /v1/custom-modules/{moduleKey}/schema/drafts/{draftId}',
    'update-custom-schema-draft',
  ],
  [
    'DELETE /v1/custom-modules/{moduleKey}/schema/drafts/{draftId}',
    'delete-custom-schema-draft',
  ],
  [
    'POST /v1/custom-modules/{moduleKey}/schema/drafts/{draftId}/validate',
    'validate-custom-schema-draft',
  ],
  [
    'POST /v1/custom-modules/{moduleKey}/schema/drafts/{draftId}/apply',
    'apply-custom-schema-draft',
  ],
  [
    'GET /v1/custom-modules/{moduleKey}/objects/{objectKey}/records',
    'list-custom-records',
  ],
  [
    'POST /v1/custom-modules/{moduleKey}/objects/{objectKey}/records',
    'create-custom-record',
  ],
  [
    'GET /v1/custom-modules/{moduleKey}/objects/{objectKey}/records/{recordId}',
    'get-custom-record',
  ],
  [
    'PATCH /v1/custom-modules/{moduleKey}/objects/{objectKey}/records/{recordId}',
    'update-custom-record',
  ],
  [
    'DELETE /v1/custom-modules/{moduleKey}/objects/{objectKey}/records/{recordId}',
    'delete-custom-record',
  ],
  [
    'GET /v1/custom-modules/{moduleKey}/objects/{objectKey}/record',
    'get-singleton-custom-record',
  ],
  [
    'PATCH /v1/custom-modules/{moduleKey}/objects/{objectKey}/record',
    'update-singleton-custom-record',
  ],
  [
    'GET /v1/custom-modules/{moduleKey}/objects/{objectKey}/forms',
    'list-custom-object-forms',
  ],
  [
    'POST /v1/custom-modules/{moduleKey}/objects/{objectKey}/forms',
    'create-custom-object-form',
  ],
  [
    'GET /v1/custom-modules/{moduleKey}/objects/{objectKey}/forms/available',
    'list-available-custom-object-forms',
  ],
  [
    'PATCH /v1/custom-modules/{moduleKey}/objects/{objectKey}/forms/defaults',
    'update-custom-object-default-forms',
  ],
  [
    'GET /v1/custom-modules/{moduleKey}/objects/{objectKey}/forms/{formId}',
    'get-custom-object-form',
  ],
  [
    'PATCH /v1/custom-modules/{moduleKey}/objects/{objectKey}/forms/{formId}',
    'update-custom-object-form',
  ],
  [
    'DELETE /v1/custom-modules/{moduleKey}/objects/{objectKey}/forms/{formId}',
    'delete-custom-object-form',
  ],
  [
    'GET /v1/custom-modules/{moduleKey}/objects/{objectKey}/forms/{formId}/access',
    'get-custom-object-form-access-matrix',
  ],
  [
    'PUT /v1/custom-modules/{moduleKey}/objects/{objectKey}/forms/{formId}/access',
    'replace-custom-object-form-access-matrix',
  ],
  ['GET /v1/custom-scripts', 'list-custom-scripts'],
  ['POST /v1/custom-scripts', 'create-custom-script'],
  ['GET /v1/custom-scripts/{id}', 'get-custom-script'],
  ['PATCH /v1/custom-scripts/{id}', 'update-custom-script'],
  ['PATCH /v1/custom-scripts/{id}/archive', 'archive-custom-script'],
  ['PATCH /v1/custom-scripts/{id}/restore', 'restore-custom-script'],
  ['DELETE /v1/custom-scripts/{id}', 'delete-custom-script'],
  ['GET /v1/saved-queries', 'list-queries'],
  ['POST /v1/saved-queries', 'create-query'],
  ['GET /v1/saved-queries/schema', 'get-query-schema'],
  ['POST /v1/saved-queries/validate', 'validate-query'],
  ['GET /v1/saved-queries/{id}', 'get-query'],
  ['PATCH /v1/saved-queries/{id}', 'update-query'],
  ['DELETE /v1/saved-queries/{id}', 'delete-query'],
  ['POST /v1/saved-queries/{id}/execute', 'execute-query'],
  ['GET /v1/rules/config', 'get-rule-builder-config'],
  ['GET /v1/rules/step-types', 'search-rule-step-types'],
  ['GET /v1/rules/entity-fields', 'list-rule-entity-fields'],
  ['POST /v1/rules/context-schemas', 'compute-rule-context-schemas'],
  ['POST /v1/rules/validate-script', 'validate-rule-script'],
  ['GET /v1/rules/filters', 'list-rule-template-filters'],
  ['POST /v1/rules/filters', 'create-rule-template-filter'],
  ['POST /v1/rules/filters/validate', 'validate-rule-template-filter'],
  ['PATCH /v1/rules/filters/{key}', 'update-rule-template-filter'],
  ['DELETE /v1/rules/filters/{key}', 'delete-rule-template-filter'],
  ['POST /v1/rules/filters/{key}/test', 'test-rule-template-filter'],
  ['GET /v1/rules', 'list-rules'],
  ['POST /v1/rules', 'create-rule'],
  [
    'GET /v1/rules/related/custom-modules/{moduleKey}',
    'list-rules-related-to-custom-module',
  ],
  [
    'GET /v1/rules/related/custom-objects/{moduleKey}/{objectKey}',
    'list-rules-related-to-custom-object',
  ],
  [
    'GET /v1/rules/related/custom-fields/{fieldDefinitionId}',
    'list-rules-related-to-custom-field',
  ],
  ['GET /v1/rules/{id}', 'get-rule'],
  ['PATCH /v1/rules/{id}', 'update-rule'],
  ['DELETE /v1/rules/{id}', 'delete-rule'],
  ['GET /v1/rules/{id}/context-schema', 'get-rule-context-schema'],
  ['POST /v1/rules/{id}/execute', 'execute-rule'],
  ['GET /v1/rules/{id}/executions', 'list-rule-executions'],
  ['GET /v1/rules/{id}/executions/{execId}', 'get-rule-execution'],
  ['GET /v1/workflows', 'list-workflows'],
  ['POST /v1/workflows', 'create-workflow'],
  ['GET /v1/workflows/{workflowId}', 'get-workflow'],
  ['PATCH /v1/workflows/{workflowId}', 'update-workflow'],
  ['GET /v1/workflows/{workflowId}/draft', 'get-workflow-draft'],
  ['PUT /v1/workflows/{workflowId}/draft', 'save-workflow-draft'],
  ['POST /v1/workflows/{workflowId}/publish', 'publish-workflow'],
  ['POST /v1/workflows/{workflowId}/discard-draft', 'discard-workflow-draft'],
  ['GET /v1/workflows/{workflowId}/publications', 'list-workflow-publications'],
  [
    'POST /v1/workflows/{workflowId}/publications/{publicationId}/create-draft',
    'create-workflow-draft-from-publication',
  ],
  ['GET /v1/workflow-templates', 'list-workflow-templates'],
  [
    'POST /v1/workflow-templates/{templateId}/create-workflow',
    'create-workflow-from-template',
  ],
  [
    'GET /v1/workflows/runtime/create-options',
    'get-workflow-create-options',
  ],
  [
    'GET /v1/workflows/runtime/targets/{targetType}/{targetId}',
    'get-target-workflow-state',
  ],
  [
    'POST /v1/workflows/runtime/targets/{targetType}/{targetId}/instances',
    'start-workflow-instance',
  ],
  [
    'GET /v1/workflows/runtime/instances/{instanceId}',
    'get-workflow-instance',
  ],
  [
    'GET /v1/workflows/runtime/instances/{instanceId}/replay',
    'get-workflow-instance-replay',
  ],
  [
    'PATCH /v1/workflows/runtime/instances/{instanceId}/author',
    'update-workflow-instance-author',
  ],
  [
    'POST /v1/workflows/runtime/instances/{instanceId}/transitions/{transitionId}',
    'execute-workflow-transition',
  ],
  [
    'GET /v1/workflows/runtime/instances/{instanceId}/history',
    'get-workflow-instance-history',
  ],
  ['GET /v1/workflows/tasks', 'list-workflow-tasks'],
  ['GET /v1/workflows/tasks/{taskId}', 'get-workflow-task'],
  [
    'POST /v1/workflows/tasks/{taskId}/reassign',
    'reassign-workflow-task',
  ],
  [
    'GET /v1/workflows/assignment-candidates/lookup',
    'lookup-workflow-assignment-candidates',
  ],
  [
    'GET /v1/custom-modules/{moduleKey}/objects/{objectKey}/delete-impact',
    'preview-custom-object-delete-impact',
  ],
  [
    'POST /v1/custom-modules/{moduleKey}/objects/{objectKey}/delete',
    'delete-custom-object',
  ],
  ['POST /v1/contractors', 'create-contractor'],
  ['GET /v1/contractors', 'list-contractors'],
  ['GET /v1/contractors/{id}', 'get-contractor'],
  ['PATCH /v1/contractors/{id}', 'update-contractor'],
  ['PATCH /v1/contractors/{id}/status', 'update-contractor-status'],
  ['POST /v1/service-catalog/items', 'create-service-catalog-item'],
  ['GET /v1/service-catalog/items', 'list-service-catalog-items'],
  ['GET /v1/service-catalog/items/{id}', 'get-service-catalog-item'],
  ['PATCH /v1/service-catalog/items/{id}', 'update-service-catalog-item'],
  [
    'PATCH /v1/service-catalog/items/{id}/archive',
    'archive-service-catalog-item',
  ],
  [
    'PATCH /v1/service-catalog/items/{id}/restore',
    'restore-service-catalog-item',
  ],
  ['POST /v1/files/attachments', 'upload-attachment-file'],
  ['GET /v1/files/{id}', 'get-file-metadata'],
  ['GET /v1/files/{id}/download', 'download-file'],
  ['GET /v1/entity-attachments', 'list-entity-attachments'],
  ['POST /v1/entity-attachments', 'attach-file-to-entity'],
  ['PATCH /v1/entity-attachments/{id}', 'update-entity-attachment'],
  ['DELETE /v1/entity-attachments/{id}', 'delete-entity-attachment'],
  [
    'GET /v1/entity-comments/{entityType}/{entityId}',
    'list-entity-comments',
  ],
  ['POST /v1/entity-comments', 'create-entity-comment'],
  ['GET /v1/entity-comments/{id}', 'get-entity-comment'],
  ['PATCH /v1/entity-comments/{id}', 'update-entity-comment'],
  ['DELETE /v1/entity-comments/{id}', 'delete-entity-comment'],
  ['GET /v1/view-layouts/resolve', 'resolve-view-layout'],
  ['GET /v1/view-layouts/catalog', 'get-view-layout-block-catalog'],
  [
    'GET /v1/view-layouts/custom-field-types',
    'get-view-layout-custom-field-type-schemas',
  ],
  [
    'GET /v1/view-layouts/surface-capabilities',
    'get-view-layout-surface-capabilities',
  ],
  [
    'GET /v1/view-layouts/surface-definitions',
    'get-view-layout-surface-definitions',
  ],
  ['POST /v1/view-layouts/runtime-data', 'load-view-layout-runtime-data'],
  [
    'POST /v1/view-layouts/runtime/dynamic-object/records',
    'create-dynamic-record-through-view-layout',
  ],
  [
    'PATCH /v1/view-layouts/runtime/dynamic-object/records/{recordId}',
    'update-dynamic-record-through-view-layout',
  ],
  [
    'POST /v1/view-layouts/runtime/dynamic-object/relation-tables/table-layout',
    'get-relation-table-row-layout-data',
  ],
  [
    'GET /v1/view-layouts/runtime/dynamic-object/relation-tables/{relationFieldKey}/target-layout',
    'resolve-relation-table-target-layout',
  ],
  [
    'POST /v1/view-layouts/runtime/dynamic-object/records/{recordId}/relation-tables/{relationFieldKey}/query',
    'query-relation-table-rows-through-view-layout',
  ],
  ['GET /v1/view-layouts', 'list-view-layouts'],
  ['POST /v1/view-layouts', 'create-view-layout'],
  [
    'GET /v1/view-layouts/{layoutId}/runtime-context-variables',
    'get-view-layout-runtime-context-variables',
  ],
  ['GET /v1/view-layouts/{layoutId}', 'get-view-layout'],
  ['PATCH /v1/view-layouts/{layoutId}', 'update-view-layout'],
  ['POST /v1/view-layouts/{layoutId}/archive', 'archive-view-layout'],
  ['PUT /v1/view-layouts/{layoutId}/draft', 'save-view-layout-draft'],
  [
    'GET /v1/view-layouts/{layoutId}/draft/staged-field-definitions/{draftFieldDefinitionId}/options',
    'get-staged-field-options',
  ],
  ['GET /v1/view-layouts/{layoutId}/versions', 'list-view-layout-versions'],
  [
    'GET /v1/view-layouts/{layoutId}/versions/{versionId}',
    'get-view-layout-version',
  ],
  [
    'POST /v1/view-layouts/{layoutId}/versions/{versionId}/restore-draft',
    'restore-view-layout-version-as-draft',
  ],
  ['POST /v1/view-layouts/{layoutId}/publish', 'publish-view-layout'],
  [
    'PUT /v1/view-layouts/{layoutId}/assignments',
    'replace-view-layout-assignments',
  ],
]);
const apiOperationSlugOrder = new Map(
  [...apiOperationSlugs.values()].map((slug, index) => [slug, index]),
);
const excludedApiOperations = new Set(['GET /v1/ping']);
const schemaUrls: Record<Locale, string> = {
  en:
    process.env.EXTERNAL_API_OPENAPI_URL_EN ??
    process.env.EXTERNAL_API_OPENAPI_URL ??
    'https://opero.kodasoft.pl/api/swagger/v1/en/json',
  pl:
    process.env.EXTERNAL_API_OPENAPI_URL_PL ??
    'https://opero.kodasoft.pl/api/swagger/v1/pl/json',
};
const apiBaseUrl =
  process.env.NEXT_PUBLIC_EXTERNAL_API_BASE_URL ?? 'https://opero.kodasoft.pl/api';
const publicApiDescriptions: Record<Locale, string> = {
  en: 'Use the Opero API to connect systems with selected Opero resources. Authenticate requests with an Opero API token.',
  pl: 'Użyj Opero API, aby łączyć systemy z wybranymi zasobami Opero. Uwierzytelniaj zapytania tokenem Opero API.',
};
const publicTokenDescriptions: Record<Locale, string> = {
  en: 'Opero API token. Send it as Authorization: Bearer ek_...',
  pl: 'Token Opero API. Przekaż go jako Authorization: Bearer ek_...',
};
const entityTargetTypeDescriptions: Record<Locale, string> = {
  en: 'API-supported target entity type. Supported values: `contractor` (Contractor).',
  pl: 'Typ obiektu docelowego obsługiwany przez API. Dozwolone wartości: `contractor` (kontrahent).',
};
const entityTargetTypeEnumDescriptions: Record<Locale, Record<string, string>> = {
  en: {
    contractor: 'Contractor',
  },
  pl: {
    contractor: 'Kontrahent',
  },
};
const apiIndexTitles: Record<Locale, string> = {
  en: 'Overview',
  pl: 'Przegląd',
};
const apiRootTitles: Record<Locale, string> = {
  en: 'Opero API',
  pl: 'API Opero',
};
const localizedTagNames: Record<Locale, Record<string, string>> = {
  en: {},
  pl: {
    Contractors: 'Kontrahenci',
    'Custom Data': 'Moduły własne',
    'Custom Modules': 'Moduły własne',
    'Custom Objects': 'Obiekty własne',
    'Custom Scripts': 'Skrypty własne',
    'Saved Queries': 'Zapytania',
    Rules: 'Reguły',
    Workflows: 'Procesy',
    Dictionaries: 'Słowniki',
    health: 'Status usługi',
    'Reference Data': 'Dane referencyjne',
    'Service Catalog': 'Katalog usług',
    Files: 'Pliki',
    'Entity Attachments': 'Załączniki obiektów',
    'Entity Comments': 'Komentarze obiektów',
    'View Layouts': 'Układy',
  },
};
const outputNames = new Set<string>();
const httpMethods = new Set([
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'patch',
  'trace',
]);

async function main() {
  await rm(path.join(rootDir!, 'content', 'openapi', 'external-api.json'), {
    force: true,
  });

  for (const locale of supportedLocales) {
    await generateLocaleApiDocs(locale);
  }
}

async function generateLocaleApiDocs(locale: Locale) {
  const schemaUrl = schemaUrls[locale];
  const schema = JSON.parse(await readFile(path.join(inputDir!, `schema.${locale}.json`), 'utf8')) as OpenAPIDocument;
  const schemaOutputPath = getSchemaOutputPath(locale);
  const apiDocsOutputDir = getApiDocsOutputDir(locale);
  const publicApiDescription = publicApiDescriptions[locale];
  outputNames.clear();
  const manualApiPages = await readManualApiPages(apiDocsOutputDir);

  removeExcludedOperations(schema);

  schema.servers = [
    {
      url: apiBaseUrl,
      description: 'Opero API base URL',
    },
  ];

  schema.tags = normalizeTags(schema);
  schema.info = {
    ...(schema.info ?? {}),
    title: 'Opero API',
    description: publicApiDescription,
  };
  localizeTagNames(schema, locale);
  localizeEntityTargetTypes(schema, locale);
  inlineParameterSchemaRefs(schema);
  sanitizeSecuritySchemes(schema, locale);
  sanitizeOperationIds(schema);

  await mkdir(path.dirname(schemaOutputPath), { recursive: true });
  await writeFile(schemaOutputPath, `${JSON.stringify(schema, null, 2)}\n`);

  await rm(apiDocsOutputDir, { recursive: true, force: true });
  await mkdir(apiDocsOutputDir, { recursive: true });

  const schemaInputPath = getSchemaInputPath(locale);
  const openapi = createOpenAPI({
    input: [schemaInputPath],
  });

  await generateFiles({
    input: openapi,
    output: apiDocsOutputDir,
    includeDescription: true,
    per: 'operation',
    groupBy: apiGroupName,
    name: apiPageName,
    slugify,
    meta: {
      folderStyle: 'folder',
    },
    index: {
      url: {
        baseUrl: `/docs/${locale}/api`,
        contentDir: path.join(rootDir!, `content/docs/${locale}/api`),
      },
      items: [
        {
          path: 'index.mdx',
          title: apiIndexTitles[locale],
          description: publicApiDescription,
        },
      ],
    },
    addGeneratedComment:
      'This file is generated by scripts/generate-external-api-docs.ts. Do not edit manually.',
  });
  await restoreManualApiPages(apiDocsOutputDir, manualApiPages);
  await updateApiRootMeta(locale);
  await updateApiGroupMeta(locale);

  const operations = countOperations(schema);
  const tags = new Set(
    Object.values(schema.paths ?? {})
      .flatMap((pathItem) => Object.values(pathItem))
      .flatMap((operation) =>
        isRecord(operation) && Array.isArray(operation.tags)
          ? operation.tags
          : [],
      ),
  );

  console.log(
    `Generated ${locale.toUpperCase()} API docs from ${schemaUrl} (${operations} operations, ${tags.size} tags).`,
  );
}

function apiPageName(this: PagesBuilder, entry: ApiPageNameEntry) {
  if (entry.type === 'operation') {
    const name = apiOperationSlugs.get(operationKey(entry.item.method, entry.item.path)) || operationRouteSlug(entry.item.method, entry.item.path);
    const key = `${apiGroupName(entry)}/${name}`;
    if (outputNames.has(key)) throw new Error(`Duplicate generated API output path: ${key}`);
    outputNames.add(key);
    return name;
  }

  if (entry.type === 'webhook') {
    return slugify(entry.info.title) || slugify(entry.item.name);
  }

  return slugify(entry.tag?.name ?? entry.info.title);
}

function apiGroupName(entry: ApiOperationEntry | ApiWebhookEntry): string {
  if (entry.type === 'webhook') {
    return 'Webhooks';
  }

  const group = apiGroups.find((apiGroup) =>
    apiGroup.matches(entry.item.path),
  );

  if (group) {
    return group.key;
  }

  return entry.item.path.replace(/^\/v\d+\//, '').split('/')[0] || 'Other';
}

function isPathIn(operationPath: string, pathPrefix: string): boolean {
  return operationPath === pathPrefix || operationPath.startsWith(`${pathPrefix}/`);
}

function isCustomSchemaPath(operationPath: string): boolean {
  return isPathIn(operationPath, '/v1/custom-modules/{moduleKey}/schema');
}

function isCustomObjectFormPath(operationPath: string): boolean {
  return isPathIn(
    operationPath,
    '/v1/custom-modules/{moduleKey}/objects/{objectKey}/forms',
  );
}

function isViewLayoutRuntimePath(operationPath: string): boolean {
  return (
    operationPath === '/v1/view-layouts/resolve' ||
    operationPath === '/v1/view-layouts/runtime-data' ||
    operationPath.includes('/runtime/dynamic-object/') ||
    operationPath.includes('/runtime-context-variables')
  );
}

function operationRouteSlug(method: string, operationPath: string): string {
  return slugify(`${method} ${operationPath.replace(/^\/v\d+\//, '')}`);
}

function operationKey(method: string, operationPath: string): string {
  return `${method.toUpperCase()} ${operationPath}`;
}

function slugify(value: string): string {
  return value
    .replace(/[ąĄ]/g, 'a')
    .replace(/[ćĆ]/g, 'c')
    .replace(/[ęĘ]/g, 'e')
    .replace(/[łŁ]/g, 'l')
    .replace(/[ńŃ]/g, 'n')
    .replace(/[óÓ]/g, 'o')
    .replace(/[śŚ]/g, 's')
    .replace(/[żŻźŹ]/g, 'z')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getSchemaInputPath(locale: Locale): string {
  return path.join(rootDir!, `content/openapi/external-api.${locale}.json`);
}

function getSchemaOutputPath(locale: Locale): string {
  return path.join(rootDir!, 'content', 'openapi', `external-api.${locale}.json`);
}

function getApiDocsOutputDir(locale: Locale): string {
  return path.join(rootDir!, 'content', 'docs', locale, 'api');
}

async function updateApiRootMeta(locale: Locale) {
  const apiDocsOutputDir = getApiDocsOutputDir(locale);
  const metaPath = path.join(apiDocsOutputDir, 'meta.json');
  const meta = JSON.parse(await readFile(metaPath, 'utf8')) as Record<
    string,
    unknown
  >;

  await writeFile(
    metaPath,
    `${JSON.stringify({ ...meta, title: apiRootTitles[locale] }, null, 2)}\n`,
  );
}

async function updateApiGroupMeta(locale: Locale) {
  const apiDocsOutputDir = getApiDocsOutputDir(locale);
  const groupTitleBySlug = new Map(
    apiGroups.map((group) => [slugify(group.key), group.title[locale]]),
  );
  const rootMetaPath = path.join(apiDocsOutputDir, 'meta.json');
  const rootMeta = JSON.parse(await readFile(rootMetaPath, 'utf8')) as {
    pages?: unknown[];
  };
  const manualPages = await getExistingManualApiPages(apiDocsOutputDir);

  if (Array.isArray(rootMeta.pages)) {
    const manualGroupPages = await getExistingManualApiGroupSlugs(apiDocsOutputDir);
    const pages = rootMeta.pages
      .map((page) => {
        if (typeof page !== 'string') {
          return page;
        }

        const group = apiGroups.find((apiGroup) => page === `---${apiGroup.key}---`);

        return group ? `---${group.title[locale]}---` : page;
      })
      .filter((page) => !manualApiPageSlugs.includes(page as never));

    rootMeta.pages = [
      ...manualPages,
      ...sortRootApiPages(uniquePages([...manualGroupPages, ...pages])),
    ];

    await writeFile(rootMetaPath, `${JSON.stringify(rootMeta, null, 2)}\n`);
  }

  for (const [groupSlug, groupTitle] of groupTitleBySlug) {
    const metaPath = path.join(apiDocsOutputDir, groupSlug, 'meta.json');
    const metaContent = await readOptionalFile(metaPath);
    const manualGroupPages = await getExistingManualApiGroupPages(
      apiDocsOutputDir,
      groupSlug,
    );

    if (!metaContent && manualGroupPages.length === 0) {
      continue;
    }

    const meta = (metaContent ? JSON.parse(metaContent) : { pages: [] }) as {
      pages?: unknown[];
      [key: string]: unknown;
    };

    if (Array.isArray(meta.pages)) {
      const generatedPages = sortApiPages(meta.pages).filter(
        (page) => !manualGroupPages.includes(page as never),
      );

      meta.pages = [...manualGroupPages, ...generatedPages];
    }

    await writeFile(
      metaPath,
      `${JSON.stringify({ ...meta, title: groupTitle }, null, 2)}\n`,
    );
  }
}

async function readManualApiPages(
  apiDocsOutputDir: string,
): Promise<Map<string, string>> {
  const pages = new Map<string, string>();

  for (const slug of manualApiPageSlugs) {
    const content = await readOptionalFile(path.join(apiDocsOutputDir, `${slug}.mdx`));

    if (content) {
      pages.set(slug, content);
    }
  }

  for (const [groupSlug, slugs] of Object.entries(manualApiGroupPageSlugs)) {
    for (const slug of slugs) {
      const relativePath = `${groupSlug}/${slug}`;
      const content = await readOptionalFile(
        path.join(apiDocsOutputDir, `${relativePath}.mdx`),
      );

      if (content) {
        pages.set(relativePath, content);
      }
    }
  }

  return pages;
}

async function restoreManualApiPages(
  apiDocsOutputDir: string,
  pages: Map<string, string>,
) {
  for (const [relativePath, content] of pages) {
    const targetPath = path.join(apiDocsOutputDir, `${relativePath}.mdx`);

    await mkdir(path.dirname(targetPath), { recursive: true });
    await writeFile(targetPath, content);
  }
}

async function getExistingManualApiPages(
  apiDocsOutputDir: string,
): Promise<string[]> {
  const pages: string[] = [];

  for (const slug of manualApiPageSlugs) {
    const content = await readOptionalFile(path.join(apiDocsOutputDir, `${slug}.mdx`));

    if (content) {
      pages.push(slug);
    }
  }

  return pages;
}

async function getExistingManualApiGroupSlugs(
  apiDocsOutputDir: string,
): Promise<string[]> {
  const pages: string[] = [];

  for (const groupSlug of Object.keys(manualApiGroupPageSlugs)) {
    const manualGroupPages = await getExistingManualApiGroupPages(
      apiDocsOutputDir,
      groupSlug,
    );

    if (manualGroupPages.length > 0) {
      pages.push(groupSlug);
    }
  }

  return pages;
}

async function getExistingManualApiGroupPages(
  apiDocsOutputDir: string,
  groupSlug: string,
): Promise<string[]> {
  const pages: string[] = [];

  for (const slug of manualApiGroupPageSlugs[groupSlug] ?? []) {
    const content = await readOptionalFile(
      path.join(apiDocsOutputDir, groupSlug, `${slug}.mdx`),
    );

    if (content) {
      pages.push(slug);
    }
  }

  return pages;
}

async function readOptionalFile(filePath: string): Promise<string | undefined> {
  try {
    return await readFile(filePath, 'utf8');
  } catch (error) {
    if (isFileNotFoundError(error)) {
      return undefined;
    }

    throw error;
  }
}

function isFileNotFoundError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'ENOENT'
  );
}

function sortApiPages(pages: unknown[]): unknown[] {
  return [...pages].sort((a, b) => {
    if (typeof a !== 'string' || typeof b !== 'string') {
      return 0;
    }

    const aOrder = apiOperationSlugOrder.get(a) ?? Number.MAX_SAFE_INTEGER;
    const bOrder = apiOperationSlugOrder.get(b) ?? Number.MAX_SAFE_INTEGER;

    return aOrder - bOrder;
  });
}

function sortRootApiPages(pages: unknown[]): unknown[] {
  const groupOrder = new Map(
    apiGroups.map((group, index) => [slugify(group.key), index]),
  );

  return [...pages].sort((a, b) => {
    if (typeof a !== 'string' || typeof b !== 'string') {
      return 0;
    }

    const aOrder = groupOrder.get(a) ?? Number.MAX_SAFE_INTEGER;
    const bOrder = groupOrder.get(b) ?? Number.MAX_SAFE_INTEGER;

    return aOrder - bOrder;
  });
}

function uniquePages(pages: unknown[]): unknown[] {
  const seen = new Set<string>();
  const unique: unknown[] = [];

  for (const page of pages) {
    if (typeof page !== 'string') {
      unique.push(page);
      continue;
    }

    if (!seen.has(page)) {
      seen.add(page);
      unique.push(page);
    }
  }

  return unique;
}

function localizeTagNames(schema: OpenAPIDocument, locale: Locale) {
  const tagNames = localizedTagNames[locale];

  if (Object.keys(tagNames).length === 0) {
    return;
  }

  schema.tags = schema.tags?.map((tag) => ({
    ...tag,
    name: tagNames[tag.name] ?? tag.name,
  }));

  for (const pathItem of Object.values(schema.paths ?? {})) {
    for (const operation of Object.values(pathItem)) {
      if (!isRecord(operation) || !Array.isArray(operation.tags)) {
        continue;
      }

      operation.tags = operation.tags.map((tag) =>
        typeof tag === 'string' ? tagNames[tag] ?? tag : tag,
      );
    }
  }
}

function localizeEntityTargetTypes(schema: OpenAPIDocument, locale: Locale) {
  const description = entityTargetTypeDescriptions[locale];
  const enumDescriptions = entityTargetTypeEnumDescriptions[locale];
  const targetTypeSchema =
    schema.components?.schemas?.ExternalApiEntityTargetType;

  if (isRecord(targetTypeSchema)) {
    targetTypeSchema.description = description;
    targetTypeSchema['x-enumDescriptions'] = enumDescriptions;
  }

  for (const pathItem of Object.values(schema.paths ?? {})) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!httpMethods.has(method) || !isRecord(operation)) {
        continue;
      }

      const parameters = operation.parameters;

      if (!Array.isArray(parameters)) {
        continue;
      }

      for (const parameter of parameters) {
        if (isRecord(parameter) && parameter.name === 'entityType') {
          parameter.description = description;
        }
      }
    }
  }

  for (const schemaValue of Object.values(schema.components?.schemas ?? {})) {
    if (!isRecord(schemaValue) || !isRecord(schemaValue.properties)) {
      continue;
    }

    const entityTypeProperty = schemaValue.properties.entityType;

    if (isRecord(entityTypeProperty)) {
      entityTypeProperty.description = description;
    }
  }
}

function removeExcludedOperations(schema: OpenAPIDocument) {
  for (const [operationPath, pathItem] of Object.entries(schema.paths ?? {})) {
    for (const method of httpMethods) {
      if (excludedApiOperations.has(operationKey(method, operationPath))) {
        delete pathItem[method];
      }
    }

    if (Object.keys(pathItem).length === 0) {
      delete schema.paths?.[operationPath];
    }
  }
}

function sanitizeSecuritySchemes(schema: OpenAPIDocument, locale: Locale) {
  const apiToken = schema.components?.securitySchemes?.['api-token'];

  if (isRecord(apiToken)) {
    apiToken.description = publicTokenDescriptions[locale];
  }
}

function inlineParameterSchemaRefs(schema: OpenAPIDocument) {
  const schemas = schema.components?.schemas;

  if (!schemas) {
    return;
  }

  for (const pathItem of Object.values(schema.paths ?? {})) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!httpMethods.has(method) || !isRecord(operation)) {
        continue;
      }

      const parameters = operation.parameters;

      if (!Array.isArray(parameters)) {
        continue;
      }

      for (const parameter of parameters) {
        if (!isRecord(parameter) || !isRecord(parameter.schema)) {
          continue;
        }

        const schemaRef = parameter.schema.$ref;

        if (typeof schemaRef !== 'string') {
          continue;
        }

        const referencedSchema = getSchemaByRef(schemas, schemaRef);

        if (!referencedSchema || !isSimpleParameterSchema(referencedSchema)) {
          continue;
        }

        const inlinedSchema = {
          ...referencedSchema,
          ...parameter.schema,
        };
        delete inlinedSchema.$ref;
        parameter.schema = inlinedSchema;
      }
    }
  }
}

function getSchemaByRef(
  schemas: Record<string, unknown>,
  ref: string,
): Record<string, unknown> | undefined {
  const match = ref.match(/^#\/components\/schemas\/(.+)$/);

  if (!match) {
    return undefined;
  }

  const schemaName = match[1];
  const referencedSchema = schemas[schemaName];

  return isRecord(referencedSchema) ? referencedSchema : undefined;
}

function isSimpleParameterSchema(schema: Record<string, unknown>): boolean {
  return (
    Array.isArray(schema.enum) ||
    typeof schema.type === 'string' ||
    typeof schema.format === 'string' ||
    typeof schema.description === 'string'
  );
}

function sanitizeOperationIds(schema: OpenAPIDocument) {
  const usedOperationIds = new Set<string>();

  for (const [operationPath, pathItem] of Object.entries(schema.paths ?? {})) {
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!httpMethods.has(method) || !isRecord(operation)) {
        continue;
      }

      const title =
        typeof operation.summary === 'string'
          ? operation.summary
          : operationRouteSlug(method, operationPath);
      const operationId = uniqueOperationId(toOperationId(title), usedOperationIds);

      operation.operationId = operationId;
      usedOperationIds.add(operationId);
    }
  }
}

function toOperationId(value: string): string {
  const slug = slugify(value) || 'operation';

  return slug.replace(/-([a-z0-9])/g, (_, char: string) => char.toUpperCase());
}

function uniqueOperationId(base: string, used: Set<string>): string {
  if (!used.has(base)) {
    return base;
  }

  let suffix = 2;
  let candidate = `${base}${suffix}`;

  while (used.has(candidate)) {
    suffix += 1;
    candidate = `${base}${suffix}`;
  }

  return candidate;
}

function countOperations(schema: OpenAPIDocument): number {
  return Object.values(schema.paths ?? {}).reduce((total, pathItem) => {
    return (
      total +
      Object.keys(pathItem).filter((method) => httpMethods.has(method)).length
    );
  }, 0);
}

function normalizeTags(schema: OpenAPIDocument): Array<{ name: string }> {
  const existing = new Set((schema.tags ?? []).map((tag) => tag.name));
  const discovered = new Set<string>();

  for (const pathItem of Object.values(schema.paths ?? {})) {
    for (const operation of Object.values(pathItem)) {
      if (!isRecord(operation) || !Array.isArray(operation.tags)) {
        continue;
      }

      for (const tag of operation.tags) {
        if (typeof tag === 'string') {
          discovered.add(tag);
        }
      }
    }
  }

  return [
    ...(schema.tags ?? []),
    ...[...discovered]
      .filter((tag) => !existing.has(tag))
      .sort((a, b) => a.localeCompare(b))
      .map((name) => ({ name })),
  ];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
