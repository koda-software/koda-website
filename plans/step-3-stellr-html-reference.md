# Step 3: Stellr HTML Reference

Source fetched from: https://stellrtemplate.framer.website/
Fetched on: 2026-05-16
Purpose: preserve the useful design implementation clues from Stellr for later Koda Soft UI work, without copying the generated Framer code or importing its runtime.

## Important Copyright / Implementation Note

Do not copy Stellr HTML, generated class names, copy, images, logos, or Framer runtime. This file extracts design-system observations only. Koda Soft should implement its own static Next.js components with similar principles: precision, hierarchy, clarity, and technical polish.

## High-Level Page DNA

- Overall feel: premium technical SaaS/product site with a dark hero, light content body, sharp blue accents, and structured cards.
- Core narrative rhythm: complexity -> clarity -> trust -> use cases -> confidence -> CTA.
- Visual signature: dark first viewport, blue radial/liquid gradient, subtle plus/grid texture, crisp white type, then light sections with dark text and blue accents.
- Best adaptation for Koda Soft: keep the precision and system-storytelling, replace SaaS/AI-startup framing with Opero adaptive ERP and software-house expertise.

## Fonts

Observed font setup:

- Primary heading/UI font: `Geist`.
- Secondary/body fallback observed: `Inter`.
- Geist weights loaded: 400, 500, 600, 700, 900.
- Inter weights loaded: 400, 600, 700.
- Font display: mostly `swap`.

Koda Soft recommendation:

- Use `Geist` or a close technical grotesk for the main type system.
- Keep weights limited for CWV: likely 400, 500/600, 700.
- Consider one mono only for diagrams/labels if needed, but do not over-load fonts.
- Avoid importing all Stellr font weights.

## Breakpoints

Observed Framer breakpoints:

- Desktop: `min-width: 1200px`.
- Tablet: `min-width: 810px and max-width: 1199.98px`.
- Mobile: `max-width: 809.98px`.

Koda Soft recommendation:

- Use practical equivalents:
  - mobile: `< 810px`
  - tablet: `810px - 1199px`
  - desktop: `>= 1200px`
- Keep responsive behavior simple and static-friendly.

## Color Tokens

Observed core tokens:

| Role | Stellr Value | Notes For Koda Soft |
| --- | --- | --- |
| Dark / ink | `#02020d` | Deep almost-black navy; useful for hero and technical panels. |
| Muted text | `#6f7076` | Neutral body/supporting text. |
| Light muted | `#c0c2c6` | Secondary lines, borders, pale copy. |
| Soft section background | `#f9f9f9` | Light gray section base. |
| White | `#ffffff` | Main light background and hero text. |
| Pale blue | `#76b9fc` | Radial gradient highlight. |
| Primary blue | `#0067f4` | Main CTA/action accent. |
| Deep blue | `#1f26aa` | Darker gradient/technical accent. |

Koda Soft adaptation:

- Base: warm white / soft white.
- Ink: keep near `#02020d`, perhaps slightly warmer if needed.
- Accent: use precise blue/cyan, close to `#0067f4` / `#76b9fc`.
- Secondary system accent: optional signal green/lime for diagrams, but use sparingly.
- Avoid purple-first gradients.

## Typography Scale Clues

Observed common sizes:

- Hero-level: `72px`, `64px` appear in CSS.
- Large section headings: `44px`, `35px`, `28px`.
- Body/supporting copy: `22px`, `20px`, `18px`, `16px`.
- Small labels/nav: `14px`, `12px`.

Observed line heights:

- Tight headings: `110%`.
- Compact headings/body: `120%`, `130%`.
- Body/supporting text: `140%`, `150%`.

Observed letter spacing:

- Large headings use negative tracking: `-0.04em`, `-0.02em`.
- Labels can use positive tracking: `.06em`, `.1em`.

Koda Soft recommendation:

- Hero: large, tight, confident, negative tracking.
- Section headings: 44-ish desktop, 35-ish tablet, 28-ish mobile.
- Body: 18-22 for hero support, 16-18 for normal sections.
- Labels: 12-14 uppercase or compact technical labels with slight positive tracking.

## Layout / Spacing Clues

Observed max widths:

- Outer max width commonly around `1440px` / `1400px`.
- Content widths observed around `900px`, `750px`, `640px`, `600px`, `560px`, `488px`, `450px`.

Observed section padding:

- Desktop large sections: `100px 14px`.
- Medium sections: `80px 14px`, `60px 14px`.
- Hero-like top/bottom: `134px 14px 100px`.
- Cards: `44px`, `32px`, `28px`, `20px`, `16px`.

Observed gaps:

- Micro: `4px`, `6px`, `8px`, `10px`, `12px`.
- Component: `16px`, `20px`, `24px`, `32px`, `36px`, `40px`, `44px`.
- Section: `60px`, `76px`, `80px`, `100px`.

Koda Soft recommendation:

- Use a 1440px max page shell with 14-24px horizontal padding.
- Desktop sections can use 96-112px vertical padding.
- Mobile sections should compress to around 56-72px.
- Cards should use 24-44px padding depending on density.
- Keep spacing generous; Stellr works because it does not cram complex ideas.

## Header / Navigation

Observed desktop header:

- Floating/fixed centered container behavior using `translateX(-50%)`.
- Transparent over dark hero at top.
- Logo left, nav center, CTA right.
- Nav items: Platform, Solutions, Pricing, About, Blog.
- Right CTA: Contact us.
- Header border radius: `6px`.
- CTA button radius: `4px`.
- Transparent CTA style: white 12% background, white 12% border, `backdrop-filter: blur(5px)`.
- Logo image ratio: 3:1, source dimension 96x32.

Observed mobile header:

- Logo left, two-line menu icon right.
- Transparent over hero.
- Breaks below `810px`.

Koda Soft adaptation:

- Nav should match our sitemap: Opero, Solutions, About, Book a demo.
- Header can start transparent over hero, then optionally become solid/sticky later if needed.
- Keep CTA as a compact high-contrast button.
- Avoid heavy JS for header behavior in the first version.
- Mobile menu can be simple; consider CSS/light client component only if needed.

## Buttons / Controls

Observed styles:

- Button radius: mostly `4px`.
- CTA blue background: `#0067f4`.
- White hero button: white background with dark text.
- Transparent hero button: rgba white surface/border with blur.
- Buttons often include text plus small arrow/icon.

Koda Soft adaptation:

- Primary CTA: blue fill, 4-6px radius, crisp text.
- Secondary CTA: transparent or white depending on section background.
- Avoid overly pill-shaped SaaS buttons except small icon/social elements.

## Surfaces / Cards

Observed styles:

- Main hero is dark with radial gradient and subtle texture.
- Light content sections use white / `#f9f9f9`.
- Borders often use very low opacity black or white: `rgba(2, 2, 13, 0.12)` and `rgba(255, 255, 255, 0.12)`.
- Radius values are restrained: common `4px`, occasional `10px`, large pills for social icons only.

Koda Soft adaptation:

- Use restrained radii; do not make everything giant-rounded.
- Use subtle borders and shadows only where they clarify structure.
- Technical diagrams can live on dark panels with blue/cyan highlights.

## Visual Effects

Observed effects and assets:

- Dark radial/liquid gradient in hero.
- Plus/grid repeated background texture.
- Canvas-based gradient component.
- Modulepreloads include `motion`, `LiquidGradient`, and `SmoothScroll_Prod`.
- Many Framer runtime modules are loaded.

Koda Soft CWV decision:

- Do not use Framer runtime or equivalent heavy animation bundles.
- Do not recreate canvas/liquid gradient as runtime animation by default.
- Recreate the feel with CSS radial gradients, static SVG, or lightweight pseudo-elements.
- Skip smooth-scroll behavior.
- Use motion only if it is CSS-only and does not affect layout stability.

## Content / Section Rhythm To Borrow

Observed homepage sequence:

1. Announcement/demo bar.
2. Header.
3. Dark hero with label, headline, supporting paragraph, primary/secondary CTA.
4. Problem section.
5. Feature/trust cards.
6. Three-step `How it works`: Input -> Intelligence -> Output.
7. Product/platform explanation section with stats.
8. Use-case cards.
9. Trust/security/infrastructure confidence section.
10. Logos / industry proof.
11. Testimonials.
12. FAQ.
13. Final CTA.
14. Footer with company, solutions, contact links.

Koda Soft adaptation:

1. Optional compact top bar only if useful; otherwise skip for cleaner launch.
2. Header: Opero, Solutions, About, Book a demo.
3. Hero: `Turn the way you work into software.`
4. Problem: rigid ERP cannot match real operations.
5. Solution/pillars: data models, workflows, permissions, automation, AI.
6. How it works: map operations -> structure data -> automate -> govern -> improve with AI.
7. Use cases: contractors, custom operations, approvals, internal workflows, reporting/search.
8. Koda Soft expertise/trust section.
9. FAQ only if we have useful real objections.
10. Final CTA.

## Raw HTML Fetch Notes

- Raw fetched page size: about 429 KB.
- The page is generated Framer output with minified CSS, generated class names, and embedded hydration data.
- It loads many JS modules through `modulepreload`, including Framer, motion, smooth scroll, and liquid gradient modules.
- For Koda Soft, this confirms we should use Stellr as visual reference only and hand-build a lean static version.
