import { contract, control } from "../content";
import { type Cut, Scene } from "../Scene";
import { icons } from "../ui";

/* The two fields a department assistant has no business seeing. */
const secretFields = new Set(["Wartość netto", "Poziom ryzyka"]);

/**
 * 06 · Kontrola.
 *
 * Field-level permissions are the claim, so the chapter lets the reader
 * operate them. The same contract card, two roles: as the finance director it
 * shows everything; as a department assistant the value and the risk level
 * blur out and are marked hidden for that role. The scroll flips the role
 * once on its own, and the switch stays live for the reader to try. Under the
 * card, the event log the chapter's last sentence promises.
 */
export function Control({ id = "kontrola", cut = "iris", prev = "light" }: { id?: string; cut?: Cut; prev?: "dark" | "light" } = {}) {
  return (
    <Scene className="control" cut={cut} id={id} kind="control" prev={prev} tone="dark">
      <div className="control__copy">
        <h2 className="title">
          <span className="line" data-reveal>
            {control.title[0]}
          </span>{" "}
          <span className="line muted" data-reveal>
            {control.title[1]}
          </span>
        </h2>
        <p className="lead" data-reveal>
          {control.lead}
        </p>
        <ul aria-label="Mechanizmy kontroli" className="caps">
          {control.capabilities.map((capability) => (
            <li data-cap key={capability}>
              {capability}
            </li>
          ))}
        </ul>
      </div>

      <div className="roles" data-role="cfo" data-roles>
        <div aria-label="Podgląd jako" className="toggle" role="group">
          <span aria-hidden="true" className="toggle__thumb" data-toggle-thumb />
          {control.roles.map((role, index) => (
            <button aria-pressed={index === 0} data-role-button={role.id} key={role.id} type="button">
              {role.label}
            </button>
          ))}
        </div>

        <div className="window" data-reveal="scale">
          <div className="window__bar">
            <span className="window__crumb mono">
              {contract.module} › <b>{contract.reference}</b>
            </span>
            <span className="chip">
              {icons.lock}
              Uprawnienia do pól
            </span>
          </div>
          <div className="window__body" style={{ padding: "8px 26px 14px" }}>
            <dl className="fields">
              {contract.fields.map((field) => {
                const secret = secretFields.has(field.label);
                return (
                  <div className={`field ${secret ? "secret" : ""}`.trim()} key={field.label}>
                    <dt>{field.label}</dt>
                    <dd>
                      <span className="secret__value">{field.value}</span>
                      {secret ? (
                        <span aria-hidden="true" className="secret__mask">
                          {icons.lock}
                          {control.hidden}
                        </span>
                      ) : null}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>

        <div className="log mono">
          <p className="log__title">Rejestr zdarzeń</p>
          <ul>
            {control.log.map((line) => (
              <li data-control-log key={line}>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Scene>
  );
}
