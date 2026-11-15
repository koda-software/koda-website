import { PageHero } from "@/components/landing/LandingPrimitives";
import type { ToolsIndexContent } from "@/content/types";
import { ToolLinkGrid, type ToolLink } from "./ToolPage";

/** The tools index: a banner and one card per live tool. */
export function ToolsIndexPage({ content, tools }: { content: ToolsIndexContent; tools: ToolLink[] }) {
  return (
    <>
      <PageHero
        description={content.hero.description}
        sectionClassName="!min-h-[19rem] pb-[clamp(3rem,6vw,4.5rem)] pt-[clamp(7rem,11vw,9rem)]"
        title={content.hero.title}
      />
      <section aria-label={content.navLabel} className="mx-auto w-[min(100%,1100px)] px-[var(--page-gutter)] py-[clamp(3.5rem,7vw,5rem)]">
        <ToolLinkGrid tools={tools} />
      </section>
    </>
  );
}
