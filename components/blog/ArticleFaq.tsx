import type { ReactNode } from "react";
import ChevronDownIcon from "lucide-react/dist/esm/icons/chevron-down.mjs";
import { type FaqInline, parseFaqAnswer } from "@/lib/blog/faq";
import { isExternalHref } from "@/lib/blog/links";
import type { ArticleFaqItem } from "@/lib/blog/types";

type ArticleFaqProps = {
  items: ArticleFaqItem[];
  title: string;
};

function renderInline(nodes: FaqInline[]): ReactNode[] {
  return nodes.map((node, index) => {
    switch (node.type) {
      case "text":
        return node.text;
      case "br":
        return <br key={index} />;
      case "strong":
        return <strong key={index}>{renderInline(node.children)}</strong>;
      case "em":
        return <em key={index}>{renderInline(node.children)}</em>;
      case "link": {
        const external = isExternalHref(node.href);

        return (
          <a href={node.href} key={index} rel={external ? "noopener noreferrer" : undefined} target={external ? "_blank" : undefined}>
            {renderInline(node.children)}
          </a>
        );
      }
    }
  });
}

/**
 * The article's FAQ, under the text. Every item starts open so the answers are
 * on the page as written, readable without a click and matching the FAQPage
 * structured data; readers can still fold them away. Answers may carry links
 * and emphasis as inline HTML (see `lib/blog/faq.ts`).
 */
export function ArticleFaq({ items, title }: ArticleFaqProps) {
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="faq" className="mt-14">
      <h2 className="m-0 font-display text-[1.9rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--color-ink)]" id="faq">
        {title}
      </h2>
      <div className="mt-6 border-t border-[rgba(2,2,13,0.12)]">
        {items.map((item) => (
          <details className="group border-b border-[rgba(2,2,13,0.12)]" key={item.pytanie} open>
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
              <h3 className="m-0 font-display text-[1.15rem] font-semibold leading-[1.35] tracking-[-0.01em] text-[var(--color-ink)]">{item.pytanie}</h3>
              <ChevronDownIcon
                aria-hidden="true"
                className="mt-1 h-5 w-5 shrink-0 text-[var(--color-blue)] transition-transform duration-300 group-open:rotate-180"
                strokeWidth={1.6}
              />
            </summary>
            <div className="blog-prose pb-6 pr-10 max-[560px]:pr-0">
              {parseFaqAnswer(item.odpowiedz).map((paragraph, index) => (
                <p key={index}>{renderInline(paragraph)}</p>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
