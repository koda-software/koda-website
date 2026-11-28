"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { AmountInWordsLabels } from "@/content/types";
import {
  currencyCodes,
  minorStyles,
  parseAmount,
  toEnglishWords,
  toPolishWords,
  type CurrencyCode,
  type WordOptions,
} from "@/lib/tools/amount-in-words";
import { PrivacyNote } from "@/components/tools/PrivacyNote";
import { CopyButton } from "@/components/tools/CopyButton";

type Gtag = (command: "event", name: string, params: Record<string, string>) => void;

/** Counts use of the tool and nothing else: never the amount or the result. */
function trackToolEvent(name: string) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", name, { tool: "amount_in_words" });
}

const pillBase =
  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full border px-4 font-display text-[0.95rem] font-medium transition-colors duration-200";
const pillOn = "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-mist)]";
const pillOff = "border-[var(--color-border-light)] bg-[var(--color-paper)] text-[var(--color-ink)] hover:border-[rgba(11,17,22,0.32)]";

export function AmountInWords({ labels }: { labels: AmountInWordsLabels }) {
  const amountId = useId();
  const [amount, setAmount] = useState(labels.defaultAmount);
  const [currency, setCurrency] = useState<CurrencyCode>("PLN");
  const [options, setOptions] = useState<WordOptions>({ sayOne: false, capitalize: false, minor: "words" });
  const [copied, setCopied] = useState<string | null>(null);
  const copiedTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(copiedTimer.current), []);

  const parsed = parseAmount(amount);
  const results =
    parsed.kind === "ok"
      ? [
          { key: "pl", heading: labels.resultHeadings.pl, text: toPolishWords(parsed, currency, options) },
          ...(labels.resultHeadings.en
            ? [{ key: "en", heading: labels.resultHeadings.en, text: toEnglishWords(parsed, currency, options) }]
            : []),
        ]
      : [];

  const update = (patch: Partial<WordOptions>) => {
    setOptions((current) => ({ ...current, ...patch }));
    setCopied(null);
  };

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setCopied(null), 1800);
      trackToolEvent("tool_copy");
    } catch {
      /* Clipboard refused (permissions, insecure context): select the result so Ctrl+C copies it. */
      const node = document.getElementById(`${amountId}-${key}`);
      const selection = window.getSelection();
      if (node && selection) {
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end gap-4">
        <div className="grid min-w-0 flex-[1_1_26rem] gap-2">
          <label className="text-[0.95rem] font-semibold text-[var(--color-ink)]" htmlFor={amountId}>
            {labels.amountLabel}
          </label>
          <input
            autoComplete="off"
            className="h-[84px] w-full rounded-[14px] border border-[rgba(11,17,22,0.16)] bg-[var(--color-paper)] px-6 font-display text-[2.6rem] font-medium tracking-[-0.02em] text-[var(--color-ink)] placeholder:text-[#8a9096] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--color-blue)] max-[720px]:text-[2rem]"
            id={amountId}
            inputMode="decimal"
            maxLength={64}
            onChange={(event) => {
              setAmount(event.target.value);
              setCopied(null);
            }}
            placeholder={labels.placeholder}
            spellCheck={false}
            type="text"
            value={amount}
          />
        </div>
        <fieldset className="m-0 min-w-0 border-0 p-0">
          <legend className="mb-2 p-0 text-[0.95rem] font-semibold text-[var(--color-ink)]">{labels.currencyLegend}</legend>
          <div className="flex flex-wrap gap-1.5">
            {currencyCodes.map((code) => (
              <button
                aria-pressed={code === currency}
                className={`${pillBase} h-[52px] min-w-16 ${code === currency ? pillOn : pillOff}`}
                key={code}
                onClick={() => {
                  setCurrency(code);
                  setCopied(null);
                }}
                type="button"
              >
                {code}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[0.92rem] text-[var(--color-muted)]">
        <span>{labels.examplesLabel}</span>
        {labels.examples.map((example) => (
          <button
            className="min-h-9 cursor-pointer rounded-full border border-[rgba(11,17,22,0.14)] bg-transparent px-3 text-[var(--color-ink)] transition-colors hover:border-[rgba(11,17,22,0.32)]"
            key={example}
            onClick={() => {
              setAmount(example);
              setCopied(null);
            }}
            type="button"
          >
            {example}
          </button>
        ))}
      </div>

      <div aria-live="polite" className="mt-5 grid gap-7 border-t border-[var(--color-border-light)] pt-7">
        {parsed.kind === "ok" ? (
          <>
            {results.map((result) => (
              <div className="grid gap-4" key={result.key}>
                {results.length > 1 ? (
                  <p className="m-0 text-[0.95rem] font-semibold text-[var(--color-ink)]">{result.heading}</p>
                ) : null}
                <p
                  className="m-0 font-display text-[clamp(1.6rem,3.2vw,2.4rem)] font-medium leading-[1.3] tracking-[-0.02em] text-[var(--color-ink)] [overflow-wrap:anywhere]"
                  id={`${amountId}-${result.key}`}
                  lang={result.key}
                >
                  {result.text}
                </p>
                <div>
                  <CopyButton copied={copied === result.key} copiedLabel={labels.copied} label={labels.copy} onClick={() => copy(result.key, result.text)}>{results.length > 1 ? <span className="sr-only">{result.heading}</span> : null}</CopyButton>
                </div>
              </div>
            ))}
            <PrivacyNote>{labels.privacyNote}</PrivacyNote>
          </>
        ) : parsed.kind === "error" ? (
          <p className="m-0 text-[1.05rem] text-[#a3360f]" role="alert">
            {labels.errors[parsed.reason]}
          </p>
        ) : (
          <p className="m-0 text-[1.05rem] text-[var(--color-muted)]">{labels.emptyHint}</p>
        )}
      </div>

      <fieldset className="m-0 mt-2 flex flex-wrap items-center gap-x-8 gap-y-3 border-0 p-0">
        <legend className="sr-only">{labels.optionsLegend}</legend>
        <div aria-label={labels.minorLegend} className="inline-flex flex-wrap items-center gap-2.5" role="group">
          <span aria-hidden="true" className="text-[0.95rem] text-[var(--color-ink)]">
            {labels.minorLegend}
          </span>
          <div className="flex gap-1.5">
            {minorStyles.map((style) => (
              <button
                aria-pressed={options.minor === style}
                className={`${pillBase} ${options.minor === style ? pillOn : pillOff}`}
                key={style}
                onClick={() => update({ minor: style })}
                type="button"
              >
                {labels.minorStyles[style]}
              </button>
            ))}
          </div>
        </div>
        <label className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 text-[0.95rem] text-[var(--color-ink)]">
          <input
            checked={options.sayOne}
            className="h-5 w-5 accent-[var(--color-ink)]"
            onChange={(event) => update({ sayOne: event.target.checked })}
            type="checkbox"
          />
          <span>{labels.sayOneLabel}</span>
        </label>
        <label className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 text-[0.95rem] text-[var(--color-ink)]">
          <input
            checked={options.capitalize}
            className="h-5 w-5 accent-[var(--color-ink)]"
            onChange={(event) => update({ capitalize: event.target.checked })}
            type="checkbox"
          />
          <span>{labels.capitalizeLabel}</span>
        </label>
      </fieldset>
    </div>
  );
}
