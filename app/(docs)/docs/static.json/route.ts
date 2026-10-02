import { exportSearchIndexes } from '@/lib/docs/export-search-indexes';

export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  return Response.json(await exportSearchIndexes());
}
