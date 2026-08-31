import Link from "next/link";
import type { ReactNode } from "react";
import type { BlogUiContent } from "@/content/types";
import { blogIndexPath } from "@/lib/blog/routes";
import type { ArticleListRow, BlogLocale } from "@/lib/blog/types";
import { ArticleRow } from "./ArticleRow";
import { Pagination } from "./Pagination";
import { BlogFinalCta, BlogHero, blogBodyClass, blogSectionClass } from "./primitives";

type BlogListPageProps = {
  locale: BlogLocale;
  ui: BlogUiContent;
  heading: { eyebrow: string; title: string; description?: string };
  aside?: ReactNode;
  rows: ArticleListRow[];
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
  ctaHrefs: { primary: string; secondary: string };
  /** Shown above the list on archive pages, linking back to the full index. */
  showBackLink?: boolean;
};

/** Shared layout for the blog index, pagination pages and every archive. */
export function BlogListPage({
  locale,
  ui,
  heading,
  aside,
  rows,
  page,
  totalPages,
  buildHref,
  ctaHrefs,
  showBackLink = false,
}: BlogListPageProps) {
  return (
    <>
      <BlogHero eyebrow={heading.eyebrow} title={heading.title} description={heading.description} aside={aside} />

      <section className={blogSectionClass}>
        {showBackLink ? (
          <Link
            className="mb-10 inline-flex items-center gap-2 text-[0.88rem] font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-blue)]"
            href={blogIndexPath(locale)}
          >
            <span aria-hidden="true">←</span>
            {ui.labels.allArticles}
          </Link>
        ) : null}

        {rows.length === 0 ? (
          <p className={`${blogBodyClass} border-t border-[rgba(2,2,13,0.12)] pt-10`}>{ui.labels.emptyState}</p>
        ) : (
          <div>
            {rows.map((article, index) => (
              <ArticleRow article={article} key={article.id} locale={locale} priority={page === 1 && index === 0} ui={ui} />
            ))}
          </div>
        )}

        <Pagination buildHref={buildHref} page={page} totalPages={totalPages} ui={ui} />
      </section>

      <BlogFinalCta
        description={ui.cta.description}
        eyebrow={ui.cta.eyebrow}
        primaryHref={ctaHrefs.primary}
        primaryLabel={ui.cta.primaryCta}
        secondaryHref={ctaHrefs.secondary}
        secondaryLabel={ui.cta.secondaryCta}
        title={ui.cta.title}
      />
    </>
  );
}
