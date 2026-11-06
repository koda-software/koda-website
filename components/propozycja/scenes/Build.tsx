import { build } from "../content";
import { type Cut, Scene } from "../Scene";
import { icons } from "../ui";

const blockIcons = [icons.field, icons.form, icons.flow, icons.rule, icons.chart];

/**
 * 04 · Budowa.
 *
 * A custom module coming into being, in two movements. First the building
 * blocks light up one after another - fields, a form, a process, rules, a
 * report - and the module's records drop into place. Then the same six
 * records travel between three views of the module, a list, a board by stage
 * and a calendar by date, each card flying from where it was to where it now
 * belongs rather than the view being swapped out. The same data, three ways of
 * looking at it, and no rebuild between them.
 *
 * The headline's last word rolls through the areas a module could be for, as
 * the scroll runs: contracts, purchases, leave requests, complaints.
 */
export function Build({ id = "budowa", cut = "curtain", prev = "light" }: { id?: string; cut?: Cut; prev?: "dark" | "light" } = {}) {
  return (
    <Scene className="build" cut={cut} id={id} kind="build" prev={prev} stage tone="dark">
      <div className="build__copy">
        <h2 className="title">
          <span className="line" data-reveal>
            {build.title}
          </span>{" "}
          <span className="roller" data-roller data-reveal>
            {build.words.map((word) => (
              <span className="roller__word" data-roller-word key={word}>
                {word}
              </span>
            ))}
          </span>
        </h2>
        <p className="lead" data-reveal>
          {build.lead}
        </p>
      </div>

      <div className="window workspace" data-workspace data-reveal="scale">
        <div className="window__bar">
          <span className="workspace__name">
            {icons.module}
            {build.moduleName}
          </span>
          <span className="views" data-views>
            {build.views.map((view, index) => (
              <span className="views__tab" data-active={index === 0} data-view-tab={index} key={view}>
                {view}
              </span>
            ))}
          </span>
        </div>
        <ul aria-label="Elementy modułu" className="blocks">
          {build.blocks.map((block, index) => (
            <li className="block" data-block key={block}>
              {blockIcons[index]}
              {block}
            </li>
          ))}
        </ul>
        <div className="board" data-board>
          <div aria-hidden="true" className="board__guides">
            <div className="guides guides--board" data-guides="board">
              {build.columns.map((column) => (
                <span key={column}>{column}</span>
              ))}
            </div>
            <div className="guides guides--calendar" data-guides="calendar">
              {Array.from({ length: 28 }, (_, day) => (
                <span key={day}>{day + 1}</span>
              ))}
            </div>
          </div>
          {build.records.map((record, index) => (
            <div className="rec" data-col={record.column} data-day={record.day} data-rec={index} key={record.ref}>
              <span className="rec__ref mono">{record.ref}</span>
              <span className="rec__title">{record.title}</span>
              <span className="rec__amount mono">{record.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </Scene>
  );
}
