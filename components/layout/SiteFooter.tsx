import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import { localizePath, type PageKey } from "@/lib/i18n/routes";
import type { NavItem, NavSubItem, ShellContent } from "@/content/types";
import { siteConfig } from "@/lib/seo/site";
import { LanguageSwitcher } from "./LanguageSwitcher";

type SiteFooterProps = {
  locale: Locale;
  page: PageKey;
  content: ShellContent;
  navItems: NavItem[];
  alternatePaths?: Partial<Record<Locale, string>>;
};

/**
 * The footer: grouped navigation, then a legal line.
 *
 * It used to be a wide two-column block - a headline on the left, one flat list
 * of six links on the right, and a stretch of empty gradient between them - and
 * the bottom bar said "KodaSoft" on one side and "Low-code BPM by KodaSoft" on
 * the other, which is the same sentence twice.
 *
 * An opening band inviting contact sat above these columns for a while, with an
 * animated process leading into a set of contact cards. It was removed on
 * request; the closing column carries the address, the number and the way
 * through to the demo form instead.
 *
 * Necto's equivalent fourth column carries a registered office and company
 * numbers. KodaSoft has no registered entity yet, so this one carries ways to
 * get in touch. A footer that omits registration data reads as a young product
 * company; one that invents it reads as something worse - which is why every
 * value that does not exist yet is optional in the content type rather than a
 * placeholder string.
 */
export function SiteFooter({ locale, page, content, navItems, alternatePaths }: SiteFooterProps) {
  const { footer } = content;
  const year = new Date().getFullYear();
  const operoHref = localizePath(locale, "opero");
  const contactHref = localizePath(locale, "contact");

  /* The module list already drives the Opero dropdown; the footer reads the
     same source rather than keeping a second copy that can drift. */
  const moduleItems: NavSubItem[] =
    navItems.find((item) => item.page === "opero")?.submenu ?? [];

  /* Everything in the header except Opero, which has its own column, and the
     demo, which belongs with the contact links. */
  const companyItems = navItems.filter(
    (item) => item.page !== "opero" && item.page !== "contact",
  );

  return (
    <footer className="relative isolate overflow-hidden bg-[var(--color-surface-dark)] [background:var(--gradient-footer)] px-[var(--page-gutter)] text-[var(--color-paper)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(126,231,255,0.45),rgba(56,182,255,0.42),transparent)]"
        aria-hidden="true"
      />

      {/* Band 2 - grouped navigation. */}
      <div className="relative mx-auto grid w-[min(100%,var(--shell-width))] gap-x-[clamp(1.5rem,4vw,3.5rem)] gap-y-10 py-[clamp(3rem,6vw,4.5rem)] grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))] max-[980px]:grid-cols-2 max-[560px]:grid-cols-1">
        <div>
          <Link className="inline-block" href={localizePath(locale, "home")} aria-label={content.brand}>
            <Image
              className="h-6 w-auto"
              src="/branding/kodasoft-logo-white.svg"
              width={1404}
              height={247}
              alt=""
              aria-hidden="true"
            />
            <span className="sr-only">{content.brand}</span>
          </Link>
          <p className="mt-5 max-w-[22rem] text-[0.95rem] font-light leading-[1.6] text-white/65">
            {footer.tagline}
          </p>
          <a
            className="mt-6 inline-grid h-10 w-10 place-content-center rounded-[var(--radius-button)] border border-white/[0.14] text-white/68 transition-colors hover:border-[rgba(56,182,255,0.45)] hover:text-white"
            href={siteConfig.sameAs[0]}
            rel="noopener noreferrer"
            target="_blank"
            aria-label={footer.linkedinLabel}
          >
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M3.4 5.3H.9V15h2.5V5.3ZM2.1 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM15 9.6c0-2.6-1.4-3.8-3.2-3.8-1.5 0-2.2.8-2.5 1.4V5.3H6.8V15h2.5V9.7c0-1.1.7-1.7 1.5-1.7s1.4.5 1.4 1.7V15H15V9.6Z" />
            </svg>
          </a>
        </div>

        <FooterNav heading={footer.productHeading}>
          <FooterLink href={operoHref}>{content.nav.exploreOpero}</FooterLink>
          {moduleItems.map((item) => (
            <FooterLink href={item.href} key={item.feature}>
              {item.label}
            </FooterLink>
          ))}
        </FooterNav>

        <FooterNav heading={footer.companyHeading}>
          {companyItems.map((item) => (
            <FooterLink href={item.href} key={item.page}>
              {item.label}
            </FooterLink>
          ))}
          {footer.links.map((item) => (
            <FooterLink href={item.href} key={item.href}>
              {item.label}
            </FooterLink>
          ))}
        </FooterNav>

        {/*
          The last column used to repeat the address and the number that the
          cards at the top of the footer already carry, one screen higher. A
          reader who scrolled past those does not need them listed again; what
          is worth having here is a quieter way back into the conversation, in
          a different register from the band above.
        */}
        <div>
          <p className="m-0 mb-4 font-sans text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-white">
            {footer.reachHeading}
          </p>
          <p className="m-0 max-w-[18rem] text-[0.92rem] font-light leading-[1.6] text-white/65">
            {footer.talkBody}
          </p>
          {/* The cards that carried these went with the contact band, and a
              footer with no way to reach anyone is a footer with a hole in it.
              They were kept out of this column only because those cards had
              them one screen higher. */}
          <div className="mt-5 grid gap-1.5">
            {footer.contact.email ? (
              <a
                className="inline-flex min-h-6 w-fit items-center text-[0.95rem] font-medium text-white transition-colors hover:text-[var(--color-blue-soft)]"
                href={`mailto:${footer.contact.email}`}
              >
                {footer.contact.email}
              </a>
            ) : null}
            {footer.contact.phone ? (
              <a
                className="inline-flex min-h-6 w-fit items-center text-[0.95rem] font-medium text-white transition-colors hover:text-[var(--color-blue-soft)]"
                href={`tel:${footer.contact.phone.replace(/[^+\d]/g, "")}`}
              >
                {footer.contact.phone}
              </a>
            ) : null}
          </div>
          <Link
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-button)] border border-white/[0.16] px-4 py-2.5 text-[0.92rem] font-medium text-white transition-colors duration-200 hover:border-[rgba(56,182,255,0.45)] hover:bg-white/[0.06]"
            href={contactHref}
          >
            {footer.contact.formLabel}
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 10h12m0 0-4.5-4.5M16 10l-4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Band 3 - the legal line. */}
      <div className="relative mx-auto flex w-[min(100%,var(--shell-width))] flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-white/[0.1] py-7 text-[0.82rem] text-white/65">
        <p className="m-0">
          © {year} {footer.legalName ?? content.brand} - {footer.rights}
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            className="inline-flex min-h-6 items-center text-white/65 transition-colors hover:text-white"
            href={localizePath(locale, "privacy")}
          >
            {footer.privacyLabel}
          </Link>
          <span className="text-white/65">{footer.productLine}</span>
          <LanguageSwitcher
            alternatePaths={alternatePaths}
            locale={locale}
            page={page}
            label={footer.languageLabel}
          />
        </div>
      </div>
    </footer>
  );
}

function FooterNav({ children, heading }: { children: React.ReactNode; heading: string }) {
  return (
    <nav aria-label={heading}>
      <p className="m-0 mb-4 font-sans text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-white">
        {heading}
      </p>
      <ul className="m-0 grid list-none gap-0.5 p-0">{children}</ul>
    </nav>
  );
}

/**
 * `min-h-6` is not decoration: WCAG 2.2 asks for a 24px target, and these links
 * are set small enough that the text alone does not reach it.
 */
function FooterLink({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <li>
      <Link
        className="inline-flex min-h-6 items-center py-0.5 text-[0.92rem] text-white/65 transition-colors duration-200 hover:text-white"
        href={href}
      >
        {children}
      </Link>
    </li>
  );
}
