import type { WorkingTimePageContent } from "@/content/types";
import { holidayNames } from "@/lib/tools/business-days";
import { formatDayMonth, formatDuration, plural, yearTable, type NormResult } from "@/lib/tools/working-time";

const headClass = "border-b border-[rgba(11,17,22,0.16)] py-2.5 pr-6 font-semibold";
const cellClass = "whitespace-nowrap border-b border-[rgba(11,17,22,0.1)] py-3 pr-6 text-right";
const bodyClass = "m-0 max-w-[46rem] text-[1.04rem] leading-[1.7] text-[var(--color-muted)]";
const noteClass = "m-0 max-w-[46rem] text-[0.95rem] leading-[1.7] text-[var(--color-muted)]";

const fill = (template: string, values: Record<string, string>) => template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);

/** "15.08" on the Polish page, "15 Aug" on the English one. */
function shortDate(iso: string, english: boolean) {
  if (!english) return `${Number(iso.slice(8, 10))}.${iso.slice(5, 7)}`;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${iso}T12:00:00Z`));
}

const wholeHours = (results: NormResult[]) => results.map((result) => result.fullTimeMinutes / 60).join(" · ");

function joinDates(dates: string[], and: string) {
  if (dates.length < 2) return dates.join("");
  return `${dates.slice(0, -1).join(", ")}${and}${dates.at(-1)}`;
}

/**
 * The full-year norms for each year in `workingTimeYears`, rendered on the server with the
 * same functions as the widget, so the page text and the calculator never disagree. These
 * tables answer "wymiar czasu pracy 2027" and "dni robocze 2027" without JavaScript.
 */
export function WorkingTimeYears({ content, years, english }: { content: WorkingTimePageContent["years"]; years: readonly number[]; english: boolean }) {
  const locale = english ? "en" : "pl";
  const intlLocale = english ? "en-GB" : "pl-PL";
  const weekdayName = (iso: string) => new Intl.DateTimeFormat(intlLocale, { weekday: "long", timeZone: "UTC" }).format(new Date(`${iso}T12:00:00Z`));

  return (
    <div className="grid gap-[clamp(3rem,6vw,4rem)]">
      {years.map((year, yearIndex) => {
        const table = yearTable(year);
        const total = table.year;
        const saturdays = joinDates(
          total.saturdayHolidays.map((date) => formatDayMonth(date, locale)),
          content.and,
        );
        const business =
          total.saturdayHolidays.length === 0 ? content.businessNone : total.saturdayHolidays.length === 1 ? content.businessOne : content.businessMany;
        const half = yearTable(year, { num: 1, den: 2 }).year.minutes;
        const threeQuarters = yearTable(year, { num: 3, den: 4 }).year.minutes;
        const healthcare = yearTable(year, undefined, "healthcare").year.minutes;
        const holidaysTitleId = `${fill(content.anchor, { year: String(year) })}-holidays`;

        return (
          <div className="grid gap-5" id={fill(content.anchor, { year: String(year) })} key={year}>
            <h2
              className="m-0 text-[clamp(1.6rem,2.6vw,2rem)] leading-[1.15] tracking-[-0.03em] text-[var(--color-ink)]"
              id={yearIndex === 0 ? "tool-examples" : undefined}
            >
              {fill(content.title, { year: String(year) })}
            </h2>
            <p className={bodyClass}>
              {fill(content.intro, {
                year: String(year),
                hours: plural(content.hours, total.fullTimeMinutes / 60, locale),
                days: plural(content.days, total.normDays, locale),
              })}{" "}
              {fill(business, { businessDays: String(total.businessDays), saturdays })}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[44rem] border-collapse text-[1rem] text-[var(--color-ink)]">
                <caption className="sr-only">{fill(content.caption, { year: String(year) })}</caption>
                <thead>
                  <tr className="text-[0.92rem] text-[var(--color-muted)]">
                    {content.columns.map((column, index) => (
                      <th className={`${headClass} ${index === 0 || index === content.columns.length - 1 ? "text-left" : "text-right"}`} key={column} scope="col">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.months.map((month, index) => {
                    const lowering = month.holidays.filter((holiday) => holiday.lowersNorm);
                    return (
                      <tr key={month.start}>
                        <th className="whitespace-nowrap border-b border-[rgba(11,17,22,0.1)] py-3 pr-6 text-left font-semibold" id={month.start.slice(0, 7)} scope="row">
                          {content.months[index]} {year}
                        </th>
                        <td className={cellClass}>{month.fullTimeMinutes / 60}</td>
                        <td className={cellClass}>{month.normDays}</td>
                        <td className={`${cellClass} text-[var(--color-muted)]`}>{month.businessDays}</td>
                        <td className={`${cellClass} text-[var(--color-muted)]`}>{month.daysOff}</td>
                        <td className="border-b border-[rgba(11,17,22,0.1)] py-3 pr-6 text-left text-[0.95rem] text-[var(--color-muted)]">
                          {lowering.length
                            ? lowering.map((holiday) => (holiday.saturday ? `${shortDate(holiday.date, english)} (${weekdayName(holiday.date)})` : shortDate(holiday.date, english))).join(", ")
                            : "–"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="font-semibold">
                    <th className="whitespace-nowrap py-3 pr-6 text-left" scope="row">
                      {content.totalLabel}
                    </th>
                    <td className="whitespace-nowrap py-3 pr-6 text-right">{total.fullTimeMinutes / 60}</td>
                    <td className="whitespace-nowrap py-3 pr-6 text-right">{total.normDays}</td>
                    <td className="whitespace-nowrap py-3 pr-6 text-right">{total.businessDays}</td>
                    <td className="whitespace-nowrap py-3 pr-6 text-right">{total.daysOff}</td>
                    <td className="py-3 pr-6" />
                  </tr>
                </tfoot>
              </table>
            </div>

            <p className={noteClass}>
              {fill(content.totals, { quarters: wholeHours(table.quarters), thirds: wholeHours(table.thirds), halves: wholeHours(table.halves) })}{" "}
              {fill(content.variants, {
                half: formatDuration(half, locale),
                threeQuarters: formatDuration(threeQuarters, locale),
                healthcare: formatDuration(healthcare, locale),
              })}
            </p>

            <div className="grid gap-3">
              <h3 className="m-0 font-display text-[1.2rem] font-medium leading-[1.3] text-[var(--color-ink)]" id={holidaysTitleId}>
                {fill(content.holidaysTitle, { year: String(year) })}
              </h3>
              <ul aria-labelledby={holidaysTitleId} className="m-0 grid max-w-[46rem] list-none gap-0 p-0 text-[1rem] text-[var(--color-ink)]">
                {total.holidays.map((holiday) => (
                  <li className="flex flex-wrap gap-x-3 border-b border-[rgba(11,17,22,0.1)] py-2.5" key={holiday.date}>
                    <span className="min-w-[11rem] font-semibold">
                      <time dateTime={holiday.date}>{formatDayMonth(holiday.date, locale)}</time>, {weekdayName(holiday.date)}
                    </span>
                    <span>{holidayNames[holiday.key][locale]}</span>
                    {holiday.saturday ? <span className="text-[var(--color-muted)]">{content.saturdayNote}</span> : null}
                    {holiday.weekday === 0 ? <span className="text-[var(--color-muted)]">{content.sundayNote}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}
