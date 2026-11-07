import type { ProcessesPageContent } from "@/content/feature-stories/processes.types";
import type { FeaturePageContent } from "@/content/types";

/** One list for the page and for the FAQ structured data, which reads the feature export. */
const processesFaq: FeaturePageContent["faq"] = {
  title: "Frequently asked questions.",
  items: [
    {
      question: "What is a workflow in Opero?",
      answer:
        "The path a record follows through your company: its stages, the moves allowed between them, and who is responsible at each step. It can run on your own objects, or on contractors, invoices, budgets and helpdesk tickets.",
    },
    {
      question: "Do we need a developer to build a process?",
      answer:
        "No. You draw the stages on a canvas and fill in forms for owners, deadlines and conditions. A simple approval is available as a ready-made template. If you ever need more, rules and scripts are on the same platform.",
    },
    {
      question: "Can the route depend on the amount or another field?",
      answer:
        "Yes. An action can appear only when the record meets your conditions, so a request under the limit is approved by the manager and one over it goes to finance. Conditions work with any field on the record.",
    },
    {
      question: "Can two people approve at the same stage?",
      answer:
        "A record is at one stage at a time, and when a stage has several owners, any one of them can move it on. If two people must both sign, give each of them a stage, one after the other.",
    },
    {
      question: "What happens when someone misses a deadline?",
      answer:
        "The task stays open and shows as overdue, and you decide what follows: a reminder for the owner, an email to the team lead, or a handover to a colleague. Deadlines count calendar days, including weekends.",
    },
    {
      question: "What if the owner is on holiday or leaves the company?",
      answer:
        "Assign key stages to a team, so anyone in it can act. The owner can also hand a task over, and a rule can do it after a deadline passes. Opero has no out-of-office setting. When someone is removed from the company, their open tasks stay open as unassigned, ready for someone to pick up.",
    },
    {
      question: "Can I change a process while cases are running?",
      answer:
        "Yes. You work on a draft and publish it when it is ready. Running cases follow the new setup from their next step. If you remove a stage, any cases on it have to be moved first.",
    },
    {
      question: "How does a process connect to the rest of Opero?",
      answer:
        "It runs on the same records as everything else. Files, comments and generated documents stay on the record, permissions decide who can see it, reports read the same data, and rules can act at any step.",
    },
  ],
};


export const processesFeature: FeaturePageContent = {
  seo: {
    title: "Workflow and BPM Process System",
    description:
      "Design a flow of work as a process: stages, transitions, tasks and kanban. Automate approvals and procedures without code. See workflow in Opero.",
  },
  navLabel: "Processes and workflow",
  navDescription: "Nothing lost between teams",
  hero: {
    title: "Processes and workflow - the whole company runs on your rules",
    description:
      "Design every flow of work as a process. Approvals, document routing and procedures move through defined stages, so nothing gets lost between departments.",
    primaryCta: "Book a demo",
    secondaryCta: "See Opero in action",
  },
  intro: {
    paragraph:
      "Opero is a process engine in which a record moves through stages and transitions (for example New → In progress → Approved → Closed). The process enforces order, permissions and deadlines, and every run stays in the history.",
  },
  demo: {
    kind: "processes",
    columns: ["New", "In progress", "For approval", "Closed"],
    focusCard: { number: "SR/2026/019", title: "VoIP system outage" },
    otherCards: [
      { number: "SR/2026/017", title: "CRM training session" },
      { number: "SR/2026/016", title: "Backup and data migration" },
      { number: "SR/2026/013", title: "Laptop battery replacement" },
    ],
    tasksLabel: "My work",
    task: { title: "Complete the request", meta: "Mark Wilson · today" },
    approvalLabel: "Awaiting approval",
    approveLabel: "Approve",
    rejectLabel: "Reject",
    captions: {
      board: "A record travels <b>through process stages</b>",
      task: "A task lands <b>on the right person’s list</b>",
      approval: "Approval moves it <b>to the next column</b>",
      done: "The process <b>runs itself</b>",
    },
  },
  blocks: {
    title: "A process that enforces order, permissions and deadlines.",
    items: [
      {
        title: "Processes (workflow)",
        description:
          "You model a flow as stages and transitions, with conditions and permissions on every step. Changing the process design does not require a developer.",
      },
      {
        title: "Tasks and kanban boards",
        description:
          "Each stage generates tasks assigned to people, with the option to reassign. Work is visible on a kanban board and in “my tasks” lists.",
      },
      {
        title: "Custom objects carry the process",
        description:
          "You attach a process to any object (Request, Order, Contract), so the flow covers exactly the data you already have.",
      },
      {
        title: "Forms per stage",
        description:
          "At every stage you decide what the user sees and can change. One set of fields for the requester, another for the approver.",
      },
      {
        title: "History and replay",
        description:
          "A full trail of who changed what and when, plus the ability to follow a run step by step.",
      },
    ],
  },
  finalCta: {
    title: "Map your first process in Opero.",
    description: "We will show you how to move a flow out of email and spreadsheets into one controlled process.",
    primaryCta: "Book a demo",
  },
  seoText: {
    title: "A workflow system that enforces order and deadlines.",
    paragraphs: [
      "Opero is a workflow system that turns every process in your company into a repeatable, controlled flow. A record moves through defined stages and transitions while the system enforces order, permissions and deadlines. Instead of decisions scattered across email and spreadsheets, you get one place that shows which stage a case is at, who owns it and what happened before.",
      "Business process management (BPM) in Opero does not require a developer. You design a flow visually: add stages, connect them with transitions, set conditions and the people responsible. Entering a stage opens a task, and the team's work lines up on a kanban board and in \"my tasks\" lists. Request approvals, invoice flow, ticket handling or quality procedures all work exactly the way you describe them.",
      "Because you attach a workflow to any custom object, the flow covers your company's own data rather than a schema imposed by the system. A full history and the ability to replay a run give you the order that both audits and daily work require.",
    ],
  },
  faq: processesFaq,
  related: {
    title: "See also",
    items: ["documents", "noCode", "lowCode"],
  },
};

const heroImage = {
  src: "/opero/processes/hero-workflow-canvas.webp",
  alt: "Opero workflow builder showing the Employee Onboarding process as connected stages on a canvas",
  width: 2111,
  height: 1316,
};

export const processesPage: ProcessesPageContent = {
  seo: processesFeature.seo,
  hero: {
    title: "Give every request an owner, a deadline and a next step.",
    description:
      "Draw how a purchase request, a contract or a cost invoice should move through your company. Opero gives each step a responsible person and a due date, and keeps the record, its files, comments and decisions together in one place.",
    primaryCta: "Book a demo",
    secondaryCta: "Meet Opero",
    image: heroImage,
    magnifier: {
      src: "/opero/processes/hero-workflow-magnifier.webp",
      alt: "Close-up of the HR Setup stage, due in 2 days, with its two transitions: Request IT Setup and Cancel Onboarding",
      width: 900,
      height: 900,
    },
  },
  problem: {
    title: "Who has this request? Who approved it, and when?",
    description:
      "When a process lives in email and a shared spreadsheet, these questions take up the day. In Opero the answers are on the record, for anyone allowed to see it.",
    askedLabel: "What people ask today",
    answerLabel: "What Opero shows",
    rows: [
      { asked: "Who has this now?", answer: "The current stage and the person or team responsible, on the record and on the board." },
      { asked: "Did you get my email?", answer: "Nobody has to send one. The work appears on the owner's task list, with a notification and an email." },
      { asked: "Did anyone approve this?", answer: "Every decision, with the person, the date and their comment, in the record's history." },
      { asked: "Why has this sat here for a week?", answer: "Each task has a due date, and overdue work can trigger a reminder or go to someone else." },
      { asked: "Was it changed after you signed?", answer: "A stage can lock the record, so what was approved stays as it was approved." },
    ],
  },
  story: {
    exampleLabel: "Example: a purchase request",
    title: "12 laptops, from the first form to the order.",
    description:
      "Anna needs 12 laptops for a new team, 38,400 PLN in total. Managers at this company can approve up to 25,000 PLN alone. The names and amounts are an example. The stages, limits and people are whatever you set up.",
    peopleLabel: "What people do",
    operoLabel: "What Opero does",
    steps: [
      {
        stage: "Requested",
        title: "Anna fills in one form.",
        people: "She enters what she needs and how much it costs, attaches the quote and chooses her manager, Mark, as the approver.",
        opero: "Starts the process, puts the request on Mark's task list with a due date and lets him know.",
      },
      {
        stage: "Manager review",
        title: "Mark sees only the options that apply.",
        people: "The amount is over his limit, so he can send it to finance or back to Anna. On a 20,000 PLN request he could approve it himself.",
        opero: "Checks the amount on the record and offers the right actions, so the limit does not depend on anyone remembering it.",
      },
      {
        stage: "Finance approval",
        title: "Finance gets it without anyone forwarding it.",
        people: "Ewa and Tomek both work in finance. Ewa has less on her list right now.",
        opero: "Gives the task to Ewa, with everything attached: the form, the quote and Mark's comment.",
      },
      {
        stage: "Back to Anna",
        title: "Finance asks for a second quote.",
        people: "Ewa writes why and sends it back. Anna adds a better quote, 36,900 PLN, and resubmits on the same request.",
        opero: "Asks for a comment before anything goes back, and keeps it on the record. The discussion stays with the request, not in someone's inbox.",
      },
      {
        stage: "Ordered",
        title: "Ewa approves, and the order goes out.",
        people: "Ewa approves. Anna can see on her own request that it is done, and when.",
        opero: "Locks the approved request, generates the order from your template and emails it to the supplier.",
      },
    ],
  },
  board: {
    title: "The whole team sees the same board.",
    description:
      "Every case sits in the column of its current stage, with its owner on the card. Your team can see what is waiting and for whom, and move work on by dragging a card, as far as your process allows.",
    demo: {
      columns: ["Requested", "Manager review", "Finance approval", "Ordered"],
      focusCard: { number: "PR/2026/041", title: "12 laptops for the new team" },
      otherCards: [
        { number: "PR/2026/044", title: "Trade fair stand" },
        { number: "PR/2026/039", title: "Warehouse shelving" },
        { number: "PR/2026/036", title: "Office chairs" },
      ],
      tasksLabel: "My work",
      task: { title: "Review the request", meta: "Mark Wilson · due in 2 days" },
      approvalLabel: "Awaiting approval",
      approveLabel: "Approve",
      rejectLabel: "Send back",
      captions: {
        board: "The request moves <b>to Manager review</b>",
        task: "Mark has it, <b>due in 2 days</b>",
        approval: "Over the limit, so <b>finance approves it</b>",
        done: "Approved, and <b>the request is closed</b>",
      },
    },
  },
  departments: {
    title: "One platform, a process for every department.",
    description:
      "Six examples, all built from the same parts. Pick the one closest to something you run today.",
    tablistLabel: "Example processes by department",
    scenarios: [
      {
        department: "HR",
        process: "Employee onboarding",
        situation: "The new hire starts Monday. Nobody knows the laptop never arrived.",
        stages: [
          { name: "Contract signed", icon: "pen", tone: "intake", owner: "HR", auto: "Reminder before the start date" },
          { name: "HR paperwork", icon: "clipboard", tone: "work", owner: "HR", due: "3 days" },
          { name: "IT equipment", icon: "laptop", tone: "work", owner: "IT, whoever has the least on", due: "5 days" },
          { name: "Manager preparation", icon: "user", tone: "work", owner: "Team manager", due: "2 days" },
          { name: "Active", icon: "check", tone: "done", owner: "New hire", auto: "Welcome email" },
        ],
      },
      {
        department: "Legal",
        process: "Contract review",
        situation: "Sales and legal swap attachments, and nobody knows which version went for signature.",
        stages: [
          { name: "Draft", icon: "pen", tone: "intake", owner: "Contract author", due: "2 days" },
          { name: "Legal review", icon: "scale", tone: "work", owner: "Legal", due: "3 days", auto: "Comment if sent back" },
          { name: "Management sign-off", icon: "stamp", tone: "approve", owner: "Management", due: "2 days", lock: "Terms locked" },
          { name: "Signed", icon: "check", tone: "done", owner: "Contract author", auto: "Document from your template" },
        ],
      },
      {
        department: "Finance",
        process: "Cost invoice approval",
        situation: "An invoice arrives. Who ordered it, and who signs?",
        stages: [
          { name: "Registered", icon: "inbox", tone: "intake", owner: "Office", due: "1 day" },
          { name: "Description", icon: "pen", tone: "work", owner: "Person who ordered", due: "3 days" },
          { name: "Approval", icon: "stamp", tone: "approve", owner: "Budget owner", due: "2 days", auto: "Comment if rejected" },
          { name: "Pre-posting", icon: "calculator", tone: "work", owner: "Accounting", due: "2 days" },
          { name: "Sent to accounting", icon: "send", tone: "work", owner: "Accounting", lock: "Invoice locked" },
          { name: "Booked", icon: "check", tone: "done", owner: "Accounting" },
        ],
      },
      {
        department: "Sales",
        process: "Discount approval",
        situation: "Someone agreed to 18% off in chat. Three months later, finance asks who.",
        stages: [
          { name: "Proposal", icon: "pen", tone: "intake", owner: "Salesperson", due: "1 day" },
          { name: "Sales lead approval", icon: "stamp", tone: "approve", owner: "Sales lead", due: "1 day", auto: "Discounts up to 15%" },
          { name: "Finance approval", icon: "stamp", tone: "approve", owner: "Finance", due: "1 day", auto: "Only above 15%" },
          { name: "Sent to client", icon: "send", tone: "work", owner: "Salesperson", auto: "Proposal from your template" },
          { name: "Closed", icon: "check", tone: "done", owner: "Salesperson", lock: "Decision stays on the deal" },
        ],
      },
      {
        department: "Operations",
        process: "Maintenance and repairs",
        situation: "A line stops at 06:40. By Friday, the only record is the technician's memory.",
        stages: [
          { name: "Reported", icon: "alert", tone: "intake", owner: "Anyone, on a form" },
          { name: "Scheduled", icon: "calendar", tone: "work", owner: "Coordinator", due: "1 day" },
          { name: "In progress", icon: "wrench", tone: "work", owner: "Technicians, in turn", due: "2 days" },
          { name: "Completed", icon: "clipboard", tone: "approve", owner: "Supervisor", due: "1 day", auto: "Needs a completion date" },
          { name: "Closed", icon: "check", tone: "done", owner: "Supervisor", auto: "Reminder before next service" },
        ],
      },
      {
        department: "Quality",
        process: "Non-conformance handling",
        situation: "An auditor asks who checked the fix from March. The search through folders begins.",
        stages: [
          { name: "Reported", icon: "alert", tone: "intake", owner: "Production" },
          { name: "Investigation", icon: "search", tone: "work", owner: "Quality", due: "5 days" },
          { name: "Corrective action", icon: "wrench", tone: "work", owner: "Owning department", due: "10 days" },
          { name: "Verification", icon: "shield", tone: "approve", owner: "Quality", due: "3 days", auto: "Comment if the fix fails" },
          { name: "Closed", icon: "check", tone: "done", owner: "Quality", lock: "Locked, with full history" },
        ],
      },
    ],
  },
  ownership: {
    title: "Work lands on the right person's list.",
    description:
      "People start the day from My tasks, with everything assigned to them across every process in one list. Nothing has to be forwarded to count as handed over.",
    bullets: [
      "Assign a step to a named person or to a whole team",
      "Share work out in turn, or give it to whoever has the least on",
      "Let the person handing over choose who gets it next",
      "Hand a task to a colleague when plans change, with the change kept in the history",
    ],
    image: {
      src: "/opero/processes/my-tasks.webp",
      alt: "Opero My tasks page listing open tasks from several processes with their stages and due dates",
      width: 2000,
      height: 1400,
    },
  },
  approvals: {
    title: "Your approval rules, built into the process.",
    description:
      "The rule \"anything over the limit also goes to the board\" usually lives in one person's head. In Opero it is part of the process, so it applies on a busy Friday and when that person is away.",
    bullets: [
      "Offer an action only when the record qualifies, for example above a certain amount",
      "Stop a case moving on until the required information is filled in",
      "Ask for a comment whenever someone rejects or returns a case",
      "Decide at each stage who can edit the record, and lock it where it must not change",
    ],
    image: {
      src: "/opero/processes/transition-required-comment.webp",
      alt: "Rejecting a leave request in Opero, in a dialog that requires a comment before the move can be made",
      width: 1000,
      height: 700,
    },
  },
  deadlines: {
    title: "What happens when a task sits too long.",
    description:
      "Each stage can have its own deadline, and you decide what happens around it. Here is one way to set it up for a finance approval with three days to complete.",
    moments: [
      { when: "1 day before", title: "A nudge for the owner", detail: "A notification or an email, while there is still time.", tone: "calm" },
      { when: "Due date", title: "Shown where people look", detail: "On the task list and on the calendar, in the same place people plan their week.", tone: "due" },
      { when: "1 day after", title: "The team lead finds out", detail: "From Opero, before anyone comes to complain.", tone: "late" },
      { when: "4 days after", title: "The work moves", detail: "A rule hands the task to a colleague, and the change goes in the history.", tone: "late" },
    ],
    note: "The timing and the actions are yours: one reminder or several, for every task or only some. The same rules can also generate a document, send an email or update a record.",
  },
  visibility: {
    title: "See where everything stands, without a status meeting.",
    description:
      "Every process can have its own board, with a count of cases at each stage and the owner on each card. Bottlenecks show up as a full column, and you can open any card to see why.",
    bullets: [
      "Add the board beside the table on a list your team already uses",
      "See tasks with due dates on a calendar",
      "Everyone sees their own tasks, and people you allow can see everyone's",
      "Run one process across a group of companies, or a different one in each",
    ],
    image: {
      src: "/opero/processes/process-board.webp",
      alt: "Opero board with customer requests in columns by workflow stage, each card showing its priority, customer, category, channel and owner",
      width: 2000,
      height: 1389,
    },
  },
  history: {
    title: "When someone asks what happened, it is on the record.",
    description:
      "Half a year later, a client, an auditor or your own boss asks who agreed to it. Open the record and follow it from start to finish, with a timeline of decisions and a map of the route it took.",
    bullets: [
      "Every move, with the person, the date and the comment",
      "Changes of owner along the way",
      "The route drawn on the process map, step by step",
      "Moves made by an automation or an integration marked as such",
    ],
    image: {
      src: "/opero/processes/workflow-history.webp",
      alt: "Opero workflow history for one record, showing the route taken through the stages next to a timeline of moves",
      width: 2000,
      height: 1400,
    },
    magnifier: {
      src: "/opero/processes/workflow-history-magnifier.webp",
      alt: "Close-up of the history timeline: Submit Request and Send to Manager, each with its comment and date",
      width: 900,
      height: 900,
    },
  },
  faq: processesFaq,
  related: {
    title: "See also",
    items: [
      { feature: "lowCode", title: "Low-code and automation", description: "The rules behind reminders, documents and emails, and scripts where you need more." },
      { feature: "documents", title: "Documents", description: "Generate documents from templates and keep them on the case they belong to." },
      { feature: "noCode", title: "No-code platform", description: "Build the objects, forms and menus your processes run on." },
    ],
  },
  finalCta: {
    title: "Bring the process that causes the most trouble.",
    description: "The one that lives in email threads and in one person's head. In the demo we will map it in Opero with you, so you can see how it would run.",
    primaryCta: "Book a demo",
    secondaryCta: "Contact us",
  },
  seoText: {
    title: "Workflow and BPM software on one platform with your data.",
    paragraphs: [
      "Opero is a workflow system that turns a company's processes into clear stages, with an owner and a due date at each step. You draw the flow on a canvas and attach it to your own records, or to contractors, invoices, budgets and helpdesk tickets. Approvals, handovers and reminders then follow the rules you set, and every decision stays in the record's history.",
      "Business process management (BPM) in Opero does not require a developer. Request approval, invoice flow, ticket handling and quality procedures share the same kanban boards, task lists, documents and reports, so a new process does not mean a new tool.",
    ],
  },
};
