/**
 * The glossary is Polish only for now (see the vault's website/glossary-plan.md), so it has
 * one base path rather than a slug per locale like the tools and feature pages.
 */
export const glossaryBasePath = "/pl/slownik";

export function glossaryPath(slug: string): string {
  return `${glossaryBasePath}/${slug}`;
}
