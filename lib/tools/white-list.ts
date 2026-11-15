/**
 * The VAT White List check (wykaz podatników VAT, "biała lista").
 *
 * Validation runs first, in the browser, so a typo never spends the visitor's daily
 * quota at the Ministry of Finance. The lookups then go straight from the visitor's
 * browser to the MF API, which allows cross-origin requests: nothing passes through
 * KodaSoft's servers, and the MF's per-IP limit is the visitor's own.
 */

export const WHITE_LIST_API = "https://wl-api.mf.gov.pl/api";
export const WHITE_LIST_SEARCH_PAGE = "https://www.podatki.gov.pl/wykaz-podatnikow-vat-wyszukiwarka";

const NIP_WEIGHTS = [6, 5, 7, 2, 3, 4, 5, 6, 7];

/** Digits only: drops spaces, dashes and a leading "PL". */
export function normalizeNip(raw: string): string {
  return raw.replace(/^\s*PL/i, "").replace(/[\s\-.]/g, "");
}

export function isValidNip(nip: string): boolean {
  if (!/^\d{10}$/.test(nip) || /^0+$/.test(nip)) return false;
  const sum = NIP_WEIGHTS.reduce((total, weight, index) => total + weight * Number(nip[index]), 0);
  const check = sum % 11;
  return check !== 10 && check === Number(nip[9]);
}

/** 26 digits: drops spaces, dashes and a leading "PL". */
export function normalizeAccount(raw: string): string {
  return raw.replace(/^\s*PL/i, "").replace(/[\s\-]/g, "");
}

/** The Polish NRB check: the IBAN mod-97 rule with the country code PL. */
export function isValidAccount(account: string): boolean {
  if (!/^\d{26}$/.test(account)) return false;
  // "PL" is 25 21 in the IBAN letter code; the check digits move to the end.
  const rearranged = `${account.slice(2)}2521${account.slice(0, 2)}`;
  let remainder = 0;
  for (const digit of rearranged) remainder = (remainder * 10 + Number(digit)) % 97;
  return remainder === 1;
}

/** `59101010100075912222000000` as `59 1010 1010 0075 9122 2200 0000`. */
export function formatAccount(account: string): string {
  return `${account.slice(0, 2)} ${account.slice(2).replace(/(\d{4})(?=\d)/g, "$1 ")}`;
}

/** Today in Poland, as YYYY-MM-DD: the date the White List is read for by default. */
export function todayInPoland(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(now);
}

export type WhiteListPerson = {
  companyName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  nip?: string | null;
};

export type WhiteListSubject = {
  name: string;
  nip: string | null;
  statusVat: string | null;
  regon: string | null;
  krs: string | null;
  residenceAddress: string | null;
  workingAddress: string | null;
  representatives: WhiteListPerson[];
  authorizedClerks: WhiteListPerson[];
  partners: WhiteListPerson[];
  registrationLegalDate: string | null;
  registrationDenialDate: string | null;
  registrationDenialBasis: string | null;
  restorationDate: string | null;
  restorationBasis: string | null;
  removalDate: string | null;
  removalBasis: string | null;
  accountNumbers: string[];
  hasVirtualAccounts: boolean | null;
};

export type WhiteListSearch = {
  subject: WhiteListSubject | null;
  requestId: string;
  requestDateTime: string;
};

export type WhiteListAccountCheck = {
  accountAssigned: "TAK" | "NIE";
  requestId: string;
  requestDateTime: string;
};

export class WhiteListError extends Error {
  constructor(
    message: string,
    readonly code: string | null,
    readonly status: number,
  ) {
    super(message);
  }
}

async function call<T>(path: string, signal?: AbortSignal): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${WHITE_LIST_API}${path}`, { signal, headers: { Accept: "application/json" } });
  } catch (error) {
    if ((error as Error).name === "AbortError") throw error;
    throw new WhiteListError("network", null, 0);
  }

  const body = (await response.json().catch(() => null)) as { result?: T; code?: string; message?: string } | null;

  if (!response.ok || !body?.result) {
    throw new WhiteListError(body?.message ?? `HTTP ${response.status}`, body?.code ?? null, response.status);
  }

  return body.result;
}

export function searchByNip(nip: string, date: string, signal?: AbortSignal) {
  return call<WhiteListSearch>(`/search/nip/${nip}?date=${date}`, signal);
}

/** Checks one account against one NIP, including virtual accounts, which the search does not list. */
export function checkAccount(nip: string, account: string, date: string, signal?: AbortSignal) {
  return call<WhiteListAccountCheck>(`/check/nip/${nip}/bank-account/${account}?date=${date}`, signal);
}

export function personName(person: WhiteListPerson): string {
  return person.companyName || [person.firstName, person.lastName].filter(Boolean).join(" ") || person.nip || "";
}
