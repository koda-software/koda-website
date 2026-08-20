import type { Locale } from "@/lib/i18n/config";
import type { LegalSection, PrivacyContent } from "@/content/types";
import { PageHero } from "@/components/landing/LandingPrimitives";

type LegalPageProps = {
  content: PrivacyContent;
  locale: Locale;
};

/**
 * A legal document: a banner, then long-form text at a reading measure.
 *
 * Built as its own layout rather than reusing the marketing page scaffolds,
 * because everything those do for a landing page works against a document
 * somebody has to read carefully. There are no cards, no reveal animations and
 * no visual to compete with the words, and the column is capped at roughly
 * 68 characters - the width prose stays legible at.
 *
 * The banner takes no photograph on purpose. A privacy policy is the one page
 * where a stock office shot would read as decoration over something that ought
 * to be plain.
 */
export function LegalPage({ content, locale }: LegalPageProps) {
  const updated = new Intl.DateTimeFormat(locale === "pl" ? "pl-PL" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(content.updatedAt));

  return (
    <>
      <PageHero
        description={content.hero.description}
        eyebrow={content.hero.eyebrow}
        sectionClassName="!min-h-[19rem] pb-[clamp(3rem,6vw,4.5rem)] pt-[clamp(7rem,11vw,9rem)]"
        title={content.hero.title}
      />

      <section className="mx-auto w-[min(100%,var(--shell-width))] px-[var(--page-gutter)] py-[var(--section-y)]">
        <div className="max-w-[46rem]">
          <p className="m-0 text-[0.86rem] text-[var(--color-muted)]">
            {content.updatedLabel}:{" "}
            <time dateTime={content.updatedAt}>{updated}</time>
          </p>

          <div className="mt-[clamp(2.5rem,5vw,3.5rem)] grid gap-[clamp(2.25rem,4vw,3rem)]">
            {content.sections.map((section) => (
              <Section key={section.heading} section={section} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Section({ section }: { section: LegalSection }) {
  return (
    <section>
      <h2 className="m-0 text-[clamp(1.15rem,1.7vw,1.35rem)] font-medium leading-[1.25] tracking-[-0.02em] text-[var(--color-ink)]">
        {section.heading}
      </h2>

      {section.paragraphs?.map((paragraph) => (
        <p
          className="mt-4 text-[1rem] font-light leading-[1.7] text-[var(--color-muted)]"
          key={paragraph}
        >
          {paragraph}
        </p>
      ))}

      {section.list ? (
        <ul className="mt-4 grid list-none gap-2.5 p-0">
          {section.list.map((item) => (
            <li
              className="relative pl-5 text-[1rem] font-light leading-[1.7] text-[var(--color-muted)] before:absolute before:left-0 before:top-[0.72em] before:h-1.5 before:w-1.5 before:rounded-[2px] before:bg-[var(--color-blue)]"
              key={item}
            >
              {item}
            </li>
          ))}
        </ul>
      ) : null}

      {section.rows ? (
        <dl className="mt-5 grid gap-4 border-t border-[var(--color-border-light)] pt-5">
          {section.rows.map((row) => (
            <div key={row.term}>
              <dt className="text-[0.98rem] font-medium leading-[1.45] text-[var(--color-ink)]">
                {row.term}
              </dt>
              <dd className="m-0 mt-1.5 text-[1rem] font-light leading-[1.7] text-[var(--color-muted)]">
                {row.description}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}
