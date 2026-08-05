import Link from "next/link";
import type { BlogUiContent } from "@/content/types";
import { formatDate } from "@/lib/blog/format";
import { articlePath, authorPath, categoryPath } from "@/lib/blog/routes";
import type { ArticleListRow, BlogLocale } from "@/lib/blog/types";
import { blogMetaClass } from "./primitives";

type ArticleRowProps = {
  article: ArticleListRow;
  locale: BlogLocale;
  ui: BlogUiContent;
};

/**
 * One entry in an article list: a bordered editorial row, no thumbnail and no
 * card chrome, matching the list idiom used across the marketing pages.
 */
export function ArticleRow({ article, locale, ui }: ArticleRowProps) {
  const href = articlePath(locale, article.slug);
  const published = formatDate(article.data_publikacji, locale);

  return (
    <article className="grid grid-cols-[minmax(0,0.3fr)_minmax(0,1fr)] gap-10 border-t border-[rgba(2,2,13,0.12)] py-10 max-[809px]:grid-cols-1 max-[809px]:gap-3 max-[809px]:py-8">
      <div className="flex flex-col gap-2">
        <time className={blogMetaClass} dateTime={article.data_publikacji}>
          {published}
        </time>
        {article.kategoria_slug && article.kategoria_nazwa ? (
          <Link
            className="w-fit text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-blue)] transition-opacity hover:opacity-70"
            href={categoryPath(locale, article.kategoria_slug)}
          >
            {article.kategoria_nazwa}
          </Link>
        ) : null}
        {article.wyrozniony ? (
          <span className="w-fit text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-blue)]">{ui.labels.featured}</span>
        ) : null}
      </div>

      <div>
        {/* h2, not h3: each entry sits directly under the page h1, so an h3 would skip a level. */}
        <h2 className="m-0 max-w-[42rem] text-[1.7rem] font-medium leading-[1.2] text-[var(--color-ink)] max-[809px]:text-[1.35rem]">
          <Link className="transition-colors hover:text-[var(--color-blue)]" href={href}>
            {article.tytul}
          </Link>
        </h2>
        {article.zajawka ? (
          <p className="m-0 mt-4 max-w-[42rem] text-[1.02rem] font-light leading-[1.65] text-[var(--color-muted)]">{article.zajawka}</p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.88rem] text-[var(--color-muted)]">
          {article.autor_slug && article.autor_nazwa ? (
            <Link className="transition-colors hover:text-[var(--color-ink)]" href={authorPath(locale, article.autor_slug)}>
              {article.autor_nazwa}
            </Link>
          ) : null}
          {article.autor_slug && article.autor_nazwa && article.czas_czytania ? <span aria-hidden="true">·</span> : null}
          {article.czas_czytania ? (
            <span>
              {article.czas_czytania} {ui.labels.minRead}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
