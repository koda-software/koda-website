import { loadEnvConfig } from '@next/env';
import { generate } from './lib/generate.mjs';
loadEnvConfig(process.cwd());
generate(process.cwd(), {
  refresh: process.argv.includes('--refresh-snapshot'),
  accept: process.argv.includes('--accept-snapshot'),
}).catch((error: unknown) => { console.error(error); process.exitCode = 1; });
