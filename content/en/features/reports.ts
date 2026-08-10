import type { FeaturePageContent } from "@/content/types";

export const reportsFeature: FeaturePageContent = {
  seo: {
    title: "Reports and analytics in Opero - tables, charts, dashboards",
    description:
      "Build reports, charts and dashboards on live system data. Drill-down takes you from a metric to the source records, with no export to spreadsheets.",
  },
  navLabel: "Reports and analytics",
  hero: {
    eyebrow: "System features",
    title: "Reports and analytics - decisions on data, not on hunches",
    description:
      "Build tables, charts and dashboards on live system data. From an aggregate number you can go down to a single record without exporting to a spreadsheet.",
    primaryCta: "Book a demo",
    secondaryCta: "See Opero in action",
  },
  intro: {
    eyebrow: "In short",
    paragraph:
      "Opero reports aggregate and group object data, present it in tables and charts, and through drill-down lead from a metric to the source records. Dashboards collect the numbers that matter most, and SQL queries cover the unusual cuts of data.",
  },
  blocks: {
    eyebrow: "What you get",
    title: "From a metric down to a single record.",
    items: [
      {
        title: "Reports",
        description:
          "Aggregations, groupings and metrics on system data, with drill-down to the source records.",
      },
      {
        title: "Charts",
        description: "Visualisations of trends and distributions inside the report, readable for the board.",
      },
      {
        title: "Dashboards",
        description:
          "Boards of tiles and widgets that collect key metrics and shortcuts in one place, separately for each team.",
      },
      {
        title: "SQL queries as a source",
        description:
          "When standard filters are not enough, you feed the report with your own parameterised query.",
      },
    ],
  },
  finalCta: {
    eyebrow: "Next step",
    title: "See your data in one place.",
    description: "We will show you a report and a dashboard built on your own data type.",
    primaryCta: "Book a demo",
  },
  related: {
    eyebrow: "Related features",
    title: "See also",
    items: ["lowCode", "noCode", "ai"],
  },
};
