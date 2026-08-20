"use client";

import { Children, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent, ReactNode, WheelEvent } from "react";
import type { gsap as GsapNamespace } from "gsap";
import styles from "./SnapCarousel.module.css";

type SnapCarouselProps = {
  ariaLabel?: string;
  autoplay?: boolean;
  children: ReactNode;
  className?: string;
  fadeColor?: string;
  itemClassName?: string;
  pauseMs?: number;
  scrollDurationMs?: number;
  settleMs?: number;
  trackClassName?: string;
  viewportClassName?: string;
};

type GsapModule = {
  gsap: typeof GsapNamespace;
};

const defaultPauseMs = 1000;
const defaultScrollDurationMs = 620;
const defaultSettleMs = 180;

const wrapIndex = (index: number, itemCount: number) => {
  return ((index % itemCount) + itemCount) % itemCount;
};

const getWrappedDelta = (delta: number, itemCount: number) => {
  return ((delta + itemCount / 2) % itemCount + itemCount) % itemCount - itemCount / 2;
};

export function SnapCarousel({
  ariaLabel,
  autoplay = true,
  children,
  className = "",
  fadeColor,
  itemClassName = "",
  pauseMs = defaultPauseMs,
  scrollDurationMs = defaultScrollDurationMs,
  settleMs = defaultSettleMs,
  trackClassName = "",
  viewportClassName = "",
}: SnapCarouselProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const gsapRef = useRef<typeof GsapNamespace | null>(null);
  const autoplayTimerRef = useRef<number | undefined>(undefined);
  const settleTimerRef = useRef<number | undefined>(undefined);
  const scheduleAutoplayRef = useRef<(delay?: number) => void>(() => {});
  const tweenRef = useRef<ReturnType<typeof GsapNamespace.to> | null>(null);
  const currentIndexRef = useRef(0);
  const dragRef = useRef({ active: false, startIndex: 0, startX: 0 });
  const measureRef = useRef({ itemWidth: 0, step: 1, viewportWidth: 0 });
  const reducedMotionRef = useRef(false);
  const slides = useMemo(() => Children.toArray(children), [children]);
  const itemCount = slides.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const carouselStyle = fadeColor
    ? ({ "--snap-carousel-fade-color": fadeColor } as CSSProperties)
    : undefined;

  const clearAutoplay = useCallback(() => {
    window.clearTimeout(autoplayTimerRef.current);
  }, []);

  const clearSettle = useCallback(() => {
    window.clearTimeout(settleTimerRef.current);
  }, []);

  const getGap = useCallback(() => {
    const root = rootRef.current;

    if (!root) {
      return 18;
    }

    const computed = window.getComputedStyle(root);
    const cssGap = computed.getPropertyValue("--snap-carousel-gap").trim();
    const parsedGap = Number.parseFloat(cssGap);

    if (Number.isFinite(parsedGap)) {
      return parsedGap;
    }

    return Math.max(14, Math.min(22, root.clientWidth * 0.015));
  }, []);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const firstItem = itemRefs.current[0];

    if (!viewport || !firstItem) {
      return measureRef.current;
    }

    const itemWidth = firstItem.getBoundingClientRect().width;
    measureRef.current = {
      itemWidth,
      step: itemWidth + getGap(),
      viewportWidth: viewport.clientWidth,
    };

    return measureRef.current;
  }, [getGap]);

  const setPositions = useCallback(
    (index: number) => {
      const gsap = gsapRef.current;

      if (!gsap || itemCount === 0) {
        return;
      }

      const { itemWidth, step, viewportWidth } = measure();
      const centerX = viewportWidth / 2 - itemWidth / 2;
      const roundedIndex = wrapIndex(Math.round(index), itemCount);

      itemRefs.current.forEach((item, itemIndex) => {
        if (!item) {
          return;
        }

        const delta = getWrappedDelta(itemIndex - index, itemCount);
        const distance = Math.abs(delta);
        const scale = Math.max(0.88, 1.07 - Math.min(distance, 1.9) * 0.105);

        gsap.set(item, {
          autoAlpha: 1,
          scale,
          x: centerX + delta * step,
          yPercent: -50,
          zIndex: Math.round(100 - distance * 10),
        });
      });

      setActiveIndex(roundedIndex);
    },
    [itemCount, measure],
  );

  const animateToIndex = useCallback(
    (targetIndex: number, options: { duration?: number; restartAutoplay?: boolean } = {}) => {
      const gsap = gsapRef.current;

      if (!gsap || itemCount <= 1) {
        return;
      }

      tweenRef.current?.kill();
      const state = { index: currentIndexRef.current };
      const duration = options.duration ?? scrollDurationMs / 1000;

      tweenRef.current = gsap.to(state, {
        duration: reducedMotionRef.current ? 0 : duration,
        ease: "power3.inOut",
        index: targetIndex,
        onComplete: () => {
          currentIndexRef.current = targetIndex;
          setPositions(targetIndex);

          if (options.restartAutoplay) {
            scheduleAutoplayRef.current(pauseMs);
          }
        },
        onUpdate: () => {
          currentIndexRef.current = state.index;
          setPositions(state.index);
        },
      });
    },
    [itemCount, pauseMs, scrollDurationMs, setPositions],
  );

  const scheduleAutoplay = useCallback(
    (delay = pauseMs) => {
      clearAutoplay();

      if (!autoplay || reducedMotionRef.current || itemCount <= 1) {
        return;
      }

      autoplayTimerRef.current = window.setTimeout(() => {
        animateToIndex(currentIndexRef.current + 1, { restartAutoplay: true });
      }, delay);
    },
    [animateToIndex, autoplay, clearAutoplay, itemCount, pauseMs],
  );

  useEffect(() => {
    scheduleAutoplayRef.current = scheduleAutoplay;
  }, [scheduleAutoplay]);

  const snapToNearest = useCallback(() => {
    const targetIndex = Math.round(currentIndexRef.current);

    animateToIndex(targetIndex, {
      duration: Math.max(0.24, Math.min(0.42, settleMs / 1000 + 0.16)),
      restartAutoplay: false,
    });
    scheduleAutoplay(scrollDurationMs + pauseMs);
  }, [animateToIndex, pauseMs, scheduleAutoplay, scrollDurationMs, settleMs]);

  const queueSettle = useCallback(() => {
    clearSettle();
    settleTimerRef.current = window.setTimeout(snapToNearest, settleMs);
  }, [clearSettle, settleMs, snapToNearest]);

  useEffect(() => {
    let mounted = true;
    let resizeObserver: ResizeObserver | undefined;

    const setup = async () => {
      const { gsap } = await import("gsap") as GsapModule;

      if (!mounted) {
        return;
      }

      gsapRef.current = gsap;
      reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      measure();
      setPositions(currentIndexRef.current);

      resizeObserver = new ResizeObserver(() => {
        measure();
        setPositions(currentIndexRef.current);
      });

      if (viewportRef.current) {
        resizeObserver.observe(viewportRef.current);
      }

      scheduleAutoplay(pauseMs);
    };

    void setup();

    return () => {
      mounted = false;
      resizeObserver?.disconnect();
      clearAutoplay();
      clearSettle();
      tweenRef.current?.kill();
    };
  }, [clearAutoplay, clearSettle, measure, pauseMs, scheduleAutoplay, setPositions]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 && event.pointerType === "mouse") {
      return;
    }

    clearAutoplay();
    clearSettle();
    tweenRef.current?.kill();
    dragRef.current = {
      active: true,
      startIndex: currentIndexRef.current,
      startX: event.clientX,
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) {
      return;
    }

    event.preventDefault();
    const { step } = measureRef.current;
    const nextIndex = dragRef.current.startIndex - (event.clientX - dragRef.current.startX) / step;

    currentIndexRef.current = nextIndex;
    setPositions(nextIndex);
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active) {
      return;
    }

    dragRef.current.active = false;
    setIsDragging(false);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    snapToNearest();
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || itemCount <= 1) {
      return;
    }

    event.preventDefault();
    clearAutoplay();
    clearSettle();
    tweenRef.current?.kill();

    const { step } = measureRef.current;
    const nextIndex = currentIndexRef.current + event.deltaX / step;

    currentIndexRef.current = nextIndex;
    setPositions(nextIndex);
    queueSettle();
  };

  return (
    <div
      aria-label={ariaLabel}
      className={`${styles.carousel} ${fadeColor ? styles.hasFades : ""} ${className}`.trim()}
      ref={rootRef}
      role={ariaLabel ? "region" : undefined}
      style={carouselStyle}
    >
      <div
        className={`${styles.viewport} ${isDragging ? styles.isDragging : ""} ${viewportClassName}`.trim()}
        onPointerCancel={handlePointerEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onWheel={handleWheel}
        ref={viewportRef}
      >
        <div className={`${styles.track} ${trackClassName}`.trim()}>
          {slides.map((slide, index) => (
            <div
              aria-hidden={index !== activeIndex}
              className={`${styles.item} ${index === activeIndex ? styles.itemActive : ""} ${itemClassName}`.trim()}
              data-active={index === activeIndex ? "true" : undefined}
              data-snap-carousel-item
              key={index}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
            >
              <div className={styles.itemInner}>{slide}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
