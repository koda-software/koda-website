"use client";

import { useEffect, useState } from "react";
import type { TiptapHeading } from "@/lib/blog/tiptap";

/**
 * The article's sections as links, with the one being read marked. The list is
 * in the server HTML as plain anchors; this only adds the marker, by watching
 * which heading last crossed the top third of the window.
 */
export function ArticleToc({ headings, label }: { headings: TiptapHeading[]; label: string }) {
  const [active, setActive] = useState(headings[0]?.id ?? "");

  useEffect(() => {
    const targets = headings.map((heading) => document.getElementById(heading.id)).filter((node): node is HTMLElement => node !== null);

    if (targets.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const passed = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target.id);
        if (passed.length > 0) setActive(passed[passed.length - 1]);
      },
      { rootMargin: "-96px 0px -66% 0px" },
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav aria-label={label}>
      <p className="m-0 mb-3.5 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">{label}</p>
      <ol className="m-0 list-none border-l border-[rgba(11,17,22,0.14)] p-0 text-[0.9rem] leading-[1.4]">
        {headings.map((heading) => {
          const current = heading.id === active;

          return (
            <li key={heading.id}>
              <a
                aria-current={current ? "location" : undefined}
                className={`-ml-px block border-l-2 py-[7px] pl-3.5 transition-colors ${
                  current
                    ? "border-[var(--color-ink)] font-semibold text-[var(--color-ink)]"
                    : "border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]"
                }`}
                href={`#${heading.id}`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
