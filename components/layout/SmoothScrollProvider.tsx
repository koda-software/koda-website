"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useRef } from "react";
import type { gsap as GsapNamespace } from "gsap";
import type { ScrollSmoother as ScrollSmootherInstance } from "gsap/ScrollSmoother";
import type { ScrollTrigger as ScrollTriggerInstance } from "gsap/ScrollTrigger";

type ScrollSmootherModule = {
  ScrollSmoother: typeof ScrollSmootherInstance;
};

type ScrollTriggerModule = {
  ScrollTrigger: typeof ScrollTriggerInstance;
};

type GsapModule = {
  gsap: typeof GsapNamespace;
};

type SmoothScrollProviderProps = {
  children: ReactNode;
};

const desktopQuery = "(min-width: 992px) and (hover: hover) and (pointer: fine)";
const smoothSeconds = 0.9;

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const smootherRef = useRef<ScrollSmootherInstance | null>(null);
  const scrollTriggerRef = useRef<typeof ScrollTriggerInstance | null>(null);

  useEffect(() => {
    let cancelled = false;
    let creating = false;
    const desktopMedia = window.matchMedia(desktopQuery);
    const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");

    const killSmoother = () => {
      smootherRef.current?.kill();
      smootherRef.current = null;
    };

    const createSmoother = async () => {
      if (creating || smootherRef.current || !wrapperRef.current || !contentRef.current) {
        return;
      }

      creating = true;
      const [{ gsap }, { ScrollTrigger }, { ScrollSmoother }] = await Promise.all([
        import("gsap") as Promise<GsapModule>,
        import("gsap/ScrollTrigger") as Promise<ScrollTriggerModule>,
        import("gsap/ScrollSmoother") as Promise<ScrollSmootherModule>,
      ]);
      creating = false;

      if (cancelled || !desktopMedia.matches || reducedMotionMedia.matches || !wrapperRef.current || !contentRef.current) {
        return;
      }

      gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
      scrollTriggerRef.current = ScrollTrigger;
      ScrollSmoother.get()?.kill();
      smootherRef.current = ScrollSmoother.create({
        wrapper: wrapperRef.current,
        content: contentRef.current,
        smooth: smoothSeconds,
        smoothTouch: false,
        effects: false,
        normalizeScroll: false,
        ignoreMobileResize: true,
      });
      ScrollTrigger.refresh();
    };

    const syncSmoother = () => {
      if (desktopMedia.matches && !reducedMotionMedia.matches) {
        void createSmoother();
      } else {
        killSmoother();
      }
    };

    syncSmoother();
    desktopMedia.addEventListener("change", syncSmoother);
    reducedMotionMedia.addEventListener("change", syncSmoother);

    return () => {
      cancelled = true;
      desktopMedia.removeEventListener("change", syncSmoother);
      reducedMotionMedia.removeEventListener("change", syncSmoother);
      killSmoother();
    };
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      smootherRef.current?.scrollTop(0);
      smootherRef.current?.refresh(true, true);
      scrollTriggerRef.current?.refresh();
    }, 80);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [pathname]);

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <div id="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
