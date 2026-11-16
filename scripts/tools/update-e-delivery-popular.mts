/**
 * Refreshes lib/tools/e-delivery-popular.json: the e-Delivery addresses of the offices in
 * the tool page's "popular" table, read from the gov.pl list.
 *
 * Vercel's build servers cannot reach www.gov.pl, so the build falls back to this file.
 * Run it from a machine in Poland now and then, and commit the result:
 *
 *   pnpm exec tsx scripts/tools/update-e-delivery-popular.mts
 */
import { writeFileSync } from "node:fs";
import { eDeliveryPage } from "../../content/pl/tools/e-delivery";
import { todayInPoland } from "../../lib/tools/business-days";
import { GOV_REGISTER_PAGE } from "../../lib/tools/e-delivery";
import { extractRegisterData, validateRegister } from "../../lib/tools/e-delivery-register";

const response = await fetch(GOV_REGISTER_PAGE, { headers: { accept: "text/html", "user-agent": "KodaSoft e-delivery sync" } });
if (!response.ok) throw new Error(`gov.pl HTTP ${response.status}`);

const data = extractRegisterData(await response.text());
const result = validateRegister(data, null, todayInPoland(), null);
if (!result.ok) throw new Error(result.error);

const rows: Record<string, (typeof result.rows)[number]> = {};
for (const { regon } of eDeliveryPage.popular.institutions) {
  // Several offices can share a REGON (Warsaw's districts); the main office has the shortest name.
  const best = result.rows.filter((row) => row.regon === regon).sort((a, b) => a.name.length - b.name.length)[0];
  if (!best) throw new Error(`REGON ${regon} is not on the gov.pl list`);
  rows[regon] = best;
}

const file = new URL("../../lib/tools/e-delivery-popular.json", import.meta.url);
writeFileSync(file, `${JSON.stringify({ listDate: result.listDate, rows }, null, 2)}\n`);
console.log(`Wrote ${Object.keys(rows).length} offices from the list of ${result.listDate}.`);
