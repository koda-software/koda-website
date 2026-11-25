/** Shared by the tools index, the tool pages and the Opero band that closes them. */
export const toolShellClass = "mx-auto w-[min(100%,1100px)] px-[var(--page-gutter)]";
export const toolSectionTitleClass = "m-0 text-[clamp(1.6rem,2.6vw,2rem)] leading-[1.15] tracking-[-0.03em] text-[var(--color-ink)]";
export const toolBodyClass = "m-0 text-[1.04rem] leading-[1.7] text-[var(--color-muted)]";

type ToolFaqProps = {
  faq: { title: string; items: Array<{ question: string; answer: string }> };
  id: string;
  className: string;
};

export function ToolFaq({ faq, id, className }: ToolFaqProps) {
  return (
    <section aria-labelledby={id} className={className}>
      <h2 className={`${toolSectionTitleClass} mb-6`} id={id}>
        {faq.title}
      </h2>
      <div>
        {faq.items.map((item, index) => (
          <details className="border-b border-[var(--color-border-light)] py-5" key={item.question} open={index === 0}>
            <summary className="cursor-pointer font-display text-[1.15rem] font-medium text-[var(--color-ink)]">{item.question}</summary>
            <p className={`${toolBodyClass} mt-3 max-w-[46rem]`}>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
