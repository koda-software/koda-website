import type { FeaturePageContent } from "@/content/types";

export const noCodeFeature: FeaturePageContent = {
  seo: {
    title: "No-code platform - build your own system in Opero",
    description:
      "Custom objects, fields, forms, layouts, menus, custom pages and dictionaries. You design data and views in visual configuration, with no code.",
  },
  navLabel: "No-code platform",
  hero: {
    eyebrow: "System features",
    title: "No-code - build your own system without a developer",
    description:
      "You design the data, the layouts and the navigation in visual configuration. Opero turns them into a working application, with no code written.",
    primaryCta: "Book a demo",
    secondaryCta: "See Opero in action",
    shot: {
      src: "/features/no-code-hero.png",
      width: 1926,
      height: 1082,
      caption: "A form built without code",
      alt: "A \"Create counterparty\" form in Opero with fields such as Acronym, Full name, Country and Tax ID, generated from an object's configuration",
    },
  },
  intro: {
    eyebrow: "In short",
    paragraph:
      "No-code in Opero is a set of building blocks you assemble an application from: custom objects and fields describe the data, forms and layouts build the views, menus and custom pages build the navigation, and dictionaries and custom lists keep everything consistent.",
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
  shots: {
    eyebrow: "What it looks like",
    title: "From data structure to a finished view.",
    items: [
      {
        src: "/features/no-code-dashboard.webp",
        width: 2000,
        height: 986,
        caption: "The end result: a working application",
        alt: "Dashboard of a finished Opero application with modules such as Accounting, Counterparties, Service and HR",
      },
    ],
  },
  finalCta: {
    eyebrow: "Next step",
    title: "Build your first object in minutes.",
    description: "We will show you how an empty instance becomes a working application, without a single line of code.",
    primaryCta: "Book a demo",
  },
  related: {
    eyebrow: "Related features",
    title: "See also",
    items: ["processes", "lowCode", "reports"],
  },
};
