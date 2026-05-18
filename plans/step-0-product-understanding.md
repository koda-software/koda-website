# Step 0: Product Understanding

Purpose: ground the Koda Soft website in what Opero can truthfully do today, using evidence from `../opero-front` and `../erp-core`.

## Product Summary

Opero is shaping up as a flexible, multi-tenant ERP platform where companies can model their own operations instead of being forced into a rigid module set. Its strongest current story is not “one ERP module for every industry,” but a configurable operating system for business data, workflows, permissions, search, and automation.

The most website-ready positioning:

> Opero helps companies turn their real way of working into software: configurable data models, tailored workflows, permissions, automation rules, and AI-assisted business operations in one platform.

## Evidence From Frontend

- Authenticated app shell loads enabled core modules, dynamic modules, organization branding, permissions, and per-org module settings.
- User-facing app areas include dashboard, global search, contractors, custom dynamic modules, settings, dictionaries, members, roles, rules, saved queries, API tokens, profile, and organizations.
- Backoffice supports organizations, users, modules, organization modules, dynamic modules, dynamic objects, fields, forms, dictionaries, queries, roles, rules, queues, search, settings, and audit logs.
- Dynamic module UI exposes custom modules and custom objects through `/custom/:moduleKey/:objectKey` routes, with record list/detail/create/edit pages.
- Backoffice dynamic module builder supports module/object management, field builder, field configuration, object forms, and form editor surfaces.
- Rules UI exists for organization rules and personal rules, with execution history and related-rules surfaces.
- Saved queries and SQL tooling exist, including schema-aware editor helpers and AI-related query generation surfaces.
- The visible core business module today is Contractors; the module framework allows additional modules but the frontend route map only contains a dedicated contractors module route today.

## Evidence From Backend

- Multi-tenant NestJS backend with organizations, users, memberships, invitations, JWT auth, RBAC/permissions, API tokens, audit logs, queues, notifications, storage, health, caching, throttling, and structured logging.
- Module system can enable features per deployment or organization, with module guards and module settings.
- Dynamic modules support custom modules, objects, fields, records, relations, record validation, dynamic forms, public forms, reference search, and runtime dynamic tables.
- Dynamic fields include text, textarea, number, decimal, boolean, date, datetime, select, multi-select, reference, file, email, phone, and URL.
- Custom fields exist for built-in entities, with field sections, display conditions, validation config, dictionaries, user/contractor/custom-object references, and values.
- Rules engine supports triggers for users, organizations, contractors, dynamic records, custom fields, cron, and manual execution.
- Rules steps include fetching saved queries, running scripts, conditions, creating/updating dynamic records, updating users/organizations/contractors/custom fields, notifications, webhooks, AI steps, toggling UI sections/fields, calling rules, logging, saving to context, and waits.
- AI module supports saved-query generation, script planning, script writing, AI rule steps, generation logs, feedback, model settings, and LLM provider adapters for OpenAI, Anthropic, and Gemini.
- Search module supports org-scoped global search through Algolia, including organizations, members, contractors, dictionaries, dynamic modules, dynamic objects, dynamic records, and custom-field matches.
- Query engine supports saved SQL queries, schema discovery, validation, execution, and AI-assisted query drafting.
- Contractor module is deep: contractors, addresses, contacts, bank accounts, documents, external IDs, subscriptions, statuses, VAT/REGON-related integrations, and custom fields.

## Business-Value Feature Inventory

### Flexible Company Data

- Custom modules and custom objects let companies model their own operational records.
- Dynamic fields and relations allow custom data structures without rebuilding the app.
- Dynamic forms let teams shape create/edit/view experiences around real workflows.
- Built-in custom fields extend core entities like contractors, users, and organizations.

### Workflow And Automation

- Rules can react to built-in events, custom-record events, custom-field changes, schedules, or manual actions.
- Rule steps can fetch data, run logic, update records/entities, call webhooks, notify people, invoke AI, and branch through success/failure flows.
- Execution history, statuses, context snapshots, and skipped/failed states make automation inspectable.

### AI-Empowered Work

- AI can draft saved queries from business requirements.
- AI can plan and write computed-value scripts with validation and sandbox testing.
- AI can run inside rules as a step that summarizes, classifies, extracts fields, drafts messages, decides yes/no, transforms data, analyzes risk, or follows a custom prompt.
- LLM configuration is modular, with multiple provider adapters and per-module settings.

### Operational ERP Foundations

- Multi-tenant organization model with users, memberships, invitations, roles, and permissions.
- Contractors/customers/vendors-style module with rich subresources and custom fields.
- Dictionaries for controlled data values.
- Saved table layouts and advanced list querying for operational screens.
- Global search across built-in and custom data.
- API tokens for programmatic access.

### Trust, Control, And Governance

- Audit logs record mutating activity.
- RBAC and permission checks separate organization roles from platform/system admin authority.
- Module enablement controls which features are available per organization.
- Rate limiting, caching, health checks, observability, queues, and typed OpenAPI contracts support production-grade operation.

## Strongest Safe Product Promises

- Opero adapts to company workflows through configurable modules, objects, fields, forms, rules, and permissions.
- Opero can model custom operational data, not only fixed ERP tables.
- Opero combines structured business records with automation and AI-assisted work.
- Opero supports AI in practical places: query generation, script generation, and rule steps.
- Opero gives teams governance around who can see, change, automate, and audit business data.
- Opero is built for multi-organization / multi-tenant operation.

## Claims To Avoid Or Treat Carefully

- Avoid claiming Opero already covers every ERP domain end-to-end. Current dedicated core module evidence is strongest for contractors plus configurable custom modules.
- Avoid claiming no-code for everything. The product has low-code/no-code surfaces, but scripts, SQL queries, and admin/backoffice configuration are still part of the power story.
- Avoid claiming AI autonomously runs the company. Safer: AI assists with queries, scripts, automation steps, analysis, classification, and workflow acceleration.
- Avoid promising instant implementation. Safer: flexible implementation, faster adaptation, and fewer rigid-code changes.
- Avoid naming integrations too broadly. Evidence supports VAT/REGON-related services, webhooks, API tokens, LLM providers, Algolia search, email/notifications, storage, and queues.
- Avoid presenting all backoffice/admin tools as regular end-user features. Some are implementation/admin surfaces.

## Website Messaging Implications

- Lead with flexibility and fit: “software that bends around how your company works.”
- Make AI practical, not magical: “AI inside workflows, queries, and operational decisions.”
- Present Opero as a configurable ERP platform, not a single fixed ERP package.
- Use concrete examples: custom objects, dynamic forms, permissions, automation rules, contractor records, search, audit trails.
- Position Koda Soft as the builder of adaptable business systems, with Opero as the flagship product.

## Suggested Homepage Feature Pillars

- Model your operations: custom modules, objects, fields, forms, and relations.
- Automate the flow: rules, triggers, scheduled jobs, notifications, webhooks, and updates.
- Add AI where work happens: generated queries, generated scripts, and AI-powered rule steps.
- Govern with confidence: roles, permissions, audit logs, module controls, and organization isolation.
- Find and act faster: global search, advanced lists, saved layouts, and saved queries.

## Open Discussion Questions

- Which industries should the first public examples use: services, construction, logistics, manufacturing, or general operations?
- Should we call Opero an ERP platform, business operating system, workflow ERP, or adaptive ERP?
- How much should we expose the “AI can write scripts / queries” power-user angle versus keeping AI framed as workflow assistance?
- Do we want to mention Contractors as a concrete module, or keep the first public site more industry-agnostic?
- Should the homepage CTA be “Book a demo”, “Design your workflow”, or “See Opero in action”?
