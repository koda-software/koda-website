import { ClosingCall, Faq, Outcomes, PageHero, Related, TwoTone } from "../blocks";
import { routes } from "../content-nav";
import { type SystemArea, systemArea } from "../content-system";
import { areaStories } from "../content-stories";
import { Scene } from "../Scene";
import { Ai } from "../scenes/Ai";
import { Build } from "../scenes/Build";
import { Control } from "../scenes/Control";
import { Process } from "../scenes/Process";
import { showcaseCards } from "../ShowcaseCards";
import { Story } from "../Story";
import { ProposalPage } from "../shell/ProposalPage";

/** Scenes from the home page that a system area is built around, and their tone. */
const sceneTones = { process: "light", build: "dark", ai: "light", control: "dark" } as const;

/**
 * One area of the system, as a page.
 *
 * It opens on a real screen of the area and then tells it as a story, step
 * by step on the screens where each step happens. After the story come the
 * animated showcase, what changes for the organisation, and the questions.
 * The planes alternate graphite and mist: since four of the showcases are
 * fixed-tone scenes from the home page, the order of the showcase and the
 * comparison follows from them, so two planes of the same tone never meet.
 */
export function SystemAreaPage({ area }: { area: SystemArea }) {
  const story = areaStories[area.slug];
  const sceneTone = area.showcase in sceneTones ? sceneTones[area.showcase as keyof typeof sceneTones] : "light";
  const showcaseFirst = sceneTone === "dark";

  const showcase = <Showcase area={area} prev={showcaseFirst ? "light" : "dark"} />;
  const outcomes = (
    <Outcomes
      cut={showcaseFirst ? "card" : "fade"}
      id="zmiana"
      items={area.outcomes}
      prev={showcaseFirst ? "dark" : "light"}
      title={["Tak wygląda to dziś.", "Tak wygląda w Opero."]}
      tone={showcaseFirst ? "light" : "dark"}
    />
  );

  const related = area.related
    .map((slug) => systemArea(slug))
    .filter((item): item is SystemArea => Boolean(item))
    .map((item) => ({ href: routes.area(item.slug), label: item.nav, text: item.blurb }));

  return (
    <ProposalPage>
      <PageHero lead={area.lead} screen={story?.hero} title={area.title} />
      {story ? (
        <Scene className="section" cut="card" id="opowiesc" prev="dark" tone="light">
          <div className="section__head">
            <TwoTone lines={story.title} />
          </div>
          <Story steps={story.steps} />
        </Scene>
      ) : null}
      {showcaseFirst ? showcase : outcomes}
      {showcaseFirst ? outcomes : showcase}
      <Scene className="section section--split" cut="curtain" id="pytania" prev="light" tone="dark">
        <Faq items={area.faq} />
        <Related items={related} title="Następne obszary" />
      </Scene>
      <ClosingCall prev="dark" />
    </ProposalPage>
  );
}

function Showcase({ area, prev }: { area: SystemArea; prev: "dark" | "light" }) {
  switch (area.showcase) {
    case "process":
      return <Process cut="card" id="pokaz" prev={prev} />;
    case "build":
      return <Build cut="curtain" id="pokaz" prev={prev} />;
    case "ai":
      return <Ai cut="card" id="pokaz" prev={prev} />;
    case "control":
      return <Control cut="curtain" id="pokaz" prev={prev} />;
    default: {
      const Card = showcaseCards[area.showcase];
      return (
        <Scene className="section showcase-scene" cut="card" id="pokaz" prev={prev} tone="light">
          <div className="showcase-scene__copy">
            <p className="showcase-scene__lead" data-reveal>
              {area.outcomes[0].after}
            </p>
            <p className="showcase-scene__note" data-reveal>
              Dane pokazowe z organizacji Demo Firma.
            </p>
          </div>
          <div className="showcase-scene__card">
            <Card />
          </div>
        </Scene>
      );
    }
  }
}
