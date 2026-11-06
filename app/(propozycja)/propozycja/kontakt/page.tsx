import type { Metadata } from "next";
import { PageHero } from "@/components/propozycja/blocks";
import { contactDetails } from "@/components/propozycja/content-nav";
import { contact } from "@/components/propozycja/content-pages";
import { ProposalContactForm } from "@/components/propozycja/interactive";
import { Scene } from "@/components/propozycja/Scene";
import { ProposalPage } from "@/components/propozycja/shell/ProposalPage";

export const metadata: Metadata = { title: "Kontakt · KodaSoft", description: contact.hero.lead };

/**
 * Contact. Short on purpose: a reader who opened this page has decided, and
 * the page's job is to not get in their way. The form, what happens after it,
 * and the direct lines for anyone who would rather write or call.
 */
export default function Contact() {
  return (
    <ProposalPage>
      <PageHero actions={false} lead={contact.hero.lead} title={contact.hero.title} />

      <Scene className="section contact" cut="card" id="formularz" prev="dark" tone="light">
        <div className="contact__form" data-reveal>
          <ProposalContactForm notice={contact.proposalNotice} topics={contact.topics} />
        </div>
        <aside className="contact__side">
          <p className="label" data-reveal>
            Co dalej
          </p>
          <ol className="next">
            {contact.next.map((step, index) => (
              <li className="next__step" data-reveal data-state={index === 0 ? "current" : "future"} key={step.title}>
                <span className="next__dot" />
                <span className="next__title">{step.title}</span>
                <span className="next__text">{step.text}</span>
              </li>
            ))}
          </ol>
          <div className="contact__direct" data-reveal>
            <p className="label">Wolicie bezpośrednio</p>
            <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>
            <a href={`tel:${contactDetails.phone.replace(/\s/g, "")}`}>{contactDetails.phone}</a>
          </div>
        </aside>
      </Scene>
    </ProposalPage>
  );
}
