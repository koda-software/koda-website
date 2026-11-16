/**
 * Polish-aware search over the gov.pl list of public entities.
 *
 * gov.pl filters on the exact substring, so "urząd skarbowy gdynia" finds nothing there.
 * Here every query word only has to start some word of the name or the town, diacritics
 * don't matter, and common abbreviations (ZUS, US, GOPS…) expand to the words they stand for.
 */
import type { RegisterRow } from "./e-delivery-register";

const STOPWORDS = new Set(["W", "WE", "DO", "I", "NA", "IM", "Z", "NR", "UL"]);

/**
 * Abbreviations and what they stand for. The words are stems, because every word only has
 * to start a word in the name: "SPOLECZN" covers SPOŁECZNE, SPOŁECZNEJ and SPOŁECZNYCH.
 */
const ALIASES: Record<string, string[]> = {
  ZUS: ["ZAKLAD UBEZPIECZEN SPOLECZN"],
  KRUS: ["KASA ROLNICZ UBEZPIECZ SPOLECZN"],
  NFZ: ["NARODOW FUNDUSZ ZDROWIA"],
  US: ["URZAD SKARBOW"],
  UM: ["URZAD MIASTA", "URZAD MIEJSKI"],
  UG: ["URZAD GMINY"],
  MOPS: ["MIEJSKI OSRODEK POMOCY SPOLECZN"],
  GOPS: ["GMINNY OSRODEK POMOCY SPOLECZN"],
  MGOPS: ["MIEJSKO GMINNY OSRODEK POMOCY SPOLECZN"],
  PCPR: ["POWIATOWE CENTRUM POMOCY RODZINIE"],
  PUP: ["POWIATOWY URZAD PRACY"],
  KPP: ["KOMENDA POWIATOWA POLICJI"],
  KMP: ["KOMENDA MIEJSKA POLICJI"],
  KWP: ["KOMENDA WOJEWODZKA POLICJI"],
  PSP: ["PANSTWOW STRAZ POZAR"],
  IAS: ["IZBA ADMINISTRACJI SKARBOW"],
  KAS: ["KRAJOWA ADMINISTRACJA SKARBOW"],
  UW: ["URZAD WOJEWODZKI"],
  SP: ["SZKOLA PODSTAWOWA"],
};

/** Uppercase, Ł→L, no diacritics, anything that is not a letter or digit splits words. */
export function normalizeForSearch(text: string): string[] {
  return text
    .toUpperCase()
    .replace(/Ł/g, "L")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .split(/[^A-Z0-9]+/)
    .filter(Boolean);
}

/** Alternatives per query word: the expansions first, then the word itself ("GOPS TYRAWA WOŁOSKA" is a real name). */
export function expandAliases(tokens: string[]): string[][][] {
  return tokens.map((token) => [...(ALIASES[token] ?? []).map((phrase) => phrase.split(" ")), [token]]);
}

export type SearchIndex = {
  rows: RegisterRow[];
  tokens: string[][];
  townTokens: string[][];
  /** The name's words without stopwords, joined by spaces. */
  nameKeys: string[];
  byRegon: Map<string, number[]>;
};

export function buildIndex(rows: RegisterRow[]): SearchIndex {
  const byRegon = new Map<string, number[]>();
  const tokens: string[][] = [];
  const townTokens: string[][] = [];
  const nameKeys: string[] = [];

  rows.forEach((row, index) => {
    const words = normalizeForSearch(row.name);
    tokens.push(words);
    townTokens.push(normalizeForSearch(row.town));
    nameKeys.push(words.filter((word) => !STOPWORDS.has(word)).join(" "));
    const list = byRegon.get(row.regon);
    if (list) list.push(index);
    else byRegon.set(row.regon, [index]);
  });

  return { rows, tokens, townTokens, nameKeys, byRegon };
}

function startsSome(words: string[], prefix: string): boolean {
  for (const word of words) if (word.startsWith(prefix)) return true;
  return false;
}

type Match = { index: number; score: number };

function queryTokens(q: string): string[] {
  return normalizeForSearch(q).filter((token) => !STOPWORDS.has(token));
}

/** Every combination of alternatives, as the joined phrase, capped so a long query stays cheap. */
function phrases(alternatives: string[][][]): string[] {
  let result: string[][] = [[]];
  for (const options of alternatives) {
    result = result.flatMap((prefix) => options.map((words) => [...prefix, ...words])).slice(0, 16);
  }
  return result.map((words) => words.join(" "));
}

function score(index: SearchIndex, rowIndex: number, alternatives: string[][][], tokens: string[], keys: string[]): number | null {
  const name = index.tokens[rowIndex];
  const town = index.townTokens[rowIndex];
  let allInName = true;
  let expanded = false;

  for (const options of alternatives) {
    let inName = false;
    let inEither = false;
    for (const [option, words] of options.entries()) {
      if (words.every((word) => startsSome(name, word))) {
        inName = true;
        inEither = true;
        // Only the last option is the literal word; the others are expansions.
        if (option < options.length - 1) expanded = true;
        break;
      }
      if (words.every((word) => startsSome(name, word) || startsSome(town, word))) inEither = true;
    }
    if (!inEither) return null;
    if (!inName) allInName = false;
  }

  const key = index.nameKeys[rowIndex];
  let total = 0;
  if (keys.includes(key)) total += 100;
  else if (keys.some((phrase) => key.startsWith(phrase))) total += 60;
  if (allInName) total += 30;
  if (expanded) total += 20;
  if (tokens.some((token) => town.includes(token))) total += 15;
  if (index.rows[rowIndex].regon.length === 9) total += 5;
  return total;
}

function run(index: SearchIndex, tokens: string[]): Match[] {
  const alternatives = expandAliases(tokens);
  const keys = phrases(alternatives);
  const matches: Match[] = [];

  for (let rowIndex = 0; rowIndex < index.rows.length; rowIndex += 1) {
    const value = score(index, rowIndex, alternatives, tokens, keys);
    if (value !== null) matches.push({ index: rowIndex, score: value });
  }
  return matches;
}

function compare(index: SearchIndex) {
  return (a: Match, b: Match) =>
    b.score - a.score || index.rows[a.index].name.length - index.rows[b.index].name.length || index.rows[a.index].name.localeCompare(index.rows[b.index].name, "pl");
}

/**
 * The best matches first: an exact name, then a name that starts with the query, then
 * names that hold every word, with bonuses for an expanded abbreviation ("US" as URZĄD
 * SKARBOWY rather than the start of USŁUG), the town and the parent (9-digit) REGON.
 * No hits retries once with long words cut by two letters ("warszawa" → "WARSZA…").
 */
export function searchByText(index: SearchIndex, q: string, offset = 0, limit = 10): { total: number; items: RegisterRow[] } {
  const tokens = queryTokens(q);
  if (!tokens.length) return { total: 0, items: [] };

  let matches = run(index, tokens);
  if (!matches.length && tokens.some((token) => token.length >= 6)) {
    matches = run(index, tokens.map((token) => (token.length >= 6 ? token.slice(0, -2) : token)));
  }

  matches.sort(compare(index));
  return { total: matches.length, items: matches.slice(offset, offset + limit).map((match) => index.rows[match.index]) };
}

/** An exact REGON; a 9-digit one also brings every local unit whose 14-digit REGON starts with it. */
export function searchByRegon(index: SearchIndex, regon: string): RegisterRow[] {
  const exact = index.byRegon.get(regon) ?? [];
  const children: number[] = [];

  if (regon.length === 9) {
    for (const [key, rows] of index.byRegon) {
      if (key.length === 14 && key.startsWith(regon)) children.push(...rows);
    }
  }

  const byName = (a: number, b: number) => index.rows[a].name.localeCompare(index.rows[b].name, "pl");
  return [...[...exact].sort(byName), ...children.sort(byName)].map((rowIndex) => index.rows[rowIndex]);
}

export type HighlightPart = { text: string; match: boolean };

/**
 * Splits `text` into parts for display, marking the start of every word that a query word
 * begins, the way the search matches: "gdyn" marks "GDYN" in "W GDYNI". Polish letters
 * match either way ("lodz" marks "ŁÓDŹ"): each of them normalises to one letter, so the
 * positions line up.
 */
export function highlightParts(text: string, query: string): HighlightPart[] {
  const tokens = normalizeForSearch(query)
    .filter((token) => !STOPWORDS.has(token))
    .sort((a, b) => b.length - a.length);
  const parts: HighlightPart[] = [];
  const push = (chunk: string, match: boolean) => {
    if (!chunk) return;
    const last = parts.at(-1);
    if (last && last.match === match) last.text += chunk;
    else parts.push({ text: chunk, match });
  };

  for (const piece of text.split(/([\p{L}\p{N}]+)/u)) {
    const word = normalizeForSearch(piece)[0];
    const token = word && word.length === piece.length ? tokens.find((candidate) => word.startsWith(candidate)) : undefined;
    if (token) {
      push(piece.slice(0, token.length), true);
      push(piece.slice(token.length), false);
    } else push(piece, false);
  }
  return parts;
}
