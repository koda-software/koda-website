"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { ConsentCategory, ConsentContent } from "@/content/types";
import { ConsentSwitch } from "./ConsentPreferences";

type ConsentBannerProps = {
  categories: ConsentCategory[];
  content: ConsentContent;
  privacyHref: string;
  selected: Record<ConsentCategory, boolean>;
  onSelect: (next: Record<ConsentCategory, boolean>) => void;
  onDecide: (categories: Record<ConsentCategory, boolean>) => void;
  onCustomise: () => void;
  all: (value: boolean) => Record<ConsentCategory, boolean>;
};

/**
 * The first layer: a centred modal over a dimmed page, with a switch per
 * category so a partial choice takes one click, and "accept all" as the
 * primary action. Escape does nothing, since closing it would decide nothing.
 */
export function ConsentBanner({ categories, content, privacyHref, selected, onSelect, onDecide, onCustomise, all }: ConsentBannerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    // showModal focuses the first link; start on the dialog so nothing looks pre-selected.
    dialog.focus();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="consent-title"
      aria-describedby="consent-description"
      className="consent-dialog consent-enter m-auto max-h-[calc(100dvh-2rem)] w-[min(52rem,calc(100vw-2rem))] overflow-y-auto rounded-[var(--radius-panel)] border-0 bg-[var(--color-paper)] p-0 text-[var(--color-ink)] shadow-[0_30px_70px_-30px_rgba(11,17,22,0.5)] max-[640px]:mb-0 max-[640px]:max-h-[92dvh] max-[640px]:w-full max-[640px]:max-w-none max-[640px]:rounded-b-none"
      tabIndex={-1}
      onCancel={(event) => event.preventDefault()}
    >
      <div className="grid gap-3 px-10 pb-7 pt-9 max-[640px]:px-5 max-[640px]:pb-5 max-[640px]:pt-6">
        <h2 id="consent-title" className="m-0 font-[family-name:var(--font-sans-brand)] text-[1.5rem] font-semibold leading-[1.25] tracking-[-0.02em] max-[640px]:text-[1.25rem]">
          {content.title}
        </h2>
        <p id="consent-description" className="m-0 text-[0.98rem] leading-[1.6] text-[var(--color-muted)] max-[640px]:text-[0.92rem]">
          {content.description}{" "}
          <Link className="font-medium text-[var(--color-blue)] underline underline-offset-4 hover:text-[var(--color-blue-deep)]" href={privacyHref}>
            {content.privacyLinkLabel}
          </Link>
        </p>
      </div>

      <div
        className="grid grid-cols-[repeat(var(--consent-columns),minmax(0,1fr))] border-y border-[var(--color-border-light)] max-[640px]:grid-cols-1"
        style={{ "--consent-columns": categories.length + 1 } as React.CSSProperties}
      >
        <Category label={content.categories.necessary.label} labelId="consent-banner-necessary">
          <ConsentSwitch checked disabled labelledBy="consent-banner-necessary" />
        </Category>
        {categories.map((category) => (
          <Category key={category} label={content.categories[category].label} labelId={`consent-banner-${category}`}>
            <ConsentSwitch
              checked={selected[category]}
              labelledBy={`consent-banner-${category}`}
              onToggle={() => onSelect({ ...selected, [category]: !selected[category] })}
            />
          </Category>
        ))}
      </div>

      <div className="grid gap-4 px-10 pb-8 pt-7 max-[640px]:px-5 max-[640px]:pb-[max(1.25rem,env(safe-area-inset-bottom))] max-[640px]:pt-5">
        <div className="grid grid-cols-3 gap-3 max-[640px]:grid-cols-2">
          <button className="action action-line w-full px-4 max-[640px]:order-2" type="button" onClick={() => onDecide(all(false))}>
            {content.rejectLabel}
          </button>
          <button className="action action-line w-full px-4 max-[640px]:order-3" type="button" onClick={() => onDecide(selected)}>
            {content.preferences.saveLabel}
          </button>
          <button className="action action-ink w-full px-4 max-[640px]:order-1 max-[640px]:col-span-2" type="button" onClick={() => onDecide(all(true))}>
            {content.acceptLabel}
          </button>
        </div>
        <button
          className="min-h-11 cursor-pointer self-center justify-self-center border-0 bg-transparent px-2 text-[0.88rem] font-medium text-[var(--color-ink)] underline decoration-[var(--color-muted-light)] underline-offset-4 hover:decoration-[var(--color-ink)]"
          type="button"
          onClick={onCustomise}
        >
          {content.customiseLabel}
        </button>
      </div>
    </dialog>
  );
}

function Category({ label, labelId, children }: { label: string; labelId: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-5 [&+&]:border-l [&+&]:border-[var(--color-border-light)] max-[640px]:flex-row max-[640px]:justify-between max-[640px]:px-5 max-[640px]:py-3 max-[640px]:[&+&]:border-l-0 max-[640px]:[&+&]:border-t">
      <span id={labelId} className="text-[0.94rem] font-semibold">
        {label}
      </span>
      {children}
    </div>
  );
}
