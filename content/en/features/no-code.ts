import type { FeaturePageContent } from "@/content/types";

export const noCodeFeature: FeaturePageContent = {
  seo: {
    title: "No-Code Platform for Building Applications | Opero",
    description:
      "Design data, views and navigation in visual configuration. Build your own business system without a developer on the Opero no-code platform.",
  },
  navLabel: "No-code platform",
  hero: {
    eyebrow: "System features",
    title: "No-code - build your own system without a developer",
    description:
      "You design the data, the layouts and the navigation in visual configuration. Opero turns them into a working application, with no code written.",
    primaryCta: "Book a demo",
    secondaryCta: "See Opero in action",
  },
  intro: {
    eyebrow: "In short",
    paragraph:
      "No-code in Opero is a set of building blocks you assemble an application from: custom objects and fields describe the data, forms and layouts build the views, menus and custom pages build the navigation, and dictionaries and custom lists keep everything consistent.",
  },
  demo: {
    kind: "noCode",
    paletteLabel: "Fields",
    paletteItems: ["Text", "Select list", "Date", "Number", "File"],
    formTitle: "Request form",
    formFields: ["Title", "Category", "Due date"],
    previewLabel: "Preview",
    record: {
      title: "New request",
      rows: [
        { label: "Title", value: "VoIP system outage" },
        { label: "Category", value: "Outage" },
        { label: "Due date", value: "2026-08-14" },
      ],
      saveLabel: "Save",
    },
    captions: { drag: "You drag a field <b>onto the form</b>", second: "You pick the field type <b>from a list, not in code</b>", preview: "And the form <b>works right away</b>" },
  },
  blocks: {
    eyebrow: "What you get",
    title: "The blocks an application is made of.",
    items: [
      {
        title: "Custom objects and fields",
        description:
          "You define data types and their properties from more than 20 field types (text, amount, date, choice, relation, file, calculated). Structure changes go through a safe draft.",
      },
      {
        title: "Child objects",
        description:
          "Nested tables inside a record (line items, stages, participants) for one-to-many relations.",
      },
      {
        title: "Forms and layouts",
        description:
          "You control access to fields and the visual arrangement of sections, tabs and components, with versioning.",
      },
      {
        title: "Menus and custom pages",
        description:
          "You arrange the navigation and build any page you need (dashboards, instructions, panels) beyond the standard object-to-form pattern.",
      },
      {
        title: "Dictionaries and custom lists",
        description: "Controlled values and lightweight reference sets that keep the data in check.",
      },
      {
        title: "Processes on your data",
        description: "You can attach a workflow to any object, so the application handles flows from day one.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Next step",
    title: "Build your first object in minutes.",
    description: "We will show you how an empty instance becomes a working application, without a single line of code.",
    primaryCta: "Book a demo",
  },
  seoText: {
    eyebrow: "More about this",
    title: "An application built without code, shaped around your company.",
    paragraphs: [
      "The Opero no-code platform lets you build your own business system without writing code. You describe the data structure with custom objects and fields (more than 20 types: text, amount, date, choice, relation, file, calculated field), and Opero immediately generates lists, forms and the interface. Structure changes go through a safe draft before they reach production.",
      "You assemble views from forms and layouts. A form decides which fields a user sees and in what mode, while a layout controls the visual arrangement of sections and tabs. You build navigation with menus and custom pages, and dictionaries and custom lists keep the data consistent. All of it is visual configuration, open to people without a development background.",
      "An application built with no-code does not stop at what you design on day one. You can attach a workflow, rules and reports to any object, so the system grows with the company and handles exactly the processes you need. It is a faster path to a tailor-made solution than a classic development project.",
    ],
  },
  faq: {
    eyebrow: "Questions",
    title: "Frequently asked questions.",
    items: [
      {
        question: "Can I really build an application without a developer?",
        answer:
          "Yes. Objects, fields, forms, layouts and menus are created visually, without code. Advanced logic can be added in the low-code layer, but it is not required for a working application.",
      },
      {
        question: "What is a custom object?",
        answer:
          "It is a data definition you design yourself, the equivalent of a table (for example Client, Contract, Request). Opero generates views and lists for it.",
      },
    ],
  },
  related: {
    eyebrow: "Related features",
    title: "See also",
    items: ["processes", "lowCode", "reports"],
  },
};
