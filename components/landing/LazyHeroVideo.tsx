"use client";

import { useEffect, useRef, useState } from "react";

type LazyHeroVideoProps = {
  ariaLabel: string;
  className?: string;
  height: number;
  loop?: boolean;
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

export function LazyHeroVideo({
  ariaLabel,
  className = "",
  height,
  loop = false,
  src,
  type = "video/webm",
  width,
}: LazyHeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
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
      className={`${className} transition-opacity duration-700 ease-out motion-reduce:transition-none ${isLoaded ? "opacity-100" : "opacity-0"}`.trim()}
      loop={loop}
      muted
      onCanPlay={() => setIsLoaded(true)}
      onLoadedData={() => setIsLoaded(true)}
      playsInline
      preload="none"
      width={width}
      height={height}
    >
      {shouldLoad ? <source src={src} type={type} /> : null}
    </video>
  );
}
