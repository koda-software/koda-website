"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const wheelMultiplier = 0.82;
const easing = 0.16;
const stopThreshold = 0.45;
const routeSettleMs = 420;

function normalizeDelta(event: WheelEvent) {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) {
    return event.deltaY * 18;
  }

  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
    return event.deltaY * window.innerHeight;
  }

  return event.deltaY;
}

function canNestedScrollerMove(target: EventTarget | null, deltaY: number) {
  if (!(target instanceof Element)) {
    return false;
  }

  let node: Element | null = target;

  while (node && node !== document.documentElement && node !== document.body) {
    const style = window.getComputedStyle(node);
    const canScrollY = /(auto|scroll)/.test(style.overflowY);

    if (canScrollY && node.scrollHeight > node.clientHeight) {
      const maxScrollTop = node.scrollHeight - node.clientHeight;
      const hasRoomDown = deltaY > 0 && node.scrollTop < maxScrollTop;
      const hasRoomUp = deltaY < 0 && node.scrollTop > 0;

      if (hasRoomDown || hasRoomUp) {
        return true;
      }
    }

    node = node.parentElement;
  }

  return false;
}

export function SmoothScrollProvider() {
  const pathname = usePathname();
  const frameRef = useRef<number | undefined>(undefined);
  const targetRef = useRef(0);
  const disabledUntilRef = useRef(0);
  const programmaticUntilRef = useRef(0);

  useEffect(() => {
    const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!supportsFinePointer || prefersReducedMotion) {
      return undefined;
    }

    const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

    const stop = () => {
      if (frameRef.current !== undefined) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = undefined;
      }
    };

    const tick = () => {
      const current = window.scrollY;
      const distance = targetRef.current - current;

      if (Math.abs(distance) < stopThreshold) {
        programmaticUntilRef.current = performance.now() + 120;
        window.scrollTo(0, targetRef.current);
        frameRef.current = undefined;
        return;
      }

      programmaticUntilRef.current = performance.now() + 120;
      window.scrollTo(0, current + distance * easing);
      frameRef.current = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (frameRef.current === undefined) {
        frameRef.current = window.requestAnimationFrame(tick);
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY) ||
        performance.now() < disabledUntilRef.current
      ) {
        return;
      }

      const deltaY = normalizeDelta(event) * wheelMultiplier;

      if (deltaY === 0 || canNestedScrollerMove(event.target, deltaY)) {
        return;
      }

      const limit = maxScroll();

      if (limit <= 0) {
        return;
      }

      event.preventDefault();
      targetRef.current = Math.min(limit, Math.max(0, targetRef.current + deltaY));
      start();
    };

    const stopAndSyncToNativeScroll = () => {
      stop();
      targetRef.current = window.scrollY;
    };

    const handleNativeScroll = () => {
      if (performance.now() < programmaticUntilRef.current) {
        return;
      }

      stopAndSyncToNativeScroll();
    };

    const handlePointerDown = () => {
      disabledUntilRef.current = performance.now() + 160;
      stopAndSyncToNativeScroll();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "ArrowDown" ||
        event.key === "ArrowUp" ||
        event.key === "End" ||
        event.key === "Home" ||
        event.key === "PageDown" ||
        event.key === "PageUp" ||
        event.key === " "
      ) {
        stopAndSyncToNativeScroll();
      }
    };

    targetRef.current = window.scrollY;
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleNativeScroll, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, true);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      stop();
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleNativeScroll);
      window.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    disabledUntilRef.current = performance.now() + routeSettleMs;
    targetRef.current = window.scrollY;

    if (frameRef.current !== undefined) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = undefined;
    }
  }, [pathname]);

  return null;
}
