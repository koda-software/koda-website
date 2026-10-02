import { cpSync, existsSync, mkdirSync, mkdtempSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createManifest, readJson, manifestPath, validateSnapshot, validateInventory, validateCandidate, checkLinks, writeManifest } from './content.mjs';
import { fetchSources } from './fetch.mjs';

// Swap all generated directories and manifest as one recoverable local transaction.
export function replaceGenerated(root, staged, rename = renameSync) {
  const targets = ['content/docs/en/opero', 'content/docs/pl/opero', 'content/docs/en/api', 'content/docs/pl/api', 'content/openapi', manifestPath];
  const backup = mkdtempSync(path.join(root, '.docs-staging/backup-'));
  const moved = [], installed = [];
  try {
    for (const relative of targets) {
      const dest = path.join(root, relative), old = path.join(backup, relative);
      mkdirSync(path.dirname(old), { recursive: true });
      if (existsSync(dest)) { rename(dest, old); moved.push(relative); }
      rename(path.join(staged, relative), dest); installed.push(relative);
    }
  } catch (error) {
    // Use the native rename for restoration, independent of an injected/test failing swap.
    for (const relative of installed.reverse()) rmSync(path.join(root, relative), { recursive: true, force: true });
    for (const relative of moved.reverse()) renameSync(path.join(backup, relative), path.join(root, relative));
    throw error;
  } finally { rmSync(backup, { recursive: true, force: true }); }
}
export async function generate(root, { refresh = false, accept = false, env = process.env, fetchOptions } = {}) {
  const policy = readJson(path.join(root, 'scripts/docs/content-policy.json'));
  if (!['snapshot', 'live'].includes(policy.mode)) throw new Error('Invalid docs content mode');
  const baselineFile = path.join(root, manifestPath);
  const accepted = existsSync(baselineFile) ? readJson(baselineFile) : undefined;
  if (accept) {
    if (env.CI || env.VERCEL) throw new Error('Accepting a baseline is a local reviewed operation');
    const metadata = { fetchedAt: accepted?.fetchedAt ?? policy.importedAt, sourceRevision: policy.sourceRevision };
    const next = createManifest(root, metadata); checkLinks(root); writeManifest(root, next);
    console.log(`[docs] Accepted snapshot ${next.contentHash}; review/commit manifest and content together.`);
    return next;
  }
  if (!accepted) throw new Error('Missing accepted docs manifest');
  if (!refresh && (policy.mode === 'snapshot' || !env.OPERO_DOCS_API_KEY?.trim() && !env.CI && !env.VERCEL)) {
    const current = validateSnapshot(root); checkLinks(root);
    console.log(`[docs] Validated committed snapshot ${current.contentHash}.`); return current;
  }
  validateInventory(root, accepted);
  const sources = await fetchSources(env, fetchOptions); // No content writes before every source validates.
  const stagingParent = path.join(root, '.docs-staging'); mkdirSync(stagingParent, { recursive: true });
  const staged = mkdtempSync(path.join(stagingParent, 'generate-'));
  try {
    cpSync(path.join(root, 'content'), path.join(staged, 'content'), { recursive: true });
    const input = path.join(staged, 'inputs'); mkdirSync(input);
    for (const [locale, source] of Object.entries(sources)) {
      writeFileSync(path.join(input, `records.${locale}.json`), JSON.stringify(source.records));
      writeFileSync(path.join(input, `schema.${locale}.json`), JSON.stringify(source.schema));
    }
    mkdirSync(path.join(staged, 'scripts/docs'), { recursive: true });
    cpSync(path.join(root, 'scripts/docs/manual-api-pages.json'), path.join(staged, 'scripts/docs/manual-api-pages.json'));
    for (const script of ['generate-opero-docs.ts', 'generate-external-api-docs.ts']) {
      execFileSync(path.join(root, 'node_modules/.bin/tsx'), [path.join(root, 'scripts/docs', script)], {
        cwd: root, env: { ...env, DOCS_OUTPUT_ROOT: staged, DOCS_INPUT_DIR: input }, stdio: 'inherit', timeout: 300_000,
      });
    }
    const candidate = createManifest(staged, { fetchedAt: new Date().toISOString(), sourceRevision: policy.sourceRevision });
    validateCandidate(candidate, accepted, readJson(path.join(root, 'scripts/docs/cutover-url-exceptions.json')), policy.maxCountDropPercent);
    checkLinks(staged); writeManifest(staged, candidate); replaceGenerated(root, staged);
    console.log(`[docs] Validated live content ${candidate.contentHash}.`); return candidate;
  } finally { rmSync(staged, { recursive: true, force: true }); }
}
