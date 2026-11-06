import type { Metadata } from "next";
import Link from "next/link";
import { Faq, PageHero, TwoTone } from "@/components/propozycja/blocks";
import { routes } from "@/components/propozycja/content-nav";
import { implementation } from "@/components/propozycja/content-pages";
import { Scene } from "@/components/propozycja/Scene";
import { ProposalPage } from "@/components/propozycja/shell/ProposalPage";
import { icons } from "@/components/propozycja/ui";

export const metadata: Metadata = { title: "Wdrożenie · KodaSoft", description: implementation.hero.lead };

/**
 * Implementation, told as the process it is. The five stages run down the
 * page on one rule that draws itself as it scrolls, the first stage marked as
 * the reader's. Then the principles behind it, including the one thing Opero
 * does not do - said first, the way the brand book asks for a weakness to be
 * named - and the questions, with the action in the same section, because
 * this page is itself the way in.
 */
export default function Implementation() {
  return (
    <ProposalPage>
      <PageHero
        lead={implementation.hero.lead}
        screen={{
          name: "proces-wizualny",
          caption: "Wdrożenie kończy się konfiguracją, którą widać: proces „Obieg umowy” w Demo Firma, od projektu do zakończenia.",
        }}
        title={implementation.hero.title}
      />

      <Scene className="section" cut="card" id="etapy" prev="dark" tone="light">
        <div className="section__head">
          <TwoTone lines={["Pięć etapów,", "z wynikiem na końcu każdego."]} />
        </div>
        <div className="steps" data-path>
          <span aria-hidden="true" className="steps__rule">
            <span className="path__rule-fill" data-path-fill />
          </span>
          <ol>
            {implementation.stages.map((stage, index) => (
              <li className="step" data-path-step data-state={index === 0 ? "current" : "future"} key={stage.name}>
                <span className="step__num mono">{String(index + 1).padStart(2, "0")}</span>
                <div className="step__body">
                  <h3 className="step__name">
                    {stage.name}
                    {index === 0 ? <span className="path__here">Tu jesteście</span> : null}
                  </h3>
                  <p className="step__text">{stage.text}</p>
                  <p className="step__result">
                    {icons.check}
                    {stage.result}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Scene>

      <Scene className="section" cut="curtain" id="zasady" prev="light" tone="dark">
        <div className="section__head">
          <TwoTone lines={["Jak prowadzimy wdrożenie,", "żeby ryzyko było policzalne."]} />
        </div>
        <ul className="principles">
          {implementation.principles.map((principle) => (
            <li className="principle" data-reveal key={principle.title}>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </li>
          ))}
        </ul>
        <div className="limits" data-reveal>
          <p className="limits__title">{implementation.limits.title}</p>
          <p className="limits__text">{implementation.limits.text}</p>
        </div>
      </Scene>

      <Scene className="section section--split" cut="fade" id="pytania" prev="dark" tone="light">
        <Faq items={implementation.faq} />
        <div className="cta-card" data-reveal>
          <p className="closing__here">
            <span aria-hidden="true" className="closing__dot" />
            Pierwszy etap: rozmowa diagnostyczna
          </p>
          <p className="cta-card__title">Pokaż nam jeden proces.</p>
          <p className="cta-card__text">Rozmowa trwa tyle, ile trzeba, żeby zrozumieć jeden proces. Bez prezentacji handlowej.</p>
          <Link className="btn btn--ink" href={routes.contact}>
            Umów rozmowę {icons.arrowRight}
          </Link>
        </div>
      </Scene>
    </ProposalPage>
  );
}
