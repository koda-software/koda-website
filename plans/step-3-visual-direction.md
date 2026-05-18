# Step 3: Visual Direction

Decision: use Stellr as the primary visual reference direction for Koda Soft.

Reference:

- [Stellr live preview](https://stellrtemplate.framer.website/)
- [Stellr marketplace page](https://www.framer.com/marketplace/templates/stellr/)

## Direction Statement

Koda Soft should feel like a high-tech software company that turns complex company operations into precise, dependable software systems.

The website should borrow Stellr's feeling of clarity, precision, trust, and modern technical confidence, then adapt it to Koda Soft and Opero:

> Stellr-style clarity and polish, but with Koda Soft's software-house expertise and Opero's adaptive ERP substance.

## Why Stellr Fits

- It explains complex software without making the page feel dense.
- It uses a modern, technical, premium visual language without feeling like a classic agency site.
- It balances abstract system visuals with readable business copy.
- It frames software around precision, dependability, scale, workflows, and outcomes.
- Its page rhythm fits our planned sitemap: Home, Opero, Solutions, About, Contact.

## What To Borrow

- Light, premium technical atmosphere with dark/high-contrast panels where useful.
- Large confident hero typography with concise supporting copy.
- Soft gradient surfaces, but controlled and not generic purple SaaS.
- Rounded technical cards with sharp hierarchy.
- Diagram-like product visuals instead of stock screenshots.
- Problem-to-solution sections that translate complexity into clarity.
- Capability blocks that explain workflows, systems, automation, data, and AI.
- Use-case cards for real-world business operations.
- Trust-building language around precision, dependability, architecture, and operational control.
- Reusable section rhythm: intro label, strong heading, compact paragraph, structured cards.

## What To Change For Koda Soft

Stellr is a SaaS/AI startup template. Koda Soft is a software company behind Opero. So our adaptation should:

- Lead with Koda Soft expertise and Opero as proof, not a generic SaaS startup narrative.
- Replace AI-startup claims with adaptive ERP and flexible operations software.
- Use real Opero capabilities from Step 0: custom data models, forms, workflows, rules, permissions, auditability, search, and AI assistance.
- Avoid fake metrics, fake testimonials, fake logos, and fake social proof.
- Avoid pricing sections until there is a real pricing strategy.
- Use AI as part of the operating system, not the entire story.

## Visual Primitives

### Color

Recommended palette territory:

- Base: soft off-white / warm white.
- Text: graphite / deep ink.
- Surfaces: pale silver, mist blue, soft glass gradients.
- Accent: precise electric blue or cyan.
- Secondary accent: muted lime or signal green for system states.
- Contrast panels: deep navy/graphite for technical diagrams and CTAs.

Avoid:

- Purple-first SaaS gradients.
- Black-only cyber aesthetic.
- Neon overload.
- Flat white corporate minimalism.

### Typography

Direction:

- Use a confident modern grotesk or technical sans for headings.
- Pair with a compact mono for labels, system states, diagrams, and technical annotations.
- Keep the type system sharp, spacious, and readable.

Avoid:

- Default Inter/Roboto/system-stack blandness unless heavily customized by layout and visual system.
- Overly playful or agency-style display fonts.

### Layout

Direction:

- Spacious first viewport with one strong message.
- Alternating light sections and technical dark/detail panels.
- Grid-based cards with generous spacing.
- Clear section labels and concise blocks of copy.
- Visuals should look like systems: nodes, flows, records, permissions, workflows, AI assistance.

### Motion

Direction:

- Minimal, purposeful, and CWV-safe.
- Use CSS transitions and simple reveal states only when they do not affect layout stability.
- Prioritize fast first paint over animated spectacle.

Avoid:

- Heavy Framer-style scroll effects.
- Continuous canvas/WebGL/particle animation.
- Motion that delays LCP or causes layout shifts.

## Homepage Translation

Stellr hero idea:

> Build software that feels precise and dependable.

Koda Soft adaptation:

> Turn the way you work into software.

Supporting concept:

- Koda Soft builds Opero, adaptive ERP software for companies whose operations do not fit rigid tools.
- Opero turns custom data, workflows, permissions, automation, and AI assistance into one flexible operating layer.

Hero visual concept:

- A calm technical system map showing business inputs becoming structured Opero capabilities:
  - data models
  - forms
  - workflows
  - rules
  - permissions
  - audit trail
  - search
  - AI assistance
- Build this as lightweight CSS/SVG/HTML, not a heavy animated mockup.

## Section Rhythm Inspired By Stellr

Potential homepage flow:

1. Hero: Koda Soft + Opero promise.
2. Problem: modern company operations are too specific for rigid ERP.
3. Solution: Opero adapts around how people actually work.
4. System pillars: model data, automate workflows, govern access, use AI in context.
5. How it works: input -> structure -> automation -> insight -> action.
6. Solutions/use cases: contractors, custom operations, approvals, internal workflows, reporting/search.
7. Koda Soft credibility: software-house expertise, architecture, maintainability, product-quality execution.
8. CTA: book a demo / explore Opero.

## CWV Guardrails

The final website should be inspired by Stellr visually, but implemented differently:

- Static-first Next.js pages.
- No imported Framer/Webflow runtime.
- No heavy animation framework by default.
- Use optimized fonts and few font weights.
- Use SVG/CSS diagrams instead of large videos or canvas effects.
- Keep layout stable: explicit image dimensions, no late-loading layout shifts.
- Prefer server/static components and minimal client JavaScript.

## Open Decision

Before implementation, we should confirm the exact flavor of the Stellr direction:

- Option A: Light technical premium, closest to Stellr.
- Option B: Light base with darker technical panels, slightly more enterprise/system-heavy.
- Option C: Darker command-center version, more dramatic but higher risk of looking like generic AI/cyber SaaS.

Recommended: Option B. It keeps the Stellr cleanliness while giving Koda Soft more depth, expertise, and systems authority.
