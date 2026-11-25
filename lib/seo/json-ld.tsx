import { absoluteUrl, siteConfig } from "./site";
import type { ToolsIndexContent } from "@/content/types";
import type { Locale } from "@/lib/i18n/config";
import { localizePath } from "@/lib/i18n/routes";
import type { ToolKey } from "@/lib/i18n/tools";

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
  /** The category the article is filed under. */
  articleSection?: string;
  wordCount?: number;
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
  articleSection,
  wordCount,
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
        ...(articleSection ? { articleSection } : {}),
        ...(wordCount ? { wordCount } : {}),
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

/**
 * A free tool. Unlike Opero it has a real price - zero - so it is described as the
 * application it is; Google may still show no rich result without ratings, which is fine.
 */
export function ToolJsonLd({ name, description, path, locale }: { name: string; description: string; path: string; locale: Locale }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name,
        description,
        url: absoluteUrl(path),
        applicationCategory: "BusinessApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        inLanguage: locale,
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "PLN" },
        provider: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
      }}
    />
  );
}

/** A listing page as the ordered list of the pages it links to. */
function CollectionJsonLd({
  name,
  description,
  path,
  locale,
  about,
  items,
}: CollectionPageInput & {
  /** What the collection belongs to, and anything else its type of page states about itself. */
  about: Record<string, unknown>;
  items: Array<{ name: string; description?: string; path: string }>;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name,
        description,
        url: absoluteUrl(path),
        inLanguage: locale,
        ...about,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: items.length,
          itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: absoluteUrl(item.path),
            name: item.name,
            ...(item.description ? { description: item.description } : {}),
          })),
        },
      }}
    />
  );
}

type CollectionPageInput = { name: string; description: string; path: string; locale: Locale };

/** The tools index as a collection of the free tools it links to, in page order. */
export function ToolsCollectionJsonLd({
  content,
  links,
  locale,
}: {
  content: ToolsIndexContent;
  links: Array<{ tool: ToolKey; label: string; href: string }>;
  locale: Locale;
}) {
  const linkByTool = new Map(links.map((link) => [link.tool, link]));
  const items = content.categories
    .flatMap((category) => category.tools)
    .flatMap((tool) => {
      const link = linkByTool.get(tool);
      return link ? [{ name: link.label, description: content.cards[tool].description, path: link.href }] : [];
    });

  return (
    <CollectionJsonLd
      about={{ isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url } }}
      description={content.seo.description}
      items={items}
      locale={locale}
      name={content.hero.title}
      path={localizePath(locale, "tools")}
    />
  );
}

/**
 * A blog listing - the index, one of its later pages or an archive. Each article carries its full
 * BlogPosting on its own page; here a list item is its position, address and title.
 */
export function BlogListJsonLd({ articles, ...page }: CollectionPageInput & { articles: Array<{ name: string; path: string }> }) {
  return (
    <CollectionJsonLd
      {...page}
      about={{
        isPartOf: { "@type": "Blog", name: `${siteConfig.name} Blog`, url: absoluteUrl(localizePath(page.locale, "blog")) },
        publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
      }}
      items={articles}
    />
  );
}
