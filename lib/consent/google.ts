import { consentBootstrapScript } from "./store";

/**
 * The GTM web container. Every Google tag (GA4 included) lives inside it, and
 * the site requests `gtm.js` only after the visitor allows a consent category.
 * Container IDs are public, so it is not an environment variable.
 */
export const GOOGLE_TAG_MANAGER_ID = "GTM-N8KPJ29D";

/** The GA4 property configured in the container; used here only for Google's kill switch. */
const GOOGLE_ANALYTICS_ID = "G-M20VV601XR";

/** Google's documented per-property opt-out; the GA4 tag in GTM honours it. */
export const GA_DISABLE_KEY = `ga-disable-${GOOGLE_ANALYTICS_ID}` as const;

export const CONSENT_BOOTSTRAP = consentBootstrapScript(GA_DISABLE_KEY);
