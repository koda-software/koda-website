'use client';

import { RootProvider } from 'fumadocs-ui/provider/next';
import type { RootProviderProps } from 'fumadocs-ui/provider/next';
import type { ReactNode } from 'react';

import { locales } from '@/lib/docs/i18n';
import { docsBasePath } from '@/lib/docs/site';
import {
  isAlgoliaSearchConfigured,
  SearchDialog,
} from '@/components/docs/search';

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
