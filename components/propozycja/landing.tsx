import { TwoTone } from "./blocks";
import type { LandingSection } from "./content-landings";
import { type Cut, Scene } from "./Scene";
import { Screen, screens } from "./Screen";
import { ScreenTabs } from "./ScreenTabs";
import { icons } from "./ui";
import Image from "next/image";

/*
 * The section types a landing is composed of. Each is a whole scene and takes
 * its tone from the page, which alternates graphite and mist from the
 * banner down, so any order a page needs stays readable.
 */

type Tone = "dark" | "light";
type Frame = { id: string; cut: Cut; prev: Tone; tone: Tone };
type Of<K extends LandingSection["kind"]> = Extract<LandingSection, { kind: K }>;

function Head({ title, lead }: { title: [string, string]; lead?: string }) {
  return (
    <div className="section__head">
      <TwoTone lines={title} />
      {lead ? (
        <p className="lead" data-reveal>
          {lead}
        </p>
      ) : null}
    </div>
  );
}

/** Cards: what the area covers, as plain cards, as if/then rules, or as service tiles. */
export function LandingCards({ section, frame }: { section: Of<"cards">; frame: Frame }) {
  return (
    <Scene className="section" {...frame}>
      <Head lead={section.lead} title={section.title} />
      <ul className={`l-cards l-cards--${section.style}`}>
        {section.items.map((item) => (
          <li className="l-card" data-reveal key={item.title}>
            {item.when ? (
              <p className="l-card__when">
                <span className="l-card__key">Jeśli</span>
                {item.when}
              </p>
            ) : null}
            <h3 className="l-card__title">
              {item.when ? <span className="l-card__key l-card__key--then">To</span> : null}
              {item.title}
            </h3>
            <p className="l-card__text">{item.text}</p>
          </li>
        ))}
      </ul>
    </Scene>
  );
}

export function LandingTabs({ section, frame }: { section: Of<"tabs">; frame: Frame }) {
  return (
    <Scene className="section" {...frame}>
      <Head lead={section.lead} title={section.title} />
      <div data-reveal>
        <ScreenTabs tabs={section.tabs} />
      </div>
    </Scene>
  );
}

/** Rows: one real screen per row, alternating sides, the sentence beside it. */
export function LandingRows({ section, frame }: { section: Of<"rows">; frame: Frame }) {
  return (
    <Scene className="section" {...frame}>
      <Head lead={section.lead} title={section.title} />
      <ol className="l-rows">
        {section.rows.map((row) => (
          <li className="l-row" key={row.title}>
            <div className="l-row__copy" data-reveal>
              <h3 className="l-row__title">{row.title}</h3>
              <p className="l-row__text">{row.text}</p>
            </div>
            <div className="l-row__screen" data-reveal="scale">
              <Screen caption={row.caption} name={row.screen} sizes="(min-width: 1024px) 56vw, 100vw" />
            </div>
          </li>
        ))}
      </ol>
    </Scene>
  );
}

/** Pins: one screen marked up with numbered points, and what each one decides. */
export function LandingPins({ section, frame }: { section: Of<"pins">; frame: Frame }) {
  const screen = screens[section.screen];
  return (
    <Scene className="section" {...frame}>
      <Head lead={section.lead} title={section.title} />
      <div className="l-pins">
        <div className="l-pins__screen" data-reveal="scale">
          <div className="screen__frame">
            <Image
              alt={screen.alt}
              height={screen.height}
              sizes="(min-width: 1024px) 62vw, 100vw"
              src={`/propozycja/screeny/${section.screen}.webp`}
              width={screen.width}
            />
          </div>
          {section.pins.map((pin, index) => (
            <span
              aria-hidden="true"
              className="l-pin"
              key={pin.title}
              style={{ left: `${pin.x * 100}%`, top: `${pin.y * 100}%` }}
            >
              {index + 1}
            </span>
          ))}
        </div>
        <ol className="l-pins__list">
          {section.pins.map((pin, index) => (
            <li data-reveal key={pin.title}>
              <span aria-hidden="true" className="l-pin l-pin--static">
                {index + 1}
              </span>
              <div>
                <h3 className="l-row__title">{pin.title}</h3>
                <p className="l-row__text">{pin.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Scene>
  );
}

export function LandingCompare({ section, frame }: { section: Of<"compare">; frame: Frame }) {
  return (
    <Scene className="section" {...frame}>
      <Head title={section.title} />
      <div className="l-compare" data-reveal>
        <table>
          <thead>
            <tr>
              <th scope="col">
                <span className="sr-only">Kryterium</span>
              </th>
              <th scope="col">{section.columns[0]}</th>
              <th className="l-compare__ours" scope="col">
                {section.columns[1]}
              </th>
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td>{row.before}</td>
                <td className="l-compare__ours">
                  <span aria-hidden="true" className="l-compare__check">
                    {icons.check}
                  </span>
                  {row.after}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Scene>
  );
}

export function LandingStatement({ section, frame }: { section: Of<"statement">; frame: Frame }) {
  return (
    <Scene className="section l-statement" {...frame}>
      <p className="l-statement__text" data-reveal>
        {section.text}
      </p>
      {section.note ? (
        <p className="l-statement__note" data-reveal>
          {section.note}
        </p>
      ) : null}
    </Scene>
  );
}

/** The long text at the bottom: what someone searching for the phrase wants explained. */
export function LandingArticle({ section, frame }: { section: Of<"article">; frame: Frame }) {
  return (
    <Scene className="section l-article" {...frame}>
      <h2 className="l-article__title" data-reveal>
        {section.title}
      </h2>
      <div className="l-article__body">
        {section.sections.map((part, index) => (
          <section data-reveal key={part.heading ?? index}>
            {part.heading ? <h3>{part.heading}</h3> : null}
            {part.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        ))}
      </div>
    </Scene>
  );
}
