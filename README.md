# Koda Soft Website (SSG)

Fresh Next.js project for the upcoming Koda Soft marketing website (company behind Opero ERP).

## Stack

- Next.js (App Router)
- TypeScript
- ESLint

## SSG setup

This project is configured for static export:

- `next.config.ts` uses `output: "export"`
- `npm run build` generates static files in `out/`

## Local development

```bash
npm run dev
```

## Build static website

```bash
npm run build
```

Static files are generated into `out/`.

## Preview static output

```bash
npm run preview
```

## Deploy on Vercel

This repo is preconfigured for Vercel in `vercel.json`.

When creating the Vercel project, use:

- Framework Preset: `Next.js`
- Build Command: `npm run build` (or leave default)
- Output Directory: leave empty/default for Next.js

Because the app uses `output: "export"` in Next config, Vercel will deploy it as a static site.

## Suggested next steps

1. Define sitemap and page structure.
2. Gather brand, copy, and SEO requirements.
3. Decide design system, typography, and visual direction.
4. Set content model for features, testimonials, and case studies.
# koda-website
