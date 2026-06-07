---
name: review
description: Review uncommitted Opero website changes before shipping. Use when asked to perform a final quality review, pre-ship review, or consistency pass over pending changes, then identify and fix candidates involving design consistency, reusable components, file size, localization, SEO, accessibility, performance, static-first architecture, and verification.
---

# Review

Use this skill as the last quality pass before website changes are shipped.

## Goal

Inspect all uncommitted changes, find anything that could degrade the Opero website, create a clear list of fix candidates, and apply safe fixes. The review should protect design consistency, performance, static generation, SEO, localization, maintainability, accessibility, and content quality.

Do not commit or push unless the user explicitly asks. Do not discard user changes.

## Review Workflow

1. Start with the current change set:
   - `git status --short --branch`
   - `git diff --stat`
   - `git diff --cached --stat` when staged changes exist
   - targeted `git diff -- <file>` for changed source/content/config files.

2. Identify fix candidates before editing. Look for:
   - **Design drift**: sections that no longer match the homepage quality bar, spacing rhythm, typography scale, visual restraint, CTA style, icon style, footer/header patterns, or conservative Opero tone.
   - **Overgrown components**: large page components, repeated section structures, duplicated CTA blocks, repeated cards/lists, or logic that should become a reusable component or content-driven structure.
   - **Hardcoded or missing translations**: visible copy in components/pages instead of `content/en`, `content/pl`, or shared content modules; EN-only or PL-only additions; metadata not localized.
   - **SEO gaps**: missing or weak title/description, canonical/hreflang mismatch, sitemap/robots drift, incorrect Open Graph image usage, missing relevant structured data, or route changes not reflected in SEO helpers.
   - **Performance risks**: new Client Components without real interactivity, large assets, unnecessary dependencies, heavy animation/runtime code, excessive props passed to clients, layout shift risks, unoptimized images, or static pages made dynamic.
   - **File size and asset risks**: unexpectedly large images, binary files, generated artifacts, Windows `:Zone.Identifier` files, copied vendor code, or public assets that should be compressed or ignored.
   - **Accessibility issues**: missing labels, weak button/link names, images without meaningful alt text, color contrast concerns, heading order problems, or controls with unclear state.
   - **Content quality**: invented claims, fake proof, exaggerated AI language, unsupported metrics, vague SaaS copy, or copy that does not explain Opero concretely.

3. Fix what is safe and clearly beneficial. Prefer small, local improvements that align with existing architecture. If a fix is subjective, large, or changes product intent, list it as a recommendation instead of forcing it.

4. Preserve current infrastructure:
   - Public pages remain static/prerenderable.
   - Prefer Server Components and typed server-side content.
   - Use existing design primitives and content patterns first.
   - Update both EN and PL content together.
   - Keep sitemap, metadata, hreflang, robots, and JSON-LD aligned.

5. Verify after fixes:
   - Run `npm run quality:precommit` for typegen, type-check, and lint.
   - Run `npm run quality:nonvisual` when page HTML, metadata, sitemap, robots, schema, forms, images, or routes are affected.
   - Run `npm run build` when route generation, static output, Next config, sitemap generation, dependencies, or deployment behavior changed.
   - Run Lighthouse only when performance-sensitive changes or launch readiness require it.

## Output Style

Report the review in plain language:

- What was reviewed.
- Fix candidates found.
- What was fixed.
- What remains as optional or needs user/product judgment.
- Verification commands and results.

Lead with important risks if any remain. If no issues remain, say that clearly and mention residual risk such as skipped visual review or subjective copy/design judgment.
