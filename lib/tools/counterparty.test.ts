import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { afterEach, test } from "node:test";
import {
  CounterpartyError,
  detectCounterpartyQuery,
  fetchKrsOdpis,
  formatCeidgPkd,
  formatPkd,
  isStatementOverdue,
  krsProceedings,
  krsStatus,
  parseKrsFacts,
  parseKrsFullDeregistered,
  parsePolishAmount,
  parseViesResponse,
  summaryFacts,
  toCeidgCheck,
  type CounterpartySummaryLabels,
} from "./counterparty";
import { takeToken } from "./counterparty-guard";
import type { WhiteListSearch } from "./white-list";

/*
 * Real KRS odpisy and VIES answers from 2026-11-16, trimmed: no board members, liquidators,
 * supervisors or merger texts. The CEIDG firm is synthetic (invented name and numbers).
 */
const fixture = (name: string) => JSON.parse(readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8")) as unknown;
const necto = fixture("krs-0000690425-p-facts.json");
const getin = fixture("krs-0000304735-p.json");
const capitea = fixture("krs-0000413997-p.json");
const kaja = fixture("krs-0000596649-p.json");
const klon = fixture("krs-0000211826-p-full.json");
const ceidgFirm = (fixture("ceidg-firma-synthetic.json") as { firma: Record<string, unknown>[] }).firma[0];

const dzial6 = (odpis: unknown) => (odpis as { odpis: { dane: { dzial6: unknown } } }).odpis.dane.dzial6;

test("detects EU VAT numbers and leaves Polish ones as a NIP", () => {
  assert.deepEqual(detectCounterpartyQuery("DE811569869"), { kind: "vat", country: "DE", number: "811569869" });
  assert.deepEqual(detectCounterpartyQuery("de 811 569 869"), { kind: "vat", country: "DE", number: "811569869" });
  assert.deepEqual(detectCounterpartyQuery("EL094014201"), { kind: "vat", country: "EL", number: "094014201" });
  assert.deepEqual(detectCounterpartyQuery("GR094014201"), { kind: "vat", country: "EL", number: "094014201" });
  assert.deepEqual(detectCounterpartyQuery("FR40303265045"), { kind: "vat", country: "FR", number: "40303265045" });
  assert.deepEqual(detectCounterpartyQuery("ATU12345678"), { kind: "vat", country: "AT", number: "U12345678" });
  assert.deepEqual(detectCounterpartyQuery("PL5862321443"), { kind: "nip", nip: "5862321443" });
  assert.deepEqual(detectCounterpartyQuery("PL 586-232-14-43"), { kind: "nip", nip: "5862321443" });
  assert.deepEqual(detectCounterpartyQuery("PL5862321444"), { kind: "invalid", reason: "nip" });
  assert.deepEqual(detectCounterpartyQuery("0000596649"), { kind: "krs", krs: "0000596649" });
  assert.deepEqual(detectCounterpartyQuery("368023770"), { kind: "regon", regon: "368023770" });
  assert.deepEqual(detectCounterpartyQuery("Necto"), { kind: "name" });
  assert.deepEqual(detectCounterpartyQuery("PZU2"), { kind: "name" });
  assert.deepEqual(detectCounterpartyQuery("XX123"), { kind: "invalid", reason: "vat" });
});

test("pairs a restructuring end written as its own dział 6 item", () => {
  assert.deepEqual(
    krsProceedings(dzial6(capitea)).map(({ kind, type, openedOn, ended, endedOn }) => ({ kind, type, openedOn, ended, endedOn })),
    [{ kind: "restructuring", type: "POSTĘPOWANIE RESTRUKTURYZACYJNE", openedOn: "2018-05-09", ended: true, endedOn: "2019-06-06" }],
  );
});

test("ignores a restructuring end with nothing open", () => {
  const orphan = { postepowanieRestrukturyzacyjneNaprawczePrzymusowaRestrukturyzacjaUporzadkowanaLikwidacja: [{ otwarciePostepowania: {}, zakonczeniePostepowania: { data: "06.06.2019", opis: "ZAKOŃCZENIE" } }] };
  assert.deepEqual(krsProceedings(orphan), []);
});

test("reads an open bankruptcy and an open forced restructuring", () => {
  const [bankruptcy, restructuring] = krsProceedings(dzial6(getin));
  assert.equal(bankruptcy.kind, "bankruptcy");
  assert.equal(bankruptcy.openedOn, "2023-07-20");
  assert.equal(bankruptcy.signature, "WA1M/GU/188/2023");
  assert.equal(bankruptcy.ended, false);
  assert.equal(bankruptcy.endedOn, null);
  assert.equal(restructuring.kind, "restructuring");
  assert.equal(restructuring.type, "PRZYMUSOWA RESTRUKTURYZACJA");
  assert.equal(restructuring.openedOn, "2022-09-29");
  assert.equal(restructuring.ended, false);
});

test("ranks bankruptcy over restructuring, then liquidation, then active", () => {
  assert.deepEqual(krsStatus(parseKrsFacts(getin, "P")), { kind: "bankruptcy", since: "2023-07-20", signature: "WA1M/GU/188/2023" });
  assert.deepEqual(krsStatus(parseKrsFacts(kaja, "P")), { kind: "liquidation" });
  assert.deepEqual(krsStatus(parseKrsFacts(capitea, "P")), { kind: "active" });
  assert.deepEqual(krsStatus(parseKrsFacts(necto, "P")), { kind: "active" });
});

test("reads the public facts of a KRS company", () => {
  const facts = parseKrsFacts(necto, "P");
  assert.equal(facts.base.name, "NECTO SPÓŁKA AKCYJNA");
  assert.equal(facts.base.nip, "5862321443");
  assert.equal(facts.address, "PL. KASZUBSKI 8/311, 81-350 GDYNIA");
  assert.deepEqual(facts.capital, { amount: 100000, currency: "PLN" });
  assert.deepEqual(facts.mainPkd, { code: "62.01.Z", label: "DZIAŁALNOŚĆ ZWIĄZANA Z OPROGRAMOWANIEM" });
  assert.equal(facts.registeredOn, "2017-08-17");
  assert.deepEqual(facts.lastStatement, { period: "OD 01.01.2025 DO 31.12.2025", filedOn: "2026-04-13", periodEnd: "2025-12-31" });
  assert.equal(facts.representation?.body, "ZARZĄD");
  assert.equal(facts.liquidation, false);
  assert.equal(facts.opp, false);
  assert.deepEqual(facts.proceedings, []);
});

test("falls back to the liquidators' signing rule in liquidation", () => {
  const facts = parseKrsFacts(kaja, "P");
  assert.equal(facts.liquidation, true);
  assert.equal(facts.representation?.body, "LIKWIDATORZY");
  assert.deepEqual(facts.capital, { amount: 5000, currency: "PLN" });
});

test("throws format for something that is not an odpis", () => {
  assert.throws(() => parseKrsFacts({ odpis: {} }, "P"), (error: unknown) => error instanceof CounterpartyError && error.reason === "format");
});

test("reads a struck-off entity from the full odpis", () => {
  const record = parseKrsFullDeregistered(klon, "P");
  assert.equal(record.name, '"KLON" SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ');
  assert.equal(record.nip, "8990024669");
  assert.equal(record.entryDate, "2026-10-06");
  assert.equal(record.finalDate, "2026-11-05");
  assert.equal(record.krs, "0000211826");
  assert.equal(record.legalForm, "SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ");
});

/* fetchKrsOdpis against a mocked fetch. */
const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

function mockFetch(answers: Record<string, () => Response>) {
  const calls: string[] = [];
  globalThis.fetch = (async (input: string | URL | Request) => {
    const url = String(input);
    calls.push(url);
    const key = Object.keys(answers).find((pattern) => url.includes(pattern));
    if (!key) throw new Error(`unexpected ${url}`);
    return answers[key]();
  }) as typeof fetch;
  return calls;
}

test("fetchKrsOdpis follows a 204 to the full odpis", async () => {
  const calls = mockFetch({
    "OdpisAktualny/0000211826?rejestr=P": () => new Response(null, { status: 204 }),
    "OdpisPelny/0000211826?rejestr=P": () => Response.json(klon),
  });
  const lookup = await fetchKrsOdpis("211826");
  assert.equal(lookup.state, "deregistered");
  assert.equal(lookup.state === "deregistered" && lookup.record.entryDate, "2026-10-06");
  assert.equal(calls.length, 2);
});

test("fetchKrsOdpis keeps the deregistration when the full odpis fails", async () => {
  mockFetch({
    "OdpisAktualny/0000211826?rejestr=P": () => new Response(null, { status: 204 }),
    "OdpisPelny/0000211826?rejestr=P": () => new Response("", { status: 500 }),
  });
  const lookup = await fetchKrsOdpis("0000211826");
  assert.equal(lookup.state, "deregistered");
  assert.equal(lookup.state === "deregistered" && lookup.record.name, null);
});

test("fetchKrsOdpis tries S after a 404 in P", async () => {
  mockFetch({
    "rejestr=P": () => new Response("{}", { status: 404 }),
    "OdpisAktualny/0000690425?rejestr=S": () => Response.json(necto),
  });
  const lookup = await fetchKrsOdpis("0000690425");
  assert.equal(lookup.state, "found");
  assert.equal(lookup.state === "found" && lookup.facts.base.register, "S");
});

test("fetchKrsOdpis reports not found and the limit", async () => {
  mockFetch({ "rejestr=": () => new Response("{}", { status: 404 }) });
  assert.deepEqual(await fetchKrsOdpis("0000000001"), { state: "notFound" });

  mockFetch({ "rejestr=P": () => new Response("", { status: 429 }) });
  await assert.rejects(fetchKrsOdpis("0000690425"), (error: unknown) => error instanceof CounterpartyError && error.reason === "limit");
});

test("reads amounts and PKD codes", () => {
  assert.equal(parsePolishAmount("2851630418,91"), 2851630418.91);
  assert.equal(parsePolishAmount("100 000,00"), 100000);
  assert.equal(parsePolishAmount("abc"), null);
  assert.equal(formatPkd("62", "01", "Z"), "62.01.Z");
  assert.equal(formatCeidgPkd("6920A"), "69.20.A");
  assert.equal(formatCeidgPkd("4619Z"), "46.19.Z");
});

test("flags a financial statement more than 19 months old", () => {
  assert.equal(isStatementOverdue("2024-12-31", "2026-11-16"), true);
  assert.equal(isStatementOverdue("2025-12-31", "2026-11-16"), false);
});

test("never reads a VIES outage as an invalid number", () => {
  assert.deepEqual(parseViesResponse(fixture("vies-pl-valid.json"), "PL", "5862321443"), {
    country: "PL",
    number: "5862321443",
    valid: true,
    reason: "valid",
    name: "NECTO SPÓŁKA AKCYJNA",
    address: "PL. KASZUBSKI 8 M311\n81-350 GDYNIA",
    requestDate: "2026-11-16T01:14:11.129Z",
  });

  const germany = parseViesResponse(fixture("vies-de-valid-noname.json"), "DE", "811569869");
  assert.equal(germany.valid, true);
  assert.equal(germany.name, null);
  assert.equal(germany.address, null);

  const lithuania = parseViesResponse(fixture("vies-lt-ms-unavailable.json"), "LT", "100001919017");
  assert.equal(lithuania.valid, null);
  assert.equal(lithuania.reason, "unavailable");

  const france = parseViesResponse(fixture("vies-fr-ms-busy.json"), "FR", "40303265045");
  assert.equal(france.valid, null);
  assert.equal(france.reason, "busy");

  const noVat = parseViesResponse(fixture("vies-pl-invalid.json"), "PL", "6783158015");
  assert.equal(noVat.valid, false);
  assert.equal(noVat.reason, "invalid");
  assert.equal(noVat.name, null);

  const wrapped = parseViesResponse(fixture("vies-test-errorwrappers.json"), "DE", "300");
  assert.equal(wrapped.valid, null);
  assert.equal(wrapped.reason, "busy");

  assert.equal(parseViesResponse({ isValid: false, userError: "SOMETHING_NEW" }, "DE", "1").reason, "unavailable");
  assert.equal(parseViesResponse({ isValid: false, userError: "INVALID_INPUT" }, "DE", "1").reason, "input");
  assert.throws(() => parseViesResponse("<html>", "DE", "1"));
});

test("reduces a CEIDG firm to its public fields", () => {
  const check = toCeidgCheck(ceidgFirm);
  assert.deepEqual(check, {
    name: "PRZYKŁADOWA PRACOWNIA TESTOWA JAN PRZYKŁADOWY",
    nip: "1234563218",
    regon: "123456785",
    town: "Gdynia",
    status: "ZAWIESZONY",
    startedOn: "2020-03-01",
    suspendedOn: "2026-10-01",
    resumedOn: null,
    endedOn: null,
    deletedOn: null,
    mainPkd: { code: "69.20.A", label: "Działalność rachunkowo-księgowa" },
    ade: "AE:PL-12345-67890-ABCDE-12",
    publicUrl: null,
  });
  const serialised = JSON.stringify(check);
  for (const secret of ["Testowa", "Przykładowa", "81-000", "kontakt@example.com", "obywatelstwa", "wlasciciel", "JAN\""]) assert.ok(!serialised.includes(secret), secret);
  assert.equal(toCeidgCheck({ status: "AKTYWNY" }), null);
});

const labels: CounterpartySummaryLabels = {
  krs: {
    active: "aktywna",
    liquidation: "w likwidacji",
    bankruptcy: "w upadłości od {date}",
    bankruptcyNoDate: "w upadłości",
    restructuring: "{type} od {date}",
    restructuringNoDate: "{type}",
    deregistered: "wykreślona {date}",
    deregisteredNoDate: "wykreślona",
  },
  ceidg: {
    active: "działa",
    suspended: "zawieszona od {date}",
    suspendedNoDate: "zawieszona",
    pending: "zacznie {date}",
    partnershipOnly: "tylko spółka cywilna",
    deleted: "wykreślona {date}",
    deletedNoDate: "wykreślona",
    other: "{status}",
  },
  whiteList: { active: "czynny VAT", exempt: "zwolniony", other: "VAT {status}", absent: "brak VAT" },
  vies: { valid: "VIES ok", invalid: "VIES nie", unavailable: "VIES {country} nie odpowiada", busy: "VIES zajęty" },
};

const whiteListActive: WhiteListSearch = {
  subject: {
    name: "GETIN NOBLE BANK S.A. W UPADŁOŚCI",
    nip: "1080004850",
    statusVat: "Czynny",
    regon: null,
    krs: "0000304735",
    residenceAddress: null,
    workingAddress: null,
    representatives: [],
    authorizedClerks: [],
    partners: [],
    registrationLegalDate: null,
    registrationDenialDate: null,
    registrationDenialBasis: null,
    restorationDate: null,
    restorationBasis: null,
    removalDate: null,
    removalBasis: null,
    accountNumbers: [],
    hasVirtualAccounts: false,
  },
  requestId: "test-1",
  requestDateTime: "16-11-2026 01:46:16",
};

test("leads the summary with the bankruptcy, then VAT, then VIES", () => {
  const vies = parseViesResponse(fixture("vies-pl-valid.json"), "PL", "1080004850");
  const facts = summaryFacts({ krs: { state: "found", facts: parseKrsFacts(getin, "P") }, whiteList: whiteListActive, vies }, labels, (iso) => iso.split("-").reverse().join("."));
  assert.deepEqual(facts, [
    { key: "krs", tone: "warning", text: "w upadłości od 20.07.2023" },
    { key: "whiteList", tone: "plain", text: "czynny VAT" },
    { key: "vies", tone: "plain", text: "VIES ok" },
  ]);
});

test("summarises a suspended sole trader, a missing VAT entry and a VIES outage", () => {
  const firm = toCeidgCheck(ceidgFirm)!;
  const vies = parseViesResponse(fixture("vies-lt-ms-unavailable.json"), "LT", "100001919017");
  const facts = summaryFacts({ ceidg: [firm], whiteList: { subject: null, requestId: "x", requestDateTime: "" }, vies }, labels, (iso) => iso, () => "Litwa");
  assert.deepEqual(
    facts.map((fact) => [fact.tone, fact.text]),
    [
      ["warning", "zawieszona od 2026-10-01"],
      ["warning", "brak VAT"],
      ["plain", "VIES Litwa nie odpowiada"],
    ],
  );
});

test("the rate guard allows a burst, then blocks until the window ends", () => {
  const now = 1_000_000;
  for (let index = 0; index < 30; index += 1) assert.equal(takeToken("test", "203.0.113.7", now), true);
  assert.equal(takeToken("test", "203.0.113.7", now + 1000), false);
  assert.equal(takeToken("test", "203.0.113.8", now + 1000), true, "another address has its own budget");
  assert.equal(takeToken("other", "203.0.113.7", now + 1000), true, "another route has its own budget");
  assert.equal(takeToken("test", "203.0.113.7", now + 10 * 60_000 + 1), true);
});
