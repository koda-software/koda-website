"use client";

import Image from "next/image";
import ChevronLeftIcon from "lucide-react/dist/esm/icons/chevron-left.mjs";
import ChevronRightIcon from "lucide-react/dist/esm/icons/chevron-right.mjs";
import { useEffect, useRef, useState } from "react";
import type { gsap as GsapNamespace } from "gsap";
import type { ScrollTrigger as ScrollTriggerInstance } from "gsap/ScrollTrigger";
import type { OperoBuildStoryContent } from "@/content/types";
import styles from "./OperoBuildStory.module.css";

type GsapModule = { gsap: typeof GsapNamespace };
type ScrollTriggerModule = { ScrollTrigger: typeof ScrollTriggerInstance };

const magnifierPlacementClass = {
  model: styles.magnifierModel,
  form: styles.magnifierForm,
  record: styles.magnifierRecord,
  automation: styles.magnifierAutomation,
  workflow: styles.magnifierWorkflow,
  documents: styles.magnifierDocuments,
  ksef: styles.magnifierKsef,
  ai: styles.magnifierAi,
  reports: styles.magnifierReports,
  communication: styles.magnifierCommunication,
};

export function OperoBuildStory({
  content,
  stepIndexes,
}: {
  content: OperoBuildStoryContent;
  stepIndexes: readonly number[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const previousIndexRef = useRef(0);
  const firstRenderRef = useRef(true);
  const storySteps = stepIndexes.map((index) => content.steps[index]);
  const storyAriaLabel =
    storySteps.length === 1 ? storySteps[0].title : content.ariaLabel;

  useEffect(() => {
    const root = rootRef.current;

    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    let context: gsap.Context | undefined;
    let cancelled = false;

    const setup = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap") as Promise<GsapModule>,
        import("gsap/ScrollTrigger") as Promise<ScrollTriggerModule>,
      ]);

      if (cancelled) {
        return;
      }

      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        const frame = root.querySelector<HTMLElement>("[data-story-frame]");
        const magnifier = root.querySelector<HTMLElement>(
          "[data-story-magnifier]",
        );
        const popover = root.querySelector<HTMLElement>(
          "[data-story-popover]",
        );

        if (!frame) {
          return;
        }

        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            once: true,
            start: "top 82%",
            trigger: frame,
          },
        });

        timeline.fromTo(
          frame,
          { autoAlpha: 0, scale: 0.985, y: 28 },
          {
            autoAlpha: 1,
            duration: 0.82,
            scale: 1,
            y: 0,
          },
          0,
        );

        if (magnifier) {
          gsap.set(magnifier, {
            autoAlpha: 0,
            scale: 0.68,
          });

          timeline.to(
            magnifier,
            {
              autoAlpha: 1,
              duration: 0.58,
              ease: "back.out(1.7)",
              scale: 1,
            },
            "-=0.12",
          );
        }

        if (popover) {
          gsap.set(popover, {
            autoAlpha: 0,
            scale: 0.86,
            y: 18,
          });

          timeline.to(
            popover,
            {
              autoAlpha: 1,
              duration: 0.62,
              ease: "back.out(1.55)",
              scale: 1,
              y: 0,
            },
            "-=0.14",
          );
        }
      }, root);
    };

    void setup();

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, []);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return undefined;
    }

    const root = rootRef.current;
    const previousIndex = previousIndexRef.current;
    previousIndexRef.current = activeIndex;

    if (!root) {
      return undefined;
    }

    const panels = Array.from(
      root.querySelectorAll<HTMLElement>("[data-story-panel]"),
    );
    const previousPanel = panels[previousIndex];
    const nextPanel = panels[activeIndex];
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      panels.forEach((panel, index) => {
        panel.style.opacity = index === activeIndex ? "1" : "0";
        panel.style.visibility = index === activeIndex ? "visible" : "hidden";
      });
      return undefined;
    }

    let cancelled = false;

    const animate = async () => {
      const { gsap } = (await import("gsap")) as GsapModule;

      if (cancelled || !previousPanel || !nextPanel) {
        return;
      }

      const nextMagnifier = root.querySelector<HTMLElement>(
        "[data-story-magnifier]",
      );
      const nextPopover = root.querySelector<HTMLElement>(
        "[data-story-popover]",
      );

      gsap.killTweensOf(panels);
      gsap.set(previousPanel, {
        scale: 1,
        zIndex: 1,
      });
      gsap.set(nextPanel, {
        autoAlpha: 0,
        scale: 1,
        zIndex: 2,
      });
      if (nextMagnifier) {
        gsap.set(nextMagnifier, {
          autoAlpha: 0,
          scale: 0.72,
        });
      }
      if (nextPopover) {
        gsap.set(nextPopover, {
          autoAlpha: 0,
          scale: 0.88,
          y: 16,
        });
      }

      const timeline = gsap
        .timeline()
        .to(
          previousPanel,
          { autoAlpha: 0, duration: 0.3, ease: "power1.out" },
          0,
        )
        .to(
          nextPanel,
          { autoAlpha: 1, duration: 0.42, ease: "power1.out" },
          0.06,
        );

      if (nextMagnifier) {
        timeline.to(
          nextMagnifier,
          {
            autoAlpha: 1,
            duration: 0.48,
            ease: "back.out(1.6)",
            scale: 1,
          },
          0.18,
        );
      }
      if (nextPopover) {
        timeline.to(
          nextPopover,
          {
            autoAlpha: 1,
            duration: 0.5,
            ease: "back.out(1.5)",
            scale: 1,
            y: 0,
          },
          0.18,
        );
      }
    };

    void animate();

    return () => {
      cancelled = true;
    };
  }, [activeIndex]);

  const showPrevious = () => {
    setActiveIndex((current) =>
      current === 0 ? storySteps.length - 1 : current - 1,
    );
  };

  const showNext = () => {
    setActiveIndex((current) => (current + 1) % storySteps.length);
  };

  const activeMagnifier = storySteps[activeIndex].image.magnifier;
  const activePopover = storySteps[activeIndex].image.popover;

  return (
    <div
      aria-label={storyAriaLabel}
      className={styles.root}
      ref={rootRef}
      role="group"
    >
      <div className={styles.frame} data-story-frame>
        <div className={styles.frameBar}>
          <span className={styles.frameDots} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className={styles.frameTitle} aria-live="polite">
            {storySteps[activeIndex].title}
          </span>
          <span className={styles.counter}>
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(storySteps.length).padStart(2, "0")}
          </span>
        </div>

        <div
          className={styles.viewport}
          style={{
            aspectRatio: `${storySteps[activeIndex].image.width} / ${storySteps[activeIndex].image.height}`,
          }}
        >
          {storySteps.map((step, index) => (
            <div
              aria-hidden={activeIndex !== index}
              className={styles.panel}
              data-story-panel
              key={step.image.src}
            >
              <span
                className={`${styles.imageClip} ${
                  step.image.trimBottom ? styles.imageClipBottomTrim : ""
                }`}
              >
                <Image
                  alt={step.image.alt}
                  className={styles.image}
                  height={step.image.height}
                  sizes="(min-width: 1100px) 62vw, (min-width: 861px) 60vw, 100vw"
                  src={step.image.src}
                  width={step.image.width}
                />
              </span>
            </div>
          ))}
        </div>

        {activeMagnifier ? (
          <span
            className={`${styles.magnifier} ${magnifierPlacementClass[activeMagnifier.placement]}`}
            data-story-magnifier
            key={activeMagnifier.src}
          >
            <span className={styles.magnifierLens}>
              <Image
                alt={activeMagnifier.alt}
                className={styles.magnifierImage}
                height={activeMagnifier.height}
                sizes="(min-width: 1200px) 290px, (min-width: 981px) 22vw, (min-width: 561px) 27vw, 148px"
                src={activeMagnifier.src}
                width={activeMagnifier.width}
              />
            </span>
          </span>
        ) : null}

        {activePopover ? (
          <span
            className={styles.popover}
            data-story-popover
            key={activePopover.src}
          >
            <Image
              alt={activePopover.alt}
              className={styles.popoverImage}
              height={activePopover.height}
              sizes="(min-width: 1200px) 560px, (min-width: 901px) 43vw, 92vw"
              src={activePopover.src}
              width={activePopover.width}
            />
          </span>
        ) : null}

        {storySteps.length > 1 ? (
          <div className={styles.controls}>
            <button
              aria-label={content.previousLabel}
              onClick={showPrevious}
              type="button"
            >
              <ChevronLeftIcon aria-hidden="true" />
            </button>
            <button
              aria-label={content.nextLabel}
              onClick={showNext}
              type="button"
            >
              <ChevronRightIcon aria-hidden="true" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
