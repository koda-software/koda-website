/**
 * Amounts written out in words, in Polish and English, for the amount-in-words tool.
 *
 * Pure functions with no browser or React dependency, so they run in the
 * widget and in `node --test` alike. Amounts are parsed from the typed string
 * into whole and fractional parts, never through a float, so 0.29 stays 29.
 */

export type CurrencyCode = "PLN" | "EUR" | "USD" | "GBP" | "CHF";

export const currencyCodes: CurrencyCode[] = ["PLN", "EUR", "USD", "GBP", "CHF"];

/** Polish forms: [after exactly 1, after 2-4 (not 12-14), every other number]. */
type PolishForms = [string, string, string];
/** English forms: [singular, plural]. */
type EnglishForms = [string, string];

const polishCurrency: Record<CurrencyCode, { main: PolishForms; minor: PolishForms }> = {
  PLN: { main: ["złoty", "złote", "złotych"], minor: ["grosz", "grosze", "groszy"] },
  EUR: { main: ["euro", "euro", "euro"], minor: ["cent", "centy", "centów"] },
  USD: { main: ["dolar", "dolary", "dolarów"], minor: ["cent", "centy", "centów"] },
  GBP: { main: ["funt", "funty", "funtów"], minor: ["pens", "pensy", "pensów"] },
  CHF: { main: ["frank", "franki", "franków"], minor: ["centym", "centymy", "centymów"] },
};

const englishCurrency: Record<CurrencyCode, { main: EnglishForms; minor: EnglishForms }> = {
  PLN: { main: ["zloty", "zlotys"], minor: ["grosz", "groszy"] },
  EUR: { main: ["euro", "euros"], minor: ["cent", "cents"] },
  USD: { main: ["dollar", "dollars"], minor: ["cent", "cents"] },
  GBP: { main: ["pound", "pounds"], minor: ["penny", "pence"] },
  CHF: { main: ["franc", "francs"], minor: ["centime", "centimes"] },
};

/** The largest whole part the tool writes out: 999 999 999 999. */
const MAX_INTEGER_DIGITS = 12;

export type ParsedAmount =
  | { kind: "empty" }
  | { kind: "error"; reason: "decimals" | "invalid" | "tooLarge" | "negative" }
  | { kind: "ok"; whole: number; minor: number; wholeDigits: string; minorDigits: string };

/** Longest input worth reading; anything longer is not an amount. */
const MAX_INPUT_LENGTH = 64;

/**
 * Reads what people paste or type:
 * - `1 234,56`, `1234.56`, `1.234,56`, `1,234.56`, `1'234.56`, `1 234,56 zł`, `PLN 1234,56`
 * - `100,-` and `100,– zł` (a whole amount, no grosze)
 * - `12 zł 50 gr`, `12 zł 5 gr`
 *
 * The last separator is the decimal point when one or two digits follow it; with three
 * digits after it, it groups thousands.
 */
export function parseAmount(raw: string): ParsedAmount {
  const trimmed = raw.trim();

  if (!trimmed) return { kind: "empty" };
  if (trimmed.length > MAX_INPUT_LENGTH) return { kind: "error", reason: "invalid" };

  /* "12 zł 50 gr": złote and grosze given separately. */
  const split = trimmed.match(/^(\d[\d\s\u00a0\u202f'.]*?)\s*(?:zł|zl|pln)\s*(\d{1,2})\s*(?:gr|groszy|grosze|grosz)\.?$/i);
  if (split) return finishParse(split[1].replace(/[\s\u00a0\u202f'.]/g, ""), split[2].padStart(2, "0"));

  const text = trimmed
    .replace(/[\s\u00a0\u202f\u2009']/g, "")
    .replace(/zł|zl|pln|eur|usd|gbp|chf|€|\$|£/gi, "")
    /* "100,-" and "100,—": a whole amount. */
    .replace(/[.,][-\u2013\u2014]$/, "");

  if (!text) return { kind: "empty" };
  if (/^[-\u2212\u2013]/.test(text)) return { kind: "error", reason: "negative" };

  let whole = text;
  let minor = "";
  const last = Math.max(text.lastIndexOf(","), text.lastIndexOf("."));

  if (last >= 0) {
    const tail = text.slice(last + 1);

    if (tail.length <= 2) {
      whole = text.slice(0, last);
      minor = tail;
    } else if (tail.length !== 3) {
      return { kind: "error", reason: "decimals" };
    }
  }

  whole = whole.replace(/[.,]/g, "");

  if (!/^\d*$/.test(whole) || !/^\d*$/.test(minor) || (!whole && !minor)) {
    return { kind: "error", reason: "invalid" };
  }

  return finishParse(whole, minor);
}

function finishParse(wholeInput: string, minor: string): ParsedAmount {
  const whole = (wholeInput || "0").replace(/^0+(?=\d)/, "");

  if (whole.length > MAX_INTEGER_DIGITS) return { kind: "error", reason: "tooLarge" };

  const minorDigits = minor.padEnd(2, "0");

  return {
    kind: "ok",
    whole: Number(whole),
    minor: Number(minorDigits),
    wholeDigits: whole,
    minorDigits,
  };
}

export type WordOptions = {
  /** Polish only: "jeden tysiąc" rather than "tysiąc" (and the same for milion, miliard). */
  sayOne: boolean;
  capitalize: boolean;
};

/* ---------- Polish ---------- */

const PL_UNITS = ["", "jeden", "dwa", "trzy", "cztery", "pięć", "sześć", "siedem", "osiem", "dziewięć"];
const PL_TEENS = [
  "dziesięć",
  "jedenaście",
  "dwanaście",
  "trzynaście",
  "czternaście",
  "piętnaście",
  "szesnaście",
  "siedemnaście",
  "osiemnaście",
  "dziewiętnaście",
];
const PL_TENS = [
  "",
  "",
  "dwadzieścia",
  "trzydzieści",
  "czterdzieści",
  "pięćdziesiąt",
  "sześćdziesiąt",
  "siedemdziesiąt",
  "osiemdziesiąt",
  "dziewięćdziesiąt",
];
const PL_HUNDREDS = ["", "sto", "dwieście", "trzysta", "czterysta", "pięćset", "sześćset", "siedemset", "osiemset", "dziewięćset"];
const PL_GROUPS: PolishForms[] = [
  ["", "", ""],
  ["tysiąc", "tysiące", "tysięcy"],
  ["milion", "miliony", "milionów"],
  ["miliard", "miliardy", "miliardów"],
];

/** Which Polish form follows `n`: decided by the last two digits, except for exactly 1. */
export function polishForm(n: number): 0 | 1 | 2 {
  if (n === 1) return 0;
  const lastTwo = n % 100;
  const last = n % 10;
  return last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14) ? 1 : 2;
}

function polishTriple(n: number): string {
  const words: string[] = [];
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;

  if (hundreds) words.push(PL_HUNDREDS[hundreds]);

  if (rest >= 10 && rest < 20) {
    words.push(PL_TEENS[rest - 10]);
  } else {
    if (rest >= 20) words.push(PL_TENS[Math.floor(rest / 10)]);
    if (rest % 10) words.push(PL_UNITS[rest % 10]);
  }

  return words.join(" ");
}

export function polishNumber(n: number, sayOne = false): string {
  if (n === 0) return "zero";

  const parts: string[] = [];
  let rest = n;

  for (let group = 0; rest > 0; group += 1) {
    const chunk = rest % 1000;

    if (chunk) {
      if (group === 0) {
        parts.unshift(polishTriple(chunk));
      } else {
        const name = PL_GROUPS[group][polishForm(chunk)];
        parts.unshift(chunk === 1 && !sayOne ? name : `${polishTriple(chunk)} ${name}`);
      }
    }

    rest = Math.floor(rest / 1000);
  }

  return parts.join(" ");
}

export function toPolishWords(amount: Extract<ParsedAmount, { kind: "ok" }>, currency: CurrencyCode, options: WordOptions): string {
  const names = polishCurrency[currency];
  const main = `${polishNumber(amount.whole, options.sayOne)} ${names.main[polishForm(amount.whole)]}`;
  const minor = `${polishNumber(amount.minor)} ${names.minor[polishForm(amount.minor)]}`;

  return finish(`${main} i ${minor}`, options.capitalize);
}

/* ---------- English ---------- */

const EN_SMALL = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const EN_TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
const EN_GROUPS = ["", "thousand", "million", "billion"];

function englishTriple(n: number): string {
  const words: string[] = [];
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;

  if (hundreds) words.push(`${EN_SMALL[hundreds]} hundred`);

  if (rest >= 20) {
    const tens = EN_TENS[Math.floor(rest / 10)];
    words.push(rest % 10 ? `${tens}-${EN_SMALL[rest % 10]}` : tens);
  } else if (rest) {
    words.push(EN_SMALL[rest]);
  }

  return words.join(" ");
}

export function englishNumber(n: number): string {
  if (n === 0) return "zero";

  const parts: string[] = [];
  let rest = n;

  for (let group = 0; rest > 0; group += 1) {
    const chunk = rest % 1000;
    if (chunk) parts.unshift(group ? `${englishTriple(chunk)} ${EN_GROUPS[group]}` : englishTriple(chunk));
    rest = Math.floor(rest / 1000);
  }

  return parts.join(" ");
}

export function toEnglishWords(amount: Extract<ParsedAmount, { kind: "ok" }>, currency: CurrencyCode, options: WordOptions): string {
  const names = englishCurrency[currency];
  const main = `${englishNumber(amount.whole)} ${names.main[amount.whole === 1 ? 0 : 1]}`;
  const minor = `${englishNumber(amount.minor)} ${names.minor[amount.minor === 1 ? 0 : 1]}`;

  return finish(`${main} and ${minor}`, options.capitalize);
}

function finish(text: string, capitalize: boolean) {
  return capitalize ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}
