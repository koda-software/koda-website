import type { EDeliveryPageContent } from "@/content/types";
import type { RegisterRow } from "@/lib/tools/e-delivery-register";
import { institutionsByRegon } from "@/lib/tools/e-delivery-store";

/**
 * The e-Delivery addresses of well-known offices, read from the gov.pl list when the page
 * is built. People search for "adres do e-doręczeń ZUS", and this answers in the page
 * text. Without a list at build time the section is left out rather than filled with old values.
 */
export async function loadPopularInstitutions(content: EDeliveryPageContent["popular"]) {
  const found = await institutionsByRegon(content.institutions.map((institution) => institution.regon));
  if (!found) return null;

  const rows = content.institutions.flatMap((institution) => {
    const row = found.rows.get(institution.regon);
    return row ? [{ ...institution, row }] : [];
  });
  return rows.length ? { listDate: found.listDate, rows } : null;
}

type PopularRows = NonNullable<Awaited<ReturnType<typeof loadPopularInstitutions>>>;

export function EDeliveryPopular({ content, data, english }: { content: EDeliveryPageContent["popular"]; data: PopularRows; english: boolean }) {
  const date = new Intl.DateTimeFormat(english ? "en-GB" : "pl-PL", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${data.listDate}T12:00:00`));

  return (
    <>
      <h2 className="m-0 text-[clamp(1.6rem,2.6vw,2rem)] leading-[1.15] tracking-[-0.03em] text-[var(--color-ink)]" id="tool-examples">
        {content.title}
      </h2>
      <p className="m-0 mt-4 max-w-[46rem] text-[1.04rem] leading-[1.7] text-[var(--color-muted)]">
        {content.intro.replace("{date}", date)}
      </p>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full border-collapse text-[1rem] text-[var(--color-ink)]">
          <thead>
            <tr className="text-left text-[0.92rem] text-[var(--color-muted)]">
              {content.columns.map((column) => (
                <th className="border-b border-[rgba(11,17,22,0.16)] py-2.5 pr-4 font-semibold" key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map(({ regon, label, row }) => (
              <PopularRow key={regon} label={label} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function PopularRow({ label, row }: { label: string; row: RegisterRow }) {
  return (
    <tr>
      <th className="border-b border-[rgba(11,17,22,0.1)] py-3 pr-4 text-left align-top font-semibold" scope="row">
        {label}
        <span className="mt-0.5 block text-[0.88rem] font-normal text-[var(--color-muted)]">{row.name}</span>
      </th>
      <td className="whitespace-nowrap border-b border-[rgba(11,17,22,0.1)] py-3 pr-4 align-top text-[var(--color-muted)]">{row.regon}</td>
      <td className="whitespace-nowrap border-b border-[rgba(11,17,22,0.1)] py-3 align-top font-display [font-variant-numeric:tabular-nums]">{row.ade}</td>
    </tr>
  );
}
