import { strict as assert } from "node:assert";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import {
  CONSENT_STORAGE_KEY,
  CONSENT_VERSION,
  GRANTED_TTL,
  REJECTED_TTL,
  consentBootstrapScript,
  googleConsentState,
  makeChoice,
  parseStoredConsent,
} from "./store";

const NOW = Date.parse("2026-11-21T12:00:00Z");
const ago = (ms: number) => new Date(NOW - ms).toISOString();
const stored = (fields: Record<string, unknown>) => JSON.stringify({ v: CONSENT_VERSION, at: ago(0), analytics: false, marketing: false, ...fields });

test("asks when nothing is stored or the value is broken", () => {
  assert.equal(parseStoredConsent(null, NOW), undefined);
  assert.equal(parseStoredConsent("{not json", NOW), undefined);
  assert.equal(parseStoredConsent(JSON.stringify({ v: CONSENT_VERSION }), NOW), undefined);
  assert.equal(parseStoredConsent(stored({ at: "yesterday-ish" }), NOW), undefined);
});

test("asks again after a consent version change", () => {
  assert.equal(parseStoredConsent(stored({ v: CONSENT_VERSION - 1, analytics: true }), NOW), undefined);
});

test("keeps a granted choice for 13 months and a rejection for 6", () => {
  assert.equal(parseStoredConsent(stored({ analytics: true, at: ago(GRANTED_TTL - 1000) }), NOW)?.analytics, true);
  assert.equal(parseStoredConsent(stored({ analytics: true, at: ago(GRANTED_TTL + 1000) }), NOW), undefined);
  assert.equal(parseStoredConsent(stored({ at: ago(REJECTED_TTL - 1000) }), NOW)?.analytics, false);
  assert.equal(parseStoredConsent(stored({ at: ago(REJECTED_TTL + 1000) }), NOW), undefined);
});

test("maps categories onto Consent Mode v2 signals", () => {
  assert.deepEqual(googleConsentState(undefined), {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  assert.deepEqual(googleConsentState(makeChoice({ analytics: true, marketing: false })), {
    analytics_storage: "granted",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  assert.equal(googleConsentState(makeChoice({ analytics: false, marketing: true })).ad_user_data, "granted");
});

test("the inline bootstrap agrees with parseStoredConsent", () => {
  const cases: Array<string | null> = [
    null,
    stored({ analytics: true }),
    stored({ marketing: true, at: ago(30 * 24 * 3600 * 1000) }),
    stored({ analytics: true, at: ago(GRANTED_TTL + 1000) }),
    stored({ at: ago(REJECTED_TTL + 1000) }),
    stored({ v: 1, analytics: true }),
    "garbage",
  ];

  for (const raw of cases) {
    const queue: unknown[][] = [];
    const window: Record<string, unknown> = {};
    const storage = new Map<string, string | null>([[CONSENT_STORAGE_KEY, raw]]);
    const FixedDate = class extends Date {
      constructor(...args: unknown[]) {
        super(...((args.length ? args : [NOW]) as []));
      }
      static now() {
        return NOW;
      }
    };
    window.dataLayer = { push: (args: unknown[]) => queue.push([...args]) };
    runInNewContext(consentBootstrapScript("ga-disable-test"), {
      window,
      localStorage: { getItem: (key: string) => storage.get(key) ?? null },
      Date: FixedDate,
      JSON,
      isNaN,
    });

    const expected = googleConsentState(parseStoredConsent(raw, NOW));
    const consentDefault = queue.find((args) => args[0] === "consent") as [string, string, Record<string, string>];
    const label = String(raw);
    assert.equal(consentDefault[1], "default", label);
    for (const key of Object.keys(expected) as Array<keyof typeof expected>) {
      assert.equal(consentDefault[2][key], expected[key], `${label}: ${key}`);
    }
    assert.equal(window["ga-disable-test"], expected.analytics_storage !== "granted", label);
  }
});
