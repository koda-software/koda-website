import Link from "next/link";
import type { BlogUiContent } from "@/content/types";
import { formatDate } from "@/lib/blog/format";
import { blogImageSrc } from "@/lib/blog/images";
import { articlePath, authorPath, categoryPath } from "@/lib/blog/routes";
import type { ArticleListRow, BlogLocale } from "@/lib/blog/types";

/**
 * Every way the blog shows one article outside its own page. They share the
 * same pieces - cover, label, title, standfirst, byline - so a list can change
 * density without changing what a reader is told about an article.
 *
 * Titles are h3: every list they sit in is introduced by an h2. The lead story
 * has no such heading above it, so it is an h2 itself.
 */

type Shared = {
  article: ArticleListRow;
  locale: BlogLocale;
  ui: BlogUiContent;
};

const coverImageClass = "block size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]";
const titleLinkClass = "transition-colors hover:text-[var(--color-blue)]";
const labelClass = "text-[0.74rem] font-semibold uppercase tracking-[0.08em]";
const smallClass = "m-0 text-[0.82rem] text-[var(--color-muted)]";

/** Stands in for an article that has no cover: the brand mark on the dark technical gradient. */
function CoverPlaceholder() {
  return (
    <span className="grid size-full place-items-center bg-[image:var(--gradient-technical)] transition-transform duration-500 ease-out group-hover:scale-[1.025]">
      <svg aria-hidden="true" className="h-[34%] max-h-16 min-h-7 w-auto" fill="none" viewBox="0 0 38 44">
        <path d="M3 4v36M20.5 16 4 30.5m5.6-4.9L21 40" stroke="rgba(255,255,255,0.92)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.43" />
        <rect fill="var(--color-blue-soft)" height="5.43" rx="2.09" width="12" x="25" y="37.28" />
      </svg>
    </span>
  );
}

/** Covers are uploaded at 16:9; the attributes reserve the box before the file arrives. */
function Cover({ article }: { article: ArticleListRow }) {
  const src = blogImageSrc(article.obraz_glowny);

  if (!src) return <CoverPlaceholder />;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- CMS files are served through the authenticated proxy; next/image optimization is off site-wide
    <img
      alt={article.obraz_alt ?? ""}
      className={coverImageClass}
      decoding="async"
      height={900}
      loading="lazy"
      src={src}
      width={1600}
    />
  );
}

/** The cover as a link. The title beside it is the link assistive tech and the keyboard use. */
function CoverLink({ article, locale, className = "" }: { article: ArticleListRow; locale: BlogLocale; className?: string }) {
  return (
    <Link
      aria-hidden="true"
      className={`group relative block aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] bg-[rgba(11,17,22,0.04)] ${className}`}
      href={articlePath(locale, article.slug)}
      tabIndex={-1}
    >
      <Cover article={article} />
    </Link>
  );
}

function ReadTime({ minutes, ui }: { minutes: number; ui: BlogUiContent }) {
  return (
    <span className="whitespace-nowrap">
      {minutes} {ui.labels.minRead}
    </span>
  );
}

function DateAndRead({ article, locale, ui }: Shared) {
  return (
    <p className={smallClass}>
      <time dateTime={article.data_publikacji}>{formatDate(article.data_publikacji, locale)}</time>
      {article.czas_czytania ? (
        <>
          <span aria-hidden="true"> · </span>
          <ReadTime minutes={article.czas_czytania} ui={ui} />
        </>
      ) : null}
    </p>
  );
}

function CategoryLink({ article, locale, className = "text-[var(--color-blue)]" }: { article: ArticleListRow; locale: BlogLocale; className?: string }) {
  if (!article.kategoria_slug || !article.kategoria_nazwa) return null;

  return (
    <Link className={`${labelClass} ${className} transition-opacity hover:opacity-70`} href={categoryPath(locale, article.kategoria_slug)}>
      {article.kategoria_nazwa}
    </Link>
  );
}

/**
 * An article as one picture: its cover fills the card and the text sits on a
 * graphite scrim. The page's newest article gets the tall version; the first
 * article of a topic section gets a shorter one, without the category its
 * section already names.
 */
function OverlayStory({ article, locale, ui, lead }: Shared & { lead: boolean }) {
  const src = blogImageSrc(article.obraz_glowny);
  const Title = lead ? "h2" : "h3";

  return (
    <article
      className={`relative isolate flex flex-col justify-end overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-surface-dark)] text-white ${
        lead ? "min-h-[32.5rem] max-[809px]:min-h-[26rem]" : "min-h-[25rem] max-[809px]:min-h-[21rem]"
      }`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- CMS files are served through the authenticated proxy; next/image optimization is off site-wide
        <img
          alt={article.obraz_alt ?? ""}
          className="absolute inset-0 -z-20 size-full object-cover"
          decoding="async"
          fetchPriority={lead ? "high" : "auto"}
          height={900}
          loading={lead ? "eager" : "lazy"}
          src={src}
          width={1600}
        />
      ) : null}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(11,17,22,0.94)_0%,rgba(11,17,22,0.86)_26%,rgba(11,17,22,0.7)_44%,rgba(11,17,22,0.46)_60%,rgba(11,17,22,0.22)_74%,rgba(11,17,22,0.07)_88%,rgba(11,17,22,0)_100%)]"
      />
      <div className={`max-w-[48.75rem] [text-shadow:0_1px_16px_rgba(11,17,22,0.5)] max-[809px]:p-6 ${lead ? "p-10" : "p-9"}`}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {lead ? <CategoryLink article={article} className="text-[var(--color-blue-soft)]" locale={locale} /> : null}
          <time className={`${labelClass} text-white/72`} dateTime={article.data_publikacji}>
            {formatDate(article.data_publikacji, locale)}
          </time>
        </div>
        <Title
          className={`m-0 leading-[1.1] tracking-[-0.035em] ${lead ? "mt-4 text-[clamp(1.6rem,2.7vw,2.4rem)]" : "mt-3 text-[clamp(1.4rem,2.1vw,1.85rem)] leading-[1.15]"}`}
        >
          <Link className="transition-opacity hover:opacity-80" href={articlePath(locale, article.slug)}>
            {article.tytul}
          </Link>
        </Title>
        {article.zajawka ? (
          <p
            className={`m-0 font-display font-light leading-[1.6] text-white/80 ${
              lead ? "mt-3.5 text-[1.05rem] max-[809px]:text-[0.98rem]" : "mt-3 line-clamp-2 text-[1rem] max-[809px]:text-[0.95rem]"
            }`}
          >
            {article.zajawka}
          </p>
        ) : null}
        <p className={`m-0 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.88rem] text-white/72 ${lead ? "mt-5" : "mt-4"}`}>
          {article.autor_slug && article.autor_nazwa ? (
            <Link className="font-medium text-white transition-opacity hover:opacity-75" href={authorPath(locale, article.autor_slug)}>
              {article.autor_nazwa}
            </Link>
          ) : null}
          {article.czas_czytania ? <ReadTime minutes={article.czas_czytania} ui={ui} /> : null}
        </p>
      </div>
    </article>
  );
}

/** The newest article on the page. */
export function LeadStory(props: Shared) {
  return <OverlayStory {...props} lead />;
}

/** The first article of a topic section. */
export function FeatureStory(props: Shared) {
  return <OverlayStory {...props} lead={false} />;
}

/**
 * A headline under its date: the lists beside the lead and beside each topic's
 * cover. A topic's own list leaves the category out, since its heading names it.
 */
export function HeadlineItem({ article, locale, withCategory = true }: Omit<Shared, "ui"> & { withCategory?: boolean }) {
  return (
    <article className="py-3.5 first:pt-0 last:pb-0">
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <time className={`${labelClass} text-[var(--color-muted)]`} dateTime={article.data_publikacji}>
          {formatDate(article.data_publikacji, locale)}
        </time>
        {withCategory ? <CategoryLink article={article} locale={locale} /> : null}
      </div>
      <h3 className="m-0 mt-2 text-[1.08rem] leading-[1.3] tracking-[-0.015em]">
        <Link className={titleLinkClass} href={articlePath(locale, article.slug)}>
          {article.tytul}
        </Link>
      </h3>
    </article>
  );
}

/** Cover on top, text under it. */
export function ArticleCard({ article, locale, ui }: Shared) {
  return (
    <article>
      <CoverLink article={article} locale={locale} />
      <div className="mt-[1.125rem] flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <CategoryLink article={article} locale={locale} />
        <DateAndRead article={article} locale={locale} ui={ui} />
      </div>
      <h3 className="m-0 mt-2.5 text-[1.2rem] leading-[1.3] tracking-[-0.02em]">
        <Link className={titleLinkClass} href={articlePath(locale, article.slug)}>
          {article.tytul}
        </Link>
      </h3>
      {article.zajawka ? <p className="m-0 mt-2.5 line-clamp-3 text-[0.96rem] leading-[1.6] text-[var(--color-muted)]">{article.zajawka}</p> : null}
    </article>
  );
}

/**
 * Title and date only, with an optional two-line standfirst: the tail of a
 * section. It carries no spacing or rule of its own; the list it sits in sets both.
 */
export function TextItem({
  article,
  locale,
  ui,
  withLead = false,
  className = "",
}: Shared & { withLead?: boolean; className?: string }) {
  return (
    <article className={className || undefined}>
      <h3 className="m-0 text-[1.06rem] font-medium leading-[1.35] tracking-[-0.01em]">
        <Link className={titleLinkClass} href={articlePath(locale, article.slug)}>
          {article.tytul}
        </Link>
      </h3>
      {withLead && article.zajawka ? (
        <p className="m-0 mt-2 line-clamp-2 text-[0.96rem] leading-[1.6] text-[var(--color-muted)]">{article.zajawka}</p>
      ) : null}
      <div className="mt-2">
        <DateAndRead article={article} locale={locale} ui={ui} />
      </div>
    </article>
  );
}

/**
 * One entry of the full stream: a small cover beside the category, title,
 * standfirst and date. On a phone the cover moves to the right of the title
 * and the standfirst is dropped, so a screen still holds several articles.
 */
export function StreamRow({ article, locale, ui }: Shared) {
  return (
    <article className="grid grid-cols-[12.5rem_minmax(0,1fr)] items-center gap-x-9 py-6 first:pt-0 max-[640px]:grid-cols-[minmax(0,1fr)_6.5rem] max-[640px]:items-start max-[640px]:gap-x-5 max-[640px]:py-5">
      <CoverLink article={article} className="rounded-[12px] max-[640px]:order-2 max-[640px]:aspect-square" locale={locale} />
      <div className="min-w-0">
        <CategoryLink article={article} locale={locale} />
        <h3 className="m-0 mt-2 text-[1.3rem] leading-[1.25] tracking-[-0.025em] max-[640px]:text-[1.08rem]">
          <Link className={titleLinkClass} href={articlePath(locale, article.slug)}>
            {article.tytul}
          </Link>
        </h3>
        {article.zajawka ? (
          <p className="m-0 mt-2.5 line-clamp-2 text-[0.96rem] leading-[1.6] text-[var(--color-muted)] max-[640px]:hidden">{article.zajawka}</p>
        ) : null}
        <div className="mt-3 max-[640px]:mt-2">
          <DateAndRead article={article} locale={locale} ui={ui} />
        </div>
      </div>
    </article>
  );
}

/** A numbered entry in the rail's short lists. */
export function PickItem({ article, locale, ui, index }: Shared & { index: number }) {
  return (
    <li className="flex gap-4 py-3.5 first:pt-0 last:pb-0">
      <span aria-hidden="true" className="w-7 shrink-0 pt-[3px] text-[0.95rem] font-medium leading-none tabular-nums text-[var(--color-blue)]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        <h3 className="m-0 font-display text-[1rem] font-medium leading-[1.35] tracking-[-0.01em]">
          <Link className={titleLinkClass} href={articlePath(locale, article.slug)}>
            {article.tytul}
          </Link>
        </h3>
        <p className={`${smallClass} mt-1.5`}>
          {article.kategoria_nazwa ? <span>{article.kategoria_nazwa}</span> : null}
          {article.kategoria_nazwa && article.czas_czytania ? <span aria-hidden="true"> · </span> : null}
          {article.czas_czytania ? (
            <ReadTime minutes={article.czas_czytania} ui={ui} />
          ) : null}
        </p>
      </div>
    </li>
  );
}
