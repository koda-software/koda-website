# Step 2: Site Structure

Purpose: define the smallest strong launch website for Koda Soft and Opero before content, visual direction, or implementation.

## Structure Principle

The first release should feel focused and premium, not thin. Each page needs a clear job:

- Explain Koda Soft as the company behind adaptable business software.
- Position Opero as the flagship adaptive ERP product.
- Give enough product specificity to earn trust.
- Move qualified visitors toward a demo conversation.
- Keep the site static-first and easy to expand later.

Recommended launch structure:

```text
/
/opero
/solutions
/about
/contact
```

Optional future structure:

```text
/solutions/[use-case]
/resources
/resources/[article]
/customers
/security
/integrations
```

## Launch Sitemap

### Home

Primary job:

Introduce Koda Soft and Opero with the strongest positioning, then guide visitors toward either the Opero product page or a demo.

Primary conversion goal:

Book a demo.

Secondary goal:

Explore Opero.

Recommended sections:

- Hero: “Turn the way you work into software.”
- Problem framing: companies outgrow spreadsheets, rigid systems, and manual coordination.
- Opero overview: adaptive ERP software shaped around real operations.
- Feature pillars: model operations, automate workflows, add AI where work happens, govern data, search and act faster.
- Product proof: concrete capabilities without overclaiming broad ERP coverage.
- Koda Soft credibility: builder of flexible business systems and long-term implementation partner.
- Final CTA: book a demo.

Static-first notes:

- Fully static page.
- Avoid heavy animation or runtime personalization.
- Use lightweight diagrams or CSS-driven visuals.

### Opero

Primary job:

Explain Opero as the product in more depth: what it is, how it works, and why it is different from rigid ERP.

Primary conversion goal:

Book a demo for Opero.

Secondary goal:

Understand product capabilities.

Recommended sections:

- Product hero: adaptive ERP for custom operations.
- How Opero works: model data, configure forms, define workflows, govern access, add AI assistance.
- Capability groups:
  - Custom modules, objects, fields, forms, and relationships.
  - Workflow rules, triggers, scheduled jobs, updates, notifications, and webhooks.
  - AI-assisted queries, scripts, classification, summarization, and rule steps.
  - Roles, permissions, audit logs, organization isolation, and module controls.
  - Search, saved layouts, dictionaries, API tokens, and advanced lists.
- Concrete example: contractor/vendor/partner management as a safe current module example.
- Implementation framing: built to adapt around company-specific operations.
- CTA: discuss how Opero could model your workflows.

Static-first notes:

- Fully static product narrative.
- Keep future screenshots or diagrams optimized and responsive.
- Do not require app data or live product embedding.

### Solutions

Primary job:

Translate Opero’s flexibility into practical business situations without pretending to cover every industry module out of the box.

Primary conversion goal:

Start a use-case-specific demo conversation.

Secondary goal:

Help visitors recognize their operational pain.

Recommended launch approach:

Use one overview page rather than separate use-case pages at launch.

Recommended solution blocks:

- Replace spreadsheet-driven operations.
- Model custom internal processes.
- Automate operational handoffs.
- Manage contractors, vendors, customers, partners, or other external entities.
- Govern roles, permissions, and auditability.
- Bring AI into operational workflows.

Recommended page structure:

- Hero: flexible ERP for operations that do not fit rigid templates.
- Pain pattern blocks: spreadsheets, disconnected tools, manual checks, unclear ownership, slow reporting.
- Solution cards or bands: each tied to a concrete operational outcome.
- “Best fit” section: companies with evolving workflows, custom records, and governance needs.
- CTA: bring us your workflow.

Static-first notes:

- Launch as one static page.
- Split into `/solutions/[use-case]` later only when enough copy and proof exists for each use case.

### About

Primary job:

Build trust in Koda Soft as the company, product builder, and implementation partner behind Opero.

Primary conversion goal:

Increase confidence before contacting.

Secondary goal:

Explain the product-building philosophy.

Recommended sections:

- Company hero: Koda Soft builds adaptable business systems.
- Philosophy: software should match real operations instead of forcing rigid processes.
- Why Opero exists: flexible ERP foundation for structured data, workflows, governance, and practical AI.
- Craft and credibility: technical depth, implementation care, durable systems thinking, and product-quality execution.
- Partnership angle: understand the workflow, model it carefully, adapt as the company changes.
- CTA: talk to Koda Soft about Opero.

Static-first notes:

- Fully static.
- Avoid vague agency-style claims; keep the story product-led.

### Contact / Book Demo

Primary job:

Give high-intent visitors a clear, low-friction way to request a conversation.

Primary conversion goal:

Submit a demo or contact request.

Secondary goal:

Set expectations for the conversation.

Recommended sections:

- Simple page hero: book a demo of Opero.
- Short qualifying copy: describe the workflow, process, or system you want to improve.
- Contact form fields:
  - Name.
  - Work email.
  - Company.
  - Role.
  - What are you trying to model, automate, or improve?
- Direct email fallback if available.
- Expectation-setting block: Koda Soft will discuss operations, current tools, workflow complexity, and whether Opero is a fit.

Static-first notes:

- Page stays static. Form submission should use an external form endpoint, static-compatible platform form handling, or a dedicated email/demo service integration that does not require a Next.js API route.
- Final implementation must preserve static export compatibility before choosing the form mechanism.

## Navigation

Recommended primary navigation:

- Opero
- Solutions
- About
- Book a demo

Recommended logo behavior:

- Koda Soft wordmark links to Home.

CTA treatment:

- Use “Book a demo” as the persistent primary action.
- Keep “Explore Opero” as a contextual secondary action on Home.
- Avoid “Get started” unless onboarding or self-serve signup exists.

## Page Priority

Launch priority:

1. Home
2. Opero
3. Contact / Book Demo
4. Solutions
5. About

Reasoning:

- Home establishes the quality bar and core story.
- Opero gives enough product detail for qualified buyers.
- Contact captures demand early.
- Solutions helps visitors self-identify pain patterns.
- About supports trust, but should not carry the product story alone.

## Static Now, Expand Later

Static at launch:

- Home.
- Opero.
- Solutions overview.
- About.
- Contact / Book Demo page shell.
- Metadata, sitemap, robots, and Open Graph assets.

Expandable later:

- Use-case detail pages.
- Customer stories.
- Security and trust page.
- Integration page.
- Resource/articles section.
- Product screenshots, interactive demos, or embedded demo videos.
- Polish-language version if Koda Soft wants a local-market path.

## Conversion Map

| Page | Primary Visitor Question | Primary CTA | Secondary CTA |
| --- | --- | --- | --- |
| Home | What is this, and is it relevant to my company? | Book a demo | Explore Opero |
| Opero | Can this product handle the way we work? | Book a demo | See solutions |
| Solutions | Does this match my operational problem? | Book a demo | Explore Opero |
| About | Can I trust the company behind this? | Talk to Koda Soft | Explore Opero |
| Contact | How do I start a conversation? | Submit request | Email directly |

## Claims Guardrails

Use:

- Adaptive ERP.
- Flexible business software.
- Custom operational data.
- Workflow automation.
- Practical AI assistance.
- Roles, permissions, audit logs, and governance.
- Contractor/vendor/partner management as a concrete current example.

Avoid:

- Every ERP module out of the box.
- Fully no-code ERP.
- Instant implementation.
- AI autonomously runs operations.
- Broad integration claims without product evidence.

## Recommendation

Approve a five-page launch site:

```text
Home -> Opero -> Solutions -> About -> Contact / Book Demo
```

The first implementation should still begin with Home after the content, visual, and performance steps are approved. No homepage code should be written during Step 2.

## Open Discussion Questions

- Confirmed route: `/contact` is the launch page for both contact and “Book a demo” CTAs.
- Should Solutions stay fully general at launch, or should it include one named contractor/vendor management example?
- Should the homepage navigation say “Koda Soft” visibly, or should Opero dominate the first viewport more strongly?
- Do we need a Polish-language version soon, or should launch stay English-only?
