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
 * The footer, in three bands.
 *
 * It used to be a wide two-column block: a headline on the left, one flat list
 * of six links on the right, and a stretch of empty gradient between them. The
 * bottom bar said "KodaSoft" on one side and "Low-code BPM by KodaSoft" on the
 * other, which is the same sentence twice.
 *
 * The shape here follows the one worked out for Necto - an invitation to make
 * contact, then grouped navigation, then a legal line - with one deliberate
 * difference. Necto's fourth column carries a registered office and company
 * numbers; KodaSoft has no registered entity yet, so that column carries ways
 * to get in touch instead. A footer that omits registration data reads as a
 * young product company. A footer that invents it reads as something worse.
 *
 * Every value that does not exist yet is optional in the content type rather
 * than a placeholder string, so nothing renders until it is real.
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

      {/* Band 1 - the invitation. */}
      <div className="relative mx-auto w-[min(100%,var(--shell-width))] border-b border-white/[0.1] py-[clamp(3.5rem,7vw,5.5rem)]">
        {/*
          The band is a three-column grid: copy, the elbow, then the cards at a
          fixed 26rem. The elbow needs a column of its own because it has to
          span from the flow row up to the card row, and only a grid cell can
          do that while both rows keep resizing with their content. The card
          column is a fixed width for the same reason - the elbow has to end
          exactly at its left edge, which an `fr` cannot promise.
        */}
        <div className="grid grid-cols-[minmax(0,1fr)_5rem_26rem] gap-y-[clamp(2rem,4vw,3rem)] max-[980px]:grid-cols-1 max-[980px]:gap-y-8">
          <div className="col-start-1 row-start-1 self-center max-[980px]:col-auto max-[980px]:row-auto">
            <p className="eyebrow mb-4 font-sans text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-blue-soft)]">
              {footer.contact.eyebrow}
            </p>
            <h2 className="m-0 max-w-[30rem] text-[clamp(1.7rem,3vw,2.3rem)] font-medium leading-[1.12] tracking-[-0.035em] text-white">
              {footer.contact.title}
            </h2>
            <p className="mt-5 max-w-[34rem] text-[1rem] font-light leading-[1.65] text-white/68">
              {footer.contact.description}
            </p>
          </div>

          {/*
            The reader's own route to the email card: the problem they arrived
            with, then finding out there is an answer, then writing to us. The
            card is the third stage, which is why the line ends on it rather
            than near it. Decorative in the sense that it repeats nothing a
            screen reader needs - the card underneath is a plain link.
          */}
          <div className="col-start-1 row-start-2 flex items-center gap-0 self-center max-[980px]:col-auto max-[980px]:row-auto max-[980px]:flex-col max-[980px]:items-stretch" aria-hidden="true">
            <FlowStep delay={0} label={footer.contact.flowSteps[0]} />
            <FlowLink />
            <FlowStep delay={1.7} label={footer.contact.flowSteps[1]} />
            {/* Below 980px the elbow is gone, so the run needs its own last
                leg down into the card. */}
            <FlowLink className="min-[981px]:hidden" />
          </div>

          {/* The elbow: up out of the flow row, then right into the card. */}
          <div className="relative col-start-2 row-start-1 row-span-2 max-[980px]:hidden" aria-hidden="true">
            <div className="flow-elbow absolute inset-0 mb-[1.6rem] mt-[2.4rem] rounded-tl-[1.75rem] border-l border-t border-[rgba(56,182,255,0.35)]" style={{ animationDelay: "2.5s" }}>
            </div>
            <span className="flow-elbow absolute right-0 top-[2.4rem] block h-0 w-0 -translate-y-1/2 border-y-[5px] border-l-[7px] border-y-transparent border-l-[rgba(56,182,255,0.55)]" style={{ animationDelay: "2.5s" }} />
          </div>

          <div className="col-start-3 row-start-1 row-span-2 grid content-start gap-3 max-[980px]:col-auto max-[980px]:row-auto max-[980px]:-mt-8">
            {footer.contact.email ? (
              <ContactCard
                className="process-endpoint"
                href={`mailto:${footer.contact.email}`}
                label={footer.contact.emailLabel}
                truncate
                value={footer.contact.email}
                icon={
                  <>
                    <rect x="2.5" y="4.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="m3 6 7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  </>
                }
              />
            ) : null}

            {footer.contact.phone ? (
              <ContactCard
                href={`tel:${footer.contact.phone.replace(/[^+\d]/g, "")}`}
                label={footer.contact.phoneLabel}
                value={footer.contact.phone}
                icon={
                  <path
                    d="M4.2 3h3l1.4 3.6L6.9 8.2a10 10 0 0 0 4.9 4.9l1.6-1.7L17 12.8v3a1.5 1.5 0 0 1-1.7 1.5A13.5 13.5 0 0 1 2.7 4.7 1.5 1.5 0 0 1 4.2 3Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                }
              />
            ) : null}

            <ContactCard
              href={contactHref}
              label={footer.contact.formLabel}
              value={footer.contact.formHint}
              valueClassName="text-[0.95rem] font-normal text-white/70"
              icon={
                <path
                  d="M4 10h12m0 0-4.5-4.5M16 10l-4.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              }
            />
          </div>
        </div>
      </div>

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

/**
 * One stage on the way to the contact card. These carry real words: the
 * abstract version - an icon square and two rules - read as a decorative
 * pattern rather than as a process, which was the whole point.
 */
function FlowStep({ delay, label }: { delay: number; label: string }) {
  return (
    <div
      className="flow-step relative flex-1 rounded-[var(--radius-card)] border border-[rgba(56,182,255,0.3)] bg-[rgba(56,182,255,0.05)] px-4 py-3 text-[0.86rem] font-normal leading-[1.35] text-white/70 max-[980px]:flex-none"
      style={{ animationDelay: `${delay}s` }}
    >
      {label}
    </div>
  );
}

/**
 * The line between two stages. Static: a light running along it was tried and
 * dropped - at this scale the moving glow read as a smear beside the line
 * rather than as anything travelling through it. The sequence is carried by
 * the stages lighting up in order instead.
 */
function FlowLink({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-px w-20 flex-none bg-[rgba(56,182,255,0.35)] max-[980px]:ml-[1.5rem] max-[980px]:h-5 max-[980px]:w-px ${className}`.trim()}
    />
  );
}

/**
 * One way to reach the company. A whole card is the target rather than the
 * value inside it, which is what makes it comfortable to hit on a phone.
 */
function ContactCard({
  className = "",
  href,
  icon,
  label,
  truncate = false,
  value,
  valueClassName = "text-[1.05rem] font-medium text-white",
}: {
  className?: string;
  href: string;
  icon: React.ReactNode;
  label: string;
  /** Only for an email address, which must not break mid-string. */
  truncate?: boolean;
  value: string;
  valueClassName?: string;
}) {
  return (
    <Link
      className={`flex min-w-0 items-center gap-4 rounded-[var(--radius-card)] border border-white/[0.12] bg-white/[0.045] p-4 transition-colors duration-200 hover:border-[rgba(56,182,255,0.4)] hover:bg-white/[0.075] ${className}`.trim()}
      href={href}
    >
      <span
        className="grid h-11 w-11 flex-none place-content-center rounded-[var(--radius-button)] bg-[rgba(56,182,255,0.12)] text-[var(--color-blue-soft)]"
        aria-hidden="true"
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
          {icon}
        </svg>
      </span>
      <span className="min-w-0">
        <span className="block text-[0.82rem] text-white/62">{label}</span>
        <span className={`block ${truncate ? "truncate" : ""} ${valueClassName}`.replace(/\s+/g, " ")}>{value}</span>
      </span>
    </Link>
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
