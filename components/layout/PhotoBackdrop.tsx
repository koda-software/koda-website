import type { CSSProperties } from "react";

/**
 * A photograph behind a banner, purely decorative.
 *
 * Every page banner used to be gradient-only. That is what made the site read
 * as generated rather than made: the only imagery anywhere was UI mock-ups and
 * icons, so nothing on the page came from the physical world. A photograph
 * under the gradient fixes that without changing a single word of copy.
 *
 * Three things keep it from costing anything:
 *
 * - The variants are pre-built. `images.unoptimized` is on in next.config.ts,
 *   so `next/image` would ship whatever file it was handed at full size; the
 *   AVIF/WebP pairs in `public/photos` are generated ahead of time instead and
 *   selected here through `srcset`.
 * - Desaturation and the slight darkening are baked into the files rather than
 *   applied as a CSS `filter`. A filter over a full-bleed image is repainted by
 *   the compositor on every frame it moves, and a desaturated photo also
 *   compresses smaller - so this is cheaper twice over.
 * - `alt=""` with `aria-hidden` tells a screen reader to skip it. That is the
 *   correct marking for decoration; a missing alt attribute would instead
 *   leave the reader guessing.
 *
 * The scrim on top is not optional. It is what guarantees the banner headline
 * keeps its contrast no matter which photograph sits underneath.
 */

export const photos = {
  /** Open-plan office, backlit windows, people at monitors. */
  team: "zespol-przy-monitorach",
  /** A workstation on a warehouse floor - operational work, which is Opero's subject. */
  operations: "stanowisko-w-magazynie",
  /** Four people going through documents at a table. */
  documents: "przeglad-dokumentow",
  /** A wide, quiet open-plan room. */
  workspace: "biuro-otwarta-przestrzen",
  /** A meeting room seen through glass. */
  meeting: "sala-spotkan",
} as const;

export type PhotoName = keyof typeof photos;

const WIDTHS = [1024, 1600, 2200] as const;

type PhotoBackdropProps = {
  /** Which photograph. Keys are described on `photos` above. */
  photo: PhotoName;
  /**
   * True for the banner in the first viewport. Loads the image eagerly and at
   * high priority, because there it is part of what the reader is waiting for
   * rather than something further down the page.
   */
  priority?: boolean;
  /** How strongly the photograph shows through the scrim. */
  opacity?: number;
  /** Crop, e.g. "60% center". */
  position?: string;
};

export function PhotoBackdrop({
  photo,
  priority = false,
  opacity = 0.34,
  position = "center",
}: PhotoBackdropProps) {
  const name = photos[photo];
  const srcSet = (ext: string) =>
    WIDTHS.map((w) => `/photos/${name}-${w}.${ext} ${w}w`).join(", ");

  const imageStyle: CSSProperties = { objectPosition: position, opacity };

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <picture>
        <source srcSet={srcSet("avif")} sizes="100vw" type="image/avif" />
        <source srcSet={srcSet("webp")} sizes="100vw" type="image/webp" />
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src={`/photos/${name}-1600.webp`}
          alt=""
          width={1600}
          height={1067}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          loading={priority ? "eager" : "lazy"}
          style={imageStyle}
        />
      </picture>
      {/* Darkest on the side the headline sits on, opening up towards the edge
          where the banner carries a visual instead of text. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(11,17,22,0.93) 0%, rgba(11,17,22,0.82) 42%, rgba(11,17,22,0.5) 100%)",
        }}
      />
    </div>
  );
}
