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
};

export function SiteFooter({ locale, page, content, navItems }: SiteFooterProps) {
  return (
    <footer className="border-t border-[var(--color-border-light)] px-[var(--page-gutter)] py-8 text-[var(--color-muted)]">
      <div className="mx-auto flex w-[min(100%,var(--shell-width))] items-center justify-between gap-6 max-[809px]:flex-col max-[809px]:items-start">
        <div>
          <Link className="mb-3 inline-block" href={localizePath(locale, "home")} aria-label={content.brand}>
            <Image className="h-7 w-auto" src="/branding/kodasoft-logo.svg" width={622} height={169} alt="" aria-hidden="true" />
            <span className="sr-only">{content.brand}</span>
          </Link>
          <p className="m-0 max-w-[34rem]">{content.footer.tagline}</p>
        </div>
        <div className="flex items-center gap-[clamp(1rem,2vw,1.5rem)] text-[0.9rem] font-medium max-[809px]:flex-wrap" aria-label="Footer navigation">
          {navItems.map((item) => (
            <Link key={item.page} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
        <LanguageSwitcher locale={locale} page={page} label={content.footer.languageLabel} />
      </div>
    </footer>
  );
}
