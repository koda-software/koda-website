import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { EDeliveryError, detectQuery, findAde, isListStale, isValidRegon, krsResponseKind, krsUrl, padKrs, parseCeidgResponse, parseKrsOdpis, preferCurrentFirms, trimRegon } from "./e-delivery";

/* Real odpisy from api-krs.ms.gov.pl (2026-11-16), trimmed to naglowekA and the name, identifiers, seat and ADE of dział 1. */
const fixture = (name: string) => JSON.parse(readFileSync(new URL(`./fixtures/${name}`, import.meta.url), "utf8")) as unknown;
const necto = fixture("krs-0000690425-p.json");
const wosp = fixture("krs-0000030897-s.json");
const foreign = fixture("krs-0000599047-p.json");
const noAde = fixture("krs-0000502116-p.json");

test("detects KRS numbers, with or without the leading zeros", () => {
  assert.deepEqual(detectQuery("0000690425"), { kind: "krs", krs: "0000690425" });
  assert.deepEqual(detectQuery("690425"), { kind: "krs", krs: "0000690425" });
  assert.deepEqual(detectQuery("KRS: 690425"), { kind: "krs", krs: "0000690425" });
  assert.deepEqual(detectQuery("krs 0000030897"), { kind: "krs", krs: "0000030897" });
  assert.equal(padKrs("690425"), "0000690425");
});

test("detects NIP numbers and rejects a bad check digit", () => {
  assert.deepEqual(detectQuery("5862321443"), { kind: "nip", nip: "5862321443" });
  assert.deepEqual(detectQuery("PL 586-232-14-43"), { kind: "nip", nip: "5862321443" });
  assert.deepEqual(detectQuery("NIP: 586 232 14 43"), { kind: "nip", nip: "5862321443" });
  assert.deepEqual(detectQuery("5862321444"), { kind: "invalid", reason: "nip" });
});

test("detects REGON numbers, including 9-digit ones that start with 0", () => {
  assert.deepEqual(detectQuery("368023770"), { kind: "regon", regon: "368023770" });
  assert.deepEqual(detectQuery("00102119700187"), { kind: "regon", regon: "00102119700187" });
  // ZUS Centrala: a valid REGON with a leading zero is a REGON, not a short KRS number.
  assert.deepEqual(detectQuery("000017756"), { kind: "regon", regon: "000017756" });
  // KRS writes the 9-digit REGON with "00000" on the end.
  assert.deepEqual(detectQuery("36802377000000"), { kind: "regon", regon: "368023770" });
  assert.deepEqual(detectQuery("REGON 368023771"), { kind: "invalid", reason: "regon" });
  assert.deepEqual(detectQuery("368023771"), { kind: "invalid", reason: "regon" });
});

test("detects names and rejects too-short input", () => {
  assert.deepEqual(detectQuery("urząd skarbowy gdynia"), { kind: "text", text: "urząd skarbowy gdynia" });
  assert.deepEqual(detectQuery("a"), { kind: "invalid", reason: "short" });
  assert.deepEqual(detectQuery("12345678901"), { kind: "invalid", reason: "number" });
});

test("validates REGON check digits", () => {
  for (const regon of ["368023770", "000598486", "00102119700187", "00001775600514"]) {
    assert.ok(isValidRegon(regon), regon);
    const changed = regon.slice(0, -1) + String((Number(regon.at(-1)) + 1) % 10);
    assert.ok(!isValidRegon(changed), changed);
  }
  assert.ok(!isValidRegon("36802377000000"), "the KRS form fails the 14-digit check");
  assert.equal(trimRegon("36802377000000"), "368023770");
  assert.equal(trimRegon("00102119700187"), "00102119700187");
});

test("parses a KRS business register odpis", () => {
  const entity = parseKrsOdpis(necto, "P");
  assert.equal(entity.name, "NECTO SPÓŁKA AKCYJNA");
  assert.equal(entity.legalForm, "SPÓŁKA AKCYJNA");
  assert.equal(entity.krs, "0000690425");
  assert.equal(entity.nip, "5862321443");
  assert.equal(entity.regon, "368023770");
  assert.equal(entity.seat, "GDYNIA, POMORSKIE");
  assert.equal(entity.ade, "AE:PL-12236-59999-IBJFI-32");
  assert.equal(entity.stateDate, "2026-07-12");
  assert.equal(entity.extractedAt, "2026-11-16T00:21:00");
  assert.equal(entity.foreign, false);
});

test("parses a foundation from the S register without a REGON", () => {
  const entity = parseKrsOdpis(wosp, "S");
  assert.equal(entity.ade, "AE:PL-28547-16383-UFHUH-23");
  assert.equal(entity.regon, null);
  assert.equal(entity.register, "S");
  assert.equal(entity.name, "FUNDACJA WIELKA ORKIESTRA ŚWIĄTECZNEJ POMOCY");
});

test("parses a foreign entrepreneur's branch", () => {
  const entity = parseKrsOdpis(foreign, "P");
  assert.equal(entity.foreign, true);
  assert.equal(entity.ade, "AE:PL-43073-51310-ASIWU-30");
  assert.equal(entity.seat, "WARSZAWA, MAZOWIECKIE");
});

test("returns no ADE when the record has none", () => {
  assert.equal(parseKrsOdpis(noAde, "P").ade, null);
  assert.throws(() => parseKrsOdpis({ odpis: {} }, "P"), EDeliveryError);
});

test("flags a list more than four business days old", () => {
  // Monday 16.11.2026: 11.11 is a holiday, so four business days back is Monday 9.11.
  assert.equal(isListStale("2026-11-13", "2026-11-16"), false);
  assert.equal(isListStale("2026-11-09", "2026-11-16"), false);
  assert.equal(isListStale("2026-11-06", "2026-11-16"), true);
});

test("builds the KRS API URL", () => {
  assert.equal(krsUrl("690425", "P"), "https://api-krs.ms.gov.pl/api/krs/OdpisAktualny/0000690425?rejestr=P&format=json");
});

/*
 * The keys are those of live CEIDG v3 `/firma?nip=` responses (checked 2026-11-16); the
 * values are made up, so no real sole trader's data is committed.
 */
const syntheticCeidg = {
  firma: [
    {
      id: "5f0c1b2a-0000-4000-8000-000000000001",
      nazwa: "Przykładowa Firma Testowa",
      adresDzialalnosci: { ulica: "ul. Testowa", budynek: "1", miasto: "Gdynia", kod: "81-001", wojewodztwo: "POMORSKIE" },
      adresKorespondencyjny: { ulica: "ul. Testowa", budynek: "1", miasto: "Gdynia" },
      wlasciciel: { imie: "Jan", nazwisko: "Testowy", nip: "5862321443", regon: "368023770" },
      dataRozpoczecia: "2020-01-02",
      status: "AKTYWNY",
      numerStatusu: 1,
      adresDoreczenElektronicznych: "AE:PL-11111-22222-ABCDE-33",
      link: "https://dane.biznes.gov.pl/api/ceidg/v3/firma/5f0c1b2a-0000-4000-8000-000000000001",
    },
    {
      id: "5f0c1b2a-0000-4000-8000-000000000002",
      nazwa: "Dawna Firma Testowa",
      adresDzialalnosci: { miasto: "Sopot" },
      wlasciciel: { imie: "Jan", nazwisko: "Testowy", nip: "5862321443", regon: "368023770" },
      dataRozpoczecia: "2012-03-01",
      dataZakonczenia: "2019-12-31",
      dataWykreslenia: "2020-01-15",
      status: "WYKRESLONY",
      numerStatusu: 4,
      link: "https://dane.biznes.gov.pl/api/ceidg/v3/firma/5f0c1b2a-0000-4000-8000-000000000002",
    },
  ],
};

test("parses a CEIDG v3 response and keeps only public fields", () => {
  const [firm] = parseCeidgResponse(syntheticCeidg);
  assert.deepEqual(
    { ...firm },
    {
      name: "Przykładowa Firma Testowa",
      nip: "5862321443",
      regon: "368023770",
      town: "Gdynia",
      status: "AKTYWNY",
      ade: "AE:PL-11111-22222-ABCDE-33",
      publicUrl: null,
      detailUrl: "https://dane.biznes.gov.pl/api/ceidg/v3/firma/5f0c1b2a-0000-4000-8000-000000000001",
    },
  );
  assert.ok(!JSON.stringify(firm).includes("Testowy"), "no owner name fields beyond the firm name");
});

test("puts current CEIDG entries first and drops deleted ones when a current one exists", () => {
  const firms = parseCeidgResponse(syntheticCeidg);
  assert.deepEqual(firms.map((firm) => firm.status), ["AKTYWNY", "WYKRESLONY"]);
  assert.deepEqual(preferCurrentFirms([...firms].reverse()).map((firm) => firm.name), ["Przykładowa Firma Testowa"]);
  const deletedOnly = firms.filter((firm) => firm.status === "WYKRESLONY");
  assert.deepEqual(preferCurrentFirms(deletedOnly).map((firm) => firm.name), ["Dawna Firma Testowa"]);
  assert.deepEqual(
    preferCurrentFirms([{ status: "ZAWIESZONY" }, { status: "AKTYWNY" }]).map((firm) => firm.status),
    ["AKTYWNY", "ZAWIESZONY"],
  );
});

test("finds a synthetic CEIDG ADE under another key or nested", () => {
  const nested = { nazwa: "X", adresDoDoreczenElektronicznych: { adres: "AE:PL-11111-22222-ABCDE-33" } };
  assert.equal(findAde(nested), "AE:PL-11111-22222-ABCDE-33");
  const elsewhere = { nazwa: "X", kontakt: { skrzynka: "ae:pl-11111-22222-abcde-33" } };
  assert.equal(findAde(elsewhere), "AE:PL-11111-22222-ABCDE-33");
  assert.equal(findAde({ nazwa: "X", status: "AKTYWNY" }), null);
});

test("parses a synthetic CEIDG detail response and refuses foreign detail links", () => {
  const [firm] = parseCeidgResponse({ firma: { nazwa: "Detal", link: "https://example.com/firma/1", id: "abc-1" } });
  assert.equal(firm.detailUrl, "https://dane.biznes.gov.pl/api/ceidg/v3/firma/abc-1");
  assert.equal(firm.ade, null);
  assert.deepEqual(parseCeidgResponse({ firma: [] }), []);
  assert.throws(() => parseCeidgResponse({ error: "x" }), EDeliveryError);
});

test("reads a struck-off KRS entity from a 204", () => {
  assert.equal(krsResponseKind(200), "odpis");
  assert.equal(krsResponseKind(204), "removed");
  assert.equal(krsResponseKind(404), "absent");
  assert.equal(krsResponseKind(429), "limit");
  assert.equal(krsResponseKind(500), "unavailable");
});
