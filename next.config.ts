import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
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
};

export default nextConfig;
