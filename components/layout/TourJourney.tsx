"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { CSSProperties } from "react";
import type { gsap as GsapNamespace } from "gsap";
import type { ScrollSmoother as ScrollSmootherInstance } from "gsap/ScrollSmoother";
import type { ScrollTrigger as ScrollTriggerInstance } from "gsap/ScrollTrigger";
import styles from "./TourJourney.module.css";

type GsapModule = { gsap: typeof GsapNamespace };
type ScrollTriggerModule = { ScrollTrigger: typeof ScrollTriggerInstance };
type ScrollSmootherModule = { ScrollSmoother: typeof ScrollSmootherInstance };

type TourJourneyProps = {
  label: string;
  /** Each stop's name, and the id of the element on the page that it stands for. */
  stops: Array<{ id: string; label: string }>;
};

/** Only a screen with room for the capsule gets it. Everything else reads the page as it is. */
const JOURNEY_QUERY = "(min-width: 1024px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)";

/**
 * Takes the reader through the product tour: where they are on the route, what is behind and
 * ahead of them, and a way to jump to any stop. The stop they are on stays in full focus while
 * the others step back. It adds nothing to the page's markup, so without it the tour simply reads.
 */
export function TourJourney({ label, stops }: TourJourneyProps) {
  const [enabled, setEnabled] = useState(false);
  const [shown, setShown] = useState(false);
  const [active, setActive] = useState(0);
  const smootherRef = useRef<typeof ScrollSmootherInstance | null>(null);

  useEffect(() => {
    let cancelled = false;
    let media: gsap.MatchMedia | undefined;

    const start = async () => {
      const [{ gsap }, { ScrollTrigger }, { ScrollSmoother }] = await Promise.all([
        import("gsap") as Promise<GsapModule>,
        import("gsap/ScrollTrigger") as Promise<ScrollTriggerModule>,
        import("gsap/ScrollSmoother") as Promise<ScrollSmootherModule>,
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      smootherRef.current = ScrollSmoother;
      media = gsap.matchMedia();
      media.add(JOURNEY_QUERY, () => {
        const places = stops.map((stop) => document.getElementById(stop.id)).filter((place) => place !== null);
        if (places.length === 0) return undefined;

        places.forEach((place) => place.classList.add(styles.focusable));
        setEnabled(true);

        ScrollTrigger.create({
          trigger: places[0],
          endTrigger: places[places.length - 1],
          start: "top 75%",
          end: "bottom 35%",
          onToggle: (self) => setShown(self.isActive),
        });
        places.forEach((place, index) => {
          ScrollTrigger.create({
            trigger: place,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => {
              if (self.isActive) setActive(index);
            },
          });
        });

        return () => {
          places.forEach((place) => place.classList.remove(styles.focusable, styles.dimmed));
          setEnabled(false);
          setShown(false);
        };
      });
    };

    void start();

    return () => {
      cancelled = true;
      media?.revert();
    };
  }, [stops]);

  useEffect(() => {
    if (!enabled) return;
    stops.forEach((stop, index) => {
      document.getElementById(stop.id)?.classList.toggle(styles.dimmed, shown && index !== active);
    });
  }, [active, enabled, shown, stops]);

  const goTo = (id: string) => {
    const place = document.getElementById(id);
    if (!place) return;

    const smoother = smootherRef.current?.get();
    if (smoother) smoother.scrollTo(place, true, "center center");
    else place.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  if (!enabled) return null;

  const progress = { "--progress": stops.length > 1 ? active / (stops.length - 1) : 0 } as CSSProperties;

  return createPortal(
    <nav aria-label={label} className={`${styles.capsule} ${shown ? styles.shown : ""}`.trim()}>
      <ol className={styles.track}>
        <li aria-hidden="true" className={styles.fill} style={progress} />
        {stops.map((stop, index) => (
          <li key={stop.id}>
            <button
              aria-current={index === active ? "step" : undefined}
              aria-label={stop.label}
              className={`${styles.stop} ${index < active ? styles.done : ""} ${index === active ? styles.current : ""}`.trim()}
              onClick={() => goTo(stop.id)}
              title={stop.label}
              type="button"
            />
          </li>
        ))}
      </ol>
      <span className={styles.name} key={active}>
        {stops[active]?.label}
      </span>
    </nav>,
    document.body,
  );
}
