import Link from "next/link";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right.mjs";
import { LandingSection, SectionIntro } from "@/components/landing/LandingPrimitives";
import { Reveal } from "@/components/landing/Reveal";
import { blogBundle } from "@/lib/blog/bundle";
import { formatDate } from "@/lib/blog/format";
import { blogImageSrc } from "@/lib/blog/images";
import { getArticles } from "@/lib/blog/queries";
import { articlePath, blogIndexPath } from "@/lib/blog/routes";
import type { ArticleListRow, BlogLocale } from "@/lib/blog/types";
import { blogMetaClass } from "./primitives";

const recentCount = 4;

/**
 * Embeddable "latest from the blog" strip for marketing pages. Reads through
 * the same tagged cache as the blog index, so it prerenders with the page and
 * refreshes when the CMS webhook purges the `blog` tag.
 *
 * Renders nothing when the CMS is unreachable or has no articles yet: a blog
 * outage must never break or empty out the page that embeds it.
 */
export async function RecentArticles({ locale }: { locale: BlogLocale }) {
  let rows: ArticleListRow[] = [];

  try {
    ({ rows } = await getArticles({ jezyk: locale, page: 1, pageSize: recentCount }));
  } catch (error) {
    console.warn("[blog] Recent articles unavailable:", error instanceof Error ? error.message : error);
  }

  if (rows.length === 0) return null;

  const { ui } = blogBundle(locale);
  const articles = rows.slice(0, recentCount);
  // Mixed rows (some covers, some not) misalign the titles, so covers show only when every entry has one.
  const showImages = articles.every((article) => blogImageSrc(article.obraz_glowny));

  return (
    <LandingSection>
      <Reveal>
        <SectionIntro
          action={
            <Link
              className="group inline-flex items-center gap-2 text-[1.08rem] font-semibold text-[var(--color-blue)] transition-colors duration-150 hover:text-[var(--color-blue-deep)]"
              href={blogIndexPath(locale)}
            >
              <span className="border-b border-[rgba(56,182,255,0.34)] pb-0.5 transition-colors duration-150 group-hover:border-[rgba(20,112,184,0.55)]">
                {ui.labels.allArticles}
              </span>
              <ArrowRightIcon
                className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                strokeWidth={1.8}
              />
            </Link>
          }
          description={ui.recent.description}
          eyebrow={ui.recent.eyebrow}
          split
          title={ui.recent.title}
        />
      </Reveal>

      <ul className="m-0 mt-[clamp(2rem,4vw,3.25rem)] grid list-none grid-cols-4 gap-x-8 p-0 max-[1200px]:grid-cols-2 max-[640px]:grid-cols-1">
        {articles.map((article) => (
          <li className="border-t border-[rgba(2,2,13,0.12)]" key={article.id}>
            <RecentArticle article={article} locale={locale} minRead={ui.labels.minRead} showImage={showImages} />
          </li>
        ))}
      </ul>
    </LandingSection>
  );
}

type RecentArticleProps = { article: ArticleListRow; locale: BlogLocale; minRead: string; showImage: boolean };

function RecentArticle({ article, locale, minRead, showImage }: RecentArticleProps) {
  const image = showImage ? blogImageSrc(article.obraz_glowny) : null;

  return (
    <Link
      className="group grid gap-5 py-7 max-[640px]:grid-cols-[6.5rem_minmax(0,1fr)] max-[640px]:items-start max-[640px]:gap-4 max-[640px]:py-6"
      href={articlePath(locale, article.slug)}
    >
      {image ? (
        <span className="relative block aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] bg-[rgba(2,2,13,0.04)]">
          {/* eslint-disable-next-line @next/next/no-img-element -- CMS files are served through the authenticated proxy; next/image optimization is off site-wide */}
          <img
            alt=""
            className="block size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
            decoding="async"
            loading="lazy"
            src={image}
          />
        </span>
      ) : null}

      <span className={`block ${image ? "" : "max-[640px]:col-span-2"}`}>
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <time className={blogMetaClass} dateTime={article.data_publikacji}>
            {formatDate(article.data_publikacji, locale)}
          </time>
          {article.kategoria_nazwa ? (
            <span className="text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-blue)] max-[640px]:hidden">
              {article.kategoria_nazwa}
            </span>
          ) : null}
        </span>
        <h3 className="m-0 mt-3 text-[1.2rem] font-medium leading-[1.3] text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-blue)] max-[640px]:mt-2 max-[640px]:text-[1.05rem]">
          {article.tytul}
        </h3>
        {article.zajawka ? (
          <span className="mt-3 line-clamp-3 block text-[0.96rem] font-light leading-[1.6] text-[var(--color-muted)] max-[640px]:hidden">
            {article.zajawka}
          </span>
        ) : null}
        {article.czas_czytania ? (
          <span className="mt-4 block text-[0.88rem] text-[var(--color-muted)] max-[640px]:mt-2">
            {article.czas_czytania} {minRead}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
