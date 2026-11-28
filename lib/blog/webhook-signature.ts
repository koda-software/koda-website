import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Verifies the signature Opero's `HMAC_SHA256` credential puts on an outbound
 * webhook. Opero signs `<unix seconds>.<exact body>` with the shared secret and
 * sends `X-Opero-Signature: t=<unix seconds>,v1=<hex digest>`. The timestamp is
 * part of the signed text, so checking its age makes a captured request useless
 * later, and any change to the body breaks the digest.
 *
 * `X-Opero-Timestamp` repeats `t` for receivers that want it separately; it is
 * not signed on its own, so only the value inside the signature header counts.
 */

export const operoSignatureHeader = "x-opero-signature";

/** How far the signed timestamp may sit from our clock, either way. */
export const signatureToleranceSeconds = 300;

export type SignatureCheck = { ok: true } | { ok: false; reason: "missing" | "malformed" | "expired" | "mismatch" };

type ParsedSignature = { timestamp: number; digests: Buffer[] };

const sha256HexLength = 64;

/**
 * Reads `t=<seconds>,v1=<hex>`. Several `v1` entries are accepted, so a sender
 * could sign with an old and a new secret during a rotation.
 */
export function parseSignatureHeader(header: string): ParsedSignature | null {
  let timestamp: number | null = null;
  const digests: Buffer[] = [];

  for (const part of header.split(",")) {
    const separator = part.indexOf("=");
    if (separator === -1) return null;

    const key = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();

    if (key === "t") {
      if (timestamp !== null || !/^\d{1,12}$/.test(value)) return null;
      timestamp = Number(value);
    } else if (key === "v1") {
      if (value.length !== sha256HexLength || !/^[0-9a-f]+$/i.test(value)) return null;
      digests.push(Buffer.from(value, "hex"));
    }
    // Unknown schemes (v0, v2…) are ignored rather than rejected, as Stripe-style receivers do.
  }

  return timestamp === null || digests.length === 0 ? null : { timestamp, digests };
}

export function verifyOperoSignature(input: {
  secret: string;
  rawBody: string;
  header: string | null;
  nowMs?: number;
  toleranceSeconds?: number;
}): SignatureCheck {
  if (!input.header) return { ok: false, reason: "missing" };

  const parsed = parseSignatureHeader(input.header);
  if (!parsed) return { ok: false, reason: "malformed" };

  const nowSeconds = Math.floor((input.nowMs ?? Date.now()) / 1000);
  if (Math.abs(nowSeconds - parsed.timestamp) > (input.toleranceSeconds ?? signatureToleranceSeconds)) {
    return { ok: false, reason: "expired" };
  }

  const expected = createHmac("sha256", input.secret).update(`${parsed.timestamp}.${input.rawBody}`, "utf8").digest();
  const matches = parsed.digests.some((digest) => digest.length === expected.length && timingSafeEqual(digest, expected));

  return matches ? { ok: true } : { ok: false, reason: "mismatch" };
}
