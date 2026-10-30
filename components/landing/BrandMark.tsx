/**
 * The Opero cube, and the job it does across the site.
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
 * Cards now open with a plain index number (`IndexNumber` in
 * LandingPrimitives) - the logo is kept for brand surfaces, not UI chrome.
 * `Cube` stays exported here so the mark has one definition.
 *
 * The geometry is the mark from `public/branding/opero-mark.svg`, halved into
 * a 24x24 box: three faces with the same narrow gap between each, the front
 * corner cut away so the cube reads as an "o", and the outer corners rounded
 * off by a circle (r = 9.6, i.e. 40% of the box). The mark uses a clipPath and
 * a mask; here the cut-away corner is drawn into each face (two overlapping
 * strips, filled as one shape) and the rounding is a CSS `clip-path`, so
 * repeated badges need no ids. The logo tells the faces apart by colour (dark,
 * mid-grey, blue); here each face takes `currentColor` at its own opacity
 * instead, so one definition works on light and dark surfaces. The stroke in
 * the face's own colour with round joins is the mark's softened corners.
 */

const CUBE_LEFT = "M4.02 14.66L10.68 18.51L10.68 20.46L4.02 16.61ZM4.02 16.61L4.02 8.92L5.7 9.89L5.7 17.58Z";
const CUBE_RIGHT = "M18.3 9.9L19.99 8.92L19.99 16.61L18.3 17.59ZM13.33 18.5L19.99 14.66L19.99 16.61L13.33 20.46Z";
const CUBE_TOP = "M5.34 6.63L12 2.78L13.69 3.76L7.03 7.6ZM12 2.78L18.66 6.63L16.97 7.6L10.31 3.76Z";
const CUBE_CLIP = { clipPath: "circle(40% at 50% 50%)" };

function CubeFace({ d, opacity, className }: { d: string; opacity: number; className?: string }) {
  return (
    <path
      className={className}
      d={d}
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinejoin="round"
      opacity={opacity}
    />
  );
}

/**
 * The cube in one colour. The side faces are quieter than the lid, which keeps
 * the mark's reading order (lid first) without its palette. `lidClassName`
 * lets the lid take an accent colour, the way the logo's top face is blue.
 */
export function Cube({
  className,
  lidClassName,
  faded = false,
}: {
  className?: string;
  lidClassName?: string;
  /** Background use: every face pulled back so text can sit on top. */
  faded?: boolean;
}) {
  return (
    <svg className={className} viewBox="0 0 24 24" style={CUBE_CLIP} aria-hidden="true">
      <CubeFace d={CUBE_LEFT} opacity={faded ? 0.2 : 0.85} />
      <CubeFace d={CUBE_RIGHT} opacity={faded ? 0.1 : 0.5} />
      <CubeFace d={CUBE_TOP} opacity={faded ? 0.55 : 1} className={lidClassName} />
    </svg>
  );
}

const KODASOFT_TILE = "M48.00 24.00L47.98 31.33L47.91 33.90L47.80 35.79L47.64 37.33L47.44 38.65L47.19 39.81L46.89 40.83L46.55 41.76L46.15 42.59L45.70 43.34L45.20 44.02L44.64 44.64L44.02 45.20L43.34 45.70L42.59 46.15L41.76 46.55L40.83 46.89L39.81 47.19L38.65 47.44L37.33 47.64L35.79 47.80L33.90 47.91L31.33 47.98L24.00 48.00L16.67 47.98L14.10 47.91L12.21 47.80L10.67 47.64L9.35 47.44L8.19 47.19L7.17 46.89L6.24 46.55L5.41 46.15L4.66 45.70L3.98 45.20L3.36 44.64L2.80 44.02L2.30 43.34L1.85 42.59L1.45 41.76L1.11 40.83L0.81 39.81L0.56 38.65L0.36 37.33L0.20 35.79L0.09 33.90L0.02 31.33L0.00 24.00L0.02 16.67L0.09 14.10L0.20 12.21L0.36 10.67L0.56 9.35L0.81 8.19L1.11 7.17L1.45 6.24L1.85 5.41L2.30 4.66L2.80 3.98L3.36 3.36L3.98 2.80L4.66 2.30L5.41 1.85L6.24 1.45L7.17 1.11L8.19 0.81L9.35 0.56L10.67 0.36L12.21 0.20L14.10 0.09L16.67 0.02L24.00 0.00L31.33 0.02L33.90 0.09L35.79 0.20L37.33 0.36L38.65 0.56L39.81 0.81L40.83 1.11L41.76 1.45L42.59 1.85L43.34 2.30L44.02 2.80L44.64 3.36L45.20 3.98L45.70 4.66L46.15 5.41L46.55 6.24L46.89 7.17L47.19 8.19L47.44 9.35L47.64 10.67L47.80 12.21L47.91 14.10L47.98 16.67Z";

/**
 * The KodaSoft mark - the rounded tile with its "k" and underscore cursor -
 * ghosted as a background accent.
 *
 * It replaced a plain `rounded-full` div with a thick white border, which drew
 * a shape without any of the meaning; the company's own mark makes the same
 * surface specific. The tile and the "k" are drawn as outlines at the same
 * restraint the plain circle had, and the cursor is the colour accent - it has
 * to stay stronger than the rest for the shape to read at all at this opacity.
 *
 * Paths are the ones in `public/branding/kodasoft-mark.svg`, unchanged apart
 * from the tile being stroked rather than filled. Inline rather than an <img>
 * so each part can take its own opacity - an image could only be faded as a
 * whole.
 */
export function KodaSoftMarkAccent({
  className = "",
  accentOpacity = 0.22,
}: {
  className?: string;
  /** Opacity of the blue cursor; the outline stays at a fixed faint white. */
  accentOpacity?: number;
}) {
  return (
    <svg className={className} viewBox="-2 -2 52 52" fill="none" aria-hidden="true">
      <g stroke="#ffffff" strokeOpacity="0.045" strokeLinecap="round" strokeLinejoin="round">
        <path d={KODASOFT_TILE} strokeWidth={2.4} />
        <path transform="translate(10.6 5.6) scale(0.78)" d="M0 4V40M17.5 16L1 30.5M6.6 25.6L18 40" strokeWidth={4.49} />
      </g>
      <rect
        transform="translate(10.6 5.6) scale(0.78)"
        x="23.5"
        y="37.76"
        width="13"
        height="4.49"
        rx="1.73"
        fill="var(--color-brand-blue)"
        fillOpacity={accentOpacity}
      />
    </svg>
  );
}
