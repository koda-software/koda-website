import type { ReportsPageContent } from "@/content/feature-stories/reports.types";
import type { FeaturePageContent } from "@/content/types";

const reportsFaq: FeaturePageContent["faq"] = {
  title: "Frequently asked questions.",
  items: [
    {
      question: "What exactly happens when I click a number?",
      answer:
        "Opero runs the report's saved query again with your filters, narrowed to that cell's row and column, and lists the raw rows, 1,000 per page by default with a load more button. It works on pivot cells, subtotals and chart marks in every report, with no setup. If the author maps a column holding the record id to a record type, each row also gets an open-record button, and the record's own access rules still apply.",
    },
    {
      question: "How fresh are the numbers?",
      answer:
        "Reports query the live tables, and there is no overnight copy. A result can be reused for 300 seconds by default, a value you can change or set to 0. The refresh button runs the query again straight away, and editing the report or its saved query stops the old result being used.",
    },
    {
      question: "Do we need to know SQL?",
      answer:
        "Someone does, once, or an AI agent connected to Opero over MCP can write the query and preview the numbers. Every report reads one saved SQL query. Laying out rows, measures and charts is visual, and viewers never see the SQL. Our team can also write the queries as part of an implementation.",
    },
    {
      question: "Who can see which numbers?",
      answer:
        "A report has no audience of its own. Whoever can open the page or record layout that embeds it can read it, including every column the saved query returns, through drill-down and raw export. So give sensitive numbers a page with a narrow audience and leave columns out of the query if viewers should not read them. Records on objects set to owner-only visibility are not filtered per owner in SQL-based reports, and the author gets a warning about it when saving.",
    },
    {
      question: "Can one report cover several companies?",
      answer:
        "Yes, with the ORGANIZATION_REPORTING scope. It runs across every company in the organization, and only for a viewer who holds org.companyData.readAll; anyone else is refused. API tokens never get it. The report adds up what the query returns, so eliminating intercompany sales or converting currencies has to be written into the SQL.",
    },
    {
      question: "What are the limits on Excel export?",
      answer:
        "You choose the aggregated view or the raw source rows, as XLSX or CSV, with your filters applied. By default raw exports stop at 250,000 rows and aggregated results at 50,000. There is no PDF export of a report.",
    },
    {
      question: "What happens with a very large report?",
      answer:
        "By default a run has a 30-second statement timeout, which can be raised to at most 60 seconds. A result over 50,000 rows is cut off and the viewer sees a warning asking them to narrow it with filters or fewer dimensions.",
    },
    {
      question: "What breaks if someone changes the saved query?",
      answer:
        "The report keeps loading, so one renamed column does not take a dashboard down. The report's configuration lists the columns that no longer resolve, and those columns stop aggregating until the author rebinds them.",
    },
    {
      question: "Can a report change our data?",
      answer:
        "No. A report accepts only a FETCH saved query, and a MUTATION query is rejected at validation. FETCH queries run on the read-only database role app_readonly.",
    },
    {
      question: "What about data from other systems?",
      answer:
        "A report reads what is in Opero, and the SQL validator refuses dblink. Data from another system has to arrive first, through an integration or the API. After that it can be joined with everything else.",
    },
  ],
};

export const reportsFeature: FeaturePageContent = {
  seo: {
    title: "Reports, Dashboards and Data Analytics",
    description:
      "Build reports, charts and dashboards on live data. Drill down from a metric to a record with no export to spreadsheets. Business analytics in Opero.",
  },
  navLabel: "Reports and analytics",
  navDescription: "Decide on data, not on hunches",
  hero: {
    title: "Reports and analytics - decisions on data, not on hunches",
    description:
      "Build tables, charts and dashboards on live system data. From an aggregate number you can go down to a single record without exporting to a spreadsheet.",
    primaryCta: "Book a demo",
    secondaryCta: "See Opero in action",
  },
  intro: {
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
    title: "See your data the way you actually need it.",
    description: "We will show you a report and a dashboard built on your own data type.",
    primaryCta: "Book a demo",
  },
  seoText: {
    title: "Operational data turned into decisions.",
    paragraphs: [
      "Reports in Opero turn operational data into decisions. You build tables on object data: aggregations, groupings, metrics and charts run on live information from the system, with no export to spreadsheets. Drill-down takes you from an aggregate value down to the individual records behind it, so every number can be checked at the source.",
      "Dashboards collect the metrics that matter most on a single board. You arrange tiles and widgets with metrics, charts and shortcuts separately for each team, so everyone opens the system on what is relevant to them. This is analytics you use daily, not once a quarter.",
      "When standard filters are not enough, you feed the report with your own SQL query. Parameterised queries let you cut the data exactly the way you need and reuse that cut elsewhere. Reporting in Opero combines the simplicity of a daily glance with the power of deeper analysis.",
    ],
  },
  faq: reportsFaq,
  related: {
    title: "See also",
    items: ["lowCode", "noCode", "ai"],
  },
};

export const reportsPage: ReportsPageContent = {
  hero: {
    title: "Reports on live Opero records. Click any figure to see its rows.",
    description:
      "A report is one saved SQL query plus a pivot table or a bar, line, area, pie, donut or scatter chart. It reads the contractors, invoices, budgets, tickets and custom objects your team works in. Viewers can regroup it, filter it and export it to XLSX or CSV without changing it for anyone else.",
    primaryCta: "Book a demo",
    secondaryCta: "Meet Opero",
    image: {
      src: "/opero/reports/hero.webp",
      alt: "Opero report page with a pivot table of open deals, filters and a field shelf",
      width: 2111,
      height: 1316,
    },
  },
  problem: {
    title: "Two people bring two October totals to Monday's meeting.",
    description:
      "An example: one person exports sales on Thursday, Mark exports on Friday, and each repairs the formulas and emails a workbook. On Monday the files say 1,284,500 and 1,261,900, which is 22,600 apart. The first question is which invoices make up the gap, and neither file can answer it.",
    comparison: {
      title: "Revenue Risk Matrix",
      ariaLabel: "Compare Sheets and Opero",
      beforeLabel: "Sheets",
      beforeAlt: "Spreadsheet showing revenue risk matrix source rows",
      afterLabel: "Opero",
      afterAlt: "Opero report interface showing a revenue risk matrix",
    },
    ledger: {
      moment: "The moment",
      spreadsheet: "The Monday spreadsheet",
      opero: "The same report in Opero",
      rows: [
        { moment: "Where the number comes from", spreadsheet: "An export someone ran on Thursday", opero: "A query on the live tables, with a result reused for 5 minutes at most by default" },
        { moment: "Who has the right version", spreadsheet: "Whoever sent the last attachment", opero: "Every page embeds the same report by id, so there is no copy" },
        { moment: "Someone asks \"which invoices?\"", spreadsheet: "Back to the source, with an answer tomorrow", opero: "Click the cell and the source rows open, 1,000 per page" },
        { moment: "The question changes", spreadsheet: "A new tab and another round of formulas", opero: "Move a field on the shelf. The saved report stays as it was" },
        { moment: "The author leaves the company", spreadsheet: "Nobody dares touch the file", opero: "Query and layout are organization configuration, editable by anyone with org.reports.update" },
      ],
    },
  },
  drill: {
    title: "Click the Outage bar and see the 3 requests behind 18,400.",
    description:
      "In this example 14 requests are worth 39,700, and 3 outages account for 18,400 of it. Clicking the bar or the table cell runs the saved query again, narrowed to Outage with your filters kept, and lists the rows: file server 9,400, UPS 7,200, VoIP 1,800.",
    demo: {
      tableTitle: "Requests by category",
      columns: ["Category", "Count", "Value"],
      rows: [
        { category: "Outage", count: "3", value: "18,400.00" },
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
      captions: { table: "A pivot table for the detail", chart: "A chart <b>for the meeting</b>", drill: "Click a bar - and see <b>the records behind it</b>" },
    },
    points: [
      { title: "No setup per report", description: "Drill-down works on cells, subtotals and chart marks in every report. A subtotal opens all the rows in its group, 1,000 per page with load more." },
      { title: "What the list contains", description: "Every column the query returns, for every row in that group. Clicking a late count of 3 lists all 12 requests in the category, and a late column shows which 3." },
      { title: "Then the record itself", description: "The author maps a column holding the record id to a record type, and each row gets an open-record button. The record's own access rules still decide who gets in." },
    ],
  },
  questions: {
    title: "Six weekly questions and how each report is built.",
    description:
      "All figures below are example data. The \"How it is built\" line is the real setup in Opero, including the formula where one is needed.",
    labels: {
      tabsLabel: "Departments",
      builtLabel: "How it is built",
      drillLabel: "Click a row",
      exampleNote: "Example data",
    },
    scenarios: [
      {
        department: "Sales",
        question: "How much of a 562,000 pipeline can we count on?",
        answer: "Weighted by probability it is 270,500, under half of the face value. Negotiation is only 5 of the 28 deals but carries 106,500 of that, because those deals count at 75% and Qualified at 25%.",
        reportTitle: "Open deals by stage",
        columns: ["Stage", "Deals", "Value", "Weighted"],
        rows: [
          ["Qualified", "14", "184,000", "46,000"],
          ["Proposal", "9", "236,000", "118,000"],
          ["Negotiation", "5", "142,000", "106,500"],
        ],
        total: ["Total", "28", "562,000", "270,500"],
        highlightRow: 2,
        built: "Rows: stage. Measures: count of deals, sum of value, sum of weighted. Value x probability is worked out per deal in the saved query, because formulas operate on aggregates.",
        drill: "Negotiation lists the 5 deals, with owner and value.",
      },
      {
        department: "Finance",
        question: "Which clients bring margin, and who has unpaid invoices?",
        answer: "Client B brings 120,000 at a 15.0% margin, and 5 of its 10 invoices are unpaid. Across all 40 invoices 33 are paid, so the total row shows 82.5%, counted from the invoices.",
        reportTitle: "Profitability by client",
        columns: ["Client", "Net revenue", "Margin", "Invoices paid"],
        rows: [
          ["Client A", "240,000", "30.0%", "90.0%"],
          ["Client B", "120,000", "15.0%", "50.0%"],
          ["Client C", "40,000", "50.0%", "100.0%"],
        ],
        total: ["Total", "400,000", "27.5%", "82.5%"],
        highlightRow: 1,
        built: "Rows: client. Measures: sum of net, ([net] - [cost]) / [net], and share([status] = \"PAID\"). The query returns one row per invoice, because share counts rows.",
        drill: "Client B lists its 10 invoices, and the status column shows the 5 still unpaid.",
      },
      {
        department: "Operations",
        question: "Where are customer requests piling up, and what is already late?",
        answer: "Installation holds 12 of the 24 open requests, 3 of them late. Complaints are only 5, but 2 are late. That is 40%, the highest rate of the three categories.",
        reportTitle: "Open requests by category",
        columns: ["Category", "Open", "Past deadline", "Share of open"],
        rows: [
          ["Installation", "12", "3", "50.0%"],
          ["Maintenance", "7", "1", "29.2%"],
          ["Complaint", "5", "2", "20.8%"],
        ],
        total: ["Total", "24", "6", "100.0%"],
        highlightRow: 0,
        built: "Rows: category. Measures: count, countIf([is_late]), and count shown as % of grand total. The query works out is_late, because formula conditions take fixed dates and have no \"today\".",
        drill: "Installation lists all 12 requests, and is_late marks the 3 past deadline.",
      },
      {
        department: "HR",
        question: "Who is off next month, and which team will be short?",
        answer: "Production has 46 of the 76 leave days, or 60.5%, taken by 9 people. That is the figure to check before the rota is set.",
        reportTitle: "Leave next month by team",
        columns: ["Team", "People", "Leave days", "Share of days"],
        rows: [
          ["Production", "9", "46", "60.5%"],
          ["Sales", "4", "18", "23.7%"],
          ["Office", "3", "12", "15.8%"],
        ],
        total: ["Total", "16", "76", "100.0%"],
        highlightRow: 0,
        built: "Rows: team. Parameter: month, chosen by the viewer. Measures: countDistinct of person, sum of days, and the same sum as % of grand total. Leave requests are a custom object here.",
        drill: "Production lists each leave request, with name and dates.",
      },
      {
        department: "Maintenance",
        question: "Which equipment costs the most in spare parts?",
        answer: "Press lines take 38,200 of the 54,900, or 69.6%, across 14 of the 29 work orders. Packaging is next at 12,600. That is the input to a repair-or-replace decision.",
        reportTitle: "Maintenance cost by equipment type",
        columns: ["Equipment", "Work orders", "Parts cost", "Rank"],
        rows: [
          ["Press lines", "14", "38,200", "1"],
          ["Packaging", "9", "12,600", "2"],
          ["Conveyors", "6", "4,100", "3"],
        ],
        total: ["Total", "29", "54,900", "-"],
        highlightRow: 0,
        built: "Rows: equipment type. Measures: count of work orders, sum of parts cost, and the same sum shown as rank. Rank has no value on a total row, so that cell stays empty.",
        drill: "Press lines lists the 14 work orders behind the 38,200.",
      },
      {
        department: "Management",
        question: "What does each company add to the group?",
        answer: "Company A is 62.0% of the 2,000,000 and Company C is 12.0%. The report adds up what the query returns, so intercompany eliminations and currency conversion have to be in the SQL.",
        reportTitle: "Net revenue by company",
        columns: ["Company", "Net revenue", "Share of group"],
        rows: [
          ["Company A", "1,240,000", "62.0%"],
          ["Company B", "520,000", "26.0%"],
          ["Company C", "240,000", "12.0%"],
        ],
        total: ["Group", "2,000,000", "100.0%"],
        highlightRow: 2,
        built: "Scope: ORGANIZATION_REPORTING, for viewers holding org.companyData.readAll. Rows: company. Measures: sum of net, and the same sum as % of grand total.",
        drill: "Company C lists the invoices behind its 240,000.",
      },
    ],
    industries: {
      title: "The same measures in other industries.",
      note: "Illustrative examples. The data has to be recorded in Opero first.",
      items: [
        { industry: "Manufacturing", description: "Spare parts cost per production line by month, with % difference from the previous month." },
        { industry: "Construction", description: "Cost invoices against budget lines per site, with the invoices behind each line one click away." },
        { industry: "Professional services", description: "Hours logged divided by hours sold, per client and consultant, as a ratio that holds on every subtotal." },
        { industry: "Field service", description: "Visits per technician and region, with share([closed_first_visit]) for the first-visit rate." },
      ],
    },
  },
  calculation: {
    title: "Average the row margins and you get 31.7%. The real total is 27.5%.",
    description:
      "In this example, (30.0 + 15.0 + 50.0) / 3 gives 31.7%, because Client C, the smallest account, counts as much as the largest. Opero compiles a calculated measure into the aggregate SQL, so the total row works it out again: (400,000 - 290,000) / 400,000 = 27.5%. A zero denominator gives an empty cell instead of an error.",
    margin: {
      title: "Margin by client (example data)",
      columns: ["Client", "Net", "Cost", "Margin"],
      rows: [
        ["Client A", "240,000", "168,000", "30.0%"],
        ["Client B", "120,000", "102,000", "15.0%"],
        ["Client C", "40,000", "20,000", "50.0%"],
      ],
      averageLabel: "Average of the rows",
      averageValue: "31.7%",
      totalLabel: "Total in Opero",
      totalValues: ["400,000", "290,000", "27.5%"],
      formulaLabel: "Formula",
      formula: "([net] - [cost]) / [net]",
    },
    secondTitle: "What formulas cover, and where they stop.",
    bullets: [
      "Ratios of aggregates: sum([net]) / countDistinct([invoice_id]) gives the average invoice even when the query returns invoice lines.",
      "Some of the rows only: sumIf, countIf and share, with the condition checked on each source row.",
      "No formula needed: % of grand, column, row or parent total, running total, difference, % difference and rank. Share and running total need a sum or count measure.",
      "Months with no data are not filled in, so \"previous\" means the previous row that exists. Arithmetic on single rows, such as price x quantity, goes in the saved query.",
      "The dialog offers ratio, difference, change, average per or a custom formula, previews the grand total, and flags a mistyped name with a suggested fix.",
    ],
    image: {
      src: "/opero/reports/calculated-measure.webp",
      alt: "Opero report builder with the calculated measure dialog open, building a ratio of two measures, with a preview of the grand total",
      width: 1090,
      height: 1000,
    },
  },
  oneVersion: {
    title: "Two October files, 22,600 apart, replaced by one report definition.",
    description:
      "A report is organization configuration: one saved query and one layout. Pages and record layouts embed it by id, so there is no copy to drift. In this example it reads 1,297,300 from the records, and each company's run is limited to that company's rows by row-level security in the database.",
    files: [
      { name: "sales_oct_FINAL.xlsx", meta: "Exported Thursday", totalLabel: "October total", total: "1,284,500" },
      { name: "sales_oct_v2_Mark.xlsx", meta: "Exported Friday", totalLabel: "October total", total: "1,261,900" },
    ],
    report: { name: "Sales by month", meta: "One report, read from the records", totalLabel: "October total", total: "1,297,300" },
    audiences: ["Company A", "Company B", "Company C", "Group"],
    points: [
      { title: "A fix reaches every page", description: "Edit the report or its saved query and cached results stop being used, because the cache key includes both versions." },
      { title: "Each company sees its own", description: "COMPANY is the default scope. One report serves all companies, and the database limits each run to the viewer's company." },
      { title: "The group sees the whole", description: "ORGANIZATION_REPORTING runs across all companies, only for viewers holding org.companyData.readAll. API tokens never get it." },
    ],
  },
  reslice: {
    title: "A viewer can regroup a report without changing it for anyone else.",
    description:
      "In this example the Open deals report groups by stage, company and deal. A viewer narrows it to one company from the Filter menu, or drags Company to the top. That runs as a temporary layout, and the stored report stays as it was.",
    bullets: [
      "Regroup, swap a measure or change an aggregation on the field shelf. None of it is saved over the report.",
      "Value pickers list up to 200 distinct values by default, and the viewer's other filters narrow each list.",
      "Group dates by year, quarter, month, week or day.",
      "For \"My pipeline\", bind a FIXED parameter to {{ user.id }}. Viewers cannot see or override it, whereas their own filters are not a security boundary.",
      "Turn controls off on the page block and viewers get only the table or chart, with refresh and export.",
    ],
    image: {
      src: "/opero/reports/field-shelf.webp",
      alt: "Opero report at runtime with the filter menu open on Stage and Company, above the field shelf and pivot table",
      width: 2000,
      height: 1250,
    },
  },
  dashboards: {
    title: "A page for each team, with its own reports, counters and lists.",
    description:
      "A custom page holds report blocks, counters fed by saved queries, Custom Lists, SQL lists and calendars. You set its audience and link it in the team's menu. Reports have no audience of their own, so a margin report belongs on a page limited to finance.",
    image: {
      src: "/opero/reports/overview-dashboard.webp",
      alt: "Opero Overview dashboard with pipeline counters, a revenue chart by close month, pipeline by stage and a list of top deals",
      width: 2000,
      height: 1400,
    },
    teams: [
      { team: "Sales lead", description: "Open pipeline and weighted forecast as counters, revenue by close month, and top deals by weighted value." },
      { team: "Finance", description: "Overdue invoices as a counter, costs by month as a chart, and a pivot by client below them." },
      { team: "Operations", description: "Requests past deadline as a counter, open requests per technician, and a calendar of upcoming visits." },
      { team: "Support", description: "The helpdesk.metrics block: my open, unassigned and breaching-soon counts, plus 30-day median first response and resolution time." },
    ],
  },
  delivery: {
    title: "XLSX or CSV on demand, and an email from a scheduled rule.",
    export: {
      title: "Export the aggregated view or the raw rows, with filters applied.",
      description:
        "The menu offers both, in Excel or CSV. XLSX keeps percentages formatted as percentages, and CSV holds raw values. By default raw exports stop at 250,000 rows and aggregated results at 50,000. There is no PDF export.",
      image: {
        src: "/opero/reports/export-menu.webp",
        alt: "Close-up of the Opero report export menu offering the aggregated view or raw source rows in Excel and CSV",
        width: 1400,
        height: 900,
      },
    },
    schedule: {
      title: "Email the manager on Monday if more than 10 requests are late.",
      description:
        "Reports have no subscriptions of their own, so you build this with a rule, using a saved query like the one behind the report. An example:",
      steps: [
        { label: "CRON trigger: 0 7 * * 1", detail: "Monday at 7:00 on the server clock, once for each company the rule is exposed to." },
        { label: "RUN_QUERY: late requests", detail: "A saved query that returns late_count for that company." },
        { label: "CONDITION: late_count > 10", detail: "With the false port unconnected, the run ends as a success and sends nothing." },
        { label: "SEND_EMAIL to the operations manager", detail: "With the figure in the message and a link to the page. The run is kept in the rule's execution history." },
      ],
      cta: "See what else rules can do",
    },
  },
  build: {
    title: "Someone writes the SQL once. Layout and placement are visual.",
    description:
      "That someone can be your admin, our team, or an AI agent connected over MCP, which previews real numbers before it saves. People who read the report never see the query.",
    cta: "See how the AI agent works",
    steps: [
      { title: "Write the saved query", description: "One SELECT on allowed tables: custom objects, contractors, sales and cost invoices, budgets, tickets. DDL, set_config and pg_sleep are refused, and it runs as the read-only app_readonly role." },
      { title: "Shape the report", description: "Drag fields onto rows, columns and measures and check real numbers, as a pivot table or a chart. Saving is refused if a column does not exist or a sum points at a text column." },
      { title: "Activate and embed it", description: "Only an ACTIVE report renders. Add it as a block on a page or record layout, with or without controls. The audience of that page decides who reads the numbers." },
    ],
  },
  faq: reportsFaq,
  related: {
    title: "See also",
    items: [
      { feature: "noCode", title: "No-code platform", description: "Model the objects and fields your reports will read, and build the pages that show them." },
      { feature: "lowCode", title: "Low-code and automation", description: "Saved queries and rules with RUN_QUERY and CONDITION steps, on a cron schedule or when a record changes." },
      { feature: "ai", title: "Contextual AI", description: "Describe the report you want, and a connected AI agent drafts the query and previews it on your data." },
    ],
  },
  finalCta: {
    title: "Bring the workbook your team rebuilds every Monday.",
    description: "Show us the file and where its data comes from. In the demo we go through the saved query, measures and page it would become in Opero, and what would have to be imported first.",
    primaryCta: "Book a demo",
    secondaryCta: "Contact us",
  },
};
