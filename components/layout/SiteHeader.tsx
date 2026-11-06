"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right.mjs";
import ChevronDownIcon from "lucide-react/dist/esm/icons/chevron-down.mjs";
import type { Locale } from "@/lib/i18n/config";
import { localizePath, type PageKey } from "@/lib/i18n/routes";
import type { NavItem, ShellContent } from "@/content/types";

type SiteHeaderProps = {
  locale: Locale;
  page: PageKey;
  content: ShellContent;
  navItems: NavItem[];
};

const drawerId = "opero-drawer";
const phoneMenuId = "phone-menu";
/** The width from which the links fit in the bar. Under it they move into the phone menu. */
const WIDE_QUERY = "(min-width: 810px)";

const menuLinkClass =
  "inline-flex h-11 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[1.02rem] font-medium transition-colors duration-200 hover:bg-white/[0.06] hover:text-white aria-expanded:bg-white/[0.06] aria-expanded:text-white";
/** The page you are on is simply the lighter word. Kept apart from the rest of the link, or the dimmer colour wins the cascade. */
const linkColour = (isActive: boolean) => (isActive ? "text-white" : "text-white/[0.66]");
const actionClass =
  "inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[var(--color-mist)] px-6 font-display text-[0.98rem] font-medium text-[var(--color-ink)] transition-colors duration-200 hover:bg-white";

/**
 * The logo, the menu next to it, and the one action at the far end. There is no
 * link home in the menu, because the logo is that link.
 *
 * Every page opens on graphite, so the bar starts transparent with light text
 * and turns into dark glass once the page moves. It never has to guess what it
 * is sitting on.
 */
export function SiteHeader({ locale, page, content, navItems }: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPhoneMenuOpen, setIsPhoneMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const links = navItems.filter((item) => item.page !== "solutions" && item.page !== "contact");
  const action = navItems.find((item) => item.page === "contact");
  const opero = navItems.find((item) => item.submenu?.length);

  useEffect(() => {
    const updateScrolled = () => setIsScrolled(window.scrollY > 8);

    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });

    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  // Escape and a click outside both close the drawer.
  useEffect(() => {
    if (!isDrawerOpen) return undefined;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsDrawerOpen(false);
    };
    const handleOutsidePointer = (event: PointerEvent) => {
      if (!drawerRef.current?.contains(event.target as Node)) setIsDrawerOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("pointerdown", handleOutsidePointer);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("pointerdown", handleOutsidePointer);
    };
  }, [isDrawerOpen]);

  // The phone menu covers the page, so the page under it must not scroll, and it has no place on a wide screen.
  useEffect(() => {
    if (!isPhoneMenuOpen) return undefined;

    const wide = window.matchMedia(WIDE_QUERY);
    const close = () => setIsPhoneMenuOpen(false);
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.documentElement.classList.add("menu-open");
    document.addEventListener("keydown", handleEscape);
    wide.addEventListener("change", close);

    return () => {
      document.documentElement.classList.remove("menu-open");
      document.removeEventListener("keydown", handleEscape);
      wide.removeEventListener("change", close);
    };
  }, [isPhoneMenuOpen]);

  const closePhoneMenu = () => setIsPhoneMenuOpen(false);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 text-white transition-[background-color,box-shadow] duration-300 ${
        isScrolled || isPhoneMenuOpen ? "bg-[rgba(11,17,22,0.88)] shadow-[0_1px_0_rgba(242,245,247,0.12)] backdrop-blur-[16px]" : ""
      }`}
    >
      <nav className="mx-auto flex h-[4.5rem] w-[min(100%,var(--shell-width))] items-center gap-7 px-[var(--page-gutter)]" aria-label="Primary navigation">
        <Link className="shrink-0" href={localizePath(locale, "home")} aria-label={content.brand}>
          <Image className="h-7 w-auto" src="/branding/kodasoft-logo-white.svg" width={848} height={224} alt="" aria-hidden="true" priority />
        </Link>

        <div className="mr-auto flex items-center gap-1 max-[809px]:hidden">
          {links.map((item) => {
            const isActive = item.page === page;

            if (!item.submenu?.length) {
              return (
                <Link className={`${menuLinkClass} ${linkColour(isActive)}`} href={item.href} key={item.page} aria-current={isActive ? "page" : undefined}>
                  {item.label}
                </Link>
              );
            }

            return (
              <div
                className="relative"
                key={item.page}
                ref={drawerRef}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) closeDrawer();
                }}
              >
                <button
                  className={`${menuLinkClass} ${linkColour(isActive)}`}
                  type="button"
                  aria-expanded={isDrawerOpen}
                  aria-controls={drawerId}
                  onClick={() => setIsDrawerOpen((open) => !open)}
                >
                  {item.label}
                  <ChevronDownIcon className={`h-3.5 w-3.5 transition-transform duration-300 ${isDrawerOpen ? "rotate-180" : ""}`} strokeWidth={2} aria-hidden="true" />
                </button>

                {/* The whole platform on one side, and every area of it by name on the other. */}
                <div className="site-drawer absolute -left-3 top-[calc(100%+0.75rem)] w-max" hidden={!isDrawerOpen} id={drawerId}>
                  <div className="grid grid-cols-[10.5rem_auto] rounded-[16px] border border-white/[0.12] bg-[#111920]">
                    <Link className="group flex flex-col gap-2 p-4" href={item.href} onClick={closeDrawer}>
                      <span className="font-display text-[1.05rem] font-semibold tracking-[-0.02em] text-white">{content.nav.exploreOpero}</span>
                      <span className="text-[0.85rem] leading-[1.45] text-white/[0.62]">{content.nav.exploreOperoText}</span>
                      <ArrowRightIcon className="mt-auto h-4 w-4 text-[var(--color-blue-soft)] transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                    {/* As wide as the longest line, so that neither a name nor what it does ever breaks onto a second one. */}
                    <ul className="m-0 grid list-none grid-cols-[repeat(2,max-content)] content-start gap-0.5 border-l border-white/[0.12] p-2">
                      {item.submenu.map((subItem) => (
                        <li key={subItem.feature}>
                          <Link className="group block whitespace-nowrap rounded-[10px] px-2.5 py-2 text-[0.95rem] font-semibold text-[var(--color-mist)] transition-colors hover:bg-white/[0.06] hover:text-white" href={subItem.href} onClick={closeDrawer}>
                            {subItem.label}
                            <span className="mt-0.5 block text-[0.82rem] font-normal text-white/[0.58] transition-colors group-hover:text-white/[0.72]">{subItem.description}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {action ? (
          <Link className={`${actionClass} max-[809px]:hidden`} href={action.href}>
            {action.label}
          </Link>
        ) : null}

        <button
          className="ml-auto grid h-11 w-11 cursor-pointer place-content-center gap-1.5 rounded-full border border-white/[0.24] min-[810px]:hidden"
          type="button"
          aria-label={isPhoneMenuOpen ? content.nav.closeMenu : content.nav.openMenu}
          aria-expanded={isPhoneMenuOpen}
          aria-controls={phoneMenuId}
          onClick={() => setIsPhoneMenuOpen((open) => !open)}
        >
          <span className={`block h-[1.5px] w-[18px] rounded-full bg-white transition-transform duration-300 ${isPhoneMenuOpen ? "translate-y-[3.75px] rotate-45" : ""}`} />
          <span className={`block h-[1.5px] w-[18px] rounded-full bg-white transition-transform duration-300 ${isPhoneMenuOpen ? "-translate-y-[3.75px] -rotate-45" : ""}`} />
        </button>
      </nav>

      <div className="fixed inset-x-0 bottom-0 top-[4.5rem] overflow-y-auto bg-[var(--color-surface-dark)] min-[810px]:hidden" hidden={!isPhoneMenuOpen} id={phoneMenuId}>
        <div className="grid gap-7 px-[var(--page-gutter)] pb-12 pt-6">
          {opero ? (
            <div>
              <Link className="block font-display text-[1.3rem] font-semibold tracking-[-0.02em] text-white" href={opero.href} onClick={closePhoneMenu}>
                {content.nav.exploreOpero}
              </Link>
              <ul className="m-0 mt-3 grid list-none p-0">
                {opero.submenu?.map((subItem) => (
                  <li key={subItem.feature}>
                    <Link className="block py-2 text-[0.95rem] text-white/[0.86]" href={subItem.href} onClick={closePhoneMenu}>
                      {subItem.label}
                      <span className="mt-0.5 block text-[0.82rem] text-white/[0.58]">{subItem.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <ul className="m-0 grid list-none border-t border-white/[0.12] p-0">
            {links
              .filter((item) => !item.submenu?.length)
              .map((item) => (
                <li className="border-b border-white/[0.12]" key={item.page}>
                  <Link className="block py-3.5 font-display text-[1.3rem] font-semibold tracking-[-0.02em] text-white" href={item.href} onClick={closePhoneMenu} aria-current={item.page === page ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>

          {action ? (
            <Link className={`${actionClass} justify-self-start`} href={action.href} onClick={closePhoneMenu}>
              {action.label}
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
