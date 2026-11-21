import type { ConsentCategory } from "@/content/types";

/**
 * The visitor's consent, kept first-party in localStorage.
 *
 * Bump `CONSENT_VERSION` whenever a new purpose appears (a new category, or a
 * service that does something the banner did not describe): every stored
 * choice with an older version is ignored and the banner asks again.
 */
export const CONSENT_VERSION = 2;
export const CONSENT_STORAGE_KEY = "kodasoft-consent-v2";
export const CONSENT_CHANGED_EVENT = "kodasoft:consent-changed";
export const CONSENT_SETTINGS_EVENT = "kodasoft:open-consent-settings";

const DAY = 24 * 60 * 60 * 1000;
/** A choice that granted something is trusted for about 13 months. */
export const GRANTED_TTL = 395 * DAY;
/** A full rejection is respected for 6 months before the banner may ask again. */
export const REJECTED_TTL = 182 * DAY;

export type ConsentChoice = Record<ConsentCategory, boolean> & {
  v: number;
  /** ISO timestamp of the decision. */
  at: string;
};

export type GoogleConsentState = {
  analytics_storage: "granted" | "denied";
  ad_storage: "granted" | "denied";
  ad_user_data: "granted" | "denied";
  ad_personalization: "granted" | "denied";
};

export function makeChoice(categories: Record<ConsentCategory, boolean>, now = new Date()): ConsentChoice {
  return { v: CONSENT_VERSION, at: now.toISOString(), analytics: categories.analytics, marketing: categories.marketing };
}

export function grantsAnything(choice: ConsentChoice | undefined) {
  return Boolean(choice && (choice.analytics || choice.marketing));
}

/**
 * Reads what storage holds. Returns undefined when the banner has to ask:
 * nothing stored, a malformed value, an older consent version, or a choice
 * that has expired.
 */
export function parseStoredConsent(raw: string | null, now = Date.now()): ConsentChoice | undefined {
  let choice: ConsentChoice | undefined;

  if (raw) {
    try {
      const value = JSON.parse(raw) as Partial<ConsentChoice>;
      if (
        value &&
        value.v === CONSENT_VERSION &&
        typeof value.at === "string" &&
        typeof value.analytics === "boolean" &&
        typeof value.marketing === "boolean"
      ) {
        choice = { v: value.v, at: value.at, analytics: value.analytics, marketing: value.marketing };
      }
    } catch {
      choice = undefined;
    }
  }

  if (!choice) return undefined;

  const at = Date.parse(choice.at);
  if (Number.isNaN(at) || at > now + DAY) return undefined;

  const ttl = grantsAnything(choice) ? GRANTED_TTL : REJECTED_TTL;
  return now - at > ttl ? undefined : choice;
}

export function googleConsentState(choice: ConsentChoice | undefined): GoogleConsentState {
  const analytics = choice?.analytics ? "granted" : "denied";
  const marketing = choice?.marketing ? "granted" : "denied";
  return { analytics_storage: analytics, ad_storage: marketing, ad_user_data: marketing, ad_personalization: marketing };
}

/* ---------- Browser side ---------- */

export function readConsent(): ConsentChoice | undefined {
  try {
    return parseStoredConsent(window.localStorage.getItem(CONSENT_STORAGE_KEY));
  } catch {
    return undefined;
  }
}

/** Persists the choice; returns false when storage is blocked (the choice still applies to this page). */
export function writeConsent(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(choice));
    return true;
  } catch {
    return false;
  }
}

/**
 * Inline, first-party, runs before anything else on the page. It queues Google
 * Consent Mode v2 defaults from the stored choice but requests nothing from
 * Google. It mirrors `parseStoredConsent`; `store.test.ts` runs both on the
 * same inputs so they cannot drift apart.
 */
export function consentBootstrapScript(gaDisableKey: string) {
  return `(function(){
var c;
try{
var s=localStorage,raw=s.getItem(${JSON.stringify(CONSENT_STORAGE_KEY)}),now=Date.now();
if(raw){try{var v=JSON.parse(raw);if(v&&v.v===${CONSENT_VERSION}&&typeof v.at==="string"&&typeof v.analytics==="boolean"&&typeof v.marketing==="boolean")c=v;}catch(e){}}
if(c){var at=Date.parse(c.at),any=c.analytics||c.marketing;if(isNaN(at)||at>now+${DAY}||now-at>(any?${GRANTED_TTL}:${REJECTED_TTL}))c=undefined;}
}catch(e){c=undefined;}
var a=c&&c.analytics?"granted":"denied",m=c&&c.marketing?"granted":"denied";
window[${JSON.stringify(gaDisableKey)}]=a!=="granted";
window.dataLayer=window.dataLayer||[];
window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};
window.gtag("consent","default",{analytics_storage:a,ad_storage:m,ad_user_data:m,ad_personalization:m,security_storage:"granted",wait_for_update:500});
window.gtag("set","ads_data_redaction",m!=="granted");
window.gtag("set","allow_google_signals",false);
window.gtag("set","allow_ad_personalization_signals",m==="granted");
})();`;
}
