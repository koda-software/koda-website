import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';

import './docs.css';

import { Providers } from '@/components/docs/providers';
import { baseOptions, createI18nProvider } from '@/lib/docs/layout.shared';
import { isLocale, locales, type Locale } from '@/lib/docs/i18n';
import { docsBasePath, docsOgImage, getSiteUrl, siteDescription, siteName } from '@/lib/docs/site';
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
  // The docs document Opero, so they carry the product's cube rather than the
  // KodaSoft tile the marketing pages use. `app/favicon.ico` still applies here
  // as the legacy fallback; browsers that read these prefer them.
  icons: {
    icon: [
      { url: `${docsBasePath}/_assets/branding/opero-favicon-96x96.png`, type: 'image/png', sizes: '96x96' },
      { url: `${docsBasePath}/_assets/branding/opero-favicon.svg`, type: 'image/svg+xml' },
    ],
    apple: { url: `${docsBasePath}/_assets/branding/opero-apple-touch-icon.png`, sizes: '180x180' },
  },
  openGraph: {
    type: 'website',
    siteName,
    title: siteName,
    description: siteDescription,
    images: [docsOgImage],
  },
  twitter: {
    card: 'summary_large_image',
    images: [docsOgImage.url],
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
