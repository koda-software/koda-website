import { Ai } from "@/components/propozycja/scenes/Ai";
import { Build } from "@/components/propozycja/scenes/Build";
import { Control } from "@/components/propozycja/scenes/Control";
import { Foundation } from "@/components/propozycja/scenes/Foundation";
import { Hero } from "@/components/propozycja/scenes/Hero";
import { Process } from "@/components/propozycja/scenes/Process";
import { Scatter } from "@/components/propozycja/scenes/Scatter";
import { Together } from "@/components/propozycja/scenes/Together";
import { TwoTone } from "@/components/propozycja/blocks";
import { homeStory } from "@/components/propozycja/content-stories";
import { Scene } from "@/components/propozycja/Scene";
import { ProposalPage } from "@/components/propozycja/shell/ProposalPage";
import { Story } from "@/components/propozycja/Story";

export const dynamic = "force-static";

/**
 * Opero: the home page of the proposal.
 *
 * Eight chapters told as one process, read top to bottom.
 *
 * The planes alternate graphite and mist, and each arrival has its own cut:
 * the problem comes in as a card, the foundation as a diagonal wipe, the
 * process out of the foundation's own layer, the module showcase as a curtain
 * over it, AI as a change of colour, control as an iris, and the last chapter
 * opens from the bottom edge.
 */
export default function ProposalHome() {
  return (
    <ProposalPage>
      <Hero />
      <Scatter />
      <Foundation />
      <Process />
      {/* No cut: the drawn contract continues on the same plane into the real one. */}
      <Scene className="section" id="w-opero" prev="light" tone="light">
        <div className="section__head">
          <TwoTone lines={homeStory.title} />
        </div>
        <Story steps={homeStory.steps} />
      </Scene>
      <Build />
      <Ai />
      <Control />
      <Together />
    </ProposalPage>
  );
}
