import { ClosingCall, Faq, Outcomes, PageHero, Related, TwoTone } from "../blocks";
import { landings, type LandingSection } from "../content-landings";
import { routes } from "../content-nav";
import { type SystemArea, systemArea } from "../content-system";
import { areaStories } from "../content-stories";
import { LandingArticle, LandingCards, LandingCompare, LandingPins, LandingRows, LandingStatement, LandingTabs } from "../landing";
import { type Cut, Scene } from "../Scene";
import { Ai } from "../scenes/Ai";
import { Build } from "../scenes/Build";
import { Control } from "../scenes/Control";
import { Process } from "../scenes/Process";
import { ProposalPage } from "../shell/ProposalPage";
import { Story } from "../Story";

type Tone = "dark" | "light";

/* The cuts alternate down the page, so no two arrivals in a row look the
   same. Both keep the arriving section fully opaque: a fade between graphite
   and mist passes through grey, which on a page of text reads as a fault. */
const cuts: Cut[] = ["card", "wipe"];

/**
 * One area of Opero, as a landing page of its own.
 *
 * The banner and the questions at the end are the frame every page shares.
 * What is between them comes from the page's own list in content-landings,
 * so every area is told with the sections that suit it, in its own order.
 * The tones alternate from the graphite banner down; the lists are written
 * so that the last section before the questions is mist.
 */
export function SystemAreaPage({ area }: { area: SystemArea }) {
  const landing = landings[area.slug];
  const related = area.related
    .map((slug) => systemArea(slug))
    .filter((item): item is SystemArea => Boolean(item))
    .map((item) => ({ href: routes.area(item.slug), label: item.nav, text: item.blurb }));

  return (
    <ProposalPage>
      <PageHero
        layout={landing.hero.layout}
        lead={landing.hero.lead}
        screen={{ name: landing.hero.screen, caption: landing.hero.caption }}
        title={landing.hero.title}
      />
      {landing.sections.map((section, index) => {
        const tone: Tone = index % 2 === 0 ? "light" : "dark";
        const prev: Tone = tone === "light" ? "dark" : "light";
        const frame = { id: `s${index + 1}`, cut: cuts[index % cuts.length], prev, tone };
        return <Section area={area} frame={frame} key={frame.id} section={section} />;
      })}
      <Scene className="section section--split" cut="curtain" id="pytania" prev="light" tone="dark">
        <Faq items={area.faq} />
        <Related items={related} title="Następne obszary" />
      </Scene>
      <ClosingCall prev="dark" />
    </ProposalPage>
  );
}

function Section({
  area,
  frame,
  section,
}: {
  area: SystemArea;
  frame: { id: string; cut: Cut; prev: Tone; tone: Tone };
  section: LandingSection;
}) {
  switch (section.kind) {
    case "story": {
      const story = areaStories[area.slug];
      return story ? (
        <Scene className="section" {...frame}>
          <div className="section__head">
            <TwoTone lines={story.title} />
          </div>
          <Story steps={story.steps} />
        </Scene>
      ) : null;
    }
    case "showcase":
      return <Showcase area={area} frame={frame} />;
    case "outcomes":
      return <Outcomes {...frame} items={area.outcomes} title={["Tak wygląda to dziś.", "Tak wygląda w Opero."]} />;
    case "cards":
      return <LandingCards frame={frame} section={section} />;
    case "tabs":
      return <LandingTabs frame={frame} section={section} />;
    case "rows":
      return <LandingRows frame={frame} section={section} />;
    case "pins":
      return <LandingPins frame={frame} section={section} />;
    case "compare":
      return <LandingCompare frame={frame} section={section} />;
    case "statement":
      return <LandingStatement frame={frame} section={section} />;
    case "article":
      return <LandingArticle frame={frame} section={section} />;
  }
}

/* The animated scenes from the home page have a fixed tone; the landing lists
   put them where the alternation already wants that tone. */
function Showcase({ area, frame }: { area: SystemArea; frame: { id: string; cut: Cut; prev: Tone } }) {
  const { id, cut, prev } = frame;
  switch (area.showcase) {
    case "process":
      return <Process cut={cut} id={id} prev={prev} />;
    case "build":
      return <Build cut={cut} id={id} prev={prev} />;
    case "ai":
      return <Ai cut={cut} id={id} prev={prev} />;
    case "control":
      return <Control cut={cut} id={id} prev={prev} />;
    default:
      return null;
  }
}
