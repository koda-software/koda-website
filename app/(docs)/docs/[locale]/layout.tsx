import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';

import './docs.css';

import { Providers } from '@/components/docs/providers';
import { baseOptions, createI18nProvider } from '@/lib/docs/layout.shared';
import { isLocale, locales, type Locale } from '@/lib/docs/i18n';
import { getSiteUrl, siteDescription, siteName } from '@/lib/docs/site';
import { source } from '@/lib/docs/source';

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  openGraph: {
    type: 'website',
    siteName,
    title: siteName,
    description: siteDescription,
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const safeLocale = locale as Locale;

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <Providers i18n={createI18nProvider(safeLocale)}>
          <DocsLayout
            tree={source.pageTree[safeLocale]}
            {...baseOptions(safeLocale)}
          >
            {children}
          </DocsLayout>
        </Providers>
      </body>
    </html>
  );
}
