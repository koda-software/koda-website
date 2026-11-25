# Blog images: cover and diagrams

Every image goes to the user for approval before upload. Show options as files
(SendUserFile, `display: render`), at most two cover options and the diagrams
as a set.

## Style rules (from the user's feedback)

- **Minimal text in images.** Text belongs in the article. Diagrams carry short
  labels only; never paragraphs, never a headline baked into the picture.
- **Realistic and logical.** Mockups must look like a plausible screen or flow;
  a comparison must show exactly the difference the text describes, nothing more.
- **Opero-only logo** in app mockups (top-left of a mocked app). The small
  "opero | kodasoft" mark sits bottom-right on diagram frames.
- **Step diagrams are minimal tiles:** number, icon, two or three words. No
  descriptions under the tiles. Keep the last tile's label short enough to fit
  (e.g. "Review monthly", not "Adjust after a month").
- Icons must sit inside their shapes (a check mark overflowing its circle was
  rejected).
- 2–3 diagrams per article; place each under the heading it explains.

## Cover (Runware, FLUX 3)

Runware MCP (server `06852363-…`, tool `run`; load with ToolSearch). If the
server needs auth, tell the user to authorise it via /mcp. If the account is out
of credit, ask the user to top up; don't switch models without asking.

**The cover must show what the article is about, not a generic office.** The
user rejected a run of covers that were all "two people at a desk looking at a
monitor". Before prompting:

1. Name the article's core idea in one sentence (low code = building an app
   from ready blocks instead of writing code).
2. Pick a concrete, photographable scene that shows that idea, or the moment it
   pays off, e.g. paper cards on a table rebuilt as an app on a tablet (low
   code); a damage report filled on a tablet next to a crushed box in a
   warehouse (complaints); a stack of paper invoices next to a phone approving
   one (invoice workflow).
3. Vary the shot from recent covers (see the list below): change at least two
   of setting, shot type (overhead / close-up of hands / wide / single person
   in the field), number of people and props. Avoid the desk-and-monitor
   two-shot unless the article is literally about that.
4. Generate **two different concepts** (one image each), not two takes of the
   same prompt, so the user chooses between ideas.

Covers used so far (newest first; add each chosen cover here):

| Article | Chosen cover |
|---|---|
| low code | overhead: hands laying paper cards into a flow, same flow rebuilt as an app on a tablet, printed spreadsheet (option D, warehouse leader with tablet and crushed box, not used) |
| automatyzacja procesów | two people at a desk, warehouse behind glass, he points at the monitor |
| obieg dokumentów (EOD) | office manager hands over a contract, colleague shows the register on a laptop |
| obieg faktur | finance manager at a laptop, colleague leans in, paper invoices |
| e-Doręczenia | (older cover, office scene) |

- Model `bfl:flux@3-image`, `width 2736`, `height 1536`, `numberResults 1` per
  concept, `outputFormat PNG`, `settings {"grounding": false}`, `includeCost true`
  (about $0.10 per image).
- Prompt pattern (English): *Editorial documentary photograph / overhead
  editorial photograph … <the concrete scene for this article> … <one or two
  props that carry the idea>. Screens show soft, out-of-focus content, no
  readable text. Natural light, shallow depth of field, muted desaturated colors
  with cool shadows and subtle film grain, calm mood. Authentic, unposed, no
  logos, no readable text anywhere.*
- Download the result URLs with curl into the scratchpad, then crop, mute and
  convert:

```bash
.claude/skills/seo-article/scripts/render.sh cover raw-a.png out/ <slug>-okladka-a
.claude/skills/seo-article/scripts/render.sh cover raw-b.png out/ <slug>-okladka-b
```

  (1600×900, saturation 0.72, WebP via get-low; ~70–140 KB.)
- Alt text describes the scene and starts with the article's topic, e.g.
  "Automatyzacja procesów biznesowych: pracownik magazynu pokazuje…".

## Diagrams (HTML → headless Chromium)

`assets/diagrams/` holds the pages used so far. Each is a 1200×675 page whose
frames are `<section class="frame" id="…">`, shown via `:target`. They share
the colour tokens, Inter/Sora fonts, an inline icon set (`data-i="…"` → SVG)
and the embedded logo. Copy the closest one into the scratchpad and edit:

| File | Frames | Reusable pieces |
|---|---|---|
| `apb.html` | a1 workflow vs rules, a2 four tool types, a3 five step tiles | two-panel comparison, type cards with "Opero" tag and greyed others, numbered step tiles |
| `eod.html` | e1 stages, e2 documents that start a workflow, e3 register mockup | stage chain, document cards, app register mockup with Opero sidebar |
| `faktury.html` | f1 stages, f2 approval thresholds, f3 KSeF → workflow → ERP, f4 invoice register | threshold ladder, three-box flow, table mockup |
| `lc.html` | l1 layer stack with no-code/low-code brackets, l2 config-vs-code bars, l3 four step tiles | stacked layers with side brackets, three cards with proportion bars and a legend |
| `real.html` | d1 offices vs offices + companies, d2 timeline, d3 steps, cal calendar, d4/d5 | before/after comparison, timeline, calendar, inbox mockup |

When copying CSS between pages, rename classes that clash (`.st`/`.stg` and
`.mid` clashes broke pages). Keep colours consistent with any legend. Data in mockups must be plausible and anonymous (no real
company names, generic suppliers like "Dostawca IT").

Render, resize to 1600×900 and convert in one go:

```bash
.claude/skills/seo-article/scripts/render.sh diagram page.html out/ a1:workflow-i-reguly a2:rodzaje-automatyzacji a3:jak-zaczac-5-krokow
```

Look at every output (Read the WebP) before sending it. Final files ~20–40 KB.

## English diagrams

Write a `pairs.json` with exact Polish → English strings per frame and run:

```bash
.claude/skills/seo-article/scripts/translate_frames.py page.html page-en.html pairs.json
```

It stops on a missing string and lists Polish words left. Use English file
names (`workflow-and-rules.webp`), English mockup data (PLN amounts written
"PLN 12,300.00", English initials) and check label lengths again: English can
be longer.

## Archive

After upload, copy the final WebP files into the vault:
`/kodasoft/kodasoft-vault/website/_assets/<topic>/` and `<topic>/en/`.
