"use client";

import type { ReactNode } from "react";
import type { JpkViewerLabels } from "@/content/types";
import type { JpkAnalysis, JpkCheck, JpkContractor, KsefKind } from "@/lib/tools/jpk";
import { checkMessage, count, money, numClass, tdClass, thClass, type Locale } from "./format";

const KSEF_KINDS: KsefKind[] = ["number", "OFF", "BFK", "DI", "missing"];

/** The default tab: what does not add up first, then what is worth knowing, then the register summaries. */
export function JpkSummaryPanel({ analysis, labels, locale }: { analysis: JpkAnalysis; labels: JpkViewerLabels; locale: Locale }) {
  const { checks, summary, jpk } = analysis;
  const l = labels.summary;
  const warn = checks.filter((check) => check.status === "warn");
  const info = checks.filter((check) => check.status === "info");
  const ok = checks.filter((check) => check.status === "ok");
  const hasRegister = jpk.sales !== null;

  return (
    <div className="grid gap-8">
      <div className="grid gap-5">
        {warn.length ? <CheckList analysis={analysis} checks={warn} labels={labels} locale={locale} title={labels.checksTitle.warn} tone="warn" /> : null}
        {info.length ? <CheckList analysis={analysis} checks={info} labels={labels} locale={locale} title={labels.checksTitle.info} tone="info" /> : null}
        {ok.length ? (
          <details>
            <summary className="cursor-pointer font-semibold text-[var(--color-ink)]">{labels.checksTitle.ok.replace("{count}", String(ok.length))}</summary>
            <ul className="m-0 mt-3 grid gap-1.5 pl-5 text-[var(--color-muted)]">
              {ok.map((check, index) => (
                <li key={`${check.id}-${check.register ?? ""}-${check.field ?? ""}-${index}`}>{checkMessage(check, analysis, labels, locale)}</li>
              ))}
            </ul>
          </details>
        ) : null}
        <p className="m-0 text-[0.9rem] text-[var(--color-muted)]">{labels.checksNote}</p>
      </div>

      {hasRegister ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,24rem),1fr))] items-start gap-x-10 gap-y-8">
          <Block title={l.vatTitle}>
            {summary.vatByRate.length ? (
              <Table head={[l.vatColumns.rate, l.vatColumns.base, l.vatColumns.tax]} numeric={[1, 2]}>
                {summary.vatByRate.map((row) => (
                  <tr key={row.key}>
                    <td className={tdClass}>{l.vatRates[row.key]}</td>
                    <td className={`${tdClass} ${numClass}`}>{money(row.base, locale)}</td>
                    <td className={`${tdClass} ${numClass}`}>{row.tax === null ? "-" : money(row.tax, locale)}</td>
                  </tr>
                ))}
              </Table>
            ) : (
              <p className="m-0 text-[var(--color-muted)]">{l.none}</p>
            )}
          </Block>

          <Block title={l.ksefTitle}>
            {summary.ksef ? (
              <Table head={[l.ksefColumns.kind, l.ksefColumns.sales, l.ksefColumns.purchases]} numeric={[1, 2]}>
                {KSEF_KINDS.filter((kind) => kind !== "missing" || summary.ksef!.sales.missing || summary.ksef!.purchases.missing).map((kind) => (
                  <tr key={kind}>
                    <td className={tdClass}>{l.ksefKinds[kind]}</td>
                    <td className={`${tdClass} ${numClass}`}>{count(summary.ksef!.sales[kind], locale)}</td>
                    <td className={`${tdClass} ${numClass}`}>{count(summary.ksef!.purchases[kind], locale)}</td>
                  </tr>
                ))}
              </Table>
            ) : (
              <p className="m-0 text-[var(--color-muted)]">{l.ksefNotApplicable}</p>
            )}
          </Block>

          {summary.gtu.length ? (
            <Block title={l.gtuTitle}>
              <Table head={[l.codeColumns.code, l.codeColumns.description, l.codeColumns.rows, l.codeColumns.base]} numeric={[2, 3]}>
                {summary.gtu.map((row) => {
                  const code = String(row.code).padStart(2, "0");
                  return (
                    <tr key={row.code}>
                      <td className={`${tdClass} whitespace-nowrap`}>GTU_{code}</td>
                      <td className={tdClass}>{labels.gtu[code]}</td>
                      <td className={`${tdClass} ${numClass}`}>{count(row.rows, locale)}</td>
                      <td className={`${tdClass} ${numClass}`}>{money(row.base, locale)}</td>
                    </tr>
                  );
                })}
              </Table>
            </Block>
          ) : null}

          {summary.procedures.length ? (
            <Block title={l.proceduresTitle}>
              <Table head={[l.codeColumns.code, l.codeColumns.description, l.codeColumns.rows]} numeric={[2]}>
                {summary.procedures.map((row) => (
                  <tr key={row.code}>
                    <td className={`${tdClass} whitespace-nowrap`}>{row.code}</td>
                    <td className={tdClass}>{labels.procedures[row.code]}</td>
                    <td className={`${tdClass} ${numClass}`}>{count(row.rows, locale)}</td>
                  </tr>
                ))}
              </Table>
            </Block>
          ) : null}

          {summary.docTypes.sales.length || summary.docTypes.purchases.length ? (
            <Block title={l.docTypesTitle}>
              <Table head={[l.codeColumns.code, l.codeColumns.description, l.codeColumns.rows]} numeric={[2]}>
                {[...summary.docTypes.sales.map((row) => ({ ...row, register: "sales" as const })), ...summary.docTypes.purchases.map((row) => ({ ...row, register: "purchases" as const }))].map(
                  (row) => (
                    <tr key={`${row.register}-${row.code}`}>
                      <td className={`${tdClass} whitespace-nowrap`}>{row.code}</td>
                      <td className={tdClass}>
                        {labels.docTypes[row.code] ?? row.code}
                        <span className="block text-[0.82rem] text-[var(--color-muted)]">{labels.registerNames[row.register]}</span>
                      </td>
                      <td className={`${tdClass} ${numClass}`}>{count(row.rows, locale)}</td>
                    </tr>
                  ),
                )}
              </Table>
            </Block>
          ) : null}

          {summary.topCustomers.length ? <Contractors labels={labels} locale={locale} rows={summary.topCustomers} title={l.customersTitle} /> : null}
          {summary.topSuppliers.length ? <Contractors labels={labels} locale={locale} rows={summary.topSuppliers} title={l.suppliersTitle} /> : null}
        </div>
      ) : null}
    </div>
  );
}

function CheckList({ analysis, checks, labels, locale, title, tone }: { analysis: JpkAnalysis; checks: JpkCheck[]; labels: JpkViewerLabels; locale: Locale; title: string; tone: "warn" | "info" }) {
  return (
    <section className={`rounded-[12px] border p-4 ${tone === "warn" ? "border-[#b26b00]/40" : "border-[rgba(11,17,22,0.14)]"}`}>
      <h3 className={`m-0 font-sans text-[1rem] font-semibold ${tone === "warn" ? "text-[#7a4a00]" : "text-[var(--color-ink)]"}`}>{title}</h3>
      <ul className="m-0 mt-2 grid gap-1.5 pl-5">
        {checks.map((check, index) => (
          <li key={`${check.id}-${check.register ?? ""}-${check.field ?? ""}-${index}`}>{checkMessage(check, analysis, labels, locale)}</li>
        ))}
      </ul>
    </section>
  );
}

function Contractors({ labels, locale, rows, title }: { labels: JpkViewerLabels; locale: Locale; rows: JpkContractor[]; title: string }) {
  const c = labels.summary.contractorColumns;
  return (
    <Block title={title}>
      <Table head={[c.name, c.rows, c.base, c.tax]} numeric={[1, 2, 3]}>
        {rows.map((row) => (
          <tr key={`${row.country ?? ""}${row.taxId}${row.name}`}>
            <td className={`${tdClass} min-w-[11rem]`}>
              <span className="[overflow-wrap:anywhere]">{row.name}</span>
              {row.taxId ? <span className="block text-[0.82rem] text-[var(--color-muted)]">{[row.country, row.taxId].filter(Boolean).join(" ")}</span> : null}
            </td>
            <td className={`${tdClass} ${numClass}`}>{count(row.rows, locale)}</td>
            <td className={`${tdClass} ${numClass}`}>{money(row.base, locale)}</td>
            <td className={`${tdClass} ${numClass}`}>{money(row.tax, locale)}</td>
          </tr>
        ))}
      </Table>
    </Block>
  );
}

export function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid min-w-0 gap-3">
      <h3 className="m-0 font-sans text-[1rem] font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function Table({ head, numeric, children }: { head: string[]; numeric: number[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto print:overflow-visible">
      <table className="w-full border-collapse text-[0.92rem] print:text-[9pt]">
        <thead>
          <tr>
            {head.map((label, index) => (
              <th className={`${thClass} ${numeric.includes(index) ? "text-right" : ""}`} key={label} scope="col">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
