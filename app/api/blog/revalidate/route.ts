import { revalidatePath, revalidateTag } from "next/cache";
import { BLOG_TAG } from "@/lib/blog/tags";
import { blogIndexPath, blogLocales, toSiteLocale } from "@/lib/blog/routes";
import { operoSignatureHeader, verifyOperoSignature } from "@/lib/blog/webhook-signature";
import { localizePath } from "@/lib/i18n/routes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Called by the Opero blog rules whenever something visible on the site
 * changes. Every request is signed by the `kodasoft_blog_revalidate`
 * credential (HMAC over the timestamp and the raw body), so the body itself
 * carries nothing secret and is not needed: every blog read is tagged `blog`,
 * and one purge of that tag refreshes every blog page, the sitemap and the
 * search index.
 */
export async function POST(request: Request) {
  const signingSecret = process.env.OPERO_REVALIDATE_HMAC_SECRET;

  if (!signingSecret) {
    return Response.json({ error: "Revalidation is not configured." }, { status: 500 });
  }

  // The signature covers the exact bytes Opero sent, so it is checked against the raw text.
  const raw = await request.text().catch(() => "");
  const check = verifyOperoSignature({
    secret: signingSecret,
    rawBody: raw,
    header: request.headers.get(operoSignatureHeader),
  });

  if (!check.ok) {
    return Response.json({}, { status: 401 });
  }

  // `{ expire: 0 }` is the webhook-shaped profile: external callers expect the
  // next request to serve fresh data, not stale-while-revalidate.
  revalidateTag(BLOG_TAG, { expire: 0 });

  const revalidated: string[] = [`tag:${BLOG_TAG}`];

  for (const locale of blogLocales) {
    const indexPath = blogIndexPath(locale);
    revalidatePath(indexPath);
    revalidated.push(indexPath);

    // The homepage embeds the latest articles, so a publish must refresh it too.
    const homePath = localizePath(toSiteLocale(locale), "home");
    revalidatePath(homePath);
    revalidated.push(homePath);
  }

  return Response.json({ revalidated, now: new Date().toISOString() });
}
