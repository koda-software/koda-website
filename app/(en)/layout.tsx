import type { Metadata } from "next";
import { Sora } from "next/font/google";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalyticsConsent } from "@/components/analytics/GoogleAnalyticsConsent";
import { commonContent } from "@/content/en/common";
import { GOOGLE_ANALYTICS_CONSENT_BOOTSTRAP } from "@/lib/analytics/google";
import { localizePath } from "@/lib/i18n/routes";
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
  description: "KodaSoft builds Opero, a low-code BPM platform for company processes, documents and data.",
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
    "apple-mobile-web-app-title": siteConfig.name,
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
        <Script id="analytics-consent-default" strategy="beforeInteractive">
          {GOOGLE_ANALYTICS_CONSENT_BOOTSTRAP}
        </Script>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        {children}
        <SpeedInsights />
        <GoogleAnalyticsConsent content={commonContent.analytics} privacyHref={localizePath("en", "privacy")} />
      </body>
    </html>
  );
}
