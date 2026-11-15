import type { AmountInWordsPageContent } from "@/content/types";
import { parseAmount, toEnglishWords, toPolishWords } from "@/lib/tools/amount-in-words";

const options = { sayOne: false, capitalize: false };

/**
 * Common amounts written out, rendered on the server. People search for exact amounts
 * ("1000 zł słownie"), and this table answers those searches in the page's own text.
 */
export function AmountExamples({ content, english }: { content: AmountInWordsPageContent["examples"]; english: boolean }) {
  const rows = content.amounts.flatMap((raw) => {
    const amount = parseAmount(raw);
    if (amount.kind !== "ok") return [];

    return [
      {
        key: raw,
        label: `${amount.wholeDigits.replace(/\B(?=(\d{3})+(?!\d))/g, english ? "," : " ")} zł`,
        polish: toPolishWords(amount, "PLN", options),
        english: english ? toEnglishWords(amount, "PLN", options) : "",
      },
    ];
  });

  return (
    <>
      <h2 className="m-0 text-[clamp(1.6rem,2.6vw,2rem)] leading-[1.15] tracking-[-0.03em] text-[var(--color-ink)]" id="tool-examples">
        {content.title}
      </h2>
      <p className="m-0 mt-4 max-w-[46rem] text-[1.04rem] leading-[1.7] text-[var(--color-muted)]">{content.intro}</p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse text-[1rem] text-[var(--color-ink)]">
          <thead>
            <tr className="text-left text-[0.92rem] text-[var(--color-muted)]">
              {content.columns.map((column) => (
                <th className="border-b border-[rgba(11,17,22,0.16)] py-2.5 pr-6 font-semibold" key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key}>
                <th className="whitespace-nowrap border-b border-[rgba(11,17,22,0.1)] py-3 pr-6 text-left font-semibold" scope="row">
                  {row.label}
                </th>
                <td className="border-b border-[rgba(11,17,22,0.1)] py-3 pr-6" lang="pl">
                  {row.polish}
                </td>
                {english ? (
                  <td className="border-b border-[rgba(11,17,22,0.1)] py-3 text-[var(--color-muted)]" lang="en">
                    {row.english}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
