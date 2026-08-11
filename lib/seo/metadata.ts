import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import { getFeatureAlternatePaths, localizeFeaturePath, type FeatureKey } from "@/lib/i18n/features";
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

export type FeatureSeoInput = {
  locale: Locale;
  feature: FeatureKey;
  title: string;
  description: string;
};

export function createPageMetadata({ locale, page, title, description, noIndex }: PageSeoInput): Metadata {
  return buildMetadata({
    locale,
    path: localizePath(locale, page),
    alternates: getAlternatePaths(page),
    title,
    description,
    noIndex,
  });
}

/**
 * Same envelope as `createPageMetadata`, for the feature pages nested under
 * /opero. Their titles already end in "| Opero" (product branding, not
 * company branding), so this bypasses the root layout's "%s | KodaSoft"
 * template - otherwise the two suffixes would stack into "... | Opero | KodaSoft".
 */
export function createFeaturePageMetadata({ locale, feature, title, description }: FeatureSeoInput): Metadata {
  return buildMetadata({
    locale,
    path: localizeFeaturePath(locale, feature),
    alternates: getFeatureAlternatePaths(feature),
    title,
    description,
    absoluteTitle: true,
  });
}

function buildMetadata({
  locale,
  path,
  alternates,
  title,
  description,
  noIndex,
  absoluteTitle,
}: {
  locale: Locale;
  path: string;
  alternates: Record<Locale | "x-default", string>;
  title: string;
  description: string;
  noIndex?: boolean;
  /** Bypasses the root layout's title template for a title that already carries its own suffix. */
  absoluteTitle?: boolean;
}): Metadata {
  const languages = Object.fromEntries(
    Object.entries(alternates).map(([key, value]) => [key, absoluteUrl(value)]),
  );

  return {
    title: absoluteTitle ? { absolute: title } : title,
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
