"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { WhiteListLabels } from "@/content/types";
import {
  WHITE_LIST_SEARCH_PAGE,
  WhiteListError,
  checkAccount,
  formatAccount,
  isValidAccount,
  isValidNip,
  normalizeAccount,
  normalizeNip,
  personName,
  searchByNip,
  todayInPoland,
  type WhiteListAccountCheck,
  type WhiteListSearch,
} from "@/lib/tools/white-list";

type Gtag = (command: "event", name: string, params: Record<string, string>) => void;

/** Counts use of the tool and nothing else: never the NIP, the account or the result. */
function trackToolEvent(name: string) {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", name, { tool: "white_list" });
}

type Outcome = { search: WhiteListSearch; account: WhiteListAccountCheck | null; accountNumber: string | null; date: string };

const fieldClass =
  "h-14 w-full rounded-[12px] border border-[rgba(11,17,22,0.16)] bg-[var(--color-paper)] px-4 text-[1.1rem] text-[var(--color-ink)] placeholder:text-[#8a9096] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--color-blue)] aria-[invalid=true]:border-[#a3360f]";
const labelClass = "text-[0.95rem] font-semibold text-[var(--color-ink)]";

export function WhiteListCheck({ labels, locale }: { labels: WhiteListLabels; locale: "pl" | "en" }) {
  const id = useId();
  const [nip, setNip] = useState("");
  const [account, setAccount] = useState("");
  /* Empty means today; "today" is read on submit, in Polish time, so the static HTML stays the same for everyone. */
  const [date, setDate] = useState("");
  const [fieldError, setFieldError] = useState<{ field: "nip" | "account" | "date"; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => controller.current?.abort(), []);

  const day = (iso: string) => new Intl.DateTimeFormat(locale === "pl" ? "pl-PL" : "en-GB", { dateStyle: "long" }).format(new Date(`${iso}T12:00:00`));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setFieldError(null);

    const cleanNip = normalizeNip(nip);
    const cleanAccount = account.trim() ? normalizeAccount(account) : null;

    if (!isValidNip(cleanNip)) return setFieldError({ field: "nip", message: labels.errors.nip });
    if (cleanAccount && !isValidAccount(cleanAccount)) return setFieldError({ field: "account", message: labels.errors.account });
    const today = todayInPoland();
    const day = date || today;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || day > today) return setFieldError({ field: "date", message: labels.errors.date });

    controller.current?.abort();
    controller.current = new AbortController();
    setLoading(true);
    setOutcome(null);

    try {
      const [search, accountCheck] = await Promise.all([
        searchByNip(cleanNip, day, controller.current.signal),
        cleanAccount ? checkAccount(cleanNip, cleanAccount, day, controller.current.signal) : Promise.resolve(null),
      ]);
      setOutcome({ search, account: accountCheck, accountNumber: cleanAccount, date: day });
      trackToolEvent("tool_used");
      window.requestAnimationFrame(() => resultRef.current?.focus());
    } catch (caught) {
      if ((caught as Error).name === "AbortError") return;
      const failure = caught as WhiteListError;
      setError(
        failure.status === 0
          ? labels.errors.network
          : failure.status === 429
            ? labels.errors.limit
            : labels.errors.api.replace("{message}", failure.code ? `${failure.message} (${failure.code})` : failure.message),
      );
    } finally {
      setLoading(false);
    }
  };

  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied((current) => (current === key ? null : current)), 1800);
    } catch {
      /* The id stays on screen and in the printout. */
    }
  };

  const subject = outcome?.search.subject ?? null;
  const status = subject?.statusVat ?? null;
  const statusTone = status === "Czynny" ? "bg-[#1f7a4d]" : status === "Zwolniony" ? "bg-[#b26b00]" : "bg-[#a3360f]";
  const r = labels.result;

  return (
    <div className="grid gap-8">
      <form className="grid gap-5" noValidate onSubmit={submit}>
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,0.9fr)] items-start gap-4 max-[900px]:grid-cols-1">
          <div className="grid gap-2">
            <label className={labelClass} htmlFor={`${id}-nip`}>
              {labels.nipLabel}
            </label>
            <input
              aria-describedby={fieldError?.field === "nip" ? `${id}-error` : undefined}
              aria-invalid={fieldError?.field === "nip"}
              autoComplete="off"
              className={`${fieldClass} font-display tracking-[0.02em]`}
              id={`${id}-nip`}
              inputMode="numeric"
              maxLength={20}
              onChange={(event) => setNip(event.target.value)}
              placeholder={labels.nipPlaceholder}
              required
              spellCheck={false}
              type="text"
              value={nip}
            />
          </div>
          <div className="grid gap-2">
            <label className={labelClass} htmlFor={`${id}-account`}>
              {labels.accountLabel}
            </label>
            <input
              aria-describedby={`${id}-account-hint${fieldError?.field === "account" ? ` ${id}-error` : ""}`}
              aria-invalid={fieldError?.field === "account"}
              autoComplete="off"
              className={`${fieldClass} font-display`}
              id={`${id}-account`}
              inputMode="numeric"
              maxLength={40}
              onChange={(event) => setAccount(event.target.value)}
              placeholder={labels.accountPlaceholder}
              spellCheck={false}
              type="text"
              value={account}
            />
            <p className="m-0 text-[0.88rem] text-[var(--color-muted)]" id={`${id}-account-hint`}>
              {labels.accountHint}
            </p>
          </div>
          <div className="grid gap-2">
            <label className={labelClass} htmlFor={`${id}-date`}>
              {labels.dateLabel}
            </label>
            <input
              aria-describedby={`${id}-date-hint${fieldError?.field === "date" ? ` ${id}-error` : ""}`}
              aria-invalid={fieldError?.field === "date"}
              className={fieldClass}
              id={`${id}-date`}
              onChange={(event) => setDate(event.target.value)}
              type="date"
              value={date}
            />
            <p className="m-0 text-[0.88rem] text-[var(--color-muted)]" id={`${id}-date-hint`}>
              {labels.dateHint}
            </p>
          </div>
        </div>

        {fieldError ? (
          <p className="m-0 text-[1rem] text-[#a3360f]" id={`${id}-error`} role="alert">
            {fieldError.message}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <button className="action action-ink cursor-pointer border-0 disabled:cursor-wait disabled:opacity-70" disabled={loading} type="submit">
            {loading ? labels.checking : labels.submit}
          </button>
          <span className="text-[0.92rem] text-[var(--color-muted)]">{labels.privacyNote}</span>
        </div>
      </form>

      <div aria-live="polite">
        {error ? (
          <p className="m-0 border-t border-[var(--color-border-light)] pt-7 text-[1.05rem] text-[#a3360f]" role="alert">
            {error}{" "}
            <a className="text-[var(--color-blue)] underline underline-offset-4" href={WHITE_LIST_SEARCH_PAGE} rel="noopener noreferrer" target="_blank">
              {r.officialSearch}
            </a>
          </p>
        ) : null}

        {outcome ? (
          <div className="print-area grid gap-7 border-t border-[var(--color-border-light)] pt-7 outline-none" ref={resultRef} tabIndex={-1}>
            <div className="hidden print:block">
              <p className="m-0 text-[1.3rem] font-semibold">{r.printTitle}</p>
              <p className="m-0 mt-1 text-[0.9rem]">{r.printSource}</p>
            </div>

            {subject ? (
              <>
                <div className="grid gap-3">
                  <p className="m-0 font-display text-[clamp(1.4rem,2.6vw,2rem)] font-medium leading-[1.25] tracking-[-0.02em] text-[var(--color-ink)]">
                    {subject.name}
                  </p>
                  <p className="m-0 inline-flex items-center gap-2.5 text-[1.05rem] font-semibold text-[var(--color-ink)]">
                    <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${statusTone}`} />
                    {r.statusLabel}: {status ? (r.statuses[status] ?? status) : "-"}
                  </p>
                  <p className="m-0 text-[0.92rem] text-[var(--color-muted)]">
                    {r.stateOnLabel} {day(outcome.date)}
                  </p>
                </div>

                {outcome.account && outcome.accountNumber ? (
                  <p
                    className={`m-0 flex items-start gap-3 rounded-[12px] border px-4 py-3.5 text-[1.02rem] ${
                      outcome.account.accountAssigned === "TAK" ? "border-[#1f7a4d]/40 text-[#185e3c]" : "border-[#a3360f]/40 text-[#8a2c0c]"
                    }`}
                  >
                    <svg aria-hidden="true" className="mt-1 h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24">
                      {outcome.account.accountAssigned === "TAK" ? <path d="m5 12 5 5 9-10" /> : <path d="M12 8v5m0 3.5v.5M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />}
                    </svg>
                    <span>
                      <span className="font-display font-medium">{formatAccount(outcome.accountNumber)}</span>
                      <br />
                      {outcome.account.accountAssigned === "TAK" ? r.accountYes : r.accountNo}
                    </span>
                  </p>
                ) : null}

                <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(15rem,1fr))] gap-x-8 gap-y-5">
                  <Fact label={r.nipLabel} value={subject.nip} />
                  <Fact label={r.regonLabel} value={subject.regon} />
                  <Fact label={r.krsLabel} value={subject.krs} />
                  <Fact label={r.residenceLabel} value={subject.residenceAddress} />
                  <Fact label={r.workingLabel} value={subject.workingAddress} />
                  <Fact label={r.registeredLabel} value={subject.registrationLegalDate} />
                  <Fact label={r.restoredLabel} value={joinDate(subject.restorationDate, subject.restorationBasis)} />
                  <Fact label={r.removedLabel} value={joinDate(subject.removalDate, subject.removalBasis)} />
                  <Fact label={r.deniedLabel} value={joinDate(subject.registrationDenialDate, subject.registrationDenialBasis)} />
                  <Fact label={r.representativesLabel} value={subject.representatives.map(personName).filter(Boolean).join(", ") || null} />
                  <Fact label={r.partnersLabel} value={subject.partners.map(personName).filter(Boolean).join(", ") || null} />
                </dl>

                <div className="grid gap-3">
                  <p className={labelClass}>{r.accountsLabel}</p>
                  {subject.accountNumbers.length ? (
                    <ul className="m-0 grid list-none gap-1.5 p-0 font-display text-[1rem] text-[var(--color-ink)]">
                      {subject.accountNumbers.map((number) => (
                        <li className={number === outcome.accountNumber ? "font-semibold" : ""} key={number}>
                          {formatAccount(number)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="m-0 text-[var(--color-muted)]">{r.noAccounts}</p>
                  )}
                  {subject.hasVirtualAccounts ? <p className="m-0 text-[0.92rem] text-[var(--color-muted)]">{r.virtualAccounts}</p> : null}
                </div>
              </>
            ) : (
              <div className="grid gap-2">
                <p className="m-0 font-display text-[1.5rem] font-medium text-[var(--color-ink)]">{r.notFound}</p>
                <p className="m-0 max-w-[46rem] text-[var(--color-muted)]">{r.notFoundHint}</p>
              </div>
            )}

            <div className="grid gap-2 rounded-[12px] bg-[var(--color-paper)] p-4 text-[0.95rem] text-[var(--color-ink)] print:border print:border-black/20">
              <p className="m-0">
                <span className="font-semibold">{r.requestIdLabel}:</span> <span className="font-display">{outcome.search.requestId}</span>
              </p>
              {outcome.account ? (
                <p className="m-0">
                  <span className="font-semibold">{r.requestIdLabel} ({labels.accountLabel.toLowerCase()}):</span>{" "}
                  <span className="font-display">{outcome.account.requestId}</span>
                </p>
              ) : null}
              <p className="m-0 text-[var(--color-muted)]">
                {r.checkedAtLabel}: {outcome.search.requestDateTime.replace(/^(\d{2})-(\d{2})-(\d{4})/, "$1.$2.$3")}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 print:hidden">
              <button className="action action-ink cursor-pointer border-0" onClick={() => window.print()} type="button">
                {r.print}
              </button>
              <button
                className="action cursor-pointer border border-[rgba(11,17,22,0.2)] bg-transparent text-[var(--color-ink)] hover:border-[rgba(11,17,22,0.4)]"
                onClick={() => copy("id", [outcome.search.requestId, outcome.account?.requestId].filter(Boolean).join(", "))}
                type="button"
              >
                {copied === "id" ? r.copied : r.copyId}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;

  return (
    <div className="min-w-0">
      <dt className="text-[0.88rem] text-[var(--color-muted)]">{label}</dt>
      <dd className="m-0 mt-1 text-[1rem] text-[var(--color-ink)] [overflow-wrap:anywhere]">{value}</dd>
    </div>
  );
}

function joinDate(date: string | null, basis: string | null) {
  if (!date) return null;
  return basis ? `${date} (${basis})` : date;
}
