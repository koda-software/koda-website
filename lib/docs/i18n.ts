import { defineI18n } from 'fumadocs-core/i18n';

import {
  defaultLocale,
  isLocale,
  locales,
  type Locale,
} from '@/lib/i18n/config';

// The website owns the locale list. The docs reuse it so the two can't drift apart.
export { defaultLocale, isLocale, locales, type Locale };

export const i18n = defineI18n({
  defaultLanguage: defaultLocale,
  languages: [...locales],
  parser: 'dir',
});
