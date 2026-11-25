---
name: seo-article
description: End-to-end workflow for an SEO blog article on kodasoft.pl - pick the topic from the Senuto content plan, brief, draft and score, cover and diagrams, Polish and English versions in Opero, schedule, record in the vault. Use when the user says "next plan article", asks for a new or rewritten blog post, asks what to write next, or wants the weekly content check.
---

# SEO article for kodasoft.pl

Goal: steady organic traffic for kodasoft.pl and the Opero platform, Polish
market first, English second. Audience: owners and managers of small and
mid-sized companies (logistics, law firms, retail, property developers).
Competitors: Webcon, Intense, Amodit. Cadence: **at most 2–3 posts a week**.

Track the stages with the task list. Stop at each **checkpoint** and wait for
the user; never publish, schedule or spend paid credits beyond what they asked.

Related skills: `senuto-writer` (Senuto mechanics and scoring),
`vault-notes` (vault conventions), `image-optimization` (get-low).
References: [`references/images.md`](references/images.md),
[`references/opero-publish.md`](references/opero-publish.md).

## 0. Weekly check (when asked "what's next" or for the weekly review)

1. Read the backlog and trial checklist in
   `/kodasoft/kodasoft-vault/website/seo-content-strategy-senuto.md` and the
   `*-draft.md` notes in that folder (`rg -l 'status: (todo|active)'`).
2. List scheduled and draft posts in Opero (`blog/artykul`, status
   `zaplanowany`/`szkic`/`recenzja`, with dates) to see the week's load.
3. If available, glance at Search Console (Performance, last 28 days) and
   Senuto Monitoring for movement on published pieces.
4. Propose the next 1–3 topics with search volume, whether each is a new post
   or a rewrite, and a publication slot. The user picks.

## 1. Research

- Open the plan item in Senuto (see `senuto-writer`) and note the phrases.
- Check our own posts for the phrase (cannibalisation) and the relevant
  product page in `content/pl/features/*.ts`; a blog post should link to the
  product page, not compete with it.
- Create the Writer brief (spends 1 credit; say how many remain) and draft
  while it collects (~20 min).

## 2. Draft and score

- Write the Polish draft as HTML in the scratchpad (`<slug>-v1.html`).
  Structure that has worked: short intro with the problem, definition, how it
  works, comparisons, use cases with the four industries, pros/cons or
  mistakes, "when not to", a numbered "how to start", an **Opero section with
  honest limits**, FAQ, links to 2–4 related posts and the product page, and a
  closing link to `https://www.kodasoft.pl/pl/contact` ("umów prezentację").
- Facts about Opero come only from `content/pl/features/*.ts`; quote limits
  exactly. No invented customers, results or speed multipliers.
- Tune with a Fable subagent towards 80+ (recipe in `senuto-writer`). If the
  brief can't reach 80, compare with the TOP20 scores and let the user decide.
- Read the result yourself, fix doubtful facts or forced phrasing, and save the
  brief, score and decisions in a vault draft note
  (`/kodasoft/kodasoft-vault/website/<slug>-draft.md`, template from
  `_meta/templates/`, see `vault-notes`).

**Checkpoint A: text.** Send the HTML (SendUserFile, render) with the score,
what was skipped and why, sentences worth checking, and the proposed slug,
title, meta title (≤60), meta description (≤160), keyword, category, tags and
publication slot. Typical reply: "Approved, make images".

## 3. Images

Follow `references/images.md`: two **different cover concepts** from Runware
FLUX that each show the article's subject (not a generic office; vary the shot
from recent covers listed there), 2–3 minimal diagrams from the HTML templates,
all checked visually before sending. After the user picks, record the chosen
cover in the list in `images.md`.

**Checkpoint B: images.** Send them; the user picks a cover ("B") and approves
or corrects the diagrams. Redo only what they reject.

## 4. Opero

Follow `references/opero-publish.md`:
create the record as `szkic` → upload cover and diagrams → place diagrams under
their headings → write the English version (natural English for an
international reader, its own keyword, not a phrase-matched translation) with
English diagrams → leave the editor cleanly.

**Checkpoint C: publish or schedule.** If the user already asked for a
scheduled article and approved text and images, scheduling in the agreed slot
is covered; publishing immediately or changing an existing live post's slug
needs an explicit yes.

Then verify (date via filter, 404 or 200 on both URLs, no clash that week).

## 5. Record

- Update the vault draft note: status line with record id, URLs, schedule,
  where each image went, English keyword; copy final WebPs to
  `_assets/<topic>/` and `_assets/<topic>/en/`; mark the item in the content
  plan table in `seo-content-strategy-senuto.md`.
- Commit and push the **vault** repo (`git -C /kodasoft/kodasoft-vault pull
  --rebase` first). Never mix vault changes with koda-website commits, and
  don't create Markdown docs in koda-website.

## 6. After it goes live

- Offer to request indexing for the new PL and EN URLs in Search Console
  (about 10 requests a day per property).
- Add the main phrases to the Senuto Monitoring project (see `senuto-writer`).

## Rewriting an existing post

Same stages, on the existing record: keep its id, decide slug with the user
(PL slug changes get an automatic 301, EN don't), replace the generic cover,
update `$i18n.en` too, and request reindexing once the change is live.
