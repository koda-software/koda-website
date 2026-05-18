# Step 4.5: Localisation Architecture

Purpose: define how Koda Soft website will support English and Polish while preserving static export, Core Web Vitals, and small client bundles.

Scope: localisation only. SEO will be handled in a separate Step 4.6 document after this is approved.

Research sources:

- Next.js Internationalization: https://nextjs.org/docs/app/building-your-application/routing/internationalization
- Next.js Static Exports: https://nextjs.org/docs/app/guides/static-exports
- next-intl Server & Client Components: https://next-intl.dev/docs/environments/server-client-components
- next-intl Routing Setup: https://next-intl.dev/docs/routing/setup
- next-intl Routing Configuration: https://next-intl.dev/docs/routing/configuration

## Requirements

- English homepage must be available at `/`.
- Polish homepage must be available at `/pl`.
- All non-homepage URLs must be language-prefixed.
- English non-homepage URLs use `/en/...`.
- Polish non-homepage URLs use `/pl/...`.
- Static export remains mandatory.
- No middleware/proxy-based locale detection for launch.
- Client components must not receive full translation dictionaries.
- Translations passed to client components must be filtered to only the exact labels/content required by that component.

## Decision

Use explicit static routes and server-side dictionaries.

> Locale is determined from the URL path, not browser language detection.

This matches the static-export requirement and avoids middleware/proxy, redirects, cookies, request headers, or runtime locale negotiation.

## URL Contract

Initial launch routes:

| Page | English URL | Polish URL |
| --- | --- | --- |
| Home | `/` | `/pl` |
| Opero | `/en/opero` | `/pl/opero` |
| Solutions | `/en/solutions` | `/pl/solutions` |
| About | `/en/about` | `/pl/about` |
| Contact / Book demo | `/en/contact` | `/pl/contact` |

Notes:

- `/` is the canonical English homepage.
- `/en` should not be needed for homepage at launch unless we intentionally add it as an alias later.
- `/pl` is the canonical Polish homepage.
- For non-homepage pages, always include the locale prefix.
- We should not create unprefixed non-homepage pages like `/opero` or `/solutions`.

## Route Structure Recommendation

Because `/` is English but non-homepage English pages are prefixed, use explicit route groups rather than a single `[locale]` tree for everything.

Recommended structure:

```text
app/
  layout.tsx
  page.tsx                  # English home at /
  pl/
    page.tsx                # Polish home at /pl
    opero/page.tsx          # /pl/opero
    solutions/page.tsx      # /pl/solutions
    about/page.tsx          # /pl/about
    contact/page.tsx        # /pl/contact
  en/
    opero/page.tsx          # /en/opero
    solutions/page.tsx      # /en/solutions
    about/page.tsx          # /en/about
    contact/page.tsx        # /en/contact
```

Optional later abstraction:

```text
app/
  [locale]/...
```

But for launch, explicit static routes are simpler and make the special `/` English-home requirement obvious.

## Locale Model

Supported locales:

```ts
export const locales = ['en', 'pl'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';
```

Route locale mapping:

- `/` -> `en`
- `/en/*` -> `en`
- `/pl` -> `pl`
- `/pl/*` -> `pl`

Invalid locale paths:

- Do not generate them.
- If a dynamic locale approach is later introduced, unsupported locales should return `notFound()` at build/runtime-compatible boundaries.

## Translation Storage

Use route/section-scoped dictionaries, not one global translation blob.

Recommended structure:

```text
content/
  en/
    common.ts
    home.ts
    opero.ts
    solutions.ts
    about.ts
    contact.ts
  pl/
    common.ts
    home.ts
    opero.ts
    solutions.ts
    about.ts
    contact.ts
```

Alternative if JSON is preferred:

```text
messages/
  en/
    common.json
    home.json
    opero.json
  pl/
    common.json
    home.json
    opero.json
```

Recommendation for this repo:

- Prefer TypeScript modules for launch content because they are type-checkable, importable in Server Components, and easy to keep route-scoped.
- Keep dictionaries static and imported only by the route/page that needs them.
- Do not create a single `messages/en.json` with the entire site unless we later add tooling that can split bundles safely.

## Server-First Translation Rule

Default rule:

> Translate on the server and render static HTML.

Implementation pattern:

```tsx
import {homeContent} from '@/content/en/home';

export default function HomePage() {
  return <Home content={homeContent} locale="en" />;
}
```

Server Components can receive the route dictionary and render text directly. Since Server Components do not ship their implementation or imported dictionaries to the browser, this keeps localization from becoming client JavaScript.

## Client Component Translation Rule

Hard requirement:

> Never pass the entire locale dictionary to a Client Component.

Preferred approach:

- Keep Client Components as tiny leaf components.
- Translate labels in a Server Component.
- Pass only primitive strings or small arrays that the Client Component actually renders.

Good pattern:

```tsx
// Server Component
import MobileMenu from './MobileMenu';
import {common} from '@/content/en/common';

export function Header() {
  return (
    <MobileMenu
      labels={{
        open: common.nav.openMenu,
        close: common.nav.closeMenu,
      }}
      links={common.nav.links.map((link) => ({
        href: link.href,
        label: link.label,
      }))}
    />
  );
}
```

Bad pattern:

```tsx
// Do not do this
<MobileMenu messages={entireEnglishDictionary} />
```

Allowed client translation payloads:

- A button label.
- A menu open/close label.
- A small nav link array.
- A few form field labels if a client-enhanced form is later needed.

Not allowed:

- Whole site dictionary.
- Whole route dictionary unless the client component truly renders the whole route.
- `NextIntlClientProvider` with all messages by default.
- Context providers that make all translations available to all Client Components.

## Library Decision

For launch, use a lightweight custom dictionary approach instead of adding an i18n runtime library.

Why:

- Static marketing site with small page count.
- Only two locales at launch.
- No plural/date/number-heavy UI requirements yet.
- Static export is mandatory.
- We want full control over what reaches client components.

When to reconsider `next-intl`:

- Many pages/locales.
- Complex ICU messages, pluralization, date/number formatting.
- Translation management workflow with tooling.
- Strong need for standardized locale routing helpers.

If using `next-intl` later:

- Keep translations in Server Components where possible.
- Do not render a global `NextIntlClientProvider` with all messages.
- If a Client Component needs translations, use `messages={null}` globally and wrap only the small subtree with picked messages.
- Prefer passing translated labels as props from Server Components.

This follows next-intl's performance guidance: server-side internationalization keeps messages and i18n library code out of the client bundle, while passing all messages to client providers can increase markup/JS work and hurt interaction metrics.

## Link Generation

Create a small route helper so locale URLs stay consistent.

Example shape:

```ts
type PageKey = 'home' | 'opero' | 'solutions' | 'about' | 'contact';

export function localizePath(locale: Locale, page: PageKey) {
  if (page === 'home') return locale === 'en' ? '/' : '/pl';
  const slug = page;
  return `/${locale}/${slug}`;
}
```

Rules:

- Use this helper for nav, language switcher, and CTAs.
- Do not hand-type locale URLs throughout components.
- Keep English and Polish URL maps explicit if Polish slugs become localized later.

## Localized Slugs

Launch recommendation:

- Keep shared slugs for both languages: `/en/opero`, `/pl/opero`, `/en/solutions`, `/pl/solutions`.

Why:

- Lower implementation risk.
- Easier sitemap/hreflang mapping.
- Keeps first launch focused on content quality and CWV.

Future option:

- Localize slugs later, for example `/pl/rozwiazania`.
- If we do, maintain a central URL map and redirect strategy outside static export if needed.

## Language Switcher

Behavior:

- On `/`, Polish switch points to `/pl`.
- On `/pl`, English switch points to `/`.
- On `/en/opero`, Polish switch points to `/pl/opero`.
- On `/pl/opero`, English switch points to `/en/opero`.

Implementation:

- Prefer a static link-based switcher.
- No browser language detection.
- No cookies required for launch.
- If a mobile dropdown needs client interactivity, pass only the current page's two localized hrefs and the visible labels.

## Static Export Compatibility

Allowed:

- Explicit static route files.
- Static imports from `content/en/*` and `content/pl/*`.
- Server Components rendering localized content.
- Static language switcher links.
- Static metadata per route.

Avoid:

- Middleware/proxy locale detection.
- Runtime redirects based on `Accept-Language`.
- Cookies for locale selection.
- Request headers for locale selection.
- Server Actions for locale switching.
- Dynamic locale route that depends on request-time data.
- Large client translation providers.

## Implementation Plan

1. Create locale config and route helper.
2. Create `content/en` and `content/pl` dictionaries by page.
3. Move approved English content from Step 4 into `content/en/home.ts`.
4. Create Polish homepage content in `content/pl/home.ts`.
5. Implement `/` and `/pl` home routes using shared static components.
6. Prepare `/en/*` and `/pl/*` routes when building supporting pages.
7. Make header/footer receive locale and localized links from server-side helpers.
8. Keep mobile nav, if any, as a tiny Client Component with only needed labels/links.
9. Verify `npm run build` still exports static files for both languages.
10. Inspect output/client bundle to ensure dictionaries are not shipped wholesale.

## Testing Checklist

- `/` renders English homepage.
- `/pl` renders Polish homepage.
- Non-homepage nav links use `/en/...` or `/pl/...`.
- No `/opero`, `/solutions`, `/about`, or `/contact` pages are generated.
- Language switcher maps equivalent pages correctly.
- HTML `lang` attribute is correct for English and Polish pages.
- Build output contains static files for localized routes.
- Client components do not receive full dictionaries.
- No middleware/proxy is introduced.
- No internal API route is introduced for localization.

## Step 4.5 Localisation Acceptance Criteria

Localisation can be considered ready when we agree that:

- `/` is the English homepage.
- `/pl` is the Polish homepage.
- All non-homepage URLs are locale-prefixed.
- Explicit static routes are preferred for launch.
- Locale is derived from URL, not browser language detection.
- Translation dictionaries are route/section scoped.
- Server Components render translations by default.
- Client Components receive only the exact strings/links they need.
- No global translation provider ships all messages to the browser.
- Static export compatibility remains mandatory.
