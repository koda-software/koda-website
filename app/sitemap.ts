import type { MetadataRoute } from "next";
import { getAlternatePaths } from "@/lib/i18n/routes";
import { absoluteUrl, sitemapRoutes } from "@/lib/seo/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapRoutes.map(({ page, path }) => {
    const alternates = getAlternatePaths(page);

    return {
      url: absoluteUrl(path),
      lastModified: new Date(),
      changeFrequency: page === "home" ? "weekly" : "monthly",
      priority: page === "home" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(alternates).map(([locale, alternatePath]) => [locale, absoluteUrl(alternatePath)]),
        ),
      },
    };
  });
}
