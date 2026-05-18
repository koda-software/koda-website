import Link from "next/link";
import type { PlaceholderPageContent } from "@/content/types";

type PlaceholderPageProps = {
  content: PlaceholderPageContent;
  homeHref: string;
};

export function PlaceholderPage({ content, homeHref }: PlaceholderPageProps) {
  return (
    <section className="min-h-[70vh] bg-[var(--color-paper)] px-[var(--page-gutter)] pb-[var(--section-y)] pt-[clamp(8rem,13vw,12rem)] text-[var(--color-ink)]">
      <div className="mx-auto w-[min(100%,var(--shell-width))]">
        <p className="mb-4 font-sans text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-blue)]">{content.eyebrow}</p>
        <h1 className="m-0 max-w-[880px] text-[clamp(3.2rem,7vw,5.25rem)] leading-none tracking-[-0.055em] max-[809px]:text-[clamp(3rem,15vw,4.1rem)]">
          {content.title}
        </h1>
        <p className="mt-6 max-w-[760px] text-[clamp(1.05rem,2vw,1.35rem)] leading-[1.55] text-[var(--color-muted)]">{content.description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-button)] bg-[linear-gradient(135deg,#1f7cff,#004fc4)] px-4 py-3 font-medium text-[var(--color-paper)] transition-colors duration-150" href={homeHref}>
            {content.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
