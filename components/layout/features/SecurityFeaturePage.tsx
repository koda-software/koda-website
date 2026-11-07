import Image from "next/image";
import BotIcon from "lucide-react/dist/esm/icons/bot.mjs";
import KeyRoundIcon from "lucide-react/dist/esm/icons/key-round.mjs";
import LockKeyholeIcon from "lucide-react/dist/esm/icons/lock-keyhole.mjs";
import LogInIcon from "lucide-react/dist/esm/icons/log-in.mjs";
import { ArrivingSection } from "@/components/landing/ArrivingSection";
import { BrowserFrame } from "@/components/landing/BrowserFrame";
import { HeroEdgeVisual } from "@/components/landing/HeroDashboardMock";
import { LandingHero } from "@/components/landing/LandingPrimitives";
import { TwoTone } from "@/components/landing/TwoTone";
import {
  BulletList,
  FeatureFaqSection,
  FeatureFinalCtaSection,
  FeatureRelatedSection,
  bodyClass,
  sectionClass,
  titleClass,
} from "@/components/layout/FeaturePageSections";
import { SecurityViews } from "@/components/layout/features/security/SecurityViews";
import type { SecurityEntryIcon, SecurityImage, SecurityPageContent } from "@/content/feature-stories/security.types";
import type { Locale } from "@/lib/i18n/config";

type SecurityFeaturePageProps = {
  content: SecurityPageContent;
  locale: Locale;
  primaryHref: string;
  secondaryHref: string;
};

const darkTitleClass = "m-0 max-w-[940px] text-[clamp(2.15rem,4.4vw,3.9rem)] leading-[1.02] tracking-[-0.04em] text-white";
const darkBodyClass = "m-0 max-w-[46rem] text-[1.04rem] leading-[1.72] text-white/62";
const darkSurfaceClass = "isolate border-y border-white/8 bg-[var(--color-surface-dark)] [background-image:var(--gradient-hero)] text-white";

const entryIcons: Record<SecurityEntryIcon, typeof LogInIcon> = {
  sso: LogInIcon,
  mfa: LockKeyholeIcon,
  tokens: KeyRoundIcon,
  agents: BotIcon,
};

function Screenshot({ image, sizes }: { image: SecurityImage; sizes: string }) {
  return (
    <BrowserFrame
      chromeClassName="h-11 bg-[#eef2f5]"
      className="rounded-[12px] border border-[rgba(11,17,22,0.12)] bg-white shadow-[0_28px_70px_-34px_rgba(7,26,43,0.5),0_12px_28px_-20px_rgba(7,26,43,0.25)]"
      data-reveal
    >
      <Image alt={image.alt} className="block h-auto w-full" height={image.height} sizes={sizes} src={image.src} width={image.width} />
    </BrowserFrame>
  );
}

function ProblemSection({ problem }: { problem: SecurityPageContent["problem"] }) {
  return (
    <ArrivingSection className="bg-[var(--color-mist)]" cut="card" id="problem">
      <div className={sectionClass}>
        <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-start gap-[clamp(2.5rem,6vw,6rem)] max-[980px]:grid-cols-1">
          <h2 className={titleClass} data-reveal="left"><TwoTone text={problem.title} /></h2>
          <div data-reveal="right">
            <ul className="m-0 grid list-none gap-5 p-0">
              {problem.points.map((point) => (
                <li className="border-l-2 border-[rgba(56,182,255,0.45)] pl-4 text-[1.04rem] leading-[1.6] text-[var(--color-muted)]" key={point}>{point}</li>
              ))}
            </ul>
            <p className="mb-0 mt-8 text-[1.14rem] font-medium leading-[1.5] text-[var(--color-ink)]">{problem.solution}</p>
          </div>
        </div>
      </div>
    </ArrivingSection>
  );
}

function ViewsSection({ views }: { views: SecurityPageContent["views"] }) {
  return (
    <ArrivingSection cut="curtain" id="views">
      <div className={sectionClass}>
        <div className="text-center" data-reveal>
          <h2 className={`${titleClass} mx-auto`} data-arrive><TwoTone text={views.title} /></h2>
          <p className={`${bodyClass} mx-auto mt-6`} data-arrive>{views.description}</p>
          <p className="mb-0 mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.09em] text-[#1e5278]">{views.exampleLabel}</p>
        </div>
        <div className="mt-8">
          <SecurityViews views={views} />
        </div>
        <p className="mx-auto mb-0 mt-8 max-w-[52rem] text-center text-[0.9rem] leading-[1.6] text-[var(--color-muted)]" data-reveal>{views.note}</p>
      </div>
    </ArrivingSection>
  );
}

function ScenariosSection({ scenarios }: { scenarios: SecurityPageContent["scenarios"] }) {
  return (
    <ArrivingSection className={darkSurfaceClass} cut="wipe" id="scenarios">
      <div className={sectionClass}>
        <div data-reveal>
          <h2 className={darkTitleClass} data-arrive><TwoTone text={scenarios.title} /></h2>
          <p className={`${darkBodyClass} mt-7`} data-arrive>{scenarios.description}</p>
        </div>
        <div className="mt-[clamp(2.5rem,5vw,4rem)]">
          <div className="grid grid-cols-[minmax(9rem,0.45fr)_minmax(0,1.1fr)_minmax(0,1fr)] gap-6 pb-3 text-[0.7rem] font-semibold uppercase tracking-[0.09em] text-white/45 max-[900px]:hidden">
            <span>{scenarios.headers.area}</span>
            <span>{scenarios.headers.rule}</span>
            <span>{scenarios.headers.how}</span>
          </div>
          {scenarios.items.map((item) => (
            <div className="grid grid-cols-[minmax(9rem,0.45fr)_minmax(0,1.1fr)_minmax(0,1fr)] gap-6 border-t border-white/10 py-6 max-[900px]:grid-cols-1 max-[900px]:gap-2" data-reveal key={item.area}>
              <h3 className="m-0 text-[0.95rem] font-medium text-[var(--color-blue-soft)]">{item.area}</h3>
              <p className="m-0 text-[1.16rem] leading-[1.4] tracking-[-0.01em] text-white">{item.rule}</p>
              <p className="m-0 text-[0.92rem] leading-[1.6] text-white/58">{item.how}</p>
            </div>
          ))}
        </div>
        <p className="mb-0 mt-6 border-t border-white/10 pt-6 text-[0.84rem] leading-[1.55] text-white/45">{scenarios.disclaimer}</p>
      </div>
    </ArrivingSection>
  );
}

function LayersSection({ layers }: { layers: SecurityPageContent["layers"] }) {
  return (
    <ArrivingSection cut="curtain" id="layers">
      <div className={sectionClass}>
        <div className="grid grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] items-start gap-[clamp(2.5rem,5vw,5rem)] max-[980px]:grid-cols-1">
          <div data-reveal="left">
            <h2 className={titleClass}><TwoTone text={layers.title} /></h2>
            <p className={`${bodyClass} mt-7`}>{layers.description}</p>
            <ol className="mb-0 mt-9 grid list-none gap-6 p-0">
              {layers.items.map((item, index) => (
                <li className="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3" key={item.title}>
                  <span className="text-[0.82rem] font-semibold leading-[1.75] text-[var(--color-blue)]">{index + 1}</span>
                  <div>
                    <h3 className="m-0 text-[1.08rem] font-semibold text-[var(--color-ink)]">{item.title}</h3>
                    <p className="mb-0 mt-1 text-[0.94rem] leading-[1.6] text-[var(--color-muted)]">{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-[var(--radius-panel)] bg-[var(--color-mist)] p-[clamp(1.25rem,3vw,2.25rem)] min-[981px]:sticky min-[981px]:top-28" data-arrive="right">
            <Image alt={layers.diagnostics.image.alt} className="block h-auto w-full rounded-[12px] border border-[rgba(11,17,22,0.1)] shadow-[0_24px_60px_-36px_rgba(7,26,43,0.5)]" height={layers.diagnostics.image.height} sizes="(max-width: 980px) 100vw, 50vw" src={layers.diagnostics.image.src} width={layers.diagnostics.image.width} />
            <h3 className="m-0 mt-7 text-[clamp(1.3rem,2vw,1.6rem)] font-semibold leading-[1.2] tracking-[-0.025em] text-[var(--color-ink)]">{layers.diagnostics.title}</h3>
            <p className="mb-0 mt-3 text-[0.96rem] leading-[1.62] text-[var(--color-muted)]">{layers.diagnostics.description}</p>
          </div>
        </div>
      </div>
    </ArrivingSection>
  );
}

function AuditSection({ audit }: { audit: SecurityPageContent["audit"] }) {
  return (
    <ArrivingSection className="border-t border-[rgba(11,17,22,0.09)] bg-[var(--color-mist)]" cut="slide" id="audit">
      <div className={sectionClass}>
        <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-end gap-x-[clamp(2rem,5vw,5rem)] gap-y-6 max-[980px]:grid-cols-1" data-reveal>
          <h2 className={titleClass}><TwoTone text={audit.title} /></h2>
          <p className={bodyClass}>{audit.description}</p>
        </div>
        <div className="mt-[clamp(2.5rem,5vw,4rem)] grid grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)] items-start gap-5 max-[980px]:grid-cols-1" data-arrive>
          <Screenshot image={audit.images.log} sizes="(max-width: 980px) 100vw, 62vw" />
          <Screenshot image={audit.images.history} sizes="(max-width: 980px) 100vw, 34vw" />
        </div>
        <div className="mt-[clamp(2.5rem,5vw,3.5rem)] grid grid-cols-3 gap-x-8 gap-y-7 max-[860px]:grid-cols-1">
          {audit.points.map((point) => (
            <div className="border-t border-[rgba(11,17,22,0.14)] pt-5" data-reveal key={point.title}>
              <h3 className="m-0 text-[1.05rem] font-semibold text-[var(--color-ink)]">{point.title}</h3>
              <p className="mb-0 mt-2 text-[0.92rem] leading-[1.6] text-[var(--color-muted)]">{point.description}</p>
            </div>
          ))}
        </div>
        <p className="mb-0 mt-9 max-w-[52rem] text-[0.9rem] leading-[1.6] text-[var(--color-ink-soft)]" data-reveal>{audit.note}</p>
      </div>
    </ArrivingSection>
  );
}

function QuestionsSection({ questions }: { questions: SecurityPageContent["questions"] }) {
  return (
    <ArrivingSection className="bg-[var(--color-surface-dark)] text-white" cut="steps" id="questions">
      <div className={sectionClass}>
        <h2 className={darkTitleClass} data-reveal><TwoTone text={questions.title} /></h2>
        <dl className="m-0 mt-[clamp(2.5rem,5vw,4rem)] grid grid-cols-2 gap-x-[clamp(2rem,5vw,5rem)] gap-y-10 max-[860px]:grid-cols-1">
          {questions.items.map((item) => (
            <div data-reveal key={item.question}>
              <dt className="w-fit rounded-[16px] rounded-bl-[4px] bg-white/[0.08] px-4 py-2.5 text-[1.04rem] leading-[1.35] text-white">{item.question}</dt>
              <dd className="m-0 mt-3 pl-1 text-[0.94rem] leading-[1.6] text-white/60">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </ArrivingSection>
  );
}

function GroupSection({ group }: { group: SecurityPageContent["group"] }) {
  return (
    <ArrivingSection cut="curtain" id="companies">
      <div className={`${sectionClass} grid grid-cols-[minmax(28rem,1.18fr)_minmax(0,0.82fr)] items-center gap-[clamp(2rem,4vw,4rem)] max-[980px]:grid-cols-1`}>
        <div className="min-w-0 max-[980px]:order-2" data-arrive>
          <Screenshot image={group.image} sizes="(max-width: 980px) 100vw, 58vw" />
        </div>
        <div data-reveal="right">
          <h2 className={titleClass}><TwoTone text={group.title} /></h2>
          <p className={`${bodyClass} mt-7`}>{group.description}</p>
          <BulletList items={group.bullets} />
        </div>
      </div>
    </ArrivingSection>
  );
}

function EntrySection({ entry }: { entry: SecurityPageContent["entry"] }) {
  return (
    <ArrivingSection className="border-t border-[rgba(11,17,22,0.09)] bg-[var(--color-mist)]" cut="slide" id="sign-in">
      <div className={sectionClass}>
        <div data-reveal>
          <h2 className={titleClass}><TwoTone text={entry.title} /></h2>
          <p className={`${bodyClass} mt-7`}>{entry.description}</p>
        </div>
        <div className="mt-10 grid grid-cols-4 gap-3 max-[1100px]:grid-cols-2 max-[620px]:grid-cols-1" data-arrive>
          {entry.items.map((item) => {
            const Icon = entryIcons[item.icon];
            return (
              <div className="rounded-[16px] border border-[rgba(11,17,22,0.1)] bg-white p-6" data-reveal key={item.title}>
                <Icon aria-hidden="true" className="h-6 w-6 text-[var(--color-blue)]" strokeWidth={1.5} />
                <h3 className="m-0 mt-4 text-[1.08rem] font-semibold text-[var(--color-ink)]">{item.title}</h3>
                <p className="mb-0 mt-3 text-[0.88rem] leading-[1.58] text-[var(--color-muted)]">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </ArrivingSection>
  );
}

function HostingSection({ hosting }: { hosting: SecurityPageContent["hosting"] }) {
  return (
    <ArrivingSection className={darkSurfaceClass} cut="wipe" id="hosting">
      <div className={sectionClass}>
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(26rem,1fr)] items-start gap-[clamp(3rem,6vw,6rem)] max-[980px]:grid-cols-1">
          <div data-reveal="left">
            <h2 className={darkTitleClass}><TwoTone text={hosting.title} /></h2>
            <p className={`${darkBodyClass} mt-7`}>{hosting.description}</p>
            <div className="mt-9 grid gap-3">
              {hosting.options.map((option) => (
                <div className="rounded-[14px] border border-white/12 bg-white/[0.04] p-5" key={option.title}>
                  <h3 className="m-0 text-[1.08rem] font-semibold text-white">{option.title}</h3>
                  <p className="mb-0 mt-2 text-[0.92rem] leading-[1.6] text-white/60">{option.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div data-reveal="right">
            <h3 className="m-0 text-[clamp(1.4rem,2.4vw,1.9rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-white">{hosting.backups.title}</h3>
            <ol className="relative m-0 mt-6 list-none p-0 before:absolute before:bottom-6 before:left-[7px] before:top-6 before:w-px before:bg-white/15">
              {hosting.backups.stages.map((stage) => (
                <li className="relative border-t border-white/[0.07] py-[1.05rem] pl-8 first:border-t-0" key={stage.title}>
                  <span aria-hidden="true" className="absolute left-0 top-[1.4rem] z-[1] h-[15px] w-[15px] rounded-full border-[1.5px] border-[var(--color-blue-soft)] bg-[var(--color-surface-dark)]" />
                  <p className="m-0 text-[1.05rem] font-medium tracking-[-0.01em] text-white">{stage.title}</p>
                  <p className="mb-0 mt-1 text-[0.88rem] leading-[1.55] text-white/55">{stage.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </ArrivingSection>
  );
}

export function SecurityFeaturePage({ content, locale, primaryHref, secondaryHref }: SecurityFeaturePageProps) {
  return (
    <>
      <LandingHero description={content.hero.description} primaryCta={content.hero.primaryCta} primaryHref={primaryHref} secondaryCta={content.hero.secondaryCta} secondaryHref={secondaryHref} title={content.hero.title} visualMode="edge">
        <HeroEdgeVisual image={content.hero.image} />
      </LandingHero>

      <ProblemSection problem={content.problem} />
      <ViewsSection views={content.views} />
      <ScenariosSection scenarios={content.scenarios} />
      <LayersSection layers={content.layers} />
      <AuditSection audit={content.audit} />
      <QuestionsSection questions={content.questions} />
      <GroupSection group={content.group} />
      <EntrySection entry={content.entry} />
      <HostingSection hosting={content.hosting} />

      <FeatureFaqSection faq={content.faq} />
      <FeatureRelatedSection locale={locale} related={content.related} />
      <ArrivingSection cut="open">
        <div data-arrive>
          <FeatureFinalCtaSection finalCta={content.finalCta} primaryHref={primaryHref} />
        </div>
      </ArrivingSection>
    </>
  );
}
