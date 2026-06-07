"use client";

import { useId } from "react";
import FlagGb from "country-flag-icons/react/3x2/GB";
import FlagPl from "country-flag-icons/react/3x2/PL";
import type { Locale } from "@/lib/i18n/config";
import { getAlternatePaths, type PageKey } from "@/lib/i18n/routes";

type LanguageSwitcherProps = {
  locale: Locale;
  page: PageKey;
  label: string;
};

const languageOptions = [
  { Flag: FlagGb, label: "English", locale: "en" },
  { Flag: FlagPl, label: "Polski", locale: "pl" },
];

export function LanguageSwitcher({ locale, page, label }: LanguageSwitcherProps) {
  const selectId = useId();
  const alternates = getAlternatePaths(page);
  const selectedOption = languageOptions.find((option) => option.locale === locale) ?? languageOptions[0];
  const SelectedFlag = selectedOption.Flag;

  return (
    <div className="grid gap-2">
      <label className="text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-white/38" htmlFor={selectId}>
        {label}
      </label>
      <div className="relative w-fit">
        <SelectedFlag className="pointer-events-none absolute left-3 top-1/2 z-[1] h-4 w-6 -translate-y-1/2 rounded-[2px] shadow-[0_0_0_1px_rgba(255,255,255,0.18)]" aria-hidden="true" />
        <select
          id={selectId}
          className="h-11 min-w-[11rem] rounded-[var(--radius-button)] border border-white/[0.14] bg-white/[0.08] py-0 pl-12 pr-9 text-[0.92rem] font-medium text-white outline-none transition-colors hover:bg-white/[0.12] focus:border-[var(--color-blue-soft)]"
          value={locale}
          onChange={(event) => {
            window.location.href = alternates[event.target.value as Locale];
          }}
        >
          {languageOptions.map((option) => (
            <option className="bg-[#050713] text-white" key={option.locale} value={option.locale}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
