import type { ConsentService } from "./types";

/**
 * Every service on the site that needs the visitor's consent.
 *
 * This list drives the cookie banner's preferences dialog and the cookie table
 * in the privacy policy (section 10, both languages). A category with no
 * service here is not offered in the banner at all.
 *
 * Add or change entries with the `update-cookie-policy` skill. Adding a
 * service with a new purpose also means bumping `CONSENT_VERSION` in
 * `lib/consent/store.ts`, so visitors are asked again.
 */
export const consentServices: ConsentService[] = [
  {
    id: "google-tag-manager",
    name: "Google Tag Manager",
    vendor: "Google Ireland Limited",
    category: "analytics",
    purpose: {
      pl: "Ładuje skrypt Google Analytics. Sam nie zapisuje plików cookies; przy pobraniu skryptu Google otrzymuje adres IP i dane przeglądarki.",
      en: "Loads the Google Analytics script. It sets no cookies of its own; when the script is fetched, Google receives the IP address and browser details.",
    },
    cookies: [],
    transfer: {
      pl: "Możliwe przekazanie do Google LLC w USA na podstawie Ram Ochrony Danych UE-USA.",
      en: "Possible transfer to Google LLC in the US under the EU-US Data Privacy Framework.",
    },
    privacyPolicyUrl: "https://policies.google.com/privacy",
    sources: [
      "https://support.google.com/tagmanager/answer/9323295",
      "https://business.safety.google/privacy/",
    ],
  },
  {
    id: "google-analytics-4",
    name: "Google Analytics 4",
    vendor: "Google Ireland Limited",
    category: "analytics",
    purpose: {
      pl: "Mierzy odwiedziny i sposób korzystania z serwisu. Reklamowe przechowywanie danych, personalizacja reklam i Google signals są wyłączone.",
      en: "Measures visits and how the site is used. Advertising storage, ad personalisation and Google signals are switched off.",
    },
    cookies: [
      {
        name: "_ga",
        lifetime: { pl: "2 lata", en: "2 years" },
        purpose: { pl: "Rozróżnia użytkowników.", en: "Distinguishes users." },
      },
      {
        name: "_ga_<ID>",
        lifetime: { pl: "2 lata", en: "2 years" },
        purpose: { pl: "Zachowuje stan sesji.", en: "Persists session state." },
      },
    ],
    transfer: {
      pl: "Możliwe przekazanie do Google LLC w USA na podstawie Ram Ochrony Danych UE-USA.",
      en: "Possible transfer to Google LLC in the US under the EU-US Data Privacy Framework.",
    },
    privacyPolicyUrl: "https://policies.google.com/privacy",
    sources: [
      "https://support.google.com/analytics/answer/11397207",
      "https://support.google.com/analytics/answer/12017362",
      "https://business.safety.google/privacy/",
    ],
  },
];

/** Section 10 rows of the privacy policy: one per service, in the reader's language. */
export function consentServiceRows(locale: "pl" | "en") {
  const t =
    locale === "pl"
      ? { cookies: "Pliki cookies", none: "brak", transfer: "Poza EOG", policy: "Polityka dostawcy" }
      : { cookies: "Cookies", none: "none", transfer: "Outside the EEA", policy: "Vendor policy" };

  return consentServices.map((service) => {
    const cookies = service.cookies.length
      ? service.cookies.map((cookie) => `${cookie.name} (${cookie.lifetime[locale]}): ${cookie.purpose[locale]}`).join(" ")
      : t.none;

    return {
      term: `${service.name} - ${service.vendor}`,
      description: `${service.purpose[locale]} ${t.cookies}: ${cookies} ${t.transfer}: ${service.transfer[locale]} ${t.policy}: ${service.privacyPolicyUrl}`,
    };
  });
}
