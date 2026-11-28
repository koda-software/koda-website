import Link from "next/link";
import { PageHero } from "@/components/landing/LandingPrimitives";
import type { GlossaryIndexContent, GlossaryTerm } from "@/content/types";
import { glossaryBasePath, glossaryPath } from "@/lib/i18n/glossary";
import { OperoBand } from "./OperoBand";
import { ToolLinkGrid } from "./ToolPage";
import { ToolFaq, toolBodyClass, toolSectionTitleClass, toolShellClass } from "./toolPrimitives";

const sectionClass = `${toolShellClass} py-[clamp(3rem,6vw,4rem)]`;
const ruleClass = "border-t border-[var(--color-border-light)]";
const linkClass = "text-[var(--color-blue)] underline underline-offset-4 hover:text-[var(--color-blue-deep)]";
const heroClass = "!min-h-[19rem] pb-[clamp(3rem,6vw,4.5rem)] pt-[clamp(7rem,11vw,9rem)]";

type GlossaryCtas = { primary: string; secondary: string };

function Breadcrumb({ label, current }: { label: string; current?: string }) {
  return (
    <nav aria-label={label} className="mb-8 text-[0.92rem] text-[var(--color-muted)]">
      {current ? (
        <>
          <Link className="underline-offset-4 hover:underline" href={glossaryBasePath}>
            {label}
          </Link>
          <span aria-hidden="true" className="px-2">
            /
          </span>
          <span aria-current="page">{current}</span>
        </>
      ) : (
        <span aria-current="page">{label}</span>
      )}
    </nav>
  );
}

function termLinks(terms: GlossaryTerm[]) {
  return terms.map((term) => ({ href: glossaryPath(term.slug), label: term.term, description: term.definition }));
}

/** A row of glossary links under a feature page, for the terms that page relies on. */
export function GlossaryTermsStrip({ title, terms, allLabel }: { title: string; terms: GlossaryTerm[]; allLabel: string }) {
  if (!terms.length) return null;

  return (
    <section aria-labelledby="glossary-strip" className={`${toolShellClass} border-t border-[var(--color-border-light)] py-[clamp(2.5rem,5vw,3.5rem)]`}>
      <h2 className="m-0 text-[1.2rem] tracking-[-0.01em] text-[var(--color-ink)]" id="glossary-strip">
        {title}
      </h2>
      <ul className="m-0 mt-5 flex list-none flex-wrap gap-3 p-0">
        {terms.map((term) => (
          <li key={term.slug}>
            <Link
              className="inline-block rounded-full border border-[rgba(11,17,22,0.14)] px-4 py-2 text-[0.98rem] text-[var(--color-ink)] transition-colors hover:border-[rgba(11,17,22,0.32)]"
              href={glossaryPath(term.slug)}
            >
              {term.term}
            </Link>
          </li>
        ))}
        <li>
          <Link className={`${linkClass} inline-block px-1 py-2 text-[0.98rem]`} href={glossaryBasePath}>
            {allLabel}
          </Link>
        </li>
      </ul>
    </section>
  );
}

/** The glossary index: every entry as a card with its definition, then the Opero pitch. */
export function GlossaryIndexPage({ content, terms, ctas }: { content: GlossaryIndexContent; terms: GlossaryTerm[]; ctas: GlossaryCtas }) {
  return (
    <>
      <PageHero description={content.hero.description} sectionClassName={heroClass} title={content.hero.title} />

      <section aria-label={content.navLabel} className={`${toolShellClass} pb-[clamp(4rem,8vw,6rem)] pt-[clamp(2rem,4vw,3rem)]`}>
        <Breadcrumb label={content.breadcrumbLabel} />
        <p className={`${toolBodyClass} mb-10 max-w-[46rem]`}>{content.intro}</p>
        <ToolLinkGrid tools={termLinks(terms)} />
      </section>

      <OperoBand
        body={content.opero.body}
        id="glossary-opero"
        primary={{ label: content.opero.primaryCta, href: ctas.primary }}
        secondary={{ label: content.opero.secondaryCta, href: ctas.secondary }}
        title={content.opero.title}
      />
    </>
  );
}

/**
 * One entry: the definition up front (what a snippet quotes), the explanation in plain sections,
 * then how Opero handles it, the questions, related entries and sources.
 */
export function GlossaryTermPage({
  term,
  content,
  related,
  ctas,
}: {
  term: GlossaryTerm;
  content: GlossaryIndexContent;
  related: GlossaryTerm[];
  ctas: { primary: string };
}) {
  const { labels } = content;

  return (
    <>
      <PageHero description={term.subtitle} sectionClassName={heroClass} title={term.term} />

      <article className={`${toolShellClass} pb-[clamp(2rem,4vw,3rem)] pt-[clamp(2rem,4vw,3rem)]`}>
        <Breadcrumb current={term.term} label={content.breadcrumbLabel} />

        <div className="max-w-[46rem]">
          <section aria-labelledby="term-definition" className="rounded-[var(--radius-card)] border border-[rgba(11,17,22,0.1)] bg-[var(--color-paper)] p-6">
            <h2 className="m-0 text-[0.92rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-muted)]" id="term-definition">
              {labels.definition}
            </h2>
            <p className="m-0 mt-3 text-[1.15rem] leading-[1.65] text-[var(--color-ink)]">{term.definition}</p>
          </section>

          {term.sections.map((section, index) => (
            <section aria-labelledby={`term-section-${index}`} className="mt-12" key={section.title}>
              <h2 className={toolSectionTitleClass} id={`term-section-${index}`}>
                {section.title}
              </h2>
              <div className="mt-5 grid gap-4">
                {section.paragraphs.map((paragraph) => (
                  <p className={toolBodyClass} key={paragraph}>
                    {paragraph}
                  </p>
                ))}
                {section.list ? (
                  <ul className={`${toolBodyClass} m-0 grid list-disc gap-2 pl-6`}>
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {section.example ? (
                  <p className={`${toolBodyClass} border-l-2 border-[var(--color-blue)] pl-5`}>
                    <strong className="text-[var(--color-ink)]">{labels.example}</strong> {section.example}
                  </p>
                ) : null}
              </div>
            </section>
          ))}

          {term.guide ? (
            <p className={`${toolBodyClass} mt-10`}>
              <Link className={`${linkClass} font-semibold`} href={term.guide.href}>
                {term.guide.label}
              </Link>
            </p>
          ) : null}
        </div>
      </article>

      <OperoBand
        body={term.opero.body}
        id="term-opero"
        primary={{ label: content.opero.primaryCta, href: ctas.primary }}
        secondary={term.opero.link}
        title={term.opero.title}
      />

      <ToolFaq className={`${sectionClass}`} faq={{ title: labels.faq, items: term.faq }} id="term-faq" />

      {related.length ? (
        <section aria-labelledby="term-related" className={`${sectionClass} ${ruleClass}`}>
          <h2 className="m-0 mb-6 text-[1.5rem] tracking-[-0.02em] text-[var(--color-ink)]" id="term-related">
            {labels.related}
          </h2>
          <ToolLinkGrid tools={termLinks(related)} />
        </section>
      ) : null}

      <section aria-labelledby="term-sources" className={`${sectionClass} ${ruleClass} pb-[clamp(4rem,8vw,6rem)]`}>
        {term.sources?.length ? (
          <>
            <h2 className="m-0 mb-4 text-[1.2rem] tracking-[-0.01em] text-[var(--color-ink)]" id="term-sources">
              {labels.sources}
            </h2>
            <ul className="m-0 mb-6 grid list-none gap-2 p-0">
              {term.sources.map((source) => (
                <li className={toolBodyClass} key={source.href}>
                  <a className={linkClass} href={source.href} rel="noopener noreferrer" target="_blank">
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <h2 className="sr-only" id="term-sources">
            {labels.sources}
          </h2>
        )}
        <p className="m-0 text-[0.92rem] text-[var(--color-muted)]">
          {labels.updated}{" "}
          <time dateTime={term.updatedAt}>
            {new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" }).format(new Date(term.updatedAt))}
          </time>
          {" · "}
          <Link className={linkClass} href={glossaryBasePath}>
            {labels.allTerms}
          </Link>
        </p>
      </section>
    </>
  );
}
