import type { Metadata } from "next";
import { Sora } from "next/font/google";
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
  description: "Koda Soft builds Opero, adaptive ERP software for flexible company operations.",
  applicationName: siteConfig.name,
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
      </body>
    </html>
  );
}
