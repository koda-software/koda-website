'use client';

import { liteClient } from 'algoliasearch/lite';
import AlgoliaSearchDialog from 'fumadocs-ui/components/dialog/search-algolia';
import type { SharedProps } from 'fumadocs-ui/components/dialog/search';
import { useI18n } from 'fumadocs-ui/contexts/i18n';

import { isLocale, type Locale } from '@/lib/docs/i18n';

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const searchApiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;
const baseIndexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;
const indexNames: Partial<Record<Locale, string>> = {
  en: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME_EN,
  pl: process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME_PL,
};

const algolia =
  appId && searchApiKey ? liteClient(appId, searchApiKey) : undefined;

export const isAlgoliaSearchConfigured = Boolean(
  algolia && (baseIndexName || indexNames.en || indexNames.pl),
);

export function SearchDialog(props: SharedProps) {
  const { locale } = useI18n();

  if (!algolia || !isAlgoliaSearchConfigured) {
    return null;
  }

  const indexName = getIndexName(
    typeof locale === 'string' && isLocale(locale) ? locale : 'en',
  );

  if (!indexName) {
    return null;
  }

  return (
    <AlgoliaSearchDialog
      {...props}
      searchOptions={{
        client: algolia,
        indexName,
      }}
      showAlgolia={false}
    />
  );
}

function getIndexName(locale: Locale): string | undefined {
  return (
    indexNames[locale] ?? (baseIndexName ? `${baseIndexName}_${locale}` : undefined)
  );
}
