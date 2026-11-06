import Link from "next/link";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right.mjs";
import ChevronDownIcon from "lucide-react/dist/esm/icons/chevron-down.mjs";
import CircleCheckIcon from "lucide-react/dist/esm/icons/circle-check.mjs";
import GaugeIcon from "lucide-react/dist/esm/icons/gauge.mjs";
import ImageIcon from "lucide-react/dist/esm/icons/image.mjs";
import type { NoCodePageContent } from "@/content/types";
import type { Locale } from "@/lib/i18n/config";
import { localizeFeaturePath } from "@/lib/i18n/features";
import { TwoTone } from "@/components/landing/TwoTone";

/** Shared building blocks of the long-form feature pages (no-code, contextual AI). */

export const shellClass = "mx-auto w-[min(100%,var(--shell-width))] px-[var(--page-gutter)]";
export const sectionClass = `${shellClass} py-[clamp(5.5rem,10vw,9rem)]`;
export const titleClass = "m-0 max-w-[940px] text-[clamp(2.15rem,4.4vw,3.9rem)] leading-[1.02] tracking-[-0.04em] text-[var(--color-ink)]";
export const bodyClass = "m-0 max-w-[46rem] text-[1.04rem] leading-[1.72] text-[var(--color-muted)]";

export function ScreenshotPlaceholder({ label, title }: { label: string; title: string }) {
  return (
    <div className="relative grid min-h-[clamp(22rem,42vw,36rem)] place-items-center overflow-hidden rounded-[var(--radius-panel)] border border-dashed border-[rgba(11,17,22,0.22)] bg-[linear-gradient(145deg,rgba(56,182,255,0.045),rgba(255,255,255,0.9))] p-8 text-center shadow-[0_28px_80px_rgba(20,45,64,0.09)]" data-reveal>
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(11,17,22,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(11,17,22,0.035)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="relative grid max-w-[24rem] justify-items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-full border border-[rgba(56,182,255,0.3)] bg-white text-[var(--color-blue)] shadow-[0_12px_32px_rgba(28,112,165,0.12)]">
          <ImageIcon aria-hidden="true" className="h-6 w-6" strokeWidth={1.5} />
        </span>
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-blue)]">{label}</span>
        <span className="text-[1.12rem] font-medium leading-[1.35] text-[var(--color-ink)]">{title}</span>
      </div>
    </div>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mb-0 mt-7 grid list-none gap-3 p-0">
      {items.map((item) => (
        <li className="flex gap-3 text-[0.91rem] leading-[1.55] text-[var(--color-ink-soft)]" key={item}>
          <CircleCheckIcon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-blue)]" strokeWidth={1.6} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function FeatureFaqSection({ faq }: { faq: NoCodePageContent["faq"] }) {
  return (
      <section className="border-y border-[rgba(11,17,22,0.1)] bg-[var(--color-paper-soft)]">
        <div className={sectionClass}>
          <h2 className={titleClass} data-reveal><TwoTone text={faq.title} /></h2>
          <div className="mt-10 border-t border-[rgba(11,17,22,0.12)]">
            {faq.items.map((item) => <details className="group border-b border-[rgba(11,17,22,0.12)] py-1" key={item.question}><summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-[1.05rem] font-medium text-[var(--color-ink)] [&::-webkit-details-marker]:hidden">{item.question}<ChevronDownIcon aria-hidden="true" className="h-5 w-5 shrink-0 text-[var(--color-blue)] transition-transform duration-300 group-open:rotate-180" strokeWidth={1.6} /></summary><p className={`${bodyClass} max-w-[54rem] pb-6 pr-10`}>{item.answer}</p></details>)}
          </div>
        </div>
      </section>
  );
}

export function FeatureRelatedSection({ locale, related }: { locale: Locale; related: NoCodePageContent["related"] }) {
  return (
      <section className={sectionClass}>
        <h2 className="m-0 text-[clamp(2rem,4vw,3.4rem)] leading-[1.04] tracking-[-0.035em] text-[var(--color-ink)]" data-reveal><TwoTone text={related.title} /></h2>
        <div className="mt-9 grid grid-cols-3 gap-3 max-[760px]:grid-cols-1">{related.items.map((item) => <Link className="group rounded-[16px] border border-[rgba(11,17,22,0.1)] p-6 transition-colors hover:border-[rgba(56,182,255,0.45)]" href={localizeFeaturePath(locale, item.feature)} key={item.feature}><div className="flex items-start justify-between gap-4"><h3 className="m-0 text-[1.08rem] font-semibold text-[var(--color-ink)]">{item.title}</h3><ArrowRightIcon aria-hidden="true" className="h-5 w-5 shrink-0 text-[var(--color-blue)] transition-transform group-hover:translate-x-1" /></div><p className="mb-0 mt-3 text-[0.85rem] leading-[1.55] text-[var(--color-muted)]">{item.description}</p></Link>)}</div>
      </section>
  );
}

export function FeatureFinalCtaSection({ finalCta, primaryHref }: { finalCta: NoCodePageContent["finalCta"]; primaryHref: string }) {
  return (
      <section className={`${sectionClass} pt-0`}>
        <div className="relative overflow-hidden rounded-[var(--radius-panel)] [background:var(--gradient-final-cta)] px-[clamp(1.5rem,6vw,5rem)] py-[clamp(3.5rem,7vw,6rem)] text-center text-white">
          <GaugeIcon aria-hidden="true" className="absolute -right-16 -top-20 h-72 w-72 text-white/[0.045]" strokeWidth={0.8} />
          <h2 className="relative mx-auto m-0 max-w-[900px] text-[clamp(2rem,4.4vw,3.8rem)] leading-[1.04] tracking-[-0.035em]"><TwoTone text={finalCta.title} /></h2><p className="relative mx-auto mb-0 mt-7 max-w-[700px] text-[1.02rem] font-display font-light leading-[1.72] text-white/65">{finalCta.description}</p>
          <div className="relative mt-9 flex flex-wrap justify-center gap-3"><Link className="action action-mist" href={primaryHref}>{finalCta.primaryCta}</Link><Link className="action action-line-dark" href={primaryHref}>{finalCta.secondaryCta}</Link></div>
        </div>
      </section>
  );
}
