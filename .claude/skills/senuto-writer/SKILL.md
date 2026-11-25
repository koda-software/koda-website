---
name: senuto-writer
description: Drive Senuto (Planner, Writer, Monitoring) in the user's Chrome for kodasoft.pl content. Use when creating a Senuto Writer brief, reading its targets, pasting a draft and reading the Content Score, tuning a text towards 80+, or checking the Senuto content plan. Called by the seo-article skill; also usable on its own.
---

# Senuto Writer for kodasoft.pl

Senuto has no API here. Everything runs in the user's own Chrome through the
claude-in-chrome tools (load `tabs_context_mcp`, `navigate`, `computer`, `find`,
`get_page_text`, `javascript_tool`, `browser_batch` in one ToolSearch). The user
is already signed in; never type passwords. Batch clicks with `browser_batch`.

**Typing quirk:** never send `ctrl+a` to clear a Senuto (or Google) input. It
types a literal "a" (the user has asked about this). Clear a field with its X
button or by triple-click, then type.

## Account facts

- Trial ends around **2026-12-08**. The vault note
  `/kodasoft/kodasoft-vault/website/seo-content-strategy-senuto.md` tracks the
  checklist, the content plan table and whether the user bought a plan. If the
  trial has ended, say so and fall back to the keyword exports in
  `/kodasoft/kodasoft-vault/website/_assets/senuto-2026-11-25/` plus a manual
  look at Google's top results; skip scoring.
- Content plan (Planner): search **42823**, "elektroniczny obieg dokumentów",
  `https://app.senuto.com/content-suite/planner/searches/42823`. Each item has a
  plan id (`/plans/<id>`), e.g. low code 3101019, automatyzacja procesów 3101024.
- Writer folder: **"Opero blog"**. Each new Writer article uses one article
  credit; the remaining count shows in the create dialog ("Pozostały limit").
  Say how many are left when you use one.
- Monitoring project "Opero / kodasoft.pl" (52 phrases, competitors webcon.com,
  intense.pl, amodit.pl, arcus.pl, elo.com).

## Create a brief from the content plan

1. Open the plan item (`.../searches/42823/plans/<id>`), note its phrases and
   search volumes (Przegląd tab; position "-" means we don't rank).
2. Click **Stwórz w Writerze** → "Stwórz i dodaj do istniejącego folderu" →
   folder "Opero blog" → Dalej → **Stwórz** (this spends the credit; the user's
   request for the article is the go-ahead, but report it).
3. The brief collects data for **about 20 minutes**. Get the article id from
   the Writer list (`/content-suite/writer`, click the item) and wait with a
   background `sleep 840` rather than polling. Draft meanwhile.
4. When it opens it may ask to load an existing kodasoft.pl page
   ("Na stronie są treści dopasowane..."). Choose **"Chcę napisać treść od
   nowa"** unless the user wants to tune an existing page in place.

## Read the brief

`get_page_text` on the Writer tab gives: targets (Znaki, Nagłówki, Multimedia,
Linki with ranges) and the active phrases with count ranges ("phrase 0 / 5-8").
Heading terms and question terms sit behind the "Nagłówki (0/N)" and
"Pytania (0/N)" tabs; click each and read the text after it. Save the full
brief (targets, phrases, heading terms, questions) into the article's vault
note so a later session doesn't need another credit.

## Paste a draft and read the score

Write the draft as simple HTML (`p, h2, h3, ul/ol/li, strong, a`, absolute
`https://www.kodasoft.pl/...` links). Then:

```bash
.claude/skills/senuto-writer/scripts/writer-js.sh draft.html
```

Run the printed snippet with `javascript_tool` (`javascript_exec`) on the
Writer tab. It switches to "Źródło HTML", replaces the content, switches back,
waits 10 s and returns `score=NN` plus the goals readout. Writer autosaves.
Never click publish/share in Senuto.

## Where the target ranges come from

Senuto doesn't publish it, but the brief's own "Analiza SERP" tab shows it: the
length, headings, images and links ranges are the minimum to maximum across the
top pages Senuto analysed, and the target is roughly their average. When the
results mix government portals, home pages and long guides the ranges become
meaningless (e-Doręczenia: 1.0K–20.2K characters, links 1–108 from a portal's
navigation). Ignore those four targets; only phrases and heading terms move the
score. Judge the result against the TOP20 scores in that tab.

## What moves the Content Score (learned on five briefs)

- **Phrases used at least once and phrases landing inside their range** are the
  main lever (~0.5 point each).
- **Heading terms** are worth ~1 point each, but only when the term appears
  contiguously inside an h2/h3. Senuto matches some inflections inconsistently.
- **Length barely matters.** Going 30–60% over the character target didn't
  hurt or help. Number of headings, h2 vs h3, images and question terms had no
  measurable effect.
- Senuto counts inflected forms of short phrases, so short phrases read over
  range. That's fine. "low code" and "Low-Code" share one counter.
- The score is `2 × content + headers` with a hidden keyword denominator. On some
  briefs 80 is out of reach: the "low code" brief topped out at 58 with every
  visible phrase and heading term in range. When stuck, check the **Analiza
  SERP** tab: if the current TOP20 score far below us (10–37 there), say so and
  let the user accept, rather than stuffing. Changing the brief's keyword set
  ("Dostosuj słowa kluczowe") is the user's call.
- Tested on the "low code" brief (2026-11-25), none of these broke the ceiling:
  using and activating the 20 inactive words from "Dostosuj słowa kluczowe"
  (58 → 60 only), deactivating the out-of-range main phrase, cutting the main
  phrase from 55 to 27 uses (score fell), adding 7 images (Multimedia 7/7, score
  unchanged). Senuto's own "Stwórz treści z AI" text scored **39** on the same
  brief, so a brief like this simply tops out low; don't burn AI credits to
  check again. The Writer "Analiza SERP" tab has no
  way to exclude competitor pages. The score endpoint
  (`api.senuto.com/api/content_editor/reports/article/score/<id>`) is not to be
  fetched directly from the page; that was blocked once.
- The keyword dialog opens from the "Dostosuj" link **under the keyword chips**
  (the one under "Twoje cele" opens the length/headings targets instead).
  Screenshots only work on the visible tab; use the tab Chrome is showing.

## House rules for briefs

- Natural Polish first; no keyword-stuffed or ungrammatical sentences. Use
  awkward brief phrases ("intuicyjności low code") at most once or twice.
- **Never name direct competitors** (Webcon/WEBCON BPS, Intense, Amodit, Arcus,
  ELO, Comarch BPM, DocuWare, Asseco SEOD, JobRouter, Symfonia, Saldeo,
  Enovatio...). Large general platforms (Microsoft Power Platform, OutSystems,
  Mendix, Salesforce, ServiceNow, Bubble, Webflow, Zapier) may get one neutral,
  factual mention when the brief asks; no claims about their price or quality.
- Skip job-title stuffing (RPA Developer/Analyst...) beyond one sentence.
- Opero facts come only from `content/pl/features/*.ts` (and their FAQ); state
  the limits honestly. Don't invent customers, results or speed multipliers.

## Delegating the tuning

A Fable subagent (`model: "fable"`, `general-purpose`) did the best rewrites.
Give it: the draft path and output path, the full brief (targets, phrases with
ranges, heading terms, questions), which phrases to skip and why, the product
facts files, the lessons above, the Writer tab id and article URL, and the
paste/score recipe. Ask it to report the final score, skipped phrases and any
sentence it is unsure about, and to never publish or share. Read its output
yourself before showing the user.

## Monitoring

After an article goes live, add its main phrases to the Monitoring project if
they aren't there (trial limit 300 phrases), so the weekly check can see them
move.
