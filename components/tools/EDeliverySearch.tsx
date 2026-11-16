"use client";

import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { EDeliveryLabels } from "@/content/types";
import { todayInPoland } from "@/lib/tools/business-days";
import {
  CEIDG_SEARCH_PAGE,
  E_DELIVERY_APP,
  EDeliveryError,
  GOV_REGISTER_PAGE,
  KRS_SEARCH_PAGE,
  detectQuery,
  fetchKrsEntity,
  isListStale,
  type CeidgFirm,
  type KrsEntity,
  type QueryKind,
} from "@/lib/tools/e-delivery";
import { WhiteListError, searchByNip, searchByRegon as whiteListByRegon, type WhiteListSearch } from "@/lib/tools/white-list";
import { PrivacyNote } from "@/components/tools/PrivacyNote";
import { CopyButton } from "@/components/tools/CopyButton";

type Gtag = (command: "event", name: string, params: Record<string, string>) => void;

/** Counts use of the tool and nothing else: never the query or the result. */
function trackToolEvent(name: string) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", name, { tool: "e_delivery" });
}

type Institution = { name: string; town: string; voivodeship: string; regon: string; ade: string };
type InstitutionPage = { listDate: string; total: number; items: Institution[] };
type InstitutionList = InstitutionPage & { params: string };

type Notice = { message: string; link?: { href: string; label: string } };

type Outcome = {
  institutions: InstitutionList | null;
  companies: KrsEntity[];
  firms: CeidgFirm[];
  notices: Notice[];
  /** Shown when nothing at all was found. */
  empty: { title: string; hint?: string } | null;
};

const SEARCH_ROUTE = "/api/tools/e-delivery/search";
const CEIDG_ROUTE = "/api/tools/e-delivery/ceidg";

async function getJson<T>(url: string, signal: AbortSignal): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if ((error as Error).name === "AbortError") throw error;
    throw new EDeliveryError("network");
  }
  if (response.status === 429) throw new EDeliveryError("limit");
  if (!response.ok) throw new EDeliveryError("unavailable");
  return (await response.json()) as T;
}

function institutions(params: string, signal: AbortSignal) {
  return getJson<InstitutionPage>(`${SEARCH_ROUTE}?${params}`, signal).then((page) => ({ ...page, params }));
}

/** CEIDG is optional: without KodaSoft's token the route answers 503 and the tool simply skips it. */
async function ceidg(params: string, signal: AbortSignal): Promise<{ items: CeidgFirm[] } | "off"> {
  const response = await fetch(`${CEIDG_ROUTE}?${params}`, { signal }).catch((error: Error) => {
    if (error.name === "AbortError") throw error;
    throw new EDeliveryError("network");
  });
  if (response.status === 503) return "off";
  if (response.status === 429) throw new EDeliveryError("limit");
  if (!response.ok) throw new EDeliveryError("unavailable");
  return (await response.json()) as { items: CeidgFirm[] };
}

const fieldClass =
  "h-14 w-full rounded-[12px] border border-[rgba(11,17,22,0.16)] bg-[var(--color-paper)] px-4 text-[1.1rem] text-[var(--color-ink)] placeholder:text-[#8a9096] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--color-blue)] aria-[invalid=true]:border-[#a3360f]";
const labelClass = "text-[0.95rem] font-semibold text-[var(--color-ink)]";
const mutedClass = "m-0 text-[0.92rem] text-[var(--color-muted)]";
const linkClass = "text-[var(--color-blue)] underline underline-offset-4 hover:text-[var(--color-blue-deep)]";
const secondaryButton =
  "action cursor-pointer border border-[rgba(11,17,22,0.2)] bg-transparent text-[var(--color-ink)] hover:border-[rgba(11,17,22,0.4)]";

/** "KRAKÓW-ŚRÓDMIEŚCIE" → "Kraków-Śródmieście". */
function titleCase(text: string) {
  return text.toLocaleLowerCase("pl-PL").replace(/(^|[\s\-(])(\p{L})/gu, (_, before: string, letter: string) => before + letter.toLocaleUpperCase("pl-PL"));
}

/** "SĘKOWO, WIELKOPOLSKIE" as "Sękowo, wielkopolskie", the way the institution rows show a place. */
function place(seat: string) {
  const [town, ...rest] = seat.split(/,\s*/);
  return [titleCase(town), ...rest.map((part) => part.toLocaleLowerCase("pl-PL"))].join(", ");
}

/** The legal form only when the name does not already say it, as most KRS names do. */
function legalFormNote(name: string, legalForm: string | null | undefined) {
  if (!legalForm) return null;
  return name.toLocaleUpperCase("pl-PL").includes(legalForm.toLocaleUpperCase("pl-PL")) ? null : legalForm.toLocaleLowerCase("pl-PL");
}

export function EDeliverySearch({ labels, locale }: { labels: EDeliveryLabels; locale: "pl" | "en" }) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);
  const debounce = useRef<number | undefined>(undefined);
  const lastTracked = useRef(0);
  const r = labels.result;
  const e = labels.errors;

  const day = useCallback(
    (iso: string) => new Intl.DateTimeFormat(locale === "pl" ? "pl-PL" : "en-GB", { dateStyle: "long" }).format(new Date(`${iso.slice(0, 10)}T12:00:00`)),
    [locale],
  );

  const run = useCallback(
    async (kind: QueryKind, raw: string) => {
      if (kind.kind === "invalid") {
        // A result for an earlier number must not stay under the error, as if it answered this one.
        controller.current?.abort();
        setLoading(false);
        setOutcome(null);
        setFieldError(e[kind.reason]);
        return;
      }

      controller.current?.abort();
      const current = new AbortController();
      controller.current = current;
      const signal = current.signal;
      setFieldError(null);
      setLoading(true);

      const result: Outcome = { institutions: null, companies: [], firms: [], notices: [], empty: null };
      const krsLink = { href: KRS_SEARCH_PAGE, label: e.krsSearch };
      const govLink = { href: GOV_REGISTER_PAGE, label: r.officialGov };

      const searchInstitutions = (params: string) =>
        institutions(params, signal).catch((error: Error) => {
          if (error.name === "AbortError") throw error;
          result.notices.push({ message: e.searchUnavailable, link: govLink });
          return null;
        });
      const readKrs = (krs: string) =>
        fetchKrsEntity(krs, signal).catch((error: Error) => {
          if (error.name === "AbortError") throw error;
          result.notices.push({ message: e.krsNetwork, link: krsLink });
          return null;
        });
      const readCeidg = (params: string) =>
        ceidg(params, signal).catch((error: Error) => {
          if (error.name === "AbortError") throw error;
          result.notices.push({ message: (error as EDeliveryError).reason === "limit" ? e.ceidgLimit : e.ceidgUnavailable });
          return null;
        });
      const readWhiteList = (lookup: () => Promise<WhiteListSearch>) =>
        lookup().catch((error: Error) => {
          if (error.name === "AbortError") throw error;
          const failure = error as WhiteListError;
          result.notices.push({ message: failure.status === 429 ? e.whiteListLimit : e.whiteListNetwork });
          return null;
        });

      try {
        if (kind.kind === "text") {
          result.institutions = await searchInstitutions(`q=${encodeURIComponent(kind.text)}`);
          if (result.institutions && !result.institutions.total) result.empty = { title: r.noInstitution, hint: r.companyHint };
        }

        if (kind.kind === "krs") {
          const entity = await readKrs(kind.krs);
          if (entity) result.companies.push(entity);
          else if (!result.notices.length) result.empty = { title: r.krsNotFound };
        }

        if (kind.kind === "nip") {
          const today = todayInPoland();
          const search = await readWhiteList(() => searchByNip(kind.nip, today, signal));
          const subject = search?.subject ?? null;
          const [entity, list, firms] = await Promise.all([
            subject?.krs ? readKrs(subject.krs) : null,
            subject?.regon ? searchInstitutions(`regon=${subject.regon}`) : null,
            subject?.krs ? null : readCeidg(`nip=${kind.nip}`),
          ]);
          if (entity) result.companies.push(entity);
          if (list?.total) result.institutions = list;
          if (firms && firms !== "off") result.firms = firms.items;
        }

        if (kind.kind === "regon") {
          const today = todayInPoland();
          const [list, search] = await Promise.all([
            searchInstitutions(`regon=${kind.regon}`),
            // The White List rejects 14-digit REGONs (WL-107).
            kind.regon.length === 9 ? readWhiteList(() => whiteListByRegon(kind.regon, today, signal)) : null,
          ]);
          if (list?.total) result.institutions = list;
          const krs = search?.subject?.krs;
          const [entity, firms] = await Promise.all([krs ? readKrs(krs) : null, !krs && !list?.total ? readCeidg(`regon=${kind.regon}`) : null]);
          if (entity) result.companies.push(entity);
          if (firms && firms !== "off") result.firms = firms.items;
        }

        const found = (result.institutions?.total ?? 0) + result.companies.length + result.firms.length;
        if (!found && !result.empty && !result.notices.length && (kind.kind === "nip" || kind.kind === "regon")) {
          result.empty = kind.kind === "nip" ? { title: r.nipNotFound, hint: r.nipNotFoundHint } : { title: r.regonNotFound, hint: r.nipNotFoundHint };
        }

        setOutcome(result);
        const url = new URL(window.location.href);
        url.searchParams.set("q", raw.trim());
        window.history.replaceState(window.history.state, "", url);
        if (Date.now() - lastTracked.current > 10_000) {
          lastTracked.current = Date.now();
          trackToolEvent("tool_used");
        }
      } catch (error) {
        if ((error as Error).name === "AbortError") return;
        setOutcome({ ...result, empty: null, notices: [...result.notices, { message: e.searchUnavailable, link: govLink }] });
      } finally {
        if (controller.current === current) setLoading(false);
      }
    },
    [e, r],
  );

  /* A shared link: ?q= runs the search once, after hydration, so the static HTML stays the same for everyone. */
  useEffect(() => {
    const shared = new URLSearchParams(window.location.search).get("q")?.slice(0, 100);
    const start = shared
      ? window.setTimeout(() => {
          setQuery(shared);
          void run(detectQuery(shared), shared);
        }, 0)
      : undefined;
    return () => {
      window.clearTimeout(start);
      controller.current?.abort();
      window.clearTimeout(debounce.current);
    };
  }, [run]);

  const onChange = (value: string) => {
    setQuery(value);
    setFieldError(null);
    window.clearTimeout(debounce.current);
    const kind = detectQuery(value);
    // Names search as you type; numbers wait for Enter, so a half-typed KRS number never goes out.
    if (kind.kind === "text") debounce.current = window.setTimeout(() => void run(kind, value), 250);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    window.clearTimeout(debounce.current);
    void run(detectQuery(query), query);
  };

  const showMore = async () => {
    const list = outcome?.institutions;
    if (!list) return;
    setLoadingMore(true);
    try {
      const signal = new AbortController().signal;
      const next = await institutions(`${list.params}&offset=${list.items.length}`, signal);
      setOutcome((previous) =>
        previous?.institutions === list ? { ...previous, institutions: { ...list, items: [...list.items, ...next.items], total: next.total } } : previous,
      );
    } catch {
      /* The first page stays on screen. */
    } finally {
      setLoadingMore(false);
    }
  };

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      trackToolEvent("tool_copy");
      window.setTimeout(() => setCopied((value) => (value === key ? null : value)), 1800);
    } catch {
      /* The address stays on screen to select by hand. */
    }
  };

  const kind = query.trim() ? detectQuery(query) : null;
  const hint = !kind || kind.kind === "invalid" ? labels.hints.empty : labels.hints[kind.kind];
  const list = outcome?.institutions ?? null;
  const today = todayInPoland();
  const canShowMore = list ? list.items.length < Math.min(list.total, 60) : false;

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
            className={`${fieldClass} min-w-0 flex-[1_1_22rem]`}
            id={`${id}-q`}
            inputMode="text"
            maxLength={100}
            onChange={(event) => onChange(event.target.value)}
            placeholder={labels.placeholder}
            spellCheck={false}
            type="search"
            value={query}
          />
          <button className="action action-ink h-14 cursor-pointer border-0 disabled:cursor-wait disabled:opacity-70" disabled={loading} type="submit">
            {loading ? labels.searching : labels.submit}
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
      </form>

      <div aria-busy={loading} aria-live="polite">
        {outcome ? (
          <div className="grid">
            {outcome.notices.map((notice) => (
              <p className="m-0 border-t border-[var(--color-border-light)] py-5 text-[1.02rem] text-[#a3360f]" key={notice.message} role="alert">
                {notice.message}{" "}
                {notice.link ? (
                  <a className={linkClass} href={notice.link.href} rel="noopener noreferrer" target="_blank">
                    {notice.link.label}
                  </a>
                ) : null}
              </p>
            ))}

            {outcome.companies.map((entity) => (
              <Result
                ade={entity.ade}
                copied={copied === entity.krs}
                details={[
                  [null, entity.seat ? place(entity.seat) : null],
                  [null, legalFormNote(entity.name, entity.legalForm) ?? (entity.foreign ? r.foreignBranch : null)],
                  [r.krsLabel, entity.krs],
                  [r.nipLabel, entity.nip],
                  [r.regonLabel, entity.regon],
                ]}
                key={entity.krs}
                labels={labels}
                missing={
                  <>
                    <p className="m-0 font-semibold text-[var(--color-ink)]">{r.noAdeTitle}</p>
                    <p className="m-0 max-w-[46rem] text-[var(--color-muted)]">
                      {r.noAdeBody}{" "}
                      <a className={linkClass} href={E_DELIVERY_APP} rel="noopener noreferrer" target="_blank">
                        {r.eDeliveryApp}
                      </a>
                      . {entity.register === "P" ? r.noAdeDutyP : r.noAdeNoDutyS}
                    </p>
                  </>
                }
                name={entity.name}
                onCopy={(ade) => copy(entity.krs, ade)}
                source={r.sourceKrs
                  .replace("{register}", r.registers[entity.register])
                  .replace("{state}", day(entity.stateDate))
                  .replace("{extracted}", day(entity.extractedAt))}
                sourceLink={{ href: KRS_SEARCH_PAGE, label: r.officialKrs.replace("{krs}", entity.krs) }}
              />
            ))}

            {outcome.firms.map((firm, index) => (
              <Result
                ade={firm.ade}
                copied={copied === `ceidg-${index}`}
                details={[
                  [null, firm.town ? titleCase(firm.town) : null],
                  [r.nipLabel, firm.nip],
                  [r.regonLabel, firm.regon],
                  [`${r.statusLabel}:`, firm.status ? (r.ceidgStatuses[firm.status] ?? firm.status.toLocaleLowerCase("pl-PL")) : null],
                ]}
                key={`ceidg-${firm.nip ?? firm.regon ?? index}-${index}`}
                labels={labels}
                missing={
                  <p className="m-0 max-w-[46rem] text-[var(--color-muted)]">
                    {r.noAdeCeidg}{" "}
                    <a className={linkClass} href={E_DELIVERY_APP} rel="noopener noreferrer" target="_blank">
                      {r.eDeliveryApp}
                    </a>
                    .
                  </p>
                }
                name={firm.name}
                onCopy={(ade) => copy(`ceidg-${index}`, ade)}
                source={r.sourceCeidg}
                sourceLink={{ href: firm.publicUrl ?? CEIDG_SEARCH_PAGE, label: r.officialCeidg }}
              />
            ))}

            {list?.items.map((row, index) => (
              <Result
                ade={row.ade}
                copied={copied === `gov-${index}`}
                key={`${row.ade}`}
                labels={labels}
                details={[
                  [null, [titleCase(row.town), row.voivodeship.toLocaleLowerCase("pl-PL")].filter(Boolean).join(", ")],
                  [r.regonLabel, row.regon],
                ]}
                name={row.name}
                onCopy={(ade) => copy(`gov-${index}`, ade)}
                source={r.sourceGov.replace("{date}", day(list.listDate))}
                sourceLink={{ href: GOV_REGISTER_PAGE, label: r.officialGov }}
              />
            ))}

            {list ? (
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-[var(--color-border-light)] pt-5">
                {canShowMore ? (
                  <button className={`${secondaryButton} disabled:cursor-wait disabled:opacity-70`} disabled={loadingMore} onClick={showMore} type="button">
                    {r.showMore}
                  </button>
                ) : null}
                <p className={mutedClass}>
                  {list.total > list.items.length ? `${r.shownOf.replace("{shown}", String(list.items.length)).replace("{total}", String(list.total))}. ` : ""}
                  {r.listDate.replace("{date}", day(list.listDate))}{" "}
                  {isListStale(list.listDate, today) ? (
                    <a className={linkClass} href={GOV_REGISTER_PAGE} rel="noopener noreferrer" target="_blank">
                      {r.stale}
                    </a>
                  ) : null}
                </p>
              </div>
            ) : null}

            {outcome.empty ? (
              <div className="grid gap-2 border-t border-[var(--color-border-light)] pt-7">
                <p className="m-0 font-display text-[1.4rem] font-medium text-[var(--color-ink)]">{outcome.empty.title}</p>
                {outcome.empty.hint ? <p className="m-0 max-w-[46rem] text-[var(--color-muted)]">{outcome.empty.hint}</p> : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <PrivacyNote>{labels.privacyNote}</PrivacyNote>
    </div>
  );
}

function Result({
  name,
  details,
  ade,
  missing,
  source,
  sourceLink,
  copied,
  onCopy,
  labels,
}: {
  name: string;
  /** Shown on one line under the name as "label value · label value"; a null label shows the value alone. */
  details: Array<[string | null, string | null]>;
  ade: string | null;
  missing?: ReactNode;
  source: string;
  sourceLink: { href: string; label: string };
  copied: boolean;
  onCopy: (ade: string) => void;
  labels: EDeliveryLabels;
}) {
  const shown = details.filter((detail): detail is [string | null, string] => Boolean(detail[1]));

  return (
    <article className="grid gap-3 border-t border-[var(--color-border-light)] py-6">
      <div className="grid gap-1">
        <p className="m-0 font-display text-[clamp(1.25rem,2.2vw,1.45rem)] font-medium leading-[1.3] text-[var(--color-ink)] [overflow-wrap:anywhere]">{name}</p>
        {shown.length ? (
          <p className={`${mutedClass} [font-variant-numeric:tabular-nums]`}>
            {shown.map(([label, value], index) => (
              <span className="whitespace-nowrap" key={`${label ?? ""}${value}`}>
                {index ? <span aria-hidden="true"> · </span> : null}
                {label ? `${label} ` : null}
                <span className="text-[var(--color-ink-soft)]">{value}</span>
              </span>
            ))}
          </p>
        ) : null}
      </div>

      {ade ? (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <p className="m-0 flex items-center gap-2.5 font-display text-[clamp(1.25rem,2.4vw,1.6rem)] font-medium tracking-[0.01em] text-[var(--color-ink)] [font-variant-numeric:tabular-nums] [overflow-wrap:anywhere]">
            <svg aria-hidden="true" className="h-[0.8em] w-[0.8em] shrink-0 text-[#1f7a4d]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.6" viewBox="0 0 24 24">
              <path d="m5 12 5 5 9-10" />
            </svg>
            <span className="min-w-0">{ade}</span>
          </p>
          <CopyButton copied={copied} copiedLabel={labels.result.copied} label={labels.result.copy} onClick={() => onCopy(ade)} />
        </div>
      ) : (
        <div className="grid gap-1.5">{missing}</div>
      )}

      <p className={mutedClass}>
        {source} ·{" "}
        <a className={linkClass} href={sourceLink.href} rel="noopener noreferrer" target="_blank">
          {sourceLink.label}
        </a>
      </p>
    </article>
  );
}
