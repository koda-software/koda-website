---
description: Manage EN/PL translations and localized page copy for the Opero website. Use when adding, editing, reviewing, or wiring translated content in content/en, content/pl, typed content modules, page metadata, forms, navigation, footer text, CTA labels, or reusable layout components while keeping pages server-first, static-friendly, and performant.
---

# Translations

## Core Rule

Keep translated copy in typed server-side content modules, not inside Client Components. A page should import the smallest relevant EN/PL content object, render most text in Server Components, and pass only the narrow copy needed by an interactive Client Component.

## Workflow

1. Inspect the current content shape before adding copy:
   - `content/types.ts`
   - matching files in `content/en/*` and `content/pl/*`
   - the page route under `app/(en)` and `app/(pl)`
   - shared shell copy in `content/*/common.ts` when nav/footer/header labels are involved.

2. Reuse existing structures before creating new ones. Add a new type only when the page/component needs a new content shape. Prefer route-scoped content such as `content/en/contact.ts` and `content/pl/contact.ts` over one large dictionary.

3. Keep content server-first:
   - Pages import localized content in server route files.
   - Shared page layout components can be Server Components when they do not need state/effects.
   - Client Components receive only the exact labels/messages they need, such as form labels and status text.
   - Do not pass full locale dictionaries to Client Components.

4. Update both locales in the same change. If a translation is uncertain, make a conservative draft and mention it in the final response instead of leaving one locale missing.

5. Keep metadata localized with the page content. Update `seo.title` and `seo.description` whenever visible page positioning changes.

6. Preserve static generation. Localized content modules must not read request data, cookies, headers, environment variables, filesystem content, or remote APIs. Runtime work belongs only in explicit API routes or server handlers.

7. After editing translations, run targeted checks:
   - `npm run lint`
   - `./node_modules/.bin/tsc --noEmit --incremental false` when types or component props changed.
   - Use focused HTTP/text checks against the existing dev server if the user says it is already running. Do not start dev or run build unless the user asks.

## Copy Practices

- Match the page tone: conservative, concrete, business-oriented, and not overtly "AI SaaS".
- Avoid translating word-for-word when Polish needs a more natural business phrase.
- Keep CTA labels short and action-oriented.
- Keep form labels direct, accessible, and localized.
- Avoid duplicate near-identical strings when a shared shell label already exists.
- Do not invent proof, metrics, customer names, or product capabilities.

## Performance Practices

- Prefer plain TypeScript content objects over runtime i18n providers for this website.
- Keep large copy blocks in Server Components so they do not expand client bundles.
- Mark only genuinely interactive pieces with `"use client"`.
- When adding localized options for a client form/select, pass only the options array, not the whole page content.
- Keep icons, flags, and visual helpers out of translation objects unless the component truly needs locale-specific visual data.

## File Pattern

For a new localized page:

1. Add or extend types in `content/types.ts`.
2. Add `content/en/<page>.ts` and `content/pl/<page>.ts`.
3. Create or update a reusable page component in `components/layout/*`.
4. Wire `app/(en)/en/<page>/page.tsx` and `app/(pl)/pl/<page>/page.tsx`.
5. Use `createPageMetadata` with the page's localized `seo` object.
6. Keep the route shell localized through `commonContent` and `navItems`.
