import Link from "next/link";
import type { BlogUiContent } from "@/content/types";
import { tagPath } from "@/lib/blog/routes";
import type { BlogLocale } from "@/lib/blog/types";
import { blogMetaClass } from "./primitives";

type TagChipsProps = {
  tags: Array<{ slug: string; nazwa: string }>;
  locale: BlogLocale;
  ui: BlogUiContent;
};

export function TagChips({ tags, locale, ui }: TagChipsProps) {
  if (tags.length === 0) return null;

  return (
    <section className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[rgba(2,2,13,0.12)] pt-5">
      <h2 className={`${blogMetaClass} shrink-0`}>{ui.labels.tags}</h2>
      <ul className="flex list-none flex-wrap gap-1.5 p-0">
        {tags.map((tag) => (
          <li key={tag.slug}>
            <Link
              className="inline-flex items-center rounded-[var(--radius-button)] border border-[rgba(2,2,13,0.12)] px-2.5 py-1 text-[0.82rem] text-[var(--color-ink-soft)] transition-colors hover:border-[rgba(56, 182, 255,0.24)] hover:text-[var(--color-blue)]"
              href={tagPath(locale, tag.slug)}
            >
              {tag.nazwa}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
