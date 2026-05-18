import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { getAlternatePaths, localizePath, type PageKey } from "@/lib/i18n/routes";
import { absoluteUrl, siteConfig } from "./site";

const ogLocale: Record<Locale, string> = {
  en: "en_US",
  pl: "pl_PL",
};

export type PageSeoInput = {
  locale: Locale;
  page: PageKey;
  title: string;
  description: string;
  noIndex?: boolean;
};

export function createPageMetadata({ locale, page, title, description, noIndex }: PageSeoInput): Metadata {
  const path = localizePath(locale, page);
  const alternates = getAlternatePaths(page);
  const languages = Object.fromEntries(
    Object.entries(alternates).map(([key, value]) => [key, absoluteUrl(value)]),
  );

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(path),
      languages,
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: siteConfig.name,
      locale: ogLocale[locale],
      alternateLocale: Object.entries(ogLocale)
        .filter(([key]) => key !== locale)
        .map(([, value]) => value),
      type: "website",
      images: [
        {
          url: absoluteUrl(siteConfig.defaultOgImage),
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} and ${siteConfig.productName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(siteConfig.defaultOgImage)],
    },
    robots: noIndex
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
        },
  };
}
