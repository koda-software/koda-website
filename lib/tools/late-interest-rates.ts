/**
 * Statutory interest rates for the late payment interest calculator, hand-maintained.
 *
 * Commercial transactions (ustawa o przeciwdziałaniu nadmiernym opóźnieniom w transakcjach
 * handlowych, art. 4 pkt 3 and art. 11b): one rate per half-year, fixed from the NBP
 * reference rate on 1 January or 1 July, announced in Monitor Polski. Until 2019 the rate
 * was reference + 8 pp for every debtor; from 2020 it is + 10 pp, and + 8 pp for a public
 * entity that is a healthcare provider.
 *
 * Ordinary statutory interest for delay (art. 481 § 2 KC): reference + 5,5 pp, changing on
 * the day the reference rate changes.
 *
 * Every row was read from its Monitor Polski announcement and cross-checked against the NBP
 * reference rate. Update twice a year (late June and late December) and after each change
 * of the reference rate; `scripts/tools/check-late-interest-rates.mjs` lists what is new.
 */

export type HalfYearRate = {
  /** "2026-07-01" or "2026-01-01". */
  from: string;
  /** Basis points: 1375 = 13,75%. */
  standard: number;
  /** Public healthcare debtor; equals `standard` before 2020. */
  healthcare: number;
  /** "MP 2026 poz. 642". */
  source: string;
  /** ELI id for the link: "MP/2026/642". */
  eli: string;
};

const half = (from: string, standard: number, healthcare: number, year: number, position: number): HalfYearRate => ({
  from,
  standard,
  healthcare,
  source: `MP ${year} poz. ${position}`,
  eli: `MP/${year}/${position}`,
});

/** Ascending, one row per half-year from 2016-01-01. */
export const commercialRates: HalfYearRate[] = [
  half("2016-01-01", 950, 950, 2016, 43),
  half("2016-07-01", 950, 950, 2016, 601),
  half("2017-01-01", 950, 950, 2017, 10),
  half("2017-07-01", 950, 950, 2017, 686),
  half("2018-01-01", 950, 950, 2018, 139),
  half("2018-07-01", 950, 950, 2018, 671),
  half("2019-01-01", 950, 950, 2019, 42),
  half("2019-07-01", 950, 950, 2019, 671),
  half("2020-01-01", 1150, 950, 2020, 2),
  half("2020-07-01", 1010, 810, 2020, 610),
  half("2021-01-01", 1010, 810, 2020, 1212),
  half("2021-07-01", 1010, 810, 2021, 591),
  half("2022-01-01", 1175, 975, 2022, 8),
  half("2022-07-01", 1600, 1400, 2022, 636),
  half("2023-01-01", 1675, 1475, 2022, 1263),
  half("2023-07-01", 1675, 1475, 2023, 626),
  half("2024-01-01", 1575, 1375, 2023, 1465),
  half("2024-07-01", 1575, 1375, 2024, 546),
  half("2025-01-01", 1575, 1375, 2024, 1106),
  half("2025-07-01", 1525, 1325, 2025, 602),
  half("2026-01-01", 1400, 1200, 2025, 1257),
  half("2026-07-01", 1375, 1175, 2026, 642),
];

export type CivilRate = {
  from: string;
  /** Basis points. */
  rate: number;
  /** Null when the announcement was not located and the rate is derived from the NBP reference rate. */
  source: string | null;
  eli: string | null;
};

const civil = (from: string, rate: number, year: number | null, position: number | null): CivilRate => ({
  from,
  rate,
  source: year && position ? `MP ${year} poz. ${position}` : null,
  eli: year && position ? `MP/${year}/${position}` : null,
});

/** Ascending, one row per change of the rate from 2016-01-01. */
export const civilRates: CivilRate[] = [
  civil("2016-01-01", 700, 2016, 47),
  civil("2020-03-18", 650, 2020, 627),
  civil("2020-04-09", 600, 2020, 627),
  civil("2020-05-29", 560, 2020, 627),
  civil("2021-10-07", 600, 2021, 953),
  civil("2021-11-04", 675, 2021, 1097),
  civil("2021-12-09", 725, 2021, 1202),
  civil("2022-01-05", 775, 2022, 109),
  civil("2022-02-09", 825, 2022, 285),
  civil("2022-03-09", 900, 2022, 375),
  civil("2022-04-07", 1000, 2022, 482),
  civil("2022-05-06", 1075, 2022, 586),
  civil("2022-06-09", 1150, 2022, 673),
  civil("2022-07-08", 1200, 2022, 710),
  /* Reference 6,75 + 5,5. The announcement was not located: find it before publishing. */
  civil("2022-09-08", 1225, null, null),
  civil("2023-09-07", 1150, 2023, 1061),
  civil("2023-10-05", 1125, 2023, 1123),
  civil("2025-05-08", 1075, 2025, 540),
  civil("2025-07-03", 1050, 2025, 685),
  civil("2025-09-04", 1025, 2025, 1015),
  civil("2025-10-09", 1000, 2025, 1136),
  civil("2025-11-06", 975, 2025, 1192),
  civil("2025-12-04", 950, 2025, 1308),
  civil("2026-03-05", 925, 2026, 367),
];

/** The last day the commercial table is known to cover. Later days reuse the last rate, marked as a forecast. */
export const COMMERCIAL_KNOWN_UNTIL = "2026-12-31";
/** The day both tables were last checked against Monitor Polski and NBP. Civil rows stay valid until the next change. */
export const RATES_CHECKED_AT = "2026-11-16";
