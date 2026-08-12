import { localizePath } from "@/lib/i18n/routes";
import type { AboutPageContent } from "../types";

export const aboutContent: AboutPageContent = {
  seo: {
    title: "About us - the team behind Opero",
    description:
      "Meet KodaSoft, the team behind Opero. Years of BPM, workflow, document management, DMS and ERP rollouts turned into a flexible low-code platform.",
  },
  hero: {
    eyebrow: "About us",
    title: "We are the team that builds Opero",
    description:
      "For years we rolled out BPM, workflow, document management, DMS, ERP and BI systems, along with low-code and no-code platforms. We learned their limits from the inside. Opero is our answer: a platform that begins where packaged software ends.",
    primaryCta: "Book a demo",
    secondaryCta: "See system features",
  },
  identity: {
    eyebrow: "Who we are",
    title: "Years of implementation practice turned into one product.",
    paragraphs: [
      "KodaSoft is a team of implementation consultants and engineers. We did not start from an idea for software, but from hundreds of hours spent with clients: mapping processes, putting document workflow in order, and trying to fit a rigid system to a company that had just changed.",
      "Every one of those projects left us with the same conclusion. Companies do not need another closed system with a list of features. They need a tool they can shape around the way they work, and reshape when that way changes. Opero exists so that this is possible without rewriting the system from scratch.",
    ],
  },
  origin: {
    eyebrow: "Where Opero came from",
    title: "We saw exactly where packaged systems stop.",
    paragraphs: [
      "We implemented BPM and workflow systems, electronic document workflow, DMS repositories, low-code and no-code platforms, ERP systems, and reporting and BI tools. Different vendors, different industries, and companies at very different levels of process maturity.",
      "That gave us a rare perspective: we saw not only what these systems can do, but above all where they stop. One moves a document through approvals beautifully but will not let you describe your own data. Another lets you build any form you like but has no real process engine underneath. A third has everything, except that every change means a project, a quote and several weeks of waiting.",
      "Every time, the limit sat in the same place: the system was finished, and the company kept changing. At some point we stopped looking for a system that could carry that, and started building one. That is how Opero came about.",
    ],
    manifesto:
      "We do not describe Opero as a complete system, because it is not packaged software you switch on and use. Opero is flexible, it grows with the company, and it supports it at every stage of its development.",
  },
  mission: {
    eyebrow: "Our mission",
    title: "We give companies a system that adapts to them, not the other way round.",
    description:
      "We want change inside a company to stop meaning an IT project. A new process, a new document type, a new department or a new line of business should be something you configure in Opero, not something you order from a vendor. Our measure of success is how much a company can do in Opero on its own, not how many features we managed to list in a proposal.",
  },
  beliefs: {
    eyebrow: "What we believe",
    title: "Six convictions you can see in the product.",
    description:
      "These are not slogans for a website. Each one turns into a concrete design decision in Opero and into the way we run implementations.",
    items: [
      {
        title: "A system should grow with the company.",
        description:
          "The company that rolls out a system and the same company three years later are two different organisations. We design Opero so the second one does not have to start over.",
      },
      {
        title: "A company should not have to fit its software.",
        description:
          "Packaged systems impose their data structure and their way of working. In Opero you define the custom objects, fields, forms and processes, so the system speaks your language.",
      },
      {
        title: "Change must not require a developer.",
        description:
          "A new stage in a process, an extra field, a different form layout or a new rule is configuration, not an implementation project. That is how the system keeps up with the company in weeks rather than quarters.",
      },
      {
        title: "One system instead of five tools.",
        description:
          "Processes, documents, files, operational data and reports in one place mean one history, one set of permissions and one truth about a case. Integrations should complete the picture, not stitch it together from pieces.",
      },
      {
        title: "Flexibility without chaos.",
        description:
          "Freedom to configure only makes sense when permissions, change history and version control sit underneath it. Opero lets you build a lot, but it does not let you lose track of what happened.",
      },
      {
        title: "Implementation knowledge is part of the product.",
        description:
          "Every pattern that proved itself at a client comes back into the platform as a ready-made template. Our experience should be a shortcut for the next company, not a resource sold by the hour.",
      },
    ],
  },
  background: {
    eyebrow: "Experience that goes into the product",
    title: "Every one of these areas left its mark on the platform.",
    description:
      "Opero was not built in isolation from the market. Below is what working with each class of system taught us.",
    rows: [
      {
        label: "BPM and workflow",
        lesson:
          "Processes have to be modelled as stages and transitions, with conditions and ownership at every step. Without that, approvals go back to email.",
      },
      {
        label: "Document workflow",
        lesson: "A document is not a file, it is a case with its own data, its own flow and its own history.",
      },
      {
        label: "DMS",
        lesson: "Versioning and access control over files are the condition for trusting the system at all.",
      },
      {
        label: "Low-code",
        lesson: "Rules and scripts have to be available when configuration stops being enough, but not before.",
      },
      {
        label: "No-code",
        lesson:
          "If a key change cannot be made without a developer, the system effectively freezes in the state it had on go-live day.",
      },
      {
        label: "ERP",
        lesson:
          "Company data has to be consistent, but a rigid data model is exactly what most often blocks growth.",
      },
      {
        label: "BI and reporting",
        lesson:
          "A report is worth as much as the data beneath it, so the clean-up has to happen at the process level, not at the chart level.",
      },
    ],
  },
  approach: {
    eyebrow: "How we work",
    title: "Four principles we run implementations by.",
    items: [
      {
        title: "We start from the process, not the module.",
        description:
          "First we understand how a case moves through the company, and only then do we decide what to configure in Opero.",
      },
      {
        title: "We roll out in stages and show a working system early.",
        description:
          "Better to launch one process and test it in practice than to design the whole thing on paper for six months.",
      },
      {
        title: "We teach the client to run the system themselves.",
        description:
          "After go-live we want the company to be able to add a field, change a form and fix a process on its own.",
      },
      {
        title: "We develop the platform from real implementations.",
        description:
          "The Opero roadmap comes from needs we see at clients, not from a competitor's feature list.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Book a demo",
    title: "See Opero in action",
    description:
      "The fastest way to judge whether Opero fits your company is to see it running your process. We will show you how the flow you handle today in email and spreadsheets looks inside it.",
    primaryCta: "Book a demo",
    secondaryCta: "Explore system features",
  },
  seoText: {
    eyebrow: "KodaSoft and Opero",
    title: "The maker of a low-code platform for processes and documents.",
    paragraphs: [
      "KodaSoft is the maker of Opero, a low-code platform for managing a company's processes, documents and data. The team behind the system has years of experience implementing BPM, workflow, document management, DMS and ERP software, as well as reporting and BI tools. That experience is the foundation of the product today: we know what an approval flow, document registration, work across many departments, and the moment a company outgrows its system actually look like.",
      "We design Opero as a platform, not as closed software. The organisation defines its own objects, fields, forms, layouts and processes in it, so the system describes its reality instead of imposing the vendor's template. Changing the configuration does not require a developer, so you launch a new process or a new document type when it is needed.",
      "We believe business software should grow with the company and support it at every stage: from the first orderly document workflow, through automating the work of one department after another, to full control over processes and data across the whole organisation.",
    ],
  },
  faq: {
    eyebrow: "Common questions",
    title: "About KodaSoft and Opero",
    items: [
      {
        question: "Who builds Opero?",
        answer:
          "Opero is built at KodaSoft, a team with years of experience implementing BPM, workflow, document management, DMS and ERP systems, as well as low-code and no-code platforms.",
      },
      {
        question: "How does Opero differ from a packaged ERP or document management system?",
        answer:
          "Opero does not impose its own data model or processes. The company defines custom objects, forms and flows, so the system adapts to the way it works and changes along with it.",
      },
      {
        question: "Is Opero finished software?",
        answer:
          "Opero is a platform with ready mechanisms for processes, documents, permissions and reports, configured for a specific company. That is why we describe it as flexible rather than complete in the sense of a closed feature list.",
      },
      {
        question: "Do you need a developer to change the system?",
        answer:
          "No. Objects, forms, layouts, processes and rules are configured without code, and low-code mechanisms are there for when non-standard logic is needed.",
      },
    ],
  },
};

export const aboutCtas = {
  primary: localizePath("en", "contact"),
  secondary: localizePath("en", "opero"),
};
