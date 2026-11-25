import type { ReactNode } from "react";
import type { ArticleListRow } from "@/lib/blog/types";
import { ArticleRow } from "./ArticleRow";
import { BlogRail } from "./BlogRail";
import type { BlogFrame } from "./frame";
import { Pagination } from "./Pagination";
import { TopicBar } from "./TopicBar";
import { BlogClosingBand, BlogMasthead, blogBodyClass, blogShellClass, blogWithRailClass } from "./primitives";

type BlogListPageProps = BlogFrame & {
  heading: { title: string; description?: string };
  aside?: ReactNode;
  rows: ArticleListRow[];
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
  /** Total number of published articles, for the topic bar. */
  total: number;
  /** The category this page lists; leave out on tag, author and pagination pages. */
  activeTopic?: string;
  /** Rendered under the pagination, e.g. the index's list of every tag. */
  footer?: ReactNode;
};

/**
 * Shared layout for every listing that is not the front page: the index's
 * later pages and the category, tag and author archives. Same masthead, topic
 * bar and rail as the front page, with the articles as one list.
 */
export function BlogListPage({
  locale,
  ui,
  shell,
  heading,
  aside,
  rows,
  page,
  totalPages,
  buildHref,
  ctaHrefs,
  toolsHref,
  topics,
  total,
  activeTopic,
  picks,
  promos,
  footer,
}: BlogListPageProps) {
  return (
    <>
      <BlogMasthead aside={aside} description={heading.description} title={heading.title} />
      <TopicBar active={activeTopic} locale={locale} topics={topics} total={total} ui={ui} />

      <div className={`${blogShellClass} pt-14`}>
        <div className={blogWithRailClass} data-pin-bounds>
          <div className="min-w-0">
            {rows.length === 0 ? (
              <p className={`${blogBodyClass} border-t border-[var(--color-border-light)] pt-10`}>{ui.labels.emptyState}</p>
            ) : (
              <div className="divide-y divide-[rgba(11,17,22,0.07)]">
                {rows.map((article, index) => (
                  <ArticleRow article={article} key={article.id} locale={locale} priority={index === 0} ui={ui} />
                ))}
              </div>
            )}

            <Pagination buildHref={buildHref} page={page} totalPages={totalPages} ui={ui} />
            {footer}
          </div>

          <BlogRail ctaHrefs={ctaHrefs} locale={locale} picks={picks} promos={promos} shell={shell} toolsHref={toolsHref} ui={ui} />
        </div>
      </div>

      <BlogClosingBand ctaHrefs={ctaHrefs} ui={ui} />
    </>
  );
}
