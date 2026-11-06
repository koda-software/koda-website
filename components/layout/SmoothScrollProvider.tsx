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

export const smoothScrollQuery = "(min-width: 992px) and (hover: hover) and (pointer: fine)";
const smoothSeconds = 0.9;
/* Sections carry enough top padding to clear the fixed header, so they can land at the very top. */
const landing = "top top";

function hashTarget(hash: string) {
  return hash ? document.getElementById(hash.slice(1)) : null;
}

/* For a page opened on a #section: the smoother has to do the placing, not the browser. */
function landOnHash(smoother: ScrollSmootherInstance | null) {
  const target = hashTarget(window.location.hash);
  if (smoother && target) smoother.scrollTo(target, false, landing);
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const smootherRef = useRef<ScrollSmootherInstance | null>(null);
  const scrollTriggerRef = useRef<typeof ScrollTriggerInstance | null>(null);

  useEffect(() => {
    let cancelled = false;
    let creating = false;
    const desktopMedia = window.matchMedia(smoothScrollQuery);
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
      landOnHash(smootherRef.current);
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

  /*
   * The smoother moves the content inside a fixed wrapper with hidden overflow. A # link
   * makes the browser scroll that wrapper directly, and the smoother cannot undo it, so the
   * top of the page is left out of reach. Same-page links scroll here instead, without
   * touching the URL, and anything else that moves the wrapper is put straight back.
   */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const keepWrapperStill = () => {
      if (wrapper.scrollTop) wrapper.scrollTop = 0;
    };

    const scrollToSection = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(link instanceof HTMLAnchorElement) || link.pathname !== window.location.pathname) return;
      const target = hashTarget(link.hash);
      if (!target) return;

      event.preventDefault();
      if (smootherRef.current) {
        smootherRef.current.scrollTo(target, true, landing);
      } else {
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({ behavior: still ? "auto" : "smooth" });
      }
    };

    wrapper.addEventListener("scroll", keepWrapperStill);
    document.addEventListener("click", scrollToSection, true);

    return () => {
      wrapper.removeEventListener("scroll", keepWrapperStill);
      document.removeEventListener("click", scrollToSection, true);
    };
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      smootherRef.current?.scrollTop(0);
      smootherRef.current?.refresh(true, true);
      scrollTriggerRef.current?.refresh();
      landOnHash(smootherRef.current);
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
