import type { ReactNode } from "react";
import { Choreography } from "../Choreography";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

/**
 * Every page of the proposal: header, the page, footer, and the motion engine.
 *
 * Native scrolling throughout. The first proposal ran a smooth-scroll layer
 * over the page, which is what made some things "not scroll well": it moves
 * the content with a transform, takes over anchor links and trackpad inertia,
 * and lags behind the finger by design. A site people want to skim has to
 * scroll exactly like every other site they use.
 */
export function ProposalPage({ children }: { children: ReactNode }) {
  return (
    <div className="op">
      <SiteHeader />
      <main id="tresc">{children}</main>
      <SiteFooter />
      <Choreography />
    </div>
  );
}
