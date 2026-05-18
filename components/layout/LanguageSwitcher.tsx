import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { localeLabels } from "@/lib/i18n/config";
import { getAlternatePaths, type PageKey } from "@/lib/i18n/routes";

type LanguageSwitcherProps = {
  locale: Locale;
  page: PageKey;
  label: string;
};

export function LanguageSwitcher({ locale, page, label }: LanguageSwitcherProps) {
  const alternates = getAlternatePaths(page);
  const nextLocale: Locale = locale === "en" ? "pl" : "en";

  return (
    <div className="text-sm font-semibold" aria-label={label}>
      <Link href={alternates[nextLocale]} hrefLang={nextLocale}>
        {localeLabels[nextLocale]}
      </Link>
    </div>
  );
}
