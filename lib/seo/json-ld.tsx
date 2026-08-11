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
  type: "BlogPosting" | "Article" | "NewsArticle";
  headline: string;
  description: string;
  /** Absolute image URL; falls back to the site OG image upstream. */
  image: string;
  url: string;
  datePublished: string;
  dateModified: string;
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
        datePublished,
        dateModified,
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

export function SoftwareApplicationJsonLd({
  description,
  locale,
}: {
  description: string;
  locale: Locale;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: siteConfig.productName,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        inLanguage: locale,
        url: absoluteUrl(localizePath(locale, "opero")),
        description,
        provider: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
        },
      }}
    />
  );
}
