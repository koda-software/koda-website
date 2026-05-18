# Step 5: Performance And SSG Architecture

Purpose: lock the technical constraints before homepage implementation so the Koda Soft website stays static-first, Core Web Vitals focused, and fast on mobile.

Research sources:

- Next.js Static Exports: https://nextjs.org/docs/app/guides/static-exports
- Next.js Image Component: https://nextjs.org/docs/app/api-reference/components/image
- Next.js Font Optimization: https://nextjs.org/docs/app/getting-started/fonts
- Next.js Scripts Guide: https://nextjs.org/docs/app/guides/scripts
- Next.js Package Bundling: https://nextjs.org/docs/app/guides/package-bundling
- web.dev Web Vitals: https://web.dev/articles/vitals
- Google PageSpeed Insights: https://developers.google.com/speed/docs/insights/v5/about
- Vercel Speed Insights: https://vercel.com/docs/speed-insights

## Current Repo Baseline

Observed locally:

- Next.js: `16.2.6`.
- React / React DOM: `19.2.4`.
- App Router project in `app/`.
- `next.config.ts` already has `output: "export"`.
- `next.config.ts` already has `images.unoptimized: true`.
- Build script: `next build --webpack`.
- Preview script: `npx serve@latest out`.

This baseline is good for a static-first marketing site.

## 1. Static-First Architecture

Decision:

> Preserve `output: "export"` as the default architecture.

Rules:

- Every launch page must build into static HTML in `out/`.
- Use App Router Server Components by default.
- Avoid `use client` unless a component genuinely needs browser interactivity.
- Do not introduce server-only rendering, runtime data fetching, or request-dependent logic for launch pages.
- Do not use Server Actions for the static launch.
- Do not use POST Route Handlers for contact/demo inside the Next.js app while static export is required.
- Route Handlers are only acceptable for static `GET` artifacts generated at build time, such as `sitemap.xml`, `robots.txt`, or static JSON if needed.
- Dynamic routes must provide `generateStaticParams()` and must not rely on request-time params.

Static export blockers to avoid:

- request-dependent Route Handlers
- Server Actions
- cookies / headers / request inspection
- rewrites / redirects / proxy middleware
- ISR
- dynamic routes without static params
- default `next/image` optimizer
- draft mode

Contact/demo strategy:

- Launch-safe default: static contact page with `mailto:` and/or external form provider endpoint.
- If a form is needed, post directly to an external form service, CRM, or API outside this static export.
- Do not add an internal `app/api/contact/route.ts` unless we intentionally drop static export or add separate backend handling.

## 2. Core Web Vitals Budget

Google's good thresholds:

| Metric | Good Target | Koda Soft Internal Target |
| --- | --- | --- |
| LCP | `<= 2.5s` at p75 | Aim `<= 1.8s` lab/mobile during launch testing. |
| INP | `<= 200ms` at p75 | Keep JS minimal so field INP has headroom. |
| CLS | `<= 0.1` at p75 | Aim `<= 0.03` lab; reserve all space. |
| FCP | `<= 1.8s` good in PSI | Aim fast first paint via static HTML/CSS. |
| TTFB | `<= 800ms` good in PSI | Static hosting should stay comfortably below. |
| Lighthouse Performance | `90+` is good | Aim `95+` mobile before launch. |

Measurement principle:

- Lab tools help debug before launch.
- Field data from CrUX / Speed Insights is the long-term source of truth once the site has real traffic.
- PageSpeed Insights can show both lab and field data; field data may be unavailable until there are enough real visits.

## 3. Fonts

Decision:

- Use `next/font` for self-hosted optimized fonts.
- Prefer `Geist` for the main type system because it matches the approved Stellr-inspired direction.
- Use `Geist Mono` only if diagrams/technical labels need it.

Rules:

- Load only the required subsets.
- Prefer variable fonts.
- Keep weights minimal: regular, medium/semibold, bold through variable font support.
- Apply font variables/classes at the root layout.
- Avoid external runtime font requests.
- Avoid loading decorative/display fonts for launch.

CWV reason:

- `next/font` self-hosts font assets and helps avoid font-driven layout shift.

## 4. Images And Visual Assets

Decision:

> Prefer CSS/SVG/HTML diagrams over bitmap-heavy visuals.

Rules:

- Hero visual should be CSS/SVG/HTML, not video, canvas, or large raster image.
- If images are used, define explicit width/height or aspect ratio to avoid CLS.
- For static export, keep `images.unoptimized: true` unless we add a supported custom loader/CDN strategy.
- Use `next/image` carefully: static imports are useful for dimensions, but the default optimizer is not compatible with static export.
- Prefer AVIF/WebP for raster assets when available.
- Keep above-the-fold image bytes extremely small.
- Avoid template screenshots unless real, optimized, and useful.

Hero visual strategy:

- CSS radial gradients for atmosphere.
- Low-opacity grid/plus texture via CSS or tiny SVG.
- SVG/HTML system map showing Opero capabilities.
- No Framer liquid-gradient canvas recreation.

## 5. CSS And Layout

Rules:

- Use CSS variables for the approved brand primitives.
- Keep global CSS intentional and small.
- Prefer plain CSS/Tailwind utilities already in the project; avoid adding a component library unless clearly needed.
- Reserve space for all cards, diagrams, images, and header states.
- Avoid layout shifts from late-loaded fonts, images, banners, or sticky header changes.
- Use responsive CSS with the approved breakpoints: `<810px`, `810-1199px`, `>=1200px`.
- Use container widths and spacing from Step 3.

CSS effects allowed:

- CSS gradients.
- CSS masks or small SVG backgrounds if lightweight.
- Simple hover/focus transitions.
- `prefers-reduced-motion` support for any motion.

CSS effects avoided:

- scroll-jacking
- canvas/WebGL effects
- large animation libraries
- excessive backdrop filters on large surfaces
- continuous CPU/GPU animation

## 6. JavaScript Budget

Decision:

> Static content first, almost no client JS for launch.

Rules:

- Keep homepage sections as Server Components/static markup by default.
- Client Components allowed only for genuinely interactive pieces, likely mobile nav or a future form enhancement.
- Avoid Framer Motion, GSAP, smooth-scroll libraries, heavy carousels, chart libraries, and client-side icon megabundles.
- If icons are needed, use inline SVG or a tiny local icon set.
- Do not add analytics, chat widgets, cookie banners, or third-party scripts in the first implementation unless explicitly approved.

Budget target:

- Initial route JS should stay minimal; no nonessential client bundle.
- Any `use client` file must justify itself.

## 7. Third-Party Scripts And Analytics

Default:

- No third-party scripts during initial homepage build.

If analytics are required later:

- Prefer Vercel Web Analytics / Speed Insights if deployment is on Vercel.
- Use `next/script` only where needed, not blindly in root layout.
- Prefer `lazyOnload` for noncritical scripts.
- Do not use experimental `worker` strategy in App Router for launch; current docs warn it is not stable and does not work with App Router.

Performance monitoring:

- Enable Vercel Speed Insights after deployment if available.
- Use PageSpeed Insights for mobile and desktop checks after preview/production URL exists.
- Consider `useReportWebVitals` only if we need custom metric reporting; it adds client code, so do not add it by default.

## 8. Metadata, SEO, Sitemap

Rules:

- Use static Metadata API in `app/layout.tsx` and page-level metadata where needed.
- Add static Open Graph image later, preferably a static image file rather than dynamic image generation for launch.
- Add static `robots.txt` and `sitemap.xml` via metadata files or static files.
- Avoid dynamic OG image generation if static export compatibility becomes unclear or adds unnecessary complexity.

## 9. Build And Verification Plan

Local gates before homepage review:

1. `npm run lint`
2. `npm run build`
3. Confirm `out/` exists and pages are emitted as static files.
4. `npm run preview`
5. Browser smoke test desktop/mobile.
6. Lighthouse mobile check against local preview if possible.
7. Check no console errors.
8. Check layout shift manually on reload.
9. Inspect network for large JS, image, or font payloads.

Deployment/production gates:

1. Verify production URL page load.
2. Run PageSpeed Insights mobile and desktop.
3. Confirm no static export regressions.
4. Enable/check Vercel Speed Insights if deployed on Vercel.
5. Re-check after real content/images are added.

Optional tooling:

- `next experimental-analyze` for Turbopack bundle analysis on Next 16.1+ projects.
- `@next/bundle-analyzer` if we continue building with Webpack and need bundle reports.
- Lighthouse / Chrome DevTools Performance panel for lab debugging.
- PageSpeed Insights for lab + field reporting once the page is public.
- Vercel Speed Insights for route-level production CWV tracking.

## 10. Launch Constraints

Allowed for launch:

- Static App Router pages.
- Server Components/static markup.
- CSS/SVG system diagrams.
- `next/font` optimized fonts.
- Static metadata and social images.
- Minimal mobile-nav client component if necessary.
- External contact/demo link or static-compatible form target.

Not allowed without explicit approval:

- Internal contact API route.
- Server Actions.
- Framer Motion / GSAP / smooth-scroll packages.
- Canvas/WebGL hero.
- Video hero.
- Heavy third-party scripts.
- Default `next/image` optimization under static export.
- Fake metrics or external widgets that hurt CWV.

## Step 5 Acceptance Criteria

Step 5 can be considered ready when we agree that:

- Static export remains mandatory for launch.
- Contact/demo flow will not depend on an internal Next.js API route.
- The homepage will be mostly Server Components/static markup.
- Hero visuals will be CSS/SVG/HTML, not video/canvas/runtime animation.
- Fonts use `next/font` with minimal weights/subsets.
- Third-party scripts are excluded by default.
- Mobile Lighthouse target is `95+`, with CWV thresholds comfortably green.
- Verification will include lint, build, preview, browser smoke, and PageSpeed/Lighthouse checks.
