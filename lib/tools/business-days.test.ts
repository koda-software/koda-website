import { strict as assert } from "node:assert";
import { test } from "node:test";
import { addDays, dayOffReason, easterSunday, isBusinessDay, isIsoDate, polishHolidays, previousBusinessDay, todayInPoland } from "./business-days";

/** Weekdays without an NBP table, read from the API (tables A for 2024, 2025 and 2026 up to 15 November). */
const NBP_DAYS_WITHOUT_TABLE: Record<number, string[]> = {
  2024: ["01-01", "04-01", "05-01", "05-03", "05-30", "08-15", "11-01", "11-11", "12-25", "12-26"],
  2025: ["01-01", "01-06", "04-21", "05-01", "06-19", "08-15", "11-11", "12-24", "12-25", "12-26"],
  2026: ["01-01", "01-06", "04-06", "05-01", "06-04", "11-11"],
};

const weekdayHolidays = (year: number, until = `${year}-12-31`) =>
  [...polishHolidays(year).keys()]
    .filter((day) => day <= until)
    .filter((day) => {
      const weekday = new Date(`${day}T00:00:00Z`).getUTCDay();
      return weekday !== 0 && weekday !== 6;
    })
    .map((day) => day.slice(5));

test("finds Easter Sunday", () => {
  assert.equal(easterSunday(2024), "2024-03-31");
  assert.equal(easterSunday(2025), "2025-04-20");
  assert.equal(easterSunday(2026), "2026-04-05");
  assert.equal(easterSunday(2027), "2027-03-28");
  assert.equal(easterSunday(2038), "2038-04-25");
});

test("derives the movable holidays from Easter", () => {
  const holidays = polishHolidays(2026);
  assert.equal(holidays.get("2026-04-05"), "easter");
  assert.equal(holidays.get("2026-04-06"), "easterMonday");
  assert.equal(holidays.get("2026-05-24"), "pentecost");
  assert.equal(holidays.get("2026-06-04"), "corpusChristi");
  assert.equal(polishHolidays(2024).get("2024-05-30"), "corpusChristi");
  assert.equal(polishHolidays(2025).get("2025-06-19"), "corpusChristi");
});

test("matches the weekdays NBP published no table on", () => {
  assert.deepEqual(weekdayHolidays(2024), NBP_DAYS_WITHOUT_TABLE[2024]);
  assert.deepEqual(weekdayHolidays(2025), NBP_DAYS_WITHOUT_TABLE[2025]);
  assert.deepEqual(weekdayHolidays(2026, "2026-11-15"), NBP_DAYS_WITHOUT_TABLE[2026]);
});

test("makes 24 December a holiday from 2025, and Epiphany from 2011", () => {
  assert.equal(polishHolidays(2024).has("2024-12-24"), false);
  assert.equal(polishHolidays(2025).get("2025-12-24"), "christmasEve");
  assert.equal(polishHolidays(2026).get("2026-12-24"), "christmasEve");
  assert.equal(isBusinessDay("2024-12-24"), true);
  assert.equal(isBusinessDay("2025-12-24"), false);
  assert.equal(polishHolidays(2010).has("2010-01-06"), false);
  assert.equal(polishHolidays(2011).get("2011-01-06"), "epiphany");
});

test("finds the last business day before a date", () => {
  assert.equal(previousBusinessDay("2026-11-16"), "2026-11-13"); // Monday: Friday
  assert.equal(previousBusinessDay("2026-11-12"), "2026-11-10"); // after Independence Day
  assert.equal(previousBusinessDay("2025-12-29"), "2025-12-23"); // Christmas Eve, Christmas and a weekend
  assert.equal(previousBusinessDay("2026-04-07"), "2026-04-03"); // Easter Monday and the weekend
  assert.equal(previousBusinessDay("2026-01-07"), "2026-01-05"); // Epiphany
  assert.equal(previousBusinessDay("2026-01-02"), "2025-12-31"); // across the year
  assert.equal(previousBusinessDay("2026-06-05"), "2026-06-03"); // Corpus Christi
  assert.equal(previousBusinessDay("2026-11-13"), "2026-11-12");
});

test("says why a day has no table", () => {
  assert.deepEqual(dayOffReason("2026-11-11"), { date: "2026-11-11", reason: "independenceDay" });
  assert.deepEqual(dayOffReason("2026-11-14"), { date: "2026-11-14", reason: "saturday" });
  assert.deepEqual(dayOffReason("2026-11-15"), { date: "2026-11-15", reason: "sunday" });
  assert.deepEqual(dayOffReason("2026-11-01"), { date: "2026-11-01", reason: "allSaints" }); // a holiday on a Sunday
  assert.equal(dayOffReason("2026-11-13"), null);
});

test("does date arithmetic on plain dates", () => {
  assert.equal(addDays("2026-03-01", -1), "2026-02-28");
  assert.equal(addDays("2024-02-28", 1), "2024-02-29");
  assert.equal(addDays("2026-12-31", 1), "2027-01-01");
  assert.equal(addDays("2026-03-29", 1), "2026-03-30"); // across the DST change
  assert.equal(isIsoDate("2026-02-30"), false);
  assert.equal(isIsoDate("2026-2-3"), false);
  assert.equal(isIsoDate("2024-02-29"), true);
});

test("reads today in Polish time", () => {
  assert.equal(todayInPoland(new Date("2026-12-31T23:30:00Z")), "2027-01-01");
  assert.equal(todayInPoland(new Date("2026-07-01T21:59:00Z")), "2026-07-01");
});
