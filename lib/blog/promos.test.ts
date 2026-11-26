import { strict as assert } from "node:assert";
import { test } from "node:test";
import { blogPromos, systemFeaturePromo } from "./promos";
import type { SystemFeatureRow } from "./types";

const fileId = "0b6f0b1e-3c1d-4f7a-9a39-5d4b8f2b7c11";

function feature(id: string, overrides: Partial<SystemFeatureRow> = {}): SystemFeatureRow {
  return {
    id,
    tytul: `Feature ${id}`,
    opis: `What ${id} does.`,
    obraz: fileId,
    obraz_alt: null,
    link: `/pl/opero/${id}`,
    etykieta_linku: null,
    ...overrides,
  };
}

const pool = ["a", "b", "c", "d"].map((id) => feature(id));

test("an article's own feature fills both slots", () => {
  const chosen = feature("chosen", { etykieta_linku: "Zobacz" });
  const promos = blogPromos("pl", "/blog/x", { features: pool, chosen });

  assert.equal(promos.chosen, true);
  assert.equal(promos.feature?.key, "chosen");
  assert.equal(promos.inlineFeature, promos.feature);
  assert.equal(promos.feature?.linkLabel, "Zobacz");
  assert.match(promos.feature?.image ?? "", new RegExp(fileId));
});

test("without a pick, two different features rotate from the Opero records", () => {
  for (const chosen of [null, undefined, feature("broken", { link: "javascript:alert(1)" })]) {
    const promos = blogPromos("pl", "/blog/x", { features: pool, chosen });

    assert.equal(promos.chosen, false);
    assert.ok(pool.some((row) => row.id === promos.feature?.key));
    assert.ok(pool.some((row) => row.id === promos.inlineFeature?.key));
    assert.notEqual(promos.inlineFeature?.key, promos.feature?.key);
    assert.ok(promos.feature?.linkLabel, "records always carry a link label");
  }
});

test("with no usable records, the feature pages fill the rotation", () => {
  const promos = blogPromos("en", "/blog/x", { features: [feature("x", { tytul: " " })] });

  assert.equal(promos.chosen, false);
  assert.match(promos.feature?.href ?? "", /^\/en\//);
  assert.match(promos.feature?.image ?? "", /^\/opero\//);
  assert.equal(promos.feature?.linkLabel, undefined);
});

test("a record without an image or with an unsafe link", () => {
  const plain = systemFeaturePromo("en", feature("plain", { obraz: null, opis: null }));
  assert.equal(plain?.image, undefined);
  assert.equal(plain?.description, "");
  assert.equal(plain?.linkLabel, "See how it works in Opero");

  assert.equal(systemFeaturePromo("pl", feature("x", { link: "//evil.example" })), null);
  assert.equal(systemFeaturePromo("pl", feature("x", { link: null })), null);
  assert.equal(systemFeaturePromo("pl", feature("x", { link: "https://opero.pl/x" }))?.href, "https://opero.pl/x");
});
