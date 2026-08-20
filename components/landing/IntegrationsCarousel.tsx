import Image from "next/image";
import BadgeCheckIcon from "lucide-react/dist/esm/icons/badge-check.mjs";
import Building2Icon from "lucide-react/dist/esm/icons/building-2.mjs";
import MailCheckIcon from "lucide-react/dist/esm/icons/mail-check.mjs";
import MessageSquareTextIcon from "lucide-react/dist/esm/icons/message-square-text.mjs";
import PenLineIcon from "lucide-react/dist/esm/icons/pen-line.mjs";
import ReceiptTextIcon from "lucide-react/dist/esm/icons/receipt-text.mjs";
import type { HomeIntegrationItem } from "@/content/types";
import styles from "./IntegrationsCarousel.module.css";

type IntegrationsCarouselProps = {
  items: HomeIntegrationItem[];
};

const iconByKey = {
  invoice: ReceiptTextIcon,
  delivery: MailCheckIcon,
  registry: Building2Icon,
  sms: MessageSquareTextIcon,
  email: PenLineIcon,
  signature: BadgeCheckIcon,
} satisfies Record<HomeIntegrationItem["icon"], typeof ReceiptTextIcon>;

const toneClass = {
  sky: "border-[rgba(56,182,255,0.22)] bg-[rgba(56,182,255,0.1)] text-[var(--color-blue)]",
  violet: "border-[rgba(99,102,241,0.2)] bg-[rgba(99,102,241,0.09)] text-[#595bdc]",
  green: "border-[rgba(16,185,129,0.2)] bg-[rgba(16,185,129,0.09)] text-[#0f8b5d]",
  amber: "border-[rgba(245,158,11,0.22)] bg-[rgba(245,158,11,0.1)] text-[#a76008]",
  rose: "border-[rgba(244,63,94,0.18)] bg-[rgba(244,63,94,0.08)] text-[#be3455]",
  slate: "border-[rgba(15,23,42,0.12)] bg-[rgba(15,23,42,0.06)] text-[var(--color-ink-soft)]",
} satisfies Record<HomeIntegrationItem["tone"], string>;

function IntegrationCard({ item }: { item: HomeIntegrationItem }) {
  const Icon = iconByKey[item.icon];

  return (
    <article className={`${styles.integrationCard} shrink-0 rounded-[calc(var(--radius-panel)-14px)] border border-[rgba(2,2,13,0.08)] bg-white p-5 shadow-[0_18px_54px_-42px_rgba(2,2,13,0.34)]`}>
      <div className="flex items-center justify-start gap-2.5">
        <span className={`grid shrink-0 place-items-center rounded-[calc(var(--radius-button)+2px)] ${
          item.logoSrc
            ? "h-12 w-auto min-w-12 bg-white pr-1"
            : `h-10 w-10 border ${toneClass[item.tone]}`
        }`}>
          {item.logoSrc ? (
            <Image alt="" className="h-auto max-h-9 w-auto max-w-[7.25rem] object-contain" height={37} src={item.logoSrc} width={116} />
          ) : (
            <Icon className="h-4 w-4" strokeWidth={1.7} />
          )}
        </span>
        {item.logoSrc ? null : (
          <h3 className="m-0 text-[1.02rem] font-semibold leading-tight text-[var(--color-ink)]">
            {item.name}
          </h3>
        )}
      </div>
      <p className="mt-4 text-[0.86rem] font-light leading-[1.52] text-[var(--color-muted)]">
        {item.description}
      </p>
    </article>
  );
}

export function IntegrationsCarousel({ items }: IntegrationsCarouselProps) {
  const loopItems = [...items, ...items];

  return (
    <div className={styles.carouselMask}>
      <div className={styles.carouselTrack}>
        {loopItems.map((item, index) => (
          <IntegrationCard item={item} key={`${item.name}-${index}`} />
        ))}
      </div>
    </div>
  );
}
