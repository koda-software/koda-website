import { contract, process } from "../content";
import { type Cut, Scene } from "../Scene";
import { icons, Stages } from "../ui";

const eventIcons = [icons.file, icons.bell, icons.rule, icons.doc, icons.clock];

/**
 * 03 · Proces. The centre of the page.
 *
 * One contract, five stages, and the reader's scroll is what moves it. On the
 * left the stage name fills the frame and the sentence under it says what
 * stops happening in the organisation at that moment. On the right the card
 * itself: the blue slides along the row to the stage the contract now sits
 * on, the event that stage produced lands under it, and the event log fills
 * line by line - so by the end the reader has watched a whole case go through
 * without anyone chasing it.
 *
 * Static layer: the five beats are a plain list with their events, and the
 * card shows the contract on its second stage, the state the hero left it in.
 */
export function Process({ id = "proces", cut = "none", prev = "light" }: { id?: string; cut?: Cut; prev?: "dark" | "light" } = {}) {
  return (
    <Scene className="process" cut={cut} id={id} kind="process" prev={prev} stage tone="light">
      <div className="process__head">
        <p className="process__intro">{process.intro}</p>
      </div>

      <ol className="beats" data-beats>
        {process.beats.map((beat, index) => (
          <li className="beat" data-beat={index} key={beat.stage}>
            <p className="beat__count">
              Etap {index + 1} z {process.beats.length}
            </p>
            <h3 className="beat__stage">{beat.stage}</h3>
            <p className="beat__text">{beat.text}</p>
            <div className="toast event">
              <span className="toast__icon">{eventIcons[index]}</span>
              <span>
                <span className="toast__title">{beat.event.kind}</span>
                <br />
                <span className="toast__detail">{beat.event.detail}</span>
              </span>
            </div>
          </li>
        ))}
      </ol>

      <div className="process__card">
        <div className="window process__window">
          <div className="window__bar">
            <span className="window__crumb mono">
              {contract.module} › <b>{contract.reference}</b>
            </span>
            <span className="chip">{contract.organisation}</span>
          </div>
          <div className="window__body">
            <p className="hero__doc-title">{contract.title}</p>
            <div data-process-stages>
              <Stages current={1} stages={contract.stages} withCursor />
            </div>
            <dl className="fields">
              {contract.fields.map((field) => (
                <div
                  className="field"
                  data-process-field={field.label === "Wartość netto" ? "value" : undefined}
                  key={field.label}
                >
                  <dt>{field.label}</dt>
                  <dd>{field.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="log mono">
          <p className="log__title">Historia sprawy</p>
          <ul>
            {process.beats.map((beat, index) => (
              <li data-log={index} key={beat.log}>
                {beat.log}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Scene>
  );
}
