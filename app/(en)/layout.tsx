import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/lib/seo/json-ld";
import { siteConfig } from "@/lib/seo/site";
import "../globals.css";

const sora = Sora({
  variable: "--font-sans-brand",
  subsets: ["latin"],
  display: "swap",
});

export const dynamic = "force-static";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: "KodaSoft builds Opero, a no-code BPM platform for flexible company processes.",
  applicationName: siteConfig.name,
  icons: {
    icon: [
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  manifest: "/site.webmanifest",
  other: {
    "apple-mobile-web-app-title": "MyWebSite",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function EnglishRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sora.variable} h-full antialiased`}>
      <body className={`${sora.className} min-h-full`}>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
