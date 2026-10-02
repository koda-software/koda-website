'use client';

import { liteClient } from 'algoliasearch/lite';
import { createContentHighlighter } from 'fumadocs-core/search';
import { useDocsSearch } from 'fumadocs-core/search/client';
import {
  SearchDialog as Dialog, SearchDialogClose, SearchDialogContent,
  SearchDialogHeader, SearchDialogIcon, SearchDialogInput,
  SearchDialogList, SearchDialogOverlay,
} from 'fumadocs-ui/components/dialog/search';
import type { SharedProps } from 'fumadocs-ui/components/dialog/search';
import { useI18n } from 'fumadocs-ui/contexts/i18n';

import { sectionSearchResults } from '@/lib/docs/search-results.mjs';
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

  return <ConfiguredSearchDialog {...props} client={algolia} indexName={indexName} />;
}

function ConfiguredSearchDialog({ client, indexName, ...props }: SharedProps & {
  client: NonNullable<typeof algolia>; indexName: string;
}) {
  const { locale } = useI18n();
  const safeLocale = typeof locale === 'string' && isLocale(locale) ? locale : 'en';
  const { search, setSearch, query } = useDocsSearch({
    client: {
      deps: [client, indexName, safeLocale],
      async search(text: string) {
        const result = await client.searchForHits({ requests: [{ indexName, query: text, distinct: 5, hitsPerPage: 10 }] });
        const hits = result.results[0].hits as Array<{
          objectID: string; title: string; url: string; section?: string; section_id?: string; breadcrumbs?: string[];
        }>;
        const highlighter = createContentHighlighter(text);
        return sectionSearchResults(hits, safeLocale).map((item) => ({ ...item, content: highlighter.highlightMarkdown(item.content) }));
      },
    },
  });
  return (
    <Dialog {...props} search={search} onSearchChange={setSearch} isLoading={query.isLoading}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data === 'empty' ? null : query.data} />
      </SearchDialogContent>
    </Dialog>
  );
}

function getIndexName(locale: Locale): string | undefined {
  return (
    indexNames[locale] ?? (baseIndexName ? `${baseIndexName}_${locale}` : undefined)
  );
}
