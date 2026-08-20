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


/**
 * The KodaSoft ring - the "O" from the wordmark - as a background accent.
 *
 * It replaced a plain `rounded-full` div with a thick white border, which drew
 * the same shape without any of the meaning: an ordinary circle says nothing,
 * while the mark carries the gap in the ring and the quarter arc that make it
 * the company's own. The arc is the colour accent; the ring behind it stays at
 * the same restraint the plain circle had, so the section reads no busier than
 * before.
 *
 * Paths are the two from `public/branding/kodasoft-symbol.svg`, unchanged.
 * Inline rather than an <img> so each part can take its own opacity - an image
 * could only be faded as a whole, and the accent has to stay stronger than the
 * ring for the shape to read at all at this size.
 */
export function KodaSoftRing({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 183 183" fill="none" aria-hidden="true">
      <path
        d="M156.784 31.2161C141.62 16.0518 123.83 7.46718 103.356 5.46222V24.467C118.86 26.359 132.217 32.9951 143.427 44.3189C157.208 58.0995 164.098 74.6475 164.098 93.9911C164.098 113.137 157.208 129.629 143.427 143.409C129.958 157.02 113.41 163.826 93.7553 163.826C74.2422 163.826 57.6942 157.02 44.0831 143.409C32.7593 131.803 26.1514 118.446 24.2594 103.338H5.42407C7.37255 123.896 15.8725 141.687 30.9803 156.766C48.2907 174.246 69.2157 183 93.7553 183C118.295 183 139.305 174.246 156.784 156.766C174.095 139.456 182.764 118.531 182.764 93.9911C182.764 69.4515 174.095 48.5265 156.784 31.2161Z"
        fill="#ffffff"
        fillOpacity="0.045"
      />
      <path
        d="M83.94 0.514029C62.3373 2.56135 43.3354 11.722 27.4877 27.7194C11.7135 43.4625 2.64316 62.3656 0.53089 83.9062L0 89.3309H28.6173L29.1623 85.0047C30.9329 70.9107 37.1313 58.3924 47.5853 47.8028C58.1297 37.2641 70.7101 31.0657 84.9877 29.3742L89.3478 28.8602V8.34336e-05L83.94 0.514029Z"
        fill="var(--color-brand-blue)"
        fillOpacity="0.22"
      />
    </svg>
  );
}
