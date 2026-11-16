import type { ReactNode } from "react";
import Link from "next/link";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right.mjs";
import { PageHero } from "@/components/landing/LandingPrimitives";
import type { ToolPageContent } from "@/content/types";
import type { Locale } from "@/lib/i18n/config";

export type ToolLink = { href: string; label: string; description: string };

type ToolPageProps = {
  content: ToolPageContent;
  locale: Locale;
  /** The tools index, for the breadcrumb. */
  index: { href: string; label: string; breadcrumbLabel: string };
  ctas: { primary: string; secondary: string };
  /** The other live tools; the section is left out while there are none. */
  otherTools: ToolLink[];
  /** The interactive tool itself, the only client code on the page. */
  children: ReactNode;
  /** A server-rendered section placed after the explainer, such as worked examples. */
  extra?: ReactNode;
};

const shellClass = "mx-auto w-[min(100%,1100px)] px-[var(--page-gutter)]";
const sectionClass = `${shellClass} py-[clamp(3.5rem,7vw,4.5rem)]`;
const ruleClass = "border-t border-[var(--color-border-light)]";
const sectionTitleClass = "m-0 text-[clamp(1.6rem,2.6vw,2rem)] leading-[1.15] tracking-[-0.03em] text-[var(--color-ink)]";
const bodyClass = "m-0 text-[1.04rem] leading-[1.7] text-[var(--color-muted)]";

/**
 * A free tool: a short banner, the tool straight on the page, then the rule behind
 * it, questions, the one Opero feature that does the job for you, and the other tools.
 *
 * Everything except the tool is server-rendered text. That text is what ranks, so it
 * stays plain and complete rather than hidden in the widget.
 */
export function ToolPage({ content, locale, index, ctas, otherTools, children, extra }: ToolPageProps) {
  const { explainer, faq, opero, sources } = content;

  return (
    <>
      <PageHero
        description={content.hero.description}
        sectionClassName="!min-h-[19rem] pb-[clamp(3rem,6vw,4.5rem)] pt-[clamp(7rem,11vw,9rem)]"
        title={content.hero.title}
      />

      <section aria-label={content.navLabel} className={`${shellClass} pb-[clamp(3.5rem,7vw,4.5rem)] pt-[clamp(2rem,4vw,3rem)]`}>
        <nav aria-label={index.breadcrumbLabel} className="mb-8 print:hidden text-[0.92rem] text-[var(--color-muted)]">
          <Link className="underline-offset-4 hover:underline" href={index.href}>
            {index.label}
          </Link>
          <span aria-hidden="true" className="px-2">
            /
          </span>
          <span aria-current="page">{content.navLabel}</span>
        </nav>
        {children}
      </section>

      <section aria-labelledby="tool-explainer" className={`${sectionClass} ${ruleClass} flex flex-wrap gap-x-16 gap-y-10`}>
        <div className="min-w-0 flex-[1_1_20rem]">
          <h2 className={sectionTitleClass} id="tool-explainer">
            {explainer.title}
          </h2>
          <div className="mt-5 grid gap-4">
            {explainer.paragraphs.map((paragraph) => (
              <p className={bodyClass} key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        {explainer.table ? (
          <div className="min-w-0 flex-[1.3_1_28rem] overflow-x-auto">
            <table className="w-full border-collapse text-[1rem] text-[var(--color-ink)]">
              <caption className="pb-3 text-left font-semibold">{explainer.table.caption}</caption>
              <thead>
                <tr className="text-left text-[0.92rem] text-[var(--color-muted)]">
                  {explainer.table.columns.map((column) => (
                    <th className="border-b border-[rgba(11,17,22,0.16)] py-2.5 pr-4 font-semibold" key={column} scope="col">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {explainer.table.rows.map((row) => (
                  <tr key={row.join("|")}>
                    {row.map((cell, cellIndex) => (
                      <td
                        className={`border-b border-[rgba(11,17,22,0.1)] py-3.5 pr-4 ${cellIndex === row.length - 1 ? "text-[var(--color-muted)]" : ""}`}
                        key={cell}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      {extra ? <section aria-labelledby="tool-examples" className={`${sectionClass} ${ruleClass}`}>{extra}</section> : null}

      {sources ? (
        <section aria-labelledby="tool-sources" className={`${sectionClass} ${ruleClass}`}>
          <h2 className={sectionTitleClass} id="tool-sources">
            {sources.title}
          </h2>
          <p className="m-0 mt-4 text-[0.92rem] text-[var(--color-muted)]">
            {sources.updatedLabel}{" "}
            <time dateTime={sources.updatedAt}>
              {new Intl.DateTimeFormat(locale === "pl" ? "pl-PL" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(
                new Date(sources.updatedAt),
              )}
            </time>
          </p>
          <ul className="m-0 mt-5 grid list-none gap-2.5 p-0">
            {sources.items.map((item) => (
              <li className={bodyClass} key={item.label}>
                {item.href ? (
                  <a className="text-[var(--color-blue)] underline underline-offset-4 hover:text-[var(--color-blue-deep)]" href={item.href} rel="noopener noreferrer" target="_blank">
                    {item.label}
                  </a>
                ) : (
                  item.label
                )}
              </li>
            ))}
          </ul>
          <p className={`${bodyClass} mt-5 max-w-[46rem] text-[0.95rem]`}>{sources.note}</p>
        </section>
      ) : null}

      <section aria-labelledby="tool-faq" className={`${sectionClass} ${ruleClass}`}>
        <h2 className={`${sectionTitleClass} mb-6`} id="tool-faq">
          {faq.title}
        </h2>
        <div>
          {faq.items.map((item, itemIndex) => (
            <details className={`border-b border-[var(--color-border-light)] py-5`} key={item.question} open={itemIndex === 0}>
              <summary className="cursor-pointer font-display text-[1.15rem] font-medium text-[var(--color-ink)]">{item.question}</summary>
              <p className={`${bodyClass} mt-3 max-w-[46rem]`}>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* The one dark band on the page: full width, the text kept in the page column. */}
      <section aria-labelledby="tool-opero" className="isolate border-y border-white/8 bg-[var(--color-surface-dark)] [background-image:var(--gradient-hero)] text-white">
        <div className={`${sectionClass} flex flex-wrap items-center gap-x-16 gap-y-7`}>
          <div className="min-w-0 flex-[1_1_30rem]">
            <h2 className="m-0 text-[clamp(1.6rem,2.6vw,2rem)] leading-[1.15] tracking-[-0.03em] text-white" id="tool-opero">
              {opero.title}
            </h2>
            <p className="m-0 mt-4 max-w-[39rem] text-[1.04rem] leading-[1.7] text-[var(--color-muted-light)]">{opero.body}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="action action-mist" href={ctas.primary}>
              {opero.primaryCta}
            </Link>
            <Link className="action action-line-dark" href={ctas.secondary}>
              {opero.secondaryCta}
              <ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {otherTools.length ? (
        <section aria-labelledby="tool-more" className={`${sectionClass} pb-[clamp(4rem,8vw,6rem)]`}>
          <h2 className="m-0 mb-6 text-[1.5rem] tracking-[-0.02em] text-[var(--color-ink)]" id="tool-more">
            {content.otherToolsTitle}
          </h2>
          <ToolLinkGrid tools={otherTools} />
        </section>
      ) : null}
    </>
  );
}

export function ToolLinkGrid({ tools }: { tools: ToolLink[] }) {
  return (
    <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(17.5rem,1fr))] gap-4 p-0">
      {tools.map((tool) => (
        <li key={tool.href}>
          <Link
            className="group flex h-full flex-col gap-2 rounded-[var(--radius-card)] border border-[rgba(11,17,22,0.1)] bg-[var(--color-paper)] p-6 text-[var(--color-ink)] transition-colors hover:border-[rgba(11,17,22,0.24)]"
            href={tool.href}
          >
            <span className="flex items-center justify-between gap-3 font-display text-[1.15rem] font-semibold">
              {tool.label}
              <ArrowRightIcon aria-hidden="true" className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
            <span className="text-[0.98rem] leading-[1.55] text-[var(--color-muted)]">{tool.description}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
