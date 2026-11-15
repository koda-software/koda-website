"use client";

import { Fragment, useEffect, useId, useMemo, useState, type ReactNode } from "react";
import type { JpkViewerLabels } from "@/content/types";
import {
  GTU_CODES,
  PROCEDURES,
  PURCHASE_AMOUNT_KEYS,
  PURCHASE_DOC_TYPES,
  SALE_AMOUNT_KEYS,
  SALE_DOC_TYPES,
  purchaseNet,
  purchaseTax,
  saleBase,
  saleTax,
  type JpkAnalysis,
  type JpkPurchaseRow,
  type JpkSaleRow,
  type KsefKind,
} from "@/lib/tools/jpk";
import { purchasesCsv, salesCsv } from "@/lib/tools/jpk-csv";
import { count, download, formatDate, inputClass, money, numClass, quietButton, tdClass, thClass, trackToolEvent, warnText, type Locale } from "./format";

type Register = "sales" | "purchases";
type Row = JpkSaleRow | JpkPurchaseRow;
type SortKey = "lp" | "name" | "document" | "issueDate" | "receivedDate" | "base" | "tax";

const PAGE_SIZE = 100;
const KSEF_FILTERS: KsefKind[] = ["number", "OFF", "BFK", "DI", "missing"];
const gtuCode = (code: number) => `GTU_${String(code).padStart(2, "0")}`;

const isSale = (row: Row): row is JpkSaleRow => "saleDate" in row;
const baseOf = (row: Row) => (isSale(row) ? saleBase(row) : purchaseNet(row));
const taxOf = (row: Row) => (isSale(row) ? saleTax(row) : purchaseTax(row));

function marksOf(row: Row): string[] {
  if (!isSale(row)) return [row.docType, row.imported ? "IMP" : null].filter((mark): mark is string => Boolean(mark));
  return [row.docType, ...row.gtu.map(gtuCode), ...row.procedures, row.badDebt ? "89a" : null].filter((mark): mark is string => Boolean(mark));
}

const shortKsef = (number: string) => (number.length > 22 ? `${number.slice(0, 10)}…${number.slice(-6)}` : number);

/**
 * One register, 100 rows a page, with search, filters and sorting over all rows. Plain
 * pagination rather than a virtual list: it works with the keyboard and screen readers,
 * and 130 000 rows filter in a few milliseconds.
 */
export function JpkRowsTable({
  analysis,
  register,
  issueRows,
  labels,
  locale,
}: {
  analysis: JpkAnalysis;
  register: Register;
  /** Indexes of rows a warning points at. */
  issueRows: Set<number>;
  labels: JpkViewerLabels;
  locale: Locale;
}) {
  const id = useId();
  const t = labels.table;
  const rows: readonly Row[] = useMemo(() => (register === "sales" ? (analysis.jpk.sales ?? []) : (analysis.jpk.purchases ?? [])), [analysis, register]);
  const sales = register === "sales";

  const [rawQuery, setRawQuery] = useState("");
  const [query, setQuery] = useState("");
  const [ksef, setKsef] = useState<KsefKind | "">("");
  const [gtu, setGtu] = useState("");
  const [procedure, setProcedure] = useState("");
  const [docType, setDocType] = useState("");
  const [onlyIssues, setOnlyIssues] = useState(false);
  const [sort, setSort] = useState<{ key: SortKey; descending: boolean }>({ key: "lp", descending: false });
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setQuery(rawQuery.trim().toLowerCase()), 150);
    return () => window.clearTimeout(timer);
  }, [rawQuery]);

  /* Reset to the first page whenever the filtered set changes. */
  const filterKey = `${query}|${ksef}|${gtu}|${procedure}|${docType}|${onlyIssues}|${sort.key}|${sort.descending}`;
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  if (filterKey !== lastFilterKey) {
    setLastFilterKey(filterKey);
    setPage(0);
    setOpen(null);
  }

  const haystack = useMemo(
    () => rows.map((row) => `${row.name} ${row.taxId} ${row.document} ${row.ksef?.kind === "number" ? row.ksef.number : ""}`.toLowerCase()),
    [rows],
  );

  const filtered = useMemo(() => {
    const gtuNumber = gtu ? Number(gtu) : null;
    const indexes: number[] = [];
    rows.forEach((row, index) => {
      if (query && !haystack[index].includes(query)) return;
      if (ksef && (row.ksef ? row.ksef.kind : "missing") !== ksef) return;
      if (docType && (docType === "IMP" ? !(!isSale(row) && row.imported) : row.docType !== docType)) return;
      if (gtuNumber !== null && !(isSale(row) && row.gtu.includes(gtuNumber))) return;
      if (procedure && !(isSale(row) && row.procedures.includes(procedure as JpkSaleRow["procedures"][number]))) return;
      if (onlyIssues && !issueRows.has(index)) return;
      indexes.push(index);
    });

    if (sort.key !== "lp" || sort.descending) {
      const collator = new Intl.Collator(locale === "pl" ? "pl" : "en", { numeric: true, sensitivity: "base" });
      const value = (index: number): string | number => {
        const row = rows[index];
        switch (sort.key) {
          case "lp": return row.lp ?? index + 1;
          case "name": return row.name;
          case "document": return row.document;
          case "issueDate": return row.issueDate ?? "";
          case "receivedDate": return (!isSale(row) && row.receivedDate) || "";
          case "base": return baseOf(row);
          case "tax": return taxOf(row);
        }
      };
      indexes.sort((a, b) => {
        const va = value(a);
        const vb = value(b);
        const order = typeof va === "number" && typeof vb === "number" ? va - vb : collator.compare(String(va), String(vb));
        return (sort.descending ? -order : order) || a - b;
      });
    }
    return indexes;
  }, [rows, haystack, query, ksef, gtu, procedure, docType, onlyIssues, issueRows, sort, locale]);

  const totals = useMemo(() => {
    let base = 0;
    let tax = 0;
    let fp = false;
    for (const index of filtered) {
      const row = rows[index];
      if (isSale(row) && row.docType === "FP") {
        fp = true;
        continue;
      }
      base += baseOf(row);
      tax += taxOf(row);
    }
    return { base, tax, fp };
  }, [filtered, rows]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages - 1);
  const shown = filtered.slice(current * PAGE_SIZE, (current + 1) * PAGE_SIZE);

  const exportCsv = () => {
    const selected = filtered.map((index) => rows[index]);
    const csvLabels = labels.csv;
    const content = sales ? salesCsv(selected as JpkSaleRow[], csvLabels, locale) : purchasesCsv(selected as JpkPurchaseRow[], csvLabels, locale);
    const { jpk } = analysis;
    const periodPart = jpk.year ? `_${jpk.year}${jpk.month ? `-${String(jpk.month).padStart(2, "0")}` : ""}` : "";
    download(`${jpk.structure}${periodPart}_${sales ? csvLabels.salesFile : csvLabels.purchasesFile}.csv`, content, "text/csv;charset=utf-8");
    trackToolEvent("tool_export");
  };

  const copyKsef = (index: number, number: string) => {
    void navigator.clipboard?.writeText(number).then(() => {
      setCopied(index);
      window.setTimeout(() => setCopied((value) => (value === index ? null : value)), 1500);
    });
  };

  const docTypes = sales ? [...SALE_DOC_TYPES] : [...PURCHASE_DOC_TYPES, "IMP"];
  const columns: Array<{ key: SortKey | null; label: string; numeric?: boolean }> = [
    { key: "lp", label: t.columns.lp },
    { key: "name", label: sales ? t.columns.customer : t.columns.supplier },
    { key: "document", label: t.columns.document },
    { key: "issueDate", label: t.columns.issueDate },
    ...(sales ? [] : [{ key: "receivedDate" as const, label: t.columns.receivedDate }]),
    { key: null, label: t.columns.ksef },
    { key: "base", label: sales ? t.columns.base : t.columns.net, numeric: true },
    { key: "tax", label: t.columns.tax, numeric: true },
    { key: null, label: t.columns.marks },
  ];

  const selectClass = `${inputClass} max-w-full`;

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end gap-3">
        <div className="grid min-w-[min(100%,16rem)] flex-[1_1_16rem] gap-1.5">
          <label className="text-[0.88rem] font-semibold text-[var(--color-ink)]" htmlFor={`${id}-search`}>
            {t.search}
          </label>
          <input className={inputClass} id={`${id}-search`} onChange={(event) => setRawQuery(event.target.value)} placeholder={t.searchPlaceholder} type="search" value={rawQuery} />
        </div>
        {analysis.summary.ksef ? (
          <Select id={`${id}-ksef`} label={t.ksefFilter} onChange={(value) => setKsef(value as KsefKind | "")} value={ksef} className={selectClass}>
            <option value="">{t.all}</option>
            {KSEF_FILTERS.map((kind) => (
              <option key={kind} value={kind}>
                {labels.summary.ksefKinds[kind]}
              </option>
            ))}
          </Select>
        ) : null}
        {sales ? (
          <>
            <Select id={`${id}-gtu`} label={t.gtuFilter} onChange={setGtu} value={gtu} className={selectClass}>
              <option value="">{t.all}</option>
              {GTU_CODES.map((code) => (
                <option key={code} value={code}>
                  {gtuCode(code)}
                </option>
              ))}
            </Select>
            <Select id={`${id}-procedure`} label={t.procedureFilter} onChange={setProcedure} value={procedure} className={selectClass}>
              <option value="">{t.all}</option>
              {PROCEDURES.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </Select>
          </>
        ) : null}
        <Select id={`${id}-doc`} label={t.docTypeFilter} onChange={setDocType} value={docType} className={selectClass}>
          <option value="">{t.all}</option>
          {docTypes.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </Select>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-[0.95rem] text-[var(--color-ink)]">
          <input checked={onlyIssues} className="h-4 w-4 accent-[var(--color-blue)]" onChange={(event) => setOnlyIssues(event.target.checked)} type="checkbox" />
          {t.onlyIssues}
        </label>
        <button className={quietButton} disabled={!filtered.length} onClick={exportCsv} type="button">
          {t.export}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[0.92rem] text-[var(--color-ink)]">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  aria-sort={column.key && sort.key === column.key ? (sort.descending ? "descending" : "ascending") : undefined}
                  className={`${thClass} ${column.numeric ? "text-right" : ""}`}
                  key={column.label}
                  scope="col"
                >
                  {column.key ? (
                    <button
                      className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-inherit underline-offset-4 hover:underline"
                      onClick={() => setSort((value) => ({ key: column.key!, descending: value.key === column.key ? !value.descending : false }))}
                      title={t.sortBy}
                      type="button"
                    >
                      {column.label}
                      {sort.key === column.key ? <span aria-hidden="true">{sort.descending ? " ↓" : " ↑"}</span> : null}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.length ? (
              shown.map((index) => {
                const row = rows[index];
                const expanded = open === index;
                const flagged = issueRows.has(index);
                return (
                  <Fragment key={index}>
                    <tr className={expanded ? "bg-[var(--color-paper)]" : ""}>
                      <td className={`${tdClass} whitespace-nowrap`}>
                        <button
                          aria-controls={`${id}-row-${index}`}
                          aria-expanded={expanded}
                          aria-label={`${t.showDetails}: ${row.lp ?? index + 1}`}
                          className={`cursor-pointer border-0 bg-transparent p-0 underline underline-offset-4 ${flagged ? `${warnText} font-semibold` : "text-[var(--color-ink)]"}`}
                          onClick={() => setOpen(expanded ? null : index)}
                          type="button"
                        >
                          {row.lp ?? "-"}
                        </button>
                      </td>
                      <td className={`${tdClass} min-w-[12rem]`}>
                        <span className="[overflow-wrap:anywhere]">{row.name}</span>
                        <span className="block text-[0.82rem] text-[var(--color-muted)]">{[row.country, row.taxId].filter(Boolean).join(" ")}</span>
                      </td>
                      <td className={`${tdClass} [overflow-wrap:anywhere]`}>{row.document}</td>
                      <td className={`${tdClass} whitespace-nowrap`}>{formatDate(row.issueDate, locale)}</td>
                      {isSale(row) ? null : <td className={`${tdClass} whitespace-nowrap`}>{formatDate(row.receivedDate, locale)}</td>}
                      <td className={`${tdClass} whitespace-nowrap`}>
                        {row.ksef?.kind === "number" ? (
                          <button
                            className={`cursor-pointer border-0 bg-transparent p-0 font-mono text-[0.84rem] ${row.ksef.valid ? "text-[var(--color-ink)]" : warnText}`}
                            onClick={() => copyKsef(index, (row.ksef as { number: string }).number)}
                            title={`${row.ksef.number}${row.ksef.valid ? "" : ` (${t.invalidKsef})`}. ${t.copy}`}
                            type="button"
                          >
                            {copied === index ? t.copied : shortKsef(row.ksef.number)}
                          </button>
                        ) : row.ksef ? (
                          <Chip>{row.ksef.kind}</Chip>
                        ) : null}
                      </td>
                      <td className={`${tdClass} ${numClass}`}>{money(baseOf(row), locale)}</td>
                      <td className={`${tdClass} ${numClass}`}>{money(taxOf(row), locale)}</td>
                      <td className={tdClass}>
                        <span className="flex flex-wrap gap-1">
                          {marksOf(row).map((mark) => (
                            <Chip key={mark}>{mark}</Chip>
                          ))}
                        </span>
                      </td>
                    </tr>
                    {expanded ? (
                      <tr id={`${id}-row-${index}`}>
                        <td className={`${tdClass} bg-[var(--color-paper)]`} colSpan={columns.length}>
                          <RowDetail labels={labels} locale={locale} row={row} />
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })
            ) : (
              <tr>
                <td className={`${tdClass} text-[var(--color-muted)]`} colSpan={columns.length}>
                  {t.noRows}
                </td>
              </tr>
            )}
          </tbody>
          {filtered.length ? (
            <tfoot>
              <tr className="font-semibold">
                <td className={`${tdClass} border-b-0`} colSpan={columns.length - 3}>
                  {totals.fp ? t.totalsWithoutFp : t.totals}
                </td>
                <td className={`${tdClass} ${numClass} border-b-0`}>{money(totals.base, locale)}</td>
                <td className={`${tdClass} ${numClass} border-b-0`}>{money(totals.tax, locale)}</td>
                <td className={`${tdClass} border-b-0`} />
              </tr>
            </tfoot>
          ) : null}
        </table>
      </div>

      {filtered.length ? (
        <nav aria-label={t.page} className="flex flex-wrap items-center justify-between gap-3 text-[0.95rem]">
          <p aria-live="polite" className="m-0 text-[var(--color-muted)]">
            {t.range
              .replace("{from}", count(current * PAGE_SIZE + 1, locale))
              .replace("{to}", count(Math.min((current + 1) * PAGE_SIZE, filtered.length), locale))
              .replace("{total}", count(filtered.length, locale))}
          </p>
          {pages > 1 ? (
            <div className="flex flex-wrap items-center gap-2">
              <button className={quietButton} disabled={current === 0} onClick={() => setPage(current - 1)} type="button">
                {t.previous}
              </button>
              <label className="flex items-center gap-2">
                <span className="sr-only">{t.page}</span>
                <input
                  className={`${inputClass} w-20 text-center`}
                  max={pages}
                  min={1}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    if (Number.isInteger(value) && value >= 1 && value <= pages) setPage(value - 1);
                  }}
                  type="number"
                  value={current + 1}
                />
                <span className="text-[var(--color-muted)]">/ {count(pages, locale)}</span>
              </label>
              <button className={quietButton} disabled={current >= pages - 1} onClick={() => setPage(current + 1)} type="button">
                {t.next}
              </button>
            </div>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}

function Select({ id, label, value, onChange, className, children }: { id: string; label: string; value: string; onChange: (value: string) => void; className: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <label className="text-[0.88rem] font-semibold text-[var(--color-ink)]" htmlFor={id}>
        {label}
      </label>
      <select className={className} id={id} onChange={(event) => onChange(event.target.value)} value={value}>
        {children}
      </select>
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return <span className="inline-block whitespace-nowrap rounded-full border border-[rgba(11,17,22,0.16)] px-2 py-0.5 text-[0.78rem] leading-[1.4]">{children}</span>;
}

function RowDetail({ row, labels, locale }: { row: Row; labels: JpkViewerLabels; locale: Locale }) {
  const t = labels.table;
  const c = labels.csv;
  const pairs: Array<[string, string | null]> = isSale(row)
    ? [
        [c.sales.country, row.country],
        [c.sales.taxId, row.taxId],
        [c.sales.name, row.name],
        [c.sales.document, row.document],
        [c.sales.issueDate, formatDate(row.issueDate, locale)],
        [t.detail.saleDate, formatDate(row.saleDate, locale)],
        [c.sales.ksef, row.ksef ? (row.ksef.kind === "number" ? row.ksef.number : row.ksef.kind) : null],
        [c.sales.docType, row.docType ? `${row.docType}: ${labels.docTypes[row.docType] ?? ""}` : null],
        [c.sales.gtu, row.gtu.map((code) => `${gtuCode(code)} ${labels.gtu[String(code).padStart(2, "0")] ?? ""}`).join("; ") || null],
        [c.sales.procedures, row.procedures.map((code) => `${code} ${labels.procedures[code] ?? ""}`).join("; ") || null],
        [t.badDebt, row.badDebt ? labels.csv.yes : null],
        [t.detail.dueDate, formatDate(row.badDebt?.dueDate ?? null, locale)],
        [t.detail.paidDate, formatDate(row.badDebt?.paidDate ?? null, locale)],
        ...SALE_AMOUNT_KEYS.flatMap((key): Array<[string, string]> =>
          row.amounts[key] === undefined ? [] : [[`${key} ${labels.fields[`P_${key.slice(2)}`] ?? ""}`, money(row.amounts[key]!, locale)]],
        ),
        [t.detail.marginGross, row.marginGross === null ? null : money(row.marginGross, locale)],
      ]
    : [
        [c.purchases.country, row.country],
        [c.purchases.taxId, row.taxId],
        [c.purchases.name, row.name],
        [c.purchases.document, row.document],
        [c.purchases.issueDate, formatDate(row.issueDate, locale)],
        [c.purchases.receivedDate, formatDate(row.receivedDate, locale)],
        [c.purchases.ksef, row.ksef ? (row.ksef.kind === "number" ? row.ksef.number : row.ksef.kind) : null],
        [c.purchases.docType, row.docType ? `${row.docType}: ${labels.docTypes[row.docType] ?? ""}` : null],
        [t.imported, row.imported ? labels.csv.yes : null],
        ...PURCHASE_AMOUNT_KEYS.flatMap((key): Array<[string, string]> =>
          row.amounts[key] === undefined ? [] : [[`${key} ${labels.fields[`P_${key.slice(2)}`] ?? ""}`, money(row.amounts[key]!, locale)]],
        ),
        [t.detail.marginPurchase, row.marginPurchase === null ? null : money(row.marginPurchase, locale)],
      ];

  return (
    <dl className="m-0 grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] gap-x-6 gap-y-1 py-1 text-[0.9rem] max-[560px]:grid-cols-1">
      {pairs
        .filter((pair): pair is [string, string] => Boolean(pair[1]))
        .map(([label, value]) => (
          <Fragment key={label}>
            <dt className="text-[var(--color-muted)]">{label}</dt>
            <dd className="m-0 [overflow-wrap:anywhere] max-[560px]:mb-1">{value}</dd>
          </Fragment>
        ))}
    </dl>
  );
}
