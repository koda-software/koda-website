"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { gsap as GsapNamespace } from "gsap";
import { BrowserFrame } from "@/components/landing/BrowserFrame";

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
      <BrowserFrame
        browserRef={frameRef}
        className="relative overflow-hidden rounded-[0.85rem] border border-white/20 bg-white/92 shadow-[0_46px_110px_-38px_rgba(2,8,16,0.88),0_110px_240px_-86px_rgba(56,182,255,0.58),0_22px_70px_-34px_rgba(255,255,255,0.45)] ring-1 ring-black/[0.04]"
        showAddressBar={false}
        style={{
          opacity: 0,
          transform: "translate(180px, 58px) rotateX(-2deg) rotateY(-28deg) rotateZ(2deg) scale(0.9)",
        }}
      >
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
      </BrowserFrame>
    </div>
  );
}
