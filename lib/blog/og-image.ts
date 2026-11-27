import { createHash } from "node:crypto";
import { isFileId } from "./images";
import type { ArticleFullRow, BlogLocale } from "./types";

/**
 * Bump when the card's look changes (lib/og/blog-card.tsx). A new deploy
 * re-renders every card anyway; the bump changes each card's address so
 * LinkedIn, Facebook and Slack, which keep a shared image for weeks, fetch the
 * new one.
 */
const cardDesign = "1";

/** Everything the card shows. The route and the address both read it from here so they cannot drift. */
export function articleOgCard(article: ArticleFullRow) {
  return {
    title: article.tytul,
    label: article.kategoria_nazwa,
    // An editor's own OG image wins over the cover, as before; either way it becomes the card's background.
    coverId: [article.og_image, article.obraz_glowny].find(isFileId) ?? null,
  };
}

/**
 * Where an article's branded preview card lives. `?v=` is a hash of what the
 * card shows, so the address changes only when the picture does: social
 * platforms cache by address, and the route ignores the query.
 */
export function articleOgImagePath(locale: BlogLocale, article: ArticleFullRow) {
  const version = createHash("sha256")
    .update(JSON.stringify([cardDesign, articleOgCard(article)]))
    .digest("hex")
    .slice(0, 10);

  return `/og/blog/${locale}/${encodeURIComponent(article.slug)}?v=${version}`;
}
