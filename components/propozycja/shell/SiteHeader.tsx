"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav, routes, systemNav } from "../content-nav";
import { icons, KodaSoftMark } from "../ui";

/**
 * The site's header: the mark, a menu whose every item is labelled, and the
 * one action. There is no second bar of the page's own sections under it:
 * the pages are short enough to read top to bottom, and a row of section
 * names under the menu only competed with it.
 *
 * Every page opens on a graphite scene, so the bar starts transparent with
 * light text and turns into dark glass once the page moves. It never has to
 * guess what it is sitting on.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [systemOpen, setSystemOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const systemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Escape and a click outside both close the Opero panel. */
  useEffect(() => {
    if (!systemOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setSystemOpen(false);
    const onPointer = (event: PointerEvent) => {
      if (!systemRef.current?.contains(event.target as Node)) setSystemOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [systemOpen]);

  /* The phone menu covers the page, so the page underneath must not scroll. */
  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", menuOpen);
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const isActive = (href: string) => href !== routes.blog && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header className={`site-bar ${scrolled ? "is-scrolled" : ""} ${menuOpen ? "is-menu" : ""}`.trim()}>
      <a className="skip-link" href="#tresc">
        Przejdź do treści
      </a>
      <div className="site-bar__row">
        <Link aria-label="KodaSoft, strona główna" className="site-bar__mark" href={routes.home}>
          <KodaSoftMark label="" on="dark" />
        </Link>

        <nav aria-label="Menu główne" className="site-nav">
          <div className="site-nav__system" ref={systemRef}>
            <button
              aria-controls="menu-system"
              aria-expanded={systemOpen}
              className={`site-nav__link ${isActive(routes.system) ? "is-active" : ""}`.trim()}
              onClick={() => setSystemOpen((open) => !open)}
              type="button"
            >
              Opero
              <span aria-hidden="true" className={`site-nav__chevron ${systemOpen ? "is-open" : ""}`.trim()}>
                {icons.chevron}
              </span>
            </button>
            <div className="mega" hidden={!systemOpen} id="menu-system">
              <Link className="mega__overview" href={routes.system} onClick={() => setSystemOpen(false)}>
                <span className="mega__overview-title">Platforma Opero</span>
                <span className="mega__overview-text">
                  Jedna architektura, na której powstają aplikacje dla każdego obszaru organizacji.
                </span>
                <span className="mega__overview-more">
                  Zobacz całość {icons.arrowRight}
                </span>
              </Link>
              <ul className="mega__grid">
                {systemNav.map((item) => (
                  <li key={item.href}>
                    <Link className="mega__item" href={item.href} onClick={() => setSystemOpen(false)}>
                      <span className="mega__item-title">{item.label}</span>
                      <span className="mega__item-text">{item.blurb}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {mainNav.slice(1).map((item) => (
            <Link className={`site-nav__link ${isActive(item.href) ? "is-active" : ""}`.trim()} href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="site-bar__end">
          <Link className="btn btn--mist site-bar__cta" href={routes.contact}>
            Umów demo
          </Link>
          <button
            aria-controls="menu-phone"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
            className="site-bar__burger"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className="phone-menu" hidden={!menuOpen} id="menu-phone">
        <nav aria-label="Menu" className="phone-menu__inner">
          <p className="phone-menu__group">Opero</p>
          <ul className="phone-menu__system">
            <li>
              <Link href={routes.system} onClick={() => setMenuOpen(false)}>
                Platforma Opero
              </Link>
            </li>
            {systemNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="phone-menu__main">
            {mainNav.slice(1).map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link className="btn btn--mist phone-menu__cta" href={routes.contact} onClick={() => setMenuOpen(false)}>
            Umów demo {icons.arrowRight}
          </Link>
        </nav>
      </div>
    </header>
  );
}
