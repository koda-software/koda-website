import { strict as assert } from "node:assert";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { articlePromoKeys, blogPromos, isArticlePromoKey } from "./promos";

test("a chosen promo fills both feature slots, in each language", () => {
  for (const locale of ["pl", "en"] as const) {
    const promos = blogPromos(locale, "/blog/x", "obieg-faktur-ksef");

    assert.equal(promos.chosen, true);
    assert.equal(promos.feature?.key, "obieg-faktur-ksef");
    assert.equal(promos.inlineFeature, promos.feature);
    assert.ok(promos.feature?.name && promos.feature.description && promos.feature.linkLabel);
    assert.match(promos.feature?.href ?? "", new RegExp(`^/${locale}/`));
  }
});

test("an empty or unknown key falls back to the rotation", () => {
  for (const key of [null, undefined, "", "no-such-promo"]) {
    const promos = blogPromos("pl", "/blog/x", key);

    assert.equal(promos.chosen, false);
    assert.equal(promos.feature?.linkLabel, undefined);
    assert.notEqual(promos.inlineFeature?.key, promos.feature?.key);
  }
});

test("every promo key resolves to copy, a link and an image", () => {
  for (const key of articlePromoKeys) {
    assert.ok(isArticlePromoKey(key));

    for (const locale of ["pl", "en"] as const) {
      const { feature } = blogPromos(locale, "/blog/x", key);
      assert.ok(feature?.name.trim() && feature.description.trim(), `${locale} copy for ${key}`);
      assert.match(feature?.image ?? "", /^\/opero\/promos\/[a-z0-9-]+\.webp$/);
      assert.ok(existsSync(join(process.cwd(), "public", feature?.image ?? "")), `image for ${key}`);
    }
  }
});
