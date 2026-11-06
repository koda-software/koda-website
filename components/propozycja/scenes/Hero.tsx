import { contract, demoHref, hero } from "../content";
import { FlowField } from "../FlowField";
import { Scene } from "../Scene";
import { Screen } from "../Screen";
import { icons, OperoMark } from "../ui";

/**
 * Start.
 *
 * The claim on the left, and on the right the product itself: a real screen
 * from the demonstration organisation, contract UM/2026/0014 sitting on its
 * legal review stage, with the notification that stage sends. It is the same
 * contract the reader then follows through the whole process chapter.
 */
export function Hero() {
  return (
    <Scene backdrop={<FlowField />} className="hero" id="start" kind="hero" prev="dark" tone="dark">
      <div className="hero__copy">
        <div className="hero__product" data-hero-fade>
          <OperoMark label="Opero" on="dark" />
        </div>
        <h1 className="display">
          <span className="mask">
            <span className="line" data-hero-line>
              {hero.title[0]}
            </span>
          </span>{" "}
          <span className="mask">
            <span className="line muted" data-hero-line>
              {hero.title[1]}
            </span>
          </span>
        </h1>
        <p className="lead" data-hero-fade>
          {hero.lead}
        </p>
        <div className="actions" data-hero-fade>
          <a className="btn btn--mist" href={demoHref}>
            {hero.primary}
            {icons.arrowRight}
          </a>
          <a className="btn btn--line" href="#rozproszenie">
            {hero.secondary}
            {icons.arrowDown}
          </a>
        </div>
      </div>

      <div className="hero__canvas" data-hero-canvas>
        <div data-hero-window>
          <Screen className="hero__screen" name="karta-umowy" priority sizes="(min-width: 1024px) 58vw, 100vw" />
        </div>
        <div className="toast hero__toast" data-hero-toast>
          <span className="toast__icon">{icons.bell}</span>
          <span>
            <span className="toast__title">{contract.notification.title}</span>
            <br />
            <span className="toast__detail">{contract.notification.detail}</span>
          </span>
        </div>
        <p className="hero__caption" data-hero-fade>
          {hero.canvasCaption}
        </p>
      </div>
    </Scene>
  );
}
