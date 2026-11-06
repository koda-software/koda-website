/**
 * Polish typography: a one-letter word (a, i, o, u, w, z) never ends a line.
 * The scene generator in KodaSoft-Marketing does the same with `sieroty()`;
 * here every string in the page's copy goes through it once, at definition,
 * so no component has to remember.
 */
export function polish<T>(value: T): T {
  if (typeof value === "string") {
    return value.replace(/(^|[\s\u00a0])([aiouwzAIOUWZ]) /g, "$1$2\u00a0") as T;
  }
  if (Array.isArray(value)) return value.map(polish) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, polish(entry)])) as T;
  }
  return value;
}
