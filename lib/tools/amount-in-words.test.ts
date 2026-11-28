import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  englishNumber,
  parseAmount,
  polishForm,
  polishNumber,
  toEnglishWords,
  toPolishWords,
  type WordOptions,
} from "./amount-in-words";

const words: WordOptions = { sayOne: false, capitalize: false };

function ok(raw: string) {
  const parsed = parseAmount(raw);
  if (parsed.kind !== "ok") throw new Error(`Expected ${raw} to parse, got ${JSON.stringify(parsed)}`);
  return parsed;
}

test("parses the formats people paste", () => {
  for (const raw of ["1 234,56", "1234.56", "1.234,56", "1,234.56", "1 234,56 zł", "1 234,56", "PLN 1234,56"]) {
    const parsed = ok(raw);
    assert.equal(parsed.whole, 1234, raw);
    assert.equal(parsed.minor, 56, raw);
  }

  assert.equal(ok("12,5").minorDigits, "50");
  assert.equal(ok("0,29").minor, 29);
  assert.equal(ok(",99").whole, 0);
  assert.equal(ok("1.234").whole, 1234);
  assert.equal(ok("007").whole, 7);
  assert.equal(ok("999999999999,99").whole, 999_999_999_999);
});

test("reads whole-amount and split notations", () => {
  assert.equal(ok("100,-").whole, 100);
  assert.equal(ok("100,-").minor, 0);
  assert.equal(ok("1 500,– zł").whole, 1500);
  assert.equal(ok("1'234.56").whole, 1234);
  assert.equal(ok("1\u202f234,56").whole, 1234);
  const split = ok("12 zł 5 gr");
  assert.equal(split.whole, 12);
  assert.equal(split.minor, 5);
  assert.equal(ok("1 200 zł 50 gr").whole, 1200);
  assert.equal(ok("1 200 zł 50 gr").minor, 50);
  assert.equal(ok("  7  ").whole, 7);
});

test("rejects what it cannot read", () => {
  assert.deepEqual(parseAmount("−5"), { kind: "error", reason: "negative" });
  assert.deepEqual(parseAmount("-5,00 zł"), { kind: "error", reason: "negative" });
  assert.deepEqual(parseAmount("1".repeat(65)), { kind: "error", reason: "invalid" });
  assert.deepEqual(parseAmount(""), { kind: "empty" });
  assert.deepEqual(parseAmount("  "), { kind: "empty" });
  assert.deepEqual(parseAmount("12,3456"), { kind: "error", reason: "decimals" });
  assert.deepEqual(parseAmount("12a"), { kind: "error", reason: "invalid" });
  assert.deepEqual(parseAmount(","), { kind: "error", reason: "invalid" });
  assert.deepEqual(parseAmount("1000000000000"), { kind: "error", reason: "tooLarge" });
});

test("picks the Polish form from the last two digits", () => {
  assert.deepEqual([1, 2, 4, 5, 12, 14, 21, 22, 24, 25, 102, 112, 1001].map(polishForm), [0, 1, 1, 2, 2, 2, 2, 1, 1, 2, 1, 2, 2]);
});

test("writes Polish numbers", () => {
  assert.equal(polishNumber(0), "zero");
  assert.equal(polishNumber(11), "jedenaście");
  assert.equal(polishNumber(115), "sto piętnaście");
  assert.equal(polishNumber(1000), "tysiąc");
  assert.equal(polishNumber(1000, true), "jeden tysiąc");
  assert.equal(polishNumber(2005), "dwa tysiące pięć");
  assert.equal(polishNumber(12_000), "dwanaście tysięcy");
  assert.equal(polishNumber(21_000), "dwadzieścia jeden tysięcy");
  assert.equal(polishNumber(1_000_001), "milion jeden");
  assert.equal(polishNumber(1_000_001, true), "jeden milion jeden");
  assert.equal(
    polishNumber(999_999_999_999),
    "dziewięćset dziewięćdziesiąt dziewięć miliardów dziewięćset dziewięćdziesiąt dziewięć milionów dziewięćset dziewięćdziesiąt dziewięć tysięcy dziewięćset dziewięćdziesiąt dziewięć",
  );
});

test("writes Polish amounts, grosze always in words after \"i\"", () => {
  assert.equal(toPolishWords(ok("1 234,56"), "PLN", words), "tysiąc dwieście trzydzieści cztery złote i pięćdziesiąt sześć groszy");
  assert.equal(toPolishWords(ok("1"), "PLN", words), "jeden złoty i zero groszy");
  assert.equal(toPolishWords(ok("112,14"), "PLN", words), "sto dwanaście złotych i czternaście groszy");
  assert.equal(toPolishWords(ok("0,01"), "PLN", words), "zero złotych i jeden grosz");
  assert.equal(toPolishWords(ok("22,02"), "EUR", words), "dwadzieścia dwa euro i dwa centy");
  assert.equal(toPolishWords(ok("5"), "GBP", words), "pięć funtów i zero pensów");
  assert.equal(
    toPolishWords(ok("134 232 200"), "PLN", words),
    "sto trzydzieści cztery miliony dwieście trzydzieści dwa tysiące dwieście złotych i zero groszy",
  );
  assert.equal(toPolishWords(ok("1000"), "PLN", { sayOne: true, capitalize: true }), "Jeden tysiąc złotych i zero groszy");
});

test("writes English amounts", () => {
  assert.equal(englishNumber(0), "zero");
  assert.equal(englishNumber(40), "forty");
  assert.equal(englishNumber(1_234), "one thousand two hundred thirty-four");
  assert.equal(englishNumber(2_000_015), "two million fifteen");
  assert.equal(toEnglishWords(ok("1 234,56"), "PLN", words), "one thousand two hundred thirty-four zlotys and fifty-six groszy");
  assert.equal(toEnglishWords(ok("1,01"), "GBP", words), "one pound and one penny");
  assert.equal(toEnglishWords(ok("2,50"), "USD", { ...words, capitalize: true }), "Two dollars and fifty cents");
});

test("writes the minor part as a fraction over 100 when asked", () => {
  const fraction: WordOptions = { ...words, minor: "fraction" };
  assert.equal(toPolishWords(ok("1 234,56"), "PLN", fraction), "tysiąc dwieście trzydzieści cztery złote 56/100");
  assert.equal(toPolishWords(ok("3600"), "PLN", fraction), "trzy tysiące sześćset złotych 00/100");
  assert.equal(toPolishWords(ok("0,05"), "EUR", fraction), "zero euro 05/100");
  assert.equal(toPolishWords(ok("1000"), "PLN", { sayOne: true, capitalize: true, minor: "fraction" }), "Jeden tysiąc złotych 00/100");
  assert.equal(toEnglishWords(ok("3600"), "EUR", fraction), "three thousand six hundred euros 00/100");
  assert.equal(toEnglishWords(ok("1,5"), "USD", fraction), "one dollar 50/100");
});
