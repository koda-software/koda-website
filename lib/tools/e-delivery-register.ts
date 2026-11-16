/**
 * The gov.pl list of public entities that use e-Doręczenia ("Sprawdź, czy Twój urząd
 * korzysta z e-Doręczeń").
 *
 * The page embeds the whole register as JSON in `<pre id="registerData">`, with the CSV
 * text in `data`. "Pobierz plik źródłowy" only saves that text, so the page is the only
 * source. Everything here is pure: the server fetches the page and calls these.
 */
import { ADE_PATTERN } from "./e-delivery";

export const REGISTER_COLUMNS = ["NAZWA_PODMIOTU", "MIEJSCOWOSC", "WOJEWODZTWO", "REGON", "ADE"];

export const VOIVODESHIPS = [
  "DOLNOŚLĄSKIE",
  "KUJAWSKO-POMORSKIE",
  "LUBELSKIE",
  "LUBUSKIE",
  "ŁÓDZKIE",
  "MAŁOPOLSKIE",
  "MAZOWIECKIE",
  "OPOLSKIE",
  "PODKARPACKIE",
  "PODLASKIE",
  "POMORSKIE",
  "ŚLĄSKIE",
  "ŚWIĘTOKRZYSKIE",
  "WARMIŃSKO-MAZURSKIE",
  "WIELKOPOLSKIE",
  "ZACHODNIOPOMORSKIE",
];

/** The default lower bound for a real list (47 909 rows on 13.11.2026). */
export const MIN_REGISTER_ROWS = 40_000;

export type RegisterRow = { name: string; town: string; voivodeship: string; regon: string; ade: string };

export type RegisterData = { fileName: string; columns: string[]; csv: string };

/** Pulls the register JSON out of the gov.pl page. Throws when the block or its keys are missing. */
export function extractRegisterData(html: string): RegisterData {
  const match = /<pre\b[^>]*\bid=["']registerData["'][^>]*>([\s\S]*?)<\/pre>/i.exec(html);
  if (!match) throw new Error("registerData block not found");

  let parsed: unknown;
  try {
    parsed = JSON.parse(decodeEntities(match[1].trim()));
  } catch {
    throw new Error("registerData is not JSON");
  }

  const data = parsed as { fileName?: unknown; columns?: unknown; data?: unknown };
  if (typeof data.fileName !== "string" || typeof data.data !== "string" || !Array.isArray(data.columns)) {
    throw new Error("registerData keys missing");
  }

  return {
    fileName: data.fileName,
    columns: data.columns.map((column) => (typeof column === "object" && column && "name" in column ? String((column as { name: unknown }).name) : String(column))),
    csv: data.data,
  };
}

/** The page has served the JSON raw so far; this only matters if gov.pl starts escaping it. */
function decodeEntities(text: string): string {
  if (!text.startsWith("{") && text.includes("&")) {
    return text.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'").replace(/&amp;/g, "&");
  }
  return text;
}

/** RFC 4180 with ";" as the separator: quoted fields may hold ";", newlines and doubled quotes. */
export function parseSemicolonCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  let index = 0;

  while (index < csv.length) {
    const char = csv[index];

    if (quoted) {
      if (char === '"') {
        if (csv[index + 1] === '"') {
          field += '"';
          index += 2;
          continue;
        }
        quoted = false;
      } else {
        field += char;
      }
      index += 1;
      continue;
    }

    if (char === '"' && field === "") {
      quoted = true;
    } else if (char === ";") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      if (char === "\r" && csv[index + 1] === "\n") index += 1;
    } else {
      field += char;
    }
    index += 1;
  }

  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((cells) => cells.length > 1 || cells[0] !== "");
}

/** "Podmioty_publiczne_13.11.2026.csv" → "2026-11-13". */
export function listDateFromFileName(fileName: string): string | null {
  const match = /^Podmioty_publiczne_(\d{2})\.(\d{2})\.(\d{4})\.csv$/.exec(fileName);
  if (!match) return null;
  const iso = `${match[3]}-${match[2]}-${match[1]}`;
  const date = new Date(`${iso}T12:00:00Z`);
  return Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== iso ? null : iso;
}

export type ValidationResult = { ok: true; rows: RegisterRow[]; listDate: string; dropped: number } | { ok: false; error: string };

/**
 * Checks a fresh copy before it replaces the last good one. Any failure keeps the old
 * copy. Rows with a malformed ADE are dropped, as long as they stay under 0.5%.
 */
export function validateRegister(
  data: RegisterData,
  previousRows: number | null,
  today: string,
  previousListDate: string | null,
  options: { minRows?: number } = {},
): ValidationResult {
  if (data.columns.join(";") !== REGISTER_COLUMNS.join(";")) return { ok: false, error: `columns changed: ${data.columns.join(";")}` };

  const listDate = listDateFromFileName(data.fileName);
  if (!listDate) return { ok: false, error: `unexpected fileName: ${data.fileName}` };
  if (listDate > today) return { ok: false, error: `list date ${listDate} is after today ${today}` };
  if (previousListDate && listDate < previousListDate) return { ok: false, error: `list date ${listDate} is older than ${previousListDate}` };

  const records = parseSemicolonCsv(data.csv);
  const header = records[0]?.map((cell) => cell.trim()).join(";");
  const body = header === REGISTER_COLUMNS.join(";") ? records.slice(1) : records;
  const minRows = options.minRows ?? MIN_REGISTER_ROWS;

  if (body.length < minRows) return { ok: false, error: `only ${body.length} rows` };
  if (previousRows && Math.abs(body.length - previousRows) > previousRows * 0.1) {
    return { ok: false, error: `${body.length} rows against ${previousRows} last time` };
  }

  const rows: RegisterRow[] = [];
  let regonOk = 0;
  const voivodeships = new Set(VOIVODESHIPS);

  for (const cells of body) {
    if (cells.length !== REGISTER_COLUMNS.length) continue;
    const [name, town, voivodeship, regon, ade] = cells.map((cell) => cell.trim());
    if (voivodeship && !voivodeships.has(voivodeship)) return { ok: false, error: `unknown voivodeship: ${voivodeship}` };
    if (/^(\d{9}|\d{14})$/.test(regon)) regonOk += 1;
    if (!name || !ADE_PATTERN.test(ade)) continue;
    rows.push({ name, town, voivodeship, regon, ade });
  }

  const dropped = body.length - rows.length;
  if (rows.length < body.length * 0.995) return { ok: false, error: `${dropped} of ${body.length} rows have no valid ADE` };
  if (regonOk < body.length * 0.99) return { ok: false, error: `${body.length - regonOk} rows have a malformed REGON` };

  return { ok: true, rows, listDate, dropped };
}

/** The stored form: voivodeship as an index (-1 for none, as for embassies) and the ADE without "AE:PL-". */
export type Snapshot = {
  v: 1;
  source: "gov.pl";
  fileName: string;
  listDate: string;
  voivodeships: string[];
  rows: Array<[string, string, number, string, string]>;
};

export function buildSnapshot(rows: RegisterRow[], fileName: string, listDate: string): Snapshot {
  return {
    v: 1,
    source: "gov.pl",
    fileName,
    listDate,
    voivodeships: VOIVODESHIPS,
    rows: rows.map((row) => [row.name, row.town, row.voivodeship ? VOIVODESHIPS.indexOf(row.voivodeship) : -1, row.regon, row.ade.replace(/^AE:PL-/, "")]),
  };
}

export function snapshotRows(snapshot: Snapshot): RegisterRow[] {
  if (snapshot.v !== 1 || !Array.isArray(snapshot.rows)) throw new Error("unknown snapshot format");
  return snapshot.rows.map(([name, town, voivodeship, regon, ade]) => ({
    name,
    town,
    voivodeship: voivodeship >= 0 ? (snapshot.voivodeships[voivodeship] ?? "") : "",
    regon,
    ade: `AE:PL-${ade}`,
  }));
}
