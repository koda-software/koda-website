"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { GoogleTagManager } from "@next/third-parties/google";
import { consentServices } from "@/content/consent-services";
import type { ConsentCategory, ConsentContent } from "@/content/types";
import { GA_DISABLE_KEY, GOOGLE_TAG_MANAGER_ID } from "@/lib/consent/google";
import {
  CONSENT_CHANGED_EVENT,
  CONSENT_SETTINGS_EVENT,
  CONSENT_STORAGE_KEY,
  type ConsentChoice,
  googleConsentState,
  grantsAnything,
  makeChoice,
  readConsent,
  writeConsent,
} from "@/lib/consent/store";
import { ConsentBanner } from "./ConsentBanner";
import { ConsentPreferences } from "./ConsentPreferences";

declare global {
  interface Window {
    [GA_DISABLE_KEY]?: boolean;
    gtag?: (...args: unknown[]) => void;
  }
}

/** The banner waits for a sign of interest: the first scroll, or this long on the page. */
const REVEAL_AFTER_MS = 8000;

const CATEGORY_ORDER: ConsentCategory[] = ["analytics", "marketing"];
/** Only categories with at least one service are offered; an empty one would ask for nothing. */
const OFFERED = CATEGORY_ORDER.filter((category) => consentServices.some((service) => service.category === category));

type ConsentManagerProps = {
  content: ConsentContent;
  locale: "pl" | "en";
  privacyHref: string;
};

/**
 * Basic Consent Mode: Google's script (GTM, or GA4 while no container is set)
 * is not requested until the visitor allows a category. The inline bootstrap
 * in the root layout has already queued the matching consent defaults.
 */
export function ConsentManager({ content, locale, privacyHref }: ConsentManagerProps) {
  const stored = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [sessionChoice, setSessionChoice] = useState<ConsentChoice>();
  const [revealed, setRevealed] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  /** The banner's switches, kept here so they survive a trip to the details and back. */
  const [draft, setDraft] = useState<Record<ConsentCategory, boolean>>({ analytics: false, marketing: false });
  const [loadTags, setLoadTags] = useState(false);

  // null: still on the server or hydrating, so render nothing that could mismatch.
  const choice = stored === null ? null : (stored ?? sessionChoice);
  const granted = choice ? grantsAnything(choice) : false;

  useEffect(() => {
    const open = () => setPreferencesOpen(true);
    window.addEventListener(CONSENT_SETTINGS_EVENT, open);
    return () => window.removeEventListener(CONSENT_SETTINGS_EVENT, open);
  }, []);

  useEffect(() => {
    if (choice !== undefined || revealed) return;
    const reveal = () => setRevealed(true);
    const timer = window.setTimeout(reveal, REVEAL_AFTER_MS);
    window.addEventListener("scroll", reveal, { passive: true, once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", reveal);
    };
  }, [choice, revealed]);

  // Once allowed, the tag loads when the main thread is idle and stays loaded;
  // a later withdrawal is handled by consent signals, not by unmounting.
  useEffect(() => {
    if (!granted || loadTags) return;
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setLoadTags(true), { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = globalThis.setTimeout(() => setLoadTags(true), 1500);
    return () => globalThis.clearTimeout(id);
  }, [granted, loadTags]);

  function decide(categories: Record<ConsentCategory, boolean>) {
    const next = makeChoice(categories);
    if (!writeConsent(next)) setSessionChoice(next);
    applyToGoogle(next);
    window.dataLayer?.push({ event: "kodasoft_consent_update", consent: { analytics: next.analytics, marketing: next.marketing } });
    setPreferencesOpen(false);
    window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
  }

  const all = (value: boolean) => ({ analytics: value && OFFERED.includes("analytics"), marketing: value && OFFERED.includes("marketing") });
  const bannerVisible = choice === undefined && revealed && !preferencesOpen;

  return (
    <>
      {loadTags ? (
<GoogleTagManager gtmId={GOOGLE_TAG_MANAGER_ID} />
      ) : null}

      {bannerVisible ? (
        <ConsentBanner
          categories={OFFERED}
          content={content}
          privacyHref={privacyHref}
          selected={draft}
          onSelect={setDraft}
          onDecide={decide}
          onCustomise={() => setPreferencesOpen(true)}
          all={all}
        />
      ) : null}

      {preferencesOpen ? (
        <ConsentPreferences
          categories={OFFERED}
          content={content}
          initial={choice ? { analytics: choice.analytics, marketing: choice.marketing } : draft}
          locale={locale}
          privacyHref={privacyHref}
          onClose={() => setPreferencesOpen(false)}
          onDecide={decide}
          all={all}
        />
      ) : null}
    </>
  );
}

function applyToGoogle(choice: ConsentChoice) {
  window[GA_DISABLE_KEY] = !choice.analytics;
  window.gtag?.("consent", "update", googleConsentState(choice));
  window.gtag?.("set", "ads_data_redaction", !choice.marketing);
  window.gtag?.("set", "allow_ad_personalization_signals", choice.marketing);
  if (!choice.analytics) deleteAnalyticsCookies();
}

/** First-party analytics cookies: Google Analytics (`_ga`, `_ga_<ID>`) and Microsoft Clarity (`_clck`, `_clsk`). */
function deleteAnalyticsCookies() {
  const names = document.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0]?.trim())
    .filter(
      (name): name is string =>
        name === "_ga" || name === "_clck" || name === "_clsk" || Boolean(name?.startsWith("_ga_")),
    );

  const host = window.location.hostname;
  const domains = [undefined, ...(host === "kodasoft.pl" || host.endsWith(".kodasoft.pl") ? [".kodasoft.pl"] : [])];
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? `; Domain=${domain}` : ""}`;
    }
  }
}

/* useSyncExternalStore needs a stable snapshot, so cache by the raw stored strings. */
let cachedRaw: string | null | undefined;
let cachedChoice: ConsentChoice | undefined;

function getSnapshot(): ConsentChoice | undefined {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedChoice = readConsent();
  }
  return cachedChoice;
}

function getServerSnapshot(): null {
  return null;
}

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== CONSENT_STORAGE_KEY) return;
    // Another tab decided: apply it here too without writing it again.
    const choice = readConsent();
    if (choice) applyToGoogle(choice);
    onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CONSENT_CHANGED_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CONSENT_CHANGED_EVENT, onChange);
  };
}
