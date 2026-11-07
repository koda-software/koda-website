import type { IntegrationsPageContent } from "@/content/feature-stories/integrations.types";
import type { FeaturePageContent } from "@/content/types";

export const integrationsFeature: FeaturePageContent = {
  seo: {
    title: "Integrations and Compliance: KSeF, API, Webhooks",
    description:
      "KSeF, NBP exchange rates and company lookups inside your process. An API, webhooks and ready integrations connect Opero with the tools you already use.",
  },
  navLabel: "Integrations and compliance",
  navDescription: "Compliant and connected",
  hero: {
    title: "Integrations and compliance - Opero as part of your ecosystem",
    description:
      "KSeF, NBP exchange rates and company lookups work straight from the system, and an open API connects Opero with the rest of your company's tools.",
    primaryCta: "Book a demo",
    secondaryCta: "See Opero in action",
  },
  intro: {
    paragraph:
      "Opero handles Polish e-invoicing and exchanges data with the outside world without separate software.",
  },
  demo: {
    kind: "integrations",
    source: { name: "KSeF", subtitle: "National e-Invoice System" },
    document: { number: "FA/2026/8841", kind: "e-invoice XML" },
    recordTitle: "Cost invoice",
    fields: [
      { label: "Number", value: "CI/2026/0143" },
      { label: "Supplier", value: "Panorama Hotel Ltd." },
      { label: "Amount", value: "24,800.00 PLN" },
    ],
    apis: [
      { endpoint: "POST /api/records", direction: "external system → Opero" },
      { endpoint: "webhook: status.changed", direction: "Opero → external system" },
    ],
    captions: { arrives: "A KSeF document <b>becomes a record</b>", fields: "Fields fill in <b>with no re-typing</b>", api: "The API works <b>both ways</b>" },
  },
  blocks: {
    title: "Requirements and data exchange handled inside the system.",
    items: [
      {
        title: "KSeF",
        description:
          "Sending and receiving structured invoices in line with mandatory e-invoicing in Poland.",
      },
      {
        title: "NBP exchange rates",
        description:
          "Automatic retrieval of rates (Table A) for multi-currency conversions, with correct handling of non-working days.",
      },
      {
        title: "Company lookup",
        description:
          "Company data from a NIP or a foreign VAT ID, from REGON, CEIDG and a registry service that uses VIES for the EU.",
      },
      {
        title: "Open API",
        description:
          "You connect Opero with company systems in both directions, making the platform part of the ecosystem rather than another island.",
      },
    ],
  },
  finalCta: {
    title: "Connect Opero with your systems.",
    description: "See how compliance and integrations work without any additional software.",
    primaryCta: "Book a demo",
  },
  seoText: {
    title: "Compliance and integrations without extra applications.",
    paragraphs: [
      "Opero handles Polish e-invoicing and exchanges data with the outside world without separate software. The KSeF integration lets you send and receive structured invoices in line with mandatory e-invoicing, with no trip to an external portal.",
      "Everyday operations are supported by further integrations. Exchange rates pulled automatically from the NBP API (Table A) feed multi-currency conversions, with correct handling of non-working days. A company lookup brings in a counterparty's data from REGON and CEIDG, or for foreign VAT IDs from a registry service that uses VIES for the EU, cutting manual checking.",
      "An open API connects Opero with the rest of your company's tools in both directions, turning the platform into part of your ecosystem rather than another isolated island of data. Gathering compliance and integrations inside the platform itself shortens the path and simplifies maintenance.",
    ],
  },
  faq: {
    title: "Frequently asked questions.",
    items: [
      { question: "Does Opero support KSeF?", answer: "Yes. Opero sends sales invoices to KSeF and fetches purchase invoices from it in the FA(3) format. It attaches the UPO, issues offline with KOD I and KOD II, and handles corrections, advance and settlement invoices. Authentication uses KSeF certificates, not tokens, with optional automatic renewal." },
      { question: "Which invoices can Opero not send to KSeF?", answer: "Simplified invoices, margin-scheme sales, intra-community supply and export 0% rates, new means of transport, invoice attachments and self-invoicing. Supported rates are 23, 22, 8, 7, 5, domestic 0, zw, np I, np II and oo. A rate outside that list is refused before anything is sent." },
      { question: "What if KSeF is down and we have no Offline certificate?", answer: "Opero retries five times over about 75 seconds. Without a valid Offline certificate it cannot issue offline, so the submission ends as Failed with the error shown and you send it again when KSeF is back. Fetching incoming invoices simply resumes from where the last successful run stopped." },
      { question: "Do we have to replace our accounting system?", answer: "No. Opero keeps no general ledger, so your accounting system or your accountant carries on as before. Opero runs the process around it, and passes on what the other system needs through the API, a webhook call from a rule or a saved query." },
      { question: "Is there a ready connector for our accounting or ERP product?", answer: "Not as a packaged connector. The ready integrations are KSeF, Google Maps, SMSPLANET, OpenAI, Anthropic and Google Gemini, plus mailbox sync for Google Workspace, Microsoft 365 and IMAP/SMTP. Other systems connect through the API and webhooks, and someone on your side or ours builds that link." },
      { question: "Can another system notify Opero when something happens?", answer: "Yes, by calling the API: it can create or update a record, or run a rule with its own input. A service that can only send a webhook in its own fixed format needs a small adapter in between." },
      { question: "Can Opero call a system inside our network?", answer: "The Call webhook step reaches public addresses on ports 80 and 443, and private address ranges are blocked. A system that is not reachable from the internet can call the Opero API itself instead, or sit behind a gateway you publish." },
      { question: "What does the company lookup check? Does it cover the VAT White List?", answer: "It confirms that a company is in the registry and brings in its data: REGON and CEIDG for Poland, and for foreign VAT IDs a service that uses VIES for the EU and also covers GB, CH, LI, NO and AU. It does not check bank accounts against the White List." },
      { question: "We run several companies. How does that work?", answer: "KSeF credentials can be set for the whole organization or for each company separately, so each NIP can use its own certificate. An API token always belongs to one company and sees only what is exposed to it." },
      { question: "Do we need a developer?", answer: "Not for the ready integrations: you enter the credentials in a form, verify the connection and build rules visually. Connecting your own system through the API does need someone who can write a little code on the other side." },
    ],
  },
  related: {
    title: "See also",
    items: ["security", "documents", "reports"],
  },
};

export const integrationsPage: IntegrationsPageContent = {
  hero: {
    title: "Send and receive KSeF in Opero. Your accounting stays.",
    description:
      "Sales invoices go to KSeF as FA(3), and the KSeF number and UPO land on the invoice. Purchase invoices become cost invoices through a rule you can read. Opero keeps no general ledger, so your accounting carries on, and a rule like this one tells your ERP when an order is approved.",
    primaryCta: "Book a demo",
    secondaryCta: "Meet Opero",
    image: {
      src: "/opero/integrations/rule-webhook-hero.webp",
      alt: "Opero rule builder with a rule that fires on a workflow transition, creates an order in the ERP through a webhook call, notifies the team and alerts finance on error",
      width: 2111,
      height: 1316,
    },
  },
  keep: {
    title: "What connects today, and what someone has to build.",
    description:
      "The ready integrations are KSeF, Google Maps, SMSPLANET, OpenAI, Anthropic and Google Gemini, plus mailbox sync. Accounting and ERP products have no packaged connector: they talk to Opero through the API and the Call webhook rule step, and someone writes that link.",
    columns: { system: "What you already use", connection: "How it connects", result: "What you get, and the limit" },
    rows: [
      { system: "Email", examples: "Google Workspace, Microsoft 365, any IMAP/SMTP", connection: "Mailbox sync", result: "Messages sync into Opero and stay in your mailbox. A message can be linked to a record, start a rule or open a helpdesk ticket." },
      { system: "Accounting or ERP", examples: "Whatever you run today", connection: "API and Call webhook", result: "A rule posts to your system when, say, an order is approved. Your system writes back through the API or reads through a saved query. No packaged connector, so this link is built for you or by you." },
      { system: "Your website", examples: "Contact pages, order and application forms", connection: "API or public form", result: "An enquiry becomes a record that rules can act on. One caution: a retried API create makes a second record, so the website should not resend blindly." },
      { system: "Calendars", examples: "Any calendar app that subscribes to ICS", connection: "ICS feed", result: "People see their Opero events in the calendar app they already use. A subscription only reads, so changes are still made in Opero." },
      { system: "Reports and scripts", examples: "BI tools, spreadsheets fed by a script, your own code", connection: "Saved queries over API", result: "A token with the execute permission runs a saved query and gets rows back. Nobody needs a database login." },
      { system: "Maps", examples: "Google Maps, with your own key", connection: "Integration", result: "Rule steps for geocoding, address validation, route distance and time zones. The usage is billed to your Google key." },
      { system: "Text messages", examples: "SMSPLANET", connection: "Integration", result: "A rule step sends the text from your SMSPLANET account, and delivery reports come back to Opero." },
      { system: "AI models", examples: "OpenAI, Anthropic, Google Gemini, or an MCP agent", connection: "Your own key", result: "A prompt step can read a file and return fields for the record. An MCP agent such as Claude signs in as a user and has that user's permissions." },
    ],
    footnote: "Not on the list? If your system can make HTTPS calls, or accept them on a public address on port 80 or 443, it can usually be connected. Bring it to the demo and we will tell you what would take work.",
  },
  demo: {
    title: "A KSeF invoice becomes a cost invoice, read from its XML.",
    description: "Number, supplier, dates, amounts and lines come from the FA(3) file, so nobody retypes them. From that record your other systems can call Opero, and Opero can call them. The data here is a sample.",
    content: {
      source: { name: "KSeF", subtitle: "National e-Invoice System" },
      document: { number: "FA/2026/8841", kind: "e-invoice XML" },
      recordTitle: "Cost invoice",
      fields: [
        { label: "Number", value: "CI/2026/0143" },
        { label: "Supplier", value: "Panorama Hotel Ltd." },
        { label: "Amount", value: "24,800.00 PLN" },
      ],
      apis: [
        { endpoint: "POST /api/v1/.../records", direction: "your system → Opero" },
        { endpoint: "Rule step: Call webhook", direction: "Opero → your system" },
      ],
      captions: { arrives: "A KSeF document <b>becomes a record</b>", fields: "Fields are read <b>from the FA(3) XML</b>", api: "Your systems call in, <b>Opero calls out</b>" },
    },
  },
  compliance: {
    title: "The path of a KSeF invoice, going out and coming in.",
    description: "Outgoing, the action and the rule step use one readiness check, so nobody is offered a send that would be refused. Incoming, polling only stores the invoice: what happens next is a rule you write.",
    lanes: [
      {
        title: "A sales invoice goes out",
        stages: [
          { title: "Checked, with every problem listed at once", detail: "Missing seller address, totals off by more than 0.02, a zw rate with no exemption basis. Then the XML is validated against the FA(3) schema." },
          { title: "Frozen before it is sent", detail: "The exact XML and its SHA-256 hash are stored. Retries reuse those bytes and never reread the invoice." },
          { title: "Sent by a person or a rule", detail: "Send to KSeF needs the same permission as editing the invoice. The rule step queues it and returns at once, without waiting for KSeF." },
          { title: "Accepted, then locked", detail: "The UPO is attached first and the acceptance trigger fires after, so your next rule can rely on it. The invoice can no longer be edited." },
        ],
      },
      {
        title: "A supplier invoice comes in",
        stages: [
          { title: "Fetched every 15 minutes or slower", detail: "Polling is off until you enable it. The default is 30 minutes, and the 15-minute floor comes from KSeF's export limits. A failed run keeps its place, so the next one misses nothing." },
          { title: "Stored, and a trigger fires", detail: "Seller NIP, number, gross amount and invoice type reach your rule, which can branch on the amount or route corrections elsewhere." },
          { title: "Cost invoice created", detail: "The step can add a missing contractor and refuses a second cost invoice with the same KSeF number. A KOR becomes a correction linked to its original." },
          { title: "PDF, then approval", detail: "A rule step renders a PDF with the verification QR code and attaches it. From there it follows your cost invoice workflow, if you have set one up." },
        ],
      },
    ],
  },
  ksef: {
    title: "What happens when KSeF stops responding.",
    description: "Example: an invoice dated Tuesday 10 November 2026, Automatic mode, Offline certificate in place. Opero tries five times over about 75 seconds, then issues it offline: the same frozen XML, with KOD I and KOD II. 11 November is a public holiday, so the deadline is Thursday 12 November. Incoming invoices run through a rule like the one pictured, with an On error path on each step.",
    image: {
      src: "/opero/ksef/invoice-automation-rule.webp",
      alt: "Opero rule that downloads an invoice from KSeF, creates a cost invoice, renders a PDF and attaches it, with an error path for each step",
      width: 1869,
      height: 1179,
    },
    cases: [
      { title: "No Offline certificate", description: "Automatic mode converts only if KSeF holds no reference yet and a valid Offline certificate exists. Without one, the submission ends as Failed with the error shown, and you send it again." },
      { title: "The offline deadline", description: "Delivery retries about once a minute with the same bytes until KSeF accepts it or you withdraw it, giving a reason. If it is still undelivered on 13 November, an overdue trigger fires once and your rule decides who hears." },
      { title: "An invoice is rejected", description: "KSeF's own code and message appear on the submission, and a trigger can notify someone. A rejection does not lock the invoice, so you fix it and resend. An offline invoice stays frozen and goes back as a technical correction." },
      { title: "Sent, but no verdict", description: "References are saved before polling starts, so a retry asks for the verdict and never sends a second copy. After 30 quiet minutes Opero re-checks, up to three times. Idle for an hour, it appears on the stuck submissions list, with a recheck action." },
      { title: "One invoice sent twice", description: "A second send is refused while one is in flight. If a crash still causes a duplicate, KSeF answers 440 with the original number and session. Opero records the invoice as accepted and takes the UPO from that session." },
      { title: "Accepted, but wrong", description: "An accepted invoice cannot be edited or deleted. A KOR correction cites the original's KSeF number with before and after lines. A wrong buyer NIP is refused: you correct to zero and issue a new invoice." },
      { title: "A certificate is expiring", description: "The invoice sidebar warns from 30 days before expiry. Automatic renewal, on by default, uses the same window for Authentication and Offline certificates. KSeF tokens are not supported: certificates only." },
      { title: "Rehearsing an outage", description: "The Simulate KSeF outage switch makes delivery, polling and certificate jobs fail like a real network failure. Try it on the TEST environment to watch offline issuance and your rules. Turned off, frozen invoices are delivered." },
    ],
  },
  checks: {
    title: "NIP lookups and NBP rates, with their failure paths.",
    description: "Both write down where the value came from. Neither fills in a guess when the registry or NBP does not answer.",
    sampleLabel: "Sample data",
    items: [
      {
        title: "Company data from a NIP",
        description: "Opero asks REGON for the name, legal form and address, with CEIDG helping on addresses for sole traders. Foreign VAT IDs go to a registry service that uses VIES for the EU and also covers GB, CH, LI, NO and AU. The rule step has three exits: found, not found (malformed, unregistered or closed) and error. It does not check bank accounts against the White List.",
        rows: [
          { label: "NIP", value: "000 000 00 00" },
          { label: "Name", value: "Example Sp. z o.o." },
          { label: "Address", value: "ul. Przykładowa 1, 00-001 Warszawa" },
          { label: "Source", value: "REGON" },
        ],
      },
      {
        title: "NBP rates on foreign currency invoices",
        description: "With a date of Monday 16 November, Opero takes the last table before it: Friday 13 November. It looks back up to 31 days, in table A and then B, and saves the table number and date with the rate. If NBP fails three times, the rate is reported as unavailable and you can enter it with a reason. Only the NBP method resolves automatically, for Polish companies with PLN as base currency.",
        rows: [
          { label: "Currency", value: "EUR" },
          { label: "Date that counts", value: "16 Nov 2026" },
          { label: "Table used", value: "A, published 13 Nov 2026" },
          { label: "Rate", value: "4.2500 PLN" },
        ],
      },
    ],
  },
  scenarios: {
    title: "Six setups you could build from these parts.",
    description: "These are examples with invented figures, not customer stories. The triggers and steps are real ones. Your limits and routing would be different.",
    items: [
      {
        team: "Finance",
        industry: "Any VAT payer",
        title: "Supplier invoices above 10,000 PLN go to a manager.",
        steps: ["KSeF invoice received: 12,300 PLN gross", "Condition: above 10,000 PLN", "Cost invoice created, manager notified"],
        outcome: "If a rule runs twice on one KSeF number, the second cost invoice is refused and takes the error path.",
      },
      {
        team: "Sales",
        industry: "B2B wholesale",
        title: "A web enquiry with a NIP arrives with its company data.",
        steps: ["The website posts the form to the API", "Company lookup runs on the NIP", "The sales rep gets a notification"],
        outcome: "A closed or unknown NIP takes the not found exit, so the rep can be told to check before calling.",
      },
      {
        team: "Field service",
        industry: "Installation company",
        title: "A job shows the distance from base, and the customer gets a text.",
        steps: ["Google Maps validates the address", "A step computes the distance from base", "SMSPLANET sends the visit confirmation"],
        outcome: "The delivery report comes back to Opero, so you can see whether the text arrived.",
      },
      {
        team: "Production",
        industry: "Manufacturer with an ERP",
        title: "A rule creates each approved order in the ERP.",
        steps: ["Workflow moves the order to Approved", "Call webhook posts it to the ERP", "Team notified, ERP reply logged"],
        outcome: "No reply in 30 seconds or a non-2xx status takes the On error path, which alerts finance.",
      },
      {
        team: "HR",
        industry: "Retail with many sites",
        title: "A reminder 30 days before a medical check expires.",
        steps: ["Date reminder fires 30 days ahead", "The employee gets a text", "The manager gets a notification"],
        outcome: "The reminder reads the date field on the employee record, so nobody keeps a separate spreadsheet of dates.",
      },
      {
        team: "Back office",
        industry: "Property management",
        title: "A contract PDF proposes its own field values.",
        steps: ["Someone attaches the file", "A prompt step with your key reads it", "A rule writes the fields on the record"],
        outcome: "The model can misread a contract, so someone should still check the values it wrote.",
      },
    ],
  },
  developers: {
    title: "A REST API for company data, and outbound calls from rules.",
    description: "Versioned under /api/v1, with OpenAPI in English and Polish, for records, contractors, files, comments, workflows, tickets, email, saved queries and rules. It does not edit configuration: forms, rules and workflows are authored in the app or over MCP.",
    bullets: [
      "A token belongs to one company. Naming another company in the path gives 403. A revoked or expired token gives 401, and an asset not exposed to the company gives 404.",
      "Creating a record is not idempotent: a retried request creates a second record, so check before you resend.",
      "POST /api/v1/rules/:id/execute runs a manual rule with your input. It needs the api.company.rules.execute permission.",
      "Call webhook reaches public addresses on ports 80 and 443 only, with a 30-second timeout, a 64 KB body and a 1 MB reply. Redirects are not followed.",
      "AI agents use a separate MCP server: OAuth sign-in as the user, with that user's permissions.",
    ],
    inbound: {
      label: "Your system calls Opero",
      lines: [
        "POST /api/v1/custom-modules/crm/objects/deals/records",
        "Authorization: Bearer <company API token>",
        "",
        '{ "values": { "name": "Enquiry from the website" } }',
      ],
    },
    outbound: {
      label: "Opero calls your system (rule step: Call webhook)",
      lines: [
        "POST https://erp.example.com/orders",
        "",
        '{ "order": "{{ trigger.data.number }}", "status": "approved" }',
      ],
    },
  },
  control: {
    title: "What you can check on each token and each rule run.",
    description: "Two questions come up when a link misbehaves: what was this token allowed to do, and what did the other system actually answer? Both have a screen.",
    shots: [
      {
        title: "A token limited to what it needs",
        description: "This example token can read, create and update company custom records, and nothing else. It expires in 30 days, or never if you tick that box. Once revoked it gets 401, and API changes are attributed to the token in the record's history.",
        image: {
          src: "/opero/integrations/api-tokens.webp",
          alt: "Create token dialog in Opero: a token named Website enquiries, expiring in 30 days, with read, create and update ticked for company custom records",
          width: 1240,
          height: 1000,
        },
      },
      {
        title: "A replay of each rule run",
        description: "The replay shows the path the run took and what each step published. Here the ERP call returned status 200, with its headers and body under the key erp. You can also open the context the step saw when it ran.",
        image: {
          src: "/opero/integrations/rule-run-journal.webp",
          alt: "Opero execution replay of a rule run, with the Create order in the ERP step selected and its published status, headers and body shown",
          width: 2000,
          height: 1400,
        },
      },
    ],
    facts: [
      "Credentials are write-only and encrypted with AES-256-GCM. For KSeF you see only the certificate's subject, serial number, validity and fingerprint.",
      "KSeF diagnostics show connection health, polling contexts and runs, incoming invoices, outgoing submissions and the rule runs behind them.",
      "Moving to the KSeF production environment asks for confirmation, and changing the environment clears verification and disables the connection until it is verified again.",
    ],
  },
  faq: integrationsFeature.faq,
  related: {
    title: "See also",
    items: [
      { feature: "lowCode", title: "Low-code and automation", description: "The rules and scripts behind every scenario on this page." },
      { feature: "security", title: "Security and access", description: "Roles, companies and record access, for people and for tokens." },
      { feature: "documents", title: "Documents", description: "Files, previews and generated documents next to the matter they belong to." },
    ],
  },
  finalCta: {
    title: "Send us the list of systems you run.",
    description: "Tell us where people copy data between systems today and which invoices you issue. In the demo we go through what connects, what needs building and what we cannot send to KSeF yet.",
    primaryCta: "Book a demo",
    secondaryCta: "Contact us",
  },
};
