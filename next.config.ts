import type { NextConfig } from "next";

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
    ];
  },
  async rewrites() {
    return [
      {
        source: "/docs",
        destination: "https://docs.kodasoft.pl/docs",
      },
      {
        source: "/docs/:path*",
        destination: "https://docs.kodasoft.pl/docs/:path*",
      },
    ];
  },
};

export default nextConfig;
