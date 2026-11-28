import { strict as assert } from "node:assert";
import { createHmac } from "node:crypto";
import { test } from "node:test";
import { parseSignatureHeader, verifyOperoSignature } from "./webhook-signature";

const secret = "test-secret-0123456789abcdef";
const body = JSON.stringify({ typ: "artykul", id: "ff041099", tytuł: "Zażółć gęślą jaźń" });
const now = Date.UTC(2026, 10, 28, 12, 0, 0);
const nowSeconds = Math.floor(now / 1000);

/** Mirrors Opero's signer (opero-back `libs/credentials/src/schemes/hmac-signature.ts`). */
function sign(payload: string, key = secret, timestamp = nowSeconds) {
  const digest = createHmac("sha256", key).update(`${timestamp}.${payload}`, "utf8").digest("hex");
  return `t=${timestamp},v1=${digest}`;
}

const verify = (header: string | null, rawBody = body, nowMs = now) =>
  verifyOperoSignature({ secret, rawBody, header, nowMs });

test("a request signed with the shared secret passes, including non-ASCII bodies", () => {
  assert.deepEqual(verify(sign(body)), { ok: true });
});

test("a signature made with another secret fails", () => {
  assert.deepEqual(verify(sign(body, "another-secret")), { ok: false, reason: "mismatch" });
});

test("a changed body fails", () => {
  assert.deepEqual(verify(sign(body), body.replace("artykul", "kategoria")), { ok: false, reason: "mismatch" });
});

test("a timestamp outside the five-minute window fails, either direction", () => {
  assert.deepEqual(verify(sign(body, secret, nowSeconds - 301)), { ok: false, reason: "expired" });
  assert.deepEqual(verify(sign(body, secret, nowSeconds + 301)), { ok: false, reason: "expired" });
  assert.deepEqual(verify(sign(body, secret, nowSeconds - 300)), { ok: true });
});

test("changing the timestamp in a captured header breaks the signature", () => {
  const replayed = sign(body).replace(`t=${nowSeconds}`, `t=${nowSeconds + 60}`);
  assert.deepEqual(verify(replayed), { ok: false, reason: "mismatch" });
});

test("a missing or malformed header fails without throwing", () => {
  assert.deepEqual(verify(null), { ok: false, reason: "missing" });
  assert.deepEqual(verify(""), { ok: false, reason: "missing" });

  for (const header of [
    "nonsense",
    `t=${nowSeconds}`,
    "v1=" + "a".repeat(64),
    `t=abc,v1=${"a".repeat(64)}`,
    `t=${nowSeconds},v1=xyz`,
    `t=${nowSeconds},v1=${"a".repeat(63)}`,
    `t=${nowSeconds},t=${nowSeconds},v1=${"a".repeat(64)}`,
  ]) {
    assert.deepEqual(verify(header), { ok: false, reason: "malformed" }, header);
  }
});

test("one matching v1 among several is enough, and unknown schemes are ignored", () => {
  const good = sign(body).split(",")[1];
  const header = `t=${nowSeconds}, v0=legacy, v1=${"0".repeat(64)}, ${good}`;

  assert.deepEqual(verify(header), { ok: true });
  assert.equal(parseSignatureHeader(header)?.digests.length, 2);
});
