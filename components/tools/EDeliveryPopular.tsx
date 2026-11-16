import type { EDeliveryPageContent } from "@/content/types";
import type { RegisterRow } from "@/lib/tools/e-delivery-register";
import popularSnapshot from "@/lib/tools/e-delivery-popular.json";
import { institutionsByRegon } from "@/lib/tools/e-delivery-store";

/**
 * The e-Delivery addresses of well-known offices, for the page text: people search for
 * "adres do e-doręczeń ZUS". The build reads the gov.pl list when it can; Vercel's build
 * servers cannot reach www.gov.pl, so it falls back to lib/tools/e-delivery-popular.json
 * (refreshed by scripts/tools/update-e-delivery-popular.mts). The table shows the list date either way.
 */
export async function loadPopularInstitutions(content: EDeliveryPageContent["popular"]) {
  const live = await institutionsByRegon(content.institutions.map((institution) => institution.regon), 8_000);
  const snapshot = popularSnapshot as { listDate: string; rows: Record<string, RegisterRow | undefined> };
  const useLive = live !== null && live.listDate >= snapshot.listDate;
  const listDate = useLive ? live.listDate : snapshot.listDate;

  const rows = content.institutions.flatMap((institution) => {
    const row = useLive ? live.rows.get(institution.regon) : snapshot.rows[institution.regon];
    return row ? [{ ...institution, row }] : [];
  });
  return rows.length ? { listDate, rows } : null;
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
