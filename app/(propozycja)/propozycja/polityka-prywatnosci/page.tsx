import type { Metadata } from "next";
import { PageHero } from "@/components/propozycja/blocks";
import { Scene } from "@/components/propozycja/Scene";
import { ProposalPage } from "@/components/propozycja/shell/ProposalPage";
import { privacyContent } from "@/content/pl/privacy";

export const metadata: Metadata = { title: "Polityka prywatności · KodaSoft", description: privacyContent.seo.description };

/**
 * The privacy policy, set as a document: the real text of the live policy,
 * unchanged, in the proposal's type. Legal text is not rewritten for a design
 * proposal - only its typography is.
 */
export default function Privacy() {
  return (
    <ProposalPage>
      <PageHero
        actions={false}
        lead={privacyContent.hero.description}
        title={["Polityka", "prywatności."]}
      />
      <Scene className="section doc" cut="card" id="dokument" prev="dark" tone="light">
        <nav aria-label="Spis treści" className="doc__toc">
          <p className="label">Spis treści</p>
          <ol>
            {privacyContent.sections.map((section, index) => (
              <li key={section.heading}>
                <a href={`#punkt-${index + 1}`}>{section.heading}</a>
              </li>
            ))}
          </ol>
        </nav>
        <article className="doc__body">
          <p className="doc__updated mono">
            {privacyContent.updatedLabel}: {privacyContent.updatedAt}
          </p>
          {privacyContent.sections.map((section, index) => (
            <section id={`punkt-${index + 1}`} key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.list ? (
                <ul>
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {section.rows ? (
                <dl className="doc__rows">
                  {section.rows.map((row) => (
                    <div key={row.term}>
                      <dt>{row.term}</dt>
                      <dd>{row.description}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </section>
          ))}
        </article>
      </Scene>
    </ProposalPage>
  );
}
