---
name: update-cookie-policy
description: Add, change or remove a third-party service (analytics, marketing pixel, chat widget, video embed, A/B tool...) in the cookie consent registry and the privacy policy. Use when the user passes a service name, e.g. "/update-cookie-policy LinkedIn Insight Tag", or says a new tracking tool, pixel, embed or GTM tag is being added to or dropped from the website.
argument-hint: <service name> [remove]
---

# Update the cookie policy for one service

Input: `$ARGUMENTS`, a service name, optionally followed by `remove`.

The site has one source of truth for everything that needs consent:
`content/consent-services.ts`. It drives the banner's preferences dialog
(`components/consent/`) and the cookie table in section 10 of the privacy
policy (`content/pl/privacy.ts`, `content/en/privacy.ts`). The Polish
policy is authoritative; the English one is a faithful translation kept
section by section.

Your job: research the service properly, record it once in the registry,
make the policy text true again, and tell the user what a human still has
to do. **Never invent a fact.** A cookie name, lifetime, entity or transfer
basis you could not find on the vendor's own pages is written as
`TODO: verify` and reported, never guessed.

## 1. Research

Use the vendor's own pages first, then the browser:

1. **What it is and who provides it to EEA visitors.** The legal entity
   (e.g. "Google Ireland Limited", "LinkedIn Ireland Unlimited Company",
   "Meta Platforms Ireland Limited"), not the brand.
2. **Cookies and storage.** The vendor's cookie table: every cookie,
   localStorage key or pixel it sets, its lifetime and purpose. Note
   first- vs third-party.
3. **Role.** Processor (acts on our instructions, needs a DPA) or
   independent / joint controller (needs that stated in the policy).
4. **Transfers outside the EEA.** Where data goes and on what basis
   (EU-US Data Privacy Framework certification - check
   https://www.dataprivacyframework.gov/list - or SCCs).
5. **Category.** `analytics` (measuring our own site) or `marketing`
   (ads, retargeting, conversion tracking, cross-site profiles). Anything
   that does both is `marketing`. A strictly necessary service (security,
   load balancing, the consent store itself) needs no consent and does not
   go in the registry; describe it in the policy text only.
6. **Consent Mode.** Does its GTM tag support Google Consent Mode
   built-in checks? If not, it must get "Require additional consent" for
   the matching storage type in GTM.

If the browser tools are available, also load the vendor's script on a
blank page and list the cookies it actually sets; prefer the observed list
when it disagrees with the docs, and say so.

Keep every URL you relied on.

## 2. Registry

Edit `content/consent-services.ts` (type `ConsentService` in
`content/types.ts`):

- `id`: kebab-case; `name`; `vendor`: the legal entity from step 1.
- `purpose`, `cookies[].lifetime`, `cookies[].purpose`, `transfer`: both
  `pl` and `en`. Polish in the policy's register (formal, "Państwo"
  where a person is addressed); English as a faithful translation.
- `privacyPolicyUrl`: the vendor's privacy policy.
- `sources`: every URL from step 1.
- Removing a service: delete its entry. If it was the last service in its
  category, the category disappears from the banner by itself.

## 3. Consent version and banner copy

Open `lib/consent/store.ts`.

- **Bump `CONSENT_VERSION`** when the change adds a purpose visitors
  have not agreed to: the first service in a category, or a service in an
  existing category that collects something the banner copy does not cover
  (e.g. session recordings under "analytics"). Everyone is asked again.
- Do **not** bump it for removing a service or for a service equivalent
  to one already disclosed.

Then check the banner copy in `content/pl/common.ts` and
`content/en/common.ts` (`consent.description`, `consent.categories`). It
names what is asked for; make sure it still says only true things (e.g.
the "Nie sprzedajemy danych" / "We don't sell data" line, or a
description that names Google Analytics alone).

## 4. Privacy policy

The cookie table in section 10 updates itself from the registry. The prose
does not. In `content/pl/privacy.ts` first, then the same edits in
`content/en/privacy.ts`:

- section 3 (data sent automatically), 4 (purpose and legal basis: consent
  under art. 6(1)(a) GDPR for anything in the registry), 5 (retention), 6
  (recipients: add or remove the vendor; say processor or controller), 7
  (transfers outside the EEA), 10 (cookies);
- the hero description if the set of services it names changed;
- `updatedAt` to today's date (ISO);
- the header comment of the Polish file if it lists what the site does.

Follow the house style already in those files: no long dashes, "Państwo"
in Polish, short factual sentences.

## 5. Check

```bash
pnpm run type-check
```

```bash
pnpm run lint
```

```bash
pnpm run test:tools
```

If the dev server is available, open `/pl/polityka-prywatnosci` and
`/en/privacy-policy` and check section 10, then clear localStorage and
open the cookie banner's preferences to see the service listed.

## 6. Report to the user

End with:

- what was added, changed or removed, with the source URLs;
- whether `CONSENT_VERSION` was bumped and why;
- every `TODO: verify` left behind;
- what a person must do outside the repo:
  - sign or confirm the vendor's DPA (processors) or record the joint
    controller arrangement;
  - in GTM, give the new tag the right consent setting ("Require
    additional consent" for `analytics_storage` or `ad_storage`) and
    publish the container;
  - remove the tag from GTM when a service is removed.

Do not commit unless asked.
