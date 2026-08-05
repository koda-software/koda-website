import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { PageKey } from "@/lib/i18n/routes";
import type { NavItem, ShellContent } from "@/content/types";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

type PageShellProps = {
  locale: Locale;
  page: PageKey;
  shell: ShellContent;
  navItems: NavItem[];
  children: ReactNode;
  /** Per-page overrides for the language switcher; defaults to the static route map. */
  alternatePaths?: Partial<Record<Locale, string>>;
};

export function PageShell({ locale, page, shell, navItems, children, alternatePaths }: PageShellProps) {
  return (
    <>
      <SiteHeader locale={locale} page={page} content={shell} navItems={navItems} />
      <main className="min-h-[70vh]">{children}</main>
      <SiteFooter alternatePaths={alternatePaths} locale={locale} page={page} content={shell} navItems={navItems} />
    </>
  );
}
