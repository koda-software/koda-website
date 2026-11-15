import type { B2bVsEmploymentPageContent } from "@/content/types";
import { breakEvenInvoice, employmentYear, formatCents, taxForms, type B2bInput } from "@/lib/tools/b2b-vs-employment";
import { rates2026 } from "@/lib/tools/payroll-rates";

const cellClass = "whitespace-nowrap border-b border-[rgba(11,17,22,0.1)] py-3 pr-6 text-right";

/** Whole złoty, grouped: the table rounds up so the invoice never falls short. */
function wholeZloty(cents: number, english: boolean) {
  return formatCents(Math.ceil(cents / 100) * 100, english ? "." : ",").replace(/[.,]00$/, "");
}

/**
 * The B2B invoice that leaves as much as a salary, for common salaries, rendered on the
 * server with the same functions as the calculator. It answers "ile B2B to etat" in the
 * page's own text.
 */
export function B2bBreakEvenTable({ content, english }: { content: B2bVsEmploymentPageContent["breakEvenTable"]; english: boolean }) {
  const base: B2bInput = { invoice: 0, form: "skala", ryczaltBp: rates2026.ryczalt.defaultBp, zus: "full", sickness: true, costs: 0, daysOff: 0, formerEmployer: false };

  const rows = content.salaries.map((salary) => {
    const employment = employmentYear({ gross: salary * 100, kup: "standard", pit2: true, under26: false, ppk: false }, rates2026);
    return {
      salary,
      net: Math.round(employment.net / 12),
      invoices: taxForms.map((form) => breakEvenInvoice(employment.net, { ...base, form }, rates2026)?.invoice ?? null),
    };
  });

  return (
    <>
      <h2 className="m-0 text-[clamp(1.6rem,2.6vw,2rem)] leading-[1.15] tracking-[-0.03em] text-[var(--color-ink)]" id="tool-examples">
        {content.title}
      </h2>
      <p className="m-0 mt-4 max-w-[46rem] text-[1.04rem] leading-[1.7] text-[var(--color-muted)]">{content.intro}</p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-[1rem] text-[var(--color-ink)]">
          <thead>
            <tr className="text-[0.92rem] text-[var(--color-muted)]">
              {content.columns.map((column, index) => (
                <th className={`border-b border-[rgba(11,17,22,0.16)] py-2.5 pr-6 font-semibold ${index === 0 ? "text-left" : "text-right"}`} key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.salary}>
                <th className="whitespace-nowrap border-b border-[rgba(11,17,22,0.1)] py-3 pr-6 text-left font-semibold" scope="row">
                  {wholeZloty(row.salary * 100, english)}
                </th>
                <td className={`${cellClass} text-[var(--color-muted)]`}>{formatCents(row.net, english ? "." : ",")}</td>
                {row.invoices.map((invoice, index) => (
                  <td className={cellClass} key={taxForms[index]}>
                    {invoice === null ? "-" : wholeZloty(invoice, english)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="m-0 mt-4 max-w-[46rem] text-[0.95rem] leading-[1.7] text-[var(--color-muted)]">{content.note}</p>
    </>
  );
}
