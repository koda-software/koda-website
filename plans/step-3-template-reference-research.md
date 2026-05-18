# Step 3: Template Reference Research

Purpose: collect available Figma, Framer, Webflow, and HTML templates that could help narrow Koda Soft's visual direction. These are references only. We should not copy a template directly; we should extract the best section logic, visual vocabulary, and content patterns into a custom static Next.js site built for strong Core Web Vitals.

Research lens:

- Focus on software houses, IT companies, enterprise software, AI operations, developer tools, system/security, and technical services.
- Prefer templates that communicate expertise, structured thinking, and product-grade engineering.
- Prefer Figma files or inspectable HTML/Webflow/Framer structures where possible.
- Avoid generic SaaS gloss, neon AI spectacle, template-agency sameness, and heavy interactions that could hurt CWV.
- Fit score reflects usefulness for Koda Soft, not template quality in general.

| # | Template | Format | Why It Might Fit | Useful Patterns To Study | Risks / What To Avoid | Fit |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | [Structa by Loonis](https://www.loonis.co/templates/structa) | Webflow + Figma | Built for IT companies, software studios, digital agencies, and technology-driven teams; strongest direct match for a software-house credibility site. | Structured service pages, project/case-study system, blog/insights, scalable component style, performance/accessibility claims. | Could feel like a generic IT agency if we do not add a stronger high-tech Opero/product layer. | High |
| 2 | [Systema by Pentaclay](https://www.framer.com/marketplace/templates/systema/) | Framer | Aimed at tech companies, SaaS products, system providers, cybersecurity firms, software companies, IT firms, and enterprise software. | Clean high-tech aesthetic, systems/security tone, demo lead capture, clear service/product pages, professional technical hierarchy. | Security/SaaS framing may pull us away from adaptive ERP and software-house expertise. | High |
| 3 | [Source by Isaac](https://www.framer.com/marketplace/templates/source/) | Framer | Strong for AI, enterprise teams, software companies, IT outsourcing, data/analytics, and explaining complex services with credibility. | Service pages, process pages, case-study structure, expert/team pages, crisp enterprise narrative, proof-driven sections. | AI agency framing may be too dominant; avoid sounding like an automation consultancy only. | High |
| 4 | [Stellr by Wize](https://www.framer.com/marketplace/templates/stellr/) | Framer | Built for B2B software teams that need to explain complex products, workflows, infrastructure, integrations, and business outcomes. | Platform/solutions split, complex-product storytelling, workflow/use-case structure, feature-to-outcome mapping. | More product-SaaS than software-house; useful for Opero page structure, less for Koda Soft company voice. | High |
| 5 | [Runlyx by Branderest Studio](https://www.framer.com/marketplace/templates/runlyx/) | Framer | Designed for SaaS, AI, and developer tools; useful for a more technical, engineering-authentic visual layer. | Code panels, runbook examples, integration visuals, feature cards, technical CMS/blog/changelog patterns. | Animated hero and SaaS conversion components could become heavy or generic if copied. | Medium-High |
| 6 | [AgentOS by Wize](https://www.framer.com/marketplace/templates/agentos/) | Free Framer | Useful for explaining AI workflows, operational value, reliability, control, and use cases without pure hype. | Use-case pages, AI workflow explanation, trust-building for non-technical decision makers, book-a-call flow. | Too AI-agent-specific; Koda Soft should present AI as an embedded capability inside Opero, not the whole company. | Medium-High |
| 7 | [SoftCom TNC by TNCFlow](https://tncflow.com/template/softcom-tnc/) | Webflow + Figma + HTML | Created for agencies, IT firms, and software companies; useful because it offers multiple formats and a software-company angle. | Multiple home layouts, service/company pages, simple software-firm positioning, inspectable HTML option. | Likely more conventional agency/portfolio than high-tech expertise unless heavily reinterpreted. | Medium |
| 8 | [Softwin](https://softwin.webflow.io/) | Webflow + Figma available | Software/SaaS template with separate software company, software agency, and software consulting homepages plus request-demo and knowledge-base pages. | Compare the three homepage structures, request-demo page, knowledge-base pattern, service/features pages. | Large template pack may encourage bloated nav and generic SaaS sections. | Medium |
| 9 | [Ditech by Envato](https://elements.envato.com/ditech-it-solution-service-figma-template-ZFVRCJS) | Figma | IT solution/service Figma kit for business, company, corporate, IT service, software, and technology contexts. | Pure Figma design exploration, corporate technical pages, section composition, IT-service visual language. | Envato-style templates can feel stock/corporate; use only for layout comparisons, not brand tone. | Medium |
| 10 | [ITfirm by Themexriver](https://themeforest.net/item/itfirm-technology-it-services-template/43735568) | HTML / Bootstrap 5 | Technology and IT services HTML template for IT service, IT solution, SaaS, software, startup, and app/product contexts. | Static HTML section ideas, multi-home comparison, service pages, contact flow, Bootstrap structure. | Includes heavier legacy pieces like sliders/PHP contact; do not import code directly into the SSG build. | Medium |

## Chosen Direction Anchor

The chosen visual anchor is [Stellr](https://stellrtemplate.framer.website/). It gives us the right mix of precision, high-tech polish, structured product storytelling, and complexity-to-clarity narrative.

Secondary references remain useful, but Stellr should lead the visual direction.

1. Stellr: strongest structure for explaining Opero as a complex product.
2. Structa: useful for Koda Soft as a serious software house.
3. Systema: useful for clean high-tech company/system feeling.
4. Source: useful for expertise, process, and enterprise trust.
5. Runlyx: useful for technical/dev-tool credibility and code/system visuals.

## Direction Suggested By This Research

Koda Soft should not look like a classic creative agency and should not look like a generic SaaS landing page. Based on the Stellr choice, the stronger route is:

> Stellr-style clarity and polish + high-tech software house credibility + adaptive ERP product narrative + visible systems-thinking.

That means the website should feel like it was made by people who understand architecture, workflows, governance, data models, automation, and AI in real business operations.

## Patterns Worth Borrowing

- Serious hero with a system/architecture visual instead of a generic dashboard screenshot.
- Split between company expertise and flagship product proof: Koda Soft as the builder, Opero as the evidence.
- Process sections that show how real operations become flexible software.
- Use-case pages/cards framed around workflows and business outcomes.
- Technical insight/blog structure for future authority building.
- Case-study/project structure prepared for future proof, even if launch starts without public case studies.
- Product sections that explain modules, custom data, forms, workflows, permissions, auditability, search, and AI assistance.
- Contact/book-demo page that sets expectations clearly and stays static-export compatible.

## Patterns To Avoid

- Buying a template and shipping it mostly unchanged.
- Heavy Framer/Webflow animation behavior recreated in a way that hurts Core Web Vitals.
- Giant animated 3D AI objects, particle fields, or scroll-jacking.
- Generic purple SaaS gradients and bento grids without technical substance.
- Pricing tables before pricing strategy exists.
- Fake testimonials, fake logo strips, or fake metrics.
- Too many service categories in navigation.
- Making AI look like the whole business instead of an embedded capability inside Opero.

## CWV Translation Notes

If we borrow visual ideas from these references, the implementation should still be custom and static-first:

- Use SSG/static export friendly pages.
- Prefer CSS, SVG, and lightweight HTML diagrams over video-heavy or canvas-heavy hero effects.
- Keep fonts deliberate but limited; avoid large multi-family payloads.
- Use responsive image sizes and avoid template-style oversized screenshots.
- Treat animation as progressive enhancement, not required content.
- Build section components directly in Next.js rather than importing Webflow/Framer output.

## Decision Questions For Step 3

- Resolved: Stellr is the dominant visual direction anchor.
- Open: choose between light technical premium, light-with-dark-system-panels, or darker command-center.
- Open: decide whether the homepage leads slightly more with Koda Soft expertise or Opero product proof.
