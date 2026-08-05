# Step 6 — Blog on Opero (headless CMS): full implementation plan

Status: **v2, detailed** · API verified live 2026-08-05.
Decisions taken: nav = Opero · Solutions · **Blog** · Book a demo. Pagination = path-based
`/blog/page/[n]` (query-param variant is technically impossible under `force-static` layouts —
static pages cannot read search params; see §Routes).

Backend prerequisites DONE and verified:
- Webhook rule `03a65598…` pre-filled with `https://www.kodasoft.pl/api/blog/revalidate` + our
  secret, **inactive** until we deploy.
- Redirect rule `2d0b71d4…` now emits locale-prefixed paths (`'/' + jezyk + '/blog/' + slug`).
- CRON publish rule has a conditional CALL_WEBHOOK step to the same endpoint (`{"typ":"cron"}`).
- `blog_lista_artykulow` and `blog_artykuly_po_tagu` now return a `total` column;
  `blog_artykuly_po_autorze` added (returns author header data + `total`).
- `.env` (git-ignored, verified): `OPERO_API_KEY` (company-scoped), `OPERO_COMPANY_ID=b34f2d0e-9b3c-47e8-9431-b6a3c241b984`, `OPERO_REVALIDATE_SECRET`.

## 1. Verified API contract (probed live, not assumed)

- Base `https://api.kodasoft.pl`, header `Authorization: Bearer ek_…`.
- **Saved queries**: `GET /v1/saved-queries` lists `{id, key, kind, parameters}`;
  `POST /v1/saved-queries/{id}/execute` body `{"params": {…}}` (executionMode defaults to COMPANY)
  → `{ "data": { "rows": [...], "rowCount": n, "hasMore": bool } }`.
- **Record API**: `GET /v1/custom-modules/blog/objects/{objectKey}/records?filters=…&sort=…&limit=…`
  → `{ data: [ { id, createdAt, updatedAt, values: {…} } … ], meta }`;
  singleton: `GET …/objects/ustawienia/record` → `{ data: { values: {…} } }`.
- **Files**: `GET /v1/companies/{OPERO_COMPANY_ID}/files/{id}/download` — auth required (verified
  200 with token / 401 without); content-type comes from the response.
- Payload notes from the live test article: `tresc` arrives **already parsed**
  (`{ doc, format, plainText, schemaVersion, referencedFileIds, mentionRefs }`), `tagi` is a parsed
  array of `{slug, nazwa}`, `powiazane` is `null` or an array, dates are ISO strings.
- Blog query keys: `blog_lista_artykulow`, `blog_artykul_po_slug`, `blog_artykuly_po_tagu`,
  `blog_artykuly_po_autorze`, `blog_sitemap`, `blog_warianty_jezykowe`, `blog_przekierowania`.
  Never call `blog_slug_zajety` / `blog_publikuj_zaplanowane` (internal; second is a MUTATION).

## 2. Architecture

1. **Static by default, invalidated on demand.** No `cacheComponents` migration, no time-based
   revalidation. Every Opero read is wrapped in `unstable_cache` with tags; pages prerender via
   `generateStaticParams` and stay cached until the webhook fires. The existing
   `dynamic = "force-static"` on both root layouts is compatible: `revalidatePath`/`revalidateTag`
   are supported under force-static, and unknown new slugs (`dynamicParams` default true) render
   once on demand, then persist as static.
2. **Cache tag table** (every read carries `"blog"` + its specific tag):

   | Read | Specific tag |
   |---|---|
   | saved-query key→id map | `blog:querymap` |
   | article listing (all variants) | `blog:lista` |
   | article by slug | `blog:artykul:{slug}` |
   | language variants | `blog:warianty` |
   | sitemap entries | `blog:sitemap` |
   | redirects | `blog:redirects` |
   | settings singleton | `blog:settings` |
   | categories | `blog:kategorie` |

   Webhook invalidates the coarse `blog` tag (everything) + `revalidatePath` on the article URL.
   Specific tags exist so we can tighten later without touching pages.
3. **Locales pl + en only.** CMS allows `de`; every query call passes/filters `jezyk`, sitemap rows
   with other languages are dropped in code.
4. **Zero new runtime dependencies, zero new client JS.** Hand-written Tiptap walker; `.blog-prose`
   CSS on existing tokens; plain `<img>` (site already sets `images.unoptimized`).
5. **Build-time coupling accepted**: `next build` calls the live API. API unreachable ⇒ build fails
   loudly (correct for a content site; prevents shipping an empty blog).

## 3. Routes

EN tree mirrors PL; archive segments localized: `kategoria`/`category`, `autor`/`author`, `tag`/`tag`.

| URL | Data | Prerendered |
|---|---|---|
| `/{pl,en}/blog` | `blog_lista_artykulow(jezyk, limit=12)` | build |
| `/{pl,en}/blog/page/[n]` (n ≥ 2) | same + `offset_wierszy` | build; n range from `total` |
| `/{pl,en}/blog/[slug]` | `blog_artykul_po_slug` | build via `blog_sitemap`; new slugs on demand |
| `/{pl,en}/blog/kategoria|category/[slug]` | `blog_lista_artykulow(kategoria_slug)` + `kategoria` record for header/SEO | build |
| `/{pl,en}/blog/tag/[slug]` | `blog_artykuly_po_tagu` | build |
| `/{pl,en}/blog/autor|author/[slug]` | `blog_artykuly_po_autorze` | build |
| `/api/blog/revalidate` | webhook receiver | runtime |
| `/api/blog/image/[fileId]` | file proxy | runtime |
| `/blog-sitemap.xml` | `blog_sitemap` | cached, tag `blog` |

- **Why path pagination**: layouts are `force-static`; static pages get empty `searchParams`, so
  `?page=2` would render page 1. Making the listing dynamic would SSR the highest-traffic blog page
  on every request. Path segments keep every page static. Tradeoff: `page` is a reserved slug under
  `/blog/` (static segment beats `[slug]`) — implausible for transliterated Polish titles; noted.
- **Article miss flow** (`[slug]` not found): fetch cached redirect table → match
  `/{locale}/blog/{slug}` → `permanentRedirect()` for 301 / `redirect()` for 302 → else
  `notFound()` rendering `app/…/blog/not-found.tsx` (localized copy from the blog content module,
  link back to the blog index; PageShell chrome).
- **Archive miss**: empty result for unknown category/tag/author slug ⇒ `notFound()` (same page).
- Pagination page `n` beyond range ⇒ `notFound()`.

## 4. Data layer (`lib/blog/`)

All files `import "server-only"` (compile-time guarantee the token never reaches the client).

**`types.ts`** — mirrors saved-query columns exactly (Polish keys kept; no renaming layer):
```ts
export type BlogLocale = "pl" | "en";
export type ArticleListRow = { id: string; tytul: string; slug: string; jezyk: string;
  zajawka: string | null; data_publikacji: string; updated_at: string;
  obraz_glowny: string | null; obraz_alt: string | null; czas_czytania: number | null;
  wyrozniony: boolean; kategoria_slug: string | null; kategoria_nazwa: string | null;
  autor_slug: string | null; autor_nazwa: string | null; total?: number };
export type ArticleFullRow = ArticleListRow & { tresc: TiptapPayload; liczba_slow: number | null;
  meta_title: string | null; meta_description: string | null; og_image: string | null;
  canonical_url: string | null; noindex: boolean; typ_schema: "BlogPosting"|"Article"|"NewsArticle";
  autor_stanowisko: string | null; autor_avatar: string | null; autor_bio: TiptapPayload | null;
  autor_linkedin: string | null; autor_x: string | null;
  tagi: Array<{slug: string; nazwa: string}> | null;
  powiazane: Array<{slug: string; tytul: string; zajawka: string | null}> | null;
  grupa_tlumaczen: string };
export type SitemapRow = { typ: "artykul"|"kategoria"|"tag"|"autor"; slug: string;
  jezyk: string; lastmod: string; data_publikacji: string | null };
export type VariantRow = { jezyk: string; slug: string; tytul: string };
export type RedirectRow = { sciezka_z: string; sciezka_do: string; kod: "301"|"302" };
export type TiptapPayload = { doc: TiptapNode; plainText?: string; format?: string };
export type TiptapNode = { type: string; attrs?: Record<string, unknown>;
  content?: TiptapNode[]; marks?: Array<{type: string; attrs?: Record<string, unknown>}>;
  text?: string };
export type BlogSettings = { nazwa_serwisu: string; adres_bazowy: string; sufiks_title: string;
  domyslny_og_image: string | null; logo: string | null; domyslny_jezyk: string;
  artykulow_na_stronie: number; profil_linkedin: string | null; profil_x: string | null;
  profil_youtube: string | null };
export type CategoryRecord = { nazwa: string; slug: string; opis: string | null;
  meta_title: string | null; meta_description: string | null; noindex: boolean;
  pozycja: number | null; kategoria_nadrzedna: string | null };
```

**`opero.ts`** — low-level client:
- `operoFetch(path, init?)`: bearer + JSON, throws `OperoApiError(status, path, bodySnippet)` on
  non-2xx. Reads `OPERO_API_KEY` lazily (build fails with a clear message if missing).
- `getQueryIdMap()`: `unstable_cache(["blog","blog:querymap"])` over `GET /v1/saved-queries?limit=100`
  → `Record<key, id>`. Unknown key at call time ⇒ descriptive throw.
- `executeSavedQuery<T>(key, params)`: resolves id, POSTs, returns `rows as T[]`.
- `getRecords(objectKey, {filters, sort, limit})`, `getSingletonValues(objectKey)`.

**`queries.ts`** — typed cached reads (each `unstable_cache` with tags per §2):
```ts
getArticles({ jezyk, kategoriaSlug?, page }): Promise<{ rows: ArticleListRow[]; total: number }>
getArticleBySlug(slug, jezyk): Promise<ArticleFullRow | null>
getArticlesByTag(tagSlug, jezyk, page): Promise<{ rows; total; tagNazwa: string | null }>
getArticlesByAuthor(autorSlug, jezyk, page): Promise<{ rows; total; autor: {...} | null }>
getSitemapEntries(): Promise<SitemapRow[]>            // filtered to pl/en
getLanguageVariants(grupa): Promise<VariantRow[]>     // filtered to pl/en
getRedirects(): Promise<RedirectRow[]>
getSettings(): Promise<BlogSettings>
getCategories(): Promise<CategoryRecord[]>            // record API, sort pozycja asc
```
Page size: from `getSettings().artykulow_na_stronie` (currently 12), read at build/render time.

**`routes.ts`** — URL builders + segment names:
```ts
blogIndexPath(locale); blogPagePath(locale, n);           // n===1 → index
articlePath(locale, slug); categoryPath(locale, slug); tagPath(locale, slug); authorPath(locale, slug);
archiveSegments = { pl: {category: "kategoria", author: "autor"}, en: {category: "category", author: "author"} }
toBlogLocale(jezyk): BlogLocale | null                     // drops "de" etc.
sitemapRowUrl(row): string | null                          // typ+slug+jezyk → absolute URL
```

**`metadata.ts`** — the CMS fallback contract, verbatim from the handover:
| Output | Rule |
|---|---|
| title | `meta_title ?? tytul`, then append `settings.sufiks_title` (article pages use literal title, not the layout template, to avoid double suffix) |
| description | `meta_description ?? zajawka` |
| og:image | `og_image → obraz_glowny → settings.domyslny_og_image` (each via proxy, absolute) → site default `/og-image.png` |
| canonical | `canonical_url ?? absoluteUrl(articlePath(...))` |
| robots | `noindex ⇒ {index:false, follow:true}` |
| hreflang | one entry per `blog_warianty_jezykowe` row (absolute); `x-default` = en variant if present else the article's own locale |
| og:type | `article`, with `article:published_time`/`modified_time` |
Archive pages: `kategoria.meta_title/meta_description` fallbacks to name + content-module template;
category `noindex` respected. Listing/page-n: copy from content module; page-n canonical = itself,
title suffixed " — page N" (localized).

**`tiptap.tsx`** — server-only React walker.
- Nodes: `doc→fragment`, `paragraph` (drop empty trailing), `text` (marks applied innermost-out),
  `heading` level n → `h{n+1}` (cap h6), `bulletList/orderedList/listItem`,
  `taskList/taskItem` → list with disabled checkboxes, `blockquote`, `codeBlock` →
  `<pre><code data-language>`, `table/tableRow/tableHeader/tableCell` wrapped in
  `<div className="overflow-x-auto">`, `image` → `<figure><img src={proxyUrl(fileId)} alt width
  loading="lazy" decoding="async">[<figcaption>caption]</figure>` honoring `align`,
  `hardBreak` → `<br>`, `horizontalRule` → `<hr>`.
- Marks: bold→`strong`, italic→`em`, strike→`s`, underline→`u`, code→`code`, superscript/subscript,
  highlight→`mark`, textColor→`span style`, link→`<a href target rel="noopener noreferrer"(external)>`.
- Attrs: `textAlign` on paragraph/heading → inline style.
- Unknown node/mark: render children, `console.warn` once per type. Malformed payload
  (`!tresc?.doc`) ⇒ render `plainText` in paragraphs as last resort. Never throw.

## 5. Runtime routes

**`app/api/blog/revalidate/route.ts`**
- `POST` only. Secret check: `crypto.timingSafeEqual` on utf8 buffers (length-equalized);
  mismatch/absent ⇒ `401 {}` with no detail. Body parsed leniently
  (`{id?, typ?, slug?, jezyk?, status?}` — CRON sends only `{typ:"cron"}`).
- Actions: always `revalidateTag("blog")`; if `slug` present, `revalidatePath` for that locale's
  article path (both locales if `jezyk` missing). Response `200 {revalidated: string[], now: ISO}`.
- No GET handler (nothing to probe).

**`app/api/blog/image/[fileId]/route.ts`**
- Validate `fileId` against `/^[a-z0-9-]{10,40}$/i` ⇒ else 400.
- Fetch `files/{fileId}/download` with bearer; upstream 404/403 ⇒ 404; other errors ⇒ 502.
- Stream body; passthrough `Content-Type`/`Content-Length`;
  `Cache-Control: public, max-age=0, s-maxage=31536000, stale-while-revalidate=86400` (CDN takes
  the load; origin hit is rare). File ids appear immutable per upload but unconfirmed — hence SWR
  rather than `immutable`.

**`app/blog-sitemap.xml/route.ts`**
- `GET`; builds `<urlset>` from `getSitemapEntries()` via `sitemapRowUrl` (drops `de`, unknown
  types), `<lastmod>` from `lastmod`. Wrapped in a `unstable_cache` tag `blog` so the webhook
  refreshes it. `Content-Type: application/xml`.

## 6. Pages & components (design)

Quality bar = homepage/solutions: editorial, bordered, restrained. **No card grids, no list
thumbnails, no decorative elements.** All Server Components; the only client code on blog pages is
the existing header/menu/switcher.

**Shared components (`components/blog/`)**
- `BlogListPage.tsx` — layout for index/page-n/category/tag/author: dark `--gradient-hero` header
  band (shorter than solutions hero: eyebrow + `h1` + description), then the list section
  (`--shell-width` shell, `--section-y` rhythm). Props: `{locale, ui, heading: {eyebrow, title,
  description?}, rows, total, page, basePath, emptyMessage}`.
- `ArticleRow.tsx` — border-top row: meta line (date `toLocaleDateString(locale)` + category link,
  eyebrow style), title `h3` ~1.7rem medium linking to article, zajawka (body class), meta
  (author link · `czas_czytania` min). `wyrozniony` ⇒ small uppercase label in `--color-blue`.
- `Pagination.tsx` — bordered prev/next buttons + numbered links (current = filled), built on
  `--radius-button` and existing hover idioms; hidden when total ≤ pageSize.
- `ArticlePage.tsx` — narrow column (`max-w-[760px]` header, `72ch` prose): category+date eyebrow,
  `h1` (~3.2rem ramp, mobile 2.1), zajawka lead, author line (avatar 40px rounded-full via proxy,
  name → author page, stanowisko) + reading-time badge; `obraz_glowny` full column width in a
  fixed `aspect-[16/9]` bordered box, `object-cover`, `fetchpriority="high"` (LCP), alt from
  `obraz_alt`; then `.blog-prose` body; then `TagChips`, `RelatedList` (`powiazane`), `AuthorBox`
  (avatar, bio rich text, LinkedIn/X links with icons already in lucide), final CTA reusing the
  bordered centered final-CTA pattern (copy from content module, links to contact page).
- `AuthorBox.tsx`, `TagChips.tsx`, `RelatedList.tsx` — bordered-list styling per `DetailList`.
- Updated date shown when `updated_at` − `data_publikacji` > 24h ("Updated {date}" localized).

**Page files** — thin wrappers per locale (pattern identical to existing pages): fetch, 404/redirect
handling, `generateMetadata`, `generateStaticParams`, render shared component inside `PageShell`.
`generateStaticParams` sources: articles/categories/tags/authors from `getSitemapEntries()` (per
locale); page-n from `ceil(total / pageSize)`.

**`.blog-prose` (globals.css)** — token-based: headings ramp (h2 1.9rem/medium → h4), paragraphs
`1.04rem` light `--color-muted` line-height 1.7 (matching `bodyClass`), links `--color-blue`
underlined, lists with existing marker spacing, blockquote left-border `--color-border-light`
italic, `pre` on `--color-ink` bg white text radius `--radius-card` with x-scroll, inline `code`
soft-bg pill, tables per the solutions pattern-table look, `figure` margins + caption
`0.85rem --color-muted`, `hr` border-light, images `max-width:100%; height:auto;
border-radius: var(--radius-card)`.

## 7. Integration changes to existing files

| File | Change |
|---|---|
| `lib/i18n/routes.ts` | `PageKey += "blog"`; `pageSlugs.blog = "blog"`; `pageKeys` gains "blog" (auto-ripples into `routeMap`/`sitemapRoutes` in `lib/seo/site.ts`) |
| `content/types.ts` | add `BlogUiContent` (index hero eyebrow/title/description; labels: featured, minRead, published, updated, tags, related, aboutAuthor, allArticles, page, previous/next, emptyState, categoryEyebrow, tagEyebrow, authorEyebrow, notFound {title, description, backLabel}, cta {eyebrow,title,description,primary,secondary}); `SeoContent` reused |
| `content/en/blog.ts`, `content/pl/blog.ts` | UI copy, EN + PL, per `$translations` conventions (server-side typed modules) |
| `content/{en,pl}/common.ts` | nav gains `{ page: "blog", label: "Blog" }` after solutions (PL label also "Blog") |
| `components/layout/PageShell.tsx` → `SiteHeader`/`SiteFooter` → `LanguageSwitcher` | optional `alternatePaths?: Record<Locale, string>` threaded through, default `getAlternatePaths(page)`. Article pages pass translated-slug paths (from `blog_warianty_jezykowe`) so the visible switcher matches emitted hreflang; archives pass their own localized paths. Non-breaking. |
| `app/globals.css` | `.blog-prose` block |
| `next-sitemap.config.js` | add `/en/blog` + `/pl/blog` entries with alternates (marketing sitemap keeps only the static indexes; all dynamic URLs live in blog-sitemap.xml) |
| `app/robots.ts` | `sitemap: [absoluteUrl("/sitemap.xml"), absoluteUrl("/blog-sitemap.xml")]` |
| `lib/seo/json-ld.tsx` | add `ArticleJsonLd` (`@type` from `typ_schema`; headline, description, image, datePublished/dateModified, author `Person` {name, url: author page, sameAs: linkedin/x}, publisher `Organization` reusing existing org data, mainEntityOfPage, inLanguage) |
| `scripts/quality-nonvisual.mjs` | add `/en/blog` + `/pl/blog` page entries (canonical, hreflang pair, single h1, description, og). Article HTML not asserted (slugs are content, test article may be deleted) |

## 8. Edge cases & failure matrix

| Scenario | Behavior |
|---|---|
| Opero down during `next build` | build fails with `OperoApiError` (path + status in message) |
| Opero down at runtime (uncached new slug) | request 500s; cached pages unaffected. Acceptable: only affects never-rendered paths |
| Article unpublished / drafted back | webhook fires (status ≠ opublikowany) ⇒ tag purge; listings drop it; article path re-renders ⇒ query returns 0 rows ⇒ redirect-check ⇒ 404 |
| Slug renamed | CMS auto-creates 301 + webhook fires; old path re-renders ⇒ redirect hit ⇒ `permanentRedirect` |
| Scheduled publish | CRON flips status + pings webhook (`typ:"cron"`) ⇒ tag purge; article page renders on first visit (dynamicParams). Up to 10 min late by design |
| Article with no translation | `warianty` returns only itself ⇒ hreflang self + x-default; switcher falls back to blog index for the other locale |
| `de` article published | excluded everywhere (sitemap filter, listing param `jezyk`) |
| Missing/failed image | proxy 404s; `<img alt>` still meaningful; no layout shift (fixed aspect box) |
| Malformed `tresc` | plainText fallback rendering (never a crash) |
| Webhook replay/flood | idempotent revalidation; no auth-bypass surface; 401 on bad secret with constant-time compare |
| Redirect loop in CMS data | `redirect()` targets are emitted as-is; loops would be CMS data bugs — detected in the smoke test, not guarded in code |

## 9. Deployment & rollout sequence

1. Implement + verify locally (§10).
2. **Add env vars to Vercel project** (production + preview): `OPERO_API_KEY`,
   `OPERO_COMPANY_ID`, `OPERO_REVALIDATE_SECRET`. (Without them the deploy build fails.)
3. Deploy. Verify on production: blog routes, image proxy, `blog-sitemap.xml`, robots.
4. Manual webhook drill against production URL (bad secret ⇒ 401; good secret ⇒ 200).
5. Tell backend to **activate rule `03a65598…`** (config already filled).
6. End-to-end: edit test article in Opero ⇒ confirm page updates within seconds.
7. Watch first Vercel build times; blog adds ~1 req/query — negligible at current volume.

## 10. Verification (in order, all must pass)

1. `npm run quality:precommit` (typegen, tsc, eslint).
2. `npm run build` (live API; static params; next-sitemap postbuild) then
   `npm run quality:nonvisual` with the new blog entries.
3. Preview server (`npm run preview`): manually exercise `/pl/blog`,
   `/pl/blog/blog-headless-na-opero`, `/en/blog` (empty state — no EN article exists),
   category/tag/author archives, `page/2` (404 while only 1 article), a bogus slug (404 page),
   the redirect row from the CMS slug-rename test, `blog-sitemap.xml`, author avatar via proxy.
4. Webhook drill on local: wrong secret 401, right secret 200 + subsequent request re-renders.
5. `npm run quality:lighthouse` — `/pl/blog` + article; Core Web Vitals must stay green;
   regressions are blockers.
6. Visual review pass (screenshots via preview tooling) since this adds whole new page types.

## 11. Deliberately deferred (raise before building if wanted now)

Draft preview (`draftMode()` + record API + separate secret), RSS/Atom, image resizing (proxy
serves originals; editorial guidance ≤1600px; add resize/loader later if Lighthouse complains),
`de` locale, category tree menus (flat category links only in v1), search.
