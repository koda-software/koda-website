"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { localizePath, type PageKey } from "@/lib/i18n/routes";
import type { NavItem, ShellContent } from "@/content/types";
import { LanguageSwitcher } from "./LanguageSwitcher";

type SiteHeaderProps = {
  locale: Locale;
  page: PageKey;
  content: ShellContent;
  navItems: NavItem[];
};

export function SiteHeader({ locale, page, content, navItems }: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuLeft, setMenuLeft] = useState<number | null>(null);
  const menuSlotRef = useRef<HTMLDivElement>(null);
  const headerItems = useMemo<NavItem[]>(
    () => [
      {
        page: "home",
        label: locale === "pl" ? "Start" : "Home",
        href: localizePath(locale, "home"),
      },
      ...navItems,
    ],
    [locale, navItems],
  );

  useEffect(() => {
    const updateMenuLeft = () => {
      const rect = menuSlotRef.current?.getBoundingClientRect();

      if (rect) {
        setMenuLeft(rect.left + rect.width / 2);
      }
    };

    const updateScrolled = () => {
      updateMenuLeft();
      setIsScrolled(window.scrollY > 16);
    };

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    window.addEventListener("resize", updateScrolled);

    return () => {
      window.removeEventListener("scroll", updateScrolled);
      window.removeEventListener("resize", updateScrolled);
    };
  }, []);

  const menuLinks = headerItems.map((item, index) => {
    const isActive = item.page === page;
    const isPrimaryAction = index === headerItems.length - 1;

    return (
      <Link
        className={`rounded-full px-3.5 py-2.5 transition-colors duration-200 ${
          isActive
            ? "site-menu-link-active bg-white shadow-[0_8px_24px_rgba(255,255,255,0.22)]"
            : isPrimaryAction
              ? "border border-white/[0.18] bg-white/10 text-white hover:bg-white/[0.16]"
              : "text-white/[0.78] hover:bg-white/10 hover:text-white"
        }`}
        key={item.page}
        href={item.href}
        aria-current={isActive ? "page" : undefined}
      >
        {item.label}
      </Link>
    );
  });

  return (
    <header className="absolute inset-x-0 top-0 z-30 px-[var(--page-gutter)] py-4 text-[var(--color-paper)]">
      <nav
        className="mx-auto grid w-[min(100%,var(--shell-width))] max-w-[var(--shell-width)] grid-cols-[auto_1fr_auto] items-center gap-4 min-[810px]:gap-6"
        aria-label="Primary navigation"
      >
        <Link className="shrink-0 px-1" href={localizePath(locale, "home")} aria-label={content.brand}>
          <Image className="h-8 w-auto" src="/branding/kodasoft-logo-white.svg" width={622} height={169} alt="" aria-hidden="true" priority />
          <span className="sr-only">{content.brand}</span>
        </Link>
        <div ref={menuSlotRef} className="relative flex w-fit max-w-[calc(100vw-2rem)] justify-self-center whitespace-nowrap max-[809px]:hidden">
          <div className="site-menu-pill invisible flex w-fit items-center gap-1 rounded-full p-1 text-[0.86rem] font-medium" aria-hidden="true">
            {headerItems.map((item, index) => {
              const isActive = item.page === page;
              const isPrimaryAction = index === headerItems.length - 1;

              return (
                <span
                  className={`rounded-full px-3.5 py-2.5 ${
                    isActive
                      ? "site-menu-link-active bg-white shadow-[0_8px_24px_rgba(255,255,255,0.22)]"
                      : isPrimaryAction
                        ? "border border-white/[0.18] bg-white/10 text-white"
                        : "text-white/[0.78]"
                  }`}
                  key={item.page}
                >
                  {item.label}
                </span>
              );
            })}
          </div>
          <div
            className={`site-menu-pill flex w-fit items-center gap-1 rounded-full p-1 text-[0.86rem] font-medium transition-[top,background,border-color,box-shadow] duration-300 ease-out ${
              isScrolled ? "site-menu-pill-scrolled" : ""
            }`}
            style={{
              position: isScrolled ? "fixed" : "absolute",
              top: isScrolled ? "1rem" : 0,
              left: isScrolled && menuLeft ? `${menuLeft}px` : "50%",
              zIndex: isScrolled ? 40 : 10,
              width: "max-content",
              WebkitBackdropFilter: isScrolled ? "blur(6px) saturate(140%) contrast(104%)" : "blur(4px) saturate(130%) contrast(102%)",
              backdropFilter: isScrolled ? "blur(6px) saturate(140%) contrast(104%)" : "blur(4px) saturate(130%) contrast(102%)",
              transform: "translateX(-50%) translateZ(0)",
            }}
            aria-label="Main pages"
          >
            {menuLinks}
          </div>
        </div>
        <LanguageSwitcher locale={locale} page={page} label={content.footer.languageLabel} />
      </nav>
    </header>
  );
}
