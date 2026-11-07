import type { SecurityPageContent } from "@/content/feature-stories/security.types";
import type { FeaturePageContent } from "@/content/types";

const securityFaq: FeaturePageContent["faq"] = {
  title: "Frequently asked questions.",
  items: [
    {
      question: "How do permissions work in Opero?",
      answer:
        "A person gets organization roles and, separately, roles in each company they belong to. Roles carry org.* and company.* permissions by resource and action. On top of that, an object, page or form is exposed to chosen companies and to an audience of roles or people, and an object can be limited to the records a person owns. A person has to pass all of these.",
    },
    {
      question: "Can I hide a single field from a role?",
      answer:
        "Through forms, yes. Give the role its own form and leave the field off, or add a display condition on the person's role or the record's values. The server does not send a field that is off the form and refuses a submitted value for it. There is no per-field permission across the product: lists and reports show the columns their author chose, and owners and system admins can read the full record.",
    },
    {
      question: "Does Opero support multiple companies?",
      answer:
        "Yes. One organization holds many companies. Configuration is built once and switched on per company, business records stay with their company by default, and for a company they do not belong to a person gets a 404. Reading across companies needs the separate permission org.companyData.readAll, which gives no right to write.",
    },
    {
      question: "Does the activity log record everything?",
      answer:
        "No. It records the event types in its catalog: records created and updated, invoices, contractors, comments, attachments, workflow moves, role changes and rule runs, with who, when and, where the event carries changes, before and after values. It does not record which records someone opened, and not every action has an event: deleting a contractor does, deleting a custom-object record does not. We will go through the catalog against what your audit needs.",
    },
    {
      question: "Do reports and SQL queries follow these rules?",
      answer:
        "Partly. Saved SQL queries run on limited database roles under PostgreSQL row-level security, scoped to the company. They are written by administrators and treated as trusted: SQL lists, reports and saved queries do not apply own-record visibility, and their editors warn about it. Custom Lists do apply it.",
    },
    {
      question: "Which single sign-on standards do you support?",
      answer:
        "OpenID Connect, with one connection per organization and users routed by an email domain verified through a DNS TXT record. SAML, SCIM, IdP-initiated login and logout propagation are not supported, and roles are assigned in Opero rather than mapped from identity provider groups. SSO is a licensed module; if the licence lapses, SSO switches off and members sign in with a password.",
    },
    {
      question: "Can we run Opero on our own server?",
      answer:
        "Yes. A guided installer sets up Opero on Ubuntu 24.04 LTS or Debian 12 or 13 (amd64) on a server you control, with your own address, certificate and backup destinations. It is the same product we run ourselves. Licensing works online, or through a licence file for an installation that cannot call out.",
    },
    {
      question: "Does Opero hold security certifications?",
      answer:
        "This page describes what the product does and does not claim any certification. Bring your security questionnaire to the demo and we will answer it item by item, against how Opero actually works.",
    },
  ],
};

export const securityFeature: FeaturePageContent = {
  seo: {
    title: "Security, Roles and Permissions",
    description:
      "Roles, separate companies, own-record visibility, API tokens, MFA and OIDC single sign-on. Set who can open company data and check who changed it.",
  },
  navLabel: "Security and permissions",
  navDescription: "The right access for every person",
  hero: {
    title: "Security and permissions - everyone sees exactly what they should",
    description:
      "Roles, permissions, multiple companies and API tokens under control. Company data protected to the standard IT departments expect.",
    primaryCta: "Book a demo",
    secondaryCta: "See Opero in action",
  },
  intro: {
    paragraph:
      "Access in Opero is arranged from the organisation and its companies, through roles and members, down to precise permissions on modules, objects and fields. Integrations are secured with API tokens, and accounts with multi-factor authentication.",
  },
  demo: {
    kind: "security",
    roles: ["Technician", "Manager", "Accounting"],
    recordTitle: "SR/2026/019 · VoIP system outage",
    fields: [
      { label: "Client", value: "Panorama Hotel" },
      { label: "Estimated value", value: "1,800.00 PLN" },
      { label: "Internal cost", value: "940.00 PLN" },
      { label: "Confidential note", value: "Client is negotiating a framework rate" },
    ],
    buttons: ["Edit", "Approve", "Delete"],
    readOnlyLabel: "View only",
    captions: {
      technician: "One record, <b>three roles</b>",
      manager: "Confidential fields <b>mask themselves</b>",
      finance: "Buttons disappear <b>along with the permission</b>",
    },
  },
  blocks: {
    title: "Access control from the organisation down to a single field.",
    items: [
      {
        title: "Members and roles",
        description:
          "User accounts grouped into roles that define the scope of access. Changing a role's permissions applies to everyone in it immediately.",
      },
      {
        title: "Fine-grained permissions",
        description: "Control over visibility and editing at module, object and individual field level.",
      },
      {
        title: "Organisations and companies",
        description:
          "Shared configuration, separate data per company: a capital group on one platform without mixing data.",
      },
      {
        title: "API tokens",
        description:
          "Access for integrations with a defined permission scope, issued and revoked independently of people's accounts.",
      },
      {
        title: "MFA and logs",
        description:
          "Multi-factor authentication plus a “who, what, when” event log for audit and compliance.",
      },
    ],
  },
  finalCta: {
    title: "Take control of access to your data.",
    description: "We will show you a role and permission model matched to your company structure.",
    primaryCta: "Book a demo",
  },
  seoText: {
    title: "Access to your data, fully under control.",
    paragraphs: [
      "Security in Opero starts with precise access control. You set permissions from the organisation and its companies, through roles and members, down to visibility and editing at the level of a single module, object and field. Roles mean a permission change applies immediately to everyone who holds that role, and every user sees exactly what they should.",
      "Multi-company support lets you run a group of companies on one platform. Configuration is shared, but each company's operational data stays separate, so information never mixes. Integrations are secured with API tokens that carry a defined permission scope, independent of people's accounts.",
      "Multi-factor authentication (MFA) and an event log raise protection to the standard IT departments expect. A \"who, what, when\" log gives the transparency audits and compliance requirements call for.",
    ],
  },
  faq: securityFaq,
  related: {
    title: "See also",
    items: ["integrations", "documents", "ai"],
  },
};

export const securityPage: SecurityPageContent = {
  seo: securityFeature.seo,
  hero: {
    title: "Decide who opens which record and field. Check who changed it afterwards.",
    description:
      "People reach only the records of companies they belong to, through the form assigned to their role. Remove a member and their sessions and the API tokens they created end at once. Records keep each change with the person and the value before and after. Runs in our cloud or on your own server.",
    primaryCta: "Book a demo",
    secondaryCta: "See Opero in action",
    image: {
      src: "/opero/security/roles-hero.webp",
      alt: "Opero company roles with the number of permissions, companies and people assigned to each",
      width: 2111,
      height: 1316,
    },
  },
  problem: {
    title: "Access questions that come up when someone leaves or an auditor calls.",
    points: [
      "An accountant leaves on Friday. On Monday nobody can list what she can still open, or which integration keys she created.",
      "A technician needs the service request, but its 940 PLN internal cost sits in the same spreadsheet row.",
      "A deal went from 103,000 to 118,000 last week, and the shared file does not say who changed it.",
      "Two companies in a group share one workbook, so an accountant in one can read the other's figures.",
    ],
    solution: "In Opero each of these has a defined answer: removal from the organization ends sessions and revokes her tokens, forms decide which fields a role receives, record history keeps the old and new value, and company membership decides whose records a person can reach.",
  },
  views: {
    title: "The 940 PLN internal cost stays off the technician's form.",
    description:
      "People reach a record through a form assigned to their role. Allowed fields come from the form's published layout on the server: a field left off is not sent, and a submitted value for it is refused.",
    exampleLabel: "An example",
    recordTitle: "SR/2026/019 · VoIP system outage",
    absentLabel: "Not on this form:",
    viewOnlyLabel: "View only",
    columns: [
      {
        role: "Technician",
        fields: [
          { label: "Client", value: "Panorama Hotel" },
          { label: "Issue", value: "No dial tone on floors 2 and 3" },
          { label: "Site", value: "Reception, comms room" },
        ],
        actions: ["Save", "Mark as fixed"],
        absent: ["estimated value", "internal cost"],
      },
      {
        role: "Service manager",
        fields: [
          { label: "Client", value: "Panorama Hotel" },
          { label: "Issue", value: "No dial tone on floors 2 and 3" },
          { label: "Estimated value", value: "1,800.00 PLN" },
          { label: "Internal cost", value: "940.00 PLN" },
        ],
        actions: ["Save", "Approve", "Reassign"],
        absent: [],
      },
      {
        role: "Accounting",
        fields: [
          { label: "Client", value: "Panorama Hotel" },
          { label: "Estimated value", value: "1,800.00 PLN" },
          { label: "Internal cost", value: "940.00 PLN" },
        ],
        actions: [],
        absent: ["issue", "site"],
      },
    ],
    note: "A form can also hide parts of itself by condition on the role or the record's values. This is a rule of the form, with no per-field permission across the product: lists and reports show the columns their author picked, and owners and system admins can read the full record. Set those up with the same care.",
  },
  scenarios: {
    title: "Common access rules and the setting behind each.",
    description: "Your administrator sets these in the product, with no custom development. The right-hand column names what gets configured.",
    headers: { area: "Where", rule: "The rule you want", how: "What you configure" },
    items: [
      {
        area: "Sales",
        rule: "Reps work their own deals. The sales director sees the whole pipeline.",
        how: "Set the deal object to own records, with the owner taken from a user field or from Created by. Add the director to the object's read-all audience.",
      },
      {
        area: "HR",
        rule: "Employees see their own leave requests. A manager sees the ones waiting on them. HR sees them all.",
        how: "The same setting. A person with an open workflow task on a request can open it while the task is open, and HR sits in the read-all audience.",
      },
      {
        area: "Field service",
        rule: "Technicians see the job and never the margin.",
        how: "Two forms over one object, each with its own audience of company roles. The technician's form leaves out value and cost.",
      },
      {
        area: "Finance",
        rule: "Once a document is approved, only named people can still edit it.",
        how: "Stage edit access has three modes: everyone, assignees plus named editors, or named editors only. A read-only stage overrides them all. A stage can also hide record actions, and the server refuses the hidden command.",
      },
      {
        area: "Holding",
        rule: "Each accountant works in one company. The group controller reads across all of them.",
        how: "A company membership with roles per company, plus org.companyData.readAll for the controller. It covers reads only, so writing still takes membership in that company.",
      },
      {
        area: "Customers and partners",
        rule: "A client signs in to a portal and never sees your system.",
        how: "Portal users get their own sign-in, role and menu, never become organization or company members, and use no seat. Portals are a licensed module.",
      },
    ],
    disclaimer: "Examples of what you can configure. Singleton and subordinate objects cannot use own-record visibility: a child record follows the access of its parent.",
  },
  layers: {
    title: "Four checks run before a record opens.",
    description: "A person has to pass all four, and each is configured separately. Passing one implies nothing about the next.",
    items: [
      {
        title: "Company",
        description: "Membership decides which companies a person works in. For any other company Opero answers 404, as if it did not exist, rather than 403.",
      },
      {
        title: "Role",
        description: "Permissions are ticked per resource and action. Company roles are defined once for the organization and assigned per company. The Owner role is protected, and the last owner cannot be removed.",
      },
      {
        title: "Audience",
        description: "Objects, pages and forms are exposed to chosen companies and, inside them, to chosen roles or people. An audience never grants a permission the person lacks.",
      },
      {
        title: "Record",
        description: "On an own-record object a person sees only rows they own, unless they are in its read-all audience, hold an open task on that record, or are an owner or system admin.",
      },
    ],
    diagnostics: {
      title: "Why can't this person edit the form? Test it.",
      description: "Pick a company and a member, then run Test runtime access. Opero checks form status, object access in the company and form audience for create, view and edit, and says why a check failed. In this screenshot, edit fails at form audience. Nobody has to sign in as someone else.",
      image: {
        src: "/opero/access/access-diagnostics-popover.webp",
        alt: "Opero access diagnostics dialog showing create, view and edit results for one member, check by check",
        width: 1269,
        height: 572,
      },
    },
  },
  audit: {
    title: "The value went from 103,000 to 118,000. The record shows who did it.",
    description:
      "A record's Changes history lists the person, the time and the before and after of each field. The activity log shows events across the organization or one company, filterable by actor, channel and event type. Reading it takes its own permission.",
    images: {
      log: {
        src: "/opero/security/activity-log.webp",
        alt: "Opero activity log listing recent changes across the organization with actor, event, record and time",
        width: 2000,
        height: 1250,
      },
      history: {
        src: "/opero/security/record-history.webp",
        alt: "Opero record history showing who changed each field, with the value before and after",
        width: 1200,
        height: 930,
      },
    },
    points: [
      {
        title: "More than field edits",
        description: "Records created and updated, invoices, contractors, comments, attachments, workflow stage changes, role assignments and rule runs each leave an entry.",
      },
      {
        title: "Which route the change took",
        description: "Each entry has a channel: Web, API, MCP or Automation rule. API writes carry the token's name. AI agent work reads as the person via the app they connected, as in the screenshot.",
      },
      {
        title: "What an entry keeps, and who reads it",
        description: "Names are stored on the entry, so a later rename does not rewrite it. On an own-record object, entries about a record someone cannot open stay hidden from them.",
      },
    ],
    note: "What it leaves out: it notes that a visit started, not which records a person opened, and not every action has an event. Deleting a contractor does, deleting a custom-object record does not. Bring your auditor's list to the demo and we will check it against the event catalog.",
  },
  questions: {
    title: "What Opero does when something goes wrong.",
    items: [
      { question: "A manager leaves. What happens to their access?", answer: "Remove them from the organization. All their sessions end, company memberships end, and API tokens they created there are revoked, so an integration on such a token stops until it gets a new one." },
      { question: "Who takes over their open tasks?", answer: "Opero does not pick a replacement. Their personal assignments are removed, tasks assigned to a role stay with the role, and a task left with no assignee can be assigned by the stage's editors." },
      { question: "The identity provider is down and SSO is required.", answer: "Members who must use SSO wait. Owners and holders of all-permissions roles keep their password, and a system admin can switch enforcement off, which is audited." },
      { question: "We disabled someone at the identity provider. Are they out?", answer: "They cannot sign in again, but an open Opero session keeps running until it expires: 7 idle days by default, 30 days at most. There is no SCIM, so remove or deactivate them in Opero too." },
      { question: "Someone edits a record at a locked stage.", answer: "A read-only stage refuses every edit. In the named-editors modes, others are refused, and that includes an API token unless it holds the workflow bypass permission." },
      { question: "Someone has a stolen password.", answer: "With a factor enrolled, the password only opens a challenge: 5 minutes and 5 attempts by default. Failed passwords are capped at 10 per email and IP in 15 minutes. A password change ends all sessions and remembered browsers." },
    ],
  },
  group: {
    title: "Several companies in one organization, with their records kept apart.",
    description:
      "Objects, forms, workflows and reports are built once at organization level and switched on per company, on a screen like this one for ACME Inc. By default records stay with their company, and people reach only the companies they belong to.",
    bullets: [
      "One person can be Manager in one company and Viewer in another",
      "Group reporting reads across companies only with org.companyData.readAll, which gives no right to write",
      "Saved SQL runs on limited database roles under PostgreSQL row-level security, but is admin-written and ignores own-record visibility",
      "Application queries filter by company as well, so the access check on entry is not the only barrier",
    ],
    image: {
      src: "/opero/security/company-exposure.webp",
      alt: "Opero assets screen for one company, listing pages with their configured mode, audience and an Available here switch",
      width: 2000,
      height: 1400,
    },
  },
  entry: {
    title: "Sign-in for people, integrations and AI agents.",
    description: "Each kind of caller has its own route and limits. The MFA figures below are defaults an organization can change.",
    items: [
      {
        icon: "sso",
        title: "Single sign-on",
        description: "OpenID Connect, one connection per organization, users routed by a domain proven with a DNS TXT record. Requiring SSO takes a passed connection test, and changing the connection suspends the requirement until it is re-tested. Licensed module.",
      },
      {
        icon: "mfa",
        title: "Multi-factor sign-in",
        description: "Authenticator app, passkey or security key, or SMS, with 10 recovery codes. Policy: off, optional, required for administrators or required for all. A browser can be remembered for 30 days, up to 90, and a recovery-code login is never remembered.",
      },
      {
        icon: "tokens",
        title: "API tokens",
        description: "Bound to one company with listed permissions. Lifetime is 1 to 90 days, 30 by default, unless you explicitly choose no expiry. Opero stores only a SHA-256 hash, and the token's name shows in history.",
      },
      {
        icon: "agents",
        title: "AI agents",
        description: "An agent signs in over OAuth as a person and gets that person's live permissions, checked on every call. Remove the person from an organization and the agent loses it too. A password reset or disconnecting it revokes the grant.",
      },
    ],
  },
  hosting: {
    title: "Run it in our cloud or on your own server.",
    description: "The product is the same in both. The difference is who runs the installation, its updates and its backups.",
    options: [
      {
        title: "In our cloud",
        description: "We run the installation and keep it updated. You sign in and work.",
      },
      {
        title: "On your server",
        description: "A guided installer sets Opero up on Ubuntu 24.04 LTS or Debian 12 or 13 (amd64), under your own address. The database stays there, files go to S3-compatible storage of your choice, and you apply updates when you are ready.",
      },
    ],
    backups: {
      title: "What a backup covers, and what a restore does.",
      stages: [
        { title: "Scheduled and kept", description: "Interval, daily, weekly, monthly or cron, in your time zone. Retention is per destination and keeps pinned copies and the latest verified one." },
        { title: "Encrypted and copied", description: "The database and, if you switch it on, the files it refers to go to local or NAS storage, SFTP or S3-compatible storage. Objects no row refers to are left out." },
        { title: "Checked", description: "Scheduled checks restore a copy into a temporary database, compare tables, extensions and migrations, and verify stored files. If file capture fails, the copy is published as database-only and the email alert says so." },
        { title: "What a restore changes", description: "Preflight runs first, and a recovery secret separate from any login is required. A protected backup is taken and the old database retained. Sessions and API tokens are revoked; rules, integrations and mailboxes are paused." },
      ],
    },
  },
  faq: securityFaq,
  related: {
    title: "See also",
    items: [
      { feature: "processes", title: "Processes and workflow", description: "Stages, tasks and approvals, with edit access set stage by stage." },
      { feature: "integrations", title: "Integrations", description: "Connect outside systems through company API tokens with listed permissions." },
      { feature: "ai", title: "Contextual AI", description: "AI agents that work with your data and your own permissions." },
    ],
  },
  finalCta: {
    title: "Bring your roles and your auditor's questions.",
    description: "Tell us which companies and roles you have and what your auditor asks for. In the demo we set up the matching forms and audiences, and go through your security questionnaire against how Opero works.",
    primaryCta: "Book a demo",
    secondaryCta: "Contact us",
  },
};
