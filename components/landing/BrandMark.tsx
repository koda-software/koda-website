/**
 * The Opero hexagon, and the two jobs it does across the site.
 *
 * The pages used to carry 49 different icons from a general-purpose icon set.
 * Eight of them earn their place - the industry marks on the Solutions page,
 * where a factory, a hard hat and a bank each name a different sector at a
 * glance. The rest illustrated abstractions: a lightning bolt beside
 * "automation", a brain beside "AI", a shield beside "permissions". None of
 * them told a reader anything the heading had not already said, and a pile of
 * unrelated pictograms is one of the clearest signals that a layout was
 * assembled rather than designed.
 *
 * They are replaced by one shape the company already owns, in two consistent
 * roles: a small outline as the node on every section label, and a numbered
 * badge on every card in a grid. Four identical hexagons in a row would have
 * been just as empty as four unrelated icons, which is why the card version
 * carries the index - it gives the eye an order to follow and the shape a
 * reason to be there.
 *
 * The path is the mark from `public/branding/opero-logo.svg`, normalised to a
 * 24x24 box. The softened vertices are part of the mark: each edge stops short
 * and the corner is drawn as a quadratic curve, which is what keeps it from
 * reading as a plain geometric polygon.
 */

const HEX_PATH =
  "M 10.4 2.32 Q 12 1.4 13.6 2.32 L 19.6 5.78 Q 21.2 6.7 21.2 8.55 L 21.2 15.45 Q 21.2 17.3 19.6 18.22 L 13.6 21.68 Q 12 22.6 10.4 21.68 L 4.4 18.22 Q 2.8 17.3 2.8 15.45 L 2.8 8.55 Q 2.8 6.7 4.4 5.78 Z";

export function Hexagon({
  className,
  filled = false,
  strokeWidth = 1.35,
}: {
  className?: string;
  filled?: boolean;
  strokeWidth?: number;
}) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={HEX_PATH}
        fill={filled ? "currentColor" : "none"}
        stroke={filled ? "none" : "currentColor"}
        strokeWidth={filled ? 0 : strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The card badge: the hexagon outline with the card's position inside it.
 *
 * Decorative, so it is hidden from screen readers - the number repeats nothing
 * a reader needs, and the cards already carry their own headings in order.
 */
export function HexIndex({
  index,
  invert = false,
}: {
  /** Zero-based position in the grid; rendered one-based and zero-padded. */
  index: number;
  /** For cards on a dark surface. */
  invert?: boolean;
}) {
  return (
    <span
      className="relative grid h-11 w-11 shrink-0 place-items-center"
      aria-hidden="true"
    >
      <Hexagon
        className={`absolute inset-0 h-full w-full ${
          invert ? "text-white/25" : "text-[var(--color-blue)]/30"
        }`}
      />
      <span
        className={`relative font-sans text-[0.78rem] font-semibold leading-none ${
          invert ? "text-[var(--color-cyan)]" : "text-[var(--color-blue)]"
        }`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    </span>
  );
}

