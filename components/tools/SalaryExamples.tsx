import type { SalaryCalculatorPageContent } from "@/content/types";
import { firstMonth, type PayrollInput } from "@/lib/tools/payroll";
import { defaultYear, payrollYears } from "@/lib/tools/payroll-rates";
import { formatCents } from "@/lib/tools/vat";

const cellClass = "whitespace-nowrap border-b border-[rgba(11,17,22,0.1)] py-3 pr-6 text-right";

const base: Omit<PayrollInput, "gross" | "contract"> = {
  kup: "standard",
  civilKup: "standard",
  status: "only",
  sickness: true,
  pit2: false,
  relief: "none",
  ppk: false,
};

/**
 * Take-home pay for common gross amounts on the three contracts, rendered on the server
 * with the same engine as the calculator. It answers "6000 brutto ile netto" in the
 * page's own text.
 */
export function SalaryExamples({ content, english }: { content: SalaryCalculatorPageContent["examples"]; english: boolean }) {
  const rates = payrollYears[defaultYear];
  const sep = english ? "." : ",";

  const rows = content.amounts.map((amount) => {
    const gross = amount * 100;
    const employment = firstMonth({ ...base, contract: "employment", gross, pit2: true }, rates);
    return {
      amount,
      cells: [
        employment.net,
        firstMonth({ ...base, contract: "mandate", gross }, rates).net,
        firstMonth({ ...base, contract: "work", gross }, rates).net,
        employment.employerCost,
      ],
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
              <tr key={row.amount}>
                <th className="whitespace-nowrap border-b border-[rgba(11,17,22,0.1)] py-3 pr-6 text-left font-semibold" scope="row">
                  {formatCents(row.amount * 100, sep).replace(/[.,]00$/, "")}
                </th>
                {row.cells.map((cents, index) => (
                  <td className={`${cellClass} ${index === row.cells.length - 1 ? "text-[var(--color-muted)]" : ""}`} key={content.columns[index + 1]}>
                    {formatCents(cents, sep)}
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
