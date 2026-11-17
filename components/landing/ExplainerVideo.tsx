"use client";

import PlayIcon from "lucide-react/dist/esm/icons/play.mjs";
import Volume2Icon from "lucide-react/dist/esm/icons/volume-2.mjs";
import VolumeXIcon from "lucide-react/dist/esm/icons/volume-x.mjs";
import { useEffect, useRef, useState } from "react";

type ExplainerVideoProps = {
  ariaLabel: string;
  className?: string;
  /** Label of the play button shown when the browser will not start the film with sound. */
  play: string;
  /** Labels of the icon button that turns the sound on and off. */
  soundOff: string;
  soundOn: string;
  /** Base path of the film; `.webm`, `.mp4` and `-poster.webp` sit beside it. */
  src: string;
};

/**
 * The homepage explainer film. Nothing is fetched until the reader starts
 * scrolling (or the film comes near, if the page opened scrolled); it plays
 * once it reaches the middle of the screen and pauses when scrolled away.
 *
 * It only ever starts with sound. Browsers refuse that until the reader has
 * clicked or tapped somewhere on the page; when they do, the film waits behind
 * a play button instead of playing silently, and pressing it starts the film
 * with sound. The icon button in the corner mutes and unmutes it; once the
 * reader has muted it, later starts on scroll stay muted.
 */
export function ExplainerVideo({ ariaLabel, className = "", play, soundOff, soundOn, src }: ExplainerVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [muted, setMuted] = useState(false);
  /*
   * The play button is up from the start and goes once the film plays, so a
   * refused autoplay never shows as a film that seemed about to start and then
   * turned into a button. It comes back if a later start with sound is refused.
   */
  const [needsPlay, setNeedsPlay] = useState(true);
  const visibleRef = useRef(false);
  const reducedMotionRef = useRef(false);
  // The reader turned the sound off: later starts on scroll may play muted.
  const wantsSoundRef = useRef(true);
  // A pause the reader asked for (native controls) is theirs: scrolling back does not undo it.
  const readerPausedRef = useRef(false);
  const pausingRef = useRef(false);
  // Play was asked for before the file was there: play as soon as it is.
  const playOnLoadRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const autoplay = () => {
      video.muted = !wantsSoundRef.current;
      video.play().catch(() => setNeedsPlay(true));
    };

    /*
     * Readers who asked for reduced motion get the poster and the controls,
     * never an autoplaying film; the file loads only if they press play.
     */
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!("IntersectionObserver" in window)) {
      // No way to wait for the reader: load once the page has settled.
      const id = globalThis.setTimeout(() => setShouldLoad(true), 0);
      return () => globalThis.clearTimeout(id);
    }

    const loadObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadObserver.disconnect();
          setShouldLoad(true);
        }
      },
      { rootMargin: "600px 0px" },
    );

    // The first scroll is the cue that the reader is heading down: start fetching then.
    const onScroll = () => {
      window.removeEventListener("scroll", onScroll);
      loadObserver.disconnect();
      setShouldLoad(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const playObserver = new IntersectionObserver(
      ([entry]) => {
        // The root is a band through the middle of the screen, so the film
        // plays while it crosses the middle and pauses once it leaves it.
        const visible = entry.isIntersecting;
        visibleRef.current = visible;

        if (reducedMotionRef.current || (video.readyState === 0 && !video.currentSrc)) {
          return;
        }

        if (visible) {
          if (!readerPausedRef.current && video.paused && !video.ended) {
            autoplay();
          }
        } else if (!video.paused) {
          pausingRef.current = true;
          video.pause();
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );

    const onPause = () => {
      if (pausingRef.current) {
        pausingRef.current = false;
        return;
      }

      if (!video.ended) {
        readerPausedRef.current = true;
      }
    };
    const onPlay = () => {
      readerPausedRef.current = false;
      setNeedsPlay(false);
    };
    // The native controls can mute too; the icon follows whatever the film is doing.
    const onVolumeChange = () => setMuted(video.muted);
    // Fired by the load effect once the sources are in place.
    const onReady = () => {
      if (playOnLoadRef.current) {
        playOnLoadRef.current = false;
        video.muted = false;
        video.play().catch(() => setNeedsPlay(true));
      } else if (visibleRef.current && !reducedMotionRef.current) {
        autoplay();
      }
    };

    video.addEventListener("pause", onPause);
    video.addEventListener("play", onPlay);
    video.addEventListener("volumechange", onVolumeChange);
    video.addEventListener("explainer:ready", onReady);
    loadObserver.observe(video);
    playObserver.observe(video);

    return () => {
      window.removeEventListener("scroll", onScroll);
      loadObserver.disconnect();
      playObserver.disconnect();
      video.removeEventListener("pause", onPause);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("volumechange", onVolumeChange);
      video.removeEventListener("explainer:ready", onReady);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!shouldLoad || !video) {
      return;
    }

    video.load();
    video.dispatchEvent(new Event("explainer:ready"));
  }, [shouldLoad]);

  // A press is the reader's own gesture, so the browser lets the sound through.
  const playWithSound = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    wantsSoundRef.current = true;
    video.muted = false;
    readerPausedRef.current = false;
    setNeedsPlay(false);

    if (!shouldLoad) {
      playOnLoadRef.current = true;
      setShouldLoad(true);
      return;
    }

    video.play().catch(() => setNeedsPlay(true));
  };

  const toggleSound = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (!video.muted) {
      wantsSoundRef.current = false;
      video.muted = true;
      return;
    }

    playWithSound();
  };

  const label = muted ? soundOn : soundOff;

  return (
    <div className={`relative overflow-hidden rounded-[clamp(0.9rem,1.6vw,1.4rem)] bg-[var(--color-ink)] shadow-[0_30px_80px_-30px_rgb(11_17_22/0.45)] ${className}`}>
      <video
        ref={videoRef}
        aria-label={ariaLabel}
        className="block aspect-video h-auto w-full"
        controls={!needsPlay}
        height={1080}
        playsInline
        poster={`${src}-poster.webp`}
        preload={shouldLoad ? "auto" : "none"}
        width={1920}
      >
        {shouldLoad ? (
          <>
            <source src={`${src}.webm`} type="video/webm" />
            <source src={`${src}.mp4`} type="video/mp4" />
          </>
        ) : null}
      </video>

      {needsPlay ? (
        <button
          aria-label={play}
          className="group absolute inset-0 grid place-items-center bg-[rgb(11_17_22/0.18)] transition-colors duration-200 hover:bg-[rgb(11_17_22/0.28)]"
          onClick={playWithSound}
          title={play}
          type="button"
        >
          <span className="grid h-[clamp(4rem,8vw,6rem)] w-[clamp(4rem,8vw,6rem)] place-items-center rounded-full bg-white text-[var(--color-ink)] shadow-[0_18px_40px_-12px_rgb(11_17_22/0.55)] transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
            <PlayIcon aria-hidden="true" className="ml-[6%] h-[42%] w-[42%]" fill="currentColor" strokeWidth={0} />
          </span>
        </button>
      ) : (
        <button
          aria-label={label}
          className="absolute right-[clamp(0.75rem,1.6vw,1.25rem)] top-[clamp(0.75rem,1.6vw,1.25rem)] grid h-11 w-11 place-items-center rounded-full bg-[rgb(11_17_22/0.62)] text-white backdrop-blur-sm transition-[background-color,transform] duration-150 hover:bg-[rgb(11_17_22/0.82)] active:scale-95"
          onClick={toggleSound}
          title={label}
          type="button"
        >
          {muted ? (
            <VolumeXIcon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
          ) : (
            <Volume2Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
          )}
        </button>
      )}
    </div>
  );
}
