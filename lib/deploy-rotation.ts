/**
 * Picks that change with every deployment and never within one.
 *
 * `DEPLOY_SEED` is written into the bundle by next.config.ts, so the build, a
 * page regenerated a week later and every server instance all read the same
 * value. A pick is a pure function of that seed and a key: the HTML for a URL
 * stays identical for the whole life of a deployment, and the next deployment
 * deals the cards again. Never use Math.random or the clock for this - a page
 * revalidated by the CMS webhook would then come back with different content.
 */
const seed = process.env.DEPLOY_SEED ?? "local";

/** FNV-1a, 32 bit: small, fast and evenly spread, which is all a rotation needs. */
function hash(value: string) {
  let result = 0x811c9dc5;

  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 0x01000193);
  }

  return result >>> 0;
}

/** Position in a list of `length` for `key`, fixed for this deployment. */
export function deployIndex(key: string, length: number) {
  return length > 0 ? hash(`${seed}:${key}`) % length : 0;
}

export function deployPick<T>(items: readonly T[], key: string): T | undefined {
  return items[deployIndex(key, items.length)];
}

/** `count` neighbours starting at the deployment's position, wrapping round, so none repeats. */
export function deployPickMany<T>(items: readonly T[], key: string, count: number): T[] {
  const start = deployIndex(key, items.length);

  return Array.from({ length: Math.min(count, items.length) }, (_, offset) => items[(start + offset) % items.length]);
}
