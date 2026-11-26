import Link from "next/link";
import ChevronRightIcon from "lucide-react/dist/esm/icons/chevron-right.mjs";
import { PhotoBackdrop } from "@/components/layout/PhotoBackdrop";
import { formatDate, shouldShowUpdated } from "@/lib/blog/format";
import { blogImageSrc } from "@/lib/blog/images";
import { authorPath, blogIndexPath, categoryPath } from "@/lib/blog/routes";
import { tiptapSections } from "@/lib/blog/tiptap";
import type { ArticleFullRow, ArticleListRow } from "@/lib/blog/types";
import { ArticleFaq } from "./ArticleFaq";
import { AuthorAvatar, AuthorBox, type BlogAuthor } from "./AuthorBox";
import { BlogRail } from "./BlogRail";
import { ArticleCard } from "./cards";
import type { BlogFrame } from "./frame";
import { ArticleCta, InlineFeature } from "./Promos";
import { ShareLinks } from "./ShareLinks";
import { TagChips } from "./TagChips";
import { blogSectionHeadClass, blogSectionTitleClass, blogShellClass } from "./primitives";

type ArticlePageProps = Omit<BlogFrame, "topics"> & {
  article: ArticleFullRow;
  /** Absolute URL of this article, for the share links. */
  url: string;
  /** Up to three articles for the block under the text. */
  keepReading: ArticleListRow[];
};

/** Text, rail. Under 980px the rail moves below the article. */
const columnsClass = "grid grid-cols-[minmax(0,1fr)_21.5rem] items-start gap-x-14 gap-y-16 max-[1199px]:grid-cols-[minmax(0,1fr)_20rem] max-[980px]:grid-cols-1";
/** The in-text promo goes in before this section (zero-based), far enough in that the reader has started. */
const promoBeforeSection = 3;
/** Shorter articles keep their text unbroken. */
const promoMinSections = 5;

export function ArticlePage({ article, locale, ui, shell, ctaHrefs, toolsHref, url, picks, keepReading, promos }: ArticlePageProps) {
  const heroImage = blogImageSrc(article.obraz_glowny);
  const published = formatDate(article.data_publikacji, locale);
  const updated = shouldShowUpdated(article.data_publikacji, article.updated_at) ? formatDate(article.updated_at, locale) : null;
  const sectionCount = (article.tresc?.doc?.content ?? []).filter((node) => node?.type === "heading").length;
  const showInline = Boolean(promos.inlineFeature) && sectionCount >= promoMinSections;
  const { before, after } = tiptapSections(article.tresc, showInline ? promoBeforeSection : Number.POSITIVE_INFINITY);

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
      <article>
        <header className="relative isolate overflow-hidden bg-[var(--color-surface-dark)] [background-image:var(--gradient-hero)] px-[var(--page-gutter)] pb-[4.5rem] pt-[8rem] text-white max-[809px]:pb-12 max-[809px]:pt-[7rem]">
          {heroImage ? (
            <>
              {/* The article's own cover, behind the title. A real image with its alt text rather than a
                  CSS background, so it is indexed with the article and loads first. */}
              {/* eslint-disable-next-line @next/next/no-img-element -- CMS files are served through the authenticated proxy; next/image optimization is off site-wide */}
              <img
                alt={article.obraz_alt ?? ""}
                className="absolute inset-0 -z-20 size-full object-cover object-[center_30%] opacity-50"
                decoding="async"
                fetchPriority="high"
                height={900}
                src={heroImage}
                width={1600}
              />
              {/* Darkest where the text sits; the scrim, not the photograph, is what keeps the title readable. */}
              <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(11,17,22,0.94)_0%,rgba(11,17,22,0.8)_50%,rgba(11,17,22,0.5)_100%)]" />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-2/5 bg-[linear-gradient(to_bottom,rgba(11,17,22,0),rgba(11,17,22,0.85))]" />
            </>
          ) : (
            <PhotoBackdrop opacity={0.18} photo="workspace" priority />
          )}

          <div className="relative z-[1] mx-auto w-[min(100%,var(--shell-width))]">
            <div className="max-w-[56.25rem]">
              <nav aria-label={ui.article.breadcrumb}>
                <ol className="m-0 flex list-none flex-wrap items-center gap-x-2.5 gap-y-1 p-0 text-[0.88rem] text-white/66">
                  <li>
                    <Link className="transition-colors hover:text-white" href={blogIndexPath(locale)}>
                      {ui.index.label}
                    </Link>
                  </li>
                  {article.kategoria_slug && article.kategoria_nazwa ? (
                    <li className="flex items-center gap-2.5">
                      <ChevronRightIcon aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
                      <Link className="font-semibold text-[var(--color-blue-soft)] transition-opacity hover:opacity-75" href={categoryPath(locale, article.kategoria_slug)}>
                        {article.kategoria_nazwa}
                      </Link>
                    </li>
                  ) : null}
                </ol>
              </nav>

              <h1 className="m-0 mt-6 text-balance text-[clamp(2.1rem,3.7vw,3.2rem)] leading-[1.05] tracking-[-0.04em]">{article.tytul}</h1>

              {article.zajawka ? (
                <p className="m-0 mt-[1.375rem] max-w-[51.25rem] font-display text-[1.18rem] font-light leading-[1.6] text-white/76 max-[809px]:text-[1.02rem]">{article.zajawka}</p>
              ) : null}

              <div className="mt-7 flex flex-wrap items-center justify-between gap-x-8 gap-y-3.5 border-t border-white/[0.12] pt-[1.125rem]">
                {author ? (
                  <div className="flex min-w-0 items-center gap-3">
                    <AuthorAvatar author={author} size={40} />
                    <p className="m-0 min-w-0 text-[0.92rem] leading-[1.35]">
                      {author.slug ? (
                        <Link className="block font-semibold transition-opacity hover:opacity-75" href={authorPath(locale, author.slug)} rel="author">
                          {author.nazwa}
                        </Link>
                      ) : (
                        <span className="block font-semibold">{author.nazwa}</span>
                      )}
                      {author.stanowisko ? <span className="block text-white/66">{author.stanowisko}</span> : null}
                    </p>
                  </div>
                ) : null}

                <p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.88rem] text-white/72">
                  <time dateTime={article.data_publikacji}>{published}</time>
                  {updated ? (
                    <span>
                      {ui.labels.updated} <time dateTime={article.updated_at}>{updated}</time>
                    </span>
                  ) : null}
                  {article.czas_czytania ? (
                    <span>
                      {article.czas_czytania} {ui.labels.minRead}
                    </span>
                  ) : null}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className={`${blogShellClass} pt-14`}>
          <div className={columnsClass} data-pin-bounds>
            <div className="min-w-0 max-w-[45rem]">
              <div className="blog-prose blog-prose-article">{before}</div>
              {after ? (
                <>
                  {promos.inlineFeature ? <InlineFeature feature={promos.inlineFeature} ui={ui} /> : null}
                  <div className="blog-prose blog-prose-article">{after}</div>
                </>
              ) : null}

              <ArticleFaq items={article.faq ?? []} title={ui.article.faq} />
              <TagChips locale={locale} tags={article.tagi ?? []} ui={ui} />
              <div className="mt-10">
                <ShareLinks
                  labels={{
                    share: ui.article.share,
                    linkedIn: ui.article.shareOnLinkedIn,
                    x: ui.article.shareOnX,
                    copyLink: ui.article.copyLink,
                    linkCopied: ui.article.linkCopied,
                  }}
                  title={article.tytul}
                  url={url}
                />
              </div>
              <ArticleCta ctaHrefs={ctaHrefs} ui={ui} />
              {author ? <AuthorBox author={author} locale={locale} ui={ui} /> : null}
            </div>

            <div className="w-full max-w-[21.5rem] justify-self-end self-stretch max-[980px]:max-w-none">
              <BlogRail ctaHrefs={ctaHrefs} locale={locale} picks={picks} promos={promos} shell={shell} toolsHref={toolsHref} ui={ui} variant="article" />
            </div>
          </div>
        </div>
      </article>

      {keepReading.length > 0 ? (
        <section aria-labelledby="keep-reading" className={`${blogShellClass} pb-24 pt-24 max-[809px]:pb-16 max-[809px]:pt-16`}>
          <div className={blogSectionHeadClass}>
            <h2 className={blogSectionTitleClass} id="keep-reading">
              {ui.article.keepReading}
            </h2>
            <Link className="text-[0.95rem] font-semibold text-[var(--color-blue)] transition-colors hover:text-[var(--color-blue-deep)]" href={blogIndexPath(locale)}>
              {ui.labels.allArticles}
            </Link>
          </div>
          <div className="mt-7 grid grid-cols-3 gap-x-8 gap-y-10 max-[980px]:grid-cols-2 max-[560px]:grid-cols-1">
            {keepReading.map((item) => (
              <ArticleCard article={item} key={item.id} locale={locale} ui={ui} />
            ))}
          </div>
        </section>
      ) : (
        <div className="pb-24" />
      )}
    </>
  );
}
