import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import { localizePath, type PageKey } from "@/lib/i18n/routes";
import type { NavItem, ShellContent } from "@/content/types";
import { LanguageSwitcher } from "./LanguageSwitcher";

type SiteFooterProps = {
  locale: Locale;
  page: PageKey;
  content: ShellContent;
  navItems: NavItem[];
  alternatePaths?: Partial<Record<Locale, string>>;
};

export function SiteFooter({ locale, page, content, navItems, alternatePaths }: SiteFooterProps) {
  return (
    <footer className="relative overflow-hidden bg-[var(--color-surface-dark)] px-[var(--page-gutter)] py-[clamp(4rem,8vw,6.5rem)] text-[var(--color-paper)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(126,231,255,0.45),rgba(56, 182, 255,0.42),transparent)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(56, 182, 255,0.12),transparent_32%),linear-gradient(225deg,rgba(126,231,255,0.08),transparent_34%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-[min(100%,var(--shell-width))] grid-cols-[minmax(0,1fr)_auto] gap-[clamp(2.5rem,6vw,6rem)] max-[809px]:grid-cols-1">
        <div className="max-w-[44rem]">
          <Link className="mb-6 inline-block" href={localizePath(locale, "home")} aria-label={content.brand}>
            <Image className="h-6 w-auto" src="/branding/kodasoft-logo-white.svg" width={1404} height={247} alt="" aria-hidden="true" />
            <span className="sr-only">{content.brand}</span>
          </Link>
          <p className="m-0 max-w-[38rem] text-[2rem] font-light leading-[1.18] text-white/82 max-[809px]:text-[1.55rem]">
            {content.footer.tagline}
          </p>
          <p className="mt-8 max-w-[34rem] text-[0.98rem] font-light leading-[1.65] text-white/52">
            {content.footer.description}
          </p>
        </div>

        <div className="grid min-w-[18rem] gap-8 text-[0.95rem] font-medium">
          <div className="grid gap-3" aria-label="Footer navigation">
            {navItems.map((item) => (
              <Link className="text-white/66 transition-colors hover:text-white" key={item.page} href={item.href}>
                {item.label}
              </Link>
            ))}
            {content.footer.links.map((item) => (
              <Link className="text-white/66 transition-colors hover:text-white" key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-white/[0.12] pt-6 text-white/66 transition-colors hover:text-white">
            <LanguageSwitcher alternatePaths={alternatePaths} locale={locale} page={page} label={content.footer.languageLabel} />
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-[clamp(3.5rem,7vw,6rem)] flex w-[min(100%,var(--shell-width))] items-center justify-between gap-4 border-t border-white/[0.1] pt-6 text-[0.82rem] text-white/40 max-[640px]:flex-col max-[640px]:items-start">
        <span>{content.brand}</span>
        <span>{content.footer.productLine}</span>
      </div>
    </footer>
  );
}
