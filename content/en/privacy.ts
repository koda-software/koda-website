import type { PrivacyContent } from "../types";

/**
 * The Polish text in `content/pl/privacy.ts` is the authoritative version: the
 * controller is a Polish company and a supervisory authority would read that
 * one. This is a faithful translation of it, kept in step section by section.
 *
 * OPEN: see the note in the Polish file about identifying the controller.
 */
export const privacyContent: PrivacyContent = {
  seo: {
    title: "Privacy policy",
    description:
      "How KodaSoft processes the personal data you send through the contact form: what is collected, why, on what legal basis, who processes it, how long it is kept and what rights you have.",
  },
  hero: {
    eyebrow: "Documents",
    title: "Privacy policy",
    description:
      "This site sets no cookies, profiles no visitors and runs no advertising analytics. We collect personal data only when you send it to us yourself, through the contact form.",
  },
  updatedLabel: "Last updated",
  updatedAt: "2026-08-20",
  sections: [
    {
      heading: "1. Data controller",
      paragraphs: [
        "The controller of personal data submitted through this site is KodaSoft, the team behind the Opero platform.",
        "For anything concerning personal data - including exercising the rights described in section 8 - write to kontakt@kodasoft.pl or call +48 666 618 026.",
        "We have not appointed a Data Protection Officer, and we are not required to: we do not process data on a large scale, we do not monitor individuals regularly and systematically, and we process no special categories of data.",
      ],
    },
    {
      heading: "2. What we collect",
      paragraphs: [
        "The contact form is the only place on this site where we ask for personal data. You send us:",
      ],
      list: [
        "your name - required,",
        "your email address - required,",
        "your message - required,",
        "your company name - optional,",
        "your phone number - optional,",
        "the topic you pick from a list - optional.",
      ],
    },
    {
      heading: "3. Technical data sent automatically",
      paragraphs: [
        "Two pieces of information travel with your enquiry that the form does not ask for: the language version of the site and the address of the page you sent it from. They exist so we know which language to reply in and what the enquiry is about.",
        "The form also carries a hidden trap field, invisible to a person. Spam robots fill it in. If it is filled in, the submission is discarded and reaches nobody. This is not processing of personal data - we only check whether the field stayed empty.",
        "Our hosting provider keeps standard server logs containing the IP address, the time of the request and the browser type. These are technical records needed to run the service and keep it secure; we do not combine them with form data and do not use them to identify visitors.",
      ],
    },
    {
      heading: "4. Why we process the data, and on what basis",
      rows: [
        {
          term: "Replying to your enquiry and any sales conversation that follows",
          description:
            "Our legitimate interest under Article 6(1)(f) GDPR, namely handling correspondence addressed to us. If the conversation leads to working together, the basis becomes Article 6(1)(b) GDPR - steps taken before entering into a contract.",
        },
        {
          term: "The consent to be contacted, given when the form is submitted",
          description:
            "Article 6(1)(a) GDPR. You may withdraw it at any time by writing to kontakt@kodasoft.pl. Withdrawal does not affect the lawfulness of processing carried out beforehand.",
        },
        {
          term: "Keeping the site secure and free of abuse",
          description:
            "Our legitimate interest under Article 6(1)(f) GDPR in keeping the service running and filtering out automated submissions.",
        },
        {
          term: "Obligations imposed by law",
          description:
            "Article 6(1)(c) GDPR, where legislation - tax or accounting rules, for instance - requires us to retain particular records.",
        },
      ],
    },
    {
      heading: "5. How long we keep it",
      paragraphs: [
        "A form submission arrives in our mailbox as an email. The site stores it in no database of its own - once the message is sent, nothing of it remains on the website side.",
        "Correspondence that did not lead to working together is deleted no later than 24 months after the last contact.",
        "Where a contract was concluded, data relating to its performance is kept for the period required by law - tax and accounting rules in particular - and then until the relevant limitation periods expire.",
        "Server logs are retained by our hosting provider under its own retention policy, typically for a period counted in days.",
      ],
    },
    {
      heading: "6. Who else processes the data",
      paragraphs: [
        "We do not sell data and we do not share it for marketing. We rely on two providers, without which the site could not operate:",
      ],
      rows: [
        {
          term: "Vercel Inc.",
          description:
            "Hosting for the site and measurement of page loading speed. Processes the technical data described in section 3.",
        },
        {
          term: "Resend (Plus Five Five, Inc.)",
          description:
            "Delivery of the email generated by the contact form. Processes what you typed into the form, solely in order to deliver it to our mailbox.",
        },
      ],
    },
    {
      heading: "7. Transfers outside the European Economic Area",
      paragraphs: [
        "Both providers named above are established in the United States, so data may be processed outside the European Economic Area.",
        "Such transfers rely on the safeguards set out in Chapter V GDPR - standard contractual clauses approved by the European Commission, or the adequacy decision covering the EU-US Data Privacy Framework - as set out in the data processing agreements concluded with those providers.",
        "We will provide a copy of the safeguards in place on request sent to kontakt@kodasoft.pl.",
      ],
    },
    {
      heading: "8. Your rights",
      paragraphs: ["In relation to your data you have the right to:"],
      list: [
        "access it and obtain a copy,",
        "have inaccurate data corrected and incomplete data completed,",
        "have it erased,",
        "have its processing restricted,",
        "object to processing based on legitimate interest,",
        "have data processed on the basis of consent or a contract ported elsewhere,",
        "withdraw consent at any time, without affecting the lawfulness of earlier processing,",
        "lodge a complaint with the President of the Personal Data Protection Office, ul. Stawki 2, 00-193 Warsaw, Poland.",
      ],
    },
    {
      heading: "9. Is providing data mandatory",
      paragraphs: [
        "Providing data is entirely voluntary, but without a name, an email address and a message we cannot answer the enquiry. The remaining fields may be left blank.",
        "We take no automated decisions and we do not profile visitors to the site.",
      ],
    },
    {
      heading: "10. Cookies and tracking technologies",
      paragraphs: [
        "This site stores no cookies and uses no browser local storage. There is no cookie consent banner here because there is nothing to consent to.",
        "We embed no tracking scripts, advertising pixels or analytics tools that profile visitors.",
        "The typeface used on the site is bundled onto our own server when the site is built. Your browser makes no request to a third party to load it.",
        "The only measurement in place is Vercel Speed Insights, which collects anonymous page-speed metrics such as how long the largest element takes to appear. It uses no cookies and cannot identify an individual.",
      ],
    },
    {
      heading: "11. Links to other sites",
      paragraphs: [
        "The site links to external pages, including the KodaSoft profile on LinkedIn and the technical documentation. Once you open them, the privacy policies of those services apply, and we have no control over them.",
      ],
    },
    {
      heading: "12. Changes to this policy",
      paragraphs: [
        "We update this policy whenever the way the site works changes - when a new tool that processes data is added, for instance. The date of the last update appears at the top of the document.",
        "Earlier versions are available on request sent to kontakt@kodasoft.pl.",
      ],
    },
  ],
};
