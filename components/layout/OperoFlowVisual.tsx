import CheckIcon from "lucide-react/dist/esm/icons/check.mjs";
import { Reveal } from "@/components/landing/Reveal";
import type { HomeContent } from "@/content/types";

type OperoFlowVisualProps = {
  content: HomeContent["hero"]["visual"];
};

const flowStepClass =
  "relative grid content-start gap-4 rounded-[calc(var(--radius-panel)-10px)] border border-white/[0.09] bg-[#181b23]/80 p-[clamp(1.1rem,2.2vw,1.55rem)] shadow-[inset_0_1px_0_rgba(255,255,255,0.055),0_20px_55px_rgba(0,0,0,0.14)]";
const stepNumberClass =
  "block select-none font-sans text-[clamp(3.4rem,5.4vw,4.9rem)] font-semibold leading-[0.78] text-white/16";
const stepTitleClass =
  "m-0 text-[clamp(1.28rem,1.75vw,1.55rem)] font-medium leading-[1.1]";
const stepDescriptionClass =
  "mt-2 max-w-[28rem] text-[0.98rem] font-light leading-[1.58] text-white/64";
const chipBaseClass =
  "rounded-full border border-white/[0.1] px-4 py-2.5 font-sans text-[0.88rem] font-normal leading-none";
const mappingUnitBaseClass =
  "relative min-h-[6.4rem] overflow-hidden rounded-[calc(var(--radius-card)+2px)] border border-white/[0.1] bg-[#11141b]/72 px-4 py-4 font-sans text-[0.92rem] font-light leading-[1.4] text-white/74 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-[linear-gradient(90deg,transparent,rgba(126,231,255,0.42),transparent)] [&>i]:mb-3 [&>i]:flex [&>i]:h-7 [&>i]:w-7 [&>i]:items-center [&>i]:justify-center [&>i]:rounded-full [&>i]:border [&>i]:border-[rgba(56,182,255,0.26)] [&>i]:bg-[rgba(56,182,255,0.12)] [&>i>svg]:h-4 [&>i>svg]:w-4 [&>i>svg]:text-[var(--color-blue-soft)]";
const outcomeItemClass =
  "flex items-center gap-3 text-[0.96rem] font-light leading-[1.5] text-white/82";

function displayStepLabel(label: string) {
  return String(Number.parseInt(label, 10) || label);
}

export function OperoFlowVisual({ content }: OperoFlowVisualProps) {
  return (
    <div
      className="opero-flow mt-[clamp(2.4rem,4.8vw,3.6rem)] grid grid-cols-3 gap-[clamp(1rem,2vw,1.5rem)] font-sans max-[980px]:grid-cols-1"
      aria-label={content.steps.map((step) => step.title).join(" to ")}
    >
      <Reveal className="h-full" delay={0}>
        <article className={`${flowStepClass} h-full`}>
          <div className={stepNumberClass}>
            {displayStepLabel(content.steps[0].label)}
          </div>
          <div>
            <h3 className={stepTitleClass}>{content.steps[0].title}</h3>
            <p className={stepDescriptionClass}>
              {content.steps[0].description}
            </p>
          </div>
          <div className="mt-1 flex flex-wrap gap-2.5" aria-hidden="true">
            {content.questions.map((question) => (
              <span
                className={`${chipBaseClass} bg-[#222733]/72 text-white/72`}
                key={question}
              >
                {question}
              </span>
            ))}
          </div>
        </article>
      </Reveal>

      <Reveal className="h-full" delay={140}>
        <article className={`${flowStepClass} h-full`}>
          <div className={stepNumberClass}>
            {displayStepLabel(content.steps[1].label)}
          </div>
          <div>
            <h3 className={stepTitleClass}>{content.steps[1].title}</h3>
            <p className={stepDescriptionClass}>
              {content.steps[1].description}
            </p>
          </div>
          <div
            className="mt-1 grid grid-cols-2 gap-3 max-[520px]:grid-cols-1"
            aria-hidden="true"
          >
            {content.mappingItems.map((item) => (
              <span className={mappingUnitBaseClass} key={item}>
                <i>
                  <CheckIcon aria-hidden="true" strokeWidth={2.35} />
                </i>
                {item}
              </span>
            ))}
          </div>
        </article>
      </Reveal>

      <Reveal className="h-full" delay={280}>
        <article className={`${flowStepClass} h-full`}>
          <div className={stepNumberClass}>
            {displayStepLabel(content.steps[2].label)}
          </div>
          <div>
            <h3 className={stepTitleClass}>{content.steps[2].title}</h3>
            <p className={stepDescriptionClass}>
              {content.steps[2].description}
            </p>
          </div>
          <ul className="mt-1 grid list-none gap-3 p-0" aria-hidden="true">
            {content.outcomeItems.map((item) => (
              <li className={outcomeItemClass} key={item}>
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[rgba(56,182,255,0.16)] text-[var(--color-blue-soft)] ring-1 ring-[rgba(56,182,255,0.28)]">
                  <CheckIcon aria-hidden="true" size={15} strokeWidth={2.6} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </article>
      </Reveal>
    </div>
  );
}
