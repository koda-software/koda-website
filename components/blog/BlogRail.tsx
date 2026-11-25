import { PickItem } from "./cards";
import type { BlogFrame } from "./frame";
import { DemoCard, FeatureCard, ToolCard, ToolList } from "./Promos";
import { blogRailHeadClass } from "./primitives";

type BlogRailProps = Omit<BlogFrame, "topics"> & {
  /** On an article the rail leads with one tool as a card; lists show several tools as a list. */
  variant?: "list" | "article";
};

/**
 * The column beside a list or an article: the editors' picks and the internal
 * ads. An `<aside>`, so it is marked as secondary to the page's own content.
 */
export function BlogRail({ locale, ui, shell, ctaHrefs, toolsHref, picks, promos, variant = "list" }: BlogRailProps) {
  return (
    <aside aria-label={ui.hub.rail} className="flex h-full min-w-0 flex-col gap-10 self-stretch">
      {variant === "article" && promos.feature ? <FeatureCard ctaHrefs={ctaHrefs} feature={promos.feature} ui={ui} /> : null}
      {variant === "article" && promos.tool ? <ToolCard tool={promos.tool} ui={ui} /> : null}

      {picks.length > 0 ? (
        <section aria-labelledby="blog-picks">
          <h2 className={blogRailHeadClass} id="blog-picks">
            {ui.hub.picks}
          </h2>
          <ol className="m-0 list-none divide-y divide-[rgba(11,17,22,0.07)] p-0">
            {picks.map((article, index) => (
              <PickItem article={article} index={index} key={article.id} locale={locale} ui={ui} />
            ))}
          </ol>
        </section>
      ) : null}

      {variant === "list" && promos.feature ? <FeatureCard ctaHrefs={ctaHrefs} feature={promos.feature} ui={ui} /> : null}
      {variant === "list" ? <ToolList headingId="blog-tools" toolCount={promos.toolCount} tools={promos.toolList} toolsHref={toolsHref} ui={ui} /> : null}

      <DemoCard ctaHrefs={ctaHrefs} shell={shell} ui={ui} />
    </aside>
  );
}
