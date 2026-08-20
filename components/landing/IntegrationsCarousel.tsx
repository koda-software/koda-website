"use client";

import Image from "next/image";
import BadgeCheckIcon from "lucide-react/dist/esm/icons/badge-check.mjs";
import Building2Icon from "lucide-react/dist/esm/icons/building-2.mjs";
import MailCheckIcon from "lucide-react/dist/esm/icons/mail-check.mjs";
import MessageSquareTextIcon from "lucide-react/dist/esm/icons/message-square-text.mjs";
import PenLineIcon from "lucide-react/dist/esm/icons/pen-line.mjs";
import ReceiptTextIcon from "lucide-react/dist/esm/icons/receipt-text.mjs";
import type { HomeIntegrationItem } from "@/content/types";
import { SnapCarousel } from "./SnapCarousel";
import styles from "./IntegrationsCarousel.module.css";

type IntegrationsCarouselProps = {
  fadeColor?: string;
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
    <article className={styles.integrationCard}>
      <div className={styles.identity}>
        <span className={`${styles.mark} ${
          item.logoSrc
            ? styles.logoMark
            : `${styles.iconMark} ${toneClass[item.tone]}`
        }`}>
          {item.logoSrc ? (
            <Image alt="" className={styles.logoImage} height={37} src={item.logoSrc} width={116} />
          ) : (
            <Icon className="h-4 w-4" strokeWidth={1.7} />
          )}
        </span>
        {item.logoSrc ? null : (
          <h3 className={styles.integrationName}>
            {item.name}
          </h3>
        )}
      </div>
      <p className={styles.integrationDescription}>
        {item.description}
      </p>
    </article>
  );
}

export function IntegrationsCarousel({ fadeColor, items }: IntegrationsCarouselProps) {
  return (
    <SnapCarousel
      ariaLabel="Integrations"
      className={styles.integrationCarousel}
      fadeColor={fadeColor}
      pauseMs={1000}
      scrollDurationMs={620}
    >
      {items.map((item) => (
        <IntegrationCard item={item} key={item.name} />
      ))}
    </SnapCarousel>
  );
}
