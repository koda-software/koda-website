import Link from "next/link";
import type { BlogUiContent } from "@/content/types";
import { blogIndexPath, categoryPath } from "@/lib/blog/routes";
import type { BlogLocale } from "@/lib/blog/types";
import { BlogSearch } from "./BlogSearch";
import { blogShellClass } from "./primitives";

export type Topic = { slug: string; name: string; count: number };

type TopicBarProps = {
  locale: BlogLocale;
  ui: BlogUiContent;
  topics: Topic[];
  total: number;
  /** The category this page lists; `null` on the index, `undefined` where no topic is current. */
  active?: string | null;
};

const linkClass = "inline-flex h-[3.75rem] shrink-0 items-center gap-2 px-4 text-[0.95rem] transition-colors first:pl-0";
const idleClass = `${linkClass} font-medium text-[var(--color-muted)] hover:text-[var(--color-ink)]`;
const currentClass = `${linkClass} font-semibold text-[var(--color-ink)] shadow-[inset_0_-2px_0_var(--color-ink)]`;
const countClass = "text-[0.8rem] font-normal text-[var(--color-muted)]";

/**
 * The blog's own navigation: every category with its article count, and search.
 * A bar of its own under the masthead rather than part of it, so it reads as
 * the way around the blog and stays the same on the index and on every archive.
 */
export function TopicBar({ locale, ui, topics, total, active }: TopicBarProps) {
  return (
    <div className="border-b border-[var(--color-border-light)] bg-[var(--color-paper)]">
      <div className={`${blogShellClass} flex flex-wrap items-center gap-x-8`}>
        <nav aria-label={ui.hub.topics} className="flex min-w-0 flex-[999_1_36rem] overflow-x-auto whitespace-nowrap">
          <Link aria-current={active === null ? "page" : undefined} className={active === null ? currentClass : idleClass} href={blogIndexPath(locale)}>
            {ui.labels.allArticles} <span className={countClass}>{total}</span>
          </Link>
          {topics.map((topic) => (
            <Link
              aria-current={active === topic.slug ? "page" : undefined}
              className={active === topic.slug ? currentClass : idleClass}
              href={categoryPath(locale, topic.slug)}
              key={topic.slug}
            >
              {topic.name} <span className={countClass}>{topic.count}</span>
            </Link>
          ))}
        </nav>
        <BlogSearch endpoint={`/api/blog/search/${locale}`} labels={ui.search} />
      </div>
    </div>
  );
}
