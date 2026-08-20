import Link from "next/link";
import type { BlogUiContent } from "@/content/types";
import { blogIndexPath } from "@/lib/blog/routes";
import type { BlogLocale } from "@/lib/blog/types";
import { blogDarkEyebrowClass, blogPrimaryButtonClass } from "./primitives";
import { HeroShell } from "@/components/landing/LandingPrimitives";

/**
 * Shared 404 body for every blog route. Rendered inside `PageShell`, so the
 * header, footer and language switcher stay in place.
 */
export function BlogNotFound({ locale, ui }: { locale: BlogLocale; ui: BlogUiContent }) {
  return (
    <HeroShell className="pb-[7rem] pt-[10rem] max-[809px]:pt-[8rem]" photo="workspace">
      <div className="relative z-[1] mx-auto w-[min(100%,var(--shell-width))] max-w-[760px]">
        <p className={`${blogDarkEyebrowClass} mb-4`}>404</p>
        <h1 className="m-0 text-[3.2rem] leading-[1.05] tracking-[-0.04em] max-[809px]:text-[2.1rem]">{ui.notFound.title}</h1>
        <p className="mt-6 text-[1.12rem] font-light leading-[1.6] text-white/72">{ui.notFound.description}</p>
        <Link className={`${blogPrimaryButtonClass} mt-8`} href={blogIndexPath(locale)}>
          {ui.notFound.backLabel}
        </Link>
      </div>
    </HeroShell>
  );
}
