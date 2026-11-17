"use client";

import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right.mjs";
import RotateCcwIcon from "lucide-react/dist/esm/icons/rotate-ccw.mjs";
import type { FeaturePillar, HomeContent } from "@/content/types";
import { smoothScrollQuery } from "@/components/layout/SmoothScrollProvider";
import { useStageScale } from "@/components/layout/useStageScale";
import { AccessDemo } from "./AccessDemo";
import { BuildDemo } from "./BuildDemo";
import { RuleDemo } from "./RuleDemo";
import { loadGsap, STAGE_HEIGHT, STAGE_WIDTH, StageContext } from "./stage";
import { ViewsDemo } from "./ViewsDemo";
import demoStyles from "./demos.module.css";
import styles from "./PillarStory.module.css";

type StageLabels = HomeContent["pillars"]["stage"];

/**
 * Where the story is pinned and scrolled through: a screen wide and tall enough to hold the
 * chapter list and the stage side by side, for a reader who has not asked for less motion.
 */
const PINNED_QUERY = "(min-width: 1024px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)";
/** Room for the stage, but no pin: the chapters are picked by hand. */
const PICKED_QUERY = "(min-width: 640px)";
const STILL_QUERY = "(prefers-reduced-motion: reduce)";
/** Viewport heights of scrolling from one chapter to the next while pinned. */
const SCREENS_PER_CHAPTER = 0.45;

/**
 * Pinned: scrolling moves through the chapters, and the stage keeps showing the one in
 * focus. Picked: the same layout, unpinned, with the chapters chosen by clicking them.
 * Listed: a phone, where there is no room for the stage and every chapter is simply open,
 * which is also the server markup until the page knows which of the three it is.
 */
type Mode = "listed" | "picked" | "pinned";

/**
 * The four pillars as one scroll story. One app window stays on screen while the chapters
 * change around it; each chapter's demo plays itself with a cursor the first time it comes
 * on stage, then hands over to the reader.
 */
export function PillarStory({ items, stage }: { items: FeaturePillar[]; stage: StageLabels }) {
  const [mode, setMode] = useState<Mode>("listed");
  const [still, setStill] = useState(false);
  const [smooth, setSmooth] = useState(false);
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [replays, setReplays] = useState(() => items.map(() => 0));
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTriggerType | null>(null);
  const { scale, scalerRef } = useStageScale(STAGE_WIDTH);
  const stageContext = useMemo(() => ({ canvasRef, cursorRef, still }), [still]);
  const count = items.length;

  useEffect(() => {
    let cancelled = false;
    let media: gsap.MatchMedia | undefined;

    void loadGsap().then((gsap) => {
      if (cancelled) return;
      media = gsap.matchMedia();
      // `any` always matches: GSAP only calls back when one of the conditions does, and a phone matches none of the rest.
      media.add({ any: "all", picked: PICKED_QUERY, pinned: PINNED_QUERY, smooth: smoothScrollQuery, still: STILL_QUERY }, (context) => {
        const { picked, pinned, smooth: smoothed, still: reduced } = context.conditions as Record<string, boolean>;
        setStill(reduced);
        setSmooth(smoothed);
        setMode(pinned ? "pinned" : picked ? "picked" : "listed");
      });
    });

    return () => {
      cancelled = true;
      media?.revert();
    };
  }, []);

  // The pin is measured from the pinned layout, so it is made only once that layout is on the page.
  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    if (mode !== "pinned" || !root || !pin) return undefined;

    let cancelled = false;
    let dispose: (() => void) | undefined;

    void Promise.all([loadGsap(), import("gsap/ScrollTrigger")]).then(([gsap, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const trigger = ScrollTrigger.create({
        anticipatePin: 1,
        end: () => `+=${window.innerHeight * SCREENS_PER_CHAPTER * (count - 1)}`,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          root.style.setProperty("--progress", self.progress.toFixed(4));
          // A chapter opens when the rail reaches its number, not halfway there, so the line always
          // finishes its run before the next chapter takes over. The small allowance absorbs rounding
          // at the snap points. Bails out without a render while the chapter stays the same.
          setActive(Math.min(count - 1, Math.floor(self.progress * (count - 1) + 0.02)));
        },
        pin,
        // Under ScrollSmoother the page itself is transformed, so a fixed pin would have nothing to hold on to.
        pinType: smooth ? "transform" : "fixed",
        snap: {
          delay: 0.08,
          duration: { max: 0.6, min: 0.25 },
          ease: "power2.inOut",
          snapTo: 1 / (count - 1),
        },
        start: "top top",
        trigger: root,
      });
      triggerRef.current = trigger;
      ScrollTrigger.sort();
      ScrollTrigger.refresh();

      dispose = () => {
        trigger.kill();
        triggerRef.current = null;
        root.style.removeProperty("--progress");
      };
    });

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [count, mode, smooth]);

  // A demo only plays while the window is properly on screen, not while it is still coming up.
  useEffect(() => {
    const target = windowRef.current;
    if (!target) return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.55 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const goTo = (index: number) => {
    const trigger = triggerRef.current;
    if (!trigger) {
      setActive(index);
      return;
    }
    // Pinned, a chapter is a scroll position, so picking one scrolls there and the story follows.
    const top = trigger.start + ((trigger.end - trigger.start) * index) / (count - 1);
    if (!smooth) {
      window.scrollTo({ behavior: "smooth", top });
      return;
    }
    // Under ScrollSmoother a single jump, whether `scrollTo` or the smoother's own, can leave the
    // page standing where it was once the snap has had its say. Tweening the smoother's position
    // scrolls frame by frame instead, which the smoother and the snap both follow.
    void Promise.all([loadGsap(), import("gsap/ScrollSmoother")]).then(([gsap, { ScrollSmoother }]) => {
      const smoother = ScrollSmoother.get();
      if (!smoother) {
        window.scrollTo({ behavior: "smooth", top });
        return;
      }
      const distance = Math.abs(smoother.scrollTop() - top);
      gsap.killTweensOf(smoother);
      gsap.to(smoother, {
        duration: Math.min(1.1, 0.45 + distance / 1600),
        ease: "power2.inOut",
        overwrite: true,
        scrollTop: top,
      });
    });
  };

  const replay = () => setReplays((current) => current.map((value, index) => (index === active ? value + 1 : value)));
  const progress = mode === "pinned" ? undefined : count > 1 ? active / (count - 1) : 0;
  const playing = (index: number) => mode !== "listed" && inView && index === active;
  const scenes = [
    items[0]?.animation ? <BuildDemo active={playing(0)} content={items[0].animation.dashboard} replay={replays[0]} tryLabel={stage.tryLabel} /> : null,
    items[1]?.viewsAnimation ? <ViewsDemo active={playing(1)} content={items[1].viewsAnimation} replay={replays[1]} tryLabel={stage.tryLabel} /> : null,
    items[2]?.ruleAnimation ? <RuleDemo active={playing(2)} content={items[2].ruleAnimation} replay={replays[2]} tryLabel={stage.tryLabel} /> : null,
    items[3]?.permissionAnimation ? <AccessDemo active={playing(3)} content={items[3].permissionAnimation} replay={replays[3]} tryLabel={stage.tryLabel} /> : null,
  ];

  return (
    <div
      className={styles.root}
      data-mode={mode}
      ref={rootRef}
      style={{ "--steps": Math.max(count - 1, 1), ...(progress === undefined ? {} : { "--progress": progress }) } as CSSProperties}
    >
      <div className={styles.pin} ref={pinRef}>
        <div className={styles.layout}>
          <div className={styles.chapters}>
            <ol aria-label={stage.chaptersLabel}>
              {items.map((pillar, index) => (
                <li
                  className={styles.chapter}
                  data-active={index === active ? "" : undefined}
                  key={pillar.title}
                  style={{ "--index": index } as CSSProperties}
                >
                  <h3 className={styles.chapterTitle}>
                    <button aria-expanded={mode === "listed" ? undefined : index === active} onClick={() => goTo(index)} type="button">
                      <span className={styles.chapterNumber}>{String(index + 1).padStart(2, "0")}</span>
                      <span>{pillar.title}</span>
                    </button>
                  </h3>
                  <div className={styles.chapterBody}>
                    <div className={styles.chapterInner}>
                      <p>{pillar.description}</p>
                      <ul>
                        {pillar.capabilities.map((capability) => (
                          <li key={capability}>{capability}</li>
                        ))}
                      </ul>
                      {pillar.link ? (
                        <Link className={styles.chapterLink} href={pillar.link.href}>
                          <span>{pillar.link.label}</span>
                          <ArrowRightIcon strokeWidth={1.8} />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div aria-hidden="true" className={styles.stageColumn}>
            <div className={styles.window} ref={windowRef}>
              <div className={styles.windowBar}>
                <span className={styles.lights}>
                  <i />
                  <i />
                  <i />
                </span>
                <span className={styles.crumbs}>
                  <span>Opero</span>
                  <span className={styles.crumbSlash}>/</span>
                  <span className={styles.crumbTrack}>
                    {items.map((pillar, index) => (
                      <span className={styles.crumb} data-on={index === active ? "" : undefined} key={pillar.title}>
                        {pillar.navLabel ?? pillar.title}
                      </span>
                    ))}
                  </span>
                </span>
                <span className={styles.pips}>
                  {items.map((pillar, index) => (
                    <i data-on={index === active ? "" : undefined} key={pillar.title} />
                  ))}
                </span>
                {still ? null : (
                  <button className={styles.replay} onClick={replay} tabIndex={-1} title={stage.replayLabel} type="button">
                    <RotateCcwIcon strokeWidth={1.9} />
                    <span>{stage.replayLabel}</span>
                  </button>
                )}
              </div>

              <div className={styles.viewport} ref={scalerRef} style={{ aspectRatio: `${STAGE_WIDTH} / ${STAGE_HEIGHT}` }}>
                <StageContext.Provider value={stageContext}>
                  <div
                    className={demoStyles.canvas}
                    ref={canvasRef}
                    style={scale === null ? { opacity: 0 } : { transform: `scale(${scale})` }}
                  >
                    {scenes.map((scene, index) => (
                      <div
                        className={`${demoStyles.scene} ${index === active ? demoStyles.sceneOn : index < active ? demoStyles.scenePast : ""}`}
                        key={items[index]?.title ?? index}
                      >
                        {scene}
                      </div>
                    ))}
                    <div className={demoStyles.cursor} ref={cursorRef}>
                      <svg viewBox="0 0 24 24">
                        <path d="M5 3.2v16.1c0 .6.7.9 1.1.5l3.9-3.7 2.6 5.6c.2.4.7.6 1.1.4l2-.9c.4-.2.6-.7.4-1.1l-2.6-5.5 5.4-.4c.6 0 .9-.8.4-1.2L6.2 2.6c-.5-.3-1.2 0-1.2.6Z" fill="#101828" stroke="#fff" strokeLinejoin="round" strokeWidth="1.4" />
                      </svg>
                    </div>
                  </div>
                </StageContext.Provider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
