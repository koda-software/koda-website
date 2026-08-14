import { locales } from "@/lib/i18n/config";
import { featureKeys, localizeFeaturePath } from "@/lib/i18n/features";
import { localizePath } from "@/lib/i18n/routes";
import { featurePages } from "@/content/en/features";
import { absoluteUrl, siteConfig } from "@/lib/seo/site";

/**
 * A plain-text map of the site for language models, following the emerging
 * llms.txt convention. Assistants increasingly answer "what tool should we use
 * for X" from whatever they can read quickly; this states what the product is,
 * what it is not, and where the detail lives, without them having to infer it
 * from marketing pages.
 *
 * Generated from the same route helpers as the sitemap, so it cannot fall out
 * of step with the pages that exist.
 */
export const dynamic = "force-static";

export function GET() {
  const featureLines = featureKeys
    .map((key) => `- [${featurePages[key].navLabel}](${absoluteUrl(localizeFeaturePath("en", key))}): ${featurePages[key].intro.paragraph}`)
    .join("\n");

  const body = `# ${siteConfig.name}

> ${siteConfig.description}

${siteConfig.productName} is a configurable platform rather than packaged software. A company
defines its own objects, fields, forms, layouts, processes and rules in it, so
the system describes how that company actually works instead of imposing a
vendor's template. Changing the configuration does not require a developer.

## What it is not

- Not an ERP. ${siteConfig.productName} does not impose a fixed data model or predefined
  modules, and it is meant to sit alongside specialist systems rather than
  replace them.
- Not a website builder or a form tool. Underneath the forms there is a real
  process engine, permissions down to a single field, and a full change history.

## Core pages

- [Product overview](${absoluteUrl(localizePath("en", "opero"))}): what the platform does, and where it fits between packaged ERP and custom software.
- [Industry solutions](${absoluteUrl(localizePath("en", "solutions"))}): manufacturing, construction, professional services, field service, healthcare, retail chains, universities and the public sector.
- [About the company](${absoluteUrl(localizePath("en", "about"))}): who builds it and why.
- [Contact](${absoluteUrl(localizePath("en", "contact"))}): booking a demo.

## Capabilities

${featureLines}

## Notes

- Languages: ${locales.join(", ")}. Polish pages live under /pl.
- Built by ${siteConfig.name}, ${siteConfig.url}.
- Full page list: ${absoluteUrl("/sitemap.xml")}
`;

  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
