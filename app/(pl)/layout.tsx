import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/lib/seo/json-ld";
import { siteConfig } from "@/lib/seo/site";
import "../globals.css";

const sora = Sora({
  variable: "--font-sans-brand",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: "Koda Soft tworzy Opero, elastyczny system ERP dla procesow firmowych.",
  applicationName: siteConfig.name,
  robots: {
    index: true,
    follow: true,
  },
};

export default function PolishRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" className={`${sora.variable} h-full antialiased`}>
      <body className={`${sora.className} min-h-full`}>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        {children}
      </body>
    </html>
  );
}
