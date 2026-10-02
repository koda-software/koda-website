# KodaSoft website

This Next.js repository owns the marketing website, the Opero blog, and the EN/PL documentation at `/docs/en` and `/docs/pl`. Node 24 and pnpm 11.6.0 are required. Vercel runs `pnpm run build`; it does not use static export.

```sh
pnpm install --frozen-lockfile
pnpm dev                 # localhost:3011
pnpm build
pnpm preview             # production build on localhost:3004
pnpm quality:precommit
pnpm test:docs
```

The blog needs `OPERO_API_KEY` and `OPERO_API_BASE` (default `https://opero.kodasoft.pl/api`). Image access also uses `OPERO_COMPANY_ID`. Keep credentials in ignored `.env.local`; exported shell variables take precedence over env files.

## Documentation content

`content/docs`, `content/openapi`, and `content/docs-build-manifest.json` form the accepted snapshot. The initial cutover snapshot contains exactly the 400 currently published URLs. Four unpublished manual pages from the old checkout are intentionally reserved for a later content update.

`scripts/docs/content-policy.json` starts in `snapshot` mode. Builds validate the complete snapshot without fetching docs APIs. To capture current public content locally, set `OPERO_DOCS_API_KEY` and run `pnpm docs:refresh-snapshot`. The generator fetches both locales and schemas, validates pagination and path collisions, preserves the explicit manual API pages, and generates into an isolated staging directory. It rejects unexplained removals, count drops, and changes to manual pages before replacing generated content. Commit the content and manifest together.

For intentional manual edits, review the diff and run `pnpm docs:accept-snapshot`. This accepts the complete local baseline and must never run in CI. `manual-api-pages.json` explicitly lists authored API guides; new guides must be added there. The current schema imports use `EXTERNAL_API_OPENAPI_URL_EN` and `_PL`, defaulting to `/api/swagger/v1/{locale}/json`.

The 2026-10-02 cutover stays in `snapshot` mode; automatic/nightly refresh is deferred by the owner. A future refresh rollout may switch `content-policy.json` to `live` in a separate reviewed change. Live builds on Vercel/CI require the docs key and fail on API or validation errors. Local live builds without a key validate the accepted snapshot. Accepted manifests remain the review baseline; live builds do not silently bless URL removals.

The `mdast-util-to-markdown` override in `pnpm-workspace.yaml` preserves the docs renderer's working 2.1.2 behavior: 2.1.3 causes recursive stringification with the pinned Fumadocs release. Upgrade these together with runtime checks.

## Search and deployment verification

Production Algolia synchronization retains the existing postbuild timing. It runs only on Vercel Production, validates both exports before writing, and supports `SKIP_ALGOLIA_SYNC=1`. Production requires `ALGOLIA_ADMIN_API_KEY`; never provide it to Preview or browser code. Public search uses `NEXT_PUBLIC_ALGOLIA_APP_ID`, `NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY`, and the base `NEXT_PUBLIC_ALGOLIA_INDEX_NAME`, with optional `_EN`/`_PL` overrides.

Preview uses separate `<base>_migration_preview_en` and `_pl` indices and a search key restricted to those indices. Seed them with `pnpm docs:sync-preview-algolia`, supplying `DOCS_PREVIEW_DEPLOYMENT`, the restricted `DOCS_PREVIEW_ALGOLIA_WRITE_KEY`, and `DOCS_PREVIEW_BYPASS` when protection is enabled. The script checks the deployment manifest against the accepted snapshot before synchronization.

Capture the old sitemap, then run:

```sh
PREVIEW=https://your-preview.vercel.app \
BEFORE=/absolute/path/docs-sitemap-before.xml \
EXPECTED_CONTENT_HASH=<accepted-content-hash> \
pnpm docs:verify-deployment
```

Optional `BYPASS` handles Vercel protection. The verifier fetches the union of old and new URLs, checks status, canonical links, language alternates, unprefixed internal links, sitemap alias parity, and the content hash. URL exceptions require exact paths and reasons in `cutover-url-exceptions.json`.

`/docs/build.json` exposes only the content hash, fetch timestamp, counts, content mode, Git revision, and deployment URL. Companion Jenkins PR #1 proposes disabled refresh and freshness jobs and remains draft/unmerged. No nightly refresh, Deploy Hook, refresh token or freshness alerts are required for the current snapshot cutover. For a future rollout, merge and enable them only after a successful live production refresh; they track an exact deployment ID, require production promotion and its fresh manifest, and alert through the existing Discord build channel. A separate daily check rejects docs older than 48 hours.

The old edge docs container stays healthy as the rollback target. Observe its docs traffic through 2026-10-09; retire the old repository, pipelines and credentials in the deployment retirement plan’s later cleanup phase. New manual content changes belong in this repository.
