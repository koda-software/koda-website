import type { ReactNode } from "react";

/** The follow-up clause of a headline steps back. Opacity, so that it works on mist and on graphite alike. */
export const titleClauseClass = "opacity-[0.58]";

/**
 * A headline's claim and its follow-up, cut at the title's own first break: the end of a sentence
 * ("Eight capabilities. One Opero.") or a spaced hyphen ("Reports - decisions on data"). A title
 * with no such break is all claim.
 */
export function splitTitle(title: string): [string, string] {
  const match = title.match(/^(.+?(?:[.?!]\s+|\s-\s))(\S.*)$/);
  return match ? [match[1], match[2]] : [title, ""];
}

/** A two-tone headline: the claim in full, the follow-up muted. The text itself does not change. */
export function TwoTone({ render = (text) => text, text }: { render?: (text: string) => ReactNode; text: string }) {
  const [claim, clause] = splitTitle(text);

  return (
    <>
      {render(claim)}
      {clause ? <span className={titleClauseClass}>{render(clause)}</span> : null}
    </>
  );
}
