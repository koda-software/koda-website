import type { Metadata } from "next";
import { ClosingCall, PageHero, TwoTone } from "@/components/propozycja/blocks";
import { about } from "@/components/propozycja/content-pages";
import { Scene } from "@/components/propozycja/Scene";
import { ProposalPage } from "@/components/propozycja/shell/ProposalPage";

export const metadata: Metadata = { title: "O nas · KodaSoft", description: about.hero.lead };

/**
 * About: the company behind the product. KodaSoft speaks here, which is why
 * the page signs with the company lockup and not the product mark alone, and
 * why no partner is named - the materials are signed by the team.
 */
export default function About() {
  return (
    <ProposalPage>
      <PageHero lead={about.hero.lead} title={about.hero.title} />

      <Scene className="section" cut="card" id="skad" prev="dark" tone="light">
        <div className="origin">
          <div>
            <TwoTone lines={about.origin.title} />
            {about.origin.paragraphs.map((paragraph) => (
              <p className="origin__text" data-reveal key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
          <dl className="lessons">
            {about.lessons.map((lesson) => (
              <div className="lesson" data-reveal key={lesson.label}>
                <dt className="mono">{lesson.label}</dt>
                <dd>{lesson.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Scene>

      <Scene className="section mission" cut="fade" id="misja" prev="light" tone="dark">
        <p className="mission__text" data-reveal>
          {about.mission.text}
        </p>
        <p className="lead" data-reveal>
          {about.mission.note}
        </p>
        <div className="section__head mission__beliefs">
          <TwoTone lines={["Sześć przekonań,", "które widać w produkcie."]} />
        </div>
        <ol className="elements">
          {about.beliefs.map((belief) => (
            <li className="element" key={belief.title}>
              <h3 className="element__title">{belief.title}</h3>
              <p className="element__text">{belief.text}</p>
            </li>
          ))}
        </ol>
        <p className="sign" data-reveal>
          {about.sign}
        </p>
      </Scene>

      <ClosingCall cut="iris" prev="dark" />
    </ProposalPage>
  );
}
