# Publishing a blog article in Opero

The website reads the blog from Opero (module `blog`, object `artykul`). Work
through the Opero MCP (server `651569d3-…`). Since 2026-11-25 it exposes four
tools (load with ToolSearch): `opero_search` (find operations and read their
input schema and guides), `opero_execute` (read operations, run from a small
script: `await opero.call('runtime_records_get', {...})`), `opero_write`
(`{ operation, args }` for one change) and `opero_delete`. Operation names are
the old tool names: `runtime_records_get/list/create/update`,
`runtime_rich_text_outline/read/patch`, `runtime_files_create_upload`, ... If a
session still shows the old per-operation tools and they fail with "not found",
the user must reconnect Opero (/mcp) or start a new session.

## IDs

| What | Value |
|---|---|
| organizationId | `cmo9a2ypn000501qpwrwgpsap` |
| companyId | `b34f2d0e-9b3c-47e8-9431-b6a3c241b984` |
| autor (Konrad Jarosiński) | `d692c99d-773c-4717-8c39-d7df98071c7f` |
| kategoria "Procesy i obieg dokumentów" | `1b5194b6-6146-4428-9d1c-56941954c102` |
| kategoria "Low-Code i No-Code" | `ab7062cc-c165-4c8e-aec2-1b2388a47a3b` |
| kategoria "Przepisy i obowiązki" | `33cab4c1-ec2b-4ef0-82ec-ec02b638e2a3` |
| kategoria "System Opero" | `07279dae-595b-40b5-9834-e820f852e436` |
| kategoria "Branże" | `3691f675-6759-4216-8abf-f8b53f5a13f2` |
| Editor URL | `https://opero.kodasoft.pl/dashboard/kodasoft/custom/blog/artykul/<id>/edit` |

Tags: list `blog/tag` records (`runtime_records_list`, search by name) and reuse
existing ones; create a tag only if the user agrees.

## Before writing: avoid cannibalising our own posts

`runtime_records_list` on `blog/artykul` with `query.search` (`searchMode:
"fuzzy"`) for the main phrase, fields `slug,status,slowo_kluczowe,meta_title,
liczba_slow`. If a post already targets the phrase, propose a rewrite of that
record (same record, optional new slug) instead of a new article.

## Fields

`tytul`, `slug`, `status` (`szkic` / `recenzja` / `zaplanowany` / `opublikowany`
/ `archiwalny`), `data_publikacji` (UTC ISO), `zajawka` (~150–160 chars),
`podtytul` (one sentence), `tresc` (rich text), `meta_title` (≤60), 
`meta_description` (≤160, check with `len()`), `slowo_kluczowe`, `obraz_glowny`
(file), `obraz_alt`, `autor`, `kategoria`, `tagi[]`, `powiazane_artykuly[]`
(2–3 related record ids), `typ_schema` `BlogPosting`. `czas_czytania` and
`liczba_slow` are filled by an Opero rule on create, but an API **update** of an
existing record did not recalculate them: after a rewrite set them yourself
(words / 200, rounded).

English goes under `$i18n.en` with the localizable fields: `tytul`, `slug`,
`zajawka`, `podtytul`, `tresc`, `meta_title`, `meta_description`,
`slowo_kluczowe`, `obraz_alt`.

Rich text: pass `{"format": "markdown", "markdown": "..."}`. Links are absolute
`https://www.kodasoft.pl/pl/...` (EN: `/en/...` with the English slugs: look
them up via `$i18n.en.slug` with `includeI18n: true`; product pages are in
`lib/i18n/features.ts`).

FAQ does not go in `tresc`. The site shows the record's `faq` rows (child object
`artykul-faq`) under the text and builds the FAQPage data from them; questions
written as headings in the body get neither. Write the rows with
`runtime_records_update_aggregate` (`formId: cmsf83o0u003301nu6rv802sd`,
`recordId`, `payload: { clientMutationId, expectedVersion, subordinateObjects:
{ faq: { create: [{ clientId, values: { pytanie, odpowiedz, $i18n: { en: {
pytanie, odpowiedz } } } }], order: [clientIds] } } }`). Answers are plain text;
a link is `<a href="https://www.kodasoft.pl/...">text</a>`. Read existing rows
with `runtime_records_list_subordinate` (`query.root: { type:
"61646a1a-151e-4889-af59-fba5b0265f52", recordId, formId }`, `field: "faq"`).

## Steps

1. **Upload images first** (no browser needed): `opero_write` operation
   `runtime_files_create_upload` with one entry per file: the cover with
   `purpose: "attachment"`, every diagram (PL and EN) with
   `purpose: "rich_text_image"` (WebP/PNG/JPEG/GIF, never SVG). Each entry comes
   back with a one-time ticket (15 min). Upload with curl from the shell:
   `curl -sS -H 'x-opero-upload-ticket: <ticket>' -F 'file=@<path>'
   https://opero.kodasoft.pl/mcp/uploads` → 201 `{ fileId }`. Never print or
   store tickets anywhere else.
2. **Create or update the record in one write**: `runtime_records_create`
   (status `szkic`) or `runtime_records_update` with all PL fields,
   `obraz_glowny: "<cover fileId>"` and `tresc` as Markdown with the diagrams
   inline under their headings: `![descriptive alt](file:<fileId>)`. Then a
   second write with `$i18n.en` (English fields and English `tresc` with the
   English diagram fileIds). Images used in `tresc` join the record's
   attachments by themselves.
3. **Fallback if uploads fail** (no shell, 4xx): the Chrome editor route still
   works: open the editor URL, `file_upload` into the "Obraz główny" input and
   the rich-text toolbar image input, save, then move the appended images with
   `runtime_rich_text_patch`. If you used the editor, leave it cleanly (if it
   shows "Niezapisane zmiany", click **Anuluj** → **Odrzuć**), or a stale tab
   can overwrite later API edits.
4. **Schedule or publish** (only with the user's yes):
   - Scheduled: `status: "zaplanowany"`, `data_publikacji` in UTC (08:00 Warsaw
     = 07:00 UTC in winter, 06:00 UTC in summer). The Opero rule "Blog —
     publikacja zaplanowanych artykułów (CRON)" flips it to `opublikowany`
     every 10 minutes and revalidates the site; the site hides the post until
     `data_publikacji <= now`.
   - Now: `status: "opublikowany"`; an Opero rule sets the date to now when it
     is empty or in the future. The site cache is purged by the Opero webhook.
5. **Verify**: dates serialise as `{}` in API output, so confirm with a
   `runtime_records_list` filter `data_publikacji gte/lte` around the intended
   minute. `curl -s -o /dev/null -w "%{http_code}"` the PL and EN URLs: 404
   while scheduled, 200 once live. Check nothing else is scheduled the same
   week (filter by date range) to keep 2–3 posts a week.

## Rewriting a live post

Updating a published record changes the live page at once; Opero can't schedule
a rewrite of a published record without taking the old post offline. So either
publish the rewrite now (the user decides) or prepare it in a separate draft and
swap later. Keep `data_publikacji` unless the user wants a new date.

## Changing a slug

An Opero rule redirects the old Polish slug (it answered 308). There is no such rule for
English slugs, so keep the English slug unless the user accepts the old EN URL
breaking.

## Known problems

- **Record version conflict** on update: a rule recalculated stats. Re-read the
  version and retry.
- **Upload stuck on "Przesyłanie…"** for one specific file: its exact bytes were
  blocked before reaching the server (likely the Cloudflare WAF). Re-encode the
  file (e.g. render again or `get-low` with different settings) and upload the
  new copy under a `-v2` name.
- Localhost `fetch` from pages in the user's Chrome hangs; inline data instead.
