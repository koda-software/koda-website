"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ChevronDownIcon from "lucide-react/dist/esm/icons/chevron-down.mjs";
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

const submenuId = "opero-submenu";

export function SiteHeader({ locale, page, content, navItems }: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [isMobileSubmenuOpen, setIsMobileSubmenuOpen] = useState(false);
  const [menuLeft, setMenuLeft] = useState<number | null>(null);
  const menuSlotRef = useRef<HTMLDivElement>(null);
  const submenuWrapperRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const headerItems = useMemo<NavItem[]>(
    () => [
      {
        page: "home",
        label: content.nav.home,
        href: localizePath(locale, "home"),
      },
      ...navItems,
    ],
    [content.nav.home, locale, navItems],
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

  useEffect(() => {
    if (!isSubmenuOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSubmenuOpen(false);
      }
    };

    const handleOutsidePointer = (event: PointerEvent) => {
      const target = event.target instanceof Node ? event.target : null;

      if (target && !submenuWrapperRef.current?.contains(target)) {
        setIsSubmenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("pointerdown", handleOutsidePointer);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("pointerdown", handleOutsidePointer);
    };
  }, [isSubmenuOpen]);

  function linkClass(isActive: boolean, isPrimaryAction: boolean) {
    return `rounded-full px-3.5 py-2.5 transition-colors duration-200 ${
      isActive
        ? "site-menu-link-active bg-white shadow-[0_8px_24px_rgba(255,255,255,0.22)]"
        : isPrimaryAction
          ? "border border-white/[0.18] bg-white/10 text-white hover:bg-white/[0.16]"
          : "text-white/[0.78] hover:bg-white/10 hover:text-white"
    }`;
  }

  const menuLinks = headerItems.map((item, index) => {
    const isActive = item.page === page;
    const isPrimaryAction = index === headerItems.length - 1;
    if (!item.submenu?.length) {
      return (
        <span key={item.page}>
          <Link className={linkClass(isActive, isPrimaryAction)} href={item.href} aria-current={isActive ? "page" : undefined}>
            {item.label}
          </Link>
        </span>
      );
    }

    // The link and its chevron share one pill so the active white background
    // stays a single shape and the ink-coloured chevron remains readable.
    return (
      <span
        className={`flex items-center ${
          isActive ? "site-menu-link-active rounded-full bg-white shadow-[0_8px_24px_rgba(255,255,255,0.22)]" : ""
        }`}
        key={item.page}
      >
        <Link
          className={isActive ? "rounded-full py-2.5 pl-3.5 pr-2" : linkClass(false, false)}
          href={item.href}
          aria-current={isActive ? "page" : undefined}
        >
          {item.label}
        </Link>
        <button
          className={`inline-flex h-8 w-7 items-center justify-center rounded-full transition-colors ${
            isActive ? "" : "-ml-1.5 text-white/[0.78] hover:text-white"
          }`}
          type="button"
          aria-label={content.nav.toggleSubmenu}
          aria-expanded={isSubmenuOpen}
          aria-controls={submenuId}
          onClick={() => setIsSubmenuOpen((current) => !current)}
        >
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform duration-200 ${isSubmenuOpen ? "rotate-180" : ""}`}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </button>
      </span>
    );
  });

  const submenuItems = headerItems.find((item) => item.submenu?.length)?.submenu ?? [];

  return (
    <header className="absolute inset-x-0 top-0 z-30 px-[var(--page-gutter)] py-4 text-[var(--color-paper)]">
      <nav
        className="mx-auto grid w-[min(100%,var(--shell-width))] max-w-[var(--shell-width)] grid-cols-[auto_1fr_auto] items-center gap-3 min-[810px]:gap-6"
        aria-label="Primary navigation"
      >
        <Link className="shrink-0 px-1" href={localizePath(locale, "home")} aria-label={content.brand}>
          <Image className="h-5 w-auto" src="/branding/kodasoft-logo-white.svg" width={1404} height={247} alt="" aria-hidden="true" priority />
          <span className="sr-only">{content.brand}</span>
        </Link>
        <div ref={menuSlotRef} className="relative flex w-fit max-w-[calc(100vw-2rem)] justify-self-center whitespace-nowrap max-[809px]:hidden">
          <div className="site-menu-pill invisible flex w-fit items-center gap-1 rounded-full p-1 text-[0.86rem] font-medium" aria-hidden="true">
            {headerItems.map((item, index) => {
              const isActive = item.page === page;
              const isPrimaryAction = index === headerItems.length - 1;

              return (
                <span className="flex items-center" key={item.page}>
                  <span className={linkClass(isActive, isPrimaryAction)}>{item.label}</span>
                  {item.submenu?.length ? <span className="-ml-1.5 inline-block h-8 w-7" /> : null}
                </span>
              );
            })}
          </div>
          {/* The pill itself clips its children, so the dropdown lives in this
              wrapper instead — which also keeps hover contiguous between them. */}
          <div
            ref={submenuWrapperRef}
            className="w-max"
            style={{
              position: isScrolled ? "fixed" : "absolute",
              top: isScrolled ? "1rem" : 0,
              left: isScrolled && menuLeft ? `${menuLeft}px` : "50%",
              zIndex: isScrolled ? 40 : 10,
              transform: "translateX(-50%) translateZ(0)",
            }}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setIsSubmenuOpen(false);
              }
            }}
          >
            <div
              className={`site-menu-pill flex w-full items-center gap-1 rounded-full p-1 text-[0.86rem] font-medium transition-[top,background,border-color,box-shadow] duration-300 ease-out ${
                isScrolled ? "site-menu-pill-scrolled" : ""
              }`}
              style={{
                WebkitBackdropFilter: isScrolled ? "blur(6px) saturate(140%) contrast(104%)" : "blur(4px) saturate(130%) contrast(102%)",
                backdropFilter: isScrolled ? "blur(6px) saturate(140%) contrast(104%)" : "blur(4px) saturate(130%) contrast(102%)",
              }}
              aria-label="Main pages"
            >
              {menuLinks}
            </div>
            {submenuItems.length ? (
              <div
                className={`absolute inset-x-0 top-full pt-2 transition-opacity duration-150 ${
                  isSubmenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                id={submenuId}
                hidden={!isSubmenuOpen}
              >
                {/* Same glass treatment as the menu pill, so the dropdown reads
                    as an extension of it rather than a separate dark panel. */}
                <div
                  className="site-menu-pill site-menu-pill-scrolled grid grid-cols-2 gap-1 rounded-[calc(var(--radius-panel)-10px)] p-1.5"
                  style={{
                    WebkitBackdropFilter: "blur(6px) saturate(140%) contrast(104%)",
                    backdropFilter: "blur(6px) saturate(140%) contrast(104%)",
                  }}
                >
                  {submenuItems.map((subItem) => (
                    <Link
                      className="rounded-full px-3.5 py-2.5 text-[0.86rem] font-medium text-white/[0.78] transition-colors hover:bg-white/10 hover:text-white"
                      href={subItem.href}
                      key={subItem.feature}
                      onClick={() => setIsSubmenuOpen(false)}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
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
        className={`mx-auto mt-3 w-[min(100%,var(--shell-width))] max-w-[var(--shell-width)] overflow-y-auto rounded-[calc(var(--radius-panel)-12px)] border border-white/[0.14] bg-[#070b18]/95 shadow-[0_18px_54px_rgba(2,2,13,0.28)] transition-[max-height,opacity] duration-200 min-[810px]:hidden ${
          isMobileMenuOpen ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0"
        }`}
        id="mobile-navigation"
      >
        <div className="grid gap-1 p-2 text-[0.96rem] font-medium">
          {headerItems.map((item, index) => {
            const isActive = item.page === page;
            const isPrimaryAction = index === headerItems.length - 1;
            const rowClass = `rounded-[var(--radius-button)] px-3.5 py-3 transition-colors ${
              isActive
                ? "site-menu-link-active bg-white"
                : isPrimaryAction
                  ? "bg-[var(--color-blue)] text-white"
                  : "text-white/78 hover:bg-white/[0.08] hover:text-white"
            }`;

            if (!item.submenu?.length) {
              return (
                <Link
                  className={rowClass}
                  href={item.href}
                  key={item.page}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <div key={item.page}>
                <div className="flex items-center gap-1">
                  <Link
                    className={`${rowClass} flex-1`}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                  <button
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-button)] text-white/78 transition-colors hover:bg-white/[0.08] hover:text-white"
                    type="button"
                    aria-label={content.nav.toggleSubmenu}
                    aria-expanded={isMobileSubmenuOpen}
                    aria-controls={`${submenuId}-mobile`}
                    onClick={() => setIsMobileSubmenuOpen((current) => !current)}
                  >
                    <ChevronDownIcon
                      className={`h-5 w-5 transition-transform duration-200 ${isMobileSubmenuOpen ? "rotate-180" : ""}`}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </button>
                </div>
                <div className="grid gap-1 pl-3 pt-1" id={`${submenuId}-mobile`} hidden={!isMobileSubmenuOpen}>
                  {item.submenu.map((subItem) => (
                    <Link
                      className="rounded-[var(--radius-button)] px-3.5 py-2.5 text-[0.9rem] font-normal text-white/[0.68] transition-colors hover:bg-white/[0.08] hover:text-white"
                      href={subItem.href}
                      key={subItem.feature}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
