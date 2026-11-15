"use client";

import { useId, useRef, useState, type DragEvent, type ReactNode } from "react";
import type { KsefViewerLabels } from "@/content/types";
import { MAX_KSEF_FILE_BYTES, ksefNumberFromFileName, type Invoice, type Party } from "@/lib/tools/ksef";
import { parseInvoiceXml } from "@/lib/tools/ksef-dom";

type Gtag = (command: "event", name: string, params: Record<string, string>) => void;

/** Counts use of the tool and nothing else: never a file name or any invoice content. */
function trackToolEvent(name: string) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", name, { tool: "ksef_viewer" });
}

type Entry = { id: string; fileName: string; ksefNumber: string | null; invoice: Invoice };

const thClass = "border-b border-[rgba(11,17,22,0.16)] px-2 py-2 text-left text-[0.82rem] font-semibold text-[var(--color-muted)] print:text-black";
const tdClass = "border-b border-[rgba(11,17,22,0.08)] px-2 py-2.5 align-top";

export function KsefViewer({ labels, locale }: { labels: KsefViewerLabels; locale: "pl" | "en" }) {
  const id = useId();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [pasted, setPasted] = useState("");
  const counter = useRef(0);
  const invoiceRef = useRef<HTMLElement>(null);

  const add = (results: Array<{ fileName: string; xml: string }>) => {
    const added: Entry[] = [];
    const failed: string[] = [];

    for (const { fileName, xml } of results) {
      const parsed = parseInvoiceXml(xml);
      if (parsed.kind === "ok") {
        counter.current += 1;
        added.push({ id: `${counter.current}`, fileName, ksefNumber: ksefNumberFromFileName(fileName), invoice: parsed.invoice });
      } else {
        failed.push((parsed.reason === "xml" ? labels.errors.xml : labels.errors.notInvoice).replace("{file}", fileName));
      }
    }

    setErrors(failed);
    if (added.length) {
      setEntries((current) => [...current, ...added]);
      if (added.length === 1 || !entries.length) setOpenId(added[0].id);
      trackToolEvent("tool_used");
      window.requestAnimationFrame(() => invoiceRef.current?.focus());
    }
  };

  const readFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    const tooLarge = list.filter((file) => file.size > MAX_KSEF_FILE_BYTES);
    const readable = list.filter((file) => file.size <= MAX_KSEF_FILE_BYTES);
    const results: Array<{ fileName: string; xml: string }> = [];
    const unreadable: string[] = [];

    for (const file of readable) {
      try {
        results.push({ fileName: file.name, xml: await file.text() });
      } catch {
        unreadable.push(labels.errors.read.replace("{file}", file.name));
      }
    }

    add(results);
    setErrors((current) => [...current, ...unreadable, ...tooLarge.map((file) => labels.errors.tooLarge.replace("{file}", file.name))]);
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    if (event.dataTransfer.files.length) void readFiles(event.dataTransfer.files);
  };

  const open = entries.find((entry) => entry.id === openId) ?? null;

  return (
    <div className="grid gap-8">
      <div className="grid gap-4 print:hidden">
        <label
          className={`flex min-h-[11rem] cursor-pointer flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] border-2 border-dashed px-6 py-8 text-center transition-colors focus-within:outline-2 focus-within:outline-offset-[3px] focus-within:outline-[var(--color-blue)] ${
            dragging ? "border-[var(--color-blue)] bg-[rgba(10,116,179,0.06)]" : "border-[rgba(11,17,22,0.2)] hover:border-[rgba(11,17,22,0.4)]"
          }`}
          htmlFor={`${id}-files`}
          onDragLeave={() => setDragging(false)}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDrop={onDrop}
        >
          <svg aria-hidden="true" className="h-8 w-8 text-[var(--color-ink)]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
            <path d="M14 3v5h5M12 18v-6m-3 3 3-3 3 3" />
          </svg>
          <span className="font-display text-[1.25rem] font-medium text-[var(--color-ink)]">{labels.dropTitle}</span>
          <span className="max-w-[34rem] text-[0.95rem] text-[var(--color-muted)]">{labels.dropHint}</span>
          <input
            accept=".xml,text/xml,application/xml"
            className="sr-only"
            id={`${id}-files`}
            multiple
            onChange={(event) => {
              if (event.target.files?.length) void readFiles(event.target.files);
              event.target.value = "";
            }}
            type="file"
          />
        </label>

        <details className="text-[0.95rem]">
          <summary className="cursor-pointer text-[var(--color-ink)]">{labels.pasteSummary}</summary>
          <div className="mt-3 grid gap-3">
            <label className="text-[0.92rem] font-semibold text-[var(--color-ink)]" htmlFor={`${id}-paste`}>
              {labels.pasteLabel}
            </label>
            <textarea
              className="min-h-36 w-full rounded-[12px] border border-[rgba(11,17,22,0.16)] bg-[var(--color-paper)] p-3 font-mono text-[0.85rem] text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--color-blue)]"
              id={`${id}-paste`}
              onChange={(event) => setPasted(event.target.value)}
              spellCheck={false}
              value={pasted}
            />
            <div>
              <button
                className="action cursor-pointer border border-[rgba(11,17,22,0.2)] bg-transparent text-[var(--color-ink)] hover:border-[rgba(11,17,22,0.4)] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!pasted.trim()}
                onClick={() => {
                  add([{ fileName: "XML", xml: pasted }]);
                  setPasted("");
                }}
                type="button"
              >
                {labels.pasteSubmit}
              </button>
            </div>
          </div>
        </details>

        <p className="m-0 text-[0.92rem] text-[var(--color-muted)]">{labels.privacyNote}</p>

        {errors.length ? (
          <ul className="m-0 grid list-none gap-1 p-0 text-[1rem] text-[#a3360f]" role="alert">
            {errors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        ) : null}
      </div>

      {entries.length > 1 ? (
        <div className="grid gap-3 print:hidden">
          <h2 className="m-0 text-[1.25rem] tracking-[-0.02em] text-[var(--color-ink)]">{labels.listTitle}</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[0.95rem] text-[var(--color-ink)]">
              <thead>
                <tr>
                  <th className={thClass} scope="col">{labels.listColumns.seller}</th>
                  <th className={thClass} scope="col">{labels.listColumns.number}</th>
                  <th className={thClass} scope="col">{labels.listColumns.date}</th>
                  <th className={`${thClass} text-right`} scope="col">{labels.listColumns.total}</th>
                  <th className={thClass} scope="col"><span className="sr-only">{labels.open}</span></th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr className={entry.id === openId ? "bg-[var(--color-paper)]" : ""} key={entry.id}>
                    <td className={tdClass}>{entry.invoice.seller?.name ?? entry.fileName}</td>
                    <td className={tdClass}>{entry.invoice.number}</td>
                    <td className={tdClass}>{formatDate(entry.invoice.issueDate, locale)}</td>
                    <td className={`${tdClass} whitespace-nowrap text-right`}>{money(entry.invoice.total, entry.invoice.currency, locale)}</td>
                    <td className={`${tdClass} whitespace-nowrap text-right`}>
                      <button
                        aria-pressed={entry.id === openId}
                        className="cursor-pointer rounded-full border-0 bg-transparent px-2 py-1 text-[var(--color-blue)] underline underline-offset-4"
                        onClick={() => setOpenId(entry.id)}
                        type="button"
                      >
                        {labels.open}
                      </button>
                      <button
                        className="cursor-pointer rounded-full border-0 bg-transparent px-2 py-1 text-[var(--color-muted)] underline underline-offset-4"
                        onClick={() => {
                          setEntries((current) => current.filter((item) => item.id !== entry.id));
                          if (openId === entry.id) setOpenId(null);
                        }}
                        type="button"
                      >
                        {labels.remove}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {open ? (
        <article aria-label={`${labels.kinds[open.invoice.kind] ?? open.invoice.kind} ${open.invoice.number}`} className="print-area grid gap-7 border-t border-[var(--color-border-light)] pt-7 outline-none" ref={invoiceRef} tabIndex={-1}>
          <div className="flex justify-end print:hidden">
            <button className="action action-ink cursor-pointer border-0" onClick={() => { trackToolEvent("tool_print"); window.print(); }} type="button">
              {labels.print}
            </button>
          </div>
          <InvoiceView entry={open} labels={labels} locale={locale} />
        </article>
      ) : null}
    </div>
  );
}

function InvoiceView({ entry, labels, locale }: { entry: Entry; labels: KsefViewerLabels; locale: "pl" | "en" }) {
  const { invoice } = entry;
  const l = labels.invoice;
  const cur = invoice.currency;
  const showGross = invoice.lines.some((line) => line.gross !== null);
  const showUnitGross = invoice.lines.some((line) => line.unitGross !== null);
  const showDiscount = invoice.lines.some((line) => line.discount !== null);

  return (
    <div className="grid gap-7 text-[0.98rem] text-[var(--color-ink)] print:gap-5 print:text-[10pt]">
      {invoice.warnings.length ? (
        <div className="rounded-[12px] border border-[#b26b00]/40 p-4 text-[#7a4a00] print:hidden" role="note">
          <p className="m-0 font-semibold">{labels.warningsTitle}</p>
          <ul className="m-0 mt-2 grid gap-1 pl-5">
            {invoice.warnings.map((warning) => (
              <li key={warning}>{labels.warnings[warning]}</li>
            ))}
          </ul>
          <p className="m-0 mt-2 text-[0.9rem]">{labels.warningsNote}</p>
        </div>
      ) : null}

      <header className="flex flex-wrap items-start justify-between gap-x-10 gap-y-4">
        <div>
          <p className="m-0 text-[0.95rem] text-[var(--color-muted)] print:text-black">{labels.kinds[invoice.kind] ?? invoice.kind}</p>
          <p className="m-0 mt-1 font-display text-[clamp(1.5rem,2.8vw,2.1rem)] font-medium leading-[1.2] tracking-[-0.02em] [overflow-wrap:anywhere]">{invoice.number}</p>
          {entry.ksefNumber ? (
            <p className="m-0 mt-2 text-[0.9rem]">
              {l.ksefNumber}: <span className="font-display">{entry.ksefNumber}</span>
            </p>
          ) : null}
        </div>
        <dl className="m-0 grid grid-cols-[auto_auto] gap-x-5 gap-y-1 text-[0.95rem]">
          <Pair label={l.issueDate} value={formatDate(invoice.issueDate, locale)} />
          <Pair label={l.issuePlace} value={invoice.issuePlace} />
          <Pair label={l.saleDate} value={formatDate(invoice.saleDate, locale)} />
          <Pair
            label={l.salePeriod}
            value={invoice.salePeriod ? `${formatDate(invoice.salePeriod.from, locale) ?? ""} - ${formatDate(invoice.salePeriod.to, locale) ?? ""}` : null}
          />
        </dl>
      </header>

      <div className="grid grid-cols-2 gap-8 max-[720px]:grid-cols-1 print:grid-cols-2">
        <PartyBlock heading={l.seller} labels={labels} party={invoice.seller} />
        <PartyBlock heading={l.buyer} labels={labels} party={invoice.buyer} />
      </div>

      {invoice.others.length ? (
        <div className="grid gap-3">
          <p className="m-0 font-semibold">{l.others}</p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-6">
            {invoice.others.map((party, index) => (
              <PartyBlock heading={party.role ? `${l.role}: ${l.roles[party.role] ?? party.role}` : l.others} key={index} labels={labels} party={party} />
            ))}
          </div>
        </div>
      ) : null}

      {invoice.correction ? (
        <Block title={l.correctionTitle}>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1">
            <Pair label={l.correctionReason} value={invoice.correction.reason} />
            <Pair label={l.correctionType} value={invoice.correction.type ? (l.correctionTypes[invoice.correction.type] ?? invoice.correction.type) : null} />
            {invoice.correction.originals.map((original, index) => (
              <Pair
                key={index}
                label={l.correctedInvoice}
                value={[original.number, formatDate(original.date, locale), original.ksef].filter(Boolean).join(", ")}
              />
            ))}
          </dl>
        </Block>
      ) : null}

      {invoice.lines.length ? (
        <Block title={l.lines.title}>
          <div className="overflow-x-auto print:overflow-visible">
            <table className="w-full border-collapse text-[0.92rem] print:text-[9pt]">
              <thead>
                <tr>
                  <th className={thClass} scope="col">{l.lines.no}</th>
                  <th className={thClass} scope="col">{l.lines.name}</th>
                  <th className={`${thClass} text-right`} scope="col">{l.lines.quantity}</th>
                  <th className={`${thClass} text-right`} scope="col">{l.lines.unitNet}</th>
                  {showUnitGross ? <th className={`${thClass} text-right`} scope="col">{l.lines.unitGross}</th> : null}
                  {showDiscount ? <th className={`${thClass} text-right`} scope="col">{l.lines.discount}</th> : null}
                  <th className={`${thClass} text-right`} scope="col">{l.lines.vatRate}</th>
                  <th className={`${thClass} text-right`} scope="col">{l.lines.net}</th>
                  {showGross ? <th className={`${thClass} text-right`} scope="col">{l.lines.gross}</th> : null}
                </tr>
              </thead>
              <tbody>
                {invoice.lines.map((line, index) => (
                  <tr className={line.before ? "text-[var(--color-muted)]" : ""} key={`${line.no}-${index}`}>
                    <td className={tdClass}>{line.no}</td>
                    <td className={`${tdClass} min-w-[12rem]`}>
                      {line.name}
                      {line.code ? <span className="block text-[0.82rem] text-[var(--color-muted)]">{line.code}</span> : null}
                      {line.before ? <span className="block text-[0.82rem]">{l.lines.before}</span> : null}
                    </td>
                    <td className={`${tdClass} whitespace-nowrap text-right`}>{[number(line.quantity, locale, 0), line.unit].filter(Boolean).join(" ")}</td>
                    <td className={`${tdClass} whitespace-nowrap text-right`}>{number(line.unitNet, locale)}</td>
                    {showUnitGross ? <td className={`${tdClass} whitespace-nowrap text-right`}>{number(line.unitGross, locale)}</td> : null}
                    {showDiscount ? <td className={`${tdClass} whitespace-nowrap text-right`}>{number(line.discount, locale)}</td> : null}
                    <td className={`${tdClass} whitespace-nowrap text-right`}>{rate(line.vatRate, l.rates)}</td>
                    <td className={`${tdClass} whitespace-nowrap text-right`}>{number(line.net, locale)}</td>
                    {showGross ? <td className={`${tdClass} whitespace-nowrap text-right`}>{number(line.gross, locale)}</td> : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Block>
      ) : null}

      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-8 max-[720px]:grid-cols-1 print:grid-cols-2">
        {invoice.vat.length ? (
          <Block title={l.vatSummary.title}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[0.92rem] print:text-[9pt]">
                <thead>
                  <tr>
                    <th className={thClass} scope="col">{l.vatSummary.rate}</th>
                    <th className={`${thClass} text-right`} scope="col">{l.vatSummary.net}</th>
                    <th className={`${thClass} text-right`} scope="col">{l.vatSummary.vat}</th>
                    {cur !== "PLN" && invoice.vat.some((row) => row.vatPln) ? <th className={`${thClass} text-right`} scope="col">{l.vatSummary.vatPln}</th> : null}
                  </tr>
                </thead>
                <tbody>
                  {invoice.vat.map((row) => (
                    <tr key={row.key}>
                      <td className={tdClass}>{l.vatKeys[row.key] ?? row.key}</td>
                      <td className={`${tdClass} whitespace-nowrap text-right`}>{number(row.net, locale)}</td>
                      <td className={`${tdClass} whitespace-nowrap text-right`}>{number(row.vat, locale) ?? "-"}</td>
                      {cur !== "PLN" && invoice.vat.some((item) => item.vatPln) ? (
                        <td className={`${tdClass} whitespace-nowrap text-right`}>{number(row.vatPln, locale) ?? "-"}</td>
                      ) : null}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Block>
        ) : (
          <div />
        )}
        <div className="grid justify-items-end gap-1 text-right">
          <p className="m-0 text-[0.95rem] text-[var(--color-muted)] print:text-black">{l.total}</p>
          <p className="m-0 font-display text-[clamp(1.6rem,3vw,2.2rem)] font-medium tracking-[-0.02em]">{money(invoice.total, cur, locale)}</p>
          {invoice.exchangeRate ? (
            <p className="m-0 text-[0.9rem] text-[var(--color-muted)]">
              {l.exchangeRate}: {number(invoice.exchangeRate, locale, 0)}
            </p>
          ) : null}
        </div>
      </div>

      {invoice.payment ? (
        <Block title={l.paymentTitle}>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1">
            {invoice.payment.paid ? <Pair label={l.paid} value={formatDate(invoice.payment.paidDate, locale) ?? "✓"} /> : null}
            <Pair label={l.due} value={invoice.payment.dueDates.map((dueDate) => formatDate(dueDate, locale) ?? dueDate).join(", ") || null} />
            <Pair
              label={l.method}
              value={invoice.payment.method ? (l.methods[invoice.payment.method] ?? invoice.payment.method) : invoice.payment.otherMethod}
            />
            {invoice.payment.accounts.map((account, index) => (
              <Pair
                key={index}
                label={l.accounts}
                value={[account.number.replace(/(\d{2})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4 $5 $6 $7"), account.bank, account.swift, account.description]
                  .filter(Boolean)
                  .join(", ")}
              />
            ))}
          </dl>
        </Block>
      ) : null}

      {invoice.annotations.length ? (
        <Block title={l.annotationsTitle}>
          <ul className="m-0 grid gap-1 pl-5">
            {invoice.annotations.map((annotation) => (
              <li key={annotation}>{l.annotations[annotation] ?? annotation}</li>
            ))}
          </ul>
          {invoice.exemptionBasis ? (
            <p className="m-0 mt-2">
              {l.exemptionBasis}: {invoice.exemptionBasis}
            </p>
          ) : null}
        </Block>
      ) : null}

      {invoice.notes.length ? (
        <Block title={l.notesTitle}>
          <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1">
            {invoice.notes.map((note, index) => (
              <Pair key={index} label={note.key} value={note.value} />
            ))}
          </dl>
        </Block>
      ) : null}

      {invoice.footer.length || invoice.registries.krs || invoice.registries.regon || invoice.registries.bdo ? (
        <Block title={l.footerTitle}>
          {invoice.footer.map((line, index) => (
            <p className="m-0 whitespace-pre-line" key={index}>
              {line}
            </p>
          ))}
          <dl className="m-0 mt-2 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1">
            <Pair label={l.krs} value={invoice.registries.krs} />
            <Pair label={l.regon} value={invoice.registries.regon} />
            <Pair label={l.bdo} value={invoice.registries.bdo} />
          </dl>
        </Block>
      ) : null}

      <p className="m-0 text-[0.85rem] text-[var(--color-muted)] print:text-black">
        {l.technical}: {l.schema} {invoice.schema}
        {invoice.createdAt ? `, ${l.createdAt} ${invoice.createdAt}` : ""}
        {invoice.system ? `, ${l.system} ${invoice.system}` : ""}
      </p>
    </div>
  );
}

function PartyBlock({ heading, party, labels }: { heading: string; party: Party | null; labels: KsefViewerLabels }) {
  const l = labels.invoice;
  if (!party) return null;

  return (
    <div className="min-w-0">
      <p className="m-0 text-[0.9rem] text-[var(--color-muted)] print:text-black">{heading}</p>
      <p className="m-0 mt-1 text-[1.05rem] font-semibold [overflow-wrap:anywhere]">{party.name}</p>
      {party.taxId ? (
        <p className="m-0">
          {l.taxId}: {party.taxId}
        </p>
      ) : null}
      {party.address.map((line) => (
        <p className="m-0" key={line}>
          {line}
        </p>
      ))}
      {party.email ? <p className="m-0">{l.email}: {party.email}</p> : null}
      {party.phone ? <p className="m-0">{l.phone}: {party.phone}</p> : null}
      {party.customerNumber ? <p className="m-0">{l.customerNumber}: {party.customerNumber}</p> : null}
    </div>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-3">
      <h3 className="m-0 font-sans text-[1rem] font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function Pair({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;

  return (
    <>
      <dt className="text-[var(--color-muted)] print:text-black">{label}</dt>
      <dd className="m-0 [overflow-wrap:anywhere]">{value}</dd>
    </>
  );
}

/** Amounts get at least two decimals; quantities (`minDecimals` 0) keep the decimals they were written with. */
function number(value: string | null, locale: "pl" | "en", minDecimals = 2) {
  if (value === null || value === "") return null;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return value;
  const decimals = Math.min(Math.max((value.split(".")[1] ?? "").length, minDecimals), 8);
  return new Intl.NumberFormat(locale === "pl" ? "pl-PL" : "en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(parsed);
}

function money(value: string | null, currency: string, locale: "pl" | "en") {
  const formatted = number(value, locale);
  return formatted === null ? "-" : `${formatted} ${currency}`;
}

function rate(value: string | null, rates: Record<string, string>) {
  if (!value) return null;
  if (rates[value]) return rates[value];
  return /^\d+(\.\d+)?$/.test(value) ? `${value}%` : value;
}

function formatDate(value: string | null, locale: "pl" | "en") {
  if (!value) return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return value;
  return locale === "pl" ? `${match[3]}.${match[2]}.${match[1]}` : `${match[3]}/${match[2]}/${match[1]}`;
}
