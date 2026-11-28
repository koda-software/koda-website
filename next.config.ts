import { readdirSync } from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

/**
 * The Opero guide's chapters were renumbered and renamed when the docs moved here
 * (03-praca-na-danych/historia-zmian is now 05-rekordy/historia-zmian), and Google still
 * crawls the old addresses. Page names are unique across chapters and the same in both
 * languages, so each page's old address under any other chapter moves to its current one.
 */
function movedGuideRedirects() {
  const guide = path.join(process.cwd(), "content/docs/pl/opero");
  const chapters = readdirSync(guide, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  const pages = chapters.flatMap((chapter) =>
    readdirSync(path.join(guide, chapter))
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => ({ chapter, page: file.replace(/\.mdx$/, "") })),
  );
  // Old pages that were renamed as well as moved.
  const renamed = [
    { old: "karta-rekordu", chapter: "05-rekordy", page: "formularz-rekordu" },
    { old: "rejestr-rekordow", chapter: "04-listy-rekordow", page: "lista-rekordow" },
  ];
  // The lookahead sees the rest of the path, so "not this chapter" ends in its slash.
  const oldChapter = (current: string) => `:chapter((?!${current}/)\\d{2}-[a-z0-9-]+)`;

  return [
    ...pages.map(({ chapter, page }) => ({
      source: `/docs/:locale(en|pl)/opero/${oldChapter(chapter)}/${page}`,
      destination: `/docs/:locale/opero/${chapter}/${page}`,
      permanent: true,
    })),
    ...renamed.map(({ old, chapter, page }) => ({
      source: `/docs/:locale(en|pl)/opero/:chapter(\\d{2}-[a-z0-9-]+)/${old}`,
      destination: `/docs/:locale/opero/${chapter}/${page}`,
      permanent: true,
    })),
    // Chapters have no page of their own, old or current: their address goes to the guide's start.
    {
      source: "/docs/:locale(en|pl)/opero/:chapter(\\d{2}-[a-z0-9-]+)",
      destination: "/docs/:locale/opero",
      permanent: true,
    },
  ];
}

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  env: {
    // Read by lib/deploy-rotation.ts. Written into the bundle here, so a page regenerated
    // after the build still picks the same promo as the page built with it. The deployment
    // id changes on every deploy, a redeploy of the same commit included.
    DEPLOY_SEED: process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA ?? String(Date.now()),
  },
  experimental: {
    // Prerendering the blog calls the Opero API for every page. Next defaults to
    // one worker per core (23 here), which bursts hundreds of requests at the
    // origin and gets 503s back from its nginx. Fewer, busier workers keep the
    // build well inside what the API absorbs; combined with the in-process
    // concurrency cap in lib/blog/opero.ts this holds requests to a trickle.
    staticGenerationMinPagesPerWorker: 40,
    staticGenerationMaxConcurrency: 4,
    staticGenerationRetryCount: 2,
  },
  webpack(config, { dev }) {
    // Vercel restores webpack's filesystem cache from the previous deploy. webpack cannot
    // track fumadocs-mdx's build dependencies ("Build dependencies behind this expression
    // are ignored"), so after a dependency change the stale cache crashed the compile
    // ("Cannot read properties of undefined (reading 'length')", aada5b8 and 77ab403).
    // Production builds on Vercel compile from scratch instead (about 25 s); local and
    // dev builds keep the cache.
    if (!dev && process.env.VERCEL) config.cache = false;
    return config;
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "kodasoft.pl",
          },
        ],
        destination: "https://www.kodasoft.pl/:path*",
        permanent: true,
      },
      // The Polish homepage moved from /pl to the root (lib/i18n/config.ts rootLocale).
      // /pl was indexed, so it hands its signals to / instead of serving a duplicate.
      {
        source: "/pl",
        destination: "/",
        permanent: true,
      },
      // /docs picks a language. The docs app's i18n proxy and the SaaS edge used to do this.
      // Temporary, so browsers don't pin one language. Same test as the "/" redirect in vercel.json.
      {
        source: "/docs",
        has: [
          {
            type: "header",
            key: "accept-language",
            value: "(^|.*,\\s*)pl(?:-|;|,|$).*",
          },
        ],
        destination: "/docs/pl",
        permanent: false,
      },
      {
        source: "/docs",
        destination: "/docs/en",
        permanent: false,
      },
      // Old /docs/<locale>/docs/… URLs, kept from the docs app.
      {
        source: "/docs/:locale(en|pl)/docs",
        destination: "/docs/:locale",
        permanent: true,
      },
      {
        source: "/docs/:locale(en|pl)/docs/:path*",
        destination: "/docs/:locale/:path*",
        permanent: true,
      },
      // The docs app also served the guide and the API reference without the /docs prefix.
      {
        source: "/:locale(en|pl)/opero/:chapter(\\d{2}-[a-z0-9-]+)/:path*",
        destination: "/docs/:locale/opero/:chapter/:path*",
        permanent: true,
      },
      {
        source: "/:locale(en|pl)/api/:path*",
        destination: "/docs/:locale/api/:path*",
        permanent: true,
      },
      ...movedGuideRedirects(),
    ];
  },
  async headers() {
    return [
      {
        // The SaaS edge added these to every docs response. Keep them after the move.
        source: "/docs/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

// Compiles content/docs (MDX + meta.json) into .source/, imported as `collections/server`.
const withMDX = createMDX();

export default withMDX(nextConfig);
