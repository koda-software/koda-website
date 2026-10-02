import { readJson, validateSnapshot, manifestPath } from './lib/content.mjs';
import { validateSearch } from './lib/search.mjs';
import path from 'node:path';
const root = process.cwd();
if (process.argv[2] === '--search') {
  const manifest = validateSnapshot(root);
  validateSearch(readJson(process.argv[3]), manifest);
  console.log(`[docs] Validated search export against ${manifest.contentHash}.`);
} else {
  validateSnapshot(root);
  console.log(`[docs] Snapshot OK: ${readJson(path.join(root, manifestPath)).contentHash}`);
}
