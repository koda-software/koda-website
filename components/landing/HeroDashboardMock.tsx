"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useRef } from "react";
import type { gsap as GsapNamespace } from "gsap";
import { BrowserFrame } from "@/components/landing/BrowserFrame";

type GsapModule = {
  gsap: typeof GsapNamespace;
};

type HeroDashboardMockProps = {
  className?: string;
  image?: { alt: string; height: number; src: string; width: number };
};

const DASHBOARD_IMAGE = { alt: "Opero executive dashboard", height: 1956, src: "/hero/opero-dashboard-hero-static.png", width: 2157 };

export function HeroDashboardMock({ className = "", image = DASHBOARD_IMAGE }: HeroDashboardMockProps) {
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
        className="absolute inset-[-6%] bg-[radial-gradient(closest-side,rgba(56,182,255,0.2),transparent)]"
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
            alt={image.alt}
            className="h-auto w-full select-none"
            height={image.height}
            priority
            sizes="(min-width: 1200px) 77rem, (min-width: 810px) 66vw, 112vw"
            src={image.src}
            width={image.width}
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

/** Places a hero visual the way the homepage does: centred in the hero, running off the right edge. */
type HeroEdgeVisualProps = Pick<HeroDashboardMockProps, "image"> & {
  /** Sits over the screenshot, unrotated: a magnifier, for example. */
  children?: ReactNode;
  /** Level with the middle of the headline column, rather than hanging from the top of the banner. */
  centered?: boolean;
  /** A little more screenshot than the default, centred. It grows to the right, off the page, so it stays clear of the headline. */
  large?: boolean;
};

// Both sit on the middle of the hero's content box, where the flex-centred copy sits: the banner's middle, moved by half the difference between its top and bottom padding.
// The tilted frame's perspective shifts it by a different amount at each size, and the last term takes that back out. Tailwind needs these classes whole.
const CENTERED_LARGE = "top-[calc(50%+(clamp(9rem,14vw,13rem)-clamp(5rem,9vw,8rem))/2+16px)] -translate-y-1/2 max-[1200px]:translate-y-0";
const CENTERED = "top-[calc(50%+(clamp(9rem,14vw,13rem)-clamp(5rem,9vw,8rem))/2-13px)] -translate-y-1/2 max-[1200px]:translate-y-0";

export function HeroEdgeVisual({ centered = false, children, image, large = false }: HeroEdgeVisualProps) {
  // The large one is anchored by its left edge, which clears the headline column, and runs off the page to the right.
  const size = large
    ? `left-[max(745px,calc(50vw+45px))] ${CENTERED_LARGE} w-[clamp(41rem,60vw,68rem)]`
    : `right-[-11rem] ${centered ? CENTERED : "top-[calc(clamp(12.5rem,23vw,18rem)-120px)]"} w-[clamp(37rem,53vw,61rem)]`;
  const placement = `pointer-events-none absolute ${size} max-[1200px]:left-[calc(clamp(23rem,44vw,36rem)-160px)] max-[1200px]:right-auto max-[1200px]:top-[calc(clamp(15rem,28vw,20rem)-120px)] max-[1200px]:w-[clamp(35rem,65vw,54rem)] max-[809px]:left-[calc(52vw-100px)] max-[809px]:top-[calc(19rem-170px)] max-[809px]:w-[min(39rem,90vw)]`;
  const { height, width } = image ?? DASHBOARD_IMAGE;

  return (
    <>
      <div className={`${placement} z-0 max-[1200px]:opacity-40 max-[809px]:opacity-24`}>
        <HeroDashboardMock className="h-auto w-full select-none" image={image} />
      </div>
      {/* Its own layer, above the fade that melts the bottom of the screenshot into the banner. */}
      {children ? (
        <div className={`${placement} z-[1]`} style={{ aspectRatio: `${width} / ${height}` }}>
          {children}
        </div>
      ) : null}
    </>
  );
}
