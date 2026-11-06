"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import { type ScreenName, screens } from "./Screen";

/*
 * A part of the product told as a short story, one real screen per step.
 *
 * The idea comes from the product page Konrad began on kodasoft.pl: instead
 * of a list of features, a sequence - you add a stage, the stage opens a task
 * with a deadline, you decide who may move the case on, the case goes through
 * - each step shown on the screen where it happens, with a magnifier over the
 * one detail the sentence is about.
 *
 * On a wide screen the screens stay in place on the left and change as the
 * steps on the right pass the middle of the window, so the reader scrolls
 * the story and watches the product. On a phone every step simply carries its
 * own screen above the text.
 */

export type StoryStep = {
  title: string;
  text: string;
  screen: ScreenName;
  /** The detail the step is about, as fractions of the screen, and how much to magnify it. */
  focus?: { x: number; y: number; zoom?: number };
};

function Shot({ step, priority = false }: { step: StoryStep; priority?: boolean }) {
  const screen = screens[step.screen];
  const style = {
    "--ar": screen.width / screen.height,
    "--x": step.focus?.x ?? 0.5,
    "--y": step.focus?.y ?? 0.5,
    "--zoom": step.focus?.zoom ?? 2.4,
    "--src": `url(/propozycja/screeny/${step.screen}.webp)`,
  } as CSSProperties;
  return (
    <div className="story__shot" style={style}>
      <Image
        alt={screen.alt}
        height={screen.height}
        priority={priority}
        sizes="(min-width: 1024px) 56vw, 100vw"
        src={`/propozycja/screeny/${step.screen}.webp`}
        width={screen.width}
      />
      {step.focus ? <span aria-hidden="true" className="story__lens" /> : null}
    </div>
  );
}

export function Story({ steps }: { steps: StoryStep[] }) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const items = [...(listRef.current?.querySelectorAll<HTMLElement>("[data-step]") ?? [])];
    if (!items.length) return;
    /* The step whose text crosses the middle band of the window is the one on screen. */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="story">
      <div aria-hidden="true" className="story__stage">
        {steps.map((step, index) => (
          <div className={`story__layer ${index === active ? "is-active" : ""}`.trim()} key={`${step.screen}-${index}`}>
            <Shot priority={index === 0} step={step} />
          </div>
        ))}
      </div>
      <ol className="story__steps" ref={listRef}>
        {steps.map((step, index) => (
          <li className={`story__step ${index === active ? "is-active" : ""}`.trim()} data-step={index} key={step.title}>
            <div className="story__inline">
              <Shot step={step} />
            </div>
            <h3 className="story__title">{step.title}</h3>
            <p className="story__text">{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
