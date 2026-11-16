import { strict as assert } from "node:assert";
import { test } from "node:test";
import { workingTimeLabels } from "../../content/pl/tools/working-time";
import { workingTimeLabels as englishLabels } from "../../content/en/tools/working-time";
import { addDays, lastDayOfMonth } from "./business-days";
import {
  PERIOD_LENGTHS,
  article130Minutes,
  formatDecimalHours,
  formatDuration,
  normForPeriod,
  normForRange,
  parseFraction,
  summaryLine,
  yearTable,
  type NormResult,
} from "./working-time";

const hours = (results: NormResult[]) => results.map((result) => result.fullTimeMinutes / 60);
const field = (results: NormResult[], key: "normDays" | "businessDays" | "daysOff") => results.map((result) => result[key]);
const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

/* W1: the monthly tables published by infor.pl, pit.pl, kadrywpraktyce.pl and kalendarzpracy.pl. */
const published = {
  2026: {
    hours: [160, 160, 176, 168, 160, 168, 184, 160, 176, 176, 160, 160],
    normDays: [20, 20, 22, 21, 20, 21, 23, 20, 22, 22, 20, 20],
    businessDays: [20, 20, 22, 21, 20, 21, 23, 21, 22, 22, 20, 21],
    daysOff: [11, 8, 9, 9, 11, 9, 8, 11, 8, 9, 10, 11],
  },
  2027: {
    hours: [152, 160, 176, 176, 144, 176, 176, 176, 176, 168, 160, 168],
    normDays: [19, 20, 22, 22, 18, 22, 22, 22, 22, 21, 20, 21],
    businessDays: [19, 20, 22, 22, 19, 22, 22, 22, 22, 21, 20, 22],
    daysOff: [12, 8, 9, 8, 13, 8, 9, 9, 8, 10, 10, 10],
  },
} as const;

for (const year of [2026, 2027] as const) {
  test(`matches the published monthly norms for ${year}`, () => {
    const table = yearTable(year);
    const expected = published[year];
    assert.deepEqual(hours(table.months), expected.hours);
    assert.deepEqual(field(table.months, "normDays"), expected.normDays);
    assert.deepEqual(field(table.months, "businessDays"), expected.businessDays);
    assert.deepEqual(field(table.months, "daysOff"), expected.daysOff);
    assert.equal(table.year.fullTimeMinutes / 60, 2008);
    assert.equal(table.year.normDays, 251);
    assert.equal(table.year.businessDays, 253);
    assert.equal(table.year.daysOff, 114);
    assert.equal(sum(hours(table.months)), 2008);
  });
}

test("matches the other years' totals", () => {
  const year2025 = yearTable(2025).year;
  assert.deepEqual([year2025.fullTimeMinutes / 60, year2025.normDays, year2025.businessDays], [1992, 249, 251]);
  const year2028 = yearTable(2028).year;
  assert.deepEqual([year2028.fullTimeMinutes / 60, year2028.normDays, year2028.businessDays, year2028.calendarDays], [1992, 249, 251, 366]);
});

test("adds up settlement periods", () => {
  const table2026 = yearTable(2026);
  assert.deepEqual(hours(table2026.quarters), [496, 496, 520, 496]);
  assert.deepEqual(hours(table2026.thirds), [664, 672, 672]);
  assert.deepEqual(hours(table2026.halves), [992, 1016]);
  assert.deepEqual(
    [1, 3, 5, 7, 9, 11].map((month) => normForPeriod(2026, month, 2).fullTimeMinutes / 60),
    [320, 344, 328, 344, 352, 320],
  );

  const table2027 = yearTable(2027);
  assert.deepEqual(hours(table2027.quarters), [488, 496, 528, 496]);
  assert.deepEqual(hours(table2027.thirds), [664, 672, 672]);
  assert.deepEqual(hours(table2027.halves), [984, 1024]);
  assert.deepEqual(
    [1, 3, 5, 7, 9, 11].map((month) => normForPeriod(2027, month, 2).fullTimeMinutes / 60),
    [312, 352, 320, 352, 344, 328],
  );

  assert.deepEqual(normForPeriod(2026, 1, 12), table2026.year);
});

test("runs a period across the year", () => {
  const winter = normForPeriod(2026, 11, 3);
  assert.equal(winter.start, "2026-11-01");
  assert.equal(winter.end, "2027-01-31");
  assert.equal(winter.fullTimeMinutes / 60, 472);
  assert.equal(winter.normDays, 59);
  assert.equal(winter.businessDays, 60);
  assert.deepEqual(winter.saturdayHolidays, ["2026-12-26"]);
  assert.deepEqual(
    winter.months.map((month) => month.start),
    ["2026-11-01", "2026-12-01", "2027-01-01"],
  );

  const four = normForPeriod(2026, 12, 4);
  assert.equal(four.end, "2027-03-31");
  assert.deepEqual([four.fullTimeMinutes / 60, four.normDays, four.businessDays], [648, 81, 82]);
});

test("applies part-time fractions", () => {
  const half = { num: 1, den: 2 };
  const threeQuarters = { num: 3, den: 4 };
  assert.equal(yearTable(2026, half).year.minutes, 1004 * 60);
  assert.equal(yearTable(2026, threeQuarters).year.minutes, 1506 * 60);
  assert.equal(yearTable(2027, half).year.minutes, 1004 * 60);
  assert.deepEqual(
    yearTable(2026, threeQuarters).months.map((month) => month.minutes / 60),
    [120, 120, 132, 126, 120, 126, 138, 120, 132, 132, 120, 120],
  );
  assert.deepEqual(
    yearTable(2027, threeQuarters).months.map((month) => month.minutes / 60),
    [114, 120, 132, 132, 108, 132, 132, 132, 132, 126, 120, 126],
  );

  const sevenEighths = normForPeriod(2027, 1, 1, { num: 7, den: 8 });
  assert.equal(sevenEighths.minutes, 7980);
  assert.equal(sevenEighths.exact, true);
  assert.equal(normForPeriod(2026, 8, 1, { num: 1, den: 4 }).minutes, 40 * 60);

  const third = normForPeriod(2026, 1, 1, { num: 1, den: 3 });
  assert.equal(third.minutes, 3200);
  assert.equal(third.exact, true);
  assert.equal(formatDuration(third.minutes, "pl"), "53 h 20 min");
  assert.equal(formatDecimalHours(third.minutes, "pl"), "53,33 h");
  assert.equal(formatDuration(yearTable(2026, { num: 1, den: 3 }).year.minutes, "pl"), "669 h 20 min");
});

test("applies the 7 h 35 min and 7 h daily norms", () => {
  const healthcare = (year: number, month: number) => normForPeriod(year, month, 1, undefined, "healthcare").minutes;
  assert.equal(healthcare(2026, 1), 9100);
  assert.equal(formatDuration(healthcare(2026, 1), "pl"), "151 h 40 min");
  assert.equal(formatDuration(healthcare(2026, 3), "pl"), "166 h 50 min");
  assert.equal(formatDuration(healthcare(2026, 4), "pl"), "159 h 15 min");
  assert.equal(formatDuration(healthcare(2026, 7), "pl"), "174 h 25 min");
  assert.equal(formatDuration(healthcare(2026, 8), "pl"), "151 h 40 min");
  assert.equal(formatDuration(healthcare(2027, 1), "pl"), "144 h 5 min");
  assert.equal(formatDuration(healthcare(2027, 5), "pl"), "136 h 30 min");
  assert.equal(yearTable(2026, undefined, "healthcare").year.minutes, 114_205);
  assert.equal(yearTable(2027, undefined, "healthcare").year.minutes, 114_205);
  assert.equal(formatDuration(114_205, "pl"), "1903 h 25 min");

  assert.equal(normForPeriod(2026, 8, 1, undefined, "disability").minutes, 140 * 60);
  assert.equal(yearTable(2026, undefined, "disability").year.minutes, 1757 * 60);
  assert.equal(normForPeriod(2027, 5, 1, undefined, "disability").minutes, 126 * 60);

  const inexact = normForPeriod(2026, 1, 1, { num: 1, den: 3 }, "healthcare");
  assert.equal(inexact.minutes, 3033);
  assert.equal(inexact.exact, false);
  assert.equal(formatDuration(inexact.minutes, "pl"), "50 h 33 min");
});

test("counts date ranges", () => {
  const holidayWeek = normForRange("2026-08-10", "2026-08-21");
  assert.deepEqual([holidayWeek.businessDays, holidayWeek.normDays], [10, 9]);
  assert.deepEqual(holidayWeek.saturdayHolidays, ["2026-08-15"]);

  const november = normForRange("2026-11-09", "2026-11-13");
  assert.deepEqual([november.businessDays, november.normDays], [4, 4]);

  const christmas = normForRange("2026-12-21", "2027-01-08");
  assert.deepEqual([christmas.businessDays, christmas.normDays, christmas.calendarDays], [11, 10, 19]);

  const lateHire = normForRange("2026-08-17", "2026-08-31");
  assert.deepEqual([lateHire.businessDays, lateHire.normDays, lateHire.fullTimeMinutes / 60], [11, 11, 88]);
  const earlierHire = normForRange("2026-08-12", "2026-08-31");
  assert.deepEqual([earlierHire.businessDays, earlierHire.normDays, earlierHire.fullTimeMinutes / 60], [14, 13, 104]);

  const may = normForRange("2027-04-26", "2027-05-07");
  assert.deepEqual([may.businessDays, may.normDays], [9, 8]);

  const allSaints = normForRange("2026-11-01", "2026-11-01");
  assert.deepEqual([allSaints.calendarDays, allSaints.businessDays, allSaints.normDays], [1, 0, 0]);
  assert.equal(allSaints.holidays.length, 1);
  assert.equal(allSaints.holidays[0].key, "allSaints");
  assert.equal(allSaints.holidays[0].lowersNorm, false);

  const sundayAssumption = normForRange("2027-08-01", "2027-08-31").holidays.find((holiday) => holiday.date === "2027-08-15");
  assert.equal(sundayAssumption?.lowersNorm, false);
  const saturdayAssumption = normForRange("2026-08-01", "2026-08-31").holidays.find((holiday) => holiday.date === "2026-08-15");
  assert.equal(saturdayAssumption?.lowersNorm, true);
  assert.equal(saturdayAssumption?.saturday, true);

  assert.throws(() => normForRange("2026-08-02", "2026-08-01"), RangeError);
  assert.throws(() => normForRange("2026-02-30", "2026-03-01"), RangeError);
});

/** A small deterministic generator (mulberry32), so the random ranges are the same on every run. */
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

test("art. 130 read literally equals 8 h for each day in the norm, 2020–2035", () => {
  for (let year = 2020; year <= 2035; year += 1) {
    for (let month = 1; month <= 12; month += 1) {
      for (const length of PERIOD_LENGTHS) {
        const period = normForPeriod(year, month, length);
        assert.equal(article130Minutes(period.start, period.end), period.fullTimeMinutes, `${year}-${month} × ${length}`);
        assert.equal(article130Minutes(period.start, period.end, 455), normForPeriod(year, month, length, undefined, "healthcare").fullTimeMinutes);
      }
    }
  }

  const random = seeded(130);
  const first = "2020-01-01";
  const span = Math.round((Date.parse("2035-12-31") - Date.parse(first)) / 86_400_000);
  for (let index = 0; index < 200; index += 1) {
    const start = addDays(first, Math.floor(random() * span));
    const end = addDays(start, Math.floor(random() * 400));
    assert.equal(article130Minutes(start, end), normForRange(start, end).fullTimeMinutes, `${start} – ${end}`);
  }
  assert.equal(lastDayOfMonth(2035, 12), "2035-12-31");
});

test("parses part-time fractions", () => {
  assert.deepEqual(parseFraction("3/4"), { num: 3, den: 4 });
  assert.deepEqual(parseFraction("7 / 8"), { num: 7, den: 8 });
  assert.deepEqual(parseFraction("1/1"), { num: 1, den: 1 });
  for (const bad of ["5/4", "0/3", "1/0", "1/101", "abc", "", "3/4/5", "0,5"]) assert.equal(parseFraction(bad), null, bad);
});

test("formats durations", () => {
  assert.equal(formatDuration(9600, "pl"), "160 h");
  assert.equal(formatDuration(0, "pl"), "0 h");
  assert.equal(formatDecimalHours(9600, "pl"), "160 h");
  assert.equal(formatDecimalHours(3033, "pl"), "50,55 h");
  assert.equal(formatDecimalHours(3033, "en"), "50.55 h");
  assert.equal(formatDecimalHours(30, "pl"), "0,50 h");
});

test("writes the summary line", () => {
  assert.equal(
    summaryLine(normForPeriod(2026, 8, 1), "pl", workingTimeLabels.summary),
    "Sierpień 2026, pełny etat: 160 h, 20 dni pracy (21 dni roboczych). 15 sierpnia (sobota) obniża wymiar: wyznacz inny dzień wolny w sierpniu.",
  );
  assert.equal(
    summaryLine(normForPeriod(2026, 11, 3, { num: 1, den: 2 }), "pl", workingTimeLabels.summary),
    "Listopad 2026 – styczeń 2027, 1/2 etatu: 236 h, 59 dni pracy (60 dni roboczych). 26 grudnia (sobota) obniża wymiar o 4 h.",
  );
  assert.equal(
    summaryLine(normForPeriod(2026, 1, 3, undefined, "healthcare"), "pl", workingTimeLabels.summary),
    "Styczeń – marzec 2026, pełny etat, norma 7 h 35 min: 470 h 10 min, 62 dni pracy (62 dni robocze).",
  );
  assert.equal(
    summaryLine(normForRange("2026-08-17", "2026-08-31"), "pl", workingTimeLabels.summary),
    "17–31 sierpnia 2026, pełny etat: 88 h, 11 dni pracy (11 dni roboczych).",
  );
  assert.equal(
    summaryLine(normForPeriod(2027, 5, 1), "en", englishLabels.summary),
    "May 2027, full time: 144 h, 18 days in the norm (19 working days). 1 May (Saturday) lowers the norm: give another day off in May.",
  );
});
