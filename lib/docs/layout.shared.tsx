import { openapiTranslations } from 'fumadocs-openapi/i18n';
import { i18nProvider } from 'fumadocs-ui/i18n';
import { uiTranslations } from 'fumadocs-ui/i18n';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

import { localizePath } from '@/lib/i18n/routes';
import { siteConfig } from '@/lib/seo/site';

import { DocsBrand } from '@/components/docs/docs-brand';
import { i18n, type Locale } from '@/lib/docs/i18n';

export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .extend(openapiTranslations())
  .add({
    en: {
      displayName: 'English',
    },
    pl: {
      'Authorization(OAuth dialog)': 'Autoryzacja',
      'Authorization(operation page)': 'Autoryzacja',
      'Authorization(playground)': 'Autoryzacja',
      'Authorization(security scheme)': 'Autoryzacja',
      'Authorize(playground)': 'Autoryzuj',
      'Back to Home(404 page)': 'Wróć do strony głównej',
      'Binary response body, {length} bytes(playground result display)':
        'Binarna treść odpowiedzi, {length} bajtów',
      'Body(playground)': 'Treść',
      'Callbacks(operation page)': 'Wywołania zwrotne',
      'Choose a language(language switcher)': 'Wybierz język',
      'Choose a language(language switcher)(aria-label)': 'Wybierz język',
      'Close Search(search dialog)(aria-label)': 'Zamknij wyszukiwanie',
      'Close JSON Editor(playground)': 'Zamknij edytor JSON',
      'Close(playground result display)': 'Zamknij',
      'Cookie Parameters(operation page)': 'Parametry cookie',
      'Copy Anchor Link(heading anchor)(aria-label)': 'Kopiuj link do sekcji',
      'Copy Text(code block)(aria-label)': 'Kopiuj tekst',
      'Copy(TypeScript definitions)': 'Kopiuj',
      'Dark(theme switcher)(aria-label)': 'Ciemny',
      'Default(operation page)': 'Domyślnie',
      'Default(schema UI)': 'Domyślnie',
      'Default(type table)': 'Domyślnie',
      'Deprecated(operation page)': 'Przestarzałe',
      'Deprecated(schema UI)': 'Przestarzałe',
      'Enter Property Name(playground)': 'Wpisz nazwę pola',
      'Enter Value(playground server select)': 'Wpisz wartość',
      'Enter value(OAuth dialog)': 'Wpisz wartość',
      'Enter value(playground)': 'Wpisz wartość',
      'Example Requests(operation page)': 'Przykładowe żądania',
      'Example(operation page)': 'Przykład',
      'Example(schema UI)': 'Przykład',
      'Filter Properties(schema UI)': 'Filtruj pola',
      'Format(schema UI)': 'Format',
      'Header Parameters(operation page)': 'Parametry nagłówka',
      'Header(playground)': 'Nagłówek',
      'Items(schema UI)': 'Elementy',
      'Length(schema UI)': 'Długość',
      'Light(theme switcher)(aria-label)': 'Jasny',
      'Match(schema UI)': 'Dopasowanie',
      'Multiple Of(schema UI)': 'Wielokrotność',
      'New Item(playground)': 'Nowy element',
      'New(playground)': 'Nowy',
      'No Headings(table of contents)': 'Brak nagłówków',
      'No property matching(schema UI)': 'Brak pasujących pól',
      'No results found(search dialog)': 'Nie znaleziono wyników',
      'On this page(table of contents)': 'Na tej stronie',
      'Open JSON Editor(playground)': 'Otwórz edytor JSON',
      'Open Search(search trigger)(aria-label)': 'Otwórz wyszukiwanie',
      'Open Sidebar(sidebar)(aria-label)': 'Otwórz pasek boczny',
      'Page Not Found(404 page)': 'Nie znaleziono strony',
      'Parameters(type table)': 'Parametry',
      'Path Parameters(operation page)': 'Parametry ścieżki',
      'Path(playground)': 'Ścieżka',
      'Previous Page(pagination)': 'Poprzednia strona',
      'Properties(schema UI)': 'Pola',
      'Prop(type table)': 'Pole',
      'Query Parameters(operation page)': 'Parametry zapytania',
      'Query(playground)': 'Zapytanie',
      'Range(schema UI)': 'Zakres',
      'Remove Item(playground)(aria-label)': 'Usuń element',
      'Request Body(operation page)': 'Treść żądania',
      'Response Body(operation page)': 'Treść odpowiedzi',
      'Returns(type table)': 'Zwraca',
      'Search(search dialog)': 'Szukaj',
      'Search(search trigger)': 'Szukaj',
      'Select(playground)': 'Wybierz',
      'Selected(playground)': 'Wybrano',
      'Send(playground)': 'Wyślij',
      'Server URL(playground server select)': 'Adres serwera',
      'Show Property(playground)': 'Pokaż pole',
      'System(theme switcher)(aria-label)': 'Systemowy',
      'The base URL of your API endpoint.(playground server select)':
        'Bazowy adres URL API.',
      'Toggle Theme(theme switcher)(aria-label)': 'Zmień motyw',
      'TypeScript Definitions(TypeScript definitions)': 'Definicje TypeScript',
      'Type(type table)': 'Typ',
      'Unset(playground)': 'Wyczyść',
      'Upload(playground)': 'Prześlij',
      'Use the {name} type in TypeScript.(TypeScript definitions)':
        'Użyj typu {name} w TypeScript.',
      'Value in(schema UI)': 'Wartość',
      displayName: 'Polski',
    },
  });

export function createI18nProvider(locale: Locale) {
  return i18nProvider(translations, locale);
}

export function baseOptions(locale: Locale): BaseLayoutProps {
  return {
    links: [{ text: siteConfig.name, url: localizePath(locale, "home"), active: "none" }],
    nav: {
      title: <DocsBrand />,
      url: `/docs/${locale}`,
    },
  };
}
