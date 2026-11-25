import Link from "next/link";
import type { ReactNode } from "react";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right.mjs";
import type { BlogUiContent } from "@/content/types";
import { fillTemplate } from "@/lib/blog/format";
import { blogPagePath, categoryPath } from "@/lib/blog/routes";
import type { ArticleListRow, BlogLocale } from "@/lib/blog/types";
import { BlogRail } from "./BlogRail";
import { FeatureStory, HeadlineItem, LeadStory, StreamRow, TextItem } from "./cards";
import type { BlogFrame } from "./frame";
import { Pagination } from "./Pagination";
import { PromoBanner, ToolBanner } from "./Promos";
import { TopicBar, type Topic } from "./TopicBar";
import { BlogClosingBand, BlogMasthead, blogBodyClass, blogSectionHeadClass, blogSectionTitleClass, blogShellClass, blogWithRailClass } from "./primitives";

type BlogHubPageProps = BlogFrame & {
  /** Every published article, newest first. */
  articles: ArticleListRow[];
  /** The first page of the paginated stream. */
  stream: ArticleListRow[];
  totalPages: number;
  /** Rendered under the stream, e.g. the list of every tag. */
  footer?: ReactNode;
};

const latestCount = 4;
/** From this many articles a topic gets a full section; below it, a short text column. */
const mediumFrom = 3;
const allLinkClass = "group inline-flex items-center gap-2 text-[0.95rem] font-semibold text-[var(--color-blue)] transition-colors hover:text-[var(--color-blue-deep)]";

type Section = { topic: Topic; articles: ArticleListRow[] };

function SectionHead({ id, locale, topic, ui, compact = false }: { id: string; locale: BlogLocale; topic: Topic; ui: BlogUiContent; compact?: boolean }) {
  return (
    <div className={`${blogSectionHeadClass} ${compact ? "pb-4" : ""}`}>
      <h2 className={compact ? "m-0 text-[1.35rem] leading-[1.2] tracking-[-0.025em]" : blogSectionTitleClass} id={id}>
        <Link className="transition-colors hover:text-[var(--color-blue)]" href={categoryPath(locale, topic.slug)}>
          {topic.name}
        </Link>
      </h2>
      <Link className={compact ? `${allLinkClass} text-[0.88rem]` : allLinkClass} href={categoryPath(locale, topic.slug)}>
        {fillTemplate(compact ? ui.hub.allShort : ui.hub.allCount, { count: topic.count })}
        {compact ? null : <ArrowRightIcon aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />}
      </Link>
    </div>
  );
}

const twoColumnClass = "grid grid-cols-2 gap-x-10 max-[809px]:grid-cols-1";

/** A topic section: its newest article with the cover, then the next two as headlines with a standfirst. */
function TopicSection({ section, locale, ui }: { section: Section; locale: BlogLocale; ui: BlogUiContent }) {
  const id = `topic-${section.topic.slug}`;
  const [first, ...rest] = section.articles;

  return (
    <section aria-labelledby={id}>
      <SectionHead id={id} locale={locale} topic={section.topic} ui={ui} />
      <div className="mt-7">
        <FeatureStory article={first} locale={locale} ui={ui} />
      </div>
      <div className={`${twoColumnClass} mt-9 gap-y-7`}>
        {rest.slice(0, 2).map((article) => (
          <TextItem article={article} key={article.id} locale={locale} ui={ui} withLead />
        ))}
      </div>
    </section>
  );
}

function SmallSection({ section, locale, ui }: { section: Section; locale: BlogLocale; ui: BlogUiContent }) {
  const id = `topic-${section.topic.slug}`;

  return (
    <section aria-labelledby={id}>
      <SectionHead compact id={id} locale={locale} topic={section.topic} ui={ui} />
      <div className="divide-y divide-[rgba(11,17,22,0.07)]">
        {section.articles.slice(0, 3).map((article) => (
          <TextItem article={article} className="py-[1.125rem] first:pt-0 last:pb-0" key={article.id} locale={locale} ui={ui} />
        ))}
      </div>
    </section>
  );
}

/**
 * The blog's front page, laid out like a news page: the newest article leads,
 * the next few sit beside it, every topic gets a section sized to what it
 * holds, and the complete, paginated stream closes the page. That last list is
 * what keeps every article one click from here however large the archive gets.
 *
 * Articles shown in the lead block are left out of the topic sections, so the
 * first screen and the sections under it never repeat each other.
 */
export function BlogHubPage({ locale, ui, shell, ctaHrefs, toolsHref, articles, topics, picks, promos, stream, totalPages, footer }: BlogHubPageProps) {
  const [lead, ...others] = articles;
  const latest = others.slice(0, latestCount);
  const shown = new Set([lead, ...latest].filter(Boolean).map((article) => article.id));
  const sections: Section[] = topics
    .map((topic) => ({ topic, articles: articles.filter((article) => article.kategoria_slug === topic.slug && !shown.has(article.id)) }))
    .filter((section) => section.articles.length > 0);
  const wide = sections.filter((section) => section.articles.length >= mediumFrom);
  const small = sections.filter((section) => section.articles.length < mediumFrom);

  return (
    <>
      <BlogMasthead description={ui.index.description} title={ui.index.title} />
      <TopicBar active={null} locale={locale} topics={topics} total={articles.length} ui={ui} />

      {lead ? (
        <section aria-label={ui.hub.topStories} className={`${blogShellClass} pt-12`}>
          <div className="grid grid-cols-[minmax(0,1fr)_25rem] gap-x-14 gap-y-10 max-[1100px]:grid-cols-1">
            <LeadStory article={lead} locale={locale} ui={ui} />
            {latest.length > 0 ? (
              <section aria-labelledby="blog-latest">
                <div className="flex items-baseline justify-between gap-4 border-b border-[rgba(11,17,22,0.2)] pb-3.5">
                  <h2 className="m-0 font-sans text-[0.78rem] font-semibold uppercase tracking-[0.08em]" id="blog-latest">
                    {ui.hub.latest}
                  </h2>
                  <a className="text-[0.88rem] font-semibold text-[var(--color-blue)] transition-colors hover:text-[var(--color-blue-deep)]" href="#all-articles">
                    {fillTemplate(ui.hub.allCount, { count: articles.length })}
                  </a>
                </div>
                <div className="divide-y divide-[rgba(11,17,22,0.07)]">
                  {latest.map((article) => (
                    <HeadlineItem article={article} key={article.id} locale={locale} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </section>
      ) : null}

      <div className={`${blogShellClass} pt-12`}>
        <PromoBanner ctaHrefs={ctaHrefs} shell={shell} ui={ui} />
      </div>

      <div className={`${blogShellClass} pt-[4.5rem]`}>
        <div className={blogWithRailClass} data-pin-bounds>
          <div className="flex min-w-0 flex-col gap-[4.5rem]">
            {wide.map((section, index) => (
              <div className="contents" key={section.topic.slug}>
                <TopicSection locale={locale} section={section} ui={ui} />
                {index === 0 && promos.tool ? <ToolBanner tool={promos.tool} toolCount={promos.toolCount} toolsHref={toolsHref} ui={ui} /> : null}
              </div>
            ))}

            {small.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-10 gap-y-14 max-[809px]:grid-cols-1">
                {small.map((section) => (
                  <SmallSection key={section.topic.slug} locale={locale} section={section} ui={ui} />
                ))}
              </div>
            ) : null}

            <section aria-labelledby="all-articles">
              <div className={blogSectionHeadClass}>
                <h2 className={blogSectionTitleClass} id="all-articles">
                  {ui.hub.streamHeading}
                </h2>
                <p className="m-0 text-[0.88rem] text-[var(--color-muted)]">{fillTemplate(ui.hub.streamCount, { count: articles.length })}</p>
              </div>
              {stream.length === 0 ? (
                <p className={`${blogBodyClass} mt-7`}>{ui.labels.emptyState}</p>
              ) : (
                <div className="mt-7 divide-y divide-[rgba(11,17,22,0.07)]">
                  {stream.map((article) => (
                    <StreamRow article={article} key={article.id} locale={locale} ui={ui} />
                  ))}
                </div>
              )}
              <Pagination buildHref={(target) => blogPagePath(locale, target)} page={1} totalPages={totalPages} ui={ui} />
              {footer}
            </section>
          </div>

          <BlogRail ctaHrefs={ctaHrefs} locale={locale} picks={picks} promos={promos} shell={shell} toolsHref={toolsHref} ui={ui} />
        </div>
      </div>

      <BlogClosingBand ctaHrefs={ctaHrefs} ui={ui} />
    </>
  );
}
