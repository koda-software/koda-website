"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { consentServices } from "@/content/consent-services";
import type { ConsentCategory, ConsentContent } from "@/content/types";

type ConsentPreferencesProps = {
  categories: ConsentCategory[];
  content: ConsentContent;
  initial: Record<ConsentCategory, boolean>;
  locale: "pl" | "en";
  privacyHref: string;
  onClose: () => void;
  onDecide: (categories: Record<ConsentCategory, boolean>) => void;
  all: (value: boolean) => Record<ConsentCategory, boolean>;
};

/**
 * The second layer. A native modal <dialog>: it traps focus, Escape closes it
 * without saving, and focus returns to whatever opened it. Every switch starts
 * from the saved choice, which for a first visit means everything off.
 */
export function ConsentPreferences({ categories, content, initial, locale, privacyHref, onClose, onDecide, all }: ConsentPreferencesProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState(initial);
  const t = content.preferences;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="consent-preferences-title"
      className="consent-dialog consent-enter m-auto max-h-[min(46rem,calc(100dvh-2rem))] w-[min(37.5rem,calc(100vw-2rem))] overflow-y-auto rounded-[var(--radius-panel)] border-0 bg-[var(--color-paper)] p-8 text-[var(--color-ink)] shadow-[0_30px_70px_-30px_rgba(11,17,22,0.5)] max-[640px]:mb-0 max-[640px]:max-h-[90dvh] max-[640px]:w-full max-[640px]:max-w-none max-[640px]:rounded-b-none max-[640px]:px-4 max-[640px]:pb-[max(1rem,env(safe-area-inset-bottom))] max-[640px]:pt-5"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="grid gap-2">
          <h2 id="consent-preferences-title" className="m-0 font-[family-name:var(--font-sans-brand)] text-[1.5rem] font-semibold leading-[1.25] tracking-[-0.02em] max-[640px]:text-[1.375rem]">
            {t.title}
          </h2>
          <p className="m-0 text-[0.94rem] leading-[1.55] text-[var(--color-muted)]">{t.description}</p>
        </div>
        <button
          aria-label={t.closeLabel}
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-button)] border-0 bg-[var(--color-mist)] text-[var(--color-ink)] hover:bg-[var(--color-border-light)]"
          type="button"
          onClick={onClose}
        >
          <svg aria-hidden="true" fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24" width="18">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>

      <div className="mt-6 border-b border-[var(--color-border-light)]">
        <Row label={content.categories.necessary.label} description={content.categories.necessary.description}>
          <span className="pt-0.5 text-[0.82rem] font-medium text-[var(--color-muted)]">{t.alwaysOnLabel}</span>
        </Row>

        {categories.map((category) => {
          const services = consentServices.filter((service) => service.category === category);
          const copy = content.categories[category];
          return (
            <Row key={category} label={copy.label} description={copy.description} switchId={`consent-${category}`}>
              <button
                aria-checked={selected[category]}
                aria-labelledby={`consent-${category}`}
                className={`flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-0 p-[3px] transition-colors ${selected[category] ? "justify-end bg-[var(--color-ink)]" : "justify-start bg-[var(--color-muted-light)]"}`}
                role="switch"
                type="button"
                onClick={() => setSelected((current) => ({ ...current, [category]: !current[category] }))}
              >
                <span className="block size-[22px] rounded-full bg-white" />
              </button>
              <details className="col-span-2 mt-1 text-[0.86rem]">
                <summary className="cursor-pointer font-medium text-[var(--color-blue)]">
                  {t.detailsLabel} ({services.length})
                </summary>
                <div className="mt-3 grid gap-3">
                  {services.map((service) => (
                    <dl key={service.id} className="m-0 grid grid-cols-[7.5rem_minmax(0,1fr)] gap-x-4 gap-y-1.5 rounded-[var(--radius-card)] bg-[var(--color-mist)] p-4 leading-[1.45] max-[480px]:grid-cols-1">
                      <dt className="col-span-full font-semibold text-[var(--color-ink)]">{service.name}</dt>
                      <dd className="col-span-full m-0 mb-1 text-[var(--color-muted)]">{service.purpose[locale]}</dd>
                      <dt className="text-[var(--color-muted)]">{t.fields.vendor}</dt>
                      <dd className="m-0">{service.vendor}</dd>
                      <dt className="text-[var(--color-muted)]">{t.fields.cookies}</dt>
                      <dd className="m-0">
                        {service.cookies.length
                          ? service.cookies.map((cookie) => `${cookie.name} (${cookie.lifetime[locale]})`).join(", ")
                          : t.noCookiesLabel}
                      </dd>
                      <dt className="text-[var(--color-muted)]">{t.fields.transfer}</dt>
                      <dd className="m-0">{service.transfer[locale]}</dd>
                    </dl>
                  ))}
                </div>
              </details>
            </Row>
          );
        })}
      </div>

      {/* All three carry the same weight; none is pre-selected or highlighted. */}
      <div className="mt-6 grid grid-cols-3 gap-2 max-[640px]:grid-cols-2">
        <button className={`${choiceButton} max-[640px]:order-2`} type="button" onClick={() => onDecide(all(false))}>
          {t.rejectAllLabel}
        </button>
        <button className={`${choiceButton} max-[640px]:order-1 max-[640px]:col-span-2`} type="button" onClick={() => onDecide(selected)}>
          {t.saveLabel}
        </button>
        <button className={`${choiceButton} max-[640px]:order-3`} type="button" onClick={() => onDecide(all(true))}>
          {t.acceptAllLabel}
        </button>
      </div>

      <p className="mb-0 mt-4 text-[0.82rem] text-[var(--color-muted)]">
        <Link className="text-[var(--color-blue)] underline underline-offset-4" href={privacyHref} onClick={onClose}>
          {t.policyNote}
        </Link>
      </p>
    </dialog>
  );
}

const choiceButton =
  "min-h-11 cursor-pointer rounded-[var(--radius-button)] border border-[var(--color-ink)] bg-[var(--color-paper)] px-3 text-[0.88rem] font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-mist)] max-[640px]:min-h-12";

function Row({
  label,
  description,
  switchId,
  children,
}: {
  label: string;
  description: string;
  switchId?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-2 border-t border-[var(--color-border-light)] py-4">
      <div className="grid gap-1">
        <span id={switchId} className="text-[0.94rem] font-semibold">
          {label}
        </span>
        <span className="text-[0.88rem] leading-[1.5] text-[var(--color-muted)]">{description}</span>
      </div>
      {children}
    </div>
  );
}
