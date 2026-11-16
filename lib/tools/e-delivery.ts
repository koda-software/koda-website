/**
 * The e-Delivery address search (wyszukiwarka adresów do e-Doręczeń): input detection,
 * number checks, the KRS odpis parser and the CEIDG response parser.
 *
 * Shared by the browser and the server, so nothing here touches the network except
 * `fetchKrsEntity`, which the browser calls straight against the open KRS API: the
 * Ministry of Justice allows cross-origin requests, on errors too.
 */
import { previousBusinessDay } from "./business-days";
import { isValidNip, normalizeNip } from "./white-list";

export const ADE_PATTERN = /^AE:PL-\d{5}-\d{5}-[A-Z]{5}-\d{2}$/;
export const KRS_API = "https://api-krs.ms.gov.pl/api/krs/OdpisAktualny";
export const GOV_REGISTER_PAGE = "https://www.gov.pl/web/e-doreczenia/sprawdz-czy-twoj-urzad-korzysta-z-e-doreczen";
export const KRS_SEARCH_PAGE = "https://wyszukiwarka-krs.ms.gov.pl/";
export const E_DELIVERY_APP = "https://edoreczenia.gov.pl/";
export const CEIDG_SEARCH_PAGE = "https://www.biznes.gov.pl/pl/wyszukiwarka-firm/";
export const CEIDG_API = "https://dane.biznes.gov.pl/api/ceidg/v3";

export type QueryKind =
  | { kind: "nip"; nip: string }
  | { kind: "krs"; krs: string }
  | { kind: "regon"; regon: string }
  | { kind: "text"; text: string }
  | { kind: "invalid"; reason: "nip" | "regon" | "krs" | "number" | "short" };

const REGON9_WEIGHTS = [8, 9, 2, 3, 4, 5, 6, 7];
const REGON14_WEIGHTS = [2, 4, 8, 5, 0, 9, 7, 3, 6, 1, 2, 4, 8];

function checksum(digits: string, weights: number[]): boolean {
  const sum = weights.reduce((total, weight, index) => total + weight * Number(digits[index]), 0);
  return (sum % 11) % 10 === Number(digits[weights.length]);
}

/** The 9-digit and 14-digit REGON check digits. */
export function isValidRegon(regon: string): boolean {
  if (/^\d{9}$/.test(regon)) return checksum(regon, REGON9_WEIGHTS);
  if (/^\d{14}$/.test(regon)) return checksum(regon, REGON14_WEIGHTS);
  return false;
}

/**
 * KRS writes a 9-digit REGON as 14 digits with "00000" on the end, which fails the
 * 14-digit check. Such a number is the 9-digit REGON.
 */
export function trimRegon(regon: string): string {
  return /^\d{9}00000$/.test(regon) && isValidRegon(regon.slice(0, 9)) ? regon.slice(0, 9) : regon;
}

export function padKrs(digits: string): string {
  return digits.padStart(10, "0");
}

function regonQuery(digits: string): QueryKind {
  const regon = trimRegon(digits);
  return isValidRegon(regon) ? { kind: "regon", regon } : { kind: "invalid", reason: "regon" };
}

/**
 * One field for every kind of query.
 *
 * 1. A "NIP", "KRS" or "REGON" prefix forces the type.
 * 2. Digits only (spaces, dashes, dots and a leading "PL" dropped):
 *    - 9 or 14 digits with a valid REGON check digit: REGON. Many 9-digit REGONs start
 *      with 0 (ZUS is 000017756), so this goes before the leading-zero KRS rule;
 *    - up to 10 digits starting with 0, or fewer than 9 digits: KRS;
 *    - 10 digits not starting with 0: NIP, which never starts with 0;
 *    - other 9 or 14 digit numbers fail the REGON check; anything else is not a number we know.
 * 3. Anything else with at least two letters: an institution name.
 */
export function detectQuery(raw: string): QueryKind {
  const trimmed = raw.trim();
  const prefixed = /^(NIP|KRS|REGON)\s*:?\s*(.*)$/i.exec(trimmed);

  if (prefixed && /^[\d\s\-.]*$/.test(prefixed[2]) && /\d/.test(prefixed[2])) {
    const digits = prefixed[2].replace(/[\s\-.]/g, "");
    const kind = prefixed[1].toUpperCase();
    if (kind === "NIP") return isValidNip(digits) ? { kind: "nip", nip: digits } : { kind: "invalid", reason: "nip" };
    if (kind === "KRS") return /^\d{1,10}$/.test(digits) && !/^0+$/.test(digits) ? { kind: "krs", krs: padKrs(digits) } : { kind: "invalid", reason: "krs" };
    return regonQuery(digits);
  }

  const digits = normalizeNip(trimmed);

  if (/^\d+$/.test(digits)) {
    if ((digits.length === 9 || digits.length === 14) && isValidRegon(trimRegon(digits))) return { kind: "regon", regon: trimRegon(digits) };
    if (/^0+$/.test(digits)) return { kind: "invalid", reason: "krs" };
    if ((digits.length <= 10 && digits.startsWith("0")) || digits.length < 9) return { kind: "krs", krs: padKrs(digits) };
    if (digits.length === 10) return isValidNip(digits) ? { kind: "nip", nip: digits } : { kind: "invalid", reason: "nip" };
    if (digits.length === 9 || digits.length === 14) return { kind: "invalid", reason: "regon" };
    return { kind: "invalid", reason: "number" };
  }

  const letters = trimmed.match(/\p{L}/gu)?.length ?? 0;
  return letters >= 2 ? { kind: "text", text: trimmed.slice(0, 100) } : { kind: "invalid", reason: "short" };
}

/**
 * gov.pl publishes the list as of the end of the previous business day. A list more than
 * four business days behind that is flagged as possibly out of date.
 */
export function isListStale(listDate: string, today: string): boolean {
  let limit = today;
  for (let step = 0; step < 4; step += 1) limit = previousBusinessDay(limit);
  return listDate < limit;
}

export class EDeliveryError extends Error {
  constructor(readonly reason: "network" | "notFound" | "format" | "limit" | "unavailable") {
    super(reason);
  }
}

export type KrsRegister = "P" | "S";

export type KrsEntity = {
  register: KrsRegister;
  krs: string;
  name: string;
  legalForm: string;
  nip: string | null;
  /** Trimmed to 9 digits when KRS writes it as the 9-digit REGON plus "00000". */
  regon: string | null;
  /** "GDYNIA, POMORSKIE" */
  seat: string | null;
  /** Null when the record has no address, or one that is not an ADE. */
  ade: string | null;
  /** ISO date of the state the odpis shows (naglowekA.stanZDnia). */
  stateDate: string;
  /** ISO date-time the odpis was generated. */
  extractedAt: string;
  /** A branch of a foreign entrepreneur (oddział przedsiębiorcy zagranicznego). */
  foreign: boolean;
};

type Json = Record<string, unknown>;

function isObject(value: unknown): value is Json {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

/** "12.07.2026" → "2026-07-12"; "16.11.2026 00:21:00" → "2026-11-16T00:21:00". */
function polishDate(value: unknown): string | null {
  const match = typeof value === "string" ? /^(\d{2})\.(\d{2})\.(\d{4})(?:\s+(\d{2}:\d{2}(?::\d{2})?))?$/.exec(value.trim()) : null;
  if (!match) return null;
  const date = `${match[3]}-${match[2]}-${match[1]}`;
  return match[4] ? `${date}T${match[4]}` : date;
}

function validAde(value: unknown): string | null {
  const candidate = text(value)?.toUpperCase() ?? null;
  return candidate && ADE_PATTERN.test(candidate) ? candidate : null;
}

/**
 * Reads only the name, legal form, identifiers, seat and ADE from dział 1. The board,
 * shareholders and contact fields are never read: the contact fields are even swapped
 * in some records.
 */
export function parseKrsOdpis(json: unknown, register: KrsRegister): KrsEntity {
  const odpis = isObject(json) && isObject(json.odpis) ? json.odpis : null;
  const header = odpis && isObject(odpis.naglowekA) ? odpis.naglowekA : null;
  const section = odpis && isObject(odpis.dane) && isObject(odpis.dane.dzial1) ? odpis.dane.dzial1 : null;
  if (!header || !section) throw new EDeliveryError("format");

  const foreign = isObject(section.danePodmiotuZagranicznego);
  const subject = foreign ? section.danePodmiotuZagranicznego : section.danePodmiotu;
  const seatBlock = foreign ? section.siedzibaIAdresPodmiotuZagranicznego : section.siedzibaIAdres;
  const name = isObject(subject) ? text(subject.nazwa) : null;
  const krs = text(header.numerKRS);
  if (!isObject(subject) || !name || !krs) throw new EDeliveryError("format");

  const ids = isObject(subject.identyfikatory) ? subject.identyfikatory : {};
  const regon = text(ids.regon);
  const seat = isObject(seatBlock) && isObject(seatBlock.siedziba) ? seatBlock.siedziba : null;
  const seatLine = seat ? [text(seat.miejscowosc), text(seat.wojewodztwo)].filter(Boolean).join(", ") : "";
  const stateDate = polishDate(header.stanZDnia) ?? polishDate(header.dataOstatniegoWpisu);
  const extractedAt = polishDate(header.dataCzasOdpisu);
  if (!stateDate || !extractedAt) throw new EDeliveryError("format");

  return {
    register,
    krs: padKrs(krs),
    name,
    legalForm: text(subject.formaPrawna) ?? "",
    nip: text(ids.nip),
    regon: regon ? trimRegon(regon) : null,
    seat: seatLine || null,
    ade: isObject(seatBlock) ? validAde(seatBlock.adresDoDoreczenElektronicznychWpisanyDoBAE) : null,
    stateDate,
    extractedAt,
    foreign,
  };
}

export function krsUrl(krs: string, register: KrsRegister): string {
  return `${KRS_API}/${padKrs(krs)}?rejestr=${register}&format=json`;
}

/** A number KRS knows but whose entity has been struck off: no current odpis, so no ADE to show. */
export type KrsRemoved = { removed: true; register: KrsRegister; krs: string };

/**
 * What one KRS register answers for a number: 200 with the odpis, 204 with no body for an
 * entity struck off the register (seen 2026-11-16 for 0000211826 and 0000018507), and 404
 * when the register never had it.
 */
export function krsResponseKind(status: number): "odpis" | "removed" | "absent" | "limit" | "unavailable" {
  if (status === 204) return "removed";
  if (status === 404) return "absent";
  if (status === 429) return "limit";
  return status >= 200 && status < 300 ? "odpis" : "unavailable";
}

/**
 * The current KRS odpis: the business register (P) first, then associations and
 * foundations (S) on a 404. Null when neither has the number.
 */
export async function fetchKrsEntity(krs: string, signal?: AbortSignal): Promise<KrsEntity | KrsRemoved | null> {
  for (const register of ["P", "S"] as const) {
    let response: Response;

    try {
      // No custom headers (a simple CORS request) and no credentials: the API sets a cookie we don't want.
      response = await fetch(krsUrl(krs, register), { signal, credentials: "omit" });
    } catch (error) {
      if ((error as Error).name === "AbortError") throw error;
      throw new EDeliveryError("network");
    }

    const kind = krsResponseKind(response.status);
    if (kind === "absent") continue;
    if (kind === "removed") return { removed: true, register, krs: padKrs(krs) };
    if (kind === "limit") throw new EDeliveryError("limit");
    if (kind === "unavailable") throw new EDeliveryError("unavailable");

    const body = await response.json().catch(() => {
      throw new EDeliveryError("format");
    });
    return parseKrsOdpis(body, register);
  }

  return null;
}

/* ---------------------------------------------------------------------------------- */
/* CEIDG (sole traders), read on the server with KodaSoft's token.                     */
/* ---------------------------------------------------------------------------------- */

/** Exactly what the CEIDG route returns per firm: no owner PESEL, no address beyond the town, no contacts. */
export type CeidgFirm = {
  name: string;
  nip: string | null;
  regon: string | null;
  town: string | null;
  /** As CEIDG writes it, e.g. "AKTYWNY", "ZAWIESZONY", "WYKRESLONY". */
  status: string | null;
  ade: string | null;
  /** The public record on biznes.gov.pl, only when the response carries such a link. */
  publicUrl: string | null;
};

/** A parsed firm plus where to read its details when the list entry has no ADE. Server-side only. */
export type CeidgEntry = CeidgFirm & { detailUrl: string | null };

/**
 * Keys the ADE may sit under. `adresDoreczenElektronicznych` is the v3 key, seen in live
 * `/firma` responses on 2026-11-16; the others and the string scan are a safety net.
 */
const CEIDG_ADE_KEYS = ["adresDoreczenElektronicznych", "adresDoDoreczenElektronicznych", "adresDoDoreczenElektronicznychWpisanyDoBAE", "adresDoDoreczen", "ade"];

/** Finds the ADE: the likely keys first (on the firm or one level down), then any string that is an ADE. */
export function findAde(firm: unknown, depth = 0): string | null {
  if (depth > 4) return null;

  if (isObject(firm)) {
    for (const key of CEIDG_ADE_KEYS) {
      const direct = validAde(firm[key]);
      if (direct) return direct;
      const nested = firm[key];
      if (isObject(nested)) {
        for (const value of Object.values(nested)) {
          const found = validAde(value);
          if (found) return found;
        }
      }
    }
  }

  const values = isObject(firm) ? Object.values(firm) : Array.isArray(firm) ? firm : [];
  for (const value of values) {
    const found = typeof value === "string" ? validAde(value) : findAde(value, depth + 1);
    if (found) return found;
  }
  return null;
}

function digitsOnly(value: unknown, lengths: number[]): string | null {
  const digits = text(value)?.replace(/\D/g, "") ?? "";
  return lengths.includes(digits.length) ? digits : null;
}

const CEIDG_HOST = "dane.biznes.gov.pl";

/** Only CEIDG's own API host is followed for details, never a link to anywhere else. */
function detailUrlOf(firm: Json): string | null {
  const link = text(firm.link);
  if (link) {
    try {
      const url = new URL(link);
      if (url.protocol === "https:" && url.hostname === CEIDG_HOST) return url.toString();
    } catch {
      /* not a URL */
    }
  }
  const id = text(firm.id);
  return id && /^[\w-]{1,64}$/.test(id) ? `${CEIDG_API}/firma/${id}` : null;
}

/** A public record link, from a few hosts that serve CEIDG entries to anyone. */
function publicUrlOf(firm: Json): string | null {
  for (const value of Object.values(firm)) {
    const candidate = text(value);
    if (!candidate || !/^https:\/\//.test(candidate)) continue;
    try {
      const url = new URL(candidate);
      if (["www.biznes.gov.pl", "biznes.gov.pl", "aplikacja.ceidg.gov.pl"].includes(url.hostname)) return url.toString();
    } catch {
      /* not a URL */
    }
  }
  return null;
}

function parseCeidgFirm(firm: Json): CeidgEntry | null {
  const owner = isObject(firm.wlasciciel) ? firm.wlasciciel : {};
  const address = isObject(firm.adresDzialalnosci) ? firm.adresDzialalnosci : isObject(firm.adres) ? firm.adres : {};
  const name = text(firm.nazwa) ?? text(firm.firma);
  if (!name) return null;

  return {
    name,
    nip: digitsOnly(firm.nip ?? owner.nip, [10]),
    regon: digitsOnly(firm.regon ?? owner.regon, [9, 14]),
    town: text(address.miasto) ?? text(address.miejscowosc),
    status: text(firm.status),
    ade: findAde(firm),
    publicUrl: publicUrlOf(firm),
    detailUrl: detailUrlOf(firm),
  };
}

/**
 * The firms in a CEIDG v3 response: `{ firma: [...] }` from `/firma?nip=`, or one firm
 * object from a detail endpoint. Throws EDeliveryError("format") for anything else.
 */
export function parseCeidgResponse(json: unknown): CeidgEntry[] {
  const list = isObject(json) && Array.isArray(json.firma) ? json.firma : isObject(json) && isObject(json.firma) ? [json.firma] : isObject(json) && text(json.nazwa) ? [json] : null;
  if (!list) throw new EDeliveryError("format");
  return list.filter(isObject).map(parseCeidgFirm).filter((firm): firm is CeidgEntry => firm !== null);
}

const CEIDG_STATUS_ORDER = ["AKTYWNY", "ZAWIESZONY", "OCZEKUJE_NA_ROZPOCZECIE_DZIALANOSCI", "WYLACZNIE_W_FORMIE_SPOLKI"];

/** Deleted entries ("WYKRESLONY") as the only result. */
export function isCeidgDeleted(firm: Pick<CeidgFirm, "status">): boolean {
  return firm.status?.toUpperCase() === "WYKRESLONY";
}

/**
 * One NIP can have several CEIDG entries: earlier, deleted businesses stay in the register.
 * Current entries come first, and deleted ones are dropped when a current one exists.
 */
export function preferCurrentFirms<T extends Pick<CeidgFirm, "status">>(firms: T[]): T[] {
  const current = firms.filter((firm) => !isCeidgDeleted(firm));
  const rank = (firm: T) => {
    const index = CEIDG_STATUS_ORDER.indexOf(firm.status?.toUpperCase() ?? "");
    return index === -1 ? CEIDG_STATUS_ORDER.length : index;
  };
  return (current.length ? current : firms).map((firm, index) => ({ firm, index })).sort((a, b) => rank(a.firm) - rank(b.firm) || a.index - b.index).map(({ firm }) => firm);
}
