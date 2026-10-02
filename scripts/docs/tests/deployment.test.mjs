import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const sitemap = (paths) => '<urlset>' + paths.map((p) => `<url><loc>https://www.kodasoft.pl${p}</loc></url>`).join('') + '</urlset>';
test('deployment checker rejects lost URLs, malformed sitemaps, bad metadata and wrong snapshots', async (t) => {
  const root = mkdtempSync(path.join(tmpdir(), 'docs-deployment-'));
  let state = {};
  const server = createServer((req, res) => {
    let body;
    if (req.url === '/docs/build.json') body = JSON.stringify({ contentHash: state.hash ?? 'accepted' });
    else if (req.url === '/docs-sitemap.xml') body = state.after;
    else if (req.url === '/docs/sitemap.xml') body = state.alias ?? state.after;
    else if (req.url === '/docs/en/lost') { res.statusCode = 404; body = 'missing'; }
    else body = `<link rel="canonical" href="https://www.kodasoft.pl/docs/en/${state.canonical ?? 'keep'}">`;
    res.end(body);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  t.after(() => { server.close(); rmSync(root, { recursive: true, force: true }); });
  const keep = '/docs/en/keep', lost = '/docs/en/lost';
  for (const [name, overrides, before, expected, exceptions] of [
    ['unchanged', {}, [keep], true],
    ['lost URL', {}, [keep, lost], false],
    ['empty sitemap', { after: '<urlset></urlset>' }, [], false],
    ['malformed XML', { after: '<urlset><url>' }, [keep], false],
    ['wrong canonical', { canonical: 'wrong' }, [keep], false],
    ['wrong hash', { hash: 'wrong' }, [keep], false],
    ['reviewed removal', {}, [keep, lost], true, { removed: [{ path: lost, reason: 'Reviewed deletion', status: 404 }], added: [] }],
    ['alias mismatch', { alias: sitemap([keep, lost]) }, [keep], false],
  ]) {
    state = { after: sitemap([keep]), ...overrides };
    writeFileSync(path.join(root, 'before.xml'), sitemap(before));
    writeFileSync(path.join(root, 'exceptions.json'), JSON.stringify(exceptions ?? { removed: [], added: [] }));
    const child = spawn(process.execPath, ['scripts/docs/verify-deployment.mjs'], {
      env: { ...process.env, PREVIEW: `http://127.0.0.1:${server.address().port}`, BEFORE: path.join(root, 'before.xml'),
        EXCEPTIONS: path.join(root, 'exceptions.json'), EXPECTED_CONTENT_HASH: 'accepted' }, stdio: 'pipe',
    });
    let output = '';
    child.stdout.on('data', (chunk) => { output += chunk; }); child.stderr.on('data', (chunk) => { output += chunk; });
    const code = await new Promise((resolve, reject) => { child.on('error', reject); child.on('exit', resolve); });
    assert.equal(code === 0, expected, `${name}: ${output}`);
  }
});
