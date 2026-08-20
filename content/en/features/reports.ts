import type { FeaturePageContent } from "@/content/types";

export const reportsFeature: FeaturePageContent = {
  seo: {
    title: "Reports, Dashboards and Data Analytics | Opero",
    description:
      "Build reports, charts and dashboards on live data. Drill down from a metric to a record with no export to spreadsheets. Business analytics in Opero.",
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
  demo: {
    kind: "reports",
    tableTitle: "Requests by category",
    columns: ["Category", "Count", "Value"],
    rows: [
      { category: "Outage", count: "7", value: "18,400.00" },
      { category: "Installation", count: "5", value: "12,100.00" },
      { category: "Maintenance", count: "4", value: "6,900.00" },
      { category: "Complaint", count: "2", value: "2,300.00" },
    ],
    chartTitle: "Request value by category",
    drillTitle: "Outage - records behind the bar",
    drillRows: [
      { number: "SR/2026/019", title: "VoIP system outage", value: "1,800.00" },
      { number: "SR/2026/013", title: "File server outage", value: "9,400.00" },
      { number: "SR/2026/007", title: "UPS power outage", value: "7,200.00" },
    ],
    captions: { table: "A plain table of data", chart: "The same report <b>as a chart</b>", drill: "Click a bar - and see <b>the records behind it</b>" },
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
          "Boards of tiles and widgets that collect the metrics that matter most and shortcuts, separately for each team.",
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
    title: "See your data the way you actually need it.",
    description: "We will show you a report and a dashboard built on your own data type.",
    primaryCta: "Book a demo",
  },
  seoText: {
    eyebrow: "More about this",
    title: "Operational data turned into decisions.",
    paragraphs: [
      "Reports in Opero turn operational data into decisions. You build tables on object data: aggregations, groupings, metrics and charts run on live information from the system, with no export to spreadsheets. Drill-down takes you from an aggregate value down to the individual records behind it, so every number can be checked at the source.",
      "Dashboards collect the metrics that matter most on a single board. You arrange tiles and widgets with metrics, charts and shortcuts separately for each team, so everyone opens the system on what is relevant to them. This is analytics you use daily, not once a quarter.",
      "When standard filters are not enough, you feed the report with your own SQL query. Parameterised queries let you cut the data exactly the way you need and reuse that cut elsewhere. Reporting in Opero combines the simplicity of a daily glance with the power of deeper analysis.",
    ],
  },
  faq: {
    eyebrow: "Questions",
    title: "Frequently asked questions.",
    items: [
      {
        question: "What is drill-down in a report?",
        answer:
          "It is the move from an aggregate value to the records that make it up. You click a number on the report and see the specific entries behind it.",
      },
      {
        question: "Do reports run on current data?",
        answer: "Yes. Reports and dashboards are built on live system data, so they show the current state without a manual refresh.",
      },
    ],
  },
  related: {
    eyebrow: "Related features",
    title: "See also",
    items: ["lowCode", "noCode", "ai"],
  },
};
