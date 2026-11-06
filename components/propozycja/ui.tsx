import type { ReactNode } from "react";
import type { StageState } from "./content";

/*
 * Icons are drawn the way the brand book asks for them: a 2px stroke with
 * round ends, in the colour of the text beside them, in a 24px field. No
 * filled symbols and no icon library, so nothing on the page comes from a
 * set every other product site also uses.
 */
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {children}
    </svg>
  );
}

export const icons = {
  sheet: (
    <Icon>
      <rect height="16" rx="2" width="16" x="4" y="4" />
      <path d="M4 10h16M4 15h16M10 4v16" />
    </Icon>
  ),
  mail: (
    <Icon>
      <rect height="14" rx="2" width="18" x="3" y="5" />
      <path d="m4 7 8 6 8-6" />
    </Icon>
  ),
  app: (
    <Icon>
      <rect height="16" rx="4" width="18" x="3" y="4" />
      <path d="M3 9h18" />
    </Icon>
  ),
  doc: (
    <Icon>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </Icon>
  ),
  module: (
    <Icon>
      <rect height="16" rx="4" width="16" x="4" y="4" />
      <path d="M9 12h6" />
    </Icon>
  ),
  bell: (
    <Icon>
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </Icon>
  ),
  rule: (
    <Icon>
      <path d="M4 6h10M4 12h6M4 18h10" />
      <path d="m16 10 4 2-4 2" />
    </Icon>
  ),
  file: (
    <Icon>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </Icon>
  ),
  clock: (
    <Icon>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Icon>
  ),
  check: (
    <Icon>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </Icon>
  ),
  lock: (
    <Icon>
      <rect height="10" rx="2" width="16" x="4" y="11" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </Icon>
  ),
  arrowRight: (
    <Icon>
      <path d="M5 12h14m0 0-5-5m5 5-5 5" />
    </Icon>
  ),
  chevron: (
    <Icon>
      <path d="m6 9 6 6 6-6" />
    </Icon>
  ),
  plus: (
    <Icon>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  ),
  arrowDown: (
    <Icon>
      <path d="M12 5v14m0 0-5-5m5 5 5-5" />
    </Icon>
  ),
  spark: (
    <Icon>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />
    </Icon>
  ),
  field: (
    <Icon>
      <rect height="8" rx="2" width="18" x="3" y="8" />
      <path d="M7 12h4" />
    </Icon>
  ),
  form: (
    <Icon>
      <rect height="18" rx="2" width="16" x="4" y="3" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </Icon>
  ),
  flow: (
    <Icon>
      <circle cx="5" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
      <path d="M7 12h10" />
    </Icon>
  ),
  chart: (
    <Icon>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </Icon>
  ),
};

/**
 * A process row. `current` is the index of the stage the case sits on; every
 * stage before it is done, every stage after it is still to come.
 */
export function Stages({
  stages,
  current,
  bare = false,
  className = "",
  withCursor = false,
}: {
  stages: readonly string[];
  current: number;
  /** Drawn straight on a dark plane rather than on a white card. */
  bare?: boolean;
  className?: string;
  /** Adds the single sliding blue element the process chapter animates. */
  withCursor?: boolean;
}) {
  return (
    <ol className={`stages ${bare ? "stages--bare" : ""} ${withCursor ? "stages--cursor" : ""} ${className}`.trim()}>
      {withCursor ? <li aria-hidden="true" className="stages__cursor" /> : null}
      {stages.map((stage, index) => {
        const state: StageState = index < current ? "done" : index === current ? "current" : "future";
        return (
          <li className="stage" data-index={index} data-state={state} key={stage}>
            {stage}
          </li>
        );
      })}
    </ol>
  );
}

/** The KodaSoft mark: the site is kodasoft.pl, so the company signs the header and footer. */
export function KodaSoftMark({ on, className = "", label = "KodaSoft" }: { on: "dark" | "light"; className?: string; label?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- a static SVG mark; next/image adds nothing here
    <img
      alt={label}
      className={className}
      height={41}
      src={on === "dark" ? "/propozycja/branding/kodasoft-logo-white.svg" : "/propozycja/branding/kodasoft-logo.svg"}
      width={211}
    />
  );
}

/** The Opero mark, cut for the surface it stands on. */
export function OperoMark({ on, className = "", label = "Opero" }: { on: "dark" | "light"; className?: string; label?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- a static SVG mark; next/image adds nothing here
    <img
      alt={label}
      className={className}
      height={504}
      src={on === "dark" ? "/propozycja/branding/opero-logo-white.svg" : "/propozycja/branding/opero-logo.svg"}
      width={1800}
    />
  );
}
