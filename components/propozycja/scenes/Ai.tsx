import { ai, contract } from "../content";
import { type Cut, Scene } from "../Scene";
import { icons } from "../ui";

/**
 * 05 · AI.
 *
 * "AI gives speed, Opero gives the foundation", shown as the order of events
 * it implies. A request is typed in plain language. The assistant does not
 * build anything on its own: it proposes a new stage, drawn dashed inside the
 * same process row everything else lives in. Three checks pass - same
 * elements, same permissions, validation before saving - and only then does a
 * person approve it, and the dashed proposal becomes a real stage. The one
 * blue thing in the chapter is that stage, at the moment it is accepted.
 */
export function Ai({ id = "ai", cut = "fade", prev = "dark" }: { id?: string; cut?: Cut; prev?: "dark" | "light" } = {}) {
  const before = contract.stages.slice(0, 3);
  const after = contract.stages.slice(3);

  return (
    <Scene className="ai" cut={cut} id={id} kind="ai" prev={prev} tone="light">
      <div className="ai__copy">
        <h2 className="title">
          <span className="line" data-reveal>
            {ai.title[0]}
          </span>{" "}
          <span className="line muted" data-reveal>
            {ai.title[1]}
          </span>
        </h2>
        <p className="lead" data-reveal>
          {ai.lead}
        </p>
      </div>

      <div className="assistant" data-assistant>
        <div className="prompt">
          <span className="prompt__label">
            {icons.spark}
            Asystent AI · moduł Umowy
          </span>
          <p className="prompt__text" data-prompt>
            {ai.prompt}
          </p>
        </div>

        <div className="window proposal">
          <div className="window__bar">
            <span className="window__crumb">
              Proces · <b>Umowy</b>
            </span>
            <span className="chip" data-proposal-chip>
              Propozycja zmiany
            </span>
          </div>
          <div className="window__body">
            <ol className="stages" data-proposal-stages>
              {before.map((stage) => (
                <li className="stage" data-state="done" key={stage}>
                  {stage}
                </li>
              ))}
              <li className="stage-wrap stage-wrap--proposed" data-proposed-wrap>
                <span className="stage stage--proposed" data-proposed>
                  {ai.proposed}
                </span>
              </li>
              {after.map((stage) => (
                <li className="stage" data-state="future" key={stage}>
                  {stage}
                </li>
              ))}
            </ol>
            <ul className="checks">
              {ai.checks.map((check) => (
                <li className="check" data-check key={check.title}>
                  <span className="check__mark">{icons.check}</span>
                  <span className="check__title">{check.title}</span>
                  <span className="check__detail">{check.detail}</span>
                </li>
              ))}
            </ul>
            <div className="approve">
              <span className="approve__note" data-approve-note>
                Decyzję podejmuje człowiek.
              </span>
              <span className="btn btn--ink" data-approve aria-hidden="true">
                {icons.check}
                <span data-approve-label>{ai.approve}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Scene>
  );
}
