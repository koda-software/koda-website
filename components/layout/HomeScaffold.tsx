import BoxesIcon from "lucide-react/dist/esm/icons/boxes.mjs";
import BrainCircuitIcon from "lucide-react/dist/esm/icons/brain-circuit.mjs";
import ClipboardCheckIcon from "lucide-react/dist/esm/icons/clipboard-check.mjs";
import DatabaseIcon from "lucide-react/dist/esm/icons/database.mjs";
import HandshakeIcon from "lucide-react/dist/esm/icons/handshake.mjs";
import LayersIcon from "lucide-react/dist/esm/icons/layers.mjs";
import MapIcon from "lucide-react/dist/esm/icons/map.mjs";
import RefreshCwIcon from "lucide-react/dist/esm/icons/refresh-cw.mjs";
import SearchIcon from "lucide-react/dist/esm/icons/search.mjs";
import ShieldCheckIcon from "lucide-react/dist/esm/icons/shield-check.mjs";
import WorkflowIcon from "lucide-react/dist/esm/icons/workflow.mjs";
import ZapIcon from "lucide-react/dist/esm/icons/zap.mjs";
import type { HomeContent } from "@/content/types";
import {
  DarkStepGrid,
  IconTextGrid,
  NumberedPointGrid,
  PillarGrid,
} from "@/components/landing/LandingCards";
import {
  DarkPanel,
  FinalCtaPanel,
  LandingHero,
  LandingSection,
  SectionIntro,
} from "@/components/landing/LandingPrimitives";
import { Reveal } from "@/components/landing/Reveal";
import { HomeAiDemo } from "./demos/HomeAiDemo";
import { OperoFlowVisual } from "./OperoFlowVisual";
import { RecordDemo } from "./RecordDemo";

type HomeScaffoldProps = {
  content: HomeContent;
  primaryHref: string;
  secondaryHref: string;
};

const pillarIcons = [
  BoxesIcon,
  WorkflowIcon,
  BrainCircuitIcon,
  ShieldCheckIcon,
];
const workflowIcons = [
  MapIcon,
  LayersIcon,
  ZapIcon,
  ShieldCheckIcon,
  RefreshCwIcon,
];
const useCaseIcons = [
  HandshakeIcon,
  DatabaseIcon,
  ClipboardCheckIcon,
  SearchIcon,
];

export function HomeScaffold({
  content,
  primaryHref,
  secondaryHref,
}: HomeScaffoldProps) {
  return (
    <>
      <LandingHero
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        description={content.hero.description}
        primaryCta={content.hero.primaryCta}
        primaryHref={primaryHref}
        secondaryCta={content.hero.secondaryCta}
        secondaryHref={secondaryHref}
      >
        <RecordDemo content={content.hero.recordDemo} />
      </LandingHero>

      <LandingSection id="problem">
        <Reveal>
          <SectionIntro
            eyebrow={content.problem.label}
            title={content.problem.title}
            description={content.problem.description}
            split
          />
        </Reveal>
        <NumberedPointGrid points={content.problem.points} />
      </LandingSection>

      <LandingSection>
        <DarkPanel>
          <Reveal>
            <SectionIntro
              eyebrow={content.solution.label}
              title={content.solution.title}
              description={content.solution.description}
              invert
            />
          </Reveal>
          <OperoFlowVisual content={content.hero.visual} />
        </DarkPanel>
      </LandingSection>

      <LandingSection>
        <Reveal>
          <SectionIntro
            eyebrow={content.pillars.label}
            title={content.pillars.title}
            description={content.pillars.description}
          />
        </Reveal>
        <PillarGrid icons={pillarIcons} items={content.pillars.items} />
      </LandingSection>

      <LandingSection>
        <DarkPanel>
          <Reveal>
            <SectionIntro
              eyebrow={content.workflow.label}
              title={content.workflow.title}
              description={content.workflow.description}
              invert
              split
            />
          </Reveal>
          <DarkStepGrid icons={workflowIcons} steps={content.workflow.steps} />
        </DarkPanel>
      </LandingSection>

      <LandingSection className="grid items-start gap-[clamp(1.5rem,4vw,4rem)] grid-cols-[minmax(0,0.78fr)_minmax(20rem,1fr)] max-[809px]:grid-cols-1">
        <div>
          <Reveal>
            <SectionIntro
              eyebrow={content.ai.label}
              title={content.ai.title}
              description={content.ai.description}
            />
          </Reveal>
        </div>
        <div className="relative" aria-label={content.ai.label}>
          <Reveal from="right">
            <HomeAiDemo chat={content.ai.chat} />
          </Reveal>
        </div>
      </LandingSection>

      <LandingSection>
        <Reveal>
          <SectionIntro
            eyebrow={content.useCases.label}
            title={content.useCases.title}
            description={content.useCases.description}
          />
        </Reveal>
        <IconTextGrid icons={useCaseIcons} items={content.useCases.items} />
      </LandingSection>

      <LandingSection className="pt-0">
        <Reveal>
          <FinalCtaPanel
            eyebrow={content.finalCta.eyebrow}
            title={content.finalCta.title}
            description={content.finalCta.description}
            primaryCta={content.finalCta.primaryCta}
            primaryHref={primaryHref}
            secondaryCta={content.finalCta.secondaryCta}
            secondaryHref={secondaryHref}
          />
        </Reveal>
      </LandingSection>
    </>
  );
}
