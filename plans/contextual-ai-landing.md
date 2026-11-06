# Contextual AI landing page: rebuild plan

Route: `/en/opero/contextual-ai` (PL: `/pl/opero/kontekstowe-ai`).
Status: skeleton in progress. Placeholders are marked `[SHOT-n]` (screenshot) and `[ANIM-n]` (animation).

**Product facts confirmed by Konrad (2026-11-04), these override anything else in this plan:**
- There is **no in-app chat**. The agent is **Claude or any other MCP-compatible agent** connected to Opero. The chat happens in the agent; the results land in Opero. AI steps inside rules are a separate, real in-product feature, so never say Opero has no AI built in.
- **Building** is for consultants and admins, or end users with an administrative licence.
- **Asking about live data** also happens through the agent, not in the app. MCP access is an optional licence module; once a company has it, anyone can connect for runtime data.
- **The customer chooses the model.** Opero provides the MCP connection, so the customer decides which agent and model to use, and therefore where data is processed.
- **Proof for now:** no customer example yet, but KodaSoft uses Opero MCP itself ("we use it ourselves and we love it"). Do not add numbers until there are real ones.
- Headline approved: "Say what you need. Opero builds it."

---

## 1. Landing page principles we follow

1. **One page, one job.** The job is "book a demo". Every section either builds desire or removes a doubt. No section exists only to list a feature.
2. **Show, don't list.** Visitors scan. The demo animations carry the story. The copy only labels what they are watching.
3. **Narrative arc: problem → turn → proof → trust → action.** It works better than a features grid because the reader recognises their own problem before we name the fix.
4. **Benefit in the headline, mechanism in the body.** "Ask for it. It appears." beats "Natural-language configuration assistant".
5. **The prompt is the hook.** Real prompts in quotes ("Show the last 5 invoices for this client") make the value concrete in one line and let readers picture themselves typing.
6. **Handle objections right after the wow moment.** That is when doubts come up: "Will it break things? Can it see data it shouldn't? Is it a black box?"
7. **The CTA comes back in context.** Hero, after the signature demo, after trust, and at the end. Same action, wording that matches the moment.
8. **Specific beats superlative.** "Validated before it saves" is more convincing than "powerful AI".

### Magic vs. our positioning
`step-1-positioning-and-message.md` says *"Make AI practical and operational, not magical."* The user wants it to **feel** like magic. Resolution: **the visuals deliver the magic, the copy stays concrete.** The page shows effortless results (a sentence becomes a working block on the page) and then explains plainly why it works (it knows your data model, permissions and rules). Words like "magic" and "revolutionary" never appear in the copy. "It just works" is earned by the demos.

---

## 2. Core message

**Big idea:** *Connect Claude to Opero and say what you need in plain words. It builds it inside your system, with your data, and it keeps working for the whole team.*

Three verbs carry the whole page:

| Act | What the user does | What Opero does | Feature behind it |
|---|---|---|---|
| **Ask** | "Show me the last 10 orders over 5,000 PLN" | Answers from live data, within the user's permissions | Contextual data access, saved queries |
| **Build** | "Add a block to the client page with their open invoices and a 'Remind' button" | Creates a custom HTML block with a query, actions and styling, previews it and places it on the layout | Custom blocks, view layouts, rules, objects, forms |
| **Keep** | Nothing: they just come back tomorrow | The block fetches fresh data at every render, refreshes live, and a fix updates every page that uses it | Runtime queries, `refresh` / live topics, library blocks |

Approved headline: **"Say what you need. Opero builds it."**

---

## 3. Page structure (story order)

### S1. Hero: the promise + the wow, above the fold
- H1: **"Say what you need. Opero builds it."**
- Sub: "Connect Claude to Opero and describe a view, a rule or a report in plain words. It works with your real objects, fields and permissions, so what it builds lands inside your system and stays there."
- CTAs: `Book a demo` (primary) · `Watch it build a block` (anchors to S3)
- **[ANIM-1] Hero, built as `components/layout/demos/AiHeroDemo.tsx`:** "the sentence becomes the interface". The request is typed into a message box addressed to the reader's own agent (never a chat inside Opero) and sent; no sparkles or glow. The request is set as large type on its own, with the page out of sight. A marker highlights each thing it asks for in its own colour, with a label naming what that matches in the system. The unmarked words drop away, the page swings up, and the marked words glide straight to their places in one overlapping move and dissolve into the parts they named (title, overdue pills, button). The matching colours on the page carry the link between word and UI. The story starts when the reader presses send, plays once and stays on the finished block. The page swings up in 3D into a gentle tilt, like the dashboard on the home page, the words land on it at that angle, and the finished page drifts very slightly while in view.
  - Uses GSAP directly, not `DemoStage`: that engine's window, typing, cursor and dots are the look to avoid. It reuses `useStageScale`.
  - `prefers-reduced-motion`: show the final state statically.
- Mock data only, never real tenant records.
- Small trust line under the hero: "Acts with your own permissions · Validated before it saves · No code to write"

### S2. The problem: why AI in business software usually disappoints
Short and empathetic, 3 lines max plus a visual contrast.
- Title: **"A regular AI chat cannot see your system."**
- Three pain points as one-liners (not cards), each a cause and its effect:
  - It has no access to your data, so you paste it in by hand.
  - It does not know your fields and processes, so you explain them every time.
  - It can only give advice. Someone still has to build the result in your system.
- Closing line: "Connected to Opero, the agent sees your data, knows your setup and builds the result itself."
- **[SHOT-1] Split screen, built as `components/layout/demos/AiCompareDemo.tsx` (rough preview):** one window-sized screen holding two narrow, phone-like chats with the same agent and the same question, each at its own pace. The connected side fetches everything itself and answers fast; the manual side is still uploading CSVs and screenshots and explaining columns, and ends without an answer.

### S3. Signature demo: "From a sentence to a block" (the centrepiece)
This is the section that has to be memorable. Sticky, scroll-driven, 4 steps. Text on the left changes as the visual on the right progresses.
- Title (candidate): **"Watch a conversation turn into a working part of your system."**
- **On narrow screens** (under 981px) it is not pinned: it plays by itself in view, with the steps sharing one place under it as a caption, and a four-part progress bar. The mode is rebuilt whenever the width crosses the breakpoint, so a pin never outlives its screen.
- **Built as `components/layout/demos/AiBuildStory.tsx`, which differs from the sequence below:** a pinned, scrubbed X-ray of a block. A regular contractor form tips back to show the system under it (the request itself is quoted in step 1), the matching parts light up, a simplified query lands, a Block layer types out HTML and then CSS while the block takes shape in a live preview under the code, the rule lands and a cursor connects two of its nodes, and the stack clears for the same read-only form, where the new section pops in, the form fading only for that moment before the two read as one page, and its button opens the rule dialog. Helpdesk tables are not queryable through saved queries, so the tickets are a custom object. It uses tickets and SLA, not invoices, so the page does not tell the same story three times. It needs a ScrollTrigger pin, because `position: sticky` does not work under ScrollSmoother.
- **[ANIM-2] Scroll-driven sequence** (GSAP is already in the repo: `GsapRevealRoot`, `useGsapReveal`):
  1. **You ask.** Chat bubble: *"On the contractor page, add a panel with open invoices, total overdue, and a button to send a reminder."*
  2. **It understands your system.** Chips fly out of the prompt and land on real names: `Contractor`, `Sales invoice`, `due_date`, `status = open`, `Rule: Send payment reminder`. This visualises the "contextual" part: it maps words onto *your* model.
  3. **It builds and checks.** A code panel slides in briefly: Liquid HTML, a query, a `run-rule` button. A green `Validation passed` check appears. The code is shown **briefly and at an angle**: the message is "real code exists, you never have to touch it", not "you will write code".
  4. **It's live.** The panel lands on the contractor layout with real-looking data. A cursor clicks "Send reminder" → rule dialog opens prefilled.
- Below the sequence, one line: "You can open and edit everything it made: HTML, CSS, queries. Nothing is a black box."
- **[SHOT-2]** Real screenshot of a custom block in the block library (code + preview side by side) as a fallback / complement.
- CTA (inline, secondary style): `See it on your own data → Book a demo`

### S4. Three acts: Ask · Build · Keep
Alternating text/visual rows (reuse `StorySection` pattern from `NoCodeFeaturePage`). Each row has: a benefit headline, 2 sentences, 3 example prompts as "prompt chips", one visual.

**01 Ask: live answers from your data**
- Headline: **"Ask about your data like you'd ask a colleague."**
- Asked in Claude, not in the app; the answer is in the chat.
- Body: answers come from the current data in your instance, scoped to what your role can see. You get real names, amounts and dates from your records, not a generic summary.
- **[ANIM-3]** Built as `components/layout/demos/AiAskDemo.tsx` (what floats, and where, is in `aiAskTools.ts`). The point is not that an agent can query a database, which any agent can, but that it can choose from everything in Opero. The question is asked in the middle, over 28 things floating at three depths: records, lists, reports, rules, templates, all real parts of Opero. The box rises and the question goes out through them as a pulse that pushes them aside as it passes. For each part of the question, marked in its own colour, lines run from those words to four things that might help, and all four are measured at once: scores count up together, the weakest stop first and drop out, and the highest is caught, pushing its neighbours aside, and shows what it found. Each find is joined to the last, so the route is a shape among everything else. Each question needs four pieces put together, and no single record answers it: a promise that depends on the client, the service, the team's calendar and unpaid invoices; a reason for non-payment found across the client, invoices, a visit and emails; and who is likely to leave, narrowed from reports through contracts and emails to tickets. The rest falls back, the finds gather into a chain, and the answer comes up. Flat colour throughout, with no glows. It has no block of its own: the section is its stage, on the page's own ground, with the heading above the question and what floats running on past it to the sides of the page. Only the eight tools no question uses float next to the heading or below everything, so no line crosses the text. It has no list of prompts next to it, because it asks the questions itself. Phones keep the canvas, scaled down, because the question has to stay on one line. (Earlier versions: a wall of blank record tiles, too abstract; a short Opero list, not complex enough; a light spreadsheet, which looked like Opero's UI; a dark database view, which made it look like something any agent could do; a still wall of tools, which was not alive enough; a ring hopping between candidates, which looked like roulette and not like working something out; a dark panel next to the text, which kept it in a box apart from the section.)

**02 Build: configure the platform in a conversation**
- Headline: **"Describe the change. It configures the platform for you."**
- Prompts: *"Add a 'Warranty end' date to Assets and show it on the form"* · *"When a ticket is critical, assign it to the on-call technician"* · *"Make a dashboard for the sales team with this week's deals"*
- Body: objects, fields, forms, layouts, rules, workflows, custom blocks and pages. The assistant knows the platform's rules, previews every change and validates it before saving, so you review a result, not a draft.
- **[ANIM-4]** Built as `components/layout/demos/AiConfigureDemo.tsx` (the screens are in `AiConfigureScreens.tsx`). Three things side by side on the section's own ground: on the left what the reader asks their agent, in the middle Opero MCP, and on the right a form or list that already exists. The request is written, a line lights up to the middle, what the agent does ticks off there in plain words, a line lights up to the right, and the screen changes while it is looked at. All three requests change something existing, each in a different way: a field comes in (empty, as a new field is on an existing record), a field moves to the top and becomes required (`required` is a real setting on a field in a view layout), and a list opens up for a new column. They go one under the other below 1100px, because everything is placed from what is measured. There is no prompt list next to it, because it makes the requests itself. (Earlier version: parts of a change riding a line through a validation gate, with one refused and corrected, which was too much to take in.)
- **[SHOT-3]** Rule created by AI in the rules editor (we have `public/opero/ai/ticket-triage-rule.webp`, check if it fits).

### S4b. Connect in three steps (new)
Removes the "how do I even start?" doubt that an MCP-based product raises. Three numbered steps, next to `AiConnectDemo`, which is only about how easy the setup is, so it shows no queries. The agent and Opero sit apart with a wire that does not reach, and one small card under them goes through the setup in place: add Opero, allow it as yourself, connected, ending on an empty box waiting to be asked. Both buttons are in the same spot, so the cursor never moves: two clicks in one place. The steps light up as they play. (Earlier version: Opero as a floor plan the agent walks through, which was about queries and permissions, not about how little setup takes.)
1. **Connect Claude to Opero.** Add Opero as a connector.
2. **Sign in as yourself.** The connection acts as you, with your role's permissions. MFA and SSO requirements still apply.
3. **Say what you need.** Claude reads your configuration and live data and builds what you describe.

### S5. "Why it just works": the explanation behind the magic
This is where we turn wow into trust. 4 compact tiles with icons, each a short heading + one line. This is the only grid on the page.
- **It knows your model.** Objects, fields, relations, forms and rules of *your* instance, not generic software knowledge.
- **It checks before it saves.** Every change is previewed and validated, and a block change that would break a page using it is refused.
- **It respects permissions.** The AI sees and changes exactly what the user's role allows. Same rules as clicking.
- **It's yours to edit.** Everything it builds is standard Opero configuration you can open and adjust.
- **[SHOT-4] optional:** small inline screenshot of a validation result.
- Do not promise versions or rollback for blocks: custom blocks have no versions and a save goes live on every page at once. Layouts do have versions.

### S5b. Proof: "We use Opero MCP ourselves, and we love it"
A short dark band right after the trust tiles. Swap it for a customer example when there is one.

### S7. Prompt gallery: "If you can say it, you can ask for it"
Static, with no animation at all. Four plain headings for what people want (find something out, change what you see, stop doing it by hand, see the big picture), each with four things someone might say, as speech bubbles. No product terms: this section shows what you can ask, not how Opero is built.

### S8. Comparison (optional, decide in review)
A compact 3-column ledger, reusing `ComparisonLedger` from the no-code page: *Generic AI chat* / *Custom development* / *Opero contextual AI*, rows: knows your data, result stays live, respects permissions, time to result, who maintains it. Only include it if S2 doesn't already do this job.

### S9. FAQ (objection handling + SEO)
Keep `FaqJsonLd`. Candidate questions:
- Is the AI built into Opero? (No: you connect Claude through MCP. The chat is in Claude, the results live in Opero.)
- Who can build with it? (Consultants, administrators and users with an administrative licence.)
- Does the AI see data my role can't see? (No.)
- Can it break my configuration? (Changes are validated before saving, layouts go through draft and publish with versions, and a block change that would break a page is refused. Block saves themselves go live at once, so don't claim every change waits for a publish.)
- Which model is used and where is my data processed? (The customer chooses the agent and model, so they decide where data is processed.)
- Can I edit what the AI built? (Yes, it is standard configuration: HTML, CSS, queries.)
- Do I need to know code? (No, but developers can go further.)
- Does it work in Polish? **(needs product answer, left out for now)**

### S10. Final CTA
- Title (candidate): **"Tell us one thing you'd like to see in your system. We'll build it live in the demo."**
- This turns the demo into a promise of the same magic, personalised. Strong conversion hook.
- `Book a demo` + reassurance line ("30 minutes · on your use case · no obligation").

### S11. SEO text + related features
Keep the `seoText` block (collapsed / low on the page) and the related links (`noCode`, `lowCode`, `reports`) for internal linking.

---

## 4. Asset and animation checklist

| ID | Type | Content | Can start as |
|---|---|---|---|
| ANIM-1 | Types by itself, waits for the reader to press send, plays once | Hero: the sentence becomes the block | **Done:** `AiHeroDemo` (GSAP) |
| ANIM-2 | Scroll-driven, pinned | The block taken apart: page tips back, system lights up, query/HTML/CSS stack, folds into the live panel, button opens the rule | **First version:** `AiBuildStory` (GSAP + ScrollTrigger) |
| ANIM-3 | Autoplay, starts when centred | The agent finds its route through a floating field of everything in Opero | **Eighth version:** `AiAskDemo` (GSAP), the whole section |
| ANIM-4 | Autoplay, starts when centred | A request goes through Opero MCP and an existing form changes | **Second version:** `AiConfigureDemo` (GSAP) |
| SHOT-1 | Autoplay loop | Split screen: manual uploads vs the agent fetching data itself | **Rough preview:** `AiCompareDemo` (GSAP) |
| SHOT-2 | Screenshot | Block library: code + preview | Placeholder |
| SHOT-3 | Screenshot | AI-created rule in rules editor | Existing `ticket-triage-rule.webp`? |
| SHOT-4 | Screenshot | Validation / version history | Placeholder |
| CONNECT | Autoplay, starts when centred | One card goes through the whole setup in two clicks, and ends connected | **Second version:** `AiConnectDemo` (GSAP) |
| OG | Image | Social share image for the page | Generated OG route |

All screenshots are compressed with `tools/get-low` (WebP) before commit. Animations are HTML/CSS, not video, so they stay sharp, translatable and light. A short real screen recording (`tools/get-low video` → WebM+MP4) can replace ANIM-2 later if we want authenticity.

---

## 5. Implementation approach

Follow the precedent of the no-code page:
- `content/types.ts`: new `AiPageContent` type (hero, problem, signature demo steps, acts, trust tiles, audiences, prompt gallery, faq, final CTA, labels).
- `content/en/features/ai.ts` and `content/pl/features/ai.ts`: add `aiPage` next to the existing `aiFeature` (kept for nav, related cards and metadata).
- `components/layout/AiFeaturePage.tsx` (server component) + small client demo components in `components/layout/demos/` (`AiHeroDemo`, `AiBuildSequence`, `AiConfigDiffDemo`, `AiLiveBlockDemo`). Reuse `PageHero`, `BrowserFrame`, and the shared `components/layout/FeaturePageSections.tsx` (`ScreenshotPlaceholder`, FAQ, related, final CTA), the `StorySection` pattern and `ComparisonLedger` if S8 stays.
- Both route files (`app/(en)/en/opero/[slug]/page.tsx`, PL equivalent): add an `ai` branch like `noCode`, and point `FaqJsonLd` at the new FAQ.
- Static, server-first; animation JS only in the demo islands; reduced-motion fallbacks; check Lighthouse (LCP is the hero frame, so the hero demo renders its first state on the server).
- Read the relevant guides in `node_modules/next/dist/docs/` before coding (AGENTS.md).

Suggested build order: 1) content + types + page skeleton with all placeholders (reviewable story), 2) ANIM-1 and ANIM-2, 3) remaining demos, 4) PL copy, 5) real screenshots, 6) review pass.

---

## 6. Open questions

Answered 2026-11-04: who builds, who asks, in-app chat, which agents, which model, and rewording other pages (see the top of this file).

1. A real customer example or number, when one exists, to replace or sit next to the S5b proof.
2. Does the flow work well in Polish? Left out of the FAQ until confirmed.
3. Can sales build a requested item live in every demo with Claude connected (S10)? The no-code page already promises the same for modules and forms.
