# Step 3: Brand Primitives And Design Translation

Purpose: define the concrete visual rules for Koda Soft before any UI implementation. This translates the Stellr reference into an original Koda Soft direction that feels high-tech, expert, precise, and fast.

Decision: use Option B.

> Light premium base with darker technical/system panels, blue-cyan precision accents, and lightweight system diagrams.

## 1. Brand Primitives

### Visual Personality

Koda Soft should feel:

- Precise, not playful.
- Technical, but still understandable to business buyers.
- Premium, but not decorative.
- Confident and calm, not loud or hype-driven.
- Product-grade, not agency-portfolio.
- Systems-oriented: data, workflows, permissions, automation, AI, governance.

The site should visually say:

> These people understand complex company operations and can turn them into dependable software.

### Color System

Use a mostly light interface with dark technical moments.

| Token | Value | Usage |
| --- | --- | --- |
| `--color-ink` | `#02020d` | Primary text, dark hero/panels, deepest contrast. |
| `--color-ink-soft` | `#202232` | Secondary dark surfaces and calmer headings. |
| `--color-muted` | `#6f7076` | Body copy, supporting text, metadata. |
| `--color-muted-light` | `#c0c2c6` | Dark-panel secondary text, hairlines, quiet labels. |
| `--color-paper` | `#ffffff` | Main page background. |
| `--color-paper-soft` | `#f9f9f9` | Alternating sections and card backgrounds. |
| `--color-blue` | `#0067f4` | Primary CTA, active state, key system nodes. |
| `--color-blue-soft` | `#76b9fc` | Hero glow, gradient edges, diagram highlights. |
| `--color-blue-deep` | `#1f26aa` | Dark gradient support, deeper technical accent. |
| `--color-cyan` | `#7ee7ff` | Sparse diagram accent, AI/search/automation highlights. |
| `--color-signal` | `#9ee37d` | Optional system-state accent, used very sparingly. |
| `--color-border-light` | `rgba(2, 2, 13, 0.12)` | Borders on light surfaces. |
| `--color-border-dark` | `rgba(255, 255, 255, 0.12)` | Borders on dark surfaces. |

Color rules:

- Keep blue as the primary accent. It should feel precise and technical.
- Use cyan and signal green only inside diagrams, status details, or tiny highlights.
- Avoid purple-first SaaS gradients.
- Avoid full dark-mode site; use dark sections as contrast and authority.
- Keep backgrounds mostly clean so technical diagrams and copy can breathe.

### Gradient And Atmosphere

Hero and technical panels should use restrained gradients:

```css
background:
  radial-gradient(circle at 50% -20%, rgba(118, 185, 252, 0.48), transparent 34rem),
  radial-gradient(circle at 78% 12%, rgba(31, 38, 170, 0.34), transparent 28rem),
  #02020d;
```

Texture direction:

- Use subtle grid/plus/noise texture via CSS or tiny SVG only.
- Texture opacity should be low enough to feel engineered, not decorative.
- No canvas liquid gradient for launch.

### Typography

Primary recommendation:

- Use `Geist` for the main type system if we can load it efficiently.
- Use `Geist Mono` or another compact mono only for diagram labels, system states, small code-like annotations.
- Keep font weights limited for performance: 400, 500/600, 700.

Type scale:

| Role | Desktop | Tablet | Mobile | Notes |
| --- | --- | --- | --- | --- |
| Hero heading | `clamp(3.4rem, 7vw, 5.25rem)` | fluid | `3rem` floor acceptable | Tight, confident, negative tracking. |
| Section heading | `clamp(2.4rem, 4vw, 3.25rem)` | fluid | `2.1rem` | Clear and spacious. |
| Card heading | `1.25rem - 1.5rem` | same | `1.15rem - 1.3rem` | Strong but not oversized. |
| Hero body | `1.25rem - 1.375rem` | `1.15rem` | `1.05rem` | 140-150% line-height. |
| Body | `1rem - 1.125rem` | same | `1rem` | Comfortable reading. |
| Label/nav | `0.75rem - 0.875rem` | same | same | Slight positive tracking. |

Type rules:

- Headings: `line-height: 0.98 - 1.1`, `letter-spacing: -0.04em` for hero and `-0.02em` for sections.
- Body: `line-height: 1.45 - 1.6`.
- Labels: uppercase or compact title case, `letter-spacing: 0.06em - 0.1em`.
- Avoid bland default SaaS type. Even if Geist is used, make it intentional through scale, spacing, and contrast.

### Spacing And Layout

Breakpoints:

- Mobile: below `810px`.
- Tablet: `810px - 1199px`.
- Desktop: `1200px+`.

Shell:

- Max width: `1440px`.
- Page gutters: `14px` minimum, preferably `20px - 24px` on larger screens.
- Inner content widths:
  - narrow copy: `640px - 760px`
  - wide content: `1120px - 1280px`
  - full shell: `1400px - 1440px`

Section spacing:

- Desktop major sections: `96px - 112px` vertical padding.
- Medium sections: `72px - 88px`.
- Mobile sections: `56px - 72px`.
- Hero top spacing must account for transparent header: roughly `132px+` top on desktop.

Component spacing:

- Micro gaps: `4px`, `6px`, `8px`, `10px`, `12px`.
- Component gaps: `16px`, `20px`, `24px`, `32px`, `40px`, `44px`.
- Section gaps: `60px`, `80px`, `100px`.

### Radius, Borders, Shadows

Radius rules:

- Buttons: `4px - 6px`.
- Small cards/chips: `8px - 12px`.
- Large panels: `16px - 24px`, only when needed.
- Avoid making everything pill-shaped.

Border rules:

- Light cards: `1px solid rgba(2, 2, 13, 0.10 - 0.12)`.
- Dark cards: `1px solid rgba(255, 255, 255, 0.10 - 0.14)`.
- Use borders more than heavy shadows.

Shadow rules:

- Shadows should be soft and rare.
- Prefer depth from contrast, gradients, borders, and spacing.

### Header

Header direction:

- Transparent over the dark hero.
- Logo left, nav center/right, CTA right.
- Desktop nav: `Opero`, `Solutions`, `About`, `Book a demo`.
- Mobile nav: simple logo + menu button, avoid complex animation.
- Header max width: align with shell, around `1400px - 1440px`.
- Header padding: compact, likely `14px - 20px` vertical rhythm.

CTA behavior:

- Primary nav CTA can be a blue button on light sections or translucent/white-bordered over hero.
- Keep it crisp: no giant pill, no bouncy animation.

### Buttons

Primary button:

- Blue fill `#0067f4`.
- White text.
- Radius `4px - 6px`.
- Height around `44px - 48px`.
- Optional small arrow glyph/icon.

Secondary button:

- On dark: translucent white with subtle border.
- On light: white/transparent with ink border or soft gray surface.

Interaction:

- Hover can shift background, border, or translate by `1px` max.
- No layout shifts.
- Focus states must be visible.

### Cards And Panels

Card types:

- Light capability card: white or `#f9f9f9`, subtle ink border, compact icon/label, heading, body.
- Dark technical card: `#02020d` or deep navy, blue/cyan diagram lines, white text.
- System node card: small data/workflow/AI modules connected by lines.

Card rules:

- Use clear hierarchy: label -> heading -> short paragraph.
- Avoid bento-grid filler. Every card should explain a real Opero/Koda capability.
- Use icons sparingly; diagrams and labels are more on-brand than generic icon packs.

### Diagram / Visual Language

Primary motif:

> Operations becoming software.

Visual elements:

- Nodes: `Data`, `Forms`, `Workflow`, `Rules`, `Access`, `Audit`, `Search`, `AI`.
- Connectors: thin blue/cyan lines with low opacity.
- Cards: structured records, schema fields, permissions, steps, events.
- Labels: small mono annotations.
- Status states: `mapped`, `approved`, `automated`, `visible`, `assisted`.

Rules:

- Diagrams should be understandable at a glance.
- Avoid fake code walls.
- Avoid screenshots unless they are real and useful.
- Build visuals in CSS/SVG/HTML for CWV.

### Motion

Motion principle:

> Feel alive, but never expensive.

Allowed:

- CSS hover transitions.
- Gentle opacity/transform reveal if implemented without layout shift.
- Subtle gradient/background movement only if CSS-only and cheap.

Avoid:

- Canvas/WebGL animation.
- Smooth-scroll libraries.
- Heavy Framer-style motion packages.
- Scroll-jacking.
- Animations required to understand content.

## 2. Stellr-To-Koda Soft Translation

| Stellr Pattern | Koda Soft Translation |
| --- | --- |
| Dark hero with blue radial gradient | Keep the dark technical hero, but make the visual about Opero mapping company operations into software. |
| `Build software that feels precise and dependable.` | Use our approved line: `Turn the way you work into software.` |
| AI/SaaS infrastructure label | Use a label like `Adaptive ERP by Koda Soft` or `Flexible business software powered by AI`. |
| Platform / Solutions / Pricing / About / Blog nav | Use `Opero`, `Solutions`, `About`, `Book a demo`. No pricing yet. |
| Generic AI startup story | Replace with flexible ERP, custom workflows, governance, and practical AI assistance. |
| Fake metrics/testimonials/logos | Do not use until real. Build trust through product capability and engineering clarity instead. |
| Liquid/canvas gradient | Replace with CSS radial gradients and lightweight SVG/grid texture. |
| Heavy Framer runtime/motion | Replace with static Next.js, CSS, and minimal client JS. |
| Use-case cards for AI/SaaS segments | Use cards for contractors, custom operations, approval workflows, reporting/search, internal tools. |
| Three-step `Input -> Intelligence -> Output` | Adapt to `Map -> Model -> Automate -> Govern -> Improve`. |
| Trust/security/infrastructure block | Use Koda Soft credibility: architecture, maintainability, permissions, auditability, product-quality execution. |

## 3. Homepage Visual Flavor

Approved flavor: Option B.

Name:

> Light technical premium with dark system depth.

What it means:

- The first viewport is dark, precise, and high-tech.
- Most content sections are light, readable, and premium.
- Dark panels return at important moments to explain systems, workflows, architecture, and AI.
- Blue/cyan accents carry the technical identity.
- The page should feel designed, but not like a template.

Homepage structure implication:

1. Dark hero with transparent header and system-map visual.
2. Light problem section with strong editorial heading.
3. Light/dark mixed capability cards for Opero pillars.
4. Dark technical panel showing how operations become software.
5. Light use-case cards.
6. Koda Soft expertise section with architecture/product-quality emphasis.
7. Final dark or blue-accent CTA.

CWV implication:

- Hero visual must be CSS/SVG/HTML, not video/canvas.
- No runtime animation library for launch.
- Use static generation/export friendly components.
- Keep font loading disciplined.
- Keep above-the-fold assets tiny and predictable.

## Step 3 Acceptance Criteria

Step 3 can be considered ready when we agree that:

- Stellr is the inspiration, not the source code.
- Option B is the visual flavor.
- The palette, type scale, spacing, header, button, card, diagram, and motion rules above are approved.
- Implementation should prioritize CWV over decorative animation.
