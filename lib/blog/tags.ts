/**
 * Cache tags for every Opero read.
 *
 * Each cached read carries the coarse `blog` tag plus one specific tag. The
 * revalidation webhook only purges `blog` today; the specific tags exist so the
 * invalidation can be tightened later without touching any page.
 */
export const BLOG_TAG = "blog";

export function blogTag(scope: string, key?: string) {
  return key ? `${BLOG_TAG}:${scope}:${key}` : `${BLOG_TAG}:${scope}`;
}
