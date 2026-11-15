#!/usr/bin/env node
// Captures the cropped product screenshots used by the Extensions docs.
//
// It drives an already running, signed-in Chrome over raw CDP (Node 24's global WebSocket, no
// dependencies), opens one tab of its own, shoots every entry of shots.json into
// public/docs/_assets/extensions/<file>, converts it to WebP with tools/get-low and closes only
// the tab it opened. Start the capture browser yourself and sign in there once; this script never
// launches Chrome, never types credentials and never touches the other tabs:
//
//   google-chrome --user-data-dir=<scratch profile> --remote-debugging-port=9333 http://localhost:3002
//
// Usage (from the koda-website root):
//   node scripts/docs/extension-shots/capture.mjs                 every shot in shots.json
//   node scripts/docs/extension-shots/capture.mjs overview/extension-overview.webp ...
//   node scripts/docs/extension-shots/capture.mjs --dump <url>    print landmarks and their rects
//   node scripts/docs/extension-shots/capture.mjs --keep-png ...  keep the PNG next to the WebP
//
// Environment: CDP_URL (default http://127.0.0.1:9333), OPERO_FRONT (default
// http://localhost:3002), OPERO_ORG (default the QA Extensions organization).
//
// A shot entry:
//   {
//     "file": "overview/extension-overview.webp",    path under public/docs/_assets/extensions
//     "page": "index", "state": "...",               notes for people: the docs page, the state to set up
//     "url": "/manage/$ORG/extensions/data-ext?tab=overview",      $ORG is replaced
//     "waitFor": "css selector",                     waited for after navigation (visible)
//     "steps": [ { "click": "sel" }, { "waitFor": "sel" }, { "eval": "js" }, { "sleep": 500 },
//                { "upload": { "selector": "input[type=file]", "file": "path from the site root" } } ],
//     "hide": ["css selector"],                      set to visibility:hidden before the shot
//     "clip": { "selector": "sel" } | { "selectors": ["sel", ...] } | { "rect": {x,y,width,height} },
//     "maxHeight": 900,                              cut the clip to this many CSS px tall
//     "pad": 16,                                     CSS px of margin around the clip
//     "minY": 60,                                    never start the padded clip above this page y
//     "viewportHeight": 900                          raise it so a tall dialog fits unscrolled
//   }
// Selectors may use the :text("...") suffix, e.g. "button:text(\"Review update\")", which picks
// the first element matching the CSS part whose trimmed text includes the given string.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(here, '../../..');
const assetsRoot = path.join(siteRoot, 'public/docs/_assets/extensions');
const getLow = path.join(siteRoot, 'tools/get-low');

const CDP_URL = process.env.CDP_URL ?? 'http://127.0.0.1:9333';
const FRONT = process.env.OPERO_FRONT ?? 'http://localhost:3002';
const ORG = process.env.OPERO_ORG ?? '99833ab0-4ea1-4555-b465-8555f20c22a0';
const WIDTH = 1440;
const HEIGHT = 900;
const DPR = 2;
const MAX_OUTPUT_WIDTH = 1800; // device px
const TIMEOUT_MS = 30_000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class Cdp {
  #ws;
  #nextId = 1;
  #pending = new Map();
  #listeners = new Set();

  static async connect(url) {
    const cdp = new Cdp();
    cdp.#ws = new WebSocket(url);
    await new Promise((resolve, reject) => {
      cdp.#ws.addEventListener('open', resolve, { once: true });
      cdp.#ws.addEventListener('error', () => reject(new Error(`Cannot open ${url}`)), { once: true });
    });
    cdp.#ws.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.id && cdp.#pending.has(message.id)) {
        const { resolve, reject, method } = cdp.#pending.get(message.id);
        cdp.#pending.delete(message.id);
        if (message.error) reject(new Error(`${method}: ${message.error.message}`));
        else resolve(message.result);
      } else if (message.method) {
        for (const listener of cdp.#listeners) listener(message);
      }
    });
    return cdp;
  }

  send(method, params = {}) {
    const id = this.#nextId++;
    this.#ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.#pending.set(id, { resolve, reject, method }));
  }

  once(method, timeoutMs = TIMEOUT_MS) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.#listeners.delete(listener);
        reject(new Error(`Timed out waiting for ${method}`));
      }, timeoutMs);
      const listener = (message) => {
        if (message.method !== method) return;
        clearTimeout(timer);
        this.#listeners.delete(listener);
        resolve(message.params);
      };
      this.#listeners.add(listener);
    });
  }

  close() {
    this.#ws.close();
  }
}

// Runs in the page: resolves a selector with the optional :text("...") suffix.
const FIND_SOURCE = `(selector) => {
  const match = /^(.*):text\\("(.*)"\\)$/.exec(selector);
  const css = match ? (match[1] || '*') : selector;
  const text = match ? match[2] : null;
  const visible = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  for (const el of document.querySelectorAll(css)) {
    if (!visible(el)) continue;
    if (text === null || (el.textContent ?? '').trim().includes(text)) return el;
  }
  return null;
}`;

async function evaluate(cdp, expression) {
  const result = await cdp.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) {
    throw new Error(`Page script failed: ${result.exceptionDetails.exception?.description ?? result.exceptionDetails.text}`);
  }
  return result.result.value;
}

async function waitForSelector(cdp, selector) {
  const deadline = Date.now() + TIMEOUT_MS;
  while (Date.now() < deadline) {
    const found = await evaluate(cdp, `!!(${FIND_SOURCE})(${JSON.stringify(selector)})`);
    if (found) return;
    await sleep(250);
  }
  throw new Error(`Timed out waiting for ${selector}`);
}

// Waits until no request has been in flight for `quietMs` (spinners, lazy sections, fonts).
async function waitForQuiet(cdp, quietMs = 800) {
  await evaluate(cdp, `document.fonts.ready.then(() => true)`);
  const deadline = Date.now() + TIMEOUT_MS;
  let last = '';
  let stableSince = Date.now();
  while (Date.now() < deadline) {
    const snapshot = await evaluate(
      cdp,
      `[document.querySelectorAll('[aria-busy="true"], .animate-spin, [data-slot="skeleton"]').length,
        document.body?.innerText.length ?? -1].join(':')`,
    );
    if (snapshot !== last) {
      last = snapshot;
      stableSince = Date.now();
    } else if (Date.now() - stableSince >= quietMs && snapshot.startsWith('0:')) {
      return;
    }
    await sleep(150);
  }
  console.warn('  warning: the page did not settle; shooting anyway');
}

async function navigate(cdp, url) {
  const loaded = cdp.once('Page.loadEventFired');
  await cdp.send('Page.navigate', { url });
  await loaded;
  const href = await evaluate(cdp, 'location.href');
  if (/\/(login|sign-in|auth)\b/.test(new URL(href).pathname)) {
    throw new Error(`The capture browser is signed out (landed on ${href}). Sign in there and run again.`);
  }
}

async function setViewport(cdp, height) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: WIDTH,
    height,
    deviceScaleFactor: DPR,
    mobile: false,
  });
}

async function prepareTab(cdp) {
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Network.enable');
  // A background tab throttles timers and stalls on spinners: make it behave as focused and active.
  await cdp.send('Emulation.setFocusEmulationEnabled', { enabled: true });
  await cdp.send('Page.setWebLifecycleState', { state: 'active' });
  await cdp.send('Emulation.setIdleOverride', { isUserActive: true, isScreenUnlocked: true });
  await cdp.send('Emulation.setEmulatedMedia', {
    media: 'screen',
    features: [{ name: 'prefers-color-scheme', value: 'light' }, { name: 'prefers-reduced-motion', value: 'reduce' }],
  });
  // A fresh tab on the dev front can fall into a reload loop: Turbopack answers each chunk
  // subscription with "restart", which reloads the page. The page still needs its HMR socket to
  // hydrate, so the tab keeps the socket and drops only those restart messages.
  await cdp.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `(() => {
      const Native = window.WebSocket;
      const drop = (data) => typeof data === 'string' && data.includes('"type":"restart"');
      class HmrSocket extends Native {
        addEventListener(type, listener, options) {
          if (type !== 'message') return super.addEventListener(type, listener, options);
          return super.addEventListener(type, (event) => { if (!drop(event.data)) listener.call(this, event); }, options);
        }
        set onmessage(listener) { this.addEventListener('message', listener); }
        get onmessage() { return null; }
      }
      window.WebSocket = new Proxy(Native, {
        construct: (target, args) => (String(args[0]).includes('/_next/') ? new HmrSocket(...args) : new target(...args)),
      });
    })()`,
  });
  await setViewport(cdp, HEIGHT);
}

// English UI and the light theme for the shoot; the previous values are put back afterwards.
async function applyLocaleAndTheme(cdp) {
  const { cookies } = await cdp.send('Network.getCookies', { urls: [FRONT] });
  const previousLocale = cookies.find((cookie) => cookie.name === 'opero_locale') ?? null;
  await cdp.send('Network.setCookie', { name: 'opero_locale', value: 'en', url: FRONT, path: '/' });
  await navigate(cdp, `${FRONT}/`);
  const previousTheme = await evaluate(cdp, `localStorage.getItem('opero_theme')`);
  await evaluate(cdp, `localStorage.setItem('opero_theme', 'light'), true`);
  return async () => {
    try {
      if (previousLocale) {
        const { name, value, domain, path: cookiePath, expires, httpOnly, secure, sameSite } = previousLocale;
        await cdp.send('Network.setCookie', {
          name, value, domain, path: cookiePath, httpOnly, secure, sameSite,
          ...(expires > 0 ? { expires } : {}),
        });
      } else {
        await cdp.send('Network.deleteCookies', { name: 'opero_locale', url: FRONT });
      }
      await navigate(cdp, `${FRONT}/`);
      await evaluate(
        cdp,
        previousTheme === null
          ? `localStorage.removeItem('opero_theme'), true`
          : `localStorage.setItem('opero_theme', ${JSON.stringify(previousTheme)}), true`,
      );
    } catch (error) {
      console.warn(`warning: could not restore the locale or theme: ${error.message}`);
    }
  };
}

async function runStep(cdp, step) {
  if (step.waitFor) await waitForSelector(cdp, step.waitFor);
  if (step.click) {
    await waitForSelector(cdp, step.click);
    await evaluate(cdp, `(${FIND_SOURCE})(${JSON.stringify(step.click)}).click(), true`);
  }
  if (step.upload) {
    // Sets a file input's file over CDP, as choosing it in the browser would.
    for (let tries = 0; !(await evaluate(cdp, `!!document.querySelector(${JSON.stringify(step.upload.selector)})`)); tries++) {
      if (tries > 120) throw new Error(`Timed out waiting for ${step.upload.selector}`);
      await sleep(250);
    }
    const { root } = await cdp.send('DOM.getDocument', { depth: 0 });
    const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: step.upload.selector });
    await cdp.send('DOM.setFileInputFiles', { nodeId, files: [path.resolve(siteRoot, step.upload.file)] });
  }
  if (step.eval) await evaluate(cdp, step.eval);
  if (step.sleep) await sleep(step.sleep);
  await waitForQuiet(cdp);
}

async function measureClip(cdp, shot) {
  const clip = shot.clip ?? {};
  const pad = shot.pad ?? 16;
  if (clip.rect) return { ...clip.rect, pad };
  const selectors = clip.selectors ?? [clip.selector ?? 'main'];
  const rect = await evaluate(
    cdp,
    `(() => {
      const find = ${FIND_SOURCE};
      const rects = ${JSON.stringify(selectors)}.map((s) => {
        const el = find(s);
        if (!el) throw new Error('No element for ' + s);
        return el.getBoundingClientRect();
      });
      const left = Math.min(...rects.map((r) => r.left));
      const top = Math.min(...rects.map((r) => r.top));
      const right = Math.max(...rects.map((r) => r.right));
      const bottom = Math.max(...rects.map((r) => r.bottom));
      return { x: left + scrollX, y: top + scrollY, width: right - left, height: bottom - top };
    })()`,
  );
  if (shot.maxHeight) rect.height = Math.min(rect.height, shot.maxHeight);
  return { ...rect, pad };
}

async function shoot(cdp, shot) {
  const url = new URL(shot.url.replaceAll('$ORG', ORG), FRONT).toString();
  const viewportHeight = shot.viewportHeight ?? HEIGHT;
  await setViewport(cdp, viewportHeight);
  await navigate(cdp, url);
  if (shot.waitFor) await waitForSelector(cdp, shot.waitFor);
  await waitForQuiet(cdp);
  for (const step of shot.steps ?? []) await runStep(cdp, step);
  const hidden = [...(shot.hide ?? []), 'nextjs-portal', '[data-sonner-toaster]'];
  await evaluate(
    cdp,
    `(() => { for (const s of ${JSON.stringify(hidden)}) for (const el of document.querySelectorAll(s)) el.style.visibility = 'hidden'; return true; })()`,
  );
  await evaluate(cdp, `document.activeElement?.blur?.(), true`);
  await sleep(200);

  const { x, y, width, height, pad } = await measureClip(cdp, shot);
  const left = Math.max(0, x - pad);
  const top = Math.max(shot.minY ?? 0, y - pad);
  const clipWidth = Math.min(WIDTH - left, width + pad * 2);
  const clipHeight = y + height + pad - top;
  const scale = Math.min(1, MAX_OUTPUT_WIDTH / (clipWidth * DPR));
  const { data } = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: { x: left, y: top, width: clipWidth, height: clipHeight, scale },
  });

  const target = path.join(assetsRoot, shot.file);
  if (path.extname(target) !== '.webp') throw new Error(`${shot.file}: shots are WebP files`);
  const png = target.replace(/\.webp$/, '.png');
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(png, Buffer.from(data, 'base64'));
  // get-low cannot combine -to with -w: it writes the sibling .webp and keeps the PNG.
  rmSync(target, { force: true });
  execFileSync(getLow, ['-to', 'webp', png], { stdio: ['ignore', 'pipe', 'inherit'] });
  if (!existsSync(target)) throw new Error(`get-low did not write ${target}`);
  if (!process.argv.includes('--keep-png')) rmSync(png);
  const out = Math.round(clipWidth * DPR * scale);
  console.log(`  wrote ${path.relative(siteRoot, target)} (${out} px wide)`);
}

async function dump(cdp, url) {
  await navigate(cdp, new URL(url.replaceAll('$ORG', ORG), FRONT).toString());
  await waitForQuiet(cdp);
  const rows = await evaluate(
    cdp,
    `[...document.querySelectorAll('main, header, nav, aside, section, h1, h2, h3, [role=tablist], [role=dialog], [data-slot], [data-testid]')]
      .map((el) => { const r = el.getBoundingClientRect(); return { el, r }; })
      .filter(({ r }) => r.width > 0 && r.height > 0)
      .map(({ el, r }) => [el.tagName.toLowerCase(),
        el.getAttribute('data-slot') ? '[data-slot=' + el.getAttribute('data-slot') + ']' : '',
        el.getAttribute('data-testid') ? '[data-testid=' + el.getAttribute('data-testid') + ']' : '',
        el.getAttribute('role') ? '[role=' + el.getAttribute('role') + ']' : '',
        Math.round(r.left), Math.round(r.top + scrollY), Math.round(r.width), Math.round(r.height),
        (el.textContent ?? '').trim().replace(/\\s+/g, ' ').slice(0, 60)].join(' '))`,
  );
  console.log(rows.join('\n'));
}

async function openTarget() {
  const response = await fetch(`${CDP_URL}/json/new?about:blank`, { method: 'PUT' }).catch(() => null);
  if (!response?.ok) {
    throw new Error(
      `No capture browser on ${CDP_URL}. Start it with:\n  google-chrome --user-data-dir=<scratch profile> --remote-debugging-port=9333 ${FRONT}`,
    );
  }
  return response.json();
}

async function main() {
  const args = process.argv.slice(2).filter((arg) => arg !== '--keep-png');
  const target = await openTarget();
  const cdp = await Cdp.connect(target.webSocketDebuggerUrl);
  let restore = async () => {};
  try {
    await prepareTab(cdp);
    restore = await applyLocaleAndTheme(cdp);
    if (args[0] === '--dump') {
      await dump(cdp, args[1] ?? '/');
      return;
    }
    const shots = JSON.parse(readFileSync(path.join(here, 'shots.json'), 'utf8')).shots;
    const selected = args.length ? shots.filter((shot) => args.includes(shot.file)) : shots;
    if (args.length && selected.length !== args.length) throw new Error(`Unknown shot in: ${args.join(', ')}`);
    for (const shot of selected) {
      console.log(shot.file);
      await shoot(cdp, shot);
    }
  } finally {
    await restore();
    cdp.close();
    // Close only the tab this script opened.
    await fetch(`${CDP_URL}/json/close/${target.id}`, { method: 'PUT' }).catch(() => {});
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
