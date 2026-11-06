import type { ReactNode } from "react";

/**
 * How a scene arrives over the one before it.
 *
 * The first proposal used one cut everywhere - a card growing to full frame -
 * and the page read like a slide deck: every section announced itself the
 * same way, so none of them felt like part of a continuous page. Now there is
 * a vocabulary, and each cut is chosen for what the two scenes have to do
 * with each other.
 *
 * - `card`: a rounded card grows into the frame. A new subject.
 * - `wipe`: a diagonal edge sweeps across. The same subject, a new angle.
 * - `curtain`: the scene slides over the previous one, which sinks back.
 *   A step deeper into what was just shown.
 * - `fade`: the colour of the page itself changes. A change of register.
 * - `iris`: a circle opens from the bottom edge. A reveal.
 * - `none`: no cut at all; the page simply continues. The default, and the
 *   one most sections should use.
 */
export type Cut = "card" | "wipe" | "curtain" | "fade" | "iris" | "none";

export function Scene({
  backdrop,
  children,
  className = "",
  cut = "none",
  id,
  kind,
  prev,
  stage = false,
  tone,
}: {
  /** Drawn behind the content, over the scene's own colour. */
  backdrop?: ReactNode;
  children: ReactNode;
  className?: string;
  cut?: Cut;
  id: string;
  /** Which choreography the motion engine runs on this scene, if any. */
  kind?: string;
  /** The tone of the scene above, which shows around an arriving card. */
  prev: "dark" | "light";
  /** Exactly one screen tall in the cinematic layer, so the scene can be staged. */
  stage?: boolean;
  tone: "dark" | "light";
}) {
  return (
    <section
      className={`scene scene--${tone} ${tone === "dark" ? "on-dark" : ""}`.trim()}
      data-cut={cut}
      data-kind={kind}
      data-scene
      data-stage={stage || undefined}
      id={id}
      style={{ ["--prev" as string]: prev === "dark" ? "var(--ink)" : "var(--mist)" }}
    >
      <div className="scene__frame">
        {backdrop}
        <div className={`scene__inner ${className}`.trim()}>{children}</div>
      </div>
    </section>
  );
}
