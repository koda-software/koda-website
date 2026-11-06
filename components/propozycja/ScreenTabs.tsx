"use client";

import Image from "next/image";
import { useState } from "react";
import { type ScreenName, screens } from "./Screen";

/*
 * A subject told as a row of tabs over one large screen: the life of a
 * document from intake to archive, the way from a query to a dashboard. The
 * reader picks the step, the screen and the sentence change together. All
 * screens are in the page from the start, so switching is instant and the
 * text of every tab is there for search and for readers without scripts.
 */

type Tab = { label: string; title: string; text: string; screen: ScreenName };

export function ScreenTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="screen-tabs">
      <div aria-label="Kroki" className="screen-tabs__list" role="tablist">
        {tabs.map((tab, index) => (
          <button
            aria-controls={`panel-${index}`}
            aria-selected={index === active}
            className="screen-tabs__tab"
            id={`tab-${index}`}
            key={tab.label}
            onClick={() => setActive(index)}
            role="tab"
            type="button"
          >
            <span aria-hidden="true" className="screen-tabs__dot" />
            {tab.label}
          </button>
        ))}
      </div>
      <div className="screen-tabs__panels">
        {tabs.map((tab, index) => {
          const screen = screens[tab.screen];
          return (
            <div
              aria-labelledby={`tab-${index}`}
              className={`screen-tabs__panel ${index === active ? "is-active" : ""}`.trim()}
              id={`panel-${index}`}
              key={tab.label}
              role="tabpanel"
            >
              <div className="screen-tabs__copy">
                <h3 className="screen-tabs__title">{tab.title}</h3>
                <p className="screen-tabs__text">{tab.text}</p>
              </div>
              <div className="screen__frame screen-tabs__frame">
                <Image
                  alt={screen.alt}
                  height={screen.height}
                  sizes="(min-width: 1360px) 1100px, 100vw"
                  src={`/propozycja/screeny/${tab.screen}.webp`}
                  width={screen.width}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
