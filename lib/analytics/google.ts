export const GOOGLE_ANALYTICS_ID = "G-M20VV601XR";
export const ANALYTICS_CONSENT_STORAGE_KEY = "kodasoft-analytics-consent-v1";
export const ANALYTICS_CONSENT_CHANGED_EVENT = "kodasoft:analytics-consent-changed";
export const ANALYTICS_SETTINGS_EVENT = "kodasoft:open-analytics-settings";
export const GA_DISABLE_KEY = `ga-disable-${GOOGLE_ANALYTICS_ID}` as const;

/**
 * First-party bootstrap code. It queues Google's consent defaults but neither
 * requests the Google tag nor sends anything off-site.
 */
export const GOOGLE_ANALYTICS_CONSENT_BOOTSTRAP = `
  (function () {
    var accepted = false;
    try {
      accepted = window.localStorage.getItem('${ANALYTICS_CONSENT_STORAGE_KEY}') === 'accepted';
    } catch (_) {}

    window['${GA_DISABLE_KEY}'] = !accepted;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: accepted ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('set', 'allow_google_signals', false);
    window.gtag('set', 'allow_ad_personalization_signals', false);
  })();
`;

export type AnalyticsConsentChoice = "accepted" | "rejected";
