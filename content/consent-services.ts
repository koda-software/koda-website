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
  {
    id: "microsoft-clarity",
    name: "Microsoft Clarity",
    vendor: "Microsoft Ireland Operations Limited",
    category: "analytics",
    purpose: {
      pl: "Tworzy nagrania przebiegu wizyt (ruchy myszy, kliknięcia, przewijanie) i mapy cieplne, które pokazują, jak korzystają Państwo ze stron. Treść wpisywana w pola formularzy jest maskowana i nie trafia do Microsoft. Lokalizację określa na podstawie adresu IP. Microsoft działa jako odrębny administrator danych.",
      en: "Records how visits unfold (mouse movements, clicks, scrolling) and builds heatmaps showing how the pages are used. Text typed into form fields is masked and never reaches Microsoft. Location is derived from the IP address. Microsoft acts as a separate data controller.",
    },
    cookies: [
      {
        name: "_clck",
        lifetime: { pl: "1 rok", en: "1 year" },
        purpose: {
          pl: "Plik własny serwisu. Przechowuje identyfikator użytkownika Clarity i ustawienia.",
          en: "First-party. Keeps the Clarity user ID and preferences.",
        },
      },
      {
        name: "_clsk",
        lifetime: { pl: "1 dzień", en: "1 day" },
        purpose: {
          pl: "Plik własny serwisu. Łączy kolejne odsłony w jedno nagranie sesji.",
          en: "First-party. Joins page views into a single session recording.",
        },
      },
      {
        name: "CLID",
        lifetime: { pl: "TODO: verify", en: "TODO: verify" },
        purpose: {
          pl: "Plik zewnętrzny Microsoft. Zapamiętuje, kiedy Clarity po raz pierwszy zobaczyło przeglądarkę w dowolnym serwisie z Clarity.",
          en: "Third-party (Microsoft). Records when Clarity first saw the browser on any site that uses Clarity.",
        },
      },
      {
        name: "MUID",
        lifetime: { pl: "około 13 miesięcy", en: "about 13 months" },
        purpose: {
          pl: "Plik zewnętrzny Microsoft (clarity.ms, bing.com). Rozpoznaje przeglądarkę w serwisach Microsoft; Microsoft używa go także do reklamy i analityki.",
          en: "Third-party (Microsoft: clarity.ms, bing.com). Identifies the browser across Microsoft sites; Microsoft also uses it for advertising and analytics.",
        },
      },
      {
        name: "SM",
        lifetime: { pl: "do końca sesji przeglądarki", en: "until the browser session ends" },
        purpose: {
          pl: "Plik zewnętrzny Microsoft. Synchronizuje MUID między domenami Microsoft.",
          en: "Third-party (Microsoft). Synchronises MUID across Microsoft domains.",
        },
      },
      {
        name: "MR",
        lifetime: { pl: "7 dni", en: "7 days" },
        purpose: {
          pl: "Plik zewnętrzny Microsoft. Wskazuje, czy odświeżyć MUID.",
          en: "Third-party (Microsoft). Indicates whether to refresh MUID.",
        },
      },
      {
        name: "SRM_B",
        lifetime: { pl: "około 13 miesięcy", en: "about 13 months" },
        purpose: {
          pl: "Plik zewnętrzny Microsoft (c.bing.com). TODO: verify",
          en: "Third-party (Microsoft: c.bing.com). TODO: verify",
        },
      },
      {
        name: "ANONCHK",
        lifetime: { pl: "TODO: verify", en: "TODO: verify" },
        purpose: {
          pl: "Plik zewnętrzny Microsoft. W Clarity zawsze ma wartość 0.",
          en: "Third-party (Microsoft). Always set to 0 by Clarity.",
        },
      },
    ],
    transfer: {
      pl: "Możliwe przekazanie do Microsoft Corporation w USA na podstawie standardowych klauzul umownych.",
      en: "Possible transfer to Microsoft Corporation in the US under standard contractual clauses.",
    },
    privacyPolicyUrl: "https://www.microsoft.com/privacy/privacystatement",
    sources: [
      "https://learn.microsoft.com/en-us/clarity/setup-and-installation/cookie-list",
      "https://learn.microsoft.com/en-us/clarity/faq",
      "https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-data",
      "https://learn.microsoft.com/en-us/clarity/setup-and-installation/consent-mode",
      "https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2",
      "https://learn.microsoft.com/en-us/clarity/setup-and-installation/cookie-gcm",
      // _clck (365 days) and _clsk (1 day) lifetimes, and Google Consent Mode handling: clarity-js source.
      "https://unpkg.com/clarity-js/build/clarity.js",
      // MUID, MR, SM, SRM_B lifetimes: observed Set-Cookie headers from c.clarity.ms/c.gif and c.bing.com/c.gif on 2026-11-21.
      "https://clarity.microsoft.com/terms",
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
