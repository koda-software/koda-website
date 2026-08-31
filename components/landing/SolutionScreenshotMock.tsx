"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { gsap as GsapNamespace } from "gsap";

type GsapModule = {
  gsap: typeof GsapNamespace;
};

type SolutionScreenshotMockProps = {
  alt?: string;
  className?: string;
  glowVariant?: "default" | "hero";
  height?: number;
  perspectiveVariant?: "default" | "hero";
  priority?: boolean;
  sizes?: string;
  src?: string;
  width?: number;
};

const finalTransform = "rotateX(4deg) rotateY(5deg) rotateZ(-2deg) scale(0.96)";
const heroFinalTransform =
  "rotateX(5.5deg) rotateY(-10deg) rotateZ(-2.5deg) scale(0.98)";
const stackedFinalTransform = "rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(0.88)";
const startTransform = "translateY(34px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(0.92)";

export function SolutionScreenshotMock({
  alt = "Opero visual rule editor",
  className = "",
  glowVariant = "default",
  height = 1355,
  perspectiveVariant = "default",
  priority = false,
  sizes = "(min-width: 1200px) 65rem, 112vw",
  src = "/hero/opero-solution-screenshot-static.png",
  width = 1828,
}: SolutionScreenshotMockProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const screenshotRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const screenshot = screenshotRef.current;
    const glow = glowRef.current;

    if (!root || !screenshot) {
      return undefined;
    }

    const stacked = window.matchMedia("(max-width: 1200px)").matches;
    const heroPerspective = perspectiveVariant === "hero";
    const targetTransform = stacked
      ? stackedFinalTransform
      : heroPerspective
        ? heroFinalTransform
        : finalTransform;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      screenshot.style.opacity = "1";
      screenshot.style.transform = targetTransform;
      if (glow) {
        glow.style.opacity = "1";
      }
      return undefined;
    }

    let context: gsap.Context | undefined;
    let cancelled = false;

    let hasStarted = false;

    const setup = async () => {
      const { gsap } = await (import("gsap") as Promise<GsapModule>);

      if (cancelled) {
        return;
      }

      context = gsap.context(() => {
        gsap.set(root, {
          perspective: 1300,
          perspectiveOrigin: heroPerspective ? "58% 44%" : "42% 42%",
        });
        gsap.set(screenshot, {
          transformOrigin: heroPerspective ? "48% 72%" : "18% 78%",
          transformStyle: "preserve-3d",
          willChange: "transform, opacity",
        });

        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to(screenshot, {
            autoAlpha: 1,
            duration: 0.42,
            scale: stacked ? 0.86 : 0.92,
            y: 0,
          })
          .to(
            screenshot,
            {
              duration: 1.05,
              rotateX: stacked ? 0 : heroPerspective ? 5.5 : 4,
              rotateY: stacked ? 0 : heroPerspective ? -10 : 5,
              rotateZ: stacked ? 0 : heroPerspective ? -2.5 : -2,
              scale: stacked ? 0.88 : heroPerspective ? 0.98 : 0.96,
            },
            "-=0.08",
          )
          .to(
            glow,
            {
              autoAlpha: 1,
              duration: 0.9,
              scale: 1,
            },
            "<0.12",
          );
      }, root);
    };

    const start = () => {
      if (hasStarted) {
        return;
      }

      hasStarted = true;
      void setup();
    };

    if (!("IntersectionObserver" in window)) {
      start();
      return () => {
        cancelled = true;
        context?.revert();
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          start();
        }
      },
      { threshold: 0.28 },
    );

    observer.observe(root);

    return () => {
      cancelled = true;
      observer.disconnect();
      context?.revert();
    };
  }, [perspectiveVariant]);

  return (
    <div className={`relative ${className}`.trim()} ref={rootRef}>
      <div
        aria-hidden="true"
        className={
          glowVariant === "hero"
            ? "absolute -inset-[10%] rounded-[34%] bg-[radial-gradient(ellipse_at_center,rgba(56,182,255,0.3)_0%,rgba(20,94,148,0.3)_36%,rgba(0,6,12,0.4)_62%,transparent_82%)] blur-[72px] shadow-[0_90px_190px_-24px_rgba(0,0,0,0.82),0_28px_110px_-20px_rgba(0,0,0,0.64)]"
            : "absolute inset-[10%] rounded-full bg-[rgba(56,182,255,0.18)] blur-3xl"
        }
        ref={glowRef}
        style={{ opacity: 0, transform: "scale(0.9)" }}
      />
      <div
        className="relative h-auto w-full overflow-hidden rounded-[0.85rem] border border-white/18 bg-white/94 shadow-[0_54px_130px_-40px_rgba(2,8,16,0.88),0_130px_280px_-88px_rgba(56,182,255,0.54),0_22px_72px_-34px_rgba(255,255,255,0.34)] ring-1 ring-black/[0.04]"
        ref={screenshotRef}
        style={{
          opacity: 0,
          transform: startTransform,
        }}
      >
        <div className="flex h-9 items-center gap-2 border-b border-[rgba(11,17,22,0.08)] bg-[rgba(250,253,255,0.97)] px-4">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b5f]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffca47]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#23c46e]" />
          <span className="ml-4 h-4 w-[min(24rem,42%)] rounded-full bg-[#e9f1f7]" />
          <span className="ml-auto h-4 w-4 rounded-full bg-[#d7edf8]" />
        </div>
        <div className="relative bg-[#f6f9fc]">
          <Image
            alt={alt}
            className="h-auto w-full"
            height={height}
            priority={priority}
            sizes={sizes}
            src={src}
            width={width}
          />
        </div>
      </div>
    </div>
  );
}
