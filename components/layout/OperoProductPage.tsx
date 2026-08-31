import Link from "next/link";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right.mjs";
import type { NavSubItem, OperoProductContent } from "@/content/types";
import type { FeatureKey } from "@/lib/i18n/features";
import {
  FinalCtaPanel,
  PageHero,
} from "@/components/landing/LandingPrimitives";
import { ComparisonSlider } from "@/components/landing/ComparisonSlider";
import { SolutionScreenshotMock } from "@/components/landing/SolutionScreenshotMock";
import { OperoBuildStory } from "./OperoBuildStory";

type OperoProductPageProps = {
  content: OperoProductContent;
  featureLinks: NavSubItem[];
  primaryHref: string;
  secondaryHref: string;
};

const shellClass =
  "mx-auto w-[min(100%,var(--shell-width))] px-[var(--page-gutter)]";
const sectionClass = `${shellClass} py-[var(--section-y)]`;
const eyebrowClass =
  "mb-4 text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-blue)]";
const titleClass =
  "m-0 max-w-[880px] text-balance text-[clamp(2.15rem,4vw,3.35rem)] leading-[1.04] tracking-[-0.045em] text-[var(--color-ink)]";
const briefClass =
  "m-0 text-[1rem] font-light leading-[1.68] text-[var(--color-muted)]";

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
  eyebrow,
  title,
}: {
  brief: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(18rem,0.5fr)] items-end gap-12 max-[900px]:grid-cols-1">
      <div>
        <p className={eyebrowClass}>{eyebrow}</p>
        <h2 className={titleClass}>{title}</h2>
      </div>
      <p className={briefClass}>{brief}</p>
    </div>
  );
}

export function OperoProductPage({
  content,
  featureLinks,
  primaryHref,
  secondaryHref,
}: OperoProductPageProps) {
  return (
    <>
      <PageHero
        description={content.hero.brief}
        eyebrow={content.hero.eyebrow}
        primaryCta={content.hero.primaryCta}
        primaryHref={primaryHref}
        secondaryCta={content.hero.secondaryCta}
        secondaryHref="#product-tour"
        sectionClassName="!pb-0 !pt-0 max-[809px]:!pt-[5rem]"
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

      <section className={sectionClass}>
        <SectionIntro
          brief={content.connectedModel.brief}
          eyebrow={content.connectedModel.eyebrow}
          title={content.connectedModel.title}
        />
        <div className="mx-auto mt-[clamp(2rem,4vw,3.2rem)] w-full max-w-[82rem] px-[clamp(0.75rem,2.5vw,2.25rem)]">
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
        </div>
      </section>

      <section className={sectionClass} id="product-tour">
        <SectionIntro
          brief={content.productTour.brief}
          eyebrow={content.productTour.eyebrow}
          title={content.productTour.title}
        />

        <div className="mt-[clamp(4rem,9vw,8rem)] grid gap-[clamp(12rem,22vw,18rem)]">
          {content.productTour.chapters.map((chapter) => (
            <section key={chapter.eyebrow}>
              <div className="grid grid-cols-[minmax(13rem,0.45fr)_minmax(0,1fr)] gap-10 border-t border-[rgba(2,2,13,0.14)] pt-7 max-[809px]:grid-cols-1">
                <p className={`${eyebrowClass} mb-0`}>{chapter.eyebrow}</p>
                <div>
                  <h3 className="m-0 max-w-[760px] text-balance text-[clamp(1.8rem,3.2vw,2.65rem)] leading-[1.08] tracking-[-0.04em] text-[var(--color-ink)]">
                    {chapter.title}
                  </h3>
                  <p className={`${briefClass} mt-4 max-w-[720px]`}>
                    {chapter.brief}
                  </p>
                </div>
              </div>

              <div className="mt-10 grid gap-[clamp(8rem,14vw,12rem)]">
                {chapter.features.map((feature, featureIndex) => {
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
                      <div className={reverse ? "order-1 max-[900px]:order-2" : ""}>
                        <h4 className="m-0 text-[clamp(1.55rem,2.8vw,2.2rem)] leading-[1.12] tracking-[-0.035em] text-[var(--color-ink)]">
                          {itemLabel}
                        </h4>
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
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className={sectionClass}>
        <SectionIntro
          brief={content.customization.brief}
          eyebrow={content.customization.eyebrow}
          title={content.customization.title}
        />
        <div className="mx-auto mt-[clamp(2rem,4vw,3.2rem)] w-full max-w-[82rem] px-[clamp(0.75rem,2.5vw,2.25rem)]">
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
      </section>

      <section className={`${sectionClass} pt-0`}>
        <FinalCtaPanel
          description={content.finalCta.brief}
          eyebrow={content.finalCta.eyebrow}
          primaryCta={content.finalCta.primaryCta}
          primaryHref={primaryHref}
          secondaryCta={content.finalCta.secondaryCta}
          secondaryHref={secondaryHref}
          title={content.finalCta.title}
        />
      </section>
    </>
  );
}
