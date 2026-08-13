"use client";

import { useEffect } from "react";

/**
 * Reveals anything marked `data-reveal` as it scrolls into view.
 *
 * Mounted once per page rather than wrapped around each block: marking an
 * existing element with an attribute leaves the markup untouched, where
 * wrapping every card in a component meant restructuring JSX that is often
 * several maps deep.
 *
 * Everything is applied inline and only on the client, so the server-rendered
 * page stays fully visible without JavaScript, and nothing in the cascade can
 * outrank the hidden state. Elements sharing a parent stagger by their order,
 * which is what makes a row of cards arrive in sequence.
 *
 * `data-reveal` accepts "up" (default), "left" or "right".
 */
export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (targets.length === 0) return;

    const offsets: Record<string, string> = {
      up: "translateY(22px)",
      left: "translateX(-34px)",
      right: "translateX(34px)",
    };
    const orderInParent = new Map<Element, number>();

    for (const element of targets) {
      const parent = element.parentElement;
      const index = parent ? (orderInParent.get(parent) ?? 0) : 0;
      if (parent) orderInParent.set(parent, index + 1);

      element.style.opacity = "0";
      element.style.transform =
        offsets[element.dataset.reveal || "up"] ?? offsets.up;
      element.style.transition =
        "opacity 0.85s cubic-bezier(0.2,0.7,0.3,1), transform 0.85s cubic-bezier(0.2,0.7,0.3,1)";
      element.style.transitionDelay = `${Math.min(index, 5) * 110}ms`;
    }

    const reveal = (element: HTMLElement) => {
      element.style.opacity = "";
      element.style.transform = "";
      main.unobserve(element);
      settled.unobserve(element);
    };

    /*
     * Fires once the block has properly climbed into the viewport: the bottom
     * of the root is pulled up by a quarter of the screen, so its top edge has
     * to pass 75% of the way up before anything moves. A plain threshold would
     * not do - it is a share of the element, so a tall section would trigger on
     * a sliver of itself.
     */
    const main = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (entry) =>
            entry.isIntersecting && reveal(entry.target as HTMLElement),
        ),
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );
    /*
     * Safety net for the last blocks on a page: once the scroll runs out, their
     * top may never reach that line, and without this they would stay hidden.
     * Anything almost entirely on screen reveals regardless.
     */
    const settled = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (entry) =>
            entry.isIntersecting && reveal(entry.target as HTMLElement),
        ),
      { threshold: 0.9 },
    );

    targets.forEach((element) => {
      main.observe(element);
      settled.observe(element);
    });

    return () => {
      main.disconnect();
      settled.disconnect();
    };
  }, []);

  return null;
}
