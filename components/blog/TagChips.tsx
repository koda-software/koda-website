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
    <section className="mt-12 border-t border-[rgba(2,2,13,0.12)] pt-6">
      <h2 className={blogMetaClass}>{ui.labels.tags}</h2>
      <ul className="mt-4 flex list-none flex-wrap gap-2 p-0">
        {tags.map((tag) => (
          <li key={tag.slug}>
            <Link
              className="inline-flex min-h-9 items-center rounded-[var(--radius-button)] border border-[rgba(2,2,13,0.12)] px-3 text-[0.88rem] text-[var(--color-ink-soft)] transition-colors hover:border-[rgba(0,103,244,0.24)] hover:text-[var(--color-blue)]"
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
