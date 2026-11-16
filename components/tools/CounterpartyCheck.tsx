"use client";

import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { CounterpartyLabels } from "@/content/types";
import { todayInPoland } from "@/lib/tools/business-days";
import {
  CounterpartyError,
  KRZ_PAGE,
  RDF_PAGE,
  VIES_PAGE,
  detectCounterpartyQuery,
  fetchKrsOdpis,
  isStatementOverdue,
  krsStatus,
  summaryFacts,
  type CeidgCheck,
  type CounterpartyQuery,
  type KrsLookup,
  type KrsProceeding,
  type SummaryFact,
  type ViesCountry,
  type ViesResult,
} from "@/lib/tools/counterparty";
import { CEIDG_SEARCH_PAGE, KRS_SEARCH_PAGE } from "@/lib/tools/e-delivery";
import { WHITE_LIST_SEARCH_PAGE, WhiteListError, searchByNip, searchByRegon, type WhiteListSearch } from "@/lib/tools/white-list";
import { PrivacyNote } from "@/components/tools/PrivacyNote";
import { CopyButton } from "@/components/tools/CopyButton";

type Gtag = (command: "event", name: string, params: Record<string, string>) => void;

/** Counts use of the tool and nothing else: never the number or the result. */
function trackToolEvent(name: string) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", name, { tool: "counterparty" });
}

type Failure = "network" | "limit" | "unavailable" | "format";
type Source<T> = { state: "idle" } | { state: "loading" } | { state: "done"; value: T } | { state: "error"; reason: Failure } | { state: "skipped" };
type CeidgAnswer = { items: CeidgCheck[]; fetchedAt: string };
type Lookup = Exclude<CounterpartyQuery, { kind: "invalid" } | { kind: "name" }>;

type Check = {
  query: Lookup;
  raw: string;
  /** True until the NIP or REGON has been resolved to a KRS or CEIDG lookup. */
  registerPending: boolean;
  finished: boolean;
  krs: Source<KrsLookup>;
  ceidg: Source<CeidgAnswer>;
  whiteList: Source<WhiteListSearch>;
  vies: Source<ViesResult>;
  viesTarget: { country: ViesCountry; number: string } | null;
};

const idle = { state: "idle" } as const;
const VIES_ROUTE = "/api/tools/counterparty/vies";
const CEIDG_ROUTE = "/api/tools/counterparty/ceidg";

function failureOf(error: unknown): Failure {
  if (error instanceof CounterpartyError) return error.reason;
  if (error instanceof WhiteListError) return error.status === 429 ? "limit" : error.status === 0 ? "network" : "unavailable";
  return "unavailable";
}

async function getRoute<T>(url: string, signal: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if ((error as Error).name === "AbortError") throw error;
    throw new CounterpartyError("network");
  }
  if (response.status === 429) throw new CounterpartyError("limit");
  if (!response.ok) throw new CounterpartyError("unavailable");
  return (await response.json().catch(() => {
    throw new CounterpartyError("format");
  })) as T;
}

const fieldClass =
  "h-14 w-full rounded-[12px] border border-[rgba(11,17,22,0.16)] bg-[var(--color-paper)] px-4 text-[1.1rem] text-[var(--color-ink)] placeholder:text-[#8a9096] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--color-blue)] aria-[invalid=true]:border-[#a3360f]";
const labelClass = "text-[0.95rem] font-semibold text-[var(--color-ink)]";
const mutedClass = "m-0 text-[0.92rem] text-[var(--color-muted)]";
const linkClass = "text-[var(--color-blue)] underline underline-offset-4 hover:text-[var(--color-blue-deep)]";
const secondaryButton =
  "action cursor-pointer border border-[rgba(11,17,22,0.2)] bg-transparent text-[var(--color-ink)] hover:border-[rgba(11,17,22,0.4)]";

const fill = (template: string, values: Record<string, string>) => template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);

/** "DZIAŁALNOŚĆ ZWIĄZANA Z OPROGRAMOWANIEM" → "Działalność związana z oprogramowaniem". */
function sentence(value: string) {
  const lower = value.toLocaleLowerCase("pl-PL");
  return lower.charAt(0).toLocaleUpperCase("pl-PL") + lower.slice(1);
}

function capitalise(value: string) {
  return value.charAt(0).toLocaleUpperCase("pl-PL") + value.slice(1);
}

/** "GDYNIA" → "Gdynia"; "KRAKÓW-ŚRÓDMIEŚCIE" → "Kraków-Śródmieście". */
function titleCase(value: string) {
  return value.toLocaleLowerCase("pl-PL").replace(/(^|[\s\-(])(\p{L})/gu, (_, before: string, letter: string) => before + letter.toLocaleUpperCase("pl-PL"));
}

function done<T>(source: Source<T>): T | null {
  return source.state === "done" ? source.value : null;
}

export function CounterpartyCheck({
  labels,
  locale,
  whiteListHref,
  eDeliveryHref,
}: {
  labels: CounterpartyLabels;
  locale: "pl" | "en";
  whiteListHref: string;
  eDeliveryHref: string;
}) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [nameHint, setNameHint] = useState(false);
  const [check, setCheck] = useState<Check | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);
  const lastTracked = useRef(0);
  const intl = locale === "pl" ? "pl-PL" : "en-GB";

  /* ----------------------------------------------------------------- formatting */

  const day = (iso: string) =>
    new Intl.DateTimeFormat(intl, locale === "pl" ? { day: "2-digit", month: "2-digit", year: "numeric" } : { day: "numeric", month: "short", year: "numeric" }).format(
      new Date(`${iso.slice(0, 10)}T12:00:00`),
    );
  /** A Warsaw wall-clock time without a zone, as KRS writes it: "2026-11-16T02:13:12". */
  const localStamp = (iso: string) => (iso.length > 10 ? `${day(iso)} ${iso.slice(11, 16)}` : day(iso));
  /** An instant (VIES, our CEIDG route), shown in Polish time. */
  const instant = (iso: string) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    const time = new Intl.DateTimeFormat(intl, { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" }).format(date);
    const isoDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(date);
    return `${day(isoDay)} ${time}`;
  };
  const money = (amount: number, currency: string) => {
    try {
      return new Intl.NumberFormat(intl, { style: "currency", currency }).format(amount);
    } catch {
      return `${amount} ${currency}`;
    }
  };
  /** The White List's "16-11-2026 01:46:16", already in Polish time. */
  const whiteListStamp = (value: string) => {
    const match = /^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}:\d{2})/.exec(value);
    return match ? `${day(`${match[3]}-${match[2]}-${match[1]}`)} ${match[4]}` : value;
  };
  const countryName = (country: ViesCountry) => {
    if (country === "XI") return labels.values.northernIreland;
    try {
      return new Intl.DisplayNames([intl], { type: "region" }).of(country === "EL" ? "GR" : country) ?? country;
    } catch {
      return country;
    }
  };

  /* ----------------------------------------------------------------- the check */

  const run = useCallback(async (kind: CounterpartyQuery, raw: string) => {
    if (kind.kind === "invalid" || kind.kind === "name") {
      // A result for an earlier number must not stay under the message, as if it answered this one.
      controller.current?.abort();
      setCheck(null);
      setNameHint(kind.kind === "name");
      setFieldError(kind.kind === "invalid" ? labels.errors[kind.reason] : null);
      return;
    }

    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    const signal = current.signal;
    setFieldError(null);
    setNameHint(false);
    setCheck({ query: kind, raw: raw.trim(), registerPending: kind.kind !== "vat", finished: false, krs: idle, ceidg: idle, whiteList: idle, vies: idle, viesTarget: null });

    const patch = (next: Partial<Check>) => {
      if (controller.current !== current) return;
      setCheck((previous) => (previous ? { ...previous, ...next } : previous));
    };

    /* Each source reports into its own slot, so one failing never blanks the others. */
    const read = async <K extends "krs" | "ceidg" | "whiteList" | "vies">(key: K, lookup: () => Promise<Check[K] extends Source<infer T> ? T : never>) => {
      patch({ [key]: { state: "loading" } } as Partial<Check>);
      try {
        const value = await lookup();
        patch({ [key]: { state: "done", value } } as Partial<Check>);
        return value;
      } catch (error) {
        if ((error as Error).name === "AbortError") throw error;
        patch({ [key]: { state: "error", reason: failureOf(error) } } as Partial<Check>);
        return null;
      }
    };
    const today = todayInPoland();
    const readKrs = (krs: string) => read("krs", () => fetchKrsOdpis(krs, signal));
    const readCeidg = (params: string) => read("ceidg", () => getRoute<CeidgAnswer>(`${CEIDG_ROUTE}?${params}`, signal));
    const readWhiteList = (lookup: () => Promise<WhiteListSearch>) => read("whiteList", lookup);
    const readVies = (country: ViesCountry, number: string) => {
      patch({ viesTarget: { country, number } });
      return read("vies", () => getRoute<ViesResult>(`${VIES_ROUTE}?country=${country}&number=${encodeURIComponent(number)}`, signal));
    };
    /** WL and VIES for a NIP found in a register. */
    const vatChecks = (nip: string | null | undefined) =>
      nip ? Promise.all([readWhiteList(() => searchByNip(nip, today, signal)), readVies("PL", nip)]) : (patch({ whiteList: { state: "skipped" }, vies: { state: "skipped" } }), null);

    try {
      if (kind.kind === "vat") await readVies(kind.country, kind.number);

      if (kind.kind === "nip") {
        const vies = readVies("PL", kind.nip);
        // Awaited below; this only keeps an abort before then from surfacing as an unhandled rejection.
        vies.catch(() => null);
        const search = await readWhiteList(() => searchByNip(kind.nip, today, signal));
        const krs = search?.subject?.krs;
        patch({ registerPending: false });
        await Promise.all([krs ? readKrs(krs) : readCeidg(`nip=${kind.nip}`), vies]);
      }

      if (kind.kind === "krs") {
        const lookup = await readKrs(kind.krs);
        patch({ registerPending: false });
        if (lookup?.state === "found") await vatChecks(lookup.facts.base.nip);
        // A removed VAT payer can still be in the list, so a struck-off company is checked too.
        if (lookup?.state === "deregistered") await vatChecks(lookup.record.nip);
      }

      if (kind.kind === "regon") {
        // The White List rejects 14-digit REGONs (WL-107): those are local units, CEIDG only in v1.
        const [search, firms] = await Promise.all([
          kind.regon.length === 9 ? readWhiteList(() => searchByRegon(kind.regon, today, signal)) : null,
          readCeidg(`regon=${kind.regon}`),
        ]);
        const krs = search?.subject?.krs;
        const nip = search?.subject?.nip ?? firms?.items[0]?.nip ?? null;
        patch({ registerPending: false });
        await Promise.all([
          krs ? readKrs(krs) : null,
          nip ? readVies("PL", nip) : null,
          nip && kind.regon.length === 14 ? readWhiteList(() => searchByNip(nip, today, signal)) : null,
        ]);
      }

      patch({ finished: true, registerPending: false });
      const url = new URL(window.location.href);
      url.searchParams.set("q", raw.trim());
      window.history.replaceState(window.history.state, "", url);
      if (Date.now() - lastTracked.current > 10_000) {
        lastTracked.current = Date.now();
        trackToolEvent("tool_used");
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") return;
      patch({ finished: true, registerPending: false });
    }
  }, [labels]);

  const retryVies = async () => {
    const target = check?.viesTarget;
    const signal = controller.current?.signal;
    if (!target || !signal) return;
    const current = controller.current;
    const set = (vies: Source<ViesResult>) => {
      if (controller.current === current) setCheck((previous) => (previous ? { ...previous, vies } : previous));
    };
    set({ state: "loading" });
    try {
      set({ state: "done", value: await getRoute<ViesResult>(`${VIES_ROUTE}?country=${target.country}&number=${encodeURIComponent(target.number)}`, signal) });
    } catch (error) {
      if ((error as Error).name !== "AbortError") set({ state: "error", reason: failureOf(error) });
    }
  };

  /* A shared link: ?q= runs the check once, after hydration, so the static HTML stays the same for everyone. */
  useEffect(() => {
    const shared = new URLSearchParams(window.location.search).get("q")?.slice(0, 40);
    const start = shared
      ? window.setTimeout(() => {
          setQuery(shared);
          void run(detectCounterpartyQuery(shared), shared);
        }, 0)
      : undefined;
    return () => {
      window.clearTimeout(start);
      controller.current?.abort();
    };
  }, [run]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void run(detectCounterpartyQuery(query), query);
  };

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied((value) => (value === key ? null : value)), 1800);
    } catch {
      /* The text stays on screen and in the printout. */
    }
  };

  /* ----------------------------------------------------------------- view */

  const typed = query.trim() ? detectCounterpartyQuery(query) : null;
  const hint = !typed || typed.kind === "invalid" ? labels.hints.empty : labels.hints[typed.kind];

  const krs = check ? done(check.krs) : null;
  const ceidg = check ? done(check.ceidg) : null;
  const whiteList = check ? done(check.whiteList) : null;
  const vies = check ? done(check.vies) : null;
  const subject = whiteList?.subject ?? null;

  const facts: SummaryFact[] = check
    ? summaryFacts({ krs, ceidg: ceidg?.items ?? null, whiteList: check.whiteList.state === "done" ? check.whiteList.value : undefined, vies }, labels.summary, day, countryName)
    : [];
  const name =
    (krs?.state === "found" ? krs.facts.base.name : krs?.state === "deregistered" ? krs.record.name : null) ??
    ceidg?.items[0]?.name ??
    subject?.name ??
    vies?.name ??
    null;

  const registerFound = krs?.state === "found" || krs?.state === "deregistered" || Boolean(ceidg?.items.length);
  const notFound = (() => {
    if (!check?.finished || registerFound) return null;
    const q = check.query;
    if (q.kind === "krs" && krs?.state === "notFound") return { title: labels.notFound.krsTitle, hint: labels.notFound.krsHint };
    if ((q.kind === "nip" || q.kind === "regon") && check.whiteList.state !== "error" && !subject && check.ceidg.state === "done" && !ceidg?.items.length) {
      return q.kind === "nip" ? { title: labels.notFound.nipTitle, hint: labels.notFound.nipHint } : { title: labels.notFound.regonTitle, hint: labels.notFound.regonHint };
    }
    return null;
  })();

  /** The record for the printout and the "copy identifiers" button. */
  const record: Array<[string, string]> = [];
  if (check) {
    const p = labels.print;
    if (krs?.state === "found")
      record.push([p.krs, `${p.stateOn} ${day(krs.facts.base.stateDate)} · ${p.extractedAt} ${localStamp(krs.facts.base.extractedAt)}`]);
    if (krs?.state === "deregistered" && krs.record.extractedAt) record.push([p.krs, `${p.extractedAt} ${localStamp(krs.record.extractedAt)}`]);
    if (ceidg) record.push([p.ceidg, `${p.checkedAt} ${instant(ceidg.fetchedAt)}`]);
    if (whiteList) record.push([p.whiteList, `${p.requestId} ${whiteList.requestId} · ${p.checkedAt} ${whiteListStamp(whiteList.requestDateTime)}`]);
    if (vies) record.push([p.vies, `${vies.country}${vies.number} · ${p.checkedAt} ${instant(vies.requestDate)}`]);
  }

  const print = () => {
    trackToolEvent("tool_print");
    window.print();
  };

  const showLinks = check && check.query.kind !== "vat";

  return (
    <div className="grid gap-8">
      <form className="grid gap-3" noValidate onSubmit={submit} role="search">
        <label className={labelClass} htmlFor={`${id}-q`}>
          {labels.queryLabel}
        </label>
        <div className="flex flex-wrap items-start gap-3">
          <input
            aria-describedby={`${id}-hint${fieldError ? ` ${id}-error` : ""}`}
            aria-invalid={Boolean(fieldError)}
            autoComplete="off"
            className={`${fieldClass} min-w-0 flex-[1_1_22rem] font-display tracking-[0.01em]`}
            enterKeyHint="search"
            id={`${id}-q`}
            inputMode="text"
            maxLength={40}
            onChange={(event) => {
              setQuery(event.target.value);
              setFieldError(null);
            }}
            placeholder={labels.placeholder}
            spellCheck={false}
            type="search"
            value={query}
          />
          {/* Never disabled: a second Enter aborts the running check and starts again. */}
          <button className="action action-ink h-14 cursor-pointer border-0" type="submit">
            {check && !check.finished ? labels.checking : labels.submit}
          </button>
        </div>
        <p className={mutedClass} id={`${id}-hint`}>
          {hint}
        </p>
        {fieldError ? (
          <p className="m-0 text-[1rem] text-[#a3360f]" id={`${id}-error`} role="alert">
            {fieldError}
          </p>
        ) : null}
        {nameHint ? (
          <p className="m-0 max-w-[46rem] text-[1rem] text-[var(--color-ink)]" role="status">
            {labels.nameHint}{" "}
            <ExternalLink href={KRS_SEARCH_PAGE}>{labels.krsSearch}</ExternalLink>
            {" · "}
            <ExternalLink href={CEIDG_SEARCH_PAGE}>{labels.ceidgSearch}</ExternalLink>
          </p>
        ) : null}
      </form>

      {check ? (
        <div aria-busy={!check.finished} className="print-area grid gap-0">
          <div className="hidden print:mb-4 print:block">
            <p className="m-0 text-[1.3rem] font-semibold">{labels.print.title}</p>
            <p className="m-0 mt-1 text-[0.95rem]">{fill(labels.print.query, { query: check.raw })}</p>
            <p className="m-0 text-[0.95rem]">{fill(labels.print.printedAt, { time: instant(new Date().toISOString()) })}</p>
          </div>

          <div aria-live="polite" className="grid gap-2 border-t border-[var(--color-border-light)] py-6">
            {name ? (
              <p className="m-0 font-display text-[clamp(1.4rem,2.6vw,2rem)] font-medium leading-[1.25] tracking-[-0.02em] text-[var(--color-ink)] [overflow-wrap:anywhere]">
                {name}
              </p>
            ) : null}
            {facts.length ? (
              <p className="m-0 text-[1.08rem] leading-[1.55] text-[var(--color-ink)]">
                {facts.map((fact, index) => (
                  <span key={fact.key}>
                    {index ? <span aria-hidden="true"> · </span> : null}
                    <span className={fact.tone === "warning" ? "font-semibold" : undefined}>{index ? fact.text : capitalise(fact.text)}</span>
                  </span>
                ))}
              </p>
            ) : !check.finished ? (
              <p className={mutedClass}>{labels.loading}</p>
            ) : null}
            {notFound ? (
              <div className="grid gap-1">
                <p className="m-0 font-display text-[1.3rem] font-medium text-[var(--color-ink)]">{notFound.title}</p>
                <p className="m-0 max-w-[46rem] text-[var(--color-muted)]">{notFound.hint}</p>
              </div>
            ) : null}
          </div>

          {check.registerPending && check.krs.state === "idle" && check.ceidg.state === "idle" ? (
            <p className={`${mutedClass} border-t border-[var(--color-border-light)] py-5`}>{labels.registerPending}</p>
          ) : null}

          {check.krs.state !== "idle" ? <KrsBlock {...{ check, labels, day, money, localStamp, copied, copy, eDeliveryHref }} /> : null}

          {check.ceidg.state !== "idle" && !(check.ceidg.state === "done" && !check.ceidg.value.items.length && (registerFound || notFound)) ? (
            <CeidgBlock {...{ source: check.ceidg, labels, day, instant, copied, copy, eDeliveryHref }} />
          ) : null}

          {check.whiteList.state === "skipped" ? (
            <p className={`${mutedClass} border-t border-[var(--color-border-light)] py-5`}>{labels.values.noNip}</p>
          ) : check.whiteList.state !== "idle" ? (
            <WhiteListBlock {...{ source: check.whiteList, labels, whiteListStamp, whiteListHref, locale }} />
          ) : null}

          {check.vies.state !== "idle" && check.vies.state !== "skipped" ? (
            <ViesBlock {...{ source: check.vies, labels, instant, countryName, retry: retryVies, target: check.viesTarget }} />
          ) : null}

          {showLinks ? (
            <p className={`${mutedClass} border-t border-[var(--color-border-light)] py-5 print:hidden`}>
              {fill(labels.links.line, { full: "\u0000full\u0000", krz: "\u0000krz\u0000", rdf: "\u0000rdf\u0000" })
                .split("\u0000")
                .map((part, index) =>
                  part === "full" ? (
                    <ExternalLink href={KRS_SEARCH_PAGE} key={index}>
                      {labels.links.full}
                    </ExternalLink>
                  ) : part === "krz" ? (
                    <ExternalLink href={KRZ_PAGE} key={index}>
                      {labels.links.krz}
                    </ExternalLink>
                  ) : part === "rdf" ? (
                    <ExternalLink href={RDF_PAGE} key={index}>
                      {labels.links.rdf}
                    </ExternalLink>
                  ) : (
                    <span key={index}>{part}</span>
                  ),
                )}
            </p>
          ) : null}

          {check.finished && record.length ? (
            <div className="grid gap-4 border-t border-[var(--color-border-light)] pt-6">
              <dl className="m-0 hidden gap-1 text-[0.95rem] print:grid">
                {record.map(([label, value]) => (
                  <div key={label}>
                    <dt className="inline font-semibold">{label}: </dt>
                    <dd className="m-0 inline">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="m-0 hidden text-[0.9rem] print:block">{labels.print.footer}</p>
              <div className="flex flex-wrap gap-3 print:hidden">
                <button className={secondaryButton} onClick={print} type="button">
                  {labels.print.button}
                </button>
                <CopyButton
                  copied={copied === "record"}
                  copiedLabel={labels.copied}
                  label={labels.print.copyIds}
                  onClick={() => copy("record", [fill(labels.print.query, { query: check.raw }), ...record.map(([label, value]) => `${label}: ${value}`)].join("\n"))}
                />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <PrivacyNote>{labels.privacyNote}</PrivacyNote>
    </div>
  );
}

/* ------------------------------------------------------------------- pieces */

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className={linkClass} href={href} rel="noopener noreferrer" target="_blank">
      {children}
      <span aria-hidden="true"> ↗</span>
    </a>
  );
}

/** One source: a plain heading, label/value rows with hairlines between them, and a muted source line. */
function Block({ title, children, footer }: { title: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <section className="grid gap-2 border-t border-[var(--color-border-light)] py-6">
      <h3 className="m-0 text-[1.1rem] font-semibold text-[var(--color-ink)]">{title}</h3>
      {children}
      {footer ? <p className={`${mutedClass} pt-1`}>{footer}</p> : null}
    </section>
  );
}

function Rows({ children }: { children: ReactNode }) {
  return <dl className="m-0 grid divide-y divide-[var(--color-border-light)]">{children}</dl>;
}

function Row({ label, children, strong = false }: { label: string; children: ReactNode; strong?: boolean }) {
  if (children === null || children === undefined || children === "") return null;
  return (
    <div className="grid grid-cols-[minmax(0,15rem)_minmax(0,1fr)] gap-x-6 gap-y-0.5 py-2.5 max-[640px]:grid-cols-1">
      <dt className="text-[0.92rem] text-[var(--color-muted)]">{label}</dt>
      <dd className={`m-0 text-[1rem] text-[var(--color-ink)] [overflow-wrap:anywhere] ${strong ? "font-semibold" : ""}`}>{children}</dd>
    </div>
  );
}

function Loading({ labels }: { labels: CounterpartyLabels }) {
  return <p className={mutedClass}>{labels.loading}</p>;
}

function Problem({ children }: { children: ReactNode }) {
  return <p className="m-0 max-w-[46rem] text-[1rem] text-[var(--color-ink)]">{children}</p>;
}

function AdeRow({ ade, label, labels, copied, onCopy, href }: { ade: string | null; label: string; labels: CounterpartyLabels; copied: boolean; onCopy: () => void; href: string }) {
  if (!ade) return null;
  return (
    <Row label={label}>
      <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="font-display [font-variant-numeric:tabular-nums]">{ade}</span>
        <span className="print:hidden">
          <CopyButton copied={copied} copiedLabel={labels.copied} label={labels.copy} onClick={onCopy} />
        </span>
        <a className={`${linkClass} text-[0.92rem] print:hidden`} href={href}>
          {labels.eDeliveryLink}
        </a>
      </span>
    </Row>
  );
}

type Formatters = { day: (iso: string) => string; money: (amount: number, currency: string) => string };

function proceedingText(proceeding: KrsProceeding, labels: CounterpartyLabels, day: (iso: string) => string) {
  const type = sentence(proceeding.type);
  const v = labels.values;
  if (!proceeding.ended) return proceeding.openedOn ? fill(v.proceedingOpen, { type, date: day(proceeding.openedOn) }) : type;
  if (proceeding.openedOn && proceeding.endedOn) return fill(v.proceedingEnded, { type, from: day(proceeding.openedOn), to: day(proceeding.endedOn) });
  return fill(v.proceedingEndedNoDate, { type });
}

function KrsBlock({
  check,
  labels,
  day,
  money,
  localStamp,
  copied,
  copy,
  eDeliveryHref,
}: Formatters & {
  check: Check;
  labels: CounterpartyLabels;
  localStamp: (iso: string) => string;
  copied: string | null;
  copy: (key: string, text: string) => void;
  eDeliveryHref: string;
}) {
  const source = check.krs;
  const r = labels.rows;
  const v = labels.values;
  const s = labels.summary.krs;

  if (source.state === "loading") return <Block title={labels.sources.krs}>{<Loading labels={labels} />}</Block>;

  if (source.state === "error") {
    const message = source.reason === "limit" ? labels.sourceErrors.krsLimit : source.reason === "format" ? labels.sourceErrors.krsFormat : labels.sourceErrors.krsNetwork;
    return (
      <Block title={labels.sources.krs}>
        <Problem>
          {message} <ExternalLink href={KRS_SEARCH_PAGE}>{labels.source.openKrs}</ExternalLink>
        </Problem>
      </Block>
    );
  }

  if (source.state !== "done") return null;
  const lookup = source.value;

  if (lookup.state === "notFound") return check.query.kind === "krs" ? null : <Block title={labels.sources.krs}>{<Problem>{labels.notFound.krsTitle}</Problem>}</Block>;

  if (lookup.state === "deregistered") {
    const record = lookup.record;
    const status = record.entryDate
      ? record.finalDate
        ? fill(v.deregistered, { entry: day(record.entryDate), final: day(record.finalDate) })
        : capitalise(fill(s.deregistered, { date: day(record.entryDate) }))
      : capitalise(s.deregisteredNoDate);
    return (
      <Block
        footer={
          <>
            {record.extractedAt ? `${fill(labels.source.krsFull, { extracted: localStamp(record.extractedAt) })} · ` : null}
            <ExternalLink href={KRS_SEARCH_PAGE}>{labels.source.openKrs}</ExternalLink>
          </>
        }
        title={labels.sources.krs}
      >
        <Rows>
          <Row label={r.status} strong>
            {status}
          </Row>
          <Row label={r.legalForm}>{record.legalForm ? sentence(record.legalForm) : null}</Row>
          <Row label={r.krs}>{`${record.krs} (${v.registers[record.register]})`}</Row>
          <Row label={r.nip}>{record.nip}</Row>
        </Rows>
      </Block>
    );
  }

  const facts = lookup.facts;
  const base = facts.base;
  const status = krsStatus(facts);
  const statusText =
    status.kind === "active"
      ? s.active
      : status.kind === "liquidation"
        ? s.liquidation
        : status.kind === "bankruptcy"
          ? status.since
            ? fill(s.bankruptcy, { date: day(status.since) })
            : s.bankruptcyNoDate
          : status.kind === "restructuring"
            ? status.since
              ? fill(s.restructuring, { date: day(status.since), type: status.type.toLocaleLowerCase("pl-PL") })
              : fill(s.restructuringNoDate, { type: status.type.toLocaleLowerCase("pl-PL") })
            : "";
  const statement = facts.lastStatement;
  const today = todayInPoland();

  return (
    <Block
      footer={
        <>
          {fill(labels.source.krs, { state: day(base.stateDate), extracted: localStamp(base.extractedAt) })} ·{" "}
          <ExternalLink href={KRS_SEARCH_PAGE}>{labels.source.openKrs}</ExternalLink>
        </>
      }
      title={labels.sources.krs}
    >
      <Rows>
        <Row label={r.status} strong={status.kind !== "active"}>
          {capitalise(statusText)}
        </Row>
        <Row label={r.legalForm}>{base.legalForm ? sentence(base.legalForm) : null}</Row>
        <Row label={r.krs}>{`${base.krs} (${v.registers[base.register]})`}</Row>
        <Row label={r.nip}>{base.nip}</Row>
        <Row label={r.regon}>{base.regon}</Row>
        <Row label={r.address}>{facts.address ?? (base.seat ? titleCase(base.seat.split(",")[0]) : null)}</Row>
        <Row label={r.registeredOn}>{facts.registeredOn ? day(facts.registeredOn) : null}</Row>
        <Row label={r.capital}>
          {facts.capital ? money(facts.capital.amount, facts.capital.currency) : null}
        </Row>
        <Row label={r.pkd}>{facts.mainPkd ? `${facts.mainPkd.code} ${sentence(facts.mainPkd.label)}`.trim() : null}</Row>
        <Row label={r.representation}>{facts.representation ? [sentence(facts.representation.body), facts.representation.rule ? sentence(facts.representation.rule) : null].filter(Boolean).join(": ") : null}</Row>
        <Row label={r.statement}>
          {statement ? (
            <>
              {statement.filedOn
                ? fill(v.statement, { period: statement.period.toLocaleLowerCase("pl-PL"), date: day(statement.filedOn) })
                : fill(v.statementNoDate, { period: statement.period.toLocaleLowerCase("pl-PL") })}
              {/* Business register only: S-register mentions are often incomplete (WOŚP's stop at 2008), so an old one there says little. */}
              {base.register === "P" && statement.periodEnd && isStatementOverdue(statement.periodEnd, today) ? (
                <span className="block text-[0.92rem] text-[var(--color-muted)]">{fill(v.statementOld, { period: statement.period.toLocaleLowerCase("pl-PL") })}</span>
              ) : null}
            </>
          ) : base.register === "P" ? (
            v.noStatement
          ) : null}
        </Row>
        <Row label={r.opp}>{facts.opp ? v.oppYes : null}</Row>
        {facts.proceedings.map((proceeding, index) => (
          <Row key={`${proceeding.kind}-${index}`} label={r.proceeding} strong={!proceeding.ended}>
            {proceedingText(proceeding, labels, day)}
            {proceeding.signature || proceeding.authority ? (
              <span className="block text-[0.92rem] font-normal text-[var(--color-muted)]">{[proceeding.signature, proceeding.authority].filter(Boolean).join(" · ")}</span>
            ) : null}
          </Row>
        ))}
        <AdeRow
          ade={base.ade}
          copied={copied === "krs-ade"}
          href={`${eDeliveryHref}?q=${base.krs}`}
          label={r.ade}
          labels={labels}
          onCopy={() => base.ade && copy("krs-ade", base.ade)}
        />
      </Rows>
    </Block>
  );
}

function CeidgBlock({
  source,
  labels,
  day,
  instant,
  copied,
  copy,
  eDeliveryHref,
}: {
  day: (iso: string) => string;
  source: Source<CeidgAnswer>;
  labels: CounterpartyLabels;
  instant: (iso: string) => string;
  copied: string | null;
  copy: (key: string, text: string) => void;
  eDeliveryHref: string;
}) {
  const r = labels.rows;
  const c = labels.summary.ceidg;

  if (source.state === "loading") return <Block title={labels.sources.ceidg}>{<Loading labels={labels} />}</Block>;
  if (source.state === "error") {
    return (
      <Block title={labels.sources.ceidg}>
        <Problem>
          {source.reason === "limit" ? labels.sourceErrors.ceidgLimit : labels.sourceErrors.ceidgUnavailable}{" "}
          <ExternalLink href={CEIDG_SEARCH_PAGE}>{labels.source.openCeidg}</ExternalLink>
        </Problem>
      </Block>
    );
  }
  if (source.state !== "done") return null;

  const { items, fetchedAt } = source.value;
  const footer = (publicUrl: string | null) => (
    <>
      {fill(labels.source.ceidg, { time: instant(fetchedAt) })} · <ExternalLink href={publicUrl ?? CEIDG_SEARCH_PAGE}>{labels.source.openCeidg}</ExternalLink>
    </>
  );

  if (!items.length) return <Block footer={footer(null)} title={labels.sources.ceidg}>{<Problem>{labels.notFound.regonTitle}</Problem>}</Block>;

  return (
    <>
      {items.map((firm, index) => {
        const status = firm.status?.toUpperCase() ?? "";
        const statusText =
          status === "AKTYWNY"
            ? c.active
            : status === "ZAWIESZONY"
              ? firm.suspendedOn
                ? fill(c.suspended, { date: day(firm.suspendedOn) })
                : c.suspendedNoDate
              : status === "OCZEKUJE_NA_ROZPOCZECIE_DZIALANOSCI"
                ? fill(c.pending, { date: firm.startedOn ? day(firm.startedOn) : "" })
                : status === "WYLACZNIE_W_FORMIE_SPOLKI"
                  ? c.partnershipOnly
                  : status === "WYKRESLONY"
                    ? firm.deletedOn
                      ? fill(c.deleted, { date: day(firm.deletedOn) })
                      : c.deletedNoDate
                    : status
                      ? fill(c.other, { status: status.toLocaleLowerCase("pl-PL").replace(/_/g, " ") })
                      : null;
        return (
          <Block footer={footer(firm.publicUrl)} key={`${firm.nip ?? firm.regon ?? ""}-${index}`} title={items.length > 1 ? `${labels.sources.ceidg}: ${firm.name}` : labels.sources.ceidg}>
            <Rows>
              <Row label={r.status} strong={status === "ZAWIESZONY" || status === "WYKRESLONY"}>
                {statusText ? capitalise(statusText) : null}
              </Row>
              {status === "WYLACZNIE_W_FORMIE_SPOLKI" ? <Row label="">{labels.values.partnershipOnlyHint}</Row> : null}
              <Row label={r.name}>{items.length > 1 ? null : firm.name}</Row>
              <Row label={r.town}>{firm.town ? titleCase(firm.town) : null}</Row>
              <Row label={r.nip}>{firm.nip}</Row>
              <Row label={r.regon}>{firm.regon}</Row>
              <Row label={r.startedOn}>{firm.startedOn ? day(firm.startedOn) : null}</Row>
              <Row label={r.suspendedOn}>{firm.suspendedOn && status === "ZAWIESZONY" ? day(firm.suspendedOn) : null}</Row>
              <Row label={r.resumedOn}>{firm.resumedOn ? day(firm.resumedOn) : null}</Row>
              <Row label={r.endedOn}>{firm.endedOn ? day(firm.endedOn) : null}</Row>
              <Row label={r.deletedOn}>{firm.deletedOn ? day(firm.deletedOn) : null}</Row>
              <Row label={r.pkd}>{firm.mainPkd ? `${firm.mainPkd.code} ${firm.mainPkd.label}`.trim() : null}</Row>
              <AdeRow
                ade={firm.ade}
                copied={copied === `ceidg-ade-${index}`}
                href={`${eDeliveryHref}?q=${firm.nip ?? firm.regon ?? ""}`}
                label={r.ade}
                labels={labels}
                onCopy={() => firm.ade && copy(`ceidg-ade-${index}`, firm.ade)}
              />
            </Rows>
          </Block>
        );
      })}
    </>
  );
}

function WhiteListBlock({
  source,
  labels,
  whiteListStamp,
  whiteListHref,
  locale,
}: {
  source: Source<WhiteListSearch>;
  labels: CounterpartyLabels;
  whiteListStamp: (value: string) => string;
  whiteListHref: string;
  locale: "pl" | "en";
}) {
  const r = labels.rows;
  const v = labels.values;

  if (source.state === "loading") return <Block title={labels.sources.whiteList}>{<Loading labels={labels} />}</Block>;
  if (source.state === "error") {
    return (
      <Block title={labels.sources.whiteList}>
        <Problem>
          {source.reason === "limit" ? labels.sourceErrors.whiteListLimit : labels.sourceErrors.whiteListNetwork}{" "}
          <ExternalLink href={WHITE_LIST_SEARCH_PAGE}>{labels.source.openWhiteList}</ExternalLink>
        </Problem>
      </Block>
    );
  }
  if (source.state !== "done") return null;

  const search = source.value;
  const subject = search.subject;
  const footer = (
    <>
      {fill(labels.source.whiteList, { id: search.requestId, time: whiteListStamp(search.requestDateTime) })} ·{" "}
      <ExternalLink href={WHITE_LIST_SEARCH_PAGE}>{labels.source.openWhiteList}</ExternalLink>
    </>
  );

  if (!subject) {
    return (
      <Block footer={footer} title={labels.sources.whiteList}>
        <Rows>
          <Row label={r.status} strong>
            {capitalise(labels.summary.whiteList.absent)}
          </Row>
        </Rows>
      </Block>
    );
  }

  const count = subject.accountNumbers.length;
  const plural = new Intl.PluralRules(locale === "pl" ? "pl-PL" : "en-GB").select(count) as "one" | "few" | "many" | "other";
  const accounts = count ? fill(v.accounts[plural] ?? v.accounts.other, { count: String(count) }) : v.noAccounts;
  const status = subject.statusVat;
  const basis = (date: string | null, reason: string | null) => (date ? [date, reason].filter(Boolean).join(", ") : null);

  return (
    <Block footer={footer} title={labels.sources.whiteList}>
      <Rows>
        <Row label={r.status} strong={status !== "Czynny" && status !== "Zwolniony"}>
          {status ? (v.vatStatuses[status] ?? status) : "-"}
        </Row>
        <Row label={r.vatRegisteredOn}>{subject.registrationLegalDate}</Row>
        <Row label={r.accounts}>
          {accounts}
          {subject.hasVirtualAccounts ? <span className="block text-[0.92rem] text-[var(--color-muted)]">{v.virtualAccounts}</span> : null}
        </Row>
        <Row label={r.vatRemoved}>{basis(subject.removalDate, subject.removalBasis)}</Row>
        <Row label={r.vatRestored}>{basis(subject.restorationDate, subject.restorationBasis)}</Row>
        <Row label={r.vatDenied}>{basis(subject.registrationDenialDate, subject.registrationDenialBasis)}</Row>
      </Rows>
      {subject.nip ? (
        <p className="m-0 pt-1 print:hidden">
          <a className={linkClass} href={`${whiteListHref}?nip=${subject.nip}`}>
            {labels.checkAccount}
          </a>
        </p>
      ) : null}
    </Block>
  );
}

function ViesBlock({
  source,
  labels,
  instant,
  countryName,
  retry,
  target,
}: {
  source: Source<ViesResult>;
  labels: CounterpartyLabels;
  instant: (iso: string) => string;
  countryName: (country: ViesCountry) => string;
  retry: () => void;
  target: { country: ViesCountry; number: string } | null;
}) {
  const r = labels.rows;
  const v = labels.values;
  const retryButton = (
    <button className={`${secondaryButton} mt-2 print:hidden`} onClick={retry} type="button">
      {labels.sourceErrors.retry}
    </button>
  );

  if (source.state === "loading") return <Block title={labels.sources.vies}>{<Loading labels={labels} />}</Block>;
  if (source.state === "error") {
    return (
      <Block title={labels.sources.vies}>
        <Problem>
          {source.reason === "limit" ? labels.sourceErrors.viesLimit : labels.sourceErrors.viesUnavailable}{" "}
          <ExternalLink href={VIES_PAGE}>{labels.source.openVies}</ExternalLink>
        </Problem>
        {source.reason !== "limit" ? <div>{retryButton}</div> : null}
      </Block>
    );
  }
  if (source.state !== "done") return null;

  const result = source.value;
  const outcome =
    result.reason === "valid"
      ? v.viesValid
      : result.reason === "invalid"
        ? v.viesInvalid
        : result.reason === "unavailable"
          ? fill(v.viesUnavailable, { country: countryName(result.country) })
          : result.reason === "busy"
            ? v.viesBusy
            : v.viesInput;

  return (
    <Block
      footer={
        <>
          {fill(labels.source.vies, { time: instant(result.requestDate) })} · <ExternalLink href={VIES_PAGE}>{labels.source.openVies}</ExternalLink>
        </>
      }
      title={labels.sources.vies}
    >
      <Rows>
        <Row label={r.vatNumber}>{`${result.country}${result.number}${target && target.country !== "PL" ? ` (${countryName(result.country)})` : ""}`}</Row>
        <Row label={r.viesResult} strong={result.reason === "invalid"}>
          {outcome}
        </Row>
        {result.valid && !result.name && !result.address ? (
          <Row label={r.name}>{<span className="text-[var(--color-muted)]">{v.viesNoName}</span>}</Row>
        ) : (
          <>
            <Row label={r.name}>{result.name}</Row>
            <Row label={r.address}>{result.address ? <span className="whitespace-pre-line">{result.address}</span> : null}</Row>
          </>
        )}
      </Rows>
      {result.reason === "unavailable" || result.reason === "busy" ? <div>{retryButton}</div> : null}
    </Block>
  );
}
