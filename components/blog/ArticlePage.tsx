import Link from "next/link";
import type { BlogUiContent } from "@/content/types";
import { formatDate, shouldShowUpdated } from "@/lib/blog/format";
import { blogImageSrc } from "@/lib/blog/images";
import { authorPath, blogIndexPath, categoryPath } from "@/lib/blog/routes";
import { renderTiptap } from "@/lib/blog/tiptap";
import type { ArticleFullRow, BlogLocale } from "@/lib/blog/types";
import { AuthorAvatar, AuthorBox, type BlogAuthor } from "./AuthorBox";
import { RelatedList } from "./RelatedList";
import { TagChips } from "./TagChips";
import { BlogFinalCta, blogMetaClass } from "./primitives";
import { PhotoBackdrop } from "@/components/layout/PhotoBackdrop";

type ArticlePageProps = {
  article: ArticleFullRow;
  locale: BlogLocale;
  ui: BlogUiContent;
  ctaHrefs: { primary: string; secondary: string };
};

const columnClass = "mx-auto w-[min(100%,var(--shell-width))] px-[var(--page-gutter)]";
const proseColumnClass = "mx-auto max-w-[820px]";

export function ArticlePage({ article, locale, ui, ctaHrefs }: ArticlePageProps) {
  const heroImage = blogImageSrc(article.obraz_glowny);
  const published = formatDate(article.data_publikacji, locale);
  const updated = shouldShowUpdated(article.data_publikacji, article.updated_at)
    ? formatDate(article.updated_at, locale)
    : null;

  const author: BlogAuthor | null = article.autor_nazwa
    ? {
        slug: article.autor_slug ?? null,
        nazwa: article.autor_nazwa,
        stanowisko: article.autor_stanowisko,
        avatar: article.autor_avatar,
        bio: article.autor_bio,
        www: article.autor_www ?? null,
        linkedin: article.autor_linkedin,
        x: article.autor_x,
      }
    : null;

  return (
    <>
      <header className="relative overflow-hidden bg-[var(--color-surface-dark)] [background-image:var(--gradient-hero)] px-[var(--page-gutter)] pb-[2.25rem] pt-[9rem] text-white max-[809px]:pt-28">
      <PhotoBackdrop photo="workspace" opacity={0.18} />
        {/* The <header> already owns the page gutter; the column only sets the measure. */}
        <div className={`relative z-[1] ${proseColumnClass}`}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.78rem] font-semibold uppercase tracking-[0.08em]">
            {article.kategoria_slug && article.kategoria_nazwa ? (
              <Link className="text-[var(--color-blue-soft)] transition-opacity hover:opacity-75" href={categoryPath(locale, article.kategoria_slug)}>
                {article.kategoria_nazwa}
              </Link>
            ) : (
              <Link className="text-[var(--color-blue-soft)] transition-opacity hover:opacity-75" href={blogIndexPath(locale)}>
                {ui.index.eyebrow}
              </Link>
            )}
            <span className="text-white/28" aria-hidden="true">
              ·
            </span>
            <time className="text-white/52" dateTime={article.data_publikacji}>
              {published}
            </time>
          </div>

          <h1 className="m-0 mt-5 text-[3.2rem] leading-[1.05] tracking-[-0.04em] max-[809px]:text-[2.1rem]">{article.tytul}</h1>

          {article.zajawka ? (
            <p className="mt-6 text-[1.18rem] font-light leading-[1.6] text-white/72 max-[809px]:text-[1.02rem]">{article.zajawka}</p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/[0.12] pt-3.5 text-[0.85rem]">
            {author ? (
              <div className="flex min-w-0 items-center gap-2.5">
                <AuthorAvatar author={author} size={28} />
                <span className="min-w-0 truncate">
                  {author.slug ? (
                    <Link className="font-medium text-white transition-opacity hover:opacity-75" href={authorPath(locale, author.slug)}>
                      {author.nazwa}
                    </Link>
                  ) : (
                    <span className="font-medium text-white">{author.nazwa}</span>
                  )}
                  {author.stanowisko ? <span className="text-white/48">{` · ${author.stanowisko}`}</span> : null}
                </span>
              </div>
            ) : null}

            {article.czas_czytania ? (
              <span className="ml-auto shrink-0 text-white/56 max-[560px]:ml-0">
                {article.czas_czytania} {ui.labels.minRead}
              </span>
            ) : null}
          </div>
        </div>
      </header>

      <div className={`${columnClass} py-[clamp(3rem,6vw,5rem)]`}>
        <div className={proseColumnClass}>
          {heroImage ? (
            <figure className="m-0 mb-12 overflow-hidden rounded-[var(--radius-card)] border border-[rgba(2,2,13,0.12)]">
              {/* eslint-disable-next-line @next/next/no-img-element -- CMS files are served through the authenticated proxy; next/image optimization is off site-wide */}
              <img
                className="block aspect-[16/9] w-full object-cover"
                src={heroImage}
                alt={article.obraz_alt ?? article.tytul}
                fetchPriority="high"
                decoding="async"
              />
            </figure>
          ) : null}

          {updated ? (
            <p className={`${blogMetaClass} mb-8`}>
              {ui.labels.updated} {updated}
            </p>
          ) : null}

          <div className="blog-prose">{renderTiptap(article.tresc)}</div>

          <TagChips locale={locale} tags={article.tagi ?? []} ui={ui} />
          <RelatedList items={article.powiazane ?? []} locale={locale} ui={ui} />
          {author ? <AuthorBox author={author} locale={locale} ui={ui} /> : null}

          <Link
            className="mt-12 inline-flex items-center gap-2 text-[0.9rem] font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-blue)]"
            href={blogIndexPath(locale)}
          >
            <span aria-hidden="true">←</span>
            {ui.labels.allArticles}
          </Link>
        </div>
      </div>

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
