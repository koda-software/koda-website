import Link from "next/link";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right.mjs";
import BadgeCheckIcon from "lucide-react/dist/esm/icons/badge-check.mjs";
import BanknoteIcon from "lucide-react/dist/esm/icons/banknote.mjs";
import Building2Icon from "lucide-react/dist/esm/icons/building-2.mjs";
import CalendarDaysIcon from "lucide-react/dist/esm/icons/calendar-days.mjs";
import CheckIcon from "lucide-react/dist/esm/icons/check.mjs";
import CoinsIcon from "lucide-react/dist/esm/icons/coins.mjs";
import FileCodeIcon from "lucide-react/dist/esm/icons/file-code.mjs";
import FileSpreadsheetIcon from "lucide-react/dist/esm/icons/file-spreadsheet.mjs";
import GiftIcon from "lucide-react/dist/esm/icons/gift.mjs";
import HourglassIcon from "lucide-react/dist/esm/icons/hourglass.mjs";
import LandmarkIcon from "lucide-react/dist/esm/icons/landmark.mjs";
import LockKeyholeIcon from "lucide-react/dist/esm/icons/lock-keyhole.mjs";
import MailCheckIcon from "lucide-react/dist/esm/icons/mail-check.mjs";
import PercentIcon from "lucide-react/dist/esm/icons/percent.mjs";
import ScaleIcon from "lucide-react/dist/esm/icons/scale.mjs";
import ShieldCheckIcon from "lucide-react/dist/esm/icons/shield-check.mjs";
import WholeWordIcon from "lucide-react/dist/esm/icons/whole-word.mjs";
import { PageHero } from "@/components/landing/LandingPrimitives";
import type { ToolsIndexContent } from "@/content/types";
import type { ToolKey } from "@/lib/i18n/tools";
import { OperoBand } from "./OperoBand";
import { ToolFaq, toolBodyClass, toolSectionTitleClass, toolShellClass } from "./toolPrimitives";
import type { ToolLink } from "./ToolPage";

type IndexToolLink = ToolLink & { tool: ToolKey };

const toolIcons: Record<ToolKey, typeof PercentIcon> = {
  vatCalculator: PercentIcon,
  nbpRate: CoinsIcon,
  amountInWords: WholeWordIcon,
  ksefViewer: FileCodeIcon,
  jpkViewer: FileSpreadsheetIcon,
  whiteList: ShieldCheckIcon,
  counterpartyCheck: Building2Icon,
  lateInterest: HourglassIcon,
  eDelivery: MailCheckIcon,
  salaryCalculator: BanknoteIcon,
  b2bVsEmployment: ScaleIcon,
  workingTime: CalendarDaysIcon,
};

/** Matched to `content.trust` by position. */
const trustIcons = [GiftIcon, LandmarkIcon, LockKeyholeIcon, BadgeCheckIcon];


/**
 * The tools landing page: the tools grouped by job, each with a card that says what it
 * does, then why the tools can be trusted, questions and the Opero pitch.
 *
 * All of it is server-rendered text, so every tool name, description and heading is
 * in the HTML that search engines read.
 */
export function ToolsIndexPage({
  content,
  tools,
  ctas,
}: {
  content: ToolsIndexContent;
  tools: IndexToolLink[];
  ctas: { primary: string; secondary: string };
}) {
  const toolByKey = new Map(tools.map((tool) => [tool.tool, tool]));

  return (
    <>
      <PageHero
        description={content.hero.description}
        sectionClassName="!min-h-[22rem] pb-[clamp(3rem,6vw,4.5rem)] pt-[clamp(7rem,11vw,9rem)]"
        title={content.hero.title}
      >
        <nav aria-label={content.jumpLabel} className="flex flex-wrap gap-2.5 lg:justify-end">
          {content.categories.map((category) => (
            <a
              className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[0.95rem] text-white transition-colors hover:border-white/35 hover:bg-white/[0.12]"
              href={`#${category.id}`}
              key={category.id}
            >
              {category.title}
              <span className="ml-2 text-[var(--color-muted-light)]">{category.tools.length}</span>
            </a>
          ))}
        </nav>
      </PageHero>

      <section aria-label={content.trust.map((item) => item.title).join(", ")} className={`${toolShellClass} pt-[clamp(2.5rem,5vw,3.5rem)]`}>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-x-8 gap-y-6 p-0">
          {content.trust.map((item, index) => {
            const Icon = trustIcons[index % trustIcons.length];
            return (
              <li className="flex gap-3.5" key={item.title}>
                <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-blue)]" />
                <div>
                  <p className="m-0 font-display text-[1.02rem] font-semibold text-[var(--color-ink)]">{item.title}</p>
                  <p className="m-0 mt-1 text-[0.94rem] leading-[1.55] text-[var(--color-muted)]">{item.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {content.categories.map((category, categoryIndex) => (
        <section
          aria-labelledby={`${category.id}-title`}
          className={`${toolShellClass} scroll-mt-20 ${categoryIndex === 0 ? "pb-[clamp(2.5rem,5vw,3.5rem)] pt-[clamp(3rem,6vw,4.5rem)]" : "py-[clamp(2.5rem,5vw,3.5rem)]"}`}
          id={category.id}
          key={category.id}
        >
          <div className="mb-8 max-w-[44rem]">
            <h2 className={toolSectionTitleClass} id={`${category.id}-title`}>
              {category.title}
            </h2>
            <p className={`${toolBodyClass} mt-3`}>{category.description}</p>
          </div>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(19rem,1fr))] gap-4 p-0">
            {category.tools.map((key) => {
              const tool = toolByKey.get(key);
              if (!tool) return null;
              const card = content.cards[key];
              const Icon = toolIcons[key];
              return (
                <li key={key}>
                  <Link
                    className="group flex h-full flex-col rounded-[var(--radius-card)] border border-[rgba(11,17,22,0.1)] bg-[var(--color-paper)] p-6 text-[var(--color-ink)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[rgba(11,17,22,0.24)] hover:shadow-[0_18px_40px_-24px_rgba(11,17,22,0.35)]"
                    href={tool.href}
                  >
                    <span className="flex items-center gap-3.5">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[0.75rem] bg-[rgba(11,17,22,0.05)] text-[var(--color-ink)] transition-colors group-hover:bg-[var(--color-ink)] group-hover:text-white">
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </span>
                      <h3 className="m-0 font-display text-[1.18rem] font-semibold leading-[1.25]">{tool.label}</h3>
                    </span>
                    <p className="m-0 mt-4 text-[0.98rem] leading-[1.6] text-[var(--color-muted)]">{card.description}</p>
                    <ul className="m-0 mt-4 grid list-none gap-1.5 p-0">
                      {card.highlights.map((highlight) => (
                        <li className="flex items-start gap-2 text-[0.92rem] text-[var(--color-ink)]" key={highlight}>
                          <CheckIcon aria-hidden="true" className="mt-[0.2rem] h-3.5 w-3.5 shrink-0 text-[var(--color-blue)]" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-auto flex items-center gap-2 pt-6 text-[0.95rem] font-semibold">
                      {content.cardCta}
                      <ArrowRightIcon aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <ToolFaq className={`${toolShellClass} mt-[clamp(1.5rem,3vw,2.5rem)] border-t border-[var(--color-border-light)] py-[clamp(3.5rem,7vw,5rem)]`} faq={content.faq} id="tools-faq" />

      <OperoBand
        body={content.opero.body}
        id="tools-opero"
        primary={{ label: content.opero.primaryCta, href: ctas.primary }}
        secondary={{ label: content.opero.secondaryCta, href: ctas.secondary }}
        title={content.opero.title}
      />
    </>
  );
}
