import crypto from "node:crypto";
import { blobConfigured, syncSnapshot } from "@/lib/tools/e-delivery-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function secretMatches(provided: string, expected: string) {
  const a = crypto.createHash("sha256").update(provided, "utf8").digest();
  const b = crypto.createHash("sha256").update(expected, "utf8").digest();
  return crypto.timingSafeEqual(a, b);
}

/**
 * The daily copy of the gov.pl e-Doręczenia list into Vercel Blob (see vercel.json crons).
 * Vercel sends `Authorization: Bearer $CRON_SECRET`. A failed validation keeps the last
 * good snapshot and answers 500, so the run shows as failed in the Vercel logs.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization") ?? "";
  const headers = { "Cache-Control": "no-store" };

  if (!secret) return Response.json({ error: "CRON_SECRET is not set" }, { status: 503, headers });
  if (!authorization.startsWith("Bearer ") || !secretMatches(authorization.slice(7), secret)) {
    return Response.json({ error: "unauthorized" }, { status: 401, headers });
  }
  if (!blobConfigured()) {
    return Response.json({ error: "Blob is not configured: connect a Blob store so BLOB_READ_WRITE_TOKEN is set" }, { status: 503, headers });
  }

  const result = await syncSnapshot();

  if (result.status === "failed") {
    console.error(`e-delivery sync failed: ${result.error}`);
    return Response.json(result, { status: 500, headers });
  }

  console.info(`e-delivery sync ${result.status}: list ${result.manifest.listDate}, ${result.manifest.rows} rows`);
  return Response.json(result, { headers });
}
