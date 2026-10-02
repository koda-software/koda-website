import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
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
