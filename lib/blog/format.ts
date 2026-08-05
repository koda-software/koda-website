import type { BlogLocale } from "./types";

const dateLocale: Record<BlogLocale, string> = {
  pl: "pl-PL",
  en: "en-GB",
};

/** Long-form publication date, e.g. "4 August 2026" / "4 sierpnia 2026". */
export function formatDate(iso: string | null | undefined, locale: BlogLocale): string {
  if (!iso) return "";

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(dateLocale[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

const oneDayMs = 24 * 60 * 60 * 1000;

/** Only surface an "updated" line when the edit is meaningfully later. */
export function shouldShowUpdated(published: string | null, updated: string | null): boolean {
  if (!published || !updated) return false;

  const publishedAt = new Date(published).getTime();
  const updatedAt = new Date(updated).getTime();

  if (Number.isNaN(publishedAt) || Number.isNaN(updatedAt)) return false;

  return updatedAt - publishedAt > oneDayMs;
}

/** Fills `{name}`-style placeholders in localized copy templates. */
export function fillTemplate(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = values[key];
    return value === undefined ? match : String(value);
  });
}
