import type { WorkingTimeLabels, WorkingTimePageContent } from "@/content/types";
import { workingTimeYears } from "@/lib/tools/working-time";

const [firstYear, secondYear] = workingTimeYears;

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const workingTimePage: WorkingTimePageContent = {
  seo: {
    title: `Working days in Poland ${firstYear}–${secondYear}`,
    description: `Working days and hours in Poland for ${firstYear} and ${secondYear}, month by month, with public holidays. Work out the norm for any settlement period or part-time job.`,
  },
  navLabel: "Working days in Poland",
  navDescription: "Working hours and days per month and settlement period, with public holidays.",
  hero: {
    title: "Working days and hours in Poland",
    description:
      "See how many working hours and days fall in a month, a quarter or any settlement period in Poland. Work out the norm for a part-time job or the 7 h 35 min norm, and count working days between two dates.",
  },
  explainer: {
    title: "How the working-time norm works",
    paragraphs: [
      "In Poland, the working-time norm (wymiar czasu pracy) is the number of hours an employee must work in a settlement period. Under art. 130 of the Labour Code (Kodeks pracy), you multiply 40 hours by the number of full weeks in the period and add 8 hours for each remaining day from Monday to Friday. In practice, this comes to 8 hours for every day from Monday to Friday.",
      "Every public holiday that does not fall on a Sunday lowers the norm by 8 hours. This includes holidays on a Saturday: the employer must then give the employee another day off within the same settlement period. In 2026 these are 15 August and 26 December, and in 2027 1 May and 25 December. Polish public holidays falling on a Saturday still reduce the norm, so the employer must give another day off. This is unlike most EU countries.",
      "That is why the same month has two day counts. Working days are Monday to Friday without public holidays. Days in the norm are lower by each Saturday holiday. August 2026 has 21 working days, but the norm is 20 days, or 160 hours.",
      "For a part-time job, the norm is multiplied by the fraction of full time: half time in August 2026 is 80 hours. Employees of healthcare entities have a daily norm of 7 hours 35 minutes, and people with a significant or moderate disability 7 hours, so the norm is counted from those. The result is the nominal norm: leave, sick leave and other justified absences lower it by the hours scheduled for those days.",
    ],
    table: {
      caption: "What changes the working-time norm",
      columns: ["Situation", "Effect on the norm", "Legal basis"],
      rows: [
        ["Holiday on Monday to Friday", "−8 hours", "art. 130 § 2 Labour Code"],
        ["Holiday on a Saturday", "−8 hours and another day off in the settlement period", "art. 130 § 2 Labour Code"],
        ["Holiday on a Sunday", "no change", "art. 130 § 2 Labour Code"],
        ["Part-time job", "norm × fraction of full time", "employment contract, art. 130 Labour Code"],
        ["Healthcare entity (podmiot leczniczy)", "7 h 35 min for each working day", "art. 93(1) Act on medical activity"],
        ["Significant or moderate disability", "7 h for each working day", "art. 15(2) Act on vocational rehabilitation"],
        ["Leave, sick leave, other justified absence", "− the scheduled hours for those days", "art. 130 § 3 Labour Code"],
      ],
    },
  },
  years: {
    title: "Working time in {year}",
    anchor: "year-{year}",
    intro: "In {year}, the full-time working-time norm in Poland is {hours}, or {days}.",
    businessNone: "There are as many working days from Monday to Friday without holidays, because no holiday falls on a Saturday.",
    businessOne: "There are {businessDays} working days from Monday to Friday without holidays, because {saturdays} falls on a Saturday.",
    businessMany: "There are {businessDays} working days from Monday to Friday without holidays, because {saturdays} fall on a Saturday.",
    hours: { one: "{n} hour", other: "{n} hours" },
    days: { one: "{n} working day in the norm", other: "{n} working days in the norm" },
    months,
    columns: ["Month", "Hours", "Days in the norm", "Working days Mon–Fri", "Days off", "Holidays lowering the norm"],
    caption: "Full-time working-time norm in Poland in {year}, by month",
    totalLabel: "Whole year",
    totals: "Quarters: {quarters} h. Four-month periods: {thirds} h. Halves: {halves} h.",
    variants: "Half time: {half}. Three-quarter time: {threeQuarters}. 7 h 35 min norm: {healthcare}.",
    holidaysTitle: "Public holidays in Poland in {year}",
    saturdayNote: "another day off is due",
    sundayNote: "does not lower the norm",
    and: " and ",
  },
  sources: {
    title: "Legal basis",
    updatedLabel: "Rules checked on:",
    updatedAt: "2026-11-16",
    note: "The calculator is for information only. It works out the nominal norm for an employee working Monday to Friday, before leave and other absences are taken off.",
    items: [
      {
        label: "Kodeks pracy (Labour Code), consolidated text Dz.U. 2026 poz. 1245: art. 128, 129, 130, 151, 151¹, 151⁸, 154 and 154²",
        href: "https://api.sejm.gov.pl/eli/acts/DU/2026/1245/text.pdf",
      },
      {
        label: "Ustawa o dniach wolnych od pracy (Act on public holidays), consolidated text Dz.U. 2025 poz. 296",
        href: "https://api.sejm.gov.pl/eli/acts/DU/2025/296/text.pdf",
      },
      {
        label: "Act of 6 December 2024 amending the Act on public holidays (Christmas Eve), Dz.U. 2024 poz. 1965",
        href: "https://api.sejm.gov.pl/eli/acts/DU/2024/1965/text.pdf",
      },
      {
        label: "Ustawa o działalności leczniczej (Act on medical activity), consolidated text Dz.U. 2026 poz. 156: art. 93",
        href: "https://api.sejm.gov.pl/eli/acts/DU/2026/156/text.pdf",
      },
      {
        label:
          "Ustawa o rehabilitacji zawodowej i społecznej oraz zatrudnianiu osób niepełnosprawnych (Act on vocational rehabilitation), consolidated text Dz.U. 2026 poz. 884: art. 15",
        href: "https://api.sejm.gov.pl/eli/acts/DU/2026/884/text.pdf",
      },
      { label: "Constitutional Tribunal judgment of 2 October 2012, K 27/11 (holidays on a Saturday), Dz.U. 2012 poz. 1110" },
    ],
  },
  faq: {
    title: "FAQ",
    items: [
      {
        question: "What is the working-time norm in Poland in 2027?",
        answer:
          "For a full-time job, 2008 hours, or 251 working days of 8 hours. May is the shortest month (144 hours), because 1 May falls on a Saturday and 3 May and Corpus Christi on working days. March, April and June to September are the longest, at 176 hours each.",
      },
      {
        question: "How many working days are there in Poland in 2027?",
        answer:
          "Working days in Poland in 2027, Monday to Friday without public holidays: 253. The working-time norm, however, is 251 days, because two holidays, 1 May and 25 December, fall on a Saturday and each lowers the norm by 8 hours. Both numbers are right, but they are used for different things.",
      },
      {
        question: "Who gets a day off for a holiday on a Saturday?",
        answer:
          "An employee whose norm the Saturday holiday lowers. The employer picks the day within the same settlement period, before or after the holiday. With a one-month period, the day off for 15 August 2026 must fall in August, and the one for 26 December in December. It is not annual leave. For part-time staff the norm drops in proportion, and whether a separate day off has to be scheduled usually depends on their schedule.",
      },
      {
        question: "Is 24 December a public holiday in Poland?",
        answer: "Yes. Christmas Eve has been a statutory day off since 2025. In 2026 it falls on a Thursday and in 2027 on a Friday, so it lowers the norm by 8 hours.",
      },
      {
        question: "How do I work out the norm for half time or three-quarter time?",
        answer:
          "Multiply the full-time norm by the fraction. In 2026, half time is 1004 hours and three-quarter time 1506 hours. When the result is not a whole hour, such as 53 hours 20 minutes for one-third time in January 2026, the calculator shows it exactly. The law does not say how to round it.",
      },
      {
        question: "What is the norm with a 7 hours 35 minutes daily norm?",
        answer:
          "In healthcare entities, count 7 hours 35 minutes for each day in the norm. In 2026 and 2027 this gives 1903 hours 25 minutes. In August 2026 it is 151 hours 40 minutes. Technical, service and maintenance staff have an 8-hour norm. That a holiday lowers the norm by 7 hours 35 minutes rather than 8 hours comes from practice, not from a separate provision.",
      },
      {
        question: "How long can a settlement period be?",
        answer:
          "Usually up to 4 months. For objective, technical or organisational reasons it can be extended to 12 months. In the equivalent working-time system (równoważny system) the period is 1 month as a rule, and in healthcare entities at most 3 months. The norm for a longer period is the sum of its months.",
      },
    ],
  },
  opero: {
    title: "Leave requests counted in working days",
    body: "In Opero, a leave request can count the working days itself from the company calendar, skipping public holidays, check the leave balance and send the request to the manager for approval.",
    primaryCta: "Book a demo",
    secondaryCta: "Automation in Opero",
  },
  otherToolsTitle: "Other tools",
};

export const workingTimeLabels: WorkingTimeLabels = {
  modeLabel: "What to count",
  modes: { period: "Settlement period", range: "Between dates" },
  yearLabel: "Year",
  startMonthLabel: "From month",
  lengthLabel: "Period length",
  lengthOption: "{n} mo.",
  fromLabel: "From",
  toLabel: "To (inclusive)",
  fractionLabel: "Fraction of full time",
  fullTimeOption: "Full time",
  otherFraction: "Other…",
  customFractionLabel: "Fraction",
  customFractionPlaceholder: "e.g. 5/8",
  dailyNormLabel: "Daily norm",
  dailyNormOptions: {
    standard: "8 h (Labour Code)",
    healthcare: "7 h 35 min – healthcare entity",
    disability: "7 h – disability",
  },
  normDays: { one: "{n} day in the norm", other: "{n} days in the norm" },
  fullTimeNorm: "full time: {hours}",
  rows: {
    businessDays: "Working days (Mon–Fri without holidays)",
    daysOff: "Days off in the period",
    calendarDays: "Calendar days",
    period: "Period",
  },
  gapOne: "There are fewer days in the norm than working days, because {dates} falls on a Saturday. For such a holiday the employer gives another day off within the same settlement period.",
  gapMany: "There are fewer days in the norm than working days, because {dates} fall on a Saturday. For each of these holidays the employer gives another day off within the same settlement period.",
  gapPartTime: "For part-time staff, whether a separate day off has to be scheduled depends on their schedule.",
  holidaysTitle: "Holidays in this period",
  noHolidays: "There are no public holidays in this period.",
  holidayLine: "{date}, {weekday} – {name} · {effect}",
  effects: {
    lowers: "lowers the norm by {hours}",
    saturday: "lowers the norm by {hours}, another day off is due",
    saturdayPartTime: "lowers the norm by {hours}, the day off depends on the schedule",
    sunday: "does not lower the norm",
  },
  breakdownCaption: "The norm in each month of the period",
  breakdownColumns: { month: "Month", norm: "Norm", normDays: "Days in the norm", businessDays: "Working days" },
  nominalNote: "Nominal norm, before leave and other absences are taken off.",
  roundingNote: "The norm for this fraction is not a whole minute, so it is rounded to the nearest minute.",
  futureNote: "Worked out under the current Act on public holidays.",
  longRangeNote: "The working-time norm applies to a settlement period, which lasts 12 months at most. For a longer range, read the result as a count of days.",
  and: " and ",
  copy: "Copy result",
  copied: "Copied",
  privacyNote: "Worked out in your browser. Nothing is sent anywhere.",
  errors: {
    fraction: "Enter a fraction of full time, e.g. 3/4.",
    dates: "Enter both dates.",
    range: "The range can be 10 years at most.",
  },
  summary: {
    months,
    monthsIn: months.map((month) => `in ${month}`),
    fullTime: "full time",
    partTime: "{fraction} time",
    dailyNorms: { standard: "", healthcare: ", 7 h 35 min norm", disability: ", 7 h norm" },
    normDays: { one: "{n} day in the norm", other: "{n} days in the norm" },
    businessDays: { one: "{n} working day", other: "{n} working days" },
    line: "{period}, {who}: {hours}, {normDays} ({businessDays}).",
    saturdayFullTime: "{date} (Saturday) lowers the norm: give another day off {when}.",
    saturdayReduces: "{date} (Saturday) lowers the norm by {hours}.",
    inPeriod: "within this settlement period",
  },
};
