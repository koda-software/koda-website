import type { LateInterestPageContent } from "@/content/types";
import { formatRate } from "@/lib/tools/late-interest";
import { civilRates, commercialRates } from "@/lib/tools/late-interest-rates";
import { formatDottedDate } from "@/lib/tools/nbp";

const thClass = "border-b border-[rgba(11,17,22,0.16)] py-2.5 pr-6 font-semibold";
const cellClass = "whitespace-nowrap border-b border-[rgba(11,17,22,0.1)] py-3 pr-6";
const linkClass = "text-[var(--color-blue)] underline underline-offset-4 hover:text-[var(--color-blue-deep)]";

function Announcement({ source, eli, english }: { source: string | null; eli: string | null; english: boolean }) {
  if (!source || !eli) return null;
  const label = english ? source.replace("poz.", "item") : source.replace("MP", "M.P.");
  return (
    <a className={linkClass} href={`https://api.sejm.gov.pl/eli/acts/${eli}/text.pdf`} rel="noopener" target="_blank">
      {label}
    </a>
  );
}

/**
 * Every announced rate, newest first, rendered on the server from the same data as the
 * calculator, so the page answers "odsetki w transakcjach handlowych 2026" in its own text
 * and visitors can check each row against Monitor Polski.
 */
export function LateInterestRateTable({ content, english }: { content: LateInterestPageContent["rateTable"]; english: boolean }) {
  const sep = english ? "." : ",";
  const percent = (bp: number) => `${formatRate(bp, sep)}%`;
  const commercial = [...commercialRates].reverse();
  const civil = [...civilRates].reverse();

  return (
    <>
      <h2 className="m-0 text-[clamp(1.6rem,2.6vw,2rem)] leading-[1.15] tracking-[-0.03em] text-[var(--color-ink)]" id="tool-rates">
        {content.title}
      </h2>
      <p className="m-0 mt-4 max-w-[46rem] text-[1.04rem] leading-[1.7] text-[var(--color-muted)]">{content.intro}</p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-[1rem] text-[var(--color-ink)]">
          <thead>
            <tr className="text-[0.92rem] text-[var(--color-muted)]">
              {content.columns.map((column, index) => (
                <th className={`${thClass} ${index === 1 || index === 2 ? "text-right" : "text-left"}`} key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {commercial.map((row) => (
              <tr key={row.from}>
                <th className={`${cellClass} text-left font-semibold`} scope="row">
                  {(row.from.endsWith("-01-01") ? content.halves.first : content.halves.second).replace("{year}", row.from.slice(0, 4))}
                </th>
                <td className={`${cellClass} text-right`}>{percent(row.standard)}</td>
                <td className={`${cellClass} text-right text-[var(--color-muted)]`}>{percent(row.healthcare)}</td>
                <td className={cellClass}>
                  <Announcement eli={row.eli} english={english} source={row.source} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="m-0 mt-4 max-w-[46rem] text-[0.95rem] leading-[1.7] text-[var(--color-muted)]">{content.oneRateNote}</p>

      <h3 className="m-0 mt-12 text-[1.35rem] leading-[1.3] tracking-[-0.01em] text-[var(--color-ink)]">{content.civilTitle}</h3>
      <p className="m-0 mt-3 max-w-[46rem] text-[1.04rem] leading-[1.7] text-[var(--color-muted)]">{content.civilIntro}</p>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full max-w-[34rem] border-collapse text-[1rem] text-[var(--color-ink)]">
          <thead>
            <tr className="text-[0.92rem] text-[var(--color-muted)]">
              {content.civilColumns.map((column, index) => (
                <th className={`${thClass} ${index === 1 ? "text-right" : "text-left"}`} key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {civil.map((row) => (
              <tr key={row.from}>
                <th className={`${cellClass} text-left font-semibold`} scope="row">
                  {formatDottedDate(row.from)}
                </th>
                <td className={`${cellClass} text-right`}>{percent(row.rate)}</td>
                <td className={cellClass}>
                  {row.source ? <Announcement eli={row.eli} english={english} source={row.source} /> : <span className="text-[var(--color-muted)]">{content.derived}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
