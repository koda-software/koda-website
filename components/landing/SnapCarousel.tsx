"use client";

import { Children, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent, ReactNode, WheelEvent } from "react";
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

const defaultPauseMs = 1000;
const defaultScrollDurationMs = 620;
const defaultSettleMs = 180;
const loopCopies = 7;

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
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<number | undefined>(undefined);
  const settleTimerRef = useRef<number | undefined>(undefined);
  const scheduleAutoplayRef = useRef<(delay?: number) => void>(() => {});
  const dragRef = useRef({ active: false, startScroll: 0, startX: 0 });
  const reducedMotionRef = useRef(false);
  const userScrollRef = useRef(false);
  const slides = useMemo(() => Children.toArray(children), [children]);
  const itemCount = slides.length;
  const loopSlides = useMemo(
    () => (itemCount > 1 ? Array.from({ length: loopCopies }, () => slides).flat() : slides),
    [itemCount, slides],
  );
  const middleCopy = Math.floor(loopCopies / 2);
  const middleStartIndex = itemCount > 1 ? itemCount * middleCopy : 0;
  const [activeLoopIndex, setActiveLoopIndexState] = useState(middleStartIndex);
  const activeLoopIndexRef = useRef(middleStartIndex);
  const [isDragging, setIsDragging] = useState(false);
  const carouselStyle = fadeColor
    ? ({ "--snap-carousel-fade-color": fadeColor } as CSSProperties)
    : undefined;

  const setActiveLoopIndex = useCallback((index: number) => {
    activeLoopIndexRef.current = index;
    setActiveLoopIndexState(index);
  }, []);

  const getItemElements = useCallback(() => {
    return Array.from(trackRef.current?.querySelectorAll<HTMLElement>("[data-snap-carousel-item]") ?? []);
  }, []);

  const getCenteredScrollLeft = useCallback(
    (index: number) => {
      const viewport = viewportRef.current;
      const item = getItemElements()[index];

      if (!viewport || !item) {
        return 0;
      }

      return item.offsetLeft + item.offsetWidth / 2 - viewport.clientWidth / 2;
    },
    [getItemElements],
  );

  const scrollToLoopIndex = useCallback(
    (index: number, behavior: ScrollBehavior) => {
      const viewport = viewportRef.current;

      if (!viewport) {
        return;
      }

      viewport.scrollTo({
        behavior,
        left: getCenteredScrollLeft(index),
      });
      setActiveLoopIndex(index);
    },
    [getCenteredScrollLeft, setActiveLoopIndex],
  );

  const normalizeLoopIndex = useCallback(
    (index: number) => {
      if (itemCount <= 1) {
        return index;
      }

      if (index < itemCount) {
        return index + itemCount * middleCopy;
      }

      if (index >= itemCount * (loopCopies - 1)) {
        return index - itemCount * middleCopy;
      }

      return index;
    },
    [itemCount, middleCopy],
  );

  const findNearestLoopIndex = useCallback(() => {
    const viewport = viewportRef.current;
    const items = getItemElements();

    if (!viewport || items.length === 0) {
      return activeLoopIndexRef.current;
    }

    const viewportCenter = viewport.scrollLeft + viewport.clientWidth / 2;

    return items.reduce((nearestIndex, item, index) => {
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const nearest = items[nearestIndex];
      const nearestCenter = nearest.offsetLeft + nearest.offsetWidth / 2;

      return Math.abs(itemCenter - viewportCenter) < Math.abs(nearestCenter - viewportCenter)
        ? index
        : nearestIndex;
    }, 0);
  }, [getItemElements]);

  const clearAutoplay = useCallback(() => {
    window.clearTimeout(autoplayTimerRef.current);
  }, []);

  const clearSettle = useCallback(() => {
    window.clearTimeout(settleTimerRef.current);
  }, []);

  const scheduleAutoplay = useCallback(
    (delay = pauseMs) => {
      clearAutoplay();

      if (!autoplay || reducedMotionRef.current || itemCount <= 1) {
        return;
      }

      autoplayTimerRef.current = window.setTimeout(() => {
        const nextIndex = activeLoopIndexRef.current + 1;

        scrollToLoopIndex(nextIndex, "smooth");
        autoplayTimerRef.current = window.setTimeout(() => {
          const normalizedIndex = normalizeLoopIndex(activeLoopIndexRef.current);

          if (normalizedIndex !== activeLoopIndexRef.current) {
            scrollToLoopIndex(normalizedIndex, "auto");
          }

          scheduleAutoplayRef.current(pauseMs);
        }, scrollDurationMs);
      }, delay);
    },
    [autoplay, clearAutoplay, itemCount, normalizeLoopIndex, pauseMs, scrollDurationMs, scrollToLoopIndex],
  );

  const snapToNearest = useCallback(
    (behavior: ScrollBehavior) => {
      const nearestIndex = findNearestLoopIndex();
      const normalizedIndex = normalizeLoopIndex(nearestIndex);

      scrollToLoopIndex(normalizedIndex, nearestIndex === normalizedIndex ? behavior : "auto");
    },
    [findNearestLoopIndex, normalizeLoopIndex, scrollToLoopIndex],
  );

  const finishUserScroll = useCallback(() => {
    clearSettle();
    userScrollRef.current = false;
    snapToNearest("smooth");
    scheduleAutoplay(scrollDurationMs + pauseMs);
  }, [clearSettle, pauseMs, scheduleAutoplay, scrollDurationMs, snapToNearest]);

  const queueUserSettle = useCallback(() => {
    clearSettle();
    settleTimerRef.current = window.setTimeout(finishUserScroll, settleMs);
  }, [clearSettle, finishUserScroll, settleMs]);

  useEffect(() => {
    scheduleAutoplayRef.current = scheduleAutoplay;
  }, [scheduleAutoplay]);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const frame = window.requestAnimationFrame(() => {
      scrollToLoopIndex(middleStartIndex, "auto");
      scheduleAutoplay(pauseMs);
    });

    return () => {
      window.cancelAnimationFrame(frame);
      clearAutoplay();
      clearSettle();
    };
  }, [clearAutoplay, clearSettle, middleStartIndex, pauseMs, scheduleAutoplay, scrollToLoopIndex]);

  const handleScroll = () => {
    setActiveLoopIndex(findNearestLoopIndex());

    if (userScrollRef.current && !dragRef.current.active) {
      queueUserSettle();
    }
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) {
      return;
    }

    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    clearAutoplay();
    clearSettle();
    userScrollRef.current = true;
    dragRef.current = {
      active: true,
      startScroll: viewport.scrollLeft,
      startX: event.clientX,
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;

    if (!viewport || !dragRef.current.active) {
      return;
    }

    event.preventDefault();
    viewport.scrollLeft = dragRef.current.startScroll - (event.clientX - dragRef.current.startX);
    setActiveLoopIndex(findNearestLoopIndex());
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

    finishUserScroll();
  };

  const handleTouchStart = () => {
    clearAutoplay();
    clearSettle();
    userScrollRef.current = true;
  };

  const handleTouchEnd = () => {
    queueUserSettle();
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) {
      return;
    }

    clearAutoplay();
    userScrollRef.current = true;
    queueUserSettle();
  };

  return (
    <div
      aria-label={ariaLabel}
      className={`${styles.carousel} ${fadeColor ? styles.hasFades : ""} ${className}`.trim()}
      role={ariaLabel ? "region" : undefined}
      style={carouselStyle}
    >
      <div
        className={`${styles.viewport} ${isDragging ? styles.isDragging : ""} ${viewportClassName}`.trim()}
        onPointerCancel={handlePointerEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onScroll={handleScroll}
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onWheel={handleWheel}
        ref={viewportRef}
      >
        <div className={`${styles.track} ${trackClassName}`.trim()} ref={trackRef}>
          {loopSlides.map((slide, index) => {
            const isActive = itemCount > 1
              ? index % itemCount === activeLoopIndex % itemCount
              : index === activeLoopIndex;
            const isClone = itemCount > 1 && Math.floor(index / itemCount) !== middleCopy;

            return (
              <div
                aria-hidden={isClone && !isActive}
                className={`${styles.item} ${isActive ? styles.itemActive : ""} ${itemClassName}`.trim()}
                data-snap-carousel-item
                key={`${index}-${index % Math.max(itemCount, 1)}`}
              >
                <div className={styles.itemInner}>{slide}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
