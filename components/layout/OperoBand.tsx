import Link from "next/link";
import ArrowRightIcon from "lucide-react/dist/esm/icons/arrow-right.mjs";
import CheckIcon from "lucide-react/dist/esm/icons/check.mjs";
import { toolShellClass } from "./toolPrimitives";

type OperoBandProps = {
  id: string;
  title: string;
  body: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  /** Shown as a row of cards under the pitch. */
  points?: Array<{ title: string; body: string }>;
};

/** The dark Opero pitch on the tool pages and the blog's listings: full width, the text kept in the page column. */
export function OperoBand({ id, title, body, primary, secondary, points }: OperoBandProps) {
  return (
    <section aria-labelledby={id} className="isolate border-y border-white/8 bg-[var(--color-surface-dark)] [background-image:var(--gradient-hero)] text-white">
      <div className={`${toolShellClass} py-[clamp(4rem,8vw,5.5rem)]`}>
        <div className="flex flex-wrap items-end gap-x-16 gap-y-7">
          <div className="min-w-0 flex-[1_1_30rem]">
            <h2 className="m-0 text-[clamp(1.8rem,3vw,2.4rem)] leading-[1.12] tracking-[-0.03em] text-white" id={id}>
              {title}
            </h2>
            <p className="m-0 mt-4 max-w-[39rem] text-[1.06rem] leading-[1.7] text-[var(--color-muted-light)]">{body}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="action action-mist" href={primary.href}>
              {primary.label}
            </Link>
            <Link className="action action-line-dark" href={secondary.href}>
              {secondary.label}
              <ArrowRightIcon aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>
        {points?.length ? (
          <ul className="m-0 mt-10 grid list-none grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-4 p-0">
            {points.map((point) => (
              <li className="flex gap-3.5 rounded-[var(--radius-card)] border border-white/10 bg-white/[0.04] p-6" key={point.title}>
                <CheckIcon aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-[var(--color-muted-light)]" />
                <div>
                  <h3 className="m-0 font-display text-[1.08rem] font-semibold text-white">{point.title}</h3>
                  <p className="m-0 mt-2 text-[0.98rem] leading-[1.6] text-[var(--color-muted-light)]">{point.body}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
