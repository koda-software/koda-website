import type { Locale } from "@/lib/i18n/config";
import type { ContactPageContent } from "@/content/types";
import { HeroTitle } from "@/components/landing/LandingPrimitives";
import { ContactForm } from "./ContactForm";

type ContactPageProps = {
  locale: Locale;
  content: ContactPageContent;
};

const shellClass = "mx-auto w-[min(100%,var(--shell-width))] px-[var(--page-gutter)]";
const sectionClass = `${shellClass} py-[var(--section-y)]`;
const eyebrowClass = "mb-4 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-blue)]";
const darkEyebrowClass = "mb-4 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-blue-soft)]";
const bodyClass = "m-0 text-[1.04rem] font-light leading-[1.7] text-[var(--color-muted)]";

export function ContactPage({ locale, content }: ContactPageProps) {
  return (
    <>
      <section className="flex min-h-screen items-center overflow-hidden bg-[#000407] [background-image:var(--gradient-hero)] px-[var(--page-gutter)] pb-[5rem] pt-[10rem] text-white max-[809px]:pt-28">
        <div className="mx-auto w-[min(100%,var(--shell-width))]">
          <div>
            <p className={`${darkEyebrowClass} hero-rise`}>{content.hero.eyebrow}</p>
            <div className="hero-rise hero-d1"><HeroTitle className="max-w-[940px]" title={content.hero.title} /></div>
            <p className="hero-rise hero-d2 mt-6 max-w-[760px] text-[1.18rem] font-light leading-[1.6] text-white/74 max-[809px]:text-[1.04rem]">
              {content.hero.description}
            </p>
          </div>
        </div>
      </section>

      <section className={`${sectionClass} grid grid-cols-[minmax(0,0.78fr)_minmax(24rem,0.74fr)] gap-16 max-[980px]:grid-cols-1`}>
        <div>
          <p className={eyebrowClass}>{content.context.eyebrow}</p>
          <h2 className="m-0 max-w-[760px] text-[2.5rem] leading-[1.1] text-[var(--color-ink)] max-[809px]:text-[1.75rem]">{content.context.title}</h2>
          <div className="mt-7 grid gap-5">
            {content.context.paragraphs.map((paragraph) => (
              <p className={bodyClass} key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 border-y border-[rgba(2,2,13,0.12)] py-7">
            <h3 className="m-0 text-[1.3rem] font-medium text-[var(--color-ink)]">{content.topics.title}</h3>
            <div className="mt-6 grid gap-5">
              {content.topics.items.map((item) => (
                <article className="grid grid-cols-[minmax(10rem,0.38fr)_minmax(0,1fr)] gap-6 border-t border-[rgba(2,2,13,0.08)] pt-5 first:border-t-0 first:pt-0 max-[809px]:grid-cols-1 max-[809px]:gap-2" key={item.title}>
                  <h4 className="m-0 text-[1rem] font-medium leading-[1.45] text-[var(--color-ink)]">{item.title}</h4>
                  <p className={`${bodyClass} text-[0.96rem]`}>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>

        <aside className="self-start rounded-[var(--radius-panel)] border border-[rgba(2,2,13,0.1)] bg-[var(--color-paper-soft)] p-7 shadow-[0_18px_48px_rgba(2,2,13,0.05)] max-[809px]:p-5">
          <ContactForm locale={locale} content={content.form} />
        </aside>
      </section>
    </>
  );
}
