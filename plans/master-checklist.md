# Koda Soft Website Master Checklist

Purpose: create a beautiful, fast, static-first website for Koda Soft that explains Opero as flexible, AI-empowered ERP software built around how companies actually work.

Working rule: finish one step, stop, discuss, digest, and only then move to the next step.

## 0. Product Understanding

- [x] Review `../opero-front` to understand current user-facing product capabilities, UX patterns, modules, workflows, permissions, and product language.
- [x] Review `../erp-core` to understand backend capabilities, data model, automation/rules, AI-related services, integrations, security, and platform architecture.
- [x] Extract a concise feature inventory grouped by business value, not internal implementation.
- [x] Identify the strongest product promises Opero can truthfully make today.
- [x] Identify gaps, unclear claims, or features that should not be marketed yet.
- [ ] Stop and discuss: agree on what Opero is, what it can promise, and what should stay out of public copy for now.

## 1. Positioning And Message

- [x] Define Koda Soft as the company brand and Opero as the flagship ERP product.
- [x] Refine the core promise: flexible software that solves many business problems, adapts to people’s workflows, and empowers companies with AI.
- [x] Define primary audience segments and the first high-intent use cases.
- [x] Create homepage headline, subheadline, supporting proof points, and CTA hierarchy.
- [x] Stop and discuss: approve the product story before visual or implementation work.

## 2. Site Structure

- [x] Define launch sitemap with only the pages needed for a strong first release.
- [x] Recommended first release: Home, Opero, Solutions, About, Contact / Book Demo.
- [x] Decide which pages are static now and which content areas can expand later.
- [x] Map every page to one primary conversion goal.
- [ ] Stop and discuss: approve sitemap and page priorities.

## 3. Visual Direction

- [x] Use Stellr as the chosen direction anchor: precise, dependable, structured, modern, and technical.
- [x] Define brand primitives: colors, typography, spacing, layout rhythm, icon/diagram style, motion style.
- [x] Avoid generic SaaS visuals, fake proof, heavy Framer effects, and purple-gradient defaults.
- [x] Design around flexibility, connected systems, AI assistance, and software that bends to company workflows.
- [x] Stop and discuss: approve art direction before building UI.

## 4. Content System

- [x] Draft concise page copy using concrete business outcomes instead of vague SaaS language.
- [x] Translate product capabilities into customer-facing benefits.
- [x] Create reusable content blocks: hero, problem, solution, feature pillars, AI empowerment, trust, CTA.
- [x] Define proof points that are honest without overstating maturity.
- [x] Stop and discuss: approve copy direction and claims.

## 4.5 Localisation

- [x] Define URL-based language strategy: `/` English homepage, `/pl` Polish homepage, prefixed non-homepage routes.
- [x] Preserve static export compatibility without middleware/proxy locale detection.
- [x] Define route/section-scoped translation storage.
- [x] Require server-first translation rendering.
- [x] Prevent full translation dictionaries from being passed to Client Components.
- [x] Stop and discuss: approve localisation architecture before SEO and implementation.

## 4.6 SEO Strategy

- [x] Define search positioning and page intent for EN/PL routes.
- [x] Define metadata, canonical, hreflang, sitemap, and robots rules.
- [x] Define content structure and writing guidelines for crawlable, people-first pages.
- [x] Define truthful structured data strategy.
- [x] Define SEO verification tools and pre/post-launch checks.
- [x] Stop and discuss: approve SEO strategy before implementation.

## 5. Performance And SSG Architecture

- [x] Preserve static generation / static export as the default architecture.
- [x] Avoid runtime dependencies that hurt TTFB, LCP, CLS, INP, or static export compatibility.
- [x] Plan images, fonts, CSS, and animations around Core Web Vitals from the start.
- [x] Prefer lightweight CSS-driven visuals over heavy client-side animation libraries unless clearly justified.
- [x] Define CWV budget: excellent LCP, near-zero CLS, minimal JS, responsive images, and fast mobile load.
- [x] Stop and discuss: approve technical constraints before implementation.

## 5.5 Implementation Prerequisites

- [x] Define localisation scaffold: locale config, URL helpers, route-scoped dictionaries, language switch mapping.
- [x] Define SEO scaffold: metadata helpers, canonical/alternate helpers, sitemap/robots, JSON-LD helpers.
- [x] Define performance scaffold: `next/font`, global tokens, static asset rules, minimal JS guardrails.
- [x] Define shared shell scaffold: header, footer, page shell, locale-aware nav links.
- [x] Define verification gate for static export, no full client dictionaries, and no static-breaking features.
- [x] Stop and discuss: approve implementation prerequisites before writing code.

## 6. Homepage Implementation

- [x] Build the homepage first as the quality bar for the whole site.
- [x] Include hero, problem framing, Opero solution, AI empowerment, flexible modules/workflows, trust/company section, and demo CTA.
- [x] Keep components static by default and client-side JavaScript minimal.
- [ ] Validate desktop and mobile layouts early.
- [ ] Stop and discuss: review homepage before adding more pages.

## 7. Supporting Pages

- [ ] Build the Opero product page with feature depth and product narrative.
- [ ] Build Solutions / Use Cases around business problems Opero can solve.
- [ ] Build About Koda Soft with credibility, mission, and product-building philosophy.
- [ ] Build Contact / Book Demo with a short, low-friction conversion path.
- [ ] Stop and discuss: review page set and conversion flow.

## 8. SEO And Metadata

- [ ] Add static metadata, titles, descriptions, Open Graph, canonical URLs, and sitemap/robots if needed.
- [ ] Shape keywords around flexible ERP, AI-enabled ERP, business process software, workflow automation, and company operations.
- [ ] Ensure copy is readable for humans first and search engines second.
- [ ] Stop and discuss: approve SEO positioning and metadata.

## 9. Quality Gates

- [ ] Run `npm run lint`.
- [ ] Run `npm run build` and confirm static export succeeds.
- [ ] Preview generated output with `npm run preview`.
- [ ] Check responsive layout, keyboard navigation, semantic HTML, image sizing, and obvious accessibility issues.
- [ ] Run Lighthouse / PageSpeed-style checks focused on mobile CWV.
- [ ] Stop and discuss: review results and fix any launch blockers.

## 10. Launch Readiness

- [ ] Confirm final copy, CTAs, contact path, metadata, and analytics needs.
- [ ] Confirm Vercel settings preserve the intended static-first deployment behavior.
- [ ] Prepare screenshots and verification notes.
- [ ] Deploy and verify production page load, metadata, CWV, and contact flow.
- [ ] Stop and discuss: decide post-launch iteration priorities.
