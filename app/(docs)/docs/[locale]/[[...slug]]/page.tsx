import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/docs/page';

import { OpenAPIPage } from '@/components/docs/api-page';
import { getMDXComponents } from '@/components/docs/mdx';
import { isLocale, locales, type Locale } from '@/lib/docs/i18n';
import { preloadOperations } from '@/lib/docs/openapi';
import { docsOgImage, getPublicUrl, metaDescription, siteDescription, siteName } from '@/lib/docs/site';
import { source } from '@/lib/docs/source';
import { ArticleJsonLd } from '@/lib/seo/json-ld';

export const dynamicParams = false;

type PageParams = {
  locale: string;
  slug?: string[];
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    source
      .getPages(locale)
      .filter((page) => isPhysicalLocalePage(page, locale))
      .map((page) => ({
        locale,
        slug: page.slugs,
      })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const page = source.getPage(slug, locale);

  if (!page || !isPhysicalLocalePage(page, locale)) {
    return {};
  }

  const description = metaDescription(page.data.description);

  return {
    title: page.data.title,
    description,
    alternates: {
      canonical: getPublicUrl(page.url),
      languages: getLanguageAlternates(slug),
    },
    openGraph: {
      title: `${page.data.title} | ${siteName}`,
      description,
      url: getPublicUrl(page.url),
      siteName,
      type: 'article',
      images: [docsOgImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${page.data.title} | ${siteName}`,
      description,
      images: [docsOgImage.url],
    },
  };
}

export default async function Page({ params }: { params: Promise<PageParams> }) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const page = source.getPage(slug, locale);

  if (!page || !isPhysicalLocalePage(page, locale)) {
    notFound();
  }

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <ArticleJsonLd
        type="TechArticle"
        headline={page.data.title}
        description={page.data.description ?? siteDescription}
        image={docsOgImage.url}
        url={getPublicUrl(page.url)}
        inLanguage={locale}
      />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            OpenAPIPage: async (props) => (
              <OpenAPIPage
                {...(await preloadOperations(page, props.operations))}
                {...props}
              />
            ),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

function getLanguageAlternates(slug: string[] | undefined) {
  const path = slug?.length ? `/${slug.join('/')}` : '';
  const languages: Record<string, string> = {};

  for (const locale of locales) {
    const page = source.getPage(slug, locale);

    if (page && isPhysicalLocalePage(page, locale)) {
      languages[locale] = getPublicUrl(`/${locale}${path}`);
    }
  }

  if (languages.en) languages["x-default"] = languages.en;
  return languages;
}

function isPhysicalLocalePage(
  page: { absolutePath?: string },
  locale: Locale,
): boolean {
  return page.absolutePath
    ?.replaceAll('\\', '/')
    .includes(`content/docs/${locale}/`) ?? false;
}
