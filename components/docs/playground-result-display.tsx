'use client';

import {
  DefaultResultDisplay,
  type ResultDisplayProps,
} from 'fumadocs-openapi/playground/client';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { useMemo } from 'react';
import { JsonView } from 'react-json-view-lite';

import { isLocale, type Locale } from '@/lib/docs/i18n';

const jsonTreeStyles = {
  basicChildStyle: 'opero-json-tree__child',
  booleanValue: 'opero-json-tree__boolean',
  childFieldsContainer: 'opero-json-tree__children',
  clickableLabel: 'opero-json-tree__label opero-json-tree__label--clickable',
  collapsedContent: 'opero-json-tree__collapsed',
  collapseIcon: 'opero-json-tree__icon opero-json-tree__icon--collapse',
  container: 'opero-json-tree',
  expandIcon: 'opero-json-tree__icon opero-json-tree__icon--expand',
  label: 'opero-json-tree__label',
  nullValue: 'opero-json-tree__null',
  numberValue: 'opero-json-tree__number',
  otherValue: 'opero-json-tree__other',
  punctuation: 'opero-json-tree__punctuation',
  quotesForFieldNames: false,
  stringValue: 'opero-json-tree__string',
  stringifyStringValues: true,
  undefinedValue: 'opero-json-tree__undefined',
};

const expandRootAndFirstLevel = (level: number) => level < 2;

export function PlaygroundResultDisplay(props: ResultDisplayProps) {
  if (props.data.type !== 'response' || !isJsonContent(props.data.headers)) {
    return <DefaultResultDisplay {...props} />;
  }

  return <JsonResultDisplay {...props} data={props.data} />;
}

function JsonResultDisplay({
  data,
  reset,
  className,
  ...props
}: ResultDisplayProps & { data: Extract<ResultDisplayProps['data'], { type: 'response' }> }) {
  const { locale: rawLocale } = useI18n();
  const locale =
    typeof rawLocale === 'string' && isLocale(rawLocale) ? rawLocale : 'en';
  const result = useMemo(() => parseJsonBody(data.body), [data.body]);

  if (!result.ok) {
    return <DefaultResultDisplay data={data} reset={reset} className={className} />;
  }

  return (
    <div
      {...props}
      className={[
        'mt-2 flex flex-col gap-2 border-y bg-fd-secondary px-3 py-2 text-fd-secondary-foreground',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-center gap-1.5">
        <span
          aria-hidden="true"
          className={[
            'size-2.5 shrink-0 rounded-full',
            data.status >= 200 && data.status < 300
              ? 'bg-green-500'
              : data.status >= 400
                ? 'bg-red-500'
                : 'bg-fd-muted-foreground',
          ].join(' ')}
        />
        <p className="text-nowrap text-sm font-medium">
          {data.status} {getStatusDescription(data.status, locale)}
        </p>
        <code className="ms-auto truncate text-xs text-fd-muted-foreground">
          {getContentType(data.headers)}
        </code>
        <button
          type="button"
          className={buttonVariants({
            size: 'sm',
            variant: 'outline',
          })}
          onClick={() => reset()}
        >
          {locale === 'pl' ? 'Zamknij' : 'Close'}
        </button>
      </div>

      <div className="max-h-[520px] overflow-auto rounded-lg border bg-fd-card p-3 text-fd-card-foreground">
        {isJsonTreeData(result.value) ? (
          <JsonView
            aria-label={locale === 'pl' ? 'Treść JSON' : 'JSON response body'}
            clickToExpandNode
            data={result.value}
            shouldExpandNode={expandRootAndFirstLevel}
            style={jsonTreeStyles}
          />
        ) : (
          <pre className="overflow-x-auto text-sm">
            <code>{JSON.stringify(result.value, null, 2)}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

function isJsonContent(headers: Headers): boolean {
  const contentType = headers.get('Content-Type')?.toLowerCase() ?? '';

  return (
    contentType.includes('application/json') ||
    contentType.includes('+json')
  );
}

function getContentType(headers: Headers): string {
  return headers.get('Content-Type')?.split(';')[0]?.trim() || 'application/json';
}

function parseJsonBody(body: ArrayBuffer):
  | { ok: true; value: unknown }
  | { ok: false } {
  try {
    return {
      ok: true,
      value: JSON.parse(new TextDecoder('utf-8').decode(body)),
    };
  } catch {
    return { ok: false };
  }
}

function isJsonTreeData(value: unknown): value is object | unknown[] {
  return typeof value === 'object' && value !== null;
}

function getStatusDescription(status: number, locale: Locale): string {
  const labels = statusLabels[locale];

  if (status === 400) return labels.badRequest;
  if (status === 401) return labels.unauthorized;
  if (status === 403) return labels.forbidden;
  if (status === 404) return labels.notFound;
  if (status === 500) return labels.internalServerError;
  if (status >= 200 && status < 300) return labels.successful;
  if (status >= 400) return labels.error;

  return '';
}

const statusLabels: Record<
  Locale,
  {
    badRequest: string;
    error: string;
    forbidden: string;
    internalServerError: string;
    notFound: string;
    successful: string;
    unauthorized: string;
  }
> = {
  en: {
    badRequest: 'Bad Request',
    error: 'Error',
    forbidden: 'Forbidden',
    internalServerError: 'Internal Server Error',
    notFound: 'Not Found',
    successful: 'Successful',
    unauthorized: 'Unauthorized',
  },
  pl: {
    badRequest: 'Nieprawidłowe żądanie',
    error: 'Błąd',
    forbidden: 'Brak dostępu',
    internalServerError: 'Wewnętrzny błąd serwera',
    notFound: 'Nie znaleziono',
    successful: 'Sukces',
    unauthorized: 'Brak autoryzacji',
  },
};
