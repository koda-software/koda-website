import type { BlogUiContent, ShellContent } from "@/content/types";
import type { BlogPromos } from "@/lib/blog/promos";
import type { ArticleListRow, BlogLocale } from "@/lib/blog/types";
import type { Topic } from "./TopicBar";

/** What every blog page shows around its own content, whichever page it is. */
export type BlogFrame = {
  locale: BlogLocale;
  ui: BlogUiContent;
  shell: ShellContent;
  ctaHrefs: { primary: string; secondary: string };
  toolsHref: string;
  /** Categories that hold at least one article, for the topic bar. */
  topics: Topic[];
  /** Articles the editors flagged as featured in the CMS. */
  picks: ArticleListRow[];
  promos: BlogPromos;
};
