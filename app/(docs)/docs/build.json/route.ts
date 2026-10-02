import manifest from '@/content/docs-build-manifest.json';
import policy from '@/scripts/docs/content-policy.json';
export const dynamic = 'force-static';
export function GET() {
  return Response.json({ contentHash: manifest.contentHash, fetchedAt: manifest.fetchedAt,
    counts: manifest.counts, mode: policy.mode,
    deploymentUrl: process.env.VERCEL_URL ?? 'local',
    gitRevision: process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.DOCS_GIT_REVISION ?? 'local',
  });
}
