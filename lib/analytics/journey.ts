/**
 * Where a visitor entered the site and which page they were on before the
 * current one, so a contact request can name the article or tool behind it.
 *
 * Kept in memory only: nothing is written to the browser's storage, so it needs
 * no consent, and it lasts as long as the visitor moves between pages without a
 * full reload (switching language reloads, and starts again).
 */

export type Journey = {
  /** The first page of the visit. */
  landing: string;
  /** The page before the current one; empty on the first page. */
  previous: string;
  /** The outside site the visit came from, as a host name; empty for direct visits and our own pages. */
  referrer: string;
};

type JourneyState = Journey & { current: string };

/** The host of an outside referrer, without its path or query, which can carry what the visitor searched for. */
export function referrerHost(referrer: string, ownHost: string): string {
  try {
    const host = new URL(referrer).hostname;
    return host && host !== ownHost ? host : "";
  } catch {
    return "";
  }
}

/** The journey after the visitor reaches `path`. Staying on the same page changes nothing. */
export function nextJourney(state: JourneyState | undefined, path: string, referrer: string): JourneyState {
  if (!state) return { landing: path, previous: "", referrer, current: path };
  if (state.current === path) return state;

  return { ...state, previous: state.current, current: path };
}

let state: JourneyState | undefined;

/** Called on every page the visitor opens. */
export function recordPage(path: string) {
  state = nextJourney(state, path, state ? "" : referrerHost(document.referrer, window.location.hostname));
}

export function currentJourney(): Journey {
  return { landing: state?.landing ?? "", previous: state?.previous ?? "", referrer: state?.referrer ?? "" };
}
