import { strict as assert } from "node:assert";
import { test } from "node:test";
import { formatAccount, isValidAccount, isValidNip, normalizeAccount, normalizeNip, personName, todayInPoland } from "./white-list";

test("normalizes and validates NIP numbers", () => {
  assert.equal(normalizeNip("PL 526-025-02-74"), "5260250274");
  assert.equal(normalizeNip("526 025 02 74"), "5260250274");
  assert.ok(isValidNip("5260250274"));
  assert.ok(isValidNip("9876543210"));
  assert.ok(!isValidNip("5260250275"), "wrong check digit");
  assert.ok(!isValidNip("526025027"), "too short");
  assert.ok(!isValidNip("0000000000"));
  assert.ok(!isValidNip("52602502a4"));
  // 123456789x has check sum 10, which no valid NIP can have.
  assert.ok(!isValidNip("1234567890"));
});

test("normalizes and validates Polish account numbers", () => {
  assert.equal(normalizeAccount("PL59 1010 1010 0075 9122 2200 0000"), "59101010100075912222000000");
  assert.ok(isValidAccount("59101010100075912222000000"));
  assert.ok(isValidAccount("60102010260000042270201111"));
  assert.ok(!isValidAccount("59101010100075912222000001"), "wrong check digits");
  assert.ok(!isValidAccount("5910101010007591222200000"), "25 digits");
});

test("formats an account in groups of four", () => {
  assert.equal(formatAccount("59101010100075912222000000"), "59 1010 1010 0075 9122 2200 0000");
});

test("reads today in Polish time", () => {
  assert.equal(todayInPoland(new Date("2026-12-31T23:30:00Z")), "2027-01-01");
  assert.equal(todayInPoland(new Date("2026-07-01T21:59:00Z")), "2026-07-01");
});

test("names people from the register", () => {
  assert.equal(personName({ companyName: "Firma" }), "Firma");
  assert.equal(personName({ firstName: "Jan", lastName: "Kowalski" }), "Jan Kowalski");
  assert.equal(personName({ nip: "5260250274" }), "5260250274");
});
