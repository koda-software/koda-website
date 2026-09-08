"use client";

import { ANALYTICS_SETTINGS_EVENT } from "@/lib/analytics/google";

export function AnalyticsSettingsButton({ label }: { label: string }) {
  return (
    <button
      className="inline-flex min-h-6 cursor-pointer items-center border-0 bg-transparent p-0 font-[inherit] text-[inherit] transition-colors hover:text-white"
      type="button"
      onClick={() => window.dispatchEvent(new Event(ANALYTICS_SETTINGS_EVENT))}
    >
      {label}
    </button>
  );
}
