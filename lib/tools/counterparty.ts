/**
 * The counterparty check (sprawdź kontrahenta): one number in, what KRS, CEIDG, the VAT
 * White List and VIES say about the company out.
 *
 * Shared by the browser and the server. The only network code here is `fetchKrsOdpis`,
 * which the browser calls straight against the open KRS API (it allows cross-origin
 * requests). CEIDG and VIES go through KodaSoft's routes, which use the parsers below.
 *
 * Every parser reads only the fields the tool shows. Natural persons are never read: the
 * KRS API masks them anyway, and for sole traders only the firm name, town, status, dates
 * and PKD leave the server.
 */
import { detectQuery, krsResponseKind, krsUrl, padKrs, parseCeidgResponse, parseKrsOdpis, type KrsEntity, type KrsRegister, type QueryKind } from "./e-delivery";
import type { WhiteListSearch } from "./white-list";

export const KRS_FULL_API = "https://api-krs.ms.gov.pl/api/krs/OdpisPelny";
export const VIES_API = "https://ec.europa.eu/taxation_customs/vies/rest-api";
export const VIES_PAGE = "https://ec.europa.eu/taxation_customs/vies/";
export const KRZ_PAGE = "https://krz.ms.gov.pl/";
export const RDF_PAGE = "https://rdf-przegladarka.ms.gov.pl/";

/** The member states VIES answers for. Greece is EL, Northern Ireland XI (goods only). */
export const VIES_COUNTRIES = ["AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "EL", "ES", "FI", "FR", "HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO", "SE", "SI", "SK", "XI"] as const;
export type ViesCountry = (typeof VIES_COUNTRIES)[number];

export function isViesCountry(value: string): value is ViesCountry {
  return (VIES_COUNTRIES as readonly string[]).includes(value);
}

/** The characters VIES accepts in a number after the country code. */
export const VIES_NUMBER_PATTERN = /^[0-9A-Z+*]{2,12}$/;

export class CounterpartyError extends Error {
  constructor(readonly reason: "network" | "format" | "limit" | "unavailable") {
    super(reason);
  }
}

/* ---------------------------------------------------------------------------------- */
/* Input                                                                               */
/* ---------------------------------------------------------------------------------- */

type InvalidReason = Extract<QueryKind, { kind: "invalid" }>["reason"] | "vat";

export type CounterpartyQuery =
  | Extract<QueryKind, { kind: "nip" | "krs" | "regon" }>
  /** Never PL: a Polish VAT number is a NIP. */
  | { kind: "vat"; country: ViesCountry; number: string }
  /** Text: the tool shows the "type a number" hint and makes no request. */
  | { kind: "name" }
  | { kind: "invalid"; reason: InvalidReason };

/**
 * `detectQuery` from the e-Delivery search, plus EU VAT numbers: two letters, then 2 to 12
 * characters with at least two digits ("DE811569869", "de 811 569 869", "ATU12345678").
 * "GR" is written EL in VIES. "PL…" stays a NIP.
 */
export function detectCounterpartyQuery(raw: string): CounterpartyQuery {
  const compact = raw.trim().replace(/[\s\-.]/g, "").toUpperCase();
  const vat = /^([A-Z]{2})([0-9A-Z+*]{2,12})$/.exec(compact);

  if (vat && vat[1] !== "PL" && (vat[2].match(/\d/g)?.length ?? 0) >= 2) {
    const country = vat[1] === "GR" ? "EL" : vat[1];
    return isViesCountry(country) ? { kind: "vat", country, number: vat[2] } : { kind: "invalid", reason: "vat" };
  }

  const kind = detectQuery(raw);
  if (kind.kind === "text") return { kind: "name" };
  return kind;
}

/* ---------------------------------------------------------------------------------- */
/* Small readers                                                                       */
/* ---------------------------------------------------------------------------------- */

type Json = Record<string, unknown>;

function isObject(value: unknown): value is Json {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFilled(value: unknown): value is Json {
  return isObject(value) && Object.keys(value).length > 0;
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function list(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

/** "12.07.2026" → "2026-07-12"; "16.11.2026 00:21:00" → "2026-11-16T00:21:00". */
export function polishDate(value: unknown): string | null {
  const match = typeof value === "string" ? /^(\d{2})\.(\d{2})\.(\d{4})(?:\s+(\d{2}:\d{2}(?::\d{2})?))?$/.exec(value.trim()) : null;
  if (!match) return null;
  const date = `${match[3]}-${match[2]}-${match[1]}`;
  return match[4] ? `${date}T${match[4]}` : date;
}

/** The last dd.mm.yyyy date in a free-text value, as ISO. */
function lastDateIn(value: string): string | null {
  const dates = [...value.matchAll(/(\d{2})\.(\d{2})\.(\d{4})/g)];
  const last = dates.at(-1);
  return last ? `${last[3]}-${last[2]}-${last[1]}` : null;
}

/** The first value under a key that mentions "data" and reads as a Polish date. */
function firstDate(block: Json, preferred: string[] = []): string | null {
  for (const key of preferred) {
    const date = polishDate(block[key]);
    if (date) return date;
  }
  for (const [key, value] of Object.entries(block)) {
    if (/data/i.test(key)) {
      const date = polishDate(value);
      if (date) return date;
    }
  }
  return null;
}

/** "2851630418,91" → 2851630418.91; "100 000,00" → 100000. */
export function parsePolishAmount(value: string): number | null {
  const clean = value.replace(/[\s ]/g, "");
  if (!/^\d+(?:,\d+)?$/.test(clean)) return null;
  return Number(clean.replace(",", "."));
}

/** "62", "01", "Z" → "62.01.Z". */
export function formatPkd(dzial: string, klasa: string, podklasa: string): string {
  return `${dzial}.${klasa}.${podklasa}`;
}

/** CEIDG writes PKD codes without dots: "6920A" → "69.20.A". */
export function formatCeidgPkd(code: string): string {
  const match = /^(\d{2})(\d{2})([A-Z])$/i.exec(code.trim());
  return match ? `${match[1]}.${match[2]}.${match[3].toUpperCase()}` : code.trim();
}

/**
 * A company files its annual statement within about 6.5 months of the year end (approval
 * within 6 months, filing within 15 days). 19 months gives a full extra year of slack, so
 * the hint only fires when a whole year is missing.
 */
export function isStatementOverdue(periodEnd: string, today: string): boolean {
  const [year, month, day] = periodEnd.split("-").map(Number);
  const limit = new Date(Date.UTC(year, month - 1 + 19, day));
  return limit.toISOString().slice(0, 10) < today;
}

/* ---------------------------------------------------------------------------------- */
/* KRS                                                                                 */
/* ---------------------------------------------------------------------------------- */

export type KrsProceeding = {
  kind: "bankruptcy" | "restructuring";
  /** As the register writes it: "UPADŁOŚĆ", "PRZYMUSOWA RESTRUKTURYZACJA". */
  type: string;
  authority: string | null;
  signature: string | null;
  openedOn: string | null;
  /** True once the register holds an end entry, even one without a readable date. */
  ended: boolean;
  endedOn: string | null;
};

const RESTRUCTURING_KEY = "postepowanieRestrukturyzacyjneNaprawczePrzymusowaRestrukturyzacjaUporzadkowanaLikwidacja";

function blockStartingWith(item: Json, prefix: string): Json | null {
  const key = Object.keys(item).find((name) => name.startsWith(prefix));
  return key && isObject(item[key]) ? item[key] : null;
}

/**
 * Bankruptcy and restructuring proceedings from dział 6.
 *
 * - Bankruptcy: one per `postepowanieUpadlosciowe` item; ended once
 *   `opisZakonczeniaProcesuUpadlosci` is filled in.
 * - Restructuring: KRS writes the end of a proceeding as its own array item (seen on
 *   0000413997), so the items are walked in order: one with an opening starts a
 *   proceeding, one with only an end closes the last open one. An end with nothing open
 *   is ignored rather than guessed at.
 */
export function krsProceedings(dzial6: unknown): KrsProceeding[] {
  if (!isObject(dzial6)) return [];
  const found: KrsProceeding[] = [];

  for (const item of list(dzial6.postepowanieUpadlosciowe)) {
    if (!isObject(item)) continue;
    const opening = isObject(item.informacjaOOgloszeniuUpadlosci) ? item.informacjaOOgloszeniuUpadlosci : {};
    const end = item.opisZakonczeniaProcesuUpadlosci;
    found.push({
      kind: "bankruptcy",
      type: text(item.sposobProwadzeniaPostepowania) ?? "UPADŁOŚĆ",
      authority: text(opening.organWydajacy),
      signature: text(opening.sygnatura),
      openedOn: firstDate(opening, ["data"]),
      ended: isFilled(end),
      endedOn: isFilled(end) ? firstDate(end) : null,
    });
  }

  const restructurings: KrsProceeding[] = [];
  for (const item of list(dzial6[RESTRUCTURING_KEY])) {
    if (!isObject(item)) continue;
    const opening = blockStartingWith(item, "otwarcie");
    const end = blockStartingWith(item, "zakonczenie");

    if (isFilled(opening)) {
      restructurings.push({
        kind: "restructuring",
        type: text(opening.rodzajPostepowania) ?? "POSTĘPOWANIE RESTRUKTURYZACYJNE",
        authority: text(opening.organWydajacy),
        signature: text(opening.sygnatura),
        openedOn: firstDate(opening, ["dataNadaniaKlauzuliWykonalnosci", "data"]),
        ended: isFilled(end),
        endedOn: isFilled(end) ? firstDate(end, ["data"]) : null,
      });
    } else if (isFilled(end)) {
      const open = restructurings.findLast((proceeding) => !proceeding.ended);
      if (open) {
        open.ended = true;
        open.endedOn = firstDate(end, ["data"]);
      }
    }
  }

  return [...found, ...restructurings];
}

export type KrsFacts = {
  /** Name, legal form, identifiers, seat town, ADE and the odpis dates, as the e-Delivery tool reads them. */
  base: KrsEntity;
  /** The registered seat address: "PL. KASZUBSKI 8/311, 81-350 GDYNIA". Public for a KRS entity. */
  address: string | null;
  registeredOn: string | null;
  capital: { amount: number; currency: string } | null;
  mainPkd: { code: string; label: string } | null;
  /** The body and its signing rule. The API masks the members' names, so none are read. */
  representation: { body: string; rule: string | null } | null;
  lastStatement: { period: string; filedOn: string | null; periodEnd: string | null } | null;
  liquidation: boolean;
  proceedings: KrsProceeding[];
  opp: boolean;
};

function addressLine(block: unknown): string | null {
  if (!isObject(block)) return null;
  const town = text(block.miejscowosc);
  const number = [text(block.nrDomu), text(block.nrLokalu)].filter(Boolean).join("/");
  const street = text(block.ulica);
  const first = street ? [street, number].filter(Boolean).join(" ") : [town, number].filter(Boolean).join(" ");
  const second = [text(block.kodPocztowy), text(block.poczta) ?? town].filter(Boolean).join(" ");
  return [first, second].filter(Boolean).join(", ") || null;
}

function lastStatementOf(dzial3: Json): KrsFacts["lastStatement"] {
  const mentions = isObject(dzial3.wzmiankiOZlozonychDokumentach) ? dzial3.wzmiankiOZlozonychDokumentach : {};
  const statements = list(mentions.wzmiankaOZlozeniuRocznegoSprawozdaniaFinansowego)
    .filter(isObject)
    .map((entry) => {
      const period = text(entry.zaOkresOdDo);
      return period ? { period, filedOn: polishDate(entry.dataZlozenia), periodEnd: lastDateIn(period) } : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
  if (!statements.length) return null;
  // Usually in order already; the latest period end wins when it is not.
  return statements.reduce((latest, entry) => ((entry.periodEnd ?? "") >= (latest.periodEnd ?? "") ? entry : latest));
}

/** Throws CounterpartyError("format") when the odpis is not one. */
export function parseKrsFacts(json: unknown, register: KrsRegister): KrsFacts {
  let base: KrsEntity;
  try {
    base = parseKrsOdpis(json, register);
  } catch {
    throw new CounterpartyError("format");
  }

  const odpis = (json as { odpis: Json }).odpis;
  const header = odpis.naglowekA as Json;
  const data = odpis.dane as Json;
  const dzial1 = isObject(data.dzial1) ? data.dzial1 : {};
  const dzial2 = isObject(data.dzial2) ? data.dzial2 : {};
  const dzial3 = isObject(data.dzial3) ? data.dzial3 : {};
  const dzial6 = isObject(data.dzial6) ? data.dzial6 : {};

  const subject = isObject(base.foreign ? dzial1.danePodmiotuZagranicznego : dzial1.danePodmiotu) ? ((base.foreign ? dzial1.danePodmiotuZagranicznego : dzial1.danePodmiotu) as Json) : {};
  const seatBlock = base.foreign ? dzial1.siedzibaIAdresPodmiotuZagranicznego : dzial1.siedzibaIAdres;

  const capitalBlock = isObject(dzial1.kapital) && isObject(dzial1.kapital.wysokoscKapitaluZakladowego) ? dzial1.kapital.wysokoscKapitaluZakladowego : null;
  const capitalAmount = capitalBlock && text(capitalBlock.wartosc) ? parsePolishAmount(text(capitalBlock.wartosc)!) : null;

  const activity = isObject(dzial3.przedmiotDzialalnosci) ? dzial3.przedmiotDzialalnosci : {};
  const main = list(activity.przedmiotPrzewazajacejDzialalnosci).find(isObject);
  const pkdParts = main ? [text(main.kodDzial), text(main.kodKlasa), text(main.kodPodklasa)] : [];

  const liquidations = list(dzial6.likwidacja).filter(isFilled);
  const representation = isObject(dzial2.reprezentacja) ? dzial2.reprezentacja : null;
  const liquidatorsRule = liquidations.length ? text(liquidations[0].sposobReprezentacjiPodmiotuPrzezLikwidatorow) : null;

  return {
    base,
    address: isObject(seatBlock) ? addressLine(seatBlock.adres) : null,
    registeredOn: polishDate(header.dataRejestracjiWKRS),
    capital: capitalAmount !== null && capitalBlock ? { amount: capitalAmount, currency: text(capitalBlock.waluta) ?? "PLN" } : null,
    mainPkd: main && pkdParts.every(Boolean) ? { code: formatPkd(pkdParts[0]!, pkdParts[1]!, pkdParts[2]!), label: text(main.opis) ?? "" } : null,
    representation:
      representation && text(representation.nazwaOrganu)
        ? { body: text(representation.nazwaOrganu)!, rule: text(representation.sposobReprezentacji) }
        : liquidatorsRule
          ? { body: "LIKWIDATORZY", rule: liquidatorsRule }
          : null,
    lastStatement: lastStatementOf(dzial3),
    liquidation: liquidations.length > 0 || /\bW LIKWIDACJI$/i.test(base.name),
    proceedings: krsProceedings(dzial6),
    opp: subject.czyPosiadaStatusOPP === true,
  };
}

export type KrsStatus =
  | { kind: "active" }
  | { kind: "liquidation" }
  | { kind: "bankruptcy"; since: string | null; signature: string | null }
  | { kind: "restructuring"; type: string; since: string | null }
  | { kind: "deregistered"; entryDate: string | null; finalDate: string | null };

/** The one status the summary leads with: an open bankruptcy, then an open restructuring, then liquidation. */
export function krsStatus(facts: KrsFacts): KrsStatus {
  const open = facts.proceedings.filter((proceeding) => !proceeding.ended);
  const bankruptcy = open.find((proceeding) => proceeding.kind === "bankruptcy");
  if (bankruptcy) return { kind: "bankruptcy", since: bankruptcy.openedOn, signature: bankruptcy.signature };
  const restructuring = open.find((proceeding) => proceeding.kind === "restructuring");
  if (restructuring) return { kind: "restructuring", type: restructuring.type, since: restructuring.openedOn };
  if (facts.liquidation) return { kind: "liquidation" };
  return { kind: "active" };
}

export type KrsDeregistered = {
  register: KrsRegister;
  krs: string;
  /** Null only when the full odpis could not be read. */
  name: string | null;
  legalForm: string | null;
  nip: string | null;
  /** The date of the deregistration entry, and the date it became final. */
  entryDate: string | null;
  finalDate: string | null;
  extractedAt: string | null;
};

/** In the full odpis every value is an array of versions; the last one is the final state. */
function lastVersion(value: unknown, key: string): unknown {
  const versions = list(value).filter(isObject);
  return versions.length ? versions[versions.length - 1][key] : undefined;
}

/** The full odpis (OdpisPelny) of a struck-off entity: name, NIP and the deregistration entry. */
export function parseKrsFullDeregistered(json: unknown, register: KrsRegister): KrsDeregistered {
  const odpis = isObject(json) && isObject(json.odpis) ? json.odpis : null;
  const header = odpis && isObject(odpis.naglowekP) ? odpis.naglowekP : null;
  const krs = header ? text(header.numerKRS) : null;
  if (!odpis || !header || !krs) throw new CounterpartyError("format");

  const data = isObject(odpis.dane) ? odpis.dane : {};
  const subject = isObject(data.dzial1) && isObject(data.dzial1.danePodmiotu) ? data.dzial1.danePodmiotu : {};
  const ids = lastVersion(subject.identyfikatory, "identyfikatory");
  const entry = list(header.wpis)
    .filter(isObject)
    .findLast((item) => /^WYKREŚLENIE/i.test(text(item.opis) ?? ""));

  return {
    register,
    krs: padKrs(krs),
    name: text(lastVersion(subject.nazwa, "nazwa")),
    legalForm: text(lastVersion(subject.formaPrawna, "formaPrawna")),
    nip: isObject(ids) ? text(ids.nip) : null,
    entryDate: entry ? polishDate(entry.dataWpisu) : null,
    finalDate: entry ? polishDate(entry.dataUprawomocnienia) : null,
    extractedAt: polishDate(header.dataCzasOdpisu),
  };
}

export type KrsLookup = { state: "found"; facts: KrsFacts } | { state: "deregistered"; record: KrsDeregistered } | { state: "notFound" };

export function krsFullUrl(krs: string, register: KrsRegister): string {
  return `${KRS_FULL_API}/${padKrs(krs)}?rejestr=${register}&format=json`;
}

async function krsFetch(url: string, signal?: AbortSignal): Promise<Response> {
  try {
    // A simple CORS request with no credentials: the API sets a cookie we don't want.
    return await fetch(url, { signal, credentials: "omit" });
  } catch (error) {
    if ((error as Error).name === "AbortError") throw error;
    throw new CounterpartyError("network");
  }
}

async function krsBody(response: Response): Promise<unknown> {
  return response.json().catch(() => {
    throw new CounterpartyError("format");
  });
}

/**
 * The KRS entry for a number: the business register (P) first, then S on a 404.
 * A struck-off entity answers 204 with no body; its full odpis is then read once for the
 * name, the NIP and the deregistration dates. If that read fails, the deregistration
 * still stands, without the details.
 */
export async function fetchKrsOdpis(krs: string, signal?: AbortSignal): Promise<KrsLookup> {
  for (const register of ["P", "S"] as const) {
    const response = await krsFetch(krsUrl(krs, register), signal);
    const kind = krsResponseKind(response.status);

    if (kind === "absent") continue;
    if (kind === "limit") throw new CounterpartyError("limit");
    if (kind === "unavailable") throw new CounterpartyError("unavailable");

    if (kind === "removed") {
      const fallback: KrsDeregistered = { register, krs: padKrs(krs), name: null, legalForm: null, nip: null, entryDate: null, finalDate: null, extractedAt: null };
      try {
        const full = await krsFetch(krsFullUrl(krs, register), signal);
        if (!full.ok || full.status === 204) return { state: "deregistered", record: fallback };
        return { state: "deregistered", record: parseKrsFullDeregistered(await krsBody(full), register) };
      } catch (error) {
        if ((error as Error).name === "AbortError") throw error;
        return { state: "deregistered", record: fallback };
      }
    }

    return { state: "found", facts: parseKrsFacts(await krsBody(response), register) };
  }

  return { state: "notFound" };
}

/* ---------------------------------------------------------------------------------- */
/* VIES                                                                                */
/* ---------------------------------------------------------------------------------- */

export type ViesReason = "valid" | "invalid" | "unavailable" | "busy" | "input";

export type ViesResult = {
  country: ViesCountry;
  number: string;
  /** Null when VIES could not tell: a member state's system was down or busy. */
  valid: boolean | null;
  reason: ViesReason;
  name: string | null;
  address: string | null;
  /** ISO date-time VIES stamped on the answer. */
  requestDate: string;
};

const VIES_UNAVAILABLE = ["MS_UNAVAILABLE", "SERVICE_UNAVAILABLE", "TIMEOUT", "VAT_BLOCKED", "IP_BLOCKED"];
const VIES_BUSY = ["GLOBAL_MAX_CONCURRENT_REQ", "MS_MAX_CONCURRENT_REQ", "GLOBAL_MAX_CONCURRENT_REQ_TIME", "MS_MAX_CONCURRENT_REQ_TIME"];
const VIES_INPUT = ["INVALID_INPUT", "INVALID_REQUESTER_INFO"];

function viesText(value: unknown): string | null {
  const clean = text(value);
  return clean && clean !== "---" ? clean : null;
}

/**
 * VIES says `isValid: false` both for an invalid number and when a member state's system
 * is down; only `userError` tells them apart. Only an explicit INVALID (or a bare
 * `isValid: false` with no error code) is read as invalid. Anything unknown is "could not
 * tell", never "invalid". The POST endpoints report errors as `errorWrappers` instead.
 */
export function parseViesResponse(json: unknown, country: ViesCountry, number: string, now = new Date().toISOString()): ViesResult {
  if (!isObject(json)) throw new CounterpartyError("format");
  const wrapped = list(json.errorWrappers).find(isObject);
  const code = (text(wrapped?.error) ?? text(json.userError) ?? "").toUpperCase();
  const flag = typeof json.isValid === "boolean" ? json.isValid : typeof json.valid === "boolean" ? json.valid : null;
  const requestDate = text(json.requestDate) ?? now;
  const result = (valid: boolean | null, reason: ViesReason): ViesResult => ({
    country,
    number,
    valid,
    reason,
    name: valid ? viesText(json.name) : null,
    address: valid ? viesText(json.address) : null,
    requestDate,
  });

  if (!wrapped && (code === "VALID" || (!code && flag === true))) return result(true, "valid");
  if (code === "INVALID" || (!code && !wrapped && flag === false)) return result(false, "invalid");
  if (VIES_BUSY.includes(code)) return result(null, "busy");
  if (VIES_INPUT.includes(code)) return result(null, "input");
  if (VIES_UNAVAILABLE.includes(code) || code || wrapped) return result(null, "unavailable");
  throw new CounterpartyError("format");
}

/* ---------------------------------------------------------------------------------- */
/* CEIDG                                                                               */
/* ---------------------------------------------------------------------------------- */

export type CeidgStatus = "AKTYWNY" | "ZAWIESZONY" | "OCZEKUJE_NA_ROZPOCZECIE_DZIALANOSCI" | "WYLACZNIE_W_FORMIE_SPOLKI" | "WYKRESLONY";

/** Exactly what the counterparty CEIDG route returns per firm: never the street, e-mail, correspondence address, citizenship or owner fields. */
export type CeidgCheck = {
  name: string;
  nip: string | null;
  regon: string | null;
  town: string | null;
  /** As CEIDG writes it; see `CeidgStatus` for the known values. */
  status: string | null;
  startedOn: string | null;
  suspendedOn: string | null;
  resumedOn: string | null;
  endedOn: string | null;
  deletedOn: string | null;
  mainPkd: { code: string; label: string } | null;
  ade: string | null;
  publicUrl: string | null;
};

function isoDate(value: unknown): string | null {
  const clean = text(value);
  return clean && /^\d{4}-\d{2}-\d{2}/.test(clean) ? clean.slice(0, 10) : null;
}

/** One CEIDG v3 firm record, reduced to the public fields above. Null when it has no name. */
export function toCeidgCheck(firm: unknown): CeidgCheck | null {
  if (!isObject(firm)) return null;
  let entry;
  try {
    [entry] = parseCeidgResponse({ firma: [firm] });
  } catch {
    return null;
  }
  if (!entry) return null;

  const pkd = isObject(firm.pkdGlowny) ? firm.pkdGlowny : null;
  const pkdCode = pkd ? text(pkd.kod) : null;

  return {
    name: entry.name,
    nip: entry.nip,
    regon: entry.regon,
    town: entry.town,
    status: entry.status,
    startedOn: isoDate(firm.dataRozpoczecia),
    suspendedOn: isoDate(firm.dataZawieszenia),
    resumedOn: isoDate(firm.dataWznowienia),
    endedOn: isoDate(firm.dataZakonczenia),
    deletedOn: isoDate(firm.dataWykreslenia),
    mainPkd: pkdCode ? { code: formatCeidgPkd(pkdCode), label: text(pkd?.nazwa) ?? "" } : null,
    ade: entry.ade,
    publicUrl: entry.publicUrl,
  };
}

/* ---------------------------------------------------------------------------------- */
/* Summary                                                                             */
/* ---------------------------------------------------------------------------------- */

/** Templates use {date}, {type} and {country}. */
export type CounterpartySummaryLabels = {
  krs: {
    active: string;
    liquidation: string;
    bankruptcy: string;
    bankruptcyNoDate: string;
    restructuring: string;
    restructuringNoDate: string;
    deregistered: string;
    deregisteredNoDate: string;
  };
  ceidg: {
    active: string;
    suspended: string;
    suspendedNoDate: string;
    pending: string;
    partnershipOnly: string;
    deleted: string;
    deletedNoDate: string;
    /** "{status}" for a status CEIDG adds later. */
    other: string;
  };
  whiteList: { active: string; exempt: string; other: string; absent: string };
  vies: { valid: string; invalid: string; unavailable: string; busy: string };
};

export type SummaryFact = { key: string; tone: "plain" | "warning"; text: string };

export type SummaryInput = {
  krs?: KrsLookup | null;
  ceidg?: CeidgCheck[] | null;
  whiteList?: WhiteListSearch | null;
  vies?: ViesResult | null;
};

const fill = (template: string, values: Record<string, string>) => template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);

/**
 * The plain one-line summary: the register status first (it is what VAT status hides: a
 * bankrupt company can still be an active VAT payer), then VAT, then EU VAT. No score:
 * each fact is what one register says. `tone: "warning"` only makes the text semibold.
 */
export function summaryFacts(input: SummaryInput, labels: CounterpartySummaryLabels, formatDate: (iso: string) => string, countryName: (country: ViesCountry) => string = (country) => country): SummaryFact[] {
  const facts: SummaryFact[] = [];
  const dated = (withDate: string, without: string, date: string | null, extra: Record<string, string> = {}) => (date ? fill(withDate, { date: formatDate(date), ...extra }) : fill(without, extra));

  const krs = input.krs;
  if (krs?.state === "found") {
    const status = krsStatus(krs.facts);
    const k = labels.krs;
    if (status.kind === "active") facts.push({ key: "krs", tone: "plain", text: k.active });
    if (status.kind === "liquidation") facts.push({ key: "krs", tone: "warning", text: k.liquidation });
    if (status.kind === "bankruptcy") facts.push({ key: "krs", tone: "warning", text: dated(k.bankruptcy, k.bankruptcyNoDate, status.since) });
    if (status.kind === "restructuring") {
      const type = status.type.toLocaleLowerCase("pl-PL");
      facts.push({ key: "krs", tone: "warning", text: dated(k.restructuring, k.restructuringNoDate, status.since, { type }) });
    }
  } else if (krs?.state === "deregistered") {
    facts.push({ key: "krs", tone: "warning", text: dated(labels.krs.deregistered, labels.krs.deregisteredNoDate, krs.record.entryDate) });
  }

  const firm = input.ceidg?.[0];
  if (firm && krs?.state !== "found" && krs?.state !== "deregistered") {
    const c = labels.ceidg;
    const status = firm.status?.toUpperCase() ?? "";
    if (status === "AKTYWNY") facts.push({ key: "ceidg", tone: "plain", text: c.active });
    else if (status === "ZAWIESZONY") facts.push({ key: "ceidg", tone: "warning", text: dated(c.suspended, c.suspendedNoDate, firm.suspendedOn) });
    else if (status === "OCZEKUJE_NA_ROZPOCZECIE_DZIALANOSCI") facts.push({ key: "ceidg", tone: "plain", text: dated(c.pending, c.pending, firm.startedOn) });
    else if (status === "WYLACZNIE_W_FORMIE_SPOLKI") facts.push({ key: "ceidg", tone: "plain", text: c.partnershipOnly });
    else if (status === "WYKRESLONY") facts.push({ key: "ceidg", tone: "warning", text: dated(c.deleted, c.deletedNoDate, firm.deletedOn ?? firm.endedOn) });
    else if (status) facts.push({ key: "ceidg", tone: "plain", text: fill(c.other, { status: status.toLocaleLowerCase("pl-PL").replace(/_/g, " ") }) });
  }

  if (input.whiteList !== undefined) {
    const w = labels.whiteList;
    const vat = input.whiteList?.subject?.statusVat ?? null;
    if (!input.whiteList?.subject) facts.push({ key: "whiteList", tone: "warning", text: w.absent });
    else if (vat === "Czynny") facts.push({ key: "whiteList", tone: "plain", text: w.active });
    else if (vat === "Zwolniony") facts.push({ key: "whiteList", tone: "plain", text: w.exempt });
    else facts.push({ key: "whiteList", tone: "warning", text: fill(w.other, { status: vat ?? "-" }) });
  }

  const vies = input.vies;
  if (vies && vies.reason !== "input") {
    const v = labels.vies;
    const country = countryName(vies.country);
    if (vies.reason === "valid") facts.push({ key: "vies", tone: "plain", text: v.valid });
    if (vies.reason === "invalid") facts.push({ key: "vies", tone: "warning", text: v.invalid });
    if (vies.reason === "unavailable") facts.push({ key: "vies", tone: "plain", text: fill(v.unavailable, { country }) });
    if (vies.reason === "busy") facts.push({ key: "vies", tone: "plain", text: v.busy });
  }

  return facts;
}
