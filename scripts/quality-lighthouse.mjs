import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import http from "node:http";
import net from "node:net";
import path from "node:path";
import lighthouse, { generateReport } from "lighthouse";

const root = process.cwd();
const url = process.env.LIGHTHOUSE_URL || "http://localhost:3004";
const outputPath = process.env.LIGHTHOUSE_OUTPUT || path.join(root, ".next/lighthouse-mobile.json");
const minScore = Number(process.env.LIGHTHOUSE_MIN_SCORE || 0.9);
const profileDir = path.join("/tmp", `opero-lighthouse-${process.pid}`);

function findLocalChrome() {
  if (process.env.CHROME_PATH) {
    return process.env.CHROME_PATH;
  }

  const chromeRoot = path.join(root, ".cache/browsers/chrome");
  if (!existsSync(chromeRoot)) {
    return null;
  }

  const versions = readdirSync(chromeRoot)
    .filter((entry) => entry.startsWith("linux-"))
    .sort()
    .reverse();

  for (const version of versions) {
    const candidate = path.join(chromeRoot, version, "chrome-linux64/chrome");
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => resolve(address.port));
    });
    server.on("error", reject);
  });
}

function waitForChrome(port) {
  const deadline = Date.now() + 15_000;

  return new Promise((resolve, reject) => {
    const probe = () => {
      const request = http.get(`http://127.0.0.1:${port}/json/version`, (response) => {
        response.resume();
        if (response.statusCode === 200) {
          resolve();
          return;
        }
        retry();
      });

      request.on("error", retry);
      request.setTimeout(1_000, () => {
        request.destroy();
        retry();
      });
    };

    const retry = () => {
      if (Date.now() > deadline) {
        reject(new Error(`Chrome did not expose DevTools on port ${port}.`));
        return;
      }
      setTimeout(probe, 250);
    };

    probe();
  });
}

function scorePercent(score) {
  return Math.round((score ?? 0) * 100);
}

const chromePath = findLocalChrome();
if (!chromePath) {
  throw new Error(
    "Chrome for Lighthouse was not found. Install it with: node_modules/.bin/browsers install chrome@stable --path .cache/browsers --platform linux",
  );
}

const port = await getFreePort();
mkdirSync(profileDir, { recursive: true });

const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    `--remote-debugging-port=${port}`,
    "--remote-debugging-address=127.0.0.1",
    `--user-data-dir=${profileDir}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);

try {
  await waitForChrome(port);

  const result = await lighthouse(url, {
    port,
    hostname: "127.0.0.1",
    formFactor: "mobile",
    screenEmulation: {
      mobile: true,
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      disabled: false,
    },
    throttlingMethod: "simulate",
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
  });

  if (!result) {
    throw new Error("Lighthouse did not return a result.");
  }

  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, generateReport(result.lhr, "json"));

  const scores = Object.fromEntries(
    Object.entries(result.lhr.categories).map(([key, category]) => [key, scorePercent(category.score)]),
  );

  const metrics = {
    fcp: result.lhr.audits["first-contentful-paint"]?.displayValue,
    lcp: result.lhr.audits["largest-contentful-paint"]?.displayValue,
    tbt: result.lhr.audits["total-blocking-time"]?.displayValue,
    cls: result.lhr.audits["cumulative-layout-shift"]?.displayValue,
    speedIndex: result.lhr.audits["speed-index"]?.displayValue,
  };

  console.log(JSON.stringify({ url: result.lhr.finalDisplayedUrl, scores, metrics, outputPath }, null, 2));

  const failed = Object.entries(result.lhr.categories).filter(([, category]) => (category.score ?? 0) < minScore);
  if (failed.length > 0) {
    const details = failed.map(([key, category]) => `${key}: ${scorePercent(category.score)}`).join(", ");
    throw new Error(`Lighthouse score below ${scorePercent(minScore)}: ${details}`);
  }
} finally {
  chrome.kill("SIGTERM");
  rmSync(profileDir, { recursive: true, force: true });
}
