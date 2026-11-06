import type { CSSProperties } from "react";
import { scatter } from "../content";
import { Scene } from "../Scene";
import { icons, OperoMark } from "../ui";

/**
 * 01 · Rozproszenie.
 *
 * The argument the positioning opens with - organisations want their own
 * applications, AI speeds that up, and there is no foundation for them to
 * stand on - told with the pieces an organisation's work is actually spread
 * across. A dozen of them hang in the frame at odd angles, each a different
 * shape. As the reader scrolls they are pulled into one grid, straighten, and
 * each turns into the plain module it was always trying to be: the register
 * copy becomes "Umowy", the email thread becomes "Faktury z KSeF". Only then
 * does the chapter say what is missing.
 */
export function Scatter() {
  return (
    <Scene className="scatter" cut="card" id="rozproszenie" kind="scatter" prev="dark" stage tone="light">
      <div className="scatter__head">
        <h2 className="title title--sm" style={{ marginTop: 20 }}>
          <span className="line" data-scatter-line>
            {scatter.lines[0]}
          </span>{" "}
          <span className="line muted" data-scatter-line>
            {scatter.lines[1]}
          </span>
        </h2>
      </div>

      <ul aria-label="Gdzie dziś leży sposób działania organizacji" className="scatter__field" data-scatter-field>
        {scatter.fragments.map((fragment) => (
          <li
            className={`frag frag--${fragment.kind}`}
            data-frag
            data-r={fragment.r}
            key={fragment.text}
            style={{ "--x": `${fragment.x}%`, "--y": `${fragment.y}%` } as CSSProperties}
          >
            <span className="frag__face frag__face--chaos">
              <span className="frag__icon">{icons[fragment.kind as keyof typeof icons]}</span>
              {fragment.text}
            </span>
            <span aria-hidden="true" className="frag__face frag__face--order">
              <span className="frag__icon">{icons.module}</span>
              {fragment.to}
            </span>
          </li>
        ))}
      </ul>

      <div aria-hidden="true" className="scatter__system" data-scatter-system>
        <span className="scatter__system-frame" data-system-frame />
        <span className="scatter__system-label" data-system-label>
          <OperoMark label="" on="light" />
          {scatter.system}
        </span>
      </div>

      <h2 className="title title--sm scatter__resolve">
        <span className="line" data-scatter-resolve>
          {scatter.resolve[0]}
        </span>{" "}
        <span className="line muted" data-scatter-resolve>
          {scatter.resolve[1]}
        </span>
      </h2>
    </Scene>
  );
}
