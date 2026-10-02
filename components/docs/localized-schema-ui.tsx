'use client';

import {
  generateSchemaUI,
  type SchemaData,
  type SchemaUIGeneratedData,
  type SchemaUIOptions,
} from '@fumadocs/api-docs/components/schema';
import { SchemaUI } from '@fumadocs/api-docs/components/schema/client';
import type { ParsedSchema, SchemaResolver } from '@fumadocs/api-docs/schema';
import type { RenderContext } from 'fumadocs-openapi';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { useMemo } from 'react';

import { isLocale, type Locale } from '@/lib/docs/i18n';

export type LocalizedSchemaUIProps = Omit<
  SchemaUIOptions,
  'resolver' | 'renderMarkdown'
> & {
  ctx: RenderContext;
};

const primitiveTypeTranslations: Record<Locale, Record<string, string>> = {
  en: {},
  pl: {
    any: 'dowolny',
    array: 'tablica',
    boolean: 'wartość logiczna',
    file: 'plik',
    integer: 'liczba całkowita',
    never: 'brak',
    number: 'liczba',
    object: 'obiekt',
    string: 'tekst',
    unknown: 'nieznany',
  },
};

const schemaLabels: Record<
  Locale,
  Parameters<typeof generateSchemaUI>[0]['labels']
> = {
  en: {
    default: 'Default',
    example: 'Example',
    format: 'Format',
    items: 'Items',
    length: 'Length',
    match: 'Match',
    multipleOf: 'Multiple Of',
    properties: 'Properties',
    range: 'Range',
    valueIn: 'Value in',
  },
  pl: {
    default: 'Domyślnie',
    example: 'Przykład',
    format: 'Format',
    items: 'Elementy',
    length: 'Długość',
    match: 'Dopasowanie',
    multipleOf: 'Wielokrotność',
    properties: 'Pola',
    range: 'Zakres',
    valueIn: 'Wartość',
  },
};

export function LocalizedSchemaUI({
  ctx,
  root,
  client,
  readOnly,
  writeOnly,
  showExample,
}: LocalizedSchemaUIProps) {
  const { locale: rawLocale } = useI18n();
  const locale =
    typeof rawLocale === 'string' && isLocale(rawLocale) ? rawLocale : 'en';

  const generated = useMemo(() => {
    const resolver: SchemaResolver = (value: ParsedSchema) => ({
      dereferenced: value,
      $ref: typeof value === 'object' ? ctx.schema.getRawRef(value) : undefined,
    });

    return localizeGeneratedSchemaData(
      generateSchemaUI({
        root,
        resolver,
        readOnly,
        writeOnly,
        showExample,
        labels: schemaLabels[locale],
        renderMarkdown: ctx._default_processMarkdown,
      }),
      locale,
    );
  }, [ctx, locale, readOnly, root, showExample, writeOnly]);

  return <SchemaUI {...client} generated={generated} />;
}

function localizeGeneratedSchemaData(
  generated: SchemaUIGeneratedData,
  locale: Locale,
): SchemaUIGeneratedData {
  if (locale === 'en') {
    return generated;
  }

  return {
    $root: generated.$root,
    refs: Object.fromEntries(
      Object.entries(generated.refs).map(([key, value]) => [
        key,
        localizeSchemaData(value, locale),
      ]),
    ),
  };
}

function localizeSchemaData(schema: SchemaData, locale: Locale): SchemaData {
  if (schema.type === 'or' || schema.type === 'and') {
    return {
      ...schema,
      aliasName: localizeTypeLabel(schema.aliasName, locale),
      items: schema.items.map((item) => ({
        ...item,
        name: localizeTypeLabel(item.name, locale),
      })),
      typeName: localizeTypeLabel(schema.typeName, locale),
    };
  }

  return {
    ...schema,
    aliasName: localizeTypeLabel(schema.aliasName, locale),
    typeName: localizeTypeLabel(schema.typeName, locale),
  };
}

function localizeTypeLabel(label: string, locale: Locale): string {
  const translations = primitiveTypeTranslations[locale];
  let localized = label;

  for (const [source, target] of Object.entries(translations)) {
    localized = localized.replace(
      new RegExp(`\\b${escapeRegExp(source)}\\b`, 'g'),
      target,
    );
  }

  return localized;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
