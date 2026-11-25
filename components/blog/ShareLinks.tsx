"use client";

import { useState } from "react";
import CheckIcon from "lucide-react/dist/esm/icons/check.mjs";
import LinkIcon from "lucide-react/dist/esm/icons/link.mjs";
import { LinkedInGlyph, XGlyph } from "./SocialGlyphs";

type ShareLinksProps = {
  /** Absolute URL of the article. */
  url: string;
  title: string;
  labels: { share: string; linkedIn: string; x: string; copyLink: string; linkCopied: string };
};

const buttonClass =
  "inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-[var(--radius-button)] border border-[rgba(11,17,22,0.14)] bg-transparent text-[var(--color-ink-soft)] transition-colors hover:border-[rgba(11,17,22,0.4)] hover:text-[var(--color-ink)]";

/**
 * Share on LinkedIn or X, or copy the link. Plain links to each network's own
 * share page: no SDK, no tracking script, and `nofollow` because a share dialog
 * is not a page worth sending a crawler to.
 */
export function ShareLinks({ url, title, labels }: ShareLinksProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div>
      <p className="m-0 mb-3 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">{labels.share}</p>
      <div className="flex gap-2">
        <a aria-label={labels.linkedIn} className={buttonClass} href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} rel="noopener noreferrer nofollow" target="_blank">
          <LinkedInGlyph />
        </a>
        <a
          aria-label={labels.x}
          className={buttonClass}
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(title)}`}
          rel="noopener noreferrer nofollow"
          target="_blank"
        >
          <XGlyph />
        </a>
        <button aria-label={copied ? labels.linkCopied : labels.copyLink} className={buttonClass} onClick={copy} type="button">
          {copied ? <CheckIcon aria-hidden="true" className="h-[17px] w-[17px]" strokeWidth={2} /> : <LinkIcon aria-hidden="true" className="h-[17px] w-[17px]" strokeWidth={1.8} />}
        </button>
        <span aria-live="polite" className="sr-only">
          {copied ? labels.linkCopied : ""}
        </span>
      </div>
    </div>
  );
}
