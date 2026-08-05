import Link from "next/link";
import type { BlogUiContent } from "@/content/types";

type PaginationProps = {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
  ui: BlogUiContent;
};

const baseLinkClass =
  "inline-flex h-11 min-w-11 items-center justify-center rounded-[var(--radius-button)] border px-3.5 text-[0.92rem] font-medium transition-colors";
const idleClass = `${baseLinkClass} border-[rgba(2,2,13,0.12)] bg-white text-[var(--color-ink)] hover:border-[rgba(0,103,244,0.24)] hover:text-[var(--color-blue)]`;
const currentClass = `${baseLinkClass} border-transparent bg-[var(--color-ink)] text-white`;
const disabledClass = `${baseLinkClass} border-[rgba(2,2,13,0.08)] bg-white text-[var(--color-muted-light)]`;

/** Windowed page numbers around the current page, with the ends always shown. */
function pageWindow(page: number, totalPages: number): Array<number | "gap"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  const sorted = [...pages].filter((value) => value >= 1 && value <= totalPages).sort((a, b) => a - b);
  const result: Array<number | "gap"> = [];

  sorted.forEach((value, index) => {
    if (index > 0 && value - sorted[index - 1] > 1) result.push("gap");
    result.push(value);
  });

  return result;
}

export function Pagination({ page, totalPages, buildHref, ui }: PaginationProps) {
  if (totalPages <= 1) return null;

  const items = pageWindow(page, totalPages);

  return (
    <nav className="mt-12 flex flex-wrap items-center gap-2 border-t border-[rgba(2,2,13,0.12)] pt-8" aria-label={ui.labels.pagination}>
      {page > 1 ? (
        <Link className={idleClass} href={buildHref(page - 1)} rel="prev">
          {ui.labels.previous}
        </Link>
      ) : (
        <span className={disabledClass} aria-hidden="true">
          {ui.labels.previous}
        </span>
      )}

      {items.map((item, index) =>
        item === "gap" ? (
          <span className="px-1 text-[var(--color-muted-light)]" key={`gap-${index}`} aria-hidden="true">
            …
          </span>
        ) : item === page ? (
          <span className={currentClass} key={item} aria-current="page" aria-label={`${ui.labels.page} ${item}`}>
            {item}
          </span>
        ) : (
          <Link className={idleClass} href={buildHref(item)} key={item} aria-label={`${ui.labels.page} ${item}`}>
            {item}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link className={idleClass} href={buildHref(page + 1)} rel="next">
          {ui.labels.next}
        </Link>
      ) : (
        <span className={disabledClass} aria-hidden="true">
          {ui.labels.next}
        </span>
      )}
    </nav>
  );
}
