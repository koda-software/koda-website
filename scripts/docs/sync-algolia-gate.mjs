// postbuild: syncs the production docs search index from production builds only.
// Preview test indices are seeded separately (5.1a); this hook never writes from previews.
// DOCS_ALGOLIA_SYNC=off is the kill switch for a rollback (plan Section 7.3).
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const indexFile = ".next/server/app/docs/static.json.body";

if (!existsSync(indexFile)) {
  console.error(`[docs] ${indexFile} is missing: app/(docs)/docs/static.json was not prerendered.`);
  process.exit(1);
}

const records = JSON.parse(readFileSync(indexFile, "utf8"));
// Implement this validator per 9.3a: nonempty export, both locales, unique IDs, URL set/counts.
const validation = spawnSync(path.join("node_modules", ".bin", "tsx"), [
  "scripts/docs/validate-content.ts", "--search", indexFile,
], { stdio: "inherit" });
if (validation.status !== 0) process.exit(validation.status ?? 1);
console.log(`[docs] search export: ${records.length} page documents.`);

if (process.env.VERCEL_ENV !== "production") {
  console.log(`[docs] Algolia sync skipped: VERCEL_ENV is ${process.env.VERCEL_ENV ?? "not set"}.`);
  process.exit(0);
}

if (process.env.DOCS_ALGOLIA_SYNC === "off") {
  console.log("[docs] Algolia sync skipped: DOCS_ALGOLIA_SYNC=off.");
  process.exit(0);
}

if (!process.env.ALGOLIA_ADMIN_API_KEY?.trim()) {
  console.error("[docs] ALGOLIA_ADMIN_API_KEY is not set for Production: search would keep stale records.");
  process.exit(1);
}

const result = spawnSync(path.join("node_modules", ".bin", "tsx"), ["scripts/docs/sync-algolia.ts"], {
  stdio: "inherit",
});

process.exit(result.status ?? 1);
