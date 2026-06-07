"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MenuIcon from "lucide-react/dist/esm/icons/menu.mjs";
import XIcon from "lucide-react/dist/esm/icons/x.mjs";
import type { Locale } from "@/lib/i18n/config";
import { localizePath, type PageKey } from "@/lib/i18n/routes";
import type { NavItem, ShellContent } from "@/content/types";

type SiteHeaderProps = {
  locale: Locale;
  page: PageKey;
  content: ShellContent;
  navItems: NavItem[];
};

export function SiteHeader({ locale, page, content, navItems }: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuLeft, setMenuLeft] = useState<number | null>(null);
  const menuSlotRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
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

    const handleResize = () => {
      updateScrolled();
      setIsMobileMenuOpen(false);
    };

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", updateScrolled);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const handleOutsidePointer = (event: PointerEvent) => {
      const target = event.target instanceof Node ? event.target : null;

      if (!target) {
        return;
      }

      const clickedMenu = mobileMenuRef.current?.contains(target);
      const clickedButton = mobileMenuButtonRef.current?.contains(target);

      if (!clickedMenu && !clickedButton) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsidePointer);

    return () => {
      document.removeEventListener("pointerdown", handleOutsidePointer);
    };
  }, [isMobileMenuOpen]);

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
        className="mx-auto grid w-[min(100%,var(--shell-width))] max-w-[var(--shell-width)] grid-cols-[auto_1fr_auto] items-center gap-3 min-[810px]:gap-6"
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
        <button
          ref={mobileMenuButtonRef}
          className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-button)] border border-white/[0.18] bg-white/[0.08] text-white transition-colors hover:bg-white/[0.14] min-[810px]:hidden"
          type="button"
          aria-label={isMobileMenuOpen ? content.nav.closeMenu : content.nav.openMenu}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMobileMenuOpen((current) => !current)}
        >
          {isMobileMenuOpen ? <XIcon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" /> : <MenuIcon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />}
        </button>
      </nav>
      <div
        ref={mobileMenuRef}
        className={`mx-auto mt-3 w-[min(100%,var(--shell-width))] max-w-[var(--shell-width)] overflow-hidden rounded-[calc(var(--radius-panel)-12px)] border border-white/[0.14] bg-[#070b18]/95 shadow-[0_18px_54px_rgba(2,2,13,0.28)] transition-[max-height,opacity] duration-200 min-[810px]:hidden ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        id="mobile-navigation"
      >
        <div className="grid gap-1 p-2 text-[0.96rem] font-medium">
          {headerItems.map((item, index) => {
            const isActive = item.page === page;
            const isPrimaryAction = index === headerItems.length - 1;

            return (
              <Link
                className={`rounded-[var(--radius-button)] px-3.5 py-3 transition-colors ${
                  isActive
                    ? "site-menu-link-active bg-white"
                    : isPrimaryAction
                      ? "bg-[var(--color-blue)] text-white"
                      : "text-white/78 hover:bg-white/[0.08] hover:text-white"
                }`}
                href={item.href}
                key={item.page}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
