import crypto from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { BLOG_TAG } from "@/lib/blog/tags";
import { articlePath, blogIndexPath, blogLocales, toBlogLocale } from "@/lib/blog/routes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type WebhookPayload = {
  id?: unknown;
  typ?: unknown;
  slug?: unknown;
  jezyk?: unknown;
  status?: unknown;
  secret?: unknown;
};

/** Constant-time compare that does not leak length through early return. */
function secretMatches(provided: string | null, expected: string) {
  if (!provided) return false;

  const providedHash = crypto.createHash("sha256").update(provided, "utf8").digest();
  const expectedHash = crypto.createHash("sha256").update(expected, "utf8").digest();

  return crypto.timingSafeEqual(providedHash, expectedHash);
}

/**
 * The CMS webhook rule may carry the secret as a header, a bearer token, a
 * query parameter or a body field depending on how the rule is configured, so
 * every candidate is checked against the same constant-time comparison.
 */
function candidateSecrets(request: Request, url: URL, body: WebhookPayload): string[] {
  const authorization = request.headers.get("authorization") ?? "";
  const bearer = authorization.toLowerCase().startsWith("bearer ") ? authorization.slice(7) : null;

  return [
    request.headers.get("x-opero-secret"),
    request.headers.get("x-webhook-secret"),
    request.headers.get("x-revalidate-secret"),
    bearer,
    url.searchParams.get("secret"),
    typeof body.secret === "string" ? body.secret : null,
  ].filter((value): value is string => typeof value === "string" && value.length > 0);
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

export async function POST(request: Request) {
  const expected = process.env.OPERO_REVALIDATE_SECRET;

  if (!expected) {
    return Response.json({ error: "Revalidation is not configured." }, { status: 500 });
  }

  const url = new URL(request.url);
  let body: WebhookPayload = {};

  try {
    const raw = await request.text();
    if (raw.trim()) body = JSON.parse(raw) as WebhookPayload;
  } catch {
    // A malformed body is not fatal — the coarse purge below still applies.
    body = {};
  }

  if (!candidateSecrets(request, url, body).some((candidate) => secretMatches(candidate, expected))) {
    return Response.json({}, { status: 401 });
  }

  // `{ expire: 0 }` is the webhook-shaped profile: external callers expect the
  // next request to serve fresh data, not stale-while-revalidate.
  revalidateTag(BLOG_TAG, { expire: 0 });

  const revalidated: string[] = [`tag:${BLOG_TAG}`];
  const slug = asString(body.slug);
  const jezyk = toBlogLocale(asString(body.jezyk));
  const targets = jezyk ? [jezyk] : blogLocales;

  for (const locale of targets) {
    const indexPath = blogIndexPath(locale);
    revalidatePath(indexPath);
    revalidated.push(indexPath);

    if (slug) {
      const path = articlePath(locale, slug);
      revalidatePath(path);
      revalidated.push(path);
    }
  }

  return Response.json({ revalidated, now: new Date().toISOString() });
}
