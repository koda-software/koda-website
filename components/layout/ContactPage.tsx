import type { Locale } from "@/lib/i18n/config";
import type { ContactPageContent } from "@/content/types";
import { PageHero } from "@/components/landing/LandingPrimitives";
import { ContactForm } from "./ContactForm";
import { TwoTone } from "@/components/landing/TwoTone";

type ContactPageProps = {
  locale: Locale;
  content: ContactPageContent;
  /** The company's address and number, as the footer shows them. */
  reach: { email?: string; phone?: string };
};

const shellClass = "mx-auto w-[min(100%,var(--shell-width))] px-[var(--page-gutter)]";
const sectionClass = `${shellClass} py-[var(--section-y)]`;
const bodyClass = "m-0 text-[1.04rem] leading-[1.7] text-[var(--color-muted)]";

export function ContactPage({ locale, content, reach }: ContactPageProps) {
  return (
    <>
      <PageHero
        description={content.hero.description}
        photo="meeting"
        title={content.hero.title}
        titleClassName="max-w-[940px]"
      />

      <section className={`${sectionClass} grid grid-cols-[minmax(0,0.78fr)_minmax(24rem,0.74fr)] gap-16 max-[980px]:grid-cols-1`}>
        <div>
          <h2 className="m-0 max-w-[760px] text-[2.5rem] leading-[1.1] text-[var(--color-ink)] max-[809px]:text-[1.75rem]"><TwoTone text={content.context.title} /></h2>
          <div className="mt-7 grid gap-5">
            {content.context.paragraphs.map((paragraph) => (
              <p className={bodyClass} key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-10 grid gap-3 border-t border-[rgba(2,2,13,0.12)] pt-7">
            {reach.email ? (
              <a className="w-fit text-[1.3rem] font-semibold text-[var(--color-ink)] transition-colors duration-150 hover:text-[var(--color-blue)]" href={`mailto:${reach.email}`}>
                {reach.email}
              </a>
            ) : null}
            {reach.phone ? (
              <a className="w-fit text-[1.3rem] font-semibold text-[var(--color-ink)] transition-colors duration-150 hover:text-[var(--color-blue)]" href={`tel:${reach.phone.replaceAll(" ", "")}`}>
                {reach.phone}
              </a>
            ) : null}
          </div>
        </div>

        <aside className="self-start rounded-[var(--radius-panel)] border border-[rgba(2,2,13,0.1)] bg-[var(--color-paper)] p-7 shadow-[0_18px_48px_rgba(2,2,13,0.05)] max-[809px]:p-5">
          <ContactForm locale={locale} content={content.form} />
        </aside>
      </section>
    </>
  );
}
