import type { Metadata } from "next";
import Link from "next/link";
import { ClosingCall, PageHero, TwoTone } from "@/components/propozycja/blocks";
import { routes } from "@/components/propozycja/content-nav";
import { solutions } from "@/components/propozycja/content-pages";
import { systemArea } from "@/components/propozycja/content-system";
import { IndustryTabs } from "@/components/propozycja/interactive";
import { Scene } from "@/components/propozycja/Scene";
import { ProposalPage } from "@/components/propozycja/shell/ProposalPage";
import { icons } from "@/components/propozycja/ui";

export const metadata: Metadata = { title: "Rozwiązania · KodaSoft", description: solutions.hero.lead };

/**
 * Solutions: by area of work first, then by industry. Areas come first
 * because they are what a reader recognises from their own desk - invoices,
 * contracts, purchases - whatever sector they are in; the industries then say
 * where the same system is shaped differently.
 */
export default function Solutions() {
  return (
    <ProposalPage>
      <PageHero
        lead={solutions.hero.lead}
        screen={{
          name: "analityka-umow",
          caption: "Analityka umów w Demo Firma: portfel umów według typu i etapu, obok modułów zakupów, kancelarii i finansów w tym samym menu.",
        }}
        title={solutions.hero.title}
      />

      <Scene className="section" cut="card" id="obszary" prev="dark" tone="light">
        <div className="section__head">
          <TwoTone lines={["Te same obszary", "w każdej organizacji."]} />
        </div>
        <ul className="work-areas">
          {solutions.areas.map((area) => (
            <li className="work-area" data-reveal key={area.title}>
              <h3 className="work-area__title">{area.title}</h3>
              <p className="work-area__text">{area.text}</p>
              <ul className="ticks">
                {area.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="work-area__links">
                {area.links.map((slug) => {
                  const target = systemArea(slug);
                  return target ? (
                    <Link href={routes.area(slug)} key={slug}>
                      {target.nav} {icons.arrowRight}
                    </Link>
                  ) : null;
                })}
              </p>
            </li>
          ))}
        </ul>
      </Scene>

      <Scene className="section" cut="wipe" id="branze" prev="light" tone="dark">
        <div className="section__head">
          <TwoTone lines={["Ten sam system,", "inny kształt w każdej branży."]} />
        </div>
        <div data-reveal>
          <IndustryTabs industries={solutions.industries} />
        </div>
      </Scene>

      <ClosingCall prev="dark" />
    </ProposalPage>
  );
}
