"use client";

import { CONSENT_SETTINGS_EVENT } from "@/lib/consent/store";

/** Footer entry that reopens the cookie preferences, so withdrawing is as easy as giving consent. */
export function ConsentSettingsButton({ label }: { label: string }) {
  return (
    <button
      className="inline-flex min-h-6 cursor-pointer items-center border-0 bg-transparent p-0 font-[inherit] text-[inherit] transition-colors hover:text-white"
      type="button"
      onClick={() => window.dispatchEvent(new Event(CONSENT_SETTINGS_EVENT))}
    >
      {label}
    </button>
  );
}
