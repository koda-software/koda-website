"use client";

import { type FormEvent, type KeyboardEvent, useId, useRef, useState } from "react";
import { icons } from "./ui";

type Industry = { name: string; lead: string; uses: string[]; built: string[] };

/**
 * The industry switcher on the Solutions page.
 *
 * A proper tab list: arrow keys move between tabs, Home and End jump to the
 * ends, and only the active panel is in the reading order. The panel
 * crossfades rather than snapping, which is the one piece of motion here,
 * and it is a CSS transition the reduced-motion rule switches off.
 */
export function IndustryTabs({ industries }: { industries: Industry[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const id = useId();

  const onKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = industries.length - 1;
    const next =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? (active + 1) % industries.length
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? (active - 1 + industries.length) % industries.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="industries">
      <div aria-label="Branże" className="industries__tabs" role="tablist">
        {industries.map((industry, index) => (
          <button
            aria-controls={`${id}-panel-${index}`}
            aria-selected={index === active}
            className="industries__tab"
            id={`${id}-tab-${index}`}
            key={industry.name}
            onClick={() => setActive(index)}
            onKeyDown={onKey}
            ref={(el) => {
              tabs.current[index] = el;
            }}
            role="tab"
            tabIndex={index === active ? 0 : -1}
            type="button"
          >
            {industry.name}
          </button>
        ))}
      </div>
      {industries.map((industry, index) => (
        <div
          aria-labelledby={`${id}-tab-${index}`}
          className={`industries__panel ${index === active ? "is-active" : ""}`.trim()}
          hidden={index !== active}
          id={`${id}-panel-${index}`}
          key={industry.name}
          role="tabpanel"
        >
          <p className="industries__lead">{industry.lead}</p>
          <div className="industries__cols">
            <div>
              <p className="industries__title">Typowe zastosowania</p>
              <ul className="ticks">
                {industry.uses.map((use) => (
                  <li key={use}>{use}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="industries__title">Na czym to stoi w Opero</p>
              <ul className="ticks">
                {industry.built.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * The contact form, built to be shown, not to send.
 *
 * This is a proposal: posting to the live contact endpoint would email the
 * company every time someone tried the page. The form validates the way the
 * real one would and then says plainly that nothing was sent. Wiring it to
 * `/api/contact` is one `fetch` when the proposal becomes the site.
 */
export function ProposalContactForm({ topics, notice }: { topics: string[]; notice: string }) {
  const [status, setStatus] = useState<"idle" | "invalid" | "shown">("idle");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus(form.checkValidity() ? "shown" : "invalid");
    if (!form.checkValidity()) form.reportValidity();
  };

  return (
    <form className="form" noValidate onSubmit={onSubmit}>
      <div className="form__row">
        <label className="form__field">
          <span>
            Imię i nazwisko <em>wymagane</em>
          </span>
          <input autoComplete="name" name="name" required type="text" />
        </label>
        <label className="form__field">
          <span>Firma</span>
          <input autoComplete="organization" name="company" type="text" />
        </label>
      </div>
      <div className="form__row">
        <label className="form__field">
          <span>
            E-mail <em>wymagane</em>
          </span>
          <input autoComplete="email" name="email" required type="email" />
        </label>
        <label className="form__field">
          <span>Telefon</span>
          <input autoComplete="tel" name="phone" type="tel" />
        </label>
      </div>
      <fieldset className="form__topics">
        <legend>Czego dotyczy rozmowa</legend>
        {topics.map((topic, index) => (
          <label className="form__topic" key={topic}>
            <input defaultChecked={index === 0} name="topic" type="radio" value={topic} />
            <span>{topic}</span>
          </label>
        ))}
      </fieldset>
      <label className="form__field">
        <span>
          Jaki proces chcecie uporządkować? <em>wymagane</em>
        </span>
        <textarea name="message" required rows={5} />
      </label>
      <div className="form__foot">
        <button className="btn btn--ink" type="submit">
          Wyślij {icons.arrowRight}
        </button>
        <p aria-live="polite" className={`form__status ${status !== "idle" ? "is-visible" : ""}`.trim()} role="status">
          {status === "invalid" ? "Uzupełnij wymagane pola." : status === "shown" ? notice : ""}
        </p>
      </div>
    </form>
  );
}
