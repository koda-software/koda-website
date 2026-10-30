import { absoluteUrl, siteConfig } from "./site";
import type { Locale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/routes";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl(siteConfig.logo),
        },
        ...(siteConfig.sameAs.length ? { sameAs: siteConfig.sameAs } : {}),
      }}
    />
  );
}

export function WebsiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
      }}
    />
  );
}

export function FaqJsonLd({ items }: { items: Array<{ question: string; answer: string }> }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: Array<{ name: string; path: string }> }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: absoluteUrl(item.path),
        })),
      }}
    />
  );
}

export type ArticleJsonLdInput = {
  type: "BlogPosting" | "Article" | "NewsArticle" | "TechArticle";
  headline: string;
  description: string;
  /** Absolute image URL; falls back to the site OG image upstream. */
  image: string;
  url: string;
  /** Optional for docs pages, which carry no trustworthy per-page dates. */
  datePublished?: string;
  dateModified?: string;
  inLanguage: string;
  author?: {
    name: string;
    url?: string;
    sameAs?: string[];
  };
  keywords?: string[];
};

export function ArticleJsonLd({
  type,
  headline,
  description,
  image,
  url,
  datePublished,
  dateModified,
  inLanguage,
  author,
  keywords,
}: ArticleJsonLdInput) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": type,
        headline,
        description,
        image: [image],
        url,
        ...(datePublished ? { datePublished } : {}),
        ...(dateModified ? { dateModified } : {}),
        inLanguage,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": url,
        },
        ...(author
          ? {
              author: {
                "@type": "Person",
                name: author.name,
                ...(author.url ? { url: author.url } : {}),
                ...(author.sameAs?.length ? { sameAs: author.sameAs } : {}),
              },
            }
          : {}),
        ...(keywords?.length ? { keywords: keywords.join(", ") } : {}),
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
          logo: {
            "@type": "ImageObject",
            url: absoluteUrl("/branding/kodasoft-logo.svg"),
          },
        },
      }}
    />
  );
}

/**
 * Opero as a Service, not a SoftwareApplication: Google's Software App rich result
 * requires a price and a rating, and we publish neither (sales go through a demo).
 */
export function OperoServiceJsonLd({
  description,
  featureList,
  locale,
}: {
  description: string;
  /** What the product does, one entry per capability, in the page's language. */
  featureList: string[];
  locale: Locale;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name: siteConfig.productName,
        serviceType: "Business Process Management software",
        category: "BusinessApplication",
        url: absoluteUrl(localizePath(locale, "opero")),
        description,
        image: absoluteUrl(siteConfig.defaultOgImage),
        provider: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: siteConfig.productName,
          itemListElement: featureList.map((name) => ({ "@type": "Service", name })),
        },
      }}
    />
  );
}
