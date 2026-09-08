"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { AnalyticsConsentContent } from "@/content/types";
import {
  ANALYTICS_CONSENT_CHANGED_EVENT,
  ANALYTICS_CONSENT_STORAGE_KEY,
  ANALYTICS_SETTINGS_EVENT,
  GA_DISABLE_KEY,
  GOOGLE_ANALYTICS_ID,
  type AnalyticsConsentChoice,
} from "@/lib/analytics/google";

declare global {
  interface Window {
    [GA_DISABLE_KEY]?: boolean;
    gtag?: (...args: unknown[]) => void;
  }
}

type GoogleAnalyticsConsentProps = {
  content: AnalyticsConsentContent;
  privacyHref: string;
};

/**
 * Basic consent mode: the Google tag is not requested at all before opt-in.
 * The preference itself stays first-party in localStorage and can be reopened
 * from the footer on every page.
 */
export function GoogleAnalyticsConsent({ content, privacyHref }: GoogleAnalyticsConsentProps) {
  const storedChoice = useSyncExternalStore(subscribeToConsent, readConsent, readServerConsent);
  const [sessionChoice, setSessionChoice] = useState<AnalyticsConsentChoice>();
  const [isOpen, setIsOpen] = useState(false);
  const choice = storedChoice === null ? null : storedChoice ?? sessionChoice;

  useEffect(() => {
    const openSettings = () => setIsOpen(true);
    window.addEventListener(ANALYTICS_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(ANALYTICS_SETTINGS_EVENT, openSettings);
  }, []);

  function saveChoice(nextChoice: AnalyticsConsentChoice) {
    let persisted = false;

    try {
      window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, nextChoice);
      persisted = true;
    } catch {
      // The decision still applies to the current page when storage is blocked.
    }

    if (nextChoice === "accepted") {
      enableAnalytics();

      // Next.js intentionally loads a Script id only once. Reloading when a
      // previous rejection is reversed lets the bootstrap restore consent and
      // initializes a fresh GA pageview without duplicating the first opt-in.
      if (choice === "rejected" && persisted) {
        window.location.reload();
        return;
      }
    } else {
      disableAnalytics();
    }

    setSessionChoice(nextChoice);
    setIsOpen(false);
    window.dispatchEvent(new Event(ANALYTICS_CONSENT_CHANGED_EVENT));
  }

  return (
    <>
      {choice === "accepted" ? <GoogleAnalytics gaId={GOOGLE_ANALYTICS_ID} /> : null}
      {choice === undefined || isOpen ? (
        <section
          className="fixed inset-x-0 bottom-0 z-[100] px-[var(--page-gutter)] pb-[max(1rem,env(safe-area-inset-bottom))]"
          role="dialog"
          aria-labelledby="analytics-consent-title"
          aria-describedby="analytics-consent-description"
        >
          <div className="mx-auto flex w-[min(100%,var(--shell-width))] items-center justify-between gap-6 rounded-[var(--radius-panel)] border border-white/[0.14] bg-[var(--color-surface-dark)] p-5 text-white shadow-[0_20px_70px_rgba(2,10,18,0.42)] max-[760px]:items-start max-[760px]:flex-col">
            <div className="max-w-[52rem]">
              <h2 id="analytics-consent-title" className="m-0 text-[1rem] font-semibold tracking-[-0.01em]">
                {content.title}
              </h2>
              <p id="analytics-consent-description" className="mt-2 mb-0 text-[0.88rem] font-light leading-[1.6] text-white/70">
                {content.description}{" "}
                <Link className="font-medium text-white underline decoration-white/40 underline-offset-4 hover:decoration-white" href={privacyHref}>
                  {content.privacyLinkLabel}
                </Link>
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2 max-[560px]:w-full max-[560px]:flex-col-reverse">
              <button
                className="min-h-11 rounded-[var(--radius-button)] border border-white/[0.18] px-4 py-2.5 text-[0.86rem] font-medium text-white transition-colors hover:bg-white/[0.08]"
                type="button"
                onClick={() => saveChoice("rejected")}
              >
                {content.rejectLabel}
              </button>
              <button
                className="min-h-11 rounded-[var(--radius-button)] bg-[var(--color-brand-blue)] px-4 py-2.5 text-[0.86rem] font-semibold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-cyan)]"
                type="button"
                onClick={() => saveChoice("accepted")}
              >
                {content.acceptLabel}
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

function enableAnalytics() {
  window[GA_DISABLE_KEY] = false;
  window.gtag?.("consent", "update", {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

function disableAnalytics() {
  window.gtag?.("consent", "update", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window[GA_DISABLE_KEY] = true;

  const cookieNames = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0]?.trim())
    .filter((name): name is string => name === "_ga" || Boolean(name?.startsWith("_ga_")));

  for (const name of cookieNames) {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;

    if (window.location.hostname === "kodasoft.pl" || window.location.hostname.endsWith(".kodasoft.pl")) {
      document.cookie = `${name}=; Max-Age=0; Domain=.kodasoft.pl; Path=/; SameSite=Lax`;
    }
  }
}

function readConsent(): AnalyticsConsentChoice | undefined | null {
  try {
    const value = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY);
    return value === "accepted" || value === "rejected" ? value : undefined;
  } catch {
    return undefined;
  }
}

function readServerConsent(): null {
  return null;
}

function subscribeToConsent(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== ANALYTICS_CONSENT_STORAGE_KEY && event.key !== null) return;

    if (readConsent() === "accepted") {
      enableAnalytics();
    } else {
      disableAnalytics();
    }

    onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(ANALYTICS_CONSENT_CHANGED_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(ANALYTICS_CONSENT_CHANGED_EVENT, onStoreChange);
  };
}
