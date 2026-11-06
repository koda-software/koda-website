import { demoHref, together } from "../content";
import { Scene } from "../Scene";
import { icons } from "../ui";

/**
 * 07 · Współpraca.
 *
 * The page ends by putting the reader on a process of their own. The way an
 * engagement runs - a diagnostic conversation, a demo built on their process,
 * the modules switched on, administrators trained, the system handed over -
 * is drawn as stages, and the reader is standing on the first one. That is
 * the blue stage, marked "you are here", and the button under it is the only
 * thing left to do.
 */
export function Together() {
  return (
    <Scene className="together" cut="iris" id="wspolpraca" kind="together" prev="dark" tone="light">
      <div className="together__head">
        <div>
          <h2 className="title" style={{ marginTop: 20 }}>
            <span className="line" data-reveal>
              {together.title[0]}
            </span>{" "}
            <span className="line muted" data-reveal>
              {together.title[1]}
            </span>
          </h2>
        </div>
        <p className="lead" data-reveal>
          {together.lead}
        </p>
      </div>

      <div className="path" data-path>
        <span aria-hidden="true" className="path__rule">
          <span className="path__rule-fill" data-path-fill />
        </span>
        <ol className="path__steps">
        {together.stages.map((stage, index) => (
          <li className="path__step" data-path-step data-state={index === 0 ? "current" : "future"} key={stage}>
            <span className="path__num">{String(index + 1).padStart(2, "0")}</span>
            <span className="path__name">{stage}</span>
            {index === 0 ? <span className="path__here">Tu jesteście</span> : null}
          </li>
        ))}
        </ol>
      </div>

      <div className="together__foot" data-reveal>
        <p className="together__note">{together.note}</p>
        <div className="together__contact">
          <a className="btn btn--ink" href={demoHref}>
            {together.primary}
            {icons.arrowRight}
          </a>
          <a className="btn btn--line" href={`mailto:${together.email}`}>
            {together.email}
          </a>
        </div>
      </div>
    </Scene>
  );
}
