"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";

type LazyHeroVideoProps = {
  ariaLabel: string;
  className?: string;
  /**
   * Dissolves the clip's edges instead of ending them on a hard line.
   *
   * Two of these recordings are composed on a black field. That black used to
   * be invisible only because the surface behind it was near-black too, so the
   * moment the palette moved to graphite each clip started reading as a black
   * slab pasted onto the page. Feathering fixes it at the seam rather than by
   * dragging the whole palette back to black, and unlike a `screen` blend it
   * leaves the interface itself fully opaque and crisp.
   *
   * "top-left" is for a clip that bleeds off the bottom-right corner of its
   * banner, so only those two edges are ever on screen; the fade stops where
   * the browser window in the recording begins, far enough to cover the black
   * margin and not far enough to eat into the product UI. "all" is for a clip
   * that sits fully inside the page, where the window is rotated and leaves
   * black in every corner.
   */
  feather?: "top-left" | "all";
  height: number;
  loop?: boolean;
  /**
   * Still frame shown before - and instead of - playback. Without one the
   * element is an empty box until the file arrives, and a reader who has asked
   * for reduced motion gets nothing at all.
   */
  poster?: string;
  src: string;
  type?: string;
  width: number;
};

function scheduleIdleLoad(callback: () => void) {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(callback, { timeout: 1600 });
    return () => window.cancelIdleCallback(id);
  }

  const id = globalThis.setTimeout(callback, 450);
  return () => globalThis.clearTimeout(id);
}

const featherMasks = {
  "top-left":
    "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 8%, #000 20%), linear-gradient(to right, transparent 0%, rgba(0,0,0,0.4) 9%, #000 21%)",
  all:
    "linear-gradient(to bottom, transparent 0%, #000 9%, #000 91%, transparent 100%), linear-gradient(to right, transparent 0%, #000 7%, #000 93%, transparent 100%)",
} as const;

export function LazyHeroVideo({
  ariaLabel,
  className = "",
  feather,
  height,
  loop = false,
  poster,
  src,
  type = "video/webm",
  width,
}: LazyHeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  const maskStyle: CSSProperties | undefined = feather
    ? {
        maskImage: featherMasks[feather],
        WebkitMaskImage: featherMasks[feather],
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }
    : undefined;

  useEffect(() => {
    /*
     * An autoplaying, looping video is exactly the kind of motion
     * `prefers-reduced-motion` exists to suppress, and it can genuinely make
     * some readers unwell. Honouring it here rather than in CSS means the file
     * is never fetched either, so those readers also save the download.
     */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const video = videoRef.current;

    if (!video) {
      return;
    }

    let cancelIdleLoad: (() => void) | undefined;

    const loadVideo = () => {
      cancelIdleLoad = scheduleIdleLoad(() => setShouldLoad(true));
    };

    if (!("IntersectionObserver" in window)) {
      loadVideo();
      return () => cancelIdleLoad?.();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          loadVideo();
        }
      },
      { rootMargin: "360px 0px" },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      cancelIdleLoad?.();
    };
  }, []);

  useEffect(() => {
    if (!shouldLoad) {
      return;
    }

    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.load();
    video.play().catch(() => {
      // Browsers may refuse autoplay in edge cases; the visual can remain still.
    });
  }, [shouldLoad]);

  return (
    <video
      ref={videoRef}
      aria-label={ariaLabel}
      autoPlay
      className={className}
      loop={loop}
      muted
      playsInline
      poster={poster}
      style={maskStyle}
      preload="none"
      width={width}
      height={height}
    >
      {shouldLoad ? <source src={src} type={type} /> : null}
    </video>
  );
}
