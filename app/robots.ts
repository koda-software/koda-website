import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/lib/seo/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Crawlers lift strings out of the docs' inline data and request them as URLs: OpenAPI
      // paths (/v1/companies/{companyId}/...) and the API pages' relative schema reference
      // (content/openapi/...). None exist here; /api/ is the site's own form handlers.
      disallow: ["/v1/", "/api/", "/*/content/openapi/"],
    },
    sitemap: [absoluteUrl("/sitemap.xml"), absoluteUrl("/blog-sitemap.xml"), absoluteUrl("/docs-sitemap.xml")],
    host: siteConfig.url,
  };
}
