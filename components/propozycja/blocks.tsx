import Link from "next/link";
import type { ReactNode } from "react";
import { FlowField } from "./FlowField";
import { type Cut, Scene } from "./Scene";
import { icons } from "./ui";
import { Screen, type ScreenName } from "./Screen";

/*
 * The building blocks of the inner pages. Each is a whole section, so a page
 * is a list of them in the order its argument runs, and every one of them
 * knows its tone and cut. The tones are chosen by the page, because only the
 * page knows what comes before and after.
 */

type Tone = "dark" | "light";

/** A two-tone headline: the claim at full ink, the consequence muted. */
export function TwoTone({ lines, as: Tag = "h2", className = "title", reveal = true }: {
  lines: [string, string];
  as?: "h1" | "h2";
  className?: string;
  reveal?: boolean;
}) {
  return (
    <Tag className={className}>
      <span className="line" data-reveal={reveal || undefined}>
        {lines[0]}
      </span>{" "}
      <span className="line muted" data-reveal={reveal || undefined}>
        {lines[1]}
      </span>
    </Tag>
  );
}

/**
 * The banner of an inner page. Graphite like every opening scene, so the
 * header always starts on the same surface, with the faint process map
 * moving behind it. On the right goes a real screen from the product where
 * the page is about one part of it, or a short index of what the page covers
 * where it is not.
 */
export function PageHero({
  actions = true,
  aside,
  lead,
  screen,
  title,
}: {
  actions?: boolean;
  aside?: ReactNode;
  lead: string;
  screen?: { name: ScreenName; caption: string };
  title: [string, string];
}) {
  const visual = screen ? (
    <Screen caption={screen.caption} className="page-hero__screen" name={screen.name} priority sizes="(min-width: 1024px) 52vw, 100vw" />
  ) : (
    aside
  );
  const modifier = screen ? "page-hero--screen" : aside ? "page-hero--aside" : "";
  return (
    <Scene backdrop={<FlowField />} className={`page-hero ${modifier}`.trim()} id="start" kind="page-hero" prev="dark" tone="dark">
      <div className="page-hero__copy">
        <h1 className="display display--page">
          <span className="mask">
            <span className="line" data-hero-line>
              {title[0]}
            </span>
          </span>{" "}
          <span className="mask">
            <span className="line muted" data-hero-line>
              {title[1]}
            </span>
          </span>
        </h1>
        <p className="lead" data-hero-fade>
          {lead}
        </p>
        {actions ? (
          <div className="actions" data-hero-fade>
            <Link className="btn btn--mist" href="/propozycja/kontakt">
              Umów demo {icons.arrowRight}
            </Link>
          </div>
        ) : null}
      </div>
      {visual ? (
        <div className="page-hero__aside" data-hero-visual>
          {visual}
        </div>
      ) : null}
    </Scene>
  );
}

/** The index in a page banner: what this page covers. */
export function HeroIndex({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="hero-index">
      <p className="hero-index__title">{title}</p>
      <ol>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Today and with Opero, side by side, row by row. The left column is the
 * situation the reader recognises, set quieter; the right is what it becomes.
 * Read across, each row is one argument; read down the right column, it is
 * the case for the whole area.
 */
export function Outcomes({
  cut = "none",
  id,
  items,
  prev,
  title,
  tone,
}: {
  cut?: Cut;
  id: string;
  items: Array<{ before: string; after: string }>;
  prev: Tone;
  title: [string, string];
  tone: Tone;
}) {
  return (
    <Scene className="section outcomes" cut={cut} id={id} prev={prev} tone={tone}>
      <div className="section__head">
        <TwoTone lines={title} />
      </div>
      <div className="outcomes__table">
        <div aria-hidden="true" className="outcomes__cols">
          <span>Dziś</span>
          <span>W Opero</span>
        </div>
        <ul>
          {items.map((item) => (
            <li className="outcome" data-reveal key={item.after}>
              <p className="outcome__before">
                <span className="sr-only">Dziś: </span>
                {item.before}
              </p>
              <span aria-hidden="true" className="outcome__arrow">
                {icons.arrowRight}
              </span>
              <p className="outcome__after">
                <span className="sr-only">W Opero: </span>
                {item.after}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Scene>
  );
}

/** What an area is made of: the real screen where there is one, then each element with one sentence. */
export function Elements({
  children,
  cut = "none",
  id,
  items,
  prev,
  screen,
  title,
  tone,
}: {
  children?: ReactNode;
  cut?: Cut;
  id: string;
  items: Array<{ title: string; text: string }>;
  screen?: { name: ScreenName; caption: string };
  prev: Tone;
  title: [string, string];
  tone: Tone;
}) {
  return (
    <Scene className="section" cut={cut} id={id} prev={prev} tone={tone}>
      <div className="section__head">
        <TwoTone lines={title} />
      </div>
      {screen ? <Screen caption={screen.caption} className="screen--wide" name={screen.name} sizes="(min-width: 1360px) 1360px, 100vw" /> : null}
      <ol className="elements">
        {items.map((item) => (
          <li className="element" key={item.title}>
            <h3 className="element__title">{item.title}</h3>
            <p className="element__text">{item.text}</p>
          </li>
        ))}
      </ol>
      {children}
    </Scene>
  );
}

/** Questions, as disclosure rows. Open and close without a script; the engine adds the motion. */
export function Faq({ items, title = "Pytania, które słyszymy najczęściej" }: { items: Array<{ q: string; a: string }>; title?: string }) {
  return (
    <div className="faq">
      <h3 className="faq__title" data-reveal>
        {title}
      </h3>
      <div className="faq__list">
        {items.map((item) => (
          <details className="faq__item" data-reveal key={item.q}>
            <summary>
              {item.q}
              <span aria-hidden="true" className="faq__icon">
                {icons.plus}
              </span>
            </summary>
            <div className="faq__answer">
              <p>{item.a}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

/** Where to go next: linked cards with the destination's one-line summary. */
export function Related({ items, title = "Zobacz też" }: { items: Array<{ href: string; label: string; text: string }>; title?: string }) {
  return (
    <div className="related">
      <h3 className="faq__title" data-reveal>
        {title}
      </h3>
      <ul className="related__list">
        {items.map((item) => (
          <li data-reveal key={item.href}>
            <Link className="related__card" href={item.href}>
              <span className="related__label">{item.label}</span>
              <span className="related__text">{item.text}</span>
              <span aria-hidden="true" className="related__arrow">
                {icons.arrowRight}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The closing call of an inner page: one sentence, one action. Always on mist, because
 * the footer under it is graphite and two graphite planes in a row would read
 * as one long dark band.
 */
export function ClosingCall({
  cut = "card",
  prev,
  text = "Najpierw poznajemy, jak naprawdę pracują zespoły. Potem pokazujemy to w Opero, na Waszym procesie.",
  title = ["Pokaż nam", "jeden proces."],
}: {
  cut?: Cut;
  prev: Tone;
  text?: string;
  title?: [string, string];
}) {
  return (
    <Scene className="section closing" cut={cut} id="dalej" prev={prev} tone="light">
      <div className="closing__inner">
        <TwoTone className="title closing__title" lines={title} />
        <p className="lead" data-reveal>
          {text}
        </p>
        <div className="actions" data-reveal>
          <Link className="btn btn--ink" href="/propozycja/kontakt">
            Umów demo {icons.arrowRight}
          </Link>
          <Link className="btn btn--line" href="/propozycja/wdrozenie">
            Jak wygląda wdrożenie
          </Link>
        </div>
      </div>
    </Scene>
  );
}
