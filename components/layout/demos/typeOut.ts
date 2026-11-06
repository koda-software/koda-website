import type { gsap as GsapNamespace } from "gsap";

type Gsap = typeof GsapNamespace;

const SECONDS_PER_LETTER = 0.02;
const READ_SECONDS = 0.3;

/**
 * Writes out what is in `[data-typed]`, moving it letter by letter out of `[data-rest]`
 * next to it, which takes the same space, so that the words do not jump between lines.
 * `[data-caret]` shows while it is written.
 *
 * Returns when it has been read, what empties it for when the story starts over, and
 * what puts the text back for the markup.
 */
export function typeOut(gsap: Gsap, timeline: ReturnType<Gsap["timeline"]>, sentence: HTMLElement, at: number) {
  const typed = sentence.querySelector<HTMLElement>("[data-typed]")!;
  const rest = sentence.querySelector<HTMLElement>("[data-rest]")!;
  const caret = sentence.querySelector<HTMLElement>("[data-caret]")!;
  const text = typed.textContent ?? "";
  const written = { letters: 0 };
  const show = () => {
    const letters = Math.round(written.letters);
    typed.textContent = text.slice(0, letters);
    rest.textContent = text.slice(letters);
  };
  const clear = () => {
    written.letters = 0;
    show();
  };
  const restore = () => {
    typed.textContent = text;
    rest.textContent = "";
  };

  clear();

  const seconds = text.length * SECONDS_PER_LETTER;
  const readAt = at + seconds + READ_SECONDS;
  gsap.set(caret, { autoAlpha: 0 });
  timeline.to(caret, { autoAlpha: 1, duration: 0.01, ease: "none" }, at);
  timeline.to(written, { letters: text.length, duration: seconds, ease: "none", onUpdate: show }, at);
  timeline.to(caret, { autoAlpha: 0, duration: 0.01, ease: "none" }, readAt);

  return { readAt, clear, restore };
}
