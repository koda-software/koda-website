import { fileIdPattern } from "@/lib/blog/images";
import { operoFetch, requireCompanyId } from "@/lib/blog/opero";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Opero files are private, so images are streamed through this authenticated
 * proxy. The CDN carries the load; the origin is only hit on a cache miss.
 * File ids appear immutable per upload but that is unconfirmed, hence
 * stale-while-revalidate rather than `immutable`.
 */
const cacheControl = "public, max-age=0, s-maxage=31536000, stale-while-revalidate=86400";

export async function GET(_request: Request, { params }: RouteContext<"/api/blog/image/[fileId]">) {
  const { fileId } = await params;

  if (!fileIdPattern.test(fileId)) {
    return new Response("Invalid file id.", { status: 400 });
  }

  let upstream: Response;

  try {
    upstream = await operoFetch(`/v1/companies/${requireCompanyId()}/files/${fileId}/download`);
  } catch {
    return new Response("Image backend unavailable.", { status: 502 });
  }

  if (upstream.status === 404 || upstream.status === 403) {
    return new Response("Not found.", { status: 404 });
  }

  if (!upstream.ok || !upstream.body) {
    return new Response("Image backend error.", { status: 502 });
  }

  const headers = new Headers({
    "Content-Type": upstream.headers.get("content-type") ?? "application/octet-stream",
    "Cache-Control": cacheControl,
    // Files are downloads upstream; inline them so <img> renders them.
    "Content-Disposition": "inline",
    "X-Content-Type-Options": "nosniff",
  });

  const contentLength = upstream.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);

  return new Response(upstream.body, { status: 200, headers });
}
