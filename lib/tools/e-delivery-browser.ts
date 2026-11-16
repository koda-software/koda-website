import { todayInPoland } from "./business-days";
import { GOV_REGISTER_PAGE } from "./e-delivery";
import { extractRegisterData, validateRegister } from "./e-delivery-register";
import { buildIndex, type SearchIndex } from "./e-delivery-search";

/**
 * The gov.pl list read by the visitor's browser.
 *
 * www.gov.pl drops connections from Vercel's servers in every region we tried (iad1, fra1:
 * connect ETIMEDOUT), but serves the page to browsers with `access-control-allow-origin: *`
 * (about 1.5 MB gzipped, 5.4 MB of HTML; max-age=600). So the browser fetches the page once,
 * validates it as the server would and searches it locally. The query never leaves the browser.
 */

export type BrowserList = { index: SearchIndex; listDate: string };

const TIMEOUT_MS = 20_000;

let pending: Promise<BrowserList> | null = null;

/** Loads the list once per page view; a failure clears the cache so the next search tries again. */
export function loadListInBrowser(): Promise<BrowserList> {
  if (pending) return pending;

  const attempt = (async () => {
    // A simple CORS request without credentials: gov.pl allows any origin.
    const response = await fetch(GOV_REGISTER_PAGE, { credentials: "omit", signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!response.ok) throw new Error(`gov.pl HTTP ${response.status}`);
    const checked = validateRegister(extractRegisterData(await response.text()), null, todayInPoland(), null);
    if (!checked.ok) throw new Error(checked.error);
    return { index: buildIndex(checked.rows), listDate: checked.listDate };
  })();

  pending = attempt;
  attempt.catch(() => {
    if (pending === attempt) pending = null;
  });
  return attempt;
}
