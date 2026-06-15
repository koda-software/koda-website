# Step 5.5: Implementation Prerequisites

Purpose: prepare the technical scaffolding for localisation, SEO, performance, and shared layout before building the real homepage. This keeps Step 6 focused on the business homepage itself: copy, visuals, sections, and conversion.

This step should not build the final homepage design. It should create the foundation that makes the homepage safe to implement.

## Inputs

This step depends on approved planning docs:

- `plans/step-3-brand-primitives.md`
- `plans/step-4-content-system.md`
- `plans/step-4.5-localisation.md`
- `plans/step-4.6-seo-strategy.md`
- `plans/step-5-performance-ssg-architecture.md`

## Scope

Included:

- Locale config and URL helpers.
- Route/section-scoped content dictionary structure.
- SEO metadata helpers and route map.
- Sitemap/robots scaffolding.
- JSON-LD helper scaffolding.
- Font setup and CSS variable baseline.
- Shared page shell primitives.
- Static export and client-bundle guardrails.
- Basic placeholder pages only where needed to validate routing.

Excluded:

- Final homepage visual design.
- Final homepage section implementation.
- Final Polish marketing translation refinement.
- Supporting pages beyond minimal placeholders.
- Analytics scripts.
- External contact form integration.
- Dynamic OG image generation.

## 1. Localisation Scaffold

Create locale primitives:

```text
lib/i18n/config.ts
lib/i18n/routes.ts
```

Required exports:

- `locales = ['en', 'pl'] as const`
- `type Locale`
- `defaultLocale = 'en'`
- `type PageKey = 'home' | 'opero' | 'solutions' | 'about' | 'contact'`
- `localizePath(locale, pageKey)`
- `getAlternatePaths(pageKey)`
- `getPageKeyFromPath()` only if useful later

URL behavior:

- `localizePath('en', 'home')` -> `/`
- `localizePath('pl', 'home')` -> `/pl`
- `localizePath('en', 'opero')` -> `/en/opero`
- `localizePath('pl', 'opero')` -> `/pl/opero`

Create content folders:

```text
content/en/common.ts
content/en/home.ts
content/pl/common.ts
content/pl/home.ts
```

Optional placeholders for future pages:

```text
content/en/opero.ts
content/en/solutions.ts
content/en/about.ts
content/en/contact.ts
content/pl/opero.ts
content/pl/solutions.ts
content/pl/about.ts
content/pl/contact.ts
```

Rules:

- Do not create a single global `messages/en.json` blob.
- Do not pass full dictionaries into Client Components.
- Shared components receive only the content slice they render.
- Client leaf components receive only exact labels/links needed.

## 2. SEO Scaffold

Create SEO helpers:

```text
lib/seo/site.ts
lib/seo/metadata.ts
lib/seo/json-ld.tsx
```

`site.ts` should define:

- site name: `Koda Soft`
- product name: `Opero`
- production URL confirmed as `https://www.kodasoft.pl`
- default social image path placeholder
- route map for all launch pages

`metadata.ts` should provide helpers for:

- canonical URL generation
- language alternates generation
- Open Graph locale mapping
- per-page metadata object creation

Required metadata behavior:

- `/` canonical is `/`.
- `/pl` canonical is `/pl`.
- `/en/opero` canonical is `/en/opero`.
- homepage alternates: `en -> /`, `pl -> /pl`, `x-default -> /`.
- non-homepage alternates: `en -> /en/{slug}`, `pl -> /pl/{slug}`, `x-default -> /en/{slug}`.

`json-ld.tsx` should prepare helpers/components for:

- `Organization`
- `WebSite`
- `BreadcrumbList`
- future `SoftwareApplication` on Opero page

Rules:

- JSON-LD must be rendered server-side/static.
- Do not include fake reviews, ratings, prices, or unsupported sameAs links.
- Keep structured data truthful and minimal.

## 3. Sitemap And Robots Scaffold

Create either Next metadata files or static equivalents, as long as static export works:

```text
app/robots.ts
app/sitemap.ts
```

or static files if simpler:

```text
public/robots.txt
public/sitemap.xml
```

Preferred first attempt:

- Use `app/robots.ts` and `app/sitemap.ts` if `next build` with `output: "export"` emits correct static files.
- If static export or localized alternates are awkward, use static files generated from the route map later.

Sitemap must include:

```text
/
/pl
/en/opero
/pl/opero
/en/solutions
/pl/solutions
/en/about
/pl/about
/en/contact
/pl/contact
```

Robots must:

- allow production crawling
- point to sitemap
- not block `_next`, CSS, JS, images, fonts, or public assets

## 4. Font And Global CSS Scaffold

Update font setup:

- Use `next/font`.
- Prefer `Geist` and optionally `Geist Mono`.
- Apply font classes/variables in `app/layout.tsx`.
- Remove scaffold font fallback mismatch from `globals.css`.

Update global CSS:

- Add color variables from Step 3.
- Add layout variables: shell width, section spacing, radii, borders.
- Add base typography styles.
- Remove automatic dark-mode theme inversion from scaffold unless intentionally needed.
- Keep CSS small and static.

Required CSS variable groups:

- colors
- typography
- spacing
- radii
- borders
- shadows/gradients if needed

Do not add:

- CSS animation framework
- global scroll behavior hacks
- heavy backdrop-filter defaults
- canvas/video effects

## 5. Shared Shell Scaffold

Create shared components without final homepage design:

```text
components/layout/SiteHeader.tsx
components/layout/SiteFooter.tsx
components/layout/PageShell.tsx
components/layout/LanguageSwitcher.tsx
```

Rules:

- Components should be Server Components by default.
- Header/footer receive `locale` and localized nav links from helpers/content.
- Navigation uses real links.
- Language switcher uses real equivalent localized links.
- Mobile nav should remain static/simple if possible.
- If mobile nav requires interactivity, make only that leaf a Client Component and pass only exact labels/links.

Header nav:

- Opero
- Solutions
- About
- Book a demo

Footer nav:

- Opero
- Solutions
- About
- Contact
- Language switch links

## 6. Route Scaffold

Create route files for the launch URL contract.

Required now:

```text
app/page.tsx
app/pl/page.tsx
```

Recommended placeholders now so routing, sitemap, metadata, and language switcher can be validated:

```text
app/en/opero/page.tsx
app/en/solutions/page.tsx
app/en/about/page.tsx
app/en/contact/page.tsx
app/pl/opero/page.tsx
app/pl/solutions/page.tsx
app/pl/about/page.tsx
app/pl/contact/page.tsx
```

Placeholder rules:

- Clearly mark supporting pages as placeholders if created.
- Include minimal localized title and CTA/link back home.
- Do not present unfinished pages as final marketing pages.
- Keep `noindex` decision for placeholders open. If these are deployed before final content, they should not be indexed.

Alternative:

- Only create `/` and `/pl` now, and add supporting routes in Step 7.
- If choosing this, sitemap must only include actually generated pages until the supporting pages exist.

Recommended:

- Create route scaffolds with minimal placeholders only if they are needed to test navigation and alternates.
- Before production launch, either complete them or remove/noindex them.

## 7. Content Types

Create shared TypeScript types for content shape:

```text
content/types.ts
```

Suggested types:

- `NavItem`
- `SeoContent`
- `PageContent`
- `HomeContent`
- `CtaContent`
- `FeaturePillar`
- `UseCaseCard`

Rules:

- Types should keep content structured and reusable.
- Avoid over-engineering a CMS-like model.
- Keep content importable directly by Server Components.

## 8. Static Export Guardrails

Add or verify these constraints:

- Keep `next.config.ts` with `output: "export"`.
- Keep `images.unoptimized: true` unless a static-compatible image strategy is chosen.
- Do not add middleware/proxy.
- Do not add `app/api/*` routes for launch.
- Do not add Server Actions.
- Do not add runtime request headers/cookies dependencies.
- Do not add Framer Motion, GSAP, smooth-scroll, canvas/WebGL, or large client-only packages.

Suggested manual check after implementation:

```bash
find app -path '*/api/*' -o -name 'middleware.*' -o -name 'proxy.*'
rg "use server|headers\(|cookies\(|NextIntlClientProvider|messages=\{|framer-motion|gsap|smooth-scroll" app components lib content
```

## 9. Verification Scripts And Commands

Existing scripts:

- `npm run lint`
- `npm run build`
- `npm run preview`

Optional later script additions:

- `check:static` for guardrail grep checks.
- `analyze` if bundle size becomes suspicious.

Step 5.5 verification commands:

1. `npm run lint`
2. `npm run build`
3. Confirm `out/` contains `/index.html` and `/pl/index.html` at minimum.
4. If placeholders are created, confirm `out/en/...` and `out/pl/...` exist.
5. Inspect generated HTML for correct `lang`, metadata, canonical, and alternates.
6. Confirm no full translation dictionaries are passed to Client Components.
7. Confirm no middleware/API/server actions were introduced.

## 10. Handoff To Homepage Implementation

After Step 5.5, Step 6 should only need to focus on:

- replacing placeholder homepage content with final sections
- implementing the approved Stellr-inspired visual system
- building the CSS/SVG/HTML hero system map
- refining responsive layout
- validating desktop/mobile and CWV

Homepage implementation should not need to invent:

- route mapping
- locale rules
- metadata helpers
- sitemap routes
- shell structure
- font setup
- global tokens
- translation storage

## Step 5.5 Acceptance Criteria

Step 5.5 can be considered ready when we agree that the implementation should create:

- locale config and URL helpers
- route/section-scoped content dictionaries
- metadata/canonical/alternate helpers
- sitemap/robots scaffold
- JSON-LD helper scaffold
- `next/font` setup and global CSS tokens
- shared header/footer/page shell primitives
- static route scaffold for `/` and `/pl`, plus optional prefixed placeholders
- guardrails against full client translation dictionaries
- guardrails against static-export-breaking features
- lint/build verification before moving to homepage business implementation
