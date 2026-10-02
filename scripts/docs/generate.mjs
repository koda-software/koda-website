// prebuild: verifies the committed docs snapshot, or stages/validates live API generation,
// then checks the internal links.
// On Vercel and CI a failure fails the build. Snapshot builds and local live builds without OPERO_DOCS_API_KEY verify committed content,
// so building the website does not require a docs token in those modes.
import { spawnSync } from "node:child_process";
import path from "node:path";
import nextEnv from "@next/env";

nextEnv.loadEnvConfig(process.cwd());

const bin = (name) => path.join("node_modules", ".bin", name);

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

// The orchestrator owns snapshot/live mode and the local no-key fallback (9.3a).
run(bin("tsx"), ["scripts/docs/generate-validated.ts"]);
run(bin("fumadocs-mdx"), []);

run(process.execPath, ["scripts/docs/check-links.mjs"]);
