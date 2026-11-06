import Link from "next/link";
import { routes } from "../content-nav";
import { foundation } from "../content";
import { type Cut, Scene } from "../Scene";

/*
 * The Opero mark, rebuilt from tiles. Each face of the cube is the brand
 * mark's own quadrilateral split into a grid, so the assembled figure is the
 * logo exactly: the same circle clip, the same hexagonal opening, the same
 * three colours on graphite. Points are the cube's 48-unit drawing.
 */
type Point = [number, number];
const faces: Record<"lw" | "rw" | "lid", { quad: [Point, Point, Point, Point]; colour: string }> = {
  lw: { quad: [[8.03, 17.84], [21.35, 25.53], [21.35, 40.91], [8.03, 33.22]], colour: "#F2F5F7" },
  rw: { quad: [[26.65, 25.53], [39.97, 17.84], [39.97, 33.22], [26.65, 40.91]], colour: "#9AA7B1" },
  lid: { quad: [[24, 5.56], [37.32, 13.25], [24, 20.94], [10.68, 13.25]], colour: "#38B6FF" },
};

const lerp = (a: Point, b: Point, t: number): Point => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const at = ([p0, p1, p2, p3]: [Point, Point, Point, Point], u: number, v: number) => lerp(lerp(p0, p1, u), lerp(p3, p2, u), v);
const pts = (points: Point[]) => points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

/** A face cut into an n by n grid of tiles, each tile one module. */
function tiles(quad: [Point, Point, Point, Point], n = 3) {
  const out: string[] = [];
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      const [u0, u1, v0, v1] = [col / n, (col + 1) / n, row / n, (row + 1) / n];
      out.push(pts([at(quad, u0, v0), at(quad, u1, v0), at(quad, u1, v1), at(quad, u0, v1)]));
    }
  }
  return out;
}

/**
 * Fundament.
 *
 * The platform as the Opero mark coming together: data and screens, then
 * processes and automation, then the applications on top, each face sliding
 * home with its modules already seamed into it, and finally the circle -
 * control - drawn around all of it, when the seams close into the logo. Each
 * part of the platform is named next to its own face, in the corners the
 * circle leaves free, so the legend and the figure are one picture. At the
 * end of the chapter the camera goes through the hexagonal opening at the
 * centre of the mark and comes out inside the process chapter.
 */
export function Foundation({
  cut = "wipe",
  dive = true,
  id = "fundament",
  prev = "light",
}: {
  cut?: Cut;
  /** Ends by diving through the mark's opening into the chapter below. */
  dive?: boolean;
  id?: string;
  prev?: "dark" | "light";
} = {}) {
  return (
    <Scene className="foundation" cut={cut} id={id} kind="foundation" prev={prev} stage tone="dark">
      <div className="foundation__copy">
        <h2 className="title">
          <span className="line" data-reveal>
            {foundation.title[0]}
          </span>{" "}
          <span className="line muted" data-reveal>
            {foundation.title[1]}
          </span>
        </h2>
        <p className="lead">{foundation.lead}</p>
        <p className="foundation__note">{foundation.note}</p>
      </div>

      <figure className="mark" data-mark>
        <ul className="parts">
          {foundation.parts.map((part) => (
            <li className={`part part--${part.face}`} data-part={part.face} key={part.id}>
              <Link href={routes.area(part.href)}>
                <span aria-hidden="true" className={`part__swatch part__swatch--${part.face}`} />
                <span className="part__name">{part.name}</span>
                <span className="part__text">{part.text}</span>
              </Link>
            </li>
          ))}
        </ul>
        <svg aria-label="Znak Opero złożony z modułów platformy" role="img" viewBox="0 0 48 48">
          <defs>
            <clipPath id="mark-clip">
              <circle cx="24" cy="24" r="19.2" />
            </clipPath>
            <mask height="48" id="mark-mask" maskUnits="userSpaceOnUse" width="48" x="0" y="0">
              <rect fill="#fff" height="48" width="48" />
              <polygon
                fill="#000"
                points="24.00,12.00 34.39,18.00 34.39,30.00 24.00,36.00 13.61,30.00 13.61,18.00"
                stroke="#000"
                strokeLinejoin="round"
                strokeWidth="1.6"
              />
            </mask>
          </defs>
          {(["lw", "rw", "lid"] as const).map((face) => (
            <g className="mark__face" data-face={face} key={face}>
              <g clipPath="url(#mark-clip)" mask="url(#mark-mask)">
                <polygon
                  className="mark__solid"
                  fill={faces[face].colour}
                  points={pts(faces[face].quad)}
                  stroke={faces[face].colour}
                  strokeLinejoin="round"
                  strokeWidth="2.8"
                />
                {tiles(faces[face].quad).map((tile) => (
                  <polygon className="mark__tile" data-tile fill={faces[face].colour} key={tile} points={tile} />
                ))}
              </g>
            </g>
          ))}
          <circle className="mark__ring" cx="24" cy="24" data-ring fill="none" pathLength={1} r="22.4" />
        </svg>
      </figure>

      {dive ? <span aria-hidden="true" className="portal" data-portal /> : null}
    </Scene>
  );
}
