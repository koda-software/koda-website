import type { JpkViewerPageContent } from "@/content/types";

/**
 * The markers a JPK_V7 row can carry (KSeF, GTU, procedures, document types), rendered on
 * the server. People search for what a code means, and these tables answer in the page text.
 */
export function JpkMarkers({ content }: { content: JpkViewerPageContent["markers"] }) {
  return (
    <>
      <h2 className="m-0 text-[clamp(1.6rem,2.6vw,2rem)] leading-[1.15] tracking-[-0.03em] text-[var(--color-ink)]" id="tool-examples">
        {content.title}
      </h2>
      <p className="m-0 mt-4 max-w-[46rem] text-[1.04rem] leading-[1.7] text-[var(--color-muted)]">{content.intro}</p>
      <div className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(100%,26rem),1fr))] items-start gap-x-12 gap-y-10">
        {content.tables.map((table) => (
          <div className="min-w-0 overflow-x-auto" key={table.caption}>
            <table className="w-full border-collapse text-[1rem] text-[var(--color-ink)]">
              <caption className="pb-3 text-left font-semibold">{table.caption}</caption>
              <thead>
                <tr className="text-left text-[0.92rem] text-[var(--color-muted)]">
                  {table.columns.map((column) => (
                    <th className="border-b border-[rgba(11,17,22,0.16)] py-2.5 pr-4 font-semibold" key={column} scope="col">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map(([code, description]) => (
                  <tr key={code}>
                    <th className="whitespace-nowrap border-b border-[rgba(11,17,22,0.1)] py-3 pr-4 text-left align-top font-semibold" scope="row">
                      {code}
                    </th>
                    <td className="border-b border-[rgba(11,17,22,0.1)] py-3 text-[var(--color-muted)]">{description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </>
  );
}
