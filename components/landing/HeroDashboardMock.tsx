"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { gsap as GsapNamespace } from "gsap";

type GsapModule = {
  gsap: typeof GsapNamespace;
};

type HeroDashboardMockProps = {
  className?: string;
};

export function HeroDashboardMock({ className = "" }: HeroDashboardMockProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const frame = frameRef.current;
    const glow = glowRef.current;

    if (!root || !frame) {
      return undefined;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      frame.style.opacity = "1";
      frame.style.transform = "rotateX(6deg) rotateY(-16deg) rotateZ(-3deg) scale(1.06)";
      return undefined;
    }

    let context: gsap.Context | undefined;
    let cancelled = false;

    const setup = async () => {
      const { gsap } = await (import("gsap") as Promise<GsapModule>);

      if (cancelled) {
        return;
      }

      context = gsap.context(() => {
        gsap.set(root, {
          perspective: 1200,
          perspectiveOrigin: "50% 50%",
        });
        gsap.set(frame, {
          rotateX: 6,
          rotateY: -16,
          rotateZ: -3,
          transformOrigin: "50% 50%",
          transformStyle: "preserve-3d",
          willChange: "transform",
        });

        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .fromTo(
            frame,
            {
              autoAlpha: 0,
              rotateX: -2,
              rotateY: -28,
              rotateZ: 2,
              scale: 0.9,
              x: 180,
              y: 58,
            },
            {
              autoAlpha: 1,
              duration: 1.25,
              rotateX: 6,
              rotateY: -16,
              rotateZ: -3,
              scale: 1.06,
              x: 0,
              y: 0,
            },
          )
          .fromTo(
            glow,
            { autoAlpha: 0, scale: 0.9 },
            { autoAlpha: 1, duration: 1, scale: 1 },
            "<0.15",
          );
      }, root);
    };

    void setup();

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className={`relative ${className}`.trim()}>
      <div
        aria-hidden="true"
        className="absolute inset-[6%] rounded-full bg-[rgba(56,182,255,0.16)] blur-3xl"
        ref={glowRef}
        style={{ opacity: 0 }}
      />
      <div
        className="relative overflow-hidden rounded-[0.85rem] border border-white/20 bg-white/92 shadow-[0_46px_110px_-38px_rgba(2,8,16,0.88),0_110px_240px_-86px_rgba(56,182,255,0.58),0_22px_70px_-34px_rgba(255,255,255,0.45)] ring-1 ring-black/[0.04]"
        style={{
          opacity: 0,
          transform: "translate(180px, 58px) rotateX(-2deg) rotateY(-28deg) rotateZ(2deg) scale(0.9)",
        }}
        ref={frameRef}
      >
        <div className="flex h-9 items-center gap-2 border-b border-[rgba(11,17,22,0.08)] bg-[rgba(250,253,255,0.96)] px-4">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b5f]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#ffca47]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#23c46e]" />
          <span className="ml-4 h-4 w-[min(26rem,42%)] rounded-full bg-[#e9f1f7]" />
          <span className="ml-auto h-4 w-4 rounded-full bg-[#d7edf8]" />
        </div>
        <div className="relative bg-[#eef8fc]">
          <Image
            alt="Opero executive dashboard"
            className="h-auto w-full select-none"
            height={1956}
            priority
            sizes="(min-width: 1200px) 77rem, (min-width: 810px) 66vw, 112vw"
            src="/hero/opero-dashboard-hero-static.png"
            width={2157}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.2),transparent_34%,rgba(56,182,255,0.08)_78%,rgba(9,19,29,0.08))]"
          />
        </div>
      </div>
    </div>
  );
}
