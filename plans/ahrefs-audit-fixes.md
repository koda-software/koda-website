# Ahrefs Site Audit — fix plan

Source: Ahrefs Site Audit, project "Kodasoft" (www.kodasoft.pl), crawl of 2026-10-30.
22 active issue types, 754 crawled URLs. Items are ordered by impact; each lists
the cause, where it lives in the repo, the fix, and how to verify it.

## Summary

| # | Issue (Ahrefs) | Count | Severity | Where | Effort |
|---|---|---|---|---|---|
| 1 | 404 page / links to broken page | 78 pages, 94 links | Error | `content/docs/{en,pl}/api/**` | M |
| 2 | Multiple H1 tags | 24 | Warning | `content/docs/**/*.mdx` | S |
| 3 | Structured data rich-results error | 2 | Error | `lib/seo/json-ld.tsx` | S |
| 4 | JavaScript broken | 2 | Error | stale deploy chunks | none |
| 5 | Links to redirect + nofollow internal links | 2 + 2 | Warning | blog author data / `components/blog/AuthorBox.tsx` | S |
| 6 | 3XX / HTTP→HTTPS / redirect chain | 4 / 2 / 1 | Warning | Vercel domain settings | S (dashboard) |
| 7 | Indexable page not in sitemap / page in multiple sitemaps | 2 / 2 | Notice | `app/*sitemap.xml/route.ts` | S |
| 8 | Article page missing Article schema | 11 | Notice | docs layout + key landing pages | M |
| 9 | Title too long / SERP title mismatch | 28 / 1 | Notice | `lib/seo/site.ts`, blog/API titles | M |
| 10 | Meta description too long / too short | 131 / 127 | Notice | API page generator, docs frontmatter, blog CMS | M |
| 11 | Open Graph tags incomplete | 400 | Notice | `app/(docs)/docs/[locale]/…` | S |
| 12 | Only one dofollow incoming internal link | 18 | Notice | blog pagination, deep docs | S |
| — | robots.txt disallows crawl (`opero.kodasoft.pl`) | 1 | — | app subdomain | ignore |

## Phase 1 — Errors

### 1. Broken links to non-existent API pages (78 × 404, 94 links)

**Status: fixed (not yet deployed).** `checkLinks` in `scripts/docs/lib/content.mjs` now fails the
build on any `/docs/...` link to a page that doesn't exist. It found 134 such links (the same 78
targets). 118 endpoint names were unlinked and kept as inline code. 16 "Related pages" bullets were
pointed at existing pages or removed. The snapshot was re-accepted, and only those 22 manual pages changed.

**Cause.** Hand-written intro/overview pages link to API operation slugs that were never
generated (or were renamed when the API pages were trimmed to their own operations).
Confirmed live: e.g. `/docs/en/api/rules/create-rule`, `/docs/pl/api/queries/validate-query`,
`/docs/en/api/view-layout-runtime` all return 404.

**Source files (both `en` and `pl`):**
- `content/docs/*/api/rules/introduction.mdx` — links to `create-rule`, `update-rule`, `delete-rule`,
  `get-rule-builder-config`, `search-rule-step-types`, `list-rule-entity-fields`,
  `list-rules-related-to-custom-{field,object,module}`, `get-rule-context-schema`,
  `compute-rule-context-schemas`, `validate-rule-script`. Only `execute-rule`, `get-rule`,
  `list-rules`, `get-rule-execution`, `list-rule-executions` and the manual-invocation pages exist.
- `content/docs/*/api/queries/introduction.mdx` — `create-query`, `update-query`, `delete-query`,
  `validate-query`, `get-query-schema` don't exist (only `execute-query`, `get-query`,
  `list-queries`, `post-saved-queries-id-execute-mutation`).
- `content/docs/*/api/view-layout-configuration/{overview,building-layouts,discovering-blocks,block-types}.mdx`
  — links to `create-view-layout`, `update-view-layout`, `publish-view-layout`,
  `save-view-layout-draft`, `get-view-layout-version`, `list-view-layout-versions`,
  `get-view-layout-block-catalog`, `get-view-layout-custom-field-type-schemas`,
  `get-view-layout-surface-{definitions,capabilities}`, and the section root `/view-layout-configuration`.
- `content/docs/*/api/view-layout-runtime/runtime.mdx` and `custom-object-forms/{runtime,management,view-layouts}.mdx`
  — links to `resolve-view-layout`, `resolve-relation-table-target-layout`,
  `get-relation-table-row-layout-data`, `query-relation-table-rows-through-view-layout`,
  `{create,update}-dynamic-record-through-view-layout`, `get-view-layout-runtime-context-variables`,
  and the section root `/view-layout-runtime`.
- `content/docs/*/api/custom-object-forms/*` — `create-custom-object-form`.
- `content/docs/*/api/workflows/introduction.mdx` — `/docs/*/opero/people-and-access/api-tokens`
  (no such page; user docs use numbered Polish folders like `01-wprowadzenie`).

**Fix.**
1. Write a small checker (`scripts/check-docs-links.ts`) that collects every `](/docs/...)` link in
   `content/docs/**` and fails if the target isn't a generated route. Run it in `prebuild`/CI so this
   can't regress.
2. For each broken link decide per endpoint:
   - the operation exists in the OpenAPI spec under another slug → repoint the link;
   - it isn't in the public spec → turn the link into plain inline code (`` `POST /v1/rules` ``)
     or drop the row.
3. Section roots (`/api/view-layout-runtime`, `/api/view-layout-configuration`) → link to the
   section's first page (`…/runtime`, `…/overview`), or add an `index.mdx`.
4. API tokens link → point at the real user-docs page about tokens, or at `/docs/*/api/authentication`.

**Verify.** Checker passes; `curl` the former targets → no internal links to them remain;
re-crawl in Ahrefs shows 0 × 404.

### 2. Multiple H1 tags (24 docs pages)

**Status: fixed (not yet deployed).** Removed the leading `# …` from all 24 manual pages. The same
content check now fails the build on any body H1 outside code blocks. Follow-up for #9: six pages
are now headed only by a generic title ("Introduction", "Overview", "Runtime Guide" and the PL
equivalents) where the removed heading said "Rules", "Queries", "Workflows", "View Layouts" or
"View Layout Runtime". Consider more specific frontmatter titles for them.

**Cause.** These MDX files start with `# Heading` while the docs page template already renders
the frontmatter title as `<DocsTitle>` (H1). Exactly 24 files under `content/docs` start a line with `# `.

**Fix.** Remove the leading `# …` line from each (or demote to `##` where it differs from the title,
e.g. `workflows/introduction` "Introduction" + "Workflows"). Add the "no `# ` in MDX body" rule to the
link checker from #1.

**Verify.** `grep -rlE "^# " content/docs` → empty; built pages have one `<h1>`.

### 3. SoftwareApplication schema fails Google rich results (`/en/opero`, `/pl/opero`)

**Status: fixed (not yet deployed).** The site publishes no price, free tier or reviews, so the Software
App rich result can't be satisfied honestly. `SoftwareApplicationJsonLd` became `OperoServiceJsonLd`, a
`Service` whose `hasOfferCatalog` lists the capabilities in the page's language. `scripts/quality-nonvisual.mjs`
now asserts the Service markup and rejects `SoftwareApplication`. Re-check with Google's Rich Results Test
after deploy.

**Cause.** `SoftwareApplicationJsonLd` in `lib/seo/json-ld.tsx` has no `offers` and no
`aggregateRating`/`review`; Google requires `offers` plus one of the rating fields for the
Software App rich result.

**Fix (pick one).**
- Add `offers: { "@type": "Offer", price: "0", priceCurrency: "PLN", availability: "https://schema.org/InStock" }`
  only if that's truthful (e.g. a free demo/trial) — and no fake ratings.
- Otherwise switch the type to `Product`/`WebApplication` without claiming rich-result eligibility, or
  accept the warning. Don't invent reviews.

**Verify.** Google Rich Results Test on both URLs.

### 4. JavaScript broken (2 chunks)

**Status: no action needed.** Re-check on the next crawl.

`_next/static/chunks/webpack-21a6d….js` and `4595-871365….js` returned 404 because a deploy
happened mid-crawl; the live site now serves different hashes. **No action** — confirm it's gone on
the next crawl.

## Phase 2 — Warnings

### 5. Blog author pages link to `https://kodasoft.pl/` (redirect, nofollow)

**Status: fixed in code (not yet deployed).** `AuthorLinks` now renders an author "www" on our own domain
(apex, www, or `NEXT_PUBLIC_SITE_URL`) as a same-site `next/link` path such as `/`, with no `nofollow` or
`_blank`. External sites keep the old attributes. The CMS record can stay as it is.

**Cause.** The author's `www` field from the blog CMS is `https://kodasoft.pl/` (apex, no `www`),
rendered in `components/blog/AuthorBox.tsx` with `rel="… nofollow"`. On
`/en/blog/author/konrad` and `/pl/blog/autor/konrad`.

**Fix.** Update the author record in Opero to `https://www.kodasoft.pl/`, and in `AuthorBox` drop
`nofollow`/`target=_blank` when the URL is on our own host (normalise apex → `www`).

### 6. Apex domain redirects (Vercel settings, not code)

**Status: fixed (2026-10-30).** In Vercel the `kodasoft.pl` → `www.kodasoft.pl` redirect is now 308 Permanent,
and `curl -sI https://kodasoft.pl/` returns 308. `http://` → `https://` stays a separate first hop, because
Vercel always does that one itself.

- `https://kodasoft.pl/` → `https://www.kodasoft.pl/` is **307** (temporary) → make it **308**.
- `http://kodasoft.pl/` → `https://kodasoft.pl/` → `https://www.` is a 2-hop chain → set the apex
  domain in Vercel to "Redirect to www.kodasoft.pl (308)" so http goes straight to `https://www`.
- `https://kodasoft.pl/robots.txt` → 307 is the same rule.

**Verify.** `curl -sI http://kodasoft.pl/` → single 308 to `https://www.kodasoft.pl/`.

## Phase 3 — Notices

### 7. Sitemaps

**Status: fixed in code (not yet deployed).** `app/sitemap.xml/route.ts` no longer lists `/en/blog` or `/pl/blog`
(28 URLs, down from 30). `app/blog-sitemap.xml/route.ts` now adds `/{locale}/blog/page/2..n`, counted from
the same list query the index renders. `next-sitemap.config.js` and `scripts/quality-nonvisual.mjs` were updated
to match. The blog sitemap output wasn't checked locally because the CMS key has expired. `next-sitemap` has
also been removed (postbuild step, config, dependency, gitignore entry). Production already served the route, and the
quality script now checks the route's output instead of the old `public/sitemap.xml`.

- `/en/blog/page/2`, `/pl/blog/page/2` are indexable but in no sitemap → add paginated index pages
  to `app/blog-sitemap.xml/route.ts` (or `noindex,follow` them — pick one policy).
- `/en/blog`, `/pl/blog` appear in two sitemaps (marketing `app/sitemap.xml` and `blog-sitemap.xml`)
  → keep them only in `blog-sitemap.xml`, as that file's header comment intends.

### 8. Article schema missing (11 pages)

**Status: docs fixed (not yet deployed).** Every docs page now outputs `TechArticle` JSON-LD through the
shared `ArticleJsonLd`. That component now accepts `TechArticle`, and its dates are optional. Docs have no
reliable per-page dates, so none are invented. Not done: the 3 marketing feature pages Ahrefs also listed
(`/pl/opero/bezpieczenstwo-uprawnienia`, `/en/opero/security-permissions`, `/pl/opero/low-code-automatyzacje`).
They already have FAQ and breadcrumb schema, and they're product pages, not articles.

Ahrefs classifies `/docs/{en,pl}`, `/docs/*/api`, `/docs/*/getting-started`, `/docs/*/opero`, and the
`/opero/*` security / low-code feature pages as articles. Add a `TechArticle` JSON-LD
(headline, description, inLanguage, dateModified, author/publisher = KodaSoft) in the docs
`[[...slug]]/page.tsx`. For the marketing feature pages, optional — `WebPage` is fine.

### 9. Titles too long (28) and SERP mismatch (1)

**Update (CMS done):** All blog `meta_title` values are now 60 characters or less in EN and PL. That covers
13 values, including the six listed below, edited in Opero.

**Status: partly fixed (not yet deployed).** Decision: keep " | Opero by KodaSoft" on every page and
accept Ahrefs' length notices that the suffix causes. A live count found 66 titles over 60 characters;
in 60 of them the suffix is what makes them too long.
- Done: `withoutBrandSuffix` (`lib/seo/site.ts`), applied in `createBlogMetadata`, removes a brand ending that
  editors already typed. Two CMS meta titles ended in "| Opero", which gave "| Opero | Opero by KodaSoft".
- Done: the generic docs titles were renamed in EN and PL (rules, queries and workflows intros, the view-layouts
  overview and the runtime guide), e.g. "Rules API introduction" / "Wprowadzenie do API reguł".
- Left for the CMS (over 60 even without the suffix; shorten `meta_title` in Opero):
  `/pl/blog/automatyzacja-regulami-w-opero` (75), `/en/blog/what-happens-when-a-client-asks-to-change-one-number` (74),
  `/en/blog/process-instead-of-status-field` (66), `/en/blog/spreadsheet-as-a-company-register` (65),
  `/en/blog/e-delivery-obligation-october-2026` (62), `/en/blog/category/opero-platform` (61).
- Left as is: `/docs/pl/api/companies/post-companies-companyid-forms-formid-relation-tables-table-layout` (58 without
  " | Opero Docs"). Its title comes from the generated OpenAPI summary, so it should be changed in the API spec.

- Most are blog posts and long API operation names plus the `" | Opero by KodaSoft"` suffix
  (`lib/seo/site.ts` `titleSuffix`).
- Fix: cap the rendered title at ~60 chars — when `title + suffix` is too long, fall back to
  `" | Opero"` or drop the suffix; shorten the longest blog titles' SEO title in the CMS.
- Google already rewrites `/en/opero/document-management` to "… | Opero" — consistent with the above.

### 10. Meta descriptions — 131 too long, 127 too short

**Status: fixed in code (not yet deployed).**
- The API page generator (`scripts/docs/lib/api-page-description.mjs`) tries three templates in order:
  route plus "authentication", then route only, then method only. It uses the first one that fits in 155
  characters. It rebuilds descriptions it wrote before and leaves hand-written ones alone. All API pages
  are now 160 characters or less. 17 pages with very short titles come out at 101–108 characters.
- 42 hand-written docs pages (EN + PL) have new descriptions of 110–155 characters. They cover the
  landing pages, getting-started, authentication, language, open-api, the rules, queries and workflows
  intros, custom-object-forms and all View Layout guides. The `/docs/*/opero` index text now comes from
  `generate-opero-docs.ts`.
- Docs `generateMetadata` passes descriptions through `metaDescription()` (`lib/docs/site.ts`). It cuts
  knowledge-base summaries of up to 203 characters at a word boundary at 160. The page body still shows
  them in full.
- `/opero/no-code` is now 146 characters (EN) and 139 (PL). `/en/opero` went from 108 to 136.
- API pages now have five description templates, longest first. Every API page is 110–160 characters.
- Blog: 21 article `meta_description` values over 160 were rewritten in Opero (EN + PL). `truncate` in
  `lib/blog/metadata.ts` used to cut at 320; it now cuts at 160 at a word boundary, as a safety net.
- Tag, category and author pages: the CMS text is kept. When it is under 110 characters, the page adds the
  template sentence and/or a new `descriptionTopics` line (`content/{en,pl}/blog.ts`), whichever reaches
  110–160 (`describe()` in `lib/blog/page-meta.ts`).
- Left: EN `/docs/en/opero/*` pages carry Polish descriptions because the knowledge base has only Polish
  summaries. Fixing that needs EN knowledge-base summaries.

- **Too long:** generated API operation pages ("Create a resend draft … The POST /v1/companies/{companyId}/… endpoint of the Opero API: parameters, responses and code examples.") and `/opero/no-code`.
  Fix: in the API page generator, drop the full path from the description (use summary +
  "Opero API reference: parameters, responses, examples."), and trim to ≤155 chars.
- **Too short:** docs landing pages (`/docs/{en,pl}`, getting-started, language, open-api,
  authentication), `/docs/*/opero`, blog author bios, category pages, workflows intro.
  Fix: write 120–155-char descriptions in the MDX frontmatter / CMS for these (EN + PL).

### 11. Open Graph incomplete (400 docs pages)

**Status: fixed (not yet deployed).** Docs pages and the docs layout now include `og:image` (the site-wide
1200×630 `/og-image.png`, as `docsOgImage` in `lib/docs/site.ts`) and a `summary_large_image` Twitter card.
A docs-specific card with the Opero cube would be a later design task.

Docs pages have `og:type/site_name/url/description/title` but **no `og:image`**. Set a default docs
OG image in `app/(docs)/docs/[locale]/layout.tsx` metadata (reuse `siteConfig.defaultOgImage`, or a
docs-specific one compressed with `tools/get-low`). Also add `twitter:card`.

### 12. Pages with only one dofollow internal link (18)

**Status: fixed in code (not yet deployed).** The 18 pages were 14 tag pages, two blog `page/2` pages and
`/docs/{en,pl}/api/entity-fields/get-entity-fields`.
- Tag pages: the blog index and its pagination pages now list every tag (`TagChips` under the pagination).
  Each tag page is now linked from the index as well as from its article(s).
- entity-fields: linked from the View Layout custom-fields guide ("Add existing fields"), EN + PL. The docs
  sidebar only renders the open folder, so a single-page folder had no other link.
- Blog `page/2`: left as is. With two pages, only page 1 links to page 2. A third page will add a second link.
- Found in passing: tag slugs `wdrozenia` and `firmy-uslugowe` each have two Opero records. Articles use only
  the newer ones (`37b25617…`, `997cd6a1…`). The tag list and the blog sitemap now drop duplicates by slug.
  The unused records `2549c18d…` and `7e80f24f…` can be deleted in Opero. The "Low-Code i No-Code" category description typo
  ("rozwiązać") is fixed in Opero.

Mostly blog `page/2` and deep docs pages. Will mostly resolve after #1 and #7; additionally link
related API pages from their section intro and add prev/next pagination links on the blog index.

## Out of scope / ignore

- `opero.kodasoft.pl/robots.txt` disallows everything — that's the app subdomain; intentional.
- LinkedIn link returns 999 to bots — normal.

## Order of work

1. #1 broken links + link checker in CI (largest error count).
2. #2 H1s, #3 schema, #5 author link — quick code fixes.
3. #6 Vercel domain redirect (dashboard, needs account access).
4. #11 OG image, #7 sitemaps, #8 TechArticle schema.
5. #9 titles and #10 meta descriptions (copy work, EN + PL — use the `translations` skill).
6. Deploy, then run a new Ahrefs crawl and compare against this baseline (22 issues).
