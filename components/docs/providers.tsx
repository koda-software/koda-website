'use client';

import { RootProvider } from 'fumadocs-ui/provider/next';
import type { RootProviderProps } from 'fumadocs-ui/provider/next';
import { lazy, type ReactNode } from 'react';

import { locales } from '@/lib/docs/i18n';
import { docsBasePath } from '@/lib/docs/site';
const SearchDialog = lazy(() =>
  import('@/components/docs/search').then((module) => ({ default: module.SearchDialog })),
);
const isAlgoliaSearchConfigured = Boolean(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID &&
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY &&
  (process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ||
    process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME_EN ||
    process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME_PL),
);

type ProvidersProps = {
  children: ReactNode;
  i18n: NonNullable<RootProviderProps['i18n']>;
};

export function Providers({ children, i18n }: ProvidersProps) {
  return (
    <RootProvider
      search={
        isAlgoliaSearchConfigured
          ? {
              SearchDialog,
              preload: false,
            }
          : {
              enabled: false,
            }
      }
      i18n={{
        ...i18n,
        onLocaleChange: (nextLocale) => {
          const segments = window.location.pathname.split('/').filter(Boolean);
          const baseSegment = docsBasePath.slice(1);

          if (segments[0] === baseSegment) {
            segments.shift();
          }

          if (segments.length === 0 || !isSupportedLocale(segments[0])) {
            segments.unshift(nextLocale);
          } else {
            segments[0] = nextLocale;
          }

          window.location.assign(
            `${docsBasePath}/${segments.join('/')}${window.location.search}${window.location.hash}`,
          );
        },
      }}
    >
      {children}
    </RootProvider>
  );
}

function isSupportedLocale(value: string): boolean {
  return (locales as readonly string[]).includes(value);
}
