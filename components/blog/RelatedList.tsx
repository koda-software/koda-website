import Link from "next/link";
import type { BlogUiContent } from "@/content/types";
import { articlePath } from "@/lib/blog/routes";
import type { BlogLocale } from "@/lib/blog/types";
import { blogMetaClass } from "./primitives";

type RelatedListProps = {
  items: Array<{ slug: string; tytul: string; zajawka: string | null }>;
  locale: BlogLocale;
  ui: BlogUiContent;
};

export function RelatedList({ items, locale, ui }: RelatedListProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className={blogMetaClass}>{ui.labels.related}</h2>
      <ul className="mt-5 grid list-none gap-0 p-0">
        {items.map((item) => (
          <li className="border-t border-[rgba(2,2,13,0.12)] py-5 last:border-b last:border-[rgba(2,2,13,0.12)]" key={item.slug}>
            <Link className="group block" href={articlePath(locale, item.slug)}>
              <span className="block text-[1.12rem] font-medium leading-[1.35] text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-blue)]">
                {item.tytul}
              </span>
              {item.zajawka ? (
                <span className="mt-2 block text-[0.96rem] font-light leading-[1.6] text-[var(--color-muted)]">{item.zajawka}</span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
