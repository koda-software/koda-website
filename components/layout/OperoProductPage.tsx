import Link from "next/link";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right.mjs";
import type { NavSubItem, OperoProductContent } from "@/content/types";
import type { FeatureKey } from "@/lib/i18n/features";
import {
  FinalCtaPanel,
  PageHero,
} from "@/components/landing/LandingPrimitives";
import { ArrivingSection } from "@/components/landing/ArrivingSection";
import { ComparisonSlider } from "@/components/landing/ComparisonSlider";
import { FlowField } from "@/components/landing/FlowField";
import { Reveal } from "@/components/landing/Reveal";
import { SolutionScreenshotMock } from "@/components/landing/SolutionScreenshotMock";
import { OperoBuildStory } from "./OperoBuildStory";
import { TourJourney } from "./TourJourney";
import { TwoTone } from "@/components/landing/TwoTone";

type OperoProductPageProps = {
  content: OperoProductContent;
  featureLinks: NavSubItem[];
  primaryHref: string;
  secondaryHref: string;
};

const shellClass =
  "mx-auto w-[min(100%,var(--shell-width))] px-[var(--page-gutter)]";
const sectionClass = `${shellClass} py-[var(--section-y)]`;
const titleClass =
  "m-0 max-w-[880px] text-balance text-[clamp(2.15rem,4vw,3.35rem)] leading-[1.04] tracking-[-0.045em]";
const briefBaseClass = "m-0 text-[1rem] leading-[1.68]";
const briefClass = `${briefBaseClass} text-[var(--color-muted)]`;

type ProductTourItemKey = FeatureKey | "communication";

const storyStepIndexesByItem: Record<
  ProductTourItemKey,
  readonly number[]
> = {
  noCode: [0, 1],
  processes: [2, 4],
  documents: [5],
  lowCode: [3],
  integrations: [6],
  ai: [7],
  reports: [8],
  communication: [9],
  security: [10],
};

function SectionIntro({
  brief,
  invert = false,
  title,
}: {
  brief: string;
  /** For a graphite section, where the two also come out of its wipe. */
  invert?: boolean;
  title: string;
}) {
  const arrive = invert ? { "data-arrive": "" } : {};

  return (
    <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(18rem,0.5fr)] items-end gap-12 max-[900px]:grid-cols-1">
      <h2 className={`${titleClass} ${invert ? "text-white" : "text-[var(--color-ink)]"}`} {...arrive}><TwoTone text={title} /></h2>
      <p className={invert ? `${briefBaseClass} text-white/70` : briefClass} {...arrive}>{brief}</p>
    </div>
  );
}

export function OperoProductPage({
  content,
  featureLinks,
  primaryHref,
  secondaryHref,
}: OperoProductPageProps) {
  // One unbroken sequence, each with a single title. The route shows where the reader is in it.
  const tourFeatures = content.productTour.chapters.flatMap((chapter) => chapter.features);
  const tourStops = tourFeatures.flatMap((feature) => {
    if ("key" in feature) return [{ id: `section-${feature.key}`, label: feature.label }];
    const link = featureLinks.find((item) => item.feature === feature.feature);
    return link ? [{ id: `feature-${feature.feature}`, label: link.label }] : [];
  });

  return (
    <>
      <PageHero
        backgroundVisual={<FlowField />}
        description={content.hero.brief}
        fadeBottom
        primaryCta={content.hero.primaryCta}
        primaryHref={primaryHref}
        secondaryCta={content.hero.secondaryCta}
        secondaryHref="#product-tour"
        sectionClassName="!min-h-[calc(100svh-4.5rem)] !pb-0 !pt-0 max-[809px]:!pt-[5rem]"
        shellClassName="grid-cols-[minmax(0,0.72fr)_minmax(28rem,0.92fr)] gap-[clamp(2rem,5vw,5rem)] max-[1100px]:grid-cols-[minmax(0,0.75fr)_minmax(24rem,0.8fr)] max-[980px]:grid-cols-1"
        title={content.hero.title}
        titleClassName="max-w-[880px]"
        visualClassName="-mr-[clamp(2rem,8vw,9rem)] max-[980px]:mr-0 max-[980px]:mt-2"
      >
        <div className="relative -left-[clamp(2rem,3vw,4rem)] translate-y-[clamp(8rem,10vw,12rem)] max-[980px]:-left-[2%] max-[980px]:translate-y-[5.5rem]">
          <SolutionScreenshotMock
            alt={content.hero.visual.alt}
            className="w-[min(74rem,70vw)] max-w-none origin-center max-[1200px]:w-[min(64rem,68vw)] max-[980px]:w-[118%]"
            glowVariant="hero"
            height={1956}
            perspectiveVariant="hero"
            priority
            sizes="(min-width: 1200px) 70vw, (min-width: 981px) 68vw, 118vw"
            src="/hero/opero-kanban-hero.webp"
            width={2467}
          />
        </div>
      </PageHero>

      <ArrivingSection className="bg-[var(--color-mist)]" cut="card">
        <div className={sectionClass}>
          <Reveal>
            <SectionIntro
              brief={content.connectedModel.brief}
              title={content.connectedModel.title}
            />
          </Reveal>
          <Reveal className="mx-auto mt-[clamp(2rem,4vw,3.2rem)] w-full max-w-[82rem] px-[clamp(0.75rem,2.5vw,2.25rem)]">
            <ComparisonSlider
              afterAlt={content.connectedModel.comparison.afterAlt}
              afterLabel={content.connectedModel.comparison.afterLabel}
              afterSrc="/opero/customer-requests-comparison/tasks-board.webp"
              ariaLabel={content.connectedModel.comparison.ariaLabel}
              beforeAlt={content.connectedModel.comparison.beforeAlt}
              beforeLabel={content.connectedModel.comparison.beforeLabel}
              beforeSrc="/opero/customer-requests-comparison/list-view.webp"
              imageHeight={1391}
              imageWidth={1808}
              showLabels={false}
              title={content.connectedModel.comparison.title}
            />
          </Reveal>
        </div>
      </ArrivingSection>

      <TourJourney label={content.productTour.journeyLabel} stops={tourStops} />

      <section className={sectionClass} id="product-tour">
        <Reveal>
          <SectionIntro
            brief={content.productTour.brief}
            title={content.productTour.title}
          />
        </Reveal>

        <div className="mt-[clamp(4rem,9vw,8rem)] grid gap-[clamp(9rem,16vw,14rem)]">
          {tourFeatures.map((feature, featureIndex) => {
            const featureKey =
              "feature" in feature ? feature.feature : null;
            const itemKey: ProductTourItemKey =
              "feature" in feature ? feature.feature : feature.key;
            const link = featureKey
              ? featureLinks.find((item) => item.feature === featureKey)
              : null;

            if (featureKey && !link) {
              return null;
            }

            const itemLabel =
              link?.label ?? ("label" in feature ? feature.label : "");
            const reverse = featureIndex % 2 === 1;
            const emphasizeVisual =
              featureKey === "integrations" || itemKey === "communication";
            const enlargeVisual = featureKey === "documents";
            const storyStepIndexes = storyStepIndexesByItem[itemKey];

            return (
              <article
                className={`grid items-center max-[900px]:grid-cols-1 ${
                  emphasizeVisual
                    ? "grid-cols-[minmax(16rem,0.56fr)_minmax(0,1.14fr)] gap-[clamp(2rem,4vw,4rem)]"
                    : enlargeVisual
                      ? "grid-cols-[minmax(17rem,0.78fr)_minmax(0,0.96fr)] gap-[clamp(2rem,5vw,5rem)]"
                    : "grid-cols-[minmax(0,1.05fr)_minmax(18rem,0.68fr)] gap-[clamp(2rem,6vw,6rem)]"
                }`}
                id={featureKey ? `feature-${featureKey}` : `section-${itemKey}`}
                key={itemKey}
              >
                <div className={reverse ? "order-2 max-[900px]:order-1" : ""}>
                  <OperoBuildStory
                    content={content.connectedModel.story}
                    stepIndexes={storyStepIndexes}
                  />
                </div>
                <Reveal className={reverse ? "order-1 max-[900px]:order-2" : ""} from={reverse ? "left" : "right"}>
                  <h3 className="m-0 text-[clamp(1.55rem,2.8vw,2.2rem)] leading-[1.12] tracking-[-0.035em] text-[var(--color-ink)]">
                    {itemLabel}
                  </h3>
                  <p className={`${briefClass} mt-5 max-w-[34rem]`}>
                    {feature.brief}
                  </p>
                  {link ? (
                    <Link
                      className="group mt-6 inline-flex items-center gap-2 font-medium text-[var(--color-ink)]"
                      href={link.href}
                    >
                      {content.productTour.exploreLabel}
                      <ArrowRightIcon
                        className="h-4 w-4 text-[var(--color-blue)] transition-transform group-hover:translate-x-1"
                        strokeWidth={1.7}
                        aria-hidden="true"
                      />
                    </Link>
                  ) : null}
                </Reveal>
              </article>
            );
          })}
        </div>
      </section>

      {/* Graphite, and arriving as a wipe, because this is the section about changing the workspace's look. */}
      <ArrivingSection className="bg-[var(--color-surface-dark)] [background-image:var(--gradient-hero)]" cut="wipe">
        <div className={sectionClass}>
          <SectionIntro
            brief={content.customization.brief}
            invert
            title={content.customization.title}
          />
          <div className="mx-auto mt-[clamp(2rem,4vw,3.2rem)] w-full max-w-[82rem] px-[clamp(0.75rem,2.5vw,2.25rem)]" data-arrive="slide">
            <ComparisonSlider
              afterAlt={content.customization.comparison.afterAlt}
              afterLabel={content.customization.comparison.afterLabel}
              afterSrc="/opero/customization/branded-dark-workspace.webp"
              ariaLabel={content.customization.comparison.ariaLabel}
              beforeAlt={content.customization.comparison.beforeAlt}
              beforeLabel={content.customization.comparison.beforeLabel}
              beforeSrc="/opero/customization/default-workspace.webp"
              imageHeight={1223}
              imageWidth={1869}
              scrollRevealDistance={100}
              showLabels={false}
              title={content.customization.comparison.title}
            />
          </div>
        </div>
      </ArrivingSection>

      <ArrivingSection cut="curtain">
        <div className={sectionClass}>
          <div data-arrive>
            <FinalCtaPanel
              description={content.finalCta.brief}
              primaryCta={content.finalCta.primaryCta}
              primaryHref={primaryHref}
              secondaryCta={content.finalCta.secondaryCta}
              secondaryHref={secondaryHref}
              title={content.finalCta.title}
            />
          </div>
        </div>
      </ArrivingSection>
    </>
  );
}
