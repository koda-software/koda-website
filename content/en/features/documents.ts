import type { DocumentsPageContent } from "@/content/feature-stories/documents.types";
import type { FeaturePageContent } from "@/content/types";

export const documentsFeature: FeaturePageContent = {
  seo: {
    title: "Document Workflow and File Management (DMS)",
    description:
      "Register documents, route them through approval and keep every file with the case. Document workflow and DMS in one platform: Opero.",
  },
  navLabel: "Documents and files",
  navDescription: "Every file stays with its case",
  hero: {
    title: "Document workflow - documents under control from intake to archive",
    description:
      "Register documents, route them through approval and keep every file version with the case, instead of scattered across inboxes and drives.",
    primaryCta: "Book a demo",
    secondaryCta: "See Opero in action",
  },
  intro: {
    paragraph:
      "Opero combines document workflow with file management: a document has its own record, an approval path and a complete set of versioned files. All of it with a full history and access control.",
  },
  demo: {
    kind: "documents",
    inboxLabel: "Inbox",
    mail: { file: "invoice-panorama-hotel.pdf", from: "from: office@panorama.com" },
    record: {
      title: "Cost invoice",
      numberLabel: "Number",
      number: "CI/2026/0142",
      partyLabel: "Supplier",
      party: "Panorama Hotel Ltd.",
      amountLabel: "Gross amount",
      amount: "24,800.00 PLN",
    },
    pathLabel: "Approval path",
    condition: "Amount ≥ 10,000 PLN?",
    branches: [
      { title: "Approval: Board", detail: "2 signatures required" },
      { title: "Approval: Manager", detail: "path skipped" },
    ],
    versionsLabel: "File versions",
    versions: [
      { file: "invoice.pdf", detail: "scan from e-mail" },
      { file: "invoice.pdf", detail: "line 3 corrected" },
      { file: "invoice.pdf", detail: "approved" },
    ],
    currentLabel: "current",
    captions: { intake: "A document arrives and <b>becomes a record by itself</b>", numbering: "The number is assigned <b>automatically</b>", path: "The approval path <b>depends on the amount</b>", versions: "Every file is versioned - <b>nothing gets lost</b>" },
  },
  blocks: {
    title: "Record, approval path and files as one whole.",
    items: [
      {
        title: "Document registration",
        description:
          "Every document type (letter, invoice, request) is a custom object with its own fields, numbering and record view.",
      },
      {
        title: "Approval flow",
        description:
          "The document moves through defined stages: assignment, review, approval, archiving.",
      },
      {
        title: "Intake forms",
        description:
          "Controlled registration and assignment views, different for the front office, the department and the approver.",
      },
      {
        title: "Files and versioning",
        description:
          "Attachments bound to the record: stored, versioned and searchable, with permission control.",
      },
      {
        title: "Document templates",
        description:
          "Generate contracts, letters and decisions from record data using templates with variables, always in the current version.",
      },
    ],
  },
  finalCta: {
    title: "Put document flow in order.",
    description: "See how Opero carries a document from intake to archive with no gaps and no lost files.",
    primaryCta: "Book a demo",
  },
  seoText: {
    title: "Documents under control from intake to archive.",
    paragraphs: [
      "Electronic document workflow in Opero puts every letter, request and invoice on a controlled path: from intake, through assignment and approvals, to archiving. A document gets its own record built as a custom object, with intake fields and numbering, plus a flow built on stages and transitions. That makes it clear where a case is and whose desk it is on.",
      "The file-management layer keeps files where they belong: attached to the case record. Attachments are stored, versioned and searchable, with permission control, so documents do not get lost across drives and inboxes. Document templates generate a contract, decision or letter straight from record data, always in the current version and format.",
      "Combining document workflow and file management on one platform means the flow, the data and the files are not split across separate tools. That is a shorter path for a case, less manual retyping, and a full history for control and compliance.",
    ],
  },
  faq: {
    title: "Frequently asked questions.",
    items: [
      {
        question: "What is the difference between document workflow and a DMS?",
        answer:
          "Document workflow is the path a document takes through the company: registration, assignment, approval, closing. A DMS looks after the files themselves: where they are stored, who can reach them and how to find them. Opero does both by keeping the files on the record that travels along the path.",
      },
      {
        question: "Can documents be generated automatically?",
        answer:
          "Yes, as PDF only: there is no Word or HTML output. A template turns data into a PDF, and a rule decides when: on a stage change, on a schedule or from an action on a list. The same rule can attach the PDF to the record and send it by email. If someone must edit the result, keep a Word file as an attachment instead.",
      },
      {
        question: "Does Opero keep versions of an attached file?",
        answer:
          "Not as a version stack on one file. A corrected file is a new attachment next to the earlier one, and the activity history shows who added it and when. Real version history exists for document templates, which go from draft to published version, and for long rich text in document objects, where earlier text can be viewed and saved again as a new version.",
      },
      {
        question: "Can Opero search inside PDFs and scans?",
        answer:
          "No. Search covers record fields and rich text, not the contents or names of attached files, and Opero has no built-in OCR. Give the record the fields people search by. With an AI provider connected, a rule can read an attached PDF and fill those fields for you.",
      },
      {
        question: "Is the signature field a legally binding e-signature?",
        answer:
          "The signature field captures a signature drawn on screen, or typed if you allow it, with the time and, if you require it, the signer's name. It can be set so it cannot be changed once signed. It is not a qualified electronic signature. If you need one, sign in your signing tool and attach the signed file to the case.",
      },
      {
        question: "Does Opero enforce retention periods?",
        answer:
          "There is no ready-made retention schedule or legal hold. You build the policy from a date field, a reminder or scheduled rule, read-only final stages and deletion permissions. If you have formal archiving requirements, bring them to the demo and we will tell you plainly what fits.",
      },
    ],
  },
  related: {
    title: "See also",
    items: ["processes", "noCode", "security"],
  },
};

export const documentsPage: DocumentsPageContent = {
  hero: {
    title: "Contract, scan, approval and reminder on one record.",
    description:
      "Opero fills a PDF from a published template, moves the record through your approval stages, opens attachments in the browser and notifies the owner before the end date. It has no OCR, no Word output and no qualified e-signature, and this page says what to do instead.",
    primaryCta: "Book a demo",
    secondaryCta: "Meet Opero",
    image: { src: "/opero/documents/hero-case-record.webp", alt: "Opero customer request REQ/2026/08/1 with its form on the left and four attached files on the right", width: 2111, height: 1316 },
  },
  problem: {
    title: "Five questions a shared drive cannot answer about a contract.",
    description:
      "Take an example: contract UM/2026/0147 for 180,000 PLN, saved as a PDF on a drive. The file holds the text. The stage, the person responsible, the access list and the end date live elsewhere, usually in email. In Opero they are fields on the record the PDF is attached to.",
    folderLabel: "On a shared drive",
    caseLabel: "On the record in Opero",
    rows: [
      { question: "Who has UM/2026/0147 right now?", folder: "Ask sales, then legal, then check who emailed it last.", opero: "The record shows the stage, the assignee and the open task." },
      { question: "Which case does scan_0042.pdf belong to?", folder: "Open it and work it out from the content.", opero: "It is attached to one record, next to the customer and the deadline." },
      { question: "Who can open it?", folder: "Anyone with the folder, and anyone it was forwarded to.", opero: "Only people who can read the record and hold the attachment read permission." },
      { question: "Who changed the value from 150,000 to 180,000?", folder: "Compare two Word files, if both still exist.", opero: "The activity history shows the old and new value, who changed it and when." },
      { question: "Who notices that it ends on 31 January 2029?", folder: "Whoever put it in their own calendar.", opero: "A reminder rule on the end date field, up to 365 days before or after it." },
    ],
  },
  caseFile: {
    title: "The file opens beside the form, with no download.",
    description:
      "In this example, customer request REQ/2026/08/1 holds four files. Service report SR-2041 opens in the Files tab while the form stays in view, and the comments are one tab away. The same panel works on a customer, an employee, an asset, a ticket or an object you defined.",
    bullets: [
      "Files arrive by upload, through a file field on a form (public ones too), from a rule, from KSeF or through the API.",
      "PDF, images, Excel and CSV open in the browser. Word, PowerPoint, .odt, .odp and .rtf get a PDF preview converted in the background, and the original stays untouched.",
      "The default limit is 10 MB per attachment, an organization setting. A file uploaded to a form nobody saved expires after 72 hours.",
      "Attachments have four permissions: read, add, rename and remove. The default Member role can read and add, and Viewer can only read.",
    ],
    image: { src: "/opero/documents/file-preview-on-record.webp", alt: "Service report SR-2041 as a PDF preview in the Files tab of an Opero record, beside its form", width: 2000, height: 1400 },
  },
  journey: {
    title: "One 180,000 PLN contract, from request to renewal notice.",
    description:
      "Follow the whole path of one case. The PDF is never the thing that moves: the record changes stage, the next person gets a task, and every file stays attached.",
    note: "An example. The limit, stages and dates are your configuration. Publish a changed workflow and this case uses the new moves and conditions from its next move.",
    stages: [
      { tag: "Form", title: "Sales opens UM/2026/0147", detail: "Customer, 180,000 PLN, 24 months from 1 Feb 2027. A generated-code field sets the number, read-only after creation." },
      { tag: "Rule", title: "A draft PDF is attached", detail: "On the move to Legal review, a rule generates the PDF from the published template and attaches it." },
      { tag: "Task", title: "Legal reviews the draft", detail: "The lawyer gets a task. Sending the draft back requires a comment, so the reason stays on the record." },
      { tag: "Condition", title: "180,000 PLN is over the limit", detail: "Above 100,000 PLN the department head's transition fails its condition. Only Board approval is offered.", active: true },
      { tag: "Email", title: "The signed copy comes back", detail: "A rule on the incoming email links the thread to the case and attaches the signed PDF next to the draft." },
      { tag: "Read-only", title: "Active, with fields frozen", detail: "People and rules can no longer change the value or dates. An API token needs an explicit bypass permission." },
      { tag: "Reminder", title: "2 Dec 2028: renewal notice", detail: "A reminder set 60 days before the 31 Jan 2029 end date notifies the owner at 09:00." },
    ],
  },
  scenarios: {
    title: "Six document types teams set up, and what happens to each.",
    description:
      "Examples of what you can configure, with sample figures. Apart from invoices these are not fixed modules: each is an object with your fields, stages and templates.",
    stepLabels: ["Comes in", "Moves", "Stays"],
    items: [
      {
        area: "HR",
        title: "Employment contract for a new hire",
        steps: [
          "When the hire is approved, a rule generates the contract PDF from the employee record.",
          "The manager and then HR confirm it in their own stages, each with a task.",
          "It stays on the employee record, and a date rule warns 30 days before the medical check expires.",
        ],
      },
      {
        area: "Procurement",
        title: "12 laptops for 38,400 PLN against a 25,000 PLN limit",
        steps: [
          "An employee submits 12 units at 3,200 PLN with the supplier's quote attached.",
          "Over the limit, only the director's transition is offered. Rejecting requires a comment.",
          "A rule emails the order PDF to the supplier and attaches a copy to the request.",
        ],
      },
      {
        area: "Field service, facilities, installers",
        title: "Service report SR-2041",
        steps: [
          "The technician records the visit on the asset's maintenance record, with photos.",
          "The customer signs on screen. With lock after signing on, the signature is write-once, with signer name and time.",
          "The report goes out as a PDF, and the asset keeps every report from its past visits.",
        ],
      },
      {
        area: "Finance",
        title: "Cost invoice from KSeF or a mailbox",
        steps: [
          "KSeF delivers it, or a PDF arrives by email. With an AI provider connected, a rule reads the PDF and checks the NIP and IBAN checksums.",
          "AI imports wait in pending review until accounting marks them ready. An invoice with a known seller NIP and number is skipped by default.",
          "The source file stays attached to the invoice. Opero has no general ledger, so posting stays in your accounting system.",
        ],
      },
      {
        area: "Quality, manufacturing",
        title: "A procedure with a yearly review",
        steps: [
          "The text is written in Opero as a document object, with links to the records it concerns.",
          "It goes through review and approval stages, each with assigned people.",
          "The approved stage is read-only, and a reminder on the next-review date reaches the owner.",
        ],
      },
      {
        area: "Front office, public institutions",
        title: "Incoming letter KP/2026/0381",
        steps: [
          "Reception registers the letter with a scan, and a generated-code field sets the number. Nothing reads the scan, so the sender and subject are typed in.",
          "The letter goes to a department, which gets a task with a due date and a reminder.",
          "Each department has its own filtered list, and the workflow history shows the whole path.",
        ],
      },
    ],
  },
  generate: {
    title: "A PDF from a published template, filled from the record.",
    description:
      "The sales proposal shown here is laid out in millimetres on a page canvas, with fields bound to variables such as {{ data.customer }}. Invoices and helpdesk tickets come with ready variables. For your own objects, the rule passes the values it needs. The output is PDF only.",
    image: { src: "/opero/documents/template-editor.webp", alt: "Opero document template editor with a sales proposal, a data-bound table and a QR code", width: 2000, height: 1250 },
    points: [
      { title: "What a page can hold", detail: "Text, tables, lists, images, lines, signature boxes and QR codes, including vCard and Wi-Fi. A table takes its rows from a list in the data, and a column can show on a condition. HTML templates are not supported." },
      { title: "One header and footer", detail: "Headers and footers are separate parts with their own publish step. Publish a new address and the next PDF carries it. PDFs already generated do not change." },
      { title: "Drafts stay internal", detail: "Preview PDF creates no file. Real generation uses only the current published version, publishing first validates and test-renders it, and the job records the version used." },
      { title: "Three rule steps", detail: "On a stage change, a schedule or a list action: generate, attach, send. If rendering fails, the step shows as failed in the rule's run and nothing is attached." },
    ],
  },
  write: {
    title: "A policy can be the record itself, with no Word file.",
    description:
      "The Equipment returns policy shown here is a document object: the page is its title and body, and the sidebar holds your fields, in this case status, department and next review. It takes the same stages and permissions as any other record.",
    bullets: [
      "Headings, tables, images, callouts and one table of contents built from the headings.",
      "A record link stores only the target. Each reader sees the current name, or a restricted marker if they cannot open that record.",
      "History keeps the full earlier text of long bodies, over 16 KiB. Load an old version into the editor and save it as a new one. Images deleted since then may be missing.",
      "Search reaches the body text. A document object cannot be used as a public form.",
    ],
    image: { src: "/opero/documents/document-object.webp", alt: "A policy written as an Opero document object, with a table of contents, a record link and fields in the sidebar", width: 2000, height: 1400 },
  },
  find: {
    title: "Find it by customer, date or stage. File names are not indexed.",
    description:
      "Search covers record fields and rich text, not attachment names or contents, and there is no OCR. So give each document type the fields people look for. The example list holds 14 customer requests, with tabs for the full list, a board and a Preview pane with one record open beside it.",
    bullets: [
      "Lists filter on their fields, including relative dates such as the last 30 days.",
      "An admin sets up table, board, workflow board and calendar views. In the Preview pane, J and K move between records and O opens the full page.",
      "Members add personal views on top of the ones the admin defined.",
      "On an object set to Own records, a list shows each member only the records they own.",
    ],
    image: { src: "/opero/documents/split-list.webp", alt: "Opero list of 14 customer requests with one record open beside the list in the Preview tab", width: 2000, height: 1400 },
  },
  keep: {
    title: "No ready-made retention schedule. Four parts to build one.",
    description:
      "There is no legal hold either. For each document type you combine a final stage, delete permissions, date rules and storage. Here is how each one behaves.",
    items: [
      { title: "Read-only final stage", detail: "Nobody can edit the record's fields at that stage, and rules are refused too. Attachments fall outside it and follow their own permissions." },
      { title: "Who can delete", detail: "Deleting a record takes the delete permission. A stage can also allow the record's creator, author or assignee. Removing a file takes a separate permission that the default Member role lacks." },
      { title: "Rules on dates", detail: "A reminder fires once per record and date, and again if the date moves. A rule can remove attachments, and stops with an error if more match than the limit you set." },
      { title: "After removal", detail: "A removed file is gone from every read at once, and its bytes stay 48 hours so a recent backup can still read them. Files live in S3-compatible storage and can be included in backup plans." },
    ],
  },
  faq: documentsFeature.faq,
  related: {
    title: "See also",
    items: [
      { feature: "processes", title: "Processes and workflow", description: "Stages, tasks, transition conditions and required comments." },
      { feature: "lowCode", title: "Low-code and automation", description: "The rule steps that generate, attach and send a document." },
      { feature: "security", title: "Security and permissions", description: "Who sees which company, record and file." },
    ],
  },
  finalCta: {
    title: "Bring one real document to the demo.",
    description: "A contract, a service report or a purchase request, with its approval limits. We will map it to fields, stages and a template, and say plainly what does not fit.",
    primaryCta: "Book a demo",
    secondaryCta: "Talk to us",
  },
};
