"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import SearchIcon from "lucide-react/dist/esm/icons/search.mjs";
import { foldText } from "@/lib/fold-text";

type Entry = { title: string; lead: string; category: string; href: string };
/** `haystack` is folded once when the index loads, not on every key press. */
type IndexedEntry = Entry & { haystack: string };

type BlogSearchProps = {
  /** The static index for this language, e.g. `/api/blog/search/en`. */
  endpoint: string;
  labels: { label: string; placeholder: string; empty: string; unavailable: string };
};

const maxResults = 8;

/**
 * Filters the blog's titles and standfirsts in the browser. The index is one
 * small static file, loaded on first focus, so the pages stay static and the
 * box costs nothing until someone uses it. Every word typed has to match.
 */
export function BlogSearch({ endpoint, labels }: BlogSearchProps) {
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<IndexedEntry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(false);
  const requested = useRef(false);
  const listId = useId();

  const load = () => {
    if (requested.current) return;
    requested.current = true;

    fetch(endpoint)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((data: Entry[]) => setEntries(data.map((entry) => ({ ...entry, haystack: foldText(`${entry.title} ${entry.lead} ${entry.category}`) }))))
      .catch(() => {
        requested.current = false;
        setFailed(true);
      });
  };

  const words = foldText(query).split(/\s+/).filter(Boolean);
  const results =
    entries && words.length > 0
      ? entries
          .filter((entry) => words.every((word) => entry.haystack.includes(word)))
          .slice(0, maxResults)
      : [];
  const showPanel = open && words.length > 0 && (entries !== null || failed);

  return (
    <search
      className="relative my-2.5 w-full max-w-[17.5rem] flex-[1_1_13.75rem] max-[809px]:max-w-none"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <label className="flex h-10 items-center gap-2.5 rounded-full bg-[var(--color-mist)] px-3.5 text-[var(--color-muted)] shadow-[inset_0_0_0_1px_rgba(11,17,22,0.12)] focus-within:shadow-[inset_0_0_0_1px_rgba(11,17,22,0.5)]">
        <SearchIcon aria-hidden="true" className="h-4 w-4 shrink-0" strokeWidth={2} />
        <span className="sr-only">{labels.label}</span>
        <input
          aria-controls={listId}
          autoComplete="off"
          className="min-w-0 flex-1 border-0 bg-transparent text-[0.92rem] text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)]"
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            load();
            setOpen(true);
          }}
          placeholder={labels.placeholder}
          type="search"
          value={query}
        />
      </label>

      <div
        aria-live="polite"
        className="absolute right-0 top-[calc(100%+0.5rem)] z-30 w-[min(26rem,calc(100vw-2rem))] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border-light)] bg-[var(--color-paper)] shadow-[0_24px_60px_-24px_rgba(11,17,22,0.35)] max-[809px]:left-0 max-[809px]:w-full"
        hidden={!showPanel}
        id={listId}
      >
        {results.length > 0 ? (
          <ul className="m-0 list-none p-2">
            {results.map((entry) => (
              <li key={entry.href}>
                <Link className="block rounded-[10px] px-3 py-2.5 transition-colors hover:bg-[var(--color-mist)]" href={entry.href}>
                  {entry.category ? (
                    <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-blue)]">{entry.category}</span>
                  ) : null}
                  <span className="mt-0.5 block font-display text-[0.98rem] font-medium leading-[1.35] text-[var(--color-ink)]">{entry.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="m-0 px-5 py-4 text-[0.92rem] text-[var(--color-muted)]">{failed ? labels.unavailable : labels.empty}</p>
        )}
      </div>
    </search>
  );
}
