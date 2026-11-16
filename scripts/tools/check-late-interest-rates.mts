/**
 * Checks lib/tools/late-interest-rates.ts against its sources and prints what is missing:
 *
 * - Monitor Polski announcements of statutory interest (commercial and civil) that the
 *   tables do not list yet, from the Sejm ELI search;
 * - the current NBP reference rate, which the last rows must equal + 10 pp (commercial,
 *   from the half-year it was in force on day one) and + 5,5 pp (civil).
 *
 * Run it in late June, late December and after each change of the reference rate, then
 * update the tables by hand. It is not part of CI, because a date-dependent check would
 * fail unrelated commits:
 *
 *   pnpm exec tsx scripts/tools/check-late-interest-rates.mts
 */
import { COMMERCIAL_KNOWN_UNTIL, RATES_CHECKED_AT, civilRates, commercialRates } from "../../lib/tools/late-interest-rates";

const ELI_SEARCH = "https://api.sejm.gov.pl/eli/acts/search";
const NBP_RATES = "https://static.nbp.pl/dane/stopy/stopy_procentowe.xml";

type EliAct = { ELI: string; title: string; announcementDate: string; displayAddress: string };

async function announcements(title: string): Promise<EliAct[]> {
  const url = `${ELI_SEARCH}?${new URLSearchParams({ publisher: "MP", title, limit: "500" })}`;
  const response = await fetch(url, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error(`ELI search HTTP ${response.status}`);
  const data = (await response.json()) as { items: EliAct[] };
  return data.items;
}

const known = new Set([...commercialRates.map((row) => row.eli), ...civilRates.map((row) => row.eli).filter(Boolean)]);
const since = "2016-01-01";
let problems = 0;

const acts = await announcements("odsetek ustawowych za opóźnienie");
const commercialActs = acts.filter((act) => /transakcjach handlowych/i.test(act.title));
const civilActs = acts.filter((act) => !/transakcjach handlowych/i.test(act.title) && /Sprawiedliwości/i.test(act.title));

for (const [name, list] of [
  ["commercial", commercialActs],
  ["civil", civilActs],
] as const) {
  const missing = list.filter((act) => act.announcementDate >= since && !known.has(act.ELI));
  if (missing.length) {
    problems += missing.length;
    console.log(`\n${name}: ${missing.length} announcement(s) not in the table:`);
    for (const act of missing.sort((left, right) => left.announcementDate.localeCompare(right.announcementDate))) {
      console.log(`  ${act.announcementDate}  ${act.displayAddress}  ${act.ELI}\n    ${act.title}`);
    }
  } else {
    console.log(`${name}: every announcement since ${since} is in the table.`);
  }
}

const xml = await (await fetch(NBP_RATES)).text();
const ref = /id="ref"[\s\S]*?oprocentowanie="([\d,]+)"[\s\S]*?obowiazuje_od="(\d{4}-\d{2}-\d{2})"/.exec(xml);
if (!ref) throw new Error("NBP reference rate not found in stopy_procentowe.xml");
const refBp = Math.round(Number(ref[1].replace(",", ".")) * 100);
console.log(`\nNBP reference rate: ${ref[1]}% since ${ref[2]}`);

const lastCivil = civilRates[civilRates.length - 1];
if (lastCivil.rate !== refBp + 550 || lastCivil.from < ref[2]) {
  problems += 1;
  console.log(`civil: the last row is ${lastCivil.rate} bp from ${lastCivil.from}; expected ${refBp + 550} bp from ${ref[2]}.`);
}

const lastCommercial = commercialRates[commercialRates.length - 1];
console.log(`commercial: the last row starts ${lastCommercial.from} (${lastCommercial.standard} bp); the table is known until ${COMMERCIAL_KNOWN_UNTIL}.`);
const today = new Date().toISOString().slice(0, 10);
if (today > COMMERCIAL_KNOWN_UNTIL) {
  problems += 1;
  console.log(`commercial: today is past ${COMMERCIAL_KNOWN_UNTIL}. Add the new half-year and move COMMERCIAL_KNOWN_UNTIL.`);
}

console.log(`\nTables last checked ${RATES_CHECKED_AT}. ${problems ? `${problems} thing(s) to update.` : "Nothing to update."}`);
process.exitCode = problems ? 1 : 0;
