# Step 4.6: SEO Strategy

Purpose: define the SEO rules before homepage implementation so the website is crawlable, multilingual-ready, technically correct, and written for real buyers first.

Scope: SEO only. Localisation architecture is already covered in `plans/step-4.5-localisation.md`.

Research sources:

- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google Helpful, Reliable, People-First Content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Title Links: https://developers.google.com/search/docs/appearance/title-link
- Google Canonicalization: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Google Localized Versions / hreflang: https://developers.google.com/search/docs/specialty/international/localized-versions
- Google Breadcrumb structured data: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- Google Organization structured data: https://developers.google.com/search/docs/appearance/structured-data/organization
- Google SoftwareApplication structured data: https://developers.google.com/search/docs/appearance/structured-data/software-app
- Next.js Metadata and OG Images: https://nextjs.org/docs/app/getting-started/metadata-and-og-images
- Next.js `generateMetadata`: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- Next.js sitemap file convention: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- Google Rich Results Test: https://search.google.com/test/rich-results
- Google Search Console URL Inspection: https://support.google.com/webmasters/answer/9012289
- Google Search Console Core Web Vitals report: https://support.google.com/webmasters/answer/9205520

## SEO Principle

SEO must help search engines understand useful content. It should not turn the website into keyword soup.

Decision:

> Write for founders, operators, and technical buyers first; use metadata, headings, URLs, schema, and internal links to make that content easy for search engines to crawl and understand.

Google's guidance is clear that SEO works best when applied to helpful, reliable, people-first content rather than content created only to manipulate rankings.

## 1. Search Positioning

Primary search themes:

- adaptive ERP software
- flexible ERP software
- AI-enabled ERP
- business process software
- workflow automation software
- custom operations software
- business operations platform
- internal tools alternative
- contractor management software
- ERP for custom workflows

Polish search themes:

- elastyczny system ERP
- oprogramowanie ERP z AI
- system ERP dla firm
- automatyzacja procesow biznesowych
- oprogramowanie do procesow firmowych
- system do obslugi kontrahentow
- platforma operacyjna dla firmy
- narzedzia wewnetrzne dla firmy

Keyword usage rules:

- Use natural phrases in headings, intros, metadata, and body copy.
- Avoid repeating the same keyword mechanically.
- Prefer intent-matched language: what the buyer is trying to solve.
- Keep `adaptive ERP` as the primary English product category.
- Use Polish terms naturally; do not translate English SEO phrases word-for-word if Polish buyers would not search that way.

## 2. Page Intent Map

| Page | Search Intent | Primary Message |
| --- | --- | --- |
| `/` | Discover Koda Soft + Opero | Koda Soft builds Opero, adaptive ERP that turns company workflows into software. |
| `/pl` | Polish discovery | Koda Soft tworzy Opero: elastyczny ERP dopasowany do sposobu pracy firmy. |
| `/en/opero` | Product evaluation | Opero capabilities, adaptive ERP, workflows, AI, governance. |
| `/pl/opero` | Polish product evaluation | Funkcje Opero, elastyczny ERP, procesy, AI, kontrola danych. |
| `/en/solutions` | Problem/use-case exploration | Business problems Opero can model and automate. |
| `/pl/solutions` | Polish use-case exploration | Problemy operacyjne, ktore Opero pomaga uporzadkowac i automatyzowac. |
| `/en/contact` | Conversion | Book demo / discuss workflow. |
| `/pl/contact` | Polish conversion | Umow rozmowe / pokaz procesu. |

## 3. Metadata Rules

Use Next.js Metadata API with static metadata per route.

Root layout should define:

- `metadataBase` after final production domain is known.
- title template, e.g. `%s | Koda Soft`.
- default Open Graph site name.
- default robots index/follow policy for production.
- default icons/favicons.

Each page should define:

- `title`
- `description`
- `alternates.canonical`
- `alternates.languages`
- `openGraph.title`
- `openGraph.description`
- `openGraph.url`
- `openGraph.locale`
- `openGraph.alternateLocale`
- `twitter.card`, likely `summary_large_image`

Title rules:

- Descriptive and specific.
- One clear page topic.
- Include Koda Soft or Opero where useful.
- Avoid exaggerated or clickbait language.
- Keep practical target around 50-60 characters when possible, but do not sacrifice clarity.

Description rules:

- Summarize the page in one useful sentence.
- Include product/category language naturally.
- Avoid keyword stuffing.
- Practical target around 140-160 characters when possible.
- Make each language/page description unique.

Example English homepage metadata draft:

```ts
export const metadata = {
  title: 'Koda Soft - Adaptive ERP Software Built Around Your Work',
  description:
    'Koda Soft builds Opero, adaptive ERP software for custom operations, workflow automation, governance, and practical AI assistance.',
};
```

Example Polish homepage metadata draft:

```ts
export const metadata = {
  title: 'Koda Soft - Elastyczny ERP dopasowany do pracy firmy',
  description:
    'Koda Soft tworzy Opero: elastyczny system ERP do procesow, automatyzacji, kontroli danych i praktycznego wsparcia AI.',
};
```

## 4. Canonicals And Language Alternates

Canonicals:

- Every indexable page should declare a canonical URL for itself.
- Canonical should not point from Polish to English or English to Polish.
- Each localized page is its own canonical version.
- Avoid duplicate unprefixed non-homepage URLs.

Hreflang / alternates:

- Each localized page set should include all language variants and itself.
- Include `x-default` where useful.
- Because `/` is the default English homepage, homepage alternates should map:
  - `en` -> `/`
  - `pl` -> `/pl`
  - `x-default` -> `/`
- For non-homepage pages:
  - `en` -> `/en/opero`
  - `pl` -> `/pl/opero`
  - `x-default` -> `/en/opero`

Implementation via Next.js Metadata API:

```ts
alternates: {
  canonical: '/',
  languages: {
    en: '/',
    pl: '/pl',
    'x-default': '/',
  },
}
```

Google localized-version guidance says each language page should list itself and all other language versions. Keep the mapping centralized to avoid mismatched hreflang pairs.

## 5. URL And Internal Link Structure

URL rules:

- Keep URLs descriptive and stable.
- Use lowercase slugs.
- Use hyphens if multi-word slugs appear later.
- Do not use query params for language.
- Do not create duplicate pages with and without trailing slash unless hosting config forces it.

Current route contract:

- `/`
- `/pl`
- `/en/opero`
- `/pl/opero`
- `/en/solutions`
- `/pl/solutions`
- `/en/contact`
- `/pl/contact`

Internal links:

- Every page should be reachable through crawlable `<a href>` links.
- Header/footer nav must use real links, not JS-only navigation.
- Homepage should link to Opero, Solutions, and Contact.
- Footer should include all main localized pages.
- Language switcher should use real links to equivalent localized pages.

## 6. Content Structure And Formatting

Page structure:

- One clear `<h1>` per page.
- Use logical heading order: `h1` -> `h2` -> `h3`.
- Break long content into sections with useful headings.
- Use short paragraphs and scannable lists where they help comprehension.
- Use descriptive link text, not `click here`.
- Keep important product claims visible in HTML, not only in images or animations.
- Ensure Google can see the same primary content users see.

Homepage recommended heading structure:

```text
h1 Turn the way you work into software.
h2 Real companies do not work in fixed templates.
h2 Opero adapts around the work, not the other way around.
h2 From messy operations to structured software.
h2 AI belongs inside the workflow, not in a separate tab.
h2 Software-house expertise, product-grade execution.
h2 Build software around the way your company actually works.
```

Content writing guidelines:

- Start with user problem, not vendor self-description.
- Use concrete business outcomes and proof points.
- Explain AI through actual workflow examples.
- Avoid unsupported absolute claims.
- Mention ERP enough for recognition, but explain the flexible/adaptive difference.
- Add trust through architecture, auditability, permissions, and maintainability.
- Keep Polish copy natural and buyer-friendly, not literal English translation.

People-first questions to ask before publishing a page:

- Would a buyer understand what problem this page solves?
- Does the page show real product capability?
- Does it avoid hype and exaggeration?
- Does it demonstrate Koda Soft's expertise?
- Would someone leave with enough clarity to decide whether to contact us?

## 7. Structured Data

Use JSON-LD only where it is truthful and maintainable.

Recommended launch schema:

1. `Organization`
   - Koda Soft company identity.
   - Name, URL, logo after final asset exists.
   - SameAs links only if real official profiles exist.

2. `SoftwareApplication` or `Product` for Opero page
   - Use carefully.
   - Do not add fake ratings, reviews, pricing, or offers.
   - `SoftwareApplication` can describe application category and operating context.

3. `BreadcrumbList` for non-homepage pages
   - Useful for site hierarchy.
   - Must match visible/logical navigation path.

4. `WebSite`
   - Optional for site identity.
   - Only add search action if real site search exists publicly.

Avoid for launch:

- `FAQPage` unless we have a real visible FAQ and it meets Google's structured data guidelines.
- Review/rating schema without real reviews.
- LocalBusiness schema unless Koda Soft wants local business positioning and has complete public local business details.
- Over-marking every card/section just because schema exists.

Structured data rules:

- JSON-LD must match visible page content.
- Keep schema per page and localized where needed.
- Validate with Google's Rich Results Test and Schema Markup Validator.

## 8. Images, OG, And Social Sharing

Open Graph:

- Create a static OG image for launch.
- Prefer one strong image per locale or a language-neutral brand image at first.
- Recommended size: 1200x630.
- Include Koda Soft / Opero and the main value proposition.
- Avoid generating OG dynamically for launch unless necessary.

Image SEO:

- Use meaningful `alt` text for content images.
- Decorative SVG/CSS diagrams can be hidden from screen readers if duplicated in text.
- Avoid text-only images for important claims.
- Optimize dimensions and file sizes for CWV.

## 9. Robots And Sitemap

Robots:

- Production `robots.txt` should allow crawling and point to sitemap.
- Preview/staging environments may use `noindex` if publicly accessible.
- Do not block CSS, JS, images, or assets needed to render pages.

Sitemap:

- Include every canonical indexable route.
- Include localized URLs.
- Include alternates/hreflang if supported cleanly by implementation.
- If Next's typed sitemap API is insufficient for our alternates needs, use a static XML file or route-compatible static generation approach.
- Keep sitemap generated from the same route map used by navigation/metadata.

Sitemap route list for launch:

```text
/
/pl
/en/opero
/pl/opero
/en/solutions
/pl/solutions
/en/contact
/pl/contact
```

## 10. Next.js Implementation Notes

Use:

- `metadata` exports for static page metadata.
- `metadataBase` once production domain is known.
- `alternates.canonical` and `alternates.languages` per route.
- `app/robots.ts` or static `public/robots.txt`.
- `app/sitemap.ts` if it emits the localized route map cleanly for our needs.
- Static OG image file convention if sufficient.
- JSON-LD script components rendered as server/static HTML.

Avoid:

- Client-side metadata changes.
- `next/head` in App Router pages.
- Dynamic metadata that depends on runtime requests.
- Middleware redirects for SEO/locales when static generation can express the route directly.
- Duplicate pages with unclear canonical strategy.

## 11. SEO Tools And Verification

Primary tools:

- Google Search Console: indexing, sitemap submission, URL inspection, search performance.
- Google URL Inspection Tool: test if specific URLs are indexable and how Google sees them.
- Google PageSpeed Insights: lab + field performance and page experience checks.
- Lighthouse: local performance, accessibility, best practices, SEO checks.
- Google Rich Results Test: validate eligible structured data.
- Schema Markup Validator: validate schema.org JSON-LD more broadly.
- Vercel Speed Insights: production CWV monitoring if deployed on Vercel.

Secondary / optional tools:

- Bing Webmaster Tools: Bing indexing, sitemap submission, SEO reports.
- Screaming Frog SEO Spider: crawl site, verify titles/descriptions/canonicals/hreflang/status codes.
- Ahrefs / Semrush: keyword and competitor research if we want paid SEO research later.
- Google Trends: validate broad search interest and terminology.
- Chrome DevTools Performance/Network: inspect rendering, payload, and layout shifts.

Pre-launch verification checklist:

- All pages have unique titles and descriptions.
- All pages have correct canonical URLs.
- All localized page pairs have reciprocal alternates.
- HTML `lang` is correct.
- Header/footer links are crawlable.
- Sitemap lists all canonical pages.
- Robots allows production crawling.
- Structured data validates without fake claims.
- Lighthouse SEO score passes basic checks.
- PageSpeed mobile remains strong.

Post-launch verification checklist:

- Add property to Google Search Console.
- Submit sitemap.
- Inspect `/`, `/pl`, and one prefixed route in each language.
- Check indexing after Google crawls.
- Monitor Search Console performance queries.
- Monitor Core Web Vitals report once enough field data exists.
- Re-run PageSpeed after production deployment.

## 12. Acceptance Criteria

SEO strategy is ready when we agree that:

- Every page will have localized metadata.
- Every indexable page will have a self-canonical URL.
- Language alternates/hreflang will be implemented for EN/PL pairs.
- Sitemap and robots will be generated or provided statically.
- Content will use one H1 and logical section headings.
- Structured data will be limited to truthful Organization, SoftwareApplication/Product, BreadcrumbList, and optional WebSite schema.
- No fake ratings, testimonials, logos, metrics, or review schema will be used.
- SEO copy will stay people-first and aligned with approved product claims.
- Verification will use Search Console, PageSpeed/Lighthouse, and structured-data testing tools.
